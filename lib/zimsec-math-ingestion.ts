import {
  gemini,
  getGeminiModelName,
} from "@/lib/gemini"

export type ExtractedMathQuestion = {
  question_number: number
  question_label?: string
  question_text: string

  topic: string
  subtopic?: string

  /**
   * Broad mathematical concept family.
   *
   * Examples:
   * - Matrix Operations
   * - Set Theory
   * - Functions
   * - Kinematics
   * - Statistics
   * - Similar Triangles
   */
  concept_family?: string

  /**
   * Specific recurring question structure.
   *
   * Examples:
   * - Matrix inverse / determinant
   * - Venn diagram set operations
   * - Function evaluation and inverse
   * - Velocity-time graph interpretation
   */
  question_family?: string

  /**
   * Common ways the same mathematical concept
   * can be tested.
   */
  variation_patterns?: string[]

  skills?: string[]
  question_type?: string
  difficulty?: string
  marks?: number | null
  paper_section?: string

  /**
   * Important mathematical entities appearing
   * in the question.
   */
  mathematical_objects?: string[]

  /**
   * Whether understanding a diagram is important
   * to solving the question.
   */
  diagram_dependency?: string

  /**
   * Broad position description within the paper.
   *
   * Examples:
   * - Early
   * - Early-Middle
   * - Middle
   * - Middle-Late
   * - Late
   */
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

function cleanJson(text: string) {
  let cleaned = text.trim()

  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/i, "")
      .trim()
  }

  return cleaned
}

function validateQuestion(
  question: unknown
): question is ExtractedMathQuestion {
  if (!question || typeof question !== "object") {
    return false
  }

  const q =
    question as Record<string, unknown>

  return (
    typeof q.question_number === "number" &&
    typeof q.question_text === "string" &&
    q.question_text.trim().length > 0 &&
    typeof q.topic === "string" &&
    q.topic.trim().length > 0
  )
}

export async function analyseZimsecMathPaper(params: {
  pdfBase64: string
  examYear: number
  session?: string
  paper: "Paper 1" | "Paper 2"
}) {
  const model = getGeminiModelName()

  const prompt = `
You are the ZIMSEC O-Level Mathematics
knowledge-base ingestion engine for GlobeDk AI.

Your task is to READ the supplied ZIMSEC
Mathematics examination PDF and convert it
into structured examination data.

This is NOT an examination prediction task.

You are building historical knowledge that
another AI system will later use to analyse
ZIMSEC examination patterns.

The most important purpose of this classification
is to allow the system to recognise recurring
MATHEMATICAL CONCEPTS and QUESTION FAMILIES
even when ZIMSEC changes the wording, numbers,
context, diagrams, or exact question format.

==================================================
PAPER INFORMATION
==================================================

Exam year:
${params.examYear}

Session:
${params.session || "Unknown"}

Paper:
${params.paper}

==================================================
IMPORTANT INSTRUCTIONS
==================================================

1. Read the entire supplied PDF.

2. Identify every question that appears in
   the examination paper.

3. Preserve the original question number.

4. Preserve the mathematical meaning of every
   question.

5. Include meaningful subparts such as (a),
   (b), (c), etc. inside question_text.

6. Do not invent missing questions.

7. Do not invent marks.

8. If marks are not visible, use null.

9. If a diagram is required to understand a
   question, describe the relevant mathematical
   information from the diagram.

10. Use the visual content of the PDF where
    necessary.

11. Identify the main mathematical topic.

12. Identify the most specific useful subtopic.

13. Identify the broader mathematical concept
    family being tested.

14. Identify the specific recurring question
    family or question structure.

15. Identify the mathematical skills being tested.

16. Identify the type of question.

17. Estimate difficulty using only the question
    itself.

18. Identify important mathematical objects.

19. Identify whether a diagram is important
    to solving the question.

20. Identify the broad position of the question
    within the paper.

21. Identify common variations of this question
    structure that could test the SAME underlying
    mathematical concept.

22. Give a classification confidence from 0 to 100.

==================================================
CRITICAL CONCEPT-LEVEL RULE
==================================================

Do NOT treat the exact wording, numbers, names,
or diagrams of a historical question as the
important information.

The important information is the underlying
mathematical concept and question structure.

For example, these questions:

2025:
Find the inverse of a particular matrix.

2024:
Given a different matrix, calculate its inverse.

2023:
Determine whether a different matrix is singular.

These may belong to the same broader concept
family:

"Matrix Operations"

and related question families may include:

- Matrix inverse
- Determinant
- Singular matrix
- Matrix multiplication
- Matrix equations

Do NOT create a separate unrelated concept merely
because the numerical values or wording differ.

==================================================
QUESTION FAMILY RULE
==================================================

The question_family should describe WHAT TYPE
OF MATHEMATICAL TASK is being performed.

Examples:

Matrices:
- Matrix inverse / determinant
- Matrix multiplication
- Singular matrix
- Matrix equation

Sets:
- Venn diagram / set operations
- Union and intersection
- Complement
- Cardinality of sets

Functions:
- Function evaluation
- Composite functions
- Inverse functions
- Solving function equations
- Exponential function

Statistics:
- Mean from frequency table
- Median and mode
- Statistical graph interpretation
- Cumulative frequency
- Data interpretation

Kinematics:
- Velocity-time graph interpretation
- Distance from graph
- Acceleration / deceleration
- Average speed
- Motion graph interpretation

Geometry:
- Similar triangles
- Congruent triangles
- Circle theorems
- Bearings
- Angle properties

Number:
- Number bases
- Mixed-base arithmetic
- Conversion between bases
- Standard form
- Number properties

Mensuration:
- Area
- Surface area
- Volume
- Scale and area
- Composite shapes

Do NOT make the question_family unnecessarily
specific to the exact numbers or names in the
question.

==================================================
CONCEPT FAMILY RULE
==================================================

The concept_family must be broader than
question_family.

Examples:

Topic:
Matrices

Concept family:
Matrix Operations

Question family:
Matrix inverse / determinant

---

Topic:
Sets

Concept family:
Set Theory and Venn Diagrams

Question family:
Venn diagram / set operations

---

Topic:
Functions

Concept family:
Functions and Relations

Question family:
Function evaluation and inverse

---

Topic:
Statistics

Concept family:
Statistical Data Analysis

Question family:
Mean / median / mode from data

---

Topic:
Kinematics

Concept family:
Motion and Kinematics

Question family:
Velocity-time graph interpretation

---

Topic:
Geometry

Concept family:
Similarity and Congruence

Question family:
Similar triangles

==================================================
VARIATION PATTERNS
==================================================

For every question, identify realistic ways
ZIMSEC could test the SAME concept differently.

Examples:

Matrix inverse:
[
"calculate the inverse of a matrix",
"find determinant before finding inverse",
"determine whether a matrix is singular",
"use a matrix inverse to solve equations"
]

Venn diagrams:
[
"find intersection",
"find union",
"find complement",
"calculate number of elements",
"complete a Venn diagram",
"solve a word problem using sets"
]

Kinematics:
[
"find acceleration from gradient",
"find distance from area under graph",
"calculate average speed",
"interpret a velocity-time graph",
"interpret a displacement-time graph"
]

Similar triangles:
[
"find a missing length",
"identify similar triangles",
"calculate scale factor",
"calculate area ratio",
"compare corresponding sides"
]

Functions:
[
"evaluate a function",
"solve f(x)=k",
"find inverse function",
"evaluate a composite function",
"solve an exponential equation"
]

These are examples only.

Identify the variations that are actually
mathematically appropriate for the question.

Do not invent unrelated variations.

==================================================
TOPIC CLASSIFICATION
==================================================

Use meaningful ZIMSEC O-Level Mathematics
topics such as:

- Number
- Fractions
- Decimals
- Percentages
- Ratio and Proportion
- Indices
- Surds
- Algebra
- Factorisation
- Equations
- Simultaneous Equations
- Inequalities
- Sequences
- Functions
- Graphs
- Coordinate Geometry
- Geometry
- Circle Geometry
- Angles
- Constructions
- Transformations
- Vectors
- Matrices
- Mensuration
- Trigonometry
- Statistics
- Probability
- Sets
- Financial Mathematics
- Measurement
- Other

Do not force an incorrect topic.

==================================================
SUBTOPIC CLASSIFICATION
==================================================

Use the most specific useful mathematical
subtopic supported by the actual question.

Examples:

Topic:
Matrices

Subtopic:
Matrix inverse

Topic:
Sets

Subtopic:
Venn diagrams

Topic:
Functions

Subtopic:
Inverse functions

Topic:
Statistics

Subtopic:
Mean from frequency table

Topic:
Geometry

Subtopic:
Similar triangles

Topic:
Kinematics

Subtopic:
Velocity-time graphs

Do not make the subtopic excessively specific
to the exact numbers or names in the question.

==================================================
QUESTION TYPES
==================================================

Examples include:

- Multiple Choice
- Short Answer
- Structured Problem
- Calculation
- Proof
- Construction
- Graph Interpretation
- Data Interpretation
- Word Problem
- Application
- Mixed

Choose the most appropriate type.

==================================================
DIFFICULTY
==================================================

Use exactly one:

Easy
Moderate
Difficult
Very Difficult

If uncertain, use Moderate.

Difficulty should be based on mathematical
complexity, number of reasoning steps,
interpretation required, and prerequisite skills.

Do not assume that a question is difficult
merely because it has many marks.

==================================================
DIAGRAM DEPENDENCY
==================================================

Use exactly one of:

- None
- Helpful
- Essential

Use:

None
when no diagram is required.

Helpful
when the diagram assists understanding but
the mathematical information can still be
understood from the text.

Essential
when the diagram contains information required
to solve the question.

==================================================
POSITION BAND
==================================================

Identify the broad position of the question
within THIS paper.

Use exactly one:

- Early
- Early-Middle
- Middle
- Middle-Late
- Late

Do not claim that this is a guaranteed future
position.

This is historical position information only.

==================================================
MATHEMATICAL OBJECTS
==================================================

Identify important mathematical objects such as:

- matrices
- determinants
- vectors
- equations
- graphs
- frequency tables
- Venn diagrams
- triangles
- circles
- bearings
- coordinates
- functions
- inequalities
- ratios
- scale drawings
- probability trees
- geometric shapes

Only include objects actually relevant to
the question.

==================================================
SKILLS
==================================================

Identify the actual mathematical skills being
tested.

Examples:

- algebraic manipulation
- substitution
- solving equations
- factorisation
- calculating determinant
- finding matrix inverse
- interpreting graphs
- calculating gradient
- calculating area
- applying circle theorems
- using similarity
- converting number bases
- calculating mean
- interpreting frequency tables

Do not simply repeat the topic name as a skill.

==================================================
PAPER 1 VS PAPER 2
==================================================

Treat Paper 1 and Paper 2 as separate examination
structures.

Do not assume that a concept appearing in
Paper 1 has the same position, mark allocation,
or question style in Paper 2.

The paper field supplied above determines the
paper being analysed.

==================================================
HISTORICAL PATTERN PURPOSE
==================================================

The resulting information will later be used
to compare multiple ZIMSEC papers.

Therefore classification must be CONSISTENT.

For example, if one paper contains:

"Calculate the inverse of matrix A"

and another contains:

"Find A^-1"

both should normally be classified under
the same concept family and question family.

Similarly:

"Use the Venn diagram to find n(A ∩ B)"

and

"Determine the number of learners belonging
to both sets"

may belong to the same broader concept family.

The goal is to recognise mathematical structure,
not superficial wording.

==================================================
IMPORTANT ANTI-COPYING RULE
==================================================

Historical questions are KNOWLEDGE DATA.

They are NOT templates that the future prediction
system should reproduce word-for-word.

Do not create classifications based on:

- exact numerical values
- exact names
- exact wording
- exact answer choices
- exact diagram labels
- exact historical scenario

Instead classify:

- mathematical concept
- mathematical skill
- question family
- common variations
- difficulty
- position band
- mark allocation
- mathematical objects

==================================================
OUTPUT
==================================================

Return ONLY valid JSON.

Do not use Markdown.

Do not write explanations before or after
the JSON.

The JSON must have this structure:

{
  "exam_year": ${params.examYear},
  "session": "${params.session || ""}",
  "paper": "${params.paper}",
  "questions": [
    {
      "question_number": 1,
      "question_label": "1",
      "question_text": "...",

      "topic": "Algebra",

      "subtopic": "Simultaneous equations",

      "concept_family": "Simultaneous Linear Equations",

      "question_family": "Solving simultaneous equations",

      "variation_patterns": [
        "solve two linear equations",
        "solve a word problem using simultaneous equations",
        "solve equations involving different coefficients"
      ],

      "skills": [
        "algebraic manipulation",
        "solving equations",
        "substitution"
      ],

      "question_type": "Structured Problem",

      "difficulty": "Moderate",

      "marks": 8,

      "paper_section": "Section B",

      "mathematical_objects": [
        "linear equations"
      ],

      "diagram_dependency": "None",

      "position_band": "Middle",

      "source_page_start": 3,

      "source_page_end": 4,

      "classification_confidence": 96
    }
  ]
}
`

  /*
   * Gemini Interactions API.
   *
   * The PDF is supplied directly as a document.
   */

  const interaction =
    await gemini.interactions.create({
      model,
      input: [
        {
          type: "document",
          data: params.pdfBase64,
          mime_type: "application/pdf",
        },
        {
          type: "text",
          text: prompt,
        },
      ],
    })

  /*
   * The current Interactions API exposes
   * model output through output_text.
   */

  const responseText =
    interaction.output_text

  if (
    !responseText ||
    responseText.trim().length === 0
  ) {
    throw new Error(
      "Gemini returned an empty response while analysing the Mathematics paper."
    )
  }

  let parsed: ExtractedMathPaper

  try {
    parsed = JSON.parse(
      cleanJson(responseText)
    ) as ExtractedMathPaper
  } catch (error) {
    console.error(
      "Gemini returned invalid JSON:",
      responseText
    )

    throw new Error(
      "Gemini returned invalid JSON while analysing the Mathematics paper."
    )
  }

  if (
    !parsed ||
    !Array.isArray(parsed.questions)
  ) {
    throw new Error(
      "Gemini returned an invalid Mathematics paper structure."
    )
  }

  const validQuestions =
    parsed.questions.filter(
      validateQuestion
    )

  if (validQuestions.length === 0) {
    throw new Error(
      "Gemini could not identify any Mathematics questions in the supplied paper."
    )
  }

  return {
    exam_year: params.examYear,

    session: params.session,

    paper: params.paper,

    questions: validQuestions,
  }
}