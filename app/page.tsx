"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  ArrowDownRight,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  GraduationCap,
  MoveUpRight,
  Sparkles,
} from "lucide-react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"
import { useEffect, useMemo, useState } from "react"

const images = [
  "/african-students-learning-in-modern-classroom.jpg",
  "/african-male-student.jpg",
  "/african-female-student-smiling.jpg",
]

const featureHighlights = [
  { label: "Expert Tutoring", icon: GraduationCap },
  { label: "Flexible Learning", icon: BookOpen },
  { label: "Exam Preparation", icon: Award },
]

const learningFormats = [
  "online lessons",
  "homeschooling",
  "one-on-one tutoring",
  "exam preparation",
  "revision classes",
  "academic support",
]

const courseSubjects = [
  { name: "Mathematics", group: "Sciences" },
  { name: "English Language", group: "Languages & Humanities" },
  { name: "Combined Science", group: "Sciences" },
  { name: "Physics", group: "Sciences" },
  { name: "Chemistry", group: "Sciences" },
  { name: "Biology", group: "Sciences" },
  { name: "Geography", group: "Languages & Humanities" },
  { name: "History", group: "Languages & Humanities" },
  { name: "Heritage Studies", group: "Languages & Humanities" },
  { name: "Commerce", group: "Commerce & Technology" },
  { name: "Principles of Accounts", group: "Commerce & Technology" },
  { name: "Business Studies", group: "Commerce & Technology" },
  { name: "Economics", group: "Commerce & Technology" },
  { name: "Computer Science", group: "Commerce & Technology" },
  { name: "Statistics", group: "Commerce & Technology" },
] as const

type CourseSubject = (typeof courseSubjects)[number]

const subjectGroups = [
  {
    number: "01",
    title: "Sciences",
    subjects: "Combined Science, Physics, Chemistry, Biology",
  },
  {
    number: "02",
    title: "Languages & Humanities",
    subjects: "English Language, Geography, History, Heritage Studies",
  },
  {
    number: "03",
    title: "Commerce & Technology",
    subjects: "Commerce, Principles of Accounts, Business Studies, Economics, Computer Science, Statistics",
  },
]

function handleEnrollClick() {
  const message =
    "Hello GlobeDk Elite Academy. I am interested in your online tutoring services and would like to know more about the available lessons, subjects, fees and class schedules. I would also like to know how I can enrol. Thank you."

  window.open(
    `https://wa.me/263786053315?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer",
  )
}

const reveal = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
}

function CourseFinder() {
  const [activeGroup, setActiveGroup] = useState("All subjects")
  const [query, setQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<CourseSubject | null>(null)

  const groups = ["All subjects", ...subjectGroups.map((group) => group.title)]
  const filteredSubjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return courseSubjects.filter((subject) => {
      const matchesGroup = activeGroup === "All subjects" || subject.group === activeGroup
      const matchesQuery = !normalizedQuery || subject.name.toLowerCase().includes(normalizedQuery)
      return matchesGroup && matchesQuery
    })
  }, [activeGroup, query])

  return (
    <div className="mt-12 rounded-[1.75rem] border border-white/15 bg-white/[0.045] p-5 sm:p-7">
      <div className="flex flex-col justify-between gap-5 border-b border-white/15 pb-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#e3a56f]">Find your subject</p>
          <h3 className="mt-2 font-serif text-2xl tracking-[-0.03em] text-white sm:text-3xl">Explore the right learning pathway.</h3>
        </div>
        <label className="relative block w-full lg:max-w-xs">
          <span className="sr-only">Search subjects</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search subjects" className="h-11 w-full rounded-full border border-white/20 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/45 focus:border-[#e3a56f] focus:ring-2 focus:ring-[#e3a56f]/30" />
        </label>
      </div>
      <div className="-mx-1 flex gap-2 overflow-x-auto py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Filter subjects by pathway">
        {groups.map((group) => (
          <button key={group} type="button" role="tab" aria-selected={activeGroup === group} onClick={() => setActiveGroup(group)} className={`min-h-10 shrink-0 rounded-full border px-4 text-xs font-semibold transition-colors ${activeGroup === group ? "border-[#e3a56f] bg-[#e3a56f] text-[#10243d]" : "border-white/20 bg-transparent text-white/65 hover:border-white/45 hover:text-white"}`}>
            {group}
          </button>
        ))}
      </div>
      <motion.div layout className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredSubjects.map((subject) => (
            <motion.button type="button" key={subject.name} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.22 }} onClick={() => setSelectedSubject(subject)} className="group flex min-h-16 items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0b1d33]/60 px-4 py-3 text-left transition-colors hover:border-[#e3a56f]/55 hover:bg-[#0b1d33] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e3a56f]">
              <div>
                <p className="text-sm font-semibold text-white">{subject.name}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/40">{subject.group}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-[#e3a56f] transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>
      {filteredSubjects.length === 0 && <p className="py-8 text-center text-sm text-white/60">No subjects match this search yet.</p>}
      <p className="mt-5 text-xs text-white/45">{filteredSubjects.length} subject{filteredSubjects.length === 1 ? "" : "s"} shown · Select a subject for details</p>
      <AnimatePresence>
        {selectedSubject && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto p-4" role="dialog" aria-modal="true" aria-labelledby="subject-detail-title">
            <button type="button" aria-label="Close subject details" className="absolute inset-0 h-full w-full cursor-default bg-[#0b1d33]/75 backdrop-blur-sm" onClick={() => setSelectedSubject(null)} />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }} className="relative my-auto w-full max-w-lg overflow-hidden rounded-[1.75rem] border border-[#d9d3c8] bg-[#f4f1ea] text-[#14263d] shadow-2xl">
              <div className="bg-[#10243d] px-6 py-7 text-white sm:px-8"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#e3a56f]">Course detail</p><p className="mt-2 text-xs text-white/45">{selectedSubject.group}</p></div><button type="button" onClick={() => setSelectedSubject(null)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:bg-white/10 hover:text-white" aria-label="Close subject details"><span aria-hidden="true" className="text-xl leading-none">×</span></button></div><h3 id="subject-detail-title" className="mt-12 font-serif text-4xl tracking-[-0.04em]">{selectedSubject.name}</h3></div>
              <div className="space-y-5 px-6 py-6 sm:px-8"><div className="grid grid-cols-2 gap-3"><div className="rounded-xl border border-[#d9d3c8] bg-white/55 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b15d2b]">Pathway</p><p className="mt-2 text-sm font-semibold">{selectedSubject.group}</p></div><div className="rounded-xl border border-[#d9d3c8] bg-white/55 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b15d2b]">Curriculum</p><p className="mt-2 text-sm font-semibold">ZIMSEC / Cambridge</p></div></div><p className="text-sm leading-relaxed text-[#526071]">We offer expert tutoring for O-Level and A-Level students in Mathematics, English Language, Combined Science, Physics, Chemistry, Biology, Geography, History, Heritage Studies, Commerce, Principles of Accounts, Business Studies, Economics, Computer Science, Statistics and many other subjects.</p><Button asChild className="w-full rounded-full bg-[#10243d] text-white hover:bg-[#193653]"><Link href="/contact">Contact Us <MoveUpRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function HomePage() {
  const [current, setCurrent] = useState(0)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const imageY = useTransform(scrollYProgress, [0, 0.35], [0, 70])
  const imageRotate = useTransform(scrollYProgress, [0, 0.35], [0, -1.5])

  useEffect(() => {
    if (reduceMotion) return

    const interval = setInterval(() => {
      setCurrent((previous) => (previous + 1) % images.length)
    }, 7500)

    return () => clearInterval(interval)
  }, [reduceMotion])

  return (
    <div className="homepage-shell min-h-screen overflow-x-clip bg-[#f4f1ea] text-[#14263d]">
      <motion.div
        aria-hidden="true"
        className="fixed left-0 top-0 z-[60] hidden h-1 bg-[#d87a3f] sm:block"
        style={{ width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
      />
      <Navigation />

      <main>
        <section className="relative isolate overflow-hidden bg-[#0b1d33] text-[#f8f4eb]">
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:64px_64px]" />
          <div aria-hidden="true" className="absolute -right-32 top-10 h-[32rem] w-[32rem] rounded-full border border-white/10" />
          <div aria-hidden="true" className="absolute -right-20 top-24 h-[26rem] w-[26rem] rounded-full border border-white/10" />

          <div className="container relative z-10 py-6 sm:py-8 lg:py-10">
            <div className="grid min-h-[calc(100svh-7rem)] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <div className="relative max-w-2xl py-10 lg:py-16">
                <div className="absolute -left-6 top-0 hidden h-full w-px bg-white/15 lg:block">
                  <motion.div className="w-full bg-[#d87a3f]" initial={{ height: 0 }} animate={{ height: "42%" }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
                </div>

                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, x: -24 }}
                  animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.7 }}
                  className="mb-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.32em] text-[#e3a56f]"
                >
                  <span>01</span>
                  <span className="h-px w-8 bg-[#e3a56f]" />
                  Welcome to GlobeDk Elite Academy
                </motion.div>

                <motion.h1
                  initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-xl font-serif text-[3.45rem] leading-[0.94] tracking-[-0.055em] text-white sm:text-6xl lg:text-[5.6rem]"
                >
                  Professional Online O-Level &amp; A-Level Lessons for ZIMSEC &amp; Cambridge Students
                </motion.h1>

                <motion.p
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.25 }}
                  className="mt-7 max-w-lg text-lg font-medium leading-relaxed text-white/75 sm:text-xl"
                >
                  Excellence in Education. Success for Life.
                </motion.p>

                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.35 }}
                  className="mt-8 flex flex-col gap-3 sm:flex-row"
                >
                  <Button onClick={handleEnrollClick} size="lg" variant="secondary" className="group w-full rounded-full bg-[#d87a3f] px-7 text-white shadow-[0_15px_40px_rgba(216,122,63,0.2)] hover:bg-[#c86931] sm:w-auto">
                    Enroll Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Button>
                  <Button asChild size="lg" variant="outline" className="w-full rounded-full border-white/20 bg-white/5 px-7 text-white hover:bg-white/10 sm:w-auto">
                    <Link href="#approach">Discover GlobeDk</Link>
                  </Button>
                </motion.div>

                <motion.div
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={reduceMotion ? undefined : { opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.55 }}
                  className="mt-12 grid max-w-lg grid-cols-1 gap-3 border-t border-white/15 pt-5 sm:grid-cols-3"
                >
                  {featureHighlights.map(({ label, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-2 text-sm text-white/65">
                      <Icon className="h-4 w-4 shrink-0 text-[#e3a56f]" aria-hidden="true" />
                      <span>{label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              <div className="relative mx-auto w-full max-w-[40rem] lg:ml-auto">
                <motion.div style={{ y: reduceMotion ? 0 : imageY, rotate: reduceMotion ? 0 : imageRotate }} className="relative aspect-[0.82] overflow-hidden rounded-[48%_48%_24%_24%/32%_32%_18%_18%] border border-white/15 bg-[#183653] shadow-[0_30px_100px_rgba(0,0,0,.35)]">
                  <AnimatePresence mode="wait" initial={!reduceMotion}>
                    <motion.div
                      key={images[current]}
                      aria-hidden="true"
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${images[current]})` }}
                      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 1.15, ease: "easeInOut" }}
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1d33]/80 via-[#0b1d33]/10 to-[#0b1d33]/10" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <div className="flex items-end justify-between gap-5 border-t border-white/25 pt-4">
                      <p className="max-w-[15rem] text-sm leading-relaxed text-white/75">A trusted education centre based in Harare, Zimbabwe.</p>
                      <div className="flex items-center gap-1.5" aria-label="Hero image selector">
                        {images.map((image, index) => (
                          <button key={image} type="button" aria-label={`Show classroom image ${index + 1}`} aria-current={current === index ? "true" : undefined} onClick={() => setCurrent(index)} className="rounded-full p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                            <span className={`block h-1.5 rounded-full bg-white transition-all motion-reduce:transition-none ${current === index ? "w-7 opacity-100" : "w-1.5 opacity-50"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.92, rotate: 7 }}
                  animate={reduceMotion ? undefined : { opacity: 1, scale: 1, rotate: 4 }}
                  transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-5 -left-3 rounded-2xl border border-[#d87a3f]/50 bg-[#d87a3f] px-4 py-3 text-[#0b1d33] shadow-xl sm:-left-8"
                >
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em]">Curriculum</p>
                  <p className="mt-1 text-sm font-semibold">ZIMSEC / Cambridge</p>
                </motion.div>

                <div className="absolute -right-3 top-8 hidden rotate-90 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 sm:block">Learn / Prepare / Succeed</div>
              </div>
            </div>
          </div>
        </section>

        <section id="approach" className="bg-[#f4f1ea] py-20 sm:py-28">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:gap-24">
              <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b15d2b]">02 / The approach</p>
                <div className="mt-7 flex h-14 w-14 items-center justify-center rounded-full border border-[#b15d2b]/30 text-[#b15d2b]"><ArrowDownRight className="h-5 w-5" aria-hidden="true" /></div>
              </motion.div>
              <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.12 }}>
                <h2 className="max-w-4xl font-serif text-5xl leading-[0.98] tracking-[-0.05em] text-[#14263d] sm:text-7xl">Excellence in Education.<br /><span className="text-[#b15d2b]">Success for Life.</span></h2>
                <div className="mt-10 grid gap-8 border-t border-[#d9d3c8] pt-8 md:grid-cols-2">
                  <p className="text-base leading-relaxed text-[#526071] sm:text-lg">Welcome to <strong className="font-semibold text-[#14263d]">GlobeDk Elite Academy</strong>, a trusted education centre based in Harare, Zimbabwe, providing professional <strong className="font-semibold text-[#14263d]">online lessons, homeschooling, one-on-one tutoring, exam preparation, revision classes and academic support</strong> for students studying the <strong className="font-semibold text-[#14263d]">ZIMSEC</strong> and <strong className="font-semibold text-[#14263d]">Cambridge</strong> curricula.</p>
                  <p className="text-base leading-relaxed text-[#526071] sm:text-lg">Whether you need live online classes, flexible homeschooling, weekend lessons, holiday revision classes or personalized tutoring, GlobeDk Elite Academy is committed to helping every learner build confidence, improve academic performance and achieve outstanding examination results from anywhere in Zimbabwe and beyond.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="subjects" className="relative overflow-hidden bg-[#10243d] py-20 text-[#f8f4eb] sm:py-28">
          <div aria-hidden="true" className="absolute right-[-8rem] top-1/2 h-[30rem] w-[30rem] -translate-y-1/2 rounded-full border border-white/10" />
          <div className="container relative z-10">
            <div className="grid gap-12 lg:grid-cols-[0.45fr_1.55fr] lg:gap-24">
              <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#e3a56f]">03 / Academic pathways</p>
                <h2 className="mt-6 max-w-xs font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">Expert tutoring across many subjects.</h2>
                <Button asChild variant="outline" className="mt-8 rounded-full border-white/25 bg-transparent text-white hover:bg-white/10"><Link href="/subjects">View all subjects <MoveUpRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
              </motion.div>

              <div>
                <div className="mb-3 hidden grid-cols-[4rem_1fr_2rem] border-b border-white/15 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 sm:grid"><span>No.</span><span>Subject group</span><span /></div>
                {subjectGroups.map((group, index) => (
                  <motion.div key={group.title} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} transition={{ delay: index * 0.1 }} className="group grid gap-4 border-b border-white/15 py-7 sm:grid-cols-[4rem_1fr_2rem] sm:items-center">
                    <span className="text-sm font-semibold text-[#e3a56f]">{group.number}</span>
                    <div>
                      <h3 className="font-serif text-2xl tracking-[-0.02em] text-white transition-colors group-hover:text-[#e3a56f] sm:text-3xl">{group.title}</h3>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">{group.subjects}</p>
                    </div>
                    <ArrowRight className="hidden h-5 w-5 text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-[#e3a56f] sm:block" aria-hidden="true" />
                  </motion.div>
                ))}
                <CourseFinder />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#eae4d9] py-20 sm:py-28">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
              <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b15d2b]">04 / Learning formats</p>
                <h2 className="mt-6 max-w-sm font-serif text-4xl leading-tight tracking-[-0.04em] text-[#14263d] sm:text-5xl">Flexible learning, designed around you.</h2>
                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-[#14263d]"><Sparkles className="h-4 w-4 text-[#b15d2b]" aria-hidden="true" />Personalized academic support</div>
              </motion.div>

              <div className="grid sm:grid-cols-2">
                {learningFormats.map((format, index) => (
                  <motion.div key={format} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} transition={{ delay: index * 0.06 }} className="group flex items-start gap-4 border-t border-[#c9c1b4] py-5 sm:pr-8">
                    <span className="text-xs font-bold text-[#b15d2b]">0{index + 1}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold capitalize text-[#14263d]">{format}</h3>
                      <div className="mt-2 h-px w-0 bg-[#b15d2b] transition-all duration-500 group-hover:w-full" />
                    </div>
                    <Check className="h-4 w-4 text-[#b15d2b] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#d87a3f] py-20 text-[#10243d] sm:py-28">
          <div aria-hidden="true" className="absolute -right-20 -top-24 h-80 w-80 rounded-full border border-[#10243d]/15" />
          <div className="container relative z-10">
            <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#10243d]/65">05 / Begin your next chapter</p>
                <h2 className="mt-6 font-serif text-5xl leading-[0.95] tracking-[-0.05em] sm:text-7xl">Enroll now or contact us to learn more.</h2>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button onClick={handleEnrollClick} size="lg" className="group w-full rounded-full bg-[#10243d] px-7 text-white hover:bg-[#193653] sm:w-auto">Enroll Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Button>
                <Button asChild size="lg" variant="outline" className="w-full rounded-full border-[#10243d]/35 bg-transparent px-7 text-[#10243d] hover:bg-[#10243d]/10 sm:w-auto"><Link href="/contact">Contact Us</Link></Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
