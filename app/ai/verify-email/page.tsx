import { Suspense } from "react"

import AIVerifyEmailClient from "./AIVerifyEmailClient"

function VerifyEmailLoading() {
  return (
    <main className="min-h-screen bg-[#f4f1ea] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl">
        <div className="hidden lg:flex bg-[#10243d] text-white p-12 flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-[#e3a56f] flex items-center justify-center">
                <div className="h-6 w-6 rounded-full border-2 border-[#10243d]" />
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
          <div className="w-full text-center">
            <div className="lg:hidden mb-8">
              <div className="flex items-center justify-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-[#10243d] flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full border-2 border-[#e3a56f]" />
                </div>

                <div className="text-left">
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
              <div className="h-20 w-20 rounded-full bg-[#f4f1ea] flex items-center justify-center">
                <div className="h-10 w-10 rounded-full border-4 border-[#10243d]/20 border-t-[#10243d] animate-spin" />
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
        </div>
      </div>
    </main>
  )
}

export default function AIVerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <AIVerifyEmailClient />
    </Suspense>
  )
}