from typing import Any

from app.embeddings.embedding_service import get_embedding_model
from app.rag.rag_service import get_llm
from app.vector_db.search_service import search_similar_chunks


def build_comparison_context(
    paper_a_results: list[dict[str, Any]],
    paper_b_results: list[dict[str, Any]],
) -> str:
    """Build clearly separated context for both papers."""

    context_parts = []

    context_parts.append("===== PAPER A =====")

    for index, result in enumerate(
        paper_a_results,
        start=1,
    ):
        metadata = result["metadata"]

        page_number = metadata.get(
            "page_number"
        )

        chunk_number = metadata.get(
            "chunk_number"
        )

        context_parts.append(
            f"[Paper A Context {index} | "
            f"Page: {page_number} | "
            f"Chunk: {chunk_number}]\n"
            f"{result['text']}"
        )

    context_parts.append(
        "\n===== PAPER B ====="
    )

    for index, result in enumerate(
        paper_b_results,
        start=1,
    ):
        metadata = result["metadata"]

        page_number = metadata.get(
            "page_number"
        )

        chunk_number = metadata.get(
            "chunk_number"
        )

        context_parts.append(
            f"[Paper B Context {index} | "
            f"Page: {page_number} | "
            f"Chunk: {chunk_number}]\n"
            f"{result['text']}"
        )

    return "\n\n".join(context_parts)


def generate_paper_comparison(
    paper_a_id: int,
    paper_b_id: int,
) -> dict[str, str]:
    """
    Generate a complete comparison between two papers.

    Uses one retrieval pass per paper and one LLM call
    for the complete comparison.
    """

    embedding_model = get_embedding_model()

    comparison_query = (
        "research goals, research problem, methodology, "
        "proposed method, model, algorithm, architecture, "
        "datasets, data sources, preprocessing, experiments, "
        "evaluation metrics, results, findings, limitations, "
        "and future work"
    )

    # =========================
    # RETRIEVE PAPER A
    # =========================

    paper_a_results = search_similar_chunks(
        embeddings_model=embedding_model,
        query=comparison_query,
        top_k=8,
        paper_id=paper_a_id,
    )

    # =========================
    # RETRIEVE PAPER B
    # =========================

    paper_b_results = search_similar_chunks(
        embeddings_model=embedding_model,
        query=comparison_query,
        top_k=8,
        paper_id=paper_b_id,
    )

    # =========================
    # NO RESULTS
    # =========================

    if (
        not paper_a_results
        and not paper_b_results
    ):
        return {
            "similarities": (
                "No relevant information was found."
            ),
            "differences": (
                "No relevant information was found."
            ),
            "methodology": (
                "No relevant information was found."
            ),
            "dataset": (
                "No relevant information was found."
            ),
            "results": (
                "No relevant information was found."
            ),
            "final_analysis": (
                "No relevant information was found."
            ),
        }

    # =========================
    # BUILD CONTEXT
    # =========================

    context = build_comparison_context(
        paper_a_results=paper_a_results,
        paper_b_results=paper_b_results,
    )

    # =========================
    # SINGLE LLM PROMPT
    # =========================

    prompt = f"""
You are ResearchLane, an AI research paper
comparison assistant.

Compare Paper A and Paper B using ONLY the
research paper context provided below.

Do not use outside knowledge.
Do not invent facts.
Do not assume information that is not present
in the provided context.

Your task is to produce a structured academic
comparison containing exactly these six sections:

1. Similarities
2. Differences
3. Methodology Comparison
4. Dataset Comparison
5. Results Comparison
6. Final AI Analysis

IMPORTANT RULES:

- Clearly distinguish Paper A from Paper B.
- Use only information present in the context.
- If information is missing, explicitly say:
  "The available context does not provide
  sufficient information."
- Do not invent datasets, metrics, models,
  results, or conclusions.
- Do not mention page numbers.
- Do not mention chunk numbers.
- Do not mention context numbers.
- Do not include citations.
- Do not include source labels.
- Do not discuss information outside the papers.

For the Similarities section:
Explain the major similarities in research goals,
approaches, methods, datasets, and findings.

For the Differences section:
Explain the major differences in research goals,
approaches, methods, datasets, and findings.

For the Methodology Comparison section:
Compare the models, algorithms, architectures,
methods, and approaches used by both papers.

For the Dataset Comparison section:
Compare datasets, data sources, dataset sizes,
data collection, preprocessing, and other relevant
data characteristics when available.

For the Results Comparison section:
Compare experiments, evaluation metrics,
performance, findings, and reported outcomes.

For the Final AI Analysis section:
Provide a concise overall synthesis of how the
two papers relate to each other based strictly
on the provided context.

Research paper context:
-----------------------

{context}

-----------------------

Return the answer using EXACTLY this format:

SIMILARITIES:
<comparison>

DIFFERENCES:
<comparison>

METHODOLOGY:
<comparison>

DATASET:
<comparison>

RESULTS:
<comparison>

FINAL_ANALYSIS:
<overall analysis>
"""

    # =========================
    # ONE LLM CALL
    # =========================

    llm = get_llm()

    response = llm.invoke(prompt)

    content = response.content.strip()

    # =========================
    # PARSE RESPONSE
    # =========================

    comparison = {
        "similarities": "",
        "differences": "",
        "methodology": "",
        "dataset": "",
        "results": "",
        "final_analysis": "",
    }

    sections = {
        "SIMILARITIES:": "similarities",
        "DIFFERENCES:": "differences",
        "METHODOLOGY:": "methodology",
        "DATASET:": "dataset",
        "RESULTS:": "results",
        "FINAL_ANALYSIS:": "final_analysis",
    }

    current_section = None

    for line in content.splitlines():

        stripped_line = line.strip()

        if stripped_line in sections:
            current_section = sections[
                stripped_line
            ]

            continue

        if current_section:
            if comparison[current_section]:
                comparison[current_section] += "\n"

            comparison[current_section] += line

    # =========================
    # CLEAN OUTPUT
    # =========================

    for key in comparison:
        comparison[key] = (
            comparison[key].strip()
        )

        if not comparison[key]:
            comparison[key] = (
                "The AI did not return "
                "sufficient information for "
                "this section."
            )

    return comparison