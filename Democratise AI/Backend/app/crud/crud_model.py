# File: app/crud/crud_model.py

from typing import List, Optional

from sqlmodel import Session, select

from app.models.model import Model # The DB model

def get_model(*, db: Session, id: int) -> Optional[Model]:
    """
    Retrieve a single model by its ID.

    Args:
        db: The database session.
        id: The ID of the model to retrieve.

    Returns:
        The Model object if found, otherwise None.
    """
    # Fetch by primary key is efficient
    model = db.get(Model, id)
    # Alternative using select:
    # statement = select(Model).where(Model.id == id)
    # model = db.exec(statement).first()
    return model

def get_multi(
    db: Session, *, skip: int = 0, limit: int = 100
) -> List[Model]:
    """
    Retrieve multiple models, with pagination.

    Args:
        db: The database session.
        skip: Number of models to skip.
        limit: Maximum number of models to return.

    Returns:
        A list of Model objects.
    """
    statement = select(Model).offset(skip).limit(limit).order_by(Model.id)
    models = db.exec(statement).all()
    return models

# Placeholder for create function if needed later
# def create_model(*, db: Session, model_in: schemas.ModelCreate) -> Model:
#     db_model = Model.model_validate(model_in) # Or Model(**model_in.dict())
#     db.add(db_model)
#     db.commit()
#     db.refresh(db_model)
#     return db_model