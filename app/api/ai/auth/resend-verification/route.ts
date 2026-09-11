import { NextRequest, NextResponse } from "next/server"

import {
  generateSecureToken,
  hashToken,
  sendAIEmailVerificationEmail,
} from "@/lib/ai-email"

import {
  supabaseAdmin,
} from "@/lib/supabase-admin"

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

    /*
     * Always return a generic response so
     * we do not reveal whether an email
     * belongs to an account.
     */
    const genericResponse =
      NextResponse.json({
        success: true,
        message:
          "If an unverified account exists for this email, a new confirmation email has been sent.",
      })

    if (!email) {
      return genericResponse
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
          email,
          first_name,
          email_verified
          `
        )
        .eq(
          "email",
          email
        )
        .maybeSingle()

    if (error) {
      console.error(
        "Resend verification lookup:",
        error
      )

      return genericResponse
    }

    if (
      !student ||
      student.email_verified
    ) {
      return genericResponse
    }

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

    const {
      error: updateError,
    } =
      await supabaseAdmin
        .from("ai_students")
        .update({
          email_verification_token:
            verificationTokenHash,

          email_verification_expires_at:
            verificationExpires,
        })
        .eq(
          "id",
          student.id
        )

    if (updateError) {
      console.error(
        "Resend verification update:",
        updateError
      )

      return genericResponse
    }

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
        "Resend verification email:",
        emailError
      )
    }

    return genericResponse
  } catch (error) {
    console.error(
      "AI resend verification error:",
      error
    )

    return NextResponse.json({
      success: true,
      message:
        "If an unverified account exists for this email, a new confirmation email has been sent.",
    })
  }
}