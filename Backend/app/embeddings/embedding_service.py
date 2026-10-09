from functools import lru_cache

from langchain_huggingface import (
    HuggingFaceEmbeddings,
)


MODEL_NAME = "BAAI/bge-base-en-v1.5"


@lru_cache(maxsize=1)
def get_embedding_model() -> HuggingFaceEmbeddings:
    """
    Return a cached ResearchLane embedding model.

    The model is loaded only once and reused for
    subsequent paper-processing operations.
    """

    return HuggingFaceEmbeddings(
        model_name=MODEL_NAME,
        model_kwargs={
            "device": "cpu",
        },
        encode_kwargs={
            "normalize_embeddings": True,
        },
    )