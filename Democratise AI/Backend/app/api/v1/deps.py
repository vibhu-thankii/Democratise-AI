# File: app/api/v1/deps.py

from typing import Generator, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlmodel import Session

from app import crud # Assuming crud/__init__.py setup
from app import models # Assuming models/__init__.py setup (optional, can import directly)
from app import schemas # Assuming schemas/__init__.py setup
from app.core import security
from app.core.config import settings
from app.db.session import SessionLocal, get_db # get_db is likely sufficient

# OAuth2PasswordBearer scheme pointing to the login endpoint
# This tells FastAPI where clients should go to get the token.
reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> models.user:
    """
    Dependency to get the current user based on the JWT token.

    Raises HTTPException 401/403 if token is invalid or user not found/inactive.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        # Extract email (or user ID) from the 'sub' claim
        email: Optional[str] = payload.get("sub")
        if email is None:
            raise credentials_exception # Subject missing in token

        # Optional: Validate payload structure using Pydantic schema
        # token_data = schemas.TokenData(sub=email)

    except JWTError:
        # Catches invalid signature, expired token, etc.
        raise credentials_exception from None # Use 'from None' to avoid chaining original exception
    except ValidationError:
        # If using TokenData schema validation above and it fails
        raise credentials_exception from None

    # Fetch user from database
    user = crud.user.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception # User associated with token not found

    # Optional: Check if user is active
    # if not user.is_active:
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")

    return user

# Optional: Dependency for superuser check (if needed later)
# def get_current_active_superuser(
#     current_user: models.User = Depends(get_current_user),
# ) -> models.User:
#     if not crud.user.is_superuser(current_user): # Assumes is_superuser function in crud
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN, detail="The user doesn't have enough privileges"
#         )
#     return current_user