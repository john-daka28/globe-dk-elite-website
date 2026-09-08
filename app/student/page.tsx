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
const student =
await requireRole([
"student",
])

const studentName =
`${student.first_name || ""} ${student.last_name || ""}`.trim()

/*

* ============================================================
* LOAD ASSIGNED SUBJECTS
* ============================================================
*
* Subjects are stored through the student_subjects
* relationship table:
*
* users
* ↓
* student_subjects
* ↓
* subjects
*
* This means we do not need a "subjects" column
* inside the users table.
  */

const {
data: studentSubjectRows,
error: studentSubjectsError,
} =
await supabaseAdmin
.from("student_subjects")
.select(
`           subject_id,
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

if (studentSubjectsError) {
console.error(
"Student dashboard subjects error:",
studentSubjectsError
)
}

/*

* Supabase returns the related subject inside
* the "subjects" property.
*
* We only keep active subjects.
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

return ( <main className="min-h-screen bg-muted/30">

```
  {/* Sidebar */}
  <StudentSidebar />

  {/* Main Content */}
  <div className="lg:pl-64">

    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

      {/* ====================================================== */}
      {/* WELCOME */}
      {/* ====================================================== */}

      <section className="mb-6 sm:mb-8">

        <p className="text-sm font-medium text-primary">
          Student Portal
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome,{" "}
          {studentName || "Student"}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Manage your learning, lessons,
          assignments and academic progress
          from one place.
        </p>

      </section>


      {/* ====================================================== */}
      {/* OVERVIEW */}
      {/* ====================================================== */}

      <section className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4">

        {/* My Subjects */}
        <div className="rounded-2xl border bg-background p-4 shadow-sm sm:p-5">

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">

              <p className="text-xs text-muted-foreground sm:text-sm">
                My Subjects
              </p>

              <p className="mt-1 text-xl font-bold sm:text-2xl">
                {subjectCount}
              </p>

            </div>

            <div className="shrink-0 rounded-xl bg-primary/10 p-2.5 text-primary sm:p-3">

              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />

            </div>

          </div>

        </div>


        {/* Upcoming Lessons */}
        <div className="rounded-2xl border bg-background p-4 shadow-sm sm:p-5">

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">

              <p className="text-xs text-muted-foreground sm:text-sm">
                Upcoming Lessons
              </p>

              <p className="mt-1 text-xl font-bold sm:text-2xl">
                0
              </p>

            </div>

            <div className="shrink-0 rounded-xl bg-primary/10 p-2.5 text-primary sm:p-3">

              <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" />

            </div>

          </div>

        </div>


        {/* Assignments */}
        <div className="rounded-2xl border bg-background p-4 shadow-sm sm:p-5">

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">

              <p className="text-xs text-muted-foreground sm:text-sm">
                Assignments
              </p>

              <p className="mt-1 text-xl font-bold sm:text-2xl">
                0
              </p>

            </div>

            <div className="shrink-0 rounded-xl bg-primary/10 p-2.5 text-primary sm:p-3">

              <ClipboardCheck className="h-4 w-4 sm:h-5 sm:w-5" />

            </div>

          </div>

        </div>


        {/* Overall Progress */}
        <div className="rounded-2xl border bg-background p-4 shadow-sm sm:p-5">

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">

              <p className="text-xs text-muted-foreground sm:text-sm">
                Overall Progress
              </p>

              <p className="mt-1 text-xl font-bold sm:text-2xl">
                —
              </p>

            </div>

            <div className="shrink-0 rounded-xl bg-primary/10 p-2.5 text-primary sm:p-3">

              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* MY SUBJECTS */}
      {/* ====================================================== */}

      <section className="mb-6 rounded-2xl border bg-background p-4 shadow-sm sm:mb-8 sm:p-6">

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-semibold sm:text-xl">
              My Subjects
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Subjects currently assigned to your account.
            </p>

          </div>

          <Link
            href="/student/subjects"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>

        </div>


        {assignedSubjects.length > 0 ? (

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {assignedSubjects.map(
              (
                subject
              ) => (

                <div
                  key={
                    subject.id
                  }
                  className="rounded-xl border bg-muted/20 p-4 transition hover:bg-muted/40"
                >

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">

                      <BookOpen className="h-5 w-5" />

                    </div>

                    <div className="min-w-0">

                      <h3 className="font-semibold">

                        {subject.name}

                      </h3>

                      {subject.code && (

                        <p className="mt-1 text-xs font-medium text-muted-foreground">

                          {subject.code}

                        </p>

                      )}

                      {subject.level && (

                        <p className="mt-1 text-xs text-muted-foreground">

                          {subject.level}

                        </p>

                      )}

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="rounded-xl border border-dashed p-6 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">

              <BookOpen className="h-6 w-6 text-muted-foreground" />

            </div>

            <h3 className="mt-3 font-semibold">
              No subjects assigned yet
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm leading-5 text-muted-foreground">
              Your tutor has not assigned any subjects
              to your account yet. Once subjects are
              assigned, they will appear here.
            </p>

          </div>

        )}

      </section>


      {/* ====================================================== */}
      {/* ACCOUNT STATUS */}
      {/* ====================================================== */}

      <section className="mb-6 rounded-2xl border bg-background p-4 shadow-sm sm:mb-8 sm:p-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex min-w-0 items-start gap-3 sm:gap-4">

            {/* Status Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-600 sm:h-11 sm:w-11">

              <CheckCircle2 className="h-5 w-5" />

            </div>

            {/* Status Text */}
            <div className="min-w-0">

              <h2 className="font-semibold">
                Account Active
              </h2>

              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                Your GlobeDK Elite Academy
                student account is active.
              </p>

            </div>

          </div>


          {/* Email */}
          <div className="max-w-full break-all rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground sm:px-4 sm:text-sm">
            {student.email}
          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* QUICK ACTIONS */}
      {/* ====================================================== */}

      <section>

        <div className="mb-4">

          <h2 className="text-lg font-semibold sm:text-xl">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Quickly access the areas you
            use most.
          </p>

        </div>


        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">


          {/* My Subjects */}
          <Link
            href="/student/subjects"
            className="group rounded-2xl border bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] sm:p-5"
          >

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-11 sm:w-11">

              <BookOpen className="h-5 w-5" />

            </div>

            <h3 className="font-semibold">
              My Subjects
            </h3>

            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              View your registered
              subjects.
            </p>

          </Link>


          {/* My Lessons */}
          <Link
            href="/student/lessons"
            className="group rounded-2xl border bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] sm:p-5"
          >

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-11 sm:w-11">

              <CalendarDays className="h-5 w-5" />

            </div>

            <h3 className="font-semibold">
              My Lessons
            </h3>

            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Check upcoming and
              previous lessons.
            </p>

          </Link>


          {/* Assignments */}
          <Link
            href="/student/assignments"
            className="group rounded-2xl border bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] sm:p-5"
          >

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-11 sm:w-11">

              <ClipboardCheck className="h-5 w-5" />

            </div>

            <h3 className="font-semibold">
              Assignments
            </h3>

            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              View and complete your
              assignments.
            </p>

          </Link>


          {/* My Progress */}
          <Link
            href="/student/progress"
            className="group rounded-2xl border bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] sm:p-5"
          >

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-11 sm:w-11">

              <TrendingUp className="h-5 w-5" />

            </div>

            <h3 className="font-semibold">
              My Progress
            </h3>

            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Track your academic
              performance.
            </p>

          </Link>

        </div>

      </section>


      {/* ====================================================== */}
      {/* EMPTY STATE */}
      {/* ====================================================== */}

      {assignedSubjects.length === 0 && (

        <section className="mt-6 rounded-2xl border border-dashed bg-background p-6 text-center sm:mt-8 sm:p-10">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted sm:h-14 sm:w-14">

            <GraduationCap className="h-6 w-6 text-muted-foreground sm:h-7 sm:w-7" />

          </div>

          <h2 className="mt-4 text-base font-semibold sm:text-lg">
            Your learning journey starts here
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Your tutor will add subjects,
            lessons, assignments and
            learning resources to your
            account. Once they are
            available, they will appear
            here.
          </p>

        </section>

      )}

    </div>

  </div>

</main>


)
}
