window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["sys-blocks"] = {
  "kind": "design",
  "notes": [
    {
      "title": "How to run a design interview",
      "layers": [
        [
          {
            "label": "1. Requirements",
            "tone": "edge"
          },
          {
            "label": "2. Scale numbers"
          },
          {
            "label": "3. API"
          }
        ],
        [
          {
            "label": "4. Draw the path",
            "tone": "stateless"
          },
          {
            "label": "5. Data model",
            "tone": "store"
          },
          {
            "label": "6. Bottlenecks",
            "tone": "warn"
          }
        ]
      ],
      "flow": [
        "Clarify",
        "Estimate QPS",
        "Sketch",
        "Deep-dive",
        "Failures"
      ],
      "body": "State functional requirements, then non-functional ones (latency, consistency, availability). Convert daily active users into read QPS, write QPS, and storage. Draw the request path before naming brands. Name the first bottleneck and the control that removes it. Close with failover, monitoring, and what you would build next."
    },
    {
      "title": "The standard request path",
      "layers": [
        [
          {
            "label": "Client",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "DNS"
          },
          {
            "label": "CDN",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "Load balancer",
            "tone": "stateless"
          }
        ],
        [
          {
            "label": "App servers",
            "tone": "stateless"
          }
        ],
        [
          {
            "label": "Cache",
            "tone": "store"
          },
          {
            "label": "Primary DB",
            "tone": "store"
          },
          {
            "label": "Replica",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Client",
        "DNS",
        "CDN / LB",
        "Application",
        "Cache",
        "Database"
      ],
      "body": "A user request is resolved by DNS, optionally served from a CDN, then distributed by a load balancer onto stateless application servers. Hot reads should hit a cache. Durable state lives in a primary database; replicas absorb read scale. Every later design is a variation of this path."
    },
    {
      "title": "DNS",
      "flow": [
        "Browser",
        "Resolver",
        "Authoritative DNS",
        "VIP / hostname"
      ],
      "body": "DNS maps a hostname to an address or to another hostname. Low TTL speeds failover and increases query volume. Health-checked records can shift traffic after an outage. DNS is not an HTTP router; path-based routing belongs at the load balancer."
    },
    {
      "title": "Load balancer",
      "layers": [
        [
          {
            "label": "Clients",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "Load balancer",
            "tone": "stateless"
          }
        ],
        [
          {
            "label": "App A"
          },
          {
            "label": "App B"
          },
          {
            "label": "App C"
          }
        ]
      ],
      "flow": [
        "TLS terminate",
        "Health check",
        "Choose target",
        "Forward"
      ],
      "body": "A load balancer terminates TLS, checks target health, and spreads connections. Layer 7 balancers route on host and path. Layer 4 balancers forward TCP or UDP. Prefer stateless application nodes so any healthy target can serve the next request."
    },
    {
      "title": "Caching",
      "flow": [
        "Request",
        "Cache lookup",
        "Hit → return",
        "Miss → store → fill cache"
      ],
      "body": "A cache stores expensive results closer to the caller. Cache-aside lets the application read the store on a miss and then populate the cache. Write-through updates cache and store together. Eviction, TTL, and stampede control (lock or singleflight) are part of the design, not optional details."
    },
    {
      "title": "CDN",
      "layers": [
        [
          {
            "label": "User"
          }
        ],
        [
          {
            "label": "Nearby edge",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "Origin / S3 / app",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "User",
        "Edge POP",
        "Cache hit or origin fetch"
      ],
      "body": "A content delivery network caches static objects at points of presence near users. Versioned asset names avoid stale HTML pointing at missing files. Dynamic HTML usually uses a short TTL. Origin access should stay private; the CDN is the public door."
    },
    {
      "title": "Replication",
      "layers": [
        [
          {
            "label": "Writes",
            "tone": "warn"
          }
        ],
        [
          {
            "label": "Primary",
            "tone": "store"
          }
        ],
        [
          {
            "label": "Replica A",
            "tone": "store"
          },
          {
            "label": "Replica B",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Client write",
        "Primary",
        "Async or sync copy",
        "Replica read"
      ],
      "body": "Synchronous replication waits for a standby before acknowledging a write and is used for multi-AZ failover. Asynchronous replicas add read capacity and can lag. Do not treat a classic standby as a read replica unless the product documents that behavior."
    },
    {
      "title": "Sharding",
      "layers": [
        [
          {
            "label": "Router",
            "tone": "stateless"
          }
        ],
        [
          {
            "label": "Shard 0",
            "tone": "store"
          },
          {
            "label": "Shard 1",
            "tone": "store"
          },
          {
            "label": "Shard 2",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Key",
        "Hash or range",
        "Target shard",
        "Local query"
      ],
      "body": "Sharding partitions data by a key so no single node holds the full working set. A poor key creates a hot shard. Cross-shard queries and transactions are expensive; design access patterns so one request usually hits one shard. Rebalancing is an operational project, not a one-line change."
    },
    {
      "title": "Message queues",
      "layers": [
        [
          {
            "label": "Producer",
            "tone": "stateless"
          }
        ],
        [
          {
            "label": "Queue",
            "tone": "store"
          }
        ],
        [
          {
            "label": "Consumer A"
          },
          {
            "label": "Consumer B"
          }
        ]
      ],
      "flow": [
        "API accepts write",
        "Enqueue",
        "Worker",
        "Side effect",
        "Ack"
      ],
      "body": "A queue decouples a user-facing write from slow work such as email, transcoding, or fan-out. Delivery is typically at-least-once, so handlers must be idempotent. A dead-letter queue holds poison messages. Visibility timeout must exceed worst-case processing time."
    },
    {
      "title": "CAP and consistency",
      "flow": [
        "Write",
        "Quorum or primary",
        "Readers see new or old value"
      ],
      "body": "A partition forces a choice between remaining available and remaining linearizable. State the consistency the product actually needs: strong for payments, eventual for counts and feeds. Mention read-your-writes for the author of a post. Do not claim CAP as a slogan without naming the failure mode."
    },
    {
      "title": "Unique IDs at scale",
      "layers": [
        [
          {
            "label": "App"
          }
        ],
        [
          {
            "label": "Snowflake / UUID / ticket DB",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Time bits",
        "Worker bits",
        "Sequence"
      ],
      "body": "Auto-increment IDs do not survive many primaries. UUID v4 is simple and does not sort by time. A Snowflake-style ID encodes timestamp, worker, and sequence so feeds can sort approximately by creation time without a central counter."
    },
    {
      "title": "Observability",
      "flow": [
        "Request id",
        "Metrics",
        "Logs",
        "Traces",
        "Alert"
      ],
      "body": "Every production design needs RED or USE metrics, structured logs with a request identifier, and traces across service boundaries. Alerts should page a human on user-visible failure, not on every CPU blip. Capacity work starts from measured QPS and latency, not from guesswork."
    }
  ],
  "examples": [
    {
      "title": "Cache-aside read",
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
            "label": "App",
            "tone": "stateless"
          }
        ],
        [
          {
            "label": "Redis",
            "tone": "store"
          },
          {
            "label": "Database",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "GET /item/42",
        "App",
        "Redis GET",
        "miss",
        "SQL",
        "Redis SET",
        "Response"
      ],
      "desc": "Definition. Cache-aside places lookup logic in the application.\n\nHow it works. The application checks Redis. On a hit it returns immediately. On a miss it loads the row, writes the cache with a TTL, and returns the payload.\n\nConfiguration. Key item:42, TTL 60–300 seconds, and a lock or request coalescing on popular keys.\n\nOperational risk. A flush or expiry storm sends the full read QPS to the database.",
      "code": "async function getItem(id) {\n  const key = \"item:\" + id;\n  const hit = await redis.get(key);\n  if (hit) return JSON.parse(hit);\n  const row = await db.item.find(id);\n  await redis.set(key, JSON.stringify(row), \"EX\", 120);\n  return row;\n}"
    },
    {
      "title": "Write path with a queue",
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
            "label": "Queue",
            "tone": "store"
          },
          {
            "label": "Primary DB",
            "tone": "store"
          }
        ],
        [
          {
            "label": "Workers"
          }
        ]
      ],
      "flow": [
        "POST /order",
        "Validate",
        "Insert order",
        "Enqueue email",
        "201 Created"
      ],
      "desc": "Definition. The API stores the durable order, then publishes work that may fail independently.\n\nHow it works. The HTTP request returns after the order row exists. A worker sends mail and records the attempt with the order id as an idempotency key.\n\nOperational risk. Enqueuing before the commit can notify the user of an order that rolled back. Commit first, then publish, or use an outbox table.",
      "code": "await db.orders.insert({ id, user, total });\nawait queue.send({ type: \"ORDER_MAIL\", orderId: id });\nreturn { status: 201, id };"
    },
    {
      "title": "Multi-AZ failover",
      "lang": "flow",
      "layers": [
        [
          {
            "label": "Route 53 / LB",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "AZ A app + NAT",
            "tone": "stateless"
          },
          {
            "label": "AZ B app + NAT",
            "tone": "stateless"
          }
        ],
        [
          {
            "label": "Primary DB",
            "tone": "store"
          },
          {
            "label": "Standby DB",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Health fail",
        "LB drains AZ A",
        "Standby promoted",
        "DNS / endpoint moves"
      ],
      "desc": "Definition. High availability requires a second Availability Zone for compute, NAT or endpoints, and the database.\n\nHow it works. The load balancer stops unhealthy targets. Multi-AZ database failover updates the writer endpoint.\n\nOperational risk. A single NAT in AZ A leaves private apps in AZ B without outbound connectivity after a zonal event."
    },
    {
      "title": "Horizontal scale-out",
      "lang": "flow",
      "layers": [
        [
          {
            "label": "Autoscale policy",
            "tone": "warn"
          }
        ],
        [
          {
            "label": "Load balancer",
            "tone": "stateless"
          }
        ],
        [
          {
            "label": "n app tasks",
            "tone": "stateless"
          }
        ]
      ],
      "flow": [
        "CPU or RPS high",
        "Launch task",
        "Health pass",
        "LB adds target"
      ],
      "desc": "Definition. Stateless application nodes scale by count, not by enlarging one machine.\n\nHow it works. A launch template defines the image. New tasks register with the target group after a health check.\n\nOperational risk. Sessions stored in process memory break when the instance is replaced. Keep session state in Redis or in a signed token."
    },
    {
      "title": "Rate limit at the edge",
      "lang": "flow",
      "layers": [
        [
          {
            "label": "Client"
          }
        ],
        [
          {
            "label": "Gateway + limiter",
            "tone": "warn"
          }
        ],
        [
          {
            "label": "API",
            "tone": "stateless"
          }
        ]
      ],
      "flow": [
        "Request",
        "Token bucket",
        "Allow or 429",
        "Handler"
      ],
      "desc": "Definition. A rate limiter protects downstream capacity using a key such as user id or IP.\n\nHow it works. A token bucket or sliding window in Redis records recent use. Excess traffic receives HTTP 429 with a Retry-After header.\n\nOperational risk. A global limit on a NAT egress IP can block an entire office. Prefer authenticated user or API-key limits.",
      "code": "const n = await redis.incr(\"rl:\" + user);\nif (n === 1) await redis.expire(\"rl:\" + user, 60);\nif (n > 100) return { status: 429 };"
    },
    {
      "title": "Read replica fan-out",
      "lang": "flow",
      "layers": [
        [
          {
            "label": "App writes",
            "tone": "warn"
          }
        ],
        [
          {
            "label": "Primary",
            "tone": "store"
          }
        ],
        [
          {
            "label": "Replica",
            "tone": "store"
          }
        ],
        [
          {
            "label": "Reporting app"
          }
        ]
      ],
      "flow": [
        "Write primary",
        "Replication stream",
        "Replica",
        "Read-only query"
      ],
      "desc": "Definition. Reporting queries should not compete with checkout writes on the primary.\n\nHow it works. The application sends writes to the primary and heavy reads to a replica.\n\nOperational risk. A user may not see their own write on a lagging replica. Use the primary for read-your-writes when the product requires it."
    },
    {
      "title": "CDN miss then origin",
      "lang": "flow",
      "layers": [
        [
          {
            "label": "Browser",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "CDN POP",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "Origin bucket",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "GET /app.8f3.js",
        "Edge lookup",
        "Miss",
        "Origin GET",
        "Store + serve"
      ],
      "desc": "Definition. The first viewer in a region pays the origin fetch; later viewers reuse the edge object.\n\nHow it works. Cache-Control and the object key determine freshness. Hashed filenames can use a long max-age.\n\nOperational risk. A year-long cache on index.html pins users to an old shell that references missing hashed files."
    },
    {
      "title": "Idempotent consumer",
      "lang": "flow",
      "flow": [
        "Deliver message",
        "Check processed(id)",
        "Work",
        "Mark processed",
        "Ack"
      ],
      "desc": "Definition. At-least-once delivery can present the same message twice.\n\nHow it works. The worker stores the message or business id in a processed table before or with the side effect, inside one transaction where possible.\n\nOperational risk. Charging a card on every receive without a unique key produces duplicate charges."
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "What is system design?",
      "a": "Definition. System design is the practice of choosing components and data paths so a product meets stated scale, latency, and reliability goals.\n\nHow it works. You gather requirements, estimate load, draw the request path, and justify each store and queue.\n\nOperational risk. Listing vendor names without a request flow is not a design."
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "What belongs in functional versus non-functional requirements?",
      "a": "Definition. Functional requirements describe features. Non-functional requirements describe quality attributes such as p99 latency, availability, and consistency.\n\nHow it works. Write both lists before drawing. A news feed that is available but one hour stale may be acceptable; a payment that is stale is not.\n\nOperational risk. Skipping non-functional requirements leads to a sketch that cannot be challenged."
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "How do you estimate QPS?",
      "a": "Definition. QPS is requests per second derived from daily users and actions.\n\nHow it works. Daily writes / 86400, then apply a peak factor of two to five. Separate read QPS from write QPS.\n\nConfiguration. 10 million daily reads ≈ 116 average QPS, about 500 QPS at a 4× peak.\n\nOperational risk. Using only the average hides the peak that actually sizes the fleet."
    },
    {
      "id": 4,
      "level": "beginner",
      "q": "What does a load balancer do?",
      "a": "Definition. A load balancer distributes connections across healthy application instances and can terminate TLS.\n\nHow it works. Health checks remove bad targets. Layer 7 routing uses host and path.\n\nOperational risk. Sticky sessions couple users to one instance and fight autoscaling.",
      "flow": [
        "Client",
        "LB",
        "Healthy app"
      ]
    },
    {
      "id": 5,
      "level": "beginner",
      "q": "When do you add a cache?",
      "a": "Definition. Add a cache when the same read is frequent and the source is slower or more expensive than memory.\n\nHow it works. Measure hit ratio, TTL, and miss penalty.\n\nOperational risk. Caching a user-specific page under a shared key leaks data."
    },
    {
      "id": 6,
      "level": "beginner",
      "q": "What is a CDN used for?",
      "a": "Definition. A CDN places copies of mostly static objects near users.\n\nHow it works. Edge caches reduce origin bandwidth and latency.\n\nOperational risk. Putting private API traffic on a public cache without cache-key discipline."
    },
    {
      "id": 7,
      "level": "intermediate",
      "q": "What is the difference between a replica and a shard?",
      "a": "Definition. A replica is a copy of the same data. A shard is a slice of different data.\n\nHow it works. Replicas increase read capacity or availability. Shards increase write and storage capacity.\n\nOperational risk. Calling read replicas 'sharding' hides the fact that writes still hit one primary."
    },
    {
      "id": 8,
      "level": "intermediate",
      "q": "What is cache-aside?",
      "a": "Definition. The application owns cache population.\n\nHow it works. Read cache, on miss read store, then write cache.\n\nOperational risk. Updating the database without invalidating the key serves stale authorization or prices."
    },
    {
      "id": 9,
      "level": "intermediate",
      "q": "Why are application servers kept stateless?",
      "a": "Definition. Stateless nodes store no user session that cannot be reconstructed from a token or an external store.\n\nHow it works. Any healthy instance can handle the next request, which enables rolling deploys and autoscaling.\n\nOperational risk. Local disk session files make failover user-visible."
    },
    {
      "id": 10,
      "level": "intermediate",
      "q": "What problem does a message queue solve?",
      "a": "Definition. A queue absorbs spikes and isolates slow side effects from the user request.\n\nHow it works. The API persists the business event, enqueues work, and returns.\n\nOperational risk. A queue without a dead-letter path and an alarm hides poison messages.",
      "flow": [
        "API",
        "Queue",
        "Worker"
      ]
    },
    {
      "id": 11,
      "level": "intermediate",
      "q": "What is a hot shard?",
      "a": "Definition. A hot shard receives a disproportionate share of keys or traffic.\n\nHow it works. Celebrity keys, time-based keys that all land on today, or a low-cardinality hash create imbalance.\n\nOperational risk. Adding nodes does not help if every write still hashes to the same partition."
    },
    {
      "id": 12,
      "level": "intermediate",
      "q": "How does consistent hashing help?",
      "a": "Definition. Consistent hashing maps keys to a ring so that adding a node remaps only a fraction of keys.\n\nHow it works. Virtual nodes spread load more evenly.\n\nOperational risk. Without virtual nodes, a new physical node can still take an unfair slice."
    },
    {
      "id": 13,
      "level": "intermediate",
      "q": "What is the CAP trade-off you should state?",
      "a": "Definition. During a network partition, a system cannot be both fully available and strictly consistent.\n\nHow it works. Pick the product rule: reject writes, or accept writes that may conflict.\n\nOperational risk. Claiming both 100 percent availability and linearizability across regions."
    },
    {
      "id": 14,
      "level": "advanced",
      "q": "How do you generate unique IDs without a single SQL sequence?",
      "a": "Definition. Use UUID, a ticket server per range, or a Snowflake composition of time, worker, and sequence.\n\nHow it works. Snowflake IDs sort roughly by time and need clock discipline on workers.\n\nOperational risk. Two workers sharing the same worker id will collide.",
      "flow": [
        "Timestamp",
        "Worker id",
        "Sequence"
      ]
    },
    {
      "id": 15,
      "level": "advanced",
      "q": "How do you protect the database from a cache stampede?",
      "a": "Definition. Many clients miss the same expired key and stampede the store.\n\nHow it works. Use probabilistic early expiry, a per-key lock, or request coalescing.\n\nOperational risk. A TTL aligned to a cron job expires every key at once."
    },
    {
      "id": 16,
      "level": "intermediate",
      "q": "What should a health check verify?",
      "a": "Definition. A load-balancer health check should answer whether the instance may receive user traffic.\n\nHow it works. Liveness is process up. Readiness may exclude a deep database ping if that ping would mark the whole fleet down during a brief blip.\n\nOperational risk. Health = SELECT 1 on a strained primary takes the site down with the database."
    },
    {
      "id": 17,
      "level": "beginner",
      "q": "What is vertical versus horizontal scaling?",
      "a": "Definition. Vertical scaling enlarges one machine. Horizontal scaling adds machines.\n\nHow it works. Stores often scale vertically first; stateless app tiers scale horizontally behind a balancer.\n\nOperational risk. A single vertical primary remains a failover story you must still design."
    },
    {
      "id": 18,
      "level": "intermediate",
      "q": "When is eventual consistency acceptable?",
      "a": "Definition. Eventual consistency is acceptable when readers can tolerate a short delay and the business can reconcile.\n\nHow it works. Like counts, recommendations, and asynchronously built feeds.\n\nOperational risk. Using it for wallet balances without a ledger."
    },
    {
      "id": 19,
      "level": "advanced",
      "q": "How do you design backpressure?",
      "a": "Definition. Backpressure slows or rejects intake when downstream capacity is exhausted.\n\nHow it works. Bounded queues, 429 or 503, and load-shed of non-critical work.\n\nOperational risk. An unbounded in-memory queue turns a slow worker into an out-of-memory crash."
    },
    {
      "id": 20,
      "level": "beginner",
      "q": "What do you measure after launch?",
      "a": "Definition. Measure request rate, errors, and duration, plus saturation of CPU, memory, and disk.\n\nHow it works. Dashboards and pages must map to a runbook.\n\nOperational risk. Alarms that email everyone train the team to ignore them."
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "What is an outbox?",
      "a": "Definition. An outbox is a table in the same transaction as the business write; a publisher later copies rows to the queue.\n\nHow it works. This avoids 'enqueue succeeded, commit failed'.\n\nOperational risk. Publishing from the request thread without a retry log loses the event on a crash."
    },
    {
      "id": 22,
      "level": "advanced",
      "q": "How do you choose a shard key?",
      "a": "Definition. The shard key should spread writes and match the lookup the product actually performs.\n\nHow it works. User id is common. Time-only keys concentrate writes on the newest shard.\n\nOperational risk. Sharding by a field you later need to query globally forces scatter-gather."
    },
    {
      "id": 23,
      "level": "intermediate",
      "q": "What is a reverse proxy?",
      "a": "The problem before\nEach service sat on the street with its own port. HTTPS, routing, and safety checks were copied into every app.\n\nWhat this is\nA reverse proxy accepts client connections and forwards them to internal services. The client never picks the inner box.\n\nWhat it solves\nOne public door. TLS, WAF rules, and path routing live at the desk. Apps stay inside the building.\n\nReal-life example\nA hotel receptionist. You ask for room 12. You do not wander the staff corridors.\n\nUses\nTLS termination, path routing, hide ports, optional WAF.\n\nWatch out\nLogging bodies at the proxy can store secrets."
    },
    {
      "id": 24,
      "level": "beginner",
      "q": "Why draw Multi-AZ on the first sketch?",
      "a": "Definition. A single zone is one failure domain for power, networking, and many control planes.\n\nHow it works. Place balancer nodes, app tasks, NAT or endpoints, and the database across two or more zones.\n\nOperational risk. Multi-AZ database with compute in one zone still fails the user path."
    }
  ]
};
