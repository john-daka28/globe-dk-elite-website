"use client"

import {
  useState,
} from "react"

import {
  useRouter,
  useSearchParams,
} from "next/navigation"

import {
  Button,
} from "@/components/ui/button"

import {
  Input,
} from "@/components/ui/input"

import {
  Label,
} from "@/components/ui/label"

import {
  GraduationCap,
} from "lucide-react"

export default function StudentActivationPage() {
  const router =
    useRouter()

  const searchParams =
    useSearchParams()

  const token =
    searchParams.get(
      "token"
    ) || ""

  const [
    password,
    setPassword,
  ] = useState("")

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("")

  const [
    loading,
    setLoading,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState("")

  const [
    success,
    setSuccess,
  ] = useState("")

  const handleSubmit =
    async (
      event: React.FormEvent
    ) => {
      event.preventDefault()

      setError("")
      setSuccess("")

      if (!token) {
        setError(
          "Your activation link is missing a valid token."
        )
        return
      }

      if (
        password.length < 8
      ) {
        setError(
          "Password must contain at least 8 characters."
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

      try {
        setLoading(true)

        const response =
          await fetch(
            "/api/student/activate",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              credentials:
                "include",

              body:
                JSON.stringify({
                  token,
                  password,
                  confirmPassword,
                }),
            }
          )

        const data =
          await response.json()

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to activate your account."
          )
        }

        setSuccess(
          data.message ||
            "Account activated successfully."
        )

        setTimeout(() => {
          router.push(
            data.redirect ||
              "/student"
          )

          router.refresh()
        }, 800)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to activate your account."
        )
      } finally {
        setLoading(false)
      }
    }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">

      <div className="w-full max-w-md">

        <div className="rounded-2xl border bg-background p-6 shadow-lg sm:p-8">

          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <GraduationCap className="h-7 w-7" />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Activate Your Student Account
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Create a password to access your
              GlobeDK Elite student portal.
            </p>

          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="mt-8 space-y-5"
          >

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
                {success}
              </div>
            )}

            <div className="space-y-2">

              <Label htmlFor="password">
                Create Password
              </Label>

              <Input
                id="password"
                type="password"
                value={
                  password
                }
                onChange={(
                  event
                ) =>
                  setPassword(
                    event.target
                      .value
                  )
                }
                placeholder="At least 8 characters"
                disabled={
                  loading
                }
                autoComplete="new-password"
              />

            </div>

            <div className="space-y-2">

              <Label htmlFor="confirm-password">
                Confirm Password
              </Label>

              <Input
                id="confirm-password"
                type="password"
                value={
                  confirmPassword
                }
                onChange={(
                  event
                ) =>
                  setConfirmPassword(
                    event.target
                      .value
                  )
                }
                placeholder="Enter your password again"
                disabled={
                  loading
                }
                autoComplete="new-password"
              />

            </div>

            <div className="rounded-xl border bg-muted/40 p-4">
              <p className="text-xs leading-5 text-muted-foreground">
                Your password must contain at
                least 8 characters. Keep it private
                and do not share it with anyone.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                loading
              }
            >
              {loading
                ? "Activating Account..."
                : "Activate Account"}
            </Button>

          </form>

        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          GlobeDK Elite Academy
          <br />
          Excellence in Education. Success for Life.
        </p>

      </div>

    </main>
  )
}