from datetime import datetime
from typing import List, Optional

import pytz  # For timezone-aware datetimes
from sqlmodel import Field, Relationship, SQLModel

from app.models.project import Project  # Assuming you have a Project model defined
from app.utils import aware_utcnow # <<< Import from new location
from typing import Optional, List, TYPE_CHECKING
from app.models import project # May not be strictly needed if project imports user, but can help
from app.models import dataset
from app.models import training_run

if TYPE_CHECKING:
    from app.models.project import Project
    from app.models.dataset import Dataset # <<< ADD
    from app.models.training_run import TrainingRun # <<< ADD
    from app.models import project # May not be strictly needed if project imports user, but can help
    from app.models import dataset
    from app.models import training_run

# Function to get current time in UTC

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    email: str = Field(unique=True, index=True, max_length=255)
    password_hash: str = Field(max_length=255)

    is_active: bool = Field(default=True) # Added for potential activation/deactivation logic
    is_superuser: bool = Field(default=False) # Added for potential admin roles

    created_at: datetime = Field(default_factory=aware_utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=aware_utcnow, nullable=False, sa_column_kwargs={"onupdate": aware_utcnow})

    # Define the relationship to projects (one-to-many)
    # `back_populates` links this relationship to the one defined in the Project model
    projects: List["Project"] = Relationship(back_populates="owner")
    datasets: List["Dataset"] = Relationship(back_populates="owner") # <<< ADD
    training_runs: List["TrainingRun"] = Relationship(back_populates="user") # <<< ADD
    # Add relationships for datasets, training_runs etc. later
    # datasets: List["Dataset"] = Relationship(back_populates="owner")
    # training_runs: List["TrainingRun"] = Relationship(back_populates="user")

    class Config:
        # Example: Define the table name explicitly if needed
        # table_name = "users_table"
        pass
