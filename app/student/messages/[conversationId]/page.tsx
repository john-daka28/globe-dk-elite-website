"use client"

import Link from "next/link"
import { use, useState } from "react"
import {
  ArrowLeft,
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
  Paperclip,
  Send,
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

type Conversation = {
  id: string
  name: string
  role: string
  initials: string
}

const conversations: Conversation[] = [
  {
    id: "mr-daka",
    name: "Mr Daka",
    role: "Mathematics Tutor",
    initials: "MD",
  },
  {
    id: "mrs-moyo",
    name: "Mrs Moyo",
    role: "English Language Tutor",
    initials: "MM",
  },
  {
    id: "academy",
    name: "GlobeDK Elite Academy",
    role: "Academy Administration",
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

export default function StudentConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>
}) {
  const { conversationId } = use(params)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [message, setMessage] = useState("")

  const conversation =
    conversations.find(
      (item) => item.id === conversationId
    ) ?? conversations[0]

  const handleSend = () => {
    if (!message.trim()) return

    // Later connect this to Supabase/API.
    console.log("Sending message:", message)

    setMessage("")
  }

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

        {/* Bottom */}
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

          <div className="flex min-w-0 items-center gap-2">

            {/* Mobile menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Back to conversations */}
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href="/student/messages">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>

            {/* Tutor */}
            <div className="flex min-w-0 items-center gap-2">
              <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary sm:flex">
                {conversation.initials}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {conversation.name}
                </p>

                <p className="truncate text-[11px] text-muted-foreground">
                  {conversation.role}
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
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
              <Link href="/student/profile">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </header>

        {/* Chat */}
        <main className="mx-auto flex max-w-5xl flex-col px-3 py-4 md:px-6 md:py-6">

          <Card className="flex min-h-[calc(100vh-7rem)] flex-col overflow-hidden">

            {/* Chat header */}
            <CardHeader className="border-b px-4 py-4 md:px-6">
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {conversation.initials}
                </div>

                <div className="min-w-0">
                  <CardTitle className="truncate text-base">
                    {conversation.name}
                  </CardTitle>

                  <CardDescription className="truncate">
                    {conversation.role}
                  </CardDescription>
                </div>

              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex flex-1 flex-col justify-end overflow-y-auto p-4 md:p-6">

              <div className="space-y-5">

                {/* Tutor */}
                <div className="flex gap-2 md:gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                    {conversation.initials}
                  </div>

                  <div className="max-w-[85%] sm:max-w-[75%]">
                    <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                      <p className="text-sm leading-relaxed">
                        Hello. Please remember to complete the Algebra
                        & Factorisation assignment before Sunday.
                      </p>
                    </div>

                    <p className="mt-1 px-1 text-[10px] text-muted-foreground">
                      10:38 AM
                    </p>
                  </div>
                </div>

                {/* Student */}
                <div className="flex justify-end">

                  <div className="max-w-[85%] sm:max-w-[75%]">
                    <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-primary-foreground">
                      <p className="text-sm leading-relaxed">
                        Okay sir. I will complete it before the deadline.
                      </p>

                      <div className="mt-2 flex items-center justify-end gap-1 text-[10px] opacity-70">
                        <span>10:40 AM</span>
                        <CheckCheck className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tutor */}
                <div className="flex gap-2 md:gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                    {conversation.initials}
                  </div>

                  <div className="max-w-[85%] sm:max-w-[75%]">
                    <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                      <p className="text-sm leading-relaxed">
                        Good. If you get stuck on any question, send me
                        a message or upload the question for assistance.
                      </p>
                    </div>

                    <p className="mt-1 px-1 text-[10px] text-muted-foreground">
                      10:42 AM
                    </p>
                  </div>
                </div>

              </div>
            </CardContent>

            {/* Composer */}
            <div className="border-t bg-background p-3 md:p-4">

              <div className="flex items-end gap-2">

                <Button
                  variant="outline"
                  size="icon"
                  className="hidden shrink-0 sm:flex"
                  title="Attach file"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>

                <Input
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="Type your message..."
                  className="h-10"
                />

                <Button
                  size="icon"
                  className="shrink-0"
                  onClick={handleSend}
                  disabled={!message.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>

              </div>

              <p className="mt-2 hidden text-[11px] text-muted-foreground sm:block">
                Messages are visible to the selected tutor or academy
                staff member.
              </p>

            </div>

          </Card>

        </main>
      </div>
    </div>
  )
}