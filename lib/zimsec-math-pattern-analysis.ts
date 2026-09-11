import { supabaseAdmin } from "@/lib/supabase-admin"

type PaperRow = {
  id: string
  subject: string
  level: string
  curriculum: string
  exam_year: number
  session: string | null
  paper: "Paper 1" | "Paper 2"
  title: string | null
  extraction_status: string | null
}

type QuestionRow = {
  id: string
  paper_id: string
  question_number: number
  question_label: string | null
  question_text: string
  topic: string | null
  subtopic: string | null
  concept_family: string | null
  question_family: string | null
  variation_patterns: string[] | null
  skills: string[] | null
  question_type: string | null
  difficulty: string | null
  marks: number | null
  paper_section: string | null
  mathematical_objects: string[] | null
  diagram_dependency: string | null
  position_band: string | null
  ai_classification_confidence: number | null
}

type QuestionPatternRow = {
  question_id: string
  pattern_type: string
  pattern_value: string
}

type Aggregate = {
  paper: "Paper 1" | "Paper 2"

  topic: string
  subtopic: string | null

  conceptFamily: string
  questionFamily: string | null

  patternType: "Concept Family" | "Question Family"
  patternValue: string

  questionCount: number
  papers: Set<string>

  years: Set<number>
  positions: number[]
  positionBands: Set<string>

  styles: Set<string>
  skills: Set<string>

  totalMarks: number
  exampleQuestionIds: string[]

  topicCounts: Map<string, number>
  subtopicCounts: Map<string, number>

  frequencyScore: number
  recencyScore: number
  positionScore: number
  variationScore: number
  skillScore: number
  markWeightScore: number
  coverageScore: number
  predictionScore: number

  patternStrength: "Weak" | "Moderate" | "Strong"
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

const CONCEPT_FAMILIES = [
  "Matrices",
  "Set Theory and Venn",
  "Functions and Exponential",
  "Motion and Kinematics",
  "Similarity and Congruency",
  "Statistics",
  "Bearings",
  "Vectors",
  "Number Bases and Mixed Base Arithmetic",
  "Map Scales and Measurement",
  "Circle Geometry",
  "Simultaneous Linear Equations",
]

function cleanText(value: unknown): string {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
}

function normalizeText(value: unknown): string {
  return cleanText(value).toLowerCase()
}

function cleanArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => cleanText(item))
    .filter(Boolean)
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => cleanText(value))
        .filter(Boolean),
    ),
  )
}

function canonicalize(value: string): string {
  return normalizeText(value)
    .replace(/&/g, "and")
    .replace(/[()[\]{}:,/\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function mostCommon(values: string[]): string | null {
  const cleaned = values
    .map((value) => cleanText(value))
    .filter(Boolean)

  if (!cleaned.length) {
    return null
  }

  const counts = new Map<string, number>()

  for (const value of cleaned) {
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1]
      }

      return a[0].localeCompare(b[0])
    })[0][0]
}

function normalizeConceptFamily(question: QuestionRow): string {
  const supplied = cleanText(question.concept_family)

  if (supplied) {
    const normalized = canonicalize(supplied)

    const mappings: Record<string, string> = {
      matrices: "Matrices",
      matrix: "Matrices",
      "matrix algebra": "Matrices",

      "set theory": "Set Theory and Venn",
      "set theory and venn": "Set Theory and Venn",
      sets: "Set Theory and Venn",
      venn: "Set Theory and Venn",
      "venn diagrams": "Set Theory and Venn",

      functions: "Functions and Exponential",
      "functions and exponential": "Functions and Exponential",
      exponential: "Functions and Exponential",
      "exponential functions": "Functions and Exponential",

      kinematics: "Motion and Kinematics",
      motion: "Motion and Kinematics",
      "motion and kinematics": "Motion and Kinematics",

      similarity: "Similarity and Congruency",
      congruency: "Similarity and Congruency",
      congruence: "Similarity and Congruency",
      "similarity and congruency": "Similarity and Congruency",

      statistics: "Statistics",

      bearings: "Bearings",

      vectors: "Vectors",

      "number bases": "Number Bases and Mixed Base Arithmetic",
      "number bases and mixed base arithmetic":
        "Number Bases and Mixed Base Arithmetic",
      "mixed base arithmetic": "Number Bases and Mixed Base Arithmetic",
      "mixed bases": "Number Bases and Mixed Base Arithmetic",

      "map scales": "Map Scales and Measurement",
      "map scales and measurement": "Map Scales and Measurement",
      scale: "Map Scales and Measurement",
      scales: "Map Scales and Measurement",

      "circle geometry": "Circle Geometry",
      circles: "Circle Geometry",
      "circle theorems": "Circle Geometry",

      "simultaneous equations": "Simultaneous Linear Equations",
      "simultaneous linear equations": "Simultaneous Linear Equations",
    }

    if (mappings[normalized]) {
      return mappings[normalized]
    }

    for (const family of CONCEPT_FAMILIES) {
      if (canonicalize(family) === normalized) {
        return family
      }
    }

    return supplied
  }

  const combined = canonicalize(
    [
      question.topic,
      question.subtopic,
      question.question_family,
      question.question_type,
      question.question_text,
    ]
      .filter(Boolean)
      .join(" "),
  )

  if (
    combined.includes("matrix") ||
    combined.includes("determinant") ||
    combined.includes("inverse matrix")
  ) {
    return "Matrices"
  }

  if (
    combined.includes("venn") ||
    combined.includes("set theory") ||
    combined.includes("universal set") ||
    combined.includes("complement")
  ) {
    return "Set Theory and Venn"
  }

  if (
    combined.includes("function") ||
    combined.includes("exponential") ||
    combined.includes("inverse function")
  ) {
    return "Functions and Exponential"
  }

  if (
    combined.includes("kinematic") ||
    combined.includes("velocity") ||
    combined.includes("acceleration") ||
    combined.includes("speed time") ||
    combined.includes("distance time")
  ) {
    return "Motion and Kinematics"
  }

  if (
    combined.includes("similar triangle") ||
    combined.includes("similarity") ||
    combined.includes("congruen")
  ) {
    return "Similarity and Congruency"
  }

  if (
    combined.includes("statistics") ||
    combined.includes("frequency table") ||
    combined.includes("median") ||
    combined.includes("mode")
  ) {
    return "Statistics"
  }

  if (combined.includes("bearing")) {
    return "Bearings"
  }

  if (combined.includes("vector")) {
    return "Vectors"
  }

  if (
    combined.includes("base") &&
    (combined.includes("binary") ||
      combined.includes("ternary") ||
      combined.includes("quaternary") ||
      combined.includes("mixed"))
  ) {
    return "Number Bases and Mixed Base Arithmetic"
  }

  if (
    combined.includes("map scale") ||
    combined.includes("scale drawing") ||
    combined.includes("map") ||
    combined.includes("actual distance")
  ) {
    return "Map Scales and Measurement"
  }

  if (
    combined.includes("circle theorem") ||
    combined.includes("circle geometry") ||
    combined.includes("angle at centre") ||
    combined.includes("angle in a semicircle")
  ) {
    return "Circle Geometry"
  }

  if (
    combined.includes("simultaneous") ||
    combined.includes("linear equations")
  ) {
    return "Simultaneous Linear Equations"
  }

  return cleanText(question.topic) || "Other"
}

function normalizeQuestionFamily(question: QuestionRow): string | null {
  const supplied = cleanText(question.question_family)

  if (supplied) {
    const normalized = canonicalize(supplied)

    const mappings: Record<string, string> = {
      "matrix operations": "Matrix Operations",
      "matrix operation": "Matrix Operations",
      "matrix multiplication": "Matrix Operations",
      "matrix addition": "Matrix Operations",
      "matrix subtraction": "Matrix Operations",

      "matrix inverse": "Matrix Inverse",
      "inverse matrix": "Matrix Inverse",

      determinant: "Determinant",
      determinants: "Determinant",

      "singular matrix": "Singular Matrix",
      "singular matrices": "Singular Matrix",

      "venn diagram": "Venn Diagram",
      "venn diagrams": "Venn Diagram",
      "set operations": "Set Operations",
      "set operation": "Set Operations",

      "function evaluation": "Function Evaluation",
      "evaluating functions": "Function Evaluation",

      "solving function equations": "Function Equation Solving",
      "function equation solving": "Function Equation Solving",

      "inverse function": "Inverse Function",

      "statistics frequency table": "Statistics from Frequency Table",
      "frequency table statistics": "Statistics from Frequency Table",

      "statistics graph": "Statistics from Graph",
      "statistics from graph": "Statistics from Graph",

      "kinematics graph": "Kinematics Graph",
      "velocity time graph": "Kinematics Graph",
      "speed time graph": "Kinematics Graph",
      "distance time graph": "Kinematics Graph",

      "similar triangles": "Similar Triangles",
      "triangle similarity": "Similar Triangles",

      "bearing calculation": "Bearing Calculation",
      "bearing calculations": "Bearing Calculation",

      "vector calculation": "Vector Calculation",
      "vector calculations": "Vector Calculation",

      "mixed base arithmetic": "Mixed Base Arithmetic",
      "base conversion": "Base Conversion",

      "map scale calculation": "Map Scale Calculation",
      "map scales": "Map Scale Calculation",

      "circle theorem": "Circle Theorem",
      "circle theorems": "Circle Theorem",

      "simultaneous linear equations": "Simultaneous Linear Equations",
    }

    if (mappings[normalized]) {
      return mappings[normalized]
    }

    return supplied
  }

  const conceptFamily = normalizeConceptFamily(question)
  const combined = canonicalize(
    [
      question.subtopic,
      question.question_type,
      question.question_text,
    ]
      .filter(Boolean)
      .join(" "),
  )

  if (conceptFamily === "Matrices") {
    if (
      combined.includes("inverse") &&
      !combined.includes("determinant")
    ) {
      return "Matrix Inverse"
    }

    if (combined.includes("singular")) {
      return "Singular Matrix"
    }

    if (combined.includes("determinant")) {
      return "Determinant"
    }

    if (
      combined.includes("multiply") ||
      combined.includes("multiplication") ||
      combined.includes("add") ||
      combined.includes("addition") ||
      combined.includes("subtract") ||
      combined.includes("subtraction")
    ) {
      return "Matrix Operations"
    }

    return "Matrix Operations"
  }

  if (conceptFamily === "Set Theory and Venn") {
    if (combined.includes("venn")) {
      return "Venn Diagram"
    }

    return "Set Operations"
  }

  if (conceptFamily === "Functions and Exponential") {
    if (combined.includes("inverse")) {
      return "Inverse Function"
    }

    if (
      combined.includes("solve") ||
      combined.includes("equation")
    ) {
      return "Function Equation Solving"
    }

    return "Function Evaluation"
  }

  if (conceptFamily === "Statistics") {
    if (
      combined.includes("frequency") ||
      combined.includes("table")
    ) {
      return "Statistics from Frequency Table"
    }

    if (
      combined.includes("graph") ||
      combined.includes("bar chart") ||
      combined.includes("histogram")
    ) {
      return "Statistics from Graph"
    }

    return "Statistics Calculation"
  }

  if (conceptFamily === "Motion and Kinematics") {
    if (
      combined.includes("graph") ||
      combined.includes("velocity time") ||
      combined.includes("speed time") ||
      combined.includes("distance time")
    ) {
      return "Kinematics Graph"
    }

    return "Kinematics Calculation"
  }

  if (conceptFamily === "Similarity and Congruency") {
    return "Similar Triangles"
  }

  if (conceptFamily === "Bearings") {
    return "Bearing Calculation"
  }

  if (conceptFamily === "Vectors") {
    return "Vector Calculation"
  }

  if (conceptFamily === "Number Bases and Mixed Base Arithmetic") {
    if (
      combined.includes("convert") ||
      combined.includes("conversion")
    ) {
      return "Base Conversion"
    }

    return "Mixed Base Arithmetic"
  }

  if (conceptFamily === "Map Scales and Measurement") {
    return "Map Scale Calculation"
  }

  if (conceptFamily === "Circle Geometry") {
    return "Circle Theorem"
  }

  if (conceptFamily === "Simultaneous Linear Equations") {
    return "Simultaneous Linear Equations"
  }

  return cleanText(question.question_type) || null
}

function calculatePositionBand(questionNumber: number): string {
  if (questionNumber <= 5) {
    return "Early"
  }

  if (questionNumber <= 10) {
    return "Early-Middle"
  }

  if (questionNumber <= 15) {
    return "Middle"
  }

  if (questionNumber <= 20) {
    return "Middle-Late"
  }

  return "Late"
}

function normalizePositionBand(
  question: QuestionRow,
): string {
  const supplied = cleanText(question.position_band)

  if (supplied) {
    const normalized = canonicalize(supplied)

    if (
      normalized === "early" ||
      normalized.includes("1 5")
    ) {
      return "Early"
    }

    if (
      normalized === "early middle" ||
      normalized.includes("6 10")
    ) {
      return "Early-Middle"
    }

    if (
      normalized === "middle" ||
      normalized.includes("11 15")
    ) {
      return "Middle"
    }

    if (
      normalized === "middle late" ||
      normalized.includes("16 20")
    ) {
      return "Middle-Late"
    }

    if (
      normalized === "late" ||
      normalized.includes("21 25") ||
      normalized.includes("21 30")
    ) {
      return "Late"
    }

    return supplied
  }

  return calculatePositionBand(question.question_number)
}

function getQuestionPatterns(
  question: QuestionRow,
): QuestionPatternRow[] {
  const patterns: QuestionPatternRow[] = []

  const conceptFamily = normalizeConceptFamily(question)
  const questionFamily = normalizeQuestionFamily(question)

  patterns.push({
    question_id: question.id,
    pattern_type: "Concept Family",
    pattern_value: conceptFamily,
  })

  if (questionFamily) {
    patterns.push({
      question_id: question.id,
      pattern_type: "Question Family",
      pattern_value: questionFamily,
    })
  }

  const subtopic = cleanText(question.subtopic)

  if (subtopic) {
    patterns.push({
      question_id: question.id,
      pattern_type: "Subtopic",
      pattern_value: subtopic,
    })
  }

  const questionType = cleanText(question.question_type)

  if (questionType) {
    patterns.push({
      question_id: question.id,
      pattern_type: "Question Type",
      pattern_value: questionType,
    })
  }

  for (const skill of uniqueStrings(cleanArray(question.skills))) {
    patterns.push({
      question_id: question.id,
      pattern_type: "Skill",
      pattern_value: skill,
    })
  }

  for (const variation of uniqueStrings(
    cleanArray(question.variation_patterns),
  )) {
    patterns.push({
      question_id: question.id,
      pattern_type: "Variation",
      pattern_value: variation,
    })
  }

  const diagramDependency = cleanText(
    question.diagram_dependency,
  )

  if (diagramDependency) {
    patterns.push({
      question_id: question.id,
      pattern_type: "Diagram Dependency",
      pattern_value: diagramDependency,
    })
  }

  patterns.push({
    question_id: question.id,
    pattern_type: "Position Band",
    pattern_value: normalizePositionBand(question),
  })

  return patterns
}

function frequencyScore(
  questionCount: number,
  papersAppeared: number,
  totalPapers: number,
): number {
  if (totalPapers <= 0) {
    return 0
  }

  const paperCoverage =
    (papersAppeared / totalPapers) * 100

  const questionDepth = Math.min(
    100,
    (questionCount / Math.max(1, totalPapers * 2)) * 100,
  )

  return Math.min(
    100,
    paperCoverage * 0.75 + questionDepth * 0.25,
  )
}

function recencyScore(
  years: number[],
  latestYear: number,
): number {
  if (!years.length || !latestYear) {
    return 0
  }

  const latestSeen = Math.max(...years)
  const age = Math.max(0, latestYear - latestSeen)

  if (age === 0) {
    return 100
  }

  if (age === 1) {
    return 90
  }

  if (age === 2) {
    return 80
  }

  if (age === 3) {
    return 65
  }

  if (age === 4) {
    return 50
  }

  if (age === 5) {
    return 40
  }

  return Math.max(10, 40 - (age - 5) * 5)
}

function positionScore(
  positions: number[],
  bands: Set<string>,
): number {
  if (!positions.length) {
    return 0
  }

  const bandCount = bands.size

  const bandConsistency =
    bandCount === 1
      ? 100
      : bandCount === 2
        ? 80
        : bandCount === 3
          ? 60
          : 40

  const averagePosition =
    positions.reduce((sum, value) => sum + value, 0) /
    positions.length

  const positionalPreference =
    averagePosition <= 5
      ? 85
      : averagePosition <= 10
        ? 90
        : averagePosition <= 15
          ? 95
          : averagePosition <= 20
            ? 90
            : 85

  return Math.round(
    bandConsistency * 0.7 +
      positionalPreference * 0.3,
  )
}

function variationScore(
  styles: Set<string>,
  questionCount: number,
): number {
  if (questionCount <= 0) {
    return 0
  }

  const distinctStyles = styles.size

  if (distinctStyles >= 6) {
    return 100
  }

  if (distinctStyles === 5) {
    return 90
  }

  if (distinctStyles === 4) {
    return 80
  }

  if (distinctStyles === 3) {
    return 70
  }

  if (distinctStyles === 2) {
    return 55
  }

  return 35
}

function skillScore(
  skills: Set<string>,
): number {
  if (!skills.size) {
    return 0
  }

  if (skills.size >= 6) {
    return 100
  }

  if (skills.size === 5) {
    return 90
  }

  if (skills.size === 4) {
    return 80
  }

  if (skills.size === 3) {
    return 70
  }

  if (skills.size === 2) {
    return 55
  }

  return 40
}

function markWeightScore(
  totalMarks: number,
  questionCount: number,
  maximumAverageMarks: number,
): number {
  if (
    questionCount <= 0 ||
    maximumAverageMarks <= 0
  ) {
    return 0
  }

  const averageMarks = totalMarks / questionCount

  return Math.min(
    100,
    (averageMarks / maximumAverageMarks) * 100,
  )
}

/**
 * Measures how much evidence exists across different examination papers.
 *
 * This is intentionally different from frequencyScore.
 *
 * frequencyScore asks:
 *   "How often does this pattern appear?"
 *
 * coverageScore asks:
 *   "How broadly is this pattern represented across the historical dataset?"
 */
function coverageScore(
  papersAppeared: number,
  totalPapers: number,
): number {
  if (totalPapers <= 0) {
    return 0
  }

  return Math.min(
    100,
    (papersAppeared / totalPapers) * 100,
  )
}

function getPatternStrength(
  predictionScore: number,
): "Weak" | "Moderate" | "Strong" {
  if (predictionScore >= 70) {
    return "Strong"
  }

  if (predictionScore >= 45) {
    return "Moderate"
  }

  return "Weak"
}

function calculatePredictionScore(
  frequency: number,
  recency: number,
  position: number,
  variation: number,
  skills: number,
  marks: number,
  coverage: number,
): number {
  /*
   * Important:
   *
   * We do NOT count "frequency" twice.
   *
   * The predictor is based on evidence:
   *
   * Frequency       25%
   * Recency         10%
   * Position        15%
   * Variation       15%
   * Skills          10%
   * Marks            5%
   * Coverage        20%
   *
   * Total           100%
   */
  const score =
    frequency * 0.25 +
    recency * 0.10 +
    position * 0.15 +
    variation * 0.15 +
    skills * 0.10 +
    marks * 0.05 +
    coverage * 0.20

  return Math.round(
    Math.max(0, Math.min(100, score)) * 100,
  ) / 100
}

function getAggregateKey(
  paper: string,
  patternType: string,
  conceptFamily: string,
  questionFamily: string | null,
): string {
  /*
   * IMPORTANT:
   *
   * Do not include topic/subtopic in this key.
   *
   * Gemini may classify the same conceptual family with slightly
   * different topic/subtopic names between papers.
   *
   * The predictor should therefore aggregate by:
   *
   * Paper + Concept Family + Question Family
   */
  return [
    paper,
    patternType,
    canonicalize(conceptFamily),
    canonicalize(questionFamily ?? ""),
  ].join("::")
}

function createAggregate(
  paper: "Paper 1" | "Paper 2",
  conceptFamily: string,
  questionFamily: string | null,
  patternType: "Concept Family" | "Question Family",
  patternValue: string,
): Aggregate {
  return {
    paper,

    topic: conceptFamily,
    subtopic: null,

    conceptFamily,
    questionFamily,

    patternType,
    patternValue,

    questionCount: 0,
    papers: new Set<string>(),

    years: new Set<number>(),
    positions: [],
    positionBands: new Set<string>(),

    styles: new Set<string>(),
    skills: new Set<string>(),

    totalMarks: 0,
    exampleQuestionIds: [],

    topicCounts: new Map<string, number>(),
    subtopicCounts: new Map<string, number>(),

    frequencyScore: 0,
    recencyScore: 0,
    positionScore: 0,
    variationScore: 0,
    skillScore: 0,
    markWeightScore: 0,
    coverageScore: 0,
    predictionScore: 0,

    patternStrength: "Weak",
  }
}

function addQuestionToAggregate(
  aggregate: Aggregate,
  question: QuestionRow,
  paper: PaperRow,
): void {
  aggregate.questionCount += 1

  aggregate.papers.add(paper.id)
  aggregate.years.add(paper.exam_year)

  aggregate.positions.push(
    question.question_number,
  )

  aggregate.positionBands.add(
    normalizePositionBand(question),
  )

  const topic = cleanText(question.topic)

  if (topic) {
    aggregate.topicCounts.set(
      topic,
      (aggregate.topicCounts.get(topic) ?? 0) + 1,
    )
  }

  const subtopic = cleanText(question.subtopic)

  if (subtopic) {
    aggregate.subtopicCounts.set(
      subtopic,
      (aggregate.subtopicCounts.get(subtopic) ?? 0) + 1,
    )
  }

  const variations = cleanArray(
    question.variation_patterns,
  )

  for (const variation of variations) {
    aggregate.styles.add(variation)
  }

  const questionType = cleanText(
    question.question_type,
  )

  if (questionType) {
    aggregate.styles.add(questionType)
  }

  const family = normalizeQuestionFamily(question)

  if (family) {
    aggregate.styles.add(family)
  }

  for (const skill of cleanArray(question.skills)) {
    aggregate.skills.add(skill)
  }

  if (
    typeof question.marks === "number" &&
    Number.isFinite(question.marks)
  ) {
    aggregate.totalMarks += question.marks
  }

  if (
    aggregate.exampleQuestionIds.length < 8 &&
    !aggregate.exampleQuestionIds.includes(question.id)
  ) {
    aggregate.exampleQuestionIds.push(question.id)
  }
}

function finalizeAggregate(
  aggregate: Aggregate,
  totalPapers: number,
  latestYear: number,
): void {
  const maximumAverageMarks = 6

  aggregate.topic =
    mostCommon(
      Array.from(aggregate.topicCounts.entries()).flatMap(
        ([value, count]) =>
          Array.from({ length: count }, () => value),
      ),
    ) ??
    aggregate.conceptFamily

  aggregate.subtopic =
    mostCommon(
      Array.from(aggregate.subtopicCounts.entries()).flatMap(
        ([value, count]) =>
          Array.from({ length: count }, () => value),
      ),
    )

  aggregate.frequencyScore = frequencyScore(
    aggregate.questionCount,
    aggregate.papers.size,
    totalPapers,
  )

  aggregate.recencyScore = recencyScore(
    Array.from(aggregate.years),
    latestYear,
  )

  aggregate.positionScore = positionScore(
    aggregate.positions,
    aggregate.positionBands,
  )

  aggregate.variationScore = variationScore(
    aggregate.styles,
    aggregate.questionCount,
  )

  aggregate.skillScore = skillScore(
    aggregate.skills,
  )

  aggregate.markWeightScore = markWeightScore(
    aggregate.totalMarks,
    aggregate.questionCount,
    maximumAverageMarks,
  )

  aggregate.coverageScore = coverageScore(
    aggregate.papers.size,
    totalPapers,
  )

  aggregate.predictionScore =
    calculatePredictionScore(
      aggregate.frequencyScore,
      aggregate.recencyScore,
      aggregate.positionScore,
      aggregate.variationScore,
      aggregate.skillScore,
      aggregate.markWeightScore,
      aggregate.coverageScore,
    )

  aggregate.patternStrength =
    getPatternStrength(
      aggregate.predictionScore,
    )
}

export async function generateZimsecMathPatternAnalysis(
  options?: {
    paper?: "Paper 1" | "Paper 2" | "Both"
  },
): Promise<PatternAnalysisResult> {
  const requestedPaper =
    options?.paper ?? "Both"

  let paperQuery = supabaseAdmin
    .from("ai_zimsec_math_papers")
    .select(
      [
        "id",
        "subject",
        "level",
        "curriculum",
        "exam_year",
        "session",
        "paper",
        "title",
        "extraction_status",
      ].join(", "),
    )
    .eq("subject", "Mathematics")
    .eq("level", "O-Level")
    .eq("curriculum", "ZIMSEC")
    .eq("extraction_status", "completed")
    .order("exam_year", {
      ascending: true,
    })

  if (requestedPaper !== "Both") {
    paperQuery = paperQuery.eq(
      "paper",
      requestedPaper,
    )
  }

  const {
    data: papers,
    error: papersError,
  } = await paperQuery

  if (papersError) {
    throw new Error(
      `Failed to retrieve completed Mathematics papers: ${papersError.message}`,
    )
  }

  const typedPapers =
    (papers ?? []) as PaperRow[]

  if (!typedPapers.length) {
    return {
      success: true,
      papersAnalysed: 0,
      questionsAnalysed: 0,
      questionPatternsCreated: 0,
      aggregatePatternsCreated: 0,
      paperResults: [],
    }
  }

  const paperIds = typedPapers.map(
    (paper) => paper.id,
  )

  const {
    data: questions,
    error: questionsError,
  } = await supabaseAdmin
    .from("ai_zimsec_math_questions")
    .select(
      [
        "id",
        "paper_id",
        "question_number",
        "question_label",
        "question_text",
        "topic",
        "subtopic",
        "concept_family",
        "question_family",
        "variation_patterns",
        "skills",
        "question_type",
        "difficulty",
        "marks",
        "paper_section",
        "mathematical_objects",
        "diagram_dependency",
        "position_band",
        "ai_classification_confidence",
      ].join(", "),
    )
    .in("paper_id", paperIds)
    .order("question_number", {
      ascending: true,
    })

  if (questionsError) {
    throw new Error(
      `Failed to retrieve Mathematics questions: ${questionsError.message}`,
    )
  }

  const typedQuestions =
    (questions ?? []) as QuestionRow[]

  const questionsByPaper = new Map<
    string,
    QuestionRow[]
  >()

  for (const question of typedQuestions) {
    const existing =
      questionsByPaper.get(question.paper_id) ?? []

    existing.push(question)

    questionsByPaper.set(
      question.paper_id,
      existing,
    )
  }

  /*
   * ----------------------------------------------------------
   * 1. Rebuild question-level patterns
   * ----------------------------------------------------------
   */

  if (paperIds.length) {
    const { error: deletePatternsError } =
      await supabaseAdmin
        .from("ai_zimsec_math_question_patterns")
        .delete()
        .in("question_id", typedQuestions.map(
          (question) => question.id,
        ))

    if (deletePatternsError) {
      throw new Error(
        `Failed to clear old question patterns: ${deletePatternsError.message}`,
      )
    }
  }

  const questionPatternRows: QuestionPatternRow[] = []

  for (const question of typedQuestions) {
    const patterns =
      getQuestionPatterns(question)

    questionPatternRows.push(
      ...patterns,
    )
  }

  if (questionPatternRows.length) {
    const { error: insertPatternsError } =
      await supabaseAdmin
        .from("ai_zimsec_math_question_patterns")
        .insert(questionPatternRows)

    if (insertPatternsError) {
      throw new Error(
        `Failed to create question patterns: ${insertPatternsError.message}`,
      )
    }
  }

  /*
   * ----------------------------------------------------------
   * 2. Build aggregate concept/question-family analysis
   * ----------------------------------------------------------
   */

  const aggregates = new Map<
    string,
    Aggregate
  >()

  const latestYear =
    Math.max(
      ...typedPapers.map(
        (paper) => paper.exam_year,
      ),
    )

  /*
   * Papers are intentionally counted separately.
   *
   * Paper 1 evidence never gets mixed into Paper 2.
   */
  const paperGroups = new Map<
    "Paper 1" | "Paper 2",
    PaperRow[]
  >()

  for (const paper of typedPapers) {
    const group =
      paperGroups.get(paper.paper) ?? []

    group.push(paper)

    paperGroups.set(
      paper.paper,
      group,
    )
  }

  for (const paper of typedPapers) {
    const paperQuestions =
      questionsByPaper.get(paper.id) ?? []

    const totalPapersForThisPaper =
      paperGroups.get(paper.paper)?.length ?? 0

    for (const question of paperQuestions) {
      const conceptFamily =
        normalizeConceptFamily(question)

      const questionFamily =
        normalizeQuestionFamily(question)

      /*
       * Concept Family aggregate
       */
      const conceptKey =
        getAggregateKey(
          paper.paper,
          "Concept Family",
          conceptFamily,
          null,
        )

      let conceptAggregate =
        aggregates.get(conceptKey)

      if (!conceptAggregate) {
        conceptAggregate =
          createAggregate(
            paper.paper,
            conceptFamily,
            null,
            "Concept Family",
            conceptFamily,
          )

        aggregates.set(
          conceptKey,
          conceptAggregate,
        )
      }

      addQuestionToAggregate(
        conceptAggregate,
        question,
        paper,
      )

      /*
       * Question Family aggregate
       */
      if (questionFamily) {
        const familyKey =
          getAggregateKey(
            paper.paper,
            "Question Family",
            conceptFamily,
            questionFamily,
          )

        let familyAggregate =
          aggregates.get(familyKey)

        if (!familyAggregate) {
          familyAggregate =
            createAggregate(
              paper.paper,
              conceptFamily,
              questionFamily,
              "Question Family",
              questionFamily,
            )

          aggregates.set(
            familyKey,
            familyAggregate,
          )
        }

        addQuestionToAggregate(
          familyAggregate,
          question,
          paper,
        )
      }

      /*
       * Keep the variable referenced so the intent remains clear:
       * scores are calculated against the complete historical paper
       * set for the same paper type.
       */
      void totalPapersForThisPaper
    }
  }

  /*
   * Calculate scores separately for Paper 1 and Paper 2.
   */
  for (const aggregate of aggregates.values()) {
    const totalPapersForPaper =
      paperGroups.get(
        aggregate.paper,
      )?.length ?? 0

    finalizeAggregate(
      aggregate,
      totalPapersForPaper,
      latestYear,
    )
  }

  /*
   * ----------------------------------------------------------
   * 3. Replace aggregate analysis
   * ----------------------------------------------------------
   */

  let deleteAggregateQuery =
    supabaseAdmin
      .from("ai_zimsec_math_pattern_analysis")
      .delete()
      .eq("subject", "Mathematics")
      .eq("level", "O-Level")
      .eq("curriculum", "ZIMSEC")

  if (requestedPaper !== "Both") {
    deleteAggregateQuery =
      deleteAggregateQuery.eq(
        "paper",
        requestedPaper,
      )
  }

  const {
    error: deleteAggregateError,
  } = await deleteAggregateQuery

  if (deleteAggregateError) {
    throw new Error(
      `Failed to clear old aggregate pattern analysis: ${deleteAggregateError.message}`,
    )
  }

  const aggregateRows = Array.from(
    aggregates.values(),
  ).map((aggregate) => ({
    subject: "Mathematics",
    level: "O-Level",
    curriculum: "ZIMSEC",

    paper: aggregate.paper,

    topic: aggregate.topic,
    subtopic: aggregate.subtopic,

    pattern_type: aggregate.patternType,
    pattern_value: aggregate.patternValue,

    position_min:
      aggregate.positions.length
        ? Math.min(...aggregate.positions)
        : null,

    position_max:
      aggregate.positions.length
        ? Math.max(...aggregate.positions)
        : null,

    position_average:
      aggregate.positions.length
        ? Number(
            (
              aggregate.positions.reduce(
                (sum, value) =>
                  sum + value,
                0,
              ) /
              aggregate.positions.length
            ).toFixed(2),
          )
        : null,

    question_count:
      aggregate.questionCount,

    papers_appeared:
      aggregate.papers.size,

    appearance_rate:
      aggregate.papers.size > 0
        ? Number(
            (
              (aggregate.papers.size /
                (paperGroups.get(
                  aggregate.paper,
                )?.length ?? 1)) *
              100
            ).toFixed(2),
          )
        : 0,

    total_marks:
      aggregate.totalMarks,

    average_marks:
      aggregate.questionCount > 0
        ? Number(
            (
              aggregate.totalMarks /
              aggregate.questionCount
            ).toFixed(2),
          )
        : 0,

    years_seen:
      Array.from(
        aggregate.years,
      ).sort((a, b) => a - b),

    question_positions:
      aggregate.positions.sort(
        (a, b) => a - b,
      ),

    question_styles:
      Array.from(
        aggregate.styles,
      ).slice(0, 30),

    skills:
      Array.from(
        aggregate.skills,
      ).slice(0, 30),

    example_question_ids:
      aggregate.exampleQuestionIds,

    frequency_score:
      aggregate.frequencyScore,

    recency_score:
      aggregate.recencyScore,

    position_score:
      aggregate.positionScore,

    style_score:
      aggregate.variationScore,

    skill_score:
      aggregate.skillScore,

    mark_weight_score:
      aggregate.markWeightScore,

    prediction_score:
      aggregate.predictionScore,

    pattern_strength:
      aggregate.patternStrength,

    updated_at: new Date().toISOString(),
  }))

  if (aggregateRows.length) {
    /*
     * Insert in batches to avoid oversized requests when many
     * historical papers/questions exist.
     */
    const batchSize = 100

    for (
      let index = 0;
      index < aggregateRows.length;
      index += batchSize
    ) {
      const batch =
        aggregateRows.slice(
          index,
          index + batchSize,
        )

      const {
        error: aggregateInsertError,
      } = await supabaseAdmin
        .from("ai_zimsec_math_pattern_analysis")
        .insert(batch)

      if (aggregateInsertError) {
        throw new Error(
          `Failed to save aggregate pattern analysis: ${aggregateInsertError.message}`,
        )
      }
    }
  }

  /*
   * ----------------------------------------------------------
   * 4. Per-paper summary
   * ----------------------------------------------------------
   */

  const paperResults =
    typedPapers.map((paper) => {
      const paperQuestions =
        questionsByPaper.get(paper.id) ?? []

      const paperQuestionIds =
        new Set(
          paperQuestions.map(
            (question) => question.id,
          ),
        )

      const paperPatternCount =
        questionPatternRows.filter(
          (pattern) =>
            paperQuestionIds.has(
              pattern.question_id,
            ),
        ).length

      return {
        paper: `${paper.exam_year} ${paper.session ?? ""} ${paper.paper}`.trim(),
        papers: 1,
        questions: paperQuestions.length,
        patterns: paperPatternCount,
      }
    })

  return {
    success: true,

    papersAnalysed:
      typedPapers.length,

    questionsAnalysed:
      typedQuestions.length,

    questionPatternsCreated:
      questionPatternRows.length,

    aggregatePatternsCreated:
      aggregateRows.length,

    paperResults,
  }
}