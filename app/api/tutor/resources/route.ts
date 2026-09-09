import { NextRequest, NextResponse } from "next/server"

import { requireRole } from "@/lib/auth/session"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const dynamic = "force-dynamic"

const RESOURCE_SELECT = `
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

async function createSignedUrl(
  filePath: string | null
) {
  if (!filePath) {
    return null
  }

  const { data, error } =
    await supabaseAdmin.storage
      .from("tutor-resources")
      .createSignedUrl(
        filePath,
        60 * 60
      )

  if (error) {
    console.error(
      "Failed to create signed resource URL:",
      error
    )

    return null
  }

  return data?.signedUrl || null
}

function handleAuthError(error: unknown) {
  if (!(error instanceof Error)) {
    return null
  }

  if (error.message === "UNAUTHENTICATED") {
    return NextResponse.json(
      {
        error: "You must be logged in.",
      },
      {
        status: 401,
      }
    )
  }

  if (error.message === "UNAUTHORIZED") {
    return NextResponse.json(
      {
        error:
          "You are not authorised to access tutor resources.",
      },
      {
        status: 403,
      }
    )
  }

  return null
}

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
| Retrieves resources belonging ONLY to the logged-in tutor.
|--------------------------------------------------------------------------
*/

export async function GET() {
  try {
    const tutor = await requireRole(["tutor"])

    const {
      data: resources,
      error,
    } = await supabaseAdmin
      .from("resources")
      .select(RESOURCE_SELECT)
      .eq("created_by", tutor.id)
      .order("created_at", {
        ascending: false,
      })

    if (error) {
      console.error(
        "GET /api/tutor/resources error:",
        error
      )

      return NextResponse.json(
        {
          error: "Failed to retrieve resources.",
        },
        {
          status: 500,
        }
      )
    }

    const resourcesWithUrls =
      await Promise.all(
        (resources || []).map(
          async (resource) => {
            const signedUrl =
              await createSignedUrl(
                resource.file_path
              )

            return {
              ...resource,

              file_url: signedUrl,

              download_url:
                signedUrl,

              preview_url:
                signedUrl,
            }
          }
        )
      )

    return NextResponse.json({
      resources:
        resourcesWithUrls,

      total:
        resourcesWithUrls.length,
    })
  } catch (error) {
    const authResponse =
      handleAuthError(error)

    if (authResponse) {
      return authResponse
    }

    console.error(
      "GET /api/tutor/resources unexpected error:",
      error
    )

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      }
    )
  }
}

/*
|--------------------------------------------------------------------------
| POST
|--------------------------------------------------------------------------
| Creates a normal resource such as:
|
| - Link
| - Video
| - Google Drive link
| - Website
|
| PDFs are created through:
| /api/tutor/resources/upload
|--------------------------------------------------------------------------
*/

export async function POST(
  request: NextRequest
) {
  try {
    const tutor =
      await requireRole(["tutor"])

    const body =
      await request.json()

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : ""

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null

    const resourceType =
      typeof body.resource_type === "string"
        ? body.resource_type.trim()
        : "Other"

    const subject =
      typeof body.subject === "string"
        ? body.subject.trim()
        : null

    const level =
      typeof body.level === "string"
        ? body.level.trim()
        : null

    const curriculum =
      typeof body.curriculum === "string"
        ? body.curriculum.trim()
        : null

    const url =
      typeof body.url === "string"
        ? body.url.trim()
        : null

    const isPublished =
      typeof body.is_published === "boolean"
        ? body.is_published
        : true

    if (!title) {
      return NextResponse.json(
        {
          error:
            "Resource title is required.",
        },
        {
          status: 400,
        }
      )
    }

    const {
      data: resource,
      error,
    } = await supabaseAdmin
      .from("resources")
      .insert({
        created_by: tutor.id,
        title,
        description:
          description || null,
        resource_type:
          resourceType || "Other",
        subject:
          subject || null,
        level:
          level || null,
        curriculum:
          curriculum || null,
        url:
          url || null,
        is_published:
          isPublished,

        file_path: null,
        file_name: null,
        file_size: null,
        mime_type: null,
      })
      .select(RESOURCE_SELECT)
      .single()

    if (error) {
      console.error(
        "POST /api/tutor/resources error:",
        error
      )

      return NextResponse.json(
        {
          error:
            "Failed to create resource.",
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(
      {
        message:
          "Resource created successfully.",

        resource,
      },
      {
        status: 201,
      }
    )
  } catch (error) {
    const authResponse =
      handleAuthError(error)

    if (authResponse) {
      return authResponse
    }

    console.error(
      "POST /api/tutor/resources unexpected error:",
      error
    )

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      }
    )
  }
}