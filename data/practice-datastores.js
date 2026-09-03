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
      "a": "The problem before\nTeams picked Mongo because a tutorial said it was modern, then spent a year rebuilding relations for money and unique email. Others stuffed nested comments into five SQL tables and cried on every page load. Nobody wrote the three queries they must support before they bought a logo.\nWhat this is\nSQL versus NoSQL is a shape-and-questions choice, not a speed contest. SQL, such as Postgres, is tables, joins, constraints, and transactions. NoSQL is a family: document Mongo, key-value Redis, wide-column, graph — not one product. You start from the questions: login by email, orders for this user, session for thirty minutes.\nWhat it solves\nMany joins, reports, money, unique email point to SQL. Nested documents you always load together, fields that change weekly, point to Mongo. Fast TTL, sessions, and rate limits point to Redis. Most products start with one SQL database and add the others for a job, not as a religion. Duplication is often the design in documents; in SQL it is usually a mistake until you denormalize on purpose.\nReal-life example\nA bank ledger of accounts and transfers is SQL. A kirana product page that is one blob of title, photos, and tags can be a Mongo document. The warehouse sticky note that must die in thirty minutes is Redis. The regret story is Mongo-first, then invoices.\nUses\nOpening interview question. Say the three queries out loud. Draw users and orders in Postgres, session in Redis, a blog post with comments in Mongo. Mention transactions for money.\nWatch out\nPicking a brand from a blog, then rebuilding relations for a year. Using Redis as the only user table. Assuming NoSQL means no consistency. Skipping UNIQUE on email because the app checks first.",
      "code": "-- users + orders + money → Postgres\n-- blog post with nested comments → Mongo\n-- session 30 min → Redis",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 20,
      "level": "beginner",
      "q": "When do you use Redis?",
      "a": "The problem before\nEvery page load hit the disk ledger for the same hot todo. Sessions lived in one Node process memory, so the second API box did not know Ada was logged in. Someone stored users only in Redis because it was fast. A flush ended the company.\nWhat this is\nRedis is an in-memory store for cache, sessions, rate limits, leaderboards, and short locks. You GET and SET by key. EX sets a TTL. Default port 6379. It sits beside Postgres or Mongo; it is not their replacement. Cache-aside: GET, miss, load SQL, SET EX. After a write, DEL the key.\nWhat it solves\nThe same hot read should not hit disk a thousand times. Every API server can see the same key — an in-memory Map on one process cannot. TTL expires sessions and counters without a cron. Rate limits share a count across boxes. A lock can be SET NX EX.\nReal-life example\nThe warehouse keeps the ledger in the back, SQL, and a sticky note on the glass for the festival SKU, Redis. The bank session is a wrist stamp that fades at sundown, EX. The kirana till clicker for thirty trucks a minute is INCR plus EXPIRE. A FLUSHALL tears the notes, not the ledger.\nUses\nsess:sid, todo:id cache, rl:ip, leaderboards, and pub/sub if they ask. Prefix keys such as prod:user:1. Use rediss:// in production. Mention eviction when RAM is full.\nWatch out\nNot the only copy of users or money. A FLUSHALL should be annoying, not fatal. Never KEYS star in production. Forgetting EX grows RAM forever. After UPDATE, DEL or users see the old text.",
      "code": "await redis.set(\"sess:\" + sid, userId, \"EX\", 86400);",
      "ask": "Most asked · Amazon · Uber · Google"
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "What is the CAP theorem?",
      "a": "The problem before\nTwo machines still wanted to answer after the phone line died. Candidates recited consistency, availability, partition tolerance and could not pick a store. A homework app used CAP as a reason to skip backups. The bank and the like-button were treated as the same object.\nWhat this is\nOn a network split you cannot have both perfect consistency — every reader sees the latest write — and perfect availability — every node still answers. You still want to survive the split. A relational primary leans C: wait for the write. Dynamo-style stores often lean A plus eventual consistency. Replicas catch up.\nWhat it solves\nWe use CAP to pick a store under failure. A bank ledger leans C — do not guess the balance. A shopping-cart cache can lean A — serve a slightly old cart rather than an error. Interviews want the trade-off on a named object, not a slogan.\nReal-life example\nTwo warehouse books. If the radio dies, the vault waits — C. The kirana like-counter keeps tapping and syncs tonight — A. Primary SQL waits for COMMIT. A replica or cache may be a second behind.\nUses\nCompare Postgres primary, read replicas, Redis cache, and Dynamo. Draw the broken line. Soft everyday form: replica lag. Pair with the next card on eventual consistency.\nWatch out\nCAP is not a normal Tuesday. It does not mean NoSQL has no consistency. It is not a reason to skip backups. Do not claim all three during a partition. Name the object: balance versus like. Name the object first — money, cart, or likes — then say which side you keep when the phone line dies.",
      "code": "// primary SQL — wait for the write (C)\n// replica / cache — may be a second behind (A / latency)",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "What is eventual consistency?",
      "a": "The problem before\nAda saved a todo and immediately opened it on her phone. The phone hit a replica that had not caught up. She thought the save failed and clicked again. The bank used the same it-will-appear-shortly story for a payment and two clerks double-refunded.\nWhat this is\nEventual consistency means the write is accepted now and replicas catch up soon. A read may miss the new todo for a moment. There is no instant global agreement. Caches with TTL are an everyday cousin: Redis may hold old JSON until DEL or EX. Conflict rules such as last write wins appear if two sides wrote during a split.\nWhat it solves\nThe system stays up and fast when you can live with a short lag: likes, view counts, shopping-cart caches, warehouse location pings. You stop blocking the customer for a global lock. You also know when you must not use it: did my payment land needs a primary read or a wait.\nReal-life example\nThe kirana chalkboard in the window updates a minute after the back-room ledger. Fine for mangoes arrived. The bank slip must show the deposit before the customer leaves — that is not eventual. A Redis SET of a todo can be old on another box for a short time.\nUses\nExplain replica lag, Dynamo-style stores, CDN caches, and Redis. Contrast with read-your-writes: read the primary after a POST. Mention idempotency when clients retry because they saw lag.\nWatch out\nPainful for payments, inventory decrement, and unique seat booking. Last-write-wins can erase a clerk's edit. Showing a 201 then a missing row on GET is a UX bug unless you stick the read to the primary. Do not call a single Postgres COMMIT eventually consistent.",
      "code": "await redis.set(\"todo:\" + id, JSON.stringify(row), \"EX\", 60);\n// a read on another replica might still be old for a short time",
      "ask": "Most asked · Amazon · Google · Meta"
    },
    {
      "id": 23,
      "level": "intermediate",
      "q": "Replica vs shard?",
      "a": "The problem before\nOne primary was enough until reads or size hurt. A homework app sharded users on day one and could not join orders. Another team added a replica and wrote to it. Someone used the words copy and slice as if they were the same.\nWhat this is\nA replica is a full copy for reads or failover. A shard is a slice of the data: users A to M on box 1, N to Z on box 2. Writes go to a primary, per shard. Replicas copy. A shard key such as user_id picks the box. Cross-shard joins are hard.\nWhat it solves\nReplicas help read load and survival if the primary dies. Shards help when one box cannot hold the data or the write traffic. Different problems, different tool. You scale reads first — replica, cache — then writes, shard, as in the sysdesign lab.\nReal-life example\nThe warehouse photocopies the whole catalogue for three viewing windows — replicas. Splitting aisles so spices live in building A and tins in building B is sharding. The bank's backup ledger in another city is a replica. Splitting accounts by last digit is a shard.\nUses\nInterview scaling ladder: index, cache, replica, then shard. Mention shard keys, hot partitions, and replica lag. Mongo shard clusters and Postgres Citus are later sentences.\nWatch out\nA shard key that dumps all writes onto one node. Reading a just-written row from a lagging replica. Sharding a homework app. Cross-shard transactions for money. Replicas are not extra write capacity. Do not shard because a blog said so; copy the catalogue first, and only split aisles when one room cannot hold the stock.",
      "code": "-- replica: same data, another box\n-- shard: user_id % 4 → four boxes",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 24,
      "level": "beginner",
      "q": "When is Mongo a good fit?",
      "a": "The problem before\nTeams used Mongo for invoices with five-way relations, or used SQL for a post that always loaded with fifty nested comments. They skipped a unique index on email because schema-less sounded like no rules. A second document omitted done and the UI crashed.\nWhat this is\nMongo is a document store. One object is the unit you read and write together — a post plus its comments. You do not CREATE TABLE, but you still decide what one document means. Fields can appear on the next document without a migration. Unique indexes are still real.\nWhat it solves\nThe shape can change next week. Nested data matches the API. Node teams already think in objects. insertOne a post with comments as an empty list. findOne by id loads the whole thing. You avoid five joins for a page that is naturally one blob.\nReal-life example\nA kirana product page — title, photos, spice tags — is one folder you always carry together. A bank transfer graph is not. The warehouse inspection report with a nested photo list fits a document. The user-and-ledger table still wants SQL.\nUses\nCMS, catalogues, event blobs, nested todos. Contrast with SQL for money and reports. Always createIndex unique on email. Use dollar-set on update so you do not wipe fields.\nWatch out\nWhen you need multi-row money or five-table reports, start with SQL. Schema-less is not constraint-less. Update without dollar-set can replace the document. A missing field is a UI bug waiting. Transactions exist but are not why you picked Mongo. Schema-less is not rule-less: unique email and a meaning for each document still belong in the interview answer.",
      "code": "await posts.insertOne({ title, comments: [] });",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 25,
      "level": "beginner",
      "q": "What is a TTL key in Redis?",
      "a": "The problem before\nSomeone SET a session key and never set an expiry. Redis grew until the box died. Rate-limit counters lived forever and locked an IP for life. Cache keys from last Diwali still sat in RAM. Nobody had a cleanup cron, and nobody needed one if they had used EX.\nWhat this is\nTTL is time to live. After N seconds the key disappears. SET key value EX 60. Cache: minutes. Session: hours or a day. Rate limit: the window, sixty seconds. GET after expiry returns null. Eviction can also drop keys if RAM is full, which is not the same as TTL.\nWhat it solves\nStale cache dies. Sessions log out. Rate-limit windows reset. You skip a cleanup job. Cache-aside reloads SQL on the next miss. A lock with EX cannot deadlock forever if the holder crashes.\nReal-life example\nA warehouse sticky note dated throw away after sixty seconds. A bank wrist stamp that fades at closing. The kirana parking chit that expires in an hour. If you forget the stamp date, the glass fills with notes until it cracks — that is RAM.\nUses\nlogin:ip, sess:sid, todo:id cache, short locks. Pair EX on first INCR for rate limits. Mention persist versus expire. Use EXPIRE on existing keys if you SET without EX.\nWatch out\nIf you forget EX, Redis grows forever. A key without TTL is a leak. Eviction may drop a session early if you overfill RAM — that is a capacity bug. TTL is not a substitute for DEL after a write if users must see the new text now.",
      "code": "await redis.set(\"login:\" + ip, \"1\", \"EX\", 60);",
      "ask": "Most asked · Amazon · Uber"
    },
    {
      "id": 26,
      "level": "intermediate",
      "q": "Keyword search vs vector search?",
      "a": "The problem before\nLIKE percent-term-percent only finds the same letters. A help-center user typed reset password and missed the article titled forgot login. Teams dumped all company paragraphs into one vector table and retrieved another tenant's text. Someone claimed the vector DB replaced Postgres.\nWhat this is\nKeyword search matches letters — LIKE or full-text. Vector search matches meaning: bike is near bicycle because embeddings sit nearby. Hybrid does both. RAG retrieves chunks, then the LLM writes. You store body plus embedding, then ORDER BY distance, LIMIT 5, always with a tenant filter.\nWhat it solves\nUsers who do not type the exact word still find the paragraph. A warehouse search for pallet jack can find hand truck. You keep users in SQL. The chunk table sits beside the user table. Authorization is a WHERE, not a hope.\nReal-life example\nThe kirana clerk asks for washing bar and the meaning shelf points at laundry soap. The bank policy search for close account still finds terminate relationship. A warehouse safety search must not return another company's incident report — that is the tenant clause.\nUses\nHelp centers, RAG chat, semantic product search. Embed the question, ORDER BY embedding distance, LIMIT 5, WHERE tenant equals the session tenant. Keyword still wins for SKUs and order ids. Always take tenant from the login.\nWatch out\nA vector DB does not replace Postgres. Retrieve without a tenant filter leaks. Never take tenant only from the request body. Garbage embeddings in, garbage neighbors out. Keyword is better for exact ids. A vector table is not a user table; keep login and money in SQL and always filter chunks by tenant.",
      "code": "SELECT body FROM chunks\nWHERE tenant = $1\nORDER BY embedding <=> $2\nLIMIT 5;",
      "ask": "Most asked · Google · Meta · Microsoft"
    }
  ]
};
