import {
  NextRequest,
  NextResponse,
} from "next/server"

import {
  supabaseAdmin,
} from "@/lib/supabaseAdmin"

import {
  requireRole,
} from "@/lib/auth/session"

const VALID_LEVELS = [
  "O-Level",
  "A-Level",
]

const VALID_CURRICULA = [
  "ZIMSEC",
  "Cambridge",
]

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

type TutorAssignmentInput = {
  subject?: string
  level?: string
  curriculum?: string
}

type UpdateTutorBody = {
  name?: string
  email?: string
  phone?: string
  account_status?: string
  assignments?: TutorAssignmentInput[]
}

function isValidUUID(
  value: string
): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value.trim()
  )
}

function splitFullName(
  name: string
) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) {
    return {
      firstName: "",
      lastName: "",
    }
  }

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      lastName: "",
    }
  }

  return {
    firstName: parts[0],
    lastName:
      parts.slice(1).join(" "),
  }
}

function validateAssignments(
  assignments: TutorAssignmentInput[]
) {
  if (
    !Array.isArray(assignments) ||
    assignments.length === 0
  ) {
    return "At least one teaching assignment is required."
  }

  const combinations =
    new Set<string>()

  for (
    let index = 0;
    index < assignments.length;
    index++
  ) {
    const assignment =
      assignments[index]

    const subject =
      assignment.subject
        ?.trim() || ""

    const level =
      assignment.level
        ?.trim() || ""

    const curriculum =
      assignment.curriculum
        ?.trim() || ""

    if (!subject) {
      return `Teaching assignment ${index + 1} is missing a subject.`
    }

    if (subject.length > 150) {
      return `Teaching assignment ${index + 1} has an invalid subject.`
    }

    if (!level) {
      return `Teaching assignment ${index + 1} is missing a level.`
    }

    if (
      !VALID_LEVELS.includes(level)
    ) {
      return `Teaching assignment ${index + 1} has an invalid level.`
    }

    if (!curriculum) {
      return `Teaching assignment ${index + 1} is missing a curriculum.`
    }

    if (
      !VALID_CURRICULA.includes(
        curriculum
      )
    ) {
      return `Teaching assignment ${index + 1} has an invalid curriculum.`
    }

    const key =
      `${subject.toLowerCase()}|` +
      `${level.toLowerCase()}|` +
      `${curriculum.toLowerCase()}`

    if (
      combinations.has(key)
    ) {
      return `Teaching assignment ${index + 1} duplicates another assignment.`
    }

    combinations.add(key)
  }

  return null
}

function normalizeAssignments(
  assignments: TutorAssignmentInput[]
) {
  return assignments.map(
    (assignment) => ({
      subject:
        assignment.subject
          ?.trim() || "",

      level:
        assignment.level
          ?.trim() || "",

      curriculum:
        assignment.curriculum
          ?.trim() || "",
    })
  )
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const admin =
      await requireRole([
        "admin",
        "administrator",
      ])

    if (
      admin.account_status !==
      "active"
    ) {
      return NextResponse.json(
        {
          error:
            "Your administrator account is not active.",
        },
        {
          status: 403,
        }
      )
    }

    const {
      id,
    } = await context.params

    if (!isValidUUID(id)) {
      return NextResponse.json(
        {
          error:
            "Invalid tutor ID.",
        },
        {
          status: 400,
        }
      )
    }

    const body =
      (await request.json()) as UpdateTutorBody

    /*
     * First make sure the target user
     * actually exists and is a tutor.
     */
    const {
      data: tutor,
      error: tutorError,
    } =
      await supabaseAdmin
        .from("users")
        .select(
          `
            id,
            email,
            first_name,
            last_name,
            phone,
            role,
            account_status,
            email_verified,
            created_at,
            updated_at
          `
        )
        .eq(
          "id",
          id
        )
        .maybeSingle()

    if (tutorError) {
      console.error(
        "Tutor lookup error:",
        tutorError
      )

      return NextResponse.json(
        {
          error:
            "Unable to retrieve tutor.",
        },
        {
          status: 500,
        }
      )
    }

    if (!tutor) {
      return NextResponse.json(
        {
          error:
            "Tutor not found.",
        },
        {
          status: 404,
        }
      )
    }

    if (
      tutor.role !==
      "tutor"
    ) {
      return NextResponse.json(
        {
          error:
            "The selected user is not a tutor.",
        },
        {
          status: 400,
        }
      )
    }

    const hasAssignments =
      Object.prototype.hasOwnProperty.call(
        body,
        "assignments"
      )

    /*
     * ----------------------------------------------------------
     * PROFILE FIELDS
     * ----------------------------------------------------------
     */

    const updateData: Record<
      string,
      unknown
    > = {}

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "name"
      )
    ) {
      const name =
        body.name?.trim() || ""

      if (!name) {
        return NextResponse.json(
          {
            error:
              "Tutor name is required.",
          },
          {
            status: 400,
          }
        )
      }

      if (name.length > 120) {
        return NextResponse.json(
          {
            error:
              "Tutor name is too long.",
          },
          {
            status: 400,
          }
        )
      }

      const {
        firstName,
        lastName,
      } =
        splitFullName(name)

      updateData.first_name =
        firstName

      updateData.last_name =
        lastName
    }

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "email"
      )
    ) {
      const email =
        body.email
          ?.trim()
          .toLowerCase() || ""

      if (!email) {
        return NextResponse.json(
          {
            error:
              "Tutor email is required.",
          },
          {
            status: 400,
          }
        )
      }

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (
        !emailPattern.test(email)
      ) {
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

      /*
       * Only check for another user when
       * the email is actually changing.
       */
      if (
        email !==
        tutor.email
          ?.trim()
          .toLowerCase()
      ) {
        const {
          data: existingUser,
          error:
            existingError,
        } =
          await supabaseAdmin
            .from("users")
            .select(
              `
                id,
                email
              `
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

        if (existingError) {
          console.error(
            "Email uniqueness check error:",
            existingError
          )

          return NextResponse.json(
            {
              error:
                "Could not verify the new email address.",
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
                "Another user already has this email address.",
            },
            {
              status: 409,
            }
          )
        }
      }

      updateData.email =
        email
    }

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "phone"
      )
    ) {
      const phone =
        body.phone?.trim() || null

      if (
        phone &&
        phone.length > 40
      ) {
        return NextResponse.json(
          {
            error:
              "Phone number is too long.",
          },
          {
            status: 400,
          }
        )
      }

      updateData.phone =
        phone
    }

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "account_status"
      )
    ) {
      const accountStatus =
        body.account_status
          ?.trim()
          .toLowerCase()

      const validStatuses = [
        "active",
        "disabled",
        "invited",
      ]

      if (
        !accountStatus ||
        !validStatuses.includes(
          accountStatus
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid account status.",
          },
          {
            status: 400,
          }
        )
      }

      updateData.account_status =
        accountStatus
    }

    /*
     * ----------------------------------------------------------
     * ACADEMIC ASSIGNMENTS
     * ----------------------------------------------------------
     *
     * If assignments is supplied, we replace the tutor's
     * complete assignment list.
     *
     * Example:
     *
     * [
     *   Mathematics / A-Level / ZIMSEC,
     *   Geography / A-Level / ZIMSEC,
     *   English / O-Level / ZIMSEC
     * ]
     *
     * becomes exactly three rows in tutor_subjects.
     */

    let normalizedAssignments:
      | {
          subject: string
          level: string
          curriculum: string
        }[]
      | null = null

    if (hasAssignments) {
      if (
        !Array.isArray(
          body.assignments
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Assignments must be an array.",
          },
          {
            status: 400,
          }
        )
      }

      const assignmentError =
        validateAssignments(
          body.assignments
        )

      if (assignmentError) {
        return NextResponse.json(
          {
            error:
              assignmentError,
          },
          {
            status: 400,
          }
        )
      }

      normalizedAssignments =
        normalizeAssignments(
          body.assignments
        )
    }

    /*
     * ----------------------------------------------------------
     * UPDATE USER PROFILE
     * ----------------------------------------------------------
     */

    if (
      Object.keys(updateData)
        .length > 0
    ) {
      const {
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

      if (updateError) {
        console.error(
          "Tutor profile update error:",
          updateError
        )

        if (
          updateError.code ===
          "23505"
        ) {
          return NextResponse.json(
            {
              error:
                "A user with this email address already exists.",
            },
            {
              status: 409,
            }
          )
        }

        return NextResponse.json(
          {
            error:
              "Unable to update tutor information.",
          },
          {
            status: 500,
          }
        )
      }
    }

    /*
     * ----------------------------------------------------------
     * REPLACE ACADEMIC ASSIGNMENTS
     * ----------------------------------------------------------
     */

    if (
      normalizedAssignments !==
      null
    ) {
      /*
       * Delete the old assignments first.
       */
      const {
        error: deleteError,
      } =
        await supabaseAdmin
          .from("tutor_subjects")
          .delete()
          .eq(
            "tutor_id",
            id
          )

      if (deleteError) {
        console.error(
          "Tutor assignment deletion error:",
          deleteError
        )

        return NextResponse.json(
          {
            error:
              "Tutor profile was updated, but the old teaching assignments could not be replaced.",
          },
          {
            status: 500,
          }
        )
      }

      /*
       * Insert the new assignments.
       */
      const {
        error: insertError,
      } =
        await supabaseAdmin
          .from("tutor_subjects")
          .insert(
            normalizedAssignments.map(
              (assignment) => ({
                tutor_id: id,
                subject:
                  assignment.subject,
                level:
                  assignment.level,
                curriculum:
                  assignment.curriculum,
              })
            )
          )

      if (insertError) {
        console.error(
          "Tutor assignment insertion error:",
          insertError
        )

        return NextResponse.json(
          {
            error:
              "Tutor profile was updated, but the new teaching assignments could not be saved.",
          },
          {
            status: 500,
          }
        )
      }
    }

    /*
     * ----------------------------------------------------------
     * RETURN UPDATED TUTOR
     * ----------------------------------------------------------
     */

    const {
      data: updatedTutor,
      error: updatedTutorError,
    } =
      await supabaseAdmin
        .from("users")
        .select(
          `
            id,
            email,
            first_name,
            last_name,
            phone,
            role,
            account_status,
            email_verified,
            created_at,
            updated_at
          `
        )
        .eq(
          "id",
          id
        )
        .single()

    if (updatedTutorError) {
      console.error(
        "Updated tutor fetch error:",
        updatedTutorError
      )

      return NextResponse.json(
        {
          success: true,
          message:
            "Tutor updated successfully.",
        }
      )
    }

    const {
      data: assignments,
      error: assignmentsError,
    } =
      await supabaseAdmin
        .from("tutor_subjects")
        .select(
          `
            id,
            subject,
            level,
            curriculum
          `
        )
        .eq(
          "tutor_id",
          id
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        )

    if (assignmentsError) {
      console.error(
        "Updated assignments fetch error:",
        assignmentsError
      )
    }

    return NextResponse.json({
      success: true,

      message:
        hasAssignments
          ? "Tutor information and teaching assignments updated successfully."
          : "Tutor information updated successfully.",

      tutor: {
        id:
          updatedTutor.id,

        name:
          `${updatedTutor.first_name || ""} ${
            updatedTutor.last_name || ""
          }`.trim(),

        email:
          updatedTutor.email,

        phone:
          updatedTutor.phone || "",

        role:
          updatedTutor.role,

        accountStatus:
          updatedTutor.account_status,

        emailVerified:
          updatedTutor.email_verified,

        assignments:
          assignments || [],
      },
    })
  } catch (error) {
    console.error(
      "PATCH /api/admin/tutors/[id] error:",
      error
    )

    if (
      error instanceof Error &&
      error.message ===
        "UNAUTHENTICATED"
    ) {
      return NextResponse.json(
        {
          error:
            "You must be logged in as an administrator.",
        },
        {
          status: 401,
        }
      )
    }

    if (
      error instanceof Error &&
      error.message ===
        "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          error:
            "Only administrators can update tutors.",
        },
        {
          status: 403,
        }
      )
    }

    return NextResponse.json(
      {
        error:
          "An unexpected server error occurred.",
      },
      {
        status: 500,
      }
    )
  }
}