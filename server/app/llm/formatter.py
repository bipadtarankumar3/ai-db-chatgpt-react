from app.llm.factory import get_llm
from app.utils.logger import get_logger

logger = get_logger(__name__)


# ============================================================
# HARD-LOCKED CSR RESULT PRESENTATION PROMPT
# ============================================================

RESULT_SYSTEM_PROMPT = """
SYSTEM INSTRUCTIONS (HIGHEST PRIORITY)

You are a CSR data presentation assistant.
Your role is to explain data results in a clear, professional,
non-technical manner suitable for CSR managers and leadership.

=====================
STRICT RULES
=====================
1. DO NOT MENTION TECHNICAL DETAILS
   - Never mention SQL, queries, databases, tables, joins, filters, or schemas
   - Assume the audience is non-technical

2. DO NOT CHANGE DATA
   - Never alter values
   - Never infer missing data
   - Never fabricate trends or conclusions

3. TABLE IS ALREADY SHOWN
   - The data table is already visible to the user
   - DO NOT repeat or recreate the table
   - Refer to the data descriptively only

4. EXPLANATION RULES
   - Provide a short explanation (2–4 sentences)
   - Focus on what the data represents
   - Mention totals, breakdowns, or clear patterns only
   - Do NOT speculate or recommend actions

5. DOWNLOAD OPTION
   - Mention that the data can be downloaded as an Excel file
   - Do NOT explain how the file is generated

6. BUSINESS-FRIENDLY LANGUAGE
   - Use CSR terms such as beneficiaries, coverage, districts, programs, projects
   - Avoid technical jargon entirely

=====================
INPUT DATA
=====================
{data}

Original User Question:
{question}

=====================
OUTPUT FORMAT (MANDATORY)
=====================

INSIGHTS:
<2–4 sentence CSR-friendly explanation>

DOWNLOAD:
You can download this data as an Excel file for reporting or sharing.
"""


# ============================================================
# MAIN RESULT FORMATTER
# ============================================================

def format_result(df, question: str = "") -> str:
    """
    Format SQL query results into a CSR-friendly explanation.
    The data table display is handled by the client (CLI, web UI, etc.).
    """

    if df.empty:
        return (
            "INSIGHTS:\n"
            "No data was found for the selected criteria.\n\n"
            "DOWNLOAD:\n"
            "There is no data available to download."
        )

    llm = get_llm()

    # -----------------------------
    # DATA SUMMARY FOR LLM CONTEXT
    # -----------------------------
    row_count = len(df)
    col_count = len(df.columns)
    column_names = list(df.columns)

    sample_size = min(20, row_count)
    sample_df = df.head(sample_size)

    table_preview = sample_df.to_string(index=False)

    data_block = f"""
DATA OVERVIEW
-------------
Total records   : {row_count}
Total fields    : {col_count}
Fields included : {', '.join(column_names)}

Sample data (first {sample_size} records):
{table_preview}
"""

    if row_count > sample_size:
        data_block += f"\nNote: Only a sample of the data is shown above."

    # -----------------------------
    # PROMPT BUILD
    # -----------------------------
    prompt = RESULT_SYSTEM_PROMPT.format(
        data=data_block,
        question=question or "Not provided"
    )

    messages = [
        {
            "role": "system",
            "content": "You are a locked CSR data presentation assistant. Follow instructions strictly."
        },
        {
            "role": "user",
            "content": prompt
        }
    ]

    logger.debug("CSR result formatting prompt:\n%s", prompt)

    result = llm.chat(
        messages=messages,
        temperature=0.3  # Slight flexibility in wording only
    )

    logger.info("CSR result explanation generated successfully")
    return result
