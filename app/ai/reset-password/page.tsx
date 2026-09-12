"use client"

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react"

import {
  FormEvent,
  useState,
} from "react"

import {
  useRouter,
  useSearchParams,
} from "next/navigation"

import Link from "next/link"

import {
  Button,
} from "@/components/ui/button"

import {
  Input,
} from "@/components/ui/input"

import {
  Label,
} from "@/components/ui/label"

export default function ResetPasswordPage() {
  const router = useRouter()

  const searchParams =
    useSearchParams()

  const token =
    searchParams.get("token") || ""

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

  // ------------------------------------------
  // PASSWORD STRENGTH
  // ------------------------------------------

  const passwordLength =
    password.length >= 8

  const hasNumber =
    /\d/.test(password)

  const hasUppercase =
    /[A-Z]/.test(password)

  const passwordsMatch =
    password.length > 0 &&
    password === confirmPassword

  // ------------------------------------------
  // SUBMIT
  // ------------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")

    if (!token) {
      setError(
        "This password reset link is invalid or missing. Please request a new password reset link."
      )
      return
    }

    if (!password) {
      setError(
        "Please enter a new password."
      )
      return
    }

    if (password.length < 8) {
      setError(
        "Your password must be at least 8 characters long."
      )
      return
    }

    if (password !== confirmPassword) {
      setError(
        "The passwords do not match."
      )
      return
    }

    setLoading(true)

    try {
      const response =
        await fetch(
          "/api/ai/auth/reset-password",
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
          data.error ||
            "Unable to reset your password. Please try again."
        )
        return
      }

      setSuccess(true)

      // Give the user a moment to see
      // the successful reset message.
      setTimeout(() => {
        router.push(
          "/ai/signin?reset=success"
        )
      }, 2200)
    } catch (error) {
      console.error(
        "Reset password request error:",
        error
      )

      setError(
        "Unable to connect to the server. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  // ------------------------------------------
  // SUCCESS SCREEN
  // ------------------------------------------

  if (success) {
    return (
      <main className="min-h-screen bg-[#f4f1ea] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#10243d] text-[#e3a56f] mb-4">
              <GraduationCap
                className="w-7 h-7"
              />
            </div>

            <h1 className="text-2xl font-bold text-[#10243d]">
              GlobeDk AI Learning Hub
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#10243d]/10 p-8 text-center">

            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-5">
              <CheckCircle2
                className="w-9 h-9 text-green-600"
              />
            </div>

            <h2 className="text-2xl font-bold text-[#10243d]">
              Password reset successful
            </h2>

            <p className="mt-3 text-gray-600 leading-7">
              Your password has been
              changed successfully.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Redirecting you to the
              sign-in page...
            </p>

            <div className="mt-6 flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-[#10243d]" />
            </div>

          </div>

        </div>
      </main>
    )
  }

  // ------------------------------------------
  // RESET FORM
  // ------------------------------------------

  return (
    <main className="min-h-screen bg-[#f4f1ea] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* BRAND */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#10243d] text-[#e3a56f] mb-4">
            <GraduationCap
              className="w-7 h-7"
            />
          </div>

          <h1 className="text-2xl font-bold text-[#10243d]">
            GlobeDk AI Learning Hub
          </h1>

          <p className="mt-2 text-gray-600">
            Learn smarter. Practise better.
          </p>

        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#10243d]/10 p-6 sm:p-8">

          <div className="mb-7">

            <div className="flex items-center gap-3 mb-3">

              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#f4f1ea] text-[#10243d]">
                <Lock
                  className="w-5 h-5"
                />
              </div>

              <h2 className="text-xl font-bold text-[#10243d]">
                Create a new password
              </h2>

            </div>

            <p className="text-sm text-gray-600 leading-6">
              Enter a new password for your
              AI Learning Hub account.
            </p>

          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />

              <p className="leading-6">
                {error}
              </p>

            </div>
          )}

          {!token && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <p className="leading-6">
                This page requires a valid password
                reset link. Please request a new
                reset link.
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* PASSWORD */}
            <div className="space-y-2">

              <Label
                htmlFor="password"
                className="text-[#10243d] font-medium"
              >
                New password
              </Label>

              <div className="relative">

                <Input
                  id="password"
                  name="password"
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
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="h-11 pr-11"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#10243d]"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-2">

              <Label
                htmlFor="confirmPassword"
                className="text-[#10243d] font-medium"
              >
                Confirm new password
              </Label>

              <div className="relative">

                <Input
                  id="confirmPassword"
                  name="confirmPassword"
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
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="h-11 pr-11"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (value) => !value
                    )
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#10243d]"
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>

              </div>

            </div>

            {/* PASSWORD REQUIREMENTS */}
            <div className="rounded-xl bg-[#f4f1ea]/70 p-4">

              <p className="text-sm font-semibold text-[#10243d] mb-3">
                Password requirements
              </p>

              <div className="space-y-2 text-sm">

                <Requirement
                  valid={passwordLength}
                  text="At least 8 characters"
                />

                <Requirement
                  valid={hasNumber}
                  text="Contains a number"
                />

                <Requirement
                  valid={hasUppercase}
                  text="Contains an uppercase letter"
                />

                <Requirement
                  valid={passwordsMatch}
                  text="Passwords match"
                />

              </div>

            </div>

            {/* SUBMIT */}
            <Button
              type="submit"
              disabled={
                loading ||
                !token
              }
              className="w-full h-11 bg-[#10243d] hover:bg-[#10243d]/90 text-white"
            >

              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resetting password...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Reset Password
                </>
              )}

            </Button>

          </form>

          {/* BACK */}
          <div className="mt-7 pt-6 border-t border-gray-100 text-center">

            <Link
              href="/ai/signin"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#10243d] hover:text-[#b15d2b]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>

          </div>

        </div>

        {/* EXPIRY */}
        <p className="text-center text-xs text-gray-500 mt-5">
          Password reset links expire after
          30 minutes for your security.
        </p>

      </div>

    </main>
  )
}

// ------------------------------------------
// PASSWORD REQUIREMENT COMPONENT
// ------------------------------------------

function Requirement({
  valid,
  text,
}: {
  valid: boolean
  text: string
}) {
  return (
    <div className="flex items-center gap-2">

      <CheckCircle2
        className={`w-4 h-4 ${
          valid
            ? "text-green-600"
            : "text-gray-300"
        }`}
      />

      <span
        className={
          valid
            ? "text-green-700"
            : "text-gray-500"
        }
      >
        {text}
      </span>

    </div>
  )
}