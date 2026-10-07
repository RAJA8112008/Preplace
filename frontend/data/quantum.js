/* ==========================================================================
   Preplace — 1-Night Placement Quantum Series
   High-yield, concise, placement-ready crash modules for each skill
   ========================================================================== */

window.PREP_QUANTUM = [
  {
    id: "javascript",
    title: "JavaScript & Web Core",
    icon: "🟨",
    badge: "Frontend Core",
    duration: "45 mins",
    summary: "Single-threaded, non-blocking asynchronous event-driven JavaScript engine essentials.",
    cheatSheet: [
      { topic: "Event Loop", points: ["Call Stack handles synchronous code.", "Microtask Queue (Promises, queueMicrotask, MutationObserver) runs BEFORE Macrotask Queue (setTimeout, setInterval, I/O, UI render).", "Call Stack must be empty before the Event Loop pushes queued tasks."] },
      { topic: "Scope & Hoisting", points: ["var is function-scoped & hoisted as undefined.", "let and const are block-scoped and hoisted into Temporal Dead Zone (TDZ) until initialized.", "Function declarations are fully hoisted; function expressions are not."] },
      { topic: "Closures & 'this'", points: ["Closure: Inner function retains lexical access to outer variables even after outer has returned.", "'this' in regular functions depends on caller; in arrow functions, it lexical binds from enclosing scope.", "call/apply invoke immediately with explicit this; bind returns a new function."] },
      { topic: "Prototypes & Inheritance", points: ["Every object has an internal [[Prototype]] linked via Object.getPrototypeOf() or __proto__.", "Prototype chain terminates at null (Object.prototype.__proto__ === null).", "ES6 class is syntactic sugar over prototype delegation."] },
      { topic: "Performance Essentials", points: ["Debouncing: delay execution until user stops action for T ms (e.g. search input).", "Throttling: execute at most once every T ms (e.g. window resize/scroll).", "Event Delegation: single listener on parent exploiting event bubbling."] }
    ],
    topQuestions: [
      {
        q: "What is the output of: console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4);?",
        a: "Output: 1, 4, 3, 2. Synchronous code (1, 4) executes first. Microtask queue (Promise then -> 3) executes next before any macrotasks. Macrotask queue (setTimeout -> 2) executes last."
      },
      {
        q: "Explain Closures with a real practical example.",
        a: "A closure gives a function access to its outer scope even after the outer function finishes executing. Used for data privacy (e.g. private counter module, memoization cache, currying, rate limiters)."
      },
      {
        q: "Difference between == and ===, and null vs undefined?",
        a: "== checks loose equality with type coercion (e.g. '5' == 5 is true). === checks strict equality without coercion. undefined means a variable has been declared but not assigned a value. null is an explicit assignment representing absence of an object."
      },
      {
        q: "How does async/await work under the hood?",
        a: "async functions always return a Promise. await pauses execution of the async function non-blockingly until the Promise settles, yielding control back to the event loop. It is syntactic sugar built on Generators and Promises."
      },
      {
        q: "What are Web Storage APIs and their differences?",
        a: "localStorage (~5-10MB, persistent until explicitly cleared), sessionStorage (~5MB, cleared on tab close), Cookies (~4KB, sent with every HTTP request, supports HttpOnly/Secure flags)."
      }
    ],
    traps: [
      { trap: "typeof null returns 'object'", fix: "Historical JS bug from 1995. Use (x === null) to check for null." },
      { trap: "[1, 2, 10].sort() results in [1, 10, 2]", fix: "Default Array.prototype.sort() converts elements to strings. Always pass compare function: (a, b) => a - b." },
      { trap: "0.1 + 0.2 !== 0.3", fix: "Due to IEEE 754 floating point precision (equals 0.30000000000000004). Use Number.EPSILON or Math.round()." },
      { trap: "Arrow function as object method has undefined this", fix: "Arrow functions do not have their own this; use standard method syntax: { getName() { return this.name; } }." }
    ]
  },
  {
    id: "react",
    title: "React.js & Frontend Architecture",
    icon: "⚛️",
    badge: "Frontend Framework",
    duration: "40 mins",
    summary: "Component lifecycle, Virtual DOM diffing, Hooks ecosystem, and state optimization.",
    cheatSheet: [
      { topic: "Virtual DOM & Fiber", points: ["Virtual DOM is an in-memory lightweight representation of the real DOM.", "Reconciliation compares old and new VDOM trees using Fiber architecture with incremental rendering.", "Keys identify which items changed, were added, or removed; never use array index for dynamic lists."] },
      { topic: "React Hooks Rules", points: ["Only call hooks at the top level (never in loops, conditions, or nested functions).", "Only call hooks from React function components or custom hooks.", "Custom hooks must start with 'use' to enable linter checks."] },
      { topic: "State Optimization", points: ["useMemo caches computed values between re-renders.", "useCallback caches function definitions to prevent breaking child React.memo props.", "React.memo prevents re-rendering a component if its props haven't changed shallowly."] },
      { topic: "State Management", points: ["Props drilling -> Context API for lightweight global state (theme, auth).", "Zustand / Redux Toolkit for complex shared reactive data with decoupled actions."] }
    ],
    topQuestions: [
      {
        q: "How does React's Virtual DOM differ from the Real DOM?",
        a: "Real DOM updates are expensive because they trigger browser reflow and repaint. Virtual DOM performs in-memory diffing (reconciliation) and batches minimal updates into a single real DOM mutation."
      },
      {
        q: "What is the difference between useEffect, useLayoutEffect, and useMemo?",
        a: "useEffect runs asynchronously after DOM paint. useLayoutEffect runs synchronously immediately after DOM mutations before browser paint (use for measurements/flicker prevention). useMemo caches computed values during render."
      },
      {
        q: "Why should we avoid using array indexes as keys in React?",
        a: "If items are reordered, inserted, or deleted, index keys confuse React's diffing algorithm, leading to incorrect component state retention and unnecessary DOM re-renders."
      },
      {
        q: "Explain Controlled vs Uncontrolled components.",
        a: "Controlled: Form data is handled by React state (value + onChange). Uncontrolled: Form data is handled by the DOM itself and queried via useRef."
      }
    ],
    traps: [
      { trap: "State updates in React 18 are batched", fix: "React batches multiple setState calls into one render, even inside promises, timeouts, and native event handlers." },
      { trap: "Mutating state directly (e.g. state.push()) does not trigger re-render", fix: "Always return a new reference: setState([...state, newItem])." },
      { trap: "Missing dependencies in useEffect dependency array", fix: "Always list all variables used inside useEffect or use functional updates setState(prev => prev + 1)." }
    ]
  },
  {
    id: "dsa",
    title: "DSA & Problem Solving Patterns",
    icon: "📦",
    badge: "Coding Interview",
    duration: "60 mins",
    summary: "Master the top 14 algorithmic patterns that cover 90% of coding interview problems.",
    cheatSheet: [
      { topic: "Two Pointers & Sliding Window", points: ["Two pointers from ends: Sorted arrays, Two Sum II, Container With Most Water.", "Sliding Window: Longest substring, minimum size subarray, anagrams.", "Fast & Slow Pointers (Floyd's cycle detection): Linked list cycle, find middle node."] },
      { topic: "Trees & Graphs", points: ["Tree DFS (Preorder/Inorder/Postorder): Inorder of BST yields sorted array.", "Tree BFS (Level order): Use Queue, compute size at each level for height/level grouping.", "Graph BFS for shortest path in unweighted graphs; DFS for connected components/cycles.", "Topological Sort (Kahn's algorithm using indegree) for dependency resolution/course schedule."] },
      { topic: "Dynamic Programming", points: ["0/1 Knapsack: choice to take or leave element; compute dp[i][w].", "Longest Common Subsequence (LCS): match chars -> 1 + dp[i-1][j-1]; mismatch -> max(dp[i-1][j], dp[i][j-1]).", "Longest Increasing Subsequence (LIS): O(n^2) DP or O(n log n) with Patience Sorting / Binary Search."] }
    ],
    topQuestions: [
      {
        q: "How to detect a cycle in a Linked List in O(1) space?",
        a: "Use Floyd's Tortoise and Hare algorithm. Initialize slow and fast pointers at head. Move slow by 1 step and fast by 2 steps. If slow === fast, a cycle exists. If fast reaches null, no cycle."
      },
      {
        q: "Difference between BFS and DFS with their time and space complexities?",
        a: "Both have Time Complexity O(V + E). BFS uses a Queue (O(V) space) and finds shortest paths in unweighted graphs. DFS uses a Stack/Recursion (O(H) or O(V) space) and is best for backtracking, cycle detection, and topological sorting."
      },
      {
        q: "What is Kadane's Algorithm and when to use it?",
        a: "Kadane's algorithm finds the maximum subarray sum in O(n) time and O(1) space by maintaining maxEndingHere = max(num, maxEndingHere + num) and updating maxSoFar."
      }
    ],
    traps: [
      { trap: "Integer overflow in Binary Search mid calculation", fix: "Use mid = low + Math.floor((high - low) / 2) instead of (low + high) / 2." },
      { trap: "Modifying linked list node pointers before saving next node", fix: "Always store let next = curr.next before mutating curr.next = prev." },
      { trap: "Forgetting base case in recursion causes stack overflow", fix: "Always write the termination condition first (e.g. if (!root) return 0;)." }
    ]
  },
  {
    id: "oops",
    title: "Object-Oriented Programming (OOP)",
    icon: "🧱",
    badge: "Core CS",
    duration: "35 mins",
    summary: "The 4 pillars of OOP, SOLID principles, and common design patterns.",
    cheatSheet: [
      { topic: "The 4 Pillars", points: ["Encapsulation: Bundling data and methods while hiding internal details (private/public).", "Abstraction: Hiding complex implementation details and exposing simple interfaces.", "Inheritance: Mechanism where a child class acquires properties of parent class (code reuse).", "Polymorphism: One interface, multiple forms (Compile-time: Method Overloading; Runtime: Method Overriding)."] },
      { topic: "SOLID Principles", points: ["S: Single Responsibility (A class should have only one reason to change).", "O: Open/Closed (Open for extension, closed for modification).", "L: Liskov Substitution (Subtypes must be substitutable for their base types).", "I: Interface Segregation (Clients should not be forced to depend on unused interfaces).", "D: Dependency Inversion (Depend on abstractions, not concrete implementations)."] }
    ],
    topQuestions: [
      {
        q: "What is the difference between Method Overloading and Method Overriding?",
        a: "Overloading (Compile-time): Same method name with different parameters within the same class. Overriding (Runtime): Subclass provides a specific implementation of a method already defined in its superclass."
      },
      {
        q: "What is the difference between an Abstract Class and an Interface?",
        a: "Abstract class can have state (instance variables) and implemented methods; a class can extend only one abstract class. Interface defines a pure contract (default methods in Java 8+); a class can implement multiple interfaces."
      },
      {
        q: "Explain Composition over Inheritance with an example.",
        a: "Composition ('has-a') embeds an object inside another class rather than inheriting ('is-a'). It provides greater flexibility, avoids fragile base class issues, and allows dynamic behavior switching."
      }
    ],
    traps: [
      { trap: "JavaScript inheritance is prototypal, not classical", fix: "JS objects inherit directly from other objects via their prototype chain." },
      { trap: "Diamond Problem in multiple inheritance", fix: "Languages like Java avoid it by disallowing multiple class inheritance while allowing multiple interface implementation." }
    ]
  },
  {
    id: "sql",
    title: "SQL & Database Management (DBMS)",
    icon: "🗄️",
    badge: "Core CS & Backend",
    duration: "45 mins",
    summary: "ACID properties, Normalization (1NF-3NF), SQL Joins, Indexing B-Trees, and Transactions.",
    cheatSheet: [
      { topic: "ACID Properties", points: ["Atomicity: All operations in a transaction succeed or all roll back.", "Consistency: Database transitions from one valid state to another satisfying all constraints.", "Isolation: Concurrent transactions execute without interfering with each other.", "Durability: Once committed, data changes survive system crashes."] },
      { topic: "Normalization", points: ["1NF: Atomic values (no repeating groups/arrays in columns).", "2NF: In 1NF and no partial dependencies (every non-key attribute fully depends on entire primary key).", "3NF: In 2NF and no transitive dependencies (non-key attribute depends only on primary key)."] },
      { topic: "Indexing & Joins", points: ["B-Tree Indexes provide O(log N) lookups, range scans, and sorting.", "INNER JOIN: matching rows only. LEFT JOIN: all left rows + matching right rows.", "WHERE filters rows before aggregation; HAVING filters groups after GROUP BY."] }
    ],
    topQuestions: [
      {
        q: "Find the 2nd highest salary from an Employee table in SQL.",
        a: "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee); or using window function: SELECT salary FROM (SELECT salary, DENSE_RANK() OVER(ORDER BY salary DESC) as rnk FROM Employee) t WHERE rnk = 2 LIMIT 1;"
      },
      {
        q: "Difference between Clustered and Non-Clustered Index?",
        a: "Clustered Index determines physical storage order of rows (only 1 per table, usually Primary Key). Non-Clustered Index creates a separate lookup structure with pointers to actual data rows (multiple allowed)."
      },
      {
        q: "Difference between DELETE, TRUNCATE, and DROP?",
        a: "DELETE: DML command, deletes specific rows using WHERE, generates rollback logs, slower. TRUNCATE: DDL command, removes all rows by deallocating pages, faster, resets identity counter. DROP: DDL command, completely removes table definition and data."
      }
    ],
    traps: [
      { trap: "Using WHERE with aggregate functions", fix: "Aggregate functions (COUNT, SUM, AVG) cannot appear in WHERE; use HAVING." },
      { trap: "NULL comparisons using = NULL", fix: "NULL represents unknown value. Always use IS NULL or IS NOT NULL." }
    ]
  },
  {
    id: "os",
    title: "Operating Systems & Linux",
    icon: "🐧",
    badge: "Core CS",
    duration: "40 mins",
    summary: "Process vs Thread, Deadlocks, Virtual Memory Paging, Mutex vs Semaphore, and Linux shell.",
    cheatSheet: [
      { topic: "Process vs Thread", points: ["Process: Independent execution program with its own memory address space (PCB).", "Thread: Lightweight unit of execution sharing code, data, and files of parent process with its own stack and registers.", "Inter-Process Communication (IPC): Pipes, Sockets, Shared Memory, Message Queues."] },
      { topic: "Deadlocks & 4 Coffman Conditions", points: ["1. Mutual Exclusion (non-shareable resources).", "2. Hold and Wait (process holds resource while waiting for another).", "3. No Preemption (resources cannot be forcibly confiscated).", "4. Circular Wait (chain of processes each waiting for resource held by next).", "Prevention: Eliminate any one of these 4 conditions."] },
      { topic: "Memory Management", points: ["Paging: Divides virtual memory into fixed-size Pages and physical memory into Frames.", "Page Fault: CPU tries to access a virtual page not currently in physical RAM, triggering disk load.", "Thrashing: High paging activity where CPU spends more time swapping pages than executing instructions."] }
    ],
    topQuestions: [
      {
        q: "What is the difference between Mutex and Semaphore?",
        a: "Mutex (Mutual Exclusion): Locking mechanism with ownership (only the thread that locked it can unlock it). Semaphore: Signaling mechanism with a counter (Binary Semaphore is 0/1; Counting Semaphore manages access to N instances of a resource)."
      },
      {
        q: "Explain Virtual Memory and why it is needed.",
        a: "Virtual Memory gives processes the illusion of contiguous, large memory space larger than physical RAM by mapping virtual addresses to physical frames and using disk paging as backup."
      },
      {
        q: "Top 5 Linux commands every software engineer must know?",
        a: "1. ps aux / top / htop (process monitoring), 2. grep -rn 'pattern' . (recursive search), 3. chmod / chown (permissions & ownership), 4. netstat / lsof -i :port (port & network check), 5. tail -f /var/log/app.log (live log tailing)."
      }
    ],
    traps: [
      { trap: "Thread sharing stack", fix: "Threads share Heap, Code, and Data segments, but each thread has its OWN Stack and Program Counter." },
      { trap: "Starvation vs Deadlock", fix: "Deadlock is a permanent freeze among cyclic dependencies. Starvation is indefinite delay where low-priority tasks don't get CPU time." }
    ]
  },
  {
    id: "cn",
    title: "Computer Networks & Web Security",
    icon: "🌐",
    badge: "Core CS & Web",
    duration: "40 mins",
    summary: "OSI 7 Layers, TCP 3-way Handshake, HTTP/1/2/3, DNS flow, CORS, and XSS/CSRF security.",
    cheatSheet: [
      { topic: "OSI vs TCP/IP Layers", points: ["Application (HTTP/HTTPS, DNS, SSH, FTP)", "Transport (TCP reliable/connection-oriented vs UDP fast/unreliable)", "Network (IP addressing, routing)", "Data Link & Physical (MAC address, ethernet frames, electrical signals)."] },
      { topic: "TCP 3-Way Handshake", points: ["1. Client sends SYN (synchronize sequence number).", "2. Server responds with SYN-ACK.", "3. Client sends ACK (acknowledgment). Connection established."] },
      { topic: "Web Security Essentials", points: ["XSS (Cross-Site Scripting): Injecting malicious scripts into trusted websites; prevent via HTML escaping, Content Security Policy (CSP), HttpOnly cookies.", "CSRF (Cross-Site Request Forgery): Unauthorized commands transmitted from a trusted user; prevent via Anti-CSRF tokens, SameSite cookie attribute.", "CORS (Cross-Origin Resource Sharing): Browser security feature restricting cross-origin HTTP requests unless approved by server headers (Access-Control-Allow-Origin)."] }
    ],
    topQuestions: [
      {
        q: "What happens step-by-step when you type https://google.com in a browser and press Enter?",
        a: "1. Browser checks cache (browser, OS, router). 2. DNS query resolves domain to IP. 3. TCP 3-way handshake established. 4. TLS/SSL handshake for HTTPS encryption. 5. Browser sends HTTP GET request. 6. Server processes and sends HTTP response. 7. Browser parses HTML/CSS/JS, builds DOM tree, and renders page."
      },
      {
        q: "What is the difference between HTTP/1.1, HTTP/2, and HTTP/3?",
        a: "HTTP/1.1: Head-of-line blocking, 1 request per connection. HTTP/2: Multiplexing over single TCP connection, header compression (HPACK), server push. HTTP/3: Uses QUIC protocol over UDP to eliminate TCP head-of-line blocking and speed up handshakes."
      },
      {
        q: "Explain the difference between Symmetric and Asymmetric Encryption.",
        a: "Symmetric: Same secret key used for both encryption and decryption (e.g. AES, fast). Asymmetric: Public key encrypts, private key decrypts (e.g. RSA, ECC, used in SSL/TLS handshake to exchange symmetric session key)."
      }
    ],
    traps: [
      { trap: "CORS is a server restriction", fix: "CORS is enforced by the BROWSER to protect users, not by the server." },
      { trap: "HTTPS encrypts URL path and body, but not domain IP", fix: "DNS query and IP headers are visible, but the URL path, query params, headers, and payload are fully encrypted." }
    ]
  },
  {
    id: "backend",
    title: "Node.js, Express & System Architecture",
    icon: "🟩",
    badge: "Backend Engineering",
    duration: "40 mins",
    summary: "Node.js Libuv architecture, RESTful API design, JWT auth, Caching, and Microservices.",
    cheatSheet: [
      { topic: "Node.js Architecture", points: ["V8 engine executes JS; Libuv provides cross-platform async I/O via thread pool (default 4 threads).", "Event Loop Phases: Timers -> Pending Callbacks -> Idle/Prepare -> Poll (I/O) -> Check (setImmediate) -> Close Callbacks.", "process.nextTick() and Microtasks run between every event loop phase."] },
      { topic: "API & Auth Architecture", points: ["RESTful Principles: Stateless, resource-oriented URIs, standard HTTP verbs (GET, POST, PUT, PATCH, DELETE).", "JWT Token Flow: Access token (short-lived, in memory/cookie) + Refresh token (long-lived, in HttpOnly cookie, stored in DB/Redis for revocation).", "Status Codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized (no auth), 403 Forbidden (authenticated but lacks permission), 404 Not Found, 500 Internal Error."] },
      { topic: "Caching & Scaling", points: ["Redis Cache-Aside pattern: Read cache first; on cache miss, query DB and populate cache with TTL.", "Horizontal scaling: Multiple app instances behind Nginx / AWS ALB load balancer.", "Cluster module / PM2 uses IPC and round-robin to utilize all CPU cores."] }
    ],
    topQuestions: [
      {
        q: "Is Node.js completely single-threaded?",
        a: "JavaScript execution in Node.js runs on a single main thread. However, Node uses Libuv's C++ worker thread pool for heavy asynchronous tasks (file system I/O, DNS lookup, crypto operations, compression)."
      },
      {
        q: "Difference between setImmediate() and setTimeout(..., 0)?",
        a: "setTimeout(..., 0) runs in the Timers phase after minimum 1ms threshold. setImmediate() runs in the Check phase immediately after the Poll (I/O) phase. Within an I/O cycle, setImmediate always executes first."
      },
      {
        q: "How to prevent SQL Injection and NoSQL Injection in backend APIs?",
        a: "SQL: Use Parameterized queries / Prepared statements or ORMs (never concatenate raw user input into query strings). NoSQL: Sanitize input (e.g. mongo-sanitize) to strip '$' and '.' operators."
      }
    ],
    traps: [
      { trap: "CPU-heavy tasks block Node.js event loop", fix: "Offload CPU-intensive computation to Worker Threads (worker_threads module) or dedicated microservices." },
      { trap: "Storing JWT secret or sensitive API keys in source code", fix: "Always use environment variables (.env) with dotenv and secret management vaults." }
    ]
  },
  {
    id: "systemdesign",
    title: "System Design & Cloud Architecture",
    icon: "🏗️",
    badge: "High-Level Design",
    duration: "45 mins",
    summary: "CAP Theorem, Load Balancing, Microservices, Caching, Sharding, and Messaging Queues.",
    cheatSheet: [
      { topic: "CAP Theorem", points: ["Consistency: Every read receives the most recent write or an error.", "Availability: Every request receives a non-error response without guarantee of latest write.", "Partition Tolerance: System continues operating despite network packet loss/partition.", "In a distributed system with network partitions, you can only pick CP or AP."] },
      { topic: "Scaling & Data Partitioning", points: ["Vertical: Upgrade CPU/RAM of single server. Horizontal: Add more commodity servers.", "Sharding: Horizontally partitioning DB rows across multiple databases by Shard Key.", "Consistent Hashing: Distributes data across N nodes using a hash ring, minimizing key relocation when nodes join/leave."] },
      { topic: "Message Queues & Streams", points: ["Message Queue (RabbitMQ / SQS): Point-to-point worker task distribution, message deleted on consumer ack.", "Event Stream (Apache Kafka): Distributed append-only log with topic partitions, high throughput, replayable by offset."] }
    ],
    topQuestions: [
      {
        q: "How to design a URL Shortener (e.g. TinyURL) in 5 steps?",
        a: "1. Requirements: Shorten long URL, redirect in <50ms, 100M URLs/month. 2. Capacity: 100M * 500 bytes = 50GB/mo. 3. Encoding: Base62 (a-z, A-Z, 0-9) of unique auto-increment 64-bit ID gives 62^7 ~ 3.5 Trillion unique 7-char URLs. 4. DB: NoSQL key-value store (MongoDB/Cassandra) or PostgreSQL with (shortKey, longUrl, createdAt). 5. Caching: Redis cache for top 20% most requested URLs."
      },
      {
        q: "What is the difference between SQL Sharding and Master-Slave Replication?",
        a: "Replication: Master handles writes and streams logs to Read-Only Slaves (scales read throughput). Sharding: Splits dataset across multiple independent database nodes based on shard key (scales write throughput and storage size)."
      },
      {
        q: "Explain CDN and when to use it.",
        a: "Content Delivery Network: Geographically distributed network of edge proxy servers that caches static assets (images, videos, JS/CSS, HTML) close to users to reduce latency and origin server load."
      }
    ],
    traps: [
      { trap: "Single Point of Failure (SPOF)", fix: "Always design redundancy at every layer (multiple load balancers with VRRP, multi-AZ database replicas)." },
      { trap: "Cache Stampede / Thundering Herd", fix: "Use mutex locks on cache miss so only one request queries the database while others wait for cache fill." }
    ]
  }
];
