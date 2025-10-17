"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react"

export default function ContactPage() {
  // Contact info for cards
  const contactInfo = [
    {
      icon: Phone,
      title: "Direct Lines (Senior Tutor)",
      details: ["+263 78 605 3315", "+263 71 322 5707"],
      action: "Call or WhatsApp anytime",
    },
    {
      icon: Mail,
      title: "Official Email",
      details: ["johnariphiosd@gmail.com"],
      action: "Expect response within 24 hours",
    },
    {
      icon: MapPin,
      title: "Tutoring Center",
      details: ["Epworth, Harare", "Zimbabwe"],
      action: "Physical and online lessons",
    },
    {
      icon: Clock,
      title: "Lesson Hours",
      details: ["Saturday: 8:00 AM - 6:00 PM", "Sunday: 8:00 AM - 4:00 PM"],
      action: "Weekend & online classes",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-balance">Contact the Senior Tutor</h1>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Hi, I'm <strong>John Ariphios Daka</strong>, Senior Tutor and Founder of GlobeDk Elite Tutoring.
              Whether you’re a student, parent, or teacher, feel free to reach out for lesson schedules,
              enrollment, or partnership inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* Tutor Profile Card */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-border flex flex-col md:flex-row items-center gap-6 p-6 hover:shadow-lg transition-shadow">
            {/* Placeholder for profile image */}
            <div className="h-32 w-32 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
              JD
            </div>
            <div className="flex-1">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl">John Ariphios Daka</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Senior Tutor & Founder — GlobeDk Elite Tutoring
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 mt-2 text-sm text-muted-foreground">
                <p>
                  Passionate tutor specializing in Mathematics, Geography, and Computer Science for O’ and A’ Level.
                  Dedicated to helping students excel through both in-person and online tutoring sessions.
                </p>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {contactInfo.map((info, index) => (
              <Card key={index} className="border-border text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 space-y-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <info.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">
                        {detail}
                      </p>
                    ))}
                  </div>
                  <p className="text-xs text-primary font-medium">{info.action}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Direct Contact */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="border-border bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-600 text-white flex items-center justify-center">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-green-900 dark:text-green-100">Chat with Mr. Daka</CardTitle>
                  <CardDescription className="text-green-700 dark:text-green-300">
                    Senior Tutor — GlobeDk Elite
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-green-700 dark:text-green-300">
                For quick questions and enrollment inquiries, message me directly on WhatsApp.
              </p>
              <div className="space-y-2">
                <Button
                  asChild
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => window.open("https://wa.me/263786053315", "_blank")}
                >
                  <a href="https://wa.me/263786053315" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    +263 78 605 3315
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-green-600 text-green-700 hover:bg-green-50 dark:hover:bg-green-950/40 bg-transparent"
                  onClick={() => window.open("https://wa.me/263713225707", "_blank")}
                >
                  <a href="https://wa.me/263713225707" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    +263 71 322 5707
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Map Section */}
    {/* Map Section */}
<section className="py-12">
  <div className="container mx-auto px-4 max-w-4xl">
    <Card className="border-border overflow-hidden">
      <div className="aspect-video">
        <iframe
          title="Epworth, Harare Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2381.567156142828!2d31.0698!3d-17.8002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931d6f7db0e3e1f%3A0x0!2sEpworth%2C%20Harare%2C%20Zimbabwe!5e0!3m2!1sen!2szw!4v1701072000000!5m2!1sen!2szw"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </Card>
  </div>
</section>


      <Footer />
    </div>
  )
}
