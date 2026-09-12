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

type RouteContext = {
  params: {
    id: string
  }
}

async function getAuthenticatedStudent() {
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
 * GET ONE SESSION
 * ------------------------------------------------------------
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const student =
      await getAuthenticatedStudent()

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          code: "UNAUTHENTICATED",
        },
        {
          status: 401,
        }
      )
    }

    const sessionId =
      context.params.id

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          code: "SESSION_ID_REQUIRED",
        },
        {
          status: 400,
        }
      )
    }

    const {
      data: session,
      error: sessionError,
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
          "id",
          sessionId
        )
        .eq(
          "ai_student_id",
          student.id
        )
        .maybeSingle()

    if (sessionError) {
      console.error(
        "Revision session GET error:",
        sessionError
      )

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to load revision session.",
        },
        {
          status: 500,
        }
      )
    }

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          code: "SESSION_NOT_FOUND",
          message:
            "Revision session not found.",
        },
        {
          status: 404,
        }
      )
    }

    const {
      data: messages,
      error: messagesError,
    } =
      await supabaseAdmin
        .from(
          "ai_revision_messages"
        )
        .select(
          `
          id,
          session_id,
          ai_student_id,
          role,
          content,
          subject,
          topic,
          subtopic,
          model_name,
          credits_used,
          created_at
          `
        )
        .eq(
          "session_id",
          sessionId
        )
        .eq(
          "ai_student_id",
          student.id
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        )

    if (messagesError) {
      console.error(
        "Revision messages GET error:",
        messagesError
      )

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to load revision messages.",
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(
      {
        success: true,
        session,
        messages:
          messages || [],
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
      "Revision session GET error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load revision session.",
      },
      {
        status: 500,
      }
    )
  }
}

/**
 * ------------------------------------------------------------
 * PATCH
 * ------------------------------------------------------------
 *
 * Rename or archive a revision session.
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const student =
      await getAuthenticatedStudent()

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          code: "UNAUTHENTICATED",
        },
        {
          status: 401,
        }
      )
    }

    const sessionId =
      context.params.id

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          code: "SESSION_ID_REQUIRED",
        },
        {
          status: 400,
        }
      )
    }

    let body: {
      title?: string
      status?: string
    }

    try {
      body =
        await request.json()
    } catch {
      body = {}
    }

    const updateData: {
      title?: string
      status?: string
      updated_at: string
    } = {
      updated_at:
        new Date().toISOString(),
    }

    if (
      typeof body.title ===
      "string"
    ) {
      const title =
        body.title
          .trim()
          .slice(0, 200)

      if (title) {
        updateData.title =
          title
      }
    }

    if (
      body.status ===
        "active" ||
      body.status ===
        "completed" ||
      body.status ===
        "archived"
    ) {
      updateData.status =
        body.status
    }

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          "ai_revision_sessions"
        )
        .update(updateData)
        .eq(
          "id",
          sessionId
        )
        .eq(
          "ai_student_id",
          student.id
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
        .maybeSingle()

    if (error) {
      console.error(
        "Revision session PATCH error:",
        error
      )

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to update revision session.",
        },
        {
          status: 500,
        }
      )
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          code: "SESSION_NOT_FOUND",
          message:
            "Revision session not found.",
        },
        {
          status: 404,
        }
      )
    }

    return NextResponse.json(
      {
        success: true,
        session: data,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Revision session PATCH error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update revision session.",
      },
      {
        status: 500,
      }
    )
  }
}

/**
 * ------------------------------------------------------------
 * DELETE
 * ------------------------------------------------------------
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const student =
      await getAuthenticatedStudent()

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          code: "UNAUTHENTICATED",
        },
        {
          status: 401,
        }
      )
    }

    const sessionId =
      context.params.id

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          code: "SESSION_ID_REQUIRED",
        },
        {
          status: 400,
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
        .delete()
        .eq(
          "id",
          sessionId
        )
        .eq(
          "ai_student_id",
          student.id
        )
        .select("id")
        .maybeSingle()

    if (error) {
      console.error(
        "Revision session DELETE error:",
        error
      )

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to delete revision session.",
        },
        {
          status: 500,
        }
      )
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          code: "SESSION_NOT_FOUND",
          message:
            "Revision session not found.",
        },
        {
          status: 404,
        }
      )
    }

    return NextResponse.json(
      {
        success: true,
        deletedId: data.id,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Revision session DELETE error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to delete revision session.",
      },
      {
        status: 500,
      }
    )
  }
}