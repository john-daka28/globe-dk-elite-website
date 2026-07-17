"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

const images = [
  '/african-students-learning-in-modern-classroom.jpg',
  '/african-male-student.jpg',
  '/african-female-student-smiling.jpg'
];

export default function HomePage() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 8000); // 8 seconds per image
    return () => clearInterval(interval);
  }, []);

  // Motion value for gentle vertical parallax
  const yOffset = useMotionValue(0);
  const yParallax = useTransform(yOffset, [0, 1], [-10, 10]); // subtle float effect

  useEffect(() => {
    // Animate the parallax back and forth continuously
    let direction = 1;
    const floatInterval = setInterval(() => {
      yOffset.set(direction);
      direction *= -1;
    }, 4000); // 4 seconds per half float
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
                style={{ backgroundImage: `url(${src})`, y: yParallax }}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            ) : null
          )}
        </AnimatePresence>

        {/* Hero Text */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Excel in O-Level & A-Level with Professional Tutoring
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
              Welcome to <strong>GlobeDk Elite Academy</strong> — founded by <strong>John Ariphios</strong>, a professional tutor
              with years of proven experience helping students in <strong>Mathematics, Computer Science, English, and
              Geography</strong> achieve their best results.
            </p>
            <p className="text-base text-primary-foreground/80">
              New weekend and online lessons are now open for enrollment in Epworth, Harare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" variant="secondary" className="text-base">
                <Link href="/enroll">
                  Enroll Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground"
              >
                <Link href="/contact">Contact Me</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
