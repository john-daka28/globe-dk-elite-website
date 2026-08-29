"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
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

export default function TutorTimetablePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { title: "Dashboard", href: "/tutor/dashboard", icon: LayoutDashboard },
    { title: "My Students", href: "/tutor/students", icon: Users },
    { title: "My Subjects", href: "/tutor/subjects", icon: BookOpen },
    { title: "Timetable", href: "/tutor/timetable", icon: CalendarDays, active: true },
    { title: "Attendance", href: "/tutor/attendance", icon: ClipboardCheck },
    { title: "Assignments", href: "/tutor/assignments", icon: ClipboardCheck },
    { title: "Assessments", href: "/tutor/exams", icon: ClipboardCheck },
    { title: "Messages", href: "/tutor/messages", icon: MessageSquare },
    { title: "Announcements", href: "/tutor/announcements", icon: Bell },
    { title: "Resources", href: "/tutor/resources", icon: BookOpen },
  ]

  const days = [
    {
      day: "Monday",
      date: "31 Aug",
      classes: [
        {
          subject: "Mathematics",
          className: "Form 4",
          time: "08:00 – 09:00",
          room: "Room 4",
        },
        {
          subject: "Computer Science",
          className: "Form 4",
          time: "14:00 – 15:00",
          room: "Computer Lab",
        },
      ],
    },
    {
      day: "Tuesday",
      date: "1 Sep",
      classes: [
        {
          subject: "Mathematics",
          className: "Form 3",
          time: "10:00 – 11:00",
          room: "Room 3",
        },
      ],
    },
    {
      day: "Wednesday",
      date: "2 Sep",
      classes: [
        {
          subject: "Mathematics",
          className: "Form 4",
          time: "14:30 – 15:30",
          room: "Room 4",
        },
        {
          subject: "Mathematics",
          className: "Form 3",
          time: "16:00 – 17:00",
          room: "Room 3",
        },
      ],
    },
    {
      day: "Thursday",
      date: "3 Sep",
      classes: [
        {
          subject: "Computer Science",
          className: "Form 4",
          time: "09:00 – 10:00",
          room: "Computer Lab",
        },
      ],
    },
    {
      day: "Friday",
      date: "4 Sep",
      classes: [
        {
          subject: "Mathematics",
          className: "Form 4",
          time: "13:00 – 14:00",
          room: "Room 4",
        },
      ],
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
              <p className="text-sm font-medium">Teaching Timetable</p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Your weekly teaching schedule
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
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <Badge className="mb-3">Academic Schedule</Badge>
              <h1 className="text-2xl font-bold md:text-3xl">
                My Timetable
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Week of 31 August – 4 September 2026
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline">This Week</Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Today's Teaching</CardTitle>
              <CardDescription>
                Your next scheduled lessons
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <Badge>NEXT CLASS</Badge>
                    <Clock3 className="h-5 w-5 text-primary" />
                  </div>

                  <h3 className="mt-4 text-lg font-semibold">
                    Mathematics
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Form 4 · 14 students
                  </p>

                  <p className="mt-3 font-medium">
                    14:30 – 15:30
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Room 4
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">UPCOMING</Badge>
                    <Clock3 className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <h3 className="mt-4 text-lg font-semibold">
                    Mathematics
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Form 3 · 8 students
                  </p>

                  <p className="mt-3 font-medium">
                    16:00 – 17:00
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Room 3
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {days.map((day) => (
              <Card key={day.day}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        {day.day}
                      </CardTitle>
                      <CardDescription>{day.date}</CardDescription>
                    </div>

                    <Badge variant="outline">
                      {day.classes.length}{" "}
                      {day.classes.length === 1 ? "class" : "classes"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {day.classes.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center"
                    >
                      <div className="flex items-center gap-3 md:w-44">
                        <Clock3 className="h-5 w-5 text-primary" />
                        <span className="font-medium">
                          {item.time}
                        </span>
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold">
                          {item.subject}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.className} · {item.room}
                        </p>
                      </div>

                      <Button variant="outline" size="sm">
                        View Class
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}