"use client"

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileQuestion,
  GraduationCap,
  Loader2,
  Sparkles,
  Target,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  useRouter,
} from "next/navigation"

type Student = {
  id: string
  firstName: string
  lastName: string
  email: string
  level: string | null
  curriculum: string | null
}

type Question = {
  id: string
  question_number: number
  topic: string
  subtopic: string | null
  question_text: string
  question_type:
    | "multiple_choice"
    | "short_answer"
    | "written"
    | "structured"
  options:
    | string[]
    | null
  marks: number
  difficulty:
    | "easy"
    | "medium"
    | "hard"
}

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
  questions: Question[]
}

export default function MockLabPage() {
  const router =
    useRouter()

  const [
    loadingAuth,
    setLoadingAuth,
  ] =
    useState(true)

  const [
    generating,
    setGenerating,
  ] =
    useState(false)

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false)

  const [
    student,
    setStudent,
  ] =
    useState<Student | null>(
      null
    )

  const [
    credits,
    setCredits,
  ] =
    useState(0)

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
    questionCount,
    setQuestionCount,
  ] =
    useState(10)

  const [
    paper,
    setPaper,
  ] =
    useState("Both Papers")

  const [
    currentQuestion,
    setCurrentQuestion,
  ] =
    useState(0)

  const [
    answers,
    setAnswers,
  ] =
    useState<
      Record<
        string,
        string
      >
    >({})

  const [
    secondsRemaining,
    setSecondsRemaining,
  ] =
    useState<number | null>(
      null
    )

  /*
   * ---------------------------------------------------------
   * LOAD AI SESSION
   * ---------------------------------------------------------
   */

  useEffect(() => {
    async function loadSession() {
      try {
        const response =
          await fetch(
            "/api/ai/auth/me",
            {
              cache:
                "no-store",
            }
          )

        if (
          !response.ok
        ) {
          router.replace(
            "/ai/sign-in"
          )
          return
        }

        const data =
          await response.json()

        if (
          !data.authenticated ||
          !data.student
        ) {
          router.replace(
            "/ai/sign-in"
          )
          return
        }

        setStudent(
          data.student
        )

        setCredits(
          Number(
            data.credits
              ?.balance ??
              0
          )
        )
      } catch {
        router.replace(
          "/ai/sign-in"
        )
      } finally {
        setLoadingAuth(
          false
        )
      }
    }

    loadSession()
  }, [router])

  /*
   * ---------------------------------------------------------
   * TIMER
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (
      !mock ||
      secondsRemaining ===
        null ||
      submitting
    ) {
      return
    }

    if (
      secondsRemaining <=
      0
    ) {
      handleSubmit(
        true
      )
      return
    }

    const timer =
      window.setInterval(
        () => {
          setSecondsRemaining(
            (
              current
            ) =>
              current !==
                null
                ? current -
                  1
                : null
          )
        },
        1000
      )

    return () =>
      window.clearInterval(
        timer
      )
  }, [
    mock,
    secondsRemaining,
    submitting,
  ])

  /*
   * ---------------------------------------------------------
   * GENERATE MOCK
   * ---------------------------------------------------------
   */

  async function generateMock() {
    if (
      credits <
      1
    ) {
      setError(
        "You do not have enough AI credits to generate a mock test."
      )
      return
    }

    setGenerating(
      true
    )

    setError("")

    try {
      const response =
        await fetch(
          "/api/ai/mock-lab",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                questionCount,
                paper,
              }),
          }
        )

      const data =
        await response.json()

      if (
        !response.ok
      ) {
        setError(
          data.error ??
            "Unable to generate the mock test."
        )

        if (
          data.credits
        ) {
          setCredits(
            Number(
              data.credits
                .balance ??
                0
            )
          )
        }

        return
      }

      setMock(
        data.mock
      )

      setCredits(
        Number(
          data.credits
            ?.balance ??
            Math.max(
              0,
              credits - 1
            )
        )
      )

      setCurrentQuestion(
        0
      )

      setAnswers(
        {}
      )

      setSecondsRemaining(
        Number(
          data.mock
            .durationMinutes ??
            60
        ) * 60
      )
    } catch {
      setError(
        "Something went wrong while generating the mock test."
      )
    } finally {
      setGenerating(
        false
      )
    }
  }

  /*
   * ---------------------------------------------------------
   * ANSWERS
   * ---------------------------------------------------------
   */

  function setAnswer(
    questionId: string,
    answer: string
  ) {
    setAnswers(
      (
        previous
      ) => ({
        ...previous,
        [questionId]:
          answer,
      })
    )
  }

  /*
   * ---------------------------------------------------------
   * SUBMIT
   * ---------------------------------------------------------
   */

  async function handleSubmit(
    automatic = false
  ) {
    if (
      !mock ||
      submitting
    ) {
      return
    }

    if (
      !automatic
    ) {
      const confirmed =
        window.confirm(
          "Are you sure you want to submit this mock test?"
        )

      if (!confirmed) {
        return
      }
    }

    setSubmitting(
      true
    )

    setError("")

    try {
      const answerPayload =
        mock.questions.map(
          (
            question
          ) => ({
            questionId:
              question.id,

            answer:
              answers[
                question.id
              ] ??
              "",
          })
        )

      const response =
        await fetch(
          `/api/ai/mock-lab/${mock.id}/submit`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                answers:
                  answerPayload,
              }),
          }
        )

      const data =
        await response.json()

      if (
        !response.ok
      ) {
        if (
          data.code ===
          "ALREADY_SUBMITTED"
        ) {
          router.push(
            `/ai/mock-lab/${mock.id}/results`
          )
          return
        }

        setError(
          data.error ??
            "Unable to submit your mock test."
        )

        return
      }

      router.push(
        `/ai/mock-lab/${mock.id}/results`
      )
    } catch {
      setError(
        "Something went wrong while submitting your mock test."
      )
    } finally {
      setSubmitting(
        false
      )
    }
  }

  /*
   * ---------------------------------------------------------
   * HELPERS
   * ---------------------------------------------------------
   */

  function formatTime(
    seconds: number
  ) {
    const minutes =
      Math.floor(
        seconds / 60
      )

    const remaining =
      seconds % 60

    return `${String(
      minutes
    ).padStart(
      2,
      "0"
    )}:${String(
      remaining
    ).padStart(
      2,
      "0"
    )}`
  }

  const answeredCount =
    useMemo(() => {
      if (!mock) {
        return 0
      }

      return mock.questions.filter(
        (
          question
        ) =>
          Boolean(
            answers[
              question.id
            ]?.trim()
          )
      ).length
    }, [
      mock,
      answers,
    ])

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (loadingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f1ea]">
        <div className="flex items-center gap-3 text-[#10243d]">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="font-semibold">
            Loading AI Mock Lab...
          </span>
        </div>
      </main>
    )
  }

  /*
   * ---------------------------------------------------------
   * TEST SCREEN
   * ---------------------------------------------------------
   */

  if (mock) {
    const question =
      mock.questions[
        currentQuestion
      ]

    const isLast =
      currentQuestion ===
      mock.questions.length -
        1

    const progress =
      ((currentQuestion +
        1) /
        mock.questions.length) *
      100

    return (
      <main className="min-h-screen bg-[#f4f1ea]">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#b15d2b]">
                GlobeDk AI
              </p>

              <h1 className="text-lg font-black text-[#10243d]">
                {mock.title}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {secondsRemaining !==
                null && (
                <div
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 font-black ${
                    secondsRemaining <
                    300
                      ? "bg-red-100 text-red-700"
                      : "bg-[#10243d] text-white"
                  }`}
                >
                  <Clock3 className="h-4 w-4" />

                  {formatTime(
                    secondsRemaining
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  handleSubmit()
                }
                disabled={
                  submitting
                }
                className="rounded-xl bg-[#b15d2b] px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Test"}
              </button>
            </div>
          </div>

          <div className="h-1 bg-slate-100">
            <div
              className="h-1 bg-[#b15d2b] transition-all"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_260px] lg:px-8">
          <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-500">
                  Question{" "}
                  {currentQuestion +
                    1}{" "}
                  of{" "}
                  {
                    mock.questions
                      .length
                  }
                </p>

                <h2 className="mt-1 text-2xl font-black text-[#10243d]">
                  {question.topic}
                </h2>
              </div>

              <div className="rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-[#b15d2b]">
                {question.marks}{" "}
                {question.marks ===
                1
                  ? "mark"
                  : "marks"}
              </div>
            </div>

            <div className="mb-8 rounded-2xl bg-slate-50 p-5">
              <p className="whitespace-pre-wrap text-lg font-semibold leading-8 text-slate-800">
                {
                  question.question_text
                }
              </p>
            </div>

            {question.subtopic && (
              <p className="mb-4 text-sm text-slate-500">
                Topic:{" "}
                <span className="font-semibold">
                  {
                    question.subtopic
                  }
                </span>
              </p>
            )}

            {question.question_type ===
              "multiple_choice" &&
            Array.isArray(
              question.options
            ) ? (
              <div className="space-y-3">
                {question.options.map(
                  (
                    option,
                    index
                  ) => {
                    const value =
                      option

                    const selected =
                      answers[
                        question.id
                      ] ===
                      value

                    return (
                      <button
                        key={`${question.id}-${index}`}
                        type="button"
                        onClick={() =>
                          setAnswer(
                            question.id,
                            value
                          )
                        }
                        className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
                          selected
                            ? "border-[#b15d2b] bg-orange-50"
                            : "border-slate-200 bg-white hover:border-slate-400"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                            selected
                              ? "bg-[#b15d2b] text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {String.fromCharCode(
                            65 +
                              index
                          )}
                        </span>

                        <span className="pt-1 font-semibold text-slate-700">
                          {option}
                        </span>
                      </button>
                    )
                  }
                )}
              </div>
            ) : (
              <textarea
                value={
                  answers[
                    question.id
                  ] ??
                  ""
                }
                onChange={(
                  event
                ) =>
                  setAnswer(
                    question.id,
                    event.target
                      .value
                  )
                }
                rows={
                  question.question_type ===
                  "short_answer"
                    ? 3
                    : 7
                }
                placeholder="Type your answer here..."
                className="w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 text-base outline-none transition focus:border-[#b15d2b] focus:ring-2 focus:ring-orange-100"
              />
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={
                  currentQuestion ===
                  0
                }
                onClick={() =>
                  setCurrentQuestion(
                    (
                      current
                    ) =>
                      Math.max(
                        0,
                        current -
                          1
                      )
                  )
                }
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>

              {!isLast ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentQuestion(
                      (
                        current
                      ) =>
                        Math.min(
                          mock.questions
                            .length -
                            1,
                          current +
                            1
                        )
                    )
                  }
                  className="flex items-center gap-2 rounded-xl bg-[#10243d] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    handleSubmit()
                  }
                  disabled={
                    submitting
                  }
                  className="flex items-center gap-2 rounded-xl bg-[#b15d2b] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {submitting
                    ? "Submitting..."
                    : "Finish Test"}
                </button>
              )}
            </div>

            {error && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                {error}
              </div>
            )}
          </section>

          <aside className="h-fit rounded-3xl bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Test progress
              </p>

              <div className="mt-2 flex items-end justify-between">
                <span className="text-2xl font-black text-[#10243d]">
                  {
                    answeredCount
                  }
                  /
                  {
                    mock.questions
                      .length
                  }
                </span>

                <span className="text-sm font-semibold text-slate-500">
                  answered
                </span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {mock.questions.map(
                (
                  item,
                  index
                ) => {
                  const answered =
                    Boolean(
                      answers[
                        item.id
                      ]?.trim()
                    )

                  return (
                    <button
                      key={
                        item.id
                      }
                      type="button"
                      onClick={() =>
                        setCurrentQuestion(
                          index
                        )
                      }
                      className={`flex h-10 items-center justify-center rounded-xl text-sm font-black transition ${
                        index ===
                        currentQuestion
                          ? "bg-[#10243d] text-white"
                          : answered
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {index +
                        1}
                    </button>
                  )
                }
              )}
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-[#10243d]" />
                Current
              </div>

              <div className="mt-2 flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-green-100" />
                Answered
              </div>

              <div className="mt-2 flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-slate-100" />
                Unanswered
              </div>
            </div>
          </aside>
        </div>
      </main>
    )
  }

  /*
   * ---------------------------------------------------------
   * GENERATOR SCREEN
   * ---------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-[#f4f1ea]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10243d] text-white">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#b15d2b]">
                GlobeDk AI Learning Hub
              </p>

              <h1 className="text-xl font-black text-[#10243d]">
                Mock Lab
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-2 text-sm font-black text-[#b15d2b]">
              <Zap className="h-4 w-4" />
              {credits}{" "}
              AI Credits
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <section className="rounded-3xl bg-[#10243d] p-7 text-white shadow-xl sm:p-10">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Target className="h-7 w-7 text-orange-200" />
            </div>

            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-orange-200">
              AI-Powered Practice
            </p>

            <h2 className="max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
              Turn your exam predictions into a fresh mock test.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Mock Lab uses your latest ZIMSEC
              Mathematics prediction topics to
              create completely new practice
              questions designed to test the
              same skills.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <Sparkles className="mb-3 h-5 w-5 text-orange-200" />

                <p className="font-bold">
                  Fresh Questions
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-300">
                  Not simple copies of predicted questions.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <Target className="mb-3 h-5 w-5 text-orange-200" />

                <p className="font-bold">
                  Targeted Practice
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-300">
                  Focused on likely exam skills and topics.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <Trophy className="mb-3 h-5 w-5 text-orange-200" />

                <p className="font-bold">
                  Instant Results
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-300">
                  See your score and weak topics after submission.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-7 shadow-sm sm:p-8">
            <div className="mb-7">
              <p className="text-sm font-bold uppercase tracking-widest text-[#b15d2b]">
                Create Mock
              </p>

              <h2 className="mt-2 text-2xl font-black text-[#10243d]">
                Build your test
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Subject
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <GraduationCap className="h-5 w-5 text-[#b15d2b]" />

                  <div>
                    <p className="font-bold text-[#10243d]">
                      Mathematics
                    </p>

                    <p className="text-xs text-slate-500">
                      {student?.level ??
                        "O-Level"}{" "}
                      •{" "}
                      {student?.curriculum ??
                        "ZIMSEC"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Paper
                </label>

                <select
                  value={paper}
                  onChange={(
                    event
                  ) =>
                    setPaper(
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#b15d2b] focus:ring-2 focus:ring-orange-100"
                >
                  <option>
                    Both Papers
                  </option>

                  <option>
                    Paper 1
                  </option>

                  <option>
                    Paper 2
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Number of questions
                </label>

                <select
                  value={
                    questionCount
                  }
                  onChange={(
                    event
                  ) =>
                    setQuestionCount(
                      Number(
                        event.target
                          .value
                      )
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#b15d2b] focus:ring-2 focus:ring-orange-100"
                >
                  <option value={5}>
                    5 questions
                  </option>

                  <option value={10}>
                    10 questions
                  </option>

                  <option value={15}>
                    15 questions
                  </option>

                  <option value={20}>
                    20 questions
                  </option>
                </select>
              </div>

              <div className="rounded-2xl bg-orange-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">
                    Generation cost
                  </span>

                  <span className="flex items-center gap-1 font-black text-[#b15d2b]">
                    <Zap className="h-4 w-4" />
                    1 AI Credit
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Available
                  </span>

                  <span className="font-bold">
                    {credits} credits
                  </span>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>
                    {error}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={
                  generateMock
                }
                disabled={
                  generating ||
                  credits < 1
                }
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#b15d2b] px-5 py-4 text-sm font-black text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating Mock...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate Mock Test
                  </>
                )}
              </button>

              {credits <
                1 && (
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/ai/credits"
                    )
                  }
                  className="w-full rounded-2xl border border-[#10243d] px-5 py-3 text-sm font-black text-[#10243d] transition hover:bg-slate-50"
                >
                  Get AI Credits
                </button>
              )}
            </div>
          </section>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <FileQuestion className="mb-3 h-6 w-6 text-[#b15d2b]" />

            <p className="font-black text-[#10243d]">
              Prediction-Based
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Questions are created around the topics identified by your latest prediction.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <CheckCircle2 className="mb-3 h-6 w-6 text-green-600" />

            <p className="font-black text-[#10243d]">
              Exam Practice
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Practice under a timed test environment before your actual examination.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <Trophy className="mb-3 h-6 w-6 text-[#b15d2b]" />

            <p className="font-black text-[#10243d]">
              Learn From Results
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Your results identify the areas that need more revision.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}