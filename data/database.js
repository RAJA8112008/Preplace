window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["database"] = {
  "kind": "design",
  "notes": [
    {
      "title": "Before you pick a store",
      "body": "Before you use this\nDo not keep the only copy of users in a JSON file on one laptop. Decide what one record is (a user, an order) and what questions you will ask (login by email, orders for this user). Then pick an engine. You will talk to it from Node or Python with a driver — the browser never holds the database password.\n\nWhy we use it\nMany people click at once. A crash must not lose a paid order. An email must stay unique. Search must not scan a million rows by hand. The database owns the disk, the locks, the indexes, and the backup. The app only sends a query and gets rows or documents back.\n\nWhen to pick this\nEvery product that remembers users needs a database. Start with one SQL database. Add Redis when a hot read hurts. Add Mongo when a nested document is the natural shape. Add a vector store only when search must match meaning."
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
      "body": "A database is software that stores data so many users can read and write it safely. The app does not keep the only copy in a file on one laptop. The database handles disks, crashes, users at the same time, and search. SQL engines (Postgres, MySQL) use tables. Document engines (MongoDB) use JSON-like documents. You pick the engine from the shape of the data and the questions you ask."
    },
    {
      "title": "OLTP vs OLAP",
      "flow": [
        "User click",
        "OLTP write",
        "Night copy",
        "OLAP report"
      ],
      "body": "OLTP is the live app: create order, change email, one or few rows. OLAP is analytics: sum sales by week across millions of rows. Do not run a heavy report on the same small OLTP box that serves checkout. Warehouses (BigQuery, Redshift, Snowflake) and column stores help OLAP. Postgres can do both at small scale; at large scale you split."
    },
    {
      "title": "ACID",
      "body": "Atomicity: the whole transaction happens or none of it. Consistency: rules (keys, checks) stay true. Isolation: two checkouts do not scramble the same stock row. Durability: after COMMIT, a crash should not lose the write. Money, seats, and inventory need ACID. A cache does not. Say which of the four you need before you pick Redis or a queue as the only store."
    },
    {
      "title": "CAP in one sentence",
      "body": "On a network split, a distributed store can keep Consistency (every reader sees the same latest write) or Availability (every node still answers), not both at once. Partition tolerance is the split itself. A bank ledger leans C. A shopping-cart cache can lean A. CAP is a trade-off under failure, not a reason to skip backups."
    },
    {
      "title": "Schema and constraints",
      "body": "A schema is the agreed shape: columns, types, required fields. Constraints (PRIMARY KEY, UNIQUE, FOREIGN KEY, CHECK) refuse bad rows even if the app has a bug. Schemaless stores still have a schema in the application. If every document looks different, reports and joins become painful. Start with a clear model. Relax it only with a reason."
    },
    {
      "title": "Indexes",
      "flow": [
        "WHERE email = ?",
        "Index lookup",
        "Row"
      ],
      "body": "An index is a lookup structure so the engine does not scan every row. Index columns you filter and join on. Each index slows INSERT and UPDATE a little. Too many indexes hurt writes. EXPLAIN (SQL) or explain() (Mongo) shows whether a query used an index. A missing index on a hot filter is the usual production slowness."
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
      "body": "A replica is a copy of the data on another machine. Writes go to a primary. Replicas help reads and failover. Async replicas can lag: a user who just signed up may not appear on a replica for a moment. Sync replicas wait, so writes are slower. Failover is a rehearsed plan, not a checkbox."
    },
    {
      "title": "Sharding (partitioning)",
      "body": "Sharding splits data across machines by a key (user_id, tenant). One box cannot hold all rows or all write traffic. A bad shard key (only created_at) puts today's writes on one hot shard. Cross-shard joins are hard. Prefer vertical scale and replicas until you must shard. In interviews, name the shard key and a query that stays on one shard."
    },
    {
      "title": "Backups and point-in-time",
      "flow": [
        "Night snapshot",
        "WAL / oplog",
        "Restore to 14:03"
      ],
      "body": "A backup is a copy you can restore. Snapshots plus a write log (WAL, binlog, oplog) let you restore to a minute, not only to last night. Test a restore. An untested backup is a hope. Keep backups off the same disk as the live data. Encrypt them if they hold user data."
    },
    {
      "title": "How to pick a store",
      "body": "Before you use this\nWrite three queries you must support on day one. If they are login, orders-for-user, and a weekly sum, you want SQL. If they are 'get this nested post' and 'add a comment field next week', Mongo is in the mix. If they are 'same session on every server' or '100 logins per minute', you will add Redis.\n\nWhy we use it\nPicking one store for every job is how teams get hurt. SQL is the default for truth. Redis is for speed and shared counters. Mongo is for documents. Vectors are for meaning. Kafka is for events. Name the job, then the engine.\n\nWhen to pick this\nTables + money + joins → Postgres or MySQL. Flexible documents + Node team → MongoDB. Hot keys, TTL, sessions → Redis. Huge append logs → Kafka or a warehouse. Similarity search on embeddings → a vector store or pgvector. Graph walks ('friends of friends') → Neo4j. Most products start with one SQL database and add the others as a need appears."
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
