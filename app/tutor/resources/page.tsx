"use client"

import {
  BookOpen,
  CheckCircle2,
  Download,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Link as LinkIcon,
  Loader2,
  Plus,
  Search,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import {
  useRouter,
} from "next/navigation"

import TutorSidebar from "@/components/tutor/TutorSidebar"

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

import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Subject = {
  id: string
  name: string
  is_active?: boolean
}

type Resource = {
  id: string
  created_by: string
  title: string
  description: string | null
  resource_type: string
  subject: string | null
  level: string | null
  curriculum: string | null
  url: string | null

  file_path: string | null
  file_name: string | null
  file_size: number | null
  mime_type: string | null

  file_url?: string | null
  preview_url?: string | null
  download_url?: string | null

  is_published: boolean
  created_at: string
  updated_at: string
}

type ResourceForm = {
  title: string
  description: string
  resource_type: string
  subject: string
  level: string
  curriculum: string
  url: string
  is_published: boolean
}

const emptyForm: ResourceForm = {
  title: "",
  description: "",
  resource_type: "Notes",
  subject: "",
  level: "",
  curriculum: "",
  url: "",
  is_published: true,
}

const resourceTypes = [
  "Notes",
  "Past Paper",
  "Revision Material",
  "Video",
  "Link",
  "Worksheet",
  "Study Guide",
  "Other",
]

function formatFileSize(bytes: number | null) {
  if (!bytes) {
    return ""
  }

  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isPdf(resource: Resource) {
  return (
    resource.mime_type === "application/pdf" ||
    Boolean(resource.file_path)
  )
}

export default function TutorResourcesPage() {
  const router = useRouter()

  const fileInputRef =
    useRef<HTMLInputElement | null>(null)

  const [resources, setResources] =
    useState<Resource[]>([])

  const [subjects, setSubjects] =
    useState<Subject[]>([])

  const [loading, setLoading] =
    useState(true)

  const [loadingSubjects, setLoadingSubjects] =
    useState(true)

  const [search, setSearch] =
    useState("")

  const [levelFilter, setLevelFilter] =
    useState("all")

  const [typeFilter, setTypeFilter] =
    useState("all")

  const [showModal, setShowModal] =
    useState(false)

  const [
    editingResource,
    setEditingResource,
  ] = useState<Resource | null>(null)

  const [form, setForm] =
    useState<ResourceForm>(emptyForm)

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)

  const [saving, setSaving] =
    useState(false)

  const [
    deletingId,
    setDeletingId,
  ] = useState<string | null>(null)

  const [
    uploadingFile,
    setUploadingFile,
  ] = useState(false)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const [
    previewResource,
    setPreviewResource,
  ] = useState<Resource | null>(null)

  /*
   * ----------------------------------------------------------
   * LOAD SUBJECTS
   * ----------------------------------------------------------
   */

  async function loadSubjects() {
    try {
      setLoadingSubjects(true)

      const response = await fetch(
        "/api/tutor/subjects",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      )

      const data = await response.json()

      if (response.status === 401) {
        router.push(
          `/login?callbackUrl=${encodeURIComponent(
            "/tutor/resources"
          )}`
        )

        return
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load subjects."
        )
      }

      setSubjects(
        Array.isArray(data.subjects)
          ? data.subjects
          : []
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load subjects."
      )
    } finally {
      setLoadingSubjects(false)
    }
  }

  /*
   * ----------------------------------------------------------
   * LOAD RESOURCES
   * ----------------------------------------------------------
   */

  async function loadResources() {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(
        "/api/tutor/resources",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      )

      const data = await response.json()

      if (response.status === 401) {
        router.push(
          `/login?callbackUrl=${encodeURIComponent(
            "/tutor/resources"
          )}`
        )

        return
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load resources."
        )
      }

      setResources(
        Array.isArray(data.resources)
          ? data.resources
          : []
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load resources."
      )
    } finally {
      setLoading(false)
    }
  }

  /*
   * ----------------------------------------------------------
   * INITIAL LOAD
   * ----------------------------------------------------------
   */

  useEffect(() => {
    loadResources()
    loadSubjects()
  }, [])

  /*
   * ----------------------------------------------------------
   * FILTERING
   * ----------------------------------------------------------
   */

  const filteredResources = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase()

    return resources.filter(
      (resource) => {
        const matchesSearch =
          !searchValue ||
          resource.title
            .toLowerCase()
            .includes(searchValue) ||
          resource.description
            ?.toLowerCase()
            .includes(searchValue) ||
          resource.subject
            ?.toLowerCase()
            .includes(searchValue) ||
          resource.file_name
            ?.toLowerCase()
            .includes(searchValue)

        const matchesLevel =
          levelFilter === "all" ||
          resource.level === levelFilter

        const matchesType =
          typeFilter === "all" ||
          resource.resource_type ===
            typeFilter

        return (
          matchesSearch &&
          matchesLevel &&
          matchesType
        )
      }
    )
  }, [
    resources,
    search,
    levelFilter,
    typeFilter,
  ])

  /*
   * ----------------------------------------------------------
   * STATISTICS
   * ----------------------------------------------------------
   */

  const statistics = useMemo(() => {
    return {
      total: resources.length,

      published:
        resources.filter(
          (resource) =>
            resource.is_published
        ).length,

      oLevel:
        resources.filter(
          (resource) =>
            resource.level === "O-Level"
        ).length,

      aLevel:
        resources.filter(
          (resource) =>
            resource.level === "A-Level"
        ).length,

      pdfs:
        resources.filter((resource) =>
          isPdf(resource)
        ).length,
    }
  }, [resources])

  /*
   * ----------------------------------------------------------
   * MODALS
   * ----------------------------------------------------------
   */

  function openCreateModal() {
    setEditingResource(null)

    setForm({
      ...emptyForm,
    })

    setSelectedFile(null)

    setError("")

    setSuccess("")

    setShowModal(true)
  }

  function openEditModal(
    resource: Resource
  ) {
    setEditingResource(resource)

    setForm({
      title: resource.title,

      description:
        resource.description || "",

      resource_type:
        resource.resource_type ||
        "Other",

      subject:
        resource.subject || "",

      level:
        resource.level || "",

      curriculum:
        resource.curriculum || "",

      url:
        resource.url || "",

      is_published:
        resource.is_published,
    })

    setSelectedFile(null)

    setError("")

    setSuccess("")

    setShowModal(true)
  }

  function closeModal() {
    if (
      saving ||
      uploadingFile
    ) {
      return
    }

    setShowModal(false)

    setEditingResource(null)

    setForm({
      ...emptyForm,
    })

    setSelectedFile(null)

    setError("")

    setSuccess("")
  }

  function updateField(
    field: keyof ResourceForm,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  /*
   * ----------------------------------------------------------
   * PDF SELECTION
   * ----------------------------------------------------------
   */

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    setError("")
    setSuccess("")

    if (
      file.type !==
      "application/pdf"
    ) {
      setError(
        "Only PDF files are allowed."
      )

      event.target.value = ""

      return
    }

    if (
      file.size >
      20 * 1024 * 1024
    ) {
      setError(
        "PDF file is too large. Maximum size is 20 MB."
      )

      event.target.value = ""

      return
    }

    setSelectedFile(file)

    /*
     * If title is empty,
     * automatically use filename.
     */

    if (!form.title.trim()) {
      updateField(
        "title",
        file.name.replace(
          /\.pdf$/i,
          ""
        )
      )
    }
  }

  /*
   * ----------------------------------------------------------
   * SAVE RESOURCE
   * ----------------------------------------------------------
   */

  async function saveResource() {
    if (!form.title.trim()) {
      setError(
        "Please enter a resource title."
      )

      return
    }

    /*
     * If a PDF was selected,
     * use the upload API.
     */

    if (selectedFile) {
      await uploadPdf()

      return
    }

    /*
     * Otherwise use normal
     * JSON resource API.
     */

    try {
      setSaving(true)

      setError("")

      setSuccess("")

      const isEditing =
        Boolean(editingResource)

      const response =
        await fetch(
          isEditing
            ? `/api/tutor/resources/${editingResource?.id}`
            : "/api/tutor/resources",
          {
            method: isEditing
              ? "PATCH"
              : "POST",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              title:
                form.title,

              description:
                form.description,

              resource_type:
                form.resource_type,

              subject:
                form.subject,

              level:
                form.level,

              curriculum:
                form.curriculum,

              url:
                form.url,

              is_published:
                form.is_published,
            }),
          }
        )

      const data =
        await response.json()

      if (
        response.status === 401
      ) {
        router.push(
          `/login?callbackUrl=${encodeURIComponent(
            "/tutor/resources"
          )}`
        )

        return
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save resource."
        )
      }

      if (isEditing) {
        setResources(
          (current) =>
            current.map(
              (resource) =>
                resource.id ===
                data.resource.id
                  ? data.resource
                  : resource
            )
        )
      } else {
        setResources(
          (current) => [
            data.resource,
            ...current,
          ]
        )
      }

      setSuccess(
        isEditing
          ? "Resource updated successfully."
          : "Resource created successfully."
      )

      setTimeout(() => {
        closeModal()
      }, 700)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save resource."
      )
    } finally {
      setSaving(false)
    }
  }

  /*
   * ----------------------------------------------------------
   * PDF UPLOAD
   * ----------------------------------------------------------
   */

  async function uploadPdf() {
    if (!selectedFile) {
      return
    }

    try {
      setUploadingFile(true)

      setError("")

      setSuccess("")

      const formData =
        new FormData()

      formData.append(
        "file",
        selectedFile
      )

      formData.append(
        "title",
        form.title
      )

      formData.append(
        "description",
        form.description
      )

      formData.append(
        "resource_type",
        form.resource_type
      )

      formData.append(
        "subject",
        form.subject
      )

      formData.append(
        "level",
        form.level
      )

      formData.append(
        "curriculum",
        form.curriculum
      )

      formData.append(
        "url",
        form.url
      )

      formData.append(
        "is_published",
        String(
          form.is_published
        )
      )

      if (editingResource) {
        formData.append(
          "resource_id",
          editingResource.id
        )
      }

      const response =
        await fetch(
          "/api/tutor/resources/upload",
          {
            method: "POST",

            credentials:
              "include",

            body: formData,
          }
        )

      const data =
        await response.json()

      if (
        response.status === 401
      ) {
        router.push(
          `/login?callbackUrl=${encodeURIComponent(
            "/tutor/resources"
          )}`
        )

        return
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to upload PDF."
        )
      }

      /*
       * Reload resources so
       * latest file information
       * is displayed.
       */

      await loadResources()

      setSuccess(
        editingResource
          ? "PDF replaced successfully."
          : "PDF uploaded successfully."
      )

      setSelectedFile(null)

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          ""
      }

      setTimeout(() => {
        closeModal()
      }, 700)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload PDF."
      )
    } finally {
      setUploadingFile(false)
    }
  }

  /*
   * ----------------------------------------------------------
   * DELETE
   * ----------------------------------------------------------
   */

  async function deleteResource(
    resource: Resource
  ) {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${resource.title}"? This cannot be undone.`
      )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(
        resource.id
      )

      setError("")

      const response =
        await fetch(
          `/api/tutor/resources/${resource.id}`,
          {
            method: "DELETE",

            credentials:
              "include",
          }
        )

      const data =
        await response.json()

      if (
        response.status === 401
      ) {
        router.push(
          `/login?callbackUrl=${encodeURIComponent(
            "/tutor/resources"
          )}`
        )

        return
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to delete resource."
        )
      }

      setResources(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              resource.id
          )
      )

      setSuccess(
        "Resource deleted successfully."
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete resource."
      )
    } finally {
      setDeletingId(null)
    }
  }

  /*
   * ----------------------------------------------------------
   * ICON
   * ----------------------------------------------------------
   */

  function getResourceIcon(
    type: string,
    pdf: boolean
  ) {
    if (pdf) {
      return FileText
    }

    if (type === "Video") {
      return Video
    }

    if (type === "Link") {
      return LinkIcon
    }

    return FileText
  }

  /*
   * ----------------------------------------------------------
   * UI
   * ----------------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-muted/30">
      <TutorSidebar tutorName="Tutor" />

      <div className="pl-[72px] lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur">
          <div>
            <h1 className="text-xl font-semibold">
              Resources
            </h1>

            <p className="text-sm text-muted-foreground">
              Manage your teaching materials,
              PDFs and learning resources.
            </p>
          </div>

          <Button
            onClick={
              openCreateModal
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </header>

        <main className="space-y-6 p-6">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {success &&
            !showModal && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

          {/* STATISTICS */}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>
                  Total Resources
                </CardDescription>

                <CardTitle className="text-3xl">
                  {statistics.total}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  All materials
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>
                  Published
                </CardDescription>

                <CardTitle className="text-3xl">
                  {statistics.published}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  Available
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>
                  PDF Resources
                </CardDescription>

                <CardTitle className="text-3xl">
                  {statistics.pdfs}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Uploaded documents
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>
                  O-Level
                </CardDescription>

                <CardTitle className="text-3xl">
                  {statistics.oLevel}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">
                  O-Level resources
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>
                  A-Level
                </CardDescription>

                <CardTitle className="text-3xl">
                  {statistics.aLevel}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">
                  A-Level resources
                </p>
              </CardContent>
            </Card>
          </div>

          {/* RESOURCE LIST */}

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle>
                    My Resources
                  </CardTitle>

                  <CardDescription>
                    Teaching materials you
                    have created.
                  </CardDescription>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      value={search}
                      onChange={(
                        event
                      ) =>
                        setSearch(
                          event.target
                            .value
                        )
                      }
                      placeholder="Search resources..."
                      className="pl-9 sm:w-[240px]"
                    />
                  </div>

                  <Select
                    value={
                      levelFilter
                    }
                    onValueChange={
                      setLevelFilter
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <Filter className="mr-2 h-4 w-4" />

                      <SelectValue placeholder="Level" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="all">
                        All Levels
                      </SelectItem>

                      <SelectItem value="O-Level">
                        O-Level
                      </SelectItem>

                      <SelectItem value="A-Level">
                        A-Level
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={
                      typeFilter
                    }
                    onValueChange={
                      setTypeFilter
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[170px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="all">
                        All Types
                      </SelectItem>

                      {resourceTypes.map(
                        (type) => (
                          <SelectItem
                            key={type}
                            value={type}
                          >
                            {type}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-sm text-muted-foreground">
                  <Loader2 className="mb-3 h-6 w-6 animate-spin" />

                  Loading resources...
                </div>
              ) : filteredResources.length ===
                0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                  <BookOpen className="mb-4 h-10 w-10 text-muted-foreground" />

                  <h3 className="font-semibold">
                    No resources found
                  </h3>

                  <p className="mt-1 max-w-md text-sm text-muted-foreground">
                    Create your first teaching
                    resource by uploading a PDF
                    or adding a useful link.
                  </p>

                  <Button
                    className="mt-5"
                    onClick={
                      openCreateModal
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Resource
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredResources.map(
                    (resource) => {
                      const pdf =
                        isPdf(
                          resource
                        )

                      const ResourceIcon =
                        getResourceIcon(
                          resource.resource_type,
                          pdf
                        )

                      return (
                        <Card
                          key={
                            resource.id
                          }
                          className="group overflow-hidden transition-shadow hover:shadow-md"
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex min-w-0 gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                  <ResourceIcon className="h-5 w-5" />
                                </div>

                                <div className="min-w-0">
                                  <CardTitle className="line-clamp-2 text-base">
                                    {
                                      resource.title
                                    }
                                  </CardTitle>

                                  <CardDescription className="mt-1">
                                    {
                                      resource.resource_type
                                    }

                                    {pdf &&
                                      resource.file_size && (
                                        <>
                                          {" "}
                                          •{" "}
                                          {formatFileSize(
                                            resource.file_size
                                          )}
                                        </>
                                      )}
                                  </CardDescription>
                                </div>
                              </div>

                              <Badge
                                variant={
                                  resource.is_published
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {resource.is_published
                                  ? "Published"
                                  : "Draft"}
                              </Badge>
                            </div>
                          </CardHeader>

                          <CardContent className="space-y-4">
                            {resource.description && (
                              <p className="line-clamp-3 text-sm text-muted-foreground">
                                {
                                  resource.description
                                }
                              </p>
                            )}

                            {pdf &&
                              resource.file_name && (
                                <div className="rounded-lg border bg-muted/30 p-3">
                                  <div className="flex items-center gap-3">
                                    <FileText className="h-8 w-8 shrink-0 text-primary" />

                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-medium">
                                        {
                                          resource.file_name
                                        }
                                      </p>

                                      <p className="text-xs text-muted-foreground">
                                        PDF

                                        {resource.file_size
                                          ? ` • ${formatFileSize(
                                              resource.file_size
                                            )}`
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                            <div className="flex flex-wrap gap-2">
                              {resource.subject && (
                                <Badge variant="outline">
                                  {
                                    resource.subject
                                  }
                                </Badge>
                              )}

                              {resource.level && (
                                <Badge variant="outline">
                                  {
                                    resource.level
                                  }
                                </Badge>
                              )}

                              {resource.curriculum && (
                                <Badge variant="outline">
                                  {
                                    resource.curriculum
                                  }
                                </Badge>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
                              <div className="flex flex-wrap gap-2">
                                {pdf &&
                                  resource.preview_url && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        setPreviewResource(
                                          resource
                                        )
                                      }
                                    >
                                      <Eye className="mr-2 h-4 w-4" />

                                      Preview
                                    </Button>
                                  )}

                                {pdf &&
                                  resource.download_url && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      asChild
                                    >
                                      <a
                                        href={
                                          resource.download_url
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download={
                                          resource.file_name ||
                                          undefined
                                        }
                                      >
                                        <Download className="mr-2 h-4 w-4" />

                                        Download
                                      </a>
                                    </Button>
                                  )}

                                {!pdf &&
                                  resource.url && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      asChild
                                    >
                                      <a
                                        href={
                                          resource.url
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <ExternalLink className="mr-2 h-4 w-4" />

                                        Open
                                      </a>
                                    </Button>
                                  )}

                                {!pdf &&
                                  !resource.url && (
                                    <span className="text-xs text-muted-foreground">
                                      No file or link
                                    </span>
                                  )}
                              </div>

                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    openEditModal(
                                      resource
                                    )
                                  }
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={
                                    deletingId ===
                                    resource.id
                                  }
                                  onClick={() =>
                                    deleteResource(
                                      resource
                                    )
                                  }
                                >
                                  {deletingId ===
                                  resource.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    }
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-h-[92vh] w-full max-w-2xl overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>
                    {editingResource
                      ? "Edit Resource"
                      : "Add Resource"}
                  </CardTitle>

                  <CardDescription>
                    {editingResource
                      ? "Update your teaching resource or replace its PDF."
                      : "Add a teaching resource for your students."}
                  </CardDescription>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={
                    closeModal
                  }
                  disabled={
                    saving ||
                    uploadingFile
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              {/* TITLE */}

              <div className="space-y-2">
                <Label htmlFor="resource-title">
                  Resource Title
                </Label>

                <Input
                  id="resource-title"
                  value={
                    form.title
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "title",
                      event.target
                        .value
                    )
                  }
                  placeholder="e.g. Algebra Revision Notes"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="space-y-2">
                <Label htmlFor="resource-description">
                  Description
                </Label>

                <Textarea
                  id="resource-description"
                  value={
                    form.description
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "description",
                      event.target
                        .value
                    )
                  }
                  placeholder="Briefly describe this resource..."
                  rows={4}
                />
              </div>

              {/* TYPE / SUBJECT */}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    Resource Type
                  </Label>

                  <Select
                    value={
                      form.resource_type
                    }
                    onValueChange={(
                      value
                    ) =>
                      updateField(
                        "resource_type",
                        value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {resourceTypes.map(
                        (type) => (
                          <SelectItem
                            key={type}
                            value={type}
                          >
                            {type}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* DATABASE SUBJECT COMBOBOX */}

                <div className="space-y-2">
                  <Label>
                    Subject
                  </Label>

                  <Select
                    value={
                      form.subject ||
                      "none"
                    }
                    onValueChange={(
                      value
                    ) =>
                      updateField(
                        "subject",
                        value ===
                          "none"
                          ? ""
                          : value
                      )
                    }
                    disabled={
                      loadingSubjects
                    }
                  >
                    <SelectTrigger>
                      {loadingSubjects ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />

                          <span>
                            Loading subjects...
                          </span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Select subject" />
                      )}
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="none">
                        No subject
                      </SelectItem>

                      {subjects.map(
                        (subject) => (
                          <SelectItem
                            key={
                              subject.id
                            }
                            value={
                              subject.name
                            }
                          >
                            {
                              subject.name
                            }
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>

                  {!loadingSubjects &&
                    subjects.length ===
                      0 && (
                      <p className="text-xs text-destructive">
                        No active subjects
                        were found in the
                        database.
                      </p>
                    )}

                  {!loadingSubjects &&
                    subjects.length >
                      0 && (
                      <p className="text-xs text-muted-foreground">
                        Select a subject from
                        the subjects configured
                        in the database.
                      </p>
                    )}
                </div>
              </div>

              {/* LEVEL / CURRICULUM */}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    Level
                  </Label>

                  <Select
                    value={
                      form.level ||
                      "none"
                    }
                    onValueChange={(
                      value
                    ) =>
                      updateField(
                        "level",
                        value ===
                          "none"
                          ? ""
                          : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="none">
                        No level
                      </SelectItem>

                      <SelectItem value="O-Level">
                        O-Level
                      </SelectItem>

                      <SelectItem value="A-Level">
                        A-Level
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    Curriculum
                  </Label>

                  <Select
                    value={
                      form.curriculum ||
                      "none"
                    }
                    onValueChange={(
                      value
                    ) =>
                      updateField(
                        "curriculum",
                        value ===
                          "none"
                          ? ""
                          : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select curriculum" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="none">
                        No curriculum
                      </SelectItem>

                      <SelectItem value="ZIMSEC">
                        ZIMSEC
                      </SelectItem>

                      <SelectItem value="Cambridge">
                        Cambridge
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* PDF UPLOAD */}

              <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
                <div>
                  <Label>
                    PDF Resource
                  </Label>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Upload a PDF up to 20 MB.
                    PDFs are stored securely
                    in private Supabase Storage.
                  </p>
                </div>

                <input
                  ref={
                    fileInputRef
                  }
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={
                    handleFileChange
                  }
                  className="hidden"
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={
                    saving ||
                    uploadingFile
                  }
                >
                  <Upload className="mr-2 h-4 w-4" />

                  {editingResource &&
                  isPdf(
                    editingResource
                  )
                    ? "Replace PDF"
                    : "Choose PDF"}
                </Button>

                {selectedFile && (
                  <div className="rounded-lg border bg-background p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <FileText className="h-8 w-8 shrink-0 text-primary" />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {
                              selectedFile.name
                            }
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(
                              selectedFile.size
                            )}
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setSelectedFile(
                            null
                          )
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {!selectedFile &&
                  editingResource &&
                  isPdf(
                    editingResource
                  ) && (
                    <div className="rounded-lg border bg-background p-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary" />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {
                              editingResource.file_name
                            }
                          </p>

                          <p className="text-xs text-muted-foreground">
                            Current PDF

                            {editingResource.file_size
                              ? ` • ${formatFileSize(
                                  editingResource.file_size
                                )}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              </div>

              {/* URL */}

              <div className="space-y-2">
                <Label htmlFor="resource-url">
                  Resource URL
                </Label>

                <Input
                  id="resource-url"
                  type="url"
                  value={
                    form.url
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "url",
                      event.target
                        .value
                    )
                  }
                  placeholder="https://..."
                />

                <p className="text-xs text-muted-foreground">
                  Use this for Google Drive,
                  YouTube, websites or other
                  external resources. If you
                  upload a PDF, the PDF takes
                  priority.
                </p>
              </div>

              {/* PUBLISH */}

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">
                    Publish Resource
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Published resources can be
                    made available to students.
                  </p>
                </div>

                <Button
                  type="button"
                  variant={
                    form.is_published
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    updateField(
                      "is_published",
                      !form.is_published
                    )
                  }
                >
                  {form.is_published
                    ? "Published"
                    : "Draft"}
                </Button>
              </div>

              {/* ACTIONS */}

              <div className="flex justify-end gap-3 border-t pt-5">
                <Button
                  variant="outline"
                  onClick={
                    closeModal
                  }
                  disabled={
                    saving ||
                    uploadingFile
                  }
                >
                  Cancel
                </Button>

                <Button
                  onClick={
                    saveResource
                  }
                  disabled={
                    saving ||
                    uploadingFile
                  }
                >
                  {saving ||
                  uploadingFile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                      {uploadingFile
                        ? "Uploading PDF..."
                        : "Saving..."}
                    </>
                  ) : editingResource ? (
                    "Update Resource"
                  ) : (
                    "Create Resource"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* =====================================================
          PDF PREVIEW
      ===================================================== */}

      {previewResource &&
        previewResource.preview_url && (
          <div className="fixed inset-0 z-[60] flex flex-col bg-black/80">
            <div className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4">
              <div className="min-w-0">
                <h2 className="truncate font-semibold">
                  {
                    previewResource.title
                  }
                </h2>

                <p className="text-xs text-muted-foreground">
                  {
                    previewResource.file_name
                  }
                </p>
              </div>

              <div className="flex items-center gap-2">
                {previewResource.download_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={
                        previewResource.download_url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      download={
                        previewResource.file_name ||
                        undefined
                      }
                    >
                      <Download className="mr-2 h-4 w-4" />

                      Download
                    </a>
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setPreviewResource(
                      null
                    )
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="min-h-0 flex-1 p-3">
              <iframe
                src={
                  previewResource.preview_url
                }
                title={
                  previewResource.title
                }
                className="h-full w-full rounded-lg bg-white"
              />
            </div>
          </div>
        )}
    </div>
  )
}