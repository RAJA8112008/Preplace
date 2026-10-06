const fs = require("fs");
const path = require("path");

const dump = (id, data) => {
  const out = `window.PREP_DATA = window.PREP_DATA || {};\nwindow.PREP_DATA[${JSON.stringify(id)}] = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(path.join(__dirname, "..", "frontend", "data", `${id}.js`), out);
};

const Q = (id, level, q, a, extra = {}) => ({ id, level, q, a, ...extra });

dump("redis", {
  kind: "design",
  notes: [
    {
      title: "What Redis is",
      layers: [[{ label: "App", tone: "stateless" }], [{ label: "Redis (memory)", tone: "store" }, { label: "Postgres / Mongo", tone: "store" }]],
      flow: ["Request", "App", "Redis GET", "Hit return / miss load DB"],
      body: "Redis is an in-memory store. It keeps data in RAM, so reads and writes are very fast — often under one millisecond. People use it as a cache, a session store, a rate-limit counter, a queue, and a pub/sub bus. It is not a replacement for your main database. If Redis restarts without persistence, cache data can disappear. That is acceptable for a cache and dangerous for the only copy of an order."
    },
    {
      title: "Why apps add Redis",
      flow: ["Hot read", "Skip disk DB", "Lower latency", "Lower DB load"],
      body: "A database is correct and durable. It is also slower and more expensive under a flood of the same read. Redis sits in front for keys that many users ask for: a profile, a product page, a session. You still write the truth to Postgres or Mongo. Redis holds a short-lived copy. If the copy is missing, the app loads the database and fills Redis again."
    },
    {
      title: "Strings, hashes, lists, sets, zsets",
      body: "A string is one value at one key: session:ada → token. A hash is many fields under one key: user:1 name Ada, age 21. A list is a queue (LPUSH / RPOP). A set is unique members (SADD). A sorted set (ZSET) is unique members with a score — leaderboards and sliding-window rate limits. Pick the type that matches the access pattern. Do not store a giant JSON blob in a string if you only need one field."
    },
    {
      title: "TTL and eviction",
      flow: ["SET key", "EXPIRE 120s", "Key vanishes", "Next read misses"],
      body: "TTL (time to live) is how long a key may stay. SET user:1 ... EX 120 deletes the key after two minutes. When memory is full, Redis evicts keys by a policy such as allkeys-lru (least recently used). Always set a TTL on cache keys. A key without a TTL can live forever and fill RAM."
    },
    {
      title: "Cache-aside (the usual pattern)",
      flow: ["GET cache", "Hit → return", "Miss → DB", "SET cache + TTL"],
      body: "The application owns the cache. Read Redis first. On a hit, return. On a miss, read the database, then SET the cache with a TTL. When you update the database, delete or overwrite that key so users do not see a stale price or a revoked permission. This is the pattern to draw in interviews."
    },
    {
      title: "Sessions and rate limits",
      body: "Store a session as session:<id> → user json with a TTL that matches 'stay logged in'. For rate limits, INCR a key like rl:user:42 and EXPIRE it on the first increment. If the count is above N, return HTTP 429. Redis is shared, so two API servers see the same counter. An in-memory Map on one server does not."
    },
    {
      title: "Pub/sub and streams",
      body: "PUBLISH / SUBSCRIBE sends a message to current listeners. If nobody is listening, the message is gone. Redis Streams keep a log you can read later and acknowledge — closer to a small queue. Use pub/sub for live presence. Use Streams or a real queue (SQS, Kafka) when you must not lose work."
    },
    {
      title: "Persistence (RDB and AOF)",
      body: "RDB snapshots the dataset to disk on a schedule. AOF appends every write. You can enable both. Persistence does not make Redis a full database: restores are slower, and a crash can still lose the last second of writes. For checkout truth, keep Postgres as the source of record."
    },
    {
      title: "Replication and Cluster",
      layers: [[{ label: "App" }], [{ label: "Primary", tone: "store" }, { label: "Replica", tone: "store" }]],
      body: "A replica copies the primary for reads and failover. Redis Cluster shards keys across nodes using hash slots. You need Cluster (or a sharded proxy) when one machine's RAM is not enough. A replica that lags can serve a stale session. Failover is an operational plan, not a checkbox."
    },
    {
      title: "What not to put in Redis",
      body: "Do not store the only copy of money, orders, or legal documents. Do not store huge files. Do not use KEYS * in production (it blocks the server); use SCAN. Do not share one Redis without prefixes between prod and test. Do not put secrets in keys that every service can READ."
    }
  ],
  examples: [
    {
      title: "Cache a user profile",
      lang: "js",
      flow: ["GET /users/1", "Redis GET user:1", "miss", "SQL", "SET EX 120"],
      desc: "Definition. The API checks Redis before Postgres.\n\nHow it works. A hit returns JSON immediately. A miss loads the row, stores it for 120 seconds, then returns.\n\nOperational risk. Updating the user name in SQL without DEL user:1 shows the old name until TTL ends.",
      code: "async function getUser(id) {\n  const key = \"user:\" + id;\n  const hit = await redis.get(key);\n  if (hit) return JSON.parse(hit);\n  const row = await db.users.find(id);\n  if (!row) return null;\n  await redis.set(key, JSON.stringify(row), \"EX\", 120);\n  return row;\n}"
    },
    {
      title: "Invalidate after an update",
      lang: "js",
      flow: ["PATCH user", "UPDATE sql", "DEL user:1"],
      desc: "Definition. A write must change the source of truth and drop the stale cache key.\n\nHow it works. Update Postgres first. Then DEL the key so the next read refills from SQL.\n\nOperational risk. Deleting before the commit can refill Redis with the old row.",
      code: "async function updateUser(id, patch) {\n  await db.users.update(id, patch);\n  await redis.del(\"user:\" + id);\n}"
    },
    {
      title: "Session with TTL",
      lang: "js",
      desc: "Definition. A session is a random id that points at the logged-in user.\n\nHow it works. After login, SET session:<token> to the user id with EX 86400 (one day). Each request GETs that key. Logout DELs it. Sliding sessions can EXPIRE again on activity.\n\nOperational risk. A token without TTL lives until Redis evicts it.",
      code: "await redis.set(\"session:\" + token, userId, \"EX\", 86400);\nconst userId = await redis.get(\"session:\" + token);"
    },
    {
      title: "Rate limit with INCR",
      lang: "js",
      flow: ["Request", "INCR rl:user", "EXPIRE first time", "if n > 100 → 429"],
      desc: "Definition. Count requests per user per minute in Redis so every API replica shares the same budget.\n\nHow it works. INCR creates the key at 1. EXPIRE on n === 1 starts the window. If n > 100, reject.\n\nOperational risk. Forgetting EXPIRE leaves the counter forever and blocks the user.",
      code: "async function allow(userId) {\n  const key = \"rl:\" + userId;\n  const n = await redis.incr(key);\n  if (n === 1) await redis.expire(key, 60);\n  return n <= 100;\n}"
    },
    {
      title: "Simple queue with a list",
      lang: "js",
      desc: "Definition. LPUSH adds work. BRPOP waits for work. That is a tiny queue.\n\nHow it works. The API pushes a job JSON. A worker blocks on BRPOP and processes one job.\n\nOperational risk. If the worker crashes after pop and before finish, the job is gone. Use Streams or a real queue when loss is not allowed.",
      code: "await redis.lpush(\"mail:jobs\", JSON.stringify({ to: \"a@b.com\" }));\nconst job = await redis.brpop(\"mail:jobs\", 0);"
    },
    {
      title: "Leaderboard with a sorted set",
      lang: "js",
      desc: "Definition. A ZSET stores members with scores. ZINCRBY adds points. ZREVRANGE reads the top.\n\nHow it works. Player names are members. Scores are points. Redis keeps them ordered.\n\nOperational risk. Using a SQL ORDER BY on every page refresh when the table is huge.",
      code: "await redis.zincrby(\"game:scores\", 10, \"ada\");\nconst top = await redis.zrevrange(\"game:scores\", 0, 9, \"WITHSCORES\");"
    }
  ],
  questions: [
    Q(1, "beginner", "What is Redis?", "Definition. Redis is an in-memory key-value store used as a cache, session store, counter, and small queue.\n\nHow it works. Data lives in RAM. Commands like GET and SET are extremely fast.\n\nOperational risk. Treating Redis as the only database for orders or money."),
    Q(2, "beginner", "Why is Redis faster than Postgres for the same read?", "Definition. Redis reads RAM. Postgres reads a durable engine that may hit disk and run a query planner.\n\nHow it works. A cache key is an exact lookup. A SQL query may scan or join.\n\nOperational risk. Caching a result that must be strongly consistent, such as a bank balance, without a plan."),
    Q(3, "beginner", "What is a key?", "Definition. A key is the name you store a value under, such as user:42.\n\nHow it works. Use colons as namespaces: env:service:id. That avoids clashes.\n\nConfiguration. prod:session:abc and test:session:abc stay apart.\n\nOperational risk. Two apps using user:1 for different shapes of data."),
    Q(4, "beginner", "What is TTL?", "Definition. TTL is how many seconds a key may live.\n\nHow it works. EXPIRE or SET ... EX 60. After that, GET returns null.\n\nOperational risk. Cache keys with no TTL fill memory."),
    Q(5, "beginner", "What is cache-aside?", "Definition. The app checks Redis, loads the database on a miss, then fills Redis.\n\nHow it works. Reads go cache-first. Writes update the database, then delete the key.\n\nOperational risk. Updating SQL and forgetting to invalidate.", { flow: ["GET cache", "miss", "DB", "SET"] }),
    Q(6, "beginner", "What is a cache hit and a cache miss?", "Definition. A hit means Redis had the key. A miss means it did not.\n\nHow it works. Hit ratio = hits / (hits + misses). Low hit ratio means Redis is not helping.\n\nOperational risk. A flush that turns every read into a miss and knocks over the database."),
    Q(7, "intermediate", "When should you use a hash instead of a string?", "Definition. Use a hash when one key has several fields you read or write separately.\n\nHow it works. HGET user:1 name does not parse a whole JSON blob.\n\nOperational risk. HSET on a key that is already a string type errors."),
    Q(8, "intermediate", "How do you store a login session in Redis?", "Definition. After password check, save session:<random> → userId with a TTL.\n\nHow it works. The browser keeps the random token in a cookie. Each request GETs the key.\n\nOperational risk. A guessable session id."),
    Q(9, "intermediate", "How do you rate-limit with Redis?", "Definition. INCR a per-user key and EXPIRE the window.\n\nHow it works. Shared Redis means every API replica sees the same count.\n\nOperational risk. Limiting only in one Node process while you run four processes."),
    Q(10, "intermediate", "What is LRU eviction?", "Definition. When RAM is full, Redis can drop the least recently used keys.\n\nHow it works. maxmemory and maxmemory-policy allkeys-lru.\n\nOperational risk. Evicting session keys if you mix cache and sessions without a separate instance or prefix policy."),
    Q(11, "intermediate", "What is the difference between DEL and invalidation after write?", "Definition. DEL removes the stale copy so the next read refills from the database.\n\nHow it works. Write SQL first, then DEL. That is safer than DEL then write.\n\nOperational risk. Two servers writing different values without a version."),
    Q(12, "advanced", "What is a cache stampede?", "Definition. Many clients miss the same expired key and all hit the database.\n\nHow it works. Use a lock, singleflight, or jittered TTL.\n\nOperational risk. One popular key with a 60s TTL aligned to a cron."),
    Q(13, "intermediate", "Pub/sub versus Streams?", "Definition. Pub/sub is fire-and-forget to current subscribers. Streams keep a log.\n\nHow it works. Use pub/sub for 'user is typing'. Use Streams or SQS when the email must send even if the worker was down.\n\nOperational risk. Using pub/sub for payments."),
    Q(14, "beginner", "Can Redis replace MongoDB?", "Definition. No, not as the system of record for most products.\n\nHow it works. Redis is memory-first. Mongo and Postgres persist documents and rows with richer queries.\n\nOperational risk. A Redis restart wiping the only user table."),
    Q(15, "intermediate", "What does KEYS * do that is dangerous?", "Definition. KEYS scans every key and blocks Redis while it runs.\n\nHow it works. Use SCAN in loops for cleanup jobs.\n\nOperational risk. Running KEYS * on production to 'just look'."),
    Q(16, "intermediate", "How do you namespace keys?", "Definition. Prefix every key with app and environment: prep:prod:user:1.\n\nHow it works. One Redis can hold many apps if prefixes never overlap.\n\nOperational risk. FLUSHALL on a shared instance."),
    Q(17, "advanced", "RDB versus AOF?", "Definition. RDB is a snapshot. AOF is a write log.\n\nHow it works. RDB is smaller and slower to be current. AOF is more durable and larger.\n\nOperational risk. Believing AOF means zero data loss under every crash."),
    Q(18, "intermediate", "How does a replica help?", "Definition. Reads can go to a replica. Failover can promote a replica.\n\nHow it works. The primary takes writes. Replicas copy the stream.\n\nOperational risk. Reading a session from a lagging replica right after login."),
    Q(19, "beginner", "What ports and URL does Redis use?", "Definition. Default port is 6379. Apps use a URL like redis://localhost:6379.\n\nHow it works. Managed Redis (ElastiCache, Upstash, Redis Cloud) gives you a host and a password.\n\nOperational risk. An open 6379 on the public internet."),
    Q(20, "intermediate", "How do you cache a list page?", "Definition. Key the list by the query: feed:user:1:page:1.\n\nHow it works. Short TTL. Invalidate on new post if you need the first page fresh.\n\nOperational risk. One global feed key for every user."),
    Q(21, "advanced", "What is Redis Cluster?", "Definition. Cluster splits keys across nodes using 16384 hash slots.\n\nHow it works. A key hashes to a slot; that slot lives on one primary.\n\nOperational risk. Multi-key commands that span slots fail unless keys share a hash tag {user}."),
    Q(22, "beginner", "How do you talk to Redis from Node?", "Definition. Use a client such as ioredis or node-redis. connect, then get/set.\n\nHow it works. One shared client per process, not a new connection per request.\n\nOperational risk. Opening a connection inside every handler."),
    Q(23, "intermediate", "What is a pipeline?", "Definition. A pipeline sends many commands in one round trip.\n\nHow it works. Queue GET a, GET b, GET c, then exec.\n\nOperational risk. Huge pipelines that block the client if Redis is slow."),
    Q(24, "beginner", "What should you monitor?", "Definition. Memory used, hit ratio, evicted keys, connected clients, and latency.\n\nHow it works. Alert when memory is near maxmemory or hit ratio collapses.\n\nOperational risk. Discovering a full Redis only after the site is slow."),
    Q(25, "intermediate", "How do you store a shopping cart?", "Definition. A hash cart:user:1 with field = product id and value = quantity, plus a TTL.\n\nHow it works. HINCRBY for +1. Persist to SQL when the user checks out.\n\nOperational risk. Cart only in Redis with no TTL and no checkout write."),
    Q(26, "advanced", "How do you do distributed locks?", "Definition. SET lock:job NX EX 30 is a simple lock. Redlock is a stricter multi-node recipe.\n\nHow it works. Only one worker runs the job. Always set NX and a TTL.\n\nOperational risk. A lock without TTL if the holder dies."),
    Q(27, "beginner", "What is persist versus cache?", "Definition. Persist means the data must survive a restart. Cache means it is a speed copy.\n\nHow it works. Sessions can live in Redis if you accept logout on flush, or you persist sessions in SQL.\n\nOperational risk. Calling a cache 'the database' in an interview."),
    Q(28, "intermediate", "How do you expire stories like Snapchat?", "Definition. Store expires_at in the database. Optionally also SET a Redis key with TTL for the hot path.\n\nHow it works. Reads hide expired rows. A sweeper deletes bytes later.\n\nOperational risk. Only a Redis TTL — the durable copy remains."),
    Q(29, "beginner", "Why not cache HTML for a logged-in page under one key?", "Definition. That HTML contains one user's data.\n\nHow it works. Cache keys must include user id, or cache only public fragments.\n\nOperational risk. Serving Ada's inbox to every visitor."),
    Q(30, "advanced", "How do you keep Redis highly available?", "Definition. Use replication plus automatic failover (Sentinel or a managed offering) and Multi-AZ.\n\nHow it works. Clients reconnect to the new primary after failover.\n\nOperational risk. A single-node Redis on one VM as the only session store for a bank-like app.")
  ]
});

dump("nginx", {
  kind: "design",
  notes: [
    {
      title: "What Nginx is",
      layers: [[{ label: "Internet", tone: "edge" }], [{ label: "Nginx", tone: "stateless" }], [{ label: "Node :3000" }, { label: "Static files", tone: "store" }]],
      flow: ["Browser", "Nginx :80/:443", "Proxy or file", "Response"],
      body: "Nginx is a web server and reverse proxy. It accepts HTTP and HTTPS from the internet, can serve HTML and images from disk, and can forward API paths to your Node, Python, or Java app. You almost never expose Express on port 3000 to the whole internet. Nginx sits in front, handles TLS, and passes /api to the app."
    },
    {
      title: "Reverse proxy",
      flow: ["Client", "Nginx", "proxy_pass http://127.0.0.1:3000", "App"],
      body: "A reverse proxy receives the browser request and opens a second request to an internal server. The browser only talks to Nginx. That lets you run several apps, add HTTPS, hide ports, and buffer slow clients. proxy_pass is the line that sends the request onward."
    },
    {
      title: "Static files versus the app",
      body: "Let Nginx send /assets/*.js and images from a folder. Let the app handle /api. Static files do not need Node. try_files $uri /index.html is the usual single-page-app rule: if the file is missing, return index.html so React Router can run."
    },
    {
      title: "TLS (HTTPS)",
      flow: ["Client HTTPS", "Nginx certificate", "HTTP to app on localhost"],
      body: "Nginx terminates TLS: the certificate lives on Nginx. The app behind it can speak plain HTTP on 127.0.0.1. Let's Encrypt (certbot) issues free certificates. Redirect port 80 to 443 so users always get HTTPS."
    },
    {
      title: "Load balancing",
      layers: [[{ label: "Nginx upstream" }], [{ label: "App :3001" }, { label: "App :3002" }, { label: "App :3003" }]],
      flow: ["Request", "upstream pick", "Healthy app"],
      body: "An upstream block lists several app processes. Nginx picks one (round-robin by default). If a server fails the health idea (max_fails), it is skipped. This is how you run more than one Node process without Kubernetes."
    },
    {
      title: "Headers the app must see",
      body: "The app thinks the client is Nginx unless you pass the original IP and scheme. Set X-Forwarded-For, X-Forwarded-Proto, and Host. Express trust proxy must be on so secure cookies and logs are correct. Without this, rate limits see one IP (Nginx) and HTTPS apps think they are on HTTP."
    },
    {
      title: "gzip, buffering, limits",
      body: "gzip compresses text responses. client_max_body_size stops huge uploads. proxy_read_timeout stops a hung app from holding a worker forever. These knobs are why Nginx is used even when the app could listen on 443 itself."
    },
    {
      title: "Common layouts",
      body: "Laptop: Vite on 5173, no Nginx. VPS: Nginx → Node. Docker Compose: nginx container → api container. Kubernetes: Ingress is often Nginx. Vercel and Render hide this box; on a VPS you own it."
    }
  ],
  examples: [
    {
      title: "Proxy /api to Node",
      lang: "nginx",
      layers: [[{ label: "Browser" }], [{ label: "Nginx :443", tone: "edge" }], [{ label: "Express :3000", tone: "stateless" }]],
      flow: ["GET /api/users", "Nginx", "127.0.0.1:3000", "JSON"],
      desc: "Definition. /api is forwarded. Everything else can be static files.\n\nHow it works. location /api/ { proxy_pass http://127.0.0.1:3000; } plus forwarded headers.\n\nOperational risk. Forgetting the trailing slash and doubling /api/api.",
      code: "server {\n  listen 80;\n  server_name example.com;\n\n  location /api/ {\n    proxy_pass http://127.0.0.1:3000;\n    proxy_set_header Host $host;\n    proxy_set_header X-Real-IP $remote_addr;\n    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n    proxy_set_header X-Forwarded-Proto $scheme;\n  }\n}"
    },
    {
      title: "Serve a React build",
      lang: "nginx",
      flow: ["GET /app/settings", "try_files", "index.html", "React router"],
      desc: "Definition. After npm run build, Nginx serves the dist folder.\n\nHow it works. try_files $uri $uri/ /index.html returns the SPA shell for client routes.\n\nOperational risk. Caching index.html for a year so users keep a dead app shell.",
      code: "server {\n  listen 80;\n  root /var/www/app/dist;\n  index index.html;\n\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}"
    },
    {
      title: "Two Node processes",
      lang: "nginx",
      flow: ["Request", "upstream", "app1 or app2"],
      desc: "Definition. upstream names a pool. proxy_pass http://app; picks a member.\n\nHow it works. Round-robin by default. Add more listen ports or PM2 instances.\n\nOperational risk. Sticky sessions in the app when the next request hits the other process.",
      code: "upstream app {\n  server 127.0.0.1:3001;\n  server 127.0.0.1:3002;\n}\n\nserver {\n  listen 80;\n  location / {\n    proxy_pass http://app;\n  }\n}"
    },
    {
      title: "Force HTTPS",
      lang: "nginx",
      desc: "Definition. Port 80 only redirects. Port 443 serves the site with a certificate.\n\nHow it works. return 301 https://$host$request_uri;\n\nOperational risk. A redirect loop if the app also redirects and X-Forwarded-Proto is missing.",
      code: "server {\n  listen 80;\n  server_name example.com;\n  return 301 https://$host$request_uri;\n}"
    }
  ],
  questions: [
    Q(1, "beginner", "What is Nginx?", "Definition. Nginx is a web server and reverse proxy that sits in front of your app.\n\nHow it works. It accepts 80/443, serves files or proxy_pass to Node.\n\nOperational risk. Publishing Express :3000 on 0.0.0.0 without a proxy."),
    Q(2, "beginner", "What is a reverse proxy?", "Definition. A proxy the client does not choose; it forwards to internal services.\n\nHow it works. Browser → Nginx → 127.0.0.1:3000.\n\nOperational risk. Thinking the app sees the real client IP without forwarded headers.", { flow: ["Browser", "Nginx", "App"] }),
    Q(3, "beginner", "Why not expose port 3000?", "Definition. The app port is an internal detail. The public door should be 80/443 on Nginx.\n\nHow it works. Firewall allows 80/443 only. Node listens on localhost.\n\nOperational risk. A debug server left on 0.0.0.0:3000 in production."),
    Q(4, "beginner", "What is server_name?", "Definition. The hostnames this server block answers, such as api.example.com.\n\nHow it works. Nginx picks the matching server block from the Host header.\n\nOperational risk. Two default servers and the wrong site appearing."),
    Q(5, "beginner", "What is location?", "Definition. A location block matches a URL prefix or regex and decides what to do.\n\nHow it works. location /api/ proxies. location / serves files.\n\nOperational risk. A greedy location / catching /api before the API block."),
    Q(6, "intermediate", "What does proxy_pass do?", "Definition. It forwards the request to another HTTP server.\n\nHow it works. URI joining depends on a trailing slash. Test /api and /api/.\n\nOperational risk. Double prefixes or stripped prefixes you did not expect."),
    Q(7, "intermediate", "How do you serve a React Router app?", "Definition. Unknown paths must return index.html.\n\nHow it works. try_files $uri $uri/ /index.html;\n\nOperational risk. Nginx 404 on /settings so the SPA never loads."),
    Q(8, "intermediate", "How does Nginx terminate TLS?", "Definition. The certificate is installed on Nginx. The browser speaks HTTPS only to Nginx.\n\nHow it works. listen 443 ssl; ssl_certificate ...; the app stays on HTTP localhost.\n\nOperational risk. Expired certificates with no renew cron."),
    Q(9, "intermediate", "What headers must you forward?", "Definition. Host, X-Real-IP, X-Forwarded-For, X-Forwarded-Proto.\n\nHow it works. Express app.set('trust proxy', 1) so req.ip and secure cookies work.\n\nOperational risk. Secure cookies never set because the app thinks HTTP."),
    Q(10, "intermediate", "How do you load-balance two Node processes?", "Definition. upstream { server ...; server ...; } then proxy_pass http://thatname;\n\nHow it works. Round-robin unless you set least_conn or ip_hash.\n\nOperational risk. ip_hash plus one dead process pins users to a corpse."),
    Q(11, "beginner", "What is the difference between Apache and Nginx?", "Definition. Both are web servers. Nginx is event-driven and very common as a reverse proxy today.\n\nHow it works. Same job: files, TLS, proxy.\n\nOperational risk. Running both on port 80."),
    Q(12, "intermediate", "What is gzip in Nginx?", "Definition. Nginx compresses text responses so they download smaller.\n\nHow it works. gzip on; gzip_types text/css application/json ...\n\nOperational risk. Compressing already-compressed images wastes CPU."),
    Q(13, "intermediate", "What is client_max_body_size?", "Definition. The largest upload Nginx will accept.\n\nHow it works. Default is often 1m. File uploads need a higher value.\n\nOperational risk. A 413 that looks like an app bug."),
    Q(14, "advanced", "What is buffering?", "Definition. Nginx can read the full request or response before sending it on.\n\nHow it works. Helps slow clients. Hurts SSE or big streaming unless you disable proxy_buffering.\n\nOperational risk. Chat streams that wait until the buffer fills."),
    Q(15, "beginner", "How do you reload config safely?", "Definition. nginx -t tests the file. nginx -s reload applies it without dropping good connections the hard way.\n\nHow it works. Always test first.\n\nOperational risk. Restart instead of reload during peak."),
    Q(16, "intermediate", "Where do you put config on Ubuntu?", "Definition. /etc/nginx/nginx.conf and files in sites-available linked into sites-enabled.\n\nHow it works. One file per site.\n\nOperational risk. Editing a file that is not enabled and wondering why nothing changed."),
    Q(17, "advanced", "How does Nginx fit with Docker?", "Definition. An nginx container publishes 80/443 and proxy_pass to the api service name on the Docker network.\n\nHow it works. proxy_pass http://api:3000; using Compose DNS.\n\nOperational risk. proxy_pass to localhost inside the nginx container — that is the nginx container, not the host."),
    Q(18, "beginner", "Do Vercel and Render use Nginx?", "Definition. You do not write Nginx on Vercel. You may still meet Nginx on a VPS, a VM, or Kubernetes Ingress.\n\nHow it works. Managed platforms run a proxy for you.\n\nOperational risk. Assuming every job is 'just Vercel' and never learning the VPS path."),
    Q(19, "intermediate", "What is a 502 Bad Gateway?", "Definition. Nginx reached the app and the app did not give a valid response — often the app is down.\n\nHow it works. Check that Node is listening on the proxy_pass port.\n\nOperational risk. Restarting Nginx when the app crashed."),
    Q(20, "intermediate", "What is a 504 Gateway Timeout?", "Definition. The app was too slow. Nginx gave up (proxy_read_timeout).\n\nHow it works. Raise timeout only after you fix the slow query.\n\nOperational risk. Hiding a 30-second SQL query by setting timeout 300."),
    Q(21, "advanced", "How do you rate-limit in Nginx?", "Definition. limit_req_zone and limit_req use a key such as $binary_remote_addr.\n\nHow it works. Burst then 429 or delay.\n\nOperational risk. NAT offices sharing one IP."),
    Q(22, "beginner", "What is root versus alias?", "Definition. root appends the full URI to the folder. alias replaces the location prefix.\n\nHow it works. Get this wrong and files 404.\n\nOperational risk. Serving the whole disk by a sloppy alias."),
    Q(23, "intermediate", "How do you hide Nginx version?", "Definition. server_tokens off; stops the version in error pages and headers.\n\nHow it works. Slightly less information for scanners.\n\nOperational risk. Thinking this is your only security control."),
    Q(24, "advanced", "How do you do blue-green with Nginx?", "Definition. Two upstreams (blue, green). Switch proxy_pass after the new color is healthy.\n\nHow it works. Reload Nginx to flip.\n\nOperational risk. Switching before health checks pass."),
    Q(25, "beginner", "What logs should you read?", "Definition. access.log is every request. error.log is failures and config problems.\n\nHow it works. Status, time, and upstream address tell you if Nginx or the app failed.\n\nOperational risk. Only reading the Node console on a VPS."),
    Q(26, "intermediate", "How do you add WebSockets?", "Definition. Upgrade the connection: proxy_http_version 1.1; Upgrade and Connection headers.\n\nHow it works. Chat and Vite HMR need this.\n\nOperational risk. 400 on WS because Upgrade was not forwarded."),
    Q(27, "beginner", "What is PM2 next to Nginx?", "Definition. PM2 keeps Node processes alive. Nginx is the public HTTP door.\n\nHow it works. PM2 starts app.js on 3000. Nginx proxies to 3000.\n\nOperational risk. Using only PM2 expose 3000 to the world."),
    Q(28, "advanced", "How is Kubernetes Ingress related?", "Definition. Many clusters use an Nginx Ingress Controller. The ideas are the same: host, path, TLS, backend service.\n\nHow it works. Ingress YAML instead of a server block.\n\nOperational risk. Learning only kubectl and never the HTTP path.")
  ]
});

dump("hosting", {
  kind: "design",
  notes: [
    {
      title: "What 'deploy' means",
      layers: [[{ label: "GitHub" }], [{ label: "Vercel / Render / Netlify", tone: "edge" }], [{ label: "Live HTTPS URL" }]],
      flow: ["Push", "Build", "CDN or VM", "https://your.app"],
      body: "Deploy means other people can open your app on the internet. On your laptop only you can. Platforms such as Vercel, Render, Netlify, and Railway watch a GitHub repo, run npm run build, and give you an HTTPS URL. You do not start by renting a raw VM. You start by connecting Git."
    },
    {
      title: "Vercel",
      layers: [[{ label: "Browser" }], [{ label: "Vercel Edge / CDN", tone: "edge" }], [{ label: "Static + Serverless functions" }]],
      flow: ["git push", "Vercel build", "Preview URL", "Production domain"],
      body: "Vercel is built for frontend and Next.js. Every pull request gets a preview URL. Static files go to a CDN. API routes and server components become serverless functions. You set environment variables in the dashboard. There is no long-lived Express process unless you use a different host for that API. Cold starts exist on functions."
    },
    {
      title: "Render",
      layers: [[{ label: "Browser" }], [{ label: "Render load balancer", tone: "edge" }], [{ label: "Web service (Node)", tone: "stateless" }, { label: "Postgres", tone: "store" }, { label: "Redis", tone: "store" }]],
      flow: ["Push", "Docker or build command", "Always-on process", "Health check"],
      body: "Render runs a real process — closer to a VPS than Vercel. A Web Service can be npm start on port 10000 (Render sets PORT). You can add a managed Postgres and Redis. Background Workers run queues. Free web services spin down after idle time; the first request is slow. Paid services stay up."
    },
    {
      title: "Netlify and Cloudflare Pages",
      body: "Netlify is like Vercel for static sites and JAMstack functions. Cloudflare Pages puts static assets on Cloudflare's edge. Both connect to Git. Use them for marketing sites and SPAs. A long-running WebSocket server does not belong here; use Render, a VPS, or a dedicated socket host."
    },
    {
      title: "Railway, Fly.io, and a VPS",
      body: "Railway is Git-to-container with add-on databases — similar to Render. Fly.io runs your image close to users. A VPS (DigitalOcean, Lightsail, EC2) means you install Nginx, Node, and TLS yourself. Platforms are faster to start. A VPS teaches Nginx and costs less at a predictable size."
    },
    {
      title: "Environment variables",
      flow: ["Dashboard secret", "Build or runtime env", "process.env.DATABASE_URL"],
      body: "Never put DATABASE_URL or API keys in the repo. Set them in Vercel / Render / Netlify env settings. Remember: Vercel has Production, Preview, and Development scopes. A key that exists only in Production will be missing on a preview deploy. Restart or redeploy after you change env vars."
    },
    {
      title: "Frontend on Vercel, API on Render",
      layers: [[{ label: "React on Vercel", tone: "edge" }], [{ label: "API on Render", tone: "stateless" }], [{ label: "Postgres + Redis", tone: "store" }]],
      flow: ["Browser", "Vercel static", "fetch api.example.com", "Render", "DB"],
      body: "A common student setup: Vite/React on Vercel, Express on Render, Postgres on Render. You must set CORS on the API and use the real HTTPS origin. Cookies need SameSite and a shared parent domain or you use tokens. This split is normal and interviewers understand it."
    },
    {
      title: "Build versus start",
      body: "Build is npm run build — it creates files (dist or .next). Start is npm start — it runs the server. Vercel mostly cares about build output. Render needs both a build command and a start command for a Node API. If start binds to a hardcoded 3000 instead of process.env.PORT, Render health checks fail."
    },
    {
      title: "Custom domains and TLS",
      body: "Add example.com in the dashboard. Point DNS (A or CNAME) where the docs say. The platform issues a certificate. Preview URLs stay on *.vercel.app or *.onrender.com. Do not commit those as the only production URL if you have a real domain."
    },
    {
      title: "What to say in an interview",
      body: "Name where the UI lives, where the API lives, where the database lives, and how secrets are injected. Say 'preview deploy on every PR' if you use Vercel. Say 'process spun down on the free tier' if you use Render free. That honesty scores higher than 'I used the cloud'."
    }
  ],
  examples: [
    {
      title: "Vercel: React or Next from GitHub",
      lang: "flow",
      layers: [[{ label: "GitHub" }], [{ label: "Vercel build", tone: "edge" }], [{ label: "CDN + functions" }]],
      flow: ["Import repo", "Framework preset", "Build", "Preview URL"],
      desc: "Definition. Connect the repo. Vercel detects Vite or Next, runs the build, and hosts the output.\n\nHow it works. Each branch or PR gets a URL. Production tracks main.\n\nOperational risk. A NEXT_PUBLIC_ secret that actually needed to stay server-only.",
      code: "// next.config or Vite — public env must be prefixed\n// Next: NEXT_PUBLIC_API_URL=https://api.example.com\n// Vite: VITE_API_URL=https://api.example.com\n\nconst api = import.meta.env.VITE_API_URL;\nfetch(api + \"/health\");"
    },
    {
      title: "Render: Express web service",
      lang: "js",
      layers: [[{ label: "Render" }], [{ label: "Node process", tone: "stateless" }], [{ label: "Postgres", tone: "store" }]],
      flow: ["Build npm install", "Start npm start", "PORT from env", "Health /"],
      desc: "Definition. Render starts a long-lived Node process.\n\nHow it works. Listen on process.env.PORT. Add a health route. Attach DATABASE_URL from a Render Postgres.\n\nOperational risk. listen(3000) instead of process.env.PORT.",
      code: "const port = process.env.PORT || 3000;\napp.get(\"/health\", (_req, res) => res.json({ ok: true }));\napp.listen(port, () => console.log(\"up\", port));"
    },
    {
      title: "Split frontend and API",
      lang: "flow",
      layers: [[{ label: "Vercel UI", tone: "edge" }], [{ label: "Render API", tone: "stateless" }]],
      flow: ["User", "static app", "HTTPS fetch", "API CORS allow"],
      desc: "Definition. Two hosts, one product.\n\nHow it works. Set CORS origin to the Vercel domain. Put the API URL in VITE_API_URL.\n\nOperational risk. CORS origin localhost left in production.",
      code: "app.use(cors({\n  origin: process.env.WEB_ORIGIN, // https://app.vercel.app\n  credentials: true\n}));"
    },
    {
      title: "Netlify static + redirects",
      lang: "flow",
      flow: ["Build dist", "Publish folder", "SPA redirect /* → /index.html"],
      desc: "Definition. Netlify hosts the folder. A _redirects or netlify.toml file sends client routes to index.html.\n\nHow it works. Same idea as Nginx try_files.\n\nOperational risk. Refresh on /login 404s because the redirect rule is missing.",
      code: "# public/_redirects\n/*    /index.html   200"
    },
    {
      title: "Render Redis + API",
      lang: "js",
      flow: ["API boot", "REDIS_URL", "connect", "GET/SET"],
      desc: "Definition. Create a Redis instance on Render. Copy the internal URL into the web service env.\n\nHow it works. Same ioredis code as local; only the URL changes.\n\nOperational risk. Using the external Redis URL from inside the same region when the internal URL is faster and private.",
      code: "const Redis = require(\"ioredis\");\nconst redis = new Redis(process.env.REDIS_URL);"
    },
    {
      title: "Vercel serverless function",
      lang: "js",
      desc: "Definition. A file in /api becomes an HTTPS function.\n\nHow it works. Export a handler. No long-lived memory between invokes (treat each call as new).\n\nOperational risk. Writing to the local disk and expecting the file to be there next time.",
      code: "// api/hello.js  (Vercel)\nexport default function handler(req, res) {\n  res.status(200).json({ ok: true, at: Date.now() });\n}"
    },
    {
      title: "Free Render spin-down",
      lang: "flow",
      flow: ["Idle 15 min", "Sleep", "Next request", "Cold boot 30–60s"],
      desc: "Definition. Free web services stop when idle.\n\nHow it works. The next visitor waits for a new process.\n\nOperational risk. A demo that looks 'down' in an interview because nobody hit it for an hour. Mention the free-tier sleep, or use a paid instance."
    },
    {
      title: "Custom domain",
      lang: "flow",
      flow: ["Add domain", "CNAME to platform", "Certificate issued", "HTTPS works"],
      desc: "Definition. Your name, their servers.\n\nHow it works. Follow the exact DNS record the dashboard shows. Wait for TLS.\n\nOperational risk. An A record to an old IP after you switched hosts."
    }
  ],
  questions: [
    Q(1, "beginner", "What is Vercel?", "Definition. Vercel is a hosting platform for frontends and Next.js. Git push becomes a live HTTPS URL.\n\nHow it works. Build on their servers, static on a CDN, functions for server code.\n\nOperational risk. Running a 24/7 WebSocket server only on Vercel hobby functions."),
    Q(2, "beginner", "What is Render?", "Definition. Render hosts web services, workers, Postgres, and Redis from Git.\n\nHow it works. A long-lived process (or Docker image) plus a public URL.\n\nOperational risk. Free tier sleep that surprises a live demo."),
    Q(3, "beginner", "What is the difference between Vercel and Render?", "Definition. Vercel is edge/static/serverless-first. Render is process-first, like a managed VPS.\n\nHow it works. Next.js UI → Vercel. Always-on Express + Postgres → Render.\n\nOperational risk. Forcing Express onto Vercel serverless without changing how you store uploads."),
    Q(4, "beginner", "What is Netlify?", "Definition. Netlify hosts static sites and functions, similar to Vercel for JAMstack.\n\nHow it works. Git connect, build, CDN, optional redirects.\n\nOperational risk. No SPA redirect, so client routes 404."),
    Q(5, "beginner", "What is a preview deployment?", "Definition. A unique URL for a pull request or branch.\n\nHow it works. Reviewers click the URL instead of pulling the branch.\n\nOperational risk. Preview talking to the production database."),
    Q(6, "beginner", "Where do secrets go?", "Definition. In the platform environment variables, never in Git.\n\nHow it works. process.env.SECRET at runtime. NEXT_PUBLIC_ / VITE_ for values the browser may see.\n\nOperational risk. A private key with a NEXT_PUBLIC_ prefix."),
    Q(7, "intermediate", "Why must Render listen on process.env.PORT?", "Definition. The platform picks the port and health-checks it.\n\nHow it works. const port = process.env.PORT || 3000.\n\nOperational risk. Hardcoded 3000 → deploy 'live' but 502."),
    Q(8, "intermediate", "What is a cold start?", "Definition. The first request after idle must boot a function or a slept service.\n\nHow it works. Vercel functions and free Render both can be cold.\n\nOperational risk. A 10-second first paint you did not mention in a demo."),
    Q(9, "intermediate", "How do you connect React on Vercel to an API on Render?", "Definition. The browser calls the Render HTTPS URL. CORS must allow the Vercel origin.\n\nHow it works. VITE_API_URL and cors({ origin: WEB_ORIGIN }).\n\nOperational risk. Mixed content (HTTPS page calling HTTP API)."),
    Q(10, "intermediate", "Build command versus start command?", "Definition. Build creates artifacts. Start runs the server.\n\nHow it works. Vercel: mostly build. Render web service: both.\n\nOperational risk. start: vite (dev server) in production."),
    Q(11, "beginner", "What is Railway?", "Definition. Another Git-to-container host with plugins for Postgres and Redis.\n\nHow it works. Similar mental model to Render.\n\nOperational risk. Leaving a database publicly open."),
    Q(12, "beginner", "What is Cloudflare Pages?", "Definition. Static hosting on Cloudflare's edge, usually free and fast for files.\n\nHow it works. Git integration or wrangler upload.\n\nOperational risk. Expecting a Node process to stay running there."),
    Q(13, "intermediate", "When do you still need a VPS and Nginx?", "Definition. When you need a long-lived custom process, special ports, or cheaper predictable VMs.\n\nHow it works. Ubuntu + Nginx + Node + certbot, or Docker Compose.\n\nOperational risk. No backups and no firewall."),
    Q(14, "intermediate", "What does NEXT_PUBLIC_ mean?", "Definition. Next.js inlines that variable into the browser bundle.\n\nHow it works. Anyone can read it in DevTools.\n\nOperational risk. Database passwords in NEXT_PUBLIC_."),
    Q(15, "advanced", "How do serverless functions differ from a Render web service?", "Definition. Functions start per request (or burst) and have time and size limits. A web service is one process that stays up.\n\nHow it works. No in-memory job queue across invokes on functions.\n\nOperational risk. setInterval inside a function that dies when the invoke ends."),
    Q(16, "beginner", "What is a custom domain?", "Definition. Your name (prepplace.dev) pointed at the platform.\n\nHow it works. DNS CNAME or A, then a managed certificate.\n\nOperational risk. TTL so high that a host change takes a day."),
    Q(17, "intermediate", "How do you run migrations on Render?", "Definition. A release command or a one-off job that runs npm run migrate before or after deploy.\n\nHow it works. Migrations must be backward compatible if old and new code overlap.\n\nOperational risk. A migrate that drops a column the old process still reads."),
    Q(18, "intermediate", "What is a Render background worker?", "Definition. A process that does not take HTTP; it consumes a queue.\n\nHow it works. Same repo, different start command.\n\nOperational risk. Doing heavy work inside the web request instead."),
    Q(19, "beginner", "How do you see why a deploy failed?", "Definition. Open the platform build log. The error is usually npm, env, or PORT.\n\nHow it works. Fix, push, watch the new build.\n\nOperational risk. Only testing on localhost after a red deploy."),
    Q(20, "advanced", "How do you keep preview deploys from touching prod data?", "Definition. Separate DATABASE_URL and Redis for preview, or a shared staging database.\n\nHow it works. Vercel Preview env group. Render PR instances if you use them.\n\nOperational risk. One Mongo URI for every branch."),
    Q(21, "intermediate", "Can you use Redis on Vercel?", "Definition. Yes, via a hosted Redis (Upstash is common) because functions cannot keep a local Redis.\n\nHow it works. REDIS_URL in env. Short-lived connections.\n\nOperational risk. A local Redis on your laptop that preview functions cannot reach."),
    Q(22, "beginner", "What is a monorepo deploy?", "Definition. One Git repo with apps/web and apps/api. Each platform root directory points at a folder.\n\nHow it works. Vercel Root Directory = apps/web. Render Root Directory = apps/api.\n\nOperational risk. Building the wrong folder."),
    Q(23, "intermediate", "What is ISR or static regeneration on Vercel?", "Definition. Next.js can reuse a static page and refresh it in the background.\n\nHow it works. Good for marketing pages. Not for per-user inboxes.\n\nOperational risk. Caching a personalized page as static."),
    Q(24, "beginner", "What should you put in a portfolio README about hosting?", "Definition. Live URL, repo, and one sentence: UI on Vercel, API on Render, data on Postgres, cache on Redis.\n\nHow it works. Interviewers click the URL first.\n\nOperational risk. A localhost-only project with no URL."),
    Q(25, "advanced", "How do you roll back?", "Definition. Platforms keep old deployments. Instant rollback points production at a previous build.\n\nHow it works. Click rollback or redeploy a git SHA.\n\nOperational risk. A forward-only database migration that the old build cannot run."),
    Q(26, "intermediate", "Why does CORS appear after you deploy?", "Definition. The UI origin changed from localhost:5173 to https://app.vercel.app.\n\nHow it works. Allow that origin on the API.\n\nOperational risk. origin: '*' with cookies."),
    Q(27, "beginner", "What is a health check on Render?", "Definition. Render GETs a path to decide if the service is up.\n\nHow it works. /health returns 200 quickly without a heavy DB join.\n\nOperational risk. Health = migrate + warm every cache."),
    Q(28, "intermediate", "Docker on Render versus build command?", "Definition. You can give a Dockerfile or let Render run install + start.\n\nHow it works. Docker matches production closer to your laptop Compose.\n\nOperational risk. A Dockerfile that still listens on 3000 only."),
    Q(29, "beginner", "What is Fly.io in one sentence?", "Definition. You ship a container and Fly runs it in regions you pick.\n\nHow it works. Closer to users than one US VM.\n\nOperational risk. One region still dies if you never add a second."),
    Q(30, "advanced", "How would you move from Render to a VPS later?", "Definition. Same Node app, you add Nginx, TLS, systemd or Docker, and managed Postgres/Redis or install them.\n\nHow it works. DNS switches when Nginx is healthy.\n\nOperational risk. Copying .env into the image.")
  ]
});

dump("messaging", {
  kind: "design",
  notes: [
    {
      title: "Why queues exist",
      layers: [[{ label: "API", tone: "stateless" }], [{ label: "Queue", tone: "store" }], [{ label: "Worker" }]],
      flow: ["User action", "Save truth", "Enqueue", "201", "Worker later"],
      body: "A queue holds work that should not sit inside the user request: email, thumbnails, webhooks, fan-out. The API writes the important row, pushes a message, and returns. A worker reads the message and does the slow part. If the worker is down, messages wait. That is the point."
    },
    {
      title: "RabbitMQ",
      body: "RabbitMQ is a message broker. Producers publish to an exchange. The exchange routes to queues. Consumers ack when done. You choose a routing pattern (direct, topic, fanout). It is a good default when you want routing and per-queue consumers without running Kafka."
    },
    {
      title: "Kafka",
      layers: [[{ label: "Producer" }], [{ label: "Topic partitions", tone: "store" }], [{ label: "Consumer group" }]],
      flow: ["Append event", "Partition log", "Consumers read offset"],
      body: "Kafka is a distributed log. Messages stay for a retention time. Many consumer groups can replay the same topic. Use it for event streams, analytics, and high-volume logs. It is heavier than Redis lists. You do not need Kafka for a student email queue."
    },
    {
      title: "Amazon SQS and cloud queues",
      body: "SQS is a managed queue: send, receive, delete. Visibility timeout hides a message while you work. A dead-letter queue holds failures. Cloud queues mean you do not run the broker. The ideas (at-least-once, idempotency) stay the same as RabbitMQ."
    },
    {
      title: "At-least-once and idempotency",
      flow: ["Deliver", "Work", "Crash", "Deliver again", "Same business key"],
      body: "Most queues deliver at least once. The worker can see the same job twice. Make work safe to repeat: store processed message ids, or use a unique order id when charging a card. Exactly-once is a property you design, not a slogan the broker gives you for free."
    },
    {
      title: "When Redis list is enough",
      body: "LPUSH/BRPOP is fine for homework and low-value jobs. If losing a popped job on crash is bad, use Streams with ACK, RabbitMQ, SQS, or Kafka. Interviews like hearing that you know the upgrade path."
    },
    {
      title: "Dead-letter queues",
      flow: ["Fail N times", "Move to DLQ", "Alarm", "Human fixes"],
      body: "A poison message crashes every worker. After N retries it should leave the main queue. Alarm on DLQ depth. Someone must read those payloads. A silent DLQ is a pile of angry users."
    },
    {
      title: "What to draw",
      body: "Always draw: API → queue → worker → side system (SMTP, S3, other API). Write 'idempotent' on the worker. Write 'DLQ + alarm' under the queue. That sketch beats naming five products."
    }
  ],
  examples: [
    {
      title: "API enqueues email",
      lang: "js",
      flow: ["POST /signup", "INSERT user", "enqueue welcome", "201"],
      desc: "Definition. Signup succeeds when the user row exists, not when Gmail accepts mail.\n\nHow it works. Commit user, then send a job { type: 'WELCOME', userId }.\n\nOperational risk. Sending mail before commit, then rolling back the user.",
      code: "await db.users.insert({ id, email });\nawait queue.send({ type: \"WELCOME\", userId: id });\nres.status(201).json({ id });"
    },
    {
      title: "Idempotent worker",
      lang: "js",
      flow: ["Receive", "if processed skip", "send mail", "mark processed", "ack"],
      desc: "Definition. The same userId welcome may arrive twice.\n\nHow it works. A processed_jobs table with unique job key.\n\nOperational risk. Charging twice because you acked after a timeout and the message returned.",
      code: "async function onWelcome(job) {\n  const ok = await db.jobs.insertIgnore({ key: \"welcome:\" + job.userId });\n  if (!ok) return;\n  await mail.sendWelcome(job.userId);\n}"
    },
    {
      title: "SQS visibility timeout",
      lang: "flow",
      flow: ["Receive", "Hidden 60s", "Finish → delete", "or timeout → visible again"],
      desc: "Definition. After receive, the message is hidden. If you do not delete it in time, it comes back.\n\nHow it works. Visibility > worst-case work. Extend if work is long.\n\nOperational risk. Visibility 30s and a 2-minute job → two workers."
    },
    {
      title: "Kafka topic in one picture",
      lang: "flow",
      layers: [[{ label: "orders topic" }], [{ label: "P0", tone: "store" }, { label: "P1", tone: "store" }, { label: "P2", tone: "store" }]],
      flow: ["key = userId", "same partition", "order preserved per key"],
      desc: "Definition. A topic is split into partitions. Order is per partition, not global.\n\nHow it works. Same key → same partition → same consumer in a group.\n\nOperational risk. Expecting global order across the whole topic."
    },
    {
      title: "RabbitMQ routing",
      lang: "flow",
      flow: ["Publish exchange", "Routing key", "Queue", "Consumer ack"],
      desc: "Definition. Producers do not pick a consumer. They pick an exchange and a key.\n\nHow it works. Bindings decide which queues get a copy.\n\nOperational risk. A queue with no consumer and no TTL filling the disk."
    }
  ],
  questions: [
    Q(1, "beginner", "What is a message queue?", "Definition. A buffer between the API and slow work.\n\nHow it works. Send now, process soon, retry on failure.\n\nOperational risk. Doing the slow work inside the HTTP handler."),
    Q(2, "beginner", "What is a worker?", "Definition. A process that only consumes jobs. It is not the public website.\n\nHow it works. Long loop: receive, process, ack.\n\nOperational risk. No restart policy so one crash stops all email."),
    Q(3, "beginner", "Why not send email inside signup?", "Definition. SMTP is slow and can fail. Signup should still succeed.\n\nHow it works. Queue the welcome mail.\n\nOperational risk. User thinks signup failed because Gmail was down."),
    Q(4, "intermediate", "What is at-least-once delivery?", "Definition. The broker may give you the message more than once.\n\nHow it works. Design idempotent handlers.\n\nOperational risk. 'The queue is exactly once' as an excuse to skip a unique key."),
    Q(5, "intermediate", "What is a dead-letter queue?", "Definition. The holding area for messages that failed too many times.\n\nHow it works. Alarm on depth. Inspect payloads.\n\nOperational risk. A DLQ nobody reads."),
    Q(6, "intermediate", "What is RabbitMQ?", "Definition. A broker with exchanges, queues, and acknowledgements.\n\nHow it works. Flexible routing for many small services.\n\nOperational risk. Running it with no disk limits."),
    Q(7, "intermediate", "What is Kafka?", "Definition. A durable partitioned log that many consumer groups can replay.\n\nHow it works. High volume events and analytics.\n\nOperational risk. Using Kafka for a single email a day."),
    Q(8, "beginner", "What is SQS?", "Definition. AWS managed queue. Send, receive, delete.\n\nHow it works. Visibility timeout + optional DLQ.\n\nOperational risk. Never deleting after success so the job repeats."),
    Q(9, "intermediate", "When is a Redis list not enough?", "Definition. When losing a popped job on crash is unacceptable.\n\nHow it works. Upgrade to Streams, SQS, RabbitMQ, or Kafka.\n\nOperational risk. BRPOP then crash before the email send."),
    Q(10, "advanced", "What is a consumer group in Kafka?", "Definition. A set of workers that split partitions of a topic.\n\nHow it works. Each partition is read by one member of the group.\n\nOperational risk. More consumers than partitions — extras sit idle."),
    Q(11, "intermediate", "What is visibility timeout?", "Definition. Hide the message while a worker processes it.\n\nHow it works. Too short → double work. Too long → slow retry.\n\nOperational risk. Timeout shorter than the HTTP call to a vendor."),
    Q(12, "beginner", "What should you ack?", "Definition. Ack (or delete) only after the side effect is safely recorded or is idempotent.\n\nHow it works. Ack too early → loss. Ack too late → duplicates you must handle anyway.\n\nOperational risk. Ack in a finally block before you know success."),
    Q(13, "advanced", "What is an outbox?", "Definition. Write the event row in the same SQL transaction as the business row, then a publisher copies to the broker.\n\nHow it works. Avoids 'queued but not committed'.\n\nOperational risk. Dual-write to SQL and Kafka in two steps without an outbox."),
    Q(14, "intermediate", "How do you name a job?", "Definition. Include a type and a business id: WELCOME:user:42.\n\nHow it works. That string is the idempotency key.\n\nOperational risk. Random UUIDs only, so retries look like new work."),
    Q(15, "beginner", "Where does a worker run on Render?", "Definition. A Background Worker service with a start command like npm run worker.\n\nHow it works. Same repo, no public port.\n\nOperational risk. Starting the worker only on your laptop."),
    Q(16, "advanced", "Kafka versus RabbitMQ in one interview sentence?", "Definition. Kafka is a replayable log for streams. RabbitMQ is a broker for task routing and classic work queues.\n\nHow it works. Pick from volume and replay needs, not from fashion.\n\nOperational risk. Installing both for one newsletter."),
    Q(17, "intermediate", "What do you monitor on a queue?", "Definition. Depth, age of the oldest message, DLQ depth, consumer lag, error rate.\n\nHow it works. Page when depth grows and consumers are down.\n\nOperational risk. Only monitoring API 200s while email is 6 hours late."),
    Q(18, "beginner", "Can the API and the worker share a repo?", "Definition. Yes. Two start commands, one codebase.\n\nHow it works. /src/http and /src/worker.\n\nOperational risk. Importing Express into the worker just to boot it."),
    Q(19, "intermediate", "What is backpressure?", "Definition. Slow or reject new work when the queue or workers are saturated.\n\nHow it works. Bounded queue, 429, or stop the producer.\n\nOperational risk. An unbounded in-memory array as a 'queue'."),
    Q(20, "advanced", "How do you replay Kafka after a bug fix?", "Definition. Reset the consumer group offset to an earlier time and read again.\n\nHow it works. Handlers must be idempotent or the replay double-applies.\n\nOperational risk. Replay that re-charges cards."),
    Q(21, "beginner", "What is pub/sub?", "Definition. One publish, many current subscribers.\n\nHow it works. Redis pub/sub or an SNS topic.\n\nOperational risk. A down subscriber missing the only copy of an event."),
    Q(22, "intermediate", "How does this connect to Nginx and Redis?", "Definition. Nginx fronts the API. Redis may cache reads. The queue is for async writes.\n\nHow it works. They solve different delays: network, repeated reads, and slow side effects.\n\nOperational risk. Using Redis pub/sub as the only order pipeline.")
  ]
});

console.log("infra topics written");
