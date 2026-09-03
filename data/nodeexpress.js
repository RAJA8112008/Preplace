window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA.nodeexpress = {
  notes: [
    { title: "What Node is", body: "The problem before\nYou write JavaScript that only lives in a web page. The browser cannot open files, listen on a port, or keep a database password. You wanted one language for the kitchen as well as the dining room.\n\nWhat this is\nNode.js is a program that runs JavaScript on your computer, not only inside a browser. It uses the V8 engine to run JS. libuv handles async I/O: waiting on files and network without freezing the whole process. Node is not a new language. Express is a helper library you add later.\n\nWhat it solves\nYou can build APIs, CLIs, and servers in JavaScript. Network waits do not freeze the cook. One language sits on both sides of the counter.\n\nReal-life example\nThe dining room is the browser. The kitchen is Node. Guests never walk into the kitchen. They send an order (HTTP) and wait for a plate.\n\nUses\nREST APIs, websockets, build tools, scripts. Interviewers ask Node vs the browser, Node vs Express, and when Node is a bad fit.\n\nWatch out\nCalling Node a language or mixing it up with Express. CPU-heavy work blocks the event loop unless you offload it. Node is great at waiting, not at crunching numbers on the main thread." },
    { title: "Event loop", body: "The problem before\nOne slow file read freezes every other customer. You think JavaScript in Node is many threads, so a huge math loop should still answer other requests. It does not.\n\nWhat this is\nJavaScript in Node runs on one main thread. The event loop is how Node comes back when a wait finishes. Phases include timers, pending callbacks, poll, check for setImmediate, and close. process.nextTick and promises run between phases.\n\nWhat it solves\nYou start a wait, serve someone else, then come back. A stuck API is often blocking work, not a slow computer. You can say the order of logs in an interview.\n\nReal-life example\nOne cook, one stove. Start the rice (async I/O), take the next ticket, then plate the rice when the timer dings. Standing and stirring a huge pot of math means nobody else gets food.\n\nUses\nExplaining why readFile does not freeze the shop. Why a tight loop in a route hangs everyone. nextTick vs setImmediate vs setTimeout(0).\n\nWatch out\nreadFileSync in every Express route. A giant for-loop in a handler. Thinking async means unlimited extra cooks for CPU work." },
    { title: "Modules", body: "The problem before\nTwo files dump helpers onto the same global. Load order is a guess. You copy-paste a function into every file.\n\nWhat this is\nA module is a file that exports names. CommonJS uses require and module.exports. ESM uses import and export, often with type module in package.json. require can sit inside an if. import is listed at the top and checked before the file runs.\n\nWhat it solves\nYou share code on purpose. Two files can both have add. The project type decides which style is natural. In interviews you say you can read both, because real repos mix them during upgrades.\n\nReal-life example\nA labeled spice tin you pass across the counter, not one chalkboard every cook writes on. CommonJS is grabbing the tin when you need it. ESM is listing the tins at the start of the recipe.\n\nUses\nEvery Node file. Splitting routes and services. Publishing a package. Named exports when the API will grow.\n\nWatch out\nMixing import and require in one file without setting the module type. exports = fn instead of module.exports = fn. Expecting require to re-run the file every time — it is cached." },
    { title: "npm", body: "The problem before\nYou rewrite login, dates, and HTTP from zero. A teammate installs a different Express than you. node_modules is in git and the repo is huge.\n\nWhat this is\nnpm is how Node projects share packages. A package is a folder of JavaScript someone else wrote. package.json lists scripts and dependencies. Semver is MAJOR.MINOR.PATCH with ranges like caret and tilde. A lockfile pins exact versions. npx runs a package command.\n\nWhat it solves\nInstall the same toolbox on every laptop and in CI. Scripts name how you start and test. peerDependencies are what a plugin expects the host to already have.\n\nReal-life example\nA shared kitchen catalog. package.json is the shopping list with ranges. The lockfile is the exact receipt from last week's market. Do not check the whole fridge (node_modules) into the office binder.\n\nUses\nAdding Express, running start and test, pinning versions, explaining caret vs tilde, lockfiles for apps.\n\nWatch out\nNever commit node_modules. Do commit the lockfile for apps. Putting Express only in devDependencies. A tiny helper that pulls 200 unknown packages." },
    { title: "Express core", body: "The problem before\nYou write a raw http.createServer and a giant if/else on every URL. JSON, errors, and login are copy-pasted into each branch.\n\nWhat this is\nExpress is a small toolkit for websites and APIs on Node. app.use adds middleware. app.get and app.post add routes. req is the request and res is the response. next(err) jumps to error handling. Order matters.\n\nWhat it solves\nYou say: when someone visits this URL with this verb, run this function. Keep routes thin: read input, call a service, send JSON. Express does not pick your database or login for you.\n\nReal-life example\nA ticket counter with labeled windows. GET /orders is window 1. POST /orders is window 2. The line of desks before the window is middleware.\n\nUses\nREST APIs, JSON servers, SPA fallback plus /api. The default interview backend.\n\nWatch out\nThinking Express includes a database. Fat 400-line routes that also talk to SQL. Forgetting listen so the browser cannot connect." },
    { title: "Middleware", body: "The problem before\nEvery route repeats log, parse JSON, check login. Or a function neither sends a reply nor calls next, and the browser waits forever.\n\nWhat this is\nMiddleware is a function (req, res, next) that runs in the middle of a request. Used for logging, auth, parsing, CORS. If you want the next step, call next(). If you already sent a reply, do not call next(). Error middleware has four args: err, req, res, next. Express counts the arguments.\n\nWhat it solves\nShared steps sit once at the top. A 404 handler belongs near the bottom, after real routes. Login checks sit above private routes.\n\nReal-life example\nA line of desks at the shop: stamp the ticket (log), check the bag (JSON), check the pass (auth), then the counter. Drop the ticket and walk away — no next, no res — and the guest stands forever.\n\nUses\nexpress.json, helmet, cors, needLogin, the four-arg error handler, a 404 at the bottom.\n\nWatch out\nAuth mounted after the secret route. next() after res.json. A three-arg handler that never sees next(err). Middleware that hangs." },
    { title: "REST APIs", body: "The problem before\nGET /users/5/delete removes a row. Status is always 200 with { error: \"no\" }. Secrets sit in the URL. The UI guesses field names.\n\nWhat this is\nREST names resources with URLs and uses HTTP verbs. GET reads, POST creates, PUT replaces, PATCH patches, DELETE removes. Use correct status codes. JSON bodies, validation, pagination. Idempotent PUT and DELETE mean repeats look like one change.\n\nWhat it solves\nThe UI and the server share a contract. GET should not secretly delete. Document the JSON shape. Pagination returns a page, not the whole table.\n\nReal-life example\nA menu with dish names (URLs) and actions (verbs). You do not GET-delete a dosa. 201 means the kitchen made a new plate. 404 means that dish is not on the board.\n\nUses\nCRUD APIs, mobile and web sharing routes, interview status-code questions, idempotency on PUT and DELETE.\n\nWatch out\nSecrets in query strings. POST for an update that should be PUT or PATCH. 200 on failure. Uncapped limit=1000000." },
    { title: "Env & config", body: "The problem before\nThe production database URL is hard-coded. .env is in git with real passwords. The app crashes at 3pm because PORT was missing and nobody noticed at boot.\n\nWhat this is\nprocess.env holds environment variables: settings the system injects. Values are strings until you convert them. dotenv copies a local .env file into process.env in development. Production should get env from the host, not a committed file.\n\nWhat it solves\nLaptop, staging, and live can use different databases without changing code. Secrets stay out of the source. Validate required vars at boot so you fail fast.\n\nReal-life example\nThe kitchen recipe says use the salt on the shelf (process.env), not the jar in Ada's bag. On your laptop the shelf is a .env card. In the real shop the manager fills the shelf. Never photocopy the real card into the public cookbook.\n\nUses\nPORT, DATABASE_URL, JWT_SECRET. .env.example with fake values. Host secret managers in production.\n\nWatch out\nCommitting .env. Printing secrets in logs. Putting a private key in a frontend VITE_ variable. Skipping boot checks because it worked on your laptop." },
    { title: "Errors", body: "The problem before\nA rejected promise in Express 4 never sends a reply. The client gets a stack trace. Every route has its own try/catch that leaks details.\n\nWhat this is\nUse a central error handler with four arguments. 4xx means the client did something wrong. 5xx means the server failed. Async errors must reach next(err). Wrap async routes so rejected promises call next. Log the real error on the server. Send a short message to the client.\n\nWhat it solves\nOne JSON error shape. Production hides stacks. The UI can show a toast without parsing ten formats.\n\nReal-life example\nIf the stove catches fire, tell the manager the full story in the log book. Tell the guest something went wrong plus a ticket number, not the gas-pipe diagram.\n\nUses\nnext(err), wrap(async route), 400 validation, 401 and 403, a 500 fallback, request ids on errors.\n\nWatch out\nLeaking stacks in production. async (req, res) => { await db... } with no catch in Express 4. 200 { error: \"no\" }. 401 when you meant 403." },
    { title: "Security", body: "The problem before\nPasswords sit in the table as text. origin * with cookies. SQL built with string glue. /orders/124 shows someone else's order because you only checked the id in the URL.\n\nWhat this is\nhelmet sets safer HTTP headers. CORS should be an allowlist of real UI origins, not a wildcard with cookies. Rate limits stop guessing passwords. Hash passwords with bcrypt or argon2. Parameterized queries stop SQL injection. Use HTTPS. HttpOnly cookies hide session ids from JavaScript. Authorization still checks who owns this id.\n\nWhat it solves\nYou close the common doors: injection, cookie theft, CSRF, brute force, IDOR. Headers are a start. They are not the whole house.\n\nReal-life example\nLock the shop door (HTTPS). Do not shout the passcode (hash). Check the ticket matches the guest (authorization). Do not let a stranger's note become a kitchen command (SQL params). A sign on the door (helmet) does not replace checking IDs.\n\nUses\nLogin, cookies, CORS, helmet, rate limits, parameterized SQL, owner checks on every id.\n\nWatch out\nSHA-256 for passwords. User.findOne(req.body). findById with no owner check. helmet without authorization. SameSite None without Secure." },
    { title: "Streams", body: "The problem before\nYou readFile a 2 GB log into one string and the process dies. You write() in a tight loop to a slow pipe and memory grows forever.\n\nWhat this is\nA stream is a flow of chunks: readable, writable, or transform. pipe connects a source to a sink. Backpressure is how the sip slows down when you cannot swallow yet. HTTP bodies and big files should stream. readFile is fine for a small config.\n\nWhat it solves\nYou copy huge files without holding them all in RAM. The user can start receiving a video before the disk is done. pipe handles a lot of pause and resume for you.\n\nReal-life example\nA hose into a bucket, not dumping the whole tank at once. If the bucket is full, you pinch the hose (backpressure) instead of flooding the floor.\n\nUses\ncreateReadStream piped to res, file copy, upload pipelines, transform streams.\n\nWatch out\nreadFile of a video. Treating a PNG Buffer as a UTF-8 string. A loop of write() with no drain check on a slow destination." },
    { title: "Process", body: "The problem before\nOne Node process on an 8-core box uses one main JavaScript thread. SIGTERM kills in-flight checkouts. The load balancer keeps sending traffic to a process that lost the database.\n\nWhat this is\ncluster or a process manager like PM2 can run more than one Node process for multi-core. A single Node process uses one main JavaScript thread. Graceful shutdown: stop accepting, drain in-flight requests, close the database, then exit. Health checks tell the host if you are alive or ready. On Kubernetes the platform restarts pods.\n\nWhat it solves\nMore cores can take more tickets. Deploys do not cut guests mid-order. Liveness is this cook is standing. Readiness is the stove is hot and the fridge is open.\n\nReal-life example\nSeveral cooks sharing one shop door (the port). When closing time comes, stop taking new tickets, finish the plates on the pass, turn off the stove, then lock up. Do not pull the plug while a dosa is on the tava.\n\nUses\nPM2 or Kubernetes, SIGTERM, /healthz vs /ready, cluster.fork, draining HTTP servers.\n\nWatch out\nIn-memory sessions that each worker cannot see. process.exit(0) immediately. A heavy DB query as the only liveness check, so a DB blip restart-storms you. PM2 plus Kubernetes both restarting in a fight." },
  ],
  questions: [
    { id: 1, level: "beginner", q: "What is Node.js?",
      a: "Node.js is a program that runs JavaScript on your computer, not only inside a web page. A browser can show a site. Node can be the server that answers that site.\n\nNode is not a new language. JavaScript is still the language. Node is also not Express. Express is a helper library you can add later. People learn Node so they can build APIs, tools, and backends with JavaScript.\n\nIn the code: require(\"http\") loads Node's HTTP module. createServer sends \"Hello from Node\" with res.end. listen(3000) waits for visitors.\n\nA common mistake is calling Node a language or mixing it up with Express.",
      code: `// this file runs in Node, not in the browser
const http = require("http");

const server = http.createServer(function (req, res) {
  res.end("Hello from Node"); // send text back
});

server.listen(3000); // wait for visitors` },
    { id: 2, level: "beginner", q: "What is npm?",
      a: "npm is the usual way Node projects share and reuse code. A package is a folder of JavaScript someone else wrote, a ready-made toolbox.\n\nnpm also names the public website where those packages live. Your project lists its tools in package.json so others can get the same set. Almost every Node job uses packages instead of writing everything from zero.\n\nIn the code: pkg has name my-api and dependencies.express ^4.19.0. console.log prints that version range.\n\nA common mistake is treating npm as a second programming language.",
      code: `// package.json says which packages this app needs
const pkg = {
  name: "my-api",
  dependencies: {
    express: "^4.19.0" // needed when the server runs
  }
};

console.log(pkg.dependencies.express);` },
    { id: 3, level: "beginner", q: "What is package.json?",
      a: "package.json is the ID card of a Node project. It stores the name, version, start scripts, and the list of packages.\n\nWhen someone copies your project, this file tells them what to install. Without it, Node does not know how the project is meant to start. Keep it in your project root and treat it as important source, not junk.\n\nIn the code: name notes-api, version 1.0.0, main index.js, scripts.start node index.js, dependencies express 4.19.2.\n\nA common mistake is deleting package.json because it looked like config junk.",
      code: `const packageJson = {
  name: "notes-api",
  version: "1.0.0",
  main: "index.js",
  scripts: {
    start: "node index.js" // how we start the app
  },
  dependencies: { express: "4.19.2" }
};` },
    { id: 4, level: "beginner", q: "dependencies vs devDependencies?",
      a: "dependencies are packages the live app needs, like Express. devDependencies are only for building, testing, or checking code while you work.\n\nA production machine can skip the dev list to stay smaller and safer. If you put a test tool in dependencies, you ship extra code you do not need. If you put Express only in devDependencies, the live server can break.\n\nIn the code: dependencies.express is needed to answer web requests. devDependencies.eslint is only used while writing code.\n\nA common mistake is putting Express only in devDependencies.",
      code: `const packageJson = {
  dependencies: {
    express: "4.19.2" // needed to answer web requests
  },
  devDependencies: {
    eslint: "8.57.0" // only used while writing code
  }
};` },
    { id: 5, level: "beginner", q: "What is a lockfile?",
      a: "package.json often allows a range of versions, like 4.x. The lockfile writes down the exact versions that were installed.\n\nThat way your laptop and a teammate's laptop get the same tree. For an app, you keep the lockfile with the project. Without it, a later install might pull a slightly different package and surprise you.\n\nIn the code: lock.packages[\"node_modules/express\"].version is 4.19.2. console.log prints that exact pin.\n\nA common mistake is gitignoring package-lock.json in an application.",
      code: `// lockfile idea: pin the exact version that was tested
const lock = {
  name: "notes-api",
  packages: {
    "node_modules/express": { version: "4.19.2" }
  }
};

console.log(lock.packages["node_modules/express"].version);` },
    { id: 6, level: "beginner", q: "What is the event loop in Node?",
      a: "JavaScript in Node runs on a single line of work. When you wait for a file or a network reply, Node does not freeze forever.\n\nIt starts the wait, then serves someone else, then comes back when the result is ready. That coming-back system is the event loop. If you do a huge math loop, everyone else waits. A stuck API is often blocking work.\n\nIn the code: console.log 1, setTimeout 0 logs 3 later, console.log 2. 1 then 2 print first. 3 waits for the loop to be free.\n\nA common mistake is a tight CPU loop inside a request handler.",
      code: `console.log("1. take the order");

setTimeout(function () {
  console.log("3. food is ready (later)");
}, 0);

console.log("2. take the next order");
// 1 then 2 print first. 3 waits for the loop to be free.` },
    { id: 7, level: "beginner", q: "blocking vs non-blocking?",
      a: "Blocking code finishes the whole job before anything else can run. Non-blocking code starts the job and lets Node do other work until it finishes.\n\nReading a file the blocking way stands at the printer until every page is done. The non-blocking way presses print and helps the next customer. On a server, blocking file or CPU work makes every user wait. Prefer the async style so one slow file does not freeze the whole API.\n\nIn the code: readFileSync waits until the file is fully read. readFile takes a callback and lets Node do other work.\n\nA common mistake is readFileSync in every Express route.",
      code: `const fs = require("fs");

// blocking: nothing else runs until this finishes
const text = fs.readFileSync("notes.txt", "utf8");

// non-blocking: Node can do other work, then call this
fs.readFile("notes.txt", "utf8", function (err, data) {
  console.log(data);
});` },
    { id: 8, level: "beginner", q: "What is libuv?",
      a: "libuv is a C library that Node uses under the hood. It runs the event loop and talks to the operating system for files, timers, and network.\n\nSome heavy jobs, some file and crypto work, go to a small worker pool. You rarely write libuv code yourself. Node wraps it for you. V8 runs JavaScript. libuv does I/O.\n\nIn the code: fs.readFile reads photo.jpg. Your function runs when bytes are ready. Behind the scenes libuv talks to the OS.\n\nA common mistake is thinking async JavaScript means unlimited extra threads for every job.",
      code: `const fs = require("fs");

// JavaScript you write
fs.readFile("photo.jpg", function (err, bytes) {
  console.log("file size", bytes.length);
});

// behind the scenes: libuv talks to the OS
// then Node calls your function when bytes are ready` },
    { id: 9, level: "beginner", q: "require vs import?",
      a: "require is the older CommonJS style. It runs right away and can sit inside an if. import is the newer ES module style. It is listed at the top and checked before the file runs.\n\nMany older tutorials use require. New projects often use import. The project type, module versus commonjs, decides which one is natural. In interviews, say you can read both, because real codebases mix them during upgrades.\n\nIn the code: require(\"path\") and path.join(__dirname, \"data\"). The commented import shows the ESM style.\n\nA common mistake is mixing import and require in one file without setting the module type.",
      code: `// CommonJS (require)
const path = require("path");
const folder = path.join(__dirname, "data");

// ES modules (import) look like this in a .mjs file
// import path from "path";
console.log(folder);` },
    { id: 10, level: "beginner", q: "module.exports vs exports?",
      a: "module.exports is the real object that require() gives back. exports starts as a shortcut pointing at the same object.\n\nYou can add fields on exports, like exports.add = add. If you write exports = function () {}, you break the shortcut and the other file gets {}. To export one function, set module.exports = thatFunction.\n\nIn the code: add returns a + b. module.exports = add. The comment also shows exports.add = add.\n\nA common mistake is exports = add, which does not change what require receives.",
      code: `function add(a, b) {
  return a + b;
}

// good: the whole module is this function
module.exports = add;

// also good: named tools on the same object
// exports.add = add;` },
    { id: 11, level: "beginner", q: "What is Express?",
      a: "Express is a small toolkit for building websites and APIs on Node. It helps you say: when someone visits this URL with GET or POST, run this function.\n\nIt also has middleware, which are steps that run before your final answer. Express does not pick your database, login system, or front-end for you. People like it because it is common, readable, and easy to start with.\n\nIn the code: express() creates the app. GET /hello returns JSON Hi from Express. listen(3000) starts the server.\n\nA common mistake is thinking Express includes a database.",
      code: `const express = require("express");
const app = express();

app.get("/hello", function (req, res) {
  res.json({ message: "Hi from Express" });
});

app.listen(3000);` },
    { id: 12, level: "beginner", q: "How do you start an Express server?",
      a: "You create an app, add at least one route, then call listen on a port. A port is a numbered door on the computer, like 3000.\n\nIn real apps the port often comes from process.env.PORT so hosting can choose it. Inside Docker or a cloud box, listen on 0.0.0.0 so the outside world can reach you. Until listen runs, the routes exist only in memory and nobody can visit them.\n\nIn the code: port is PORT or 3000. GET / sends Shop is open. app.listen(port) starts taking requests.\n\nA common mistake is forgetting listen and wondering why the browser cannot connect.",
      code: `const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", function (req, res) {
  res.send("Shop is open");
});

app.listen(port); // start taking requests` },
    { id: 13, level: "beginner", q: "What is middleware?",
      a: "Middleware is a function that runs in the middle of a request. It can log, check a login, read JSON, or stop the request with an error.\n\nThe usual shape is function (req, res, next). If you want the next step to run, you call next(). If you already sent a reply, you do not call next(). Each desk in a line is middleware.\n\nIn the code: logger prints method and url, then next(). app.use(logger) runs it. GET /ping sends pong.\n\nA common mistake is middleware that neither calls next() nor sends a response.",
      code: `function logger(req, res, next) {
  console.log(req.method, req.url); // see the visit
  next(); // go to the next function
}

app.use(logger);
app.get("/ping", function (req, res) {
  res.send("pong");
});` },
    { id: 14, level: "beginner", q: "What does next() do?",
      a: "next() says I am done with my part, please run the next matching function. If nobody calls next() and nobody sends a response, the browser waits forever.\n\nnext(err) is special: it jumps to error-handling middleware. A normal next() with no argument means success, keep going. Dropping the baton, forgetting next and res, is a common beginner bug.\n\nIn the code: needName calls next(new Error(...)) if name is missing. Otherwise next(). POST /users then JSON saved.\n\nA common mistake is calling next() after you already sent res.json.",
      code: `function needName(req, res, next) {
  if (!req.body.name) {
    return next(new Error("name is missing")); // jump to error handler
  }
  next(); // all good, continue
}

app.post("/users", needName, function (req, res) {
  res.json({ saved: req.body.name });
});` },
    { id: 15, level: "beginner", q: "req.params vs query vs body?",
      a: "req.params is pieces of the path, like /users/5 giving id 5. req.query is the extra bit after ?, like ?page=2. req.body is the payload of POST or PUT, often JSON, after a parser runs.\n\nGET usually has no body. POST and PUT usually do. If body is undefined, you probably forgot express.json().\n\nIn the code: express.json() first. PUT /users/:id reads params.id, query.page, body.name.\n\nA common mistake is reading req.body before express.json() runs.",
      code: `app.use(express.json());

app.put("/users/:id", function (req, res) {
  const id = req.params.id;     // from /users/5
  const page = req.query.page;  // from ?page=2
  const name = req.body.name;   // from JSON body
  res.json({ id: id, page: page, name: name });
});` },
    { id: 16, level: "intermediate", q: "Why is middleware order important?",
      a: "Express runs matching middleware from top to bottom. A JSON parser must sit above routes that read req.body, or the body is empty.\n\nA login check must sit above private routes, or strangers get in. A 404 handler belongs near the bottom, after real routes. When a bug feels random, look at the order first.\n\nIn the code: express.json() first. needLogin checks authorization and may 401. GET /secret runs after the checks.\n\nA common mistake is mounting the auth check after the secret route.",
      code: `app.use(express.json()); // 1. read JSON first

app.use(function needLogin(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "log in" });
  }
  next();
});

app.get("/secret", function (req, res) {
  res.json({ ok: true }); // 2. this runs after the checks
});` },
    { id: 17, level: "intermediate", q: "How do you handle async errors in Express?",
      a: "If a promise rejects and nobody catches it, Express 4 may never send a nice error. Wrap the route so you call next(err) when something throws.\n\nThen your four-argument error middleware can send a safe JSON message. Newer Express 5 is kinder to rejected promises, but many apps still wrap. Never leave a floating promise with no catch on a server.\n\nIn the code: wrap returns a function that Promise.resolve(fn).catch(next). GET /users/:id awaits db.findUser.\n\nA common mistake is async (req, res) => { await db... } with no catch in Express 4.",
      code: `function wrap(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

app.get("/users/:id", wrap(async function (req, res) {
  const user = await db.findUser(req.params.id); // may throw
  res.json(user);
}));` },
    { id: 18, level: "intermediate", q: "error-handling middleware signature?",
      a: "Error middleware must have four parameters: err, req, res, next. Express counts the arguments. Three means normal. Four means error.\n\nInside, log the real error on the server. Send a short message to the client. Use err.status if you set one, otherwise 500. Do not send the stack trace to strangers in production.\n\nIn the code: the four-arg function logs err.message, picks status, and hides 500 details.\n\nA common mistake is a three-arg handler that never sees next(err).",
      code: `app.use(function (err, req, res, next) {
  console.error(err.message); // keep details on the server
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? "Something went wrong" : err.message
  });
});` },
    { id: 19, level: "intermediate", q: "What is express.json()?",
      a: "express.json() is built-in middleware that reads a JSON body and puts it on req.body. The client must send Content-Type application/json.\n\nYou should set a size limit so a huge body cannot fill memory. It does not read file uploads. Those use multipart, which needs other tools. Put it before routes that need req.body.\n\nIn the code: express.json({ limit: \"10kb\" }). POST /notes reads req.body.title and returns 201.\n\nA common mistake is a JSON API with no size limit.",
      code: `app.use(express.json({ limit: "10kb" })); // refuse huge JSON

app.post("/notes", function (req, res) {
  const title = req.body.title; // { "title": "Buy milk" }
  res.status(201).json({ title: title });
});` },
    { id: 20, level: "intermediate", q: "How do you handle file uploads?",
      a: "A normal JSON parser cannot read multipart/form-data. You use a library such as multer to take the file from the request.\n\nCheck type and size. Do not trust the original file name as a disk path. Save to disk or cloud storage, then store only the path or key in your database. Never let a user pick a path like ../../secret.txt.\n\nIn the code: multer dest uploads, fileSize 2MB. POST /photo upload.single(\"photo\") returns saved filename.\n\nA common mistake is saving the original filename as a path.",
      code: `const multer = require("multer");
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 2 * 1024 * 1024 } // 2 MB
});

app.post("/photo", upload.single("photo"), function (req, res) {
  res.json({ saved: req.file.filename });
});` },
    { id: 21, level: "intermediate", q: "What is CORS and how do you set it in Express?",
      a: "CORS is a browser rule: a page on one origin may not read another origin unless the server agrees. An origin is scheme plus host plus port, like http://localhost:5173.\n\nIn Express you send Access-Control-Allow-Origin for the sites you trust. Allowing * with cookies is unsafe. List real front-end URLs. Postman is not a browser, so it will not show this error.\n\nIn the code: cors origin localhost:5173 credentials true. GET /me returns { name: Ada }.\n\nA common mistake is origin * with credentials true.",
      code: `const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173", // only this UI
  credentials: true
}));

app.get("/me", function (req, res) {
  res.json({ name: "Ada" });
});` },
    { id: 22, level: "intermediate", q: "What is helmet?",
      a: "Helmet is middleware that sets extra HTTP headers that help safety. Examples include stopping some click-jacking and hiding that you use Express.\n\nIt is a good default, not a full security plan. You still need login checks, validation, and HTTPS. Add it near the top of the middleware list.\n\nIn the code: app.use(helmet()) then GET / sends ok.\n\nA common mistake is installing helmet and skipping authorization.",
      code: `const helmet = require("helmet");
const app = express();

app.use(helmet()); // sets safer default headers

app.get("/", function (req, res) {
  res.send("ok");
});` },
    { id: 23, level: "intermediate", q: "How do you structure an Express app?",
      a: "A common split is routes, controllers, services, models, and middleware. Routes should stay thin: read input, call a service, send JSON.\n\nBusiness rules belong in services, not inside res.json callbacks. Feature folders, users/, orders/, also work if each feature stays small. If every file talks to the database and HTTP at once, tests get hard.\n\nIn the code: routes/users.js GET /:id calls userService.findById and res.json. module.exports = router.\n\nA common mistake is a 400-line route file that also talks to SQL.",
      code: `// routes/users.js — thin HTTP layer
const express = require("express");
const router = express.Router();

router.get("/:id", async function (req, res) {
  const user = await userService.findById(req.params.id);
  res.json(user);
});

module.exports = router;` },
    { id: 24, level: "intermediate", q: "Router in Express?",
      a: "A router is a mini-app with its own routes and middleware. You build userRouter, then mount it at /api/users.\n\nThat keeps index.js short and lets you add login only on some groups. When a file grows past a few routes, split a router.\n\nIn the code: userRouter GET / returns a list. app.use(\"/api/users\", userRouter) so GET /api/users hits the router.\n\nA common mistake is putting every path on the main app object.",
      code: `const express = require("express");
const userRouter = express.Router();

userRouter.get("/", function (req, res) {
  res.json([{ id: 1, name: "Ada" }]);
});

app.use("/api/users", userRouter);
// GET /api/users now hits the router` },
    { id: 25, level: "intermediate", q: "REST status codes you should know?",
      a: "200 means success with a body. 201 means created. 204 means success with no body. 400 is a bad request. 401 means not logged in. 403 means logged in but not allowed.\n\n404 means not found. 409 is a conflict. 429 means too many requests. 500 is the server's fault. The number is a label so the UI can choose a message without guessing. Do not send 200 when you really failed.\n\nIn the code: POST /users 400 without email, 201 with email. GET /missing 404.\n\nA common mistake is returning 200 { error: \"no\" }.",
      code: `app.post("/users", function (req, res) {
  if (!req.body.email) {
    return res.status(400).json({ error: "email required" });
  }
  res.status(201).json({ id: 1, email: req.body.email });
});

app.get("/missing", function (req, res) {
  res.status(404).json({ error: "not found" });
});` },
    { id: 26, level: "intermediate", q: "PUT vs PATCH vs POST?",
      a: "POST usually creates something new, or starts an action. PUT replaces the whole resource with the body you send. PATCH changes only some fields.\n\nPUT should be safe to retry: doing it twice should look like doing it once. POST often creates a second row if you click twice, unless you add extra protection.\n\nIn the code: POST /books creates with 201. PUT /books/1 replaces title and pages.\n\nA common mistake is POST for an update that should have been PUT or PATCH.",
      code: `// POST = create
app.post("/books", function (req, res) {
  res.status(201).json({ id: 1, title: req.body.title });
});

// PUT = replace all fields
app.put("/books/1", function (req, res) {
  res.json({ id: 1, title: req.body.title, pages: req.body.pages });
});` },
    { id: 27, level: "intermediate", q: "What is idempotency?",
      a: "Idempotent means doing it once and doing it five times leave the same stored result. GET, PUT, and DELETE should be idempotent.\n\nPOST is often not: five POSTs can make five orders. Payments use an idempotency key so a double click does not charge twice. Networks retry requests when they are unsure.\n\nIn the code: seen Set. POST /pay checks idempotency-key. If seen, already done. Else add and paid.\n\nA common mistake is POST /pay with no key on a double click.",
      code: `const seen = new Set();

app.post("/pay", function (req, res) {
  const key = req.headers["idempotency-key"];
  if (seen.has(key)) {
    return res.json({ status: "already done" }); // same result
  }
  seen.add(key);
  res.json({ status: "paid" });
});` },
    { id: 28, level: "intermediate", q: "How do you validate input?",
      a: "Never trust req.body just because the UI had a form. Check types, required fields, and allowed values on the server.\n\nLibraries like Zod, Joi, or express-validator help you write rules once. If the data is wrong, stop with 400 or 422 and name the field. Failing fast is kinder than saving junk and debugging it later.\n\nIn the code: createUser checks email is a string with @, else 400. POST /users uses it.\n\nA common mistake is trusting the React form and skipping server checks.",
      code: `function createUser(req, res) {
  const email = req.body.email;
  if (typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "email looks wrong" });
  }
  res.status(201).json({ email: email });
}

app.post("/users", createUser);` },
    { id: 29, level: "intermediate", q: "How do you connect Mongo/SQL from Node?",
      a: "You use a driver like pg or a helper like Prisma or Mongoose. Create one shared client or pool when the app starts.\n\nDo not open a new connection on every request. That is slow and can exhaust the database. Keep the password in process.env, not in the source file.\n\nIn the code: new Pool with DATABASE_URL. GET /users query SELECT id, name. res.json rows.\n\nA common mistake is new Pool() inside every route.",
      code: `const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.get("/users", async function (req, res) {
  const result = await pool.query("SELECT id, name FROM users");
  res.json(result.rows);
});` },
    { id: 30, level: "intermediate", q: "What is a connection pool?",
      a: "Opening a database connection is like starting a new phone call. It costs time. A pool keeps a few calls open and reuses them for many requests.\n\nIf you forget to release a client, the pool dries up and new requests hang. Size the pool. Too big can overload the database. Too small makes users wait.\n\nIn the code: Pool max 10. connect, query SELECT 1, finally client.release().\n\nA common mistake is connect() without release() in finally.",
      code: `const { Pool } = require("pg");
const pool = new Pool({ max: 10 }); // at most 10 open connections

app.get("/hello", async function (req, res) {
  const client = await pool.connect();
  try {
    const r = await client.query("SELECT 1 AS ok");
    res.json(r.rows[0]);
  } finally {
    client.release(); // give the room back
  }
});` },
    { id: 31, level: "intermediate", q: "JWT auth flow?",
      a: "The user sends email and password once. If they match, the server signs a small token that says who they are and when it expires.\n\nLater requests send Authorization: Bearer plus that token. The server checks the signature and expiry. It does not need to store every token if it is stateless. Refresh tokens last longer and must be stored more carefully.\n\nIn the code: POST /login rejects a bad password with 401. jwt.sign userId 1 with JWT_SECRET expires 15m. res.json { token }.\n\nA common mistake is a JWT that never expires.",
      code: `const jwt = require("jsonwebtoken");

app.post("/login", function (req, res) {
  if (req.body.password !== "secret") {
    return res.status(401).json({ error: "no" });
  }
  const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET, { expiresIn: "15m" });
  res.json({ token: token });
});` },
    { id: 32, level: "intermediate", q: "JWT vs session cookies?",
      a: "A session cookie stores an id. The server keeps the real session in memory or Redis. You can delete it to log someone out.\n\nA JWT can be checked with a secret and no server list, so it is harder to revoke early. If you put a JWT in localStorage, any stolen script can read it, XSS. HttpOnly cookies hide the value from JavaScript, which helps, but then you must think about CSRF. For a first-party website, many teams still like httpOnly cookies.\n\nIn the code: GET /me reads req.cookies.sid, looks up sessions.get, 401 if missing, else { name }.\n\nA common mistake is a JWT in localStorage with no XSS story.",
      code: `// session style: cookie holds only an id
app.get("/me", function (req, res) {
  const sessionId = req.cookies.sid;
  const user = sessions.get(sessionId); // server memory or Redis
  if (!user) return res.status(401).json({ error: "please log in" });
  res.json({ name: user.name });
});` },
    { id: 33, level: "intermediate", q: "How do you hash passwords?",
      a: "Never save the real password. Save a hash, which is a one-way scramble. Use bcrypt or argon2. They are slow on purpose so guessing is expensive.\n\nEach password gets a unique salt so two password123 users do not look the same. Use the library compare function. Do not write your own timing-sensitive check. If the database leaks, attackers still have to guess, not just copy.\n\nIn the code: signup bcrypt.hash cost 10. login bcrypt.compare.\n\nA common mistake is storing the password in plain text.",
      code: `const bcrypt = require("bcrypt");

async function signup(password) {
  const hash = await bcrypt.hash(password, 10); // slow on purpose
  return hash; // save this, not the password
}

async function login(password, hash) {
  return bcrypt.compare(password, hash);
}` },
    { id: 34, level: "advanced", q: "Why not SHA-256 for passwords?",
      a: "SHA-256 is fast. Computers can try billions of guesses per second. Password hashing must be slow and heavy so each guess costs time and memory.\n\nbcrypt, argon2, and scrypt are built for that job. SHA-256 is still fine for file checksums, just not for login secrets. If someone steals your user table, slow hashes buy your users time.\n\nIn the code: crypto.createHash sha256 of secret is fast. safer() uses bcrypt.hash cost 12.\n\nA common mistake is SHA-256(password) as the stored login hash.",
      code: `const crypto = require("crypto");
const bcrypt = require("bcrypt");

const fast = crypto.createHash("sha256").update("secret").digest("hex");
// attackers can try huge lists against "fast"

async function safer(password) {
  return bcrypt.hash(password, 12); // slow: better for passwords
}` },
    { id: 35, level: "intermediate", q: "What is bcrypt cost factor?",
      a: "The number in bcrypt.hash(password, 10) is the cost, also called rounds or work factor. Each extra step roughly doubles the time to hash.\n\nToo low is easy to attack. Too high makes login feel slow for real users. Tune it on your hardware so hashing takes a short, noticeable moment. When computers get faster, you raise the cost for new hashes.\n\nIn the code: cost 10, bcrypt.hash(password, cost).\n\nA common mistake is cost 4 because it felt snappy in development.",
      code: `const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const cost = 10; // higher = slower = safer
  const hash = await bcrypt.hash(password, cost);
  return hash;
}` },
    { id: 36, level: "intermediate", q: "rate limiting?",
      a: "A rate limit counts requests per IP or per user in a time window. Login routes should be stricter, because guessing passwords is a common attack.\n\nOne Node process can keep counts in memory. Many processes need a shared store like Redis. When the limit is hit, send 429 and a clear message. Limits protect both your server and your users.\n\nIn the code: hits Map by req.ip. If n > 5, 429. POST /login uses limit then { ok: true }.\n\nA common mistake is in-memory limits with five Node processes, so the attacker gets 5x tries.",
      code: `const hits = new Map();
function limit(req, res, next) {
  const n = (hits.get(req.ip) || 0) + 1;
  hits.set(req.ip, n);
  if (n > 5) return res.status(429).json({ error: "too many tries" });
  next();
}
app.post("/login", limit, function (req, res) {
  res.json({ ok: true });
});` },
    { id: 37, level: "intermediate", q: "How do you log in Node?",
      a: "A log is a timestamped note: what happened, for which request, at what level. Use a logger such as pino or winston that can print JSON.\n\nAdd a request id so you can follow one user through many lines. Never log passwords, tokens, or full credit card numbers. console.log is fine while learning, but production needs levels and structure.\n\nIn the code: log() JSON.stringifies level, message, requestId. Example info user logged in abc-123.\n\nA common mistake is console.log(req.body) including the password.",
      code: `function log(level, message, extra) {
  console.log(JSON.stringify({
    level: level,
    message: message,
    requestId: extra.requestId
  }));
}

log("info", "user logged in", { requestId: "abc-123" });` },
    { id: 38, level: "intermediate", q: "What is morgan?",
      a: "Morgan is middleware that prints one line per HTTP request. It is handy on small apps while you learn.\n\nBigger apps often want JSON logs with a request id, which morgan does not focus on. You can still use it in development only. It does not replace error tracking or metrics.\n\nIn the code: morgan tiny, then GET /users returns [].\n\nA common mistake is morgan as the only production observability.",
      code: `const morgan = require("morgan");
const app = express();

app.use(morgan("tiny")); // GET /users 200 5ms

app.get("/users", function (req, res) {
  res.json([]);
});` },
    { id: 39, level: "beginner", q: "process.env?",
      a: "process.env is an object of environment variables: settings the system injects into your program. Values are always strings. 3000 is text until you turn it into a number.\n\nUse it for ports, database URLs, and secrets so they are not hard-coded. If a required value is missing, it is better to stop at startup than fail later. Never print secret env values into public logs.\n\nIn the code: port Number(PORT || 3000). dbUrl DATABASE_URL. throw if missing. log listening on port.\n\nA common mistake is hard-coding the production database URL.",
      code: `const port = Number(process.env.PORT || "3000");
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL is missing");
}

console.log("listening on", port);` },
    { id: 40, level: "beginner", q: "What is dotenv?",
      a: "On your laptop, secrets often live in a file named .env as KEY=value lines. dotenv reads that file and copies the values into process.env.\n\nProduction should get env from the host, not from a committed file. Never put .env in git. Keep a .env.example with fake values. The rest of your code should only read process.env, not the file directly.\n\nIn the code: require(\"dotenv\").config(). JWT_SECRET from env. GET /health returns hasSecret boolean.\n\nA common mistake is committing .env with real secrets.",
      code: `require("dotenv").config(); // copies .env into process.env on your laptop

const secret = process.env.JWT_SECRET;

app.get("/health", function (req, res) {
  res.json({ hasSecret: Boolean(secret) });
});` },
    { id: 41, level: "intermediate", q: "cluster module?",
      a: "A single Node process uses one main JavaScript thread. cluster can fork worker processes that share the same port.\n\nThe primary watches workers. If one dies, you can start another. Many teams use a platform, Kubernetes or a process manager, instead of hand-written cluster code. It helps CPU-heavy traffic, but shared in-memory state is not shared across workers.\n\nIn the code: if isPrimary, fork once per CPU. else require(\"./server\").\n\nA common mistake is an in-memory session Map that each worker cannot see.",
      code: `const cluster = require("cluster");
const os = require("os");

if (cluster.isPrimary) {
  os.cpus().forEach(function () {
    cluster.fork(); // extra worker process
  });
} else {
  require("./server"); // each worker runs the Express app
}` },
    { id: 42, level: "intermediate", q: "child_process vs worker_threads?",
      a: "child_process starts another program. Good for running a separate tool. worker_threads stay inside Node and are better for heavy JavaScript math.\n\nA child has its own memory. A worker can share memory if you set that up. Do not block the request thread with a giant loop. Hand the job off. Pick the smallest tool that keeps the event loop free.\n\nIn the code: hashInWorker creates a Worker from heavy.js, postMessage, on message resolve.\n\nA common mistake is a giant loop in the request handler instead of a worker.",
      code: `const { Worker } = require("worker_threads");

function hashInWorker(data) {
  return new Promise(function (resolve) {
    const w = new Worker("./heavy.js");
    w.postMessage(data);
    w.on("message", resolve);
  });
}` },
    { id: 43, level: "advanced", q: "When do you use the libuv thread pool?",
      a: "Some fs calls, some crypto, and dns.lookup use libuv's pool. The default pool is small, often four threads.\n\nIf many requests hash passwords or read lots of files, they queue on that pool. The JavaScript looks async, but it can still feel slow. Async does not mean unlimited bikes. If crypto is hot, you may raise the pool size or move work to workers.\n\nIn the code: crypto.pbkdf2 uses the libuv thread pool, not the JS thread. Then it logs the key.\n\nA common mistake is thousands of pbkdf2 calls and wondering why async still queues.",
      code: `const crypto = require("crypto");

crypto.pbkdf2("secret", "salt", 100000, 64, "sha512", function (err, key) {
  // this uses the libuv thread pool, not the JS thread
  console.log(key.toString("hex"));
});` },
    { id: 44, level: "advanced", q: "process.nextTick vs setImmediate vs setTimeout(0)?",
      a: "process.nextTick runs very soon, even before some other microtasks. Too many nextTicks can starve I/O. setImmediate runs in the check phase of the event loop.\n\nsetTimeout(fn, 0) is a timer. It is not truly zero milliseconds. For after I/O, setImmediate is often the clearer intent. In interviews, say you would not build a busy loop with nextTick.\n\nIn the code: log A, nextTick B, setImmediate C, setTimeout D 0, log E. A and E first. B usually before C and D.\n\nA common mistake is a nextTick loop that never lets I/O run.",
      code: `console.log("A");

process.nextTick(function () { console.log("B nextTick"); });
setImmediate(function () { console.log("C immediate"); });
setTimeout(function () { console.log("D timeout"); }, 0);

console.log("E");
// A and E first. B usually before C and D.` },
    { id: 45, level: "intermediate", q: "What are streams?",
      a: "A stream is a flow of chunks: readable, writable, or both. pipe connects a source to a sink, like a hose.\n\nYou use streams for big files and for HTTP bodies. If you read a 2 GB file into one string, memory explodes. Backpressure is how the sip slows down when you cannot swallow yet.\n\nIn the code: createReadStream big.txt pipes to createWriteStream copy.txt. on end logs copy done.\n\nA common mistake is readFile of a multi-gigabyte log.",
      code: `const fs = require("fs");

const src = fs.createReadStream("big.txt");
const dest = fs.createWriteStream("copy.txt");

src.pipe(dest); // copy in chunks, not all at once
src.on("end", function () {
  console.log("copy done");
});` },
    { id: 46, level: "intermediate", q: "backpressure?",
      a: "write() can return false, meaning buffers are full, please pause. You wait for a drain event, then write more.\n\nIf you ignore that, chunks pile up in memory and the process grows. pipe() handles a lot of this for you. Interviews mention backpressure to see if you have copied huge files the naive way.\n\nIn the code: writeSlow writes a chunk. If not ok, wait for drain then done.\n\nA common mistake is a loop of write() with no drain check on a slow destination.",
      code: `function writeSlow(writable, chunk, done) {
  const ok = writable.write(chunk);
  if (ok) return done();
  writable.once("drain", done); // wait until the funnel is free
}

writeSlow(process.stdout, "hello
", function () {
  console.log("wrote");
});` },
    { id: 47, level: "intermediate", q: "fs.createReadStream vs readFile?",
      a: "readFile loads the whole file into memory, then gives you the result. createReadStream gives you pieces as they arrive.\n\nFor a small config file, readFile is simpler. For a video or a big log, stream it to the HTTP response. If you stream to res, the user can start receiving before the disk is done.\n\nIn the code: GET /book pipes createReadStream book.txt to res. GET /tiny readFile hi.txt and res.send.\n\nA common mistake is readFile of a video to send in one buffer.",
      code: `const fs = require("fs");

app.get("/book", function (req, res) {
  const stream = fs.createReadStream("book.txt");
  stream.pipe(res); // send pieces to the browser
});

app.get("/tiny", async function (req, res) {
  const text = await fs.promises.readFile("hi.txt", "utf8");
  res.send(text);
});` },
    { id: 48, level: "beginner", q: "Buffer vs string?",
      a: "A string is text, usually UTF-8 characters you can read. A Buffer is a box of bytes: pictures, zip files, or text before you decode it.\n\nYou convert with buf.toString('utf8') or Buffer.from(text). Do not glue huge buffers in a tight loop without need. It copies a lot. Network and files often give you Buffers first.\n\nIn the code: Buffer.from Ada utf8, log bytes, toString Ada. pic is JPEG-ish bytes, log length.\n\nA common mistake is treating a PNG Buffer as a UTF-8 string.",
      code: `const buf = Buffer.from("Ada", "utf8");
console.log(buf);              // bytes
console.log(buf.toString());   // "Ada"

const pic = Buffer.from([255, 216, 255]); // not text
console.log(pic.length);` },
    { id: 49, level: "intermediate", q: "What is the difference between spawn, exec, and fork?",
      a: "spawn starts a program and streams its output. You pass arguments as an array, not one shell string. exec gathers all output into a buffer and often uses a shell, which is risky with user input.\n\nfork starts another Node process and lets you send messages back and forth. Prefer spawn with an argument list for safety. Use fork when the extra work is also JavaScript.\n\nIn the code: spawn node -e console.log(1+1). stdout on data logs 2.\n\nA common mistake is exec with a user string and a shell.",
      code: `const { spawn } = require("child_process");

const child = spawn("node", ["-e", "console.log(1+1)"]);
child.stdout.on("data", function (chunk) {
  console.log(String(chunk)); // "2"
});` },
    { id: 50, level: "advanced", q: "command injection via exec?",
      a: "If you glue user input into a string and run it through a shell, extra pieces can run too. An input like file.txt; rm -rf / is the nightmare version of this idea.\n\nUse spawn with a fixed program name and an args array, and do not set shell: true. Validate allowed characters if you must accept a name. Never treat user text as source code for the terminal.\n\nIn the code: zipName spawn zip -r out.zip name. args array, not mixed into a shell string.\n\nA common mistake is exec(\"zip \" + req.query.file).",
      code: `const { spawn } = require("child_process");

function zipName(name) {
  // args array: not mixed into a shell string
  return spawn("zip", ["-r", "out.zip", name]);
}

zipName("photos");` },
    { id: 51, level: "intermediate", q: "How do you test Express?",
      a: "Export the app without calling listen in the test file. Use a helper like supertest to send GET/POST and read status and JSON.\n\nUnit-test services with a fake database. Integration tests can use a real test database. Assert both the status code and the shape of the body. If you only test in production, users become your test suite.\n\nIn the code: GET /ping JSON ok true. fakeRequest returns status 200 body ok. console.log that ok.\n\nA common mistake is listen() inside the module that tests import.",
      code: `const express = require("express");
const app = express();
app.get("/ping", function (req, res) {
  res.json({ ok: true });
});

function fakeRequest() {
  return { status: 200, body: { ok: true } };
}
console.log(fakeRequest().body.ok);` },
    { id: 52, level: "intermediate", q: "What is nodemon?",
      a: "Nodemon is a development helper that restarts Node when you save a file. It saves you from stopping and starting the server yourself.\n\nYou do not use it as the process manager in production. List it in devDependencies. Production needs a real restart policy from the host, not a file watcher.\n\nIn the code: scripts.dev nodemon index.js. scripts.start node index.js. nodemon in devDependencies.\n\nA common mistake is nodemon as the production start command.",
      code: `const pkg = {
  scripts: {
    dev: "nodemon index.js", // local reload while you edit
    start: "node index.js"   // production start
  },
  devDependencies: { nodemon: "3.1.0" }
};` },
    { id: 53, level: "beginner", q: "npm scripts?",
      a: "Scripts are named shortcuts for running your app, tests, or lint. start and test are common names. You can add your own, like dev.\n\nThey keep the same commands for you and for CI. Put the real Node entry in start, not a one-off experiment. Keep script bodies small so people can read them.\n\nIn the code: start node index.js, test node test.js, dev nodemon. console.log start.\n\nA common mistake is a 200-character start script nobody can read.",
      code: `const pkg = {
  scripts: {
    start: "node index.js",
    test: "node test.js",
    dev: "nodemon index.js"
  }
};

console.log(pkg.scripts.start);` },
    { id: 54, level: "intermediate", q: "npx?",
      a: "npx is a way to run a package's command without making it a global install forever. In a project, you usually call the binary that already sits in node_modules.\n\nIn CI, pin the version so yesterday's generator does not change. This answer focuses on the idea, not on typing a terminal line. Your app code should still import libraries the normal way.\n\nIn the code: pkg.bin my-tool cli.js. cli logs args. cli([\"--help\"]).\n\nA common mistake is relying on an unpinned npx tool in CI.",
      code: `// a package can expose a CLI entry
const pkg = {
  name: "my-tool",
  bin: { "my-tool": "cli.js" }
};

function cli(args) {
  console.log("args", args);
}
cli(["--help"]);` },
    { id: 55, level: "intermediate", q: "semantic versioning?",
      a: "MAJOR.MINOR.PATCH: breaking change, new feature, bug fix. A caret like ^1.2.3 allows newer 1.x but not 2.0.0.\n\nA tilde like ~1.2.3 is even tighter, often patch only. Lockfiles still matter because ranges can surprise you. When you publish a library, bump major if old code would break.\n\nIn the code: parseVersion splits 4.19.2 into major 4, minor 19, patch 2.\n\nA common mistake is a breaking API change published as a patch.",
      code: `function parseVersion(v) {
  const parts = v.split(".");
  return { major: parts[0], minor: parts[1], patch: parts[2] };
}

console.log(parseVersion("4.19.2"));
// major 4 = breaking line. 19 = features. 2 = fixes` },
    { id: 56, level: "advanced", q: "peerDependencies?",
      a: "A plugin says I expect the host app to already have React 18. That avoids bundling two copies of React side by side.\n\nIf the host has the wrong version, you get warnings or broken plugins. App dependencies are what you install. Peer dependencies are what you must already have. Library authors use this more than app authors.\n\nIn the code: fancy-button peerDependencies react ^18. console.log that range.\n\nA common mistake is a plugin that bundles its own second copy of React.",
      code: `const plugin = {
  name: "fancy-button",
  peerDependencies: {
    react: "^18.0.0" // the app must provide React
  }
};

console.log(plugin.peerDependencies.react);` },
    { id: 57, level: "intermediate", q: "What is the event emitter pattern?",
      a: "You listen with on, and you fire with emit. Many streams and Node APIs use this pattern.\n\nIf you add a listener and never remove it, you can leak memory. once means listen for only the first event. For a one-shot async result, a Promise is often clearer today.\n\nIn the code: EventEmitter bus. on order logs cook item. emit order pizza.\n\nA common mistake is adding on(\"data\") every request and never removing it.",
      code: `const EventEmitter = require("events");
const bus = new EventEmitter();

bus.on("order", function (item) {
  console.log("cook", item);
});

bus.emit("order", "pizza");` },
    { id: 58, level: "intermediate", q: "unhandledRejection?",
      a: "An unhandled rejection is a Promise that fails and nobody catches it. Modern Node may stop the process, because ignoring failures hides bugs.\n\nAlways add .catch or try/catch around await. You can log at process level as a last safety net, but fix the source. One forgotten await in a route is a typical cause.\n\nIn the code: load() throws. load().catch logs handled. Do not leave this off.\n\nA common mistake is fire-and-forget load() with no catch.",
      code: `async function load() {
  throw new Error("db down");
}

load().catch(function (err) {
  console.error("handled", err.message); // do not leave this off
});` },
    { id: 59, level: "intermediate", q: "graceful shutdown?",
      a: "The host sends SIGTERM when it wants you to exit. You stop listening for new requests, finish the ones already in flight, close the database, then exit.\n\nIf you ignore the signal, the host may kill you anyway after a timeout. Kubernetes and many clouds rely on this.\n\nIn the code: app.listen 3000. on SIGTERM server.close, db.end, process.exit 0.\n\nA common mistake is process.exit(0) immediately, cutting in-flight requests.",
      code: `const server = app.listen(3000);

process.on("SIGTERM", function () {
  server.close(function () {
    db.end();          // close database
    process.exit(0);   // then leave
  });
});` },
    { id: 60, level: "intermediate", q: "health check endpoint?",
      a: "A load balancer or platform pings a cheap URL to see if the process is alive. Liveness should be cheap: this process can answer HTTP.\n\nReadiness can check the database: I am ready for traffic. If you mix them, a down database might restart a healthy process in a loop. Keep the live check extra simple.\n\nIn the code: GET /healthz { ok: true }. GET /ready awaits SELECT 1 then { db: up }.\n\nA common mistake is a heavy DB query as the only liveness check.",
      code: `app.get("/healthz", function (req, res) {
  res.json({ ok: true }); // process is up
});

app.get("/ready", async function (req, res) {
  await db.query("SELECT 1");
  res.json({ db: "up" });
});` },
    { id: 61, level: "advanced", q: "liveness vs readiness?",
      a: "Liveness means restart me if I am stuck or deadlocked. Readiness means stop sending me traffic if I cannot serve yet, warming up, lost DB.\n\nIf readiness fails, traffic goes elsewhere. If liveness fails, the process is killed. Using a heavy DB check as liveness can cause restart storms. Platforms need both so they do not flap.\n\nIn the code: ready starts false. start() connects db then ready true. /live always ok. /ready 200 or 503.\n\nA common mistake is restarting the process every time the database blips.",
      code: `let ready = false;

async function start() {
  await db.connect();
  ready = true;
}

app.get("/live", function (req, res) { res.send("ok"); });
app.get("/ready", function (req, res) {
  res.status(ready ? 200 : 503).send(ready ? "ready" : "wait");
});` },
    { id: 62, level: "intermediate", q: "How does Express differ from Fastify or Koa?",
      a: "Express is the common, flexible default with a huge middleware pile. Koa uses async functions and a context object, with a smaller core.\n\nFastify focuses on speed, schemas, and logging built in. You can build the same REST API in all three. Interviews want you to pick one and explain the trade-off, not to hate Express.\n\nIn the code: Express GET /hi JSON hi true. idea notes Koa ctx.body and Fastify schema plus handler.\n\nA common mistake is rewriting a working Express API only because Fastify is faster on a blog.",
      code: `// Express style: (req, res, next)
app.get("/hi", function (req, res) {
  res.json({ hi: true });
});

// same idea in words: Koa uses ctx.body, Fastify uses schema + handler
const idea = { path: "/hi", reply: { hi: true } };` },
    { id: 63, level: "beginner", q: "What is REST?",
      a: "REST is a style, not a strict protocol. You name resources with URLs, like /users/5, and use HTTP verbs to read or change them.\n\nEach request should carry what it needs, stateless. JSON is a common body. GET should not secretly delete data. GraphQL and RPC are other styles. REST is still the default interview language.\n\nIn the code: GET /users/5 JSON Ada. DELETE /users/5 204.\n\nA common mistake is GET /users/5/delete.",
      code: `app.get("/users/5", function (req, res) {
  res.json({ id: 5, name: "Ada" }); // read
});

app.delete("/users/5", function (req, res) {
  res.status(204).end(); // remove
});` },
    { id: 64, level: "intermediate", q: "What is GraphQL vs REST in Node?",
      a: "REST usually has many URLs. GraphQL often has one URL and a query that names fields. The client can ask only for what it needs, which helps mobile apps.\n\nYou must still check auth, and you must stop expensive nested queries, N+1. Caching GET URLs is often simpler in REST. Neither is always better. Pick based on clients and team skill.\n\nIn the code: REST GET /users/1 returns a fixed shape. GraphQL query asks only for name.\n\nA common mistake is GraphQL with no auth on nested fields.",
      code: `// REST: fixed shape
app.get("/users/1", function (req, res) {
  res.json({ id: 1, name: "Ada", email: "a@x.com" });
});

// GraphQL idea: client asks for fields
const query = "{ user(id: 1) { name } }";
console.log(query);` },
    { id: 65, level: "intermediate", q: "N+1 problem in APIs?",
      a: "You load a list of 50 users, then you query the database once per user for their profile. That is 1 + 50 queries, which is N+1.\n\nFix it with a join, a batch loader, or one query that returns all profiles. GraphQL resolvers fall into this trap easily if you are not careful. Log your queries in development so you can see the storm.\n\nIn the code: a for loop of SELECT profiles WHERE user_id = $1. Better: WHERE user_id = ANY($1) with [1, 2].\n\nA common mistake is a GraphQL User.profile resolver that queries per user with no dataloader.",
      code: `const users = [{ id: 1 }, { id: 2 }];

// slow N+1
for (const u of users) {
  await db.query("SELECT * FROM profiles WHERE user_id = $1", [u.id]);
}

// better: one query
await db.query("SELECT * FROM profiles WHERE user_id = ANY($1)", [[1, 2]]);` },
    { id: 66, level: "intermediate", q: "pagination styles?",
      a: "offset/limit is easy: skip 20, take 10. It gets slow and jumpy when rows change. cursor or keyset pagination says give me rows after this last id.\n\nAlways cap the page size so nobody asks for a million rows. Infinite scroll UIs usually want cursors. Document the params so the front end does not invent names.\n\nIn the code: GET /posts limit min of query or 10, max 50. WHERE id > after ORDER BY id LIMIT.\n\nA common mistake is LIMIT 1000000 from the client.",
      code: `app.get("/posts", async function (req, res) {
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const after = req.query.after || "0";
  const rows = await db.query(
    "SELECT * FROM posts WHERE id > $1 ORDER BY id LIMIT $2",
    [after, limit]
  );
  res.json(rows.rows);
});` },
    { id: 67, level: "intermediate", q: "How do you version an API?",
      a: "A common way is a prefix: /v1/users and later /v2/users. Some teams use a header instead. URL versioning is easier to see.\n\nDo not remove fields the old app still reads, unless you have a sunset date. Add new fields when you can. New endpoints for breaking changes. Write the policy down so mobile apps are not surprised.\n\nIn the code: v1 GET /users JSON Ada. app.use(\"/v1\", v1). Later /v2 without deleting /v1.\n\nA common mistake is breaking /v1 overnight because the new UI shipped.",
      code: `const v1 = express.Router();
v1.get("/users", function (req, res) {
  res.json([{ id: 1, name: "Ada" }]);
});

app.use("/v1", v1);
// later you can add /v2 without deleting /v1` },
    { id: 68, level: "advanced", q: "How do you keep Node APIs fast?",
      a: "Do not block the event loop with huge CPU work. Index the database for the queries you actually run. Cache hot reads if they are safe to reuse.\n\nKeep JSON small. Pool connections. Put a reverse proxy in front. Measure first. Guessing leads to premature rewrites. A missing index beats a new framework almost every time.\n\nIn the code: GET /products/:id cache hit returns early. Else query SELECT id, name, cache.set, res.json.\n\nA common mistake is rewriting the framework before EXPLAIN on the slow query.",
      code: `app.get("/products/:id", async function (req, res) {
  const id = req.params.id;
  if (cache.has(id)) return res.json(cache.get(id)); // cheap repeat
  const row = await db.query("SELECT id, name FROM products WHERE id = $1", [id]);
  cache.set(id, row.rows[0]);
  res.json(row.rows[0]);
});` },
    { id: 69, level: "advanced", q: "CPU-bound work in Node?",
      a: "A tight loop in a request handler freezes every other connection on that process. Move the work to worker_threads, a job queue, or another service.\n\nReturn 202 and a job id if it will take seconds. Password hashing is already a bit heavy. Resize-all-photos is much heavier. Measure event-loop delay if the API randomly pauses.\n\nIn the code: POST /resize starts a Worker, postMessage path, on message res.json path.\n\nA common mistake is resizing images inside the POST handler on the main thread.",
      code: `const { Worker } = require("worker_threads");

app.post("/resize", function (req, res) {
  const w = new Worker("./resize.js");
  w.postMessage(req.body.path);
  w.on("message", function (out) {
    res.json({ path: out });
  });
});` },
    { id: 70, level: "intermediate", q: "job queues?",
      a: "Some work should not sit inside the user's HTTP request: emails, thumbnails, reports. You push a job onto a queue, often Redis-backed, and a worker process pops it.\n\nThe HTTP route can return 202 Accepted plus a job id. Retries belong on the worker, with a limit. Do not run a 2-minute job inside app.post if the client will time out.\n\nIn the code: POST /email pushes a job, 202 jobId. worker shift and sendEmail.\n\nA common mistake is await sendEmail inside the request with a 30s client timeout.",
      code: `const jobs = [];

app.post("/email", function (req, res) {
  jobs.push({ to: req.body.to, body: req.body.body });
  res.status(202).json({ jobId: jobs.length }); // accepted, not finished
});

function worker() {
  const job = jobs.shift();
  if (job) sendEmail(job);
}` },
    { id: 71, level: "intermediate", q: "WebSockets with Node?",
      a: "HTTP is request then response. WebSockets stay open so both sides can send anytime. Libraries like ws or Socket.IO sit on Node.\n\nIf you have many Node processes, in-memory rooms do not see each other unless you add Redis pub/sub. Use them when you truly need push. Polling is simpler for rare updates.\n\nIn the code: WebSocketServer port 8080. on connection send welcome, on message echo.\n\nA common mistake is in-memory rooms with three Node processes and missing messages.",
      code: `const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function (socket) {
  socket.send("welcome");
  socket.on("message", function (text) {
    socket.send("echo " + text);
  });
});` },
    { id: 72, level: "intermediate", q: "sticky sessions?",
      a: "If chat rooms live only in one process's memory, the next request must hit that same process. Sticky sessions do that. They make scaling and deploys clumsier.\n\nA better design stores socket state in Redis so any process can help. Prefer shared state over stickiness when you can.\n\nIn the code: rooms Map in memory needs sticky sessions. idea stores membership in Redis.\n\nA common mistake is sticky sessions forever instead of Redis pub/sub.",
      code: `const rooms = new Map(); // in-memory: needs sticky sessions

function join(processId, room, user) {
  rooms.set(room, user);
}

// better idea: store membership in Redis so any process can read it
const idea = { user: "Ada", room: "lobby", store: "redis" };` },
    { id: 73, level: "beginner", q: "What is middleware for static files?",
      a: "express.static points at a folder and serves files by name. Put it before a SPA fallback so real files win over index.html.\n\nSet cache headers for files that rarely change. Do not put secrets or .env in that folder. APIs and static files can live in one app, but keep the folders clear.\n\nIn the code: express.static public. GET /style.css maps to public/style.css.\n\nA common mistake is putting .env inside the public folder.",
      code: `const path = require("path");
const express = require("express");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
// GET /style.css -> public/style.css` },
    { id: 74, level: "intermediate", q: "SPA fallback in Express?",
      a: "The API routes must be registered first. Then static files. Then for unknown GET paths, send index.html so React Router can run.\n\nIf you skip the fallback, /app/settings returns 404 on refresh. Do not send index.html for /api/* misses. Those should stay 404 JSON.\n\nIn the code: /api apiRouter, static dist, GET * sendFile dist/index.html.\n\nA common mistake is the * fallback before /api, so APIs return HTML.",
      code: `const path = require("path");

app.use("/api", apiRouter);
app.use(express.static("dist"));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});` },
    { id: 75, level: "intermediate", q: "cookie-parser and sessions?",
      a: "cookie-parser reads the Cookie header into req.cookies. express-session stores session data on the server and puts a signed id in a cookie.\n\nThe default MemoryStore is not for production. Use Redis or similar. If you only parse cookies but never store a session, you still need something that maps id to user. Sign and set HttpOnly on session cookies.\n\nIn the code: session secret from env, resave false, saveUninitialized false, cookie httpOnly secure.\n\nA common mistake is MemoryStore in production with multiple processes.",
      code: `const session = require("express-session");

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: true }
}));` },
    { id: 76, level: "advanced", q: "CSRF?",
      a: "The browser may send your cookies to your site when another site triggers a request. If login lives in a cookie, a hostile page might submit transfer money as you.\n\nSameSite cookies, CSRF tokens, and not using cookie auth for random cross-site APIs all help. Bearer tokens stored in JS have a different main risk: XSS, not classic CSRF. First-party form posts are the usual story.\n\nIn the code: POST /transfer compares req.body.csrf to req.session.csrf. Mismatch 403. Else ok.\n\nA common mistake is cookie sessions with no CSRF token on POST.",
      code: `app.post("/transfer", function (req, res) {
  if (req.body.csrf !== req.session.csrf) {
    return res.status(403).json({ error: "bad csrf token" });
  }
  res.json({ ok: true });
});` },
    { id: 77, level: "intermediate", q: "SameSite cookie attribute?",
      a: "SameSite controls whether the cookie is sent on requests that start from another site. Strict is picky. Lax is a common default for session cookies. None requires Secure and is for true cross-site needs.\n\nSameSite reduces many CSRF cases but is not the only control. Set it on purpose. Browsers have defaults, but APIs should be explicit.\n\nIn the code: cookie sid abc httpOnly secure sameSite lax.\n\nA common mistake is SameSite None without Secure.",
      code: `res.cookie("sid", "abc", {
  httpOnly: true,
  secure: true,
  sameSite: "lax" // typical for a site's own login cookie
});` },
    { id: 78, level: "intermediate", q: "Secure and HttpOnly cookies?",
      a: "Secure means only send the cookie on HTTPS, not plain HTTP. HttpOnly means JavaScript on the page cannot read the cookie.\n\nHttpOnly helps if an XSS bug tries to steal a session token. Together they are the usual pair for a session cookie. A token in localStorage has neither protection.\n\nIn the code: cookie sid abc123 httpOnly secure path / maxAge one hour.\n\nA common mistake is a session cookie readable by document.cookie.",
      code: `res.cookie("sid", "abc123", {
  httpOnly: true, // document.cookie cannot read it
  secure: true,   // HTTPS only
  path: "/",
  maxAge: 60 * 60 * 1000
});` },
    { id: 79, level: "beginner", q: "How do you read CLI args?",
      a: "process.argv is an array of strings. Index 0 is the node program. Index 1 is your script path. After that are your flags.\n\nLibraries like commander parse flags more nicely, but argv is the base idea. Use it for one-off tools, not for secrets, those belong in env. Always check length before reading argv[2].\n\nIn the code: name is argv[2] or friend. greet returns Hello plus n. console.log greet(name).\n\nA common mistake is putting a password in argv so it shows in process lists.",
      code: `// node greet.js Ada
const name = process.argv[2] || "friend";

function greet(n) {
  return "Hello " + n;
}

console.log(greet(name));` },
    { id: 80, level: "beginner", q: "process.cwd vs __dirname?",
      a: "process.cwd() is where you were standing when you started Node. __dirname is the folder of the current file, CommonJS.\n\nThey differ if you start the app from another directory. In ES modules you build the file folder from import.meta.url. When you open a data file next to the script, prefer __dirname.\n\nIn the code: dataFile is path.join(__dirname, data.json). startedIn is process.cwd(). Both logged.\n\nA common mistake is fs.readFile(\"data.json\") from the wrong cwd.",
      code: `const path = require("path");

const dataFile = path.join(__dirname, "data.json"); // next to this file
const startedIn = process.cwd(); // wherever you launched Node

console.log(dataFile);
console.log(startedIn);` },
    { id: 81, level: "intermediate", q: "How do you write a CLI in Node?",
      a: "You parse args, print useful output, and exit with 0 on success or 1 on failure. The package.json bin field points at your script.\n\nKeep normal results on stdout and errors on stderr when you can. Do not hang waiting for a server unless that is the tool's job. A shebang line in the file tells Unix-like systems to use Node.\n\nIn the code: shebang, cmd argv[2]. If not hello, console.error and exit 1. Else hello exit 0.\n\nA common mistake is process.exit(0) after an error printed to stdout.",
      code: `#!/usr/bin/env node
const cmd = process.argv[2];

if (cmd !== "hello") {
  console.error("unknown command");
  process.exit(1);
}
console.log("hello");
process.exit(0);` },
    { id: 82, level: "intermediate", q: "What is the REPL?",
      a: "REPL means you type JavaScript one line at a time and see the result. It is a playground for trying an API quickly.\n\nIt is not how you run a real server in production. You can also embed a REPL in an app for debugging, but that is advanced. When you are stuck on a tiny expression, the REPL is faster than a full file.\n\nIn the code: n = 2+2, user Ada, twice(x) x*2, console.log twice(n) and user.name.\n\nA common mistake is using the REPL as the production process.",
      code: `// pretend lines you type in the Node playground
const n = 2 + 2;
const user = { name: "Ada" };

function twice(x) {
  return x * 2;
}
console.log(twice(n), user.name);` },
    { id: 83, level: "advanced", q: "how does require cache work?",
      a: "Node caches modules by their resolved filename. The second require gets the same exports object.\n\nThat is why a singleton in a file is shared. delete require.cache[id] is a hack used in some hot-reload tools. Prefer clear app state. Circular requires interact badly with this cache because the object may still be empty.\n\nIn the code: counter.js bump n += 1. require twice, log bump() bump() is 1 then 2, same module.\n\nA common mistake is expecting require(\"./x\") to re-run the file every time.",
      code: `// counter.js
let n = 0;
module.exports = function bump() {
  n += 1;
  return n;
};

const bump = require("./counter");
console.log(bump(), bump()); // 1 then 2, same module` },
    { id: 84, level: "intermediate", q: "circular dependencies?",
      a: "CommonJS may give you a half-finished exports object. ES modules can throw if you use a binding too early.\n\nThe real fix is to pull shared code into a third file that both import. If you see undefined functions at startup, draw the require arrows. Do not fix it by shuffling require calls randomly. Split the cycle.\n\nIn the code: priceWithTax lives in a shared helper instead of user.js requiring order.js and vice versa.\n\nA common mistake is A requires B requires A and using a function that is still undefined.",
      code: `// user.js used to require order.js and vice versa
// split shared helpers instead

function priceWithTax(cents) {
  return Math.round(cents * 1.1);
}

module.exports = { priceWithTax };` },
    { id: 85, level: "intermediate", q: "What is the difference between Node and the browser?",
      a: "The browser has document, window, and the DOM. Node does not. Node has fs, process, and Buffer. The browser does not, not in the same way.\n\nSome packages run in both, isomorphic. Many do not. You cannot paste a jQuery snippet into a server file and expect it to work. APIs you write in Express run in Node. React components run in the browser, or in SSR in both carefully.\n\nIn the code: isNode checks process.versions.node. readConfig returns browser or node with hasFs.\n\nA common mistake is using document in an Express file.",
      code: `const isNode = typeof process !== "undefined" && process.versions && process.versions.node;

function readConfig() {
  if (!isNode) return { place: "browser" };
  const fs = require("fs");
  return { place: "node", hasFs: Boolean(fs) };
}` },
    { id: 86, level: "beginner", q: "global vs globalThis?",
      a: "In Node, people used global for that object. globalThis is the standard name that also works in browsers.\n\nIn shared libraries, prefer globalThis so the same file can run in more places. Putting lots of data on global is like leaving toys in the hallway. People trip. Your app state should be a module you import, not a mystery global.\n\nIn the code: globalThis.appName Preplace. title() returns it. console.log title().\n\nA common mistake is stuffing the database pool on global.",
      code: `globalThis.appName = "Preplace";

function title() {
  return globalThis.appName;
}

console.log(title());` },
    { id: 87, level: "intermediate", q: "how do you secure headers besides helmet?",
      a: "TLS, HTTPS, usually happens at the proxy in front of Node. You can turn off x-powered-by so you leak less about the stack.\n\nCORS should be a tight list, not a wildcard with cookies. HTML pages may need a Content-Security-Policy. JSON APIs still need auth on every route. Helmet is a start. It is not the whole house.\n\nIn the code: disable x-powered-by. nosniff header. GET /api/me needLogin then { id }.\n\nA common mistake is headers only, no authorization on /api/me.",
      code: `app.disable("x-powered-by");

app.use(function (req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

app.get("/api/me", needLogin, function (req, res) {
  res.json({ id: req.user.id });
});` },
    { id: 88, level: "intermediate", q: "authorization vs authentication?",
      a: "Authentication is who are you? Login, passwords, tokens. Authorization is what may you do? Roles, ownership, admin vs user.\n\nA middleware that only checks that a token is valid is not enough. You must still check that this user owns this order. IDOR bugs are authorization bugs.\n\nIn the code: needLogin 401 if no req.user. needAdmin 403 unless role admin.\n\nA common mistake is 401 for a logged-in user who is not allowed, which should be 403.",
      code: `function needLogin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "who are you?" });
  next();
}

function needAdmin(req, res, next) {
  if (req.user.role !== "admin") return res.status(403).json({ error: "not allowed" });
  next();
}` },
    { id: 89, level: "advanced", q: "IDOR?",
      a: "The URL has /orders/123. The server loads order 123 without checking it belongs to the logged-in user. An attacker changes 123 to 124 and sees someone else's order.\n\nAlways authorize using the session user id, not only the id in the URL. Tests should try another user's id and expect 403 or 404. This is one of the most common real API bugs.\n\nIn the code: GET /orders/:id needLogin, findOrder, 404 unless order.userId === req.user.id.\n\nA common mistake is findById(req.params.id) with no owner check.",
      code: `app.get("/orders/:id", needLogin, async function (req, res) {
  const order = await db.findOrder(req.params.id);
  if (!order || order.userId !== req.user.id) {
    return res.status(404).json({ error: "not found" });
  }
  res.json(order);
});` },
    { id: 90, level: "intermediate", q: "SQL injection in Node?",
      a: "If you build SQL with string glue, a hostile name can add extra commands. The fix is parameterized queries: SQL with $1 or ? and values in a separate array.\n\nORMs help if you do not drop back into raw strings. Escape functions are not a full strategy. One concatenated WHERE clause can dump your whole table.\n\nIn the code: pool.query SELECT ... WHERE id = $1, [id]. Value stays data, not SQL.\n\nA common mistake is \"WHERE id = \" + id.",
      code: `const id = req.params.id;

// bad: "SELECT * FROM users WHERE id = " + id
const result = await pool.query(
  "SELECT id, name FROM users WHERE id = $1",
  [id] // value stays data, not SQL
);` },
    { id: 91, level: "intermediate", q: "NoSQL injection?",
      a: "If you pass req.body straight into find(), a client can send { password: { $ne: null } } and match many rows. Cast ids to the types you expect. Use a schema. Never spread user JSON into a filter blindly.\n\nMongoose can help if you keep strict schemas. Treat query objects like SQL: data in, not language in.\n\nIn the code: POST /login String(req.body.email), findOne { email }, not { ...req.body }.\n\nA common mistake is User.findOne(req.body).",
      code: `app.post("/login", async function (req, res) {
  const email = String(req.body.email || "");
  const user = await User.findOne({ email: email }); // not { ...req.body }
  res.json({ found: Boolean(user) });
});` },
    { id: 92, level: "beginner", q: "What is middleware to parse URL-encoded forms?",
      a: "Classic forms send application/x-www-form-urlencoded, not JSON. express.urlencoded reads that and fills req.body.\n\nextended: true lets nested objects parse with the qs library. You still need express.json() for JSON APIs. Put the parser above the POST route that needs it.\n\nIn the code: urlencoded extended true. POST /signup reads req.body.email from form fields.\n\nA common mistake is express.json() only, then an HTML form POST with empty body.",
      code: `app.use(express.urlencoded({ extended: true }));

app.post("/signup", function (req, res) {
  const email = req.body.email; // from <form> fields
  res.json({ email: email });
});` },
    { id: 93, level: "intermediate", q: "trust proxy?",
      a: "When nginx or a load balancer sits in front, Node sees the proxy as the client. app.set('trust proxy', 1) tells Express to trust X-Forwarded-* headers from that hop.\n\nThen req.ip and secure cookies can match the real user and HTTPS. If you trust too many hops, attackers can spoof IPs. Needed for rate limits and cookie Secure behind TLS termination.\n\nIn the code: trust proxy 1. GET /who returns { ip: req.ip }.\n\nA common mistake is trust proxy true with too many hops so clients spoof X-Forwarded-For.",
      code: `const app = express();
app.set("trust proxy", 1); // one reverse proxy in front

app.get("/who", function (req, res) {
  res.json({ ip: req.ip }); // user IP, not only the proxy
});` },
    { id: 94, level: "advanced", q: "how do you debug a slow Node API?",
      a: "Add timings around DB calls. Look for N+1 queries. Check if the event loop is delayed, CPU or sync work.\n\nEXPLAIN the SQL. Check payload size. Check missing indexes. A request id lets you match logs for one slow call. Profile only after you know whether the wait is JS, disk, or database.\n\nIn the code: GET /slow times db.query, logs ms, n, id, then JSON rows.\n\nA common mistake is rewriting Node before timing the SQL.",
      code: `app.get("/slow", async function (req, res) {
  const t0 = Date.now();
  const rows = await db.query("SELECT * FROM orders WHERE user_id = $1", [req.user.id]);
  const ms = Date.now() - t0;
  console.log({ ms: ms, n: rows.rowCount, id: req.id });
  res.json(rows.rows);
});` },
    { id: 95, level: "intermediate", q: "correlation / request id?",
      a: "You generate an id or accept X-Request-Id from a proxy. You attach it to logs and to calls to other services.\n\nWhen a user says it failed at 3pm, you search that id. Without it, JSON logs are a pile of similar lines. Put the id on the response header too so the UI can show it.\n\nIn the code: requestId sets req.id from header or Date.now, sets X-Request-Id, next(). app.use(requestId).\n\nA common mistake is logs with no request id on a 500.",
      code: `function requestId(req, res, next) {
  req.id = req.headers["x-request-id"] || String(Date.now());
  res.setHeader("X-Request-Id", req.id);
  next();
}

app.use(requestId);` },
    { id: 96, level: "intermediate", q: "What is PM2?",
      a: "PM2 is a process manager: it can restart a crashed Node app and run more than one instance. On your laptop it is optional. In some VPS setups people use it.\n\nOn Kubernetes, the platform already restarts pods, so PM2 is less common. The idea you must know is: something should restart the process and you should shut down politely. Your code still needs health checks and graceful shutdown.\n\nIn the code: listen 3000. on SIGINT server.close then exit 0 so a manager can start you again.\n\nA common mistake is PM2 plus Kubernetes both restarting in a fight.",
      code: `const server = app.listen(3000);

process.on("SIGINT", function () {
  server.close(function () {
    process.exit(0); // a manager can then start you again
  });
});` },
    { id: 97, level: "beginner", q: "How do you install a specific package version?",
      a: "You write the exact version in package.json, like 4.17.21. That is safer for tools you depend on heavily.\n\nA lockfile then records the whole tree. Ranges like ^ are convenient but can still move. Critical libraries are often pinned exactly.\n\nIn the code: dependencies.lodash 4.17.21 exact, not a range. console.log that version.\n\nA common mistake is ^ on a library you cannot afford to surprise-upgrade.",
      code: `const packageJson = {
  dependencies: {
    lodash: "4.17.21" // exact, not a range
  }
};

console.log(packageJson.dependencies.lodash);` },
    { id: 98, level: "advanced", q: "supply-chain risk?",
      a: "A hijacked or malicious package runs on your machine and in your build. Fewer dependencies means a smaller attack surface.\n\nLock versions. Review new packages. Do not give install scripts free rein in CI if you can avoid it. You cannot audit the whole internet, so be picky. Pinning and lockfiles make surprise upgrades less likely.\n\nIn the code: only express 4.19.2 listed. require(\"express\") that you listed.\n\nA common mistake is adding a tiny helper that pulls 200 unknown packages.",
      code: `const packageJson = {
  dependencies: {
    express: "4.19.2"
  }
};

// only require what you listed
const express = require("express");
const app = express();` },
    { id: 99, level: "intermediate", q: "How do you document an Express API?",
      a: "Write the paths, methods, example JSON, and error shapes. OpenAPI/Swagger is a common format. Keep it near the code or generate it.\n\nDocument 401 and 404, not only the happy 200. If the front end guesses field names, you will break silently. A short example beats a long vague paragraph.\n\nIn the code: spec POST /users body email, 201 id email, 400 email required.\n\nA common mistake is docs that only show 200.",
      code: `const spec = {
  path: "/users",
  method: "POST",
  body: { email: "ada@test.com" },
  responses: {
    201: { id: 1, email: "ada@test.com" },
    400: { error: "email required" }
  }
};` },
    { id: 100, level: "advanced", q: "How would you design a production Express service?",
      a: "Config from env. Structured logs with request ids. Health and ready checks. Timeouts, validation, authentication and authorization, rate limits.\n\nGraceful shutdown, tests, and a reverse proxy for TLS. Metrics and traces so a 500 is not a mystery. Mention one trade-off, like how you store sessions, so you sound like you have shipped something.\n\nIn the code: boot throws if DATABASE_URL missing. express.json(). GET /healthz ok. listen PORT or 3000.\n\nA common mistake is listing ten frameworks and skipping health checks and shutdown.",
      code: `function boot() {
  if (!process.env.DATABASE_URL) throw new Error("missing db");
  const app = express();
  app.use(express.json());
  app.get("/healthz", function (req, res) { res.send("ok"); });
  return app.listen(process.env.PORT || 3000);
}

boot();` },
  ]
};
