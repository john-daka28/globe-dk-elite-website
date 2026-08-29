"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowLeft,
  BookOpen,
  FileText,
  FolderOpen,
  GraduationCap,
  Link2,
  Save,
  Upload,
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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function NewTutorResourcePage() {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [type, setType] = useState("Study Notes")
  const [description, setDescription] = useState("")
  const [audience, setAudience] = useState("My Students")
  const [resourceLink, setResourceLink] = useState("")
  const [publishNow, setPublishNow] = useState(true)

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/tutor/resources"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold">
                GlobeDK Elite
              </p>

              <p className="text-[11px] text-muted-foreground">
                Tutor Portal
              </p>
            </div>
          </Link>

          <Button variant="outline" asChild>
            <Link href="/tutor/resources">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resources
            </Link>
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto max-w-5xl px-4 py-8">
        <Badge className="mb-3">
          Teaching Resources
        </Badge>

        <h1 className="text-3xl font-bold tracking-tight">
          Add Learning Resource
        </h1>

        <p className="mt-2 text-muted-foreground">
          Upload or publish learning materials for your students.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Main form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Resource Information</CardTitle>

              <CardDescription>
                Add the details students will use to identify the
                resource.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium">
                  Resource Title
                </label>

                <Input
                  className="mt-2"
                  placeholder="e.g. Quadratic Equations Revision Notes"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">
                    Subject
                  </label>

                  <select
                    value={subject}
                    onChange={(event) =>
                      setSubject(event.target.value)
                    }
                    className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    <option value="">Select subject</option>
                    <option>Mathematics</option>
                    <option>English Language</option>
                    <option>Computer Science</option>
                    <option>Geography</option>
                    <option>Statistics</option>
                    <option>Business Studies</option>
                    <option>Economics</option>
                    <option>Pure Mathematics</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Resource Type
                  </label>

                  <select
                    value={type}
                    onChange={(event) =>
                      setType(event.target.value)
                    }
                    className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    <option>Study Notes</option>
                    <option>Past Paper</option>
                    <option>Revision Material</option>
                    <option>Worksheet</option>
                    <option>Presentation</option>
                    <option>Video</option>
                    <option>Reference Material</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Description
                </label>

                <Textarea
                  className="mt-2 min-h-[150px]"
                  placeholder="Explain what students will learn from this resource..."
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                />
              </div>

              {/* File upload */}
              <div>
                <label className="text-sm font-medium">
                  Upload Resource
                </label>

                <div className="mt-2 rounded-xl border border-dashed p-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>

                  <h3 className="mt-4 font-medium">
                    Upload a file
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    PDF, DOCX, PPTX, images or other supported
                    learning materials.
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                </div>
              </div>

              {/* External link */}
              <div>
                <label className="text-sm font-medium">
                  External Resource Link
                </label>

                <div className="relative mt-2">
                  <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                  <Input
                    className="pl-9"
                    placeholder="https://..."
                    value={resourceLink}
                    onChange={(event) =>
                      setResourceLink(event.target.value)
                    }
                  />
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  Optional. Use this when the resource is hosted
                  elsewhere.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Settings</CardTitle>

              <CardDescription>
                Control who can access the resource.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />

                  <div>
                    <p className="font-medium">Subject</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {subject || "Not selected"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex gap-3">
                  <FileText className="h-5 w-5 text-primary" />

                  <div>
                    <p className="font-medium">Resource Type</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {type}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Audience
                </label>

                <select
                  value={audience}
                  onChange={(event) =>
                    setAudience(event.target.value)
                  }
                  className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option>My Students</option>
                  <option>Form 4 Students</option>
                  <option>Form 5 Students</option>
                  <option>Form 6 Students</option>
                  <option>All Students</option>
                </select>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex gap-3">
                  <Users className="h-5 w-5 text-primary" />

                  <div>
                    <p className="font-medium">Access</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {audience}
                    </p>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-3 rounded-lg border p-4">
                <input
                  type="checkbox"
                  checked={publishNow}
                  onChange={(event) =>
                    setPublishNow(event.target.checked)
                  }
                  className="mt-1 h-4 w-4"
                />

                <div>
                  <p className="text-sm font-medium">
                    Publish immediately
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Students can access the resource immediately.
                  </p>
                </div>
              </label>

              <div className="space-y-2">
                <Button className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Publish Resource
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Student Preview</CardTitle>

            <CardDescription>
              Preview of how the resource will appear in the
              student's Resources page.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-xl border bg-background p-5">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">
                      {title || "Resource title"}
                    </h3>

                    <Badge variant="secondary">
                      {type}
                    </Badge>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {subject || "Subject"} · {audience}
                  </p>

                  <p className="mt-3 text-sm text-muted-foreground">
                    {description ||
                      "Resource description will appear here."}
                  </p>

                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-4"
                  >
                    Open Resource
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </main>
  )
}