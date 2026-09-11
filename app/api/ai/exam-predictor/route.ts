import { NextRequest, NextResponse } from "next/server"

import { getAIStudentSession } from "@/lib/ai-auth"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { gemini, getGeminiModelName } from "@/lib/gemini"

export const runtime = "nodejs"

type RequestedPaper = "Paper 1" | "Paper 2" | "Both"

type HistoricalPaper = {
  id: string
  exam_year: number
  session: string
  paper: "Paper 1" | "Paper 2"
  title: string | null
  original_file_name: string | null
  question_count: number | null
}

type HistoricalQuestion = {
  id: string
  paper_id: string
  question_number: number
  question_label: string | null
  question_text: string
  topic: string | null
  subtopic: string | null
  concept_family: string | null
  question_family: string | null
  variation_patterns: string[] | null
  skills: string[] | null
  question_type: string | null
  difficulty: string | null
  marks: number | null
  paper_section: string | null
  mathematical_objects: string[] | null
  diagram_dependency: string | null
  position_band: string | null
  source_page_start: number | null
  source_page_end: number | null
  ai_classification_confidence: number | null
}

type PatternAnalysis = {
  id: string

  subject: string
  level: string
  curriculum: string

  paper: "Paper 1" | "Paper 2"

  topic: string
  subtopic: string | null
  concept_family: string | null

  pattern_type: string | null
  pattern_value: string | null

  position_min: number | null
  position_max: number | null
  position_average: number | null

  question_count: number
  papers_appeared: number

  appearance_rate: number

  total_marks: number
  average_marks: number

  years_seen: number[]
  question_positions: number[]

  question_styles: string[]
  skills: string[]
  example_question_ids: string[]

  frequency_score: number
  recency_score: number
  position_score: number
  style_score: number
  skill_score: number
  mark_weight_score: number

  prediction_score: number

  pattern_strength: "Weak" | "Moderate" | "Strong" | null

  updated_at: string | null
}

type EvidenceQuestion = {
  id: string
  year: number
  session: string
  paper: string

  question_number: number
  question_label: string | null

  question_text: string

  topic: string
  subtopic: string

  concept_family: string
  question_family: string

  variation_patterns: string[]
  skills: string[]

  question_type: string
  difficulty: string

  marks: number

  paper_section: string

  diagram_dependency: string
  position_band: string
}

type GeminiPrediction = {
  paper: "Paper 1" | "Paper 2"

  topic: string
  subtopic?: string

  concept_family?: string
  question_family?: string

  prediction_score?: number
  confidence?: string | number

  historical_frequency?: number
  recency_score?: number
  position_score?: number
  variation_score?: number
  skill_score?: number
  mark_weight_score?: number

  reasoning?: string

  likely_question_styles?: string[]

  revision_advice?: string
}

function clamp(
  value: number,
  min = 0,
  max = 100,
) {
  return Math.max(
    min,
    Math.min(max, value),
  )
}

function normalizeText(value: unknown) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
}

function normalizePaper(
  value: unknown,
): RequestedPaper | null {
  if (
    value === "Paper 1" ||
    value === "Paper 2" ||
    value === "Both"
  ) {
    return value
  }

  return null
}

function toNumber(
  value: unknown,
  fallback = 0,
) {
  const number = Number(value)

  return Number.isFinite(number)
    ? number
    : fallback
}

/**
 * Convert the evidence score into the exact
 * confidence values accepted by ai_predictions.
 */
function confidenceFromScore(
  score: number,
): "Low" | "Medium" | "High" {
  if (score >= 75) {
    return "High"
  }

  if (score >= 50) {
    return "Medium"
  }

  return "Low"
}

function uniqueStrings(
  values: unknown,
) {
  if (!Array.isArray(values)) {
    return []
  }

  return Array.from(
    new Set(
      values
        .map((value) =>
          normalizeText(value),
        )
        .filter(Boolean),
    ),
  )
}

function cleanJsonText(
  text: string,
) {
  let cleaned = text.trim()

  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(
        /^```(?:json)?/i,
        "",
      )
      .replace(
        /```$/i,
        "",
      )
      .trim()
  }

  const firstBrace =
    cleaned.indexOf("{")

  const lastBrace =
    cleaned.lastIndexOf("}")

  if (
    firstBrace >= 0 &&
    lastBrace > firstBrace
  ) {
    cleaned = cleaned.slice(
      firstBrace,
      lastBrace + 1,
    )
  }

  return cleaned
}

function extractTextFromInteraction(
  interaction: any,
): string {
  if (
    typeof interaction?.output_text ===
    "string"
  ) {
    return interaction.output_text
  }

  if (
    typeof interaction?.outputText ===
    "string"
  ) {
    return interaction.outputText
  }

  const steps =
    interaction?.steps

  if (Array.isArray(steps)) {
    const pieces: string[] = []

    for (const step of steps) {
      const contents =
        step?.content

      if (Array.isArray(contents)) {
        for (const content of contents) {
          if (
            typeof content?.text ===
            "string"
          ) {
            pieces.push(
              content.text,
            )
          }
        }
      }

      if (
        typeof step?.text ===
        "string"
      ) {
        pieces.push(step.text)
      }

      if (
        typeof step?.output_text ===
        "string"
      ) {
        pieces.push(
          step.output_text,
        )
      }
    }

    if (pieces.length > 0) {
      return pieces.join("\n")
    }
  }

  const output =
    interaction?.output

  if (Array.isArray(output)) {
    const pieces: string[] = []

    for (const item of output) {
      if (
        typeof item?.text ===
        "string"
      ) {
        pieces.push(item.text)
      }

      if (Array.isArray(item?.content)) {
        for (const content of item.content) {
          if (
            typeof content?.text ===
            "string"
          ) {
            pieces.push(
              content.text,
            )
          }
        }
      }
    }

    if (pieces.length > 0) {
      return pieces.join("\n")
    }
  }

  return ""
}

/**
 * Convert historical pattern-analysis rows
 * into compact evidence for Gemini.
 *
 * The server-calculated score remains authoritative.
 */
function buildPatternEvidence(
  patterns: PatternAnalysis[],
  requestedPaper: RequestedPaper,
) {
  const allowedPapers =
    requestedPaper === "Both"
      ? new Set([
          "Paper 1",
          "Paper 2",
        ])
      : new Set([
          requestedPaper,
        ])

  return patterns
    .filter((pattern) =>
      allowedPapers.has(
        pattern.paper,
      ),
    )
    .sort(
      (a, b) =>
        b.prediction_score -
        a.prediction_score,
    )
    .map((pattern) => ({
      id: pattern.id,

      paper: pattern.paper,

      topic: pattern.topic,

      subtopic:
        pattern.subtopic ??
        "General",

      concept_family:
        pattern.concept_family ??
        pattern.topic,

      pattern_type:
        pattern.pattern_type,

      pattern_value:
        pattern.pattern_value,

      question_count:
        pattern.question_count,

      papers_appeared:
        pattern.papers_appeared,

      appearance_rate:
        pattern.appearance_rate,

      total_marks:
        pattern.total_marks,

      average_marks:
        pattern.average_marks,

      years_seen:
        pattern.years_seen,

      question_positions:
        pattern.question_positions,

      position_min:
        pattern.position_min,

      position_max:
        pattern.position_max,

      position_average:
        pattern.position_average,

      question_styles:
        pattern.question_styles,

      skills:
        pattern.skills,

      frequency_score:
        pattern.frequency_score,

      recency_score:
        pattern.recency_score,

      position_score:
        pattern.position_score,

      style_score:
        pattern.style_score,

      skill_score:
        pattern.skill_score,

      mark_weight_score:
        pattern.mark_weight_score,

      prediction_score:
        pattern.prediction_score,

      pattern_strength:
        pattern.pattern_strength,
    }))
}

/**
 * Build historical examples for Gemini.
 *
 * These examples are deliberately used to understand
 * structural variation, not to copy exact questions.
 */
function buildQuestionEvidence(
  questions: HistoricalQuestion[],
  papers: HistoricalPaper[],
): EvidenceQuestion[] {
  return questions.map(
    (question) => {
      const paper =
        papers.find(
          (item) =>
            item.id ===
            question.paper_id,
        )

      return {
        id: question.id,

        year:
          paper?.exam_year ??
          0,

        session:
          paper?.session ?? "",

        paper:
          paper?.paper ?? "",

        question_number:
          question.question_number,

        question_label:
          question.question_label,

        question_text:
          question.question_text,

        topic:
          normalizeText(
            question.topic,
          ) || "Other",

        subtopic:
          normalizeText(
            question.subtopic,
          ) || "General",

        concept_family:
          normalizeText(
            question.concept_family,
          ) ||
          normalizeText(
            question.topic,
          ) ||
          "Other",

        question_family:
          normalizeText(
            question.question_family,
          ) ||
          normalizeText(
            question.question_type,
          ) ||
          "General question",

        variation_patterns:
          uniqueStrings(
            question.variation_patterns,
          ),

        skills:
          uniqueStrings(
            question.skills,
          ),

        question_type:
          normalizeText(
            question.question_type,
          ) || "Unknown",

        difficulty:
          normalizeText(
            question.difficulty,
          ) || "Unknown",

        marks: Math.max(
          toNumber(
            question.marks,
            0,
          ),
          0,
        ),

        paper_section:
          normalizeText(
            question.paper_section,
          ),

        diagram_dependency:
          normalizeText(
            question.diagram_dependency,
          ) || "None",

        position_band:
          normalizeText(
            question.position_band,
          ) || "Unknown",
      }
    },
  )
}

function buildGeminiPrompt(params: {
  paper: RequestedPaper
  papers: HistoricalPaper[]
  questions: EvidenceQuestion[]
  patternEvidence: ReturnType<
    typeof buildPatternEvidence
  >
}) {
  const allowedPapers =
    params.paper === "Both"
      ? Array.from(
          new Set(
            params.papers.map(
              (paper) =>
                paper.paper,
            ),
          ),
        )
      : [params.paper]

  const relevantQuestions =
    params.questions.filter(
      (question) =>
        allowedPapers.includes(
          question.paper,
        ),
    )

  return `
You are the ZIMSEC O-Level Mathematics historical-pattern analysis engine for GlobeDk Elite Academy.

Your task is NOT to predict a leaked examination paper.

You do NOT have access to any unreleased ZIMSEC examination.

You must ONLY use the historical examination evidence supplied below.

The student wants high-priority revision guidance based on recurring mathematical concepts, question families, structures, skills, marks, positions and variations found in uploaded ZIMSEC papers.

IMPORTANT CORE PRINCIPLE

ZIMSEC questions should NOT be treated as repeated only when the wording, numbers, names, diagram or exact format are identical.

You must recognize STRUCTURAL and CONCEPTUAL recurrence.

For example, these may belong to the same broader concept family:

- Find the inverse of a matrix.
- Given a different matrix, calculate its inverse.
- Determine whether a matrix is singular.
- Perform matrix operations and then determine an inverse.

These are not necessarily the same exact question, but they are related through the broader mathematical concept of MATRIX OPERATIONS.

Likewise:

- Find an intersection of sets.
- Complete a Venn diagram.
- Calculate the number of learners belonging to certain sets.
- Work with complements and universal sets.

These should be recognized as related to SET THEORY AND VENN DIAGRAMS.

Another example:

- Calculate acceleration from a velocity-time graph.
- Find distance travelled from a graph.
- Calculate average speed.
- Interpret acceleration and deceleration from a motion graph.

These belong to the broader MOTION AND KINEMATICS concept family.

Therefore:

DO NOT use exact wording as the main method of recurrence.

Use:

1. Concept family
2. Question family
3. Subtopic
4. Mathematical skills
5. Variation patterns
6. Marks
7. Historical frequency
8. Historical position
9. Recency
10. Different ways ZIMSEC has tested the same underlying concept

CURRENT REQUEST

Paper: ${params.paper}
Curriculum: ZIMSEC
Level: O-Level
Subject: Mathematics

AVAILABLE HISTORICAL PAPERS

${JSON.stringify(
  params.papers.map(
    (paper) => ({
      id: paper.id,
      year: paper.exam_year,
      session: paper.session,
      paper: paper.paper,
      title: paper.title,
      question_count:
        paper.question_count,
    }),
  ),
  null,
  2,
)}

SERVER-CALCULATED PATTERN ANALYSIS

This is the most important evidence.

The server has already analyzed the historical dataset and calculated evidence scores.

DO NOT change these numerical scores.

DO NOT invent new numerical scores.

The prediction_score is an EVIDENCE SCORE, not the probability that the question will appear in the next examination.

${JSON.stringify(
  params.patternEvidence,
  null,
  2,
)}

HISTORICAL QUESTION EXAMPLES

These historical questions are supplied so that you can understand how ZIMSEC has varied the same concepts and question families.

DO NOT copy these questions.

DO NOT reproduce the same numbers.

DO NOT reproduce names, contexts or exact wording.

Use them only to understand the mathematical structure and variation.

${JSON.stringify(
  relevantQuestions,
  null,
  2,
)}

IMPORTANT RULES

1. Do NOT claim that you know what will appear in the next examination.

2. Do NOT claim that any question is guaranteed.

3. Do NOT claim access to leaked or unreleased papers.

4. Do NOT invent historical evidence.

5. Do NOT copy an historical question.

6. Generate NEW realistic practice-question concepts inspired by the historical patterns.

7. The prediction_score MUST come from the server-calculated pattern evidence.

8. Confidence MUST describe the strength of historical evidence, NOT the probability of an examination question appearing.

9. A strong historical pattern does NOT mean the same question will definitely appear again.

10. Do not make exact future question-number claims.

11. Historical question positions may be mentioned only as evidence.

For example:

GOOD:
"Matrix-related questions have repeatedly appeared in the middle-to-late portion of Paper 1."

BAD:
"Matrix inverse will be Question 22."

12. Treat Paper 1 and Paper 2 separately.

13. Do not mix Paper 1 evidence with Paper 2 evidence.

14. Prefer concept families over isolated wording.

15. Prefer question families over exact historical questions.

16. Recognize that the same concept can be tested through different question families.

17. Consider variation patterns carefully.

18. If a concept appeared several times but in different forms, that is useful evidence of structural recurrence.

19. If a topic appeared recently, do not automatically assume it must appear again.

20. If evidence is weak, do not force the concept into the highest-priority predictions.

21. Small datasets must be treated cautiously.

22. Do not overstate confidence when only a few historical papers are available.

23. Do not return duplicate predictions for the same concept family and paper unless they represent genuinely different question families.

24. Prefer a useful mixture of high-priority concept families.

25. The likely_question_styles field must describe NEW practice-question concepts, not copied historical questions.

26. The generated practice-question concepts must be realistic for ZIMSEC O-Level Mathematics.

27. Include different ways the learner should practise the concept.

28. Use the historical evidence to explain WHY a concept is high priority.

29. Consider:
    - recurring concept families
    - recurring question families
    - recurring subtopics
    - variation patterns
    - mathematical skills
    - marks
    - historical positions
    - position bands
    - recent appearances
    - number of different papers in which the concept appeared
    - Paper 1 versus Paper 2 behavior

30. The server evidence fields have the following meanings:

frequency_score:
How consistently the pattern has appeared historically.

recency_score:
How recently the pattern appeared.

position_score:
How consistently the concept/question family has appeared in particular historical position ranges.

style_score:
How many different question styles have historically been used for the pattern.

skill_score:
How many mathematical skills are associated with the pattern.

mark_weight_score:
How strongly the pattern is represented by marks in the historical dataset.

prediction_score:
Combined server-calculated historical evidence score.

31. DO NOT treat prediction_score as a true probability.

32. Do not create an exact probability such as:
"92% chance this will appear."

33. Instead use language such as:
"Strong historical evidence."
"Frequently recurring concept."
"Useful high-priority revision area."
"Appeared across multiple historical papers."

34. If the evidence shows that a concept family was tested through multiple question families, mention that in the reasoning.

35. The purpose is to help the learner prepare for VARIATIONS of recurring mathematical concepts.

OUTPUT

Return ONLY valid JSON.

Use exactly this structure:

{
  "predictions": [
    {
      "paper": "Paper 1",
      "topic": "Algebra",
      "subtopic": "Quadratic equations",
      "concept_family": "Quadratic Equations",
      "question_family": "Solving quadratic equations",
      "prediction_score": 84,
      "confidence": "High",
      "historical_frequency": 80,
      "recency_score": 75,
      "position_score": 70,
      "variation_score": 85,
      "skill_score": 80,
      "mark_weight_score": 65,
      "reasoning": "Explain the recurring historical concept and how ZIMSEC has varied the question family.",
      "likely_question_styles": [
        "A new quadratic equation requiring factorisation.",
        "A new contextual problem that leads to a quadratic equation.",
        "A new question requiring the learner to solve and interpret the roots."
      ],
      "revision_advice": "Revise factorisation, solving quadratic equations, interpreting roots and practising different question structures."
    }
  ]
}

Return between 6 and 12 predictions.

If only one paper type exists in the evidence, return predictions only for that paper.

If both Paper 1 and Paper 2 exist, distribute predictions reasonably between them.

Do not include markdown.

Do not include code fences.
`.trim()
}

export async function POST(
  request: NextRequest,
) {
  let runId: string | null = null

  try {
    /**
     * ----------------------------------------------------------
     * 1. AUTHENTICATE AI STUDENT
     * ----------------------------------------------------------
     */
    const session =
      await getAIStudentSession()

    if (!session?.id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You must be signed in to use the AI Exam Predictor.",
          code: "UNAUTHENTICATED",
        },
        { status: 401 },
      )
    }

    /**
     * ----------------------------------------------------------
     * 2. READ REQUEST
     * ----------------------------------------------------------
     */
    const body =
      await request.json()

    const requestedPaper =
      normalizePaper(
        body?.paper,
      )

    const subject =
      normalizeText(
        body?.subject,
      ) || "Mathematics"

    if (!requestedPaper) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please select Paper 1, Paper 2, or Both.",
          code: "INVALID_PAPER",
        },
        { status: 400 },
      )
    }

    if (
      subject.toLowerCase() !==
      "mathematics"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The ZIMSEC AI Exam Predictor currently supports Mathematics only.",
          code: "UNSUPPORTED_SUBJECT",
        },
        { status: 400 },
      )
    }

    /**
     * ----------------------------------------------------------
     * 3. GET AI STUDENT
     * ----------------------------------------------------------
     */
    const {
      data: student,
      error: studentError,
    } =
      await supabaseAdmin
        .from("ai_students")
        .select(
          "id,email,first_name,last_name,level,curriculum",
        )
        .eq(
          "id",
          session.id,
        )
        .maybeSingle()

    if (studentError) {
      throw new Error(
        `Failed to retrieve AI student: ${studentError.message}`,
      )
    }

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI student account could not be found.",
          code: "STUDENT_NOT_FOUND",
        },
        { status: 404 },
      )
    }

    /**
     * Current predictor is specifically for:
     *
     * ZIMSEC
     * O-Level
     * Mathematics
     */
    if (
      student.level !==
        "O-Level" ||
      student.curriculum !==
        "ZIMSEC"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The current predictor is available for ZIMSEC O-Level Mathematics.",
          code: "UNSUPPORTED_LEVEL",
        },
        { status: 400 },
      )
    }

    /**
     * ----------------------------------------------------------
     * 4. CHECK CREDITS
     * ----------------------------------------------------------
     */
    const {
      data: creditBalance,
      error: creditError,
    } =
      await supabaseAdmin
        .from(
          "ai_credit_balances",
        )
        .select("balance")
        .eq(
          "ai_student_id",
          student.id,
        )
        .maybeSingle()

    if (creditError) {
      throw new Error(
        `Failed to retrieve AI credits: ${creditError.message}`,
      )
    }

    const balance =
      Number(
        creditBalance?.balance ??
          0,
      )

    if (balance < 1) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You do not have enough AI credits to run the Exam Predictor.",
          code:
            "INSUFFICIENT_CREDITS",
          requiresPayment: true,
          credits: balance,
        },
        { status: 402 },
      )
    }

    /**
     * ----------------------------------------------------------
     * 5. GET HISTORICAL PAPERS
     * ----------------------------------------------------------
     */
    let papersQuery =
      supabaseAdmin
        .from(
          "ai_zimsec_math_papers",
        )
        .select(
          `
          id,
          exam_year,
          session,
          paper,
          title,
          original_file_name,
          question_count
          `,
        )
        .eq(
          "subject",
          "Mathematics",
        )
        .eq(
          "level",
          "O-Level",
        )
        .eq(
          "curriculum",
          "ZIMSEC",
        )
        .eq(
          "extraction_status",
          "completed",
        )
        .order(
          "exam_year",
          {
            ascending: false,
          },
        )

    if (
      requestedPaper !==
      "Both"
    ) {
      papersQuery =
        papersQuery.eq(
          "paper",
          requestedPaper,
        )
    }

    const {
      data: rawPapers,
      error: papersError,
    } =
      await papersQuery

    if (papersError) {
      throw new Error(
        `Failed to retrieve historical papers: ${papersError.message}`,
      )
    }

    const papers =
      (rawPapers ??
        []) as HistoricalPaper[]

    if (
      papers.length ===
      0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            requestedPaper ===
            "Both"
              ? "No completed ZIMSEC O-Level Mathematics papers are available in the AI knowledge base."
              : `No completed ZIMSEC O-Level Mathematics ${requestedPaper} papers are available in the AI knowledge base.`,
          code:
            "NO_HISTORICAL_DATA",
        },
        { status: 404 },
      )
    }

    const paperIds =
      papers.map(
        (paper) =>
          paper.id,
      )

    /**
     * ----------------------------------------------------------
     * 6. GET QUESTIONS
     * ----------------------------------------------------------
     */
    const {
      data: rawQuestions,
      error: questionsError,
    } =
      await supabaseAdmin
        .from(
          "ai_zimsec_math_questions",
        )
        .select(
          `
          id,
          paper_id,
          question_number,
          question_label,
          question_text,
          topic,
          subtopic,
          concept_family,
          question_family,
          variation_patterns,
          skills,
          question_type,
          difficulty,
          marks,
          paper_section,
          mathematical_objects,
          diagram_dependency,
          position_band,
          source_page_start,
          source_page_end,
          ai_classification_confidence
          `,
        )
        .in(
          "paper_id",
          paperIds,
        )
        .order(
          "question_number",
          {
            ascending: true,
          },
        )

    if (questionsError) {
      throw new Error(
        `Failed to retrieve historical questions: ${questionsError.message}`,
      )
    }

    const questions =
      (rawQuestions ??
        []) as HistoricalQuestion[]

    if (
      questions.length ===
      0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The uploaded papers do not contain any indexed questions yet. Please check that their extraction status is completed.",
          code:
            "NO_INDEXED_QUESTIONS",
        },
        { status: 404 },
      )
    }

    /**
     * ----------------------------------------------------------
     * 7. GET AGGREGATED PATTERN ANALYSIS
     * ----------------------------------------------------------
     *
     * This is now the main evidence source.
     *
     * The raw questions remain available to Gemini so that
     * it can understand how concepts were varied historically.
     */
    const {
      data: rawPatternAnalysis,
      error:
        patternAnalysisError,
    } =
      await supabaseAdmin
        .from(
          "ai_zimsec_math_pattern_analysis",
        )
        .select(
          `
          id,
          subject,
          level,
          curriculum,
          paper,
          topic,
          subtopic,
          concept_family,
          pattern_type,
          pattern_value,
          position_min,
          position_max,
          position_average,
          question_count,
          papers_appeared,
          appearance_rate,
          total_marks,
          average_marks,
          years_seen,
          question_positions,
          question_styles,
          skills,
          example_question_ids,
          frequency_score,
          recency_score,
          position_score,
          style_score,
          skill_score,
          mark_weight_score,
          prediction_score,
          pattern_strength,
          updated_at
          `,
        )
        .eq(
          "subject",
          "Mathematics",
        )
        .eq(
          "level",
          "O-Level",
        )
        .eq(
          "curriculum",
          "ZIMSEC",
        )
        .order(
          "prediction_score",
          {
            ascending: false,
          },
        )

    if (
      patternAnalysisError
    ) {
      throw new Error(
        `Failed to retrieve ZIMSEC mathematical pattern analysis: ${patternAnalysisError.message}`,
      )
    }

    const patternAnalysis =
      (rawPatternAnalysis ??
        []) as PatternAnalysis[]

    /**
     * Only use patterns belonging to the papers
     * included in the current request.
     */
    const relevantPatterns =
      patternAnalysis.filter(
        (pattern) =>
          requestedPaper ===
          "Both"
            ? pattern.paper ===
                "Paper 1" ||
              pattern.paper ===
                "Paper 2"
            : pattern.paper ===
              requestedPaper,
      )

    if (
      relevantPatterns.length ===
      0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Historical pattern analysis has not been generated for the selected ZIMSEC Mathematics paper yet. Please run the Mathematics pattern analysis after uploading or reprocessing the historical papers.",
          code:
            "NO_PATTERN_ANALYSIS",
        },
        { status: 404 },
      )
    }

    const patternEvidence =
      buildPatternEvidence(
        relevantPatterns,
        requestedPaper,
      )

    if (
      patternEvidence.length ===
      0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No usable mathematical pattern evidence was found for the selected paper.",
          code:
            "NO_USABLE_PATTERN_EVIDENCE",
        },
        { status: 404 },
      )
    }

    const questionEvidence =
      buildQuestionEvidence(
        questions,
        papers,
      )

    /**
     * ----------------------------------------------------------
     * 8. CREATE PREDICTION RUN
     * ----------------------------------------------------------
     */
    const model =
      getGeminiModelName()

    const {
      data: run,
      error: runError,
    } =
      await supabaseAdmin
        .from(
          "ai_prediction_runs",
        )
        .insert({
          ai_student_id:
            student.id,

          user_id: null,

          subject:
            "Mathematics",

          level:
            "O-Level",

          curriculum:
            "ZIMSEC",

          paper:
            requestedPaper,

          papers_analysed:
            papers.length,

          questions_analysed:
            questions.length,

          source_question_count:
            questions.length,

          model_name:
            model,

          status:
            "processing",

          credits_used:
            0,

          paper_1_prediction_count:
            0,

          paper_2_prediction_count:
            0,
        })
        .select("id")
        .single()

    if (
      runError ||
      !run
    ) {
      throw new Error(
        `Failed to create prediction run: ${
          runError?.message ??
          "Unknown error"
        }`,
      )
    }

    runId =
      run.id

    /**
     * ----------------------------------------------------------
     * 9. ASK GEMINI TO INTERPRET THE EVIDENCE
     * ----------------------------------------------------------
     */
    const prompt =
      buildGeminiPrompt({
        paper:
          requestedPaper,

        papers,

        questions:
          questionEvidence,

        patternEvidence,
      })

    const interaction =
      await gemini.interactions.create(
        {
          model,

          input: [
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      )

    const responseText =
      extractTextFromInteraction(
        interaction,
      )

    if (!responseText) {
      throw new Error(
        "Gemini returned an empty response.",
      )
    }

    /**
     * ----------------------------------------------------------
     * 10. PARSE GEMINI JSON
     * ----------------------------------------------------------
     */
    let parsed: {
      predictions?:
        GeminiPrediction[]
    }

    try {
      parsed =
        JSON.parse(
          cleanJsonText(
            responseText,
          ),
        )
    } catch {
      console.error(
        "Invalid Gemini JSON:",
        responseText,
      )

      throw new Error(
        "The AI model returned an invalid prediction response.",
      )
    }

    if (
      !Array.isArray(
        parsed.predictions,
      )
    ) {
      throw new Error(
        "The AI model did not return a predictions array.",
      )
    }

    /**
     * ----------------------------------------------------------
     * 11. VALIDATE PREDICTIONS AGAINST PATTERN ANALYSIS
     * ----------------------------------------------------------
     *
     * Gemini is NOT allowed to invent the evidence score.
     *
     * It identifies the relevant concept/question family,
     * while the server finds the actual historical evidence.
     */
    const validPapers =
      new Set(
        papers.map(
          (paper) =>
            paper.paper,
        ),
      )

    const validPatternKeys =
      new Map<
        string,
        PatternAnalysis
      >()

    for (
      const pattern of relevantPatterns
    ) {
      const conceptFamily =
        normalizeText(
          pattern.concept_family,
        ) ||
        normalizeText(
          pattern.topic,
        )

      const questionFamily =
        normalizeText(
          pattern.pattern_value,
        )

      const key = [
        pattern.paper,

        pattern.topic
          .toLowerCase(),

        (
          pattern.subtopic ??
          "General"
        ).toLowerCase(),

        conceptFamily.toLowerCase(),

        questionFamily.toLowerCase(),
      ].join("|")

      validPatternKeys.set(
        key,
        pattern,
      )
    }

    /**
     * Additional concept-level index.
     *
     * This allows Gemini to use:
     *
     * "Matrix Operations"
     *
     * even when the exact subtopic/question family
     * wording is slightly different.
     */
    const conceptPatternIndex =
      new Map<
        string,
        PatternAnalysis[]
      >()

    for (
      const pattern of relevantPatterns
    ) {
      const concept =
        (
          normalizeText(
            pattern.concept_family,
          ) ||
          normalizeText(
            pattern.topic,
          )
        ).toLowerCase()

      const key = [
        pattern.paper,
        concept,
      ].join("|")

      const existing =
        conceptPatternIndex.get(
          key,
        )

      if (existing) {
        existing.push(
          pattern,
        )
      } else {
        conceptPatternIndex.set(
          key,
          [pattern],
        )
      }
    }

    const predictionsForInsert:
      Array<{
        prediction_run_id: string
        ai_student_id: string

        topic: string
        subtopic: string

        paper:
          | "Paper 1"
          | "Paper 2"

        prediction_score: number

        confidence:
          | "Low"
          | "Medium"
          | "High"

        historical_frequency: number

        recency_score: number

        variation_score: number

        mark_weight_score: number

        reasoning: string

        likely_question_styles:
          string[]

        revision_advice: string
      }> = []

    const seen =
      new Set<string>()

    for (
      const prediction of
        parsed.predictions
    ) {
      if (
        prediction.paper !==
          "Paper 1" &&
        prediction.paper !==
          "Paper 2"
      ) {
        continue
      }

      if (
        !validPapers.has(
          prediction.paper,
        )
      ) {
        continue
      }

      if (
        requestedPaper !==
          "Both" &&
        prediction.paper !==
          requestedPaper
      ) {
        continue
      }

      const topic =
        normalizeText(
          prediction.topic,
        )

      const subtopic =
        normalizeText(
          prediction.subtopic,
        ) || "General"

      const conceptFamily =
        normalizeText(
          prediction.concept_family,
        )

      const questionFamily =
        normalizeText(
          prediction.question_family,
        )

      const reasoning =
        normalizeText(
          prediction.reasoning,
        )

      const revisionAdvice =
        normalizeText(
          prediction.revision_advice,
        )

      if (
        !topic ||
        !reasoning
      ) {
        continue
      }

      /**
       * --------------------------------------------------------
       * First attempt:
       *
       * Exact paper + topic + subtopic +
       * concept family + question family
       * --------------------------------------------------------
       */
      let matchedPattern:
        | PatternAnalysis
        | undefined

      if (
        conceptFamily ||
        questionFamily
      ) {
        const exactKey = [
          prediction.paper,

          topic.toLowerCase(),

          subtopic.toLowerCase(),

          (
            conceptFamily ||
            topic
          ).toLowerCase(),

          questionFamily.toLowerCase(),
        ].join("|")

        matchedPattern =
          validPatternKeys.get(
            exactKey,
          )
      }

      /**
       * --------------------------------------------------------
       * Second attempt:
       *
       * Match concept family within the requested paper.
       * --------------------------------------------------------
       */
      if (
        !matchedPattern &&
        conceptFamily
      ) {
        const conceptKey = [
          prediction.paper,

          conceptFamily.toLowerCase(),
        ].join("|")

        const candidates =
          conceptPatternIndex.get(
            conceptKey,
          ) ?? []

        if (
          candidates.length >
          0
        ) {
          /**
           * Prefer the highest evidence pattern
           * inside the same concept family.
           */
          matchedPattern =
            [...candidates].sort(
              (a, b) =>
                b.prediction_score -
                a.prediction_score,
            )[0]
        }
      }

      /**
       * --------------------------------------------------------
       * Third attempt:
       *
       * Topic + subtopic.
       * --------------------------------------------------------
       */
      if (
        !matchedPattern
      ) {
        matchedPattern =
          relevantPatterns.find(
            (pattern) =>
              pattern.paper ===
                prediction.paper &&
              pattern.topic
                .toLowerCase() ===
                topic.toLowerCase() &&
              (
                pattern.subtopic ??
                "General"
              )
                .toLowerCase() ===
                subtopic.toLowerCase(),
          )
      }

      /**
       * --------------------------------------------------------
       * Fourth attempt:
       *
       * Topic only.
       *
       * This remains as a compatibility fallback.
       */
      if (
        !matchedPattern
      ) {
        matchedPattern =
          relevantPatterns
            .filter(
              (pattern) =>
                pattern.paper ===
                  prediction.paper &&
                pattern.topic
                  .toLowerCase() ===
                  topic.toLowerCase(),
            )
            .sort(
              (a, b) =>
                b.prediction_score -
                a.prediction_score,
            )[0]
      }

      if (
        !matchedPattern
      ) {
        continue
      }

      /**
       * IMPORTANT:
       *
       * The server remains responsible for all
       * numerical evidence.
       */
      const predictionScore =
        clamp(
          Math.round(
            matchedPattern.prediction_score,
          ),
        )

      const historicalFrequency =
        clamp(
          Math.round(
            matchedPattern.frequency_score,
          ),
        )

      const recencyScore =
        clamp(
          Math.round(
            matchedPattern.recency_score,
          ),
        )

      const variationScore =
        clamp(
          Math.round(
            matchedPattern.style_score,
          ),
        )

      const markWeightScore =
        clamp(
          Math.round(
            matchedPattern.mark_weight_score,
          ),
        )

      const confidence =
        confidenceFromScore(
          predictionScore,
        )

      const styles =
        uniqueStrings(
          prediction.likely_question_styles,
        )

      /**
       * Deduplicate primarily by:
       *
       * Paper + concept family + question family.
       *
       * This prevents Gemini from returning several
       * almost-identical predictions for the same concept.
       */
      const dedupeConcept =
        normalizeText(
          matchedPattern.concept_family,
        ) ||
        matchedPattern.topic

      const dedupeQuestionFamily =
        normalizeText(
          prediction.question_family,
        ) ||
        normalizeText(
          matchedPattern.pattern_value,
        ) ||
        matchedPattern.subtopic ||
        "General"

      const key = [
        prediction.paper,

        dedupeConcept.toLowerCase(),

        dedupeQuestionFamily.toLowerCase(),
      ].join("|")

      if (
        seen.has(key)
      ) {
        continue
      }

      seen.add(key)

      predictionsForInsert.push({
        prediction_run_id:
          runId,

        ai_student_id:
          student.id,

        topic:
          normalizeText(
            matchedPattern.topic,
          ) ||
          topic,

        subtopic:
          normalizeText(
            matchedPattern.subtopic,
          ) ||
          subtopic,

        paper:
          prediction.paper,

        prediction_score:
          predictionScore,

        confidence,

        historical_frequency:
          historicalFrequency,

        recency_score:
          recencyScore,

        variation_score:
          variationScore,

        mark_weight_score:
          markWeightScore,

        reasoning,

        likely_question_styles:
          styles.length > 0
            ? styles
            : uniqueStrings(
                matchedPattern.question_styles,
              ),

        revision_advice:
          revisionAdvice ||
          `Revise ${matchedPattern.topic}, especially ${
            matchedPattern.subtopic ??
            "the related concept family"
          }, and practise different question families and variations from this area.`,
      })
    }

    if (
      predictionsForInsert.length ===
      0
    ) {
      throw new Error(
        "No valid predictions were produced from the historical pattern analysis.",
      )
    }

    /**
     * ----------------------------------------------------------
     * 12. LIMIT PREDICTIONS
     * ----------------------------------------------------------
     */
    const finalPredictions =
      predictionsForInsert
        .sort(
          (a, b) =>
            b.prediction_score -
            a.prediction_score,
        )
        .slice(0, 12)

    /**
     * ----------------------------------------------------------
     * 13. SAVE PREDICTIONS
     * ----------------------------------------------------------
     */
    const {
      error:
        predictionInsertError,
    } =
      await supabaseAdmin
        .from(
          "ai_predictions",
        )
        .insert(
          finalPredictions,
        )

    if (
      predictionInsertError
    ) {
      throw new Error(
        `Failed to save predictions: ${predictionInsertError.message}`,
      )
    }

    const paper1Count =
      finalPredictions.filter(
        (prediction) =>
          prediction.paper ===
          "Paper 1",
      ).length

    const paper2Count =
      finalPredictions.filter(
        (prediction) =>
          prediction.paper ===
          "Paper 2",
      ).length

    /**
     * ----------------------------------------------------------
     * 14. CONSUME ONE CREDIT
     * ----------------------------------------------------------
     */
    const {
      error:
        creditConsumeError,
    } =
      await supabaseAdmin.rpc(
        "consume_ai_credits",
        {
          p_ai_student_id:
            student.id,

          p_amount: 1,

          p_feature:
            "exam_predictor",

          p_description:
            `ZIMSEC O-Level Mathematics ${requestedPaper} prediction`,
        },
      )

    if (
      creditConsumeError
    ) {
      throw new Error(
        `Prediction was generated, but the AI credit could not be consumed: ${creditConsumeError.message}`,
      )
    }

    /**
     * ----------------------------------------------------------
     * 15. MARK RUN COMPLETE
     * ----------------------------------------------------------
     */
    const {
      error:
        updateRunError,
    } =
      await supabaseAdmin
        .from(
          "ai_prediction_runs",
        )
        .update({
          status:
            "completed",

          credits_used:
            1,

          paper_1_prediction_count:
            paper1Count,

          paper_2_prediction_count:
            paper2Count,

          completed_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          runId,
        )

    if (
      updateRunError
    ) {
      throw new Error(
        `Predictions were saved, but the prediction run could not be completed: ${updateRunError.message}`,
      )
    }

    /**
     * ----------------------------------------------------------
     * 16. GET UPDATED CREDIT BALANCE
     * ----------------------------------------------------------
     */
    const {
      data: updatedBalance,
    } =
      await supabaseAdmin
        .from(
          "ai_credit_balances",
        )
        .select("balance")
        .eq(
          "ai_student_id",
          student.id,
        )
        .maybeSingle()

    /**
     * ----------------------------------------------------------
     * 17. RETURN RESULT
     * ----------------------------------------------------------
     */
    return NextResponse.json({
      success: true,

      runId,

      predictions:
        finalPredictions.map(
          (prediction) => ({
            paper:
              prediction.paper,

            topic:
              prediction.topic,

            subtopic:
              prediction.subtopic,

            prediction_score:
              prediction.prediction_score,

            confidence:
              prediction.confidence,

            historical_frequency:
              prediction.historical_frequency,

            recency_score:
              prediction.recency_score,

            variation_score:
              prediction.variation_score,

            mark_weight_score:
              prediction.mark_weight_score,

            reasoning:
              prediction.reasoning,

            likely_question_styles:
              prediction.likely_question_styles,

            revision_advice:
              prediction.revision_advice,
          }),
        ),

      credits:
        Number(
          updatedBalance?.balance ??
            Math.max(
              balance - 1,
              0,
            ),
        ),

      source: {
        papers:
          papers.map(
            (paper) => ({
              id: paper.id,

              year:
                paper.exam_year,

              session:
                paper.session,

              paper:
                paper.paper,

              file:
                paper.original_file_name,

              questionCount:
                paper.question_count,
            }),
          ),

        paperCount:
          papers.length,

        questionCount:
          questions.length,

        patternCount:
          relevantPatterns.length,

        analysisType:
          "concept_and_question_family",
      },
    })
  } catch (error) {
    console.error(
      "AI Exam Predictor error:",
      error,
    )

    /**
     * Mark an existing run as failed.
     */
    if (runId) {
      await supabaseAdmin
        .from(
          "ai_prediction_runs",
        )
        .update({
          status:
            "failed",

          error_message:
            error instanceof Error
              ? error.message
              : "Unknown prediction error",

          completed_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          runId,
        )
    }

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Failed to generate exam predictions.",

        code:
          "PREDICTION_FAILED",
      },
      { status: 500 },
    )
  }
}