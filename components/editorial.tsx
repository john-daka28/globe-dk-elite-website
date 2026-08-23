"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"

export const palette = {
  ink: "#14263d",
  navy: "#0b1d33",
  navyPanel: "#10243d",
  paper: "#f4f1ea",
  sand: "#eae4d9",
  orange: "#d87a3f",
  gold: "#e3a56f",
  rust: "#b15d2b",
  line: "#d9d3c8",
  muted: "#526071",
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  once = true,
}: {
  children: ReactNode
  className?: string
  delay?: number
  once?: boolean
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={reduceMotion ? undefined : { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SectionLabel({ number, children, light = false }: { number: string; children: ReactNode; light?: boolean }) {
  return (
    <p className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] ${light ? "text-[#e3a56f]" : "text-[#b15d2b]"}`}>
      <span>{number}</span>
      <span className={`h-px w-8 ${light ? "bg-[#e3a56f]" : "bg-[#b15d2b]"}`} />
      <span>{children}</span>
    </p>
  )
}

export function PageHero({
  number,
  eyebrow,
  title,
  description,
  sideLabel,
  children,
}: {
  number: string
  eyebrow: string
  title: ReactNode
  description: ReactNode
  sideLabel?: string
  children?: ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#0b1d33] text-[#f8f4eb]">
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div aria-hidden="true" className="absolute -right-44 -top-36 h-[34rem] w-[34rem] rounded-full border border-white/10" />
      <div aria-hidden="true" className="absolute -right-20 top-24 h-[25rem] w-[25rem] rounded-full border border-white/10" />
      <div className="container relative z-10 py-16 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
          <Reveal>
            <SectionLabel number={number} light>{eyebrow}</SectionLabel>
            <h1 className="mt-7 max-w-4xl font-serif text-5xl leading-[0.96] tracking-[-0.055em] text-white sm:text-7xl lg:text-[6.2rem]">{title}</h1>
          </Reveal>
          <Reveal delay={0.12} className="relative lg:pb-2">
            <div className="mb-6 h-px w-16 bg-[#d87a3f]" />
            <p className="max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{description}</p>
            {sideLabel && <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">{sideLabel}</p>}
            {children}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function Rule({ light = false }: { light?: boolean }) {
  return <div className={`h-px w-full ${light ? "bg-white/15" : "bg-[#d9d3c8]"}`} />
}
