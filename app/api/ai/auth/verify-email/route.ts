import {
  NextRequest,
  NextResponse,
} from "next/server"

import {
  hashToken,
} from "@/lib/ai-email"

import {
  setAIStudentSession,
} from "@/lib/ai-auth"

import {
  supabaseAdmin,
} from "@/lib/supabase-admin"

export const runtime = "nodejs"

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json()

    const token = String(
      body.token || ""
    ).trim()

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Verification token is required.",
        },
        {
          status: 400,
        }
      )
    }

    // ------------------------------------------
    // HASH THE TOKEN
    // ------------------------------------------
    //
    // IMPORTANT:
    //
    // Signup stores:
    //
    // hashToken(verificationToken)
    //
    // The email contains:
    //
    // verificationToken
    //
    // Therefore we MUST hash the incoming
    // token before looking it up.
    //
    // ------------------------------------------

    const verificationTokenHash =
      hashToken(token)

    // ------------------------------------------
    // FIND STUDENT
    // ------------------------------------------

    const {
      data: student,
      error: lookupError,
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
          account_status,
          email_verified,
          email_verification_token,
          email_verification_expires_at
          `
        )
        .eq(
          "email_verification_token",
          verificationTokenHash
        )
        .maybeSingle()

    if (lookupError) {
      console.error(
        "AI email verification lookup error:",
        lookupError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify your email right now. Please try again.",
        },
        {
          status: 500,
        }
      )
    }

    // ------------------------------------------
    // INVALID TOKEN
    // ------------------------------------------

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This confirmation link is invalid or has already been used. Please request a new confirmation email.",
        },
        {
          status: 400,
        }
      )
    }

    // ------------------------------------------
    // ALREADY VERIFIED
    // ------------------------------------------

    if (student.email_verified) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message:
          "Your email address has already been verified.",
        redirectTo: "/ai",
        student: {
          id: student.id,
          firstName: student.first_name,
          lastName: student.last_name,
          email: student.email,
          level: student.level,
          curriculum: student.curriculum,
        },
      })
    }

    // ------------------------------------------
    // CHECK TOKEN EXPIRY
    // ------------------------------------------

    if (
      !student.email_verification_expires_at
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This confirmation link has expired. Please request a new confirmation email.",
        },
        {
          status: 400,
        }
      )
    }

    const expiresAt = new Date(
      student.email_verification_expires_at
    )

    if (
      Number.isNaN(
        expiresAt.getTime()
      ) ||
      expiresAt.getTime() <
        Date.now()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This confirmation link has expired. Please request a new confirmation email.",
        },
        {
          status: 400,
        }
      )
    }

    // ------------------------------------------
    // CHECK ACCOUNT STATUS
    // ------------------------------------------

    if (
      student.account_status !== "active"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This account is currently unavailable. Please contact GlobeDk Elite Academy support.",
        },
        {
          status: 403,
        }
      )
    }

    // ------------------------------------------
    // VERIFY EMAIL
    // ------------------------------------------

    const {
      data: updatedStudent,
      error: updateError,
    } =
      await supabaseAdmin
        .from("ai_students")
        .update({
          email_verified: true,

          // Clear the token immediately so it
          // cannot be reused.
          email_verification_token: null,

          email_verification_expires_at:
            null,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          student.id
        )
        .eq(
          "email_verification_token",
          verificationTokenHash
        )
        .select(
          `
          id,
          first_name,
          last_name,
          email,
          level,
          curriculum,
          email_verified
          `
        )
        .single()

    if (
      updateError ||
      !updatedStudent
    ) {
      console.error(
        "AI email verification update error:",
        updateError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to complete email verification. Please try again.",
        },
        {
          status: 500,
        }
      )
    }

    // ------------------------------------------
    // CREATE AI SESSION
    // ------------------------------------------
    //
    // The student has now:
    //
    // 1. Created an account
    // 2. Confirmed their email
    //
    // We can create the AI session so the user
    // can go directly to /ai.
    //
    // ------------------------------------------

    await setAIStudentSession({
      id: updatedStudent.id,
      email: updatedStudent.email,
      firstName:
        updatedStudent.first_name,
      lastName:
        updatedStudent.last_name,
      level: updatedStudent.level,
      curriculum:
        updatedStudent.curriculum,
    })

    // ------------------------------------------
    // SUCCESS
    // ------------------------------------------

    return NextResponse.json({
      success: true,
      alreadyVerified: false,
      message:
        "Your email address has been successfully verified.",
      redirectTo: "/ai",
      student: {
        id: updatedStudent.id,
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
    })
  } catch (error) {
    console.error(
      "AI email verification error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while verifying your email. Please try again.",
      },
      {
        status: 500,
      }
    )
  }
}