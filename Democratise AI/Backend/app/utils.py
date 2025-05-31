# File: app/utils.py
from datetime import datetime
import pytz # Make sure pytz is installed: pip install pytz

def aware_utcnow():
    """Returns the current datetime aware of the UTC timezone."""
    return datetime.now(pytz.utc)

# Add other utility functions here later if needed