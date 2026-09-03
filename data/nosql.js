window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["nosql"] = {
  "kind": "design",
  "notes": [
    {
      "title": "Before you say NoSQL",
      "body": "Before you use this\nNoSQL is not 'no schema' and not 'always faster than SQL'. It is a family of stores that are not 'tables + SQL joins' as the main model. Write the queries you need first. Then pick a family. You still need unique emails, backups, and a plan for money.\n\nWhy we use it\nDifferent products ask different questions. A session is a key. A blog post is a nested document. A chat history is a huge write stream. A 'friends of friends' walk is a graph. One SQL table is a poor fit for some of those — that is why NoSQL exists.\n\nWhen to pick this\nDocument → Mongo. Key-value / TTL → Redis. Huge writes, known key → Cassandra or DynamoDB. Connections → Neo4j. If you need multi-row money, rich joins, and reports, start with SQL."
    },
    {
      "title": "What NoSQL means",
      "layers": [
        [
          {
            "label": "App"
          }
        ],
        [
          {
            "label": "Document",
            "tone": "store"
          },
          {
            "label": "Key-value",
            "tone": "store"
          },
          {
            "label": "Wide-column",
            "tone": "store"
          },
          {
            "label": "Graph",
            "tone": "store"
          }
        ]
      ],
      "body": "The problem before\nYou hear NoSQL and assume no schema and always faster than SQL. You pick Mongo because a tutorial did. You cannot name the four families.\n\nWhat this is\nNoSQL is a family of stores that are not \"tables + SQL joins\" as the main model. Four common families: document (MongoDB, Firestore), key-value (Redis, DynamoDB simple use), wide-column (Cassandra, Bigtable), graph (Neo4j). It is a different data shape and a different query style.\n\nWhat it solves\nYou pick a family from the question the product asks. Interviews hear that you did not treat every NoSQL logo as the same box.\n\nReal-life example\nFour kinds of shop cupboard: a folder of papers (document), a labelled locker (key-value), a huge register of columns (wide-column), a family tree of strings (graph). None of them is \"SQL but spicy.\"\n\nUses\nSystem design when SQL joins are the wrong shape. Interview: name the four families, then pick one.\n\nWatch out\nHearing NoSQL and assuming it is always faster. Calling everything NoSQL as if they were the same. Skipping unique emails, backups, and a plan for money."
    },
    {
      "title": "Document stores",
      "flow": [
        "App",
        "insert one JSON",
        "find by id or field"
      ],
      "body": "The problem before\nYou smash a user, orders, and comments into tables you always join. Or you dump one giant JSON blob and hope. You need the same item in five different joins every time.\n\nWhat this is\nA document is a JSON-like object, often one business thing (a user, an order with line items nested). You read and write the whole document or a path inside it. MongoDB and Firestore are the usual names.\n\nWhat it solves\nThe thing you load together lives together. One findById can load the whole order. Nested arrays belong when they belong to that folder.\n\nReal-life example\nOne student file with marksheets stapled inside. You open Ada's folder and the lines are already there. You do not walk to a second cabinet for every line item unless many folders share that page.\n\nUses\nCatalogs, nested orders, flexible records. Interview: \"embed when you always load together.\"\n\nWatch out\nA 16 MB document that grows forever. Embedding the whole user in every comment. Updating one line with two writers and no version field."
    },
    {
      "title": "Key-value stores",
      "body": "The problem before\nYou want \"all users in Pune\" from a store that only understands GET by exact key. You treat Redis like SQL. You have no key design.\n\nWhat this is\nYou give a key, you get a blob. Redis, Memcached, DynamoDB (as a big key-value), S3 (object key). There is no join and little query language. You design the key: user:42:session.\n\nWhat it solves\nExtremely fast and simple when the key is the query. Sessions, caches, and feature flags fit. You stop scanning when you already know the locker number.\n\nReal-life example\nA cloakroom ticket. Show ticket 42, get that bag. There is no \"all bags from Pune\" window unless you built a second index.\n\nUses\nSessions, caches, TTL data. Interview: \"the key is the whole query.\"\n\nWatch out\nNeeding a filter that is not in the key. Wanting \"all sessions for user 9\" with no secondary index. Using Redis as the only order table."
    },
    {
      "title": "Wide-column stores",
      "body": "The problem before\nYou want ad-hoc SQL on a cluster built for known queries. You change an access pattern and expect ALTER plus JOIN. Writes must not stop and a single Postgres primary is the bottleneck.\n\nWhat this is\nCassandra and Bigtable store rows with a partition key and a flexible set of columns. Writes are cheap and scale across many nodes. You design tables around queries (\"get last 100 messages for chat X\"), not around a universal schema.\n\nWhat it solves\nHuge write volume and time series have a shape. Changing an access pattern later often means a new table — that is honest. TTL on columns can be native.\n\nReal-life example\nA register per classroom, not one giant diary for the whole school. \"Last 100 remarks for room 4\" is one book. \"Search every remark for the word hello\" is not that book's job.\n\nUses\nChat history, time series, huge writes with a known key. Interview: \"table per query, partition key first.\"\n\nWatch out\nTreating CQL as PostgreSQL. Unbounded columns on one partition key. SELECT WHERE body CONTAINS as your default."
    },
    {
      "title": "Graph stores",
      "flow": [
        "Node",
        "edge",
        "neighbor",
        "neighbor"
      ],
      "body": "The problem before\nYou write a five-table join for friends of friends. Or you put a users table in Neo4j because graphs sound modern. The product question is not about connections.\n\nWhat this is\nA graph database stores nodes and edges as first-class things. \"Friends of friends\" or \"which services talk to this API\" is a walk, not a five-table join. Neo4j (Cypher) and Amazon Neptune are common.\n\nWhat it solves\nN-hop questions stay natural. You model the relationship, not a join table you walk in your head. The query looks like the picture on the board.\n\nReal-life example\nA classroom friendship map with string between desks. \"Who sits two desks from Ada?\" is a walk along the string. A SQL join table is a list of pairs you keep recounting by hand.\n\nUses\nSocial graphs, recommendations, dependency maps. Interview: \"when the question is a walk.\"\n\nWatch out\nA graph database for a CRUD users table. Neo4j for a two-table enrollment list. Using Cypher when there are no relationships."
    },
    {
      "title": "When NoSQL wins",
      "body": "The problem before\nYou force SQL onto a session TTL, a nested catalog, or a write firehose. You pick one engine for every screen. You cannot say why this family.\n\nWhat this is\nHuge write throughput with a known key (Cassandra). Nested documents you always load together (Mongo). Millisecond TTL data (Redis). Multi-region key-value with managed ops (DynamoDB). Graph questions (Neo4j).\n\nWhat it solves\nEach family matches a question. You can name the win in one sentence. Interviews hear a pick, not a brand crush.\n\nReal-life example\nThe right cupboard for the right shop job: lockers for tokens, folders for orders, registers for chat, strings for friends. You do not store atta in the jewellery locker.\n\nUses\nSystem design when you justify the store. Interview: one win per family.\n\nWatch out\nMongo because of a tutorial. Six databases with no query on the arrows. Skipping SQL when you need money and joins."
    },
    {
      "title": "When NoSQL hurts",
      "body": "The problem before\nYou moved a bank ledger to Mongo for speed. Reports join five entities with no plan. Two accounts share an email because nobody added a unique index.\n\nWhat this is\nThese are the cases where NoSQL fights you. Multi-row money, rich joins, and reports still want SQL. \"Schemaless\" that becomes twenty unofficial shapes is a mess. Missing unique constraints let two accounts share an email.\n\nWhat it solves\nYou know when to start with SQL. You can name the pain in an interview instead of defending a tutorial. Constraints and joins stay first-class where they belong.\n\nReal-life example\nA kirana that keeps prices in twenty unofficial notebooks. Checkout cannot add. Two customers share the same loyalty stamp because nobody kept a unique list.\n\nUses\nLedgers, reporting, strong unique rules. Interview: \"when I would not pick NoSQL.\"\n\nWatch out\nPick Mongo, then spend a year rebuilding relations. Uniqueness only in Node, losing a race. Twenty unofficial document shapes."
    },
    {
      "title": "DynamoDB in one page",
      "body": "The problem before\nYou treat Dynamo like SQL: add a column, join later, Scan for every page. You never choose a partition key. One celebrity key melts a partition.\n\nWhat this is\nAWS key-value / document store. You must choose a partition key (and optional sort key) up front. Queries are cheap on that key; scans are expensive. Secondary indexes are extra tables Dynamo keeps for you, and capacity is on-demand or provisioned.\n\nWhat it solves\nAccess patterns drive the table. GetItem and Query stay cheap. You design for those screens on day one.\n\nReal-life example\nA locker bank where the locker number is the address. Open locker USER#9 / PROFILE. Walking every locker (Scan) is how you miss the last bus.\n\nUses\nKnown keys, AWS shops, serverless. Interview: \"pk + sk, Query not Scan.\"\n\nWatch out\nScan as your default SELECT *. A hot key (one celebrity) on one partition. pk = GLOBAL for every write. A SQL-style join later that does not exist."
    },
    {
      "title": "Cassandra in one page",
      "body": "The problem before\nYou write JOINs in CQL. You pick CL=ONE for a money transfer. You never list the queries on day one.\n\nWhat this is\nPeer-to-peer wide-column. Replication factor and consistency level (ONE, QUORUM, ALL) are your CAP knobs. The partition key decides the node. CQL looks a bit like SQL but is not SQL — no arbitrary JOIN — and TTL on columns is native.\n\nWhat it solves\nWrites that must not stop have a home. You tune how many replicas must agree. Queries you listed on day one stay fast.\n\nReal-life example\nMany clerks, each owning a classroom register. RF=3 means three copies. QUORUM is \"ask a majority before you believe it.\" ONE is \"ask the nearest clerk\" — fine for a like count, not for fees.\n\nUses\nHuge writes, chat, time series. Interview: \"partition key, RF, consistency level.\"\n\nWatch out\nCL=ONE for a money transfer. Treating CQL as PostgreSQL. A query you did not design a table for."
    },
    {
      "title": "Modeling habit",
      "body": "The problem before\nYou draw a pretty ER diagram that cannot answer the home page. You treat every copied field as a sin. You store first and invent queries later.\n\nWhat this is\nWrite the queries first. Then store the data in the shape those queries need, even if you copy a field. In NoSQL, duplication is often the design, not a mistake. In SQL, duplication is usually a mistake until you denormalize on purpose.\n\nWhat it solves\nThe home page is one query, not five joins you hoped would work. Interviews love that sentence. You can explain a copied authorName on a post.\n\nReal-life example\nThe canteen board lists today's menu in the shape people read, even if the kitchen book already has the same dal. You copy for the board. When the name of the cook changes, a job updates the board.\n\nUses\nEvery NoSQL design round. Interview: \"query first, then the shape.\"\n\nWatch out\nA pretty ER diagram that cannot answer the home page. Forgetting the backfill when a copied field changes. Copying by accident in SQL and calling it NoSQL."
    }
  ],
  "examples": [
    {
      "title": "Document: one order with lines inside",
      "lang": "js",
      "desc": "Definition. Nested line items live in the same document as the order.\n\nHow it works. One findById loads the whole order.\n\nOperational risk. Updating one line with two writers without a version field.",
      "code": "await orders.insertOne({\n  _id: \"o1\",\n  userId: \"u9\",\n  lines: [{ sku: \"tea\", n: 2 }]  // nested, not a second table\n});\nconst order = await orders.findOne({ _id: \"o1\" });  // one round trip"
    },
    {
      "title": "Key-value: session by id",
      "lang": "js",
      "desc": "Definition. The key is the whole query.\n\nHow it works. GET session:abc. No scan.\n\nOperational risk. Wanting 'all sessions for user 9' with no secondary index.",
      "code": "await kv.set(\"session:abc\", JSON.stringify({ userId: 9 }), { ex: 86400 });  // write\nconst raw = await kv.get(\"session:abc\");  // exact key"
    },
    {
      "title": "Mongo find vs SQL join thinking",
      "lang": "js",
      "desc": "Definition. Embed when you always load together. Refer when many documents share one thing.\n\nHow it works. Product names that change globally should be an id, not a copied string in every order — unless you snapshot on purpose.\n\nOperational risk. Embedding the whole user in every comment.",
      "code": "// embed: comments stay on the post\nawait posts.updateOne({ _id: \"p1\" }, { $push: { comments: { by: \"ada\", text: \"hi\" } } });\n\n// refer: user profile lives once\nawait comments.insertOne({ postId: \"p1\", userId: \"ada\" });"
    },
    {
      "title": "DynamoDB item",
      "lang": "js",
      "flow": [
        "pk + sk",
        "GetItem",
        "item"
      ],
      "desc": "Definition. Partition key plus sort key is the address of the item.\n\nHow it works. GetItem is one hop. Query lists items that share pk.\n\nOperational risk. Scan as your default 'SELECT *'.",
      "code": "await dynamo.put({\n  TableName: \"app\",\n  Item: { pk: \"USER#9\", sk: \"PROFILE\", name: \"Ada\" }  // address\n});\nconst out = await dynamo.get({ TableName: \"app\", Key: { pk: \"USER#9\", sk: \"PROFILE\" } });"
    },
    {
      "title": "Cassandra: query-shaped table",
      "lang": "sql",
      "desc": "Definition. One table per query. Messages by chat id, newest first.\n\nHow it works. PRIMARY KEY ((chat_id), sent_at, id) — partition then sort.\n\nOperational risk. SELECT * WHERE body CONTAINS 'hello' — that is not Cassandra.",
      "code": "CREATE TABLE messages_by_chat (\n  chat_id TEXT,\n  sent_at TIMESTAMP,\n  id      UUID,\n  body    TEXT,\n  PRIMARY KEY ((chat_id), sent_at, id)  -- query: last N in this chat\n) WITH CLUSTERING ORDER BY (sent_at DESC);"
    },
    {
      "title": "Neo4j: one hop friends",
      "lang": "txt",
      "desc": "Definition. MATCH a pattern of nodes and edges.\n\nHow it works. (a)-[:FRIEND]-(b) is a walk, not a join table in your head.\n\nOperational risk. Using Cypher for a simple users table with no relationships.",
      "code": "MATCH (a:User {id: \"ada\"})-[:FRIEND]-(b:User)  // one hop\nRETURN b.name;"
    },
    {
      "title": "Unique email without SQL UNIQUE",
      "lang": "js",
      "desc": "Definition. Document stores need an explicit unique index.\n\nHow it works. createIndex unique: true. Two inserts with the same email fail.\n\nOperational risk. Checking uniqueness only in Node and losing a race.",
      "code": "await users.createIndex({ email: 1 }, { unique: true });  // database rule\nawait users.insertOne({ email: \"ada@test.com\" });"
    },
    {
      "title": "Copy a field on purpose",
      "lang": "js",
      "desc": "Definition. Denormalize so a feed query needs no join.\n\nHow it works. Each post stores authorName. When Ada renames, a job updates posts.\n\nOperational risk. Forgetting the backfill and showing the old name.",
      "code": "await posts.insertOne({\n  title: \"Hi\",\n  authorId: \"ada\",\n  authorName: \"Ada\"  // copy for the feed card\n});"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "What is NoSQL?",
      "a": "Definition. Stores that are not 'tables + SQL joins' as the main model: documents, keys, wide-column, graphs.\n\nHow it works. You pick a family from the query shape.\n\nOperational risk. Hearing NoSQL and assuming it is always faster."
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "Name the four common families.",
      "a": "Definition. Document, key-value, wide-column, graph.\n\nHow it works. Mongo, Redis, Cassandra, Neo4j are the classroom examples.\n\nOperational risk. Calling everything NoSQL as if they were the same."
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "What is a document store?",
      "a": "Definition. JSON-like objects, often one business thing per document.\n\nHow it works. find by _id or an indexed field. Nest arrays when they belong together.\n\nOperational risk. A 16 MB document that grows forever."
    },
    {
      "id": 4,
      "level": "beginner",
      "q": "What is a key-value store?",
      "a": "Definition. GET/SET by an exact key. No join.\n\nHow it works. You design the key string.\n\nOperational risk. Needing a filter that is not in the key."
    },
    {
      "id": 5,
      "level": "beginner",
      "q": "MongoDB vs Postgres — one reason each?",
      "a": "Definition. Mongo fits nested documents and a JS team. Postgres fits money, joins, and constraints.\n\nHow it works. Many apps use both: SQL for truth, Mongo for a flexible catalog.\n\nOperational risk. One engine for every problem."
    },
    {
      "id": 6,
      "level": "intermediate",
      "q": "Embed vs reference?",
      "a": "Definition. Embed when you always load the child with the parent. Reference when many parents share one child or the child is huge.\n\nHow it works. Order.lines embed. User profile references.\n\nOperational risk. Embedding the user object in a million comments."
    },
    {
      "id": 7,
      "level": "intermediate",
      "q": "What is a partition key?",
      "a": "Definition. The value that chooses which node or partition holds the item.\n\nHow it works. DynamoDB pk, Cassandra first key, Mongo shard key.\n\nOperational risk. A hot key (one celebrity) on one partition."
    },
    {
      "id": 8,
      "level": "intermediate",
      "q": "Why does Cassandra avoid JOINs?",
      "a": "Definition. Data is spread by partition. A join would fan out across the cluster.\n\nHow it works. You store the answer shape in one table.\n\nOperational risk. Treating CQL as PostgreSQL."
    },
    {
      "id": 9,
      "level": "intermediate",
      "q": "What is DynamoDB designed around?",
      "a": "Definition. Known access patterns and a primary key.\n\nHow it works. Put, Get, Query on pk+sk. Indexes for a second pattern.\n\nOperational risk. Scan for every page in production."
    },
    {
      "id": 10,
      "level": "beginner",
      "q": "Is NoSQL schemaless?",
      "a": "Definition. The engine may not enforce columns. The application still has a shape.\n\nHow it works. Validators and unique indexes exist in Mongo.\n\nOperational risk. Twenty unofficial document shapes."
    },
    {
      "id": 11,
      "level": "intermediate",
      "q": "When do you pick Neo4j?",
      "a": "Definition. When the product question is a walk on relationships.\n\nHow it works. MATCH (a)-[:X]-(b).\n\nOperational risk. A graph database for a CRUD users table."
    },
    {
      "id": 12,
      "level": "advanced",
      "q": "How does Cassandra QUORUM work?",
      "a": "Definition. A write or read must reach a majority of replicas.\n\nHow it works. RF=3 and QUORUM means 2 nodes. That leans consistent.\n\nOperational risk. CL=ONE for a money transfer."
    },
    {
      "id": 13,
      "level": "beginner",
      "q": "Firestore in one line?",
      "a": "Definition. Google's hosted document store with realtime listeners and security rules.\n\nHow it works. Collections and documents. Good for mobile clients.\n\nOperational risk. Unbounded collection scans billed per document."
    },
    {
      "id": 14,
      "level": "intermediate",
      "q": "Secondary index — why pay for it?",
      "a": "Definition. A second lookup path the engine maintains.\n\nHow it works. Mongo index, DynamoDB GSI, Cassandra SAI / materialized view.\n\nOperational risk. A GSI that projects the whole item and doubles write cost."
    },
    {
      "id": 15,
      "level": "advanced",
      "q": "How do you do a transaction in Mongo?",
      "a": "Definition. Multi-document transactions exist, but they are heavier than one-document atomic updates.\n\nHow it works. Prefer one document or $inc. Use a session transaction when you must touch two collections.\n\nOperational risk. Long transactions across shards."
    },
    {
      "id": 16,
      "level": "beginner",
      "q": "Redis vs DynamoDB?",
      "a": "Definition. Redis is in-memory, ultra fast, often a cache. DynamoDB is durable, hosted, pay-per-request key-value.\n\nHow it works. Sessions can be either. The only order table should not be Redis.\n\nOperational risk. Same key design, different durability."
    },
    {
      "id": 17,
      "level": "intermediate",
      "q": "What is a wide-column row?",
      "a": "Definition. A partition plus many optional columns / clustering cells.\n\nHow it works. You can add columns without ALTER for every field.\n\nOperational risk. Unbounded columns on one partition key (a row that never stops growing)."
    },
    {
      "id": 18,
      "level": "intermediate",
      "q": "Denormalize on purpose — example?",
      "a": "Definition. Copy authorName onto each post so the feed is one query.\n\nHow it works. Update job when the name changes.\n\nOperational risk. Stale copies with no job."
    },
    {
      "id": 19,
      "level": "advanced",
      "q": "What is a hot partition in DynamoDB?",
      "a": "Definition. One partition key gets more than its share of RCUs/WCUs.\n\nHow it works. Shard the key (userId#shard) or pick a better pk.\n\nOperational risk. pk = 'GLOBAL' for every write."
    },
    {
      "id": 20,
      "level": "beginner",
      "q": "Can you replace SQL with Mongo for a bank?",
      "a": "Definition. You can, but you must rebuild constraints, joins, and reporting yourself.\n\nHow it works. Most banks stay on SQL for ledgers.\n\nOperational risk. Losing a unique account number constraint."
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "TTL in NoSQL stores?",
      "a": "Definition. Documents or columns can expire (Mongo TTL index, Dynamo TTL, Cassandra TTL, Redis EX).\n\nHow it works. Sessions and ephemeral events vanish without a sweeper job.\n\nOperational risk. TTL as the only delete for legal records."
    },
    {
      "id": 22,
      "level": "beginner",
      "q": "What does 'query first design' mean?",
      "a": "Definition. List the screens and APIs, then store data in that shape.\n\nHow it works. Chat app → messages_by_chat table. Not a 3NF model you join later.\n\nOperational risk. A pretty ER diagram that cannot answer the home page."
    },
    {
      "id": 23,
      "level": "advanced",
      "q": "Multi-region NoSQL — what do you give up?",
      "a": "Definition. Writes in two regions usually mean eventual consistency or conflict rules.\n\nHow it works. DynamoDB global tables, Cassandra multi-DC, Cosmos DB.\n\nOperational risk. Two regions incrementing the same counter without a merge."
    },
    {
      "id": 24,
      "level": "intermediate",
      "q": "Graph vs SQL many-to-many?",
      "a": "Definition. SQL uses a join table. A graph uses edges you can walk N hops.\n\nHow it works. 3-hop 'people you may know' is painful in SQL and natural in Cypher.\n\nOperational risk. Neo4j for a two-table enrollment list."
    },
    {
      "id": 25,
      "level": "beginner",
      "q": "Name one hosted product per family.",
      "a": "Definition. Document: MongoDB Atlas or Firestore. Key-value: ElastiCache or DynamoDB. Wide-column: Keyspaces / Bigtable. Graph: Neptune or Aura.\n\nHow it works. Hosted means backups and failover are a setting — you still design keys.\n\nOperational risk. Assuming hosted means no hot partitions."
    },
    {
      "id": 26,
      "level": "intermediate",
      "q": "What is an aggregation pipeline?",
      "a": "Definition. Mongo's step-by-step transform: match, group, project.\n\nHow it works. $match first so you use an index. Then $group.\n\nOperational risk. $where or unbounded $lookup in a hot API."
    },
    {
      "id": 27,
      "level": "advanced",
      "q": "How do you migrate from Mongo to Postgres?",
      "a": "Definition. Map documents to tables, flatten arrays, add keys, dual-write, backfill, switch reads.\n\nHow it works. Arrays become child tables. Nested objects become columns or jsonb.\n\nOperational risk. A weekend cutover with no dual-write."
    },
    {
      "id": 28,
      "level": "beginner",
      "q": "Why do interviews still ask SQL if you use Mongo?",
      "a": "Definition. Most companies still have SQL somewhere, and the ideas (keys, indexes, transactions) transfer.\n\nHow it works. Learn both. Say when you would pick each.\n\nOperational risk. 'I only know Mongo' in a backend screen."
    },
    {
      "id": 29,
      "level": "intermediate",
      "q": "Eventual consistency — user-visible example?",
      "a": "Definition. Ada likes a post. A replica still shows 4 likes for a second.\n\nHow it works. Accept it for counts. Do not accept it for 'was the payment captured?'.\n\nOperational risk. A UI that flickers paid / unpaid."
    },
    {
      "id": 30,
      "level": "advanced",
      "q": "How do you pick in a system-design round?",
      "a": "Definition. Requirements → access patterns → consistency → size → engine.\n\nHow it works. Chat history: Cassandra or Dynamo by chat_id. User profile: SQL or Mongo. Presence: Redis.\n\nOperational risk. Drawing six databases with no query on the arrows."
    }
  ]
};
