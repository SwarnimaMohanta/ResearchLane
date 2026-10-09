from typing import Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.jwt import get_current_user
from app.database.database import SessionLocal
from app.models import Chat, Paper, User
from app.rag.rag_service import generate_rag_answer


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


class ChatRequest(BaseModel):
    question: str = Field(min_length=1)
    paper_id: int | None = None


class ChatSource(BaseModel):
    paper_id: int | None = None
    paper_name: str | None = None
    author: str | None = None
    page_number: int | None = None
    chunk_number: int | None = None
    source_text: str | None = None
    distance: float | None = None


class ChatResponse(BaseModel):
    answer: str
    sources: list[ChatSource]


class ChatHistoryItem(BaseModel):
    id: int
    paper_id: int | None = None
    question: str
    answer: str
    sources: list[ChatSource]
    created_at: str


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post(
    "/",
    response_model=ChatResponse,
)
def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # --------------------------------------------------
    # Generate RAG answer
    # --------------------------------------------------

    result: dict[str, Any] = generate_rag_answer(
        question=request.question,
        paper_id=request.paper_id,
        top_k=5,
    )

    sources = result.get(
        "sources",
        [],
    )

    # --------------------------------------------------
    # Get paper authors for retrieved sources
    # --------------------------------------------------

    paper_ids = {
        source.get("paper_id")
        for source in sources
        if source.get("paper_id") is not None
    }

    author_by_paper_id: dict[int, str | None] = {}

    if paper_ids:
        papers = db.scalars(
            select(Paper)
            .where(
                Paper.id.in_(paper_ids),
                Paper.user_id == current_user.id,
            )
        ).all()

        author_by_paper_id = {
            paper.id: paper.author
            for paper in papers
        }

    # --------------------------------------------------
    # Add author information to citation sources
    # --------------------------------------------------

    enriched_sources = []

    for source in sources:
        source_paper_id = source.get(
            "paper_id"
        )

        enriched_source = {
            "paper_id": source_paper_id,
            "paper_name": source.get(
                "paper_name"
            ),
            "author": author_by_paper_id.get(
                source_paper_id
            ),
            "page_number": source.get(
                "page_number"
            ),
            "chunk_number": source.get(
                "chunk_number"
            ),
            "source_text": source.get(
                "source_text"
            ),
            "distance": source.get(
                "distance"
            ),
        }

        enriched_sources.append(
            enriched_source
        )

    # --------------------------------------------------
    # Save chat history
    # --------------------------------------------------

    chat_record = Chat(
        user_id=current_user.id,
        paper_id=request.paper_id,
        question=request.question,
        answer=result["answer"],
        sources=enriched_sources,
    )

    db.add(chat_record)
    db.commit()

    # --------------------------------------------------
    # Return response
    # --------------------------------------------------

    return ChatResponse(
        answer=result["answer"],
        sources=enriched_sources,
    )


@router.get(
    "/history",
    response_model=list[ChatHistoryItem],
)
def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    chats = db.scalars(
        select(Chat)
        .where(
            Chat.user_id == current_user.id
        )
        .order_by(
            Chat.created_at.desc()
        )
    ).all()

    return [
        ChatHistoryItem(
            id=chat.id,
            paper_id=chat.paper_id,
            question=chat.question,
            answer=chat.answer,
            sources=chat.sources or [],
            created_at=chat.created_at.isoformat(),
        )
        for chat in chats
    ]