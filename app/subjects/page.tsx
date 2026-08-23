"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Globe,
  Laptop,
  MoveUpRight,
  User,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { PageHero, Reveal, SectionLabel } from "@/components/editorial"

type Subject = {
  name: string
  icon: LucideIcon
  description: string
  topics: string[]
  fee: string
}

const oLevelSubjects: Subject[] = [
  { name: "Mathematics", icon: Calculator, description: "Build confidence in algebra, geometry, trigonometry, statistics and problem solving through expert instruction for both ZIMSEC and Cambridge O-Level learners.", topics: ["Algebra", "Geometry", "Trigonometry", "Statistics", "Number Systems"], fee: "ZIMSEC: US$30/month | Cambridge: US$35/month" },
  { name: "English Language", icon: FileText, description: "Develop excellent communication, grammar, comprehension and composition skills while preparing for examinations with confidence.", topics: ["Grammar", "Composition", "Comprehension", "Summary Writing", "Oral Skills"], fee: "ZIMSEC: US$30/month | Cambridge: US$35/month" },
  { name: "Combined Science", icon: Calculator, description: "Gain a solid foundation in Biology, Chemistry and Physics through practical explanations and exam-focused learning.", topics: ["Scientific Investigation", "Biology", "Chemistry", "Physics", "Laboratory Skills"], fee: "ZIMSEC: US$30/month | Cambridge: US$35/month" },
  { name: "Physics", icon: Calculator, description: "Understand the laws governing matter, energy and motion while mastering calculations required for examinations.", topics: ["Mechanics", "Electricity", "Waves", "Thermal Physics", "Modern Physics"], fee: "ZIMSEC: US$30/month | Cambridge: US$35/month" },
  { name: "Chemistry", icon: Calculator, description: "Master chemical reactions, calculations and practical concepts through simplified, results-driven teaching.", topics: ["Organic Chemistry", "Inorganic Chemistry", "Chemical Calculations", "Acids & Bases", "Practical Chemistry"], fee: "ZIMSEC: US$30/month | Cambridge: US$35/month" },
  { name: "Biology", icon: Calculator, description: "Explore living organisms, genetics and ecology while preparing thoroughly for practical and theory examinations.", topics: ["Cell Biology", "Genetics", "Ecology", "Human Biology", "Classification"], fee: "ZIMSEC: US$30/month | Cambridge: US$35/month" },
  { name: "Computer Science", icon: Laptop, description: "Develop programming, problem-solving and computing skills essential for today's technology-driven world.", topics: ["Programming", "Algorithms", "Databases", "Networking", "Computer Systems"], fee: "ZIMSEC: US$30/month | Cambridge: US$35/month" },
  { name: "Geography", icon: Globe, description: "Study physical and human environments while strengthening map interpretation and geographical analysis.", topics: ["Map Reading", "Climate", "Population", "Natural Resources", "Development"], fee: "ZIMSEC: US$30/month | Cambridge: US$35/month" },
  { name: "History", icon: Globe, description: "Understand world and African history through analytical study of historical events, sources and interpretations.", topics: ["African History", "World History", "Source Analysis", "Colonial History", "International Relations"], fee: "ZIMSEC: US$30/month | Cambridge: US$35/month" },
  { name: "Heritage Studies", icon: Globe, description: "Explore Zimbabwean heritage, culture, governance and national identity using an examination-focused approach.", topics: ["Culture", "Citizenship", "Governance", "Traditions", "National Heritage"], fee: "ZIMSEC: US$30/month | Cambridge: US$35/month" },
  { name: "Commerce", icon: FileText, description: "Develop entrepreneurial and business knowledge while understanding trade, marketing and finance.", topics: ["Business Organisations", "Marketing", "Insurance", "International Trade", "Consumer Education"], fee: "ZIMSEC: US$30/month | Cambridge: US$35/month" },
  { name: "Principles of Accounts", icon: FileText, description: "Master bookkeeping, financial statements and accounting principles required for academic and business success.", topics: ["Double Entry", "Ledger Accounts", "Trial Balance", "Financial Statements", "Cash Books"], fee: "ZIMSEC: US$30/month | Cambridge: US$35/month" },
]

const aLevelSubjects: Subject[] = [
  { name: "Pure Mathematics", icon: Calculator, description: "Advanced mathematics designed to prepare learners for university studies in engineering, science and technology.", topics: ["Calculus", "Vectors", "Complex Numbers", "Differential Equations", "Proof"], fee: "ZIMSEC: US$35/month | Cambridge: US$40/month" },
  { name: "Statistics", icon: Calculator, description: "Learn statistical analysis, probability and data interpretation for higher education and professional careers.", topics: ["Probability", "Regression", "Sampling", "Distributions", "Hypothesis Testing"], fee: "ZIMSEC: US$35/month | Cambridge: US$40/month" },
  { name: "Computer Science", icon: Laptop, description: "Study advanced programming, algorithms, software development and computing theory through practical projects.", topics: ["Programming", "Software Engineering", "Algorithms", "Databases", "Networks"], fee: "ZIMSEC: US$35/month | Cambridge: US$40/month" },
  { name: "Geography", icon: Globe, description: "Analyse environmental systems, development issues and geographical research using advanced fieldwork techniques.", topics: ["Research Methods", "Fieldwork", "Physical Geography", "Human Geography", "Global Issues"], fee: "ZIMSEC: US$35/month | Cambridge: US$40/month" },
  { name: "Business Studies", icon: FileText, description: "Develop practical business management, entrepreneurship and organisational skills for examinations and future careers.", topics: ["Business Management", "Marketing", "Human Resources", "Entrepreneurship", "Business Finance"], fee: "ZIMSEC: US$35/month | Cambridge: US$40/month" },
  { name: "Economics", icon: FileText, description: "Understand microeconomics, macroeconomics and economic development using real-world case studies and examination techniques.", topics: ["Microeconomics", "Macroeconomics", "International Trade", "Economic Development", "Market Structures"], fee: "ZIMSEC: US$35/month | Cambridge: US$40/month" },
]

const services = ["Online Lessons", "Physical Lessons", "Homeschooling", "One-on-One Tutoring", "Live Virtual Classes", "Exam Preparation", "Revision Classes", "Homework Assistance", "Holiday Lessons", "Weekend Lessons"]

function handleEnrollClick() {
  const message = "Hello GlobeDk Elite Academy. I am interested in your online tutoring services and would like to know more about the available lessons, subjects, fees and class schedules. I would also like to know how I can enrol. Thank you."
  window.open(`https://wa.me/263786053315?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer")
}

function SubjectCard({ subject, level, index }: { subject: Subject; level: "O-Level" | "A-Level"; index: number }) {
  const Icon = subject.icon
  return (
    <Reveal delay={(index % 6) * 0.04} className="h-full">
      <article className="group flex h-full flex-col rounded-[1.35rem] border border-[#d9d3c8] bg-white/45 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#b15d2b]/40 hover:bg-white hover:shadow-[0_18px_45px_rgba(20,38,61,.1)] sm:p-6">
        <div className="flex items-start justify-between gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#10243d] text-[#e3a56f]"><Icon className="h-5 w-5" aria-hidden="true" /></div><span className="rounded-full border border-[#d9d3c8] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#b15d2b]">{level}</span></div>
        <h3 className="mt-8 font-serif text-2xl tracking-[-0.03em] text-[#14263d]">{subject.name}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-[#526071]">{subject.description}</p>
        <div className="mt-6 border-t border-[#d9d3c8] pt-5"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b15d2b]">Topics covered</p><div className="mt-3 flex flex-wrap gap-2">{subject.topics.map((topic) => <span key={topic} className="rounded-full bg-[#eae4d9] px-2.5 py-1 text-[11px] text-[#526071]">{topic}</span>)}</div></div>
        <div className="mt-6 flex items-start justify-between gap-3 text-xs text-[#526071]"><span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-[#b15d2b]" aria-hidden="true" />Flexible schedule</span><span className="flex max-w-[55%] items-start gap-1.5 text-right"><DollarSign className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#b15d2b]" aria-hidden="true" />{subject.fee}</span></div>
      </article>
    </Reveal>
  )
}

export default function SubjectsPage() {
  const [activeLevel, setActiveLevel] = useState<"O-Level" | "A-Level">("O-Level")
  const [query, setQuery] = useState("")
  const currentSubjects = activeLevel === "O-Level" ? oLevelSubjects : aLevelSubjects
  const filteredSubjects = useMemo(() => currentSubjects.filter((subject) => subject.name.toLowerCase().includes(query.trim().toLowerCase())), [activeLevel, query, currentSubjects])

  return (
    <div className="homepage-shell min-h-screen overflow-x-clip bg-[#f4f1ea] text-[#14263d]">
      <Navigation />
      <main>
        <PageHero number="01" eyebrow="Academic pathways" title={<>Find the subject that opens your <span className="text-[#e3a56f]">next door.</span></>} description={<>GlobeDk Elite Academy offers professional Online Lessons, Physical Lessons, Homeschooling Zimbabwe programmes and Live Virtual Classes for students across Zimbabwe and internationally. We teach Arts, Commercials, Sciences and Technology subjects while providing expert homework assistance, revision classes, exam preparation and one-on-one tutoring for ZIMSEC and Cambridge learners.</>} sideLabel="O-Level · A-Level · ZIMSEC · Cambridge" />

        <section className="bg-[#f4f1ea] py-20 sm:py-28">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:gap-24">
              <Reveal><SectionLabel number="02">Learning support</SectionLabel><h2 className="mt-6 max-w-sm font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">Complete support for every stage of the journey.</h2><p className="mt-6 max-w-sm text-base leading-relaxed text-[#526071]">Whether you are looking for an Online Tutor Zimbabwe, a private Mathematics Tutor, English Tutor, Computer Science Tutor or a full Online School Zimbabwe experience, GlobeDk Elite Academy delivers flexible learning solutions designed around every learner's goals.</p></Reveal>
              <div className="grid gap-x-8 sm:grid-cols-2">{services.map((service, index) => <Reveal key={service} delay={index * 0.04} className="group flex items-start gap-4 border-t border-[#d9d3c8] py-5"><span className="text-xs font-bold text-[#b15d2b]">{String(index + 1).padStart(2, "0")}</span><div className="flex-1"><h3 className="font-semibold">{service}</h3><div className="mt-2 h-px w-0 bg-[#b15d2b] transition-all duration-500 group-hover:w-full" /></div><Check className="h-4 w-4 text-[#b15d2b] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" /></Reveal>)}</div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#10243d] py-20 text-[#f8f4eb] sm:py-28">
          <div aria-hidden="true" className="absolute right-[-12rem] top-20 h-[36rem] w-[36rem] rounded-full border border-white/10" />
          <div className="container relative z-10">
            <Reveal><SectionLabel number="03" light>Find your subject</SectionLabel><div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><h2 className="max-w-3xl font-serif text-5xl leading-[0.96] tracking-[-0.05em] sm:text-7xl">The right pathway begins with one clear choice.</h2><p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60">Explore our complete O-Level and A-Level subject catalogue, with focused teaching for both ZIMSEC and Cambridge learners.</p></div><Button asChild variant="outline" className="w-full rounded-full border-white/25 bg-transparent text-white hover:bg-white/10 sm:w-auto"><Link href="/contact">Ask about a subject <MoveUpRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button></div></Reveal>
            <div className="mt-12 rounded-[1.75rem] border border-white/15 bg-white/[0.045] p-5 sm:p-7">
              <div className="flex flex-col justify-between gap-5 border-b border-white/15 pb-6 lg:flex-row lg:items-end"><div className="flex gap-2 rounded-full border border-white/15 p-1"><button type="button" onClick={() => setActiveLevel("O-Level")} className={`rounded-full px-5 py-2.5 text-xs font-bold transition-colors ${activeLevel === "O-Level" ? "bg-[#e3a56f] text-[#10243d]" : "text-white/60 hover:text-white"}`}>O-Level subjects</button><button type="button" onClick={() => setActiveLevel("A-Level")} className={`rounded-full px-5 py-2.5 text-xs font-bold transition-colors ${activeLevel === "A-Level" ? "bg-[#e3a56f] text-[#10243d]" : "text-white/60 hover:text-white"}`}>A-Level subjects</button></div><label className="relative block w-full lg:max-w-xs"><span className="sr-only">Search subjects</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search subjects" className="h-11 w-full rounded-full border border-white/20 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/45 focus:border-[#e3a56f] focus:ring-2 focus:ring-[#e3a56f]/30" /></label></div>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredSubjects.map((subject, index) => <SubjectCard key={`${activeLevel}-${subject.name}`} subject={subject} level={activeLevel} index={index} />)}</div>
              {filteredSubjects.length === 0 && <p className="py-10 text-center text-sm text-white/60">No subjects match this search yet.</p>}
              <p className="mt-6 text-xs text-white/45">{filteredSubjects.length} subject{filteredSubjects.length === 1 ? "" : "s"} shown · Subject availability may vary by level and programme.</p>
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-[#eae4d9] py-20 sm:py-28">
          <div className="container"><Reveal><SectionLabel number="04">Tuition and formats</SectionLabel><div className="mt-6 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><h2 className="font-serif text-5xl leading-[0.96] tracking-[-0.05em] sm:text-6xl">Flexible learning options, clearly explained.</h2><p className="max-w-xl text-base leading-relaxed text-[#526071] sm:text-lg">Whether you prefer learning online from anywhere in Zimbabwe or attending our physical lessons in Epworth StopOver, Harare, GlobeDk Elite Academy provides affordable, high-quality education for every learner.</p></div></Reveal><div className="mt-14 grid gap-6 lg:grid-cols-2">{[{ title: "Physical Lessons", subtitle: "Epworth StopOver, Harare", rows: [["O-Level ZIMSEC", "US$20 / subject / month"], ["O-Level Cambridge", "US$25 / subject / month"], ["A-Level ZIMSEC", "US$25 / subject / month"], ["A-Level Cambridge", "US$30 / subject / month"]] }, { title: "Online Lessons", subtitle: "Learn from anywhere in Zimbabwe and internationally.", rows: [["O-Level ZIMSEC", "US$30 / subject / month"], ["O-Level Cambridge", "US$35 / subject / month"], ["A-Level ZIMSEC", "US$35 / subject / month"], ["A-Level Cambridge", "US$40 / subject / month"]] }].map(({ title, subtitle, rows }, index) => <Reveal key={title} delay={index * 0.1} className="rounded-[1.5rem] border border-[#c9c1b4] bg-white/40 p-6 sm:p-8"><div className="flex items-start justify-between gap-4"><div><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b15d2b]">0{index + 1} / format</span><h3 className="mt-5 font-serif text-3xl tracking-[-0.03em]">{title}</h3><p className="mt-2 text-sm text-[#526071]">{subtitle}</p></div><BookOpen className="h-5 w-5 text-[#b15d2b]" aria-hidden="true" /></div><div className="mt-8">{rows.map(([label, fee]) => <div key={label} className="flex items-center justify-between gap-4 border-t border-[#c9c1b4] py-4 text-sm"><span>{label}</span><strong className="text-right text-[#b15d2b]">{fee}</strong></div>)}</div></Reveal>)}</div></div>
        </section>

        <section className="bg-[#f4f1ea] py-20 sm:py-28">
          <div className="container"><Reveal><SectionLabel number="05">The person behind the purpose</SectionLabel><div className="mt-8 grid gap-10 rounded-[1.75rem] border border-[#d9d3c8] bg-white/35 p-6 sm:p-10 lg:grid-cols-[0.45fr_1.55fr] lg:items-center"><div className="flex justify-center"><div className="flex h-40 w-40 items-center justify-center rounded-full bg-[#10243d] text-[#e3a56f] shadow-xl sm:h-52 sm:w-52"><User className="h-16 w-16" aria-hidden="true" /></div></div><div><h2 className="font-serif text-4xl tracking-[-0.04em] sm:text-5xl">John Ariphios Daka</h2><p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-[#b15d2b]">Founder &amp; Principal</p><p className="mt-6 max-w-3xl text-base leading-relaxed text-[#526071]">John Ariphios Daka is the Founder &amp; Principal of GlobeDk Elite Academy and a dedicated professional educator with a passion for transforming lives through quality education. He has successfully guided students preparing for both ZIMSEC and Cambridge examinations by combining academic excellence, mentorship and personalised learning strategies.</p><p className="mt-4 max-w-3xl text-base leading-relaxed text-[#526071]">His commitment is to provide accessible Online Lessons, Physical Lessons, Homeschooling, One-on-One Tutoring, Revision Classes, Homework Assistance and Exam Preparation that empower learners across Zimbabwe and internationally to achieve outstanding academic results.</p></div></div></Reveal></div>
        </section>

        <section className="relative overflow-hidden bg-[#d87a3f] py-20 text-[#10243d] sm:py-28"><div aria-hidden="true" className="absolute -right-20 -top-24 h-80 w-80 rounded-full border border-[#10243d]/15" /><div className="container relative z-10"><Reveal><SectionLabel number="06">Ready to learn</SectionLabel><div className="mt-6 flex flex-col justify-between gap-10 lg:flex-row lg:items-end"><h2 className="max-w-3xl font-serif text-5xl leading-[0.95] tracking-[-0.05em] sm:text-7xl">Start learning with GlobeDk Elite Academy today.</h2><div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"><Button onClick={handleEnrollClick} size="lg" className="w-full rounded-full bg-[#10243d] px-7 text-white hover:bg-[#193653] sm:w-auto">Enroll today <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Button><Button asChild size="lg" variant="outline" className="w-full rounded-full border-[#10243d]/35 bg-transparent text-[#10243d] hover:bg-[#10243d]/10 sm:w-auto"><Link href="/contact">Contact us</Link></Button></div></div></Reveal></div></section>
      </main>
      <Footer />
    </div>
  )
}
