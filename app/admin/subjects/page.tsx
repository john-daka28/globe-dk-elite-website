"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

// Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminSubjects() {
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [level, setLevel] = useState("O-Level");

  // Fetch subjects
  const fetchSubjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setSubjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Add subject
  const addSubject = async () => {
    if (!newSubject.trim()) return;

    const { error } = await supabase.from("subjects").insert({
      name: newSubject.trim(),
      level,
    });

    if (!error) {
      setNewSubject("");
      fetchSubjects();
    }
  };

  // Delete subject
  const deleteSubject = async (id: number) => {
    await supabase.from("subjects").delete().eq("id", id);
    fetchSubjects();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r shadow-sm fixed h-full p-6 space-y-6">
        <h2 className="text-2xl font-bold text-primary">ADMIN PANEL</h2>

        <nav className="space-y-3">
          <a href="/admin/dashboard" className="block p-3 rounded hover:bg-gray-100">
            Dashboard
          </a>
          <a href="/applicantss" className="block p-3 rounded hover:bg-gray-100">
            Applicants
          </a>
          <a href="/admin/subjects" className="block p-3 rounded bg-primary text-white">
            Subjects
          </a>
          <a href="/admin/settings" className="block p-3 rounded hover:bg-gray-100">
            Settings
          </a>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8">

        <h1 className="text-4xl font-bold mb-2">Subjects Management</h1>
        <p className="text-gray-500 mb-8">Add, view, and manage O-Level & A-Level subjects.</p>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Add Subject */}
          <Card className="shadow">
            <CardHeader>
              <CardTitle>Add New Subject</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <Label>Subject Name</Label>
                <Input
                  placeholder="e.g. Mathematics"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                />
              </div>

              <div>
                <Label>Level</Label>
                <select
                  className="border rounded p-2 w-full"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option value="O-Level">O-Level</option>
                  <option value="A-Level">A-Level</option>
                </select>
              </div>

              <Button onClick={addSubject} className="w-full">
                Add Subject
              </Button>
            </CardContent>
          </Card>

          {/* Subjects List */}
          <Card className="shadow">
            <CardHeader>
              <CardTitle>All Subjects</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {loading && <p className="text-gray-500">Loading subjects...</p>}

              {!loading && subjects.length === 0 && (
                <p className="text-gray-500">No subjects added yet.</p>
              )}

              <ul className="space-y-2">
                {subjects.map((subject) => (
                  <li
                    key={subject.id}
                    className="flex items-center justify-between p-3 bg-white border rounded shadow-sm"
                  >
                    <div>
                      <p className="font-semibold">{subject.name}</p>
                      <p className="text-sm text-gray-500">{subject.level}</p>
                    </div>

                    <button
                      onClick={() => deleteSubject(subject.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

        </div>

        <hr className="my-10 border-gray-300" />

        <p className="text-center text-gray-400 text-sm">
          GlobeDK Elite Admin • Subjects Management
        </p>
      </main>
    </div>
  );
}
