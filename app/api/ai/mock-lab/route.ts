
import {
  NextRequest,
  NextResponse,
} from "next/server"

import {
  getAIStudentSession,
} from "@/lib/ai-auth"

import {
  supabaseAdmin,
} from "@/lib/supabase-admin"

import {
  gemini,
  getGeminiModelName,
} from "@/lib/gemini"

export const runtime = "nodejs"

/* ============================================================
   CONFIGURATION
============================================================ */

const DEFAULT_QUESTION_COUNT = 10
const MAX_QUESTION_COUNT = 20
const MOCK_CREDIT_COST = 1

/* ============================================================
   TYPES
============================================================ */

type Prediction = {
  id: string
  prediction_run_id?: string
  topic?: string | null
  subtopic?: string | null
  paper?: string | null
  prediction_score?: number | null
  confidence?: string | null
  historical_frequency?: number | null
  recency_score?: number | null
  variation_score?: number | null
  mark_weight_score?: number | null
  reasoning?: string | null
  likely_question_styles?: unknown
  revision_advice?: string | null
  concept_family?: string | null
  question_family?: string | null
  historical_question_ids?: string[] | null
  practice_question_concept?: string | null
}

type GeneratedQuestion = {
  topic: string
  subtopic: string | null
  question_text: string
  question_type:
    | "multiple_choice"
    | "short_answer"
    | "written"
    | "structured"
  options: string[] | null
  correct_answer: string | null
  explanation: string | null
  marks: number
  difficulty:
    | "easy"
    | "medium"
    | "hard"
}

/* ============================================================
   HELPERS
============================================================ */

function cleanJsonResponse(
  text: string
): string {
  let cleaned =
    text
      .trim()
      .replace(
        /^```json\s*/i,
        ""
      )
      .replace(
        /^```\s*/i,
        ""
      )
      .replace(
        /\s*```$/i,
        ""
      )
      .trim()

  const firstBrace =
    cleaned.indexOf("{")

  const lastBrace =
    cleaned.lastIndexOf("}")

  if (
    firstBrace !== -1 &&
    lastBrace !== -1 &&
    lastBrace > firstBrace
  ) {
    cleaned =
      cleaned.slice(
        firstBrace,
        lastBrace + 1
      )
  }

  return cleaned
}

function clampQuestionCount(
  value: unknown
): number {
  const parsed =
    Number(value)

  if (
    !Number.isFinite(parsed)
  ) {
    return DEFAULT_QUESTION_COUNT
  }

  return Math.min(
    MAX_QUESTION_COUNT,
    Math.max(
      5,
      Math.round(parsed)
    )
  )
}

function normaliseQuestionType(
  value: unknown
):
  | "multiple_choice"
  | "short_answer"
  | "written"
  | "structured" {
  const type =
    String(
      value ?? ""
    )
      .trim()
      .toLowerCase()

  if (
    type ===
    "multiple_choice"
  ) {
    return "multiple_choice"
  }

  if (
    type ===
    "short_answer"
  ) {
    return "short_answer"
  }

  if (
    type ===
    "structured"
  ) {
    return "structured"
  }

  return "written"
}

function normaliseDifficulty(
  value: unknown
):
  | "easy"
  | "medium"
  | "hard" {
  const difficulty =
    String(
      value ?? ""
    )
      .trim()
      .toLowerCase()

  if (
    difficulty ===
    "easy"
  ) {
    return "easy"
  }

  if (
    difficulty ===
    "hard"
  ) {
    return "hard"
  }

  return "medium"
}

function normaliseMarks(
  value: unknown
): number {
  const parsed =
    Number(value)

  if (
    !Number.isFinite(parsed)
  ) {
    return 1
  }

  return Math.min(
    10,
    Math.max(
      1,
      Math.round(parsed)
    )
  )
}

function shuffle<T>(
  array: T[]
): T[] {
  const copy =
    [...array]

  for (
    let i =
      copy.length - 1;
    i > 0;
    i--
  ) {
    const j =
      Math.floor(
        Math.random() *
          (i + 1)
      )

    ;[
      copy[i],
      copy[j],
    ] =
      [
        copy[j],
        copy[i],
      ]
  }

  return copy
}

/* ============================================================
   POST
============================================================ */

export async function POST(
  request: NextRequest
) {
  try {
    /* ========================================================
       1. AUTHENTICATE AI STUDENT
    ======================================================== */

    const session =
      await getAIStudentSession()

    if (!session?.id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You must be signed in to use Mock Lab.",
        },
        {
          status: 401,
        }
      )
    }

    /* ========================================================
       2. LOAD AI STUDENT
    ======================================================== */

    const {
      data: student,
      error: studentError,
    } =
      await supabaseAdmin
        .from("ai_students")
        .select(
          `
          id,
          first_name,
          last_name,
          email,
          level,
          curriculum,
          account_status
          `
        )
        .eq(
          "id",
          session.id
        )
        .maybeSingle()

    if (studentError) {
      console.error(
        "Mock Lab student lookup error:",
        studentError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load your AI student account.",
        },
        {
          status: 500,
        }
      )
    }

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI student account not found.",
        },
        {
          status: 404,
        }
      )
    }

    if (
      student.account_status !==
      "active"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your AI student account is not active.",
        },
        {
          status: 403,
        }
      )
    }

    /* ========================================================
       3. READ REQUEST
    ======================================================== */

    const body =
      await request
        .json()
        .catch(
          () => ({})
        )

    const questionCount =
      clampQuestionCount(
        body?.questionCount
      )

    const requestedPaper =
      String(
        body?.paper ??
          "Both Papers"
      ).trim()

    let paper =
      "Both Papers"

    if (
      requestedPaper ===
        "Paper 1" ||
      requestedPaper ===
        "Paper 2"
    ) {
      paper =
        requestedPaper
    }

    /* ========================================================
       4. CHECK AI CREDITS
    ======================================================== */

    const {
      data: creditBalance,
      error: creditError,
    } =
      await supabaseAdmin
        .from(
          "ai_credit_balances"
        )
        .select(
          "balance"
        )
        .eq(
          "ai_student_id",
          student.id
        )
        .maybeSingle()

    if (creditError) {
      console.error(
        "Mock Lab credit lookup error:",
        creditError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to check your AI credits.",
        },
        {
          status: 500,
        }
      )
    }

    const currentBalance =
      Number(
        creditBalance?.balance ??
          0
      )

    if (
      currentBalance <
      MOCK_CREDIT_COST
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You do not have enough AI credits to generate a mock test.",
          code:
            "INSUFFICIENT_CREDITS",
          credits: {
            balance:
              currentBalance,
            required:
              MOCK_CREDIT_COST,
          },
        },
        {
          status: 402,
        }
      )
    }

    /* ========================================================
       5. GET LATEST PREDICTION RUN
    ======================================================== */

    const {
      data: predictionRun,
      error: predictionRunError,
    } =
      await supabaseAdmin
        .from(
          "ai_prediction_runs"
        )
        .select(
          `
          id,
          user_id,
          created_at,
          ai_student_id,
          subject,
          level,
          curriculum,
          paper,
          status
          `
        )
        .eq(
          "ai_student_id",
          student.id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(1)
        .maybeSingle()

    if (predictionRunError) {
      console.error(
        "Mock Lab prediction run error:",
        predictionRunError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load your latest prediction.",
        },
        {
          status: 500,
        }
      )
    }

    if (!predictionRun) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please create an AI Exam Prediction first before generating a Mock Test.",
          code:
            "NO_PREDICTION_RUN",
        },
        {
          status: 400,
        }
      )
    }

    /* ========================================================
       6. RESOLVE NORMAL USER ID

       ai_mock_exams.user_id is NOT NULL and references
       public.users(id).

       The AI student is stored separately in ai_students,
       therefore we must use the real users.id here.

       Prefer the user_id already attached to the prediction
       run. If it is unavailable, find the user by email.
    ======================================================== */

    let normalUserId =
      predictionRun.user_id ??
      null

    if (!normalUserId) {
      const {
        data: normalUser,
        error: normalUserError,
      } =
        await supabaseAdmin
          .from("users")
          .select(
            "id"
          )
          .eq(
            "email",
            student.email
          )
          .maybeSingle()

      if (normalUserError) {
        console.error(
          "Mock Lab normal user lookup error:",
          normalUserError
        )

        return NextResponse.json(
          {
            success: false,
            error:
              "Unable to link your AI student account to your user account.",
          },
          {
            status: 500,
          }
        )
      }

      normalUserId =
        normalUser?.id ??
        null
    }

    if (!normalUserId) {
      console.error(
        "Mock Lab could not resolve users.id for AI student:",
        student.id,
        student.email
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Your AI student account is not linked to a valid user account yet. Please contact GlobeDk support.",
          code:
            "USER_ACCOUNT_NOT_LINKED",
        },
        {
          status: 400,
        }
      )
    }

    /* ========================================================
       7. GET PREDICTIONS
    ======================================================== */

    const {
      data: predictions,
      error: predictionsError,
    } =
      await supabaseAdmin
        .from(
          "ai_predictions"
        )
        .select(
          `
          id,
          prediction_run_id,
          topic,
          subtopic,
          paper,
          prediction_score,
          confidence,
          historical_frequency,
          recency_score,
          variation_score,
          mark_weight_score,
          reasoning,
          likely_question_styles,
          revision_advice,
          concept_family,
          question_family,
          historical_question_ids,
          practice_question_concept
          `
        )
        .eq(
          "prediction_run_id",
          predictionRun.id
        )
        .order(
          "prediction_score",
          {
            ascending: false,
          }
        )

    if (predictionsError) {
      console.error(
        "Mock Lab predictions error:",
        predictionsError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load prediction topics.",
        },
        {
          status: 500,
        }
      )
    }

    let availablePredictions =
      (predictions ??
        []) as Prediction[]

    /* ========================================================
       8. FILTER BY PAPER
    ======================================================== */

    if (
      paper ===
      "Paper 1"
    ) {
      availablePredictions =
        availablePredictions.filter(
          (
            prediction
          ) =>
            prediction.paper ===
              "Paper 1" ||
            prediction.paper ===
              "Paper 1 / Paper 2" ||
            prediction.paper ===
              "Both" ||
            prediction.paper ===
              "Paper 1 and Paper 2"
        )
    }

    if (
      paper ===
      "Paper 2"
    ) {
      availablePredictions =
        availablePredictions.filter(
          (
            prediction
          ) =>
            prediction.paper ===
              "Paper 2" ||
            prediction.paper ===
              "Paper 1 / Paper 2" ||
            prediction.paper ===
              "Both" ||
            prediction.paper ===
              "Paper 1 and Paper 2"
        )
    }

    if (
      availablePredictions.length ===
      0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `No prediction topics are available for ${paper}. Please run the AI Exam Predictor again or choose Both Papers.`,
          code:
            "NO_PREDICTIONS_FOR_PAPER",
        },
        {
          status: 400,
        }
      )
    }

    /* ========================================================
       9. SELECT TOP PREDICTIONS
    ======================================================== */

    const topPredictions =
      availablePredictions
        .slice(
          0,
          15
        )

    const shuffledPredictions =
      shuffle(
        topPredictions
      )

    const selectedPredictions:
      Prediction[] =
      []

    for (
      let i = 0;
      i <
      questionCount;
      i++
    ) {
      selectedPredictions.push(
        shuffledPredictions[
          i %
            shuffledPredictions.length
        ]
      )
    }

    /* ========================================================
       10. BUILD GEMINI PREDICTION GUIDANCE
    ======================================================== */

    const predictionGuidance =
      selectedPredictions
        .map(
          (
            prediction,
            index
          ) => {
            let styles =
              ""

            if (
              Array.isArray(
                prediction.likely_question_styles
              )
            ) {
              styles =
                prediction.likely_question_styles
                  .map(
                    (
                      style
                    ) =>
                      String(
                        style
                      )
                  )
                  .join(
                    ", "
                  )
            } else if (
              prediction.likely_question_styles
            ) {
              styles =
                String(
                  prediction.likely_question_styles
                )
            }

            return `
Prediction ${index + 1}:

Topic:
${
  prediction.topic ??
  "General Mathematics"
}

Subtopic:
${
  prediction.subtopic ??
  "General"
}

Concept family:
${
  prediction.concept_family ??
  "Not specified"
}

Question family:
${
  prediction.question_family ??
  "Not specified"
}

Practice question concept:
${
  prediction.practice_question_concept ??
  "Not specified"
}

Likely question styles:
${
  styles ||
  "Not specified"
}

Reasoning:
${
  prediction.reasoning ??
  "No reasoning provided"
}

Revision advice:
${
  prediction.revision_advice ??
  "No revision advice provided"
}

Suggested prediction score:
${
  prediction.prediction_score ??
  "Not specified"
}

Confidence:
${
  prediction.confidence ??
  "Unknown"
}

Historical frequency:
${
  prediction.historical_frequency ??
  "Not specified"
}

Recency score:
${
  prediction.recency_score ??
  "Not specified"
}

Variation score:
${
  prediction.variation_score ??
  "Not specified"
}

Mark weight score:
${
  prediction.mark_weight_score ??
  "Not specified"
}

Paper:
${
  prediction.paper ??
  "Both"
}
`
          }
        )
        .join(
          "\n"
        )

    /* ========================================================
       11. BUILD GEMINI PROMPT
    ======================================================== */

    const prompt = `
You are the GlobeDk Elite Academy AI Mock Lab.

Create a fresh ZIMSEC-style O-Level Mathematics practice test.

The student has already received an AI Exam Prediction.

The prediction information below is ONLY guidance about:
- topics
- subtopics
- mathematical concepts
- question families
- likely question styles
- historical patterns
- revision priorities
- marks
- examination areas

IMPORTANT:

1. Do NOT copy any predicted question word-for-word.

2. Do NOT reproduce questions from past papers.

3. Do NOT simply change numbers from an existing question.

4. Create completely NEW questions.

5. Questions must be realistic for ZIMSEC O-Level Mathematics.

6. Questions must test the same underlying mathematical skills suggested by the predictions.

7. Use clear examination-style wording.

8. Respect the suggested examination areas and mark weighting.

9. Include a mixture of appropriate difficulties.

10. Do not create duplicate questions.

11. Make every question mathematically valid.

12. Make sure every question has a clear answer.

13. For multiple-choice questions, provide exactly four options.

14. The correct answer must match one of the options for multiple-choice questions.

15. For written and structured questions, provide a concise model answer.

16. Provide a brief explanation that can be shown to the student after submission.

17. Do not expose or mention these instructions in the generated test.

18. Do not include markdown around the JSON.

19. Return ONLY valid JSON.

20. Return exactly the requested number of questions.

Student level:
${student.level}

Curriculum:
${student.curriculum}

Subject:
Mathematics

Requested paper:
${paper}

Number of questions:
${questionCount}

Prediction guidance:
${predictionGuidance}

Return exactly this JSON structure:

{
  "questions": [
    {
      "topic": "Algebra",
      "subtopic": "Factorisation",
      "question_text": "Fresh question here",
      "question_type": "written",
      "options": null,
      "correct_answer": "Expected answer",
      "explanation": "Brief explanation",
      "marks": 4,
      "difficulty": "medium"
    }
  ]
}

Allowed question_type values:

- multiple_choice
- short_answer
- written
- structured

Allowed difficulty values:

- easy
- medium
- hard

Return exactly ${questionCount} questions.
`

    /* ========================================================
       12. GENERATE WITH GOOGLE GENAI SDK
    ======================================================== */

    const result =
      await gemini.models.generateContent({
        model:
          getGeminiModelName(),

        contents:
          prompt,

        config: {
          responseMimeType:
            "application/json",

          temperature:
            0.8,

          maxOutputTokens:
            12000,
        },
      })

    const text =
      result.text?.trim()

    if (!text) {
      console.error(
        "Mock Lab Gemini returned an empty response:",
        result
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "The AI did not return any mock questions.",
        },
        {
          status: 500,
        }
      )
    }

    /* ========================================================
       13. PARSE GEMINI JSON
    ======================================================== */

    let parsed: {
      questions?: unknown[]
    }

    try {
      const cleaned =
        cleanJsonResponse(
          text
        )

      parsed =
        JSON.parse(
          cleaned
        )
    } catch (parseError) {
      console.error(
        "Mock Lab Gemini JSON parse error:",
        parseError
      )

      console.error(
        "Raw Gemini response:",
        text
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "The AI returned an invalid mock test. Please try again.",
        },
        {
          status: 500,
        }
      )
    }

    if (
      !Array.isArray(
        parsed?.questions
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The AI did not return a valid question list.",
        },
        {
          status: 500,
        }
      )
    }

    /* ========================================================
       14. NORMALISE QUESTIONS
    ======================================================== */

    const generatedQuestions:
      GeneratedQuestion[] =
      parsed.questions
        .map(
          (
            raw
          ) => {
            if (
              !raw ||
              typeof raw !==
                "object"
            ) {
              return null
            }

            const question =
              raw as Record<
                string,
                unknown
              >

            const questionText =
              String(
                question.question_text ??
                  ""
              ).trim()

            if (
              !questionText
            ) {
              return null
            }

            const questionType =
              normaliseQuestionType(
                question.question_type
              )

            let options:
              | string[]
              | null =
              null

            if (
              Array.isArray(
                question.options
              )
            ) {
              options =
                question.options
                  .map(
                    (
                      option
                    ) =>
                      String(
                        option
                      ).trim()
                  )
                  .filter(
                    Boolean
                  )
            }

            if (
              questionType ===
                "multiple_choice" &&
              (!options ||
                options.length !==
                  4)
            ) {
              return null
            }

            return {
              topic:
                String(
                  question.topic ??
                    "General Mathematics"
                ).trim(),

              subtopic:
                question.subtopic
                  ? String(
                      question.subtopic
                    ).trim()
                  : null,

              question_text:
                questionText,

              question_type:
                questionType,

              options,

              correct_answer:
                question.correct_answer
                  ? String(
                      question.correct_answer
                    ).trim()
                  : null,

              explanation:
                question.explanation
                  ? String(
                      question.explanation
                    ).trim()
                  : null,

              marks:
                normaliseMarks(
                  question.marks
                ),

              difficulty:
                normaliseDifficulty(
                  question.difficulty
                ),
            }
          }
        )
        .filter(
          (
            question
          ): question is GeneratedQuestion =>
            Boolean(question)
        )
        .slice(
          0,
          questionCount
        )

    /* ========================================================
       15. MAKE SURE ENOUGH QUESTIONS EXIST
    ======================================================== */

    if (
      generatedQuestions.length <
      questionCount
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `The AI generated only ${generatedQuestions.length} valid questions out of ${questionCount}. Please try generating the mock again.`,
        },
        {
          status: 500,
        }
      )
    }

    /* ========================================================
       16. CALCULATE TOTAL MARKS
    ======================================================== */

    const totalMarks =
      generatedQuestions.reduce(
        (
          total,
          question
        ) =>
          total +
          question.marks,
        0
      )

    const durationMinutes =
      Math.max(
        30,
        Math.ceil(
          questionCount *
            4
        )
      )

    /* ========================================================
       17. CREATE MOCK EXAM

       IMPORTANT DATABASE CONTRACT:

       ai_mock_exams contains:
       - user_id
       - ai_student_id
       - prediction_run_id
       - title
       - subject
       - level
       - curriculum
       - paper
       - difficulty
       - focus_type
       - duration_minutes
       - total_marks
       - instructions
       - status
       - model_name
       - credits_used
       - created_at
       - completed_at
       - score
       - percentage
       - attempt_id

       It DOES NOT contain total_questions.
    ======================================================== */

    const { 
      data: mockExam,
      error: mockExamError,
    } =
      await supabaseAdmin
        .from(
          "ai_mock_exams"
        )
        .insert({
          user_id:
            normalUserId,

          ai_student_id:
            student.id,

          prediction_run_id:
            predictionRun.id,

          title:
            "GlobeDk AI Mathematics Mock Test",

          subject:
            "Mathematics",

          level:
            student.level ??
            "O-Level",

          curriculum:
            student.curriculum ??
            "ZIMSEC",

          paper:
            paper ===
            "Paper 1"
              ? "Paper 1"
              : paper ===
                  "Paper 2"
                ? "Paper 2"
                : "Both",

          difficulty:
            "Exam Level",

          focus_type:
            "Prediction Based",

          duration_minutes:
            durationMinutes,

          total_marks:
            totalMarks,

          instructions:
            "Answer all questions. This mock test was generated from your AI Exam Prediction and is designed as fresh ZIMSEC-style practice.",

          status:
            "generated",

          model_name:
            getGeminiModelName(),

          credits_used:
            MOCK_CREDIT_COST,
        })
        .select(
          `
          id,
          user_id,
          ai_student_id,
          prediction_run_id,
          title,
          subject,
          level,
          curriculum,
          paper,
          difficulty,
          focus_type,
          duration_minutes,
          total_marks,
          instructions,
          status,
          model_name,
          credits_used,
          created_at
          `
        )
        .single()

    if (mockExamError) {
      console.error(
        "Mock Lab exam insert error:",
        mockExamError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Failed to save the generated mock test.",
          details:
            process.env.NODE_ENV ===
            "development"
              ? mockExamError.message
              : undefined,
        },
        {
          status: 500,
        }
      )
    }

    /* ========================================================
       18. INSERT QUESTIONS

       IMPORTANT DATABASE CONTRACT:

       ai_mock_questions contains:
       - id
       - mock_exam_id
       - question_number
       - topic
       - subtopic
       - question_type
       - marks
       - question_text
       - question_data
       - correct_answer
       - marking_guide
       - explanation
       - created_at

       It DOES NOT contain:
       - prediction_id
       - options
       - difficulty

       Therefore options/difficulty are stored in question_data.
    ======================================================== */

    const questionRows =
      generatedQuestions.map(
        (
          question,
          index
        ) => {
          const prediction =
            selectedPredictions[
              index %
                selectedPredictions.length
            ]

          return {
            mock_exam_id:
              mockExam.id,

            question_number:
              index + 1,

            topic:
              question.topic,

            subtopic:
              question.subtopic,

            question_type:
              question.question_type,

            marks:
              question.marks,

            question_text:
              question.question_text,

            question_data: {
              options:
                question.options,

              difficulty:
                question.difficulty,

              prediction_id:
                prediction?.id ??
                null,

              paper:
                paper,

              source:
                "AI generated",

              generated_from_prediction:
                true,
            },

            correct_answer:
              question.correct_answer,

            marking_guide:
              question.correct_answer,

            explanation:
              question.explanation,
          }
        }
      )

    const {
      data: savedQuestions,
      error:
        questionsInsertError,
    } =
      await supabaseAdmin
        .from(
          "ai_mock_questions"
        )
        .insert(
          questionRows
        )
        .select(
          `
          id,
          mock_exam_id,
          question_number,
          topic,
          subtopic,
          question_type,
          marks,
          question_text,
          question_data
          `
        )
        .order(
          "question_number",
          {
            ascending: true,
          }
        )

    if (
      questionsInsertError
    ) {
      console.error(
        "Mock Lab questions insert error:",
        questionsInsertError
      )

      await supabaseAdmin
        .from(
          "ai_mock_exams"
        )
        .delete()
        .eq(
          "id",
          mockExam.id
        )

      return NextResponse.json(
        {
          success: false,
          error:
            "Failed to save the mock questions.",
          details:
            process.env.NODE_ENV ===
            "development"
              ? questionsInsertError.message
              : undefined,
        },
        {
          status: 500,
        }
      )
    }

    /* ========================================================
       19. RECHECK CREDIT BEFORE DEDUCTION
    ======================================================== */

    const {
      data: latestCreditBalance,
      error:
        latestCreditError,
    } =
      await supabaseAdmin
        .from(
          "ai_credit_balances"
        )
        .select(
          "balance"
        )
        .eq(
          "ai_student_id",
          student.id
        )
        .maybeSingle()

    if (
      latestCreditError
    ) {
      console.error(
        "Mock Lab latest credit lookup error:",
        latestCreditError
      )

      await supabaseAdmin
        .from(
          "ai_mock_exams"
        )
        .delete()
        .eq(
          "id",
          mockExam.id
        )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to confirm your AI credit balance.",
        },
        {
          status: 500,
        }
      )
    }

    const latestBalance =
      Number(
        latestCreditBalance?.balance ??
          0
      )

    if (
      latestBalance <
      MOCK_CREDIT_COST
    ) {
      await supabaseAdmin
        .from(
          "ai_mock_exams"
        )
        .delete()
        .eq(
          "id",
          mockExam.id
        )

      return NextResponse.json(
        {
          success: false,
          error:
            "You no longer have enough AI credits to complete this generation.",
          code:
            "INSUFFICIENT_CREDITS",
          credits: {
            balance:
              latestBalance,
            required:
              MOCK_CREDIT_COST,
          },
        },
        {
          status: 402,
        }
      )
    }

    /* ========================================================
       20. DEDUCT ONE AI CREDIT
    ======================================================== */

    const newBalance =
      latestBalance -
      MOCK_CREDIT_COST

    const {
      error:
        creditUpdateError,
    } =
      await supabaseAdmin
        .from(
          "ai_credit_balances"
        )
        .update({
          balance:
            newBalance,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "ai_student_id",
          student.id
        )

    if (
      creditUpdateError
    ) {
      console.error(
        "Mock Lab credit deduction error:",
        creditUpdateError
      )

      await supabaseAdmin
        .from(
          "ai_mock_exams"
        )
        .delete()
        .eq(
          "id",
          mockExam.id
        )

      return NextResponse.json(
        {
          success: false,
          error:
            "The mock was not completed because your AI credit could not be deducted.",
        },
        {
          status: 500,
        }
      )
    }

    /* ========================================================
       21. RETURN MOCK

       IMPORTANT:

       Correct answers, marking guides and explanations
       are NOT returned to the browser.

       Options and difficulty are read from question_data.
    ======================================================== */

    const clientQuestions =
      (
        savedQuestions ??
        []
      ).map(
        (
          question
        ) => {
          const questionData =
            (
              question.question_data ??
              {}
            ) as Record<
              string,
              unknown
            >

          const options =
            Array.isArray(
              questionData.options
            )
              ? questionData.options
                  .map(
                    (
                      option
                    ) =>
                      String(
                        option
                      )
                  )
              : null

          const difficulty =
            typeof questionData.difficulty ===
            "string"
              ? questionData.difficulty
              : "medium"

          return {
            id:
              question.id,

            mock_exam_id:
              question.mock_exam_id,

            question_number:
              question.question_number,

            topic:
              question.topic,

            subtopic:
              question.subtopic,

            question_text:
              question.question_text,

            question_type:
              question.question_type,

            options,

            marks:
              question.marks,

            difficulty,
          }
        }
      )

    return NextResponse.json(
      {
        success: true,

        mock: {
          id:
            mockExam.id,

          title:
            mockExam.title,

          subject:
            mockExam.subject,

          level:
            mockExam.level,

          curriculum:
            mockExam.curriculum,

          paper:
            mockExam.paper,

          /*
           * total_questions is calculated from the actual
           * saved question rows because ai_mock_exams does
           * not have a total_questions column.
           */
          totalQuestions:
            clientQuestions.length,

          total_questions:
            clientQuestions.length,

          totalMarks:
            mockExam.total_marks,

          total_marks:
            mockExam.total_marks,

          durationMinutes:
            mockExam.duration_minutes,

          duration_minutes:
            mockExam.duration_minutes,

          status:
            mockExam.status,

          createdAt:
            mockExam.created_at,

          created_at:
            mockExam.created_at,

          questions:
            clientQuestions,
        },

        credits: {
          balance:
            newBalance,

          used:
            MOCK_CREDIT_COST,
        },
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Mock Lab API error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while generating the mock test.",
      },
      {
        status: 500,
      }
    )
  }
}
