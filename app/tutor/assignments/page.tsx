"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
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
  Eye,
  CheckCircle2,
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
import { Input } from "@/components/ui/input"

export default function TutorAssignmentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  const navigation = [
    { title: "Dashboard", href: "/tutor/dashboard", icon: LayoutDashboard },
    { title: "My Students", href: "/tutor/students", icon: Users },
    { title: "My Subjects", href: "/tutor/subjects", icon: BookOpen },
    { title: "Timetable", href: "/tutor/timetable", icon: CalendarDays },
    { title: "Attendance", href: "/tutor/attendance", icon: ClipboardCheck },
    { title: "Assignments", href: "/tutor/assignments", icon: ClipboardCheck, active: true },
    { title: "Assessments", href: "/tutor/exams", icon: ClipboardCheck },
    { title: "Messages", href: "/tutor/messages", icon: MessageSquare },
    { title: "Announcements", href: "/tutor/announcements", icon: Bell },
    { title: "Resources", href: "/tutor/resources", icon: BookOpen },
  ]

  const assignments = [
    {
      title: "Quadratic Equations",
      subject: "Mathematics",
      className: "Form 4",
      due: "30 Aug 2026",
      submissions: 11,
      total: 14,
      status: "Due Soon",
    },
    {
      title: "Factorisation Revision",
      subject: "Mathematics",
      className: "Form 4",
      due: "2 Sep 2026",
      submissions: 6,
      total: 14,
      status: "Active",
    },
    {
      title: "Algorithms & Problem Solving",
      subject: "Computer Science",
      className: "Form 4",
      due: "5 Sep 2026",
      submissions: 3,
      total: 6,
      status: "Active",
    },
    {
      title: "Algebraic Expressions",
      subject: "Mathematics",
      className: "Form 3",
      due: "25 Aug 2026",
      submissions: 8,
      total: 8,
      status: "Completed",
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
              <p className="text-sm font-medium">Assignments</p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Create, manage and mark student assignments
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

        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
          <section className="mb-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <Badge className="mb-3">Learning Activities</Badge>

                <h1 className="text-2xl font-bold md:text-3xl">
                  Assignments
                </h1>

                <p className="mt-2 text-muted-foreground">
                  Create assignments, monitor submissions and provide
                  feedback.
                </p>
              </div>

              <Button onClick={() => setShowCreate(!showCreate)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Assignment
              </Button>
            </div>
          </section>

          {showCreate && (
            <Card className="mb-6 border-primary/30">
              <CardHeader>
                <CardTitle>Create New Assignment</CardTitle>
                <CardDescription>
                  Create an assignment for one of your classes.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">
                      Assignment Title
                    </label>
                    <Input
                      className="mt-2"
                      placeholder="e.g. Quadratic Equations"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Subject
                    </label>
                    <Input
                      className="mt-2"
                      placeholder="Mathematics"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Class
                    </label>
                    <Input
                      className="mt-2"
                      placeholder="Form 4"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Due Date
                    </label>
                    <Input
                      className="mt-2"
                      type="date"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Instructions
                  </label>

                  <textarea
                    className="mt-2 min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Write instructions for your students..."
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreate(false)}
                  >
                    Cancel
                  </Button>

                  <Button>
                    Publish Assignment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <section className="mb-6 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Active Assignments
                </p>
                <p className="mt-2 text-3xl font-bold">3</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Awaiting Marking
                </p>
                <p className="mt-2 text-3xl font-bold">9</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Completion Rate
                </p>
                <p className="mt-2 text-3xl font-bold">81%</p>
              </CardContent>
            </Card>
          </section>

          <Card>
            <CardHeader>
              <CardTitle>My Assignments</CardTitle>
              <CardDescription>
                Assignments you have created for your students.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.title}
                    className="rounded-xl border p-4 transition hover:bg-muted/40"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                      <div className="flex flex-1 gap-3">
                        <div className="rounded-lg bg-primary/10 p-3">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>

                        <div>
                          <p className="font-semibold">
                            {assignment.title}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {assignment.subject} ·{" "}
                            {assignment.className}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="outline">
                              Due {assignment.due}
                            </Badge>

                            <Badge
                              variant={
                                assignment.status === "Completed"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {assignment.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <p className="text-xs text-muted-foreground">
                            Submissions
                          </p>
                          <p className="font-semibold">
                            {assignment.submissions}/
                            {assignment.total}
                          </p>
                        </div>

                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>

                        <Button size="sm">
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark
                        </Button>
                      </div>
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