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
  Hand,
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
              className="flex items-center gap-2 text-xl font-bold"
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

            <div className="hidden items-center gap-5 md:flex">
              {navLinks.map((link) =>
                link.comingSoon ? (
                  <button
                    key={link.label}
                    type="button"
                    onClick={handlePredictorClick}
                    className="group relative flex cursor-pointer items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {/* Animated hover glow behind navigation item */}
                    <span className="absolute -inset-2 rounded-lg bg-primary/10 opacity-0 blur-md transition-all duration-300 group-hover:opacity-100" />

                    <span className="relative flex items-center gap-1.5">

                      {/* ================================================= */}
                      {/* ANIMATED AI SPARKLE */}
                      {/* ================================================= */}

                      <Sparkles
                        className="
                          h-3.5
                          w-3.5
                          animate-pulse
                          text-primary
                          transition-all
                          duration-300
                          group-hover:rotate-12
                          group-hover:scale-125
                        "
                      />

                      {/* Navigation text */}
                      <span>
                        {link.label}
                      </span>

                      {/* ================================================= */}
                      {/* EYECATCHING SOON BADGE */}
                      {/* ================================================= */}

                      <span
                        className="
                          relative
                          ml-1
                          inline-flex
                          cursor-pointer
                          items-center
                          gap-1
                          overflow-visible
                          rounded-full
                          border
                          border-primary/30
                          bg-primary/10
                          px-2
                          py-0.5
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-primary
                          shadow-sm
                          transition-all
                          duration-300
                          animate-[pulse_2.5s_ease-in-out_infinite]
                          group-hover:scale-110
                          group-hover:bg-primary/20
                          group-hover:shadow-[0_0_15px_hsl(var(--primary)/0.4)]
                        "
                      >

                        {/* ================================================= */}
                        {/* BLINKING OUTER SHAPE */}
                        {/* ================================================= */}

                        <span
                          className="
                            pointer-events-none
                            absolute
                            -inset-1
                            rounded-full
                            border
                            border-primary/40
                            opacity-70
                            animate-ping
                          "
                        />

                        {/* Second subtle blinking border */}
                        <span
                          className="
                            pointer-events-none
                            absolute
                            -inset-0.5
                            rounded-full
                            border
                            border-primary/30
                            animate-pulse
                          "
                        />

                        {/* ================================================= */}
                        {/* MOVING SHINE */}
                        {/* ================================================= */}

                        <span
                          className="
                            pointer-events-none
                            absolute
                            inset-0
                            overflow-hidden
                            rounded-full
                          "
                        >
                          <span
                            className="
                              absolute
                              inset-y-0
                              left-0
                              w-1/3
                              -translate-x-full
                              bg-gradient-to-r
                              from-transparent
                              via-white/50
                              to-transparent
                              animate-[shimmer_2.5s_infinite]
                            "
                          />
                        </span>

                        {/* ================================================= */}
                        {/* PULSING STATUS DOT */}
                        {/* ================================================= */}

                        <span className="relative flex h-1.5 w-1.5 shrink-0">

                          {/* Outer pulse */}
                          <span
                            className="
                              absolute
                              inline-flex
                              h-full
                              w-full
                              rounded-full
                              bg-primary
                              opacity-75
                              animate-ping
                            "
                          />

                          {/* Inner dot */}
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                        </span>

                        {/* ================================================= */}
                        {/* SOON TEXT */}
                        {/* ================================================= */}

                        <span className="relative z-10">
                          Soon
                        </span>

                        {/* ================================================= */}
                        {/* CLICKABLE HAND */}
                        {/* ================================================= */}

                        <Hand
                          className="
                            relative
                            z-10
                            h-3
                            w-3
                            origin-bottom-left
                            text-primary
                            animate-bounce
                            transition-transform
                            duration-300
                            group-hover:scale-125
                          "
                        />
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

              {/* ===================================================== */}
              {/* ENROLLMENT CTA */}
              {/* ===================================================== */}

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
              className="rounded-md p-2 text-foreground transition-colors hover:bg-muted md:hidden"
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
            <div className="space-y-2 border-t border-border/40 py-4 md:hidden">

              {navLinks.map((link) =>
                link.comingSoon ? (
                  <button
                    key={link.label}
                    type="button"
                    onClick={handlePredictorClick}
                    className="group relative flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-3 text-left text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                  >

                    {/* Animated AI icon */}
                    <Sparkles
                      className="
                        h-4
                        w-4
                        animate-pulse
                        text-primary
                        transition-transform
                        duration-300
                        group-hover:rotate-12
                        group-hover:scale-125
                      "
                    />

                    {/* Label */}
                    <span>
                      {link.label}
                    </span>

                    {/* ================================================= */}
                    {/* MOBILE SOON BADGE */}
                    {/* ================================================= */}

                    <span
                      className="
                        relative
                        ml-auto
                        inline-flex
                        cursor-pointer
                        items-center
                        gap-1.5
                        overflow-visible
                        rounded-full
                        border
                        border-primary/30
                        bg-primary/10
                        px-2.5
                        py-1
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-primary
                        shadow-sm
                        transition-all
                        duration-300
                        animate-[pulse_2.5s_ease-in-out_infinite]
                        group-hover:scale-110
                        group-hover:bg-primary/20
                        group-hover:shadow-[0_0_15px_hsl(var(--primary)/0.4)]
                      "
                    >

                      {/* Blinking outer shape */}
                      <span
                        className="
                          pointer-events-none
                          absolute
                          -inset-1
                          rounded-full
                          border
                          border-primary/40
                          opacity-70
                          animate-ping
                        "
                      />

                      {/* Inner blinking border */}
                      <span
                        className="
                          pointer-events-none
                          absolute
                          -inset-0.5
                          rounded-full
                          border
                          border-primary/30
                          animate-pulse
                        "
                      />

                      {/* Pulsing status dot */}
                      <span className="relative flex h-1.5 w-1.5 shrink-0">

                        <span
                          className="
                            absolute
                            inline-flex
                            h-full
                            w-full
                            rounded-full
                            bg-primary
                            opacity-75
                            animate-ping
                          "
                        />

                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                      </span>

                      {/* Soon text */}
                      <span className="relative z-10">
                        Soon
                      </span>

                      {/* Animated hand */}
                      <Hand
                        className="
                          relative
                          z-10
                          h-3
                          w-3
                          origin-bottom-left
                          text-primary
                          animate-bounce
                        "
                      />
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

              {/* ===================================================== */}
              {/* MOBILE ENROLLMENT CTA */}
              {/* ===================================================== */}

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
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="predictor-title"
        >

          {/* ===================================================== */}
          {/* BACKGROUND OVERLAY */}
          {/* ===================================================== */}

          <div
            className="absolute inset-0 animate-in bg-black/60 backdrop-blur-sm fade-in duration-300"
            onClick={closePredictorModal}
          />

          {/* ===================================================== */}
          {/* RESPONSIVE MODAL */}
          {/* ===================================================== */}

          <div
            className="
              relative
              my-auto
              max-h-[90vh]
              w-full
              max-w-md
              overflow-y-auto
              rounded-2xl
              border
              border-border
              bg-background
              shadow-2xl
              animate-in
              zoom-in-95
              slide-in-from-bottom-4
              duration-300
            "
          >

            {/* =================================================== */}
            {/* ANIMATED AI HEADER */}
            {/* =================================================== */}

            <div className="relative overflow-hidden bg-primary/5 px-5 pb-5 pt-6 text-center sm:px-6 sm:pb-6 sm:pt-7">

              {/* Decorative animated glow - top left */}
              <div className="absolute -left-12 -top-12 h-28 w-28 animate-pulse rounded-full bg-primary/10 blur-2xl sm:h-32 sm:w-32" />

              {/* Decorative animated glow - bottom right */}
              <div className="absolute -bottom-12 -right-12 h-28 w-28 animate-pulse rounded-full bg-primary/10 blur-2xl sm:h-32 sm:w-32" />

              {/* ================================================= */}
              {/* CLOSE BUTTON */}
              {/* ================================================= */}

              <button
                type="button"
                onClick={closePredictorModal}
                className="absolute right-3 top-3 z-10 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:right-4 sm:top-4"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* ================================================= */}
              {/* ANIMATED AI ICON */}
              {/* ================================================= */}

              <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center sm:mb-5 sm:h-24 sm:w-24">

                {/* Outer rotating ring */}
                <div className="absolute inset-0 animate-[spin_6s_linear_infinite] rounded-full border-2 border-primary/20" />

                {/* Dashed rotating ring */}
                <div className="absolute inset-2 animate-[spin_4s_linear_infinite_reverse] rounded-full border border-dashed border-primary/30" />

                {/* Pulsing AI glow */}
                <div className="absolute inset-4 animate-pulse rounded-2xl bg-primary/10 blur-xl" />

                {/* Main AI container */}
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-8 ring-primary/5 sm:h-20 sm:w-20">

                  {/* AI Brain */}
                  <BrainCircuit
                    className="h-8 w-8 animate-[pulse_2s_ease-in-out_infinite] text-primary sm:h-10 sm:w-10"
                  />

                  {/* Top-right sparkle */}
                  <Sparkles
                    className="absolute -right-2 -top-2 h-4 w-4 animate-[bounce_1.5s_ease-in-out_infinite] text-primary sm:h-5 sm:w-5"
                  />

                  {/* Bottom-left sparkle */}
                  <Sparkles
                    className="absolute -bottom-2 -left-2 h-3.5 w-3.5 animate-[pulse_1.8s_ease-in-out_infinite] text-primary sm:h-4 sm:w-4"
                  />

                  {/* Moving dot */}
                  <span className="absolute -right-3 top-1/2 h-2 w-2 animate-[ping_2s_ease-in-out_infinite] rounded-full bg-primary" />

                  {/* Another moving dot */}
                  <span className="absolute -top-3 left-1/2 h-1.5 w-1.5 animate-[ping_2.5s_ease-in-out_infinite] rounded-full bg-primary" />
                </div>
              </div>

              {/* ================================================= */}
              {/* TITLE */}
              {/* ================================================= */}

              <h2
                id="predictor-title"
                className="relative text-xl font-bold sm:text-2xl"
              >
                AI Exam Predictor
              </h2>

              {/* ================================================= */}
              {/* LIVE DEVELOPMENT INDICATOR */}
              {/* ================================================= */}

              <div className="relative mt-2 flex items-center justify-center gap-2 text-[11px] text-muted-foreground sm:text-xs">

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

              <div className="relative mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary sm:text-xs">
                <Construction className="h-3.5 w-3.5 animate-pulse" />

                Currently Under Construction
              </div>
            </div>

            {/* =================================================== */}
            {/* MODAL CONTENT */}
            {/* =================================================== */}

            <div className="px-5 py-5 sm:px-6 sm:py-6">

              {/* Description */}
              <p className="text-center text-sm leading-relaxed text-muted-foreground">
                We're building something special for GlobeDk students.
                The AI Exam Predictor will analyse previous examination
                papers and help identify important question patterns and
                topics that students should focus on.
              </p>

              {/* ================================================= */}
              {/* FEATURE PREVIEW */}
              {/* ================================================= */}

              <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3.5 sm:mt-5 sm:p-4">

                <p className="mb-3 text-sm font-semibold">
                  What we're working on:
                </p>

                <div className="space-y-2.5 text-sm text-muted-foreground">

                  {/* Feature 1 */}
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 animate-pulse text-primary" />

                    <span>
                      Past examination paper analysis
                    </span>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 animate-pulse text-primary [animation-delay:200ms]" />

                    <span>
                      Question pattern detection
                    </span>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 animate-pulse text-primary [animation-delay:400ms]" />

                    <span>
                      Topic and question predictions
                    </span>
                  </div>

                  {/* Feature 4 */}
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 animate-pulse text-primary [animation-delay:600ms]" />

                    <span>
                      AI-powered mock examinations
                    </span>
                  </div>
                </div>
              </div>

              {/* ================================================= */}
              {/* DEVELOPMENT MESSAGE */}
              {/* ================================================= */}

              <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground sm:mt-5">
                The feature is still being developed and will be
                available to students once it is ready.
              </p>

              {/* ================================================= */}
              {/* CLOSE BUTTON */}
              {/* ================================================= */}

              <Button
                type="button"
                onClick={closePredictorModal}
                className="mt-5 w-full sm:mt-6"
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