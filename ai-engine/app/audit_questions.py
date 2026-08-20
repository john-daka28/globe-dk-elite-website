import json
from pathlib import Path
from collections import defaultdict


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

INPUT_PATH = (
    BASE_DIR
    / "data"
    / "output"
    / "cleaned_questions.json"
)


# ============================================================
# LOAD
# ============================================================

with open(INPUT_PATH, "r", encoding="utf-8") as file:
    questions = json.load(file)


# ============================================================
# GROUP QUESTIONS BY PAPER
# ============================================================

papers = defaultdict(list)

for question in questions:
    key = (
        question.get("year"),
        question.get("session"),
        question.get("paper")
    )

    papers[key].append(question)


# ============================================================
# AUDIT
# ============================================================

print("=" * 100)
print("QUESTION DATASET AUDIT")
print("=" * 100)

print()
print(f"Total questions: {len(questions)}")
print()


for (year, session, paper), paper_questions in sorted(papers.items()):

    paper_questions.sort(
        key=lambda q: (
            q.get("question_number", 999),
            q.get("source_pages", [999])[0]
        )
    )

    print("-" * 100)
    print(f"{year} {session} Paper {paper}")
    print("-" * 100)

    print(f"Questions found: {len(paper_questions)}")

    # --------------------------------------------------------
    # Question numbers
    # --------------------------------------------------------

    numbers = [
        q.get("question_number")
        for q in paper_questions
        if q.get("question_number") is not None
    ]

    print(f"Question numbers: {numbers}")

    # --------------------------------------------------------
    # Duplicates
    # --------------------------------------------------------

    duplicates = []

    seen = set()

    for number in numbers:

        if number in seen:
            duplicates.append(number)

        seen.add(number)

    if duplicates:
        print(f"Duplicate question numbers: {duplicates}")
    else:
        print("Duplicate question numbers: none")

    # --------------------------------------------------------
    # Review questions
    # --------------------------------------------------------

    review_questions = [
        q for q in paper_questions
        if q.get("needs_review")
    ]

    print(
        f"Needs review: "
        f"{len(review_questions)}"
    )

    # --------------------------------------------------------
    # Short questions
    # --------------------------------------------------------

    short_questions = [
        q for q in paper_questions
        if len(
            q.get("clean_text", "").strip()
        ) < 20
    ]

    print(
        f"Very short questions: "
        f"{len(short_questions)}"
    )

    # --------------------------------------------------------
    # Missing marks
    # --------------------------------------------------------

    missing_marks = [
        q for q in paper_questions
        if q.get("marks") is None
    ]

    print(
        f"Missing marks: "
        f"{len(missing_marks)}"
    )

    # --------------------------------------------------------
    # Details of suspicious questions
    # --------------------------------------------------------

    if short_questions:

        print()
        print("SHORT QUESTIONS:")

        for q in short_questions:

            print(
                f"  Q{q.get('question_number')} "
                f"| pages={q.get('source_pages')} "
                f"| text={repr(q.get('clean_text'))}"
            )

    # --------------------------------------------------------
    # Review reasons
    # --------------------------------------------------------

    if review_questions:

        print()
        print("REVIEW REASONS:")

        reason_counts = defaultdict(int)

        for q in review_questions:

            reasons = q.get("review_reason") or []

            for reason in reasons:
                reason_counts[reason] += 1

        for reason, count in reason_counts.items():

            print(
                f"  {reason}: {count}"
            )

    print()


# ============================================================
# END
# ============================================================

print("=" * 100)
print("AUDIT COMPLETE")
print("=" * 100)