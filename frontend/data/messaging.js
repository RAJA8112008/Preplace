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
      "body": "The problem before\nThe user waits while the API sends email, resizes a photo, or calls a slow webhook. Signup looks down because Gmail was slow. A crash in the middle of that work loses the job.\n\nWhat this is\nA queue holds work that should not sit inside the user request: email, thumbnails, webhooks, fan-out. The API writes the important row, pushes a message, and returns. A worker reads the message and does the slow part.\n\nWhat it solves\nThe HTTP request stays short. If the worker is down, messages wait instead of vanishing. Slow work retries without blocking the signup button.\n\nReal-life example\nThe clerk stamps the admission form and hands a token to the back office. The parent does not wait in the queue while someone photocopies certificates. If the photocopier is jammed, the token still sits in the tray.\n\nUses\nEmail, images, webhooks, fan-out. Interview opener: \"save truth, enqueue, 201, worker later.\"\n\nWatch out\nDoing the slow work inside the HTTP handler. Sending mail before you commit the user row. No restart policy so one crash stops all email."
    },
    {
      "title": "RabbitMQ",
      "body": "The problem before\nYou need routing: one publish, the right queues, not a giant if in the API. Redis lists feel too thin. Kafka feels like a truck for a postcard.\n\nWhat this is\nRabbitMQ is a message broker. Producers publish to an exchange. The exchange routes to queues. Consumers ack when done. You choose a routing pattern (direct, topic, fanout).\n\nWhat it solves\nWork lands in the right tray without the producer naming a consumer. You get acknowledgements and flexible routing without running Kafka. Per-queue consumers are a natural fit.\n\nReal-life example\nThe school office postbox (exchange) and labelled trays (queues). You drop a letter marked \"fees\". The fees clerk's tray gets it. You do not walk to a named intern.\n\nUses\nTask queues, routing between small services. Interview: \"exchange, queue, ack.\"\n\nWatch out\nA queue with no consumer and no TTL filling the disk. Running it with no disk limits. Using Kafka slogans when you only needed this broker."
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
      "body": "The problem before\nYou treat Kafka like a homework email queue. Or you need many teams to replay the same events and a Redis list already forgot them. You expect global order across the whole topic.\n\nWhat this is\nKafka is a distributed log. Messages stay for a retention time. Many consumer groups can replay the same topic. A topic is split into partitions, and order is per partition, not global.\n\nWhat it solves\nHigh-volume streams, analytics, and event logs have a home. New consumer groups can catch up. You keep history for a while instead of popping it away.\n\nReal-life example\nA school attendance register that stays on the shelf. The sports teacher and the fee clerk can both read last week's pages. A Redis list is a sticky note you peel off; Kafka is the bound register.\n\nUses\nEvent streams, analytics, high-volume logs. Interview: \"log + consumer group, not a todo list.\"\n\nWatch out\nUsing Kafka for a student email queue. Expecting global order across the whole topic. More consumers than partitions — extras sit idle."
    },
    {
      "title": "Amazon SQS and cloud queues",
      "body": "The problem before\nYou do not want to run a broker. You still need hide-while-working and a place for poison messages. You think a managed queue magically means exactly-once.\n\nWhat this is\nSQS is a managed queue: send, receive, delete. Visibility timeout hides a message while you work. A dead-letter queue holds failures. Cloud queues mean you do not run the broker.\n\nWhat it solves\nThe ideas stay the same as RabbitMQ: at-least-once and idempotency. Ops of the broker go away. Failures have a tray (DLQ) if you turn it on.\n\nReal-life example\nA post office you do not staff. You drop a parcel, a clerk hides it while delivering, then stamps it done. If delivery fails too often, the parcel sits in the complaints room.\n\nUses\nAWS homework and production when you already live in that cloud. Interview: \"send, receive, delete, visibility, DLQ.\"\n\nWatch out\nNever deleting after success so the job repeats. Visibility shorter than the work. Skipping idempotency because \"it is managed.\""
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
      "body": "The problem before\nYou charge a card inside a worker and assume the queue fires once. A crash after the charge but before ack sends the same job again. You call that \"exactly-once.\"\n\nWhat this is\nMost queues deliver at least once. The worker can see the same job twice. Make work safe to repeat: store processed message ids, or use a unique order id when charging a card.\n\nWhat it solves\nRetries stop being scary. Exactly-once is a property you design, not a slogan the broker gives you for free. Interviews love this sentence.\n\nReal-life example\nThe canteen token machine may print two slips after a jam. The clerk checks the roll number before charging again. Same student, one fee, even if two papers arrive.\n\nUses\nPayments, emails, any side effect. Interview: \"at-least-once, so the handler is idempotent.\"\n\nWatch out\n'The queue is exactly once' as an excuse to skip a unique key. Ack before you know success. Random UUIDs only, so retries look like new work."
    },
    {
      "title": "When Redis list is enough",
      "body": "The problem before\nYou BRPOP a job, crash, and the email is gone. You put Kafka on a newsletter. You cannot say the upgrade path in an interview.\n\nWhat this is\nLPUSH/BRPOP is fine for homework and low-value jobs. If losing a popped job on crash is bad, use Streams with ACK, RabbitMQ, SQS, or Kafka. Interviews like hearing that you know the upgrade path.\n\nWhat it solves\nYou start small without a broker. You can name when a list is not enough. The story is honest: sticky note versus registered post.\n\nReal-life example\nA sticky note on the fridge is a Redis list: grab it and it is gone. If the cook drops it, dinner is forgotten. A signed register (Streams, SQS, Rabbit) keeps the order until someone ticks it.\n\nUses\nHomework, low-value jobs, local demos. Interview: \"lists for toys; ack when loss hurts.\"\n\nWatch out\nBRPOP then crash before the email send. Using Redis pub/sub as the only order pipeline. Pretending a list is a durable broker."
    },
    {
      "title": "Dead-letter queues",
      "flow": [
        "Fail N times",
        "Move to DLQ",
        "Alarm",
        "Human fixes"
      ],
      "body": "The problem before\nA poison message crashes every worker. The main queue fills with the same bad payload. Nobody looks at the failures. Users wait and the dashboard is green.\n\nWhat this is\nAfter N retries a bad message should leave the main queue. Alarm on DLQ depth. Someone must read those payloads. A silent DLQ is a pile of angry users.\n\nWhat it solves\nWorkers stay alive. Humans get a tray of exceptions. You stop infinite crash loops on one rotten job.\n\nReal-life example\nA broken exam paper that makes every teacher faint. After three tries it goes to the principal's tray, not back into the class pile. If that tray is never opened, parents still wait.\n\nUses\nAny production queue. Interview: \"DLQ + alarm, then a human.\"\n\nWatch out\nA DLQ nobody reads. Infinite retries on the main queue. No alarm when depth grows."
    },
    {
      "title": "What to draw",
      "body": "The problem before\nYou name five products and draw nothing. The interviewer cannot see where email happens. You skip idempotent and DLQ on the sketch.\n\nWhat this is\nAlways draw: API → queue → worker → side system (SMTP, S3, other API). Write \"idempotent\" on the worker. Write \"DLQ + alarm\" under the queue.\n\nWhat it solves\nThat sketch beats naming five products. They can follow delay, retry, and failure. You sound like you have run this, not listed logos.\n\nReal-life example\nA classroom flowchart on the board: window (API), token tray (queue), back office (worker), postbox (SMTP). Write \"safe to stamp twice\" on the clerk. Write \"complaints tray\" under the tokens.\n\nUses\nEvery queue design round. One picture, then pick Rabbit, SQS, or Kafka if they ask.\n\nWatch out\nA logo salad with no arrows. Forgetting the worker process. Drawing Redis pub/sub as if it stored the only copy of an order."
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
