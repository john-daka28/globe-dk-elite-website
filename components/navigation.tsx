"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Menu,
  X,
  Sparkles,
  BrainCircuit,
  Construction,
} from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPredictorMessage, setShowPredictorMessage] = useState(false)

  const router = useRouter()

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/subjects", label: "Subjects" },
    {
      href: "#",
      label: "AI Exam Predictor",
      ai: true,
      comingSoon: true,
    },
    { href: "/timetable", label: "Timetable" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/contact", label: "Contact" },
  ]

  const handleEnrollClick = () => {
    router.push("/enroll")
  }

  const closeMobileMenu = () => {
    setIsOpen(false)
  }

  const handlePredictorClick = () => {
    setShowPredictorMessage(true)
    setIsOpen(false)
  }

  const closePredictorModal = () => {
    setShowPredictorMessage(false)
  }

  return (
    <>
      {/* ========================================================= */}
      {/* NAVIGATION */}
      {/* ========================================================= */}

      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">

            {/* ===================================================== */}
            {/* LOGO */}
            {/* ===================================================== */}

            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl"
              onClick={closeMobileMenu}
            >
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg">
                <Image
                  src="/Logo.png"
                  alt="GlobeDk Elite Academy Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
              </div>

              <span className="hidden sm:inline">
                GlobeDk Elite Academy
              </span>
            </Link>

            {/* ===================================================== */}
            {/* DESKTOP NAVIGATION */}
            {/* ===================================================== */}

            <div className="hidden md:flex items-center gap-5">
              {navLinks.map((link) =>
                link.comingSoon ? (
                  <button
                    key={link.label}
                    type="button"
                    onClick={handlePredictorClick}
                    className="group relative flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {/* Animated hover glow */}
                    <span className="absolute -inset-2 rounded-lg bg-primary/10 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />

                    <span className="relative flex items-center gap-1.5">

                      {/* Animated AI sparkle */}
                      <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse transition-transform group-hover:rotate-12" />

                      <span>{link.label}</span>

                      {/* Coming Soon Badge */}
                      <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary">
                        Soon
                      </span>
                    </span>
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.ai && (
                      <Sparkles className="h-3.5 w-3.5 text-primary transition-transform group-hover:rotate-12" />
                    )}

                    <span>{link.label}</span>
                  </Link>
                )
              )}

              {/* =================================================== */}
              {/* ENROLLMENT CTA */}
              {/* =================================================== */}

              <Button
                onClick={handleEnrollClick}
                size="sm"
                className="ml-1"
              >
                Enroll Now
              </Button>
            </div>

            {/* ===================================================== */}
            {/* MOBILE MENU BUTTON */}
            {/* ===================================================== */}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden rounded-md p-2 text-foreground transition-colors hover:bg-muted"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* ===================================================== */}
          {/* MOBILE NAVIGATION */}
          {/* ===================================================== */}

          {isOpen && (
            <div className="md:hidden space-y-2 border-t border-border/40 py-4">

              {navLinks.map((link) =>
                link.comingSoon ? (
                  <button
                    key={link.label}
                    type="button"
                    onClick={handlePredictorClick}
                    className="group relative flex w-full items-center gap-2 rounded-md px-3 py-3 text-left text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />

                    <span>{link.label}</span>

                    <span className="ml-auto rounded-full bg-primary/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-primary">
                      Coming Soon
                    </span>
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 rounded-md px-3 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                    onClick={closeMobileMenu}
                  >
                    {link.ai && (
                      <Sparkles className="h-4 w-4 text-primary" />
                    )}

                    <span>{link.label}</span>
                  </Link>
                )
              )}

              {/* ================================================= */}
              {/* MOBILE ENROLLMENT CTA */}
              {/* ================================================= */}

              <Button
                onClick={() => {
                  closeMobileMenu()
                  handleEnrollClick()
                }}
                className="mt-3 w-full"
              >
                Enroll Now
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* ========================================================= */}
      {/* AI EXAM PREDICTOR MODAL */}
      {/* ========================================================= */}

      {showPredictorMessage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="predictor-title"
        >

          {/* ===================================================== */}
          {/* BACKGROUND OVERLAY */}
          {/* ===================================================== */}

          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={closePredictorModal}
          />

          {/* ===================================================== */}
          {/* MODAL */}
          {/* ===================================================== */}

          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">

            {/* =================================================== */}
            {/* ANIMATED AI HEADER */}
            {/* =================================================== */}

            <div className="relative overflow-hidden bg-primary/5 px-6 pb-6 pt-8 text-center">

              {/* Decorative animated glow - top left */}
              <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl animate-pulse" />

              {/* Decorative animated glow - bottom right */}
              <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl animate-pulse" />

              {/* ================================================= */}
              {/* CLOSE BUTTON */}
              {/* ================================================= */}

              <button
                type="button"
                onClick={closePredictorModal}
                className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* ================================================= */}
              {/* ANIMATED AI ICON */}
              {/* ================================================= */}

              <div className="relative mx-auto mb-5 flex h-24 w-24 items-center justify-center">

                {/* Outer rotating ring */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-[spin_6s_linear_infinite]" />

                {/* Dashed rotating ring */}
                <div className="absolute inset-2 rounded-full border border-dashed border-primary/30 animate-[spin_4s_linear_infinite_reverse]" />

                {/* Pulsing AI glow */}
                <div className="absolute inset-4 rounded-2xl bg-primary/10 blur-xl animate-pulse" />

                {/* Main AI container */}
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-8 ring-primary/5">

                  {/* AI Brain */}
                  <BrainCircuit
                    className="h-10 w-10 text-primary animate-[pulse_2s_ease-in-out_infinite]"
                  />

                  {/* Top-right sparkle */}
                  <Sparkles
                    className="absolute -right-2 -top-2 h-5 w-5 text-primary animate-[bounce_1.5s_ease-in-out_infinite]"
                  />

                  {/* Bottom-left sparkle */}
                  <Sparkles
                    className="absolute -bottom-2 -left-2 h-4 w-4 text-primary animate-[pulse_1.8s_ease-in-out_infinite]"
                  />

                  {/* Moving dot */}
                  <span className="absolute -right-3 top-1/2 h-2 w-2 rounded-full bg-primary animate-[ping_2s_ease-in-out_infinite]" />

                  {/* Another moving dot */}
                  <span className="absolute -top-3 left-1/2 h-1.5 w-1.5 rounded-full bg-primary animate-[ping_2.5s_ease-in-out_infinite]" />

                </div>
              </div>

              {/* ================================================= */}
              {/* TITLE */}
              {/* ================================================= */}

              <h2
                id="predictor-title"
                className="relative text-2xl font-bold"
              >
                AI Exam Predictor
              </h2>

              {/* ================================================= */}
              {/* LIVE DEVELOPMENT INDICATOR */}
              {/* ================================================= */}

              <div className="relative mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">

                {/* Animated status indicator */}
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />

                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>

                <span>
                  AI intelligence system in development
                </span>
              </div>

              {/* ================================================= */}
              {/* CONSTRUCTION BADGE */}
              {/* ================================================= */}

              <div className="relative mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Construction className="h-3.5 w-3.5 animate-pulse" />

                Currently Under Construction
              </div>
            </div>

            {/* =================================================== */}
            {/* MODAL CONTENT */}
            {/* =================================================== */}

            <div className="px-6 py-6 text-center">

              {/* Description */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                We're building something special for GlobeDk students.
                The AI Exam Predictor will analyse previous examination
                papers and help identify important question patterns and
                topics that students should focus on.
              </p>

              {/* ================================================= */}
              {/* FEATURE PREVIEW */}
              {/* ================================================= */}

              <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4 text-left">

                <p className="mb-3 text-sm font-semibold">
                  What we're working on:
                </p>

                <div className="space-y-3 text-sm text-muted-foreground">

                  {/* Feature 1 */}
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-primary animate-pulse" />

                    <span>
                      Past examination paper analysis
                    </span>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-primary animate-pulse [animation-delay:200ms]" />

                    <span>
                      Question pattern detection
                    </span>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-primary animate-pulse [animation-delay:400ms]" />

                    <span>
                      Topic and question predictions
                    </span>
                  </div>

                  {/* Feature 4 */}
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-primary animate-pulse [animation-delay:600ms]" />

                    <span>
                      AI-powered mock examinations
                    </span>
                  </div>
                </div>
              </div>

              {/* ================================================= */}
              {/* DEVELOPMENT MESSAGE */}
              {/* ================================================= */}

              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                The feature is still being developed and will be
                available to students once it is ready.
              </p>

              {/* ================================================= */}
              {/* CLOSE BUTTON */}
              {/* ================================================= */}

              <Button
                type="button"
                onClick={closePredictorModal}
                className="mt-6 w-full"
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}