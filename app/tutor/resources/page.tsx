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
  Search,
  User,
  Users,
  Download,
  FolderOpen,
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

export default function TutorResourcesPage() {
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
    { title: "Announcements", href: "/tutor/announcements", icon: Bell },
    {
      title: "Resources",
      href: "/tutor/resources",
      icon: BookOpen,
      active: true,
    },
  ]

  const resources = [
    {
      title: "Algebra & Factorisation Notes",
      subject: "Mathematics",
      type: "PDF",
      category: "Notes",
      uploaded: "29 Aug 2026",
      downloads: 18,
    },
    {
      title: "Quadratic Equations Practice",
      subject: "Mathematics",
      type: "Worksheet",
      category: "Practice",
      uploaded: "28 Aug 2026",
      downloads: 15,
    },
    {
      title: "English Composition Guide",
      subject: "English Language",
      type: "PDF",
      category: "Notes",
      uploaded: "26 Aug 2026",
      downloads: 11,
    },
    {
      title: "ZIMSEC Mathematics Past Paper 2024",
      subject: "Mathematics",
      type: "Past Paper",
      category: "Examination",
      uploaded: "24 Aug 2026",
      downloads: 21,
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
              <p className="text-sm font-bold">
                GlobeDK Elite
              </p>

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
              <p className="text-sm font-semibold">
                Mr Daka
              </p>

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
              Resources
            </p>

            <p className="hidden text-xs text-muted-foreground sm:block">
              Teaching materials and learning resources
            </p>
          </div>

          <Button asChild size="sm">
            <Link href="/tutor/resources/new">
              <Plus className="mr-2 h-4 w-4" />
              Upload Resource
            </Link>
          </Button>

        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">

          <section className="mb-8">

            <Badge className="mb-3">
              Teaching Centre
            </Badge>

            <h1 className="text-2xl font-bold md:text-3xl">
              Learning Resources
            </h1>

            <p className="mt-2 text-muted-foreground">
              Manage notes, worksheets, past papers and other materials
              for your students.
            </p>

          </section>

          <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Card>
              <CardContent className="p-5">
                <FolderOpen className="h-5 w-5 text-primary" />

                <p className="mt-3 text-sm text-muted-foreground">
                  Total Resources
                </p>

                <p className="mt-1 text-3xl font-bold">
                  24
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <BookOpen className="h-5 w-5 text-primary" />

                <p className="mt-3 text-sm text-muted-foreground">
                  Notes
                </p>

                <p className="mt-1 text-3xl font-bold">
                  9
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <ClipboardList className="h-5 w-5 text-primary" />

                <p className="mt-3 text-sm text-muted-foreground">
                  Practice
                </p>

                <p className="mt-1 text-3xl font-bold">
                  8
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <FileText className="h-5 w-5 text-primary" />

                <p className="mt-3 text-sm text-muted-foreground">
                  Past Papers
                </p>

                <p className="mt-1 text-3xl font-bold">
                  7
                </p>
              </CardContent>
            </Card>

          </section>

          <Card>

            <CardHeader>

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                  <CardTitle>
                    My Resources
                  </CardTitle>

                  <CardDescription>
                    Resources available to your assigned students
                  </CardDescription>
                </div>

                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                  <Input
                    placeholder="Search resources..."
                    className="pl-9"
                  />
                </div>

              </div>

            </CardHeader>

            <CardContent className="space-y-3">

              {resources.map((resource) => (
                <div
                  key={resource.title}
                  className="flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center md:justify-between"
                >

                  <div className="flex gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>

                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-semibold">
                          {resource.title}
                        </h3>

                        <Badge variant="secondary">
                          {resource.type}
                        </Badge>

                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {resource.subject} · {resource.category}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Uploaded {resource.uploaded} ·{" "}
                        {resource.downloads} downloads
                      </p>

                    </div>

                  </div>

                  <div className="flex gap-2">

                    <Button variant="outline" size="sm">
                      View
                    </Button>

                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>

                  </div>

                </div>
              ))}

            </CardContent>
          </Card>

        </main>
      </div>
    </div>
  )
}