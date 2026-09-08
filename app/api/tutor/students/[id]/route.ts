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

type UpdateStudentBody = {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  level?: string
  school?: string
  guardian_name?: string
  guardian_phone?: string
  account_status?: string
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

function isValidEmail(
  email: string
): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  )
}

async function verifyTutorOwnsStudent(
  tutorId: string,
  studentId: string
) {
  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from("tutor_students")
      .select(
        "id,tutor_id,student_id"
      )
      .eq(
        "tutor_id",
        tutorId
      )
      .eq(
        "student_id",
        studentId
      )
      .maybeSingle()

  if (error) {
    console.error(
      "Tutor student ownership check error:",
      error
    )

    throw new Error(
      "Unable to verify student ownership."
    )
  }

  return data
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const tutor =
      await requireRole([
        "tutor",
      ])

    const {
      id,
    } = await context.params

    if (!isValidUUID(id)) {
      return NextResponse.json(
        {
          error:
            "Invalid student ID.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Security check:
     *
     * The tutor can only update students
     * assigned to that tutor.
     */
    const relationship =
      await verifyTutorOwnsStudent(
        tutor.id,
        id
      )

    if (!relationship) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to manage this student.",
        },
        {
          status: 403,
        }
      )
    }

    const {
      data: existingStudent,
      error:
        existingStudentError,
    } =
      await supabaseAdmin
        .from("users")
        .select(
          "id,email,first_name,last_name,phone,level,school,guardian_name,guardian_phone,role,email_verified,account_status,created_at"
        )
        .eq(
          "id",
          id
        )
        .eq(
          "role",
          "student"
        )
        .maybeSingle()

    if (existingStudentError) {
      console.error(
        "Existing student lookup error:",
        existingStudentError
      )

      return NextResponse.json(
        {
          error:
            "Unable to find student.",
        },
        {
          status: 500,
        }
      )
    }

    if (!existingStudent) {
      return NextResponse.json(
        {
          error:
            "Student not found.",
        },
        {
          status: 404,
        }
      )
    }

    const body =
      (await request.json()) as UpdateStudentBody

    const firstName =
      body.first_name !==
      undefined
        ? cleanText(
            body.first_name
          )
        : undefined

    const lastName =
      body.last_name !==
      undefined
        ? cleanText(
            body.last_name
          )
        : undefined

    const email =
      body.email !==
      undefined
        ? cleanText(
            body.email
          ).toLowerCase()
        : undefined

    const phone =
      body.phone !==
      undefined
        ? cleanText(
            body.phone
          )
        : undefined

    const level =
      body.level !==
      undefined
        ? cleanText(
            body.level
          )
        : undefined

    const school =
      body.school !==
      undefined
        ? cleanText(
            body.school
          )
        : undefined

    const guardianName =
      body.guardian_name !==
      undefined
        ? cleanText(
            body.guardian_name
          )
        : undefined

    const guardianPhone =
      body.guardian_phone !==
      undefined
        ? cleanText(
            body.guardian_phone
          )
        : undefined

    const accountStatus =
      body.account_status !==
      undefined
        ? cleanText(
            body.account_status
          )
        : undefined

    if (
      firstName !==
        undefined &&
      !firstName
    ) {
      return NextResponse.json(
        {
          error:
            "First name cannot be empty.",
        },
        {
          status: 400,
        }
      )
    }

    if (
      lastName !==
        undefined &&
      !lastName
    ) {
      return NextResponse.json(
        {
          error:
            "Last name cannot be empty.",
        },
        {
          status: 400,
        }
      )
    }

    if (
      email !==
        undefined
    ) {
      if (!email) {
        return NextResponse.json(
          {
            error:
              "Email cannot be empty.",
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
    }

    if (
      level !==
        undefined &&
      !level
    ) {
      return NextResponse.json(
        {
          error:
            "Student level cannot be empty.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Tutors are not allowed to change the role.
     *
     * Account status is deliberately restricted
     * to safe student states.
     */
    if (
      accountStatus !==
        undefined &&
      ![
        "active",
        "disabled",
        "suspended",
      ].includes(
        accountStatus
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid student account status.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * If email changes, make sure another user
     * does not already have that email.
     */
    if (
      email !==
        undefined &&
      email.toLowerCase() !==
        existingStudent.email.toLowerCase()
    ) {
      const {
        data:
          duplicateUser,
        error:
          duplicateError,
      } =
        await supabaseAdmin
          .from("users")
          .select(
            "id"
          )
          .ilike(
            "email",
            email
          )
          .neq(
            "id",
            id
          )
          .maybeSingle()

      if (duplicateError) {
        console.error(
          "Student email duplicate check error:",
          duplicateError
        )

        return NextResponse.json(
          {
            error:
              "Unable to validate the email address.",
          },
          {
            status: 500,
          }
        )
      }

      if (duplicateUser) {
        return NextResponse.json(
          {
            error:
              "Another account already uses this email address.",
          },
          {
            status: 409,
          }
        )
      }
    }

    const updateData: Record<
      string,
      unknown
    > = {}

    if (
      firstName !==
      undefined
    ) {
      updateData.first_name =
        firstName
    }

    if (
      lastName !==
      undefined
    ) {
      updateData.last_name =
        lastName
    }

    if (
      email !==
      undefined
    ) {
      updateData.email =
        email
    }

    if (
      phone !==
      undefined
    ) {
      updateData.phone =
        phone || null
    }

    if (
      level !==
      undefined
    ) {
      updateData.level =
        level
    }

    if (
      school !==
      undefined
    ) {
      updateData.school =
        school || null
    }

    if (
      guardianName !==
      undefined
    ) {
      updateData.guardian_name =
        guardianName ||
        null
    }

    if (
      guardianPhone !==
      undefined
    ) {
      updateData.guardian_phone =
        guardianPhone ||
        null
    }

    if (
      accountStatus !==
      undefined
    ) {
      updateData.account_status =
        accountStatus
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
      data: updatedStudent,
      error: updateError,
    } =
      await supabaseAdmin
        .from("users")
        .update(
          updateData
        )
        .eq(
          "id",
          id
        )
        .eq(
          "role",
          "student"
        )
        .select(
          "id,email,first_name,last_name,phone,level,school,guardian_name,guardian_phone,role,email_verified,account_status,created_at"
        )
        .single()

    if (updateError) {
      console.error(
        "Update student error:",
        updateError
      )

      return NextResponse.json(
        {
          error:
            "Unable to update student.",
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(
      {
        success: true,
        student:
          updatedStudent,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Tutor student PATCH error:",
      error
    )

    if (
      error instanceof Error &&
      error.message ===
        "Unable to verify student ownership."
    ) {
      return NextResponse.json(
        {
          error:
            error.message,
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(
      {
        error:
          "You are not authorized to update this student.",
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
    const tutor =
      await requireRole([
        "tutor",
      ])

    const {
      id,
    } = await context.params

    if (!isValidUUID(id)) {
      return NextResponse.json(
        {
          error:
            "Invalid student ID.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Security:
     * tutor can only delete their own
     * student relationship/account.
     */
    const relationship =
      await verifyTutorOwnsStudent(
        tutor.id,
        id
      )

    if (!relationship) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to remove this student.",
        },
        {
          status: 403,
        }
      )
    }

    const {
      data: student,
      error:
        studentLookupError,
    } =
      await supabaseAdmin
        .from("users")
        .select(
          "id,first_name,last_name,email,role"
        )
        .eq(
          "id",
          id
        )
        .eq(
          "role",
          "student"
        )
        .maybeSingle()

    if (studentLookupError) {
      console.error(
        "Student delete lookup error:",
        studentLookupError
      )

      return NextResponse.json(
        {
          error:
            "Unable to find student.",
        },
        {
          status: 500,
        }
      )
    }

    if (!student) {
      return NextResponse.json(
        {
          error:
            "Student not found.",
        },
        {
          status: 404,
        }
      )
    }

    /*
     * Delete only the relationship first.
     *
     * This is safer for the future because a student
     * may eventually be assigned to multiple tutors.
     */
    const {
      error:
        relationshipDeleteError,
    } =
      await supabaseAdmin
        .from("tutor_students")
        .delete()
        .eq(
          "id",
          relationship.id
        )
        .eq(
          "tutor_id",
          tutor.id
        )
        .eq(
          "student_id",
          id
        )

    if (
      relationshipDeleteError
    ) {
      console.error(
        "Delete tutor student relationship error:",
        relationshipDeleteError
      )

      return NextResponse.json(
        {
          error:
            "Unable to remove student from your student list.",
        },
        {
          status: 500,
        }
      )
    }

    /*
     * Delete the student account.
     *
     * This follows the current system design where
     * the student account belongs to this tutor.
     */
    const {
      error: deleteStudentError,
    } =
      await supabaseAdmin
        .from("users")
        .delete()
        .eq(
          "id",
          id
        )
        .eq(
          "role",
          "student"
        )

    if (deleteStudentError) {
      console.error(
        "Delete student account error:",
        deleteStudentError
      )

      return NextResponse.json(
        {
          error:
            "Student relationship was removed, but the account could not be deleted.",
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
          "Student deleted successfully.",
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Tutor student DELETE error:",
      error
    )

    return NextResponse.json(
      {
        error:
          "You are not authorized to delete this student.",
      },
      {
        status: 401,
      }
    )
  }
}