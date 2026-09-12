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

export const runtime = "nodejs"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

type SubmittedAnswer = {
  questionId: string
  answer: string
}

function normaliseAnswer(
  value: unknown
) {
  return String(
    value ?? ""
  )
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
}

function answersMatch(
  studentAnswer: string,
  correctAnswer: string
) {
  const student =
    normaliseAnswer(
      studentAnswer
    )

  const correct =
    normaliseAnswer(
      correctAnswer
    )

  if (
    !student ||
    !correct
  ) {
    return false
  }

  if (
    student ===
    correct
  ) {
    return true
  }

  /*
   * Remove common formatting differences.
   */

  const clean = (
    value: string
  ) =>
    value
      .replace(
        /[.,!?;:]/g,
        ""
      )
      .replace(
        /\s+/g,
        ""
      )

  return (
    clean(student) ===
    clean(correct)
  )
}

async function getAuthenticatedStudent() {
  const session =
    await getAIStudentSession()

  if (!session?.id) {
    return null
  }

  const {
    data: student,
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

  if (
    !student ||
    student.account_status !==
      "active"
  ) {
    return null
  }

  return student
}

/*
 * ============================================================
 * GET LATEST SUBMITTED RESULT
 * ============================================================
 */

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const student =
      await getAuthenticatedStudent()

    if (!student) {
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

    const {
      id: mockExamId,
    } =
      await context.params

    if (!mockExamId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Mock test ID is required.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Verify that this mock belongs to this student.
     */

    const {
      data: mockExam,
      error:
        mockError,
    } =
      await supabaseAdmin
        .from(
          "ai_mock_exams"
        )
        .select(
          `
          id,
          title,
          subject,
          level,
          curriculum,
          paper,
          total_questions,
          total_marks,
          duration_minutes,
          created_at
          `
        )
        .eq(
          "id",
          mockExamId
        )
        .eq(
          "ai_student_id",
          student.id
        )
        .maybeSingle()

    if (mockError) {
      console.error(
        "Mock result exam lookup error:",
        mockError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load the mock test.",
        },
        {
          status: 500,
        }
      )
    }

    if (!mockExam) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Mock test not found.",
        },
        {
          status: 404,
        }
      )
    }

    /*
     * Find latest submitted attempt.
     */

    const {
      data: attempts,
      error:
        attemptError,
    } =
      await supabaseAdmin
        .from(
          "ai_mock_attempts"
        )
        .select("*")
        .eq(
          "mock_exam_id",
          mockExamId
        )
        .eq(
          "ai_student_id",
          student.id
        )
        .eq(
          "status",
          "submitted"
        )
        .order(
          "submitted_at",
          {
            ascending: false,
          }
        )
        .limit(1)

    if (attemptError) {
      console.error(
        "Mock result attempt lookup error:",
        attemptError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load your mock result.",
        },
        {
          status: 500,
        }
      )
    }

    const attempt =
      attempts?.[0]

    if (!attempt) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This mock test has not been submitted yet.",
          code:
            "NOT_SUBMITTED",
        },
        {
          status: 404,
        }
      )
    }

    /*
     * Questions
     */

    const {
      data: questions,
      error:
        questionError,
    } =
      await supabaseAdmin
        .from(
          "ai_mock_questions"
        )
        .select(
          `
          id,
          question_number,
          topic,
          subtopic,
          question_text,
          question_type,
          options,
          explanation,
          marks,
          difficulty
          `
        )
        .eq(
          "mock_exam_id",
          mockExamId
        )
        .order(
          "question_number",
          {
            ascending: true,
          }
        )

    if (questionError) {
      console.error(
        "Mock result questions error:",
        questionError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load mock questions.",
        },
        {
          status: 500,
        }
      )
    }

    /*
     * Answers
     */

    const {
      data: answers,
      error:
        answerError,
    } =
      await supabaseAdmin
        .from(
          "ai_mock_answers"
        )
        .select(
          `
          id,
          question_id,
          answer,
          is_correct,
          marks_awarded
          `
        )
        .eq(
          "attempt_id",
          attempt.id
        )

    if (answerError) {
      console.error(
        "Mock result answers error:",
        answerError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load your answers.",
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(
      {
        success: true,

        mock: mockExam,

        attempt,

        questions:
          questions ?? [],

        answers:
          answers ?? [],
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Mock result GET error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while loading the result.",
      },
      {
        status: 500,
      }
    )
  }
}

/*
 * ============================================================
 * POST SUBMISSION
 * ============================================================
 */

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const student =
      await getAuthenticatedStudent()

    if (!student) {
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

    const {
      id: mockExamId,
    } =
      await context.params

    if (!mockExamId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Mock test ID is required.",
        },
        {
          status: 400,
        }
      )
    }

    let body:
      | {
          answers?: SubmittedAnswer[]
        }
      | null = null

    try {
      body =
        await request.json()
    } catch {
      body = {}
    }

    const submittedAnswers =
      Array.isArray(
        body?.answers
      )
        ? body.answers
        : []

    /*
     * Verify mock belongs to student.
     */

    const {
      data: mockExam,
      error:
        mockError,
    } =
      await supabaseAdmin
        .from(
          "ai_mock_exams"
        )
        .select(
          `
          id,
          title,
          subject,
          level,
          curriculum,
          paper,
          total_questions,
          total_marks,
          duration_minutes,
          status
          `
        )
        .eq(
          "id",
          mockExamId
        )
        .eq(
          "ai_student_id",
          student.id
        )
        .maybeSingle()

    if (mockError) {
      console.error(
        "Mock submit exam lookup error:",
        mockError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load the mock test.",
        },
        {
          status: 500,
        }
      )
    }

    if (!mockExam) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Mock test not found.",
        },
        {
          status: 404,
        }
      )
    }

    /*
     * Prevent multiple submissions.
     */

    const {
      data: existingAttempts,
      error:
        existingAttemptError,
    } =
      await supabaseAdmin
        .from(
          "ai_mock_attempts"
        )
        .select(
          "*"
        )
        .eq(
          "mock_exam_id",
          mockExamId
        )
        .eq(
          "ai_student_id",
          student.id
        )
        .eq(
          "status",
          "submitted"
        )
        .order(
          "submitted_at",
          {
            ascending: false,
          }
        )
        .limit(1)

    if (
      existingAttemptError
    ) {
      console.error(
        "Existing attempt lookup error:",
        existingAttemptError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to check previous submissions.",
        },
        {
          status: 500,
        }
      )
    }

    if (
      existingAttempts &&
      existingAttempts.length >
        0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This mock test has already been submitted.",
          code:
            "ALREADY_SUBMITTED",
          attempt:
            existingAttempts[0],
        },
        {
          status: 409,
        }
      )
    }

    /*
     * Get questions including correct answers.
     */

    const {
      data: questions,
      error:
        questionError,
    } =
      await supabaseAdmin
        .from(
          "ai_mock_questions"
        )
        .select(
          `
          id,
          question_number,
          topic,
          subtopic,
          question_text,
          question_type,
          options,
          correct_answer,
          explanation,
          marks,
          difficulty
          `
        )
        .eq(
          "mock_exam_id",
          mockExamId
        )
        .order(
          "question_number",
          {
            ascending: true,
          }
        )

    if (questionError) {
      console.error(
        "Mock submit questions error:",
        questionError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load mock questions.",
        },
        {
          status: 500,
        }
      )
    }

    if (
      !questions ||
      questions.length ===
        0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This mock test contains no questions.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * ---------------------------------------------------------
     * CREATE ATTEMPT
     * ---------------------------------------------------------
     */

    const {
      data: attempt,
      error:
        attemptError,
    } =
      await supabaseAdmin
        .from(
          "ai_mock_attempts"
        )
        .insert({
          mock_exam_id:
            mockExamId,

          ai_student_id:
            student.id,

          total_marks:
            Number(
              mockExam.total_marks ??
                0
            ),

          status:
            "in_progress",
        })
        .select(
          "*"
        )
        .single()

    if (attemptError) {
      console.error(
        "Mock attempt creation error:",
        attemptError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to start your submission.",
        },
        {
          status: 500,
        }
      )
    }

    /*
     * ---------------------------------------------------------
     * MARK ANSWERS
     * ---------------------------------------------------------
     */

    let totalScore = 0
    let correctCount = 0
    let incorrectCount = 0
    let unansweredCount = 0

    const answerRows: Array<{
      attempt_id: string
      question_id: string
      answer: string | null
      is_correct: boolean
      marks_awarded: number
      answered_at: string | null
    }> = []

    for (
      const question of
        questions
    ) {
      const submitted =
        submittedAnswers.find(
          (
            item
          ) =>
            item.questionId ===
            question.id
        )

      const answer =
        String(
          submitted?.answer ??
            ""
        ).trim()

      if (!answer) {
        unansweredCount++

        answerRows.push({
          attempt_id:
            attempt.id,

          question_id:
            question.id,

          answer: null,

          is_correct:
            false,

          marks_awarded:
            0,

          answered_at:
            null,
        })

        continue
      }

      /*
       * Multiple-choice and short-answer questions can be
       * automatically marked.
       *
       * Written/structured answers are currently checked against
       * the AI-generated expected answer. This is intentionally
       * conservative; later we can add Gemini-assisted marking
       * for working/partial marks.
       */

      const correctAnswer =
        String(
          question.correct_answer ??
            ""
        ).trim()

      const isCorrect =
        answersMatch(
          answer,
          correctAnswer
        )

      const marksAwarded =
        isCorrect
          ? Number(
              question.marks ??
                0
            )
          : 0

      if (isCorrect) {
        correctCount++
      } else {
        incorrectCount++
      }

      totalScore +=
        marksAwarded

      answerRows.push({
        attempt_id:
          attempt.id,

        question_id:
          question.id,

        answer,

        is_correct:
          isCorrect,

        marks_awarded:
          marksAwarded,

        answered_at:
          new Date().toISOString(),
      })
    }

    /*
     * ---------------------------------------------------------
     * SAVE ANSWERS
     * ---------------------------------------------------------
     */

    const {
      error:
        answerInsertError,
    } =
      await supabaseAdmin
        .from(
          "ai_mock_answers"
        )
        .insert(
          answerRows
        )

    if (answerInsertError) {
      console.error(
        "Mock answers insert error:",
        answerInsertError
      )

      await supabaseAdmin
        .from(
          "ai_mock_attempts"
        )
        .delete()
        .eq(
          "id",
          attempt.id
        )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to save your answers.",
        },
        {
          status: 500,
        }
      )
    }

    const totalMarks =
      Number(
        mockExam.total_marks ??
          0
      )

    const percentage =
      totalMarks >
      0
        ? Number(
            (
              (totalScore /
                totalMarks) *
              100
            ).toFixed(2)
          )
        : 0

    /*
     * ---------------------------------------------------------
     * COMPLETE ATTEMPT
     * ---------------------------------------------------------
     */

    const submittedAt =
      new Date().toISOString()

    const {
      data:
        completedAttempt,
      error:
        updateAttemptError,
    } =
      await supabaseAdmin
        .from(
          "ai_mock_attempts"
        )
        .update({
          submitted_at:
            submittedAt,

          score:
            totalScore,

          percentage,

          total_marks:
            totalMarks,

          correct_count:
            correctCount,

          incorrect_count:
            incorrectCount,

          unanswered_count:
            unansweredCount,

          status:
            "submitted",

          updated_at:
            submittedAt,
        })
        .eq(
          "id",
          attempt.id
        )
        .select(
          "*"
        )
        .single()

    if (
      updateAttemptError
    ) {
      console.error(
        "Mock attempt completion error:",
        updateAttemptError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Your answers were saved, but the result could not be completed.",
        },
        {
          status: 500,
        }
      )
    }

    /*
     * Mark the exam as completed.
     */

    await supabaseAdmin
      .from(
        "ai_mock_exams"
      )
      .update({
        status:
          "completed",

        updated_at:
          submittedAt,
      })
      .eq(
        "id",
        mockExamId
      )

    /*
     * ---------------------------------------------------------
     * TOPIC PERFORMANCE
     * ---------------------------------------------------------
     */

    const topicMap =
      new Map<
        string,
        {
          topic: string
          marks: number
          awarded: number
          questions: number
          correct: number
        }
      >()

    questions.forEach(
      (
        question,
        index
      ) => {
        const topic =
          question.topic ??
          "General Mathematics"

        const current =
          topicMap.get(
            topic
          ) ?? {
            topic,
            marks: 0,
            awarded: 0,
            questions: 0,
            correct: 0,
          }

        current.questions +=
          1

        current.marks +=
          Number(
            question.marks ??
              0
          )

        const submitted =
          answerRows.find(
            (
              answer
            ) =>
              answer.question_id ===
              question.id
          )

        current.awarded +=
          Number(
            submitted?.marks_awarded ??
              0
          )

        if (
          submitted?.is_correct
        ) {
          current.correct +=
            1
        }

        topicMap.set(
          topic,
          current
        )
      }
    )

    const topicPerformance =
      Array.from(
        topicMap.values()
      ).map(
        (
          item
        ) => ({
          topic:
            item.topic,

          marks:
            item.marks,

          awarded:
            item.awarded,

          questions:
            item.questions,

          correct:
            item.correct,

          percentage:
            item.marks >
            0
              ? Number(
                  (
                    (item.awarded /
                      item.marks) *
                    100
                  ).toFixed(
                    1
                  )
                )
              : 0,
        })
      )
      .sort(
        (
          a,
          b
        ) =>
          a.percentage -
          b.percentage
      )

    return NextResponse.json(
      {
        success: true,

        mock: mockExam,

        attempt:
          completedAttempt,

        topicPerformance,

        redirect:
          `/ai/mock-lab/${mockExamId}/results`,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Mock submission API error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while submitting your mock test.",
      },
      {
        status: 500,
      }
    )
  }
}