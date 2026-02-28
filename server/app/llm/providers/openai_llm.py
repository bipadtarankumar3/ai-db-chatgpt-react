from openai import OpenAI
from openai import OpenAIError
from app.llm.base import BaseLLM
from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

class OpenAILLM(BaseLLM):
    def __init__(self):
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY must be set")
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)

    def chat(self, messages, temperature=0):
        try:
            res = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=messages,
                temperature=temperature
            )
            return res.choices[0].message.content
        except OpenAIError as e:
            logger.error(f"OpenAI API error: {e}")
            raise ConnectionError(f"OpenAI API error: {e}")

    def embed(self, text):
        try:
            res = self.client.embeddings.create(
                model=settings.OPENAI_EMBED_MODEL,
                input=text
            )
            return res.data[0].embedding
        except OpenAIError as e:
            logger.error(f"OpenAI embedding error: {e}")
            raise ConnectionError(f"OpenAI embedding error: {e}")
