"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  Award,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Flame,
  GraduationCap,
  History,
  Lightbulb,
  Loader2,
  MessageCircle,
  Play,
  RefreshCw,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react"

type Student = {
  id: string
  firstName: string
  lastName: string
  email: string
  level: string | null
  curriculum: string | null
}

type Credits = {
  balance: number
}

type Overview = {
  progressPercentage: number
  averagePercentage: number
  accuracy: number
  mockCount: number
  questionsAttempted: number
  correctAnswers: number
  incorrectAnswers: number
  unanswered: number
  learningStatus: string
  bestScore: number
  bestScoreMarks: number
  bestScoreTotalMarks: number
  latestScore: number
  totalScore: number
  totalMarks: number
}

type TopicStat = {
  topic: string
  attempted: number
  correct: number
  marks: number
  percentage: number
}

type PredictionArea = {
  id: string
  topic: string
  subtopic: string | null
  paper: string | null
  predictionScore: number
  confidence: string | null
  revisionAdvice: string | null
  conceptFamily: string | null
  questionFamily: string | null
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

type Recommendation = {
  title: string
  description: string
  type:
    | "topic"
    | "practice"
    | "revision"
    | "exam"
}

type ProgressTrend = {
  attemptNumber: number
  percentage: number
  paper: string
  submittedAt: string | null
}

type ProgressResponse = {
  authenticated: boolean
  student: Student | null
  credits: Credits
  overview?: Overview
  topicPerformance?: {
    all: TopicStat[]
    strongest: TopicStat[]
    weakest: TopicStat[]
  }
  predictions?: {
    available: boolean
    latestRun: {
      id: string
      paper: string | null
      papersAnalysed: number
      questionsAnalysed: number
      sourceQuestionCount: number
      completedAt: string | null
    } | null
    areas: PredictionArea[]
  }
  mocks?: {
    recent: RecentMock[]
  }
  revision?: {
    available: boolean
    sessions: RecentRevision[]
  }
  progressTrend?: ProgressTrend[]
  recommendations?: Recommendation[]
  error?: string
}

function formatDate(
  value: string | null | undefined
) {
  if (!value) {
    return "Not available"
  }

  try {
    return new Intl.DateTimeFormat(
      "en-ZW",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(new Date(value))
  } catch {
    return "Not available"
  }
}

function formatRelativeDate(
  value: string | null | undefined
) {
  if (!value) {
    return "No activity yet"
  }

  const date = new Date(value)
  const now = new Date()

  const difference =
    now.getTime() -
    date.getTime()

  const minutes = Math.floor(
    difference / 60000
  )

  if (minutes < 1) {
    return "Just now"
  }

  if (minutes < 60) {
    return `${minutes}m ago`
  }

  const hours = Math.floor(
    minutes / 60
  )

  if (hours < 24) {
    return `${hours}h ago`
  }

  const days = Math.floor(
    hours / 24
  )

  if (days < 7) {
    return `${days}d ago`
  }

  return formatDate(value)
}

function getScoreLabel(
  percentage: number
) {
  if (percentage >= 80) {
    return "Excellent"
  }

  if (percentage >= 70) {
    return "Strong"
  }

  if (percentage >= 60) {
    return "Good"
  }

  if (percentage >= 50) {
    return "Developing"
  }

  return "Needs Practice"
}

function getScoreWidth(
  percentage: number
) {
  return Math.max(
    0,
    Math.min(
      100,
      percentage
    )
  )
}

function ScoreRing({
  percentage,
  size = 150,
}: {
  percentage: number
  size?: number
}) {
  const radius =
    (size - 18) / 2

  const circumference =
    2 *
    Math.PI *
    radius

  const offset =
    circumference -
    (getScoreWidth(
      percentage
    ) /
      100) *
      circumference

  return (
    <div
      className="relative shrink-0"
      style={{
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#b15d2b"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={
            circumference
          }
          strokeDashoffset={
            offset
          }
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-[#10243d]">
          {Math.round(
            percentage
          )}
          %
        </span>

        <span className="text-xs font-semibold text-slate-500">
          overall
        </span>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  description: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4f1ea] text-[#b15d2b]">
          {icon}
        </div>
      </div>

      <p className="text-2xl font-black text-[#10243d]">
        {value}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-700">
        {label}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  )
}

export default function RevisionProgressClient() {
  const [
    data,
    setData,
  ] =
    useState<ProgressResponse | null>(
      null
    )

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    refreshing,
    setRefreshing,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  )

  const loadProgress =
    useCallback(
      async (
        showRefresh = false
      ) => {
        try {
          if (showRefresh) {
            setRefreshing(true)
          } else {
            setLoading(true)
          }

          setError(null)

          /**
           * ----------------------------------------------------
           * AUTH CONTRACT
           *
           * The frontend deliberately uses the existing
           * /api/ai/auth/me endpoint.
           * ----------------------------------------------------
           */

          const authResponse =
            await fetch(
              "/api/ai/auth/me",
              {
                method: "GET",
                cache: "no-store",
              }
            )

          const authData =
            await authResponse.json()

          if (
            !authResponse.ok ||
            !authData.authenticated
          ) {
            setData({
              authenticated: false,
              student: null,
              credits: {
                balance: 0,
              },
            })

            setError(
              "Your AI session has expired. Please sign in again."
            )

            return
          }

          /**
           * ----------------------------------------------------
           * LOAD PROGRESS
           * ----------------------------------------------------
           */

          const response =
            await fetch(
              "/api/ai/progress",
              {
                method: "GET",
                cache: "no-store",
              }
            )

          const result =
            (await response.json()) as ProgressResponse

          if (
            !response.ok ||
            !result.authenticated
          ) {
            throw new Error(
              result.error ||
                "Unable to load your progress."
            )
          }

          setData(result)
        } catch (err) {
          console.error(
            "Progress frontend error:",
            err
          )

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your progress."
          )
        } finally {
          setLoading(false)
          setRefreshing(false)
        }
      },
      []
    )

  useEffect(() => {
    loadProgress()
  }, [loadProgress])

  const overview =
    data?.overview

  const topicPerformance =
    data?.topicPerformance

  const predictions =
    data?.predictions

  const mocks =
    data?.mocks

  const revision =
    data?.revision

  const recommendations =
    data?.recommendations ?? []

  const trend =
    data?.progressTrend ?? []

  const firstName =
    data?.student?.firstName ||
    "Student"

  const subject =
    data?.student?.level ||
    "O-Level"

  const curriculum =
    data?.student?.curriculum ||
    "ZIMSEC"

  const trendAverage =
    useMemo(() => {
      if (!trend.length) {
        return 0
      }

      return (
        trend.reduce(
          (sum, item) =>
            sum +
            item.percentage,
          0
        ) /
        trend.length
      )
    }, [trend])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#10243d]">
              <Loader2 className="h-7 w-7 animate-spin text-white" />
            </div>

            <h1 className="mt-5 text-xl font-black text-[#10243d]">
              Loading your progress
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Preparing your learning dashboard...
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (!data?.authenticated) {
    return (
      <main className="min-h-screen bg-[#f8f7f4] px-4 py-10">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <GraduationCap className="h-8 w-8" />
            </div>

            <h1 className="mt-6 text-2xl font-black text-[#10243d]">
              Sign in required
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              {error ||
                "Please sign in to your GlobeDk AI Learning Hub account to view your progress."}
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.reload()
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#10243d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#183653]"
            >
              <RefreshCw className="h-4 w-4" />
              Check session again
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f8f7f4] text-slate-900">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10243d] shadow-sm">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b15d2b]">
                    GlobeDk AI Learning Hub
                  </p>

                  <h1 className="text-2xl font-black tracking-tight text-[#10243d] sm:text-3xl">
                    My Progress
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
                Track your learning journey, mock
                examination performance, topic mastery
                and AI-powered revision activity.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-slate-200 bg-[#f8f7f4] px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  AI Credits
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#b15d2b]" />

                  <span className="text-lg font-black text-[#10243d]">
                    {data.credits.balance}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  loadProgress(true)
                }
                disabled={refreshing}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-[#b15d2b] hover:text-[#b15d2b] disabled:opacity-50"
                title="Refresh progress"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    refreshing
                      ? "animate-spin"
                      : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ===================================================
            STUDENT WELCOME
        ==================================================== */}

        <section className="overflow-hidden rounded-3xl bg-[#10243d] p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">
                Welcome back
              </p>

              <h2 className="mt-1 text-3xl font-black sm:text-4xl">
                {firstName}
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
                  {subject}
                </span>

                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
                  {curriculum}
                </span>

                <span className="rounded-full bg-[#b15d2b] px-3 py-1.5 text-xs font-bold">
                  Mathematics
                </span>
              </div>
            </div>

            <div className="max-w-md">
              <p className="text-sm leading-6 text-white/70">
                Your progress dashboard combines your mock
                examination results, practice accuracy,
                topic performance and AI revision activity.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/ai/mock-lab"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#10243d] transition hover:bg-[#f4f1ea]"
                >
                  <Play className="h-4 w-4" />
                  Take a Mock
                </a>

                <a
                  href="/ai/revision-coach"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  <MessageCircle className="h-4 w-4" />
                  Revision Coach
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            ERROR
        ==================================================== */}

        {error && data?.authenticated && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ===================================================
            OVERVIEW
        ==================================================== */}

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_2fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Overall Progress
              </p>

              <div className="mt-5">
                <ScoreRing
                  percentage={
                    overview?.progressPercentage ??
                    0
                  }
                />
              </div>

              <h3 className="mt-5 text-xl font-black text-[#10243d]">
                {overview?.learningStatus ||
                  "Getting Started"}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {overview?.mockCount
                  ? `Based on ${overview.mockCount} completed mock ${
                      overview.mockCount === 1
                        ? "examination"
                        : "examinations"
                    }.`
                  : "Complete your first AI mock examination to start building your progress history."}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              icon={
                <Trophy className="h-5 w-5" />
              }
              label="Average Mock Score"
              value={`${Math.round(
                overview?.averagePercentage ??
                  0
              )}%`}
              description="Average percentage across completed mock examinations."
            />

            <StatCard
              icon={
                <Target className="h-5 w-5" />
              }
              label="Question Accuracy"
              value={`${Math.round(
                overview?.accuracy ?? 0
              )}%`}
              description="Percentage of attempted questions answered correctly."
            />

            <StatCard
              icon={
                <BookOpen className="h-5 w-5" />
              }
              label="Mocks Completed"
              value={
                overview?.mockCount ?? 0
              }
              description="Completed AI mock examinations."
            />

            <StatCard
              icon={
                <CheckCircle2 className="h-5 w-5" />
              }
              label="Correct Answers"
              value={
                overview?.correctAnswers ??
                0
              }
              description="Questions you have answered correctly."
            />
          </div>
        </section>

        {/* ===================================================
            PERFORMANCE SUMMARY
        ==================================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={
              <Award className="h-5 w-5" />
            }
            label="Best Mock Score"
            value={`${Math.round(
              overview?.bestScore ?? 0
            )}%`}
            description={
              overview?.bestScoreTotalMarks
                ? `${overview.bestScoreMarks}/${overview.bestScoreTotalMarks} marks`
                : "No completed mock yet."
            }
          />

          <StatCard
            icon={
              <TrendingUp className="h-5 w-5" />
            }
            label="Latest Mock"
            value={`${Math.round(
              overview?.latestScore ?? 0
            )}%`}
            description={
              overview?.latestScore
                ? getScoreLabel(
                    overview.latestScore
                  )
                : "Take your first mock."
            }
          />

          <StatCard
            icon={
              <XCircle className="h-5 w-5" />
            }
            label="Incorrect Answers"
            value={
              overview?.incorrectAnswers ??
              0
            }
            description="Questions that need further practice."
          />

          <StatCard
            icon={
              <Clock3 className="h-5 w-5" />
            }
            label="Unanswered"
            value={
              overview?.unanswered ??
              0
            }
            description="Questions left unanswered during mocks."
          />
        </section>

        {/* ===================================================
            TREND + RECOMMENDATIONS
        ==================================================== */}

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Trend */}

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#b15d2b]" />

                  <h2 className="text-lg font-black text-[#10243d]">
                    Performance Trend
                  </h2>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Your most recent mock examination scores.
                </p>
              </div>

              {trend.length > 0 && (
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400">
                    Recent average
                  </p>

                  <p className="text-xl font-black text-[#10243d]">
                    {Math.round(
                      trendAverage
                    )}
                    %
                  </p>
                </div>
              )}
            </div>

            {trend.length === 0 ? (
              <div className="mt-8 rounded-2xl bg-[#f8f7f4] p-8 text-center">
                <BarChart3 className="mx-auto h-8 w-8 text-slate-300" />

                <p className="mt-3 text-sm font-bold text-slate-600">
                  No performance history yet
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Complete a mock examination to start tracking
                  your improvement.
                </p>
              </div>
            ) : (
              <div className="mt-8">
                <div className="flex h-52 items-end gap-2 sm:gap-4">
                  {trend.map(
                    (item) => {
                      const height =
                        Math.max(
                          8,
                          Math.min(
                            100,
                            item.percentage
                          )
                        )

                      return (
                        <div
                          key={`${item.attemptNumber}-${item.submittedAt}`}
                          className="flex h-full flex-1 flex-col items-center justify-end"
                        >
                          <div className="mb-2 text-xs font-black text-[#10243d]">
                            {Math.round(
                              item.percentage
                            )}
                            %
                          </div>

                          <div className="flex h-40 w-full items-end">
                            <div
                              className="w-full rounded-t-xl bg-[#b15d2b] transition-all"
                              style={{
                                height: `${height}%`,
                              }}
                              title={`${Math.round(
                                item.percentage
                              )}% - ${
                                item.paper
                              }`}
                            />
                          </div>

                          <div className="mt-2 text-[10px] font-bold text-slate-400">
                            #{item.attemptNumber}
                          </div>
                        </div>
                      )
                    }
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Recommendations */}

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-[#b15d2b]" />

              <h2 className="text-lg font-black text-[#10243d]">
                Recommended Next Steps
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Use your performance data to decide what to study next.
            </p>

            <div className="mt-5 space-y-3">
              {recommendations.length === 0 ? (
                <div className="rounded-2xl bg-[#f8f7f4] p-5">
                  <p className="text-sm font-bold text-slate-700">
                    Your learning plan will appear here.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Complete mocks and revision sessions to generate
                    personalised recommendations.
                  </p>
                </div>
              ) : (
                recommendations
                  .slice(0, 4)
                  .map(
                    (
                      recommendation,
                      index
                    ) => (
                      <div
                        key={`${recommendation.title}-${index}`}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <div className="flex gap-3">
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f4f1ea] text-[#b15d2b]">
                            {recommendation.type ===
                            "topic" ? (
                              <Target className="h-4 w-4" />
                            ) : recommendation.type ===
                              "revision" ? (
                              <BookOpen className="h-4 w-4" />
                            ) : recommendation.type ===
                              "exam" ? (
                              <Trophy className="h-4 w-4" />
                            ) : (
                              <Zap className="h-4 w-4" />
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-black text-[#10243d]">
                              {
                                recommendation.title
                              }
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {
                                recommendation.description
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )
              )}
            </div>
          </div>
        </section>

        {/* ===================================================
            TOPIC MASTERY
        ==================================================== */}

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-[#b15d2b]" />

                <h2 className="text-lg font-black text-[#10243d]">
                  Topic Mastery
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                See which Mathematics topics are becoming strengths and
                which ones need more practice.
              </p>
            </div>

            <span className="rounded-full bg-[#f4f1ea] px-3 py-1.5 text-xs font-bold text-[#b15d2b]">
              Mathematics
            </span>
          </div>

          {topicPerformance?.all?.length ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {topicPerformance.all
                .slice(0, 10)
                .map(
                  (topic) => {
                    const percentage =
                      Math.round(
                        topic.percentage
                      )

                    const isStrong =
                      percentage >= 70

                    return (
                      <div
                        key={topic.topic}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-black text-[#10243d]">
                              {topic.topic}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {topic.correct}/
                              {
                                topic.attempted
                              } correct
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {isStrong ? (
                              <TrendingUp className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}

                            <span className="text-sm font-black text-[#10243d]">
                              {percentage}
                              %
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-[#b15d2b]"
                            style={{
                              width: `${getScoreWidth(
                                percentage
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  }
                )}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-[#f8f7f4] p-8 text-center">
              <Target className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm font-bold text-slate-600">
                Topic mastery will appear after practice
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Answer questions in Mock Lab to build topic-level
                performance data.
              </p>
            </div>
          )}
        </section>

        {/* ===================================================
            STRONG / WEAK TOPICS
        ==================================================== */}

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-emerald-600" />

              <h2 className="text-lg font-black text-[#10243d]">
                Your Strongest Areas
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              {topicPerformance?.strongest?.length ? (
                topicPerformance.strongest
                  .slice(0, 5)
                  .map(
                    (topic, index) => (
                      <div
                        key={topic.topic}
                        className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-black text-emerald-700">
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-[#10243d]">
                            {topic.topic}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {topic.correct}/
                            {
                              topic.attempted
                            } correct
                          </p>
                        </div>

                        <span className="text-sm font-black text-emerald-700">
                          {Math.round(
                            topic.percentage
                          )}
                          %
                        </span>
                      </div>
                    )
                  )
              ) : (
                <p className="rounded-2xl bg-[#f8f7f4] p-5 text-sm text-slate-500">
                  Your strongest topics will appear after you practise
                  questions.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-red-500" />

              <h2 className="text-lg font-black text-[#10243d]">
                Areas Needing Attention
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              {topicPerformance?.weakest?.length ? (
                topicPerformance.weakest
                  .slice(0, 5)
                  .map(
                    (topic, index) => (
                      <div
                        key={topic.topic}
                        className="flex items-center gap-3 rounded-2xl bg-red-50 p-4"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-black text-red-600">
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-[#10243d]">
                            {topic.topic}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {topic.correct}/
                            {
                              topic.attempted
                            } correct
                          </p>
                        </div>

                        <span className="text-sm font-black text-red-600">
                          {Math.round(
                            topic.percentage
                          )}
                          %
                        </span>
                      </div>
                    )
                  )
              ) : (
                <p className="rounded-2xl bg-[#f8f7f4] p-5 text-sm text-slate-500">
                  We need some practice data before identifying topics
                  that need attention.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ===================================================
            AI PREDICTION AREAS
        ==================================================== */}

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#b15d2b]" />

                <h2 className="text-lg font-black text-[#10243d]">
                  AI Revision Priorities
                </h2>
              </div>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Areas highlighted by your latest AI exam analysis.
                These are revision priorities, not guaranteed exam
                questions.
              </p>
            </div>

            {predictions?.latestRun && (
              <div className="rounded-xl bg-[#f4f1ea] px-3 py-2 text-xs font-bold text-[#b15d2b]">
                {predictions.latestRun.questionsAnalysed} questions
                analysed
              </div>
            )}
          </div>

          {!predictions?.areas?.length ? (
            <div className="mt-6 rounded-2xl bg-[#f8f7f4] p-8 text-center">
              <Brain className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm font-bold text-slate-600">
                No AI prediction data yet
              </p>

              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
                Once your AI Exam Predictor has analysed papers, the
                important revision areas will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {predictions.areas.map(
                (prediction) => (
                  <div
                    key={prediction.id}
                    className="rounded-2xl border border-slate-200 p-5 transition hover:border-[#d8b08e]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-[#10243d]">
                          {prediction.topic}
                        </p>

                        {prediction.subtopic && (
                          <p className="mt-1 text-xs text-slate-500">
                            {prediction.subtopic}
                          </p>
                        )}
                      </div>

                      <span className="rounded-full bg-[#f4f1ea] px-2.5 py-1 text-[10px] font-black text-[#b15d2b]">
                        {Math.round(
                          prediction.predictionScore
                        )}
                        %
                      </span>
                    </div>

                    {prediction.confidence && (
                      <p className="mt-3 text-xs font-bold text-slate-500">
                        Confidence:{" "}
                        <span className="text-[#10243d]">
                          {
                            prediction.confidence
                          }
                        </span>
                      </p>
                    )}

                    {prediction.revisionAdvice && (
                      <p className="mt-3 text-xs leading-5 text-slate-500">
                        {
                          prediction.revisionAdvice
                        }
                      </p>
                    )}

                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#b15d2b]">
                      <BookOpen className="h-3.5 w-3.5" />
                      Revise this area
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* ===================================================
            RECENT MOCK EXAMS
        ==================================================== */}

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-[#b15d2b]" />

                <h2 className="text-lg font-black text-[#10243d]">
                  Recent Mock Exams
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Your latest AI-generated examination attempts.
              </p>
            </div>

            <a
              href="/ai/mock-lab"
              className="hidden items-center gap-1 text-sm font-bold text-[#b15d2b] sm:flex"
            >
              Open Mock Lab
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          {mocks?.recent?.length ? (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="px-3 py-3 text-xs font-black uppercase tracking-wider text-slate-400">
                      Examination
                    </th>

                    <th className="px-3 py-3 text-xs font-black uppercase tracking-wider text-slate-400">
                      Paper
                    </th>

                    <th className="px-3 py-3 text-xs font-black uppercase tracking-wider text-slate-400">
                      Score
                    </th>

                    <th className="px-3 py-3 text-xs font-black uppercase tracking-wider text-slate-400">
                      Questions
                    </th>

                    <th className="px-3 py-3 text-xs font-black uppercase tracking-wider text-slate-400">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {mocks.recent.map(
                    (mock) => (
                      <tr
                        key={mock.id}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="px-3 py-4">
                          <p className="text-sm font-black text-[#10243d]">
                            {mock.title}
                          </p>
                        </td>

                        <td className="px-3 py-4">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                            {mock.paper}
                          </span>
                        </td>

                        <td className="px-3 py-4">
                          <p className="text-sm font-black text-[#10243d]">
                            {Math.round(
                              mock.percentage
                            )}
                            %
                          </p>

                          <p className="text-xs text-slate-400">
                            {mock.score}/
                            {
                              mock.totalMarks
                            }
                          </p>
                        </td>

                        <td className="px-3 py-4">
                          <p className="text-xs text-slate-500">
                            <span className="font-bold text-emerald-600">
                              {mock.correctCount}
                            </span>{" "}
                            correct ·{" "}
                            <span className="font-bold text-red-500">
                              {
                                mock.incorrectCount
                              }
                            </span>{" "}
                            wrong
                          </p>
                        </td>

                        <td className="px-3 py-4 text-xs font-medium text-slate-500">
                          {formatDate(
                            mock.submittedAt
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl bg-[#f8f7f4] p-8 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm font-bold text-slate-600">
                No completed mock exams
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Your mock results will appear here after you complete
                an examination.
              </p>

              <a
                href="/ai/mock-lab"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#10243d] px-4 py-2.5 text-xs font-bold text-white"
              >
                <Play className="h-4 w-4" />
                Start a Mock
              </a>
            </div>
          )}
        </section>

        {/* ===================================================
            REVISION ACTIVITY
        ==================================================== */}

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-[#b15d2b]" />

                <h2 className="text-lg font-black text-[#10243d]">
                  Revision Activity
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Your recent sessions with the AI Revision Coach.
              </p>
            </div>

            <a
              href="/ai/revision-coach"
              className="hidden items-center gap-1 text-sm font-bold text-[#b15d2b] sm:flex"
            >
              Open Coach
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          {!revision?.available ? (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-bold text-amber-800">
                Revision Coach history is not available yet.
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-700">
                Once the Revision Coach tables are installed, your
                sessions will appear here.
              </p>
            </div>
          ) : revision.sessions.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-[#f8f7f4] p-8 text-center">
              <MessageCircle className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm font-bold text-slate-600">
                No revision sessions yet
              </p>

              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
                Ask the AI Revision Coach to explain topics, give you
                practice questions or help you prepare for exams.
              </p>

              <a
                href="/ai/revision-coach"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#10243d] px-4 py-2.5 text-xs font-bold text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Start Revision
              </a>
            </div>
          ) : (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {revision.sessions
                .slice(0, 6)
                .map(
                  (session) => (
                    <a
                      key={session.id}
                      href={`/ai/revision-coach?session=${session.id}`}
                      className="group rounded-2xl border border-slate-200 p-4 transition hover:border-[#d8b08e] hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f4f1ea] text-[#b15d2b]">
                          <MessageCircle className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-[#10243d]">
                            {session.title}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                              {session.mode}
                            </span>

                            {session.topic && (
                              <span className="rounded-full bg-[#f4f1ea] px-2 py-1 text-[10px] font-bold text-[#b15d2b]">
                                {session.topic}
                              </span>
                            )}
                          </div>

                          <p className="mt-3 text-[11px] font-medium text-slate-400">
                            {formatRelativeDate(
                              session.updatedAt
                            )}
                          </p>
                        </div>

                        <ChevronRight className="mt-2 h-4 w-4 text-slate-300 transition group-hover:text-[#b15d2b]" />
                      </div>
                    </a>
                  )
                )}
            </div>
          )}
        </section>

        {/* ===================================================
            LEARNING SUMMARY
        ==================================================== */}

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-[#f4f1ea] p-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[#b15d2b]" />

              <h2 className="text-lg font-black text-[#10243d]">
                Your Learning Summary
              </h2>
            </div>
          </div>

          <div className="grid gap-0 md:grid-cols-3">
            <div className="border-b border-slate-200 p-6 md:border-b-0 md:border-r">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Questions Practised
              </p>

              <p className="mt-2 text-3xl font-black text-[#10243d]">
                {overview?.questionsAttempted ??
                  0}
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Keep practising to build stronger topic-level
                statistics.
              </p>
            </div>

            <div className="border-b border-slate-200 p-6 md:border-b-0 md:border-r">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Current Accuracy
              </p>

              <p className="mt-2 text-3xl font-black text-[#10243d]">
                {Math.round(
                  overview?.accuracy ??
                    0
                )}
                %
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Accuracy improves as you review mistakes and practise
                similar questions.
              </p>
            </div>

            <div className="p-6">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                AI Credits
              </p>

              <p className="mt-2 text-3xl font-black text-[#10243d]">
                {data.credits.balance}
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Credits can be used for AI-powered learning features.
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================
            QUICK ACTIONS
        ==================================================== */}

        <section className="mt-6 grid gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/ai/mock-lab"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d8b08e]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4f1ea] text-[#b15d2b]">
              <Play className="h-5 w-5" />
            </div>

            <p className="mt-4 text-sm font-black text-[#10243d]">
              Take a Mock
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Test yourself under exam conditions.
            </p>

            <ChevronRight className="mt-4 h-4 w-4 text-slate-300 transition group-hover:text-[#b15d2b]" />
          </a>

          <a
            href="/ai/revision-coach"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d8b08e]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4f1ea] text-[#b15d2b]">
              <MessageCircle className="h-5 w-5" />
            </div>

            <p className="mt-4 text-sm font-black text-[#10243d]">
              Revise with AI
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Get step-by-step help with Mathematics.
            </p>

            <ChevronRight className="mt-4 h-4 w-4 text-slate-300 transition group-hover:text-[#b15d2b]" />
          </a>

          <a
            href="/ai/predictor"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d8b08e]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4f1ea] text-[#b15d2b]">
              <Brain className="h-5 w-5" />
            </div>

            <p className="mt-4 text-sm font-black text-[#10243d]">
              AI Predictor
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Analyse exam patterns and revision priorities.
            </p>

            <ChevronRight className="mt-4 h-4 w-4 text-slate-300 transition group-hover:text-[#b15d2b]" />
          </a>

          <a
            href="/ai"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d8b08e]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4f1ea] text-[#b15d2b]">
              <GraduationCap className="h-5 w-5" />
            </div>

            <p className="mt-4 text-sm font-black text-[#10243d]">
              AI Learning Hub
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Return to your complete AI learning dashboard.
            </p>

            <ChevronRight className="mt-4 h-4 w-4 text-slate-300 transition group-hover:text-[#b15d2b]" />
          </a>
        </section>

        {/* ===================================================
            FOOTER
        ==================================================== */}

        <footer className="border-t border-slate-200 py-6 text-center">
          <p className="text-xs font-medium text-slate-400">
            GlobeDk Elite Academy · Excellence in Education.
            Success for Life.
          </p>
        </footer>
      </div>
    </main>
  )
}