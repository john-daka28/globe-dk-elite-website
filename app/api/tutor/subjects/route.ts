import { NextResponse } from "next/server"

import { requireRole } from "@/lib/auth/session"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await requireRole(["tutor"])

    const { data: subjects, error } = await supabaseAdmin
      .from("subjects")
      .select("id, name, is_active")
      .eq("is_active", true)
      .order("name", { ascending: true })

    if (error) {
      console.error(
        "GET /api/tutor/subjects error:",
        error
      )

      return NextResponse.json(
        {
          error: "Failed to retrieve subjects.",
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json({
      subjects: subjects || [],
      total: subjects?.length || 0,
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHENTICATED") {
        return NextResponse.json(
          {
            error: "You must be logged in.",
          },
          {
            status: 401,
          }
        )
      }

      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json(
          {
            error:
              "You are not authorised to access subjects.",
          },
          {
            status: 403,
          }
        )
      }
    }

    console.error(
      "GET /api/tutor/subjects unexpected error:",
      error
    )

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      }
    )
  }
}