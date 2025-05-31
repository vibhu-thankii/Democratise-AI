# File: app/schemas/token.py

from typing import Optional
from pydantic import BaseModel # Using BaseModel as this doesn't directly map to a DB table

class Token(BaseModel):
    """
    Schema for the JWT access token response.
    """
    access_token: str
    token_type: str # Typically "bearer"

class TokenData(BaseModel):
    """
    Schema for the data decoded from a JWT (the payload).
    'sub' usually holds the username/email.
    """
    sub: Optional[str] = None