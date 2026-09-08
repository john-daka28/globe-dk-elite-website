import bcrypt from "bcryptjs"
import crypto from "crypto"

import {
  NextRequest,
  NextResponse,
} from "next/server"

import { cookies } from "next/headers"

import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { createToken } from "@/lib/auth"

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

    // ============================================================
    // VALIDATION
    // ============================================================

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invitation token is required.",
        },
        { status: 400 }
      )
    }

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please create a password.",
        },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 8 characters long.",
        },
        { status: 400 }
      )
    }

    if (
      password !==
      confirmPassword
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Passwords do not match.",
        },
        { status: 400 }
      )
    }

    // ============================================================
    // HASH TOKEN
    // ============================================================

    const tokenHash =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex")

    // ============================================================
    // FIND INVITATION
    // ============================================================

    const {
      data: invitation,
      error: invitationError,
    } = await supabaseAdmin
      .from("student_invitations")
      .select(`
        id,
        student_id,
        expires_at,
        accepted_at
      `)
      .eq(
        "token_hash",
        tokenHash
      )
      .maybeSingle()

    if (invitationError) {
      console.error(
        "Accept invitation lookup error:",
        invitationError
      )

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to process this invitation.",
        },
        { status: 500 }
      )
    }

    if (!invitation) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This invitation is invalid.",
        },
        { status: 404 }
      )
    }

    // ============================================================
    // ALREADY USED
    // ============================================================

    if (invitation.accepted_at) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This invitation has already been used.",
        },
        { status: 410 }
      )
    }

    // ============================================================
    // EXPIRED
    // ============================================================

    if (
      new Date(
        invitation.expires_at
      ).getTime() <= Date.now()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This invitation has expired. Please ask your tutor for a new invitation.",
        },
        { status: 410 }
      )
    }

    // ============================================================
    // GET STUDENT
    // ============================================================

    const {
      data: student,
      error: studentError,
    } = await supabaseAdmin
      .from("users")
      .select(`
        id,
        email,
        first_name,
        last_name,
        role,
        account_status
      `)
      .eq(
        "id",
        invitation.student_id
      )
      .maybeSingle()

    if (studentError) {
      console.error(
        "Student lookup error:",
        studentError
      )

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to find your student account.",
        },
        { status: 500 }
      )
    }

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Student account could not be found.",
        },
        { status: 404 }
      )
    }

    // ============================================================
    // ALREADY ACTIVE
    // ============================================================

    if (
      student.account_status ===
      "active"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This student account has already been activated.",
        },
        { status: 409 }
      )
    }

    // ============================================================
    // HASH PASSWORD
    // ============================================================

    const passwordHash =
      await bcrypt.hash(
        password,
        12
      )

    // ============================================================
    // ACTIVATE STUDENT
    // ============================================================

    const {
      data: updatedStudent,
      error: updateError,
    } = await supabaseAdmin
      .from("users")
      .update({
        password_hash:
          passwordHash,

        email_verified:
          true,

        account_status:
          "active",

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        student.id
      )
      .select(`
        id,
        email,
        first_name,
        last_name,
        role
      `)
      .single()

    if (updateError) {
      console.error(
        "Student activation error:",
        updateError
      )

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to activate your account.",
        },
        { status: 500 }
      )
    }

    // ============================================================
    // MARK INVITATION USED
    // ============================================================

    const {
      error: invitationUpdateError,
    } = await supabaseAdmin
      .from("student_invitations")
      .update({
        accepted_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        invitation.id
      )
      .is(
        "accepted_at",
        null
      )

    if (invitationUpdateError) {
      console.error(
        "Invitation completion error:",
        invitationUpdateError
      )
    }

    // ============================================================
    // CREATE SESSION
    // ============================================================

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing."
      )

      return NextResponse.json(
        {
          success: false,
          message:
            "Account was created, but automatic login could not be completed.",
        },
        { status: 500 }
      )
    }

    const sessionToken =
      await createToken(
        updatedStudent.id,
        updatedStudent.role
      )

    const cookieStore =
      await cookies()

    cookieStore.set(
      "session",
      sessionToken,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        maxAge:
          60 * 60 * 24 * 7,
      }
    )

    // ============================================================
    // SUCCESS
    // ============================================================

    return NextResponse.json(
      {
        success: true,

        message:
          "Your student account has been activated successfully.",

        redirectTo:
          "/student/dashboard",

        user: {
          id:
            updatedStudent.id,

          email:
            updatedStudent.email,

          firstName:
            updatedStudent.first_name,

          lastName:
            updatedStudent.last_name,

          role:
            updatedStudent.role,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(
      "Accept invitation error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while completing your registration.",
      },
      { status: 500 }
    )
  }
}