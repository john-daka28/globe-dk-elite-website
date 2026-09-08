import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // --------------------------------------------------
    // 1. Check authenticated user
    // --------------------------------------------------

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // --------------------------------------------------
    // 2. Verify tutor
    // --------------------------------------------------

    const { data: tutor, error: tutorError } = await supabase
      .from("profiles")
      .select("id, role, first_name, last_name, email")
      .eq("id", user.id)
      .single();

    if (tutorError || !tutor) {
      return NextResponse.json(
        {
          success: false,
          error: "Tutor profile not found",
        },
        { status: 404 }
      );
    }

    if (tutor.role !== "tutor") {
      return NextResponse.json(
        {
          success: false,
          error: "Only tutors can invite students",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // 3. Read request body
    // --------------------------------------------------

    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      school,
      form,
      curriculum,
      subjects,
      gender,
      dateOfBirth,
      address,
      notes,
    } = body;

    // --------------------------------------------------
    // 4. Required fields
    // --------------------------------------------------

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        {
          success: false,
          error: "First name, last name and email are required",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 5. Validate email
    // --------------------------------------------------

    const normalizedEmail = String(email).trim().toLowerCase();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email address",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 6. Check if email already belongs to a student
    // --------------------------------------------------

    const { data: existingStudent } = await supabase
      .from("profiles")
      .select("id, email, role")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existingStudent) {
      return NextResponse.json(
        {
          success: false,
          error: "A user with this email already exists",
        },
        { status: 409 }
      );
    }

    // --------------------------------------------------
    // 7. Check existing pending invitation
    // --------------------------------------------------

    const { data: existingInvitation } = await supabase
      .from("student_invitations")
      .select("id, status, expires_at")
      .eq("tutor_id", user.id)
      .eq("email", normalizedEmail)
      .eq("status", "pending")
      .maybeSingle();

    if (existingInvitation) {
      return NextResponse.json(
        {
          success: false,
          error: "There is already a pending invitation for this student",
          invitationId: existingInvitation.id,
        },
        { status: 409 }
      );
    }

    // --------------------------------------------------
    // 8. Generate secure invitation token
    // --------------------------------------------------

    const invitationToken = crypto.randomBytes(32).toString("hex");

    // Invitation expires after 7 days
    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    // --------------------------------------------------
    // 9. Save invitation
    // --------------------------------------------------

    const { data: invitation, error: invitationError } =
      await supabase
        .from("student_invitations")
        .insert({
          tutor_id: user.id,

          first_name: String(firstName).trim(),
          last_name: String(lastName).trim(),

          email: normalizedEmail,

          phone: phone ? String(phone).trim() : null,

          school: school ? String(school).trim() : null,

          form: form ? String(form).trim() : null,

          curriculum: curriculum
            ? String(curriculum).trim()
            : null,

          subjects: Array.isArray(subjects)
            ? subjects
            : [],

          gender: gender
            ? String(gender).trim()
            : null,

          date_of_birth: dateOfBirth
            ? String(dateOfBirth)
            : null,

          address: address
            ? String(address).trim()
            : null,

          notes: notes
            ? String(notes).trim()
            : null,

          invitation_token: invitationToken,

          status: "pending",

          expires_at: expiresAt,
        })
        .select("id, expires_at, status")
        .single();

    if (invitationError || !invitation) {
      console.error(
        "Invitation creation error:",
        invitationError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Failed to create student invitation",
          details: invitationError?.message,
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // 10. Create invitation URL
    // --------------------------------------------------

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const invitationUrl =
      `${origin}/student/invite/${invitation.id}`;

    // --------------------------------------------------
    // 11. Return invitation
    // --------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        message: "Student invitation created successfully",

        invitation: {
          id: invitation.id,
          status: invitation.status,
          expiresAt: invitation.expires_at,
          invitationUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/tutor/students/invite error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}