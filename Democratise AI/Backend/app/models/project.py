from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

from app.utils import aware_utcnow # <<< Import from new location

from typing import Optional, List, TYPE_CHECKING
from app.models.links import ProjectModelLink, ProjectDatasetLink
from app.models import model # Import the module itself
from app.models import dataset # Import the module itself
from app.models import training_run # Import the module itself

# Import link models and other related models
if TYPE_CHECKING:
    from app.models.user import User
    from app.models.model import Model # <<< ADD
    from app.models.dataset import Dataset # <<< ADD
    from app.models.training_run import TrainingRun # <<< ADD
    from app.models.links import ProjectModelLink # <<< ADD
    from app.models.links import ProjectDatasetLink # <<< ADD
    from app.models.model import Model
    from app.models.dataset import Dataset
    from app.models.training_run import TrainingRun

class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: Optional[str] = Field(default=None)
    status: str = Field(default="active", index=True) # e.g., 'active', 'archived'

    created_at: datetime = Field(default_factory=aware_utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=aware_utcnow, nullable=False, sa_column_kwargs={"onupdate": aware_utcnow})

    # Foreign Key to the User table
    user_id: int = Field(foreign_key="user.id", nullable=False, index=True)

    # Define the relationship back to the user (many-to-one)
    owner: "User" = Relationship(back_populates="projects")
    models: List["Model"] = Relationship(back_populates="projects", link_model=ProjectModelLink) # <<< ADD M2M
    datasets: List["Dataset"] = Relationship(back_populates="projects", link_model=ProjectDatasetLink) # <<< ADD M2M
    training_runs: List["TrainingRun"] = Relationship(back_populates="project") # <<< ADD O2M

    # Define relationships for associated models, datasets, training runs later
    # (These might be many-to-many requiring association tables/models)
    # models: List["Model"] = Relationship(back_populates="projects", link_model=ProjectModelLink)
    # datasets: List["Dataset"] = Relationship(back_populates="projects", link_model=ProjectDatasetLink)
    # training_runs: List["TrainingRun"] = Relationship(back_populates="project")
