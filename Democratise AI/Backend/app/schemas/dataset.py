# File: app/schemas/dataset.py

from typing import Optional
from pydantic import BaseModel # Using BaseModel for non-table schemas
from sqlmodel import SQLModel, Field
from datetime import datetime

# Import UserPublic if you want to show owner details
from app.schemas.user import UserPublic

# Shared properties for reading/displaying
class DatasetBase(SQLModel):
    name: str = Field(index=True)
    description: Optional[str] = None
    is_public: bool = Field(default=False)
    # Maybe include type, size etc. here if common
    storage_type: Optional[str] = None # Info about where it's stored might be public
    file_size_bytes: Optional[int] = None


# Metadata provided during dataset upload/creation POST request
# Note: Doesn't include fields set by the backend like id, user_id, storage_path, timestamps
class DatasetCreate(BaseModel):
    name: str
    description: Optional[str] = None
    is_public: bool = False
    # The actual file upload will likely be handled separately (e.g., FastAPI's UploadFile)
    # This schema represents the metadata sent along with the file.


# Properties to receive via API on update (if API allows updating metadata)
class DatasetUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None


# Properties to return to client (public representation)
class DatasetPublic(DatasetBase):
    id: int
    user_id: Optional[int] = None # ID of the owner, if any
    # storage_path: str # Maybe exclude exact storage path from public view?
    created_at: datetime
    updated_at: datetime
    # Optional: Include owner info (requires joining/loading in the endpoint)
    # owner: Optional[UserPublic] = None