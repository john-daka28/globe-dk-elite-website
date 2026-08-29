
"use client"

import Link from "next/link"
import { useState } from "react"
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PlayCircle,
  Search,
  Target,
  TrendingDown,
  TrendingUp,
  User,
  Users,
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

export default function StudentSubjectsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState("")

  const subjects = [
    {
      name: "Mathematics",
      code: "MATH",
      tutor: "Mr Daka",
      curriculum: "ZIMSEC O-Level",
      average: 82,
      attendance: 94,
      assignments: 1,
      nextClass: "Today, 14:30",
      progress: 68,
      status: "Strong",
      description:
        "Algebra, geometry, statistics, trigonometry and examination preparation.",
    },
    {
      name: "English Language",
      code: "ENG",
      tutor: "Mrs Moyo",
      curriculum: "ZIMSEC O-Level",
      average: 76,
      attendance: 91,
      assignments: 2,
      nextClass: "Today, 16:00",
      progress: 72,
      status: "Good",
      description:
        "Comprehension, composition writing, grammar, vocabulary and language skills.",
    },
    {
      name: "Computer Science",
      code: "CS",
      tutor: "Mr Daka",
      curriculum: "ZIMSEC O-Level",
      average: 88,
      attendance: 96,
      assignments: 0,
      nextClass: "Tomorrow, 15:00",
      progress: 81,
      status: "Excellent",
      description:
        "Algorithms, programming, data representation, networks and computer systems.",
    },
    {
      name: "Geography",
      code: "GEO",
      tutor: "Mr Chirwa",
      curriculum: "ZIMSEC O-Level",
      average: 71,
      attendance: 87,
      assignments: 3,
      nextClass: "Tomorrow, 16:30",
      progress: 59,
      status: "Needs Attention",
      description:
        "Physical geography, human geography, map work and environmental studies.",
    },
  ]

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(search.toLowerCase())
  )

  const navigation = [
    {
      title: "Dashboard",
      href: "/student/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Subjects",
      href: "/student/subjects",
      icon: BookOpen,
      active: true,
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
      icon: Target,
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

            <div className="min-w-0">

              <p className="truncate text-sm font-semibold">
                Student Name
              </p>

              <p className="truncate text-xs text-muted-foreground">
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

        </nav>

        {/* Sidebar Bottom */}
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
                My Subjects
              </p>

              <p className="hidden text-xs text-muted-foreground sm:block">
                GlobeDK Elite Academy
              </p>
            </div>

          </div>

          <div className="flex items-center gap-1">

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

          {/* Heading */}
          <section className="mb-8">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

              <div>

                <div className="mb-3 flex items-center gap-2">

                  <Badge>
                    4 Subjects
                  </Badge>

                  <Badge
                    variant="outline"
                    className="font-normal"
                  >
                    Form 4 · O-Level
                  </Badge>

                </div>

                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  My Subjects
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                  View your subjects, academic progress, tutors,
                  attendance and learning activities in one place.
                </p>

              </div>

            </div>

          </section>

          {/* Overview */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Card>
              <CardContent className="p-5">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Enrolled Subjects
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      4
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Current academic year
                    </p>

                  </div>

                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>

                </div>

              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Overall Average
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      79%
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

            <Card>
              <CardContent className="p-5">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Average Attendance
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      92%
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Across all subjects
                    </p>

                  </div>

                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                  </div>

                </div>

              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Pending Work
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      6
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Assignments to complete
                    </p>

                  </div>

                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>

                </div>

              </CardContent>
            </Card>

          </section>

          {/* Search */}
          <Card className="mb-6">

            <CardContent className="p-4">

              <div className="relative">

                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search your subjects..."
                  className="h-10 w-full rounded-md border bg-background pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />

              </div>

            </CardContent>

          </Card>

          {/* Subject Cards */}
          <section>

            <div className="mb-4">

              <h2 className="text-xl font-semibold">
                Enrolled Subjects
              </h2>

              <p className="text-sm text-muted-foreground">
                Select a subject to view its learning area.
              </p>

            </div>

            <div className="grid gap-5 lg:grid-cols-2">

              {filteredSubjects.map((subject) => (

                <Card
                  key={subject.code}
                  className="overflow-hidden transition-shadow hover:shadow-md"
                >

                  <CardHeader className="border-b bg-muted/20">

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-start gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">

                          <BookOpen className="h-5 w-5 text-primary" />

                        </div>

                        <div>

                          <CardTitle>
                            {subject.name}
                          </CardTitle>

                          <CardDescription className="mt-1">
                            {subject.curriculum}
                          </CardDescription>

                        </div>

                      </div>

                      {subject.status === "Excellent" ? (
                        <Badge>
                          Excellent
                        </Badge>
                      ) : subject.status === "Needs Attention" ? (
                        <Badge variant="destructive">
                          Needs Attention
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          {subject.status}
                        </Badge>
                      )}

                    </div>

                  </CardHeader>

                  <CardContent className="p-5">

                    <p className="text-sm text-muted-foreground">
                      {subject.description}
                    </p>

                    {/* Tutor */}
                    <div className="mt-5 flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>

                      <div>

                        <p className="text-xs text-muted-foreground">
                          Tutor
                        </p>

                        <p className="text-sm font-medium">
                          {subject.tutor}
                        </p>

                      </div>

                    </div>

                    {/* Stats */}
                    <div className="mt-5 grid grid-cols-3 gap-3">

                      <div className="rounded-lg bg-muted/50 p-3">

                        <div className="flex items-center gap-1.5">
                          <BarChart3 className="h-3.5 w-3.5 text-primary" />
                          <p className="text-xs text-muted-foreground">
                            Average
                          </p>
                        </div>

                        <p className="mt-1 text-lg font-bold">
                          {subject.average}%
                        </p>

                      </div>

                      <div className="rounded-lg bg-muted/50 p-3">

                        <div className="flex items-center gap-1.5">
                          <ClipboardCheck className="h-3.5 w-3.5 text-primary" />
                          <p className="text-xs text-muted-foreground">
                            Attendance
                          </p>
                        </div>

                        <p className="mt-1 text-lg font-bold">
                          {subject.attendance}%
                        </p>

                      </div>

                      <div className="rounded-lg bg-muted/50 p-3">

                        <div className="flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-primary" />
                          <p className="text-xs text-muted-foreground">
                            Pending
                          </p>
                        </div>

                        <p className="mt-1 text-lg font-bold">
                          {subject.assignments}
                        </p>

                      </div>

                    </div>

                    {/* Course Progress */}
                    <div className="mt-5">

                      <div className="mb-2 flex items-center justify-between">

                        <span className="text-sm font-medium">
                          Course Progress
                        </span>

                        <span className="text-sm font-semibold">
                          {subject.progress}%
                        </span>

                      </div>

                      <div className="h-2 rounded-full bg-muted">

                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{
                            width: `${subject.progress}%`,
                          }}
                        />

                      </div>

                    </div>

                    {/* Next Class */}
                    <div className="mt-5 flex items-center justify-between rounded-lg border p-3">

                      <div className="flex items-center gap-3">

                        <Clock3 className="h-4 w-4 text-primary" />

                        <div>

                          <p className="text-xs text-muted-foreground">
                            Next Class
                          </p>

                          <p className="text-sm font-medium">
                            {subject.nextClass}
                          </p>

                        </div>

                      </div>

                      <ChevronRight className="h-4 w-4 text-muted-foreground" />

                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex gap-2">

                      <Button
                        className="flex-1"
                        asChild
                      >
                        <Link
                          href={`/student/subjects/${subject.code.toLowerCase()}`}
                        >
                          Open Subject
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                      >
                        <Link
                          href={`/student/subjects/${subject.code.toLowerCase()}/resources`}
                        >
                          <BookOpen className="h-4 w-4" />
                        </Link>
                      </Button>

                    </div>

                  </CardContent>

                </Card>

              ))}

            </div>

            {/* Empty State */}
            {filteredSubjects.length === 0 && (
              <div className="rounded-xl border bg-background px-6 py-16 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>

                <h3 className="mt-4 font-semibold">
                  No subject found
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Try searching for a different subject.
                </p>

              </div>
            )}

          </section>

          {/* Today's Learning */}
          <section className="mt-8">

            <Card>

              <CardHeader>

                <CardTitle>
                  Today's Learning
                </CardTitle>

                <CardDescription>
                  Activities connected to your enrolled subjects
                </CardDescription>

              </CardHeader>

              <CardContent>

                <div className="grid gap-3 md:grid-cols-3">

                  <Link
                    href="/student/assignments"
                    className="group rounded-xl border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >

                    <div className="flex items-center justify-between">

                      <div className="rounded-lg bg-primary/10 p-2.5">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>

                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />

                    </div>

                    <h3 className="mt-4 font-semibold">
                      Complete Assignments
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      You have 6 assignments waiting for completion.
                    </p>

                  </Link>

                  <Link
                    href="/student/timetable"
                    className="group rounded-xl border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >

                    <div className="flex items-center justify-between">

                      <div className="rounded-lg bg-primary/10 p-2.5">
                        <CalendarDays className="h-5 w-5 text-primary" />
                      </div>

                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />

                    </div>

                    <h3 className="mt-4 font-semibold">
                      View Today's Classes
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Mathematics at 14:30 and English at 16:00.
                    </p>

                  </Link>

                  <Link
                    href="/practice"
                    className="group rounded-xl border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >

                    <div className="flex items-center justify-between">

                      <div className="rounded-lg bg-primary/10 p-2.5">
                        <PlayCircle className="h-5 w-5 text-primary" />
                      </div>

                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />

                    </div>

                    <h3 className="mt-4 font-semibold">
                      Practice a Topic
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Strengthen your understanding with practice questions.
                    </p>

                  </Link>

                </div>

              </CardContent>

            </Card>

          </section>

          {/* Tutor Support */}
          <section className="mt-6">

            <Card className="border-primary/20 bg-primary/5">

              <CardContent className="p-5">

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  <div className="flex items-start gap-3">

                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>

                    <div>

                      <p className="font-semibold">
                        Need help with a subject?
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Send a message to your tutor and ask for
                        clarification, feedback or additional support.
                      </p>

                    </div>

                  </div>

                  <Button asChild>
                    <Link href="/student/messages">
                      Contact Tutor
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

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

