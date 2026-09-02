window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["practice-sysdesign"] = {
  "kind": "practice",
  "notes": [
    {
      "title": "Most asked",
      "body": "After the hands-on labs, open questions tagged Most asked. Those are the interview questions Amazon, Google, Meta, and Microsoft repeat. Same easy comments on the right of the code."
    },
    {
      "title": "How to use this lab",
      "body": "Tiny code that matches the drawings: shortener, rate limit, feed, HTTPS at the edge."
    },
    {
      "title": "Auth",
      "body": "Even a shortener has an API key for create. Public GET of /abc is fine."
    },
    {
      "title": "HTTPS",
      "body": "The browser only sees https://short.example/abc."
    }
  ],
  "examples": [
    {
      "title": "URL shortener create",
      "lang": "js",
      "desc": "Hash, store, return short.",
      "code": "async function createLink(req, res) {\n  const id = crypto.randomBytes(4).toString(\"hex\");  // short id\n  await db.query(\n    \"INSERT INTO links(id, url, user_id) VALUES ($1,$2,$3)\",\n    [id, req.body.url, req.user.id]\n  );\n  res.json({ short: \"https://s.example/\" + id });  // HTTPS link\n}"
    },
    {
      "title": "Redirect",
      "lang": "js",
      "desc": "302 from id.",
      "code": "async function redirect(req, res) {\n  const { rows } = await db.query(\"SELECT url FROM links WHERE id = $1\", [req.params.id]);\n  if (!rows[0]) return res.status(404).end();  // unknown id\n  res.redirect(302, rows[0].url);\n}"
    },
    {
      "title": "Rate limit",
      "lang": "js",
      "desc": "Redis INCR.",
      "code": "async function limit(ip, res) {\n  const n = await redis.incr(\"rl:\" + ip);\n  if (n === 1) await redis.expire(\"rl:\" + ip, 60);\n  if (n > 30) return res.status(429).json({ error: \"slow down\" });\n}"
    },
    {
      "title": "Feed fan-out on write",
      "lang": "js",
      "desc": "Push post id to each follower list.",
      "code": "for (const f of followers) {\n  await redis.lpush(\"feed:\" + f, postId);\n}"
    },
    {
      "title": "Cache a GET",
      "lang": "js",
      "desc": "Cache-aside the long URL.",
      "code": "const hit = await redis.get(\"u:\" + id);\nif (hit) return res.redirect(302, hit);"
    },
    {
      "title": "HTTPS edge",
      "lang": "txt",
      "desc": "TLS at Nginx, then app.",
      "code": "listen 443 ssl; proxy_pass http://127.0.0.1:3000;"
    },
    {
      "title": "Idempotent create",
      "lang": "js",
      "desc": "Retry does not make two links.",
      "code": "const key = req.headers[\"idempotency-key\"];\nconst cached = await redis.get(\"idemp:\" + key);\nif (cached) return res.json(JSON.parse(cached));"
    },
    {
      "title": "Authz: only owner deletes",
      "lang": "js",
      "desc": "DELETE checks user_id.",
      "code": "DELETE FROM links WHERE id = $1 AND user_id = $2"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "Practice: create a short link",
      "a": "Need a logged-in user. Save id → url.",
      "code": "await db.query(\"INSERT INTO links(id, url, user_id) VALUES ($1,$2,$3)\", [id, url, req.user.id]);"
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "Practice: redirect",
      "a": "GET /:id → 302.",
      "code": "res.redirect(302, rows[0].url);"
    },
    {
      "id": 3,
      "level": "intermediate",
      "q": "Practice: rate limit creates",
      "a": "30 / minute / ip.",
      "code": "if (n > 30) return res.status(429).end();"
    },
    {
      "id": 4,
      "level": "intermediate",
      "q": "Practice: cache the target",
      "a": "SET EX the url after SQL.",
      "code": "await redis.set(\"u:\" + id, url, \"EX\", 3600);"
    },
    {
      "id": 5,
      "level": "intermediate",
      "q": "Practice: owner delete",
      "a": "403 if not owner.",
      "code": "if (row.user_id !== req.user.id) return res.status(403).end();"
    },
    {
      "id": 6,
      "level": "beginner",
      "q": "Practice: public read vs auth create",
      "a": "GET is public. POST needs auth.",
      "code": "app.post(\"/links\", auth, create);\napp.get(\"/:id\", redirect);"
    },
    {
      "id": 7,
      "level": "advanced",
      "q": "Practice: feed fan-out",
      "a": "On post, LPUSH to each follower.",
      "code": "await redis.lpush(\"feed:\" + followerId, postId);"
    },
    {
      "id": 8,
      "level": "intermediate",
      "q": "Practice: idempotency key",
      "a": "Replay returns the same short url.",
      "code": "if (cached) return res.json(JSON.parse(cached));"
    },
    {
      "id": 9,
      "level": "beginner",
      "q": "Practice: HTTPS short URL",
      "a": "Return https:// not http://.",
      "code": "res.json({ short: \"https://s.example/\" + id });"
    },
    {
      "id": 10,
      "level": "advanced",
      "q": "Practice: 429 body",
      "a": "Tell the client when to retry.",
      "code": "res.set(\"Retry-After\", \"60\").status(429).json({ error: \"slow down\" });"
    },
    {
      "id": 11,
      "level": "intermediate",
      "q": "Practice: unique short id retry",
      "a": "On unique violation, make a new id.",
      "code": "try { await insert(id); } catch (e) { if (e.code === \"23505\") return insert(newId()); }"
    },
    {
      "id": 12,
      "level": "beginner",
      "q": "Practice: 404 unknown id",
      "a": "Do not redirect to home silently.",
      "code": "if (!rows[0]) return res.status(404).json({ error: \"unknown\" });"
    },
    {
      "id": 13,
      "level": "intermediate",
      "q": "Practice: authn vs authz here",
      "a": "API key = who. Owner check = may delete.",
      "code": "auth, then row.user_id === req.user.id"
    },
    {
      "id": 14,
      "level": "advanced",
      "q": "Practice: edge TLS + app HTTP",
      "a": "Nginx 443, app 3000.",
      "code": "proxy_pass http://127.0.0.1:3000;"
    },
    {
      "id": 15,
      "level": "beginner",
      "q": "Practice: log without the secret URL",
      "a": "Log the short id.",
      "code": "console.log(\"hit\", id);"
    },
    {
      "id": 16,
      "level": "intermediate",
      "q": "Practice: list my links",
      "a": "WHERE user_id.",
      "code": "SELECT id, url FROM links WHERE user_id = $1;"
    },
    {
      "id": 17,
      "level": "beginner",
      "q": "Practice: update destination",
      "a": "UPDATE url. Invalidate cache.",
      "code": "await redis.del(\"u:\" + id);"
    },
    {
      "id": 18,
      "level": "advanced",
      "q": "Practice: draw then code",
      "a": "Say client → TLS → app → Redis → SQL, then paste the handler.",
      "code": "// 1 TLS  2 auth  3 rate  4 sql  5 cache"
    },
    {
      "id": 19,
      "level": "advanced",
      "q": "Design a URL shortener.",
      "a": "Requirements: create a short HTTPS link, redirect, optional auth on create, analytics later. API writes id→url in SQL. GET /:id reads (cache in Redis) and 302s. Unique id: random bytes + retry, or a counter. Rate-limit creates. Nginx does TLS.",
      "code": "const id = crypto.randomBytes(4).toString(\"hex\");\nawait db.query(\"INSERT INTO links(id, url, user_id) VALUES ($1,$2,$3)\", [id, url, req.user.id]);\nres.json({ short: \"https://s.example/\" + id });",
      "ask": "Most asked · Amazon · Google · Meta · Microsoft"
    },
    {
      "id": 20,
      "level": "advanced",
      "q": "Design a rate limiter.",
      "a": "Fixed window: INCR + EXPIRE in Redis, 429 over the cap. Token bucket is smoother. Key by IP or by user id. Put it in middleware before the expensive handler. Say what you would measure.",
      "code": "const n = await redis.incr(\"rl:\" + ip);\nif (n === 1) await redis.expire(\"rl:\" + ip, 60);\nif (n > 30) return res.status(429).json({ error: \"slow down\" });",
      "ask": "Most asked · Amazon · Google · Uber · Stripe"
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "Explain CAP in a design interview.",
      "a": "Name the split. If the replica cannot talk to the primary, do you block writes (C) or accept them and heal later (A)? Payments lean C. Social likes can lean A. Then draw where the cache sits.",
      "code": "// checkout — wait for primary COMMIT\n// like counter — Redis INCR, SQL later",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "How do you invalidate a cache?",
      "a": "On write: update SQL, then DEL the key (cache-aside). TTL is a safety net if you forget a DEL. Do not cache private lists under a public key.",
      "code": "await db.query(\"UPDATE todos SET text = $1 WHERE id = $2\", [text, id]);\nawait redis.del(\"todo:\" + id);",
      "ask": "Most asked · Amazon · Meta · Google"
    },
    {
      "id": 23,
      "level": "beginner",
      "q": "What does a load balancer do?",
      "a": "One public HTTPS door, many app boxes behind it. Health checks drop bad boxes. Session stickiness is a smell — prefer JWT or shared Redis sessions.",
      "code": "// client → TLS → LB → app1 / app2 / app3\napp.get(\"/health\", (req, res) => res.json({ ok: true }));",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 24,
      "level": "beginner",
      "q": "What is a CDN?",
      "a": "Edge caches for static files (JS, images) close to the user. The origin is your S3 or Nginx. HTML can be cached if it is public. Private todo JSON should not be on a public CDN key.",
      "code": "// CloudFront → S3 / origin\n// Cache-Control: public for the JS bundle, private for /api/todos",
      "ask": "Most asked · Amazon · Netflix · Google"
    },
    {
      "id": 25,
      "level": "advanced",
      "q": "How do you generate unique IDs at scale?",
      "a": "UUID is easy and scattered (hurts B-tree inserts). A DB sequence is simple and ordered. Snowflake-style (time + worker + seq) is what big feeds use. Interviews want the trade-off, not a brand.",
      "code": "const id = crypto.randomUUID();  // easy\n// or: bigserial in Postgres\n// or: time + worker + counter",
      "ask": "Most asked · Twitter · Meta · Amazon"
    },
    {
      "id": 26,
      "level": "intermediate",
      "q": "How do you scale reads?",
      "a": "Add a read replica. Cache hot keys in Redis. Add a CDN for static. Only then shard. Name the bottleneck first — usually one hot query, not 'we need Kubernetes'.",
      "code": "const hit = await redis.get(\"u:\" + id);\nif (hit) return res.redirect(302, hit);\nconst { rows } = await db.query(\"SELECT url FROM links WHERE id = $1\", [id]);",
      "ask": "Most asked · Amazon · Google · Meta"
    },
    {
      "id": 27,
      "level": "intermediate",
      "q": "Why a message queue?",
      "a": "The API answers fast, a worker does the slow thing (email, thumbnail). If the worker dies, the message waits. Retry with a dead-letter queue. Do not do 10-second work inside the request.",
      "code": "await queue.send({ type: \"welcome_email\", userId });\nres.status(201).json(user);  // user does not wait for SMTP",
      "ask": "Most asked · Amazon · Uber · Microsoft"
    },
    {
      "id": 28,
      "level": "beginner",
      "q": "Walk a request: short link click.",
      "a": "Browser HTTPS → TLS at Nginx/CloudFront → app GET /abc → Redis cache → (miss) SQL → 302 to the long URL. Say what you log (short id, not the token query string).",
      "code": "// 1 TLS  2 GET /id  3 Redis  4 SQL  5 302\nconsole.log(\"hit\", id);",
      "ask": "Most asked · Amazon · Google · Microsoft"
    }
  ]
};
