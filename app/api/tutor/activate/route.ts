import {
  NextRequest,
  NextResponse,
} from "next/server"

import {
  supabaseAdmin,
} from "@/lib/supabaseAdmin"

import {
  hashPassword,
} from "@/lib/auth/password"

import {
  hashToken,
} from "@/lib/auth/token"

import {
  createSession,
} from "@/lib/auth/session"

type ActivateBody = {
  token?: string
  password?: string
  confirmPassword?: string
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      (await request.json()) as ActivateBody

    const token =
      body.token?.trim()

    const password =
      body.password || ""

    const confirmPassword =
      body.confirmPassword || ""

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Invitation token is missing.",
        },
        { status: 400 }
      )
    }

    if (
      password.length < 8
    ) {
      return NextResponse.json(
        {
          error:
            "Password must contain at least 8 characters.",
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
          error:
            "Passwords do not match.",
        },
        { status: 400 }
      )
    }

    const tokenHash =
      hashToken(token)

    const {
      data: tutor,
      error,
    } =
      await supabaseAdmin
        .from("users")
        .select(
          `
            id,
            email,
            first_name,
            last_name,
            role,
            password_hash,
            email_verified,
            account_status,
            verification_token_expires_at
          `
        )
        .eq(
          "verification_token",
          tokenHash
        )
        .eq(
          "role",
          "tutor"
        )
        .maybeSingle()

    if (error) {
      console.error(
        error
      )

      return NextResponse.json(
        {
          error:
            "Unable to validate invitation.",
        },
        { status: 500 }
      )
    }

    if (!tutor) {
      return NextResponse.json(
        {
          error:
            "This invitation link is invalid or has already been used.",
        },
        { status: 400 }
      )
    }

    if (
      tutor.account_status !==
      "invited"
    ) {
      return NextResponse.json(
        {
          error:
            "This tutor account is no longer awaiting activation.",
        },
        { status: 400 }
      )
    }

    if (
      !tutor.verification_token_expires_at
    ) {
      return NextResponse.json(
        {
          error:
            "This invitation has expired.",
        },
        { status: 400 }
      )
    }

    const expiry =
      new Date(
        tutor.verification_token_expires_at
      )

    if (
      expiry.getTime() <=
      Date.now()
    ) {
      return NextResponse.json(
        {
          error:
            "This invitation has expired. Please ask the administrator to send a new invitation.",
        },
        { status: 400 }
      )
    }

    /*
     * Hash password.
     */
    const passwordHash =
      hashPassword(password)

    /*
     * Activate account and consume token.
     */
    const {
      data: updatedTutor,
      error: updateError,
    } =
      await supabaseAdmin
        .from("users")
        .update({
          password_hash:
            passwordHash,

          email_verified:
            true,

          account_status:
            "active",

          verification_token:
            null,

          verification_token_expires_at:
            null,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          tutor.id
        )
        .eq(
          "verification_token",
          tokenHash
        )
        .select(
          "id,email,first_name,last_name,role,account_status"
        )
        .single()

    if (
      updateError ||
      !updatedTutor
    ) {
      console.error(
        updateError
      )

      return NextResponse.json(
        {
          error:
            "Your account could not be activated.",
        },
        { status: 500 }
      )
    }

    /*
     * IMPORTANT:
     * Immediately create an authenticated
     * session after successful activation.
     */
    await createSession(
      updatedTutor.id,
      updatedTutor.role
    )

    return NextResponse.json(
      {
        success: true,
        message:
          "Your tutor account has been activated successfully.",
        redirect:
          "/tutor",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(
      "Tutor activation error:",
      error
    )

    return NextResponse.json(
      {
        error:
          "An unexpected server error occurred.",
      },
      { status: 500 }
    )
  }
}