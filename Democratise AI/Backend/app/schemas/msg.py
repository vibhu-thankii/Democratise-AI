# File: app/schemas/msg.py

from pydantic import BaseModel

class Msg(BaseModel):
    """Simple message response schema."""
    message: str