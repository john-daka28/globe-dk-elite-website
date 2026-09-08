"use client"

import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"

type TutorSidebarProps = {
  tutorName?: string
}

const navigation = [
  {
    label: "Dashboard",
    href: "/tutor",
    icon: LayoutDashboard,
  },
  {
    label: "My Students",
    href: "/tutor/students",
    icon: Users,
  },
  {
    label: "My Subjects",
    href: "/tutor/subjects",
    icon: BookOpen,
  },
  {
    label: "Lessons & Schedule",
    href: "/tutor/lessons",
    icon: CalendarDays,
  },
  {
    label: "Assignments",
    href: "/tutor/assignments",
    icon: ClipboardCheck,
  },
  {
    label: "Resources",
    href: "/tutor/resources",
    icon: FileText,
  },
  {
    label: "Attendance",
    href: "/tutor/attendance",
    icon: ClipboardCheck,
  },
  {
    label: "Progress & Reports",
    href: "/tutor/reports",
    icon: BarChart3,
  },
  {
    label: "Messages",
    href: "/tutor/messages",
    icon: MessageSquare,
  },
]

export default function TutorSidebar({
  tutorName,
}: TutorSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/tutor") {
      return pathname === "/tutor"
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    )
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-background lg:flex lg:flex-col">
      {/* Brand */}
      <div className="flex h-16 items-center border-b px-5">
        <Link
          href="/tutor"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold">
              GlobeDK Elite
            </p>

            <p className="text-xs text-muted-foreground">
              Tutor Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Tutor information */}
      <div className="border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
            {tutorName
              ? tutorName
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "T"}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {tutorName || "Tutor"}
            </p>

            <p className="text-xs text-muted-foreground">
              Tutor
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />

                <span>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Account section */}
        <div className="mt-6 border-t pt-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Account
          </p>

          <Link
            href="/tutor/profile"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive("/tutor/profile")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Settings className="h-4 w-4" />

            <span>Profile & Settings</span>
          </Link>
        </div>
      </nav>

      {/* Logout */}
      <div className="border-t p-3">
        <form
          action="/api/auth/logout"
          method="POST"
        >
          <Button
            variant="ghost"
            type="submit"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />

            Logout
          </Button>
        </form>
      </div>
    </aside>
  )
}