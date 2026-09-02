window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["messaging"] = {
  "kind": "design",
  "notes": [
    {
      "title": "Why queues exist",
      "layers": [
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
          }
        ],
        [
          {
            "label": "Worker"
          }
        ]
      ],
      "flow": [
        "User action",
        "Save truth",
        "Enqueue",
        "201",
        "Worker later"
      ],
      "body": "A queue holds work that should not sit inside the user request: email, thumbnails, webhooks, fan-out. The API writes the important row, pushes a message, and returns. A worker reads the message and does the slow part. If the worker is down, messages wait. That is the point."
    },
    {
      "title": "RabbitMQ",
      "body": "RabbitMQ is a message broker. Producers publish to an exchange. The exchange routes to queues. Consumers ack when done. You choose a routing pattern (direct, topic, fanout). It is a good default when you want routing and per-queue consumers without running Kafka."
    },
    {
      "title": "Kafka",
      "layers": [
        [
          {
            "label": "Producer"
          }
        ],
        [
          {
            "label": "Topic partitions",
            "tone": "store"
          }
        ],
        [
          {
            "label": "Consumer group"
          }
        ]
      ],
      "flow": [
        "Append event",
        "Partition log",
        "Consumers read offset"
      ],
      "body": "Kafka is a distributed log. Messages stay for a retention time. Many consumer groups can replay the same topic. Use it for event streams, analytics, and high-volume logs. It is heavier than Redis lists. You do not need Kafka for a student email queue."
    },
    {
      "title": "Amazon SQS and cloud queues",
      "body": "SQS is a managed queue: send, receive, delete. Visibility timeout hides a message while you work. A dead-letter queue holds failures. Cloud queues mean you do not run the broker. The ideas (at-least-once, idempotency) stay the same as RabbitMQ."
    },
    {
      "title": "At-least-once and idempotency",
      "flow": [
        "Deliver",
        "Work",
        "Crash",
        "Deliver again",
        "Same business key"
      ],
      "body": "Most queues deliver at least once. The worker can see the same job twice. Make work safe to repeat: store processed message ids, or use a unique order id when charging a card. Exactly-once is a property you design, not a slogan the broker gives you for free."
    },
    {
      "title": "When Redis list is enough",
      "body": "LPUSH/BRPOP is fine for homework and low-value jobs. If losing a popped job on crash is bad, use Streams with ACK, RabbitMQ, SQS, or Kafka. Interviews like hearing that you know the upgrade path."
    },
    {
      "title": "Dead-letter queues",
      "flow": [
        "Fail N times",
        "Move to DLQ",
        "Alarm",
        "Human fixes"
      ],
      "body": "A poison message crashes every worker. After N retries it should leave the main queue. Alarm on DLQ depth. Someone must read those payloads. A silent DLQ is a pile of angry users."
    },
    {
      "title": "What to draw",
      "body": "Always draw: API → queue → worker → side system (SMTP, S3, other API). Write 'idempotent' on the worker. Write 'DLQ + alarm' under the queue. That sketch beats naming five products."
    }
  ],
  "examples": [
    {
      "title": "API enqueues email",
      "lang": "js",
      "flow": [
        "POST /signup",
        "INSERT user",
        "enqueue welcome",
        "201"
      ],
      "desc": "Definition. Signup succeeds when the user row exists, not when Gmail accepts mail.\n\nHow it works. Commit user, then send a job { type: 'WELCOME', userId }.\n\nOperational risk. Sending mail before commit, then rolling back the user.",
      "code": "await db.users.insert({ id, email });\nawait queue.send({ type: \"WELCOME\", userId: id });\nres.status(201).json({ id });"
    },
    {
      "title": "Idempotent worker",
      "lang": "js",
      "flow": [
        "Receive",
        "if processed skip",
        "send mail",
        "mark processed",
        "ack"
      ],
      "desc": "Definition. The same userId welcome may arrive twice.\n\nHow it works. A processed_jobs table with unique job key.\n\nOperational risk. Charging twice because you acked after a timeout and the message returned.",
      "code": "async function onWelcome(job) {\n  const ok = await db.jobs.insertIgnore({ key: \"welcome:\" + job.userId });\n  if (!ok) return;\n  await mail.sendWelcome(job.userId);\n}"
    },
    {
      "title": "SQS visibility timeout",
      "lang": "flow",
      "flow": [
        "Receive",
        "Hidden 60s",
        "Finish → delete",
        "or timeout → visible again"
      ],
      "desc": "Definition. After receive, the message is hidden. If you do not delete it in time, it comes back.\n\nHow it works. Visibility > worst-case work. Extend if work is long.\n\nOperational risk. Visibility 30s and a 2-minute job → two workers."
    },
    {
      "title": "Kafka topic in one picture",
      "lang": "flow",
      "layers": [
        [
          {
            "label": "orders topic"
          }
        ],
        [
          {
            "label": "P0",
            "tone": "store"
          },
          {
            "label": "P1",
            "tone": "store"
          },
          {
            "label": "P2",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "key = userId",
        "same partition",
        "order preserved per key"
      ],
      "desc": "Definition. A topic is split into partitions. Order is per partition, not global.\n\nHow it works. Same key → same partition → same consumer in a group.\n\nOperational risk. Expecting global order across the whole topic."
    },
    {
      "title": "RabbitMQ routing",
      "lang": "flow",
      "flow": [
        "Publish exchange",
        "Routing key",
        "Queue",
        "Consumer ack"
      ],
      "desc": "Definition. Producers do not pick a consumer. They pick an exchange and a key.\n\nHow it works. Bindings decide which queues get a copy.\n\nOperational risk. A queue with no consumer and no TTL filling the disk."
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "What is a message queue?",
      "a": "Definition. A buffer between the API and slow work.\n\nHow it works. Send now, process soon, retry on failure.\n\nOperational risk. Doing the slow work inside the HTTP handler."
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "What is a worker?",
      "a": "Definition. A process that only consumes jobs. It is not the public website.\n\nHow it works. Long loop: receive, process, ack.\n\nOperational risk. No restart policy so one crash stops all email."
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "Why not send email inside signup?",
      "a": "Definition. SMTP is slow and can fail. Signup should still succeed.\n\nHow it works. Queue the welcome mail.\n\nOperational risk. User thinks signup failed because Gmail was down."
    },
    {
      "id": 4,
      "level": "intermediate",
      "q": "What is at-least-once delivery?",
      "a": "Definition. The broker may give you the message more than once.\n\nHow it works. Design idempotent handlers.\n\nOperational risk. 'The queue is exactly once' as an excuse to skip a unique key."
    },
    {
      "id": 5,
      "level": "intermediate",
      "q": "What is a dead-letter queue?",
      "a": "Definition. The holding area for messages that failed too many times.\n\nHow it works. Alarm on depth. Inspect payloads.\n\nOperational risk. A DLQ nobody reads."
    },
    {
      "id": 6,
      "level": "intermediate",
      "q": "What is RabbitMQ?",
      "a": "Definition. A broker with exchanges, queues, and acknowledgements.\n\nHow it works. Flexible routing for many small services.\n\nOperational risk. Running it with no disk limits."
    },
    {
      "id": 7,
      "level": "intermediate",
      "q": "What is Kafka?",
      "a": "Definition. A durable partitioned log that many consumer groups can replay.\n\nHow it works. High volume events and analytics.\n\nOperational risk. Using Kafka for a single email a day."
    },
    {
      "id": 8,
      "level": "beginner",
      "q": "What is SQS?",
      "a": "Definition. AWS managed queue. Send, receive, delete.\n\nHow it works. Visibility timeout + optional DLQ.\n\nOperational risk. Never deleting after success so the job repeats."
    },
    {
      "id": 9,
      "level": "intermediate",
      "q": "When is a Redis list not enough?",
      "a": "Definition. When losing a popped job on crash is unacceptable.\n\nHow it works. Upgrade to Streams, SQS, RabbitMQ, or Kafka.\n\nOperational risk. BRPOP then crash before the email send."
    },
    {
      "id": 10,
      "level": "advanced",
      "q": "What is a consumer group in Kafka?",
      "a": "Definition. A set of workers that split partitions of a topic.\n\nHow it works. Each partition is read by one member of the group.\n\nOperational risk. More consumers than partitions — extras sit idle."
    },
    {
      "id": 11,
      "level": "intermediate",
      "q": "What is visibility timeout?",
      "a": "Definition. Hide the message while a worker processes it.\n\nHow it works. Too short → double work. Too long → slow retry.\n\nOperational risk. Timeout shorter than the HTTP call to a vendor."
    },
    {
      "id": 12,
      "level": "beginner",
      "q": "What should you ack?",
      "a": "Definition. Ack (or delete) only after the side effect is safely recorded or is idempotent.\n\nHow it works. Ack too early → loss. Ack too late → duplicates you must handle anyway.\n\nOperational risk. Ack in a finally block before you know success."
    },
    {
      "id": 13,
      "level": "advanced",
      "q": "What is an outbox?",
      "a": "Definition. Write the event row in the same SQL transaction as the business row, then a publisher copies to the broker.\n\nHow it works. Avoids 'queued but not committed'.\n\nOperational risk. Dual-write to SQL and Kafka in two steps without an outbox."
    },
    {
      "id": 14,
      "level": "intermediate",
      "q": "How do you name a job?",
      "a": "Definition. Include a type and a business id: WELCOME:user:42.\n\nHow it works. That string is the idempotency key.\n\nOperational risk. Random UUIDs only, so retries look like new work."
    },
    {
      "id": 15,
      "level": "beginner",
      "q": "Where does a worker run on Render?",
      "a": "Definition. A Background Worker service with a start command like npm run worker.\n\nHow it works. Same repo, no public port.\n\nOperational risk. Starting the worker only on your laptop."
    },
    {
      "id": 16,
      "level": "advanced",
      "q": "Kafka versus RabbitMQ in one interview sentence?",
      "a": "Definition. Kafka is a replayable log for streams. RabbitMQ is a broker for task routing and classic work queues.\n\nHow it works. Pick from volume and replay needs, not from fashion.\n\nOperational risk. Installing both for one newsletter."
    },
    {
      "id": 17,
      "level": "intermediate",
      "q": "What do you monitor on a queue?",
      "a": "Definition. Depth, age of the oldest message, DLQ depth, consumer lag, error rate.\n\nHow it works. Page when depth grows and consumers are down.\n\nOperational risk. Only monitoring API 200s while email is 6 hours late."
    },
    {
      "id": 18,
      "level": "beginner",
      "q": "Can the API and the worker share a repo?",
      "a": "Definition. Yes. Two start commands, one codebase.\n\nHow it works. /src/http and /src/worker.\n\nOperational risk. Importing Express into the worker just to boot it."
    },
    {
      "id": 19,
      "level": "intermediate",
      "q": "What is backpressure?",
      "a": "Definition. Slow or reject new work when the queue or workers are saturated.\n\nHow it works. Bounded queue, 429, or stop the producer.\n\nOperational risk. An unbounded in-memory array as a 'queue'."
    },
    {
      "id": 20,
      "level": "advanced",
      "q": "How do you replay Kafka after a bug fix?",
      "a": "Definition. Reset the consumer group offset to an earlier time and read again.\n\nHow it works. Handlers must be idempotent or the replay double-applies.\n\nOperational risk. Replay that re-charges cards."
    },
    {
      "id": 21,
      "level": "beginner",
      "q": "What is pub/sub?",
      "a": "Definition. One publish, many current subscribers.\n\nHow it works. Redis pub/sub or an SNS topic.\n\nOperational risk. A down subscriber missing the only copy of an event."
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "How does this connect to Nginx and Redis?",
      "a": "Definition. Nginx fronts the API. Redis may cache reads. The queue is for async writes.\n\nHow it works. They solve different delays: network, repeated reads, and slow side effects.\n\nOperational risk. Using Redis pub/sub as the only order pipeline."
    }
  ]
};
