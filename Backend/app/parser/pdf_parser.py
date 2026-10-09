from pathlib import Path

import pymupdf


def extract_text_from_pdf(file_path: str | Path) -> str:
    """Extract all readable text from a PDF file."""

    pdf_path = Path(file_path)

    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    text_parts: list[str] = []

    with pymupdf.open(pdf_path) as document:
        for page in document:
            page_text = page.get_text("text")

            if page_text.strip():
                text_parts.append(page_text.strip())

    return "\n\n".join(text_parts)
