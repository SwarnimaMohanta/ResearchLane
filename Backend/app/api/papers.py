import io

import fitz

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    Form,
    Header,
    HTTPException,
    UploadFile,
    status,
)
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.auth.jwt import (
    decode_access_token,
    get_current_user,
)
from app.database.database import SessionLocal
from app.models import User
from app.models.paper import Paper
from app.services.author_extraction_service import (
    extract_author_from_pdf,
)
from app.services.compare_service import (
    generate_paper_comparison,
)
from app.services.file_service import (
    delete_uploaded_file,
    save_uploaded_pdf,
)
from app.services.paper_processing_service import (
    process_paper,
)
from app.services.summary_service import (
    generate_paper_summary,
)


router = APIRouter(
    prefix="/papers",
    tags=["Papers"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


class PaperCompareRequest(BaseModel):
    paper_a_id: int
    paper_b_id: int


def process_paper_in_background(
    paper_id: int,
) -> None:
    """
    Process a paper after the upload response has already
    been sent to the frontend.

    A fresh database session is created here because the
    request session should not be reused by a background task.
    """

    db = SessionLocal()

    try:
        paper = (
            db.query(Paper)
            .filter(Paper.id == paper_id)
            .first()
        )

        if paper is None:
            return

        process_paper(
            paper,
            db,
        )

    except Exception as error:
        print(
            f"Background processing failed for paper "
            f"{paper_id}: {error}"
        )

    finally:
        db.close()


@router.post(
    "/upload",
    status_code=status.HTTP_201_CREATED,
)
async def upload_paper(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    title: str | None = Form(None),
    description: str | None = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # --------------------------------------------------
    # Save uploaded PDF
    # --------------------------------------------------

    original_filename, file_path = await save_uploaded_pdf(
        file
    )

    # --------------------------------------------------
    # Determine paper title
    # --------------------------------------------------

    paper_title = (
        title.strip()
        if title and title.strip()
        else original_filename
    )

    # --------------------------------------------------
    # Extract author
    # --------------------------------------------------

    paper_author = extract_author_from_pdf(
        file_path
    )

    # --------------------------------------------------
    # Create database record
    # --------------------------------------------------

    paper = Paper(
        user_id=current_user.id,
        title=paper_title,
        author=paper_author,
        filename=original_filename,
        file_path=file_path,
        description=description,
    )

    db.add(paper)
    db.commit()
    db.refresh(paper)

    # --------------------------------------------------
    # Start heavy PDF processing in the background
    # --------------------------------------------------

    background_tasks.add_task(
        process_paper_in_background,
        paper.id,
    )

    # --------------------------------------------------
    # Return immediately
    # --------------------------------------------------

    return {
        "id": paper.id,
        "title": paper.title,
        "author": paper.author,
        "filename": paper.filename,
        "description": paper.description,
        "uploaded_at": paper.uploaded_at,
    }


@router.get("/")
def list_papers(
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
        .all()
    )

    return [
        {
            "id": paper.id,
            "title": paper.title,
            "author": paper.author,
            "filename": paper.filename,
            "description": paper.description,
            "uploaded_at": paper.uploaded_at,
        }
        for paper in papers
    ]


@router.get("/{paper_id}/file")
def get_paper_file(
    paper_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    paper = (
        db.query(Paper)
        .filter(
            Paper.id == paper_id,
            Paper.user_id == current_user.id,
        )
        .first()
    )

    if paper is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paper not found.",
        )

    return FileResponse(
        path=paper.file_path,
        media_type="application/pdf",
        filename=paper.filename,
    )


@router.get("/{paper_id}/page/{page_number}")
def get_paper_page(
    paper_id: int,
    page_number: int,
    authorization: str | None = Header(
        default=None
    ),
    db: Session = Depends(get_db),
):
    """
    Render one exact PDF page as a PNG image.

    Authentication is handled explicitly here so the
    Authorization header used by the frontend is validated
    directly.
    """

    # --------------------------------------------------
    # Validate Authorization header
    # --------------------------------------------------

    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is missing.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    if not authorization.startswith(
        "Bearer "
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization scheme.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    token = authorization[
        len("Bearer "):
    ].strip()

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bearer token is missing.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # --------------------------------------------------
    # Validate JWT
    # --------------------------------------------------

    user_id = decode_access_token(token)

    # --------------------------------------------------
    # Validate paper ownership
    # --------------------------------------------------

    paper = (
        db.query(Paper)
        .filter(
            Paper.id == paper_id,
            Paper.user_id == user_id,
        )
        .first()
    )

    if paper is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paper not found.",
        )

    # --------------------------------------------------
    # Validate page number
    # --------------------------------------------------

    if page_number < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Page number must be at least 1.",
        )

    # --------------------------------------------------
    # Open PDF and render requested page
    # --------------------------------------------------

    try:
        document = fitz.open(
            paper.file_path
        )

        if page_number > len(document):
            document.close()

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Requested page does not exist.",
            )

        page = document[
            page_number - 1
        ]

        pixmap = page.get_pixmap(
            matrix=fitz.Matrix(2, 2),
            alpha=False,
        )

        image_bytes = pixmap.tobytes(
            "png"
        )

        document.close()

        return Response(
            content=image_bytes,
            media_type="image/png",
        )

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to render the requested PDF page.",
        ) from None


@router.delete("/{paper_id}")
def delete_paper(
    paper_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    paper = (
        db.query(Paper)
        .filter(
            Paper.id == paper_id,
            Paper.user_id == current_user.id,
        )
        .first()
    )

    if paper is None:
        return {
            "message": "Paper not found."
        }

    delete_uploaded_file(
        paper.file_path
    )

    db.delete(paper)
    db.commit()

    return {
        "message": "Paper deleted successfully."
    }


@router.post("/{paper_id}/summary")
def generate_summary(
    paper_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    paper = (
        db.query(Paper)
        .filter(
            Paper.id == paper_id,
            Paper.user_id == current_user.id,
        )
        .first()
    )

    if paper is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paper not found.",
        )

    summaries = generate_paper_summary(
        paper_id=paper.id,
    )

    return {
        "paper_id": paper.id,
        "paper_title": paper.title,
        "summaries": summaries,
    }


@router.post("/compare")
def compare_papers(
    request: PaperCompareRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if (
        request.paper_a_id
        == request.paper_b_id
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please select two different papers.",
        )

    paper_a = (
        db.query(Paper)
        .filter(
            Paper.id == request.paper_a_id,
            Paper.user_id == current_user.id,
        )
        .first()
    )

    paper_b = (
        db.query(Paper)
        .filter(
            Paper.id == request.paper_b_id,
            Paper.user_id == current_user.id,
        )
        .first()
    )

    if paper_a is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paper A not found.",
        )

    if paper_b is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paper B not found.",
        )

    comparison = generate_paper_comparison(
        paper_a_id=paper_a.id,
        paper_b_id=paper_b.id,
    )

    return {
        "paper_a": {
            "id": paper_a.id,
            "title": paper_a.title,
        },
        "paper_b": {
            "id": paper_b.id,
            "title": paper_b.title,
        },
        "comparison": comparison,
    }