# app/db/base.py
from sqlmodel import SQLModel
from sqlmodel import SQLModel

from app.models.user import User
from app.models.project import Project
# Import all your SQLModel table models here
# This allows Alembic to discover them automatically
from app.models.user import User
from app.models.project import Project
from app.models.model import Model # <<< ADD
from app.models.dataset import Dataset # <<< ADD
from app.models.training_run import TrainingRun # <<< ADD
from app.models.links import ProjectModelLink # <<< ADD
from app.models.links import ProjectDatasetLink # <<< ADD

# --- Add imports for future models below this line ---
# from app.models.dataset import Dataset # Example
# from app.models.model import Model     # Example

# You can optionally re-export metadata for clarity, but it's not strictly necessary
# as Alembic will use SQLModel.metadata if target_metadata is set to None in env.py
# or if it's explicitly set to SQLModel.metadata there.
# metadata = SQLModel.metadata