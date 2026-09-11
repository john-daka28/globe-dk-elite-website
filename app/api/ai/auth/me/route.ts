import { NextResponse } from "next/server"

import {
  getAIStudentSession,
} from "@/lib/ai-auth"

import {
  supabaseAdmin,
} from "@/lib/supabase-admin"

export const runtime = "nodejs"

export async function GET() {
  try {
    const session =
      await getAIStudentSession()

    if (!session?.id) {
      return NextResponse.json(
        {
          authenticated: false,
          student: null,
          credits: {
            balance: 0,
          },
        },
        {
          status: 401,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      )
    }

    /**
     * ----------------------------------------------------------
     * 1. GET AI STUDENT
     * ----------------------------------------------------------
     */

    const {
      data: student,
      error: studentError,
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
          account_status
          `
        )
        .eq("id", session.id)
        .maybeSingle()

    if (studentError) {
      console.error(
        "AI student lookup error:",
        studentError
      )

      return NextResponse.json(
        {
          authenticated: false,
          student: null,
          credits: {
            balance: 0,
          },
        },
        {
          status: 401,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      )
    }

    if (!student) {
      return NextResponse.json(
        {
          authenticated: false,
          student: null,
          credits: {
            balance: 0,
          },
        },
        {
          status: 401,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      )
    }

    /**
     * ----------------------------------------------------------
     * 2. CHECK ACCOUNT STATUS
     * ----------------------------------------------------------
     */

    if (student.account_status !== "active") {
      return NextResponse.json(
        {
          authenticated: false,
          student: null,
          credits: {
            balance: 0,
          },
        },
        {
          status: 403,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      )
    }

    /**
     * ----------------------------------------------------------
     * 3. GET AI CREDIT BALANCE
     * ----------------------------------------------------------
     */

    const {
      data: creditBalance,
      error: creditError,
    } =
      await supabaseAdmin
        .from("ai_credit_balances")
        .select(
          "balance"
        )
        .eq(
          "ai_student_id",
          student.id
        )
        .maybeSingle()

    if (creditError) {
      console.error(
        "AI credit lookup error:",
        creditError
      )

      return NextResponse.json(
        {
          authenticated: true,

          student: {
            id: student.id,
            firstName: student.first_name,
            lastName: student.last_name,
            email: student.email,
            level: student.level,
            curriculum: student.curriculum,
          },

          credits: {
            balance: 0,
          },

          error:
            "Unable to retrieve AI credits.",
        },
        {
          status: 500,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      )
    }

    /**
     * ----------------------------------------------------------
     * 4. NORMALIZE BALANCE
     * ----------------------------------------------------------
     */

    const balance =
      Number(
        creditBalance?.balance ?? 0
      )

    /**
     * ----------------------------------------------------------
     * 5. RETURN DATA
     * ----------------------------------------------------------
     *
     * IMPORTANT:
     *
     * The frontend expects:
     *
     * credits: {
     *   balance: number
     * }
     *
     * NOT:
     *
     * credits: number
     */

    return NextResponse.json(
      {
        authenticated: true,

        student: {
          id: student.id,
          firstName: student.first_name,
          lastName: student.last_name,
          email: student.email,
          level: student.level,
          curriculum: student.curriculum,
        },

        credits: {
          balance,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    )
  } catch (error) {
    console.error(
      "AI me error:",
      error
    )

    return NextResponse.json(
      {
        authenticated: false,
        student: null,
        credits: {
          balance: 0,
        },
      },
      {
        status: 401,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    )
  }
}