import {
  NextRequest,
  NextResponse,
} from "next/server"

import bcrypt from "bcryptjs"

import {
  hashToken,
} from "@/lib/ai-email"

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

    const password = String(
      body.password || ""
    )

    const confirmPassword = String(
      body.confirmPassword || ""
    )

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your password reset link is invalid or missing.",
        },
        { status: 400 }
      )
    }

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please enter a new password.",
        },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your password must be at least 8 characters long.",
        },
        { status: 400 }
      )
    }

    if (password.length > 128) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your password must not exceed 128 characters.",
        },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The passwords do not match.",
        },
        { status: 400 }
      )
    }

    // ------------------------------------------
    // HASH TOKEN
    // ------------------------------------------

    const tokenHash = hashToken(token)

    // ------------------------------------------
    // FIND ACCOUNT
    // ------------------------------------------

    const {
      data: student,
      error: studentError,
    } =
      await supabaseAdmin
        .from("ai_students")
        .select(`
          id,
          email,
          account_status,
          password_reset_token,
          password_reset_expires_at
        `)
        .eq(
          "password_reset_token",
          tokenHash
        )
        .maybeSingle()

    if (studentError) {
      console.error(
        "Finding AI student for password reset:",
        studentError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to reset your password. Please request a new password reset link.",
        },
        { status: 500 }
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
            "This password reset link is invalid or has already been used. Please request a new one.",
        },
        { status: 400 }
      )
    }

    // ------------------------------------------
    // ACCOUNT STATUS
    // ------------------------------------------

    if (
      student.account_status !==
      "active"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This account is not currently active.",
        },
        { status: 403 }
      )
    }

    // ------------------------------------------
    // CHECK EXPIRATION
    // ------------------------------------------

    if (
      !student.password_reset_expires_at
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This password reset link is invalid. Please request a new one.",
        },
        { status: 400 }
      )
    }

    const expiresAt =
      new Date(
        student.password_reset_expires_at
      ).getTime()

    if (
      Number.isNaN(expiresAt) ||
      Date.now() > expiresAt
    ) {
      // Clear expired token
      await supabaseAdmin
        .from("ai_students")
        .update({
          password_reset_token: null,
          password_reset_expires_at: null,
        })
        .eq(
          "id",
          student.id
        )

      return NextResponse.json(
        {
          success: false,
          error:
            "This password reset link has expired. Please request a new one.",
        },
        { status: 400 }
      )
    }

    // ------------------------------------------
    // HASH NEW PASSWORD
    // ------------------------------------------

    const passwordHash =
      await bcrypt.hash(
        password,
        12
      )

    // ------------------------------------------
    // UPDATE PASSWORD
    // ------------------------------------------
    //
    // We also clear:
    //
    // password_reset_token
    // password_reset_expires_at
    //
    // This makes the reset link single-use.
    //
    // We also clear outstanding 2FA state because
    // changing the password should invalidate any
    // previous sign-in verification attempt.
    //
    // ------------------------------------------

    const {
      error: updateError,
    } =
      await supabaseAdmin
        .from("ai_students")
        .update({
          password_hash:
            passwordHash,

          password_reset_token:
            null,

          password_reset_expires_at:
            null,

          two_factor_code_hash:
            null,

          two_factor_expires_at:
            null,

          two_factor_attempts:
            0,

          two_factor_verified_at:
            null,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          student.id
        )

    if (updateError) {
      console.error(
        "Updating AI student password:",
        updateError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to reset your password. Please try again.",
        },
        { status: 500 }
      )
    }

    // ------------------------------------------
    // SUCCESS
    // ------------------------------------------

    return NextResponse.json({
      success: true,
      message:
        "Your password has been reset successfully. You can now sign in with your new password.",
    })
  } catch (error) {
    console.error(
      "AI reset password error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while resetting your password.",
      },
      { status: 500 }
    )
  }
}