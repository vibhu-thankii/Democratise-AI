# File: app/api/v1/endpoints/models.py

from typing import List, Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session

# Use specific imports to avoid potential __init__ issues
from app.crud import crud_model
from app.schemas.model import ModelPublic # Use the public schema for responses
from app.db.session import get_db

router = APIRouter()

@router.get("/", response_model=List[ModelPublic])
def list_models(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Number of models to skip"),
    limit: int = Query(100, ge=1, le=200, description="Maximum number of models to return"),
) -> Any:
    """
    Retrieve a list of available models (e.g., from Hugging Face Hub cache or user uploads).
    (Currently fetches from the 'model' table).
    """
    models = crud_model.get_multi(db=db, skip=skip, limit=limit)
    # Note: This will return an empty list [] if no models are in the DB.
    # For a placeholder, you could return a hardcoded list here instead:
    # if not models:
    #     return [
    #         {"id": 1, "name": "BERT (bert-base-uncased)", ...},
    #         {"id": 2, "name": "ResNet-50", ...}
    #     ]
    return models

@router.get("/{model_id}", response_model=ModelPublic)
def get_model_details(
    *,
    db: Session = Depends(get_db),
    model_id: int,
) -> Any:
    """
    Get details for a specific model by ID.
    """
    model = crud_model.get_model(db=db, id=model_id)
    if not model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Model not found")
    return model