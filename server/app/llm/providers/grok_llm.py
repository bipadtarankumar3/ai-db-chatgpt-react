import requests
from app.llm.base import BaseLLM
from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

class GrokLLM(BaseLLM):
    def __init__(self):
        if not settings.GROK_API_KEY or not settings.GROK_API_URL:
            raise ValueError("GROK_API_KEY and GROK_API_URL must be set")
    
    def chat(self, messages, temperature=0):
        try:
            res = requests.post(
                settings.GROK_API_URL,
                headers={"Authorization": f"Bearer {settings.GROK_API_KEY}"},
                json={"model": settings.GROK_MODEL, "messages": messages, "temperature": temperature},
                timeout=30
            )
            res.raise_for_status()
            return res.json()["choices"][0]["message"]["content"]
        except requests.exceptions.RequestException as e:
            logger.error(f"Grok API request failed: {e}")
            raise ConnectionError(f"Failed to connect to Grok API: {e}")
        except KeyError as e:
            logger.error(f"Unexpected response format from Grok API: {e}")
            raise ValueError(f"Invalid response from Grok API: {e}")

    def embed(self, text):
        raise NotImplementedError("Grok embeddings not supported yet")
