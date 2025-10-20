import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Quote, TrendingUp, Award } from "lucide-react"

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: "Tapiwa Makumbe",
      level: "O-Level Graduate",
      subject: "Mathematics",
      grade: "A*",
      image: "/african-student-portrait.jpg",
      initials: "TM",
      quote:
        "GlobeDk Elite transformed my understanding of Mathematics. I went from struggling with basic algebra to achieving an A* in my O-Levels. The tutors are patient and explain concepts in ways that actually make sense.",
      improvement: "From D to A*",
    },
    {
      name: "Rudo Makore",
      level: "A-Level Graduate",
      subject: "Computer Science",
      grade: "A",
      image: "/african-female-student.jpg",
      initials: "RM",
      quote:
        "The Computer Science program here is exceptional. I learned programming from scratch and now I'm confident in my coding skills. The practical approach and real-world examples made all the difference.",
      improvement: "From beginner to A grade",
    },
    {
      name: "Tanatswa Mutasa",
      level: "O-Level Graduate",
      subject: "English Language",
      grade: "A",
      image: "/african-male-student.jpg",
      initials: "TM",
      quote:
        "I always struggled with essay writing until I joined GlobeDk Elite. The English tutors taught me structure, vocabulary, and critical thinking. My grades improved dramatically within just three months.",
      improvement: "From C to A",
    },
    {
      name: "Chipo Gava",
      level: "A-Level Graduate",
      subject: "Pure Mathematics",
      grade: "A",
      image: "/african-female-student-smiling.jpg",
      initials: "CG",
      quote:
        "Pure Maths seemed impossible at first, but the tutors at GlobeDk Elite broke down complex concepts into manageable pieces. The recorded lessons were invaluable for revision. Highly recommend!",
      improvement: "From E to A",
    },
    {
      name: "Farai Sibanda",
      level: "O-Level Graduate",
      subject: "Geography",
      grade: "A",
      image: "/african-student-happy.jpg",
      initials: "FS",
      quote:
        "Geography became my favorite subject thanks to GlobeDk Elite. The tutors use real-world examples and make learning interactive. I achieved an A and now I'm pursuing it at A-Level.",
      improvement: "From B to A",
    },
    {
      name: "Nyasha Dube",
      level: "A-Level Graduate",
      subject: "Computer Science & Maths",
      grade: "A, A",
      image: "/african-student-graduate.jpg",
      initials: "ND",
      quote:
        "Taking both Computer Science and Pure Maths at A-Level was challenging, but GlobeDk Elite provided the support I needed. The flexible schedule and online options made it possible to excel in both subjects.",
      improvement: "Consistent A grades",
    },
  ]

  const stats = [
    { label: "Students Taught", value: "25+", icon: TrendingUp },
    { label: "Pass Rate", value: "95%", icon: Award },
    { label: "A Grades", value: "60%", icon: Star },
    { label: "Years Experience", value: "2+", icon: Award },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-balance">Student Success Stories</h1>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Real results from real students. See how GlobeDk Elite has helped students achieve their academic goals.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
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

      {/* Testimonials Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 space-y-4">
                  {/* Quote Icon */}
                  <Quote className="h-8 w-8 text-primary/20" />

                  {/* Testimonial Text */}
                  <p className="text-muted-foreground leading-relaxed italic">{testimonial.quote}</p>

                  {/* Student Info */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.image || "/placeholder.svg"} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.level}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default" className="mb-1">
                        Grade: {testimonial.grade}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{testimonial.subject}</p>
                    </div>
                  </div>

                  {/* Improvement Badge */}
                  <div className="flex items-center gap-2 pt-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">{testimonial.improvement}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Transformation Stories</h2>

            <div className="space-y-8">
              {[
                {
                  name: "Tendai M.",
                  subject: "Mathematics",
                  before: "Struggled with basic algebra, scored D in mock exams",
                  after: "Mastered all topics, achieved A* in final O-Level exam",
                  duration: "6 months",
                },
                {
                  name: "Chipo N.",
                  subject: "Pure Mathematics",
                  before: "Failed first A-Level test with E grade",
                  after: "Consistent improvement, final grade A",
                  duration: "18 months",
                },
                {
                  name: "Rudo C.",
                  subject: "Computer Science",
                  before: "No programming experience, intimidated by coding",
                  after: "Built multiple projects, achieved A grade",
                  duration: "12 months",
                },
              ].map((story, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
                      {/* Before */}
                      <div className="space-y-2">
                        <Badge variant="outline" className="mb-2">
                          Before
                        </Badge>
                        <p className="text-muted-foreground">{story.before}</p>
                      </div>

                      {/* Arrow */}
                      <div className="hidden md:flex items-center justify-center">
                        <div className="h-px w-12 bg-border relative">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-border" />
                        </div>
                      </div>

                      {/* After */}
                      <div className="space-y-2">
                        <Badge variant="default" className="mb-2 bg-green-600">
                          After
                        </Badge>
                        <p className="text-foreground font-medium">{story.after}</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                      <div>
                        <span className="font-semibold">{story.name}</span>
                        <span className="text-muted-foreground text-sm ml-2">• {story.subject}</span>
                      </div>
                      <Badge variant="secondary">{story.duration}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Rating Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-8 w-8 fill-current" />
              ))}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Rated 5/5 by Our Students</h2>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Join hundreds of satisfied students who have transformed their academic performance with GlobeDk Elite.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
