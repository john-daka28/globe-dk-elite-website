"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileQuestion,
  GraduationCap,
  Plus,
  Save,
  Settings2,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

export default function NewTutorExamPage() {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [duration, setDuration] = useState("60")
  const [description, setDescription] = useState("")
  const [published, setPublished] = useState(false)

  return (
    <main className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/tutor/exams" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold">GlobeDK Elite</p>
              <p className="text-[11px] text-muted-foreground">Tutor Portal</p>
            </div>
          </Link>

          <Button variant="outline" asChild>
            <Link href="/tutor/exams">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Exams
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-8">
        <Badge className="mb-3">Assessment Management</Badge>

        <h1 className="text-3xl font-bold tracking-tight">
          Create New Examination
        </h1>

        <p className="mt-2 text-muted-foreground">
          Create an examination or mock test for your assigned students.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Examination Details</CardTitle>
              <CardDescription>
                Enter the basic information for this assessment.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <label className="text-sm font-medium">Exam Title</label>
                <Input
                  className="mt-2"
                  placeholder="e.g. Mathematics Term 2 Mock Examination"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  className="mt-2"
                  placeholder="e.g. Mathematics"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Instructions</label>
                <Textarea
                  className="mt-2 min-h-[120px]"
                  placeholder="Enter instructions students should follow..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Examination Duration
                </label>

                <div className="relative mt-2">
                  <Clock3 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  Duration in minutes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exam Settings</CardTitle>
              <CardDescription>
                Configure how students will access the exam.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex gap-3">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Schedule</p>
                    <p className="text-xs text-muted-foreground">
                      Set the examination date later.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Students</p>
                    <p className="text-xs text-muted-foreground">
                      Assign to your students.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex gap-3">
                  <FileQuestion className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Questions</p>
                    <p className="text-xs text-muted-foreground">
                      Add questions after creating the exam.
                    </p>
                  </div>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4"
                />
                <div>
                  <p className="text-sm font-medium">Publish immediately</p>
                  <p className="text-xs text-muted-foreground">
                    Students can see the exam immediately.
                  </p>
                </div>
              </label>

              <Button className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Create Examination
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </main>
  )
}