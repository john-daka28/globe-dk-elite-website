"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";
import Link from "next/link";

// Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ApplicantsDashboard() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // Fetch applicants
  const fetchApplications = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("extra_lesson_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
    } else {
      setApplications(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filtered = applications.filter((app) =>
    `${app.first_name} ${app.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm fixed h-full p-6 space-y-6">
        <h2 className="text-2xl font-bold text-primary">ADMIN PANEL</h2>

        <nav className="space-y-3">
          <Link href="/admin/dashboard" className="flex items-center gap-2 p-3 rounded hover:bg-gray-100">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>

          <Link href="/admin/applicants" className="flex items-center gap-2 p-3 rounded bg-primary text-white">
            <Users className="h-5 w-5" /> Applicants
          </Link>

          <Link href="/admin/subjects" className="flex items-center gap-2 p-3 rounded hover:bg-gray-100">
            <BookOpen className="h-5 w-5" /> Subjects
          </Link>

          <Link href="/admin/settings" className="flex items-center gap-2 p-3 rounded hover:bg-gray-100">
            <Settings className="h-5 w-5" /> Settings
          </Link>
        </nav>

        <Button variant="destructive" className="w-full flex items-center gap-2 mt-6">
          <LogOut className="h-5 w-5" /> Logout
        </Button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-6">

        {/* Top Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold">📚 Extra Lessons Applicants</h1>
          <p className="text-gray-500">All submitted applications</p>
        </header>

        {/* Search and Refresh */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            className="border p-2 rounded w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button onClick={fetchApplications} disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "Refresh"
            )}
          </Button>
        </div>

        {/* Applicants Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Level</th>
                    <th className="p-4 text-left">Gender</th>
                    <th className="p-4 text-left">Subjects</th>
                    <th className="p-4 text-left">Guardian</th>
                    <th className="p-4 text-left">Date Applied</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length === 0 && !loading && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center text-gray-500 py-8"
                      >
                        No applicants found.
                      </td>
                    </tr>
                  )}

                  {filtered.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-4 font-medium">
                        {app.first_name} {app.last_name}
                      </td>
                      <td className="p-4">{app.level}</td>
                      <td className="p-4">{app.gender || "-"}</td>

                      {/* Subjects */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {app.subjects?.map((s: string, index: number) => (
                            <Badge key={index} className="bg-primary text-white">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </td>

                      {/* Guardian Info */}
                      <td className="p-4">
                        <div className="text-sm">
                          <strong>{app.guardian_name || "—"}</strong>
                          <div className="text-gray-500">{app.guardian_phone}</div>
                        </div>
                      </td>

                      <td className="p-4">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/applicants/${app.id}`}>View</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {loading && (
                <p className="text-center py-8 text-gray-500">
                  Loading applicants...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
