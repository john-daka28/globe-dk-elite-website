import {
  BookOpen,
  CalendarDays,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Link as LinkIcon,
  PlayCircle,
  Search,
  Video,
} from "lucide-react"

import Link from "next/link"

import {
  requireRole,
} from "@/lib/auth/session"

import {
  supabaseAdmin,
} from "@/lib/supabaseAdmin"

import {
  StudentSidebar,
} from "../../components/student/StudentSidebar"

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

  // These are generated dynamically from Supabase Storage.
  // They are NOT database columns.
  file_url?: string | null
  preview_url?: string | null
  download_url?: string | null

  is_published: boolean
  created_at: string
  updated_at: string
}

type Tutor = {
  id: string
  first_name: string | null
  last_name: string | null
}

/*
|--------------------------------------------------------------------------
| SUPABASE STORAGE BUCKET
|--------------------------------------------------------------------------
|
| This must match the bucket used by your tutor resource upload API.
|
| Example:
|
| supabaseAdmin.storage.from("resources")
|
| If your upload API uses another bucket name, change it here.
|
*/
const STORAGE_BUCKET = "tutor-resources"
/*
|--------------------------------------------------------------------------
| FORMAT FILE SIZE
|--------------------------------------------------------------------------
*/

function formatFileSize(
  bytes: number | null
) {
  if (!bytes) {
    return ""
  }

  if (
    bytes <
    1024
  ) {
    return `${bytes} B`
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`
}

/*
|--------------------------------------------------------------------------
| CHECK IF RESOURCE IS A PDF
|--------------------------------------------------------------------------
*/

function isPdf(
  resource: Resource
) {
  return (
    resource.mime_type ===
      "application/pdf" ||
    Boolean(
      resource.file_path
    )
  )
}

/*
|--------------------------------------------------------------------------
| RESOURCE ICON
|--------------------------------------------------------------------------
*/

function getResourceIcon(
  resource: Resource
) {
  if (
    isPdf(resource)
  ) {
    return FileText
  }

  if (
    resource.resource_type ===
    "Video"
  ) {
    return Video
  }

  if (
    resource.resource_type ===
    "Link"
  ) {
    return LinkIcon
  }

  return FileText
}

/*
|--------------------------------------------------------------------------
| RESOURCE ACTION URL
|--------------------------------------------------------------------------
*/

function getResourceActionUrl(
  resource: Resource
) {
  if (isPdf(resource)) {
    return (
      resource.preview_url ||
      resource.download_url ||
      resource.file_url ||
      null
    )
  }

  return (
    resource.url ||
    resource.file_url ||
    null
  )
}

/*
|--------------------------------------------------------------------------
| CREATE SIGNED STORAGE URLS
|--------------------------------------------------------------------------
|
| Supabase Storage keeps the actual PDF file.
|
| resources.file_path contains something like:
|
| tutor-id/filename.pdf
|
| We generate temporary signed URLs here instead of trying to read:
|
| resources.file_url
| resources.preview_url
| resources.download_url
|
| because those are NOT database columns.
|
*/
async function addStorageUrls(
  resource: Resource
): Promise<Resource> {
  /*
  |--------------------------------------------------------------------------
  | No file path
  |--------------------------------------------------------------------------
  |
  | This could be a normal external link/video resource.
  |
  */
  if (!resource.file_path) {
    return {
      ...resource,
      file_url: resource.url || null,
      preview_url: null,
      download_url: null,
    }
  }

  /*
  |--------------------------------------------------------------------------
  | PREVIEW URL
  |--------------------------------------------------------------------------
  |
  | This URL allows the browser to open the PDF.
  |
  */
  const previewResult =
    await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(
        resource.file_path,
        60 * 60
      )

  let previewUrl:
    | string
    | null = null

  if (
    previewResult.error
  ) {
    console.error(
      "Student resource preview URL error:",
      {
        resource_id:
          resource.id,
        file_path:
          resource.file_path,
        error:
          previewResult.error,
      }
    )
  } else {
    previewUrl =
      previewResult.data
        ?.signedUrl ||
      null
  }

  /*
  |--------------------------------------------------------------------------
  | DOWNLOAD URL
  |--------------------------------------------------------------------------
  |
  | Supabase allows us to request the signed URL with a download
  | Content-Disposition.
  |
  */
  const downloadResult =
    await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(
        resource.file_path,
        60 * 60,
        {
          download:
            resource.file_name ||
            true,
        }
      )

  let downloadUrl:
    | string
    | null = null

  if (
    downloadResult.error
  ) {
    console.error(
      "Student resource download URL error:",
      {
        resource_id:
          resource.id,
        file_path:
          resource.file_path,
        error:
          downloadResult.error,
      }
    )
  } else {
    downloadUrl =
      downloadResult.data
        ?.signedUrl ||
      null
  }

  /*
  |--------------------------------------------------------------------------
  | RETURN RESOURCE WITH GENERATED URLS
  |--------------------------------------------------------------------------
  */

  return {
    ...resource,

    // Preview is also a valid file URL.
    file_url:
      previewUrl,

    preview_url:
      previewUrl,

    download_url:
      downloadUrl,
  }
}

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

export default async function StudentResourcesPage() {
  /* ============================================================
     SESSION / AUTHENTICATION
     ============================================================

     Only logged-in students can access this page.
  */

  const student =
    await requireRole([
      "student",
    ])

  const studentName =
    `${student.first_name || ""} ${
      student.last_name || ""
    }`.trim()

  /* ============================================================
     FIND ASSIGNED TUTORS
     ============================================================

     The logged-in student's ID comes directly from the
     authenticated session.

     We never accept student_id from the URL or frontend.
  */

  const {
    data: tutorAssignments,
    error: tutorAssignmentsError,
  } =
    await supabaseAdmin
      .from("tutor_students")
      .select(
        `
          tutor_id,
          status
        `
      )
      .eq(
        "student_id",
        student.id
      )

  if (tutorAssignmentsError) {
    console.error(
      "Student resources tutor assignment error:",
      tutorAssignmentsError
    )
  }

  const tutorIds = (
    tutorAssignments || []
  )
    .filter(
      (assignment: {
        tutor_id: string
        status: string | null
      }) =>
        !assignment.status ||
        assignment.status.toLowerCase() ===
          "active"
    )
    .map(
      (assignment) =>
        assignment.tutor_id
    )
    .filter(
      (
        tutorId
      ): tutorId is string =>
        Boolean(tutorId)
    )

  /* ============================================================
     LOAD TUTOR INFORMATION
     ============================================================ */

  let tutors: Tutor[] = []

  if (tutorIds.length > 0) {
    const {
      data: tutorRows,
      error: tutorsError,
    } =
      await supabaseAdmin
        .from("users")
        .select(
          `
            id,
            first_name,
            last_name
          `
        )
        .in(
          "id",
          tutorIds
        )

    if (tutorsError) {
      console.error(
        "Student resources tutor information error:",
        tutorsError
      )
    } else {
      tutors =
        (tutorRows ||
          []) as Tutor[]
    }
  }

  /* ============================================================
     LOAD PUBLISHED RESOURCES
     ============================================================

     Only resources created by the student's assigned tutor(s)
     are loaded.

     Draft/unpublished resources are excluded.

     IMPORTANT:
     We ONLY select columns that actually exist in the
     resources table.

     We DO NOT select:
       file_url
       preview_url
       download_url

     Those URLs are generated below from file_path.
  */

  let resources: Resource[] = []

  if (tutorIds.length > 0) {
    const {
      data: resourceRows,
      error: resourcesError,
    } =
      await supabaseAdmin
        .from("resources")
        .select(
          `
            id,
            created_by,
            title,
            description,
            resource_type,
            subject,
            level,
            curriculum,
            url,
            file_path,
            file_name,
            file_size,
            mime_type,
            is_published,
            created_at,
            updated_at
          `
        )
        .in(
          "created_by",
          tutorIds
        )
        .eq(
          "is_published",
          true
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        )

    if (resourcesError) {
      console.error(
        "Student resources database error:",
        resourcesError
      )
    } else {
      const rawResources =
        (resourceRows ||
          []) as Resource[]

      /*
      |--------------------------------------------------------------------------
      | GENERATE STORAGE URLS
      |--------------------------------------------------------------------------
      |
      | Every PDF with a file_path gets:
      |
      | preview_url
      | download_url
      | file_url
      |
      */

      resources =
        await Promise.all(
          rawResources.map(
            (
              resource
            ) =>
              addStorageUrls(
                resource
              )
          )
        )
    }
  }

  /* ============================================================
     STATISTICS
     ============================================================ */

  const pdfCount =
    resources.filter(
      (resource) =>
        isPdf(resource)
    ).length

  const videoCount =
    resources.filter(
      (resource) =>
        resource.resource_type ===
        "Video"
    ).length

  const linkCount =
    resources.filter(
      (resource) =>
        resource.resource_type ===
        "Link"
    ).length

  /* ============================================================
     TUTOR DISPLAY NAME
     ============================================================ */

  const tutorNames =
    tutors
      .map(
        (tutor) =>
          `${tutor.first_name || ""} ${
            tutor.last_name || ""
          }`.trim()
      )
      .filter(Boolean)

  const tutorDisplay =
    tutorNames.length > 0
      ? tutorNames.join(", ")
      : "Your tutor"

  /* ============================================================
     PAGE
     ============================================================ */

  return (
    <main className="min-h-screen bg-muted/30">

      {/* ======================================================
          SIDEBAR
          ====================================================== */}

      <StudentSidebar />

      {/* ======================================================
          MAIN CONTENT
          ====================================================== */}

      <div className="lg:pl-64">

        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

          {/* ==================================================
              HEADER
              ================================================== */}

          <section className="mb-6 sm:mb-8">

            <div className="rounded-2xl border bg-background p-5 shadow-sm sm:p-7">

              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                <div>

                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <BookOpen className="h-4 w-4" />
                    Student Resources
                  </div>

                  <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                    Learning Resources
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                    Access notes, past papers, revision
                    materials, worksheets, videos and other
                    learning resources published by{" "}
                    {tutorDisplay}.
                  </p>

                </div>

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">

                  <BookOpen className="h-8 w-8" />

                </div>

              </div>

            </div>

          </section>


          {/* ==================================================
              BREADCRUMB / NAVIGATION
              ================================================== */}

          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">

            <Link
              href="/student"
              className="transition hover:text-foreground"
            >
              Dashboard
            </Link>

            <span>/</span>

            <span className="font-medium text-foreground">
              Resources
            </span>

          </div>


          {/* ==================================================
              RESOURCE STATISTICS
              ================================================== */}

          <section className="mb-6 sm:mb-8">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* Total */}

              <div className="rounded-2xl border bg-background p-5 shadow-sm">

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">

                    <BookOpen className="h-5 w-5" />

                  </div>

                </div>

                <div className="mt-5">

                  <p className="text-sm text-muted-foreground">
                    Total Resources
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {resources.length}
                  </p>

                </div>

              </div>


              {/* PDFs */}

              <div className="rounded-2xl border bg-background p-5 shadow-sm">

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">

                    <FileText className="h-5 w-5" />

                  </div>

                </div>

                <div className="mt-5">

                  <p className="text-sm text-muted-foreground">
                    PDF Resources
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {pdfCount}
                  </p>

                </div>

              </div>


              {/* Videos */}

              <div className="rounded-2xl border bg-background p-5 shadow-sm">

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">

                    <PlayCircle className="h-5 w-5" />

                  </div>

                </div>

                <div className="mt-5">

                  <p className="text-sm text-muted-foreground">
                    Videos
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {videoCount}
                  </p>

                </div>

              </div>


              {/* Links */}

              <div className="rounded-2xl border bg-background p-5 shadow-sm">

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">

                    <ExternalLink className="h-5 w-5" />

                  </div>

                </div>

                <div className="mt-5">

                  <p className="text-sm text-muted-foreground">
                    Links
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {linkCount}
                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* ==================================================
              RESOURCES
              ================================================== */}

          <section>

            <div className="mb-5">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <h2 className="text-lg font-semibold sm:text-xl">
                    My Learning Resources
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Resources published by your assigned tutor.
                  </p>

                </div>

                <div className="relative w-full sm:max-w-xs">

                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    type="search"
                    placeholder="Search resources..."
                    className="h-10 w-full rounded-xl border bg-background pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
                  />

                </div>

              </div>

            </div>


            {/* ==================================================
                NO TUTOR
                ================================================== */}

            {tutorIds.length === 0 ? (

              <div className="rounded-2xl border border-dashed bg-background p-8 text-center shadow-sm sm:p-12">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">

                  <GraduationCap className="h-8 w-8 text-muted-foreground" />

                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  No tutor assigned yet
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                  You currently do not have an active tutor
                  assigned to your account. Once a tutor is
                  assigned, their published learning resources
                  will appear here.
                </p>

                <Link
                  href="/student"
                  className="mt-5 inline-flex items-center justify-center rounded-xl border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                >
                  Back to Dashboard
                </Link>

              </div>

            ) : resources.length === 0 ? (

              /* ==================================================
                 NO RESOURCES
                 ================================================== */

              <div className="rounded-2xl border border-dashed bg-background p-8 text-center shadow-sm sm:p-12">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">

                  <FileText className="h-8 w-8 text-muted-foreground" />

                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  No resources available yet
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                  Your tutor has not published any learning
                  resources yet. When your tutor publishes
                  notes, past papers, worksheets or other
                  materials, they will appear here.
                </p>

              </div>

            ) : (

              /* ==================================================
                 RESOURCE GRID
                 ================================================== */

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

                {resources.map(
                  (
                    resource
                  ) => {

                    const Icon =
                      getResourceIcon(
                        resource
                      )

                    const actionUrl =
                      getResourceActionUrl(
                        resource
                      )

                    const pdf =
                      isPdf(
                        resource
                      )

                    return (

                      <article
                        key={
                          resource.id
                        }
                        className="group flex h-full flex-col rounded-2xl border bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >

                        {/* ==================================================
                            TOP
                            ================================================== */}

                        <div className="flex items-start justify-between gap-3">

                          <div className="flex min-w-0 items-start gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">

                              <Icon className="h-5 w-5" />

                            </div>

                            <div className="min-w-0">

                              <h3 className="line-clamp-2 font-semibold leading-5">
                                {
                                  resource.title
                                }
                              </h3>

                              <p className="mt-1 text-xs text-muted-foreground">
                                {
                                  resource.resource_type
                                }
                              </p>

                            </div>

                          </div>

                        </div>


                        {/* ==================================================
                            DESCRIPTION
                            ================================================== */}

                        {resource.description && (

                          <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
                            {
                              resource.description
                            }
                          </p>

                        )}


                        {/* ==================================================
                            FILE INFORMATION
                            ================================================== */}

                        {pdf &&
                          resource.file_name && (

                          <div className="mt-4 rounded-xl border bg-muted/30 p-3">

                            <div className="flex items-center gap-3">

                              <FileText className="h-5 w-5 shrink-0 text-primary" />

                              <div className="min-w-0">

                                <p className="truncate text-sm font-medium">
                                  {
                                    resource.file_name
                                  }
                                </p>

                                {resource.file_size && (

                                  <p className="mt-0.5 text-xs text-muted-foreground">
                                    {
                                      formatFileSize(
                                        resource.file_size
                                      )
                                    }
                                  </p>

                                )}

                              </div>

                            </div>

                          </div>

                        )}


                        {/* ==================================================
                            TAGS
                            ================================================== */}

                        <div className="mt-4 flex flex-wrap gap-2">

                          {resource.subject && (

                            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                              {
                                resource.subject
                              }
                            </span>

                          )}

                          {resource.level && (

                            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                              {
                                resource.level
                              }
                            </span>

                          )}

                          {resource.curriculum && (

                            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                              {
                                resource.curriculum
                              }
                            </span>

                          )}

                        </div>


                        {/* ==================================================
                            FOOTER
                            ================================================== */}

                        <div className="mt-auto pt-5">

                          <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">

                            <CalendarDays className="h-3.5 w-3.5" />

                            <span>
                              Published{" "}
                              {new Date(
                                resource.created_at
                              ).toLocaleDateString(
                                "en-ZW",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>

                          </div>


                          {/* ==================================================
                              ACTIONS
                              ================================================== */}

                          {actionUrl ? (

                            <div className="flex gap-2">

                              {pdf &&
                                resource.preview_url ? (

                                <a
                                  href={
                                    resource.preview_url
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition hover:bg-muted"
                                >

                                  <FileText className="h-4 w-4" />

                                  Preview

                                </a>

                              ) : (

                                <a
                                  href={
                                    actionUrl
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition hover:bg-muted"
                                >

                                  <ExternalLink className="h-4 w-4" />

                                  Open

                                </a>

                              )}


                              {pdf &&
                                resource.download_url && (

                                <a
                                  href={
                                    resource.download_url
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                                >

                                  <Download className="h-4 w-4" />

                                  Download

                                </a>

                              )}

                            </div>

                          ) : (

                            <div className="rounded-xl border border-dashed px-3 py-2.5 text-center text-sm text-muted-foreground">
                              Resource link unavailable
                            </div>

                          )}

                        </div>

                      </article>

                    )
                  }
                )}

              </div>

            )}

          </section>


          {/* ==================================================
              INFORMATION
              ================================================== */}

          <section className="mt-8">

            <div className="rounded-2xl border bg-background p-5 shadow-sm sm:p-6">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">

                  <GraduationCap className="h-5 w-5" />

                </div>

                <div>

                  <h3 className="font-semibold">
                    Your resources
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    These resources are provided by your
                    assigned tutor and are published specifically
                    for student access. If you need additional
                    materials, please contact your tutor.
                  </p>

                </div>

              </div>

            </div>

          </section>

        </div>

      </div>

    </main>
  )
}