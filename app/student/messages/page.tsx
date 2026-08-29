"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
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
import { Input } from "@/components/ui/input"

const conversations = [
  {
    id: "mr-daka",
    name: "Mr Daka",
    role: "Mathematics Tutor",
    message: "Please remember to complete the algebra assignment.",
    time: "10:42 AM",
    unread: 2,
    initials: "MD",
  },
  {
    id: "mrs-moyo",
    name: "Mrs Moyo",
    role: "English Language Tutor",
    message: "Your composition has been marked.",
    time: "Yesterday",
    unread: 1,
    initials: "MM",
  },
  {
    id: "academy",
    name: "GlobeDK Elite Academy",
    role: "Academy Administration",
    message: "Reminder: Weekend lessons begin at 8:00 AM.",
    time: "27 Aug",
    unread: 0,
    initials: "GE",
  },
]

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
  },
  {
    title: "Attendance",
    href: "/student/attendance",
    icon: ClipboardCheck,
  },
  {
    title: "Performance",
    href: "/student/performance",
    icon: ClipboardCheck,
  },
  {
    title: "Assignments",
    href: "/student/assignments",
    icon: ClipboardCheck,
  },
  {
    title: "Tests & Exams",
    href: "/student/exams",
    icon: ClipboardCheck,
  },
  {
    title: "Messages",
    href: "/student/messages",
    icon: MessageSquare,
    active: true,
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

export default function StudentMessagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filteredConversations = useMemo(() => {
    const value = search.toLowerCase().trim()

    if (!value) return conversations

    return conversations.filter(
      (conversation) =>
        conversation.name.toLowerCase().includes(value) ||
        conversation.role.toLowerCase().includes(value) ||
        conversation.message.toLowerCase().includes(value)
    )
  }, [search])

  return (
    <div className="min-h-screen bg-muted/30">

      {/* Mobile sidebar overlay */}
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

        {/* Student profile */}
        <div className="border-b p-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                Student Name
              </p>

              <p className="text-xs text-muted-foreground">
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
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>

                  {item.title === "Messages" && (
                    <Badge
                      variant={item.active ? "secondary" : "default"}
                      className="ml-auto h-5 min-w-5 justify-center px-1.5 text-[10px]"
                    >
                      3
                    </Badge>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Bottom navigation */}
        <div className="border-t p-3">
          <Link
            href="/student/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <User className="h-4 w-4" />
            My Profile
          </Link>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
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
                Messages
              </p>

              <p className="hidden text-xs text-muted-foreground sm:block">
                Communicate with your tutors and academy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/student/announcements">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/student/profile">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">

          {/* Page heading */}
          <section className="mb-6">
            <Badge className="mb-3">
              Communication Centre
            </Badge>

            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Messages
            </h1>

            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Communicate directly with your tutors and GlobeDK Elite
              Academy.
            </p>
          </section>

          {/* Conversations */}
          <Card className="overflow-hidden">

            <CardHeader className="border-b">
              <CardTitle>
                Conversations
              </CardTitle>

              <CardDescription>
                Select a conversation to view your messages.
              </CardDescription>

              <div className="relative pt-2">
                <Search className="absolute left-3 top-5 h-4 w-4 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tutors or messages..."
                  className="pl-9"
                />
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {filteredConversations.length > 0 ? (
                <div className="divide-y">
                  {filteredConversations.map((conversation) => (
                    <Link
                      key={conversation.id}
                      href={`/student/messages/${conversation.id}`}
                      className="group flex items-center gap-3 p-4 transition-colors hover:bg-muted/50 md:p-5"
                    >
                      {/* Avatar */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {conversation.initials}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-sm font-semibold">
                            {conversation.name}
                          </p>

                          <span className="shrink-0 text-[10px] text-muted-foreground">
                            {conversation.time}
                          </span>
                        </div>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {conversation.role}
                        </p>

                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {conversation.message}
                        </p>
                      </div>

                      {/* Unread */}
                      <div className="flex shrink-0 items-center gap-2">
                        {conversation.unread > 0 && (
                          <Badge className="h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px]">
                            {conversation.unread}
                          </Badge>
                        )}

                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-16 text-center">
                  <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground" />

                  <h3 className="mt-4 font-semibold">
                    No conversations found
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Try searching for a tutor or message.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Communication notice */}
          <Card className="mt-6 border-primary/20 bg-primary/5">
            <CardContent className="flex gap-3 p-4">
              <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div>
                <p className="text-sm font-medium">
                  Need help with your studies?
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Send a message to your subject tutor if you need
                  clarification, feedback or academic assistance.
                </p>
              </div>
            </CardContent>
          </Card>

        </main>
      </div>
    </div>
  )
}