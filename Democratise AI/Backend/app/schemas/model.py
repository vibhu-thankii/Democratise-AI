# File: app/schemas/model.py

from typing import Optional
from sqlmodel import SQLModel, Field # Or from pydantic import BaseModel, Field
from datetime import datetime

# Shared properties
class ModelBase(SQLModel):
    name: str = Field(index=True)
    description: Optional[str] = None
    source_type: str = Field(index=True)
    source_identifier: str = Field(index=True)
    task_type: Optional[str] = Field(default=None, index=True)
    framework: Optional[str] = Field(default=None, index=True)

# Properties to receive via API on creation (if API allows creating models)
# For now, let's assume models are primarily pre-defined or added via other means
# class ModelCreate(ModelBase):
#     pass

# Properties to receive via API on update (if API allows updating models)
# class ModelUpdate(SQLModel): # Using SQLModel/BaseModel directly is fine
#     name: Optional[str] = None
#     description: Optional[str] = None
#     task_type: Optional[str] = None
#     framework: Optional[str] = None

# Properties to return to client (public representation)
class ModelPublic(ModelBase):
    id: int
    created_at: datetime
    updated_at: datetime
    # Add other fields safe for public exposure if needed

# You might add more specific schemas later, e.g., ModelPublicWithDetails