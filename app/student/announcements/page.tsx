
"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Megaphone,
  Pin,
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

export default function StudentAnnouncementsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { title: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { title: "My Subjects", href: "/student/subjects", icon: BookOpen },
    { title: "Timetable", href: "/student/timetable", icon: CalendarDays },
    { title: "Attendance", href: "/student/attendance", icon: ClipboardCheck },
    { title: "Performance", href: "/student/performance", icon: ClipboardCheck },
    { title: "Assignments", href: "/student/assignments", icon: ClipboardCheck },
    { title: "Tests & Exams", href: "/student/exams", icon: ClipboardCheck },
    { title: "Messages", href: "/student/messages", icon: MessageSquare },
    {
      title: "Announcements",
      href: "/student/announcements",
      icon: Bell,
      active: true,
    },
    { title: "Resources", href: "/student/resources", icon: BookOpen },
  ]

  const announcements = [
    {
      title: "September Assessment Timetable Released",
      category: "Examinations",
      date: "29 Aug 2026",
      author: "GlobeDK Elite Academy",
      important: true,
      pinned: true,
      description:
        "The September assessment timetable has been released. Students are encouraged to review their examination dates and begin preparation early.",
    },
    {
      title: "Weekend Lessons Continue This Saturday",
      category: "Academy",
      date: "28 Aug 2026",
      author: "Academy Administration",
      important: false,
      pinned: false,
      description:
        "Regular weekend lessons will continue this Saturday. Students should arrive at least 10 minutes before their scheduled lesson.",
    },
    {
      title: "Mathematics Revision Session",
      category: "Mathematics",
      date: "27 Aug 2026",
      author: "Mr Daka",
      important: false,
      pinned: false,
      description:
        "A revision session covering algebra, factorisation and quadratic equations will be available before the upcoming Mathematics assessment.",
    },
    {
      title: "Assignment Submission Reminder",
      category: "Academic",
      date: "26 Aug 2026",
      author: "Academic Department",
      important: true,
      pinned: false,
      description:
        "Students are reminded to submit outstanding assignments before their respective deadlines. Late submissions may affect academic progress.",
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
                  {item.title}
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
              <p className="text-sm font-medium">
                Announcements
              </p>

              <p className="hidden text-xs text-muted-foreground sm:block">
                Important academy and academic updates
              </p>
            </div>

          </div>

          <div className="flex items-center gap-1">

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

        <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-8">

          <section className="mb-8">

            <Badge className="mb-3">
              Academy Updates
            </Badge>

            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Announcements
            </h1>

            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Stay informed about academy activities, academic updates,
              assessments and important notices.
            </p>

          </section>

          {/* Important Notice */}
          <Card className="mb-6 border-primary/30 bg-primary/5">

            <CardContent className="p-5">

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Megaphone className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1">

                  <div className="flex flex-wrap items-center gap-2">

                    <Badge>
                      Important
                    </Badge>

                    <Badge variant="outline">
                      1 unread
                    </Badge>

                  </div>

                  <h2 className="mt-3 text-lg font-semibold">
                    September Assessment Timetable Released
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    The September assessment timetable has been released.
                    Please review your examination dates and begin preparing
                    early.
                  </p>

                  <Button className="mt-4">
                    View Assessment Schedule
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>

                </div>

              </div>

            </CardContent>

          </Card>

          {/* Announcements */}
          <div className="space-y-4">

            {announcements.map((announcement) => (

              <Card key={announcement.title}>

                <CardContent className="p-5">

                  <div className="flex gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">

                      {announcement.pinned ? (
                        <Pin className="h-5 w-5 text-primary" />
                      ) : (
                        <Bell className="h-5 w-5 text-primary" />
                      )}

                    </div>

                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <Badge variant="outline">
                          {announcement.category}
                        </Badge>

                        {announcement.important && (
                          <Badge>
                            Important
                          </Badge>
                        )}

                      </div>

                      <h2 className="mt-3 text-lg font-semibold">
                        {announcement.title}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {announcement.description}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">

                        <span>
                          {announcement.author}
                        </span>

                        <span>
                          {announcement.date}
                        </span>

                      </div>

                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden sm:flex"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                  </div>

                </CardContent>

              </Card>

            ))}

          </div>

        </main>

      </div>

    </div>
  )
}
