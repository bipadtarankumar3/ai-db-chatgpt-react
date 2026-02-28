import psycopg2
from psycopg2 import OperationalError
from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

def get_connection():
    """Get a PostgreSQL database connection."""
    try:
        if not all([settings.DB_HOST, settings.DB_NAME, settings.DB_USER, settings.DB_PASSWORD]):
            raise ValueError("Missing required database configuration. Please set DB_HOST, DB_NAME, DB_USER, and DB_PASSWORD environment variables.")
        
        conn = psycopg2.connect(
            host=settings.DB_HOST,
            port=settings.DB_PORT,
            dbname=settings.DB_NAME,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD,
            options=f"-c statement_timeout={settings.QUERY_TIMEOUT * 1000}"
        )
        return conn
    except OperationalError as e:
        logger.error(f"Database connection failed: {e}")
        raise ConnectionError(f"Failed to connect to database: {e}")
    except Exception as e:
        logger.error(f"Unexpected error connecting to database: {e}")
        raise
