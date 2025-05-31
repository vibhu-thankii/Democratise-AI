# File: app/crud/crud_training_run.py

from typing import List, Optional

from sqlmodel import Session, select

from app.models.training_run import TrainingRun # The DB model
from app.schemas.training_run import TrainingRunCreate # The input schema

def get_training_run(*, db: Session, id: int) -> Optional[TrainingRun]:
    """
    Retrieve a single training run by its ID.

    Args:
        db: The database session.
        id: The ID of the training run to retrieve.

    Returns:
        The TrainingRun object if found, otherwise None.
    """
    run = db.get(TrainingRun, id)
    return run

def create_training_run(
    *, db: Session, run_in: TrainingRunCreate, project_id: int, user_id: int
) -> TrainingRun:
    """
    Creates a database record for a new training run, initially in 'queued' status.

    Args:
        db: The database session.
        run_in: Training run creation data (model_id, dataset_id, config_params).
        project_id: The ID of the associated project.
        user_id: The ID of the user initiating the run.

    Returns:
        The created TrainingRun database object.
    """
    # Extract data from the input schema
    run_data = run_in.model_dump()

    # Create the TrainingRun model instance
    db_run = TrainingRun(
        **run_data, # Includes model_id, dataset_id, config_params
        project_id=project_id,
        user_id=user_id,
        status="queued", # Set initial status
        # Other fields like metrics, logs_location, started/completed_at are initially None/empty
    )
    db.add(db_run)
    db.commit()
    db.refresh(db_run)
    return db_run

# Optional: Function to get runs for a specific project
# def get_multi_by_project(
#     db: Session, *, project_id: int, skip: int = 0, limit: int = 100
# ) -> List[TrainingRun]:
#     statement = (
#         select(TrainingRun)
#         .where(TrainingRun.project_id == project_id)
#         .offset(skip)
#         .limit(limit)
#         .order_by(TrainingRun.created_at.desc())
#     )
#     runs = db.exec(statement).all()
#     return runs