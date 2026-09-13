"use client"

import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BrandLink } from "@/components/brand"
import {
  ArrowUpRight,
  Menu,
  Sparkles,
  X,
} from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/subjects", label: "Subjects" },
  { href: "/timetable", label: "Timetable" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
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

  const closeMobileMenu = () => {
    setIsOpen(false)
  }

  const handlePredictorClick = () => {
    closeMobileMenu()
    window.location.href = "/ai"
  }

  return (
    <>
      {/* ============================================================
          ANNOUNCEMENT BAR
      ============================================================ */}
      <div
        aria-label="Academy announcement"
        className="homepage-viewport-safe overflow-hidden bg-[#d87a3f] text-[#0b1d33]"
      >
        <motion.div
          animate={isOpen ? undefined : { x: [0, -120] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex min-h-8 w-max items-center gap-8 whitespace-nowrap px-4 text-[10px] font-bold uppercase tracking-[0.2em] sm:min-h-9 sm:text-[11px]"
        >
          <span>
            Excellence in Education. Success for Life.
          </span>

          <span
            aria-hidden="true"
            className="text-[#10243d]/50"
          >
            ✦
          </span>

          <span>
            Excellence in Education. Success for Life.
          </span>

          <span
            aria-hidden="true"
            className="text-[#10243d]/50"
          >
            ✦
          </span>

          <span>
            Excellence in Education. Success for Life.
          </span>

          <Link
            href="/contact"
            className="hidden border-l border-[#10243d]/20 pl-8 transition-opacity hover:opacity-70 sm:inline-flex"
          >
            Contact Us ↗
          </Link>
        </motion.div>
      </div>

      {/* ============================================================
          MAIN NAVIGATION
      ============================================================ */}
      <nav
        aria-label="Primary navigation"
        className="homepage-viewport-safe sticky top-0 z-50 border-b border-[#d9d3c8]/80 bg-[#f4f1ea]/95 text-[#14263d] shadow-[0_8px_30px_rgba(20,38,61,0.06)] backdrop-blur-xl"
      >
        <div className="container">
          <div className="flex h-[4.7rem] items-center justify-between gap-4">

            {/* LOGO */}
            <BrandLink
              href="/"
              variant="header"
              onClick={closeMobileMenu}
              aria-label="GlobeDk Elite Academy home"
            />

            {/* ======================================================
                DESKTOP RIGHT SIDE
            ====================================================== */}
            <div className="hidden items-center gap-4 lg:flex">
              <span className="hidden text-[9px] font-bold uppercase tracking-[0.2em] text-[#526071] xl:block">
                Harare / Zimbabwe
              </span>

              <span className="h-5 w-px bg-[#d9d3c8]" />

              <Button
                onClick={handleEnrollClick}
                size="sm"
                className="rounded-full bg-[#10243d] px-5 text-white shadow-lg shadow-[#10243d]/10 hover:bg-[#193653]"
              >
                Enroll Now

                <ArrowUpRight
                  className="ml-1.5 h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </Button>
            </div>

            {/* ======================================================
                MOBILE MENU BUTTON
            ====================================================== */}
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className="relative z-[70] flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d9d3c8] text-[#14263d] transition-colors hover:bg-[#eae4d9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b15d2b] lg:hidden"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? (
                <X
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              ) : (
                <Menu
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>

          {/* ==========================================================
              DESKTOP NAVIGATION BAR
          ========================================================== */}
          <div className="hidden pb-3 lg:block">
            <div className="flex items-center justify-between rounded-2xl bg-[#10243d] px-4 py-2.5 text-white shadow-[0_12px_26px_rgba(16,36,61,0.12)]">

              {/* MAIN LINKS */}
              <div className="flex items-center gap-1">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <span className="text-[9px] font-bold text-[#e3a56f]">
                      0{index + 1}
                    </span>

                    {link.label}
                  </Link>
                ))}
              </div>

              {/* ======================================================
                  AI EXAM PREDICTOR
              ====================================================== */}
              <button
                type="button"
                onClick={handlePredictorClick}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Sparkles
                  className="h-3.5 w-3.5 text-[#e3a56f]"
                  aria-hidden="true"
                />

                AI Exam Predictor

                <span className="rounded-full border border-[#e3a56f]/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#e3a56f]">
                  AI
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ============================================================
          MOBILE NAVIGATION DRAWER
      ============================================================ */}
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.button
            type="button"
            aria-label="Close navigation drawer"
            onClick={closeMobileMenu}
            className="fixed inset-0 z-[55] bg-[#0b1d33]/55 backdrop-blur-[2px] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* DRAWER */}
          <motion.aside
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="fixed inset-y-0 right-0 z-[65] flex w-[min(88vw,380px)] flex-col overflow-y-auto overscroll-contain border-l border-[#d9d3c8] bg-[#f4f1ea] px-5 pb-6 pt-24 shadow-[-20px_0_60px_rgba(11,29,51,0.2)] lg:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 340,
              damping: 32,
            }}
          >
            {/* DRAWER HEADER */}
            <div className="mb-7 flex items-end justify-between border-b border-[#d9d3c8] pb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#b15d2b]">
                  GlobeDk Elite Academy
                </p>

                <p className="mt-2 font-serif text-2xl tracking-[-0.03em] text-[#14263d]">
                  Explore the academy
                </p>
              </div>

              <button
                type="button"
                onClick={closeMobileMenu}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9d3c8] text-[#526071] transition-colors hover:bg-white hover:text-[#14263d]"
                aria-label="Close menu"
              >
                <X
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* MOBILE LINKS */}
            <div className="space-y-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.035,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="flex min-h-12 items-center justify-between rounded-xl px-3 text-base font-medium text-[#526071] transition-colors hover:bg-white hover:text-[#14263d] active:scale-[0.99]"
                  >
                    <span>{link.label}</span>

                    <span className="text-xs text-[#b15d2b]">
                      0{index + 1}
                    </span>
                  </Link>
                </motion.div>
              ))}

              {/* ======================================================
                  MOBILE AI EXAM PREDICTOR
              ====================================================== */}
              <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.22,
                }}
              >
                <button
                  type="button"
                  onClick={handlePredictorClick}
                  className="flex min-h-12 w-full items-center justify-between rounded-xl px-3 text-left text-base font-medium text-[#526071] transition-colors hover:bg-white hover:text-[#14263d] active:scale-[0.99]"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles
                      className="h-4 w-4 text-[#b15d2b]"
                      aria-hidden="true"
                    />

                    AI Exam Predictor
                  </span>

                  <span className="rounded-full border border-[#b15d2b]/30 bg-[#d87a3f]/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#b15d2b]">
                    AI
                  </span>
                </button>
              </motion.div>
            </div>

            {/* ======================================================
                MOBILE ENROLL BUTTON
            ====================================================== */}
            <div className="mt-auto pt-8">
              <Button
                onClick={() => {
                  closeMobileMenu()
                  handleEnrollClick()
                }}
                size="lg"
                className="min-h-12 w-full rounded-full bg-[#10243d] text-white hover:bg-[#193653]"
              >
                Enroll Now

                <ArrowUpRight
                  className="ml-2 h-4 w-4"
                  aria-hidden="true"
                />
              </Button>

              <p className="mt-4 text-center text-xs leading-relaxed text-[#526071]">
                Excellence in Education. Success for Life.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </>
  )
}