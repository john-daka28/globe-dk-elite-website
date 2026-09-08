import { NextRequest, NextResponse } from "next/server"

import { supabaseAdmin } from "@/lib/supabaseAdmin"
import {
  requireRole,
} from "@/lib/auth/session"

import {
  generateSecureToken,
  hashToken,
  getTokenExpiry,
} from "@/lib/auth/token"

import {
  sendTutorInvitation,
} from "@/lib/email/sendTutorInvitation"

const VALID_LEVELS = [
  "O-Level",
  "A-Level",
]

const VALID_CURRICULA = [
  "ZIMSEC",
  "Cambridge",
]

type CreateTutorBody = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  school?: string
  subjects?: string[]
  levels?: string[]
  curricula?: string[]
}

export async function POST(
  request: NextRequest
) {
  try {
    const admin =
      await requireRole([
        "admin",
        "administrator",
      ])

    if (
      admin.account_status !==
      "active"
    ) {
      return NextResponse.json(
        {
          error:
            "Your administrator account is not active.",
        },
        { status: 403 }
      )
    }

    const body =
      (await request.json()) as CreateTutorBody

    const firstName =
      body.firstName?.trim()

    const lastName =
      body.lastName?.trim()

    const email =
      body.email
        ?.trim()
        .toLowerCase()

    const phone =
      body.phone?.trim() || null

    const school =
      body.school?.trim() || null

    const subjects =
      Array.isArray(body.subjects)
        ? body.subjects
        : []

    const levels =
      Array.isArray(body.levels)
        ? body.levels
        : []

    const curricula =
      Array.isArray(body.curricula)
        ? body.curricula
        : []

    if (
      !firstName ||
      !lastName ||
      !email
    ) {
      return NextResponse.json(
        {
          error:
            "First name, last name and email are required.",
        },
        { status: 400 }
      )
    }

    if (
      subjects.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "At least one subject must be selected.",
        },
        { status: 400 }
      )
    }

    if (
      levels.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "At least one level must be selected.",
        },
        { status: 400 }
      )
    }

    if (
      curricula.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "At least one curriculum must be selected.",
        },
        { status: 400 }
      )
    }

    const invalidLevels =
      levels.filter(
        (level) =>
          !VALID_LEVELS.includes(level)
      )

    const invalidCurricula =
      curricula.filter(
        (curriculum) =>
          !VALID_CURRICULA.includes(
            curriculum
          )
      )

    if (
      invalidLevels.length > 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid level selected.",
        },
        { status: 400 }
      )
    }

    if (
      invalidCurricula.length > 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid curriculum selected.",
        },
        { status: 400 }
      )
    }

    /*
     * Check existing account.
     */
    const {
      data: existingUser,
      error: existingError,
    } =
      await supabaseAdmin
        .from("users")
        .select(
          "id,email,role,account_status"
        )
        .ilike(
          "email",
          email
        )
        .maybeSingle()

    if (existingError) {
      console.error(
        existingError
      )

      return NextResponse.json(
        {
          error:
            "Could not check the existing user account.",
        },
        { status: 500 }
      )
    }

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "A user with this email address already exists.",
        },
        { status: 409 }
      )
    }

    /*
     * Generate invitation token.
     */
    const rawToken =
      generateSecureToken()

    const tokenHash =
      hashToken(rawToken)

    const tokenExpiry =
      getTokenExpiry(24)

    /*
     * Create user.
     */
    const {
      data: tutor,
      error: userError,
    } =
      await supabaseAdmin
        .from("users")
        .insert({
          email,
          password_hash: null,
          first_name: firstName,
          last_name: lastName,
          phone,
          school,
          role: "tutor",
          email_verified: false,
          verification_token:
            tokenHash,
          verification_token_expires_at:
            tokenExpiry.toISOString(),
          account_status:
            "invited",
        })
        .select(
          "id,email,first_name,last_name,role,account_status"
        )
        .single()

    if (userError || !tutor) {
      console.error(
        userError
      )

      return NextResponse.json(
        {
          error:
            "Failed to create tutor account.",
        },
        { status: 500 }
      )
    }

    /*
     * Create subject assignments.
     *
     * We create every combination:
     * subject × level × curriculum
     */
    const tutorSubjectRows =
      []

    for (
      const subject of subjects
    ) {
      for (
        const level of levels
      ) {
        for (
          const curriculum of curricula
        ) {
          tutorSubjectRows.push({
            tutor_id:
              tutor.id,
            subject,
            level,
            curriculum,
          })
        }
      }
    }

    const {
      error: subjectError,
    } =
      await supabaseAdmin
        .from("tutor_subjects")
        .insert(
          tutorSubjectRows
        )

    if (subjectError) {
      console.error(
        subjectError
      )

      /*
       * Roll back user if subject
       * creation fails.
       */
      await supabaseAdmin
        .from("users")
        .delete()
        .eq(
          "id",
          tutor.id
        )

      return NextResponse.json(
        {
          error:
            "Tutor was not created because academic assignments could not be saved.",
        },
        { status: 500 }
      )
    }

    /*
     * Send invitation email.
     */
    try {
      await sendTutorInvitation({
        firstName,
        email,
        token: rawToken,
      })
    } catch (emailError) {
      console.error(
        emailError
      )

      /*
       * Remove the incomplete invitation
       * so the admin doesn't see a tutor
       * who never received an email.
       */
      await supabaseAdmin
        .from("tutor_subjects")
        .delete()
        .eq(
          "tutor_id",
          tutor.id
        )

      await supabaseAdmin
        .from("users")
        .delete()
        .eq(
          "id",
          tutor.id
        )

      return NextResponse.json(
        {
          error:
            "Tutor account could not be completed because the invitation email failed to send.",
        },
        { status: 502 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Tutor account created and invitation email sent.",
        tutor: {
          id: tutor.id,
          email: tutor.email,
          firstName:
            tutor.first_name,
          lastName:
            tutor.last_name,
          role: tutor.role,
          accountStatus:
            tutor.account_status,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error(
      "Create tutor error:",
      error
    )

    if (
      error instanceof Error &&
      error.message ===
        "UNAUTHENTICATED"
    ) {
      return NextResponse.json(
        {
          error:
            "You must be logged in as an administrator.",
        },
        { status: 401 }
      )
    }

    if (
      error instanceof Error &&
      error.message ===
        "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          error:
            "Only administrators can create tutor accounts.",
        },
        { status: 403 }
      )
    }

    return NextResponse.json(
      {
        error:
          "An unexpected server error occurred.",
      },
      { status: 500 }
    )
  }
}