"use client"

import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  TrendingUp,
} from "lucide-react"

import Link from "next/link"

import {
  usePathname,
} from "next/navigation"

const navigation = [
  {
    name: "Dashboard",
    href: "/student",
    icon: LayoutDashboard,
  },
  {
    name: "My Subjects",
    href: "/student/subjects",
    icon: BookOpen,
  },
  {
    name: "My Lessons",
    href: "/student/lessons",
    icon: CalendarDays,
  },
  {
    name: "Assignments",
    href: "/student/assignments",
    icon: ClipboardCheck,
  },
  {
    name: "Resources",
    href: "/student/resources",
    icon: BookOpen,
  },
  {
    name: "My Progress",
    href: "/student/progress",
    icon: TrendingUp,
  },
  {
    name: "Messages",
    href: "/student/messages",
    icon: MessageSquare,
  },
  {
    name: "Profile & Settings",
    href: "/student/profile",
    icon: Settings,
  },
]

export function StudentSidebar() {
  const pathname =
    usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-background lg:block">

      <div className="flex h-full flex-col">

        {/* Brand */}
        <div className="border-b px-6 py-5">

          <Link
            href="/student"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <p className="font-bold">
                GlobeDK Elite
              </p>

              <p className="text-xs text-muted-foreground">
                Student Portal
              </p>
            </div>
          </Link>

        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">

          {navigation.map(
            (item) => {
              const Icon =
                item.icon

              const isActive =
                pathname ===
                  item.href ||
                (
                  item.href !==
                    "/student" &&
                  pathname.startsWith(
                    `${item.href}/`
                  )
                )

              return (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />

                  <span>
                    {
                      item.name
                    }
                  </span>
                </Link>
              )
            }
          )}

        </nav>

        {/* Logout */}
        <div className="border-t p-4">

          <form action="/api/auth/logout">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />

              Logout
            </button>
          </form>

        </div>

      </div>
    </aside>
  )
}