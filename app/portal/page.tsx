"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import {
  Video,
  FileText,
  CheckCircle2,
  Clock,
  Calendar,
  Play,
  BookOpen,
  TrendingUp,
  Award,
  ArrowLeft,
  LogOut,
  User,
} from "lucide-react"

export default function PortalPage() {
  const router = useRouter()
  const [selectedSubject, setSelectedSubject] = useState("mathematics")

  // ✅ Student info
  const studentData = {
    name: "John Daka",
    level: "A-Level",
    subjects: ["Pure Mathematics", "Computer Science", "Geography"],
    overallProgress: 82,
  }

  // ✅ Mock data
  const lessons = {
    mathematics: [
      { id: 1, title: "Differentiation Basics", duration: "45 min", completed: true, date: "2025-01-05" },
      { id: 2, title: "Integration Techniques", duration: "40 min", completed: false, date: "2025-01-12" },
    ],
  }

  const notes = [
    { id: 1, title: "Pure Maths Notes", subject: "Mathematics", pages: 22, date: "2025-01-07" },
    { id: 2, title: "Geography Climate Notes", subject: "Geography", pages: 16, date: "2025-01-10" },
  ]

  const progress = [
    { subject: "Mathematics", progress: 85, grade: "A" },
    { subject: "Computer Science", progress: 88, grade: "A" },
    { subject: "Geography", progress: 70, grade: "B" },
  ]

  // ✅ Handle back + logout
  const handleBack = () => router.push("/")
  const handleLogout = () => router.push("/login")

  return (
    <div className="min-h-screen flex flex-col">
      {/* 🌍 Header / Navigation */}
      <header className="flex items-center justify-between bg-primary text-primary-foreground px-6 py-4 shadow-md">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-lg font-semibold">Student Portal</h1>
        </div>

        <Button variant="secondary" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-1" /> Logout
        </Button>
      </header>

      {/* 🧠 Student Info Section */}
      <section className="bg-muted py-10 px-6 md:px-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
              {studentData.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{studentData.name}</h2>
              <p className="text-sm text-muted-foreground">{studentData.level} Student</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{studentData.subjects.length}</div>
              <div className="text-sm text-muted-foreground">Subjects</div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold">{studentData.overallProgress}%</div>
              <div className="text-sm text-muted-foreground">Progress</div>
            </div>
          </div>
        </div>
      </section>

      {/* 🧩 Tabs Section */}
      <section className="py-10 px-6 md:px-10 flex-1">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            {/* 🏠 Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome back, {studentData.name} 👋</CardTitle>
                  <CardDescription>Continue learning and track your activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    You are currently enrolled in <strong>{studentData.subjects.length}</strong> subjects.
                    Keep up your performance to reach your target goals!
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 🎥 Lessons Tab */}
            <TabsContent value="lessons" className="space-y-4">
              {lessons.mathematics.map((lesson) => (
                <Card key={lesson.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Video className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {lesson.duration} • {lesson.date}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant={lesson.completed ? "outline" : "default"}>
                      <Play className="h-4 w-4 mr-2" />
                      {lesson.completed ? "Rewatch" : "Watch"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* 📘 Notes Tab */}
            <TabsContent value="notes" className="grid md:grid-cols-2 gap-4">
              {notes.map((note) => (
                <Card key={note.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{note.title}</CardTitle>
                    <CardDescription>{note.subject}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{note.pages} pages</span>
                      <span>{note.date}</span>
                    </div>
                    <Button size="sm" className="mt-3 w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      View Notes
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* 📊 Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>Track your performance by subject</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {progress.map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span className="font-medium">{item.subject}</span>
                        </div>
                        <span className="text-sm font-medium">{item.grade}</span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg border border-green-300 bg-green-50">
                    <TrendingUp className="h-5 w-5 text-green-700" />
                    <p className="text-sm">
                      Great work! You’re showing excellent improvement in <strong>Computer Science</strong>.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-300 bg-amber-50">
                    <Award className="h-5 w-5 text-amber-700" />
                    <p className="text-sm">
                      Try revising more on <strong>Geography</strong> to boost your grade.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  )
}
