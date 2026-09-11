import { NextRequest, NextResponse } from "next/server"

import bcrypt from "bcryptjs"

import {
  generateSecureToken,
  hashToken,
  sendAIEmailVerificationEmail,
} from "@/lib/ai-email"

import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json()

    const firstName = String(
      body.firstName || ""
    ).trim()

    const lastName = String(
      body.lastName || ""
    ).trim()

    const email = String(
      body.email || ""
    )
      .trim()
      .toLowerCase()

    const password = String(
      body.password || ""
    )

    const confirmPassword = String(
      body.confirmPassword || ""
    )

    const level =
      body.level === "A-Level"
        ? "A-Level"
        : "O-Level"

    const curriculum =
      body.curriculum === "Cambridge"
        ? "Cambridge"
        : "ZIMSEC"

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!firstName) {
      return NextResponse.json(
        {
          success: false,
          error: "First name is required.",
        },
        { status: 400 }
      )
    }

    if (!lastName) {
      return NextResponse.json(
        {
          success: false,
          error: "Last name is required.",
        },
        { status: 400 }
      )
    }

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Email address is required.",
        },
        { status: 400 }
      )
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please enter a valid email address.",
        },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Password must be at least 8 characters.",
        },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Passwords do not match.",
        },
        { status: 400 }
      )
    }

    // ------------------------------------------
    // CHECK EXISTING ACCOUNT
    // ------------------------------------------

    const {
      data: existingStudent,
      error: existingError,
    } =
      await supabaseAdmin
        .from("ai_students")
        .select(
          "id, email_verified"
        )
        .eq("email", email)
        .maybeSingle()

    if (existingError) {
      console.error(
        "Checking AI student:",
        existingError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to check your account.",
        },
        { status: 500 }
      )
    }

    if (existingStudent) {
      if (
        !existingStudent.email_verified
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "An account with this email already exists but has not been verified. Please use the verification email or request a new one.",
            requiresVerification: true,
          },
          { status: 409 }
        )
      }

      return NextResponse.json(
        {
          success: false,
          error:
            "An AI Learning Hub account already exists with this email. Please sign in.",
        },
        { status: 409 }
      )
    }

    // ------------------------------------------
    // HASH PASSWORD
    // ------------------------------------------

    const passwordHash =
      await bcrypt.hash(
        password,
        12
      )

    // ------------------------------------------
    // EMAIL VERIFICATION TOKEN
    // ------------------------------------------

    const verificationToken =
      generateSecureToken()

    const verificationTokenHash =
      hashToken(
        verificationToken
      )

    const verificationExpires =
      new Date(
        Date.now() +
          24 *
            60 *
            60 *
            1000
      ).toISOString()

    // ------------------------------------------
    // CREATE ACCOUNT
    // ------------------------------------------

    const {
      data: student,
      error: insertError,
    } =
      await supabaseAdmin
        .from("ai_students")
        .insert({
          first_name: firstName,
          last_name: lastName,
          email,
          password_hash:
            passwordHash,
          level,
          curriculum,
          account_status:
            "active",
          email_verified:
            false,
          email_verification_token:
            verificationTokenHash,
          email_verification_expires_at:
            verificationExpires,
        })
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

    if (
      insertError ||
      !student
    ) {
      console.error(
        "Creating AI student:",
        insertError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to create your account.",
        },
        { status: 500 }
      )
    }

    // ------------------------------------------
    // SEND VERIFICATION EMAIL
    // ------------------------------------------

    try {
      await sendAIEmailVerificationEmail({
        email:
          student.email,

        firstName:
          student.first_name,

        token:
          verificationToken,
      })
    } catch (emailError) {
      console.error(
        "Verification email error:",
        emailError
      )

      /*
       * If the email cannot be sent, remove
       * the newly created account so the user
       * can safely try again.
       */
      await supabaseAdmin
        .from("ai_students")
        .delete()
        .eq(
          "id",
          student.id
        )

      return NextResponse.json(
        {
          success: false,
          error:
            "Your account could not be created because the confirmation email could not be sent. Please try again.",
        },
        { status: 500 }
      )
    }

    // ------------------------------------------
    // IMPORTANT
    // ------------------------------------------
    //
    // DO NOT CREATE AI SESSION HERE.
    //
    // The user must:
    //
    // 1. Confirm email
    // 2. Sign in with password
    // 3. Complete 2FA
    // 4. Receive final AI session
    //
    // ------------------------------------------

    return NextResponse.json({
      success: true,

      message:
        "Your account has been created. Please check your email to confirm your account.",

      requiresEmailVerification:
        true,

      email:
        student.email,
    })
  } catch (error) {
    console.error(
      "AI signup error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while creating your account.",
      },
      { status: 500 }
    )
  }
}