"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

const images = [
  "/african-students-learning-in-modern-classroom.jpg",
  "/african-male-student.jpg",
  "/african-female-student-smiling.jpg",
];

export default function HomePage() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Motion value for gentle vertical parallax
  const yOffset = useMotionValue(0);
  const yParallax = useTransform(yOffset, [0, 1], [-10, 10]);

  useEffect(() => {
    let direction = 1;

    const floatInterval = setInterval(() => {
      yOffset.set(direction);
      direction *= -1;
    }, 4000);

    return () => clearInterval(floatInterval);
  }, [yOffset]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-20 md:py-32 overflow-hidden">

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
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              />
            ) : null
          )}
        </AnimatePresence>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Hero Text */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance leading-tight">
              Professional Online O-Level & A-Level Lessons for ZIMSEC & Cambridge Students
            </h1>

            <p className="text-xl md:text-2xl font-semibold text-primary-foreground">
              Excellence in Education. Success for Life.
            </p>

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

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">

              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-base"
              >
                <Link href="/enroll">
                  Enroll Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground"
              >
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>

            </div>

          </div>
        </div>

      </section>

      <Footer />
    </div>
  );
}
