# Python CLI entry point (chainlit removed)
from pathlib import Path
import uuid

# ensure the `server` directory is on sys.path so that `app` package imports work
ROOT_DIR = Path(__file__).resolve().parent
import sys
sys.path.insert(0, str(ROOT_DIR))

from app.schema.selector import select_schema
from app.schema.builder import build_schema
from app.llm.text_to_sql import generate_sql
from app.llm.formatter import format_result
from app.llm.intent_detector import detect_intent, get_conversational_response
from app.security.sql_guard import validate_sql
from app.db.executor import execute_sql
from app.memory.chat_store import init_db, save_message
from app.memory.context_builder import build_context
from app.utils.logger import get_logger

logger = get_logger(__name__)

# initialize chat DB
init_db()


def process_question(question: str, session_id: str) -> str:
    """Run the core logic for a single user question and return the assistant reply."""
    save_message(session_id, "user", question)
    context = build_context(session_id)
    intent = detect_intent(question)

    if intent == "conversation":
        reply = get_conversational_response(question, context)
        save_message(session_id, "assistant", reply)
        return reply

    schema_keys = select_schema(question)
    schema = build_schema(schema_keys)
    sql = generate_sql(question, schema, context)

    validate_sql(sql)
    df = execute_sql(sql, question)
    answer = format_result(df, question)
    save_message(session_id, "assistant", answer)
    return answer


if __name__ == "__main__":
    session_id = str(uuid.uuid4())
    print("AI Database Assistant (CLI mode). Type 'exit' to quit.")
    while True:
        try:
            question = input("\n> ")
        except EOFError:
            break
        if not question or question.lower() in {"exit", "quit"}:
            break
        reply = process_question(question, session_id)
        print(f"\n{reply}")
