import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  MessageSquare,
  TrendingUp,
} from "lucide-react"

import {
  requireRole,
} from "@/lib/auth/session"

import { StudentSidebar } from "../../components/student/StudentSidebar"

export default async function StudentDashboardPage() {
  const student =
    await requireRole([
      "student",
    ])

  const studentName =
    `${student.first_name || ""} ${student.last_name || ""}`.trim()

  return (
    <main className="min-h-screen bg-muted/30">

      <StudentSidebar />

      <div className="lg:pl-64">

        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">

          {/* Welcome */}
          <section className="mb-8">

            <p className="text-sm font-medium text-primary">
              Student Portal
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Welcome,{" "}
              {
                studentName ||
                "Student"
              }
            </h1>

            <p className="mt-2 text-muted-foreground">
              Manage your learning,
              lessons, assignments and
              academic progress from one
              place.
            </p>

          </section>

          {/* Overview */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border bg-background p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-muted-foreground">
                    My Subjects
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    0
                  </p>
                </div>

                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>

              </div>
            </div>

            <div className="rounded-2xl border bg-background p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-muted-foreground">
                    Upcoming Lessons
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    0
                  </p>
                </div>

                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <CalendarDays className="h-5 w-5" />
                </div>

              </div>
            </div>

            <div className="rounded-2xl border bg-background p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-muted-foreground">
                    Assignments
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    0
                  </p>
                </div>

                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <ClipboardCheck className="h-5 w-5" />
                </div>

              </div>
            </div>

            <div className="rounded-2xl border bg-background p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-muted-foreground">
                    Overall Progress
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    —
                  </p>
                </div>

                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <TrendingUp className="h-5 w-5" />
                </div>

              </div>
            </div>

          </section>

          {/* Account Status */}
          <section className="mb-8 rounded-2xl border bg-background p-6 shadow-sm">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Account Active
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Your GlobeDK Elite Academy
                    student account is active.
                  </p>
                </div>

              </div>

              <div className="rounded-lg bg-muted px-4 py-2 text-sm">
                {
                  student.email
                }
              </div>

            </div>

          </section>

          {/* Quick Actions */}
          <section>

            <div className="mb-4">

              <h2 className="text-xl font-semibold">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Quickly access the areas you
                use most.
              </p>

            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <a
                href="/student/subjects"
                className="group rounded-2xl border bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>

                <h3 className="font-semibold">
                  My Subjects
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  View your registered
                  subjects.
                </p>
              </a>

              <a
                href="/student/lessons"
                className="group rounded-2xl border bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <h3 className="font-semibold">
                  My Lessons
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Check upcoming and
                  previous lessons.
                </p>
              </a>

              <a
                href="/student/assignments"
                className="group rounded-2xl border bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ClipboardCheck className="h-5 w-5" />
                </div>

                <h3 className="font-semibold">
                  Assignments
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  View and complete your
                  assignments.
                </p>
              </a>

              <a
                href="/student/progress"
                className="group rounded-2xl border bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <TrendingUp className="h-5 w-5" />
                </div>

                <h3 className="font-semibold">
                  My Progress
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Track your academic
                  performance.
                </p>
              </a>

            </div>

          </section>

          {/* Empty State */}
          <section className="mt-8 rounded-2xl border border-dashed bg-background p-10 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <GraduationCap className="h-7 w-7 text-muted-foreground" />
            </div>

            <h2 className="mt-4 text-lg font-semibold">
              Your learning journey starts here
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
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