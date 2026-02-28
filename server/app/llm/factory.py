from app.config.settings import settings
from app.llm.providers.openai_llm import OpenAILLM
from app.llm.providers.gemini_llm import GeminiLLM
from app.llm.providers.grok_llm import GrokLLM
from app.utils.logger import get_logger

logger = get_logger(__name__)

def get_llm():
    """Get LLM instance based on configured provider."""
    provider = settings.LLM_PROVIDER.lower()
    
    if provider == "openai":
        return OpenAILLM()
    elif provider == "gemini":
        return GeminiLLM()
    elif provider == "grok":
        return GrokLLM()
    else:
        logger.error(f"Invalid LLM_PROVIDER: {settings.LLM_PROVIDER}")
        raise ValueError(f"Invalid LLM_PROVIDER: {settings.LLM_PROVIDER}. Must be one of: openai, gemini, grok")
