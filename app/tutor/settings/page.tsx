"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Bell,
  GraduationCap,
  Lock,
  LogOut,
  Save,
  Settings as SettingsIcon,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function TutorSettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)

  return (
    <main className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/tutor/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold">GlobeDK Elite</p>
              <p className="text-[11px] text-muted-foreground">
                Tutor Portal
              </p>
            </div>
          </Link>

          <SettingsIcon className="h-5 w-5 text-muted-foreground" />
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <Badge className="mb-3">Account Settings</Badge>

        <h1 className="text-3xl font-bold">Settings</h1>

        <p className="mt-2 text-muted-foreground">
          Manage your tutor account and portal preferences.
        </p>

        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Basic information associated with your tutor account.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input className="mt-2" defaultValue="Mr Daka" />
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  className="mt-2"
                  type="email"
                  defaultValue="tutor@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Role</label>
                <Input className="mt-2" value="Tutor" readOnly />
              </div>

              <div>
                <label className="text-sm font-medium">Employee ID</label>
                <Input className="mt-2" defaultValue="TUTOR-001" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Choose which updates you receive.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <label className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex gap-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Portal Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Receive important academy notifications.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex gap-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Receive messages and reminders by email.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Protect your tutor account.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button variant="outline">
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>

              <Button variant="outline" className="ml-2">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </main>
    </main>
  )
}