import {
  NextRequest,
  NextResponse,
} from "next/server"

import { requireRole } from "@/lib/auth/session"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const dynamic = "force-dynamic"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

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

function handleAuthError(
  error: unknown
) {
  if (!(error instanceof Error)) {
    return null
  }

  if (
    error.message ===
    "UNAUTHENTICATED"
  ) {
    return NextResponse.json(
      {
        error:
          "You must be logged in.",
      },
      {
        status: 401,
      }
    )
  }

  if (
    error.message ===
    "UNAUTHORIZED"
  ) {
    return NextResponse.json(
      {
        error:
          "You are not authorised to manage tutor resources.",
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
| PATCH
|--------------------------------------------------------------------------
*/

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const tutor =
      await requireRole(["tutor"])

    const { id } =
      await context.params

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Resource ID is required.",
        },
        {
          status: 400,
        }
      )
    }

    const body =
      await request.json()

    const updates:
      Record<string, unknown> =
      {
        updated_at:
          new Date().toISOString(),
      }

    if (
      typeof body.title ===
      "string"
    ) {
      const title =
        body.title.trim()

      if (!title) {
        return NextResponse.json(
          {
            error:
              "Resource title cannot be empty.",
          },
          {
            status: 400,
          }
        )
      }

      updates.title =
        title
    }

    if (
      typeof body.description ===
      "string"
    ) {
      updates.description =
        body.description.trim() ||
        null
    }

    if (
      typeof body.resource_type ===
      "string"
    ) {
      updates.resource_type =
        body.resource_type.trim() ||
        "Other"
    }

    if (
      typeof body.subject ===
      "string"
    ) {
      updates.subject =
        body.subject.trim() ||
        null
    }

    if (
      typeof body.level ===
      "string"
    ) {
      updates.level =
        body.level.trim() ||
        null
    }

    if (
      typeof body.curriculum ===
      "string"
    ) {
      updates.curriculum =
        body.curriculum.trim() ||
        null
    }

    if (
      typeof body.url ===
      "string"
    ) {
      updates.url =
        body.url.trim() ||
        null
    }

    if (
      typeof body.is_published ===
      "boolean"
    ) {
      updates.is_published =
        body.is_published
    }

    /*
     * When converting from PDF to URL,
     * clear the attached file.
     */
    if (
      body.remove_file === true
    ) {
      const {
        data: existing,
      } =
        await supabaseAdmin
          .from("resources")
          .select(
            "file_path"
          )
          .eq(
            "id",
            id
          )
          .eq(
            "created_by",
            tutor.id
          )
          .maybeSingle()

      if (!existing) {
        return NextResponse.json(
          {
            error:
              "Resource not found.",
          },
          {
            status: 404,
          }
        )
      }

      updates.file_path =
        null

      updates.file_name =
        null

      updates.file_size =
        null

      updates.mime_type =
        null

      updates.url =
        typeof body.url ===
        "string"
          ? body.url.trim() ||
            null
          : null

      const {
        data: resource,
        error,
      } =
        await supabaseAdmin
          .from("resources")
          .update(updates)
          .eq(
            "id",
            id
          )
          .eq(
            "created_by",
            tutor.id
          )
          .select(
            RESOURCE_SELECT
          )
          .maybeSingle()

      if (error) {
        console.error(
          "PATCH resource error:",
          error
        )

        return NextResponse.json(
          {
            error:
              "Failed to update resource.",
          },
          {
            status: 500,
          }
        )
      }

      if (!resource) {
        return NextResponse.json(
          {
            error:
              "Resource not found or you do not have permission to edit it.",
          },
          {
            status: 404,
          }
        )
      }

      if (existing.file_path) {
        const {
          error:
            storageError,
        } =
          await supabaseAdmin
            .storage
            .from(
              "tutor-resources"
            )
            .remove([
              existing.file_path,
            ])

        if (storageError) {
          console.warn(
            "Failed to remove resource file:",
            storageError
          )
        }
      }

      return NextResponse.json({
        message:
          "Resource updated successfully.",

        resource,
      })
    }

    const {
      data: resource,
      error,
    } =
      await supabaseAdmin
        .from("resources")
        .update(updates)
        .eq(
          "id",
          id
        )
        .eq(
          "created_by",
          tutor.id
        )
        .select(
          RESOURCE_SELECT
        )
        .maybeSingle()

    if (error) {
      console.error(
        "PATCH /api/tutor/resources/[id] error:",
        error
      )

      return NextResponse.json(
        {
          error:
            "Failed to update resource.",
        },
        {
          status: 500,
        }
      )
    }

    if (!resource) {
      return NextResponse.json(
        {
          error:
            "Resource not found or you do not have permission to edit it.",
        },
        {
          status: 404,
        }
      )
    }

    return NextResponse.json({
      message:
        "Resource updated successfully.",

      resource,
    })
  } catch (error) {
    const response =
      handleAuthError(error)

    if (response) {
      return response
    }

    console.error(
      "PATCH resource unexpected error:",
      error
    )

    return NextResponse.json(
      {
        error:
          "Something went wrong.",
      },
      {
        status: 500,
      }
    )
  }
}

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const tutor =
      await requireRole(["tutor"])

    const { id } =
      await context.params

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Resource ID is required.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * First retrieve the resource and verify ownership.
     */
    const {
      data: resource,
      error: findError,
    } =
      await supabaseAdmin
        .from("resources")
        .select(
          "id, file_path"
        )
        .eq(
          "id",
          id
        )
        .eq(
          "created_by",
          tutor.id
        )
        .maybeSingle()

    if (findError) {
      console.error(
        "DELETE resource lookup error:",
        findError
      )

      return NextResponse.json(
        {
          error:
            "Failed to find resource.",
        },
        {
          status: 500,
        }
      )
    }

    if (!resource) {
      return NextResponse.json(
        {
          error:
            "Resource not found or you do not have permission to delete it.",
        },
        {
          status: 404,
        }
      )
    }

    /*
     * Delete database record.
     */
    const {
      error: deleteError,
    } =
      await supabaseAdmin
        .from("resources")
        .delete()
        .eq(
          "id",
          id
        )
        .eq(
          "created_by",
          tutor.id
        )

    if (deleteError) {
      console.error(
        "DELETE resource database error:",
        deleteError
      )

      return NextResponse.json(
        {
          error:
            "Failed to delete resource.",
        },
        {
          status: 500,
        }
      )
    }

    /*
     * Delete associated PDF.
     */
    if (resource.file_path) {
      const {
        error:
          storageError,
      } =
        await supabaseAdmin
          .storage
          .from(
            "tutor-resources"
          )
          .remove([
            resource.file_path,
          ])

      if (storageError) {
        console.warn(
          "Resource database row deleted but PDF cleanup failed:",
          storageError
        )
      }
    }

    return NextResponse.json({
      message:
        "Resource deleted successfully.",
    })
  } catch (error) {
    const response =
      handleAuthError(error)

    if (response) {
      return response
    }

    console.error(
      "DELETE resource unexpected error:",
      error
    )

    return NextResponse.json(
      {
        error:
          "Something went wrong.",
      },
      {
        status: 500,
      }
    )
  }
}