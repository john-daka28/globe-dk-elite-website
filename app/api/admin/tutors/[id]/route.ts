
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

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

const allowedStatuses = [
  "invited",
  "active",
  "suspended",
  "disabled",
] as const

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  )
}

function getInitials(
  firstName: string | null,
  lastName: string | null
) {
  const first =
    firstName?.trim()?.charAt(0) || ""

  const last =
    lastName?.trim()?.charAt(0) || ""

  return (
    `${first}${last}`.toUpperCase() ||
    "TU"
  )
}

function formatJoinedDate(
  createdAt: string | null
) {
  if (!createdAt) {
    return "Not specified"
  }

  const date = new Date(createdAt)

  if (Number.isNaN(date.getTime())) {
    return "Not specified"
  }

  return date.toLocaleDateString(
    "en-ZW",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  )
}

function mapAccountStatus(
  accountStatus: string | null
): "Active" | "Pending" | "Inactive" {
  if (accountStatus === "active") {
    return "Active"
  }

  if (accountStatus === "invited") {
    return "Pending"
  }

  return "Inactive"
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
    lastName: parts
      .slice(1)
      .join(" "),
  }
}

/*
 * GET
 *
 * GET /api/admin/tutors/:id
 *
 * Returns one tutor.
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    /*
     * Only administrators can access
     * individual tutor records.
     */
    await requireRole([
      "admin",
      "administrator",
    ])

    const { id } = await context.params

    if (!isValidUuid(id)) {
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
            email_verified,
            created_at,
            updated_at,
            account_status
          `
        )
        .eq("id", id)
        .eq("role", "tutor")
        .maybeSingle()

    if (tutorError) {
      console.error(
        "GET tutor error:",
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

    /*
     * Retrieve the tutor's academic
     * subject/level/curriculum assignments.
     */
    const {
      data: tutorSubjects,
      error: subjectsError,
    } =
      await supabaseAdmin
        .from("tutor_subjects")
        .select(
          `
            id,
            subject,
            level,
            curriculum,
            created_at
          `
        )
        .eq("tutor_id", id)
        .order(
          "subject",
          {
            ascending: true,
          }
        )

    if (subjectsError) {
      console.error(
        "GET tutor subjects error:",
        subjectsError
      )

      return NextResponse.json(
        {
          error:
            "Unable to retrieve tutor subjects.",
        },
        {
          status: 500,
        }
      )
    }

    const subjects = Array.from(
      new Set(
        (tutorSubjects || []).map(
          (item) => item.subject
        )
      )
    )

    const levels = Array.from(
      new Set(
        (tutorSubjects || []).map(
          (item) => item.level
        )
      )
    )

    const curricula = Array.from(
      new Set(
        (tutorSubjects || []).map(
          (item) => item.curriculum
        )
      )
    )

    /*
     * Student assignment count.
     *
     * This deliberately does not assume a
     * student assignment table exists.
     *
     * If you later create a tutor_students
     * table, this is where the count can be
     * connected.
     */
    const students = 0

    const firstName =
      tutor.first_name || ""

    const lastName =
      tutor.last_name || ""

    return NextResponse.json({
      tutor: {
        id: tutor.id,
        name:
          `${firstName} ${lastName}`
            .trim() ||
          "Unnamed Tutor",
        email:
          tutor.email || "",
        phone:
          tutor.phone || "",
        subjects,
        levels,
        curricula,
        students,
        status:
          mapAccountStatus(
            tutor.account_status
          ),
        account_status:
          tutor.account_status,
        email_verified:
          tutor.email_verified,
        experience:
          "Not specified",
        joined:
          formatJoinedDate(
            tutor.created_at
          ),
        initials:
          getInitials(
            tutor.first_name,
            tutor.last_name
          ),
        created_at:
          tutor.created_at,
        updated_at:
          tutor.updated_at,
        subject_assignments:
          tutorSubjects || [],
      },
    })
  } catch (error) {
    console.error(
      "GET /api/admin/tutors/[id] error:",
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unauthorized.",
      },
      {
        status:
          error instanceof Error &&
          error.message
            .toLowerCase()
            .includes("unauthorized")
            ? 401
            : 500,
      }
    )
  }
}

/*
 * PATCH
 *
 * PATCH /api/admin/tutors/:id
 *
 * Used for:
 *
 * 1. Editing tutor information
 * 2. Activating a tutor
 * 3. Deactivating a tutor
 * 4. Suspending a tutor
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    /*
     * Only administrators can modify
     * tutor accounts.
     */
    await requireRole([
      "admin",
      "administrator",
    ])

    const { id } = await context.params

    if (!isValidUuid(id)) {
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

    /*
     * Make sure this user actually exists
     * and is a tutor.
     */
    const {
      data: existingTutor,
      error: existingTutorError,
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
            email_verified
          `
        )
        .eq("id", id)
        .eq("role", "tutor")
        .maybeSingle()

    if (existingTutorError) {
      console.error(
        "Existing tutor lookup error:",
        existingTutorError
      )

      return NextResponse.json(
        {
          error:
            "Unable to find tutor.",
        },
        {
          status: 500,
        }
      )
    }

    if (!existingTutor) {
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

    const body =
      await request.json()

    /*
     * Supported fields:
     *
     * name
     * email
     * phone
     * account_status
     */
    const hasName =
      Object.prototype.hasOwnProperty.call(
        body,
        "name"
      )

    const hasEmail =
      Object.prototype.hasOwnProperty.call(
        body,
        "email"
      )

    const hasPhone =
      Object.prototype.hasOwnProperty.call(
        body,
        "phone"
      )

    const hasStatus =
      Object.prototype.hasOwnProperty.call(
        body,
        "account_status"
      )

    if (
      !hasName &&
      !hasEmail &&
      !hasPhone &&
      !hasStatus
    ) {
      return NextResponse.json(
        {
          error:
            "No tutor information was provided.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Build the update object.
     */
    const updateData: Record<
      string,
      unknown
    > = {}

    /*
     * NAME
     */
    if (hasName) {
      const name =
        typeof body.name === "string"
          ? body.name.trim()
          : ""

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

    /*
     * EMAIL
     */
    if (hasEmail) {
      const email =
        typeof body.email === "string"
          ? body.email
              .trim()
              .toLowerCase()
          : ""

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

      /*
       * Basic email validation.
       */
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
       * Prevent another account from
       * already using this email.
       */
      const {
        data: emailOwner,
        error:
          emailOwnerError,
      } =
        await supabaseAdmin
          .from("users")
          .select(
            "id, email"
          )
          .ilike(
            "email",
            email
          )
          .neq("id", id)
          .maybeSingle()

      if (emailOwnerError) {
        console.error(
          "Email ownership lookup error:",
          emailOwnerError
        )

        return NextResponse.json(
          {
            error:
              "Unable to verify tutor email.",
          },
          {
            status: 500,
          }
        )
      }

      if (emailOwner) {
        return NextResponse.json(
          {
            error:
              "That email address is already being used by another account.",
          },
          {
            status: 409,
          }
        )
      }

      updateData.email =
        email
    }

    /*
     * PHONE
     */
    if (hasPhone) {
      const phone =
        typeof body.phone === "string"
          ? body.phone.trim()
          : ""

      if (phone.length > 40) {
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

      /*
       * Empty phone numbers are allowed.
       */
      updateData.phone =
        phone || null
    }

    /*
     * ACCOUNT STATUS
     */
    if (hasStatus) {
      const accountStatus =
        typeof body.account_status ===
        "string"
          ? body.account_status
              .trim()
              .toLowerCase()
          : ""

      if (
        !allowedStatuses.includes(
          accountStatus as
            (typeof allowedStatuses)[number]
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid tutor account status.",
          },
          {
            status: 400,
          }
        )
      }

      /*
       * Admin can activate/deactivate/
       * suspend a tutor.
       */
      updateData.account_status =
        accountStatus

      /*
       * If an invited tutor is manually
       * activated by an administrator,
       * consider the email verified.
       *
       * Normally activation should happen
       * through the invitation flow.
       */
      if (
        accountStatus === "active"
      ) {
        updateData.email_verified =
          true
      }

      /*
       * If the account is disabled or
       * suspended, we don't remove the
       * tutor's password.
       *
       * This means reactivation later can
       * use the existing password.
       */
    }

    updateData.updated_at =
      new Date().toISOString()

    /*
     * Perform the actual update.
     */
    const {
      data: updatedTutor,
      error: updateError,
    } =
      await supabaseAdmin
        .from("users")
        .update(updateData)
        .eq("id", id)
        .eq("role", "tutor")
        .select(
          `
            id,
            email,
            first_name,
            last_name,
            phone,
            role,
            email_verified,
            created_at,
            updated_at,
            account_status
          `
        )
        .single()

    if (updateError) {
      console.error(
        "Tutor update error:",
        updateError
      )

      /*
       * PostgreSQL duplicate-key errors
       * can still occur even after our
       * email lookup because of race
       * conditions/database constraints.
       */
      if (
        updateError.code ===
        "23505"
      ) {
        return NextResponse.json(
          {
            error:
              "That email address is already being used by another account.",
          },
          {
            status: 409,
          }
        )
      }

      return NextResponse.json(
        {
          error:
            "Unable to update tutor.",
        },
        {
          status: 500,
        }
      )
    }

    /*
     * Create a clean response object.
     * Never return password_hash,
     * verification_token or reset_token.
     */
    const status =
      mapAccountStatus(
        updatedTutor.account_status
      )

    let message =
      "Tutor information updated successfully."

    if (hasStatus) {
      if (
        updatedTutor.account_status ===
        "active"
      ) {
        message =
          "Tutor account activated successfully."
      } else if (
        updatedTutor.account_status ===
        "disabled"
      ) {
        message =
          "Tutor account deactivated successfully."
      } else if (
        updatedTutor.account_status ===
        "suspended"
      ) {
        message =
          "Tutor account suspended successfully."
      } else if (
        updatedTutor.account_status ===
        "invited"
      ) {
        message =
          "Tutor account returned to pending invitation status."
      }
    }

    return NextResponse.json({
      success: true,
      message,
      tutor: {
        id: updatedTutor.id,
        name:
          `${updatedTutor.first_name || ""} ${
            updatedTutor.last_name || ""
          }`.trim() ||
          "Unnamed Tutor",
        email:
          updatedTutor.email || "",
        phone:
          updatedTutor.phone || "",
        status,
        account_status:
          updatedTutor.account_status,
        email_verified:
          updatedTutor.email_verified,
        initials:
          getInitials(
            updatedTutor.first_name,
            updatedTutor.last_name
          ),
        joined:
          formatJoinedDate(
            updatedTutor.created_at
          ),
      },
    })
  } catch (error) {
    console.error(
      "PATCH /api/admin/tutors/[id] error:",
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update tutor.",
      },
      {
        status:
          error instanceof Error &&
          error.message
            .toLowerCase()
            .includes("unauthorized")
            ? 401
            : 500,
      }
    )
  }
}

/*
 * DELETE
 *
 * DELETE /api/admin/tutors/:id
 *
 * Permanently removes the tutor account.
 *
 * Because tutor_subjects.tutor_id has
 * ON DELETE CASCADE, associated tutor
 * subject records will also be removed.
 */
export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    await requireRole([
      "admin",
      "administrator",
    ])

    const { id } = await context.params

    if (!isValidUuid(id)) {
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

    /*
     * Confirm that this is actually
     * a tutor before deleting.
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
            role
          `
        )
        .eq("id", id)
        .eq("role", "tutor")
        .maybeSingle()

    if (tutorError) {
      console.error(
        "Tutor delete lookup error:",
        tutorError
      )

      return NextResponse.json(
        {
          error:
            "Unable to find tutor.",
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

    /*
     * Delete tutor subject assignments
     * explicitly first.
     *
     * This is safe even if ON DELETE CASCADE
     * is already configured.
     */
    const {
      error: subjectsDeleteError,
    } =
      await supabaseAdmin
        .from("tutor_subjects")
        .delete()
        .eq("tutor_id", id)

    if (subjectsDeleteError) {
      console.error(
        "Tutor subjects delete error:",
        subjectsDeleteError
      )

      return NextResponse.json(
        {
          error:
            "Unable to remove tutor subject assignments.",
        },
        {
          status: 500,
        }
      )
    }

    /*
     * Delete the tutor account.
     */
    const {
      error: deleteError,
    } =
      await supabaseAdmin
        .from("users")
        .delete()
        .eq("id", id)
        .eq("role", "tutor")

    if (deleteError) {
      console.error(
        "Tutor delete error:",
        deleteError
      )

      return NextResponse.json(
        {
          error:
            "Unable to delete tutor account.",
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json({
      success: true,
      message:
        "Tutor account deleted successfully.",
      tutor_id: id,
    })
  } catch (error) {
    console.error(
      "DELETE /api/admin/tutors/[id] error:",
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete tutor.",
      },
      {
        status:
          error instanceof Error &&
          error.message
            .toLowerCase()
            .includes("unauthorized")
            ? 401
            : 500,
      }
    )
  }
}

