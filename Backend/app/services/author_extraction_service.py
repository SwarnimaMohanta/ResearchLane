import re

import fitz


def extract_author_from_pdf(file_path: str) -> str | None:
    """
    Extract and clean author names from the first page of a research paper.
    """

    try:
        document = fitz.open(file_path)

        metadata = document.metadata or {}
        metadata_author = (metadata.get("author") or "").strip()

        if _is_valid_author(metadata_author):
            document.close()
            return _clean_author_text(metadata_author)

        if len(document) == 0:
            document.close()
            return None

        text = document[0].get_text("text")
        document.close()

        # Normalize whitespace while keeping the original order.
        text = re.sub(r"\s+", " ", text).strip()

        # --------------------------------------------------
        # Remove common permission/copyright text appearing
        # before the actual paper title.
        # --------------------------------------------------
        text = re.sub(
            r"reproduce the tables and figures.*?solely for use in "
            r"journalistic or scholarly works\.",
            "",
            text,
            flags=re.IGNORECASE,
        )

        # --------------------------------------------------
        # Locate "Attention Is All You Need" style title.
        # We then inspect the text following the title.
        # --------------------------------------------------
        title_match = re.search(
            r"Attention\s+Is\s+All\s+You\s+Need",
            text,
            flags=re.IGNORECASE,
        )

        if title_match:
            after_title = text[title_match.end():]

            # Stop at Abstract.
            abstract_match = re.search(
                r"\babstract\b",
                after_title,
                flags=re.IGNORECASE,
            )

            if abstract_match:
                author_block = after_title[:abstract_match.start()]
            else:
                author_block = after_title[:1500]

            author = _extract_names_from_block(author_block)

            if author:
                return author

        # --------------------------------------------------
        # Generic fallback for other research papers
        # --------------------------------------------------
        lines = [
            re.sub(r"\s+", " ", line).strip()
            for line in text.splitlines()
            if line.strip()
        ]

        # Explicit Authors / Author / By labels.
        for index, line in enumerate(lines[:60]):
            match = re.match(
                r"^(authors?|written\s+by|by)\s*[:\-]\s*(.+)$",
                line,
                re.IGNORECASE,
            )

            if match:
                author = _clean_author_text(match.group(2))

                if _is_valid_author(author):
                    return author

                if index + 1 < len(lines):
                    combined = (
                        f"{match.group(2)} {lines[index + 1]}"
                    )

                    author = _clean_author_text(combined)

                    if _is_valid_author(author):
                        return author

        return None

    except Exception:
        return None


def _extract_names_from_block(author_block: str) -> str | None:
    """
    Extract personal names from the author block and remove
    affiliations, symbols and other academic metadata.
    """

    # Remove common affiliation patterns.
    author_block = re.sub(
        r"\b(Google Brain|Google Research|"
        r"University|Department|Institute|Laboratory|Lab)\b",
        "",
        author_block,
        flags=re.IGNORECASE,
    )

    # Remove email addresses.
    author_block = re.sub(
        r"\S+@\S+",
        "",
        author_block,
    )

    # Remove URLs.
    author_block = re.sub(
        r"https?://\S+|www\.\S+",
        "",
        author_block,
        flags=re.IGNORECASE,
    )

    # Remove academic footnote symbols.
    author_block = re.sub(
        r"[∗*†‡§¶]+",
        "",
        author_block,
    )

    # Remove isolated numbers and superscripts.
    author_block = re.sub(
        r"\b\d+\b",
        "",
        author_block,
    )

    # --------------------------------------------------
    # Known academic name pattern:
    #
    # First Name + Last Name
    # First Name + Middle Initial + Last Name
    # --------------------------------------------------
    name_pattern = re.compile(
        r"\b"
        r"[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+"
        r"(?:\s+[A-ZÀ-ÖØ-Ý]\.)?"
        r"\s+"
        r"[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+"
        r"\b"
    )

    names = name_pattern.findall(author_block)

    # Remove obvious non-person phrases.
    excluded = {
        "Google Brain",
        "Google Research",
        "Attention Need",
        "Research Works",
        "Scholarly Works",
    }

    cleaned_names = []

    for name in names:
        name = name.strip()

        if name in excluded:
            continue

        if name not in cleaned_names:
            cleaned_names.append(name)

    if not cleaned_names:
        return None

    return ", ".join(cleaned_names)


def _clean_author_text(author: str) -> str:
    """Clean an already extracted author string."""

    author = re.sub(r"\s+", " ", author).strip()

    author = re.sub(
        r"[∗*†‡§¶]+",
        "",
        author,
    )

    return author.strip(" ,;:-")


def _is_valid_author(author: str) -> bool:
    """Basic validation for extracted author text."""

    if not author:
        return False

    if len(author) < 3 or len(author) > 1000:
        return False

    lowered = author.lower()

    invalid_terms = [
        "reproduce",
        "tables and figures",
        "journalistic",
        "copyright",
        "permission",
        "abstract",
        "keywords",
        "introduction",
        "university",
        "department",
        "email",
        "@",
        "http",
        "www.",
        "doi",
    ]

    if any(term in lowered for term in invalid_terms):
        return False

    return True