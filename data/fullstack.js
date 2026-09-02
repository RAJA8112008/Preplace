window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA.fullstack = {
  notes: [
    { title: "Full stack means", body: "A full stack developer can take one feature from the screen to the database. The screen is the UI, which is what the user sees and clicks. An API is a set of HTTP URLs the UI calls. The database is where data is saved for later. You also touch login, app state, and putting the app on a host. You do not have to be the world's best at every layer. You do need enough skill at each layer to ship a working feature." },
    { title: "Typical stack", body: "A stack is the group of tools you use together to build an app. A common web stack is React for the UI, Node and Express for the API, and PostgreSQL or MongoDB for data. Git stores the code history. A cloud host runs the live site. Redis is a fast memory store for cache and sessions. S3 stores files like photos. A CI pipeline is a robot that tests and deploys when you change the code." },
    { title: "HTTP", body: "HTTP is the request and response language of the web. A method is the verb: GET reads, POST creates, PUT replaces, DELETE removes. A status code is a number that says how it went, like 200 or 404. Headers are extra labels on the message, such as cookies or content type. A cookie is a small value the browser stores and sends back. TLS is the encryption that turns HTTP into HTTPS. The browser can send anything. The server must still check who is allowed." },
    { title: "API design", body: "An API is a contract: URLs, methods, JSON bodies, and error shapes both sides agree on. A resource is the thing the URL names, like a user or a note. Pagination means returning a page of results, not the whole table. Versioning means /v1 can stay while /v2 changes. Idempotency means repeating a request does not create a second charge or a second row. Write the contract first so frontend and backend can move together. Keep errors in one JSON shape so the UI can show them." },
    { title: "Auth", body: "Auth is how the app knows who you are and what you may do. Login checks email and password. A session stores login on the server and puts an id in a cookie. A JWT is a signed token the client sends on later requests. Hashing turns a password into a one-way scramble you cannot reverse. Email verify and password reset are extra flows that use secret links. RBAC means roles like admin or viewer. XSS and CSRF are attacks whose risk depends on how you store that login proof." },
    { title: "Data", body: "Model first means decide the tables or collections before you draw extra screens. A migration is a versioned change to that shape, like adding a column. An index is a lookup structure that speeds the queries you actually run. A transaction is a bundle of writes that all succeed or all fail. Cache is a fast copy of hot reads. Measure first, then cache. Do not cache private user data as if it were public." },
    { title: "Frontend state", body: "Server state is data that lives on the server, like the notes list. Client state is UI-only data, like whether a modal is open or what a form currently types. React Query is a library that fetches and caches server state. Redux is a store for client (or sometimes server) state. Copying the whole database into Redux usually makes bugs. Fetch server data when the screen needs it. Keep form values in the form until you save." },
    { title: "Dev vs prod", body: "Dev is your laptop. Prod is the live site users hit. Environment variables are settings like database URLs that differ per place. HTTPS encrypts the live traffic. Logging writes what happened so you can debug. Minified assets are compressed JS and CSS; source maps help debug but must not leak secrets. Error tracking groups crashes. Never point the laptop config at production by accident." },
    { title: "Testing", body: "A unit test checks a small function in isolation. An integration test checks the API plus a real test database. An e2e test clicks through the app like a user, often with Playwright. You cannot e2e every click. Pick money paths: signup, login, checkout. Tests should never hit the production database. Seed the smallest data that proves the path." },
    { title: "Deploy", body: "A deploy is putting a new build on a host users can reach. An artifact is the built files, like a Docker image or a dist folder. Run migrations before or with the new code, in a planned order. A health check is a cheap URL the host pings to see if the process is alive. A rollback means running the previous artifact if this one is bad. Docker helps the laptop and the host run the same box. Watch env vars and secrets during the switch." },
    { title: "Observability", body: "Observability means you can see what the live app is doing. Logs are event lines. Metrics are numbers over time, like request count. Traces follow one request across services. A request id is a tracking number you put on logs and errors; a 500 with no id is a guess. Product analytics counts clicks like signup. Ops metrics count CPU and errors. Keep both, and do not mix them into one pile of console.log." },
    { title: "Trade-offs", body: "A trade-off is a choice where both options cost something. Consistency versus speed: a lock is safer, a cache is faster and can be stale. A monolith is one app. Microservices are many small apps. SQL is tables with rules. A document store is flexible nested objects. Interviews like a clear pick plus why. Say what you would start with, and what would make you switch." },
  ],
  questions: [
    { id: 1, level: "beginner", q: "What does full stack developer mean?",
      a: "A full stack developer can take one feature from the screen all the way to the database. The screen is the UI, which is what the user sees and clicks. Between the UI and the data sits an API, which is a set of HTTP URLs the UI can call.\n\nYou also touch glue work: login, saving data, and putting the app on a host. You do not have to be the world's best at every layer. Specialists still exist. Full stack means enough skill at each layer to ship a working feature.\n\nIn the code: the first lines run in the browser. fetch(\"/api/notes\") asks the server for notes and turns the reply into JSON. The Express route app.get(\"/api/notes\") runs on the server, reads rows from the database with SQL, and sends those rows back as JSON.\n\nA common mistake is only building the pretty screen and leaving the API and database as an afterthought.",
      code: `// UI asks the server
const notes = await fetch("/api/notes").then(function (r) { return r.json(); });

// server answers from data
app.get("/api/notes", async function (req, res) {
  const rows = await db.query("SELECT id, title FROM notes");
  res.json(rows.rows);
});` },
    { id: 2, level: "beginner", q: "What is a client-server model?",
      a: "A client-server model is two programs with different jobs. The client asks for something. The server does the work and answers.\n\nA browser is a client. Your API is a server. They usually speak HTTP or HTTPS, which is a request and a response. Many browsers can share one server. The public client should not open the database itself.\n\nIn the code: fetch talks from the browser to https://api.example.com/hello and reads JSON. app.get(\"/hello\") is the server route that answers with { message: \"from the kitchen\" }.\n\nDo not let the browser hold the database password or run SQL on the public internet.",
      code: `// client (browser)
const res = await fetch("https://api.example.com/hello");
const data = await res.json();

// server
app.get("/hello", function (req, res) {
  res.json({ message: "from the kitchen" });
});` },
    { id: 3, level: "beginner", q: "What happens when you type a URL?",
      a: "When you type a URL, the browser has to find the computer, talk to it, and then paint the page. A URL is the address of a page or API, like https://example.com/.\n\nFirst the browser looks up the host name and gets an IP address. That lookup is DNS. Then it opens a connection, often with TLS encryption. Then it sends an HTTP request. The server runs your code and sends HTML or JSON back. The browser reads the HTML, then asks for CSS, JS, and images. JS runs, and the page paints. A CDN or cache can skip some of those steps.\n\nIn the code: openHome() fetch-es https://example.com/, waits for the HTTP response, then reads the body as text. text.slice(0, 40) only prints the start, the way a browser would then keep going and paint.\n\nYou do not need every networking RFC. You do need this story in order: find, connect, request, response, extra files, paint.",
      code: `async function openHome() {
  const html = await fetch("https://example.com/"); // HTTP request
  const text = await html.text();                   // response body
  console.log(text.slice(0, 40));                   // browser then paints
}` },
    { id: 4, level: "beginner", q: "HTTP vs HTTPS?",
      a: "HTTP is the request and response language of the web. HTTPS is the same language riding inside TLS encryption.\n\nTLS hides the bytes from people on the same cafe Wi-Fi. A certificate also helps prove you reached the real server, not a fake one. Cookies marked Secure only travel on HTTPS. Use HTTPS for any real site with users.\n\nIn the code: the /me route checks req.secure and NODE_ENV. If production traffic is not HTTPS, it returns 400 with { error: \"use https\" }. Otherwise it returns { name: \"Ada\" }.\n\nLocalhost HTTP is fine while you learn. Production should not stay on plain HTTP.",
      code: `app.get("/me", function (req, res) {
  if (!req.secure && process.env.NODE_ENV === "production") {
    return res.status(400).json({ error: "use https" });
  }
  res.json({ name: "Ada" });
});` },
    { id: 5, level: "beginner", q: "What is an API?",
      a: "The problem before\nThe website talked to the database from the browser, or every screen invented its own way to save a todo. Mobile and web could not share work. A password sat in the page.\n\nWhat this is\nAn API is a contract so two programs can talk. A web API is HTTP plus JSON: URLs, methods, and bodies.\n\nWhat it solves\nThe kitchen (server) owns the database. The dining room (UI) only orders. Phone and web call the same /todos.\n\nReal-life example\nA restaurant. You do not cook. You order 'one dosa' (POST /orders). The kitchen answers 'ready' (201) or 'we are closed' (503).\n\nUses\nMobile + web + another service all call the same routes. FastAPI, Express, Go — same idea.\n\nWatch out\nGET must not delete. The browser never holds the database password. If each route invents a new JSON shape, the UI becomes a pile of special cases.",
      code: `app.get("/api/users/1", function (req, res) {
  res.json({ id: 1, name: "Ada" }); // the contract: this JSON shape
});
// the UI should not talk to the database itself` },
    { id: 6, level: "beginner", q: "JSON vs form data?",
      a: "JSON and form data are two ways a browser can send a body. A body is the payload of POST or PUT.\n\nJSON looks like { \"title\": \"Hi\" } and uses Content-Type application/json. HTML forms often send urlencoded fields, or multipart if there is a file. The server parser must match what the client sent. SPAs almost always send JSON with fetch.\n\nIn the code: fetch POSTs to /api/notes with a JSON header and JSON.stringify({ title: \"Milk\" }). app.use(express.json()) is the parser that fills req.body.\n\nIf req.body is empty, you likely used the wrong parser or forgot express.json().",
      code: `await fetch("/api/notes", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Milk" })
});

app.use(express.json());` },
    { id: 7, level: "beginner", q: "frontend vs backend responsibilities?",
      a: "Frontend is what the user sees: layout, accessibility, and helpful checks in the browser. Backend is the source of truth: who is allowed, real validation, saving data, and secrets.\n\nValidate on both sides. Trust only the server. Attackers can skip your pretty React form and call the API directly. If a rule matters, it lives on the server.\n\nIn the code: the UI shows an error if email has no @. The POST /users route still checks req.body.email and returns 400 if it is wrong, or 201 if it is saved.\n\nA common mistake is trusting the form and skipping the same check in the API.",
      code: `// UI: be nice
if (!email.includes("@")) showError("email looks wrong");

// API: be the law
app.post("/users", function (req, res) {
  if (!String(req.body.email).includes("@")) {
    return res.status(400).json({ error: "email required" });
  }
  res.status(201).json({ email: req.body.email });
});` },
    { id: 8, level: "beginner", q: "What is MVC?",
      a: "MVC is a way to split an app into three jobs. Model is data. View is what you see. Controller is the traffic cop for a request.\n\nIn JS stacks you may say routes, services, and React views instead. The idea is the same: do not mix database math into every button. Name the layers so tests have a home. You can ship without the three letters. You cannot ship forever as one 2000-line file.\n\nIn the code: app.get(\"/notes/:id\") only handles HTTP. noteService.get loads the data. res.json(note) is the view here, or React would be the view on the client.\n\nPut business rules in the service, not inside every route callback.",
      code: `// controller / route: HTTP only
app.get("/notes/:id", async function (req, res) {
  const note = await noteService.get(req.params.id); // model/service
  res.json(note); // view is JSON here (or React on the client)
});` },
    { id: 9, level: "beginner", q: "What is a monolith?",
      a: "A monolith is one program you deploy that holds many features, and sometimes the UI too. One process, one deploy.\n\nIt is simple to start. Transactions across modules are easier because they share one database. Teams and scale can get awkward later if everything is tangled. Most products should start here.\n\nIn the code: three routers hang off one app: /api/users, /api/orders, /api/notes. They still run in one process.\n\n\"We use microservices\" is not a badge of honour on day one.",
      code: `// one app, several features
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/notes", noteRouter);
// one process, one deploy` },
    { id: 10, level: "beginner", q: "What are microservices?",
      a: "Microservices are many small programs that deploy on their own. Each service often has its own data.\n\nYou gain isolation and team freedom. You pay with network calls, extra ops, and messy consistency. Split along a real domain boundary when a module needs its own scale or team. A distributed monolith is many repos that are still one tangle.\n\nIn the code: the UI fetch-es users.example.com and orders.example.com separately. Those extra hops can fail on their own.\n\nDo not start here by default for a small product.",
      code: `// UI talks to two services instead of one app
await fetch("https://users.example.com/me");
await fetch("https://orders.example.com/recent");
// extra network hops and extra failure points` },
    { id: 11, level: "intermediate", q: "monolith vs microservices — when?",
      a: "Stay a monolith until a module needs its own scale, language, or team clock. Split along domain lines with clear APIs, not along \"every folder is a service\".\n\nIf services still share one database and cannot deploy alone, you did not really split. Start simple. Split when one oven is always full, not because a blog said so.\n\nIn the code: both queries hit the same db. That is a modular monolith. A true split would be two databases and an HTTP or gRPC call.\n\nDo not split because the words sound impressive in an interview.",
      code: `// still one database in a modular monolith
await db.query("SELECT * FROM users WHERE id = $1", [id]);
await db.query("SELECT * FROM orders WHERE user_id = $1", [id]);
// a true split would be two databases and an HTTP/gRPC call` },
    { id: 12, level: "intermediate", q: "What is REST?",
      a: "REST is a common web API style. URLs name resources, like /users/5. HTTP verbs name actions: GET reads, DELETE removes.\n\nGET should be safe to retry and cacheable when the data is public. Stateless means each request carries what it needs, often a token. JSON is a representation of the resource, not REST itself. HATEOAS is an extra idea interviews rarely require you to build.\n\nIn the code: GET /users/5 returns { id: 5, name: \"Ada\" }. DELETE /users/5 returns 204 with no body.\n\nDo not put a delete behind a GET just because a form was easier.",
      code: `app.get("/users/5", function (req, res) {
  res.json({ id: 5, name: "Ada" });
});
app.delete("/users/5", function (req, res) {
  res.status(204).end();
});` },
    { id: 13, level: "intermediate", q: "GraphQL when?",
      a: "GraphQL is a query language where the client names the fields it wants, often on one POST /graphql URL.\n\nUse it when many clients need different shapes, or REST chatters with too many round trips. You pay with complexity, caching, and guarding expensive nested queries. You still need auth and rate limits. A simple CRUD app is often happier with REST. N+1 in resolvers is the famous foot-gun: one query per nested field.\n\nIn the code: the query string asks only for user name. The POST /graphql handler returns { data: { user: { name: \"Ada\" } } }.\n\nDo not pick GraphQL only because it is trendy.",
      code: `const query = "{ user(id: 1) { name } }";
// one POST /graphql body, client picks fields
app.post("/graphql", function (req, res) {
  res.json({ data: { user: { name: "Ada" } } });
});` },
    { id: 14, level: "intermediate", q: "gRPC when?",
      a: "gRPC is a way for programs to call each other with a typed binary contract, often protobuf. Protobuf is a compact typed message format, not JSON text.\n\nIt is strong service-to-service inside a company. It can stream. Browsers need a gateway to talk to it easily. Public mobile and web APIs are still often JSON. Typed contracts reduce \"what fields exist\" arguments.\n\nIn the code: GetUser is the request shape { id: 1 }. UserReply is the response shape { id: 1, name: \"Ada\" }. console.log only shows the idea of those two messages.\n\nDo not put gRPC on the browser as your first full stack choice.",
      code: `// idea of a typed contract (not JSON)
const GetUser = { id: 1 };          // request
const UserReply = { id: 1, name: "Ada" }; // response
console.log(GetUser, UserReply);` },
    { id: 15, level: "intermediate", q: "What is CORS and why does the UI see it?",
      a: "CORS is a browser rule about origins. An origin is scheme plus host plus port, like http://localhost:5173.\n\nA page on :5173 may not read :3000 unless the server allows it. Postman is not a browser, so it does not apply CORS. The server must send Access-Control-Allow-Origin for the real UI origin. Same-origin deploys, UI and API on one host, avoid much of this.\n\nIn the code: middleware sets Access-Control-Allow-Origin to http://localhost:5173, then calls next() so the route can run.\n\nNever reflect * together with cookies.",
      code: `app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  next();
});` },
    { id: 16, level: "intermediate", q: "preflight request?",
      a: "A preflight is the browser's extra OPTIONS request that asks \"may I send this?\" before some POSTs.\n\nJSON POST and extra headers often trigger it. The server must allow methods and headers. Simple GET with no custom headers may skip it. Caches reduce how often preflight runs. If your POST never hits the route, you may be failing OPTIONS.\n\nIn the code: app.options(\"/api/notes\") sets Allow-Methods to GET, POST and Allow-Headers to Content-Type, then returns 204.\n\nA CORS library often handles OPTIONS for you, but you still need to allow the real headers.",
      code: `app.options("/api/notes", function (req, res) {
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(204).end();
});` },
    { id: 17, level: "intermediate", q: "cookies vs Authorization header?",
      a: "A cookie and an Authorization header are two ways to send login proof. A cookie is a small value the browser stores and may send automatically. Bearer means the JS attaches Authorization: Bearer plus a token.\n\nCookies are convenient. They bring CSRF risk if they authenticate state-changing requests. CSRF is another site tricking the browser into submitting as you. Bearer is explicit. XSS is a risk if the token sits in localStorage, because stolen JS can read it. HttpOnly cookie sessions are common for first-party websites.\n\nIn the code: the first fetch sets the Authorization header by hand. The second fetch uses credentials: \"include\" so the browser sends the Cookie.\n\nPick one model and protect it on purpose. Do not mix them randomly.",
      code: `// header style
await fetch("/api/me", { headers: { Authorization: "Bearer " + token } });

// cookie style: browser sends Cookie automatically
await fetch("/api/me", { credentials: "include" });` },
    { id: 18, level: "intermediate", q: "Where should you store a JWT in a SPA?",
      a: "A JWT is a signed token that says who the user is. A SPA is a single-page app that runs in the browser.\n\nMemory is safest from XSS but vanishes on refresh. localStorage is easy for XSS scripts to read. An HttpOnly Secure cookie is usually better for a website, with CSRF controls. There is no perfect answer. Name the XSS versus CSRF trade-off.\n\nIn the code: accessToken lives in a let in memory. setToken stores it. authHeader() builds { Authorization: \"Bearer \" + accessToken } for later fetch calls.\n\nNever store a JWT in a public gist or in the URL.",
      code: `// memory: lost on refresh, not on disk
let accessToken = null;
function setToken(t) { accessToken = t; }
function authHeader() {
  return { Authorization: "Bearer " + accessToken };
}` },
    { id: 19, level: "intermediate", q: "refresh token rotation?",
      a: "Refresh token rotation keeps a user logged in without a long-lived access token. An access token is a short proof, often minutes. A refresh token lasts longer and is exchanged for a new pair.\n\nIf a stolen refresh token is reused, you revoke the whole family. Store refresh tokens more carefully than access tokens. Rotation detects theft better than a static refresh forever. You still protect against XSS.\n\nIn the code: POST /refresh reads req.body.refresh. If that value is already in used, it returns 401 stolen. Otherwise it marks it used and returns a new access and refresh pair.\n\nA common mistake is treating a refresh token like a forever password.",
      code: `app.post("/refresh", function (req, res) {
  const old = req.body.refresh;
  if (used.has(old)) return res.status(401).json({ error: "stolen?" });
  used.add(old);
  res.json({ access: "new-short-token", refresh: "new-refresh" });
});` },
    { id: 20, level: "intermediate", q: "OAuth 2.0 vs OpenID Connect?",
      a: "OAuth 2.0 is about authorization: an app gets a token to call an API as the user. OpenID Connect adds identity: who logged in, via an id_token and userinfo.\n\n\"Login with Google\" is OIDC sitting on OAuth. Do not build password sharing with Google. Use the redirect dance. Your app still needs its own session after the handshake.\n\nIn the code: idToken has sub google-123 and an email. db.users.upsert keys the local user on googleSub. sub is the stable id from the identity provider.\n\nA common mistake is treating email as the only stable id. Emails can change.",
      code: `const idToken = { sub: "google-123", email: "ada@gmail.com" };
// after OIDC, you create your own user row keyed by sub
db.users.upsert({ googleSub: idToken.sub, email: idToken.email });
// sub is the stable id from the identity provider` },
    { id: 21, level: "intermediate", q: "authorization code flow with PKCE?",
      a: "Authorization code flow with PKCE is the safe way a SPA or native app logs in with an identity provider. PKCE means the app keeps a random verifier and sends a hash of it on the redirect.\n\nThe user comes back with a code. You exchange the code plus the verifier for tokens. The old implicit flow put a token in the URL hash and is out of fashion. A backend-for-frontend that does the exchange is also a solid pattern. PKCE is for public clients that cannot hide a secret.\n\nIn the code: codeVerifier is held in memory. codeChallenge is sha256 of that verifier, sent on the login redirect. Later you exchange { code, codeVerifier }. A stolen code is useless without the verifier.\n\nDo not put client secrets in a public SPA if you can avoid it.",
      code: `const codeVerifier = "random-string-held-in-memory";
const codeChallenge = sha256(codeVerifier); // sent on the login redirect
// later: exchange { code, codeVerifier } for tokens
// a stolen code is useless without the verifier` },
    { id: 22, level: "intermediate", q: "What is a BFF?",
      a: "A BFF is a Backend for Frontend: an API shaped for one UI, like a web BFF or a mobile BFF.\n\nIt hides tokens, aggregates several services, and returns a DTO the screen needs. A DTO is the public JSON shape. The browser stays simple. It is still backend. It is just not a generic one-size API. It helps when you have many microservices and one React app.\n\nIn the code: GET /bff/home loads me from users and feed from posts, then returns one JSON object { me, feed } for the home screen.\n\nA common mistake is making the browser stitch five microservices on its own.",
      code: `app.get("/bff/home", async function (req, res) {
  const me = await users.get(req.user.id);
  const feed = await posts.latestFor(req.user.id);
  res.json({ me: me, feed: feed }); // one shape for the home screen
});` },
    { id: 23, level: "intermediate", q: "DTO vs database model?",
      a: "A DTO is the public shape: fields the UI may see. The database model may have password hashes, internal flags, and extra joins.\n\nMap to a DTO. Hide secrets. When the table gains a column, the UI should not break or leak it. Type the DTO once and share it if you can.\n\nIn the code: toPublicUser copies only id and name from the row. res.json sends that object, not password_hash.\n\nNever res.json the raw mongoose document or SQL row without a map.",
      code: `function toPublicUser(row) {
  return { id: row.id, name: row.name }; // no password_hash
}
res.json(toPublicUser(userRow));` },
    { id: 24, level: "intermediate", q: "client validation vs server validation?",
      a: "Client validation is UX: instant \"email looks wrong\". Server validation is security: attackers do not use your form.\n\nThe rules should agree so users are not surprised. Never skip the server because the React form already checked. Return field errors in a stable JSON shape.\n\nIn the code: validEmail checks the value is a string and includes @. The comment says to use that function in the form and in app.post(\"/signup\").\n\nA common mistake is two different email rules, so the UI says OK and the API says 400.",
      code: `function validEmail(s) {
  return typeof s === "string" && s.includes("@");
}
// use in the form AND in app.post("/signup", ...)` },
    { id: 25, level: "intermediate", q: "What is XSS and how do you prevent it?",
      a: "XSS means hostile text becomes JavaScript in someone else's browser. Encode output. Avoid innerHTML for user text. Use a sanitizer for rich text. Add CSP, which is a header that limits what scripts may run.\n\nHttpOnly cookies make stolen document.cookie harder. React escapes by default. dangerouslySetInnerHTML is named that for a reason. Treat every user string as dangerous until encoded.\n\nIn the code: escapeHtml turns & and < into safe text. textContent on the bio element is safer than innerHTML.\n\nA common mistake is concatenating user text into HTML strings.",
      code: `function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;");
}
document.getElementById("bio").textContent = user.bio; // safer than innerHTML` },
    { id: 26, level: "intermediate", q: "What is CSRF?",
      a: "CSRF is a forged request from another site. You are logged in. Another page tricks the browser into submitting a state change to your API, sending cookies.\n\nSameSite cookies, CSRF tokens, and not using cookie auth for random cross-site APIs help. JSON APIs with Bearer tokens from JS have a different main risk: XSS. First-party cookie sessions need CSRF planning. GET should not change money or passwords.\n\nIn the code: POST /email/change compares req.body.csrf to req.session.csrf. A mismatch returns 403. A match returns { ok: true }.\n\nA common mistake is protecting login pages but leaving \"change email\" unguarded.",
      code: `app.post("/email/change", function (req, res) {
  if (req.body.csrf !== req.session.csrf) {
    return res.status(403).json({ error: "bad csrf" });
  }
  res.json({ ok: true });
});` },
    { id: 27, level: "intermediate", q: "SQL injection vs command injection?",
      a: "SQL injection is hostile data becoming SQL. Command injection is hostile data becoming a shell command.\n\nFix SQL with parameters. Never exec user strings. Spawn with an args array if you must run a program. ORMs do not save you if you concatenate raw(). These are still in the OWASP list for a reason.\n\nIn the code: db.query uses $1 so req.params.id stays data. spawn(\"zip\", [\"out.zip\", safeName]) passes arguments as a list, not one shell string.\n\nA common mistake is building SQL or a shell line with + or template glue.",
      code: `await db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
const { spawn } = require("child_process");
spawn("zip", ["out.zip", safeName]); // args array, not one shell string
// user text stays data, not a second language` },
    { id: 28, level: "intermediate", q: "OWASP Top 10 you should name?",
      a: "OWASP Top 10 is a famous list of ways real apps get hurt. Name broken access control first. Then injection, auth failures, crypto issues, misconfig, old libraries, logging gaps, SSRF.\n\nTalk about IDOR: check the user owns this id. You do not need all ten word-perfect. You need access control in your design. Logging failures mean you cannot investigate. Vulnerable components means outdated packages.\n\nIn the code: GET /orders/:id requires login, loads the order, then returns 404 unless order.userId matches req.user.id.\n\nA common mistake is loading by id and skipping the owner check.",
      code: `app.get("/orders/:id", needLogin, async function (req, res) {
  const order = await db.findOrder(req.params.id);
  if (!order || order.userId !== req.user.id) {
    return res.status(404).json({ error: "not found" }); // access control
  }
  res.json(order);
});` },
    { id: 29, level: "advanced", q: "SSRF?",
      a: "SSRF is Server-Side Request Forgery. Your server fetches a URL the user chose. The attacker points you at internal IPs or cloud metadata like 169.254.169.254.\n\nYour server becomes a proxy into the private network. Allowlist hosts. Block link-local. Do not pass raw URLs to fetch. Preview-unfurling features are a common SSRF door.\n\nIn the code: allowed is a Set of one origin. safeFetch parses the URL and throws blocked unless the origin is in that set, then fetch-es.\n\nNever fetch(req.body.url) with no allowlist.",
      code: `const allowed = new Set(["https://images.example.com"]);
function safeFetch(url) {
  if (!allowed.has(new URL(url).origin)) throw new Error("blocked");
  return fetch(url);
}` },
    { id: 30, level: "intermediate", q: "What is HTTPS certificate validation?",
      a: "Certificate validation is what the lock icon is doing. The client checks the certificate chain and that the name matches the host.\n\nUsers see a warning if that fails. Your server-to-server calls must verify too. Do not set rejectUnauthorized false in production. Expired or wrong-host certs should fail closed. Internal services still deserve real certs or a private CA.\n\nIn the code: https.get calls https://api.example.com/health and logs the status. The default is to verify the cert. The comment says not to turn checks off in production.\n\nA common mistake is disabling TLS verify \"just for staging\" and leaving it off.",
      code: `https.get("https://api.example.com/health", function (res) {
  console.log(res.statusCode); // default: verify the cert
});
// do not turn certificate checks off in production` },
    { id: 31, level: "beginner", q: "What is a cookie?",
      a: "A cookie is a small key-value the browser stores and sends back to a matching site. Attributes control where it goes: Domain, Path, Secure, HttpOnly, SameSite, Max-Age.\n\nLogin sessions often live in a cookie. Users can delete cookies. Do not store huge data there. Never put a secret in a non-HttpOnly cookie if JS does not need it.\n\nIn the code: res.cookie sets sid to abc with httpOnly, secure, sameSite lax, and maxAge one hour.\n\nA common mistake is storing the whole user object in a readable cookie.",
      code: `res.cookie("sid", "abc", {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  maxAge: 3600000
});` },
    { id: 32, level: "intermediate", q: "session fixation?",
      a: "Session fixation is a login trick. An attacker sets a known session id. The victim logs in. The attacker reuses that id and is now the victim.\n\nFix: issue a new session id after login. Rotate on privilege change too: login, password change. Signed random ids belong on the server map. \"Just set cookie = user id\" is not a session design.\n\nIn the code: POST /login calls req.session.regenerate, then stores userId on the new session, then returns { ok: true }.\n\nA common mistake is keeping the pre-login session id after a successful login.",
      code: `app.post("/login", function (req, res) {
  req.session.regenerate(function () {
    req.session.userId = user.id; // new id after login
    res.json({ ok: true });
  });
});` },
    { id: 33, level: "intermediate", q: "password reset flow essentials?",
      a: "A password reset should create a long random token, store a hash of it, expire it soon, and allow one use. Send a link over email. Then set a new password hash.\n\nDecide whether you reveal if the email exists: user-enum versus UX. Invalidate old sessions after reset. The token is as powerful as login. Guard it. Do not email the new password in clear text as the only step.\n\nIn the code: crypto.randomBytes(32) makes the token. The database saves userId, sha256(token), and an expiry one hour out. The email contains the raw token, which you consume once.\n\nA common mistake is storing the raw token in the database forever.",
      code: `const token = crypto.randomBytes(32).toString("hex");
await db.saveReset({ userId: user.id, hash: sha256(token), exp: Date.now() + 3600000 });
// email a link that contains token, then consume it once
// store a hash, not the raw token, if you can` },
    { id: 34, level: "beginner", q: "What is hashing vs encryption?",
      a: "Hashing is one-way. You cannot get the password back. Good for passwords and file checksums. Encryption is two-way with a key. You can decrypt. Good for secrets at rest and TLS.\n\nDo not encrypt passwords as your storage plan. Hash them with bcrypt or argon2. TLS is encryption on the wire. Password storage is hashing. If you can \"decrypt the password\", you designed it wrong.\n\nIn the code: bcrypt.hash stores a one-way hash. encrypt(apiKey, KEY) is reversible with KEY. bcrypt.compare checks a login attempt against the hash.\n\nA common mistake is storing passwords with reversible encryption and calling it hashing.",
      code: `const hash = await bcrypt.hash(password, 10); // one-way
const box = encrypt(apiKey, process.env.KEY); // reversible with KEY
const ok = await bcrypt.compare(password, hash);
console.log(ok, Boolean(box));` },
    { id: 35, level: "intermediate", q: "salting?",
      a: "A salt is random data mixed into the hash so two users with password123 do not look the same in the database. Rainbow tables fail. Modern bcrypt APIs salt for you.\n\nNever use a single global salt for all users. Store the salt with the hash. Libraries already do. Pepper is an extra server secret. Salt is the usual interview word.\n\nIn the code: hash1 and hash2 both hash \"secret\" with cost 10. hash1 === hash2 is false because the salts differ. Both still match the same password via compare.\n\nA common mistake is hashing the password with SHA-256 and no per-user salt.",
      code: `const hash1 = await bcrypt.hash("secret", 10);
const hash2 = await bcrypt.hash("secret", 10);
console.log(hash1 === hash2); // false: different salts
// both still match the same password via compare` },
    { id: 36, level: "intermediate", q: "What is RBAC vs ABAC?",
      a: "RBAC is Role-Based Access Control: roles like admin, editor, viewer. ABAC is Attribute-Based Access Control: rules on department, owner, time of day.\n\nStart with RBAC. When roles explode into admin-but-only-for-team-7, add attributes. Ownership checks, this post is yours, are a simple attribute rule. Do not invent twenty roles on day one.\n\nIn the code: canEdit returns true for admin, otherwise true only if post.authorId equals user.id.\n\nA common mistake is checking role and forgetting the owner can edit their own post.",
      code: `function canEdit(user, post) {
  if (user.role === "admin") return true;
  return post.authorId === user.id; // owner attribute
}` },
    { id: 37, level: "intermediate", q: "multi-tenancy patterns?",
      a: "Multi-tenancy means one app serves many customers. Shared database plus tenant_id is cheapest. Schema-per-tenant or database-per-tenant isolate more and cost more.\n\nShared is easy to leak if you forget the tenant filter. Force tenant from the session, never from the client body alone. Tests should try another tenant's ids.\n\nIn the code: GET /invoices is behind needLogin. The SQL filters WHERE tenant_id = $1 using req.user.tenantId from the session.\n\nA common mistake is taking tenantId from req.body so a client can switch tenants.",
      code: `app.get("/invoices", needLogin, async function (req, res) {
  const rows = await db.query(
    "SELECT * FROM invoices WHERE tenant_id = $1",
    [req.user.tenantId] // from session, not req.body
  );
  res.json(rows.rows);
});` },
    { id: 38, level: "advanced", q: "how do you prevent cross-tenant leaks?",
      a: "Cross-tenant leak means customer A sees customer B. Tenant id comes from the login, not from the JSON body.\n\nRow-level security in Postgres is extra insurance. Write tests that request the other tenant's invoice id and expect 404. Be careful with reports and admin exports. Logs should include tenant id for forensics. This is access control, the number-one OWASP theme.\n\nIn the code: the query requires both invoice id and req.user.tenantId. If no row, the handler returns 404.\n\nA common mistake is SELECT by id only and trusting the UI hid the other tenant's links.",
      code: `const inv = await db.query(
  "SELECT * FROM invoices WHERE id = $1 AND tenant_id = $2",
  [req.params.id, req.user.tenantId]
);
if (!inv.rows[0]) return res.status(404).end();` },
    { id: 39, level: "intermediate", q: "caching layers?",
      a: "Caching layers are stacked copies of data. Browser cache, CDN, app memory, Redis, database buffer.\n\nCache-Control headers tell the browser and CDN what is allowed. Invalidate or use TTL. TTL is time to live, how long a copy may stay. User-specific data needs a private cache key. Wrong cache shows the wrong user's name. That is a security bug. Cache after you measure a hot read.\n\nIn the code: Cache-Control public, max-age=60 lets a CDN store the JSON for one minute. The comment warns not to put a user's email in a public cache.\n\nA common mistake is caching /api/me as public because it made the page faster.",
      code: `res.setHeader("Cache-Control", "public, max-age=60");
res.json({ time: "server-time-ok-to-reuse-1-min" });
// public means a CDN may store this too
// do not put a user's email in a public cache` },
    { id: 40, level: "intermediate", q: "Cache-Control: no-store vs max-age?",
      a: "no-store means do not write this response to disk. Use it for private pages and tokens. max-age=N means you may reuse for N seconds.\n\nETag and If-None-Match let the client ask \"has this changed?\" and get 304. Logged-in HTML is often private. Public CSS can be max-age long with hashed filenames.\n\nIn the code: GET /balance requires login, sets Cache-Control no-store, and returns { balance: 12 }.\n\nA common mistake is max-age on a bank-style JSON endpoint.",
      code: `app.get("/balance", needLogin, function (req, res) {
  res.setHeader("Cache-Control", "no-store"); // bank statement JSON
  res.json({ balance: 12 });
});` },
    { id: 41, level: "intermediate", q: "CDN role?",
      a: "A CDN is a Content Delivery Network: servers close to users that cache static files, and sometimes HTML.\n\nIt offloads your origin. You need cache keys and a purge story when you deploy new JS. Hashed asset names like app.abc123.js make long cache safe. The API origin still does auth and data. HTML that is personal should not be cached as public.\n\nIn the code: the asset URL includes abc123. Cache-Control public, max-age=31536000, immutable says keep it a year. A new deploy gets a new hash name.\n\nA common mistake is caching index.html forever so users never see the new JS.",
      code: `const asset = "/assets/app.abc123.js"; // hash changes on deploy
res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
res.setHeader("Content-Type", "application/javascript");
// old hash URL can stay cached; new deploy has a new name` },
    { id: 42, level: "intermediate", q: "what should not be cached?",
      a: "Do not cache personalized HTML with private data. Do not cache responses that Set-Cookie. Do not cache per-user API results unless the key includes the user and is private.\n\nA shared CDN cache that keys only on URL will mix users if you are not careful. Authorization headers usually make a response private. When in doubt, no-store for user JSON.\n\nIn the code: GET /api/me requires login, sets private, no-store, and returns the user's email.\n\nA common mistake is a CDN that caches /api/me by URL and serves Ada's email to Bob.",
      code: `app.get("/api/me", needLogin, function (req, res) {
  res.setHeader("Cache-Control", "private, no-store");
  res.json({ email: req.user.email });
});` },
    { id: 43, level: "intermediate", q: "Redis use cases?",
      a: "Redis is a fast in-memory store that often sits next to the database. Sessions, rate limits, caches, pub/sub, job queues, leaderboards.\n\nIt is RAM with persistence options. It is not automatically your only source of truth. Eviction can drop keys. Know TTL. The real orders still live in Postgres. Use Redis to make the app feel instant.\n\nIn the code: redis.set stores session:sid to userId for 3600 seconds. redis.get reads it back. Missing key returns 401. Found key returns { userId }.\n\nA common mistake is treating Redis as the only copy of orders you cannot lose.",
      code: `await redis.set("session:" + sid, userId, "EX", 3600);
const found = await redis.get("session:" + sid);
if (!found) return res.status(401).json({ error: "please log in" });
res.json({ userId: found });` },
    { id: 44, level: "intermediate", q: "cache stampede?",
      a: "A cache stampede is many requests missing a hot key at once and all hitting the database. It is also called dogpile.\n\nFixes: a lock so one request refills, slightly random TTL, or coalesce requests. A 1-second stampede can look like an outage. Soft TTL, serve stale while one refresh runs, is a common pattern. \"Just cache it\" still needs a plan.\n\nIn the code: getHot returns cache.get(\"home\") on hit. If a refill is already running, it returns oldHome. Otherwise it sets warming, loads from db, writes the cache, and clears warming.\n\nA common mistake is letting every miss call db.loadHome() with no lock.",
      code: `let warming = false;
async function getHot() {
  const hit = cache.get("home");
  if (hit) return hit;
  if (warming) return oldHome;
  warming = true;
  const fresh = await db.loadHome();
  cache.set("home", fresh);
  warming = false;
  return fresh;
}` },
    { id: 45, level: "intermediate", q: "what is pagination on the full stack?",
      a: "Pagination is how UI and API share pages of a list. The API returns a page plus a cursor or a total. The UI has Next or infinite scroll.\n\nCap page size. Cursors beat offset for feeds that change. A cursor is a bookmark, like after this id. Document the query params so the frontend does not invent names. Empty lists need an empty state, not a spinner forever. Filter and sort belong in the same contract.\n\nIn the code: GET /posts caps limit at 50. db.postsAfter uses the after query and that limit. The JSON includes items and next as the last row's id.\n\nA common mistake is letting the client ask for limit=1000000.",
      code: `app.get("/posts", async function (req, res) {
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const rows = await db.postsAfter(req.query.after, limit);
  res.json({ items: rows, next: rows[rows.length - 1] && rows[rows.length - 1].id });
});` },
    { id: 46, level: "intermediate", q: "file uploads end-to-end?",
      a: "A file upload goes from the input box to storage. Client: file input, size and type checks. Server: parse multipart, or skip the server body and use a presigned URL to object storage.\n\nStore metadata in the database, bytes in S3, or disk in tiny homework apps. Virus scan if the product needs it. Never trust the original filename as a path. Local disk dies when the container dies.\n\nIn the code: POST /photo uses upload.single(\"photo\"). The handler inserts req.file.filename into photos and returns { key }.\n\nA common mistake is saving the file as the user's original name, including ../../secret.txt.",
      code: `app.post("/photo", upload.single("photo"), async function (req, res) {
  await db.query("INSERT INTO photos (key) VALUES ($1)", [req.file.filename]);
  res.json({ key: req.file.filename });
});` },
    { id: 47, level: "advanced", q: "presigned URL?",
      a: "A presigned URL is a short-lived URL your API mints so the browser can upload to S3 without streaming through Node.\n\nYour API still checks the user may upload. The browser PUTs the file to that URL. Your API never sees the whole bytes. Expire the URL. Limit content type and size in the policy. Save the object key in your database after.\n\nIn the code: POST /uploads requires login, builds key as userId/timestamp.jpg, mints a 60-second PUT URL, and returns { url, key }.\n\nA common mistake is minting a public forever URL for anyone who guesses the path.",
      code: `app.post("/uploads", needLogin, function (req, res) {
  const key = req.user.id + "/" + Date.now() + ".jpg";
  const url = s3.presignPut(key, 60); // 60 seconds
  res.json({ url: url, key: key });
});` },
    { id: 48, level: "intermediate", q: "websockets vs HTTP polling vs SSE?",
      a: "Polling, SSE, and WebSockets are three ways to get live updates. Polling asks every N seconds. Simple, wasteful. SSE is Server-Sent Events: the server pushes one way over HTTP. WebSockets let both sides send anytime.\n\nUse the simplest that meets the need. Chat needs sockets. A once-a-minute dashboard can poll. Scale sockets with Redis if you have many Node processes.\n\nIn the code: setInterval every 15 seconds fetch-es /api/unread, parses JSON, and logs it. That is polling.\n\nA common mistake is opening a WebSocket for a number that changes once an hour.",
      code: `setInterval(async function () {
  const n = await fetch("/api/unread").then(function (r) { return r.json(); });
  console.log(n); // polling
}, 15000);` },
    { id: 49, level: "intermediate", q: "how do you keep a SPA and API in sync?",
      a: "Keeping SPA and API in sync means field names do not drift. Share types: OpenAPI, tRPC, Zod. Version the API. Contract tests.\n\nFeature flags help when frontend and backend ship on different days. Never \"just remember\" that the field was userName not username. A broken mapper shows as undefined in the UI. Generate types when the team is large enough that humans forget.\n\nIn the code: User says id is number and name is string. parseUser throws if json.name is not a string, then returns json.\n\nA common mistake is renaming a JSON field in the API and forgetting the React screen.",
      code: `const User = { id: "number", name: "string" };
function parseUser(json) {
  if (typeof json.name !== "string") throw new Error("contract broken");
  return json;
}` },
    { id: 50, level: "intermediate", q: "tRPC / GraphQL codegen?",
      a: "tRPC and GraphQL codegen generate TypeScript from a schema so fetch calls know the fields. That reduces DTO drift.\n\nYou still validate at the boundary. Types are not runtime safety by themselves unless you add Zod. Great for monorepos. REST plus OpenAPI codegen is the same idea. Do not skip auth because types exist.\n\nIn the code: type Note is { id, title }. getNote fetch-es /api/notes/:id and returns res.json() typed as Note.\n\nA common mistake is trusting generated types and skipping runtime checks on untrusted JSON.",
      code: `type Note = { id: number, title: string };
async function getNote(id: number): Promise<Note> {
  const res = await fetch("/api/notes/" + id);
  return res.json();
}` },
    { id: 51, level: "beginner", q: "What is SSR and why would a full stack app use it?",
      a: "SSR is server-side rendering. The server sends HTML that already has content, not an empty shell.\n\nThe first paint is faster. Search engines see text. Then JS hydrates and the page becomes interactive. Hydrate means JS attaches events to that HTML. Next.js is a common tool. SPAs can still be fine for apps behind login. SSR is extra moving parts. Use it when first content and SEO matter.\n\nIn the code: renderNote builds an h1 from note.title. GET /notes/1 loads the note from the db and res.send that HTML.\n\nA common mistake is sending an empty <div id=\"root\"> and hoping crawlers wait for JS.",
      code: `function renderNote(note) {
  return "<h1>" + note.title + "</h1>"; // HTML from the server
}
app.get("/notes/1", async function (req, res) {
  const note = await db.note(1);
  res.send(renderNote(note));
});` },
    { id: 52, level: "intermediate", q: "SEO for SPAs?",
      a: "SEO is how search engines find and rank pages. Crawlers may see an empty root div if you only render on the client.\n\nSSR, SSG, or a prerenderer helps. Unique titles, descriptions, real links, sitemap. Login-only apps care less about SEO. Marketing pages usually need real HTML. Client-only is not automatically indexed well.\n\nIn the code: GET /notes sends text/html with a real <title>Ada notes</title> and an h1 in the body.\n\nA common mistake is a marketing site that is a blank SPA with no title per page.",
      code: `app.get("/notes", function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.send("<html><head><title>Ada notes</title></head>" +
    "<body><h1>Ada notes</h1></body></html>");
});` },
    { id: 53, level: "intermediate", q: "environment variables across front and back?",
      a: "Backend env can hold database URLs and private keys. Frontend only gets values baked in at build time, like VITE_ or NEXT_PUBLIC_. Users can read them.\n\nNever put a private API key in the React bundle. Public Stripe key versus secret key is the classic pair. The secret stays on the server.\n\nIn the code: publicKey comes from import.meta.env.VITE_STRIPE_PK. secret comes from process.env.STRIPE_SECRET. POST /pay calls charge(secret, req.body).\n\nA common mistake is putting STRIPE_SECRET in a VITE_ variable so it ships to the browser.",
      code: `const publicKey = import.meta.env.VITE_STRIPE_PK; // visible to users
const secret = process.env.STRIPE_SECRET;         // server only
app.post("/pay", function (req, res) {
  charge(secret, req.body);
});` },
    { id: 54, level: "beginner", q: "What is a .env file in a full stack repo?",
      a: "A .env file holds KEY=value for your laptop: database URL, ports. Each app, web and api, can have its own. .env.example lists keys without real secrets.\n\nProduction uses the host's secret manager, not a committed file. Never commit real .env. Code should read process.env, not parse the file by hand in every route.\n\nIn the code: dbUrl is DATABASE_URL. apiPort is PORT or 3000. Missing dbUrl throws. Then it logs the port.\n\nA common mistake is committing a .env with production passwords.",
      code: `const dbUrl = process.env.DATABASE_URL;
const apiPort = process.env.PORT || "3000";
if (!dbUrl) throw new Error("DATABASE_URL missing");
console.log("api port", apiPort);` },
    { id: 55, level: "intermediate", q: "CORS in local dev?",
      a: "Local CORS pain is localhost:5173 talking to localhost:3000. They are different origins. A Vite or CRA proxy makes the browser think the API is same-origin during development.\n\nProduction needs real CORS or a reverse proxy so UI and API share a host. Do not disable CORS in production to \"make it work\". credentials: true needs a specific origin, not *. Document the two URLs for new teammates.\n\nIn the code: the browser calls /api/notes, same origin in dev because of the proxy. The Express route still serves GET /api/notes with [].\n\nA common mistake is setting origin: \"*\" and credentials: true, which browsers reject.",
      code: `// vite proxy idea: browser calls /api, dev server forwards
await fetch("/api/notes"); // same origin in dev

app.get("/api/notes", function (req, res) {
  res.json([]);
});` },
    { id: 56, level: "intermediate", q: "same-origin deployment?",
      a: "Same-origin deployment means example.com plus example.com/api. One host means cookies and CORS get simpler. The browser sees one site.\n\nnginx or the platform routes /api to Node and / to static files. Split domains, app.com plus api.com, need extra CORS and cookie care. Same-origin is a gift for session cookies. SPAs still work. The path prefix is the trick.\n\nIn the code: /api goes to apiRouter. express.static serves dist. app.get(\"*\") sends index.html for client routes.\n\nA common mistake is hosting the SPA on one domain and the API on another, then being surprised by cookies.",
      code: `app.use("/api", apiRouter);
app.use(express.static("dist"));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});` },
    { id: 57, level: "intermediate", q: "reverse proxy?",
      a: "The problem before\nNode sat on the street on port 3000. HTTPS, gzip, and static files all lived in the app. Anyone could knock on the kitchen door.\n\nWhat this is\nA reverse proxy sits in front of Node. Nginx, Caddy, or a cloud load balancer terminate TLS, gzip, serve static files, and route paths.\n\nWhat it solves\nThe world talks to the lobby. Node stays on localhost and still does auth. Health checks hit /healthz through the desk.\n\nReal-life example\nA hotel receptionist. You ask for room 12. You do not wander the staff corridors.\n\nUses\nTLS, static files, path routing, buffering, one domain for UI and API.\n\nWatch out\nExposing Node's port 3000 on the public internet with no proxy.",
      code: `// Express still sees the path after the proxy forwards
app.get("/healthz", function (req, res) {
  res.send("ok");
});` },
    { id: 58, level: "intermediate", q: "gzip / brotli?",
      a: "gzip and brotli compress text so HTML, JSON, and JS shrink a lot. The proxy often does this.\n\nDo not compress images that are already compressed. You waste CPU and can make them bigger. Watch CPU versus size on huge JSON. The browser sends Accept-Encoding. The server may reply Content-Encoding.\n\nIn the code: res.json sends JSON. A proxy may gzip that text. The idea object says gzip html/json/js and skip jpg/png/zip.\n\nA common mistake is gzipping JPEGs \"for speed\" and making them slower.",
      code: `res.setHeader("Content-Type", "application/json");
res.json({ items: list }); // proxy may gzip this text
// already-compressed photos should not be gzipped again
const idea = { gzip: "html/json/js", skip: "jpg/png/zip" };` },
    { id: 59, level: "beginner", q: "What is a migration?",
      a: "A migration is a versioned change to the database schema: add a column, add an index. You run it as part of deploy, in order.\n\nExpand-contract so old and new app versions both work during rollout. Never edit an applied production migration. Add a new one. App code and schema must stay compatible.\n\nIn the code: 014_add_nickname.sql runs ALTER TABLE users ADD COLUMN nickname TEXT. The next deploy can read that column.\n\nA common mistake is editing migration 014 after it already ran in production.",
      code: `-- 014_add_nickname.sql
ALTER TABLE users
ADD COLUMN nickname TEXT;
-- next deploy can read this new column` },
    { id: 60, level: "advanced", q: "expand-contract migrations?",
      a: "Expand-contract means change schema without downtime. Add the new column. Deploy code that writes both old and new. Backfill. Switch reads. Drop the old later.\n\nDo not rename and drop in the same release as the only code that understood the old name. Two deploys beat one clever deploy. Reads of NULL during backfill need a default in code.\n\nIn the code: UPDATE copies name into nickname where nickname is NULL. Then label uses user.nickname || user.name so both app versions work.\n\nA common mistake is DROP COLUMN in the same release that first starts writing the new name.",
      code: `await db.query("UPDATE users SET nickname = name WHERE nickname IS NULL");
// old app still reads name; new app prefers nickname
const user = await db.user(id);
const label = user.nickname || user.name;` },
    { id: 61, level: "intermediate", q: "blue-green or rolling deploys?",
      a: "Blue-green keeps two environments and flips traffic when green is healthy. Rolling replaces instances a few at a time.\n\nBoth need backward-compatible APIs and migrations. Health checks decide when an instance may receive traffic. A migration that breaks the old app will fail both styles.\n\nIn the code: GET /healthz returns \"ok\" so the load balancer only sends users if this is 200. The comment says keep the check cheap.\n\nA common mistake is a health check that hits a slow dependency and causes restart loops.",
      code: `app.get("/healthz", function (req, res) {
  res.send("ok"); // load balancer only sends users if this is 200
});
// keep this check cheap so a restart loop does not start` },
    { id: 62, level: "intermediate", q: "feature flags?",
      a: "A feature flag turns a feature on without a new deploy. Use it when frontend and backend are not ready on the same day, or as a kill switch.\n\nFlags that live forever become a second messy codebase. Check the flag on the server for anything that matters. The UI can hide a button. Attackers can still call the API.\n\nIn the code: flags.newCheckout is false. POST /checkout returns 404 unless that flag is on, then { ok: true }.\n\nA common mistake is hiding the button in React and leaving the API wide open.",
      code: `const flags = { newCheckout: false };
app.post("/checkout", function (req, res) {
  if (!flags.newCheckout) return res.status(404).end();
  res.json({ ok: true });
});` },
    { id: 63, level: "intermediate", q: "observability three pillars?",
      a: "The three pillars are logs, metrics, and traces. Logs are events. Metrics are numbers over time. Traces follow one request across services.\n\nPut a request id on the UI error if you can, so support can search. A 500 with no id is a guess. Product analytics is not the same as CPU metrics. You want all three as you grow, not a wall of console.log.\n\nIn the code: middleware sets req.id from x-request-id or Date.now, logs JSON with id and path, then next().\n\nA common mistake is logging only \"error\" with no request id.",
      code: `app.use(function (req, res, next) {
  req.id = req.headers["x-request-id"] || String(Date.now());
  console.log(JSON.stringify({ id: req.id, path: req.path }));
  next();
});` },
    { id: 64, level: "intermediate", q: "Sentry / error tracking?",
      a: "Sentry and similar tools capture stack traces from UI and API with a release version. You see \"this started after deploy abc\".\n\nSource maps help, but do not publish secrets in maps. It does not replace logs. It groups panics. Add the request id as extra context.\n\nIn the code: catch logs err.message with requestId, then returns 500 JSON that includes that same requestId for the UI.\n\nA common mistake is returning a generic 500 and never sending the id to the user or to Sentry.",
      code: `try {
  await doWork();
} catch (err) {
  console.error({ err: err.message, requestId: req.id });
  res.status(500).json({ error: "failed", requestId: req.id });
}` },
    { id: 65, level: "beginner", q: "What is CI/CD in a full stack project?",
      a: "CI is Continuous Integration: on every pull request, lint, typecheck, test, and build. CD is Continuous Delivery or Deploy: after main is green, ship to staging or production.\n\nThe same commands should work on your laptop. You cannot click \"it works on my machine\" at a company. Start with tests on the money path.\n\nIn the code: add(2, 3) must equal 5 or the script throws. CI runs checks like that, then a build. console.log says tests passed.\n\nA common mistake is deploying main with no automated tests.",
      code: `function add(a, b) { return a + b; }
if (add(2, 3) !== 5) throw new Error("ci would fail");
// CI runs checks like this, then a build step
console.log("tests passed");` },
    { id: 66, level: "intermediate", q: "preview environments?",
      a: "A preview environment is a live URL per pull request. Reviewers click a unique site instead of only reading a screenshot.\n\nCost and seed data are the hard parts. You need a throwaway database. Great for UI. Secrets must still stay secret. Tear them down or your bill grows. Point the preview API at fake data, not production.\n\nIn the code: preview holds url, api, and a postgres URL for pr42.\n\nA common mistake is pointing every preview at the production database.",
      code: `const preview = {
  url: "https://pr-42.preview.example.com",
  api: "https://pr-42.preview.example.com/api",
  db: "postgres://preview/pr42"
};` },
    { id: 67, level: "intermediate", q: "how do you test the full stack?",
      a: "Unit tests check pure functions. Integration tests check the API plus a test database. E2E tests use Playwright on signup and checkout.\n\nYou cannot E2E everything. Pick money paths. Contract tests help if many services exist. Never point tests at production. Seed the minimum data.\n\nIn the code: testCreateNote POSTs { title: \"Hi\" } to localhost:3000/api/notes and throws if status is not 201.\n\nA common mistake is only testing the React component and never hitting the API.",
      code: `async function testCreateNote() {
  const res = await fetch("http://localhost:3000/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Hi" })
  });
  if (res.status !== 201) throw new Error("api broken");
}` },
    { id: 68, level: "intermediate", q: "test database strategy?",
      a: "A test database is a separate database, transactions you roll back, or containers that start fresh. Never production. Seed the minimum.\n\nShared test DBs flake when two developers collide. Reset between tests or you get mystery failures. Keep fixtures small so tests stay readable.\n\nIn the code: BEGIN, INSERT a user, run assertions, ROLLBACK so the table is clean.\n\nA common mistake is leaving INSERT data in a shared test database.",
      code: `await db.query("BEGIN");
await db.query("INSERT INTO users (email) VALUES ('t@t.com')");
// run assertions
await db.query("ROLLBACK"); // leave the table clean` },
    { id: 69, level: "beginner", q: "What is REST idempotency for payments?",
      a: "Idempotency for payments means a retry does not charge twice. Networks fail. The client may POST twice.\n\nAn idempotency key means the second call returns the first result, not a second charge. Store the key and the response. GET is naturally idempotent. POST payments are not, unless you add this. Put the key in a header from the UI.\n\nIn the code: seen is a Map. POST /pay reads idempotency-key. If the key was seen, it returns the stored result. Otherwise it charges 10, stores it, and returns it.\n\nA common mistake is a Pay button that POSTs again on every retry with no key.",
      code: `const seen = new Map();
app.post("/pay", function (req, res) {
  const key = req.headers["idempotency-key"];
  if (seen.has(key)) return res.json(seen.get(key));
  const result = { charged: 10 };
  seen.set(key, result);
  res.json(result);
});` },
    { id: 70, level: "advanced", q: "exactly-once vs at-least-once?",
      a: "At-least-once means a message may arrive twice. Exactly-once is often \"effectively once\" with dedupe keys. Networks fail.\n\nQueues retry. That is a feature. Design the consumer to survive two copies. Payments and emails are the usual examples.\n\nIn the code: if alreadyProcessed(message.id) return. Then markProcessed and sendEmail. A retry of the same id will not send twice.\n\nA common mistake is sendEmail on every retry with no processed flag.",
      code: `if (await db.alreadyProcessed(message.id)) return;
await db.markProcessed(message.id);
await sendEmail(message.to);
// a retry of the same message id will not send twice` },
    { id: 71, level: "intermediate", q: "eventual consistency example?",
      a: "Eventual consistency means a copy of the data may be slightly old on purpose. Search index or analytics can lag the primary database.\n\nThe count on the home page might be stale for a second. Tell the user, or refresh after a write if it matters. Not every screen needs a serializable transaction. Do not promise \"always exact live count\" if the architecture cannot.\n\nIn the code: INSERT into posts, then 201 JSON with searchMayLag true. The source of truth is the posts table.\n\nA common mistake is showing search results as if they were the live table one millisecond after insert.",
      code: `await db.query("INSERT INTO posts (title) VALUES ($1)", ["Hi"]);
// search index may still miss "Hi" for a short time
res.status(201).json({ id: 1, searchMayLag: true });
// the source of truth is the posts table` },
    { id: 72, level: "advanced", q: "saga vs 2PC?",
      a: "Two-phase commit locks many databases and is rare in web apps. A saga is a sequence of local transactions with undo steps, called compensations, if a later step fails.\n\nPrefer one database transaction when you can. Microservices make this your problem. Keep sagas visible in code, not magic.\n\nIn the code: createOrder, then payments.charge. On catch, markOrderFailed as the compensation.\n\nA common mistake is charging the card and creating the order in two places with no undo path.",
      code: `await db.createOrder(order);
try {
  await payments.charge(order.id);
} catch (e) {
  await db.markOrderFailed(order.id); // compensation
}` },
    { id: 73, level: "intermediate", q: "why transactions matter in checkout?",
      a: "Checkout needs a transaction so you do not oversell. Decrement stock and create the order together, or do neither.\n\nWithout a transaction, two buyers can both see stock 1 and both succeed. Isolation talk is a bonus: SERIALIZABLE or a single UPDATE ... WHERE stock >= 1. The UI can also double-submit. Idempotency plus a transaction. Test with two concurrent checkouts.\n\nIn the code: BEGIN, UPDATE stock where stock >= 1, INSERT the order, COMMIT.\n\nA common mistake is reading stock in the app, subtracting in JS, then writing both rows with no lock.",
      code: `await db.query("BEGIN");
await db.query("UPDATE products SET stock = stock - 1 WHERE id = $1 AND stock >= 1", [sku]);
await db.query("INSERT INTO orders (sku) VALUES ($1)", [sku]);
await db.query("COMMIT");` },
    { id: 74, level: "intermediate", q: "optimistic UI?",
      a: "Optimistic UI updates the screen before the server agrees. Likes and checkboxes feel instant. You roll back if the API fails.\n\nDangerous for payments and stock. Show an error. Do not leave a fake success. Server state libraries like React Query have patterns for this. Never optimistic-charge a card.\n\nIn the code: likes += 1 immediately. fetch POST /api/like. On catch, likes -= 1.\n\nA common mistake is showing \"Paid\" before the charge succeeds.",
      code: `likes += 1; // show now
fetch("/api/like", { method: "POST" }).catch(function () {
  likes -= 1; // rollback
});` },
    { id: 75, level: "beginner", q: "loading, error, empty states?",
      a: "Every fetch needs four UI states. Loading: spinner or skeleton. Error: retry. Empty: no notes yet. Success: the list.\n\nThe API should return [] with 200 for empty collections, not 404. 404 is for a missing id. Do not infinite-spin on a silent failure.\n\nIn the code: state starts as loading. Then rows.length picks success or empty. catch sets error.\n\nA common mistake is treating an empty list as an error spinner forever.",
      code: `let state = "loading";
fetch("/api/notes").then(function (r) { return r.json(); }).then(function (rows) {
  state = rows.length ? "success" : "empty";
}).catch(function () { state = "error"; });` },
    { id: 76, level: "intermediate", q: "pagination + filters + sort as a contract?",
      a: "Pagination, filters, and sort are a contract. Document param names, default sort, max limit, and cursor fields.\n\nThe frontend should not invent sort=name versus orderBy=name. Breaking the contract is a silent empty table. Validate unknown sort fields on the server so you do not SQL-inject a column name. Allow-list sort keys.\n\nIn the code: SORT maps created and name to real columns. Unknown sort falls back to created_at. The query uses that column plus LIMIT $1.\n\nA common mistake is ORDER BY req.query.sort with no allow-list.",
      code: `const SORT = { created: "created_at", name: "name" };
const sort = SORT[req.query.sort] || "created_at";
const q = "SELECT * FROM notes ORDER BY " + sort + " DESC LIMIT $1";
await db.query(q, [limit]);` },
    { id: 77, level: "intermediate", q: "search: DB like vs search engine?",
      a: "LIKE '%term%' often cannot use a normal btree well. Trigram, Postgres full-text, or a search engine like Meilisearch or Elasticsearch is for product search.\n\nStart with database full-text if the data is small. Rank, typos, and facets push you to a search product. Keep the primary data in SQL or Mongo. The engine is a copy.\n\nIn the code: ILIKE $1 with \"%\" + q + \"%\" on title, limited to 20 rows.\n\nA common mistake is ILIKE '%q%' on millions of rows with no index plan.",
      code: `await db.query(
  "SELECT id, title FROM posts WHERE title ILIKE $1 LIMIT 20",
  ["%" + q + "%"]
);` },
    { id: 78, level: "intermediate", q: "file vs object storage vs DB blobs?",
      a: "Do not store large files in Postgres. Use S3-compatible object storage and save the key. Local disk in a container disappears on restart.\n\nThumbnails can be derived and stored too. Backups of the database should not include movies. Homework apps can use disk. Production should not pretend disk is forever.\n\nIn the code: INSERT stores s3_key and size. Bytes live in object storage. presignGet builds a URL. The handler returns { url }.\n\nA common mistake is storing video bytes in a BYTEA column.",
      code: `await db.query("INSERT INTO files (s3_key, size) VALUES ($1, $2)", [key, bytes]);
// bytes live in object storage, not in the row
const url = s3.presignGet(key);
res.json({ url: url });` },
    { id: 79, level: "intermediate", q: "12-factor app highlights?",
      a: "Twelve-factor is a famous production checklist. One codebase. Declare dependencies. Config in env. Backing services as attached URLs. Stateless processes. Bind a port. Logs as streams.\n\nSticky local files break 12-factor. Put them in S3. You do not need to recite all twelve. Hit config, stateless, logs.\n\nIn the code: port and db come from env. app.listen(port). console.log(\"ready\") is a log stream.\n\nA common mistake is writing uploads to ./uploads on a machine that will be replaced.",
      code: `const port = process.env.PORT || 3000;
const db = process.env.DATABASE_URL;
app.listen(port);
console.log("ready"); // logs as a stream` },
    { id: 80, level: "advanced", q: "stateless app servers?",
      a: "Stateless app servers means any instance should serve any request. Sessions in Redis, uploads in S3, no \"only this machine has the file\".\n\nNeeded for horizontal scale and rolling deploys. In-memory rate limits break when you add a second process. WebSockets need a shared pub/sub too. This is 12-factor in one word: stateless.\n\nIn the code: redis.set stores the session. s3.put stores the file. Any Node process can read these next. Then { ok: true }.\n\nA common mistake is saving uploads on local disk in process A, then process B cannot find them.",
      code: `await redis.set("sess:" + sid, userId);
await s3.put(key, fileBuffer);
// any Node process can read these next
res.json({ ok: true });` },
    { id: 81, level: "intermediate", q: "horizontal vs vertical scale?",
      a: "Vertical scale means a bigger machine: more CPU and RAM. Simple, a ceiling exists. Horizontal scale means more boxes behind a load balancer.\n\nHorizontal needs statelessness and a shared database. Databases often scale vertical first, then replicas, then shards. The API tier is easy to scale horizontal if you did sessions right. Cost and failure domains differ.\n\nIn the code: many copies call app.listen on PORT. A balancer sends each request to one copy. GET /who answers \"any instance\".\n\nA common mistake is adding more API boxes while sessions still live only in one process's memory.",
      code: `// horizontal: many copies of the same listen()
app.listen(process.env.PORT);
// a balancer sends each request to one copy
app.get("/who", function (req, res) { res.send("any instance"); });` },
    { id: 82, level: "intermediate", q: "load balancer layer 4 vs 7?",
      a: "Layer 4 works at TCP. Fast, less HTTP-aware. Layer 7 sees paths, hosts, headers, can terminate TLS, sticky cookies.\n\nMost web apps use layer 7. Path routing /api versus / is L7. Health checks are usually HTTP on L7.\n\nIn the code: if the URL starts with /api, apiApp handles it. Otherwise staticApp. TLS and host headers also live at this layer.\n\nA common mistake is expecting a TCP balancer to route by /api path.",
      code: `// L7 idea: path decides the service
if (req.url.indexOf("/api") === 0) return apiApp(req, res);
return staticApp(req, res);
// TLS and host headers also live at this layer` },
    { id: 83, level: "beginner", q: "What is a CDN vs a load balancer?",
      a: "A CDN caches at the edge worldwide, close to users. A load balancer spreads live traffic across your origin instances.\n\nYou often use both: CDN for JS and CSS, balancer for /api. The CDN is not your database. Origin still does login and writes.\n\nIn the code: img is a cdn.example.com logo URL. api is api.example.com/me behind a balancer. console.log shows both. The comment says the CDN is not your database.\n\nA common mistake is putting writes through a CDN cache as if it were the API.",
      code: `const img = "https://cdn.example.com/logo.png"; // edge cache
const api = "https://api.example.com/me";       // balancer -> Node
console.log(img, api);
// CDN is not your database` },
    { id: 84, level: "intermediate", q: "how do you handle secrets in CI?",
      a: "CI secrets come from the repo's secret store. Prefer short-lived cloud roles over long-lived keys when you can.\n\nMask logs. Least privilege. Never print secrets. Leaked CI secrets are as bad as leaked .env. Rotate if they leak. This is a design rule, not a terminal how-to.\n\nIn the code: key is process.env.DEPLOY_KEY. Missing key throws. CI injects it. The source file never contains it. deploy(key) uses it.\n\nA common mistake is echoing the deploy key in CI logs \"to debug\".",
      code: `const key = process.env.DEPLOY_KEY;
if (!key) throw new Error("missing secret");
// CI injects DEPLOY_KEY; the source file never contains it
deploy(key);` },
    { id: 85, level: "intermediate", q: "infrastructure as code?",
      a: "Infrastructure as code means servers are described in files. Terraform, CloudFormation, Pulumi: environments become repeatable.\n\nReview infra changes like app changes. Clicking in a cloud console does not scale and cannot be diffed well. Your app still needs its own migrations. Start with the database, the app service, and the bucket.\n\nIn the code: infra lists app notes-api on 3000, a postgres notes db, and a notes-uploads bucket.\n\nA common mistake is a production database that exists only because someone clicked in a console last year.",
      code: `const infra = {
  app: { name: "notes-api", port: 3000 },
  db: { name: "notes", kind: "postgres" },
  bucket: { name: "notes-uploads" }
};` },
    { id: 86, level: "beginner", q: "Git workflow for a full stack feature?",
      a: "A full stack feature should keep frontend and API compatible in one change, or hide half behind a flag. Small steps, a review, then deploy. CI green first.\n\nDo not ship a UI that POSTs a field the API does not read yet without a plan. Screenshots help reviewers. So does a note of the JSON contract. This is about compatibility, not about command lists.\n\nIn the code: the UI POSTs { title } to /api/notes. The API has app.post(\"/api/notes\", express.json(), saveNote) so both agree on title.\n\nA common mistake is merging the React form a week before the API route exists, with no flag.",
      code: `// same feature: UI and API agree on { title }
await fetch("/api/notes", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: reqTitle })
});
app.post("/api/notes", express.json(), saveNote);` },
    { id: 87, level: "intermediate", q: "how do you roll back a bad release?",
      a: "Rollback means redeploy the previous artifact, revert the change, or flip a flag off. Database migrations must be backward compatible, or you need a down path.\n\nIf you dropped a column the old app still reads, rollback of code is not enough. Expand-contract saves you here. Practice once so the first outage is not theoretical.\n\nIn the code: GET /version returns process.env.RELEASE or \"dev\". The host runs the previous release artifact if this one is bad.\n\nA common mistake is a migration that cannot run backward, then a code rollback that crashes on the new schema.",
      code: `app.get("/version", function (req, res) {
  res.json({ version: process.env.RELEASE || "dev" });
});
// host runs the previous release artifact if this one is bad` },
    { id: 88, level: "advanced", q: "backward compatible API change?",
      a: "A backward compatible API change adds without breaking old apps. Add fields. Do not remove or rename. New query params are optional.\n\nNew endpoints for breaking changes. Deprecate with a date. Mobile apps update slowly. Version /v2 if you must break. Document it.\n\nIn the code: the JSON adds nickname. oldClient only reads name. newClient prefers nickname then name.\n\nA common mistake is renaming name to fullName overnight while old mobile builds still ship.",
      code: `res.json({ id: 1, name: "Ada", nickname: "A" });
// old UI ignores nickname; new UI can show it
const oldClient = function (u) { return u.name; };
const newClient = function (u) { return u.nickname || u.name; };` },
    { id: 89, level: "intermediate", q: "rate limiting and the UI?",
      a: "The API limits tries. The UI shows a kind message, backs off retries, and disables double submit on login.\n\nA spinner that retries in a hot loop makes the limit worse. Login is the most important form to protect. Share limits across Node processes with Redis. Tell the user when to retry if you send Retry-After.\n\nIn the code: if res.status is 429, the button is disabled and the UI shows \"Too many tries. Wait a bit.\"\n\nA common mistake is auto-retrying login 20 times a second after a 429.",
      code: `if (res.status === 429) {
  button.disabled = true;
  show("Too many tries. Wait a bit.");
}` },
    { id: 90, level: "intermediate", q: "idempotent retry from axios/fetch?",
      a: "Retry GET safely. Retry POST only with an idempotency key. Exponential backoff plus jitter so every client does not retry on the same millisecond.\n\n429 and 503 are retry-ish. 400 is not. The UI should not loop forever. Networks drop. Retries are normal. Double charge is not.\n\nIn the code: getSafe fetch-es a URL. On 503 it calls itself again. The comment says GET only in this toy.\n\nA common mistake is retrying POST /pay on every 503 with no idempotency key.",
      code: `async function getSafe(url) {
  const res = await fetch(url);
  if (res.status === 503) return getSafe(url); // GET only in this toy
  return res.json();
}` },
    { id: 91, level: "beginner", q: "What is JSON:API / a consistent error shape?",
      a: "A consistent error shape means every error looks the same. Pick { message, code, details } and stick to it.\n\nThe UI maps that to one toast. HTTP status stays the class, 4xx versus 5xx. If each route invents { err } versus { error } versus { msg }, the frontend becomes spaghetti. Document 401 and 404 too. JSON:API is one standard. A small house style is enough for many teams.\n\nIn the code: fail(res, status, message) sends { message, code }. fail(res, 400, \"title required\") uses it.\n\nA common mistake is a different error JSON on every route.",
      code: `function fail(res, status, message) {
  return res.status(status).json({ message: message, code: status });
}
fail(res, 400, "title required");` },
    { id: 92, level: "intermediate", q: "internationalization full stack?",
      a: "Internationalization means languages and locales. UI strings live in i18n files. Locale from Accept-Language or the path.\n\nThe server formats dates and money carefully. Store UTC in the database. Do not concatenate sentences in code if the grammar will break in other languages. APIs can return locale-neutral codes and let the UI translate. Currency rounding belongs in well-tested functions.\n\nIn the code: t has en Hello and hi Namaste. lang from query defaults to en. The JSON returns t[lang].hello. Dates stay UTC.\n\nA common mistake is storing \"Hello Ada\" already translated in the database for every language.",
      code: `const t = { en: { hello: "Hello" }, hi: { hello: "Namaste" } };
const lang = req.query.lang || "en";
res.json({ hello: t[lang].hello });
// store dates in UTC; translate words in the UI files` },
    { id: 93, level: "intermediate", q: "timezones?",
      a: "Store timestamps in UTC. Render in the user's zone in the UI. Never store a \"local\" time without a zone if it is a real instant.\n\nDST makes naive local times jump. created_at in the database should be timestamptz or an ISO Z string. Everyone has shipped a bug here.\n\nIn the code: created is toISOString, a UTC instant. The JSON sends createdAt. The UI comment uses toLocaleString with userTz. stored is an example Z string.\n\nA common mistake is saving \"9:00\" with no timezone and treating it as the same instant worldwide.",
      code: `const created = new Date().toISOString(); // UTC instant
res.json({ createdAt: created });
// UI: new Date(createdAt).toLocaleString(undefined, { timeZone: userTz })
const stored = "2026-09-01T18:00:00.000Z";` },
    { id: 94, level: "advanced", q: "how would you design a URL shortener?",
      a: "A URL shortener needs an API to create and resolve. Hash or counter plus encoding. 301 or 302 redirect.\n\nStore in SQL or Redis. Cache hot keys. Analytics async. Unique index on the code. Mention collisions and custom aliases. The UI is a form and a copy button. The API is the real product. Rate limit create so nobody fills your table.\n\nIn the code: POST /short makes a code, INSERTs code and url, returns { code }. GET /:code finds the row and redirects.\n\nA common mistake is no unique index on code, so two inserts share a code.",
      code: `app.post("/short", async function (req, res) {
  const code = makeCode();
  await db.query("INSERT INTO links (code, url) VALUES ($1, $2)", [code, req.body.url]);
  res.json({ code: code });
});
app.get("/:code", async function (req, res) {
  const row = await db.findLink(req.params.code);
  res.redirect(row.url);
});` },
    { id: 95, level: "advanced", q: "how would you design a news feed?",
      a: "A news feed can start simple: query posts by people you follow with an index. At scale, fan-out on write pushes to each follower timeline, or you keep querying on read.\n\nPaginate with cursors. Cache the timeline. Rank later. The UI is infinite scroll. The hard part is the index and the fan-out cost. Say you would start simple.\n\nIn the code: SELECT posts where author_id is ANY(followingIds), ORDER BY id DESC LIMIT 20.\n\nA common mistake is loading every post in the world and filtering follows in the app.",
      code: `const rows = await db.query(
  "SELECT * FROM posts WHERE author_id = ANY($1) ORDER BY id DESC LIMIT 20",
  [followingIds]
);` },
    { id: 96, level: "advanced", q: "how would you design file sharing like Drive?",
      a: "File sharing like Drive needs nodes plus permissions plus bytes. Object storage for files. A table of user, resource, role. Presigned downloads.\n\nVirus scan, versions, audit log. The UI is a tree. The API is nodes and ACLs. An ACL is who may read or own a file. IDOR is the bug: never trust folder ids without an ACL check. Sharing a link is another permission row. Metadata in SQL, bytes in S3.\n\nIn the code: the ACL query checks user_id, file_id, and role in read or own. No row means 404. Then it returns a presigned GET URL.\n\nA common mistake is presigning any key the client sends without an ACL check.",
      code: `const ok = await db.query(
  "SELECT 1 FROM acls WHERE user_id = $1 AND file_id = $2 AND role IN ('read', 'own')",
  [req.user.id, req.params.id]
);
if (!ok.rows[0]) return res.status(404).end();
res.json({ url: s3.presignGet(file.key) });` },
    { id: 97, level: "intermediate", q: "accessibility is a full stack issue?",
      a: "Accessibility is not only CSS. The UI needs correct HTML, labels, focus, and alt text.\n\nThe API and CMS must send language, status messages, and image alts, not empty strings for real pictures. A 200 with no message still needs a live region for screen readers on error. Do not ship image1.png as the only description. Full stack means the JSON includes alt.\n\nIn the code: the JSON has src on the CDN and alt \"A grey cat asleep on a keyboard\".\n\nA common mistake is returning images with empty alt and calling a11y a frontend-only job.",
      code: `res.json({
  src: "https://cdn.example.com/cat.jpg",
  alt: "A grey cat asleep on a keyboard"
});` },
    { id: 98, level: "intermediate", q: "performance budget?",
      a: "A performance budget is a target you set on purpose: TTFB, LCP, JS kilobytes. Measure with Lighthouse and real users.\n\nSplit code, compress images, cache public GETs. A new chart library can blow the budget. That is a product decision. The API budget is TTFB and payload size too. Fix the biggest chart first.\n\nIn the code: Cache-Control public max-age=60 on thinList JSON. budget is lcpMs 2500 and jsKb 150.\n\nA common mistake is adding a huge library for one chart and ignoring the JS kilobyte cap.",
      code: `res.setHeader("Cache-Control", "public, max-age=60");
res.json({ products: thinList }); // small JSON, cacheable if public
// a huge new library can blow the JS kilobyte budget
const budget = { lcpMs: 2500, jsKb: 150 };` },
    { id: 99, level: "beginner", q: "What is the difference between PUT from the UI and a form POST?",
      a: "HTML forms natively submit GET or POST. They do not send PUT, PATCH, or DELETE. SPAs use fetch and can send those verbs.\n\nSome old hosts are picky. You may tunnel with POST plus a method override header. Your Express routes can still be PUT. The UI must use fetch, not a raw form, unless you override. This surprises people who only know HTML forms.\n\nIn the code: fetch PUTs /api/notes/1 with JSON { title: \"New\" }.\n\nA common mistake is wrapping a PUT route in a normal HTML form and wondering why it became GET.",
      code: `await fetch("/api/notes/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "New" })
});` },
    { id: 100, level: "advanced", q: "How do you talk through a full stack feature in an interview?",
      a: "Talk through a full stack feature as a story. User story, UI states, API contract, data model and indexes, who is allowed, tests, deploy and logs.\n\nCall out one trade-off you would revisit at scale. Do not only draw React boxes. Do not only draw tables. Empty, error, and loading belong in the UI part. IDOR belongs in the authz part. End with how you would know it broke in production.\n\nIn the code: CreateNote and Note are the contract on the board. POST /api/notes uses needLogin, validate(CreateNote), then saveNote.\n\nA common mistake is only explaining the React component and skipping who is allowed to save.",
      code: `// contract you would write on the board
const CreateNote = { title: "string" };
const Note = { id: "number", title: "string" };
app.post("/api/notes", needLogin, validate(CreateNote), saveNote);` },
  ]
};
