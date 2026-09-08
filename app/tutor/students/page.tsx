"use client"

import {
  CheckCircle2,
  Edit,
  GraduationCap,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  UserPlus,
  XCircle,
} from "lucide-react"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import TutorSidebar from "../../../components/tutor/TutorSidebar"

import {
  Button,
} from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Badge,
} from "@/components/ui/badge"

import {
  Input,
} from "@/components/ui/input"

import {
  Label,
} from "@/components/ui/label"

type Subject = {
  id: string
  name: string
  code: string | null
  description: string | null
  level: string | null
  is_active: boolean
  syllabus: string | null
  price: number | null
}

type StudentSubject = {
  id: string
  name: string
  code: string | null
  level: string | null
}

type Student = {
  id: string
  first_name: string
  last_name: string
  name: string
  email: string
  phone: string | null
  level: string | null
  school: string | null
  guardian_name: string | null
  guardian_phone: string | null
  role: string
  email_verified: boolean
  account_status: string
  created_at: string
  relationship_id: string
  assigned_at: string
  subjects: StudentSubject[]
}

type StudentForm = {
  first_name: string
  last_name: string
  email: string
  phone: string
  level: string
  school: string
  guardian_name: string
  guardian_phone: string
  subject_ids: string[]
}

const emptyForm: StudentForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  level: "O-Level",
  school: "",
  guardian_name: "",
  guardian_phone: "",
  subject_ids: [],
}

const levelOptions = [
  "O-Level",
  "A-Level",
]

export default function TutorStudentsPage() {
  const [
    students,
    setStudents,
  ] = useState<Student[]>([])

  const [
    subjects,
    setSubjects,
  ] = useState<Subject[]>([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    saving,
    setSaving,
  ] = useState(false)

  const [
    search,
    setSearch,
  ] = useState("")

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All")

  const [
    levelFilter,
    setLevelFilter,
  ] = useState("All")

  const [
    showModal,
    setShowModal,
  ] = useState(false)

  const [
    editingStudent,
    setEditingStudent,
  ] =
    useState<Student | null>(
      null
    )

  const [
    form,
    setForm,
  ] =
    useState<StudentForm>(
      emptyForm
    )

  const [
    error,
    setError,
  ] = useState("")

  const [
    success,
    setSuccess,
  ] = useState("")

  const [
    deletingId,
    setDeletingId,
  ] = useState<string | null>(
    null
  )

  const loadStudents =
    async () => {
      try {
        setLoading(true)
        setError("")

        const response =
          await fetch(
            "/api/tutor/students",
            {
              method: "GET",
              credentials:
                "include",
              cache: "no-store",
            }
          )

        const data =
          await response.json()

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to load students."
          )
        }

        setStudents(
          data.students ||
            []
        )

        setSubjects(
          data.subjects ||
            []
        )
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load students."
        )
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    loadStudents()
  }, [])

  const filteredStudents =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      return students.filter(
        (student) => {
          const matchesSearch =
            !query ||
            student.name
              .toLowerCase()
              .includes(
                query
              ) ||
            student.email
              .toLowerCase()
              .includes(
                query
              ) ||
            (
              student.school ||
              ""
            )
              .toLowerCase()
              .includes(
                query
              ) ||
            (
              student.level ||
              ""
            )
              .toLowerCase()
              .includes(
                query
              ) ||
            student.subjects.some(
              (subject) =>
                subject.name
                  .toLowerCase()
                  .includes(
                    query
                  ) ||
                (
                  subject.code ||
                  ""
                )
                  .toLowerCase()
                  .includes(
                    query
                  )
            )

          const matchesStatus =
            statusFilter ===
              "All" ||
            (
              statusFilter ===
                "Active"
                ? student.account_status ===
                  "active"
                : statusFilter ===
                    "Pending"
                ? student.account_status ===
                  "invited"
                : student.account_status !==
                    "active" &&
                  student.account_status !==
                    "invited"
            )

          const matchesLevel =
            levelFilter ===
              "All" ||
            student.level ===
              levelFilter

          return (
            matchesSearch &&
            matchesStatus &&
            matchesLevel
          )
        }
      )
    }, [
      students,
      search,
      statusFilter,
      levelFilter,
    ])

  const activeCount =
    students.filter(
      (student) =>
        student.account_status ===
        "active"
    ).length

  const pendingCount =
    students.filter(
      (student) =>
        student.account_status ===
        "invited"
    ).length

  const inactiveCount =
    students.filter(
      (student) =>
        student.account_status !==
          "active" &&
        student.account_status !==
          "invited"
    ).length

  const availableFormSubjects =
    useMemo(() => {
      return subjects.filter(
        (subject) =>
          subject.is_active &&
          (
            !subject.level ||
            subject.level ===
              form.level
          )
      )
    }, [
      subjects,
      form.level,
    ])

  const openAddModal =
    () => {
      setEditingStudent(null)

      setForm({
        ...emptyForm,
      })

      setError("")
      setSuccess("")
      setShowModal(true)
    }

  const openEditModal =
    (
      student: Student
    ) => {
      setEditingStudent(
        student
      )

      setForm({
        first_name:
          student.first_name ||
          "",

        last_name:
          student.last_name ||
          "",

        email:
          student.email ||
          "",

        phone:
          student.phone ||
          "",

        level:
          student.level ||
          "O-Level",

        school:
          student.school ||
          "",

        guardian_name:
          student.guardian_name ||
          "",

        guardian_phone:
          student.guardian_phone ||
          "",

        subject_ids:
          student.subjects.map(
            (subject) =>
              subject.id
          ),
      })

      setError("")
      setSuccess("")
      setShowModal(true)
    }

  const closeModal =
    () => {
      if (saving) {
        return
      }

      setShowModal(false)

      setEditingStudent(
        null
      )

      setForm({
        ...emptyForm,
      })

      setError("")
      setSuccess("")
    }

  const toggleSubject =
    (
      subjectId: string
    ) => {
      setForm(
        (current) => {
          const alreadySelected =
            current.subject_ids.includes(
              subjectId
            )

          return {
            ...current,
            subject_ids:
              alreadySelected
                ? current.subject_ids.filter(
                    (id) =>
                      id !==
                      subjectId
                  )
                : [
                    ...current.subject_ids,
                    subjectId,
                  ],
          }
        }
      )
    }

  const handleLevelChange =
    (
      level: string
    ) => {
      setForm(
        (current) => ({
          ...current,
          level,
          subject_ids:
            [],
        })
      )
    }

  const handleSave =
    async (
      event: React.FormEvent
    ) => {
      event.preventDefault()

      setError("")
      setSuccess("")

      const firstName =
        form.first_name.trim()

      const lastName =
        form.last_name.trim()

      const email =
        form.email
          .trim()
          .toLowerCase()

      const phone =
        form.phone.trim()

      const level =
        form.level.trim()

      const school =
        form.school.trim()

      const guardianName =
        form.guardian_name.trim()

      const guardianPhone =
        form.guardian_phone.trim()

      if (!firstName) {
        setError(
          "First name is required."
        )
        return
      }

      if (!lastName) {
        setError(
          "Last name is required."
        )
        return
      }

      if (!email) {
        setError(
          "Email is required."
        )
        return
      }

      if (!level) {
        setError(
          "Level is required."
        )
        return
      }

      try {
        setSaving(true)

        const isEditing =
          Boolean(
            editingStudent
          )

        const url =
          isEditing
            ? `/api/tutor/students/${editingStudent?.id}`
            : "/api/tutor/students"

        const response =
          await fetch(
            url,
            {
              method:
                isEditing
                  ? "PATCH"
                  : "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              credentials:
                "include",

              body:
                JSON.stringify({
                  first_name:
                    firstName,

                  last_name:
                    lastName,

                  email,

                  phone,

                  level,

                  school,

                  guardian_name:
                    guardianName,

                  guardian_phone:
                    guardianPhone,

                  subject_ids:
                    form.subject_ids,
                }),
            }
          )

        const data =
          await response.json()

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to save student."
          )
        }

        await loadStudents()

        setSuccess(
          isEditing
            ? "Student updated successfully."
            : "Student created and invitation sent successfully."
        )

        if (!isEditing) {
          setForm({
            ...emptyForm,
          })
        }

        setTimeout(() => {
          setShowModal(false)

          setEditingStudent(
            null
          )

          setForm({
            ...emptyForm,
          })

          setSuccess("")
        }, 900)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to save student."
        )
      } finally {
        setSaving(false)
      }
    }

  const toggleStudentStatus =
    async (
      student: Student
    ) => {
      const nextStatus =
        student.account_status ===
        "active"
          ? "disabled"
          : "active"

      try {
        setError("")
        setSuccess("")

        const response =
          await fetch(
            `/api/tutor/students/${student.id}`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              credentials:
                "include",

              body:
                JSON.stringify({
                  account_status:
                    nextStatus,
                }),
            }
          )

        const data =
          await response.json()

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to update student status."
          )
        }

        await loadStudents()

        setSuccess(
          nextStatus ===
            "active"
            ? "Student activated successfully."
            : "Student disabled successfully."
        )

        setTimeout(
          () =>
            setSuccess(""),
          3000
        )
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to update student status."
        )
      }
    }

  const handleDelete =
    async (
      student: Student
    ) => {
      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${student.name}"? This action cannot be undone.`
        )

      if (!confirmed) {
        return
      }

      try {
        setDeletingId(
          student.id
        )

        setError("")
        setSuccess("")

        const response =
          await fetch(
            `/api/tutor/students/${student.id}`,
            {
              method: "DELETE",
              credentials:
                "include",
            }
          )

        const data =
          await response.json()

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to delete student."
          )
        }

        await loadStudents()

        setSuccess(
          "Student deleted successfully."
        )

        setTimeout(
          () =>
            setSuccess(""),
          3000
        )
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to delete student."
        )
      } finally {
        setDeletingId(null)
      }
    }

  const getStatusBadge =
    (
      status: string
    ) => {
      if (
        status ===
        "active"
      ) {
        return (
          <Badge className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Active
          </Badge>
        )
      }

      if (
        status ===
        "invited"
      ) {
        return (
          <Badge
            variant="secondary"
            className="gap-1"
          >
            <Mail className="h-3 w-3" />
            Invitation Pending
          </Badge>
        )
      }

      if (
        status ===
        "suspended"
      ) {
        return (
          <Badge
            variant="destructive"
            className="gap-1"
          >
            <XCircle className="h-3 w-3" />
            Suspended
          </Badge>
        )
      }

      return (
        <Badge
          variant="secondary"
          className="gap-1"
        >
          <XCircle className="h-3 w-3" />
          Disabled
        </Badge>
      )
    }

  return (
    <main className="min-h-screen bg-muted/30">

      <TutorSidebar />

      <div className="lg:pl-64">

        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">

          <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-medium text-primary">
                Student Management
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight">
                My Students
              </h1>

              <p className="mt-2 text-muted-foreground">
                Create, invite and manage
                the students assigned to
                you.
              </p>

            </div>

            <Button
              onClick={
                openAddModal
              }
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add Student
            </Button>

          </section>

          {error && (
            <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
              {success}
            </div>
          )}

          <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Students
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {
                        students.length
                      }
                    </p>
                  </div>

                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {
                        activeCount
                      }
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-500/10 p-3 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Invitations
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {
                        pendingCount
                      }
                    </p>
                  </div>

                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Inactive
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {
                        inactiveCount
                      }
                    </p>
                  </div>

                  <div className="rounded-xl bg-muted p-3 text-muted-foreground">
                    <XCircle className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

          </section>

          <Card>

            <CardHeader>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <CardTitle>
                    Student List
                  </CardTitle>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Students currently
                    assigned to you.
                  </p>

                </div>

                <div className="flex flex-col gap-2 sm:flex-row">

                  <div className="relative">

                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      value={
                        search
                      }
                      onChange={(
                        event
                      ) =>
                        setSearch(
                          event.target
                            .value
                        )
                      }
                      placeholder="Search students..."
                      className="pl-9 sm:w-64"
                    />

                  </div>

                  <select
                    value={
                      levelFilter
                    }
                    onChange={(
                      event
                    ) =>
                      setLevelFilter(
                        event.target
                          .value
                      )
                    }
                    className="h-10 rounded-md border bg-background px-3 text-sm"
                  >

                    <option value="All">
                      All Levels
                    </option>

                    {levelOptions.map(
                      (
                        level
                      ) => (
                        <option
                          key={
                            level
                          }
                          value={
                            level
                          }
                        >
                          {
                            level
                          }
                        </option>
                      )
                    )}

                  </select>

                  <select
                    value={
                      statusFilter
                    }
                    onChange={(
                      event
                    ) =>
                      setStatusFilter(
                        event.target
                          .value
                      )
                    }
                    className="h-10 rounded-md border bg-background px-3 text-sm"
                  >

                    <option value="All">
                      All Status
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

                </div>

              </div>

            </CardHeader>

            <CardContent>

              {loading ? (
                <div className="py-16 text-center">

                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

                  <p className="mt-4 text-sm text-muted-foreground">
                    Loading students...
                  </p>

                </div>
              ) : filteredStudents.length ===
                0 ? (

                <div className="rounded-xl border border-dashed p-12 text-center">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                    <GraduationCap className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <h3 className="mt-4 font-semibold">
                    No students found
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {search ||
                    levelFilter !==
                      "All" ||
                    statusFilter !==
                      "All"
                      ? "Try changing your search or filters."
                      : "Start by adding your first student."}
                  </p>

                  {!search &&
                    levelFilter ===
                      "All" &&
                    statusFilter ===
                      "All" && (
                      <Button
                        className="mt-5"
                        onClick={
                          openAddModal
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Student
                      </Button>
                    )}

                </div>

              ) : (

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[1250px]">

                    <thead>

                      <tr className="border-b text-left text-sm text-muted-foreground">

                        <th className="px-4 py-3 font-medium">
                          Student
                        </th>

                        <th className="px-4 py-3 font-medium">
                          Contact
                        </th>

                        <th className="px-4 py-3 font-medium">
                          Level
                        </th>

                        <th className="px-4 py-3 font-medium">
                          Subjects
                        </th>

                        <th className="px-4 py-3 font-medium">
                          School
                        </th>

                        <th className="px-4 py-3 font-medium">
                          Guardian
                        </th>

                        <th className="px-4 py-3 font-medium">
                          Status
                        </th>

                        <th className="px-4 py-3 text-right font-medium">
                          Actions
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {filteredStudents.map(
                        (
                          student
                        ) => (

                          <tr
                            key={
                              student.id
                            }
                            className="border-b last:border-0 hover:bg-muted/40"
                          >

                            <td className="px-4 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                                  {student.first_name?.charAt(
                                    0
                                  )}
                                  {student.last_name?.charAt(
                                    0
                                  )}
                                </div>

                                <div>

                                  <p className="font-semibold">
                                    {
                                      student.name
                                    }
                                  </p>

                                  <p className="text-xs text-muted-foreground">
                                    Student
                                  </p>

                                </div>

                              </div>

                            </td>

                            <td className="px-4 py-4">

                              <div className="space-y-1">

                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                  {
                                    student.email
                                  }
                                </div>

                                {student.phone && (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Phone className="h-3.5 w-3.5" />
                                    {
                                      student.phone
                                    }
                                  </div>
                                )}

                              </div>

                            </td>

                            <td className="px-4 py-4">

                              <Badge variant="secondary">
                                {
                                  student.level ||
                                  "Not specified"
                                }
                              </Badge>

                            </td>

                            <td className="px-4 py-4">

                              {student.subjects.length >
                              0 ? (

                                <div className="flex max-w-[260px] flex-wrap gap-1.5">

                                  {student.subjects.map(
                                    (
                                      subject
                                    ) => (
                                      <Badge
                                        key={
                                          subject.id
                                        }
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {
                                          subject.name
                                        }
                                      </Badge>
                                    )
                                  )}

                                </div>

                              ) : (

                                <span className="text-sm text-muted-foreground">
                                  No subjects
                                </span>

                              )}

                            </td>

                            <td className="px-4 py-4">

                              <p className="max-w-[180px] truncate text-sm">
                                {
                                  student.school ||
                                  "Not specified"
                                }
                              </p>

                            </td>

                            <td className="px-4 py-4">

                              <div>

                                <p className="text-sm">
                                  {
                                    student.guardian_name ||
                                    "Not specified"
                                  }
                                </p>

                                {student.guardian_phone && (
                                  <p className="text-xs text-muted-foreground">
                                    {
                                      student.guardian_phone
                                    }
                                  </p>
                                )}

                              </div>

                            </td>

                            <td className="px-4 py-4">
                              {
                                getStatusBadge(
                                  student.account_status
                                )
                              }
                            </td>

                            <td className="px-4 py-4">

                              <div className="flex justify-end gap-2">

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    openEditModal(
                                      student
                                    )
                                  }
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Button>

                                {student.account_status !==
                                  "invited" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      toggleStudentStatus(
                                        student
                                      )
                                    }
                                  >
                                    {student.account_status ===
                                    "active"
                                      ? "Disable"
                                      : "Activate"}
                                  </Button>
                                )}

                                <Button
                                  variant="outline"
                                  size="icon"
                                  disabled={
                                    deletingId ===
                                    student.id
                                  }
                                  onClick={() =>
                                    handleDelete(
                                      student
                                    )
                                  }
                                  className="text-destructive hover:text-destructive"
                                >
                                  {deletingId ===
                                  student.id ? (
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
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

        </div>

      </div>

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">

          <div className="my-8 w-full max-w-2xl rounded-2xl border bg-background shadow-xl">

            <div className="flex items-center justify-between border-b px-6 py-4">

              <div>

                <h2 className="text-lg font-semibold">
                  {editingStudent
                    ? "Edit Student"
                    : "Add Student"}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {editingStudent
                    ? "Update the student's information."
                    : "Create a student account and send an invitation email."}
                </p>

              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={
                  closeModal
                }
                disabled={
                  saving
                }
              >
                <XCircle className="h-5 w-5" />
              </Button>

            </div>

            <form
              onSubmit={
                handleSave
              }
            >

              <div className="space-y-5 p-6">

                {error && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400">
                    {success}
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">

                  <div className="space-y-2">

                    <Label htmlFor="student-first-name">
                      First Name
                    </Label>

                    <Input
                      id="student-first-name"
                      value={
                        form.first_name
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,

                            first_name:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                      placeholder="e.g. Tendai"
                      disabled={
                        saving
                      }
                    />

                  </div>

                  <div className="space-y-2">

                    <Label htmlFor="student-last-name">
                      Last Name
                    </Label>

                    <Input
                      id="student-last-name"
                      value={
                        form.last_name
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,

                            last_name:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                      placeholder="e.g. Moyo"
                      disabled={
                        saving
                      }
                    />

                  </div>

                </div>

                <div className="space-y-2">

                  <Label htmlFor="student-email">
                    Email Address
                  </Label>

                  <Input
                    id="student-email"
                    type="email"
                    value={
                      form.email
                    }
                    onChange={(
                      event
                    ) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,

                          email:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    placeholder="student@example.com"
                    disabled={
                      saving
                    }
                  />

                  {!editingStudent && (
                    <p className="text-xs text-muted-foreground">
                      The invitation and
                      activation link will
                      be sent to this email.
                    </p>
                  )}

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div className="space-y-2">

                    <Label htmlFor="student-phone">
                      Student Phone
                    </Label>

                    <Input
                      id="student-phone"
                      value={
                        form.phone
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,

                            phone:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                      placeholder="Optional"
                      disabled={
                        saving
                      }
                    />

                  </div>

                  <div className="space-y-2">

                    <Label htmlFor="student-level">
                      Level
                    </Label>

                    <select
                      id="student-level"
                      value={
                        form.level
                      }
                      onChange={(
                        event
                      ) =>
                        handleLevelChange(
                          event.target
                            .value
                        )
                      }
                      disabled={
                        saving
                      }
                      className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                    >

                      {levelOptions.map(
                        (
                          level
                        ) => (
                          <option
                            key={
                              level
                            }
                            value={
                              level
                            }
                          >
                            {
                              level
                            }
                          </option>
                        )
                      )}

                    </select>

                  </div>

                </div>

                {/* SUBJECTS */}

                <div className="space-y-3">

                  <div>

                    <Label>
                      Subjects
                    </Label>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Select all subjects the student is taking. You can select more than one.
                    </p>

                  </div>

                  {availableFormSubjects.length ===
                  0 ? (

                    <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                      No active subjects are available for{" "}
                      {form.level}.
                    </div>

                  ) : (

                    <div className="grid max-h-64 gap-2 overflow-y-auto rounded-xl border p-3 sm:grid-cols-2">

                      {availableFormSubjects.map(
                        (
                          subject
                        ) => {
                          const checked =
                            form.subject_ids.includes(
                              subject.id
                            )

                          return (
                            <label
                              key={
                                subject.id
                              }
                              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                                checked
                                  ? "border-primary bg-primary/5"
                                  : "hover:bg-muted/50"
                              }`}
                            >

                              <input
                                type="checkbox"
                                checked={
                                  checked
                                }
                                onChange={() =>
                                  toggleSubject(
                                    subject.id
                                  )
                                }
                                disabled={
                                  saving
                                }
                                className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                              />

                              <div className="min-w-0">

                                <p className="text-sm font-medium">
                                  {
                                    subject.name
                                  }
                                </p>

                                {subject.code && (
                                  <p className="text-xs text-muted-foreground">
                                    {
                                      subject.code
                                    }
                                  </p>
                                )}

                              </div>

                            </label>
                          )
                        }
                      )}

                    </div>

                  )}

                  {form.subject_ids.length >
                    0 && (
                    <p className="text-xs font-medium text-primary">
                      {
                        form.subject_ids.length
                      }{" "}
                      subject
                      {form.subject_ids.length ===
                      1
                        ? ""
                        : "s"}{" "}
                      selected
                    </p>
                  )}

                </div>

                <div className="space-y-2">

                  <Label htmlFor="student-school">
                    School
                  </Label>

                  <Input
                    id="student-school"
                    value={
                      form.school
                    }
                    onChange={(
                      event
                    ) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,

                          school:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    placeholder="e.g. Harare High School"
                    disabled={
                      saving
                    }
                  />

                </div>

                <div className="border-t pt-5">

                  <h3 className="font-semibold">
                    Guardian Information
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Add the student's parent
                    or guardian details.
                  </p>

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div className="space-y-2">

                    <Label htmlFor="guardian-name">
                      Guardian Name
                    </Label>

                    <Input
                      id="guardian-name"
                      value={
                        form.guardian_name
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,

                            guardian_name:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                      placeholder="e.g. Mrs Moyo"
                      disabled={
                        saving
                      }
                    />

                  </div>

                  <div className="space-y-2">

                    <Label htmlFor="guardian-phone">
                      Guardian Phone
                    </Label>

                    <Input
                      id="guardian-phone"
                      value={
                        form.guardian_phone
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,

                            guardian_phone:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                      placeholder="e.g. +263..."
                      disabled={
                        saving
                      }
                    />

                  </div>

                </div>

                {!editingStudent && (
                  <div className="rounded-xl border bg-muted/40 p-4">

                    <div className="flex gap-3">

                      <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                      <div>

                        <p className="text-sm font-semibold">
                          Student invitation
                        </p>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          After you create this
                          student, GlobeDK will
                          automatically send an
                          invitation email. The
                          student will use the
                          secure link to create
                          their password.
                        </p>

                      </div>

                    </div>

                  </div>
                )}

              </div>

              <div className="flex justify-end gap-3 border-t px-6 py-4">

                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    closeModal
                  }
                  disabled={
                    saving
                  }
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={
                    saving
                  }
                >
                  {saving
                    ? "Saving..."
                    : editingStudent
                    ? "Save Changes"
                    : "Create & Invite Student"}
                </Button>

              </div>

            </form>

          </div>

        </div>

      )}

    </main>
  )
}