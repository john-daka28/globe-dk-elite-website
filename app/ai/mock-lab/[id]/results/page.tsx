"use client"

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Loader2,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react"

import {
  useParams,
  useRouter,
} from "next/navigation"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

type Mock = {
  id: string
  title: string
  subject: string
  level: string
  curriculum: string
  paper: string
  total_questions: number
  total_marks: number
  duration_minutes: number
  created_at: string
}

type Attempt = {
  id: string
  score: number
  percentage: number
  total_marks: number
  correct_count: number
  incorrect_count: number
  unanswered_count: number
  started_at: string
  submitted_at: string
}

type Question = {
  id: string
  question_number: number
  topic: string
  subtopic: string | null
  question_text: string
  question_type: string
  options: string[] | null
  explanation: string | null
  marks: number
  difficulty: string
}

type Answer = {
  id: string
  question_id: string
  answer: string | null
  is_correct: boolean
  marks_awarded: number
}

type TopicPerformance = {
  topic: string
  marks: number
  awarded: number
  questions: number
  correct: number
  percentage: number
}

export default function MockResultsPage() {
  const router =
    useRouter()

  const params =
    useParams()

  const mockId =
    String(
      params?.id ?? ""
    )

  const [
    loading,
    setLoading,
  ] =
    useState(true)

  const [
    error,
    setError,
  ] =
    useState("")

  const [
    mock,
    setMock,
  ] =
    useState<Mock | null>(
      null
    )

  const [
    attempt,
    setAttempt,
  ] =
    useState<Attempt | null>(
      null
    )

  const [
    questions,
    setQuestions,
  ] =
    useState<Question[]>(
      []
    )

  const [
    answers,
    setAnswers,
  ] =
    useState<Answer[]>(
      []
    )

  /*
   * ---------------------------------------------------------
   * LOAD RESULT
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!mockId) {
      return
    }

    async function loadResult() {
      try {
        const response =
          await fetch(
            `/api/ai/mock-lab/${mockId}/submit`,
            {
              cache:
                "no-store",
            }
          )

        const data =
          await response.json()

        if (
          !response.ok
        ) {
          setError(
            data.error ??
              "Unable to load your result."
          )
          return
        }

        setMock(
          data.mock
        )

        setAttempt(
          data.attempt
        )

        setQuestions(
          data.questions ??
            []
        )

        setAnswers(
          data.answers ??
            []
        )
      } catch {
        setError(
          "Something went wrong while loading your result."
        )
      } finally {
        setLoading(
          false
        )
      }
    }

    loadResult()
  }, [mockId])

  /*
   * ---------------------------------------------------------
   * TOPIC PERFORMANCE
   * ---------------------------------------------------------
   */

  const topicPerformance =
    useMemo<TopicPerformance[]>(
      () => {
        const map =
          new Map<
            string,
            TopicPerformance
          >()

        questions.forEach(
          (
            question
          ) => {
            const existing =
              map.get(
                question.topic
              ) ?? {
                topic:
                  question.topic,
                marks: 0,
                awarded: 0,
                questions: 0,
                correct: 0,
                percentage: 0,
              }

            existing.marks +=
              Number(
                question.marks ??
                  0
              )

            existing.questions +=
              1

            const answer =
              answers.find(
                (
                  item
                ) =>
                  item.question_id ===
                  question.id
              )

            existing.awarded +=
              Number(
                answer?.marks_awarded ??
                  0
              )

            if (
              answer?.is_correct
            ) {
              existing.correct +=
                1
            }

            existing.percentage =
              existing.marks >
              0
                ? Number(
                    (
                      (existing.awarded /
                        existing.marks) *
                      100
                    ).toFixed(
                      1
                    )
                  )
                : 0

            map.set(
              question.topic,
              existing
            )
          }
        )

        return Array.from(
          map.values()
        ).sort(
          (
            a,
            b
          ) =>
            a.percentage -
            b.percentage
        )
      },
      [
        questions,
        answers,
      ]
    )

  const weakestTopics =
    topicPerformance.slice(
      0,
      3
    )

  /*
   * ---------------------------------------------------------
   * HELPERS
   * ---------------------------------------------------------
   */

  function getPerformanceLabel(
    percentage: number
  ) {
    if (
      percentage >=
      80
    ) {
      return "Excellent"
    }

    if (
      percentage >=
      70
    ) {
      return "Good"
    }

    if (
      percentage >=
      50
    ) {
      return "Needs Practice"
    }

    return "Needs Revision"
  }

  function formatDate(
    value: string
  ) {
    return new Date(
      value
    ).toLocaleDateString(
      "en-ZW",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    )
  }

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f1ea]">
        <div className="flex items-center gap-3 text-[#10243d]">
          <Loader2 className="h-6 w-6 animate-spin" />

          <span className="font-bold">
            Loading your result...
          </span>
        </div>
      </main>
    )
  }

  /*
   * ---------------------------------------------------------
   * ERROR
   * ---------------------------------------------------------
   */

  if (
    error ||
    !mock ||
    !attempt
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f1ea] px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />

          <h1 className="mt-4 text-2xl font-black text-[#10243d]">
            Result unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {error ||
              "We could not load this mock test result."}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/ai/mock-lab"
              )
            }
            className="mt-6 rounded-xl bg-[#10243d] px-5 py-3 text-sm font-bold text-white"
          >
            Back to Mock Lab
          </button>
        </div>
      </main>
    )
  }

  const percentage =
    Number(
      attempt.percentage ??
        0
    )

  const score =
    Number(
      attempt.score ??
        0
    )

  return (
    <main className="min-h-screen bg-[#f4f1ea]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/ai/mock-lab"
              )
            }
            className="flex items-center gap-2 text-sm font-bold text-[#10243d]"
          >
            <ArrowLeft className="h-4 w-4" />
            Mock Lab
          </button>

          <div className="flex items-center gap-2 text-sm font-black text-[#b15d2b]">
            <Zap className="h-4 w-4" />
            GlobeDk AI
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-3xl bg-[#10243d] text-white shadow-xl">
          <div className="p-7 sm:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-orange-200">
                  <Trophy className="h-5 w-5" />

                  <span className="text-sm font-black uppercase tracking-widest">
                    Mock Complete
                  </span>
                </div>

                <h1 className="text-3xl font-black sm:text-4xl">
                  {mock.title}
                </h1>

                <p className="mt-3 text-slate-300">
                  {mock.subject} •{" "}
                  {mock.level} •{" "}
                  {mock.curriculum} •{" "}
                  {mock.paper}
                </p>
              </div>

              <div className="text-center">
                <div className="text-6xl font-black text-white">
                  {percentage.toFixed(
                    0
                  )}
                  %
                </div>

                <p className="mt-2 font-bold text-orange-200">
                  {getPerformanceLabel(
                    percentage
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Score
            </p>

            <p className="mt-2 text-3xl font-black text-[#10243d]">
              {score}
              <span className="text-lg text-slate-400">
                {" "}
                /{" "}
                {
                  attempt.total_marks
                }
              </span>
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Correct
            </p>

            <p className="mt-2 flex items-center gap-2 text-3xl font-black text-green-600">
              <CheckCircle2 className="h-7 w-7" />
              {
                attempt.correct_count
              }
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Incorrect
            </p>

            <p className="mt-2 flex items-center gap-2 text-3xl font-black text-red-600">
              <XCircle className="h-7 w-7" />
              {
                attempt.incorrect_count
              }
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Unanswered
            </p>

            <p className="mt-2 text-3xl font-black text-slate-600">
              {
                attempt.unanswered_count
              }
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7">
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-[#b15d2b]" />

                <h2 className="text-2xl font-black text-[#10243d]">
                  Topic Performance
                </h2>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Your weakest topics appear first so you know what to revise.
              </p>
            </div>

            <div className="space-y-5">
              {topicPerformance.map(
                (
                  topic
                ) => (
                  <div
                    key={
                      topic.topic
                    }
                  >
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-[#10243d]">
                          {
                            topic.topic
                          }
                        </p>

                        <p className="text-xs text-slate-400">
                          {
                            topic.correct
                          }{" "}
                          /{" "}
                          {
                            topic.questions
                          }{" "}
                          correct
                        </p>
                      </div>

                      <span
                        className={`text-sm font-black ${
                          topic.percentage >=
                          70
                            ? "text-green-600"
                            : topic.percentage >=
                              50
                            ? "text-orange-600"
                            : "text-red-600"
                        }`}
                      >
                        {
                          topic.percentage
                        }
                        %
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#b15d2b] transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              topic.percentage
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-[#10243d] p-6 text-white shadow-sm sm:p-8">
            <BookOpen className="h-7 w-7 text-orange-200" />

            <h2 className="mt-5 text-2xl font-black">
              Recommended Revision
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Focus your next study session on these areas.
            </p>

            <div className="mt-6 space-y-3">
              {weakestTopics.length >
              0 ? (
                weakestTopics.map(
                  (
                    topic,
                    index
                  ) => (
                    <div
                      key={
                        topic.topic
                      }
                      className="rounded-2xl bg-white/10 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-black text-orange-200">
                          #{index +
                            1}
                        </span>

                        <span className="text-xs font-bold text-slate-400">
                          {
                            topic.percentage
                          }
                          %
                        </span>
                      </div>

                      <p className="mt-2 font-bold">
                        {
                          topic.topic
                        }
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-300">
                        {topic.percentage <
                        50
                          ? "Needs focused revision."
                          : "More practice will improve confidence."}
                      </p>
                    </div>
                  )
                )
              ) : (
                <p className="text-sm text-slate-300">
                  Keep practising to build a stronger performance history.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-[#b15d2b]" />

                <h2 className="font-black text-[#10243d]">
                  Test Information
                </h2>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Completed on{" "}
                {formatDate(
                  attempt.submitted_at
                )}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/ai/mock-lab"
                  )
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-[#10243d] transition hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" />
                Try Another Mock
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/ai/revision-coach"
                  )
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-[#b15d2b] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
              >
                <BookOpen className="h-4 w-4" />
                Review Weak Topics
              </button>
            </div>
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-slate-400">
          GlobeDk Elite Academy • AI Learning Hub
        </p>
      </div>
    </main>
  )
}