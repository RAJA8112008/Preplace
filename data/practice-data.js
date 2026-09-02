window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["practice-data"] = {
  "kind": "practice",
  "notes": [
    {
      "title": "How to use this lab",
      "body": "CRUD here is rows in a table. Auth is who may see this report."
    },
    {
      "title": "SQL CRUD",
      "body": "INSERT a sale, SELECT a report, UPDATE a typo, DELETE a test row."
    },
    {
      "title": "Authorization",
      "body": "A regional analyst sees their region. WHERE team = $1."
    }
  ],
  "examples": [
    {
      "title": "CREATE + INSERT",
      "lang": "sql",
      "desc": "One sales table.",
      "code": "CREATE TABLE sales (\n  id SERIAL PRIMARY KEY,\n  region TEXT,\n  amount NUMERIC,\n  sold_on DATE\n);\nINSERT INTO sales (region, amount, sold_on) VALUES ('west', 99, '2026-01-02');"
    },
    {
      "title": "Read report",
      "lang": "sql",
      "desc": "SUM by region.",
      "code": "SELECT region, SUM(amount) AS total\nFROM sales\nGROUP BY region\nORDER BY total DESC;"
    },
    {
      "title": "Update a typo",
      "lang": "sql",
      "desc": "WHERE id.",
      "code": "UPDATE sales SET region = 'east' WHERE id = 3;"
    },
    {
      "title": "Delete test rows",
      "lang": "sql",
      "desc": "Always WHERE.",
      "code": "DELETE FROM sales WHERE region = 'test';"
    },
    {
      "title": "Python read",
      "lang": "python",
      "desc": "pandas + SQL.",
      "code": "import pandas as pd\ndf = pd.read_sql(\"SELECT region, SUM(amount) t FROM sales GROUP BY 1\", conn)\nprint(df)"
    },
    {
      "title": "Share a CSV safely",
      "lang": "js",
      "desc": "No passwords in the file.",
      "code": "df.to_csv(\"report.csv\", index=False)"
    },
    {
      "title": "Row filter as authz",
      "lang": "sql",
      "desc": "Analyst only sees west.",
      "code": "SELECT * FROM sales WHERE region = $1;"
    },
    {
      "title": "HTTPS dashboard",
      "lang": "sql",
      "desc": "Put the dash behind login + HTTPS.",
      "code": "-- users open https://dash.example.com"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "Practice: create a sales row",
      "a": "INSERT one sale.",
      "code": "INSERT INTO sales (region, amount, sold_on) VALUES ('north', 50, CURRENT_DATE);"
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "Practice: weekly total",
      "a": "SUM + date_trunc.",
      "code": "SELECT date_trunc('week', sold_on), SUM(amount) FROM sales GROUP BY 1;"
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "Practice: fix a wrong amount",
      "a": "UPDATE ... WHERE id.",
      "code": "UPDATE sales SET amount = 80 WHERE id = 4;"
    },
    {
      "id": 4,
      "level": "beginner",
      "q": "Practice: remove test data",
      "a": "DELETE WHERE.",
      "code": "DELETE FROM sales WHERE region = 'test';"
    },
    {
      "id": 5,
      "level": "intermediate",
      "q": "Practice: region authz",
      "a": "Bind the user's region.",
      "code": "SELECT * FROM sales WHERE region = $1;"
    },
    {
      "id": 6,
      "level": "intermediate",
      "q": "Practice: pandas chart data",
      "a": "read_sql then print.",
      "code": "df = pd.read_sql(\"SELECT region, SUM(amount) t FROM sales GROUP BY 1\", conn)"
    },
    {
      "id": 7,
      "level": "beginner",
      "q": "Why not SELECT * for a dashboard?",
      "a": "Name the columns you need.",
      "code": "SELECT region, SUM(amount) FROM sales GROUP BY 1;"
    },
    {
      "id": 8,
      "level": "intermediate",
      "q": "Practice: export without PII",
      "a": "Do not SELECT email if the chart does not need it.",
      "code": "SELECT region, amount, sold_on FROM sales;"
    },
    {
      "id": 9,
      "level": "advanced",
      "q": "Practice: warehouse vs OLTP",
      "a": "Heavy GROUP BY on a replica.",
      "code": "-- connect to analytics replica"
    },
    {
      "id": 10,
      "level": "beginner",
      "q": "Practice: HTTPS share link",
      "a": "Upload the HTML report to a host with login.",
      "code": "// https://dash.example.com/weekly"
    },
    {
      "id": 11,
      "level": "intermediate",
      "q": "Practice: parameterized SQL in Python",
      "a": "Never format email into the string.",
      "code": "pd.read_sql(\"SELECT * FROM sales WHERE region = %(r)s\", conn, params={\"r\": region})"
    },
    {
      "id": 12,
      "level": "beginner",
      "q": "Practice: COUNT vs SUM",
      "a": "COUNT is how many rows. SUM is the money.",
      "code": "SELECT COUNT(*), SUM(amount) FROM sales;"
    },
    {
      "id": 13,
      "level": "intermediate",
      "q": "Practice: login for the dash",
      "a": "Even analysts need a password.",
      "code": "// same cookie flags as the web app"
    },
    {
      "id": 14,
      "level": "advanced",
      "q": "Practice: row level security sketch",
      "a": "Postgres RLS.",
      "code": "CREATE POLICY p ON sales USING (region = current_setting('app.region'));"
    },
    {
      "id": 15,
      "level": "beginner",
      "q": "Practice: NULL amounts",
      "a": "SUM skips NULL. COALESCE if you need zero.",
      "code": "SELECT SUM(COALESCE(amount, 0)) FROM sales;"
    },
    {
      "id": 16,
      "level": "intermediate",
      "q": "Practice: join customers safely",
      "a": "Do not dump phone numbers into a public slide.",
      "code": "SELECT c.name, SUM(s.amount) FROM sales s JOIN customers c ON c.id = s.customer_id GROUP BY 1;"
    },
    {
      "id": 17,
      "level": "beginner",
      "q": "Practice: save the query in Git",
      "a": "report_weekly.sql in the repo.",
      "code": "-- report_weekly.sql"
    },
    {
      "id": 18,
      "level": "intermediate",
      "q": "Practice: 401 on the dash API",
      "a": "No cookie → no JSON.",
      "code": "if (!req.session.userId) return res.status(401).json({ error: \"login\" });"
    }
  ]
};
