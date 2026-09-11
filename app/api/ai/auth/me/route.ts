import { NextResponse } from "next/server"

import {
  getAIStudentSession,
} from "@/lib/ai-auth"

import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  try {
    const session =
      await getAIStudentSession()

    if (!session) {
      return NextResponse.json(
        {
          authenticated: false,
          student: null,
        },
        { status: 401 }
      )
    }

    const { data: student, error } =
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

    if (error || !student) {
      return NextResponse.json(
        {
          authenticated: false,
          student: null,
        },
        { status: 401 }
      )
    }

    if (student.account_status !== "active") {
      return NextResponse.json(
        {
          authenticated: false,
          student: null,
        },
        { status: 403 }
      )
    }

    const { data: credits } =
      await supabaseAdmin
        .from("ai_credit_balances")
        .select("balance")
        .eq("ai_student_id", student.id)
        .maybeSingle()

    return NextResponse.json({
      authenticated: true,

      student: {
        id: student.id,
        firstName: student.first_name,
        lastName: student.last_name,
        email: student.email,
        level: student.level,
        curriculum: student.curriculum,
      },

      credits: credits?.balance ?? 0,
    })
  } catch (error) {
    console.error(
      "AI me error:",
      error
    )

    return NextResponse.json(
      {
        authenticated: false,
        student: null,
      },
      { status: 401 }
    )
  }
}