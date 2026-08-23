"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Bell,
  BookOpen,
  Info,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const handleEnrollClick = () => {
  const message =
    "Hello GlobeDk Elite Academy. I am interested in your online tutoring services and would like to know more about the available lessons, subjects, fees and class schedules. I would also like to know how I can enrol. Thank you.";

  const whatsappUrl = `https://wa.me/263786053315?text=${encodeURIComponent(
    message
  )}`;

  window.open(whatsappUrl, "_blank");
};

export default function TimetablePage() {
  const lessonInformation = [
    {
      icon: Calendar,
      title: "Monday – Friday",
      description:
        "Lessons are conducted throughout the school week according to the current academic programme.",
    },
    {
      icon: BookOpen,
      title: "Flexible Learning",
      description:
        "Subjects, topics, and lesson times are planned according to the content that needs to be covered and students' learning needs.",
    },
    {
      icon: Video,
      title: "Physical & Online",
      description:
        "Students can attend lessons in person or participate online through available learning platforms.",
    },
  ];

  const scheduleFactors = [
    {
      icon: BookOpen,
      title: "Topics Being Covered",
      description:
        "Lesson planning is based on the specific topics that need to be taught. Topics that require more explanation or practice may be allocated additional lesson time.",
    },
    {
      icon: Clock,
      title: "Students' Learning Needs",
      description:
        "The programme can be adjusted to give students more time to understand, practise, and apply challenging concepts.",
    },
    {
      icon: Calendar,
      title: "Academic Progress",
      description:
        "The schedule may change as students progress through the syllabus and move from new topics to revision, practice, or assessments.",
    },
    {
      icon: Bell,
      title: "Weekly Updates",
      description:
        "Students and parents are informed of relevant lesson times, topics, and schedule changes so they can plan accordingly.",
    },
  ];

  const announcements = [
    {
      title: "Weekday Lessons",
      date: "Monday – Friday",
      description:
        "Lessons are conducted throughout the school week. The exact subjects and lesson times may vary depending on the week's academic programme.",
    },
    {
      title: "Topic-Based Learning",
      date: "Flexible",
      description:
        "Each lesson focuses on the topics that need to be covered, with sufficient time provided for explanation, practice, and understanding.",
    },
    {
      title: "Schedule Updates",
      date: "As Required",
      description:
        "Students and parents will be informed of upcoming lesson times, topics, and any relevant changes to the programme.",
    },
  ];

  return (
    <div className="homepage-shell min-h-screen overflow-x-clip bg-[#f4f1ea] text-[#14263d]">
      <Navigation />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#10243d] py-20 text-[#f8f4eb] sm:py-28">
          <div
            aria-hidden="true"
            className="absolute -right-32 top-10 h-[32rem] w-[32rem] rounded-full border border-white/10"
          />

          <div
            aria-hidden="true"
            className="absolute -left-40 bottom-[-18rem] h-[32rem] w-[32rem] rounded-full border border-white/10"
          />

          <div className="container relative z-10 mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex rounded-full border border-white/15 bg-white/[0.06] px-4 py-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e3a56f]">
                  Monday – Friday Lessons
                </span>
              </div>

              <h1 className="font-serif text-5xl leading-[0.95] tracking-[-0.05em] sm:text-6xl md:text-7xl">
                Weekly Lesson{" "}
                <span className="text-[#e3a56f]">Schedule.</span>
              </h1>

              <p className="mx-auto mt-7 max-w-3xl text-base leading-relaxed text-white/65 sm:text-lg">
                GlobeDK Elite Academy provides structured weekday lessons
                designed around the topics, syllabus requirements, and learning
                needs of our students.
              </p>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45 sm:text-base">
                Our schedule is flexible rather than fixed. Lesson times,
                subjects, and topics may vary from week to week depending on
                the academic programme.
              </p>
            </div>
          </div>
        </section>

        {/* IMPORTANT NOTICE */}
        <section className="bg-[#f4f1ea] py-16 sm:py-20">
          <div className="container mx-auto max-w-5xl px-4">
            <Alert className="rounded-[1.5rem] border border-[#d9d3c8] bg-white/45 shadow-none">
              <Info className="h-5 w-5 text-[#b15d2b]" />

              <AlertDescription>
                <div className="space-y-3">
                  <h2 className="font-serif text-2xl tracking-[-0.03em] text-[#14263d]">
                    Important Schedule Information
                  </h2>

                  <p className="leading-relaxed text-[#526071]">
                    Lessons take place from{" "}
                    <span className="font-semibold text-[#14263d]">
                      Monday to Friday
                    </span>
                    . Rather than following a rigid timetable with the same
                    subject at the same time every week, our programme is
                    organised according to the topics that need to be covered
                    and the learning needs of our students.
                  </p>

                  <p className="leading-relaxed text-[#526071]">
                    Students and parents will be informed of the relevant lesson
                    times, topics, and schedule updates as part of the weekly
                    programme.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* HOW LESSONS WORK */}
        <section className="bg-[#f4f1ea] py-20 sm:py-28">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-12 grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b15d2b]">
                  01 / How it works
                </p>

                <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">
                  Learning designed around what students need.
                </h2>
              </div>

              <p className="max-w-2xl text-base leading-relaxed text-[#526071] sm:text-lg">
                Our weekday programme provides focused learning time while
                allowing flexibility to respond to the academic requirements
                of each week.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {lessonInformation.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Card
                    key={index}
                    className="group rounded-[1.35rem] border border-[#d9d3c8] bg-white/45 shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-[#b15d2b]/40 hover:bg-white hover:shadow-[0_18px_45px_rgba(20,38,61,.1)]"
                  >
                    <CardContent className="p-6 sm:p-7">
                      <div className="flex items-start justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#10243d] text-[#e3a56f]">
                          <Icon className="h-5 w-5" />
                        </div>

                        <span className="text-xs font-bold text-[#b15d2b]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h3 className="mt-8 font-serif text-2xl tracking-[-0.03em]">
                        {item.title}
                      </h3>

                      <p className="mt-3 leading-relaxed text-[#526071]">
                        {item.description}
                      </p>

                      <div className="mt-6 h-px w-0 bg-[#b15d2b] transition-all duration-500 group-hover:w-full" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* WHAT DETERMINES SCHEDULE */}
        <section className="bg-[#eae4d9] py-20 sm:py-28">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="mb-12 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b15d2b]">
                02 / Programme planning
              </p>

              <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">
                What determines the lesson schedule?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#526071] sm:text-lg">
                The weekly programme is arranged according to the academic
                work that needs to be completed.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {scheduleFactors.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Card
                    key={index}
                    className="group rounded-[1.35rem] border border-[#c9c1b4] bg-white/40 shadow-none transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_18px_40px_rgba(20,38,61,.08)]"
                  >
                    <CardContent className="p-6 sm:p-7">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#10243d] text-[#e3a56f]">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div>
                          <div className="mb-2 flex items-center gap-3">
                            <span className="text-[10px] font-bold text-[#b15d2b]">
                              0{index + 1}
                            </span>

                            <h3 className="font-serif text-2xl tracking-[-0.03em]">
                              {item.title}
                            </h3>
                          </div>

                          <p className="leading-relaxed text-[#526071]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* LEARNING OPTIONS */}
        <section className="bg-[#f4f1ea] py-20 sm:py-28">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="mb-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b15d2b]">
                  03 / Learning formats
                </p>

                <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">
                  Choose how you want to learn.
                </h2>
              </div>

              <p className="max-w-xl text-base leading-relaxed text-[#526071] sm:text-lg">
                Students can participate in lessons through either physical or
                online learning arrangements.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Card className="group rounded-[1.5rem] border border-[#d9d3c8] bg-white/45 shadow-none transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_45px_rgba(20,38,61,.1)]">
                <CardContent className="p-7 sm:p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10243d] text-[#e3a56f]">
                      <MapPin className="h-5 w-5" />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b15d2b]">
                      01 / Physical
                    </span>
                  </div>

                  <h3 className="mt-8 font-serif text-3xl tracking-[-0.03em]">
                    Physical Lessons
                  </h3>

                  <p className="mt-3 leading-relaxed text-[#526071]">
                    Attend lessons in person at our learning location in
                    Epworth, Harare.
                  </p>
                </CardContent>
              </Card>

              <Card className="group rounded-[1.5rem] border border-[#d9d3c8] bg-white/45 shadow-none transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_45px_rgba(20,38,61,.1)]">
                <CardContent className="p-7 sm:p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10243d] text-[#e3a56f]">
                      <Video className="h-5 w-5" />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b15d2b]">
                      02 / Online
                    </span>
                  </div>

                  <h3 className="mt-8 font-serif text-3xl tracking-[-0.03em]">
                    Online Lessons
                  </h3>

                  <p className="mt-3 leading-relaxed text-[#526071]">
                    Participate remotely through available online platforms
                    such as Zoom or Google Meet.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* WEEKLY UPDATES */}
        <section className="bg-[#10243d] py-20 text-[#f8f4eb] sm:py-28">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="mb-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e3a56f]">
                04 / Stay informed
              </p>

              <div className="mt-5 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                <h2 className="font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">
                  Weekly updates & announcements.
                </h2>

                <p className="max-w-xl text-base leading-relaxed text-white/60">
                  Keep informed about the current lesson programme and any
                  important schedule updates.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {announcements.map((announcement, index) => (
                <Alert
                  key={index}
                  className="rounded-[1.25rem] border border-white/15 bg-white/[0.045] text-white"
                >
                  <AlertDescription>
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e3a56f] text-[#10243d]">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>

                        <div>
                          <h3 className="font-serif text-xl text-white">
                            {announcement.title}
                          </h3>

                          <p className="mt-1 leading-relaxed text-white/55">
                            {announcement.description}
                          </p>
                        </div>
                      </div>

                      <Badge className="w-fit shrink-0 rounded-full border border-white/15 bg-transparent px-4 py-2 text-[#e3a56f] hover:bg-transparent">
                        {announcement.date}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative overflow-hidden bg-[#d87a3f] py-20 text-[#10243d] sm:py-28">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-24 h-80 w-80 rounded-full border border-[#10243d]/15"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full border border-[#10243d]/10"
          />

          <div className="container relative z-10 mx-auto max-w-5xl px-4">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#10243d]/70">
                  05 / Ready to learn
                </p>

                <h2 className="mt-5 max-w-3xl font-serif text-5xl leading-[0.95] tracking-[-0.05em] sm:text-6xl">
                  Start learning with GlobeDk Elite Academy today.
                </h2>

                <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#10243d]/70">
                  Enrol today and become part of our weekday learning
                  programme. Students and parents will receive the relevant
                  information about upcoming lessons, topics, and the current
                  weekly programme.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col">
                <Button
                  onClick={handleEnrollClick}
                  size="lg"
                  className="cursor-pointer rounded-full bg-[#10243d] px-7 text-white shadow-lg shadow-[#10243d]/15 hover:bg-[#193653]"
                >
                  Join Class
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="cursor-pointer rounded-full border-[#10243d]/35 bg-transparent text-[#10243d] hover:bg-[#10243d]/10"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}