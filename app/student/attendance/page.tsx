
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
  ClipboardCheck,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  User,
  X,
  TrendingDown,
  TrendingUp,
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

export default function StudentAttendancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { title: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { title: "My Subjects", href: "/student/subjects", icon: BookOpen },
    { title: "Timetable", href: "/student/timetable", icon: CalendarDays },
    {
      title: "Attendance",
      href: "/student/attendance",
      icon: ClipboardCheck,
      active: true,
    },
    { title: "Performance", href: "/student/performance", icon: TrendingUp },
    { title: "Assignments", href: "/student/assignments", icon: BookOpen },
    { title: "Tests & Exams", href: "/student/exams", icon: ClipboardCheck },
    { title: "Messages", href: "/student/messages", icon: MessageSquare },
    { title: "Announcements", href: "/student/announcements", icon: Bell },
    { title: "Resources", href: "/student/resources", icon: BookOpen },
  ]

  const subjects = [
    {
      subject: "Mathematics",
      code: "MATH",
      attended: 18,
      total: 20,
      percentage: 90,
      status: "Good",
    },
    {
      subject: "English Language",
      code: "ENG",
      attended: 19,
      total: 20,
      percentage: 95,
      status: "Excellent",
    },
    {
      subject: "Computer Science",
      code: "CS",
      attended: 17,
      total: 18,
      percentage: 94,
      status: "Excellent",
    },
    {
      subject: "Geography",
      code: "GEO",
      attended: 15,
      total: 18,
      percentage: 83,
      status: "Needs Attention",
    },
  ]

  const recentAttendance = [
    {
      date: "28 Aug 2026",
      subject: "Mathematics",
      time: "08:00 - 09:30",
      status: "Present",
    },
    {
      date: "27 Aug 2026",
      subject: "Geography",
      time: "14:00 - 15:30",
      status: "Present",
    },
    {
      date: "27 Aug 2026",
      subject: "English Language",
      time: "10:00 - 11:30",
      status: "Present",
    },
    {
      date: "26 Aug 2026",
      subject: "Computer Science",
      time: "08:00 - 09:30",
      status: "Present",
    },
    {
      date: "25 Aug 2026",
      subject: "Geography",
      time: "10:00 - 11:30",
      status: "Absent",
    },
    {
      date: "24 Aug 2026",
      subject: "Mathematics",
      time: "08:00 - 09:30",
      status: "Present",
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
                Attendance
              </p>

              <p className="hidden text-xs text-muted-foreground sm:block">
                Track your class attendance
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
              Academic Record
            </Badge>

            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              My Attendance
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
              Monitor your attendance and make sure you are consistently
              present for your lessons.
            </p>

          </section>

          {/* Stats */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Card>
              <CardContent className="p-5">

                <div className="flex justify-between">

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Overall Attendance
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      92%
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      This academic term
                    </p>
                  </div>

                  <CheckCircle2 className="h-6 w-6 text-primary" />

                </div>

              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">

                <div className="flex justify-between">

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Classes Attended
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      69
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Out of 76 classes
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
                      Absences
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      7
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      This term
                    </p>
                  </div>

                  <AlertCircle className="h-6 w-6 text-primary" />

                </div>

              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">

                <div className="flex justify-between">

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Attendance Trend
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      +4%
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Improving
                    </p>
                  </div>

                  <TrendingUp className="h-6 w-6 text-primary" />

                </div>

              </CardContent>
            </Card>

          </section>

          {/* Attendance by Subject */}
          <section className="mb-8">

            <Card>

              <CardHeader>

                <CardTitle>
                  Attendance by Subject
                </CardTitle>

                <CardDescription>
                  Your attendance record for each subject
                </CardDescription>

              </CardHeader>

              <CardContent>

                <div className="space-y-5">

                  {subjects.map((subject) => (

                    <div key={subject.subject}>

                      <div className="mb-2 flex items-center justify-between gap-3">

                        <div>

                          <p className="text-sm font-medium">
                            {subject.subject}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {subject.attended} of {subject.total} classes attended
                          </p>

                        </div>

                        <Badge
                          variant={
                            subject.percentage >= 90
                              ? "default"
                              : "outline"
                          }
                        >
                          {subject.percentage}%
                        </Badge>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-muted">

                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{
                            width: `${subject.percentage}%`,
                          }}
                        />

                      </div>

                      <div className="mt-2 flex items-center gap-2 text-xs">

                        {subject.percentage >= 90 ? (
                          <>
                            <TrendingUp className="h-3.5 w-3.5 text-primary" />
                            <span className="text-muted-foreground">
                              {subject.status}
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {subject.status}
                            </span>
                          </>
                        )}

                      </div>

                    </div>

                  ))}

                </div>

              </CardContent>

            </Card>

          </section>

          {/* Recent Attendance */}
          <section>

            <Card>

              <CardHeader>

                <CardTitle>
                  Recent Attendance
                </CardTitle>

                <CardDescription>
                  Your latest lesson attendance records
                </CardDescription>

              </CardHeader>

              <CardContent>

                <div className="space-y-3">

                  {recentAttendance.map((record, index) => (

                    <div
                      key={index}
                      className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
                    >

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">

                        {record.status === "Present" ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-muted-foreground" />
                        )}

                      </div>

                      <div className="flex-1">

                        <p className="font-medium">
                          {record.subject}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">

                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {record.date}
                          </span>

                          <span className="flex items-center gap-1">
                            <Clock3 className="h-3.5 w-3.5" />
                            {record.time}
                          </span>

                        </div>

                      </div>

                      <Badge
                        variant={
                          record.status === "Present"
                            ? "default"
                            : "outline"
                        }
                      >
                        {record.status}
                      </Badge>

                    </div>

                  ))}

                </div>

              </CardContent>

            </Card>

          </section>

          {/* Attendance Advice */}
          <section className="mt-6">

            <Card className="border-primary/20 bg-primary/5">

              <CardContent className="p-5">

                <div className="flex gap-3">

                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <Clock3 className="h-5 w-5 text-primary" />
                  </div>

                  <div>

                    <p className="font-semibold">
                      Keep building your attendance record
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Your current attendance is good. Aim to attend every
                      scheduled lesson, especially Mathematics and Geography,
                      where consistent attendance can support your progress.
                    </p>

                  </div>

                </div>

              </CardContent>

            </Card>

          </section>

        </main>

      </div>

    </div>
  )
}

