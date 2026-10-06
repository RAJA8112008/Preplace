window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["sys-cases"] = {
  "kind": "design",
  "notes": [
    {
      "title": "URL shortener",
      "layers": [
        [
          {
            "label": "Client",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "LB + API",
            "tone": "stateless"
          }
        ],
        [
          {
            "label": "Cache",
            "tone": "store"
          },
          {
            "label": "SQL / KV",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "POST long URL",
        "Mint short code",
        "Store mapping",
        "302 on GET /code"
      ],
      "body": "Requirements: create a short code, redirect on GET, optional expiry and analytics. Writes are far fewer than reads. Encode a unique id in Base62, or generate a random code and retry on collision. Cache the mapping. 301 versus 302 changes whether browsers and CDNs reuse the target. Store the long URL, creator, and created-at. Shard by short code if the table no longer fits."
    },
    {
      "title": "Rate limiter service",
      "layers": [
        [
          {
            "label": "Gateway",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "Limiter + Redis",
            "tone": "warn"
          }
        ],
        [
          {
            "label": "Downstream API",
            "tone": "stateless"
          }
        ]
      ],
      "flow": [
        "Identify key",
        "Incr window",
        "Allow or 429"
      ],
      "body": "Place the limiter at the edge so rejected traffic never reaches the application. Redis holds counters or buckets. Document limits per user, per IP, and per endpoint. Return 429 and Retry-After. For distributed enforcement, use a single Redis cluster or a quorum so two gateways cannot both allow a burst."
    },
    {
      "title": "News feed",
      "layers": [
        [
          {
            "label": "Post API"
          }
        ],
        [
          {
            "label": "Fan-out queue",
            "tone": "store"
          }
        ],
        [
          {
            "label": "Per-user timeline cache",
            "tone": "store"
          }
        ],
        [
          {
            "label": "Read API"
          }
        ]
      ],
      "flow": [
        "Publish",
        "Fan-out to followers",
        "Write timelines",
        "GET /feed"
      ],
      "body": "Fan-out on write precomputes timelines for active followers and is fast to read. Fan-out on read pulls recent posts from followees at read time and is cheaper when a user has huge followings. Hybrid designs precompute for ordinary accounts and skip celebrities. Rank with recency plus signals. Cache the first page."
    },
    {
      "title": "Chat / messaging",
      "layers": [
        [
          {
            "label": "WebSocket gateway",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "Chat service",
            "tone": "stateless"
          }
        ],
        [
          {
            "label": "Message store",
            "tone": "store"
          },
          {
            "label": "Presence cache",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Connect",
        "Auth",
        "Subscribe inbox",
        "Persist",
        "Push to sockets"
      ],
      "body": "Presence and typing are ephemeral; messages are durable. Persist first, then deliver, so a crash does not drop history. Group chat fans out to members through a queue. Unread counts live in a cache with a periodic reconcile. Order messages with a per-conversation sequence, not only client clocks."
    },
    {
      "title": "Notification system",
      "layers": [
        [
          {
            "label": "Event"
          }
        ],
        [
          {
            "label": "Notification service"
          }
        ],
        [
          {
            "label": "Queue per channel",
            "tone": "store"
          }
        ],
        [
          {
            "label": "Email"
          },
          {
            "label": "Push"
          },
          {
            "label": "SMS"
          }
        ]
      ],
      "flow": [
        "Domain event",
        "Template",
        "Enqueue channel",
        "Provider",
        "Receipt"
      ],
      "body": "Notifications are asynchronous side effects. Prefer a queue per channel so a slow SMS vendor does not block email. Store delivery status. Honor user preferences and quiet hours before enqueue. Idempotency keys prevent duplicate blasts after retries."
    },
    {
      "title": "Video streaming (lite)",
      "layers": [
        [
          {
            "label": "Upload API"
          }
        ],
        [
          {
            "label": "Object store",
            "tone": "store"
          }
        ],
        [
          {
            "label": "Transcode workers"
          }
        ],
        [
          {
            "label": "CDN",
            "tone": "edge"
          }
        ]
      ],
      "flow": [
        "Upload",
        "Store original",
        "HLS transcode",
        "CDN",
        "Player"
      ],
      "body": "Clients upload to object storage via a short-lived signed URL. Workers produce adaptive bit-rate renditions. The player requests a manifest from the CDN. Metadata (title, owner, visibility) stays in a database. Do not stream bytes through the application tier."
    },
    {
      "title": "Ride matching (lite)",
      "layers": [
        [
          {
            "label": "Rider / driver apps",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "Matching service"
          }
        ],
        [
          {
            "label": "Geo index",
            "tone": "store"
          },
          {
            "label": "Trip DB",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Trip request",
        "Nearby drivers",
        "Offer",
        "Accept",
        "Track"
      ],
      "body": "Drivers publish location into a geo index (geohash plus Redis or a specialized store). Matching queries nearby available drivers, offers the trip, and writes a trip record. Location updates after accept are a high-QPS stream; they should not lock the trip row on every ping."
    },
    {
      "title": "Search autocomplete",
      "layers": [
        [
          {
            "label": "Client"
          }
        ],
        [
          {
            "label": "Suggest API",
            "tone": "stateless"
          }
        ],
        [
          {
            "label": "Trie / prefix index",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Keystroke",
        "Prefix query",
        "Top-K",
        "Response < 50 ms"
      ],
      "body": "Autocomplete is a prefix read with a tight latency budget. A trie, a sorted set per prefix, or an edge search cluster can serve it. Limit results, cache popular prefixes, and debounce the client. Personalization is a second-stage rerank, not the first disk seek."
    },
    {
      "title": "File storage (Dropbox lite)",
      "layers": [
        [
          {
            "label": "Client"
          }
        ],
        [
          {
            "label": "Metadata API"
          }
        ],
        [
          {
            "label": "Block store / S3",
            "tone": "store"
          },
          {
            "label": "Metadata DB",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Chunk file",
        "Upload new blocks",
        "Commit metadata",
        "Notify devices"
      ],
      "body": "Split files into blocks and store them in object storage addressed by content hash. The database stores folder trees, versions, and which blocks belong to a file. Sync notifies other devices. Deduplication falls out of content-addressed blocks. Never write file bytes through a stateful app disk."
    },
    {
      "title": "Web crawler",
      "layers": [
        [
          {
            "label": "URL frontier",
            "tone": "store"
          }
        ],
        [
          {
            "label": "Fetcher"
          }
        ],
        [
          {
            "label": "Parser"
          }
        ],
        [
          {
            "label": "Index + seen set",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Dequeue URL",
        "Polite fetch",
        "Extract links",
        "Enqueue new",
        "Index"
      ],
      "body": "Respect robots.txt and per-host politeness. The frontier is a prioritized queue. A seen set (Bloom filter plus disk) avoids refetch loops. Separate fetch from parse so a slow parser does not stall sockets. Store raw and extracted documents independently."
    },
    {
      "title": "Ticket / seat booking",
      "layers": [
        [
          {
            "label": "Browse inventory"
          }
        ],
        [
          {
            "label": "Hold seats",
            "tone": "warn"
          }
        ],
        [
          {
            "label": "Pay"
          }
        ],
        [
          {
            "label": "Confirm",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Select seats",
        "Hold TTL",
        "Payment",
        "Commit or release"
      ],
      "body": "Seats are scarce. A hold record with a TTL reserves inventory without charging yet. Payment success converts the hold to a confirmed ticket in one transaction or via a compare-and-set on seat state. Two users must not confirm the same seat. Expired holds return to inventory through a sweeper."
    },
    {
      "title": "Pastebin / snippet host",
      "layers": [
        [
          {
            "label": "Write API"
          }
        ],
        [
          {
            "label": "Object or DB",
            "tone": "store"
          }
        ],
        [
          {
            "label": "CDN for public pastes",
            "tone": "edge"
          }
        ]
      ],
      "flow": [
        "POST body",
        "Mint id",
        "Store",
        "GET /id"
      ],
      "body": "Similar to a shortener with a larger payload. Small pastes can live in the database; large pastes belong in object storage. Optional expiry is a lifecycle rule. Public pastes are CDN-friendly. Private pastes need authorization on every GET and must not be cached as public."
    }
  ],
  "examples": [
    {
      "title": "URL shortener — write and redirect",
      "lang": "flow",
      "layers": [
        [
          {
            "label": "Client",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "API",
            "tone": "stateless"
          }
        ],
        [
          {
            "label": "Redis",
            "tone": "store"
          },
          {
            "label": "Mappings table",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "POST /links",
        "Allocate id",
        "Base62",
        "INSERT",
        "GET /s/:code",
        "Cache",
        "302 Location"
      ],
      "desc": "Definition. One service mints a compact code and later issues an HTTP redirect.\n\nHow it works. Writes insert id, code, and long URL. Reads check Redis, then the table, then cache the mapping.\n\nConfiguration. Base62 of a 64-bit id yields short codes. 302 keeps analytics on your host; 301 lets browsers skip you.\n\nOperational risk. Sequential ids leak creation volume. Add a permutation or randomness if that is a concern.",
      "code": "app.post(\"/links\", async (req, res) => {\n  const id = await ids.next();\n  const code = toBase62(id);\n  await db.links.insert({ id, code, url: req.body.url });\n  res.status(201).json({ code, href: \"https://s.example/\" + code });\n});\n\napp.get(\"/s/:code\", async (req, res) => {\n  const url = await cache.get(req.params.code) || (await db.links.find(req.params.code)).url;\n  res.redirect(302, url);\n});"
    },
    {
      "title": "News feed — fan-out on write",
      "lang": "flow",
      "layers": [
        [
          {
            "label": "Poster"
          }
        ],
        [
          {
            "label": "Post service"
          }
        ],
        [
          {
            "label": "Fan-out workers"
          }
        ],
        [
          {
            "label": "Timeline Redis",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Create post",
        "Store post",
        "List followers",
        "Push post id",
        "GET /feed reads cache"
      ],
      "desc": "Definition. Each follower timeline is a list of post ids updated when someone they follow publishes.\n\nHow it works. Celebrity accounts skip precompute and are merged at read time.\n\nOperational risk. Synchronous fan-out inside the publish request times out for large follower sets. Always enqueue."
    },
    {
      "title": "Chat — persist then push",
      "lang": "flow",
      "layers": [
        [
          {
            "label": "Sender socket",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "Chat API"
          }
        ],
        [
          {
            "label": "Messages DB",
            "tone": "store"
          }
        ],
        [
          {
            "label": "Recipient sockets",
            "tone": "edge"
          }
        ]
      ],
      "flow": [
        "send",
        "authz",
        "insert message",
        "increment seq",
        "push frames"
      ],
      "desc": "Definition. Durability precedes delivery.\n\nHow it works. The row commit is the source of truth. Socket push is best-effort; clients also poll or resume from last sequence.\n\nOperational risk. Pushing before commit drops the message if the process dies after the frame."
    },
    {
      "title": "Rate limiter — sliding window",
      "lang": "flow",
      "flow": [
        "Extract user",
        "ZADD timestamp",
        "ZREMRANGEBYSCORE old",
        "ZCARD",
        "Allow if < N"
      ],
      "desc": "Definition. A sliding window counts events inside the last N seconds rather than a fixed clock bucket.\n\nHow it works. Redis sorted sets store timestamps. Excess requests receive 429.\n\nOperational risk. An unauthenticated limit keyed only on IP punishes shared egress.",
      "code": "async function allow(user, limit, windowSec) {\n  const key = \"rl:\" + user;\n  const now = Date.now();\n  await redis.zadd(key, now, String(now));\n  await redis.zremrangebyscore(key, 0, now - windowSec * 1000);\n  const n = await redis.zcard(key);\n  await redis.expire(key, windowSec);\n  return n <= limit;\n}"
    },
    {
      "title": "Video — upload to play",
      "lang": "flow",
      "layers": [
        [
          {
            "label": "Creator"
          }
        ],
        [
          {
            "label": "Signed PUT",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "Object store",
            "tone": "store"
          }
        ],
        [
          {
            "label": "Transcoder"
          }
        ],
        [
          {
            "label": "CDN + player",
            "tone": "edge"
          }
        ]
      ],
      "flow": [
        "Ask upload URL",
        "PUT bytes",
        "Enqueue job",
        "Write renditions",
        "Publish ready"
      ],
      "desc": "Definition. The API never sees the file bytes after minting a signed URL.\n\nHow it works. Completion of transcode flips visibility from processing to public.\n\nOperational risk. Serving the original upload from the API host will not scale and will exhaust disks."
    },
    {
      "title": "Booking — hold then pay",
      "lang": "flow",
      "layers": [
        [
          {
            "label": "Seat map"
          }
        ],
        [
          {
            "label": "Hold table",
            "tone": "warn"
          }
        ],
        [
          {
            "label": "Payments"
          }
        ],
        [
          {
            "label": "Tickets",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Choose seats",
        "INSERT hold TTL",
        "Pay",
        "CAS seat → sold",
        "Ticket"
      ],
      "desc": "Definition. Inventory moves through reserved then sold, never directly from open to sold without a hold in contended markets.\n\nHow it works. A sweeper deletes expired holds. Confirm uses a conditional update so a late pay cannot overwrite a sold seat.\n\nOperational risk. Checking availability in memory without a unique constraint allows double booking."
    },
    {
      "title": "Autocomplete — prefix read",
      "lang": "flow",
      "layers": [
        [
          {
            "label": "Search box",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "Suggest API"
          }
        ],
        [
          {
            "label": "Prefix index",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "type 'sys'",
        "debounce 30–50 ms",
        "top 8",
        "render"
      ],
      "desc": "Definition. Each keystroke is a tiny, cacheable prefix query.\n\nHow it works. Store top completions per prefix offline. Serve from memory.\n\nOperational risk. Hitting the primary document index on every keystroke exceeds the latency budget."
    },
    {
      "title": "Notifications — channel queues",
      "lang": "flow",
      "layers": [
        [
          {
            "label": "OrderPaid event"
          }
        ],
        [
          {
            "label": "Notifier"
          }
        ],
        [
          {
            "label": "email-q",
            "tone": "store"
          },
          {
            "label": "push-q",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Prefer check",
        "Render template",
        "Enqueue",
        "Provider ack"
      ],
      "desc": "Definition. One domain event may produce several deliveries.\n\nHow it works. Preferences are applied before enqueue. Each channel retries independently.\n\nOperational risk. A single shared queue lets one failing SMS vendor delay every email."
    },
    {
      "title": "Snowflake ID composition",
      "lang": "flow",
      "flow": [
        "41-bit time",
        "10-bit worker",
        "12-bit sequence"
      ],
      "desc": "Definition. A 64-bit id that sorts by time without a global lock.\n\nHow it works. Each worker increments a sequence every millisecond and resets on the next millisecond.\n\nOperational risk. Backward clock jumps require a wait or a refusal; do not emit duplicates.",
      "code": "function nextId(worker) {\n  const time = Date.now() - 1700000000000n;\n  const seq = worker.seq = (worker.last === time ? worker.seq + 1n : 0n);\n  worker.last = time;\n  return (time << 22n) | (BigInt(worker.id) << 12n) | seq;\n}"
    },
    {
      "title": "Ride match — nearby search",
      "lang": "flow",
      "layers": [
        [
          {
            "label": "Rider"
          }
        ],
        [
          {
            "label": "Match API"
          }
        ],
        [
          {
            "label": "Geo hash index",
            "tone": "store"
          }
        ],
        [
          {
            "label": "Candidate drivers"
          }
        ]
      ],
      "flow": [
        "Request trip",
        "Geohash neighbors",
        "Rank ETA",
        "Offer",
        "Accept"
      ],
      "desc": "Definition. Matching is a geo query plus a short offer workflow, not a global scan of all drivers.\n\nHow it works. Update driver points on a timer. Query neighboring geohash cells.\n\nOperational risk. Writing every GPS ping into a relational trip row will not hold city-scale QPS."
    },
    {
      "title": "File sync — chunk commit",
      "lang": "flow",
      "flow": [
        "Hash chunks",
        "PUT missing blocks",
        "Commit file version",
        "Notify peers"
      ],
      "desc": "Definition. Metadata commit is atomic; block upload is incremental.\n\nHow it works. Only unseen hashes are uploaded. A version row points at an ordered list of hashes.\n\nOperational risk. Committing metadata before blocks finish leaves readers with missing objects."
    },
    {
      "title": "Crawler — polite fetch",
      "lang": "flow",
      "flow": [
        "Per-host delay",
        "GET",
        "Parse",
        "Filter seen",
        "Enqueue"
      ],
      "desc": "Definition. Throughput is limited by politeness, not by how many sockets you can open.\n\nHow it works. A per-host token bucket sits in front of the fetcher.\n\nOperational risk. A single global queue without host affinity stampedes one origin."
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "How do you design a URL shortener?",
      "a": "Definition. Persist a mapping from a short code to a long URL and redirect on GET.\n\nHow it works. Mint codes with a unique id encoder or a random token. Cache reads. Store creator and timestamps if analytics matter.\n\nOperational risk. Using 301 everywhere hides later changes and undercounts redirects if you need them.",
      "flow": [
        "POST url",
        "code",
        "GET /code",
        "302"
      ],
      "layers": [
        [
          {
            "label": "API"
          }
        ],
        [
          {
            "label": "Cache",
            "tone": "store"
          },
          {
            "label": "DB",
            "tone": "store"
          }
        ]
      ]
    },
    {
      "id": 2,
      "level": "intermediate",
      "q": "How do you avoid collisions in short codes?",
      "a": "Definition. Collisions occur when two writes choose the same code.\n\nHow it works. A unique constraint plus retry, or a monotonic id that cannot collide.\n\nOperational risk. Checking existence then inserting without a constraint still races."
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "How do you design a rate limiter?",
      "a": "Definition. Count actions per key per window and reject the excess.\n\nHow it works. Token bucket or sliding window in Redis, enforced at the gateway.\n\nOperational risk. In-memory limits per node allow N times the budget across N nodes.",
      "flow": [
        "Key",
        "Redis",
        "Allow / 429"
      ]
    },
    {
      "id": 4,
      "level": "intermediate",
      "q": "Fan-out on write versus fan-out on read for a feed?",
      "a": "Definition. Write-time fan-out updates follower timelines when a post is created. Read-time fan-out gathers followee posts when the feed is opened.\n\nHow it works. Hybrid: precompute for typical users, skip users with huge fan-out.\n\nOperational risk. Doing celebrity fan-out synchronously in the publish API."
    },
    {
      "id": 5,
      "level": "intermediate",
      "q": "How do you design 1:1 chat?",
      "a": "Definition. Authenticated sockets, durable messages, per-conversation sequence.\n\nHow it works. Persist, increment sequence, push to online sockets, let others catch up from last-seen.\n\nOperational risk. Trusting client timestamps for order."
    },
    {
      "id": 6,
      "level": "advanced",
      "q": "How do you design group chat at millions of members?",
      "a": "Definition. Do not open a socket write to every member in the request path.\n\nHow it works. Persist once, enqueue fan-out, batch push, and let offline members load history.\n\nOperational risk. A single chat process holding every member connection."
    },
    {
      "id": 7,
      "level": "intermediate",
      "q": "How do you design notifications?",
      "a": "Definition. Convert domain events into channel-specific deliveries with preferences.\n\nHow it works. Queue per channel, store receipts, retry with backoff.\n\nOperational risk. Sending before checking quiet hours or unsubscribe."
    },
    {
      "id": 8,
      "level": "advanced",
      "q": "How do you design YouTube-style playback?",
      "a": "Definition. Separate metadata, object storage, transcode, and CDN delivery.\n\nHow it works. Signed upload, asynchronous renditions, HLS/DASH via CDN.\n\nOperational risk. Transcoding in the upload HTTP request."
    },
    {
      "id": 9,
      "level": "advanced",
      "q": "How do you match riders and drivers?",
      "a": "Definition. Geo index of available drivers plus an offer state machine.\n\nHow it works. Geohash neighbors, rank by ETA, exclusive accept.\n\nOperational risk. Two riders receiving the same driver because accept is not exclusive."
    },
    {
      "id": 10,
      "level": "intermediate",
      "q": "How do you design autocomplete?",
      "a": "Definition. Prefix → top-K query with a memory-resident index.\n\nHow it works. Offline job builds suggestions; API only reads.\n\nOperational risk. Querying the full-text document store per keystroke."
    },
    {
      "id": 11,
      "level": "advanced",
      "q": "How do you design Dropbox-like sync?",
      "a": "Definition. Content-addressed blocks plus a metadata tree of versions.\n\nHow it works. Upload missing hashes, then atomically commit a new file version.\n\nOperational risk. Storing whole files as single blobs on the API host."
    },
    {
      "id": 12,
      "level": "intermediate",
      "q": "How do you design a web crawler?",
      "a": "Definition. Frontier, polite fetcher, parser, seen set, index.\n\nHow it works. Per-host delays, robots.txt, and incremental frontier growth.\n\nOperational risk. Unbounded in-memory seen set."
    },
    {
      "id": 13,
      "level": "advanced",
      "q": "How do you avoid double booking seats?",
      "a": "Definition. Treat each seat as a row with states open, held, sold.\n\nHow it works. Conditional updates and a unique sold record. Holds expire.\n\nOperational risk. Read-check-write without a constraint."
    },
    {
      "id": 14,
      "level": "beginner",
      "q": "How is pastebin different from a shortener?",
      "a": "Definition. The value is a document, not only a URL.\n\nHow it works. Small bodies in a table; large bodies in object storage. Auth on private pastes.\n\nOperational risk. Caching a private paste on a public CDN."
    },
    {
      "id": 15,
      "level": "intermediate",
      "q": "Where do you store sessions for a chat gateway farm?",
      "a": "Definition. Connection ownership must be discoverable so a message can reach the right node.\n\nHow it works. Presence map user → gateway id in Redis; gateways subscribe to their inbox.\n\nOperational risk. Broadcasting every message to every gateway."
    },
    {
      "id": 16,
      "level": "advanced",
      "q": "How do you count views without melting the database?",
      "a": "Definition. Buffer increments in memory or a stream, then flush aggregates.\n\nHow it works. Per-cache counters with periodic persist, or Kafka + worker.\n\nOperational risk. UPDATE views = views + 1 on every play."
    },
    {
      "id": 17,
      "level": "intermediate",
      "q": "What API would you expose for a shortener?",
      "a": "Definition. POST /links { url } returns code. GET /{code} redirects. Optional GET /links/:code/stats.\n\nHow it works. Auth on write if the product is not anonymous.\n\nOperational risk. An unbounded custom alias namespace that collides with routes."
    },
    {
      "id": 18,
      "level": "beginner",
      "q": "Which numbers do you compute for a feed?",
      "a": "Definition. Daily posters, posts per user, followers per user, read QPS of feed pages, and cache hit ratio.\n\nHow it works. Fan-out volume ≈ posts × average followers at peak.\n\nOperational risk. Sizing only for average hour."
    },
    {
      "id": 19,
      "level": "advanced",
      "q": "How do you expire stories or snaps?",
      "a": "Definition. Visibility is a query filter plus a lifecycle delete.\n\nHow it works. Store expires_at. Reads hide expired rows. A sweeper or object lifecycle removes bytes.\n\nOperational risk. Believing a TTL cache is the only delete; the durable copy remains."
    },
    {
      "id": 20,
      "level": "intermediate",
      "q": "How do you design search for posts?",
      "a": "Definition. An inverted index separate from the primary store.\n\nHow it works. Async indexer consumes post events. Query service hits the index, then hydrates from cache or DB.\n\nOperational risk. LIKE %term% on the primary table at feed scale."
    },
    {
      "id": 21,
      "level": "advanced",
      "q": "How do you handle a celebrity post?",
      "a": "Definition. Do not write the post into millions of timelines synchronously.\n\nHow it works. Store the post once. Merge celebrity posts at read time with the precomputed timeline.\n\nOperational risk. Queue explosion from write-time fan-out to 80 million followers."
    },
    {
      "id": 22,
      "level": "beginner",
      "q": "What failures must a booking design name?",
      "a": "Definition. Payment succeeds after hold expiry, payment fails after hold, sweeper races confirm.\n\nHow it works. State machine plus conditional writes cover each case.\n\nOperational risk. Refunds without a ledger of seat state transitions."
    },
    {
      "id": 23,
      "level": "intermediate",
      "q": "How do you keep chat history consistent for a late joiner?",
      "a": "Definition. History is loaded from the durable store, not from other clients.\n\nHow it works. Client sends last_seq; server returns the gap.\n\nOperational risk. Relying on in-memory gateway buffers as history."
    },
    {
      "id": 24,
      "level": "advanced",
      "q": "What would you monitor on a shortener?",
      "a": "Definition. Redirect QPS, p99 redirect latency, cache hit ratio, 404 rate, write errors, and origin DB CPU.\n\nHow it works. Alert on hit-ratio collapse and on 5xx, not only on CPU.\n\nOperational risk. A cache flush that is invisible until the database pages."
    }
  ]
};
