# File: app/api/v1/endpoints/training.py

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

# Use specific imports
from app.crud import crud_training_run, crud_project, crud_model, crud_dataset # Need project CRUD to check ownership
from app.schemas.training_run import TrainingRunCreate, TrainingRunPublic
from app.models.user import User # Needed for current_user type hint
from app.api.v1 import deps # Import dependencies module
from app.db.session import get_db


router = APIRouter()

# Note: We mount this router without a prefix in api.py,
# so paths defined here are relative to API_V1_STR

@router.post(
    "/projects/{project_id}/train",
    response_model=TrainingRunPublic,
    status_code=status.HTTP_202_ACCEPTED # 202 Accepted is suitable for queuing tasks
)
def submit_training_job(
    *,
    db: Session = Depends(get_db),
    project_id: int,
    run_in: TrainingRunCreate, # Contains model_id, dataset_id, config_params
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Submit a new training run for a project.

    - Checks if the project exists and belongs to the user.
    - Creates a TrainingRun record in the database with 'queued' status.
    - **Placeholder:** Does NOT actually queue or execute a training task.
    """
    # 1. Verify project existence and ownership
    project = crud_project.get_project(db=db, id=project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    if project.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to train models for this project")
    model = crud_model.get_model(db=db, id=run_in.model_id)
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Model with id {run_in.model_id} not found.",
        )

    dataset = crud_dataset.get_dataset(db=db, id=run_in.dataset_id)
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dataset with id {run_in.dataset_id} not found.",
        )
    # Optional: Check if dataset is public or owned by user/project
    # if not dataset.is_public and dataset.user_id != current_user.id:
    #    raise HTTPException(status_code=403, detail="Dataset not accessible")
    # --- End Validation ---


    # 2. Create the TrainingRun record in the DB (Now we know IDs are likely valid)
    training_run = crud_training_run.create_training_run(
        db=db, run_in=run_in, project_id=project_id, user_id=current_user.id
    )
    # Optional TODO: Verify that model_id and dataset_id exist and are associated with the project

    # 2. Create the TrainingRun record in the DB
    training_run = crud_training_run.create_training_run(
        db=db, run_in=run_in, project_id=project_id, user_id=current_user.id
    )

    print(f"--- Placeholder: Training job {training_run.id} created with status 'queued'. ---")
    print(f"--- Actual queuing/execution to be implemented later. ---")

    return training_run


@router.get("/training/jobs/{job_id}", response_model=TrainingRunPublic)
def get_training_job_status(
    *,
    db: Session = Depends(get_db),
    job_id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get the status and details of a specific training job (TrainingRun record).
    """
    training_run = crud_training_run.get_training_run(db=db, id=job_id)

    if not training_run:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Training job not found")

    # --- Authorization Check ---
    # Check if the user requesting the job status is the one who initiated it
    # (Alternative: check if user owns the associated project: training_run.project.user_id)
    if training_run.user_id != current_user.id:
         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this training job")
    # --- End Authorization Check ---

    return training_run