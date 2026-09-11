import {
  NextRequest,
  NextResponse,
} from "next/server"

import jwt from "jsonwebtoken"

import {
  hashToken,
} from "@/lib/ai-email"

import {
  setAIStudentSession,
} from "@/lib/ai-auth"

import {
  supabaseAdmin,
} from "@/lib/supabase-admin"

const AI_2FA_PENDING_COOKIE =
  "globedk_ai_2fa_pending"

function getJWTSecret(): string {
  const secret =
    process.env.JWT_SECRET

  if (!secret) {
    throw new Error(
      "JWT_SECRET is not configured"
    )
  }

  return secret
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json()

    const code =
      String(
        body.code || ""
      ).trim()

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please enter the 6-digit verification code.",
        },
        { status: 400 }
      )
    }

    // ------------------------------------------
    // GET PENDING AUTH TOKEN
    // ------------------------------------------

    const pendingToken =
      request.cookies.get(
        AI_2FA_PENDING_COOKIE
      )?.value

    if (!pendingToken) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your verification session has expired. Please sign in again.",
          requiresSignin: true,
        },
        { status: 401 }
      )
    }

    let decoded:
      | {
          type?: string
          id?: string
        }
      | null = null

    try {
      decoded =
        jwt.verify(
          pendingToken,
          getJWTSecret()
        ) as {
          type?: string
          id?: string
        }
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your verification session has expired. Please sign in again.",
          requiresSignin: true,
        },
        { status: 401 }
      )
    }

    if (
      decoded?.type !==
        "ai_2fa_pending" ||
      !decoded.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid verification session.",
          requiresSignin: true,
        },
        { status: 401 }
      )
    }

    const studentId =
      decoded.id

    // ------------------------------------------
    // GET STUDENT
    // ------------------------------------------

    const {
      data: student,
      error,
    } =
      await supabaseAdmin
        .from("ai_students")
        .select(
          `
          id,
          first_name,
          last_name,
          email,
          level,
          curriculum,
          account_status,
          email_verified,
          two_factor_code_hash,
          two_factor_expires_at,
          two_factor_attempts
          `
        )
        .eq(
          "id",
          studentId
        )
        .maybeSingle()

    if (error) {
      console.error(
        "2FA student lookup:",
        error
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify your code.",
        },
        { status: 500 }
      )
    }

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Account not found.",
          requiresSignin: true,
        },
        { status: 401 }
      )
    }

    if (
      student.account_status !==
      "active"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your account is currently suspended.",
        },
        { status: 403 }
      )
    }

    // ------------------------------------------
    // CHECK CODE EXISTS
    // ------------------------------------------

    if (
      !student.two_factor_code_hash ||
      !student.two_factor_expires_at
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No active verification code exists. Please sign in again.",
          requiresSignin: true,
        },
        { status: 400 }
      )
    }

    // ------------------------------------------
    // CHECK EXPIRY
    // ------------------------------------------

    if (
      new Date(
        student.two_factor_expires_at
      ).getTime() < Date.now()
    ) {
      await supabaseAdmin
        .from("ai_students")
        .update({
          two_factor_code_hash:
            null,

          two_factor_expires_at:
            null,

          two_factor_attempts:
            0,
        })
        .eq(
          "id",
          student.id
        )

      return NextResponse.json(
        {
          success: false,
          error:
            "Your verification code has expired. Please sign in again to receive a new code.",
          requiresSignin: true,
        },
        { status: 400 }
      )
    }

    // ------------------------------------------
    // CHECK ATTEMPTS
    // ------------------------------------------

    const attempts =
      student.two_factor_attempts ||
      0

    if (attempts >= 5) {
      await supabaseAdmin
        .from("ai_students")
        .update({
          two_factor_code_hash:
            null,

          two_factor_expires_at:
            null,

          two_factor_attempts:
            0,
        })
        .eq(
          "id",
          student.id
        )

      return NextResponse.json(
        {
          success: false,
          error:
            "Too many incorrect attempts. Please sign in again to receive a new code.",
          requiresSignin: true,
        },
        { status: 429 }
      )
    }

    // ------------------------------------------
    // COMPARE CODE
    // ------------------------------------------

    const submittedHash =
      hashToken(code)

    if (
      submittedHash !==
      student.two_factor_code_hash
    ) {
      await supabaseAdmin
        .from("ai_students")
        .update({
          two_factor_attempts:
            attempts + 1,
        })
        .eq(
          "id",
          student.id
        )

      return NextResponse.json(
        {
          success: false,
          error:
            `Incorrect verification code. ${4 - attempts} attempt${4 - attempts === 1 ? "" : "s"} remaining.`,
        },
        { status: 400 }
      )
    }

    // ------------------------------------------
    // SUCCESS
    // ------------------------------------------

    await supabaseAdmin
      .from("ai_students")
      .update({
        two_factor_code_hash:
          null,

        two_factor_expires_at:
          null,

        two_factor_attempts:
          0,

        two_factor_verified_at:
          new Date().toISOString(),

        last_login_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        student.id
      )

    // ------------------------------------------
    // NOW CREATE THE REAL AI SESSION
    // ------------------------------------------

    await setAIStudentSession({
      id:
        student.id,

      email:
        student.email,

      firstName:
        student.first_name,

      lastName:
        student.last_name,

      level:
        student.level,

      curriculum:
        student.curriculum,
    })

    // ------------------------------------------
    // DELETE PENDING TOKEN
    // ------------------------------------------

    const response =
      NextResponse.json({
        success: true,

        message:
          "Two-factor authentication successful.",

        student: {
          id:
            student.id,

          firstName:
            student.first_name,

          lastName:
            student.last_name,

          email:
            student.email,

          level:
            student.level,

          curriculum:
            student.curriculum,
        },
      })

    response.cookies.set(
      AI_2FA_PENDING_COOKIE,
      "",
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        maxAge: 0,
      }
    )

    return response
  } catch (error) {
    console.error(
      "AI 2FA verification error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while verifying your code.",
      },
      { status: 500 }
    )
  }
}