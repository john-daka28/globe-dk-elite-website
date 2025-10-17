"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, Clock, MessageSquare, Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock form submission
    alert("Thank you for your message! We will get back to you soon.")
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Numbers",
      details: ["+263 78 605 3315", "+263 71 322 5707"],
      action: "Call us anytime",
    },
    {
      icon: Mail,
      title: "Email Address",
      details: ["johnariphiosd@gmail.com"],
      action: "Send us an email",
    },
    {
      icon: MapPin,
      title: "Physical Location",
      details: ["Epworth, Harare", "Zimbabwe"],
      action: "Visit our center",
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Saturday: 8:00 AM - 6:00 PM", "Sunday: 8:00 AM - 4:00 PM"],
      action: "Weekend classes",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-balance">Get In Touch</h1>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Have questions about our programs? Want to enroll? We're here to help. Reach out to us anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-muted/30">
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

      {/* Contact Form & Map */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Send Us a Message</h2>
                <p className="text-muted-foreground">Fill out the form below and we'll respond within 24 hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+263 XX XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="What is this regarding?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-6">
              {/* Map Placeholder */}
              <Card className="border-border overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <MapPin className="h-12 w-12 text-primary mx-auto" />
                      <p className="text-sm text-muted-foreground">Epworth, Harare, Zimbabwe</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* WhatsApp Contact */}
              <Card className="border-border bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-600 text-white flex items-center justify-center">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-green-900 dark:text-green-100">WhatsApp Us</CardTitle>
                      <CardDescription className="text-green-700 dark:text-green-300">
                        Get instant responses
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    For quick questions and enrollment inquiries, message us on WhatsApp.
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

              {/* FAQ Quick Links */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "What are the class schedules?",
                    "How much are the fees?",
                    "Do you offer online classes?",
                    "How do I enroll?",
                  ].map((question, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm"
                    >
                      {question}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
