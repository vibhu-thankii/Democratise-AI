# File: app/models/links.py

from typing import Optional
from sqlmodel import SQLModel, Field
# No other imports from app.* should be needed here

# Link table for the many-to-many relationship between Project and Model
# This table holds pairs of project IDs and model IDs that are linked.
class ProjectModelLink(SQLModel, table=True):
    project_id: Optional[int] = Field(
        default=None,
        foreign_key="project.id", # Foreign key to the 'id' column in the 'project' table
        primary_key=True          # Part of the composite primary key
    )
    model_id: Optional[int] = Field(
        default=None,
        foreign_key="model.id",   # Foreign key to the 'id' column in the 'model' table
        primary_key=True          # Part of the composite primary key
    )

# Link table for the many-to-many relationship between Project and Dataset
# This table holds pairs of project IDs and dataset IDs that are linked.
class ProjectDatasetLink(SQLModel, table=True):
    project_id: Optional[int] = Field(
        default=None,
        foreign_key="project.id", # Foreign key to the 'id' column in the 'project' table
        primary_key=True          # Part of the composite primary key
    )
    dataset_id: Optional[int] = Field(
        default=None,
        foreign_key="dataset.id", # Foreign key to the 'id' column in the 'dataset' table
        primary_key=True          # Part of the composite primary key
    )