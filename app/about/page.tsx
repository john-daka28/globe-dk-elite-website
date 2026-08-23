import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Award,
  BookOpen,
  Eye,
  Globe,
  Laptop,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { PageHero, Reveal, Rule, SectionLabel } from "@/components/editorial"

const subjects = [
  "Mathematics",
  "Pure Mathematics",
  "Statistics",
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
  "Business Studies",
  "Economics",
  "Principles of Accounts",
]

const reasons = [
  {
    icon: Users,
    title: "Experienced Tutors",
    description: "Dedicated tutors providing professional guidance, mentorship and personalised academic support.",
  },
  {
    icon: BookOpen,
    title: "Complete Subject Coverage",
    description: "Comprehensive O-Level and A-Level learning across Sciences, Commercials, Arts and Technology subjects.",
  },
  {
    icon: TrendingUp,
    title: "Excellent Results",
    description: "Focused exam preparation, revision classes and proven strategies that help students improve performance.",
  },
  {
    icon: Globe,
    title: "Learn Anywhere",
    description: "Attend Online Lessons from anywhere in Zimbabwe or internationally using live virtual classrooms.",
  },
  {
    icon: Laptop,
    title: "Modern Learning",
    description: "Interactive digital resources, practical demonstrations and engaging teaching techniques.",
  },
  {
    icon: Award,
    title: "Quality Education",
    description: "Professional, affordable and student-centred education designed to prepare learners for academic success.",
  },
]

export default function AboutPage() {
  return (
    <div className="homepage-shell min-h-screen overflow-x-clip bg-[#f4f1ea] text-[#14263d]">
      <Navigation />

      <main>
        <PageHero
          number="01"
          eyebrow="The academy"
          title={<>A modern learning centre built around every learner.</>}
          description={<>GlobeDk Elite Academy is a Zimbabwean tutoring academy offering professional <strong className="font-semibold text-white">Online Lessons</strong>, <strong className="font-semibold text-white">Physical Lessons</strong>, <strong className="font-semibold text-white">Home Schooling</strong>, <strong className="font-semibold text-white">Live Virtual Classes</strong>, <strong className="font-semibold text-white">Weekend Lessons</strong> and <strong className="font-semibold text-white">One-on-One Tutoring</strong> for both <strong className="font-semibold text-white">ZIMSEC</strong> and <strong className="font-semibold text-white">Cambridge</strong> learners.</>}
          sideLabel="Harare / Zimbabwe · Serving learners beyond borders"
        />

        <section className="bg-[#f4f1ea] py-20 sm:py-28">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
              <Reveal>
                <SectionLabel number="02">Our story</SectionLabel>
                <div className="mt-7 flex h-14 w-14 items-center justify-center rounded-full border border-[#b15d2b]/30 text-[#b15d2b]"><ArrowRight className="h-5 w-5 rotate-45" aria-hidden="true" /></div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                  <div>
                    <h2 className="font-serif text-5xl leading-[0.96] tracking-[-0.05em] sm:text-6xl">Transforming education through <span className="text-[#b15d2b]">innovation</span> and excellence.</h2>
                    <div className="mt-8 space-y-5 text-base leading-relaxed text-[#526071] sm:text-lg">
                      <p>GlobeDk Elite Academy was founded with one vision—to make quality education accessible to every learner regardless of location. We combine traditional classroom excellence with modern technology to deliver engaging online and physical lessons that produce outstanding academic results.</p>
                      <p>We proudly prepare students for both <strong className="font-semibold text-[#14263d]">ZIMSEC</strong> and <strong className="font-semibold text-[#14263d]">Cambridge</strong> examinations while offering personalized tutoring, homeschooling, revision classes, homework assistance, holiday lessons and live virtual classes.</p>
                      <p>Our academy now supports learners in Sciences, Commercials, Humanities and Technology subjects from O-Level through A-Level, helping students build confidence, critical thinking and lifelong learning skills.</p>
                    </div>
                  </div>
                  <div className="relative min-h-[24rem] overflow-hidden rounded-[2rem] bg-[#10243d] shadow-[0_24px_70px_rgba(20,38,61,.16)]">
                    <Image src="/african-students-learning-in-modern-classroom.jpg" alt="Students learning in a GlobeDk classroom" fill className="object-cover opacity-90" sizes="(min-width: 1024px) 34vw, 100vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1d33]/80 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white"><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#e3a56f]">Founded with purpose</p><p className="mt-2 font-serif text-2xl leading-tight">Quality education, made more accessible.</p></div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#10243d] py-20 text-[#f8f4eb] sm:py-28">
          <div aria-hidden="true" className="absolute -right-32 top-12 h-[30rem] w-[30rem] rounded-full border border-white/10" />
          <div className="container relative z-10">
            <div className="grid gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:gap-24">
              <Reveal>
                <SectionLabel number="03" light>What we teach</SectionLabel>
                <h2 className="mt-6 max-w-sm font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">A broad academic foundation for the next chapter.</h2>
                <Button asChild variant="outline" className="mt-8 rounded-full border-white/25 bg-transparent text-white hover:bg-white/10"><Link href="/subjects">Explore all subjects <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
              </Reveal>
              <div>
                <div className="mb-3 hidden grid-cols-[4rem_1fr] border-b border-white/15 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 sm:grid"><span>No.</span><span>Subject coverage</span></div>
                {["Sciences", "Commercials", "Arts & Humanities", "Technology"].map((group, index) => {
                  const groupSubjects = index === 0 ? subjects.slice(0, 8) : index === 1 ? subjects.slice(8, 13) : index === 2 ? subjects.slice(9, 12) : subjects.slice(7, 9)
                  return (
                    <Reveal key={group} delay={index * 0.06} className="group grid gap-4 border-b border-white/15 py-6 sm:grid-cols-[4rem_1fr] sm:items-center">
                      <span className="text-sm font-semibold text-[#e3a56f]">0{index + 1}</span>
                      <div><h3 className="font-serif text-2xl tracking-[-0.02em] text-white transition-colors group-hover:text-[#e3a56f] sm:text-3xl">{group}</h3><p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">{groupSubjects.join(", ")}</p></div>
                    </Reveal>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#eae4d9] py-20 sm:py-28">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {[{ icon: Target, title: "Our Mission", copy: ["Our mission is to provide affordable, accessible and high-quality education through Online Lessons, Physical Lessons, Live Virtual Classes, Homeschooling, One-on-One Tutoring, Holiday Lessons and Weekend Lessons.", "We are committed to helping every learner master O-Level and A-Level subjects, improve confidence, develop problem-solving skills and achieve excellent results in both ZIMSEC and Cambridge examinations."] }, { icon: Eye, title: "Our Vision", copy: ["To become Zimbabwe's leading digital learning academy, recognised for academic excellence, innovation, professionalism and outstanding student success in Sciences, Commercials, Arts and Technology education.", "We envision empowering learners across Zimbabwe and internationally with modern education that prepares them for university, employment, entrepreneurship and lifelong learning."] }].map(({ icon: Icon, title, copy }, index) => (
                <Reveal key={title} delay={index * 0.1} className="border-t border-[#c9c1b4] pt-6 sm:pt-8">
                  <div className="flex items-start justify-between gap-6"><div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#b15d2b]/30 text-[#b15d2b]"><Icon className="h-5 w-5" aria-hidden="true" /></div><span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#b15d2b]">0{index + 1} / principle</span></div>
                  <h2 className="mt-10 font-serif text-4xl tracking-[-0.04em] sm:text-5xl">{title}</h2>
                  <div className="mt-6 space-y-4 text-base leading-relaxed text-[#526071]"><p>{copy[0]}</p><p>{copy[1]}</p></div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f4f1ea] py-20 sm:py-28">
          <div className="container">
            <Reveal><SectionLabel number="04">Why GlobeDk</SectionLabel><div className="mt-6 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end"><h2 className="max-w-xl font-serif text-5xl leading-[0.96] tracking-[-0.05em] sm:text-6xl">Built for confident, <span className="text-[#b15d2b]">independent</span> learners.</h2><p className="max-w-xl text-base leading-relaxed text-[#526071] sm:text-lg">GlobeDk Elite Academy combines experienced tutoring, modern teaching methods and flexible learning options to help every learner achieve academic excellence.</p></div></Reveal>
            <div className="mt-14 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">{reasons.map(({ icon: Icon, title, description }, index) => <Reveal key={title} delay={index * 0.05} className="border-t border-[#d9d3c8] py-6"><div className="flex items-center justify-between"><span className="text-[10px] font-bold tracking-[0.2em] text-[#b15d2b]">0{index + 1}</span><Icon className="h-5 w-5 text-[#b15d2b]" aria-hidden="true" /></div><h3 className="mt-8 font-serif text-2xl tracking-[-0.03em]">{title}</h3><p className="mt-3 text-sm leading-relaxed text-[#526071]">{description}</p></Reveal>)}</div>
          </div>
        </section>

        <section className="bg-[#0b1d33] py-20 text-white sm:py-28">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-20">
              <Reveal><div className="relative mx-auto aspect-[0.82] w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/15"><Image src="/john-ariphios.jpg.JPG" alt="Dr John Ariphios Daka" fill className="object-cover" sizes="(min-width: 1024px) 30vw, 90vw" /><div className="absolute inset-0 bg-gradient-to-t from-[#0b1d33]/70 to-transparent" /><p className="absolute bottom-5 left-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e3a56f]">Leadership / 01</p></div></Reveal>
              <Reveal delay={0.1}><SectionLabel number="05" light>Leadership</SectionLabel><h2 className="mt-7 max-w-2xl font-serif text-5xl leading-[0.96] tracking-[-0.05em] sm:text-6xl">Meet our CEO, Founder &amp; Principal.</h2><p className="mt-8 text-base leading-relaxed text-white/70 sm:text-lg">GlobeDk Elite Academy is proudly led by <strong className="font-semibold text-white">Dr John Ariphios Daka</strong>, an accomplished educator, visionary leader and passionate advocate for quality education. His dedication to academic excellence continues to inspire students, parents and educators across Zimbabwe and beyond.</p><div className="mt-8 border-t border-white/15 pt-6"><h3 className="font-serif text-2xl">Dr John Ariphios Daka</h3><p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#e3a56f]">CEO · Founder · Principal</p><p className="mt-5 text-sm leading-relaxed text-white/55">His passion for education, integrity, innovation and student success continues to shape the academy's mission of empowering learners with knowledge, confidence and skills that prepare them for university, careers and lifelong achievement.</p></div></Reveal>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#d87a3f] py-20 text-[#10243d] sm:py-28">
          <div aria-hidden="true" className="absolute -right-20 -top-24 h-80 w-80 rounded-full border border-[#10243d]/15" />
          <div className="container relative z-10"><Reveal><SectionLabel number="06">Begin your next chapter</SectionLabel><div className="mt-6 flex flex-col justify-between gap-10 lg:flex-row lg:items-end"><h2 className="max-w-3xl font-serif text-5xl leading-[0.95] tracking-[-0.05em] sm:text-7xl">Ready to begin your learning journey?</h2><Button asChild size="lg" className="w-full rounded-full bg-[#10243d] px-7 text-white hover:bg-[#193653] sm:w-auto"><Link href="/contact">Contact us <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button></div></Reveal></div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
