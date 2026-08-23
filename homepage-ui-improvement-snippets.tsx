"use client"

import Link from "next/link"
import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const proofPoints = [
  "Curriculum-aligned tutoring",
  "Flexible online schedules",
  "One-to-one academic support",
]

const subjectGroups = [
  {
    title: "Mathematics",
    description: "Build confidence with guided problem-solving and exam-focused practice.",
  },
  {
    title: "Sciences",
    description: "Strengthen concepts across Combined Science, Physics, Chemistry, and Biology.",
  },
  {
    title: "Languages & Humanities",
    description: "Develop clear communication, analysis, and structured exam responses.",
  },
]

/**
 * Replace the current long hero copy with a shorter first-screen proposition.
 * Keep detailed service and subject copy in sections below the hero.
 */
export function ImprovedHero() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 bg-[url('/african-students-learning-in-modern-classroom.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/65 via-primary/80 to-primary" />

      {/* Decorative effects are optional and disabled for reduced-motion users. */}
      {!reduceMotion && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
            animate={{ opacity: [0.18, 0.3, 0.18], scale: [1, 1.08, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"
            animate={{ opacity: [0.12, 0.24, 0.12], scale: [1.05, 1, 1.05] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <div className="container relative z-10 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-md sm:text-sm"
          >
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            Welcome to GlobeDk Elite Academy
          </motion.div>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            Online O-Level &amp; A-Level lessons for ZIMSEC and Cambridge students
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/90 sm:text-lg"
          >
            Expert online tutoring, flexible learning, and exam preparation for students in Zimbabwe.
            Learn with confidence and prepare with purpose.
          </motion.p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary" className="w-full min-w-44 sm:w-auto">
              <a href="https://wa.me/263786053315" target="_blank" rel="noreferrer">
                Enroll Now <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full min-w-44 border-white/25 bg-white/10 text-primary-foreground hover:bg-white/20 sm:w-auto"
            >
              <Link href="#subjects">Explore Subjects</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-2 text-left sm:grid-cols-3 sm:gap-3">
            {proofPoints.map((point) => (
              <div
                key={point}
                className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-sm backdrop-blur-md"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-300" aria-hidden="true" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Add this section immediately after the hero to replace the long inline subject list.
 */
export function SubjectPreview() {
  return (
    <section id="subjects" className="bg-background py-16 sm:py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            What can we help you master?
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Focused support across every major subject group
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start with the area where you need the most support, then explore the complete subject list.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-3">
          {subjectGroups.map((group) => (
            <article key={group.title} className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{group.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{group.description}</p>
              <Button asChild variant="link" className="mt-4 h-auto px-0">
                <Link href="/subjects">
                  View subjects <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Use one consistent primary action style across the header and hero.
 * Replace the current desktop/mobile menu wrapper with this contained version.
 */
export function MobileSafeNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const navItems = [
    ["Home", "/"],
    ["About", "/about"],
    ["Subjects", "/subjects"],
    ["Timetable", "/timetable"],
    ["Testimonials", "/testimonials"],
    ["Contact", "/contact"],
  ] as const

  return (
    <nav
      aria-label="Primary navigation"
      className="sticky top-0 z-50 w-full overflow-x-clip border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex min-w-0 items-center gap-2 text-lg font-bold" onClick={() => setIsOpen(false)}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <span className="truncate">GlobeDk Elite Academy</span>
          </Link>

          <div className="hidden items-center gap-5 md:flex">
            {navItems.map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-medium text-foreground/80 hover:text-foreground">
                {label}
              </Link>
            ))}
            <Button asChild size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <a href="https://wa.me/263786053315" target="_blank" rel="noreferrer">Enroll Now</a>
            </Button>
          </div>

          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
            className="shrink-0 rounded-md p-2 text-foreground hover:bg-muted md:hidden"
          >
            {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border/40 md:hidden"
            >
              <div className="space-y-1 py-3">
                {navItems.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-md px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
                  >
                    {label}
                  </Link>
                ))}
                <Button asChild className="mt-2 w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <a href="https://wa.me/263786053315" target="_blank" rel="noreferrer">Enroll Now</a>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

/**
 * Add to app/globals.css if the project wants a global safety net.
 * Prefer Tailwind motion-reduce utilities for component-specific behavior.
 */
export const reducedMotionCss = `
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
`
