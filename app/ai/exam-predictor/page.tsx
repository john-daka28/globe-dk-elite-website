"use client"

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Coins,
  FileText,
  GraduationCap,
  Loader2,
  LogOut,
  Menu,
  MessageCircle,
  Sparkles,
  Target,
  TrendingUp,
  X,
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

type Prediction = {
  paper: "Paper 1" | "Paper 2"
  question_number: number
  topic: string
  predicted_question: string
  prediction_reason: string
  confidence: number
  source_question_ids: string[]
}

type Student = {
  id: string
  email: string
  firstName: string
  lastName: string
  level: "O-Level" | "A-Level"
  curriculum: "ZIMSEC" | "Cambridge"
}

type MeResponse = {
  authenticated: boolean
  student?: Student
  credits?: {
    balance: number
  }
  error?: string
}

type PredictorResponse = {
  success?: boolean
  error?: string
  code?: string
  requiresPayment?: boolean
  predictions?: Prediction[]
  runId?: string
  credits?: number
}

export default function AIExamPredictorPage() {
  const router = useRouter()

  const [student, setStudent] =
    useState<Student | null>(null)

  const [credits, setCredits] =
    useState(0)

  const [subject, setSubject] =
    useState("Mathematics")

  const [paper, setPaper] =
    useState("Both")

  const [loading, setLoading] =
    useState(true)

  const [generating, setGenerating] =
    useState(false)

  const [signingOut, setSigningOut] =
    useState(false)

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)

  const [error, setError] =
    useState("")

  const [predictions, setPredictions] =
    useState<Prediction[]>([])

  const [runId, setRunId] =
    useState("")

  useEffect(() => {
    loadPredictor()
  }, [])

  async function loadPredictor() {
    try {
      setLoading(true)
      setError("")

      const response =
        await fetch(
          "/api/ai/auth/me",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        )

      const data: MeResponse =
        await response.json()

      if (
        !response.ok ||
        !data.authenticated ||
        !data.student
      ) {
        router.replace("/ai/signin")
        return
      }

      setStudent(data.student)

      setCredits(
        data.credits?.balance ?? 0
      )
    } catch (error) {
      console.error(
        "Exam Predictor loading error:",
        error
      )

      setError(
        "Unable to connect to the server."
      )
    } finally {
      setLoading(false)
    }
  }

  async function generatePredictions() {
    if (!student) {
      return
    }

    if (credits < 1) {
      setError(
        "You do not have enough AI credits to run the Exam Predictor."
      )

      return
    }

    try {
      setGenerating(true)
      setError("")
      setPredictions([])
      setRunId("")

      const response =
        await fetch(
          "/api/ai/exam-predictor",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials: "include",

            body:
              JSON.stringify({
                subject,
                paper,
              }),
          }
        )

      const data: PredictorResponse =
        await response.json()

      if (
        response.status === 401
      ) {
        router.replace("/ai/signin")
        return
      }

      if (
        response.status === 402 ||
        data.code ===
          "INSUFFICIENT_CREDITS"
      ) {
        setCredits(0)

        setError(
          "You do not have enough AI credits to run the Exam Predictor."
        )

        return
      }

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.error ||
            "Unable to generate predictions."
        )

        return
      }

      setPredictions(
        data.predictions || []
      )

      setRunId(
        data.runId || ""
      )

      if (
        typeof data.credits ===
        "number"
      ) {
        setCredits(
          data.credits
        )
      } else {
        setCredits(
          (current) =>
            Math.max(
              0,
              current - 1
            )
        )
      }
    } catch (error) {
      console.error(
        "Prediction generation error:",
        error
      )

      setError(
        "Something went wrong while generating the predictions. Please try again."
      )
    } finally {
      setGenerating(false)
    }
  }

  async function handleSignOut() {
    try {
      setSigningOut(true)

      await fetch(
        "/api/ai/auth/signout",
        {
          method: "POST",
          credentials: "include",
        }
      )

      router.replace("/ai/signin")
      router.refresh()
    } catch (error) {
      console.error(
        "Sign out error:",
        error
      )

      setSigningOut(false)
    }
  }

  function openFeature(
    path: string
  ) {
    setMobileMenuOpen(false)
    router.push(path)
  }

  const paper1 =
    useMemo(
      () =>
        predictions.filter(
          (item) =>
            item.paper ===
            "Paper 1"
        ),
      [predictions]
    )

  const paper2 =
    useMemo(
      () =>
        predictions.filter(
          (item) =>
            item.paper ===
            "Paper 2"
        ),
      [predictions]
    )

  const averageConfidence =
    predictions.length
      ? Math.round(
          predictions.reduce(
            (sum, item) =>
              sum +
              Number(
                item.confidence ||
                  0
              ),
            0
          ) /
            predictions.length
        )
      : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f1ea] flex items-center justify-center">
        <div className="text-center">

          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#10243d]/20 border-t-[#e3a56f]" />

          <p className="text-sm font-medium text-[#10243d]/70">
            Loading your Exam Predictor...
          </p>

        </div>
      </div>
    )
  }

  if (!student) {
    return null
  }

  const firstName =
    student.firstName ||
    "Student"

  const fullName =
    `${student.firstName} ${student.lastName}`.trim()

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#10243d]">

      {/* =========================================================
          MOBILE MENU
      ========================================================= */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <div
            className="absolute inset-0 bg-[#10243d]/50"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          />

          <aside className="relative flex h-full w-[290px] flex-col bg-[#10243d] px-5 py-6 shadow-2xl">

            <div className="mb-8 flex items-center justify-between">

              <div>
                <p className="text-lg font-black tracking-tight text-white">
                  GlobeDk AI
                </p>

                <p className="text-xs text-white/60">
                  Learning Hub
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <nav className="space-y-2">

              <MobileNavItem
                icon={Brain}
                label="Dashboard"
                onClick={() =>
                  openFeature("/ai")
                }
              />

              <MobileNavItem
                icon={Sparkles}
                label="Exam Predictor"
                active
                onClick={() =>
                  setMobileMenuOpen(false)
                }
              />

              <MobileNavItem
                icon={FileText}
                label="Mock Lab"
                onClick={() =>
                  openFeature(
                    "/ai/mock-lab"
                  )
                }
              />

              <MobileNavItem
                icon={Target}
                label="Revision Coach"
                onClick={() =>
                  openFeature(
                    "/ai/revision-coach"
                  )
                }
              />

              <MobileNavItem
                icon={MessageCircle}
                label="AI Tutor"
                onClick={() =>
                  openFeature(
                    "/ai/tutor"
                  )
                }
              />

              <MobileNavItem
                icon={TrendingUp}
                label="My Progress"
                onClick={() =>
                  openFeature(
                    "/ai/progress"
                  )
                }
              />

            </nav>

            <div className="mt-auto border-t border-white/10 pt-5">

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >

                <LogOutIcon />

                {signingOut
                  ? "Signing out..."
                  : "Sign out"}

              </button>

            </div>

          </aside>
        </div>
      )}

      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] border-r border-[#10243d]/10 bg-[#10243d] lg:flex lg:flex-col">

        {/* Logo */}

        <div className="border-b border-white/10 px-6 py-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e3a56f] shadow-lg">
              <Brain className="h-6 w-6 text-[#10243d]" />
            </div>

            <div>
              <p className="text-lg font-black tracking-tight text-white">
                GlobeDk AI
              </p>

              <p className="text-xs text-white/55">
                Learning Hub
              </p>
            </div>

          </div>

        </div>

        {/* Navigation */}

        <nav className="flex-1 space-y-1 px-4 py-6">

          <SidebarItem
            icon={Brain}
            label="Dashboard"
            onClick={() =>
              openFeature("/ai")
            }
          />

          <SidebarItem
            icon={Sparkles}
            label="Exam Predictor"
            active
            onClick={() =>
              setMobileMenuOpen(false)
            }
          />

          <SidebarItem
            icon={FileText}
            label="Mock Lab"
            onClick={() =>
              openFeature(
                "/ai/mock-lab"
              )
            }
          />

          <SidebarItem
            icon={Target}
            label="Revision Coach"
            onClick={() =>
              openFeature(
                "/ai/revision-coach"
              )
            }
          />

          <SidebarItem
            icon={MessageCircle}
            label="AI Tutor"
            onClick={() =>
              openFeature(
                "/ai/tutor"
              )
            }
          />

          <SidebarItem
            icon={TrendingUp}
            label="My Progress"
            onClick={() =>
              openFeature(
                "/ai/progress"
              )
            }
          />

        </nav>

        {/* Account */}

        <div className="border-t border-white/10 p-4">

          <div className="mb-3 rounded-xl bg-white/5 p-3">

            <p className="truncate text-sm font-bold text-white">
              {fullName}
            </p>

            <p className="truncate text-xs text-white/50">
              {student.email}
            </p>

          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >

            <LogOutIcon />

            {signingOut
              ? "Signing out..."
              : "Sign out"}

          </button>

        </div>

      </aside>

      {/* =========================================================
          MAIN AREA
      ========================================================= */}

      <main className="lg:pl-[250px]">

        {/* =======================================================
            TOP BAR
        ======================================================= */}

        <header className="sticky top-0 z-30 border-b border-[#10243d]/10 bg-[#f4f1ea]/95 backdrop-blur">

          <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(true)
                }
                className="rounded-xl p-2 text-[#10243d] transition hover:bg-[#10243d]/5 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>

              <div className="lg:hidden">

                <p className="font-black text-[#10243d]">
                  GlobeDk AI
                </p>

                <p className="text-[11px] text-[#10243d]/50">
                  Learning Hub
                </p>

              </div>

              <div className="hidden lg:block">

                <p className="text-sm font-semibold text-[#10243d]/50">
                  AI Learning Hub
                </p>

                <p className="text-lg font-black">
                  Exam Predictor
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3">

              {/* Credits */}

              <button
                type="button"
                onClick={() =>
                  openFeature(
                    "/ai/credits"
                  )
                }
                className="group flex items-center gap-2 rounded-xl border border-[#10243d]/10 bg-white px-3 py-2 shadow-sm transition hover:border-[#e3a56f]"
              >

                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e3a56f]/20">
                  <Zap className="h-4 w-4 text-[#b15d2b]" />
                </div>

                <div className="text-left">

                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#10243d]/45">
                    AI Credits
                  </p>

                  <p className="text-sm font-black">
                    {credits}
                  </p>

                </div>

              </button>

              {/* Profile */}

              <button
                type="button"
                onClick={() =>
                  openFeature(
                    "/ai/profile"
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10243d] text-sm font-black text-white shadow-sm transition hover:bg-[#183452]"
                title={fullName}
              >
                {firstName
                  .charAt(0)
                  .toUpperCase()}
              </button>

            </div>

          </div>

        </header>

        {/* =======================================================
            PAGE CONTENT
        ======================================================= */}

        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

          {/* =====================================================
              PAGE HEADER
          ===================================================== */}

          <section className="mb-8">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#10243d] shadow-sm">
                <Sparkles className="h-7 w-7 text-[#e3a56f]" />
              </div>

              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <h1 className="text-3xl font-black tracking-tight text-[#10243d]">
                    AI Exam Predictor
                  </h1>

                  <span className="rounded-full bg-[#e3a56f]/20 px-3 py-1 text-xs font-black text-[#8c4c22]">
                    Pattern Analysis
                  </span>

                </div>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#10243d]/60 sm:text-base">
                  Analyse historical examination
                  questions and identify topics and
                  question styles that may be worth
                  prioritising in your revision.
                </p>

              </div>

            </div>

          </section>

          {/* =====================================================
              DISCLAIMER
          ===================================================== */}

          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">

            <div className="flex gap-3">

              <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

              <div>

                <p className="font-bold text-amber-900">
                  Important
                </p>

                <p className="mt-1 text-sm leading-6 text-amber-800">
                  These are AI-generated,
                  pattern-based predictions.
                  They are not leaked examination
                  questions and cannot guarantee what
                  will appear in the actual examination.
                  Use them to guide revision rather than
                  replacing full syllabus preparation.
                </p>

              </div>

            </div>

          </div>

          {/* =====================================================
              ERROR
          ===================================================== */}

          {error && (

            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5">

              <div className="flex gap-3">

                <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />

                <div className="flex-1">

                  <p className="font-bold text-red-800">
                    Unable to continue
                  </p>

                  <p className="mt-1 text-sm leading-6 text-red-700">
                    {error}
                  </p>

                  {(
                    error
                      .toLowerCase()
                      .includes(
                        "credit"
                      ) ||
                    error
                      .toLowerCase()
                      .includes(
                        "credits"
                      )
                  ) && (

                    <button
                      type="button"
                      onClick={() =>
                        openFeature(
                          "/ai/credits"
                        )
                      }
                      className="mt-3 inline-flex items-center gap-2 font-bold text-red-800 underline"
                    >
                      Get more AI credits
                      <ArrowRight className="h-4 w-4" />
                    </button>

                  )}

                </div>

              </div>

            </div>

          )}

          {/* =====================================================
              NO CREDIT NOTICE
          ===================================================== */}

          {credits < 1 &&
            !predictions.length && (

              <section className="mb-8">

                <div className="rounded-3xl border border-[#b15d2b]/30 bg-[#e3a56f]/10 p-6 shadow-sm">

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-start gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e3a56f]/30">
                        <Zap className="h-6 w-6 text-[#b15d2b]" />
                      </div>

                      <div>

                        <h2 className="font-black text-[#10243d]">
                          You need AI credits
                        </h2>

                        <p className="mt-1 max-w-2xl text-sm leading-6 text-[#10243d]/60">
                          The Exam Predictor uses
                          1 AI credit each time you
                          generate a new prediction.
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        openFeature(
                          "/ai/credits"
                        )
                      }
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#10243d] px-5 py-3 text-sm font-black text-white transition hover:bg-[#183452]"
                    >
                      Get AI Credits
                      <ArrowRight className="h-4 w-4" />
                    </button>

                  </div>

                </div>

              </section>

            )}

          {/* =====================================================
              CONTROL CARD
          ===================================================== */}

          {!predictions.length && (

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">

              <div className="rounded-3xl border border-[#10243d]/10 bg-white p-6 shadow-sm sm:p-8">

                <div className="mb-6">

                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#b15d2b]">
                    Prediction Setup
                  </p>

                  <h2 className="mt-1 text-xl font-black text-[#10243d]">
                    Start a prediction
                  </h2>

                  <p className="mt-1 text-sm text-[#10243d]/50">
                    Select the examination you want
                    GlobeDk AI to analyse.
                  </p>

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* SUBJECT */}

                  <div>

                    <label className="mb-2 block text-sm font-bold text-[#10243d]/70">
                      Subject
                    </label>

                    <div className="relative">

                      <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                      <select
                        value={subject}
                        onChange={(event) =>
                          setSubject(
                            event.target.value
                          )
                        }
                        className="w-full appearance-none rounded-xl border border-[#10243d]/10 bg-white py-3 pl-10 pr-10 text-sm font-medium outline-none transition focus:border-[#10243d] focus:ring-2 focus:ring-[#10243d]/5"
                      >

                        <option value="Mathematics">
                          Mathematics
                        </option>

                        <option disabled>
                          English — Coming Soon
                        </option>

                      </select>

                      <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    </div>

                  </div>

                  {/* LEVEL */}

                  <div>

                    <label className="mb-2 block text-sm font-bold text-[#10243d]/70">
                      Level
                    </label>

                    <div className="flex items-center gap-3 rounded-xl border border-[#10243d]/10 bg-gray-50 px-4 py-3">

                      <GraduationCap className="h-4 w-4 text-gray-500" />

                      <span className="text-sm font-semibold text-gray-700">
                        {student.level}
                      </span>

                    </div>

                  </div>

                  {/* CURRICULUM */}

                  <div>

                    <label className="mb-2 block text-sm font-bold text-[#10243d]/70">
                      Curriculum
                    </label>

                    <div className="flex items-center gap-3 rounded-xl border border-[#10243d]/10 bg-gray-50 px-4 py-3">

                      <FileText className="h-4 w-4 text-gray-500" />

                      <span className="text-sm font-semibold text-gray-700">
                        {student.curriculum}
                      </span>

                    </div>

                  </div>

                  {/* PAPER */}

                  <div>

                    <label className="mb-2 block text-sm font-bold text-[#10243d]/70">
                      Examination paper
                    </label>

                    <div className="relative">

                      <Target className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                      <select
                        value={paper}
                        onChange={(event) =>
                          setPaper(
                            event.target.value
                          )
                        }
                        className="w-full appearance-none rounded-xl border border-[#10243d]/10 bg-white py-3 pl-10 pr-10 text-sm font-medium outline-none transition focus:border-[#10243d] focus:ring-2 focus:ring-[#10243d]/5"
                      >

                        <option value="Both">
                          Paper 1 + Paper 2
                        </option>

                        <option value="Paper 1">
                          Paper 1 only
                        </option>

                        <option value="Paper 2">
                          Paper 2 only
                        </option>

                      </select>

                      <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    </div>

                  </div>

                </div>

                {/* ANALYSIS INFO */}

                <div className="mt-7 rounded-2xl bg-[#f4f1ea] p-5">

                  <div className="flex items-start gap-3">

                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#b15d2b]" />

                    <div>

                      <p className="font-black text-[#10243d]">
                        What GlobeDk AI will analyse
                      </p>

                      <ul className="mt-2 space-y-1 text-sm leading-6 text-[#10243d]/60">

                        <li>
                          • Historical question frequency
                        </li>

                        <li>
                          • Topic recurrence
                        </li>

                        <li>
                          • Question variations
                        </li>

                        <li>
                          • Paper 1 / Paper 2 patterns
                        </li>

                        <li>
                          • Recent examination trends
                        </li>

                      </ul>

                    </div>

                  </div>

                </div>

                {/* GENERATE */}

                <button
                  type="button"
                  onClick={
                    generatePredictions
                  }
                  disabled={
                    generating ||
                    credits < 1
                  }
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#10243d] px-5 py-4 text-sm font-black text-white shadow-sm transition hover:bg-[#183452] disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {generating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />

                      Analysing examination
                      patterns...
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5" />

                      Generate Predictions

                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}

                </button>

                <p className="mt-3 text-center text-xs text-[#10243d]/35">
                  This prediction costs 1 AI credit.
                </p>

              </div>

              {/* =================================================
                  SIDE INFORMATION
              ================================================= */}

              <div className="space-y-6">

                <div className="rounded-3xl bg-[#10243d] p-6 text-white shadow-sm">

                  <Sparkles className="h-7 w-7 text-[#e3a56f]" />

                  <h3 className="mt-4 text-lg font-black">
                    Your AI advantage
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Instead of randomly practising
                    questions, use historical patterns
                    to identify areas that deserve extra
                    attention.
                  </p>

                  <div className="mt-6 flex items-center gap-3">

                    <Coins className="h-5 w-5 text-[#e3a56f]" />

                    <div>

                      <p className="text-xs text-white/45">
                        Available credits
                      </p>

                      <p className="font-black">
                        {credits}
                      </p>

                    </div>

                  </div>

                </div>

                <div className="rounded-3xl border border-[#10243d]/10 bg-white p-6 shadow-sm">

                  <div className="flex items-center gap-3">

                    <TrendingUp className="h-5 w-5 text-[#b15d2b]" />

                    <h3 className="font-black">
                      Remember
                    </h3>

                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#10243d]/60">
                    A topic with a high prediction
                    score should become a revision
                    priority — but you should still
                    revise the complete syllabus.
                  </p>

                </div>

              </div>

            </section>

          )}

          {/* =====================================================
              RESULTS
          ===================================================== */}

          {predictions.length > 0 && (

            <section>

              {/* RESULT SUMMARY */}

              <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <ResultStat
                  label="Predictions"
                  value={
                    predictions.length
                  }
                />

                <ResultStat
                  label="Paper 1"
                  value={
                    paper1.length
                  }
                />

                <ResultStat
                  label="Paper 2"
                  value={
                    paper2.length
                  }
                />

                <ResultStat
                  label="Average confidence"
                  value={`${averageConfidence}%`}
                />

              </div>

              {/* RESULT HEADER */}

              <div className="mb-6 overflow-hidden rounded-3xl bg-[#10243d] p-6 text-white shadow-xl sm:p-8">

                <div className="relative">

                  <div className="absolute -right-20 -top-24 h-60 w-60 rounded-full bg-[#e3a56f]/10" />

                  <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">

                    <div>

                      <div className="flex items-center gap-2">

                        <CheckCircle2 className="h-5 w-5 text-[#e3a56f]" />

                        <span className="text-sm font-black text-[#e3a56f]">
                          Analysis complete
                        </span>

                      </div>

                      <h2 className="mt-2 text-2xl font-black">
                        Your examination prediction
                      </h2>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                        Based on the historical{" "}
                        {`${student.curriculum} ${student.level} ${subject}`}{" "}
                        dataset available to
                        GlobeDk AI.
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPredictions([])
                        setRunId("")
                        setError("")
                      }}
                      className="relative inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-[#10243d] transition hover:bg-gray-100"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      New prediction
                    </button>

                  </div>

                </div>

              </div>

              {/* RUN ID */}

              {runId && (

                <p className="mb-6 text-xs text-[#10243d]/35">
                  Prediction run: {runId}
                </p>

              )}

              {/* PAPER 1 */}

              {paper1.length > 0 && (

                <PredictionSection
                  title="Paper 1"
                  description="Priority questions and concepts identified from the historical pattern."
                  predictions={paper1}
                />

              )}

              {/* PAPER 2 */}

              {paper2.length > 0 && (

                <PredictionSection
                  title="Paper 2"
                  description="Structured and problem-solving areas identified from the historical pattern."
                  predictions={paper2}
                />

              )}

              {/* RESULTS DISCLAIMER */}

              <div className="mt-8 rounded-2xl border border-[#10243d]/10 bg-[#10243d]/[0.035] px-5 py-4">

                <div className="flex items-start gap-3">

                  <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-[#b15d2b]" />

                  <div>

                    <p className="text-sm font-black">
                      Use predictions wisely
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#10243d]/55 sm:text-sm">
                      These predictions are
                      generated from historical
                      examination patterns and
                      available learning data.
                      They are intended to help
                      prioritise revision and are
                      not guaranteed examination
                      questions.
                    </p>

                  </div>

                </div>

              </div>

            </section>

          )}

          {/* =====================================================
              FOOTER
          ===================================================== */}

          <section className="pb-6 pt-10">

            <p className="text-center text-xs text-[#10243d]/40">
              GlobeDk AI Learning Hub
              {" • "}
              GlobeDk Elite | Excellence in
              Education. Success for Life.
            </p>

          </section>

        </div>

      </main>

    </div>
  )
}

/* =============================================================
   SIDEBAR ITEM
============================================================= */

function SidebarItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ElementType
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "flex w-full items-center gap-3 rounded-xl bg-[#e3a56f] px-4 py-3 text-sm font-black text-[#10243d] shadow-sm"
          : "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
      }
    >

      <Icon className="h-5 w-5 shrink-0" />

      <span>
        {label}
      </span>

    </button>
  )
}

/* =============================================================
   MOBILE NAV ITEM
============================================================= */

function MobileNavItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ElementType
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "flex w-full items-center gap-3 rounded-xl bg-[#e3a56f] px-4 py-3 text-sm font-black text-[#10243d]"
          : "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
      }
    >

      <Icon className="h-5 w-5" />

      {label}

    </button>
  )
}

/* =============================================================
   LOGOUT ICON
============================================================= */

function LogOutIcon() {
  return (
    <LogOut className="h-5 w-5 shrink-0" />
  )
}

/* =============================================================
   RESULT STAT
============================================================= */

function ResultStat({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-2xl border border-[#10243d]/10 bg-white p-5 shadow-sm">

      <p className="text-sm font-medium text-[#10243d]/50">
        {label}
      </p>

      <p className="mt-1 text-3xl font-black text-[#10243d]">
        {value}
      </p>

    </div>
  )
}

/* =============================================================
   PREDICTION SECTION
============================================================= */

function PredictionSection({
  title,
  description,
  predictions,
}: {
  title: string
  description: string
  predictions: Prediction[]
}) {
  return (
    <section className="mb-10">

      <div className="mb-5">

        <h2 className="text-2xl font-black text-[#10243d]">
          {title}
        </h2>

        <p className="mt-1 text-sm text-[#10243d]/50">
          {description}
        </p>

      </div>

      <div className="grid gap-5">

        {predictions.map(
          (
            prediction,
            index
          ) => (

            <article
              key={`${prediction.paper}-${prediction.question_number}-${index}`}
              className="rounded-3xl border border-[#10243d]/10 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-7"
            >

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#10243d] text-sm font-black text-white">
                    {prediction.question_number}
                  </div>

                  <div>

                    <div className="flex flex-wrap items-center gap-2">

                      <span className="rounded-full bg-[#f4f1ea] px-3 py-1 text-xs font-black text-[#8c4c22]">
                        {prediction.topic}
                      </span>

                      <ConfidenceBadge
                        confidence={
                          prediction.confidence
                        }
                      />

                    </div>

                    <h3 className="mt-4 text-lg font-black leading-7 text-[#10243d]">
                      {prediction.predicted_question}
                    </h3>

                  </div>

                </div>

              </div>

              <div className="mt-5 border-t border-[#10243d]/5 pt-5">

                <p className="text-xs font-black uppercase tracking-wide text-[#10243d]/35">
                  Why GlobeDk AI selected this
                </p>

                <p className="mt-2 text-sm leading-6 text-[#10243d]/60">
                  {prediction.prediction_reason}
                </p>

              </div>

              {prediction.source_question_ids &&
                prediction.source_question_ids.length > 0 && (

                  <div className="mt-5 flex items-center gap-2 text-xs text-[#10243d]/35">

                    <FileText className="h-4 w-4" />

                    <span>
                      Based on{" "}
                      {
                        prediction
                          .source_question_ids
                          .length
                      }{" "}
                      historical question
                      {prediction.source_question_ids.length === 1
                        ? ""
                        : "s"}
                    </span>

                  </div>

                )}

            </article>

          )
        )}

      </div>

    </section>
  )
}

/* =============================================================
   CONFIDENCE BADGE
============================================================= */

function ConfidenceBadge({
  confidence,
}: {
  confidence: number
}) {
  const value =
    Number(confidence || 0)

  let label = "Low"

  if (value >= 75) {
    label = "High"
  } else if (value >= 50) {
    label = "Medium"
  }

  return (
    <span
      className={
        value >= 75
          ? "rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700"
          : value >= 50
            ? "rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700"
            : "rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-600"
      }
    >
      {label} confidence · {value}%
    </span>
  )
}