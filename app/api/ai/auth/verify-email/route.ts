import { NextRequest, NextResponse } from "next/server"

import { hashToken } from "@/lib/ai-email"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json()

    const token = String(
      body.token || ""
    ).trim()

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Verification token is missing.",
        },
        { status: 400 }
      )
    }

    // ------------------------------------------
    // HASH TOKEN
    // ------------------------------------------

    const tokenHash = hashToken(token)

    // ------------------------------------------
    // FIND AI STUDENT
    // ------------------------------------------

    const {
      data: student,
      error: studentError,
    } = await supabaseAdmin
      .from("ai_students")
      .select(
        `
        id,
        email,
        first_name,
        email_verified,
        email_verification_expires_at
        `
      )
      .eq(
        "email_verification_token",
        tokenHash
      )
      .maybeSingle()

    if (studentError) {
      console.error(
        "AI email verification lookup error:",
        studentError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify your email.",
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
            "This verification link is invalid or has already been used.",
        },
        { status: 400 }
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
          "Your email is already verified.",
      })
    }

    // ------------------------------------------
    // CHECK EXPIRATION
    // ------------------------------------------

    if (
      !student.email_verification_expires_at ||
      new Date(
        student.email_verification_expires_at
      ) < new Date()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This verification link has expired. Please request a new confirmation email.",
        },
        { status: 400 }
      )
    }

    // ------------------------------------------
    // VERIFY EMAIL
    // ------------------------------------------

    const {
      error: updateError,
    } = await supabaseAdmin
      .from("ai_students")
      .update({
        email_verified: true,
        email_verification_token: null,
        email_verification_expires_at: null,
      })
      .eq("id", student.id)

    if (updateError) {
      console.error(
        "AI email verification update error:",
        updateError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to complete email verification.",
        },
        { status: 500 }
      )
    }

    // ------------------------------------------
    // SUCCESS
    // ------------------------------------------

    return NextResponse.json({
      success: true,
      alreadyVerified: false,
      message:
        "Your email has been successfully verified.",
      email: student.email,
    })
  } catch (error) {
    console.error(
      "Unexpected AI email verification error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while verifying your email.",
      },
      { status: 500 }
    )
  }
}