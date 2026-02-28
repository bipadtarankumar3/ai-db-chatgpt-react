import uuid
from app.db.connection import get_connection
from app.utils.logger import get_logger

logger = get_logger(__name__)

def init_db():
    """
    Ensures the chat_history table exists.
    Safe to call on app startup.
    """
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            CREATE TABLE IF NOT EXISTS chat_history (
                id BIGSERIAL PRIMARY KEY,
                session_id VARCHAR(36) NOT NULL,
                role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create index for faster queries
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_chat_history_session_id 
            ON chat_history(session_id, created_at)
        """)

        conn.commit()
        conn.close()
        logger.info("Chat history table initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize chat history table: {e}")
        # don't raise to allow app to start even if DB isn't configured
        return


def save_message(session_id, role, content):
    """Save a message to chat history."""
    if not session_id:
        logger.warning("Attempted to save message with None session_id")
        return
    
    # Validate UUID format
    try:
        # Try to parse as UUID to validate format
        uuid.UUID(session_id)
    except (ValueError, TypeError):
        logger.warning(f"Invalid session_id format: {session_id}")
        return
    
    if role not in ['user', 'assistant']:
        logger.warning(f"Invalid role: {role}")
        return
    
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO chat_history (session_id, role, content)
            VALUES (%s, %s, %s)
        """, (str(session_id), role, content))

        conn.commit()
        conn.close()
        logger.debug(f"Saved {role} message for session {session_id}")
    except Exception as e:
        logger.error(f"Failed to save message: {e}")
        # Don't raise - allow app to continue even if history save fails


def get_history(session_id, limit=None):
    """Get chat history for a session."""
    if not session_id:
        return []
    
    try:
        conn = get_connection()
        cur = conn.cursor()

        if limit:
            cur.execute("""
                SELECT role, content, created_at
                FROM chat_history
                WHERE session_id = %s
                ORDER BY created_at ASC
                LIMIT %s
            """, (str(session_id), limit))
        else:
            cur.execute("""
                SELECT role, content, created_at
                FROM chat_history
                WHERE session_id = %s
                ORDER BY created_at ASC
            """, (str(session_id),))

        rows = cur.fetchall()
        conn.close()
        
        logger.debug(f"Retrieved {len(rows)} messages for session {session_id}")
        return rows
    except Exception as e:
        logger.error(f"Failed to get chat history: {e}")
        return []


def get_all_history(session_id):
    """Get all chat history for a session (for display purposes)."""
    return get_history(session_id, limit=None)
