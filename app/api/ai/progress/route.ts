import { NextResponse } from "next/server"

import {
  getAIStudentSession,
} from "@/lib/ai-auth"

import {
  supabaseAdmin,
} from "@/lib/supabase-admin"

export const runtime = "nodejs"

type TopicStat = {
  topic: string
  attempted: number
  correct: number
  marks: number
  percentage: number
}

type RecentMock = {
  id: string
  title: string
  paper: string
  score: number
  percentage: number
  totalMarks: number
  correctCount: number
  incorrectCount: number
  unansweredCount: number
  submittedAt: string | null
}

type RecentRevision = {
  id: string
  title: string
  topic: string | null
  mode: string
  updatedAt: string
  lastMessageAt: string | null
}

export async function GET() {
  try {
    /**
     * ==========================================================
     * 1. AUTHENTICATE AI STUDENT
     * ==========================================================
     */

    const session = await getAIStudentSession()

    if (!session?.id) {
      return NextResponse.json(
        {
          authenticated: false,
          student: null,
          credits: {
            balance: 0,
          },
        },
        {
          status: 401,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      )
    }

    /**
     * ==========================================================
     * 2. GET AI STUDENT
     * ==========================================================
     */

    const {
      data: student,
      error: studentError,
    } = await supabaseAdmin
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
        "Progress student lookup error:",
        studentError
      )

      return NextResponse.json(
        {
          authenticated: false,
          student: null,
          credits: {
            balance: 0,
          },
        },
        {
          status: 401,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      )
    }

    if (!student) {
      return NextResponse.json(
        {
          authenticated: false,
          student: null,
          credits: {
            balance: 0,
          },
        },
        {
          status: 401,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      )
    }

    /**
     * ==========================================================
     * 3. CHECK ACCOUNT STATUS
     * ==========================================================
     */

    if (student.account_status !== "active") {
      return NextResponse.json(
        {
          authenticated: false,
          student: null,
          credits: {
            balance: 0,
          },
        },
        {
          status: 403,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      )
    }

    /**
     * ==========================================================
     * 4. GET AI CREDITS
     * ==========================================================
     */

    const {
      data: creditBalance,
      error: creditError,
    } = await supabaseAdmin
      .from("ai_credit_balances")
      .select("balance")
      .eq("ai_student_id", student.id)
      .maybeSingle()

    if (creditError) {
      console.error(
        "Progress credit lookup error:",
        creditError
      )
    }

    const balance = Number(
      creditBalance?.balance ?? 0
    )

    /**
     * ==========================================================
     * 5. FIND NORMAL USER ACCOUNT
     *
     * Some existing mock answer records use users.id.
     * ==========================================================
     */

    let normalUserId: string | null = null

    if (student.email) {
      const {
        data: normalUser,
        error: normalUserError,
      } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", student.email)
        .maybeSingle()

      if (normalUserError) {
        console.error(
          "Progress normal user lookup error:",
          normalUserError
        )
      }

      normalUserId = normalUser?.id ?? null
    }

    /**
     * ==========================================================
     * 6. GET MOCK ATTEMPTS
     * ==========================================================
     */

    const {
      data: attempts,
      error: attemptsError,
    } = await supabaseAdmin
      .from("ai_mock_attempts")
      .select(
        `
        id,
        mock_exam_id,
        started_at,
        submitted_at,
        score,
        percentage,
        total_marks,
        correct_count,
        incorrect_count,
        unanswered_count,
        status
        `
      )
      .eq("ai_student_id", student.id)
      .order("created_at", {
        ascending: false,
      })

    if (attemptsError) {
      console.error(
        "Progress attempts lookup error:",
        attemptsError
      )
    }

    const safeAttempts = attempts ?? []

    /**
     * ==========================================================
     * 7. GET MOCK EXAMS
     * ==========================================================
     */

    const mockExamIds = Array.from(
      new Set(
        safeAttempts
          .map((attempt) => attempt.mock_exam_id)
          .filter(Boolean)
      )
    )

    let mockExams: any[] = []

    if (mockExamIds.length > 0) {
      const {
        data,
        error,
      } = await supabaseAdmin
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
          focus_type,
          duration_minutes,
          total_marks,
          created_at
          `
        )
        .in("id", mockExamIds)

      if (error) {
        console.error(
          "Progress mock exam lookup error:",
          error
        )
      }

      mockExams = data ?? []
    }

    const mockExamMap = new Map(
      mockExams.map((exam) => [
        exam.id,
        exam,
      ])
    )

    /**
     * ==========================================================
     * 8. CALCULATE OVERALL MOCK STATISTICS
     * ==========================================================
     */

    const submittedAttempts =
      safeAttempts.filter(
        (attempt) =>
          attempt.status === "submitted"
      )

    const mockCount =
      submittedAttempts.length

    const totalScore = submittedAttempts.reduce(
      (sum, attempt) =>
        sum + Number(attempt.score ?? 0),
      0
    )

    const totalMarks = submittedAttempts.reduce(
      (sum, attempt) =>
        sum + Number(
          attempt.total_marks ?? 0
        ),
      0
    )

    const averagePercentage =
      mockCount > 0
        ? submittedAttempts.reduce(
            (sum, attempt) =>
              sum +
              Number(
                attempt.percentage ?? 0
              ),
            0
          ) / mockCount
        : 0

    const bestAttempt =
      submittedAttempts.length > 0
        ? submittedAttempts.reduce(
            (best, current) =>
              Number(
                current.percentage ?? 0
              ) >
              Number(
                best.percentage ?? 0
              )
                ? current
                : best
          )
        : null

    const latestAttempt =
      submittedAttempts[0] ?? null

    const questionsAttempted =
      submittedAttempts.reduce(
        (sum, attempt) =>
          sum +
          Number(
            attempt.correct_count ?? 0
          ) +
          Number(
            attempt.incorrect_count ?? 0
          ),
        0
      )

    const correctAnswers =
      submittedAttempts.reduce(
        (sum, attempt) =>
          sum +
          Number(
            attempt.correct_count ?? 0
          ),
        0
      )

    const incorrectAnswers =
      submittedAttempts.reduce(
        (sum, attempt) =>
          sum +
          Number(
            attempt.incorrect_count ?? 0
          ),
        0
      )

    const unanswered =
      submittedAttempts.reduce(
        (sum, attempt) =>
          sum +
          Number(
            attempt.unanswered_count ?? 0
          ),
        0
      )

    const accuracy =
      questionsAttempted > 0
        ? (correctAnswers /
            questionsAttempted) *
          100
        : 0

    /**
     * ==========================================================
     * 9. GET QUESTIONS FROM MOCK EXAMS
     * ==========================================================
     */

    let questions: any[] = []

    if (mockExamIds.length > 0) {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from("ai_mock_questions")
        .select(
          `
          id,
          mock_exam_id,
          question_number,
          topic,
          subtopic,
          marks,
          question_text
          `
        )
        .in(
          "mock_exam_id",
          mockExamIds
        )

      if (error) {
        console.error(
          "Progress mock questions lookup error:",
          error
        )
      }

      questions = data ?? []
    }

    /**
     * ==========================================================
     * 10. GET ANSWERS FOR NORMAL USER
     *
     * Answers are currently linked to users.id.
     * ==========================================================
     */

    let answers: any[] = []

    if (
      normalUserId &&
      questions.length > 0
    ) {
      const questionIds = questions.map(
        (question) => question.id
      )

      const {
        data,
        error,
      } = await supabaseAdmin
        .from("ai_mock_answers")
        .select(
          `
          id,
          mock_question_id,
          user_id,
          answer_text,
          marks_awarded,
          is_correct,
          attempt_id,
          created_at
          `
        )
        .eq(
          "user_id",
          normalUserId
        )
        .in(
          "mock_question_id",
          questionIds
        )

      if (error) {
        console.error(
          "Progress mock answers lookup error:",
          error
        )
      }

      answers = data ?? []
    }

    /**
     * ==========================================================
     * 11. TOPIC PERFORMANCE
     * ==========================================================
     */

    const questionMap = new Map(
      questions.map((question) => [
        question.id,
        question,
      ])
    )

    const topicMap =
      new Map<string, TopicStat>()

    for (const answer of answers) {
      const question =
        questionMap.get(
          answer.mock_question_id
        )

      if (!question) {
        continue
      }

      const topic =
        question.topic?.trim() ||
        "Other"

      if (!topicMap.has(topic)) {
        topicMap.set(topic, {
          topic,
          attempted: 0,
          correct: 0,
          marks: 0,
          percentage: 0,
        })
      }

      const current =
        topicMap.get(topic)!

      current.attempted += 1

      if (answer.is_correct === true) {
        current.correct += 1
      }

      current.marks += Number(
        answer.marks_awarded ?? 0
      )
    }

    const topicStats = Array.from(
      topicMap.values()
    )
      .map((item) => ({
        ...item,
        percentage:
          item.attempted > 0
            ? (item.correct /
                item.attempted) *
              100
            : 0,
      }))
      .sort(
        (a, b) =>
          b.percentage -
          a.percentage
      )

    const strongestTopics =
      topicStats
        .filter(
          (topic) =>
            topic.attempted >= 1
        )
        .slice(0, 5)

    const weakestTopics =
      [...topicStats]
        .filter(
          (topic) =>
            topic.attempted >= 1
        )
        .sort(
          (a, b) =>
            a.percentage -
            b.percentage
        )
        .slice(0, 5)

    /**
     * ==========================================================
     * 12. GET AI PREDICTIONS
     * ==========================================================
     */

    const {
      data: predictionRuns,
      error: predictionRunError,
    } = await supabaseAdmin
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
        completed_at,
        created_at,
        paper_1_prediction_count,
        paper_2_prediction_count,
        source_question_count
        `
      )
      .eq(
        "ai_student_id",
        student.id
      )
      .order("created_at", {
        ascending: false,
      })

    if (predictionRunError) {
      console.error(
        "Progress prediction runs error:",
        predictionRunError
      )
    }

    const predictionRunIds =
      (predictionRuns ?? []).map(
        (run) => run.id
      )

    let predictions: any[] = []

    if (
      predictionRunIds.length > 0
    ) {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from("ai_predictions")
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
          revision_advice,
          concept_family,
          question_family,
          practice_question_concept
          `
        )
        .in(
          "prediction_run_id",
          predictionRunIds
        )
        .order(
          "prediction_score",
          {
            ascending: false,
          }
        )

      if (error) {
        console.error(
          "Progress predictions error:",
          error
        )
      }

      predictions = data ?? []
    }

    const latestPredictionRun =
      predictionRuns?.[0] ?? null

    const latestPredictions =
      latestPredictionRun
        ? predictions.filter(
            (prediction) =>
              prediction.prediction_run_id ===
              latestPredictionRun.id
          )
        : []

    const predictionAreas =
      latestPredictions
        .slice(0, 6)
        .map((prediction) => ({
          id: prediction.id,
          topic: prediction.topic,
          subtopic:
            prediction.subtopic,
          paper: prediction.paper,
          predictionScore:
            Number(
              prediction.prediction_score ??
                0
            ),
          confidence:
            prediction.confidence,
          revisionAdvice:
            prediction.revision_advice,
          conceptFamily:
            prediction.concept_family,
          questionFamily:
            prediction.question_family,
        }))

    /**
     * ==========================================================
     * 13. REVISION SESSIONS
     *
     * These tables are created by the Revision Coach feature.
     * If they do not exist yet, the dashboard simply skips them.
     * ==========================================================
     */

    let revisionSessions:
      any[] = []

    let revisionSessionsAvailable =
      true

    const {
      data: revisionData,
      error: revisionError,
    } = await supabaseAdmin
      .from(
        "ai_revision_sessions"
      )
      .select(
        `
        id,
        title,
        topic,
        mode,
        status,
        created_at,
        updated_at,
        last_message_at
        `
      )
      .eq(
        "ai_student_id",
        student.id
      )
      .order("updated_at", {
        ascending: false,
      })
      .limit(10)

    if (revisionError) {
      console.error(
        "Progress revision sessions error:",
        revisionError
      )

      revisionSessionsAvailable =
        false
    } else {
      revisionSessions =
        revisionData ?? []
    }

    const recentRevisionSessions:
      RecentRevision[] =
      revisionSessions.map(
        (item) => ({
          id: item.id,
          title:
            item.title ||
            "Revision Session",
          topic: item.topic,
          mode:
            item.mode ||
            "General Revision",
          updatedAt:
            item.updated_at,
          lastMessageAt:
            item.last_message_at,
        })
      )

    /**
     * ==========================================================
     * 14. RECENT MOCKS
     * ==========================================================
     */

    const recentMocks:
      RecentMock[] =
      submittedAttempts
        .slice(0, 8)
        .map((attempt) => {
          const exam =
            mockExamMap.get(
              attempt.mock_exam_id
            )

          return {
            id: attempt.id,
            title:
              exam?.title ||
              "AI Mock Examination",
            paper:
              exam?.paper ||
              "Mixed",
            score: Number(
              attempt.score ?? 0
            ),
            percentage: Number(
              attempt.percentage ?? 0
            ),
            totalMarks: Number(
              attempt.total_marks ?? 0
            ),
            correctCount: Number(
              attempt.correct_count ?? 0
            ),
            incorrectCount: Number(
              attempt.incorrect_count ?? 0
            ),
            unansweredCount: Number(
              attempt.unanswered_count ?? 0
            ),
            submittedAt:
              attempt.submitted_at,
          }
        })

    /**
     * ==========================================================
     * 15. PROGRESS TREND
     * ==========================================================
     *
     * Oldest -> newest, maximum 8 points.
     * ==========================================================
     */

    const progressTrend =
      [...submittedAttempts]
        .reverse()
        .slice(-8)
        .map(
          (
            attempt,
            index
          ) => {
            const exam =
              mockExamMap.get(
                attempt.mock_exam_id
              )

            return {
              attemptNumber:
                index + 1,
              percentage: Number(
                attempt.percentage ?? 0
              ),
              paper:
                exam?.paper ||
                "Mixed",
              submittedAt:
                attempt.submitted_at,
            }
          }
        )

    /**
     * ==========================================================
     * 16. RECOMMENDATION ENGINE
     * ==========================================================
     */

    const recommendations: {
      title: string
      description: string
      type:
        | "topic"
        | "practice"
        | "revision"
        | "exam"
    }[] = []

    if (
      weakestTopics.length > 0
    ) {
      const weakest =
        weakestTopics[0]

      recommendations.push({
        title:
          `Revise ${weakest.topic}`,
        description:
          `Your current accuracy is ${Math.round(
            weakest.percentage
          )}%. Focus on this topic before taking another full mock.`,
        type: "topic",
      })
    }

    if (
      averagePercentage < 50 &&
      mockCount > 0
    ) {
      recommendations.push({
        title:
          "Build your fundamentals",
        description:
          "Work through step-by-step revision before attempting another difficult mock examination.",
        type: "revision",
      })
    } else if (
      averagePercentage >= 50 &&
      averagePercentage < 70
    ) {
      recommendations.push({
        title:
          "Push towards exam level",
        description:
          "Your foundation is developing. Practise timed questions and reduce avoidable mistakes.",
        type: "practice",
      })
    } else if (
      averagePercentage >= 70
    ) {
      recommendations.push({
        title:
          "Challenge yourself",
        description:
          "Your mock performance is strong. Try harder questions and timed Paper 1 and Paper 2 practice.",
        type: "exam",
      })
    }

    if (
      predictionAreas.length > 0
    ) {
      const prediction =
        predictionAreas[0]

      recommendations.push({
        title:
          `Practise ${prediction.topic}`,
        description:
          "This is one of the areas highlighted by your latest AI prediction analysis. Treat it as a revision priority, not a guaranteed exam question.",
        type: "practice",
      })
    }

    if (
      revisionSessionsAvailable &&
      revisionSessions.length === 0
    ) {
      recommendations.push({
        title:
          "Start your first revision session",
        description:
          "Use the AI Revision Coach to learn a topic, practise questions and get step-by-step help.",
        type: "revision",
      })
    }

    /**
     * ==========================================================
     * 17. LEARNING LEVEL
     * ==========================================================
     */

    let learningStatus =
      "Getting Started"

    if (averagePercentage >= 80) {
      learningStatus =
        "Excellent Progress"
    } else if (
      averagePercentage >= 70
    ) {
      learningStatus =
        "Strong Progress"
    } else if (
      averagePercentage >= 60
    ) {
      learningStatus =
        "Good Progress"
    } else if (
      averagePercentage >= 50
    ) {
      learningStatus =
        "Developing"
    } else if (
      mockCount > 0
    ) {
      learningStatus =
        "Needs More Practice"
    }

    /**
     * ==========================================================
     * 18. RETURN DASHBOARD
     * ==========================================================
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
          email: student.email,
          level:
            student.level,
          curriculum:
            student.curriculum,
        },

        credits: {
          balance,
        },

        overview: {
          progressPercentage:
            Math.round(
              averagePercentage * 10
            ) / 10,

          averagePercentage:
            Math.round(
              averagePercentage * 10
            ) / 10,

          accuracy:
            Math.round(
              accuracy * 10
            ) / 10,

          mockCount,

          questionsAttempted,

          correctAnswers,

          incorrectAnswers,

          unanswered,

          learningStatus,

          bestScore:
            bestAttempt
              ? Number(
                  bestAttempt.percentage ??
                    0
                )
              : 0,

          bestScoreMarks:
            bestAttempt
              ? Number(
                  bestAttempt.score ?? 0
                )
              : 0,

          bestScoreTotalMarks:
            bestAttempt
              ? Number(
                  bestAttempt.total_marks ??
                    0
                )
              : 0,

          latestScore:
            latestAttempt
              ? Number(
                  latestAttempt.percentage ??
                    0
                )
              : 0,

          totalScore,

          totalMarks,
        },

        topicPerformance: {
          all: topicStats,
          strongest: strongestTopics,
          weakest: weakestTopics,
        },

        predictions: {
          available:
            predictionAreas.length > 0,
          latestRun:
            latestPredictionRun
              ? {
                  id:
                    latestPredictionRun.id,
                  paper:
                    latestPredictionRun.paper,
                  papersAnalysed:
                    Number(
                      latestPredictionRun.papers_analysed ??
                        0
                    ),
                  questionsAnalysed:
                    Number(
                      latestPredictionRun.questions_analysed ??
                        0
                    ),
                  sourceQuestionCount:
                    Number(
                      latestPredictionRun.source_question_count ??
                        0
                    ),
                  completedAt:
                    latestPredictionRun.completed_at,
                }
              : null,
          areas:
            predictionAreas,
        },

        mocks: {
          recent:
            recentMocks,
        },

        revision: {
          available:
            revisionSessionsAvailable,
          sessions:
            recentRevisionSessions,
        },

        progressTrend,

        recommendations,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    )
  } catch (error) {
    console.error(
      "AI progress error:",
      error
    )

    return NextResponse.json(
      {
        authenticated: false,
        student: null,
        credits: {
          balance: 0,
        },
        error:
          "Unable to load your learning progress.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    )
  }
}