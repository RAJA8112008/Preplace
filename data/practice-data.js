window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["practice-data"] = {
  "kind": "practice",
  "notes": [
    {
      "title": "Most asked",
      "body": "After the hands-on labs, open questions tagged Most asked. Those are the interview questions Amazon, Google, Meta, and Microsoft repeat. Same easy comments on the right of the code."
    },
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
    },
    {
      "id": 19,
      "level": "beginner",
      "q": "WHERE vs HAVING?",
      "a": "WHERE filters rows before the group. HAVING filters groups after GROUP BY. You cannot put SUM(amount) in WHERE.",
      "code": "SELECT region, SUM(amount)\nFROM sales\nWHERE sold_on >= '2026-01-01'  -- row filter\nGROUP BY region\nHAVING SUM(amount) > 1000;  -- group filter",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 20,
      "level": "beginner",
      "q": "INNER JOIN vs LEFT JOIN?",
      "a": "INNER: only matching pairs. LEFT: every left row, NULLs on the right if no match. Use LEFT when you must keep customers with zero sales.",
      "code": "SELECT c.name, SUM(s.amount)\nFROM customers c\nLEFT JOIN sales s ON s.customer_id = c.id\nGROUP BY c.name;",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 21,
      "level": "beginner",
      "q": "What does GROUP BY do?",
      "a": "It collapses rows that share a key into one output row. Non-grouped columns must be aggregated (SUM, COUNT). If you SELECT region, amount without an aggregate, SQL will complain (or pick a random amount).",
      "code": "SELECT region, SUM(amount) AS total\nFROM sales\nGROUP BY region;",
      "ask": "Most asked · Amazon · Microsoft · Google"
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "What is a window function?",
      "a": "An aggregate that does not collapse rows. SUM(amount) OVER (PARTITION BY region) gives a running or group total next to each sale.",
      "code": "SELECT id, region, amount,\n       SUM(amount) OVER (PARTITION BY region) AS region_total\nFROM sales;",
      "ask": "Most asked · Amazon · Google · Meta"
    },
    {
      "id": 23,
      "level": "beginner",
      "q": "OLTP vs OLAP / warehouse?",
      "a": "OLTP is the checkout box — fast small writes. OLAP / warehouse is the report box — big scans and GROUP BY. Do not run the CEO dashboard on the checkout primary.",
      "code": "-- app writes → OLTP\n-- SELECT region, SUM(amount) → replica or warehouse",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 24,
      "level": "beginner",
      "q": "Primary key vs foreign key?",
      "a": "A primary key uniquely names a row (users.id). A foreign key says this value must exist in the other table (todos.user_id → users.id). That is how you keep orphan todos from appearing.",
      "code": "user_id INTEGER REFERENCES users(id)",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 25,
      "level": "beginner",
      "q": "How does NULL work in SQL?",
      "a": "NULL means unknown. NULL = NULL is not true. Use IS NULL. SUM skips NULL. COUNT(col) skips NULL, COUNT(*) counts rows.",
      "code": "SELECT SUM(COALESCE(amount, 0)) FROM sales;\nSELECT * FROM sales WHERE region IS NULL;",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 26,
      "level": "intermediate",
      "q": "When does an index not help?",
      "a": "A query that reads most of the table, or a function on the column (WHERE LOWER(email) = …) that the index cannot use. Also tiny tables. Measure EXPLAIN before you add ten indexes.",
      "code": "EXPLAIN SELECT * FROM sales WHERE region = 'west';",
      "ask": "Most asked · Amazon · Google"
    }
  ]
};
