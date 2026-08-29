"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Users,
  User,
  X,
  ChevronRight,
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
import { Input } from "@/components/ui/input"

export default function TutorStudentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState("")

  const navigation = [
    { title: "Dashboard", href: "/tutor/dashboard", icon: LayoutDashboard },
    { title: "My Students", href: "/tutor/students", icon: Users, active: true },
    { title: "My Subjects", href: "/tutor/subjects", icon: BookOpen },
    { title: "Timetable", href: "/tutor/timetable", icon: CalendarDays },
    { title: "Attendance", href: "/tutor/attendance", icon: ClipboardCheck },
    { title: "Assignments", href: "/tutor/assignments", icon: ClipboardCheck },
    { title: "Assessments", href: "/tutor/exams", icon: ClipboardCheck },
    { title: "Messages", href: "/tutor/messages", icon: MessageSquare },
    { title: "Announcements", href: "/tutor/announcements", icon: Bell },
    { title: "Resources", href: "/tutor/resources", icon: BookOpen },
  ]

  const students = [
    {
      name: "Student Name",
      form: "Form 4",
      level: "O-Level",
      subjects: "Mathematics, English, Computer Science",
      attendance: 92,
      average: 78,
      status: "On Track",
      initials: "SN",
    },
    {
      name: "Tendai Moyo",
      form: "Form 4",
      level: "O-Level",
      subjects: "Mathematics",
      attendance: 88,
      average: 74,
      status: "Needs Support",
      initials: "TM",
    },
    {
      name: "Brian Chirwa",
      form: "Form 3",
      level: "O-Level",
      subjects: "Mathematics, Computer Science",
      attendance: 96,
      average: 84,
      status: "Excellent",
      initials: "BC",
    },
    {
      name: "Rudo Ncube",
      form: "Form 4",
      level: "O-Level",
      subjects: "Mathematics",
      attendance: 91,
      average: 81,
      status: "On Track",
      initials: "RN",
    },
  ]

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.form} ${student.level}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

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
              <p className="text-sm font-bold">GlobeDK Elite</p>
              <p className="text-[11px] text-muted-foreground">Tutor Portal</p>
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
              <p className="text-sm font-semibold">Mr Daka</p>
              <p className="text-xs text-muted-foreground">
                Mathematics Tutor
              </p>
            </div>
          </div>
        </div>

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
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div>
              <p className="text-sm font-medium">My Students</p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Manage and monitor your assigned students
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/tutor/announcements">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/tutor/messages">
                <MessageSquare className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
          <section className="mb-8">
            <Badge className="mb-3">Student Management</Badge>

            <h1 className="text-2xl font-bold md:text-3xl">
              My Students
            </h1>

            <p className="mt-2 text-muted-foreground">
              Monitor student attendance, academic performance and learning
              progress.
            </p>
          </section>

          <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Assigned Students
                </p>
                <p className="mt-2 text-3xl font-bold">24</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Average Performance
                </p>
                <p className="mt-2 text-3xl font-bold">78%</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Attendance
                </p>
                <p className="mt-2 text-3xl font-bold">91%</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Need Support
                </p>
                <p className="mt-2 text-3xl font-bold">4</p>
              </CardContent>
            </Card>
          </section>

          <Card>
            <CardHeader>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <CardTitle>Student List</CardTitle>
                  <CardDescription>
                    Students currently assigned to you
                  </CardDescription>
                </div>

                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search students..."
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {filteredStudents.map((student) => (
                  <div
                    key={student.name}
                    className="rounded-xl border p-4 transition hover:bg-muted/40"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      <div className="flex items-center gap-3 md:w-1/3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                          {student.initials}
                        </div>

                        <div>
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.form} · {student.level}
                          </p>
                        </div>
                      </div>

                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">
                          Subjects
                        </p>
                        <p className="text-sm">{student.subjects}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Attendance
                        </p>
                        <p className="font-semibold">
                          {student.attendance}%
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Average
                        </p>
                        <p className="font-semibold">
                          {student.average}%
                        </p>
                      </div>

                      <Badge
                        variant={
                          student.status === "Needs Support"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {student.status}
                      </Badge>

                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}