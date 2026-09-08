import crypto from "crypto"

import {
  NextRequest,
  NextResponse,
} from "next/server"

import { supabaseAdmin } from "@/lib/supabaseAdmin"

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
          valid: false,
          message:
            "Invitation token is required.",
        },
        { status: 400 }
      )
    }

    const tokenHash =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex")

    const {
      data: invitation,
      error,
    } = await supabaseAdmin
      .from("student_invitations")
      .select(`
        id,
        email,
        expires_at,
        accepted_at,
        student:student_id (
          id,
          first_name,
          last_name,
          email,
          level,
          school,
          account_status
        )
      `)
      .eq(
        "token_hash",
        tokenHash
      )
      .maybeSingle()

    if (error) {
      console.error(
        "Invitation validation error:",
        error
      )

      return NextResponse.json(
        {
          success: false,
          valid: false,
          message:
            "Unable to validate invitation.",
        },
        { status: 500 }
      )
    }

    if (!invitation) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          message:
            "This invitation is invalid.",
        },
        { status: 404 }
      )
    }

    if (invitation.accepted_at) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          message:
            "This invitation has already been used.",
        },
        { status: 410 }
      )
    }

    const expiresAt =
      new Date(
        invitation.expires_at
      ).getTime()

    if (
      Number.isNaN(expiresAt) ||
      expiresAt <= Date.now()
    ) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          message:
            "This invitation has expired. Please ask your tutor for a new invitation.",
        },
        { status: 410 }
      )
    }

    const student =
      Array.isArray(invitation.student)
        ? invitation.student[0]
        : invitation.student

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          message:
            "Student account could not be found.",
        },
        { status: 404 }
      )
    }

    if (
      student.account_status ===
      "active"
    ) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          message:
            "This student account has already been activated.",
        },
        { status: 409 }
      )
    }

    return NextResponse.json({
      success: true,
      valid: true,

      student: {
        id: student.id,
        firstName:
          student.first_name,
        lastName:
          student.last_name,
        email: student.email,
        level: student.level,
        school: student.school,
      },

      expiresAt:
        invitation.expires_at,
    })
  } catch (error) {
    console.error(
      "Unexpected invitation validation error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        valid: false,
        message:
          "Something went wrong.",
      },
      { status: 500 }
    )
  }
}