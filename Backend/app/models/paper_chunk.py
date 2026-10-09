from sqlalchemy import ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database import Base


class PaperChunk(Base):
    __tablename__ = "paper_chunks"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    paper_id: Mapped[int] = mapped_column(
        ForeignKey("papers.id"),
        nullable=False,
        index=True,
    )

    page_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    chunk_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
