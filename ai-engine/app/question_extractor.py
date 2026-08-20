import json
import os
import re
import time
import random
from pathlib import Path
from collections import Counter, defaultdict

import pymupdf
from dotenv import load_dotenv


# ============================================================
# LOAD ENVIRONMENT
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

if ENV_PATH.exists():
    load_dotenv(ENV_PATH)


# ============================================================
# PATHS
# ============================================================

PDF_PATH = (
    BASE_DIR
    / "data"
    / "input"
    / "ZIMSEC_Mathematics_2014_2020.pdf"
)

PAPERS_PATH = (
    BASE_DIR
    / "data"
    / "output"
    / "detected_papers.json"
)

OUTPUT_PATH = (
    BASE_DIR
    / "data"
    / "output"
    / "extracted_questions.json"
)

REVIEW_PATH = (
    BASE_DIR
    / "data"
    / "output"
    / "questions_for_review.json"
)

CACHE_PATH = (
    BASE_DIR
    / "data"
    / "output"
    / "gemini_cache.json"
)


# ============================================================
# GEMINI CONFIGURATION
# ============================================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.6-flash",
)

GEMINI_ENABLED = bool(
    GEMINI_API_KEY
    and GEMINI_API_KEY.strip()
)

# Gemini is only a FALLBACK.
# The local PDF detector does most of the work, and the pipeline
# is designed to run to completion with Gemini fully disabled,
# quota-exhausted, or crashing mid-run.
GEMINI_ENABLED_FOR_AMBIGUOUS_PAGES = True

MAX_GEMINI_REQUESTS_PER_RUN = int(
    os.getenv(
        "MAX_GEMINI_REQUESTS_PER_RUN",
        "10",
    )
)

GEMINI_REQUEST_DELAY = float(
    os.getenv(
        "GEMINI_REQUEST_DELAY",
        "1.0",
    )
)

MAX_GEMINI_RETRIES = int(
    os.getenv(
        "MAX_GEMINI_RETRIES",
        "3",
    )
)

GEMINI_INITIAL_RETRY_DELAY = float(
    os.getenv(
        "GEMINI_INITIAL_RETRY_DELAY",
        "2.0",
    )
)


# ============================================================
# EXTRACTION CONFIGURATION
# ============================================================

MIN_QUESTION_NUMBER = 1
MAX_QUESTION_NUMBER = 40

# Question numbers normally appear toward the left side.
LEFT_MARGIN_RATIO = 0.18

# Ignore numbers very close to the top.
TOP_IGNORE_RATIO = 0.07

# Numbers very close to the bottom are often page/footer numbers.
BOTTOM_IGNORE_RATIO = 0.96

# Strong local detection.
LOCAL_ACCEPT_SCORE = 11

# Suspicious local detection.
LOCAL_REVIEW_SCORE = 8

# Question continuation handling.
ALLOW_CONTINUATIONS = True

# How far past the current question number the fallback scanner
# is willing to look before giving up on a page.
FALLBACK_SCAN_WINDOW = 5


# ============================================================
# QUESTION WORDS
# ============================================================

QUESTION_WORDS = [
    "calculate",
    "find",
    "determine",
    "state",
    "write",
    "express",
    "solve",
    "evaluate",
    "simplify",
    "show",
    "prove",
    "draw",
    "construct",
    "using",
    "given",
    "what",
    "which",
    "how",
    "explain",
    "describe",
    "hence",
    "estimate",
    "complete",
    "copy",
    "represent",
    "factorise",
    "factorize",
    "expand",
    "convert",
    "measure",
    "sketch",
    "work out",
    "calculate the",
    "find the",
    "show that",
]


# ============================================================
# FALSE POSITIVE PHRASES
#
# IMPORTANT: this list was previously full of ordinary words
# ("number", "total", "section", "time", "maximum", "minutes",
# "paper", "mathematics") that appear constantly INSIDE real
# ZIMSEC questions ("find the number of sides", "calculate the
# total surface area", "maximum value of..."). Every match
# silently subtracted points from genuinely correct detections,
# which is the single biggest cause of missed/merged questions.
#
# Only specific multi-word boilerplate phrases belong here, and
# each page/word position is only penalised ONCE no matter how
# many of these phrases are nearby (no stacking).
# ============================================================

FALSE_POSITIVE_PHRASES = [
    "centre number",
    "center number",
    "candidate's number",
    "candidate number",
    "candidate name",
    "turn over",
    "question number",
    "instructions to candidates",
]

# How many words after the number to scan for boilerplate phrases.
# Deliberately short — boilerplate labels sit immediately next to
# a lone number; real question text several words later legitimately
# contains generic words and must not be penalised.
FALSE_POSITIVE_SCAN_WORDS = 6


# ============================================================
# BOILERPLATE / COVER PAGE DETECTION
#
# These patterns are stripped OUT of the reconstructed page text
# entirely (rather than being used as a scoring penalty). This is
# what actually fixes the "Centre Number / Candidate Number" text
# bleeding into the middle of a question, and it is why the old
# "possible_header_or_examination_instruction" review flag fired
# on almost every single question.
# ============================================================

BOILERPLATE_LINE_REGEXES = [
    re.compile(r"^centre\s*number$", re.IGNORECASE),
    re.compile(r"^candidate'?s?\s*number$", re.IGNORECASE),
    re.compile(r"^candidate\s*name$", re.IGNORECASE),
    re.compile(r"^\[?turn\s*over\.?\]?$", re.IGNORECASE),
    re.compile(r"^\d{3,5}\s*/\s*\d\s*[jn]?\d{0,4}$", re.IGNORECASE),
    re.compile(r"^section\s+[ab]\b", re.IGNORECASE),
    re.compile(r"^zimbabwe school examinations council", re.IGNORECASE),
    re.compile(r"^general certificate of education", re.IGNORECASE),
    re.compile(r"^copyright:?\s*zimbabwe", re.IGNORECASE),
    re.compile(r"^do not write", re.IGNORECASE),
    re.compile(r"^scanned (with|by)", re.IGNORECASE),
]

COVER_PAGE_MARKERS = [
    "instructions to candidates",
    "candidates answer on the question paper",
    "additional materials",
    "this booklet should not be punched",
    "allow candidates 5 minutes to count pages",
]

HEADER_FIRST_LINE_WORDS = [
    "candidate",
    "centre number",
    "turn over",
    "instructions",
]


# ============================================================
# UTILITY FUNCTIONS
# ============================================================

def normalize_text(text):
    if not text:
        return ""

    text = str(text)

    text = text.replace("\x00", " ")
    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")

    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()


def safe_int(value):
    try:
        return int(value)
    except Exception:
        return None


def clean_number_text(text):
    if text is None:
        return None

    text = str(text).strip()

    text = text.strip(".,:;()[]{}")

    if not text.isdigit():
        return None

    number = int(text)

    if not (
        MIN_QUESTION_NUMBER
        <= number
        <= MAX_QUESTION_NUMBER
    ):
        return None

    return number


def is_boilerplate_line(text):
    stripped = text.strip()

    if not stripped:
        return True

    for pattern in BOILERPLATE_LINE_REGEXES:
        if pattern.match(stripped):
            return True

    return False


def page_is_cover_page(text):
    lowered = text.lower()

    hits = sum(
        1
        for marker in COVER_PAGE_MARKERS
        if marker in lowered
    )

    return hits >= 2


# ============================================================
# LOAD DETECTED PAPERS
# ============================================================

def load_detected_papers():
    with open(
        PAPERS_PATH,
        "r",
        encoding="utf-8",
    ) as file:
        data = json.load(file)

    if isinstance(data, dict):
        return data.get("papers", [])

    return data


# ============================================================
# GEMINI CACHE
# ============================================================

def load_gemini_cache():
    if not CACHE_PATH.exists():
        return {}

    try:
        with open(
            CACHE_PATH,
            "r",
            encoding="utf-8",
        ) as file:
            data = json.load(file)

        if isinstance(data, dict):
            return data

    except Exception as error:
        print(
            f"WARNING: Could not load Gemini cache: {error}"
        )

    return {}


def save_gemini_cache(cache):
    CACHE_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    temporary_path = CACHE_PATH.with_suffix(".tmp")

    try:
        with open(
            temporary_path,
            "w",
            encoding="utf-8",
        ) as file:
            json.dump(
                cache,
                file,
                indent=2,
                ensure_ascii=False,
            )

        os.replace(
            temporary_path,
            CACHE_PATH,
        )

    except Exception as error:
        print(
            f"WARNING: Could not save Gemini cache: {error}"
        )

        try:
            if temporary_path.exists():
                temporary_path.unlink()
        except Exception:
            pass


def build_gemini_cache_key(paper, page_number):
    year = paper.get("year", "unknown")
    session = paper.get("session", "unknown")
    paper_number = paper.get("paper", "unknown")

    return (
        f"{year}|"
        f"{session}|"
        f"paper{paper_number}|"
        f"page{page_number}"
    )


# ============================================================
# PAGE WORD EXTRACTION (used for coordinate-based scoring)
# ============================================================

def get_page_words(page):
    words = page.get_text("words")

    results = []

    for item in words:
        if len(item) < 8:
            continue

        x0, y0, x1, y1, word = item[:5]

        word = str(word).strip()

        if not word:
            continue

        results.append(
            {
                "text": word,
                "x0": float(x0),
                "y0": float(y0),
                "x1": float(x1),
                "y1": float(y1),
                "width": float(x1 - x0),
                "height": float(y1 - y0),
            }
        )

    return results


# ============================================================
# PAGE LINE EXTRACTION (used for reading-order-correct text)
#
# "dict" mode groups text by PyMuPDF's own geometric line
# detection, which follows the VISUAL layout. This is what fixes
# fragments (e.g. answer-box content) landing in the middle of a
# question's text, which "text" mode (raw content-stream order)
# does not guarantee.
# ============================================================

def build_page_lines(page):
    raw = page.get_text("dict")

    lines = []

    for block in raw.get("blocks", []):
        if block.get("type") != 0:
            continue

        for line in block.get("lines", []):
            spans = line.get("spans", [])

            text = "".join(
                span.get("text", "")
                for span in spans
            ).strip()

            if not text:
                continue

            bbox = line.get("bbox", (0, 0, 0, 0))

            lines.append(
                {
                    "text": text,
                    "x0": float(bbox[0]),
                    "y0": float(bbox[1]),
                    "x1": float(bbox[2]),
                    "y1": float(bbox[3]),
                }
            )

    lines.sort(
        key=lambda item: (
            round(item["y0"], 1),
            item["x0"],
        )
    )

    return lines


def clean_page_lines(lines, page_number_info):
    cleaned = []

    for line in lines:
        stripped = line["text"].strip()

        if is_boilerplate_line(stripped):
            continue

        if page_number_info is not None:
            candidate_number_str = str(
                page_number_info["number"]
            )

            same_text = stripped == candidate_number_str

            close_position = (
                abs(
                    line["y0"]
                    - page_number_info["y"]
                )
                < 12
            )

            if same_text and close_position:
                continue

        cleaned.append(line)

    return cleaned


def lines_to_text(lines):
    return normalize_text(
        "\n".join(
            line["text"] for line in lines
        )
    )


# ============================================================
# DETECT PAGE NUMBER
# ============================================================

def detect_page_number(page, words):
    page_rect = page.rect

    width = float(page_rect.width)
    height = float(page_rect.height)

    candidates = []

    for word in words:
        number = clean_number_text(word["text"])

        if number is None:
            continue

        x_center = (word["x0"] + word["x1"]) / 2
        y_center = (word["y0"] + word["y1"]) / 2

        score = 0

        if y_center < height * 0.10:
            score += 8

        if y_center > height * 0.90:
            score += 6

        if x_center > width * 0.25:
            score += 2

        if word["height"] < height * 0.08:
            score += 1

        if score >= 7:
            candidates.append(
                {
                    "number": number,
                    "score": score,
                    "x": word["x0"],
                    "y": word["y0"],
                }
            )

    if not candidates:
        return None

    candidates.sort(
        key=lambda item: item["score"],
        reverse=True,
    )

    return candidates[0]


# ============================================================
# DETECT QUESTION NUMBER CANDIDATES
# ============================================================

def detect_local_candidates(page, words):
    page_rect = page.rect

    width = float(page_rect.width)
    height = float(page_rect.height)

    page_number = detect_page_number(page, words)

    candidates = []

    for index, word in enumerate(words):
        number = clean_number_text(word["text"])

        if number is None:
            continue

        x0 = word["x0"]
        y0 = word["y0"]
        x1 = word["x1"]
        y1 = word["y1"]

        y_center = (y0 + y1) / 2

        score = 0
        reasons = []

        # ----------------------------------------------------
        # LEFT MARGIN
        # ----------------------------------------------------

        if x0 <= width * 0.10:
            score += 8
            reasons.append("very_left_margin")

        elif x0 <= width * LEFT_MARGIN_RATIO:
            score += 5
            reasons.append("left_margin")

        else:
            score -= 5
            reasons.append("not_left_margin")

        # ----------------------------------------------------
        # HEADER
        # ----------------------------------------------------

        if y_center < height * TOP_IGNORE_RATIO:
            score -= 8
            reasons.append("top_header_region")
        else:
            score += 3

        # ----------------------------------------------------
        # FOOTER
        # ----------------------------------------------------

        if y_center > height * BOTTOM_IGNORE_RATIO:
            score -= 8
            reasons.append("bottom_footer_region")

        # ----------------------------------------------------
        # PAGE NUMBER
        # ----------------------------------------------------

        if page_number:
            same_number = number == page_number["number"]

            close_position = (
                abs(y0 - page_number["y"])
                < height * 0.10
            )

            if same_number and close_position:
                score -= 10
                reasons.append("possible_page_number")

        # ----------------------------------------------------
        # WORDS AFTER NUMBER
        # ----------------------------------------------------

        words_after = []

        for following in words[index + 1:index + 15]:
            if (following["y0"] - y1) > height * 0.15:
                break

            words_after.append(following["text"])

        after_text = " ".join(words_after).lower()

        # ----------------------------------------------------
        # QUESTION COMMAND
        # ----------------------------------------------------

        command_found = False

        for command in QUESTION_WORDS:
            if command in after_text:
                score += 5
                command_found = True
                reasons.append("question_command")
                break

        # ----------------------------------------------------
        # TEXT AFTER NUMBER
        # ----------------------------------------------------

        if words_after:
            score += 2
            reasons.append("text_after_number")

        # ----------------------------------------------------
        # SUBQUESTION PROTECTION
        # ----------------------------------------------------

        if re.search(
            r"\([a-z]\)",
            after_text[:40],
            re.IGNORECASE,
        ):
            score += 1
            reasons.append("possible_subquestion_context")

        # ----------------------------------------------------
        # FALSE POSITIVE PHRASES
        #
        # Tight window, specific phrases only, ONE penalty max
        # regardless of how many phrases are nearby. This is the
        # fix for real questions being scored below threshold by
        # ordinary math vocabulary.
        # ----------------------------------------------------

        nearby_text = " ".join(
            words_after[:FALSE_POSITIVE_SCAN_WORDS]
        ).lower()

        for phrase in FALSE_POSITIVE_PHRASES:
            if phrase in nearby_text:
                score -= 4
                reasons.append(f"false_phrase:{phrase}")
                break

        candidates.append(
            {
                "question_number": number,
                "x": x0,
                "y": y0,
                "score": score,
                "command_found": command_found,
                "reasons": reasons,
                "page_width": width,
                "page_height": height,
                "line_index": None,
            }
        )

    candidates.sort(
        key=lambda item: (
            item["y"],
            -item["score"],
        )
    )

    return candidates


# ============================================================
# CLEAN LOCAL CANDIDATES
# ============================================================

def clean_local_candidates(candidates):
    accepted = []

    for candidate in candidates:
        if candidate["score"] < LOCAL_REVIEW_SCORE:
            continue

        duplicate = False

        for existing in accepted:
            if (
                existing["question_number"]
                == candidate["question_number"]
                and abs(existing["y"] - candidate["y"]) < 30
            ):
                duplicate = True

                if candidate["score"] > existing["score"]:
                    accepted.remove(existing)
                    accepted.append(candidate)

                break

        if not duplicate:
            accepted.append(candidate)

    accepted.sort(key=lambda item: item["y"])

    return accepted


# ============================================================
# MAP CANDIDATES TO RECONSTRUCTED LINES
#
# This is what lets us slice question text by LINE INDEX instead
# of a fragile whole-page regex, which is the fix for questions
# swallowing each other's text.
# ============================================================

def attach_line_indices(candidates, cleaned_lines):
    for candidate in candidates:
        best_index = None
        best_distance = None

        for index, line in enumerate(cleaned_lines):
            if abs(line["y0"] - candidate["y"]) > 14:
                continue

            distance = abs(line["x0"] - candidate["x"])

            if best_distance is None or distance < best_distance:
                best_distance = distance
                best_index = index

        candidate["line_index"] = best_index

    return candidates


# ============================================================
# DETERMINE IF PAGE IS AMBIGUOUS
# ============================================================

def page_is_ambiguous(candidates, page_text):
    if not candidates:
        return True

    strong = [
        candidate
        for candidate in candidates
        if candidate["score"] >= LOCAL_ACCEPT_SCORE
    ]

    if not strong:
        return True

    if strong[0]["score"] < 14:
        return True

    numbers = [
        candidate["question_number"]
        for candidate in strong
    ]

    if numbers:
        for index in range(1, len(numbers)):
            previous = numbers[index - 1]
            current = numbers[index]

            if current < previous - 1:
                return True

            if current > previous + 3:
                return True

    if len(page_text.strip()) < 50:
        return True

    return False


# ============================================================
# FALLBACK SCAN
#
# Runs ONLY when the primary detector found NOTHING on a page.
# Without this, the old code silently glued the entire page onto
# the previous question, which is what caused whole questions
# (10, 11, 14, 17, 19, 20 ...) to disappear from your output.
#
# This is deliberately conservative: left margin, plausible next
# number, and real content following it. Anything it recovers is
# always flagged for manual review, never silently trusted.
# ============================================================

def fallback_scan_for_next_question(cleaned_lines, page_width, expected_number):
    if expected_number is None:
        return None

    pattern = re.compile(r"^(\d{1,2})\b\s*[\.\)]?\s*(.*)$")

    for index, line in enumerate(cleaned_lines):
        if line["x0"] > page_width * LEFT_MARGIN_RATIO:
            continue

        match = pattern.match(line["text"].strip())

        if not match:
            continue

        number = safe_int(match.group(1))

        if number is None:
            continue

        if not (
            expected_number
            <= number
            <= expected_number + FALLBACK_SCAN_WINDOW
        ):
            continue

        remainder = match.group(2).strip()

        if len(remainder) < 3 and index + 1 < len(cleaned_lines):
            remainder = cleaned_lines[index + 1]["text"]

        if len(remainder) < 3:
            continue

        return {
            "question_number": number,
            "score": LOCAL_REVIEW_SCORE,
            "method": "fallback_line_scan",
            "gemini_confidence": None,
            "reason": "recovered_via_fallback_line_scan",
            "line_index": index,
        }

    return None


# ============================================================
# LINE SLICING FOR QUESTION TEXT
# ============================================================

def slice_lines(cleaned_lines, start_index, end_index):
    if start_index is None:
        return None

    if end_index is None:
        end_index = len(cleaned_lines)

    subset = cleaned_lines[start_index:end_index]

    return lines_to_text(subset)


# ============================================================
# GEMINI CLIENT
# ============================================================

def create_gemini_client():
    if not GEMINI_ENABLED:
        return None

    try:
        from google import genai

        client = genai.Client(api_key=GEMINI_API_KEY)

        return client

    except Exception as error:
        print("WARNING: Gemini could not be initialized.")
        print(error)

        return None


# ============================================================
# GEMINI ERROR CLASSIFICATION
# ============================================================

def classify_gemini_error(error):
    error_text = str(error).upper()

    if "RESOURCE_EXHAUSTED" in error_text:
        return "quota"

    if "QUOTA_EXCEEDED" in error_text:
        return "quota"

    if "429" in error_text:
        return "quota"

    if (
        "503" in error_text
        or "UNAVAILABLE" in error_text
        or "SERVICE_UNAVAILABLE" in error_text
        or "500" in error_text
        or "INTERNAL" in error_text
    ):
        return "temporary"

    if "400" in error_text or "INVALID_ARGUMENT" in error_text:
        return "invalid"

    if (
        "401" in error_text
        or "403" in error_text
        or "PERMISSION_DENIED" in error_text
    ):
        return "invalid"

    return "unknown"


# ============================================================
# PARSE GEMINI JSON
# ============================================================

def parse_gemini_json(text):
    if not text:
        return None

    text = str(text).strip()

    text = re.sub(r"^```json\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"\s*```$", "", text)

    try:
        return json.loads(text)
    except Exception:
        pass

    match = re.search(r"\{.*\}", text, re.DOTALL)

    if match:
        try:
            return json.loads(match.group(0))
        except Exception:
            pass

    return None


# ============================================================
# CREATE GEMINI IMAGE
# ============================================================

def render_page_for_gemini(document, page_number):
    page = document[page_number - 1]

    matrix = pymupdf.Matrix(1.5, 1.5)

    pixmap = page.get_pixmap(matrix=matrix, alpha=False)

    return pixmap


# ============================================================
# GEMINI PAGE ANALYSIS
# ============================================================

def analyze_page_with_gemini(
    client,
    document,
    page_number,
    cache,
    cache_key,
    gemini_state,
):
    if cache_key in cache:
        print("      Using cached Gemini result.")
        gemini_state["cache_hits"] += 1
        return cache[cache_key]

    if gemini_state["quota_exhausted"]:
        return None

    try:
        pixmap = render_page_for_gemini(document, page_number)
        image_bytes = pixmap.tobytes("png")
    except Exception as error:
        print(f"      Could not render page for Gemini: {error}")
        return None

    prompt = f"""
You are analyzing page {page_number} of a ZIMSEC Mathematics
examination paper.

Your task is ONLY to identify MAIN QUESTION NUMBERS.

This is a spatial-layout detection task.

Rules:

1. A printed page number is NOT a question number.
2. Ignore numbers at the top center, top right, bottom center,
   footer, or header areas.
3. Candidate numbers and centre numbers are NOT question numbers.
4. Marks such as 1, 2, 3, 4, 5, 10, 15 are NOT automatically
   question numbers.
5. Numbers inside mathematical diagrams are NOT question numbers.
6. A MAIN question number is normally located near the left
   side of the question text.
7. A page may contain MORE THAN ONE main question.
8. A question may continue from a previous page.
9. If the page only contains continuation text and no NEW main
   question number, return an empty list.
10. Do not invent question numbers.
11. Only return question numbers from {MIN_QUESTION_NUMBER}
    through {MAX_QUESTION_NUMBER}.
12. If uncertain, do NOT invent a number.

Return STRICT JSON ONLY.

Required structure:

{{
  "page_number": {page_number},
  "questions": [
    {{
      "question_number": 1,
      "is_new_question": true,
      "confidence": 0.98,
      "reason": "number appears on left margin immediately before question text"
    }}
  ]
}}

If there are no new main questions:

{{
  "page_number": {page_number},
  "questions": []
}}
"""

    for attempt in range(1, MAX_GEMINI_RETRIES + 1):
        try:
            from google.genai import types

            image_part = types.Part.from_bytes(
                data=image_bytes,
                mime_type="image/png",
            )

            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=[prompt, image_part],
                config=types.GenerateContentConfig(
                    temperature=0,
                    response_mime_type="application/json",
                    max_output_tokens=500,
                ),
            )

            result = parse_gemini_json(response.text)

            if result is None:
                raise RuntimeError("Gemini returned invalid JSON.")

            cache[cache_key] = result
            save_gemini_cache(cache)

            gemini_state["requests"] += 1

            return result

        except Exception as error:
            error_type = classify_gemini_error(error)

            if error_type == "quota":
                print("      Gemini quota/rate limit detected.")
                print(
                    "      Gemini will be disabled for the rest "
                    "of this run."
                )
                gemini_state["quota_exhausted"] = True
                return None

            if error_type == "temporary":
                if attempt >= MAX_GEMINI_RETRIES:
                    print(
                        "      Gemini temporary error persisted "
                        f"after {attempt} attempts."
                    )
                    return None

                delay = (
                    GEMINI_INITIAL_RETRY_DELAY
                    * (2 ** (attempt - 1))
                )
                delay += random.uniform(0, 1)

                print(
                    f"      Gemini temporary error "
                    f"(attempt {attempt}/{MAX_GEMINI_RETRIES})."
                )
                print(f"      Waiting {delay:.1f}s before retry...")

                time.sleep(delay)
                continue

            if error_type == "invalid":
                print("      Gemini request/configuration error.")
                print(f"      {error}")
                return None

            print(f"      Gemini error on attempt {attempt}: {error}")

            if attempt < MAX_GEMINI_RETRIES:
                delay = (
                    GEMINI_INITIAL_RETRY_DELAY
                    * (2 ** (attempt - 1))
                )
                time.sleep(delay)
            else:
                return None

    return None


# ============================================================
# NORMALIZE GEMINI RESULT
# ============================================================

def normalize_gemini_questions(result):
    if not result:
        return []

    questions = result.get("questions", [])

    if not isinstance(questions, list):
        return []

    normalized = []

    for item in questions:
        if not isinstance(item, dict):
            continue

        number = clean_number_text(item.get("question_number"))

        if number is None:
            continue

        confidence = item.get("confidence", 0)

        try:
            confidence = float(confidence)
        except Exception:
            confidence = 0

        normalized.append(
            {
                "question_number": number,
                "confidence": confidence,
                "reason": str(item.get("reason", "")),
                "is_new_question": bool(
                    item.get("is_new_question", True)
                ),
            }
        )

    unique = {}

    for item in normalized:
        number = item["question_number"]

        if (
            number not in unique
            or item["confidence"] > unique[number]["confidence"]
        ):
            unique[number] = item

    return list(unique.values())


# ============================================================
# COMBINE LOCAL + GEMINI DETECTION
# ============================================================

def combine_detections(local_candidates, gemini_questions):
    combined = []

    local_by_number = {}

    for candidate in local_candidates:
        number = candidate["question_number"]

        if (
            number not in local_by_number
            or candidate["score"] > local_by_number[number]["score"]
        ):
            local_by_number[number] = candidate

    gemini_by_number = {}

    for question in gemini_questions:
        number = question["question_number"]

        if (
            number not in gemini_by_number
            or question["confidence"]
            > gemini_by_number[number]["confidence"]
        ):
            gemini_by_number[number] = question

    if gemini_questions:
        for number, gemini_item in gemini_by_number.items():
            local_item = local_by_number.get(number)

            if local_item:
                combined.append(
                    {
                        "question_number": number,
                        "score": max(local_item["score"], 15),
                        "method": "pdf_coordinates+gemini",
                        "gemini_confidence": gemini_item["confidence"],
                        "reason": gemini_item["reason"],
                        "line_index": local_item.get("line_index"),
                    }
                )
            else:
                combined.append(
                    {
                        "question_number": number,
                        "score": 18,
                        "method": "gemini",
                        "gemini_confidence": gemini_item["confidence"],
                        "reason": gemini_item["reason"],
                        "line_index": None,
                    }
                )

    else:
        for candidate in local_candidates:
            if candidate["score"] >= LOCAL_ACCEPT_SCORE:
                combined.append(
                    {
                        "question_number": candidate["question_number"],
                        "score": candidate["score"],
                        "method": "pdf_coordinates",
                        "gemini_confidence": None,
                        "reason": "; ".join(candidate["reasons"]),
                        "line_index": candidate.get("line_index"),
                    }
                )

    unique = {}

    for item in combined:
        number = item["question_number"]

        if (
            number not in unique
            or item["score"] > unique[number]["score"]
        ):
            unique[number] = item

    result = list(unique.values())

    result.sort(
        key=lambda item: (
            item["line_index"]
            if item.get("line_index") is not None
            else 10 ** 6,
            item["question_number"],
        )
    )

    return result


# ============================================================
# PAGE ANALYSIS
# ============================================================

def analyze_page(
    document,
    paper,
    page_number,
    cache,
    gemini_client,
    gemini_state,
    current_question_number,
):
    page = document[page_number - 1]

    words = get_page_words(page)
    page_number_info = detect_page_number(page, words)

    raw_lines = build_page_lines(page)
    cleaned_lines = clean_page_lines(raw_lines, page_number_info)
    page_text = lines_to_text(cleaned_lines)

    if page_is_cover_page(page_text):
        return {
            "page_number": page_number,
            "lines": [],
            "text": "",
            "questions": [],
            "ambiguous": False,
            "gemini_used": False,
            "is_cover_page": True,
        }

    local_candidates = detect_local_candidates(page, words)
    local_candidates = clean_local_candidates(local_candidates)
    local_candidates = attach_line_indices(local_candidates, cleaned_lines)

    ambiguous = page_is_ambiguous(local_candidates, page_text)

    gemini_questions = []

    should_use_gemini = (
        ambiguous
        and GEMINI_ENABLED_FOR_AMBIGUOUS_PAGES
        and gemini_client is not None
        and not gemini_state["quota_exhausted"]
        and gemini_state["requests"] < MAX_GEMINI_REQUESTS_PER_RUN
    )

    if should_use_gemini:
        try:
            print("      Page is ambiguous.")
            print("      Asking Gemini Vision...")

            if gemini_state["requests"] > 0:
                time.sleep(GEMINI_REQUEST_DELAY)

            cache_key = build_gemini_cache_key(paper, page_number)
            was_cached = cache_key in cache

            result = analyze_page_with_gemini(
                client=gemini_client,
                document=document,
                page_number=page_number,
                cache=cache,
                cache_key=cache_key,
                gemini_state=gemini_state,
            )

            if result is not None:
                gemini_questions = normalize_gemini_questions(result)

                if was_cached:
                    print("      Gemini result loaded from cache.")

                print(
                    "      Gemini question numbers: "
                    f"{[q['question_number'] for q in gemini_questions]}"
                )

            elif gemini_state["quota_exhausted"]:
                print("      Gemini quota exhausted.")
                print("      Continuing with local detection.")

            else:
                print("      Gemini did not return a usable result.")
                print("      Continuing with local detection.")

        except Exception as error:
            # Gemini must NEVER be able to stop the pipeline.
            print(f"      Gemini call failed unexpectedly: {error}")
            print("      Continuing with local detection.")
            gemini_questions = []

    combined = combine_detections(local_candidates, gemini_questions)

    # --------------------------------------------------------
    # FALLBACK SCAN
    #
    # Only when the page produced literally nothing. This is the
    # safety net that stops whole questions from being silently
    # swallowed into the previous question's text.
    # --------------------------------------------------------

    if not combined and current_question_number is not None:
        fallback = fallback_scan_for_next_question(
            cleaned_lines,
            page.rect.width,
            current_question_number + 1,
        )

        if fallback is not None:
            print(
                "      Primary detector found nothing; "
                f"fallback scan recovered question "
                f"{fallback['question_number']}."
            )
            combined = [fallback]

    # --------------------------------------------------------
    # MONOTONIC SEQUENCE FILTER
    #
    # Drops stray/backward numbers (e.g. a mark allocation digit
    # mis-read as a question start) that would otherwise create
    # bogus duplicate question objects.
    # --------------------------------------------------------

    if current_question_number is not None:
        combined = [
            item
            for item in combined
            if item["question_number"] >= current_question_number
        ]

    return {
        "page_number": page_number,
        "lines": cleaned_lines,
        "text": page_text,
        "questions": combined,
        "ambiguous": ambiguous,
        "gemini_used": bool(gemini_questions),
        "is_cover_page": False,
    }


# ============================================================
# EXTRACT ONE PAPER
# ============================================================

def extract_questions_from_paper(
    document,
    paper,
    cache,
    gemini_client,
    gemini_state,
):
    start_page = paper["start_page"]
    end_page = paper["end_page"]

    questions = []
    current_question = None

    print()

    for page_number in range(start_page, end_page + 1):
        print(f"    Analyzing page {page_number}...")

        current_number = (
            current_question["question_number"]
            if current_question is not None
            else None
        )

        try:
            analysis = analyze_page(
                document,
                paper,
                page_number,
                cache,
                gemini_client,
                gemini_state,
                current_number,
            )
        except Exception as error:
            # A single bad page must never kill the whole paper.
            print(f"      ERROR analyzing page {page_number}: {error}")
            print("      Skipping this page and continuing.")
            continue

        if analysis.get("is_cover_page"):
            print("      Cover / instructions page skipped.")
            continue

        detections = analysis["questions"]
        cleaned_lines = analysis["lines"]
        page_text = analysis["text"]

        numbers = [d["question_number"] for d in detections]

        if numbers:
            print(f"      Detected: {numbers}")

        # ----------------------------------------------------
        # NO DETECTIONS -> pure continuation
        # ----------------------------------------------------

        if not detections:
            if (
                current_question is not None
                and ALLOW_CONTINUATIONS
                and page_text
            ):
                current_question["raw_text"] += "\n\n" + page_text

                if page_number not in current_question["source_pages"]:
                    current_question["source_pages"].append(page_number)

            continue

        # ----------------------------------------------------
        # NEW QUESTION(S)
        # ----------------------------------------------------

        for index, detection in enumerate(detections):
            number = detection["question_number"]
            start_index = detection.get("line_index")

            if index + 1 < len(detections):
                end_index = detections[index + 1].get("line_index")
            else:
                end_index = None

            sliced_text = slice_lines(cleaned_lines, start_index, end_index)

            if not sliced_text or len(sliced_text) < 3:
                # No reliable coordinates (e.g. a Gemini-only
                # detection) -> fall back to the whole cleaned
                # page rather than losing the text entirely.
                sliced_text = page_text

            # --------------------------------------------------
            # SAME QUESTION CONTINUING ON THIS PAGE
            # --------------------------------------------------

            if (
                current_question is not None
                and number == current_question["question_number"]
            ):
                if sliced_text:
                    current_question["raw_text"] += "\n\n" + sliced_text

                if page_number not in current_question["source_pages"]:
                    current_question["source_pages"].append(page_number)

                continue

            # --------------------------------------------------
            # SAVE PREVIOUS QUESTION
            # --------------------------------------------------

            if current_question is not None:
                questions.append(current_question)

            # --------------------------------------------------
            # CREATE NEW QUESTION
            # --------------------------------------------------

            current_question = {
                "year": paper["year"],
                "session": paper["session"],
                "paper": paper["paper"],
                "question_number": number,
                "raw_text": sliced_text,
                "source_pages": [page_number],
                "detection_score": detection["score"],
                "detection_method": detection["method"],
                "gemini_confidence": detection.get("gemini_confidence"),
                "detection_reason": detection.get("reason", ""),
                "requires_review": False,
                "review_reasons": [],
            }

    if current_question is not None:
        questions.append(current_question)

    questions = validate_questions(questions)

    return questions


# ============================================================
# QUESTION VALIDATION
# ============================================================

def validate_questions(questions):
    for question in questions:
        text = normalize_text(question.get("raw_text", ""))
        question["raw_text"] = text

        reasons = []

        score = question.get("detection_score", 0)

        if score < LOCAL_ACCEPT_SCORE:
            reasons.append("low_question_detection_confidence")

        if len(text) < 20:
            reasons.append("question_text_is_very_short")

        # ----------------------------------------------------
        # HEADER CHECK
        #
        # Tightened to only look at the question's OWN first
        # line. With boilerplate now stripped out at the line
        # level during extraction, this should rarely fire —
        # if it does, it means text extraction genuinely failed
        # for that question, which is worth knowing about.
        # ----------------------------------------------------

        first_line = text.split("\n", 1)[0].lower()

        if any(word in first_line for word in HEADER_FIRST_LINE_WORDS):
            reasons.append("possible_header_or_examination_instruction")

        has_command = any(
            command in text.lower() for command in QUESTION_WORDS
        )

        if not has_command and len(text) > 50:
            reasons.append("no_obvious_question_command_word")

        gemini_confidence = question.get("gemini_confidence")

        if gemini_confidence is not None and gemini_confidence < 0.70:
            reasons.append("low_gemini_confidence")

        if question.get("detection_method") == "fallback_line_scan":
            reasons.append("recovered_via_fallback_line_scan")

        question["requires_review"] = bool(reasons)
        question["review_reasons"] = list(dict.fromkeys(reasons))

    return questions


# ============================================================
# EXACT DUPLICATES
# ============================================================

def remove_exact_duplicates(questions):
    seen = set()
    cleaned = []
    duplicates = 0

    for question in questions:
        key = (
            question["year"],
            question["session"],
            question["paper"],
            question["question_number"],
            normalize_text(question["raw_text"]),
        )

        if key in seen:
            duplicates += 1
            continue

        seen.add(key)
        cleaned.append(question)

    return cleaned, duplicates


# ============================================================
# REVIEW FILE
# ============================================================

def save_review_file(questions):
    review = [
        question
        for question in questions
        if question.get("requires_review", False)
    ]

    REVIEW_PATH.parent.mkdir(parents=True, exist_ok=True)

    with open(REVIEW_PATH, "w", encoding="utf-8") as file:
        json.dump(review, file, indent=2, ensure_ascii=False)

    return review


# ============================================================
# STATISTICS
# ============================================================

def print_statistics(questions, gemini_state, duplicates):
    print()
    print("=" * 80)
    print("EXTRACTION STATISTICS")
    print("=" * 80)

    print(f"Total extracted: {len(questions)}")

    paper_counts = Counter(
        (q["year"], q["session"], q["paper"]) for q in questions
    )

    print()
    print("Questions per paper:")

    for paper, count in sorted(paper_counts.items()):
        year, session, paper_number = paper
        print(f"  {year} {session} Paper {paper_number}: {count}")

    review_questions = [
        q for q in questions if q.get("requires_review", False)
    ]

    print()
    print(f"Questions requiring review: {len(review_questions)}")
    print(
        f"Questions passing validation: "
        f"{len(questions) - len(review_questions)}"
    )

    reason_counter = Counter()

    for question in review_questions:
        for reason in question.get("review_reasons", []):
            reason_counter[reason] += 1

    if reason_counter:
        print()
        print("Review reasons:")

        for reason, count in reason_counter.most_common():
            print(f"  {reason}: {count}")

    method_counter = Counter(
        q.get("detection_method", "unknown") for q in questions
    )

    print()
    print("Detection methods:")

    for method, count in method_counter.items():
        print(f"  {method}: {count}")

    scores = [q.get("detection_score", 0) for q in questions]

    if scores:
        print()
        print(f"Minimum detection score: {min(scores)}")
        print(f"Maximum detection score: {max(scores)}")
        print(f"Average detection score: {sum(scores) / len(scores):.2f}")

    print()
    print(f"Gemini requests used: {gemini_state['requests']}")
    print(f"Gemini cache hits: {gemini_state['cache_hits']}")
    print(f"Gemini quota exhausted: {gemini_state['quota_exhausted']}")

    print()
    print(f"Exact duplicates removed: {duplicates}")


# ============================================================
# PAPER SUMMARY
# ============================================================

def print_paper_summary(questions):
    grouped = defaultdict(list)

    for question in questions:
        key = (question["year"], question["session"], question["paper"])
        grouped[key].append(question["question_number"])

    print()
    print("=" * 80)
    print("PAPER DETECTION SUMMARY")
    print("=" * 80)

    for key in sorted(grouped.keys()):
        year, session, paper = key
        numbers = sorted(set(grouped[key]))

        review_count = sum(
            1
            for question in questions
            if (
                question["year"],
                question["session"],
                question["paper"],
            )
            == key
            and question.get("requires_review", False)
        )

        print(f"{year} {session} Paper {paper}:")
        print(f"  Questions: {len(grouped[key])}")
        print(f"  Numbers: {numbers}")
        print(f"  Review: {review_count}")

    print()
    print("=" * 80)
    print("SEQUENCE CHECK")
    print("=" * 80)

    for key in sorted(grouped.keys()):
        year, session, paper = key
        numbers = sorted(set(grouped[key]))

        if not numbers:
            continue

        maximum = max(numbers)
        expected = set(range(1, maximum + 1))
        missing = sorted(expected - set(numbers))

        if missing:
            print(f"{year} {session} Paper {paper}:")
            print(f"  Missing numbers: {missing}")


# ============================================================
# MAIN
# ============================================================

def main():
    print("=" * 80)
    print("HYBRID PDF + GEMINI VISION QUESTION EXTRACTION")
    print("=" * 80)

    print()
    print(f"PDF: {PDF_PATH}")
    print(f"Papers: {PAPERS_PATH}")
    print(f"Output: {OUTPUT_PATH}")
    print(f"Review: {REVIEW_PATH}")
    print(f"Gemini cache: {CACHE_PATH}")
    print()

    if GEMINI_ENABLED:
        print(f"Gemini model: {GEMINI_MODEL}")
        print(f"Gemini max requests/run: {MAX_GEMINI_REQUESTS_PER_RUN}")
    else:
        print("Gemini: DISABLED (GEMINI_API_KEY not found)")
        print("        Pipeline will run local-detection-only, which is")
        print("        fully supported and does not require Gemini.")

    print()

    if not PDF_PATH.exists():
        print("ERROR: PDF file not found.")
        return

    if not PAPERS_PATH.exists():
        print("ERROR: detected_papers.json not found.")
        return

    papers = load_detected_papers()

    print(f"Detected papers loaded: {len(papers)}")

    gemini_cache = load_gemini_cache()

    if gemini_cache:
        print(f"Gemini cache entries: {len(gemini_cache)}")

    gemini_client = create_gemini_client()

    if GEMINI_ENABLED and gemini_client is None:
        print("WARNING: Gemini unavailable. Continuing without it.")

    gemini_state = {
        "requests": 0,
        "cache_hits": 0,
        "quota_exhausted": False,
    }

    document = pymupdf.open(PDF_PATH)

    all_questions = []

    try:
        for paper in papers:
            year = paper["year"]
            session = paper["session"]
            paper_number = paper["paper"]

            print()
            print(
                f"Processing: {year} {session} Paper {paper_number} "
                f"| Pages {paper['start_page']}-{paper['end_page']}"
            )

            try:
                questions = extract_questions_from_paper(
                    document,
                    paper,
                    gemini_cache,
                    gemini_client,
                    gemini_state,
                )

                print()
                print(f"  Questions detected: {len(questions)}")

                numbers = [q["question_number"] for q in questions]
                print(f"  Question numbers: {numbers}")

                all_questions.extend(questions)

            except Exception as error:
                print()
                print(
                    f"  ERROR processing {year} {session} "
                    f"Paper {paper_number}: {error}"
                )
                print("  Continuing with remaining papers.")
                continue

    finally:
        document.close()

    all_questions, duplicates = remove_exact_duplicates(all_questions)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_PATH, "w", encoding="utf-8") as file:
        json.dump(all_questions, file, indent=2, ensure_ascii=False)

    review_questions = save_review_file(all_questions)

    print_statistics(all_questions, gemini_state, duplicates)
    print_paper_summary(all_questions)

    print()
    print("=" * 80)
    print(f"EXACT DUPLICATES REMOVED: {duplicates}")
    print(f"TOTAL QUESTIONS SAVED: {len(all_questions)}")
    print(f"QUESTIONS FOR MANUAL REVIEW: {len(review_questions)}")
    print("=" * 80)

    print()
    print("Saved to:")
    print(OUTPUT_PATH)
    print()
    print("Review file:")
    print(REVIEW_PATH)
    print()
    print("Gemini cache:")
    print(CACHE_PATH)
    print()


if __name__ == "__main__":
    main()