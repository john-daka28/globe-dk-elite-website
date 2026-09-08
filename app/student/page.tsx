
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
  StudentSidebar,
} from "../../components/student/StudentSidebar"

export default async function StudentDashboardPage() {
  const student =
    await requireRole([
      "student",
    ])

  const studentName =
    `${student.first_name || ""} ${student.last_name || ""}`.trim()

  return (
    <main className="min-h-screen bg-muted/30">

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
                    0
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

        </div>

      </div>

    </main>
  )
}
