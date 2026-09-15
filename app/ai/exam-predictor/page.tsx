"use client"

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Coins,
  FileText,
  GraduationCap,
  Loader2,
  LogOut,
  Menu,
  Sparkles,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react"

import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  useEffect,
  useMemo,
  useState,
} from "react"

/* ============================================================
   TYPES
   ============================================================ */

type MathArrayValue =
  | string[]
  | string
  | null
  | undefined

type HistoricalEvidence = {
  id?: string
  question_id?: string

  question_number?: number
  question_label?: string | null

  reference?: string
  display_label?: string

  question_text?: string | null

  marks?: number | null

  exam_year?: number | null
  year?: number | null

  session?: string | null

  paper?: "Paper 1" | "Paper 2" | null

  paper_label?: string | null
  exam_label?: string | null

  topic?: string | null
  subtopic?: string | null

  skills?: MathArrayValue

  question_type?: string | null
  difficulty?: string | null

  paper_section?: string | null

  mathematical_objects?: MathArrayValue

  source_page_start?: number | null
  source_page_end?: number | null

  ai_classification_confidence?: number | null

  concept_family?: string | null
  question_family?: string | null

  variation_patterns?: MathArrayValue

  diagram_dependency?: string | null

  position_band?: string | null
}

type Prediction = {
  paper: "Paper 1" | "Paper 2"
  question_number: number

  topic: string
  subtopic?: string | null

  concept_family?: string | null
  question_family?: string | null

  predicted_question: string
  prediction_reason: string

  confidence:
    | "High"
    | "Medium"
    | "Low"
    | string
    | null
    | undefined

  prediction_score?: number

  historical_frequency?: number
  recency_score?: number
  variation_score?: number
  mark_weight_score?: number

  revision_advice?: string | null

  source_question_ids: string[]

  historical_evidence?: HistoricalEvidence[]
}

type Student = {
  id: string
  email: string
  firstName: string
  lastName: string
  level: "O-Level" | "A-Level"
  curriculum: "ZIMSEC" | "Cambridge"
}

type MeResponse = {
  authenticated: boolean

  student?: Student

  credits?: {
    balance: number
  }

  error?: string
}

type PredictorResponse = {
  success?: boolean
  error?: string
  code?: string
  requiresPayment?: boolean

  predictions?: Prediction[]

  runId?: string

  credits?: number

  source?: {
    paperCount?: number
    questionCount?: number
    patternCount?: number
    analysisType?: string
  }

  diagnostics?: {
    patternRowsFound?: number
    historicalEvidencePatternsFound?: number
    highestPredictionScore?: number
  }
}

/* ============================================================
   HELPERS
   ============================================================ */

function formatSession(
  session?: string | null
) {
  if (!session) return ""

  const normalized =
    session
      .trim()
      .toLowerCase()

  if (
    normalized === "nov" ||
    normalized === "november"
  ) {
    return "November"
  }

  if (
    normalized === "jun" ||
    normalized === "june"
  ) {
    return "June"
  }

  if (
    normalized === "may" ||
    normalized === "may/june"
  ) {
    return "May/June"
  }

  return session
}

function normaliseConfidenceLabel(
  confidence:
    | string
    | number
    | null
    | undefined
): "High" | "Medium" | "Low" {
  if (
    typeof confidence === "number"
  ) {
    if (confidence >= 80) return "High"
    if (confidence >= 55) return "Medium"
    return "Low"
  }

  const value =
    String(confidence ?? "")
      .trim()
      .toLowerCase()

  if (value === "high") return "High"
  if (value === "medium") return "Medium"

  if (
    value === "low"
  ) {
    return "Low"
  }

  return "Medium"
}

/* ============================================================
   ARRAY / JSON HELPERS
   ============================================================ */

function parseArrayValue(
  value: MathArrayValue
): string[] {
  if (!value) return []

  if (Array.isArray(value)) {
    return value
      .map((item) =>
        String(item)
          .trim()
      )
      .filter(Boolean)
  }

  const text =
    String(value).trim()

  if (!text) return []

  try {
    const parsed =
      JSON.parse(text)

    if (Array.isArray(parsed)) {
      return parsed
        .map((item) =>
          String(item)
            .trim()
        )
        .filter(Boolean)
    }
  } catch {
    // Not JSON; continue.
  }

  return text
    .split(/\s*[,;]\s*/)
    .map((item) =>
      item.trim()
    )
    .filter(Boolean)
}

/* ============================================================
   LATEX → STUDENT FRIENDLY UNICODE / LINEAR MATH
   ============================================================ */

function replaceSuperscript(
  value: string
) {
  const superscripts: Record<
    string,
    string
  > = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
    "+": "⁺",
    "-": "⁻",
    "=": "⁼",
    "(": "⁽",
    ")": "⁾",
    n: "ⁿ",
    x: "ˣ",
  }

  return value.replace(
    /\^\{([^{}]+)\}|\^([A-Za-z0-9()+\-]+)/g,
    (
      _match,
      grouped,
      single
    ) => {
      const content =
        String(
          grouped ??
            single ??
            ""
        )

      return content
        .split("")
        .map(
          (character) =>
            superscripts[
              character
            ] ??
            character
        )
        .join("")
    }
  )
}

function replaceSubscript(
  value: string
) {
  const subscripts: Record<
    string,
    string
  > = {
    "0": "₀",
    "1": "₁",
    "2": "₂",
    "3": "₃",
    "4": "₄",
    "5": "₅",
    "6": "₆",
    "7": "₇",
    "8": "₈",
    "9": "₉",
    "+": "₊",
    "-": "₋",
    "=": "₌",
    "(": "₍",
    ")": "₎",
    a: "ₐ",
    e: "ₑ",
    h: "ₕ",
    i: "ᵢ",
    j: "ⱼ",
    k: "ₖ",
    l: "ₗ",
    m: "ₘ",
    n: "ₙ",
    o: "ₒ",
    p: "ₚ",
    r: "ᵣ",
    s: "ₛ",
    t: "ₜ",
    u: "ᵤ",
    v: "ᵥ",
    x: "ₓ",
  }

  return value.replace(
    /_\{([^{}]+)\}|_([A-Za-z0-9()+\-]+)/g,
    (
      _match,
      grouped,
      single
    ) => {
      const content =
        String(
          grouped ??
            single ??
            ""
        )

      return content
        .split("")
        .map(
          (character) =>
            subscripts[
              character
            ] ??
            character
        )
        .join("")
    }
  )
}

function normaliseMathSymbols(
  value: string
) {
  return value
    .replace(
      /\\left/g,
      ""
    )
    .replace(
      /\\right/g,
      ""
    )
    .replace(
      /\\times/g,
      "×"
    )
    .replace(
      /\\cdot/g,
      "·"
    )
    .replace(
      /\\div/g,
      "÷"
    )
    .replace(
      /\\pm/g,
      "±"
    )
    .replace(
      /\\mp/g,
      "∓"
    )
    .replace(
      /\\leq/g,
      "≤"
    )
    .replace(
      /\\le/g,
      "≤"
    )
    .replace(
      /\\geq/g,
      "≥"
    )
    .replace(
      /\\ge/g,
      "≥"
    )
    .replace(
      /\\neq/g,
      "≠"
    )
    .replace(
      /\\approx/g,
      "≈"
    )
    .replace(
      /\\infty/g,
      "∞"
    )
    .replace(
      /\\pi/g,
      "π"
    )
    .replace(
      /\\theta/g,
      "θ"
    )
    .replace(
      /\\alpha/g,
      "α"
    )
    .replace(
      /\\beta/g,
      "β"
    )
    .replace(
      /\\gamma/g,
      "γ"
    )
    .replace(
      /\\delta/g,
      "δ"
    )
    .replace(
      /\\lambda/g,
      "λ"
    )
    .replace(
      /\\mu/g,
      "μ"
    )
    .replace(
      /\\sigma/g,
      "σ"
    )
    .replace(
      /\\sqrt/g,
      "√"
    )
    .replace(
      /\\%/g,
      "%"
    )
    .replace(
      /\\,/g,
      " "
    )
    .replace(
      /\\;/g,
      " "
    )
    .replace(
      /\\!/g,
      ""
    )
}

function convertMatrix(
  value: string
) {
  return value.replace(
    /\\begin\{(?:pmatrix|bmatrix|matrix)\}([\s\S]*?)\\end\{(?:pmatrix|bmatrix|matrix)\}/g,
    (_match, content) => {
      const rows =
        String(content)
          .split(/\\\\/)
          .map(
            (row: string) =>
              row
                .trim()
                .replace(
                  /\s*&\s*/g,
                  "    "
                )
          )
          .filter(Boolean)

      if (!rows.length) {
        return ""
      }

      return `[ ${rows.join(
        "  ;  "
      )} ]`
    }
  )
}

function convertFractions(
  value: string
) {
  let result = value

  /*
   * Repeatedly handle:
   *
   * \frac{a}{b}
   * \dfrac{a}{b}
   * \tfrac{a}{b}
   */

  let previous = ""

  while (
    result !== previous
  ) {
    previous = result

    result =
      result.replace(
        /\\(?:dfrac|tfrac|frac)\{([^{}]*)\}\{([^{}]*)\}/g,
        "($1)/($2)"
      )
  }

  /*
   * Handle simple nested fractions after
   * the first pass.
   */

  result =
    result.replace(
      /\\(?:dfrac|tfrac|frac)\s*([A-Za-z0-9.+\-]+)\s*\{([^{}]*)\}/g,
      "($1)/($2)"
    )

  return result
}

function removeLatexFormatting(
  value: string
) {
  return value
    .replace(
      /\\text\{([^{}]*)\}/g,
      "$1"
    )
    .replace(
      /\\mathrm\{([^{}]*)\}/g,
      "$1"
    )
    .replace(
      /\\mathbf\{([^{}]*)\}/g,
      "$1"
    )
    .replace(
      /\\operatorname\{([^{}]*)\}/g,
      "$1"
    )
    .replace(
      /\\overline\{([^{}]*)\}/g,
      "$1"
    )
    .replace(
      /\\underline\{([^{}]*)\}/g,
      "$1"
    )
    .replace(
      /\\hat\{([^{}]*)\}/g,
      "$1"
    )
    .replace(
      /\\bar\{([^{}]*)\}/g,
      "$1"
    )
}

function cleanMathBraces(
  value: string
) {
  return value
    .replace(
      /\{([^{}]*)\}/g,
      "$1"
    )
    .replace(
      /[{}]/g,
      ""
    )
}

function formatMathText(
  input?: string | null
) {
  if (!input) return ""

  let value =
    String(input)

  /*
   * Some rows in Supabase may contain
   * escaped LaTeX such as \\frac.
   */
  value =
    value.replace(
      /\\\\/g,
      "\\"
    )

  /*
   * Remove inline math delimiters.
   */
  value =
    value
      .replace(
        /\$\$([\s\S]*?)\$\$/g,
        "$1"
      )
      .replace(
        /\$([\s\S]*?)\$/g,
        "$1"
      )
      .replace(
        /\\\(([\s\S]*?)\\\)/g,
        "$1"
      )
      .replace(
        /\\\[([\s\S]*?)\\\]/g,
        "$1"
      )

  value =
    convertMatrix(value)

  value =
    convertFractions(value)

  value =
    removeLatexFormatting(
      value
    )

  value =
    normaliseMathSymbols(
      value
    )

  value =
    replaceSuperscript(
      value
    )

  value =
    replaceSubscript(
      value
    )

  value =
    cleanMathBraces(
      value
    )

  /*
   * Common remaining LaTeX spacing /
   * alignment characters.
   */
  value =
    value
      .replace(
        /\\begin\{[^}]+\}/g,
        ""
      )
      .replace(
        /\\end\{[^}]+\}/g,
        ""
      )
      .replace(
        /&/g,
        " "
      )
      .replace(
        /\\newline/g,
        "\n"
      )
      .replace(
        /\\linebreak/g,
        "\n"
      )
      .replace(
        /\\quad/g,
        "    "
      )
      .replace(
        /\\qquad/g,
        "        "
      )
      .replace(
        /\\ /g,
        " "
      )
      .replace(
        /\\([A-Za-z]+)/g,
        "$1"
      )

  /*
   * Database sometimes contains badly encoded
   * superscript characters.
   */
  value =
    value
      .replace(
        /Â³/g,
        "³"
      )
      .replace(
        /Â²/g,
        "²"
      )
      .replace(
        /Â¹/g,
        "¹"
      )

  /*
   * Make minus signs mathematically readable.
   */
  value =
    value.replace(
      /(?<!\w)-(?=\d)/g,
      "−"
    )

  /*
   * Collapse excessive spaces but preserve
   * intentional new lines.
   */
  value =
    value
      .split("\n")
      .map((line) =>
        line
          .replace(
            /[ \t]{2,}/g,
            " "
          )
          .trim()
      )
      .join("\n")
      .trim()

  return value
}

/* ============================================================
   QUESTION TEXT FORMATTER
   ============================================================ */

function splitQuestionParts(
  questionText?: string | null
) {
  if (!questionText) {
    return []
  }

  const formatted =
    formatMathText(
      questionText
    )

  /*
   * Preserve exam subparts such as:
   * (a)
   * (b)
   * (c)
   */
  const parts =
    formatted.split(
      /(?=\([a-z]\)\s*)/gi
    )

  return parts
    .map((part) =>
      part.trim()
    )
    .filter(Boolean)
}

/* ============================================================
   DISPLAY LABEL HELPERS
   ============================================================ */

function formatTitle(
  value?: string | null
) {
  if (!value) return ""

  return value
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim()
}

function formatQuestionLabel(
  evidence: HistoricalEvidence
) {
  if (
    evidence.question_label
  ) {
    return evidence.question_label
  }

  if (
    typeof evidence.question_number ===
    "number"
  ) {
    return `Q${evidence.question_number}`
  }

  return "Question"
}

function getEvidenceYear(
  evidence: HistoricalEvidence
) {
  return (
    evidence.exam_year ??
    evidence.year ??
    null
  )
}

function getEvidencePaper(
  evidence: HistoricalEvidence
) {
  return (
    evidence.paper?.trim() ||
    evidence.paper_label?.trim() ||
    ""
  )
}

function getEvidenceSession(
  evidence: HistoricalEvidence
) {
  return evidence.session
    ? formatSession(
        evidence.session
      )
    : ""
}

/* ============================================================
   GROUPING
   ============================================================ */

type EvidenceGroup = {
  key: string
  topic: string
  pattern: string
  questions: HistoricalEvidence[]
}

function groupHistoricalEvidence(
  evidence: HistoricalEvidence[]
): EvidenceGroup[] {
  const groups =
    new Map<
      string,
      EvidenceGroup
    >()

  for (const question of evidence) {
    const topic =
      formatTitle(
        question.topic
      ) ||
      "Other Mathematics"

    const pattern =
      formatTitle(
        question.question_family
      ) ||
      formatTitle(
        question.concept_family
      ) ||
      formatTitle(
        question.subtopic
      ) ||
      "General question pattern"

    const key =
      `${topic}|||${pattern}`

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        topic,
        pattern,
        questions: [],
      })
    }

    groups
      .get(key)!
      .questions.push(
        question
      )
  }

  return Array.from(
    groups.values()
  )
}

/* ============================================================
   CONFIDENCE BADGE
   ============================================================ */

function ConfidenceBadge({
  confidence,
}: {
  confidence:
    | string
    | number
    | null
    | undefined
}) {
  const label =
    normaliseConfidenceLabel(
      confidence
    )

  const className =
    label === "High"
      ? "border-green-200 bg-green-50 text-green-700"
      : label === "Medium"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-slate-200 bg-slate-100 text-slate-600"

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-black ${className}`}
    >
      <Target className="h-3.5 w-3.5" />
      {label} confidence
    </span>
  )
}

/* ============================================================
   SMALL META BADGE
   ============================================================ */

function MetaBadge({
  children,
  dark = false,
}: {
  children: React.ReactNode
  dark?: boolean
}) {
  return (
    <span
      className={
        dark
          ? "inline-flex items-center rounded-full bg-[#10243d] px-3 py-1.5 text-xs font-black text-white"
          : "inline-flex items-center rounded-full border border-[#10243d]/10 bg-[#f4f1ea] px-3 py-1.5 text-xs font-bold text-[#10243d]"
      }
    >
      {children}
    </span>
  )
}

/* ============================================================
   HISTORICAL QUESTION CARD
   ============================================================ */

function HistoricalQuestionCard({
  evidence,
  index,
}: {
  evidence: HistoricalEvidence
  index: number
}) {
  const questionParts =
    splitQuestionParts(
      evidence.question_text
    )

  const skills =
    parseArrayValue(
      evidence.skills
    )

  const mathematicalObjects =
    parseArrayValue(
      evidence.mathematical_objects
    )

  const variationPatterns =
    parseArrayValue(
      evidence.variation_patterns
    )

  const year =
    getEvidenceYear(
      evidence
    )

  const session =
    getEvidenceSession(
      evidence
    )

  const paper =
    getEvidencePaper(
      evidence
    )

  const topic =
    formatTitle(
      evidence.topic
    )

  const subtopic =
    formatTitle(
      evidence.subtopic
    )

  const questionFamily =
    formatTitle(
      evidence.question_family
    )

  const conceptFamily =
    formatTitle(
      evidence.concept_family
    )

  const difficulty =
    formatTitle(
      evidence.difficulty
    )

  const paperSection =
    formatTitle(
      evidence.paper_section
    )

  const positionBand =
    formatTitle(
      evidence.position_band
    )

  const questionType =
    formatTitle(
      evidence.question_type
    )

  const diagramDependency =
    formatTitle(
      evidence.diagram_dependency
    )

  return (
    <article
      className="rounded-2xl border border-[#10243d]/10 bg-white p-5 shadow-sm transition hover:border-[#b15d2b]/30 hover:shadow-md"
    >
      {/* ======================================================
          QUESTION HEADER
          ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-lg bg-[#10243d] px-3 py-1.5 text-sm font-black text-white">
              {formatQuestionLabel(
                evidence
              )}
            </span>

            {year && (
              <MetaBadge>
                {year}
              </MetaBadge>
            )}

            {session && (
              <MetaBadge>
                {session}
              </MetaBadge>
            )}

            {paper && (
              <MetaBadge>
                {paper}
              </MetaBadge>
            )}

            {typeof evidence.marks ===
              "number" && (
              <span className="inline-flex items-center rounded-full border border-[#b15d2b]/20 bg-[#b15d2b]/10 px-3 py-1.5 text-xs font-black text-[#b15d2b]">
                {evidence.marks}{" "}
                {evidence.marks === 1
                  ? "mark"
                  : "marks"}
              </span>
            )}
          </div>

          <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-[#10243d]/35">
            Historical ZIMSEC question
            {index > 0
              ? ` • Evidence ${index + 1}`
              : ""}
          </p>
        </div>

        {typeof evidence.ai_classification_confidence ===
          "number" && (
          <div className="shrink-0 rounded-xl bg-slate-50 px-3 py-2 text-right">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              AI classification
            </p>

            <p className="mt-0.5 text-sm font-black text-[#10243d]">
              {
                evidence.ai_classification_confidence
              }
              %
            </p>
          </div>
        )}
      </div>

      {/* ======================================================
          TOPIC / SUBTOPIC
          ====================================================== */}

      {(topic ||
        subtopic ||
        conceptFamily ||
        questionFamily) && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {topic && (
            <div className="rounded-xl border border-[#10243d]/10 bg-[#f4f1ea]/60 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#b15d2b]">
                Topic
              </p>

              <p className="mt-1 text-sm font-black text-[#10243d]">
                {topic}
              </p>
            </div>
          )}

          {subtopic && (
            <div className="rounded-xl border border-[#10243d]/10 bg-[#f4f1ea]/60 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#b15d2b]">
                Subtopic
              </p>

              <p className="mt-1 text-sm font-bold text-[#10243d]">
                {subtopic}
              </p>
            </div>
          )}

          {conceptFamily && (
            <div className="rounded-xl border border-[#10243d]/10 bg-white p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#10243d]/40">
                Concept family
              </p>

              <p className="mt-1 text-sm font-bold text-[#10243d]">
                {conceptFamily}
              </p>
            </div>
          )}

          {questionFamily && (
            <div className="rounded-xl border border-[#10243d]/10 bg-white p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#10243d]/40">
                Question family
              </p>

              <p className="mt-1 text-sm font-bold text-[#10243d]">
                {questionFamily}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ======================================================
          QUESTION
          ====================================================== */}

      <div className="mt-5 overflow-hidden rounded-2xl border border-[#10243d]/10">
        <div className="flex items-center gap-2 border-b border-[#10243d]/10 bg-[#10243d]/[0.035] px-4 py-3">
          <FileText className="h-4 w-4 text-[#b15d2b]" />

          <p className="text-xs font-black uppercase tracking-[0.15em] text-[#10243d]">
            Question
          </p>
        </div>

        <div className="p-5">
          {questionParts.length > 0 ? (
            <div className="space-y-4">
              {questionParts.map(
                (
                  part,
                  partIndex
                ) => {
                  const match =
                    part.match(
                      /^\(([a-z])\)\s*/i
                    )

                  const label =
                    match?.[1]
                      ? `(${match[1]})`
                      : null

                  const text =
                    label
                      ? part
                          .replace(
                            /^\([a-z]\)\s*/i,
                            ""
                          )
                          .trim()
                      : part

                  return (
                    <div
                      key={`${evidence.id ?? "question"}-${partIndex}`}
                      className={
                        label
                          ? "flex gap-3"
                          : ""
                      }
                    >
                      {label && (
                        <span className="mt-0.5 shrink-0 text-sm font-black text-[#b15d2b]">
                          {label}
                        </span>
                      )}

                      <p className="whitespace-pre-wrap text-[15px] leading-8 text-[#10243d]">
                        {text}
                      </p>
                    </div>
                  )
                }
              )}
            </div>
          ) : (
            <p className="text-sm italic text-slate-400">
              Question text is not available.
            </p>
          )}
        </div>
      </div>

      {/* ======================================================
          QUESTION CLASSIFICATION
          ====================================================== */}

      {(difficulty ||
        questionType ||
        paperSection ||
        positionBand ||
        diagramDependency) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {difficulty && (
            <MetaBadge>
              Difficulty:{" "}
              {difficulty}
            </MetaBadge>
          )}

          {questionType && (
            <MetaBadge>
              {questionType}
            </MetaBadge>
          )}

          {paperSection && (
            <MetaBadge>
              {paperSection}
            </MetaBadge>
          )}

          {positionBand && (
            <MetaBadge>
              Position:{" "}
              {positionBand}
            </MetaBadge>
          )}

          {diagramDependency &&
            diagramDependency
              .toLowerCase() !==
              "none" && (
              <MetaBadge>
                Diagram:{" "}
                {diagramDependency}
              </MetaBadge>
            )}
        </div>
      )}

      {/* ======================================================
          SKILLS
          ====================================================== */}

      {skills.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.15em] text-[#10243d]/40">
            Skills tested
          </p>

          <div className="flex flex-wrap gap-2">
            {skills.map(
              (
                skill,
                skillIndex
              ) => (
                <span
                  key={`${skill}-${skillIndex}`}
                  className="rounded-lg bg-[#10243d]/[0.045] px-3 py-2 text-xs font-semibold leading-5 text-[#10243d]/75"
                >
                  {formatMathText(
                    skill
                  )}
                </span>
              )
            )}
          </div>
        </div>
      )}

      {/* ======================================================
          MATHEMATICAL OBJECTS
          ====================================================== */}

      {mathematicalObjects.length >
        0 && (
        <details className="mt-5 overflow-hidden rounded-xl border border-[#10243d]/10">
          <summary className="cursor-pointer list-none px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#10243d]">
            Mathematical objects
            <ChevronDown className="ml-2 inline h-4 w-4" />
          </summary>

          <div className="border-t border-[#10243d]/10 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {mathematicalObjects.map(
                (
                  object,
                  objectIndex
                ) => (
                  <span
                    key={`${object}-${objectIndex}`}
                    className="rounded-lg bg-white px-3 py-2 font-mono text-sm text-[#10243d] shadow-sm"
                  >
                    {formatMathText(
                      object
                    )}
                  </span>
                )
              )}
            </div>
          </div>
        </details>
      )}

      {/* ======================================================
          VARIATION PATTERNS
          ====================================================== */}

      {variationPatterns.length >
        0 && (
        <div className="mt-5 rounded-xl border border-[#b15d2b]/15 bg-[#b15d2b]/[0.045] p-4">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-[#b15d2b]">
            Observed variation patterns
          </p>

          <ul className="space-y-2">
            {variationPatterns.map(
              (
                pattern,
                patternIndex
              ) => (
                <li
                  key={`${pattern}-${patternIndex}`}
                  className="flex gap-2 text-sm leading-6 text-[#10243d]/75"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b15d2b]" />

                  <span>
                    {formatMathText(
                      pattern
                    )}
                  </span>
                </li>
              )
            )}
          </ul>
        </div>
      )}

      {/* ======================================================
          SOURCE PAGE
          ====================================================== */}

      {(typeof evidence.source_page_start ===
        "number" ||
        typeof evidence.source_page_end ===
          "number") && (
        <p className="mt-4 text-xs font-medium text-slate-400">
          Source page
          {evidence.source_page_start &&
          evidence.source_page_end &&
          evidence.source_page_start !==
            evidence.source_page_end
            ? `s ${evidence.source_page_start}–${evidence.source_page_end}`
            : ` ${evidence.source_page_start ?? evidence.source_page_end}`}
        </p>
      )}
    </article>
  )
}

/* ============================================================
   GROUPED HISTORICAL EVIDENCE
   ============================================================ */

function HistoricalEvidenceGroups({
  evidence,
}: {
  evidence: HistoricalEvidence[]
}) {
  const groups =
    useMemo(
      () =>
        groupHistoricalEvidence(
          evidence
        ),
      [evidence]
    )

  if (!evidence.length) {
    return null
  }

  return (
    <div className="mt-6 rounded-2xl border border-[#10243d]/10 bg-[#10243d]/[0.025] p-4 sm:p-5">
      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#b15d2b]" />

            <h4 className="text-lg font-black text-[#10243d]">
              Historical evidence
            </h4>
          </div>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Actual ZIMSEC questions from
            the historical papers used to
            support this prediction.
          </p>
        </div>

        <span className="inline-flex w-fit items-center rounded-full bg-[#10243d] px-3 py-1.5 text-xs font-black text-white">
          {evidence.length}{" "}
          {evidence.length === 1
            ? "question"
            : "questions"}
        </span>
      </div>

      {/* ======================================================
          GROUPS
          ====================================================== */}

      <div className="mt-6 space-y-6">
        {groups.map(
          (group) => (
            <section
              key={group.key}
            >
              {/* GROUP HEADER */}

              <div className="mb-3 rounded-xl border border-[#10243d]/10 bg-white px-4 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#b15d2b]/10 px-3 py-1.5 text-xs font-black text-[#b15d2b]">
                    {group.topic}
                  </span>

                  <ArrowRight className="h-3.5 w-3.5 text-slate-300" />

                  <span className="text-sm font-black text-[#10243d]">
                    {group.pattern}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  {group.questions.length}{" "}
                  historical{" "}
                  {group.questions.length ===
                  1
                    ? "question"
                    : "questions"}{" "}
                  in this pattern
                </p>
              </div>

              {/* QUESTIONS */}

              <div className="space-y-4">
                {group.questions.map(
                  (
                    question,
                    questionIndex
                  ) => (
                    <HistoricalQuestionCard
                      key={
                        question.question_id ||
                        question.id ||
                        `${group.key}-${questionIndex}`
                      }
                      evidence={
                        question
                      }
                      index={
                        questionIndex
                      }
                    />
                  )
                )}
              </div>
            </section>
          )
        )}
      </div>
    </div>
  )
}

/* ============================================================
   PREDICTION SECTION
   ============================================================ */

function PredictionSection({
  prediction,
}: {
  prediction: Prediction
}) {
  const confidence =
    normaliseConfidenceLabel(
      prediction.confidence
    )

  const historicalEvidence =
    prediction.historical_evidence ??
    []

  return (
    <article className="rounded-3xl border border-[#10243d]/10 bg-white p-5 shadow-sm sm:p-6">
      {/* ======================================================
          PREDICTION HEADER
          ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#10243d] text-lg font-black text-white">
            {prediction.question_number}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#b15d2b]">
                Predicted focus
              </span>

              <span className="rounded-full bg-[#10243d]/[0.05] px-2.5 py-1 text-xs font-bold text-[#10243d]">
                {prediction.paper}
              </span>

              <ConfidenceBadge
                confidence={
                  prediction.confidence
                }
              />
            </div>

            <h3 className="mt-2 text-xl font-black text-[#10243d]">
              Question{" "}
              {
                prediction.question_number
              }
            </h3>
          </div>
        </div>

        {typeof prediction.prediction_score ===
          "number" && (
          <div className="rounded-xl bg-[#f4f1ea] px-4 py-3 text-left sm:text-right">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Pattern score
            </p>

            <p className="mt-0.5 text-lg font-black text-[#10243d]">
              {Math.round(
                prediction.prediction_score
              )}
            </p>
          </div>
        )}
      </div>

      {/* ======================================================
          TOPIC / PATTERN
          ====================================================== */}

      <div className="mt-5 flex flex-wrap gap-2">
        {prediction.topic && (
          <MetaBadge>
            {prediction.topic}
          </MetaBadge>
        )}

        {prediction.subtopic && (
          <MetaBadge>
            {prediction.subtopic}
          </MetaBadge>
        )}

        {prediction.concept_family && (
          <MetaBadge>
            Concept:{" "}
            {
              prediction.concept_family
            }
          </MetaBadge>
        )}

        {prediction.question_family && (
          <MetaBadge>
            Pattern:{" "}
            {
              prediction.question_family
            }
          </MetaBadge>
        )}
      </div>

      {/* ======================================================
          PREDICTED QUESTION
          ====================================================== */}

      <div className="mt-5 rounded-2xl border border-[#b15d2b]/20 bg-[#b15d2b]/[0.045]">
        <div className="flex items-center gap-2 border-b border-[#b15d2b]/15 px-4 py-3">
          <Sparkles className="h-4 w-4 text-[#b15d2b]" />

          <p className="text-xs font-black uppercase tracking-[0.15em] text-[#b15d2b]">
            Likely practice focus
          </p>
        </div>

        <div className="p-5">
          <p className="whitespace-pre-wrap text-[15px] leading-8 text-[#10243d]">
            {formatMathText(
              prediction.predicted_question
            )}
          </p>
        </div>
      </div>

      {/* ======================================================
          WHY SELECTED
          ====================================================== */}

      {prediction.prediction_reason && (
        <div className="mt-5 rounded-2xl border border-[#10243d]/10 bg-slate-50 p-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#b15d2b]" />

            <p className="text-xs font-black uppercase tracking-[0.15em] text-[#10243d]">
              Why this pattern was selected
            </p>
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
            {formatMathText(
              prediction.prediction_reason
            )}
          </p>
        </div>
      )}

      {/* ======================================================
          REVISION ADVICE
          ====================================================== */}

      {prediction.revision_advice && (
        <div className="mt-5 rounded-2xl border border-[#10243d]/10 bg-[#10243d]/[0.035] p-5">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#b15d2b]" />

            <p className="text-xs font-black uppercase tracking-[0.15em] text-[#10243d]">
              Revision advice
            </p>
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
            {formatMathText(
              prediction.revision_advice
            )}
          </p>
        </div>
      )}

      {/* ======================================================
          HISTORICAL EVIDENCE
          ====================================================== */}

      <HistoricalEvidenceGroups
        evidence={
          historicalEvidence
        }
      />

      {/* ======================================================
          SCORING DETAILS
          ====================================================== */}

      {(typeof prediction.historical_frequency ===
        "number" ||
        typeof prediction.recency_score ===
          "number" ||
        typeof prediction.variation_score ===
          "number" ||
        typeof prediction.mark_weight_score ===
          "number") && (
        <details className="mt-5 rounded-2xl border border-[#10243d]/10">
          <summary className="cursor-pointer list-none px-5 py-4 text-sm font-black text-[#10243d]">
            Pattern scoring details
            <ChevronDown className="ml-2 inline h-4 w-4" />
          </summary>

          <div className="grid gap-3 border-t border-[#10243d]/10 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
            {typeof prediction.historical_frequency ===
              "number" && (
              <ScoreCard
                label="Historical frequency"
                value={
                  prediction.historical_frequency
                }
              />
            )}

            {typeof prediction.recency_score ===
              "number" && (
              <ScoreCard
                label="Recency"
                value={
                  prediction.recency_score
                }
              />
            )}

            {typeof prediction.variation_score ===
              "number" && (
              <ScoreCard
                label="Variation"
                value={
                  prediction.variation_score
                }
              />
            )}

            {typeof prediction.mark_weight_score ===
              "number" && (
              <ScoreCard
                label="Mark weight"
                value={
                  prediction.mark_weight_score
                }
              />
            )}
          </div>
        </details>
      )}
    </article>
  )
}

/* ============================================================
   SCORE CARD
   ============================================================ */

function ScoreCard({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="rounded-xl border border-[#10243d]/10 bg-white p-4">
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-[#10243d]">
        {Math.round(value)}
      </p>
    </div>
  )
}

/* ============================================================
   SIDEBAR ITEM
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

      <span>{label}</span>
    </button>
  )
}

/* ============================================================
   MOBILE NAV ITEM
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
      <Icon className="h-5 w-5" />

      {label}
    </button>
  )
}

/* ============================================================
   MAIN PAGE
   ============================================================ */

export default function AIPredictorPage() {
  const router =
    useRouter()

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    generating,
    setGenerating,
  ] = useState(false)

  const [
    signingOut,
    setSigningOut,
  ] = useState(false)

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false)

  const [
    student,
    setStudent,
  ] =
    useState<Student | null>(
      null
    )

  const [
    credits,
    setCredits,
  ] = useState(0)

  const [
    subject,
    setSubject,
  ] =
    useState("Mathematics")

  const [
    paper,
    setPaper,
  ] =
    useState<
      "Both" | "Paper 1" | "Paper 2"
    >("Both")

  const [
    predictions,
    setPredictions,
  ] = useState<
    Prediction[]
  >([])

  const [
    selectedPaperFilter,
    setSelectedPaperFilter,
  ] =
    useState<
      "All" | "Paper 1" | "Paper 2"
    >("All")

  const [
    error,
    setError,
  ] = useState("")

  const [
    success,
    setSuccess,
  ] = useState("")

  const [
    runId,
    setRunId,
  ] =
    useState<string | null>(
      null
    )

  const [
    sourceInfo,
    setSourceInfo,
  ] = useState<
    PredictorResponse["source"] | null
  >(null)

  const [
    diagnostics,
    setDiagnostics,
  ] = useState<
    PredictorResponse["diagnostics"] | null
  >(null)

  /* ==========================================================
     LOAD SESSION
     ========================================================== */

  useEffect(() => {
    async function loadSession() {
      try {
        setLoading(true)
        setError("")

        const response =
          await fetch(
            "/api/ai/auth/me",
            {
              cache: "no-store",
              credentials: "include",
            }
          )

        const data =
          (await response.json()) as MeResponse

        if (
          !response.ok ||
          !data.authenticated ||
          !data.student
        ) {
          router.replace(
            "/ai/signin"
          )
          return
        }

        setStudent(
          data.student
        )

        setCredits(
          data.credits?.balance ??
            0
        )
      } catch (sessionError) {
        console.error(
          "AI predictor session error:",
          sessionError
        )

        router.replace(
          "/ai/signin"
        )
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [router])

  /* ==========================================================
     NAVIGATION
     ========================================================== */

  function openFeature(
    path: string
  ) {
    setMobileMenuOpen(false)
    router.push(path)
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
      router.replace(
        "/ai/signin"
      )
    }
  }

  /* ==========================================================
     GENERATE PREDICTION
     ========================================================== */

  async function handleGeneratePrediction() {
    if (!student) return

    setError("")
    setSuccess("")

    if (credits < 1) {
      setError(
        "You do not have enough AI credits to generate a prediction."
      )
      return
    }

    try {
      setGenerating(true)

      const response =
        await fetch(
          "/api/ai/exam-predictor",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              subject,
              paper,
              level:
                student.level,
              curriculum:
                student.curriculum,
            }),
          }
        )

      const data =
        (await response.json()) as PredictorResponse

      if (
        response.status === 401
      ) {
        router.replace(
          "/ai/signin"
        )
        return
      }

      if (
        response.status === 402 ||
        data.code ===
          "INSUFFICIENT_CREDITS" ||
        data.requiresPayment
      ) {
        setCredits(
          data.credits ?? 0
        )

        setError(
          "You do not have enough AI credits. Please add credits to continue."
        )
        return
      }

      if (
        data.code ===
        "INSUFFICIENT_PATTERN_EVIDENCE"
      ) {
        setError(
          data.error ||
            "There is not enough historical ZIMSEC pattern evidence to generate a reliable prediction."
        )
        return
      }

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.error ||
            "Unable to generate the prediction."
        )
        return
      }

      setPredictions(
        data.predictions ??
          []
      )

      setRunId(
        data.runId ??
          null
      )

      setCredits(
        data.credits ??
          Math.max(
            0,
            credits - 1
          )
      )

      setSourceInfo(
        data.source ??
          null
      )

      setDiagnostics(
        data.diagnostics ??
          null
      )

      setSelectedPaperFilter(
        "All"
      )

      setSuccess(
        "Your ZIMSEC Mathematics prediction has been generated."
      )
    } catch (predictionError) {
      console.error(
        "AI Exam Predictor error:",
        predictionError
      )

      setError(
        "Something went wrong while generating the prediction."
      )
    } finally {
      setGenerating(false)
    }
  }

  /* ==========================================================
     FILTERED PREDICTIONS
     ========================================================== */

  const filteredPredictions =
    useMemo(() => {
      if (
        selectedPaperFilter ===
        "All"
      ) {
        return predictions
      }

      return predictions.filter(
        (prediction) =>
          prediction.paper ===
          selectedPaperFilter
      )
    }, [
      predictions,
      selectedPaperFilter,
    ])

  /* ==========================================================
     SUMMARY
     ========================================================== */

  const paperOneCount =
    predictions.filter(
      (prediction) =>
        prediction.paper ===
        "Paper 1"
    ).length

  const paperTwoCount =
    predictions.filter(
      (prediction) =>
        prediction.paper ===
        "Paper 2"
    ).length

  const overallConfidence =
    useMemo(() => {
      if (!predictions.length) {
        return "—"
      }

      const labels =
        predictions.map(
          (prediction) =>
            normaliseConfidenceLabel(
              prediction.confidence
            )
        )

      const high =
        labels.filter(
          (label) =>
            label === "High"
        ).length

      const medium =
        labels.filter(
          (label) =>
            label === "Medium"
        ).length

      if (
        high >=
        Math.ceil(
          predictions.length *
            0.5
        )
      ) {
        return "High"
      }

      if (
        high + medium >=
        Math.ceil(
          predictions.length *
            0.5
        )
      ) {
        return "Medium"
      }

      return "Low"
    }, [predictions])

  /* ==========================================================
     LOADING
     ========================================================== */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f1ea]">
        <div className="flex items-center gap-3 text-[#10243d]">
          <Loader2 className="h-6 w-6 animate-spin" />

          <span className="font-semibold">
            Loading AI Exam Predictor...
          </span>
        </div>
      </main>
    )
  }

  /* ==========================================================
     PAGE
     ========================================================== */

  return (
    <>
      {/* ======================================================
          DESKTOP SIDEBAR
          ====================================================== */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] flex-col bg-[#10243d] px-5 py-6 shadow-2xl lg:flex">
        <div className="mb-8 flex items-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white p-1">
            <Image
              src="/Logo.png"
              alt="GlobeDk Elite Academy"
              fill
              className="object-contain"
              sizes="44px"
            />
          </div>

          <div>
            <p className="text-sm font-black text-white">
              GlobeDk Elite
            </p>

            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
              AI Learning Hub
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          <SidebarItem
            icon={GraduationCap}
            label="Dashboard"
            onClick={() =>
              openFeature("/ai")
            }
          />

          <SidebarItem
            icon={Target}
            label="Exam Predictor"
            active
            onClick={() =>
              openFeature(
                "/ai/exam-predictor"
              )
            }
          />

          <SidebarItem
            icon={FileText}
            label="Mock Lab"
            onClick={() =>
              openFeature(
                "/ai/mock-lab"
              )
            }
          />

          <SidebarItem
            icon={BookOpen}
            label="Revision Coach"
            onClick={() =>
              openFeature(
                "/ai/revision-coach"
              )
            }
          />

          <SidebarItem
            icon={TrendingUp}
            label="My Progress"
            onClick={() =>
              openFeature(
                "/ai/progress"
              )
            }
          />
        </nav>

        <div className="mt-auto">
          <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-[#e3a56f]" />

              <p className="text-xs font-bold text-white/60">
                AI Credits
              </p>
            </div>

            <p className="mt-1 text-2xl font-black text-white">
              {credits}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            {signingOut ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <LogOut className="h-5 w-5" />
            )}

            <span>
              Sign out
            </span>
          </button>
        </div>
      </aside>

      {/* ======================================================
          MOBILE SIDEBAR
          ====================================================== */}

      {mobileMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() =>
              setMobileMenuOpen(
                false
              )
            }
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />

          <aside className="fixed inset-y-0 left-0 z-50 flex w-[290px] flex-col bg-[#10243d] px-5 py-6 shadow-2xl lg:hidden">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-white p-1">
                  <Image
                    src="/Logo.png"
                    alt="GlobeDk Elite Academy"
                    fill
                    className="object-contain"
                    sizes="44px"
                  />
                </div>

                <div>
                  <p className="text-sm font-black text-white">
                    GlobeDk Elite
                  </p>

                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
                    AI Learning Hub
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(
                    false
                  )
                }
                className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-2">
              <MobileNavItem
                icon={
                  GraduationCap
                }
                label="Dashboard"
                onClick={() =>
                  openFeature(
                    "/ai"
                  )
                }
              />

              <MobileNavItem
                icon={Target}
                label="Exam Predictor"
                active
                onClick={() =>
                  openFeature(
                    "/ai/predictor"
                  )
                }
              />

              <MobileNavItem
                icon={FileText}
                label="Mock Lab"
                onClick={() =>
                  openFeature(
                    "/ai/mock-lab"
                  )
                }
              />

              <MobileNavItem
                icon={BookOpen}
                label="Revision Coach"
                onClick={() =>
                  openFeature(
                    "/ai/revision-coach"
                  )
                }
              />

              <MobileNavItem
                icon={
                  TrendingUp
                }
                label="My Progress"
                onClick={() =>
                  openFeature(
                    "/ai/progress"
                  )
                }
              />
            </nav>

            <div className="mt-auto">
              <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-[#e3a56f]" />

                  <p className="text-xs font-bold text-white/60">
                    AI Credits
                  </p>
                </div>

                <p className="mt-1 text-2xl font-black text-white">
                  {credits}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleSignOut
                }
                disabled={
                  signingOut
                }
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                {signingOut ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <LogOut className="h-5 w-5" />
                )}

                Sign out
              </button>
            </div>
          </aside>
        </>
      )}

      {/* ======================================================
          MAIN
          ====================================================== */}

      <main className="min-h-screen bg-[#f4f1ea] lg:pl-[250px]">
        {/* ====================================================
            TOP BAR
            ==================================================== */}

        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(
                    true
                  )
                }
                className="rounded-xl border border-slate-200 p-2 text-[#10243d] lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b15d2b]">
                  GlobeDk AI Learning Hub
                </p>

                <h1 className="text-xl font-black text-[#10243d] sm:text-2xl">
                  ZIMSEC Mathematics
                  Exam Predictor
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-xl border border-[#10243d]/10 bg-[#f4f1ea] px-3 py-2 sm:flex">
                <Coins className="h-4 w-4 text-[#b15d2b]" />

                <span className="text-xs font-bold text-slate-500">
                  Credits
                </span>

                <span className="text-sm font-black text-[#10243d]">
                  {credits}
                </span>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10243d] text-sm font-black text-white">
                {student?.firstName
                  ?.charAt(0)
                  .toUpperCase() ||
                  "S"}
              </div>
            </div>
          </div>
        </header>

        {/* ====================================================
            CONTENT
            ==================================================== */}

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* ==================================================
              INTRO
              ================================================== */}

          <div className="mb-8">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-[#b15d2b]">
              AI-powered revision
            </p>

            <h2 className="text-3xl font-black tracking-tight text-[#10243d]">
              Predict the patterns.
              Revise intelligently.
            </h2>

            <p className="mt-2 max-w-3xl text-slate-600">
              GlobeDk AI studies historical
              ZIMSEC Mathematics questions,
              their topics, question families,
              variations and positions to
              identify useful revision patterns.
            </p>
          </div>

          {/* ==================================================
              DISCLAIMER
              ================================================== */}

          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

            <div>
              <p className="text-sm font-black text-amber-900">
                Important
              </p>

              <p className="mt-1 text-sm leading-6 text-amber-800">
                These are AI-generated,
                pattern-based revision predictions.
                They are not leaked examination
                questions and are not guaranteed
                to appear in the next examination.
              </p>
            </div>
          </div>

          {/* ==================================================
              SETUP CARD
              ================================================== */}

          <section className="rounded-3xl border border-[#10243d]/10 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#10243d] text-white">
                <Zap className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-xl font-black text-[#10243d]">
                  Generate a prediction
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Select the examination settings
                  you want GlobeDk AI to analyse.
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* SUBJECT */}

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-bold text-[#10243d]"
                >
                  Subject
                </label>

                <select
                  id="subject"
                  value={subject}
                  onChange={(
                    event
                  ) =>
                    setSubject(
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#10243d] outline-none transition focus:border-[#b15d2b] focus:ring-2 focus:ring-[#b15d2b]/10"
                >
                  <option value="Mathematics">
                    Mathematics
                  </option>
                </select>
              </div>

              {/* LEVEL */}

              <div>
                <label
                  htmlFor="level"
                  className="mb-2 block text-sm font-bold text-[#10243d]"
                >
                  Level
                </label>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-[#10243d]">
                  {student?.level ??
                    "O-Level"}
                </div>
              </div>

              {/* CURRICULUM */}

              <div>
                <label
                  htmlFor="curriculum"
                  className="mb-2 block text-sm font-bold text-[#10243d]"
                >
                  Curriculum
                </label>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-[#10243d]">
                  {student?.curriculum ??
                    "ZIMSEC"}
                </div>
              </div>

              {/* PAPER */}

              <div>
                <label
                  htmlFor="paper"
                  className="mb-2 block text-sm font-bold text-[#10243d]"
                >
                  Paper
                </label>

                <select
                  id="paper"
                  value={paper}
                  onChange={(
                    event
                  ) =>
                    setPaper(
                      event.target
                        .value as
                        | "Both"
                        | "Paper 1"
                        | "Paper 2"
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#10243d] outline-none transition focus:border-[#b15d2b] focus:ring-2 focus:ring-[#b15d2b]/10"
                >
                  <option value="Both">
                    Paper 1 & Paper 2
                  </option>

                  <option value="Paper 1">
                    Paper 1
                  </option>

                  <option value="Paper 2">
                    Paper 2
                  </option>
                </select>
              </div>
            </div>

            {/* GENERATE */}

            <div className="mt-7 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Coins className="h-4 w-4 text-[#b15d2b]" />

                <span>
                  This prediction uses
                  <strong className="mx-1 text-[#10243d]">
                    1 AI credit
                  </strong>
                </span>
              </div>

              <button
                type="button"
                onClick={
                  handleGeneratePrediction
                }
                disabled={
                  generating ||
                  credits < 1
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10243d] px-6 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-[#1a3555] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analysing papers...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Prediction
                  </>
                )}
              </button>
            </div>
          </section>

          {/* ==================================================
              ERRORS
              ================================================== */}

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <span>
                {error}
              </span>
            </div>
          )}

          {/* ==================================================
              SUCCESS
              ================================================== */}

          {success && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

              <span>
                {success}
              </span>
            </div>
          )}

          {/* ==================================================
              RESULTS
              ================================================== */}

          {predictions.length > 0 && (
            <section className="mt-8">
              {/* RESULTS SUMMARY */}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                  icon={Target}
                  label="Predictions"
                  value={
                    predictions.length
                  }
                />

                <SummaryCard
                  icon={FileText}
                  label="Paper 1"
                  value={
                    paperOneCount
                  }
                />

                <SummaryCard
                  icon={BookOpen}
                  label="Paper 2"
                  value={
                    paperTwoCount
                  }
                />

                <SummaryCard
                  icon={
                    TrendingUp
                  }
                  label="Overall confidence"
                  value={
                    overallConfidence
                  }
                />
              </div>

              {/* RESULTS HEADER */}

              <div className="mt-8 rounded-3xl border border-[#10243d]/10 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b15d2b]">
                      Prediction results
                    </p>

                    <h3 className="mt-1 text-2xl font-black text-[#10243d]">
                      Patterns worth revising
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                      Each prediction is connected
                      to historical questions so you
                      can see the pattern behind the
                      recommendation.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPredictions(
                        []
                      )
                      setSuccess("")
                      setError("")
                      setRunId(null)
                      setSourceInfo(
                        null
                      )
                      setDiagnostics(
                        null
                      )
                      window.scrollTo({
                        top: 0,
                        behavior:
                          "smooth",
                      })
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#10243d]/10 bg-white px-4 py-3 text-sm font-black text-[#10243d] transition hover:bg-[#f4f1ea]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    New prediction
                  </button>
                </div>

                {/* SOURCE INFORMATION */}

                {(sourceInfo ||
                  diagnostics) && (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {typeof sourceInfo?.paperCount ===
                      "number" && (
                      <SourceStat
                        label="Historical papers"
                        value={
                          sourceInfo.paperCount
                        }
                      />
                    )}

                    {typeof sourceInfo?.questionCount ===
                      "number" && (
                      <SourceStat
                        label="Historical questions"
                        value={
                          sourceInfo.questionCount
                        }
                      />
                    )}

                    {typeof sourceInfo?.patternCount ===
                      "number" && (
                      <SourceStat
                        label="Patterns analysed"
                        value={
                          sourceInfo.patternCount
                        }
                      />
                    )}

                    {typeof diagnostics?.historicalEvidencePatternsFound ===
                      "number" && (
                      <SourceStat
                        label="Evidence patterns"
                        value={
                          diagnostics.historicalEvidencePatternsFound
                        }
                      />
                    )}
                  </div>
                )}

                {/* PAPER FILTER */}

                <div className="mt-7 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-6">
                  <span className="mr-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    Show
                  </span>

                  {(
                    [
                      "All",
                      "Paper 1",
                      "Paper 2",
                    ] as const
                  ).map(
                    (
                      filter
                    ) => (
                      <button
                        key={
                          filter
                        }
                        type="button"
                        onClick={() =>
                          setSelectedPaperFilter(
                            filter
                          )
                        }
                        className={
                          selectedPaperFilter ===
                          filter
                            ? "rounded-full bg-[#10243d] px-4 py-2 text-xs font-black text-white"
                            : "rounded-full border border-[#10243d]/10 bg-white px-4 py-2 text-xs font-bold text-slate-500 transition hover:bg-[#f4f1ea]"
                        }
                      >
                        {filter}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* PREDICTION CARDS */}

              <div className="mt-5 space-y-5">
                {filteredPredictions.map(
                  (
                    prediction,
                    index
                  ) => (
                    <div
                      key={`${prediction.paper}-${prediction.question_number}-${index}`}
                    >
                      <PredictionSection
                        prediction={
                          prediction
                        }
                      />
                    </div>
                  )
                )}
              </div>

              {filteredPredictions.length ===
                0 && (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-8 text-center">
                  <p className="font-bold text-[#10243d]">
                    No predictions match this
                    paper filter.
                  </p>
                </div>
              )}

              {/* RUN INFORMATION */}

              {runId && (
                <p className="mt-6 text-center text-xs text-slate-400">
                  Prediction analysis completed
                  successfully.
                </p>
              )}
            </section>
          )}

          {/* ==================================================
              EMPTY STATE
              ================================================== */}

          {!predictions.length &&
            !generating && (
              <section className="mt-8 rounded-3xl border border-dashed border-[#10243d]/15 bg-white/60 p-8 text-center sm:p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#10243d] text-white shadow-lg">
                  <Sparkles className="h-7 w-7" />
                </div>

                <h3 className="mt-5 text-xl font-black text-[#10243d]">
                  Ready to analyse ZIMSEC Mathematics
                </h3>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-500">
                  Generate a prediction above to see
                  likely revision patterns together
                  with the actual historical questions
                  that support each pattern.
                </p>
              </section>
            )}

          {/* ==================================================
              FOOTER NOTE
              ================================================== */}

          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#10243d]/10 bg-white p-5">
            <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-[#b15d2b]" />

            <div>
              <p className="text-sm font-black text-[#10243d]">
                How to use these predictions
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Do not study only the predicted wording.
                Study the underlying topic, concept
                family and question pattern shown by
                the historical evidence. ZIMSEC can
                change the numbers, wording, diagrams
                or order while testing the same skill.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

/* ============================================================
   SUMMARY CARD
   ============================================================ */

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-2xl border border-[#10243d]/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10243d]/[0.06] text-[#b15d2b]">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black text-[#10243d]">
        {value}
      </p>
    </div>
  )
}

/* ============================================================
   SOURCE STAT
   ============================================================ */

function SourceStat({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="rounded-xl border border-[#10243d]/10 bg-[#f4f1ea]/50 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.13em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-[#10243d]">
        {value}
      </p>
    </div>
  )
}