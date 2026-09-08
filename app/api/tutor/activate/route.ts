
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
      body.token?.trim() || ""

    const password =
      body.password || ""

    const confirmPassword =
      body.confirmPassword || ""

    /*
     * Validate invitation token.
     */
    if (!token) {
      return NextResponse.json(
        {
          error:
            "Invitation token is missing.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Validate password length.
     */
    if (password.length < 8) {
      return NextResponse.json(
        {
          error:
            "Password must contain at least 8 characters.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Make sure both password fields match.
     */
    if (
      password !==
      confirmPassword
    ) {
      return NextResponse.json(
        {
          error:
            "Passwords do not match.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Convert the raw invitation token into
     * the SHA-256 hash stored in the database.
     */
    const tokenHash =
      hashToken(token)

    /*
     * Find the tutor whose invitation token
     * matches the supplied token.
     */
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
        .eq(
          "account_status",
          "invited"
        )
        .maybeSingle()

    if (error) {
      console.error(
        "Tutor lookup error:",
        error
      )

      return NextResponse.json(
        {
          error:
            "Unable to validate invitation.",
        },
        {
          status: 500,
        }
      )
    }

    /*
     * No matching invitation.
     */
    if (!tutor) {
      return NextResponse.json(
        {
          error:
            "This invitation link is invalid or has already been used.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Verify that the invitation has an expiry date.
     */
    if (
      !tutor.verification_token_expires_at
    ) {
      return NextResponse.json(
        {
          error:
            "This invitation has expired. Please ask the administrator to send a new invitation.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Check invitation expiry.
     */
    const expiry =
      new Date(
        tutor.verification_token_expires_at
      )

    if (
      Number.isNaN(
        expiry.getTime()
      )
    ) {
      return NextResponse.json(
        {
          error:
            "This invitation has an invalid expiry date. Please ask the administrator to send a new invitation.",
        },
        {
          status: 400,
        }
      )
    }

    if (
      expiry.getTime() <=
      Date.now()
    ) {
      return NextResponse.json(
        {
          error:
            "This invitation has expired. Please ask the administrator to send a new invitation.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * IMPORTANT:
     *
     * hashPassword() is asynchronous because
     * bcrypt.hash() is asynchronous.
     *
     * We MUST use await here.
     *
     * Without await:
     *
     * password_hash = {}
     *
     * With await:
     *
     * password_hash = $2b$12$...
     */
    const passwordHash =
      await hashPassword(
        password
      )

    /*
     * Activate the tutor account.
     *
     * The invitation token is consumed by
     * setting verification_token to NULL.
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
        .eq(
          "account_status",
          "invited"
        )
        .select(
          `
            id,
            email,
            first_name,
            last_name,
            role,
            account_status
          `
        )
        .maybeSingle()

    if (
      updateError
    ) {
      console.error(
        "Tutor activation update error:",
        updateError
      )

      return NextResponse.json(
        {
          error:
            "Your account could not be activated.",
        },
        {
          status: 500,
        }
      )
    }

    /*
     * If no row was updated, the invitation
     * may have been used at the same time.
     */
    if (!updatedTutor) {
      return NextResponse.json(
        {
          error:
            "This invitation has already been used or is no longer valid.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Create the authenticated tutor session.
     */
    await createSession(
      updatedTutor.id,
      updatedTutor.role
    )

    /*
     * Return success.
     *
     * The password/hash is NEVER returned
     * to the browser.
     */
    return NextResponse.json(
      {
        success: true,

        message:
          "Your tutor account has been activated successfully.",

        redirect:
          "/tutor",
      },
      {
        status: 200,
      }
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
      {
        status: 500,
      }
    )
  }
}

