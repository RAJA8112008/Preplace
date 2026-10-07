/* ==========================================================================
   Preplace — 1-Night Placement Quantum Series
   Crystal-Clear, High-Yield Placement Cheat Sheets with Code & Direct Explanations
   ========================================================================== */

window.PREP_QUANTUM = [
  {
    id: "javascript",
    title: "JavaScript Core",
    icon: "🟨",
    badge: "Frontend Core",
    duration: "40 mins",
    summary: "How JavaScript runs in the browser: Event Loop, Closures, Scope, 'this', and Promises made crystal clear with real code.",
    cheatSheet: [
      {
        topic: "Event Loop & Execution Order",
        desc: "JS is single-threaded. Synchronous code runs first, then microtasks (Promises), then macrotasks (Timers).",
        code: `console.log("1. Sync Start");

setTimeout(() => {
  console.log("4. Macrotask (Timer)");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Microtask (Promise)");
});

console.log("2. Sync End");
// Output order: 1 -> 2 -> 3 -> 4`,
        points: [
          "Call Stack: Runs synchronous line-by-line statements immediately.",
          "Microtasks (High Priority): Promise .then(), await, queueMicrotask — always run before timers.",
          "Macrotasks (Normal Priority): setTimeout, setInterval, DOM events, fetch callbacks."
        ]
      },
      {
        topic: "var vs let vs const (Scope & TDZ)",
        desc: "Scope dictates where variables live in memory. Always default to const, then let.",
        code: `// var leaks out of block scope!
if (true) {
  var user = "Raj";
  let age = 22;
}
console.log(user); // "Raj" (Leaked outside!)
// console.log(age); // ReferenceError (Safe inside block)

// Temporal Dead Zone (TDZ):
// console.log(score); // Cannot access before init
let score = 100;`,
        points: [
          "var: Function-scoped, hoisted as undefined, can be redeclared (dangerous).",
          "let: Block-scoped { }, reassignable, lives in Temporal Dead Zone until initialized.",
          "const: Block-scoped, immutable reference (object keys can still change)."
        ]
      },
      {
        topic: "Closures (Functions with Memory)",
        desc: "An inner function retains access to variables from its parent function even after the parent returns.",
        code: `function createCounter(initial = 0) {
  let count = initial; // Private variable (encapsulated)
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count
  };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.getValue());  // 11 (Private memory preserved)`,
        points: [
          "Preserves private state without polluting the global scope.",
          "Essential for memoization caches, currying, and custom React hooks.",
          "Watch out for memory leaks if unused closures hold giant objects."
        ]
      },
      {
        topic: "The 'this' Keyword & Arrow Functions",
        desc: "'this' refers to WHO executed the function. Arrow functions do NOT have their own 'this'.",
        code: `const person = {
  name: "Raj Kumar",
  regularFunc: function() {
    return \`Hello \${this.name}\`; // 'this' points to person
  },
  arrowFunc: () => {
    return \`Hello \${this?.name}\`; // 'this' is global/undefined!
  }
};

console.log(person.regularFunc()); // "Hello Raj Kumar"
console.log(person.arrowFunc());   // "Hello undefined"`,
        points: [
          "Regular functions: 'this' dynamically binds to the calling object.",
          "Arrow functions: Lexically inherit 'this' from surrounding context at creation.",
          "Use .bind(ctx), .call(ctx, ...args), .apply(ctx, [args]) for explicit binding."
        ]
      },
      {
        topic: "Debounce Implementation",
        desc: "Delays execution until the user stops triggering the event for N milliseconds (e.g. Search bar).",
        code: `function debounce(fn, delayMs = 300) {
  let timerId;
  return function(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delayMs);
  };
}

// Usage with search input:
const onSearch = debounce((q) => console.log("API fetch for:", q), 300);`,
        points: [
          "Debounce: Runs ONCE after user pauses (search suggestions, window resize).",
          "Throttle: Runs at most once every N ms during continuous events (scroll, mouse move).",
          "Prevents thousands of duplicate API requests and UI lag."
        ]
      }
    ],
    topQuestions: [
      {
        q: "What is the output of: console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4);?",
        a: "Answer: 1, 4, 3, 2.\n\nWhy it happens:\n1. console.log(1) and console.log(4) run synchronously first on the Call Stack.\n2. Promise.then() is placed into the Microtask Queue.\n3. setTimeout is placed into the Macrotask Queue.\n4. Microtasks (3) ALWAYS execute before Macrotasks (2)."
      },
      {
        q: "Explain Closures in simple words with a practical use case.",
        a: "A closure is when an inner function remembers and has access to variables from its outer function even after the outer function has finished executing.\n\nPractical use cases:\n1. Data privacy (encapsulating private counters or tokens).\n2. Factory functions and function currying (e.g. multiplyBy(5)(10)).\n3. Event handlers and custom hooks in React."
      },
      {
        q: "What is the difference between == and ===?",
        a: "== (Loose Equality): Performs type coercion (converts types before comparing, so '5' == 5 is true, and null == undefined is true).\n\n=== (Strict Equality): Compares both value AND data type without converting ('5' === 5 is false because string !== number).\n\nRule of thumb: Always use === to prevent unexpected JavaScript coercion bugs."
      },
      {
        q: "What is the difference between null and undefined?",
        a: "• undefined: A variable has been declared, but has not yet been assigned any value (e.g., let x;).\n• null: An intentional assignment representing the explicit absence of any object or value (e.g., let user = null;)."
      },
      {
        q: "How does async / await work in JavaScript under the hood?",
        a: "async/await is built on top of JavaScript Promises and Generators:\n• Marking a function with 'async' makes it always return a Promise.\n• Using 'await' suspends execution of that async function until the Promise resolves or rejects, yielding control back to the Event Loop so the browser screen stays responsive."
      }
    ],
    traps: [
      { trap: "typeof null returns 'object'", fix: "This is a famous historical bug in JS since 1995. To check if a value is really null, always use strict check: (x === null)." },
      { trap: "[1, 2, 10].sort() results in [1, 10, 2]", fix: "By default, Array.prototype.sort() converts numbers to strings ('10' comes before '2'). Always pass a compare function: arr.sort((a, b) => a - b)." },
      { trap: "0.1 + 0.2 === 0.3 returns false", fix: "Computers store floating-point numbers in binary representation, yielding 0.30000000000000004. Use Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON." },
      { trap: "Using 'this' inside an arrow function inside an object literal", fix: "Arrow functions do not bind 'this' to the enclosing object. Use standard method shorthand: sayHello() { return this.name; }." }
    ]
  },
  {
    id: "react",
    title: "React.js Essentials",
    icon: "⚛️",
    badge: "Frontend Framework",
    duration: "40 mins",
    summary: "Virtual DOM diffing, component lifecycle, Hooks rules, state batching, and memoization patterns.",
    cheatSheet: [
      {
        topic: "Virtual DOM & Reconciliation",
        desc: "React maintains a lightweight JS representation of the DOM to compute minimal changes.",
        code: `// React creates a lightweight virtual tree:
const element = {
  type: "button",
  props: { className: "btn-primary", children: "Submit" }
};

// When state updates:
// 1. Render new Virtual DOM tree
// 2. Diff with previous Virtual DOM tree (Reconciliation)
// 3. Batch apply minimal changes to Real DOM in one repaint!`,
        points: [
          "Direct real DOM mutations cause browser layout recalculations (reflow) which are slow.",
          "Diffing algorithm operates in O(N) time using heuristic rules and element keys.",
          "Batching groups multiple setState calls into a single render pass."
        ]
      },
      {
        topic: "Core Hooks (useState & useEffect)",
        desc: "The primary hooks for managing local component state and side-effects.",
        code: `import { useState, useEffect } from "react";

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => { if (isMounted) { setUser(data); setLoading(false); } });

    return () => { isMounted = false; }; // Cleanup on unmount/re-run
  }, [userId]); // Runs only when userId changes

  if (loading) return <p>Loading...</p>;
  return <h2>{user.name}</h2>;
}`,
        points: [
          "useState setter is asynchronous: use functional update setCount(prev => prev + 1).",
          "useEffect dependency array: [] = mount once, [dep] = run on change, omitted = every render.",
          "Always return a cleanup function to cancel pending network requests or timers."
        ]
      },
      {
        topic: "Performance: useMemo & useCallback",
        desc: "Avoid expensive recalculations and prevent unnecessary child re-renders.",
        code: `import { useMemo, useCallback, useState } from "react";

function ProductList({ items, onItemSelect }) {
  const [query, setQuery] = useState("");

  // Remembers the filtered list unless items or query change:
  const filtered = useMemo(() => {
    return items.filter(item => item.name.toLowerCase().includes(query));
  }, [items, query]);

  // Remembers function reference so child doesn't re-render:
  const handleSelect = useCallback((id) => {
    onItemSelect(id);
  }, [onItemSelect]);

  return <List items={filtered} onSelect={handleSelect} />;
}`,
        points: [
          "useMemo caches the RESULT of a calculation.",
          "useCallback caches the FUNCTION instance.",
          "Use with React.memo on child components to stop unnecessary re-renders."
        ]
      },
      {
        topic: "Controlled vs Uncontrolled Components",
        desc: "Controlled uses React state; Uncontrolled relies on direct DOM refs.",
        code: `// Controlled: Single source of truth in React state
function ControlledInput() {
  const [val, setVal] = useState("");
  return <input value={val} onChange={(e) => setVal(e.target.value)} />;
}

// Uncontrolled: State lives in browser DOM, read via ref
function UncontrolledInput() {
  const inputRef = useRef(null);
  const handleSubmit = () => alert(inputRef.current.value);
  return <input ref={inputRef} defaultValue="" />;
}`,
        points: [
          "Controlled: Preferred for forms, validation, dynamic disable states.",
          "Uncontrolled: Great for file inputs, high-frequency animations, third-party libraries."
        ]
      }
    ],
    topQuestions: [
      {
        q: "Why is the Virtual DOM faster than directly updating the real DOM?",
        a: "Direct real DOM mutations force the browser to recalculate element geometries, reflow layouts, and repaint pixels repeatedly.\n\nThe Virtual DOM is a fast JavaScript memory representation. React diffs the previous and new virtual trees, calculates the minimal required changes, and applies them in a single optimized batch update."
      },
      {
        q: "What are the Rules of Hooks in React?",
        a: "1. Only call Hooks at the top level of your component (never inside if-conditions, loops, or nested functions).\n2. Only call Hooks from React function components or custom Hooks.\n3. Custom Hook names must start with 'use' (e.g. useAuth, useDebounce)."
      },
      {
        q: "What is Prop Drilling and how do you prevent it?",
        a: "Prop drilling is passing props through multiple levels of intermediate components that don't need the data themselves.\n\nSolutions:\n1. React Context API (ideal for auth user, theme, locale).\n2. State management libraries (Zustand, Redux Toolkit).\n3. Component composition (passing JSX children directly)."
      },
      {
        q: "What is the role of the 'key' prop in React lists?",
        a: "The 'key' prop gives each list item a stable identity across renders. When items are inserted, deleted, or reordered, React uses the key to identify which elements to move or update instead of re-creating the entire DOM list from scratch."
      }
    ],
    traps: [
      { trap: "Direct state mutation: state.push(item)", fix: "React uses reference equality to detect changes. Always pass a new array: setState([...state, item])." },
      { trap: "Calling setState multiple times expecting instant values", fix: "State updates are batched. Use functional updater: setCount(prev => prev + 1)." },
      { trap: "Infinite loop in useEffect", fix: "Updating state inside useEffect without a dependency array causes re-render -> useEffect triggers -> infinite loop." }
    ]
  },
  {
    id: "dsa",
    title: "DSA & Coding Patterns",
    icon: "📦",
    badge: "Coding Round",
    duration: "60 mins",
    summary: "The essential interview coding patterns: Two Pointers, Sliding Window, Fast & Slow, Binary Search, and Graph BFS/DFS.",
    cheatSheet: [
      {
        topic: "1. Two Pointers Pattern",
        desc: "Two pointer indices moving towards each other or in lockstep on a sorted sequence.",
        code: `// Two Sum on a SORTED array (O(N) Time, O(1) Space)
function twoSumSorted(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;  // Need bigger sum
    else right--;              // Need smaller sum
  }
  return [];
}`,
        points: [
          "Prerequisite: Array must be sorted (or work inward from both ends).",
          "Reduces brute force O(N^2) pair matching to O(N) linear time.",
          "Classic problems: Valid Palindrome, 3Sum, Container With Most Water."
        ]
      },
      {
        topic: "2. Sliding Window Pattern",
        desc: "Maintain a dynamic window [L...R] over a sequence to find optimal subarrays.",
        code: `// Longest Substring Without Repeating Characters (O(N) Time)
function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let maxLen = 0, left = 0;
  
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (seen.has(char) && seen.get(char) >= left) {
      left = seen.get(char) + 1; // Shrink window past duplicate
    }
    seen.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
        points: [
          "Expand window with right pointer; shrink invalid window with left pointer.",
          "Avoids recomputing overlapping subarrays from scratch.",
          "Classic problems: Minimum Window Substring, Max Sum Subarray of Size K."
        ]
      },
      {
        topic: "3. Fast & Slow Pointers (Floyd's Cycle)",
        desc: "Pointers moving at different speeds to detect cycles or find list midpoints in one pass.",
        code: `// Detect Cycle in Linked List (O(N) Time, O(1) Space)
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;         // 1 step
    fast = fast.next.next;    // 2 steps
    if (slow === fast) return true; // Cycle detected!
  }
  return false;
}`,
        points: [
          "If a cycle exists, fast pointer will always catch up to slow pointer inside the loop.",
          "To find middle node: When fast reaches end, slow is exactly at the midpoint.",
          "Classic problems: Linked List Cycle I/II, Middle of Linked List, Happy Number."
        ]
      },
      {
        topic: "4. Binary Search (Search Space Reduction)",
        desc: "Divide sorted search space in half each iteration for O(log N) efficiency.",
        code: `// Standard Binary Search with overflow-safe midpoint
function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2); // Avoid overflow
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
        points: [
          "Applicable whenever the search space exhibits a monotonic property (T, T, T, F, F).",
          "Binary Search on Answer: Koko Eating Bananas, Capacity to Ship Packages.",
          "Time Complexity: O(log N), Space: O(1)."
        ]
      }
    ],
    topQuestions: [
      {
        q: "How do you reverse a Singly Linked List in O(N) time and O(1) space?",
        a: "Maintain three pointers: prev (initialized to null), curr (head), and next.\n\nWhile curr is not null:\n1. next = curr.next (save reference to rest of list)\n2. curr.next = prev (reverse the pointer direction)\n3. prev = curr (advance prev)\n4. curr = next (advance curr)\n\nReturn prev as the new head of the reversed list."
      },
      {
        q: "What is Kadane's Algorithm for Maximum Subarray Sum?",
        a: "Kadane's algorithm scans through the array in O(N) time while keeping two variables:\n• currentSum = Math.max(num, currentSum + num)\n• maxSum = Math.max(maxSum, currentSum)\n\nIf currentSum drops below 0, starting a new subarray from the current number is always superior to carrying forward a negative sum."
      },
      {
        q: "What is the difference between BFS and DFS?",
        a: "• BFS (Breadth-First Search): Uses a FIFO Queue. Traverses level-by-level. Ideal for finding shortest paths in unweighted graphs.\n• DFS (Depth-First Search): Uses Recursion or a LIFO Stack. Explores deeply along each branch before backtracking. Ideal for topological sort, cycle detection, and maze solving."
      }
    ],
    traps: [
      { trap: "Forgetting base cases in tree recursion", fix: "Always write your termination check first: if (!root) return 0; to prevent Maximum Call Stack Exceeded." },
      { trap: "Assuming array is sorted before running Two Pointers", fix: "Two Pointers from opposing ends requires a sorted sequence. Verify with interviewer or call .sort()." },
      { trap: "Integer overflow on mid calculation (low + high) / 2", fix: "Always compute mid as low + Math.floor((high - low) / 2) to avoid 32-bit integer overflow in languages like C++/Java." }
    ]
  },
  {
    id: "oops",
    title: "OOPs (Object Oriented Programming)",
    icon: "🧱",
    badge: "Core CS",
    duration: "35 mins",
    summary: "The 4 Pillars, SOLID design principles, method overriding, and clean architecture.",
    cheatSheet: [
      {
        topic: "The 4 Pillars of OOP",
        desc: "The fundamental building blocks of object-oriented design.",
        code: `// Encapsulation & Inheritance Example:
class BankAccount {
  #balance = 0; // Private field (Encapsulation)

  constructor(owner, initialBalance) {
    this.owner = owner;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount > 0) this.#balance += amount;
  }

  getBalance() { return this.#balance; } // Abstraction
}

class SavingsAccount extends BankAccount { // Inheritance
  addInterest(rate) {
    const interest = this.getBalance() * rate;
    this.deposit(interest);
  }
}`,
        points: [
          "Encapsulation: Bundling data and methods into a single unit while hiding internal fields.",
          "Abstraction: Exposing only high-level interfaces while hiding low-level implementation details.",
          "Inheritance: Reusing common behavior from parent classes.",
          "Polymorphism: Overloading (compile-time) and Overriding (runtime) methods."
        ]
      },
      {
        topic: "SOLID Principles in Practice",
        desc: "Five design guidelines for maintainable, decoupled code.",
        code: `// Single Responsibility (S): Class does one specific job
class Invoice { calculateTotal() { /* ... */ } }
class InvoiceRepository { saveToDB(invoice) { /* ... */ } }
class EmailService { sendInvoice(invoice) { /* ... */ } }

// Open/Closed (O): Extend without modifying existing code
class PaymentProcessor {
  process(paymentMethod, amount) {
    return paymentMethod.pay(amount); // Polymorphic execution
  }
}`,
        points: [
          "S: Single Responsibility — A class should have only one reason to change.",
          "O: Open/Closed — Open for extension, closed for modification.",
          "L: Liskov Substitution — Derived classes must be substitutable for base classes.",
          "I: Interface Segregation — Many client-specific interfaces are better than one general interface.",
          "D: Dependency Inversion — Depend on abstractions, not concrete implementations."
        ]
      }
    ],
    topQuestions: [
      {
        q: "What is the difference between Method Overloading and Method Overriding?",
        a: "• Overloading: Multiple methods in the same class share the same name but have different parameter types or counts (Compile-time polymorphism).\n• Overriding: A subclass provides its own specific implementation of a method defined in its superclass with the exact same signature (Runtime polymorphism)."
      },
      {
        q: "What is the difference between an Abstract Class and an Interface?",
        a: "• Abstract Class: Can contain both concrete methods with implementation and abstract methods. Supports member variables and state. A class can inherit only one class.\n• Interface: A pure contract of method signatures without state. A class can implement multiple interfaces."
      },
      {
        q: "What is the Diamond Problem and how is it resolved?",
        a: "When a class inherits from two parent classes that both inherit from a common superclass and override the same method, the compiler cannot know which parent method to invoke.\n\nLanguages like Java and C# solve this by prohibiting multiple class inheritance and using interfaces instead."
      }
    ],
    traps: [
      { trap: "Favoring Deep Inheritance over Composition", fix: "Deep inheritance trees create rigid, fragile code. Prefer Composition ('has-a') over Inheritance ('is-a')." },
      { trap: "Thinking JavaScript has classical class inheritance", fix: "JavaScript classes are syntax sugar over prototype-based inheritance (Objects inherit directly from other Objects via __proto__)." }
    ]
  },
  {
    id: "sql",
    title: "SQL & Databases (DBMS)",
    icon: "🗄️",
    badge: "Core CS & Backend",
    duration: "40 mins",
    summary: "ACID transactions, Joins, B-Tree Indexing, Normalization (1NF to 3NF), and top interview queries.",
    cheatSheet: [
      {
        topic: "ACID Properties & Transactions",
        desc: "Guarantees that database transactions are processed reliably.",
        code: `BEGIN TRANSACTION;

-- Step 1: Deduct $100 from Alice
UPDATE Accounts SET balance = balance - 100 WHERE user_id = 1;

-- Step 2: Add $100 to Bob
UPDATE Accounts SET balance = balance + 100 WHERE user_id = 2;

-- If any step fails, ROLLBACK; otherwise commit permanently:
COMMIT;`,
        points: [
          "Atomicity: All operations succeed together or all roll back (All or Nothing).",
          "Consistency: Data adheres to all schema rules, constraints, and cascades.",
          "Isolation: Concurrent transactions run independently without dirty reads.",
          "Durability: Committed data survives system crashes and power loss."
        ]
      },
      {
        topic: "SQL Joins Visualized",
        desc: "Combining columns from one or more tables based on related keys.",
        code: `-- INNER JOIN: Only matching records in BOTH tables
SELECT u.name, o.order_id 
FROM Users u
INNER JOIN Orders o ON u.id = o.user_id;

-- LEFT JOIN: ALL users, plus matching orders (NULL if none)
SELECT u.name, o.order_id 
FROM Users u
LEFT JOIN Orders o ON u.id = o.user_id;`,
        points: [
          "INNER JOIN: Intersection of both tables.",
          "LEFT JOIN: All rows from left table + matched right rows.",
          "FULL OUTER JOIN: All rows from both tables, filling NULLs."
        ]
      },
      {
        topic: "Top Interview SQL Queries",
        desc: "Window functions and subqueries frequently tested in technical rounds.",
        code: `-- 2nd Highest Salary using DENSE_RANK() Window Function:
SELECT salary FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk
  FROM Employees
) WHERE rnk = 2 LIMIT 1;

-- Find Duplicate Records:
SELECT email, COUNT(*) as count 
FROM Users 
GROUP BY email 
HAVING COUNT(*) > 1;`,
        points: [
          "DENSE_RANK() handles tied values without skipping rank numbers.",
          "WHERE filters rows BEFORE grouping; HAVING filters groups AFTER aggregation.",
          "Indexes on foreign keys speed up JOIN and WHERE lookups from O(N) to O(log N)."
        ]
      }
    ],
    topQuestions: [
      {
        q: "What is the difference between WHERE and HAVING in SQL?",
        a: "• WHERE: Filters individual rows BEFORE grouping and aggregation functions run.\n• HAVING: Filters grouped results AFTER GROUP BY and aggregate functions (COUNT, SUM, AVG) are computed."
      },
      {
        q: "What is the difference between DELETE, TRUNCATE, and DROP?",
        a: "• DELETE: DML command. Removes specific rows with WHERE clause. Logs each deleted row for rollback. Slower.\n• TRUNCATE: DDL command. Instantly wipes all rows by deallocating data pages. Cannot use WHERE. Resets auto-increment ID.\n• DROP: DDL command. Permanently destroys the entire table schema and data."
      },
      {
        q: "How does a B-Tree Index improve query performance?",
        a: "Without an index, the database performs a Full Table Scan (O(N) disk reads). A B-Tree index maintains a sorted, self-balancing search tree on disk, allowing point lookups and range scans in O(log N) disk I/O operations."
      }
    ],
    traps: [
      { trap: "Using = NULL in WHERE clauses", fix: "In SQL, NULL represents an unknown value. Comparison x = NULL is never true. Always use IS NULL or IS NOT NULL." },
      { trap: "Over-indexing write-heavy tables", fix: "While indexes accelerate SELECT queries, every INSERT/UPDATE/DELETE requires updating all associated indexes, degrading write throughput." }
    ]
  },
  {
    id: "os",
    title: "Operating Systems & Linux",
    icon: "🐧",
    badge: "Core CS",
    duration: "35 mins",
    summary: "Process vs Thread, Deadlocks, Virtual Memory Paging, Mutex vs Semaphore, and essential Linux commands.",
    cheatSheet: [
      {
        topic: "Process vs Thread",
        desc: "Processes are isolated execution environments; Threads are lightweight workers inside a process.",
        code: `// Multi-threading conceptual memory map:
// [Process Memory]
//   ├── Code Segment (Shared across threads)
//   ├── Data Segment & Globals (Shared)
//   ├── Heap Memory (Shared dynamic allocations)
//   ├── Thread 1 -> Private Stack + Program Counter
//   └── Thread 2 -> Private Stack + Program Counter`,
        points: [
          "Process: Has its own virtual address space; inter-process communication (IPC) requires sockets or pipes.",
          "Thread: Shares heap memory and globals with peer threads; communication is fast via shared memory.",
          "Threads require synchronization (Mutex) to prevent race conditions."
        ]
      },
      {
        topic: "Deadlocks & The 4 Coffman Conditions",
        desc: "A permanent freeze where processes wait indefinitely for resources held by each other.",
        code: `// The 4 Coffman Conditions:
// 1. Mutual Exclusion  : Resource held exclusively by 1 process
// 2. Hold and Wait     : Process holds resource A while waiting for B
// 3. No Preemption     : Resource cannot be forcibly taken
// 4. Circular Wait     : P1 -> P2 -> P3 -> P1 (Cycle)

// Deadlock Prevention: Break any ONE of the four conditions (e.g. strict resource ordering).`,
        points: [
          "Deadlock Prevention: Disallow one of the 4 Coffman conditions at design time.",
          "Deadlock Avoidance: Banker's Algorithm dynamically verifies if granting a resource keeps the system in a Safe State.",
          "Deadlock Detection & Recovery: Detect cycles via Resource Allocation Graph and kill offending processes."
        ]
      },
      {
        topic: "Top 5 Essential Linux Commands",
        desc: "The most commonly tested terminal commands in developer technical rounds.",
        code: `# 1. Search text recursively inside all code files:
grep -rn "API_KEY" ./src/

# 2. Check which process is occupying port 5000:
lsof -i :5000  # Or: netstat -tulnp | grep 5000

# 3. Inspect live streaming logs:
tail -f -n 100 /var/log/app.log

# 4. Monitor CPU and Memory consumption per process:
top -b -n 1 | head -n 20

# 5. Modify file permissions (User: RWX, Group: RX, Others: RX):
chmod 755 server.sh`,
        points: [
          "grep / find: Fast file and text searching.",
          "lsof / netstat: Inspect active network sockets and port bindings.",
          "ps aux / top: Monitor background processes and system load."
        ]
      }
    ],
    topQuestions: [
      {
        q: "What is Context Switching in an Operating System?",
        a: "Context switching is the procedure where the CPU saves the execution state (registers, program counter, stack pointer) of the currently running process or thread, and loads the saved context of another process so multiple tasks share the CPU cores."
      },
      {
        q: "What is the difference between a Mutex and a Semaphore?",
        a: "• Mutex (Mutual Exclusion): A locking mechanism with ownership. Only the single thread that acquired the mutex can unlock it (binary 0 or 1).\n• Semaphore: A signaling mechanism with an integer counter representing available resource slots. Any thread can signal (increment) or wait (decrement) on the semaphore."
      },
      {
        q: "What is Thrashing in Virtual Memory?",
        a: "Thrashing occurs when the system lacks sufficient physical RAM to hold active process working sets. As a result, the OS spends the vast majority of its time swapping pages between RAM and disk (Page Fault handling) rather than executing meaningful application instructions."
      }
    ],
    traps: [
      { trap: "Confusing Deadlock with Starvation", fix: "Deadlock is a permanent freeze due to circular resource dependency. Starvation is where low-priority tasks wait indefinitely because higher-priority tasks continually claim the CPU." },
      { trap: "Assuming Threads have isolated Heap memory", fix: "All threads inside the same process share the identical Heap and Global variables. Only the Stack and CPU Registers are private per thread." }
    ]
  },
  {
    id: "cn",
    title: "Computer Networks & Security",
    icon: "🌐",
    badge: "Core CS & Web",
    duration: "35 mins",
    summary: "OSI 7 Layers, TCP 3-way Handshake, HTTP vs HTTPS, DNS resolution, and Web Security.",
    cheatSheet: [
      {
        topic: "What Happens When You Type google.com & Enter?",
        desc: "The complete step-by-step journey of a web request from browser to server.",
        code: `// 1. DNS Resolution:
// Browser Cache -> OS Cache -> Router -> ISP Recursive DNS -> Root/TLD -> IP: 142.250.190.46

// 2. TCP 3-Way Handshake:
// Client --- SYN ---> Server
// Client <--- SYN-ACK --- Server
// Client --- ACK ---> Server (Connection Established)

// 3. TLS / HTTPS Handshake (Exchange symmetric session keys)
// 4. HTTP GET / -> Server processes request and returns HTML/CSS/JS
// 5. Browser parses HTML -> Builds DOM Tree -> Renders UI on screen`,
        points: [
          "DNS transforms human readable domain names into routable IP addresses.",
          "TCP provides reliable, ordered packet delivery with flow control.",
          "TLS encrypts communication using asymmetric cryptography during handshake, then symmetric session keys for throughput."
        ]
      },
      {
        topic: "Web Security: XSS vs CSRF vs CORS",
        desc: "The critical web vulnerabilities every developer must understand.",
        code: `// XSS Prevention: Sanitize inputs & store tokens in HttpOnly cookies
res.cookie("jwt", token, {
  httpOnly: true, // JS cannot read document.cookie
  secure: true,   // Transmitted over HTTPS only
  sameSite: "strict" // Blocks CSRF requests!
});

// CORS: Server declares allowed frontend origins
app.use(cors({ origin: "https://prepplace.dev" }));`,
        points: [
          "XSS (Cross-Site Scripting): Attacker injects malicious JS into site. Fix: Sanitize input & use HttpOnly cookies.",
          "CSRF (Cross-Site Request Forgery): Trick logged-in user into sending unauthorized requests. Fix: SameSite cookies & Anti-CSRF tokens.",
          "CORS: Browser policy that restricts web apps from requesting resources from different domains."
        ]
      }
    ],
    topQuestions: [
      {
        q: "What is the difference between TCP and UDP?",
        a: "• TCP: Connection-oriented, guarantees packet arrival in order, performs error checking and retransmission (HTTP, SSH, Email).\n• UDP: Connectionless, sends packets with zero guarantees, minimal overhead and low latency (Live streaming, VoIP calls, online gaming)."
      },
      {
        q: "What are the common HTTP status codes every developer must know?",
        a: "• 200 OK: Request succeeded.\n• 201 Created: New resource created.\n• 400 Bad Request: Invalid input data from client.\n• 401 Unauthorized: Unauthenticated (missing/invalid token).\n• 403 Forbidden: Authenticated, but lacks required permissions.\n• 404 Not Found: Resource does not exist.\n• 500 Internal Server Error: Backend unhandled exception."
      }
    ],
    traps: [
      { trap: "Believing CORS is a backend security firewall", fix: "CORS is enforced by the CLIENT'S BROWSER to protect users, not as a backend authentication layer." }
    ]
  },
  {
    id: "backend",
    title: "Node.js & Backend Architecture",
    icon: "🟩",
    badge: "Backend Engineering",
    duration: "40 mins",
    summary: "Node runtime, Event Loop, Libuv thread pool, REST APIs, JWT authentication, and caching.",
    cheatSheet: [
      {
        topic: "Node.js Event Loop & Libuv",
        desc: "Single-threaded JS engine backed by Libuv C++ worker threads for I/O operations.",
        code: `// Non-blocking I/O in Node.js
const fs = require("fs").promises;

async function readFileAsync() {
  console.log("1. Request started");
  
  // File I/O is offloaded to Libuv thread pool in background:
  const data = await fs.readFile("data.txt", "utf-8");
  
  console.log("3. File read complete");
}

readFileAsync();
console.log("2. Event loop continues accepting other requests!");`,
        points: [
          "Main JS thread never blocks while waiting for database queries or disk files.",
          "Libuv manages a default pool of 4 worker threads for slow OS tasks (crypto, DNS, fs).",
          "CPU-intensive computations should be offloaded to Worker Threads or microservices."
        ]
      },
      {
        topic: "JWT Authentication Architecture",
        desc: "Stateless authentication using cryptographically signed JSON Web Tokens.",
        code: `const jwt = require("jsonwebtoken");

// 1. Sign Token on Login:
const token = jwt.sign(
  { userId: user._id, role: "student" },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

// 2. Auth Middleware on Protected Routes:
function authMiddleware(req, res, next) {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: "Invalid or expired token" });
  }
}`,
        points: [
          "Stateless: Server verifies the cryptographic signature without querying DB on every request.",
          "Payload structure: Header (algorithm), Payload (data claims), Signature (HMAC-SHA256).",
          "Never store sensitive data (passwords, social security) inside the JWT payload."
        ]
      }
    ],
    topQuestions: [
      {
        q: "Why is Node.js unsuitable for CPU-heavy tasks?",
        a: "Node.js executes JavaScript on a single main thread. Heavy mathematical tasks (e.g. video rendering, image processing) block this thread, preventing the Event Loop from handling incoming API requests for all other users.\n\nSolution: Use Node.js Worker Threads or delegate to a Python/Go worker service."
      },
      {
        q: "What is the Cache-Aside pattern using Redis?",
        a: "1. Application receives a read request and queries Redis cache first.\n2. Cache Hit: Data returned immediately in <2ms.\n3. Cache Miss: Application queries primary database, writes result into Redis with a Time-To-Live (TTL), and returns data to the client."
      }
    ],
    traps: [
      { trap: "Storing plain-text passwords or using weak MD5/SHA1", fix: "Always use bcrypt or argon2 with salt rounds (10-12) to protect against rainbow table attacks." }
    ]
  },
  {
    id: "systemdesign",
    title: "System Design & Cloud Architecture",
    icon: "🏗️",
    badge: "System Design",
    duration: "45 mins",
    summary: "How to design scalable web systems: Load Balancers, Caching, Sharding, CAP Theorem, and Queues.",
    cheatSheet: [
      {
        topic: "Horizontal vs Vertical Scaling",
        desc: "Expanding system capacity by adding more servers vs upgrading existing hardware.",
        code: `// Vertical Scaling (Scale Up):
// [1 Server: 4 Core / 16GB RAM] -> [1 Server: 64 Core / 256GB RAM]
// ⚠️ Has hard physical limits and represents a Single Point of Failure (SPOF).

// Horizontal Scaling (Scale Out):
// [Load Balancer]
//   ├── [Server 1: 4 Core / 16GB]
//   ├── [Server 2: 4 Core / 16GB]
//   └── [Server 3: 4 Core / 16GB] (Add N servers seamlessly as traffic grows!)`,
        points: [
          "Horizontal scaling requires stateless application servers so any server can handle any request.",
          "Load balancers distribute traffic using Round Robin, Least Connections, or IP Hashing.",
          "Auto-scaling groups dynamically add/remove servers based on CPU or request volume."
        ]
      },
      {
        topic: "CAP Theorem in Distributed Systems",
        desc: "In any distributed data store, you can guarantee at most 2 out of 3 properties.",
        code: `// C - Consistency : Every read receives the most recent write or an error.
// A - Availability: Every non-failing node returns a response (never errors).
// P - Partition   : System continues functioning despite network packet loss between nodes.
//
// Because network partitions (P) are unavoidable in the real world:
// • CP Systems: Choose Consistency over Availability (e.g. Banking, MongoDB, HBase).
// • AP Systems: Choose Availability over Consistency (e.g. DNS, Cassandra, DynamoDB).`,
        points: [
          "Network Partition Tolerance (P) is mandatory across physical distributed networks.",
          "CP: Rejects writes/reads if nodes cannot synchronize to maintain strict consistency.",
          "AP: Returns available data (eventual consistency) even if replica nodes are temporarily out of sync."
        ]
      }
    ],
    topQuestions: [
      {
        q: "How do you design a URL Shortener (TinyURL) in an interview?",
        a: "1. Capacity: 100M URLs/month -> ~50GB storage/year.\n2. Key Generation: Base62 encoding (a-z, A-Z, 0-9) with 7 characters gives 62^7 = 3.5 Trillion unique short URLs.\n3. Data Store: Key-value NoSQL or PostgreSQL with unique index on shortKey.\n4. Caching: Cache top 20% most accessed URLs in Redis to serve 80% of redirect traffic in <5ms.\n5. Architecture: DNS -> CDN -> Load Balancer -> Redirection Service Cluster -> Redis -> DB."
      },
      {
        q: "What is the difference between Replication and Sharding?",
        a: "• Replication: Duplicating the entire database across Read Replicas. Scales READ throughput and provides high availability failovers.\n• Sharding: Horizontally partitioning table rows across multiple database servers by a Shard Key (e.g. user_id % N). Scales WRITE throughput and storage capacity."
      }
    ],
    traps: [
      { trap: "Single Point of Failure (SPOF)", fix: "Every critical tier (DNS, Load Balancer, DB Master) must have automated redundant failover instances across availability zones." }
    ]
  }
];
