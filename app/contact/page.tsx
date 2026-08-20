
"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  BookOpen,
} from "lucide-react"
import Image from "next/image"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Direct Lines",
      details: ["+263 78 605 3315", "+263 71 322 5707"],
      action: "Call or WhatsApp for enquiries",
    },
    {
      icon: Mail,
      title: "Official Email",
      details: ["johnariphiosd@gmail.com", "principal@globedk.co.zw"],
      action: "We aim to respond within 24 hours",
    },
    {
      icon: MapPin,
      title: "Tutoring Center",
      details: ["Epworth, Harare", "Zimbabwe"],
      action: "Physical and online lessons available",
    },
    {
      icon: Clock,
      title: "School & Lesson Schedule",
      details: [
        "School Hours: 8:00 AM - 4:00 PM",
        "Lessons: Monday - Friday",
      ],
      action: "Flexible learning arrangements available",
    },
  ]

  const subjects = [
    "Mathematics",
    "English Language",
    "Combined Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Geography",
    "History",
    "Heritage Studies",
    "Commerce",
    "Principles of Accounts",
    "Pure Mathematics",
    "Statistics",
    "Business Studies",
    "Economics",
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-balance">
              Contact GlobeDk Elite Academy
            </h1>

            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Hi, I'm <strong>John Ariphios Daka</strong>, Founder and
              Principal of GlobeDk Elite Academy. Whether you're a student,
              parent, guardian, or teacher, feel free to reach out for
              enrolment, lesson schedules, subject enquiries, academic support,
              or partnership opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Tutor Profile Card */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-border flex flex-col md:flex-row items-center gap-6 p-6 hover:shadow-lg transition-shadow">
            <Image
              src="/image.jpg"
              alt="GlobeDk Elite Academy lessons"
              width={160}
              height={160}
              className="rounded-full border-4 border-primary shadow-md object-cover hover:scale-105 transition-transform duration-300"
            />

            <div className="flex-1 text-center md:text-left">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl">
                  John Ariphios Daka
                </CardTitle>

                <CardDescription className="text-muted-foreground">
                  Founder & Principal — GlobeDk Elite Academy
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 mt-2 text-sm text-muted-foreground">
                <p>
                  GlobeDk Elite Academy provides academic support for O-Level
                  and A-Level learners through physical lessons, online
                  lessons, homeschooling, one-on-one tutoring, revision,
                  homework assistance, and examination preparation.
                </p>

                <p className="mt-3">
                  We support learners across a wide range of Arts, Commercial,
                  Science, and Technology subjects for both ZIMSEC and
                  Cambridge curricula.
                </p>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="border-border text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6 space-y-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <info.icon className="h-6 w-6 text-primary" />
                  </div>

                  <h3 className="font-semibold">{info.title}</h3>

                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p
                        key={idx}
                        className="text-sm text-muted-foreground"
                      >
                        {detail}
                      </p>
                    ))}
                  </div>

                  <p className="text-xs text-primary font-medium">
                    {info.action}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-8">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>

            <h2 className="text-3xl font-bold">
              We Offer Many Subjects
            </h2>

            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              GlobeDk Elite Academy provides tutoring across a wide range of
              subjects for O-Level and A-Level learners. Our subjects cover
              Arts, Commercials, Sciences, and Technology.
            </p>
          </div>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-border bg-background px-4 py-3 text-center text-sm font-medium hover:bg-primary/5 hover:border-primary/40 transition-colors"
                  >
                    {subject}
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Subject availability may vary by level and programme.
                </p>

                <Button
                  asChild
                  variant="outline"
                  className="mt-4"
                >
                  <a
                    href="https://www.globedk.co.zw/subjects"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View All Subjects
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* WhatsApp Direct Contact */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="border-border bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-600 text-white flex items-center justify-center">
                  <MessageSquare className="h-5 w-5" />
                </div>

                <div>
                  <CardTitle className="text-green-900 dark:text-green-100">
                    Chat with GlobeDk
                  </CardTitle>

                  <CardDescription className="text-green-700 dark:text-green-300">
                    Speak directly with our Senior Tutor
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-sm text-green-700 dark:text-green-300">
                Have a question about subjects, enrolment, lesson schedules,
                online classes, physical lessons, or examination preparation?
                Send us a message on WhatsApp.
              </p>

              <div className="space-y-2">
                {/* WhatsApp Number 1 */}
                <Button
                  asChild
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <a
                    href="https://wa.me/263786053315"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* WhatsApp Icon */}
                    <svg
                      className="mr-2 h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.91c0 2.1.55 4.15 1.59 5.96L.05 24l6.27-1.64a11.86 11.86 0 0 0 5.74 1.47h.01c6.56 0 11.9-5.34 11.9-11.91 0-3.18-1.24-6.17-3.45-8.44ZM12.07 21.78h-.01a9.85 9.85 0 0 1-5.02-1.37l-.36-.21-3.72.97.99-3.63-.23-.37a9.86 9.86 0 0 1-1.51-5.26C2.21 6.48 6.64 2.05 12.07 2.05c2.63 0 5.1 1.03 6.96 2.89a9.82 9.82 0 0 1 2.88 6.98c0 5.43-4.42 9.86-9.84 9.86Zm5.41-7.39c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.35.2 1.86.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                    </svg>

                    WhatsApp: +263 78 605 3315
                  </a>
                </Button>

                {/* WhatsApp Number 2 */}
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-green-600 text-green-700 hover:bg-green-50 dark:hover:bg-green-950/40 bg-transparent"
                >
                  <a
                    href="https://wa.me/263713225707"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* WhatsApp Icon */}
                    <svg
                      className="mr-2 h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.91c0 2.1.55 4.15 1.59 5.96L.05 24l6.27-1.64a11.86 11.86 0 0 0 5.74 1.47h.01c6.56 0 11.9-5.34 11.9-11.91 0-3.18-1.24-6.17-3.45-8.44ZM12.07 21.78h-.01a9.85 9.85 0 0 1-5.02-1.37l-.36-.21-3.72.97.99-3.63-.23-.37a9.86 9.86 0 0 1-1.51-5.26C2.21 6.48 6.64 2.05 12.07 2.05c2.63 0 5.1 1.03 6.96 2.89a9.82 9.82 0 0 1 2.88 6.98c0 5.43-4.42 9.86-9.84 9.86Zm5.41-7.39c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.35.2 1.86.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                    </svg>

                    WhatsApp: +263 71 322 5707
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Learning Schedule Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                Learning Schedule
              </CardTitle>

              <CardDescription>
                Flexible academic support designed around the learner's needs
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-lg border border-border p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="h-5 w-5 text-primary" />

                    <h3 className="font-semibold">
                      School Hours
                    </h3>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    School operates from{" "}
                    <strong>8:00 AM to 4:00 PM</strong>.
                  </p>
                </div>

                <div className="rounded-lg border border-border p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <BookOpen className="h-5 w-5 text-primary" />

                    <h3 className="font-semibold">
                      Lessons
                    </h3>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Lessons are conducted from{" "}
                    <strong>Monday to Friday</strong>, with arrangements
                    available for different learning programmes.
                  </p>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Contact us to confirm the timetable, subject availability,
                programme, and preferred learning format.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Location / Map */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">
              Find GlobeDk Elite Academy
            </h2>

            <p className="text-muted-foreground mt-2">
              Visit GlobeDk Elite Academy in Epworth, Harare, Zimbabwe.
            </p>
          </div>

          <Card className="border-border overflow-hidden">
            <div className="aspect-video">
              <iframe
                title="GlobeDk Elite Academy - Google Maps"
                src="https://www.google.com/maps?q=GlobeDk%20Elite%20Academy%2C%20Harare%2C%20Zimbabwe&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Card>

          <div className="text-center mt-4">
            <a
              href="https://www.google.com/maps/search/?api=1&query=GlobeDk%20Elite%20Academy%2C%20Harare%2C%20Zimbabwe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <MapPin className="h-4 w-4" />
              Open GlobeDk Elite Academy in Google Maps
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
