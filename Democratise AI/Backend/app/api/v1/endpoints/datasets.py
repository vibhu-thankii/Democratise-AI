# File: app/api/v1/endpoints/datasets.py

from typing import List, Any, Optional

# Import Form, File, UploadFile for the upload endpoint
from fastapi import (
    APIRouter, Depends, HTTPException, Query, status,
    Form, File, UploadFile
)
from sqlmodel import Session

# Use specific imports
from app.crud import crud_dataset
from app.schemas.dataset import DatasetPublic, DatasetCreate
from app.models.user import User # Needed for current_user type hint
from app.api.v1 import deps # Import dependencies module
from app.db.session import get_db

router = APIRouter()

@router.get("/", response_model=List[DatasetPublic])
def list_datasets(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Number of datasets to skip"),
    limit: int = Query(100, ge=1, le=200, description="Maximum number of datasets to return"),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve datasets accessible to the current user (owned or public).
    """
    datasets = crud_dataset.get_multi_by_owner_or_public(
        db=db, user_id=current_user.id, skip=skip, limit=limit
    )
    return datasets

@router.get("/{dataset_id}", response_model=DatasetPublic)
def get_dataset_details(
    *,
    db: Session = Depends(get_db),
    dataset_id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get details for a specific dataset by ID.
    Users can access public datasets or their own private datasets.
    """
    dataset = crud_dataset.get_dataset(db=db, id=dataset_id)
    if not dataset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")

    # --- Authorization Check ---
    is_owner = (dataset.user_id == current_user.id)
    if not dataset.is_public and not is_owner:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this dataset")
    # --- End Authorization Check ---

    return dataset

@router.post("/upload", response_model=DatasetPublic, status_code=status.HTTP_201_CREATED)
async def upload_dataset( # Mark as async because UploadFile operations might be async
    *,
    db: Session = Depends(get_db),
    # Metadata received as form fields
    name: str = Form(...),
    description: Optional[str] = Form(None),
    is_public: bool = Form(False),
    # The actual file - use UploadFile
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    **Placeholder:** Accepts dataset metadata and a file upload attempt.
    Creates a database record for the dataset but DOES NOT save the file content yet.
    Actual file handling and storage to be implemented later.
    """
    print(f"--- Placeholder Upload Received ---")
    print(f"Filename: {file.filename}")
    print(f"Content-Type: {file.content_type}")
    print(f"Metadata - Name: {name}, Public: {is_public}")
    # Note: Reading the file content (e.g., await file.read()) is deliberately omitted here.
    # In a real implementation, you would stream this file to cloud storage (S3, GCS etc.)
    # and then update the dataset record with the actual storage path and size.
    print(f"--- File content is NOT being saved in this placeholder. ---")

    # Create schema instance from form metadata
    dataset_in = DatasetCreate(name=name, description=description, is_public=is_public)

    # Create the database record using the placeholder CRUD function
    db_dataset = crud_dataset.create_dataset(db=db, dataset_in=dataset_in, user_id=current_user.id)

    # You might add a field to the model/schema like 'upload_status'="pending" here

    return db_dataset