import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calculator, Globe, Laptop, FileText, CheckCircle2, Clock, DollarSign } from "lucide-react"

export default function SubjectsPage() {
  const oLevelSubjects = [
    {
      name: "Mathematics",
      icon: Calculator,
      description:
        "Comprehensive coverage of algebra, geometry, trigonometry, and statistics. Build strong problem-solving skills.",
      topics: ["Algebra", "Geometry", "Trigonometry", "Statistics", "Number Systems"],
      duration: "2 hours per week",
      fee: "$30/month",
    },
    {
      name: "English Language",
      icon: FileText,
      description:
        "Master reading comprehension, writing skills, grammar, and literature analysis for excellent communication.",
      topics: ["Grammar", "Composition", "Comprehension", "Literature", "Oral Skills"],
      duration: "2 hours per week",
      fee: "$25/month",
    },
    {
      name: "Computer Science",
      icon: Laptop,
      description:
        "Learn programming fundamentals, algorithms, data structures, and practical computing skills for the digital age.",
      topics: ["Programming", "Algorithms", "Data Structures", "Databases", "Networks"],
      duration: "2 hours per week",
      fee: "$35/month",
    },
    {
      name: "Geography",
      icon: Globe,
      description:
        "Explore physical and human geography, map skills, environmental issues, and global development patterns.",
      topics: ["Physical Geography", "Human Geography", "Map Skills", "Environment", "Development"],
      duration: "2 hours per week",
      fee: "$25/month",
    },
  ]

  const aLevelSubjects = [
    {
      name: "Pure Mathematics",
      icon: Calculator,
      description:
        "Advanced mathematical concepts including calculus, complex numbers, vectors, and mathematical proof techniques.",
      topics: ["Calculus", "Complex Numbers", "Vectors", "Differential Equations", "Proof"],
      duration: "3 hours per week",
      fee: "$40/month",
    },
    {
      name: "Computer Science",
      icon: Laptop,
      description:
        "Advanced programming, software engineering, computer architecture, and theoretical computer science concepts.",
      topics: ["Advanced Programming", "Software Engineering", "Computer Architecture", "Theory", "Projects"],
      duration: "3 hours per week",
      fee: "$45/month",
    },
    {
      name: "Geography",
      icon: Globe,
      description:
        "In-depth study of geographical processes, research methods, and contemporary global issues and challenges.",
      topics: ["Geographical Processes", "Research Methods", "Global Issues", "Fieldwork", "Analysis"],
      duration: "3 hours per week",
      fee: "$35/month",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-balance">Our Subjects</h1>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Comprehensive tutoring across key subjects for O-Level and A-Level students with expert guidance and
              proven results.
            </p>
          </div>
        </div>
      </section>

      {/* O-Level Subjects */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                O
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">O-Level Subjects</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-3xl">
              Build a strong foundation with our O-Level courses designed to help you excel in your examinations and
              prepare for A-Level studies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {oLevelSubjects.map((subject, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <subject.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{subject.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          O-Level
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">{subject.description}</p>

                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Topics Covered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {subject.topics.map((topic, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{subject.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{subject.fee}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* A-Level Subjects */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xl">
                A
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">A-Level Subjects</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-3xl">
              Advanced courses that prepare you for university and develop deep understanding of specialized subjects.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aLevelSubjects.map((subject, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <subject.icon className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{subject.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1 bg-secondary text-secondary-foreground">
                          A-Level
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">{subject.description}</p>

                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Topics Covered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {subject.topics.map((topic, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{subject.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{subject.fee}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">What's Included in Every Subject</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Expert tutors with years of teaching experience",
                "Comprehensive notes and study materials",
                "Access to past examination papers",
                "Regular assignments and assessments",
                "Recorded lessons for revision",
                "Progress tracking and feedback",
                "Online and physical class options",
                "Small class sizes for personalized attention",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Ready to Start Learning?</h2>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Enroll now and get access to expert tutoring, comprehensive materials, and a supportive learning
              community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" variant="secondary">
                <Link href="/portal">Enroll Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
