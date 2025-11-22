// import { Navigation } from "@/components/navigation"
// import { Footer } from "@/components/footer"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { FileText, Download, BookOpen, Video, Lightbulb, Calendar, ExternalLink } from "lucide-react"

// export default function ResourcesPage() {
//   const studyGuides = [
//     {
//       title: "O-Level Mathematics Complete Guide",
//       description: "Comprehensive coverage of all O-Level maths topics with examples and practice problems",
//       pages: 120,
//       category: "Mathematics",
//       level: "O-Level",
//     },
//     {
//       title: "A-Level Pure Maths Formula Sheet",
//       description: "All essential formulas and theorems for A-Level Pure Mathematics",
//       pages: 24,
//       category: "Mathematics",
//       level: "A-Level",
//     },
//     {
//       title: "English Essay Writing Masterclass",
//       description: "Step-by-step guide to writing excellent essays with examples and templates",
//       pages: 45,
//       category: "English",
//       level: "O-Level",
//     },
//     {
//       title: "Computer Science Programming Guide",
//       description: "Learn programming fundamentals with Python examples and exercises",
//       pages: 80,
//       category: "Computer Science",
//       level: "O-Level",
//     },
//   ]

//   const pastPapers = [
//     { year: 2024, subject: "Mathematics", level: "O-Level", papers: 3 },
//     { year: 2024, subject: "English", level: "O-Level", papers: 2 },
//     { year: 2024, subject: "Computer Science", level: "O-Level", papers: 2 },
//     { year: 2024, subject: "Geography", level: "O-Level", papers: 2 },
//     { year: 2023, subject: "Pure Mathematics", level: "A-Level", papers: 3 },
//     { year: 2023, subject: "Computer Science", level: "A-Level", papers: 2 },
//   ]

//   const blogPosts = [
//     {
//       title: "10 Effective Study Techniques for O-Level Success",
//       excerpt: "Discover proven methods to improve your study habits and retain information better.",
//       date: "2025-01-15",
//       readTime: "5 min read",
//       category: "Study Tips",
//     },
//     {
//       title: "How to Overcome Math Anxiety",
//       excerpt: "Practical strategies to build confidence and excel in mathematics.",
//       date: "2025-01-10",
//       readTime: "7 min read",
//       category: "Mathematics",
//     },
//     {
//       title: "Time Management for A-Level Students",
//       excerpt: "Balance your studies, extracurriculars, and personal life effectively.",
//       date: "2025-01-05",
//       readTime: "6 min read",
//       category: "Study Tips",
//     },
//     {
//       title: "Understanding Computer Science Algorithms",
//       excerpt: "Break down complex algorithms into simple, understandable concepts.",
//       date: "2024-12-28",
//       readTime: "8 min read",
//       category: "Computer Science",
//     },
//   ]

//   const examTips = [
//     {
//       title: "Exam Preparation Timeline",
//       description: "A week-by-week guide to preparing for your final exams",
//       icon: Calendar,
//     },
//     {
//       title: "Memory Techniques",
//       description: "Proven methods to remember formulas, dates, and key concepts",
//       icon: Lightbulb,
//     },
//     {
//       title: "Exam Day Strategies",
//       description: "What to do before, during, and after your examination",
//       icon: BookOpen,
//     },
//     {
//       title: "Stress Management",
//       description: "Techniques to stay calm and focused during exam season",
//       icon: Lightbulb,
//     },
//   ]

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navigation />

//       {/* Hero Section */}
//       <section className="bg-primary text-primary-foreground py-16 md:py-20">
//         <div className="container mx-auto px-4">
//           <div className="max-w-3xl mx-auto text-center space-y-4">
//             <h1 className="text-4xl md:text-5xl font-bold text-balance">Learning Resources</h1>
//             <p className="text-lg text-primary-foreground/90 leading-relaxed">
//               Access comprehensive study materials, past papers, exam tips, and educational content to support your
//               learning journey.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Main Content */}
//       <section className="py-16 md:py-24">
//         <div className="container mx-auto px-4">
//           <Tabs defaultValue="guides" className="space-y-8">
//             <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
//               <TabsTrigger value="guides" className="text-sm">
//                 Study Guides
//               </TabsTrigger>
//               <TabsTrigger value="papers" className="text-sm">
//                 Past Papers
//               </TabsTrigger>
//               <TabsTrigger value="tips" className="text-sm">
//                 Exam Tips
//               </TabsTrigger>
//               <TabsTrigger value="blog" className="text-sm">
//                 Blog
//               </TabsTrigger>
//             </TabsList>

//             {/* Study Guides Tab */}
//             <TabsContent value="guides" className="space-y-6">
//               <div className="max-w-5xl mx-auto">
//                 <div className="mb-8">
//                   <h2 className="text-2xl md:text-3xl font-bold mb-2">Study Guides & Notes</h2>
//                   <p className="text-muted-foreground">Comprehensive study materials created by our expert tutors</p>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-6">
//                   {studyGuides.map((guide, index) => (
//                     <Card key={index} className="border-border hover:shadow-lg transition-shadow">
//                       <CardHeader>
//                         <div className="flex items-start justify-between mb-2">
//                           <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
//                             <FileText className="h-6 w-6 text-primary" />
//                           </div>
//                           <Badge variant="secondary">{guide.level}</Badge>
//                         </div>
//                         <CardTitle className="text-lg">{guide.title}</CardTitle>
//                         <CardDescription>{guide.description}</CardDescription>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         <div className="flex items-center justify-between text-sm text-muted-foreground">
//                           <span>{guide.category}</span>
//                           <span>{guide.pages} pages</span>
//                         </div>
//                         <Button className="w-full bg-transparent" variant="outline">
//                           <Download className="mr-2 h-4 w-4" />
//                           Download PDF
//                         </Button>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </div>
//             </TabsContent>

//             {/* Past Papers Tab */}
//             <TabsContent value="papers" className="space-y-6">
//               <div className="max-w-5xl mx-auto">
//                 <div className="mb-8">
//                   <h2 className="text-2xl md:text-3xl font-bold mb-2">Past Examination Papers</h2>
//                   <p className="text-muted-foreground">Practice with real exam papers from previous years</p>
//                 </div>

//                 <div className="space-y-4">
//                   {pastPapers.map((paper, index) => (
//                     <Card key={index} className="border-border">
//                       <CardContent className="p-6">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-4">
//                             <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
//                               <BookOpen className="h-6 w-6 text-secondary" />
//                             </div>
//                             <div>
//                               <h3 className="font-semibold text-lg">
//                                 {paper.subject} - {paper.year}
//                               </h3>
//                               <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
//                                 <Badge variant="outline">{paper.level}</Badge>
//                                 <span>{paper.papers} papers available</span>
//                               </div>
//                             </div>
//                           </div>
//                           <Button variant="outline">
//                             <Download className="mr-2 h-4 w-4" />
//                             Download
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </div>
//             </TabsContent>

//             {/* Exam Tips Tab */}
//             <TabsContent value="tips" className="space-y-6">
//               <div className="max-w-5xl mx-auto">
//                 <div className="mb-8">
//                   <h2 className="text-2xl md:text-3xl font-bold mb-2">Exam Success Tips</h2>
//                   <p className="text-muted-foreground">Expert advice to help you excel in your examinations</p>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-6 mb-12">
//                   {examTips.map((tip, index) => (
//                     <Card key={index} className="border-border hover:shadow-lg transition-shadow">
//                       <CardContent className="pt-6 space-y-3">
//                         <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
//                           <tip.icon className="h-6 w-6 text-primary" />
//                         </div>
//                         <h3 className="text-xl font-semibold">{tip.title}</h3>
//                         <p className="text-muted-foreground leading-relaxed">{tip.description}</p>
//                         <Button variant="link" className="p-0 h-auto">
//                           Read More <ExternalLink className="ml-2 h-4 w-4" />
//                         </Button>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>

//                 {/* Video Resources */}
//                 <Card className="border-border">
//                   <CardHeader>
//                     <CardTitle>Video Tutorials</CardTitle>
//                     <CardDescription>Watch our exam preparation video series</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="grid md:grid-cols-2 gap-4">
//                       {[
//                         "How to Tackle Multiple Choice Questions",
//                         "Essay Writing Under Time Pressure",
//                         "Mathematical Problem-Solving Strategies",
//                         "Effective Revision Techniques",
//                       ].map((video, index) => (
//                         <div
//                           key={index}
//                           className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
//                         >
//                           <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
//                             <Video className="h-5 w-5 text-primary" />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <h4 className="font-medium text-sm">{video}</h4>
//                             <p className="text-xs text-muted-foreground mt-1">15 min</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>

//             {/* Blog Tab */}
//             <TabsContent value="blog" className="space-y-6">
//               <div className="max-w-5xl mx-auto">
//                 <div className="mb-8">
//                   <h2 className="text-2xl md:text-3xl font-bold mb-2">Educational Blog</h2>
//                   <p className="text-muted-foreground">Articles, tips, and insights to support your academic journey</p>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-6">
//                   {blogPosts.map((post, index) => (
//                     <Card key={index} className="border-border hover:shadow-lg transition-shadow">
//                       <CardHeader>
//                         <div className="flex items-center gap-2 mb-2">
//                           <Badge variant="secondary">{post.category}</Badge>
//                           <span className="text-xs text-muted-foreground">{post.readTime}</span>
//                         </div>
//                         <CardTitle className="text-lg">{post.title}</CardTitle>
//                         <CardDescription>{post.excerpt}</CardDescription>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm text-muted-foreground">{post.date}</span>
//                           <Button variant="link" className="p-0 h-auto">
//                             Read Article <ExternalLink className="ml-2 h-4 w-4" />
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   )
// }
"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EnrollPage() {
  const [level, setLevel] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const availableSubjects = {
    "O Level": ["English", "Maths", "Geography", "Computer Science"],
    "A Level": ["Computer Science", "Pure Maths", "Geography"],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!level || subjects.length === 0 || !email || !phone) {
      setErrorMessage("Please fill all required fields and select at least one subject.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("enrollments").insert([
        { level, subjects, phone, email },
      ]);

      if (error) throw error;

      // Optional: trigger a Supabase Function or send email here
      // You can integrate a serverless function to send email notifications

      setSuccessMessage("✅ Enrollment submitted successfully! You will receive a confirmation email shortly.");
      setLevel("");
      setSubjects([]);
      setPhone("");
      setEmail("");
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 py-8">
      <Card className="max-w-md w-full shadow-xl rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-3xl font-bold text-center text-primary">Enroll for Lessons</h2>
          <p className="text-center text-muted-foreground">Fill out the form below to reserve your spot.</p>

          {successMessage && (
            <Alert variant="success" className="mb-4">
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="level">Select Level</Label>
              <select
                id="level"
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value);
                  setSubjects([]);
                }}
                required
                className="w-full border rounded-lg p-2"
              >
                <option value="">-- Choose Level --</option>
                <option value="O Level">O Level</option>
                <option value="A Level">A Level</option>
              </select>
            </div>

            {level && (
              <div>
                <Label>Select Subjects</Label>
                {availableSubjects[level as keyof typeof availableSubjects].map((subject) => (
                  <div key={subject} className="flex items-center gap-2 mt-1">
                    <input
                      type="checkbox"
                      checked={subjects.includes(subject)}
                      onChange={(e) => {
                        if (e.target.checked) setSubjects([...subjects, subject]);
                        else setSubjects(subjects.filter((s) => s !== subject));
                      }}
                    />
                    <span>{subject}</span>
                  </div>
                ))}
              </div>
            )}

            <div>
              <Label htmlFor="phone">Contact Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+2637XXXXXXX"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Enrollment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
