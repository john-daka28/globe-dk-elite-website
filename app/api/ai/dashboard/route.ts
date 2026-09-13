import {
  NextResponse,
} from "next/server"

import {
  getAIStudentSession,
} from "@/lib/ai-auth"

import {
  supabaseAdmin,
} from "@/lib/supabase-admin"

export const runtime = "nodejs"

type MockAttempt = {
  id: string
  mock_exam_id: string
  ai_student_id: string
  started_at: string
  submitted_at: string | null
  score: number
  percentage: number
  total_marks: number
  correct_count: number
  incorrect_count: number
  unanswered_count: number
  status: string
  created_at: string
}

type MockExam = {
  id: string
  title: string
  subject: string
  level: string
  curriculum: string
  paper: string
  difficulty: string
  created_at: string
}

type MockQuestion = {
  id: string
  mock_exam_id: string
  question_number: number
  topic: string | null
  subtopic: string | null
  marks: number
}

type MockAnswer = {
  id: string
  mock_question_id: string
  marks_awarded: number
  is_correct: boolean | null
  attempt_id: string | null
}

type PredictionRun = {
  id: string
  subject: string
  level: string
  curriculum: string
  paper: string | null
  papers_analysed: number
  questions_analysed: number
  model_name: string | null
  status: string
  created_at: string
  completed_at: string | null
  ai_student_id: string | null
  paper_1_prediction_count: number | null
  paper_2_prediction_count: number | null
  source_question_count: number | null
}

function unauthorizedResponse() {
  return NextResponse.json(
    {
      authenticated: false,
      error: "Authentication required.",
    },
    {
      status: 401,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  )
}

function roundNumber(
  value: number,
  decimals = 1
) {
  const factor =
    Math.pow(10, decimals)

  return (
    Math.round(value * factor) /
    factor
  )
}

function formatActivityDate(
  value: string
) {
  try {
    return new Date(value)
      .toISOString()
  } catch {
    return value
  }
}

export async function GET() {
  try {
    /*
    ============================================================
    AUTHENTICATED AI STUDENT
    ============================================================
    */

    const session =
      await getAIStudentSession()

    if (!session?.id) {
      return unauthorizedResponse()
    }

    /*
    ============================================================
    VERIFY AI STUDENT
    ============================================================
    */

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
        .eq("id", session.id)
        .maybeSingle()

    if (studentError) {
      console.error(
        "AI dashboard student lookup error:",
        studentError
      )

      return NextResponse.json(
        {
          error:
            "Unable to load your student account.",
        },
        {
          status: 500,
        }
      )
    }

    if (!student) {
      return unauthorizedResponse()
    }

    if (
      student.account_status !==
      "active"
    ) {
      return NextResponse.json(
        {
          authenticated: false,
          error:
            "Your account is not active.",
        },
        {
          status: 403,
        }
      )
    }

    /*
    ============================================================
    CREDITS
    ============================================================
    */

    const {
      data: creditBalance,
      error: creditError,
    } =
      await supabaseAdmin
        .from("ai_credit_balances")
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
        "AI dashboard credit lookup error:",
        creditError
      )
    }

    const credits =
      creditBalance?.balance ?? 0

    /*
    ============================================================
    MOCK ATTEMPTS
    ============================================================
    */

    const {
      data: attemptsData,
      error: attemptsError,
    } =
      await supabaseAdmin
        .from("ai_mock_attempts")
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
          created_at
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

    if (attemptsError) {
      console.error(
        "AI dashboard attempts lookup error:",
        attemptsError
      )

      return NextResponse.json(
        {
          error:
            "Unable to load your mock exam statistics.",
        },
        {
          status: 500,
        }
      )
    }

    const attempts =
      (attemptsData ??
        []) as MockAttempt[]

    /*
    ============================================================
    ONLY SUBMITTED ATTEMPTS COUNT AS PERFORMANCE RESULTS
    ============================================================
    */

    const submittedAttempts =
      attempts.filter(
        (attempt) =>
          attempt.status ===
            "submitted" ||
          attempt.submitted_at !==
            null
      )

    /*
    ============================================================
    MOCK EXAMS
    ============================================================
    */

    const mockExamIds =
      Array.from(
        new Set(
          attempts.map(
            (attempt) =>
              attempt.mock_exam_id
          )
        )
      )

    let mockExams: MockExam[] = []

    if (mockExamIds.length > 0) {
      const {
        data: mockExamsData,
        error: mockExamsError,
      } =
        await supabaseAdmin
          .from("ai_mock_exams")
          .select(
            `
            id,
            title,
            subject,
            level,
            curriculum,
            paper,
            difficulty,
            created_at
            `
          )
          .in(
            "id",
            mockExamIds
          )

      if (mockExamsError) {
        console.error(
          "AI dashboard mock exams lookup error:",
          mockExamsError
        )
      } else {
        mockExams =
          (mockExamsData ??
            []) as MockExam[]
      }
    }

    /*
    ============================================================
    PERFORMANCE
    ============================================================
    */

    let overallPerformance =
      null as number | null

    let bestPerformance =
      null as number | null

    let totalMarksScored = 0
    let totalMarksAvailable = 0

    if (
      submittedAttempts.length >
      0
    ) {
      const percentageTotal =
        submittedAttempts.reduce(
          (
            total,
            attempt
          ) =>
            total +
            Number(
              attempt.percentage ??
                0
            ),
          0
        )

      overallPerformance =
        roundNumber(
          percentageTotal /
            submittedAttempts.length
        )

      bestPerformance =
        roundNumber(
          Math.max(
            ...submittedAttempts.map(
              (attempt) =>
                Number(
                  attempt.percentage ??
                    0
                )
            )
          )
        )

      totalMarksScored =
        submittedAttempts.reduce(
          (
            total,
            attempt
          ) =>
            total +
            Number(
              attempt.score ?? 0
            ),
          0
        )

      totalMarksAvailable =
        submittedAttempts.reduce(
          (
            total,
            attempt
          ) =>
            total +
            Number(
              attempt.total_marks ??
                0
            ),
          0
        )
    }

    /*
    ============================================================
    QUESTIONS FOR COMPLETED MOCKS
    ============================================================
    */

    const submittedExamIds =
      Array.from(
        new Set(
          submittedAttempts.map(
            (attempt) =>
              attempt.mock_exam_id
          )
        )
      )

    let questions: MockQuestion[] =
      []

    if (
      submittedExamIds.length > 0
    ) {
      const {
        data: questionsData,
        error: questionsError,
      } =
        await supabaseAdmin
          .from("ai_mock_questions")
          .select(
            `
            id,
            mock_exam_id,
            question_number,
            topic,
            subtopic,
            marks
            `
          )
          .in(
            "mock_exam_id",
            submittedExamIds
          )

      if (questionsError) {
        console.error(
          "AI dashboard questions lookup error:",
          questionsError
        )
      } else {
        questions =
          (questionsData ??
            []) as MockQuestion[]
      }
    }

    /*
    ============================================================
    ANSWERS
    ============================================================
    */

    const questionIds =
      questions.map(
        (question) =>
          question.id
      )

    let answers: MockAnswer[] =
      []

    if (questionIds.length > 0) {
      const {
        data: answersData,
        error: answersError,
      } =
        await supabaseAdmin
          .from("ai_mock_answers")
          .select(
            `
            id,
            mock_question_id,
            marks_awarded,
            is_correct,
            attempt_id
            `
          )
          .in(
            "mock_question_id",
            questionIds
          )

      if (answersError) {
        console.error(
          "AI dashboard answers lookup error:",
          answersError
        )
      } else {
        answers =
          (answersData ??
            []) as MockAnswer[]
      }
    }

    /*
    ============================================================
    WEAK TOPICS
    ============================================================

    We calculate weak topics from questions answered in
    submitted attempts.

    A topic becomes useful when there is enough answer data.
    ============================================================
    */

    type TopicStats = {
      topic: string
      attempted: number
      correct: number
      marksAwarded: number
      marksAvailable: number
    }

    const topicMap =
      new Map<
        string,
        TopicStats
      >()

    const submittedAttemptIds =
      new Set(
        submittedAttempts.map(
          (attempt) =>
            attempt.id
        )
      )

    for (
      const answer of answers
    ) {
      if (
        answer.attempt_id &&
        !submittedAttemptIds.has(
          answer.attempt_id
        )
      ) {
        continue
      }

      const question =
        questions.find(
          (item) =>
            item.id ===
            answer.mock_question_id
        )

      if (!question) {
        continue
      }

      const topic =
        question.topic?.trim() ||
        question.subtopic?.trim() ||
        "General"

      const existing =
        topicMap.get(topic) ??
        {
          topic,
          attempted: 0,
          correct: 0,
          marksAwarded: 0,
          marksAvailable: 0,
        }

      existing.attempted += 1

      if (
        answer.is_correct ===
        true
      ) {
        existing.correct += 1
      }

      existing.marksAwarded +=
        Number(
          answer.marks_awarded ??
            0
        )

      existing.marksAvailable +=
        Number(
          question.marks ?? 0
        )

      topicMap.set(
        topic,
        existing
      )
    }

    const weakTopics =
      Array.from(
        topicMap.values()
      )
        .map(
          (topic) => {
            const accuracy =
              topic.attempted >
              0
                ? (
                    topic.correct /
                    topic.attempted
                  ) *
                  100
                : 0

            const markAccuracy =
              topic.marksAvailable >
              0
                ? (
                    topic.marksAwarded /
                    topic.marksAvailable
                  ) *
                  100
                : accuracy

            return {
              topic:
                topic.topic,
              attempted:
                topic.attempted,
              correct:
                topic.correct,
              accuracy:
                roundNumber(
                  accuracy
                ),
              markAccuracy:
                roundNumber(
                  markAccuracy
                ),
            }
          }
        )
        .filter(
          (topic) =>
            topic.attempted > 0
        )
        .sort(
          (a, b) =>
            a.markAccuracy -
            b.markAccuracy
        )
        .slice(0, 5)

    /*
    ============================================================
    PREDICTION RUNS
    ============================================================
    */

    const {
      data: predictionRunsData,
      error: predictionRunsError,
    } =
      await supabaseAdmin
        .from("ai_prediction_runs")
        .select(
          `
          id,
          subject,
          level,
          curriculum,
          paper,
          papers_analysed,
          questions_analysed,
          model_name,
          status,
          created_at,
          completed_at,
          ai_student_id,
          paper_1_prediction_count,
          paper_2_prediction_count,
          source_question_count
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
        .limit(20)

    if (predictionRunsError) {
      console.error(
        "AI dashboard prediction runs lookup error:",
        predictionRunsError
      )
    }

    const predictionRuns =
      (predictionRunsData ??
        []) as PredictionRun[]

    /*
    ============================================================
    STUDY ACTIVITY
    ============================================================
    */

    const activity: Array<{
      id: string
      type:
        | "mock"
        | "prediction"
      title: string
      description: string
      createdAt: string
      percentage?: number
      status: string
    }> = []

    for (
      const attempt of attempts
    ) {
      const exam =
        mockExams.find(
          (item) =>
            item.id ===
            attempt.mock_exam_id
        )

      const title =
        exam?.title ||
        "Mock Exam"

      if (
        attempt.status ===
        "submitted" ||
        attempt.submitted_at
      ) {
        activity.push({
          id:
            `mock-${attempt.id}`,
          type: "mock",
          title,
          description:
            exam
              ? `${exam.paper} • ${exam.subject}`
              : "Mock examination completed",
          createdAt:
            formatActivityDate(
              attempt.submitted_at ??
                attempt.created_at
            ),
          percentage:
            roundNumber(
              Number(
                attempt.percentage ??
                  0
              )
            ),
          status:
            "Completed",
        })
      } else {
        activity.push({
          id:
            `mock-${attempt.id}`,
          type: "mock",
          title,
          description:
            exam
              ? `${exam.paper} • ${exam.subject}`
              : "Mock examination",
          createdAt:
            formatActivityDate(
              attempt.created_at
            ),
          status:
            "In progress",
        })
      }
    }

    for (
      const prediction of predictionRuns
    ) {
      activity.push({
        id:
          `prediction-${prediction.id}`,
        type: "prediction",
        title:
          "Exam prediction",
        description:
          prediction.paper
            ? `${prediction.subject} • ${prediction.paper}`
            : `${prediction.subject} • ${prediction.level}`,
        createdAt:
          formatActivityDate(
            prediction.created_at
          ),
        status:
          prediction.status,
      })
    }

    activity.sort(
      (a, b) =>
        new Date(
          b.createdAt
        ).getTime() -
        new Date(
          a.createdAt
        ).getTime()
    )

    const recentActivity =
      activity.slice(0, 5)

    /*
    ============================================================
    STUDY ACTIVITY SUMMARY
    ============================================================
    */

    const totalMockAttempts =
      attempts.length

    const completedMockAttempts =
      submittedAttempts.length

    const predictionCount =
      predictionRuns.length

    const totalStudyActivities =
      totalMockAttempts +
      predictionCount

    /*
    ============================================================
    RETURN
    ============================================================
    */

    return NextResponse.json(
      {
        authenticated: true,

        student: {
          id: student.id,
          firstName:
            student.first_name,
          lastName:
            student.last_name,
          email:
            student.email,
          level:
            student.level,
          curriculum:
            student.curriculum,
        },

        credits: {
          balance: credits,
        },

        statistics: {
          overallPerformance,
          bestPerformance,

          totalMockAttempts,
          completedMockAttempts,

          predictionCount,

          totalStudyActivities,

          totalMarksScored:
            roundNumber(
              totalMarksScored
            ),

          totalMarksAvailable,

          weakTopics,
        },

        recentActivity,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    )
  } catch (error) {
    console.error(
      "AI dashboard GET error:",
      error
    )

    return NextResponse.json(
      {
        error:
          "Unable to load your AI dashboard.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    )
  }
}