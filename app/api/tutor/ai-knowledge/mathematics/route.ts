import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export const runtime = "nodejs"

export async function GET() {
  try {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from("ai_zimsec_math_papers")
      .select(`
        id,
        exam_year,
        session,
        paper,
        title,
        original_file_name,
        extraction_status,
        extraction_error,
        question_count,
        processed_by_model,
        created_at,
        updated_at
      `)
      .order("exam_year", {
        ascending: false,
      })
      .order("paper", {
        ascending: true,
      })

    if (error) {
      console.error(
        "Knowledge base fetch error:",
        error
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Could not load Mathematics knowledge base.",
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      papers: data || [],
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        error:
          "Could not load Mathematics knowledge base.",
      },
      { status: 500 }
    )
  }
}