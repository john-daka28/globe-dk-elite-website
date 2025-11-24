"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminSettings() {
  const [adminName, setAdminName] = useState("Administrator");
  const [adminEmail, setAdminEmail] = useState("admin@globedk.com");

  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");

  const [lessonLocation, setLessonLocation] = useState("Epworth, Harare");
  const [maxClassSize, setMaxClassSize] = useState("20");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r shadow-sm fixed h-full p-6 space-y-6">
        <h2 className="text-2xl font-bold text-primary">ADMIN PANEL</h2>

        <nav className="space-y-3">
          <a href="/admin/dashboard" className="block p-3 rounded hover:bg-gray-100">
            Dashboard
          </a>

          <a href="/admin/applicants" className="block p-3 rounded hover:bg-gray-100">
            Applicants
          </a>
            <a href="/admin/subjects" className="block p-3 rounded hover:bg-gray-100">  
            Subjects
          </a>
          <a href="/admin/settings" className="block p-3 rounded bg-primary text-white">
            Settings
          </a>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8">

        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-gray-500 mb-8">
          Manage administrator settings, system configuration, and security.
        </p>

        <div className="grid md:grid-cols-2 gap-8">

          {/* ADMIN PROFILE */}
          <Card className="shadow">
            <CardHeader>
              <CardTitle>Admin Profile</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input value={adminName} onChange={(e) => setAdminName(e.target.value)} />
              </div>

              <div>
                <Label>Email</Label>
                <Input value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
              </div>

              <Button className="w-full mt-3">Save Profile</Button>
            </CardContent>
          </Card>

          {/* SMTP SETTINGS */}
          <Card className="shadow">
            <CardHeader>
              <CardTitle>Email / SMTP Settings</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <Label>SMTP Host</Label>
                <Input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} />
              </div>

              <div>
                <Label>SMTP Username</Label>
                <Input value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} />
              </div>

              <div>
                <Label>SMTP Password</Label>
                <Input
                  type="password"
                  value={smtpPass}
                  onChange={(e) => setSmtpPass(e.target.value)}
                />
              </div>

              <Button className="w-full mt-3">Save Email Settings</Button>
            </CardContent>
          </Card>

          {/* LESSON SETTINGS */}
          <Card className="shadow">
            <CardHeader>
              <CardTitle>Lesson Configuration</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <Label>Lesson Location</Label>
                <Input
                  value={lessonLocation}
                  onChange={(e) => setLessonLocation(e.target.value)}
                />
              </div>

              <div>
                <Label>Max Class Size</Label>
                <Input
                  value={maxClassSize}
                  onChange={(e) => setMaxClassSize(e.target.value)}
                />
              </div>

              <Button className="w-full mt-3">Save Lesson Settings</Button>
            </CardContent>
          </Card>

          {/* SECURITY SETTINGS */}
          <Card className="shadow">
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <Label>Old Password</Label>
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>

              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button className="w-full mt-3" variant="destructive">
                Update Password
              </Button>
            </CardContent>
          </Card>
        </div>

        <hr className="my-10 border-gray-300" />

        <p className="text-center text-gray-400 text-sm">
          GlobeDK Elite Admin • Powered by Next.js & Supabase
        </p>
      </main>
    </div>
  );
}
