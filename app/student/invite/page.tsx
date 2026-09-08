"use client"

import { useEffect, useState } from "react"

import { useRouter, useSearchParams } from "next/navigation"

import {
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { Badge } from "@/components/ui/badge"

export default function StudentInvitationPage() {
  const router =
    useRouter()

  const searchParams =
    useSearchParams()

  const token =
    searchParams.get(
      "token"
    )

  const [loading, setLoading] =
    useState(true)

  const [submitting, setSubmitting] =
    useState(false)

  const [valid, setValid] =
    useState(false)

  const [error, setError] =
    useState("")

  const [student, setStudent] =
    useState<{
      firstName: string
      lastName: string
      email: string
      level: string
      school: string
    } | null>(null)

  const [password, setPassword] =
    useState("")

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("")

  const [
    showPassword,
    setShowPassword,
  ] = useState(false)

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false)

  useEffect(() => {
    async function validateInvitation() {
      if (!token) {
        setError(
          "This invitation link is incomplete."
        )

        setLoading(false)

        return
      }

      try {
        const response =
          await fetch(
            "/api/student/invitation/validate",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                token,
              }),
            }
          )

        const data =
          await response.json()

        if (!response.ok || !data.valid) {
          setError(
            data.message ||
              "This invitation is invalid or expired."
          )

          setLoading(false)

          return
        }

        setStudent(
          data.student
        )

        setValid(true)

        setLoading(false)
      } catch {
        setError(
          "Unable to validate your invitation. Please try again."
        )

        setLoading(false)
      }
    }

    validateInvitation()
  }, [token])

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault()

    setError("")

    if (!token) {
      setError(
        "Invitation token is missing."
      )

      return
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      )

      return
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      )

      return
    }

    setSubmitting(true)

    try {
      const response =
        await fetch(
          "/api/student/invitation/accept",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              token,
              password,
              confirmPassword,
            }),
          }
        )

      const data =
        await response.json()

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Unable to complete your registration."
        )

        setSubmitting(false)

        return
      }

      router.push(
        data.redirectTo ||
          "/student/dashboard"
      )
    } catch {
      setError(
        "Something went wrong. Please try again."
      )

      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <div className="flex flex-col items-center text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />

          <p className="mt-4 font-medium">
            Validating your invitation...
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please wait.
          </p>
        </div>
      </main>
    )
  }

  if (!valid || !student) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <ShieldCheck className="h-7 w-7 text-destructive" />
            </div>

            <CardTitle className="mt-4">
              Invitation unavailable
            </CardTitle>

            <CardDescription>
              We could not use this invitation.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>

            <Button
              className="mt-5 w-full"
              onClick={() =>
                router.push("/login")
              }
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-lg">

        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>

          <div>
            <p className="font-bold">
              GlobeDK Elite Academy
            </p>

            <p className="text-xs text-muted-foreground">
              Student Portal
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <Badge className="mb-3 w-fit">
              Student Invitation
            </Badge>

            <CardTitle className="text-2xl">
              Welcome, {student.firstName}!
            </CardTitle>

            <CardDescription>
              Your tutor has created your
              GlobeDK Elite Academy student
              account.
            </CardDescription>
          </CardHeader>

          <CardContent>

            <div className="mb-6 rounded-xl border bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    {student.firstName}{" "}
                    {student.lastName}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {student.email}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Level
                  </p>

                  <p className="text-sm font-medium">
                    {student.level}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    School
                  </p>

                  <p className="text-sm font-medium">
                    {student.school}
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-5 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <div className="space-y-2">
                <Label htmlFor="password">
                  Create Password
                </Label>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="At least 8 characters"
                    className="pl-9 pr-10"
                    disabled={submitting}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3 top-2.5 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password
                </Label>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      confirmPassword
                    }
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    placeholder="Enter your password again"
                    className="pl-9 pr-10"
                    disabled={submitting}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-2.5 text-muted-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                Your password will be used for
                future GlobeDK Elite Academy
                logins. Keep it private and do
                not share it with anyone.
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Complete My Registration
                  </>
                )}
              </Button>

            </form>
          </CardContent>
        </Card>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          GlobeDK Elite Academy · Excellence in
          Education. Success for Life.
        </p>
      </div>
    </main>
  )
}