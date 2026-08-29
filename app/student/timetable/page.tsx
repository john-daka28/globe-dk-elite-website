
"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  MapPin,
  PlayCircle,
  Target,
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

export default function StudentTimetablePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    },
    {
      title: "Timetable",
      href: "/student/timetable",
      icon: CalendarDays,
      active: true,
    },
    {
      title: "Attendance",
      href: "/student/attendance",
      icon: ClipboardCheck,
    },
    {
      title: "Performance",
      href: "/student/performance",
      icon: Target,
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

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]

  const timetable = {
    Monday: [
      {
        time: "08:00 - 09:30",
        subject: "Mathematics",
        code: "MATH",
        tutor: "Mr Daka",
        room: "Room 2",
        type: "Lesson",
        status: "Completed",
      },
      {
        time: "10:00 - 11:30",
        subject: "English Language",
        code: "ENG",
        tutor: "Mrs Moyo",
        room: "Room 1",
        type: "Lesson",
        status: "Completed",
      },
      {
        time: "14:00 - 15:00",
        subject: "Computer Science",
        code: "CS",
        tutor: "Mr Daka",
        room: "Computer Lab",
        type: "Practical",
        status: "Completed",
      },
    ],

    Tuesday: [
      {
        time: "08:00 - 09:30",
        subject: "Geography",
        code: "GEO",
        tutor: "Mr Chirwa",
        room: "Room 3",
        type: "Lesson",
        status: "Completed",
      },
      {
        time: "10:00 - 11:30",
        subject: "Mathematics",
        code: "MATH",
        tutor: "Mr Daka",
        room: "Room 2",
        type: "Lesson",
        status: "Completed",
      },
      {
        time: "14:00 - 15:00",
        subject: "English Language",
        code: "ENG",
        tutor: "Mrs Moyo",
        room: "Room 1",
        type: "Practice",
        status: "Completed",
      },
    ],

    Wednesday: [
      {
        time: "08:00 - 09:30",
        subject: "Computer Science",
        code: "CS",
        tutor: "Mr Daka",
        room: "Computer Lab",
        type: "Practical",
        status: "Completed",
      },
      {
        time: "10:00 - 11:30",
        subject: "English Language",
        code: "ENG",
        tutor: "Mrs Moyo",
        room: "Room 1",
        type: "Lesson",
        status: "Upcoming",
      },
      {
        time: "14:00 - 15:30",
        subject: "Geography",
        code: "GEO",
        tutor: "Mr Chirwa",
        room: "Room 3",
        type: "Lesson",
        status: "Upcoming",
      },
    ],

    Thursday: [
      {
        time: "08:00 - 09:30",
        subject: "Mathematics",
        code: "MATH",
        tutor: "Mr Daka",
        room: "Room 2",
        type: "Lesson",
        status: "Upcoming",
      },
      {
        time: "10:00 - 11:30",
        subject: "Geography",
        code: "GEO",
        tutor: "Mr Chirwa",
        room: "Room 3",
        type: "Lesson",
        status: "Upcoming",
      },
      {
        time: "14:00 - 15:00",
        subject: "Computer Science",
        code: "CS",
        tutor: "Mr Daka",
        room: "Computer Lab",
        type: "Practical",
        status: "Upcoming",
      },
    ],

    Friday: [
      {
        time: "08:00 - 09:30",
        subject: "English Language",
        code: "ENG",
        tutor: "Mrs Moyo",
        room: "Room 1",
        type: "Lesson",
        status: "Upcoming",
      },
      {
        time: "10:00 - 11:30",
        subject: "Mathematics",
        code: "MATH",
        tutor: "Mr Daka",
        room: "Room 2",
        type: "Revision",
        status: "Upcoming",
      },
      {
        time: "14:00 - 15:30",
        subject: "Study & Revision",
        code: "REV",
        tutor: "Academic Support",
        room: "Study Hall",
        type: "Revision",
        status: "Upcoming",
      },
    ],

    Saturday: [
      {
        time: "08:00 - 09:30",
        subject: "Mathematics",
        code: "MATH",
        tutor: "Mr Daka",
        room: "Room 2",
        type: "Revision",
        status: "Upcoming",
      },
      {
        time: "10:00 - 11:30",
        subject: "Computer Science",
        code: "CS",
        tutor: "Mr Daka",
        room: "Computer Lab",
        type: "Practice",
        status: "Upcoming",
      },
      {
        time: "12:00 - 13:00",
        subject: "Weekly Assessment",
        code: "TEST",
        tutor: "Academic Team",
        room: "Examination Room",
        type: "Assessment",
        status: "Upcoming",
      },
    ],
  }

  const todayClasses = [
    {
      time: "10:00 - 11:30",
      subject: "English Language",
      tutor: "Mrs Moyo",
      room: "Room 1",
      type: "Lesson",
    },
    {
      time: "14:00 - 15:30",
      subject: "Geography",
      tutor: "Mr Chirwa",
      room: "Room 3",
      type: "Lesson",
    },
  ]

  const upcomingEvents = [
    {
      date: "Saturday",
      time: "12:00",
      title: "Weekly Assessment",
      subject: "All Subjects",
    },
    {
      date: "Next Monday",
      time: "08:00",
      title: "Mathematics Test",
      subject: "Mathematics",
    },
    {
      date: "Next Wednesday",
      time: "10:00",
      title: "English Composition",
      subject: "English Language",
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

        {/* Student */}
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
                Timetable
              </p>

              <p className="hidden text-xs text-muted-foreground sm:block">
                Your classes and academic schedule
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

          {/* Page Heading */}
          <section className="mb-8">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

              <div>

                <div className="mb-3 flex items-center gap-2">

                  <Badge>
                    Form 4 · O-Level
                  </Badge>

                  <Badge
                    variant="outline"
                    className="font-normal"
                  >
                    Current Week
                  </Badge>

                </div>

                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  My Timetable
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                  Keep track of your classes, revision sessions,
                  assessments and upcoming academic activities.
                </p>

              </div>

              <Button
                variant="outline"
                asChild
              >
                <Link href="/student/attendance">
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  View Attendance
                </Link>
              </Button>

            </div>

          </section>

          {/* Today's Classes */}
          <section className="mb-8">

            <Card className="border-primary/20">

              <CardHeader>

                <div className="flex items-center justify-between">

                  <div>

                    <CardTitle>
                      Today's Classes
                    </CardTitle>

                    <CardDescription>
                      Your scheduled learning activities for today
                    </CardDescription>

                  </div>

                  <div className="hidden rounded-lg bg-primary/10 p-2.5 sm:block">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>

                </div>

              </CardHeader>

              <CardContent>

                <div className="grid gap-3 md:grid-cols-2">

                  {todayClasses.map((item, index) => (

                    <div
                      key={index}
                      className="rounded-xl border bg-background p-4"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex items-start gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>

                          <div>

                            <p className="font-semibold">
                              {item.subject}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {item.type} · {item.tutor}
                            </p>

                          </div>

                        </div>

                        <Badge>
                          Today
                        </Badge>

                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock3 className="h-4 w-4" />
                          {item.time}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {item.room}
                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              </CardContent>

            </Card>

          </section>

          {/* Week Controls */}
          <section className="mb-4">

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

              <div>

                <h2 className="text-xl font-semibold">
                  Weekly Schedule
                </h2>

                <p className="text-sm text-muted-foreground">
                  Monday - Saturday
                </p>

              </div>

              <div className="flex items-center gap-2">

                <Button
                  variant="outline"
                  size="icon"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  className="px-4"
                >
                  This Week
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

              </div>

            </div>

          </section>

          {/* Timetable Grid */}
          <section className="mb-8">

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {weekDays.map((day) => {

                const classes =
                  timetable[day as keyof typeof timetable]

                const isToday = day === "Wednesday"

                return (

                  <Card
                    key={day}
                    className={`overflow-hidden ${
                      isToday
                        ? "border-primary/40 ring-1 ring-primary/20"
                        : ""
                    }`}
                  >

                    <CardHeader className="border-b bg-muted/20 pb-4">

                      <div className="flex items-center justify-between">

                        <div>

                          <CardTitle className="text-base">
                            {day}
                          </CardTitle>

                          <CardDescription className="mt-1">
                            {classes.length} scheduled activities
                          </CardDescription>

                        </div>

                        {isToday && (
                          <Badge>
                            Today
                          </Badge>
                        )}

                      </div>

                    </CardHeader>

                    <CardContent className="space-y-3 p-4">

                      {classes.map((item, index) => (

                        <div
                          key={index}
                          className={`rounded-lg border p-3 ${
                            item.status === "Completed"
                              ? "bg-muted/20"
                              : "bg-background"
                          }`}
                        >

                          <div className="flex items-start gap-3">

                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                              {item.type === "Assessment" ? (
                                <Target className="h-4 w-4 text-primary" />
                              ) : item.type === "Practical" ? (
                                <PlayCircle className="h-4 w-4 text-primary" />
                              ) : (
                                <BookOpen className="h-4 w-4 text-primary" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">

                              <div className="flex items-start justify-between gap-2">

                                <p className="text-sm font-semibold">
                                  {item.subject}
                                </p>

                                {item.status === "Completed" ? (
                                  <CheckCircle2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                                ) : (
                                  <Clock3 className="h-4 w-4 shrink-0 text-primary" />
                                )}

                              </div>

                              <p className="mt-1 text-xs text-muted-foreground">
                                {item.time}
                              </p>

                              <p className="mt-1 text-xs text-muted-foreground">
                                {item.tutor}
                              </p>

                              <div className="mt-2 flex flex-wrap gap-1.5">

                                <Badge
                                  variant="outline"
                                  className="text-[10px]"
                                >
                                  {item.type}
                                </Badge>

                                <Badge
                                  variant="outline"
                                  className="text-[10px]"
                                >
                                  {item.room}
                                </Badge>

                              </div>

                            </div>

                          </div>

                        </div>

                      ))}

                    </CardContent>

                  </Card>

                )

              })}

            </div>

          </section>

          {/* Bottom Information */}
          <div className="grid gap-6 lg:grid-cols-3">

            {/* Upcoming Events */}
            <Card className="lg:col-span-2">

              <CardHeader>

                <CardTitle>
                  Upcoming Academic Activities
                </CardTitle>

                <CardDescription>
                  Tests, assessments and important learning events
                </CardDescription>

              </CardHeader>

              <CardContent className="space-y-3">

                {upcomingEvents.map((event, index) => (

                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-lg border p-4"
                  >

                    <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10">

                      <CalendarDays className="h-4 w-4 text-primary" />

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="font-medium">
                        {event.title}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {event.subject}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-sm font-medium">
                        {event.date}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {event.time}
                      </p>

                    </div>

                  </div>

                ))}

              </CardContent>

            </Card>

            {/* Schedule Summary */}
            <Card>

              <CardHeader>

                <CardTitle>
                  Schedule Summary
                </CardTitle>

                <CardDescription>
                  Your academic week at a glance
                </CardDescription>

              </CardHeader>

              <CardContent className="space-y-4">

                <div className="flex items-center justify-between rounded-lg border p-3">

                  <div className="flex items-center gap-3">

                    <BookOpen className="h-4 w-4 text-primary" />

                    <span className="text-sm">
                      Classes
                    </span>

                  </div>

                  <span className="font-semibold">
                    18
                  </span>

                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">

                  <div className="flex items-center gap-3">

                    <Clock3 className="h-4 w-4 text-primary" />

                    <span className="text-sm">
                      Learning Hours
                    </span>

                  </div>

                  <span className="font-semibold">
                    24h
                  </span>

                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">

                  <div className="flex items-center gap-3">

                    <Target className="h-4 w-4 text-primary" />

                    <span className="text-sm">
                      Assessments
                    </span>

                  </div>

                  <span className="font-semibold">
                    3
                  </span>

                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">

                  <div className="flex items-center gap-3">

                    <ClipboardCheck className="h-4 w-4 text-primary" />

                    <span className="text-sm">
                      Attendance
                    </span>

                  </div>

                  <span className="font-semibold">
                    92%
                  </span>

                </div>

              </CardContent>

            </Card>

          </div>

          {/* Important Notice */}
          <section className="mt-6">

            <Card className="border-primary/20 bg-primary/5">

              <CardContent className="p-5">

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  <div className="flex items-start gap-3">

                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>

                    <div>

                      <p className="font-semibold">
                        Remember to check your timetable
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Your tutor may update lesson times, rooms or
                        assessment dates. Check announcements regularly
                        for schedule changes.
                      </p>

                    </div>

                  </div>

                  <Button
                    variant="outline"
                    asChild
                  >
                    <Link href="/student/announcements">
                      View Announcements
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

