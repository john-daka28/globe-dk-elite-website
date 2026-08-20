import pymupdf
import json
import os


PDF_PATH = "data/input/ZIMSEC_Mathematics_2014_2020.pdf"
PAPERS_PATH = "data/output/detected_papers.json"


def get_preview(page):
    text = page.get_text("text")

    # Make it easier to read
    text = text.replace("\n", " ")
    text = " ".join(text.split())

    return text[:1000]


def inspect_boundaries():

    document = pymupdf.open(PDF_PATH)

    with open(PAPERS_PATH, "r", encoding="utf-8") as file:
        papers = json.load(file)

    print("=" * 100)
    print("PAPER BOUNDARY INSPECTION")
    print("=" * 100)

    for paper in papers:

        start_page = paper["start_page"]

        # PDF pages are zero-indexed internally
        page = document[start_page - 1]

        preview = get_preview(page)

        print("\n")
        print("=" * 100)

        print(
            f"EXPECTED: "
            f"{paper['year']} "
            f"{paper['session'].upper()} "
            f"Paper {paper['paper']}"
        )

        print(f"PDF PAGE: {start_page}")

        print("-" * 100)
        print(preview)

    document.close()


if __name__ == "__main__":
    inspect_boundaries()