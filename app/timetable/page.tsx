
"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Bell,
  BookOpen,
  Info,
  ArrowRight,
} from "lucide-react";
const handleEnrollClick = () => {
  const message =
    "Hello GlobeDk Elite Academy. I am interested in your online tutoring services and would like to know more about the available lessons, subjects, fees and class schedules. I would also like to know how I can enrol. Thank you."

  const whatsappUrl = `https://wa.me/263786053315?text=${encodeURIComponent(message)}`

  window.open(whatsappUrl, "_blank")
}
export default function TimetablePage() {
  const lessonInformation = [
    {
      icon: Calendar,
      title: "Monday – Friday",
      description:
        "Lessons are conducted throughout the school week according to the current academic programme.",
    },
    {
      icon: BookOpen,
      title: "Flexible Learning",
      description:
        "Subjects, topics, and lesson times are planned according to the content that needs to be covered and students' learning needs.",
    },
    {
      icon: Video,
      title: "Physical & Online",
      description:
        "Students can attend lessons in person or participate online through available learning platforms.",
    },
  ];

  const scheduleFactors = [
    {
      icon: BookOpen,
      title: "Topics Being Covered",
      description:
        "Lesson planning is based on the specific topics that need to be taught. Topics that require more explanation or practice may be allocated additional lesson time.",
    },
    {
      icon: Clock,
      title: "Students' Learning Needs",
      description:
        "The programme can be adjusted to give students more time to understand, practise, and apply challenging concepts.",
    },
    {
      icon: Calendar,
      title: "Academic Progress",
      description:
        "The schedule may change as students progress through the syllabus and move from new topics to revision, practice, or assessments.",
    },
    {
      icon: Bell,
      title: "Weekly Updates",
      description:
        "Students and parents are informed of relevant lesson times, topics, and schedule changes so they can plan accordingly.",
    },
  ];

  const announcements = [
    {
      title: "Weekday Lessons",
      date: "Monday – Friday",
      description:
        "Lessons are conducted throughout the school week. The exact subjects and lesson times may vary depending on the week's academic programme.",
    },
    {
      title: "Topic-Based Learning",
      date: "Flexible",
      description:
        "Each lesson focuses on the topics that need to be covered, with sufficient time provided for explanation, practice, and understanding.",
    },
    {
      title: "Schedule Updates",
      date: "As Required",
      description:
        "Students and parents will be informed of upcoming lesson times, topics, and any relevant changes to the programme.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/40">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4 text-center space-y-5">
          <Badge
            variant="secondary"
            className="mb-2 px-4 py-2 text-sm font-semibold"
          >
            Monday – Friday Lessons
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Weekly Lesson Schedule
          </h1>

          <p className="text-lg opacity-90 max-w-3xl mx-auto leading-relaxed">
            GlobeDK Elite Academy provides structured weekday lessons designed
            around the topics, syllabus requirements, and learning needs of our
            students.
          </p>

          <p className="text-base opacity-80 max-w-2xl mx-auto leading-relaxed">
            Our schedule is flexible rather than fixed. Lesson times, subjects,
            and topics may vary from week to week depending on the academic
            programme.
          </p>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-10 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <Alert className="border-primary/20 bg-background rounded-2xl shadow-sm">
            <Info className="h-5 w-5 text-primary" />

            <AlertDescription>
              <div className="space-y-2">
                <h2 className="font-bold text-foreground text-lg">
                  Important Schedule Information
                </h2>

                <p className="text-muted-foreground leading-relaxed">
                  Lessons take place from{" "}
                  <span className="font-semibold text-foreground">
                    Monday to Friday
                  </span>
                  . Rather than following a rigid timetable with the same
                  subject at the same time every week, our programme is
                  organised according to the topics that need to be covered and
                  the learning needs of our students.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  Students and parents will be informed of the relevant lesson
                  times, topics, and schedule updates as part of the weekly
                  programme.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* How Lessons Work */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              How Our Weekly Lessons Work
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed">
              Our weekday programme is designed to provide focused learning
              time while allowing flexibility to respond to the academic
              requirements of each week.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {lessonInformation.map((item, index) => {
              const Icon = item.icon;

              return (
                <Card
                  key={index}
                  className="border border-border rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>

                    <h3 className="text-xl font-bold">{item.title}</h3>

                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* What Determines the Schedule */}
      <section className="py-16 md:py-20 bg-muted/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              What Determines the Lesson Schedule?
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed">
              The weekly programme is arranged according to the academic work
              that needs to be completed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {scheduleFactors.map((item, index) => {
              const Icon = item.icon;

              return (
                <Card
                  key={index}
                  className="rounded-2xl border shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>

                      <h3 className="text-xl font-bold">{item.title}</h3>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learning Options */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Learning Options
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed">
              Students can participate in lessons through either physical or
              online learning arrangements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Physical Lessons</h3>

                  <p className="text-muted-foreground leading-relaxed">
                    Attend lessons in person at our learning location in
                    Epworth, Harare.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 shrink-0">
                  <Video className="h-6 w-6 text-primary" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Online Lessons</h3>

                  <p className="text-muted-foreground leading-relaxed">
                    Participate remotely through available online platforms
                    such as Zoom or Google Meet.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Weekly Updates */}
      <section className="py-16 md:py-20 bg-muted/40">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
            <div className="flex justify-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10">
                <Bell className="h-6 w-6 text-primary" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold">
              Weekly Updates & Announcements
            </h2>

            <p className="text-muted-foreground text-lg">
              Keep informed about the current lesson programme and any
              important schedule updates.
            </p>
          </div>

          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <Alert
                key={index}
                className="border border-border rounded-2xl bg-background"
              >
                <AlertDescription>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground text-lg">
                        {announcement.title}
                      </h3>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {announcement.description}
                      </p>
                    </div>

                    <Badge variant="outline" className="w-fit shrink-0">
                      {announcement.date}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Join GlobeDK Elite Academy?
          </h2>

          <p className="text-lg opacity-90 leading-relaxed max-w-2xl mx-auto">
            Enrol today and become part of our weekday learning programme.
            Students and parents will receive the relevant information about
            upcoming lessons, topics, and the current weekly programme.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
           <Button
  onClick={handleEnrollClick}
  size="lg"
  variant="secondary"
  className="cursor-pointer text-base"
>
 Join Class
  <ArrowRight className="ml-2 h-5 w-5" />
</Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 hover:scale-105 transition-transform"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

