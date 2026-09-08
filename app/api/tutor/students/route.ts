import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get currently authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get tutor profile
    const { data: tutor, error: tutorError } = await supabase
      .from("profiles")
      .select("id, role, first_name, last_name, email")
      .eq("id", user.id)
      .single();

    if (tutorError || !tutor) {
      return NextResponse.json(
        { success: false, error: "Tutor profile not found" },
        { status: 404 }
      );
    }

    if (tutor.role !== "tutor") {
      return NextResponse.json(
        { success: false, error: "Only tutors can access students" },
        { status: 403 }
      );
    }

    // Get students linked to this tutor
    const { data: students, error: studentsError } = await supabase
      .from("profiles")
      .select(
        `
        id,
        first_name,
        last_name,
        email,
        phone,
        role,
        created_at
        `
      )
      .eq("tutor_id", user.id)
      .eq("role", "student")
      .order("created_at", { ascending: false });

    if (studentsError) {
      console.error("Error loading students:", studentsError);

      return NextResponse.json(
        {
          success: false,
          error: "Failed to load students",
          details: studentsError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      students: students || [],
      count: students?.length || 0,
    });
  } catch (error) {
    console.error("GET /api/tutor/students error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}