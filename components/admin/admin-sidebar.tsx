"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  Brain,
  Database,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
  UserCog,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"

const navigation = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: Users,
  },
  {
    title: "Tutors",
    href: "/admin/tutors",
    icon: UserCog,
  },
  {
    title: "Examination Dataset",
    href: "/admin/datasets",
    icon: Database,
  },
  {
    title: "AI Analysis",
    href: "/admin/ai-analysis",
    icon: Brain,
  },
  {
    title: "Questions",
    href: "/admin/questions",
    icon: FileText,
  },
  {
    title: "Subjects",
    href: "/admin/subjects",
    icon: BookOpen,
  },
]

const bottomNavigation = [
  {
    title: "Reports & Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center w-full"
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                GlobeDK Elite
              </p>

              <p className="text-xs text-muted-foreground">
                Administration
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Admin badge */}
      {!collapsed && (
        <div className="px-4 pt-5">
          <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2">
            <ShieldCheck className="h-4 w-4 text-primary" />

            <div>
              <p className="text-xs font-semibold">
                Admin Portal
              </p>

              <p className="text-[11px] text-muted-foreground">
                System Administrator
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p
          className={cn(
            "mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
            collapsed && "text-center px-0"
          )}
        >
          {collapsed ? "•••" : "Management"}
        </p>

        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon

            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.title : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />

                {!collapsed && (
                  <span className="truncate">
                    {item.title}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        <div className="my-5 border-t" />

        <p
          className={cn(
            "mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
            collapsed && "text-center px-0"
          )}
        >
          {collapsed ? "•••" : "System"}
        </p>

        <div className="space-y-1">
          {bottomNavigation.map((item) => {
            const Icon = item.icon

            const isActive = pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.title : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />

                {!collapsed && (
                  <span className="truncate">
                    {item.title}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t p-3">
        {!collapsed && (
          <div className="mb-3 rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">
              GlobeDK Elite Academy
            </p>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Excellence in Education. Success for Life.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex w-full items-center justify-center rounded-lg border py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            collapsed && "px-2"
          )}
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="mr-2 h-4 w-4" />
              <span className="text-xs">
                Collapse sidebar
              </span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}