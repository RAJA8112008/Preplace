const fs = require("fs");
const path = require("path");

const Q = (id, level, q, a, code, ask) => ({
  id, level, q, a, code,
  ask: ask || "Most asked · Amazon · Google · Microsoft"
});
const N = (title, body) => ({ title, body });
const E = (title, desc, code, lang = "js") => ({ title, lang, desc, code });

const data = {
  kind: "practice",
  notes: [
    N("How to use this sheet", "These are the JS, HTTP, DNS, and browser questions companies repeat. Read the answer. Then read the example — code on the left, easy meaning on the right."),
    N("JavaScript", "var/let/const, hoisting, TDZ, scope, closures, this, event loop, promises, DOM events, copies, modules."),
    N("HTTP / HTTPS", "Methods, status codes, headers, cookies, CORS, caching, HTTP/2. HTTPS is HTTP plus TLS."),
    N("DNS & networking", "Name to IP, records, TCP vs UDP, ports, proxy, CDN, load balancer."),
    N("Browser / web", "DOM, storage, same-origin, REST, JWT, OAuth, XSS, CSRF, SQL injection, WebSockets.")
  ],
  examples: [
    E("var vs let vs const", "Three ways to make a name.", `var old = 1;  // whole function, can change
let score = 10;  // this { } block, can change
const name = "Ada";  // this { } block, cannot point at a new value
score = 11;  // ok
// name = "Bob";  // error`),
    E("Event loop order", "Sync, then microtask, then timer.", `console.log("A");  // now — call stack
Promise.resolve().then(() => console.log("B"));  // microtask
setTimeout(() => console.log("C"), 0);  // macrotask
// prints A, then B, then C`),
    E("HTTPS fetch", "Encrypted request.", `const res = await fetch("https://api.example.com/todos");  // TLS + HTTP
if (!res.ok) throw new Error("bad status");  // 404 does not throw by itself
const data = await res.json();`),
    E("DNS in one line", "Name → IP before the request.", `// google.com  →  resolver  →  142.250.x.x  →  then HTTPS`, "txt"),
    E("Auth vs authz", "Who you are vs what you may do.", `if (!req.user) return res.status(401).json({ error: "login" });  // authentication
if (req.user.role !== "admin") return res.status(403).json({ error: "forbidden" });  // authorization`)
  ],
  questions: []
};

let id = 1;
const add = (level, q, a, code, ask) => {
  data.questions.push(Q(id++, level, q, a, code, ask));
};

add("beginner", "What is the difference between var, let, and const?",
  "var is function-scoped and can be reassigned. let is block-scoped and can be reassigned. const is block-scoped and cannot point at a new value (an object inside const can still change). Use const by default, let when the name must change, and avoid var.",
  `function demo() {
  var old = 1;  // lives in the whole function
  let score = 10;  // lives in this { } only
  const name = "Ada";  // cannot do name = "Bob"
  score = 11;  // let can change
}`);

add("beginner", "What is hoisting?",
  "JavaScript sets up declarations before it runs lines top to bottom. A function declaration is ready at the top of its scope. var exists early but is undefined until the assignment. let and const are hoisted too, but they sit in the Temporal Dead Zone until their line.",
  `console.log(a);  // undefined — var is hoisted
var a = 5;
ok();  // works — function declaration is hoisted
function ok() { return "hi"; }`);

add("beginner", "What is the Temporal Dead Zone (TDZ)?",
  "The TDZ is the stretch from the start of a block until the let or const line. The name exists, but using it throws ReferenceError. var would have been undefined instead. Declare first, then use.",
  `{
  // console.log(x);  // ReferenceError — still in the TDZ
  let x = 1;  // now x is alive
  console.log(x);
}`);

add("beginner", "What is scope? Explain global, function, and block scope.",
  "Scope is where a name can be used. Global: the whole file / window. Function: only inside that function (var, and function names). Block: only inside the nearest { } (let, const). Inner scopes can read outer names. Outer cannot read inner names.",
  `const g = "global";  // whole file
function demo() {
  var f = "function";  // whole function
  if (true) {
    let b = "block";  // only this if
    console.log(g, f, b);  // inner can read outer
  }
}`);

add("beginner", "What is a closure?",
  "A closure is an inner function that still sees variables from the outer function after the outer function has finished. Those variables stay alive because the inner function still needs them. Used for counters, private data, and callbacks.",
  `function makeCounter() {
  let n = 0;  // private — closed over
  return function next() {
    n = n + 1;  // still sees n
    return n;
  };
}
const count = makeCounter();
console.log(count());  // 1
console.log(count());  // 2`);

add("beginner", "What is the difference between == and ===?",
  "== converts types, then compares (1 == \"1\" is true). === compares value and type with no conversion (1 === \"1\" is false). == also makes odd matches like 0 == \"\". Prefer ===.",
  `console.log(1 === "1");  // false — number vs text
console.log(1 == "1");  // true — == converts
console.log(0 == "");  // true — surprising
console.log(0 === "");  // false — safer`);

add("beginner", "What are primitive and non-primitive data types?",
  "Primitives are one simple value: string, number, boolean, null, undefined, symbol, bigint. Copying a primitive copies the value. Non-primitives are objects (arrays, functions, dates). Copying an object usually copies a pointer to the same object.",
  `const name = "Ada";  // primitive — string
const age = 21;  // primitive — number
const user = { name };  // non-primitive — object
const copy = user;  // same object, not a new one
copy.name = "Bob";  // user.name is also Bob`);

add("beginner", "What is the difference between null and undefined?",
  "undefined means nobody set this yet. null means you set it to empty on purpose. A missing field is usually undefined. You assign null when you clear something. They are not the same value.",
  `let city;  // undefined — not set
const user = { name: "Ada" };
console.log(user.age);  // undefined — no such field
user.age = null;  // cleared on purpose
console.log(user.age);  // null`);

add("beginner", "What is NaN?",
  "NaN means Not a Number — a broken number result like Number(\"hello\"). NaN !== NaN. Use Number.isNaN(x). Number.isFinite is often better for user input because it also rejects Infinity.",
  `const bad = Number("hello");  // NaN
console.log(bad === bad);  // false
console.log(Number.isNaN(bad));  // true — correct test
console.log(Number.isFinite(10));  // true`);

add("beginner", "What is the difference between function declaration, function expression, and arrow function?",
  "A declaration is function name() {} and is hoisted. An expression is const name = function () {} and is not hoisted. An arrow is const name = () => {} — short, no own this, cannot be used with new. Use a declaration or normal method when you need this or hoisting.",
  `function add(a, b) { return a + b; }  // declaration — hoisted
const sub = function (a, b) { return a - b; };  // expression
const mul = (a, b) => a * b;  // arrow — no own this`);

add("intermediate", "How does this work in JavaScript?",
  "this is who called the function, not where you wrote it. obj.method() → this is obj. A plain function in strict mode can have this as undefined. Arrow functions borrow this from the surrounding code. call, apply, and bind set this on purpose.",
  `const user = {
  name: "Ada",
  hi() { return this.name; }  // this = user when you call user.hi()
};
console.log(user.hi());  // Ada
const hi = user.hi;
// hi();  // this is not user anymore`);

add("intermediate", "What are call, apply, and bind?",
  "call runs now with this and arguments listed one by one. apply runs now with arguments as an array. bind does not run yet — it returns a new function with this locked. Use bind for callbacks that would lose this.",
  `function greet(city) {
  return this.name + " in " + city;
}
const user = { name: "Ada" };
greet.call(user, "Pune");  // run now
greet.apply(user, ["Pune"]);  // args as a list
const bound = greet.bind(user);  // lock this
console.log(bound("Delhi"));`);

add("intermediate", "What is the event loop?",
  "JavaScript has one main thread. The event loop runs the call stack first. When the stack is empty it runs microtasks (Promise.then). Then it runs macrotasks (setTimeout, clicks). That is why a resolved Promise prints before setTimeout(..., 0).",
  `console.log("A");  // stack — now
Promise.resolve().then(() => console.log("B"));  // microtask
setTimeout(() => console.log("C"), 0);  // macrotask
// A, then B, then C`);

add("intermediate", "What are the call stack, callback queue, and microtask queue?",
  "The call stack is the functions running now. The microtask queue holds Promise.then and queueMicrotask. The callback (macro) queue holds timers and many events. Empty the stack → drain microtasks → one macrotask → repeat.",
  `setTimeout(() => console.log("macro"), 0);  // callback queue
queueMicrotask(() => console.log("micro"));  // microtask queue
console.log("sync");  // call stack
// sync, micro, macro`);

add("intermediate", "What are Promises?",
  "A Promise is an object for a value that may arrive later. It starts pending, then becomes fulfilled or rejected, only once. then / catch / finally queue the next step. Use them for network and any waiting work.",
  `const pizza = new Promise((resolve, reject) => {
  resolve("ready");  // success — pending → fulfilled
});
pizza.then((food) => console.log(food)).catch((err) => console.log(err));`);

add("intermediate", "Difference between .then() and async/await?",
  "They are the same idea. await pauses inside an async function until the Promise settles. The code reads top to bottom. Use try/catch with await. Use .then when you cannot use await. An async function always returns a Promise.",
  `async function load() {
  try {
    const res = await fetch("/api/todos");  // wait here
    return res.json();
  } catch (err) {
    console.log("network failed");
  }
}`);

add("intermediate", "What are Promise.all(), Promise.allSettled(), Promise.race(), and Promise.any()?",
  "all waits for every success and fails if one fails. allSettled waits for everyone and never short-circuits. race uses whoever finishes first (win or lose). any uses the first success and only fails if all fail.",
  `const a = Promise.resolve(1);
const b = Promise.resolve(2);
Promise.all([a, b]).then(console.log);  // [1, 2] — all must succeed
Promise.allSettled([a, b]).then(console.log);  // status of each
Promise.race([a, b]).then(console.log);  // first done
Promise.any([a, b]).then(console.log);  // first success`);

add("intermediate", "What is event bubbling and event capturing?",
  "Capturing walks down from window to the target. Bubbling walks back up. Listeners default to bubble. Use capture: true to listen on the way down. Capture runs first, then the target, then bubble.",
  `parent.addEventListener("click", () => console.log("bubble"));  // way up
parent.addEventListener("click", () => console.log("capture"), true);  // way down`);

add("intermediate", "What is event delegation?",
  "One listener on a parent handles many children. event.target (or closest) tells you which child was clicked. New children added later still work. Fewer listeners, less memory. Perfect for a growing todo list.",
  `list.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-id]");  // which row?
  if (!btn) return;
  removeTodo(Number(btn.dataset.id));
});`);

add("intermediate", "What is the difference between shallow copy and deep copy?",
  "A shallow copy clones only the first layer. Nested objects still point at the same memory. A deep copy clones nested values too. Spread is shallow. structuredClone is deep for most data.",
  `const a = { inner: { n: 1 } };
const shallow = { ...a };  // first layer only
shallow.inner.n = 2;  // also changes a.inner
const deep = structuredClone(a);  // nested copy
deep.inner.n = 3;  // a stays 2`);

add("beginner", "What is the spread operator?",
  "Spread is ... that pours items out of an array or object. Copy lists, merge objects, or pass many arguments. It is shallow. Rest is the opposite — it gathers leftovers into an array.",
  `const a = [1, 2];
const b = [...a, 3];  // [1, 2, 3]
const user = { name: "Ada" };
const full = { ...user, age: 21 };  // copy + extra field`);

add("beginner", "What is destructuring?",
  "Destructuring unpacks values from an array or object into variables in one line. You can rename fields and set defaults. APIs and React props use this a lot. A missing field is undefined, not a throw.",
  `const user = { name: "Ada", age: 21 };
const { name, age } = user;  // pull fields out
const { name: n } = user;  // rename to n
const [first, second] = ["a", "b"];`);

add("beginner", "What are rest parameters?",
  "Rest is ... in a function parameter list. It gathers leftover arguments into a real array. It must be last. Different from the arguments object, which is array-like and not in arrows.",
  `function sum(...nums) {
  return nums.reduce((a, n) => a + n, 0);  // nums is a real array
}
console.log(sum(1, 2, 3));  // 6`);

add("intermediate", "What are higher-order functions?",
  "A higher-order function takes a function as an argument, or returns a function, or both. map, filter, reduce, and debounce are higher-order. They let you pass the \"what\" and reuse the \"how\".",
  `function twice(fn) {
  return function (x) { return fn(fn(x)); };  // returns a function
}
const add1 = (n) => n + 1;
console.log(twice(add1)(3));  // 5`);

add("beginner", "Explain map(), filter(), reduce(), forEach().",
  "map builds a new list of changed values. filter builds a new list of kept items. reduce boils a list down to one value. forEach runs a side effect and returns undefined. Do not expect forEach to give you a list.",
  `const nums = [1, 2, 3, 4];
const doubled = nums.map((n) => n * 2);  // [2, 4, 6, 8]
const evens = nums.filter((n) => n % 2 === 0);  // [2, 4]
const total = nums.reduce((sum, n) => sum + n, 0);  // 10
nums.forEach((n) => console.log(n));  // side effect only`);

add("intermediate", "What is prototypal inheritance?",
  "An object can borrow fields from a parent (its prototype). If a field is missing, JS walks up the chain. That is why arrays have map even if you never added map. class is a clearer way to set up the same chain.",
  `const animal = { eat() { return "yum"; } };
const dog = Object.create(animal);  // parent = animal
dog.bark = function () { return "woof"; };
console.log(dog.bark());  // own method
console.log(dog.eat());  // found on parent`);

add("beginner", "What are JavaScript classes?",
  "class is syntax for a constructor plus methods on the prototype. constructor runs when you new. extends sets the parent. super calls the parent. Under the hood it is still prototypes.",
  `class User {
  constructor(name) { this.name = name; }  // runs on new
  hi() { return "hi " + this.name; }  // on the prototype
}
const u = new User("Ada");
console.log(u.hi());`);

add("intermediate", "What are ES modules (import/export)?",
  "A module is a file that exports names for other files to import. Named exports share many names. One default export can be imported with any name. Modules have their own scope and stay in strict mode. In the browser, type=\"module\" on the script tag.",
  `export function add(a, b) { return a + b; }  // named
export default function area(r) { return r * r; }  // one default
// other file:
// import area, { add } from "./math.js";`);

add("intermediate", "What is debouncing vs throttling?",
  "Debounce waits until you stop calling, then runs once (search box). Throttle runs at most once every N ms even if you keep calling (scroll). Both cut extra work.",
  `function debounce(fn, ms) {
  let id;
  return function (...args) {
    clearTimeout(id);  // cancel last wait
    id = setTimeout(() => fn(...args), ms);  // run after quiet
  };
}`);

add("intermediate", "What is garbage collection in JavaScript?",
  "The collector frees objects that nothing can reach from roots (stack, globals). You do not free memory by hand. A leak is data you no longer need but still hold a pointer to — forgotten timers, global caches, closures holding huge data.",
  `function demo() {
  const temp = { n: 1 };  // only used here
  return temp.n;
}
demo();  // temp can be collected after
let keep = { n: 2 };  // still reachable`);

add("beginner", "What is HTTP?",
  "HTTP is the request and response language of the web. The client asks (method + URL + headers + optional body). The server answers (status + headers + body). It is text-based and stateless — each request should carry what it needs.",
  `const res = await fetch("/api/todos");  // HTTP GET
console.log(res.status);  // 200 if ok
const data = await res.json();`);

add("beginner", "What is HTTPS?",
  "HTTPS is HTTP inside TLS encryption. The padlock means the path is encrypted and the certificate helps prove you reached the real server. Login, cookies, and tokens must use HTTPS in production.",
  `await fetch("https://api.example.com/login", { method: "POST", body: form });  // encrypted
// http://  — never for a password`);

add("beginner", "Difference between HTTP and HTTPS?",
  "Same verbs and URLs. HTTPS adds TLS so people on the Wi-Fi cannot read the bytes. HTTPS uses port 443 by default, HTTP uses 80. Cookies marked Secure only travel on HTTPS. Mixed content is an HTTPS page calling http:// — the browser blocks it.",
  `fetch("https://api.example.com/me");  // good
// fetch("http://api.example.com/me")  // blocked on an https:// page`);

add("intermediate", "How does HTTPS provide security?",
  "TLS does a handshake. The server shows a certificate. They agree on keys. After that, HTTP bytes are encrypted (confidentiality) and tampered bytes fail (integrity). A trusted CA helps you know it is not a fake host (authentication of the server).",
  `// browser → TLS handshake + cert check → then HTTP GET /todos
listen 443 ssl;  // TLS often ends at Nginx`);

add("intermediate", "What is TLS/SSL?",
  "TLS is the modern name for the encryption layer. SSL is the old name people still say. TLS 1.2/1.3 is what you want. It sits under HTTP to make HTTPS. Certificates come from a CA (or Let's Encrypt).",
  `server {
  listen 443 ssl;
  ssl_certificate /etc/letsencrypt/live/ex/fullchain.pem;  // public cert
}`);

add("beginner", "What happens when you enter a URL in the browser?",
  "Parse the URL. DNS finds the IP. Open a connection (TCP + TLS for HTTPS). Send an HTTP request. Server answers HTML or JSON. Browser asks for CSS, JS, images. JS runs. The page paints. Cache or CDN can skip some steps.",
  `async function openHome() {
  const res = await fetch("https://example.com/");  // DNS + TLS + HTTP
  const html = await res.text();
  console.log(html.slice(0, 40));
}`);

add("beginner", "What are HTTP methods?",
  "Verbs that say the action. GET reads. POST creates. PUT replaces the whole resource. PATCH changes some fields. DELETE removes. HEAD is GET without a body. OPTIONS is the CORS preflight.",
  `app.get("/todos", list);  // Read
app.post("/todos", create);  // Create
app.put("/todos/:id", replace);  // replace all fields
app.patch("/todos/:id", update);  // some fields
app.delete("/todos/:id", remove);`);

add("beginner", "What does GET do?",
  "GET reads. It should not change data. It can be cached and retried. Put filters in the query string, not a body. Never delete or charge a card with GET.",
  `app.get("/todos/:id", async (req, res) => {
  const row = await find(req.params.id);  // Read
  if (!row) return res.status(404).json({ error: "missing" });
  res.json(row);
});`);

add("beginner", "What does POST do?",
  "POST creates or triggers an action. Repeating POST can create two rows. Send a JSON body. Answer 201 + the new row when you create.",
  `app.post("/todos", (req, res) => {
  const item = { id: Date.now(), text: req.body.text };  // Create
  todos.push(item);
  res.status(201).json(item);
});`);

add("beginner", "What does PUT do?",
  "PUT replaces the whole resource with the body you send. Missing fields are often cleared. Sending the same PUT twice should leave the same result (idempotent).",
  `app.put("/todos/:id", (req, res) => {
  todos[id] = { id, text: req.body.text, done: req.body.done };  // full replace
  res.json(todos[id]);
});`);

add("beginner", "What does PATCH do?",
  "PATCH changes only the fields you send. Other fields stay. Use it to tick done: true without resending the whole todo.",
  `app.patch("/todos/:id", (req, res) => {
  if (req.body.done !== undefined) t.done = req.body.done;  // only this field
  res.json(t);
});`);

add("beginner", "What does DELETE do?",
  "DELETE removes the resource. Sending it twice should still end as \"gone\" (idempotent). Answer 204 with no body, or 404 if you want to say it was already missing.",
  `app.delete("/todos/:id", (req, res) => {
  todos = todos.filter((t) => t.id !== Number(req.params.id));  // Delete
  res.status(204).end();
});`);

add("beginner", "Difference between PUT and PATCH?",
  "PUT = replace the whole object. PATCH = change some fields. If the client sends only { done: true }, PATCH ticks the todo. PUT would wipe text unless the client sent text too.",
  `// PATCH { done: true }  →  text stays
// PUT  { done: true }   →  text may be lost if you replace the row`);

add("beginner", "Difference between GET and POST?",
  "GET reads and is safe to retry and cache. POST writes or triggers work and can create two rows if retried. GET has no meaningful body. POST has a body. Passwords go in POST over HTTPS, never in a GET query string.",
  `fetch("/todos");  // GET — read
fetch("/todos", { method: "POST", body: JSON.stringify({ text: "read" }) });  // create`);

add("beginner", "What are HTTP status codes?",
  "A number that says how the request went. 2xx success, 3xx go somewhere else, 4xx your request is wrong, 5xx the server broke. The UI branches on these numbers.",
  `if (res.status === 201) setTodos((list) => list.concat(await res.json()));
if (res.status === 401) navigate("/login");
if (res.status === 403) setErr("not allowed");`);

add("beginner", "What is 200 OK?",
  "The request succeeded and the body is the answer. Typical for GET and for PATCH that returns the updated row.",
  `res.status(200).json(todo);  // here is the data`);

add("beginner", "What is 201 Created?",
  "A new resource was created. Return the new row (and Location header if you can). Typical for POST.",
  `res.status(201).json(item);  // created`);

add("beginner", "What are 301 and 302?",
  "Redirects. 301 is permanent — search engines update the URL. 302 is temporary — go here this time. Browsers follow them. APIs more often send 201 or 200 than a redirect.",
  `res.redirect(301, "https://new.example.com" + req.url);  // forever
res.redirect(302, rows[0].url);  // short link this time`);

add("beginner", "What is 400 Bad Request?",
  "The input is missing or wrong — empty title, bad JSON, invalid id. The client should fix the request. Not a login problem.",
  `if (!text) return res.status(400).json({ error: "text required" });`);

add("beginner", "What is 401 Unauthorized?",
  "We do not know who you are. Log in. Missing or bad token. The name is historical — it means unauthenticated.",
  `res.status(401).json({ error: "login first" });`);

add("beginner", "What is 403 Forbidden?",
  "We know who you are, and you may not. Role is user, not admin. Or the todo is not yours.",
  `if (req.user.role !== "admin") return res.status(403).json({ error: "forbidden" });`);

add("beginner", "What is 404 Not Found?",
  "That URL or id is not here. Sometimes used so we do not leak that a private row exists.",
  `if (!row) return res.status(404).json({ error: "missing" });`);

add("beginner", "What is 500 Internal Server Error?",
  "The server crashed or hit a bug. Do not send stack traces to the public. Log them. Fix the code. The client can retry later, not by changing the form.",
  `app.use((err, req, res, next) => {
  console.error(err);  // log the real error
  res.status(500).json({ error: "server error" });  // generic to the user
});`);

add("beginner", "What are HTTP headers?",
  "Extra labels on the request or response: Content-Type, Authorization, Cookie, Cache-Control, Access-Control-Allow-Origin. They are not the body. The browser and server both read them.",
  `fetch("/api/todos", {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  }
});`);

add("beginner", "What are request headers and response headers?",
  "Request headers are what the client sends (Authorization, Accept, Cookie). Response headers are what the server sends (Content-Type, Set-Cookie, Cache-Control, CORS). DevTools Network tab shows both.",
  `// request:  Authorization: Bearer xxx
// response: Content-Type: application/json`);

add("beginner", "What are HTTP cookies?",
  "Small values the server can Set-Cookie. The browser stores them and sends them back on later requests to that site. Use HttpOnly so JS cannot read them, Secure so they only go on HTTPS, SameSite to help CSRF.",
  `res.cookie("sid", sid, { httpOnly: true, secure: true, sameSite: "lax" });`);

add("intermediate", "What is session vs cookie?",
  "A cookie is the small value in the browser. A session is the login memory on the server (user id, expiry) keyed by that cookie. The cookie is the ticket. The session is the coat-check room. A JWT can skip the server room and put the data in the ticket.",
  `req.session.userId = user.id;  // server memory
res.cookie("sid", req.session.id, { httpOnly: true });  // ticket in the browser`);

add("intermediate", "What is CORS?",
  "A browser rule: a page on one origin may not read another origin unless the server allows it. Origin is scheme + host + port. :5173 and :3000 are different. Postman is not a browser, so it skips CORS. Fix it on the server or proxy /api.",
  `app.use(cors({ origin: "http://localhost:5173" }));  // allow this UI
// or Vite proxy: "/api" → http://localhost:3000`);

add("intermediate", "What is a preflight request?",
  "For some POSTs (JSON, extra headers) the browser first sends OPTIONS: \"may I send this?\" The server must allow the method and headers. If OPTIONS fails, your POST never hits the route. Simple GET often skips preflight.",
  `app.options("/api/notes", (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(204).end();
});`);

add("intermediate", "What is HTTP caching?",
  "The browser or CDN can reuse a response instead of asking again. Cache-Control: max-age, ETag, and 304 Not Modified are the tools. Public JS bundles can be cached. Private /api/todos must not be cached as if they were public.",
  `res.set("Cache-Control", "public, max-age=31536000");  // hashed JS file
res.set("Cache-Control", "private, no-store");  // /api/me`);

add("advanced", "What is the difference between HTTP/1.1, HTTP/2, and HTTP/3?",
  "1.1 is text and often one request per connection (or a few). HTTP/2 multiplexes many streams on one TCP connection (binary). HTTP/3 uses QUIC over UDP so a lost packet does not stall every stream. HTTPS sites today are usually HTTP/2 or 3 at the edge.",
  `// you still write fetch() the same way
// the browser and server negotiate 1.1 / 2 / 3`);

add("intermediate", "What is keep-alive?",
  "Keep the TCP connection open so the next request does not handshake again. HTTP/1.1 Connection: keep-alive. HTTP/2 does this by default with multiplexing. Faster pages, fewer handshakes.",
  `// Connection: keep-alive
// next GET /style.css reuses the same TCP connection`);

add("beginner", "What is DNS?",
  "DNS is the phone book of the internet. It turns a name like google.com into an IP address so the browser knows which computer to call.",
  `// google.com  →  DNS  →  142.250.x.x
const res = await fetch("https://google.com");  // browser already did DNS`);

add("beginner", "Why do we need DNS?",
  "People remember names. Machines route to numbers. DNS lets you move a site to a new IP without changing the name everyone types. TTL says how long a resolver may remember the old number.",
  `// change A record → new IP, same https://app.example.com`);

add("beginner", "What happens when you type google.com into a browser?",
  "Browser cache → OS cache → resolver (often your ISP or 8.8.8.8) → root → TLD (.com) → authoritative name servers → A/AAAA record → IP. Then TCP + TLS + HTTP. Same story as any URL, with DNS first.",
  `// cache → resolver → root → .com → ns → IP → HTTPS`);

add("beginner", "What is a DNS resolver?",
  "The first server you ask, usually your router, ISP, or 1.1.1.1 / 8.8.8.8. It either has the answer cached or walks the DNS tree for you (recursive lookup) and then caches the result.",
  `// your PC → 8.8.8.8 (resolver) → rest of DNS`);

add("beginner", "What are DNS records?",
  "Rows in the DNS database. Each type answers a different question: where is the IPv4, where is mail, what is the alias, who are the name servers, extra text.",
  `// A      → IPv4
// AAAA   → IPv6
// CNAME  → another name
// MX     → mail host
// NS     → who answers for this zone
// TXT    → text (SPF, verify)`);

add("beginner", "What is an A record?",
  "A maps a name to an IPv4 address. app.example.com → 203.0.113.10. This is the most common \"where is the site\" record.",
  `// A  app.example.com  →  203.0.113.10`);

add("beginner", "What is an AAAA record?",
  "AAAA maps a name to an IPv6 address. Same job as A, newer address family.",
  `// AAAA  app.example.com  →  2001:db8::1`);

add("beginner", "What is a CNAME record?",
  "CNAME is an alias. www.example.com → example.com. The client then looks up the target. You cannot put other records on the same name as a CNAME. Apex domains often use A/ALIAS instead.",
  `// CNAME  www.example.com  →  example.com`);

add("beginner", "What is an MX record?",
  "MX says where email for this domain should go, with a priority number. Mail servers use it, not the browser.",
  `// MX  example.com  →  10 mail.example.com`);

add("beginner", "What is an NS record?",
  "NS names the authoritative name servers for the zone — who is allowed to answer questions about example.com.",
  `// NS  example.com  →  ns1.registrar.com`);

add("beginner", "What is a TXT record?",
  "Free text. Used for SPF/DKIM (mail), domain verify (Google, GitHub), and ACME challenges. Not a web address.",
  `// TXT  example.com  →  "v=spf1 include:_spf.google.com ~all"`);

add("beginner", "What is DNS caching?",
  "Resolvers and browsers remember an answer for TTL seconds so they do not walk the tree every time. After you change an A record, old IPs can linger until TTL dies. Lower TTL before a planned move.",
  `// TTL 300  →  resolvers may keep the old IP for 5 minutes`);

add("beginner", "What is TTL in DNS?",
  "Time to live — how many seconds a resolver may cache this record. Short TTL means changes show up faster and more queries. Long TTL means fewer queries and slower cutovers.",
  `// A  app  300  203.0.113.10   // 5 minutes`);

add("beginner", "What is the difference between a domain name and an IP address?",
  "A domain is the human name (example.com). An IP is the machine number (203.0.113.10). DNS maps one to the other. You can hit an IP in the browser, but the certificate and Host header usually need the name.",
  `// name: api.example.com
// IP:   203.0.113.10`);

add("intermediate", "What is recursive vs iterative DNS lookup?",
  "Recursive: your resolver does the whole walk and returns the final IP. Iterative: each server says \"ask that one next\" and the client walks. Home PCs send recursive queries to 8.8.8.8. That resolver then does the iterative walk.",
  `// PC  --recursive-->  8.8.8.8  --iterative-->  root / .com / ns`);

add("beginner", "What is an IP address?",
  "A number that names a host on a network so packets know where to go. IPv4 looks like 203.0.113.10. IPv6 is longer. Private IPs stay inside a LAN. Public IPs are reachable on the internet.",
  `// 127.0.0.1     this machine
// 192.168.1.5   home LAN
// 203.0.113.10  public`);

add("beginner", "Difference between IPv4 and IPv6?",
  "IPv4 is 32-bit (about 4 billion addresses) and we ran out. IPv6 is 128-bit and has room. Many networks are dual-stack. DNS A is IPv4, AAAA is IPv6.",
  `// IPv4  203.0.113.10
// IPv6  2001:db8::1`);

add("beginner", "What is a port?",
  "A number on a host that names which program should get the packet. HTTPS is 443, HTTP 80, Postgres 5432, SSH 22. IP finds the machine. Port finds the app.",
  `// 203.0.113.10:443  →  Nginx HTTPS
// 127.0.0.1:3000    →  Node app`);

add("beginner", "What is TCP?",
  "A reliable connection: handshake, ordered bytes, retransmission if a packet is lost. HTTP/1.1 and HTTP/2 ride on TCP. Use it when every byte matters (web, databases).",
  `// SYN → SYN-ACK → ACK  then HTTP GET`);

add("beginner", "What is UDP?",
  "A datagram with no handshake and no built-in retry. Faster, can drop or reorder. DNS queries, games, video, and HTTP/3 (QUIC) use it. You add reliability in the app if you need it.",
  `// one packet, no connection — DNS often starts as UDP/53`);

add("beginner", "Difference between TCP and UDP?",
  "TCP: connection, ordered, reliable, slower handshake. UDP: no connection, may drop, lower delay. Web pages use TCP (or QUIC). Live video can use UDP. Pick reliability vs speed.",
  `// checkout form  →  TCP / HTTPS
// game tick      →  UDP`);

add("intermediate", "What is a TCP three-way handshake?",
  "To start a TCP connection: client SYN, server SYN-ACK, client ACK. Then data can flow. TLS handshake happens after this on HTTPS. FIN/ACK tears it down later.",
  `// 1 SYN     2 SYN-ACK     3 ACK
// then: ClientHello (TLS) then GET /`);

add("beginner", "What is a socket?",
  "One end of a connection: IP + port + protocol, plus the OS handle your program reads and writes. Node's listen(3000) opens a socket. A TCP connection is two sockets talking.",
  `app.listen(3000);  // socket on 0.0.0.0:3000`);

add("beginner", "What is a firewall?",
  "A filter that allows or blocks traffic by IP, port, and direction. Security groups are cloud firewalls. Do not expose 5432 or 3000 to the world. Allow 443. Allow 22 only from your IP.",
  `// allow 443 from 0.0.0.0/0
// allow 22 from your.ip/32
// deny 5432 from the internet`);

add("beginner", "What is a proxy server?",
  "A forward proxy sits near the client and goes out to the internet for them (school filter, corporate egress). The destination sees the proxy, not every laptop.",
  `// browser → company proxy → https://example.com`);

add("beginner", "What is a reverse proxy?",
  "Sits in front of your servers. Clients hit Nginx or an ALB on 443. It terminates TLS and forwards to Node on 3000. The world never talks to the app process directly.",
  `location / { proxy_pass http://127.0.0.1:3000; }  // reverse proxy`);

add("beginner", "What is a CDN?",
  "Edge caches close to the user for static files (JS, images). The origin is your S3 or Nginx. Faster first byte, less origin load. Do not put private /api/todos on a public CDN key.",
  `// CloudFront → S3
// Cache-Control: public for the JS bundle`);

add("beginner", "What is a load balancer?",
  "One public HTTPS door, many app boxes behind it. Health checks drop bad boxes. Prefer JWT or shared Redis sessions instead of sticky sessions.",
  `app.get("/health", (req, res) => res.json({ ok: true }));  // LB pings this`);

add("beginner", "What is latency?",
  "How long one request waits. Milliseconds from click to first byte. Caused by distance, DNS, TLS, DB, and queues. p95 latency is what interviews want you to measure, not only the average.",
  `console.time("todos");
await db.query("SELECT * FROM todos WHERE user_id = $1", [id]);
console.timeEnd("todos");  // ms for this query`);

add("beginner", "What is bandwidth?",
  "How much data you can push per second (Mbps). High bandwidth and high latency can both exist (a fat pipe far away). A 10 MB image on a slow link is a bandwidth problem. A 200 ms ping to the DB is latency.",
  `// 100 Mbps down  — fat pipe
// 180 ms ping    — still laggy if the server is far`);

add("beginner", "What is FTP?",
  "File Transfer Protocol — an old way to upload and download files. Separate control and data connections. Still seen on some hosts. Prefer SFTP or HTTPS uploads for anything real.",
  `// ftp://files.example.com/photos/ada.jpg   — old
// sftp user@host  or  presigned S3 PUT     — better`);

add("beginner", "What is the difference between FTP and SFTP?",
  "FTP is plain and often unencrypted. SFTP is file transfer over SSH — encrypted, one port (22). FTPS is FTP plus TLS (different from SFTP). Use SFTP or HTTPS.",
  `// SFTP  port 22  — SSH
// FTPS  FTP + TLS
// FTP   plain — avoid`);

add("beginner", "Is FTP encrypted?",
  "Classic FTP is not. Usernames, passwords, and files can be read on the network. SFTP and FTPS are encrypted. Do not send production secrets over plain FTP.",
  `// ftp  — no
// sftp — yes (SSH)`);

add("beginner", "What ports are commonly associated with FTP?",
  "21 is the FTP control port. 20 is active-mode data (old). Passive mode uses a range of high ports. SFTP is 22. Firewalls hate classic FTP because of the extra data ports.",
  `// FTP  21 (control)
// SFTP 22`);

add("beginner", "When would you use FTP/SFTP?",
  "SFTP: drop a batch file on a partner server, deploy static files to a VPS, pull a nightly CSV. New products should use HTTPS uploads (presigned S3) or rsync/SCP. Do not build a user photo feature on FTP.",
  `// partner nightly CSV → SFTP
// user avatar → presigned HTTPS PUT to S3`);

add("beginner", "What is a browser?",
  "A program that fetches HTML/CSS/JS, runs JS, and paints pixels. It is an HTTP client plus a JS engine plus a rendering engine. Chrome, Firefox, Safari, Edge. DevTools let you see Network, Console, and Elements.",
  `// type URL → DNS → HTTPS → HTML → CSS/JS → paint`);

add("beginner", "What is the DOM?",
  "The Document Object Model is the browser's tree of the page. Every tag is a node you can read or change. querySelector finds a node. textContent changes text. addEventListener listens for clicks.",
  `const title = document.querySelector("h1");
title.textContent = "Hello";  // change the tree
const btn = document.createElement("button");
btn.textContent = "Click";
document.body.appendChild(btn);`);

add("beginner", "What is the difference between DOM and BOM?",
  "DOM is the page tree (document, elements). BOM is the browser chrome around it: window, location, navigator, history, screen. alert and location.hash are BOM. querySelector is DOM.",
  `document.querySelector("h1");  // DOM
location.hash = "#/login";  // BOM
console.log(navigator.userAgent);  // BOM`);

add("beginner", "What happens when a webpage loads?",
  "DNS + TLS + GET HTML. Parse HTML. Discover CSS/JS/images and fetch them. Build the DOM. Apply CSS (CSSOM). Combine into a render tree. Layout. Paint. JS can change the DOM and trigger more work.",
  `// HTML → DOM
// CSS → CSSOM
// DOM + CSSOM → render tree → layout → paint
// JS may run and change the DOM again`);

add("intermediate", "What is the rendering process?",
  "Parse → DOM + CSSOM → render tree → layout (where boxes go) → paint (pixels) → composite (layers on the GPU). Changing layout (width, height) is more expensive than changing only color or transform.",
  `el.style.color = "red";  // paint
el.style.width = "200px";  // layout + paint — heavier`);

add("beginner", "What is localStorage?",
  "A key-value store in the browser that stays after refresh. Same origin only. Strings only. JS can read it, so XSS can steal a token you put there. ~5MB. Not sent to the server automatically.",
  `localStorage.setItem("todos", JSON.stringify(list));  // stays
const list = JSON.parse(localStorage.getItem("todos") || "[]");`);

add("beginner", "What is sessionStorage?",
  "Like localStorage but the tab owns it. Close the tab, it is gone. A new tab does not share it. Good for a wizard draft you do not want on the next visit.",
  `sessionStorage.setItem("draft", "hello");  // this tab only`);

add("beginner", "Difference between cookies, localStorage, and sessionStorage?",
  "Cookies go to the server on each request (size small, can be HttpOnly). localStorage stays, JS-only, not sent automatically. sessionStorage dies with the tab. For a login ticket, HttpOnly cookie is safer than localStorage.",
  `localStorage.setItem("theme", "dark");  // JS, stays
sessionStorage.setItem("draft", "hi");  // JS, this tab
document.cookie = "sid=abc; Secure; SameSite=Lax";  // sent to the server`);

add("intermediate", "What is the same-origin policy?",
  "A page may read data only from the same scheme + host + port. That is why :5173 cannot read :3000. Cookies are also origin-scoped (plus Domain/Path). CORS is the server's way to relax this for chosen origins.",
  `// https://app.com  cannot read  https://api.com  unless CORS allows it
// https://app.com  cannot read  http://app.com   — different scheme`);

add("beginner", "What is an API?",
  "A contract so two programs can talk. A web API is usually HTTP + JSON: URLs, methods, bodies, error shapes. The UI calls the API. The API talks to the database. The browser should not hold the DB password.",
  `const notes = await fetch("/api/notes").then((r) => r.json());  // UI
app.get("/api/notes", async (req, res) => {
  res.json(await db.query("SELECT id, title FROM notes"));
});`);

add("beginner", "What is REST API?",
  "A style: URLs name resources (/todos/5). HTTP verbs name actions. GET reads, POST creates, PUT/PATCH update, DELETE removes. Stateless — each request carries a token if needed. JSON is a representation, not REST itself.",
  `GET    /todos      // list
POST   /todos      // create
GET    /todos/5    // one
PATCH  /todos/5    // update
DELETE /todos/5    // remove`);

add("beginner", "What is JSON?",
  "A text format for objects, arrays, strings, numbers, booleans, and null. No functions, comments, or undefined. JSON.parse text → data. JSON.stringify data → text. APIs use it everywhere.",
  `const text = '{"name":"Ada","age":21}';
const user = JSON.parse(text);  // text → object
const back = JSON.stringify(user);  // object → text`);

add("intermediate", "REST vs SOAP?",
  "REST is HTTP + resources + JSON (usually), simple to call with fetch. SOAP is an XML protocol with a WSDL and stricter contracts, common in older enterprise. New public APIs are almost always REST or GraphQL, not SOAP.",
  `fetch("/api/todos");  // REST + JSON
// SOAP: XML envelope + POST to one endpoint`);

add("beginner", "What is authentication vs authorization?",
  "Authentication: who you are (login, token). Authorization: what you may do (admin delete, owner-only). 401 = we do not know you. 403 = we know you, you may not. Hiding a button is not security — the server must check.",
  `if (!req.user) return res.status(401).json({ error: "login" });
if (req.user.role !== "admin") return res.status(403).json({ error: "forbidden" });`);

add("intermediate", "What is JWT?",
  "A JSON Web Token is a signed ticket: header.payload.signature. The server signs it with a secret. The client sends it as Bearer. The server verifies. Do not put secrets in the payload — anyone can read it. Keep the life short. HttpOnly cookie is safer than localStorage.",
  `const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
// Authorization: Bearer <token>
req.user = jwt.verify(token, process.env.JWT_SECRET);`);

add("intermediate", "What is OAuth?",
  "A way to let a user log in with Google/GitHub without you storing their Google password. Your app gets a token to call that provider (or an id token). OAuth is authorization to an API. OpenID Connect on top of it is \"who is this user\".",
  `// User → Google consent → code → your /callback
// your server swaps code for tokens — never put the client secret in React`);

add("intermediate", "What is CSRF?",
  "Cross-Site Request Forgery: another site makes the user's browser send a request to your API with their cookie. SameSite=Lax/Strict cookies help. CSRF tokens help. Authorization: Bearer from JS is not sent automatically by another site.",
  `res.cookie("sid", sid, { httpOnly: true, sameSite: "lax", secure: true });  // CSRF help`);

add("intermediate", "What is XSS?",
  "Cross-site scripting: attacker text runs as JS on your page. innerHTML of user input is the classic hole. They can steal tokens from localStorage. Use textContent, escape HTML, Content-Security-Policy.",
  `el.textContent = userName;  // safe
// el.innerHTML = userName;  // dangerous if userName has <script>`);

add("intermediate", "What is SQL injection?",
  "If you glue user text into SQL, they can close the quote and run their own command. Always use parameters ($1, ?) so the driver sends data separately from the query.",
  `await db.query("SELECT * FROM users WHERE email = $1", [email]);  // safe
// "SELECT * FROM users WHERE email = '" + email + "'"  // never`);

add("intermediate", "What is a WebSocket?",
  "A long-lived connection so the server can push (chat, live scores). Starts as HTTP, then upgrades. Not request/response after that. Use HTTPS (wss://) in production. REST is still better for CRUD.",
  `const ws = new WebSocket("wss://api.example.com/chat");  // encrypted
ws.onmessage = (e) => console.log(e.data);  // server pushed
ws.send(JSON.stringify({ text: "hi" }));`);

fs.writeFileSync(
  path.join(__dirname, "..", "frontend", "data", "practice-web.js"),
  `window.PREP_DATA = window.PREP_DATA || {};\nwindow.PREP_DATA["practice-web"] = ${JSON.stringify(data, null, 2)};\n`
);
console.log("wrote practice-web", data.questions.length, "questions");
