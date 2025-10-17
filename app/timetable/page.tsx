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
          tutor: "John Ariphios",
          mode: "Physical & Online",
          room: "Room A",
        },
        {
          time: "10:30 - 12:30",
          subject: "A-Level Pure Mathematics",
          level: "A-Level",
          tutor: "John Ariphios",
          mode: "Physical & Online",
          room: "Room A",
        },
        {
          time: "13:00 - 15:00",
          subject: "O-Level Computer Science",
          level: "O-Level",
          tutor: "David Chikwanha",
          mode: "Physical & Online",
          room: "Room B",
        },
        {
          time: "15:30 - 17:30",
          subject: "A-Level Computer Science",
          level: "A-Level",
          tutor: "David Chikwanha",
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
          tutor: "Sarah Moyo",
          mode: "Physical & Online",
          room: "Room A",
        },
        {
          time: "10:30 - 12:30",
          subject: "O-Level Geography",
          level: "O-Level",
          tutor: "Grace Mutasa",
          mode: "Physical & Online",
          room: "Room B",
        },
        {
          time: "13:00 - 15:00",
          subject: "A-Level Geography",
          level: "A-Level",
          tutor: "Grace Mutasa",
          mode: "Physical & Online",
          room: "Room B",
        },
      ],
    },
  ]

  const announcements = [
    {
      title: "Mid-Term Assessments",
      date: "March 15-17, 2025",
      description: "All students will take mid-term assessments to track progress.",
    },
    {
      title: "Mock Examinations",
      date: "April 20-25, 2025",
      description: "Full mock exams under examination conditions for all levels.",
    },
    {
      title: "Parent-Teacher Meetings",
      date: "May 5, 2025",
      description: "Discuss student progress and areas for improvement.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-balance">Class Timetable</h1>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Weekend classes designed to fit your schedule. All classes available both physically in Epworth and
              online.
            </p>
          </div>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border">
              <MapPin className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <div className="font-semibold">Physical Location</div>
                <div className="text-sm text-muted-foreground">Epworth, Harare</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border">
              <Video className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <div className="font-semibold">Online Classes</div>
                <div className="text-sm text-muted-foreground">Via Zoom/Google Meet</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border">
              <Clock className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <div className="font-semibold">Weekend Schedule</div>
                <div className="text-sm text-muted-foreground">Saturday & Sunday</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timetable */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            {weekendSchedule.map((schedule, index) => (
              <div key={index}>
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl md:text-3xl font-bold">{schedule.day}</h2>
                </div>

                <div className="grid gap-4">
                  {schedule.classes.map((classItem, idx) => (
                    <Card key={idx} className="border-border hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-[auto_1fr_auto] gap-4 items-start">
                          {/* Time */}
                          <div className="flex items-center gap-2 text-primary font-semibold min-w-[140px]">
                            <Clock className="h-4 w-4" />
                            <span>{classItem.time}</span>
                          </div>

                          {/* Subject Details */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="text-lg font-bold">{classItem.subject}</h3>
                              <Badge variant={classItem.level === "O-Level" ? "default" : "secondary"}>
                                {classItem.level}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span>Tutor: {classItem.tutor}</span>
                              <span>•</span>
                              <span>{classItem.room}</span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Video className="h-3 w-3" />
                                <span>{classItem.mode}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action */}
                          <Button asChild size="sm" variant="outline" className="whitespace-nowrap bg-transparent">
                            <Link href="/portal">Join Class</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Bell className="h-6 w-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">Upcoming Events & Announcements</h2>
            </div>

            <div className="space-y-4">
              {announcements.map((announcement, index) => (
                <Alert key={index} className="border-border">
                  <AlertDescription>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{announcement.title}</h3>
                        <p className="text-sm text-muted-foreground">{announcement.description}</p>
                      </div>
                      <Badge variant="outline" className="self-start md:self-center whitespace-nowrap">
                        {announcement.date}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Need a Copy of the Timetable?</h2>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Download the full timetable PDF to keep track of all classes and important dates.
            </p>
            <Button size="lg" variant="secondary">
              <Download className="mr-2 h-5 w-5" />
              Download Timetable PDF
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
