"use client"

import Link from "next/link"
import { useState } from "react"
import {
Award,
Bell,
BookOpen,
CalendarDays,
CheckCircle2,
ChevronRight,
ClipboardCheck,
GraduationCap,
LayoutDashboard,
LogOut,
Mail,
MapPin,
Menu,
MessageSquare,
Phone,
ShieldCheck,
Target,
User,
UserRound,
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
import { Label } from "@/components/ui/label"

export default function StudentProfilePage() {
const [sidebarOpen, setSidebarOpen] = useState(false)
const [editing, setEditing] = useState(false)

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
icon: Target,
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
icon: BookOpen,
},
]

const subjects = [
{
name: "Mathematics",
teacher: "Mr Daka",
status: "Active",
},
{
name: "English Language",
teacher: "Mrs Moyo",
status: "Active",
},
{
name: "Computer Science",
teacher: "Mr Daka",
status: "Active",
},
{
name: "Combined Science",
teacher: "Mrs Moyo",
status: "Active",
},
]

return ( <div className="min-h-screen bg-muted/30">


  {/* Mobile sidebar overlay */}
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

    {/* Student mini profile */}
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
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}

      </div>

    </nav>

    {/* Bottom navigation */}
    <div className="border-t p-3">

      <Link
        href="/student/profile"
        className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2.5 text-sm text-primary-foreground"
      >
        <User className="h-4 w-4" />
        My Profile
      </Link>

      <button className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted">
        <LogOut className="h-4 w-4" />
        Logout
      </button>

    </div>

  </aside>

  {/* Main content */}
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
            My Profile
          </p>

          <p className="hidden text-xs text-muted-foreground sm:block">
            Your student account and academic information
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

        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>

      </div>

    </header>

    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">

      {/* Page heading */}
      <section className="mb-8">

        <Badge className="mb-3">
          Student Account
        </Badge>

        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          View and manage your personal and academic information at
          GlobeDK Elite Academy.
        </p>

      </section>

      {/* Profile hero */}
      <Card className="mb-6 overflow-hidden">

        <div className="h-24 bg-primary/10" />

        <CardContent className="relative px-5 pb-6 md:px-8">

          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary/10">
                <UserRound className="h-10 w-10 text-primary" />
              </div>

              <div className="pb-1">

                <div className="flex flex-wrap items-center gap-2">

                  <h2 className="text-xl font-bold">
                    Student Name
                  </h2>

                  <Badge variant="secondary">
                    Active Student
                  </Badge>

                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  Form 4 · O-Level · GlobeDK Elite Academy
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Student ID: GDK-2026-001
                </p>

              </div>

            </div>

            <Button
              variant={editing ? "default" : "outline"}
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Save Changes" : "Edit Profile"}
            </Button>

          </div>

        </CardContent>

      </Card>

      {/* Overview statistics */}
      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Card>
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-muted-foreground">
                  Attendance
                </p>

                <p className="mt-2 text-2xl font-bold">
                  94%
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Excellent attendance
                </p>
              </div>

              <CheckCircle2 className="h-6 w-6 text-primary" />

            </div>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-muted-foreground">
                  Average Performance
                </p>

                <p className="mt-2 text-2xl font-bold">
                  78%
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Current academic average
                </p>
              </div>

              <Target className="h-6 w-6 text-primary" />

            </div>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-muted-foreground">
                  Subjects
                </p>

                <p className="mt-2 text-2xl font-bold">
                  4
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Currently enrolled
                </p>
              </div>

              <BookOpen className="h-6 w-6 text-primary" />

            </div>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-muted-foreground">
                  Academic Year
                </p>

                <p className="mt-2 text-2xl font-bold">
                  2026
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Current school year
                </p>
              </div>

              <Award className="h-6 w-6 text-primary" />

            </div>

          </CardContent>
        </Card>

      </section>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Personal information */}
        <Card className="lg:col-span-2">

          <CardHeader>
            <CardTitle>Personal Information</CardTitle>

            <CardDescription>
              Your basic student information.
            </CardDescription>
          </CardHeader>

          <CardContent>

            <div className="grid gap-5 sm:grid-cols-2">

              <div className="space-y-2">
                <Label>Full Name</Label>

                <Input
                  value="Student Name"
                  readOnly={!editing}
                  className={!editing ? "bg-muted/30" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label>Student ID</Label>

                <Input
                  value="GDK-2026-001"
                  readOnly
                  className="bg-muted/30"
                />
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    value="student@example.com"
                    readOnly={!editing}
                    className={`pl-9 ${
                      !editing ? "bg-muted/30" : ""
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    value="+263 7XX XXX XXX"
                    readOnly={!editing}
                    className={`pl-9 ${
                      !editing ? "bg-muted/30" : ""
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label>Address</Label>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    value="Harare, Zimbabwe"
                    readOnly={!editing}
                    className={`pl-9 ${
                      !editing ? "bg-muted/30" : ""
                    }`}
                  />
                </div>
              </div>

            </div>

            {editing && (
              <div className="mt-5 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>

                <Button
                  onClick={() => setEditing(false)}
                >
                  Save Changes
                </Button>
              </div>
            )}

          </CardContent>

        </Card>

        {/* Academic information */}
        <Card>

          <CardHeader>
            <CardTitle>Academic Details</CardTitle>

            <CardDescription>
              Your current academy placement.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

            <div className="rounded-lg border p-4">

              <p className="text-xs text-muted-foreground">
                Level
              </p>

              <p className="mt-1 font-semibold">
                O-Level
              </p>

            </div>

            <div className="rounded-lg border p-4">

              <p className="text-xs text-muted-foreground">
                Form
              </p>

              <p className="mt-1 font-semibold">
                Form 4
              </p>

            </div>

            <div className="rounded-lg border p-4">

              <p className="text-xs text-muted-foreground">
                Curriculum
              </p>

              <p className="mt-1 font-semibold">
                ZIMSEC
              </p>

            </div>

            <div className="rounded-lg border p-4">

              <p className="text-xs text-muted-foreground">
                Academic Year
              </p>

              <p className="mt-1 font-semibold">
                2026
              </p>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* Subjects */}
      <section className="mt-6">

        <Card>

          <CardHeader>

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

              <div>
                <CardTitle>My Subjects</CardTitle>

                <CardDescription>
                  Subjects you are currently studying at the academy.
                </CardDescription>
              </div>

              <Button variant="outline" asChild>
                <Link href="/student/subjects">
                  View All Subjects
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

            </div>

          </CardHeader>

          <CardContent>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              {subjects.map((subject) => (

                <div
                  key={subject.name}
                  className="rounded-lg border p-4"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>

                    <Badge
                      variant="secondary"
                      className="text-[10px]"
                    >
                      {subject.status}
                    </Badge>

                  </div>

                  <p className="mt-4 font-semibold">
                    {subject.name}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {subject.teacher}
                  </p>

                </div>

              ))}

            </div>

          </CardContent>

        </Card>

      </section>

      {/* Tutor / academy contact */}
      <section className="mt-6 grid gap-6 md:grid-cols-2">

        <Card>

          <CardHeader>

            <CardTitle>My Academic Support</CardTitle>

            <CardDescription>
              Get help from your tutors when you need it.
            </CardDescription>

          </CardHeader>

          <CardContent>

            <div className="rounded-xl bg-primary/5 p-5">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>

                <div>

                  <p className="font-semibold">
                    Your Tutors & Academy Team
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Contact your tutors about assignments, difficult
                    topics, academic progress or anything affecting
                    your studies.
                  </p>

                  <Button
                    className="mt-4"
                    asChild
                  >
                    <Link href="/student/messages">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message a Tutor
                    </Link>
                  </Button>

                </div>

              </div>

            </div>

          </CardContent>

        </Card>

        {/* Account security */}
        <Card>

          <CardHeader>

            <CardTitle>Account & Security</CardTitle>

            <CardDescription>
              Keep your student account secure.
            </CardDescription>

          </CardHeader>

          <CardContent className="space-y-3">

            <div className="flex items-center justify-between rounded-lg border p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Password
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Last updated recently
                  </p>
                </div>

              </div>

              <Button variant="outline" size="sm">
                Change
              </Button>

            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Bell className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Notifications
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Academy updates enabled
                  </p>
                </div>

              </div>

              <Button variant="outline" size="sm">
                Manage
              </Button>

            </div>

          </CardContent>

        </Card>

      </section>

      {/* Account notice */}
      <section className="mt-6">

        <Card className="border-primary/20 bg-primary/5">

          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>

              <div>
                <p className="font-medium">
                  Your academic information is protected
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your student records, performance and communication
                  are only available to authorised academy staff and
                  your account.
                </p>
              </div>

            </div>

            <Button variant="outline" asChild>
              <Link href="/student/dashboard">
                Back to Dashboard
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
