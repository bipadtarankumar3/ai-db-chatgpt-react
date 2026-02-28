SCHEMA_REGISTRY = {

    # =========================
    # DIMENSION TABLES
    # =========================

    "states": {
        "type": "table",
        "description": "List of Indian states. Used to map state_id to state_name.",
        "grain": "One row per state",
        "schema": """
        states(
            state_id,        -- integer, primary key
            state_name       -- varchar, unique
        )
        """
    },

    "years": {
        "type": "table",
        "description": "Financial or calendar years used for reporting.",
        "grain": "One row per year",
        "schema": """
        years(
            year_id,         -- integer, primary key
            year_name        -- varchar (e.g. 2023-24)
        )
        """
    },

    # =========================
    # CORE TABLES
    # =========================

    "projects": {
        "type": "table",
        "description": "CSR projects with associated state and year.",
        "grain": "One row per project",
        "schema": """
        projects(
            project_id,      -- integer, primary key
            project_name,    -- varchar
            start_date,      -- date
            end_date,        -- date (nullable)
            state_id,        -- integer, FK to states
            year_id          -- integer, FK to years
        )
        """
    },

    "budgets": {
        "type": "table",
        "description": "Budget amounts allocated to projects.",
        "grain": "One row per budget entry per project",
        "schema": """
        budgets(
            budget_id,       -- integer, primary key
            project_id,      -- integer, FK to projects
            amount           -- numeric(12,2)
        )
        """
    },

    # =========================
    # AGGREGATED / BUSINESS VIEWS
    # =========================

    "csr_expenditure_view": {
        "type": "view",
        "description": "CSR expenditure aggregated by state and year.",
        "grain": "One row per state per year",
        "schema": """
        csr_expenditure_view(
            state_name,
            financial_year,
            expenditure_amount
        )
        """
    }
}
