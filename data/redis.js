window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["redis"] = {
  "kind": "design",
  "notes": [
    {
      "title": "What Redis is",
      "layers": [
        [
          {
            "label": "App",
            "tone": "stateless"
          }
        ],
        [
          {
            "label": "Redis (memory)",
            "tone": "store"
          },
          {
            "label": "Postgres / Mongo",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Request",
        "App",
        "Redis GET",
        "Hit return / miss load DB"
      ],
      "body": "Redis is an in-memory store. It keeps data in RAM, so reads and writes are very fast — often under one millisecond. People use it as a cache, a session store, a rate-limit counter, a queue, and a pub/sub bus. It is not a replacement for your main database. If Redis restarts without persistence, cache data can disappear. That is acceptable for a cache and dangerous for the only copy of an order."
    },
    {
      "title": "Why apps add Redis",
      "flow": [
        "Hot read",
        "Skip disk DB",
        "Lower latency",
        "Lower DB load"
      ],
      "body": "A database is correct and durable. It is also slower and more expensive under a flood of the same read. Redis sits in front for keys that many users ask for: a profile, a product page, a session. You still write the truth to Postgres or Mongo. Redis holds a short-lived copy. If the copy is missing, the app loads the database and fills Redis again."
    },
    {
      "title": "Strings, hashes, lists, sets, zsets",
      "body": "A string is one value at one key: session:ada → token. A hash is many fields under one key: user:1 name Ada, age 21. A list is a queue (LPUSH / RPOP). A set is unique members (SADD). A sorted set (ZSET) is unique members with a score — leaderboards and sliding-window rate limits. Pick the type that matches the access pattern. Do not store a giant JSON blob in a string if you only need one field."
    },
    {
      "title": "TTL and eviction",
      "flow": [
        "SET key",
        "EXPIRE 120s",
        "Key vanishes",
        "Next read misses"
      ],
      "body": "TTL (time to live) is how long a key may stay. SET user:1 ... EX 120 deletes the key after two minutes. When memory is full, Redis evicts keys by a policy such as allkeys-lru (least recently used). Always set a TTL on cache keys. A key without a TTL can live forever and fill RAM."
    },
    {
      "title": "Cache-aside (the usual pattern)",
      "flow": [
        "GET cache",
        "Hit → return",
        "Miss → DB",
        "SET cache + TTL"
      ],
      "body": "The application owns the cache. Read Redis first. On a hit, return. On a miss, read the database, then SET the cache with a TTL. When you update the database, delete or overwrite that key so users do not see a stale price or a revoked permission. This is the pattern to draw in interviews."
    },
    {
      "title": "Sessions and rate limits",
      "body": "Store a session as session:<id> → user json with a TTL that matches 'stay logged in'. For rate limits, INCR a key like rl:user:42 and EXPIRE it on the first increment. If the count is above N, return HTTP 429. Redis is shared, so two API servers see the same counter. An in-memory Map on one server does not."
    },
    {
      "title": "Pub/sub and streams",
      "body": "PUBLISH / SUBSCRIBE sends a message to current listeners. If nobody is listening, the message is gone. Redis Streams keep a log you can read later and acknowledge — closer to a small queue. Use pub/sub for live presence. Use Streams or a real queue (SQS, Kafka) when you must not lose work."
    },
    {
      "title": "Persistence (RDB and AOF)",
      "body": "RDB snapshots the dataset to disk on a schedule. AOF appends every write. You can enable both. Persistence does not make Redis a full database: restores are slower, and a crash can still lose the last second of writes. For checkout truth, keep Postgres as the source of record."
    },
    {
      "title": "Replication and Cluster",
      "layers": [
        [
          {
            "label": "App"
          }
        ],
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
      "body": "A replica copies the primary for reads and failover. Redis Cluster shards keys across nodes using hash slots. You need Cluster (or a sharded proxy) when one machine's RAM is not enough. A replica that lags can serve a stale session. Failover is an operational plan, not a checkbox."
    },
    {
      "title": "What not to put in Redis",
      "body": "Do not store the only copy of money, orders, or legal documents. Do not store huge files. Do not use KEYS * in production (it blocks the server); use SCAN. Do not share one Redis without prefixes between prod and test. Do not put secrets in keys that every service can READ."
    }
  ],
  "examples": [
    {
      "title": "Cache a user profile",
      "lang": "js",
      "flow": [
        "GET /users/1",
        "Redis GET user:1",
        "miss",
        "SQL",
        "SET EX 120"
      ],
      "desc": "Definition. The API checks Redis before Postgres.\n\nHow it works. A hit returns JSON immediately. A miss loads the row, stores it for 120 seconds, then returns.\n\nOperational risk. Updating the user name in SQL without DEL user:1 shows the old name until TTL ends.",
      "code": "async function getUser(id) {\n  const key = \"user:\" + id;\n  const hit = await redis.get(key);\n  if (hit) return JSON.parse(hit);\n  const row = await db.users.find(id);\n  if (!row) return null;\n  await redis.set(key, JSON.stringify(row), \"EX\", 120);\n  return row;\n}"
    },
    {
      "title": "Invalidate after an update",
      "lang": "js",
      "flow": [
        "PATCH user",
        "UPDATE sql",
        "DEL user:1"
      ],
      "desc": "Definition. A write must change the source of truth and drop the stale cache key.\n\nHow it works. Update Postgres first. Then DEL the key so the next read refills from SQL.\n\nOperational risk. Deleting before the commit can refill Redis with the old row.",
      "code": "async function updateUser(id, patch) {\n  await db.users.update(id, patch);\n  await redis.del(\"user:\" + id);\n}"
    },
    {
      "title": "Session with TTL",
      "lang": "js",
      "desc": "Definition. A session is a random id that points at the logged-in user.\n\nHow it works. After login, SET session:<token> to the user id with EX 86400 (one day). Each request GETs that key. Logout DELs it. Sliding sessions can EXPIRE again on activity.\n\nOperational risk. A token without TTL lives until Redis evicts it.",
      "code": "await redis.set(\"session:\" + token, userId, \"EX\", 86400);\nconst userId = await redis.get(\"session:\" + token);"
    },
    {
      "title": "Rate limit with INCR",
      "lang": "js",
      "flow": [
        "Request",
        "INCR rl:user",
        "EXPIRE first time",
        "if n > 100 → 429"
      ],
      "desc": "Definition. Count requests per user per minute in Redis so every API replica shares the same budget.\n\nHow it works. INCR creates the key at 1. EXPIRE on n === 1 starts the window. If n > 100, reject.\n\nOperational risk. Forgetting EXPIRE leaves the counter forever and blocks the user.",
      "code": "async function allow(userId) {\n  const key = \"rl:\" + userId;\n  const n = await redis.incr(key);\n  if (n === 1) await redis.expire(key, 60);\n  return n <= 100;\n}"
    },
    {
      "title": "Simple queue with a list",
      "lang": "js",
      "desc": "Definition. LPUSH adds work. BRPOP waits for work. That is a tiny queue.\n\nHow it works. The API pushes a job JSON. A worker blocks on BRPOP and processes one job.\n\nOperational risk. If the worker crashes after pop and before finish, the job is gone. Use Streams or a real queue when loss is not allowed.",
      "code": "await redis.lpush(\"mail:jobs\", JSON.stringify({ to: \"a@b.com\" }));\nconst job = await redis.brpop(\"mail:jobs\", 0);"
    },
    {
      "title": "Leaderboard with a sorted set",
      "lang": "js",
      "desc": "Definition. A ZSET stores members with scores. ZINCRBY adds points. ZREVRANGE reads the top.\n\nHow it works. Player names are members. Scores are points. Redis keeps them ordered.\n\nOperational risk. Using a SQL ORDER BY on every page refresh when the table is huge.",
      "code": "await redis.zincrby(\"game:scores\", 10, \"ada\");\nconst top = await redis.zrevrange(\"game:scores\", 0, 9, \"WITHSCORES\");"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "What is Redis?",
      "a": "Definition. Redis is an in-memory key-value store used as a cache, session store, counter, and small queue.\n\nHow it works. Data lives in RAM. Commands like GET and SET are extremely fast.\n\nOperational risk. Treating Redis as the only database for orders or money."
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "Why is Redis faster than Postgres for the same read?",
      "a": "Definition. Redis reads RAM. Postgres reads a durable engine that may hit disk and run a query planner.\n\nHow it works. A cache key is an exact lookup. A SQL query may scan or join.\n\nOperational risk. Caching a result that must be strongly consistent, such as a bank balance, without a plan."
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "What is a key?",
      "a": "Definition. A key is the name you store a value under, such as user:42.\n\nHow it works. Use colons as namespaces: env:service:id. That avoids clashes.\n\nConfiguration. prod:session:abc and test:session:abc stay apart.\n\nOperational risk. Two apps using user:1 for different shapes of data."
    },
    {
      "id": 4,
      "level": "beginner",
      "q": "What is TTL?",
      "a": "Definition. TTL is how many seconds a key may live.\n\nHow it works. EXPIRE or SET ... EX 60. After that, GET returns null.\n\nOperational risk. Cache keys with no TTL fill memory."
    },
    {
      "id": 5,
      "level": "beginner",
      "q": "What is cache-aside?",
      "a": "Definition. The app checks Redis, loads the database on a miss, then fills Redis.\n\nHow it works. Reads go cache-first. Writes update the database, then delete the key.\n\nOperational risk. Updating SQL and forgetting to invalidate.",
      "flow": [
        "GET cache",
        "miss",
        "DB",
        "SET"
      ]
    },
    {
      "id": 6,
      "level": "beginner",
      "q": "What is a cache hit and a cache miss?",
      "a": "Definition. A hit means Redis had the key. A miss means it did not.\n\nHow it works. Hit ratio = hits / (hits + misses). Low hit ratio means Redis is not helping.\n\nOperational risk. A flush that turns every read into a miss and knocks over the database."
    },
    {
      "id": 7,
      "level": "intermediate",
      "q": "When should you use a hash instead of a string?",
      "a": "Definition. Use a hash when one key has several fields you read or write separately.\n\nHow it works. HGET user:1 name does not parse a whole JSON blob.\n\nOperational risk. HSET on a key that is already a string type errors."
    },
    {
      "id": 8,
      "level": "intermediate",
      "q": "How do you store a login session in Redis?",
      "a": "Definition. After password check, save session:<random> → userId with a TTL.\n\nHow it works. The browser keeps the random token in a cookie. Each request GETs the key.\n\nOperational risk. A guessable session id."
    },
    {
      "id": 9,
      "level": "intermediate",
      "q": "How do you rate-limit with Redis?",
      "a": "Definition. INCR a per-user key and EXPIRE the window.\n\nHow it works. Shared Redis means every API replica sees the same count.\n\nOperational risk. Limiting only in one Node process while you run four processes."
    },
    {
      "id": 10,
      "level": "intermediate",
      "q": "What is LRU eviction?",
      "a": "Definition. When RAM is full, Redis can drop the least recently used keys.\n\nHow it works. maxmemory and maxmemory-policy allkeys-lru.\n\nOperational risk. Evicting session keys if you mix cache and sessions without a separate instance or prefix policy."
    },
    {
      "id": 11,
      "level": "intermediate",
      "q": "What is the difference between DEL and invalidation after write?",
      "a": "Definition. DEL removes the stale copy so the next read refills from the database.\n\nHow it works. Write SQL first, then DEL. That is safer than DEL then write.\n\nOperational risk. Two servers writing different values without a version."
    },
    {
      "id": 12,
      "level": "advanced",
      "q": "What is a cache stampede?",
      "a": "Definition. Many clients miss the same expired key and all hit the database.\n\nHow it works. Use a lock, singleflight, or jittered TTL.\n\nOperational risk. One popular key with a 60s TTL aligned to a cron."
    },
    {
      "id": 13,
      "level": "intermediate",
      "q": "Pub/sub versus Streams?",
      "a": "Definition. Pub/sub is fire-and-forget to current subscribers. Streams keep a log.\n\nHow it works. Use pub/sub for 'user is typing'. Use Streams or SQS when the email must send even if the worker was down.\n\nOperational risk. Using pub/sub for payments."
    },
    {
      "id": 14,
      "level": "beginner",
      "q": "Can Redis replace MongoDB?",
      "a": "Definition. No, not as the system of record for most products.\n\nHow it works. Redis is memory-first. Mongo and Postgres persist documents and rows with richer queries.\n\nOperational risk. A Redis restart wiping the only user table."
    },
    {
      "id": 15,
      "level": "intermediate",
      "q": "What does KEYS * do that is dangerous?",
      "a": "Definition. KEYS scans every key and blocks Redis while it runs.\n\nHow it works. Use SCAN in loops for cleanup jobs.\n\nOperational risk. Running KEYS * on production to 'just look'."
    },
    {
      "id": 16,
      "level": "intermediate",
      "q": "How do you namespace keys?",
      "a": "Definition. Prefix every key with app and environment: prep:prod:user:1.\n\nHow it works. One Redis can hold many apps if prefixes never overlap.\n\nOperational risk. FLUSHALL on a shared instance."
    },
    {
      "id": 17,
      "level": "advanced",
      "q": "RDB versus AOF?",
      "a": "Definition. RDB is a snapshot. AOF is a write log.\n\nHow it works. RDB is smaller and slower to be current. AOF is more durable and larger.\n\nOperational risk. Believing AOF means zero data loss under every crash."
    },
    {
      "id": 18,
      "level": "intermediate",
      "q": "How does a replica help?",
      "a": "Definition. Reads can go to a replica. Failover can promote a replica.\n\nHow it works. The primary takes writes. Replicas copy the stream.\n\nOperational risk. Reading a session from a lagging replica right after login."
    },
    {
      "id": 19,
      "level": "beginner",
      "q": "What ports and URL does Redis use?",
      "a": "Definition. Default port is 6379. Apps use a URL like redis://localhost:6379.\n\nHow it works. Managed Redis (ElastiCache, Upstash, Redis Cloud) gives you a host and a password.\n\nOperational risk. An open 6379 on the public internet."
    },
    {
      "id": 20,
      "level": "intermediate",
      "q": "How do you cache a list page?",
      "a": "Definition. Key the list by the query: feed:user:1:page:1.\n\nHow it works. Short TTL. Invalidate on new post if you need the first page fresh.\n\nOperational risk. One global feed key for every user."
    },
    {
      "id": 21,
      "level": "advanced",
      "q": "What is Redis Cluster?",
      "a": "Definition. Cluster splits keys across nodes using 16384 hash slots.\n\nHow it works. A key hashes to a slot; that slot lives on one primary.\n\nOperational risk. Multi-key commands that span slots fail unless keys share a hash tag {user}."
    },
    {
      "id": 22,
      "level": "beginner",
      "q": "How do you talk to Redis from Node?",
      "a": "Definition. Use a client such as ioredis or node-redis. connect, then get/set.\n\nHow it works. One shared client per process, not a new connection per request.\n\nOperational risk. Opening a connection inside every handler."
    },
    {
      "id": 23,
      "level": "intermediate",
      "q": "What is a pipeline?",
      "a": "Definition. A pipeline sends many commands in one round trip.\n\nHow it works. Queue GET a, GET b, GET c, then exec.\n\nOperational risk. Huge pipelines that block the client if Redis is slow."
    },
    {
      "id": 24,
      "level": "beginner",
      "q": "What should you monitor?",
      "a": "Definition. Memory used, hit ratio, evicted keys, connected clients, and latency.\n\nHow it works. Alert when memory is near maxmemory or hit ratio collapses.\n\nOperational risk. Discovering a full Redis only after the site is slow."
    },
    {
      "id": 25,
      "level": "intermediate",
      "q": "How do you store a shopping cart?",
      "a": "Definition. A hash cart:user:1 with field = product id and value = quantity, plus a TTL.\n\nHow it works. HINCRBY for +1. Persist to SQL when the user checks out.\n\nOperational risk. Cart only in Redis with no TTL and no checkout write."
    },
    {
      "id": 26,
      "level": "advanced",
      "q": "How do you do distributed locks?",
      "a": "Definition. SET lock:job NX EX 30 is a simple lock. Redlock is a stricter multi-node recipe.\n\nHow it works. Only one worker runs the job. Always set NX and a TTL.\n\nOperational risk. A lock without TTL if the holder dies."
    },
    {
      "id": 27,
      "level": "beginner",
      "q": "What is persist versus cache?",
      "a": "Definition. Persist means the data must survive a restart. Cache means it is a speed copy.\n\nHow it works. Sessions can live in Redis if you accept logout on flush, or you persist sessions in SQL.\n\nOperational risk. Calling a cache 'the database' in an interview."
    },
    {
      "id": 28,
      "level": "intermediate",
      "q": "How do you expire stories like Snapchat?",
      "a": "Definition. Store expires_at in the database. Optionally also SET a Redis key with TTL for the hot path.\n\nHow it works. Reads hide expired rows. A sweeper deletes bytes later.\n\nOperational risk. Only a Redis TTL — the durable copy remains."
    },
    {
      "id": 29,
      "level": "beginner",
      "q": "Why not cache HTML for a logged-in page under one key?",
      "a": "Definition. That HTML contains one user's data.\n\nHow it works. Cache keys must include user id, or cache only public fragments.\n\nOperational risk. Serving Ada's inbox to every visitor."
    },
    {
      "id": 30,
      "level": "advanced",
      "q": "How do you keep Redis highly available?",
      "a": "Definition. Use replication plus automatic failover (Sentinel or a managed offering) and Multi-AZ.\n\nHow it works. Clients reconnect to the new primary after failover.\n\nOperational risk. A single-node Redis on one VM as the only session store for a bank-like app."
    }
  ]
};
