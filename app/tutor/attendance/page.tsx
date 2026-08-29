"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  User,
  Users,
  X,
  XCircle,
  Clock3,
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

type AttendanceStatus = "Present" | "Late" | "Absent"

export default function TutorAttendancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [attendance, setAttendance] = useState<
    Record<string, AttendanceStatus>
  >({
    "Student Name": "Present",
    "Tendai Moyo": "Present",
    "Brian Chirwa": "Late",
    "Rudo Ncube": "Absent",
  })

  const navigation = [
    { title: "Dashboard", href: "/tutor/dashboard", icon: LayoutDashboard },
    { title: "My Students", href: "/tutor/students", icon: Users },
    { title: "My Subjects", href: "/tutor/subjects", icon: BookOpen },
    { title: "Timetable", href: "/tutor/timetable", icon: CalendarDays },
    { title: "Attendance", href: "/tutor/attendance", icon: ClipboardCheck, active: true },
    { title: "Assignments", href: "/tutor/assignments", icon: ClipboardCheck },
    { title: "Assessments", href: "/tutor/exams", icon: ClipboardCheck },
    { title: "Messages", href: "/tutor/messages", icon: MessageSquare },
    { title: "Announcements", href: "/tutor/announcements", icon: Bell },
    { title: "Resources", href: "/tutor/resources", icon: BookOpen },
  ]

  const students = [
    "Student Name",
    "Tendai Moyo",
    "Brian Chirwa",
    "Rudo Ncube",
  ]

  const markAttendance = (
    student: string,
    status: AttendanceStatus
  ) => {
    setAttendance((current) => ({
      ...current,
      [student]: status,
    }))
  }

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
              <p className="text-[11px] text-muted-foreground">
                Tutor Portal
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
              <p className="text-sm font-medium">Attendance</p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Record and monitor student attendance
              </p>
            </div>
          </div>

          <div className="flex gap-1">
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

        <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
          <section className="mb-8">
            <Badge className="mb-3">Student Attendance</Badge>
            <h1 className="text-2xl font-bold md:text-3xl">
              Record Attendance
            </h1>
            <p className="mt-2 text-muted-foreground">
              Record attendance for each student attending your lesson.
            </p>
          </section>

          <Card className="mb-6">
            <CardContent className="p-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="mt-1 font-semibold">
                    29 August 2026
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Subject
                  </p>
                  <p className="mt-1 font-semibold">Mathematics</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Class
                  </p>
                  <p className="mt-1 font-semibold">
                    Form 4 · 14:30 – 15:30
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form 4 Mathematics</CardTitle>
              <CardDescription>
                Mark the attendance status of each student.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {students.map((student) => {
                  const status = attendance[student]

                  return (
                    <div
                      key={student}
                      className="flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center"
                    >
                      <div className="flex flex-1 items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                          {student
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <div>
                          <p className="font-medium">{student}</p>
                          <p className="text-xs text-muted-foreground">
                            Current status: {status}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          size="sm"
                          variant={
                            status === "Present"
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            markAttendance(student, "Present")
                          }
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Present
                        </Button>

                        <Button
                          size="sm"
                          variant={
                            status === "Late"
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            markAttendance(student, "Late")
                          }
                        >
                          <Clock3 className="mr-1 h-4 w-4" />
                          Late
                        </Button>

                        <Button
                          size="sm"
                          variant={
                            status === "Absent"
                              ? "destructive"
                              : "outline"
                          }
                          onClick={() =>
                            markAttendance(student, "Absent")
                          }
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Absent
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 flex flex-col justify-between gap-4 border-t pt-5 sm:flex-row sm:items-center">
                <div className="text-sm text-muted-foreground">
                  Present:{" "}
                  <strong>
                    {
                      Object.values(attendance).filter(
                        (x) => x === "Present"
                      ).length
                    }
                  </strong>
                  {" · "}
                  Late:{" "}
                  <strong>
                    {
                      Object.values(attendance).filter(
                        (x) => x === "Late"
                      ).length
                    }
                  </strong>
                  {" · "}
                  Absent:{" "}
                  <strong>
                    {
                      Object.values(attendance).filter(
                        (x) => x === "Absent"
                      ).length
                    }
                  </strong>
                </div>

                <Button>
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Save Attendance
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}