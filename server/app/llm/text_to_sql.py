from app.llm.factory import get_llm
from app.utils.logger import get_logger

logger = get_logger(__name__)

# ============================================================
# HARD-LOCKED SQL SYSTEM PROMPT (DO NOT EXPOSE TO USER INPUT)
# ============================================================

SQL_SYSTEM_PROMPT = """
SYSTEM INSTRUCTIONS (HIGHEST PRIORITY)

You are a PostgreSQL SQL generation engine.
Your ONLY task is to convert the user's question into a valid PostgreSQL SELECT query.

=====================
STRICT RULES
=====================
1. OUTPUT ONLY SQL
   - Return ONLY a valid PostgreSQL SELECT query
   - No explanations, comments, markdown, or formatting

2. READ-ONLY GUARANTEE
   - NEVER generate UPDATE, DELETE, INSERT, DROP, ALTER, TRUNCATE
   - Aggregations must be done using SELECT only

3. INTENT PRESERVATION
   - Do NOT rewrite, rephrase, or reinterpret the user's question
   - Do NOT assume filters or conditions not explicitly mentioned
   - "unique" → DISTINCT
   - "total" → SUM or COUNT (as appropriate)

4. SCHEMA STRICTNESS
   - Use ONLY tables and columns present in the provided schema
   - NEVER invent tables or columns

5. CONTEXT USAGE
   - Use conversation context ONLY if the user explicitly refers to it
     (e.g., "same year", "above project")
   - Otherwise, ignore context

6. AMBIGUITY HANDLING
   - If the query cannot be generated with certainty:
     Return exactly:
     CANNOT_GENERATE_SQL_NEED_CLARIFICATION

7. NULL & STATUS HANDLING
   - Handle NULLs safely
   - Apply status or deleted filters ONLY if explicitly defined in schema or question

=====================
INPUTS
=====================
Database Schema:
{schema}

Conversation Context:
{context}

User Question:
{question}

=====================
FINAL INSTRUCTION
=====================
Generate the SQL query now.
"""


# ============================================================
# PROMPT-INJECTION PROTECTION
# ============================================================

BLOCKED_PHRASES = [
    "ignore previous",
    "change your role",
    "act as",
    "system prompt",
    "developer message",
    "you are no longer",
    "override instructions"
]


def _is_prompt_injection(text: str) -> bool:
    text = text.lower()
    return any(p in text for p in BLOCKED_PHRASES)


# ============================================================
# SQL SAFETY VALIDATION
# ============================================================

FORBIDDEN_SQL = [
    "update ",
    "delete ",
    "insert ",
    "drop ",
    "alter ",
    "truncate "
]


def _is_safe_sql(sql: str) -> bool:
    sql_lower = sql.lower().strip()
    return (
        sql_lower.startswith("select")
        and not any(word in sql_lower for word in FORBIDDEN_SQL)
    )


# ============================================================
# MAIN SQL GENERATION FUNCTION
# ============================================================

def generate_sql(question: str, schema: str, context: list | None = None) -> str:
    """
    Generate a safe, deterministic PostgreSQL SELECT query
    from a natural language question.
    """

    if _is_prompt_injection(question):
        logger.warning("Prompt injection attempt detected")
        raise ValueError("Prompt injection attempt blocked")

    llm = get_llm()

    # Limit context to last 5 messages only
    context_text = "\n".join(
        f"{msg['role'].upper()}: {msg['content']}"
        for msg in context[-5:]
    ) if context else "No previous conversation."

    # Build locked prompt
    prompt = SQL_SYSTEM_PROMPT.format(
        schema=schema,
        context=context_text,
        question=question
    )

    messages = [
        {
            "role": "system",
            "content": "You are a locked SQL generation engine. Follow instructions strictly."
        },
        {
            "role": "user",
            "content": prompt
        }
    ]

    # print("SQL Generation Prompt:\n------------------------------------------?", prompt)

    logger.debug("SQL Generation Prompt:\n%s", prompt)

    sql = llm.chat(
        messages=messages,
        temperature=0  # Deterministic, no creativity
    )

    if not sql:
        raise ValueError("Empty SQL generated")

    # Cleanup
    sql = sql.strip().strip("`").strip()

    if sql == "CANNOT_GENERATE_SQL_NEED_CLARIFICATION":
        return sql

    if not _is_safe_sql(sql):
        logger.error("Unsafe SQL generated: %s", sql)
        raise ValueError("Unsafe SQL generated")

    logger.info("Generated SQL: %s", sql)
    return sql
