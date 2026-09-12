
import { NextRequest, NextResponse } from "next/server"

import {
  generateSecureToken,
  hashToken,
  sendAIPasswordResetEmail,
} from "@/lib/ai-email"

import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json()

    const email = String(
      body.email || ""
    )
      .trim()
      .toLowerCase()

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

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

    // ------------------------------------------
    // FIND AI STUDENT
    // ------------------------------------------

    const {
      data: student,
      error: studentError,
    } =
      await supabaseAdmin
        .from("ai_students")
        .select(
          "id, first_name, last_name, email, email_verified, account_status"
        )
        .eq("email", email)
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
            "Unable to process your password reset request. Please try again.",
        },
        { status: 500 }
      )
    }

    // ------------------------------------------
    // SECURITY
    // ------------------------------------------
    //
    // Do NOT reveal whether the account exists.
    //
    // If the email does not belong to an account,
    // return the same success response.
    //
    // ------------------------------------------

    if (!student) {
      return NextResponse.json({
        success: true,
        message:
          "If an AI Learning Hub account exists with that email address, a password reset link has been sent.",
      })
    }

    // ------------------------------------------
    // ACCOUNT STATUS
    // ------------------------------------------

    if (
      student.account_status !== "active"
    ) {
      return NextResponse.json({
        success: true,
        message:
          "If an AI Learning Hub account exists with that email address, a password reset link has been sent.",
      })
    }

    // ------------------------------------------
    // EMAIL VERIFICATION
    // ------------------------------------------
    //
    // We allow the request to be made even when
    // the email has not yet been verified.
    //
    // However, the reset email itself becomes the
    // possession check for the email address.
    //
    // ------------------------------------------

    // ------------------------------------------
    // GENERATE PASSWORD RESET TOKEN
    // ------------------------------------------

    const resetToken =
      generateSecureToken()

    const resetTokenHash =
      hashToken(resetToken)

    // Token valid for 30 minutes.
    const resetExpires =
      new Date(
        Date.now() +
          30 *
            60 *
            1000
      ).toISOString()

    // ------------------------------------------
    // SAVE HASHED TOKEN
    // ------------------------------------------

    const {
      error: updateError,
    } =
      await supabaseAdmin
        .from("ai_students")
        .update({
          password_reset_token:
            resetTokenHash,
          password_reset_expires_at:
            resetExpires,
        })
        .eq(
          "id",
          student.id
        )

    if (updateError) {
      console.error(
        "Saving password reset token:",
        updateError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to create your password reset request. Please try again.",
        },
        { status: 500 }
      )
    }

    // ------------------------------------------
    // SEND PASSWORD RESET EMAIL
    // ------------------------------------------

    try {
      await sendAIPasswordResetEmail({
        email:
          student.email,
        firstName:
          student.first_name,
        token:
          resetToken,
      })
    } catch (emailError) {
      console.error(
        "Password reset email error:",
        emailError
      )

      // Clear the reset token if email delivery failed.
      await supabaseAdmin
        .from("ai_students")
        .update({
          password_reset_token:
            null,
          password_reset_expires_at:
            null,
        })
        .eq(
          "id",
          student.id
        )

      return NextResponse.json(
        {
          success: false,
          error:
            "We could not send the password reset email. Please try again.",
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
        "If an AI Learning Hub account exists with that email address, a password reset link has been sent.",
    })
  } catch (error) {
    console.error(
      "AI forgot password error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while processing your request.",
      },
      { status: 500 }
    )
  }
}

