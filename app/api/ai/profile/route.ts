import {
  NextRequest,
  NextResponse,
} from "next/server"

import {
  getAIStudentSession,
} from "@/lib/ai-auth"

import {
  supabaseAdmin,
} from "@/lib/supabase-admin"

import bcrypt from "bcryptjs"

export const runtime = "nodejs"

/* ============================================================
   UNAUTHORIZED RESPONSE
   ============================================================ */

function unauthorizedResponse() {
  return NextResponse.json(
    {
      authenticated: false,
      student: null,
    },
    {
      status: 401,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  )
}

/* ============================================================
   GET PROFILE
   ============================================================ */

export async function GET() {
  try {
    const session =
      await getAIStudentSession()

    if (!session?.id) {
      return unauthorizedResponse()
    }

    const {
      data: student,
      error,
    } =
      await supabaseAdmin
        .from("ai_students")
        .select(
          `
          id,
          first_name,
          last_name,
          email,
          level,
          curriculum,
          account_status
          `
        )
        .eq("id", session.id)
        .maybeSingle()

    if (error) {
      console.error(
        "AI profile lookup error:",
        error
      )

      return NextResponse.json(
        {
          error:
            "Unable to load your profile.",
        },
        {
          status: 500,
          headers: {
            "Cache-Control":
              "no-store",
          },
        }
      )
    }

    if (!student) {
      return unauthorizedResponse()
    }

    if (
      student.account_status !==
      "active"
    ) {
      return NextResponse.json(
        {
          error:
            "Your account is not active.",
        },
        {
          status: 403,
          headers: {
            "Cache-Control":
              "no-store",
          },
        }
      )
    }

    return NextResponse.json(
      {
        authenticated: true,

        student: {
          id: student.id,

          firstName:
            student.first_name,

          lastName:
            student.last_name,

          email:
            student.email,

          level:
            student.level,

          curriculum:
            student.curriculum,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    )
  } catch (error) {
    console.error(
      "AI profile GET error:",
      error
    )

    return unauthorizedResponse()
  }
}

/* ============================================================
   UPDATE PROFILE / CHANGE PASSWORD
   ============================================================ */

export async function PATCH(
  request: NextRequest
) {
  try {
    /* ========================================================
       AUTHENTICATION
       ======================================================== */

    const session =
      await getAIStudentSession()

    if (!session?.id) {
      return unauthorizedResponse()
    }

    /* ========================================================
       REQUEST BODY
       ======================================================== */

    const body =
      await request.json()

    /* ========================================================
       CHECK WHETHER THIS IS A PASSWORD CHANGE
       ======================================================== */

    const hasPasswordRequest =
      typeof body.currentPassword ===
        "string" ||
      typeof body.newPassword ===
        "string" ||
      typeof body.confirmPassword ===
        "string"

    /* ========================================================
       PASSWORD CHANGE
       ======================================================== */

    if (hasPasswordRequest) {
      const currentPassword =
        typeof body.currentPassword ===
        "string"
          ? body.currentPassword
          : ""

      const newPassword =
        typeof body.newPassword ===
        "string"
          ? body.newPassword
          : ""

      const confirmPassword =
        typeof body.confirmPassword ===
        "string"
          ? body.confirmPassword
          : ""

      /* ------------------------------------------------------
         REQUIRED PASSWORD FIELDS
         ------------------------------------------------------ */

      if (!currentPassword) {
        return NextResponse.json(
          {
            error:
              "Current password is required.",
          },
          {
            status: 400,
          }
        )
      }

      if (!newPassword) {
        return NextResponse.json(
          {
            error:
              "New password is required.",
          },
          {
            status: 400,
          }
        )
      }

      if (!confirmPassword) {
        return NextResponse.json(
          {
            error:
              "Please confirm your new password.",
          },
          {
            status: 400,
          }
        )
      }

      /* ------------------------------------------------------
         PASSWORD LENGTH
         ------------------------------------------------------ */

      if (newPassword.length < 8) {
        return NextResponse.json(
          {
            error:
              "Your new password must be at least 8 characters long.",
          },
          {
            status: 400,
          }
        )
      }

      /* ------------------------------------------------------
         CONFIRM PASSWORD
         ------------------------------------------------------ */

      if (
        newPassword !==
        confirmPassword
      ) {
        return NextResponse.json(
          {
            error:
              "The new passwords do not match.",
          },
          {
            status: 400,
          }
        )
      }

      /* ------------------------------------------------------
         PREVENT SAME PASSWORD
         ------------------------------------------------------ */

      if (
        currentPassword ===
        newPassword
      ) {
        return NextResponse.json(
          {
            error:
              "Your new password must be different from your current password.",
          },
          {
            status: 400,
          }
        )
      }

      /* ------------------------------------------------------
         LOAD CURRENT PASSWORD HASH
         ------------------------------------------------------ */

      const {
        data: student,
        error: studentError,
      } =
        await supabaseAdmin
          .from("ai_students")
          .select(
            `
            id,
            password_hash,
            account_status
            `
          )
          .eq("id", session.id)
          .maybeSingle()

      if (studentError) {
        console.error(
          "AI password student lookup error:",
          studentError
        )

        return NextResponse.json(
          {
            error:
              "Unable to verify your account.",
          },
          {
            status: 500,
          }
        )
      }

      if (!student) {
        return unauthorizedResponse()
      }

      if (
        student.account_status !==
        "active"
      ) {
        return NextResponse.json(
          {
            error:
              "Your account is not active.",
          },
          {
            status: 403,
          }
        )
      }

      /* ------------------------------------------------------
         VERIFY CURRENT PASSWORD
         ------------------------------------------------------ */

      const passwordMatches =
        await bcrypt.compare(
          currentPassword,
          student.password_hash
        )

      if (!passwordMatches) {
        return NextResponse.json(
          {
            error:
              "Your current password is incorrect.",
          },
          {
            status: 400,
          }
        )
      }

      /* ------------------------------------------------------
         HASH NEW PASSWORD
         ------------------------------------------------------ */

      const newPasswordHash =
        await bcrypt.hash(
          newPassword,
          12
        )

      /* ------------------------------------------------------
         UPDATE PASSWORD
         ------------------------------------------------------ */

      const {
        error: passwordUpdateError,
      } =
        await supabaseAdmin
          .from("ai_students")
          .update({
            password_hash:
              newPasswordHash,

            updated_at:
              new Date().toISOString(),
          })
          .eq("id", session.id)

      if (passwordUpdateError) {
        console.error(
          "AI password update error:",
          passwordUpdateError
        )

        return NextResponse.json(
          {
            error:
              "Unable to change your password. Please try again.",
          },
          {
            status: 500,
          }
        )
      }

      return NextResponse.json(
        {
          success: true,

          passwordChanged: true,

          message:
            "Your password has been changed successfully.",
        },
        {
          status: 200,
          headers: {
            "Cache-Control":
              "no-store",
          },
        }
      )
    }

    /* ========================================================
       PROFILE UPDATE
       ======================================================== */

    const firstName =
      typeof body.firstName ===
      "string"
        ? body.firstName.trim()
        : ""

    const lastName =
      typeof body.lastName ===
      "string"
        ? body.lastName.trim()
        : ""

    const level =
      typeof body.level ===
      "string"
        ? body.level.trim()
        : ""

    const curriculum =
      typeof body.curriculum ===
      "string"
        ? body.curriculum.trim()
        : ""

    /* --------------------------------------------------------
       REQUIRED FIRST NAME
       -------------------------------------------------------- */

    if (!firstName) {
      return NextResponse.json(
        {
          error:
            "First name is required.",
        },
        {
          status: 400,
        }
      )
    }

    /* --------------------------------------------------------
       REQUIRED LAST NAME
       -------------------------------------------------------- */

    if (!lastName) {
      return NextResponse.json(
        {
          error:
            "Last name is required.",
        },
        {
          status: 400,
        }
      )
    }

    /* --------------------------------------------------------
       VALID LEVEL
       -------------------------------------------------------- */

    if (
      level &&
      level !== "O-Level" &&
      level !== "A-Level"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid level selected.",
        },
        {
          status: 400,
        }
      )
    }

    /* --------------------------------------------------------
       VALID CURRICULUM
       -------------------------------------------------------- */

    if (
      curriculum &&
      curriculum !== "ZIMSEC" &&
      curriculum !== "Cambridge"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid curriculum selected.",
        },
        {
          status: 400,
        }
      )
    }

    /* --------------------------------------------------------
       VERIFY ACCOUNT
       -------------------------------------------------------- */

    const {
      data: existingStudent,
      error: existingError,
    } =
      await supabaseAdmin
        .from("ai_students")
        .select(
          "id, account_status"
        )
        .eq("id", session.id)
        .maybeSingle()

    if (existingError) {
      console.error(
        "AI profile student check error:",
        existingError
      )

      return NextResponse.json(
        {
          error:
            "Unable to verify your account.",
        },
        {
          status: 500,
        }
      )
    }

    if (!existingStudent) {
      return unauthorizedResponse()
    }

    if (
      existingStudent.account_status !==
      "active"
    ) {
      return NextResponse.json(
        {
          error:
            "Your account is not active.",
        },
        {
          status: 403,
        }
      )
    }

    /* --------------------------------------------------------
       UPDATE PROFILE
       -------------------------------------------------------- */

    const {
      data: updatedStudent,
      error: updateError,
    } =
      await supabaseAdmin
        .from("ai_students")
        .update({
          first_name:
            firstName,

          last_name:
            lastName,

          level:
            level || "O-Level",

          curriculum:
            curriculum || "ZIMSEC",

          updated_at:
            new Date().toISOString(),
        })
        .eq("id", session.id)
        .select(
          `
          id,
          first_name,
          last_name,
          email,
          level,
          curriculum
          `
        )
        .single()

    if (updateError) {
      console.error(
        "AI profile update error:",
        updateError
      )

      return NextResponse.json(
        {
          error:
            "Unable to update your profile.",
        },
        {
          status: 500,
        }
      )
    }

    /* --------------------------------------------------------
       SUCCESS
       -------------------------------------------------------- */

    return NextResponse.json(
      {
        success: true,

        profileUpdated: true,

        student: {
          id:
            updatedStudent.id,

          firstName:
            updatedStudent.first_name,

          lastName:
            updatedStudent.last_name,

          email:
            updatedStudent.email,

          level:
            updatedStudent.level,

          curriculum:
            updatedStudent.curriculum,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    )
  } catch (error) {
    console.error(
      "AI profile PATCH error:",
      error
    )

    return NextResponse.json(
      {
        error:
          "Invalid request.",
      },
      {
        status: 400,
      }
    )
  }
}