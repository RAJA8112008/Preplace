window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["practice-web"] = {
  "kind": "practice",
  "notes": [
    {
      "title": "How to use this sheet",
      "body": "These are the JS, HTTP, DNS, and browser questions companies repeat. Read the answer. Then read the example — code on the left, easy meaning on the right."
    },
    {
      "title": "JavaScript",
      "body": "var/let/const, hoisting, TDZ, scope, closures, this, event loop, promises, DOM events, copies, modules."
    },
    {
      "title": "HTTP / HTTPS",
      "body": "Methods, status codes, headers, cookies, CORS, caching, HTTP/2. HTTPS is HTTP plus TLS."
    },
    {
      "title": "DNS & networking",
      "body": "Name to IP, records, TCP vs UDP, ports, proxy, CDN, load balancer."
    },
    {
      "title": "Browser / web",
      "body": "DOM, storage, same-origin, REST, JWT, OAuth, XSS, CSRF, SQL injection, WebSockets."
    }
  ],
  "examples": [
    {
      "title": "var vs let vs const",
      "lang": "js",
      "desc": "Three ways to make a name.",
      "code": "var old = 1;  // whole function, can change\nlet score = 10;  // this { } block, can change\nconst name = \"Ada\";  // this { } block, cannot point at a new value\nscore = 11;  // ok\n// name = \"Bob\";  // error"
    },
    {
      "title": "Event loop order",
      "lang": "js",
      "desc": "Sync, then microtask, then timer.",
      "code": "console.log(\"A\");  // now — call stack\nPromise.resolve().then(() => console.log(\"B\"));  // microtask\nsetTimeout(() => console.log(\"C\"), 0);  // macrotask\n// prints A, then B, then C"
    },
    {
      "title": "HTTPS fetch",
      "lang": "js",
      "desc": "Encrypted request.",
      "code": "const res = await fetch(\"https://api.example.com/todos\");  // TLS + HTTP\nif (!res.ok) throw new Error(\"bad status\");  // 404 does not throw by itself\nconst data = await res.json();"
    },
    {
      "title": "DNS in one line",
      "lang": "txt",
      "desc": "Name → IP before the request.",
      "code": "// google.com  →  resolver  →  142.250.x.x  →  then HTTPS"
    },
    {
      "title": "Auth vs authz",
      "lang": "js",
      "desc": "Who you are vs what you may do.",
      "code": "if (!req.user) return res.status(401).json({ error: \"login\" });  // authentication\nif (req.user.role !== \"admin\") return res.status(403).json({ error: \"forbidden\" });  // authorization"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "What is the difference between var, let, and const?",
      "a": "var is function-scoped and can be reassigned. let is block-scoped and can be reassigned. const is block-scoped and cannot point at a new value (an object inside const can still change). Use const by default, let when the name must change, and avoid var.",
      "code": "function demo() {\n  var old = 1;  // lives in the whole function\n  let score = 10;  // lives in this { } only\n  const name = \"Ada\";  // cannot do name = \"Bob\"\n  score = 11;  // let can change\n}",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "What is hoisting?",
      "a": "JavaScript sets up declarations before it runs lines top to bottom. A function declaration is ready at the top of its scope. var exists early but is undefined until the assignment. let and const are hoisted too, but they sit in the Temporal Dead Zone until their line.",
      "code": "console.log(a);  // undefined — var is hoisted\nvar a = 5;\nok();  // works — function declaration is hoisted\nfunction ok() { return \"hi\"; }",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "What is the Temporal Dead Zone (TDZ)?",
      "a": "The TDZ is the stretch from the start of a block until the let or const line. The name exists, but using it throws ReferenceError. var would have been undefined instead. Declare first, then use.",
      "code": "{\n  // console.log(x);  // ReferenceError — still in the TDZ\n  let x = 1;  // now x is alive\n  console.log(x);\n}",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 4,
      "level": "beginner",
      "q": "What is scope? Explain global, function, and block scope.",
      "a": "Scope is where a name can be used. Global: the whole file / window. Function: only inside that function (var, and function names). Block: only inside the nearest { } (let, const). Inner scopes can read outer names. Outer cannot read inner names.",
      "code": "const g = \"global\";  // whole file\nfunction demo() {\n  var f = \"function\";  // whole function\n  if (true) {\n    let b = \"block\";  // only this if\n    console.log(g, f, b);  // inner can read outer\n  }\n}",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 5,
      "level": "beginner",
      "q": "What is a closure?",
      "a": "A closure is an inner function that still sees variables from the outer function after the outer function has finished. Those variables stay alive because the inner function still needs them. Used for counters, private data, and callbacks.",
      "code": "function makeCounter() {\n  let n = 0;  // private — closed over\n  return function next() {\n    n = n + 1;  // still sees n\n    return n;\n  };\n}\nconst count = makeCounter();\nconsole.log(count());  // 1\nconsole.log(count());  // 2",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 6,
      "level": "beginner",
      "q": "What is the difference between == and ===?",
      "a": "== converts types, then compares (1 == \"1\" is true). === compares value and type with no conversion (1 === \"1\" is false). == also makes odd matches like 0 == \"\". Prefer ===.",
      "code": "console.log(1 === \"1\");  // false — number vs text\nconsole.log(1 == \"1\");  // true — == converts\nconsole.log(0 == \"\");  // true — surprising\nconsole.log(0 === \"\");  // false — safer",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 7,
      "level": "beginner",
      "q": "What are primitive and non-primitive data types?",
      "a": "Primitives are one simple value: string, number, boolean, null, undefined, symbol, bigint. Copying a primitive copies the value. Non-primitives are objects (arrays, functions, dates). Copying an object usually copies a pointer to the same object.",
      "code": "const name = \"Ada\";  // primitive — string\nconst age = 21;  // primitive — number\nconst user = { name };  // non-primitive — object\nconst copy = user;  // same object, not a new one\ncopy.name = \"Bob\";  // user.name is also Bob",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 8,
      "level": "beginner",
      "q": "What is the difference between null and undefined?",
      "a": "undefined means nobody set this yet. null means you set it to empty on purpose. A missing field is usually undefined. You assign null when you clear something. They are not the same value.",
      "code": "let city;  // undefined — not set\nconst user = { name: \"Ada\" };\nconsole.log(user.age);  // undefined — no such field\nuser.age = null;  // cleared on purpose\nconsole.log(user.age);  // null",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 9,
      "level": "beginner",
      "q": "What is NaN?",
      "a": "NaN means Not a Number — a broken number result like Number(\"hello\"). NaN !== NaN. Use Number.isNaN(x). Number.isFinite is often better for user input because it also rejects Infinity.",
      "code": "const bad = Number(\"hello\");  // NaN\nconsole.log(bad === bad);  // false\nconsole.log(Number.isNaN(bad));  // true — correct test\nconsole.log(Number.isFinite(10));  // true",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 10,
      "level": "beginner",
      "q": "What is the difference between function declaration, function expression, and arrow function?",
      "a": "A declaration is function name() {} and is hoisted. An expression is const name = function () {} and is not hoisted. An arrow is const name = () => {} — short, no own this, cannot be used with new. Use a declaration or normal method when you need this or hoisting.",
      "code": "function add(a, b) { return a + b; }  // declaration — hoisted\nconst sub = function (a, b) { return a - b; };  // expression\nconst mul = (a, b) => a * b;  // arrow — no own this",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 11,
      "level": "intermediate",
      "q": "How does this work in JavaScript?",
      "a": "this is who called the function, not where you wrote it. obj.method() → this is obj. A plain function in strict mode can have this as undefined. Arrow functions borrow this from the surrounding code. call, apply, and bind set this on purpose.",
      "code": "const user = {\n  name: \"Ada\",\n  hi() { return this.name; }  // this = user when you call user.hi()\n};\nconsole.log(user.hi());  // Ada\nconst hi = user.hi;\n// hi();  // this is not user anymore",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 12,
      "level": "intermediate",
      "q": "What are call, apply, and bind?",
      "a": "call runs now with this and arguments listed one by one. apply runs now with arguments as an array. bind does not run yet — it returns a new function with this locked. Use bind for callbacks that would lose this.",
      "code": "function greet(city) {\n  return this.name + \" in \" + city;\n}\nconst user = { name: \"Ada\" };\ngreet.call(user, \"Pune\");  // run now\ngreet.apply(user, [\"Pune\"]);  // args as a list\nconst bound = greet.bind(user);  // lock this\nconsole.log(bound(\"Delhi\"));",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 13,
      "level": "intermediate",
      "q": "What is the event loop?",
      "a": "JavaScript has one main thread. The event loop runs the call stack first. When the stack is empty it runs microtasks (Promise.then). Then it runs macrotasks (setTimeout, clicks). That is why a resolved Promise prints before setTimeout(..., 0).",
      "code": "console.log(\"A\");  // stack — now\nPromise.resolve().then(() => console.log(\"B\"));  // microtask\nsetTimeout(() => console.log(\"C\"), 0);  // macrotask\n// A, then B, then C",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 14,
      "level": "intermediate",
      "q": "What are the call stack, callback queue, and microtask queue?",
      "a": "The call stack is the functions running now. The microtask queue holds Promise.then and queueMicrotask. The callback (macro) queue holds timers and many events. Empty the stack → drain microtasks → one macrotask → repeat.",
      "code": "setTimeout(() => console.log(\"macro\"), 0);  // callback queue\nqueueMicrotask(() => console.log(\"micro\"));  // microtask queue\nconsole.log(\"sync\");  // call stack\n// sync, micro, macro",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 15,
      "level": "intermediate",
      "q": "What are Promises?",
      "a": "A Promise is an object for a value that may arrive later. It starts pending, then becomes fulfilled or rejected, only once. then / catch / finally queue the next step. Use them for network and any waiting work.",
      "code": "const pizza = new Promise((resolve, reject) => {\n  resolve(\"ready\");  // success — pending → fulfilled\n});\npizza.then((food) => console.log(food)).catch((err) => console.log(err));",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 16,
      "level": "intermediate",
      "q": "Difference between .then() and async/await?",
      "a": "They are the same idea. await pauses inside an async function until the Promise settles. The code reads top to bottom. Use try/catch with await. Use .then when you cannot use await. An async function always returns a Promise.",
      "code": "async function load() {\n  try {\n    const res = await fetch(\"/api/todos\");  // wait here\n    return res.json();\n  } catch (err) {\n    console.log(\"network failed\");\n  }\n}",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 17,
      "level": "intermediate",
      "q": "What are Promise.all(), Promise.allSettled(), Promise.race(), and Promise.any()?",
      "a": "all waits for every success and fails if one fails. allSettled waits for everyone and never short-circuits. race uses whoever finishes first (win or lose). any uses the first success and only fails if all fail.",
      "code": "const a = Promise.resolve(1);\nconst b = Promise.resolve(2);\nPromise.all([a, b]).then(console.log);  // [1, 2] — all must succeed\nPromise.allSettled([a, b]).then(console.log);  // status of each\nPromise.race([a, b]).then(console.log);  // first done\nPromise.any([a, b]).then(console.log);  // first success",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 18,
      "level": "intermediate",
      "q": "What is event bubbling and event capturing?",
      "a": "Capturing walks down from window to the target. Bubbling walks back up. Listeners default to bubble. Use capture: true to listen on the way down. Capture runs first, then the target, then bubble.",
      "code": "parent.addEventListener(\"click\", () => console.log(\"bubble\"));  // way up\nparent.addEventListener(\"click\", () => console.log(\"capture\"), true);  // way down",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 19,
      "level": "intermediate",
      "q": "What is event delegation?",
      "a": "One listener on a parent handles many children. event.target (or closest) tells you which child was clicked. New children added later still work. Fewer listeners, less memory. Perfect for a growing todo list.",
      "code": "list.addEventListener(\"click\", (e) => {\n  const btn = e.target.closest(\"[data-id]\");  // which row?\n  if (!btn) return;\n  removeTodo(Number(btn.dataset.id));\n});",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 20,
      "level": "intermediate",
      "q": "What is the difference between shallow copy and deep copy?",
      "a": "A shallow copy clones only the first layer. Nested objects still point at the same memory. A deep copy clones nested values too. Spread is shallow. structuredClone is deep for most data.",
      "code": "const a = { inner: { n: 1 } };\nconst shallow = { ...a };  // first layer only\nshallow.inner.n = 2;  // also changes a.inner\nconst deep = structuredClone(a);  // nested copy\ndeep.inner.n = 3;  // a stays 2",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 21,
      "level": "beginner",
      "q": "What is the spread operator?",
      "a": "Spread is ... that pours items out of an array or object. Copy lists, merge objects, or pass many arguments. It is shallow. Rest is the opposite — it gathers leftovers into an array.",
      "code": "const a = [1, 2];\nconst b = [...a, 3];  // [1, 2, 3]\nconst user = { name: \"Ada\" };\nconst full = { ...user, age: 21 };  // copy + extra field",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 22,
      "level": "beginner",
      "q": "What is destructuring?",
      "a": "Destructuring unpacks values from an array or object into variables in one line. You can rename fields and set defaults. APIs and React props use this a lot. A missing field is undefined, not a throw.",
      "code": "const user = { name: \"Ada\", age: 21 };\nconst { name, age } = user;  // pull fields out\nconst { name: n } = user;  // rename to n\nconst [first, second] = [\"a\", \"b\"];",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 23,
      "level": "beginner",
      "q": "What are rest parameters?",
      "a": "Rest is ... in a function parameter list. It gathers leftover arguments into a real array. It must be last. Different from the arguments object, which is array-like and not in arrows.",
      "code": "function sum(...nums) {\n  return nums.reduce((a, n) => a + n, 0);  // nums is a real array\n}\nconsole.log(sum(1, 2, 3));  // 6",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 24,
      "level": "intermediate",
      "q": "What are higher-order functions?",
      "a": "A higher-order function takes a function as an argument, or returns a function, or both. map, filter, reduce, and debounce are higher-order. They let you pass the \"what\" and reuse the \"how\".",
      "code": "function twice(fn) {\n  return function (x) { return fn(fn(x)); };  // returns a function\n}\nconst add1 = (n) => n + 1;\nconsole.log(twice(add1)(3));  // 5",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 25,
      "level": "beginner",
      "q": "Explain map(), filter(), reduce(), forEach().",
      "a": "map builds a new list of changed values. filter builds a new list of kept items. reduce boils a list down to one value. forEach runs a side effect and returns undefined. Do not expect forEach to give you a list.",
      "code": "const nums = [1, 2, 3, 4];\nconst doubled = nums.map((n) => n * 2);  // [2, 4, 6, 8]\nconst evens = nums.filter((n) => n % 2 === 0);  // [2, 4]\nconst total = nums.reduce((sum, n) => sum + n, 0);  // 10\nnums.forEach((n) => console.log(n));  // side effect only",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 26,
      "level": "intermediate",
      "q": "What is prototypal inheritance?",
      "a": "An object can borrow fields from a parent (its prototype). If a field is missing, JS walks up the chain. That is why arrays have map even if you never added map. class is a clearer way to set up the same chain.",
      "code": "const animal = { eat() { return \"yum\"; } };\nconst dog = Object.create(animal);  // parent = animal\ndog.bark = function () { return \"woof\"; };\nconsole.log(dog.bark());  // own method\nconsole.log(dog.eat());  // found on parent",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 27,
      "level": "beginner",
      "q": "What are JavaScript classes?",
      "a": "class is syntax for a constructor plus methods on the prototype. constructor runs when you new. extends sets the parent. super calls the parent. Under the hood it is still prototypes.",
      "code": "class User {\n  constructor(name) { this.name = name; }  // runs on new\n  hi() { return \"hi \" + this.name; }  // on the prototype\n}\nconst u = new User(\"Ada\");\nconsole.log(u.hi());",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 28,
      "level": "intermediate",
      "q": "What are ES modules (import/export)?",
      "a": "A module is a file that exports names for other files to import. Named exports share many names. One default export can be imported with any name. Modules have their own scope and stay in strict mode. In the browser, type=\"module\" on the script tag.",
      "code": "export function add(a, b) { return a + b; }  // named\nexport default function area(r) { return r * r; }  // one default\n// other file:\n// import area, { add } from \"./math.js\";",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 29,
      "level": "intermediate",
      "q": "What is debouncing vs throttling?",
      "a": "Debounce waits until you stop calling, then runs once (search box). Throttle runs at most once every N ms even if you keep calling (scroll). Both cut extra work.",
      "code": "function debounce(fn, ms) {\n  let id;\n  return function (...args) {\n    clearTimeout(id);  // cancel last wait\n    id = setTimeout(() => fn(...args), ms);  // run after quiet\n  };\n}",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 30,
      "level": "intermediate",
      "q": "What is garbage collection in JavaScript?",
      "a": "The collector frees objects that nothing can reach from roots (stack, globals). You do not free memory by hand. A leak is data you no longer need but still hold a pointer to — forgotten timers, global caches, closures holding huge data.",
      "code": "function demo() {\n  const temp = { n: 1 };  // only used here\n  return temp.n;\n}\ndemo();  // temp can be collected after\nlet keep = { n: 2 };  // still reachable",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 31,
      "level": "beginner",
      "q": "What is HTTP?",
      "a": "HTTP is the request and response language of the web. The client asks (method + URL + headers + optional body). The server answers (status + headers + body). It is text-based and stateless — each request should carry what it needs.",
      "code": "const res = await fetch(\"/api/todos\");  // HTTP GET\nconsole.log(res.status);  // 200 if ok\nconst data = await res.json();",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 32,
      "level": "beginner",
      "q": "What is HTTPS?",
      "a": "HTTPS is HTTP inside TLS encryption. The padlock means the path is encrypted and the certificate helps prove you reached the real server. Login, cookies, and tokens must use HTTPS in production.",
      "code": "await fetch(\"https://api.example.com/login\", { method: \"POST\", body: form });  // encrypted\n// http://  — never for a password",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 33,
      "level": "beginner",
      "q": "Difference between HTTP and HTTPS?",
      "a": "Same verbs and URLs. HTTPS adds TLS so people on the Wi-Fi cannot read the bytes. HTTPS uses port 443 by default, HTTP uses 80. Cookies marked Secure only travel on HTTPS. Mixed content is an HTTPS page calling http:// — the browser blocks it.",
      "code": "fetch(\"https://api.example.com/me\");  // good\n// fetch(\"http://api.example.com/me\")  // blocked on an https:// page",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 34,
      "level": "intermediate",
      "q": "How does HTTPS provide security?",
      "a": "TLS does a handshake. The server shows a certificate. They agree on keys. After that, HTTP bytes are encrypted (confidentiality) and tampered bytes fail (integrity). A trusted CA helps you know it is not a fake host (authentication of the server).",
      "code": "// browser → TLS handshake + cert check → then HTTP GET /todos\nlisten 443 ssl;  // TLS often ends at Nginx",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 35,
      "level": "intermediate",
      "q": "What is TLS/SSL?",
      "a": "TLS is the modern name for the encryption layer. SSL is the old name people still say. TLS 1.2/1.3 is what you want. It sits under HTTP to make HTTPS. Certificates come from a CA (or Let's Encrypt).",
      "code": "server {\n  listen 443 ssl;\n  ssl_certificate /etc/letsencrypt/live/ex/fullchain.pem;  // public cert\n}",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 36,
      "level": "beginner",
      "q": "What happens when you enter a URL in the browser?",
      "a": "What this is\nA URL is the address you type, like https://example.com/. The browser must find the computer, talk to it on a safe path, then paint what comes back.\n\nWhat happens\n1. The browser reads the URL: https means use TLS, example.com is the name, / is the page.\n2. DNS turns that name into an IP address — the phone number of the server.\n3. The browser opens a TCP connection, then a TLS handshake (that is the padlock).\n4. It sends an HTTP GET request.\n5. The server answers with HTML (or JSON for an API).\n6. The browser reads the HTML, then asks for CSS, JavaScript, and images.\n7. JavaScript runs. The page paints on the screen.\n\nAlso know\nA CDN or your cache can skip DNS or the HTML download if you have been here before. Service workers can even show a saved page offline. In an interview, tell this as a story in that exact order — find, connect, ask, extras, paint.\n\nWatch out\nDo not start at HTML. Interviewers wait for DNS and HTTPS first. The browser does not open the database. It only talks to the server.",
      "code": "async function openHome() {\n  const res = await fetch(\"https://example.com/\");  // 1 DNS  2 TLS  3 HTTP GET\n  if (!res.ok) throw new Error(\"page failed\");  // 404 or 500\n  const html = await res.text();  // 4 body is HTML\n  console.log(html.slice(0, 80));  // start of the page — then CSS/JS would load\n}",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 37,
      "level": "beginner",
      "q": "What are HTTP methods?",
      "a": "Verbs that say the action. GET reads. POST creates. PUT replaces the whole resource. PATCH changes some fields. DELETE removes. HEAD is GET without a body. OPTIONS is the CORS preflight.",
      "code": "app.get(\"/todos\", list);  // Read\napp.post(\"/todos\", create);  // Create\napp.put(\"/todos/:id\", replace);  // replace all fields\napp.patch(\"/todos/:id\", update);  // some fields\napp.delete(\"/todos/:id\", remove);",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 38,
      "level": "beginner",
      "q": "What does GET do?",
      "a": "GET reads. It should not change data. It can be cached and retried. Put filters in the query string, not a body. Never delete or charge a card with GET.",
      "code": "app.get(\"/todos/:id\", async (req, res) => {\n  const row = await find(req.params.id);  // Read\n  if (!row) return res.status(404).json({ error: \"missing\" });\n  res.json(row);\n});",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 39,
      "level": "beginner",
      "q": "What does POST do?",
      "a": "POST creates or triggers an action. Repeating POST can create two rows. Send a JSON body. Answer 201 + the new row when you create.",
      "code": "app.post(\"/todos\", (req, res) => {\n  const item = { id: Date.now(), text: req.body.text };  // Create\n  todos.push(item);\n  res.status(201).json(item);\n});",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 40,
      "level": "beginner",
      "q": "What does PUT do?",
      "a": "PUT replaces the whole resource with the body you send. Missing fields are often cleared. Sending the same PUT twice should leave the same result (idempotent).",
      "code": "app.put(\"/todos/:id\", (req, res) => {\n  todos[id] = { id, text: req.body.text, done: req.body.done };  // full replace\n  res.json(todos[id]);\n});",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 41,
      "level": "beginner",
      "q": "What does PATCH do?",
      "a": "PATCH changes only the fields you send. Other fields stay. Use it to tick done: true without resending the whole todo.",
      "code": "app.patch(\"/todos/:id\", (req, res) => {\n  if (req.body.done !== undefined) t.done = req.body.done;  // only this field\n  res.json(t);\n});",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 42,
      "level": "beginner",
      "q": "What does DELETE do?",
      "a": "DELETE removes the resource. Sending it twice should still end as \"gone\" (idempotent). Answer 204 with no body, or 404 if you want to say it was already missing.",
      "code": "app.delete(\"/todos/:id\", (req, res) => {\n  todos = todos.filter((t) => t.id !== Number(req.params.id));  // Delete\n  res.status(204).end();\n});",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 43,
      "level": "beginner",
      "q": "Difference between PUT and PATCH?",
      "a": "PUT = replace the whole object. PATCH = change some fields. If the client sends only { done: true }, PATCH ticks the todo. PUT would wipe text unless the client sent text too.",
      "code": "// PATCH { done: true }  →  text stays\n// PUT  { done: true }   →  text may be lost if you replace the row",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 44,
      "level": "beginner",
      "q": "Difference between GET and POST?",
      "a": "GET reads and is safe to retry and cache. POST writes or triggers work and can create two rows if retried. GET has no meaningful body. POST has a body. Passwords go in POST over HTTPS, never in a GET query string.",
      "code": "fetch(\"/todos\");  // GET — read\nfetch(\"/todos\", { method: \"POST\", body: JSON.stringify({ text: \"read\" }) });  // create",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 45,
      "level": "beginner",
      "q": "What are HTTP status codes?",
      "a": "A number that says how the request went. 2xx success, 3xx go somewhere else, 4xx your request is wrong, 5xx the server broke. The UI branches on these numbers.",
      "code": "if (res.status === 201) setTodos((list) => list.concat(await res.json()));\nif (res.status === 401) navigate(\"/login\");\nif (res.status === 403) setErr(\"not allowed\");",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 46,
      "level": "beginner",
      "q": "What is 200 OK?",
      "a": "The request succeeded and the body is the answer. Typical for GET and for PATCH that returns the updated row.",
      "code": "res.status(200).json(todo);  // here is the data",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 47,
      "level": "beginner",
      "q": "What is 201 Created?",
      "a": "A new resource was created. Return the new row (and Location header if you can). Typical for POST.",
      "code": "res.status(201).json(item);  // created",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 48,
      "level": "beginner",
      "q": "What are 301 and 302?",
      "a": "Redirects. 301 is permanent — search engines update the URL. 302 is temporary — go here this time. Browsers follow them. APIs more often send 201 or 200 than a redirect.",
      "code": "res.redirect(301, \"https://new.example.com\" + req.url);  // forever\nres.redirect(302, rows[0].url);  // short link this time",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 49,
      "level": "beginner",
      "q": "What is 400 Bad Request?",
      "a": "The input is missing or wrong — empty title, bad JSON, invalid id. The client should fix the request. Not a login problem.",
      "code": "if (!text) return res.status(400).json({ error: \"text required\" });",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 50,
      "level": "beginner",
      "q": "What is 401 Unauthorized?",
      "a": "We do not know who you are. Log in. Missing or bad token. The name is historical — it means unauthenticated.",
      "code": "res.status(401).json({ error: \"login first\" });",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 51,
      "level": "beginner",
      "q": "What is 403 Forbidden?",
      "a": "We know who you are, and you may not. Role is user, not admin. Or the todo is not yours.",
      "code": "if (req.user.role !== \"admin\") return res.status(403).json({ error: \"forbidden\" });",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 52,
      "level": "beginner",
      "q": "What is 404 Not Found?",
      "a": "That URL or id is not here. Sometimes used so we do not leak that a private row exists.",
      "code": "if (!row) return res.status(404).json({ error: \"missing\" });",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 53,
      "level": "beginner",
      "q": "What is 500 Internal Server Error?",
      "a": "The server crashed or hit a bug. Do not send stack traces to the public. Log them. Fix the code. The client can retry later, not by changing the form.",
      "code": "app.use((err, req, res, next) => {\n  console.error(err);  // log the real error\n  res.status(500).json({ error: \"server error\" });  // generic to the user\n});",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 54,
      "level": "beginner",
      "q": "What are HTTP headers?",
      "a": "Extra labels on the request or response: Content-Type, Authorization, Cookie, Cache-Control, Access-Control-Allow-Origin. They are not the body. The browser and server both read them.",
      "code": "fetch(\"/api/todos\", {\n  headers: {\n    \"Content-Type\": \"application/json\",\n    Authorization: \"Bearer \" + token\n  }\n});",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 55,
      "level": "beginner",
      "q": "What are request headers and response headers?",
      "a": "Request headers are what the client sends (Authorization, Accept, Cookie). Response headers are what the server sends (Content-Type, Set-Cookie, Cache-Control, CORS). DevTools Network tab shows both.",
      "code": "// request:  Authorization: Bearer xxx\n// response: Content-Type: application/json",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 56,
      "level": "beginner",
      "q": "What are HTTP cookies?",
      "a": "Small values the server can Set-Cookie. The browser stores them and sends them back on later requests to that site. Use HttpOnly so JS cannot read them, Secure so they only go on HTTPS, SameSite to help CSRF.",
      "code": "res.cookie(\"sid\", sid, { httpOnly: true, secure: true, sameSite: \"lax\" });",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 57,
      "level": "intermediate",
      "q": "What is session vs cookie?",
      "a": "A cookie is the small value in the browser. A session is the login memory on the server (user id, expiry) keyed by that cookie. The cookie is the ticket. The session is the coat-check room. A JWT can skip the server room and put the data in the ticket.",
      "code": "req.session.userId = user.id;  // server memory\nres.cookie(\"sid\", req.session.id, { httpOnly: true });  // ticket in the browser",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 58,
      "level": "intermediate",
      "q": "What is CORS?",
      "a": "A browser rule: a page on one origin may not read another origin unless the server allows it. Origin is scheme + host + port. :5173 and :3000 are different. Postman is not a browser, so it skips CORS. Fix it on the server or proxy /api.",
      "code": "app.use(cors({ origin: \"http://localhost:5173\" }));  // allow this UI\n// or Vite proxy: \"/api\" → http://localhost:3000",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 59,
      "level": "intermediate",
      "q": "What is a preflight request?",
      "a": "For some POSTs (JSON, extra headers) the browser first sends OPTIONS: \"may I send this?\" The server must allow the method and headers. If OPTIONS fails, your POST never hits the route. Simple GET often skips preflight.",
      "code": "app.options(\"/api/notes\", (req, res) => {\n  res.set(\"Access-Control-Allow-Methods\", \"GET, POST\");\n  res.set(\"Access-Control-Allow-Headers\", \"Content-Type, Authorization\");\n  res.status(204).end();\n});",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 60,
      "level": "intermediate",
      "q": "What is HTTP caching?",
      "a": "The browser or CDN can reuse a response instead of asking again. Cache-Control: max-age, ETag, and 304 Not Modified are the tools. Public JS bundles can be cached. Private /api/todos must not be cached as if they were public.",
      "code": "res.set(\"Cache-Control\", \"public, max-age=31536000\");  // hashed JS file\nres.set(\"Cache-Control\", \"private, no-store\");  // /api/me",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 61,
      "level": "advanced",
      "q": "What is the difference between HTTP/1.1, HTTP/2, and HTTP/3?",
      "a": "1.1 is text and often one request per connection (or a few). HTTP/2 multiplexes many streams on one TCP connection (binary). HTTP/3 uses QUIC over UDP so a lost packet does not stall every stream. HTTPS sites today are usually HTTP/2 or 3 at the edge.",
      "code": "// you still write fetch() the same way\n// the browser and server negotiate 1.1 / 2 / 3",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 62,
      "level": "intermediate",
      "q": "What is keep-alive?",
      "a": "Keep the TCP connection open so the next request does not handshake again. HTTP/1.1 Connection: keep-alive. HTTP/2 does this by default with multiplexing. Faster pages, fewer handshakes.",
      "code": "// Connection: keep-alive\n// next GET /style.css reuses the same TCP connection",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 63,
      "level": "beginner",
      "q": "What is DNS?",
      "a": "DNS is the phone book of the internet. It turns a name like google.com into an IP address so the browser knows which computer to call.",
      "code": "// google.com  →  DNS  →  142.250.x.x\nconst res = await fetch(\"https://google.com\");  // browser already did DNS",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 64,
      "level": "beginner",
      "q": "Why do we need DNS?",
      "a": "People remember names. Machines route to numbers. DNS lets you move a site to a new IP without changing the name everyone types. TTL says how long a resolver may remember the old number.",
      "code": "// change A record → new IP, same https://app.example.com",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 65,
      "level": "beginner",
      "q": "What happens when you type google.com into a browser?",
      "a": "Browser cache → OS cache → resolver (often your ISP or 8.8.8.8) → root → TLD (.com) → authoritative name servers → A/AAAA record → IP. Then TCP + TLS + HTTP. Same story as any URL, with DNS first.",
      "code": "// cache → resolver → root → .com → ns → IP → HTTPS",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 66,
      "level": "beginner",
      "q": "What is a DNS resolver?",
      "a": "The first server you ask, usually your router, ISP, or 1.1.1.1 / 8.8.8.8. It either has the answer cached or walks the DNS tree for you (recursive lookup) and then caches the result.",
      "code": "// your PC → 8.8.8.8 (resolver) → rest of DNS",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 67,
      "level": "beginner",
      "q": "What are DNS records?",
      "a": "Rows in the DNS database. Each type answers a different question: where is the IPv4, where is mail, what is the alias, who are the name servers, extra text.",
      "code": "// A      → IPv4\n// AAAA   → IPv6\n// CNAME  → another name\n// MX     → mail host\n// NS     → who answers for this zone\n// TXT    → text (SPF, verify)",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 68,
      "level": "beginner",
      "q": "What is an A record?",
      "a": "A maps a name to an IPv4 address. app.example.com → 203.0.113.10. This is the most common \"where is the site\" record.",
      "code": "// A  app.example.com  →  203.0.113.10",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 69,
      "level": "beginner",
      "q": "What is an AAAA record?",
      "a": "AAAA maps a name to an IPv6 address. Same job as A, newer address family.",
      "code": "// AAAA  app.example.com  →  2001:db8::1",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 70,
      "level": "beginner",
      "q": "What is a CNAME record?",
      "a": "CNAME is an alias. www.example.com → example.com. The client then looks up the target. You cannot put other records on the same name as a CNAME. Apex domains often use A/ALIAS instead.",
      "code": "// CNAME  www.example.com  →  example.com",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 71,
      "level": "beginner",
      "q": "What is an MX record?",
      "a": "MX says where email for this domain should go, with a priority number. Mail servers use it, not the browser.",
      "code": "// MX  example.com  →  10 mail.example.com",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 72,
      "level": "beginner",
      "q": "What is an NS record?",
      "a": "NS names the authoritative name servers for the zone — who is allowed to answer questions about example.com.",
      "code": "// NS  example.com  →  ns1.registrar.com",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 73,
      "level": "beginner",
      "q": "What is a TXT record?",
      "a": "Free text. Used for SPF/DKIM (mail), domain verify (Google, GitHub), and ACME challenges. Not a web address.",
      "code": "// TXT  example.com  →  \"v=spf1 include:_spf.google.com ~all\"",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 74,
      "level": "beginner",
      "q": "What is DNS caching?",
      "a": "Resolvers and browsers remember an answer for TTL seconds so they do not walk the tree every time. After you change an A record, old IPs can linger until TTL dies. Lower TTL before a planned move.",
      "code": "// TTL 300  →  resolvers may keep the old IP for 5 minutes",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 75,
      "level": "beginner",
      "q": "What is TTL in DNS?",
      "a": "Time to live — how many seconds a resolver may cache this record. Short TTL means changes show up faster and more queries. Long TTL means fewer queries and slower cutovers.",
      "code": "// A  app  300  203.0.113.10   // 5 minutes",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 76,
      "level": "beginner",
      "q": "What is the difference between a domain name and an IP address?",
      "a": "A domain is the human name (example.com). An IP is the machine number (203.0.113.10). DNS maps one to the other. You can hit an IP in the browser, but the certificate and Host header usually need the name.",
      "code": "// name: api.example.com\n// IP:   203.0.113.10",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 77,
      "level": "intermediate",
      "q": "What is recursive vs iterative DNS lookup?",
      "a": "Recursive: your resolver does the whole walk and returns the final IP. Iterative: each server says \"ask that one next\" and the client walks. Home PCs send recursive queries to 8.8.8.8. That resolver then does the iterative walk.",
      "code": "// PC  --recursive-->  8.8.8.8  --iterative-->  root / .com / ns",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 78,
      "level": "beginner",
      "q": "What is an IP address?",
      "a": "A number that names a host on a network so packets know where to go. IPv4 looks like 203.0.113.10. IPv6 is longer. Private IPs stay inside a LAN. Public IPs are reachable on the internet.",
      "code": "// 127.0.0.1     this machine\n// 192.168.1.5   home LAN\n// 203.0.113.10  public",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 79,
      "level": "beginner",
      "q": "Difference between IPv4 and IPv6?",
      "a": "IPv4 is 32-bit (about 4 billion addresses) and we ran out. IPv6 is 128-bit and has room. Many networks are dual-stack. DNS A is IPv4, AAAA is IPv6.",
      "code": "// IPv4  203.0.113.10\n// IPv6  2001:db8::1",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 80,
      "level": "beginner",
      "q": "What is a port?",
      "a": "A number on a host that names which program should get the packet. HTTPS is 443, HTTP 80, Postgres 5432, SSH 22. IP finds the machine. Port finds the app.",
      "code": "// 203.0.113.10:443  →  Nginx HTTPS\n// 127.0.0.1:3000    →  Node app",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 81,
      "level": "beginner",
      "q": "What is TCP?",
      "a": "A reliable connection: handshake, ordered bytes, retransmission if a packet is lost. HTTP/1.1 and HTTP/2 ride on TCP. Use it when every byte matters (web, databases).",
      "code": "// SYN → SYN-ACK → ACK  then HTTP GET",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 82,
      "level": "beginner",
      "q": "What is UDP?",
      "a": "A datagram with no handshake and no built-in retry. Faster, can drop or reorder. DNS queries, games, video, and HTTP/3 (QUIC) use it. You add reliability in the app if you need it.",
      "code": "// one packet, no connection — DNS often starts as UDP/53",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 83,
      "level": "beginner",
      "q": "Difference between TCP and UDP?",
      "a": "TCP: connection, ordered, reliable, slower handshake. UDP: no connection, may drop, lower delay. Web pages use TCP (or QUIC). Live video can use UDP. Pick reliability vs speed.",
      "code": "// checkout form  →  TCP / HTTPS\n// game tick      →  UDP",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 84,
      "level": "intermediate",
      "q": "What is a TCP three-way handshake?",
      "a": "To start a TCP connection: client SYN, server SYN-ACK, client ACK. Then data can flow. TLS handshake happens after this on HTTPS. FIN/ACK tears it down later.",
      "code": "// 1 SYN     2 SYN-ACK     3 ACK\n// then: ClientHello (TLS) then GET /",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 85,
      "level": "beginner",
      "q": "What is a socket?",
      "a": "One end of a connection: IP + port + protocol, plus the OS handle your program reads and writes. Node's listen(3000) opens a socket. A TCP connection is two sockets talking.",
      "code": "app.listen(3000);  // socket on 0.0.0.0:3000",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 86,
      "level": "beginner",
      "q": "What is a firewall?",
      "a": "A filter that allows or blocks traffic by IP, port, and direction. Security groups are cloud firewalls. Do not expose 5432 or 3000 to the world. Allow 443. Allow 22 only from your IP.",
      "code": "// allow 443 from 0.0.0.0/0\n// allow 22 from your.ip/32\n// deny 5432 from the internet",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 87,
      "level": "beginner",
      "q": "What is a proxy server?",
      "a": "A forward proxy sits near the client and goes out to the internet for them (school filter, corporate egress). The destination sees the proxy, not every laptop.",
      "code": "// browser → company proxy → https://example.com",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 88,
      "level": "beginner",
      "q": "What is a reverse proxy?",
      "a": "The problem before\nThe app sat on the street on port 3000. HTTPS was hard. Two apps could not share one website name.\n\nWhat this is\nA reverse proxy sits in front of your servers. Clients hit Nginx or an ALB on 443. It forwards to Node on 3000.\n\nWhat it solves\nThe world never talks to the app process. You hide ports, add HTTPS, and route /api and / from one domain.\n\nReal-life example\nA hotel receptionist. You ask for room 12. You do not wander the staff corridors.\n\nUses\nTLS, static files, /api to Node, two apps behind one name.\n\nWatch out\nLeaving :3000 public. Forgetting X-Forwarded-For so the app thinks every guest is Nginx.",
      "code": "location / { proxy_pass http://127.0.0.1:3000; }  // reverse proxy",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 89,
      "level": "beginner",
      "q": "What is a CDN?",
      "a": "Edge caches close to the user for static files (JS, images). The origin is your S3 or Nginx. Faster first byte, less origin load. Do not put private /api/todos on a public CDN key.",
      "code": "// CloudFront → S3\n// Cache-Control: public for the JS bundle",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 90,
      "level": "beginner",
      "q": "What is a load balancer?",
      "a": "One public HTTPS door, many app boxes behind it. Health checks drop bad boxes. Prefer JWT or shared Redis sessions instead of sticky sessions.",
      "code": "app.get(\"/health\", (req, res) => res.json({ ok: true }));  // LB pings this",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 91,
      "level": "beginner",
      "q": "What is latency?",
      "a": "How long one request waits. Milliseconds from click to first byte. Caused by distance, DNS, TLS, DB, and queues. p95 latency is what interviews want you to measure, not only the average.",
      "code": "console.time(\"todos\");\nawait db.query(\"SELECT * FROM todos WHERE user_id = $1\", [id]);\nconsole.timeEnd(\"todos\");  // ms for this query",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 92,
      "level": "beginner",
      "q": "What is bandwidth?",
      "a": "How much data you can push per second (Mbps). High bandwidth and high latency can both exist (a fat pipe far away). A 10 MB image on a slow link is a bandwidth problem. A 200 ms ping to the DB is latency.",
      "code": "// 100 Mbps down  — fat pipe\n// 180 ms ping    — still laggy if the server is far",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 93,
      "level": "beginner",
      "q": "What is FTP?",
      "a": "File Transfer Protocol — an old way to upload and download files. Separate control and data connections. Still seen on some hosts. Prefer SFTP or HTTPS uploads for anything real.",
      "code": "// ftp://files.example.com/photos/ada.jpg   — old\n// sftp user@host  or  presigned S3 PUT     — better",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 94,
      "level": "beginner",
      "q": "What is the difference between FTP and SFTP?",
      "a": "FTP is plain and often unencrypted. SFTP is file transfer over SSH — encrypted, one port (22). FTPS is FTP plus TLS (different from SFTP). Use SFTP or HTTPS.",
      "code": "// SFTP  port 22  — SSH\n// FTPS  FTP + TLS\n// FTP   plain — avoid",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 95,
      "level": "beginner",
      "q": "Is FTP encrypted?",
      "a": "Classic FTP is not. Usernames, passwords, and files can be read on the network. SFTP and FTPS are encrypted. Do not send production secrets over plain FTP.",
      "code": "// ftp  — no\n// sftp — yes (SSH)",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 96,
      "level": "beginner",
      "q": "What ports are commonly associated with FTP?",
      "a": "21 is the FTP control port. 20 is active-mode data (old). Passive mode uses a range of high ports. SFTP is 22. Firewalls hate classic FTP because of the extra data ports.",
      "code": "// FTP  21 (control)\n// SFTP 22",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 97,
      "level": "beginner",
      "q": "When would you use FTP/SFTP?",
      "a": "SFTP: drop a batch file on a partner server, deploy static files to a VPS, pull a nightly CSV. New products should use HTTPS uploads (presigned S3) or rsync/SCP. Do not build a user photo feature on FTP.",
      "code": "// partner nightly CSV → SFTP\n// user avatar → presigned HTTPS PUT to S3",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 98,
      "level": "beginner",
      "q": "What is a browser?",
      "a": "A program that fetches HTML/CSS/JS, runs JS, and paints pixels. It is an HTTP client plus a JS engine plus a rendering engine. Chrome, Firefox, Safari, Edge. DevTools let you see Network, Console, and Elements.",
      "code": "// type URL → DNS → HTTPS → HTML → CSS/JS → paint",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 99,
      "level": "beginner",
      "q": "What is the DOM?",
      "a": "The Document Object Model is the browser's tree of the page. Every tag is a node you can read or change. querySelector finds a node. textContent changes text. addEventListener listens for clicks.",
      "code": "const title = document.querySelector(\"h1\");\ntitle.textContent = \"Hello\";  // change the tree\nconst btn = document.createElement(\"button\");\nbtn.textContent = \"Click\";\ndocument.body.appendChild(btn);",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 100,
      "level": "beginner",
      "q": "What is the difference between DOM and BOM?",
      "a": "DOM is the page tree (document, elements). BOM is the browser chrome around it: window, location, navigator, history, screen. alert and location.hash are BOM. querySelector is DOM.",
      "code": "document.querySelector(\"h1\");  // DOM\nlocation.hash = \"#/login\";  // BOM\nconsole.log(navigator.userAgent);  // BOM",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 101,
      "level": "beginner",
      "q": "What happens when a webpage loads?",
      "a": "What this is\nLoading a page is two stories glued together. First the network story (find the host, HTTPS, get HTML). Then the paint story (turn HTML and CSS into pixels).\n\nWhat happens\nAfter the HTML arrives, the browser parses it into the DOM — a tree of tags. CSS is parsed into the CSSOM. Those two trees join into a render tree. Layout decides where each box sits. Paint fills in colors and text. JavaScript can change the DOM, which may force layout and paint again.\n\nAlso know\nA slow script at the top of the page can delay first paint. Images and fonts are extra trips after HTML. DevTools Network + Performance tabs show this live — use them when you explain it.\n\nWatch out\nDo not mix this with \"the server queried Mongo.\" The page load story stops at HTML/CSS/JS. Database work already happened on the server before the HTML was sent.",
      "code": "async function loadPage() {\n  const res = await fetch(\"https://example.com/\");  // network: DNS + TLS + GET\n  const html = await res.text();  // raw HTML string\n  document.documentElement.innerHTML = html;  // parse → DOM (demo only)\n  // then: CSSOM + render tree + layout + paint\n  // then: <script> runs and may change the DOM again\n}",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 102,
      "level": "intermediate",
      "q": "What is the rendering process?",
      "a": "Parse → DOM + CSSOM → render tree → layout (where boxes go) → paint (pixels) → composite (layers on the GPU). Changing layout (width, height) is more expensive than changing only color or transform.",
      "code": "el.style.color = \"red\";  // paint\nel.style.width = \"200px\";  // layout + paint — heavier",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 103,
      "level": "beginner",
      "q": "What is localStorage?",
      "a": "A key-value store in the browser that stays after refresh. Same origin only. Strings only. JS can read it, so XSS can steal a token you put there. ~5MB. Not sent to the server automatically.",
      "code": "localStorage.setItem(\"todos\", JSON.stringify(list));  // stays\nconst list = JSON.parse(localStorage.getItem(\"todos\") || \"[]\");",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 104,
      "level": "beginner",
      "q": "What is sessionStorage?",
      "a": "Like localStorage but the tab owns it. Close the tab, it is gone. A new tab does not share it. Good for a wizard draft you do not want on the next visit.",
      "code": "sessionStorage.setItem(\"draft\", \"hello\");  // this tab only",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 105,
      "level": "beginner",
      "q": "Difference between cookies, localStorage, and sessionStorage?",
      "a": "Cookies go to the server on each request (size small, can be HttpOnly). localStorage stays, JS-only, not sent automatically. sessionStorage dies with the tab. For a login ticket, HttpOnly cookie is safer than localStorage.",
      "code": "localStorage.setItem(\"theme\", \"dark\");  // JS, stays\nsessionStorage.setItem(\"draft\", \"hi\");  // JS, this tab\ndocument.cookie = \"sid=abc; Secure; SameSite=Lax\";  // sent to the server",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 106,
      "level": "intermediate",
      "q": "What is the same-origin policy?",
      "a": "A page may read data only from the same scheme + host + port. That is why :5173 cannot read :3000. Cookies are also origin-scoped (plus Domain/Path). CORS is the server's way to relax this for chosen origins.",
      "code": "// https://app.com  cannot read  https://api.com  unless CORS allows it\n// https://app.com  cannot read  http://app.com   — different scheme",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 107,
      "level": "beginner",
      "q": "What is an API?",
      "a": "The problem before\nThe website talked to the database from the browser. Every screen invented its own way to save a todo. Mobile and web could not share work.\n\nWhat this is\nA contract so two programs can talk. A web API is HTTP + JSON: URLs, methods, bodies, error shapes.\n\nWhat it solves\nThe UI calls the API. The API talks to the database. Phone and web share the same /todos.\n\nReal-life example\nA restaurant. You order 'one dosa' (POST /orders). You do not walk into the kitchen.\n\nUses\nAny app with a UI and a server. Same idea in Express, FastAPI, or Go.\n\nWatch out\nThe browser should not hold the DB password.",
      "code": "const notes = await fetch(\"/api/notes\").then((r) => r.json());  // UI\napp.get(\"/api/notes\", async (req, res) => {\n  res.json(await db.query(\"SELECT id, title FROM notes\"));\n});",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 108,
      "level": "beginner",
      "q": "What is REST API?",
      "a": "The problem before\nEvery team invented verbs like /getTodos, /saveTodoNow, /doDelete. Mobile and web could not guess the next URL.\n\nWhat this is\nREST is a style: URLs name resources (/todos/5). HTTP verbs name actions. GET reads, POST creates, PUT/PATCH update, DELETE removes.\n\nWhat it solves\nOne shared menu. Stateless — each request carries a token if needed. JSON is a plate, not REST itself.\n\nReal-life example\nA menu with dish numbers. Table 5 is /tables/5. You do not invent /pleaseBringWaterNow as a new language each week.\n\nUses\nCRUD APIs that many clients share. The default interview answer for 'how should our HTTP API look?'.\n\nWatch out\nGET that deletes. Calling any JSON URL 'REST' without resource URLs and verbs.",
      "code": "GET    /todos      // list\nPOST   /todos      // create\nGET    /todos/5    // one\nPATCH  /todos/5    // update\nDELETE /todos/5    // remove",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 109,
      "level": "beginner",
      "q": "What is JSON?",
      "a": "A text format for objects, arrays, strings, numbers, booleans, and null. No functions, comments, or undefined. JSON.parse text → data. JSON.stringify data → text. APIs use it everywhere.",
      "code": "const text = '{\"name\":\"Ada\",\"age\":21}';\nconst user = JSON.parse(text);  // text → object\nconst back = JSON.stringify(user);  // object → text",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 110,
      "level": "intermediate",
      "q": "REST vs SOAP?",
      "a": "REST is HTTP + resources + JSON (usually), simple to call with fetch. SOAP is an XML protocol with a WSDL and stricter contracts, common in older enterprise. New public APIs are almost always REST or GraphQL, not SOAP.",
      "code": "fetch(\"/api/todos\");  // REST + JSON\n// SOAP: XML envelope + POST to one endpoint",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 111,
      "level": "beginner",
      "q": "What is authentication vs authorization?",
      "a": "Authentication: who you are (login, token). Authorization: what you may do (admin delete, owner-only). 401 = we do not know you. 403 = we know you, you may not. Hiding a button is not security — the server must check.",
      "code": "if (!req.user) return res.status(401).json({ error: \"login\" });\nif (req.user.role !== \"admin\") return res.status(403).json({ error: \"forbidden\" });",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 112,
      "level": "intermediate",
      "q": "What is JWT?",
      "a": "A JSON Web Token is a signed ticket: header.payload.signature. The server signs it with a secret. The client sends it as Bearer. The server verifies. Do not put secrets in the payload — anyone can read it. Keep the life short. HttpOnly cookie is safer than localStorage.",
      "code": "const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: \"1d\" });\n// Authorization: Bearer <token>\nreq.user = jwt.verify(token, process.env.JWT_SECRET);",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 113,
      "level": "intermediate",
      "q": "What is OAuth?",
      "a": "A way to let a user log in with Google/GitHub without you storing their Google password. Your app gets a token to call that provider (or an id token). OAuth is authorization to an API. OpenID Connect on top of it is \"who is this user\".",
      "code": "// User → Google consent → code → your /callback\n// your server swaps code for tokens — never put the client secret in React",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 114,
      "level": "intermediate",
      "q": "What is CSRF?",
      "a": "Cross-Site Request Forgery: another site makes the user's browser send a request to your API with their cookie. SameSite=Lax/Strict cookies help. CSRF tokens help. Authorization: Bearer from JS is not sent automatically by another site.",
      "code": "res.cookie(\"sid\", sid, { httpOnly: true, sameSite: \"lax\", secure: true });  // CSRF help",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 115,
      "level": "intermediate",
      "q": "What is XSS?",
      "a": "Cross-site scripting: attacker text runs as JS on your page. innerHTML of user input is the classic hole. They can steal tokens from localStorage. Use textContent, escape HTML, Content-Security-Policy.",
      "code": "el.textContent = userName;  // safe\n// el.innerHTML = userName;  // dangerous if userName has <script>",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 116,
      "level": "intermediate",
      "q": "What is SQL injection?",
      "a": "If you glue user text into SQL, they can close the quote and run their own command. Always use parameters ($1, ?) so the driver sends data separately from the query.",
      "code": "await db.query(\"SELECT * FROM users WHERE email = $1\", [email]);  // safe\n// \"SELECT * FROM users WHERE email = '\" + email + \"'\"  // never",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 117,
      "level": "intermediate",
      "q": "What is a WebSocket?",
      "a": "A long-lived connection so the server can push (chat, live scores). Starts as HTTP, then upgrades. Not request/response after that. Use HTTPS (wss://) in production. REST is still better for CRUD.",
      "code": "const ws = new WebSocket(\"wss://api.example.com/chat\");  // encrypted\nws.onmessage = (e) => console.log(e.data);  // server pushed\nws.send(JSON.stringify({ text: \"hi\" }));",
      "ask": "Most asked · Amazon · Google · Microsoft"
    }
  ]
};
