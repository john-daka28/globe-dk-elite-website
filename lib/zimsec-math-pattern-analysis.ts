import {
  supabaseAdmin,
} from "@/lib/supabase-admin"

/*
 * ============================================================
 * ZIMSEC MATHEMATICS PATTERN ANALYSIS
 * ============================================================
 *
 * Pipeline:
 *
 * ai_zimsec_math_papers
 *        ↓
 * ai_zimsec_math_questions
 *        ↓
 * question-level patterns
 *        ↓
 * broad historical aggregates
 *        ↓
 * ai_zimsec_math_pattern_analysis
 *
 * The aggregate table is the authoritative historical evidence
 * used by the AI predictor.
 *
 * ============================================================
 */

type PaperRow = {
  id: string
  exam_year: number
  session: string | null
  paper: "Paper 1" | "Paper 2"
  subject: string
  level: string
  curriculum: string
}

type QuestionRow = {
  id: string
  paper_id: string
  question_number: number
  question_label: string | null
  question_text: string
  topic: string | null
  subtopic: string | null
  skills: string[] | null
  question_type: string | null
  difficulty: string | null
  marks: number | null
  paper_section: string | null
  mathematical_objects: string[] | null
  concept_family: string | null
  question_family: string | null
  variation_patterns: string[] | null
  diagram_dependency: string | null
  position_band: string | null
}

type QuestionPatternRow = {
  question_id: string
  pattern_type: string
  pattern_value: string
}

/*
 * ============================================================
 * HISTORICAL PAPER OCCURRENCE
 * ============================================================
 */

export type PaperOccurrenceQuestion = {
  question_id: string
  question_number: number
  question_label: string | null
  reference: string
  marks: number | null
}

export type PaperOccurrence = {
  paper_id: string
  exam_year: number
  session: string | null
  paper: "Paper 1" | "Paper 2"
  display_label: string
  questions: PaperOccurrenceQuestion[]
}

type Aggregate = {
  paper: "Paper 1" | "Paper 2"

  topic: string
  subtopic: string

  concept_family: string
  question_family: string

  questions: QuestionRow[]
  papers: PaperRow[]

  styles: Set<string>
  skills: Set<string>
  variations: Set<string>
  positionBands: Set<string>
}

export type PatternAnalysisResult = {
  success: boolean

  papersAnalysed: number
  questionsAnalysed: number

  questionPatternsCreated: number
  aggregatePatternsCreated: number

  paperResults: Array<{
    paper: string
    papers: number
    questions: number
    patterns: number
  }>
}

/*
 * ============================================================
 * BASIC HELPERS
 * ============================================================
 */

function cleanText(
  value: unknown
): string {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
}

function lower(
  value: unknown
): string {
  return cleanText(
    value
  ).toLowerCase()
}

function uniqueStrings(
  values: unknown
): string[] {
  if (
    !Array.isArray(
      values
    )
  ) {
    return []
  }

  return Array.from(
    new Set(
      values
        .map(
          (value) =>
            cleanText(
              value
            )
        )
        .filter(Boolean)
    )
  )
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

/*
 * ============================================================
 * PAPER DISPLAY HELPERS
 * ============================================================
 */

function shortPaperName(
  paper: PaperRow
): string {
  return paper.paper ===
    "Paper 1"
    ? "P1"
    : "P2"
}

function normaliseSessionMonth(
  session: string
): string {
  const value =
    lower(
      session
    )

  if (
    value.includes(
      "november"
    ) ||
    value === "nov" ||
    value.includes(
      " nov"
    )
  ) {
    return "Nov"
  }

  if (
    value.includes(
      "june"
    ) ||
    value === "jun" ||
    value.includes(
      " jun"
    )
  ) {
    return "June"
  }

  if (
    value.includes(
      "may"
    )
  ) {
    return "May"
  }

  if (
    value.includes(
      "march"
    ) ||
    value === "mar"
  ) {
    return "Mar"
  }

  if (
    value.includes(
      "february"
    ) ||
    value === "feb"
  ) {
    return "Feb"
  }

  if (
    value.includes(
      "january"
    ) ||
    value === "jan"
  ) {
    return "Jan"
  }

  return cleanText(
    session
  )
}

function extractSyllabus(
  session: string
): string | null {
  const match =
    session.match(
      /(?:syllabus|syll\.?)\s*[-:]?\s*([ab])/i
    )

  if (
    match?.[1]
  ) {
    return match[1].toUpperCase()
  }

  return null
}

function formatPaperLabel(
  paper: PaperRow
): string {
  const session =
    cleanText(
      paper.session
    )

  const sessionLower =
    lower(
      session
    )

  const paperName =
    shortPaperName(
      paper
    )

  if (
    sessionLower.includes(
      "specimen"
    )
  ) {
    const syllabus =
      extractSyllabus(
        session
      )

    return (
      `Specimen ${paperName}` +
      (
        syllabus
          ? ` (Syll. ${syllabus})`
          : ""
      )
    )
  }

  const month =
    normaliseSessionMonth(
      session
    )

  if (
    month
  ) {
    return (
      `${month} ${paper.exam_year} ${paperName}`
    )
  }

  return (
    `${paper.exam_year} ${paperName}`
  )
}

/*
 * ============================================================
 * QUESTION DISPLAY HELPERS
 * ============================================================
 */

function formatQuestionReference(
  question: QuestionRow
): string {
  const label =
    cleanText(
      question.question_label
    )

  if (
    label
  ) {
    if (
      /^q/i.test(
        label
      )
    ) {
      return label
    }

    if (
      /^\d/.test(
        label
      )
    ) {
      return `Q${label}`
    }

    return label
  }

  return (
    `Q${question.question_number}`
  )
}

/*
 * ============================================================
 * HISTORICAL OCCURRENCES
 * ============================================================
 */

function buildPaperOccurrences(
  questions: QuestionRow[],
  paperMap: Map<string, PaperRow>
): PaperOccurrence[] {
  const occurrenceMap =
    new Map<
      string,
      PaperOccurrence
    >()

  for (
    const question of
    questions
  ) {
    const paper =
      paperMap.get(
        question.paper_id
      )

    if (
      !paper
    ) {
      continue
    }

    const questionEntry:
      PaperOccurrenceQuestion =
      {
        question_id:
          question.id,

        question_number:
          question.question_number,

        question_label:
          question.question_label,

        reference:
          formatQuestionReference(
            question
          ),

        marks:
          question.marks,
      }

    const existing =
      occurrenceMap.get(
        paper.id
      )

    if (
      existing
    ) {
      existing.questions.push(
        questionEntry
      )
    } else {
      occurrenceMap.set(
        paper.id,
        {
          paper_id:
            paper.id,

          exam_year:
            paper.exam_year,

          session:
            paper.session,

          paper:
            paper.paper,

          display_label:
            formatPaperLabel(
              paper
            ),

          questions: [
            questionEntry,
          ],
        }
      )
    }
  }

  const occurrences =
    Array.from(
      occurrenceMap.values()
    )

  for (
    const occurrence of
    occurrences
  ) {
    occurrence.questions.sort(
      (a, b) => {
        if (
          a.question_number !==
          b.question_number
        ) {
          return (
            a.question_number -
            b.question_number
          )
        }

        return (
          a.reference.localeCompare(
            b.reference,
            undefined,
            {
              numeric:
                true,
            }
          )
        )
      }
    )
  }

  /*
   * Most recent examination first.
   *
   * Specimen papers remain at the bottom.
   */
  occurrences.sort(
    (a, b) => {
      const aSpecimen =
        lower(
          a.session
        ).includes(
          "specimen"
        )

      const bSpecimen =
        lower(
          b.session
        ).includes(
          "specimen"
        )

      if (
        aSpecimen !==
        bSpecimen
      ) {
        return aSpecimen
          ? 1
          : -1
      }

      if (
        a.exam_year !==
        b.exam_year
      ) {
        return (
          b.exam_year -
          a.exam_year
        )
      }

      const aSession =
        lower(
          a.session
        )

      const bSession =
        lower(
          b.session
        )

      const aNovember =
        aSession.includes(
          "nov"
        )

      const bNovember =
        bSession.includes(
          "nov"
        )

      if (
        aNovember !==
        bNovember
      ) {
        return aNovember
          ? -1
          : 1
      }

      return (
        a.display_label.localeCompare(
          b.display_label
        )
      )
    }
  )

  return occurrences
}

/*
 * ============================================================
 * CANONICAL CONCEPT
 * ============================================================
 */

function canonicalConcept(
  question: QuestionRow
): string {
  const supplied =
    cleanText(
      question.concept_family
    )

  const searchText =
    [
      supplied,
      question.topic,
      question.subtopic,
      question.question_family,
      question.question_text,
    ]
      .map(lower)
      .join(" ")

  /*
   * Specific concepts FIRST.
   */

  if (
    searchText.includes(
      "number base"
    ) ||
    searchText.includes(
      "mixed base"
    ) ||
    searchText.includes(
      "base arithmetic"
    ) ||
    /\bbinary\b/.test(
      searchText
    )
  ) {
    return (
      "Number Bases and Mixed Base Arithmetic"
    )
  }

  if (
    searchText.includes(
      "matrix"
    ) ||
    searchText.includes(
      "matrices"
    ) ||
    searchText.includes(
      "determinant"
    )
  ) {
    return "Matrices"
  }

  if (
    searchText.includes(
      "venn"
    ) ||
    searchText.includes(
      "set theory"
    ) ||
    /\bsets\b/.test(
      searchText
    ) ||
    searchText.includes(
      "union"
    ) ||
    searchText.includes(
      "intersection"
    )
  ) {
    return (
      "Set Theory and Venn"
    )
  }

  if (
    searchText.includes(
      "statistic"
    ) ||
    searchText.includes(
      "mean"
    ) ||
    searchText.includes(
      "median"
    ) ||
    searchText.includes(
      "mode"
    ) ||
    searchText.includes(
      "frequency table"
    ) ||
    searchText.includes(
      "histogram"
    )
  ) {
    return "Statistics"
  }

  if (
    searchText.includes(
      "kinematic"
    ) ||
    searchText.includes(
      "velocity-time"
    ) ||
    searchText.includes(
      "speed-time"
    ) ||
    searchText.includes(
      "acceleration"
    ) ||
    searchText.includes(
      "motion"
    )
  ) {
    return (
      "Motion and Kinematics"
    )
  }

  if (
    searchText.includes(
      "similar triangle"
    ) ||
    searchText.includes(
      "similarity"
    ) ||
    searchText.includes(
      "congru"
    )
  ) {
    return (
      "Similarity and Congruency"
    )
  }

  if (
    searchText.includes(
      "function"
    ) ||
    searchText.includes(
      "exponential"
    ) ||
    searchText.includes(
      "index equation"
    ) ||
    searchText.includes(
      "indices"
    )
  ) {
    return (
      "Functions and Exponential"
    )
  }

  if (
    searchText.includes(
      "map scale"
    ) ||
    searchText.includes(
      "area scale"
    ) ||
    searchText.includes(
      "scale drawing"
    )
  ) {
    return (
      "Map Scales and Measurement"
    )
  }

  if (
    searchText.includes(
      "bearing"
    )
  ) {
    return "Bearings"
  }

  if (
    searchText.includes(
      "vector"
    )
  ) {
    return "Vectors"
  }

  if (
    searchText.includes(
      "circle theorem"
    ) ||
    searchText.includes(
      "circle geometry"
    ) ||
    searchText.includes(
      "tangent"
    ) ||
    searchText.includes(
      "subtended"
    )
  ) {
    return "Circle Geometry"
  }

  if (
    searchText.includes(
      "simultaneous"
    )
  ) {
    return (
      "Simultaneous Linear Equations"
    )
  }

  if (
    searchText.includes(
      "trigonometry"
    ) ||
    searchText.includes(
      "sine rule"
    ) ||
    searchText.includes(
      "cosine rule"
    )
  ) {
    return "Trigonometry"
  }

  if (
    searchText.includes(
      "probability"
    )
  ) {
    return "Probability"
  }

  if (
    searchText.includes(
      "mensuration"
    ) ||
    searchText.includes(
      "surface area"
    ) ||
    searchText.includes(
      "volume"
    )
  ) {
    return "Mensuration"
  }

  if (
    searchText.includes(
      "financial mathematics"
    ) ||
    searchText.includes(
      "simple interest"
    ) ||
    searchText.includes(
      "compound interest"
    )
  ) {
    return (
      "Financial Mathematics"
    )
  }

  if (
    searchText.includes(
      "inequality"
    ) ||
    searchText.includes(
      "inequalities"
    )
  ) {
    return "Inequalities"
  }

  if (
    searchText.includes(
      "factorisation"
    ) ||
    searchText.includes(
      "factorization"
    )
  ) {
    return "Algebraic Manipulation and Equations"
  }

  if (
    searchText.includes(
      "sequence"
    ) ||
    searchText.includes(
      "progression"
    )
  ) {
    return "Sequences"
  }

  if (
    searchText.includes(
      "surds"
    )
  ) {
    return "Surds"
  }

  if (
    searchText.includes(
      "indices"
    )
  ) {
    return "Indices"
  }

  return (
    supplied ||
    cleanText(
      question.topic
    ) ||
    "Other"
  )
}

/*
 * ============================================================
 * CANONICAL QUESTION FAMILY
 * ============================================================
 */

function canonicalQuestionFamily(
  question: QuestionRow,
  conceptFamily: string
): string {
  const supplied =
    cleanText(
      question.question_family
    )

  const searchText =
    [
      supplied,
      question.subtopic,
      question.question_type,
      question.question_text,
    ]
      .map(lower)
      .join(" ")

  if (
    conceptFamily ===
    "Matrices"
  ) {
    return (
      "Matrices (Operations, Inverse and Singular)"
    )
  }

  if (
    conceptFamily ===
    "Number Bases and Mixed Base Arithmetic"
  ) {
    return (
      "Number Bases & Mixed Base Arithmetic"
    )
  }

  if (
    conceptFamily ===
    "Set Theory and Venn"
  ) {
    return (
      "Set Theory and Venn Diagrams"
    )
  }

  if (
    conceptFamily ===
    "Functions and Exponential"
  ) {
    if (
      /\binverse function\b|\bcomposite function\b/.test(
        searchText
      )
    ) {
      return (
        "Functions (Evaluation, Inverse and Composite)"
      )
    }

    return (
      "Functions and Index/Exponential Equations"
    )
  }

  if (
    conceptFamily ===
    "Statistics"
  ) {
    return (
      "Statistics (Mean, Median, Mode and Data Interpretation)"
    )
  }

  if (
    conceptFamily ===
    "Motion and Kinematics"
  ) {
    return (
      "Kinematics (Velocity/Speed-Time Graphs, Motion and Acceleration)"
    )
  }

  if (
    conceptFamily ===
    "Similarity and Congruency"
  ) {
    return (
      "Similar Triangles and Scale Factors"
    )
  }

  if (
    conceptFamily ===
    "Map Scales and Measurement"
  ) {
    return (
      "Map Scales & Area Scale Conversions"
    )
  }

  if (
    conceptFamily ===
    "Bearings"
  ) {
    return "Bearings & Navigation"
  }

  if (
    conceptFamily ===
    "Vectors"
  ) {
    return (
      "Vectors (Column Vectors, Magnitude & Geometry)"
    )
  }

  if (
    conceptFamily ===
    "Circle Geometry"
  ) {
    return (
      "Circle Geometry (Tangents & Subtended Angles)"
    )
  }

  if (
    conceptFamily ===
    "Simultaneous Linear Equations"
  ) {
    return (
      "Simultaneous Linear Equations"
    )
  }

  if (
    conceptFamily ===
    "Probability"
  ) {
    return (
      "Probability (Calculation and Interpretation)"
    )
  }

  if (
    conceptFamily ===
    "Mensuration"
  ) {
    return (
      "Mensuration (Area, Perimeter, Surface Area and Volume)"
    )
  }

  if (
    conceptFamily ===
    "Trigonometry"
  ) {
    return "Trigonometry"
  }

  if (
    conceptFamily ===
    "Financial Mathematics"
  ) {
    return "Financial Mathematics"
  }

  if (
    conceptFamily ===
    "Algebraic Manipulation and Equations"
  ) {
    if (
      /\bfactor/.test(
        searchText
      )
    ) {
      return (
        "Algebraic Factorisation and Manipulation"
      )
    }

    if (
      /\bquadratic\b/.test(
        searchText
      )
    ) {
      return "Quadratic Equations"
    }

    return (
      "Algebraic Manipulation and Equations"
    )
  }

  return (
    supplied ||
    cleanText(
      question.subtopic
    ) ||
    cleanText(
      question.question_type
    ) ||
    conceptFamily ||
    "General"
  )
}

/*
 * ============================================================
 * POSITION BAND
 * ============================================================
 */

function positionBand(
  question: QuestionRow
): string {
  const stored =
    cleanText(
      question.position_band
    )

  if (
    stored
  ) {
    /*
     * Normalise old values created by previous versions.
     */
    if (
      stored === "Early-Mid"
    ) {
      return "Early-Middle"
    }

    if (
      stored === "Mid"
    ) {
      return "Middle"
    }

    if (
      stored === "Mid-Late"
    ) {
      return "Middle-Late"
    }

    if (
      stored === "Very Late"
    ) {
      return "Late"
    }

    return stored
  }

  const number =
    Number(
      question.question_number
    )

  if (
    number <= 5
  ) {
    return "Early"
  }

  if (
    number <= 10
  ) {
    return "Early-Middle"
  }

  if (
    number <= 15
  ) {
    return "Middle"
  }

  if (
    number <= 20
  ) {
    return "Middle-Late"
  }

  return "Late"
}

/*
 * ============================================================
 * SCORING
 * ============================================================
 */

function positionScore(
  questions: QuestionRow[]
): number {
  if (
    questions.length <= 1
  ) {
    return 100
  }

  const positions =
    questions.map(
      (question) =>
        question.question_number
    )

  const minimum =
    Math.min(
      ...positions
    )

  const maximum =
    Math.max(
      ...positions
    )

  const spread =
    maximum -
    minimum

  if (
    spread <= 2
  ) {
    return 100
  }

  if (
    spread <= 5
  ) {
    return 90
  }

  if (
    spread <= 8
  ) {
    return 78
  }

  if (
    spread <= 12
  ) {
    return 65
  }

  if (
    spread <= 16
  ) {
    return 50
  }

  return 35
}

function recencyScore(
  questions: QuestionRow[],
  paperMap: Map<
    string,
    PaperRow
  >
): number {
  const years =
    questions
      .map(
        (question) =>
          paperMap.get(
            question.paper_id
          )?.exam_year
      )
      .filter(
        (
          year
        ): year is number =>
          typeof year ===
          "number"
      )

  if (
    years.length === 0
  ) {
    return 0
  }

  const latest =
    Math.max(
      ...years
    )

  const allYears =
    Array.from(
      paperMap.values()
    )
      .map(
        (paper) =>
          paper.exam_year
      )

  if (
    allYears.length === 0
  ) {
    return 0
  }

  const datasetLatest =
    Math.max(
      ...allYears
    )

  const age =
    Math.max(
      datasetLatest -
        latest,
      0
    )

  if (
    age === 0
  ) {
    return 100
  }

  if (
    age === 1
  ) {
    return 80
  }

  if (
    age === 2
  ) {
    return 65
  }

  if (
    age === 3
  ) {
    return 52
  }

  return clamp(
    52 -
      (age - 3) * 8,
    25,
    52
  )
}

function variationScore(
  aggregate: Aggregate
): number {
  const styles =
    aggregate.styles.size

  const skills =
    aggregate.skills.size

  const variations =
    aggregate.variations.size

  return clamp(
    styles * 15 +
      skills * 8 +
      variations * 10
  )
}

function skillScore(
  aggregate: Aggregate
): number {
  return clamp(
    aggregate.skills.size *
      15
  )
}

function markWeightScore(
  aggregate: Aggregate,
  paperQuestions: QuestionRow[]
): number {
  const totalMarks =
    aggregate.questions.reduce(
      (
        sum,
        question
      ) =>
        sum +
        Math.max(
          Number(
            question.marks
          ) || 0,
          0
        ),
      0
    )

  const paperMarks =
    paperQuestions.reduce(
      (
        sum,
        question
      ) =>
        sum +
        Math.max(
          Number(
            question.marks
          ) || 0,
          0
        ),
      0
    )

  if (
    paperMarks <= 0
  ) {
    return 0
  }

  return clamp(
    (
      totalMarks /
      paperMarks
    ) *
      100 *
      4
  )
}

function patternStrength(
  score: number
): "Strong" | "Moderate" | "Weak" {
  if (
    score >= 70
  ) {
    return "Strong"
  }

  if (
    score >= 50
  ) {
    return "Moderate"
  }

  return "Weak"
}

/*
 * ============================================================
 * QUESTION-LEVEL PATTERN ROWS
 * ============================================================
 *
 * NOTE:
 *
 * This function is intentionally called
 * buildQuestionPatternRows()
 *
 * so it cannot collide with the local array variable later.
 * ============================================================
 */

function buildQuestionPatternRows(
  question: QuestionRow,
  conceptFamily: string,
  questionFamily: string
): QuestionPatternRow[] {
  const rows:
    QuestionPatternRow[] =
    []

  rows.push({
    question_id:
      question.id,

    pattern_type:
      "Concept Family",

    pattern_value:
      conceptFamily,
  })

  rows.push({
    question_id:
      question.id,

    pattern_type:
      "Question Family",

    pattern_value:
      questionFamily,
  })

  const subtopic =
    cleanText(
      question.subtopic
    )

  if (
    subtopic
  ) {
    rows.push({
      question_id:
        question.id,

      pattern_type:
        "Subtopic",

      pattern_value:
        subtopic,
    })
  }

  const questionType =
    cleanText(
      question.question_type
    )

  if (
    questionType
  ) {
    rows.push({
      question_id:
        question.id,

      pattern_type:
        "Question Type",

      pattern_value:
        questionType,
    })
  }

  for (
    const skill of
    uniqueStrings(
      question.skills
    )
  ) {
    rows.push({
      question_id:
        question.id,

      pattern_type:
        "Skill",

      pattern_value:
        skill,
    })
  }

  for (
    const variation of
    uniqueStrings(
      question.variation_patterns
    )
  ) {
    rows.push({
      question_id:
        question.id,

      pattern_type:
        "Variation",

      pattern_value:
        variation,
    })
  }

  const diagram =
    cleanText(
      question.diagram_dependency
    )

  if (
    diagram
  ) {
    rows.push({
      question_id:
        question.id,

      pattern_type:
        "Diagram Dependency",

      pattern_value:
        diagram,
    })
  }

  rows.push({
    question_id:
      question.id,

    pattern_type:
      "Position Band",

    pattern_value:
      positionBand(
        question
      ),
  })

  return rows
}

/*
 * ============================================================
 * MAIN FUNCTION
 * ============================================================
 */

export async function generateZimsecMathPatternAnalysis(
  options?: {
    paper?:
      | "Paper 1"
      | "Paper 2"
      | "Both"
  }
): Promise<PatternAnalysisResult> {
  const requestedPaper =
    options?.paper ||
    "Both"

  /*
   * ==========================================================
   * 1. GET COMPLETED PAPERS
   * ==========================================================
   */

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
          paper,
          subject,
          level,
          curriculum
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
            true,
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
    error: paperError,
  } =
    await paperQuery

  if (
    paperError
  ) {
    throw new Error(
      `Failed to retrieve Mathematics papers for pattern analysis: ${paperError.message}`
    )
  }

  const papers =
    (rawPapers ||
      []) as PaperRow[]

  if (
    papers.length ===
    0
  ) {
    return {
      success: true,

      papersAnalysed:
        0,

      questionsAnalysed:
        0,

      questionPatternsCreated:
        0,

      aggregatePatternsCreated:
        0,

      paperResults: [],
    }
  }

  const paperMap =
    new Map<
      string,
      PaperRow
    >(
      papers.map(
        (paper) => [
          paper.id,
          paper,
        ]
      )
    )

  /*
   * ==========================================================
   * 2. GET ALL QUESTIONS
   * ==========================================================
   */

  const paperIds =
    papers.map(
      (paper) =>
        paper.id
    )

  const {
    data: rawQuestions,
    error: questionError,
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
          mathematical_objects,
          concept_family,
          question_family,
          variation_patterns,
          diagram_dependency,
          position_band
        `
      )
      .in(
        "paper_id",
        paperIds
      )
      .order(
        "question_number",
        {
          ascending:
            true,
        }
      )

  if (
    questionError
  ) {
    throw new Error(
      `Failed to retrieve Mathematics questions for pattern analysis: ${questionError.message}`
    )
  }

  const questions =
    (rawQuestions ||
      []) as QuestionRow[]

  /*
   * ==========================================================
   * 3. REBUILD QUESTION-LEVEL PATTERNS
   * ==========================================================
   */

  const questionIds =
    questions.map(
      (question) =>
        question.id
    )

  if (
    questionIds.length >
    0
  ) {
    const {
      error:
        deleteQuestionPatternsError,
    } =
      await supabaseAdmin
        .from(
          "ai_zimsec_math_question_patterns"
        )
        .delete()
        .in(
          "question_id",
          questionIds
        )

    if (
      deleteQuestionPatternsError
    ) {
      throw new Error(
        `Failed to rebuild question patterns: ${deleteQuestionPatternsError.message}`
      )
    }
  }

  /*
   * FIX:
   *
   * The original file used questionPatternRows both as:
   *
   * function questionPatternRows()
   *
   * and:
   *
   * const questionPatternRows = ...
   *
   * This version uses buildQuestionPatternRows()
   * for the function and questionPatternRowsToInsert
   * for the array.
   */

  const questionPatternRowsToInsert =
    questions.flatMap(
      (question) => {
        const concept =
          canonicalConcept(
            question
          )

        const family =
          canonicalQuestionFamily(
            question,
            concept
          )

        return buildQuestionPatternRows(
          question,
          concept,
          family
        )
      }
    )

  if (
    questionPatternRowsToInsert.length >
    0
  ) {
    const {
      error:
        insertQuestionPatternsError,
    } =
      await supabaseAdmin
        .from(
          "ai_zimsec_math_question_patterns"
        )
        .insert(
          questionPatternRowsToInsert
        )

    if (
      insertQuestionPatternsError
    ) {
      throw new Error(
        `Failed to insert question patterns: ${insertQuestionPatternsError.message}`
      )
    }
  }

  /*
   * ==========================================================
   * 4. BUILD BROAD CONCEPT AGGREGATES
   * ==========================================================
   *
   * IMPORTANT:
   *
   * We group by:
   *
   * Paper + Concept Family
   *
   * NOT by individual wording.
   *
   * Therefore:
   *
   * Matrix operations
   * Matrix inverse
   * Singular matrices
   *
   * remain one broad historical Matrix pattern.
   */

  const aggregateMap =
    new Map<
      string,
      Aggregate
    >()

  for (
    const question of
    questions
  ) {
    const paper =
      paperMap.get(
        question.paper_id
      )

    if (
      !paper
    ) {
      continue
    }

    const concept =
      canonicalConcept(
        question
      )

    const family =
      canonicalQuestionFamily(
        question,
        concept
      )

    /*
     * IMPORTANT:
     *
     * Use the canonical concept as the primary aggregate key.
     *
     * This prevents:
     *
     * Matrices
     * Matrix Operations
     * Matrix Inverse
     *
     * from becoming separate prediction patterns.
     */

    const key =
      [
        paper.paper,
        concept.toLowerCase(),
      ].join("|")

    const existing =
      aggregateMap.get(
        key
      )

    if (
      existing
    ) {
      existing.questions.push(
        question
      )

      if (
        !existing.papers.some(
          (item) =>
            item.id ===
            paper.id
        )
      ) {
        existing.papers.push(
          paper
        )
      }

      const questionStyles =
        [
          question.question_type,
          ...uniqueStrings(
            question.variation_patterns
          ),
          family,
        ]

      for (
        const style of
        questionStyles
      ) {
        const clean =
          cleanText(
            style
          )

        if (
          clean
        ) {
          existing.styles.add(
            clean
          )
        }
      }

      for (
        const skill of
        uniqueStrings(
          question.skills
        )
      ) {
        existing.skills.add(
          skill
        )
      }

      for (
        const variation of
        uniqueStrings(
          question.variation_patterns
        )
      ) {
        existing.variations.add(
          variation
        )
      }

      existing.positionBands.add(
        positionBand(
          question
        )
      )
    } else {
      const aggregate:
        Aggregate =
        {
          paper:
            paper.paper,

          topic:
            cleanText(
              question.topic
            ) ||
            concept,

          subtopic:
            cleanText(
              question.subtopic
            ) ||
            "General",

          concept_family:
            concept,

          question_family:
            family,

          questions: [
            question,
          ],

          papers: [
            paper,
          ],

          styles:
            new Set(
              [
                question.question_type,
                family,
                ...uniqueStrings(
                  question.variation_patterns
                ),
              ]
                .map(
                  (value) =>
                    cleanText(
                      value
                    )
                )
                .filter(
                  Boolean
                )
            ),

          skills:
            new Set(
              uniqueStrings(
                question.skills
              )
            ),

          variations:
            new Set(
              uniqueStrings(
                question.variation_patterns
              )
            ),

          positionBands:
            new Set([
              positionBand(
                question
              ),
            ]),
        }

      aggregateMap.set(
        key,
        aggregate
      )
    }
  }

  /*
   * ==========================================================
   * 5. PAPER QUESTION GROUPS
   * ==========================================================
   */

  const paperGroups =
    new Map<
      string,
      QuestionRow[]
    >()

  for (
    const question of
    questions
  ) {
    const paper =
      paperMap.get(
        question.paper_id
      )

    if (
      !paper
    ) {
      continue
    }

    const existing =
      paperGroups.get(
        paper.paper
      )

    if (
      existing
    ) {
      existing.push(
        question
      )
    } else {
      paperGroups.set(
        paper.paper,
        [
          question,
        ]
      )
    }
  }

  /*
   * ==========================================================
   * 6. BUILD FINAL AGGREGATE ROWS
   * ==========================================================
   */

  const finalRows:
    any[] =
    []

  for (
    const aggregate of
    aggregateMap.values()
  ) {
    const paperQuestions =
      paperGroups.get(
        aggregate.paper
      ) ||
      []

    const questionCount =
      aggregate.questions.length

    const papersAppeared =
      new Set(
        aggregate.papers.map(
          (paper) =>
            paper.id
        )
      ).size

    const totalPapersForPaper =
      papers.filter(
        (paper) =>
          paper.paper ===
          aggregate.paper
      ).length

    /*
     * --------------------------------------------------------
     * FREQUENCY
     * --------------------------------------------------------
     */

    const frequencyReference =
      Math.max(
        1,
        ...Array.from(
          aggregateMap.values()
        )
          .filter(
            (item) =>
              item.paper ===
              aggregate.paper
          )
          .map(
            (item) =>
              item.questions.length
          )
      )

    const frequencyScore =
      clamp(
        (
          questionCount /
          frequencyReference
        ) *
          100
      )

    /*
     * --------------------------------------------------------
     * COVERAGE
     * --------------------------------------------------------
     */

    const coverageScore =
      totalPapersForPaper >
      0
        ? clamp(
            (
              papersAppeared /
              totalPapersForPaper
            ) *
              100
          )
        : 0

    /*
     * --------------------------------------------------------
     * POSITION
     * --------------------------------------------------------
     */

    const positionScoreValue =
      positionScore(
        aggregate.questions
      )

    /*
     * --------------------------------------------------------
     * VARIATION
     * --------------------------------------------------------
     */

    const variationScoreValue =
      variationScore(
        aggregate
      )

    /*
     * --------------------------------------------------------
     * RECENCY
     * --------------------------------------------------------
     */

    const recencyScoreValue =
      recencyScore(
        aggregate.questions,
        paperMap
      )

    /*
     * --------------------------------------------------------
     * SKILLS
     * --------------------------------------------------------
     */

    const skillScoreValue =
      skillScore(
        aggregate
      )

    /*
     * --------------------------------------------------------
     * MARK WEIGHT
     * --------------------------------------------------------
     */

    const markScore =
      markWeightScore(
        aggregate,
        paperQuestions
      )

    /*
     * --------------------------------------------------------
     * FINAL PREDICTION SCORE
     * --------------------------------------------------------
     *
     * This is a ranking score.
     *
     * It is NOT a probability.
     */

    const predictionScore =
      Math.round(
        frequencyScore *
          0.25 +
          coverageScore *
          0.20 +
          positionScoreValue *
          0.15 +
          variationScoreValue *
          0.15 +
          recencyScoreValue *
          0.10 +
          skillScoreValue *
          0.10 +
          markScore *
          0.05
      )

    /*
     * --------------------------------------------------------
     * YEARS
     * --------------------------------------------------------
     */

    const yearsSeen =
      Array.from(
        new Set(
          aggregate.papers.map(
            (paper) =>
              paper.exam_year
          )
        )
      ).sort(
        (a, b) =>
          a - b
      )

    /*
     * --------------------------------------------------------
     * POSITIONS
     * --------------------------------------------------------
     */

    const positions =
      aggregate.questions
        .map(
          (question) =>
            question.question_number
        )
        .sort(
          (a, b) =>
            a - b
        )

    /*
     * --------------------------------------------------------
     * MARKS
     * --------------------------------------------------------
     */

    const marks =
      aggregate.questions.map(
        (question) =>
          Math.max(
            Number(
              question.marks
            ) || 0,
            0
          )
      )

    const totalMarks =
      marks.reduce(
        (
          sum,
          mark
        ) =>
          sum + mark,
        0
      )

    const averageMarks =
      questionCount >
      0
        ? totalMarks /
          questionCount
        : 0

    /*
     * --------------------------------------------------------
     * EXAMPLE QUESTION IDS
     * --------------------------------------------------------
     *
     * Keep the newest real historical questions.
     */

    const exampleQuestionIds =
      aggregate.questions
        .slice()
        .sort(
          (a, b) => {
            const paperA =
              paperMap.get(
                a.paper_id
              )

            const paperB =
              paperMap.get(
                b.paper_id
              )

            const yearA =
              paperA?.exam_year ||
              0

            const yearB =
              paperB?.exam_year ||
              0

            if (
              yearB !==
              yearA
            ) {
              return (
                yearB -
                yearA
              )
            }

            return (
              a.question_number -
              b.question_number
            )
          }
        )
        .slice(
          0,
          8
        )
        .map(
          (question) =>
            question.id
        )

    /*
     * --------------------------------------------------------
     * PAPER OCCURRENCES
     * --------------------------------------------------------
     */

    const paperOccurrences =
      buildPaperOccurrences(
        aggregate.questions,
        paperMap
      )

    /*
     * --------------------------------------------------------
     * FINAL DATABASE ROW
     * --------------------------------------------------------
     */

    finalRows.push({
      subject:
        "Mathematics",

      level:
        "O-Level",

      curriculum:
        "ZIMSEC",

      paper:
        aggregate.paper,

      topic:
        aggregate.topic,

      subtopic:
        aggregate.subtopic,

      pattern_type:
        "Question Family",

      pattern_value:
        aggregate.question_family,

      concept_family:
        aggregate.concept_family,

      position_min:
        positions.length >
        0
          ? Math.min(
              ...positions
            )
          : null,

      position_max:
        positions.length >
        0
          ? Math.max(
              ...positions
            )
          : null,

      position_average:
        positions.length >
        0
          ? positions.reduce(
              (
                sum,
                value
              ) =>
                sum + value,
              0
            ) /
            positions.length
          : null,

      question_count:
        questionCount,

      papers_appeared:
        papersAppeared,

      appearance_rate:
        totalPapersForPaper >
        0
          ? (
              (
                papersAppeared /
                totalPapersForPaper
              ) *
              100
            )
          : 0,

      total_marks:
        totalMarks,

      average_marks:
        Number(
          averageMarks.toFixed(
            2
          )
        ),

      years_seen:
        yearsSeen,

      question_positions:
        positions,

      question_styles:
        Array.from(
          aggregate.styles
        ).slice(
          0,
          20
        ),

      skills:
        Array.from(
          aggregate.skills
        ).slice(
          0,
          30
        ),

      example_question_ids:
        exampleQuestionIds,

      /*
       * Exact historical mapping.
       */
      paper_occurrences:
        paperOccurrences,

      frequency_score:
        Math.round(
          frequencyScore
        ),

      recency_score:
        Math.round(
          recencyScoreValue
        ),

      position_score:
        Math.round(
          positionScoreValue
        ),

      style_score:
        Math.round(
          variationScoreValue
        ),

      skill_score:
        Math.round(
          skillScoreValue
        ),

      mark_weight_score:
        Math.round(
          markScore
        ),

      prediction_score:
        clamp(
          predictionScore
        ),

      pattern_strength:
        patternStrength(
          predictionScore
        ),

      updated_at:
        new Date().toISOString(),
    })
  }

  /*
   * ==========================================================
   * 7. REPLACE AGGREGATE ANALYSIS
   * ==========================================================
   *
   * This guarantees that when papers/questions are reprocessed,
   * old aggregate rows do not remain.
   */

  let deleteQuery =
    supabaseAdmin
      .from(
        "ai_zimsec_math_pattern_analysis"
      )
      .delete()
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
    deleteQuery =
      deleteQuery.eq(
        "paper",
        requestedPaper
      )
  }

  const {
    error:
      deleteAggregateError,
  } =
    await deleteQuery

  if (
    deleteAggregateError
  ) {
    throw new Error(
      `Failed to clear previous aggregate pattern analysis: ${deleteAggregateError.message}`
    )
  }

  if (
    finalRows.length >
    0
  ) {
    const {
      error:
        insertAggregateError,
    } =
      await supabaseAdmin
        .from(
          "ai_zimsec_math_pattern_analysis"
        )
        .insert(
          finalRows
        )

    if (
      insertAggregateError
    ) {
      throw new Error(
        `Failed to save aggregate pattern analysis: ${insertAggregateError.message}`
      )
    }
  }

  /*
   * ==========================================================
   * 8. PER-PAPER SUMMARY
   * ==========================================================
   */

  const paperResults =
    (
      [
        "Paper 1",
        "Paper 2",
      ] as const
    )
      .map(
        (paper) => {
          const paperRows =
            papers.filter(
              (item) =>
                item.paper ===
                paper
            )

          const paperQuestions =
            questions.filter(
              (question) =>
                paperMap.get(
                  question.paper_id
                )?.paper ===
                paper
            )

          const patternCount =
            finalRows.filter(
              (row) =>
                row.paper ===
                paper
            ).length

          return {
            paper,

            papers:
              paperRows.length,

            questions:
              paperQuestions.length,

            patterns:
              patternCount,
          }
        }
      )
      .filter(
        (result) =>
          result.papers >
          0
      )

  /*
   * ==========================================================
   * 9. RETURN
   * ==========================================================
   */

  return {
    success: true,

    papersAnalysed:
      papers.length,

    questionsAnalysed:
      questions.length,

    questionPatternsCreated:
      questionPatternRowsToInsert.length,

    aggregatePatternsCreated:
      finalRows.length,

    paperResults,
  }
}