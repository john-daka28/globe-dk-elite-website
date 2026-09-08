import {
  NextRequest,
  NextResponse,
} from "next/server"

import {
  requireRole,
} from "@/lib/auth/session"

import {
  supabaseAdmin,
} from "@/lib/supabaseAdmin"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

type UpdateStudentBody = {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  level?: string
  school?: string
  guardian_name?: string
  guardian_phone?: string
  account_status?: string
  subject_ids?: string[]
}

type ExistingStudent = {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  level: string | null
  school: string | null
  guardian_name: string | null
  guardian_phone: string | null
  role: string
  email_verified: boolean
  account_status: string
  created_at: string
}

type ExistingSubjectAssignment = {
  subject_id: string
}

function cleanText(
  value: unknown
): string {
  return String(value || "").trim()
}

function isValidUUID(
  value: string
): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value.trim()
  )
}

function isValidEmail(
  email: string
): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  )
}

function normalizeSubjectIds(
  value: unknown
): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return [
    ...new Set(
      value
        .filter(
          (
            subjectId
          ): subjectId is string =>
            typeof subjectId ===
              "string" &&
            subjectId.trim() !== ""
        )
        .map(
          (
            subjectId
          ) =>
            subjectId.trim()
        )
    ),
  ]
}

async function verifyTutorOwnsStudent(
  tutorId: string,
  studentId: string
) {
  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from("tutor_students")
      .select(
        "id,tutor_id,student_id"
      )
      .eq(
        "tutor_id",
        tutorId
      )
      .eq(
        "student_id",
        studentId
      )
      .maybeSingle()

  if (error) {
    console.error(
      "Tutor student ownership check error:",
      error
    )

    throw new Error(
      "Unable to verify student ownership."
    )
  }

  return data
}

async function validateSubjectIds(
  subjectIds: string[],
  level: string
) {
  if (
    subjectIds.length ===
    0
  ) {
    return {
      valid: true,
      subjects: [],
      error: null,
    }
  }

  const invalidUuid =
    subjectIds.some(
      (
        subjectId
      ) =>
        !isValidUUID(
          subjectId
        )
    )

  if (invalidUuid) {
    return {
      valid: false,
      subjects: [],
      error:
        "One or more selected subjects have an invalid ID.",
    }
  }

  const {
    data: selectedSubjects,
    error: subjectError,
  } =
    await supabaseAdmin
      .from("subjects")
      .select(
        "id,name,code,level,is_active"
      )
      .in(
        "id",
        subjectIds
      )

  if (subjectError) {
    console.error(
      "Subject validation error:",
      subjectError
    )

    return {
      valid: false,
      subjects: [],
      error:
        "Unable to validate selected subjects.",
    }
  }

  if (
    !selectedSubjects ||
    selectedSubjects.length !==
      subjectIds.length
  ) {
    return {
      valid: false,
      subjects: [],
      error:
        "One or more selected subjects could not be found.",
    }
  }

  const invalidSubject =
    selectedSubjects.find(
      (subject) =>
        !subject.is_active ||
        (
          subject.level &&
          subject.level !==
            level
        )
    )

  if (invalidSubject) {
    return {
      valid: false,
      subjects: [],
      error:
        "One or more selected subjects are inactive or do not match the student's level.",
    }
  }

  return {
    valid: true,
    subjects:
      selectedSubjects,
    error: null,
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const tutor =
      await requireRole([
        "tutor",
      ])

    const {
      id,
    } = await context.params

    if (!isValidUUID(id)) {
      return NextResponse.json(
        {
          error:
            "Invalid student ID.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Security check:
     *
     * The tutor can only update students
     * assigned to that tutor.
     */
    const relationship =
      await verifyTutorOwnsStudent(
        tutor.id,
        id
      )

    if (!relationship) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to manage this student.",
        },
        {
          status: 403,
        }
      )
    }

    /*
     * Load the existing student.
     */
    const {
      data: existingStudent,
      error:
        existingStudentError,
    } =
      await supabaseAdmin
        .from("users")
        .select(
          "id,email,first_name,last_name,phone,level,school,guardian_name,guardian_phone,role,email_verified,account_status,created_at"
        )
        .eq(
          "id",
          id
        )
        .eq(
          "role",
          "student"
        )
        .maybeSingle()

    if (existingStudentError) {
      console.error(
        "Existing student lookup error:",
        existingStudentError
      )

      return NextResponse.json(
        {
          error:
            "Unable to find student.",
        },
        {
          status: 500,
        }
      )
    }

    if (!existingStudent) {
      return NextResponse.json(
        {
          error:
            "Student not found.",
        },
        {
          status: 404,
        }
      )
    }

    const typedExistingStudent =
      existingStudent as ExistingStudent

    /*
     * Get the student's current subject assignments.
     *
     * We keep these so that if updating the student
     * succeeds but updating subjects fails, we can
     * restore the previous subject assignments.
     */
    const {
      data:
        existingAssignments,
      error:
        existingAssignmentsError,
    } =
      await supabaseAdmin
        .from("student_subjects")
        .select(
          "subject_id"
        )
        .eq(
          "student_id",
          id
        )

    if (existingAssignmentsError) {
      console.error(
        "Existing student subjects lookup error:",
        existingAssignmentsError
      )

      return NextResponse.json(
        {
          error:
            "Unable to load the student's subjects.",
        },
        {
          status: 500,
        }
      )
    }

    const previousSubjectIds =
      (
        existingAssignments ||
        []
      ).map(
        (
          assignment
        ) =>
          (
            assignment as ExistingSubjectAssignment
          ).subject_id
      )

    /*
     * Read request body.
     */
    const body =
      (await request.json()) as UpdateStudentBody

    const firstName =
      body.first_name !==
      undefined
        ? cleanText(
            body.first_name
          )
        : undefined

    const lastName =
      body.last_name !==
      undefined
        ? cleanText(
            body.last_name
          )
        : undefined

    const email =
      body.email !==
      undefined
        ? cleanText(
            body.email
          ).toLowerCase()
        : undefined

    const phone =
      body.phone !==
      undefined
        ? cleanText(
            body.phone
          )
        : undefined

    const level =
      body.level !==
      undefined
        ? cleanText(
            body.level
          )
        : undefined

    const school =
      body.school !==
      undefined
        ? cleanText(
            body.school
          )
        : undefined

    const guardianName =
      body.guardian_name !==
      undefined
        ? cleanText(
            body.guardian_name
          )
        : undefined

    const guardianPhone =
      body.guardian_phone !==
      undefined
        ? cleanText(
            body.guardian_phone
          )
        : undefined

    const accountStatus =
      body.account_status !==
      undefined
        ? cleanText(
            body.account_status
          )
        : undefined

    /*
     * IMPORTANT:
     *
     * subject_ids is optional.
     *
     * This allows status-only updates such as:
     *
     * {
     *   account_status: "disabled"
     * }
     *
     * without requiring subjects.
     */
    const hasSubjectUpdate =
      Object.prototype.hasOwnProperty.call(
        body,
        "subject_ids"
      )

    const subjectIds =
      hasSubjectUpdate
        ? normalizeSubjectIds(
            body.subject_ids
          )
        : undefined

    /*
     * Validate names.
     */
    if (
      firstName !==
        undefined &&
      !firstName
    ) {
      return NextResponse.json(
        {
          error:
            "First name cannot be empty.",
        },
        {
          status: 400,
        }
      )
    }

    if (
      lastName !==
        undefined &&
      !lastName
    ) {
      return NextResponse.json(
        {
          error:
            "Last name cannot be empty.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Validate email.
     */
    if (
      email !==
      undefined
    ) {
      if (!email) {
        return NextResponse.json(
          {
            error:
              "Email cannot be empty.",
          },
          {
            status: 400,
          }
        )
      }

      if (
        !isValidEmail(
          email
        )
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
    }

    /*
     * Validate level.
     */
    if (
      level !==
        undefined &&
      !level
    ) {
      return NextResponse.json(
        {
          error:
            "Student level cannot be empty.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Only allow the levels used by the
     * student management system.
     */
    if (
      level !==
        undefined &&
      ![
        "O-Level",
        "A-Level",
      ].includes(level)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid student level.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Validate account status.
     *
     * Tutors cannot change the role.
     */
    if (
      accountStatus !==
        undefined &&
      ![
        "active",
        "disabled",
        "suspended",
      ].includes(
        accountStatus
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid student account status.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * If email changes, make sure no other
     * account already uses that email.
     */
    if (
      email !==
        undefined &&
      email.toLowerCase() !==
        typedExistingStudent.email.toLowerCase()
    ) {
      const {
        data:
          duplicateUser,
        error:
          duplicateError,
      } =
        await supabaseAdmin
          .from("users")
          .select(
            "id"
          )
          .ilike(
            "email",
            email
          )
          .neq(
            "id",
            id
          )
          .maybeSingle()

      if (duplicateError) {
        console.error(
          "Student email duplicate check error:",
          duplicateError
        )

        return NextResponse.json(
          {
            error:
              "Unable to validate the email address.",
          },
          {
            status: 500,
          }
        )
      }

      if (duplicateUser) {
        return NextResponse.json(
          {
            error:
              "Another account already uses this email address.",
          },
          {
            status: 409,
          }
        )
      }
    }

    /*
     * Determine the final level.
     *
     * This is important when subjects are being
     * updated at the same time as the level.
     */
    const finalLevel =
      level !==
      undefined
        ? level
        : typedExistingStudent.level

    /*
     * Validate selected subjects.
     *
     * If subject_ids was supplied by the frontend,
     * the submitted list becomes the complete list
     * of subjects for this student.
     */
    if (
      hasSubjectUpdate
    ) {
      const subjectValidation =
        await validateSubjectIds(
          subjectIds || [],
          finalLevel ||
            ""
        )

      if (
        !subjectValidation.valid
      ) {
        return NextResponse.json(
          {
            error:
              subjectValidation.error ||
              "Invalid subjects.",
          },
          {
            status: 400,
          }
        )
      }
    }

    /*
     * Build user update.
     */
    const updateData: Record<
      string,
      unknown
    > = {}

    if (
      firstName !==
      undefined
    ) {
      updateData.first_name =
        firstName
    }

    if (
      lastName !==
      undefined
    ) {
      updateData.last_name =
        lastName
    }

    if (
      email !==
      undefined
    ) {
      updateData.email =
        email
    }

    if (
      phone !==
      undefined
    ) {
      updateData.phone =
        phone || null
    }

    if (
      level !==
      undefined
    ) {
      updateData.level =
        level
    }

    if (
      school !==
      undefined
    ) {
      updateData.school =
        school || null
    }

    if (
      guardianName !==
      undefined
    ) {
      updateData.guardian_name =
        guardianName ||
        null
    }

    if (
      guardianPhone !==
      undefined
    ) {
      updateData.guardian_phone =
        guardianPhone ||
        null
    }

    if (
      accountStatus !==
      undefined
    ) {
      updateData.account_status =
        accountStatus
    }

    /*
     * If nothing was supplied at all,
     * reject the request.
     *
     * subject_ids counts as a valid update
     * even if the student is being changed to
     * have zero subjects.
     */
    if (
      Object.keys(
        updateData
      ).length === 0 &&
      !hasSubjectUpdate
    ) {
      return NextResponse.json(
        {
          error:
            "No changes were provided.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Update student information first.
     */
    let updatedStudent:
      ExistingStudent | null =
      null

    if (
      Object.keys(
        updateData
      ).length > 0
    ) {
      const {
        data,
        error:
          updateError,
      } =
        await supabaseAdmin
          .from("users")
          .update(
            updateData
          )
          .eq(
            "id",
            id
          )
          .eq(
            "role",
            "student"
          )
          .select(
            "id,email,first_name,last_name,phone,level,school,guardian_name,guardian_phone,role,email_verified,account_status,created_at"
          )
          .single()

      if (updateError) {
        console.error(
          "Update student error:",
          updateError
        )

        return NextResponse.json(
          {
            error:
              "Unable to update student.",
          },
          {
            status: 500,
          }
        )
      }

      updatedStudent =
        data as ExistingStudent
    } else {
      updatedStudent =
        typedExistingStudent
    }

    /*
     * Update subjects only when the frontend
     * explicitly sends subject_ids.
     *
     * Example:
     *
     * subject_ids: [
     *   "uuid-1",
     *   "uuid-2"
     * ]
     *
     * means those are now the student's
     * complete subject list.
     *
     * subject_ids: []
     *
     * means the student takes no subjects.
     */
    if (
      hasSubjectUpdate
    ) {
      /*
       * Delete current assignments first.
       */
      const {
        error:
          deleteSubjectsError,
      } =
        await supabaseAdmin
          .from("student_subjects")
          .delete()
          .eq(
            "student_id",
            id
          )

      if (
        deleteSubjectsError
      ) {
        console.error(
          "Delete old student subjects error:",
          deleteSubjectsError
        )

        /*
         * Best-effort rollback of the student
         * information update.
         */
        if (
          Object.keys(
            updateData
          ).length > 0
        ) {
          await supabaseAdmin
            .from("users")
            .update({
              first_name:
                typedExistingStudent.first_name,
              last_name:
                typedExistingStudent.last_name,
              email:
                typedExistingStudent.email,
              phone:
                typedExistingStudent.phone,
              level:
                typedExistingStudent.level,
              school:
                typedExistingStudent.school,
              guardian_name:
                typedExistingStudent.guardian_name,
              guardian_phone:
                typedExistingStudent.guardian_phone,
              account_status:
                typedExistingStudent.account_status,
            })
            .eq(
              "id",
              id
            )
        }

        return NextResponse.json(
          {
            error:
              "Unable to update the student's subjects.",
          },
          {
            status: 500,
          }
        )
      }

      /*
       * Insert the new subject assignments.
       */
      if (
        subjectIds &&
        subjectIds.length > 0
      ) {
        const subjectRows =
          subjectIds.map(
            (
              subjectId
            ) => ({
              student_id:
                id,
              subject_id:
                subjectId,
            })
          )

        const {
          error:
            insertSubjectsError,
        } =
          await supabaseAdmin
            .from(
              "student_subjects"
            )
            .insert(
              subjectRows
            )

        if (
          insertSubjectsError
        ) {
          console.error(
            "Insert student subjects error:",
            insertSubjectsError
          )

          /*
           * Best-effort restoration
           * of previous subject assignments.
           */
          if (
            previousSubjectIds.length >
            0
          ) {
            await supabaseAdmin
              .from(
                "student_subjects"
              )
              .insert(
                previousSubjectIds.map(
                  (
                    subjectId
                  ) => ({
                    student_id:
                      id,
                    subject_id:
                      subjectId,
                  })
                )
              )
          }

          /*
           * Best-effort rollback of student
           * information.
           */
          if (
            Object.keys(
              updateData
            ).length > 0
          ) {
            await supabaseAdmin
              .from("users")
              .update({
                first_name:
                  typedExistingStudent.first_name,
                last_name:
                  typedExistingStudent.last_name,
                email:
                  typedExistingStudent.email,
                phone:
                  typedExistingStudent.phone,
                level:
                  typedExistingStudent.level,
                school:
                  typedExistingStudent.school,
                guardian_name:
                  typedExistingStudent.guardian_name,
                guardian_phone:
                  typedExistingStudent.guardian_phone,
                account_status:
                  typedExistingStudent.account_status,
              })
              .eq(
                "id",
                id
              )
          }

          return NextResponse.json(
            {
              error:
                "Unable to save the student's subjects.",
            },
            {
              status: 500,
            }
          )
        }
      }
    }

    /*
     * Return the updated student.
     */
    return NextResponse.json(
      {
        success: true,
        student:
          updatedStudent,
        subject_ids:
          hasSubjectUpdate
            ? subjectIds
            : previousSubjectIds,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Tutor student PATCH error:",
      error
    )

    if (
      error instanceof Error &&
      error.message ===
        "Unable to verify student ownership."
    ) {
      return NextResponse.json(
        {
          error:
            error.message,
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(
      {
        error:
          "You are not authorized to update this student.",
      },
      {
        status: 401,
      }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const tutor =
      await requireRole([
        "tutor",
      ])

    const {
      id,
    } = await context.params

    if (!isValidUUID(id)) {
      return NextResponse.json(
        {
          error:
            "Invalid student ID.",
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Security:
     *
     * The tutor can only delete a student
     * assigned to that tutor.
     */
    const relationship =
      await verifyTutorOwnsStudent(
        tutor.id,
        id
      )

    if (!relationship) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to remove this student.",
        },
        {
          status: 403,
        }
      )
    }

    /*
     * Confirm that the account exists
     * and belongs to a student.
     */
    const {
      data: student,
      error:
        studentLookupError,
    } =
      await supabaseAdmin
        .from("users")
        .select(
          "id,first_name,last_name,email,role"
        )
        .eq(
          "id",
          id
        )
        .eq(
          "role",
          "student"
        )
        .maybeSingle()

    if (studentLookupError) {
      console.error(
        "Student delete lookup error:",
        studentLookupError
      )

      return NextResponse.json(
        {
          error:
            "Unable to find student.",
        },
        {
          status: 500,
        }
      )
    }

    if (!student) {
      return NextResponse.json(
        {
          error:
            "Student not found.",
        },
        {
          status: 404,
        }
      )
    }

    /*
     * Delete subject assignments first.
     *
     * This is explicit even if the database
     * foreign key also has ON DELETE CASCADE.
     *
     * Therefore the student will not leave
     * orphaned student_subjects records.
     */
    const {
      error:
        subjectDeleteError,
    } =
      await supabaseAdmin
        .from("student_subjects")
        .delete()
        .eq(
          "student_id",
          id
        )

    if (
      subjectDeleteError
    ) {
      console.error(
        "Delete student subject assignments error:",
        subjectDeleteError
      )

      return NextResponse.json(
        {
          error:
            "Unable to remove the student's subject assignments.",
        },
        {
          status: 500,
        }
      )
    }

    /*
     * Delete the tutor/student relationship.
     *
     * We do this before deleting the account.
     */
    const {
      error:
        relationshipDeleteError,
    } =
      await supabaseAdmin
        .from("tutor_students")
        .delete()
        .eq(
          "id",
          relationship.id
        )
        .eq(
          "tutor_id",
          tutor.id
        )
        .eq(
          "student_id",
          id
        )

    if (
      relationshipDeleteError
    ) {
      console.error(
        "Delete tutor student relationship error:",
        relationshipDeleteError
      )

      return NextResponse.json(
        {
          error:
            "Unable to remove student from your student list.",
        },
        {
          status: 500,
        }
      )
    }

    /*
     * Delete the student account.
     *
     * This follows the current system design
     * where the student account belongs to
     * this tutor.
     */
    const {
      error:
        deleteStudentError,
    } =
      await supabaseAdmin
        .from("users")
        .delete()
        .eq(
          "id",
          id
        )
        .eq(
          "role",
          "student"
        )

    if (
      deleteStudentError
    ) {
      console.error(
        "Delete student account error:",
        deleteStudentError
      )

      return NextResponse.json(
        {
          error:
            "Student relationship was removed, but the account could not be deleted.",
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Student deleted successfully.",
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Tutor student DELETE error:",
      error
    )

    return NextResponse.json(
      {
        error:
          "You are not authorized to delete this student.",
      },
      {
        status: 401,
      }
    )
  }
}