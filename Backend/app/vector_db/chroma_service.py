from pathlib import Path

import chromadb


BASE_DIR = Path(__file__).resolve().parents[2]
CHROMA_DIR = BASE_DIR / "chroma_db"

COLLECTION_NAME = "researchlane_papers"


def get_chroma_collection():
    """Return the persistent ChromaDB collection for ResearchLane."""

    client = chromadb.PersistentClient(
        path=str(CHROMA_DIR)
    )

    collection = client.get_or_create_collection(
        name=COLLECTION_NAME
    )

    return collection
