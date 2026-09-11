import { NextRequest, NextResponse } from "next/server"

import bcrypt from "bcryptjs"

import { setAIStudentSession } from "@/lib/ai-auth"
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

    const password = String(
      body.password || ""
    )

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Email and password are required.",
        },
        {
          status: 400,
        }
      )
    }

    // ------------------------------------------
    // FIND AI ACCOUNT
    // ------------------------------------------

    const {
      data: student,
      error,
    } = await supabaseAdmin
      .from("ai_students")
      .select(
        `
        id,
        first_name,
        last_name,
        email,
        password_hash,
        level,
        curriculum,
        account_status,
        email_verified
        `
      )
      .eq("email", email)
      .maybeSingle()

    if (error) {
      console.error(
        "AI signin lookup:",
        error
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to sign you in.",
        },
        {
          status: 500,
        }
      )
    }

    // ------------------------------------------
    // ACCOUNT NOT FOUND
    // ------------------------------------------

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Incorrect email or password.",
        },
        {
          status: 401,
        }
      )
    }

    // ------------------------------------------
    // ACCOUNT STATUS
    // ------------------------------------------

    if (
      student.account_status !==
      "active"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your AI Learning Hub account is currently suspended.",
        },
        {
          status: 403,
        }
      )
    }

    // ------------------------------------------
    // PASSWORD CHECK
    // ------------------------------------------

    const passwordCorrect =
      await bcrypt.compare(
        password,
        student.password_hash
      )

    if (!passwordCorrect) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Incorrect email or password.",
        },
        {
          status: 401,
        }
      )
    }

    // ------------------------------------------
    // EMAIL VERIFICATION
    // ------------------------------------------

    if (!student.email_verified) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please confirm your email address before signing in.",

          requiresEmailVerification:
            true,

          email:
            student.email,
        },
        {
          status: 403,
        }
      )
    }

    // ------------------------------------------
    // CREATE REAL AI SESSION
    // ------------------------------------------
    //
    // IMPORTANT:
    // There is NO 2FA here.
    //
    // Correct email + password +
    // verified email = logged in.
    // ------------------------------------------

    await setAIStudentSession({
      id: student.id,

      email: student.email,

      firstName:
        student.first_name,

      lastName:
        student.last_name,

      level:
        student.level as
          | "O-Level"
          | "A-Level",

      curriculum:
        student.curriculum as
          | "ZIMSEC"
          | "Cambridge",
    })

    // ------------------------------------------
    // UPDATE LAST LOGIN
    // ------------------------------------------

    const { error: loginUpdateError } =
      await supabaseAdmin
        .from("ai_students")
        .update({
          last_login_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          student.id
        )

    if (loginUpdateError) {
      console.error(
        "Updating last login:",
        loginUpdateError
      )

      // Do not fail the login because
      // the actual session was already created.
    }

    // ------------------------------------------
    // SUCCESS
    // ------------------------------------------

    return NextResponse.json({
      success: true,

      message:
        "Signed in successfully.",

      student: {
        id: student.id,

        email: student.email,

        firstName:
          student.first_name,

        lastName:
          student.last_name,

        level:
          student.level,

        curriculum:
          student.curriculum,
      },
    })

  } catch (error) {
    console.error(
      "AI signin error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while signing you in.",
      },
      {
        status: 500,
      }
    )
  }
}