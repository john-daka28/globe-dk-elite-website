import {
  NextRequest,
  NextResponse,
} from "next/server"

import {
  getAIStudentSession,
} from "@/lib/ai-auth"

import {
  supabaseAdmin,
} from "@/lib/supabase-admin"

import {
  gemini,
  getGeminiModelName,
} from "@/lib/gemini"

export const runtime = "nodejs"

/* ============================================================
   TYPES
============================================================ */

type RequestedPaper =
  | "Paper 1"
  | "Paper 2"
  | "Both"

type PaperType =
  | "Paper 1"
  | "Paper 2"

type PaperOccurrenceQuestion = {
  question_id?: string
  question_ref?: string
  question_number?: number
  question_label?: string | null
}

type PaperOccurrence = {
  paper_id?: string
  paper_label?: string
  year?: number
  session?: string | null
  paper?: PaperType
  questions?: PaperOccurrenceQuestion[]
}

type PatternRow = {
  id: string

  paper:
    | PaperType

  topic: string

  subtopic:
    | string
    | null

  pattern_type:
    | string
    | null

  pattern_value:
    | string
    | null

  position_min:
    | number
    | null

  position_max:
    | number
    | null

  position_average:
    | number
    | null

  question_count: number

  papers_appeared: number

  appearance_rate: number

  total_marks: number

  average_marks: number

  years_seen: number[]

  question_positions: number[]

  question_styles: string[]

  skills: string[]

  example_question_ids: string[]

  frequency_score: number

  recency_score: number

  position_score: number

  style_score: number

  skill_score: number

  mark_weight_score: number

  prediction_score: number

  pattern_strength:
    | string
    | null

  concept_family:
    | string
    | null

  paper_occurrences:
    | PaperOccurrence[]
    | null
}

type HistoricalQuestion = {
  id: string

  paper_id: string

  question_number: number

  question_label:
    | string
    | null

  question_text: string

  topic:
    | string
    | null

  subtopic:
    | string
    | null

  skills:
    | string[]
    | null

  question_type:
    | string
    | null

  difficulty:
    | string
    | null

  marks:
    | number
    | null

  paper_section:
    | string
    | null

  concept_family:
    | string
    | null

  question_family:
    | string
    | null

  variation_patterns:
    | string[]
    | null

  diagram_dependency:
    | string
    | null

  position_band:
    | string
    | null
}

type HistoricalPaper = {
  id: string

  exam_year: number

  session:
    | string
    | null

  paper:
    | PaperType
}

type GeminiPrediction = {
  evidence_key?: string

  reasoning?: string

  what_repeats?: string

  what_changes?: string

  revision_advice?: string

  likely_question_styles?:
    | string[]
    | null

  practice_question_concept?:
    | string
    | null

  practice_question?:
    | string
    | null
}

type PredictionInsert = {
  prediction_run_id: string

  ai_student_id: string

  topic: string

  subtopic: string

  paper: PaperType

  prediction_score: number

  confidence:
    | "Low"
    | "Medium"
    | "High"

  historical_frequency: number

  recency_score: number

  variation_score: number

  mark_weight_score: number

  reasoning: string

  likely_question_styles: string[]

  revision_advice: string

  concept_family: string

  question_family: string

  historical_question_ids: string[]

  practice_question_concept: string
}

/* ============================================================
   HELPERS
============================================================ */

function normalizeText(
  value: unknown
): string {
  return String(
    value ?? ""
  )
    .trim()
    .replace(
      /\s+/g,
      " "
    )
}

function normalizePaper(
  value: unknown
): RequestedPaper | null {
  if (
    value === "Paper 1" ||
    value === "Paper 2" ||
    value === "Both"
  ) {
    return value
  }

  return null
}

function toNumber(
  value: unknown,
  fallback = 0
): number {
  const number =
    Number(value)

  return Number.isFinite(
    number
  )
    ? number
    : fallback
}

function clamp(
  value: number,
  min = 0,
  max = 100
): number {
  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  )
}

function confidenceFromScore(
  score: number
):
  | "Low"
  | "Medium"
  | "High" {
  if (
    score >= 75
  ) {
    return "High"
  }

  if (
    score >= 50
  ) {
    return "Medium"
  }

  return "Low"
}

function uniqueStrings(
  values: unknown
): string[] {
  if (
    !Array.isArray(values)
  ) {
    return []
  }

  return Array.from(
    new Set(
      values
        .map(
          (value) =>
            normalizeText(
              value
            )
        )
        .filter(Boolean)
    )
  )
}

/* ============================================================
   SPECIFIC QUESTION FAMILY
============================================================ */

/*
 * IMPORTANT
 *
 * Broad concept_family values such as:
 *
 * "Algebraic Manipulation and Equations"
 *
 * are NOT specific enough to be the main prediction grouping.
 *
 * The predictor therefore prefers:
 *
 * 1. question_family
 * 2. pattern_value
 * 3. subtopic
 * 4. concept_family
 * 5. topic
 *
 * This prevents unrelated historical questions from being
 * placed into one prediction.
 */

function getSpecificQuestionFamily(
  pattern: PatternRow
): string {
  const candidates = [
    normalizeText(
      pattern.pattern_value
    ),

    normalizeText(
      pattern.subtopic
    ),

    normalizeText(
      pattern.concept_family
    ),

    normalizeText(
      pattern.topic
    ),
  ]

  /*
   * The pattern_value is normally the most specific value
   * generated by the database pattern-analysis process.
   */

  for (
    const candidate of candidates
  ) {
    if (
      candidate
    ) {
      return candidate
    }
  }

  return "General"
}

/* ============================================================
   PATTERN KEY
============================================================ */

function evidenceKey(
  pattern: PatternRow
): string {
  const concept =
    normalizeText(
      pattern.concept_family
    ) ||
    normalizeText(
      pattern.topic
    ) ||
    "Other"

  const family =
    getSpecificQuestionFamily(
      pattern
    )

  return [
    pattern.paper,
    concept.toLowerCase(),
    family.toLowerCase(),
  ].join("|")
}

/* ============================================================
   PAPER LABEL
============================================================ */

function formatPaperLabel(
  paper: HistoricalPaper
): string {
  const session =
    normalizeText(
      paper.session
    )

  const paperShort =
    paper.paper.replace(
      "Paper ",
      "P"
    )

  /*
   * Avoid producing labels such as:
   *
   * November 2025 P1
   *
   * and then accidentally displaying the label again alongside
   * session/year/paper.
   */

  if (
    session
      .toLowerCase()
      .includes("specimen")
  ) {
    return `${session} ${paperShort}`
  }

  if (session) {
    return `${session} ${paper.exam_year} ${paperShort}`
  }

  return `${paper.exam_year} ${paperShort}`
}

/* ============================================================
   QUESTION REFERENCE
============================================================ */

function questionReference(
  question: HistoricalQuestion
): string {
  const label =
    normalizeText(
      question.question_label
    )

  if (label) {
    if (
      /^Q/i.test(label)
    ) {
      return label
    }

    return `Q${label}`
  }

  return `Q${question.question_number}`
}

/* ============================================================
   CLEAN GEMINI JSON
============================================================ */

function cleanJsonText(
  text: string
): string {
  let cleaned =
    text.trim()

  cleaned =
    cleaned.replace(
      /^```(?:json)?\s*/i,
      ""
    )

  cleaned =
    cleaned.replace(
      /\s*```$/i,
      ""
    )

  cleaned =
    cleaned.trim()

  const firstObject =
    cleaned.indexOf(
      "{"
    )

  const lastObject =
    cleaned.lastIndexOf(
      "}"
    )

  if (
    firstObject >= 0 &&
    lastObject > firstObject
  ) {
    return cleaned.slice(
      firstObject,
      lastObject + 1
    )
  }

  return cleaned
}

/* ============================================================
   GEMINI OUTPUT EXTRACTION
============================================================ */

function extractInteractionText(
  interaction: any
): string {
  if (
    typeof interaction?.output_text ===
    "string"
  ) {
    return interaction.output_text
  }

  if (
    typeof interaction?.outputText ===
    "string"
  ) {
    return interaction.outputText
  }

  const pieces: string[] = []

  const addText = (
    value: unknown
  ) => {
    if (
      typeof value ===
      "string"
    ) {
      const text =
        value.trim()

      if (text) {
        pieces.push(
          text
        )
      }
    }
  }

  const steps =
    interaction?.steps

  if (
    Array.isArray(
      steps
    )
  ) {
    for (
      const step of
      steps
    ) {
      addText(
        step?.text
      )

      addText(
        step?.output_text
      )

      if (
        Array.isArray(
          step?.content
        )
      ) {
        for (
          const content of
          step.content
        ) {
          addText(
            content?.text
          )

          addText(
            content?.output_text
          )
        }
      }
    }
  }

  const output =
    interaction?.output

  if (
    Array.isArray(
      output
    )
  ) {
    for (
      const item of
      output
    ) {
      addText(
        item?.text
      )

      addText(
        item?.output_text
      )

      if (
        Array.isArray(
          item?.content
        )
      ) {
        for (
          const content of
          item.content
        ) {
          addText(
            content?.text
          )

          addText(
            content?.output_text
          )
        }
      }
    }
  }

  return pieces.join(
    "\n"
  )
}

/* ============================================================
   QUESTION IDS FROM OCCURRENCES
============================================================ */

function questionIdsFromOccurrences(
  pattern: PatternRow
): string[] {
  const occurrences =
    Array.isArray(
      pattern.paper_occurrences
    )
      ? pattern.paper_occurrences
      : []

  const ids: string[] = []

  for (
    const occurrence of
    occurrences
  ) {
    if (
      !Array.isArray(
        occurrence?.questions
      )
    ) {
      continue
    }

    for (
      const question of
      occurrence.questions
    ) {
      const id =
        normalizeText(
          question?.question_id
        )

      if (id) {
        ids.push(
          id
        )
      }
    }
  }

  return uniqueStrings(
    ids
  )
}

/* ============================================================
   ALL HISTORICAL QUESTION IDS
============================================================ */

function getHistoricalQuestionIds(
  patterns: PatternRow[]
): string[] {
  const ids: string[] = []

  for (
    const pattern of
    patterns
  ) {
    ids.push(
      ...questionIdsFromOccurrences(
        pattern
      )
    )

    ids.push(
      ...(
        Array.isArray(
          pattern.example_question_ids
        )
          ? pattern.example_question_ids
          : []
      )
    )
  }

  return uniqueStrings(
    ids
  )
}

/* ============================================================
   DETERMINE WHETHER PATTERN HAS REAL DATABASE EVIDENCE
============================================================ */

function hasHistoricalEvidence(
  pattern: PatternRow
): boolean {
  const occurrenceQuestionIds =
    questionIdsFromOccurrences(
      pattern
    )

  const exampleQuestionIds =
    Array.isArray(
      pattern.example_question_ids
    )
      ? uniqueStrings(
          pattern.example_question_ids
        )
      : []

  const questionCount =
    toNumber(
      pattern.question_count
    )

  const papersAppeared =
    toNumber(
      pattern.papers_appeared
    )

  return (
    questionCount > 0 &&
    papersAppeared > 0 &&
    (
      occurrenceQuestionIds.length > 0 ||
      exampleQuestionIds.length > 0
    )
  )
}

/* ============================================================
   DATABASE EVIDENCE RANK
============================================================ */

function databaseEvidenceRank(
  pattern: PatternRow
): number {
  const predictionScore =
    clamp(
      toNumber(
        pattern.prediction_score
      )
    )

  const frequencyScore =
    clamp(
      toNumber(
        pattern.frequency_score
      )
    )

  const recencyScore =
    clamp(
      toNumber(
        pattern.recency_score
      )
    )

  const positionScore =
    clamp(
      toNumber(
        pattern.position_score
      )
    )

  const styleScore =
    clamp(
      toNumber(
        pattern.style_score
      )
    )

  const skillScore =
    clamp(
      toNumber(
        pattern.skill_score
      )
    )

  const markWeightScore =
    clamp(
      toNumber(
        pattern.mark_weight_score
      )
    )

  return (
    predictionScore * 1000000 +
    frequencyScore * 10000 +
    recencyScore * 1000 +
    positionScore * 100 +
    styleScore * 10 +
    skillScore +
    markWeightScore / 100
  )
}

/* ============================================================
   BUILD OCCURRENCE VIEW
============================================================ */

function buildOccurrenceView(
  pattern: PatternRow,
  questions: HistoricalQuestion[],
  papers: HistoricalPaper[]
) {
  const questionMap =
    new Map<
      string,
      HistoricalQuestion
    >(
      questions.map(
        (question) => [
          question.id,
          question,
        ]
      )
    )

  const paperMap =
    new Map<
      string,
      HistoricalPaper
    >(
      papers.map(
        (paper) => [
          paper.id,
          paper,
        ]
      )
    )

  const occurrences =
    Array.isArray(
      pattern.paper_occurrences
    )
      ? pattern.paper_occurrences
      : []

  return occurrences
    .map(
      (
        occurrence
      ) => {
        const occurrenceQuestions =
          Array.isArray(
            occurrence.questions
          )
            ? occurrence.questions
            : []

        const resolvedQuestions =
          occurrenceQuestions
            .map(
              (
                occurrenceQuestion
              ) => {
                const id =
                  normalizeText(
                    occurrenceQuestion.question_id
                  )

                if (!id) {
                  return null
                }

                const question =
                  questionMap.get(
                    id
                  )

                if (!question) {
                  return null
                }

                const paper =
                  paperMap.get(
                    question.paper_id
                  )

                return {
                  id:
                    question.id,

                  reference:
                    questionReference(
                      question
                    ),

                  year:
                    paper?.exam_year ??
                    occurrence.year ??
                    null,

                  session:
                    paper?.session ??
                    occurrence.session ??
                    null,

                  paper:
                    paper?.paper ??
                    occurrence.paper ??
                    pattern.paper,

                  paper_label:
                    paper
                      ? formatPaperLabel(
                          paper
                        )
                      : null,

                  question_number:
                    question.question_number,

                  question_label:
                    question.question_label,

                  question_text:
                    question.question_text,

                  marks:
                    question.marks,

                  topic:
                    question.topic,

                  subtopic:
                    question.subtopic,

                  concept_family:
                    question.concept_family,

                  question_family:
                    question.question_family,

                  skills:
                    uniqueStrings(
                      question.skills
                    ),

                  variation_patterns:
                    uniqueStrings(
                      question.variation_patterns
                    ),

                  difficulty:
                    question.difficulty,

                  question_type:
                    question.question_type,

                  diagram_dependency:
                    question.diagram_dependency,

                  position_band:
                    question.position_band,
                }
              }
            )
            .filter(
              Boolean
            )

        return {
          paper_id:
            occurrence.paper_id ??
            null,

          /*
           * Keep the database label for internal/debugging,
           * but also return normalized year/session/paper data.
           */
          paper_label:
            occurrence.paper_label ??
            null,

          year:
            occurrence.year ??
            null,

          session:
            occurrence.session ??
            null,

          paper:
            occurrence.paper ??
            pattern.paper,

          questions:
            resolvedQuestions,
        }
      }
    )
    .filter(
      (
        occurrence
      ) =>
        Array.isArray(
          occurrence.questions
        ) &&
        occurrence.questions.length > 0
    )
}

/* ============================================================
   BUILD STUDENT-FACING HISTORICAL EVIDENCE
============================================================ */

function buildStudentHistoricalEvidence(
  questionIds: string[],
  questions: HistoricalQuestion[],
  papers: HistoricalPaper[]
) {
  const selectedIds =
    new Set(
      questionIds
    )

  return questions
    .filter(
      (
        question
      ) =>
        selectedIds.has(
          question.id
        )
    )
    .map(
      (
        question
      ) => {
        const paper =
          papers.find(
            (
              item
            ) =>
              item.id ===
              question.paper_id
          )

        return {
          id:
            question.id,

          question_number:
            question.question_number,

          year:
            paper?.exam_year ??
            null,

          session:
            paper?.session ??
            null,

          paper:
            paper?.paper ??
            null,

          /*
           * IMPORTANT:
           *
           * The student receives the actual question text
           * stored in the database.
           */
          question_text:
            question.question_text,

          marks:
            question.marks,

          /*
           * Normalized label used by the frontend.
           *
           * Example:
           * "November 2025 P1"
           */
          paper_label:
            paper
              ? formatPaperLabel(
                  paper
                )
              : null,
        }
      }
    )
    .sort(
      (
        a,
        b
      ) => {
        if (
          (b.year ?? 0) !==
          (a.year ?? 0)
        ) {
          return (
            (b.year ?? 0) -
            (a.year ?? 0)
          )
        }

        const sessionCompare =
          normalizeText(
            b.session
          ).localeCompare(
            normalizeText(
              a.session
            )
          )

        if (
          sessionCompare !==
          0
        ) {
          return sessionCompare
        }

        if (
          a.paper !==
          b.paper
        ) {
          return (
            a.paper ===
            "Paper 1"
              ? -1
              : 1
          )
        }

        return (
          (a.question_number ?? 0) -
          (b.question_number ?? 0)
        )
      }
    )
}

/* ============================================================
   BUILD GEMINI PROMPT
============================================================ */

function buildGeminiPrompt(
  patterns: PatternRow[],
  questions: HistoricalQuestion[],
  papers: HistoricalPaper[],
  requestedPaper: RequestedPaper
): string {
  const questionMap =
    new Map<
      string,
      HistoricalQuestion
    >(
      questions.map(
        (question) => [
          question.id,
          question,
        ]
      )
    )

  const paperMap =
    new Map<
      string,
      HistoricalPaper
    >(
      papers.map(
        (paper) => [
          paper.id,
          paper,
        ]
      )
    )

  const evidence =
    patterns.map(
      (
        pattern
      ) => {
        const occurrenceView =
          buildOccurrenceView(
            pattern,
            questions,
            papers
          )

        const allHistoricalIds =
          getHistoricalQuestionIds(
            [pattern]
          )

        const historicalQuestions =
          allHistoricalIds
            .map(
              (
                id
              ) =>
                questionMap.get(
                  id
                )
            )
            .filter(
              (
                question
              ): question is HistoricalQuestion =>
                Boolean(
                  question
                )
            )
            .map(
              (
                question
              ) => {
                const paper =
                  paperMap.get(
                    question.paper_id
                  )

                return {
                  question_id:
                    question.id,

                  reference:
                    questionReference(
                      question
                    ),

                  year:
                    paper?.exam_year ??
                    null,

                  session:
                    paper?.session ??
                    null,

                  paper:
                    paper?.paper ??
                    pattern.paper,

                  paper_label:
                    paper
                      ? formatPaperLabel(
                          paper
                        )
                      : null,

                  question_number:
                    question.question_number,

                  question_label:
                    question.question_label,

                  question_text:
                    question.question_text,

                  marks:
                    question.marks,

                  topic:
                    question.topic,

                  subtopic:
                    question.subtopic,

                  question_type:
                    question.question_type,

                  question_family:
                    question.question_family,

                  concept_family:
                    question.concept_family,

                  skills:
                    uniqueStrings(
                      question.skills
                    ),

                  variation_patterns:
                    uniqueStrings(
                      question.variation_patterns
                    ),

                  position_band:
                    question.position_band,

                  diagram_dependency:
                    question.diagram_dependency,
                }
              }
            )

        return {
          evidence_key:
            evidenceKey(
              pattern
            ),

          paper:
            pattern.paper,

          concept_family:
            normalizeText(
              pattern.concept_family
            ) ||
            pattern.topic,

          /*
           * Use the specific pattern value instead of
           * broad concept_family as the question family.
           */
          question_family:
            getSpecificQuestionFamily(
              pattern
            ),

          topic:
            pattern.topic,

          subtopic:
            pattern.subtopic,

          pattern_type:
            pattern.pattern_type,

          pattern_strength:
            pattern.pattern_strength,

          question_count:
            toNumber(
              pattern.question_count
            ),

          papers_appeared:
            toNumber(
              pattern.papers_appeared
            ),

          appearance_rate:
            toNumber(
              pattern.appearance_rate
            ),

          years_seen:
            Array.isArray(
              pattern.years_seen
            )
              ? pattern.years_seen
              : [],

          question_positions:
            Array.isArray(
              pattern.question_positions
            )
              ? pattern.question_positions
              : [],

          position_min:
            pattern.position_min,

          position_max:
            pattern.position_max,

          position_average:
            pattern.position_average,

          average_marks:
            toNumber(
              pattern.average_marks
            ),

          total_marks:
            toNumber(
              pattern.total_marks
            ),

          frequency_score:
            clamp(
              toNumber(
                pattern.frequency_score
              )
            ),

          recency_score:
            clamp(
              toNumber(
                pattern.recency_score
              )
            ),

          position_score:
            clamp(
              toNumber(
                pattern.position_score
              )
            ),

          style_score:
            clamp(
              toNumber(
                pattern.style_score
              )
            ),

          skill_score:
            clamp(
              toNumber(
                pattern.skill_score
              )
            ),

          mark_weight_score:
            clamp(
              toNumber(
                pattern.mark_weight_score
              )
            ),

          prediction_score:
            clamp(
              toNumber(
                pattern.prediction_score
              )
            ),

          occurrence_table:
            occurrenceView,

          historical_questions:
            historicalQuestions,
        }
      }
    )

  return `
You are the historical-pattern explanation engine for GlobeDk Elite Academy.

SUBJECT

ZIMSEC O-Level Mathematics

REQUESTED PAPER

${requestedPaper}

============================================================
YOUR ROLE
============================================================

You explain historical examination patterns.

You are NOT receiving leaked examination material.

You do NOT know the future examination paper.

You must NEVER claim that an exact future question will appear.

You must NEVER claim that a question number is guaranteed.

You must NEVER claim that a question has been leaked.

You must NEVER claim that a historical question will repeat word-for-word.

You must NEVER create fake historical evidence.

============================================================
DATABASE GROUPING RULE
============================================================

The database has already selected the historical patterns.

The database pattern is authoritative.

A broad concept such as:

"Algebraic Manipulation and Equations"

is NOT automatically a single question family.

Prefer the specific question family/pattern supplied by the
database.

For example:

Algebraic Fractions
→ Simplifying algebraic fractions

Linear Equations
→ Solving linear equations

Variation
→ Direct and inverse variation

Matrices
→ Matrix operations

Do NOT merge unrelated mathematical skills simply because they
belong to the same broad topic.

For example, do NOT combine:

- algebraic fractions
- logarithms
- ratio
- variation
- equations
- factorisation

into one prediction merely because they share a broad algebra
concept.

============================================================
IMPORTANT DATABASE RULE
============================================================

The evidence records below were selected by the application
from the GlobeDk database.

The database has already decided which historical patterns
are eligible for prediction analysis.

DO NOT add new topics.

DO NOT add new question families.

DO NOT remove evidence because you personally think another
topic is more important.

DO NOT invent an evidence_key.

For every returned prediction, evidence_key MUST exactly match
one of the supplied evidence_key values.

Your role is to EXPLAIN the supplied database evidence.

The database is authoritative.

============================================================
CORE PRINCIPLE
============================================================

ZIMSEC may change:

- numbers
- variables
- diagrams
- names
- wording
- contexts
- arrangement
- subparts

while testing the same underlying mathematical skill.

Therefore distinguish between:

CONCEPT FAMILY
↓
SPECIFIC QUESTION FAMILY
↓
HISTORICAL OCCURRENCES
↓
WHAT REPEATS
↓
WHAT CHANGES
↓
REVISION ADVICE
↓
NEW PRACTICE QUESTION

============================================================
HISTORICAL EVIDENCE
============================================================

The historical evidence supplied below comes directly from
the GlobeDk database.

The occurrence_table and historical_questions contain the
actual historical questions.

Each historical question contains:

- question number
- actual question text
- marks
- year
- session
- paper

Use ONLY the supplied evidence.

Do not invent missing papers.

Do not invent missing question numbers.

Do not change historical question references.

Do not invent years.

Do not invent frequency values.

Do not invent prediction scores.

============================================================
WHAT YOU MUST EXPLAIN
============================================================

For each supplied evidence record:

1. Explain what mathematical structure repeats.

2. Explain what changes between historical questions.

3. Explain why the specific question family is worth revising.

4. Give practical revision advice.

5. Give realistic question styles to practise.

6. Create a NEW practice question concept.

The practice question must NOT copy a historical question.

Use different numbers, arrangement, context or structure while
testing the same mathematical skill.

============================================================
NUMERICAL EVIDENCE
============================================================

The database is authoritative for:

- prediction_score
- frequency_score
- recency_score
- position_score
- style_score
- skill_score
- mark_weight_score
- years_seen
- question positions
- historical question references
- historical question IDs
- papers_appeared
- appearance_rate
- question_count

Do not change numerical evidence.

prediction_score is a ranking score, NOT a probability.

Do not convert prediction_score into a probability.

============================================================
LANGUAGE
============================================================

Use language such as:

"This is a strong recurring pattern."

"This question family has appeared repeatedly."

"The underlying skill is worth revising."

"Students should practise several variations."

"A similar structure could be used for practice."

Avoid:

"This exact question will appear."

"Question 22 will come."

"This is guaranteed."

"This has been leaked."

============================================================
OUTPUT
============================================================

Return ONLY valid JSON.

Use exactly this structure:

{
  "predictions": [
    {
      "evidence_key": "Paper 1|matrices|matrices (operations, inverse and singular)",
      "reasoning": "Explanation of the historical pattern.",
      "what_repeats": "The underlying mathematical structure that recurs.",
      "what_changes": "How the historical questions vary.",
      "revision_advice": "Specific revision advice.",
      "likely_question_styles": [
        "Realistic question style 1",
        "Realistic question style 2"
      ],
      "practice_question_concept": "A new practice-question concept that is not copied from the historical examples.",
      "practice_question": "A complete NEW practice question for the student to attempt."
    }
  ]
}

IMPORTANT:

practice_question must be a NEW question.

It must NOT be copied word-for-word from historical evidence.

It must test the same underlying mathematical skill.

It must use different values, wording, arrangement or context.

Do not claim that the practice question is the future ZIMSEC
question.

You may return one prediction for each supplied evidence record.

Do not return an evidence_key that was not supplied.

Do not include markdown.

============================================================
HISTORICAL PAPERS
============================================================

${JSON.stringify(
  papers,
  null,
  2
)}

============================================================
DATABASE-SELECTED HISTORICAL PATTERN EVIDENCE
============================================================

${JSON.stringify(
  evidence,
  null,
  2
)}

============================================================
FINAL REMINDER
============================================================

The database selected the evidence.

Your job is to explain it.

Do not select unrelated topics.

Do not invent evidence.

Do not change numerical evidence.

Do not reveal or claim knowledge of a future examination.

Do not predict exact future question numbers.

Focus on specific concept families and specific question
families.

Keep unrelated mathematical skills in separate predictions.
`
}

/* ============================================================
   SERVER-SIDE FALLBACK PREDICTION
============================================================ */

function buildFallbackPrediction(
  evidence: PatternRow
): PredictionInsert {
  const predictionScore =
    clamp(
      Math.round(
        toNumber(
          evidence.prediction_score
        )
      )
    )

  const concept =
    normalizeText(
      evidence.concept_family
    ) ||
    normalizeText(
      evidence.topic
    ) ||
    "Other"

  /*
   * IMPORTANT:
   *
   * Do not use broad concept_family as the question_family.
   */
  const family =
    getSpecificQuestionFamily(
      evidence
    )

  const topic =
    normalizeText(
      evidence.topic
    ) ||
    concept

  const subtopic =
    normalizeText(
      evidence.subtopic
    ) ||
    family

  const historicalIds =
    getHistoricalQuestionIds(
      [evidence]
    )

  return {
    prediction_run_id:
      "",

    ai_student_id:
      "",

    topic,

    subtopic,

    paper:
      evidence.paper,

    prediction_score:
      predictionScore,

    confidence:
      confidenceFromScore(
        predictionScore
      ),

    historical_frequency:
      clamp(
        toNumber(
          evidence.frequency_score
        )
      ),

    recency_score:
      clamp(
        toNumber(
          evidence.recency_score
        )
      ),

    variation_score:
      clamp(
        toNumber(
          evidence.style_score
        )
      ),

    mark_weight_score:
      clamp(
        toNumber(
          evidence.mark_weight_score
        )
      ),

    reasoning:
      `This question family has appeared in ${toNumber(
        evidence.papers_appeared
      )} analysed paper(s). The recurrence makes it a useful revision priority, but it is not a guaranteed future question.`,

    likely_question_styles:
      uniqueStrings(
        evidence.question_styles
      ),

    revision_advice:
      `Revise ${concept}, especially ${family}, and practise several different variations rather than memorising one historical question.`,

    concept_family:
      concept,

    question_family:
      family,

    historical_question_ids:
      historicalIds,

    practice_question_concept:
      `Create a new practice question testing ${family} with different numbers and a different arrangement from the historical examples.`,
  }
}

/* ============================================================
   POST
============================================================ */

export async function POST(
  request: NextRequest
) {
  let runId:
    | string
    | null = null

  try {
    /* ========================================================
       1. AUTHENTICATE STUDENT
    ======================================================== */

    const session =
      await getAIStudentSession()

    if (
      !session?.id
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "You must be signed in to use the AI Exam Predictor.",

          code:
            "UNAUTHENTICATED",
        },
        {
          status: 401,
        }
      )
    }

    /* ========================================================
       2. READ REQUEST
    ======================================================== */

    let body: any

    try {
      body =
        await request.json()
    } catch {
      return NextResponse.json(
        {
          success: false,

          error:
            "Invalid request body.",

          code:
            "INVALID_REQUEST",
        },
        {
          status: 400,
        }
      )
    }

    const requestedPaper =
      normalizePaper(
        body?.paper
      )

    const subject =
      normalizeText(
        body?.subject
      ) ||
      "Mathematics"

    if (
      !requestedPaper
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Please select Paper 1, Paper 2, or Both.",

          code:
            "INVALID_PAPER",
        },
        {
          status: 400,
        }
      )
    }

    if (
      subject.toLowerCase() !==
      "mathematics"
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "The ZIMSEC AI Exam Predictor currently supports Mathematics only.",

          code:
            "UNSUPPORTED_SUBJECT",
        },
        {
          status: 400,
        }
      )
    }

    /* ========================================================
       3. GET AI STUDENT
    ======================================================== */

    const {
      data: student,
      error: studentError,
    } =
      await supabaseAdmin
        .from(
          "ai_students"
        )
        .select(
          `
            id,
            email,
            first_name,
            last_name,
            level,
            curriculum
          `
        )
        .eq(
          "id",
          session.id
        )
        .maybeSingle()

    if (
      studentError
    ) {
      throw new Error(
        `Failed to retrieve AI student: ${studentError.message}`
      )
    }

    if (
      !student
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "AI student account could not be found.",

          code:
            "STUDENT_NOT_FOUND",
        },
        {
          status: 404,
        }
      )
    }

    if (
      student.level !==
        "O-Level" ||
      student.curriculum !==
        "ZIMSEC"
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "The current predictor is available for ZIMSEC O-Level Mathematics.",

          code:
            "UNSUPPORTED_LEVEL",
        },
        {
          status: 400,
        }
      )
    }

    /* ========================================================
       4. CHECK CREDITS BEFORE EXPENSIVE WORK
    ======================================================== */

    const {
      data: creditBalance,
      error: creditError,
    } =
      await supabaseAdmin
        .from(
          "ai_credit_balances"
        )
        .select(
          "balance"
        )
        .eq(
          "ai_student_id",
          student.id
        )
        .maybeSingle()

    if (
      creditError
    ) {
      throw new Error(
        `Failed to retrieve AI credits: ${creditError.message}`
      )
    }

    const balance =
      toNumber(
        creditBalance?.balance
      )

    const creditsRequired =
      1

    if (
      balance <
      creditsRequired
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "You do not have enough AI credits to run the Exam Predictor.",

          code:
            "INSUFFICIENT_CREDITS",

          requiresPayment:
            true,

          credits:
            balance,

          creditsRequired,
        },
        {
          status: 402,
        }
      )
    }

    /* ========================================================
       5. GET COMPLETED HISTORICAL PAPERS
    ======================================================== */

    let paperQuery =
      supabaseAdmin
        .from(
          "ai_zimsec_math_papers"
        )
        .select(
          `
            id,
            exam_year,
            session,
            paper
          `
        )
        .eq(
          "subject",
          "Mathematics"
        )
        .eq(
          "level",
          "O-Level"
        )
        .eq(
          "curriculum",
          "ZIMSEC"
        )
        .eq(
          "extraction_status",
          "completed"
        )
        .order(
          "exam_year",
          {
            ascending:
              false,
          }
        )

    if (
      requestedPaper !==
      "Both"
    ) {
      paperQuery =
        paperQuery.eq(
          "paper",
          requestedPaper
        )
    }

    const {
      data: rawPapers,
      error: papersError,
    } =
      await paperQuery

    if (
      papersError
    ) {
      throw new Error(
        `Failed to retrieve historical papers: ${papersError.message}`
      )
    }

    const papers =
      (
        rawPapers ||
        []
      ) as HistoricalPaper[]

    if (
      papers.length ===
      0
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "No completed ZIMSEC O-Level Mathematics papers are available in the AI knowledge base.",

          code:
            "NO_HISTORICAL_DATA",
        },
        {
          status: 404,
        }
      )
    }

    /* ========================================================
       6. GET DATABASE PATTERN EVIDENCE
    ======================================================== */

    let patternQuery =
      supabaseAdmin
        .from(
          "ai_zimsec_math_pattern_analysis"
        )
        .select(
          `
            id,
            paper,
            topic,
            subtopic,
            pattern_type,
            pattern_value,
            position_min,
            position_max,
            position_average,
            question_count,
            papers_appeared,
            appearance_rate,
            total_marks,
            average_marks,
            years_seen,
            question_positions,
            question_styles,
            skills,
            example_question_ids,
            frequency_score,
            recency_score,
            position_score,
            style_score,
            skill_score,
            mark_weight_score,
            prediction_score,
            pattern_strength,
            concept_family,
            paper_occurrences
          `
        )
        .eq(
          "subject",
          "Mathematics"
        )
        .eq(
          "level",
          "O-Level"
        )
        .eq(
          "curriculum",
          "ZIMSEC"
        )

    if (
      requestedPaper !==
      "Both"
    ) {
      patternQuery =
        patternQuery.eq(
          "paper",
          requestedPaper
        )
    }

    const {
      data: rawPatterns,
      error: patternError,
    } =
      await patternQuery

    if (
      patternError
    ) {
      throw new Error(
        `Failed to retrieve historical pattern analysis: ${patternError.message}`
      )
    }

    const allPatterns =
      (
        rawPatterns ||
        []
      ) as PatternRow[]

    /* ========================================================
       7. DATABASE AUTHORITATIVE EVIDENCE FILTER
    ======================================================== */

    const evidencePatterns =
      allPatterns.filter(
        (
          pattern
        ) =>
          hasHistoricalEvidence(
            pattern
          )
      )

    /*
     * IMPORTANT:
     *
     * Use the specific pattern family in the evidence key.
     *
     * This is what prevents broad "Algebraic Manipulation and
     * Equations" records from swallowing unrelated patterns
     * where the database has a more specific pattern_value.
     */

    const evidenceByKey =
      new Map<
        string,
        PatternRow
      >()

    for (
      const pattern of
      evidencePatterns
    ) {
      const key =
        evidenceKey(
          pattern
        )

      const existing =
        evidenceByKey.get(
          key
        )

      if (
        !existing ||
        databaseEvidenceRank(
          pattern
        ) >
          databaseEvidenceRank(
            existing
          )
      ) {
        evidenceByKey.set(
          key,
          pattern
        )
      }
    }

    const patterns =
      Array.from(
        evidenceByKey.values()
      )
        .sort(
          (
            a,
            b
          ) =>
            databaseEvidenceRank(
              b
            ) -
            databaseEvidenceRank(
              a
            )
        )
        .slice(
          0,
          16
        )

    /* ========================================================
       8. INSUFFICIENT EVIDENCE DIAGNOSTICS
    ======================================================== */

    if (
      patterns.length ===
      0
    ) {
      const highestPredictionScore =
        allPatterns.length > 0
          ? Math.max(
              ...allPatterns.map(
                (
                  pattern
                ) =>
                  clamp(
                    toNumber(
                      pattern.prediction_score
                    )
                  )
              )
            )
          : 0

      const patternsWithQuestionEvidence =
        allPatterns.filter(
          (
            pattern
          ) =>
            hasHistoricalEvidence(
              pattern
            )
        ).length

      return NextResponse.json(
        {
          success: false,

          error:
            "There is not enough classified historical pattern evidence yet. Please process more ZIMSEC Mathematics papers.",

          code:
            "INSUFFICIENT_PATTERN_EVIDENCE",

          diagnostics: {
            patternRowsFound:
              allPatterns.length,

            historicalEvidencePatternsFound:
              patternsWithQuestionEvidence,

            highestPredictionScore,
          },
        },
        {
          status: 422,
        }
      )
    }

    /* ========================================================
       9. COLLECT ALL HISTORICAL QUESTION IDS
    ======================================================== */

    const historicalQuestionIds =
      getHistoricalQuestionIds(
        patterns
      )

    let questions:
      HistoricalQuestion[] = []

    if (
      historicalQuestionIds.length >
      0
    ) {
      const {
        data: rawQuestions,
        error: questionsError,
      } =
        await supabaseAdmin
          .from(
            "ai_zimsec_math_questions"
          )
          .select(
            `
              id,
              paper_id,
              question_number,
              question_label,
              question_text,
              topic,
              subtopic,
              skills,
              question_type,
              difficulty,
              marks,
              paper_section,
              concept_family,
              question_family,
              variation_patterns,
              diagram_dependency,
              position_band
            `
          )
          .in(
            "id",
            historicalQuestionIds
          )

      if (
        questionsError
      ) {
        throw new Error(
          `Failed to retrieve historical evidence questions: ${questionsError.message}`
        )
      }

      questions =
        (
          rawQuestions ||
          []
        ) as HistoricalQuestion[]
    }

    if (
      questions.length ===
      0
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Historical pattern records exist, but their historical questions could not be resolved. Please reprocess the ZIMSEC Mathematics papers.",

          code:
            "HISTORICAL_QUESTIONS_UNRESOLVED",

          diagnostics: {
            patternRowsFound:
              allPatterns.length,

            historicalEvidencePatternsFound:
              patterns.length,

            historicalQuestionIdsFound:
              historicalQuestionIds.length,

            resolvedHistoricalQuestions:
              questions.length,
          },
        },
        {
          status: 422,
        }
      )
    }

    /* ========================================================
       10. CREATE PREDICTION RUN
    ======================================================== */

    const model =
      getGeminiModelName()

    const {
      data: run,
      error: runError,
    } =
      await supabaseAdmin
        .from(
          "ai_prediction_runs"
        )
        .insert({
          ai_student_id:
            student.id,

          user_id:
            null,

          subject:
            "Mathematics",

          level:
            "O-Level",

          curriculum:
            "ZIMSEC",

          paper:
            requestedPaper,

          papers_analysed:
            papers.length,

          questions_analysed:
            questions.length,

          source_question_count:
            questions.length,

          model_name:
            model,

          status:
            "processing",

          credits_used:
            0,

          paper_1_prediction_count:
            0,

          paper_2_prediction_count:
            0,
        })
        .select(
          "id"
        )
        .single()

    if (
      runError ||
      !run
    ) {
      throw new Error(
        `Failed to create prediction run: ${
          runError?.message ||
          "Unknown error"
        }`
      )
    }

    runId =
      run.id

    /* ========================================================
       11. BUILD GEMINI PROMPT
    ======================================================== */

    const prompt =
      buildGeminiPrompt(
        patterns,
        questions,
        papers,
        requestedPaper
      )

    /* ========================================================
       12. GEMINI
    ======================================================== */

    const interaction =
      await gemini.interactions.create(
        {
          model,

          input: [
            {
              type:
                "text",

              text:
                prompt,
            },
          ],
        }
      )

    const responseText =
      extractInteractionText(
        interaction
      )

    if (
      !responseText
    ) {
      throw new Error(
        "Gemini returned an empty response."
      )
    }

    /* ========================================================
       13. PARSE GEMINI
    ======================================================== */

    let parsed: {
      predictions?:
        GeminiPrediction[]
    }

    try {
      const cleaned =
        cleanJsonText(
          responseText
        )

      parsed =
        JSON.parse(
          cleaned
        )
    } catch (
      parseError
    ) {
      console.error(
        "Invalid Gemini prediction JSON:",
        responseText
      )

      console.error(
        "JSON parse error:",
        parseError
      )

      parsed = {
        predictions:
          [],
      }
    }

    const geminiPredictions =
      Array.isArray(
        parsed.predictions
      )
        ? parsed.predictions
        : []

    /* ========================================================
       14. CREATE VALID EVIDENCE MAP
    ======================================================== */

    const validEvidence =
      new Map<
        string,
        PatternRow
      >()

    for (
      const pattern of
      patterns
    ) {
      validEvidence.set(
        evidenceKey(
          pattern
        ),
        pattern
      )
    }

    const geminiByEvidenceKey =
      new Map<
        string,
        GeminiPrediction
      >()

    for (
      const prediction of
      geminiPredictions
    ) {
      const key =
        normalizeText(
          prediction.evidence_key
        )

      if (
        !key
      ) {
        continue
      }

      if (
        !validEvidence.has(
          key
        )
      ) {
        console.warn(
          "Ignoring Gemini prediction with unknown evidence key:",
          key
        )

        continue
      }

      if (
        !geminiByEvidenceKey.has(
          key
        )
      ) {
        geminiByEvidenceKey.set(
          key,
          prediction
        )
      }
    }

    /* ========================================================
       15. BUILD PREDICTIONS FROM DATABASE EVIDENCE
    ======================================================== */

    const predictionsForInsert:
      PredictionInsert[] = []

    const evidenceForPrediction =
      new Map<
        string,
        PatternRow
      >()

    for (
      const evidence of
      patterns
    ) {
      const key =
        evidenceKey(
          evidence
        )

      const geminiPrediction =
        geminiByEvidenceKey.get(
          key
        )

      const fallback =
        buildFallbackPrediction(
          evidence
        )

      const concept =
        normalizeText(
          evidence.concept_family
        ) ||
        normalizeText(
          evidence.topic
        ) ||
        "Other"

      /*
       * IMPORTANT:
       *
       * This is now the specific question family rather than
       * automatically using concept_family.
       */
      const family =
        getSpecificQuestionFamily(
          evidence
        )

      const topic =
        normalizeText(
          evidence.topic
        ) ||
        concept

      const subtopic =
        normalizeText(
          evidence.subtopic
        ) ||
        family

      const reasoning =
        normalizeText(
          geminiPrediction?.reasoning
        )

      const whatRepeats =
        normalizeText(
          geminiPrediction?.what_repeats
        )

      const whatChanges =
        normalizeText(
          geminiPrediction?.what_changes
        )

      const combinedReasoning =
        [
          reasoning,

          whatRepeats
            ? `What repeats: ${whatRepeats}`
            : "",

          whatChanges
            ? `What changes: ${whatChanges}`
            : "",
        ]
          .filter(
            Boolean
          )
          .join(
            " "
          )

      const styles =
        uniqueStrings(
          geminiPrediction?.likely_question_styles
        )

      const fallbackStyles =
        uniqueStrings(
          evidence.question_styles
        )

      const revisionAdvice =
        normalizeText(
          geminiPrediction?.revision_advice
        )

      const practiceConcept =
        normalizeText(
          geminiPrediction?.practice_question_concept
        )

      const historicalIds =
        getHistoricalQuestionIds(
          [evidence]
        )

      const finalReasoning =
        combinedReasoning ||
        fallback.reasoning

      const finalRevisionAdvice =
        revisionAdvice ||
        fallback.revision_advice

      const finalPracticeConcept =
        practiceConcept ||
        fallback.practice_question_concept

      predictionsForInsert.push({
        prediction_run_id:
          runId as string,

        ai_student_id:
          student.id,

        topic,

        subtopic,

        paper:
          evidence.paper,

        prediction_score:
          fallback.prediction_score,

        confidence:
          fallback.confidence,

        historical_frequency:
          fallback.historical_frequency,

        recency_score:
          fallback.recency_score,

        variation_score:
          fallback.variation_score,

        mark_weight_score:
          fallback.mark_weight_score,

        reasoning:
          finalReasoning,

        likely_question_styles:
          styles.length > 0
            ? styles
            : fallbackStyles,

        revision_advice:
          finalRevisionAdvice,

        concept_family:
          concept,

        question_family:
          family,

        historical_question_ids:
          historicalIds,

        practice_question_concept:
          finalPracticeConcept,
      })

      evidenceForPrediction.set(
        key,
        evidence
      )
    }

    /* ========================================================
       16. SORT AND LIMIT
    ======================================================== */

    const finalPredictions =
      predictionsForInsert
        .sort(
          (
            a,
            b
          ) =>
            b.prediction_score -
            a.prediction_score
        )
        .slice(
          0,
          12
        )

    if (
      finalPredictions.length ===
      0
    ) {
      throw new Error(
        "No usable predictions could be created from the historical evidence."
      )
    }

    /* ========================================================
       17. SAVE PREDICTIONS
    ======================================================== */

    const {
      error:
        predictionInsertError,
    } =
      await supabaseAdmin
        .from(
          "ai_predictions"
        )
        .insert(
          finalPredictions
        )

    if (
      predictionInsertError
    ) {
      throw new Error(
        `Failed to save predictions: ${predictionInsertError.message}`
      )
    }

    /* ========================================================
       18. COUNT PAPER PREDICTIONS
    ======================================================== */

    const paper1Count =
      finalPredictions.filter(
        (
          prediction
        ) =>
          prediction.paper ===
          "Paper 1"
      ).length

    const paper2Count =
      finalPredictions.filter(
        (
          prediction
        ) =>
          prediction.paper ===
          "Paper 2"
      ).length

    /* ========================================================
       19. CONSUME CREDIT
    ======================================================== */

    const {
      error:
        creditConsumeError,
    } =
      await supabaseAdmin.rpc(
        "consume_ai_credits",
        {
          p_ai_student_id:
            student.id,

          p_amount:
            creditsRequired,

          p_feature:
            "exam_predictor",

          p_description:
            `ZIMSEC O-Level Mathematics ${requestedPaper} prediction`,
        }
      )

    if (
      creditConsumeError
    ) {
      throw new Error(
        `Prediction was generated, but the AI credit could not be consumed: ${creditConsumeError.message}`
      )
    }

    /* ========================================================
       20. COMPLETE RUN
    ======================================================== */

    const {
      error:
        updateRunError,
    } =
      await supabaseAdmin
        .from(
          "ai_prediction_runs"
        )
        .update({
          status:
            "completed",

          credits_used:
            creditsRequired,

          paper_1_prediction_count:
            paper1Count,

          paper_2_prediction_count:
            paper2Count,

          completed_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          runId
        )

    if (
      updateRunError
    ) {
      throw new Error(
        `Predictions were saved, but the prediction run could not be completed: ${updateRunError.message}`
      )
    }

    /* ========================================================
       21. UPDATED CREDIT BALANCE
    ======================================================== */

    const {
      data:
        updatedBalance,
    } =
      await supabaseAdmin
        .from(
          "ai_credit_balances"
        )
        .select(
          "balance"
        )
        .eq(
          "ai_student_id",
          student.id
        )
        .maybeSingle()

    const remainingCredits =
      toNumber(
        updatedBalance?.balance,
        Math.max(
          balance -
            creditsRequired,
          0
        )
      )

    /* ========================================================
       22. BUILD STUDENT RESPONSE
    ======================================================== */

    const predictionResponse =
      finalPredictions.map(
        (
          prediction
        ) => {
          const key =
            [
              prediction.paper,

              prediction.concept_family
                .toLowerCase(),

              prediction.question_family
                .toLowerCase(),
            ].join(
              "|"
            )

          const evidence =
            evidenceForPrediction.get(
              key
            ) ||
            patterns.find(
              (
                pattern
              ) =>
                evidenceKey(
                  pattern
                ) ===
                key
            ) ||
            null

          /* --------------------------------------------------
             RESOLVE ALL HISTORICAL QUESTIONS
          -------------------------------------------------- */

          const historicalQuestions =
            questions
              .filter(
                (
                  question
                ) =>
                  prediction.historical_question_ids.includes(
                    question.id
                  )
              )
              .map(
                (
                  question
                ) => {
                  const paper =
                    papers.find(
                      (
                        item
                      ) =>
                        item.id ===
                        question.paper_id
                    )

                  return {
                    id:
                      question.id,

                    reference:
                      questionReference(
                        question
                      ),

                    year:
                      paper?.exam_year ??
                      null,

                    session:
                      paper?.session ??
                      null,

                    paper:
                      paper?.paper ??
                      prediction.paper,

                    paper_label:
                      paper
                        ? formatPaperLabel(
                            paper
                          )
                        : null,

                    question_number:
                      question.question_number,

                    question_label:
                      question.question_label,

                    question_text:
                      question.question_text,

                    marks:
                      question.marks,

                    topic:
                      question.topic,

                    subtopic:
                      question.subtopic,

                    skills:
                      uniqueStrings(
                        question.skills
                      ),

                    question_type:
                      question.question_type,

                    difficulty:
                      question.difficulty,

                    concept_family:
                      question.concept_family,

                    question_family:
                      question.question_family,

                    variation_patterns:
                      uniqueStrings(
                        question.variation_patterns
                      ),

                    diagram_dependency:
                      question.diagram_dependency,

                    position_band:
                      question.position_band,
                  }
                }
              )
              .sort(
                (
                  a,
                  b
                ) => {
                  if (
                    (b.year ?? 0) !==
                    (a.year ?? 0)
                  ) {
                    return (
                      (b.year ?? 0) -
                      (a.year ?? 0)
                    )
                  }

                  const sessionCompare =
                    normalizeText(
                      b.session
                    ).localeCompare(
                      normalizeText(
                        a.session
                      )
                    )

                  if (
                    sessionCompare !==
                    0
                  ) {
                    return sessionCompare
                  }

                  if (
                    a.paper !==
                    b.paper
                  ) {
                    return (
                      a.paper ===
                      "Paper 1"
                        ? -1
                        : 1
                    )
                  }

                  return (
                    (a.question_number ?? 0) -
                    (b.question_number ?? 0)
                  )
                }
              )

          /* --------------------------------------------------
             STUDENT-FACING HISTORICAL EVIDENCE
          -------------------------------------------------- */

          const historicalEvidence =
            buildStudentHistoricalEvidence(
              prediction.historical_question_ids,
              questions,
              papers
            )

          /* --------------------------------------------------
             OCCURRENCE TABLE
          -------------------------------------------------- */

          const occurrenceTable =
            evidence
              ? buildOccurrenceView(
                  evidence,
                  questions,
                  papers
                )
              : []

          /* --------------------------------------------------
             GEMINI PRACTICE QUESTION
          -------------------------------------------------- */

          const matchingGeminiPrediction =
            geminiByEvidenceKey.get(
              key
            )

          const practiceQuestion =
            normalizeText(
              matchingGeminiPrediction?.practice_question
            )

          return {
            paper:
              prediction.paper,

            topic:
              prediction.topic,

            subtopic:
              prediction.subtopic,

            concept_family:
              prediction.concept_family,

            /*
             * Specific family is what the UI should display
             * as the recurring pattern.
             */
            question_family:
              prediction.question_family,

            prediction_score:
              prediction.prediction_score,

            confidence:
              prediction.confidence,

            historical_frequency:
              prediction.historical_frequency,

            recency_score:
              prediction.recency_score,

            variation_score:
              prediction.variation_score,

            mark_weight_score:
              prediction.mark_weight_score,

            reasoning:
              prediction.reasoning,

            likely_question_styles:
              prediction.likely_question_styles,

            revision_advice:
              prediction.revision_advice,

            practice_question_concept:
              prediction.practice_question_concept,

            practice_question:
              practiceQuestion ||
              null,

            historical_question_ids:
              prediction.historical_question_ids,

            /*
             * REAL HISTORICAL QUESTIONS
             *
             * These contain:
             *
             * - actual Q number
             * - actual question text
             * - actual marks
             * - year
             * - session
             * - paper
             * - normalized paper label
             */
            historical_evidence:
              historicalEvidence,

            paper_occurrences:
              occurrenceTable,

            evidence: {
              papers_appeared:
                evidence
                  ?.papers_appeared ??
                0,

              appearance_rate:
                evidence
                  ?.appearance_rate ??
                0,

              years_seen:
                Array.isArray(
                  evidence?.years_seen
                )
                  ? evidence.years_seen
                  : [],

              position_min:
                evidence
                  ?.position_min ??
                null,

              position_max:
                evidence
                  ?.position_max ??
                null,

              position_average:
                evidence
                  ?.position_average ??
                null,

              average_marks:
                evidence
                  ?.average_marks ??
                0,

              total_marks:
                evidence
                  ?.total_marks ??
                0,

              question_count:
                evidence
                  ?.question_count ??
                0,

              pattern_strength:
                evidence
                  ?.pattern_strength ??
                confidenceFromScore(
                  prediction.prediction_score
                ),

              question_positions:
                Array.isArray(
                  evidence?.question_positions
                )
                  ? evidence.question_positions
                  : [],

              skills:
                uniqueStrings(
                  evidence?.skills
                ),

              question_styles:
                uniqueStrings(
                  evidence?.question_styles
                ),

              historical_questions:
                historicalQuestions,
            },
          }
        }
      )

    /* ========================================================
       23. RETURN SUCCESS
    ======================================================== */

    return NextResponse.json({
      success:
        true,

      runId,

      predictions:
        predictionResponse,

      credits:
        remainingCredits,

      creditsUsed:
        creditsRequired,

      source: {
        papers:
          papers.map(
            (
              paper
            ) => ({
              id:
                paper.id,

              year:
                paper.exam_year,

              session:
                paper.session,

              paper:
                paper.paper,

              label:
                formatPaperLabel(
                  paper
                ),
            })
          ),

        paperCount:
          papers.length,

        questionCount:
          questions.length,

        patternCount:
          patterns.length,
      },

      summary: {
        paper:
          requestedPaper,

        papersAnalysed:
          papers.length,

        questionsAnalysed:
          questions.length,

        predictionsGenerated:
          finalPredictions.length,

        paper1Predictions:
          paper1Count,

        paper2Predictions:
          paper2Count,
      },
    })
  } catch (
    error
  ) {
    console.error(
      "AI Exam Predictor error:",
      error
    )

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to generate exam predictions."

    if (
      runId
    ) {
      try {
        await supabaseAdmin
          .from(
            "ai_prediction_runs"
          )
          .update({
            status:
              "failed",

            error_message:
              errorMessage,

            completed_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            runId
          )
      } catch (
        runUpdateError
      ) {
        console.error(
          "Failed to mark prediction run as failed:",
          runUpdateError
        )
      }
    }

    return NextResponse.json(
      {
        success:
          false,

        error:
          errorMessage,

        code:
          "PREDICTION_FAILED",
      },
      {
        status: 500,
      }
    )
  }
}