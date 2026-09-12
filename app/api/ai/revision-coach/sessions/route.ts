import {
  NextRequest,
  NextResponse,
} from "next/server"

import {
  getAIStudentSession,
} from "@/lib/ai-auth"

import {
  supabaseAdmin,
} from "@/lib/supabase-admin"

export const runtime = "nodejs"

async function getStudent() {
  const session =
    await getAIStudentSession()

  if (!session?.id) {
    return null
  }

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
        account_status
        `
      )
      .eq(
        "id",
        session.id
      )
      .maybeSingle()

  if (
    error ||
    !student ||
    student.account_status !==
      "active"
  ) {
    return null
  }

  return student
}

/**
 * ------------------------------------------------------------
 * GET
 * ------------------------------------------------------------
 */
export async function GET() {
  try {
    const student =
      await getStudent()

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          code: "UNAUTHENTICATED",
          sessions: [],
        },
        {
          status: 401,
        }
      )
    }

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          "ai_revision_sessions"
        )
        .select(
          `
          id,
          ai_student_id,
          user_id,
          title,
          subject,
          level,
          curriculum,
          topic,
          subtopic,
          mode,
          status,
          messages_count,
          created_at,
          updated_at
          `
        )
        .eq(
          "ai_student_id",
          student.id
        )
        .order(
          "updated_at",
          {
            ascending: false,
          }
        )
        .limit(50)

    if (error) {
      console.error(
        "Revision sessions GET error:",
        error
      )

      return NextResponse.json(
        {
          success: false,
          code: "SESSIONS_LOAD_FAILED",
          message:
            "Unable to load revision sessions.",
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(
      {
        success: true,
        sessions:
          data || [],
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
      "Revision sessions GET error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load revision sessions.",
      },
      {
        status: 500,
      }
    )
  }
}

/**
 * ------------------------------------------------------------
 * POST
 * ------------------------------------------------------------
 */
export async function POST(
  request: NextRequest
) {
  try {
    const student =
      await getStudent()

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          code: "UNAUTHENTICATED",
          message:
            "Please sign in first.",
        },
        {
          status: 401,
        }
      )
    }

    let body: {
      title?: string
      topic?: string
      subtopic?: string
      mode?: string
    }

    try {
      body =
        await request.json()
    } catch {
      body = {}
    }

    const title =
      typeof body.title ===
      "string"
        ? body.title
            .trim()
            .slice(0, 200)
        : "Mathematics Revision"

    const topic =
      typeof body.topic ===
      "string"
        ? body.topic
            .trim()
            .slice(0, 200) ||
          null
        : null

    const subtopic =
      typeof body.subtopic ===
      "string"
        ? body.subtopic
            .trim()
            .slice(0, 200) ||
          null
        : null

    const allowedModes = [
      "chat",
      "explain",
      "practice",
      "quiz",
      "exam_prep",
      "mistake_fix",
      "revision_plan",
    ]

    const mode =
      typeof body.mode ===
        "string" &&
      allowedModes.includes(
        body.mode
      )
        ? body.mode
        : "chat"

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          "ai_revision_sessions"
        )
        .insert({
          ai_student_id:
            student.id,
          title:
            title ||
            "Mathematics Revision",
          subject:
            "Mathematics",
          level:
            student.level ||
            "O-Level",
          curriculum:
            student.curriculum ||
            "ZIMSEC",
          topic,
          subtopic,
          mode,
          status: "active",
          messages_count: 0,
        })
        .select(
          `
          id,
          ai_student_id,
          user_id,
          title,
          subject,
          level,
          curriculum,
          topic,
          subtopic,
          mode,
          status,
          messages_count,
          created_at,
          updated_at
          `
        )
        .single()

    if (error || !data) {
      console.error(
        "Revision session creation error:",
        error
      )

      return NextResponse.json(
        {
          success: false,
          code: "SESSION_CREATE_FAILED",
          message:
            "Unable to create revision session.",
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(
      {
        success: true,
        session: data,
      },
      {
        status: 201,
      }
    )
  } catch (error) {
    console.error(
      "Revision sessions POST error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to create revision session.",
      },
      {
        status: 500,
      }
    )
  }
}