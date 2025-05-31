# File: app/models/model.py

from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

from app.utils import aware_utcnow # Use shared timestamp utility
# --- Need to import the link model for Relationship definition ---
from app.models.links import ProjectModelLink

# Import Project and TrainingRun for type hints only
if TYPE_CHECKING:
    from app.models.project import Project
    from app.models.training_run import TrainingRun
    # Note: ProjectModelLink doesn't strictly need re-importing here,
    # but User might be needed if creator_id/owner is uncommented.
    # from app.models.user import User


# --- Define the Model class ---
class Model(SQLModel, table=True):
    # --- Core Fields ---
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: Optional[str] = Field(default=None)
    source_type: str = Field(index=True) # e.g., 'huggingface', 'user_uploaded', 'platform'
    source_identifier: str = Field(index=True) # e.g., 'bert-base-uncased', internal_id, path
    task_type: Optional[str] = Field(default=None, index=True) # e.g., 'text-classification'
    framework: Optional[str] = Field(default=None, index=True) # e.g., 'pytorch', 'tensorflow'

    # --- Optional Creator/Owner fields (Uncomment if needed) ---
    # creator_id: Optional[int] = Field(default=None, foreign_key="user.id", index=True)
    # owner: Optional["User"] = Relationship() # Define back_populates in User model if used

    # --- Timestamps ---
    created_at: datetime = Field(default_factory=aware_utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=aware_utcnow, nullable=False, sa_column_kwargs={"onupdate": aware_utcnow})

    # --- Relationships ---
    # Many-to-Many relationship with Project through the link table
    # `link_model=ProjectModelLink` requires ProjectModelLink to be imported above
    projects: List["Project"] = Relationship(back_populates="models", link_model=ProjectModelLink)

    # One-to-Many relationship with TrainingRun
    training_runs: List["TrainingRun"] = Relationship(back_populates="model")