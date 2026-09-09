import {
  NextRequest,
  NextResponse,
} from "next/server"

import crypto from "crypto"

import { requireRole } from "@/lib/auth/session"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const dynamic = "force-dynamic"

const BUCKET =
  "tutor-resources"

const MAX_FILE_SIZE =
  20 * 1024 * 1024

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

function safeFileName(
  fileName: string
) {
  return fileName
    .replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    )
    .slice(0, 180)
}

function generateFilePath(
  tutorId: string,
  fileName: string
) {
  const randomId =
    crypto.randomUUID()

  const cleanName =
    safeFileName(fileName)

  return `${tutorId}/${randomId}-${cleanName}`
}

function authError(
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
          "You are not authorised to upload resources.",
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
| POST
|--------------------------------------------------------------------------
| Creates a new PDF resource OR replaces the PDF attached to an
| existing resource.
|--------------------------------------------------------------------------
*/

export async function POST(
  request: NextRequest
) {
  try {
    const tutor =
      await requireRole(["tutor"])

    const formData =
      await request.formData()

    const file =
      formData.get("file")

    const resourceId =
      formData.get("resource_id")

    const titleValue =
      formData.get("title")

    const descriptionValue =
      formData.get("description")

    const resourceTypeValue =
      formData.get("resource_type")

    const subjectValue =
      formData.get("subject")

    const levelValue =
      formData.get("level")

    const curriculumValue =
      formData.get("curriculum")

    const isPublishedValue =
      formData.get("is_published")

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error:
            "Please select a PDF file.",
        },
        {
          status: 400,
        }
      )
    }

    if (
      file.type !==
      "application/pdf"
    ) {
      return NextResponse.json(
        {
          error:
            "Only PDF files are allowed.",
        },
        {
          status: 400,
        }
      )
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          error:
            "PDF file is too large. Maximum size is 20 MB.",
        },
        {
          status: 400,
        }
      )
    }

    const title =
      typeof titleValue === "string" &&
      titleValue.trim()
        ? titleValue.trim()
        : file.name
            .replace(
              /\.pdf$/i,
              ""
            )
            .trim()

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

    const description =
      typeof descriptionValue ===
        "string"
        ? descriptionValue.trim()
        : null

    const resourceType =
      typeof resourceTypeValue ===
        "string" &&
      resourceTypeValue.trim()
        ? resourceTypeValue.trim()
        : "Notes"

    const subject =
      typeof subjectValue ===
        "string"
        ? subjectValue.trim()
        : null

    const level =
      typeof levelValue ===
        "string"
        ? levelValue.trim()
        : null

    const curriculum =
      typeof curriculumValue ===
        "string"
        ? curriculumValue.trim()
        : null

    const isPublished =
      isPublishedValue === "false"
        ? false
        : true

    let oldFilePath:
      | string
      | null = null

    let existingResource:
      | {
          id: string
          file_path: string | null
        }
      | null = null

    /*
     * If resource_id exists, this is a PDF replacement.
     */
    if (
      typeof resourceId ===
        "string" &&
      resourceId.trim()
    ) {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from("resources")
        .select(
          "id, file_path"
        )
        .eq(
          "id",
          resourceId
        )
        .eq(
          "created_by",
          tutor.id
        )
        .maybeSingle()

      if (error) {
        console.error(
          "PDF replacement lookup error:",
          error
        )

        return NextResponse.json(
          {
            error:
              "Failed to find the resource.",
          },
          {
            status: 500,
          }
        )
      }

      if (!data) {
        return NextResponse.json(
          {
            error:
              "Resource not found or you do not have permission to modify it.",
          },
          {
            status: 404,
          }
        )
      }

      existingResource =
        data

      oldFilePath =
        data.file_path
    }

    const filePath =
      generateFilePath(
        tutor.id,
        file.name
      )

    const fileBuffer =
      Buffer.from(
        await file.arrayBuffer()
      )

    /*
     * Upload PDF to private Supabase Storage.
     */
    const {
      error: uploadError,
    } =
      await supabaseAdmin.storage
        .from(BUCKET)
        .upload(
          filePath,
          fileBuffer,
          {
            contentType:
              "application/pdf",

            cacheControl:
              "3600",

            upsert: false,
          }
        )

    if (uploadError) {
      console.error(
        "Supabase PDF upload error:",
        uploadError
      )

      return NextResponse.json(
        {
          error:
            "Failed to upload PDF.",
        },
        {
          status: 500,
        }
      )
    }

    /*
     * REPLACE EXISTING RESOURCE
     */
    if (
      existingResource
    ) {
      const {
        data: resource,
        error,
      } =
        await supabaseAdmin
          .from("resources")
          .update({
            title,
            description:
              description ||
              null,

            resource_type:
              resourceType,

            subject:
              subject || null,

            level:
              level || null,

            curriculum:
              curriculum ||
              null,

            url: null,

            file_path:
              filePath,

            file_name:
              file.name,

            file_size:
              file.size,

            mime_type:
              "application/pdf",

            is_published:
              isPublished,

            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            existingResource.id
          )
          .eq(
            "created_by",
            tutor.id
          )
          .select(
            RESOURCE_SELECT
          )
          .single()

      if (error) {
        console.error(
          "Failed to update resource after upload:",
          error
        )

        /*
         * Clean up newly uploaded file
         */
        await supabaseAdmin.storage
          .from(BUCKET)
          .remove([
            filePath,
          ])

        return NextResponse.json(
          {
            error:
              "PDF uploaded but the resource could not be updated.",
          },
          {
            status: 500,
          }
        )
      }

      /*
       * Delete previous PDF only after database update succeeded.
       */
      if (oldFilePath) {
        const {
          error:
            removeError,
        } =
          await supabaseAdmin
            .storage
            .from(BUCKET)
            .remove([
              oldFilePath,
            ])

        if (removeError) {
          console.warn(
            "Old PDF could not be removed:",
            removeError
          )
        }
      }

      return NextResponse.json({
        message:
          "PDF replaced successfully.",

        resource,
      })
    }

    /*
     * CREATE NEW RESOURCE
     */
    const {
      data: resource,
      error: insertError,
    } =
      await supabaseAdmin
        .from("resources")
        .insert({
          created_by:
            tutor.id,

          title,

          description:
            description ||
            null,

          resource_type:
            resourceType,

          subject:
            subject || null,

          level:
            level || null,

          curriculum:
            curriculum ||
            null,

          url: null,

          file_path:
            filePath,

          file_name:
            file.name,

          file_size:
            file.size,

          mime_type:
            "application/pdf",

          is_published:
            isPublished,
        })
        .select(
          RESOURCE_SELECT
        )
        .single()

    if (insertError) {
      console.error(
        "Failed to create PDF resource:",
        insertError
      )

      /*
       * Important:
       * database failed, so remove uploaded file.
       */
      await supabaseAdmin.storage
        .from(BUCKET)
        .remove([
          filePath,
        ])

      return NextResponse.json(
        {
          error:
            "PDF uploaded but resource creation failed.",
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(
      {
        message:
          "PDF resource created successfully.",

        resource,
      },
      {
        status: 201,
      }
    )
  } catch (error) {
    const response =
      authError(error)

    if (response) {
      return response
    }

    console.error(
      "POST /api/tutor/resources/upload error:",
      error
    )

    return NextResponse.json(
      {
        error:
          "Something went wrong while uploading the PDF.",
      },
      {
        status: 500,
      }
    )
  }
}