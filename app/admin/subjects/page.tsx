"use client"

import {
  BookOpen,
  CheckCircle2,
  Edit,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import { AdminSidebar } from "../../../components/admin/admin-sidebar"

import { Button } from "@/components/ui/button"

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

import {
  Textarea,
} from "@/components/ui/textarea"

import {
  Switch,
} from "@/components/ui/switch"

type Subject = {
  id: string
  name: string
  code: string
  description: string | null
  level: string
  syllabus: string | null
  price: number
  is_active: boolean
  created_at: string
}

type SubjectForm = {
  name: string
  code: string
  description: string
  level: string
  syllabus: string
  price: string
  is_active: boolean
}

const levelOptions = [
  "O-Level",
  "A-Level",
]

const emptyForm: SubjectForm = {
  name: "",
  code: "",
  description: "",
  level: "O-Level",
  syllabus: "",
  price: "0",
  is_active: true,
}

export default function AdminSubjectsPage() {
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
    levelFilter,
    setLevelFilter,
  ] = useState("All")

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All")

  const [
    showModal,
    setShowModal,
  ] = useState(false)

  const [
    editingSubject,
    setEditingSubject,
  ] =
    useState<Subject | null>(
      null
    )

  const [
    form,
    setForm,
  ] =
    useState<SubjectForm>(
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

  const loadSubjects =
    async () => {
      try {
        setLoading(true)
        setError("")

        const response =
          await fetch(
            "/api/admin/subjects",
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
              "Unable to load subjects."
          )
        }

        setSubjects(
          data.subjects ||
            []
        )
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load subjects."
        )
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    loadSubjects()
  }, [])

  const filteredSubjects =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      return subjects.filter(
        (subject) => {
          const matchesSearch =
            !query ||
            subject.name
              .toLowerCase()
              .includes(
                query
              ) ||
            subject.code
              .toLowerCase()
              .includes(
                query
              ) ||
            (
              subject.description ||
              ""
            )
              .toLowerCase()
              .includes(
                query
              ) ||
            (
              subject.syllabus ||
              ""
            )
              .toLowerCase()
              .includes(
                query
              )

          const matchesLevel =
            levelFilter ===
              "All" ||
            subject.level ===
              levelFilter

          const matchesStatus =
            statusFilter ===
              "All" ||
            (
              statusFilter ===
                "Active"
                ? subject.is_active
                : !subject.is_active
            )

          return (
            matchesSearch &&
            matchesLevel &&
            matchesStatus
          )
        }
      )
    }, [
      subjects,
      search,
      levelFilter,
      statusFilter,
    ])

  const activeCount =
    subjects.filter(
      (subject) =>
        subject.is_active
    ).length

  const inactiveCount =
    subjects.filter(
      (subject) =>
        !subject.is_active
    ).length

  const openAddModal =
    () => {
      setEditingSubject(null)
      setForm(emptyForm)
      setError("")
      setSuccess("")
      setShowModal(true)
    }

  const openEditModal =
    (
      subject: Subject
    ) => {
      setEditingSubject(
        subject
      )

      setForm({
        name:
          subject.name,
        code:
          subject.code,
        description:
          subject.description ||
          "",
        level:
          subject.level,
        syllabus:
          subject.syllabus ||
          "",
        price:
          String(
            subject.price ??
              0
          ),
        is_active:
          subject.is_active,
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
      setEditingSubject(
        null
      )
      setForm(emptyForm)
      setError("")
    }

  const handleSave =
    async (
      event: React.FormEvent
    ) => {
      event.preventDefault()

      setError("")
      setSuccess("")

      const name =
        form.name.trim()

      const code =
        form.code
          .trim()
          .toUpperCase()

      const description =
        form.description.trim()

      const level =
        form.level.trim()

      const syllabus =
        form.syllabus.trim()

      const priceText =
        form.price.trim()

      const price =
        Number(priceText)

      if (!name) {
        setError(
          "Subject name is required."
        )
        return
      }

      if (!code) {
        setError(
          "Subject code is required."
        )
        return
      }

      if (!level) {
        setError(
          "Subject level is required."
        )
        return
      }

      if (!priceText) {
        setError(
          "Subject price is required."
        )
        return
      }

      if (
        !Number.isFinite(price)
      ) {
        setError(
          "Subject price must be a valid number."
        )
        return
      }

      if (price < 0) {
        setError(
          "Subject price cannot be negative."
        )
        return
      }

      if (
        Math.round(
          price * 100
        ) /
          100 !==
        price
      ) {
        setError(
          "Price can have a maximum of 2 decimal places."
        )
        return
      }

      try {
        setSaving(true)

        const isEditing =
          Boolean(
            editingSubject
          )

        const url =
          isEditing
            ? `/api/admin/subjects/${editingSubject?.id}`
            : "/api/admin/subjects"

        const response =
          await fetch(url, {
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
            body: JSON.stringify({
              name,
              code,
              description,
              level,
              syllabus,
              price,
              is_active:
                form.is_active,
            }),
          })

        const data =
          await response.json()

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to save subject."
          )
        }

        await loadSubjects()

        setSuccess(
          isEditing
            ? "Subject updated successfully."
            : "Subject created successfully."
        )

        setTimeout(() => {
          setShowModal(false)
          setEditingSubject(
            null
          )
          setForm(emptyForm)
          setSuccess("")
        }, 700)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to save subject."
        )
      } finally {
        setSaving(false)
      }
    }

  const toggleStatus =
    async (
      subject: Subject
    ) => {
      try {
        setError("")

        const response =
          await fetch(
            `/api/admin/subjects/${subject.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type":
                  "application/json",
              },
              credentials:
                "include",
              body: JSON.stringify({
                is_active:
                  !subject.is_active,
              }),
            }
          )

        const data =
          await response.json()

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to update subject status."
          )
        }

        await loadSubjects()
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to update subject status."
        )
      }
    }

  const handleDelete =
    async (
      subject: Subject
    ) => {
      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${subject.name}"? This action cannot be undone.`
        )

      if (!confirmed) {
        return
      }

      try {
        setDeletingId(
          subject.id
        )

        setError("")

        const response =
          await fetch(
            `/api/admin/subjects/${subject.id}`,
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
              "Unable to delete subject."
          )
        }

        await loadSubjects()

        setSuccess(
          "Subject deleted successfully."
        )

        setTimeout(
          () => setSuccess(""),
          3000
        )
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to delete subject."
        )
      } finally {
        setDeletingId(null)
      }
    }

  return (
    <main className="min-h-screen bg-muted/30">
      <AdminSidebar />

      <div className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">

          {/* Page Header */}
          <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">
                Academic Management
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight">
                Subjects
              </h1>

              <p className="mt-2 text-muted-foreground">
                Create, manage and
                organise the academic
                subjects offered by
                GlobeDK Elite Academy.
              </p>
            </div>

            <Button
              onClick={
                openAddModal
              }
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Subject
            </Button>
          </section>

          {/* Messages */}
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

          {/* Statistics */}
          <section className="mb-6 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Subjects
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {
                        subjects.length
                      }
                    </p>
                  </div>

                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <BookOpen className="h-5 w-5" />
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

          {/* Subject Management */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle>
                    Subject Catalogue
                  </CardTitle>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage all academic
                    subjects in the
                    system.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      value={search}
                      onChange={(event) =>
                        setSearch(
                          event.target
                            .value
                        )
                      }
                      placeholder="Search subjects..."
                      className="pl-9 sm:w-64"
                    />
                  </div>

                  {/* Level Filter */}
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
                      (level) => (
                        <option
                          key={level}
                          value={
                            level
                          }
                        >
                          {level}
                        </option>
                      )
                    )}
                  </select>

                  {/* Status Filter */}
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
                    Loading subjects...
                  </p>
                </div>
              ) : filteredSubjects.length ===
                0 ? (
                <div className="rounded-xl border border-dashed p-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                    <BookOpen className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <h3 className="mt-4 font-semibold">
                    No subjects found
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {search ||
                    levelFilter !==
                      "All" ||
                    statusFilter !==
                      "All"
                      ? "Try changing your search or filters."
                      : "Start by adding your first subject."}
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
                        Add Subject
                      </Button>
                    )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1100px]">
                    <thead>
                      <tr className="border-b text-left text-sm text-muted-foreground">

                        <th className="px-4 py-3 font-medium">
                          Subject
                        </th>

                        <th className="px-4 py-3 font-medium">
                          Code
                        </th>

                        <th className="px-4 py-3 font-medium">
                          Level
                        </th>

                        <th className="px-4 py-3 font-medium">
                          Syllabus
                        </th>

                        <th className="px-4 py-3 font-medium">
                          Price
                        </th>

                        <th className="px-4 py-3 font-medium">
                          Description
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
                      {filteredSubjects.map(
                        (
                          subject
                        ) => (
                          <tr
                            key={
                              subject.id
                            }
                            className="border-b last:border-0 hover:bg-muted/40"
                          >

                            {/* Subject */}
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                  <BookOpen className="h-4 w-4" />
                                </div>

                                <div>
                                  <p className="font-semibold">
                                    {
                                      subject.name
                                    }
                                  </p>

                                  <p className="text-xs text-muted-foreground">
                                    Subject
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Code */}
                            <td className="px-4 py-4">
                              <Badge variant="outline">
                                {
                                  subject.code
                                }
                              </Badge>
                            </td>

                            {/* Level */}
                            <td className="px-4 py-4">
                              <Badge variant="secondary">
                                {
                                  subject.level
                                }
                              </Badge>
                            </td>

                            {/* Syllabus */}
                            <td className="max-w-xs px-4 py-4">
                              <p className="truncate text-sm">
                                {
                                  subject.syllabus ||
                                  "Not specified"
                                }
                              </p>
                            </td>

                            {/* Price */}
                            <td className="px-4 py-4">
                              <span className="font-semibold">
                                $
                                {Number(
                                  subject.price ||
                                    0
                                ).toFixed(
                                  2
                                )}
                              </span>

                              <p className="text-xs text-muted-foreground">
                                per month
                              </p>
                            </td>

                            {/* Description */}
                            <td className="max-w-xs px-4 py-4">
                              <p className="truncate text-sm text-muted-foreground">
                                {subject.description ||
                                  "No description"}
                              </p>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-4">
                              {subject.is_active ? (
                                <Badge className="gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Active
                                </Badge>
                              ) : (
                                <Badge
                                  variant="secondary"
                                  className="gap-1"
                                >
                                  <XCircle className="h-3 w-3" />
                                  Inactive
                                </Badge>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-4">
                              <div className="flex justify-end gap-2">

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    openEditModal(
                                      subject
                                    )
                                  }
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    toggleStatus(
                                      subject
                                    )
                                  }
                                >
                                  {subject.is_active
                                    ? "Deactivate"
                                    : "Activate"}
                                </Button>

                                <Button
                                  variant="outline"
                                  size="icon"
                                  disabled={
                                    deletingId ===
                                    subject.id
                                  }
                                  onClick={() =>
                                    handleDelete(
                                      subject
                                    )
                                  }
                                  className="text-destructive hover:text-destructive"
                                >
                                  {deletingId ===
                                  subject.id ? (
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl border bg-background shadow-xl">

            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingSubject
                    ? "Edit Subject"
                    : "Add Subject"}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {editingSubject
                    ? "Update the subject information below."
                    : "Add a new academic subject to the catalogue."}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={
                  closeModal
                }
                disabled={saving}
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

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="subject-name">
                    Subject Name
                  </Label>

                  <Input
                    id="subject-name"
                    value={
                      form.name
                    }
                    onChange={(
                      event
                    ) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          name: event
                            .target
                            .value,
                        })
                      )
                    }
                    placeholder="e.g. Mathematics"
                    disabled={
                      saving
                    }
                  />
                </div>

                {/* Code */}
                <div className="space-y-2">
                  <Label htmlFor="subject-code">
                    Subject Code
                  </Label>

                  <Input
                    id="subject-code"
                    value={
                      form.code
                    }
                    onChange={(
                      event
                    ) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          code: event
                            .target
                            .value
                            .toUpperCase(),
                        })
                      )
                    }
                    placeholder="e.g. MATH"
                    disabled={
                      saving
                    }
                  />

                  <p className="text-xs text-muted-foreground">
                    The subject code
                    must be unique.
                  </p>
                </div>

                {/* Level */}
                <div className="space-y-2">
                  <Label htmlFor="subject-level">
                    Level
                  </Label>

                  <select
                    id="subject-level"
                    value={
                      form.level
                    }
                    onChange={(
                      event
                    ) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          level: event
                            .target
                            .value,
                        })
                      )
                    }
                    disabled={
                      saving
                    }
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  >
                    {levelOptions.map(
                      (level) => (
                        <option
                          key={level}
                          value={
                            level
                          }
                        >
                          {level}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Syllabus */}
                <div className="space-y-2">
                  <Label htmlFor="subject-syllabus">
                    Syllabus
                  </Label>

                  <Input
                    id="subject-syllabus"
                    value={
                      form.syllabus
                    }
                    onChange={(
                      event
                    ) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          syllabus:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    placeholder="e.g. ZIMSEC"
                    disabled={
                      saving
                    }
                  />

                  <p className="text-xs text-muted-foreground">
                    Enter the syllabus or
                    curriculum used for
                    this subject.
                  </p>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="subject-price">
                    Monthly Price (USD)
                  </Label>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      $
                    </span>

                    <Input
                      id="subject-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        form.price
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,
                            price:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                      placeholder="15.00"
                      className="pl-7"
                      disabled={
                        saving
                      }
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Set the monthly price
                    charged for this
                    subject.
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="subject-description">
                    Description
                  </Label>

                  <Textarea
                    id="subject-description"
                    value={
                      form.description
                    }
                    onChange={(
                      event
                    ) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          description:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    placeholder="Briefly describe this subject..."
                    rows={
                      4
                    }
                    disabled={
                      saving
                    }
                  />
                </div>

                {/* Active */}
                <div className="flex items-center justify-between rounded-xl border p-4">
                  <div>
                    <p className="text-sm font-medium">
                      Active Subject
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Active subjects
                      can be used
                      across the
                      academy.
                    </p>
                  </div>

                  <Switch
                    checked={
                      form.is_active
                    }
                    onCheckedChange={(
                      checked
                    ) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          is_active:
                            checked,
                        })
                      )
                    }
                    disabled={
                      saving
                    }
                  />
                </div>
              </div>

              {/* Modal Footer */}
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
                    : editingSubject
                    ? "Save Changes"
                    : "Create Subject"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}