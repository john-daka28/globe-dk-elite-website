"use client"

import Link from "next/link"
import {
  Award,
  BookOpen,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Settings,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TutorProfilePage() {
  const subjects = [
    "Mathematics",
    "Computer Science",
    "Statistics",
  ]

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

          <Button variant="outline" asChild>
            <Link href="/tutor/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-8">
        <Badge className="mb-3">Tutor Account</Badge>

        <h1 className="text-3xl font-bold">My Profile</h1>

        <p className="mt-2 text-muted-foreground">
          Your professional information and teaching profile.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col items-center p-8 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <User className="h-12 w-12 text-primary" />
              </div>

              <h2 className="mt-5 text-xl font-bold">Mr Daka</h2>

              <p className="text-sm text-muted-foreground">
                Mathematics Tutor
              </p>

              <Badge className="mt-4">Active Tutor</Badge>

              <div className="mt-6 w-full space-y-3 text-left">
                <div className="flex gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">tutor@example.com</span>
                </div>

                <div className="flex gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">+263 77 000 0000</span>
                </div>

                <div className="flex gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Harare, Zimbabwe</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>
                  Your teaching information within GlobeDK Elite Academy.
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="mt-1 font-medium">Mr Daka</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="mt-1 font-medium">Tutor</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Tutor ID</p>
                  <p className="mt-1 font-medium">TUTOR-001</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Academic Year
                  </p>
                  <p className="mt-1 font-medium">2026</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subjects I Teach</CardTitle>
                <CardDescription>
                  Subjects currently assigned to your tutor account.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  {subjects.map((subject) => (
                    <div
                      key={subject}
                      className="rounded-lg border p-4"
                    >
                      <BookOpen className="h-5 w-5 text-primary" />
                      <p className="mt-3 font-medium">{subject}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Teaching Summary</CardTitle>
              </CardHeader>

              <CardContent className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">
                    Students
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">
                    Classes
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <Award className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">
                    Assessments
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button asChild>
              <Link href="/tutor/settings">
                <Settings className="mr-2 h-4 w-4" />
                Edit Account Settings
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </main>
  )
}