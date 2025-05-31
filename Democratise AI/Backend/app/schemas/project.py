from datetime import datetime
from typing import List, Optional

from sqlmodel import Field, SQLModel
from app.schemas.model import ModelPublic
from app.schemas.dataset import DatasetPublic
from app.schemas.training_run import TrainingRunPublic

# Shared properties
class ProjectBase(SQLModel):
    name: str = Field(index=True)
    description: Optional[str] = None

# Properties to receive on project creation
class ProjectCreate(ProjectBase):
    pass # Inherits name and description

# Properties to receive on project update
class ProjectUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    # Add fields for associating models/datasets later if needed

# Properties shared by models stored in DB
# class ProjectInDBBase(ProjectBase):
#     id: int
#     user_id: int
#     status: str
#     created_at: datetime
#     updated_at: datetime
#     class Config:
#         orm_mode = True

# Properties to return to client
class ProjectPublic(ProjectBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    updated_at: datetime
    models: List[ModelPublic] = []
    datasets: List[DatasetPublic] = []
    training_runs: List[TrainingRunPublic] = []
    # Optionally include nested owner info
    # owner: Optional[UserPublic] = None # Requires eager loading or separate query

# Properties to return when listing multiple projects (maybe less detail)
class ProjectPublicList(SQLModel):
    items: List[ProjectPublic]
    total: int # For pagination
