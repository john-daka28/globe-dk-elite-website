"use client"

import {
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  GraduationCap,
  Lightbulb,
  Loader2,
  LogOut,
  Menu,
  MessageCircle,
  MoreVertical,
  Plus,
  Send,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  X,
  Zap,
} from "lucide-react"

import {
  FormEvent,
  type ElementType,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { useRouter } from "next/navigation"
import Image from "next/image"

type Student = {
  id: string
  firstName: string
  lastName: string
  email: string
  level: string | null
  curriculum: string | null
}

type Credits = {
  balance: number
}

type RevisionMode =
  | "chat"
  | "explain"
  | "practice"
  | "quiz"
  | "exam_prep"
  | "mistake_fix"
  | "revision_plan"

type Session = {
  id: string
  ai_student_id: string
  user_id: string | null
  title: string
  subject: string
  level: string
  curriculum: string
  topic: string | null
  subtopic: string | null
  mode: string
  status: string
  messages_count: number
  created_at: string
  updated_at: string
}

type Message = {
  id: string
  session_id: string
  ai_student_id: string
  role:
    | "user"
    | "assistant"
    | "system"
  content: string
  subject: string | null
  topic: string | null
  subtopic: string | null
  model_name: string | null
  credits_used: number
  created_at: string
}

type Progress = {
  id: string
  ai_student_id: string
  subject: string
  level: string
  curriculum: string
  topic: string
  questions_attempted: number
  questions_correct: number
  mastery_score: number
  last_studied_at: string | null
  created_at: string
  updated_at: string
}

const MODES: Array<{
  id: RevisionMode
  title: string
  description: string
  icon: typeof Brain
}> = [
  {
    id: "explain",
    title: "Explain a topic",
    description:
      "Learn a topic step by step.",
    icon: Lightbulb,
  },
  {
    id: "practice",
    title: "Practice questions",
    description:
      "Practise fresh exam-style questions.",
    icon: BookOpen,
  },
  {
    id: "quiz",
    title: "Quick quiz",
    description:
      "Test what you already know.",
    icon: Trophy,
  },
  {
    id: "mistake_fix",
    title: "Fix my mistake",
    description:
      "Understand exactly where you went wrong.",
    icon: Target,
  },
  {
    id: "exam_prep",
    title: "Exam preparation",
    description:
      "Prepare for Paper 1 and Paper 2.",
    icon: GraduationCap,
  },
  {
    id: "revision_plan",
    title: "Revision plan",
    description:
      "Build a focused revision strategy.",
    icon: Clock3,
  },
]

function formatTime(
  date: string
) {
  try {
    return new Intl.DateTimeFormat(
      "en-ZW",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(
      new Date(date)
    )
  } catch {
    return ""
  }
}

function formatDate(
  date: string
) {
  try {
    return new Intl.DateTimeFormat(
      "en-ZW",
      {
        day: "numeric",
        month: "short",
      }
    ).format(
      new Date(date)
    )
  } catch {
    return ""
  }
}

function initials(
  student: Student | null
) {
  if (!student) {
    return "GD"
  }

  return (
    `${student.firstName?.[0] || ""}${student.lastName?.[0] || ""}`
  ).toUpperCase()
}

function renderMessageText(
  text: string
) {
  const lines =
    text.split("\n")

  return lines.map(
    (line, index) => {
      const trimmed =
        line.trim()

      if (
        trimmed.startsWith(
          "### "
        )
      ) {
        return (
          <h4
            key={index}
            className="mb-2 mt-4 text-base font-bold text-[#10243d] first:mt-0"
          >
            {trimmed.replace(
              "### ",
              ""
            )}
          </h4>
        )
      }

      if (
        trimmed.startsWith(
          "## "
        )
      ) {
        return (
          <h4
            key={index}
            className="mb-2 mt-4 text-base font-bold text-[#10243d] first:mt-0"
          >
            {trimmed.replace(
              "## ",
              ""
            )}
          </h4>
        )
      }

      if (
        trimmed.startsWith(
          "**"
        ) &&
        trimmed.endsWith(
          "**"
        )
      ) {
        return (
          <p
            key={index}
            className="mb-2 font-bold text-[#10243d]"
          >
            {trimmed.slice(
              2,
              -2
            )}
          </p>
        )
      }

      if (
        trimmed.match(
          /^\d+\.\s/
        )
      ) {
        return (
          <p
            key={index}
            className="mb-2 pl-1"
          >
            {trimmed}
          </p>
        )
      }

      if (
        trimmed.startsWith(
          "- "
        )
      ) {
        return (
          <p
            key={index}
            className="mb-1 pl-3"
          >
            •{" "}
            {trimmed.slice(2)}
          </p>
        )
      }

      if (!trimmed) {
        return (
          <div
            key={index}
            className="h-2"
          />
        )
      }

      return (
        <p
          key={index}
          className="mb-2 last:mb-0"
        >
          {line}
        </p>
      )
    }
  )
}

export default function RevisionCoachClient() {
  const router = useRouter()

  const [
    student,
    setStudent,
  ] = useState<Student | null>(
    null
  )

  const [
    credits,
    setCredits,
  ] = useState<Credits>({
    balance: 0,
  })

  const [
    sessions,
    setSessions,
  ] = useState<Session[]>(
    []
  )

  const [
    progress,
    setProgress,
  ] = useState<Progress[]>(
    []
  )

  const [
    activeSession,
    setActiveSession,
  ] =
    useState<Session | null>(
      null
    )

  const [
    messages,
    setMessages,
  ] = useState<Message[]>(
    []
  )

  const [
    selectedMode,
    setSelectedMode,
  ] =
    useState<RevisionMode>(
      "chat"
    )

  const [
    selectedTopic,
    setSelectedTopic,
  ] = useState("")

  const [
    message,
    setMessage,
  ] = useState("")

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    sending,
    setSending,
  ] = useState(false)

  const [
    creatingSession,
    setCreatingSession,
  ] = useState(false)

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false)

  const [
    mobileDashboardSidebarOpen,
    setMobileDashboardSidebarOpen,
  ] = useState(false)

  const [
    signingOut,
    setSigningOut,
  ] = useState(false)

  const [
    showModes,
    setShowModes,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState("")

  const [
    showPayment,
    setShowPayment,
  ] = useState(false)

  const messagesEndRef =
    useRef<HTMLDivElement | null>(
      null
    )

  const textareaRef =
    useRef<HTMLTextAreaElement | null>(
      null
    )

  const currentTopic =
    activeSession?.topic ||
    selectedTopic ||
    ""

  const weakTopics =
    useMemo(
      () =>
        [...progress]
          .sort(
            (a, b) =>
              Number(
                a.mastery_score
              ) -
              Number(
                b.mastery_score
              )
          )
          .slice(0, 5),
      [progress]
    )

  /**
   * ----------------------------------------------------------
   * LOAD INITIAL DATA
   * ----------------------------------------------------------
   */
  useEffect(() => {
    loadCoach()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    )
  }, [messages, sending])

  async function loadCoach(
    sessionId?: string
  ) {
    try {
      setLoading(true)
      setError("")

      const url =
        sessionId
          ? `/api/ai/revision-coach?sessionId=${encodeURIComponent(
              sessionId
            )}`
          : "/api/ai/revision-coach"

      const response =
        await fetch(url, {
          cache: "no-store",
        })

      const data =
        await response.json()

      if (
        response.status ===
        401
      ) {
        window.location.href =
          "/ai/login"

        return
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Unable to load Revision Coach."
        )
      }

      setStudent(
        data.student
      )

      setCredits(
        data.credits || {
          balance: 0,
        }
      )

      setSessions(
        data.sessions || []
      )

      setProgress(
        data.progress || []
      )

      setActiveSession(
        data.activeSession ||
          null
      )

      setMessages(
        data.messages || []
      )

      if (
        data.activeSession
          ?.mode
      ) {
        setSelectedMode(
          data.activeSession.mode as RevisionMode
        )
      }

      if (
        data.activeSession
          ?.topic
      ) {
        setSelectedTopic(
          data.activeSession.topic
        )
      }
    } catch (loadError) {
      console.error(
        "Revision Coach load error:",
        loadError
      )

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load Revision Coach."
      )
    } finally {
      setLoading(false)
    }
  }

  /**
   * ----------------------------------------------------------
   * NEW SESSION
   * ----------------------------------------------------------
   */
  async function createNewSession(
    topic = ""
  ) {
    try {
      setCreatingSession(true)
      setError("")

      const response =
        await fetch(
          "/api/ai/revision-coach/sessions",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              title: topic
                ? `${topic} Revision`
                : "Mathematics Revision",
              topic:
                topic || null,
              mode: selectedMode,
            }),
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to create session."
        )
      }

      const newSession =
        data.session as Session

      setSessions(
        previous => [
          newSession,
          ...previous,
        ]
      )

      setActiveSession(
        newSession
      )

      setMessages([])
      setSelectedTopic(
        topic
      )

      setMobileSidebarOpen(
        false
      )

      textareaRef.current?.focus()
    } catch (sessionError) {
      console.error(
        "Create session error:",
        sessionError
      )

      setError(
        sessionError instanceof Error
          ? sessionError.message
          : "Unable to create session."
      )
    } finally {
      setCreatingSession(false)
    }
  }

  /**
   * ----------------------------------------------------------
   * SELECT SESSION
   * ----------------------------------------------------------
   */
  async function selectSession(
    session: Session
  ) {
    try {
      setError("")
      setLoading(true)

      const response =
        await fetch(
          `/api/ai/revision-coach?sessionId=${encodeURIComponent(
            session.id
          )}`,
          {
            cache: "no-store",
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to open session."
        )
      }

      setActiveSession(
        data.activeSession ||
          session
      )

      setMessages(
        data.messages || []
      )

      setSelectedMode(
        (data.activeSession
          ?.mode ||
          session.mode ||
          "chat") as RevisionMode
      )

      setSelectedTopic(
        data.activeSession
          ?.topic ||
          session.topic ||
          ""
      )

      setCredits(
        data.credits || credits
      )

      setMobileSidebarOpen(
        false
      )
    } catch (sessionError) {
      console.error(
        "Select session error:",
        sessionError
      )

      setError(
        sessionError instanceof Error
          ? sessionError.message
          : "Unable to open session."
      )
    } finally {
      setLoading(false)
    }
  }

  /**
   * ----------------------------------------------------------
   * DELETE SESSION
   * ----------------------------------------------------------
   */
  async function deleteSession(
    sessionId: string
  ) {
    const confirmed =
      window.confirm(
        "Delete this revision session?"
      )

    if (!confirmed) {
      return
    }

    try {
      const response =
        await fetch(
          `/api/ai/revision-coach/sessions/${sessionId}`,
          {
            method: "DELETE",
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete session."
        )
      }

      setSessions(
        previous =>
          previous.filter(
            session =>
              session.id !==
              sessionId
          )
      )

      if (
        activeSession?.id ===
        sessionId
      ) {
        setActiveSession(
          null
        )
        setMessages([])
        setSelectedTopic("")
        setSelectedMode("chat")
      }
    } catch (deleteError) {
      console.error(
        "Delete session error:",
        deleteError
      )

      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete session."
      )
    }
  }

  /**
   * ----------------------------------------------------------
   * SEND MESSAGE
   * ----------------------------------------------------------
   */
  async function sendMessage(
    event?: FormEvent
  ) {
    event?.preventDefault()

    const trimmed =
      message.trim()

    if (!trimmed) {
      return
    }

    if (
      credits.balance <
      1
    ) {
      setShowPayment(true)
      return
    }

    try {
      setSending(true)
      setError("")

      let session =
        activeSession

      /**
       * Create a session automatically if
       * this is the first message.
       */
      if (!session) {
        const sessionResponse =
          await fetch(
            "/api/ai/revision-coach/sessions",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                title:
                  selectedTopic
                    ? `${selectedTopic} Revision`
                    : "Mathematics Revision",
                topic:
                  selectedTopic ||
                  null,
                mode:
                  selectedMode,
              }),
            }
          )

        const sessionData =
          await sessionResponse.json()

        if (
          !sessionResponse.ok
        ) {
          throw new Error(
            sessionData.message ||
              "Unable to create revision session."
          )
        }

        session =
          sessionData.session

        setActiveSession(
          session
        )

        setSessions(
          previous => [
            session as Session,
            ...previous,
          ]
        )
      }

      const temporaryUserMessage: Message =
        {
          id: `temp-user-${Date.now()}`,
          session_id:
            session.id,
          ai_student_id:
            student?.id ||
            "",
          role: "user",
          content: trimmed,
          subject:
            "Mathematics",
          topic:
            selectedTopic ||
            session.topic ||
            null,
          subtopic: null,
          model_name: null,
          credits_used: 0,
          created_at:
            new Date().toISOString(),
        }

      setMessages(
        previous => [
          ...previous,
          temporaryUserMessage,
        ]
      )

      setMessage("")

      const response =
        await fetch(
          "/api/ai/revision-coach",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              sessionId:
                session.id,
              message:
                trimmed,
              mode:
                selectedMode,
              topic:
                selectedTopic ||
                session.topic ||
                null,
            }),
          }
        )

      const data =
        await response.json()

      if (
        response.status ===
        402 ||
        data.code ===
          "INSUFFICIENT_CREDITS"
      ) {
        setMessages(
          previous =>
            previous.filter(
              item =>
                item.id !==
                temporaryUserMessage.id
            )
        )

        setShowPayment(true)

        return
      }

      if (!response.ok) {
        setMessages(
          previous =>
            previous.filter(
              item =>
                item.id !==
                temporaryUserMessage.id
            )
        )

        throw new Error(
          data.message ||
            "The Revision Coach could not respond."
        )
      }

      setMessages(
        previous =>
          previous
            .filter(
              item =>
                item.id !==
                temporaryUserMessage.id
            )
            .concat([
              data.userMessage,
              data.assistantMessage,
            ])
      )

      setCredits(
        data.credits || {
          balance: 0,
        }
      )

      if (data.session) {
        setActiveSession(
          data.session
        )

        setSessions(
          previous =>
            [
              data.session,
              ...previous.filter(
                item =>
                  item.id !==
                  data.session.id
              ),
            ]
        )
      }

      if (
        selectedTopic
      ) {
        await refreshProgress()
      }
    } catch (sendError) {
      console.error(
        "Revision Coach send error:",
        sendError
      )

      setError(
        sendError instanceof Error
          ? sendError.message
          : "Unable to send your message."
      )
    } finally {
      setSending(false)

      setTimeout(() => {
        textareaRef.current?.focus()
      }, 50)
    }
  }

  /**
   * ----------------------------------------------------------
   * REFRESH PROGRESS
   * ----------------------------------------------------------
   */
  async function refreshProgress() {
    try {
      const response =
        await fetch(
          "/api/ai/revision-coach",
          {
            cache: "no-store",
          }
        )

      if (!response.ok) {
        return
      }

      const data =
        await response.json()

      setProgress(
        data.progress || []
      )

      setCredits(
        data.credits || credits
      )
    } catch {
      // Non-critical refresh.
    }
  }

  function openFeature(path: string) {
    setMobileDashboardSidebarOpen(false)
    setMobileSidebarOpen(false)
    router.push(path)
  }

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

      router.replace("/ai/signin")
      router.refresh()
    } catch (signOutError) {
      console.error(
        "Sign out error:",
        signOutError
      )

      setSigningOut(false)
    }
  }

  /**
   * ----------------------------------------------------------
   * SELECT MODE
   * ----------------------------------------------------------
   */
  function chooseMode(
    mode: RevisionMode
  ) {
    setSelectedMode(mode)
    setShowModes(false)

    if (
      mode !== "chat" &&
      !activeSession
    ) {
      createNewSession(
        selectedTopic
      )
    }
  }

  /**
   * ----------------------------------------------------------
   * INPUT KEYBOARD
   * ----------------------------------------------------------
   */
  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key ===
        "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault()

      if (!sending) {
        sendMessage()
      }
    }
  }

  /**
   * ----------------------------------------------------------
   * LOADING
   * ----------------------------------------------------------
   */
  if (loading && !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f1ea]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#10243d]">
            <Sparkles className="h-7 w-7 text-[#e3a56f]" />
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading Revision Coach...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-slate-900">
      {/* AI HUB MOBILE SIDEBAR */}
      {mobileDashboardSidebarOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Close AI Hub sidebar"
            onClick={() =>
              setMobileDashboardSidebarOpen(false)
            }
            className="absolute inset-0 bg-[#10243d]/50"
          />

          <aside className="relative flex h-full w-[290px] flex-col bg-[#10243d] px-5 py-6 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white p-1 shadow-lg">
                  <Image
                    src="/Logo.png"
                    alt="GlobeDk Elite Academy"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                <div>
                  <p className="text-lg font-black tracking-tight text-white">
                    GlobeDk AI
                  </p>
                  <p className="text-xs text-white/60">
                    Learning Hub
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileDashboardSidebarOpen(false)
                }
                className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-2">
              <MobileNavItem
                icon={GraduationCap}
                label="Dashboard"
                onClick={() =>
                  openFeature("/ai/dashboard")
                }
              />
              <MobileNavItem
                icon={Sparkles}
                label="Exam Predictor"
                onClick={() =>
                  openFeature("/ai/exam-predictor")
                }
              />
              <MobileNavItem
                icon={BookOpen}
                label="Mock Lab"
                onClick={() =>
                  openFeature("/ai/mock-lab")
                }
              />
              <MobileNavItem
                icon={Target}
                label="Revision Coach"
                active
                onClick={() =>
                  setMobileDashboardSidebarOpen(false)
                }
              />
              <MobileNavItem
                icon={Trophy}
                label="My Progress"
                onClick={() =>
                  openFeature("/ai/progress")
                }
              />
            </nav>

            <div className="mt-auto border-t border-white/10 pt-5">
              {student && (
                <div className="mb-3 rounded-xl bg-white/5 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-black text-[#e3a56f]">
                      {initials(student)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">
                        {student.firstName}{" "}
                        {student.lastName}
                      </p>

                      <p className="truncate text-xs text-white/50">
                        {student.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                <LogOut className="h-5 w-5" />
                {signingOut
                  ? "Signing out..."
                  : "Sign out"}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* MOBILE OVERLAY */}
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() =>
            setMobileSidebarOpen(
              false
            )
          }
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* AI HUB DESKTOP SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] border-r border-white/10 bg-[#10243d] lg:flex lg:flex-col">
        <div className="mb-8 flex items-center px-5 pt-6">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white p-1 shadow-lg">
              <Image
                src="/Logo.png"
                alt="GlobeDk Elite Academy"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div>
              <p className="text-lg font-black tracking-tight text-white">
                GlobeDk AI
              </p>
              <p className="text-xs text-white/60">
                Learning Hub
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          <SidebarItem
            icon={GraduationCap}
            label="Dashboard"
            onClick={() =>
              openFeature("/ai/dashboard")
            }
          />
          <SidebarItem
            icon={Sparkles}
            label="Exam Predictor"
            onClick={() =>
              openFeature("/ai/exam-predictor")
            }
          />
          <SidebarItem
            icon={BookOpen}
            label="Mock Lab"
            onClick={() =>
              openFeature("/ai/mock-lab")
            }
          />
          <SidebarItem
            icon={Target}
            label="Revision Coach"
            active
            onClick={() => {}}
          />
          <SidebarItem
            icon={Trophy}
            label="My Progress"
            onClick={() =>
              openFeature("/ai/progress")
            }
          />
        </nav>

        <div className="border-t border-white/10 p-4">
          {student && (
            <div className="mb-3 rounded-xl bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-black text-[#e3a56f]">
                  {initials(student)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">
                    {student.firstName}{" "}
                    {student.lastName}
                  </p>
                  <p className="truncate text-xs text-white/50">
                    {student.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <LogOut className="h-5 w-5" />
            {signingOut
              ? "Signing out..."
              : "Sign out"}
          </button>
        </div>
      </aside>

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[300px] flex-col bg-[#10243d] px-5 py-6 shadow-2xl transition-transform duration-300 lg:left-[250px] lg:translate-x-0 ${
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* BRAND */}
        <div className="mb-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white p-1.5">
              <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#f4f1ea] text-xs font-black text-[#10243d]">
                GD
              </div>
            </div>

            <div>
              <p className="text-lg font-black tracking-tight text-white">
                GlobeDk
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e3a56f]">
                Elite Academy
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setMobileSidebarOpen(
                false
              )
            }
            className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* COACH CARD */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.07] p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e3a56f] text-sm font-black text-[#10243d]">
              <Brain className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                AI Revision Coach
              </p>

              <p className="text-xs text-white/50">
                Mathematics
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-black/10 px-3 py-2">
            <span className="text-xs text-white/60">
              AI Credits
            </span>

            <span className="flex items-center gap-1.5 text-sm font-black text-[#e3a56f]">
              <Zap className="h-3.5 w-3.5" />
              {credits.balance}
            </span>
          </div>
        </div>

        {/* NEW SESSION */}
        <button
          type="button"
          disabled={creatingSession}
          onClick={() =>
            createNewSession()
          }
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e3a56f] px-4 py-3 text-sm font-black text-[#10243d] transition hover:brightness-105 disabled:opacity-60"
        >
          {creatingSession ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          New Revision Session
        </button>

        {/* RECENT SESSIONS */}
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
            Recent sessions
          </p>

          <MessageCircle className="h-3.5 w-3.5 text-white/30" />
        </div>

        <div className="scrollbar-thin flex-1 space-y-1 overflow-y-auto pr-1">
          {sessions.length ===
          0 ? (
            <div className="rounded-xl border border-dashed border-white/10 p-4 text-center">
              <p className="text-xs leading-5 text-white/40">
                Your revision sessions will appear here.
              </p>
            </div>
          ) : (
            sessions.map(
              session => (
                <div
                  key={
                    session.id
                  }
                  className={`group flex items-center gap-1 rounded-xl transition ${
                    activeSession?.id ===
                    session.id
                      ? "bg-white/10"
                      : "hover:bg-white/[0.06]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      selectSession(
                        session
                      )
                    }
                    className="min-w-0 flex-1 px-3 py-3 text-left"
                  >
                    <p className="truncate text-sm font-semibold text-white">
                      {session.title}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] text-white/40">
                        {formatDate(
                          session.updated_at
                        )}
                      </span>

                      {session.topic && (
                        <>
                          <span className="text-white/20">
                            •
                          </span>

                          <span className="truncate text-[10px] text-white/40">
                            {session.topic}
                          </span>
                        </>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    aria-label="Delete session"
                    onClick={() =>
                      deleteSession(
                        session.id
                      )
                    }
                    className="mr-1 rounded-lg p-2 text-white/20 opacity-0 transition hover:bg-red-500/10 hover:text-red-300 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )
            )
          )}
        </div>

        {/* STUDENT */}
        {student && (
          <div className="mt-5 border-t border-white/10 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-black text-[#e3a56f]">
                {initials(
                  student
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">
                  {student.firstName}{" "}
                  {student.lastName}
                </p>

                <p className="truncate text-[10px] text-white/40">
                  {student.level ||
                    "Student"}{" "}
                  •{" "}
                  {student.curriculum ||
                    "ZIMSEC"}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN */}
      <main className="min-h-screen lg:pl-[550px]">
        {/* HEADER */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-[#f4f1ea]/95 backdrop-blur">
          <div className="flex h-[76px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  type="button"
                  onClick={() =>
                    setMobileDashboardSidebarOpen(true)
                  }
                  className="rounded-xl border border-slate-200 bg-white p-2.5 text-[#10243d] shadow-sm"
                  aria-label="Open AI Hub navigation"
                >
                  <GraduationCap className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMobileSidebarOpen(
                      true
                    )
                  }
                  className="rounded-xl border border-slate-200 bg-white p-2.5 text-[#10243d] shadow-sm"
                  aria-label="Open Revision Coach sidebar"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 shrink-0 text-[#b15d2b]" />

                  <h1 className="truncate text-lg font-black text-[#10243d] sm:text-xl">
                    AI Revision Coach
                  </h1>
                </div>

                <p className="hidden truncate text-xs text-slate-500 sm:block">
                  Your personal Mathematics learning assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <Zap className="h-4 w-4 text-[#b15d2b]" />

                <span className="text-sm font-black text-[#10243d]">
                  {credits.balance}
                </span>

                <span className="hidden text-xs text-slate-500 sm:inline">
                  credits
                </span>
              </div>

              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm hover:text-[#10243d]"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto flex max-w-[1500px] flex-col px-4 py-5 sm:px-6 lg:px-8">
          {/* ERROR */}
          {error && (
            <div className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <div>
                <p className="font-bold">
                  Something went wrong
                </p>
                <p className="mt-0.5 text-xs">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setError("")
                }
                className="rounded-lg p-1 hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* TOP INTRO */}
          {!activeSession &&
            messages.length ===
              0 && (
              <section className="mb-6 overflow-hidden rounded-3xl bg-[#10243d] shadow-xl">
                <div className="relative p-6 sm:p-8 lg:p-10">
                  <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#e3a56f]/10 blur-2xl" />

                  <div className="relative max-w-3xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-[#e3a56f]">
                      <Sparkles className="h-3.5 w-3.5" />
                      GlobeDk AI Learning
                    </div>

                    <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                      Learn Mathematics.
                      <br />
                      <span className="text-[#e3a56f]">
                        Understand it.
                      </span>
                    </h2>

                    <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
                      Ask questions, practise exam-style problems,
                      fix mistakes and prepare for your ZIMSEC
                      Mathematics examinations with your personal AI tutor.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/70">
                        O-Level
                      </span>

                      <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/70">
                        ZIMSEC
                      </span>

                      <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/70">
                        Mathematics
                      </span>

                      <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/70">
                        Step-by-step teaching
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            )}

          {/* QUICK MODES */}
          {!activeSession &&
            messages.length ===
              0 && (
              <section className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-[#10243d]">
                      What do you want to do?
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Choose a revision mode to get started.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {MODES.map(
                    mode => {
                      const Icon =
                        mode.icon

                      return (
                        <button
                          key={
                            mode.id
                          }
                          type="button"
                          onClick={() =>
                            chooseMode(
                              mode.id
                            )
                          }
                          className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#e3a56f]/60 hover:shadow-md"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10243d]/5 text-[#10243d] transition group-hover:bg-[#10243d] group-hover:text-[#e3a56f]">
                              <Icon className="h-5 w-5" />
                            </div>

                            <ChevronLeft className="h-4 w-4 rotate-180 text-slate-300 transition group-hover:text-[#b15d2b]" />
                          </div>

                          <p className="text-sm font-black text-[#10243d]">
                            {mode.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {
                              mode.description
                            }
                          </p>
                        </button>
                      )
                    }
                  )}
                </div>
              </section>
            )}

          {/* WORKSPACE */}
          <div className="grid min-h-[calc(100vh-145px)] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
            {/* CHAT */}
            <section className="flex min-h-[600px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {/* CHAT HEADER */}
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10243d]">
                    <Brain className="h-5 w-5 text-[#e3a56f]" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-black text-[#10243d]">
                        {activeSession?.title ||
                          "Start a revision session"}
                      </p>

                      <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-600 sm:inline">
                        AI Tutor
                      </span>
                    </div>

                    <p className="truncate text-xs text-slate-400">
                      {currentTopic ||
                        "Ask me anything about Mathematics"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowModes(
                      value =>
                        !value
                    )
                  }
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#b15d2b]" />
                  <span className="hidden sm:inline">
                    {MODES.find(
                      mode =>
                        mode.id ===
                        selectedMode
                    )?.title ||
                      "Chat"}
                  </span>
                </button>
              </div>

              {/* MODE DROPDOWN */}
              {showModes && (
                <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {MODES.map(
                      mode => (
                        <button
                          key={
                            mode.id
                          }
                          type="button"
                          onClick={() =>
                            chooseMode(
                              mode.id
                            )
                          }
                          className={`rounded-xl border px-3 py-3 text-left transition ${
                            selectedMode ===
                            mode.id
                              ? "border-[#e3a56f] bg-[#e3a56f]/10"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <p className="text-xs font-black text-[#10243d]">
                            {
                              mode.title
                            }
                          </p>

                          <p className="mt-1 text-[10px] leading-4 text-slate-500">
                            {
                              mode.description
                            }
                          </p>
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/50 to-white px-4 py-5 sm:px-6">
                {messages.length ===
                  0 && (
                  <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#10243d] shadow-lg">
                      <Sparkles className="h-7 w-7 text-[#e3a56f]" />
                    </div>

                    <h3 className="text-lg font-black text-[#10243d]">
                      Your AI tutor is ready
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                      Ask a Mathematics question and I will help
                      you understand it step by step.
                    </p>

                    <div className="mt-6 grid max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
                      {[
                        "Explain factorisation",
                        "Help me with simultaneous equations",
                        "Give me a Paper 1 practice question",
                        "How should I prepare for Paper 2?",
                      ].map(
                        suggestion => (
                          <button
                            key={
                              suggestion
                            }
                            type="button"
                            onClick={() => {
                              setMessage(
                                suggestion
                              )

                              textareaRef.current?.focus()
                            }}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-xs font-semibold text-slate-600 shadow-sm transition hover:border-[#e3a56f]/60 hover:text-[#10243d]"
                          >
                            {suggestion}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div className="mx-auto max-w-4xl space-y-5">
                  {messages.map(
                    item => {
                      const isUser =
                        item.role ===
                        "user"

                      return (
                        <div
                          key={
                            item.id
                          }
                          className={`flex gap-3 ${
                            isUser
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {!isUser && (
                            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#10243d]">
                              <Brain className="h-4 w-4 text-[#e3a56f]" />
                            </div>
                          )}

                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[75%] ${
                              isUser
                                ? "rounded-br-md bg-[#10243d] text-white"
                                : "rounded-bl-md border border-slate-100 bg-white text-slate-700"
                            }`}
                          >
                            {isUser ? (
                              <p className="whitespace-pre-wrap">
                                {
                                  item.content
                                }
                              </p>
                            ) : (
                              <div>
                                {renderMessageText(
                                  item.content
                                )}

                                <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-2 text-[9px] font-medium text-slate-400">
                                  <Sparkles className="h-3 w-3" />
                                  AI Revision Coach
                                  <span>
                                    •
                                  </span>
                                  {formatTime(
                                    item.created_at
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {isUser && (
                            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e3a56f] text-[10px] font-black text-[#10243d]">
                              {initials(
                                student
                              )}
                            </div>
                          )}
                        </div>
                      )
                    }
                  )}

                  {sending && (
                    <div className="flex gap-3">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#10243d]">
                        <Brain className="h-4 w-4 text-[#e3a56f]" />
                      </div>

                      <div className="rounded-2xl rounded-bl-md border border-slate-100 bg-white px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:120ms]" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:240ms]" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    ref={
                      messagesEndRef
                    }
                  />
                </div>
              </div>

              {/* COMPOSER */}
              <div className="border-t border-slate-100 bg-white p-3 sm:p-4">
                {currentTopic && (
                  <div className="mb-2 flex items-center gap-2 px-1">
                    <span className="rounded-full bg-[#e3a56f]/15 px-2.5 py-1 text-[10px] font-bold text-[#9a4f24]">
                      Topic:{" "}
                      {currentTopic}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedTopic(
                          ""
                        )
                      }
                      className="text-[10px] text-slate-400 hover:text-slate-600"
                    >
                      Change
                    </button>
                  </div>
                )}

                <form
                  onSubmit={
                    sendMessage
                  }
                  className="relative"
                >
                  <textarea
                    ref={
                      textareaRef
                    }
                    value={
                      message
                    }
                    onChange={event =>
                      setMessage(
                        event.target
                          .value
                      )
                    }
                    onKeyDown={
                      handleKeyDown
                    }
                    disabled={
                      sending
                    }
                    rows={2}
                    placeholder={
                      "Ask your Mathematics question..."
                    }
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-14 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#e3a56f] focus:bg-white focus:ring-4 focus:ring-[#e3a56f]/10 disabled:opacity-60"
                  />

                  <button
                    type="submit"
                    disabled={
                      sending ||
                      !message.trim()
                    }
                    className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#10243d] text-[#e3a56f] transition hover:bg-[#173451] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </form>

                <div className="mt-2 flex items-center justify-between px-1">
                  <p className="text-[10px] text-slate-400">
                    Press Enter to send • Shift + Enter for a new line
                  </p>

                  <p className="text-[10px] font-semibold text-slate-400">
                    1 AI credit per response
                  </p>
                </div>
              </div>
            </section>

            {/* RIGHT PANEL */}
            <aside className="space-y-4">
              {/* STUDENT PROFILE */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10243d] text-sm font-black text-[#e3a56f]">
                    {initials(
                      student
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-[#10243d]">
                      {student?.firstName ||
                        "Student"}{" "}
                      {student?.lastName ||
                        ""}
                    </p>

                    <p className="text-xs text-slate-400">
                      {student?.level ||
                        "O-Level"}{" "}
                      •{" "}
                      {student?.curriculum ||
                        "ZIMSEC"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Credits
                    </p>

                    <p className="mt-1 text-lg font-black text-[#10243d]">
                      {credits.balance}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Sessions
                    </p>

                    <p className="mt-1 text-lg font-black text-[#10243d]">
                      {sessions.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* WEAK TOPICS */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-[#10243d]">
                      Focus areas
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      Topics to revise
                    </p>
                  </div>

                  <Target className="h-5 w-5 text-[#b15d2b]" />
                </div>

                {weakTopics.length ===
                0 ? (
                  <div className="rounded-2xl bg-slate-50 p-4 text-center">
                    <Target className="mx-auto h-5 w-5 text-slate-300" />

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Start revising topics and your focus areas will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {weakTopics.map(
                      item => {
                        const mastery =
                          Math.max(
                            0,
                            Math.min(
                              100,
                              Number(
                                item.mastery_score
                              )
                            )
                          )

                        return (
                          <button
                            type="button"
                            key={
                              item.id
                            }
                            onClick={() => {
                              setSelectedTopic(
                                item.topic
                              )

                              setSelectedMode(
                                "explain"
                              )

                              if (
                                !activeSession
                              ) {
                                createNewSession(
                                  item.topic
                                )
                              }
                            }}
                            className="w-full text-left"
                          >
                            <div className="mb-1.5 flex items-center justify-between gap-3">
                              <span className="truncate text-xs font-bold text-slate-700">
                                {
                                  item.topic
                                }
                              </span>

                              <span className="shrink-0 text-[10px] font-black text-slate-400">
                                {mastery}%
                              </span>
                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-[#b15d2b] transition-all"
                                style={{
                                  width: `${mastery}%`,
                                }}
                              />
                            </div>
                          </button>
                        )
                      }
                    )}
                  </div>
                )}
              </div>

              {/* QUICK ACTIONS */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <p className="text-sm font-black text-[#10243d]">
                    Quick actions
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Jump straight into revision.
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      title:
                        "Explain a topic",
                      mode:
                        "explain" as RevisionMode,
                      icon:
                        Lightbulb,
                    },
                    {
                      title:
                        "Practice questions",
                      mode:
                        "practice" as RevisionMode,
                      icon:
                        BookOpen,
                    },
                    {
                      title:
                        "Fix a mistake",
                      mode:
                        "mistake_fix" as RevisionMode,
                      icon:
                        Target,
                    },
                    {
                      title:
                        "Exam preparation",
                      mode:
                        "exam_prep" as RevisionMode,
                      icon:
                        GraduationCap,
                    },
                  ].map(
                    action => {
                      const Icon =
                        action.icon

                      return (
                        <button
                          key={
                            action.mode
                          }
                          type="button"
                          onClick={() => {
                            setSelectedMode(
                              action.mode
                            )

                            if (
                              !activeSession
                            ) {
                              createNewSession(
                                selectedTopic
                              )
                            }
                          }}
                          className="flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-left transition hover:border-[#e3a56f]/50 hover:bg-[#e3a56f]/5"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#10243d] shadow-sm">
                            <Icon className="h-4 w-4" />
                          </div>

                          <span className="text-xs font-bold text-slate-700">
                            {
                              action.title
                            }
                          </span>
                        </button>
                      )
                    }
                  )}
                </div>
              </div>

              {/* CREDIT NOTICE */}
              <div className="rounded-3xl bg-[#10243d] p-5 text-white shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Zap className="h-4 w-4 text-[#e3a56f]" />
                  </div>

                  <div>
                    <p className="text-sm font-black">
                      AI Credits
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-white/55">
                      Each AI Revision Coach response uses one AI credit.
                    </p>

                    {credits.balance ===
                      0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setShowPayment(
                            true
                          )
                        }
                        className="mt-3 rounded-lg bg-[#e3a56f] px-3 py-2 text-[10px] font-black text-[#10243d]"
                      >
                        Get more credits
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* PAYMENT MODAL */}
      {showPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10243d]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="bg-[#10243d] p-6">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3a56f]">
                  <Zap className="h-6 w-6 text-[#10243d]" />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowPayment(
                      false
                    )
                  }
                  className="rounded-xl p-2 text-white/50 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <h3 className="mt-5 text-xl font-black text-white">
                AI credits finished
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/60">
                You have used all your available AI credits.
                Purchase more credits to continue using the
                Revision Coach.
              </p>
            </div>

            <div className="p-6">
              <div className="mb-5 rounded-2xl border border-[#e3a56f]/30 bg-[#e3a56f]/10 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#b15d2b]" />

                  <div>
                    <p className="text-sm font-black text-[#10243d]">
                      Current balance
                    </p>

                    <p className="text-xs text-slate-500">
                      {credits.balance} AI credits remaining
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment integration can be connected here */}
              <button
                type="button"
                onClick={() =>
                  setShowPayment(
                    false
                  )
                }
                className="w-full rounded-xl bg-[#10243d] px-4 py-3 text-sm font-black text-[#e3a56f] transition hover:bg-[#173451]"
              >
                Continue to payment
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowPayment(
                    false
                  )
                }
                className="mt-2 w-full rounded-xl px-4 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* =============================================================
   AI HUB SIDEBAR ITEM
============================================================= */

function SidebarItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: ElementType
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
      <span>{label}</span>
    </button>
  )
}

/* =============================================================
   AI HUB MOBILE NAV ITEM
============================================================= */

function MobileNavItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: ElementType
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
      {label}
    </button>
  )
}
