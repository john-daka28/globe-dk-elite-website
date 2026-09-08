
"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  GraduationCap,
  LayoutDashboard,
  Link2,
  Loader2,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Send,
  User,
  Users,
  X,
  ChevronRight,
  Clock,
  AlertCircle,
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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Student = {
  id: string
  email: string
  firstName: string
  lastName: string
  level: string
  school: string
  phone?: string | null
  attendance: number | null
  average: number | null
  status: string
  assignedAt: string
}

type Invitation = {
  id: string
  email: string
  expiresAt: string
  createdAt: string
  status: "pending" | "expired" | "accepted"
}

export default function TutorStudentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [search, setSearch] = useState("")

  const [students, setStudents] = useState<Student[]>([])

  const [invitations, setInvitations] = useState<Invitation[]>([])

  const [loading, setLoading] = useState(true)

  const [addingStudent, setAddingStudent] = useState(false)

  const [resending, setResending] = useState<string | null>(null)

  const [copying, setCopying] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)

  const [email, setEmail] = useState("")

  const [message, setMessage] = useState("")

  const [error, setError] = useState("")

  const navigation = [
    {
      title: "Dashboard",
      href: "/tutor/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Students",
      href: "/tutor/students",
      icon: Users,
      active: true,
    },
    {
      title: "My Subjects",
      href: "/tutor/subjects",
      icon: BookOpen,
    },
    {
      title: "Timetable",
      href: "/tutor/timetable",
      icon: CalendarDays,
    },
    {
      title: "Attendance",
      href: "/tutor/attendance",
      icon: ClipboardCheck,
    },
    {
      title: "Assignments",
      href: "/tutor/assignments",
      icon: ClipboardCheck,
    },
    {
      title: "Assessments",
      href: "/tutor/exams",
      icon: ClipboardCheck,
    },
    {
      title: "Messages",
      href: "/tutor/messages",
      icon: MessageSquare,
    },
    {
      title: "Announcements",
      href: "/tutor/announcements",
      icon: Bell,
    },
    {
      title: "Resources",
      href: "/tutor/resources",
      icon: BookOpen,
    },
  ]

  // ============================================================
  // LOAD STUDENTS
  // ============================================================

  async function loadStudents() {
    try {
      setLoading(true)
      setError("")

      const response = await fetch("/api/tutor/students", {
        method: "GET",
        cache: "no-store",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load students."
        )
      }

      setStudents(data.students || [])
      setInvitations(data.invitations || [])
    } catch (error) {
      console.error("LOAD STUDENTS ERROR:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load students."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  // ============================================================
  // ADD / INVITE STUDENT
  // ============================================================

  async function handleAddStudent() {
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      setError("Please enter the student's email address.")
      return
    }

    setAddingStudent(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch(
        "/api/tutor/students/invite",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: normalizedEmail,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to add or invite this student."
        )
      }

      setMessage(data.message)

      setEmail("")

      setDialogOpen(false)

      await loadStudents()
    } catch (error) {
      console.error("ADD STUDENT ERROR:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Unable to add student."
      )
    } finally {
      setAddingStudent(false)
    }
  }

  // ============================================================
  // RESEND INVITATION
  // ============================================================

  async function resendInvitation(invitationId: string) {
    try {
      setResending(invitationId)
      setError("")
      setMessage("")

      const response = await fetch(
        "/api/tutor/students/invite",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            invitationId,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to resend invitation."
        )
      }

      setMessage(data.message)

      await loadStudents()
    } catch (error) {
      console.error("RESEND INVITATION ERROR:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Unable to resend invitation."
      )
    } finally {
      setResending(null)
    }
  }

  // ============================================================
  // COPY INVITATION LINK
  // ============================================================

  async function copyInvitationLink(
    invitationId: string
  ) {
    try {
      setCopying(invitationId)

      const response = await fetch(
        `/api/tutor/students/invite/${invitationId}`,
        {
          method: "GET",
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to generate invitation link."
        )
      }

      await navigator.clipboard.writeText(
        data.inviteUrl
      )

      setMessage(
        "Invitation link copied to your clipboard."
      )
    } catch (error) {
      console.error("COPY INVITATION ERROR:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Unable to copy invitation link."
      )
    } finally {
      setCopying(null)
    }
  }

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return students
    }

    return students.filter((student) => {
      const searchableText = [
        student.firstName,
        student.lastName,
        student.email,
        student.level,
        student.school,
      ]
        .join(" ")
        .toLowerCase()

      return searchableText.includes(query)
    })
  }, [students, search])

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalStudents = students.length

  const studentsWithPerformance = students.filter(
    (student) =>
      typeof student.average === "number"
  )

  const averagePerformance =
    studentsWithPerformance.length > 0
      ? Math.round(
          studentsWithPerformance.reduce(
            (sum, student) =>
              sum + (student.average || 0),
            0
          ) /
            studentsWithPerformance.length
        )
      : null

  const studentsWithAttendance = students.filter(
    (student) =>
      typeof student.attendance === "number"
  )

  const averageAttendance =
    studentsWithAttendance.length > 0
      ? Math.round(
          studentsWithAttendance.reduce(
            (sum, student) =>
              sum + (student.attendance || 0),
            0
          ) /
            studentsWithAttendance.length
        )
      : null

  const needingSupport = students.filter(
    (student) =>
      student.status === "Needs Support"
  ).length

  const pendingInvitations = invitations.filter(
    (invitation) =>
      invitation.status === "pending"
  )

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-muted/30">

      {/* ========================================================
          MOBILE OVERLAY
      ======================================================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ========================================================
          SIDEBAR
      ======================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >

        {/* Logo */}

        <div className="flex h-16 items-center justify-between border-b px-5">

          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >

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

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>

        </div>

        {/* Tutor */}

        <div className="border-b p-4">

          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-semibold">
                Mr Daka
              </p>

              <p className="truncate text-xs text-muted-foreground">
                Tutor
              </p>

            </div>

          </div>

        </div>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto p-3">

          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Teaching Centre
          </p>

          <div className="space-y-1">

            {navigation.map((item) => {

              const Icon = item.icon

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() =>
                    setSidebarOpen(false)
                  }
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

        {/* Bottom navigation */}

        <div className="border-t p-3">

          <Link
            href="/tutor/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"
          >

            <User className="h-4 w-4" />

            My Profile

          </Link>

          <Link
            href="/tutor/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"
          >

            <ClipboardCheck className="h-4 w-4" />

            Settings

          </Link>

          <button
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"
          >

            <LogOut className="h-4 w-4" />

            Logout

          </button>

        </div>

      </aside>

      {/* ========================================================
          MAIN
      ======================================================== */}

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
                My Students
              </p>

              <p className="hidden text-xs text-muted-foreground sm:block">
                Manage and monitor your assigned students
              </p>

            </div>

          </div>

          <div className="flex items-center gap-1">

            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href="/tutor/announcements">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href="/tutor/messages">
                <MessageSquare className="h-5 w-5" />
              </Link>
            </Button>

          </div>

        </header>

        {/* Main content */}

        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">

          {/* ====================================================
              PAGE HEADER
          ==================================================== */}

          <section className="mb-8">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div>

                <Badge className="mb-3">
                  Student Management
                </Badge>

                <h1 className="text-2xl font-bold md:text-3xl">
                  My Students
                </h1>

                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Manage students assigned to you,
                  monitor their progress and invite
                  new students to GlobeDK Elite Academy.
                </p>

              </div>

              <Button
                onClick={() => {
                  setDialogOpen(true)
                  setError("")
                  setMessage("")
                }}
              >

                <Plus className="mr-2 h-4 w-4" />

                Add Student

              </Button>

            </div>

          </section>

          {/* ====================================================
              SUCCESS MESSAGE
          ==================================================== */}

          {message && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">

              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

              <p>{message}</p>

            </div>
          )}

          {/* ====================================================
              ERROR MESSAGE
          ==================================================== */}

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">

              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

              <p>{error}</p>

            </div>
          )}

          {/* ====================================================
              STATS
          ==================================================== */}

          <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Card>

              <CardContent className="p-5">

                <p className="text-sm text-muted-foreground">
                  Assigned Students
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {loading ? "—" : totalStudents}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Currently assigned to you
                </p>

              </CardContent>

            </Card>

            <Card>

              <CardContent className="p-5">

                <p className="text-sm text-muted-foreground">
                  Average Performance
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {loading
                    ? "—"
                    : averagePerformance !== null
                    ? `${averagePerformance}%`
                    : "—"}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Across available results
                </p>

              </CardContent>

            </Card>

            <Card>

              <CardContent className="p-5">

                <p className="text-sm text-muted-foreground">
                  Average Attendance
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {loading
                    ? "—"
                    : averageAttendance !== null
                    ? `${averageAttendance}%`
                    : "—"}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Across recorded lessons
                </p>

              </CardContent>

            </Card>

            <Card>

              <CardContent className="p-5">

                <p className="text-sm text-muted-foreground">
                  Need Support
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {loading
                    ? "—"
                    : needingSupport}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Students requiring attention
                </p>

              </CardContent>

            </Card>

          </section>

          {/* ====================================================
              STUDENTS
          ==================================================== */}

          <Card>

            <CardHeader>

              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                <div>

                  <CardTitle>
                    Student List
                  </CardTitle>

                  <CardDescription>
                    Students currently assigned to you
                  </CardDescription>

                </div>

                <div className="relative w-full md:w-80">

                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                  <Input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search students..."
                    className="pl-9"
                  />

                </div>

              </div>

            </CardHeader>

            <CardContent>

              {loading ? (

                <div className="flex items-center justify-center py-16">

                  <Loader2 className="h-7 w-7 animate-spin text-primary" />

                </div>

              ) : filteredStudents.length === 0 ? (

                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">

                  <Users className="h-10 w-10 text-muted-foreground" />

                  <h3 className="mt-4 font-semibold">
                    {search
                      ? "No students found"
                      : "No students assigned yet"}
                  </h3>

                  <p className="mt-1 max-w-md text-sm text-muted-foreground">

                    {search
                      ? "Try another name, email address or level."
                      : "Add a student using their email address to begin managing their learning."}

                  </p>

                  {!search && (
                    <Button
                      className="mt-5"
                      onClick={() =>
                        setDialogOpen(true)
                      }
                    >

                      <Plus className="mr-2 h-4 w-4" />

                      Add Student

                    </Button>
                  )}

                </div>

              ) : (

                <div className="space-y-3">

                  {filteredStudents.map(
                    (student) => {

                      const fullName =
                        `${student.firstName} ${student.lastName}`

                      const initials =
                        `${student.firstName?.[0] || ""}${student.lastName?.[0] || ""}`.toUpperCase()

                      return (

                        <div
                          key={student.id}
                          className="rounded-xl border p-4 transition hover:bg-muted/40"
                        >

                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

                            {/* Student */}

                            <div className="flex min-w-0 items-center gap-3 lg:w-[280px]">

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">

                                {initials || "ST"}

                              </div>

                              <div className="min-w-0">

                                <p className="truncate font-semibold">
                                  {fullName}
                                </p>

                                <p className="truncate text-xs text-muted-foreground">
                                  {student.email}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                  {student.level}
                                  {student.school
                                    ? ` · ${student.school}`
                                    : ""}
                                </p>

                              </div>

                            </div>

                            {/* Attendance */}

                            <div className="lg:w-28">

                              <p className="text-xs text-muted-foreground">
                                Attendance
                              </p>

                              <p className="font-semibold">
                                {typeof student.attendance ===
                                "number"
                                  ? `${student.attendance}%`
                                  : "—"}
                              </p>

                            </div>

                            {/* Performance */}

                            <div className="lg:w-28">

                              <p className="text-xs text-muted-foreground">
                                Average
                              </p>

                              <p className="font-semibold">
                                {typeof student.average ===
                                "number"
                                  ? `${student.average}%`
                                  : "—"}
                              </p>

                            </div>

                            {/* Status */}

                            <div>

                              <Badge
                                variant={
                                  student.status ===
                                  "Needs Support"
                                    ? "destructive"
                                    : student.status ===
                                      "Excellent"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {student.status}
                              </Badge>

                            </div>

                            {/* Action */}

                            <div className="ml-auto">

                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                              >

                                <Link
                                  href={`/tutor/students/${student.id}`}
                                >

                                  <ChevronRight className="h-5 w-5" />

                                </Link>

                              </Button>

                            </div>

                          </div>

                        </div>

                      )
                    }
                  )}

                </div>

              )}

            </CardContent>

          </Card>

          {/* ====================================================
              PENDING INVITATIONS
          ==================================================== */}

          {pendingInvitations.length > 0 && (

            <Card className="mt-6">

              <CardHeader>

                <CardTitle>
                  Pending Invitations
                </CardTitle>

                <CardDescription>
                  Students who have been invited but
                  have not completed registration yet.
                </CardDescription>

              </CardHeader>

              <CardContent>

                <div className="space-y-3">

                  {pendingInvitations.map(
                    (invitation) => (

                      <div
                        key={invitation.id}
                        className="rounded-xl border p-4"
                      >

                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">

                              <Mail className="h-5 w-5 text-muted-foreground" />

                            </div>

                            <div>

                              <p className="font-medium">
                                {invitation.email}
                              </p>

                              <p className="flex items-center gap-1 text-xs text-muted-foreground">

                                <Clock className="h-3 w-3" />

                                Expires{" "}
                                {new Date(
                                  invitation.expiresAt
                                ).toLocaleString()}

                              </p>

                            </div>

                          </div>

                          <div className="flex flex-wrap gap-2">

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                copyInvitationLink(
                                  invitation.id
                                )
                              }
                              disabled={
                                copying ===
                                invitation.id
                              }
                            >

                              {copying ===
                              invitation.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Copy className="mr-2 h-4 w-4" />
                              )}

                              Copy Link

                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                resendInvitation(
                                  invitation.id
                                )
                              }
                              disabled={
                                resending ===
                                invitation.id
                              }
                            >

                              {resending ===
                              invitation.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="mr-2 h-4 w-4" />
                              )}

                              Resend

                            </Button>

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </CardContent>

            </Card>

          )}

        </main>

      </div>

      {/* ========================================================
          ADD STUDENT DIALOG
      ======================================================== */}

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      >

        <DialogContent className="sm:max-w-md">

          <DialogHeader>

            <DialogTitle>
              Add Student
            </DialogTitle>

            <DialogDescription>
              Enter the student's email address.
              If they already have a GlobeDK account,
              they will be assigned to you. Otherwise,
              they will receive an invitation to create
              their account.
            </DialogDescription>

          </DialogHeader>

          <div className="space-y-4 py-2">

            <div className="space-y-2">

              <label
                htmlFor="student-email"
                className="text-sm font-medium"
              >
                Student Email
              </label>

              <Input
                id="student-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="student@example.com"
                disabled={addingStudent}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter"
                  ) {
                    handleAddStudent()
                  }
                }}
              />

            </div>

            <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">

              <div className="flex gap-3">

                <Link2 className="mt-0.5 h-4 w-4 shrink-0" />

                <p>
                  Invitation links are unique,
                  secure and expire automatically.
                  The student will use the link to
                  create their password.
                </p>

              </div>

            </div>

          </div>

          <DialogFooter>

            <Button
              variant="outline"
              onClick={() =>
                setDialogOpen(false)
              }
              disabled={addingStudent}
            >
              Cancel
            </Button>

            <Button
              onClick={handleAddStudent}
              disabled={
                addingStudent ||
                !email.trim()
              }
            >

              {addingStudent ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}

              Add / Invite Student

            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

    </div>
  )
}

