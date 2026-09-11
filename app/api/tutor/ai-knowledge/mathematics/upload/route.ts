import { NextRequest, NextResponse } from "next/server"

import { supabaseAdmin } from "@/lib/supabase-admin"

import {
  analyseZimsecMathPaper,
} from "@/lib/zimsec-math-ingestion"

import {
  getGeminiModelName,
} from "@/lib/gemini"

import {
  generateZimsecMathPatternAnalysis,
} from "@/lib/zimsec-math-pattern-analysis"

export const runtime = "nodejs"

const MAX_FILE_SIZE = 20 * 1024 * 1024

const STORAGE_BUCKET =
  "zimsec-math-papers"

type PaperType =
  | "Paper 1"
  | "Paper 2"

type SessionType =
  | "June"
  | "November"

function safeFileName(
  fileName: string,
): string {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
}

function calculatePositionBand(
  questionNumber: number,
): string {
  if (questionNumber <= 5) {
    return "Early"
  }

  if (questionNumber <= 10) {
    return "Early-Middle"
  }

  if (questionNumber <= 15) {
    return "Middle"
  }

  if (questionNumber <= 20) {
    return "Middle-Late"
  }

  return "Late"
}

function normaliseArray(
  value: unknown,
): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) =>
      String(item ?? "").trim(),
    )
    .filter(Boolean)
}

function normaliseOptionalString(
  value: unknown,
): string | null {
  const text = String(
    value ?? "",
  ).trim()

  return text || null
}

function normalisePaper(
  value: string,
): PaperType | null {
  if (
    value === "Paper 1" ||
    value === "Paper 2"
  ) {
    return value
  }

  return null
}

function normaliseSession(
  value: string,
): SessionType | null {
  if (
    value === "June" ||
    value === "November"
  ) {
    return value
  }

  return null
}

export async function POST(
  request: NextRequest,
) {
  let createdPaperId: string | null = null
  let storagePath: string | null = null

  try {
    /*
     * ----------------------------------------------------------
     * 1. Read multipart form data
     * ----------------------------------------------------------
     */

    const formData =
      await request.formData()

    const file =
      formData.get("file")

    const examYearValue =
      formData.get("examYear")

    const sessionValue =
      formData.get("session")

    const paperValue =
      formData.get("paper")

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please upload a PDF examination paper.",
          code:
            "ZIMSEC_MATH_FILE_REQUIRED",
          paperId: null,
        },
        { status: 400 },
      )
    }

    if (
      !file.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Only PDF examination papers are supported.",
          code:
            "ZIMSEC_MATH_PDF_REQUIRED",
          paperId: null,
        },
        { status: 400 },
      )
    }

    if (file.size <= 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The uploaded PDF is empty.",
          code:
            "ZIMSEC_MATH_EMPTY_FILE",
          paperId: null,
        },
        { status: 400 },
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The PDF is too large. Maximum allowed size is 20 MB.",
          code:
            "ZIMSEC_MATH_FILE_TOO_LARGE",
          paperId: null,
        },
        { status: 400 },
      )
    }

    const examYear =
      Number(examYearValue)

    if (
      !Number.isInteger(examYear) ||
      examYear < 1900 ||
      examYear > 2100
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please provide a valid examination year.",
          code:
            "ZIMSEC_MATH_INVALID_YEAR",
          paperId: null,
        },
        { status: 400 },
      )
    }

    const session =
      normaliseSession(
        String(
          sessionValue ?? "",
        ),
      )

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Session must be June or November.",
          code:
            "ZIMSEC_MATH_INVALID_SESSION",
          paperId: null,
        },
        { status: 400 },
      )
    }

    const paper =
      normalisePaper(
        String(
          paperValue ?? "",
        ),
      )

    if (!paper) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Paper must be Paper 1 or Paper 2.",
          code:
            "ZIMSEC_MATH_INVALID_PAPER",
          paperId: null,
        },
        { status: 400 },
      )
    }

    /*
     * ----------------------------------------------------------
     * 2. Read PDF into memory
     * ----------------------------------------------------------
     */

    const fileBuffer =
      Buffer.from(
        await file.arrayBuffer(),
      )

    const pdfBase64 =
      fileBuffer.toString(
        "base64",
      )

    /*
     * ----------------------------------------------------------
     * 3. CREATE THE STORAGE PATH FIRST
     * ----------------------------------------------------------
     *
     * This is the key fix for your current error.
     *
     * ai_zimsec_math_papers.storage_path is NOT NULL.
     *
     * Therefore we must always have a valid storage path before
     * inserting the paper record.
     */

    const timestamp =
      Date.now()

    const randomPart =
      Math.random()
        .toString(36)
        .slice(2, 10)

    const cleanedFileName =
      safeFileName(
        file.name,
      )

    storagePath =
      [
        "mathematics",
        String(examYear),
        session.toLowerCase(),
        paper
          .toLowerCase()
          .replace(/\s+/g, "-"),
        `${timestamp}-${randomPart}-${cleanedFileName}`,
      ].join("/")

    console.log(
      "ZIMSEC Mathematics storage path:",
      storagePath,
    )

    /*
     * ----------------------------------------------------------
     * 4. Upload PDF to Supabase Storage FIRST
     * ----------------------------------------------------------
     */

    const {
      error: storageUploadError,
    } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(
        storagePath,
        fileBuffer,
        {
          contentType:
            "application/pdf",
          upsert: false,
        },
      )

    if (storageUploadError) {
      throw new Error(
        `Failed to upload examination paper to storage: ${storageUploadError.message}`,
      )
    }

    /*
     * ----------------------------------------------------------
     * 5. Create the database paper record
     * ----------------------------------------------------------
     *
     * storage_path is explicitly supplied here.
     *
     * This fixes:
     *
     * null value in column "storage_path"
     */

    const title =
      `ZIMSEC O-Level Mathematics ${paper} - ${session} ${examYear}`

    const originalFileName =
      file.name

    const {
      data: createdPaper,
      error: createPaperError,
    } = await supabaseAdmin
      .from(
        "ai_zimsec_math_papers",
      )
      .insert({
        subject:
          "Mathematics",

        level:
          "O-Level",

        curriculum:
          "ZIMSEC",

        exam_year:
          examYear,

        session:
          session,

        paper:
          paper,

        title:
          title,

        original_file_name:
          originalFileName,

        storage_path:
          storagePath,

        file_size:
          file.size,

        mime_type:
          "application/pdf",

        extraction_status:
          "processing",

        extraction_error:
          null,

        question_count:
          0,

        processed_by_model:
          getGeminiModelName(),
      })
      .select(
        "id, storage_path",
      )
      .single()

    if (
      createPaperError ||
      !createdPaper
    ) {
      /*
       * The PDF has already been uploaded, but the DB record
       * failed. Clean up the orphaned storage file.
       */
      if (storagePath) {
        await supabaseAdmin.storage
          .from(STORAGE_BUCKET)
          .remove([
            storagePath,
          ])
          .catch(() => {
            // Do not hide the original DB error.
          })
      }

      throw new Error(
        `Failed to create examination paper record: ${
          createPaperError?.message ??
          "Unknown database error"
        }`,
      )
    }

    createdPaperId =
      createdPaper.id

    /*
     * ----------------------------------------------------------
     * 6. Send PDF to Gemini for complete question extraction
     * ----------------------------------------------------------
     */

    console.log(
      `Analysing ZIMSEC Mathematics ${paper}: ${examYear} ${session}`,
    )

    const extractedPaper =
      await analyseZimsecMathPaper({
        pdfBase64,
        examYear,
        session,
        paper,
      })

    if (
      !extractedPaper ||
      !Array.isArray(
        extractedPaper.questions,
      )
    ) {
      throw new Error(
        "Gemini did not return a valid list of Mathematics questions.",
      )
    }

    /*
     * ----------------------------------------------------------
     * 7. Validate and prepare questions
     * ----------------------------------------------------------
     */

    const validQuestions =
      extractedPaper.questions
        .filter(
          (question) =>
            Number.isInteger(
              question.question_number,
            ) &&
            String(
              question.question_text ?? "",
            ).trim() &&
            String(
              question.topic ?? "",
            ).trim(),
        )
        .map(
          (question) => ({
            paper_id:
              createdPaperId,

            question_number:
              question.question_number,

            question_label:
              normaliseOptionalString(
                question.question_label,
              ),

            question_text:
              String(
                question.question_text,
              ).trim(),

            topic:
              String(
                question.topic,
              ).trim(),

            subtopic:
              normaliseOptionalString(
                question.subtopic,
              ),

            concept_family:
              normaliseOptionalString(
                question.concept_family,
              ),

            question_family:
              normaliseOptionalString(
                question.question_family,
              ),

            variation_patterns:
              normaliseArray(
                question.variation_patterns,
              ),

            skills:
              normaliseArray(
                question.skills,
              ),

            question_type:
              normaliseOptionalString(
                question.question_type,
              ),

            difficulty:
              normaliseOptionalString(
                question.difficulty,
              ),

            marks:
              typeof question.marks ===
                "number" &&
              Number.isFinite(
                question.marks,
              )
                ? question.marks
                : null,

            paper_section:
              normaliseOptionalString(
                question.paper_section,
              ),

            mathematical_objects:
              normaliseArray(
                question.mathematical_objects,
              ),

            diagram_dependency:
              normaliseOptionalString(
                question.diagram_dependency,
              ),

            position_band:
              question.position_band?.trim() ||
              calculatePositionBand(
                question.question_number,
              ),

            source_page_start:
              typeof question.source_page_start ===
                "number"
                ? question.source_page_start
                : null,

            source_page_end:
              typeof question.source_page_end ===
                "number"
                ? question.source_page_end
                : null,

            ai_classification_confidence:
              typeof question.classification_confidence ===
                "number" &&
              Number.isFinite(
                question.classification_confidence,
              )
                ? Math.max(
                    0,
                    Math.min(
                      100,
                      Math.round(
                        question.classification_confidence,
                      ),
                    ),
                  )
                : null,
          }),
        )

    if (!validQuestions.length) {
      throw new Error(
        "No valid Mathematics questions were extracted from the uploaded PDF.",
      )
    }

    /*
     * Prevent duplicate question numbers from being inserted
     * if Gemini accidentally returns the same question twice.
     *
     * We keep the first valid occurrence.
     */
    const uniqueQuestionsMap =
      new Map<
        number,
        (typeof validQuestions)[number]
      >()

    for (const question of validQuestions) {
      if (
        !uniqueQuestionsMap.has(
          question.question_number,
        )
      ) {
        uniqueQuestionsMap.set(
          question.question_number,
          question,
        )
      }
    }

    const questionsToInsert =
      Array.from(
        uniqueQuestionsMap.values(),
      ).sort(
        (a, b) =>
          a.question_number -
          b.question_number,
      )

    /*
     * ----------------------------------------------------------
     * 8. Insert extracted questions
     * ----------------------------------------------------------
     */

    const {
      data: insertedQuestions,
      error: questionInsertError,
    } = await supabaseAdmin
      .from(
        "ai_zimsec_math_questions",
      )
      .insert(
        questionsToInsert,
      )
      .select("id")

    if (
      questionInsertError
    ) {
      throw new Error(
        `Failed to save extracted Mathematics questions: ${questionInsertError.message}`,
      )
    }

    const insertedQuestionCount =
      insertedQuestions?.length ??
      questionsToInsert.length

    /*
     * ----------------------------------------------------------
     * 9. Mark paper as completed
     * ----------------------------------------------------------
     */

    const {
      error: completePaperError,
    } = await supabaseAdmin
      .from(
        "ai_zimsec_math_papers",
      )
      .update({
        extraction_status:
          "completed",

        extraction_error:
          null,

        question_count:
          insertedQuestionCount,

        processed_by_model:
          getGeminiModelName(),

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        createdPaperId,
      )

    if (completePaperError) {
      throw new Error(
        `Failed to mark examination paper as completed: ${completePaperError.message}`,
      )
    }

    /*
     * ----------------------------------------------------------
     * 10. Refresh existing topic statistics
     * ----------------------------------------------------------
     *
     * Keep your existing RPC because other parts of the
     * knowledge-base page may still use those statistics.
     */

    const {
      error: statisticsError,
    } = await supabaseAdmin.rpc(
      "refresh_ai_zimsec_math_statistics",
    )

    if (statisticsError) {
      console.warn(
        "ZIMSEC Mathematics statistics refresh warning:",
        statisticsError.message,
      )
    }

    /*
     * ----------------------------------------------------------
     * 11. Rebuild recurring pattern analysis
     * ----------------------------------------------------------
     *
     * IMPORTANT:
     *
     * We rebuild the selected paper type against ALL completed
     * historical papers of that same paper type.
     *
     * Example:
     *
     * Upload 2025 November Paper 1
     *
     * ->
     * analyse 2025 Paper 1
     * + 2024 Paper 1
     * + 2023 Paper 1
     * + ...
     *
     * Paper 2 is kept separate.
     */

    const patternAnalysis =
      await generateZimsecMathPatternAnalysis({
        paper,
      })

    /*
     * ----------------------------------------------------------
     * 12. Final response
     * ----------------------------------------------------------
     */

    return NextResponse.json({
      success: true,

      message:
        `ZIMSEC O-Level Mathematics ${paper} uploaded, analysed and added to the prediction knowledge base successfully.`,

      paperId:
        createdPaperId,

      storagePath:
        storagePath,

      paper: {
        examYear,
        session,
        paper,
      },

      extraction: {
        questionsExtracted:
          insertedQuestionCount,

        model:
          getGeminiModelName(),
      },

      patternAnalysis: {
        papersAnalysed:
          patternAnalysis.papersAnalysed,

        questionsAnalysed:
          patternAnalysis.questionsAnalysed,

        questionPatternsCreated:
          patternAnalysis.questionPatternsCreated,

        aggregatePatternsCreated:
          patternAnalysis.aggregatePatternsCreated,
      },
    })
  } catch (error) {
    console.error(
      "ZIMSEC Mathematics upload error:",
      error,
    )

    /*
     * ----------------------------------------------------------
     * Mark failed paper
     * ----------------------------------------------------------
     */

    if (createdPaperId) {
      await supabaseAdmin
        .from(
          "ai_zimsec_math_papers",
        )
        .update({
          extraction_status:
            "failed",

          extraction_error:
            error instanceof Error
              ? error.message
              : "Unknown upload/analysis error",

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          createdPaperId,
        )
        .catch(() => {
          // Preserve original error.
        })
    }

    /*
     * ----------------------------------------------------------
     * Remove uploaded PDF if processing failed
     * ----------------------------------------------------------
     */

    if (
      storagePath &&
      createdPaperId
    ) {
      await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .remove([
          storagePath,
        ])
        .catch(() => {
          // Preserve original error.
        })
    }

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Failed to upload and analyse ZIMSEC Mathematics paper.",

        code:
          "ZIMSEC_MATH_UPLOAD_FAILED",

        paperId:
          createdPaperId,
      },
      { status: 500 },
    )
  }
}