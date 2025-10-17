import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Target, Eye, Award, Users, BookOpen, TrendingUp } from "lucide-react"

export default function AboutPage() {
  const tutors = [
    {
      name: "John Ariphios",
      role: "Founder & Mathematics Tutor",
      subjects: "Pure Maths, O-Level Maths",
      qualifications: "BSc Mathematics, 10+ years experience",
      initials: "JA",
    },
    {
      // name: "Sarah Moyo",
      role: "English Language Specialist",
      subjects: "O-Level English",
      qualifications: "BA English Literature, 8 years experience",
      initials: "SM",
    },
    {
      // name: "David Chikwanha",
      role: "Computer Science Expert",
      subjects: "O-Level & A-Level Computer Science",
      qualifications: "BSc Computer Science, 7 years experience",
      initials: "DC",
    },
    {
      // name: "Grace Mutasa",
      role: "Geography Specialist",
      subjects: "O-Level & A-Level Geography",
      qualifications: "BSc Geography, 9 years experience",
      initials: "GM",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-balance">About GlobeDk Elite</h1>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Empowering students in Harare to achieve academic excellence through quality education and dedicated
              support.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">Our Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Founded in Epworth, Harare, GlobeDk Elite was born from a passion to provide quality education to
                    students preparing for their O-Level and A-Level examinations. We recognized the need for
                    accessible, expert tutoring that goes beyond traditional classroom teaching.
                  </p>
                  <p>
                    Over the years, we have helped hundreds of students achieve their academic goals, with a 95% pass
                    rate and numerous distinctions. Our commitment to excellence and personalized attention has made us
                    a trusted name in educational support.
                  </p>
                  <p>
                    Today, we offer both online and physical classes, ensuring that every student has access to quality
                    education regardless of their location or schedule constraints.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-lg bg-muted overflow-hidden">
                  <img
                    src="/african-students-learning-in-modern-classroom.jpg"
                    alt="Students learning"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-border">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To provide accessible, high-quality tutoring that empowers students in Harare and beyond to excel in
                  their O-Level and A-Level examinations, building a strong foundation for their future academic and
                  professional success.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To become the leading educational institution in Zimbabwe, recognized for transforming students'
                  academic performance and fostering a love for learning that extends beyond examinations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground leading-relaxed">
              The principles that guide everything we do at GlobeDk Elite.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Award,
                title: "Excellence",
                description: "We strive for the highest standards in teaching and student achievement.",
              },
              {
                icon: Users,
                title: "Student-Centered",
                description: "Every decision we make prioritizes the success and wellbeing of our students.",
              },
              {
                icon: BookOpen,
                title: "Continuous Learning",
                description: "We foster a culture of curiosity and lifelong learning for both students and tutors.",
              },
              {
                icon: TrendingUp,
                title: "Growth Mindset",
                description: "We believe every student can improve with the right support and dedication.",
              },
              {
                icon: Target,
                title: "Integrity",
                description: "We maintain honesty, transparency, and ethical practices in all our interactions.",
              },
              {
                icon: Users,
                title: "Community",
                description: "We build a supportive learning community where everyone can thrive together.",
              },
            ].map((value, index) => (
              <Card key={index} className="border-border text-center">
                <CardContent className="pt-6 space-y-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Tutors */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Expert Tutors</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our team of qualified and experienced educators dedicated to your success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {tutors.map((tutor, index) => (
              <Card key={index} className="border-border text-center">
                <CardContent className="pt-6 space-y-4">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage
                      src={`/placeholder.svg?height=200&width=200&query=professional+african+teacher+portrait`}
                    />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {tutor.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">{tutor.name}</h3>
                    <p className="text-sm text-primary font-medium">{tutor.role}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Subjects:</span> {tutor.subjects}
                    </p>
                    <p className="text-muted-foreground">{tutor.qualifications}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
