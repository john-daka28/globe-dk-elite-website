"use client"

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageCircle,
  Save,
  Sparkles,
  Target,
  User,
  X,
} from "lucide-react"

import Image from "next/image"

import {
  useEffect,
  useState,
} from "react"

import {
  useRouter,
} from "next/navigation"

type Student = {
  id: string
  firstName: string
  lastName: string
  email: string
  level: string | null
  curriculum: string | null
}

export default function AIProfilePage() {
  const router = useRouter()

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [changingPassword, setChangingPassword] =
    useState(false)

  const [signingOut, setSigningOut] =
    useState(false)

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)

  const [student, setStudent] =
    useState<Student | null>(null)

  const [firstName, setFirstName] =
    useState("")

  const [lastName, setLastName] =
    useState("")

  const [level, setLevel] =
    useState("")

  const [curriculum, setCurriculum] =
    useState("")

  const [currentPassword, setCurrentPassword] =
    useState("")

  const [newPassword, setNewPassword] =
    useState("")

  const [confirmPassword, setConfirmPassword] =
    useState("")

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false)

  const [showNewPassword, setShowNewPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const [passwordError, setPasswordError] =
    useState("")

  const [passwordSuccess, setPasswordSuccess] =
    useState("")

  /* ==========================================================
     LOAD PROFILE
     ========================================================== */

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true)
        setError("")

        const response =
          await fetch(
            "/api/ai/profile",
            {
              method: "GET",
              cache: "no-store",
              credentials: "include",
            }
          )

        const data =
          await response.json()

        if (!response.ok) {
          router.replace("/ai/signin")
          return
        }

        if (
          !data.authenticated ||
          !data.student
        ) {
          router.replace("/ai/signin")
          return
        }

        setStudent(data.student)

        setFirstName(
          data.student.firstName ?? ""
        )

        setLastName(
          data.student.lastName ?? ""
        )

        setLevel(
          data.student.level ?? ""
        )

        setCurriculum(
          data.student.curriculum ?? ""
        )
      } catch (profileError) {
        console.error(
          "AI profile loading error:",
          profileError
        )

        router.replace("/ai/signin")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  /* ==========================================================
     NAVIGATION
     ========================================================== */

  function openFeature(path: string) {
    setMobileMenuOpen(false)
    router.push(path)
  }

  function handleBack() {
    setMobileMenuOpen(false)

    if (
      typeof window !== "undefined" &&
      window.history.length > 1
    ) {
      router.back()
      return
    }

    router.push("/ai/dashboard")
  }

  /* ==========================================================
     SIGN OUT
     ========================================================== */

  async function handleSignOut() {
    try {
      setSigningOut(true)

      await fetch(
        "/api/ai/auth/signout",
        {
          method: "POST",
          credentials: "include",
        }
      )
    } catch (signOutError) {
      console.error(
        "AI signout error:",
        signOutError
      )
    } finally {
      router.replace("/ai/signin")
      router.refresh()
    }
  }

  /* ==========================================================
     SAVE PROFILE
     ========================================================== */

  async function handleSaveProfile() {
    try {
      setSaving(true)
      setError("")
      setSuccess("")

      const response =
        await fetch(
          "/api/ai/profile",
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              firstName,
              lastName,
              level,
              curriculum,
            }),
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to update your profile."
        )

        return
      }

      if (data.student) {
        setStudent(data.student)

        setFirstName(
          data.student.firstName ?? ""
        )

        setLastName(
          data.student.lastName ?? ""
        )

        setLevel(
          data.student.level ?? ""
        )

        setCurriculum(
          data.student.curriculum ?? ""
        )
      }

      setSuccess(
        "Your profile has been updated successfully."
      )
    } catch (saveError) {
      console.error(
        "AI profile save error:",
        saveError
      )

      setError(
        "Something went wrong while saving your profile."
      )
    } finally {
      setSaving(false)
    }
  }

  /* ==========================================================
     CHANGE PASSWORD
     ========================================================== */

  async function handleChangePassword() {
    setPasswordError("")
    setPasswordSuccess("")

    if (!currentPassword) {
      setPasswordError(
        "Please enter your current password."
      )
      return
    }

    if (!newPassword) {
      setPasswordError(
        "Please enter your new password."
      )
      return
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "Your new password must be at least 8 characters long."
      )
      return
    }

    if (!confirmPassword) {
      setPasswordError(
        "Please confirm your new password."
      )
      return
    }

    if (
      newPassword !== confirmPassword
    ) {
      setPasswordError(
        "The new passwords do not match."
      )
      return
    }

    if (
      currentPassword === newPassword
    ) {
      setPasswordError(
        "Your new password must be different from your current password."
      )
      return
    }

    try {
      setChangingPassword(true)

      const response =
        await fetch(
          "/api/ai/profile",
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              currentPassword,
              newPassword,
              confirmPassword,
            }),
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        setPasswordError(
          data.error ||
            "Unable to change your password."
        )

        return
      }

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)

      setPasswordSuccess(
        "Your password has been changed successfully."
      )
    } catch (passwordChangeError) {
      console.error(
        "AI password change error:",
        passwordChangeError
      )

      setPasswordError(
        "Something went wrong while changing your password."
      )
    } finally {
      setChangingPassword(false)
    }
  }

  /* ==========================================================
     DERIVED NAME
     ========================================================== */

  const fullName =
    [
      student?.firstName,
      student?.lastName,
    ]
      .filter(Boolean)
      .join(" ") || "Student"

  const initials =
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`
      .toUpperCase() || "S"

  /* ==========================================================
     LOADING
     ========================================================== */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f1ea]">
        <div className="flex items-center gap-3 text-[#10243d]">
          <Loader2 className="h-6 w-6 animate-spin" />

          <span className="font-semibold">
            Loading your profile...
          </span>
        </div>
      </main>
    )
  }

  /* ==========================================================
     PAGE
     ========================================================== */

  return (
    <div className="min-h-screen bg-[#f4f1ea]">

      

      {/* ======================================================
          MAIN CONTENT
          ====================================================== */}

      <main className="min-h-screen lg:pl-[250px]">

        {/* ====================================================
            MOBILE / DESKTOP HEADER
            ==================================================== */}

        <header className="border-b border-slate-200 bg-white">

          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

            <div className="flex min-w-0 items-center gap-3">

             

              

              {/* BACK BUTTON */}

              <button
                type="button"
                onClick={handleBack}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-[#10243d] transition hover:border-[#b15d2b] hover:bg-[#f4f1ea]"
              >
                <ArrowLeft className="h-4 w-4" />

                <span className="hidden xs:inline sm:inline">
                  Back
                </span>
              </button>

              <div className="min-w-0">

                <p className="truncate text-xs font-bold uppercase tracking-[0.18em] text-[#b15d2b]">
                  GlobeDk AI Learning Hub
                </p>

                <h1 className="truncate text-xl font-black text-[#10243d] sm:text-2xl">
                  My Profile
                </h1>

              </div>

            </div>

          </div>

        </header>

        {/* ====================================================
            CONTENT
            ==================================================== */}

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="mb-8">

            <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-[#b15d2b]">
              Account
            </p>

            <h2 className="text-3xl font-black tracking-tight text-[#10243d] sm:text-4xl">
              Your AI Learning Profile
            </h2>

            <p className="mt-2 max-w-2xl text-slate-600">
              Keep your learner information and account
              security up to date so GlobeDk AI can
              personalize your learning experience.
            </p>

          </div>

          {/* ==================================================
              PROFILE + FORM
              ================================================== */}

          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

            {/* ==================================================
                PROFILE SUMMARY
                ================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex flex-col items-center text-center">

                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#10243d] text-3xl font-black text-white shadow-lg">
                  {initials}
                </div>

                <h3 className="mt-5 text-xl font-black text-[#10243d]">
                  {fullName}
                </h3>

                <p className="mt-1 break-all text-sm text-slate-500">
                  {student?.email}
                </p>

                <div className="mt-5 w-full rounded-xl bg-[#f4f1ea] px-4 py-3">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Account
                  </p>

                  <div className="mt-1 flex items-center justify-center gap-2 text-sm font-bold text-[#10243d]">

                    <CheckCircle2 className="h-4 w-4 text-green-600" />

                    Active

                  </div>

                </div>

                {level && (
                  <div className="mt-3 w-full rounded-xl border border-slate-100 px-4 py-3">

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Level
                    </p>

                    <p className="mt-1 text-sm font-black text-[#10243d]">
                      {level}
                    </p>

                  </div>
                )}

                {curriculum && (
                  <div className="mt-3 w-full rounded-xl border border-slate-100 px-4 py-3">

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Curriculum
                    </p>

                    <p className="mt-1 text-sm font-black text-[#10243d]">
                      {curriculum}
                    </p>

                  </div>
                )}

              </div>

            </section>

            {/* ==================================================
                RIGHT COLUMN
                ================================================== */}

            <div className="space-y-6">

              {/* ==================================================
                  PERSONAL INFORMATION
                  ================================================== */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                <div className="mb-7">

                  <h3 className="text-xl font-black text-[#10243d]">
                    Personal Information
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Update the information associated with
                    your AI Learning Hub account.
                  </p>

                </div>

                {error && (
                  <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">

                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                    <span>
                      {success}
                    </span>

                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* FIRST NAME */}

                  <div>

                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-bold text-[#10243d]"
                    >
                      First name
                    </label>

                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(event) =>
                        setFirstName(
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#10243d] outline-none transition placeholder:text-slate-400 focus:border-[#b15d2b] focus:ring-2 focus:ring-[#b15d2b]/10"
                      placeholder="Enter your first name"
                    />

                  </div>

                  {/* LAST NAME */}

                  <div>

                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-bold text-[#10243d]"
                    >
                      Last name
                    </label>

                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(event) =>
                        setLastName(
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#10243d] outline-none transition placeholder:text-slate-400 focus:border-[#b15d2b] focus:ring-2 focus:ring-[#b15d2b]/10"
                      placeholder="Enter your last name"
                    />

                  </div>

                  {/* EMAIL */}

                  <div className="sm:col-span-2">

                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-bold text-[#10243d]"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={
                        student?.email ?? ""
                      }
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500"
                    />

                    <p className="mt-2 text-xs text-slate-400">
                      Your email address cannot be changed
                      here.
                    </p>

                  </div>

                  {/* LEVEL */}

                  <div>

                    <label
                      htmlFor="level"
                      className="mb-2 block text-sm font-bold text-[#10243d]"
                    >
                      Level
                    </label>

                    <select
                      id="level"
                      value={level}
                      onChange={(event) =>
                        setLevel(
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#10243d] outline-none transition focus:border-[#b15d2b] focus:ring-2 focus:ring-[#b15d2b]/10"
                    >
                      <option value="">
                        Select your level
                      </option>

                      <option value="O-Level">
                        O-Level
                      </option>

                      <option value="A-Level">
                        A-Level
                      </option>
                    </select>

                  </div>

                  {/* CURRICULUM */}

                  <div>

                    <label
                      htmlFor="curriculum"
                      className="mb-2 block text-sm font-bold text-[#10243d]"
                    >
                      Curriculum
                    </label>

                    <select
                      id="curriculum"
                      value={curriculum}
                      onChange={(event) =>
                        setCurriculum(
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#10243d] outline-none transition focus:border-[#b15d2b] focus:ring-2 focus:ring-[#b15d2b]/10"
                    >
                      <option value="">
                        Select your curriculum
                      </option>

                      <option value="ZIMSEC">
                        ZIMSEC
                      </option>

                      <option value="Cambridge">
                        Cambridge
                      </option>
                    </select>

                  </div>

                </div>

                {/* SAVE */}

                <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">

                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#10243d] px-6 py-3 text-sm font-black text-white shadow-lg transition hover:bg-[#1a3555] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >

                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}

                  </button>

                </div>

              </section>

              {/* ==================================================
                  CHANGE PASSWORD
                  ================================================== */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                <div className="mb-7">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4f1ea]">
                      <GraduationCap className="h-5 w-5 text-[#b15d2b]" />
                    </div>

                    <div>

                      <h3 className="text-xl font-black text-[#10243d]">
                        Change Password
                      </h3>

                      <p className="text-sm text-slate-500">
                        Keep your AI Learning Hub account secure.
                      </p>

                    </div>

                  </div>

                </div>

                {passwordError && (
                  <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">

                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                    <span>
                      {passwordSuccess}
                    </span>

                  </div>
                )}

                <div className="space-y-5">

                  {/* CURRENT PASSWORD */}

                  <PasswordField
                    id="currentPassword"
                    label="Current password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    visible={showCurrentPassword}
                    onToggle={() =>
                      setShowCurrentPassword(
                        (value) => !value
                      )
                    }
                    placeholder="Enter your current password"
                  />

                  {/* NEW PASSWORD */}

                  <PasswordField
                    id="newPassword"
                    label="New password"
                    value={newPassword}
                    onChange={setNewPassword}
                    visible={showNewPassword}
                    onToggle={() =>
                      setShowNewPassword(
                        (value) => !value
                      )
                    }
                    placeholder="Enter your new password"
                  />

                  {/* CONFIRM PASSWORD */}

                  <PasswordField
                    id="confirmPassword"
                    label="Confirm new password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    visible={showConfirmPassword}
                    onToggle={() =>
                      setShowConfirmPassword(
                        (value) => !value
                      )
                    }
                    placeholder="Confirm your new password"
                  />

                </div>

                <div className="mt-5 rounded-xl bg-[#f4f1ea] px-4 py-3">

                  <p className="text-xs font-semibold leading-5 text-slate-600">
                    Your new password must contain at least
                    8 characters. Make sure your confirmation
                    matches the new password exactly.
                  </p>

                </div>

                <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">

                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#b15d2b] px-6 py-3 text-sm font-black text-white shadow-lg transition hover:bg-[#984d24] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >

                    {changingPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Change Password
                      </>
                    )}

                  </button>

                </div>

              </section>

            </div>

          </div>

        </div>

      </main>

    </div>
  )
}

/* ============================================================
   PASSWORD FIELD
   ============================================================ */

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
  placeholder,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  visible: boolean
  onToggle: () => void
  placeholder: string
}) {
  return (
    <div>

      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-[#10243d]"
      >
        {label}
      </label>

      <div className="relative">

        <input
          id={id}
          type={
            visible
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          autoComplete={
            id === "currentPassword"
              ? "current-password"
              : "new-password"
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm font-medium text-[#10243d] outline-none transition placeholder:text-slate-400 focus:border-[#b15d2b] focus:ring-2 focus:ring-[#b15d2b]/10"
          placeholder={placeholder}
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            visible
              ? `Hide ${label}`
              : `Show ${label}`
          }
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#10243d]"
        >
          {visible ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>

      </div>

    </div>
  )
}

/* ============================================================
   DESKTOP SIDEBAR ITEM
   ============================================================ */

function SidebarItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ElementType
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "flex w-full items-center gap-3 rounded-xl bg-[#e3a56f] px-4 py-3 text-sm font-black text-[#10243d] shadow-sm"
          : "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
      }
    >
      <Icon className="h-5 w-5 shrink-0" />

      <span>
        {label}
      </span>
    </button>
  )
}

/* ============================================================
   MOBILE SIDEBAR ITEM
   ============================================================ */

function MobileNavItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ElementType
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "flex w-full items-center gap-3 rounded-xl bg-[#e3a56f] px-4 py-3 text-sm font-black text-[#10243d]"
          : "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
      }
    >
      <Icon className="h-5 w-5 shrink-0" />

      <span>
        {label}
      </span>
    </button>
  )
}