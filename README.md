# 🤖 AI Database Assistant - ChatGPT Style Interface

A ChatGPT-style interface for querying PostgreSQL databases using natural language. Powered by Python and LLMs (OpenAI, Gemini, or Grok).

## ✨ Features

- **Natural Language Queries**: Ask questions about your database in plain English
- **Smart SQL Generation**: AI-powered SQL query generation with context awareness
- **Conversation History**: Maintains context across your conversation
- **Secure**: Only SELECT queries are allowed for safety
- **Multiple LLM Providers**: Support for OpenAI, Google Gemini, and Grok
- **Interactive Results**: View query results in an easy-to-read format with dataframes
- **Schema Awareness**: Uses embeddings to select relevant database schemas

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- PostgreSQL database
- LLM API key (OpenAI, Gemini, or Grok)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-db-chatbot   # or whatever you named the workspace
```
2. Install dependencies (from the `server` directory):
```bash
cd server
pip install -r requirements.txt
```
3. Create a `.env` file in the root directory:
```env
# LLM Provider (openai, gemini, grok)
LLM_PROVIDER=openai

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4
OPENAI_EMBED_MODEL=text-embedding-3-large

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password

# Query Settings
MAX_ROWS=500
QUERY_TIMEOUT=10
```

4. Set up your database schema registry:
   - Generate schema embeddings using the tools in the `tools/` directory
   - Update `app/schema/registry.py` with your database schema information

5. Run the application (choose one of the following):
### API response format

When calling the HTTP endpoint (`POST /query`), the server returns a JSON object with:

- `answer`: text explanation from the LLM
- `sql`: the SQL query generated and executed
- `columns`: array of column names (if any data returned)
- `data`: array of row objects matching the columns
- `graphData` (optional): array of `{x:..., y:...}` points for chart rendering
- `hint` (optional): brief guidance or note

The React UI automatically renders tables/charts based on these fields.

8. Run the application (choose one of the following):
```bash
# Option 1: CLI helper
cd server
python main.py

# Option 2: HTTP API for custom frontend
# from the project root (or inside `server`):
cd server
uvicorn app.api:app --reload --port 8000
```
6. Open your browser to interact with the API or launch the React frontend at `http://localhost:3000`.

## 📝 Usage

1. Start a conversation by asking a question about your database
2. The assistant will:
   - Analyze your question
   - Select relevant database schemas
   - Generate an appropriate SQL query
   - Execute the query safely
   - Format and explain the results

### Example Questions

- "Show me all users from California"
- "What are the top 10 products by sales?"
- "How many orders were placed last month?"
- "List all customers who haven't placed an order in the last 30 days"

## 🔧 Configuration

### LLM Providers

#### OpenAI
```env
LLM_PROVIDER=openai
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-4
OPENAI_EMBED_MODEL=text-embedding-3-large
```

#### Google Gemini
```env
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-1.5-pro
GEMINI_EMBED_MODEL=models/embedding-001
```

#### Grok
```env
LLM_PROVIDER=grok
GROK_API_KEY=your_key
GROK_API_URL=https://api.grok.com/v1/chat/completions
GROK_MODEL=grok-beta
```

### Database Settings

- `MAX_ROWS`: Maximum number of rows to return from queries (default: 500)
- `QUERY_TIMEOUT`: Query timeout in seconds (default: 10)

## 🔒 Security

- Only SELECT queries are allowed
- SQL injection protection through validation
- Query timeout limits
- Row limit enforcement

## 📁 Project Structure
The frontend (built with React + Vite) provides a ChatGPT-style interface. It
renders conversation bubbles, shows row counts and tables when results are
returned, and displays executed SQL below each assistant message.

### 📁 Project Structure
```
ai-db-chatbot/
├── frontend/               # React UI (separate project)
├── server/                 # Python backend and tools
│   ├── app/                # application code
│   ├── config/          # Configuration settings
│   ├── db/              # Database connection and execution
│   ├── llm/             # LLM providers and text-to-SQL
│   ├── memory/          # Chat history management
│   ├── schema/          # Schema registry and selection
│   ├── security/        # SQL validation and safety
│   ├── utils/           # Utilities and logging
│   └── main.py          # CLI utility
├── data/                # Schema embeddings and snapshots
├── tools/               # Schema generation tools
└── requirements.txt     # Python dependencies
```

## 🛠️ Development

### Adding New Schema Tables

1. Update `app/schema/registry.py` with your table/view information
2. Regenerate embeddings using `tools/generate_schema_registry.py`

### Customizing Prompts

Edit the prompt files in `app/prompts/`:
- `sql_prompt.txt`: SQL generation prompt
- `result_prompt.txt`: Result formatting prompt

## 🐛 Troubleshooting

### Database Connection Issues
- Verify your PostgreSQL credentials in `.env`
- Ensure PostgreSQL is running and accessible
- Check firewall settings

### LLM API Errors
- Verify your API key is correct
- Check your API quota/limits
- Ensure the model name is correct for your provider

### Schema Selection Issues
- Ensure `data/schema_embeddings.pkl` exists
- Regenerate embeddings if schema has changed
- Check that schema keys in registry match your database

## 📄 License

[Your License Here]

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

