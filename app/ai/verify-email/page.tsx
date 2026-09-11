"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import {
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Mail,
  RefreshCw,
} from "lucide-react"

export default function AIVerifyEmailPage() {
  const searchParams = useSearchParams()

  const token =
    searchParams.get("token") || ""

  const email =
    searchParams.get("email") || ""

  const [loading, setLoading] =
    useState(true)

  const [verified, setVerified] =
    useState(false)

  const [alreadyVerified, setAlreadyVerified] =
    useState(false)

  const [error, setError] =
    useState("")

  const [resending, setResending] =
    useState(false)

  const [resendMessage, setResendMessage] =
    useState("")

  useEffect(() => {
    /*
     * If there is no token, this page is being
     * opened manually rather than through the
     * confirmation email.
     */
    if (!token) {
      setLoading(false)
      return
    }

    async function verifyEmail() {
      try {
        const response = await fetch(
          "/api/ai/auth/verify-email",
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

        if (
          !response.ok ||
          !data.success
        ) {
          setError(
            data.error ||
              "Unable to verify your email."
          )
          return
        }

        setVerified(true)

        if (
          data.alreadyVerified
        ) {
          setAlreadyVerified(true)
        }
      } catch {
        setError(
          "Unable to connect to the server. Please try again."
        )
      } finally {
        setLoading(false)
      }
    }

    verifyEmail()
  }, [token])

  async function handleResend() {
    if (!email) {
      setError(
        "Please enter your email address on the sign-up page or sign-in page to request a new confirmation email."
      )
      return
    }

    setError("")
    setResendMessage("")
    setResending(true)

    try {
      const response =
        await fetch(
          "/api/ai/auth/resend-verification",
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
            "Unable to resend the confirmation email."
        )
        return
      }

      setResendMessage(
        "A new confirmation email has been sent. Please check your inbox."
      )
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      )
    } finally {
      setResending(false)
    }
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
                Confirm your
                <br />
                email.
              </h1>

              <p className="mt-6 text-white/70 leading-7">
                Email confirmation helps protect
                your GlobeDk AI Learning Hub account.
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

            {loading && (
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-[#f4f1ea] flex items-center justify-center">
                    <Loader2 className="h-10 w-10 text-[#10243d] animate-spin" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-[#10243d]">
                  Confirming your email
                </h2>

                <p className="mt-3 text-gray-500">
                  Please wait while we verify your
                  email address.
                </p>
              </div>
            )}

            {!loading &&
              verified && (
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center">
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold text-[#10243d]">
                    {alreadyVerified
                      ? "Email already verified"
                      : "Email confirmed!"}
                  </h2>

                  <p className="mt-4 text-gray-500 leading-7">
                    {alreadyVerified
                      ? "Your email address has already been confirmed."
                      : "Your GlobeDk AI Learning Hub email address has been successfully confirmed."}
                  </p>

                  <div className="mt-7 rounded-2xl border border-green-200 bg-green-50 p-5">
                    <Mail className="h-7 w-7 text-green-600 mx-auto mb-3" />

                    <p className="text-sm text-green-800">
                      Your account is now ready.
                    </p>

                    <p className="text-sm text-green-700 mt-1">
                      Sign in with your email and
                      password to continue.
                    </p>
                  </div>

                  <Link
                    href="/ai/signin"
                    className="mt-7 w-full rounded-xl bg-[#10243d] text-white py-3.5 font-semibold flex items-center justify-center hover:bg-[#183452] transition"
                  >
                    Continue to sign in
                  </Link>
                </div>
              )}

            {!loading &&
              !verified &&
              !token && (
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="h-20 w-20 rounded-full bg-[#f4f1ea] flex items-center justify-center">
                      <Mail className="h-10 w-10 text-[#10243d]" />
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold text-[#10243d]">
                    Confirm your email
                  </h2>

                  <p className="mt-4 text-gray-500 leading-7">
                    Open the confirmation email sent
                    to you and click the
                    <strong>
                      {" "}Confirm My Email{" "}
                    </strong>
                    button.
                  </p>

                  <div className="mt-7">
                    <Link
                      href="/ai/signin"
                      className="w-full rounded-xl bg-[#10243d] text-white py-3.5 font-semibold flex items-center justify-center hover:bg-[#183452] transition"
                    >
                      Go to sign in
                    </Link>
                  </div>
                </div>
              )}

            {!loading &&
              error && (
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center">
                      <AlertCircle className="h-10 w-10 text-red-500" />
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold text-[#10243d]">
                    Verification failed
                  </h2>

                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 text-left">
                    {error}
                  </div>

                  {email && (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resending}
                      className="mt-6 w-full rounded-xl border border-[#10243d] text-[#10243d] py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-60"
                    >
                      {resending ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-5 w-5" />
                          Send new confirmation email
                        </>
                      )}
                    </button>
                  )}

                  {resendMessage && (
                    <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                      {resendMessage}
                    </div>
                  )}

                  <Link
                    href="/ai/signup"
                    className="mt-4 block text-sm font-semibold text-[#10243d] hover:underline"
                  >
                    Back to create account
                  </Link>
                </div>
              )}
          </div>
        </div>
      </div>
    </main>
  )
}