"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"

import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react"

export default function AISignupPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] =
    useState("")

  const [level, setLevel] =
    useState<"O-Level" | "A-Level">("O-Level")

  const [curriculum, setCurriculum] =
    useState<"ZIMSEC" | "Cambridge">("ZIMSEC")

  const [showPassword, setShowPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [emailSent, setEmailSent] = useState(false)
  const [createdEmail, setCreatedEmail] = useState("")
  const [initialCredits, setInitialCredits] = useState(5)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")
    setLoading(true)

    try {
      const response = await fetch(
        "/api/ai/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            level,
            curriculum,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(
          data.error ||
            "Unable to create your account."
        )
        return
      }

      /*
       * IMPORTANT:
       *
       * The backend/database is responsible for
       * creating the student's AI credit balance.
       *
       * The PostgreSQL trigger
       * initialize_ai_student_credits()
       * gives every new AI student 5 free credits.
       *
       * The frontend only displays the value
       * returned by the signup API.
       */

      setCreatedEmail(
        data.email || email
      )

      setInitialCredits(
        typeof data.initialCredits === "number" &&
          data.initialCredits >= 0
          ? data.initialCredits
          : 5
      )

      setEmailSent(true)

      /*
       * Clear password fields after successful
       * account creation.
       */

      setPassword("")
      setConfirmPassword("")
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  /*
   * ------------------------------------------
   * EMAIL SENT SUCCESS SCREEN
   * ------------------------------------------
   */

  if (emailSent) {
    return (
      <main className="min-h-screen bg-[#f4f1ea] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl">

          <div className="hidden lg:flex bg-[#10243d] text-white p-12 flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-[#e3a56f] flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-[#10243d]" />
                </div>

                <div>
                  <p className="font-bold text-lg">
                    GlobeDk
                  </p>

                  <p className="text-sm text-white/70">
                    AI Learning Hub
                  </p>
                </div>
              </div>

              <div className="mt-20">
                <h1 className="text-4xl font-bold leading-tight">
                  One step
                  <br />
                  away.
                </h1>

                <p className="mt-6 text-white/70 leading-7">
                  Confirm your email address to
                  activate your GlobeDk AI Learning
                  Hub account.
                </p>
              </div>
            </div>

            <p className="text-sm text-white/50">
              GlobeDk Elite Academy
              <br />
              Excellence in Education. Success for Life.
            </p>
          </div>

          <div className="p-6 sm:p-10 lg:p-12 flex items-center">
            <div className="w-full">

              <div className="lg:hidden mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-[#10243d] flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-[#e3a56f]" />
                  </div>

                  <div>
                    <p className="font-bold text-lg text-[#10243d]">
                      GlobeDk
                    </p>

                    <p className="text-sm text-gray-500">
                      AI Learning Hub
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-3xl font-bold text-[#10243d]">
                  Check your email
                </h2>

                <p className="mt-3 text-gray-500 leading-7">
                  Your GlobeDk AI Learning Hub account
                  has been created successfully.
                </p>

                <div className="mt-6 rounded-2xl border border-[#e3a56f]/40 bg-[#f4f1ea] p-5">
                  <Mail className="h-7 w-7 text-[#10243d] mx-auto mb-3" />

                  <p className="text-sm text-gray-600">
                    We sent a confirmation email to:
                  </p>

                  <p className="mt-1 font-semibold text-[#10243d] break-all">
                    {createdEmail}
                  </p>
                </div>

                {/* ------------------------------------------
                    FREE AI CREDITS
                   ------------------------------------------ */}

                <div className="mt-4 rounded-2xl border border-[#10243d]/10 bg-[#10243d] p-5 text-white">
                  <p className="text-sm text-white/70">
                    Your account starts with
                  </p>

                  <p className="mt-1 text-3xl font-bold text-[#e3a56f]">
                    {initialCredits} Free AI Credits
                  </p>

                  <p className="mt-2 text-xs text-white/60 leading-5">
                    These credits can be used for
                    AI Learning Hub features such as
                    exam predictions and mock tests.
                  </p>
                </div>

                <p className="mt-6 text-sm text-gray-500 leading-6">
                  Open the email and click
                  <span className="font-semibold text-[#10243d]">
                    {" "}“Confirm My Email”{" "}
                  </span>
                  to verify your account.
                </p>

                <p className="mt-3 text-xs text-gray-400">
                  The confirmation link expires in
                  24 hours.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <Link
                  href="/ai/signin"
                  className="w-full rounded-xl bg-[#10243d] text-white py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-[#183452] transition"
                >
                  Go to sign in
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <Link
                  href="/ai/verify-email"
                  className="w-full rounded-xl border border-gray-200 text-[#10243d] py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                >
                  Already clicked the email?
                </Link>
              </div>

              <p className="text-center text-xs text-gray-400 mt-7">
                If you do not see the email, check
                your spam or junk folder.
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl">

        <div className="hidden lg:flex bg-[#10243d] text-white p-12 flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-[#e3a56f] flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-[#10243d]" />
              </div>

              <div>
                <p className="font-bold text-lg">
                  GlobeDk
                </p>

                <p className="text-sm text-white/70">
                  AI Learning Hub
                </p>
              </div>
            </div>

            <div className="mt-20">
              <h1 className="text-4xl font-bold leading-tight">
                Learn smarter.
                <br />
                Practise better.
              </h1>

              <p className="mt-6 text-white/70 leading-7">
                Create your AI Learning Hub account
                and access personalised exam
                preparation tools.
              </p>

              {/* ------------------------------------------
                  FREE CREDITS MESSAGE
                 ------------------------------------------ */}

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-white/60">
                  New AI Learning Hub accounts receive
                </p>

                <p className="mt-1 text-2xl font-bold text-[#e3a56f]">
                  5 Free AI Credits
                </p>

                <p className="mt-2 text-sm text-white/60 leading-6">
                  Use your free credits to explore
                  AI-powered exam preparation tools.
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/50">
            GlobeDk Elite Academy
            <br />
            Excellence in Education. Success for Life.
          </p>
        </div>

        <div className="p-6 sm:p-10 lg:p-12">

          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-[#10243d] flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-[#e3a56f]" />
              </div>

              <div>
                <p className="font-bold text-lg text-[#10243d]">
                  GlobeDk
                </p>

                <p className="text-sm text-gray-500">
                  AI Learning Hub
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#10243d]">
              Create your account
            </h2>

            <p className="mt-2 text-gray-500">
              Join the GlobeDk AI Learning Hub.
            </p>

            {/* ------------------------------------------
                FREE CREDIT NOTICE
               ------------------------------------------ */}

            <div className="mt-4 rounded-xl border border-[#e3a56f]/40 bg-[#f4f1ea] px-4 py-3">
              <p className="text-sm text-[#10243d]">
                <span className="font-bold">
                  Get 5 free AI credits
                </span>{" "}
                when you create your account.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First name
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                  <input
                    required
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(e.target.value)
                    }
                    placeholder="First name"
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:border-[#10243d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last name
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                  <input
                    required
                    value={lastName}
                    onChange={(e) =>
                      setLastName(e.target.value)
                    }
                    placeholder="Last name"
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:border-[#10243d]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:border-[#10243d]"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>

                <select
                  value={level}
                  onChange={(e) =>
                    setLevel(
                      e.target.value as
                        | "O-Level"
                        | "A-Level"
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#10243d]"
                >
                  <option value="O-Level">
                    O-Level
                  </option>

                  <option value="A-Level">
                    A-Level
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Curriculum
                </label>

                <select
                  value={curriculum}
                  onChange={(e) =>
                    setCurriculum(
                      e.target.value as
                        | "ZIMSEC"
                        | "Cambridge"
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#10243d]"
                >
                  <option value="ZIMSEC">
                    ZIMSEC
                  </option>

                  <option value="Cambridge">
                    Cambridge
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                <input
                  required
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-12 py-3 outline-none focus:border-[#10243d]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                <input
                  required
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Repeat your password"
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-12 py-3 outline-none focus:border-[#10243d]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#10243d] text-white py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-[#183452] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create AI account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-7">
            Already have an AI Learning Hub account?{" "}

            <Link
              href="/ai/signin"
              className="font-semibold text-[#10243d] hover:underline"
            >
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-gray-400 mt-5">
            This account is separate from your
            GlobeDk Elite Academy enrolled-student
            account.
          </p>
        </div>
      </div>
    </main>
  )
}