"use client"

import Link from "next/link"
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  ClipboardCheck,
  BarChart3,
  Brain,
  Menu,
  User,
  Users,
  X,
  AlertCircle,
  Award,
  TrendingUp,
} from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    {
      title: "Dashboard",
      href: "/student/dashboard",
      icon: LayoutDashboard,
      active: true,
    },
    {
      title: "My Subjects",
      href: "/student/subjects",
      icon: BookOpen,
    },
    {
      title: "Timetable",
      href: "/student/timetable",
      icon: CalendarDays,
    },
    {
      title: "Attendance",
      href: "/student/attendance",
      icon: ClipboardCheck,
    },
    {
      title: "Performance",
      href: "/student/performance",
      icon: BarChart3,
    },
    {
      title: "Assignments",
      href: "/student/assignments",
      icon: FileText,
    },
    {
      title: "Tests & Exams",
      href: "/student/exams",
      icon: Award,
    },
    {
      title: "Messages",
      href: "/student/messages",
      icon: MessageSquare,
    },
    {
      title: "Announcements",
      href: "/student/announcements",
      icon: Bell,
    },
    {
      title: "Resources",
      href: "/student/resources",
      icon: BookOpen,
    },
  ]

  const aiTools = [
    {
      title: "AI Exam Predictor",
      description: "Analyse historical examination patterns.",
      href: "/exam-predictor",
      icon: Brain,
    },
    {
      title: "Mock Exams",
      description: "Generate realistic examination practice.",
      href: "/mock-exams",
      icon: FileText,
    },
    {
      title: "Practice Questions",
      description: "Practise questions by topic.",
      href: "/practice",
      icon: BookOpen,
    },
    {
      title: "Question Helper",
      description: "Get AI assistance with difficult questions.",
      href: "/question-helper",
      icon: Brain,
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
          >
            {/* <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"> */}
              <image>
                <img
                  src="/logo.png"
                  alt="GlobeDK Elite Academy Logo"
                  className="h-15 w-15 rounded-lg object-cover"
                />
              </image>
            {/* </div> */}

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

        {/* Student Mini Profile */}
        <div className="border-b p-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                Student Name
              </p>

              <p className="truncate text-xs text-muted-foreground">
                O-Level Student
              </p>
            </div>

          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">

          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Student Portal
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

                  {item.title === "Messages" && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-[10px] font-semibold text-primary">
                      2
                    </span>
                  )}

                </Link>
              )
            })}

          </div>

          {/* AI Tools */}
          <div className="mt-7">

            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              AI Study Tools
            </p>

            <div className="space-y-1">

              <Link
                href="/exam-predictor"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Brain className="h-4 w-4" />
                AI Exam Predictor
              </Link>

              <Link
                href="/mock-exams"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <FileText className="h-4 w-4" />
                Mock Exams
              </Link>

              <Link
                href="/practice"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <BookOpen className="h-4 w-4" />
                Practice Questions
              </Link>

              <Link
                href="/question-helper"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Brain className="h-4 w-4" />
                Question Helper
              </Link>

            </div>
          </div>

        </nav>

        {/* Bottom Navigation */}
        <div className="border-t p-3">

          <Link
            href="/student/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <User className="h-4 w-4" />
            My Profile
          </Link>

          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
            <LogOut className="h-4 w-4" />
            Logout
          </button>

        </div>

      </aside>

      {/* Main Area */}
      <div className="lg:pl-64">

        {/* Top Header */}
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
                Student Portal
              </p>

              <p className="hidden text-xs text-muted-foreground sm:block">
                GlobeDK Elite Academy
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2">

            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href="/student/announcements">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href="/student/messages">
                <MessageSquare className="h-5 w-5" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href="/student/profile">
                <User className="h-5 w-5" />
              </Link>
            </Button>

          </div>

        </header>

        {/* Content */}
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">

          {/* Welcome */}
          <section className="mb-8">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div>

                <div className="mb-3 flex items-center gap-2">
                  <Badge>
                    O-Level Student
                  </Badge>

                  <Badge
                    variant="outline"
                    className="font-normal"
                  >
                    2026 Academic Year
                  </Badge>
                </div>

                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Good afternoon, Student 👋
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                  Welcome back to GlobeDK Elite Academy. Here's your
                  academic overview and everything you need for today.
                </p>

              </div>

              <Button asChild>
                <Link href="/student/timetable">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  View Timetable
                </Link>
              </Button>

            </div>

          </section>

          {/* Overview Stats */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Attendance */}
            <Card>
              <CardContent className="p-5">

                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Attendance
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      92%
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      23 present · 1 late · 1 absent
                    </p>
                  </div>

                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>

                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: "92%" }}
                  />
                </div>

              </CardContent>
            </Card>

            {/* Average */}
            <Card>
              <CardContent className="p-5">

                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Academic Average
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      78%
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-xs text-primary">
                      <TrendingUp className="h-3 w-3" />
                      Improving
                    </p>
                  </div>

                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>

                </div>

              </CardContent>
            </Card>

            {/* Assignments */}
            <Card>
              <CardContent className="p-5">

                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Pending Assignments
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      3
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      1 due tomorrow
                    </p>
                  </div>

                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>

                </div>

              </CardContent>
            </Card>

            {/* Classes */}
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
                      Next class at 14:30
                    </p>
                  </div>

                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <Clock3 className="h-5 w-5 text-primary" />
                  </div>

                </div>

              </CardContent>
            </Card>

          </section>

          {/* Main Grid */}
          <div className="grid gap-6 xl:grid-cols-3">

            {/* Today's Classes */}
            <Card className="xl:col-span-2">

              <CardHeader className="flex flex-row items-center justify-between">

                <div>
                  <CardTitle>Today's Classes</CardTitle>
                  <CardDescription>
                    Your lessons scheduled for today
                  </CardDescription>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <Link href="/student/timetable">
                    Full timetable
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>

              </CardHeader>

              <CardContent className="space-y-3">

                {/* Current / Next Class */}
                <div className="flex flex-col gap-4 rounded-xl border bg-primary/5 p-4 sm:flex-row sm:items-center">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <BookOpen className="h-5 w-5" />
                  </div>

                  <div className="flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      <h3 className="font-semibold">
                        Mathematics
                      </h3>

                      <Badge className="text-[10px]">
                        NEXT
                      </Badge>

                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      14:30 – 15:30 · Mr Daka
                    </p>

                  </div>

                  <div className="text-left sm:text-right">

                    <p className="text-sm font-medium">
                      In 20 minutes
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Mathematics
                    </p>

                  </div>

                </div>

                {/* English */}
                <div className="flex items-center gap-4 rounded-xl border p-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="flex-1">

                    <h3 className="font-semibold">
                      English Language
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      16:00 – 17:00 · English Tutor
                    </p>

                  </div>

                  <Badge variant="outline">
                    Upcoming
                  </Badge>

                </div>

              </CardContent>
            </Card>

            {/* Attendance */}
            <Card>

              <CardHeader>
                <CardTitle>Attendance</CardTitle>
                <CardDescription>
                  Your attendance this term
                </CardDescription>
              </CardHeader>

              <CardContent>

                <div className="flex items-center justify-center py-3">

                  <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-primary/15">

                    <div className="text-center">
                      <p className="text-3xl font-bold">
                        92%
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Attendance
                      </p>
                    </div>

                  </div>

                </div>

                <div className="mt-5 space-y-3">

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Present
                    </span>
                    <span className="font-medium">
                      23 days
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Late
                    </span>
                    <span className="font-medium">
                      1 day
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Absent
                    </span>
                    <span className="font-medium">
                      1 day
                    </span>
                  </div>

                </div>

                <Button
                  variant="outline"
                  className="mt-5 w-full"
                  asChild
                >
                  <Link href="/student/attendance">
                    View Attendance
                  </Link>
                </Button>

              </CardContent>
            </Card>

          </div>

          {/* Lower Grid */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">

            {/* Performance */}
            <Card>

              <CardHeader className="flex flex-row items-center justify-between">

                <div>
                  <CardTitle>Academic Performance</CardTitle>
                  <CardDescription>
                    Your latest subject performance
                  </CardDescription>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <Link href="/student/performance">
                    View all
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>

              </CardHeader>

              <CardContent className="space-y-5">

                {/* Mathematics */}
                <div>

                  <div className="mb-2 flex items-center justify-between text-sm">

                    <span className="font-medium">
                      Mathematics
                    </span>

                    <span className="font-semibold">
                      82%
                    </span>

                  </div>

                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: "82%" }}
                    />
                  </div>

                </div>

                {/* English */}
                <div>

                  <div className="mb-2 flex items-center justify-between text-sm">

                    <span className="font-medium">
                      English Language
                    </span>

                    <span className="font-semibold">
                      76%
                    </span>

                  </div>

                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: "76%" }}
                    />
                  </div>

                </div>

                {/* Computer Science */}
                <div>

                  <div className="mb-2 flex items-center justify-between text-sm">

                    <span className="font-medium">
                      Computer Science
                    </span>

                    <span className="font-semibold">
                      88%
                    </span>

                  </div>

                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: "88%" }}
                    />
                  </div>

                </div>

                {/* Geography */}
                <div>

                  <div className="mb-2 flex items-center justify-between text-sm">

                    <span className="font-medium">
                      Geography
                    </span>

                    <span className="font-semibold">
                      71%
                    </span>

                  </div>

                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: "71%" }}
                    />
                  </div>

                </div>

              </CardContent>
            </Card>

            {/* Tutor Communication */}
            <Card>

              <CardHeader className="flex flex-row items-center justify-between">

                <div>
                  <CardTitle>Tutor Communication</CardTitle>
                  <CardDescription>
                    Recent messages from your tutors
                  </CardDescription>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <Link href="/student/messages">
                    Messages
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>

              </CardHeader>

              <CardContent className="space-y-4">

                <div className="flex gap-3 rounded-lg border p-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center justify-between gap-2">

                      <p className="text-sm font-semibold">
                        Mr Daka
                      </p>

                      <span className="text-[11px] text-muted-foreground">
                        2 hrs ago
                      </span>

                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Please complete the quadratic equations revision
                      before Saturday's Mathematics lesson.
                    </p>

                  </div>

                </div>

                <div className="flex gap-3 rounded-lg border p-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center justify-between gap-2">

                      <p className="text-sm font-semibold">
                        English Tutor
                      </p>

                      <span className="text-[11px] text-muted-foreground">
                        Yesterday
                      </span>

                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Your composition has been marked. Check the
                      feedback in your assignments.
                    </p>

                  </div>

                </div>

              </CardContent>
            </Card>

          </div>

          {/* Assignments & Announcements */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">

            {/* Assignments */}
            <Card className="lg:col-span-2">

              <CardHeader className="flex flex-row items-center justify-between">

                <div>
                  <CardTitle>My Tasks</CardTitle>
                  <CardDescription>
                    Assignments and activities requiring your attention
                  </CardDescription>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <Link href="/student/assignments">
                    View all
                  </Link>
                </Button>

              </CardHeader>

              <CardContent className="space-y-3">

                <div className="flex items-center gap-4 rounded-lg border p-4">

                  <div className="rounded-lg bg-destructive/10 p-2.5">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  </div>

                  <div className="flex-1">

                    <p className="font-medium">
                      Mathematics Assignment
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Quadratic Equations · Due tomorrow
                    </p>

                  </div>

                  <Badge variant="destructive">
                    Due Soon
                  </Badge>

                </div>

                <div className="flex items-center gap-4 rounded-lg border p-4">

                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>

                  <div className="flex-1">

                    <p className="font-medium">
                      English Composition
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Discursive Writing · Due 2 September
                    </p>

                  </div>

                  <Badge variant="outline">
                    Pending
                  </Badge>

                </div>

                <div className="flex items-center gap-4 rounded-lg border p-4">

                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>

                  <div className="flex-1">

                    <p className="font-medium">
                      Computer Science Revision
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Algorithms and Problem Solving
                    </p>

                  </div>

                  <Badge variant="secondary">
                    Completed
                  </Badge>

                </div>

              </CardContent>
            </Card>

            {/* Announcement */}
            <Card>

              <CardHeader>
                <CardTitle>Announcements</CardTitle>
                <CardDescription>
                  Important academy updates
                </CardDescription>
              </CardHeader>

              <CardContent>

                <div className="rounded-xl border bg-primary/5 p-4">

                  <div className="flex items-start gap-3">

                    <div className="rounded-lg bg-primary/10 p-2">
                      <Bell className="h-4 w-4 text-primary" />
                    </div>

                    <div>

                      <p className="font-semibold">
                        Mathematics Mock Examination
                      </p>

                      <p className="mt-2 text-sm text-muted-foreground">
                        Your Mathematics mock examination will take
                        place this Saturday at 09:00.
                      </p>

                      <p className="mt-3 text-xs text-muted-foreground">
                        Posted today
                      </p>

                    </div>

                  </div>

                </div>

                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  asChild
                >
                  <Link href="/student/announcements">
                    View Announcements
                  </Link>
                </Button>

              </CardContent>
            </Card>

          </div>

          {/* AI Study Centre */}
          <section className="mt-6">

            <Card className="border-primary/20">

              <CardHeader>

                <div className="flex items-center gap-2">

                  <div className="rounded-lg bg-primary/10 p-2">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <CardTitle>
                      AI Study Centre
                    </CardTitle>

                    <CardDescription>
                      Smart tools to support your examination preparation
                    </CardDescription>
                  </div>

                </div>

              </CardHeader>

              <CardContent>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                  {aiTools.map((tool) => {
                    const Icon = tool.icon

                    return (
                      <Link
                        key={tool.title}
                        href={tool.href}
                        className="group rounded-xl border bg-background p-4 transition-all hover:border-primary/40 hover:shadow-sm"
                      >

                        <div className="flex items-center justify-between">

                          <div className="rounded-lg bg-primary/10 p-2.5">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>

                          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />

                        </div>

                        <h3 className="mt-4 font-semibold">
                          {tool.title}
                        </h3>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {tool.description}
                        </p>

                      </Link>
                    )
                  })}

                </div>

              </CardContent>

            </Card>

          </section>

          {/* Footer */}
          <footer className="mt-10 border-t pt-6 text-center">

            <p className="text-xs text-muted-foreground">
              GlobeDK Elite Academy
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Excellence in Education. Success for Life.
            </p>

          </footer>

        </main>

      </div>

    </div>
  )
}