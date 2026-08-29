"use client"

import Link from "next/link"
import {
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Plus,
  User,
  Users,
  X,
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

export default function TutorExamsPage() {
  const navigation = [
    { title: "Dashboard", href: "/tutor/dashboard", icon: LayoutDashboard },
    { title: "My Students", href: "/tutor/students", icon: Users },
    { title: "My Subjects", href: "/tutor/subjects", icon: BookOpen },
    { title: "Timetable", href: "/tutor/timetable", icon: CalendarDays },
    { title: "Attendance", href: "/tutor/attendance", icon: ClipboardCheck },
    { title: "Performance", href: "/tutor/performance", icon: BarChart3 },
    { title: "Assignments", href: "/tutor/assignments", icon: ClipboardList },
    {
      title: "Exams & Tests",
      href: "/tutor/exams",
      icon: FileText,
      active: true,
    },
    { title: "Messages", href: "/tutor/messages", icon: MessageSquare },
    { title: "Announcements", href: "/tutor/announcements", icon: Bell },
    { title: "Resources", href: "/tutor/resources", icon: BookOpen },
  ]

  const exams = [
    {
      title: "Mathematics Mock Examination",
      subject: "Mathematics",
      date: "Saturday, 30 August 2026",
      time: "09:00 – 11:00",
      students: 18,
      status: "Upcoming",
    },
    {
      title: "Algebra Topic Test",
      subject: "Mathematics",
      date: "Tuesday, 2 September 2026",
      time: "14:30 – 15:30",
      students: 12,
      status: "Scheduled",
    },
    {
      title: "Functions Assessment",
      subject: "Mathematics",
      date: "20 August 2026",
      time: "14:30 – 15:30",
      students: 15,
      status: "Completed",
    },
  ]

  return (
    <div className="min-h-screen bg-muted/30">

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-background lg:flex">

        <div className="flex h-16 items-center border-b px-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold">GlobeDK Elite</p>
              <p className="text-[11px] text-muted-foreground">
                Tutor Portal
              </p>
            </div>
          </Link>
        </div>

        <div className="border-b p-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="text-sm font-semibold">Mr Daka</p>
              <p className="text-xs text-muted-foreground">
                Mathematics Tutor
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon

              return (
                <Link
                  key={item.title}
                  href={item.href}
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
            href="/tutor/profile"
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
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>

            <div>
              <p className="text-sm font-medium">Tests & Exams</p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Create and manage student assessments
              </p>
            </div>
          </div>

          <Button asChild size="sm">
            <Link href="/tutor/exams/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Exam
            </Link>
          </Button>

        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">

          <section className="mb-8">
            <Badge className="mb-3">Assessment Centre</Badge>

            <h1 className="text-2xl font-bold md:text-3xl">
              Tests & Examinations
            </h1>

            <p className="mt-2 text-muted-foreground">
              Create assessments, monitor submissions and review student
              performance.
            </p>
          </section>

          <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Total Assessments
                </p>
                <p className="mt-2 text-3xl font-bold">12</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Upcoming
                </p>
                <p className="mt-2 text-3xl font-bold">2</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Awaiting Marking
                </p>
                <p className="mt-2 text-3xl font-bold">7</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Average Result
                </p>
                <p className="mt-2 text-3xl font-bold">76%</p>
              </CardContent>
            </Card>

          </section>

          <Card>
            <CardHeader>
              <CardTitle>My Assessments</CardTitle>
              <CardDescription>
                Tests and examinations assigned to your students
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">

              {exams.map((exam) => (
                <div
                  key={exam.title}
                  className="flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center md:justify-between"
                >

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{exam.title}</h3>

                      <Badge
                        variant={
                          exam.status === "Completed"
                            ? "secondary"
                            : "default"
                        }
                      >
                        {exam.status}
                      </Badge>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {exam.subject}
                    </p>

                    <p className="mt-2 text-sm">
                      {exam.date} · {exam.time}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {exam.students} students
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>

                    <Button size="sm">
                      Results
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