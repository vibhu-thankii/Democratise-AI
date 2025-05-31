# File: app/crud/crud_dataset.py

from typing import List, Optional

# Import 'or_' for combining query conditions
from sqlmodel import Session, select, or_

from app.models.dataset import Dataset # The DB model
from app.schemas.dataset import DatasetCreate # The input schema for creation

def get_dataset(*, db: Session, id: int) -> Optional[Dataset]:
    """
    Retrieve a single dataset by its ID.

    Args:
        db: The database session.
        id: The ID of the dataset to retrieve.

    Returns:
        The Dataset object if found, otherwise None.
    """
    dataset = db.get(Dataset, id)
    return dataset

def get_multi_by_owner_or_public(
    db: Session, *, user_id: Optional[int], skip: int = 0, limit: int = 100
) -> List[Dataset]:
    """
    Retrieve multiple datasets: public ones AND those owned by the specific user.

    Args:
        db: The database session.
        user_id: The ID of the user requesting the datasets. Can be None if checking only public?
                 Let's assume user_id is always provided from an authenticated route.
        skip: Number of datasets to skip.
        limit: Maximum number of datasets to return.

    Returns:
        A list of Dataset objects.
    """
    statement = (
        select(Dataset)
        # Filter condition: Dataset is public OR dataset belongs to the current user
        .where(or_(Dataset.is_public == True, Dataset.user_id == user_id))
        .offset(skip)
        .limit(limit)
        .order_by(Dataset.updated_at.desc()) # Order by most recently updated
    )
    datasets = db.exec(statement).all()
    return datasets

def create_dataset(
    *, db: Session, dataset_in: DatasetCreate, user_id: int
) -> Dataset:
    """
    Creates a database record for a dataset (placeholder for upload).

    Sets dummy/placeholder values for storage details as the actual file
    upload processing is handled separately/later.

    Args:
        db: The database session.
        dataset_in: Dataset creation metadata (name, description, is_public).
        user_id: The ID of the user uploading/owning the dataset.

    Returns:
        The created Dataset database object.
    """
    dataset_data = dataset_in.model_dump()

    # Create the Dataset model instance
    db_dataset = Dataset(
        **dataset_data,
        user_id=user_id,
        # --- Set Placeholder Storage Info ---
        storage_type="placeholder",
        storage_path="pending_upload",
        file_size_bytes=None # Or 0, will be updated after actual upload
        # --- End Placeholder ---
    )
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    return db_dataset

# Placeholder for update function if needed later
# def update_dataset(...): ...

# Placeholder for remove function if needed later
# def remove_dataset(...): ...