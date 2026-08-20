import json
import re
from pathlib import Path


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

INPUT_PATH = (
    BASE_DIR
    / "data"
    / "output"
    / "extracted_questions.json"
)

OUTPUT_PATH = (
    BASE_DIR
    / "data"
    / "output"
    / "cleaned_questions.json"
)


# ============================================================
# CONFIGURATION
# ============================================================

# Very short question text is usually an OCR false detection.
MIN_TEXT_LENGTH = 20

# These are common pieces of examination-paper text that
# should NOT be treated as actual questions.
HEADER_PATTERNS = [
    r"centre number",
    r"candidate number",
    r"candidate's number",
    r"candidate name",
    r"candidate name",
    r"forename",
    r"surname",
    r"turn over",
    r"answer",
    r"answer:",
    r"section a",
    r"section b",
    r"mathematical tables",
    r"slide rules",
    r"calculators",
    r"may be used",
    r"may not be used",
    r"zimbabwe school examinations council",
    r"general certificate of education",
    r"ordinary level",
    r"mathematics paper",
    r"additional materials",
    r"candidate",
]


# ============================================================
# LOAD DATA
# ============================================================

def load_questions():
    if not INPUT_PATH.exists():
        raise FileNotFoundError(
            f"Input file not found:\n{INPUT_PATH}"
        )

    with open(
        INPUT_PATH,
        "r",
        encoding="utf-8"
    ) as file:
        data = json.load(file)

    if not isinstance(data, list):
        raise ValueError(
            "extracted_questions.json must contain a list."
        )

    return data


# ============================================================
# NORMALIZE OCR TEXT
# ============================================================

def normalize_text(text):
    """
    Performs safe OCR cleanup.

    IMPORTANT:
    We do not aggressively rewrite mathematical expressions.
    """

    if not text:
        return ""

    # Normalize Windows/newline variations
    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")

    # Remove excessive spaces
    text = re.sub(r"[ \t]+", " ", text)

    # Remove excessive blank lines
    text = re.sub(r"\n\s*\n\s*\n+", "\n\n", text)

    # Remove spaces at beginning/end of lines
    lines = []

    for line in text.split("\n"):
        line = line.strip()

        if line:
            lines.append(line)

    text = "\n".join(lines)

    return text.strip()


# ============================================================
# REMOVE QUESTION NUMBER FROM BEGINNING
# ============================================================

def remove_leading_question_number(text, question_number):
    """
    Example:

    1
    Express 2046...

    becomes:

    Express 2046...
    """

    if not text:
        return ""

    pattern = rf"^\s*{question_number}\s*"

    cleaned = re.sub(
        pattern,
        "",
        text,
        count=1
    )

    return cleaned.strip()


# ============================================================
# CHECK HEADER / INSTRUCTION TEXT
# ============================================================

def looks_like_header(text):
    """
    Determines whether the extracted text looks more like
    an examination header/instruction than a question.
    """

    if not text:
        return True

    lower = text.lower()

    # If text is extremely short, it is probably not useful.
    if len(lower.strip()) < MIN_TEXT_LENGTH:
        return True

    # Count header indicators.
    matches = 0

    for pattern in HEADER_PATTERNS:
        if re.search(pattern, lower):
            matches += 1

    # Strong evidence of header
    if matches >= 2:
        return True

    # Certain single phrases are strong enough on their own.
    strong_headers = [
        "zimbabwe school examinations council",
        "general certificate of education",
        "centre number",
        "candidate number",
        "turn over",
    ]

    for phrase in strong_headers:
        if phrase in lower:
            return True

    return False


# ============================================================
# DETECT PLACEHOLDER / EMPTY QUESTIONS
# ============================================================

def looks_empty(text):
    if not text:
        return True

    # Remove common answer placeholders
    simplified = re.sub(
        r"[\[\]\(\)_\-\.\s]",
        "",
        text
    )

    if len(simplified) < 10:
        return True

    return False


# ============================================================
# DETECT OCR QUALITY
# ============================================================

def calculate_quality_score(text):
    """
    Produces a simple quality score from 0 to 1.

    This is NOT an AI confidence score.

    It simply helps us identify records that may need review.
    """

    if not text:
        return 0.0

    score = 1.0

    # Very short text
    if len(text) < 40:
        score -= 0.25

    # Excessive strange characters
    strange_chars = re.findall(
        r"[^A-Za-z0-9\s.,;:!?()\[\]{}+\-*/=<>%°√²³×÷′″'\"$£/\\]",
        text
    )

    strange_ratio = (
        len(strange_chars) / max(len(text), 1)
    )

    if strange_ratio > 0.10:
        score -= 0.20

    if strange_ratio > 0.20:
        score -= 0.20

    # Excessive repeated punctuation
    if re.search(r"[^\w\s]{6,}", text):
        score -= 0.15

    # OCR often produces these malformed patterns.
    suspicious_patterns = [
        r"\btem1\b",
        r"\banswcr\b",
        r"\bCandid[au]te\b",
        r"\bmathematic[as]\b",
        r"\bZIMBABW[AE]\b",
    ]

    suspicious_count = 0

    for pattern in suspicious_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            suspicious_count += 1

    score -= min(
        suspicious_count * 0.05,
        0.20
    )

    return max(0.0, min(1.0, score))


# ============================================================
# EXTRACT MARKS
# ============================================================

def extract_marks(text):
    """
    Attempts to find marks such as:

    [2]
    [3]
    [10]

    Returns the total when it can reasonably determine it.

    NOTE:
    This is intentionally conservative.
    """

    if not text:
        return None

    matches = re.findall(
        r"\[\s*(\d{1,2})\s*\]",
        text
    )

    if not matches:
        return None

    values = []

    for value in matches:
        try:
            number = int(value)

            if 1 <= number <= 50:
                values.append(number)

        except ValueError:
            continue

    if not values:
        return None

    return sum(values)


# ============================================================
# CREATE QUESTION ID
# ============================================================

def create_question_id(
    year,
    session,
    paper,
    question_number
):
    return (
        f"{year}-"
        f"{session.lower()}-"
        f"p{paper}-"
        f"q{question_number}"
    )


# ============================================================
# CLEAN ONE QUESTION
# ============================================================

def clean_question(question):
    year = question.get("year")
    session = question.get("session")
    paper = question.get("paper")
    question_number = question.get("question_number")

    raw_text = question.get("raw_text", "")

    # Normalize
    clean_text = normalize_text(raw_text)

    # Remove leading question number
    clean_text = remove_leading_question_number(
        clean_text,
        question_number
    )

    # Calculate quality
    quality_score = calculate_quality_score(
        clean_text
    )

    # Detect problems
    header = looks_like_header(clean_text)
    empty = looks_empty(clean_text)

    needs_review = (
        header
        or empty
        or quality_score < 0.65
    )

    # Extract marks
    marks = extract_marks(clean_text)

    # Build cleaned record
    cleaned = {
        "id": create_question_id(
            year,
            session,
            paper,
            question_number
        ),

        "year": year,
        "session": session,
        "paper": paper,
        "question_number": question_number,

        "raw_text": raw_text,
        "clean_text": clean_text,

        "source_pages": question.get(
            "source_pages",
            []
        ),

        "marks": marks,

        "quality_score": round(
            quality_score,
            3
        ),

        "needs_review": needs_review,

        "review_reason": []
    }

    # Add review reasons
    if header:
        cleaned["review_reason"].append(
            "Possible header or examination instruction"
        )

    if empty:
        cleaned["review_reason"].append(
            "Question text is empty or too short"
        )

    if quality_score < 0.65:
        cleaned["review_reason"].append(
            "Possible OCR quality problem"
        )

    return cleaned


# ============================================================
# REMOVE DUPLICATES
# ============================================================

def remove_duplicates(questions):
    """
    Removes exact duplicate records.

    We do NOT remove questions just because they have the same
    question number because different pages/papers can contain
    the same number legitimately.
    """

    seen = set()
    unique = []

    for question in questions:

        key = (
            question["year"],
            question["session"],
            question["paper"],
            question["question_number"],
            question["clean_text"]
        )

        if key in seen:
            continue

        seen.add(key)
        unique.append(question)

    return unique


# ============================================================
# SORT QUESTIONS
# ============================================================

def sort_questions(questions):
    return sorted(
        questions,
        key=lambda q: (
            q["year"],
            0 if q["session"].lower() == "june" else 1,
            q["paper"],
            q["source_pages"][0]
            if q["source_pages"]
            else 0
        )
    )


# ============================================================
# SAVE
# ============================================================

def save_questions(questions):

    OUTPUT_PATH.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with open(
        OUTPUT_PATH,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            questions,
            file,
            indent=2,
            ensure_ascii=False
        )


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 80)
    print("QUESTION CLEANING")
    print("=" * 80)

    print()
    print(f"Input:")
    print(INPUT_PATH)

    print()
    print(f"Output:")
    print(OUTPUT_PATH)

    print()

    questions = load_questions()

    print(
        f"Raw questions loaded: {len(questions)}"
    )

    # --------------------------------------------------------
    # Clean
    # --------------------------------------------------------

    cleaned_questions = []

    for question in questions:

        cleaned = clean_question(question)

        cleaned_questions.append(cleaned)

    # --------------------------------------------------------
    # Remove duplicates
    # --------------------------------------------------------

    before_duplicates = len(
        cleaned_questions
    )

    cleaned_questions = remove_duplicates(
        cleaned_questions
    )

    duplicates_removed = (
        before_duplicates
        - len(cleaned_questions)
    )

    # --------------------------------------------------------
    # Sort
    # --------------------------------------------------------

    cleaned_questions = sort_questions(
        cleaned_questions
    )

    # --------------------------------------------------------
    # Statistics
    # --------------------------------------------------------

    review_count = sum(
        1
        for q in cleaned_questions
        if q["needs_review"]
    )

    valid_count = (
        len(cleaned_questions)
        - review_count
    )

    marks_found = sum(
        1
        for q in cleaned_questions
        if q["marks"] is not None
    )

    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    save_questions(
        cleaned_questions
    )

    # --------------------------------------------------------
    # Results
    # --------------------------------------------------------

    print()
    print("=" * 80)
    print("CLEANING COMPLETE")
    print("=" * 80)

    print()
    print(
        f"Raw questions:        {len(questions)}"
    )

    print(
        f"Duplicates removed:   {duplicates_removed}"
    )

    print(
        f"Questions saved:      {len(cleaned_questions)}"
    )

    print(
        f"Questions to review:  {review_count}"
    )

    print(
        f"Questions OK:         {valid_count}"
    )

    print(
        f"Questions with marks: {marks_found}"
    )

    print()
    print(
        f"Saved to:"
    )

    print(OUTPUT_PATH)

    print()
    print("=" * 80)


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":
    main()