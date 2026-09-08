"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  Mail,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  X,
} from "lucide-react"

import { AdminSidebar } from "@/components/admin/admin-sidebar"

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

type TutorStatus = "Active" | "Pending" | "Inactive"

type Tutor = {
  id: string
  name: string
  email: string
  phone: string
  subjects: string[]
  levels: string[]
  curricula: string[]
  students: number
  status: TutorStatus
  experience: string
  joined: string
  initials: string
}

type NewTutor = {
  name: string
  email: string
  phone: string
  subject: string
  level: string
  curriculum: string
}

type EditTutor = {
  name: string
  email: string
  phone: string
}

const subjectOptions = [
  "Mathematics",
  "English Language",
  "Combined Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Geography",
  "History",
  "Heritage Studies",
  "Commerce",
  "Principles of Accounts",
  "Pure Mathematics",
  "Statistics",
  "Business Studies",
  "Economics",
]

const levelOptions = ["O-Level", "A-Level"]

const curriculumOptions = ["ZIMSEC", "Cambridge"]

const emptyNewTutor: NewTutor = {
  name: "",
  email: "",
  phone: "",
  subject: "Mathematics",
  level: "O-Level",
  curriculum: "ZIMSEC",
}

const emptyEditTutor: EditTutor = {
  name: "",
  email: "",
  phone: "",
}

export default function AdminTutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([])

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [levelFilter, setLevelFilter] = useState("All")
  const [curriculumFilter, setCurriculumFilter] = useState("All")

  const [selectedTutor, setSelectedTutor] =
    useState<Tutor | null>(null)

  const [showAddTutor, setShowAddTutor] = useState(false)
  const [showViewTutor, setShowViewTutor] = useState(false)
  const [showEditTutor, setShowEditTutor] = useState(false)

  const [newTutor, setNewTutor] =
    useState<NewTutor>(emptyNewTutor)

  const [editTutor, setEditTutor] =
    useState<EditTutor>(emptyEditTutor)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [statusUpdating, setStatusUpdating] =
    useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  /*
   * Load real tutors from the server.
   */
  async function loadTutors() {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(
        "/api/admin/tutors",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to load tutors."
        )
      }

      setTutors(
        Array.isArray(data?.tutors)
          ? data.tutors
          : []
      )
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load tutors."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTutors()
  }, [])

  /*
   * Clear success messages automatically.
   */
  useEffect(() => {
    if (!success) return

    const timer = window.setTimeout(() => {
      setSuccess("")
    }, 5000)

    return () => {
      window.clearTimeout(timer)
    }
  }, [success])

  /*
   * Filter tutors.
   */
  const filteredTutors = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase()

    return tutors.filter((tutor) => {
      const matchesSearch =
        !query ||
        tutor.name
          .toLowerCase()
          .includes(query) ||
        tutor.email
          .toLowerCase()
          .includes(query) ||
        tutor.subjects.some((subject) =>
          subject
            .toLowerCase()
            .includes(query)
        )

      const matchesStatus =
        statusFilter === "All" ||
        tutor.status === statusFilter

      const matchesLevel =
        levelFilter === "All" ||
        tutor.levels.includes(levelFilter)

      const matchesCurriculum =
        curriculumFilter === "All" ||
        tutor.curricula.includes(
          curriculumFilter
        )

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLevel &&
        matchesCurriculum
      )
    })
  }, [
    tutors,
    search,
    statusFilter,
    levelFilter,
    curriculumFilter,
  ])

  const totalStudents = tutors.reduce(
    (total, tutor) =>
      total + tutor.students,
    0
  )

  const activeTutors = tutors.filter(
    (tutor) =>
      tutor.status === "Active"
  ).length

  const pendingTutors = tutors.filter(
    (tutor) =>
      tutor.status === "Pending"
  ).length

  const inactiveTutors = tutors.filter(
    (tutor) =>
      tutor.status === "Inactive"
  ).length

  /*
   * Create a real tutor account.
   *
   * IMPORTANT:
   * The invitation token is NOT generated here.
   * The server generates the secure token, stores only
   * its hash, and emails the raw token to the tutor.
   */
  async function handleAddTutor() {
    setError("")
    setSuccess("")

    const name =
      newTutor.name.trim()

    const email =
      newTutor.email.trim().toLowerCase()

    const phone =
      newTutor.phone.trim()

    if (!name) {
      setError(
        "Please enter the tutor's full name."
      )
      return
    }

    if (!email) {
      setError(
        "Please enter the tutor's email address."
      )
      return
    }

    try {
      setSaving(true)

      const response = await fetch(
        "/api/admin/tutors",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            subject:
              newTutor.subject,
            level:
              newTutor.level,
            curriculum:
              newTutor.curriculum,
          }),
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to create tutor."
        )
      }

      /*
       * Reload from the database so the UI
       * reflects the real server state.
       */
      await loadTutors()

      setNewTutor({
        ...emptyNewTutor,
      })

      setShowAddTutor(false)

      setSuccess(
        data?.message ||
          "Tutor created successfully. An activation email has been sent."
      )
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create tutor."
      )
    } finally {
      setSaving(false)
    }
  }

  /*
   * Open edit modal.
   */
  function handleOpenEdit(
    tutor: Tutor
  ) {
    setSelectedTutor(tutor)

    setEditTutor({
      name: tutor.name,
      email: tutor.email,
      phone: tutor.phone,
    })

    setError("")
    setSuccess("")

    setShowEditTutor(true)
  }

  /*
   * Save tutor profile changes.
   */
  async function handleSaveEdit() {
    if (!selectedTutor) return

    setError("")
    setSuccess("")

    const name =
      editTutor.name.trim()

    const email =
      editTutor.email
        .trim()
        .toLowerCase()

    const phone =
      editTutor.phone.trim()

    if (!name) {
      setError(
        "Tutor name is required."
      )
      return
    }

    if (!email) {
      setError(
        "Tutor email is required."
      )
      return
    }

    try {
      setEditing(true)

      const response = await fetch(
        `/api/admin/tutors/${selectedTutor.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
          }),
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to update tutor."
        )
      }

      await loadTutors()

      setShowEditTutor(false)
      setSelectedTutor(null)

      setSuccess(
        data?.message ||
          "Tutor information updated successfully."
      )
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update tutor."
      )
    } finally {
      setEditing(false)
    }
  }

  /*
   * Activate/deactivate tutor.
   *
   * The actual status change happens on the server.
   */
  async function toggleTutorStatus(
    tutor: Tutor
  ) {
    setError("")
    setSuccess("")

    try {
      setStatusUpdating(true)

      const nextStatus =
        tutor.status === "Active"
          ? "disabled"
          : "active"

      const response = await fetch(
        `/api/admin/tutors/${tutor.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            account_status:
              nextStatus,
          }),
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to update tutor status."
        )
      }

      await loadTutors()

      /*
       * Update selected tutor if the
       * profile modal is open.
       */
      if (
        selectedTutor?.id ===
        tutor.id
      ) {
        const updatedStatus: TutorStatus =
          nextStatus === "active"
            ? "Active"
            : "Inactive"

        setSelectedTutor({
          ...selectedTutor,
          status:
            updatedStatus,
        })
      }

      setSuccess(
        data?.message ||
          "Tutor status updated successfully."
      )
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update tutor status."
      )
    } finally {
      setStatusUpdating(false)
    }
  }

  function getStatusBadge(
    status: TutorStatus
  ) {
    if (status === "Active") {
      return (
        <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-600">
          <CheckCircle2 className="h-3 w-3" />
          Active
        </Badge>
      )
    }

    if (status === "Pending") {
      return (
        <Badge
          variant="secondary"
          className="gap-1 bg-amber-100 text-amber-800 hover:bg-amber-100"
        >
          <Clock3 className="h-3 w-3" />
          Pending
        </Badge>
      )
    }

    return (
      <Badge
        variant="outline"
        className="gap-1"
      >
        <UserX className="h-3 w-3" />
        Inactive
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />

      <main className="pl-[72px] lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur">
          <div className="flex h-full items-center justify-between px-4 lg:px-8">
            <div>
              <p className="text-sm font-medium">
                Tutor Management
              </p>

              <p className="text-xs text-muted-foreground">
                GlobeDK Elite Academy
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="hidden items-center gap-1 sm:flex"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Administrator
              </Badge>

              <Button
                asChild
                variant="outline"
                size="sm"
              >
                <Link href="/admin">
                  Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="px-4 py-6 lg:px-8 lg:py-8">
          {/* Error message */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                <div className="flex-1">
                  <p className="font-semibold">
                    Something went wrong
                  </p>

                  <p className="mt-1">
                    {error}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setError("")
                  }
                  className="rounded-md p-1 hover:bg-red-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                <div className="flex-1">
                  <p className="font-semibold">
                    Success
                  </p>

                  <p className="mt-1">
                    {success}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSuccess("")
                  }
                  className="rounded-md p-1 hover:bg-emerald-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Page heading */}
          <section className="mb-8">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="gap-1"
                  >
                    <UserCheck className="h-3 w-3" />
                    Academic Staff
                  </Badge>
                </div>

                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Tutors
                </h1>

                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Manage GlobeDK Elite
                  Academy tutors,
                  subjects, curricula,
                  students and
                  teaching access from
                  one place.
                </p>
              </div>

              <Button
                onClick={() => {
                  setError("")
                  setSuccess("")
                  setShowAddTutor(true)
                }}
                className="shrink-0"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Tutor
              </Button>
            </div>
          </section>

          {/* Statistics */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Tutors
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {loading
                        ? "..."
                        : tutors.length}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Registered teaching
                      staff
                    </p>
                  </div>

                  <div className="rounded-xl bg-primary/10 p-3">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Tutors
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {loading
                        ? "..."
                        : activeTutors}
                    </p>

                    <p className="mt-1 text-xs text-emerald-600">
                      Currently teaching
                    </p>
                  </div>

                  <div className="rounded-xl bg-emerald-500/10 p-3">
                    <UserCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Pending Approval
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {loading
                        ? "..."
                        : pendingTutors}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Awaiting activation
                    </p>
                  </div>

                  <div className="rounded-xl bg-amber-500/10 p-3">
                    <Clock3 className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Assigned Students
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {loading
                        ? "..."
                        : totalStudents}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Across all tutors
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-500/10 p-3">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Attention panel */}
          {pendingTutors > 0 && (
            <Card className="mb-6 border-amber-200 bg-amber-50/50">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-amber-100 p-2">
                    <AlertCircle className="h-5 w-5 text-amber-700" />
                  </div>

                  <div>
                    <p className="font-semibold">
                      {pendingTutors} tutor
                      {pendingTutors !== 1
                        ? "s"
                        : ""}{" "}
                      awaiting activation
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Tutors remain pending
                      until they use their
                      secure invitation
                      email to create a
                      password and activate
                      their account.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setStatusFilter(
                      "Pending"
                    )
                  }
                >
                  Review Pending
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Search and filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search tutors by name, email or subject..."
                    className="pl-9"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value
                      )
                    }
                    className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="All">
                      All Statuses
                    </option>

                    <option value="Active">
                      Active
                    </option>

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>

                  <select
                    value={levelFilter}
                    onChange={(event) =>
                      setLevelFilter(
                        event.target.value
                      )
                    }
                    className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="All">
                      All Levels
                    </option>

                    {levelOptions.map(
                      (level) => (
                        <option
                          key={level}
                          value={level}
                        >
                          {level}
                        </option>
                      )
                    )}
                  </select>

                  <select
                    value={
                      curriculumFilter
                    }
                    onChange={(event) =>
                      setCurriculumFilter(
                        event.target.value
                      )
                    }
                    className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="All">
                      All Curricula
                    </option>

                    {curriculumOptions.map(
                      (curriculum) => (
                        <option
                          key={curriculum}
                          value={curriculum}
                        >
                          {curriculum}
                        </option>
                      )
                    )}
                  </select>

                  {(search ||
                    statusFilter !==
                      "All" ||
                    levelFilter !==
                      "All" ||
                    curriculumFilter !==
                      "All") && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSearch("")
                        setStatusFilter(
                          "All"
                        )
                        setLevelFilter(
                          "All"
                        )
                        setCurriculumFilter(
                          "All"
                        )
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tutor table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>
                    Tutor Directory
                  </CardTitle>

                  <CardDescription>
                    {loading
                      ? "Loading tutors..."
                      : `${filteredTutors.length} tutor${
                          filteredTutors.length !==
                          1
                            ? "s"
                            : ""
                        } displayed`}
                  </CardDescription>
                </div>

                <Badge variant="outline">
                  {inactiveTutors} inactive
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Users className="h-7 w-7 animate-pulse text-muted-foreground" />
                  </div>

                  <h3 className="font-semibold">
                    Loading tutors
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Retrieving tutor
                    accounts from
                    GlobeDK Elite Academy.
                  </p>
                </div>
              ) : filteredTutors.length ===
                0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Users className="h-7 w-7 text-muted-foreground" />
                  </div>

                  <h3 className="font-semibold">
                    No tutors found
                  </h3>

                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Try changing your
                    search or filters, or
                    add a new tutor to the
                    academy.
                  </p>

                  <Button
                    className="mt-5"
                    onClick={() => {
                      setError("")
                      setShowAddTutor(
                        true
                      )
                    }}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Tutor
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1050px]">
                    <thead>
                      <tr className="border-y bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="px-6 py-4 font-medium">
                          Tutor
                        </th>

                        <th className="px-4 py-4 font-medium">
                          Subjects
                        </th>

                        <th className="px-4 py-4 font-medium">
                          Level / Curriculum
                        </th>

                        <th className="px-4 py-4 font-medium">
                          Students
                        </th>

                        <th className="px-4 py-4 font-medium">
                          Status
                        </th>

                        <th className="px-6 py-4 text-right font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {filteredTutors.map(
                        (tutor) => (
                          <tr
                            key={tutor.id}
                            className="group transition-colors hover:bg-muted/20"
                          >
                            {/* Tutor */}
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                                  {
                                    tutor.initials
                                  }
                                </div>

                                <div className="min-w-0">
                                  <p className="font-semibold">
                                    {tutor.name}
                                  </p>

                                  <div className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-3">
                                    <span className="flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      {
                                        tutor.email
                                      }
                                    </span>

                                    <span className="hidden sm:block">
                                      •
                                    </span>

                                    <span>
                                      {tutor.phone ||
                                        "No phone provided"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Subjects */}
                            <td className="px-4 py-5">
                              <div className="flex max-w-[260px] flex-wrap gap-1.5">
                                {tutor.subjects
                                  .slice(
                                    0,
                                    3
                                  )
                                  .map(
                                    (
                                      subject
                                    ) => (
                                      <Badge
                                        key={
                                          subject
                                        }
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {
                                          subject
                                        }
                                      </Badge>
                                    )
                                  )}

                                {tutor.subjects
                                  .length >
                                  3 && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    +
                                    {tutor.subjects
                                      .length -
                                      3}
                                  </Badge>
                                )}
                              </div>
                            </td>

                            {/* Levels */}
                            <td className="px-4 py-5">
                              <div className="space-y-2">
                                <div className="flex flex-wrap gap-1">
                                  {tutor.levels.map(
                                    (
                                      level
                                    ) => (
                                      <Badge
                                        key={
                                          level
                                        }
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {
                                          level
                                        }
                                      </Badge>
                                    )
                                  )}
                                </div>

                                <div className="flex flex-wrap gap-1">
                                  {tutor.curricula.map(
                                    (
                                      curriculum
                                    ) => (
                                      <span
                                        key={
                                          curriculum
                                        }
                                        className="text-xs text-muted-foreground"
                                      >
                                        {
                                          curriculum
                                        }
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Students */}
                            <td className="px-4 py-5">
                              <div className="flex items-center gap-2">
                                <div className="rounded-md bg-muted p-2">
                                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                </div>

                                <div>
                                  <p className="font-semibold">
                                    {
                                      tutor.students
                                    }
                                  </p>

                                  <p className="text-xs text-muted-foreground">
                                    assigned
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-5">
                              {getStatusBadge(
                                tutor.status
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-5">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedTutor(
                                      tutor
                                    )
                                    setShowViewTutor(
                                      true
                                    )
                                  }}
                                >
                                  View
                                </Button>

                                <Button
                                  size="icon"
                                  variant="ghost"
                                  title="Edit tutor"
                                  onClick={() =>
                                    handleOpenEdit(
                                      tutor
                                    )
                                  }
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>

                                <Button
                                  size="icon"
                                  variant="ghost"
                                  title={
                                    tutor.status ===
                                    "Active"
                                      ? "Deactivate tutor"
                                      : "Activate tutor"
                                  }
                                  disabled={
                                    statusUpdating
                                  }
                                  onClick={() =>
                                    toggleTutorStatus(
                                      tutor
                                    )
                                  }
                                >
                                  {tutor.status ===
                                  "Active" ? (
                                    <UserX className="h-4 w-4" />
                                  ) : (
                                    <UserCheck className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bottom information cards */}
          <section className="mt-6 grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Teaching Coverage
                </CardTitle>

                <CardDescription>
                  Subjects available
                  across the academy.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {subjectOptions.map(
                    (subject) => (
                      <Badge
                        key={subject}
                        variant="outline"
                        className="font-normal"
                      >
                        {subject}
                      </Badge>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Tutor Standards
                </CardTitle>

                <CardDescription>
                  Information
                  administrators should
                  maintain.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Tutor profile and
                    contact information
                  </li>

                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Subjects and
                    curriculum coverage
                  </li>

                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Student assignments
                  </li>

                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Account and teaching
                    status
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Academic Programmes
                </CardTitle>

                <CardDescription>
                  Curricula supported by
                  GlobeDK Elite.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        ZIMSEC
                      </span>

                      <Badge variant="secondary">
                        O-Level & A-Level
                      </Badge>
                    </div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        Cambridge
                      </span>

                      <Badge variant="secondary">
                        O-Level & A-Level
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* ========================================================= */}
      {/* ADD TUTOR MODAL                                           */}
      {/* ========================================================= */}

      {showAddTutor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-lg font-semibold">
                  Add New Tutor
                </h2>

                <p className="text-sm text-muted-foreground">
                  Create a tutor account
                  and send a secure
                  activation invitation.
                </p>
              </div>

              <Button
                size="icon"
                variant="ghost"
                disabled={saving}
                onClick={() =>
                  setShowAddTutor(false)
                }
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Full Name
                  </label>

                  <Input
                    value={newTutor.name}
                    disabled={saving}
                    onChange={(event) =>
                      setNewTutor({
                        ...newTutor,
                        name: event.target
                          .value,
                      })
                    }
                    placeholder="e.g. John Daka"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email Address
                  </label>

                  <Input
                    type="email"
                    value={newTutor.email}
                    disabled={saving}
                    onChange={(event) =>
                      setNewTutor({
                        ...newTutor,
                        email:
                          event.target
                            .value,
                      })
                    }
                    placeholder="tutor@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone Number
                </label>

                <Input
                  value={newTutor.phone}
                  disabled={saving}
                  onChange={(event) =>
                    setNewTutor({
                      ...newTutor,
                      phone: event.target
                        .value,
                    })
                  }
                  placeholder="+263 7X XXX XXXX"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Primary Subject
                  </label>

                  <select
                    value={
                      newTutor.subject
                    }
                    disabled={saving}
                    onChange={(event) =>
                      setNewTutor({
                        ...newTutor,
                        subject:
                          event.target
                            .value,
                      })
                    }
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    {subjectOptions.map(
                      (subject) => (
                        <option
                          key={subject}
                          value={subject}
                        >
                          {subject}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Level
                  </label>

                  <select
                    value={newTutor.level}
                    disabled={saving}
                    onChange={(event) =>
                      setNewTutor({
                        ...newTutor,
                        level:
                          event.target
                            .value,
                      })
                    }
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    {levelOptions.map(
                      (level) => (
                        <option
                          key={level}
                          value={level}
                        >
                          {level}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Curriculum
                  </label>

                  <select
                    value={
                      newTutor.curriculum
                    }
                    disabled={saving}
                    onChange={(event) =>
                      setNewTutor({
                        ...newTutor,
                        curriculum:
                          event.target
                            .value,
                      })
                    }
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    {curriculumOptions.map(
                      (curriculum) => (
                        <option
                          key={curriculum}
                          value={curriculum}
                        >
                          {curriculum}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                  <div>
                    <p>
                      The tutor will receive
                      a secure activation
                      email.
                    </p>

                    <p className="mt-1">
                      They will use the link
                      to create their own
                      password. The password
                      is{" "}
                      <strong>
                        never entered or
                        stored by the
                        administrator.
                      </strong>
                    </p>

                    <p className="mt-1">
                      The invitation expires
                      after 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t p-5">
              <Button
                variant="outline"
                disabled={saving}
                onClick={() =>
                  setShowAddTutor(false)
                }
              >
                Cancel
              </Button>

              <Button
                disabled={saving}
                onClick={
                  handleAddTutor
                }
              >
                {saving ? (
                  <>
                    <Clock3 className="mr-2 h-4 w-4 animate-spin" />
                    Creating & Sending...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create & Invite Tutor
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW TUTOR MODAL                                          */}
      {/* ========================================================= */}

      {showViewTutor &&
        selectedTutor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-xl border bg-background shadow-2xl">
              <div className="flex items-center justify-between border-b p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Tutor Profile
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    {
                      selectedTutor.name
                    }
                  </h2>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setShowViewTutor(
                      false
                    )
                    setSelectedTutor(
                      null
                    )
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {
                      selectedTutor.initials
                    }
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">
                        {
                          selectedTutor.name
                        }
                      </h3>

                      {getStatusBadge(
                        selectedTutor.status
                      )}
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {
                        selectedTutor.email
                      }
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {
                        selectedTutor.phone ||
                        "No phone provided"
                      }
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">
                      Students
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {
                        selectedTutor.students
                      }
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">
                      Experience
                    </p>

                    <p className="mt-1 font-semibold">
                      {
                        selectedTutor.experience
                      }
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">
                      Joined
                    </p>

                    <p className="mt-1 font-semibold">
                      {
                        selectedTutor.joined
                      }
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold">
                    Subjects
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {selectedTutor.subjects.map(
                      (subject) => (
                        <Badge
                          key={subject}
                          variant="secondary"
                        >
                          {subject}
                        </Badge>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold">
                    Academic Coverage
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {selectedTutor.levels.map(
                      (level) => (
                        <Badge
                          key={level}
                          variant="outline"
                        >
                          {level}
                        </Badge>
                      )
                    )}

                    {selectedTutor.curricula.map(
                      (curriculum) => (
                        <Badge
                          key={curriculum}
                          variant="outline"
                        >
                          {curriculum}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t p-5">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowViewTutor(
                      false
                    )
                    handleOpenEdit(
                      selectedTutor
                    )
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Tutor
                </Button>

                <Button
                  disabled={
                    statusUpdating
                  }
                  onClick={async () => {
                    await toggleTutorStatus(
                      selectedTutor
                    )

                    setShowViewTutor(
                      false
                    )
                    setSelectedTutor(
                      null
                    )
                  }}
                >
                  {selectedTutor.status ===
                  "Active"
                    ? "Deactivate Tutor"
                    : "Activate Tutor"}
                </Button>
              </div>
            </div>
          </div>
        )}

      {/* ========================================================= */}
      {/* EDIT TUTOR MODAL                                          */}
      {/* ========================================================= */}

      {showEditTutor &&
        selectedTutor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-xl border bg-background shadow-2xl">
              <div className="flex items-center justify-between border-b p-5">
                <div>
                  <h2 className="text-lg font-semibold">
                    Edit Tutor
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Update tutor account
                    information.
                  </p>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  disabled={editing}
                  onClick={() =>
                    setShowEditTutor(
                      false
                    )
                  }
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Full Name
                  </label>

                  <Input
                    value={editTutor.name}
                    disabled={editing}
                    onChange={(event) =>
                      setEditTutor({
                        ...editTutor,
                        name: event.target
                          .value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email Address
                  </label>

                  <Input
                    type="email"
                    value={
                      editTutor.email
                    }
                    disabled={editing}
                    onChange={(event) =>
                      setEditTutor({
                        ...editTutor,
                        email:
                          event.target
                            .value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Phone Number
                  </label>

                  <Input
                    value={
                      editTutor.phone
                    }
                    disabled={editing}
                    onChange={(event) =>
                      setEditTutor({
                        ...editTutor,
                        phone:
                          event.target
                            .value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t p-5">
                <Button
                  variant="outline"
                  disabled={editing}
                  onClick={() =>
                    setShowEditTutor(
                      false
                    )
                  }
                >
                  Cancel
                </Button>

                <Button
                  disabled={editing}
                  onClick={
                    handleSaveEdit
                  }
                >
                  {editing ? (
                    <>
                      <Clock3 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}