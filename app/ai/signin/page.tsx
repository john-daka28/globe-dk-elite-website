
"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
} from "lucide-react"

export default function AISigninPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [showPassword, setShowPassword] =
    useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault()

  setError("")
  setLoading(true)

  try {
    const response = await fetch(
      "/api/ai/auth/signin",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          email,
          password,
        }),
      }
    )

    const data =
      await response.json()

    // ------------------------------------------
    // EMAIL NOT VERIFIED
    // ------------------------------------------

    if (
      response.status === 403 &&
      data.requiresEmailVerification
    ) {
      setError(
        "Please confirm your email address before signing in."
      )

      return
    }

    // ------------------------------------------
    // OTHER LOGIN ERRORS
    // ------------------------------------------

    if (
      !response.ok ||
      !data.success
    ) {
      setError(
        data.error ||
          "Unable to sign in."
      )

      return
    }

    // ------------------------------------------
    // LOGIN SUCCESS
    // ------------------------------------------
    //
    // The API has now created:
    //
    // globedk_ai_session
    //
    // Therefore we can safely enter
    // the AI dashboard.
    // ------------------------------------------

    router.push("/ai")
    router.refresh()

  } catch (error) {
    console.error(
      "AI sign in error:",
      error
    )

    setError(
      "Unable to connect to the server. Please try again."
    )
  } finally {
    setLoading(false)
  }
}

  return (
    <main className="min-h-screen bg-[#f4f1ea] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl">

        {/* =====================================================
            LEFT PANEL
        ===================================================== */}

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
                Prepare with
                <br />
                confidence.
              </h1>

              <p className="mt-6 text-white/70 leading-7">
                Use AI-powered exam preparation,
                practice and personalised learning
                tools from GlobeDk.
              </p>

            </div>

          </div>

          <p className="text-sm text-white/50">
            GlobeDk Elite Academy
          </p>

        </div>

        {/* =====================================================
            RIGHT PANEL
        ===================================================== */}

        <div className="p-6 sm:p-10 lg:p-16 flex flex-col justify-center">

          {/* Mobile logo */}

          <div className="lg:hidden mb-10">

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
              Welcome back
            </h2>

            <p className="mt-2 text-gray-500">
              Sign in to continue learning.
            </p>

          </div>

          {error && (

            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

              {error}

              {error.includes(
                "confirm your email"
              ) && (

                <div className="mt-3">

                  <Link
                    href="/ai/verify-email"
                    className="font-bold underline"
                  >
                    Verify your email
                  </Link>

                </div>

              )}

            </div>

          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* EMAIL */}

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
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3.5 outline-none focus:border-[#10243d]"
                />

              </div>

            </div>

            {/* PASSWORD */}

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
                  placeholder="Your password"
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-12 py-3.5 outline-none focus:border-[#10243d]"
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

            {/* FORGOT PASSWORD */}

            <div className="flex justify-end">

              <Link
                href="/ai/forgot-password"
                className="text-sm font-medium text-[#10243d] hover:underline"
              >
                Forgot password?
              </Link>

            </div>

            {/* SIGN IN */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#10243d] text-white py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-[#183452] disabled:opacity-60"
            >

              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-5 w-5" />
                </>
              )}

            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-7">

            Don't have an AI Learning Hub account?{" "}

            <Link
              href="/ai/signup"
              className="font-semibold text-[#10243d] hover:underline"
            >
              Create account
            </Link>

          </p>

          <p className="text-center text-xs text-gray-400 mt-5">

            This login is for the GlobeDk AI Learning
            Hub and is separate from the enrolled
            GlobeDk student portal.

          </p>

        </div>

      </div>

    </main>
  )
}
