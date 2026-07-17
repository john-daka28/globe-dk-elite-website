"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calculator, Globe, Laptop, FileText, CheckCircle2, Clock, DollarSign, User } from "lucide-react";
import { motion } from "framer-motion";

export default function SubjectsPage() {
  const oLevelSubjects = [
    {
      name: "Mathematics",
      icon: Calculator,
      description:
        "Comprehensive coverage of algebra, geometry, trigonometry, and statistics to build strong problem-solving skills.",
      topics: ["Algebra", "Geometry", "Trigonometry", "Statistics", "Number Systems"],
      duration: "2 hours per week",
      fee: "$20 per subject",
    },
    {
      name: "English Language",
      icon: FileText,
      description:
        "Master reading comprehension, writing, grammar, and literature analysis for effective communication.",
      topics: ["Grammar", "Composition", "Comprehension", "Literature", "Oral Skills"],
      duration: "2 hours per week",
      fee: "$20 per subject",
    },
    {
      name: "Computer Science",
      icon: Laptop,
      description:
        "Learn programming fundamentals, algorithms, databases, and computing concepts for the digital world.",
      topics: ["Programming", "Algorithms", "Data Structures", "Databases", "Networks"],
      duration: "2 hours per week",
      fee: "$20 per subject",
    },
    {
      name: "Geography",
      icon: Globe,
      description:
        "Explore physical and human geography, map skills, environment, and global development patterns.",
      topics: ["Physical Geography", "Human Geography", "Map Skills", "Environment", "Development"],
      duration: "2 hours per week",
      fee: "$20 per subject",
    },
  ];

  const aLevelSubjects = [
    {
      name: "Pure Mathematics",
      icon: Calculator,
      description:
        "Master advanced topics including calculus, vectors, complex numbers, and differential equations.",
      topics: ["Calculus", "Vectors", "Complex Numbers", "Differential Equations", "Proofs"],
      duration: "3 hours per week",
      fee: "$25 per subject",
    },
    {
      name: "Computer Science",
      icon: Laptop,
      description:
        "Advanced programming, software engineering, and theoretical computer science for university preparation.",
      topics: ["Programming", "Software Engineering", "Architecture", "Theory", "Projects"],
      duration: "3 hours per week",
      fee: "$25 per subject",
    },
    {
      name: "Geography",
      icon: Globe,
      description:
        "In-depth study of geographical processes, research, fieldwork, and analysis of global issues.",
      topics: ["Research Methods", "Fieldwork", "Physical Geography", "Human Geography", "Global Issues"],
      duration: "3 hours per week",
      fee: "$25 per subject",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { scale: 1.03, boxShadow: "0px 15px 30px rgba(0,0,0,0.15)" }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Subjects & Tuition</h1>
          <p className="text-lg text-primary-foreground/90 leading-relaxed max-w-3xl mx-auto">
            Learn with dedication and guidance under <strong>John Ariphios Daka</strong>, Senior Tutor at GlobeDk Elite.
          </p>
        </div>
      </section>

      {/* O-Level Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                O
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">O-Level Subjects</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-3xl">
              Each O-Level subject is  only <strong>$20</strong> per month — affordable, effective, and results-driven.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {oLevelSubjects.map((subject, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Card className="transition-transform duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: [0, 15, -10, 0] }}
                        className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"
                      >
                        <subject.icon className="h-6 w-6 text-primary" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-xl">{subject.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">O-Level</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground">{subject.description}</p>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Topics Covered:</h4>
                      <div className="flex flex-wrap gap-2">
                        {subject.topics.map((topic, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{topic}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> <span>{subject.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" /> <span>{subject.fee}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* A-Level Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xl">
                A
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">A-Level Subjects</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-3xl">
              Each A-Level subject costs <strong>$25</strong> per month — led by our Senior Tutor for academic excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aLevelSubjects.map((subject, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Card className="transition-transform duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: [0, 15, -10, 0] }}
                        className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center"
                      >
                        <subject.icon className="h-6 w-6 text-secondary" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-xl">{subject.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1 bg-secondary text-secondary-foreground">A-Level</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground">{subject.description}</p>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Topics Covered:</h4>
                      <div className="flex flex-wrap gap-2">
                        {subject.topics.map((topic, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{topic}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> <span>{subject.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" /> <span>{subject.fee}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Senior Tutor Info */}
      <section className="py-12 bg-primary/10 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex justify-center">
              <User className="h-12 w-12 text-primary animate-bounce-slow" />
            </div>
            <h3 className="text-2xl font-bold">John Ariphios Daka</h3>
            <p className="text-muted-foreground text-lg">
              Senior Tutor & Founder — GlobeDk Elite Tutoring Services, Epworth, Harare.  
              Guiding students to excellence in O-Level and A-Level studies through proven teaching methods.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
