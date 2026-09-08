"use client"

import {
  FormEvent,
  useEffect,
  useState,
} from "react"

import {
  useRouter,
  useSearchParams,
} from "next/navigation"

import {
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
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
import { Badge } from "@/components/ui/badge"

export default function TutorActivationPage() {
  const router =
    useRouter()

  const searchParams =
    useSearchParams()

  const token =
    searchParams.get(
      "token"
    )

  const [
    password,
    setPassword,
  ] = useState("")

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
  ] = useState(false)

  useEffect(() => {
    if (!token) {
      setError(
        "This invitation link is missing its security token."
      )
    }
  }, [token])

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault()

    setError("")

    if (!token) {
      setError(
        "This invitation link is invalid."
      )
      return
    }

    if (
      password.length < 8
    ) {
      setError(
        "Your password must contain at least 8 characters."
      )
      return
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "The passwords do not match."
      )
      return
    }

    try {
      setLoading(true)

      const response =
        await fetch(
          "/api/tutor/activate",
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

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to activate your account."
        )
      }

      setSuccess(true)

      setTimeout(() => {
        router.replace(
          "/tutor"
        )
        router.refresh()
      }, 1000)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <GraduationCap className="h-7 w-7" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight">
              GlobeDK Elite Academy
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Excellence in Education. Success for Life.
            </p>
          </div>

          <Card className="border-border/70 shadow-xl">
            <CardHeader className="space-y-4">
              <div>
                <Badge
                  variant="secondary"
                  className="gap-1"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure Tutor Activation
                </Badge>
              </div>

              <div>
                <CardTitle className="text-2xl">
                  Set up your account
                </CardTitle>

                <CardDescription className="mt-2">
                  Your GlobeDK tutor account has
                  been created. Create a password
                  to secure your account.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              {success ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>

                  <h2 className="text-lg font-semibold">
                    Account activated
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Your secure tutor session has
                    been created. Redirecting you
                    to your dashboard...
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={
                    handleSubmit
                  }
                  className="space-y-5"
                >
                  {error && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium"
                    >
                      Create password
                    </label>

                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

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
                        className="pl-10 pr-10"
                        placeholder="At least 8 characters"
                        autoComplete="new-password"
                        disabled={
                          loading
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (value) =>
                              !value
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
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
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium"
                    >
                      Confirm password
                    </label>

                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

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
                        className="pl-10 pr-10"
                        placeholder="Enter the password again"
                        autoComplete="new-password"
                        disabled={
                          loading
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (value) =>
                              !value
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/60 p-4 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">
                      Your account security
                    </p>

                    <ul className="mt-2 space-y-1">
                      <li>
                        • Use at least 8 characters.
                      </li>
                      <li>
                        • Never share your password.
                      </li>
                      <li>
                        • Your invitation can only be
                        used once.
                      </li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      loading ||
                      !token
                    }
                  >
                    {loading
                      ? "Activating account..."
                      : "Activate Tutor Account"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            GlobeDK Elite Academy • Secure Tutor Portal
          </p>
        </div>
      </div>
    </main>
  )
}