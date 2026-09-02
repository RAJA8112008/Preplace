window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["practice-datastores"] = {
  "kind": "practice",
  "notes": [
    {
      "title": "How to use this lab",
      "body": "Same todo/user story in SQL, Mongo, Redis, and a tiny vector search."
    },
    {
      "title": "Auth",
      "body": "Users in SQL. Session in Redis. Never the only user table in Redis."
    },
    {
      "title": "HTTPS",
      "body": "Drivers use TLS to Atlas / RDS. redis:// vs rediss://."
    }
  ],
  "examples": [
    {
      "title": "SQL todo CRUD",
      "lang": "sql",
      "desc": "Four statements.",
      "code": "INSERT INTO todos(text) VALUES ('read');\nSELECT * FROM todos;\nUPDATE todos SET done = true WHERE id = 1;\nDELETE FROM todos WHERE id = 1;"
    },
    {
      "title": "Mongo todo CRUD",
      "lang": "js",
      "desc": "insert / find / update / delete.",
      "code": "await c.insertOne({ text: \"read\" });\nawait c.find().toArray();\nawait c.updateOne({ _id }, { $set: { done: true } });\nawait c.deleteOne({ _id });"
    },
    {
      "title": "Redis session",
      "lang": "js",
      "desc": "SET EX after SQL login.",
      "code": "await redis.set(\"sess:\" + sid, userId, \"EX\", 86400);"
    },
    {
      "title": "pgvector insert",
      "lang": "sql",
      "desc": "Chunk + embedding.",
      "code": "INSERT INTO chunks(body, embedding) VALUES ($1, $2);"
    },
    {
      "title": "rediss://",
      "lang": "txt",
      "desc": "TLS to managed Redis.",
      "code": "redis://localhost:6379\nrediss://default:pass@host:6379"
    },
    {
      "title": "Unique email both places",
      "lang": "txt",
      "desc": "SQL UNIQUE. Mongo unique index.",
      "code": "email TEXT UNIQUE\ndb.users.createIndex({ email: 1 }, { unique: true })"
    },
    {
      "title": "Cache-aside",
      "lang": "js",
      "desc": "Redis then SQL.",
      "code": "const hit = await redis.get(\"todo:\" + id);\nif (hit) return JSON.parse(hit);\nconst row = await db.query(\"SELECT * FROM todos WHERE id = $1\", [id]);"
    },
    {
      "title": "Tenant filter on vectors",
      "lang": "sql",
      "desc": "Always WHERE tenant = $1.",
      "code": "SELECT body FROM chunks WHERE tenant = $1 ORDER BY embedding <=> $2 LIMIT 5;"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "Practice: the same todo in SQL",
      "a": "INSERT SELECT UPDATE DELETE.",
      "code": "INSERT INTO todos(text) VALUES ('read');"
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "Practice: the same todo in Mongo",
      "a": "insertOne find updateOne deleteOne.",
      "code": "await todos.insertOne({ text: \"read\", done: false });"
    },
    {
      "id": 3,
      "level": "intermediate",
      "q": "Practice: login in SQL, session in Redis",
      "a": "bcrypt then SET EX.",
      "code": "await redis.set(\"sess:\" + sid, user.id, \"EX\", 86400);"
    },
    {
      "id": 4,
      "level": "intermediate",
      "q": "Practice: cache a todo",
      "a": "GET, miss, SQL, SET EX.",
      "code": "await redis.set(\"todo:\" + id, JSON.stringify(row), \"EX\", 60);"
    },
    {
      "id": 5,
      "level": "intermediate",
      "q": "Practice: invalidate on update",
      "a": "UPDATE sql then DEL key.",
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
      "a": "A flush can wipe the only copy.",
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
    }
  ]
};
