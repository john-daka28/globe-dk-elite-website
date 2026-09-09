import {
  BookOpen,
  GraduationCap,
  Layers3,
  School,
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
  Badge,
} from "@/components/ui/badge"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default async function TutorSubjectsPage() {
  /*
   * ============================================================
   * TUTOR SESSION
   * ============================================================
   *
   * requireRole() reads the existing globedk_session cookie,
   * verifies the signed session token and retrieves the user
   * from the users table.
   *
   * Only users with role = "tutor" are allowed here.
   */
  const tutor =
    await requireRole([
      "tutor",
    ]).catch(() => null)

  /*
   * If there is no valid tutor session,
   * send the user back to login.
   */
  if (!tutor) {
    redirect("/login")
  }


  /*
   * ============================================================
   * RETRIEVE THIS TUTOR'S ASSIGNMENTS
   * ============================================================
   *
   * Each row represents one independent teaching assignment.
   *
   * Example:
   *
   * Mathematics | A-Level | ZIMSEC
   * Geography   | A-Level | ZIMSEC
   * English     | O-Level | ZIMSEC
   * Mathematics | O-Level | Cambridge
   * Physics     | A-Level | Cambridge
   *
   * This means a tutor can teach multiple subjects in the
   * same curriculum and level.
   */
  const {
    data: assignments,
    error,
  } =
    await supabaseAdmin
      .from("tutor_subjects")
      .select(
        "id,subject,level,curriculum,created_at"
      )
      .eq(
        "tutor_id",
        tutor.id
      )
      .order(
        "curriculum",
        {
          ascending: true,
        }
      )
      .order(
        "level",
        {
          ascending: true,
        }
      )
      .order(
        "subject",
        {
          ascending: true,
        }
      )


  /*
   * Keep the page safe even if the query returns an error.
   */
  const subjects =
    error || !assignments
      ? []
      : assignments


  /*
   * ============================================================
   * TUTOR NAME
   * ============================================================
   */
  const tutorName =
    `${tutor.first_name || ""} ${
      tutor.last_name || ""
    }`.trim()


  /*
   * ============================================================
   * SUMMARY INFORMATION
   * ============================================================
   */

  const totalAssignments =
    subjects.length

  const zimsecAssignments =
    subjects.filter(
      (assignment) =>
        assignment.curriculum ===
        "ZIMSEC"
    ).length

  const cambridgeAssignments =
    subjects.filter(
      (assignment) =>
        assignment.curriculum ===
        "Cambridge"
    ).length

  const oLevelAssignments =
    subjects.filter(
      (assignment) =>
        assignment.level ===
        "O-Level"
    ).length

  const aLevelAssignments =
    subjects.filter(
      (assignment) =>
        assignment.level ===
        "A-Level"
    ).length


  /*
   * Unique subjects.
   *
   * A tutor may teach the same subject in
   * different curricula or levels.
   *
   * Example:
   *
   * Mathematics - O-Level - Cambridge
   * Mathematics - A-Level - ZIMSEC
   *
   * This still counts as one subject here.
   */
  const uniqueSubjects =
    Array.from(
      new Set(
        subjects.map(
          (assignment) =>
            assignment.subject
        )
      )
    )


  return (
    <main className="min-h-screen bg-muted/30">

      {/* ======================================================
          TUTOR SIDEBAR
      ======================================================= */}
      <TutorSidebar
        tutorName={
          tutorName ||
          "Tutor"
        }
      />


      {/* ======================================================
          MAIN CONTENT
      ======================================================= */}
      <div className="lg:pl-64">

        {/* ====================================================
            MOBILE HEADER
        ===================================================== */}
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


        {/* ====================================================
            PAGE CONTENT
        ===================================================== */}
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">


          {/* ==================================================
              PAGE INTRODUCTION
          =================================================== */}
          <section className="mb-8">

            <p className="text-sm font-medium text-primary">
              Tutor Portal
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              My Subjects
            </h1>

            <p className="mt-2 max-w-2xl text-muted-foreground">
              View all subjects, levels and
              curricula assigned to you by
              GlobeDK Elite Academy.
            </p>

          </section>


          {/* ==================================================
              SUMMARY CARDS
          =================================================== */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


            {/* Total Assignments */}
            <Card>
              <CardContent className="p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Teaching Assignments
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {
                        totalAssignments
                      }
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Total assignments
                    </p>

                  </div>

                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>

                </div>

              </CardContent>
            </Card>


            {/* Subjects */}
            <Card>
              <CardContent className="p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Subjects
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {
                        uniqueSubjects.length
                      }
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Unique subjects
                    </p>

                  </div>

                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </div>

                </div>

              </CardContent>
            </Card>


            {/* O-Level */}
            <Card>
              <CardContent className="p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-muted-foreground">
                      O-Level
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {
                        oLevelAssignments
                      }
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      O-Level assignments
                    </p>

                  </div>

                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <School className="h-5 w-5" />
                  </div>

                </div>

              </CardContent>
            </Card>


            {/* A-Level */}
            <Card>
              <CardContent className="p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-muted-foreground">
                      A-Level
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {
                        aLevelAssignments
                      }
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      A-Level assignments
                    </p>

                  </div>

                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <Layers3 className="h-5 w-5" />
                  </div>

                </div>

              </CardContent>
            </Card>

          </section>


          {/* ==================================================
              CURRICULUM SUMMARY
          =================================================== */}
          <section className="mt-6">

            <div className="grid gap-4 md:grid-cols-2">


              {/* ZIMSEC */}
              <Card>

                <CardContent className="p-6">

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-sm font-medium text-muted-foreground">
                        ZIMSEC
                      </p>

                      <p className="mt-2 text-2xl font-bold">
                        {
                          zimsecAssignments
                        }
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Teaching assignments
                      </p>

                    </div>

                    <Badge variant="outline">
                      ZIMSEC
                    </Badge>

                  </div>

                </CardContent>

              </Card>


              {/* Cambridge */}
              <Card>

                <CardContent className="p-6">

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-sm font-medium text-muted-foreground">
                        Cambridge
                      </p>

                      <p className="mt-2 text-2xl font-bold">
                        {
                          cambridgeAssignments
                        }
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Teaching assignments
                      </p>

                    </div>

                    <Badge variant="outline">
                      Cambridge
                    </Badge>

                  </div>

                </CardContent>

              </Card>

            </div>

          </section>


          {/* ==================================================
              TEACHING ASSIGNMENTS
          =================================================== */}
          <section className="mt-6">

            <Card>

              <CardHeader>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <CardTitle>
                      Teaching Assignments
                    </CardTitle>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Each assignment represents
                      one subject, level and
                      curriculum combination.
                    </p>

                  </div>

                  <BookOpen className="hidden h-5 w-5 text-muted-foreground sm:block" />

                </div>

              </CardHeader>


              <CardContent>

                {subjects.length ===
                0 ? (

                  /* ==========================================
                     EMPTY STATE
                  =========================================== */
                  <div className="rounded-xl border border-dashed p-10 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted">

                      <BookOpen className="h-6 w-6 text-muted-foreground" />

                    </div>

                    <p className="mt-4 font-medium">
                      No teaching assignments yet.
                    </p>

                    <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                      Your administrator will
                      assign subjects, levels and
                      curricula to your tutor
                      account.
                    </p>

                  </div>

                ) : (

                  /* ==========================================
                     ASSIGNMENT GRID
                  =========================================== */
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    {subjects.map(
                      (
                        assignment
                      ) => (

                        <div
                          key={
                            assignment.id
                          }
                          className="rounded-xl border bg-background p-5 transition-colors hover:bg-muted/40"
                        >

                          {/* Subject heading */}
                          <div className="flex items-start justify-between gap-3">

                            <div>

                              <p className="text-base font-semibold">
                                {
                                  assignment.subject
                                }
                              </p>

                              <p className="mt-1 text-xs text-muted-foreground">
                                Teaching assignment
                              </p>

                            </div>

                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                              <BookOpen className="h-4 w-4" />
                            </div>

                          </div>


                          {/* Assignment details */}
                          <div className="mt-5 space-y-3">

                            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">

                              <span className="text-xs text-muted-foreground">
                                Level
                              </span>

                              <span className="text-xs font-semibold">
                                {
                                  assignment.level
                                }
                              </span>

                            </div>


                            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">

                              <span className="text-xs text-muted-foreground">
                                Curriculum
                              </span>

                              <span className="text-xs font-semibold">
                                {
                                  assignment.curriculum
                                }
                              </span>

                            </div>

                          </div>


                          {/* Badges */}
                          <div className="mt-4 flex flex-wrap gap-2">

                            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                              {
                                assignment.level
                              }
                            </span>

                            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
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


          {/* ==================================================
              ASSIGNMENT BREAKDOWN
          =================================================== */}
          <section className="mt-6">

            <Card>

              <CardHeader>

                <CardTitle>
                  Assignment Breakdown
                </CardTitle>

                <p className="text-sm text-muted-foreground">
                  Your current teaching coverage
                  across levels and curricula.
                </p>

              </CardHeader>


              <CardContent>

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[650px]">

                    <thead>

                      <tr className="border-y bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">

                        <th className="px-4 py-3 font-medium">
                          Subject
                        </th>

                        <th className="px-4 py-3 font-medium">
                          Level
                        </th>

                        <th className="px-4 py-3 font-medium">
                          Curriculum
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {subjects.map(
                        (
                          assignment
                        ) => (

                          <tr
                            key={
                              `row-${assignment.id}`
                            }
                            className="border-b last:border-0"
                          >

                            <td className="px-4 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">

                                  <BookOpen className="h-4 w-4" />

                                </div>

                                <span className="font-medium">
                                  {
                                    assignment.subject
                                  }
                                </span>

                              </div>

                            </td>


                            <td className="px-4 py-4">

                              <Badge variant="outline">
                                {
                                  assignment.level
                                }
                              </Badge>

                            </td>


                            <td className="px-4 py-4">

                              <Badge variant="outline">
                                {
                                  assignment.curriculum
                                }
                              </Badge>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </CardContent>

            </Card>

          </section>


          {/* ==================================================
              INFORMATION CARD
          =================================================== */}
          <section className="mt-6">

            <Card>

              <CardContent className="p-6">

                <div className="flex items-start gap-4">

                  <div className="rounded-xl bg-primary/10 p-3 text-primary">

                    <GraduationCap className="h-5 w-5" />

                  </div>


                  <div>

                    <p className="font-semibold">
                      About your teaching assignments
                    </p>

                    <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                      Your teaching assignments are
                      managed by the GlobeDK Elite
                      Academy administration. Each
                      assignment combines a subject,
                      academic level and curriculum.
                      You may be assigned multiple
                      subjects within ZIMSEC,
                      Cambridge, or both curricula.
                    </p>

                  </div>

                </div>

              </CardContent>

            </Card>

          </section>


        </div>

      </div>

    </main>
  )
}