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

import {
  generateSecureToken,
  getTokenExpiry,
  hashToken,
} from "@/lib/auth/token"

import {
  sendStudentInvitation,
} from "@/lib/email/sendStudentInvitation"

type CreateStudentBody = {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  level?: string
  school?: string
  guardian_name?: string
  guardian_phone?: string
}

function cleanText(
  value: unknown
): string {
  return String(value || "").trim()
}

function isValidEmail(
  email: string
): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  )
}

/*
|--------------------------------------------------------------------------
| GET /api/tutor/students
|--------------------------------------------------------------------------
| Load students assigned to the currently authenticated tutor.
|--------------------------------------------------------------------------
*/

export async function GET() {
  try {
    const tutor =
      await requireRole([
        "tutor",
      ])

    const {
      data: relationships,
      error: relationshipError,
    } =
      await supabaseAdmin
        .from("tutor_students")
        .select(
          "id,student_id,created_at"
        )
        .eq(
          "tutor_id",
          tutor.id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        )

    if (relationshipError) {
      console.error(
        "Load tutor students relationship error:",
        relationshipError
      )

      return NextResponse.json(
        {
          error:
            "Unable to load students.",
        },
        {
          status: 500,
        }
      )
    }

    const studentIds =
      (
        relationships || []
      ).map(
        (
          relationship
        ) =>
          relationship.student_id
      )

    if (
      studentIds.length === 0
    ) {
      return NextResponse.json(
        {
          students: [],
        },
        {
          status: 200,
        }
      )
    }

    const {
      data: students,
      error: studentError,
    } =
      await supabaseAdmin
        .from("users")
        .select(
          [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "level",
            "school",
            "guardian_name",
            "guardian_phone",
            "role",
            "email_verified",
            "account_status",
            "created_at",
          ].join(",")
        )
        .in(
          "id",
          studentIds
        )
        .eq(
          "role",
          "student"
        )

    if (studentError) {
      console.error(
        "Load tutor students error:",
        studentError
      )

      return NextResponse.json(
        {
          error:
            "Unable to load students.",
        },
        {
          status: 500,
        }
      )
    }

    type StudentRow = {
      id: string
      email: string | null
      first_name: string | null
      last_name: string | null
      phone: string | null
      level: string | null
      school: string | null
      guardian_name: string | null
      guardian_phone: string | null
      role: string | null
      email_verified: boolean | null
      account_status: string | null
      created_at: string
    }

    const studentRows =
      (students || []) as unknown as StudentRow[]

    const studentMap =
      new Map(
        studentRows.map(
          (
            student
          ) => [
            student.id,
            student,
          ]
        )
      )

    const result =
      (
        relationships || []
      )
        .map(
          (
            relationship
          ) => {
            const student =
              studentMap.get(
                relationship.student_id
              )

            if (!student) {
              return null
            }

            return {
              id: student.id,

              first_name:
                student.first_name,

              last_name:
                student.last_name,

              name:
                `${student.first_name || ""} ${student.last_name || ""}`.trim(),

              email:
                student.email,

              phone:
                student.phone,

              level:
                student.level,

              school:
                student.school,

              guardian_name:
                student.guardian_name,

              guardian_phone:
                student.guardian_phone,

              role:
                student.role,

              email_verified:
                student.email_verified,

              account_status:
                student.account_status,

              created_at:
                student.created_at,

              relationship_id:
                relationship.id,

              assigned_at:
                relationship.created_at,
            }
          }
        )
        .filter(
          (
            student
          ) =>
            student !== null
        )

    return NextResponse.json(
      {
        students: result,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Tutor students GET error:",
      error
    )

    return NextResponse.json(
      {
        error:
          "You are not authorized to access students.",
      },
      {
        status: 401,
      }
    )
  }
}

/*
|--------------------------------------------------------------------------
| POST /api/tutor/students
|--------------------------------------------------------------------------
| Create a student account and send an invitation.
|--------------------------------------------------------------------------
*/

export async function POST(
  request: NextRequest
) {
  try {
    const tutor =
      await requireRole([
        "tutor",
      ])

    const body =
      (await request.json()) as CreateStudentBody

    const firstName =
      cleanText(
        body.first_name
      )

    const lastName =
      cleanText(
        body.last_name
      )

    const email =
      cleanText(
        body.email
      ).toLowerCase()

    const phone =
      cleanText(
        body.phone
      )

    const level =
      cleanText(
        body.level
      )

    const school =
      cleanText(
        body.school
      )

    const guardianName =
      cleanText(
        body.guardian_name
      )

    const guardianPhone =
      cleanText(
        body.guardian_phone
      )

    if (!firstName) {
      return NextResponse.json(
        {
          error:
            "Student first name is required.",
        },
        {
          status: 400,
        }
      )
    }

    if (!lastName) {
      return NextResponse.json(
        {
          error:
            "Student last name is required.",
        },
        {
          status: 400,
        }
      )
    }

    if (!email) {
      return NextResponse.json(
        {
          error:
            "Student email is required.",
        },
        {
          status: 400,
        }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          error:
            "Please provide a valid email address.",
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
            "Student level is required.",
        },
        {
          status: 400,
        }
      )
    }

    /*
    |--------------------------------------------------------------------------
    | Check duplicate email
    |--------------------------------------------------------------------------
    */

    const {
      data: existingUser,
      error: existingUserError,
    } =
      await supabaseAdmin
        .from("users")
        .select(
          "id,email,role,account_status"
        )
        .ilike(
          "email",
          email
        )
        .maybeSingle()

    if (existingUserError) {
      console.error(
        "Student existing email check error:",
        existingUserError
      )

      return NextResponse.json(
        {
          error:
            "Unable to validate student email.",
        },
        {
          status: 500,
        }
      )
    }

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "An account with this email address already exists.",
        },
        {
          status: 409,
        }
      )
    }

    /*
    |--------------------------------------------------------------------------
    | Generate invitation token
    |--------------------------------------------------------------------------
    */

    const rawToken =
      generateSecureToken()

    const tokenHash =
      hashToken(
        rawToken
      )

    const tokenExpiry =
      getTokenExpiry(24)

    /*
    |--------------------------------------------------------------------------
    | Create student account
    |--------------------------------------------------------------------------
    */

    const {
      data: student,
      error: studentError,
    } =
      await supabaseAdmin
        .from("users")
        .insert({
          email,

          password_hash:
            null,

          first_name:
            firstName,

          last_name:
            lastName,

          phone:
            phone || null,

          level,

          school:
            school || null,

          guardian_name:
            guardianName || null,

          guardian_phone:
            guardianPhone || null,

          role:
            "student",

          email_verified:
            false,

          verification_token:
            tokenHash,

          verification_token_expires_at:
            tokenExpiry.toISOString(),

          account_status:
            "invited",
        })
        .select(
          [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "level",
            "school",
            "guardian_name",
            "guardian_phone",
            "role",
            "email_verified",
            "account_status",
            "created_at",
          ].join(",")
        )
        .single()

    if (studentError) {
      console.error(
        "Create student error:",
        studentError
      )

      return NextResponse.json(
        {
          error:
            "Unable to create student account.",
        },
        {
          status: 500,
        }
      )
    }

    /*
    |--------------------------------------------------------------------------
    | Connect student to tutor
    |--------------------------------------------------------------------------
    */

    const {
      error: relationshipError,
    } =
      await supabaseAdmin
        .from("tutor_students")
        .insert({
          tutor_id:
            tutor.id,

          student_id:
            student.id,
        })

    if (relationshipError) {
      console.error(
        "Create tutor student relationship error:",
        relationshipError
      )

      /*
      |--------------------------------------------------------------------------
      | Roll back student if relationship creation fails
      |--------------------------------------------------------------------------
      */

      await supabaseAdmin
        .from("users")
        .delete()
        .eq(
          "id",
          student.id
        )

      return NextResponse.json(
        {
          error:
            "Unable to assign student to tutor.",
        },
        {
          status: 500,
        }
      )
    }

    /*
    |--------------------------------------------------------------------------
    | Send invitation email
    |--------------------------------------------------------------------------
    */

    try {
      await sendStudentInvitation({
        studentName:
          `${firstName} ${lastName}`,

        studentEmail:
          email,

        token:
          rawToken,
      })
    } catch (emailError) {
      console.error(
        "Student invitation email error:",
        emailError
      )

      /*
      |--------------------------------------------------------------------------
      | Roll back relationship and account
      |--------------------------------------------------------------------------
      */

      await supabaseAdmin
        .from("tutor_students")
        .delete()
        .eq(
          "tutor_id",
          tutor.id
        )
        .eq(
          "student_id",
          student.id
        )

      await supabaseAdmin
        .from("users")
        .delete()
        .eq(
          "id",
          student.id
        )

      return NextResponse.json(
        {
          error:
            "Student was not created because the invitation email could not be sent.",
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
          "Student created and invitation sent successfully.",

        student,
      },
      {
        status: 201,
      }
    )
  } catch (error) {
    console.error(
      "Tutor students POST error:",
      error
    )

    return NextResponse.json(
      {
        error:
          "You are not authorized to create students.",
      },
      {
        status: 401,
      }
    )
  }
}