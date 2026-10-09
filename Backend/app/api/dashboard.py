from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.auth.jwt import get_current_user
from app.models import User
from app.database.database import SessionLocal
from app.models.chat import Chat
from app.models.paper import Paper


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================
# DASHBOARD STATS
# =========================

@router.get("/stats")
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    total_papers = (
        db.query(func.count(Paper.id))
        .filter(
            Paper.user_id == current_user.id
        )
        .scalar()
    )

    total_chats = (
        db.query(func.count(Chat.id))
        .filter(
            Chat.user_id == current_user.id
        )
        .scalar()
    )

    return {
        "total_papers": total_papers,
        "total_chats": total_chats,
    }


# =========================
# RECENT PAPERS
# =========================

@router.get("/recent-papers")
def get_recent_papers(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    papers = (
        db.query(Paper)
        .filter(
            Paper.user_id == current_user.id
        )
        .order_by(
            Paper.uploaded_at.desc()
        )
        .limit(5)
        .all()
    )

    return [
        {
            "id": paper.id,
            "title": paper.title,
            "filename": paper.filename,
            "description": paper.description,
            "uploaded_at": paper.uploaded_at,
        }
        for paper in papers
    ]


# =========================
# RECENT ACTIVITY
# =========================

@router.get("/recent-activity")
def get_recent_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    chats = (
        db.query(Chat)
        .filter(
            Chat.user_id == current_user.id
        )
        .order_by(
            Chat.created_at.desc()
        )
        .limit(10)
        .all()
    )

    return [
        {
            "id": chat.id,
            "paper_id": chat.paper_id,
            "question": chat.question,
            "answer": chat.answer,
            "created_at": chat.created_at,
        }
        for chat in chats
    ]


# =========================
# CLEAR RECENT ACTIVITY
# =========================

@router.delete("/recent-activity")
def clear_recent_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deleted_count = (
        db.query(Chat)
        .filter(
            Chat.user_id == current_user.id
        )
        .delete(
            synchronize_session=False
        )
    )

    db.commit()

    return {
        "message": "Recent activity cleared successfully.",
        "deleted_count": deleted_count,
    }