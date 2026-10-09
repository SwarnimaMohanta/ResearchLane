from langchain_huggingface import HuggingFaceEmbeddings

from app.vector_db.chroma_service import get_chroma_collection


def delete_paper_vectors(paper_id: int) -> None:
    """Delete all ChromaDB vectors belonging to a paper."""

    collection = get_chroma_collection()

    collection.delete(
        where={"paper_id": paper_id}
    )


def store_chunks(
    embeddings_model: HuggingFaceEmbeddings,
    paper_id: int,
    paper_name: str,
    chunks: list[dict],
) -> int:
    """Generate embeddings and store paper chunks in ChromaDB."""

    collection = get_chroma_collection()

    if not chunks:
        return 0

    texts = [chunk["text"] for chunk in chunks]

    vectors = embeddings_model.embed_documents(texts)

    ids = [
        f"paper-{paper_id}-chunk-{chunk['chunk_number']}"
        for chunk in chunks
    ]

    metadatas = [
        {
            "paper_id": paper_id,
            "paper_name": paper_name,
            "page_number": chunk["page_number"],
            "chunk_number": chunk["chunk_number"],
        }
        for chunk in chunks
    ]

    collection.upsert(
        ids=ids,
        embeddings=vectors,
        documents=texts,
        metadatas=metadatas,
    )

    return len(chunks)
