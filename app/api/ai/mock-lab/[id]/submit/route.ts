
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

type QuestionData = {
  options?: string[] | null

  difficulty?:
    | "easy"
    | "medium"
    | "hard"
    | string
    | null

  prediction_id?: string | null

  paper?: string | null

  source?: string | null

  generated_from_prediction?: boolean
}

/* ============================================================
   ANSWER HELPERS
   ============================================================ */

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
   * Remove common punctuation / spacing
   * differences.
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

function getQuestionData(
  value: unknown
): QuestionData {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return value as QuestionData
  }

  return {}
}

function getQuestionOptions(
  value: unknown
) {
  const data =
    getQuestionData(
      value
    )

  return Array.isArray(
    data.options
  )
    ? data.options.map(
        option =>
          String(option)
      )
    : null
}

function getQuestionDifficulty(
  value: unknown
) {
  const data =
    getQuestionData(
      value
    )

  return (
    data.difficulty ??
    "medium"
  )
}

/* ============================================================
   AUTHENTICATED AI STUDENT
   ============================================================ */

async function getAuthenticatedStudent() {
  const session =
    await getAIStudentSession()

  if (!session?.id) {
    return null
  }

  const {
    data: student,
    error,
  } =
    await supabaseAdmin
      .from(
        "ai_students"
      )
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

  if (error) {
    console.error(
      "AI student lookup error:",
      error
    )

    return null
  }

  if (
    !student ||
    student.account_status !==
      "active"
  ) {
    return null
  }

  return student
}

/* ============================================================
   FIND NORMAL USERS.ID
   ============================================================ */

async function getLinkedUserId(
  studentEmail: string
) {
  const {
    data: user,
    error,
  } =
    await supabaseAdmin
      .from(
        "users"
      )
      .select(
        "id"
      )
      .eq(
        "email",
        studentEmail
      )
      .maybeSingle()

  if (error) {
    console.error(
      "Linked normal user lookup error:",
      error
    )

    return null
  }

  return user?.id ?? null
}

/* ============================================================
   GET LATEST SUBMITTED RESULT
   ============================================================ */

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
     * ========================================================
     * LOAD MOCK EXAM
     * ========================================================
     *
     * ai_mock_exams does NOT contain:
     *
     * - total_questions
     * - updated_at
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
          total_marks,
          duration_minutes,
          created_at,
          status,
          score,
          percentage,
          completed_at
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

    /* ========================================================
       LATEST SUBMITTED ATTEMPT
       ======================================================== */

    const {
      data: attempts,
      error:
        attemptError,
    } =
      await supabaseAdmin
        .from(
          "ai_mock_attempts"
        )
        .select(
          `
          id,
          mock_exam_id,
          ai_student_id,
          started_at,
          submitted_at,
          score,
          percentage,
          total_marks,
          correct_count,
          incorrect_count,
          unanswered_count,
          status,
          created_at,
          updated_at
          `
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

    /* ========================================================
       QUESTIONS
       ======================================================== */

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
          question_data,
          explanation,
          marks
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

    const formattedQuestions =
      (
        questions ?? []
      ).map(
        question => ({
          id:
            question.id,

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

          options:
            getQuestionOptions(
              question.question_data
            ),

          explanation:
            question.explanation,

          marks:
            question.marks,

          difficulty:
            getQuestionDifficulty(
              question.question_data
            ),
        })
      )

    /* ========================================================
       ANSWERS
       ======================================================== */

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
          mock_question_id,
          user_id,
          answer_text,
          marks_awarded,
          is_correct,
          ai_feedback,
          ai_explanation,
          created_at,
          updated_at,
          attempt_id,
          question_id
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

    const totalQuestions =
      formattedQuestions.length

    const formattedMock = {
      ...mockExam,

      total_questions:
        totalQuestions,

      totalQuestions:
        totalQuestions,

      total_marks:
        Number(
          mockExam.total_marks ??
            0
        ),

      totalMarks:
        Number(
          mockExam.total_marks ??
            0
        ),

      duration_minutes:
        Number(
          mockExam.duration_minutes ??
            0
        ),

      durationMinutes:
        Number(
          mockExam.duration_minutes ??
            0
        ),
    }

    return NextResponse.json(
      {
        success: true,

        mock:
          formattedMock,

        attempt,

        questions:
          formattedQuestions,

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

/* ============================================================
   POST SUBMISSION
   ============================================================ */

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

    /*
     * ========================================================
     * GET LINKED NORMAL USER
     * ========================================================
     *
     * ai_mock_answers.user_id references users.id.
     */

    const userId =
      await getLinkedUserId(
        student.email
      )

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your AI student account is not linked to a normal user account.",
          code:
            "USER_ACCOUNT_NOT_LINKED",
        },
        {
          status: 409,
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

    /* ========================================================
       VERIFY MOCK BELONGS TO STUDENT
       ======================================================== */

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

    /* ========================================================
       PREVENT MULTIPLE SUBMISSIONS
       ======================================================== */

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
          `
          id,
          mock_exam_id,
          ai_student_id,
          started_at,
          submitted_at,
          score,
          percentage,
          total_marks,
          correct_count,
          incorrect_count,
          unanswered_count,
          status,
          created_at,
          updated_at
          `
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

    /* ========================================================
       GET QUESTIONS
       ======================================================== */

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
          question_data,
          correct_answer,
          explanation,
          marks
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

    /* ========================================================
       CREATE ATTEMPT
       ======================================================== */

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
          `
          id,
          mock_exam_id,
          ai_student_id,
          started_at,
          submitted_at,
          score,
          percentage,
          total_marks,
          correct_count,
          incorrect_count,
          unanswered_count,
          status,
          created_at,
          updated_at
          `
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

    /* ========================================================
       MARK ANSWERS
       ======================================================== */

    let totalScore = 0

    let correctCount = 0

    let incorrectCount = 0

    let unansweredCount = 0

    /*
     * This matches the ACTUAL ai_mock_answers schema.
     */

    const answerRows: Array<{
      mock_question_id: string
      user_id: string
      answer_text: string | null
      marks_awarded: number
      is_correct: boolean
      ai_feedback: string | null
      ai_explanation: string | null
      attempt_id: string
      question_id: string
    }> = []

    for (
      const question of
        questions
    ) {
      const submitted =
        submittedAnswers.find(
          item =>
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
          mock_question_id:
            question.id,

          user_id:
            userId,

          answer_text:
            null,

          marks_awarded:
            0,

          is_correct:
            false,

          ai_feedback:
            "No answer submitted.",

          ai_explanation:
            question.explanation ??
            null,

          attempt_id:
            attempt.id,

          question_id:
            question.id,
        })

        continue
      }

      /*
       * Current automatic marking.
       *
       * The expected answer is stored in
       * ai_mock_questions.correct_answer.
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
        mock_question_id:
          question.id,

        user_id:
          userId,

        answer_text:
          answer,

        marks_awarded:
          marksAwarded,

        is_correct:
          isCorrect,

        ai_feedback:
          isCorrect
            ? "Correct answer."
            : "The submitted answer does not match the expected answer.",

        ai_explanation:
          question.explanation ??
          null,

        attempt_id:
          attempt.id,

        question_id:
          question.id,
      })
    }

    /* ========================================================
       SAVE ANSWERS
       ======================================================== */

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

    /* ========================================================
       CALCULATE RESULT
       ======================================================== */

    const totalMarks =
      Number(
        mockExam.total_marks ??
          0
      )

    const percentage =
      totalMarks > 0
        ? Number(
            (
              (
                totalScore /
                totalMarks
              ) *
              100
            ).toFixed(2)
          )
        : 0

    /* ========================================================
       COMPLETE ATTEMPT
       ======================================================== */

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
          `
          id,
          mock_exam_id,
          ai_student_id,
          started_at,
          submitted_at,
          score,
          percentage,
          total_marks,
          correct_count,
          incorrect_count,
          unanswered_count,
          status,
          created_at,
          updated_at
          `
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

    /* ========================================================
       MARK EXAM COMPLETED
       ======================================================== */

    const {
      error:
        examUpdateError,
    } =
      await supabaseAdmin
        .from(
          "ai_mock_exams"
        )
        .update({
          status:
            "completed",

          completed_at:
            submittedAt,

          score:
            totalScore,

          percentage,
        })
        .eq(
          "id",
          mockExamId
        )
        .eq(
          "ai_student_id",
          student.id
        )

    if (examUpdateError) {
      console.error(
        "Mock exam completion update error:",
        examUpdateError
      )

      /*
       * The attempt and answers have already
       * been saved, so do not delete them.
       */
    }

    /* ========================================================
       TOPIC PERFORMANCE
       ======================================================== */

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
      question => {
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
            answer =>
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
      )
        .map(
          item => ({
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
              item.marks > 0
                ? Number(
                    (
                      (
                        item.awarded /
                        item.marks
                      ) *
                      100
                    ).toFixed(1)
                  )
                : 0,
          })
        )
        .sort(
          (a, b) =>
            a.percentage -
            b.percentage
        )

    /* ========================================================
       FORMAT RESPONSE
       ======================================================== */

    const formattedMock = {
      ...mockExam,

      total_questions:
        questions.length,

      totalQuestions:
        questions.length,

      total_marks:
        totalMarks,

      totalMarks:
        totalMarks,

      duration_minutes:
        Number(
          mockExam.duration_minutes ??
            0
        ),

      durationMinutes:
        Number(
          mockExam.duration_minutes ??
            0
        ),
    }

    return NextResponse.json(
      {
        success: true,

        mock:
          formattedMock,

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
