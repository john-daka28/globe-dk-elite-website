
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


type ActivateStudentBody = {
  token?: string
  password?: string
  confirmPassword?: string
}


type StudentActivationRecord = {
  id: string
  email?: string | null
  role?: string | null
  account_status?: string | null
  password_hash?: string | null
  email_verified?: boolean | null
  verification_token?: string | null
  verification_token_expires_at?: string | null

  // Student/profile fields that may exist in users
  first_name?: string | null
  last_name?: string | null
  student_number?: string | null
  school_name?: string | null
  current_level?: string | null
}


export async function POST(
  request: NextRequest
) {

  console.log("")
  console.log("==================================================")
  console.log("       STUDENT ACTIVATION STARTED")
  console.log("==================================================")


  try {

    /* ==================================================
       1. READ REQUEST
    ================================================== */

    console.log("[1] Reading request body...")

    const body =
      (await request.json()) as ActivateStudentBody


    const token =
      String(
        body.token || ""
      ).trim()

    const password =
      String(
        body.password || ""
      )

    const confirmPassword =
      String(
        body.confirmPassword || ""
      )


    console.log(
      "[1] Token present:",
      Boolean(token)
    )

    console.log(
      "[1] Token length:",
      token.length
    )

    console.log(
      "[1] Password length:",
      password.length
    )

    console.log(
      "[1] Passwords match:",
      password === confirmPassword
    )


    /* ==================================================
       2. VALIDATE TOKEN
    ================================================== */

    if (!token) {

      console.error(
        "[2] FAILED: Token missing."
      )

      return NextResponse.json(
        {
          error:
            "Activation token is required.",
        },
        {
          status: 400,
        }
      )
    }


    /* ==================================================
       3. VALIDATE PASSWORD
    ================================================== */

    if (!password) {

      console.error(
        "[3] FAILED: Password missing."
      )

      return NextResponse.json(
        {
          error:
            "Password is required.",
        },
        {
          status: 400,
        }
      )
    }


    if (
      password.length < 8
    ) {

      console.error(
        "[3] FAILED: Password too short."
      )

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


    if (
      password !==
      confirmPassword
    ) {

      console.error(
        "[3] FAILED: Passwords do not match."
      )

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


    console.log(
      "[3] Password validation passed."
    )


    /* ==================================================
       4. HASH TOKEN
    ================================================== */

    console.log(
      "[4] Hashing activation token..."
    )

    const tokenHash =
      hashToken(token)


    console.log(
      "[4] Token hash length:",
      tokenHash.length
    )

    console.log(
      "[4] Token hash generated successfully."
    )


    /* ==================================================
       5. LOOK UP USER
       
       We use select("*") intentionally.
       This prevents Supabase's generated type from
       producing GenericStringError while we diagnose
       the actual database structure.
    ================================================== */

    console.log(
      "[5] Searching users table..."
    )

    const {
      data: rawUser,
      error: lookupError,
    } =
      await (
        supabaseAdmin as any
      )
        .from("users")
        .select("*")
        .eq(
          "verification_token",
          tokenHash
        )
        .maybeSingle()


    const student =
      rawUser as StudentActivationRecord | null


    /* ==================================================
       6. DATABASE LOOKUP DEBUG
    ================================================== */

    console.log(
      "[6] Users lookup finished."
    )

    console.log(
      "[6] Lookup error:",
      lookupError || "NONE"
    )

    console.log(
      "[6] User found:",
      Boolean(student)
    )


    if (
      lookupError
    ) {

      console.error(
        "[6] DATABASE LOOKUP FAILED"
      )

      console.error(
        "[6] Supabase error:",
        lookupError
      )

      return NextResponse.json(
        {
          error:
            "Unable to verify activation link.",
        },
        {
          status: 500,
        }
      )
    }


    /* ==================================================
       7. IF USER FOUND, INSPECT AVAILABLE COLUMNS
    ================================================== */

    if (student) {

      console.log(
        "[7] User ID:",
        student.id
      )

      console.log(
        "[7] User email:",
        student.email || "MISSING"
      )

      console.log(
        "[7] User role:",
        student.role || "MISSING"
      )

      console.log(
        "[7] Account status:",
        student.account_status || "MISSING"
      )

      console.log(
        "[7] First name:",
        student.first_name || "MISSING"
      )

      console.log(
        "[7] Last name:",
        student.last_name || "MISSING"
      )

      console.log(
        "[7] Verification token exists:",
        Boolean(
          student.verification_token
        )
      )

      console.log(
        "[7] Verification token length:",
        student.verification_token
          ? student.verification_token.length
          : 0
      )

      console.log(
        "[7] Verification expiry:",
        student.verification_token_expires_at ||
          "MISSING"
      )

    } else {

      console.error(
        "[7] NO USER FOUND FOR TOKEN."
      )

      console.error(
        "[7] This means the hashed token does not match users.verification_token."
      )

      return NextResponse.json(
        {
          error:
            "This activation link is invalid or has already been used.",
        },
        {
          status: 400,
        }
      )
    }


    /* ==================================================
       8. CHECK ROLE
    ================================================== */

    console.log(
      "[8] Checking role..."
    )


    if (
      student.role !==
      "student"
    ) {

      console.error(
        "[8] FAILED: Expected role 'student'."
      )

      console.error(
        "[8] Actual role:",
        student.role
      )

      return NextResponse.json(
        {
          error:
            "This activation link is not valid for a student account.",
        },
        {
          status: 403,
        }
      )
    }


    console.log(
      "[8] Role check passed."
    )


    /* ==================================================
       9. CHECK ACCOUNT STATUS
    ================================================== */

    console.log(
      "[9] Checking account status..."
    )


    if (
      student.account_status ===
      "active"
    ) {

      console.error(
        "[9] FAILED: Account already active."
      )

      return NextResponse.json(
        {
          error:
            "This student account has already been activated.",
        },
        {
          status: 400,
        }
      )
    }


    console.log(
      "[9] Account status:",
      student.account_status
    )


    /* ==================================================
       10. CHECK TOKEN EXPIRY
    ================================================== */

    console.log(
      "[10] Checking token expiry..."
    )


    if (
      !student.verification_token_expires_at
    ) {

      console.error(
        "[10] FAILED: verification_token_expires_at is missing."
      )

      return NextResponse.json(
        {
          error:
            "This activation link is no longer valid.",
        },
        {
          status: 400,
        }
      )
    }


    const expiry =
      new Date(
        student.verification_token_expires_at
      )


    console.log(
      "[10] Token expiry:",
      expiry.toISOString()
    )

    console.log(
      "[10] Current time:",
      new Date().toISOString()
    )


    if (
      Number.isNaN(
        expiry.getTime()
      )
    ) {

      console.error(
        "[10] FAILED: Invalid expiry date."
      )

      return NextResponse.json(
        {
          error:
            "This activation link is no longer valid.",
        },
        {
          status: 400,
        }
      )
    }


    if (
      expiry.getTime() <
      Date.now()
    ) {

      console.error(
        "[10] FAILED: Token expired."
      )

      return NextResponse.json(
        {
          error:
            "This activation link has expired. Please ask your tutor to send a new invitation.",
        },
        {
          status: 400,
        }
      )
    }


    console.log(
      "[10] Token expiry check passed."
    )


    /* ==================================================
       11. HASH PASSWORD
    ================================================== */

    console.log(
      "[11] Hashing password..."
    )


    let passwordHash: string


    try {

      passwordHash =
        await hashPassword(
          password
        )

      console.log(
        "[11] Password hashing successful."
      )

    } catch (error) {

      console.error(
        "[11] PASSWORD HASHING FAILED:",
        error
      )

      return NextResponse.json(
        {
          error:
            "Unable to securely create your password.",
        },
        {
          status: 500,
        }
      )
    }


    /* ==================================================
       12. UPDATE USER
    ================================================== */

    console.log(
      "[12] Updating student account..."
    )

    console.log(
      "[12] Student ID:",
      student.id
    )


    const {
      data: updatedUser,
      error: updateError,
    } =
      await (
        supabaseAdmin as any
      )
        .from("users")
        .update({
          password_hash:
            passwordHash,

          account_status:
            "active",

          email_verified:
            true,

          verification_token:
            null,

          verification_token_expires_at:
            null,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          student.id
        )
        .select("*")
        .single()


    /* ==================================================
       13. UPDATE DEBUG
    ================================================== */

    console.log(
      "[13] Update completed."
    )

    console.log(
      "[13] Update error:",
      updateError || "NONE"
    )

    console.log(
      "[13] Updated user returned:",
      Boolean(updatedUser)
    )


    if (
      updateError
    ) {

      console.error(
        "[13] DATABASE UPDATE FAILED"
      )

      console.error(
        "[13] Full Supabase update error:",
        updateError
      )

      return NextResponse.json(
        {
          error:
            "Unable to activate your account.",
        },
        {
          status: 500,
        }
      )
    }


    if (
      !updatedUser
    ) {

      console.error(
        "[13] FAILED: No updated user returned."
      )

      return NextResponse.json(
        {
          error:
            "Unable to activate your account.",
        },
        {
          status: 500,
        }
      )
    }


    /* ==================================================
       14. CREATE SESSION
    ================================================== */

    console.log(
      "[14] Creating student session..."
    )

    console.log(
      "[14] Student ID:",
      student.id
    )

    console.log(
      "[14] Student role:",
      student.role
    )


    try {

      await createSession(
        student.id,
        "student"
      )

      console.log(
        "[14] Session created successfully."
      )

    } catch (sessionError) {

      console.error(
        "[14] SESSION CREATION FAILED"
      )

      console.error(
        "[14] Session error:",
        sessionError
      )

      return NextResponse.json(
        {
          error:
            "Your account was activated, but we could not create your login session.",
        },
        {
          status: 500,
        }
      )
    }


    /* ==================================================
       15. SUCCESS
    ================================================== */

    console.log("")
    console.log(
      "=================================================="
    )
    console.log(
      "       STUDENT ACTIVATION SUCCESS"
    )
    console.log(
      "=================================================="
    )

    console.log(
      "Student ID:",
      student.id
    )

    console.log(
      "Student email:",
      student.email || "UNKNOWN"
    )

    console.log(
      "Student role:",
      "student"
    )

    console.log(
      "Redirect:",
      "/student"
    )

    console.log(
      "=================================================="
    )
    console.log("")


    return NextResponse.json(
      {
        success: true,

        message:
          "Your student account has been activated successfully.",

        redirect:
          "/student",
      },
      {
        status: 200,
      }
    )


  } catch (error) {

    console.error("")
    console.error(
      "=================================================="
    )
    console.error(
      "   UNEXPECTED STUDENT ACTIVATION ERROR"
    )
    console.error(
      "=================================================="
    )

    console.error(
      "Error:",
      error
    )

    console.error(
      "=================================================="
    )
    console.error("")


    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while activating your account.",
      },
      {
        status: 500,
      }
    )
  }
}
