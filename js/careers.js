window.PREP_CAREERS = [
  {
    id: "frontend",
    title: "Frontend Developer",
    icon: "🖥️",
    blurb: "Build what people see and click: websites and web apps.",
    builds: "Landing pages, React apps, forms, dashboards.",
    time: "4–7 months",
    steps: [
      { topic: "htmlcss", learn: "HTML & CSS", why: "This is the page itself: text, layout, colors, mobile view." },
      { topic: "javascript", learn: "JavaScript", why: "Makes the page do things: clicks, lists, talking to a server." },
      { topic: "git", learn: "Git & GitHub", why: "Save your work and share it. Every job asks for this." },
      { topic: "react", learn: "React", why: "The common way to build real frontend apps in jobs." },
      { topic: "typescript", learn: "TypeScript", why: "JavaScript with types. Helps you make fewer mistakes." },
      { topic: "hosting", learn: "Vercel & hosting", why: "Put the React app on a real HTTPS URL from GitHub." },
      { topic: "practice-frontend", learn: "Practice labs", why: "Todo, CRUD, fake login, hide admin actions, fetch over HTTPS." }
    ],
    extra: [
      "Browser DevTools (inspect, console, network)",
      "Responsive design (phone and laptop)",
      "Accessibility: labels, keyboard, contrast",
      "One project: a personal site + a small React app",
      "Finish the Practice labs: todo → localStorage → login screen → HTTPS fetch"
    ]
  },
  {
    id: "backend",
    title: "Backend Developer",
    icon: "🛠️",
    blurb: "Build the server, APIs, and database behind the app.",
    builds: "Login APIs, databases, admin tools, background jobs.",
    time: "5–8 months",
    steps: [
      { topic: "javascript", learn: "JavaScript", why: "Same language you will use in Node.js." },
      { topic: "git", learn: "Git & GitHub", why: "Work with a team and keep history." },
      { topic: "nodeexpress", learn: "Node.js & Express", why: "Create APIs: GET, POST, login, errors." },
      { topic: "sql", learn: "SQL & Databases", why: "Store users and data in tables. Most companies use SQL." },
      { topic: "database", learn: "Databases", why: "ACID, replicas, and when SQL is not enough." },
      { topic: "mongodb", learn: "MongoDB", why: "A document database. Useful, and common in Node jobs." },
      { topic: "nosql", learn: "NoSQL", why: "Key-value, wide-column, and graph — not only Mongo." },
      { topic: "linux", learn: "Linux", why: "Servers run Linux. You need the terminal." },
      { topic: "docker", learn: "Docker", why: "Run the app the same way on every computer." },
      { topic: "redis", learn: "Redis", why: "Cache, sessions, and rate limits. Every backend job asks this." },
      { topic: "nginx", learn: "Nginx", why: "The door in front of Node on a real server." },
      { topic: "messaging", learn: "Queues & Kafka", why: "Send email and jobs after the API answers." },
      { topic: "practice-backend", learn: "Practice labs", why: "CRUD API, hashed login, JWT, roles, cookies, HTTPS." }
    ],
    extra: [
      "HTTP status codes (200, 400, 401, 404, 500)",
      "Never put passwords in Git",
      "One project: a notes or todo API with login",
      "Finish the Practice labs: in-memory CRUD → bcrypt → admin 403 → SQL"
    ]
  },
  {
    id: "mern",
    title: "MERN Stack Developer",
    icon: "🟢",
    blurb: "MongoDB + Express + React + Node. One path for full web apps.",
    builds: "A complete app: React screen + Node API + MongoDB.",
    time: "6–9 months",
    steps: [
      { topic: "htmlcss", learn: "HTML & CSS", why: "You still need a real page, even in React." },
      { topic: "javascript", learn: "JavaScript", why: "Used in both React and Node. Learn this well." },
      { topic: "git", learn: "Git & GitHub", why: "Save frontend and backend in one repo." },
      { topic: "react", learn: "React", why: "The 'MERN' R. Build the user interface." },
      { topic: "nodeexpress", learn: "Node.js & Express", why: "The 'E' and 'N'. Build the API." },
      { topic: "mongodb", learn: "MongoDB", why: "The 'M'. Save users, posts, and lists." },
      { topic: "fullstack", learn: "Full Stack glue", why: "Connect React to Express: fetch, login, errors." },
      { topic: "hosting", learn: "Vercel & Render", why: "UI on Vercel, API on Render, a live link in your resume." },
      { topic: "redis", learn: "Redis", why: "Sessions and cache once the app has real users." },
      { topic: "practice-mern", learn: "Practice labs", why: "Mongo todos, React forms, JWT signup, owner delete, CORS, HTTPS." }
    ],
    extra: [
      "Put frontend and backend in one project (or two folders)",
      "Learn CORS and why localhost:5173 cannot call :3000 without a proxy",
      "One project: blog or task app with signup",
      "Finish the Practice labs: API → React list → login → deploy HTTPS"
    ]
  },
  {
    id: "fullstack",
    title: "Full Stack Developer",
    icon: "🧩",
    blurb: "Frontend + backend + a little deploy. You can ship a feature alone.",
    builds: "Whole products: UI, API, database, and a live URL.",
    time: "8–12 months",
    steps: [
      { topic: "htmlcss", learn: "HTML & CSS", why: "Start with the page." },
      { topic: "javascript", learn: "JavaScript", why: "Language for both sides of the stack." },
      { topic: "git", learn: "Git & GitHub", why: "Daily tool for every developer." },
      { topic: "react", learn: "React", why: "Frontend of most full stack job posts." },
      { topic: "typescript", learn: "TypeScript", why: "Used in serious full stack teams." },
      { topic: "nodeexpress", learn: "Node.js & Express", why: "Your API server." },
      { topic: "sql", learn: "SQL", why: "Main database in most companies." },
      { topic: "database", learn: "Databases", why: "Pick the store from the query, not from a trend." },
      { topic: "mongodb", learn: "MongoDB", why: "Know both SQL and a document store." },
      { topic: "nosql", learn: "NoSQL", why: "Dynamo, Cassandra, graphs — when documents are not enough." },
      { topic: "fullstack", learn: "Full Stack", why: "Auth, REST, deploy ideas, end-to-end thinking." },
      { topic: "linux", learn: "Linux", why: "You will SSH or use a terminal on a server." },
      { topic: "docker", learn: "Docker", why: "Package the app for deploy." },
      { topic: "aws", learn: "AWS basics", why: "A common place to host the app." },
      { topic: "hosting", learn: "Vercel & Render", why: "Ship a URL this week without a raw VM." },
      { topic: "redis", learn: "Redis", why: "Cache and sessions in front of SQL." },
      { topic: "nginx", learn: "Nginx", why: "When you move from Render to a VPS." },
      { topic: "messaging", learn: "Queues", why: "Welcome email and thumbnails after the response." },
      { topic: "practice-fullstack", learn: "Practice labs", why: "SQL users + todos, cookie login, owner checks, Redis cache, HTTPS." }
    ],
    extra: [
      "Build 2–3 full projects (not only tutorials)",
      "Learn to read errors from the browser Network tab and the server log",
      "Know the difference: frontend validation vs server validation",
      "Finish the Practice labs: tables → CRUD → session → owner delete → live HTTPS"
    ]
  },
  {
    id: "ml",
    title: "ML Developer",
    icon: "🧠",
    blurb: "Teach computers from data: predictions, models, and Python.",
    builds: "Predict house price, classify email, simple recommenders.",
    time: "8–12 months",
    steps: [
      { topic: "python", learn: "Python", why: "The main language for machine learning." },
      { topic: "sql", learn: "SQL", why: "Most real data lives in tables. You must load it." },
      { topic: "machinelearning", learn: "Machine Learning", why: "Train, test, and judge a model without magic." },
      { topic: "vectordb", learn: "Vector databases", why: "Embeddings and RAG — how chat-with-your-PDF actually works." },
      { topic: "git", learn: "Git & GitHub", why: "Save notebooks and scripts like any other code." },
      { topic: "linux", learn: "Linux", why: "Training often happens on a Linux machine." },
      { topic: "docker", learn: "Docker", why: "Share an environment so the model runs the same place." },
      { topic: "practice-ml", learn: "Practice labs", why: "Train, save, /predict API, API key, admin retrain, HTTPS." }
    ],
    extra: [
      "School math refresh: averages, graphs, a little probability",
      "Libraries you will meet: NumPy, pandas, scikit-learn",
      "One project: predict a number, one project: yes/no classification",
      "Later: neural nets (PyTorch or TensorFlow) after the basics",
      "Finish the Practice labs: fit → dump → predict route → key → deploy"
    ]
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    icon: "🔁",
    blurb: "Help code go from your laptop to production safely.",
    builds: "Pipelines, servers, containers, alerts.",
    time: "6–10 months",
    steps: [
      { topic: "linux", learn: "Linux", why: "You live in the terminal." },
      { topic: "git", learn: "Git & GitHub", why: "CI starts when you push code." },
      { topic: "docker", learn: "Docker", why: "The usual way to package an app." },
      { topic: "devops", learn: "DevOps / CI-CD", why: "Tests, builds, and deploys on every change." },
      { topic: "kubernetes", learn: "Kubernetes", why: "Run many containers in a cluster." },
      { topic: "aws", learn: "AWS", why: "Where those clusters and pipelines often live." },
      { topic: "nginx", learn: "Nginx", why: "Reverse proxy, TLS, and Ingress ideas." },
      { topic: "hosting", learn: "Vercel & Render", why: "Platforms you will still debug in mixed teams." },
      { topic: "redis", learn: "Redis", why: "The cache box next to the app." },
      { topic: "practice-devops", learn: "Practice labs", why: "Dockerize a todo API, Nginx HTTPS, health, CI, secrets." }
    ],
    extra: [
      "Learn to read logs before you restart things",
      "Never store cloud keys in Git",
      "One project: GitHub Actions that tests and builds a Docker image",
      "Finish the Practice labs: Dockerfile → compose → TLS → Actions"
    ]
  },
  {
    id: "cloud",
    title: "Cloud / AWS Developer",
    icon: "☁️",
    blurb: "Put apps on AWS: servers, files, databases, and access rules.",
    builds: "A site on S3 + CloudFront, or an API on EC2 / Lambda.",
    time: "5–8 months",
    steps: [
      { topic: "linux", learn: "Linux", why: "EC2 is a Linux computer." },
      { topic: "git", learn: "Git & GitHub", why: "You still ship code the normal way." },
      { topic: "javascript", learn: "JavaScript", why: "Useful for Lambda and many APIs." },
      { topic: "nodeexpress", learn: "Node.js & Express", why: "A simple app you can host." },
      { topic: "docker", learn: "Docker", why: "Same image on your PC and on AWS." },
      { topic: "aws", learn: "AWS", why: "EC2, S3, IAM, VPC, RDS — the core map." },
      { topic: "devops", learn: "DevOps", why: "Deploy with a pipeline, not only the console." },
      { topic: "nginx", learn: "Nginx", why: "TLS and proxy on EC2." },
      { topic: "hosting", learn: "Vercel & Render", why: "Know when a platform is enough and when you need a VPC." },
      { topic: "practice-cloud", learn: "Practice labs", why: "S3 HTTPS, Lambda, RDS todos, IAM, JWT/Cognito, security groups." }
    ],
    extra: [
      "Create a free-tier AWS account and turn on billing alarms",
      "Learn IAM first: who can do what",
      "One project: static site on S3, one project: API on EC2",
      "Finish the Practice labs: HTTPS site → API → RDS → IAM role"
    ]
  },
  {
    id: "data",
    title: "Data Analyst",
    icon: "📊",
    blurb: "Turn tables into answers: SQL, a little Python, clear charts.",
    builds: "Reports, dashboards, 'why did sales drop?' notes.",
    time: "4–7 months",
    steps: [
      { topic: "sql", learn: "SQL", why: "Your main tool. Learn SELECT well." },
      { topic: "database", learn: "Databases", why: "OLTP vs warehouse. Do not report on the checkout box." },
      { topic: "python", learn: "Python", why: "Clean files, quick charts, pandas later." },
      { topic: "machinelearning", learn: "ML basics", why: "Enough to know average vs a model. Not all of ML." },
      { topic: "git", learn: "Git", why: "Save your queries and notebooks." },
      { topic: "practice-data", learn: "Practice labs", why: "SQL CRUD reports, region auth, pandas export, HTTPS dash." }
    ],
    extra: [
      "Excel or Google Sheets is still useful",
      "Learn to explain a number in one sentence",
      "One project: analyze a public CSV (sales, movies, or cricket)",
      "Finish the Practice labs: INSERT → GROUP BY → UPDATE → share HTTPS"
    ]
  },
  {
    id: "datastores",
    title: "Databases & Data Stores",
    icon: "🗃️",
    blurb: "SQL, NoSQL, Redis, and vector search — pick the right store and explain why.",
    builds: "You can model users in Postgres, documents in Mongo, sessions in Redis, and RAG in pgvector.",
    time: "6–10 weeks",
    steps: [
      { topic: "sql", learn: "SQL", why: "Tables, joins, indexes, transactions. Start here." },
      { topic: "database", learn: "Databases", why: "ACID, OLTP/OLAP, replicas, shards, backups." },
      { topic: "mongodb", learn: "MongoDB", why: "The document store you will see in Node jobs." },
      { topic: "nosql", learn: "NoSQL families", why: "Key-value, wide-column, graph, Dynamo, Cassandra." },
      { topic: "redis", learn: "Redis", why: "Cache and TTL — not the system of record." },
      { topic: "vectordb", learn: "Vector databases", why: "Embeddings, chunking, RAG, pgvector / Pinecone." },
      { topic: "practice-datastores", learn: "Practice labs", why: "Same todo in SQL, Mongo, Redis session, and a tiny vector search." }
    ],
    extra: [
      "Write the queries first, then pick the engine",
      "One project: Postgres users + Redis sessions + pgvector on a notes folder",
      "In interviews, say consistency and access pattern before you say a brand",
      "Finish the Practice labs: four verbs in two engines + Redis session"
    ]
  },
  {
    id: "sde",
    title: "SDE / FAANG Interview",
    icon: "💼",
    blurb: "The DSA path MAANG and FAANG companies ask: arrays first, then graphs and DP.",
    builds: "You can explain brute → better → best, with time and space, for the most asked problems.",
    time: "3–6 months of daily practice",
    steps: [
      { topic: "dsa-arrays", learn: "Arrays", why: "Most first-round questions. Two pointers, prefix sums, hashing." },
      { topic: "dsa-strings", learn: "Strings", why: "Anagrams, sliding windows, and palindromes show up in every company." },
      { topic: "dsa-linkedlist", learn: "Linked List", why: "Reverse, cycle, and merge are warm-up questions at Amazon and Meta." },
      { topic: "dsa-binarysearch", learn: "Binary Search", why: "Sorted arrays, peaks, and searching on the answer." },
      { topic: "dsa-stackheap", learn: "Stack, Queue & Heap", why: "Next greater, top-K, and sliding window max." },
      { topic: "dsa-tree", learn: "Binary Trees", why: "DFS/BFS, views, paths. Google and Apple ask these a lot." },
      { topic: "dsa-bst", learn: "BST", why: "Ordered trees: search, insert, delete, kth, successor." },
      { topic: "dsa-graph", learn: "Graphs", why: "Islands, course schedule, and BFS shortest path." },
      { topic: "dsa-backtracking", learn: "Recursion & Backtracking", why: "Subsets, permutations, N-Queens, word search." },
      { topic: "dsa-trie", learn: "Tries", why: "Prefix trees for dictionaries and autocomplete." },
      { topic: "dsa-dp", learn: "Dynamic Programming", why: "The harder onsite round. Learn the pattern, not 200 random problems." }
    ],
    extra: [
      "Speak Big-O out loud before you code",
      "Always start with a brute idea, then improve it",
      "Practice on a whiteboard or empty file, not only LeetCode hints",
      "Do 1–2 problems a day. Re-solve old ones after a week",
      "Know one language well (Java, C++, Python, or JavaScript — switch on each problem)",
      "Draw the tree or BST on paper before you code",
      "After DSA, open the System Design path and practice drawing the request flow",
      "Want todo/login/HTTPS builds? Open Full Stack or MERN Practice labs after the sheet"
    ]
  },
  {
    id: "sysdesign",
    title: "System Design",
    icon: "🏛️",
    blurb: "High-level design for interviews: building blocks first, then full products with diagrams and request flows.",
    builds: "You can sketch a URL shortener, news feed, chat, or rate limiter and walk through the request path.",
    time: "4–8 weeks after core DSA",
    steps: [
      { topic: "sys-blocks", learn: "System Design Blocks", why: "Learn the pieces: DNS, load balancer, cache, database, queue, shard, CDN." },
      { topic: "database", learn: "Databases", why: "ACID, replicas, shards — the store you draw on the board." },
      { topic: "nosql", learn: "NoSQL", why: "When the design uses Dynamo, Cassandra, or a graph." },
      { topic: "vectordb", learn: "Vector databases", why: "RAG and semantic search in modern designs." },
      { topic: "sys-cases", learn: "System Design Cases", why: "Assemble those pieces into the designs FAANG asks." },
      { topic: "redis", learn: "Redis", why: "The cache and rate-limit box you will draw on the board." },
      { topic: "nginx", learn: "Nginx", why: "The reverse proxy in front of the app tier." },
      { topic: "messaging", learn: "Queues & Kafka", why: "Async fan-out, email, and event logs." },
      { topic: "hosting", learn: "Vercel & Render", why: "Where student and startup apps actually go live." },
      { topic: "practice-sysdesign", learn: "Practice labs", why: "Code the drawing: shortener, rate limit, feed, owner delete, HTTPS." }
    ],
    extra: [
      "Always start with requirements, then scale numbers, then the drawing",
      "Name the bottleneck before you add a cache or a queue",
      "Speak the request flow out loud: client → edge → app → store",
      "State consistency, failover, and what you would measure",
      "Finish the Practice labs: create short link → redirect → 429 → cache"
    ]
  }
];
