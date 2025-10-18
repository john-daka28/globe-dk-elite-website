import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Clock,
  Video,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/african-students-learning-in-modern-classroom.jpg')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Excel in O-Level & A-Level with Professional Tutoring
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
              Welcome to <strong>GlobeDk Elite</strong> — founded by <strong>John Ariphios</strong>, a professional tutor
              with years of proven experience helping students in <strong>Mathematics, Computer Science, English, and
              Geography</strong> achieve their best results.
            </p>
            <p className="text-base text-primary-foreground/80">
              New weekend and online lessons are now open for enrollment in Epworth, Harare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" variant="secondary" className="text-base">
                <Link href="/enroll">
                  Enroll Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground"
              >
                <Link href="/contact">Contact Me</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: "Students Taught", value: "25+" },
              { icon: Award, label: "Pass Rate", value: "95%" },
              { icon: BookOpen, label: "Subjects Covered", value: "7" },
              { icon: GraduationCap, label: "Experience", value: "5+ Years" },
            ].map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Me */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Why Learn with GlobeDk Elite?</h2>
            <p className="text-muted-foreground leading-relaxed">
              As a professional tutor, I combine experience, passion, and innovation to help each student succeed —
              whether in physical or online lessons.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Video,
                title: "Online & Physical Lessons",
                description:
                  "Choose between convenient online classes or engaging weekend lessons in Epworth.",
              },
              {
                icon: BookOpen,
                title: "Comprehensive Study Materials",
                description:
                  "Get access to detailed notes, practice questions, past papers, and revision guides.",
              },
              {
                icon: Clock,
                title: "Flexible Scheduling",
                description:
                  "Classes designed around your school timetable and personal availability.",
              },
              {
                icon: TrendingUp,
                title: "Proven Track Record",
                description:
                  "Hundreds of students improved their grades through personalized guidance and mentoring.",
              },
              {
                icon: Award,
                title: "Professional Experience",
                description:
                  "I’ve taught O & A Level for over a decade, ensuring effective methods that produce results.",
              },
              {
                icon: Users,
                title: "Individual Attention",
                description:
                  "Each learner gets close support, targeted feedback, and encouragement to reach their full potential.",
              },
            ].map((feature, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 space-y-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Subjects Offered</h2>
            <p className="text-muted-foreground leading-relaxed">
              Focused tutoring for O-Level and A-Level students across essential subjects.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-border">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    O
                  </div>
                  <h3 className="text-2xl font-bold">O-Level</h3>
                </div>
                <ul className="space-y-2">
                  {["Mathematics", "English Language", "Computer Science", "Geography"].map((subject, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{subject}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                    A
                  </div>
                  <h3 className="text-2xl font-bold">A-Level</h3>
                </div>
                <ul className="space-y-2">
                  {["Pure Mathematics", "Computer Science", "Geography"].map((subject, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                      <span className="text-foreground">{subject}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button asChild size="lg">
              <Link href="/subjects">
                View All Subjects <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Start Your Success Journey Today</h2>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Whether online or in-person, I’m ready to help you reach your full academic potential. 
              Book your first lesson now and take the first step toward excellence.
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
                <Link href="/timetable">View Timetable</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
