import pandas as pd
from psycopg2 import OperationalError, ProgrammingError
from app.db.connection import get_connection
from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

def execute_sql(sql: str, user_query: str = "") -> pd.DataFrame:
    """Execute SQL query and return results as DataFrame."""
    conn = None
    try:
        conn = get_connection()
        df = pd.read_sql(sql, conn)
        
        # Check if user asked for "all" data
        query_lower = user_query.lower() if user_query else ""
        ask_for_all = any(phrase in query_lower for phrase in [
            "show all", "list all", "get all", "all data", "all records",
            "all rows", "everything", "entire", "complete", "full"
        ])
        
        # Only limit if user didn't explicitly ask for all data
        if not ask_for_all and len(df) > settings.MAX_ROWS:
            logger.warning(f"Query returned {len(df)} rows, limiting to {settings.MAX_ROWS}")
            df = df.head(settings.MAX_ROWS)
        elif ask_for_all:
            logger.info(f"User requested all data, returning {len(df)} rows without limit")

        logger.info(f"Query executed successfully, returned {len(df)} rows")
        return df
        
    except ProgrammingError as e:
        logger.error(f"SQL syntax error: {e}")
        raise ValueError(f"SQL query error: {str(e)}")
    except OperationalError as e:
        logger.error(f"Database operation error: {e}")
        raise ConnectionError(f"Database error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error executing SQL: {e}")
        raise
    finally:
        if conn:
            conn.close()
