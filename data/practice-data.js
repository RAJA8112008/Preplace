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
      "a": "The problem before\nThe warehouse clerk tried to keep only regions that sold more than a thousand rupees, but wrote that rule next to the date filter. SQL refused because SUM does not exist yet when rows are still loose. They used WHERE SUM(amount) and the kitchen threw.\nWhat this is\nWHERE filters rows before GROUP BY. HAVING filters groups after GROUP BY. You can put sold_on greater than a date in WHERE. You cannot put SUM(amount) greater than 1000 in WHERE. HAVING sees the aggregated columns. WHERE can also use indexed columns to cut rows early.\nWhat it solves\nYou write the weekly sales report in the order SQL actually cooks: cut leftover test rows and old dates, group by region, then drop weak regions. You keep the heavy aggregate off the leftover junk. Interviewers draw a pipeline: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY.\nReal-life example\nA kirana shop. WHERE is throwing out yesterday's spoiled fruit before you weigh the crates. GROUP BY is stacking crates by region. HAVING is sending away any regional crate whose total weight is under a thousand. The bank does the same: drop voided txns first, then keep branches whose deposits exceed a threshold.\nUses\nDashboards: last-quarter rows in WHERE, totals over a bar in HAVING. Pair with ORDER BY total descending. Explain why aliases for SUM sometimes cannot appear in WHERE, and how engines treat HAVING aliases.\nWatch out\nHAVING without GROUP BY is a smell; it behaves like a post-filter on the one big group. Putting a simple column filter in HAVING skips indexes you could have used in WHERE. Do not SELECT star with GROUP BY. WHERE cannot see the group total, no matter how you rename it.",
      "code": "SELECT region, SUM(amount)\nFROM sales\nWHERE sold_on >= '2026-01-01'  -- row filter\nGROUP BY region\nHAVING SUM(amount) > 1000;  -- group filter",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 20,
      "level": "beginner",
      "q": "INNER JOIN vs LEFT JOIN?",
      "a": "The problem before\nThe shop joined customers to sales and the quiet customers vanished. The CEO asked for everyone, including people who bought nothing. The clerk used INNER JOIN and the zero-sale list looked empty, so the warehouse thought those customers had been deleted.\nWhat this is\nINNER JOIN keeps only matching pairs. LEFT JOIN keeps every row from the left table and fills the right side with NULL when there is no match. RIGHT JOIN is the mirror; FULL OUTER keeps both leftovers. You pick LEFT when the left table is the list you must not lose.\nWhat it solves\nYou can report customers with zero sales, products never sold, or regions with no rows this week. You can also demand matches only — INNER — when an orphan sale without a customer is garbage. The join condition belongs in ON, not in WHERE, or a LEFT JOIN quietly becomes an INNER.\nReal-life example\nThe bank's customer book is on the left. The day's slips are on the right. INNER JOIN is only people who transacted. LEFT JOIN is the whole book, with blank slip columns for sleepers. The warehouse parts list LEFT JOIN usage shows bolts that never left the bin.\nUses\nCEO dashboards, funnels, and anti-joins — WHERE right.id IS NULL — to find customers with no sales. Always GROUP BY the customer after a LEFT JOIN if you SUM amounts, and COALESCE the sum to zero if you want 0 not NULL.\nWatch out\nA WHERE s.amount > 0 after a LEFT JOIN drops the NULL rows and turns it into an INNER. Duplicate matches multiply rows: one customer with three sales becomes three lines before SUM. Do not dump phone numbers into a public slide just because the join could see them.",
      "code": "SELECT c.name, SUM(s.amount)\nFROM customers c\nLEFT JOIN sales s ON s.customer_id = c.id\nGROUP BY c.name;",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 21,
      "level": "beginner",
      "q": "What does GROUP BY do?",
      "a": "The problem before\nThe clerk listed every sale and then wanted one line per region. They wrote SELECT region, amount and the engine complained, or worse, picked a random amount. The shop report showed west once with a mystery number that was not the total.\nWhat this is\nGROUP BY collapses rows that share a key into one output row. Every selected column that is not in the group key must be aggregated: SUM, COUNT, AVG, MIN, MAX. One region becomes one line. ORDER BY total descending is how you rank the crates.\nWhat it solves\nYou turn a pile of tickets into a dashboard: sales by region, by week, by clerk. You stop accidentally showing a single ticket as if it were the region. You can GROUP BY date_trunc week of sold_on for a weekly total. COUNT star is tickets; SUM(amount) is rupees.\nReal-life example\nA warehouse canteen. Each lunch slip is a row. GROUP BY stall stacks the slips. SUM is the rupees in that stall's tin. The bank groups deposits by branch. If you ask for stall and one raw slip amount without SUM, you asked for a contradiction.\nUses\nEvery report in this lab. Pair with WHERE for the date window and HAVING for group thresholds. In pandas, groupby region then sum is the same idea. Name columns explicitly instead of SELECT star.\nWatch out\nSELECT region, amount without an aggregate is invalid in strict SQL and dangerous in loose modes. GROUP BY 1 means the first select item — fine if you know the order. NULLs in the key become their own group. Adding a column to SELECT without grouping or aggregating is the usual error.",
      "code": "SELECT region, SUM(amount) AS total\nFROM sales\nGROUP BY region;",
      "ask": "Most asked · Amazon · Microsoft · Google"
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "What is a window function?",
      "a": "The problem before\nThe clerk needed each sale and the region's total on the same line. GROUP BY collapsed the lines and the individual tickets vanished. They ran a second query and taped the numbers together. The warehouse wanted a running total down the aisle without losing the rows.\nWhat this is\nA window function is an aggregate that does not collapse rows. SUM(amount) OVER (PARTITION BY region) writes the region total next to every sale. ORDER BY inside the window gives running totals or ranks. ROW_NUMBER, RANK, and LAG live here. PARTITION BY is the group; the row still exists.\nWhat it solves\nYou can rank clerks, compute a share of region total, show yesterday's amount beside today's, and keep the grain of the original table. Reports that need both detail and context stop needing a self-join. Interviewers love one OVER clause as the step after GROUP BY.\nReal-life example\nA bank teller prints each deposit and, in the margin, the branch's day total. The deposit lines do not disappear. A warehouse picker sees each box and the aisle's running count. The kirana bill shows each item and the bill total on every line — that is a window, not a GROUP BY.\nUses\nLeaderboards, running balances, remove-duplicates with ROW_NUMBER, percent of total. Compare to GROUP BY: collapse versus decorate. Mention frames such as ROWS BETWEEN only if they ask.\nWatch out\nWindows run after WHERE and GROUP BY in the logical order — filtering a window result often needs a subquery. A missing PARTITION BY treats the whole table as one window. They can be expensive on huge scans; that is why they belong on the warehouse, not the checkout primary.",
      "code": "SELECT id, region, amount,\n       SUM(amount) OVER (PARTITION BY region) AS region_total\nFROM sales;",
      "ask": "Most asked · Amazon · Google · Meta"
    },
    {
      "id": 23,
      "level": "beginner",
      "q": "OLTP vs OLAP / warehouse?",
      "a": "The problem before\nThe CEO dashboard ran GROUP BY on the checkout primary at noon. Tills froze. Someone called the same box a warehouse. Another team copied rows by hand into a spreadsheet because they were afraid to touch production. The shop mixed the cash drawer and the monthly report binder.\nWhat this is\nOLTP is the checkout box: fast small writes, indexes for point lookups, the source of truth for orders. OLAP or a warehouse is the report box: big scans, GROUP BY, yesterday's snapshot. You replicate or ETL from OLTP to the warehouse. You do not run the CEO query on the till.\nWhat it solves\nCustomers still pay. Analysts still sum. You can add columns to the warehouse star schema without locking checkout. Authorization still applies: a regional analyst gets WHERE region equals their region even on the replica. HTTPS and login still sit in front of the dash.\nReal-life example\nThe kirana till is OLTP: insert one sale, print a receipt. The back-room ledger that stacks the week by region is the warehouse. The bank's ATM is OLTP. The monthly branch pack is OLAP. If the pack runs on the ATM computer, the queue dies.\nUses\nArchitecture interviews, replica placement, and why dbt or Redshift exist. CRUD stays on OLTP. SUM and GROUP BY at scale move. Say connect to the analytics replica in this lab.\nWatch out\nA replica can lag — a report may miss the last minute. Writing reports that then UPDATE the primary from the warehouse without a rule is how truth splits. SELECT star across the warehouse still leaks PII. Multi-AZ is not a warehouse.",
      "code": "-- app writes → OLTP\n-- SELECT region, SUM(amount) → replica or warehouse",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 24,
      "level": "beginner",
      "q": "Primary key vs foreign key?",
      "a": "The problem before\nThe shop had todos with a user_id that pointed at nobody. Orphan rows sat in the ledger. Two users shared id 1 because nobody declared a primary key. Deletes in the user book left ghost tasks that crashed the join.\nWhat this is\nA primary key uniquely names a row: users.id. A foreign key says this value must exist in the other table: todos.user_id REFERENCES users(id). The database refuses orphans. UNIQUE is related but not the same: email can be unique without being the primary key.\nWhat it solves\nYou keep the graph honest. You cannot attach a sale to a missing customer. Cascades, if you choose them, delete children with the parent — or you restrict so you must clean children first. Interviewers want the sentence: PK identifies, FK refers.\nReal-life example\nA bank account number is the primary key on the account book. A transaction slip's account_id is a foreign key; a slip for a closed missing account is refused. A warehouse bin id is a PK; each box row's bin_id must match a real bin.\nUses\nEvery schema sketch: users, todos, sales, customers. Pair with ON DELETE RESTRICT for money. Use SERIAL or identity for simple PKs. Mention composite keys if they ask about join tables.\nWatch out\nA FK is not a join; you still write JOIN. An index on the FK helps the join and the delete check. Soft-deleted parents still block if the row exists. Do not use name as a PK. Application checks without a FK still race. Name which column identifies the row and which column must point at a real parent, then mention what happens on delete.",
      "code": "user_id INTEGER REFERENCES users(id)",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 25,
      "level": "beginner",
      "q": "How does NULL work in SQL?",
      "a": "The problem before\nThe clerk wrote WHERE region = NULL and got zero rows even though three tickets had no region. They compared NULL equals NULL in their head as true. SUM of a column with holes looked too small. COUNT star and COUNT(region) disagreed and they thought the database was broken.\nWhat this is\nNULL means unknown or not applicable, not the number zero and not the empty string. Any comparison with equals is unknown, not true, so those rows drop out of WHERE. Use IS NULL and IS NOT NULL. SUM and AVG skip NULL. COUNT(col) skips NULL; COUNT star counts rows. COALESCE(amount, 0) turns unknown into zero when you mean zero.\nWhat it solves\nYou can store we do not know the region yet without inventing a fake code. You write honest filters. You choose whether a missing amount is skip-me — SUM — or treat-as-zero — COALESCE. You explain three-valued logic: true, false, unknown.\nReal-life example\nA warehouse box with no aisle tag is NULL, not aisle 0. The bank's missing middle name is NULL, not a space. Adding a blank rupee as 0 would fake a deposit. The kirana region-unknown crate is its own pile when you GROUP BY region.\nUses\nReports, outer joins with NULL on the right, optional columns. Pair IS NULL with LEFT JOIN to find customers with no sales. Always say how the dash treats missing amounts.\nWatch out\nNULL equals NULL is not true. UNIQUE in PostgreSQL allows multiple NULLs unless you write a unique index that says otherwise. NOT IN a subquery with a NULL in the list can return no rows. Defaulting everything to 0 hides real unknowns.",
      "code": "SELECT SUM(COALESCE(amount, 0)) FROM sales;\nSELECT * FROM sales WHERE region IS NULL;",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 26,
      "level": "intermediate",
      "q": "When does an index not help?",
      "a": "The problem before\nThe clerk added ten indexes because a report was slow, then writes crawled and the report was still slow. They wrapped email in LOWER and the index sat unused. They indexed a tiny table of twenty rows. They never ran EXPLAIN.\nWhat this is\nAn index is a side book that helps find rows by a key. It does not help when you read most of the table, when a function hides the column such as WHERE LOWER(email) equals, when the table is tiny, or when the filter is not selective. EXPLAIN shows whether the planner uses an index scan or a seq scan.\nWhat it solves\nYou add the one index that matches the WHERE or the JOIN key. You write WHERE email equals a parameter with a stored lowercase column, or a functional index, on purpose. You measure before and after. You keep write-heavy checkout tables from wearing ten unused books.\nReal-life example\nA warehouse index on aisle helps if you ask for aisle west. If you ask to weigh every box in the building, walking the index is slower than walking the aisle. A bank book of twenty accounts does not need a card catalogue. LOWER(name) is asking the catalogue for a name you scribbled in another script.\nUses\nInterview follow-up after add an index. Pair with cardinality: region equals west on a table that is 99 percent west is a bad bet. Use EXPLAIN ANALYZE on the replica, not on a guess.\nWatch out\nIndexes speed reads and slow writes. Too many indexes bloat storage. A leading-wildcard LIKE percent-west will not use a normal btree. Updating the indexed column maintains the book. Measure; do not collect indexes like stamps.",
      "code": "EXPLAIN SELECT * FROM sales WHERE region = 'west';",
      "ask": "Most asked · Amazon · Google"
    }
  ]
};
