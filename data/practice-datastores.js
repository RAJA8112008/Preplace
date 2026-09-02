window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["practice-datastores"] = {
  "kind": "practice",
  "notes": [
    {
      "title": "Before you start these labs",
      "body": "Before you use this\nYou should already know: a table has rows, a Mongo document is an object, Redis is GET/SET with a TTL. You do not need all four engines installed to read the cards — treat the snippets as the story you would type.\n\nWhy we use it\nThe same todo (create, read, update, delete) looks different in SQL, Mongo, and Redis. That is the point of this lab. Users and money stay in SQL. Sessions and cache sit in Redis. Nested todos can live in Mongo. Search-by-meaning uses a vector.\n\nWhen to pick this\nPractice saying one sentence: 'truth in Postgres, speed in Redis, documents in Mongo, meaning in pgvector.'"
    },
    {
      "title": "Most asked",
      "body": "After the hands-on labs, open questions tagged Most asked. Those are the interview questions Amazon, Google, Meta, and Microsoft repeat. Same easy comments on the right of the code."
    },
    {
      "title": "How to use this lab",
      "body": "Same todo/user story in SQL, Mongo, Redis, and a tiny vector search."
    },
    {
      "title": "Auth",
      "body": "Before you use this\nHash the password in SQL (bcrypt). Never store the raw password. Then create a random session id.\n\nWhy we use it\nUsers in SQL so a Redis flush cannot wipe accounts. Session in Redis so every API server sees the same login and it expires with EX.\n\nWatch out\nNever the only user table in Redis."
    },
    {
      "title": "HTTPS",
      "body": "Before you use this\nYour page may already be https://. The database still needs its own TLS pipe.\n\nWhy we use it\nDrivers use TLS to Atlas / RDS so a password on the wire is not plain text. Redis uses redis:// locally and rediss:// when the host requires TLS.\n\nWatch out\nAn https:// UI talking to an open 6379 on the public internet is still a leak."
    }
  ],
  "examples": [
    {
      "title": "SQL todo CRUD",
      "lang": "sql",
      "desc": "Before you use this\nYou have a todos table with text and done. This is the four-verb CRUD story.\n\nWhat this is\nINSERT, SELECT, UPDATE, DELETE — the same four jobs every app needs.\n\nWhy we use it\nSQL is the source of truth for the todo. Redis may cache it later. Mongo may store a nested list. Start here so you can compare.\n\nWhat the code is doing\nINSERT adds 'read'. SELECT lists rows. UPDATE marks id 1 done. DELETE removes that row.\n\nWatch out\nUPDATE or DELETE without WHERE changes every todo.",
      "code": "INSERT INTO todos(text) VALUES ('read');\nSELECT * FROM todos;\nUPDATE todos SET done = true WHERE id = 1;\nDELETE FROM todos WHERE id = 1;"
    },
    {
      "title": "Mongo todo CRUD",
      "lang": "js",
      "desc": "Before you use this\nSame todo, no CREATE TABLE. A collection named todos. One object is one todo.\n\nWhat this is\ninsertOne, find, updateOne with $set, deleteOne.\n\nWhy we use it\nWe use Mongo when the todo might grow extra fields (tag, due) without a migration. The object you save is the shape.\n\nWhat the code is doing\ninsertOne writes { text: read }. find lists them. updateOne sets done. deleteOne removes by _id.\n\nWatch out\nupdate without $set can wipe other fields depending on the API.",
      "code": "await c.insertOne({ text: \"read\" });\nawait c.find().toArray();\nawait c.updateOne({ _id }, { $set: { done: true } });\nawait c.deleteOne({ _id });"
    },
    {
      "title": "Redis session",
      "lang": "js",
      "desc": "Before you use this\nThe user row is already in SQL. You checked the password. Now the browser needs a session id.\n\nWhat this is\nSET session:sid → userId with EX 86400 (one day).\n\nWhy we use it\nEvery API server can GET the same key. TTL logs the person out without a cron. A Redis flush logs people out — it must not delete the users table.\n\nWhat the code is doing\nAfter login, set sess:sid for a day. Later requests GET that key.\n\nWatch out\nNever the only user table in Redis.",
      "code": "await redis.set(\"sess:\" + sid, userId, \"EX\", 86400);"
    },
    {
      "title": "pgvector insert",
      "lang": "sql",
      "desc": "Before you use this\nUsers still live in SQL. You split a file into chunks and ran an embedding model. Now store body + vector.\n\nWhat this is\nOne row is one chunk plus its embedding.\n\nWhy we use it\nLater you ORDER BY distance to find meaning, not only the same letters. RAG needs this table beside the user table.\n\nWhat the code is doing\nINSERT puts the text and the vector. $1 and $2 stay parameters.\n\nWatch out\nAlways store tenant or user id on the chunk so retrieve cannot leak.",
      "code": "INSERT INTO chunks(body, embedding) VALUES ($1, $2);"
    },
    {
      "title": "rediss://",
      "lang": "txt",
      "desc": "Before you use this\nLocal Redis is redis://localhost:6379 with no password. Managed Redis (ElastiCache, Upstash) gives you a host and TLS.\n\nWhat this is\nredis:// is plain. rediss:// is Redis over TLS.\n\nWhy we use it\nThe session token on the wire should not be readable. Same idea as https:// for pages.\n\nWhat the code is doing\nTwo URLs. Use the second in production.\n\nWatch out\nAn open 6379 on the public internet.",
      "code": "redis://localhost:6379\nrediss://default:pass@host:6379"
    },
    {
      "title": "Unique email both places",
      "lang": "txt",
      "desc": "Before you use this\nTwo signups can race. Checking email only in Node is not enough.\n\nWhat this is\nThe database refuses a second row with the same email.\n\nWhy we use it\nUNIQUE / unique index is the real promise. SQL and Mongo both need this rule written down — Mongo will not guess it.\n\nWhat the code is doing\nSQL: email TEXT UNIQUE. Mongo: createIndex email unique.\n\nWatch out\nClean duplicates before you add the index, or the index fails.",
      "code": "email TEXT UNIQUE\ndb.users.createIndex({ email: 1 }, { unique: true })"
    },
    {
      "title": "Cache-aside",
      "lang": "js",
      "desc": "Before you use this\nThe todo already lives in SQL. Redis may hold a 60-second copy. Know GET, miss, then query.\n\nWhat this is\nCache-aside: Redis first, SQL on a miss.\n\nWhy we use it\nHot todos should not hit disk every time. The miss path fills Redis so the next read is fast.\n\nWhat the code is doing\nGET todo:id. If hit, parse JSON. If miss, SELECT, then you should SET EX.\n\nWatch out\nAfter UPDATE, DEL the key or users see the old text.",
      "code": "const hit = await redis.get(\"todo:\" + id);\nif (hit) return JSON.parse(hit);\nconst row = await db.query(\"SELECT * FROM todos WHERE id = $1\", [id]);"
    },
    {
      "title": "Tenant filter on vectors",
      "lang": "sql",
      "desc": "Before you use this\nChunks from many companies can sit in one table. The login already knows the tenant.\n\nWhat this is\nVector search plus a tenant filter.\n\nWhy we use it\nNearest neighbor without a tenant filter can return another company's paragraph. That is a security bug, not a search bug.\n\nWhat the code is doing\nWHERE tenant = $1, then ORDER BY embedding distance, LIMIT 5.\n\nWatch out\nNever take tenant only from the request body. Take it from the session.",
      "code": "SELECT body FROM chunks WHERE tenant = $1 ORDER BY embedding <=> $2 LIMIT 5;"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "Practice: the same todo in SQL",
      "a": "Before you use this\nYou have a todos table. One row is one todo. This lab is only the four SQL verbs.\n\nWhat this is\nCRUD in SQL: INSERT adds, SELECT reads, UPDATE changes, DELETE removes.\n\nWhy we use it\nEvery product that remembers a list starts here. SQL is the source of truth. Redis and Mongo come after you can do these four.\n\nWhat the code is doing\nINSERT puts 'read' in text. Later you SELECT, UPDATE done, DELETE by id.\n\nWatch out\nUPDATE or DELETE without WHERE hits every row.",
      "code": "INSERT INTO todos(text) VALUES ('read');"
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "Practice: the same todo in Mongo",
      "a": "Before you use this\nSame todo, no CREATE TABLE. A collection. One object is one todo.\n\nWhat this is\nCRUD in Mongo: insertOne, find, updateOne + $set, deleteOne.\n\nWhy we use it\nWe use Mongo when the todo can grow extra fields without a migration. The object you save is the shape.\n\nWhat the code is doing\ninsertOne writes { text, done: false }. find lists. $set flips done. deleteOne uses _id.\n\nWatch out\nA second todo can skip done. Your UI must handle a missing field.",
      "code": "await todos.insertOne({ text: \"read\", done: false });"
    },
    {
      "id": 3,
      "level": "intermediate",
      "q": "Practice: login in SQL, session in Redis",
      "a": "Before you use this\nUsers live in SQL. Hash the password with bcrypt. Redis is not the user table.\n\nWhat this is\nAfter a good password check, SET sess:sid → user.id with EX 86400.\n\nWhy we use it\nEvery API server can GET the same session. TTL expires the login. A Redis flush logs people out — accounts stay in SQL.\n\nWhat the code is doing\nbcrypt.compare, then redis.set with EX one day. Cookie holds only the random sid.\n\nWatch out\nNever the only user table in Redis.",
      "code": "await redis.set(\"sess:\" + sid, user.id, \"EX\", 86400);"
    },
    {
      "id": 4,
      "level": "intermediate",
      "q": "Practice: cache a todo",
      "a": "Before you use this\nThe todo is already in SQL. Redis may hold a short copy. Learn GET and SET EX first.\n\nWhat this is\nCache-aside: GET todo:id, on miss SELECT, then SET EX 60.\n\nWhy we use it\nHot reads skip disk. The database stays the truth. TTL keeps the copy from living forever.\n\nWhat the code is doing\nHit → parse JSON. Miss → SQL → SET the JSON for 60 seconds.\n\nWatch out\nAfter an UPDATE you must DEL the key.",
      "code": "await redis.set(\"todo:\" + id, JSON.stringify(row), \"EX\", 60);"
    },
    {
      "id": 5,
      "level": "intermediate",
      "q": "Practice: invalidate on update",
      "a": "Before you use this\nYou already cache todos. Now the user edits the text. SQL is still the truth.\n\nWhat this is\nWrite the database first, then delete the cache key.\n\nWhy we use it\nWithout DEL, the next GET returns the old text until TTL dies. Invalidation is why a cache is safe.\n\nWhat the code is doing\nUPDATE todos SET text. Then redis.del todo:id.\n\nWatch out\nDEL before COMMIT can refill Redis with the old row.",
      "code": "await db.query(\"UPDATE todos SET text = $1 WHERE id = $2\", [text, id]);\nawait redis.del(\"todo:\" + id);"
    },
    {
      "id": 6,
      "level": "beginner",
      "q": "Practice: unique email in Mongo",
      "a": "createIndex unique.",
      "code": "await users.createIndex({ email: 1 }, { unique: true });"
    },
    {
      "id": 7,
      "level": "advanced",
      "q": "Practice: RAG retrieve",
      "a": "embed + ORDER BY distance + tenant.",
      "code": "ORDER BY embedding <=> $2 LIMIT 5"
    },
    {
      "id": 8,
      "level": "intermediate",
      "q": "Practice: TLS URLs",
      "a": "postgres SSL, rediss, mongodb+srv.",
      "code": "rediss://...  // Redis TLS"
    },
    {
      "id": 9,
      "level": "beginner",
      "q": "Why not users only in Redis?",
      "a": "Before you use this\nRedis is RAM. FLUSHALL, eviction, or a restart without persistence can drop every key.\n\nWhat this is\nUsers are durable facts. They belong in SQL (or Mongo), not only in Redis.\n\nWhy we use it\nRedis is perfect for the session next to the user row. It is a terrible only copy of accounts, passwords, or orders.\n\nWhat the code is doing\nThe comment says the users table stays in SQL. Redis holds sess:sid only.\n\nWatch out\nA flush that wipes the only user table is a company-ending event.",
      "code": "// users table stays in SQL"
    },
    {
      "id": 10,
      "level": "intermediate",
      "q": "Practice: owner id in both stores",
      "a": "Filter every read.",
      "code": "find({ userId: req.user.id })"
    },
    {
      "id": 11,
      "level": "beginner",
      "q": "Practice: 403 if wrong tenant on chunks",
      "a": "Compare tenant from the login.",
      "code": "if (chunk.tenant !== req.user.tenant) return res.status(403).end();"
    },
    {
      "id": 12,
      "level": "advanced",
      "q": "Practice: dual-write rename",
      "a": "Update SQL name and Mongo authorName.",
      "code": "await sql.query(\"UPDATE users SET name = $1 WHERE id = $2\", [name, id]);"
    },
    {
      "id": 13,
      "level": "intermediate",
      "q": "Practice: connection strings in env",
      "a": "No passwords in Slack.",
      "code": "process.env.DATABASE_URL"
    },
    {
      "id": 14,
      "level": "beginner",
      "q": "CRUD map",
      "a": "Create insert, Read find, Update $set, Delete delete.",
      "code": "-- four verbs, two engines"
    },
    {
      "id": 15,
      "level": "intermediate",
      "q": "Practice: HTTPS app still uses TLS to DB",
      "a": "Turn SSL on to RDS.",
      "code": "ssl: { rejectUnauthorized: true }"
    },
    {
      "id": 16,
      "level": "beginner",
      "q": "Practice: GET vs SCAN",
      "a": "Redis GET by key. Never KEYS *.",
      "code": "await redis.get(\"todo:1\");"
    },
    {
      "id": 17,
      "level": "advanced",
      "q": "Practice: vector delete with the file",
      "a": "deleteMany sourceId.",
      "code": "await chunks.deleteMany({ sourceId });"
    },
    {
      "id": 18,
      "level": "intermediate",
      "q": "Practice: login 401 vs cache miss",
      "a": "Missing session is 401. Missing cache is a DB load.",
      "code": "if (!sid) return res.status(401).end();"
    },
    {
      "id": 19,
      "level": "beginner",
      "q": "SQL vs NoSQL — how do you choose?",
      "a": "Before you use this\nWrite three queries you must support: login by email, orders for this user, session for 30 minutes. Then pick a store. Do not start from a brand name.\n\nWhat this is\nSQL vs NoSQL is a shape-and-questions choice, not a speed contest.\n\nWhy we use it\nMany joins, reports, money, unique email → SQL (Postgres). Nested documents you always load together, fields that change weekly → Mongo. Fast TTL, sessions, rate limits → Redis. Most products start with one SQL database and add the others.\n\nAlso know\nNoSQL is a family (document, key-value, wide-column, graph), not one product. Duplication is often the design in NoSQL. In SQL it is usually a mistake until you denormalize on purpose.\n\nWatch out\nPicking Mongo from a tutorial, then rebuilding relations for a year, is the usual regret.",
      "code": "-- users + orders + money → Postgres\n-- blog post with nested comments → Mongo\n-- session 30 min → Redis",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 20,
      "level": "beginner",
      "q": "When do you use Redis?",
      "a": "Before you use this\nYou already have Postgres or Mongo for users. Redis is the extra fast shelf. Learn GET, SET, EX. Default port 6379.\n\nWhat this is\nRedis is an in-memory store for cache, sessions, rate limits, leaderboards, and short locks.\n\nWhy we use it\nThe same hot read should not hit disk a thousand times. Every API server can see the same key — an in-memory Map on one Node process cannot. TTL expires sessions and counters without a cron.\n\nAlso know\nCache-aside: GET, miss, load SQL, SET EX. After a write, DEL the key. Prefix keys (prod:user:1). Use rediss:// in production.\n\nWatch out\nNot the only copy of users or money. A FLUSHALL should be annoying, not a company-ending event. Never KEYS * in production.",
      "code": "await redis.set(\"sess:\" + sid, userId, \"EX\", 86400);",
      "ask": "Most asked · Amazon · Uber · Google"
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "What is the CAP theorem?",
      "a": "Before you use this\nKnow that a network can split two machines. Both still want to answer. That is the failure CAP talks about — not a normal Tuesday.\n\nWhat this is\nOn a network split you cannot have both perfect Consistency (every reader sees the latest write) and perfect Availability (every node still answers).\n\nWhy we use it\nWe use CAP to pick a store under failure. A bank ledger leans C — wait, do not guess the balance. A shopping-cart cache can lean A — serve a slightly old cart rather than an error.\n\nWhat happens\nA relational primary leans C. Dynamo-style stores often lean A plus eventual consistency. Replicas catch up. Interviews want the trade-off, not a slogan.\n\nWatch out\nCAP is not a reason to skip backups. It does not mean 'NoSQL has no consistency'.",
      "code": "// primary SQL — wait for the write (C)\n// replica / cache — may be a second behind (A / latency)",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "What is eventual consistency?",
      "a": "The write is accepted now. Replicas catch up soon. A read may miss the new todo for a moment. Fine for likes. Painful for 'did my payment land?'.",
      "code": "await redis.set(\"todo:\" + id, JSON.stringify(row), \"EX\", 60);\n// a read on another replica might still be old for a short time",
      "ask": "Most asked · Amazon · Google · Meta"
    },
    {
      "id": 23,
      "level": "intermediate",
      "q": "Replica vs shard?",
      "a": "Before you use this\nOne primary database is enough until reads or size hurt. Do not shard for a homework app.\n\nWhat this is\nA replica is a full copy for reads or failover. A shard is a slice of the data (users A–M on box 1).\n\nWhy we use it\nReplicas help read load and survival if the primary dies. Shards help when one box cannot hold the data or the write traffic. Different problems, different tool.\n\nWhat happens\nWrites go to a primary. Replicas copy. A shard key (user_id) picks the box. Cross-shard joins are hard.\n\nWatch out\nA shard key that dumps all writes onto one node. Reading a just-written row from a lagging replica.",
      "code": "-- replica: same data, another box\n-- shard: user_id % 4 → four boxes",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 24,
      "level": "beginner",
      "q": "When is Mongo a good fit?",
      "a": "Before you use this\nKnow that a document is one object. You do not CREATE TABLE. Still decide what one document means.\n\nWhat this is\nMongo fits when the document is the unit you read and write together — a post plus its comments.\n\nWhy we use it\nThe shape can change next week without a migration. Nested data matches the API. Node teams already think in objects.\n\nWhat happens\ninsertOne a post with comments: []. findOne by _id loads the whole thing. A second post can skip a field.\n\nWatch out\nWhen you need multi-row money or five-table reports, start with SQL. Unique email still needs a unique index.",
      "code": "await posts.insertOne({ title, comments: [] });",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 25,
      "level": "beginner",
      "q": "What is a TTL key in Redis?",
      "a": "Before you use this\nYou already SET a key. Decide how long that copy may live. Cache: minutes. Session: hours or a day. Rate limit: the window (60 seconds).\n\nWhat this is\nTTL is time to live. After N seconds the key disappears. SET key value EX 60.\n\nWhy we use it\nWe use TTL so stale cache dies, sessions log out, and rate-limit windows reset — without a cleanup job.\n\nWhat happens\nGET after expiry returns null. The next read misses and reloads SQL. Eviction can also drop keys if RAM is full.\n\nWatch out\nIf you forget EX, Redis grows forever. A key without TTL is a leak.",
      "code": "await redis.set(\"login:\" + ip, \"1\", \"EX\", 60);",
      "ask": "Most asked · Amazon · Uber"
    },
    {
      "id": 26,
      "level": "intermediate",
      "q": "Keyword search vs vector search?",
      "a": "Before you use this\nUsers still live in SQL. You need an embedding model and chunks of text. LIKE '%term%' is keyword search — you already know that.\n\nWhat this is\nKeyword matches letters. Vector search matches meaning ('bike' ≈ 'bicycle'). Hybrid does both. RAG retrieves chunks, then the LLM writes.\n\nWhy we use it\nWe use vectors when the user does not type the exact word. A help-center search for 'reset password' should still find 'forgot login'.\n\nWhat happens\nEmbed the question. ORDER BY distance. LIMIT 5. Always WHERE tenant = the login tenant.\n\nWatch out\nA vector DB does not replace Postgres. Retrieve without a tenant filter leaks another company's paragraphs.",
      "code": "SELECT body FROM chunks\nWHERE tenant = $1\nORDER BY embedding <=> $2\nLIMIT 5;",
      "ask": "Most asked · Google · Meta · Microsoft"
    }
  ]
};
