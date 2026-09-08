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

type CreateSubjectBody = {
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

export async function GET() {
  try {
    await requireRole([
      "admin",
      "administrator",
    ])

    const {
      data: subjects,
      error,
    } =
      await supabaseAdmin
        .from("subjects")
        .select(
          "id,name,code,description,level,syllabus,price,is_active,created_at"
        )
        .order(
          "name",
          {
            ascending: true,
          }
        )

    if (error) {
      console.error(
        "Load subjects error:",
        error
      )

      return NextResponse.json(
        {
          error:
            "Unable to load subjects.",
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(
      {
        subjects:
          subjects || [],
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Subjects GET error:",
      error
    )

    return NextResponse.json(
      {
        error:
          "You are not authorized to access subjects.",
      },
      {
        status: 401,
      }
    )
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    await requireRole([
      "admin",
      "administrator",
    ])

    const body =
      (await request.json()) as CreateSubjectBody

    const name =
      cleanText(body.name)

    const code =
      cleanText(body.code)
        .toUpperCase()

    const description =
      cleanText(
        body.description
      )

    const level =
      cleanText(body.level)

    const syllabus =
      cleanText(body.syllabus)

    const price =
      typeof body.price ===
      "number"
        ? body.price
        : 0

    const isActive =
      typeof body.is_active ===
      "boolean"
        ? body.is_active
        : true

    /*
     * Validate required fields.
     */
    if (!name) {
      return NextResponse.json(
        {
          error:
            "Subject name is required.",
        },
        {
          status: 400,
        }
      )
    }

    if (!code) {
      return NextResponse.json(
        {
          error:
            "Subject code is required.",
        },
        {
          status: 400,
        }
      )
    }

    if (!level) {
      return NextResponse.json(
        {
          error:
            "Subject level is required.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Validate price.
     */
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

    /*
     * Limit decimal places to 2.
     */
    if (
      Math.round(price * 100) /
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

    if (
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
     * Prevent duplicate subject codes.
     */
    const {
      data: existingCode,
      error:
        duplicateCheckError,
    } =
      await supabaseAdmin
        .from("subjects")
        .select("id")
        .ilike(
          "code",
          code
        )
        .maybeSingle()

    if (duplicateCheckError) {
      console.error(
        "Subject duplicate check error:",
        duplicateCheckError
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

    if (existingCode) {
      return NextResponse.json(
        {
          error:
            "A subject with this code already exists.",
        },
        {
          status: 409,
        }
      )
    }

    /*
     * Create subject.
     */
    const {
      data: subject,
      error,
    } =
      await supabaseAdmin
        .from("subjects")
        .insert({
          name,
          code,
          description:
            description ||
            null,
          level,
          syllabus:
            syllabus ||
            null,
          price,
          is_active:
            isActive,
        })
        .select(
          "id,name,code,description,level,syllabus,price,is_active,created_at"
        )
        .single()

    if (error) {
      console.error(
        "Create subject error:",
        error
      )

      return NextResponse.json(
        {
          error:
            "Unable to create subject.",
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
        status: 201,
      }
    )
  } catch (error) {
    console.error(
      "Subjects POST error:",
      error
    )

    return NextResponse.json(
      {
        error:
          "You are not authorized to create subjects.",
      },
      {
        status: 401,
      }
    )
  }
}