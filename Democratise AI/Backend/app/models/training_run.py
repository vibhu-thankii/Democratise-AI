# File: app/models/training_run.py

from typing import Optional, List, Dict, Any, TYPE_CHECKING
from datetime import datetime
# Import JSON type from SQLAlchemy for JSONB support
from sqlalchemy import JSON, Column
from sqlmodel import SQLModel, Field, Relationship

from app.utils import aware_utcnow

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.project import Project
    from app.models.model import Model
    from app.models.dataset import Dataset

class TrainingRun(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    # Foreign keys
    project_id: int = Field(foreign_key="project.id", index=True)
    user_id: int = Field(foreign_key="user.id", index=True) # User who initiated
    model_id: int = Field(foreign_key="model.id", index=True)
    dataset_id: int = Field(foreign_key="dataset.id", index=True)

    status: str = Field(index=True) # e.g., 'queued', 'starting', 'running', 'completed', 'failed'

    # Store configuration and metrics as JSON(B) in the database
    # Use sa_column=Column(JSON) to map dict/list to JSON/JSONB type
    config_params: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    metrics: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))

    logs_location: Optional[str] = None # e.g., path to logs file in cloud storage

    started_at: Optional[datetime] = Field(default=None)
    completed_at: Optional[datetime] = Field(default=None)

    created_at: datetime = Field(default_factory=aware_utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=aware_utcnow, nullable=False, sa_column_kwargs={"onupdate": aware_utcnow})

    # Relationships back to parent objects (Many Training Runs to One X)
    project: "Project" = Relationship(back_populates="training_runs")
    user: "User" = Relationship(back_populates="training_runs")
    model: "Model" = Relationship(back_populates="training_runs")
    dataset: "Dataset" = Relationship(back_populates="training_runs")