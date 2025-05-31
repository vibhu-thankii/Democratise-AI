# File: app/api/v1/api.py

from fastapi import APIRouter
from app.api.v1.endpoints import projects # <<< IMPORT projects router

from app.api.v1.endpoints import auth # Import your auth endpoints router
from app.api.v1.endpoints import users # <<< IMPORT users router
from app.api.v1.endpoints import models # <<< IMPORT models router
from app.api.v1.endpoints import datasets # <<< IMPORT datasets router
from app.api.v1.endpoints import training # <<< IMPORT training router

# Import other endpoint routers as you create them
# from app.api.v1.endpoints import projects
# from app.api.v1.endpoints import users
# from app.api.v1.endpoints import models
# from app.api.v1.endpoints import datasets
# from app.api.v1.endpoints import training

api_router = APIRouter()

# Include the authentication router
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"]) # <<< INCLUDE projects router
# Include User Settings router
api_router.include_router(users.router, prefix="/user", tags=["User Settings"]) # <<< INCLUDE users router
api_router.include_router(models.router, prefix="/models", tags=["Models"]) # <<< INCLUDE models router
api_router.include_router(datasets.router, prefix="/datasets", tags=["Datasets"]) # <<< INCLUDE datasets router
api_router.include_router(training.router, tags=["Training"]) # <<< INCLUDE training router (no prefix needed here)

# Include other routers here later with appropriate prefixes and tags
# api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])
# api_router.include_router(users.router, prefix="/user", tags=["Users"]) # Example for settings
# api_router.include_router(models.router, prefix="/models", tags=["Models"])
# api_router.include_router(datasets.router, prefix="/datasets", tags=["Datasets"])
# api_router.include_router(training.router, prefix="/training", tags=["Training"])

