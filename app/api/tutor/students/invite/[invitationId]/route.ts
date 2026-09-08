import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    invitationId: string;
  }>;
};

// ======================================================
// GET INVITATION
// ======================================================

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { invitationId } = await context.params;

    if (!invitationId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invitation ID is required",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // --------------------------------------------------
    // Find invitation
    // --------------------------------------------------

    const { data: invitation, error } = await supabase
      .from("student_invitations")
      .select(
        `
        id,
        tutor_id,
        first_name,
        last_name,
        email,
        phone,
        school,
        form,
        curriculum,
        subjects,
        gender,
        date_of_birth,
        address,
        status,
        expires_at,
        created_at
        `
      )
      .eq("id", invitationId)
      .single();

    if (error || !invitation) {
      return NextResponse.json(
        {
          success: false,
          error: "Invitation not found",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // Check invitation status
    // --------------------------------------------------

    if (invitation.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          error: `This invitation is ${invitation.status}`,
          status: invitation.status,
        },
        { status: 410 }
      );
    }

    // --------------------------------------------------
    // Check expiration
    // --------------------------------------------------

    if (
      invitation.expires_at &&
      new Date(invitation.expires_at) < new Date()
    ) {
      await supabase
        .from("student_invitations")
        .update({
          status: "expired",
        })
        .eq("id", invitationId);

      return NextResponse.json(
        {
          success: false,
          error: "This invitation has expired",
        },
        { status: 410 }
      );
    }

    // --------------------------------------------------
    // Return safe invitation information
    // --------------------------------------------------

    return NextResponse.json({
      success: true,

      invitation: {
        id: invitation.id,

        firstName: invitation.first_name,
        lastName: invitation.last_name,

        email: invitation.email,

        phone: invitation.phone,

        school: invitation.school,

        form: invitation.form,

        curriculum: invitation.curriculum,

        subjects: invitation.subjects || [],

        gender: invitation.gender,

        dateOfBirth: invitation.date_of_birth,

        address: invitation.address,

        expiresAt: invitation.expires_at,

        status: invitation.status,

        createdAt: invitation.created_at,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/tutor/students/invite/[invitationId] error:",
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

// ======================================================
// ACCEPT INVITATION
// ======================================================

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { invitationId } = await context.params;

    if (!invitationId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invitation ID is required",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // --------------------------------------------------
    // Get invitation
    // --------------------------------------------------

    const { data: invitation, error: invitationError } =
      await supabase
        .from("student_invitations")
        .select("*")
        .eq("id", invitationId)
        .single();

    if (invitationError || !invitation) {
      return NextResponse.json(
        {
          success: false,
          error: "Invitation not found",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // Check status
    // --------------------------------------------------

    if (invitation.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          error: `This invitation is ${invitation.status}`,
        },
        { status: 410 }
      );
    }

    // --------------------------------------------------
    // Check expiry
    // --------------------------------------------------

    if (
      invitation.expires_at &&
      new Date(invitation.expires_at) < new Date()
    ) {
      await supabase
        .from("student_invitations")
        .update({
          status: "expired",
        })
        .eq("id", invitationId);

      return NextResponse.json(
        {
          success: false,
          error: "This invitation has expired",
        },
        { status: 410 }
      );
    }

    // --------------------------------------------------
    // Get student-provided information
    // --------------------------------------------------

    const body = await request.json();

    const {
      password,
      confirmPassword,
    } = body;

    // --------------------------------------------------
    // Password validation
    // --------------------------------------------------

    if (!password || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Password and confirm password are required",
        },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Passwords do not match",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must contain at least 8 characters",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Check whether student already exists
    // --------------------------------------------------

    const { data: existingStudent } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("email", invitation.email)
      .maybeSingle();

    if (existingStudent) {
      return NextResponse.json(
        {
          success: false,
          error: "An account already exists with this email",
        },
        { status: 409 }
      );
    }

    // --------------------------------------------------
    // Create Supabase Auth account
    // --------------------------------------------------

    const {
      data: authData,
      error: authError,
    } = await supabase.auth.signUp({
      email: invitation.email,
      password,
      options: {
        data: {
          first_name: invitation.first_name,
          last_name: invitation.last_name,
          role: "student",
        },
      },
    });

    if (authError || !authData.user) {
      console.error(
        "Student account creation error:",
        authError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            authError?.message ||
            "Failed to create student account",
        },
        { status: 500 }
      );
    }

    const studentId = authData.user.id;

    // --------------------------------------------------
    // Create student profile
    // --------------------------------------------------

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: studentId,

        role: "student",

        first_name: invitation.first_name,

        last_name: invitation.last_name,

        email: invitation.email,

        phone: invitation.phone,

        school: invitation.school,

        form: invitation.form,

        curriculum: invitation.curriculum,

        subjects: invitation.subjects || [],

        gender: invitation.gender,

        date_of_birth: invitation.date_of_birth,

        address: invitation.address,

        tutor_id: invitation.tutor_id,
      });

    if (profileError) {
      console.error(
        "Student profile creation error:",
        profileError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Account created but student profile could not be created",
          details: profileError.message,
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // Mark invitation as accepted
    // --------------------------------------------------

    const { error: updateError } = await supabase
      .from("student_invitations")
      .update({
        status: "accepted",
        accepted_at: new Date().toISOString(),
        student_id: studentId,
      })
      .eq("id", invitationId);

    if (updateError) {
      console.error(
        "Invitation update error:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Student account created but invitation could not be finalized",
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // Success
    // --------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        message: "Student account created successfully",

        student: {
          id: studentId,
          firstName: invitation.first_name,
          lastName: invitation.last_name,
          email: invitation.email,
        },

        requiresEmailConfirmation:
          !authData.session,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/tutor/students/invite/[invitationId] error:",
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