from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.auth import router as auth_router
from app.api.chat import router as chat_router
from app.api.dashboard import router as dashboard_router
from app.api.papers import router as papers_router
from app.database.database import SessionLocal

app = FastAPI(title="ResearchLane API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(dashboard_router)
app.include_router(papers_router)
app.include_router(chat_router)

@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "ResearchLane API is running"}


@app.get("/health/database")
def check_database_connection() -> dict[str, str]:
    with SessionLocal() as session:
        session.execute(text("SELECT 1"))

    return {"database": "connected"}
