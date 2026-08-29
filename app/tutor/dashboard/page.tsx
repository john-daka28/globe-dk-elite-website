
"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Plus,
  Settings,
  TrendingUp,
  User,
  Users,
  X,
  Clock3,
  AlertCircle,
  Award,
  BarChart3,
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

export default function TutorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  /*
   * These are currently demonstration values.
   * They should later be replaced with data loaded from Supabase
   * using the authenticated tutor's session/user ID.
   */

  const tutor = {
    name: "Mr Daka",
    role: "Mathematics Tutor",
    subjects: ["Mathematics"],
  }

  const navigation = [
    {
      title: "Dashboard",
      href: "/tutor/dashboard",
      icon: LayoutDashboard,
      active: true,
    },
    {
      title: "My Students",
      href: "/tutor/students",
      icon: Users,
    },
    {
      title: "My Subjects",
      href: "/tutor/subjects",
      icon: BookOpen,
    },
    {
      title: "Timetable",
      href: "/tutor/timetable",
      icon: CalendarDays,
    },
    {
      title: "Attendance",
      href: "/tutor/attendance",
      icon: ClipboardCheck,
    },
    {
      title: "Assignments",
      href: "/tutor/assignments",
      icon: FileText,
    },
    {
      title: "Tests & Exams",
      href: "/tutor/exams",
      icon: Award,
    },
    {
      title: "Performance",
      href: "/tutor/performance",
      icon: BarChart3,
    },
    {
      title: "Messages",
      href: "/tutor/messages",
      icon: MessageSquare,
    },
    {
      title: "Announcements",
      href: "/tutor/announcements",
      icon: Bell,
    },
    {
      title: "Resources",
      href: "/tutor/resources",
      icon: BookOpen,
    },
  ]

  const todayClasses = [
    {
      subject: "Mathematics",
      className: "Form 4 · O-Level",
      time: "14:30 – 15:30",
      room: "Classroom / Online",
      status: "Next",
    },
    {
      subject: "Mathematics",
      className: "Form 3 · O-Level",
      time: "16:00 – 17:00",
      room: "Classroom / Online",
      status: "Upcoming",
    },
  ]

  const studentsNeedingAttention = [
    {
      name: "Student One",
      detail: "Mathematics average: 48%",
      reason: "Needs academic support",
    },
    {
      name: "Student Two",
      detail: "Missed 2 recent lessons",
      reason: "Attendance concern",
    },
    {
      name: "Student Three",
      detail: "Assignment overdue",
      reason: "Pending submission",
    },
  ]

  return (
    <div className="min-h-screen bg-muted/30">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =========================================================
          SIDEBAR
      ========================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-200 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >

        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-5">

          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
           <image>
            <img src="/logo.png" alt="GlobeDK Elite Logo" 
             className="h-15 w-15" />
           </image>

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

        {/* Tutor profile */}
        <div className="border-b p-4">

          <div className="rounded-lg bg-muted/50 p-3">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {tutor.name}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {tutor.role}
                </p>
              </div>

            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {tutor.subjects.map((subject) => (
                <Badge
                  key={subject}
                  variant="secondary"
                  className="text-[10px]"
                >
                  {subject}
                </Badge>
              ))}
            </div>

          </div>

        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">

          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Teaching Centre
          </p>

          <div className="space-y-1">

            {navigation.map((item) => {
              const Icon = item.icon

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    item.active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              )
            })}

          </div>

        </nav>

        {/* Bottom navigation */}
        <div className="border-t p-3">

          <Link
            href="/tutor/profile"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <User className="h-4 w-4" />
            My Profile
          </Link>

          <Link
            href="/tutor/settings"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>

          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <LogOut className="h-4 w-4" />
            Logout
          </button>

        </div>

      </aside>

      {/* =========================================================
          MAIN AREA
      ========================================================== */}
      <div className="lg:pl-64">

        {/* Top bar */}
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
                Tutor Dashboard
              </p>

              <p className="hidden text-xs text-muted-foreground sm:block">
                Manage your students, classes and teaching activities
              </p>
            </div>

          </div>

          <div className="flex items-center gap-1">

            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href="/tutor/announcements">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href="/tutor/messages">
                <MessageSquare className="h-5 w-5" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href="/tutor/profile">
                <User className="h-5 w-5" />
              </Link>
            </Button>

          </div>

        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">

          {/* =====================================================
              WELCOME
          ====================================================== */}
          <section className="mb-8">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div>

                <Badge className="mb-3">
                  Tutor Portal
                </Badge>

                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Good afternoon, {tutor.name} 👋
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                  Here's your teaching overview for today. Manage your
                  students, lessons, assessments and communication from
                  one place.
                </p>

              </div>

              <div className="flex flex-wrap gap-2">

                <Button asChild>
                  <Link href="/tutor/attendance">
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Mark Attendance
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  asChild
                >
                  <Link href="/tutor/assignments/new">
                    <Plus className="mr-2 h-4 w-4" />
                    New Assignment
                  </Link>
                </Button>

              </div>

            </div>

          </section>

          {/* =====================================================
              KEY STATS
          ====================================================== */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <Card>
              <CardContent className="p-5">

                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm text-muted-foreground">
                      My Students
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      24
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Currently assigned
                    </p>
                  </div>

                  <div className="rounded-lg bg-primary/10 p-2">
                    <Users className="h-5 w-5 text-primary" />
                  </div>

                </div>

              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">

                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Classes Today
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      2
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Next at 14:30
                    </p>
                  </div>

                  <div className="rounded-lg bg-primary/10 p-2">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>

                </div>

              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">

                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm text-muted-foreground">
                      To Mark
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      7
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Assignments awaiting marking
                    </p>
                  </div>

                  <div className="rounded-lg bg-primary/10 p-2">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>

                </div>

              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">

                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Class Average
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      76%
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Across your students
                    </p>
                  </div>

                  <div className="rounded-lg bg-primary/10 p-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>

                </div>

              </CardContent>
            </Card>

          </section>

          {/* =====================================================
              TODAY'S CLASSES + ATTENTION
          ====================================================== */}
          <div className="grid gap-6 lg:grid-cols-3">

            {/* Today's classes */}
            <Card className="lg:col-span-2">

              <CardHeader>

                <div className="flex items-center justify-between">

                  <div>
                    <CardTitle>
                      Today's Classes
                    </CardTitle>

                    <CardDescription>
                      Your scheduled teaching sessions
                    </CardDescription>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <Link href="/tutor/timetable">
                      Full timetable
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>

                </div>

              </CardHeader>

              <CardContent className="space-y-3">

                {todayClasses.map((lesson, index) => (

                  <div
                    key={`${lesson.subject}-${lesson.className}`}
                    className={`rounded-xl border p-4 ${
                      index === 0
                        ? "border-primary/30 bg-primary/5"
                        : ""
                    }`}
                  >

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                      <div className="flex items-start gap-3">

                        <div className="rounded-lg bg-primary/10 p-3">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>

                        <div>

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="font-semibold">
                              {lesson.subject}
                            </h3>

                            {index === 0 && (
                              <Badge>
                                NEXT
                              </Badge>
                            )}

                          </div>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {lesson.className}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">

                            <span className="flex items-center gap-1">
                              <Clock3 className="h-3.5 w-3.5" />
                              {lesson.time}
                            </span>

                            <span>
                              {lesson.room}
                            </span>

                          </div>

                        </div>

                      </div>

                      <Button
                        variant={index === 0 ? "default" : "outline"}
                        size="sm"
                        asChild
                      >
                        <Link href="/tutor/attendance">
                          {index === 0
                            ? "Open Class"
                            : "View Class"}
                        </Link>
                      </Button>

                    </div>

                  </div>

                ))}

              </CardContent>

            </Card>

            {/* Student attention */}
            <Card>

              <CardHeader>

                <CardTitle>
                  Student Attention
                </CardTitle>

                <CardDescription>
                  Students who may need support
                </CardDescription>

              </CardHeader>

              <CardContent className="space-y-3">

                {studentsNeedingAttention.map((student) => (

                  <Link
                    key={student.name}
                    href="/tutor/students"
                    className="block rounded-lg border p-3 transition hover:bg-muted/50"
                  >

                    <div className="flex gap-3">

                      <div className="mt-0.5">
                        <AlertCircle className="h-4 w-4 text-primary" />
                      </div>

                      <div className="min-w-0">

                        <p className="text-sm font-medium">
                          {student.name}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {student.detail}
                        </p>

                        <Badge
                          variant="secondary"
                          className="mt-2 text-[10px]"
                        >
                          {student.reason}
                        </Badge>

                      </div>

                    </div>

                  </Link>

                ))}

                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link href="/tutor/students">
                    View all students
                  </Link>
                </Button>

              </CardContent>

            </Card>

          </div>

          {/* =====================================================
              TEACHING WORK
          ====================================================== */}
          <section className="mt-6">

            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                Teaching Work
              </h2>

              <p className="text-sm text-muted-foreground">
                Tasks that need your attention.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">

              <Link
                href="/tutor/assignments"
                className="group"
              >
                <Card className="h-full transition hover:border-primary/40 hover:shadow-sm">

                  <CardContent className="p-5">

                    <div className="flex items-start justify-between">

                      <div className="rounded-lg bg-primary/10 p-3">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>

                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />

                    </div>

                    <h3 className="mt-4 font-semibold">
                      Assignment Marking
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      7 student submissions are waiting for marking.
                    </p>

                    <Badge className="mt-4">
                      7 pending
                    </Badge>

                  </CardContent>

                </Card>
              </Link>

              <Link
                href="/tutor/attendance"
                className="group"
              >
                <Card className="h-full transition hover:border-primary/40 hover:shadow-sm">

                  <CardContent className="p-5">

                    <div className="flex items-start justify-between">

                      <div className="rounded-lg bg-primary/10 p-3">
                        <ClipboardCheck className="h-5 w-5 text-primary" />
                      </div>

                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />

                    </div>

                    <h3 className="mt-4 font-semibold">
                      Attendance
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Mark today's attendance and monitor student participation.
                    </p>

                    <Badge
                      variant="secondary"
                      className="mt-4"
                    >
                      2 classes today
                    </Badge>

                  </CardContent>

                </Card>
              </Link>

              <Link
                href="/tutor/performance"
                className="group"
              >
                <Card className="h-full transition hover:border-primary/40 hover:shadow-sm">

                  <CardContent className="p-5">

                    <div className="flex items-start justify-between">

                      <div className="rounded-lg bg-primary/10 p-3">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>

                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />

                    </div>

                    <h3 className="mt-4 font-semibold">
                      Student Performance
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Review marks, averages and students who need support.
                    </p>

                    <Badge
                      variant="secondary"
                      className="mt-4"
                    >
                      Class average 76%
                    </Badge>

                  </CardContent>

                </Card>
              </Link>

            </div>

          </section>

          {/* =====================================================
              COMMUNICATION + ANNOUNCEMENTS
          ====================================================== */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">

            {/* Messages */}
            <Card>

              <CardHeader>

                <div className="flex items-center justify-between">

                  <div>
                    <CardTitle>
                      Recent Messages
                    </CardTitle>

                    <CardDescription>
                      Communication with students and academy
                    </CardDescription>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <Link href="/tutor/messages">
                      Messages
                    </Link>
                  </Button>

                </div>

              </CardHeader>

              <CardContent className="space-y-3">

                <Link
                  href="/tutor/messages"
                  className="block rounded-lg border p-4 transition hover:bg-muted/50"
                >

                  <div className="flex gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      ST
                    </div>

                    <div className="min-w-0">

                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold">
                          Student One
                        </p>

                        <span className="text-[10px] text-muted-foreground">
                          2 hrs ago
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Sir, I need help understanding the last question...
                      </p>

                    </div>

                  </div>

                </Link>

                <Link
                  href="/tutor/messages"
                  className="block rounded-lg border p-4 transition hover:bg-muted/50"
                >

                  <div className="flex gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      ST
                    </div>

                    <div className="min-w-0">

                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold">
                          Student Two
                        </p>

                        <span className="text-[10px] text-muted-foreground">
                          Yesterday
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        I have submitted the algebra assignment.
                      </p>

                    </div>

                  </div>

                </Link>

              </CardContent>

            </Card>

            {/* Announcements */}
            <Card>

              <CardHeader>

                <div className="flex items-center justify-between">

                  <div>
                    <CardTitle>
                      Academy Announcements
                    </CardTitle>

                    <CardDescription>
                      Important updates for tutors
                    </CardDescription>
                  </div>

                  <Bell className="h-5 w-5 text-muted-foreground" />

                </div>

              </CardHeader>

              <CardContent className="space-y-3">

                <div className="rounded-lg border p-4">

                  <div className="flex items-start gap-3">

                    <div className="rounded-lg bg-primary/10 p-2">
                      <Bell className="h-4 w-4 text-primary" />
                    </div>

                    <div>

                      <p className="text-sm font-semibold">
                        Mathematics Mock Examination
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Form 4 Mathematics mock examination is scheduled
                        for Saturday at 09:00.
                      </p>

                      <p className="mt-2 text-[10px] text-muted-foreground">
                        Posted today
                      </p>

                    </div>

                  </div>

                </div>

                <div className="rounded-lg border p-4">

                  <div className="flex items-start gap-3">

                    <div className="rounded-lg bg-primary/10 p-2">
                      <GraduationCap className="h-4 w-4 text-primary" />
                    </div>

                    <div>

                      <p className="text-sm font-semibold">
                        Term Progress Reports
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Tutors should ensure assessment records are
                        updated before reports are generated.
                      </p>

                      <p className="mt-2 text-[10px] text-muted-foreground">
                        Posted yesterday
                      </p>

                    </div>

                  </div>

                </div>

              </CardContent>

            </Card>

          </div>

          {/* =====================================================
              QUICK ACCESS
          ====================================================== */}
          <section className="mt-6">

            <Card>

              <CardHeader>
                <CardTitle>
                  Quick Access
                </CardTitle>

                <CardDescription>
                  Frequently used teaching tools
                </CardDescription>
              </CardHeader>

              <CardContent>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                  <Button
                    variant="outline"
                    className="justify-start"
                    asChild
                  >
                    <Link href="/tutor/students">
                      <Users className="mr-2 h-4 w-4" />
                      My Students
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start"
                    asChild
                  >
                    <Link href="/tutor/assignments/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Assignment
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start"
                    asChild
                  >
                    <Link href="/tutor/resources">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Teaching Resources
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start"
                    asChild
                  >
                    <Link href="/tutor/messages">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Students
                    </Link>
                  </Button>

                </div>

              </CardContent>

            </Card>

          </section>

          {/* Footer space */}
          <div className="h-8" />

        </main>

      </div>

    </div>
  )
}
