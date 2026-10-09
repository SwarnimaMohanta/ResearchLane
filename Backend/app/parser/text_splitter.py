from langchain_text_splitters import RecursiveCharacterTextSplitter


def get_text_splitter() -> RecursiveCharacterTextSplitter:
    """Return the ResearchLane text splitter."""

    return RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ". ", " ", ""],
    )


def split_text(text: str) -> list[str]:
    """Split extracted PDF text into overlapping chunks."""

    if not text.strip():
        return []

    splitter = get_text_splitter()

    return splitter.split_text(text)
