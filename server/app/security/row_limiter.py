def apply_limit(sql: str, limit: int):
    if "limit" not in sql.lower():
        return f"{sql} LIMIT {limit}"
    return sql
