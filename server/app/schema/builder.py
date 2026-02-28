from app.schema.registry import SCHEMA_REGISTRY
from app.utils.logger import get_logger

logger = get_logger(__name__)

# def build_schema(schema_keys):
#     """Build schema string from selected schema keys."""
#     if not schema_keys:
#         logger.warning("No schema keys provided, using all available schemas")
#         schema_keys = list(SCHEMA_REGISTRY.keys())
    
#     schemas = []
#     for key in schema_keys:
#         if key in SCHEMA_REGISTRY:
#             schemas.append(SCHEMA_REGISTRY[key]["schema"])
#         else:
#             logger.warning(f"Schema key '{key}' not found in registry")
    
#     if not schemas:
#         logger.error("No valid schemas found")
#         return "No schema information available."
    
#     result = "\n".join(schemas)
#     logger.debug(f"Built schema from {len(schemas)} tables/views")
#     return result

def build_schema(schema_contents):
    if not schema_contents:
        return "No schema information available."

    return "\n\n".join(schema_contents)
