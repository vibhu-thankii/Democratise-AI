# File: app/schemas/__init__.py
from .token import Token, TokenData
from .user import UserBase, UserCreate, UserUpdateProfile, UserPublic
from .project import ProjectBase, ProjectCreate, ProjectUpdate, ProjectPublic, ProjectPublicList # Example for later
from .msg import Msg # Imports the Msg class directly
from .model import ModelBase, ModelPublic # <<< ADD THIS LINE
from .training_run import TrainingRunBase, TrainingRunCreate, TrainingRunPublic # <<< ADD THIS LINE

# Import other schemas...

# File: app/schemas/__init__.py


# New exports
from .model import ModelBase, ModelPublic # Add others like ModelCreate if needed
from .dataset import DatasetBase, DatasetCreate, DatasetUpdate, DatasetPublic
from .training_run import TrainingRunBase, TrainingRunCreate, TrainingRunPublic

# You can also define __all__ if preferred
# __all__ = ["Token", "TokenData", "UserBase", ...]