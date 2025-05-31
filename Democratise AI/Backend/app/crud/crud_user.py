# File: app/crud/crud_user.py

from typing import Optional
from sqlmodel import Session, select # Use select for SQLModel queries

from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdateProfile 
from typing import Any, Union, Dict


def get_user_by_email(db: Session, *, email: str) -> Optional[User]:
    """
    Retrieves a user by their email address.

    Args:
        db: The database session.
        email: The email address to search for.

    Returns:
        The User object if found, otherwise None.
    """
    statement = select(User).where(User.email == email)
    # Use session.exec() for SQLModel, which returns an iterable Result
    # .first() gets the first result or None
    user = db.exec(statement).first()
    return user

def create_user(db: Session, *, user_in: UserCreate) -> User:
    """
    Creates a new user in the database.

    Args:
        db: The database session.
        user_in: User creation data (from UserCreate schema).

    Returns:
        The created User object.
    """
    hashed_password = get_password_hash(user_in.password)
    # Create a User model instance from the schema data
    # Exclude the plain password, add the hashed version
    user_data = user_in.model_dump(exclude={"password"}) # Use model_dump in Pydantic v2
    db_user = User(**user_data, password_hash=hashed_password)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, *, email: str, password: str) -> Optional[User]:
    """
    Authenticates a user based on email and password.

    Args:
        db: The database session.
        email: User's email.
        password: User's plain password.

    Returns:
        The authenticated User object if credentials are valid, otherwise None.
    """
    user = get_user_by_email(db, email=email)
    if not user:
        return None # User not found
    if not verify_password(password, user.password_hash):
        return None # Incorrect password
    return user

# Add update_user function later for settings page
# def update_user(...): ...

def update_user(
    *, db: Session, db_obj: User, obj_in: Union[UserUpdateProfile, Dict[str, Any]]
) -> User:
    """
    Update user profile information (name, email).
    Does NOT handle password updates.

    Args:
        db: The database session.
        db_obj: The current User database object.
        obj_in: A UserUpdateProfile schema or dict with fields to update.

    Returns:
        The updated User object.
    """
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        # Exclude unset ensures we only update fields explicitly provided
        update_data = obj_in.model_dump(exclude_unset=True)

    # Extra check: If email is being updated, ensure it's not taken by another user
    if "email" in update_data and update_data["email"] != db_obj.email:
        existing_user = get_user_by_email(db, email=update_data["email"])
        if existing_user and existing_user.id != db_obj.id:
            # Raise an error or handle appropriately if email is taken
            # For simplicity here, we might let the endpoint handle raising HTTPException
            # Or we could raise a specific exception here. Let's assume endpoint handles.
            # print(f"Warning: Email {update_data['email']} already taken by user {existing_user.id}")
            # Alternatively, raise ValueError("Email already registered by another user.")
            pass # Let endpoint handle potential DB unique constraint error or check first

    # Update model fields
    for field, value in update_data.items():
        # Ensure we don't accidentally update forbidden fields if input is dict
        if field in UserUpdateProfile.model_fields:
             setattr(db_obj, field, value)

    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
