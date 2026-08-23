"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BrandLink } from "@/components/brand"
import { ArrowUpRight, BrainCircuit, Construction, FileSearch, LineChart, ListChecks, Menu, Sparkles, X } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/subjects", label: "Subjects" },
  { href: "/timetable", label: "Timetable" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
] as const

const predictorSteps = [
  { label: "Analyse", title: "Past examination paper analysis", icon: FileSearch, detail: "Review previous examination papers and surface recurring structures." },
  { label: "Detect", title: "Question pattern detection", icon: ListChecks, detail: "Organise question patterns into clear areas for revision." },
  { label: "Predict", title: "Topic and question predictions", icon: LineChart, detail: "Highlight important question patterns and topics that students should focus on." },
] as const

function handleEnrollClick() {
  const message =
    "Hello GlobeDk Elite Academy. I am interested in your online tutoring services and would like to know more about the available lessons, subjects, fees and class schedules. I would also like to know how I can enrol. Thank you."

  window.open(
    `https://wa.me/263786053315?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer",
  )
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPredictorMessage, setShowPredictorMessage] = useState(false)
  const [predictorStep, setPredictorStep] = useState(0)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const closeMobileMenu = () => setIsOpen(false)

  const openPredictorMessage = () => {
    setPredictorStep(0)
    setShowPredictorMessage(true)
    closeMobileMenu()
  }

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileMenu()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <div aria-label="Academy announcement" className="homepage-viewport-safe overflow-hidden bg-[#d87a3f] text-[#0b1d33]">
        <motion.div animate={isOpen ? undefined : { x: [0, -120] }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} className="flex min-h-8 w-max items-center gap-8 whitespace-nowrap px-4 text-[10px] font-bold uppercase tracking-[0.2em] sm:min-h-9 sm:text-[11px]">
          <span>Excellence in Education. Success for Life.</span><span aria-hidden="true" className="text-[#10243d]/50">✦</span><span>Excellence in Education. Success for Life.</span><span aria-hidden="true" className="text-[#10243d]/50">✦</span><span>Excellence in Education. Success for Life.</span>
          <Link href="/contact" className="hidden border-l border-[#10243d]/20 pl-8 transition-opacity hover:opacity-70 sm:inline-flex">Contact Us ↗</Link>
        </motion.div>
      </div>

      <nav aria-label="Primary navigation" className="homepage-viewport-safe sticky top-0 z-50 border-b border-[#d9d3c8]/80 bg-[#f4f1ea]/95 text-[#14263d] shadow-[0_8px_30px_rgba(20,38,61,0.06)] backdrop-blur-xl">
        <div className="container">
          <div className="flex h-[4.7rem] items-center justify-between gap-4">
            <BrandLink href="/" variant="header" onClick={closeMobileMenu} aria-label="GlobeDk Elite Academy home" />

            <div className="hidden items-center gap-4 lg:flex">
              <span className="hidden text-[9px] font-bold uppercase tracking-[0.2em] text-[#526071] xl:block">Harare / Zimbabwe</span>
              <span className="h-5 w-px bg-[#d9d3c8]" />
              <Button onClick={handleEnrollClick} size="sm" className="rounded-full bg-[#10243d] px-5 text-white shadow-lg shadow-[#10243d]/10 hover:bg-[#193653]">Enroll Now <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" /></Button>
            </div>

            <button type="button" onClick={() => setIsOpen((open) => !open)} className="relative z-[70] flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d9d3c8] text-[#14263d] transition-colors hover:bg-[#eae4d9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b15d2b] lg:hidden" aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen} aria-controls="mobile-navigation">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={isOpen ? "close" : "open"} initial={{ opacity: 0, rotate: -45, scale: 0.7 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 45, scale: 0.7 }} transition={{ duration: 0.18 }}>
                  {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          <div className="hidden pb-3 lg:block">
            <div className="flex items-center justify-between rounded-2xl bg-[#10243d] px-4 py-2.5 text-white shadow-[0_12px_26px_rgba(16,36,61,0.12)]">
              <div className="flex items-center gap-1">
                {navLinks.map((link, index) => (
                  <Link key={link.href} href={link.href} className="group flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white">
                    <span className="text-[9px] font-bold text-[#e3a56f]">0{index + 1}</span>{link.label}
                  </Link>
                ))}
              </div>
              <button type="button" onClick={openPredictorMessage} className="flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white">
                <Sparkles className="h-3.5 w-3.5 text-[#e3a56f]" aria-hidden="true" />
                AI Exam Predictor
                <span className="rounded-full border border-[#e3a56f]/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#e3a56f]">Soon</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button type="button" aria-label="Close navigation drawer" onClick={closeMobileMenu} className="fixed inset-0 z-[55] bg-[#0b1d33]/55 backdrop-blur-[2px] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
            <motion.aside id="mobile-navigation" aria-label="Mobile navigation" className="fixed inset-y-0 right-0 z-[65] flex w-[min(88vw,380px)] flex-col overflow-y-auto overscroll-contain border-l border-[#d9d3c8] bg-[#f4f1ea] px-5 pb-6 pt-24 shadow-[-20px_0_60px_rgba(11,29,51,0.2)] lg:hidden" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 340, damping: 32 }}>
              <div className="mb-7 flex items-end justify-between border-b border-[#d9d3c8] pb-5">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#b15d2b]">GlobeDk Elite Academy</p><p className="mt-2 font-serif text-2xl tracking-[-0.03em] text-[#14263d]">Explore the academy</p></div>
                <button ref={closeButtonRef} type="button" onClick={closeMobileMenu} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9d3c8] text-[#526071] transition-colors hover:bg-white hover:text-[#14263d]" aria-label="Close menu"><X className="h-5 w-5" aria-hidden="true" /></button>
              </div>
              <div className="space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div key={link.href} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.035 }}><Link href={link.href} onClick={closeMobileMenu} className="flex min-h-12 items-center justify-between rounded-xl px-3 text-base font-medium text-[#526071] transition-colors hover:bg-white hover:text-[#14263d] active:scale-[0.99]"><span>{link.label}</span><span className="text-xs text-[#b15d2b]">0{index + 1}</span></Link></motion.div>
                ))}
                <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }}><button type="button" onClick={openPredictorMessage} className="flex min-h-12 w-full items-center justify-between rounded-xl px-3 text-left text-base font-medium text-[#526071] transition-colors hover:bg-white hover:text-[#14263d] active:scale-[0.99]"><span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#b15d2b]" aria-hidden="true" />AI Exam Predictor</span><span className="rounded-full border border-[#d87a3f]/30 bg-[#d87a3f]/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#b15d2b]">Soon</span></button></motion.div>
              </div>
              <div className="mt-auto pt-8"><Button onClick={() => { closeMobileMenu(); handleEnrollClick() }} size="lg" className="min-h-12 w-full rounded-full bg-[#10243d] text-white hover:bg-[#193653]">Enroll Now <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" /></Button><p className="mt-4 text-center text-xs leading-relaxed text-[#526071]">Excellence in Education. Success for Life.</p></div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {showPredictorMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4" role="dialog" aria-modal="true" aria-labelledby="predictor-title">
          <button type="button" aria-label="Close AI Exam Predictor dialog" className="absolute inset-0 h-full w-full cursor-default bg-[#10243d]/70 backdrop-blur-sm" onClick={() => setShowPredictorMessage(false)} />
          <motion.div initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="relative my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[1.75rem] border border-[#d9d3c8] bg-[#f4f1ea] text-[#14263d] shadow-2xl">
            <div className="relative overflow-hidden bg-[#eae4d9] px-6 pb-6 pt-7 sm:px-8">
              <button type="button" onClick={() => setShowPredictorMessage(false)} className="absolute right-4 top-4 rounded-full p-2 text-[#526071] transition-colors hover:bg-white hover:text-[#14263d]" aria-label="Close"><X className="h-5 w-5" aria-hidden="true" /></button>
              <div className="flex items-start gap-4"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#10243d] text-[#e3a56f] shadow-lg"><BrainCircuit className="h-7 w-7" aria-hidden="true" /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#b15d2b]">AI intelligence system in development</p><h2 id="predictor-title" className="mt-2 font-serif text-3xl font-bold tracking-[-0.03em]">AI Exam Predictor</h2></div></div>
              <div className="mt-5 flex items-center justify-between gap-3"><div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#b15d2b]"><Construction className="h-3.5 w-3.5" aria-hidden="true" />Currently Under Construction</div><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#526071]">Preview flow</span></div>
            </div>
            <div className="px-6 py-6 sm:px-8">
              <p className="max-w-lg text-sm leading-relaxed text-[#526071]">We're building something special for GlobeDk students. The AI Exam Predictor will analyse previous examination papers and help identify important question patterns and topics that students should focus on.</p>
              <div className="mt-6 grid gap-2 sm:grid-cols-3" role="tablist" aria-label="AI Exam Predictor stages">
                {predictorSteps.map((step, index) => { const Icon = step.icon; return <button key={step.label} type="button" role="tab" aria-selected={predictorStep === index} onClick={() => setPredictorStep(index)} className={`rounded-xl border p-3 text-left transition-colors ${predictorStep === index ? "border-[#b15d2b] bg-[#10243d] text-white" : "border-[#d9d3c8] bg-white/50 text-[#526071] hover:bg-white"}`}><span className="flex items-center justify-between"><Icon className={`h-4 w-4 ${predictorStep === index ? "text-[#e3a56f]" : "text-[#b15d2b]"}`} aria-hidden="true" /><span className="text-[10px] font-bold">0{index + 1}</span></span><span className="mt-5 block text-xs font-semibold">{step.label}</span></button> })}
              </div>
              <AnimatePresence mode="wait" initial={false}><motion.div key={predictorStep} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }} className="mt-4 rounded-2xl bg-[#10243d] p-5 text-white"><div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e3a56f]">Stage 0{predictorStep + 1}</span><span className="text-xs text-white/45">{predictorStep + 1} / {predictorSteps.length}</span></div><h3 className="mt-8 font-serif text-2xl">{predictorSteps[predictorStep].title}</h3><p className="mt-2 max-w-md text-sm leading-relaxed text-white/65">{predictorSteps[predictorStep].detail}</p><div className="mt-6 h-1 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full bg-[#d87a3f]" initial={{ width: 0 }} animate={{ width: `${((predictorStep + 1) / predictorSteps.length) * 100}%` }} transition={{ duration: 0.35 }} /></div></motion.div></AnimatePresence>
              <div className="mt-4 flex justify-between gap-3"><Button type="button" variant="outline" onClick={() => setPredictorStep((step) => Math.max(0, step - 1))} disabled={predictorStep === 0} className="rounded-full border-[#d9d3c8]">Previous</Button><Button type="button" onClick={() => setPredictorStep((step) => Math.min(predictorSteps.length - 1, step + 1))} disabled={predictorStep === predictorSteps.length - 1} className="rounded-full bg-[#d87a3f] text-white hover:bg-[#c86931]">Next stage <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" /></Button></div>
              <div className="mt-6 rounded-2xl border border-[#d9d3c8] bg-white/60 p-4"><p className="mb-3 text-sm font-semibold">What we're working on:</p><div className="grid gap-3 text-sm text-[#526071] sm:grid-cols-2">{["Past examination paper analysis", "Question pattern detection", "Topic and question predictions", "AI-powered mock examinations"].map((feature) => <div key={feature} className="flex items-center gap-2"><Sparkles className="h-4 w-4 shrink-0 text-[#b15d2b]" aria-hidden="true" /><span>{feature}</span></div>)}</div></div>
              <p className="mt-5 text-center text-xs leading-relaxed text-[#526071]">The feature is still being developed and will be available to students once it is ready.</p><Button type="button" onClick={() => setShowPredictorMessage(false)} className="mt-6 w-full rounded-full bg-[#10243d] text-white hover:bg-[#193653]">Got it</Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
