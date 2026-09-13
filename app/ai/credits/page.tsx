
"use client";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  GraduationCap,
  Mail,
  MessageCircle,
  Sparkles,
  WalletCards,
  Zap,
} from "lucide-react";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AICreditsPage() {
  const router = useRouter();

  function handleWhatsAppSupport() {
    const message =
      "Hello GlobeDk Elite Academy. I am using the GlobeDk AI Learning Hub and I would like to know more about AI Credits, including how I can purchase credits, available packages, pricing and how the credit system works. Please assist me. Thank you.";

    window.open(
      `https://wa.me/263786053315?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function handleEmailSupport() {
    const subject =
      "GlobeDk AI Learning Hub - AI Credits Enquiry";

    const body =
      "Hello GlobeDk Elite Academy Admissions,\r\n\r\nI am using the GlobeDk AI Learning Hub and I would like to know more about AI Credits, including available packages, pricing, how to purchase credits and how the credit system works.\r\n\r\nPlease assist me with the available options.\r\n\r\nThank you.";

    window.open(
      `mailto:jdaka@globedk.co.zw?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      "_self",
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f1ea] text-[#10243d]">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#e3a56f]/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#b15d2b]/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-white/50 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[#10243d]/10 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/Logo.png"
              alt="GlobeDk Elite Academy"
              width={46}
              height={46}
              className="h-11 w-11 object-contain"
              priority
            />

            <div>
              <p className="text-sm font-black tracking-tight text-[#10243d]">
                GlobeDk AI
              </p>
              <p className="text-xs font-semibold text-[#10243d]/55">
                Learning Hub
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/ai")}
            className="inline-flex items-center gap-2 rounded-xl border border-[#10243d]/10 bg-white px-4 py-2.5 text-sm font-black text-[#10243d] shadow-sm transition hover:-translate-y-0.5 hover:border-[#b15d2b]/30 hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">
              Back to Dashboard
            </span>
            <span className="sm:hidden">
              Back
            </span>
          </button>
        </div>
      </header>

      {/* Main */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center px-5 py-12 sm:px-8 lg:py-16">
        <div className="w-full max-w-5xl">
          {/* Development badge */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e3a56f]/40 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#b15d2b] shadow-sm backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b15d2b] opacity-50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#b15d2b]" />
              </span>
              Currently in development
            </div>
          </div>

          {/* Hero card */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_30px_80px_rgba(16,36,61,0.12)] backdrop-blur-xl sm:p-10 lg:p-14">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#e3a56f]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#10243d]/5 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              {/* Left */}
              <div>
                <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#10243d] shadow-xl shadow-[#10243d]/20">
                  <div className="relative">
                    <CreditCard className="h-10 w-10 text-[#e3a56f]" />
                    <Sparkles className="absolute -right-4 -top-4 h-5 w-5 animate-pulse text-[#b15d2b]" />
                  </div>
                </div>

                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#b15d2b]">
                  AI Credits
                </p>

                <h1 className="max-w-xl text-4xl font-black tracking-tight text-[#10243d] sm:text-5xl">
                  Your AI Credits
                  <span className="block text-[#b15d2b]">
                    are coming soon.
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-base leading-7 text-[#10243d]/65 sm:text-lg">
                  We are currently developing the GlobeDk AI
                  Credits system. Soon, you will be able to
                  manage your AI credits, view available
                  packages and use credits across the AI
                  Learning Hub.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#10243d]/8 bg-[#f4f1ea]/70 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Zap className="h-5 w-5 text-[#b15d2b]" />
                    </div>

                    <p className="text-sm font-black text-[#10243d]">
                      AI-powered learning
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#10243d]/55">
                      Use credits for supported AI learning
                      features.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#10243d]/8 bg-[#f4f1ea]/70 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <WalletCards className="h-5 w-5 text-[#b15d2b]" />
                    </div>

                    <p className="text-sm font-black text-[#10243d]">
                      Flexible credit packages
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#10243d]/55">
                      Packages and payment options will be
                      introduced soon.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="relative">
                <div className="relative mx-auto max-w-md overflow-hidden rounded-[1.75rem] border border-[#10243d]/10 bg-[#10243d] p-6 shadow-2xl shadow-[#10243d]/20 sm:p-8">
                  {/* animated rings */}
                  <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 animate-pulse rounded-full border border-[#e3a56f]/20" />
                  <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border border-[#e3a56f]/20" />

                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                          AI Learning Hub
                        </p>

                        <p className="mt-2 text-xl font-black text-white">
                          Credit System
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3a56f] shadow-lg shadow-[#e3a56f]/20">
                        <CreditCard className="h-6 w-6 text-[#10243d]" />
                      </div>
                    </div>

                    <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                          <Clock3 className="h-5 w-5 text-[#e3a56f]" />
                        </div>

                        <div>
                          <p className="text-sm font-black text-white">
                            Coming soon
                          </p>
                          <p className="text-xs text-white/45">
                            Credit management is being prepared.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {[
                        "View your credit balance",
                        "Choose an AI credit package",
                        "Use credits for AI features",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-4 py-3"
                        >
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#e3a56f]" />
                          <span className="text-sm font-semibold text-white/75">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-5 -left-3 rounded-2xl border border-white/80 bg-white px-4 py-3 shadow-xl sm:-left-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e3a56f]/20">
                      <GraduationCap className="h-5 w-5 text-[#b15d2b]" />
                    </div>

                    <div>
                      <p className="text-xs font-black text-[#10243d]">
                        GlobeDk Elite
                      </p>
                      <p className="text-[11px] font-semibold text-[#10243d]/50">
                        Excellence in Education
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support section */}
            <div className="relative mt-14 border-t border-[#10243d]/10 pt-10">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-[#b15d2b]" />

                    <h2 className="text-xl font-black text-[#10243d]">
                      Need AI Credits sooner?
                    </h2>
                  </div>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#10243d]/60">
                    Our credit management system is still being
                    developed. If you would like information about
                    AI Credits, pricing or early access, contact
                    GlobeDk Elite Academy Admissions.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleWhatsAppSupport}
                    className="group inline-flex items-center justify-center gap-3 rounded-xl bg-[#10243d] px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-[#10243d]/15 transition hover:-translate-y-0.5 hover:bg-[#183554] hover:shadow-xl"
                  >
                    <MessageCircle className="h-5 w-5 text-[#e3a56f]" />

                    <span>Contact on WhatsApp</span>

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    type="button"
                    onClick={handleEmailSupport}
                    className="group inline-flex items-center justify-center gap-3 rounded-xl border border-[#10243d]/15 bg-white px-5 py-3.5 text-sm font-black text-[#10243d] shadow-sm transition hover:-translate-y-0.5 hover:border-[#b15d2b]/30 hover:shadow-md"
                  >
                    <Mail className="h-5 w-5 text-[#b15d2b]" />

                    <span>Email Admissions</span>

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom navigation */}
          <div className="mt-7 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-xs font-semibold text-[#10243d]/45">
              GlobeDk AI Learning Hub • AI Credits
            </p>

            <button
              type="button"
              onClick={() => router.push("/ai")}
              className="inline-flex items-center gap-2 text-sm font-black text-[#10243d] transition hover:text-[#b15d2b]"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Learning Hub
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
