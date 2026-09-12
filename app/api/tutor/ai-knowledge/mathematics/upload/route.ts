import {
  NextRequest,
  NextResponse,
} from "next/server"

import {
  supabaseAdmin,
} from "@/lib/supabase-admin"

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

const STORAGE_BUCKET =
  "zimsec-math-papers"

const MAX_FILE_SIZE =
  20 * 1024 * 1024

type PaperType =
  | "Paper 1"
  | "Paper 2"

function cleanText(
  value: unknown,
) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
}

function normalizePaper(
  value: unknown,
): PaperType | null {
  if (
    value === "Paper 1" ||
    value === "Paper 2"
  ) {
    return value
  }

  return null
}

function derivePositionBand(
  questionNumber: number,
) {
  if (
    questionNumber <= 5
  ) {
    return "Early"
  }

  if (
    questionNumber <= 10
  ) {
    return "Early-Middle"
  }

  if (
    questionNumber <= 15
  ) {
    return "Middle"
  }

  if (
    questionNumber <= 20
  ) {
    return "Middle-Late"
  }

  return "Late"
}

export async function POST(
  request: NextRequest,
) {
  let storagePath:
    | string
    | null = null

  let paperId:
    | string
    | null = null

  try {
    /*
     * ==========================================================
     * 1. READ FORM DATA
     * ==========================================================
     */

    const formData =
      await request.formData()

    const file =
      formData.get(
        "file",
      )

    const examYearRaw =
      formData.get(
        "examYear",
      )

    const session =
      cleanText(
        formData.get(
          "session",
        ),
      )

    const paper =
      normalizePaper(
        formData.get(
          "paper",
        ),
      )

    if (
      !file ||
      !(file instanceof File)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please select a PDF examination paper.",
        },
        { status: 400 },
      )
    }

    if (
      file.type !==
        "application/pdf" &&
      !file.name
        .toLowerCase()
        .endsWith(
          ".pdf",
        )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Only PDF examination papers are supported.",
        },
        { status: 400 },
      )
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The PDF is too large. Maximum allowed size is 20 MB.",
        },
        { status: 400 },
      )
    }

    const examYear =
      Number(
        examYearRaw,
      )

    if (
      !Number.isInteger(
        examYear,
      ) ||
      examYear < 2000 ||
      examYear >
        new Date().getFullYear() +
          1
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please provide a valid examination year.",
        },
        { status: 400 },
      )
    }

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please provide the examination session.",
        },
        { status: 400 },
      )
    }

    if (!paper) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please select Paper 1 or Paper 2.",
        },
        { status: 400 },
      )
    }

    /*
     * ==========================================================
     * 2. CONVERT FILE
     * ==========================================================
     */

    const arrayBuffer =
      await file.arrayBuffer()

    const pdfBuffer =
      Buffer.from(
        arrayBuffer,
      )

    const pdfBase64 =
      pdfBuffer.toString(
        "base64",
      )

    /*
     * ==========================================================
     * 3. CREATE STORAGE PATH
     *
     * storage_path is NOT NULL in the database.
     * Therefore upload Storage FIRST.
     * ==========================================================
     */

    const safeFileName =
      file.name
        .replace(
          /[^a-zA-Z0-9._-]/g,
          "_",
        )

    const uniqueId =
      crypto.randomUUID()

    storagePath =
      `mathematics/${examYear}/${session}/${paper.replace(/\s+/g, "-").toLowerCase()}/${uniqueId}-${safeFileName}`

    const {
      error:
        storageError,
    } =
      await supabaseAdmin
        .storage
        .from(
          STORAGE_BUCKET,
        )
        .upload(
          storagePath,
          pdfBuffer,
          {
            contentType:
              "application/pdf",

            upsert:
              false,
          },
        )

    if (
      storageError
    ) {
      throw new Error(
        `Failed to upload PDF to storage: ${storageError.message}`,
      )
    }

    /*
     * ==========================================================
     * 4. CREATE PAPER DATABASE RECORD
     * ==========================================================
     */

    const {
      data: paperRow,
      error:
        paperInsertError,
    } =
      await supabaseAdmin
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

          session,

          paper,

          title:
            `${examYear} ${session} ZIMSEC O-Level Mathematics ${paper}`,

          original_file_name:
            file.name,

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

          updated_at:
            new Date().toISOString(),
        })
        .select(
          "id",
        )
        .single()

    if (
      paperInsertError ||
      !paperRow
    ) {
      throw new Error(
        `Failed to create paper record: ${
          paperInsertError?.message ??
          "Unknown database error"
        }`,
      )
    }

    paperId =
      paperRow.id

    /*
     * ==========================================================
     * 5. ANALYSE ENTIRE PDF
     * ==========================================================
     *
     * analyseZimsecMathPaper expects:
     *
     * {
     *   pdfBase64,
     *   examYear,
     *   session,
     *   paper
     * }
     * ==========================================================
     */

    const analysed =
      await analyseZimsecMathPaper(
        {
          pdfBase64,

          examYear,

          session,

          paper,
        },
      )

    if (
      !analysed ||
      !Array.isArray(
        analysed.questions,
      )
    ) {
      throw new Error(
        "The AI ingestion engine did not return a valid question list.",
      )
    }

    /*
     * ==========================================================
     * 6. VALIDATE AND PREPARE QUESTIONS
     * ==========================================================
     */

    const questions =
      analysed.questions
        .filter(
          (question) =>
            Number.isInteger(
              Number(
                question.question_number,
              ),
            ) &&
            cleanText(
              question.question_text,
            ) &&
            cleanText(
              question.topic,
            ),
        )
        .map(
          (question) => ({
            paper_id:
              paperId,

            question_number:
              Number(
                question.question_number,
              ),

            question_label:
              cleanText(
                question.question_label,
              ) ||
              null,

            question_text:
              cleanText(
                question.question_text,
              ),

            topic:
              cleanText(
                question.topic,
              ),

            subtopic:
              cleanText(
                question.subtopic,
              ) ||
              null,

            concept_family:
              cleanText(
                question.concept_family,
              ) ||
              null,

            question_family:
              cleanText(
                question.question_family,
              ) ||
              null,

            variation_patterns:
              Array.isArray(
                question.variation_patterns,
              )
                ? question.variation_patterns
                    .map(
                      (value) =>
                        cleanText(
                          value,
                        ),
                    )
                    .filter(Boolean)
                : [],

            skills:
              Array.isArray(
                question.skills,
              )
                ? question.skills
                    .map(
                      (value) =>
                        cleanText(
                          value,
                        ),
                    )
                    .filter(Boolean)
                : [],

            question_type:
              cleanText(
                question.question_type,
              ) ||
              null,

            difficulty:
              cleanText(
                question.difficulty,
              ) ||
              null,

            marks:
              question.marks ===
                null ||
              question.marks ===
                undefined
                ? null
                : Number(
                    question.marks,
                  ),

            paper_section:
              cleanText(
                question.paper_section,
              ) ||
              null,

            mathematical_objects:
              Array.isArray(
                question.mathematical_objects,
              )
                ? question.mathematical_objects
                    .map(
                      (value) =>
                        cleanText(
                          value,
                        ),
                    )
                    .filter(Boolean)
                : [],

            diagram_dependency:
              cleanText(
                question.diagram_dependency,
              ) ||
              null,

            position_band:
              cleanText(
                question.position_band,
              ) ||
              derivePositionBand(
                Number(
                  question.question_number,
                ),
              ),

            source_page_start:
              question.source_page_start ??
              null,

            source_page_end:
              question.source_page_end ??
              null,

            ai_classification_confidence:
              question.classification_confidence ??
              null,
          }),
        )

    if (
      questions.length ===
      0
    ) {
      throw new Error(
        "No valid Mathematics questions were extracted from the PDF.",
      )
    }

    /*
     * ==========================================================
     * 7. SAVE QUESTIONS
     * ==========================================================
     */

    const {
      error:
        questionInsertError,
    } =
      await supabaseAdmin
        .from(
          "ai_zimsec_math_questions",
        )
        .insert(
          questions,
        )

    if (
      questionInsertError
    ) {
      throw new Error(
        `Failed to save extracted questions: ${questionInsertError.message}`,
      )
    }

    /*
     * ==========================================================
     * 8. MARK PAPER COMPLETED
     * ==========================================================
     */

    const {
      error:
        completeError,
    } =
      await supabaseAdmin
        .from(
          "ai_zimsec_math_papers",
        )
        .update({
          extraction_status:
            "completed",

          extraction_error:
            null,

          question_count:
            questions.length,

          processed_by_model:
            getGeminiModelName(),

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          paperId,
        )

    if (
      completeError
    ) {
      throw new Error(
        `Failed to complete paper processing: ${completeError.message}`,
      )
    }

    /*
     * ==========================================================
     * 9. REFRESH EXISTING STATISTICS
     * ==========================================================
     */

    const {
      error:
        statisticsError,
    } =
      await supabaseAdmin.rpc(
        "refresh_ai_zimsec_math_statistics",
      )

    if (
      statisticsError
    ) {
      console.error(
        "ZIMSEC statistics refresh warning:",
        statisticsError,
      )
    }

    /*
     * ==========================================================
     * 10. REBUILD AGGREGATE PATTERN ANALYSIS
     * ==========================================================
     */

    let patternAnalysis:
      | Awaited<
          ReturnType<
            typeof generateZimsecMathPatternAnalysis
          >
        >
      | null = null

    try {
      patternAnalysis =
        await generateZimsecMathPatternAnalysis(
          {
            paper,
          },
        )

      console.log(
        "ZIMSEC pattern analysis refreshed:",
        patternAnalysis,
      )
    } catch (patternError) {
      /*
       * The actual paper/question ingestion has succeeded.
       *
       * We report the pattern analysis warning rather
       * than pretending that the PDF itself failed.
       */
      console.error(
        "ZIMSEC pattern analysis warning:",
        patternError,
      )
    }

    /*
     * ==========================================================
     * 11. SUCCESS
     * ==========================================================
     */

    return NextResponse.json({
      success: true,

      message:
        "ZIMSEC Mathematics paper uploaded and analysed successfully.",

      paper: {
        id:
          paperId,

        examYear,

        session,

        paper,

        fileName:
          file.name,

        questionCount:
          questions.length,

        extractionStatus:
          "completed",
      },

      patternAnalysis:
        patternAnalysis
          ? {
              papersAnalysed:
                patternAnalysis.papersAnalysed,

              questionsAnalysed:
                patternAnalysis.questionsAnalysed,

              questionPatternsCreated:
                patternAnalysis.questionPatternsCreated,

              aggregatePatternsCreated:
                patternAnalysis.aggregatePatternsCreated,
            }
          : {
              status:
                "warning",

              message:
                "The paper was indexed successfully, but aggregate pattern analysis could not be refreshed. You can run the pattern analysis again later.",
            },
    })
  } catch (error) {
    console.error(
      "ZIMSEC Mathematics upload error:",
      error,
    )

    /*
     * ----------------------------------------------------------
     * MARK PAPER FAILED
     * ----------------------------------------------------------
     */

    if (paperId) {
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
              : "Unknown upload error",

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          paperId,
        )
    }

    /*
     * ----------------------------------------------------------
     * CLEAN STORAGE
     * ----------------------------------------------------------
     */

    if (
      storagePath
    ) {
      const {
        error:
          storageRemoveError,
      } =
        await supabaseAdmin
          .storage
          .from(
            STORAGE_BUCKET,
          )
          .remove([
            storagePath,
          ])

      if (
        storageRemoveError
      ) {
        console.error(
          "Failed to clean uploaded PDF from storage:",
          storageRemoveError,
        )
      }
    }

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Failed to upload and analyse the ZIMSEC Mathematics paper.",

        code:
          "ZIMSEC_UPLOAD_FAILED",
      },
      { status: 500 },
    )
  }
}