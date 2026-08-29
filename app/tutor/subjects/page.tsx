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
  User,
  Users,
  X,
  ChevronRight,
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

export default function TutorSubjectsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { title: "Dashboard", href: "/tutor/dashboard", icon: LayoutDashboard },
    { title: "My Students", href: "/tutor/students", icon: Users },
    { title: "My Subjects", href: "/tutor/subjects", icon: BookOpen, active: true },
    { title: "Timetable", href: "/tutor/timetable", icon: CalendarDays },
    { title: "Attendance", href: "/tutor/attendance", icon: ClipboardCheck },
    { title: "Assignments", href: "/tutor/assignments", icon: ClipboardCheck },
    { title: "Assessments", href: "/tutor/exams", icon: ClipboardCheck },
    { title: "Messages", href: "/tutor/messages", icon: MessageSquare },
    { title: "Announcements", href: "/tutor/announcements", icon: Bell },
    { title: "Resources", href: "/tutor/resources", icon: BookOpen },
  ]

  const subjects = [
    {
      name: "Mathematics",
      code: "MATH-O4",
      level: "O-Level",
      form: "Form 4",
      students: 14,
      average: 78,
      classes: 3,
      status: "Active",
    },
    {
      name: "Mathematics",
      code: "MATH-O3",
      level: "O-Level",
      form: "Form 3",
      students: 8,
      average: 82,
      classes: 2,
      status: "Active",
    },
    {
      name: "Computer Science",
      code: "CS-O4",
      level: "O-Level",
      form: "Form 4",
      students: 6,
      average: 84,
      classes: 2,
      status: "Active",
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
              <p className="text-sm font-medium">My Subjects</p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Subjects and classes assigned to you
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
            <Badge className="mb-3">Teaching</Badge>
            <h1 className="text-2xl font-bold md:text-3xl">
              My Subjects
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage the subjects and classes assigned to you.
            </p>
          </section>

          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Active Subjects
                </p>
                <p className="mt-2 text-3xl font-bold">2</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Classes
                </p>
                <p className="mt-2 text-3xl font-bold">3</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Students
                </p>
                <p className="mt-2 text-3xl font-bold">28</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {subjects.map((subject) => (
              <Card key={subject.code} className="transition hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="rounded-xl bg-primary/10 p-3">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>

                    <Badge variant="secondary">{subject.status}</Badge>
                  </div>

                  <CardTitle className="mt-4">
                    {subject.name}
                  </CardTitle>

                  <CardDescription>
                    {subject.form} · {subject.level}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">
                        Students
                      </p>
                      <p className="mt-1 font-bold">
                        {subject.students}
                      </p>
                    </div>

                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">
                        Average
                      </p>
                      <p className="mt-1 font-bold">
                        {subject.average}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Weekly classes
                    </span>
                    <span className="font-medium">
                      {subject.classes}
                    </span>
                  </div>

                  <Button className="w-full" variant="outline">
                    Open Subject
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}