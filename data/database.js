window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["database"] = {
  "kind": "design",
  "notes": [
    {
      "title": "Before you pick a store",
      "body": "The problem before\nDo not keep the only copy of users in a JSON file on one laptop. A second server cannot see that file. A crash wipes it. Two tabs write at once and one update vanishes. The browser must never hold the database password.\n\nWhat this is\nDecide what one record is (a user, an order) and what questions you will ask (login by email, orders for this user). Then pick an engine. The app talks to it with a driver. The database owns the disk, the locks, the indexes, and the backup.\n\nWhat it solves\nMany people click at once. A crash must not lose a paid order. An email must stay unique. Search must not scan a million rows by hand. The app only sends a query and gets rows or documents back.\n\nReal-life example\nA kirana register. The shop does not keep the only customer list on a sticky note in one drawer. The register is shared, it survives closing the shop, and two cashiers cannot sell the last bag twice.\n\nUses\nEvery product that remembers users. Start with one SQL database. Add Redis when a hot read hurts. Add Mongo when a nested document is the natural shape. Add a vector store only when search must match meaning.\n\nWatch out\nPicking a brand from a tweet before you write three queries. Five databases on day one is slower than one Postgres you understand."
    },
    {
      "title": "What a database is",
      "layers": [
        [
          {
            "label": "App"
          }
        ],
        [
          {
            "label": "Database",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Request",
        "App",
        "Query",
        "Rows / docs",
        "Response"
      ],
      "body": "The problem before\nA JSON file on one laptop is not a product store. Restart the box and the list is gone. Two Node processes cannot share it. There is no unique email, no crash recovery, and no way to ask 'orders for this user' without reading the whole file.\n\nWhat this is\nA database is software that stores shared data with rules, so many users can read and write safely. SQL engines (Postgres, MySQL) use tables. Document engines (MongoDB) use JSON-like documents. The app sends a query. The engine returns rows or documents. You pick from the shape of the data and the questions you ask.\n\nWhat it solves\nDisk, locks, indexes, and backups live in one place. A paid order survives a crash. Login by email is a lookup, not a scan. Two cashiers cannot both sell the last seat if the engine enforces the rule.\n\nReal-life example\nThe shop register, not a paper in someone's pocket. Anyone at the counter can look up Ada. Closing the shutter does not shred the book.\n\nUses\nUsers, orders, inventory, anything that must outlive one process. The browser never talks to it with the admin password. Node or Python holds the driver.\n\nWatch out\nCalling Redis 'the database' when it is only a cache. A cache can vanish. Truth belongs in a real store."
    },
    {
      "title": "OLTP vs OLAP",
      "flow": [
        "User click",
        "OLTP write",
        "Night copy",
        "OLAP report"
      ],
      "body": "The problem before\nCheckout and the weekly revenue report share one small Postgres box. At noon the report locks writers. Cards spin. Money waits on a SUM.\n\nWhat this is\nOLTP is the live app: create order, change email, one or few rows, fast answers. OLAP is analytics: sum sales by week across millions of rows. Warehouses (BigQuery, Redshift, Snowflake) and column stores help OLAP. Postgres can do both at small scale. At large scale you split.\n\nWhat it solves\nThe cashier stays fast. The analyst still gets a year of totals. You copy data at night (or stream it) so the report does not sit on the checkout primary.\n\nReal-life example\nThe front counter takes money now. The back office adds last month's books after closing. You do not make the queue wait while someone counts every receipt from April.\n\nUses\nLogin, add-to-cart, pay → OLTP. Weekly GMV, funnel charts, tax export → OLAP or a replica. Say which one a query is before you run it on production.\n\nWatch out\nSELECT SUM on the live orders table at peak. A 20-second report on the checkout primary is an outage with a spreadsheet."
    },
    {
      "title": "ACID",
      "body": "The problem before\nYou debit Ada and credit Bob as two separate writes. The second fails. Ada lost 50. Bob got nothing. Or two checkouts read stock = 1 and both sell the last bag.\n\nWhat this is\nACID is four promises. Atomicity: the whole transaction happens or none of it. Consistency: rules (PRIMARY KEY, UNIQUE, CHECK) stay true after COMMIT. Isolation: two checkouts do not scramble the same stock row. Durability: after COMMIT, a crash should not lose the write. BEGIN / COMMIT is how SQL bundles the story.\n\nWhat it solves\nMoney, seats, and inventory stay honest. A cache does not promise this. A queue does not promise this. Say which of the four you need before you pick Redis as the only store.\n\nReal-life example\nA money transfer is one slip: take 50 from drawer A and put 50 in drawer B. If the second step fails, you put the 50 back. You do not leave the shop with a hole in one drawer.\n\nUses\nPayments, booking a seat, transferring stock, creating a user plus a welcome row. Interviewers want you to name all four letters and one example each.\n\nWatch out\nTwo UPDATE statements with no transaction. One succeeds, the other fails, and you cannot undo. Also: Redis SET is not durability for an order."
    },
    {
      "title": "CAP in one sentence",
      "body": "The problem before\nTwo data centers cannot talk. If every node still takes writes, readers see different balances. If you refuse writes until the split heals, the shop looks down. You cannot have both on that cut wire.\n\nWhat this is\nCAP is a trade-off under a network partition. Consistency: every reader sees the same latest write. Availability: every working node still answers. Partition tolerance is the split itself — you assume it can happen. On the split you pick C or A. You do not pick 'all three always'.\n\nWhat it solves\nYou say out loud what the product does when the cable breaks. A bank ledger leans C: better to pause than to show two balances. A shopping-cart cache can lean A: show a slightly stale cart rather than a blank page.\n\nReal-life example\nTwo shop counters with a broken phone line. Either they stop selling until they can agree the stock (C), or both keep selling and you reconcile later (A). You cannot do both and still tell the truth.\n\nUses\nDistributed SQL, Dynamo-style stores, replica failover talks. Use CAP to explain the failure, then name your actual engine (Postgres primary, DynamoDB, Cosmos).\n\nWatch out\nUsing CAP as a reason to skip backups. CAP is not a license for 'eventual' money. Also: a single-box Postgres is not a CAP debate — it is one machine."
    },
    {
      "title": "Schema and constraints",
      "body": "The problem before\nThe app writes whatever JSON arrived. One user has email. The next has mail. Age is a string. Reports break. Two users share an email because nothing refused the second INSERT.\n\nWhat this is\nA schema is the agreed shape: columns, types, required fields. Constraints refuse bad rows even if the app has a bug. PRIMARY KEY: one id per row. UNIQUE: one email. FOREIGN KEY: this order.user_id must exist. CHECK: price >= 0. Schemaless stores still have a schema in the application — it just is not enforced by the engine.\n\nWhat it solves\nThe database is the last guard. A buggy handler cannot insert a user without an email if the column is NOT NULL UNIQUE. Joins and reports stay possible because every row looks like the others.\n\nReal-life example\nA form at the counter. The register will not accept a customer with no name and two different spellings of the same phone. The rule is printed on the book, not only in the cashier's head.\n\nUses\nEvery SQL table. Migrations check the schema into Git. In Mongo, a validator or a Mongoose schema is the same idea.\n\nWatch out\n'We will validate only in Express.' One missed route writes garbage. If every document looks different, you do not have flexibility — you have a junk drawer."
    },
    {
      "title": "Indexes",
      "flow": [
        "WHERE email = ?",
        "Index lookup",
        "Row"
      ],
      "body": "The problem before\nLogin does SELECT * FROM users WHERE email = ?. A million users means a million row walk. The page hangs. CPU is busy reading rows that are not Ada.\n\nWhat this is\nAn index is a lookup structure so the engine does not scan every row. Think of a book index: jump to the page for 'email', do not read every page. Index columns you filter and join on. EXPLAIN (SQL) or explain() (Mongo) shows whether a query used an index.\n\nWhat it solves\nHot lookups stay fast as the table grows. Login, 'orders for this user_id', and foreign-key joins are the usual wins. A missing index on a hot filter is the usual production slowness.\n\nReal-life example\nA phone book vs flipping every page in the census. You paid a little extra paper (the index) so you do not search the whole city for one number.\n\nUses\nUNIQUE on email (lookup + constraint). INDEX on orders(user_id). Composite (shop_id, created_at) if you always filter both. Covering indexes when you want to avoid the table heap.\n\nWatch out\nIndexing every column 'just in case'. Each index slows INSERT and UPDATE. Also: an index on the wrong column does nothing for the query you actually run. Read EXPLAIN."
    },
    {
      "title": "Replication",
      "layers": [
        [
          {
            "label": "Primary",
            "tone": "store"
          },
          {
            "label": "Replica",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Write primary",
        "Copy to replica",
        "Read replica"
      ],
      "body": "The problem before\nOne box holds every read and write. It dies. The site is gone. Or it lives but SELECT for the homepage drowns the same disk that is trying to COMMIT payments.\n\nWhat this is\nA replica is a copy of the data on another machine. Writes go to a primary. Replicas help reads and failover. Async replicas apply the log later — they can lag. Sync replicas wait until the copy is safe — writes are slower. Streaming replication (Postgres) and replica sets (Mongo) are this idea.\n\nWhat it solves\nReads scale out. If the primary dies, a rehearsed failover promotes a replica. You can run heavy reports on a replica so checkout stays fast.\n\nReal-life example\nThe main register and a photocopy in the back room. Sales are written in the main book. The copy is for looking up old bills. If the main book burns, you need a plan to make the copy the new main book — and you practiced that plan.\n\nUses\nRead replicas for GET /feed. Promote a replica on primary failure. Keep signup INSERT + the next SELECT on the primary so you do not hit lag.\n\nWatch out\nRedirect to /me after signup and read a lagging replica: 'user not found'. Failover is a rehearsed plan, not a checkbox in the cloud console you never tested."
    },
    {
      "title": "Sharding (partitioning)",
      "body": "The problem before\nOne primary cannot hold the disk or the write traffic. Adding replicas does not help writes — they all still hit one box. You need to split the data.\n\nWhat this is\nSharding (partitioning) splits rows across machines by a key: user_id, tenant_id, shop_id. Each shard is its own smaller database. A query that includes the shard key stays on one machine. Cross-shard joins and unique emails across the whole planet are hard.\n\nWhat it solves\nWrites scale out. One tenant's data lives together. You grow by adding shards, not by buying an infinite primary.\n\nReal-life example\nOne filing cabinet per city, labeled by city name. Ada's file is only in Pune. You do not search every city for her if you already know the city. If you filed by 'today's date', today's folder is a mountain and yesterday is empty.\n\nUses\nHuge multi-tenant SaaS, chat messages, time-series when one box is truly full. In interviews, name the shard key and one query that stays on one shard.\n\nWatch out\nSharding too early. Prefer a bigger box and replicas first. A bad key (only created_at) makes one hot shard. Moving a user to another shard is a migration, not a config toggle."
    },
    {
      "title": "Backups and point-in-time",
      "flow": [
        "Night snapshot",
        "WAL / oplog",
        "Restore to 14:03"
      ],
      "body": "The problem before\nSomeone ran DELETE without a WHERE. The only copy was that disk. Last night's file is on the same disk, which is now empty. Or you have a snapshot from 2am and the bug was at 14:03 — a day's orders are gone.\n\nWhat this is\nA backup is a copy you can restore. A snapshot is a point-in-time picture. WAL / binlog / oplog is the diary of writes after the snapshot. Together they let you restore to 14:03, not only to last night. Point-in-time recovery (PITR) is that pair.\n\nWhat it solves\nYou can undo a bad deploy or a bad query. Off-site copies survive the building. Encryption keeps a stolen backup from being an open customer list.\n\nReal-life example\nA photocopy of the register in another shop, plus the day's slip roll. If the book burns at 3pm, you restore last night's copy and replay the slips until 2:59.\n\nUses\nNightly snapshots, continuous WAL archive, a quarterly restore drill, encrypt-at-rest for user data. Cloud 'automated backups' still need a restore test.\n\nWatch out\nAn untested backup is a hope. Backups on the same disk as live data die together. Never log the restore password in Slack."
    },
    {
      "title": "How to pick a store",
      "body": "The problem before\nThe team picks five brands on day one because a thread said so. Nobody wrote the queries. Login, money, and a weekly sum now span three engines and nobody can join them.\n\nWhat this is\nWrite three queries you must support on day one. Then pick the engine. SQL is the default for truth. Redis is for speed and shared counters. Mongo is for documents. Vectors are for meaning. Kafka is for events. Name the job, then the store.\n\nWhat it solves\nYou do not force one tool to do every job, and you do not start with a zoo. Most products start with one SQL database and add the others when a need appears.\n\nReal-life example\nYou do not rent a warehouse, a freezer, and a post office before you know whether you sell milk, ice cream, or letters. Write the first three customer questions. Then rent the room.\n\nUses\nTables + money + joins → Postgres or MySQL. Flexible documents + Node team → MongoDB. Hot keys, TTL, sessions → Redis. Huge append logs → Kafka or a warehouse. Similarity search → pgvector or a vector store. Friends-of-friends → Neo4j.\n\nWatch out\nFive databases on day one. Also: picking Mongo because 'schema-less' when you still need unique email and money."
    },
    {
      "title": "Transactions",
      "flow": [
        "BEGIN",
        "writes",
        "COMMIT or ROLLBACK"
      ],
      "body": "The problem before\nCreate order, decrement stock, insert payment as three statements. The third fails. You have an order and missing stock, and no payment. Support cannot tell which truth to keep.\n\nWhat this is\nA transaction is a bundle of reads and writes that should succeed together. BEGIN starts it. COMMIT saves all of it. ROLLBACK undoes all of it. That is Atomicity. Isolation levels (READ COMMITTED, REPEATABLE READ, SERIALIZABLE) say what other transactions may see while you are still open.\n\nWhat it solves\nMoney and stock stay paired. A failed card charge does not leave a hole in inventory. The app can retry the whole story.\n\nReal-life example\nOne slip: take the bag off the shelf and take the cash. If the card machine dies, the bag goes back. You do not leave the shelf empty and the till unchanged.\n\nUses\nTransfers, checkout, 'create user + profile row', booking a unique seat. Keep transactions short. Do not hold a transaction open across a network call to a payment vendor.\n\nWatch out\nA transaction that lasts seconds while you await Stripe. Locks pile up. Checkout for everyone else stalls. Do the external call outside, then a short COMMIT."
    },
    {
      "title": "Foreign keys",
      "body": "The problem before\norders.user_id = 99 but user 99 was deleted. Or never existed. The report joins to nothing. The UI shows a ghost order.\n\nWhat this is\nA FOREIGN KEY says this column must match a PRIMARY KEY in another table. ON DELETE RESTRICT refuses to delete a user who still has orders. ON DELETE CASCADE deletes the child rows too — use it only when the child has no meaning alone. ON DELETE SET NULL clears the pointer.\n\nWhat it solves\nThe engine refuses an orphan. A buggy DELETE cannot wipe a user and leave paid orders pointing at air.\n\nReal-life example\nYou cannot file an order slip for a customer number that is not in the customer book. The clerk stamps 'no such account' instead of filing a ghost.\n\nUses\norders.user_id → users.id. order_items.order_id → orders.id. Almost every 'belongs to' in a relational model.\n\nWatch out\nTurning off foreign keys 'for speed' in production. You will invent orphans. Also: CASCADE on users → posts may delete more than you meant. Prefer RESTRICT until you can say the child should die with the parent."
    },
    {
      "title": "Connection pool",
      "body": "The problem before\nEvery request does new Client(), connect, query, end. A traffic spike opens 500 connections. Postgres max_connections is 100. New logins fail with 'too many connections' while the app is 'up'.\n\nWhat this is\nA pool is a small set of open connections the app reuses. Each query borrows one and returns it. A pool of 10–20 per Node process is common. The process holds one Pool, not one client per handler.\n\nWhat it solves\nYou stay under the server limit. Connect cost is paid once. Idle clients are not leaked in every request.\n\nReal-life example\nTen phones on the counter, not a new phone for every customer. When the call ends, the phone goes back on the hook. You do not string 500 wires to the exchange.\n\nUses\npg.Pool, mysql2 pool, Prisma, SQLAlchemy pool. Size it from (instances × pool) < max_connections, leave room for admin and replicas.\n\nWatch out\nnew Client() inside every Express handler. Forgetting to release on error. A pool of 100 on 20 dynos is 2000 connections — that is how you knock over a small RDS box."
    },
    {
      "title": "Migrations",
      "body": "The problem before\nSomeone ALTER TABLEs production by hand. Staging does not match. A new column exists only on one box. The next deploy crashes because the code expects a column the other environments never got.\n\nWhat this is\nA migration is a checked-in SQL (or ORM) file that changes the schema in order: 001_users.sql, 002_orders.sql. Every environment runs the same files. Expand-contract: add the new column, deploy code that writes both, then drop the old column later.\n\nWhat it solves\nDev, staging, and prod stay the same shape. You can roll forward. Git is the history of the schema, not a screenshot of last Tuesday's console.\n\nReal-life example\nA numbered recipe book. Shop B and shop A cook from the same page 14. Nobody adds a spice to one kitchen from memory.\n\nUses\nnode-pg-migrate, Prisma migrate, Flyway, Alembic. Review migrations like code. Backup before a destructive one.\n\nWatch out\nChanging production by hand. A migration that rewrites a 50 million row table in one lock during peak. Split it: add nullable column, backfill in batches, then constrain."
    },
    {
      "title": "N+1 queries",
      "body": "The problem before\nYou load 50 orders, then for each order you SELECT the user. That is 1 + 50 queries. The list page takes a second. The database log is a stack of identical SELECTs.\n\nWhat this is\nN+1 means one query for the list, then N queries for each child's parent (or each parent's children). The fix is one join or one IN (...) / WHERE id = ANY($1). ORMs do this if you include / prefetch. They do N+1 if you lazy-load in a loop.\n\nWhat it solves\nThe list stays one or two round trips. Latency drops. You stop surprising the connection pool.\n\nReal-life example\nYou need 50 customer names. You do not walk to the customer book 50 times. You take the 50 ids and look them up in one pass.\n\nUses\nJOIN users ON users.id = orders.user_id. SELECT * FROM users WHERE id IN (...). Prisma include, Django prefetch_related, SQLAlchemy joinedload.\n\nWatch out\nA for-loop with await db.user.find(order.userId). It looks tidy and dies in production. Log query counts on list endpoints."
    },
    {
      "title": "EXPLAIN and slow queries",
      "body": "The problem before\nA page is slow. You add RAM. It is still slow. Nobody asked the engine how it runs the SQL. It is doing a sequential scan on ten million rows for a login.\n\nWhat this is\nEXPLAIN shows the plan: seq scan vs index scan, estimated rows, sort, join type. EXPLAIN ANALYZE runs it and shows real time. A seq scan on a huge table for WHERE email = ? means you need an index. A nested loop over two big tables may want a hash join or a better filter.\n\nWhat it solves\nYou fix the query or the index instead of guessing. You can prove the index is used before you ship.\n\nReal-life example\nYou ask the clerk 'how will you find Ada?' If the answer is 'read every slip', you buy the phone book (the index) before opening hour.\n\nUses\nEXPLAIN ANALYZE SELECT ... WHERE email = $1. pg_stat_statements for the worst queries in production. Mongo explain('executionStats').\n\nWatch out\nAdding an index without EXPLAIN, then wondering why nothing changed. Also: running EXPLAIN ANALYZE on a huge UPDATE in production — ANALYZE actually runs the statement."
    }
  ],
  "examples": [
    {
      "title": "One row is one fact",
      "lang": "sql",
      "desc": "Before you use this\nDecide what one row means — here, one student. Pick a unique id. You need a SQL engine before INSERT.\n\nWhat this is\nA table holds rows of the same kind.\n\nWhy we use it\nThe app should not keep the only copy of people in a file. The table is the shared, typed list. PRIMARY KEY stops two identical mystery rows.\n\nWhat the code is doing\nstudents has id and name. Each INSERT is one person. SERIAL makes the next id.\n\nWatch out\nTwo people with no primary key look identical.",
      "code": "-- one table, one kind of row\nCREATE TABLE students (\n  id   SERIAL PRIMARY KEY,  -- unique person\n  name TEXT NOT NULL        -- cannot be empty\n);\n\nINSERT INTO students (name) VALUES ('Ada');  -- add one row"
    },
    {
      "title": "A transaction that must all succeed",
      "lang": "sql",
      "flow": [
        "BEGIN",
        "debit",
        "credit",
        "COMMIT or ROLLBACK"
      ],
      "desc": "Before you use this\nYou already have an accounts table with balances. Two rows must change as one story: send 50 and receive 50.\n\nWhat this is\nA transaction is a bundle of SQL that should succeed together. That is Atomicity in ACID.\n\nWhy we use it\nWe use BEGIN / COMMIT so money cannot vanish on one side. If the second UPDATE fails, ROLLBACK undoes the first. A cache cannot promise this.\n\nWhat the code is doing\nBEGIN, debit account 1, credit account 2, COMMIT. Any error → ROLLBACK.\n\nWatch out\nTwo statements without a transaction: one can succeed and the other fail.",
      "code": "BEGIN;  -- start the bundle\nUPDATE accounts SET bal = bal - 50 WHERE id = 1;  -- send\nUPDATE accounts SET bal = bal + 50 WHERE id = 2;  -- receive\nCOMMIT;  -- both saved, or neither"
    },
    {
      "title": "Read after write on a replica",
      "lang": "js",
      "flow": [
        "INSERT primary",
        "read replica",
        "maybe lag"
      ],
      "desc": "Definition. A replica may be a few milliseconds behind.\n\nHow it works. After signup, read the user from the primary, not a lagging replica.\n\nOperational risk. Redirect to /me and the replica says user not found.",
      "code": "await primary.query(\"INSERT INTO users(email) VALUES ($1)\", [email]);  // write truth\nconst me = await primary.query(\"SELECT * FROM users WHERE email = $1\", [email]);  // read primary\n// replica.query here can miss the new row"
    },
    {
      "title": "Index the filter you actually use",
      "lang": "sql",
      "desc": "Definition. WHERE email = ? should hit an index.\n\nHow it works. CREATE INDEX on email. Login stops scanning the table.\n\nOperational risk. Indexing every column 'just in case' slows every write.",
      "code": "CREATE INDEX idx_users_email ON users (email);  -- login lookup\n\nSELECT id FROM users WHERE email = 'ada@test.com';  -- uses the index"
    },
    {
      "title": "OLTP insert vs OLAP sum",
      "lang": "sql",
      "desc": "Definition. Checkout inserts one order. A report sums a year.\n\nHow it works. Keep the report on a warehouse or a replica, not on the checkout primary at noon.\n\nOperational risk. SELECT SUM on the live orders table locking writers.",
      "code": "-- OLTP: one new order\nINSERT INTO orders (user_id, total) VALUES (9, 499);\n\n-- OLAP: run this on a warehouse / replica\nSELECT date_trunc('week', created_at), SUM(total)\nFROM orders\nGROUP BY 1;"
    },
    {
      "title": "Connection pool",
      "lang": "js",
      "desc": "Definition. The app reuses a few database connections instead of opening one per request.\n\nHow it works. A pool of 10–20 is common. Each query borrows and returns.\n\nOperational risk. new Client() inside every handler exhausts Postgres max_connections.",
      "code": "const pool = new Pool({ max: 20 });  // share this\nconst { rows } = await pool.query(\"SELECT 1\");  // borrow, then release"
    },
    {
      "title": "Migrations are versioned schema",
      "lang": "sql",
      "desc": "Definition. A migration is a checked-in SQL file that changes the schema.\n\nHow it works. 001_users.sql creates the table. Every environment runs the same files in order.\n\nOperational risk. Changing production by hand so staging no longer matches.",
      "code": "-- 001_create_users.sql\nCREATE TABLE users (\n  id    SERIAL PRIMARY KEY,\n  email TEXT UNIQUE NOT NULL\n);"
    },
    {
      "title": "Pick a store in one paragraph",
      "lang": "txt",
      "flow": [
        "Need",
        "Shape",
        "Engine"
      ],
      "desc": "Before you use this\nWrite the queries first: login by email, orders for this user, session for 30 minutes, search by meaning. Then pick a store. Do not pick a brand from a tweet.\n\nWhat this is\nA one-paragraph pick: access pattern → engine.\n\nWhy we use it\nDifferent jobs need different stores. One SQL database starts most products. Redis, Mongo, and vectors are add-ons when a need appears.\n\nWhat the code is doing\nThe list maps a need to an engine. Say this sentence in an interview.\n\nWatch out\nFive databases on day one is slower than one Postgres you understand.",
      "code": "users + orders + money     -> Postgres\nblog posts, flexible JSON  -> MongoDB\nsessions, rate limits      -> Redis\nchat embeddings / RAG      -> pgvector or Pinecone"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "What is a database?",
      "a": "Before you use this\nDo not keep the only copy of users in a JSON file on one laptop. Decide what one record is and what you will ask (login by email). The browser never holds the database password.\n\nWhat this is\nSoftware that stores shared data with rules, so many users can read and write safely.\n\nWhy we use it\nMany people click at once. A crash must not lose a paid order. An email must stay unique. Search must not scan a million rows by hand. The engine owns disk, locks, indexes, and backups.\n\nWhat happens\nThe app sends a query. SQL engines return rows. Mongo returns documents. You pick from the shape of the data and the questions you ask.\n\nWatch out\nKeeping the only copy in a JSON file on one server. A cache (Redis) is not this."
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "What is a table?",
      "a": "Definition. A named grid of columns and rows of one kind of fact.\n\nHow it works. Columns have types. One row is one record.\n\nOperational risk. Mixing students and invoices in one table."
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "What is a query?",
      "a": "Definition. A request for data or a change, written in SQL or an API.\n\nHow it works. SELECT finds rows. INSERT adds. The engine plans how to run it.\n\nOperational risk. SELECT * on a huge table in production."
    },
    {
      "id": 4,
      "level": "beginner",
      "q": "OLTP vs OLAP?",
      "a": "Definition. OLTP is live transactions. OLAP is analysis over history.\n\nHow it works. Checkout is OLTP. Weekly revenue is OLAP.\n\nOperational risk. A 20-second report on the checkout primary.",
      "flow": [
        "Click",
        "OLTP",
        "Copy",
        "OLAP"
      ]
    },
    {
      "id": 5,
      "level": "beginner",
      "q": "What does ACID mean?",
      "a": "Definition. Atomicity, Consistency, Isolation, Durability — the four promises of a transaction.\n\nHow it works. COMMIT makes the bundle durable. ROLLBACK undoes it.\n\nOperational risk. Two money updates without a transaction."
    },
    {
      "id": 6,
      "level": "beginner",
      "q": "What is a primary key?",
      "a": "Definition. A unique id for each row. It cannot be empty.\n\nHow it works. Joins and updates use this id.\n\nOperational risk. Using a person's name as the only key."
    },
    {
      "id": 7,
      "level": "beginner",
      "q": "What is an index?",
      "a": "Definition. Extra structure so a filter does not scan the whole table.\n\nHow it works. B-tree on email makes login O(log n) instead of a full scan.\n\nOperational risk. No index on a WHERE used on every request."
    },
    {
      "id": 8,
      "level": "intermediate",
      "q": "What is replication?",
      "a": "Definition. Copies of the data on other machines.\n\nHow it works. Primary takes writes. Replicas serve reads and failover.\n\nOperational risk. Reading a just-written row from a lagging replica."
    },
    {
      "id": 9,
      "level": "intermediate",
      "q": "What is sharding?",
      "a": "Definition. Splitting data across machines by a key.\n\nHow it works. user_id % N or a hash ring chooses the shard.\n\nOperational risk. A shard key that dumps all writes onto one node."
    },
    {
      "id": 10,
      "level": "intermediate",
      "q": "What is CAP?",
      "a": "Definition. Under a network split you choose consistency or availability.\n\nHow it works. A quorum write is more C. Serving stale local data is more A.\n\nOperational risk. Quoting CAP without saying which failure you mean."
    },
    {
      "id": 11,
      "level": "intermediate",
      "q": "What is a connection pool?",
      "a": "Definition. A small set of reused database connections.\n\nHow it works. Each request borrows one and returns it.\n\nOperational risk. Opening a new connection per HTTP request."
    },
    {
      "id": 12,
      "level": "intermediate",
      "q": "What is a migration?",
      "a": "Definition. Versioned schema change checked into Git.\n\nHow it works. Files run in order on every environment.\n\nOperational risk. ALTER TABLE by hand only on production."
    },
    {
      "id": 13,
      "level": "intermediate",
      "q": "What is a foreign key?",
      "a": "Definition. A column that must match a key in another table.\n\nHow it works. You cannot enroll in course 99 if course 99 does not exist.\n\nOperational risk. Orphan ids with no REFERENCES."
    },
    {
      "id": 14,
      "level": "beginner",
      "q": "File vs database?",
      "a": "Definition. A file is one blob. A database is concurrent, typed, and queryable.\n\nHow it works. Two writers to one JSON file corrupt it. Postgres locks rows.\n\nOperational risk. users.json as the source of truth."
    },
    {
      "id": 15,
      "level": "advanced",
      "q": "When do you add a read replica?",
      "a": "Definition. When reads overload the primary and a little lag is acceptable.\n\nHow it works. Reports and listings go to the replica. Writes stay on primary.\n\nOperational risk. Putting signup confirmation on a replica."
    },
    {
      "id": 16,
      "level": "intermediate",
      "q": "What is isolation?",
      "a": "Definition. How much one transaction sees of another in-flight transaction.\n\nHow it works. Read committed is common. Serializable is stricter and slower.\n\nOperational risk. Two tickets sold for one seat at read committed without a lock or unique constraint."
    },
    {
      "id": 17,
      "level": "beginner",
      "q": "What should you backup?",
      "a": "Definition. The data files plus the write log, off-box, with a tested restore.\n\nHow it works. Nightly snapshot + WAL lets you restore to 14:03.\n\nOperational risk. Backups on the same disk that just died."
    },
    {
      "id": 18,
      "level": "advanced",
      "q": "Vertical vs horizontal scale?",
      "a": "Definition. Vertical is a bigger machine. Horizontal is more machines (replicas or shards).\n\nHow it works. Buy RAM first. Shard when one primary cannot take the writes.\n\nOperational risk. Sharding a 2 GB database 'for practice' in production."
    },
    {
      "id": 19,
      "level": "beginner",
      "q": "SQL vs NoSQL in one line?",
      "a": "Definition. SQL is tables and joins with a fixed schema. NoSQL is other shapes: documents, keys, columns, graphs.\n\nHow it works. Pick from the query, not from a trend.\n\nOperational risk. Mongo for accounting because 'NoSQL is web scale'."
    },
    {
      "id": 20,
      "level": "intermediate",
      "q": "What is a warehouse?",
      "a": "Definition. A store built for OLAP: large scans, columns, cheap history.\n\nHow it works. ETL or ELT copies OLTP data each night or as a stream.\n\nOperational risk. Analysts querying the live checkout table."
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "What is eventual consistency?",
      "a": "Definition. Replicas catch up; readers may see old data for a short time.\n\nHow it works. A like count or a feed can be slightly stale. A bank balance usually cannot.\n\nOperational risk. Showing 'payment failed' then 'paid' because of replica lag."
    },
    {
      "id": 22,
      "level": "advanced",
      "q": "How do you migrate with zero downtime?",
      "a": "Definition. Expand, backfill, switch reads, then contract.\n\nHow it works. Add a nullable column, fill it, dual-write, then drop the old column.\n\nOperational risk. A locking ALTER that rewrites a 200 GB table at noon."
    },
    {
      "id": 23,
      "level": "beginner",
      "q": "What is a schema?",
      "a": "Definition. The agreed names and types of the data.\n\nHow it works. CREATE TABLE is a schema. Mongo collections have an implicit schema in the app.\n\nOperational risk. Every document a different shape and no comments."
    },
    {
      "id": 24,
      "level": "intermediate",
      "q": "Why parameterized queries?",
      "a": "Definition. The SQL text stays fixed. Values travel separately.\n\nHow it works. $1 or ? stops user text from becoming SQL.\n\nOperational risk. email = '\" + req.body.email + \"'."
    },
    {
      "id": 25,
      "level": "advanced",
      "q": "What is a hot partition?",
      "a": "Definition. One shard or one index range gets almost all the traffic.\n\nHow it works. A shard key of created_at or a celebrity user_id.\n\nOperational risk. One disk at 100% while others idle."
    },
    {
      "id": 26,
      "level": "beginner",
      "q": "Postgres vs MySQL — when does it matter?",
      "a": "Definition. Both are relational OLTP engines. Teams pick one and stay.\n\nHow it works. Postgres is strong at JSON, arrays, and extensions (pgvector). MySQL is common on older LAMP stacks.\n\nOperational risk. Mixing dialects in one migration folder."
    },
    {
      "id": 27,
      "level": "intermediate",
      "q": "What do you monitor?",
      "a": "Definition. Connections, slow queries, disk, replication lag, lock waits, and backup age.\n\nHow it works. Alert before disk is full and before lag is minutes.\n\nOperational risk. Discovering a full disk from a down site."
    },
    {
      "id": 28,
      "level": "beginner",
      "q": "Can Redis replace the database?",
      "a": "Definition. No, not for durable business records.\n\nHow it works. Redis is memory-first. Postgres or Mongo is the system of record.\n\nOperational risk. Orders only in Redis."
    },
    {
      "id": 29,
      "level": "advanced",
      "q": "What is CQRS at a small scale?",
      "a": "Definition. Writes go to one model. Reads use another (replica or cache).\n\nHow it works. Checkout writes SQL. The home feed reads Redis or a replica.\n\nOperational risk. Two sources of truth with no owner."
    },
    {
      "id": 30,
      "level": "intermediate",
      "q": "How do you choose in an interview?",
      "a": "Definition. State data shape, query pattern, consistency, and size, then name the store.\n\nHow it works. Users+orders → SQL. Sessions → Redis. RAG → vectors. Graph walks → graph DB.\n\nOperational risk. Listing five brands with no reason."
    }
  ]
};
