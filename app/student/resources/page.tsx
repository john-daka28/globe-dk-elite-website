"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
Bell,
BookOpen,
CalendarDays,
ClipboardCheck,
Download,
FileText,
Filter,
GraduationCap,
LayoutDashboard,
LogOut,
Menu,
MessageSquare,
PlayCircle,
Search,
User,
Video,
X,
ChevronRight,
FolderOpen,
Clock3,
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

type Resource = {
id: number
title: string
description: string
subject: string
type: "Notes" | "Past Paper" | "Worksheet" | "Video" | "Revision"
size?: string
date: string
author: string
featured?: boolean
}

export default function StudentResourcesPage() {
const [sidebarOpen, setSidebarOpen] = useState(false)
const [search, setSearch] = useState("")
const [selectedSubject, setSelectedSubject] = useState("All")
const [selectedType, setSelectedType] = useState("All")

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
},
{
title: "Announcements",
href: "/student/announcements",
icon: Bell,
},
{
title: "Resources",
href: "/student/resources",
icon: FolderOpen,
active: true,
},
]

const resources: Resource[] = [
{
id: 1,
title: "Algebra & Factorisation Notes",
description:
"Complete revision notes covering expansion, factorisation and solving quadratic equations.",
subject: "Mathematics",
type: "Notes",
size: "2.4 MB",
date: "29 Aug 2026",
author: "Mr Daka",
featured: true,
},
{
id: 2,
title: "ZIMSEC Mathematics Paper 1 — 2025",
description:
"Past examination paper for timed examination practice.",
subject: "Mathematics",
type: "Past Paper",
size: "1.8 MB",
date: "28 Aug 2026",
author: "GlobeDK Elite Academy",
},
{
id: 3,
title: "Tense Consistency Practice",
description:
"Practice exercises on maintaining consistent verb tenses in sentences and paragraphs.",
subject: "English",
type: "Worksheet",
size: "740 KB",
date: "27 Aug 2026",
author: "Mrs Moyo",
},
{
id: 4,
title: "English Composition Revision Guide",
description:
"A guide to narrative, descriptive, argumentative, expository and discursive compositions.",
subject: "English",
type: "Revision",
size: "1.2 MB",
date: "26 Aug 2026",
author: "Mrs Moyo",
featured: true,
},
{
id: 5,
title: "Introduction to Programming",
description:
"Video lesson introducing programming concepts and problem-solving techniques.",
subject: "Computer Science",
type: "Video",
date: "25 Aug 2026",
author: "Mr Daka",
},
{
id: 6,
title: "Statistics Revision Questions",
description:
"Selected questions covering measures of central tendency and data representation.",
subject: "Statistics",
type: "Worksheet",
size: "920 KB",
date: "24 Aug 2026",
author: "GlobeDK Elite Academy",
},
{
id: 7,
title: "Geography Map Skills",
description:
"Revision material covering map reading, scale, direction and interpretation.",
subject: "Geography",
type: "Notes",
size: "1.5 MB",
date: "22 Aug 2026",
author: "GlobeDK Elite Academy",
},
{
id: 8,
title: "Science Examination Revision Pack",
description:
"Selected examination-style questions for final revision.",
subject: "Combined Science",
type: "Revision",
size: "3.1 MB",
date: "20 Aug 2026",
author: "GlobeDK Elite Academy",
},
]

const subjects = [
"All",
...Array.from(new Set(resources.map((resource) => resource.subject))),
]

const types = [
"All",
"Notes",
"Past Paper",
"Worksheet",
"Video",
"Revision",
]

const filteredResources = useMemo(() => {
return resources.filter((resource) => {
const matchesSearch =
resource.title.toLowerCase().includes(search.toLowerCase()) ||
resource.description.toLowerCase().includes(search.toLowerCase()) ||
resource.subject.toLowerCase().includes(search.toLowerCase())


  const matchesSubject =
    selectedSubject === "All" ||
    resource.subject === selectedSubject

  const matchesType =
    selectedType === "All" ||
    resource.type === selectedType

  return matchesSearch && matchesSubject && matchesType
})


}, [search, selectedSubject, selectedType])

const getResourceIcon = (type: Resource["type"]) => {
switch (type) {
case "Video":
return Video
case "Past Paper":
return FileText
case "Worksheet":
return ClipboardCheck
case "Revision":
return BookOpen
default:
return FileText
}
}

return ( <div className="min-h-screen bg-muted/30">

```
  {/* Mobile overlay */}
  {sidebarOpen && (
    <div
      className="fixed inset-0 z-40 bg-black/50 lg:hidden"
      onClick={() => setSidebarOpen(false)}
    />
  )}

  {/* Sidebar */}
  <aside
    className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform ${
      sidebarOpen
        ? "translate-x-0"
        : "-translate-x-full lg:translate-x-0"
    }`}
  >

    {/* Logo */}
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

    {/* Student */}
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

    {/* Bottom */}
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
            Resources
          </p>

          <p className="hidden text-xs text-muted-foreground sm:block">
            Learning materials from your academy and tutors
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

    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">

      {/* Page heading */}
      <section className="mb-8">

        <Badge className="mb-3">
          Learning Centre
        </Badge>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Learning Resources
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
              Access notes, worksheets, past examination papers,
              revision guides and other materials provided by
              GlobeDK Elite Academy.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FolderOpen className="h-4 w-4" />
            {filteredResources.length} resources
          </div>

        </div>
      </section>

      {/* Featured resources */}
      <section className="mb-8">

        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Recommended for You
          </h2>

          <p className="text-sm text-muted-foreground">
            Materials selected to support your current studies.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">

          {resources
            .filter((resource) => resource.featured)
            .map((resource) => {
              const Icon = getResourceIcon(resource.type)

              return (
                <Card
                  key={resource.id}
                  className="border-primary/20"
                >
                  <CardContent className="p-5">

                    <div className="flex gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">
                            {resource.subject}
                          </Badge>

                          <Badge variant="outline">
                            {resource.type}
                          </Badge>
                        </div>

                        <h3 className="mt-3 font-semibold">
                          {resource.title}
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {resource.description}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{resource.author}</span>
                            <span>•</span>
                            <span>{resource.date}</span>
                          </div>

                          <Button size="sm">
                            {resource.type === "Video" ? (
                              <>
                                <PlayCircle className="mr-2 h-4 w-4" />
                                Watch
                              </>
                            ) : (
                              <>
                                <Download className="mr-2 h-4 w-4" />
                                Open
                              </>
                            )}
                          </Button>

                        </div>

                      </div>

                    </div>

                  </CardContent>
                </Card>
              )
            })}

        </div>
      </section>

      {/* Search and filters */}
      <Card className="mb-6">

        <CardContent className="p-4">

          <div className="flex flex-col gap-4 lg:flex-row">

            {/* Search */}
            <div className="relative flex-1">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search resources, subjects or topics..."
                className="pl-9"
              />

            </div>

            {/* Subject */}
            <div className="flex items-center gap-2">

              <Filter className="h-4 w-4 text-muted-foreground" />

              <select
                value={selectedSubject}
                onChange={(event) =>
                  setSelectedSubject(event.target.value)
                }
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>

            </div>

            {/* Type */}
            <select
              value={selectedType}
              onChange={(event) =>
                setSelectedType(event.target.value)
              }
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type === "All"
                    ? "All resource types"
                    : type}
                </option>
              ))}
            </select>

          </div>

        </CardContent>
      </Card>

      {/* Resource library */}
      <section>

        <div className="mb-4 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold">
              Resource Library
            </h2>

            <p className="text-sm text-muted-foreground">
              Browse materials available to you.
            </p>
          </div>

        </div>

        {filteredResources.length === 0 ? (

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">

              <Search className="h-10 w-10 text-muted-foreground" />

              <h3 className="mt-4 font-semibold">
                No resources found
              </h3>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Try changing your search or selecting a different
                subject or resource type.
              </p>

              <Button
                variant="outline"
                className="mt-5"
                onClick={() => {
                  setSearch("")
                  setSelectedSubject("All")
                  setSelectedType("All")
                }}
              >
                Clear Filters
              </Button>

            </CardContent>
          </Card>

        ) : (

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

            {filteredResources.map((resource) => {
              const Icon = getResourceIcon(resource.type)

              return (
                <Card
                  key={resource.id}
                  className="group transition hover:border-primary/40 hover:shadow-sm"
                >

                  <CardHeader>

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>

                      <Badge variant="secondary">
                        {resource.type}
                      </Badge>

                    </div>

                    <CardTitle className="pt-2 text-base">
                      {resource.title}
                    </CardTitle>

                    <CardDescription>
                      {resource.description}
                    </CardDescription>

                  </CardHeader>

                  <CardContent>

                    <div className="mb-4 flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {resource.subject}
                      </Badge>

                      {resource.size && (
                        <span className="text-xs text-muted-foreground">
                          {resource.size}
                        </span>
                      )}
                    </div>

                    <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">

                      <span>
                        {resource.author}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock3 className="h-3 w-3" />
                        {resource.date}
                      </span>

                    </div>

                    <Button
                      className="w-full"
                      variant="outline"
                    >
                      {resource.type === "Video" ? (
                        <>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Watch Resource
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Open Resource
                        </>
                      )}

                      <ChevronRight className="ml-auto h-4 w-4" />
                    </Button>

                  </CardContent>
                </Card>
              )
            })}

          </div>

        )}

      </section>

      {/* Help section */}
      <section className="mt-8">

        <Card className="border-primary/20 bg-primary/5">

          <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">

            <div className="flex gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-background">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h3 className="font-semibold">
                  Need a specific resource?
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Ask your tutor for notes, revision material or
                  additional practice questions.
                </p>
              </div>

            </div>

            <Button asChild>
              <Link href="/student/messages">
                Message a Tutor
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

          </CardContent>

        </Card>

      </section>

    </main>
  </div>
</div>


)
}
