import {
  gemini,
  getGeminiModelName,
} from "@/lib/gemini"

/*
 * ============================================================
 * ZIMSEC O-LEVEL MATHEMATICS INGESTION
 * ============================================================
 *
 * Responsibilities:
 *
 * 1. Send a historical ZIMSEC Mathematics PDF to Gemini.
 * 2. Extract the ACTUAL questions from the paper.
 * 3. Preserve question numbers and labels.
 * 4. Classify questions using a stable taxonomy.
 * 5. Normalise Gemini's output.
 * 6. Return structured questions to the upload API.
 *
 * IMPORTANT:
 *
 * This file DOES NOT insert anything into Supabase.
 *
 * The upload API is responsible for:
 *
 *   PDF
 *     ↓
 *   analyseZimsecMathPaper()
 *     ↓
 *   ai_zimsec_math_questions
 *     ↓
 *   pattern analysis
 *     ↓
 *   ai_zimsec_math_pattern_analysis
 *
 * ============================================================
 */

export type ExtractedMathQuestion = {
  question_number: number
  question_label?: string
  question_text: string

  topic: string
  subtopic?: string

  concept_family?: string
  question_family?: string

  variation_patterns?: string[]
  skills?: string[]

  question_type?: string
  difficulty?: string

  marks?: number | null

  paper_section?: string

  mathematical_objects?: string[]

  diagram_dependency?: string

  position_band?: string

  source_page_start?: number | null
  source_page_end?: number | null

  classification_confidence?: number
}

export type ExtractedMathPaper = {
  exam_year: number
  session?: string
  paper: "Paper 1" | "Paper 2"
  questions: ExtractedMathQuestion[]
}

/*
 * ============================================================
 * VALID VALUES
 * ============================================================
 */

const VALID_DIFFICULTIES = [
  "Easy",
  "Moderate",
  "Difficult",
  "Very Difficult",
] as const

const VALID_DIAGRAM_DEPENDENCIES = [
  "None",
  "Helpful",
  "Essential",
] as const

const VALID_POSITION_BANDS = [
  "Early",
  "Early-Middle",
  "Middle",
  "Middle-Late",
  "Late",
] as const

const VALID_QUESTION_TYPES = [
  "Multiple Choice",
  "Short Answer",
  "Structured Problem",
  "Calculation",
  "Proof",
  "Construction",
  "Graph Interpretation",
  "Data Interpretation",
  "Word Problem",
  "Application",
  "Mixed",
] as const

/*
 * ============================================================
 * CANONICAL TOPICS
 * ============================================================
 */

const CANONICAL_TOPICS = [
  "Number",
  "Fractions",
  "Decimals",
  "Percentages",
  "Ratio and Proportion",
  "Indices",
  "Surds",
  "Algebra",
  "Factorisation",
  "Equations",
  "Simultaneous Equations",
  "Inequalities",
  "Sequences",
  "Functions",
  "Graphs",
  "Coordinate Geometry",
  "Geometry",
  "Circle Geometry",
  "Angles",
  "Constructions",
  "Transformations",
  "Vectors",
  "Matrices",
  "Mensuration",
  "Trigonometry",
  "Statistics",
  "Probability",
  "Sets",
  "Financial Mathematics",
  "Measurement",
  "Kinematics",
  "Map Scales",
  "Bearings",
  "Other",
] as const

/*
 * ============================================================
 * BASIC HELPERS
 * ============================================================
 */

function cleanJson(
  value: string
): string {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim()
}

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
  return cleanText(value).toLowerCase()
}

function uniqueStrings(
  values: unknown
): string[] {
  if (!Array.isArray(values)) {
    return []
  }

  return Array.from(
    new Set(
      values
        .map((value) =>
          cleanText(value)
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
    Math.min(max, value)
  )
}

/*
 * ============================================================
 * CANONICAL TOPIC
 * ============================================================
 *
 * IMPORTANT:
 *
 * We deliberately check specific concepts BEFORE broad concepts.
 *
 * For example:
 *
 * Coordinate Geometry
 * must be detected before Graphs.
 *
 * Matrix questions must always remain Matrices.
 *
 * Number-base questions must remain Number.
 * ============================================================
 */

function canonicalTopic(
  question: Partial<ExtractedMathQuestion>
): string {
  const combined = [
    question.topic,
    question.subtopic,
    question.concept_family,
    question.question_family,
    question.question_text,
  ]
    .map(lower)
    .join(" ")

  /*
   * ----------------------------------------------------------
   * SPECIALISED TOPICS FIRST
   * ----------------------------------------------------------
   */

  if (
    /\bmatrix\b|\bmatrices\b|\binverse matrix\b|\bsingular matrix\b|\bdeterminant\b/.test(
      combined
    )
  ) {
    return "Matrices"
  }

  if (
    /\bnumber base\b|\bmixed base\b|\bbase arithmetic\b|\bbinary\b|\bdenary\b|\bbase\s*[2-9]\b/.test(
      combined
    )
  ) {
    return "Number"
  }

  if (
    /\bvenn\b|\bset theory\b|\bsets\b|\bunion\b|\bintersection\b|\bcomplement\b/.test(
      combined
    )
  ) {
    return "Sets"
  }

  if (
    /\bkinematic\b|\bvelocity\b|\bspeed[- ]time\b|\bvelocity[- ]time\b|\bacceleration\b|\bdisplacement\b/.test(
      combined
    )
  ) {
    return "Kinematics"
  }

  if (
    /\bstatistics\b|\bstatistical\b|\bfrequency table\b|\bfrequency distribution\b|\bmean\b|\bmedian\b|\bmode\b|\bquartile\b|\binterquartile\b|\bhistogram\b|\bbox[- ]and[- ]whisker\b/.test(
      combined
    )
  ) {
    return "Statistics"
  }

  if (
    /\bprobability\b|\bevent\b|\boutcome\b|\btree diagram\b/.test(
      combined
    )
  ) {
    return "Probability"
  }

  if (
    /\bbearing\b|\bthree[- ]figure bearing\b|\bback bearing\b|\btrue bearing\b/.test(
      combined
    )
  ) {
    return "Bearings"
  }

  if (
    /\bvector\b|\bcolumn vector\b|\bposition vector\b|\bmagnitude of.*vector\b/.test(
      combined
    )
  ) {
    return "Vectors"
  }

  if (
    /\bcircle theorem\b|\bcircle geometry\b|\btangent to.*circle\b|\bangle at the centre\b|\bangle in a semicircle\b|\bsubtended\b/.test(
      combined
    )
  ) {
    return "Circle Geometry"
  }

  if (
    /\bmap scale\b|\bscale drawing\b|\bscale of a map\b|\barea scale\b|\bscale factor.*area\b/.test(
      combined
    )
  ) {
    return "Map Scales"
  }

  if (
    /\bcoordinate geometry\b|\bgradient\b|\by[- ]intercept\b|\bx[- ]intercept\b|\bmidpoint\b|\bdistance between.*points\b|\bequation of a line\b/.test(
      combined
    )
  ) {
    return "Coordinate Geometry"
  }

  if (
    /\btrigonometry\b|\btrigonometric\b|\bsine rule\b|\bcosine rule\b|\bsine\b|\bcosine\b|\btangent ratio\b|\bopposite\b.*\badjacent\b/.test(
      combined
    )
  ) {
    return "Trigonometry"
  }

  if (
    /\bsimultaneous equation\b|\bsimultaneous equations\b/.test(
      combined
    )
  ) {
    return "Simultaneous Equations"
  }

  if (
    /\binequalit(?:y|ies)\b|\bgreater than\b|\bless than\b|\bsolution set\b/.test(
      combined
    )
  ) {
    return "Inequalities"
  }

  if (
    /\bfactorisation\b|\bfactorization\b|\bfactorise\b|\bfactorize\b|\bcommon factor\b|\bquadratic factor\b/.test(
      combined
    )
  ) {
    return "Factorisation"
  }

  if (
    /\bsequence\b|\barithmetic progression\b|\bgeometric progression\b|\bnth term\b|\bterm to term\b/.test(
      combined
    )
  ) {
    return "Sequences"
  }

  if (
    /\bfunction\b|\bf\(x\)\b|\binverse function\b|\bcomposite function\b|\bexponential function\b/.test(
      combined
    )
  ) {
    return "Functions"
  }

  if (
    /\bindex\b|\bindices\b|\bindicial\b|\bnegative index\b|\bfractional index\b|\bpower law\b/.test(
      combined
    )
  ) {
    return "Indices"
  }

  if (
    /\bsurd\b|\bsimplify.*root\b|\bsquare root\b|\brationalis.*denominator\b/.test(
      combined
    )
  ) {
    return "Surds"
  }

  if (
    /\bpercentage\b|\bpercent\b|\bprofit percentage\b|\bloss percentage\b|\bpercentage increase\b|\bpercentage decrease\b/.test(
      combined
    )
  ) {
    return "Percentages"
  }

  if (
    /\bfraction\b|\bfractions\b|\bmixed number\b|\bproper fraction\b|\bimproper fraction\b/.test(
      combined
    )
  ) {
    return "Fractions"
  }

  if (
    /\bdecimal\b|\bdecimals\b/.test(
      combined
    )
  ) {
    return "Decimals"
  }

  if (
    /\bratio\b|\bproportion\b|\bdirect variation\b|\binverse variation\b|\bjoint variation\b/.test(
      combined
    )
  ) {
    return "Ratio and Proportion"
  }

  if (
    /\btransformation\b|\btranslation\b|\breflection\b|\brotation\b|\benlargement\b/.test(
      combined
    )
  ) {
    return "Transformations"
  }

  if (
    /\bconstruction\b|\bconstruct\b|\bperpendicular bisector\b|\bangle bisector\b/.test(
      combined
    )
  ) {
    return "Constructions"
  }

  if (
    /\bmensauration\b|\bmensuration\b|\barea\b|\bperimeter\b|\bvolume\b|\bsurface area\b|\bcircumference\b/.test(
      combined
    )
  ) {
    return "Mensuration"
  }

  if (
    /\bfinancial mathematics\b|\bsimple interest\b|\bcompound interest\b|\bhire purchase\b|\bdepreciation\b|\bexchange rate\b|\bprofit\b|\bloss\b|\bcommission\b/.test(
      combined
    )
  ) {
    return "Financial Mathematics"
  }

  /*
   * Graphs are deliberately checked AFTER coordinate geometry.
   */
  if (
    /\bgraph\b|\bplot\b|\bgradient\b|\bintercept\b|\blinear graph\b|\bquadratic graph\b/.test(
      combined
    )
  ) {
    return "Graphs"
  }

  if (
    /\balgebra\b|\balgebraic\b|\bexpression\b|\bexpand\b|\bsimplify\b/.test(
      combined
    )
  ) {
    return "Algebra"
  }

  if (
    /\bequation\b|\bsolve for\b|\bsolve.*x\b|\bquadratic equation\b/.test(
      combined
    )
  ) {
    return "Equations"
  }

  if (
    /\bangle\b|\bparallel lines\b|\bpolygon\b|\btriangle\b|\bquadrilateral\b|\bgeometry\b/.test(
      combined
    )
  ) {
    return "Geometry"
  }

  if (
    /\bmeasurement\b|\bunit conversion\b|\blength\b|\bmass\b|\btime\b/.test(
      combined
    )
  ) {
    return "Measurement"
  }

  /*
   * Exact supplied canonical topic.
   */
  const supplied =
    cleanText(
      question.topic
    )

  const exact =
    CANONICAL_TOPICS.find(
      (topic) =>
        lower(topic) ===
        lower(supplied)
    )

  if (exact) {
    return exact
  }

  return "Other"
}

/*
 * ============================================================
 * CANONICAL CONCEPT FAMILY
 * ============================================================
 */

function canonicalConceptFamily(
  question: Partial<ExtractedMathQuestion>,
  topic: string
): string {
  const combined = [
    question.concept_family,
    question.question_family,
    question.subtopic,
    question.question_text,
  ]
    .map(lower)
    .join(" ")

  if (topic === "Matrices") {
    return "Matrices"
  }

  if (topic === "Number") {
    if (
      /\bbase\b|\bbinary\b|\bdenary\b|\bmixed base\b/.test(
        combined
      )
    ) {
      return (
        "Number Bases and Mixed Base Arithmetic"
      )
    }

    return "Number"
  }

  if (topic === "Sets") {
    return "Set Theory and Venn"
  }

  if (topic === "Statistics") {
    return "Statistics"
  }

  if (topic === "Kinematics") {
    return "Motion and Kinematics"
  }

  if (
    topic === "Geometry" &&
    /\bsimilar\b|\bsimilarity\b|\bcongruen/.test(
      combined
    )
  ) {
    return "Similarity and Congruency"
  }

  if (
    topic === "Functions" ||
    topic === "Indices"
  ) {
    return "Functions and Exponential"
  }

  if (topic === "Map Scales") {
    return "Map Scales and Measurement"
  }

  if (topic === "Bearings") {
    return "Bearings"
  }

  if (topic === "Vectors") {
    return "Vectors"
  }

  if (topic === "Circle Geometry") {
    return "Circle Geometry"
  }

  if (topic === "Simultaneous Equations") {
    return "Simultaneous Linear Equations"
  }

  if (topic === "Trigonometry") {
    return "Trigonometry"
  }

  if (topic === "Probability") {
    return "Probability"
  }

  if (topic === "Mensuration") {
    return "Mensuration"
  }

  if (topic === "Financial Mathematics") {
    return "Financial Mathematics"
  }

  if (
    topic === "Algebra" ||
    topic === "Factorisation" ||
    topic === "Equations"
  ) {
    return "Algebraic Manipulation and Equations"
  }

  const supplied =
    cleanText(
      question.concept_family
    )

  return (
    supplied ||
    topic ||
    "Other"
  )
}

/*
 * ============================================================
 * CANONICAL QUESTION FAMILY
 * ============================================================
 */

function canonicalQuestionFamily(
  question: Partial<ExtractedMathQuestion>,
  conceptFamily: string
): string {
  const combined = [
    question.question_family,
    question.subtopic,
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
    "Functions and Exponential"
  ) {
    if (
      /\binverse function\b|\bcomposite function\b/.test(
        combined
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
    return "Simultaneous Linear Equations"
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
    "Financial Mathematics"
  ) {
    return "Financial Mathematics"
  }

  if (
    conceptFamily ===
    "Trigonometry"
  ) {
    return "Trigonometry"
  }

  if (
    conceptFamily ===
    "Algebraic Manipulation and Equations"
  ) {
    if (
      /\bfactor/.test(
        combined
      )
    ) {
      return (
        "Algebraic Factorisation and Manipulation"
      )
    }

    if (
      /\bquadratic\b/.test(
        combined
      )
    ) {
      return "Quadratic Equations"
    }

    return (
      "Algebraic Manipulation and Equations"
    )
  }

  const supplied =
    cleanText(
      question.question_family
    )

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
 * QUESTION LABEL
 * ============================================================
 *
 * Examples:
 *
 * 22       -> Q22
 * Q22      -> Q22
 * 11(b)    -> Q11(b)
 * Q11(b)   -> Q11(b)
 * (b)      -> Q? not used because question_number remains
 * authoritative.
 * ============================================================
 */

function normaliseQuestionLabel(
  value: unknown,
  questionNumber: number
): string {
  const label =
    cleanText(value)

  if (!label) {
    return `Q${questionNumber}`
  }

  if (
    /^q/i.test(label)
  ) {
    return label
  }

  if (
    /^\d/.test(label)
  ) {
    return `Q${label}`
  }

  return label
}

/*
 * ============================================================
 * NORMALISERS
 * ============================================================
 */

function normaliseDifficulty(
  value: unknown
): string {
  const clean =
    cleanText(value)

  const match =
    VALID_DIFFICULTIES.find(
      (item) =>
        lower(item) ===
        lower(clean)
    )

  return (
    match ||
    "Moderate"
  )
}

function normaliseDiagramDependency(
  value: unknown
): string {
  const clean =
    cleanText(value)

  const match =
    VALID_DIAGRAM_DEPENDENCIES.find(
      (item) =>
        lower(item) ===
        lower(clean)
    )

  return (
    match ||
    "None"
  )
}

function normalisePositionBand(
  value: unknown
): string {
  const clean =
    cleanText(value)

  const match =
    VALID_POSITION_BANDS.find(
      (item) =>
        lower(item) ===
        lower(clean)
    )

  return (
    match ||
    "Middle"
  )
}

function normaliseQuestionType(
  value: unknown
): string {
  const clean =
    cleanText(value)

  const match =
    VALID_QUESTION_TYPES.find(
      (item) =>
        lower(item) ===
        lower(clean)
    )

  return (
    match ||
    "Mixed"
  )
}

function normaliseMarks(
  value: unknown
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null
  }

  const numeric =
    typeof value === "number"
      ? value
      : Number(value)

  if (
    !Number.isFinite(
      numeric
    )
  ) {
    return null
  }

  if (
    numeric < 0
  ) {
    return null
  }

  return Math.round(
    numeric
  )
}

function normaliseConfidence(
  value: unknown
): number {
  const numeric =
    typeof value === "number"
      ? value
      : Number(value)

  if (
    !Number.isFinite(
      numeric
    )
  ) {
    return 70
  }

  return Math.round(
    clamp(
      numeric
    )
  )
}

function normalisePage(
  value: unknown
): number | null {
  const numeric =
    typeof value === "number"
      ? value
      : Number(value)

  if (
    !Number.isFinite(
      numeric
    ) ||
    numeric <= 0
  ) {
    return null
  }

  return Math.round(
    numeric
  )
}

/*
 * ============================================================
 * NORMALISE ONE QUESTION
 * ============================================================
 */

function normaliseQuestion(
  question: any
): ExtractedMathQuestion | null {
  if (
    !question ||
    typeof question !== "object"
  ) {
    return null
  }

  const questionNumber =
    Number(
      question.question_number
    )

  if (
    !Number.isFinite(
      questionNumber
    ) ||
    questionNumber <= 0
  ) {
    return null
  }

  const questionText =
    cleanText(
      question.question_text
    )

  if (!questionText) {
    return null
  }

  const topic =
    canonicalTopic(
      question
    )

  const conceptFamily =
    canonicalConceptFamily(
      question,
      topic
    )

  const questionFamily =
    canonicalQuestionFamily(
      question,
      conceptFamily
    )

  const suppliedSubtopic =
    cleanText(
      question.subtopic
    )

  /*
   * If Gemini gives a useful subtopic, keep it.
   *
   * Otherwise use the canonical question family.
   */
  const subtopic =
    suppliedSubtopic ||
    questionFamily

  return {
    question_number:
      Math.round(
        questionNumber
      ),

    question_label:
      normaliseQuestionLabel(
        question.question_label,
        Math.round(
          questionNumber
        )
      ),

    question_text:
      questionText,

    topic,

    subtopic,

    concept_family:
      conceptFamily,

    question_family:
      questionFamily,

    variation_patterns:
      uniqueStrings(
        question.variation_patterns
      ).slice(
        0,
        8
      ),

    skills:
      uniqueStrings(
        question.skills
      ).slice(
        0,
        10
      ),

    question_type:
      normaliseQuestionType(
        question.question_type
      ),

    difficulty:
      normaliseDifficulty(
        question.difficulty
      ),

    marks:
      normaliseMarks(
        question.marks
      ),

    paper_section:
      cleanText(
        question.paper_section
      ) || undefined,

    mathematical_objects:
      uniqueStrings(
        question.mathematical_objects
      ).slice(
        0,
        10
      ),

    diagram_dependency:
      normaliseDiagramDependency(
        question.diagram_dependency
      ),

    position_band:
      normalisePositionBand(
        question.position_band
      ),

    source_page_start:
      normalisePage(
        question.source_page_start
      ),

    source_page_end:
      normalisePage(
        question.source_page_end
      ),

    classification_confidence:
      normaliseConfidence(
        question.classification_confidence
      ),
  }
}

/*
 * ============================================================
 * VALIDATION
 * ============================================================
 */

function validateQuestion(
  question: unknown
): question is ExtractedMathQuestion {
  if (
    !question ||
    typeof question !== "object"
  ) {
    return false
  }

  const candidate =
    question as ExtractedMathQuestion

  if (
    !Number.isFinite(
      candidate.question_number
    ) ||
    candidate.question_number <= 0
  ) {
    return false
  }

  if (
    !cleanText(
      candidate.question_text
    )
  ) {
    return false
  }

  if (
    !cleanText(
      candidate.topic
    ) &&
    !cleanText(
      candidate.subtopic
    ) &&
    !cleanText(
      candidate.concept_family
    )
  ) {
    return false
  }

  return true
}

/*
 * ============================================================
 * DEDUPLICATE QUESTIONS
 * ============================================================
 *
 * Gemini can occasionally return the same question twice.
 *
 * We keep the first occurrence for a question number unless
 * another version has a more complete question label/text.
 * ============================================================
 */

function deduplicateQuestions(
  questions: ExtractedMathQuestion[]
): ExtractedMathQuestion[] {
  const map =
    new Map<
      number,
      ExtractedMathQuestion
    >()

  for (
    const question of
    questions
  ) {
    const existing =
      map.get(
        question.question_number
      )

    if (!existing) {
      map.set(
        question.question_number,
        question
      )

      continue
    }

    const existingLength =
      existing.question_text.length

    const currentLength =
      question.question_text.length

    if (
      currentLength >
      existingLength
    ) {
      map.set(
        question.question_number,
        question
      )
    }
  }

  return Array.from(
    map.values()
  ).sort(
    (a, b) =>
      a.question_number -
      b.question_number
  )
}

/*
 * ============================================================
 * POSITION BAND FALLBACK
 * ============================================================
 */

function calculatePositionBand(
  questionNumber: number
): string {
  if (
    questionNumber <= 5
  ) {
    return "Early"
  }

  if (
    questionNumber <= 10
  ) {
    return "Early-Middle"
  }

  if (
    questionNumber <= 15
  ) {
    return "Middle"
  }

  if (
    questionNumber <= 20
  ) {
    return "Middle-Late"
  }

  return "Late"
}

/*
 * ============================================================
 * MAIN INGESTION FUNCTION
 * ============================================================
 */

export async function analyseZimsecMathPaper(
  params: {
    pdfBase64: string
    examYear: number
    session?: string
    paper: "Paper 1" | "Paper 2"
  }
): Promise<ExtractedMathPaper> {
  if (
    !params.pdfBase64
  ) {
    throw new Error(
      "A Mathematics PDF is required for analysis."
    )
  }

  if (
    !Number.isFinite(
      params.examYear
    )
  ) {
    throw new Error(
      "A valid Mathematics examination year is required."
    )
  }

  const model =
    getGeminiModelName()

  /*
   * ==========================================================
   * EXTRACTION PROMPT
   * ==========================================================
   */

  const prompt = `
You are an expert ZIMSEC O-Level Mathematics examination analyst.

You are analysing ONE historical ZIMSEC O-Level Mathematics examination paper.

EXAMINATION YEAR:
${params.examYear}

SESSION:
${params.session || "Unknown"}

PAPER:
${params.paper}

Your job is to extract EVERY ACTUAL MATHEMATICS QUESTION contained in the PDF.

============================================================
PRIMARY OBJECTIVE
============================================================

The extracted data will be stored in a historical database.

The database will later be used to identify recurring ZIMSEC question patterns.

Therefore:

DO NOT invent questions.

DO NOT merge unrelated questions.

DO NOT omit actual questions.

DO NOT create hypothetical questions.

DO NOT summarise an entire paper as one question.

Every actual numbered question must become one question record.

============================================================
QUESTION NUMBERING
============================================================

Preserve the original question number exactly.

Examples:

22
22(a)
22(b)
22(c)

should belong to question_number 22.

Use:

question_number: 22

and, when identifiable:

question_label: "Q22"

or:

question_label: "Q22(b)"

The question_label is for preserving meaningful sub-question references.

Do not create artificial question numbers.

============================================================
QUESTION TEXT
============================================================

Preserve the actual mathematical content.

Include:

- numbers
- equations
- expressions
- matrices
- diagrams described sufficiently
- graphs
- tables
- coordinates
- geometric information
- units
- instructions
- meaningful subparts

Do not replace a question with a vague summary such as:

"Calculate the matrix."

Instead preserve enough of the actual question so the historical record is useful.

============================================================
IMPORTANT VISUAL INFORMATION
============================================================

Use the PDF visually where necessary.

Pay special attention to:

- matrices
- graphs
- geometric diagrams
- tables
- number lines
- transformations
- constructions
- coordinate diagrams
- statistical charts

If a question depends on a diagram, classify:

None
Helpful
Essential

Do not ignore diagrams.

============================================================
CLASSIFICATION HIERARCHY
============================================================

Every question should have:

Topic
Concept Family
Question Family
Variation Patterns
Skills

Use this hierarchy:

Topic
→ Concept Family
→ Question Family
→ Variation Patterns

The Question Family must be broader than an individual wording.

For example:

Matrix multiplication
Matrix inverse
Singular matrix
Matrix transformation

should NOT become four unrelated families.

They should be grouped as:

Concept Family:
Matrices

Question Family:
Matrices (Operations, Inverse and Singular)

Likewise:

Number-base conversion
Mixed-base arithmetic
Binary arithmetic

should be grouped under:

Concept Family:
Number Bases and Mixed Base Arithmetic

Question Family:
Number Bases & Mixed Base Arithmetic

============================================================
CANONICAL CONCEPT FAMILIES
============================================================

Prefer these exact names whenever applicable:

Number Bases and Mixed Base Arithmetic

Matrices

Set Theory and Venn

Statistics

Motion and Kinematics

Similarity and Congruency

Functions and Exponential

Map Scales and Measurement

Bearings

Vectors

Circle Geometry

Simultaneous Linear Equations

Trigonometry

Probability

Mensuration

Financial Mathematics

Algebraic Manipulation and Equations

============================================================
MATRIX RULE
============================================================

Any question involving:

- matrix operations
- matrix multiplication
- matrix addition/subtraction
- determinant
- inverse matrix
- singular matrix
- matrix equations
- matrix transformations

must use:

topic:
Matrices

concept_family:
Matrices

question_family:
Matrices (Operations, Inverse and Singular)

This is extremely important.

============================================================
NUMBER BASE RULE
============================================================

Questions involving:

- binary
- denary
- base arithmetic
- number bases
- mixed bases
- conversion between bases

should use:

topic:
Number

concept_family:
Number Bases and Mixed Base Arithmetic

question_family:
Number Bases & Mixed Base Arithmetic

============================================================
SETS RULE
============================================================

Questions involving:

- Venn diagrams
- union
- intersection
- complement
- universal set
- set notation

should use:

topic:
Sets

concept_family:
Set Theory and Venn

question_family:
Set Theory and Venn Diagrams

============================================================
STATISTICS RULE
============================================================

Questions involving:

- mean
- median
- mode
- frequency tables
- grouped data
- cumulative frequency
- histograms
- box plots
- statistical interpretation

should use:

topic:
Statistics

concept_family:
Statistics

question_family:
Statistics (Mean, Median, Mode and Data Interpretation)

============================================================
KINEMATICS RULE
============================================================

Questions involving:

- speed
- velocity
- acceleration
- displacement
- motion
- velocity-time graphs
- speed-time graphs

should use:

topic:
Kinematics

concept_family:
Motion and Kinematics

question_family:
Kinematics (Velocity/Speed-Time Graphs, Motion and Acceleration)

============================================================
FUNCTION RULE
============================================================

Questions involving:

- f(x)
- functions
- inverse functions
- composite functions
- exponential functions
- index/exponential equations

should use:

concept_family:
Functions and Exponential

Use a suitable question family such as:

Functions (Evaluation, Inverse and Composite)

or:

Functions and Index/Exponential Equations

============================================================
POSITION
============================================================

Classify question position as:

Early
Early-Middle
Middle
Middle-Late
Late

based on the question number.

============================================================
QUESTION TYPE
============================================================

Use only:

Multiple Choice
Short Answer
Structured Problem
Calculation
Proof
Construction
Graph Interpretation
Data Interpretation
Word Problem
Application
Mixed

============================================================
DIFFICULTY
============================================================

Use only:

Easy
Moderate
Difficult
Very Difficult

============================================================
OUTPUT
============================================================

Return ONLY valid JSON.

Do not include markdown.

Do not include explanations.

Use exactly this structure:

{
  "exam_year": ${params.examYear},
  "session": "${cleanText(params.session || "")}",
  "paper": "${params.paper}",
  "questions": [
    {
      "question_number": 1,
      "question_label": "Q1",
      "question_text": "...",
      "topic": "...",
      "subtopic": "...",
      "concept_family": "...",
      "question_family": "...",
      "variation_patterns": [],
      "skills": [],
      "question_type": "Calculation",
      "difficulty": "Moderate",
      "marks": 2,
      "paper_section": "...",
      "mathematical_objects": [],
      "diagram_dependency": "None",
      "position_band": "Early",
      "source_page_start": 1,
      "source_page_end": 1,
      "classification_confidence": 95
    }
  ]
}

IMPORTANT:

Return EVERY actual question.

Do not stop after the first page.

Read the entire PDF before producing the JSON.

Do not invent marks when marks are not visible.

If marks cannot be determined, use null.

If a field cannot be determined, use a sensible empty value.

============================================================
FINAL QUALITY CHECK
============================================================

Before returning JSON:

1. Check that every actual numbered question was extracted.
2. Check that question numbers are correct.
3. Check that no duplicate question numbers were accidentally created.
4. Check that matrices are classified as Matrices.
5. Check that number bases are classified as Number Bases and Mixed Base Arithmetic.
6. Check that Venn/set questions are classified as Set Theory and Venn.
7. Check that statistics questions are classified as Statistics.
8. Check that kinematics questions are classified as Motion and Kinematics.
9. Check that coordinate geometry is not incorrectly classified merely as Graphs.
10. Check that meaningful subparts are preserved in question_label/question_text.
`

  /*
   * ==========================================================
   * SEND PDF + PROMPT TO GEMINI
   * ==========================================================
   */

  const interaction =
    await gemini.interactions.create({
      model,

      input: [
        {
          type: "document",
          data: params.pdfBase64,
          mime_type:
            "application/pdf",
        },

        {
          type: "text",
          text: prompt,
        },
      ],
    })

  const rawOutput =
    cleanText(
      interaction.output_text
    )

  if (!rawOutput) {
    throw new Error(
      "Gemini returned an empty Mathematics paper analysis."
    )
  }

  /*
   * ==========================================================
   * PARSE JSON
   * ==========================================================
   */

  let parsed: any

  try {
    parsed =
      JSON.parse(
        cleanJson(
          rawOutput
        )
      )
  } catch (error) {
    console.error(
      "Invalid ZIMSEC Mathematics JSON returned by Gemini:",
      rawOutput
    )

    throw new Error(
      "Gemini returned invalid JSON while analysing the Mathematics paper."
    )
  }

  if (
    !parsed ||
    typeof parsed !== "object"
  ) {
    throw new Error(
      "Gemini returned an invalid Mathematics paper object."
    )
  }

  if (
    !Array.isArray(
      parsed.questions
    )
  ) {
    throw new Error(
      "Gemini did not return a valid Mathematics questions array."
    )
  }

  /*
   * ==========================================================
   * NORMALISE QUESTIONS
   * ==========================================================
   */

  const normalised =
    parsed.questions
      .map(
        (question: any) =>
          normaliseQuestion(
            question
          )
      )
      .filter(
        (
          question
        ): question is ExtractedMathQuestion =>
          Boolean(question) &&
          validateQuestion(
            question
          )
      )

  /*
   * ==========================================================
   * DEDUPLICATE
   * ==========================================================
   */

  const validQuestions =
    deduplicateQuestions(
      normalised
    )

  if (
    validQuestions.length ===
    0
  ) {
    throw new Error(
      "No valid Mathematics questions were extracted from the PDF."
    )
  }

  /*
   * ==========================================================
   * FINAL POSITION FALLBACK
   * ==========================================================
   */

  for (
    const question of
    validQuestions
  ) {
    if (
      !question.position_band ||
      !VALID_POSITION_BANDS.includes(
        question.position_band as any
      )
    ) {
      question.position_band =
        calculatePositionBand(
          question.question_number
        )
    }
  }

  /*
   * ==========================================================
   * RETURN STRUCTURED PAPER
   * ==========================================================
   */

  return {
    exam_year:
      params.examYear,

    session:
      params.session,

    paper:
      params.paper,

    questions:
      validQuestions,
  }
}