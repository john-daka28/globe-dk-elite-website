"use client"

import {
  AlertCircle,
  CheckCircle2,
  Database,
  FileText,
  Loader2,
  Upload,
} from "lucide-react"

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react"

import TutorSidebar from "@/components/tutor/TutorSidebar"

type Paper = {
  id: string
  exam_year: number
  session: string | null
  paper: "Paper 1" | "Paper 2"
  title: string | null
  original_file_name: string
  extraction_status:
    | "pending"
    | "processing"
    | "completed"
    | "failed"
  extraction_error: string | null
  question_count: number
  processed_by_model: string | null
  created_at: string
}

type TopicStatistic = {
  id: string
  topic: string
  subtopic: string | null
  paper: "Paper 1" | "Paper 2"
  total_questions: number
  total_marks: number
  papers_appeared: number
  most_recent_year: number | null
  earliest_year: number | null
  average_marks: number | null
}

export default function AIKnowledgePage() {
  const [papers, setPapers] =
    useState<Paper[]>([])

  const [statistics, setStatistics] =
    useState<TopicStatistic[]>([])

  const [file, setFile] =
    useState<File | null>(null)

  const [examYear, setExamYear] =
    useState(
      new Date().getFullYear().toString()
    )

  const [session, setSession] =
    useState("")

  const [paper, setPaper] =
    useState<"Paper 1" | "Paper 2">(
      "Paper 1"
    )

  const [loading, setLoading] =
    useState(true)

  const [uploading, setUploading] =
    useState(false)

  const [message, setMessage] =
    useState("")

  const [error, setError] =
    useState("")

  async function loadKnowledgeBase() {
    try {
      setLoading(true)

      const [
        papersResponse,
        statisticsResponse,
      ] = await Promise.all([
        fetch(
          "/api/tutor/ai-knowledge/mathematics",
          {
            cache: "no-store",
          }
        ),

        fetch(
          "/api/tutor/ai-knowledge/mathematics/statistics",
          {
            cache: "no-store",
          }
        ),
      ])

      const papersData =
        await papersResponse.json()

      const statisticsData =
        await statisticsResponse.json()

      if (papersData.success) {
        setPapers(
          papersData.papers || []
        )
      }

      if (statisticsData.success) {
        setStatistics(
          statisticsData.statistics || []
        )
      }
    } catch {
      setError(
        "Could not load the AI knowledge base."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadKnowledgeBase()
  }, [])

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selected =
      event.target.files?.[0]

    if (!selected) {
      setFile(null)
      return
    }

    if (
      selected.type !==
      "application/pdf"
    ) {
      setError(
        "Please select a PDF file."
      )
      setFile(null)
      return
    }

    if (
      selected.size >
      20 * 1024 * 1024
    ) {
      setError(
        "The maximum PDF size is 20MB."
      )
      setFile(null)
      return
    }

    setError("")
    setMessage("")
    setFile(selected)
  }

  async function handleUpload(
    event: FormEvent
  ) {
    event.preventDefault()

    setError("")
    setMessage("")

    if (!file) {
      setError(
        "Please select a PDF paper."
      )
      return
    }

    const year = Number(examYear)

    if (
      !Number.isInteger(year) ||
      year < 1990 ||
      year > 2100
    ) {
      setError(
        "Please enter a valid examination year."
      )
      return
    }

    setUploading(true)

    try {
      const formData =
        new FormData()

      formData.append(
        "file",
        file
      )

      formData.append(
        "examYear",
        examYear
      )

      formData.append(
        "session",
        session
      )

      formData.append(
        "paper",
        paper
      )

      const response =
        await fetch(
          "/api/tutor/ai-knowledge/mathematics/upload",
          {
            method: "POST",
            body: formData,
          }
        )

      const data =
        await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Paper processing failed."
        )
      }

      setMessage(
        `Paper successfully processed. ${data.paper.questionCount} questions were added to the knowledge base.`
      )

      setFile(null)

      const input =
        document.getElementById(
          "paper-file"
        ) as HTMLInputElement | null

      if (input) {
        input.value = ""
      }

      await loadKnowledgeBase()
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Could not process the paper."
      )
    } finally {
      setUploading(false)
    }
  }

  const completedPapers =
    papers.filter(
      (item) =>
        item.extraction_status ===
        "completed"
    )

  const totalQuestions =
    completedPapers.reduce(
      (sum, item) =>
        sum + item.question_count,
      0
    )

  const uniqueTopics =
    new Set(
      statistics.map(
        (item) => item.topic
      )
    ).size

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#10243d]">
      <TutorSidebar tutorName="Tutor" />

      <main className="lg:pl-64 pl-[72px]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10243d] text-white">
                <Database className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  ZIMSEC Mathematics
                  Knowledge Base
                </h1>

                <p className="text-sm text-slate-600">
                  Build GlobeDk AI's
                  examination knowledge from
                  historical Mathematics papers.
                </p>
              </div>
            </div>
          </div>

          {message && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

              <p className="text-sm">
                {message}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <p className="text-sm">
                {error}
              </p>
            </div>
          )}

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Papers processed
              </p>

              <p className="mt-2 text-3xl font-bold">
                {completedPapers.length}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Questions indexed
              </p>

              <p className="mt-2 text-3xl font-bold">
                {totalQuestions}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Topics detected
              </p>

              <p className="mt-2 text-3xl font-bold">
                {uniqueTopics}
              </p>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-bold">
                  Add past paper
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Upload a ZIMSEC O-Level
                  Mathematics PDF. Gemini will
                  read and classify its questions.
                </p>
              </div>

              <form
                onSubmit={handleUpload}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="paper-file"
                    className="mb-2 block text-sm font-semibold"
                  >
                    PDF paper
                  </label>

                  <label
                    htmlFor="paper-file"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-5 py-8 text-center transition hover:border-[#b15d2b]"
                  >
                    <Upload className="mb-3 h-7 w-7 text-[#b15d2b]" />

                    <span className="text-sm font-medium">
                      {file
                        ? file.name
                        : "Choose PDF"}
                    </span>

                    <span className="mt-1 text-xs text-slate-500">
                      Maximum 20MB
                    </span>
                  </label>

                  <input
                    id="paper-file"
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={
                      handleFileChange
                    }
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Examination year
                  </label>

                  <input
                    type="number"
                    min="1990"
                    max="2100"
                    value={examYear}
                    onChange={(event) =>
                      setExamYear(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#b15d2b]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Session
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. November"
                    value={session}
                    onChange={(event) =>
                      setSession(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#b15d2b]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Paper
                  </label>

                  <select
                    value={paper}
                    onChange={(event) =>
                      setPaper(
                        event.target
                          .value as
                          | "Paper 1"
                          | "Paper 2"
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#b15d2b]"
                  >
                    <option>
                      Paper 1
                    </option>

                    <option>
                      Paper 2
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={
                    uploading || !file
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#10243d] px-5 py-3 font-semibold text-white transition hover:bg-[#183553] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Analysing paper...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      Add to knowledge base
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 rounded-xl bg-[#f4f1ea] p-4">
                <p className="text-xs leading-5 text-slate-600">
                  Gemini will identify questions,
                  topics, subtopics, skills, marks,
                  question types and other
                  mathematical patterns. The
                  original PDF is retained in
                  Supabase Storage.
                </p>
              </div>
            </section>

            <section className="space-y-8">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[#b15d2b]" />

                  <h2 className="text-lg font-bold">
                    Historical papers
                  </h2>
                </div>

                {loading ? (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading knowledge base...
                  </div>
                ) : papers.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No Mathematics papers have
                    been added yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="px-3 py-3 font-semibold">
                            Year
                          </th>

                          <th className="px-3 py-3 font-semibold">
                            Paper
                          </th>

                          <th className="px-3 py-3 font-semibold">
                            Questions
                          </th>

                          <th className="px-3 py-3 font-semibold">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {papers.map(
                          (item) => (
                            <tr
                              key={item.id}
                              className="border-b border-slate-100"
                            >
                              <td className="px-3 py-3 font-medium">
                                {item.exam_year}
                              </td>

                              <td className="px-3 py-3">
                                {item.paper}
                              </td>

                              <td className="px-3 py-3">
                                {item.question_count}
                              </td>

                              <td className="px-3 py-3">
                                {item.extraction_status ===
                                "completed" ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Ready
                                  </span>
                                ) : item.extraction_status ===
                                  "processing" ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Processing
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                    Failed
                                  </span>
                                )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-bold">
                  Detected topic patterns
                </h2>

                {statistics.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Topic statistics will appear
                    after papers have been processed.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="px-3 py-3 font-semibold">
                            Topic
                          </th>

                          <th className="px-3 py-3 font-semibold">
                            Paper
                          </th>

                          <th className="px-3 py-3 font-semibold">
                            Questions
                          </th>

                          <th className="px-3 py-3 font-semibold">
                            Papers
                          </th>

                          <th className="px-3 py-3 font-semibold">
                            Latest
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {statistics
                          .slice(0, 30)
                          .map(
                            (item) => (
                              <tr
                                key={item.id}
                                className="border-b border-slate-100"
                              >
                                <td className="px-3 py-3">
                                  <div className="font-medium">
                                    {item.topic}
                                  </div>

                                  {item.subtopic && (
                                    <div className="text-xs text-slate-500">
                                      {item.subtopic}
                                    </div>
                                  )}
                                </td>

                                <td className="px-3 py-3">
                                  {item.paper}
                                </td>

                                <td className="px-3 py-3">
                                  {item.total_questions}
                                </td>

                                <td className="px-3 py-3">
                                  {item.papers_appeared}
                                </td>

                                <td className="px-3 py-3">
                                  {item.most_recent_year ||
                                    "—"}
                                </td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}