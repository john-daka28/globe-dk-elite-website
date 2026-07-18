"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Target,
  Eye,
  Award,
  Users,
  BookOpen,
  TrendingUp,
  Calculator,
  Globe,
  Laptop,
  FileText,
  Atom,
  Landmark,
  Briefcase,
  GraduationCap,
} from "lucide-react";

/**
 * Local source file path
 */
export const SOURCE_FILE = "/mnt/data/page.tsx";

const sectionVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const subjects = [
  {
    icon: Calculator,
    name: "Mathematics",
  },
  {
    icon: Calculator,
    name: "Pure Mathematics",
  },
  {
    icon: Calculator,
    name: "Statistics",
  },
  {
    icon: FileText,
    name: "English Language",
  },
  {
    icon: Atom,
    name: "Combined Science",
  },
  {
    icon: Atom,
    name: "Physics",
  },
  {
    icon: Atom,
    name: "Chemistry",
  },
  {
    icon: Atom,
    name: "Biology",
  },
  {
    icon: Laptop,
    name: "Computer Science",
  },
  {
    icon: Globe,
    name: "Geography",
  },
  {
    icon: Landmark,
    name: "History",
  },
  {
    icon: Landmark,
    name: "Heritage Studies",
  },
  {
    icon: Briefcase,
    name: "Commerce",
  },
  {
    icon: Briefcase,
    name: "Business Studies",
  },
  {
    icon: Briefcase,
    name: "Economics",
  },
  {
    icon: GraduationCap,
    name: "Principles of Accounts",
  },
];

export default function AboutPage() {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yParallax = useTransform(
    scrollYProgress,
    [0, 1],
    [30, -30]
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-20 md:py-28">
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{ mixBlendMode: "overlay" }}
          animate={{
            backgroundPosition: [
              "0% 50%",
              "100% 50%",
              "0% 50%",
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "linear",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-500 opacity-70" />
        </motion.div>

        <motion.div
          aria-hidden
          className="absolute -left-16 -top-10 w-56 h-56 rounded-full blur-3xl bg-sky-400 opacity-30"
          animate={{
            x: [-10, 30, -10],
            y: [0, 20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
          }}
        />

        <motion.div
          aria-hidden
          className="absolute right-8 -bottom-14 w-72 h-72 rounded-full blur-3xl bg-indigo-500 opacity-25"
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
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
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold">
              About GlobeDk Elite Academy
            </h1>

            <p className="text-lg md:text-xl leading-8 text-primary-foreground/90">
              GlobeDk Elite Academy is a Zimbabwean tutoring academy
              offering professional <strong>Online Lessons</strong>,
              <strong> Physical Lessons</strong>,
              <strong> Home Schooling</strong>,
              <strong> Live Virtual Classes</strong>,
              <strong> Weekend Lessons</strong> and
              <strong> One-on-One Tutoring</strong> for both
              <strong> ZIMSEC</strong> and
              <strong> Cambridge</strong> learners.
            </p>

            <p className="text-primary-foreground/80 leading-8">
              We provide high-quality learning in Sciences,
              Commercials, Arts and Technology subjects for
              O-Level and A-Level students throughout Zimbabwe
              and internationally, preparing learners for
              examinations, university and future careers.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Our Story */}
      <motion.section
        className="py-20 md:py-28"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Story */}
            <motion.div
              custom={0}
              variants={sectionVariant}
              className="space-y-6 order-1 lg:order-1"
            >
              <span className="text-primary font-semibold uppercase tracking-wider">
                Our Story
              </span>

              <h2 className="text-3xl md:text-5xl font-bold">
                Transforming Education Through Innovation & Excellence
              </h2>

              <p className="text-muted-foreground leading-8">
                GlobeDk Elite Academy was founded with one vision—to make
                quality education accessible to every learner regardless of
                location. We combine traditional classroom excellence with
                modern technology to deliver engaging online and physical
                lessons that produce outstanding academic results.
              </p>

              <p className="text-muted-foreground leading-8">
                We proudly prepare students for both <strong>ZIMSEC</strong> and
                <strong> Cambridge</strong> examinations while offering
                personalized tutoring, homeschooling, revision classes,
                homework assistance, holiday lessons and live virtual classes.
              </p>

              <p className="text-muted-foreground leading-8">
                Our academy now supports learners in Sciences, Commercials,
                Humanities and Technology subjects from O-Level through
                A-Level, helping students build confidence, critical thinking
                and lifelong learning skills.
              </p>
            </motion.div>

            {/* Animated Image Section */}
            <motion.div
              ref={ref}
              style={{ y: yParallax }}
              className="
                relative
                order-2
                lg:order-2
                w-full
                h-[320px]
                sm:h-[420px]
                lg:h-auto
                lg:aspect-square
                rounded-3xl
                overflow-hidden
                shadow-2xl
              "
            >
              {[
                "/african-students-learning-in-modern-classroom.jpg",
                "/african-female-student-smiling.jpg",
                "/african-female-student.jpg",
              ].map((src, index) => (
                <motion.img
                  key={index}
                  src={src}
                  alt={`GlobeDk Elite Student ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0.96, 1, 1, 0.96],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                    delay: index * 2.6,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Floating Achievement Badge */}
              <motion.div
                className="absolute top-5 left-5 bg-white rounded-xl shadow-xl p-4"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                }}
              >
                <Award className="h-8 w-8 text-yellow-500" />
              </motion.div>

              {/* Floating Students Badge */}
              <motion.div
                className="absolute bottom-5 right-5 bg-white rounded-xl shadow-xl p-4"
                animate={{
                  y: [0, 8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3.5,
                }}
              >
                <Users className="h-8 w-8 text-primary" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

{/* Subjects We Offer */}
<motion.section
  className="py-16 sm:py-20 md:py-28 bg-muted/30"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
>
  <div className="container mx-auto px-4">

    <motion.div
      custom={0}
      variants={sectionVariant}
      className="max-w-4xl mx-auto text-center mb-10 sm:mb-12 md:mb-14"
    >
      <span className="text-primary font-semibold uppercase tracking-wider text-xs sm:text-sm">
        What We Teach
      </span>

      <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-5xl font-bold">
        O-Level & A-Level Subjects We Offer
      </h2>

      <p className="mt-4 sm:mt-6 text-xs sm:text-sm md:text-base text-muted-foreground leading-6 sm:leading-7 md:leading-8">
        GlobeDk Elite Academy offers comprehensive tutoring for both
        <strong> ZIMSEC </strong>
        and
        <strong> Cambridge </strong>
        learners. Our experienced tutors deliver high-quality
        Online Lessons, Physical Lessons, Homeschooling,
        Live Virtual Classes, Holiday Lessons,
        Weekend Lessons, Revision Classes and
        One-on-One Tutoring across Science,
        Commercial, Arts and Technology subjects.
      </p>
    </motion.div>

    {/* THIS IS THE FIX - Add grid-cols-1 for mobile */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 auto-rows-max">
      {subjects.map((subject, index) => (
        <motion.div
          key={subject.name}
          custom={index}
          variants={sectionVariant}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
        >
          <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
            <CardContent className="flex flex-col items-center justify-center text-center p-3 sm:p-4 md:p-5 lg:py-8 lg:px-5 h-full min-h-[220px] sm:min-h-[240px] md:min-h-[260px]">

              <div className="h-12 sm:h-14 md:h-16 w-12 sm:w-14 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2 sm:mb-3 md:mb-4 lg:mb-5 flex-shrink-0">
                <subject.icon className="h-6 sm:h-7 md:h-8 w-6 sm:w-7 md:w-8 text-primary" />
              </div>

              <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 line-clamp-2">
                {subject.name}
              </h3>

              <p className="text-xs sm:text-sm md:text-sm text-muted-foreground leading-5 sm:leading-6 line-clamp-3">
                Available for selected O-Level and/or A-Level
                programmes through both online and physical
                learning options.
              </p>

            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>

  </div>
</motion.section>
      {/* Mission & Vision */}
      <motion.section
        className="py-20 md:py-28"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Mission */}
            <motion.div
              custom={0}
              variants={sectionVariant}
            >
              <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6 sm:p-8">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Target className="h-8 w-8 text-primary" />
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-5">
                    Our Mission
                  </h2>

                  <p className="text-sm sm:text-base text-muted-foreground leading-7 sm:leading-8">
                    Our mission is to provide affordable, accessible and
                    high-quality education through Online Lessons,
                    Physical Lessons, Live Virtual Classes,
                    Homeschooling, One-on-One Tutoring,
                    Holiday Lessons and Weekend Lessons.
                  </p>

                  <p className="mt-4 sm:mt-5 text-sm sm:text-base text-muted-foreground leading-7 sm:leading-8">
                    We are committed to helping every learner master
                    O-Level and A-Level subjects, improve confidence,
                    develop problem-solving skills and achieve excellent
                    results in both ZIMSEC and Cambridge examinations.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Vision */}
            <motion.div
              custom={1}
              variants={sectionVariant}
            >
              <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6 sm:p-8">
                  <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
                    <Eye className="h-8 w-8 text-secondary" />
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-5">
                    Our Vision
                  </h2>

                  <p className="text-sm sm:text-base text-muted-foreground leading-7 sm:leading-8">
                    To become Zimbabwe's leading digital learning academy,
                    recognised for academic excellence, innovation,
                    professionalism and outstanding student success in
                    Sciences, Commercials, Arts and Technology education.
                  </p>

                  <p className="mt-4 sm:mt-5 text-sm sm:text-base text-muted-foreground leading-7 sm:leading-8">
                    We envision empowering learners across Zimbabwe and
                    internationally with modern education that prepares
                    them for university, employment, entrepreneurship
                    and lifelong learning.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Why Choose GlobeDk Elite Academy */}
      <motion.section
        className="py-20 md:py-28 bg-muted/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            custom={0}
            variants={sectionVariant}
            className="max-w-4xl mx-auto text-center mb-12 md:mb-14"
          >
            <span className="text-primary font-semibold uppercase tracking-wider">
              Why Choose Us
            </span>

            <h2 className="mt-3 text-3xl md:text-5xl font-bold">
              Why Students & Parents Choose GlobeDk Elite Academy
            </h2>

            <p className="mt-6 text-sm md:text-base text-muted-foreground leading-7 md:leading-8">
              GlobeDk Elite Academy combines experienced tutoring,
              modern teaching methods and flexible learning options
              to help every learner achieve academic excellence.
              Whether you need Online Lessons, Physical Lessons,
              Homeschooling, Live Virtual Classes or personalised
              One-on-One Tutoring, our academy is committed to
              delivering quality education for ZIMSEC and Cambridge
              learners.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Users,
                title: "Experienced Tutors",
                description:
                  "Dedicated tutors providing professional guidance, mentorship and personalised academic support.",
              },
              {
                icon: BookOpen,
                title: "Complete Subject Coverage",
                description:
                  "Comprehensive O-Level and A-Level learning across Sciences, Commercials, Arts and Technology subjects.",
              },
              {
                icon: TrendingUp,
                title: "Excellent Results",
                description:
                  "Focused exam preparation, revision classes and proven strategies that help students improve performance.",
              },
              {
                icon: Globe,
                title: "Learn Anywhere",
                description:
                  "Attend Online Lessons from anywhere in Zimbabwe or internationally using live virtual classrooms.",
              },
              {
                icon: Laptop,
                title: "Modern Learning",
                description:
                  "Interactive digital resources, practical demonstrations and engaging teaching techniques.",
              },
              {
                icon: Award,
                title: "Quality Education",
                description:
                  "Professional, affordable and student-centred education designed to prepare learners for academic success.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                custom={index}
                variants={sectionVariant}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6 md:p-8 text-center">
                    <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>

                    <h3 className="text-lg md:text-xl font-bold mb-4">
                      {feature.title}
                    </h3>

                    <p className="text-sm md:text-base text-muted-foreground leading-6 md:leading-7">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Leadership */}
      <motion.section
        className="py-20 md:py-28"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            custom={0}
            variants={sectionVariant}
            className="max-w-5xl mx-auto text-center mb-12 md:mb-14"
          >
            <span className="text-primary font-semibold uppercase tracking-wider">
              Leadership
            </span>

            <h2 className="mt-3 text-3xl md:text-5xl font-bold">
              Meet Our CEO, Founder & Principal
            </h2>

            <p className="mt-6 text-sm md:text-base text-muted-foreground leading-7 md:leading-8">
              GlobeDk Elite Academy is proudly led by
              <strong> Dr John Ariphios Daka</strong>, an accomplished
              educator, visionary leader and passionate advocate for quality
              education. His dedication to academic excellence continues to
              inspire students, parents and educators across Zimbabwe and
              beyond.
            </p>
          </motion.div>

          <motion.div
            custom={1}
            variants={sectionVariant}
          >
            <Card className="border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-6 sm:p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 items-center">
                  {/* Avatar */}
                  <div className="flex justify-center">
                    <Avatar className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 border-4 border-primary shadow-xl">
                      <AvatarImage
                        src="/john-ariphios.jpg.JPG"
                        alt="Dr John Ariphios Daka"
                        className="object-cover"
                      />
                    </Avatar>
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-2 space-y-4 md:space-y-6">
                    <h3 className="text-2xl sm:text-3xl font-bold">
                      Dr John Ariphios Daka
                    </h3>

                    <p className="text-base md:text-lg font-semibold text-primary">
                      CEO • Founder • Principal
                    </p>

                    <p className="text-sm md:text-base text-muted-foreground leading-6 md:leading-8">
                      Dr John Ariphios Daka founded GlobeDk Elite Academy with
                      the vision of transforming education through innovation,
                      professionalism and academic excellence. His commitment
                      to making high-quality education accessible has enabled
                      learners from Zimbabwe and beyond to excel in both
                      ZIMSEC and Cambridge examinations.
                    </p>

                    <p className="text-sm md:text-base text-muted-foreground leading-6 md:leading-8">
                      Under his leadership, GlobeDk Elite Academy has grown
                      into a trusted institution offering Online Lessons,
                      Physical Lessons, Live Virtual Classes, Home Schooling,
                      Weekend Lessons and personalised One-on-One Tutoring
                      across Sciences, Commercials, Arts and Technology
                      subjects for both O-Level and A-Level learners.
                    </p>

                    <p className="text-sm md:text-base text-muted-foreground leading-6 md:leading-8">
                      His passion for education, integrity, innovation and
                      student success continues to shape the academy's mission
                      of empowering learners with knowledge, confidence and
                      skills that prepare them for university, careers and
                      lifelong achievement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Call To Action */}
      <motion.section
        className="py-20 md:py-28 bg-primary text-primary-foreground"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            custom={0}
            variants={sectionVariant}
            className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to Begin Your Learning Journey?
            </h2>

            <p className="text-base md:text-lg leading-7 md:leading-8 text-primary-foreground/90">
              Join GlobeDk Elite Academy today and experience quality
              education through Online Lessons, Physical Lessons,
              Homeschooling, Live Virtual Classes and personalised
              tutoring designed to help you achieve academic excellence.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
                }
