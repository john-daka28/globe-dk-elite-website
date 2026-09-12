
"use client"

import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  LogOut,
  Menu,
  MessageCircle,
  Play,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  X,
  Zap,
} from "lucide-react"

import {
  useEffect,
  useState,
} from "react"

import {
  useRouter,
} from "next/navigation"

import Image from "next/image"

type AIStudent = {
  id: string
  email: string
  firstName: string
  lastName: string
  level: "O-Level" | "A-Level"
  curriculum: "ZIMSEC" | "Cambridge"
}

type MeResponse = {
  authenticated: boolean
  student?: AIStudent
  credits?: {
    balance: number
  }
  error?: string
}

export default function AIDashboardPage() {
  const router = useRouter()

  const [student, setStudent] =
    useState<AIStudent | null>(null)

  const [credits, setCredits] =
    useState(0)

  const [loading, setLoading] =
    useState(true)

  const [signingOut, setSigningOut] =
    useState(false)

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      setLoading(true)

      const response = await fetch(
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
        "Dashboard loading error:",
        error
      )

      router.replace("/ai/signin")
    } finally {
      setLoading(false)
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
    router.push(path)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f1ea] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#10243d]/20 border-t-[#e3a56f]" />

          <p className="text-sm font-medium text-[#10243d]/70">
            Loading your AI Learning Hub...
          </p>
        </div>
      </div>
    )
  }

  if (!student) {
    return null
  }

  const firstName =
    student.firstName || "Student"

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

  <div className="flex items-center gap-3">

    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white p-1 shadow-lg">
      <Image
        src="/Logo.png"
        alt="GlobeDk Elite Academy"
        fill
        className="object-contain"
        priority
      />
    </div>

    <div>
      <p className="text-lg font-black tracking-tight text-white">
        GlobeDk AI
      </p>

      <p className="text-xs text-white/60">
        Learning Hub
      </p>
    </div>

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
  icon={GraduationCap}
  label="Dashboard"
  active
  onClick={() =>
    setMobileMenuOpen(false)
  }
/>

              <MobileNavItem
                icon={Sparkles}
                label="Exam Predictor"
                onClick={() =>
                  openFeature(
                    "/ai/exam-predictor"
                  )
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
                <LogOut className="h-5 w-5" />

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

             <div className="mb-8 flex items-center justify-between">

  <div className="flex items-center gap-3">

    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white p-1 shadow-lg">
      <Image
        src="/Logo.png"
        alt="GlobeDk Elite Academy"
        fill
        className="object-contain"
        priority
      />
    </div>

    <div>
      <p className="text-lg font-black tracking-tight text-white">
        GlobeDk AI
      </p>

      <p className="text-xs text-white/60">
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
            active
            onClick={() => {}}
          />

          <SidebarItem
            icon={Sparkles}
            label="Exam Predictor"
            onClick={() =>
              openFeature(
                "/ai/exam-predictor"
              )
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
            <LogOut className="h-5 w-5" />

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
                  Student Dashboard
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
                {firstName.charAt(0).toUpperCase()}
              </button>

            </div>

          </div>

        </header>

        {/* =======================================================
            PAGE CONTENT
        ======================================================= */}

        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

          {/* =====================================================
              WELCOME
          ===================================================== */}

          <section className="relative overflow-hidden rounded-3xl bg-[#10243d] p-6 shadow-xl sm:p-8">

            {/* Decorative shapes */}

            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#e3a56f]/15" />

            <div className="absolute -bottom-24 right-24 h-44 w-44 rounded-full bg-white/5" />

            <div className="relative">

              <div className="mb-4 flex flex-wrap items-center gap-2">

                <span className="rounded-full bg-[#e3a56f] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#10243d]">
                  {student.level}
                </span>

                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white">
                  {student.curriculum}
                </span>

              </div>

              <h1 className="max-w-3xl text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                Welcome back, {firstName}! 👋
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
                Your AI-powered study space is ready.
                Predict likely exam areas, practise with
                mock exams, identify weak topics and get
                help from your AI Tutor.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                <button
                  type="button"
                  onClick={() =>
                    openFeature(
                      "/ai/exam-predictor"
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-[#e3a56f] px-5 py-3 text-sm font-black text-[#10243d] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#edb67f]"
                >
                  <Sparkles className="h-4 w-4" />
                  Start Exam Predictor
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openFeature(
                      "/ai/mock-lab"
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  <Play className="h-4 w-4" />
                  Open Mock Lab
                </button>

              </div>

            </div>

          </section>

          {/* =====================================================
              STATS
          ===================================================== */}

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              icon={Zap}
              label="AI Credits"
              value={String(credits)}
              description={
                credits > 0
                  ? "Available to use"
                  : "Credits required"
              }
              action={
                credits === 0
                  ? "Get credits"
                  : "Manage credits"
              }
              onClick={() =>
                openFeature(
                  "/ai/credits"
                )
              }
            />

            <StatCard
              icon={Trophy}
              label="Overall Performance"
              value="--"
              description="No results yet"
              action="View progress"
              onClick={() =>
                openFeature(
                  "/ai/progress"
                )
              }
            />

            <StatCard
              icon={Target}
              label="Weak Topics"
              value="--"
              description="Build your first result"
              action="Find weak areas"
              onClick={() =>
                openFeature(
                  "/ai/revision-coach"
                )
              }
            />

            <StatCard
              icon={Clock3}
              label="Study Activity"
              value="--"
              description="No activity yet"
              action="View activity"
              onClick={() =>
                openFeature(
                  "/ai/progress"
                )
              }
            />

          </section>

          {/* =====================================================
              AI TOOLS
          ===================================================== */}

          <section className="mt-8">

            <SectionHeading
              title="Your AI Study Tools"
              description="Choose what you want to work on today."
            />

            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

              <FeatureCard
                icon={Sparkles}
                title="Exam Predictor"
                description="Analyse historical ZIMSEC patterns and identify topics and question styles that may be worth prioritising."
                button="Predict My Exam"
                badge="AI Powered"
                onClick={() =>
                  openFeature(
                    "/ai/exam-predictor"
                  )
                }
              />

              <FeatureCard
                icon={FileText}
                title="Mock Lab"
                description="Generate fresh Paper 1 and Paper 2 practice exams and test yourself under realistic exam conditions."
                button="Start a Mock"
                badge="Practice"
                onClick={() =>
                  openFeature(
                    "/ai/mock-lab"
                  )
                }
              />

              <FeatureCard
                icon={Target}
                title="Revision Coach"
                description="Discover your weaker areas and receive targeted practice and revision recommendations."
                button="Start Revision"
                badge="Personalised"
                onClick={() =>
                  openFeature(
                    "/ai/revision-coach"
                  )
                }
              />

             

            </div>

          </section>

          {/* =====================================================
              QUICK ACTIONS
          ===================================================== */}

          <section className="mt-8">

            <SectionHeading
              title="Quick Start"
              description="Jump straight into your next study activity."
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <QuickAction
                icon={Sparkles}
                title="Predict My Exam"
                description="Analyse likely topics"
                onClick={() =>
                  openFeature(
                    "/ai/exam-predictor"
                  )
                }
              />

              <QuickAction
                icon={FileText}
                title="Paper 1 Mock"
                description="Practise multiple choice"
                onClick={() =>
                  openFeature(
                    "/ai/mock-lab?paper=1"
                  )
                }
              />

              <QuickAction
                icon={BookOpen}
                title="Paper 2 Mock"
                description="Practise structured questions"
                onClick={() =>
                  openFeature(
                    "/ai/mock-lab?paper=2"
                  )
                }
              />

              

            </div>

          </section>

          {/* =====================================================
              PROGRESS + ACTIVITY
          ===================================================== */}

          <section className="mt-8 grid gap-6 xl:grid-cols-2">

            {/* Progress */}

            <div className="rounded-3xl border border-[#10243d]/10 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#b15d2b]">
                    My Progress
                  </p>

                  <h2 className="mt-1 text-xl font-black">
                    Keep building your results
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    openFeature(
                      "/ai/progress"
                    )
                  }
                  className="text-sm font-bold text-[#b15d2b] hover:underline"
                >
                  View all
                </button>

              </div>

              <div className="mt-6 rounded-2xl bg-[#f4f1ea] p-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#10243d]">
                    <GraduationCap className="h-7 w-7 text-[#e3a56f]" />
                  </div>

                  <div>

                    <p className="font-black">
                      Your performance profile
                    </p>

                    <p className="mt-1 text-sm text-[#10243d]/55">
                      Complete a mock exam to begin
                      building your performance data.
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    openFeature(
                      "/ai/mock-lab"
                    )
                  }
                  className="mt-5 flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-bold shadow-sm transition hover:shadow-md"
                >
                  <span>
                    Take your first mock exam
                  </span>

                  <ChevronRight className="h-4 w-4" />

                </button>

              </div>

            </div>

            {/* Activity */}

            <div className="rounded-3xl border border-[#10243d]/10 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#b15d2b]">
                    Recent Activity
                  </p>

                  <h2 className="mt-1 text-xl font-black">
                    Your latest learning
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    openFeature(
                      "/ai/progress"
                    )
                  }
                  className="text-sm font-bold text-[#b15d2b] hover:underline"
                >
                  View all
                </button>

              </div>

              <div className="mt-6">

                <div className="flex items-center gap-4 rounded-2xl border border-dashed border-[#10243d]/15 p-5">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e3a56f]/20">
                    <Clock3 className="h-5 w-5 text-[#b15d2b]" />
                  </div>

                  <div>

                    <p className="font-bold">
                      No recent activity
                    </p>

                    <p className="mt-1 text-sm text-[#10243d]/50">
                      Your predictions, mocks and AI
                      Tutor sessions will appear here.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* =====================================================
              CREDIT NOTICE
          ===================================================== */}

          <section className="mt-8">

            <div
              className={
                credits > 0
                  ? "rounded-2xl border border-[#10243d]/10 bg-white p-5 shadow-sm"
                  : "rounded-2xl border border-[#b15d2b]/30 bg-[#e3a56f]/10 p-5 shadow-sm"
              }
            >

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e3a56f]/25">
                    <Zap className="h-5 w-5 text-[#b15d2b]" />
                  </div>

                  <div>

                    <p className="font-black">
                      {credits > 0
                        ? `${credits} AI credit${credits === 1 ? "" : "s"} available`
                        : "You need AI credits to use AI features"}
                    </p>

                    <p className="mt-1 max-w-2xl text-sm text-[#10243d]/55">
                      {credits > 0
                        ? "Credits are only used when you perform an AI-powered operation. Opening your dashboard is free."
                        : "Purchase AI credits before starting predictions, mock exams, AI marking or AI Tutor sessions."}
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
                  {credits > 0
                    ? "Manage Credits"
                    : "Get AI Credits"}

                  <ArrowRight className="h-4 w-4" />

                </button>

              </div>

            </div>

          </section>

          {/* =====================================================
              DISCLAIMER
          ===================================================== */}

          <section className="mt-8 pb-6">

            <div className="rounded-2xl border border-[#10243d]/10 bg-[#10243d]/[0.035] px-5 py-4">

              <div className="flex items-start gap-3">

                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#b15d2b]" />

                <div>

                  <p className="text-sm font-bold">
                    Important
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#10243d]/55 sm:text-sm">
                    AI predictions are based on historical
                    examination patterns, available
                    examination materials and statistical
                    analysis. A prediction is not a
                    guaranteed examination question.
                  </p>

                </div>

              </div>

            </div>

            <p className="mt-6 text-center text-xs text-[#10243d]/40">
              GlobeDk AI Learning Hub
              {" • "}
              GlobeDk Elite | Excellence in Education.
              Success for Life.
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
   STAT CARD
============================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  action,
  onClick,
}: {
  icon: React.ElementType
  label: string
  value: string
  description: string
  action: string
  onClick: () => void
}) {
  return (
    <div className="rounded-2xl border border-[#10243d]/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e3a56f]/20">
          <Icon className="h-5 w-5 text-[#b15d2b]" />
        </div>

        <span className="text-2xl font-black">
          {value}
        </span>

      </div>

      <p className="mt-4 text-sm font-black">
        {label}
      </p>

      <p className="mt-1 text-xs text-[#10243d]/50">
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-4 inline-flex items-center gap-1 text-xs font-black text-[#b15d2b] hover:underline"
      >
        {action}

        <ArrowRight className="h-3.5 w-3.5" />
      </button>

    </div>
  )
}

/* =============================================================
   SECTION HEADING
============================================================= */

function SectionHeading({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div>

      <h2 className="text-xl font-black tracking-tight sm:text-2xl">
        {title}
      </h2>

      <p className="mt-1 text-sm text-[#10243d]/55">
        {description}
      </p>

    </div>
  )
}

/* =============================================================
   FEATURE CARD
============================================================= */

function FeatureCard({
  icon: Icon,
  title,
  description,
  button,
  badge,
  onClick,
}: {
  icon: React.ElementType
  title: string
  description: string
  button: string
  badge: string
  onClick: () => void
}) {
  return (
    <div className="group flex h-full flex-col rounded-3xl border border-[#10243d]/10 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-start justify-between">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10243d] transition group-hover:bg-[#e3a56f]">
          <Icon className="h-6 w-6 text-[#e3a56f] transition group-hover:text-[#10243d]" />
        </div>

        <span className="rounded-full bg-[#f4f1ea] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#10243d]/55">
          {badge}
        </span>

      </div>

      <h3 className="mt-5 text-lg font-black">
        {title}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-6 text-[#10243d]/55">
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-5 flex w-full items-center justify-between rounded-xl bg-[#10243d] px-4 py-3 text-sm font-black text-white transition hover:bg-[#183452]"
      >
        {button}

        <ArrowRight className="h-4 w-4" />
      </button>

    </div>
  )
}

/* =============================================================
   QUICK ACTION
============================================================= */

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: React.ElementType
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-4 rounded-2xl border border-[#10243d]/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#e3a56f] hover:shadow-md"
    >

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f4f1ea] transition group-hover:bg-[#e3a56f]/25">
        <Icon className="h-5 w-5 text-[#10243d]" />
      </div>

      <div className="min-w-0 flex-1">

        <p className="truncate text-sm font-black">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-[#10243d]/50">
          {description}
        </p>

      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-[#10243d]/30 transition group-hover:translate-x-0.5 group-hover:text-[#b15d2b]" />

    </button>
  )
}

