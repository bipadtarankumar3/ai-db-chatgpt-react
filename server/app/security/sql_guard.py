FORBIDDEN = [
    "drop", "delete", "update", "insert",
    "truncate", "alter", "grant", "revoke"
]

def validate_sql(sql: str):
    sql_lower = sql.lower()

    for word in FORBIDDEN:
        if word in sql_lower:
            raise ValueError(f"Forbidden SQL keyword: {word}")

    if ";" in sql_lower[:-1]:
        raise ValueError("Multiple SQL statements not allowed")
