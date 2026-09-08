import {
  NextRequest,
  NextResponse,
} from "next/server"

import {
  requireRole,
} from "@/lib/auth/session"

import {
  supabaseAdmin,
} from "@/lib/supabaseAdmin"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

type UpdateSubjectBody = {
  name?: string
  code?: string
  description?: string
  level?: string
  syllabus?: string
  price?: number
  is_active?: boolean
}

function cleanText(
  value: unknown
): string {
  return String(value || "").trim()
}

function isValidUUID(
  value: string
): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  )
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    await requireRole([
      "admin",
      "administrator",
    ])

    const {
      id,
    } = await context.params

    if (!isValidUUID(id)) {
      return NextResponse.json(
        {
          error:
            "Invalid subject ID.",
        },
        {
          status: 400,
        }
      )
    }

    const {
      data: subject,
      error,
    } =
      await supabaseAdmin
        .from("subjects")
        .select(
          "id,name,code,description,level,syllabus,price,is_active,created_at"
        )
        .eq(
          "id",
          id
        )
        .maybeSingle()

    if (error) {
      console.error(
        "Get subject error:",
        error
      )

      return NextResponse.json(
        {
          error:
            "Unable to load subject.",
        },
        {
          status: 500,
        }
      )
    }

    if (!subject) {
      return NextResponse.json(
        {
          error:
            "Subject not found.",
        },
        {
          status: 404,
        }
      )
    }

    return NextResponse.json(
      {
        subject,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Subject GET error:",
      error
    )

    return NextResponse.json(
      {
        error:
          "You are not authorized to access this subject.",
      },
      {
        status: 401,
      }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await requireRole([
      "admin",
      "administrator",
    ])

    const {
      id,
    } = await context.params

    if (!isValidUUID(id)) {
      return NextResponse.json(
        {
          error:
            "Invalid subject ID.",
        },
        {
          status: 400,
        }
      )
    }

    const body =
      (await request.json()) as UpdateSubjectBody

    const name =
      body.name !==
      undefined
        ? cleanText(
            body.name
          )
        : undefined

    const code =
      body.code !==
      undefined
        ? cleanText(
            body.code
          ).toUpperCase()
        : undefined

    const description =
      body.description !==
      undefined
        ? cleanText(
            body.description
          )
        : undefined

    const level =
      body.level !==
      undefined
        ? cleanText(
            body.level
          )
        : undefined

    const syllabus =
      body.syllabus !==
      undefined
        ? cleanText(
            body.syllabus
          )
        : undefined

    const price =
      body.price !==
      undefined
        ? Number(body.price)
        : undefined

    const isActive =
      body.is_active !==
      undefined
        ? Boolean(
            body.is_active
          )
        : undefined

    /*
     * Make sure subject exists.
     */
    const {
      data: existingSubject,
      error:
        existingError,
    } =
      await supabaseAdmin
        .from("subjects")
        .select(
          "id,name,code,description,level,syllabus,price,is_active,created_at"
        )
        .eq(
          "id",
          id
        )
        .maybeSingle()

    if (existingError) {
      console.error(
        "Existing subject lookup error:",
        existingError
      )

      return NextResponse.json(
        {
          error:
            "Unable to find subject.",
        },
        {
          status: 500,
        }
      )
    }

    if (!existingSubject) {
      return NextResponse.json(
        {
          error:
            "Subject not found.",
        },
        {
          status: 404,
        }
      )
    }

    /*
     * Validate supplied fields.
     */
    if (
      name !== undefined &&
      !name
    ) {
      return NextResponse.json(
        {
          error:
            "Subject name cannot be empty.",
        },
        {
          status: 400,
        }
      )
    }

    if (
      code !== undefined &&
      !code
    ) {
      return NextResponse.json(
        {
          error:
            "Subject code cannot be empty.",
        },
        {
          status: 400,
        }
      )
    }

    if (
      level !== undefined &&
      !level
    ) {
      return NextResponse.json(
        {
          error:
            "Subject level cannot be empty.",
        },
        {
          status: 400,
        }
      )
    }

    if (
      name &&
      name.length >
        150
    ) {
      return NextResponse.json(
        {
          error:
            "Subject name is too long.",
        },
        {
          status: 400,
        }
      )
    }

    if (
      code &&
      code.length >
        50
    ) {
      return NextResponse.json(
        {
          error:
            "Subject code is too long.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Validate price when supplied.
     */
    if (
      price !== undefined
    ) {
      if (
        !Number.isFinite(price)
      ) {
        return NextResponse.json(
          {
            error:
              "Subject price must be a valid number.",
          },
          {
            status: 400,
          }
        )
      }

      if (price < 0) {
        return NextResponse.json(
          {
            error:
              "Subject price cannot be negative.",
          },
          {
            status: 400,
          }
        )
      }

      if (
        Math.round(
          price * 100
        ) /
          100 !==
        price
      ) {
        return NextResponse.json(
          {
            error:
              "Subject price can have a maximum of 2 decimal places.",
          },
          {
            status: 400,
          }
        )
      }
    }

    /*
     * Prevent duplicate codes.
     */
    if (
      code &&
      code.toLowerCase() !==
        existingSubject.code.toLowerCase()
    ) {
      const {
        data:
          duplicateCode,
        error:
          duplicateError,
      } =
        await supabaseAdmin
          .from("subjects")
          .select("id")
          .ilike(
            "code",
            code
          )
          .neq(
            "id",
            id
          )
          .maybeSingle()

      if (duplicateError) {
        console.error(
          "Duplicate subject code check error:",
          duplicateError
        )

        return NextResponse.json(
          {
            error:
              "Unable to validate the subject code.",
          },
          {
            status: 500,
          }
        )
      }

      if (duplicateCode) {
        return NextResponse.json(
          {
            error:
              "Another subject already uses this code.",
          },
          {
            status: 409,
          }
        )
      }
    }

    /*
     * Build update object.
     */
    const updateData: Record<
      string,
      unknown
    > = {}

    if (
      name !== undefined
    ) {
      updateData.name =
        name
    }

    if (
      code !== undefined
    ) {
      updateData.code =
        code
    }

    if (
      description !==
      undefined
    ) {
      updateData.description =
        description ||
        null
    }

    if (
      level !== undefined
    ) {
      updateData.level =
        level
    }

    if (
      syllabus !== undefined
    ) {
      updateData.syllabus =
        syllabus ||
        null
    }

    if (
      price !== undefined
    ) {
      updateData.price =
        price
    }

    if (
      isActive !==
      undefined
    ) {
      updateData.is_active =
        isActive
    }

    if (
      Object.keys(
        updateData
      ).length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "No changes were provided.",
        },
        {
          status: 400,
        }
      )
    }

    const {
      data: subject,
      error,
    } =
      await supabaseAdmin
        .from("subjects")
        .update(
          updateData
        )
        .eq(
          "id",
          id
        )
        .select(
          "id,name,code,description,level,syllabus,price,is_active,created_at"
        )
        .single()

    if (error) {
      console.error(
        "Update subject error:",
        error
      )

      return NextResponse.json(
        {
          error:
            "Unable to update subject.",
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(
      {
        success: true,
        subject,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Subject PATCH error:",
      error
    )

    return NextResponse.json(
      {
        error:
          "You are not authorized to update this subject.",
      },
      {
        status: 401,
      }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    await requireRole([
      "admin",
      "administrator",
    ])

    const {
      id,
    } = await context.params

    if (!isValidUUID(id)) {
      return NextResponse.json(
        {
          error:
            "Invalid subject ID.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Confirm subject exists.
     */
    const {
      data: subject,
      error:
        lookupError,
    } =
      await supabaseAdmin
        .from("subjects")
        .select(
          "id,name,code"
        )
        .eq(
          "id",
          id
        )
        .maybeSingle()

    if (lookupError) {
      console.error(
        "Delete subject lookup error:",
        lookupError
      )

      return NextResponse.json(
        {
          error:
            "Unable to find subject.",
        },
        {
          status: 500,
        }
      )
    }

    if (!subject) {
      return NextResponse.json(
        {
          error:
            "Subject not found.",
        },
        {
          status: 404,
        }
      )
    }

    const {
      error: deleteError,
    } =
      await supabaseAdmin
        .from("subjects")
        .delete()
        .eq(
          "id",
          id
        )

    if (deleteError) {
      console.error(
        "Delete subject error:",
        deleteError
      )

      return NextResponse.json(
        {
          error:
            "Unable to delete subject.",
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Subject deleted successfully.",
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Subject DELETE error:",
      error
    )

    return NextResponse.json(
      {
        error:
          "You are not authorized to delete this subject.",
      },
      {
        status: 401,
      }
    )
  }
}