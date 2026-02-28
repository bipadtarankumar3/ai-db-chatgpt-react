import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    ENV = os.getenv("ENV", "local")

    # LLM
    LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai")

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4")
    OPENAI_EMBED_MODEL = os.getenv("OPENAI_EMBED_MODEL", "text-embedding-3-large")

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-pro")
    GEMINI_EMBED_MODEL = os.getenv("GEMINI_EMBED_MODEL", "models/embedding-001")

    GROK_API_KEY = os.getenv("GROK_API_KEY")
    GROK_API_URL = os.getenv("GROK_API_URL")
    GROK_MODEL = os.getenv("GROK_MODEL")

    # DB
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = int(os.getenv("DB_PORT", 5432))
    DB_NAME = os.getenv("DB_NAME")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")

    MAX_ROWS = int(os.getenv("MAX_ROWS", 500))
    QUERY_TIMEOUT = int(os.getenv("QUERY_TIMEOUT", 10))

settings = Settings()
