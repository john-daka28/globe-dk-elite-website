import Image from "next/image"
import Link from "next/link"
import { Award, ArrowRight, Quote, Star, TrendingUp } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { PageHero, Reveal, SectionLabel } from "@/components/editorial"

const testimonials = [
  { name: "Tapiwa Makumbe", level: "O-Level Graduate", subject: "Mathematics", grade: "A*", image: "/african-student-portrait.jpg", initials: "TM", quote: "GlobeDk Elite transformed my understanding of Mathematics. I went from struggling with basic algebra to achieving an A* in my O-Levels. The tutors are patient and explain concepts in ways that actually make sense.", improvement: "From D to A*" },
  { name: "Rudo Makore", level: "A-Level Graduate", subject: "Computer Science", grade: "A", image: "/african-female-student.jpg", initials: "RM", quote: "The Computer Science program here is exceptional. I learned programming from scratch and now I'm confident in my coding skills. The practical approach and real-world examples made all the difference.", improvement: "From beginner to A grade" },
  { name: "Tanatswa Mutasa", level: "O-Level Graduate", subject: "English Language", grade: "A", image: "/african-male-student.jpg", initials: "TM", quote: "I always struggled with essay writing until I joined GlobeDk Elite. The English tutors taught me structure, vocabulary, and critical thinking. My grades improved dramatically within just three months.", improvement: "From C to A" },
  { name: "Chipo Gava", level: "A-Level Graduate", subject: "Pure Mathematics", grade: "A", image: "/african-female-student-smiling.jpg", initials: "CG", quote: "Pure Maths seemed impossible at first, but the tutors at GlobeDk Elite broke down complex concepts into manageable pieces. The recorded lessons were invaluable for revision. Highly recommend!", improvement: "From E to A" },
  { name: "Farai Sibanda", level: "O-Level Graduate", subject: "Geography", grade: "A", image: "/african-student-happy.jpg", initials: "FS", quote: "Geography became my favorite subject thanks to GlobeDk Elite. The tutors use real-world examples and make learning interactive. I achieved an A and now I'm pursuing it at A-Level.", improvement: "From B to A" },
  { name: "Nyasha Dube", level: "A-Level Graduate", subject: "Computer Science & Maths", grade: "A, A", image: "/african-student-graduate.jpg", initials: "ND", quote: "Taking both Computer Science and Pure Maths at A-Level was challenging, but GlobeDk Elite provided the support I needed. The flexible schedule and online options made it possible to excel in both subjects.", improvement: "Consistent A grades" },
]

const stats = [
  { label: "Students Taught", value: "25+", icon: TrendingUp },
  { label: "Pass Rate", value: "95%", icon: Award },
  { label: "A Grades", value: "60%", icon: Star },
  { label: "Years Experience", value: "2+", icon: Award },
]

const transformations = [
  { name: "Tendai M.", subject: "Mathematics", before: "Struggled with basic algebra, scored D in mock exams", after: "Mastered all topics, achieved A* in final O-Level exam", duration: "6 months" },
  { name: "Chipo N.", subject: "Pure Mathematics", before: "Failed first A-Level test with E grade", after: "Consistent improvement, final grade A", duration: "18 months" },
  { name: "Rudo C.", subject: "Computer Science", before: "No programming experience, intimidated by coding", after: "Built multiple projects, achieved A grade", duration: "12 months" },
]

function StudentAvatar({ testimonial }: { testimonial: (typeof testimonials)[number] }) {
  return <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[#d9d3c8] bg-[#eae4d9]"><Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" sizes="56px" /><span className="sr-only">{testimonial.initials}</span></div>
}

export default function TestimonialsPage() {
  return (
    <div className="homepage-shell min-h-screen overflow-x-clip bg-[#f4f1ea] text-[#14263d]">
      <Navigation />
      <main>
        <PageHero number="01" eyebrow="Student success" title={<>Progress you can <span className="text-[#e3a56f]">feel.</span></>} description={<>Real results from real students. See how GlobeDk Elite has helped students achieve their academic goals through patient tutoring, flexible learning and focused examination preparation.</>} sideLabel="Stories from O-Level and A-Level learners" />

        <section className="bg-[#eae4d9] py-12 sm:py-16"><div className="container"><div className="grid grid-cols-2 divide-x divide-[#c9c1b4] lg:grid-cols-4">{stats.map(({ label, value, icon: Icon }, index) => <Reveal key={label} delay={index * 0.05} className="px-4 py-2 text-center first:pl-0 last:pr-0 sm:px-8"><Icon className="mx-auto h-5 w-5 text-[#b15d2b]" aria-hidden="true" /><p className="mt-4 font-serif text-4xl tracking-[-0.04em] sm:text-5xl">{value}</p><p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#526071]">{label}</p></Reveal>)}</div></div></section>

        <section className="bg-[#f4f1ea] py-20 sm:py-28"><div className="container"><Reveal><SectionLabel number="02">The student voice</SectionLabel><div className="mt-7 grid gap-10 lg:grid-cols-[0.4fr_1.6fr] lg:gap-24"><div><Quote className="h-12 w-12 text-[#b15d2b]" aria-hidden="true" /><p className="mt-6 text-sm leading-relaxed text-[#526071]">Every story begins with a learner who decided to ask for support. These experiences capture the confidence, clarity and momentum that can follow.</p></div><div className="max-w-4xl"><blockquote className="font-serif text-4xl leading-[1.02] tracking-[-0.045em] sm:text-6xl">“The tutors are patient and explain concepts in ways that actually make sense.”</blockquote><div className="mt-8 flex items-center gap-4 border-t border-[#d9d3c8] pt-5"><div className="h-11 w-11 overflow-hidden rounded-full"><Image src="/african-student-portrait.jpg" alt="Tapiwa Makumbe" width={44} height={44} className="h-full w-full object-cover" /></div><div><p className="text-sm font-semibold">Tapiwa Makumbe</p><p className="text-xs text-[#526071]">O-Level Graduate · Mathematics · A*</p></div></div></div></div></Reveal></div></section>

        <section className="bg-[#10243d] py-20 text-[#f8f4eb] sm:py-28"><div className="container"><Reveal><SectionLabel number="03" light>More success stories</SectionLabel><h2 className="mt-6 max-w-3xl font-serif text-5xl leading-[0.96] tracking-[-0.05em] sm:text-7xl">Small breakthroughs become <span className="text-[#e3a56f]">big results.</span></h2></Reveal><div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{testimonials.map((testimonial, index) => <Reveal key={testimonial.name} delay={(index % 3) * 0.06} className="h-full"><article className="flex h-full flex-col rounded-[1.35rem] border border-white/15 bg-white/[0.045] p-5 transition-colors hover:border-[#e3a56f]/50 hover:bg-white/[0.08] sm:p-6"><div className="flex items-start justify-between gap-4"><Quote className="h-7 w-7 text-[#e3a56f]" aria-hidden="true" /><span className="rounded-full border border-[#e3a56f]/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#e3a56f]">Grade {testimonial.grade}</span></div><p className="mt-7 flex-1 text-sm leading-relaxed text-white/70">{testimonial.quote}</p><div className="mt-7 flex items-center gap-3 border-t border-white/15 pt-5"><StudentAvatar testimonial={testimonial} /><div className="min-w-0"><h3 className="truncate text-sm font-semibold text-white">{testimonial.name}</h3><p className="mt-1 text-xs text-white/45">{testimonial.level}</p></div></div><div className="mt-4 flex items-center justify-between gap-3 text-xs"><span className="text-white/45">{testimonial.subject}</span><span className="flex items-center gap-1.5 font-semibold text-[#e3a56f]"><TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />{testimonial.improvement}</span></div></article></Reveal>)}</div></div></section>

        <section className="bg-[#eae4d9] py-20 sm:py-28"><div className="container"><Reveal><SectionLabel number="04">Transformation stories</SectionLabel><div className="mt-6 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end"><h2 className="font-serif text-5xl leading-[0.96] tracking-[-0.05em] sm:text-6xl">From uncertainty to <span className="text-[#b15d2b]">momentum.</span></h2><p className="max-w-xl text-base leading-relaxed text-[#526071] sm:text-lg">With the right academic support, progress becomes visible. These journeys show the change from a difficult starting point to a result worth celebrating.</p></div></Reveal><div className="mt-14 space-y-4">{transformations.map((story, index) => <Reveal key={story.name} delay={index * 0.08}><article className="rounded-[1.35rem] border border-[#c9c1b4] bg-white/35 p-5 sm:p-7"><div className="grid gap-6 lg:grid-cols-[0.22fr_0.78fr_0.78fr_0.25fr] lg:items-center"><div><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b15d2b]">0{index + 1} / {story.subject}</span><h3 className="mt-3 font-serif text-2xl">{story.name}</h3></div><div className="border-t border-[#c9c1b4] pt-4 lg:border-t-0 lg:border-l lg:pl-6"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#526071]">Before</p><p className="mt-2 text-sm leading-relaxed text-[#526071]">{story.before}</p></div><div className="border-t border-[#c9c1b4] pt-4 lg:border-t-0 lg:border-l lg:pl-6"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b15d2b]">After</p><p className="mt-2 text-sm font-semibold leading-relaxed text-[#14263d]">{story.after}</p></div><span className="rounded-full bg-[#10243d] px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-white">{story.duration}</span></div></article></Reveal>)}</div></div></section>

        <section className="bg-[#d87a3f] py-20 text-[#10243d] sm:py-28"><div className="container"><Reveal><div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end"><div className="max-w-3xl"><SectionLabel number="05">Your next result</SectionLabel><div className="mt-6 flex gap-1">{[1, 2, 3, 4, 5].map((star) => <Star key={star} className="h-5 w-5 fill-current" aria-hidden="true" />)}</div><h2 className="mt-6 font-serif text-5xl leading-[0.96] tracking-[-0.05em] sm:text-7xl">Rated 5/5 by our students.</h2><p className="mt-6 max-w-xl text-base leading-relaxed text-[#10243d]/70 sm:text-lg">Join satisfied students who have transformed their academic performance with GlobeDk Elite.</p></div><Button asChild size="lg" className="w-full rounded-full bg-[#10243d] px-7 text-white hover:bg-[#193653] sm:w-auto"><Link href="/contact">Start your story <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button></div></Reveal></div></section>
      </main>
      <Footer />
    </div>
  )
}
