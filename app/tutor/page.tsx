
import {
  BookOpen,
  CalendarDays,
  Users,
} from "lucide-react"

import { redirect } from "next/navigation"

import TutorSidebar from "@/components/tutor/TutorSidebar"

import {
  requireRole,
} from "@/lib/auth/session"

import {
  supabaseAdmin,
} from "@/lib/supabaseAdmin"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function TutorDashboard() {
  const tutor =
    await requireRole([
      "tutor",
    ]).catch(() => null)

  if (!tutor) {
    redirect("/login")
  }

  const {
    data: assignments,
  } =
    await supabaseAdmin
      .from("tutor_subjects")
      .select(
        "id,subject,level,curriculum"
      )
      .eq(
        "tutor_id",
        tutor.id
      )
      .order(
        "subject",
        {
          ascending: true,
        }
      )

  const subjects =
    assignments || []

  const tutorName =
    `${tutor.first_name || ""} ${
      tutor.last_name || ""
    }`.trim()

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Tutor Sidebar */}
      <TutorSidebar
        tutorName={
          tutorName ||
          "Tutor"
        }
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <header className="border-b bg-background lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <div>
              <p className="font-bold">
                GlobeDK Elite Academy
              </p>

              <p className="text-xs text-muted-foreground">
                Tutor Portal
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {tutorName
                ? tutorName
                    .split(" ")
                    .map(
                      (name) =>
                        name[0]
                    )
                    .join("")
                    .slice(
                      0,
                      2
                    )
                    .toUpperCase()
                : "T"}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          {/* Welcome Section */}
          <section className="mb-8">
            <p className="text-sm font-medium text-primary">
              Tutor Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Welcome,{" "}
              {tutor.first_name}
            </h1>

            <p className="mt-2 max-w-2xl text-muted-foreground">
              Manage your GlobeDK
              teaching activities,
              assigned students,
              lessons and
              academic programmes
              from your tutor
              portal.
            </p>
          </section>

          {/* Dashboard Statistics */}
          <section className="grid gap-4 md:grid-cols-3">
            {/* Academic Assignments */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Academic Assignments
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {
                        subjects.length
                      }
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Subjects assigned
                    </p>
                  </div>

                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Students */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Students
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      0
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Assigned students
                    </p>
                  </div>

                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Lessons */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Upcoming Lessons
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      0
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Scheduled lessons
                    </p>
                  </div>

                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Academic Coverage */}
          <section className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      Your Academic Coverage
                    </CardTitle>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Subjects and academic
                      programmes assigned
                      to you.
                    </p>
                  </div>

                  <BookOpen className="hidden h-5 w-5 text-muted-foreground sm:block" />
                </div>
              </CardHeader>

              <CardContent>
                {subjects.length ===
                0 ? (
                  <div className="rounded-xl border border-dashed p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>

                    <p className="mt-4 font-medium">
                      No academic
                      assignments yet.
                    </p>

                    <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                      Your administrator
                      will assign
                      subjects and
                      programmes to
                      your tutor
                      account.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {subjects.map(
                      (
                        assignment
                      ) => (
                        <div
                          key={
                            assignment.id
                          }
                          className="rounded-xl border bg-background p-4 transition-colors hover:bg-muted/40"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold">
                                {
                                  assignment.subject
                                }
                              </p>

                              <p className="mt-1 text-xs text-muted-foreground">
                                Academic
                                assignment
                              </p>
                            </div>

                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                              <BookOpen className="h-4 w-4" />
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full bg-muted px-2.5 py-1 font-medium">
                              {
                                assignment.level
                              }
                            </span>

                            <span className="rounded-full bg-muted px-2.5 py-1 font-medium">
                              {
                                assignment.curriculum
                              }
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Quick Actions */}
          <section className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Tutor Activities
                </CardTitle>

                <p className="text-sm text-muted-foreground">
                  Quick access to your
                  main teaching activities.
                </p>
              </CardHeader>

              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <a
                    href="/tutor/students"
                    className="rounded-xl border p-4 transition-colors hover:bg-muted"
                  >
                    <Users className="h-5 w-5 text-primary" />

                    <p className="mt-3 font-semibold">
                      My Students
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      View and manage
                      assigned students.
                    </p>
                  </a>

                  <a
                    href="/tutor/subjects"
                    className="rounded-xl border p-4 transition-colors hover:bg-muted"
                  >
                    <BookOpen className="h-5 w-5 text-primary" />

                    <p className="mt-3 font-semibold">
                      My Subjects
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      View your academic
                      assignments.
                    </p>
                  </a>

                  <a
                    href="/tutor/lessons"
                    className="rounded-xl border p-4 transition-colors hover:bg-muted"
                  >
                    <CalendarDays className="h-5 w-5 text-primary" />

                    <p className="mt-3 font-semibold">
                      Lessons
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      View your teaching
                      schedule.
                    </p>
                  </a>

                  <a
                    href="/tutor/reports"
                    className="rounded-xl border p-4 transition-colors hover:bg-muted"
                  >
                    <BookOpen className="h-5 w-5 text-primary" />

                    <p className="mt-3 font-semibold">
                      Reports
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Monitor student
                      progress.
                    </p>
                  </a>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  )
}

