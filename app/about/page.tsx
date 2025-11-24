"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Target, Eye, Award, Users, BookOpen, TrendingUp } from "lucide-react";

/**
 * Local source file path (for toolchain / uploads)
 */
export const SOURCE_FILE = "/mnt/data/page.tsx";

const sectionVariant: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, ease: [0.22, 1, 0.36, 1], duration: 0.6 },
  }),
};

export default function AboutPage() {
  // Parallax for the carousel
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-16 md:py-24">
        {/* animated gradient overlay */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{ mixBlendMode: "overlay" }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-500 opacity-70" />
        </motion.div>

        {/* soft floating shapes */}
        <motion.div
          aria-hidden
          className="absolute -left-16 -top-10 w-56 h-56 rounded-full blur-3xl mix-blend-multiply opacity-30 bg-sky-400"
          animate={{ x: [-10, 30, -10], y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute right-8 -bottom-14 w-72 h-72 rounded-full blur-3xl mix-blend-multiply opacity-25 bg-indigo-500"
          animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-balance">
              About GlobeDk Elite
            </h1>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Founded and led by <strong>John Ariphios</strong> — dedicated to empowering students in Harare and beyond
              through quality education, mentorship, and modern learning support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <motion.section
        className="py-16 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">

              {/* Text Section */}
              <motion.div custom={0} variants={sectionVariant} className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">My Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Hi, I’m <strong>John Ariphios</strong> — the founder and lead tutor of GlobeDk Elite. 
                    Based in Epworth, Harare, I started this tutoring platform out of a deep passion 
                    for helping students unlock their full potential in academics.
                  </p>
                  <p>
                    I specialize in <strong>Mathematics</strong> and <strong>Computer Science</strong> 
                    for both O-Level and A-Level, combining years of teaching experience 
                    with modern tools and methods to make learning engaging and effective.
                  </p>
                  <p>
                    Over the years, I’ve helped hundreds of students achieve outstanding results — 
                    many earning distinctions and developing a stronger love for learning.
                  </p>
                </div>
              </motion.div>

              {/* Animated Image Carousel Section */}
              <motion.div
                ref={ref}
                style={{ y: yParallax }}
                className="relative aspect-square rounded-xl overflow-hidden shadow-2xl"
              >
                {[
                  '/african-students-learning-in-modern-classroom.jpg',
                  '/african-female-student-smiling.jpg',
                  '/african-female-student.jpg'
                ].map((src, index) => (
                  <motion.img
                    key={index}
                    src={src}
                    // alt={`Students learning ${index + 1}`}
                    className="absolute w-full h-full object-cover rounded-xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: [0, 1, 1, 0], scale: [0.95, 1, 1, 0.95] }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      repeatDelay: 0.5,
                      ease: 'easeInOut',
                      delay: index * 2.5
                    }}
                  />
                ))}

                {/* Floating Badge Top-Left */}
                <motion.div
                  className="absolute -top-6 -left-6 bg-white rounded-full p-3 shadow-md"
                  animate={{ rotate: [0, 10, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                >
                  <Users className="h-5 w-5 text-primary" />
                </motion.div>

                {/* Floating Badge Bottom-Right */}
                <motion.div
                  className="absolute -bottom-6 -right-6 bg-white rounded-full p-3 shadow-md"
                  animate={{ rotate: [0, -10, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                >
                  <Award className="h-5 w-5 text-yellow-500" />
                </motion.div>

                {/* Orbiting Floating Icons */}
                {['TrendingUp', 'BookOpen', 'Target'].map((iconName, i) => (
                  <motion.div
                    key={i}
                    className="absolute bg-white rounded-full p-2 shadow-md"
                    style={{ top: '50%', left: '50%', x: 0, y: 0 }}
                    animate={{ rotate: 360, translateX: 80 + i * 20, translateY: 0 }}
                    transition={{ repeat: Infinity, duration: 10 + i * 2, ease: 'linear' }}
                  >
                    {iconName === 'TrendingUp' && <TrendingUp className="h-4 w-4 text-green-500" />}
                    {iconName === 'BookOpen' && <BookOpen className="h-4 w-4 text-blue-500" />}
                    {iconName === 'Target' && <Target className="h-4 w-4 text-red-500" />}
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </div>
        </div>
      </motion.section>

      {/* Mission & Vision */}
      <motion.section
        className="py-16 md:py-24 bg-muted/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div custom={0} variants={sectionVariant}>
              <Card className="border-border hover:shadow-lg transition">
                <CardContent className="pt-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">My Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To provide accessible, personalized, and high-quality tutoring that empowers students to excel in
                    their O-Level and A-Level exams — and develop skills for lifelong success.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div custom={1} variants={sectionVariant}>
              <Card className="border-border hover:shadow-lg transition">
                <CardContent className="pt-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold">My Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To build one of Zimbabwe’s most trusted and innovative tutoring platforms that blends technology,
                    passion, and mentorship — shaping confident, future-ready students.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Core Values */}
      <motion.section
        className="py-16 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <motion.h2 custom={0} variants={sectionVariant} className="text-3xl md:text-4xl font-bold mb-4">
              My Core Values
            </motion.h2>
            <motion.p custom={1} variants={sectionVariant} className="text-muted-foreground leading-relaxed">
              These principles guide every lesson and every student interaction at GlobeDk Elite.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Award, title: "Excellence", description: "I aim for the highest standards in teaching and results." },
              { icon: Users, title: "Student-Centered", description: "Every lesson is tailored around your success and understanding." },
              { icon: BookOpen, title: "Continuous Learning", description: "Learning never stops — for both students and teachers." },
              { icon: TrendingUp, title: "Growth Mindset", description: "I believe every student can improve with effort and support." },
              { icon: Target, title: "Integrity", description: "Honesty, professionalism, and dedication in every class." },
              { icon: Users, title: "Community", description: "Building a supportive environment for students to thrive." },
            ].map((value, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={sectionVariant}
                className="text-center"
                whileHover={{ y: -6, boxShadow: "0 10px 30px rgba(2,6,23,0.08)" }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Card className="border-border text-center">
                  <CardContent className="pt-6 space-y-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Tutor Section */}
      <motion.section
        className="py-16 md:py-24 bg-muted/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <motion.h2 custom={0} variants={sectionVariant} className="text-3xl md:text-4xl font-bold mb-6">
            Meet Your Tutor
          </motion.h2>

          <motion.div custom={1} variants={sectionVariant}>
            <Card className="border-border">
              <CardContent className="pt-8 space-y-4">
                <Avatar className="h-35 w-35 mx-auto">
                  <AvatarImage src="/john-ariphios.jpg.JPG" alt="John Ariphios Daka" />
                </Avatar>

                <div>
                  <h3 className="font-bold text-xl">John Ariphios</h3>
                  <p className="text-primary font-medium">Founder & Senior Tutor</p>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>Subjects:</strong> Mathematics & Computer Science (O-Level & A-Level)</p>
                  <p>BSc Mathematics • 2+ Years of Experience</p>
                  <p>Based in Epworth, Harare • Offering Physical & Online Lessons</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
