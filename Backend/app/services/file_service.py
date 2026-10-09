from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status


MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB
ALLOWED_CONTENT_TYPE = "application/pdf"

BASE_DIR = Path(__file__).resolve().parents[2]
UPLOAD_DIR = BASE_DIR / "uploads"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


async def save_uploaded_pdf(file: UploadFile) -> tuple[str, str]:
    if file.content_type != ALLOWED_CONTENT_TYPE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed.",
        )

    original_filename = file.filename or "uploaded.pdf"

    if not original_filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed.",
        )

    file_content = await file.read()

    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size must not exceed 50 MB.",
        )

    unique_filename = f"{uuid4().hex}.pdf"
    file_path = UPLOAD_DIR / unique_filename

    file_path.write_bytes(file_content)

    return original_filename, str(file_path)


def delete_uploaded_file(file_path: str) -> None:
    path = Path(file_path)

    if path.exists() and path.is_file():
        path.unlink()