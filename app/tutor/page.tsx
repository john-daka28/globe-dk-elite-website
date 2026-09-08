import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  LogOut,
  Users,
} from "lucide-react"

import Link from "next/link"
import { redirect } from "next/navigation"

import {
  requireRole,
} from "@/lib/auth/session"

import {
  supabaseAdmin,
} from "@/lib/supabaseAdmin"

import { Button } from "@/components/ui/button"
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

  return (
    <main className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link
            href="/tutor"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <p className="font-bold">
                GlobeDK Elite Academy
              </p>

              <p className="text-xs text-muted-foreground">
                Tutor Portal
              </p>
            </div>
          </Link>

          <form action="/api/auth/logout" method="POST">
            <Button
              variant="outline"
              size="sm"
              type="submit"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <section className="mb-8">
          <p className="text-sm font-medium text-primary">
            Tutor Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Welcome, {tutor.first_name}
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Manage your GlobeDK teaching activities,
            assigned students and academic programmes.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Academic Assignments
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {subjects.length}
                  </p>
                </div>

                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

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
                </div>

                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

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
                </div>

                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <CalendarDays className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Your Academic Coverage
              </CardTitle>
            </CardHeader>

            <CardContent>
              {subjects.length === 0 ? (
                <div className="rounded-xl border border-dashed p-8 text-center">
                  <p className="font-medium">
                    No academic assignments yet.
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Your administrator will assign subjects
                    and programmes to your tutor account.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {subjects.map(
                    (assignment) => (
                      <div
                        key={
                          assignment.id
                        }
                        className="rounded-xl border p-4"
                      >
                        <p className="font-semibold">
                          {
                            assignment.subject
                          }
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full bg-muted px-2.5 py-1">
                            {
                              assignment.level
                            }
                          </span>

                          <span className="rounded-full bg-muted px-2.5 py-1">
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
      </div>
    </main>
  )
}