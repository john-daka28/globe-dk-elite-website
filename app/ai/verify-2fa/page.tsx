"use client"

import {
  ArrowRight,
  GraduationCap,
  KeyRound,
  Loader2,
  Mail,
} from "lucide-react"

import {
  FormEvent,
  useEffect,
  useState,
} from "react"

import {
  useRouter,
  useSearchParams,
} from "next/navigation"

export default function AIVerify2FAPage() {
  const router = useRouter()

  const searchParams =
    useSearchParams()

  const email =
    searchParams.get("email") || ""

  const [
    code,
    setCode,
  ] = useState("")

  const [
    loading,
    setLoading,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState("")

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")

    const cleanCode =
      code.replace(
        /\D/g,
        ""
      )

    if (
      cleanCode.length !==
      6
    ) {
      setError(
        "Please enter the 6-digit verification code."
      )
      return
    }

    setLoading(true)

    try {
      const response =
        await fetch(
          "/api/ai/auth/verify-2fa",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            credentials:
              "include",
            body: JSON.stringify({
              code:
                cleanCode,
            }),
          }
        )

      const data =
        await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        if (
          data.requiresSignin
        ) {
          router.replace(
            `/ai/signin${
              email
                ? `?email=${encodeURIComponent(email)}`
                : ""
            }`
          )
          return
        }

        setError(
          data.error ||
            "Unable to verify your code."
        )

        return
      }

      // --------------------------------------
      // FULL AUTHENTICATION IS NOW COMPLETE
      // --------------------------------------

      router.replace("/ai")
      router.refresh()
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        <div className="rounded-3xl bg-white p-8 shadow-xl sm:p-10">

          <div className="flex justify-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#10243d]">
              <GraduationCap className="h-7 w-7 text-[#e3a56f]" />
            </div>

          </div>

          <div className="mt-6 text-center">

            <h1 className="text-2xl font-black text-[#10243d]">
              Two-factor authentication
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              We sent a 6-digit verification code
              to your email address.
            </p>

            {email && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#f4f1ea] px-3 py-1.5 text-xs font-semibold text-[#10243d]/70">
                <Mail className="h-3.5 w-3.5" />
                {email}
              </div>
            )}

          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            <div>

              <label className="mb-2 block text-sm font-bold text-gray-700">
                Verification code
              </label>

              <div className="relative">

                <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  required
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(event) =>
                    setCode(
                      event.target.value
                        .replace(
                          /\D/g,
                          ""
                        )
                        .slice(
                          0,
                          6
                        )
                    )
                  }
                  placeholder="000000"
                  className="w-full rounded-xl border border-gray-200 py-4 pl-12 pr-4 text-center text-2xl font-black tracking-[0.45em] text-[#10243d] outline-none transition focus:border-[#10243d] focus:ring-2 focus:ring-[#10243d]/10"
                />

              </div>

              <p className="mt-2 text-xs text-gray-400">
                The code expires after 10 minutes.
              </p>

            </div>

            <button
              type="submit"
              disabled={
                loading ||
                code.length !== 6
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#10243d] py-3.5 font-bold text-white transition hover:bg-[#183452] disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Continue
                  <ArrowRight className="h-5 w-5" />
                </>
              )}

            </button>

          </form>

          <div className="mt-7 rounded-xl bg-[#f4f1ea] p-4">

            <p className="text-xs leading-5 text-[#10243d]/60">
              <strong className="text-[#10243d]">
                Security:
              </strong>{" "}
              Your AI Learning Hub session is only
              created after this verification step
              is completed successfully.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              router.push(
                `/ai/signin${
                  email
                    ? `?email=${encodeURIComponent(email)}`
                    : ""
                }`
              )
            }
            className="mt-6 w-full text-center text-sm font-bold text-[#10243d] hover:underline"
          >
            Back to sign in
          </button>

          <p className="mt-6 text-center text-xs text-gray-400">
            GlobeDk Elite | Excellence in Education.
            Success for Life.
          </p>

        </div>

      </div>

    </main>
  )
}