import os

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from google.auth.transport import requests
from google.oauth2 import id_token
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.auth.jwt import create_access_token, get_current_user
from app.auth.schemas import (
    CurrentUserResponse,
    GoogleLoginRequest,
    LoginRequest,
    RegisterRequest,
    RegisterResponse,
    TokenResponse,
)
from app.auth.security import hash_password, verify_password
from app.database.database import SessionLocal
from app.models import User


router = APIRouter()


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(registration: RegisterRequest) -> User:
    email = str(registration.email).lower()

    with SessionLocal() as session:
        existing_user = session.scalar(
            select(User.id).where(User.email == email)
        )

        if existing_user is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email is already registered",
            )

        user = User(
            name=registration.name,
            email=email,
            password_hash=hash_password(registration.password),
        )

        session.add(user)

        try:
            session.commit()
        except IntegrityError:
            session.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email is already registered",
            ) from None

        session.refresh(user)

        return user


@router.post("/login", response_model=TokenResponse)
def login_user(credentials: LoginRequest) -> TokenResponse:
    """
    Normal JSON login used by the ResearchLane frontend.
    """
    email = str(credentials.email).lower()

    with SessionLocal() as session:
        user = session.scalar(
            select(User).where(User.email == email)
        )

        if user is None or not verify_password(
            credentials.password,
            user.password_hash,
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token = create_access_token(user.id)

    return TokenResponse(access_token=access_token)


@router.post(
    "/swagger-login",
    response_model=TokenResponse,
)
def swagger_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> TokenResponse:
    """
    OAuth2-compatible login used by Swagger UI.
    The OAuth2 'username' field contains the user's email.
    """
    email = form_data.username.lower()

    with SessionLocal() as session:
        user = session.scalar(
            select(User).where(User.email == email)
        )

        if user is None or not verify_password(
            form_data.password,
            user.password_hash,
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token = create_access_token(user.id)

    return TokenResponse(access_token=access_token)


@router.get(
    "/me",
    response_model=CurrentUserResponse,
)
def get_me(
    current_user: User = Depends(get_current_user),
) -> User:
    return current_user


@router.post(
    "/google",
    response_model=TokenResponse,
)
def google_login(
    credentials: GoogleLoginRequest,
) -> TokenResponse:
    try:
        google_client_id = os.getenv(
            "NEXT_PUBLIC_GOOGLE_CLIENT_ID"
        )

        if not google_client_id:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Google Client ID is not configured",
            )

        idinfo = id_token.verify_oauth2_token(
            credentials.credential,
            requests.Request(),
            google_client_id,
        )

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google credential",
        ) from None

    google_email = idinfo.get("email")
    google_name = idinfo.get("name") or "Google User"

    if not google_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account email is missing",
        )

    email = google_email.lower()

    with SessionLocal() as session:
        user = session.scalar(
            select(User).where(User.email == email)
        )

        if user is None:
            user = User(
                name=google_name,
                email=email,
                password_hash=hash_password("google-auth-user"),
            )

            session.add(user)
            session.commit()
            session.refresh(user)

        access_token = create_access_token(user.id)

    return TokenResponse(access_token=access_token)