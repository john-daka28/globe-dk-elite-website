"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Clock, MapPin, Video, Bell, Download } from "lucide-react"

export default function TimetablePage() {
  const weekendSchedule = [
    {
      day: "Saturday",
      classes: [
        {
          time: "08:00 - 10:00",
          subject: "O-Level Mathematics",
          level: "O-Level",
          mode: "Physical & Online",
          room: "Room A",
        },
        {
          time: "10:30 - 12:30",
          subject: "A-Level Pure Mathematics",
          level: "A-Level",
          mode: "Physical & Online",
          room: "Room A",
        },
        {
          time: "13:00 - 15:00",
          subject: "O-Level Computer Science",
          level: "O-Level",
          mode: "Physical & Online",
          room: "Room B",
        },
        {
          time: "15:30 - 17:30",
          subject: "A-Level Computer Science",
          level: "A-Level",
          mode: "Physical & Online",
          room: "Room B",
        },
      ],
    },
    {
      day: "Sunday",
      classes: [
        {
          time: "08:00 - 10:00",
          subject: "O-Level English Language",
          level: "O-Level",
          mode: "Physical & Online",
          room: "Room A",
        },
        {
          time: "10:30 - 12:30",
          subject: "O-Level Geography",
          level: "O-Level",
          mode: "Physical & Online",
          room: "Room B",
        },
        {
          time: "13:00 - 15:00",
          subject: "A-Level Geography",
          level: "A-Level",
          mode: "Physical & Online",
          room: "Room B",
        },
      ],
    },
  ]

  const announcements = [
    {
      title: "Mid-Term Assessments",
      date: "March 15–17, 2025",
      description: "All students will take mid-term assessments to track progress.",
    },
    {
      title: "Mock Examinations",
      date: "April 20–25, 2025",
      description: "Full mock exams under exam conditions for all students.",
    },
    {
      title: "Parent Consultations",
      date: "May 5, 2025",
      description: "Meetings to discuss student progress and improvement areas.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/40">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4 text-center space-y-5">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Weekend Class Timetable</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Extra lessons by <span className="font-semibold">Tutor John Ariphios</span> — 
            offering O & A Level Mathematics, Computer Science, Geography, and English.
            Attend in person at Epworth or join online.
          </p>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-10 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
            <div className="flex items-center gap-3 p-4 bg-background border rounded-2xl shadow-sm">
              <MapPin className="h-8 w-8 text-primary" />
              <div>
                <div className="font-semibold">Location</div>
                <p className="text-sm text-muted-foreground">Epworth, Harare</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background border rounded-2xl shadow-sm">
              <Video className="h-8 w-8 text-primary" />
              <div>
                <div className="font-semibold">Online Option</div>
                <p className="text-sm text-muted-foreground">Via Zoom or Google Meet</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background border rounded-2xl shadow-sm">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <div className="font-semibold">Days</div>
                <p className="text-sm text-muted-foreground">Saturday & Sunday</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timetable Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl space-y-12">
          {weekendSchedule.map((schedule, index) => (
            <div key={index} className="space-y-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold">{schedule.day}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {schedule.classes.map((classItem, idx) => (
                  <Card
                    key={idx}
                    className="border border-border rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-primary font-semibold">
                          <Clock className="h-4 w-4" />
                          <span>{classItem.time}</span>
                        </div>
                        <Badge variant={classItem.level === "O-Level" ? "default" : "secondary"}>
                          {classItem.level}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-bold">{classItem.subject}</h3>

                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span>👨‍🏫 Tutor: John Ariphios</span>
                        <span>📍 {classItem.room}</span>
                        <span className="flex items-center gap-1">
                          <Video className="h-3 w-3" /> {classItem.mode}
                        </span>
                      </div>

                      <Button asChild size="sm" variant="outline" className="mt-2 hover:scale-105 transition-transform">
                        <Link href="/portal">Join Class</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <Bell className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Upcoming Events & Announcements</h2>
          </div>

          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <Alert key={index} className="border border-border rounded-2xl">
                <AlertDescription>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{announcement.title}</h3>
                      <p className="text-sm text-muted-foreground">{announcement.description}</p>
                    </div>
                    <Badge variant="outline">{announcement.date}</Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 max-w-2xl space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Need a Copy of the Timetable?</h2>
          <p className="text-lg opacity-90">
            Download the complete timetable PDF to stay updated on all classes and key events.
          </p>
          <Button size="lg" variant="secondary" className="hover:scale-105 transition-transform">
            <Download className="mr-2 h-5 w-5" />
            Download Timetable PDF
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
