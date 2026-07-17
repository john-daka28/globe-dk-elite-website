"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Calculator,
  Globe,
  Laptop,
  FileText,
  CheckCircle2,
  Clock,
  DollarSign,
  User,
} from "lucide-react";
import { motion } from "framer-motion";

export default function SubjectsPage() {
  const oLevelSubjects = [
    {
      name: "Mathematics",
      icon: Calculator,
      description:
        "Build confidence in algebra, geometry, trigonometry, statistics and problem solving through expert instruction for both ZIMSEC and Cambridge O-Level learners.",
      topics: [
        "Algebra",
        "Geometry",
        "Trigonometry",
        "Statistics",
        "Number Systems",
      ],
      fee: "Physical: US$15/month | Online: US$20-25/month",
    },
    {
      name: "English Language",
      icon: FileText,
      description:
        "Develop excellent communication, grammar, comprehension and composition skills while preparing for examinations with confidence.",
      topics: [
        "Grammar",
        "Composition",
        "Comprehension",
        "Summary Writing",
        "Oral Skills",
      ],
      fee: "Physical: US$15/month | Online: US$20-25/month",
    },
    {
      name: "Combined Science",
      icon: Calculator,
      description:
        "Gain a solid foundation in Biology, Chemistry and Physics through practical explanations and exam-focused learning.",
      topics: [
        "Scientific Investigation",
        "Biology",
        "Chemistry",
        "Physics",
        "Laboratory Skills",
      ],
      fee: "Physical: US$15/month | Online: US$20-25/month",
    },
    {
      name: "Physics",
      icon: Calculator,
      description:
        "Understand the laws governing matter, energy and motion while mastering calculations required for examinations.",
      topics: [
        "Mechanics",
        "Electricity",
        "Waves",
        "Thermal Physics",
        "Modern Physics",
      ],
      fee: "Physical: US$15/month | Online: US$20-25/month",
    },
    {
      name: "Chemistry",
      icon: Calculator,
      description:
        "Master chemical reactions, calculations and practical concepts through simplified, results-driven teaching.",
      topics: [
        "Organic Chemistry",
        "Inorganic Chemistry",
        "Chemical Calculations",
        "Acids & Bases",
        "Practical Chemistry",
      ],
      fee: "Physical: US$15/month | Online: US$20-25/month",
    },
    {
      name: "Biology",
      icon: Calculator,
      description:
        "Explore living organisms, genetics and ecology while preparing thoroughly for practical and theory examinations.",
      topics: [
        "Cell Biology",
        "Genetics",
        "Ecology",
        "Human Biology",
        "Classification",
      ],
      fee: "Physical: US$15/month | Online: US$20-25/month",
    },
    {
      name: "Computer Science",
      icon: Laptop,
      description:
        "Develop programming, problem-solving and computing skills essential for today's technology-driven world.",
      topics: [
        "Programming",
        "Algorithms",
        "Databases",
        "Networking",
        "Computer Systems",
      ],
      fee: "Physical: US$15/month | Online: US$20-25/month",
    },
    {
      name: "Geography",
      icon: Globe,
      description:
        "Study physical and human environments while strengthening map interpretation and geographical analysis.",
      topics: [
        "Map Reading",
        "Climate",
        "Population",
        "Natural Resources",
        "Development",
      ],
      fee: "Physical: US$15/month | Online: US$20-25/month",
    },
    {
      name: "History",
      icon: Globe,
      description:
        "Understand world and African history through analytical study of historical events, sources and interpretations.",
      topics: [
        "African History",
        "World History",
        "Source Analysis",
        "Colonial History",
        "International Relations",
      ],
      fee: "Physical: US$15/month | Online: US$20-25/month",
    },
    {
      name: "Heritage Studies",
      icon: Globe,
      description:
        "Explore Zimbabwean heritage, culture, governance and national identity using an examination-focused approach.",
      topics: [
        "Culture",
        "Citizenship",
        "Governance",
        "Traditions",
        "National Heritage",
      ],
      fee: "Physical: US$15/month | Online: US$20-25/month",
    },
    {
      name: "Commerce",
      icon: FileText,
      description:
        "Develop entrepreneurial and business knowledge while understanding trade, marketing and finance.",
      topics: [
        "Business Organisations",
        "Marketing",
        "Insurance",
        "International Trade",
        "Consumer Education",
      ],
      fee: "Physical: US$15/month | Online: US$20-25/month",
    },
    {
      name: "Principles of Accounts",
      icon: FileText,
      description:
        "Master bookkeeping, financial statements and accounting principles required for academic and business success.",
      topics: [
        "Double Entry",
        "Ledger Accounts",
        "Trial Balance",
        "Financial Statements",
        "Cash Books",
      ],
      fee: "Physical: US$15/month | Online: US$20-25/month",
    },
  ];

  const aLevelSubjects = [
    {
      name: "Pure Mathematics",
      icon: Calculator,
      description:
        "Advanced mathematics designed to prepare learners for university studies in engineering, science and technology.",
      topics: [
        "Calculus",
        "Vectors",
        "Complex Numbers",
        "Differential Equations",
        "Proof",
      ],
      fee: "Physical: US$20/month | Online: US$25-30/month",
    },
    {
      name: "Statistics",
      icon: Calculator,
      description:
        "Learn statistical analysis, probability and data interpretation for higher education and professional careers.",
      topics: [
        "Probability",
        "Regression",
        "Sampling",
        "Distributions",
        "Hypothesis Testing",
      ],
      fee: "Physical: US$20/month | Online: US$25-30/month",
    },
    {
      name: "Computer Science",
      icon: Laptop,
      description:
        "Study advanced programming, algorithms, software development and computing theory through practical projects.",
      topics: [
        "Programming",
        "Software Engineering",
        "Algorithms",
        "Databases",
        "Networks",
      ],
      fee: "Physical: US$20/month | Online: US$25-30/month",
    },
    {
      name: "Geography",
      icon: Globe,
      description:
        "Analyse environmental systems, development issues and geographical research using advanced fieldwork techniques.",
      topics: [
        "Research Methods",
        "Fieldwork",
        "Physical Geography",
        "Human Geography",
        "Global Issues",
      ],
      fee: "Physical: US$20/month | Online: US$25-30/month",
    },
        {
      name: "Business Studies",
      icon: FileText,
      description:
        "Develop practical business management, entrepreneurship and organisational skills for examinations and future careers.",
      topics: [
        "Business Management",
        "Marketing",
        "Human Resources",
        "Entrepreneurship",
        "Business Finance",
      ],
      fee: "Physical: US$20/month | Online: US$25-30/month",
    },
    {
      name: "Economics",
      icon: FileText,
      description:
        "Understand microeconomics, macroeconomics and economic development using real-world case studies and examination techniques.",
      topics: [
        "Microeconomics",
        "Macroeconomics",
        "International Trade",
        "Economic Development",
        "Market Structures",
      ],
      fee: "Physical: US$20/month | Online: US$25-30/month",
    },
  ];

  const services = [
    "Online Lessons",
    "Physical Lessons",
    "Homeschooling",
    "One-on-One Tutoring",
    "Live Virtual Classes",
    "Exam Preparation",
    "Revision Classes",
    "Homework Assistance",
    "Holiday Lessons",
    "Weekend Lessons",
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      scale: 1.03,
      boxShadow: "0px 15px 30px rgba(0,0,0,0.15)",
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 md:py-28">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge className="mb-5 bg-white/20 text-white border-white/20">
              GlobeDk Elite Academy
            </Badge>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Professional O-Level &amp; A-Level Lessons for ZIMSEC &amp;
              Cambridge Students
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-4xl mx-auto leading-8">
              GlobeDk Elite Academy offers professional Online Lessons,
              Physical Lessons, Homeschooling Zimbabwe programmes and Live
              Virtual Classes for students across Zimbabwe and internationally.
              We teach Arts, Commercials, Sciences and Technology subjects while
              providing expert homework assistance, revision classes, exam
              preparation and one-on-one tutoring for ZIMSEC and Cambridge
              learners.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Badge variant="secondary">Online Lessons Zimbabwe</Badge>
              <Badge variant="secondary">Physical Lessons</Badge>
              <Badge variant="secondary">Homeschooling Zimbabwe</Badge>
              <Badge variant="secondary">Live Virtual Classes</Badge>
              <Badge variant="secondary">Weekend Lessons</Badge>
              <Badge variant="secondary">Exam Preparation</Badge>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/contact">Enroll Today</Link>
              </Button>

              <Button variant="secondary" size="lg" asChild>
                <Link href="#pricing">View Fees</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge className="mb-4">Our Services</Badge>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete Learning Support for Every Student
            </h2>

            <p className="text-muted-foreground leading-8">
              Whether you are looking for an Online Tutor Zimbabwe, a private
              Mathematics Tutor, English Tutor, Computer Science Tutor or a full
              Online School Zimbabwe experience, GlobeDk Elite Academy delivers
              flexible learning solutions designed around every learner's goals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover="hover"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all">
                  <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle2 className="h-10 w-10 text-primary mb-4" />
                    <p className="font-semibold">{service}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* O-Level Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                O
              </div>

              <h2 className="text-3xl md:text-4xl font-bold">
                O-Level Subjects
              </h2>
            </div>

            <p className="text-muted-foreground leading-8 max-w-4xl">
              GlobeDk Elite Academy provides comprehensive O-Level Lessons for
              both ZIMSEC and Cambridge students. Choose from Online Lessons,
              Physical Lessons at Epworth StopOver, Harare, Homeschooling,
              Weekend Lessons and personalised one-on-one tutoring. Every
              learner benefits from homework support, revision classes, exam
              preparation and continuous academic guidance from experienced
              tutors in Mathematics, English, Combined Science, Physics,
              Chemistry, Biology, Geography, History, Heritage Studies,
              Commerce, Principles of Accounts and Computer Science.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {oLevelSubjects.map((subject, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover="hover"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: [0, 15, -10, 0] }}
                        className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"
                      >
                        <subject.icon className="h-6 w-6 text-primary" />
                      </motion.div>

                      <div>
                        <CardTitle>{subject.name}</CardTitle>

                        <Badge variant="secondary" className="mt-2">
                          O-Level
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      {subject.description}
                    </p>

                    <div>
                      <h4 className="font-semibold mb-3">
                        Topics Covered
                      </h4>

                      <div className="flex flex-wrap gap-2">
                        {subject.topics.map((topic, i) => (
                          <Badge key={i} variant="outline">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4 flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Flexible Schedule
                      </span>

                      <span className="flex items-center gap-2 font-medium">
                        <DollarSign className="h-4 w-4" />
                        {subject.fee}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
                  </div>
      </section>

      {/* A-Level Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-12 w-12 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xl">
                A
              </div>

              <h2 className="text-3xl md:text-4xl font-bold">
                A-Level Subjects
              </h2>
            </div>

            <p className="text-muted-foreground leading-8 max-w-4xl">
              GlobeDk Elite Academy offers professional A-Level Lessons for both
              ZIMSEC and Cambridge students through Online Lessons, Physical
              Lessons, Homeschooling and Live Virtual Classes. Our experienced
              tutors prepare learners for university entrance and professional
              careers through personalised tutoring, revision classes, homework
              assistance and intensive examination preparation in Sciences,
              Commercials and Technology subjects.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aLevelSubjects.map((subject, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover="hover"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-background">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: [0, 15, -10, 0] }}
                        className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center"
                      >
                        <subject.icon className="h-6 w-6 text-secondary" />
                      </motion.div>

                      <div>
                        <CardTitle className="text-xl">
                          {subject.name}
                        </CardTitle>

                        <Badge
                          variant="secondary"
                          className="mt-2 bg-secondary text-secondary-foreground"
                        >
                          A-Level
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-7">
                      {subject.description}
                    </p>

                    <div>
                      <h4 className="font-semibold mb-3">
                        Topics Covered
                      </h4>

                      <div className="flex flex-wrap gap-2">
                        {subject.topics.map((topic, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4 flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Flexible Schedule
                      </span>

                      <span className="flex items-center gap-2 font-medium">
                        <DollarSign className="h-4 w-4" />
                        {subject.fee}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="py-20 md:py-28"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge className="mb-4">
              Affordable Tuition Fees
            </Badge>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Flexible Learning Options
            </h2>

            <p className="text-muted-foreground leading-8">
              Whether you prefer learning online from anywhere in Zimbabwe or
              attending our physical lessons in Epworth StopOver, Harare, GlobeDk
              Elite Academy provides affordable, high-quality education for
              every learner.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Physical Lessons
                </CardTitle>

                <p className="text-muted-foreground">
                  Epworth StopOver, Harare
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between border-b pb-3">
                  <span>O-Level</span>
                  <strong>US$15 / subject / month</strong>
                </div>

                <div className="flex justify-between">
                  <span>A-Level</span>
                  <strong>US$20 / subject / month</strong>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Online Lessons
                </CardTitle>

                <p className="text-muted-foreground">
                  Learn from anywhere in Zimbabwe and internationally.
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between border-b pb-3">
                  <span>ZIMSEC O-Level</span>
                  <strong>US$20</strong>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span>Cambridge O-Level</span>
                  <strong>US$25</strong>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span>ZIMSEC A-Level</span>
                  <strong>US$25</strong>
                </div>

                <div className="flex justify-between">
                  <span>Cambridge A-Level</span>
                  <strong>US$30</strong>
                </div>
              </CardContent>
            </Card>
          </div>        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-primary/5 border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-0 shadow-xl">
              <CardContent className="py-12 px-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                </div>

                <Badge className="mb-4">
                  Founder & Principal
                </Badge>

                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  John Ariphios Daka
                </h2>

                <p className="text-muted-foreground leading-8 text-lg">
                  John Ariphios Daka is the Founder & Principal of GlobeDk Elite
                  Academy and a dedicated professional educator with a passion
                  for transforming lives through quality education. He has
                  successfully guided students preparing for both ZIMSEC and
                  Cambridge examinations by combining academic excellence,
                  mentorship and personalised learning strategies.
                </p>

                <p className="text-muted-foreground leading-8 text-lg mt-6">
                  His commitment is to provide accessible Online Lessons,
                  Physical Lessons, Homeschooling, One-on-One Tutoring, Revision
                  Classes, Homework Assistance and Exam Preparation that empower
                  learners across Zimbabwe and internationally to achieve
                  outstanding academic results.
                </p>

                <div className="mt-8">
                  <Badge className="text-base px-5 py-2">
                    Committed to Excellence in Education. Success for Life.
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 bg-primary text-primary-foreground shadow-2xl">
              <CardContent className="py-14 px-8 text-center">
                <Badge
                  variant="secondary"
                  className="mb-5"
                >
                  Enrolments Open
                </Badge>

                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Start Learning with GlobeDk Elite Academy Today
                </h2>

                <p className="max-w-3xl mx-auto text-lg leading-8 text-primary-foreground/90 mb-8">
                  Whether you need an Online Tutor Zimbabwe, Home School
                  Zimbabwe support, ZIMSEC Tutors, Cambridge Tutors, Mathematics
                  Tutor, English Tutor, Geography Tutor, Computer Science Tutor,
                  Commerce Tutor, Business Studies Tutor, Economics Tutor or
                  professional exam preparation, GlobeDk Elite Academy is ready
                  to help you succeed.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    asChild
                  >
                    <Link href="/contact">
                      Enrol Now
                    </Link>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                  >
                    <Link href="/about">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
            <Footer />
    </div>
  );
}
