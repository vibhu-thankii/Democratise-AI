# File: app/core/security.py

from datetime import datetime, timedelta, timezone
from typing import Any, Union, Optional

from jose import jwt, JWTError
from passlib.context import CryptContext

from app.core.config import settings # Import settings for JWT config

# --- Password Hashing ---

# Configure passlib context
# bcrypt is a strong hashing algorithm
# "auto" will use bcrypt for new hashes and verify others if needed
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain password against a stored hash.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Hashes a plain password using bcrypt.
    """
    return pwd_context.hash(password)


# --- JSON Web Tokens (JWT) ---

ALGORITHM = settings.ALGORITHM
JWT_SECRET_KEY = settings.SECRET_KEY # Should be kept secret!

def create_access_token(
    subject: Union[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    """
    Creates a JWT access token.

    Args:
        subject: The subject of the token (e.g., user email or ID).
        expires_delta: Optional timedelta for token expiry. If None, uses default from settings.

    Returns:
        The encoded JWT access token string.
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Note: We will add the dependency function to decode tokens (`get_current_user`)
# later in a separate deps.py file, as it involves more setup (OAuth2 scheme, exceptions).