import { NextResponse } from "next/server"

import {
  requireRole,
} from "@/lib/auth/session"

import {
  supabaseAdmin,
} from "@/lib/supabaseAdmin"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    /*
     * Only administrators can access
     * the admin students endpoint.
     */
    const admin =
      await requireRole([
        "admin",
        "administrator",
      ])

    if (!admin) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      )
    }

    /*
     * Students are stored in the
     * users table.
     *
     * The role column determines
     * whether the user is a student.
     */
    const {
      data: students,
      error,
    } = await supabaseAdmin
      .from("users")
      .select(`
        id,
        email,
        first_name,
        last_name,
        phone,
        level,
        school,
        guardian_name,
        guardian_phone,
        role,
        email_verified,
        account_status,
        created_at,
        updated_at
      `)
      .eq(
        "role",
        "student"
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      )

    if (error) {
      console.error(
        "Admin students GET error:",
        error
      )

      return NextResponse.json(
        {
          error:
            "Failed to retrieve students.",
        },
        {
          status: 500,
        }
      )
    }

    /*
     * Return the students.
     */
    return NextResponse.json(
      {
        students:
          students || [],
        total:
          students?.length || 0,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Admin students authentication error:",
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
            "Authentication required.",
        },
        {
          status: 401,
        }
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
            "Administrator access required.",
        },
        {
          status: 403,
        }
      )
    }

    return NextResponse.json(
      {
        error:
          "Internal server error.",
      },
      {
        status: 500,
      }
    )
  }
}