"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ApplicantDetailsPage() {
  const { id } = useParams();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch details
  const fetchDetails = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("extra_lesson_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching applicant:", error);
    } else {
      setApp(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading applicant details...</div>;
  }

  if (!app) {
    return <div className="p-6 text-red-500">Applicant not found.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <div>
        <Link href="/applicantss">
          <Button variant="outline">← Back to Applicants</Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold">Applicant Details</h1>

      {/* Main Details Card */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Personal Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">First Name</p>
              <p className="text-lg font-medium">{app.first_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Name</p>
              <p className="text-lg font-medium">{app.last_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="text-lg font-medium">{app.gender || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="text-lg font-medium">
                {app.dob ? new Date(app.dob).toLocaleDateString() : "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Level</p>
              <p className="text-lg font-medium">{app.level}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <h2 className="text-xl font-semibold">Subjects</h2>

          <div className="flex flex-wrap gap-2">
            {app.subjects?.map((s: string, i: number) => (
              <Badge key={i} className="bg-primary text-white">
                {s}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Guardian Information */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Guardian Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Guardian Name</p>
              <p className="text-lg font-medium">{app.guardian_name || "—"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Relationship</p>
              <p className="text-lg font-medium">{app.relationship || "—"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-lg font-medium">{app.guardian_phone || "—"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-lg font-medium">{app.guardian_email || "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents (if available) */}
      {app.documents && (
        <Card>
          <CardContent className="p-6 space-y-3">
            <h2 className="text-xl font-semibold">Documents</h2>

            {Object.keys(app.documents).length === 0 && (
              <p className="text-muted-foreground">No documents uploaded.</p>
            )}

            <ul className="space-y-2">
              {Object.entries(app.documents).map(
                ([key, url]: any, index: number) => (
                  <li key={index}>
                    <a
                      href={url}
                      className="text-primary underline"
                      target="_blank"
                    >
                      View {key}
                    </a>
                  </li>
                )
              )}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Footer with Created At */}
      <p className="text-sm text-muted-foreground">
        Applied on:{" "}
        <strong>
          {new Date(app.created_at).toLocaleString()}
        </strong>
      </p>
    </div>
  );
}
