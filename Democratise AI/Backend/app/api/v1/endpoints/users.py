# File: app/api/v1/endpoints/users.py

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

# --- MODIFIED IMPORTS ---
# from app import crud, models, schemas # Remove this general import

# Import specific CRUD module/functions
from app.crud import crud_user
# Import specific Models needed
from app.models.user import User
# Import specific Schemas needed
from app.schemas.user import UserPublic, UserUpdateProfile, UserUpdatePassword
from app.schemas.msg import Msg

from app.api.v1 import deps
from app.core import security
# Settings might not be needed directly here, but keep if used elsewhere
# from app.core.config import settings
from app.db.session import get_db
# --- END MODIFIED IMPORTS ---

router = APIRouter()

# --- Use directly imported Schema name ---
@router.put("/profile", response_model=UserPublic)
def update_user_profile(
    *,
    db: Session = Depends(get_db),
    user_in: UserUpdateProfile, # Use direct schema name
    current_user: User = Depends(deps.get_current_user), # Use direct model name
) -> Any:
    """
    Update current user's profile (name, email).
    """
    if user_in.email and user_in.email != current_user.email:
        # Use direct crud module name
        existing_user = crud_user.get_user_by_email(db, email=user_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email address is already registered.",
            )

    # Use direct crud module name
    updated_user = crud_user.update_user(db=db, db_obj=current_user, obj_in=user_in)
    return updated_user


# --- Use directly imported Schema name ---
@router.put("/password", response_model=Msg)
def update_user_password(
    *,
    db: Session = Depends(get_db),
    password_in: UserUpdatePassword, # Use direct schema name
    current_user: User = Depends(deps.get_current_user), # Use direct model name
) -> Any:
    """
    Update current user's password.
    """
    if not security.verify_password(password_in.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password",
        )
    hashed_password = security.get_password_hash(password_in.new_password)
    current_user.password_hash = hashed_password
    db.add(current_user)
    db.commit()
    return {"message": "Password updated successfully"}