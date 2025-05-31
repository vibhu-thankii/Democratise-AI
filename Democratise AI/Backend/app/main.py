# File: app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.api import api_router # Import the main v1 router

# Create FastAPI app instance
# You can add other FastAPI parameters here if needed, like version, description, etc.
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json" # Standard location for OpenAPI spec
)

# --- CORS Middleware Configuration ---
# Ensure this middleware is added before including routers
# It allows requests from the frontend origins specified in your settings.
if settings.BACKEND_CORS_ORIGINS:
    # Split the comma-separated string from settings into a list of origins
    # Strip whitespace and remove trailing slashes from each origin
    origins = [
        str(origin).strip().rstrip("/")
        for origin in settings.BACKEND_CORS_ORIGINS.split(",")
        if origin # Ensure empty strings aren't included if there are trailing commas etc.
    ]
    print(f"Configuring CORS for origins: {origins}") # Log the parsed origins
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins, # Pass the parsed list of strings
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    print("Warning: BACKEND_CORS_ORIGINS is empty. CORS middleware not configured.")
# --- End CORS Middleware ---


# --- Include API Routers ---
# Include the main v1 router with the prefix from settings (e.g., /api/v1)
app.include_router(api_router, prefix=settings.API_V1_STR)
# --- End Include API Routers ---


# --- Optional: Root Endpoint ---
@app.get("/", tags=["Root"])
async def read_root():
    """
    An example root endpoint.
    """
    return {"message": f"Welcome to {settings.PROJECT_NAME}! Docs at /docs"}

# --- Optional: Add Global Exception Handlers ---
# from fastapi import Request, status
# from fastapi.responses import JSONResponse
# from fastapi.exceptions import RequestValidationError
#
# @app.exception_handler(RequestValidationError)
# async def validation_exception_handler(request: Request, exc: RequestValidationError):
#     return JSONResponse(
#         status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
#         content={"detail": exc.errors()},
#     )
#
# @app.exception_handler(HTTPException)
# async def http_exception_handler(request: Request, exc: HTTPException):
#     return JSONResponse(
#         status_code=exc.status_code,
#         content={"detail": exc.detail},
#         headers=exc.headers,
#     )
#
# @app.exception_handler(Exception) # Generic handler for unexpected errors
# async def generic_exception_handler(request: Request, exc: Exception):
#     # Log the exception here for debugging
#     print(f"Unhandled exception: {exc}") # Basic logging
#     return JSONResponse(
#         status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#         content={"detail": "An internal server error occurred."},
#     )