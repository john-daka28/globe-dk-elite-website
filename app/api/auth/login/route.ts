import {
  NextRequest,
  NextResponse,
} from "next/server"

import {
  supabaseAdmin,
} from "@/lib/supabaseAdmin"

import {
  verifyPassword,
} from "@/lib/auth/password"

import {
  createSession,
} from "@/lib/auth/session"

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json()

    const email =
      String(
        body.email || ""
      )
        .trim()
        .toLowerCase()

    const password =
      String(
        body.password || ""
      )

    if (
      !email ||
      !password
    ) {
      return NextResponse.json(
        {
          error:
            "Email and password are required.",
        },
        { status: 400 }
      )
    }

    const {
      data: user,
      error,
    } =
      await supabaseAdmin
        .from("users")
        .select(
          `
            id,
            email,
            password_hash,
            first_name,
            last_name,
            role,
            email_verified,
            account_status
          `
        )
        .ilike(
          "email",
          email
        )
        .maybeSingle()

    if (error) {
      console.error(
        error
      )

      return NextResponse.json(
        {
          error:
            "Unable to sign in.",
        },
        { status: 500 }
      )
    }

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Invalid email or password.",
        },
        { status: 401 }
      )
    }

    if (
      user.account_status ===
      "invited"
    ) {
      return NextResponse.json(
        {
          error:
            "Your account has not been activated yet. Please use the invitation email to create your password.",
        },
        { status: 403 }
      )
    }

    if (
      user.account_status !==
      "active"
    ) {
      return NextResponse.json(
        {
          error:
            "Your account is not currently active.",
        },
        { status: 403 }
      )
    }

    if (
      !user.password_hash
    ) {
      return NextResponse.json(
        {
          error:
            "Your account does not have a password yet. Please activate your account using the invitation email.",
        },
        { status: 403 }
      )
    }

    const passwordValid =
  await verifyPassword(
    password,
    user.password_hash
  )

    if (!passwordValid) {
      return NextResponse.json(
        {
          error:
            "Invalid email or password.",
        },
        { status: 401 }
      )
    }

    await createSession(
      user.id,
      user.role
    )

    const redirect =
      user.role === "tutor"
        ? "/tutor"
        : user.role ===
            "admin" ||
          user.role ===
            "administrator"
        ? "/admin/dashboard"
        : "/"

    return NextResponse.json(
      {
        success: true,
        redirect,
      }
    )
  } catch (error) {
    console.error(
      error
    )

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred.",
      },
      { status: 500 }
    )
  }
}