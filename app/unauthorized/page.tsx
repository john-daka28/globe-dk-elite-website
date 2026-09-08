
"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShieldAlert,
  ShieldCheck,
  LockKeyhole,
  ArrowLeft,
  Home,
  GraduationCap,
  BookOpen,
  Users,
  ScanLine,
  Terminal,
  Radio,
  Sparkles,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

/* -------------------------------------------------------
   Types
------------------------------------------------------- */

type Role = "student" | "teacher" | "parent" | "admin" | "unknown"

type RoleConfig = {
  label: string
  portal: string
  href: string
  icon: typeof GraduationCap
  description: string
}

/* -------------------------------------------------------
   Role configuration
------------------------------------------------------- */

const roleConfig: Record<Role, RoleConfig> = {
  student: {
    label: "Student",
    portal: "Student Portal",
    href: "/student",
    icon: GraduationCap,
    description:
      "Your learning environment is ready. Continue your lessons, assignments and academic journey.",
  },

  teacher: {
    label: "Teacher",
    portal: "Teacher Portal",
    href: "/teacher",
    icon: BookOpen,
    description:
      "Your teaching environment is available. Continue managing lessons, students and academic activities.",
  },

  parent: {
    label: "Parent",
    portal: "Parent Portal",
    href: "/parent",
    icon: Users,
    description:
      "Your parent environment is available for monitoring academic progress and related activities.",
  },

  admin: {
    label: "Administrator",
    portal: "Admin Portal",
    href: "/admin",
    icon: ShieldCheck,
    description:
      "Your administration environment is available for managing the GlobeDk platform.",
  },

  unknown: {
    label: "Authenticated User",
    portal: "Academy Home",
    href: "/",
    icon: Home,
    description:
      "Return to the GlobeDk Academy homepage to continue exploring the platform.",
  },
}

/* -------------------------------------------------------
   Component
------------------------------------------------------- */

export default function UnauthorizedPage() {
  const [role, setRole] = useState<Role>("unknown")
  const [scanComplete, setScanComplete] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  /* -----------------------------------------------
     Read role from the session endpoint.

     IMPORTANT:
     This is only for displaying the UI.
     Middleware remains responsible for authorization.
  ------------------------------------------------ */

  useEffect(() => {
    let mounted = true

    async function loadRole() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        })

        if (!response.ok) {
          return
        }

        const data = await response.json()

        if (
          mounted &&
          ["student", "teacher", "parent", "admin"].includes(data?.role)
        ) {
          setRole(data.role)
        }
      } catch {
        // Keep unknown role if the endpoint is unavailable.
      }
    }

    loadRole()

    const timer = setTimeout(() => {
      setScanComplete(true)
    }, 1800)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [])

  const config = roleConfig[role]
  const RoleIcon = config.icon

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="pointer-events-none absolute inset-0">

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Ambient glow */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]"
        />

        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.08, 0.18, 0.08],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]"
        />

        {/* Scan line */}
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: "200%" }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
        />
      </div>

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="relative z-10 flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-10">

        <Link href="/" className="group flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
            <GraduationCap className="h-6 w-6 text-cyan-300" />
          </div>

          <div>
            <p className="font-semibold tracking-tight">
              GlobeDk Elite Academy
            </p>

            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
              Secure Learning Environment
            </p>
          </div>

        </Link>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-slate-400 sm:flex">
          <Radio className="h-3.5 w-3.5 text-emerald-400" />
          SYSTEM ONLINE
        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <section className="relative z-10 flex min-h-[calc(100vh-82px)] items-center justify-center px-5 py-12">

        <div className="w-full max-w-5xl">

          {/* Status */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <div className="flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/[0.06] px-4 py-2 text-xs font-medium text-red-300">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="h-1.5 w-1.5 rounded-full bg-red-400"
              />
              ACCESS CONTROL ALERT
            </div>
          </motion.div>

          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">

            {/* =================================================
                SECURITY VISUAL
            ================================================= */}

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative mx-auto w-full max-w-md"
            >

              <div className="relative aspect-square">

                {/* Outer rings */}

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-4 rounded-full border border-dashed border-cyan-400/20"
                />

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-14 rounded-full border border-dashed border-blue-400/20"
                />

                {/* Corner markers */}

                <div className="absolute left-8 top-8 h-8 w-8 border-l border-t border-cyan-400/60" />
                <div className="absolute right-8 top-8 h-8 w-8 border-r border-t border-cyan-400/60" />
                <div className="absolute bottom-8 left-8 h-8 w-8 border-b border-l border-cyan-400/60" />
                <div className="absolute bottom-8 right-8 h-8 w-8 border-b border-r border-cyan-400/60" />

                {/* Center */}

                <div className="absolute inset-0 flex items-center justify-center">

                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 0 rgba(34,211,238,0)",
                        "0 0 70px rgba(34,211,238,0.18)",
                        "0 0 0 rgba(34,211,238,0)",
                      ],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                    }}
                    className="relative flex h-44 w-44 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/[0.04] backdrop-blur-xl"
                  >

                    <div className="absolute inset-5 rounded-full border border-white/5" />

                    <AnimatePresence mode="wait">

                      {!scanComplete ? (
                        <motion.div
                          key="scanning"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center gap-3"
                        >
                          <ScanLine className="h-12 w-12 animate-pulse text-cyan-300" />

                          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-300">
                            Scanning
                          </span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="blocked"
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center gap-3"
                        >
                          <ShieldAlert className="h-12 w-12 text-red-400" />

                          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-red-300">
                            Restricted
                          </span>
                        </motion.div>
                      )}

                    </AnimatePresence>

                  </motion.div>

                </div>

                {/* Orbit dots */}

                {[0, 1, 2, 3].map((item) => (
                  <motion.div
                    key={item}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 8 + item * 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0"
                  >
                    <span
                      className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]"
                    />
                  </motion.div>
                ))}

              </div>

            </motion.div>

            {/* =================================================
                CONTENT
            ================================================= */}

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >

              <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
                <Terminal className="h-4 w-4" />
                SECURITY RESPONSE 403
              </div>

              <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
                Access
                <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  Restricted.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
                Your identity has been verified, but your account does not
                have the required permissions to enter this section of the
                GlobeDk Elite Academy.
              </p>

              {/* =================================================
                  SECURITY DETAILS
              ================================================= */}

              <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">

                <div className="grid grid-cols-2 divide-x divide-white/10">

                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      Current Access
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <RoleIcon className="h-4 w-4 text-cyan-300" />
                      <span className="font-medium">
                        {config.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      Status
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.7)]" />
                      <span className="font-medium text-red-300">
                        Permission Denied
                      </span>
                    </div>
                  </div>

                </div>

                {/* Recommended destination */}

                <div className="border-t border-white/10 p-5">

                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10">
                      <RoleIcon className="h-5 w-5 text-cyan-300" />
                    </div>

                    <div className="flex-1">

                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Recommended destination
                      </p>

                      <h2 className="mt-1 font-semibold">
                        {config.portal}
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {config.description}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                <Link
                  href={config.href}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-50"
                >
                  <RoleIcon className="h-5 w-5" />

                  Go to {config.portal}

                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 font-medium text-slate-300 transition hover:bg-white/[0.08]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </button>

              </div>

              {/* =================================================
                  DETAILS TOGGLE
              ================================================= */}

              <button
                onClick={() => setShowDetails((value) => !value)}
                className="mt-7 flex items-center gap-2 text-xs text-slate-600 transition hover:text-slate-400"
              >
                <LockKeyhole className="h-3.5 w-3.5" />

                {showDetails
                  ? "Hide security information"
                  : "View security information"}
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 rounded-xl border border-white/5 bg-black/20 p-4 font-mono text-[11px] leading-6 text-slate-600">

                      <p>
                        <span className="text-cyan-500">
                          [SYSTEM]
                        </span>{" "}
                        Authentication verified
                      </p>

                      <p>
                        <span className="text-cyan-500">
                          [SYSTEM]
                        </span>{" "}
                        Session validated
                      </p>

                      <p>
                        <span className="text-yellow-500">
                          [AUTH]
                        </span>{" "}
                        Role permission mismatch
                      </p>

                      <p>
                        <span className="text-red-500">
                          [ACCESS]
                        </span>{" "}
                        Request blocked
                      </p>

                      <p>
                        <span className="text-emerald-500">
                          [SYSTEM]
                        </span>{" "}
                        Safe redirect available
                      </p>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-xs text-slate-600 sm:flex-row"
          >

            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Excellence in Education. Success for Life.
            </div>

            <Link
              href="/"
              className="flex items-center gap-2 transition hover:text-slate-400"
            >
              <Home className="h-3.5 w-3.5" />
              GlobeDk Academy
            </Link>

          </motion.div>

        </div>

      </section>

    </main>
  )
}

