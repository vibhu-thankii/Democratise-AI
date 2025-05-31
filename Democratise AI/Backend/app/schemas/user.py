# File: app/schemas/user.py

from sqlmodel import SQLModel, Field
from pydantic import EmailStr, validator, field_validator, BaseModel # Ensure BaseModel is imported if not using SQLModel for all
from typing import Optional

# --- Keep Existing Schemas ---
class UserBase(SQLModel):
    name: Optional[str] = None # Make name optional here too
    email: EmailStr = Field(unique=True, index=True)
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False

class UserCreate(UserBase):
    password: str = Field(min_length=8)

class UserPublic(UserBase):
    id: int

# --- Add/Update Specific Schemas for Settings ---

class UserUpdateProfile(BaseModel): # Using BaseModel as it doesn't map to DB directly
    """Schema for updating user profile information (name, email)."""
    name: Optional[str] = None
    email: Optional[EmailStr] = None

    # Optional: Add validation if needed, e.g., ensure at least one field is provided

class UserUpdatePassword(BaseModel):
    """Schema for updating user password."""
    current_password: str
    new_password: str = Field(min_length=8) # Add min length validation

    @field_validator('new_password')
    @classmethod
    def password_complexity(cls, v: str) -> str:
        # Add more complex password rules here if desired
        # e.g., check for uppercase, numbers, symbols
        if len(v) < 8: # Re-check just in case Field validation bypassed somehow
            raise ValueError('Password must be at least 8 characters long')
        # if not any(c.isupper() for c in v):
        #     raise ValueError('Password must contain an uppercase letter')
        # if not any(c.isdigit() for c in v):
        #     raise ValueError('Password must contain a digit')
        return v