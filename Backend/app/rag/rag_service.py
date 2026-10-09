from typing import Any

from langchain_ollama import ChatOllama

from app.embeddings.embedding_service import get_embedding_model
from app.vector_db.search_service import search_similar_chunks


MODEL_NAME = "qwen2.5:7b"


def get_llm() -> ChatOllama:
    """Return the ResearchLane Qwen LLM."""

    return ChatOllama(
        model=MODEL_NAME,
        temperature=0.2,
    )


def build_context(
    results: list[dict[str, Any]]
) -> str:
    """Build grounded context from retrieved paper chunks."""

    context_parts = []

    for index, result in enumerate(
        results,
        start=1,
    ):
        metadata = result["metadata"]

        paper_id = metadata.get(
            "paper_id"
        )
        page_number = metadata.get(
            "page_number"
        )
        chunk_number = metadata.get(
            "chunk_number"
        )
        paper_name = metadata.get(
            "paper_name"
        )

        context_parts.append(
            f"[Source {index} | "
            f"Paper ID: {paper_id} | "
            f"Paper: {paper_name} | "
            f"Page: {page_number} | "
            f"Chunk: {chunk_number}]\n"
            f"{result['text']}"
        )

    return "\n\n".join(context_parts)


def generate_rag_answer(
    question: str,
    paper_id: int | None = None,
    top_k: int = 5,
) -> dict[str, Any]:
    """Retrieve relevant chunks and generate a grounded answer."""

    if not question.strip():
        raise ValueError(
            "Question must not be empty."
        )

    embedding_model = get_embedding_model()

    results = search_similar_chunks(
        embeddings_model=embedding_model,
        query=question,
        top_k=top_k,
        paper_id=paper_id,
    )

    if not results:
        return {
            "answer": (
                "I could not find relevant information "
                "in the available research papers."
            ),
            "sources": [],
        }

    context = build_context(results)

    prompt = f"""
You are ResearchLane, an AI research paper assistant.

Answer the user's question using ONLY the research paper
context provided below.

Do not use outside knowledge.
Do not invent facts.
If the answer cannot be found in the context, clearly say
that the information is not available in the provided papers.

Give a clear, natural, and well-structured answer.

Do NOT include:
- page numbers
- chunk numbers
- source labels
- citations
- references such as [Page X, Chunk Y]

The source information will be displayed separately in the
Sources section of the application.

Research paper context:
-----------------------
{context}
-----------------------

User question:
{question}

Answer:
"""

    llm = get_llm()

    response = llm.invoke(
        prompt
    )

    # --------------------------------------------------
    # Citation / source information
    # --------------------------------------------------

    sources = [
        {
            "paper_id": result[
                "metadata"
            ].get("paper_id"),

            "paper_name": result[
                "metadata"
            ].get("paper_name"),

            "page_number": result[
                "metadata"
            ].get("page_number"),

            "chunk_number": result[
                "metadata"
            ].get("chunk_number"),

            # Exact text retrieved from the
            # vector database for this source.
            "source_text": result[
                "text"
            ],

            "distance": result[
                "distance"
            ],
        }
        for result in results
    ]

    return {
        "answer": response.content,
        "sources": sources,
    }