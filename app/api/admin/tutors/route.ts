import {
  NextRequest,
  NextResponse,
} from "next/server"

import {
  supabaseAdmin,
} from "@/lib/supabaseAdmin"

import {
  requireRole,
} from "@/lib/auth/session"

import {
  generateSecureToken,
  hashToken,
  getTokenExpiry,
} from "@/lib/auth/token"

import {
  sendTutorInvitation,
} from "@/lib/email/sendTutorInvitation"

const VALID_LEVELS = [
  "O-Level",
  "A-Level",
]

const VALID_CURRICULA = [
  "ZIMSEC",
  "Cambridge",
]

type TutorAssignmentInput = {
  subject?: string
  level?: string
  curriculum?: string
}

type CreateTutorBody = {
  name?: string
  email?: string
  phone?: string
  assignments?: TutorAssignmentInput[]
}

function splitFullName(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) {
    return {
      firstName: "",
      lastName: "",
    }
  }

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      lastName: "",
    }
  }

  return {
    firstName: parts[0],
    lastName: parts
      .slice(1)
      .join(" "),
  }
}

function normalizeAssignments(
  assignments: TutorAssignmentInput[]
) {
  const normalized = assignments.map(
    (assignment) => ({
      subject:
        assignment.subject
          ?.trim() || "",
      level:
        assignment.level
          ?.trim() || "",
      curriculum:
        assignment.curriculum
          ?.trim() || "",
    })
  )

  const unique = new Map<
    string,
    {
      subject: string
      level: string
      curriculum: string
    }
  >()

  for (const assignment of normalized) {
    const key =
      `${assignment.subject.toLowerCase()}|` +
      `${assignment.level.toLowerCase()}|` +
      `${assignment.curriculum.toLowerCase()}`

    if (!unique.has(key)) {
      unique.set(key, assignment)
    }
  }

  return Array.from(unique.values())
}

function validateAssignments(
  assignments: TutorAssignmentInput[]
) {
  if (
    !Array.isArray(assignments) ||
    assignments.length === 0
  ) {
    return "At least one teaching assignment is required."
  }

  for (
    let index = 0;
    index < assignments.length;
    index++
  ) {
    const assignment =
      assignments[index]

    const subject =
      assignment.subject
        ?.trim() || ""

    const level =
      assignment.level
        ?.trim() || ""

    const curriculum =
      assignment.curriculum
        ?.trim() || ""

    if (!subject) {
      return `Teaching assignment ${index + 1} is missing a subject.`
    }

    if (!level) {
      return `Teaching assignment ${index + 1} is missing a level.`
    }

    if (
      !VALID_LEVELS.includes(level)
    ) {
      return `Teaching assignment ${index + 1} has an invalid level.`
    }

    if (!curriculum) {
      return `Teaching assignment ${index + 1} is missing a curriculum.`
    }

    if (
      !VALID_CURRICULA.includes(
        curriculum
      )
    ) {
      return `Teaching assignment ${index + 1} has an invalid curriculum.`
    }

    if (subject.length > 150) {
      return `Teaching assignment ${index + 1} has an invalid subject.`
    }
  }

  return null
}

export async function GET(
  _request: NextRequest
) {
  try {
    await requireRole([
      "admin",
      "administrator",
    ])

    const {
      data: tutors,
      error: tutorsError,
    } = await supabaseAdmin
      .from("users")
      .select(
        `
          id,
          email,
          first_name,
          last_name,
          phone,
          role,
          email_verified,
          created_at,
          updated_at,
          account_status
        `
      )
      .eq("role", "tutor")
      .order(
        "created_at",
        {
          ascending: false,
        }
      )

    if (tutorsError) {
      console.error(
        "GET tutors error:",
        tutorsError
      )

      return NextResponse.json(
        {
          error:
            "Unable to retrieve tutors.",
        },
        {
          status: 500,
        }
      )
    }

    const tutorIds =
      (tutors || []).map(
        (tutor) => tutor.id
      )

    let tutorSubjects: Array<{
      id: string
      tutor_id: string
      subject: string
      level: string
      curriculum: string
      created_at?: string
    }> = []

    if (tutorIds.length > 0) {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from("tutor_subjects")
        .select(
          `
            id,
            tutor_id,
            subject,
            level,
            curriculum,
            created_at
          `
        )
        .in(
          "tutor_id",
          tutorIds
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        )

      if (error) {
        console.error(
          "GET tutor subjects error:",
          error
        )

        return NextResponse.json(
          {
            error:
              "Unable to retrieve tutor academic assignments.",
          },
          {
            status: 500,
          }
        )
      }

      tutorSubjects =
        data || []
    }

    const result =
      (tutors || []).map(
        (tutor) => {
          const assignments =
            tutorSubjects
              .filter(
                (item) =>
                  item.tutor_id ===
                  tutor.id
              )
              .map(
                (item) => ({
                  id: item.id,
                  subject:
                    item.subject,
                  level:
                    item.level,
                  curriculum:
                    item.curriculum,
                })
              )

          const subjects =
            Array.from(
              new Set(
                assignments.map(
                  (item) =>
                    item.subject
                )
              )
            )

          const levels =
            Array.from(
              new Set(
                assignments.map(
                  (item) =>
                    item.level
                )
              )
            )

          const curricula =
            Array.from(
              new Set(
                assignments.map(
                  (item) =>
                    item.curriculum
                )
              )
            )

          const name =
            `${tutor.first_name || ""} ${
              tutor.last_name || ""
            }`.trim()

          let status:
            | "Active"
            | "Pending"
            | "Inactive"

          if (
            tutor.account_status ===
            "active"
          ) {
            status = "Active"
          } else if (
            tutor.account_status ===
            "invited"
          ) {
            status = "Pending"
          } else {
            status = "Inactive"
          }

          const firstInitial =
            tutor.first_name
              ?.trim()
              .charAt(0) || ""

          const lastInitial =
            tutor.last_name
              ?.trim()
              .charAt(0) || ""

          return {
            id: tutor.id,

            name:
              name ||
              "Unnamed Tutor",

            email:
              tutor.email || "",

            phone:
              tutor.phone || "",

            assignments,

            subjects,

            levels,

            curricula,

            students: 0,

            status,

            account_status:
              tutor.account_status,

            email_verified:
              tutor.email_verified,

            experience:
              "Not specified",

            joined:
              tutor.created_at
                ? new Date(
                    tutor.created_at
                  ).toLocaleDateString(
                    "en-ZW",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )
                : "Not specified",

            initials:
              `${firstInitial}${lastInitial}`
                .toUpperCase() ||
              "TU",

            created_at:
              tutor.created_at,

            updated_at:
              tutor.updated_at,
          }
        }
      )

    return NextResponse.json({
      tutors: result,
    })
  } catch (error) {
    console.error(
      "GET /api/admin/tutors error:",
      error
    )

    if (
      error instanceof Error &&
      error.message ===
        "UNAUTHENTICATED"
    ) {
      return NextResponse.json(
        {
          error:
            "You must be logged in as an administrator.",
        },
        {
          status: 401,
        }
      )
    }

    if (
      error instanceof Error &&
      error.message ===
        "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          error:
            "Only administrators can view tutors.",
        },
        {
          status: 403,
        }
      )
    }

    return NextResponse.json(
      {
        error:
          "Unable to retrieve tutors.",
      },
      {
        status: 500,
      }
    )
  }
}

export async function POST(
  request: NextRequest
) {
  let createdTutorId: string | null =
    null

  try {
    const admin =
      await requireRole([
        "admin",
        "administrator",
      ])

    if (
      admin.account_status !==
      "active"
    ) {
      return NextResponse.json(
        {
          error:
            "Your administrator account is not active.",
        },
        {
          status: 403,
        }
      )
    }

    const body =
      (await request.json()) as CreateTutorBody

    const name =
      body.name?.trim() || ""

    const email =
      body.email
        ?.trim()
        .toLowerCase() || ""

    const phone =
      body.phone?.trim() || null

    const assignments =
      body.assignments || []

    if (!name) {
      return NextResponse.json(
        {
          error:
            "Tutor name is required.",
        },
        {
          status: 400,
        }
      )
    }

    if (name.length > 120) {
      return NextResponse.json(
        {
          error:
            "Tutor name is too long.",
        },
        {
          status: 400,
        }
      )
    }

    if (!email) {
      return NextResponse.json(
        {
          error:
            "Tutor email is required.",
        },
        {
          status: 400,
        }
      )
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (
      !emailPattern.test(email)
    ) {
      return NextResponse.json(
        {
          error:
            "Please provide a valid email address.",
        },
        {
          status: 400,
        }
      )
    }

    if (
      phone &&
      phone.length > 40
    ) {
      return NextResponse.json(
        {
          error:
            "Phone number is too long.",
        },
        {
          status: 400,
        }
      )
    }

    const assignmentError =
      validateAssignments(
        assignments
      )

    if (assignmentError) {
      return NextResponse.json(
        {
          error:
            assignmentError,
        },
        {
          status: 400,
        }
      )
    }

    const normalizedAssignments =
      normalizeAssignments(
        assignments
      )

    const {
      firstName,
      lastName,
    } = splitFullName(name)

    if (!firstName) {
      return NextResponse.json(
        {
          error:
            "A valid tutor name is required.",
        },
        {
          status: 400,
        }
      )
    }

    const {
      data: existingUser,
      error: existingError,
    } =
      await supabaseAdmin
        .from("users")
        .select(
          `
            id,
            email,
            role,
            account_status
          `
        )
        .ilike(
          "email",
          email
        )
        .maybeSingle()

    if (existingError) {
      console.error(
        "Existing user lookup error:",
        existingError
      )

      return NextResponse.json(
        {
          error:
            "Could not check the existing user account.",
        },
        {
          status: 500,
        }
      )
    }

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "A user with this email address already exists.",
        },
        {
          status: 409,
        }
      )
    }

    const rawToken =
      generateSecureToken()

    const tokenHash =
      hashToken(rawToken)

    const tokenExpiry =
      getTokenExpiry(24)

    const {
      data: tutor,
      error: userError,
    } =
      await supabaseAdmin
        .from("users")
        .insert({
          email,

          password_hash:
            null,

          first_name:
            firstName,

          last_name:
            lastName,

          phone,

          role:
            "tutor",

          email_verified:
            false,

          verification_token:
            tokenHash,

          verification_token_expires_at:
            tokenExpiry.toISOString(),

          account_status:
            "invited",
        })
        .select(
          `
            id,
            email,
            first_name,
            last_name,
            role,
            account_status
          `
        )
        .single()

    if (
      userError ||
      !tutor
    ) {
      console.error(
        "Create tutor user error:",
        userError
      )

      if (
        userError?.code ===
        "23505"
      ) {
        return NextResponse.json(
          {
            error:
              "A user with this email address already exists.",
          },
          {
            status: 409,
          }
        )
      }

      return NextResponse.json(
        {
          error:
            "Failed to create tutor account.",
        },
        {
          status: 500,
        }
      )
    }

    createdTutorId =
      tutor.id

    const {
      error: subjectError,
    } =
      await supabaseAdmin
        .from("tutor_subjects")
        .insert(
          normalizedAssignments.map(
            (assignment) => ({
              tutor_id:
                tutor.id,

              subject:
                assignment.subject,

              level:
                assignment.level,

              curriculum:
                assignment.curriculum,
            })
          )
        )

    if (subjectError) {
      console.error(
        "Tutor assignments creation error:",
        subjectError
      )

      await supabaseAdmin
        .from("tutor_subjects")
        .delete()
        .eq(
          "tutor_id",
          tutor.id
        )

      await supabaseAdmin
        .from("users")
        .delete()
        .eq(
          "id",
          tutor.id
        )

      return NextResponse.json(
        {
          error:
            "Tutor was not created because the teaching assignments could not be saved.",
        },
        {
          status: 500,
        }
      )
    }

    try {
      await sendTutorInvitation({
        firstName,
        email,
        token: rawToken,
      })
    } catch (emailError) {
      console.error(
        "Tutor invitation email error:",
        emailError
      )

      await supabaseAdmin
        .from("tutor_subjects")
        .delete()
        .eq(
          "tutor_id",
          tutor.id
        )

      await supabaseAdmin
        .from("users")
        .delete()
        .eq(
          "id",
          tutor.id
        )

      return NextResponse.json(
        {
          error:
            "Tutor account could not be completed because the invitation email failed to send.",
        },
        {
          status: 502,
        }
      )
    }

    return NextResponse.json(
      {
        success: true,

        message:
          "Tutor account created and invitation email sent.",

        tutor: {
          id:
            tutor.id,

          name:
            `${tutor.first_name} ${tutor.last_name}`
              .trim(),

          email:
            tutor.email,

          firstName:
            tutor.first_name,

          lastName:
            tutor.last_name,

          role:
            tutor.role,

          accountStatus:
            tutor.account_status,

          assignments:
            normalizedAssignments,
        },
      },
      {
        status: 201,
      }
    )
  } catch (error) {
    console.error(
      "POST /api/admin/tutors error:",
      error
    )

    if (
      createdTutorId
    ) {
      await supabaseAdmin
        .from("tutor_subjects")
        .delete()
        .eq(
          "tutor_id",
          createdTutorId
        )

      await supabaseAdmin
        .from("users")
        .delete()
        .eq(
          "id",
          createdTutorId
        )
    }

    if (
      error instanceof Error &&
      error.message ===
        "UNAUTHENTICATED"
    ) {
      return NextResponse.json(
        {
          error:
            "You must be logged in as an administrator.",
        },
        {
          status: 401,
        }
      )
    }

    if (
      error instanceof Error &&
      error.message ===
        "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          error:
            "Only administrators can create tutor accounts.",
        },
        {
          status: 403,
        }
      )
    }

    return NextResponse.json(
      {
        error:
          "An unexpected server error occurred.",
      },
      {
        status: 500,
      }
    )
  }
}