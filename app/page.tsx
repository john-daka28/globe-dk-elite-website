"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Clock,
  Video,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

    {/* Hero Section */}
<section className="relative bg-primary text-primary-foreground py-20 md:py-32 overflow-hidden">
  {/* Background Layer 1 */}
  <motion.div
    className="absolute inset-0 bg-[url('/african-students-learning-in-modern-classroom.jpg')] bg-cover bg-center opacity-20"
    animate={{ scale: [1, 1.08, 1], y: [0, -25, 0] }}
    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
  />

  {/* Background Layer 2: floating abstract overlay */}
  <motion.div
    className="absolute inset-0 bg-[url('/abstract-light-pattern.png')] bg-repeat opacity-10"
    animate={{ x: [0, 50, 0], y: [0, 20, 0], rotate: [0, 5, 0] }}
    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
  />

  {/* Background Layer 3: subtle gradient shimmer */}
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-30"
    animate={{ x: [-50, 50, -50] }}
    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
  />

  <div className="container mx-auto px-4 relative z-10">
    <motion.div
      className="max-w-3xl mx-auto text-center space-y-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
        Excel in O-Level & A-Level with Professional Tutoring
      </h1>
      <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
        Welcome to <strong>GlobeDk Elite</strong> — founded by <strong>John Ariphios</strong>, a professional tutor
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
    </motion.div>
  </div>
</section>


      {/* Quick Stats */}
      <motion.section
        className="py-12 bg-muted/30 border-b border-border"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: "Students Taught", value: "25+" },
              { icon: Award, label: "Pass Rate", value: "95%" },
              { icon: BookOpen, label: "Subjects Covered", value: "7" },
              { icon: GraduationCap, label: "Experience", value: "2+ Years" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center space-y-2"
                variants={fadeInUp}
              >
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Other sections remain same with fadeInUp / staggered motion */}

      <Footer />
    </div>
  );
}
