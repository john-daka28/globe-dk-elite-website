import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export const runtime = "nodejs"

export async function GET() {
  try {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from("ai_zimsec_math_topic_statistics")
      .select(`
        id,
        topic,
        subtopic,
        paper,
        total_questions,
        total_marks,
        papers_appeared,
        most_recent_year,
        earliest_year,
        average_marks,
        updated_at
      `)
      .order("total_questions", {
        ascending: false,
      })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not load topic statistics.",
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      statistics: data || [],
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
        error:
          "Could not load topic statistics.",
      },
      { status: 500 }
    )
  }
}