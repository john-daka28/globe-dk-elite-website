"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  Users,
  UserPlus,
  BookOpen,
  GraduationCap,
  TrendingUp,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    olevel: 0,
    alevel: 0,
  });
  const [recent, setRecent] = useState<any[]>([]);

  // Fetch dashboard data
  const loadDashboard = async () => {
    const { data } = await supabase
      .from("extra_lesson_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (!data) return;

    const todayDate = new Date().toDateString();

    setStats({
      total: data.length,
      today: data.filter((app) => new Date(app.created_at).toDateString() === todayDate).length,
      olevel: data.filter((app) => app.level === "O Level").length,
      alevel: data.filter((app) => app.level === "A Level").length,
    });

    setRecent(data.slice(0, 6));
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm fixed h-full p-6 space-y-6">
        <h2 className="text-2xl font-bold text-primary">ADMIN PANEL</h2>

        <nav className="space-y-3">
          <Link href="/admin/dashboard" className="block p-3 rounded bg-primary text-white">
            Dashboard
          </Link>

          <Link href="/applicantss" className="block p-3 rounded hover:bg-gray-100">
            Applicants
          </Link>

          <Link href="/admin/subjects" className="block p-3 rounded hover:bg-gray-100">
            Subjects
          </Link>

          <Link href="/admin/settings" className="block p-3 rounded hover:bg-gray-100">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Overview of activity and performance</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">

          <Card className="shadow hover:shadow-lg transition">
            <CardContent className="p-6">
              <Users className="h-10 w-10 text-primary mb-3" />
              <h2 className="text-3xl font-bold">{stats.total}</h2>
              <p className="text-gray-500">Total Applicants</p>
            </CardContent>
          </Card>

          <Card className="shadow hover:shadow-lg transition">
            <CardContent className="p-6">
              <UserPlus className="h-10 w-10 text-green-600 mb-3" />
              <h2 className="text-3xl font-bold">{stats.today}</h2>
              <p className="text-gray-500">New Today</p>
            </CardContent>
          </Card>

          <Card className="shadow hover:shadow-lg transition">
            <CardContent className="p-6">
              <BookOpen className="h-10 w-10 text-blue-600 mb-3" />
              <h2 className="text-3xl font-bold">{stats.olevel}</h2>
              <p className="text-gray-500">O-Level Applicants</p>
            </CardContent>
          </Card>

          <Card className="shadow hover:shadow-lg transition">
            <CardContent className="p-6">
              <GraduationCap className="h-10 w-10 text-purple-600 mb-3" />
              <h2 className="text-3xl font-bold">{stats.alevel}</h2>
              <p className="text-gray-500">A-Level Applicants</p>
            </CardContent>
          </Card>

        </div>

        {/* Quick Actions */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-primary/30 hover:bg-primary hover:text-white transition cursor-pointer">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">View Applicants</h3>
                <p className="text-sm">See full details</p>
              </div>
              <ArrowRight className="h-6 w-6" />
            </CardContent>
          </Card>

          <Card className="border-primary/30 hover:bg-primary hover:text-white transition cursor-pointer">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">Subjects Overview</h3>
                <p className="text-sm">Manage subject offerings</p>
              </div>
              <BookOpen className="h-6 w-6" />
            </CardContent>
          </Card>

          <Card className="border-primary/30 hover:bg-primary hover:text-white transition cursor-pointer">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">Settings</h3>
                <p className="text-sm">System controls</p>
              </div>
              {/* <Settings className="h-6 w-6" /> */}
            </CardContent>
          </Card>
        </div>

        {/* Recent Applicants */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-3">Recent Applicants</h2>

          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Level</th>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {recent.map((app) => (
                    <tr key={app.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">
                        {app.first_name} {app.last_name}
                      </td>
                      <td className="p-4">{app.level}</td>
                      <td className="p-4">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                        >
                          <Link href={`/admin/applicants/${app.id}`}>
                            View
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
}
