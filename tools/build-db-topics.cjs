const fs = require("fs");
const path = require("path");

const dump = (id, data) => {
  const out = `window.PREP_DATA = window.PREP_DATA || {};\nwindow.PREP_DATA[${JSON.stringify(id)}] = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(path.join(__dirname, "..", "frontend", "data", `${id}.js`), out);
};

const Q = (id, level, q, a, extra = {}) => ({ id, level, q, a, ...extra });

dump("database", {
  kind: "design",
  notes: [
    {
      title: "What a database is",
      layers: [[{ label: "App" }], [{ label: "Database", tone: "store" }]],
      flow: ["Request", "App", "Query", "Rows / docs", "Response"],
      body: "A database is software that stores data so many users can read and write it safely. The app does not keep the only copy in a file on one laptop. The database handles disks, crashes, users at the same time, and search. SQL engines (Postgres, MySQL) use tables. Document engines (MongoDB) use JSON-like documents. You pick the engine from the shape of the data and the questions you ask."
    },
    {
      title: "OLTP vs OLAP",
      flow: ["User click", "OLTP write", "Night copy", "OLAP report"],
      body: "OLTP is the live app: create order, change email, one or few rows. OLAP is analytics: sum sales by week across millions of rows. Do not run a heavy report on the same small OLTP box that serves checkout. Warehouses (BigQuery, Redshift, Snowflake) and column stores help OLAP. Postgres can do both at small scale; at large scale you split."
    },
    {
      title: "ACID",
      body: "Atomicity: the whole transaction happens or none of it. Consistency: rules (keys, checks) stay true. Isolation: two checkouts do not scramble the same stock row. Durability: after COMMIT, a crash should not lose the write. Money, seats, and inventory need ACID. A cache does not. Say which of the four you need before you pick Redis or a queue as the only store."
    },
    {
      title: "CAP in one sentence",
      body: "On a network split, a distributed store can keep Consistency (every reader sees the same latest write) or Availability (every node still answers), not both at once. Partition tolerance is the split itself. A bank ledger leans C. A shopping-cart cache can lean A. CAP is a trade-off under failure, not a reason to skip backups."
    },
    {
      title: "Schema and constraints",
      body: "A schema is the agreed shape: columns, types, required fields. Constraints (PRIMARY KEY, UNIQUE, FOREIGN KEY, CHECK) refuse bad rows even if the app has a bug. Schemaless stores still have a schema in the application. If every document looks different, reports and joins become painful. Start with a clear model. Relax it only with a reason."
    },
    {
      title: "Indexes",
      flow: ["WHERE email = ?", "Index lookup", "Row"],
      body: "An index is a lookup structure so the engine does not scan every row. Index columns you filter and join on. Each index slows INSERT and UPDATE a little. Too many indexes hurt writes. EXPLAIN (SQL) or explain() (Mongo) shows whether a query used an index. A missing index on a hot filter is the usual production slowness."
    },
    {
      title: "Replication",
      layers: [[{ label: "Primary", tone: "store" }, { label: "Replica", tone: "store" }]],
      flow: ["Write primary", "Copy to replica", "Read replica"],
      body: "A replica is a copy of the data on another machine. Writes go to a primary. Replicas help reads and failover. Async replicas can lag: a user who just signed up may not appear on a replica for a moment. Sync replicas wait, so writes are slower. Failover is a rehearsed plan, not a checkbox."
    },
    {
      title: "Sharding (partitioning)",
      body: "Sharding splits data across machines by a key (user_id, tenant). One box cannot hold all rows or all write traffic. A bad shard key (only created_at) puts today's writes on one hot shard. Cross-shard joins are hard. Prefer vertical scale and replicas until you must shard. In interviews, name the shard key and a query that stays on one shard."
    },
    {
      title: "Backups and point-in-time",
      flow: ["Night snapshot", "WAL / oplog", "Restore to 14:03"],
      body: "A backup is a copy you can restore. Snapshots plus a write log (WAL, binlog, oplog) let you restore to a minute, not only to last night. Test a restore. An untested backup is a hope. Keep backups off the same disk as the live data. Encrypt them if they hold user data."
    },
    {
      title: "How to pick a store",
      body: "Tables + money + joins → Postgres or MySQL. Flexible documents + Node team → MongoDB. Hot keys, TTL, sessions → Redis. Huge append logs → Kafka or a warehouse. Similarity search on embeddings → a vector store or pgvector. Graph walks ('friends of friends') → Neo4j or a graph product. Most products start with one SQL database and add the others as a need appears."
    }
  ],
  examples: [
    {
      title: "One row is one fact",
      lang: "sql",
      desc: "Definition. A table holds rows of the same kind.\n\nHow it works. students has id and name. Each INSERT is one person.\n\nOperational risk. Two people with no primary key look identical.",
      code: `-- one table, one kind of row
CREATE TABLE students (
  id   SERIAL PRIMARY KEY,  -- unique person
  name TEXT NOT NULL        -- cannot be empty
);

INSERT INTO students (name) VALUES ('Ada');  -- add one row`
    },
    {
      title: "A transaction that must all succeed",
      lang: "sql",
      flow: ["BEGIN", "debit", "credit", "COMMIT or ROLLBACK"],
      desc: "Definition. Two money updates must live or die together.\n\nHow it works. BEGIN, both UPDATEs, COMMIT. Any error → ROLLBACK.\n\nOperational risk. Two statements without a transaction: one can succeed and the other fail.",
      code: `BEGIN;  -- start the bundle
UPDATE accounts SET bal = bal - 50 WHERE id = 1;  -- send
UPDATE accounts SET bal = bal + 50 WHERE id = 2;  -- receive
COMMIT;  -- both saved, or neither`
    },
    {
      title: "Read after write on a replica",
      lang: "js",
      flow: ["INSERT primary", "read replica", "maybe lag"],
      desc: "Definition. A replica may be a few milliseconds behind.\n\nHow it works. After signup, read the user from the primary, not a lagging replica.\n\nOperational risk. Redirect to /me and the replica says user not found.",
      code: `await primary.query("INSERT INTO users(email) VALUES ($1)", [email]);  // write truth
const me = await primary.query("SELECT * FROM users WHERE email = $1", [email]);  // read primary
// replica.query here can miss the new row`
    },
    {
      title: "Index the filter you actually use",
      lang: "sql",
      desc: "Definition. WHERE email = ? should hit an index.\n\nHow it works. CREATE INDEX on email. Login stops scanning the table.\n\nOperational risk. Indexing every column 'just in case' slows every write.",
      code: `CREATE INDEX idx_users_email ON users (email);  -- login lookup

SELECT id FROM users WHERE email = 'ada@test.com';  -- uses the index`
    },
    {
      title: "OLTP insert vs OLAP sum",
      lang: "sql",
      desc: "Definition. Checkout inserts one order. A report sums a year.\n\nHow it works. Keep the report on a warehouse or a replica, not on the checkout primary at noon.\n\nOperational risk. SELECT SUM on the live orders table locking writers.",
      code: `-- OLTP: one new order
INSERT INTO orders (user_id, total) VALUES (9, 499);

-- OLAP: run this on a warehouse / replica
SELECT date_trunc('week', created_at), SUM(total)
FROM orders
GROUP BY 1;`
    },
    {
      title: "Connection pool",
      lang: "js",
      desc: "Definition. The app reuses a few database connections instead of opening one per request.\n\nHow it works. A pool of 10–20 is common. Each query borrows and returns.\n\nOperational risk. new Client() inside every handler exhausts Postgres max_connections.",
      code: `const pool = new Pool({ max: 20 });  // share this
const { rows } = await pool.query("SELECT 1");  // borrow, then release`
    },
    {
      title: "Migrations are versioned schema",
      lang: "sql",
      desc: "Definition. A migration is a checked-in SQL file that changes the schema.\n\nHow it works. 001_users.sql creates the table. Every environment runs the same files in order.\n\nOperational risk. Changing production by hand so staging no longer matches.",
      code: `-- 001_create_users.sql
CREATE TABLE users (
  id    SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL
);`
    },
    {
      title: "Pick a store in one paragraph",
      lang: "txt",
      flow: ["Need", "Shape", "Engine"],
      desc: "Say the access pattern, then the engine. Interviews want this sentence, not a brand list.",
      code: `users + orders + money     -> Postgres
blog posts, flexible JSON  -> MongoDB
sessions, rate limits      -> Redis
chat embeddings / RAG      -> pgvector or Pinecone`
    }
  ],
  questions: [
    Q(1, "beginner", "What is a database?", "Definition. Software that stores shared data with rules, so many users can read and write safely.\n\nHow it works. The app sends queries. The engine writes disk, indexes, and locks.\n\nOperational risk. Keeping the only copy in a JSON file on one server."),
    Q(2, "beginner", "What is a table?", "Definition. A named grid of columns and rows of one kind of fact.\n\nHow it works. Columns have types. One row is one record.\n\nOperational risk. Mixing students and invoices in one table."),
    Q(3, "beginner", "What is a query?", "Definition. A request for data or a change, written in SQL or an API.\n\nHow it works. SELECT finds rows. INSERT adds. The engine plans how to run it.\n\nOperational risk. SELECT * on a huge table in production."),
    Q(4, "beginner", "OLTP vs OLAP?", "Definition. OLTP is live transactions. OLAP is analysis over history.\n\nHow it works. Checkout is OLTP. Weekly revenue is OLAP.\n\nOperational risk. A 20-second report on the checkout primary.", { flow: ["Click", "OLTP", "Copy", "OLAP"] }),
    Q(5, "beginner", "What does ACID mean?", "Definition. Atomicity, Consistency, Isolation, Durability — the four promises of a transaction.\n\nHow it works. COMMIT makes the bundle durable. ROLLBACK undoes it.\n\nOperational risk. Two money updates without a transaction."),
    Q(6, "beginner", "What is a primary key?", "Definition. A unique id for each row. It cannot be empty.\n\nHow it works. Joins and updates use this id.\n\nOperational risk. Using a person's name as the only key."),
    Q(7, "beginner", "What is an index?", "Definition. Extra structure so a filter does not scan the whole table.\n\nHow it works. B-tree on email makes login O(log n) instead of a full scan.\n\nOperational risk. No index on a WHERE used on every request."),
    Q(8, "intermediate", "What is replication?", "Definition. Copies of the data on other machines.\n\nHow it works. Primary takes writes. Replicas serve reads and failover.\n\nOperational risk. Reading a just-written row from a lagging replica."),
    Q(9, "intermediate", "What is sharding?", "Definition. Splitting data across machines by a key.\n\nHow it works. user_id % N or a hash ring chooses the shard.\n\nOperational risk. A shard key that dumps all writes onto one node."),
    Q(10, "intermediate", "What is CAP?", "Definition. Under a network split you choose consistency or availability.\n\nHow it works. A quorum write is more C. Serving stale local data is more A.\n\nOperational risk. Quoting CAP without saying which failure you mean."),
    Q(11, "intermediate", "What is a connection pool?", "Definition. A small set of reused database connections.\n\nHow it works. Each request borrows one and returns it.\n\nOperational risk. Opening a new connection per HTTP request."),
    Q(12, "intermediate", "What is a migration?", "Definition. Versioned schema change checked into Git.\n\nHow it works. Files run in order on every environment.\n\nOperational risk. ALTER TABLE by hand only on production."),
    Q(13, "intermediate", "What is a foreign key?", "Definition. A column that must match a key in another table.\n\nHow it works. You cannot enroll in course 99 if course 99 does not exist.\n\nOperational risk. Orphan ids with no REFERENCES."),
    Q(14, "beginner", "File vs database?", "Definition. A file is one blob. A database is concurrent, typed, and queryable.\n\nHow it works. Two writers to one JSON file corrupt it. Postgres locks rows.\n\nOperational risk. users.json as the source of truth."),
    Q(15, "advanced", "When do you add a read replica?", "Definition. When reads overload the primary and a little lag is acceptable.\n\nHow it works. Reports and listings go to the replica. Writes stay on primary.\n\nOperational risk. Putting signup confirmation on a replica."),
    Q(16, "intermediate", "What is isolation?", "Definition. How much one transaction sees of another in-flight transaction.\n\nHow it works. Read committed is common. Serializable is stricter and slower.\n\nOperational risk. Two tickets sold for one seat at read committed without a lock or unique constraint."),
    Q(17, "beginner", "What should you backup?", "Definition. The data files plus the write log, off-box, with a tested restore.\n\nHow it works. Nightly snapshot + WAL lets you restore to 14:03.\n\nOperational risk. Backups on the same disk that just died."),
    Q(18, "advanced", "Vertical vs horizontal scale?", "Definition. Vertical is a bigger machine. Horizontal is more machines (replicas or shards).\n\nHow it works. Buy RAM first. Shard when one primary cannot take the writes.\n\nOperational risk. Sharding a 2 GB database 'for practice' in production."),
    Q(19, "beginner", "SQL vs NoSQL in one line?", "Definition. SQL is tables and joins with a fixed schema. NoSQL is other shapes: documents, keys, columns, graphs.\n\nHow it works. Pick from the query, not from a trend.\n\nOperational risk. Mongo for accounting because 'NoSQL is web scale'."),
    Q(20, "intermediate", "What is a warehouse?", "Definition. A store built for OLAP: large scans, columns, cheap history.\n\nHow it works. ETL or ELT copies OLTP data each night or as a stream.\n\nOperational risk. Analysts querying the live checkout table."),
    Q(21, "intermediate", "What is eventual consistency?", "Definition. Replicas catch up; readers may see old data for a short time.\n\nHow it works. A like count or a feed can be slightly stale. A bank balance usually cannot.\n\nOperational risk. Showing 'payment failed' then 'paid' because of replica lag."),
    Q(22, "advanced", "How do you migrate with zero downtime?", "Definition. Expand, backfill, switch reads, then contract.\n\nHow it works. Add a nullable column, fill it, dual-write, then drop the old column.\n\nOperational risk. A locking ALTER that rewrites a 200 GB table at noon."),
    Q(23, "beginner", "What is a schema?", "Definition. The agreed names and types of the data.\n\nHow it works. CREATE TABLE is a schema. Mongo collections have an implicit schema in the app.\n\nOperational risk. Every document a different shape and no comments."),
    Q(24, "intermediate", "Why parameterized queries?", "Definition. The SQL text stays fixed. Values travel separately.\n\nHow it works. $1 or ? stops user text from becoming SQL.\n\nOperational risk. email = '\" + req.body.email + \"'."),
    Q(25, "advanced", "What is a hot partition?", "Definition. One shard or one index range gets almost all the traffic.\n\nHow it works. A shard key of created_at or a celebrity user_id.\n\nOperational risk. One disk at 100% while others idle."),
    Q(26, "beginner", "Postgres vs MySQL — when does it matter?", "Definition. Both are relational OLTP engines. Teams pick one and stay.\n\nHow it works. Postgres is strong at JSON, arrays, and extensions (pgvector). MySQL is common on older LAMP stacks.\n\nOperational risk. Mixing dialects in one migration folder."),
    Q(27, "intermediate", "What do you monitor?", "Definition. Connections, slow queries, disk, replication lag, lock waits, and backup age.\n\nHow it works. Alert before disk is full and before lag is minutes.\n\nOperational risk. Discovering a full disk from a down site."),
    Q(28, "beginner", "Can Redis replace the database?", "Definition. No, not for durable business records.\n\nHow it works. Redis is memory-first. Postgres or Mongo is the system of record.\n\nOperational risk. Orders only in Redis."),
    Q(29, "advanced", "What is CQRS at a small scale?", "Definition. Writes go to one model. Reads use another (replica or cache).\n\nHow it works. Checkout writes SQL. The home feed reads Redis or a replica.\n\nOperational risk. Two sources of truth with no owner."),
    Q(30, "intermediate", "How do you choose in an interview?", "Definition. State data shape, query pattern, consistency, and size, then name the store.\n\nHow it works. Users+orders → SQL. Sessions → Redis. RAG → vectors. Graph walks → graph DB.\n\nOperational risk. Listing five brands with no reason.")
  ]
});

dump("nosql", {
  kind: "design",
  notes: [
    {
      title: "What NoSQL means",
      layers: [[{ label: "App" }], [{ label: "Document", tone: "store" }, { label: "Key-value", tone: "store" }, { label: "Wide-column", tone: "store" }, { label: "Graph", tone: "store" }]],
      body: "NoSQL is a family of stores that are not 'tables + SQL joins' as the main model. Four common families: document (MongoDB, Firestore), key-value (Redis, DynamoDB simple use), wide-column (Cassandra, Bigtable), graph (Neo4j). NoSQL is not 'no schema' and not 'always faster than SQL'. It is a different data shape and a different query style."
    },
    {
      title: "Document stores",
      flow: ["App", "insert one JSON", "find by id or field"],
      body: "A document is a JSON-like object, often one business thing (a user, an order with line items nested). You read and write the whole document or a path inside it. MongoDB and Firestore are the usual names. Good when the document is usually loaded together. Painful when you need the same item in many different joins every time."
    },
    {
      title: "Key-value stores",
      body: "You give a key, you get a blob. Redis, Memcached, DynamoDB (as a big key-value), S3 (object key). There is no join and little query language. Extremely fast and simple. You design the key: user:42:session. If you need 'all users in Pune', a pure key-value store is the wrong tool unless you built a secondary index."
    },
    {
      title: "Wide-column stores",
      body: "Cassandra and Bigtable store rows with a partition key and a flexible set of columns. Writes are cheap and scale across many nodes. You design tables around queries ('get last 100 messages for chat X'), not around a universal schema. Changing an access pattern later often means a new table. Great for time series and huge write volume. Weak for ad-hoc SQL."
    },
    {
      title: "Graph stores",
      flow: ["Node", "edge", "neighbor", "neighbor"],
      body: "A graph database stores nodes and edges as first-class things. 'Friends of friends' or 'which services talk to this API' is a walk, not a five-table join. Neo4j (Cypher) and Amazon Neptune are common. Use a graph when the product question is about connections. Do not use it as a general SQL replacement."
    },
    {
      title: "When NoSQL wins",
      body: "Huge write throughput with a known key (Cassandra). Nested documents you always load together (Mongo). Millisecond TTL data (Redis). Multi-region key-value with managed ops (DynamoDB). Graph questions (Neo4j). If you need multi-row transactions, rich joins, and reporting, start with SQL."
    },
    {
      title: "When NoSQL hurts",
      body: "Money that must stay consistent across several records. Reports that join five entities. Teams that have no query plan and dump JSON. 'Schemaless' that becomes twenty unofficial shapes. Missing unique constraints so two accounts share an email. Pick Mongo because of a tutorial, then spend a year rebuilding relations."
    },
    {
      title: "DynamoDB in one page",
      body: "AWS key-value / document store. You must choose a partition key (and optional sort key) up front. Queries are cheap on that key. Scans are expensive. Secondary indexes are extra tables Dynamo keeps for you. Capacity is on-demand or provisioned. Design for access patterns first. A SQL-style 'just add a column and join later' does not exist."
    },
    {
      title: "Cassandra in one page",
      body: "Peer-to-peer wide-column. Replication factor and consistency level (ONE, QUORUM, ALL) are your CAP knobs. The partition key decides the node. CQL looks a bit like SQL but is not SQL — no arbitrary JOIN. TTL on columns is native. Use it for writes that must not stop, and queries you listed on day one."
    },
    {
      title: "Modeling habit",
      body: "Write the queries first. Then store the data in the shape those queries need, even if you copy a field. In NoSQL, duplication is often the design, not a mistake. In SQL, duplication is usually a mistake until you denormalize on purpose. Say that sentence in interviews."
    }
  ],
  examples: [
    {
      title: "Document: one order with lines inside",
      lang: "js",
      desc: "Definition. Nested line items live in the same document as the order.\n\nHow it works. One findById loads the whole order.\n\nOperational risk. Updating one line with two writers without a version field.",
      code: `await orders.insertOne({
  _id: "o1",
  userId: "u9",
  lines: [{ sku: "tea", n: 2 }]  // nested, not a second table
});
const order = await orders.findOne({ _id: "o1" });  // one round trip`
    },
    {
      title: "Key-value: session by id",
      lang: "js",
      desc: "Definition. The key is the whole query.\n\nHow it works. GET session:abc. No scan.\n\nOperational risk. Wanting 'all sessions for user 9' with no secondary index.",
      code: `await kv.set("session:abc", JSON.stringify({ userId: 9 }), { ex: 86400 });  // write
const raw = await kv.get("session:abc");  // exact key`
    },
    {
      title: "Mongo find vs SQL join thinking",
      lang: "js",
      desc: "Definition. Embed when you always load together. Refer when many documents share one thing.\n\nHow it works. Product names that change globally should be an id, not a copied string in every order — unless you snapshot on purpose.\n\nOperational risk. Embedding the whole user in every comment.",
      code: `// embed: comments stay on the post
await posts.updateOne({ _id: "p1" }, { $push: { comments: { by: "ada", text: "hi" } } });

// refer: user profile lives once
await comments.insertOne({ postId: "p1", userId: "ada" });`
    },
    {
      title: "DynamoDB item",
      lang: "js",
      flow: ["pk + sk", "GetItem", "item"],
      desc: "Definition. Partition key plus sort key is the address of the item.\n\nHow it works. GetItem is one hop. Query lists items that share pk.\n\nOperational risk. Scan as your default 'SELECT *'.",
      code: `await dynamo.put({
  TableName: "app",
  Item: { pk: "USER#9", sk: "PROFILE", name: "Ada" }  // address
});
const out = await dynamo.get({ TableName: "app", Key: { pk: "USER#9", sk: "PROFILE" } });`
    },
    {
      title: "Cassandra: query-shaped table",
      lang: "sql",
      desc: "Definition. One table per query. Messages by chat id, newest first.\n\nHow it works. PRIMARY KEY ((chat_id), sent_at, id) — partition then sort.\n\nOperational risk. SELECT * WHERE body CONTAINS 'hello' — that is not Cassandra.",
      code: `CREATE TABLE messages_by_chat (
  chat_id TEXT,
  sent_at TIMESTAMP,
  id      UUID,
  body    TEXT,
  PRIMARY KEY ((chat_id), sent_at, id)  -- query: last N in this chat
) WITH CLUSTERING ORDER BY (sent_at DESC);`
    },
    {
      title: "Neo4j: one hop friends",
      lang: "txt",
      desc: "Definition. MATCH a pattern of nodes and edges.\n\nHow it works. (a)-[:FRIEND]-(b) is a walk, not a join table in your head.\n\nOperational risk. Using Cypher for a simple users table with no relationships.",
      code: `MATCH (a:User {id: "ada"})-[:FRIEND]-(b:User)  // one hop
RETURN b.name;`
    },
    {
      title: "Unique email without SQL UNIQUE",
      lang: "js",
      desc: "Definition. Document stores need an explicit unique index.\n\nHow it works. createIndex unique: true. Two inserts with the same email fail.\n\nOperational risk. Checking uniqueness only in Node and losing a race.",
      code: `await users.createIndex({ email: 1 }, { unique: true });  // database rule
await users.insertOne({ email: "ada@test.com" });`
    },
    {
      title: "Copy a field on purpose",
      lang: "js",
      desc: "Definition. Denormalize so a feed query needs no join.\n\nHow it works. Each post stores authorName. When Ada renames, a job updates posts.\n\nOperational risk. Forgetting the backfill and showing the old name.",
      code: `await posts.insertOne({
  title: "Hi",
  authorId: "ada",
  authorName: "Ada"  // copy for the feed card
});`
    }
  ],
  questions: [
    Q(1, "beginner", "What is NoSQL?", "Definition. Stores that are not 'tables + SQL joins' as the main model: documents, keys, wide-column, graphs.\n\nHow it works. You pick a family from the query shape.\n\nOperational risk. Hearing NoSQL and assuming it is always faster."),
    Q(2, "beginner", "Name the four common families.", "Definition. Document, key-value, wide-column, graph.\n\nHow it works. Mongo, Redis, Cassandra, Neo4j are the classroom examples.\n\nOperational risk. Calling everything NoSQL as if they were the same."),
    Q(3, "beginner", "What is a document store?", "Definition. JSON-like objects, often one business thing per document.\n\nHow it works. find by _id or an indexed field. Nest arrays when they belong together.\n\nOperational risk. A 16 MB document that grows forever."),
    Q(4, "beginner", "What is a key-value store?", "Definition. GET/SET by an exact key. No join.\n\nHow it works. You design the key string.\n\nOperational risk. Needing a filter that is not in the key."),
    Q(5, "beginner", "MongoDB vs Postgres — one reason each?", "Definition. Mongo fits nested documents and a JS team. Postgres fits money, joins, and constraints.\n\nHow it works. Many apps use both: SQL for truth, Mongo for a flexible catalog.\n\nOperational risk. One engine for every problem."),
    Q(6, "intermediate", "Embed vs reference?", "Definition. Embed when you always load the child with the parent. Reference when many parents share one child or the child is huge.\n\nHow it works. Order.lines embed. User profile references.\n\nOperational risk. Embedding the user object in a million comments."),
    Q(7, "intermediate", "What is a partition key?", "Definition. The value that chooses which node or partition holds the item.\n\nHow it works. DynamoDB pk, Cassandra first key, Mongo shard key.\n\nOperational risk. A hot key (one celebrity) on one partition."),
    Q(8, "intermediate", "Why does Cassandra avoid JOINs?", "Definition. Data is spread by partition. A join would fan out across the cluster.\n\nHow it works. You store the answer shape in one table.\n\nOperational risk. Treating CQL as PostgreSQL."),
    Q(9, "intermediate", "What is DynamoDB designed around?", "Definition. Known access patterns and a primary key.\n\nHow it works. Put, Get, Query on pk+sk. Indexes for a second pattern.\n\nOperational risk. Scan for every page in production."),
    Q(10, "beginner", "Is NoSQL schemaless?", "Definition. The engine may not enforce columns. The application still has a shape.\n\nHow it works. Validators and unique indexes exist in Mongo.\n\nOperational risk. Twenty unofficial document shapes."),
    Q(11, "intermediate", "When do you pick Neo4j?", "Definition. When the product question is a walk on relationships.\n\nHow it works. MATCH (a)-[:X]-(b).\n\nOperational risk. A graph database for a CRUD users table."),
    Q(12, "advanced", "How does Cassandra QUORUM work?", "Definition. A write or read must reach a majority of replicas.\n\nHow it works. RF=3 and QUORUM means 2 nodes. That leans consistent.\n\nOperational risk. CL=ONE for a money transfer."),
    Q(13, "beginner", "Firestore in one line?", "Definition. Google's hosted document store with realtime listeners and security rules.\n\nHow it works. Collections and documents. Good for mobile clients.\n\nOperational risk. Unbounded collection scans billed per document."),
    Q(14, "intermediate", "Secondary index — why pay for it?", "Definition. A second lookup path the engine maintains.\n\nHow it works. Mongo index, DynamoDB GSI, Cassandra SAI / materialized view.\n\nOperational risk. A GSI that projects the whole item and doubles write cost."),
    Q(15, "advanced", "How do you do a transaction in Mongo?", "Definition. Multi-document transactions exist, but they are heavier than one-document atomic updates.\n\nHow it works. Prefer one document or $inc. Use a session transaction when you must touch two collections.\n\nOperational risk. Long transactions across shards."),
    Q(16, "beginner", "Redis vs DynamoDB?", "Definition. Redis is in-memory, ultra fast, often a cache. DynamoDB is durable, hosted, pay-per-request key-value.\n\nHow it works. Sessions can be either. The only order table should not be Redis.\n\nOperational risk. Same key design, different durability."),
    Q(17, "intermediate", "What is a wide-column row?", "Definition. A partition plus many optional columns / clustering cells.\n\nHow it works. You can add columns without ALTER for every field.\n\nOperational risk. Unbounded columns on one partition key (a row that never stops growing)."),
    Q(18, "intermediate", "Denormalize on purpose — example?", "Definition. Copy authorName onto each post so the feed is one query.\n\nHow it works. Update job when the name changes.\n\nOperational risk. Stale copies with no job."),
    Q(19, "advanced", "What is a hot partition in DynamoDB?", "Definition. One partition key gets more than its share of RCUs/WCUs.\n\nHow it works. Shard the key (userId#shard) or pick a better pk.\n\nOperational risk. pk = 'GLOBAL' for every write."),
    Q(20, "beginner", "Can you replace SQL with Mongo for a bank?", "Definition. You can, but you must rebuild constraints, joins, and reporting yourself.\n\nHow it works. Most banks stay on SQL for ledgers.\n\nOperational risk. Losing a unique account number constraint."),
    Q(21, "intermediate", "TTL in NoSQL stores?", "Definition. Documents or columns can expire (Mongo TTL index, Dynamo TTL, Cassandra TTL, Redis EX).\n\nHow it works. Sessions and ephemeral events vanish without a sweeper job.\n\nOperational risk. TTL as the only delete for legal records."),
    Q(22, "beginner", "What does 'query first design' mean?", "Definition. List the screens and APIs, then store data in that shape.\n\nHow it works. Chat app → messages_by_chat table. Not a 3NF model you join later.\n\nOperational risk. A pretty ER diagram that cannot answer the home page."),
    Q(23, "advanced", "Multi-region NoSQL — what do you give up?", "Definition. Writes in two regions usually mean eventual consistency or conflict rules.\n\nHow it works. DynamoDB global tables, Cassandra multi-DC, Cosmos DB.\n\nOperational risk. Two regions incrementing the same counter without a merge."),
    Q(24, "intermediate", "Graph vs SQL many-to-many?", "Definition. SQL uses a join table. A graph uses edges you can walk N hops.\n\nHow it works. 3-hop 'people you may know' is painful in SQL and natural in Cypher.\n\nOperational risk. Neo4j for a two-table enrollment list."),
    Q(25, "beginner", "Name one hosted product per family.", "Definition. Document: MongoDB Atlas or Firestore. Key-value: ElastiCache or DynamoDB. Wide-column: Keyspaces / Bigtable. Graph: Neptune or Aura.\n\nHow it works. Hosted means backups and failover are a setting — you still design keys.\n\nOperational risk. Assuming hosted means no hot partitions."),
    Q(26, "intermediate", "What is an aggregation pipeline?", "Definition. Mongo's step-by-step transform: match, group, project.\n\nHow it works. $match first so you use an index. Then $group.\n\nOperational risk. $where or unbounded $lookup in a hot API."),
    Q(27, "advanced", "How do you migrate from Mongo to Postgres?", "Definition. Map documents to tables, flatten arrays, add keys, dual-write, backfill, switch reads.\n\nHow it works. Arrays become child tables. Nested objects become columns or jsonb.\n\nOperational risk. A weekend cutover with no dual-write."),
    Q(28, "beginner", "Why do interviews still ask SQL if you use Mongo?", "Definition. Most companies still have SQL somewhere, and the ideas (keys, indexes, transactions) transfer.\n\nHow it works. Learn both. Say when you would pick each.\n\nOperational risk. 'I only know Mongo' in a backend screen."),
    Q(29, "intermediate", "Eventual consistency — user-visible example?", "Definition. Ada likes a post. A replica still shows 4 likes for a second.\n\nHow it works. Accept it for counts. Do not accept it for 'was the payment captured?'.\n\nOperational risk. A UI that flickers paid / unpaid."),
    Q(30, "advanced", "How do you pick in a system-design round?", "Definition. Requirements → access patterns → consistency → size → engine.\n\nHow it works. Chat history: Cassandra or Dynamo by chat_id. User profile: SQL or Mongo. Presence: Redis.\n\nOperational risk. Drawing six databases with no query on the arrows.")
  ]
});

dump("vectordb", {
  kind: "design",
  notes: [
    {
      title: "What a vector database is",
      layers: [[{ label: "Text / image" }], [{ label: "Embedding model" }], [{ label: "Vector DB", tone: "store" }], [{ label: "App / LLM" }]],
      flow: ["Chunk", "Embed", "Store vector", "Query embed", "Top-k similar"],
      body: "A vector database stores lists of numbers (embeddings) and finds the nearest ones. 'Nearest' means similar meaning, not the same letters. You use it for search that understands 'bike' ≈ 'bicycle', for recommendations, and for RAG (give an LLM the right paragraphs). It does not replace Postgres for users and orders. It sits beside them."
    },
    {
      title: "What an embedding is",
      body: "An embedding model turns text (or an image) into a fixed-length vector, say 384 or 1536 floats. Nearby vectors mean nearby meaning. The same model must be used for insert and for query. Mixing models (or mixing versions) makes distances meaningless. Store the source text and the vector together so you can show the chunk, not only an id."
    },
    {
      title: "Similarity: cosine, L2, dot",
      body: "Cosine similarity cares about angle, not length — common for text. L2 (Euclidean) is straight-line distance. Inner product is used when vectors are already normalized. Pick one metric and keep it. ANN indexes (HNSW, IVF) find approximate nearest neighbors fast. Approximate means you may miss a slightly better neighbor to stay fast."
    },
    {
      title: "Chunking",
      flow: ["Document", "split ~300–800 tokens", "overlap", "embed each"],
      body: "A whole book as one vector is useless: the average meaning is mush. Split into chunks (paragraphs or 300–800 tokens) with a little overlap so a sentence is not cut in half. Too small and you lose context. Too big and retrieval is noisy. Chunking quality matters as much as the database brand."
    },
    {
      title: "RAG (retrieval-augmented generation)",
      flow: ["User question", "embed", "top-k chunks", "prompt + chunks", "LLM answer"],
      body: "The model does not magically know your PDF. You retrieve the closest chunks, paste them into the prompt, and ask the LLM to answer only from that. Cite the chunk. If retrieval is wrong, the answer is confidently wrong. Measure retrieval (did the right paragraph appear?) before you blame the LLM."
    },
    {
      title: "Filters + vectors",
      body: "Real apps need metadata: tenant, language, date, 'published'. A vector store that cannot filter will leak another customer's docs. Postgres + pgvector, Pinecone, Weaviate, Qdrant, and Chroma all support metadata filters. Always filter by tenant_id in a multi-user product."
    },
    {
      title: "pgvector vs a specialist store",
      body: "pgvector keeps vectors in Postgres next to the row. One backup, one transaction, one team skill. Good to a few million vectors if you index well. Pinecone, Qdrant, Weaviate, Milvus, Chroma scale the ANN index and ops. Start with pgvector if you already have Postgres. Move when recall or ingest speed forces it."
    },
    {
      title: "Hybrid search",
      body: "Keyword (BM25) is good at exact SKUs and names. Vectors are good at paraphrases. Hybrid search runs both and merges scores. 'Error code E-41' should hit BM25. 'why is my bill high' should hit vectors. Many products need both, not a religion."
    },
    {
      title: "Ops you will forget",
      body: "Re-embed when you change the model. Version the collection name (docs_v3_text-embedding-3). Delete vectors when you delete the source file. Cap top-k. Watch p95 query time and recall@k on a labelled set. An empty filter that returns another tenant's HR PDF is a security bug, not a quality bug."
    },
    {
      title: "What not to use a vector DB for",
      body: "Not a user table. Not a shopping cart. Not the only store of a legal contract (keep the file in object storage and the row in SQL; the vector is an index). Not a replacement for a unique email constraint. Similarity is not equality."
    }
  ],
  examples: [
    {
      title: "Embed and insert (pgvector idea)",
      lang: "sql",
      desc: "Definition. A column of type vector holds the embedding.\n\nHow it works. INSERT the chunk text plus the numbers. CREATE INDEX for ANN.\n\nOperational risk. Inserting vectors from two different models into one column.",
      code: `-- store the chunk and its vector
CREATE TABLE chunks (
  id    SERIAL PRIMARY KEY,
  body  TEXT,
  tenant TEXT,
  embedding vector(1536)  -- same size as the model
);

INSERT INTO chunks (body, tenant, embedding)
VALUES ('refund policy…', 'acme', '[0.01, 0.22, …]');`
    },
    {
      title: "Nearest neighbors in SQL",
      lang: "sql",
      flow: ["embed question", "ORDER BY distance", "LIMIT 5"],
      desc: "Definition. The query vector is compared to stored vectors.\n\nHow it works. <=> is cosine distance in pgvector. LIMIT 5 is top-k.\n\nOperational risk. Forgetting WHERE tenant = current org.",
      code: `SELECT body
FROM chunks
WHERE tenant = 'acme'  -- never skip this
ORDER BY embedding <=> '[0.02, 0.19, …]'
LIMIT 5;  -- top 5 similar chunks`
    },
    {
      title: "RAG in the app",
      lang: "js",
      flow: ["question", "embed", "top-k", "prompt", "LLM"],
      desc: "Definition. Retrieve first, then generate.\n\nHow it works. embed(question), search, build prompt from chunks, call the model.\n\nOperational risk. Prompt without retrieved text — the model will guess.",
      code: `const qVec = await embed(question);  // same model as insert
const hits = await search(qVec, { tenant, k: 5 });  // nearest chunks
const context = hits.map((h) => h.body).join("\\n---\\n");
const answer = await llm([
  { role: "system", content: "Answer only from the context." },
  { role: "user", content: context + "\\n\\nQ: " + question }
]);`
    },
    {
      title: "Chunk a markdown file",
      lang: "js",
      desc: "Definition. Split long text so each vector has one idea.\n\nHow it works. Walk headings or windows of ~500 tokens with overlap.\n\nOperational risk. One vector for a 40-page PDF.",
      code: `function chunk(text, size = 500, overlap = 80) {
  const out = [];
  for (let i = 0; i < text.length; i += size - overlap) {
    out.push(text.slice(i, i + size));  // one passage
  }
  return out;
}`
    },
    {
      title: "Metadata filter",
      lang: "js",
      desc: "Definition. Restrict the ANN search to one tenant and one source type.\n\nHow it works. filter: { tenant, kind: 'policy' } then vector search.\n\nOperational risk. Global search across tenants.",
      code: `await index.query({
  vector: qVec,
  topK: 5,
  filter: { tenant: "acme", kind: "policy" }  // hard wall
});`
    },
    {
      title: "Delete when the source dies",
      lang: "js",
      desc: "Definition. Vectors are an index of a file. Remove both.\n\nHow it works. delete where source_id = file. Then delete the object in S3.\n\nOperational risk. File gone, chunks still retrieved as if true.",
      code: `await chunks.deleteMany({ sourceId: fileId });  // drop vectors
await s3.delete(fileId);  // drop the file`
    },
    {
      title: "Version the collection",
      lang: "js",
      desc: "Definition. A new embedding model needs a new collection.\n\nHow it works. docs_v3_emb3small. Dual-write, switch queries, drop v2.\n\nOperational risk. Mixing 1536-d and 384-d in one index.",
      code: `const COLLECTION = "docs_v3_text-embedding-3-small";  // name the model
await index.upsert({ collection: COLLECTION, id, values: vec, metadata });`
    },
    {
      title: "Hybrid: keyword + vector",
      lang: "js",
      desc: "Definition. Merge BM25 hits and vector hits.\n\nHow it works. Run both, rank by a weighted score, unique by id.\n\nOperational risk. Only vectors for an exact error code the user pasted.",
      code: `const [kw, vec] = await Promise.all([
  bm25.search(question, 10),   // exact words
  vector.search(qVec, 10)      // meaning
]);
const merged = fuse(kw, vec);  // one ranked list`
    }
  ],
  questions: [
    Q(1, "beginner", "What is a vector database?", "Definition. A store that keeps embeddings and returns the nearest ones for a query vector.\n\nHow it works. Insert vectors. Query with another vector. Get top-k.\n\nOperational risk. Using it as the only user database."),
    Q(2, "beginner", "What is an embedding?", "Definition. A list of numbers that represents meaning.\n\nHow it works. A model maps text to ~384–1536 floats. Nearby vectors ≈ similar text.\n\nOperational risk. Querying with a different model than you used to insert."),
    Q(3, "beginner", "Why not LIKE '%bike%'?", "Definition. LIKE needs the same letters. Embeddings match meaning.\n\nHow it works. 'bicycle' can retrieve a 'bike' chunk.\n\nOperational risk. Vectors only, when the user pasted an exact SKU — add keyword search."),
    Q(4, "beginner", "What is top-k?", "Definition. How many nearest chunks you take, often 3–10.\n\nHow it works. k too small misses context. k too large fills the prompt with junk.\n\nOperational risk. k=50 into a small context window."),
    Q(5, "beginner", "What is RAG?", "Definition. Retrieve relevant chunks, then ask an LLM to answer from them.\n\nHow it works. embed → search → prompt → generate.\n\nOperational risk. Skipping retrieval and hoping the model 'knows' your PDF.", { flow: ["Q", "embed", "top-k", "LLM"] }),
    Q(6, "intermediate", "Why chunk documents?", "Definition. One vector per whole book averages away the answer.\n\nHow it works. 300–800 tokens with overlap.\n\nOperational risk. Chunks that split a table in half."),
    Q(7, "intermediate", "Cosine vs L2?", "Definition. Cosine uses angle. L2 uses straight-line distance.\n\nHow it works. Text embeddings often use cosine. Stay consistent with the index.\n\nOperational risk. Building with cosine and querying with L2."),
    Q(8, "intermediate", "What is ANN?", "Definition. Approximate nearest neighbor — fast, slightly imperfect.\n\nHow it works. HNSW and IVF are common indexes.\n\nOperational risk. Expecting exact nearest every time on a huge set."),
    Q(9, "intermediate", "Why metadata filters?", "Definition. Restrict which vectors may win (tenant, date, type).\n\nHow it works. Filter first or during search, then rank by distance.\n\nOperational risk. Missing tenant filter — cross-customer leak."),
    Q(10, "beginner", "pgvector vs Pinecone?", "Definition. pgvector lives in Postgres. Pinecone is a hosted vector service.\n\nHow it works. Start pgvector if SQL is already home. Move when scale or ops demand it.\n\nOperational risk. Two sources of truth for the same chunk text."),
    Q(11, "intermediate", "What do you store besides the vector?", "Definition. The source text, source id, tenant, model version, and dates.\n\nHow it works. You show the chunk to the user and to the LLM.\n\nOperational risk. Storing only floats and losing the paragraph."),
    Q(12, "advanced", "How do you change embedding models?", "Definition. New collection, re-embed everything, switch queries, drop the old index.\n\nHow it works. Name collections with the model id.\n\nOperational risk. Upserting new dims into an old index."),
    Q(13, "intermediate", "What is hybrid search?", "Definition. Keyword plus vector, then merge.\n\nHow it works. BM25 for exact tokens, vectors for paraphrase.\n\nOperational risk. Vector-only for error codes and part numbers."),
    Q(14, "beginner", "Chroma / Weaviate / Qdrant — what are they?", "Definition. Specialist vector stores (local or hosted) with ANN indexes and filters.\n\nHow it works. Same idea: upsert vectors, query top-k.\n\nOperational risk. Picking a brand before you have a chunking test set."),
    Q(15, "advanced", "How do you measure retrieval?", "Definition. Label questions with the chunk that should appear. Track recall@k and MRR.\n\nHow it works. If the right paragraph is missing, do not tune the LLM first.\n\nOperational risk. Only scoring 'the answer sounded nice'."),
    Q(16, "intermediate", "What is a collection / index / namespace?", "Definition. A named bucket of vectors, often one per model version or tenant group.\n\nHow it works. Query the same name you upserted into.\n\nOperational risk. Dev and prod sharing one index."),
    Q(17, "beginner", "Can I put passwords in a vector DB?", "Definition. No. Similarity is not access control, and embeddings can leak meaning.\n\nHow it works. Store secrets in a vault. Filter vectors by authz in the app.\n\nOperational risk. Embedding an internal HR dump with no filter."),
    Q(18, "intermediate", "How does delete work?", "Definition. Remove the vector when you remove or replace the source file.\n\nHow it works. delete by source_id. Re-embed the new version.\n\nOperational risk. Stale chunks still cited as policy."),
    Q(19, "advanced", "What is a reranker?", "Definition. A second model that scores the top-k more carefully.\n\nHow it works. Retrieve 20 cheaply, rerank to 5, then prompt.\n\nOperational risk. Reranking 200 chunks on every keystroke."),
    Q(20, "beginner", "Does a vector DB replace Elasticsearch?", "Definition. Not always. Keyword search still wins on exact strings and facets.\n\nHow it works. Many stacks run both or use a product that does hybrid.\n\nOperational risk. Dropping keyword search on day one."),
    Q(21, "intermediate", "What dimension should I pick?", "Definition. Whatever the embedding model outputs. You do not pick a random number.\n\nHow it works. text-embedding-3-small is 1536 unless you set a smaller dim the API supports.\n\nOperational risk. Truncating a vector by hand and keeping the same index."),
    Q(22, "advanced", "How do you multi-tenant safely?", "Definition. tenant_id on every row and a mandatory filter (or a namespace per tenant).\n\nHow it works. Tests that user A cannot retrieve user B's chunks.\n\nOperational risk. A default empty filter."),
    Q(23, "intermediate", "Where do you keep the original file?", "Definition. Object storage (S3) plus a SQL row. The vector is an index.\n\nHow it works. Download the PDF from S3. Search via vectors.\n\nOperational risk. The vector store as the only copy of a contract."),
    Q(24, "beginner", "What is similarity search used for besides RAG?", "Definition. Duplicate detection, recommendations, image search, clustering.\n\nHow it works. Same nearest-neighbor idea, different payload.\n\nOperational risk. Using cosine on vectors that were never normalized when the metric assumes it."),
    Q(25, "advanced", "HNSW in one sentence?", "Definition. A graph index for ANN: walk neighbors to get close fast.\n\nHow it works. Build is memory-heavy. Query is fast. Recall depends on ef/M settings.\n\nOperational risk. Default build on a laptop then surprise RAM in prod."),
    Q(26, "intermediate", "How do you update one paragraph?", "Definition. Delete the old chunk ids for that section, embed the new text, upsert.\n\nHow it works. Stable ids help: fileId:chunk:12.\n\nOperational risk. Upsert with a new id and leaving the old vector."),
    Q(27, "beginner", "Why same model on query and insert?", "Definition. Distance is only meaningful in one embedding space.\n\nHow it works. One model name in config for both paths.\n\nOperational risk. A nightly job on model A and an API on model B."),
    Q(28, "intermediate", "What goes in the LLM prompt?", "Definition. System rule + retrieved chunks + the question. Ask it to cite and to say when the context is missing.\n\nHow it works. Cap characters. Put the question last or clearly marked.\n\nOperational risk. Unbounded dump of 30 chunks."),
    Q(29, "advanced", "How do you keep it fresh?", "Definition. Ingest pipeline on upload. Queue re-embed. Version collections.\n\nHow it works. File webhook → chunk → embed → upsert. Delete on remove.\n\nOperational risk. A folder that changed six months ago and an index that did not."),
    Q(30, "intermediate", "How do you explain this in a system-design interview?", "Definition. Docs in S3, metadata in SQL, embeddings in pgvector or Pinecone, app does RAG.\n\nHow it works. Draw chunk → embed → store, and query → embed → top-k → LLM.\n\nOperational risk. Drawing only the LLM and no retrieval path.")
  ]
});

console.log("wrote database, nosql, vectordb");
