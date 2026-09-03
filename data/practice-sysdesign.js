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
      "a": "The problem before\nA kirana shop printed full catalogue links on tiny slips. Customers mistyped checkout URLs and never arrived. Two clerks issued the same four-letter code. Guessed codes opened private invoices. The shop needed a short HTTPS door that was not a free-for-all for bots.\nWhat this is\nA URL shortener maps a short id to a long URL. Create, usually behind login or an API key, writes id to url in SQL and returns https://s.example/id. Public GET /:id reads Redis first, then SQL, then issues 302. Unique ids are random bytes plus retry on collision, or a counter. Nginx or CloudFront terminates TLS so the browser only sees HTTPS.\nWhat it solves\nFlyers, SMS, and warehouse QR stickers get a short door. Writes stay authenticated. Reads stay public and cached so every click is not a disk hit. A rate limit stops bots filling the table. An idempotency key stops a retry minting two links. Owner delete is a WHERE on user_id, not a public wipe.\nReal-life example\nThe shop prints https://s.example/a1b2 on a festival flyer. A customer taps it: TLS at the edge, Redis miss, SQL hit, 302 to the catalogue. A clerk retries create with the same idempotency key and gets the same short URL, not a twin. An unknown id returns 404, not a silent hop to home. Logs show the short id only.\nUses\nInterview opener: list requirements, draw client to TLS to app to Redis to SQL, then unique ids, cache-aside, owner delete, and HTTPS. Same shape for invite codes, receipt short links, and warehouse box labels.\nWatch out\nDo not redirect unknown ids to home. Do not log a long URL that holds tokens. Public GET is fine; POST needs auth. After you change the destination, delete the cache key. Four random bytes can collide: catch the unique error and retry. Always return https://, never http://.",
      "code": "const id = crypto.randomBytes(4).toString(\"hex\");\nawait db.query(\"INSERT INTO links(id, url, user_id) VALUES ($1,$2,$3)\", [id, url, req.user.id]);\nres.json({ short: \"https://s.example/\" + id });",
      "ask": "Most asked · Amazon · Google · Meta · Microsoft"
    },
    {
      "id": 20,
      "level": "advanced",
      "q": "Design a rate limiter.",
      "a": "The problem before\nThe shop till sat on the open street. A script hammered create-link a thousand times a minute and filled the table with junk. Real customers waited. The bank login page had the same pain: password guesses arrived faster than a human could type. Without a cap, one IP could starve everyone else.\nWhat this is\nA rate limiter counts actions in a window and rejects extras. The interview version is a fixed window in Redis: INCR a key like rl:ip, EXPIRE it on the first hit, and return 429 when the count crosses the cap. A token bucket is smoother: tokens refill so a short burst is allowed. You key by IP, by user id, or both.\nWhat it solves\nYou protect expensive writes — create, login, OTP — without rewriting the handler. Middleware runs before SQL. Honest users barely notice. Attackers get 429 and a Retry-After header so well-behaved clients wait. You can raise the cap for logged-in clerks and keep strangers tighter.\nReal-life example\nA warehouse gate lets thirty trucks per minute through one lane. The thirty-first waits. Redis is the clicker: the first truck starts the sixty-second clock, extras see a red light. A bank ATM does the same for PIN tries. The API returns 429 with Retry-After 60, not a blank 500.\nUses\nPut the limiter on create, login, and password reset. Say what you would measure: 429 rate, false positives on shared cafe IPs, Redis latency. Compare fixed window, which is easy but bursts at the boundary, versus token bucket, which is smoother.\nWatch out\nA shared cafe Wi-Fi makes many customers look like one IP; user id is fairer after login. Forgetting EXPIRE leaves the counter forever and locks someone out. Do not count only in one app box if you have three — use Redis so they share. Never hide the retry hint.",
      "code": "const n = await redis.incr(\"rl:\" + ip);\nif (n === 1) await redis.expire(\"rl:\" + ip, 60);\nif (n > 30) return res.status(429).json({ error: \"slow down\" });",
      "ask": "Most asked · Amazon · Google · Uber · Stripe"
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "Explain CAP in a design interview.",
      "a": "The problem before\nTwo bank ledgers sat in two cities. The phone line died. Each clerk still had customers at the window. If both accepted deposits, the books would disagree. If both froze, the queue would shout. The interview asks which pain you choose when the replica cannot talk to the primary.\nWhat this is\nCAP says that during a network partition you cannot have both perfect consistency — every reader sees the latest write — and perfect availability — every node still answers. You still want partition tolerance because networks fail. The design choice is C versus A while the split lasts. After it heals, you reconcile.\nWhat it solves\nIt forces you to name the product. A payment or inventory decrement leans C: wait for the primary COMMIT, or fail. A like counter or shopping-cart cache can lean A: accept the write, heal later, live with a stale read for a second. Then you draw where the cache sits so CAP is not a slogan.\nReal-life example\nA warehouse has two stock books. If the radio dies, the bank-style shop blocks the sale until both books agree — that is C. A kirana like-button on the festival photo keeps accepting taps and syncs tonight — that is A. Checkout waits for primary COMMIT. The like goes to Redis INCR and SQL later.\nUses\nSay this after you draw two boxes and a broken line. Use it to justify a locked payment path versus an eventually consistent cache. Contrast payments, inventory, and social counts. Mention lagging replicas as a softer everyday form of the same trade-off.\nWatch out\nCAP is about a split, not a normal Tuesday. It is not a reason to skip backups. It does not mean NoSQL has no consistency. Do not claim you have all three during a partition. Name the object: balance versus like, not the whole company.",
      "code": "// checkout — wait for primary COMMIT\n// like counter — Redis INCR, SQL later",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "How do you invalidate a cache?",
      "a": "The problem before\nThe shop taped yesterday's price on the glass because the back-room ledger was slow to open. A clerk changed the price in the ledger and forgot the tape. Customers paid the old number until someone tore it down. That is stale cache. Private customer lists on a public tape made it worse.\nWhat this is\nCache invalidation is how you stop serving a dead copy. The usual pattern is cache-aside: read Redis, on miss load SQL and SET with a TTL. On write, update SQL first, then DEL the key. TTL is the safety net if a DEL is forgotten. The key must name the object, not a private list under a public name.\nWhat it solves\nHot reads stay fast without lying after an edit. The database remains the truth. A short TTL still saves you if one path forgets to delete. You keep private todos off a public CDN key so one customer cannot read another's list.\nReal-life example\nAda updates a todo text. SQL writes the new sentence. Redis deletes todo:42. The next GET misses and reloads. If you only SET and never DEL, the warehouse label still says rice until the sixty-second stamp fades. A bank balance cache that skips DEL after a deposit is how customers see old rupees.\nUses\nAny GET you cached: short URLs, product pages, profiles. Pair UPDATE or DELETE with DEL. Mention TTL as backup, not as the only strategy. Talk key prefixes such as prod:todo:1, and never cache an authorized list under an anonymous key.\nWatch out\nDEL before COMMIT can refill Redis with the old row if another reader sneaks in. Caching a private list as a public key is a leak. A long TTL without DEL is a stale-price bug. Do not cache 404 forever if the id may be created a second later unless you mean to.",
      "code": "await db.query(\"UPDATE todos SET text = $1 WHERE id = $2\", [text, id]);\nawait redis.del(\"todo:\" + id);",
      "ask": "Most asked · Amazon · Meta · Google"
    },
    {
      "id": 23,
      "level": "beginner",
      "q": "What does a load balancer do?",
      "a": "The problem before\nThe shop had one door and one cashier. When that cashier fell ill, the street queue died. When the festival crowd arrived, one till could not take the heat. Customers also asked to stick to the same cashier because their paper slip sat in that one drawer.\nWhat this is\nA load balancer is one public HTTPS door in front of many app boxes. It terminates TLS or passes it through, picks a healthy instance, and forwards the request. Health checks drop a box that fails GET /health. Algorithms are round-robin, least connections, or sticky cookies if you insist.\nWhat it solves\nYou scale by adding boxes, not by making one box magical. A dead box is removed instead of 500ing the street. You keep a single DNS name. HTTPS lives at the door so app boxes can speak HTTP on the private LAN. Sessions should live in Redis or in a JWT so any box can serve the next click.\nReal-life example\nA bank branch has one street door and three counters. A greeter sends you to a free counter. If counter two is closed, nobody is sent there. The warehouse dock does the same with three loading bays. The app exposes GET /health so the greeter knows who is open.\nUses\nDraw client to TLS to load balancer to app1, app2, app3 in every design. Use it with Auto Scaling, Kubernetes Services, and ALBs. Prefer stateless apps. Mention connection draining when you take a box out of the pool.\nWatch out\nSession stickiness is a smell: one sticky box becomes a hotspot and failover logs people out. Health checks that hit a heavy SQL path can flap. An undersized balancer is still a single point of failure — use two zones. Do not expose app ports to the world.",
      "code": "// client → TLS → LB → app1 / app2 / app3\napp.get(\"/health\", (req, res) => res.json({ ok: true }));",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 24,
      "level": "beginner",
      "q": "What is a CDN?",
      "a": "The problem before\nEvery customer in another city downloaded the shop's festival banner from one origin till. That till sat in one warehouse. Pages felt slow, the egress bill climbed, and a traffic spike knocked the origin over. Private order JSON accidentally sat next to the public photo.\nWhat this is\nA CDN is a set of edge caches close to users. Static files — JS bundles, images, fonts — are copied to those edges. The origin is your S3 bucket or Nginx. CloudFront or similar speaks HTTPS with your domain. HTML can be cached if it is public. Cache-Control tells the edge what is public and what is private.\nWhat it solves\nUsers get bytes from a nearby city. The origin sees fewer hits. Egress is cheaper. You hide the bucket behind HTTPS and a custom domain. A launch-day crowd hits the edge, not your one API box. You still send /api/todos as private so the CDN is not a public dump of carts.\nReal-life example\nThe shop's banner lives in a warehouse in one city. The CDN is a set of neighborhood lockers: Mumbai customers open the locker next door. The price list HTML can sit in the locker if everyone may see it. Ada's bank statement JSON must not have a public locker key.\nUses\nStatic SPAs, image-heavy catalogues, public marketing pages. Pair Cache-Control public on the JS bundle with private on API JSON. Use a CDN in front of S3. Mention purge or versioned filenames when you ship a new bundle.\nWatch out\nDo not put private todo JSON on a public CDN key. A long cache on index.html can pin an old app after deploy — hash the filenames. HTTPS at the edge does not encrypt an object that should never have been public. Purge is not instant everywhere.",
      "code": "// CloudFront → S3 / origin\n// Cache-Control: public for the JS bundle, private for /api/todos",
      "ask": "Most asked · Amazon · Netflix · Google"
    },
    {
      "id": 25,
      "level": "advanced",
      "q": "How do you generate unique IDs at scale?",
      "a": "The problem before\nThe warehouse needed a unique sticker for every box. Two clerks writing numbers by hand issued 100 twice. A giant auto-increment lived in one book, so every new box waited on that book. Random stickers were unique but scattered the shelf order, so filing a new box meant walking the whole aisle.\nWhat this is\nUnique IDs name rows without collision. UUID or random bytes are easy and need no central counter. A database sequence or bigserial is simple and ordered. Snowflake-style ids mix a timestamp, a worker id, and a per-worker sequence — that is what large feeds use. Interviews want the trade-off, not a brand name.\nWhat it solves\nYou create rows on many machines without a single lock. You keep indexes healthier if you care about insert locality. You can sort roughly by time with Snowflake. You can hide how many orders you have if you do not want a public incrementing number. Shorteners often use random bytes plus retry.\nReal-life example\nA bank slip numbered 1, 2, 3 tells the street how many accounts you opened. A UUID slip looks like noise and files all over the cabinet, which can hurt a B-tree. A Snowflake slip encodes time plus which clerk window printed it, so two cities never collide and the cabinet still roughly follows the clock.\nUses\nURL shortener ids, tweet or post ids, order numbers, distributed writes. Compare UUID v4, ULID, bigserial, and Snowflake. Mention retry on unique violation for random short ids. Say who allocates: the database, the app, or an id service.\nWatch out\nUUID as a primary key can randomize inserts and bloat indexes — still fine at homework scale. A global sequence is a hotspot if you pretend it works across shards. Do not expose raw incrementing ids if they leak other users' objects. Worker clocks that go backwards can collide if you are sloppy.",
      "code": "const id = crypto.randomUUID();  // easy\n// or: bigserial in Postgres\n// or: time + worker + counter",
      "ask": "Most asked · Twitter · Meta · Amazon"
    },
    {
      "id": 26,
      "level": "intermediate",
      "q": "How do you scale reads?",
      "a": "The problem before\nThe shop's one ledger was correct, but every customer asked to read yesterday's price. The clerk could not write new sales because the queue was all reads. Someone said we need Kubernetes. The real bottleneck was one hot SELECT, not the number of containers.\nWhat this is\nScaling reads means adding capacity for GET-heavy work before you split writes. A SQL read replica takes SELECT traffic. Redis holds hot keys. A CDN holds static files. Sharding — slicing data across boxes — comes last because it changes how you query. Name the bottleneck first.\nWhat it solves\nThe primary keeps writes. Replicas and caches absorb the festival crowd looking at the catalogue. A short-link click hits Redis, then SQL only on a miss. You delay the pain of cross-shard joins. You can add replica boxes in another zone for survival as well as speed.\nReal-life example\nA warehouse has one receiving desk for writes and three viewing windows as replicas. Hot SKUs have a sticky note on the glass — Redis. The banner photo sits in neighborhood lockers — a CDN. Only when the building cannot hold the boxes do you split aisles A to M and N to Z — shards.\nUses\nURL shortener redirects, product pages, feeds. Draw cache-aside: GET Redis, miss SQL, SET with a TTL. Mention replica lag: a read-your-write may need the primary. Measure the hot query with EXPLAIN before you buy a cluster.\nWatch out\nReading a just-written row from a lagging replica looks like data loss. Sharding too early is a year of regret. Caching a private list under a public key leaks. Kubernetes does not fix a missing index. One hot key can still melt one Redis slot.",
      "code": "const hit = await redis.get(\"u:\" + id);\nif (hit) return res.redirect(302, hit);\nconst { rows } = await db.query(\"SELECT url FROM links WHERE id = $1\", [id]);",
      "ask": "Most asked · Amazon · Google · Meta"
    },
    {
      "id": 27,
      "level": "intermediate",
      "q": "Why a message queue?",
      "a": "The problem before\nThe shop API tried to send a welcome email while the customer still stood at the till. SMTP took ten seconds. The browser spun. If the mail server blinked, the whole signup failed even though the account already existed. A second click created two accounts and two emails.\nWhat this is\nA message queue is a durable inbox between the API and a worker. The API writes the user, enqueues welcome_email, and returns 201. A worker pops the message, talks to SMTP, and retries on failure. A dead-letter queue holds messages that fail too many times. The user does not wait for the slow thing.\nWhat it solves\nThe request stays short. Spikes of signups become a pile of messages, not a pile of stuck HTTP connections. If the worker dies, the message waits. You can add workers without changing the API. Thumbnails, webhooks, and warehouse invoice PDFs use the same shape.\nReal-life example\nA bank opens the account now and drops a slip in the back-office tray: print the welcome letter. The customer walks out. Tonight a clerk processes the tray. If the printer jams, the slip stays. A dead-letter box is the pile the manager reviews in the morning.\nUses\nEmail, image resize, search index updates, outbound webhooks, report generation. Pair with idempotency so a retry does not send two letters. Mention visibility timeouts and at-least-once delivery. Draw API to queue to worker to SMTP.\nWatch out\nAt-least-once means your handler must be idempotent. A queue is not a database of record. Dropping the only copy of an order into a queue with no SQL row is how money vanishes. Do not do ten-second work inside the request and then also enqueue it, or you double-send.",
      "code": "await queue.send({ type: \"welcome_email\", userId });\nres.status(201).json(user);  // user does not wait for SMTP",
      "ask": "Most asked · Amazon · Uber · Microsoft"
    },
    {
      "id": 28,
      "level": "beginner",
      "q": "Walk a request: short link click.",
      "a": "The problem before\nInterviewers ask you to walk one click. Candidates jump to Kubernetes. The real skill is naming each hop a short-link click takes, what can fail, and what you log. Without that story the design is boxes with no path.\nWhat this is\nA request walk is the path of one GET. Browser HTTPS to TLS at Nginx or CloudFront, then the app GET /abc, then Redis for the cached long URL, then SQL on a miss, then 302 to the destination. You say what is public, what is cached, and what you refuse to put in logs.\nWhat it solves\nYou prove you can operate the design, not only name products. You find where to put rate limits — usually on create, not on a popular public GET. You find where auth sits: create, not redirect. You pick a log line that helps debug without leaking secrets in the long URL query string.\nReal-life example\nA customer taps the flyer code. The street door is HTTPS. The greeter at the edge unwraps TLS. The clerk looks at the sticky note — Redis. If the note is missing, they open the ledger — SQL — and write a new note. Then they point the customer down the aisle with 302. The logbook writes a1b2, not the bank-reset token hiding in the long URL.\nUses\nOpen every design interview with this walk. Use it for login, checkout, and feed fetch. Number the steps: TLS, GET, Redis, SQL, 302. Mention 404 if the id is unknown, and 301 versus 302 if they ask.\nWatch out\nDo not log cookies or the secret URL. Do not skip TLS because the app is on port 3000 behind Nginx. A cache hit must still 302 to the current destination after an update, so invalidation matters. Walking only the happy path is incomplete — name 404 and Redis down, then fall back to SQL.",
      "code": "// 1 TLS  2 GET /id  3 Redis  4 SQL  5 302\nconsole.log(\"hit\", id);",
      "ask": "Most asked · Amazon · Google · Microsoft"
    }
  ]
};
