const fs = require("fs");
const path = require("path");

const dump = (id, data) => {
  const out = `window.PREP_DATA = window.PREP_DATA || {};\nwindow.PREP_DATA[${JSON.stringify(id)}] = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(path.join(__dirname, "..", "data", `${id}.js`), out);
};

const q = (id, level, title, a, extra = {}) => ({ id, level, q: title, a, ...extra });

const blocks = {
  kind: "design",
  notes: [
    {
      title: "How to run a design interview",
      layers: [[{ label: "1. Requirements", tone: "edge" }, { label: "2. Scale numbers" }, { label: "3. API" }], [{ label: "4. Draw the path", tone: "stateless" }, { label: "5. Data model", tone: "store" }, { label: "6. Bottlenecks", tone: "warn" }]],
      flow: ["Clarify", "Estimate QPS", "Sketch", "Deep-dive", "Failures"],
      body: "State functional requirements, then non-functional ones (latency, consistency, availability). Convert daily active users into read QPS, write QPS, and storage. Draw the request path before naming brands. Name the first bottleneck and the control that removes it. Close with failover, monitoring, and what you would build next."
    },
    {
      title: "The standard request path",
      layers: [[{ label: "Client", tone: "edge" }], [{ label: "DNS" }, { label: "CDN", tone: "edge" }], [{ label: "Load balancer", tone: "stateless" }], [{ label: "App servers", tone: "stateless" }], [{ label: "Cache", tone: "store" }, { label: "Primary DB", tone: "store" }, { label: "Replica", tone: "store" }]],
      flow: ["Client", "DNS", "CDN / LB", "Application", "Cache", "Database"],
      body: "A user request is resolved by DNS, optionally served from a CDN, then distributed by a load balancer onto stateless application servers. Hot reads should hit a cache. Durable state lives in a primary database; replicas absorb read scale. Every later design is a variation of this path."
    },
    {
      title: "DNS",
      flow: ["Browser", "Resolver", "Authoritative DNS", "VIP / hostname"],
      body: "DNS maps a hostname to an address or to another hostname. Low TTL speeds failover and increases query volume. Health-checked records can shift traffic after an outage. DNS is not an HTTP router; path-based routing belongs at the load balancer."
    },
    {
      title: "Load balancer",
      layers: [[{ label: "Clients", tone: "edge" }], [{ label: "Load balancer", tone: "stateless" }], [{ label: "App A" }, { label: "App B" }, { label: "App C" }]],
      flow: ["TLS terminate", "Health check", "Choose target", "Forward"],
      body: "A load balancer terminates TLS, checks target health, and spreads connections. Layer 7 balancers route on host and path. Layer 4 balancers forward TCP or UDP. Prefer stateless application nodes so any healthy target can serve the next request."
    },
    {
      title: "Caching",
      flow: ["Request", "Cache lookup", "Hit → return", "Miss → store → fill cache"],
      body: "A cache stores expensive results closer to the caller. Cache-aside lets the application read the store on a miss and then populate the cache. Write-through updates cache and store together. Eviction, TTL, and stampede control (lock or singleflight) are part of the design, not optional details."
    },
    {
      title: "CDN",
      layers: [[{ label: "User" }], [{ label: "Nearby edge", tone: "edge" }], [{ label: "Origin / S3 / app", tone: "store" }]],
      flow: ["User", "Edge POP", "Cache hit or origin fetch"],
      body: "A content delivery network caches static objects at points of presence near users. Versioned asset names avoid stale HTML pointing at missing files. Dynamic HTML usually uses a short TTL. Origin access should stay private; the CDN is the public door."
    },
    {
      title: "Replication",
      layers: [[{ label: "Writes", tone: "warn" }], [{ label: "Primary", tone: "store" }], [{ label: "Replica A", tone: "store" }, { label: "Replica B", tone: "store" }]],
      flow: ["Client write", "Primary", "Async or sync copy", "Replica read"],
      body: "Synchronous replication waits for a standby before acknowledging a write and is used for multi-AZ failover. Asynchronous replicas add read capacity and can lag. Do not treat a classic standby as a read replica unless the product documents that behavior."
    },
    {
      title: "Sharding",
      layers: [[{ label: "Router", tone: "stateless" }], [{ label: "Shard 0", tone: "store" }, { label: "Shard 1", tone: "store" }, { label: "Shard 2", tone: "store" }]],
      flow: ["Key", "Hash or range", "Target shard", "Local query"],
      body: "Sharding partitions data by a key so no single node holds the full working set. A poor key creates a hot shard. Cross-shard queries and transactions are expensive; design access patterns so one request usually hits one shard. Rebalancing is an operational project, not a one-line change."
    },
    {
      title: "Message queues",
      layers: [[{ label: "Producer", tone: "stateless" }], [{ label: "Queue", tone: "store" }], [{ label: "Consumer A" }, { label: "Consumer B" }]],
      flow: ["API accepts write", "Enqueue", "Worker", "Side effect", "Ack"],
      body: "A queue decouples a user-facing write from slow work such as email, transcoding, or fan-out. Delivery is typically at-least-once, so handlers must be idempotent. A dead-letter queue holds poison messages. Visibility timeout must exceed worst-case processing time."
    },
    {
      title: "CAP and consistency",
      flow: ["Write", "Quorum or primary", "Readers see new or old value"],
      body: "A partition forces a choice between remaining available and remaining linearizable. State the consistency the product actually needs: strong for payments, eventual for counts and feeds. Mention read-your-writes for the author of a post. Do not claim CAP as a slogan without naming the failure mode."
    },
    {
      title: "Unique IDs at scale",
      layers: [[{ label: "App" }], [{ label: "Snowflake / UUID / ticket DB", tone: "store" }]],
      flow: ["Time bits", "Worker bits", "Sequence"],
      body: "Auto-increment IDs do not survive many primaries. UUID v4 is simple and does not sort by time. A Snowflake-style ID encodes timestamp, worker, and sequence so feeds can sort approximately by creation time without a central counter."
    },
    {
      title: "Observability",
      flow: ["Request id", "Metrics", "Logs", "Traces", "Alert"],
      body: "Every production design needs RED or USE metrics, structured logs with a request identifier, and traces across service boundaries. Alerts should page a human on user-visible failure, not on every CPU blip. Capacity work starts from measured QPS and latency, not from guesswork."
    }
  ],
  examples: [
    {
      title: "Cache-aside read",
      lang: "flow",
      layers: [[{ label: "Client", tone: "edge" }], [{ label: "App", tone: "stateless" }], [{ label: "Redis", tone: "store" }, { label: "Database", tone: "store" }]],
      flow: ["GET /item/42", "App", "Redis GET", "miss", "SQL", "Redis SET", "Response"],
      desc: "Definition. Cache-aside places lookup logic in the application.\n\nHow it works. The application checks Redis. On a hit it returns immediately. On a miss it loads the row, writes the cache with a TTL, and returns the payload.\n\nConfiguration. Key item:42, TTL 60–300 seconds, and a lock or request coalescing on popular keys.\n\nOperational risk. A flush or expiry storm sends the full read QPS to the database.",
      code: "async function getItem(id) {\n  const key = \"item:\" + id;\n  const hit = await redis.get(key);\n  if (hit) return JSON.parse(hit);\n  const row = await db.item.find(id);\n  await redis.set(key, JSON.stringify(row), \"EX\", 120);\n  return row;\n}"
    },
    {
      title: "Write path with a queue",
      lang: "flow",
      layers: [[{ label: "Client", tone: "edge" }], [{ label: "API", tone: "stateless" }], [{ label: "Queue", tone: "store" }, { label: "Primary DB", tone: "store" }], [{ label: "Workers" }]],
      flow: ["POST /order", "Validate", "Insert order", "Enqueue email", "201 Created"],
      desc: "Definition. The API stores the durable order, then publishes work that may fail independently.\n\nHow it works. The HTTP request returns after the order row exists. A worker sends mail and records the attempt with the order id as an idempotency key.\n\nOperational risk. Enqueuing before the commit can notify the user of an order that rolled back. Commit first, then publish, or use an outbox table.",
      code: "await db.orders.insert({ id, user, total });\nawait queue.send({ type: \"ORDER_MAIL\", orderId: id });\nreturn { status: 201, id };"
    },
    {
      title: "Multi-AZ failover",
      lang: "flow",
      layers: [[{ label: "Route 53 / LB", tone: "edge" }], [{ label: "AZ A app + NAT", tone: "stateless" }, { label: "AZ B app + NAT", tone: "stateless" }], [{ label: "Primary DB", tone: "store" }, { label: "Standby DB", tone: "store" }]],
      flow: ["Health fail", "LB drains AZ A", "Standby promoted", "DNS / endpoint moves"],
      desc: "Definition. High availability requires a second Availability Zone for compute, NAT or endpoints, and the database.\n\nHow it works. The load balancer stops unhealthy targets. Multi-AZ database failover updates the writer endpoint.\n\nOperational risk. A single NAT in AZ A leaves private apps in AZ B without outbound connectivity after a zonal event."
    },
    {
      title: "Horizontal scale-out",
      lang: "flow",
      layers: [[{ label: "Autoscale policy", tone: "warn" }], [{ label: "Load balancer", tone: "stateless" }], [{ label: "n app tasks", tone: "stateless" }]],
      flow: ["CPU or RPS high", "Launch task", "Health pass", "LB adds target"],
      desc: "Definition. Stateless application nodes scale by count, not by enlarging one machine.\n\nHow it works. A launch template defines the image. New tasks register with the target group after a health check.\n\nOperational risk. Sessions stored in process memory break when the instance is replaced. Keep session state in Redis or in a signed token."
    },
    {
      title: "Rate limit at the edge",
      lang: "flow",
      layers: [[{ label: "Client" }], [{ label: "Gateway + limiter", tone: "warn" }], [{ label: "API", tone: "stateless" }]],
      flow: ["Request", "Token bucket", "Allow or 429", "Handler"],
      desc: "Definition. A rate limiter protects downstream capacity using a key such as user id or IP.\n\nHow it works. A token bucket or sliding window in Redis records recent use. Excess traffic receives HTTP 429 with a Retry-After header.\n\nOperational risk. A global limit on a NAT egress IP can block an entire office. Prefer authenticated user or API-key limits.",
      code: "const n = await redis.incr(\"rl:\" + user);\nif (n === 1) await redis.expire(\"rl:\" + user, 60);\nif (n > 100) return { status: 429 };"
    },
    {
      title: "Read replica fan-out",
      lang: "flow",
      layers: [[{ label: "App writes", tone: "warn" }], [{ label: "Primary", tone: "store" }], [{ label: "Replica", tone: "store" }], [{ label: "Reporting app" }]],
      flow: ["Write primary", "Replication stream", "Replica", "Read-only query"],
      desc: "Definition. Reporting queries should not compete with checkout writes on the primary.\n\nHow it works. The application sends writes to the primary and heavy reads to a replica.\n\nOperational risk. A user may not see their own write on a lagging replica. Use the primary for read-your-writes when the product requires it."
    },
    {
      title: "CDN miss then origin",
      lang: "flow",
      layers: [[{ label: "Browser", tone: "edge" }], [{ label: "CDN POP", tone: "edge" }], [{ label: "Origin bucket", tone: "store" }]],
      flow: ["GET /app.8f3.js", "Edge lookup", "Miss", "Origin GET", "Store + serve"],
      desc: "Definition. The first viewer in a region pays the origin fetch; later viewers reuse the edge object.\n\nHow it works. Cache-Control and the object key determine freshness. Hashed filenames can use a long max-age.\n\nOperational risk. A year-long cache on index.html pins users to an old shell that references missing hashed files."
    },
    {
      title: "Idempotent consumer",
      lang: "flow",
      flow: ["Deliver message", "Check processed(id)", "Work", "Mark processed", "Ack"],
      desc: "Definition. At-least-once delivery can present the same message twice.\n\nHow it works. The worker stores the message or business id in a processed table before or with the side effect, inside one transaction where possible.\n\nOperational risk. Charging a card on every receive without a unique key produces duplicate charges."
    }
  ],
  questions: [
    q(1, "beginner", "What is system design?", "Definition. System design is the practice of choosing components and data paths so a product meets stated scale, latency, and reliability goals.\n\nHow it works. You gather requirements, estimate load, draw the request path, and justify each store and queue.\n\nOperational risk. Listing vendor names without a request flow is not a design."),
    q(2, "beginner", "What belongs in functional versus non-functional requirements?", "Definition. Functional requirements describe features. Non-functional requirements describe quality attributes such as p99 latency, availability, and consistency.\n\nHow it works. Write both lists before drawing. A news feed that is available but one hour stale may be acceptable; a payment that is stale is not.\n\nOperational risk. Skipping non-functional requirements leads to a sketch that cannot be challenged."),
    q(3, "beginner", "How do you estimate QPS?", "Definition. QPS is requests per second derived from daily users and actions.\n\nHow it works. Daily writes / 86400, then apply a peak factor of two to five. Separate read QPS from write QPS.\n\nConfiguration. 10 million daily reads ≈ 116 average QPS, about 500 QPS at a 4× peak.\n\nOperational risk. Using only the average hides the peak that actually sizes the fleet."),
    q(4, "beginner", "What does a load balancer do?", "Definition. A load balancer distributes connections across healthy application instances and can terminate TLS.\n\nHow it works. Health checks remove bad targets. Layer 7 routing uses host and path.\n\nOperational risk. Sticky sessions couple users to one instance and fight autoscaling.", { flow: ["Client", "LB", "Healthy app"] }),
    q(5, "beginner", "When do you add a cache?", "Definition. Add a cache when the same read is frequent and the source is slower or more expensive than memory.\n\nHow it works. Measure hit ratio, TTL, and miss penalty.\n\nOperational risk. Caching a user-specific page under a shared key leaks data."),
    q(6, "beginner", "What is a CDN used for?", "Definition. A CDN places copies of mostly static objects near users.\n\nHow it works. Edge caches reduce origin bandwidth and latency.\n\nOperational risk. Putting private API traffic on a public cache without cache-key discipline."),
    q(7, "intermediate", "What is the difference between a replica and a shard?", "Definition. A replica is a copy of the same data. A shard is a slice of different data.\n\nHow it works. Replicas increase read capacity or availability. Shards increase write and storage capacity.\n\nOperational risk. Calling read replicas 'sharding' hides the fact that writes still hit one primary."),
    q(8, "intermediate", "What is cache-aside?", "Definition. The application owns cache population.\n\nHow it works. Read cache, on miss read store, then write cache.\n\nOperational risk. Updating the database without invalidating the key serves stale authorization or prices."),
    q(9, "intermediate", "Why are application servers kept stateless?", "Definition. Stateless nodes store no user session that cannot be reconstructed from a token or an external store.\n\nHow it works. Any healthy instance can handle the next request, which enables rolling deploys and autoscaling.\n\nOperational risk. Local disk session files make failover user-visible."),
    q(10, "intermediate", "What problem does a message queue solve?", "Definition. A queue absorbs spikes and isolates slow side effects from the user request.\n\nHow it works. The API persists the business event, enqueues work, and returns.\n\nOperational risk. A queue without a dead-letter path and an alarm hides poison messages.", { flow: ["API", "Queue", "Worker"] }),
    q(11, "intermediate", "What is a hot shard?", "Definition. A hot shard receives a disproportionate share of keys or traffic.\n\nHow it works. Celebrity keys, time-based keys that all land on today, or a low-cardinality hash create imbalance.\n\nOperational risk. Adding nodes does not help if every write still hashes to the same partition."),
    q(12, "intermediate", "How does consistent hashing help?", "Definition. Consistent hashing maps keys to a ring so that adding a node remaps only a fraction of keys.\n\nHow it works. Virtual nodes spread load more evenly.\n\nOperational risk. Without virtual nodes, a new physical node can still take an unfair slice."),
    q(13, "intermediate", "What is the CAP trade-off you should state?", "Definition. During a network partition, a system cannot be both fully available and strictly consistent.\n\nHow it works. Pick the product rule: reject writes, or accept writes that may conflict.\n\nOperational risk. Claiming both 100 percent availability and linearizability across regions."),
    q(14, "advanced", "How do you generate unique IDs without a single SQL sequence?", "Definition. Use UUID, a ticket server per range, or a Snowflake composition of time, worker, and sequence.\n\nHow it works. Snowflake IDs sort roughly by time and need clock discipline on workers.\n\nOperational risk. Two workers sharing the same worker id will collide.", { flow: ["Timestamp", "Worker id", "Sequence"] }),
    q(15, "advanced", "How do you protect the database from a cache stampede?", "Definition. Many clients miss the same expired key and stampede the store.\n\nHow it works. Use probabilistic early expiry, a per-key lock, or request coalescing.\n\nOperational risk. A TTL aligned to a cron job expires every key at once."),
    q(16, "intermediate", "What should a health check verify?", "Definition. A load-balancer health check should answer whether the instance may receive user traffic.\n\nHow it works. Liveness is process up. Readiness may exclude a deep database ping if that ping would mark the whole fleet down during a brief blip.\n\nOperational risk. Health = SELECT 1 on a strained primary takes the site down with the database."),
    q(17, "beginner", "What is vertical versus horizontal scaling?", "Definition. Vertical scaling enlarges one machine. Horizontal scaling adds machines.\n\nHow it works. Stores often scale vertically first; stateless app tiers scale horizontally behind a balancer.\n\nOperational risk. A single vertical primary remains a failover story you must still design."),
    q(18, "intermediate", "When is eventual consistency acceptable?", "Definition. Eventual consistency is acceptable when readers can tolerate a short delay and the business can reconcile.\n\nHow it works. Like counts, recommendations, and asynchronously built feeds.\n\nOperational risk. Using it for wallet balances without a ledger."),
    q(19, "advanced", "How do you design backpressure?", "Definition. Backpressure slows or rejects intake when downstream capacity is exhausted.\n\nHow it works. Bounded queues, 429 or 503, and load-shed of non-critical work.\n\nOperational risk. An unbounded in-memory queue turns a slow worker into an out-of-memory crash."),
    q(20, "beginner", "What do you measure after launch?", "Definition. Measure request rate, errors, and duration, plus saturation of CPU, memory, and disk.\n\nHow it works. Dashboards and pages must map to a runbook.\n\nOperational risk. Alarms that email everyone train the team to ignore them."),
    q(21, "intermediate", "What is an outbox?", "Definition. An outbox is a table in the same transaction as the business write; a publisher later copies rows to the queue.\n\nHow it works. This avoids 'enqueue succeeded, commit failed'.\n\nOperational risk. Publishing from the request thread without a retry log loses the event on a crash."),
    q(22, "advanced", "How do you choose a shard key?", "Definition. The shard key should spread writes and match the lookup the product actually performs.\n\nHow it works. User id is common. Time-only keys concentrate writes on the newest shard.\n\nOperational risk. Sharding by a field you later need to query globally forces scatter-gather."),
    q(23, "intermediate", "What is a reverse proxy?", "Definition. A reverse proxy accepts client connections and forwards them to internal services.\n\nHow it works. It often terminates TLS, applies WAF rules, and routes by path.\n\nOperational risk. Logging bodies at the proxy can store secrets."),
    q(24, "beginner", "Why draw Multi-AZ on the first sketch?", "Definition. A single zone is one failure domain for power, networking, and many control planes.\n\nHow it works. Place balancer nodes, app tasks, NAT or endpoints, and the database across two or more zones.\n\nOperational risk. Multi-AZ database with compute in one zone still fails the user path.")
  ]
};

const cases = {
  kind: "design",
  notes: [
    {
      title: "URL shortener",
      layers: [[{ label: "Client", tone: "edge" }], [{ label: "LB + API", tone: "stateless" }], [{ label: "Cache", tone: "store" }, { label: "SQL / KV", tone: "store" }]],
      flow: ["POST long URL", "Mint short code", "Store mapping", "302 on GET /code"],
      body: "Requirements: create a short code, redirect on GET, optional expiry and analytics. Writes are far fewer than reads. Encode a unique id in Base62, or generate a random code and retry on collision. Cache the mapping. 301 versus 302 changes whether browsers and CDNs reuse the target. Store the long URL, creator, and created-at. Shard by short code if the table no longer fits."
    },
    {
      title: "Rate limiter service",
      layers: [[{ label: "Gateway", tone: "edge" }], [{ label: "Limiter + Redis", tone: "warn" }], [{ label: "Downstream API", tone: "stateless" }]],
      flow: ["Identify key", "Incr window", "Allow or 429"],
      body: "Place the limiter at the edge so rejected traffic never reaches the application. Redis holds counters or buckets. Document limits per user, per IP, and per endpoint. Return 429 and Retry-After. For distributed enforcement, use a single Redis cluster or a quorum so two gateways cannot both allow a burst."
    },
    {
      title: "News feed",
      layers: [[{ label: "Post API" }], [{ label: "Fan-out queue", tone: "store" }], [{ label: "Per-user timeline cache", tone: "store" }], [{ label: "Read API" }]],
      flow: ["Publish", "Fan-out to followers", "Write timelines", "GET /feed"],
      body: "Fan-out on write precomputes timelines for active followers and is fast to read. Fan-out on read pulls recent posts from followees at read time and is cheaper when a user has huge followings. Hybrid designs precompute for ordinary accounts and skip celebrities. Rank with recency plus signals. Cache the first page."
    },
    {
      title: "Chat / messaging",
      layers: [[{ label: "WebSocket gateway", tone: "edge" }], [{ label: "Chat service", tone: "stateless" }], [{ label: "Message store", tone: "store" }, { label: "Presence cache", tone: "store" }]],
      flow: ["Connect", "Auth", "Subscribe inbox", "Persist", "Push to sockets"],
      body: "Presence and typing are ephemeral; messages are durable. Persist first, then deliver, so a crash does not drop history. Group chat fans out to members through a queue. Unread counts live in a cache with a periodic reconcile. Order messages with a per-conversation sequence, not only client clocks."
    },
    {
      title: "Notification system",
      layers: [[{ label: "Event" }], [{ label: "Notification service" }], [{ label: "Queue per channel", tone: "store" }], [{ label: "Email" }, { label: "Push" }, { label: "SMS" }]],
      flow: ["Domain event", "Template", "Enqueue channel", "Provider", "Receipt"],
      body: "Notifications are asynchronous side effects. Prefer a queue per channel so a slow SMS vendor does not block email. Store delivery status. Honor user preferences and quiet hours before enqueue. Idempotency keys prevent duplicate blasts after retries."
    },
    {
      title: "Video streaming (lite)",
      layers: [[{ label: "Upload API" }], [{ label: "Object store", tone: "store" }], [{ label: "Transcode workers" }], [{ label: "CDN", tone: "edge" }]],
      flow: ["Upload", "Store original", "HLS transcode", "CDN", "Player"],
      body: "Clients upload to object storage via a short-lived signed URL. Workers produce adaptive bit-rate renditions. The player requests a manifest from the CDN. Metadata (title, owner, visibility) stays in a database. Do not stream bytes through the application tier."
    },
    {
      title: "Ride matching (lite)",
      layers: [[{ label: "Rider / driver apps", tone: "edge" }], [{ label: "Matching service" }], [{ label: "Geo index", tone: "store" }, { label: "Trip DB", tone: "store" }]],
      flow: ["Trip request", "Nearby drivers", "Offer", "Accept", "Track"],
      body: "Drivers publish location into a geo index (geohash plus Redis or a specialized store). Matching queries nearby available drivers, offers the trip, and writes a trip record. Location updates after accept are a high-QPS stream; they should not lock the trip row on every ping."
    },
    {
      title: "Search autocomplete",
      layers: [[{ label: "Client" }], [{ label: "Suggest API", tone: "stateless" }], [{ label: "Trie / prefix index", tone: "store" }]],
      flow: ["Keystroke", "Prefix query", "Top-K", "Response < 50 ms"],
      body: "Autocomplete is a prefix read with a tight latency budget. A trie, a sorted set per prefix, or an edge search cluster can serve it. Limit results, cache popular prefixes, and debounce the client. Personalization is a second-stage rerank, not the first disk seek."
    },
    {
      title: "File storage (Dropbox lite)",
      layers: [[{ label: "Client" }], [{ label: "Metadata API" }], [{ label: "Block store / S3", tone: "store" }, { label: "Metadata DB", tone: "store" }]],
      flow: ["Chunk file", "Upload new blocks", "Commit metadata", "Notify devices"],
      body: "Split files into blocks and store them in object storage addressed by content hash. The database stores folder trees, versions, and which blocks belong to a file. Sync notifies other devices. Deduplication falls out of content-addressed blocks. Never write file bytes through a stateful app disk."
    },
    {
      title: "Web crawler",
      layers: [[{ label: "URL frontier", tone: "store" }], [{ label: "Fetcher" }], [{ label: "Parser" }], [{ label: "Index + seen set", tone: "store" }]],
      flow: ["Dequeue URL", "Polite fetch", "Extract links", "Enqueue new", "Index"],
      body: "Respect robots.txt and per-host politeness. The frontier is a prioritized queue. A seen set (Bloom filter plus disk) avoids refetch loops. Separate fetch from parse so a slow parser does not stall sockets. Store raw and extracted documents independently."
    },
    {
      title: "Ticket / seat booking",
      layers: [[{ label: "Browse inventory" }], [{ label: "Hold seats", tone: "warn" }], [{ label: "Pay" }], [{ label: "Confirm", tone: "store" }]],
      flow: ["Select seats", "Hold TTL", "Payment", "Commit or release"],
      body: "Seats are scarce. A hold record with a TTL reserves inventory without charging yet. Payment success converts the hold to a confirmed ticket in one transaction or via a compare-and-set on seat state. Two users must not confirm the same seat. Expired holds return to inventory through a sweeper."
    },
    {
      title: "Pastebin / snippet host",
      layers: [[{ label: "Write API" }], [{ label: "Object or DB", tone: "store" }], [{ label: "CDN for public pastes", tone: "edge" }]],
      flow: ["POST body", "Mint id", "Store", "GET /id"],
      body: "Similar to a shortener with a larger payload. Small pastes can live in the database; large pastes belong in object storage. Optional expiry is a lifecycle rule. Public pastes are CDN-friendly. Private pastes need authorization on every GET and must not be cached as public."
    }
  ],
  examples: [
    {
      title: "URL shortener — write and redirect",
      lang: "flow",
      layers: [[{ label: "Client", tone: "edge" }], [{ label: "API", tone: "stateless" }], [{ label: "Redis", tone: "store" }, { label: "Mappings table", tone: "store" }]],
      flow: ["POST /links", "Allocate id", "Base62", "INSERT", "GET /s/:code", "Cache", "302 Location"],
      desc: "Definition. One service mints a compact code and later issues an HTTP redirect.\n\nHow it works. Writes insert id, code, and long URL. Reads check Redis, then the table, then cache the mapping.\n\nConfiguration. Base62 of a 64-bit id yields short codes. 302 keeps analytics on your host; 301 lets browsers skip you.\n\nOperational risk. Sequential ids leak creation volume. Add a permutation or randomness if that is a concern.",
      code: "app.post(\"/links\", async (req, res) => {\n  const id = await ids.next();\n  const code = toBase62(id);\n  await db.links.insert({ id, code, url: req.body.url });\n  res.status(201).json({ code, href: \"https://s.example/\" + code });\n});\n\napp.get(\"/s/:code\", async (req, res) => {\n  const url = await cache.get(req.params.code) || (await db.links.find(req.params.code)).url;\n  res.redirect(302, url);\n});"
    },
    {
      title: "News feed — fan-out on write",
      lang: "flow",
      layers: [[{ label: "Poster" }], [{ label: "Post service" }], [{ label: "Fan-out workers" }], [{ label: "Timeline Redis", tone: "store" }]],
      flow: ["Create post", "Store post", "List followers", "Push post id", "GET /feed reads cache"],
      desc: "Definition. Each follower timeline is a list of post ids updated when someone they follow publishes.\n\nHow it works. Celebrity accounts skip precompute and are merged at read time.\n\nOperational risk. Synchronous fan-out inside the publish request times out for large follower sets. Always enqueue."
    },
    {
      title: "Chat — persist then push",
      lang: "flow",
      layers: [[{ label: "Sender socket", tone: "edge" }], [{ label: "Chat API" }], [{ label: "Messages DB", tone: "store" }], [{ label: "Recipient sockets", tone: "edge" }]],
      flow: ["send", "authz", "insert message", "increment seq", "push frames"],
      desc: "Definition. Durability precedes delivery.\n\nHow it works. The row commit is the source of truth. Socket push is best-effort; clients also poll or resume from last sequence.\n\nOperational risk. Pushing before commit drops the message if the process dies after the frame."
    },
    {
      title: "Rate limiter — sliding window",
      lang: "flow",
      flow: ["Extract user", "ZADD timestamp", "ZREMRANGEBYSCORE old", "ZCARD", "Allow if < N"],
      desc: "Definition. A sliding window counts events inside the last N seconds rather than a fixed clock bucket.\n\nHow it works. Redis sorted sets store timestamps. Excess requests receive 429.\n\nOperational risk. An unauthenticated limit keyed only on IP punishes shared egress.",
      code: "async function allow(user, limit, windowSec) {\n  const key = \"rl:\" + user;\n  const now = Date.now();\n  await redis.zadd(key, now, String(now));\n  await redis.zremrangebyscore(key, 0, now - windowSec * 1000);\n  const n = await redis.zcard(key);\n  await redis.expire(key, windowSec);\n  return n <= limit;\n}"
    },
    {
      title: "Video — upload to play",
      lang: "flow",
      layers: [[{ label: "Creator" }], [{ label: "Signed PUT", tone: "edge" }], [{ label: "Object store", tone: "store" }], [{ label: "Transcoder" }], [{ label: "CDN + player", tone: "edge" }]],
      flow: ["Ask upload URL", "PUT bytes", "Enqueue job", "Write renditions", "Publish ready"],
      desc: "Definition. The API never sees the file bytes after minting a signed URL.\n\nHow it works. Completion of transcode flips visibility from processing to public.\n\nOperational risk. Serving the original upload from the API host will not scale and will exhaust disks."
    },
    {
      title: "Booking — hold then pay",
      lang: "flow",
      layers: [[{ label: "Seat map" }], [{ label: "Hold table", tone: "warn" }], [{ label: "Payments" }], [{ label: "Tickets", tone: "store" }]],
      flow: ["Choose seats", "INSERT hold TTL", "Pay", "CAS seat → sold", "Ticket"],
      desc: "Definition. Inventory moves through reserved then sold, never directly from open to sold without a hold in contended markets.\n\nHow it works. A sweeper deletes expired holds. Confirm uses a conditional update so a late pay cannot overwrite a sold seat.\n\nOperational risk. Checking availability in memory without a unique constraint allows double booking."
    },
    {
      title: "Autocomplete — prefix read",
      lang: "flow",
      layers: [[{ label: "Search box", tone: "edge" }], [{ label: "Suggest API" }], [{ label: "Prefix index", tone: "store" }]],
      flow: ["type 'sys'", "debounce 30–50 ms", "top 8", "render"],
      desc: "Definition. Each keystroke is a tiny, cacheable prefix query.\n\nHow it works. Store top completions per prefix offline. Serve from memory.\n\nOperational risk. Hitting the primary document index on every keystroke exceeds the latency budget."
    },
    {
      title: "Notifications — channel queues",
      lang: "flow",
      layers: [[{ label: "OrderPaid event" }], [{ label: "Notifier" }], [{ label: "email-q", tone: "store" }, { label: "push-q", tone: "store" }]],
      flow: ["Prefer check", "Render template", "Enqueue", "Provider ack"],
      desc: "Definition. One domain event may produce several deliveries.\n\nHow it works. Preferences are applied before enqueue. Each channel retries independently.\n\nOperational risk. A single shared queue lets one failing SMS vendor delay every email."
    },
    {
      title: "Snowflake ID composition",
      lang: "flow",
      flow: ["41-bit time", "10-bit worker", "12-bit sequence"],
      desc: "Definition. A 64-bit id that sorts by time without a global lock.\n\nHow it works. Each worker increments a sequence every millisecond and resets on the next millisecond.\n\nOperational risk. Backward clock jumps require a wait or a refusal; do not emit duplicates.",
      code: "function nextId(worker) {\n  const time = Date.now() - 1700000000000n;\n  const seq = worker.seq = (worker.last === time ? worker.seq + 1n : 0n);\n  worker.last = time;\n  return (time << 22n) | (BigInt(worker.id) << 12n) | seq;\n}"
    },
    {
      title: "Ride match — nearby search",
      lang: "flow",
      layers: [[{ label: "Rider" }], [{ label: "Match API" }], [{ label: "Geo hash index", tone: "store" }], [{ label: "Candidate drivers" }]],
      flow: ["Request trip", "Geohash neighbors", "Rank ETA", "Offer", "Accept"],
      desc: "Definition. Matching is a geo query plus a short offer workflow, not a global scan of all drivers.\n\nHow it works. Update driver points on a timer. Query neighboring geohash cells.\n\nOperational risk. Writing every GPS ping into a relational trip row will not hold city-scale QPS."
    },
    {
      title: "File sync — chunk commit",
      lang: "flow",
      flow: ["Hash chunks", "PUT missing blocks", "Commit file version", "Notify peers"],
      desc: "Definition. Metadata commit is atomic; block upload is incremental.\n\nHow it works. Only unseen hashes are uploaded. A version row points at an ordered list of hashes.\n\nOperational risk. Committing metadata before blocks finish leaves readers with missing objects."
    },
    {
      title: "Crawler — polite fetch",
      lang: "flow",
      flow: ["Per-host delay", "GET", "Parse", "Filter seen", "Enqueue"],
      desc: "Definition. Throughput is limited by politeness, not by how many sockets you can open.\n\nHow it works. A per-host token bucket sits in front of the fetcher.\n\nOperational risk. A single global queue without host affinity stampedes one origin."
    }
  ],
  questions: [
    q(1, "beginner", "How do you design a URL shortener?", "Definition. Persist a mapping from a short code to a long URL and redirect on GET.\n\nHow it works. Mint codes with a unique id encoder or a random token. Cache reads. Store creator and timestamps if analytics matter.\n\nOperational risk. Using 301 everywhere hides later changes and undercounts redirects if you need them.", { flow: ["POST url", "code", "GET /code", "302"], layers: [[{ label: "API" }], [{ label: "Cache", tone: "store" }, { label: "DB", tone: "store" }]] }),
    q(2, "intermediate", "How do you avoid collisions in short codes?", "Definition. Collisions occur when two writes choose the same code.\n\nHow it works. A unique constraint plus retry, or a monotonic id that cannot collide.\n\nOperational risk. Checking existence then inserting without a constraint still races."),
    q(3, "beginner", "How do you design a rate limiter?", "Definition. Count actions per key per window and reject the excess.\n\nHow it works. Token bucket or sliding window in Redis, enforced at the gateway.\n\nOperational risk. In-memory limits per node allow N times the budget across N nodes.", { flow: ["Key", "Redis", "Allow / 429"] }),
    q(4, "intermediate", "Fan-out on write versus fan-out on read for a feed?", "Definition. Write-time fan-out updates follower timelines when a post is created. Read-time fan-out gathers followee posts when the feed is opened.\n\nHow it works. Hybrid: precompute for typical users, skip users with huge fan-out.\n\nOperational risk. Doing celebrity fan-out synchronously in the publish API."),
    q(5, "intermediate", "How do you design 1:1 chat?", "Definition. Authenticated sockets, durable messages, per-conversation sequence.\n\nHow it works. Persist, increment sequence, push to online sockets, let others catch up from last-seen.\n\nOperational risk. Trusting client timestamps for order."),
    q(6, "advanced", "How do you design group chat at millions of members?", "Definition. Do not open a socket write to every member in the request path.\n\nHow it works. Persist once, enqueue fan-out, batch push, and let offline members load history.\n\nOperational risk. A single chat process holding every member connection."),
    q(7, "intermediate", "How do you design notifications?", "Definition. Convert domain events into channel-specific deliveries with preferences.\n\nHow it works. Queue per channel, store receipts, retry with backoff.\n\nOperational risk. Sending before checking quiet hours or unsubscribe."),
    q(8, "advanced", "How do you design YouTube-style playback?", "Definition. Separate metadata, object storage, transcode, and CDN delivery.\n\nHow it works. Signed upload, asynchronous renditions, HLS/DASH via CDN.\n\nOperational risk. Transcoding in the upload HTTP request."),
    q(9, "advanced", "How do you match riders and drivers?", "Definition. Geo index of available drivers plus an offer state machine.\n\nHow it works. Geohash neighbors, rank by ETA, exclusive accept.\n\nOperational risk. Two riders receiving the same driver because accept is not exclusive."),
    q(10, "intermediate", "How do you design autocomplete?", "Definition. Prefix → top-K query with a memory-resident index.\n\nHow it works. Offline job builds suggestions; API only reads.\n\nOperational risk. Querying the full-text document store per keystroke."),
    q(11, "advanced", "How do you design Dropbox-like sync?", "Definition. Content-addressed blocks plus a metadata tree of versions.\n\nHow it works. Upload missing hashes, then atomically commit a new file version.\n\nOperational risk. Storing whole files as single blobs on the API host."),
    q(12, "intermediate", "How do you design a web crawler?", "Definition. Frontier, polite fetcher, parser, seen set, index.\n\nHow it works. Per-host delays, robots.txt, and incremental frontier growth.\n\nOperational risk. Unbounded in-memory seen set."),
    q(13, "advanced", "How do you avoid double booking seats?", "Definition. Treat each seat as a row with states open, held, sold.\n\nHow it works. Conditional updates and a unique sold record. Holds expire.\n\nOperational risk. Read-check-write without a constraint."),
    q(14, "beginner", "How is pastebin different from a shortener?", "Definition. The value is a document, not only a URL.\n\nHow it works. Small bodies in a table; large bodies in object storage. Auth on private pastes.\n\nOperational risk. Caching a private paste on a public CDN."),
    q(15, "intermediate", "Where do you store sessions for a chat gateway farm?", "Definition. Connection ownership must be discoverable so a message can reach the right node.\n\nHow it works. Presence map user → gateway id in Redis; gateways subscribe to their inbox.\n\nOperational risk. Broadcasting every message to every gateway."),
    q(16, "advanced", "How do you count views without melting the database?", "Definition. Buffer increments in memory or a stream, then flush aggregates.\n\nHow it works. Per-cache counters with periodic persist, or Kafka + worker.\n\nOperational risk. UPDATE views = views + 1 on every play."),
    q(17, "intermediate", "What API would you expose for a shortener?", "Definition. POST /links { url } returns code. GET /{code} redirects. Optional GET /links/:code/stats.\n\nHow it works. Auth on write if the product is not anonymous.\n\nOperational risk. An unbounded custom alias namespace that collides with routes."),
    q(18, "beginner", "Which numbers do you compute for a feed?", "Definition. Daily posters, posts per user, followers per user, read QPS of feed pages, and cache hit ratio.\n\nHow it works. Fan-out volume ≈ posts × average followers at peak.\n\nOperational risk. Sizing only for average hour."),
    q(19, "advanced", "How do you expire stories or snaps?", "Definition. Visibility is a query filter plus a lifecycle delete.\n\nHow it works. Store expires_at. Reads hide expired rows. A sweeper or object lifecycle removes bytes.\n\nOperational risk. Believing a TTL cache is the only delete; the durable copy remains."),
    q(20, "intermediate", "How do you design search for posts?", "Definition. An inverted index separate from the primary store.\n\nHow it works. Async indexer consumes post events. Query service hits the index, then hydrates from cache or DB.\n\nOperational risk. LIKE %term% on the primary table at feed scale."),
    q(21, "advanced", "How do you handle a celebrity post?", "Definition. Do not write the post into millions of timelines synchronously.\n\nHow it works. Store the post once. Merge celebrity posts at read time with the precomputed timeline.\n\nOperational risk. Queue explosion from write-time fan-out to 80 million followers."),
    q(22, "beginner", "What failures must a booking design name?", "Definition. Payment succeeds after hold expiry, payment fails after hold, sweeper races confirm.\n\nHow it works. State machine plus conditional writes cover each case.\n\nOperational risk. Refunds without a ledger of seat state transitions."),
    q(23, "intermediate", "How do you keep chat history consistent for a late joiner?", "Definition. History is loaded from the durable store, not from other clients.\n\nHow it works. Client sends last_seq; server returns the gap.\n\nOperational risk. Relying on in-memory gateway buffers as history."),
    q(24, "advanced", "What would you monitor on a shortener?", "Definition. Redirect QPS, p99 redirect latency, cache hit ratio, 404 rate, write errors, and origin DB CPU.\n\nHow it works. Alert on hit-ratio collapse and on 5xx, not only on CPU.\n\nOperational risk. A cache flush that is invisible until the database pages.")
  ]
};

dump("sys-blocks", blocks);
dump("sys-cases", cases);
console.log("wrote sys-blocks", blocks.notes.length, "notes", blocks.examples.length, "flows", blocks.questions.length, "qs");
console.log("wrote sys-cases", cases.notes.length, "notes", cases.examples.length, "flows", cases.questions.length, "qs");
