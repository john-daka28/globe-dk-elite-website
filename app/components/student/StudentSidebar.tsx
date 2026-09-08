
"use client"

import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  TrendingUp,
  X,
} from "lucide-react"

import Link from "next/link"

import {
  usePathname,
} from "next/navigation"

import {
  useState,
} from "react"

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
  const pathname = usePathname()

  const [mobileOpen, setMobileOpen] =
    useState(false)

  const isActive = (
    href: string
  ) => {
    return (
      pathname === href ||
      (
        href !== "/student" &&
        pathname.startsWith(
          `${href}/`
        )
      )
    )
  }

  return (
    <>
      {/* ====================================================== */}
      {/* MOBILE TOP BAR */}
      {/* ====================================================== */}

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:hidden">

        {/* Brand */}
        <Link
          href="/student"
          className="flex min-w-0 items-center gap-2.5"
          onClick={() =>
            setMobileOpen(false)
          }
        >

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">

            <GraduationCap className="h-5 w-5" />

          </div>

          <div className="min-w-0">

            <p className="truncate text-sm font-bold">
              GlobeDK Elite
            </p>

            <p className="truncate text-[11px] text-muted-foreground">
              Student Portal
            </p>

          </div>

        </Link>


        {/* Menu Button */}
        <button
          type="button"
          aria-label={
            mobileOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={
            mobileOpen
          }
          onClick={() =>
            setMobileOpen(
              !mobileOpen
            )
          }
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-background text-foreground transition hover:bg-muted active:scale-95"
        >

          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}

        </button>

      </header>


      {/* ====================================================== */}
      {/* MOBILE OVERLAY */}
      {/* ====================================================== */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() =>
            setMobileOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}


      {/* ====================================================== */}
      {/* MOBILE SIDEBAR / DRAWER */}
      {/* ====================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(20rem,85vw)] flex-col border-r bg-background shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* Mobile Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">

          <Link
            href="/student"
            className="flex items-center gap-3"
            onClick={() =>
              setMobileOpen(false)
            }
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


          {/* Close Button */}
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() =>
              setMobileOpen(false)
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >

            <X className="h-5 w-5" />

          </button>

        </div>


        {/* Mobile Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">

          {navigation.map(
            (item) => {
              const Icon =
                item.icon

              const active =
                isActive(
                  item.href
                )

              return (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  onClick={() =>
                    setMobileOpen(
                      false
                    )
                  }
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition active:scale-[0.99] ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >

                  <Icon className="h-5 w-5 shrink-0" />

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


        {/* Mobile Logout */}
        <div className="shrink-0 border-t p-4">

          <form
            action="/api/auth/logout"
            method="POST"
          >

            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive active:scale-[0.99]"
            >

              <LogOut className="h-5 w-5" />

              Logout

            </button>

          </form>

        </div>

      </aside>


      {/* ====================================================== */}
      {/* DESKTOP SIDEBAR */}
      {/* ====================================================== */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-background lg:block">

        <div className="flex h-full flex-col">

          {/* Brand */}
          <div className="shrink-0 border-b px-6 py-5">

            <Link
              href="/student"
              className="flex items-center gap-3"
            >

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">

                <GraduationCap className="h-5 w-5" />

              </div>

              <div className="min-w-0">

                <p className="truncate font-bold">
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

                const active =
                  isActive(
                    item.href
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
                      active
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
          <div className="shrink-0 border-t p-4">

            <form
              action="/api/auth/logout"
              method="POST"
            >

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
    </>
  )
}
