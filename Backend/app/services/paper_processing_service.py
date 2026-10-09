from sqlalchemy.orm import Session

from app.embeddings.embedding_service import (
    get_embedding_model,
)
from app.models.paper import Paper
from app.models.paper_chunk import PaperChunk
from app.parser.text_splitter import (
    get_text_splitter,
)
from app.services.pdf_service import (
    extract_pdf_pages,
)
from app.vector_db.vector_service import (
    delete_paper_vectors,
    store_chunks,
)


def process_paper(
    paper: Paper,
    db: Session,
) -> int:
    """
    Process a paper into database chunks and semantic vectors.
    """

    # --------------------------------------------------
    # Remove old vectors
    # --------------------------------------------------

    delete_paper_vectors(
        paper.id
    )

    # --------------------------------------------------
    # Remove existing chunks
    # --------------------------------------------------

    existing_chunks = (
        db.query(PaperChunk)
        .filter(
            PaperChunk.paper_id == paper.id
        )
        .all()
    )

    for chunk in existing_chunks:
        db.delete(chunk)

    db.flush()

    # --------------------------------------------------
    # Extract PDF text
    # --------------------------------------------------

    pages = extract_pdf_pages(
        paper.file_path
    )

    splitter = get_text_splitter()

    # --------------------------------------------------
    # Create chunks
    # --------------------------------------------------

    chunk_records = []

    chunk_number = 1

    for page in pages:
        page_chunks = splitter.split_text(
            page["text"]
        )

        for chunk_text in page_chunks:
            paper_chunk = PaperChunk(
                paper_id=paper.id,
                page_number=page["page_number"],
                chunk_number=chunk_number,
                text=chunk_text,
            )

            db.add(paper_chunk)

            chunk_records.append(
                {
                    "text": chunk_text,
                    "page_number": page["page_number"],
                    "chunk_number": chunk_number,
                }
            )

            chunk_number += 1

    # --------------------------------------------------
    # Save chunks
    # --------------------------------------------------

    db.commit()

    # --------------------------------------------------
    # Generate and store embeddings
    # --------------------------------------------------

    if chunk_records:
        embedding_model = get_embedding_model()

        store_chunks(
            embeddings_model=embedding_model,
            paper_id=paper.id,
            paper_name=paper.title,
            chunks=chunk_records,
        )

    return len(chunk_records)