from pathlib import Path
import sys

# make sure server directory is added so imports like `from app...` resolve
ROOT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT_DIR))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid

from app.schema.selector import select_schema
from app.schema.builder import build_schema
from app.llm.text_to_sql import generate_sql
from app.llm.formatter import format_result
from app.llm.intent_detector import detect_intent, get_conversational_response
from app.security.sql_guard import validate_sql
from app.db.executor import execute_sql
from app.memory.chat_store import init_db, save_message
from app.memory.context_builder import build_context

app = FastAPI()

# allow CORS for development; wildcard permits preflight requests from any host
# (switch to a tighter list in production if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] ,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# initialize chat database on import
init_db()

from typing import Any, List, Dict, Optional

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str

class NewSessionResponse(BaseModel):
    session_id: str

class QueryRequest(BaseModel):
    question: str
    session_id: Optional[str] = None

class QueryResponse(BaseModel):
    answer: str
    data: Optional[List[Dict[str, Any]]] = None
    columns: Optional[List[str]] = None
    sql: Optional[str] = None
    graphData: Optional[List[Dict[str, Any]]] = None
    hint: Optional[str] = None


@app.post("/login", response_model=LoginResponse)
def login(req: LoginRequest):
    # simple hard‑coded auth for demonstration
    if req.username == "admin" and req.password == "admin":
        token = str(uuid.uuid4())
        # could store user->tokens mapping if needed
        return {"token": token}
    else:
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Invalid credentials")


@app.post("/session/new", response_model=NewSessionResponse)
def new_session():
    sid = str(uuid.uuid4())
    return {"session_id": sid}


@app.post("/query", response_model=QueryResponse)
def query(req: QueryRequest):
    """Endpoint used by the React frontend to submit a natural language question.
    The implementation mirrors the logic in `app/main.py` but runs synchronously.
    """

    session_id = req.session_id or str(uuid.uuid4())
    question = req.question.strip()

    # save user message
    save_message(session_id, "user", question)

    context = build_context(session_id)
    intent = detect_intent(question)

    if intent == "conversation":
        reply = get_conversational_response(question, context)
        save_message(session_id, "assistant", reply)
        return {"answer": reply}

    # database query flow
    schema_keys = select_schema(question)
    schema = build_schema(schema_keys)
    sql = generate_sql(question, schema, context)

    validate_sql(sql)
    df = execute_sql(sql, question)

    answer = format_result(df, question)
    # look for optional hints or graph payload inside answer text
    hint = None
    graph_data = None
    # simple marker-based parsing
    if "GRAPH_DATA:" in answer:
        parts = answer.split("GRAPH_DATA:")
        answer = parts[0].strip()
        try:
            import json
            graph_data = json.loads(parts[1].strip())
        except Exception:
            graph_data = None
    if "HINT:" in answer:
        parts = answer.split("HINT:")
        answer = parts[0].strip()
        hint = parts[1].strip()

    save_message(session_id, "assistant", answer)

    result: dict = {"answer": answer, "sql": sql}
    if hint:
        result["hint"] = hint
    if graph_data:
        result["graphData"] = graph_data
    if not df.empty:
        result["columns"] = df.columns.tolist()
        result["data"] = df.to_dict(orient="records")
    return result
