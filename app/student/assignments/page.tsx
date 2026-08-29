
"use client"

import Link from "next/link"
import { useState } from "react"
import {
  AlertCircle,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  Download,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Paperclip,
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

export default function StudentAssignmentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { title: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { title: "My Subjects", href: "/student/subjects", icon: BookOpen },
    { title: "Timetable", href: "/student/timetable", icon: CalendarDays },
    { title: "Attendance", href: "/student/attendance", icon: ClipboardList },
    { title: "Performance", href: "/student/performance", icon: TrendingUp },
    {
      title: "Assignments",
      href: "/student/assignments",
      icon: ClipboardList,
      active: true,
    },
    { title: "Tests & Exams", href: "/student/exams", icon: Target },
    { title: "Messages", href: "/student/messages", icon: MessageSquare },
    { title: "Announcements", href: "/student/announcements", icon: Bell },
    { title: "Resources", href: "/student/resources", icon: BookOpen },
  ]

  const assignments = [
    {
      title: "Algebra & Factorisation Practice",
      subject: "Mathematics",
      teacher: "Mr Daka",
      due: "30 Aug 2026",
      status: "Pending",
      priority: "High",
      description:
        "Complete questions on expansion, factorisation and solving quadratic equations.",
    },
    {
      title: "Composition Writing",
      subject: "English Language",
      teacher: "Mrs Moyo",
      due: "01 Sep 2026",
      status: "Pending",
      priority: "Normal",
      description:
        "Write a 350–450 word composition using the required composition type.",
    },
    {
      title: "Mapwork Exercise",
      subject: "Geography",
      teacher: "Mr Chirwa",
      due: "28 Aug 2026",
      status: "Overdue",
      priority: "High",
      description:
        "Complete the mapwork exercise and answer all interpretation questions.",
    },
    {
      title: "Programming Fundamentals",
      subject: "Computer Science",
      teacher: "Mr Daka",
      due: "26 Aug 2026",
      status: "Submitted",
      priority: "Normal",
      score: "91%",
      description:
        "Programming fundamentals worksheet covering variables, selection and loops.",
    },
  ]

  const upcoming = assignments.filter(
    (assignment) => assignment.status === "Pending"
  )

  return (
    <div className="min-h-screen bg-muted/30">

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
                  <span>{item.title}</span>
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

      {/* Main */}
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
              <p className="text-sm font-medium">Assignments</p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Manage your academic tasks
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
            <Badge className="mb-3">Learning Tasks</Badge>

            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              My Assignments
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
              View your assignments, deadlines, submissions and tutor
              feedback in one place.
            </p>
          </section>

          {/* Stats */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Total Assignments
                </p>
                <p className="mt-2 text-3xl font-bold">24</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  This term
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Pending
                </p>
                <p className="mt-2 text-3xl font-bold">2</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Need your attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Submitted
                </p>
                <p className="mt-2 text-3xl font-bold">21</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Successfully submitted
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Average Mark
                </p>
                <p className="mt-2 text-3xl font-bold">82%</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Improving
                </p>
              </CardContent>
            </Card>

          </section>

          {/* Upcoming */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Assignments Requiring Attention</CardTitle>
              <CardDescription>
                Complete these assignments before their deadlines.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">

              {upcoming.map((assignment) => (
                <div
                  key={assignment.title}
                  className="rounded-xl border p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <ClipboardList className="h-5 w-5 text-primary" />
                    </div>

                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">
                          {assignment.title}
                        </h3>

                        <Badge>
                          {assignment.subject}
                        </Badge>
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {assignment.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">

                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {assignment.teacher}
                        </span>

                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Due {assignment.due}
                        </span>

                      </div>

                    </div>

                    <Button>
                      Open Assignment
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>

                  </div>
                </div>
              ))}

            </CardContent>
          </Card>

          {/* All Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment History</CardTitle>
              <CardDescription>
                Your recent assignments and submission records.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">

              {assignments.map((assignment) => (
                <div
                  key={assignment.title}
                  className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>

                  <div className="flex-1">

                    <p className="font-medium">
                      {assignment.title}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>{assignment.subject}</span>
                      <span>Due {assignment.due}</span>
                    </div>

                  </div>

                  {assignment.score && (
                    <div className="text-right">
                      <p className="font-semibold">
                        {assignment.score}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Mark
                      </p>
                    </div>
                  )}

                  <Badge
                    variant={
                      assignment.status === "Submitted"
                        ? "default"
                        : assignment.status === "Overdue"
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {assignment.status}
                  </Badge>

                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                </div>
              ))}

            </CardContent>
          </Card>

        </main>
      </div>
    </div>
  )
}
