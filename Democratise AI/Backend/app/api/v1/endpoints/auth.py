# File: app/api/v1/endpoints/auth.py

from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from app import crud, models, schemas # Add models import
from app.api.v1 import deps # <<< Import the new deps module
from app.core import security
from app.core.config import settings
from app.db.session import get_db

router = APIRouter()

# ... /signup endpoint (keep as is) ...
@router.post("/signup", response_model=schemas.UserPublic, status_code=status.HTTP_201_CREATED)
def signup(
    *,
    db: Session = Depends(get_db),
    user_in: schemas.UserCreate,
) -> Any:
    # ... signup logic ...
    user = crud.user.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )
    user = crud.user.create_user(db=db, user_in=user_in)
    return user


# ... /login endpoint (keep as is) ...
@router.post("/login", response_model=schemas.Token)
def login_for_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    # ... login logic ...
    user = crud.user.authenticate_user(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # if not user.is_active:
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=user.email, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# --- ADD THE /me ENDPOINT ---
@router.get("/me", response_model=schemas.UserPublic)
def read_users_me(
    current_user: models.user = Depends(deps.get_current_user),
) -> Any:
    """
    Fetch the current logged-in user based on the provided token.
    """
    # The `deps.get_current_user` dependency handles token validation
    # and fetching the user object from the database.
    # If the token is invalid or the user doesn't exist, it raises
    # an HTTPException before this function body is even executed.
    return current_user
# --- END ADD THE /me ENDPOINT ---