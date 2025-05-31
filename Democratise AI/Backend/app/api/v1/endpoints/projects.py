# File: app/api/v1/endpoints/projects.py

from typing import List, Any

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session

from app import crud, models, schemas # Assuming __init__.py setup for these
from app.api.v1 import deps # Import dependencies module
from app.db.session import get_db # Could also get from deps if preferred

router = APIRouter()

@router.post("/", response_model=schemas.ProjectPublic, status_code=status.HTTP_201_CREATED)
def create_new_project(
    *,
    db: Session = Depends(get_db),
    project_in: schemas.ProjectCreate,
    current_user: models.user = Depends(deps.get_current_user),
) -> Any:
    """
    Create a new project owned by the current user.
    """
    project = crud.project.create_project(db=db, project_in=project_in, user_id=current_user.id)
    return project

@router.get("/", response_model=List[schemas.ProjectPublic])
def read_projects(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Number of projects to skip"),
    limit: int = Query(100, ge=1, le=200, description="Maximum number of projects to return"),
    current_user: models.user = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve projects owned by the current user, with pagination.
    """
    projects = crud.project.get_multi_by_owner(
        db=db, user_id=current_user.id, skip=skip, limit=limit
    )
    return projects

@router.get("/{project_id}", response_model=schemas.ProjectPublic)
def read_project(
    *,
    db: Session = Depends(get_db),
    project_id: int,
    current_user: models.user = Depends(deps.get_current_user),
) -> Any:
    """
    Get a specific project by ID. User must be the owner.
    """
    project = crud.project.get_project(db=db, id=project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    # --- Authorization Check ---
    if project.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this project")
    # --- End Authorization Check ---
    return project

@router.put("/{project_id}", response_model=schemas.ProjectPublic)
def update_existing_project(
    *,
    db: Session = Depends(get_db),
    project_id: int,
    project_in: schemas.ProjectUpdate,
    current_user: models.user = Depends(deps.get_current_user),
) -> Any:
    """
    Update a project. User must be the owner.
    Only updates fields provided in the request body.
    """
    db_project = crud.project.get_project(db=db, id=project_id)
    if not db_project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    # --- Authorization Check ---
    if db_project.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this project")
    # --- End Authorization Check ---

    updated_project = crud.project.update_project(db=db, db_obj=db_project, obj_in=project_in)
    return updated_project

@router.delete("/{project_id}", response_model=schemas.ProjectPublic)
def delete_project(
    *,
    db: Session = Depends(get_db),
    project_id: int,
    current_user: models.user = Depends(deps.get_current_user),
) -> Any:
    """
    Delete a project. User must be the owner.
    Returns the deleted project data.
    """
    db_project = crud.project.get_project(db=db, id=project_id) # Check existence and ownership first
    if not db_project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    # --- Authorization Check ---
    if db_project.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this project")
    # --- End Authorization Check ---

    # Call the remove function which handles the actual deletion
    deleted_project = crud.project.remove_project(db=db, id=project_id)
    # The remove_project function already fetched the object, so we can return it
    # If remove_project returned None unexpectedly (e.g., race condition), handle it
    if not deleted_project:
         # This shouldn't happen if the initial check passed, but good practice
         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found during deletion")

    return deleted_project # Return the data of the deleted object