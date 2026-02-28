import pickle
from app.schema.registry import SCHEMA_REGISTRY
from app.llm.factory import get_llm

EMBED_FILE = "data/schema_embeddings.pkl"

def build_schema_text(name, meta):
    return f"""
Object: {name}
Description: {meta['description']}
Grain: {meta.get('grain')}
Columns:
{meta['schema']}
"""

def generate_embeddings():
    llm = get_llm()
    embeddings = []

    for name, meta in SCHEMA_REGISTRY.items():
        text = build_schema_text(name, meta)
        emb = llm.embed(text)
        embeddings.append({"name": name, "embedding": emb})

    with open(EMBED_FILE, "wb") as f:
        pickle.dump(embeddings, f)
