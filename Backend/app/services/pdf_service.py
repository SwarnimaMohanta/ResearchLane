from pathlib import Path

import pymupdf


def clean_text(text: str) -> str:
    """Clean extracted PDF text while preserving readable content."""

    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")

    lines = [
        " ".join(line.split())
        for line in text.split("\n")
        if line.strip()
    ]

    return "\n".join(lines)


def extract_pdf_pages(file_path: str) -> list[dict]:
    """Extract and clean text from a PDF page by page."""

    pdf_path = Path(file_path)

    if not pdf_path.exists():
        raise FileNotFoundError(
            f"PDF file not found: {file_path}"
        )

    document = pymupdf.open(pdf_path)
    pages = []

    try:
        for page_number, page in enumerate(document, start=1):
            text = page.get_text("text")
            cleaned_text = clean_text(text)

            if cleaned_text:
                pages.append(
                    {
                        "page_number": page_number,
                        "text": cleaned_text,
                    }
                )
    finally:
        document.close()

    return pages
