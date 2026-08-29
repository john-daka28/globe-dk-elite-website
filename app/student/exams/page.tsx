
"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Target,
  TrendingUp,
  User,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function StudentExamsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { title: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { title: "My Subjects", href: "/student/subjects", icon: BookOpen },
    { title: "Timetable", href: "/student/timetable", icon: CalendarDays },
    { title: "Attendance", href: "/student/attendance", icon: ClipboardCheck },
    { title: "Performance", href: "/student/performance", icon: TrendingUp },
    { title: "Assignments", href: "/student/assignments", icon: ClipboardCheck },
    {
      title: "Tests & Exams",
      href: "/student/exams",
      icon: Target,
      active: true,
    },
    { title: "Messages", href: "/student/messages", icon: MessageSquare },
    { title: "Announcements", href: "/student/announcements", icon: Bell },
    { title: "Resources", href: "/student/resources", icon: BookOpen },
  ]

  const upcomingExams = [
    {
      title: "Mathematics Mid-Term Test",
      subject: "Mathematics",
      date: "03 Sep 2026",
      time: "09:00 - 11:00",
      venue: "Academy Classroom 1",
      topics: "Algebra, Factorisation & Functions",
    },
    {
      title: "English Language Assessment",
      subject: "English Language",
      date: "05 Sep 2026",
      time: "09:00 - 11:30",
      venue: "Academy Classroom 2",
      topics: "Composition, Comprehension & Grammar",
    },
    {
      title: "Geography Test",
      subject: "Geography",
      date: "08 Sep 2026",
      time: "10:00 - 11:30",
      venue: "Academy Classroom 1",
      topics: "Mapwork & Physical Geography",
    },
  ]

  const results = [
    {
      title: "Algebra & Factorisation Test",
      subject: "Mathematics",
      date: "28 Aug 2026",
      score: 78,
      grade: "B",
    },
    {
      title: "Composition Assessment",
      subject: "English Language",
      date: "27 Aug 2026",
      score: 84,
      grade: "A",
    },
    {
      title: "Programming Fundamentals",
      subject: "Computer Science",
      date: "26 Aug 2026",
      score: 91,
      grade: "A",
    },
    {
      title: "Mapwork Test",
      subject: "Geography",
      date: "25 Aug 2026",
      score: 67,
      grade: "C",
    },
  ]

  return (
    <div className="min-h-screen bg-muted/30">

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-none">
                GlobeDK Elite
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Academy
              </p>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="border-b p-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Student Name</p>
              <p className="text-xs text-muted-foreground">
                Form 4 · O-Level
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            My Academy
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                    item.active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="border-t p-3">
          <Link
            href="/student/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"
          >
            <User className="h-4 w-4" />
            My Profile
          </Link>

          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div>
              <p className="text-sm font-medium">
                Tests & Examinations
              </p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Prepare, complete and review your assessments
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/student/announcements">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/student/messages">
                <MessageSquare className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/student/profile">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">

          <section className="mb-8">
            <Badge className="mb-3">Assessment Centre</Badge>

            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Tests & Examinations
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
              Keep track of upcoming assessments, examination dates and
              your previous results.
            </p>
          </section>

          {/* Stats */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Upcoming
                </p>
                <p className="mt-2 text-3xl font-bold">3</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Scheduled assessments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Completed
                </p>
                <p className="mt-2 text-3xl font-bold">12</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  This term
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Average Score
                </p>
                <p className="mt-2 text-3xl font-bold">80%</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +5% this term
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Next Assessment
                </p>
                <p className="mt-2 text-lg font-bold">
                  03 Sep
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Mathematics
                </p>
              </CardContent>
            </Card>

          </section>

          {/* Upcoming */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Upcoming Assessments</CardTitle>
              <CardDescription>
                Plan your revision before each assessment.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">

              {upcomingExams.map((exam) => (
                <div
                  key={exam.title}
                  className="rounded-xl border p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>

                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">
                          {exam.title}
                        </h3>
                        <Badge>{exam.subject}</Badge>
                      </div>

                      <p className="mt-2 text-sm text-muted-foreground">
                        Revision topics: {exam.topics}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">

                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {exam.date}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5" />
                          {exam.time}
                        </span>

                        <span>
                          {exam.venue}
                        </span>

                      </div>

                    </div>

                    <Button variant="outline" asChild>
                      <Link href="/exam-predictor">
                        Prepare
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>

                  </div>
                </div>
              ))}

            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Results</CardTitle>
              <CardDescription>
                Your latest assessment results.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">

              {results.map((result) => (
                <div
                  key={result.title}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Award className="h-5 w-5 text-primary" />
                  </div>

                  <div className="flex-1">

                    <p className="font-medium">
                      {result.title}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {result.subject} · {result.date}
                    </p>

                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold">
                      {result.score}%
                    </span>

                    <Badge>
                      {result.grade}
                    </Badge>

                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                </div>
              ))}

            </CardContent>
          </Card>

        </main>
      </div>
    </div>
  )
}

