# File: alembic/env.py

import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# --- START: Custom Configuration Section ---

# Import SQLModel is needed if we reference SQLModel.metadata directly
from sqlmodel import SQLModel

# Add the project root directory to the Python path
# This allows Alembic to import modules from your 'app' directory
# Adjust the path ('..', '..') if your alembic directory is nested differently
sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '..', '..')))

# Import your application's settings object
from app.core.config import settings

# Import your central models file (app/db/base.py)
# Importing this module ensures that all your SQLModel classes defined in
# app/models/* are registered with SQLModel's metadata object before we use it.
from app.db import base as base_module

# Set the target metadata for Alembic autogenerate
# SQLModel keeps track of all table models defined inheriting from it.
target_metadata = SQLModel.metadata

# --- END: Custom Configuration Section ---


# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Note: The line `target_metadata = None` that might appear here
# in default templates MUST be removed or commented out, as we define
# `target_metadata` above using our SQLModel metadata.


# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    # Use the database URL from application settings
    url = str(settings.SQLALCHEMY_DATABASE_URI)
    context.configure(
        url=url,
        target_metadata=target_metadata,
        # literal_binds=True, # Keep commented out - causes issues with autogenerate
        dialect_opts={"paramstyle": "named"},
    )

    # The transaction/run block is usually not needed here for autogenerate
    # and was causing an error, keep it commented out.
    # with context.begin_transaction():
    #     context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    # Import the engine directly from your app's session setup
    # This reuses the same engine configuration as your FastAPI application
    from app.db.session import engine

    connectable = engine

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata  # Pass the metadata here for comparison
        )

        # Enclose the migration execution within a transaction
        with context.begin_transaction():
            context.run_migrations()


# Determine if Alembic is running in offline mode or online mode
# and call the appropriate function.
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()