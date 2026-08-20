import pymupdf
from pathlib import Path


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

PDF_PATH = (
    BASE_DIR
    / "data"
    / "input"
    / "ZIMSEC_Mathematics_2014_2020.pdf"
)


# ============================================================
# CONFIG
# ============================================================

# Change this when inspecting another page.
PAGE_NUMBER = 2


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 80)
    print("PDF PAGE LAYOUT INSPECTOR")
    print("=" * 80)

    print()
    print(f"PDF: {PDF_PATH}")
    print(f"Page: {PAGE_NUMBER}")
    print()

    if not PDF_PATH.exists():

        print("ERROR: PDF not found.")
        return

    document = pymupdf.open(PDF_PATH)

    page = document[PAGE_NUMBER - 1]

    print(
        f"Page size: "
        f"{page.rect.width:.2f} x "
        f"{page.rect.height:.2f}"
    )

    print()
    print("-" * 80)
    print("TEXT BLOCKS")
    print("-" * 80)

    blocks = page.get_text("dict")["blocks"]

    block_number = 0

    for block in blocks:

        if block["type"] != 0:
            continue

        block_number += 1

        bbox = block["bbox"]

        x0, y0, x1, y1 = bbox

        print()
        print(
            f"BLOCK {block_number}"
        )

        print(
            f"Position: "
            f"x={x0:.1f}, "
            f"y={y0:.1f}, "
            f"x1={x1:.1f}, "
            f"y1={y1:.1f}"
        )

        print(
            f"Width:  {x1 - x0:.1f}"
        )

        print(
            f"Height: {y1 - y0:.1f}"
        )

        lines = block.get("lines", [])

        for line in lines:

            spans = line.get("spans", [])

            line_text = ""

            for span in spans:

                text = span.get(
                    "text",
                    ""
                )

                line_text += text

                print(
                    f"  SPAN: "
                    f"text={text!r} "
                    f"font={span.get('font')} "
                    f"size={span.get('size'):.2f} "
                    f"bbox={span.get('bbox')}"
                )

            if line_text.strip():

                print(
                    f"  LINE: {line_text!r}"
                )

    document.close()

    print()
    print("=" * 80)
    print("INSPECTION COMPLETE")
    print("=" * 80)


if __name__ == "__main__":
    main()