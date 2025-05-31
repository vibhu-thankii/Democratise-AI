import logging

from sqlalchemy.orm import sessionmaker
from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

# Construct the database URL string from settings
# Note: SQLModel/SQLAlchemy expects a string URL
database_url = str(settings.SQLALCHEMY_DATABASE_URI)

# Create the SQLAlchemy engine
# connect_args is useful for SQLite, may not be needed for PostgreSQL
# pool_pre_ping=True helps handle dropped connections
engine = create_engine(
    database_url,
    echo=False, # Set to True to see SQL queries in console (useful for debugging)
    pool_pre_ping=True,
    # connect_args={"check_same_thread": False} # Only needed for SQLite
)

# Create a configured "Session" class
# Use sessionmaker for compatibility with FastAPI dependency injection patterns
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=Session)

def create_db_and_tables():
    """
    Development only: Creates database tables based on SQLModel metadata.
    It's generally better to use Alembic migrations for production environments.
    """
    logging.warning("Running create_db_and_tables() - Use Alembic for production.")
    # Import all models here so they register with SQLModel's metadata
    # from app.models.user import User # Example import
    # from app.models.project import Project # Example import
    # Add imports for all your models...

    SQLModel.metadata.create_all(engine)

# Dependency function to get a DB session
def get_db():
    """
    FastAPI dependency that yields a SQLAlchemy session.
    Ensures the session is always closed, even if errors occur.
    """
    with Session(engine) as session:
        try:
            yield session
            session.commit() # Commit transaction if no exceptions
        except Exception:
            session.rollback() # Rollback if any exception occurs
            raise
        finally:
            session.close() # Close the session

# Alternative Dependency using sessionmaker (often preferred for clarity)
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#         db.commit() # Commit if yield succeeds
#     except Exception:
#         db.rollback()
#         raise
#     finally:
#         db.close()
