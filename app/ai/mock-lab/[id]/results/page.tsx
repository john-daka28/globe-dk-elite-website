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
  correct_answer?: string | null
  expected_answer?: string | null
  marking_guide?: string | null
  explanation: string | null
  answer_explanation?: string | null
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

/* ============================================================
   MATH / LATEX FORMATTER
   Converts common stored LaTeX into student-friendly
   Unicode / linear examination notation.
   ============================================================ */

function formatMathText(value: string | null | undefined) {
  if (!value) {
    return ""
  }

  let text = String(value)

  /* ----------------------------------------------------------
     Remove display / inline math delimiters
     ---------------------------------------------------------- */

  text = text
    .replace(/\$\$/g, "")
    .replace(/\$/g, "")
    .replace(/\\\(/g, "")
    .replace(/\\\)/g, "")
    .replace(/\\\[/g, "")
    .replace(/\\\]/g, "")

  /* ----------------------------------------------------------
     Fractions
     Example:
       \frac{2}{a} -> 2/a
       \frac{a+b}{c} -> (a+b)/c
     ---------------------------------------------------------- */

  function replaceFractions(input: string) {
    let result = input
    let previous = ""

    while (result !== previous) {
      previous = result

      result = result.replace(
        /\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g,
        (_match, numerator, denominator) => {
          const n = String(numerator).trim()
          const d = String(denominator).trim()

          const formattedNumerator =
            /[+\-=]/.test(n)
              ? `(${n})`
              : n

          const formattedDenominator =
            /[+\-=]/.test(d)
              ? `(${d})`
              : d

          return `${formattedNumerator}/${formattedDenominator}`
        }
      )
    }

    return result
  }

  text = replaceFractions(text)

  /* ----------------------------------------------------------
     Square roots
     ---------------------------------------------------------- */

  text = text.replace(
    /\\sqrt\s*\[([^\]]+)\]\s*\{([^{}]*)\}/g,
    "√[$1]($2)"
  )

  text = text.replace(
    /\\sqrt\s*\{([^{}]*)\}/g,
    "√($1)"
  )

  text = text.replace(
    /\\sqrt\s+([A-Za-z0-9]+)/g,
    "√$1"
  )

  /* ----------------------------------------------------------
     Common mathematical symbols
     ---------------------------------------------------------- */

  const replacements: Array<[RegExp, string]> = [
    [/\\times/g, "×"],
    [/\\cdot/g, "·"],
    [/\\div/g, "÷"],
    [/\\pm/g, "±"],
    [/\\mp/g, "∓"],
    [/\\leq/g, "≤"],
    [/\\le/g, "≤"],
    [/\\geq/g, "≥"],
    [/\\ge/g, "≥"],
    [/\\neq/g, "≠"],
    [/\\ne/g, "≠"],
    [/\\approx/g, "≈"],
    [/\\equiv/g, "≡"],
    [/\\infty/g, "∞"],
    [/\\pi/g, "π"],
    [/\\theta/g, "θ"],
    [/\\alpha/g, "α"],
    [/\\beta/g, "β"],
    [/\\gamma/g, "γ"],
    [/\\delta/g, "δ"],
    [/\\lambda/g, "λ"],
    [/\\mu/g, "μ"],
    [/\\sigma/g, "σ"],
    [/\\omega/g, "ω"],
    [/\\degree/g, "°"],
    [/\\circ/g, "°"],
    [/\\%/g, "%"],
    [/\\rightarrow/g, "→"],
    [/\\to/g, "→"],
    [/\\left/g, ""],
    [/\\right/g, ""],
    [/\\, /g, " "],
    [/\\,/g, " "],
    [/\\;/g, " "],
    [/\\:/g, " "],
  ]

  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement)
  }

  /* ----------------------------------------------------------
     Superscripts
     ---------------------------------------------------------- */

  const superscriptMap: Record<string, string> = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
    "+": "⁺",
    "-": "⁻",
    "=": "⁼",
    "(": "⁽",
    ")": "⁾",
    n: "ⁿ",
    x: "ˣ",
    y: "ʸ",
  }

  function convertSuperscript(content: string) {
    return content
      .split("")
      .map((character) =>
        superscriptMap[character] ?? character
      )
      .join("")
  }

  text = text.replace(
    /\^\s*\{([^{}]*)\}/g,
    (_match, content) =>
      convertSuperscript(String(content))
  )

  text = text.replace(
    /\^\s*([A-Za-z0-9])/g,
    (_match, character) =>
      convertSuperscript(String(character))
  )

  /* ----------------------------------------------------------
     Subscripts
     ---------------------------------------------------------- */

  const subscriptMap: Record<string, string> = {
    "0": "₀",
    "1": "₁",
    "2": "₂",
    "3": "₃",
    "4": "₄",
    "5": "₅",
    "6": "₆",
    "7": "₇",
    "8": "₈",
    "9": "₉",
    "+": "₊",
    "-": "₋",
    "=": "₌",
    "(": "₍",
    ")": "₎",
    a: "ₐ",
    e: "ₑ",
    h: "ₕ",
    i: "ᵢ",
    j: "ⱼ",
    k: "ₖ",
    l: "ₗ",
    m: "ₘ",
    n: "ₙ",
    o: "ₒ",
    p: "ₚ",
    r: "ᵣ",
    s: "ₛ",
    t: "ₜ",
    u: "ᵤ",
    v: "ᵥ",
    x: "ₓ",
  }

  function convertSubscript(content: string) {
    return content
      .split("")
      .map((character) =>
        subscriptMap[character] ?? character
      )
      .join("")
  }

  text = text.replace(
    /_\s*\{([^{}]*)\}/g,
    (_match, content) =>
      convertSubscript(String(content))
  )

  text = text.replace(
    /_\s*([A-Za-z0-9])/g,
    (_match, character) =>
      convertSubscript(String(character))
  )

  /* ----------------------------------------------------------
     Matrix notation
     Example:
       \begin{pmatrix}1 & 2 \\ 3 & 4\end{pmatrix}
       -> [1  2; 3  4]
     ---------------------------------------------------------- */

  text = text.replace(
    /\\begin\{(?:pmatrix|bmatrix|matrix)\}([\s\S]*?)\\end\{(?:pmatrix|bmatrix|matrix)\}/g,
    (_match, content) => {
      const rows = String(content)
        .split(/\\\\/)
        .map((row) =>
          row
            .split("&")
            .map((cell) => cell.trim())
            .filter(Boolean)
            .join("  ")
        )
        .filter(Boolean)

      return `[${rows.join("; ")}]`
    }
  )

  /* ----------------------------------------------------------
     Cases / arrays where possible
     ---------------------------------------------------------- */

  text = text.replace(
    /\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g,
    (_match, content) => {
      const rows = String(content)
        .split(/\\\\/)
        .map((row) =>
          row
            .replace(/&/g, " ")
            .trim()
        )
        .filter(Boolean)

      return rows.length
        ? rows.join("; ")
        : String(content)
    }
  )

  /* ----------------------------------------------------------
     Remove remaining common LaTeX commands
     ---------------------------------------------------------- */

  text = text.replace(
    /\\text\s*\{([^{}]*)\}/g,
    "$1"
  )

  text = text.replace(
    /\\mathrm\s*\{([^{}]*)\}/g,
    "$1"
  )

  text = text.replace(
    /\\mathbf\s*\{([^{}]*)\}/g,
    "$1"
  )

  text = text.replace(
    /\\operatorname\s*\{([^{}]*)\}/g,
    "$1"
  )

  /* ----------------------------------------------------------
     Line breaks and remaining LaTeX syntax
     ---------------------------------------------------------- */

  text = text
    .replace(/\\\\/g, "\n")
    .replace(/\\newline/g, "\n")
    .replace(/\\quad/g, " ")
    .replace(/\\qquad/g, " ")
    .replace(/\\hspace\{[^{}]*\}/g, " ")
    .replace(/\\vspace\{[^{}]*\}/g, " ")

  /* Remove remaining backslash commands */
  text = text.replace(
    /\\[a-zA-Z]+/g,
    ""
  )

  /* Remove leftover braces */
  text = text
    .replace(/[{}]/g, "")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim()

  return text
}

/* ============================================================
   ANSWER DISPLAY HELPERS
   ============================================================ */

function normalizeAnswer(
  value: string | null | undefined
) {
  if (
    value === null ||
    value === undefined ||
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    return null
  }

  return formatMathText(value)
}

function getExpectedAnswer(question: Question) {
  return (
    question.correct_answer ??
    question.expected_answer ??
    null
  )
}

function getQuestionTypeLabel(
  questionType: string
) {
  const normalized = questionType
    .toLowerCase()
    .replace(/[-_]/g, " ")

  if (
    normalized.includes("multiple") ||
    normalized === "mcq"
  ) {
    return "Multiple Choice"
  }

  if (
    normalized.includes("short") &&
    normalized.includes("answer")
  ) {
    return "Short Answer"
  }

  if (
    normalized.includes("true") ||
    normalized.includes("false")
  ) {
    return "True / False"
  }

  return questionType
}

function getPerformanceLabel(
  percentage: number
) {
  if (percentage >= 80) {
    return "Excellent"
  }

  if (percentage >= 70) {
    return "Good"
  }

  if (percentage >= 50) {
    return "Needs Practice"
  }

  return "Needs Revision"
}

function formatDate(value: string) {
  if (!value) {
    return "—"
  }

  try {
    return new Date(value).toLocaleDateString(
      "en-ZW",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    )
  } catch {
    return value
  }
}

/* ============================================================
   PAGE
   ============================================================ */

export default function MockResultsPage() {
  const router = useRouter()
  const params = useParams()

  const mockId = String(
    params?.id ?? ""
  )

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState("")

  const [
    mock,
    setMock,
  ] = useState<Mock | null>(null)

  const [
    attempt,
    setAttempt,
  ] = useState<Attempt | null>(null)

  const [
    questions,
    setQuestions,
  ] = useState<Question[]>([])

  const [
    answers,
    setAnswers,
  ] = useState<Answer[]>([])

  /* ==========================================================
     LOAD RESULTS
     ========================================================== */

  useEffect(() => {
    if (!mockId) {
      return
    }

    async function loadResults() {
      try {
        setLoading(true)
        setError("")

        const response =
          await fetch(
            `/api/ai/mock-lab/${mockId}/submit`,
            {
              cache: "no-store",
              credentials: "include",
            }
          )

        const data =
          await response.json()

        if (!response.ok) {
          setError(
            data.error ||
              "Unable to load your mock results."
          )

          return
        }

        setMock(data.mock ?? null)
        setAttempt(data.attempt ?? null)
        setQuestions(
          Array.isArray(data.questions)
            ? data.questions
            : []
        )
        setAnswers(
          Array.isArray(data.answers)
            ? data.answers
            : []
        )
      } catch (loadError) {
        console.error(
          "Mock results loading error:",
          loadError
        )

        setError(
          "Something went wrong while loading your results."
        )
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [mockId])

  /* ==========================================================
     ANSWER LOOKUP
     ========================================================== */

  const answerMap = useMemo(() => {
    const map = new Map<
      string,
      Answer
    >()

    for (const answer of answers) {
      map.set(
        answer.question_id,
        answer
      )
    }

    return map
  }, [answers])

  /* ==========================================================
     SORTED QUESTIONS
     ========================================================== */

  const sortedQuestions = useMemo(() => {
    return [...questions].sort(
      (a, b) =>
        a.question_number -
        b.question_number
    )
  }, [questions])

  /* ==========================================================
     TOPIC PERFORMANCE
     ========================================================== */

  const topicPerformance =
    useMemo<TopicPerformance[]>(() => {
      const topicMap =
        new Map<
          string,
          {
            marks: number
            awarded: number
            questions: number
            correct: number
          }
        >()

      for (const question of questions) {
        const topic =
          question.topic?.trim() ||
          "Other"

        const existing =
          topicMap.get(topic) ?? {
            marks: 0,
            awarded: 0,
            questions: 0,
            correct: 0,
          }

        const answer =
          answerMap.get(question.id)

        existing.marks +=
          Number(question.marks) || 0

        existing.awarded +=
          Number(
            answer?.marks_awarded ?? 0
          )

        existing.questions += 1

        if (answer?.is_correct) {
          existing.correct += 1
        }

        topicMap.set(
          topic,
          existing
        )
      }

      return Array.from(
        topicMap.entries()
      )
        .map(
          ([
            topic,
            performance,
          ]) => ({
            topic,
            marks: performance.marks,
            awarded:
              performance.awarded,
            questions:
              performance.questions,
            correct:
              performance.correct,
            percentage:
              performance.marks > 0
                ? Math.round(
                    (performance.awarded /
                      performance.marks) *
                      100
                  )
                : 0,
          })
        )
        .sort(
          (a, b) =>
            a.percentage -
            b.percentage
        )
    }, [
      questions,
      answerMap,
    ])

  /* ==========================================================
     WEAKEST TOPICS
     ========================================================== */

  const weakestTopics =
    useMemo(() => {
      return topicPerformance.slice(
        0,
        3
      )
    }, [topicPerformance])

  /* ==========================================================
     LOADING
     ========================================================== */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f1ea]">
        <div className="flex items-center gap-3 text-[#10243d]">
          <Loader2 className="h-6 w-6 animate-spin" />

          <span className="font-semibold">
            Loading your results...
          </span>
        </div>
      </main>
    )
  }

  /* ==========================================================
     ERROR
     ========================================================== */

  if (
    error ||
    !mock ||
    !attempt
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f1ea] px-4">
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <XCircle className="h-7 w-7 text-red-600" />
          </div>

          <h1 className="mt-5 text-2xl font-black text-[#10243d]">
            Unable to load results
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {error ||
              "We could not find the results for this mock."}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/ai/mock-lab"
              )
            }
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#10243d] px-5 py-3 text-sm font-black text-white transition hover:bg-[#1a3555]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Mock Lab
          </button>
        </div>
      </main>
    )
  }

  /* ==========================================================
     DERIVED VALUES
     ========================================================== */

  const percentage = Math.round(
    Number(
      attempt.percentage ?? 0
    )
  )

  const performanceLabel =
    getPerformanceLabel(
      percentage
    )

  /* ==========================================================
     PAGE
     ========================================================== */

  return (
    <main className="min-h-screen bg-[#f4f1ea]">
      {/* ======================================================
          TOP NAVIGATION
          ====================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/ai/mock-lab"
              )
            }
            className="inline-flex items-center gap-2 text-sm font-black text-[#10243d] transition hover:text-[#b15d2b]"
          >
            <ArrowLeft className="h-4 w-4" />

            <span>
              Back to Mock Lab
            </span>
          </button>

          <div className="hidden items-center gap-2 text-sm font-bold text-slate-500 sm:flex">
            <BookOpen className="h-4 w-4 text-[#b15d2b]" />

            <span>
              GlobeDk AI Learning Hub
            </span>
          </div>
        </div>
      </header>

      {/* ======================================================
          CONTENT
          ====================================================== */}

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ====================================================
            RESULT HERO
            ==================================================== */}

        <section className="overflow-hidden rounded-3xl bg-[#10243d] shadow-xl">
          <div className="relative px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#e3a56f]/10" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_260px] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#e3a56f]">
                  <Trophy className="h-4 w-4" />

                  Mock Complete
                </div>

                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {mock.title}
                </h1>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80">
                    {mock.subject}
                  </span>

                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80">
                    {mock.level}
                  </span>

                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80">
                    {mock.curriculum}
                  </span>

                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80">
                    {mock.paper}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 text-center shadow-lg">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Your Score
                </p>

                <div className="mt-2 text-5xl font-black text-[#10243d]">
                  {percentage}%
                </div>

                <p className="mt-2 text-sm font-black text-[#b15d2b]">
                  {performanceLabel}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            STAT CARDS
            ==================================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Score
                </p>

                <p className="mt-2 text-2xl font-black text-[#10243d]">
                  {attempt.score}
                  <span className="text-base text-slate-400">
                    {" "}
                    /{" "}
                    {attempt.total_marks}
                  </span>
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e3a56f]/20">
                <Target className="h-5 w-5 text-[#b15d2b]" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Correct
                </p>

                <p className="mt-2 text-2xl font-black text-green-600">
                  {attempt.correct_count}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Incorrect
                </p>

                <p className="mt-2 text-2xl font-black text-red-600">
                  {attempt.incorrect_count}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Unanswered
                </p>

                <p className="mt-2 text-2xl font-black text-amber-600">
                  {attempt.unanswered_count}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
                <Clock3 className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            TOPIC PERFORMANCE
            ==================================================== */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#10243d]">
              <Target className="h-5 w-5 text-[#e3a56f]" />
            </div>

            <div>
              <h2 className="text-xl font-black text-[#10243d]">
                Topic Performance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                See how you performed across the different mathematics topics.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {topicPerformance.length === 0 ? (
              <div className="rounded-xl bg-[#f4f1ea] p-5 text-sm text-slate-600">
                Topic performance is not available for this mock.
              </div>
            ) : (
              topicPerformance.map(
                (topic) => (
                  <div
                    key={topic.topic}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-[#10243d]">
                          {topic.topic}
                        </p>

                        <p className="mt-1 text-xs font-medium text-slate-500">
                          {topic.correct} of{" "}
                          {topic.questions}{" "}
                          correct •{" "}
                          {topic.awarded} /{" "}
                          {topic.marks} marks
                        </p>
                      </div>

                      <span className="shrink-0 text-sm font-black text-[#10243d]">
                        {topic.percentage}%
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
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
              )
            )}
          </div>
        </section>

        {/* ====================================================
            RECOMMENDED REVISION
            ==================================================== */}

        <section className="mt-6 rounded-2xl border border-[#e3a56f]/40 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e3a56f]/20">
              <Zap className="h-5 w-5 text-[#b15d2b]" />
            </div>

            <div>
              <h2 className="text-xl font-black text-[#10243d]">
                Recommended Revision
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Focus your next revision session on these weaker areas.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {weakestTopics.length === 0 ? (
              <div className="rounded-xl bg-[#f4f1ea] p-5 text-sm text-slate-600">
                No revision recommendations are available yet.
              </div>
            ) : (
              weakestTopics.map(
                (topic, index) => (
                  <div
                    key={topic.topic}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 bg-[#f4f1ea] p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#10243d] text-sm font-black text-white">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-black text-[#10243d]">
                        {topic.topic}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {topic.percentage}% performance
                      </p>
                    </div>

                    <span className="text-xs font-black text-[#b15d2b]">
                      {getPerformanceLabel(
                        topic.percentage
                      )}
                    </span>
                  </div>
                )
              )
            )}
          </div>
        </section>

        {/* ====================================================
            QUESTION-BY-QUESTION REVIEW
            ==================================================== */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#10243d]">
                <BookOpen className="h-5 w-5 text-[#e3a56f]" />
              </div>

              <div>
                <h2 className="text-xl font-black text-[#10243d]">
                  Review Your Answers
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  Review each question, compare your answer with the expected answer, and see how your marks were awarded.
                </p>
              </div>
            </div>

            <div className="shrink-0 rounded-xl bg-[#f4f1ea] px-4 py-2 text-xs font-black text-[#10243d]">
              {sortedQuestions.length}{" "}
              {sortedQuestions.length === 1
                ? "Question"
                : "Questions"}
            </div>
          </div>

          <div className="mt-7 space-y-5">
            {sortedQuestions.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-[#f4f1ea] p-6 text-center text-sm font-medium text-slate-600">
                No questions are available for review.
              </div>
            ) : (
              sortedQuestions.map(
                (question) => {
                  const answer =
                    answerMap.get(
                      question.id
                    )

                  const expectedAnswer =
                    getExpectedAnswer(
                      question
                    )

                  const studentAnswer =
                    normalizeAnswer(
                      answer?.answer
                    )

                  const formattedQuestion =
                    formatMathText(
                      question.question_text
                    )

                  const formattedExpectedAnswer =
                    normalizeAnswer(
                      expectedAnswer
                    )

                  const explanation =
                    normalizeAnswer(
                      question.explanation ??
                        question.answer_explanation
                    )

                  const isUnanswered =
                    !answer ||
                    typeof answer.answer !== "string" ||
                    answer.answer.trim() === ""

                  const isCorrect =
                    Boolean(
                      answer?.is_correct
                    )

                  const questionType =
                    getQuestionTypeLabel(
                      question.question_type
                    )

                  return (
                    <article
                      key={question.id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >
                      {/* QUESTION HEADER */}

                      <div className="border-b border-slate-100 bg-[#f8f7f4] px-5 py-4 sm:px-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-lg bg-[#10243d] px-3 py-1.5 text-xs font-black text-white">
                              Question{" "}
                              {question.question_number}
                            </span>

                            {question.topic && (
                              <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                                {question.topic}
                              </span>
                            )}

                            {question.subtopic && (
                              <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-500 ring-1 ring-slate-200">
                                {question.subtopic}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-500 ring-1 ring-slate-200">
                              {questionType}
                            </span>

                            <span className="rounded-lg bg-[#e3a56f]/20 px-3 py-1.5 text-xs font-black text-[#b15d2b]">
                              {question.marks}{" "}
                              {question.marks === 1
                                ? "mark"
                                : "marks"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* QUESTION BODY */}

                      <div className="px-5 py-6 sm:px-6">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#b15d2b]">
                            Question
                          </p>

                          <div className="mt-3 whitespace-pre-wrap rounded-xl border border-slate-100 bg-[#f4f1ea]/60 p-5 text-[15px] font-medium leading-7 text-[#10243d]">
                            {formattedQuestion}
                          </div>
                        </div>

                        {/* MULTIPLE CHOICE OPTIONS */}

                        {Array.isArray(
                          question.options
                        ) &&
                          question.options.length >
                            0 && (
                            <div className="mt-5">
                              <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                                Answer Options
                              </p>

                              <div className="space-y-2">
                                {question.options.map(
                                  (
                                    option,
                                    optionIndex
                                  ) => {
                                    const formattedOption =
                                      formatMathText(
                                        option
                                      )

                                    const optionLabel =
                                      String.fromCharCode(
                                        65 +
                                          optionIndex
                                      )

                                    const normalizedOption =
                                      normalizeAnswer(
                                        option
                                      )

                                    const selected =
                                      studentAnswer !==
                                        null &&
                                      normalizedOption !==
                                        null &&
                                      studentAnswer
                                        .trim()
                                        .toLowerCase() ===
                                        normalizedOption
                                          .trim()
                                          .toLowerCase()

                                    const expected =
                                      formattedExpectedAnswer !==
                                        null &&
                                      normalizedOption !==
                                        null &&
                                      formattedExpectedAnswer
                                        .trim()
                                        .toLowerCase() ===
                                        normalizedOption
                                          .trim()
                                          .toLowerCase()

                                    return (
                                      <div
                                        key={`${question.id}-${optionIndex}`}
                                        className={`flex items-start gap-3 rounded-xl border p-3.5 ${
                                          expected
                                            ? "border-green-200 bg-green-50"
                                            : selected
                                              ? "border-red-200 bg-red-50"
                                              : "border-slate-200 bg-white"
                                        }`}
                                      >
                                        <span
                                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                                            expected
                                              ? "bg-green-600 text-white"
                                              : selected
                                                ? "bg-red-600 text-white"
                                                : "bg-slate-100 text-slate-600"
                                          }`}
                                        >
                                          {optionLabel}
                                        </span>

                                        <div className="min-w-0 flex-1">
                                          <p className="whitespace-pre-wrap text-sm font-medium leading-6 text-[#10243d]">
                                            {
                                              formattedOption
                                            }
                                          </p>

                                          <div className="mt-2 flex flex-wrap gap-2">
                                            {selected && (
                                              <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-black text-red-700">
                                                Your answer
                                              </span>
                                            )}

                                            {expected && (
                                              <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-black text-green-700">
                                                Expected answer
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  }
                                )}
                              </div>
                            </div>
                          )}

                        {/* ANSWER COMPARISON */}

                        <div className="mt-6 grid gap-4 lg:grid-cols-2">
                          {/* YOUR ANSWER */}

                          <div
                            className={`rounded-xl border p-5 ${
                              isUnanswered
                                ? "border-amber-200 bg-amber-50"
                                : isCorrect
                                  ? "border-green-200 bg-green-50"
                                  : "border-red-200 bg-red-50"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                                Your Answer
                              </p>

                              {isUnanswered ? (
                                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-black text-amber-700">
                                  Unanswered
                                </span>
                              ) : isCorrect ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-black text-green-700">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Correct
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-black text-red-700">
                                  <XCircle className="h-3.5 w-3.5" />
                                  Incorrect
                                </span>
                              )}
                            </div>

                            <div className="mt-3 min-h-[72px] whitespace-pre-wrap rounded-lg border border-black/5 bg-white/70 p-4 text-sm font-semibold leading-6 text-[#10243d]">
                              {studentAnswer ||
                                "No answer submitted"}
                            </div>
                          </div>

                          {/* EXPECTED ANSWER */}

                          <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                                Expected Answer
                              </p>

                              <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-black text-green-700">
                                Correct Answer
                              </span>
                            </div>

                            <div className="mt-3 min-h-[72px] whitespace-pre-wrap rounded-lg border border-green-100 bg-white/70 p-4 text-sm font-semibold leading-6 text-[#10243d]">
                              {formattedExpectedAnswer ||
                                "Expected answer not available for this question."}
                            </div>
                          </div>
                        </div>

                        {/* MARKS */}

                        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-100 bg-[#f8f7f4] p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                              Marks Awarded
                            </p>

                            <p className="mt-1 text-sm font-bold text-[#10243d]">
                              {answer?.marks_awarded ??
                                0}{" "}
                              out of{" "}
                              {question.marks}{" "}
                              marks
                            </p>
                          </div>

                          <div className="flex h-10 items-center rounded-xl bg-white px-4 ring-1 ring-slate-200">
                            <span className="text-lg font-black text-[#10243d]">
                              {answer?.marks_awarded ??
                                0}
                            </span>

                            <span className="mx-1 text-sm font-bold text-slate-400">
                              /
                            </span>

                            <span className="text-sm font-black text-slate-500">
                              {question.marks}
                            </span>
                          </div>
                        </div>

                        {/* EXPLANATION */}

                        {explanation && (
                          <div className="mt-4 rounded-xl border border-[#e3a56f]/30 bg-[#e3a56f]/10 p-5">
                            <div className="flex items-start gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e3a56f]/30">
                                <BookOpen className="h-4 w-4 text-[#b15d2b]" />
                              </div>

                              <div className="min-w-0">
                                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#b15d2b]">
                                  Explanation
                                </p>

                                <p className="mt-2 whitespace-pre-wrap text-sm font-medium leading-6 text-[#10243d]">
                                  {explanation}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  )
                }
              )
            )}
          </div>
        </section>

        {/* ====================================================
            TEST INFORMATION
            ==================================================== */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#10243d]">
              <Clock3 className="h-5 w-5 text-[#e3a56f]" />
            </div>

            <div>
              <h2 className="text-xl font-black text-[#10243d]">
                Test Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Details about this mock attempt.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-[#f4f1ea] p-4">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                Questions
              </p>

              <p className="mt-1 text-lg font-black text-[#10243d]">
                {mock.total_questions}
              </p>
            </div>

            <div className="rounded-xl bg-[#f4f1ea] p-4">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                Total Marks
              </p>

              <p className="mt-1 text-lg font-black text-[#10243d]">
                {mock.total_marks}
              </p>
            </div>

            <div className="rounded-xl bg-[#f4f1ea] p-4">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                Duration
              </p>

              <p className="mt-1 text-lg font-black text-[#10243d]">
                {mock.duration_minutes}{" "}
                min
              </p>
            </div>

            <div className="rounded-xl bg-[#f4f1ea] p-4">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                Submitted
              </p>

              <p className="mt-1 text-lg font-black text-[#10243d]">
                {formatDate(
                  attempt.submitted_at
                )}
              </p>
            </div>
          </div>

          {/* ACTIONS */}

          <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/ai/revision-coach"
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-[#10243d] transition hover:border-[#e3a56f] hover:bg-[#f4f1ea]"
            >
              <Target className="h-4 w-4" />
              Review Weak Topics
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/ai/mock-lab"
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10243d] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#1a3555]"
            >
              <RotateCcw className="h-4 w-4" />
              Try Another Mock
            </button>
          </div>
        </section>

        {/* ====================================================
            FOOTER
            ==================================================== */}

        <footer className="py-8 text-center">
          <p className="text-xs font-semibold text-slate-400">
            GlobeDk Elite Academy • AI Learning Hub
          </p>
        </footer>
      </div>
    </main>
  )
}