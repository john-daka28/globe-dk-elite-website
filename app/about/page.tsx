import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Target, Eye, Award, Users, BookOpen, TrendingUp } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-balance">About GlobeDk Elite</h1>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Founded and led by <strong>John Ariphios</strong> — dedicated to empowering students in Harare and beyond
              through quality education, mentorship, and modern learning support.
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
                <h2 className="text-3xl md:text-4xl font-bold">My Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Hi, I’m <strong>John Ariphios</strong> — the founder and lead tutor of GlobeDk Elite. 
                    Based in Epworth, Harare, I started this tutoring platform out of a deep passion 
                    for helping students unlock their full potential in academics.
                  </p>
                  <p>
                    I specialize in <strong>Mathematics</strong> and <strong>Computer Science</strong> 
                    for both O-Level and A-Level, combining years of teaching experience 
                    with modern tools and methods to make learning engaging and effective.
                  </p>
                  <p>
                    Over the years, I’ve helped hundreds of students achieve outstanding results —
                    many earning distinctions and developing a stronger love for learning.
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
                <h3 className="text-2xl font-bold">My Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To provide accessible, personalized, and high-quality tutoring that empowers students to excel in
                  their O-Level and A-Level exams — and develop skills for lifelong success.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold">My Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To build one of Zimbabwe’s most trusted and innovative tutoring platforms that blends technology,
                  passion, and mentorship — shaping confident, future-ready students.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">My Core Values</h2>
            <p className="text-muted-foreground leading-relaxed">
              These principles guide every lesson and every student interaction at GlobeDk Elite.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[ 
              { icon: Award, title: "Excellence", description: "I aim for the highest standards in teaching and results." },
              { icon: Users, title: "Student-Centered", description: "Every lesson is tailored around your success and understanding." },
              { icon: BookOpen, title: "Continuous Learning", description: "Learning never stops — for both students and teachers." },
              { icon: TrendingUp, title: "Growth Mindset", description: "I believe every student can improve with effort and support." },
              { icon: Target, title: "Integrity", description: "Honesty, professionalism, and dedication in every class." },
              { icon: Users, title: "Community", description: "Building a supportive environment for students to thrive." },
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

      {/* Tutor Section (Personal) */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Meet Your Tutor</h2>
          <Card className="border-border">
            <CardContent className="pt-8 space-y-4">
              <Avatar className="h-35 w-35 mx-auto">
                <AvatarImage src="/john-ariphios.jpg.JPG" alt="John Ariphios" />
                {/* <AvatarFallback className="text-3xl bg-primary text-primary-foreground">JA</AvatarFallback> */}
              </Avatar>
              <div>
                <h3 className="font-bold text-xl">John Ariphios</h3>
                <p className="text-primary font-medium">Founder & Senior Tutor</p>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Subjects:</strong> Mathematics & Computer Science (O-Level & A-Level)</p>
                <p>BSc Mathematics • 10+ Years of Experience</p>
                <p>Based in Epworth, Harare • Offering Physical & Online Lessons</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
