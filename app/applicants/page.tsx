"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Enrollment {
  id: number;
  level: string;
  subjects: string[];
  phone: string;
  email: string;
  created_at: string;
}

export default function ApplicantsPage() {
  const router = useRouter();
  const [applicants, setApplicants] = useState<Enrollment[]>([]);
  const [fetching, setFetching] = useState(false);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isAdminLoggedIn) {
      router.push("/admin-login"); // redirect unauthenticated users
    } else {
      fetchApplicants();
    }
  }, [router]);

  const fetchApplicants = async () => {
    setFetching(true);
    setMessage("");
    const { data, error } = await supabase
      .from("enrollments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch applicants:", error.message);
      setMessage("❌ Error fetching applicants.");
    } else if (!data || data.length === 0) {
      setMessage("No applicants found.");
      setApplicants([]);
    } else {
      setApplicants(data as Enrollment[]);
      setMessage(`✅ Loaded ${data.length} applicant(s).`);
    }
    setFetching(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    router.push("/admin-login");
  };

  const filteredApplicants = applicants.filter(
    (a) =>
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.phone.includes(search) ||
      a.level.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Applicants Dashboard</h1>
        <Button onClick={handleLogout} variant="destructive">
          Logout
        </Button>
      </div>

      {/* Search & Refresh */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by email, phone, or level..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2 flex-1"
        />
        <Button onClick={fetchApplicants} disabled={fetching}>
          {fetching ? "Refreshing..." : "Refresh List"}
        </Button>
      </div>

      {/* Status message */}
      {message && (
        <p className="max-w-6xl mx-auto mb-4 text-center font-medium text-gray-700">
          {message}
        </p>
      )}

      {/* Applicants List */}
      <div className="max-w-6xl mx-auto grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredApplicants.length === 0 && !fetching && (
          <p className="text-center col-span-full">No applicants to display.</p>
        )}

        {filteredApplicants.map((app) => (
          <Card key={app.id} className="shadow-md rounded-xl">
            <CardContent className="space-y-2">
              <h3 className="text-lg font-semibold">{app.email}</h3>
              <p>
                <span className="font-medium">Phone:</span> {app.phone}
              </p>
              <p>
                <span className="font-medium">Level:</span> {app.level}
              </p>
              <p>
                <span className="font-medium">Subjects:</span>{" "}
                {app.subjects.join(", ")}
              </p>
              <p className="text-sm text-gray-500">
                Applied at: {new Date(app.created_at).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
