from typing import Any

from app.embeddings.embedding_service import get_embedding_model
from app.rag.rag_service import get_llm
from app.vector_db.search_service import search_similar_chunks


SUMMARY_SECTIONS = {
    "abstract": "abstract of the research paper",
    "introduction": "introduction and research problem of the paper",
    "methodology": "methodology, proposed method, model, algorithm, or approach used in the paper",
    "results": "experimental results, findings, performance, evaluation, or outcomes of the paper",
    "conclusion": "conclusion, key findings, limitations, and future work of the paper",
}


def build_summary_context(results: list[dict[str, Any]]) -> str:
    """Build context from retrieved paper chunks."""

    context_parts = []

    for index, result in enumerate(results, start=1):
        metadata = result["metadata"]

        page_number = metadata.get("page_number")
        chunk_number = metadata.get("chunk_number")

        context_parts.append(
            f"[Context {index} | Page: {page_number} | Chunk: {chunk_number}]\n"
            f"{result['text']}"
        )

    return "\n\n".join(context_parts)


def generate_section_summary(
    section: str,
    paper_id: int,
    top_k: int = 5,
) -> str:
    """Generate an AI summary for one section of a research paper."""

    if section not in SUMMARY_SECTIONS:
        raise ValueError(f"Unsupported summary section: {section}")

    embedding_model = get_embedding_model()

    query = SUMMARY_SECTIONS[section]

    results = search_similar_chunks(
        embeddings_model=embedding_model,
        query=query,
        top_k=top_k,
        paper_id=paper_id,
    )

    if not results:
        return "No relevant information was found for this section."

    context = build_summary_context(results)

    prompt = f"""
You are ResearchLane, an AI research paper analysis assistant.

You are summarizing the {section} section of a research paper.

Use ONLY the research paper context provided below.

Do not use outside knowledge.
Do not invent facts.
Do not add information that is not present in the context.

Write a concise but informative summary.

Focus specifically on the {section} section.

Do not mention:
- page numbers
- chunk numbers
- context numbers
- source labels
- citations

If the provided context does not contain enough information
about this section, clearly say that sufficient information
was not found.

Research paper context:
-----------------------
{context}
-----------------------

Section to summarize:
{section}

Summary:
"""

    llm = get_llm()
    response = llm.invoke(prompt)

    return response.content.strip()


def generate_paper_summary(
    paper_id: int,
) -> dict[str, str]:
    """Generate summaries for all supported paper sections."""

    summaries: dict[str, str] = {}

    for section in SUMMARY_SECTIONS:
        summaries[section] = generate_section_summary(
            section=section,
            paper_id=paper_id,
            top_k=5,
        )

    return summaries