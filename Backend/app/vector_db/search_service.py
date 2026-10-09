from typing import Any

from langchain_huggingface import HuggingFaceEmbeddings

from app.vector_db.chroma_service import get_chroma_collection


def search_similar_chunks(
    embeddings_model: HuggingFaceEmbeddings,
    query: str,
    top_k: int = 5,
    paper_id: int | None = None,
) -> list[dict[str, Any]]:
    """Search ChromaDB for chunks semantically similar to a query."""

    if not query.strip():
        return []

    collection = get_chroma_collection()

    query_vector = embeddings_model.embed_query(query)

    search_kwargs: dict[str, Any] = {
        "query_embeddings": [query_vector],
        "n_results": top_k,
    }

    if paper_id is not None:
        search_kwargs["where"] = {
            "paper_id": paper_id
        }

    results = collection.query(**search_kwargs)

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]
    ids = results.get("ids", [[]])[0]

    return [
        {
            "id": ids[index],
            "text": documents[index],
            "metadata": metadatas[index],
            "distance": distances[index],
        }
        for index in range(len(documents))
    ]
