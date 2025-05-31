# File: app/schemas/training_run.py

from typing import Optional, Dict, Any
from sqlmodel import SQLModel, Field # Or 
from pydantic import BaseModel, Field
from datetime import datetime

# Shared base properties
class TrainingRunBase(SQLModel):
    status: str = Field(index=True)
    config_params: Optional[Dict[str, Any]] = None
    metrics: Optional[Dict[str, Any]] = None
    logs_location: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


# Properties received when initiating a training run via API
# This defines the expected payload for POST /projects/{project_id}/train
class TrainingRunCreate(BaseModel): # Doesn't map to DB table directly
    model_id: int
    dataset_id: int
    # Include hyperparameters or config directly
    config_params: Dict[str, Any] # e.g., {"learning_rate": 0.001, "epochs": 10}


# Properties potentially allowed in an update (e.g., manually marking as cancelled - unlikely needed now)
# class TrainingRunUpdate(BaseModel):
#     status: Optional[str] = None


# Properties to return to client
class TrainingRunPublic(TrainingRunBase):
    id: int
    project_id: int
    user_id: int # User who initiated
    model_id: int
    dataset_id: int
    created_at: datetime
    updated_at: datetime
    # You might want to add nested Project/Model/Dataset info here later
    # project: Optional[ProjectPublic] = None # Example