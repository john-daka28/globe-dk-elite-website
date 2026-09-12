
"use client"

import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react"

import {
  FormEvent,
  useState,
} from "react"

import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState(false)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")
    setLoading(true)

    try {
      const response =
        await fetch(
          "/api/ai/auth/forgot-password",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email,
            }),
          }
        )

      const data =
        await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.error ||
            "Unable to process your request."
        )
        return
      }

      setSuccess(true)
    } catch {
      setError(
        "Something went wrong. Please check your internet connection and try again."
      )
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#f4f1ea] px-4 py-10">
        <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>

            <h1 className="text-center text-2xl font-bold text-[#10243d]">
              Check your email
            </h1>

            <p className="mt-3 text-center text-sm leading-6 text-slate-600">
              If an AI Learning Hub account
              exists with
              <span className="font-semibold text-slate-800">
                {" "}
                {email}
              </span>
              , we have sent a password
              reset link to that address.
            </p>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#b15d2b]" />

                <div>
                  <p className="text-sm font-semibold text-[#10243d]">
                    Reset link expires in
                    30 minutes
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    For your security, the
                    password reset link can
                    only be used for a limited
                    time.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/ai/signin"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#b15d2b] hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          {/* Logo / Header */}

          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#10243d]">
              <LockKeyhole className="h-8 w-8 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-[#10243d]">
              Forgot your password?
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Enter the email address you
              used for your AI Learning Hub
              account and we will send you a
              secure password reset link.
            </p>
          </div>

          {/* Error */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#10243d]"
              >
                Email address
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#b15d2b] focus:ring-2 focus:ring-[#b15d2b]/20 disabled:bg-slate-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                !email.trim()
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#10243d] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#193756] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                <>
                  <Mail className="h-5 w-5" />
                  Send reset link
                </>
              )}
            </button>
          </form>

          {/* Security information */}

          <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#b15d2b]" />

              <div>
                <p className="text-sm font-semibold text-[#10243d]">
                  Your account is protected
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  We never display whether an
                  email address is registered.
                  This helps protect AI Learning
                  Hub accounts from unauthorized
                  account discovery.
                </p>
              </div>
            </div>
          </div>

          {/* Back */}

          <div className="mt-6 text-center">
            <Link
              href="/ai/signin"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#b15d2b] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

