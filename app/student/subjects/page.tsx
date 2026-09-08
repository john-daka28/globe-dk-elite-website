import {
BookOpen,
GraduationCap,
Layers3,
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

export default async function StudentSubjectsPage() {
/*

* ============================================================
* SESSION / AUTHENTICATION
* ============================================================
*
* This makes sure only logged-in students can access
* this page.
*
* The student object also gives us the logged-in
* student's ID.
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
* ↓
* student_subjects
* ↓
* subjects
*
* We query using the logged-in student's ID.
*
* Therefore a student can only see subjects assigned
* to their own account.
  */
  const {
  data: studentSubjectRows,
  error: studentSubjectsError,
  } =
  await supabaseAdmin
  .from("student_subjects")
  .select(
  `      subject_id,
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

* Log the error on the server without exposing
* database details to the student.
  */
  if (studentSubjectsError) {
  console.error(
  "Student subjects page error:",
  studentSubjectsError
  )
  }

/*

* Extract the related subjects.
*
* Only active subjects are displayed.
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
  return ( <main className="min-h-screen bg-muted/30">

  {/* ====================================================== */}
  {/* SIDEBAR */}
  {/* ====================================================== */}

   <StudentSidebar />

  {/* ====================================================== */}
  {/* MAIN CONTENT */}
  {/* ====================================================== */}

   <div className="lg:pl-64">

     <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

  ```
   {/* ================================================== */}
   {/* PAGE HEADER */}
   {/* ================================================== */}

   <section className="mb-6 sm:mb-8">

     <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

       <div>

         <p className="text-sm font-medium text-primary">
           Student Portal
         </p>

         <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
           My Subjects
         </h1>

         <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
           View all subjects currently assigned
           to your GlobeDK Elite Academy account.
         </p>

       </div>


       {/* Subject Count */}
       <div className="flex w-fit items-center gap-3 rounded-2xl border bg-background px-4 py-3 shadow-sm">

         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">

           <BookOpen className="h-5 w-5" />

         </div>

         <div>

           <p className="text-xs text-muted-foreground">
             Registered Subjects
           </p>

           <p className="text-xl font-bold">
             {subjectCount}
           </p>

         </div>

       </div>

     </div>

   </section>


   {/* ================================================== */}
   {/* STUDENT INFORMATION */}
   {/* ================================================== */}

   <section className="mb-6 rounded-2xl border bg-background p-4 shadow-sm sm:mb-8 sm:p-5">

     <div className="flex items-center gap-3">

       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">

         <GraduationCap className="h-5 w-5" />

       </div>

       <div className="min-w-0">

         <p className="text-xs text-muted-foreground">
           Student
         </p>

         <p className="font-semibold">
           {studentName || "Student"}
         </p>

       </div>

     </div>

   </section>


   {/* ================================================== */}
   {/* SUBJECTS */}
   {/* ================================================== */}

   {assignedSubjects.length > 0 ? (

     <section>

       <div className="mb-4">

         <h2 className="text-lg font-semibold sm:text-xl">
           Your Registered Subjects
         </h2>

         <p className="mt-1 text-sm text-muted-foreground">
           These are the subjects your tutor has
           assigned to you.
         </p>

       </div>


       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

         {assignedSubjects.map(
           (
             subject
           ) => (

             <article
               key={
                 subject.id
               }
               className="group flex h-full flex-col rounded-2xl border bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
             >

               {/* Subject Header */}
               <div className="flex items-start gap-3">

                 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">

                   <BookOpen className="h-5 w-5" />

                 </div>


                 <div className="min-w-0 flex-1">

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


               {/* Subject Level */}
               <div className="mt-4 flex items-center gap-2 text-sm">

                 <Layers3 className="h-4 w-4 text-muted-foreground" />

                 <span className="text-muted-foreground">
                   Level:
                 </span>

                 <span className="font-medium">
                   {subject.level || "Not specified"}
                 </span>

               </div>


               {/* Description */}
               {subject.description && (

                 <div className="mt-4 border-t pt-4">

                   <p className="text-sm leading-6 text-muted-foreground">

                     {subject.description}

                   </p>

                 </div>

               )}


               {/* Syllabus */}
               <div className="mt-auto pt-5">

                 {subject.syllabus ? (

                   <div className="rounded-xl bg-muted/50 p-3">

                     <p className="text-xs font-medium text-muted-foreground">
                       Syllabus
                     </p>

                     <p className="mt-1 line-clamp-3 text-sm leading-5">
                       {subject.syllabus}
                     </p>

                   </div>

                 ) : (

                   <div className="rounded-xl bg-muted/50 p-3">

                     <p className="text-sm text-muted-foreground">
                       Syllabus information will
                       appear here when available.
                     </p>

                   </div>

                 )}

               </div>

             </article>

           )
         )}

       </div>

     </section>

   ) : (

     /* ================================================== */
     /* NO SUBJECTS */
     /* ================================================== */

     <section className="rounded-2xl border border-dashed bg-background p-8 text-center shadow-sm sm:p-12">

       <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">

         <BookOpen className="h-7 w-7 text-muted-foreground" />

       </div>


       <h2 className="mt-4 text-lg font-semibold">
         No subjects assigned yet
       </h2>


       <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
         Your tutor has not assigned any subjects
         to your account yet. Once a subject is
         assigned, it will automatically appear
         on this page.
       </p>


       <Link
         href="/student"
         className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
       >
         Back to Dashboard
       </Link>

     </section>

   )}
  

     </div>

   </div>

`
</main>


)
}
