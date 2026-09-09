"use client"

import Link from "next/link"

import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Database,
  FileText,
  GraduationCap,
  LogOut,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Upload,
  UserCog,
  Users,
} from "lucide-react"

import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import { AdminSidebar } from "@/components/admin/admin-sidebar"

type AdminDashboardClientProps = {
  adminName: string
}

type DashboardData = {
  students: number
  activeStudents: number
  tutors: number
  activeTutors: number
  examPapers: number
  questionsAnalysed: number
}

type ApiResponse = {
  students?: unknown[]
  tutors?: unknown[]
  datasets?: unknown[]
  papers?: unknown[]
  questions?: unknown[]
  analyses?: unknown[]
  total?: number
  count?: number
  totalStudents?: number
  totalTutors?: number
  examPapers?: number
  questionsAnalysed?: number
  activeStudents?: number
  activeTutors?: number
}

const emptyDashboardData: DashboardData = {
  students: 0,
  activeStudents: 0,
  tutors: 0,
  activeTutors: 0,
  examPapers: 0,
  questionsAnalysed: 0,
}

function getArrayCount(
  data: ApiResponse | null | undefined,
  keys: string[]
): number {
  if (!data) {
    return 0
  }

  for (const key of keys) {
    const value = data[key as keyof ApiResponse]

    if (Array.isArray(value)) {
      return value.length
    }

    if (
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      return value
    }
  }

  return 0
}

function getNumber(
  data: ApiResponse | null | undefined,
  keys: string[]
): number {
  if (!data) {
    return 0
  }

  for (const key of keys) {
    const value = data[key as keyof ApiResponse]

    if (
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      return value
    }
  }

  return 0
}

function countActiveRecords(
  records: unknown[] | undefined
): number {
  if (!Array.isArray(records)) {
    return 0
  }

  return records.filter((record) => {
    if (!record || typeof record !== "object") {
      return false
    }

    const item = record as {
      account_status?: string
      status?: string
    }

    return (
      item.account_status === "active" ||
      item.status === "Active" ||
      item.status === "active"
    )
  }).length
}

async function fetchAdminApi(
  url: string
): Promise<ApiResponse> {
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  })

  let data: ApiResponse = {}

  try {
    data = (await response.json()) as ApiResponse
  } catch {
    data = {}
  }

  if (!response.ok) {
    throw new Error(
      typeof data === "object" && data
        ? "Unable to retrieve dashboard data."
        : "Unable to retrieve dashboard data."
    )
  }

  return data
}

export default function AdminDashboardClient({
  adminName,
}: AdminDashboardClientProps) {
  const [dashboard, setDashboard] =
    useState<DashboardData>(
      emptyDashboardData
    )

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  /*
   * Retrieve live dashboard information
   * through the protected admin APIs.
   */
  async function loadDashboard() {
    try {
      setLoading(true)
      setError("")

      /*
       * Students and tutors are already part
       * of the admin API structure used
       * throughout the application.
       *
       * Dataset and AI endpoints are treated
       * independently so one unavailable
       * service does not break the entire
       * dashboard.
       */
      const results =
        await Promise.allSettled([
          fetchAdminApi(
            "/api/admin/students"
          ),
          fetchAdminApi(
            "/api/admin/tutors"
          ),
          fetchAdminApi(
            "/api/admin/datasets"
          ),
          fetchAdminApi(
            "/api/admin/ai-analysis"
          ),
        ])

      const studentsResult =
        results[0]

      const tutorsResult =
        results[1]

      const datasetsResult =
        results[2]

      const aiResult =
        results[3]

      /*
       * Students
       */
      let studentsData:
        | ApiResponse
        | null = null

      if (
        studentsResult.status ===
        "fulfilled"
      ) {
        studentsData =
          studentsResult.value
      }

      /*
       * Tutors
       */
      let tutorsData:
        | ApiResponse
        | null = null

      if (
        tutorsResult.status ===
        "fulfilled"
      ) {
        tutorsData =
          tutorsResult.value
      }

      /*
       * Datasets
       */
      let datasetsData:
        | ApiResponse
        | null = null

      if (
        datasetsResult.status ===
        "fulfilled"
      ) {
        datasetsData =
          datasetsResult.value
      }

      /*
       * AI analysis
       */
      let aiData:
        | ApiResponse
        | null = null

      if (
        aiResult.status ===
        "fulfilled"
      ) {
        aiData =
          aiResult.value
      }

      /*
       * Student count.
       *
       * Supports APIs returning:
       *
       * {
       *   students: [...]
       * }
       *
       * or:
       *
       * {
       *   totalStudents: 10
       * }
       */
      const students =
        getNumber(
          studentsData,
          [
            "totalStudents",
          ]
        ) ||
        getArrayCount(
          studentsData,
          [
            "students",
            "data",
          ]
        )

      /*
       * Active students.
       */
      const activeStudents =
        getNumber(
          studentsData,
          [
            "activeStudents",
          ]
        ) ||
        countActiveRecords(
          Array.isArray(
            studentsData?.students
          )
            ? studentsData.students
            : undefined
        )

      /*
       * Tutor count.
       */
      const tutors =
        getNumber(
          tutorsData,
          [
            "totalTutors",
          ]
        ) ||
        getArrayCount(
          tutorsData,
          [
            "tutors",
            "data",
          ]
        )

      /*
       * Active tutors.
       */
      const activeTutors =
        getNumber(
          tutorsData,
          [
            "activeTutors",
          ]
        ) ||
        countActiveRecords(
          Array.isArray(
            tutorsData?.tutors
          )
            ? tutorsData.tutors
            : undefined
        )

      /*
       * Historical examination papers.
       */
      const examPapers =
        getNumber(
          datasetsData,
          [
            "examPapers",
          ]
        ) ||
        getNumber(
          datasetsData,
          [
            "total",
            "count",
          ]
        ) ||
        getArrayCount(
          datasetsData,
          [
            "datasets",
            "papers",
            "data",
          ]
        )

      /*
       * AI processed questions.
       */
      const questionsAnalysed =
        getNumber(
          aiData,
          [
            "questionsAnalysed",
          ]
        ) ||
        getNumber(
          aiData,
          [
            "total",
            "count",
          ]
        ) ||
        getArrayCount(
          aiData,
          [
            "questions",
            "analyses",
            "data",
          ]
        )

      setDashboard({
        students,
        activeStudents,
        tutors,
        activeTutors,
        examPapers,
        questionsAnalysed,
      })

      /*
       * Only report a dashboard error when
       * the core student/tutor APIs fail.
       */
      if (
        studentsResult.status ===
          "rejected" &&
        tutorsResult.status ===
          "rejected"
      ) {
        setError(
          "Unable to retrieve administrator data. Please try again."
        )
      }
    } catch (err) {
      console.error(
        "Admin dashboard error:",
        err
      )

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const adminDisplayName =
    adminName || "Administrator"

  const stats = useMemo(
    () => [
      {
        title: "Total Students",
        value: dashboard.students,
        description:
          dashboard.activeStudents > 0
            ? `${dashboard.activeStudents} active students`
            : "Registered students",
        icon: Users,
        href: "/admin/students",
      },
      {
        title: "Total Tutors",
        value: dashboard.tutors,
        description:
          dashboard.activeTutors > 0
            ? `${dashboard.activeTutors} active tutors`
            : "Registered tutors",
        icon: UserCog,
        href: "/admin/tutors",
      },
      {
        title: "Exam Papers",
        value: dashboard.examPapers,
        description:
          "Historical papers",
        icon: FileText,
        href: "/admin/datasets",
      },
      {
        title: "Questions Analysed",
        value:
          dashboard.questionsAnalysed,
        description:
          "AI processed questions",
        icon: Brain,
        href: "/admin/ai-analysis",
      },
    ],
    [dashboard]
  )

  const quickActions = [
    {
      title: "Upload Exam Paper",
      description:
        "Add a new ZIMSEC examination paper in PDF or image format.",
      href: "/admin/datasets",
      icon: Upload,
    },
    {
      title: "Manage Dataset",
      description:
        "View, organise and manage historical examination sessions.",
      href: "/admin/datasets",
      icon: Database,
    },
    {
      title: "AI Analysis",
      description:
        "Review question extraction, classification and historical patterns.",
      href: "/admin/ai-analysis",
      icon: Brain,
    },
    {
      title: "Manage Students",
      description:
        "View student accounts, enrollments and academic information.",
      href: "/admin/students",
      icon: Users,
    },
    {
      title: "Manage Tutors",
      description:
        "Manage tutor accounts, assignments and teaching access.",
      href: "/admin/tutors",
      icon: UserCog,
    },
    {
      title: "Manage Subjects",
      description:
        "Configure subjects, levels and examination categories.",
      href: "/admin/subjects",
      icon: BookOpen,
    },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Application */}
      <div className="pl-[72px] lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur">
          <div className="flex h-full items-center justify-between px-4 lg:px-8">
            <div>
              <p className="text-sm font-medium">
                Administration
              </p>

              <p className="text-xs text-muted-foreground">
                GlobeDK Elite Academy
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="hidden gap-1 sm:flex"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Administrator
              </Badge>

              <Button
                variant="ghost"
                size="icon"
                asChild
              >
                <Link href="/admin/settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link href="/logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">
                    Logout
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="container mx-auto px-4 py-8 lg:px-8">
          {/* Welcome */}
          <section className="mb-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Badge>
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    Admin Portal
                  </Badge>
                </div>

                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Welcome
                  {adminDisplayName
                    ? `, ${adminDisplayName}`
                    : ""}
                </h1>

                <p className="mt-2 max-w-3xl text-muted-foreground">
                  Manage GlobeDK Elite Academy,
                  examination datasets, students,
                  tutors and the AI examination
                  intelligence platform from one place.
                </p>
              </div>

              <Button asChild>
                <Link href="/admin/datasets">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Exam Paper
                </Link>
              </Button>
            </div>
          </section>

          {/* Error */}
          {error && (
            <Card className="mb-6 border-destructive/50">
              <CardContent className="flex items-center gap-3 p-4">
                <AlertCircle className="h-5 w-5 text-destructive" />

                <div>
                  <p className="font-medium">
                    Dashboard data could not be loaded
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {error}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  onClick={loadDashboard}
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Statistics */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon

              return (
                <Link
                  key={stat.title}
                  href={stat.href}
                  className="group"
                >
                  <Card className="transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {stat.title}
                          </p>

                          <p className="mt-2 text-3xl font-bold">
                            {loading ? "—" : stat.value}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {stat.description}
                          </p>
                        </div>

                        <div className="rounded-lg bg-primary/10 p-3">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </section>

          {/* Main Dashboard */}
          <div className="grid gap-6 xl:grid-cols-3">
            {/* Management Centre */}
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>
                  Management Centre
                </CardTitle>

                <CardDescription>
                  Manage the core components of the GlobeDK
                  Elite Academy platform.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {quickActions.map(
                    (action) => {
                      const Icon = action.icon

                      return (
                        <Link
                          key={action.title}
                          href={action.href}
                          className="group rounded-xl border p-5 transition-all hover:border-primary/50 hover:bg-muted/50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="rounded-lg bg-primary/10 p-3">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>

                            <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                          </div>

                          <h3 className="mt-4 font-semibold">
                            {action.title}
                          </h3>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </Link>
                      )
                    }
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>
                  System Status
                </CardTitle>

                <CardDescription>
                  Current platform health
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Database */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />

                    <span className="text-sm">
                      Database
                    </span>
                  </div>

                  <Badge variant="secondary">
                    Ready
                  </Badge>
                </div>

                {/* Authentication */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />

                    <span className="text-sm">
                      Authentication
                    </span>
                  </div>

                  <Badge variant="secondary">
                    Ready
                  </Badge>
                </div>

                {/* AI */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock3 className="h-5 w-5 text-muted-foreground" />

                    <span className="text-sm">
                      AI Analysis
                    </span>
                  </div>

                  <Badge variant="outline">
                    {dashboard.questionsAnalysed >
                    0
                      ? "Active"
                      : "Waiting"}
                  </Badge>
                </div>

                {/* Dataset */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-muted-foreground" />

                    <span className="text-sm">
                      Dataset
                    </span>
                  </div>

                  <Badge variant="outline">
                    {dashboard.examPapers >
                    0
                      ? "Configured"
                      : "Not configured"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Intelligence */}
          <section className="mt-6">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  {/* Left */}
                  <div className="p-6 md:p-8">
                    <Badge className="mb-4">
                      <Sparkles className="mr-1 h-3 w-3" />
                      AI Examination Intelligence
                    </Badge>

                    <h2 className="text-2xl font-bold">
                      Build the examination intelligence
                      dataset
                    </h2>

                    <p className="mt-3 text-muted-foreground">
                      Upload historical examination papers
                      and allow the system to extract
                      questions, identify topics, analyse
                      repetition patterns and prepare the
                      data required for future predictions.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button asChild>
                        <Link href="/admin/datasets">
                          Manage Examination Dataset
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        asChild
                      >
                        <Link href="/admin/ai-analysis">
                          View AI Analysis
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center justify-center bg-primary/5 p-8">
                    <div className="grid w-full max-w-sm grid-cols-2 gap-4">
                      <div className="rounded-xl border bg-background p-5 text-center">
                        <Database className="mx-auto h-7 w-7 text-primary" />

                        <p className="mt-2 text-sm font-medium">
                          Historical Papers
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                          {loading
                            ? "—"
                            : dashboard.examPapers}
                        </p>
                      </div>

                      <div className="rounded-xl border bg-background p-5 text-center">
                        <Brain className="mx-auto h-7 w-7 text-primary" />

                        <p className="mt-2 text-sm font-medium">
                          AI Analysis
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                          {loading
                            ? "—"
                            : dashboard.questionsAnalysed}
                        </p>
                      </div>

                      <div className="rounded-xl border bg-background p-5 text-center">
                        <BarChart3 className="mx-auto h-7 w-7 text-primary" />

                        <p className="mt-2 text-sm font-medium">
                          Patterns
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Analysis
                        </p>
                      </div>

                      <div className="rounded-xl border bg-background p-5 text-center">
                        <TrendingUp className="mx-auto h-7 w-7 text-primary" />

                        <p className="mt-2 text-sm font-medium">
                          Predictions
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Coming soon
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Bottom information */}
          <section className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Academy */}
            <Card>
              <CardHeader>
                <CardTitle>
                  GlobeDK Elite Academy
                </CardTitle>

                <CardDescription>
                  Platform overview
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <GraduationCap className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Education Management Platform
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Manage students, tutors, subjects,
                      examination datasets and AI-powered
                      examination intelligence.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Quick Links
                </CardTitle>

                <CardDescription>
                  Frequently used administration areas
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid gap-2">
                  <Link
                    href="/admin/students"
                    className="flex items-center justify-between rounded-lg border p-3 text-sm transition-colors hover:bg-muted"
                  >
                    <span>
                      Student Management
                    </span>

                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>

                  <Link
                    href="/admin/tutors"
                    className="flex items-center justify-between rounded-lg border p-3 text-sm transition-colors hover:bg-muted"
                  >
                    <span>
                      Tutor Management
                    </span>

                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>

                  <Link
                    href="/admin/datasets"
                    className="flex items-center justify-between rounded-lg border p-3 text-sm transition-colors hover:bg-muted"
                  >
                    <span>
                      Examination Dataset
                    </span>

                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>

                  <Link
                    href="/admin/analytics"
                    className="flex items-center justify-between rounded-lg border p-3 text-sm transition-colors hover:bg-muted"
                  >
                    <span>
                      Reports & Analytics
                    </span>

                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}