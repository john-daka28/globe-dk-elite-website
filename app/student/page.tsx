import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  TrendingUp,
} from "lucide-react"

import Link from "next/link"

import {
  requireRole,
} from "@/lib/auth/session"

import {
  supabaseAdmin,
} from "@/lib/supabaseAdmin"

import {
  StudentSidebar,
} from "../../components/student/StudentSidebar"

type StudentSubject = {
  id: string
  name: string
  code: string | null
  description: string | null
  level: string | null
  is_active: boolean
  syllabus: string | null
  price: number | null
}

export default async function StudentDashboardPage() {
  /*
   * ============================================================
   * SESSION / AUTHENTICATION
   * ============================================================
   *
   * Only logged-in students can access this page.
   *
   * requireRole() also gives us the currently logged-in
   * student's information.
   */

  const student =
    await requireRole([
      "student",
    ])

  const studentName =
    `${student.first_name || ""} ${student.last_name || ""}`.trim()

  /*
   * ============================================================
   * LOAD STUDENT'S ASSIGNED SUBJECTS
   * ============================================================
   *
   * Relationship:
   *
   * users
   *   ↓
   * student_subjects
   *   ↓
   * subjects
   *
   * We use the logged-in student's ID.
   */

  const {
    data: studentSubjectRows,
    error: studentSubjectsError,
  } =
    await supabaseAdmin
      .from("student_subjects")
      .select(
        `
          subject_id,
          subjects (
            id,
            name,
            code,
            description,
            level,
            is_active,
            syllabus,
            price
          )
        `
      )
      .eq(
        "student_id",
        student.id
      )

  /*
   * ============================================================
   * DATABASE ERROR
   * ============================================================
   */

  if (studentSubjectsError) {
    console.error(
      "Student dashboard subjects error:",
      studentSubjectsError
    )
  }

  /*
   * ============================================================
   * EXTRACT ACTIVE SUBJECTS
   * ============================================================
   */

  const assignedSubjects: StudentSubject[] =
    (
      studentSubjectRows || []
    )
      .map(
        (
          row: any
        ) =>
          row.subjects
      )
      .filter(
        (
          subject: StudentSubject | null
        ): subject is StudentSubject =>
          Boolean(
            subject &&
            subject.is_active
          )
      )

  const subjectCount =
    assignedSubjects.length

  /*
   * ============================================================
   * PAGE
   * ============================================================
   */

  return (
    <main className="min-h-screen bg-muted/30">

      {/* ======================================================
          SIDEBAR
          ====================================================== */}

      <StudentSidebar />

      {/* ======================================================
          MAIN CONTENT
          ====================================================== */}

      <div className="lg:pl-64">

        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

          {/* ==================================================
              WELCOME HEADER
              ================================================== */}

          <section className="mb-6 sm:mb-8">

            <div className="rounded-2xl border bg-background p-5 shadow-sm sm:p-7">

              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                <div>

                  <p className="text-sm font-medium text-primary">
                    Student Portal
                  </p>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                    Welcome back,{" "}
                    {student.first_name || "Student"}!
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                    Welcome to your GlobeDK Elite Academy
                    student dashboard. Manage your subjects,
                    lessons, assignments and academic progress
                    from here.
                  </p>

                </div>

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">

                  <GraduationCap className="h-8 w-8" />

                </div>

              </div>

            </div>

          </section>


          {/* ==================================================
              OVERVIEW
              ================================================== */}

          <section className="mb-6 sm:mb-8">

            <div className="mb-4">

              <h2 className="text-lg font-semibold sm:text-xl">
                Overview
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                A quick look at your student account.
              </p>

            </div>


            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* ==================================================
                  MY SUBJECTS
                  ================================================== */}

              <Link
                href="/student/subjects"
                className="group rounded-2xl border bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">

                    <BookOpen className="h-5 w-5" />

                  </div>

                  <span className="text-xs font-medium text-muted-foreground">
                    View
                  </span>

                </div>

                <div className="mt-5">

                  <p className="text-sm text-muted-foreground">
                    My Subjects
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {subjectCount}
                  </p>

                </div>

              </Link>


              {/* ==================================================
                  UPCOMING LESSONS
                  ================================================== */}

              <Link
                href="/student/lessons"
                className="group rounded-2xl border bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">

                    <CalendarDays className="h-5 w-5" />

                  </div>

                  <span className="text-xs font-medium text-muted-foreground">
                    View
                  </span>

                </div>

                <div className="mt-5">

                  <p className="text-sm text-muted-foreground">
                    Upcoming Lessons
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    0
                  </p>

                </div>

              </Link>


              {/* ==================================================
                  ASSIGNMENTS
                  ================================================== */}

              <Link
                href="/student/assignments"
                className="group rounded-2xl border bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">

                    <ClipboardCheck className="h-5 w-5" />

                  </div>

                  <span className="text-xs font-medium text-muted-foreground">
                    View
                  </span>

                </div>

                <div className="mt-5">

                  <p className="text-sm text-muted-foreground">
                    Assignments
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    0
                  </p>

                </div>

              </Link>


              {/* ==================================================
                  OVERALL PROGRESS
                  ================================================== */}

              <Link
                href="/student/progress"
                className="group rounded-2xl border bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">

                    <TrendingUp className="h-5 w-5" />

                  </div>

                  <span className="text-xs font-medium text-muted-foreground">
                    View
                  </span>

                </div>

                <div className="mt-5">

                  <p className="text-sm text-muted-foreground">
                    Overall Progress
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    —
                  </p>

                </div>

              </Link>

            </div>

          </section>


          {/* ==================================================
              MY SUBJECTS
              ================================================== */}

          <section className="mb-6 sm:mb-8">

            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <h2 className="text-lg font-semibold sm:text-xl">
                  My Subjects
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Subjects currently assigned to your account.
                </p>

              </div>

              {subjectCount > 0 && (
                <Link
                  href="/student/subjects"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View all subjects
                </Link>
              )}

            </div>


            {assignedSubjects.length > 0 ? (

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {assignedSubjects
                  .slice(0, 6)
                  .map(
                    (
                      subject
                    ) => (

                      <Link
                        key={subject.id}
                        href="/student/subjects"
                        className="group rounded-2xl border bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >

                        <div className="flex items-start gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">

                            <BookOpen className="h-5 w-5" />

                          </div>

                          <div className="min-w-0">

                            <h3 className="font-semibold leading-5">
                              {subject.name}
                            </h3>

                            {subject.code && (
                              <p className="mt-1 text-xs font-medium text-muted-foreground">
                                {subject.code}
                              </p>
                            )}

                          </div>

                        </div>


                        <div className="mt-4 flex items-center justify-between">

                          <span className="text-sm text-muted-foreground">
                            {subject.level || "Level not specified"}
                          </span>

                          <span className="text-sm font-medium text-primary">
                            View
                          </span>

                        </div>

                      </Link>

                    )
                  )}

              </div>

            ) : (

              <div className="rounded-2xl border border-dashed bg-background p-8 text-center shadow-sm sm:p-10">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">

                  <BookOpen className="h-7 w-7 text-muted-foreground" />

                </div>

                <h3 className="mt-4 text-lg font-semibold">
                  No subjects assigned yet
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                  Your tutor has not assigned any subjects
                  to your account yet. Once subjects are
                  assigned, they will appear here.
                </p>

                <Link
                  href="/student/subjects"
                  className="mt-5 inline-flex items-center justify-center rounded-xl border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                >
                  Go to My Subjects
                </Link>

              </div>

            )}

          </section>


          {/* ==================================================
              STUDENT INFORMATION
              ================================================== */}

          <section className="mb-6 sm:mb-8">

            <div className="rounded-2xl border bg-background p-5 shadow-sm sm:p-6">

              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                {/* Student */}

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">

                    <GraduationCap className="h-5 w-5" />

                  </div>

                  <div>

                    <p className="text-xs text-muted-foreground">
                      Student
                    </p>

                    <p className="font-semibold">
                      {studentName || "Student"}
                    </p>

                  </div>

                </div>


                {/* Account Status */}

                <div className="flex items-center gap-3">

                  <CheckCircle2 className="h-5 w-5 text-green-600" />

                  <div>

                    <p className="text-xs text-muted-foreground">
                      Account Status
                    </p>

                    <p className="text-sm font-semibold capitalize">
                      {student.account_status || "Active"}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* ==================================================
              QUICK ACTIONS
              ================================================== */}

          <section>

            <div className="mb-4">

              <h2 className="text-lg font-semibold sm:text-xl">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Quickly access your student tools.
              </p>

            </div>


            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <Link
                href="/student/subjects"
                className="rounded-xl border bg-background px-4 py-3 text-sm font-medium shadow-sm transition hover:bg-muted"
              >
                View My Subjects
              </Link>

              <Link
                href="/student/lessons"
                className="rounded-xl border bg-background px-4 py-3 text-sm font-medium shadow-sm transition hover:bg-muted"
              >
                View Lessons
              </Link>

              <Link
                href="/student/assignments"
                className="rounded-xl border bg-background px-4 py-3 text-sm font-medium shadow-sm transition hover:bg-muted"
              >
                View Assignments
              </Link>

              <Link
                href="/student/progress"
                className="rounded-xl border bg-background px-4 py-3 text-sm font-medium shadow-sm transition hover:bg-muted"
              >
                View Progress
              </Link>

            </div>

          </section>

        </div>

      </div>

    </main>
  )
}