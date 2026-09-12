import {
  NextRequest,
  NextResponse,
} from "next/server"

import {
  supabaseAdmin,
} from "@/lib/supabase-admin"

export const runtime = "nodejs"

type RequestedPaper =
  | "Paper 1"
  | "Paper 2"
  | "Both"

type PaperOccurrenceQuestion = {
  question_id: string
  question_number: number
  question_label: string | null
  reference: string
  marks: number | null
}

type PaperOccurrence = {
  paper_id: string
  exam_year: number
  session: string | null
  paper: "Paper 1" | "Paper 2"
  display_label: string
  questions: PaperOccurrenceQuestion[]
}

type PatternRow = {
  id: string

  subject: string

  level: string

  curriculum: string

  paper:
    | "Paper 1"
    | "Paper 2"

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

  years_seen:
    | number[]
    | null

  question_positions:
    | number[]
    | null

  question_styles:
    | string[]
    | null

  skills:
    | string[]
    | null

  example_question_ids:
    | string[]
    | null

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

  mathematical_objects:
    | string[]
    | null

  source_page_start:
    | number
    | null

  source_page_end:
    | number
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
    | "Paper 1"
    | "Paper 2"

  title:
    | string
    | null
}

function normalizePaper(
  value: unknown,
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

function cleanText(
  value: unknown,
): string {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
}

function numberOrZero(
  value: unknown,
): number {
  const number = Number(value)

  return Number.isFinite(number)
    ? number
    : 0
}

function patternStrength(
  score: number,
): "Strong" | "Moderate" | "Weak" {
  if (score >= 70) {
    return "Strong"
  }

  if (score >= 50) {
    return "Moderate"
  }

  return "Weak"
}

function positionDescription(
  pattern: PatternRow,
): string {
  if (
    pattern.position_min == null ||
    pattern.position_max == null
  ) {
    return "Position varies"
  }

  if (
    pattern.position_min ===
    pattern.position_max
  ) {
    return `Usually around Question ${pattern.position_min}`
  }

  return `Historically around Questions ${pattern.position_min}–${pattern.position_max}`
}

function uniqueStrings(
  values: unknown,
): string[] {
  if (!Array.isArray(values)) {
    return []
  }

  return Array.from(
    new Set(
      values
        .map((value) =>
          cleanText(value),
        )
        .filter(Boolean),
    ),
  )
}

function normalizeOccurrences(
  value: unknown,
): PaperOccurrence[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter(
      (
        occurrence,
      ): occurrence is PaperOccurrence =>
        Boolean(
          occurrence &&
            typeof occurrence ===
              "object",
        ),
    )
    .map(
      (occurrence) => ({
        paper_id:
          cleanText(
            occurrence.paper_id,
          ),

        exam_year:
          Number(
            occurrence.exam_year,
          ),

        session:
          cleanText(
            occurrence.session,
          ) || null,

        paper:
          occurrence.paper ===
          "Paper 2"
            ? "Paper 2"
            : "Paper 1",

        display_label:
          cleanText(
            occurrence.display_label,
          ),

        questions:
          Array.isArray(
            occurrence.questions,
          )
            ? occurrence.questions
                .filter(
                  (
                    question,
                  ) =>
                    question &&
                    typeof question ===
                      "object",
                )
                .map(
                  (
                    question,
                  ) => ({
                    question_id:
                      cleanText(
                        question.question_id,
                      ),

                    question_number:
                      Number(
                        question.question_number,
                      ),

                    question_label:
                      cleanText(
                        question.question_label,
                      ) || null,

                    reference:
                      cleanText(
                        question.reference,
                      ),

                    marks:
                      question.marks ==
                        null
                        ? null
                        : Number(
                            question.marks,
                          ),
                  }),
                )
                .filter(
                  (
                    question,
                  ) =>
                    Boolean(
                      question.question_id,
                    ) &&
                    Number.isFinite(
                      question.question_number,
                    ),
                )
            : [],
      }),
    )
    .filter(
      (occurrence) =>
        Boolean(
          occurrence.paper_id,
        ) &&
        Number.isFinite(
          occurrence.exam_year,
        ),
    )
}

function sortOccurrences(
  occurrences: PaperOccurrence[],
): PaperOccurrence[] {
  return [
    ...occurrences,
  ].sort(
    (a, b) => {
      const aSpecimen =
        cleanText(
          a.session,
        ).toLowerCase() ===
          "specimen" ||
        cleanText(
          a.display_label,
        )
          .toLowerCase()
          .includes("specimen")

      const bSpecimen =
        cleanText(
          b.session,
        ).toLowerCase() ===
          "specimen" ||
        cleanText(
          b.display_label,
        )
          .toLowerCase()
          .includes("specimen")

      /*
       * Real examination papers come before
       * specimen papers.
       */
      if (
        aSpecimen !==
        bSpecimen
      ) {
        return aSpecimen
          ? 1
          : -1
      }

      /*
       * Newest examination year first.
       */
      if (
        a.exam_year !==
        b.exam_year
      ) {
        return (
          b.exam_year -
          a.exam_year
        )
      }

      /*
       * November before other sessions
       * when the year is the same.
       */
      const aSession =
        cleanText(
          a.session,
        ).toLowerCase()

      const bSession =
        cleanText(
          b.session,
        ).toLowerCase()

      const aNovember =
        aSession.includes(
          "nov",
        )

      const bNovember =
        bSession.includes(
          "nov",
        )

      if (
        aNovember !==
        bNovember
      ) {
        return aNovember
          ? -1
          : 1
      }

      return a.display_label.localeCompare(
        b.display_label,
      )
    },
  )
}

async function loadQuestions(
  ids: string[],
): Promise<HistoricalQuestion[]> {
  if (
    ids.length === 0
  ) {
    return []
  }

  const uniqueIds =
    Array.from(
      new Set(
        ids.filter(Boolean),
      ),
    )

  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from(
        "ai_zimsec_math_questions",
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
          mathematical_objects,
          source_page_start,
          source_page_end,
          concept_family,
          question_family,
          variation_patterns,
          diagram_dependency,
          position_band
        `,
      )
      .in(
        "id",
        uniqueIds,
      )

  if (error) {
    throw new Error(
      `Failed to retrieve historical evidence questions: ${error.message}`,
    )
  }

  return (
    data || []
  ) as HistoricalQuestion[]
}

async function loadPapers(
  ids: string[],
): Promise<HistoricalPaper[]> {
  if (
    ids.length === 0
  ) {
    return []
  }

  const uniqueIds =
    Array.from(
      new Set(
        ids.filter(Boolean),
      ),
    )

  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from(
        "ai_zimsec_math_papers",
      )
      .select(
        `
          id,
          exam_year,
          session,
          paper,
          title
        `,
      )
      .in(
        "id",
        uniqueIds,
      )

  if (error) {
    throw new Error(
      `Failed to retrieve historical paper information: ${error.message}`,
    )
  }

  return (
    data || []
  ) as HistoricalPaper[]
}

function buildOccurrenceQuestionMap(
  occurrences: PaperOccurrence[],
): Map<
  string,
  {
    occurrence: PaperOccurrence
    question: PaperOccurrenceQuestion
  }
> {
  const map =
    new Map<
      string,
      {
        occurrence: PaperOccurrence
        question: PaperOccurrenceQuestion
      }
    >()

  for (
    const occurrence of occurrences
  ) {
    for (
      const question of occurrence.questions
    ) {
      if (
        !question.question_id
      ) {
        continue
      }

      map.set(
        question.question_id,
        {
          occurrence,
          question,
        },
      )
    }
  }

  return map
}

function mergeQuestionIds(
  patterns: PatternRow[],
): string[] {
  const ids =
    patterns.flatMap(
      (pattern) => {
        const exampleIds =
          Array.isArray(
            pattern.example_question_ids,
          )
            ? pattern.example_question_ids
            : []

        const occurrenceIds =
          normalizeOccurrences(
            pattern.paper_occurrences,
          ).flatMap(
            (occurrence) =>
              occurrence.questions.map(
                (
                  question,
                ) =>
                  question.question_id,
              ),
          )

        return [
          ...exampleIds,
          ...occurrenceIds,
        ]
      },
    )

  return Array.from(
    new Set(
      ids.filter(Boolean),
    ),
  )
}

export async function GET(
  request: NextRequest,
) {
  try {
    const searchParams =
      request.nextUrl.searchParams

    const requestedPaper =
      normalizePaper(
        searchParams.get(
          "paper",
        ),
      ) || "Both"

    const requestedLimit =
      Number(
        searchParams.get(
          "limit",
        ) || "20",
      )

    const limit =
      Number.isFinite(
        requestedLimit,
      )
        ? Math.min(
            Math.max(
              Math.floor(
                requestedLimit,
              ),
              1,
            ),
            50,
          )
        : 20

    /*
     * ==========================================================
     * 1. LOAD DATABASE PATTERN ANALYSIS
     * ==========================================================
     *
     * The database is the authoritative source of historical
     * pattern evidence.
     */
    let query =
      supabaseAdmin
        .from(
          "ai_zimsec_math_pattern_analysis",
        )
        .select(
          `
            id,
            subject,
            level,
            curriculum,
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
          `,
        )
        .eq(
          "subject",
          "Mathematics",
        )
        .eq(
          "level",
          "O-Level",
        )
        .eq(
          "curriculum",
          "ZIMSEC",
        )
        .order(
          "prediction_score",
          {
            ascending:
              false,
          },
        )
        .limit(
          limit,
        )

    if (
      requestedPaper !==
      "Both"
    ) {
      query =
        query.eq(
          "paper",
          requestedPaper,
        )
    }

    const {
      data,
      error,
    } = await query

    if (error) {
      throw new Error(
        `Failed to retrieve pattern analysis: ${error.message}`,
      )
    }

    const patterns =
      (data || []) as PatternRow[]

    /*
     * ==========================================================
     * 2. COLLECT ALL REAL HISTORICAL QUESTION IDS
     * ==========================================================
     *
     * We use BOTH:
     *
     * - example_question_ids
     * - paper_occurrences[].questions[].question_id
     *
     * This prevents the API from depending only on a small
     * example-question subset.
     */
    const historicalQuestionIds =
      mergeQuestionIds(
        patterns,
      )

    const historicalQuestions =
      await loadQuestions(
        historicalQuestionIds,
      )

    /*
     * ==========================================================
     * 3. LOAD PAPER METADATA
     * ==========================================================
     */
    const historicalPaperIds =
      Array.from(
        new Set(
          historicalQuestions.map(
            (
              question,
            ) =>
              question.paper_id,
          ),
        ),
      )

    const historicalPapers =
      await loadPapers(
        historicalPaperIds,
      )

    const paperMap =
      new Map(
        historicalPapers.map(
          (paper) => [
            paper.id,
            paper,
          ],
        ),
      )

    const questionMap =
      new Map(
        historicalQuestions.map(
          (question) => [
            question.id,
            question,
          ],
        ),
      )

    /*
     * ==========================================================
     * 4. BUILD API EVIDENCE
     * ==========================================================
     */
    const evidence =
      patterns.map(
        (pattern) => {
          const occurrences =
            sortOccurrences(
              normalizeOccurrences(
                pattern.paper_occurrences,
              ),
            )

          /*
           * Use example IDs first, then add question IDs found
           * inside paper_occurrences.
           */
          const patternQuestionIds =
            Array.from(
              new Set([
                ...(Array.isArray(
                  pattern.example_question_ids,
                )
                  ? pattern.example_question_ids
                  : []),

                ...occurrences.flatMap(
                  (
                    occurrence,
                  ) =>
                    occurrence.questions.map(
                      (
                        question,
                      ) =>
                        question.question_id,
                    ),
                ),
              ]),
            )

          const questions =
            patternQuestionIds
              .map(
                (id) =>
                  questionMap.get(
                    id,
                  ),
              )
              .filter(
                (
                  question,
                ): question is HistoricalQuestion =>
                  Boolean(
                    question,
                  ),
              )
              .sort(
                (a, b) => {
                  const paperA =
                    paperMap.get(
                      a.paper_id,
                    )

                  const paperB =
                    paperMap.get(
                      b.paper_id,
                    )

                  const yearA =
                    paperA?.exam_year ||
                    0

                  const yearB =
                    paperB?.exam_year ||
                    0

                  if (
                    yearA !==
                    yearB
                  ) {
                    return (
                      yearB -
                      yearA
                    )
                  }

                  const sessionA =
                    cleanText(
                      paperA?.session,
                    ).toLowerCase()

                  const sessionB =
                    cleanText(
                      paperB?.session,
                    ).toLowerCase()

                  const novemberA =
                    sessionA.includes(
                      "nov",
                    )

                  const novemberB =
                    sessionB.includes(
                      "nov",
                    )

                  if (
                    novemberA !==
                    novemberB
                  ) {
                    return novemberA
                      ? -1
                      : 1
                  }

                  return (
                    a.question_number -
                    b.question_number
                  )
                },
              )

          /*
           * A pattern is considered to have historical evidence
           * only when the database gives us actual papers/questions.
           */
          const historicalEvidence =
            occurrences.length >
              0 ||
            questions.length >
              0

          const questionFamily =
            pattern.pattern_type ===
              "Question Family"
              ? cleanText(
                  pattern.pattern_value,
                ) || null
              : null

          return {
            id:
              pattern.id,

            subject:
              pattern.subject,

            level:
              pattern.level,

            curriculum:
              pattern.curriculum,

            paper:
              pattern.paper,

            topic:
              pattern.topic,

            subtopic:
              pattern.subtopic,

            concept_family:
              pattern.concept_family ||
              pattern.topic,

            question_family:
              questionFamily,

            pattern_type:
              pattern.pattern_type,

            pattern_value:
              pattern.pattern_value,

            pattern_strength:
              pattern.pattern_strength ||
              patternStrength(
                numberOrZero(
                  pattern.prediction_score,
                ),
              ),

            question_count:
              numberOrZero(
                pattern.question_count,
              ),

            papers_appeared:
              numberOrZero(
                pattern.papers_appeared,
              ),

            appearance_rate:
              numberOrZero(
                pattern.appearance_rate,
              ),

            total_marks:
              numberOrZero(
                pattern.total_marks,
              ),

            average_marks:
              numberOrZero(
                pattern.average_marks,
              ),

            years_seen:
              Array.isArray(
                pattern.years_seen,
              )
                ? pattern.years_seen
                : [],

            question_positions:
              Array.isArray(
                pattern.question_positions,
              )
                ? pattern.question_positions
                : [],

            position_min:
              pattern.position_min,

            position_max:
              pattern.position_max,

            position_average:
              pattern.position_average,

            position_description:
              positionDescription(
                pattern,
              ),

            question_styles:
              uniqueStrings(
                pattern.question_styles,
              ),

            skills:
              uniqueStrings(
                pattern.skills,
              ),

            frequency_score:
              numberOrZero(
                pattern.frequency_score,
              ),

            recency_score:
              numberOrZero(
                pattern.recency_score,
              ),

            position_score:
              numberOrZero(
                pattern.position_score,
              ),

            style_score:
              numberOrZero(
                pattern.style_score,
              ),

            skill_score:
              numberOrZero(
                pattern.skill_score,
              ),

            mark_weight_score:
              numberOrZero(
                pattern.mark_weight_score,
              ),

            prediction_score:
              numberOrZero(
                pattern.prediction_score,
              ),

            /*
             * This is the complete historical occurrence
             * evidence generated by pattern analysis.
             */
            paper_occurrences:
              occurrences,

            /*
             * This explicitly tells the predictor whether
             * this row has actual historical evidence.
             */
            has_historical_evidence:
              historicalEvidence,

            /*
             * Detailed real questions.
             */
            historical_questions:
              questions.map(
                (question) => {
                  const sourcePaper =
                    paperMap.get(
                      question.paper_id,
                    )

                  return {
                    id:
                      question.id,

                    year:
                      sourcePaper?.exam_year ||
                      null,

                    session:
                      sourcePaper?.session ||
                      null,

                    paper:
                      sourcePaper?.paper ||
                      pattern.paper,

                    question_number:
                      question.question_number,

                    question_label:
                      question.question_label,

                    question_text:
                      question.question_text,

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
                        question.skills,
                      ),

                    question_type:
                      question.question_type,

                    difficulty:
                      question.difficulty,

                    marks:
                      question.marks,

                    paper_section:
                      question.paper_section,

                    variation_patterns:
                      uniqueStrings(
                        question.variation_patterns,
                      ),

                    diagram_dependency:
                      question.diagram_dependency,

                    position_band:
                      question.position_band,

                    source_page_start:
                      question.source_page_start,

                    source_page_end:
                      question.source_page_end,
                  }
                },
              ),
          }
        },
      )

    /*
     * ==========================================================
     * 5. SUMMARY DIAGNOSTICS
     * ==========================================================
     */
    const historicalEvidencePatterns =
      evidence.filter(
        (pattern) =>
          pattern.has_historical_evidence,
      )

    const highestPredictionScore =
      evidence.reduce(
        (
          highest,
          pattern,
        ) =>
          Math.max(
            highest,
            numberOrZero(
              pattern.prediction_score,
            ),
          ),
        0,
      )

    /*
     * ==========================================================
     * 6. RESPONSE
     * ==========================================================
     */
    return NextResponse.json({
      success: true,

      paper:
        requestedPaper,

      patterns:
        evidence,

      count:
        evidence.length,

      historical_question_count:
        historicalQuestions.length,

      historical_evidence_patterns:
        historicalEvidencePatterns.length,

      highest_prediction_score:
        highestPredictionScore,

      has_historical_evidence:
        historicalEvidencePatterns.length >
        0,
    })
  } catch (error) {
    console.error(
      "ZIMSEC pattern-analysis API error:",
      error,
    )

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve ZIMSEC Mathematics pattern analysis.",

        code:
          "PATTERN_ANALYSIS_FAILED",
      },
      {
        status: 500,
      },
    )
  }
}