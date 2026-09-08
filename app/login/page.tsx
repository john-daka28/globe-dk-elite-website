"use client"

import {
  FormEvent,
  useState,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
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

export default function LoginPage() {
  const router =
    useRouter()

  const [
    email,
    setEmail,
  ] = useState("")

  const [
    password,
    setPassword,
  ] = useState("")

  const [
    showPassword,
    setShowPassword,
  ] = useState(false)

  const [
    loading,
    setLoading,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState("")

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault()

    setError("")

    try {
      setLoading(true)

      const response =
        await fetch(
          "/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to sign in."
        )
      }

      router.replace(
        data.redirect ||
          "/"
      )

      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in."
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

            <h1 className="text-2xl font-bold">
              GlobeDK Elite Academy
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Secure Portal
            </p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>
                Sign in
              </CardTitle>

              <CardDescription>
                Access your GlobeDK account.
              </CardDescription>
            </CardHeader>

            <CardContent>
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
                    htmlFor="email"
                    className="text-sm font-medium"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value
                        )
                      }
                      className="pl-10"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium"
                  >
                    Password
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
                      placeholder="Your password"
                      autoComplete="current-password"
                      required
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
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading
                    ? "Signing in..."
                    : "Sign in"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}