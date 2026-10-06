"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..", "frontend");
const DATA = path.join(ROOT, "data");

const hasHead = (a, h) => new RegExp(`(?:^|\\n)${h}\\n`).test(String(a || ""));

const getCode = (item) => {
  if (item.code) return String(item.code);
  const codes = item.codes || {};
  return String(codes.javascript || codes.html || Object.values(codes)[0] || "");
};

const firstLines = (code, n = 8) => String(code || "")
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l && l !== "{" && l !== "}")
  .slice(0, n);

const clip = (s, n = 360) => {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  if (t.length <= n) return t;
  return t.slice(0, n).replace(/\s+\S*$/, "") + ".";
};

const plainFrom = (a) => {
  const m = String(a || "").match(/Plain answer:\s*([\s\S]*?)(?:\n\nWhy it matters:|\n\nHow the snippet)/);
  return clip(m ? m[1] : "", 420);
};

const watchFrom = (a) => {
  const m = String(a || "").match(/\nWatch out\n([\s\S]*?)(?:\n\n[A-Z][^\n]*\n|$)/);
  return clip(m ? m[1] : "", 280);
};

const numbered = (lines) => lines.map((l, i) => `${i + 1}. ${l}`).join("\n\n");

const lineBlock = (lines) => lines.length
  ? `These are the lines that prove it:\n\n${lines.map((l, i) => `${i + 1}. \`${l}\``).join("\n")}`
  : "This row has little code. Write three lines yourself that prove the rule, including one failed input.";

const FAMILIES = [
  {
    test: (h) => /temporal dead|tdz/.test(h),
    also: (q) => `There is more to ${q} than “let throws if you use it too soon.” The Temporal Dead Zone starts at the beginning of the block, not at the top of the file. An inner \`let x\` hides an outer \`x\` from the first line of the inner block, even before the inner line runs. \`typeof x\` also throws in the TDZ — that is different from a missing global, where \`typeof missing\` is \`"undefined"\`. Default parameters can see earlier parameters but not later \`const\` bindings in the same list. Class bodies have a TDZ for the class name too, which is why you cannot extend a class from inside its own initializer in a messy way. var would have printed \`undefined\` instead of throwing. That contrast is the whole interview: loud error vs silent empty value.`,
    wrong: (q) => `A wrong answer to ${q} is “TDZ means the variable does not exist yet.” The binding exists; you are not allowed to touch it. Another miss: “only const has a TDZ.” let and class do too. Do not say the TDZ is hoisting being broken — it is hoisting with a lock on the name. Do not demo with var and call it TDZ. If they ask what prints, say ReferenceError, not undefined.`,
    follow: () => [
      "Does typeof x throw if x is in the TDZ?",
      "What happens if an inner let x hides an outer x, and you log x on the first line of the inner block?",
      "Why is var’s undefined worse than a TDZ throw in a real bug?",
      "Can a default parameter read a const declared later in the same function?",
      "Where does the TDZ start — the function, the block, or the file?"
    ],
    worked: (q, lines) => `Whiteboard for ${q}. Open a block. Do not log the name yet. Write \`let x = 1\`, then log it — that is 1. Uncomment the early log: ReferenceError, not undefined. Swap let for var: the early log becomes undefined and the page keeps running, which is how a missing sugar jar becomes a cake with no sugar and no crash. ${lineBlock(lines)}`,
    prod: () => `In production the TDZ shows up as “Cannot access before initialization” after a refactor that moved a const below a helper. Fix by declaring first. Linters (no-use-before-define) catch most of it. Do not “fix” it by switching back to var.`
  },
  {
    test: (h) => /hoist/.test(h),
    also: (q) => `More content on ${q}: hoisting is the engine setting up bindings before statements run in that scope. Function declarations are fully ready, so you can call them above their text. var exists early and holds undefined until assignment. let and const are hoisted into the TDZ. Function expressions and const arrows are not callable above their line. Duplicate function declarations in sloppy mode overwrite each other. import names are live bindings, not var. Classes hoist into a TDZ, so \`new Foo()\` above \`class Foo {}\` throws. Interviewers mix these on one snippet: log a var, call a declaration, then point at an arrow.`,
    wrong: (q) => `Wrong for ${q}: “let is not hoisted.” It is hoisted; you cannot use it yet. “Hoisting moves code to the top of the file” — it does not rewrite your source. “I can call a const arrow above its line because functions hoist” — only declarations do. If you cannot say what prints for var vs let vs function ok(){}, you do not have the topic.`,
    follow: () => [
      "What prints if you log a var before its assignment?",
      "Can you call a function declaration above its body?",
      "Can you call const greet = () => {} above that line?",
      "Are class constructors hoisted like function declarations?",
      "Is hoisting per file or per scope?"
    ],
    worked: (q, lines) => `Walk ${q} as print order. Line 1 logs a var — undefined. Line 2 assigns 5. Line 3 calls ok() — works if ok is a declaration. If ok is an arrow stored in const, line 3 throws. ${lineBlock(lines)}`,
    prod: () => `In apps, rely on declarations for helpers in a module, or put const arrows above the first use. Bundlers do not save you from TDZ at runtime. Never use hoisting as a style — declare, then use.`
  },
  {
    test: (h) => /\bvar\b|\blet\b|\bconst\b|scope/.test(h),
    also: (q) => `More on ${q}. Scope is lexical: a name is looked up in the nearest { } room, then outward, then the module. var ignores the inner if/for room and lives in the function. let and const honour the room. const cannot retarget; object fields inside const can still change. for (var i) plus a delayed click shares one i; for (let i) makes a fresh binding each round. Redeclaring let in the same block throws; var quietly reuses the name. Modules have their own top-level scope — a var in a file is not a browser global unless you attach it to window. The loop-callback bug is the classic follow-up: five buttons, five clicks, one printed index.`,
    wrong: (q) => `Wrong for ${q}: “const is immutable.” Only the binding is fixed. “let is function scoped.” It is block scoped. “var is deprecated so I do not need to explain it.” Interviewers still ask because of the loop bug and hoisting. Do not say block scope means the name is deleted from memory at the closing brace — closures can keep it alive.`,
    follow: () => [
      "What prints if five buttons close over var i in a for-loop?",
      "Can you const obj = {}; then obj.x = 1?",
      "Why does redeclaring let throw but var does not?",
      "Is a var at the top of a module a window global?",
      "When is let the right choice instead of const?"
    ],
    worked: (q, lines) => `Demo ${q} with a function that has an if block. Put var old inside the if, let score inside the if, const name inside the if. After the if, old is still visible, score and name are not. Then reassign score (ok) and name (TypeError). Then show for (var i) vs for (let i) with setTimeout. ${lineBlock(lines)}`,
    prod: () => `New code: const by default, let when the binding must move, never var. ESLint no-var plus prefer-const. The production bug is almost always a shared loop index or a leaked var from an if.`
  },
  {
    test: (h) => /closure/.test(h),
    also: (q) => `More on ${q}. A closure is a function plus the lexical environment it was created in. If inner reads count, and you return inner from outer, that count binding stays alive after outer returns. Each call to outer() makes a new environment, so two counters do not share n. That is how makeId() factories, private fields in old JS, and React-era function components with hooks conceptually work. Closures do not automatically leak memory; leaks happen if a long-lived inner function keeps a huge object you forgot. A nested function that never reads outer names is just nested, not a closure you would talk about. Interviewers want: what is captured, when it is created, and whether two calls share state.`,
    wrong: (q) => `Wrong for ${q}: “closure means nested function.” Not unless it uses the outer binding. “Closures are a memory leak.” Only if you retain too much. “Closures copy the value.” They capture the binding; if the outer let changes, the inner function sees the new value unless you snap it in a new let per iteration.`,
    follow: () => [
      "What prints if I call makeCounter twice — one n or two?",
      "Does the inner function see later assignments to the outer let?",
      "How does for (let i) fix the delayed-click closure bug?",
      "When would a closure retain a huge array you did not mean to keep?",
      "Is a method on an object a closure over this?"
    ],
    worked: (q, lines) => `Write makeCounter. n starts at 0. Return a function that does n += 1 and returns n. c1() is 1, then 2. c2() is a new n, so 1. That is the proof two environments exist. ${lineBlock(lines)}`,
    prod: () => `In production, closures hold request-scoped state, debounce timers, and event handlers. Detach listeners and clear timers on unmount or you keep the whole page’s data alive. Server-side, do not close over a mutable req object across awaits without copying the fields you need.`
  },
  {
    test: (h) => /==|===|null|undefined|nan|primitive|typeof|data type/.test(h),
    also: (q) => `More on ${q}. === does not convert. == does, which is why \`0 == ""\` is true and \`null == undefined\` is true. null is assigned empty. undefined is missing (never set, missing argument, missing property). NaN is a broken number; \`NaN === NaN\` is false, so use Number.isNaN. typeof null is "object" for history — test with \`=== null\`. Primitives are copied by value; objects by reference, so two \`{}\` are not ===. JSON has null, never undefined or NaN (those become null or get dropped). Convert query-string text with Number before you compare. Object.is is === except it treats NaN as equal to NaN and distinguishes +0 from -0.`,
    wrong: (q) => `Wrong for ${q}: “== checks value, === checks type.” Both check type; == also coerces. “null and undefined are the same.” They are not, even if == says they are. “typeof null is null.” It is object. “I always use == because it is shorter.” That is a fail in a Google/Amazon screen.`,
    follow: () => [
      "Why is 0 == \"\" true and 0 === \"\" false?",
      "What is typeof null?",
      "How do you test for NaN correctly?",
      "What does JSON.stringify do with undefined object fields?",
      "Are two empty objects === ?"
    ],
    worked: (q, lines) => `Write a table on the board: 0 === \"0\" false, 0 == \"0\" true, null == undefined true, null === undefined false, Number.isNaN(NaN) true, NaN === NaN false. Then pick the snippet and circle the operator. ${lineBlock(lines)}`,
    prod: () => `Production: eslint eqeqeq. Validate query params with Number and Number.isFinite. Treat missing JSON fields as undefined, SQL NULLs as null, and do not mix them in one if without a comment.`
  },
  {
    test: (h) => /\bthis\b|arrow|bind|call, apply|call and apply|prototype|javascript class/.test(h),
    also: (q) => `More on ${q}. this is the call site except for arrows, which close over the outer this. obj.method() sets this to obj. Taking the method off the object (onClick={obj.method}) loses that. bind, an arrow wrapper, or a class field arrow are the usual fixes. call and apply invoke now with a chosen this; apply takes a list. new sets this to the instance. Arrows cannot be new'd and have no arguments object. Prototypes are the shared backpack of methods; classes are syntax over that. Changing Prototype.method changes every instance. Interviewers will pass your method to setTimeout — that is the test.`,
    wrong: (q) => `Wrong for ${q}: “this is the object where the function was written.” That is how arrows feel, not how function methods work. “bind and arrow are the same.” bind creates a wrapper you can pass; an arrow is a different function with lexical this. “class is a new inheritance model.” It is still prototypes.`,
    follow: () => [
      "What is this inside a method passed to setTimeout?",
      "Why can you not new an arrow function?",
      "Difference between call, apply, and bind?",
      "What does a class field arrow capture?",
      "If two objects share a prototype method, do they share this?"
    ],
    worked: (q, lines) => `const user = { name: \"Ada\", hi() { return this.name; } }. user.hi() is Ada. const fn = user.hi; fn() is undefined or global. user.hi.bind(user)() is Ada. An arrow hi: () => this.name would close over the outer this, which is not user. ${lineBlock(lines)}`,
    prod: () => `In React class components, bind in the constructor or use class fields. In DOM handlers, use addEventListener with an arrow or bind, and remove the same function reference. On the server, do not rely on this in plain functions — pass args.`
  },
  {
    test: (h) => /event loop|microtask|call stack|callback queue|promise|async|await/.test(h),
    also: (q) => `More on ${q}. The event loop is one cook: finish the current stack, then microtasks (Promise.then / queueMicrotask / await continuation), then macrotasks (setTimeout, I/O, some DOM events). await pauses only that async function; the rest of the app keeps running. fetch does not throw on HTTP 404; you check res.ok. Promise.all fails fast on the first rejection; allSettled waits for every seat; race takes the first settle; any takes the first fulfill. Unhandled rejections show in the console and can fail CI. Async functions always return a Promise. Interviewers want print order: A, then B (then), then C (timeout).`,
    wrong: (q) => `Wrong for ${q}: “setTimeout(fn, 0) runs before promises.” Microtasks win. “await blocks the whole page.” It blocks that function. “fetch throws on 404.” It does not. “Promise.all and race are the same.” One waits for all fulfills; one takes the first settle including a reject.`,
    follow: () => [
      "Print order: console.log, Promise.then, setTimeout 0?",
      "Does fetch throw on 404?",
      "Promise.all vs allSettled vs race vs any?",
      "What happens if one await throws and there is no try/catch?",
      "Does await inside a map wait in sequence or in parallel?"
    ],
    worked: (q, lines) => `console.log(\"A\"); Promise.resolve().then(() => console.log(\"B\")); setTimeout(() => console.log(\"C\"), 0); prints A B C. Then wrap fetch: const res = await fetch(url); if (!res.ok) throw; const data = await res.json(). ${lineBlock(lines)}`,
    prod: () => `Production: always check res.ok. Use Promise.all for independent calls, a loop of await for dependent ones. Put a .catch on the top-level async IIFE. Timeouts around fetch so a hung API does not leave the spinner forever.`
  },
  {
    test: (h) => /bubbl|captur|delegat|debounc|throttl/.test(h),
    also: (q) => `More on ${q}. Events travel capture (window → target) then bubble (target → window) unless you stop them. Delegation: listen on a parent, read event.target, so 100 rows do not need 100 listeners. preventDefault stops the browser’s default (form submit, link). stopPropagation stops travel to parents; it does not stop other listeners on the same node. Debounce waits until typing pauses (search box). Throttle fires at most once per window (scroll). Both are about rate, not about this. Interviewers ask you to add one listener to a list that will grow.`,
    wrong: (q) => `Wrong for ${q}: “bubbling is the same as capturing.” Opposite directions. “stopPropagation is the same as preventDefault.” One stops travel, one stops default. “debounce and throttle are the same.” Search vs scroll. “I will attach a click to every row in a table of 10,000.” Delegation exists for that.`,
    follow: () => [
      "In which order do capture and bubble listeners fire?",
      "How do you handle clicks on rows that do not exist yet?",
      "preventDefault vs stopPropagation?",
      "When debounce, when throttle?",
      "Does stopPropagation stop other listeners on the same element?"
    ],
    worked: (q, lines) => `ul.addEventListener(\"click\", (e) => { const li = e.target.closest(\"li\"); if (!li) return; ... }). One listener. New li children work without rebinding. For a search input, debounce 300ms after the last keystroke before fetch. ${lineBlock(lines)}`,
    prod: () => `Production lists: one delegated listener. SPAs must remove listeners on unmount. Debounce server search; throttle scroll handlers. Never preventDefault on every click or you break accessibility (enter key, links).`
  },
  {
    test: (h) => /shallow|deep copy|spread|destructur|rest parameter|higher-order|map\(\)|filter\(\)|reduce|foreach/.test(h),
    also: (q) => `More on ${q}. map returns a new array of the same length. filter returns a maybe-shorter array. reduce folds to one value. forEach is for side effects and returns undefined — do not chain it. Spread copies one level: nested objects are still shared. Deep copy needs structuredClone or a careful serializer, not JSON if you have Dates or undefined. Destructuring pulls fields out: const { id, text } = item. Rest gathers leftover arguments or leftover fields. Higher-order means a function that takes or returns a function. Interviewers will ask you to update one todo with map and delete with filter — that is CRUD, not trivia.`,
    wrong: (q) => `Wrong for ${q}: “spread is a deep copy.” Nested objects stay shared. “map and forEach are interchangeable.” map’s return value is the point. “JSON.parse(JSON.stringify) is a perfect deep clone.” It drops undefined, functions, and maps Dates to strings. “reduce is always faster.” Prefer map/filter when they read clearer.`,
    follow: () => [
      "Does { ...user, address: { ...user.address } } share any nested object?",
      "How do you tick one todo without mutating the others?",
      "Why not use forEach when you need an array of titles?",
      "What does rest do in function add(...nums)?",
      "When is structuredClone better than JSON?"
    ],
    worked: (q, lines) => `todos.map(t => t.id === id ? { ...t, done: true } : t) is Update. todos.filter(t => t.id !== id) is Delete. Spread of the matching object keeps id and text. A shallow copy of todos still shares the same todo objects if you forget the { ...t }. ${lineBlock(lines)}`,
    prod: () => `Immutable updates in React state: map/filter/spread. Mutating nested fields in place will skip renders. structuredClone for worker messages. Never JSON-clone a Mongoose document and expect methods to survive.`
  },
  {
    test: (h) => /es module|import|export/.test(h),
    also: (q) => `More on ${q}. ES modules are files with import/export. Named exports keep their names. default export is one value per file. Imports are live bindings: if the exporter increments a let, importers see the new value (you still cannot reassign the imported name). Modules are deferred and strict. Circular imports can give you incomplete bindings. In browsers you need type=\"module\". In Node, \"type\": \"module\" or .mjs. CommonJS require is different: it copies the exports object and is synchronous. Interviewers want you not to mix the two in one sentence as if they were the same.`,
    wrong: (q) => `Wrong for ${q}: “import is just require.” Timing, strictness, and live bindings differ. “I can reassign an imported const.” You cannot. “default and named are a style choice with no rules.” APIs pick one; follow the package.`,
    follow: () => [
      "Live binding vs a copied require export?",
      "What happens with a circular import?",
      "Why type=\"module\" in a script tag?",
      "Can a file have multiple default exports?",
      "Does an import run the module once or every time?"
    ],
    worked: (q, lines) => `export function add(a, b) { return a + b }. import { add } from \"./math.js\". The module runs once; every importer shares that instance. ${lineBlock(lines)}`,
    prod: () => `Bundlers tree-shake ES modules. Keep side effects out of module top-level or mark them in package.json. Dynamic import() for code-split routes.`
  },
  {
    test: (h) => /garbage collection/.test(h),
    also: (q) => `More on ${q}. JS is garbage collected: if nothing can reach an object, it can be freed. Reachability is from roots (stack, globals). Closures keep outer objects alive. Detached DOM nodes stay alive if a JS variable still points at them. Maps vs WeakMaps: WeakMap keys do not keep the object alive. You do not call free(). Memory leaks in SPAs are leftover listeners, leftover timers, and growing caches. Interviewers want reachability, not “the GC runs every 5 seconds.”`,
    wrong: (q) => `Wrong for ${q}: “I must delete variables to free memory.” Setting a local to null rarely matters. “GC pauses mean I should manage memory like C.” You still avoid leaks; you do not malloc. “WeakMap is a faster Map.” It is about not retaining keys.`,
    follow: () => [
      "What keeps a detached DOM node alive?",
      "WeakMap vs Map for a cache of objects?",
      "Does a closure over a huge array keep that array alive?",
      "Can you force garbage collection in production JS?",
      "What is a typical SPA leak?"
    ],
    worked: (q, lines) => `A listener on document that closes over a big component state keeps that state after navigation if you never removeEventListener. Heap snapshot: the detached node still has a path from the listener. ${lineBlock(lines)}`,
    prod: () => `Profile with Performance + Memory. Remove listeners, clear intervals, abort fetches on unmount. Caps on in-memory caches. WeakMap for metadata on DOM nodes.`
  },
  {
    test: (h) => /https|tls|ssl/.test(h),
    also: (q) => `More on ${q}. HTTPS is HTTP plus TLS. TLS does two jobs: encrypt the pipe so a café Wi-Fi spy cannot read the password, and prove the server has a certificate the browser trusts for that name. HTTP/2 and HTTP/3 almost always sit on TLS. Mixed content (HTTPS page, HTTP script) is blocked. HSTS tells the browser to skip plain HTTP next time. Certificates expire. SNI picks the cert when many sites share an IP. Interviewers want: encryption + identity, not “HTTPS is faster.” (It can be, because HTTP/2, but that is not the definition.)`,
    wrong: (q) => `Wrong for ${q}: “HTTPS means the site is safe.” It means the pipe is encrypted, not that the app has no XSS. “SSL and TLS are different products you pick in 2026.” You mean TLS; SSL is the old name. “I can ship cookies without Secure on HTTPS.” Browsers will restrict them.`,
    follow: () => [
      "What two jobs does TLS do?",
      "What is mixed content?",
      "Does HTTPS stop XSS?",
      "What is HSTS?",
      "What happens when a certificate expires?"
    ],
    worked: (q, lines) => `Type https://api.example.com. Browser checks the cert for api.example.com, finishes the TLS handshake, then sends HTTP on that encrypted socket. fetch to http:// on an https page is mixed content and fails for scripts. ${lineBlock(lines)}`,
    prod: () => `Terminate TLS at the reverse proxy. Redirect 80 to 443. HSTS. Monitor expiry. Never log Authorization headers. Internal apps still need TLS if they leave localhost.`
  },
  {
    test: (h) => {
      if (/cookie|cors|preflight|caching|keep-alive|http\/[123]|websocket|jwt|oauth|xss|csrf|sql injection/.test(h)) return false;
      return /\bhttp\b|url in the browser|http methods|what does get|what does post|what does put|what does patch|what does delete|put and patch|get and post|status code|200 ok|201 created|301|302|400 bad|401|403|404|500 internal|http header/.test(h);
    },
    also: (q) => `More on ${q}. HTTP is request/response: method, path, headers, optional body, then a status and headers and body. GET is read, safe, cacheable, no body needed. POST creates or triggers work. PUT replaces the whole resource at that URL. PATCH changes some fields. DELETE removes. 2xx success, 3xx go elsewhere, 4xx your request, 5xx our server. 401 means authenticate. 403 means we know you and you may not. 404 missing. 400 malformed. 201 created plus Location. 301 forever, 302 temporary. Headers are metadata: Content-Type, Authorization, Cache-Control, Set-Cookie. Idempotent means repeating the request has the same effect (GET, PUT, DELETE). POST usually is not.`,
    wrong: (q) => `Wrong for ${q}: “401 and 403 are the same.” Login vs permission. “PUT and POST are the same.” Replace at a known URL vs create. “GET can have a body so I will send passwords on GET.” Do not. “500 means the user typed wrong.” 500 is our bug; 4xx is their request. “HTTP is only for HTML pages.” APIs use it too.`,
    follow: () => [
      "401 vs 403 vs 404?",
      "PUT vs PATCH vs POST?",
      "When is a method idempotent?",
      "What does 201 return that 200 often does not?",
      "Name three request headers and three response headers."
    ],
    worked: (q, lines) => `POST /todos with { \"text\": \"Milk\" } → 201 { id, text, done: false }. GET /todos → 200 array. PATCH /todos/1 { \"done\": true } → 200 updated. DELETE /todos/1 → 204. Wrong token → 401. Logged in but not owner → 403. ${lineBlock(lines)}`,
    prod: () => `Pick status codes on purpose. Do not return 200 with { error: true }. Do not leak stack traces on 500. Log the request id. PUT/PATCH/DELETE still check ownership on the server.`
  },
  {
    test: (h) => /cookie|session vs|cors|preflight|jwt|oauth|xss|csrf|sql injection|same.origin|localstorage|rest\b|websocket/.test(h),
    also: (q) => `More on ${q}. Same-origin is scheme + host + port. CORS is the API’s allow-list for other origins; the browser enforces it, Postman does not. Preflight is OPTIONS with Access-Control-Request-* when the request is not simple. Cookies can be httpOnly (JS cannot read), Secure (HTTPS only), SameSite (CSRF). JWT in localStorage is readable by XSS. XSS is attacker text running as your JS. CSRF is a foreign page riding your cookies. SQL injection is untrusted text becoming SQL — use parameters. REST is resources + HTTP methods + status codes, not a library. WebSockets are a long-lived bidirectional socket after an HTTP upgrade. OAuth is delegated login, not encryption.`,
    wrong: (q) => `Wrong for ${q}: “CORS is a firewall.” It is a browser rule. “JWT in localStorage is fine because it is encoded.” Encoding is not encryption; XSS steals it. “SameSite=Lax stops XSS.” It helps CSRF, not XSS. “I escaped HTML so SQL is safe.” Different sinks. “WebSockets do not need auth.” They do, on the upgrade.`,
    follow: () => [
      "Why does Postman succeed when the browser fails CORS?",
      "httpOnly cookie vs JWT in localStorage under XSS?",
      "When does the browser send a preflight?",
      "How do parameterized queries stop SQL injection?",
      "401 vs 403 on an API that uses JWT?"
    ],
    worked: (q, lines) => `Frontend app on localhost:5173 calls api.example.com. Without ACAO, the browser hides the response. With credentials, ACAO cannot be *. Cookie session: SameSite=Lax, Secure, httpOnly. Form that plants a todo on another site is CSRF if cookies are sent. ${lineBlock(lines)}`,
    prod: () => `Prefer httpOnly cookies for sessions. CSP to reduce XSS. CSRF token or SameSite. Parameterized SQL. CORS allow-list, not *. Auth on every WebSocket message or on upgrade. Never trust a hidden button as authorization.`
  },
  {
    test: (h) => /caching|http\/1|http\/2|http\/3|keep-alive/.test(h),
    also: (q) => `More on ${q}. HTTP caching stores a response so the next request is cheaper. Cache-Control, ETag, Last-Modified. 304 means not modified. HTTP/1.1 is one request per connection unless keep-alive pipelining (limited). HTTP/2 multiplexes many streams on one TLS connection. HTTP/3 uses QUIC on UDP. keep-alive reuses a TCP connection. CDNs cache at the edge. Interviewers want: what is cached (GET, not POST), who caches (browser, CDN, reverse proxy), and how you bust a cache (versioned filenames, ETag).`,
    wrong: (q) => `Wrong for ${q}: “HTTP/2 is just faster HTTPS.” It is multiplexing and header compression too. “I will cache POST.” Usually no. “Disabling cache is a performance strategy.” For HTML maybe; for hashed assets you want long cache.`,
    follow: () => [
      "What does 304 mean?",
      "Why hashed filenames for JS bundles?",
      "HTTP/2 vs HTTP/1.1 in one sentence?",
      "Where can a GET be cached?",
      "What is keep-alive for?"
    ],
    worked: (q, lines) => `index.html: Cache-Control: no-cache. app.abc123.js: max-age=31536000 immutable. Browser asks with If-None-Match, server returns 304. ${lineBlock(lines)}`,
    prod: () => `Version static assets. Short cache on HTML. ETags on APIs only if cheap to compute. CDN in front of GET. Do not cache authenticated HTML at the CDN without Vary: Cookie care.`
  },
  {
    test: (h) => /\bdns\b|a record|aaaa|cname|mx record|ns record|txt record|ttl|resolver|recursive|iterative|domain name and an ip/.test(h),
    also: (q) => `More on ${q}. DNS turns a name into data: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), NS (who is the nameserver), TXT (text, SPF, verification). A resolver asks on your behalf (recursive). Authoritative servers answer for a zone (often iterative from the resolver’s point of view). TTL is how long a cache may keep the answer. The OS cache, the browser, the recursive resolver, and the CDN all cache. Interviewers walk: browser cache → OS → recursive resolver → root → TLD → authoritative. CNAME cannot sit at the zone apex the way people wish; ALIAS/ANAME are vendor extras.`,
    wrong: (q) => `Wrong for ${q}: “DNS is only A records.” Mail and certs need MX and TXT. “TTL is ping time.” It is cache lifetime. “CNAME and A are the same.” One is an alias, one is an address. “Changing DNS is instant worldwide.” TTL and caches disagree.`,
    follow: () => [
      "A vs AAAA vs CNAME vs MX?",
      "What does TTL control?",
      "Recursive vs iterative lookup?",
      "Why can DNS change take hours?",
      "What is a resolver?"
    ],
    worked: (q, lines) => `You type google.com. Stub resolver asks 8.8.8.8. If cache miss, recursive lookup to root, .com, then Google’s NS, then A record, then the browser opens TLS to that IP. ${lineBlock(lines)}`,
    prod: () => `Low TTL before a migration, raise after. Health checks + failover DNS carefully (they are not instant). Put SPF/DKIM in TXT. Monitor resolution from more than one region.`
  },
  {
    test: (h) => /\bip address|ipv4|ipv6|\bport\b|\btcp\b|\budp\b|handshake|socket|firewall|proxy server|reverse proxy|cdn|load balancer|latency|bandwidth|\bftp\b|sftp/.test(h),
    also: (q) => `More on ${q}. An IP is the machine’s address on a network. IPv4 is 32-bit, IPv6 is 128-bit. A port picks the process (443 HTTPS, 22 SSH, 53 DNS). TCP is reliable, ordered, with a three-way handshake (SYN, SYN-ACK, ACK). UDP is datagrams, no handshake, used by DNS and HTTP/3/QUIC. A socket is {protocol, local IP, local port, remote IP, remote port}. A firewall allows or denies. A forward proxy is the client’s representative. A reverse proxy is the server’s front desk (Nginx). A CDN caches copies near users. A load balancer spreads connections across app boxes. Latency is wait; bandwidth is how wide the pipe is. FTP is old file transfer, cleartext; SFTP is file transfer over SSH.`,
    wrong: (q) => `Wrong for ${q}: “TCP is faster than UDP.” UDP can be faster; TCP is reliable. “Load balancer and reverse proxy are always different products.” Nginx often is both. “CDN is a load balancer.” CDN is mostly cache at the edge. “FTP is encrypted.” FTP is not; FTPS or SFTP is. “Latency and bandwidth are the same.” Wait vs capacity.`,
    follow: () => [
      "TCP handshake steps?",
      "When UDP instead of TCP?",
      "Forward proxy vs reverse proxy?",
      "What does a load balancer check with /health?",
      "FTP vs SFTP vs FTPS?"
    ],
    worked: (q, lines) => `Browser → CDN (maybe cache hit) → load balancer → Nginx reverse proxy on 443 → 127.0.0.1:3000 Node. Health: GET /health 200 or the box is pulled out. ${lineBlock(lines)}`,
    prod: () => `TLS at the reverse proxy. Health checks that hit the DB if the app needs the DB. Timeouts at every hop. Prefer SFTP or signed HTTPS uploads over FTP. Watch tail latency, not only average.`
  },
  {
    test: (h) => /\bbrowser\b|what is the dom|dom and bom/.test(h),
    also: (q) => `More on ${q}. The browser is the app that fetches HTML/CSS/JS, builds the DOM, paints, and runs JS on one main thread plus workers. The DOM is the tree of the page your JS can read and change. The BOM is the browser chrome around it: window, location, navigator, history. document is the DOM entry. querySelector finds nodes. Changing the DOM can be expensive if you do it in a loop without batching. Interviewers want: DOM is the document, BOM is the window, JS is the language that talks to both.`,
    wrong: (q) => `Wrong for ${q}: “DOM is JavaScript.” DOM is the tree; JS is the language. “innerHTML is always the way to create nodes.” It is XSS-prone. “BOM and DOM are the same.” location vs document.`,
    follow: () => [
      "document vs window?",
      "Why is innerHTML risky?",
      "What is a reflow?",
      "querySelector vs getElementById?",
      "Does the DOM exist in Node without JSDOM?"
    ],
    worked: (q, lines) => `document.querySelector(\"#list\").append(li) paints a new row. window.location.href is BOM. ${lineBlock(lines)}`,
    prod: () => `Create nodes with createElement and textContent for untrusted text. Batch DOM writes. Prefer frameworks for large UIs but still know the DOM for interviews and debugging.`
  },
  {
    test: (h) => /practice:.*(add|create|insert|post |signup|register|short link)/.test(h) || /\bcreate a\b|\badd a todo\b/.test(h),
    also: (q) => `More on ${q}. Create is the C in CRUD. You build one object: unique id, fields, defaults (done: false). You refuse empty input after trim. You push to an array, INSERT a row, or POST JSON. You return the new object or 201 so the UI can paint without guessing. Date.now() is a lab id; a database uses a primary key. Two users can click add at once — the server assigns the id, not the client. Never let the client set role: \"admin\" on create. The next labs (read, update, delete) only work if this row has a stable id.`,
    wrong: (q) => `Wrong for ${q}: pushing the raw input string with no object and no id. Using the array index as the id. Skipping trim so \" \" becomes a todo. Returning nothing so the UI cannot show the new row. Trusting the client’s id or role.`,
    follow: () => [
      "What if two todos have the same title — how do you delete only one?",
      "Why not use the array index as id?",
      "What do you return on empty text?",
      "201 vs 200 on create?",
      "Who assigns the id in production — browser or database?"
    ],
    worked: (q, lines) => `Call addTodo(\"  Milk  \"). trim → \"Milk\". Not empty. item { id: 171000, text: \"Milk\", done: false }. push. return item. Call addTodo(\"   \") → null, array unchanged. ${lineBlock(lines)}`,
    prod: () => `POST /todos, validate body, insert, return 201 + row. Unique constraints. Auth required. Rate limit. The UI check is not enough — repeat validation on the server.`
  },
  {
    test: (h) => /practice:.*(show|list|get |read|select|all todos)/.test(h),
    also: (q) => `More on ${q}. Read is GET. You take the current list and paint it. You do not invent rows in the render function. You wipe old nodes (replaceChildren) or you duplicate cards. GET must not create or delete. Filter by the logged-in user on the server. Paginate when the list is huge. After Create/Update/Delete you Read again (or return the new array). React: map the array to components with a stable key (the id, not the index).`,
    wrong: (q) => `Wrong for ${q}: hardcoding three li tags. GET that deletes. Showing every user’s rows. Using index as React key. Appending without clearing.`,
    follow: () => [
      "Why replaceChildren before append?",
      "Why not GET with a side effect?",
      "How do you hide other users’ rows?",
      "Index vs id as a list key?",
      "What do you show when the array is empty?"
    ],
    worked: (q, lines) => `showTodos([{ text: \"Milk\" }, { text: \"Eggs\" }]) prints two lines. showTodos([]) prints nothing — empty state, not a fake row. ${lineBlock(lines)}`,
    prod: () => `GET /todos with cookie/JWT, WHERE user_id = $1, LIMIT/OFFSET. Cache carefully. Empty array is 200, not 404.`
  },
  {
    test: (h) => /practice:.*(mark|update|patch|edit|done|toggle)/.test(h),
    also: (q) => `More on ${q}. Update changes fields on the matching id only. map: if id matches, spread the old object and overwrite done or text; return others unchanged. PATCH /todos/:id. SQL UPDATE ... WHERE id = $1 AND user_id = $2. UPDATE without WHERE updates every row — the classic disaster. Validate the new text; do not save empty titles. The object keeps its id.`,
    wrong: (q) => `Wrong for ${q}: todos[0].done = true after a sort. UPDATE without WHERE. Replacing the whole list. Skipping ownership. Mutating the old object in React state.`,
    follow: () => [
      "What does UPDATE without WHERE do?",
      "Why return a new object instead of mutating t.done?",
      "PATCH vs PUT?",
      "What if the id is missing?",
      "Where do you check the user owns the row?"
    ],
    worked: (q, lines) => `Todos A (id 1, done false), B (id 2). markDone(2). A unchanged. B { ...B, done: true }. markDone(99) changes nothing. ${lineBlock(lines)}`,
    prod: () => `PATCH with Joi/Zod body. 404 if missing, 403 if not yours. Return the updated row. Audit log on important flags.`
  },
  {
    test: (h) => /practice:.*(delete|remove|destroy|filter out)/.test(h),
    also: (q) => `More on ${q}. Delete drops the row with that id. filter in JS. DELETE /todos/:id. SQL DELETE FROM ... WHERE id = $1 AND user_id = $2. Never splice by position 0 after a sort. 404 if missing, 403 if not yours. Soft-delete (deleted_at) is the same idea with a flag. Confirm in the UI; enforce on the server.`,
    wrong: (q) => `Wrong for ${q}: delete by index. DELETE FROM todos with no WHERE. Hiding the row in CSS and calling it deleted. No 403 for another user’s id.`,
    follow: () => [
      "Why filter by id not splice(i, 1)?",
      "404 vs 403 on delete?",
      "What is a soft delete?",
      "Do you Read after Delete?",
      "Can a guest delete anyone’s row if you only hide the button?"
    ],
    worked: (q, lines) => `Ids 1, 2, 3. removeTodo(2) leaves 1 and 3. removeTodo(2) again leaves the same list. ${lineBlock(lines)}`,
    prod: () => `DELETE with ownership. Transactions if related rows must go too. Idempotent delete (second call 404 or 204). Never take the id only from the client without auth.`
  },
  {
    test: (h) => /localstorage|sessionstorage|keep todos|refresh/.test(h),
    also: (q) => `More on ${q}. localStorage stays until cleared, per origin, strings only — JSON.stringify on save, JSON.parse on load. sessionStorage dies with the tab. Cookies can go to the server; httpOnly cookies cannot be read by JS. XSS plus a JWT in localStorage is a stolen account. parse can throw on junk — wrap in try and fall back to []. Quota is small (~5MB). Do not store passwords. This is a lab shelf, not the user database.`,
    wrong: (q) => `Wrong for ${q}: storing the JWT next to todos in localStorage and calling it secure. JSON.parse without try. Using localStorage as the source of truth for a multi-device app. Forgetting stringify so you save \"[object Object]\".`,
    follow: () => [
      "localStorage vs sessionStorage vs cookie?",
      "What if getItem returns garbage?",
      "Why not store passwords or JWTs here?",
      "Does localStorage sync across tabs?",
      "What is the quota roughly?"
    ],
    worked: (q, lines) => `saveTodos([{ id: 1, text: \"Milk\" }]) writes a JSON string. Refresh. loadTodos() parses to the same array. loadTodos() on first visit: \"[]\". ${lineBlock(lines)}`,
    prod: () => `Todos live in the database. localStorage is drafts or theme. Sessions in httpOnly cookies. Listen to the storage event if you care about other tabs.`
  },
  {
    test: (h) => /empty todo|validat|trim|reject/.test(h),
    also: (q) => `More on ${q}. Validation is the if before the write. trim first so spaces are not a title. Return a clear empty/null/400, do not push. The same check belongs on the server even if the UI already did it. Type checks: Number for ids, allowlists for enums. Length limits stop megabyte titles. Interviewers want the failed path, not only the happy path.`,
    wrong: (q) => `Wrong for ${q}: checking in the UI only. if (text) allowing \" \". Throwing an uncaught error instead of a 400. Trusting client-side type=\"number\".`,
    follow: () => [
      "What does trim change?",
      "400 vs 200 with { error }?",
      "Why repeat validation on the server?",
      "How do you test the failed path?",
      "What other fields should you reject on create?"
    ],
    worked: (q, lines) => `addTodo(\"\") → null. addTodo(\"   \") → null. addTodo(\"Milk\") → object. That trio is the answer. ${lineBlock(lines)}`,
    prod: () => `Schema validation (Zod). 400 with field names. Never 500 for bad input. Log enough to debug, not the raw password.`
  },
  {
    test: (h) => /docker|compose|\bci\b|\bcd\b|pipeline|dockerfile|kubernetes|nginx/.test(h),
    also: (q) => `More on ${q}. Docker packs the app: FROM a base image, WORKDIR, COPY package files first so npm ci caches, COPY source, CMD the process. Pin tags; :latest in prod is a surprise. Secrets stay out of the Dockerfile and out of Git. Compose runs API + DB on one network. CI tests every push. CD ships the same tested image. A health URL tells the load balancer the process can still answer. Rollback is yesterday’s image sha, not a zip from Downloads. Nginx is often the reverse proxy in front.`,
    wrong: (q) => `Wrong for ${q}: copying node_modules from your laptop. Putting AWS keys in ENV in the Dockerfile. Deploying a red pipeline. Health that only prints ok and never checks the DB the app needs. Using latest.`,
    follow: () => [
      "Why COPY package.json before COPY . ?",
      "CI vs CD in one sentence?",
      "What should /health prove?",
      "How do you rollback?",
      "Where do secrets live?"
    ],
    worked: (q, lines) => `docker build. Layer cache hits on npm ci if package-lock did not change. docker run -p 3000:3000. GET /health 200. Compose: api depends_on db, DATABASE_URL points at the service name. ${lineBlock(lines)}`,
    prod: () => `Multi-stage builds. Non-root user. Read-only rootfs if you can. Image scanning in CI. Probes: liveness vs readiness. Pin digests in prod.`
  },
  {
    test: (h) => /\/health|health check/.test(h),
    also: (q) => `More on ${q}. /health is a cheap GET the platform pings. 200 means take traffic. Non-200 means pull the instance. Readiness can check DB/Redis; liveness should not be so heavy that a slow DB kills the process in a loop. Do not require auth on the probe or the LB cannot ping it. Do not do migrations in /health.`,
    wrong: (q) => `Wrong for ${q}: returning 200 always while the process is wedged. Protecting /health with JWT so Kubernetes gets 401. Hitting a third-party API on every probe.`,
    follow: () => [
      "Liveness vs readiness?",
      "Should /health require a user token?",
      "What if the DB is down — 200 or 503?",
      "How often does a load balancer ping?",
      "Why not run SQL migrations here?"
    ],
    worked: (q, lines) => `app.get(\"/health\", (_, res) => res.json({ ok: true })). LB every few seconds. If you add db.ping() and it fails, return 503 so you leave the pool. ${lineBlock(lines)}`,
    prod: () => `Separate /health/live and /health/ready. Timeouts on dependency pings. Do not log every probe at info level or you drown logs.`
  },
  {
    test: (h) => /sql|join|index|postgres|normalize|transaction|acid/.test(h),
    also: (q) => `More on ${q}. SQL is tables, typed columns, JOIN, WHERE. SELECT does not change data. UPDATE/DELETE without WHERE is a disaster. Parameters ($1, ?) stop injection. Indexes speed WHERE/JOIN and slow writes — pick them from real queries. Transactions group writes so they all happen or none (ACID). Normalization reduces duplicate facts; you still denormalize on purpose for a read model. Interviewers want: parameterized query, a JOIN, and the missing WHERE horror.`,
    wrong: (q) => `Wrong for ${q}: string-concatenating user input into SQL. SELECT * in production without a reason. Indexing every column. Saying JOIN is slow so you never use it — then you N+1 in the app instead.`,
    follow: () => [
      "How do parameters stop injection?",
      "What does UPDATE todos SET done = true do with no WHERE?",
      "When does an index not get used?",
      "What is a transaction for?",
      "INNER JOIN vs LEFT JOIN?"
    ],
    worked: (q, lines) => `db.query(\"SELECT * FROM todos WHERE user_id = $1\", [req.user.id]). Bad: \"... WHERE user_id = \" + id. ${lineBlock(lines)}`,
    prod: () => `Migrations in CI. EXPLAIN slow queries. Connection pool size. Read replicas for heavy GET. Never run schema change by hand on prod without a plan.`
  },
  {
    test: (h) => /mongo|mongoose|document|nosql/.test(h),
    also: (q) => `More on ${q}. Mongo stores documents (JSON-like). You model how you read, not only how you normalize. There are no SQL joins in the same way — you embed or you $lookup. Indexes still matter. Schema in Mongoose is optional at the DB but you want it in the app. _id is the primary key. Interviewers want: when documents beat tables (flexible nested data) and when they lose (multi-document transactions, reporting).`,
    wrong: (q) => `Wrong for ${q}: “Mongo has no schema so validation is optional.” Your app still needs a shape. “Mongo cannot do transactions.” It can, with limits. “NoSQL means no indexes.”`,
    follow: () => [
      "Embed vs reference?",
      "What is _id?",
      "When would you pick Postgres instead?",
      "How do you avoid huge unbounded arrays on one document?",
      "Does Mongoose protect you from injection?"
    ],
    worked: (q, lines) => `todos.insertOne({ text: \"Milk\", done: false, userId }). find({ userId }). updateOne({ _id, userId }, { $set: { done: true } }). ${lineBlock(lines)}`,
    prod: () => `Indexes on userId. Cap array sizes. Transactions only when you truly need two documents atomic. Monitor document size (16MB limit).`
  },
  {
    test: (h) => /redis|ttl|cache hit/.test(h),
    also: (q) => `More on ${q}. Redis is an in-memory shelf: strings, hashes, lists, with TTL. It is a cache or a lock or a rate-limit counter, not the user table. Cache stampede: many requests miss at once. Invalidate on write or set a short TTL. Interviewers want: what you store, how it dies (TTL), and what you do on a miss (query the DB, then SET).`,
    wrong: (q) => `Wrong for ${q}: putting the only copy of user data in Redis with no DB. No TTL so memory grows forever. Caching a per-user page under a global key.`,
    follow: () => [
      "What happens when TTL expires?",
      "Cache miss path?",
      "Why not store passwords in Redis in plaintext?",
      "How do you invalidate after an update?",
      "Redis vs the primary database?"
    ],
    worked: (q, lines) => `GET todo:1. Miss → SELECT → SET todo:1 JSON EX 60. Next GET is a hit. After PATCH, DEL todo:1. ${lineBlock(lines)}`,
    prod: () => `Namespaced keys. Timeouts so a down Redis does not hang the app. Memory alerts. Do not cache unauthorized responses as public.`
  },
  {
    test: (h) => /overfit|precision|recall|train|test set|feature|gradient|loss/.test(h),
    also: (q) => `More on ${q}. Split train/test first. Overfit is memorising the practice paper — high train score, low test score. Accuracy lies on imbalanced labels; name precision (of predicted yes, how many were yes) and recall (of real yes, how many you caught). Leakage is using a column you would not have at predict time. A baseline (always predict the majority class) is the first number you beat. Interviewers want the split, the metric, and one failure mode.`,
    wrong: (q) => `Wrong for ${q}: training on the whole dataset then reporting that number. “Accuracy is 99%” on 1% positives. Using future information in a feature. Skipping a baseline.`,
    follow: () => [
      "How do you detect overfit?",
      "Precision vs recall — when do you care which?",
      "What is leakage?",
      "Why a train/validation/test split?",
      "What is a baseline model?"
    ],
    worked: (q, lines) => `80/20 split. Train. Compare train vs test loss. If train is great and test is poor, simplify or get more data. For fraud, high recall may matter more than precision. ${lineBlock(lines)}`,
    prod: () => `Frozen test set. Monitor live metrics vs offline. Retrain on a schedule. Do not ship a model that never beat the baseline.`
  },
  {
    test: (h) => /s3|iam|lambda|vpc|ec2|cloudfront|region|availability zone/.test(h),
    also: (q) => `More on ${q}. Cloud is someone else’s computers with APIs. S3 is object storage. IAM is who may call which API — not your app’s isAdmin flag. Lambda is a function that runs on request. A VPC is your private network. Regions are geographic; AZs are data centers in a region. Interviewers want: what fails if the bucket is public, what fails if the IAM role is * on *, and why a single AZ is a risk.`,
    wrong: (q) => `Wrong for ${q}: public S3 with user uploads. Access keys in Git. Lambda in a VPC with no path to the DB. “IAM is the login page.”`,
    follow: () => [
      "IAM vs application authorization?",
      "Public vs private bucket?",
      "Why more than one AZ?",
      "What goes in environment variables vs secrets manager?",
      "What happens if you lose one region?"
    ],
    worked: (q, lines) => `Upload to S3 with a signed URL. App never has * on s3:*. Lambda reads the object, writes a row. IAM role only s3:GetObject on that prefix. ${lineBlock(lines)}`,
    prod: () => `Least privilege IAM. No long-lived keys on laptops for prod. Backup and retention on buckets. Alarms on 4xx/5xx. Cost alerts.`
  },
  {
    test: (h) => /short link|redirect|rate limit|cap theorem|shard|replica|consistent hash|queue|idempoten/.test(h),
    also: (q) => `More on ${q}. System design is CRUD plus constraints: login, unique id, 302 redirect, 404 if missing, rate limit so one user cannot fill the table, a replica for reads, a shard when one machine cannot hold the data. CAP is a reminder that during a partition you pick consistency or availability. Idempotency keys stop double-creates on retry. Interviewers want the data model, the request path, and one bottleneck with a fix (cache, queue, shard).`,
    wrong: (q) => `Wrong for ${q}: drawing 12 boxes and no table. Ignoring auth. 301 forever when the URL can change. No 404. No rate limit. “We’ll just use Kubernetes” as the whole design.`,
    follow: () => [
      "What is stored in the links table?",
      "301 vs 302 for a short URL?",
      "How do you stop abuse of create?",
      "What do you cache?",
      "What fails if the DB is down?"
    ],
    worked: (q, lines) => `POST /links { url } → login required → mint id → INSERT → 201. GET /:id → SELECT → 302 Location: url or 404. Cache GET by id. ${lineBlock(lines)}`,
    prod: () => `Unique index on id. Owner on the row. Metrics on latency and 404 rate. Backups. A queue if you add analytics clicks so the redirect stays fast.`
  }
];

const generic = {
  also: (q) => `There is more to ${q} than the first summary. Name the rule in one sentence. Point at a line in the snippet. Name the failed input (empty text, wrong id, missing token, or a 4xx/5xx). Then name where the check lives in production: browser, API, or database constraint. If you cannot do those four, you are reciting a heading. Related ideas that usually travel with this topic: validation, id vs index, browser vs server, and the status code when it fails. Stretch the same idea to a user, an order, or a card — same jobs, different names.`,
  wrong: (q) => `Wrong answers for ${q} are slogans: “the framework handles it,” “I would Google it,” “it is just syntax.” A shop story with no computer in it also fails. Mixing nearby ideas fails: var with let, 401 with 403, CORS with a firewall, localStorage with a database, Redis with the user table, === with ==. Do not invent methods that are not in the snippet.`,
  follow: () => [
    "Where does this check live in production — browser, API, or database?",
    "What is one input that should fail, and what do you return?",
    "What breaks if you skip the line the comment is explaining?",
    "How would you test the happy path and the failed path?",
    "What is the nearby concept people mix up with this one?"
  ],
  worked: (q, lines) => `Take ${q} to the whiteboard. Write the snippet. Run a happy input. Run a failed input. Say out loud what each line did. If you cannot, that line is what you study next. ${lineBlock(lines)}`,
  prod: () => `In production this is a ticket: empty form, wrong user, or a 500 after a missing check. The lab is the smallest version of that ticket. Repeat the check on the server. Log enough to debug. Return a precise status code.`
};

const pick = (item) => {
  const h = String(item.q || "").toLowerCase();
  for (const f of FAMILIES) {
    if (f.test(h)) return f;
  }
  return generic;
};

const alsoKnow = (item, fam, lines) => {
  const q = item.q;
  const watch = watchFrom(item.a);
  return [
    fam.also(q, lines),
    lineBlock(lines),
    watch ? `The trap on this page is not optional: ${watch}` : "",
    "Write one more example that is not a copy of the title: a user, an order, or a card. Same rule, different names. That is how you show you understood the content."
  ].filter(Boolean).join("\n\n");
};

const wrongAnswer = (item, fam, lines) => {
  const q = item.q;
  const plain = plainFrom(item.a);
  const watch = watchFrom(item.a);
  const first = lines[0] || "the first real line";
  return [
    fam.wrong(q, lines),
    `The strong version is three sentences. Sentence one is the rule. Sentence two points at \`${first}\`. Sentence three is the trap${watch ? `: ${watch}` : "."}`,
    plain ? `If you only remember one paragraph, remember this: ${plain}` : "",
    "If they ask “what if two users?” move the same check to the server and name the status code. If they ask for an example, walk the snippet, do not tell a shop story."
  ].filter(Boolean).join("\n\n");
};

const followUps = (item, fam) => {
  const q = item.q;
  const qs = fam.follow(q);
  const watch = watchFrom(item.a);
  return [
    `After “${q}”, a good interviewer does not stop. Be ready for these.`,
    numbered(qs),
    watch ? `For each follow-up, use rule → snippet → trap. The trap is already on this page: ${watch}` : "For each follow-up, use rule → snippet → trap.",
    "If you cannot answer a follow-up, you memorised a heading. Change one line in the snippet and predict the new result before you run it.",
    "Companies (Amazon, Google, Microsoft, Meta) like a 60-second version and a 3-minute version. The short one is the Summary. The long one is this page including these follow-ups."
  ].join("\n\n");
};

const checkYourself = (item, lines) => [
  `Close the answer. Keep only the question: ${item.q}`,
  "Write the snippet from memory on paper or in an empty file. No autocomplete. Then open this page and mark every line you missed.",
  lines.length ? `You must be able to explain these lines without looking:\n\n${lines.map((l) => "- `" + l + "`").join("\n")}` : "Write three lines that prove the rule, including one failed input.",
  "Run the happy path, then the failed path (empty text, wrong id, wrong password, or a missing field). If both are not in your explanation, add them.",
  "Teach it out loud: 60 seconds for the rule, 60 seconds walking the snippet, 30 seconds on the trap. If you overrun, you are still telling a story instead of explaining.",
  "Tomorrow, without this tab, write the same function again. Content you cannot recreate is content you did not learn."
].join("\n\n");

const workedExample = (item, fam, lines) => fam.worked(item.q, lines);

const inProduction = (item, fam, lines) => {
  const extra = fam.prod(item.q, lines);
  return [
    extra,
    "The browser check is a courtesy. The API repeats it. The database enforces what must stay true (unique id, not-null, foreign key).",
    "Name the status code you would return on the failed path, and what you would log (request id, user id, not the password).",
    `If this shipped as a ticket titled “${item.q}”, the acceptance test is: happy path, failed path, and a second user who must not see or change the first user’s data.`
  ].join("\n\n");
};

const files = fs.readdirSync(DATA).filter((f) => f.startsWith("practice-") && f.endsWith(".js"));
let added = 0;
let skipped = 0;

for (const file of files) {
  const full = path.join(DATA, file);
  const ctx = { window: { PREP_DATA: {} } };
  vm.runInNewContext(fs.readFileSync(full, "utf8"), ctx);
  const id = Object.keys(ctx.window.PREP_DATA)[0];
  const pack = ctx.window.PREP_DATA[id];
  for (const q of pack.questions || []) {
    const fam = pick(q);
    const lines = firstLines(getCode(q), 8);
    let changed = false;
    const add = (head, body) => {
      if (!hasHead(q.a, head)) {
        q.a = `${String(q.a).trimEnd()}\n\n${head}\n${body.trim()}`;
        changed = true;
      }
    };
    add("Also know", alsoKnow(q, fam, lines));
    add("Wrong answer", wrongAnswer(q, fam, lines));
    add("Worked example", workedExample(q, fam, lines));
    add("In production", inProduction(q, fam, lines));
    add("Follow-up questions", followUps(q, fam));
    add("Check yourself", checkYourself(q, lines));
    if (changed) added += 1;
    else skipped += 1;
  }
  fs.writeFileSync(full, `window.PREP_DATA = window.PREP_DATA || {};\nwindow.PREP_DATA[${JSON.stringify(id)}] = ${JSON.stringify(pack, null, 2)};\n`);
  console.log("more content", file, (pack.questions || []).length);
}

console.log("updated", added, "skipped", skipped);
