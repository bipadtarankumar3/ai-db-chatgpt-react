import psycopg2
from app.llm.factory import get_llm
from app.utils.logger import get_logger

logger = get_logger(__name__)

DB_CONFIG = {
    "host": "localhost",
    "database": "chat_boat",
    "user": "postgres",
    "password": "root"
}

def select_schema(question, top_k=5):
    try:
        llm = get_llm()
        q_emb = llm.embed(question)
        vector_str = "[" + ",".join(map(str, q_emb)) + "]"

        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()

        cur.execute("""
            SELECT content
            FROM semantic_schema_registry
            ORDER BY embedding <-> %s::vector
            LIMIT %s;
        """, (vector_str, top_k))

        rows = cur.fetchall()
        cur.close()
        conn.close()

        if not rows:
            logger.warning("No schema found in database.")
            return []

        return [row[0] for row in rows]

    except Exception as e:
        logger.error(f"Error selecting schema from database: {e}")
        return []