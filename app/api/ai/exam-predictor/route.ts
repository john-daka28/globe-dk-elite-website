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
  generateGeminiText,
} from "@/lib/gemini"

type Prediction = {
  paper: "Paper 1" | "Paper 2"
  question_number: number
  topic: string
  predicted_question: string
  prediction_reason: string
  confidence: number
  source_question_ids: string[]
}

function cleanJson(
  text: string
) {
  let cleaned =
    text.trim()

  if (
    cleaned.startsWith("```")
  ) {
    cleaned =
      cleaned
        .replace(
          /^```(?:json)?/i,
          ""
        )
        .replace(
          /```$/i,
          ""
        )
        .trim()
  }

  return cleaned
}

export async function GET() {
  try {
    // --------------------------------------------------------
    // SESSION
    // --------------------------------------------------------

    const session =
      await getAIStudentSession()

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You must be signed in.",
        },
        {
          status: 401,
        }
      )
    }

    // --------------------------------------------------------
    // STUDENT
    // --------------------------------------------------------

    const {
      data: student,
      error:
        studentError,
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
          account_status,
          email_verified
          `
        )
        .eq(
          "id",
          session.id
        )
        .maybeSingle()

    if (
      studentError ||
      !student
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI student account could not be found.",
        },
        {
          status: 401,
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
            "Your account is suspended.",
        },
        {
          status: 403,
        }
      )
    }

    // --------------------------------------------------------
    // CREDIT BALANCE
    // --------------------------------------------------------

    const {
      data: creditBalance,
      error:
        creditError,
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
        "Credit lookup:",
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

    const credits =
      Number(
        creditBalance?.balance ||
          0
      )

    return NextResponse.json({
      success: true,

      student: {
        firstName:
          student.first_name,

        lastName:
          student.last_name,

        level:
          student.level,

        curriculum:
          student.curriculum,
      },

      credits,
    })

  } catch (error) {
    console.error(
      "Exam predictor GET:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load the exam predictor.",
      },
      {
        status: 500,
      }
    )
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    // --------------------------------------------------------
    // SESSION
    // --------------------------------------------------------

    const session =
      await getAIStudentSession()

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your session has expired. Please sign in again.",
        },
        {
          status: 401,
        }
      )
    }

    // --------------------------------------------------------
    // REQUEST
    // --------------------------------------------------------

    const body =
      await request.json()

    const subject =
      String(
        body.subject ||
          "Mathematics"
      )
        .trim()

    const level =
      String(
        body.level ||
          session.level
      )
        .trim()

    const curriculum =
      String(
        body.curriculum ||
          session.curriculum
      )
        .trim()

    const requestedPaper =
      body.paper === "Paper 1" ||
      body.paper === "Paper 2"
        ? body.paper
        : "Both"

    // --------------------------------------------------------
    // ONLY SUPPORT VALID OPTIONS
    // --------------------------------------------------------

    if (
      ![
        "O-Level",
        "A-Level",
      ].includes(level)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid level.",
        },
        {
          status: 400,
        }
      )
    }

    if (
      ![
        "ZIMSEC",
        "Cambridge",
      ].includes(
        curriculum
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid curriculum.",
        },
        {
          status: 400,
        }
      )
    }

    // --------------------------------------------------------
    // CREDITS
    // --------------------------------------------------------

    const {
      data: creditBalance,
      error:
        creditError,
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
          session.id
        )
        .maybeSingle()

    if (creditError) {
      console.error(
        "Credit lookup:",
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

    const credits =
      Number(
        creditBalance?.balance ||
          0
      )

    // --------------------------------------------------------
    // PREDICTION COST
    // --------------------------------------------------------

    const cost = 1

    if (
      credits < cost
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "You do not have enough AI credits.",

          code:
            "INSUFFICIENT_CREDITS",

          credits,

          requiredCredits:
            cost,
        },
        {
          status: 402,
        }
      )
    }

    // --------------------------------------------------------
    // LOAD HISTORICAL QUESTIONS
    // --------------------------------------------------------
    //
    // We intentionally retrieve a reasonable amount rather
    // than dumping the entire database into Gemini.
    //
    // The predictor uses question history as its evidence.
    // --------------------------------------------------------

    const {
      data: questions,
      error:
        questionsError,
    } =
      await supabaseAdmin
        .from(
          "zimsec_questions"
        )
        .select("*")
        .eq(
          "level",
          level
        )
        .eq(
          "curriculum",
          curriculum
        )
        .eq(
          "subject",
          subject
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(250)

    if (questionsError) {
      console.error(
        "Historical questions:",
        questionsError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load the examination dataset.",
        },
        {
          status: 500,
        }
      )
    }

    if (
      !questions ||
      questions.length < 5
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "There are not enough historical examination questions available yet. Please ask the administrator to add more ZIMSEC examination papers.",
        },
        {
          status: 422,
        }
      )
    }

    // --------------------------------------------------------
    // NORMALISE QUESTIONS
    // --------------------------------------------------------

    const historicalQuestions =
      questions.map(
        (question: any) => ({
          id:
            question.id,

          year:
            question.year ??
            question.exam_year ??
            null,

          session:
            question.session ??
            question.exam_session ??
            null,

          paper:
            question.paper ??
            question.paper_number ??
            null,

          question_number:
            question.question_number ??
            question.number ??
            null,

          topic:
            question.topic ??
            question.topic_name ??
            "Unclassified",

          text:
            question.question_text ??
            question.question ??
            question.text ??
            "",

          marks:
            question.marks ??
            question.mark_allocation ??
            null,
        })
      )
      .filter(
        (question) =>
          question.text
      )

    if (
      historicalQuestions.length <
      5
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The examination dataset does not contain enough usable question text yet.",
        },
        {
          status: 422,
        }
      )
    }

    // --------------------------------------------------------
    // LIMIT DATA SENT TO AI
    // --------------------------------------------------------

    const dataset =
      historicalQuestions
        .slice(0, 200)

    // --------------------------------------------------------
    // PAPER INSTRUCTION
    // --------------------------------------------------------

    const paperInstruction =
      requestedPaper ===
      "Both"
        ? `
Generate predictions for BOTH Paper 1 and Paper 2.

Paper 1 should contain shorter/objective-style questions
where appropriate for the historical structure.

Paper 2 should contain longer structured/calculation/problem-solving
questions where appropriate for the historical structure.
`
        : `
Generate predictions ONLY for ${requestedPaper}.
`

    // --------------------------------------------------------
    // AI PROMPT
    // --------------------------------------------------------

    const prompt = `
You are the GlobeDk AI Exam Predictor.

You are assisting a student preparing for a
${curriculum} ${level} ${subject} examination.

IMPORTANT:

You must NOT claim that you know the actual future
ZIMSEC examination paper.

Your task is to identify historical patterns and
produce educational predictions based ONLY on the
historical examination dataset supplied below.

Analyse:

1. Topics that repeatedly appear.
2. Topics that have recently appeared.
3. Topics that appear at different intervals.
4. Question structures that repeat.
5. Variations of the same concept.
6. Areas that may reasonably be due for another appearance.
7. Balance between major syllabus topics.
8. Difference between Paper 1 and Paper 2.
9. Marks and difficulty patterns where available.
10. Avoid simply copying historical questions.

${paperInstruction}

For every prediction:

- Give the paper.
- Give a question number.
- Give the topic.
- Write an ORIGINAL predicted question.
- Explain briefly why the question was selected.
- Give a confidence score from 0 to 100.

Confidence does NOT mean certainty.
It means confidence in the historical pattern supporting
the prediction.

Do not say:
"The actual exam will contain this."

Instead say:
"This is a pattern-based prediction."

Return ONLY valid JSON.

Required structure:

{
  "predictions": [
    {
      "paper": "Paper 1",
      "question_number": 1,
      "topic": "Algebra",
      "predicted_question": "...",
      "prediction_reason": "...",
      "confidence": 78,
      "source_question_ids": ["id1", "id2"]
    }
  ]
}

Generate approximately:

- 10 Paper 1 predictions
- 10 Paper 2 predictions

when BOTH papers are requested.

For one paper, generate approximately 15 useful
predictions.

Historical examination dataset:

${JSON.stringify(
  dataset
)}
`

    // --------------------------------------------------------
    // GEMINI
    // --------------------------------------------------------

    const aiText =
      await generateGeminiText(
        prompt
      )

    let parsed: {
      predictions?: Prediction[]
    }

    try {
      parsed =
        JSON.parse(
          cleanJson(aiText)
        )
    } catch (parseError) {
      console.error(
        "Prediction JSON parse error:",
        parseError
      )

      console.error(
        "Gemini response:",
        aiText
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "The AI returned an invalid prediction format. Please try again.",
        },
        {
          status: 500,
        }
      )
    }

    const predictions =
      Array.isArray(
        parsed.predictions
      )
        ? parsed.predictions
        : []

    if (
      predictions.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The AI did not produce any predictions.",
        },
        {
          status: 500,
        }
      )
    }

    // --------------------------------------------------------
    // CREATE PREDICTION RUN
    // --------------------------------------------------------

    const paper1Count =
      predictions.filter(
        (prediction) =>
          prediction.paper ===
          "Paper 1"
      ).length

    const paper2Count =
      predictions.filter(
        (prediction) =>
          prediction.paper ===
          "Paper 2"
      ).length

    const {
      data: run,
      error:
        runError,
    } =
      await supabaseAdmin
        .from(
          "ai_prediction_runs"
        )
        .insert({
          ai_student_id:
            session.id,

          subject,

          level,

          curriculum,

          paper_1_prediction_count:
            paper1Count,

          paper_2_prediction_count:
            paper2Count,

          model_name:
            process.env.GEMINI_MODEL ||
            "gemini-2.5-flash",

          source_question_count:
            dataset.length,

          status:
            "completed",
        })
        .select(
          "id"
        )
        .single()

    if (runError || !run) {
      console.error(
        "Creating prediction run:",
        runError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Predictions were generated but could not be saved.",
        },
        {
          status: 500,
        }
      )
    }

    // --------------------------------------------------------
    // SAVE PREDICTIONS
    // --------------------------------------------------------

    const rows =
      predictions.map(
        (
          prediction,
          index
        ) => ({
          prediction_run_id:
            run.id,

          ai_student_id:
            session.id,

          paper:
            prediction.paper ===
            "Paper 2"
              ? "Paper 2"
              : "Paper 1",

          question_number:
            Number(
              prediction.question_number ||
                index + 1
            ),

          topic:
            String(
              prediction.topic ||
                "General"
            ),

          predicted_question:
            String(
              prediction.predicted_question ||
                ""
            ),

          prediction_reason:
            String(
              prediction.prediction_reason ||
                ""
            ),

          confidence:
            Math.max(
              0,
              Math.min(
                100,
                Number(
                  prediction.confidence ||
                    0
                )
              )
            ),

          source_question_ids:
            Array.isArray(
              prediction.source_question_ids
            )
              ? prediction.source_question_ids
              : [],
        })
      )

    const {
      error:
        predictionInsertError,
    } =
      await supabaseAdmin
        .from(
          "ai_predictions"
        )
        .insert(rows)

    if (
      predictionInsertError
    ) {
      console.error(
        "Saving predictions:",
        predictionInsertError
      )

      await supabaseAdmin
        .from(
          "ai_prediction_runs"
        )
        .delete()
        .eq(
          "id",
          run.id
        )

      return NextResponse.json(
        {
          success: false,
          error:
            "The predictions could not be saved.",
        },
        {
          status: 500,
        }
      )
    }

    // --------------------------------------------------------
    // CHARGE ONE AI CREDIT
    // --------------------------------------------------------

    const {
      error:
        creditConsumeError,
    } =
      await supabaseAdmin.rpc(
        "consume_ai_credits",
        {
          p_ai_student_id:
            session.id,

          p_amount:
            cost,

          p_feature:
            "exam_predictor",

          p_description:
            `${curriculum} ${level} ${subject} exam prediction`,
        }
      )

    if (
      creditConsumeError
    ) {
      console.error(
        "Credit consumption error:",
        creditConsumeError
      )

      // Predictions were already generated.
      // Do not delete them.
      //
      // The RPC should normally succeed because
      // the balance was checked immediately before.
    }

    // --------------------------------------------------------
    // NEW BALANCE
    // --------------------------------------------------------

    const {
      data: newBalance,
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
          session.id
        )
        .maybeSingle()

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,

      runId:
        run.id,

      subject,

      level,

      curriculum,

      predictions,

      predictionCount:
        predictions.length,

      sourceQuestionCount:
        dataset.length,

      credits:
        Number(
          newBalance?.balance ||
            0
        ),

      message:
        "Pattern-based predictions generated successfully.",
    })

  } catch (error) {
    console.error(
      "Exam predictor POST:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate predictions.",
      },
      {
        status: 500,
      }
    )
  }
}