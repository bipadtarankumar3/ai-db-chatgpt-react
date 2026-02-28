import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from app.llm.base import BaseLLM
from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

class GeminiLLM(BaseLLM):
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY must be set")
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)

    def chat(self, messages, temperature=0):
        try:
            # Convert messages to prompt format
            prompt = "\n".join(m["content"] for m in messages)
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(temperature=temperature)
            )
            
            # Check if response was blocked or empty
            if not response.candidates:
                logger.error("Gemini response blocked: No candidates returned")
                raise ValueError("Response was blocked by safety filters. Please try rephrasing your query.")
            
            candidate = response.candidates[0]
            if candidate.finish_reason == 1:  # SAFETY
                logger.warning("Gemini response blocked by safety filters")
                raise ValueError("Response was blocked by safety filters. Please try rephrasing your query.")
            
            # Check if response has text
            if not hasattr(response, 'text') or not response.text:
                # Try to get text from parts
                if candidate.content and candidate.content.parts:
                    text = candidate.content.parts[0].text
                    if text:
                        return text
                logger.error("Gemini response is empty")
                raise ValueError("Empty response from Gemini API. Please try again.")
            
            return response.text
        except ValueError:
            # Re-raise ValueError as-is (our custom errors)
            raise
        except google_exceptions.GoogleAPIError as e:
            logger.error(f"Gemini API error: {e}")
            raise ConnectionError(f"Gemini API error: {e}")
        except AttributeError as e:
            logger.error(f"Gemini response structure error: {e}")
            raise ValueError(f"Unexpected response format from Gemini: {e}")
        except Exception as e:
            logger.error(f"Unexpected error with Gemini: {e}")
            raise ValueError(f"Error generating response: {str(e)}")

    def embed(self, text):
        try:
            result = genai.embed_content(
                model=settings.GEMINI_EMBED_MODEL,
                content=text
            )
            return result["embedding"]
        except google_exceptions.GoogleAPIError as e:
            logger.error(f"Gemini embedding error: {e}")
            raise ConnectionError(f"Gemini embedding error: {e}")
        except Exception as e:
            logger.error(f"Unexpected error with Gemini embeddings: {e}")
            raise
