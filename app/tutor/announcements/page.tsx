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
  MessageSquare,
  Plus,
  User,
  Users,
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

export default function TutorAnnouncementsPage() {
  const navigation = [
    { title: "Dashboard", href: "/tutor/dashboard", icon: LayoutDashboard },
    { title: "My Students", href: "/tutor/students", icon: Users },
    { title: "My Subjects", href: "/tutor/subjects", icon: BookOpen },
    { title: "Timetable", href: "/tutor/timetable", icon: CalendarDays },
    { title: "Attendance", href: "/tutor/attendance", icon: ClipboardCheck },
    { title: "Performance", href: "/tutor/performance", icon: BarChart3 },
    { title: "Assignments", href: "/tutor/assignments", icon: ClipboardList },
    { title: "Exams & Tests", href: "/tutor/exams", icon: FileText },
    { title: "Messages", href: "/tutor/messages", icon: MessageSquare },
    {
      title: "Announcements",
      href: "/tutor/announcements",
      icon: Bell,
      active: true,
    },
    { title: "Resources", href: "/tutor/resources", icon: BookOpen },
  ]

  const announcements = [
    {
      title: "Mathematics Mock Examination",
      message:
        "The Mathematics mock examination will take place this Saturday at 09:00. Please ensure all assigned students are informed.",
      date: "29 August 2026",
      audience: "Mathematics Students",
      priority: "Important",
    },
    {
      title: "Weekly Attendance Submission",
      message:
        "All tutors are reminded to submit attendance records before the end of the weekend.",
      date: "28 August 2026",
      audience: "All Tutors",
      priority: "Reminder",
    },
    {
      title: "Weekend Lessons",
      message:
        "Weekend classes begin at 08:00. Tutors should arrive at least 15 minutes before their first scheduled lesson.",
      date: "27 August 2026",
      audience: "Teaching Staff",
      priority: "General",
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
                      : "text-muted-foreground hover:bg-muted"
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

          <div>
            <p className="text-sm font-medium">
              Announcements
            </p>

            <p className="hidden text-xs text-muted-foreground sm:block">
              Academy and student communication
            </p>
          </div>

          <Button asChild size="sm">
            <Link href="/tutor/announcements/new">
              <Plus className="mr-2 h-4 w-4" />
              New Announcement
            </Link>
          </Button>

        </header>

        <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-8">

          <section className="mb-8">
            <Badge className="mb-3">
              Communication Centre
            </Badge>

            <h1 className="text-2xl font-bold md:text-3xl">
              Announcements
            </h1>

            <p className="mt-2 text-muted-foreground">
              Publish important information for students, classes or
              academy staff.
            </p>
          </section>

          <div className="space-y-4">

            {announcements.map((announcement) => (
              <Card key={announcement.title}>

                <CardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle>
                          {announcement.title}
                        </CardTitle>

                        <Badge variant="secondary">
                          {announcement.priority}
                        </Badge>
                      </div>

                      <CardDescription className="mt-2">
                        Posted {announcement.date}
                      </CardDescription>
                    </div>

                    <Badge>
                      {announcement.audience}
                    </Badge>

                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {announcement.message}
                  </p>

                  <div className="mt-5 flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>

                    <Button variant="ghost" size="sm">
                      View
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