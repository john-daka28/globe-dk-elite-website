import {
  NextResponse,
} from "next/server"

import {
  requireRole,
} from "@/lib/auth/session"

import {
  supabaseAdmin,
} from "@/lib/supabaseAdmin"

const STORAGE_BUCKET = "tutor-resources"

export async function GET() {
  try {
    console.log("")
    console.log(
      "================================================="
    )
    console.log(
      "STUDENT RESOURCES API"
    )
    console.log(
      "================================================="
    )

    // =====================================================
    // 1. SESSION
    // =====================================================

    console.log("")
    console.log(
      "[1] Checking student session..."
    )

    const student =
      await requireRole(["student"])

    console.log(
      "[1] Student authenticated:"
    )

    console.log({
      id: student.id,
      role: student.role,
    })

    // =====================================================
    // 2. FIND TUTOR ASSIGNMENTS
    // =====================================================

    console.log("")
    console.log(
      "[2] Finding tutors assigned to student..."
    )

    const {
      data: assignments,
      error: assignmentError,
    } =
      await supabaseAdmin
        .from("tutor_students")
        .select(
          `
            id,
            tutor_id,
            student_id,
            status,
            assigned_at
          `
        )
        .eq(
          "student_id",
          student.id
        )

    if (assignmentError) {
      console.error(
        "[2] Tutor assignment error:",
        assignmentError
      )

      return NextResponse.json(
        {
          error:
            "Failed to retrieve tutor assignments.",
        },
        {
          status: 500,
        }
      )
    }

    console.log(
      "[2] Tutor assignments:"
    )

    console.log(
      assignments
    )

    // =====================================================
    // 3. GET TUTOR IDS
    // =====================================================

    const tutorIds =
      Array.from(
        new Set(
          (assignments || [])
            .map(
              (assignment) =>
                assignment.tutor_id
            )
            .filter(Boolean)
        )
      )

    console.log("")
    console.log(
      "[3] Tutor IDs:"
    )

    console.log(
      tutorIds
    )

    if (tutorIds.length === 0) {
      console.log(
        "[3] Student has no assigned tutors."
      )

      return NextResponse.json({
        resources: [],
      })
    }

    // =====================================================
    // 4. RETRIEVE RESOURCES
    // =====================================================

    console.log("")
    console.log(
      "[4] Retrieving published resources..."
    )

    const {
      data: resources,
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
      console.error("")
      console.error(
        "[4] ❌ Resources query error:"
      )

      console.error(
        resourcesError
      )

      return NextResponse.json(
        {
          error:
            "Failed to retrieve resources.",
          debug: {
            code:
              resourcesError.code,
            message:
              resourcesError.message,
            details:
              resourcesError.details,
            hint:
              resourcesError.hint,
          },
        },
        {
          status: 500,
        }
      )
    }

    console.log("")
    console.log(
      "[4] Resources retrieved:",
      resources?.length || 0
    )

    // =====================================================
    // 5. GENERATE FILE URLS
    // =====================================================

    console.log("")
    console.log(
      "[5] Generating Supabase Storage URLs..."
    )

    const resourcesWithUrls =
      await Promise.all(
        (resources || []).map(
          async (resource) => {
            let fileUrl:
              | string
              | null = null

            let previewUrl:
              | string
              | null = null

            let downloadUrl:
              | string
              | null = null

            // -------------------------------------------------
            // PDF / STORAGE FILE
            // -------------------------------------------------

            if (
              resource.file_path
            ) {
              console.log("")
              console.log(
                `[5] Processing file: ${resource.title}`
              )

              console.log(
                "[5] Bucket:",
                STORAGE_BUCKET
              )

              console.log(
                "[5] File path:",
                resource.file_path
              )

              // ===============================================
              // PREVIEW URL
              // ===============================================

              const previewResult =
                await supabaseAdmin
                  .storage
                  .from(
                    STORAGE_BUCKET
                  )
                  .createSignedUrl(
                    resource.file_path,
                    60 * 60
                  )

              if (
                previewResult.error
              ) {
                console.error(
                  "[5] ❌ Preview URL failed:",
                  {
                    resource_id:
                      resource.id,
                    title:
                      resource.title,
                    file_path:
                      resource.file_path,
                    error:
                      previewResult.error,
                  }
                )
              } else {
                previewUrl =
                  previewResult
                    .data
                    ?.signedUrl ||
                  null

                fileUrl =
                  previewUrl

                console.log(
                  "[5] ✅ Preview URL created"
                )
              }

              // ===============================================
              // DOWNLOAD URL
              // ===============================================

              const downloadResult =
                await supabaseAdmin
                  .storage
                  .from(
                    STORAGE_BUCKET
                  )
                  .createSignedUrl(
                    resource.file_path,
                    60 * 60,
                    {
                      download:
                        resource.file_name ||
                        true,
                    }
                  )

              if (
                downloadResult.error
              ) {
                console.error(
                  "[5] ❌ Download URL failed:",
                  {
                    resource_id:
                      resource.id,
                    title:
                      resource.title,
                    file_path:
                      resource.file_path,
                    error:
                      downloadResult.error,
                  }
                )
              } else {
                downloadUrl =
                  downloadResult
                    .data
                    ?.signedUrl ||
                  null

                console.log(
                  "[5] ✅ Download URL created"
                )
              }
            }

            // -------------------------------------------------
            // EXTERNAL LINK
            // -------------------------------------------------

            if (
              !resource.file_path &&
              resource.url
            ) {
              console.log("")
              console.log(
                `[5] External resource: ${resource.title}`
              )

              console.log(
                "[5] External URL:",
                resource.url
              )
            }

            // -------------------------------------------------
            // FINAL RESOURCE OBJECT
            // -------------------------------------------------

            return {
              ...resource,

              file_url:
                fileUrl,

              preview_url:
                previewUrl,

              download_url:
                downloadUrl,
            }
          }
        )
      )

    // =====================================================
    // 6. DEBUG FINAL DATA
    // =====================================================

    console.log("")
    console.log(
      "[6] Final resources:"
    )

    resourcesWithUrls.forEach(
      (resource) => {
        console.log("")
        console.log(
          "----------------------------------------"
        )

        console.log(
          "Title:",
          resource.title
        )

        console.log(
          "Type:",
          resource.resource_type
        )

        console.log(
          "File path:",
          resource.file_path
        )

        console.log(
          "File name:",
          resource.file_name
        )

        console.log(
          "File URL:",
          resource.file_url
            ? "GENERATED"
            : "NONE"
        )

        console.log(
          "Preview URL:",
          resource.preview_url
            ? "GENERATED"
            : "NONE"
        )

        console.log(
          "Download URL:",
          resource.download_url
            ? "GENERATED"
            : "NONE"
        )

        console.log(
          "External URL:",
          resource.url
            ? "AVAILABLE"
            : "NONE"
        )

        console.log(
          "Published:",
          resource.is_published
        )
      }
    )

    // =====================================================
    // 7. RESPONSE
    // =====================================================

    console.log("")
    console.log(
      "[7] Returning resources to student..."
    )

    console.log(
      "[7] Count:",
      resourcesWithUrls.length
    )

    console.log(
      "================================================="
    )

    return NextResponse.json({
      resources:
        resourcesWithUrls,
    })
  } catch (error) {
    console.error("")
    console.error(
      "================================================="
    )

    console.error(
      "❌ STUDENT RESOURCES API ERROR"
    )

    console.error(
      error
    )

    console.error(
      "================================================="
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load resources.",
      },
      {
        status: 500,
      }
    )
  }
}