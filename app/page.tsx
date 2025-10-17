import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GraduationCap, BookOpen, Users, Award, Clock, Video, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/classroom-study-session.png')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Master O-Level & A-Level with Expert Tutors
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
              Join GlobeDk Elite in Epworth, Harare for comprehensive tutoring in Maths, English, Computer Science, and
              Geography. Excel in your exams with our proven teaching methods.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" variant="secondary" className="text-base">
                <Link href="/portal">
                  Enroll Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: "Active Students", value: "200+" },
              { icon: Award, label: "Pass Rate", value: "95%" },
              { icon: BookOpen, label: "Subjects Offered", value: "7" },
              { icon: GraduationCap, label: "Expert Tutors", value: "12" },
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

      {/* Why Choose Us */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Why Choose GlobeDk Elite?</h2>
            <p className="text-muted-foreground leading-relaxed">
              We provide comprehensive education that goes beyond textbooks, preparing students for academic excellence
              and future success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Expert Tutors",
                description:
                  "Learn from qualified teachers with years of experience in O-Level and A-Level curriculum.",
              },
              {
                icon: Video,
                title: "Online & Physical Classes",
                description:
                  "Flexible learning options with both online lessons and weekend physical classes in Epworth.",
              },
              {
                icon: BookOpen,
                title: "Comprehensive Materials",
                description: "Access to notes, past papers, assignments, and recorded lessons for effective revision.",
              },
              {
                icon: Clock,
                title: "Flexible Schedule",
                description: "Weekend classes designed to fit around your school timetable without conflicts.",
              },
              {
                icon: TrendingUp,
                title: "Progress Tracking",
                description: "Regular assessments and feedback to monitor your improvement and identify weak areas.",
              },
              {
                icon: Award,
                title: "Proven Results",
                description: "95% pass rate with many students achieving distinctions in their examinations.",
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

      {/* Subjects Overview */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Subjects We Offer</h2>
            <p className="text-muted-foreground leading-relaxed">
              Comprehensive tutoring across key subjects for both O-Level and A-Level students.
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

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Ready to Excel in Your Exams?</h2>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Join hundreds of students who have improved their grades with GlobeDk Elite. Start your journey to
              academic excellence today.
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
