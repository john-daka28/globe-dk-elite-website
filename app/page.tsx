"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Sparkles, GraduationCap, BookOpen, Award } from "lucide-react"
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion"
import { useState, useEffect } from "react"

const handleEnrollClick = () => {
  const message =
    "Hello GlobeDk Elite Academy. I am interested in your online tutoring services and would like to know more about the available lessons, subjects, fees and class schedules. I would also like to know how I can enrol. Thank you."

  const whatsappUrl = `https://wa.me/263786053315?text=${encodeURIComponent(message)}`

  window.open(whatsappUrl, "_blank")
}

const images = [
  "/african-students-learning-in-modern-classroom.jpg",
  "/african-male-student.jpg",
  "/african-female-student-smiling.jpg",
]

export default function HomePage() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  // Motion value for gentle vertical parallax
  const yOffset = useMotionValue(0)
  const yParallax = useTransform(yOffset, [0, 1], [-10, 10])

  useEffect(() => {
    let direction = 1

    const floatInterval = setInterval(() => {
      yOffset.set(direction)
      direction *= -1
    }, 4000)

    return () => clearInterval(floatInterval)
  }, [yOffset])

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* ========================================================= */}
      {/* HERO / LANDING SECTION */}
      {/* ========================================================= */}

      <section className="relative bg-primary text-primary-foreground py-16 sm:py-20 md:py-32 overflow-hidden">

        {/* ===================================================== */}
        {/* BACKGROUND IMAGE SLIDESHOW */}
        {/* ===================================================== */}

        <AnimatePresence mode="wait">
          {images.map((src, index) =>
            index === current ? (
              <motion.div
                key={src}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${src})`,
                  y: yParallax,
                }}
                initial={{
                  opacity: 0,
                  scale: 1.08,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 1.05,
                }}
                transition={{
                  duration: 1.8,
                  ease: "easeInOut",
                }}
              />
            ) : null
          )}
        </AnimatePresence>

        {/* ===================================================== */}
        {/* DARK OVERLAY */}
        {/* ===================================================== */}

        <div className="absolute inset-0 bg-black/65" />

        {/* ===================================================== */}
        {/* GRADIENT OVERLAY */}
        {/* ===================================================== */}

        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-black/50" />

        {/* ===================================================== */}
        {/* ANIMATED BACKGROUND GLOW - TOP LEFT */}
        {/* ===================================================== */}

        <motion.div
          className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* ===================================================== */}
        {/* ANIMATED BACKGROUND GLOW - BOTTOM RIGHT */}
        {/* ===================================================== */}

        <motion.div
          className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-primary-foreground/10 blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.25, 0.15, 0.25],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* ===================================================== */}
        {/* HERO CONTENT */}
        {/* ===================================================== */}

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">

            {/* ================================================= */}
            {/* WELCOME BADGE */}
            {/* ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              className="flex justify-center mb-6"
            >
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-primary-foreground/20
                  bg-primary-foreground/10
                  px-4
                  py-2
                  text-xs
                  sm:text-sm
                  font-semibold
                  backdrop-blur-md
                  shadow-lg
                "
              >
                <Sparkles className="h-4 w-4 animate-pulse" />

                <span>
                  WELCOME TO GLOBEDK ELITE ACADEMY
                </span>
              </div>
            </motion.div>

            {/* ================================================= */}
            {/* MAIN HEADING */}
            {/* ================================================= */}

            <motion.h1
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.15,
              }}
              className="
                text-4xl
                sm:text-5xl
                md:text-6xl
                font-bold
                tracking-tight
                text-balance
                leading-tight
              "
            >
              Professional Online O-Level & A-Level Lessons for ZIMSEC & Cambridge Students
            </motion.h1>

            {/* ================================================= */}
            {/* MOTTO */}
            {/* ================================================= */}

            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.3,
              }}
              className="
                mt-6
                text-xl
                md:text-2xl
                font-semibold
                text-primary-foreground
              "
            >
              Excellence in Education. Success for Life.
            </motion.p>

            {/* ================================================= */}
            {/* DESCRIPTION */}
            {/* ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.45,
              }}
              className="mt-6 space-y-5"
            >
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
                Welcome to <strong>GlobeDk Elite Academy</strong>, a trusted education centre
                based in Harare, Zimbabwe, providing professional
                <strong> online lessons, homeschooling, one-on-one tutoring,
                exam preparation, revision classes and academic support</strong>
                for students studying the <strong>ZIMSEC</strong> and
                <strong> Cambridge</strong> curricula.
              </p>

              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
                We offer expert tutoring for <strong>O-Level</strong> and
                <strong> A-Level</strong> students in
                <strong> Mathematics, English Language, Combined Science,
                Physics, Chemistry, Biology, Geography, History,
                Heritage Studies, Commerce, Principles of Accounts,
                Business Studies, Economics, Computer Science,
                Statistics</strong> and many other subjects.
              </p>

              <p className="text-base md:text-lg text-primary-foreground/85 leading-relaxed">
                Whether you need live online classes, flexible homeschooling,
                weekend lessons, holiday revision classes or personalized
                tutoring, GlobeDk Elite Academy is committed to helping every
                learner build confidence, improve academic performance and
                achieve outstanding examination results from anywhere in
                Zimbabwe and beyond.
              </p>
            </motion.div>

            {/* ================================================= */}
            {/* FEATURE HIGHLIGHTS */}
            {/* ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.6,
              }}
              className="
                mt-8
                grid
                grid-cols-1
                sm:grid-cols-3
                gap-3
                max-w-3xl
                mx-auto
              "
            >

              {/* Online Lessons */}
              <motion.div
                whileHover={{
                  y: -5,
                  scale: 1.02,
                }}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-primary-foreground/15
                  bg-primary-foreground/10
                  px-4
                  py-3
                  backdrop-blur-md
                "
              >
                <GraduationCap className="h-5 w-5 shrink-0" />

                <span className="text-sm font-medium">
                  Expert Tutoring
                </span>
              </motion.div>

              {/* Flexible Learning */}
              <motion.div
                whileHover={{
                  y: -5,
                  scale: 1.02,
                }}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-primary-foreground/15
                  bg-primary-foreground/10
                  px-4
                  py-3
                  backdrop-blur-md
                "
              >
                <BookOpen className="h-5 w-5 shrink-0" />

                <span className="text-sm font-medium">
                  Flexible Learning
                </span>
              </motion.div>

              {/* Exam Success */}
              <motion.div
                whileHover={{
                  y: -5,
                  scale: 1.02,
                }}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-primary-foreground/15
                  bg-primary-foreground/10
                  px-4
                  py-3
                  backdrop-blur-md
                "
              >
                <Award className="h-5 w-5 shrink-0" />

                <span className="text-sm font-medium">
                  Exam Preparation
                </span>
              </motion.div>

            </motion.div>

            {/* ================================================= */}
            {/* CTA BUTTONS */}
            {/* ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.75,
              }}
              className="
                flex
                flex-col
                sm:flex-row
                gap-4
                justify-center
                pt-8
              "
            >

              {/* ================================================= */}
              {/* ENROLL NOW */}
              {/* ================================================= */}

              <motion.div
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.97,
                }}
              >
                <Button
                  onClick={handleEnrollClick}
                  size="lg"
                  variant="secondary"
                  className="
                    cursor-pointer
                    text-base
                    w-full
                    sm:w-auto
                    min-w-[170px]
                    shadow-xl
                  "
                >
                  Enroll Now

                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>

              {/* ================================================= */}
              {/* CONTACT US */}
              {/* ================================================= */}

              <motion.div
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.97,
                }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="
                    text-base
                    w-full
                    sm:w-auto
                    min-w-[170px]
                    bg-primary-foreground/10
                    border-primary-foreground/20
                    hover:bg-primary-foreground/20
                    text-primary-foreground
                    backdrop-blur-sm
                  "
                >
                  <Link href="/contact">
                    Contact Us
                  </Link>
                </Button>
              </motion.div>

            </motion.div>

            {/* ================================================= */}
            {/* SLIDESHOW INDICATORS */}
            {/* ================================================= */}

            <div className="mt-10 flex justify-center items-center gap-2">

              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-label={`Show image ${index + 1}`}
                  className="group p-1"
                >
                  <motion.span
                    animate={{
                      width: current === index ? 28 : 8,
                      opacity: current === index ? 1 : 0.5,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                    className="
                      block
                      h-2
                      rounded-full
                      bg-primary-foreground
                    "
                  />
                </button>
              ))}

            </div>

          </div>
        </div>

        {/* ===================================================== */}
        {/* FLOATING DECORATIVE ELEMENT */}
        {/* ===================================================== */}

        <motion.div
          className="
            absolute
            right-6
            top-1/3
            hidden
            lg:flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            border
            border-primary-foreground/20
            bg-primary-foreground/10
            backdrop-blur-md
          "
          animate={{
            y: [0, -12, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <GraduationCap className="h-6 w-6" />
        </motion.div>

        <motion.div
          className="
            absolute
            left-6
            bottom-1/4
            hidden
            lg:flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            border
            border-primary-foreground/20
            bg-primary-foreground/10
            backdrop-blur-md
          "
          animate={{
            y: [0, 12, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <BookOpen className="h-6 w-6" />
        </motion.div>

      </section>

      <Footer />
    </div>
  )
}