
"use client"

import Link from "next/link"
import { useState } from "react"
import {
  AlertCircle,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Target,
  TrendingDown,
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

export default function StudentPerformancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { title: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { title: "My Subjects", href: "/student/subjects", icon: BookOpen },
    { title: "Timetable", href: "/student/timetable", icon: CalendarDays },
    { title: "Attendance", href: "/student/attendance", icon: ClipboardCheck },
    {
      title: "Performance",
      href: "/student/performance",
      icon: TrendingUp,
      active: true,
    },
    { title: "Assignments", href: "/student/assignments", icon: BookOpen },
    { title: "Tests & Exams", href: "/student/exams", icon: ClipboardCheck },
    { title: "Messages", href: "/student/messages", icon: MessageSquare },
    { title: "Announcements", href: "/student/announcements", icon: Bell },
    { title: "Resources", href: "/student/resources", icon: BookOpen },
  ]

  const subjects = [
    {
      subject: "Mathematics",
      teacher: "Mr Daka",
      score: 78,
      grade: "B",
      change: "+6%",
      trend: "up",
      target: 80,
    },
    {
      subject: "English Language",
      teacher: "Mrs Moyo",
      score: 84,
      grade: "A",
      change: "+8%",
      trend: "up",
      target: 85,
    },
    {
      subject: "Computer Science",
      teacher: "Mr Daka",
      score: 91,
      grade: "A",
      change: "+3%",
      trend: "up",
      target: 90,
    },
    {
      subject: "Geography",
      teacher: "Mr Chirwa",
      score: 67,
      grade: "C",
      change: "-4%",
      trend: "down",
      target: 75,
    },
  ]

  const assessments = [
    {
      title: "Algebra & Factorisation Test",
      subject: "Mathematics",
      date: "28 Aug 2026",
      score: 78,
      total: 100,
      grade: "B",
    },
    {
      title: "Composition Assessment",
      subject: "English Language",
      date: "27 Aug 2026",
      score: 84,
      total: 100,
      grade: "A",
    },
    {
      title: "Programming Fundamentals",
      subject: "Computer Science",
      date: "26 Aug 2026",
      score: 91,
      total: 100,
      grade: "A",
    },
    {
      title: "Mapwork Test",
      subject: "Geography",
      date: "25 Aug 2026",
      score: 67,
      total: 100,
      grade: "C",
    },
  ]

  return (
    <div className="min-h-screen bg-muted/30">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
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

        {/* Student Profile */}
        <div className="border-b p-4">

          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>

            <div>

              <p className="text-sm font-semibold">
                Student Name
              </p>

              <p className="text-xs text-muted-foreground">
                Form 4 · O-Level
              </p>

            </div>

          </div>

        </div>

        {/* Navigation */}
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
                  <span>{item.title}</span>
                </Link>
              )
            })}

          </div>

        </nav>

        {/* Bottom */}
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

      {/* Main */}
      <div className="lg:pl-64">

        {/* Header */}
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
                Academic Performance
              </p>

              <p className="hidden text-xs text-muted-foreground sm:block">
                Track your progress and academic growth
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

          {/* Heading */}
          <section className="mb-8">

            <Badge className="mb-3">
              Academic Progress
            </Badge>

            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              My Performance
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
              Understand your academic progress, identify areas for
              improvement and work towards your targets.
            </p>

          </section>

          {/* Main Stats */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Card>
              <CardContent className="p-5">

                <div className="flex justify-between">

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Overall Average
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      80%
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="h-3.5 w-3.5" />
                      +5% this term
                    </p>

                  </div>

                  <BarChart3 className="h-6 w-6 text-primary" />

                </div>

              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">

                <div className="flex justify-between">

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Current Grade
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      B
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Strong performance
                    </p>

                  </div>

                  <Award className="h-6 w-6 text-primary" />

                </div>

              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">

                <div className="flex justify-between">

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Assessments
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      12
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Completed this term
                    </p>

                  </div>

                  <ClipboardCheck className="h-6 w-6 text-primary" />

                </div>

              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">

                <div className="flex justify-between">

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Target
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      85%
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      5% to go
                    </p>

                  </div>

                  <Target className="h-6 w-6 text-primary" />

                </div>

              </CardContent>
            </Card>

          </section>

          <div className="grid gap-6 lg:grid-cols-3">

            {/* Subject Performance */}
            <Card className="lg:col-span-2">

              <CardHeader>

                <CardTitle>
                  Performance by Subject
                </CardTitle>

                <CardDescription>
                  Your latest subject averages and progress
                </CardDescription>

              </CardHeader>

              <CardContent>

                <div className="space-y-6">

                  {subjects.map((subject) => (

                    <div key={subject.subject}>

                      <div className="flex items-center justify-between gap-4">

                        <div className="min-w-0">

                          <p className="font-medium">
                            {subject.subject}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {subject.teacher}
                          </p>

                        </div>

                        <div className="flex items-center gap-3">

                          <div className="hidden items-center gap-1 text-xs sm:flex">

                            {subject.trend === "up" ? (
                              <TrendingUp className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />
                            )}

                            <span>
                              {subject.change}
                            </span>

                          </div>

                          <Badge>
                            {subject.grade}
                          </Badge>

                          <span className="w-12 text-right text-sm font-semibold">
                            {subject.score}%
                          </span>

                        </div>

                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">

                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${subject.score}%`,
                          }}
                        />

                      </div>

                      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">

                        <span>
                          Current: {subject.score}%
                        </span>

                        <span>
                          Target: {subject.target}%
                        </span>

                      </div>

                    </div>

                  ))}

                </div>

              </CardContent>

            </Card>

            {/* Academic Summary */}
            <Card>

              <CardHeader>

                <CardTitle>
                  Academic Summary
                </CardTitle>

                <CardDescription>
                  Your current learning profile
                </CardDescription>

              </CardHeader>

              <CardContent className="space-y-4">

                <div className="rounded-lg border p-4">

                  <div className="flex items-center gap-2">

                    <CheckCircle2 className="h-4 w-4 text-primary" />

                    <p className="text-sm font-medium">
                      Strengths
                    </p>

                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Computer Science and English Language are currently
                    your strongest subjects.
                  </p>

                </div>

                <div className="rounded-lg border p-4">

                  <div className="flex items-center gap-2">

                    <AlertCircle className="h-4 w-4 text-muted-foreground" />

                    <p className="text-sm font-medium">
                      Focus Area
                    </p>

                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Geography needs additional revision and consistent
                    practice.
                  </p>

                </div>

                <div className="rounded-lg border p-4">

                  <div className="flex items-center gap-2">

                    <Target className="h-4 w-4 text-primary" />

                    <p className="text-sm font-medium">
                      Next Target
                    </p>

                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Reach an overall average of 85% before the next
                    assessment cycle.
                  </p>

                </div>

              </CardContent>

            </Card>

          </div>

          {/* Recent Assessments */}
          <section className="mt-6">

            <Card>

              <CardHeader>

                <CardTitle>
                  Recent Assessments
                </CardTitle>

                <CardDescription>
                  Your latest tests, assignments and examinations
                </CardDescription>

              </CardHeader>

              <CardContent>

                <div className="space-y-3">

                  {assessments.map((assessment, index) => (

                    <div
                      key={index}
                      className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center"
                    >

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">

                        <ClipboardCheck className="h-5 w-5 text-primary" />

                      </div>

                      <div className="flex-1">

                        <p className="font-medium">
                          {assessment.title}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">

                          <span>
                            {assessment.subject}
                          </span>

                          <span>
                            {assessment.date}
                          </span>

                        </div>

                      </div>

                      <div className="flex items-center gap-3">

                        <div className="text-right">

                          <p className="font-semibold">
                            {assessment.score}%
                          </p>

                          <p className="text-xs text-muted-foreground">
                            out of {assessment.total}
                          </p>

                        </div>

                        <Badge>
                          {assessment.grade}
                        </Badge>

                      </div>

                    </div>

                  ))}

                </div>

              </CardContent>

            </Card>

          </section>

          {/* Progress & Tutor Feedback */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <Card>

              <CardHeader>

                <CardTitle>
                  Your Progress
                </CardTitle>

                <CardDescription>
                  Overall academic development
                </CardDescription>

              </CardHeader>

              <CardContent>

                <div className="flex items-center gap-5">

                  <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-8 border-primary/20">

                    <div className="absolute inset-0 rounded-full border-8 border-transparent border-l-primary border-t-primary" />

                    <div className="text-center">

                      <p className="text-2xl font-bold">
                        80%
                      </p>

                      <p className="text-[10px] text-muted-foreground">
                        Average
                      </p>

                    </div>

                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <TrendingUp className="h-4 w-4 text-primary" />

                      <p className="font-semibold">
                        Positive progress
                      </p>

                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Your overall average has improved by 5% this term.
                      Keep maintaining consistent practice.
                    </p>

                  </div>

                </div>

              </CardContent>

            </Card>

            <Card>

              <CardHeader>

                <CardTitle>
                  Tutor Feedback
                </CardTitle>

                <CardDescription>
                  Latest academic guidance
                </CardDescription>

              </CardHeader>

              <CardContent>

                <div className="rounded-lg bg-muted/40 p-4">

                  <MessageSquare className="h-5 w-5 text-primary" />

                  <p className="mt-3 text-sm leading-6">
                    "Good improvement this term. Your Mathematics
                    performance is moving in the right direction.
                    Continue practising algebra and spend more time
                    reviewing Geography concepts."
                  </p>

                  <div className="mt-4">

                    <p className="text-sm font-semibold">
                      Mr Daka
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Academic Tutor
                    </p>

                  </div>

                </div>

              </CardContent>

            </Card>

          </div>

          {/* Action */}
          <section className="mt-6">

            <Card className="border-primary/20 bg-primary/5">

              <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">

                <div>

                  <p className="font-semibold">
                    Ready to improve your performance?
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Use practice questions and AI-powered study tools
                    to work on your weaker areas.
                  </p>

                </div>

                <div className="flex flex-col gap-2 sm:flex-row">

                  <Button asChild>
                    <Link href="/practice">
                      Practice Questions
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    asChild
                  >
                    <Link href="/exam-predictor">
                      AI Exam Predictor
                    </Link>
                  </Button>

                </div>

              </CardContent>

            </Card>

          </section>

        </main>

      </div>

    </div>
  )
}
