import json
from pathlib import Path

import pymupdf


BASE_DIR = Path(__file__).resolve().parent.parent

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


def load_papers():

    with open(
        PAPERS_PATH,
        "r",
        encoding="utf-8"
    ) as f:

        data = json.load(f)

    if isinstance(data, dict):
        return data.get("papers", [])

    return data


def main():

    papers = load_papers()

    document = pymupdf.open(PDF_PATH)

    print("=" * 100)
    print("PAPER END VALIDATION")
    print("=" * 100)
    print()

    for paper in papers:

        end_page = paper["end_page"]

        text = document[
            end_page - 1
        ].get_text("text")

        text = " ".join(
            text.split()
        )

        # Keep the preview short
        preview = text[:350]

        print("-" * 100)

        print(
            f"{paper['year']} "
            f"{paper['session']} "
            f"Paper {paper['paper']}"
        )

        print(
            f"Pages: "
            f"{paper['start_page']}-"
            f"{paper['end_page']}"
        )

        print(
            f"LAST PAGE {end_page}:"
        )

        print(preview)

        print()

    document.close()


if __name__ == "__main__":
    main()