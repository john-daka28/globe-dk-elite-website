"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  GraduationCap,
  Megaphone,
  Save,
  Send,
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

export default function NewAnnouncementPage() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [audience, setAudience] = useState("My Students")
  const [priority, setPriority] = useState("Normal")
  const [publishNow, setPublishNow] = useState(true)
  const [publishDate, setPublishDate] = useState("")

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/tutor/announcements"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold">GlobeDK Elite</p>
              <p className="text-[11px] text-muted-foreground">
                Tutor Portal
              </p>
            </div>
          </Link>

          <Button variant="outline" asChild>
            <Link href="/tutor/announcements">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Announcements
            </Link>
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto max-w-5xl px-4 py-8">
        <Badge className="mb-3">
          Academy Communication
        </Badge>

        <h1 className="text-3xl font-bold tracking-tight">
          Create Announcement
        </h1>

        <p className="mt-2 text-muted-foreground">
          Send an important update or reminder to your students.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Announcement form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Announcement Details</CardTitle>

              <CardDescription>
                Write the message your students will receive.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium">
                  Announcement Title
                </label>

                <Input
                  className="mt-2"
                  placeholder="e.g. Mathematics Mock Examination"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Message
                </label>

                <Textarea
                  className="mt-2 min-h-[200px]"
                  placeholder="Write your announcement here..."
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                />

                <p className="mt-1 text-xs text-muted-foreground">
                  Keep the announcement clear and relevant to
                  students.
                </p>
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
                  <option>Mathematics Students</option>
                  <option>Form 4 Students</option>
                  <option>Form 5 Students</option>
                  <option>Form 6 Students</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Priority
                </label>

                <select
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value)
                  }
                  className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option>Normal</option>
                  <option>Important</option>
                  <option>Urgent</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Publishing settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>

              <CardDescription>
                Choose when students should see the announcement.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex gap-3">
                  <Users className="h-5 w-5 text-primary" />

                  <div>
                    <p className="font-medium">Audience</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {audience}
                    </p>
                  </div>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4">
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
                    Students will see the announcement as soon as
                    it is published.
                  </p>
                </div>
              </label>

              {!publishNow && (
                <div>
                  <label className="text-sm font-medium">
                    Publish Date
                  </label>

                  <div className="relative mt-2">
                    <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                    <Input
                      type="datetime-local"
                      className="pl-9"
                      value={publishDate}
                      onChange={(event) =>
                        setPublishDate(event.target.value)
                      }
                    />
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex gap-3">
                  <Bell className="h-5 w-5 text-primary" />

                  <div>
                    <p className="text-sm font-medium">
                      Student Notification
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Students will receive the announcement in
                      their portal.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Publish Announcement
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
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
              This is approximately how the announcement will
              appear to students.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-xl border bg-background p-5">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Megaphone className="h-5 w-5 text-primary" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">
                      {title || "Announcement title"}
                    </h3>

                    {priority !== "Normal" && (
                      <Badge
                        variant={
                          priority === "Urgent"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {priority}
                      </Badge>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Posted by Tutor · {audience}
                  </p>

                  <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">
                    {message ||
                      "Your announcement message will appear here."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </main>
  )
}