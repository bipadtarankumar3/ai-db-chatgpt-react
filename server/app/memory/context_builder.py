from app.memory.chat_store import get_history

def build_context(session_id, limit=10):
    """Build context from chat history for LLM (limited to recent messages)."""
    history = get_history(session_id, limit=limit)
    # Handle both old format (2 values) and new format (3 values)
    result = []
    for row in history:
        if len(row) == 3:
            r, c, _ = row
        else:
            r, c = row
        result.append({"role": r, "content": c})
    return result


def get_display_history(session_id):
    """Get full chat history for display purposes."""
    history = get_history(session_id, limit=None)
    # Handle both old format (2 values) and new format (3 values)
    result = []
    for row in history:
        if len(row) == 3:
            r, c, ts = row
            result.append({"role": r, "content": c, "created_at": ts})
        else:
            r, c = row
            result.append({"role": r, "content": c, "created_at": None})
    return result
