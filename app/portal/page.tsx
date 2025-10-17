"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Video,
  FileText,
  Download,
  Play,
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
  Award,
} from "lucide-react"

export default function PortalPage() {
  const [selectedSubject, setSelectedSubject] = useState("mathematics")

  // Mock student data
  const studentData = {
    name: "Student Demo",
    level: "O-Level",
    subjects: ["Mathematics", "English", "Computer Science", "Geography"],
    overallProgress: 75,
  }

  // Mock lessons data
  const lessons = {
    mathematics: [
      {
        id: 1,
        title: "Algebra Fundamentals",
        type: "video",
        duration: "45 min",
        completed: true,
        date: "2025-01-10",
      },
      {
        id: 2,
        title: "Quadratic Equations",
        type: "video",
        duration: "50 min",
        completed: true,
        date: "2025-01-17",
      },
      {
        id: 3,
        title: "Trigonometry Basics",
        type: "video",
        duration: "40 min",
        completed: false,
        date: "2025-01-24",
      },
      {
        id: 4,
        title: "Statistics and Probability",
        type: "video",
        duration: "55 min",
        completed: false,
        date: "2025-01-31",
      },
    ],
    english: [
      {
        id: 1,
        title: "Essay Writing Techniques",
        type: "video",
        duration: "40 min",
        completed: true,
        date: "2025-01-12",
      },
      {
        id: 2,
        title: "Grammar Essentials",
        type: "video",
        duration: "35 min",
        completed: false,
        date: "2025-01-19",
      },
    ],
  }

  // Mock notes data
  const notes = [
    { id: 1, title: "Algebra Complete Notes", subject: "Mathematics", pages: 24, date: "2025-01-10" },
    { id: 2, title: "Trigonometry Formulas", subject: "Mathematics", pages: 12, date: "2025-01-15" },
    { id: 3, title: "Essay Writing Guide", subject: "English", pages: 18, date: "2025-01-12" },
    { id: 4, title: "Programming Basics", subject: "Computer Science", pages: 30, date: "2025-01-08" },
  ]

  // Mock assignments data
  const assignments = [
    {
      id: 1,
      title: "Algebra Problem Set 1",
      subject: "Mathematics",
      dueDate: "2025-02-05",
      status: "pending",
      score: null,
    },
    {
      id: 2,
      title: "Essay: Climate Change",
      subject: "English",
      dueDate: "2025-02-08",
      status: "pending",
      score: null,
    },
    {
      id: 3,
      title: "Quadratic Equations Test",
      subject: "Mathematics",
      dueDate: "2025-01-20",
      status: "graded",
      score: 85,
    },
  ]

  // Mock progress data
  const subjectProgress = [
    { subject: "Mathematics", progress: 80, grade: "A" },
    { subject: "English", progress: 70, grade: "B" },
    { subject: "Computer Science", progress: 85, grade: "A" },
    { subject: "Geography", progress: 65, grade: "B" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {studentData.name}!</h1>
              <p className="text-primary-foreground/90">Continue your learning journey</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{studentData.subjects.length}</div>
                <div className="text-sm text-primary-foreground/80">Subjects</div>
              </div>
              <div className="h-12 w-px bg-primary-foreground/20" />
              <div className="text-center">
                <div className="text-2xl font-bold">{studentData.overallProgress}%</div>
                <div className="text-sm text-primary-foreground/80">Progress</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
              <TabsTrigger value="dashboard" className="text-sm">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="lessons" className="text-sm">
                Lessons
              </TabsTrigger>
              <TabsTrigger value="notes" className="text-sm">
                Notes
              </TabsTrigger>
              <TabsTrigger value="assignments" className="text-sm">
                Assignments
              </TabsTrigger>
              <TabsTrigger value="progress" className="text-sm">
                Progress
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Classes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-1">3</div>
                    <p className="text-sm text-muted-foreground">This weekend</p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending Assignments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-1">2</div>
                    <p className="text-sm text-muted-foreground">Due this week</p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Overall Grade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-1">B+</div>
                    <p className="text-sm text-muted-foreground">Keep it up!</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest learning activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      icon: Video,
                      title: "Completed: Quadratic Equations",
                      subject: "Mathematics",
                      time: "2 hours ago",
                    },
                    {
                      icon: FileText,
                      title: "Downloaded: Algebra Notes",
                      subject: "Mathematics",
                      time: "1 day ago",
                    },
                    {
                      icon: CheckCircle2,
                      title: "Submitted: Essay Assignment",
                      subject: "English",
                      time: "2 days ago",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <activity.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{activity.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>{activity.subject}</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lessons Tab */}
            <TabsContent value="lessons" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Video Lessons</CardTitle>
                  <CardDescription>Access recorded lessons and live class recordings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {lessons.mathematics.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Video className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{lesson.title}</h3>
                            {lesson.completed && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{lesson.duration}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{lesson.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant={lesson.completed ? "outline" : "default"}>
                        <Play className="h-4 w-4 mr-2" />
                        {lesson.completed ? "Rewatch" : "Watch"}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Study Notes</CardTitle>
                  <CardDescription>Download comprehensive notes for all your subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-secondary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">{note.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span>{note.subject}</span>
                              <span>•</span>
                              <span>{note.pages} pages</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assignments Tab */}
            <TabsContent value="assignments" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Assignments & Tests</CardTitle>
                  <CardDescription>View and submit your assignments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{assignment.title}</h3>
                          <Badge
                            variant={assignment.status === "graded" ? "default" : "secondary"}
                            className={assignment.status === "graded" ? "bg-green-600" : ""}
                          >
                            {assignment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{assignment.subject}</span>
                          <span>•</span>
                          <span>Due: {assignment.dueDate}</span>
                          {assignment.score && (
                            <>
                              <span>•</span>
                              <span className="font-semibold text-foreground">Score: {assignment.score}%</span>
                            </>
                          )}
                        </div>
                      </div>
                      {assignment.status === "pending" && (
                        <Button size="sm" variant="outline">
                          Submit
                        </Button>
                      )}
                      {assignment.status === "graded" && (
                        <Button size="sm" variant="ghost">
                          View Feedback
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Subject Progress</CardTitle>
                  <CardDescription>Track your performance across all subjects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {subjectProgress.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <span className="font-semibold">{item.subject}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-semibold">
                            Grade: {item.grade}
                          </Badge>
                          <span className="text-sm font-medium">{item.progress}%</span>
                        </div>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                    <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900 dark:text-green-100">Strong Performance</h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        You're excelling in Computer Science and Mathematics. Keep up the great work!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                    <Award className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-900 dark:text-amber-100">Areas for Improvement</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        Focus more on Geography revision. Consider attending extra study sessions.
                      </p>
                    </div>
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
