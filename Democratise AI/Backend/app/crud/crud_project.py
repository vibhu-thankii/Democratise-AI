# File: app/crud/crud_project.py

from typing import List, Optional, Union, Dict, Any

from sqlmodel import Session, select
from app.models.project import Project # The DB model
from app.schemas.project import ProjectCreate, ProjectUpdate # The Pydantic schemas

def create_project(*, db: Session, project_in: ProjectCreate, user_id: int) -> Project:
    """
    Create a new project in the database, associated with a user.

    Args:
        db: The database session.
        project_in: Project creation data from the ProjectCreate schema.
        user_id: The ID of the user creating the project.

    Returns:
        The newly created Project object.
    """
    # Convert schema to dict, ready for model creation
    project_data = project_in.model_dump()
    # Create the Project model instance, adding the owner's user_id
    db_project = Project(**project_data, user_id=user_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_project(*, db: Session, id: int) -> Optional[Project]:
    """
    Retrieve a single project by its ID.

    Args:
        db: The database session.
        id: The ID of the project to retrieve.

    Returns:
        The Project object if found, otherwise None.
    """
    # SQLModel equivalent of db.query(Project).filter(Project.id == id).first()
    statement = select(Project).where(Project.id == id)
    project = db.exec(statement).first()
    return project

def get_multi_by_owner(
    db: Session, *, user_id: int, skip: int = 0, limit: int = 100
) -> List[Project]:
    """
    Retrieve multiple projects owned by a specific user, with pagination.

    Args:
        db: The database session.
        user_id: The ID of the owner user.
        skip: Number of projects to skip (for pagination).
        limit: Maximum number of projects to return (for pagination).

    Returns:
        A list of Project objects owned by the user.
    """
    statement = (
        select(Project)
        .where(Project.user_id == user_id)
        .offset(skip)
        .limit(limit)
        .order_by(Project.updated_at.desc()) # Order by lastUpdated (or created_at/id)
    )
    projects = db.exec(statement).all()
    return projects

def update_project(
    *, db: Session, db_obj: Project, obj_in: Union[ProjectUpdate, Dict[str, Any]]
) -> Project:
    """
    Update an existing project in the database.

    Args:
        db: The database session.
        db_obj: The existing Project database object to update.
        obj_in: An ProjectUpdate schema or a dictionary containing the fields to update.

    Returns:
        The updated Project object.
    """
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        # Use exclude_unset=True to only include fields explicitly provided in the request
        update_data = obj_in.model_dump(exclude_unset=True)

    # Update the fields of the existing database object
    for field, value in update_data.items():
        setattr(db_obj, field, value)

    db.add(db_obj) # Add the updated object back to the session
    db.commit()
    db.refresh(db_obj) # Refresh to get any DB-generated changes
    return db_obj


def remove_project(*, db: Session, id: int) -> Optional[Project]:
    """
    Delete a project from the database by its ID.

    Args:
        db: The database session.
        id: The ID of the project to delete.

    Returns:
        The deleted Project object if found and deleted, otherwise None.
    """
    # Fetch the object first to ensure it exists and potentially return it
    db_obj = get_project(db=db, id=id)
    if db_obj:
        db.delete(db_obj)
        db.commit()
        # Note: db_obj is now detached from the session but holds the data
    return db_obj