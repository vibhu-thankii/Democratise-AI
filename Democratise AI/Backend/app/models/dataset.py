# File: app/models/dataset.py

from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from app.models.links import ProjectDatasetLink
from app.utils import aware_utcnow

# Import link model, Project, and User models for type hints only
if TYPE_CHECKING:
    from app.models.user import User
    from app.models.project import Project
    from app.models.links import ProjectDatasetLink
    from app.models.training_run import TrainingRun # Added for relationship

class Dataset(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: Optional[str] = Field(default=None)

    # Foreign key to user (nullable if dataset can be public/unowned)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", index=True)

    storage_type: str # e.g., 's3', 'gcs', 'azure_blob', 'local'
    storage_path: str # e.g., bucket/path/to/data or local/path
    file_size_bytes: Optional[int] = None # Use BIGINT in DB if necessary via sa_column
    is_public: bool = Field(default=False, index=True)

    created_at: datetime = Field(default_factory=aware_utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=aware_utcnow, nullable=False, sa_column_kwargs={"onupdate": aware_utcnow})

    # Relationship back to the owner (User) - Many Datasets to One User
    owner: Optional["User"] = Relationship(back_populates="datasets")

    # Many-to-Many relationship with Project through the link table
    projects: List["Project"] = Relationship(back_populates="datasets", link_model=ProjectDatasetLink)

    # One-to-Many relationship with TrainingRun
    training_runs: List["TrainingRun"] = Relationship(back_populates="dataset")