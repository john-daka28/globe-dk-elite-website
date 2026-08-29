"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCheck,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Send,
  User,
  Users,
  X,
  FileText,
  ClipboardList,
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
import { Input } from "@/components/ui/input"

export default function TutorMessagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [message, setMessage] = useState("")

  const navigation = [
    { title: "Dashboard", href: "/tutor/dashboard", icon: LayoutDashboard },
    { title: "My Students", href: "/tutor/students", icon: Users },
    { title: "My Subjects", href: "/tutor/subjects", icon: BookOpen },
    { title: "Timetable", href: "/tutor/timetable", icon: CalendarDays },
    { title: "Attendance", href: "/tutor/attendance", icon: ClipboardCheck },
    { title: "Performance", href: "/tutor/performance", icon: BarChart3 },
    { title: "Assignments", href: "/tutor/assignments", icon: ClipboardList },
    { title: "Exams & Tests", href: "/tutor/exams", icon: FileText },
    {
      title: "Messages",
      href: "/tutor/messages",
      icon: MessageSquare,
      active: true,
    },
    { title: "Announcements", href: "/tutor/announcements", icon: Bell },
    { title: "Resources", href: "/tutor/resources", icon: BookOpen },
  ]

  const conversations = [
    {
      name: "Student Name",
      role: "Form 4 · O-Level",
      message: "Sir, I need help with question 4.",
      time: "10:42 AM",
      unread: 2,
      initials: "SN",
    },
    {
      name: "Academy Administration",
      role: "GlobeDK Elite Academy",
      message: "Please submit this week's attendance.",
      time: "Yesterday",
      unread: 1,
      initials: "GA",
    },
    {
      name: "Student Two",
      role: "Form 3 · O-Level",
      message: "Thank you for the feedback.",
      time: "27 Aug",
      unread: 0,
      initials: "ST",
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
            Tutor Portal
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
              <p className="text-sm font-medium">Messages</p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Communicate with your students and academy
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
              <Link href="/tutor/profile">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">

          <section className="mb-8">
            <Badge className="mb-3">Communication Centre</Badge>

            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Messages
            </h1>

            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Communicate directly with students and GlobeDK Elite Academy.
            </p>
          </section>

          <div className="grid gap-6 lg:grid-cols-3">

            <Card>
              <CardHeader>
                <CardTitle>Conversations</CardTitle>

                <CardDescription>
                  Recent student and academy messages
                </CardDescription>

                <div className="relative pt-2">
                  <Search className="absolute left-3 top-5 h-4 w-4 text-muted-foreground" />

                  <Input
                    placeholder="Search conversations..."
                    className="pl-9"
                  />
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.name}
                    className="w-full rounded-lg border p-3 text-left transition hover:bg-muted/50"
                  >
                    <div className="flex gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {conversation.initials}
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold">
                            {conversation.name}
                          </p>

                          <span className="text-[10px] text-muted-foreground">
                            {conversation.time}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {conversation.role}
                        </p>

                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {conversation.message}
                        </p>

                        {conversation.unread > 0 && (
                          <Badge className="mt-2">
                            {conversation.unread} unread
                          </Badge>
                        )}

                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="flex min-h-[600px] flex-col lg:col-span-2">

              <CardHeader className="border-b">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <CardTitle className="text-base">
                      Student Name
                    </CardTitle>

                    <CardDescription>
                      Form 4 · O-Level
                    </CardDescription>
                  </div>

                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col justify-end p-4">

                <div className="space-y-5">

                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-primary-foreground">
                      <p className="text-sm">
                        Please complete the quadratic equations revision
                        before Saturday's lesson.
                      </p>

                      <div className="mt-2 flex items-center justify-end gap-1 text-[10px] opacity-70">
                        <span>10:38 AM</span>
                        <CheckCheck className="h-3 w-3" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                      SN
                    </div>

                    <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                      <p className="text-sm">
                        Sir, I am struggling with question 4. Can you
                        please explain it?
                      </p>

                      <p className="mt-2 text-[10px] text-muted-foreground">
                        10:42 AM
                      </p>
                    </div>
                  </div>

                </div>

                <div className="mt-6 border-t pt-4">
                  <div className="flex gap-2">

                    <Input
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Type your message..."
                    />

                    <Button size="icon">
                      <Send className="h-4 w-4" />
                    </Button>

                  </div>

                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Messages are visible to the selected student.
                  </p>
                </div>

              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </div>
  )
}