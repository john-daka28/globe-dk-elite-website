"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Initialize Supabase client with anon key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // safe to use in frontend
);

export default function EnrollPage() {
  const [level, setLevel] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const availableSubjects = {
    "O Level": ["English", "Maths", "Geography", "Computer Science"],
    "A Level": ["Computer Science", "Pure Maths", "Geography"],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Direct insert using Supabase client
      const { error } = await supabase.from("enrollments").insert([
        { level, subjects, phone, email },
      ]);

      if (error) {
        console.error("Supabase insert failed:", error.message);
        alert("Something went wrong. Please try again.");
        return;
      }

      alert("✅ Enrollment submitted successfully!");
      setLevel("");
      setSubjects([]);
      setPhone("");
      setEmail("");
    } catch (err) {
      console.error("Enrollment failed:", err);
      alert("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 py-8">
      <Card className="max-w-md w-full shadow-lg rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center text-primary">
            Enroll for Lessons
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full border rounded-lg p-2"
              />
            </div>

            {/* Level */}
            <div>
              <label className="block mb-1 font-medium">Select Level</label>
              <select
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

            {/* Subjects */}
            {level && (
              <div>
                <label className="block mb-1 font-medium">Select Subjects</label>
                {availableSubjects[level as keyof typeof availableSubjects].map(
                  (subject) => (
                    <div key={subject} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={subjects.includes(subject)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSubjects([...subjects, subject]);
                          } else {
                            setSubjects(subjects.filter((s) => s !== subject));
                          }
                        }}
                      />
                      <span>{subject}</span>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Phone */}
            <div>
              <label className="block mb-1 font-medium">Contact Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+2637XXXXXXX"
                className="w-full border rounded-lg p-2"
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Enrollment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
