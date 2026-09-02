const fs = require("fs");
const path = require("path");

const dump = (id, data) => {
  fs.writeFileSync(
    path.join(__dirname, "..", "data", `${id}.js`),
    `window.PREP_DATA = window.PREP_DATA || {};\nwindow.PREP_DATA[${JSON.stringify(id)}] = ${JSON.stringify(data, null, 2)};\n`
  );
};

const Q = (id, level, q, a, code) => ({ id, level, q, a, code });
const N = (title, body) => ({ title, body });
const E = (title, desc, code, lang = "js") => ({ title, lang, desc, code });

dump("practice-frontend", {
  kind: "practice",
  notes: [
    N("How to use this lab", "Each problem is a small complete function. Code is on the left. The green text on the right is the easy meaning of that same line. Copy it, run it, then hide it and write it again."),
    N("Todo + CRUD", "Create is add. Read is show. Update is edit or tick. Delete is remove. Start in an array. Then save to localStorage."),
    N("Auth", "Authentication is login — who you are. Authorization is the role check — what you may do. Hiding a button is not real security."),
    N("HTTPS", "https:// encrypts the request. Never put API keys in frontend code. Never post a password to http://."),
    N("Build order", "Array todo → localStorage → form check → fake login → hide admin actions → fetch HTTPS.")
  ],
  examples: [
    E("Todo CRUD in one file", "Four named functions. One job each. Refresh still wipes the array until you add localStorage.", `let todos = [];  // the list lives in memory

function createTodo(text) {
  const title = String(text || "").trim();  // drop extra spaces
  if (!title) return null;  // empty text is not a task
  const item = { id: Date.now(), text: title, done: false };  // one task object
  todos.push(item);  // Create — add to the list
  return item;
}

function readTodos() {
  return todos.slice();  // Read — a copy so callers cannot break the list
}

function updateTodo(id, changes) {
  todos = todos.map((t) => t.id === id ? { ...t, ...changes } : t);  // Update — only the matching id
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);  // Delete — drop that id
}`),
    E("Save and load", "localStorage keeps text after refresh.", `function saveTodos(list) {
  localStorage.setItem("todos", JSON.stringify(list));  // save as text
}

function loadTodos() {
  const raw = localStorage.getItem("todos") || "[]";  // missing key means empty list
  return JSON.parse(raw);  // text back into objects
}`),
    E("Fake login", "Authentication on the client for practice. A real app calls POST /login.", `function login(email, password) {
  const ok = email === "ada@test.com" && password === "secret";  // check both fields
  if (!ok) return false;  // wrong email or password
  localStorage.setItem("token", "ada-ok");  // remember login
  return true;
}

function logout() {
  localStorage.removeItem("token");  // forget login
}`),
    E("Hide admin delete", "Authorization on the screen only. The server must still check.", `function canDelete(role) {
  return role === "admin";  // only admin may delete
}

function renderDelete(role) {
  if (!canDelete(role)) return "";  // user does not see the button
  return "<button>Delete</button>";  // admin sees it
}`),
    E("Fetch on HTTPS", "The browser asks a public API on the encrypted path.", `async function loadOneTodo() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");  // HTTPS request
  if (!res.ok) throw new Error("load failed");  // 404 or 500
  const todo = await res.json();  // body → object
  return todo.title;
}`),
    E("Protected page", "No token means guest — send them to login.", `function canOpenApp() {
  return Boolean(localStorage.getItem("token"));  // logged in?
}

function guard() {
  if (!canOpenApp()) location.hash = "#/login";  // bounce guests
}`),
    E("Call the API with a token", "Every request after login carries Authorization.", `function api(url, opts) {
  const token = localStorage.getItem("token");  // ticket from login
  return fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,  // send the ticket
      ...(opts && opts.headers)
    }
  });
}`),
    E("Form check", "Do not save an empty title.", `function addFromForm(title) {
  const text = String(title || "").trim();  // drop spaces
  if (!text) return "type a task";  // show this under the input
  todos.push({ id: Date.now(), text, done: false });  // Create
  return "ok";
}`)
  ],
  questions: [
    Q(1, "beginner", "Practice: add a todo", "Create a task object and push it. That is Create.", `function addTodo(text) {
  const title = String(text || "").trim();  // drop extra spaces
  if (!title) return null;  // empty text is not a task
  const item = { id: Date.now(), text: title, done: false };  // id, text, not done yet
  todos.push(item);  // Create — add to the list
  return item;
}`),
    Q(2, "beginner", "Practice: show all todos", "Read the array and print each text.", `function showTodos(list) {
  list.forEach((t) => {
    console.log(t.text);  // Read — one line per task
  });
}`),
    Q(3, "beginner", "Practice: mark a todo done", "Map the list. Flip done on that id.", `function markDone(id) {
  todos = todos.map((t) => {
    if (t.id !== id) return t;  // not this one — keep it
    return { ...t, done: true };  // Update — tick it
  });
}`),
    Q(4, "beginner", "Practice: delete a todo", "Filter out the id.", `function removeTodo(id) {
  todos = todos.filter((t) => t.id !== id);  // Delete — drop this id
}`),
    Q(5, "beginner", "Practice: keep todos after refresh", "JSON.stringify into localStorage. Parse on load.", `function saveTodos(list) {
  localStorage.setItem("todos", JSON.stringify(list));  // save as text
}

function loadTodos() {
  const raw = localStorage.getItem("todos") || "[]";  // empty if first visit
  return JSON.parse(raw);  // text back into objects
}`),
    Q(6, "beginner", "Practice: reject an empty todo", "trim first. If nothing left, do not push.", `function addSafe(text) {
  const title = String(text || "").trim();  // drop spaces
  if (!title) return "type a task";  // validation failed
  todos.push({ id: Date.now(), text: title, done: false });  // Create
  return "ok";
}`),
    Q(7, "intermediate", "Practice: fake email/password login", "If both match, save a token. Else return false.", `function login(email, password) {
  const ok = email === "ada@test.com" && password === "secret";  // authentication
  if (!ok) return false;  // wrong pair
  localStorage.setItem("token", "ada-ok");  // remember login
  return true;
}`),
    Q(8, "intermediate", "Practice: log out", "Remove the token and send the user to login.", `function logout() {
  localStorage.removeItem("token");  // forget login
  location.hash = "#/login";  // go to the login screen
}`),
    Q(9, "intermediate", "Practice: only admin can delete", "Check role before you change the list.", `function removeIfAdmin(id, role) {
  if (role !== "admin") return "not allowed";  // authorization
  todos = todos.filter((t) => t.id !== id);  // Delete
  return "ok";
}`),
    Q(10, "intermediate", "Practice: fetch todos from HTTPS", "await fetch, then json. Handle a failed status.", `async function loadTodos() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");  // HTTPS
  if (!res.ok) throw new Error("load failed");  // 404 or 500
  return res.json();  // body → list
}`),
    Q(11, "intermediate", "Practice: POST a todo to an API", "JSON body + Bearer token. Always HTTPS in production.", `async function createOnServer(text, token) {
  const res = await fetch("https://api.example.com/todos", {
    method: "POST",  // Create on the server
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token  // login ticket
    },
    body: JSON.stringify({ text })  // the new task
  });
  if (!res.ok) throw new Error("create failed");
  return res.json();
}`),
    Q(12, "beginner", "Practice: filter incomplete todos", "Keep only done === false.", `function openTodos(list) {
  return list.filter((t) => !t.done);  // still to do
}`),
    Q(13, "intermediate", "Practice: edit todo text", "Map and replace text for that id.", `function renameTodo(id, text) {
  const title = String(text || "").trim();  // drop spaces
  if (!title) return;  // do not save empty
  todos = todos.map((t) => t.id === id ? { ...t, text: title } : t);  // Update
}`),
    Q(14, "advanced", "Practice: optimistic add", "Push locally first. If POST fails, remove it.", `async function addOptimistic(text) {
  const temp = { id: Date.now(), text, done: false };  // show it now
  todos.push(temp);  // Create on the screen
  try {
    await api("/todos", { method: "POST", body: JSON.stringify(temp) });  // then tell the server
  } catch (err) {
    todos = todos.filter((t) => t.id !== temp.id);  // undo if the server said no
  }
}`),
    Q(15, "beginner", "Why HTTPS on the login form?", "Passwords must not travel as plain HTTP.", `function sendLogin(form) {
  return fetch("https://api.example.com/login", {
    method: "POST",  // HTTPS — the padlock path
    body: form
  });
}`),
    Q(16, "intermediate", "Practice: attach a token on every request", "A helper that adds Authorization.", `function api(url, opts) {
  const token = localStorage.getItem("token");  // ticket from login
  return fetch(url, {
    ...(opts || {}),
    headers: {
      Authorization: "Bearer " + token,  // send it every time
      ...((opts && opts.headers) || {})
    }
  });
}`),
    Q(17, "beginner", "Practice: show a loading state", "True before fetch, false after.", `async function loadWithSpinner() {
  let loading = true;  // show the spinner
  try {
    return await loadTodos();  // wait for the list
  } finally {
    loading = false;  // hide the spinner
  }
}`),
    Q(18, "intermediate", "Practice: CORS from the UI side", "Call same-origin /api and let Vite proxy it.", `async function loadViaProxy() {
  const res = await fetch("/api/todos");  // same origin — Vite sends this to :3000
  if (!res.ok) throw new Error("load failed");
  return res.json();
}`)
  ]
});

dump("practice-backend", {
  kind: "practice",
  notes: [
    N("How to use this lab", "Express functions with easy comments on the right. Run with node. Hash passwords. Check roles on the server."),
    N("CRUD API", "GET list, POST create, PATCH update, DELETE remove."),
    N("Auth", "Signup hashes. Login compares and returns a JWT. Middleware reads the token. Admin is a second check."),
    N("HTTPS", "Nginx or the host terminates TLS. The app can speak HTTP on localhost behind it."),
    N("Build order", "In-memory CRUD → hash login → role middleware → SQL → HTTPS in front.")
  ],
  examples: [
    E("In-memory todo API", "Four routes. Data lives in an array until restart.", `const todos = [];  // memory list — gone on restart

app.get("/todos", function (req, res) {
  res.json(todos);  // Read — send the list
});

app.post("/todos", function (req, res) {
  const text = String(req.body.text || "").trim();  // drop spaces
  if (!text) return res.status(400).json({ error: "text required" });  // bad input
  const item = { id: Date.now(), text, done: false };  // new task
  todos.push(item);  // Create
  res.status(201).json(item);  // created
});`),
    E("Hash a password", "bcrypt turns a password into a scramble.", `async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);  // save this, never the real password
}

async function checkPassword(plain, hash) {
  return bcrypt.compare(plain, hash);  // true if they match
}`),
    E("JWT login", "Sign a token after a good password check.", `function makeToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },  // who they are
    process.env.JWT_SECRET,  // server secret — not in Git
    { expiresIn: "1d" }
  );
}`),
    E("Auth middleware", "No token or bad token → 401.", `function auth(req, res, next) {
  const header = req.headers.authorization || "";  // Bearer xxx
  const token = header.replace("Bearer ", "");  // just the ticket
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);  // ticket is real
    next();  // go on to the route
  } catch (err) {
    res.status(401).json({ error: "login first" });  // we do not know you
  }
}`),
    E("Admin only", "Authorization after authentication.", `function admin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "forbidden" });  // we know you — you may not
  }
  next();
}

app.delete("/todos/:id", auth, admin, deleteHandler);  // login, then admin, then delete`),
    E("HTTPS behind Nginx", "App on 3000. Nginx does 443.", `server {
  listen 443 ssl;  # HTTPS port
  ssl_certificate /etc/letsencrypt/live/ex/fullchain.pem;  # public cert
  ssl_certificate_key /etc/letsencrypt/live/ex/privkey.pem;  # private key
  location / {
    proxy_pass http://127.0.0.1:3000;  # send traffic to Node
  }
}`, "txt"),
    E("SQL CRUD", "Parameterized queries. Never glue user text into SQL.", `async function insertTodo(userId, text) {
  const q = "INSERT INTO todos(user_id, text) VALUES ($1, $2) RETURNING *";  // Create
  const { rows } = await db.query(q, [userId, text]);  // $1 $2 stop SQL injection
  return rows[0];
}`),
    E("CORS for a React app", "Allow the UI origin only.", `app.use(cors({
  origin: "https://app.example.com",  // this UI only
  credentials: true  // allow cookies
}));`)
  ],
  questions: [
    Q(1, "beginner", "Practice: GET /todos", "Return the list as JSON.", `app.get("/todos", function (req, res) {
  res.json(todos);  // Read
});`),
    Q(2, "beginner", "Practice: POST /todos", "Read body.text. Push. Send 201.", `app.post("/todos", function (req, res) {
  const text = String(req.body.text || "").trim();  // drop spaces
  if (!text) return res.status(400).json({ error: "text required" });  // bad input
  const item = { id: Date.now(), text, done: false };
  todos.push(item);  // Create
  res.status(201).json(item);  // created
});`),
    Q(3, "beginner", "Practice: PATCH /todos/:id", "Find by id. Change text or done.", `app.patch("/todos/:id", function (req, res) {
  const id = Number(req.params.id);  // /todos/12 → 12
  const t = todos.find((x) => x.id === id);  // Read one
  if (!t) return res.status(404).json({ error: "missing" });  // unknown id
  if (req.body.done !== undefined) t.done = req.body.done;  // Update
  res.json(t);
});`),
    Q(4, "beginner", "Practice: DELETE /todos/:id", "Filter the array. Send 204.", `app.delete("/todos/:id", function (req, res) {
  const id = Number(req.params.id);
  todos = todos.filter((x) => x.id !== id);  // Delete
  res.status(204).end();  // nothing to send back
});`),
    Q(5, "intermediate", "Practice: signup with hashed password", "Hash, then INSERT. Never save the raw password.", `async function signup(email, password) {
  const hash = await bcrypt.hash(password, 10);  // scramble
  await db.query(
    "INSERT INTO users(email, hash) VALUES ($1, $2)",  // Create user
    [email, hash]
  );
}`),
    Q(6, "intermediate", "Practice: login", "Find user. compare hash. Return a JWT.", `async function login(req, res) {
  const { email, password } = req.body;
  const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);  // Read user
  const user = rows[0];
  if (!user) return res.status(401).json({ error: "bad login" });  // unknown email
  const ok = await bcrypt.compare(password, user.hash);  // check scramble
  if (!ok) return res.status(401).json({ error: "bad login" });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });  // give the ticket to the client
}`),
    Q(7, "intermediate", "Practice: protect a route", "auth middleware, then handler.", `app.get("/me", auth, function (req, res) {
  res.json({ id: req.user.id });  // who is logged in
});`),
    Q(8, "intermediate", "Practice: only owner can delete", "Compare user_id to req.user.id.", `async function deleteMine(req, res) {
  const row = await findTodo(req.params.id);
  if (!row) return res.status(404).json({ error: "missing" });
  if (row.user_id !== req.user.id) {
    return res.status(403).json({ error: "not yours" });  // authorization
  }
  await db.query("DELETE FROM todos WHERE id = $1", [row.id]);  // Delete
  res.status(204).end();
}`),
    Q(9, "intermediate", "Practice: admin role", "403 if role is not admin.", `function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "admins only" });  // authorization
  }
  next();
}`),
    Q(10, "beginner", "Practice: 400 on bad input", "Empty text is not a todo.", `function readTitle(body) {
  const text = String(body.text || "").trim();  // drop spaces
  if (!text) {
    const err = new Error("text required");
    err.status = 400;  // bad input
    throw err;
  }
  return text;
}`),
    Q(11, "advanced", "Practice: HTTPS redirect", "If the proxy says http, send them to https.", `function forceHttps(req, res, next) {
  if (req.headers["x-forwarded-proto"] === "http") {
    return res.redirect(301, "https://" + req.headers.host + req.url);  // upgrade to TLS
  }
  next();
}`),
    Q(12, "intermediate", "Practice: cookie session", "httpOnly cookie so JS cannot read it.", `function setSession(res, sessionId) {
  res.cookie("sid", sessionId, {
    httpOnly: true,  // JS in the page cannot read this
    secure: true,  // HTTPS only
    sameSite: "lax"  // basic CSRF help
  });
}`),
    Q(13, "beginner", "401 vs 403?", "401 means we do not know who you are. 403 means we know and you may not.", `res.status(401).json({ error: "login" });  // authentication failed
res.status(403).json({ error: "forbidden" });  // authorization failed`),
    Q(14, "intermediate", "Practice: list only my todos", "WHERE user_id = $1.", `async function listMine(req, res) {
  const q = "SELECT * FROM todos WHERE user_id = $1";  // never the whole table
  const { rows } = await db.query(q, [req.user.id]);
  res.json(rows);  // Read
}`),
    Q(15, "advanced", "Practice: rate limit login", "Count attempts in Redis. 429 if too many.", `async function limitLogin(ip, res) {
  const n = await redis.incr("login:" + ip);  // one more try
  if (n === 1) await redis.expire("login:" + ip, 60);  // window is 60 seconds
  if (n > 10) return res.status(429).json({ error: "slow down" });  // too many
}`),
    Q(16, "beginner", "Why not trust req.body.role?", "Anyone can POST role: admin. Set role in the database only.", `function newUser(email, hash) {
  return { email, hash, role: "user" };  // never take role from the client
}`),
    Q(17, "intermediate", "Practice: CORS + credentials", "Exact origin, not *, if you send cookies.", `app.use(cors({
  origin: "https://app.example.com",  // this UI only
  credentials: true
}));`),
    Q(18, "beginner", "Practice: health check", "A cheap GET so the host knows the process is up.", `app.get("/health", function (req, res) {
  res.json({ ok: true });  // I am alive
});`)
  ]
});

dump("practice-mern", {
  kind: "practice",
  notes: [
    N("How to use this lab", "MERN glues React to Express to Mongo. Each snippet is a complete function with easy comments on the right."),
    N("One todo app", "React shows the list. Express has /api/todos. Mongo stores documents. JWT in Authorization."),
    N("CORS", "Vite on 5173 cannot call 3000 until you proxy /api or the server allows the origin."),
    N("HTTPS live", "UI on Vercel. API on Render. Mongo Atlas uses TLS. No http:// in production."),
    N("Build order", "Mongo API → React list → create form → JWT login → owner delete → deploy HTTPS.")
  ],
  examples: [
    E("Mongo todo model", "One document per task.", `async function insertTodo(userId, text) {
  const doc = { text, done: false, userId };  // one task
  await db.collection("todos").insertOne(doc);  // Create
  return doc;
}`),
    E("Express list for this user", "Filter by userId from the token.", `app.get("/api/todos", auth, async function (req, res) {
  const items = await db.collection("todos")
    .find({ userId: req.user.id })  // only my tasks
    .toArray();
  res.json(items);  // Read
});`),
    E("React load todos", "fetch with the token, then setState.", `function useTodos(token) {
  const [todos, setTodos] = useState([]);  // list on the screen
  useEffect(function () {
    fetch("/api/todos", {
      headers: { Authorization: "Bearer " + token }  // login ticket
    })
      .then(function (res) { return res.json(); })
      .then(setTodos);  // draw the list
  }, [token]);
  return todos;
}`),
    E("React add todo", "POST JSON, then clear the input.", `async function addTodo(text, token, setText) {
  await fetch("/api/todos", {
    method: "POST",  // Create
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ text })
  });
  setText("");  // clear the form
}`),
    E("Vite proxy", "Dev: /api goes to Express.", `export default {
  server: {
    proxy: { "/api": "http://localhost:3000" }  // browser stays same-origin
  }
};`),
    E("Mongo unique email", "Index so two people cannot share an email.", `await db.collection("users").createIndex(
  { email: 1 },
  { unique: true }  // second signup with same email fails
);`),
    E("React private route", "No token → login page.", `function Private({ children }) {
  const token = localStorage.getItem("token");  // logged in?
  if (!token) return <Navigate to="/login" />;  // bounce guests
  return children;
}`),
    E("HTTPS API url", "Production fetch uses https or same-origin /api.", `const API = import.meta.env.VITE_API || "";  // https://api.onrender.com`)
  ],
  questions: [
    Q(1, "beginner", "Practice: Mongo insert a todo", "insertOne with text, done, userId.", `async function createTodo(userId, text) {
  const doc = { text, done: false, userId };
  await db.collection("todos").insertOne(doc);  // Create
  return doc;
}`),
    Q(2, "beginner", "Practice: Express GET /api/todos", "find({ userId }).toArray().", `app.get("/api/todos", auth, async function (req, res) {
  const items = await db.collection("todos")
    .find({ userId: req.user.id })  // only mine
    .toArray();
  res.json(items);  // Read
});`),
    Q(3, "beginner", "Practice: Express POST /api/todos", "Validate text. insertOne. 201.", `app.post("/api/todos", auth, async function (req, res) {
  const text = String(req.body.text || "").trim();
  if (!text) return res.status(400).json({ error: "text required" });  // bad input
  const doc = { text, done: false, userId: req.user.id };
  await db.collection("todos").insertOne(doc);  // Create
  res.status(201).json(doc);
});`),
    Q(4, "intermediate", "Practice: React TodoList", "useState + useEffect load.", `function TodoList() {
  const [todos, setTodos] = useState([]);  // list on the screen
  useEffect(function () {
    api("/api/todos")
      .then(function (res) { return res.json(); })
      .then(setTodos);  // Read
  }, []);
  return todos.map((t) => <p key={t._id}>{t.text}</p>);
}`),
    Q(5, "intermediate", "Practice: React add form", "preventDefault, POST, clear input.", `async function onSubmit(e, text, setText) {
  e.preventDefault();  // do not reload the page
  await api("/api/todos", {
    method: "POST",
    body: JSON.stringify({ text })  // Create
  });
  setText("");  // clear the box
}`),
    Q(6, "intermediate", "Practice: MERN signup", "Hash, insert user, return JWT.", `async function signup(req, res) {
  const hash = await bcrypt.hash(req.body.password, 10);  // scramble
  const result = await db.collection("users").insertOne({
    email: req.body.email,
    hash,
    role: "user"  // never take role from the client
  });
  const token = jwt.sign(
    { id: String(result.insertedId), role: "user" },
    process.env.JWT_SECRET
  );
  res.json({ token });
}`),
    Q(7, "intermediate", "Practice: MERN login page", "POST /api/login, save token, go to /todos.", `async function onLogin(email, password, navigate, setErr) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) return setErr(data.error);  // show the server message
  localStorage.setItem("token", data.token);  // remember login
  navigate("/todos");
}`),
    Q(8, "intermediate", "Practice: owner-only delete", "deleteOne { _id, userId }.", `app.delete("/api/todos/:id", auth, async function (req, res) {
  const r = await db.collection("todos").deleteOne({
    _id: new ObjectId(req.params.id),
    userId: req.user.id  // authorization — must be mine
  });
  if (!r.deletedCount) return res.status(404).json({ error: "missing" });
  res.status(204).end();
});`),
    Q(9, "intermediate", "Practice: admin list all todos", "auth + admin. find({}) only for admin.", `app.get("/api/admin/todos", auth, async function (req, res) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "forbidden" });  // authorization
  }
  res.json(await db.collection("todos").find().toArray());  // all rows
});`),
    Q(10, "beginner", "Practice: Vite proxy so CORS is quiet", "server.proxy /api → 3000.", `export default {
  server: { proxy: { "/api": "http://localhost:3000" } }  // same-origin in dev
};`),
    Q(11, "beginner", "Practice: tick done from React", "PATCH /api/todos/:id { done: true }.", `async function tick(id) {
  await api("/api/todos/" + id, {
    method: "PATCH",  // Update
    body: JSON.stringify({ done: true })
  });
}`),
    Q(12, "advanced", "Practice: HTTPS split deploy", "CORS origin is the Vercel URL.", `app.use(cors({
  origin: "https://my-app.vercel.app"  // live UI only
}));`),
    Q(13, "intermediate", "Practice: Mongo unique email error", "Catch 11000 and send 409.", `async function createUser(email, hash) {
  try {
    await db.collection("users").insertOne({ email, hash });
  } catch (err) {
    if (err.code === 11000) {
      const e = new Error("email taken");
      e.status = 409;  // already exists
      throw e;
    }
    throw err;
  }
}`),
    Q(14, "beginner", "Practice: show 401 in React", "Clear token and go to login.", `function handleAuth(res, navigate) {
  if (res.status === 401) {
    localStorage.removeItem("token");  // ticket is dead
    navigate("/login");
  }
}`),
    Q(15, "advanced", "Practice: cookie + CORS for MERN", "credentials: include on fetch.", `await fetch("/api/me", { credentials: "include" });  // send the cookie`),
    Q(16, "beginner", "What is the M in MERN here?", "MongoDB holds users and todos as documents.", `const user = await db.collection("users").findOne({ email });  // Read one user`),
    Q(17, "intermediate", "Practice: ObjectId check", "Invalid id → 400, not a crash.", `function readId(id) {
  if (!ObjectId.isValid(id)) {
    const err = new Error("bad id");
    err.status = 400;  // not a real Mongo id
    throw err;
  }
  return new ObjectId(id);
}`),
    Q(18, "intermediate", "Practice: React logout", "Remove token, clear user, go to login.", `function logout(setUser, navigate) {
  localStorage.removeItem("token");  // forget login
  setUser(null);  // clear the screen
  navigate("/login");
}`)
  ]
});

dump("practice-fullstack", {
  kind: "practice",
  notes: [
    N("How to use this lab", "One feature from the button to the SQL row. Easy comments on the right of each line."),
    N("Stack", "React UI, Express API, Postgres, optional Redis session, HTTPS on the host."),
    N("Auth vs authz", "Login is authentication. 'this todo is mine' is authorization."),
    N("HTTPS", "Users type https://. Cookies use Secure. No mixed content."),
    N("Build order", "SQL tables → CRUD API → React list → cookie login → owner checks → HTTPS.")
  ],
  examples: [
    E("Tables", "Users and todos with a foreign key.", `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,  -- one email per person
  hash TEXT NOT NULL,  -- scrambled password
  role TEXT NOT NULL DEFAULT 'user'
);

CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),  -- must be a real user
  text TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false
);`, "sql"),
    E("Full create path", "React POST → Express → INSERT → JSON back.", `async function addFromUi(text, token) {
  await fetch("/api/todos", {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
    body: JSON.stringify({ text })  // Create from the screen
  });
}

async function addOnServer(userId, text) {
  const q = "INSERT INTO todos(user_id, text) VALUES ($1, $2)";  // Create in SQL
  await db.query(q, [userId, text]);
}`),
    E("Cookie login", "Session id in httpOnly cookie.", `async function login(req, res) {
  const user = await findUser(req.body.email);
  const ok = user && await bcrypt.compare(req.body.password, user.hash);
  if (!ok) return res.status(401).json({ error: "bad login" });
  req.session.userId = user.id;  // remember on the server
  res.json({ ok: true });
}`),
    E("Owner check", "AND user_id on UPDATE and DELETE.", `async function deleteMine(id, userId) {
  const q = "DELETE FROM todos WHERE id = $1 AND user_id = $2";  // authorization
  const { rowCount } = await db.query(q, [id, userId]);
  return rowCount;  // 0 means not yours or missing
}`),
    E("HTTPS cookie flags", "secure + httpOnly + sameSite.", `res.cookie("sid", sid, {
  httpOnly: true,  // JS cannot read it
  secure: true,  // HTTPS only
  sameSite: "lax"
});`),
    E("React error shape", "API always { error: string }.", `async function readList(setTodos, setErr) {
  const res = await fetch("/api/todos");
  const data = await res.json();
  if (!res.ok) return setErr(data.error);  // show the server words
  setTodos(data);
}`),
    E("Welcome todo in one transaction", "Both rows or neither.", `async function signupWithFirstTask(email, hash) {
  await db.query("BEGIN");  // start the bundle
  await db.query("INSERT INTO users(email, hash) VALUES ($1, $2)", [email, hash]);
  await db.query(
    "INSERT INTO todos(user_id, text) VALUES (currval('users_id_seq'), $1)",
    ["first task"]
  );
  await db.query("COMMIT");  // both exist, or neither
}`),
    E("Env for each place", "DATABASE_URL never in Git.", `const db = new Pool({
  connectionString: process.env.DATABASE_URL  // laptop vs prod
});`)
  ],
  questions: [
    Q(1, "beginner", "Practice: SQL create a todo", "INSERT with user_id from the token.", `async function createTodo(userId, text) {
  const q = "INSERT INTO todos(user_id, text) VALUES ($1, $2) RETURNING *";
  const { rows } = await db.query(q, [userId, text]);  // Create
  return rows[0];
}`),
    Q(2, "beginner", "Practice: list my todos", "SELECT ... WHERE user_id = $1.", `async function listMine(userId) {
  const q = "SELECT id, text, done FROM todos WHERE user_id = $1 ORDER BY id";
  const { rows } = await db.query(q, [userId]);  // Read — only mine
  return rows;
}`),
    Q(3, "beginner", "Practice: React page that loads them", "useEffect fetch with the token.", `useEffect(function () {
  fetch("/api/todos", {
    headers: { Authorization: "Bearer " + token }  // login ticket
  })
    .then(function (res) { return res.json(); })
    .then(setTodos);  // draw the list
}, [token]);`),
    Q(4, "intermediate", "Practice: update text or done", "UPDATE ... WHERE id AND user_id. 0 rows → 404.", `async function updateMine(id, userId, done) {
  const q = "UPDATE todos SET done = $1 WHERE id = $2 AND user_id = $3";
  const { rowCount } = await db.query(q, [done, id, userId]);  // Update + authz
  if (!rowCount) {
    const err = new Error("missing");
    err.status = 404;
    throw err;
  }
}`),
    Q(5, "intermediate", "Practice: delete mine only", "DELETE with both ids.", `async function deleteMine(id, userId) {
  await db.query(
    "DELETE FROM todos WHERE id = $1 AND user_id = $2",  // authorization
    [id, userId]
  );
}`),
    Q(6, "intermediate", "Practice: signup + first todo", "One transaction so both rows exist together.", `async function signupBundle(email, hash) {
  await db.query("BEGIN");
  await db.query("INSERT INTO users(email, hash) VALUES ($1, $2)", [email, hash]);
  await db.query("INSERT INTO todos(user_id, text) VALUES (currval('users_id_seq'), $1)", ["first task"]);
  await db.query("COMMIT");  // both or neither
}`),
    Q(7, "intermediate", "Practice: cookie session login", "Set sid after bcrypt.compare.", `async function login(req, res) {
  const user = await findUser(req.body.email);
  const ok = user && await bcrypt.compare(req.body.password, user.hash);
  if (!ok) return res.status(401).json({ error: "bad login" });  // authentication
  req.session.userId = user.id;  // remember on the server
  res.json({ ok: true });
}`),
    Q(8, "intermediate", "Practice: requireSession", "If no session, 401.", `function requireSession(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "login first" });  // authentication
  }
  next();
}`),
    Q(9, "intermediate", "Practice: admin dashboard SQL", "role from users table, not from the client.", `async function requireAdmin(req, res, next) {
  const { rows } = await db.query("SELECT role FROM users WHERE id = $1", [req.session.userId]);
  if (!rows[0] || rows[0].role !== "admin") {
    return res.status(403).json({ error: "forbidden" });  // authorization
  }
  next();
}`),
    Q(10, "beginner", "Practice: HTTPS only cookies in prod", "secure: true when NODE_ENV is production.", `res.cookie("sid", sid, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",  // HTTPS in prod
  sameSite: "lax"
});`),
    Q(11, "advanced", "Practice: block mixed content", "The React app on https:// must call https:// or same-origin /api.", `const API = "";  // same origin via proxy — safest`),
    Q(12, "beginner", "Practice: 400 validation both sides", "UI trim. Server trim again.", `function readTitle(body) {
  const text = String(body.text || "").trim();
  if (text.length < 1 || text.length > 200) {
    const err = new Error("1–200 chars");
    err.status = 400;  // bad input
    throw err;
  }
  return text;
}`),
    Q(13, "intermediate", "Practice: CSRF idea for cookie auth", "SameSite=Lax helps.", `res.cookie("sid", sid, {
  httpOnly: true,
  sameSite: "lax",  // basic CSRF help
  secure: true
});`),
    Q(14, "beginner", "Practice: health + migrate", "GET /health and a migrations folder.", `app.get("/health", async function (req, res) {
  await db.query("SELECT 1");  // database is reachable
  res.json({ ok: true });
});`),
    Q(15, "advanced", "Practice: cache list in Redis", "GET cache, else SQL, SET EX 30. DEL on write.", `async function listCached(userId) {
  const key = "todos:" + userId;
  const hit = await redis.get(key);  // fast path
  if (hit) return JSON.parse(hit);
  const { rows } = await db.query("SELECT * FROM todos WHERE user_id = $1", [userId]);
  await redis.set(key, JSON.stringify(rows), "EX", 30);  // remember 30s
  return rows;
}`),
    Q(16, "intermediate", "Practice: React empty and error states", "Show the message the user can act on.", `function List({ err, todos }) {
  if (err) return <p>{err}</p>;  // what went wrong
  if (!todos.length) return <p>no tasks yet</p>;  // empty is not an error
  return todos.map((t) => <p key={t.id}>{t.text}</p>);
}`),
    Q(17, "beginner", "End-to-end story", "Click Add → POST → INSERT → 201 → list updates.", `async function addAndTrust(text, setTodos) {
  const res = await fetch("/api/todos", {
    method: "POST",
    body: JSON.stringify({ text })
  });
  if (!res.ok) return;  // do not fake a row
  const row = await res.json();  // 201 body
  setTodos((list) => list.concat(row));
}`),
    Q(18, "intermediate", "Practice: logout everywhere", "Destroy session and clear cookie.", `function logout(req, res) {
  req.session.destroy(function () {
    res.clearCookie("sid");  // drop the cookie
    res.json({ ok: true });
  });
}`)
  ]
});

dump("practice-devops", {
  kind: "practice",
  notes: [
    N("How to use this lab", "Ship the todo API: Docker, Nginx HTTPS, a pipeline. Comments sit on the right."),
    N("HTTPS", "Certbot or a platform certificate. Redirect 80 to 443. App stays on localhost:3000."),
    N("Build order", "Dockerfile → compose with db → Nginx TLS → GitHub Actions test → deploy.")
  ],
  examples: [
    E("Dockerfile for the API", "Install, copy, listen.", `FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
CMD ["node", "server.js"]`, "txt"),
    E("Compose API + Postgres", "App waits on DATABASE_URL.", `services:
  api:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://app:app@db:5432/app
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: app`, "txt"),
    E("Nginx HTTPS", "TLS in, HTTP to Node.", `server {
  listen 443 ssl;
  ssl_certificate /etc/letsencrypt/live/ex/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/ex/privkey.pem;
  location / { proxy_pass http://127.0.0.1:3000; }
}`, "txt"),
    E("GitHub Actions test", "npm test on every push.", `on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test`, "txt"),
    E("Health for compose", "depends_on + healthcheck.", `healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 10s`, "txt"),
    E("Secrets stay out of Git", "Env file not committed.", `echo DATABASE_URL=postgres://... >> .env
echo .env >> .gitignore`, "txt"),
    E("Redirect HTTP", "80 → 443.", `server { listen 80; return 301 https://$host$request_uri; }`, "txt"),
    E("Staging basic auth", "Keep strangers off a public staging host.", `location / {
  auth_basic "staging";
  auth_basic_user_file /etc/nginx/.htpasswd;
  proxy_pass http://127.0.0.1:3000;
}`, "txt")
  ],
  questions: [
    Q(1, "beginner", "Practice: Dockerize the todo API", "FROM node, COPY, CMD node server.js.", `FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
CMD ["node","server.js"]`),
    Q(2, "beginner", "Practice: /health", "Return 200 { ok: true }.", `app.get("/health", function (req, res) {
  res.json({ ok: true });  // host pings this
});`),
    Q(3, "intermediate", "Practice: compose with Postgres", "DATABASE_URL uses host db.", `DATABASE_URL=postgres://app:app@db:5432/app`),
    Q(4, "intermediate", "Practice: Nginx TLS for the API", "listen 443 ssl; proxy_pass 3000.", `location / { proxy_pass http://127.0.0.1:3000; }`),
    Q(5, "beginner", "Practice: HTTP to HTTPS redirect", "return 301 https://$host$request_uri.", `server { listen 80; return 301 https://$host$request_uri; }`),
    Q(6, "intermediate", "Practice: CI that runs tests", "GitHub Actions npm test.", `- run: npm ci && npm test`),
    Q(7, "intermediate", "Practice: do not leak .env", ".gitignore and no secrets in the image.", `.env`),
    Q(8, "advanced", "Practice: rolling deploy idea", "Wait /health, switch Nginx, stop old.", `# wait until curl -f https://host/health`),
    Q(9, "beginner", "Practice: log without passwords", "Log user id, not req.body.password.", `console.log("login", { userId: user.id });  // never the password`),
    Q(10, "intermediate", "Practice: staging lock", "htpasswd in front of staging.", `auth_basic "staging";`),
    Q(11, "advanced", "Practice: image tags", "Deploy :gitsha not only :latest.", `docker build -t api:$GITHUB_SHA .`),
    Q(12, "beginner", "Why HTTPS on the todo login?", "TLS stops the password sitting in clear text.", `listen 443 ssl;`),
    Q(13, "intermediate", "Practice: multi-stage image", "Build with devDeps, run without them.", `FROM node:22-alpine AS run
COPY --from=build /app /app`),
    Q(14, "intermediate", "Practice: compose down volumes", "-v wipes the database volume.", `docker compose down`),
    Q(15, "beginner", "Practice: pin base images", "node:22-alpine not node:latest.", `FROM node:22-alpine`),
    Q(16, "advanced", "Practice: cert renewal", "certbot renew + nginx reload.", `certbot renew --quiet && nginx -s reload`),
    Q(17, "intermediate", "Practice: fail CI on lint", "npm run lint must exit non-zero.", `"lint": "eslint ."`),
    Q(18, "beginner", "Practice: expose only 443", "Do not publish 3000 to the world.", `ports: ["127.0.0.1:3000:3000"]`)
  ]
});

dump("practice-cloud", {
  kind: "practice",
  notes: [
    N("How to use this lab", "Tiny AWS tasks around a todo/login app. Free tier plus a billing alarm."),
    N("HTTPS", "CloudFront or an ALB. ACM certificate on the load balancer."),
    N("IAM vs app auth", "IAM is for AWS APIs. Your todo users are JWT or Cognito, not IAM users.")
  ],
  examples: [
    E("S3 + CloudFront HTTPS", "Static files. HTTPS at the edge.", `// CloudFront origin = S3 bucket
// Alternate domain + ACM cert = https://app.example.com`, "txt"),
    E("Lambda todo GET", "Handler returns JSON. API Gateway is HTTPS.", `exports.handler = async function () {
  return {
    statusCode: 200,
    body: JSON.stringify([{ id: 1, text: "read" }])  // Read
  };
};`),
    E("RDS URL", "Same SQL as laptop, different host.", `postgres://app:pass@xxx.rds.amazonaws.com:5432/app`, "txt"),
    E("IAM policy snippet", "One bucket, read only.", `{
  "Effect": "Allow",
  "Action": ["s3:GetObject"],
  "Resource": "arn:aws:s3:::my-app-uploads/*"
}`, "txt"),
    E("Presigned upload", "Browser PUTs to S3 over HTTPS without your AWS keys.", `async function uploadUrl(Bucket, Key) {
  return s3.getSignedUrlPromise("putObject", { Bucket, Key, Expires: 60 });
}`),
    E("Secrets as env", "DATABASE_URL from secrets manager.", `const url = process.env.DATABASE_URL;  // not a file in Git`),
    E("Force HTTPS on CloudFront", "Redirect HTTP to HTTPS.", `ViewerProtocolPolicy: redirect-to-https`, "txt"),
    E("Security group", "443 from world. 5432 only from the API SG.", `ALB :443 0.0.0.0/0
RDS :5432 sg-api-only`, "txt")
  ],
  questions: [
    Q(1, "beginner", "Practice: static todo UI on S3 + HTTPS", "Bucket for files. CloudFront + ACM for https://.", `// upload dist/ to S3
// CloudFront default root index.html`),
    Q(2, "beginner", "Practice: Lambda hello HTTPS", "API Gateway → Lambda → { ok: true }.", `exports.handler = async function () {
  return { statusCode: 200, body: "{\"ok\":true}" };
};`),
    Q(3, "intermediate", "Practice: RDS for todos", "Same INSERT as local, host is RDS.", `await db.query("INSERT INTO todos(text) VALUES ($1)", [text]);  // Create`),
    Q(4, "intermediate", "Practice: IAM for the API box", "Role with s3:PutObject on one prefix.", `// use the instance / task role — no access keys in code`),
    Q(5, "intermediate", "Practice: Cognito or JWT", "Your users are not IAM users.", `const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);`),
    Q(6, "beginner", "Practice: security group for SSH", "22 from your IP only.", `22 tcp your.ip/32`),
    Q(7, "advanced", "Practice: private RDS", "No public IP on RDS.", `// RDS in private subnets`),
    Q(8, "intermediate", "Practice: HTTPS redirect at the edge", "ALB or CloudFront viewer policy.", `redirect-to-https`),
    Q(9, "beginner", "Practice: billing alarm", "Alarm if estimated charges > $5.", `// console: Billing → Budgets`),
    Q(10, "intermediate", "Practice: upload avatar via presign", "API makes URL. Browser PUT to S3 HTTPS.", `res.json({ url });  // browser PUTs the file`),
    Q(11, "advanced", "Practice: secrets", "JWT_SECRET in Secrets Manager.", `const secret = process.env.JWT_SECRET;`),
    Q(12, "beginner", "IAM vs app authorization?", "IAM = who may call AWS. App role = who may delete a todo.", `if (req.user.role !== "admin") return res.status(403).end();  // app authz`),
    Q(13, "intermediate", "Practice: CORS on API Gateway", "Allow the CloudFront origin only.", `Access-Control-Allow-Origin: https://app.example.com`),
    Q(14, "beginner", "Practice: do not commit keys", "If you leaked a key, rotate it.", `aws iam create-access-key`),
    Q(15, "advanced", "Practice: WAF sketch", "Rate limit login at the edge.", `# AWS WAF rate-based rule on /login`),
    Q(16, "intermediate", "Practice: HTTPS health to ALB", "Target group /health on 3000. ALB 443.", `GET /health → 200`),
    Q(17, "beginner", "S3 vs RDS for todos?", "Todos are rows. S3 is files.", `-- todos live in RDS`),
    Q(18, "intermediate", "Practice: logout / revoke", "Short JWT TTL, or Cognito global sign-out.", `res.clearCookie("sid");`)
  ]
});

dump("practice-ml", {
  kind: "practice",
  notes: [
    N("How to use this lab", "Train → save → predict. Then wrap predict in a small HTTPS API with a key."),
    N("CRUD of a model", "Create = train. Read = load + predict. Update = retrain. Delete = drop the file."),
    N("Auth", "A predict API still needs a key so strangers do not burn your CPU.")
  ],
  examples: [
    E("Train a tiny yes/no model", "sklearn on two numbers.", `from sklearn.linear_model import LogisticRegression
X = [[0], [1], [2], [3]]
y = [0, 0, 1, 1]
m = LogisticRegression().fit(X, y)
print(m.predict([[1.5]])[0])`, "python"),
    E("Save and load", "joblib dump / load.", `import joblib
joblib.dump(m, "model.joblib")
m2 = joblib.load("model.joblib")`, "python"),
    E("Predict API", "POST JSON { x: 1.5 }.", `app.post("/predict", function (req, res) {
  const y = model.predict([[req.body.x]])[0];  // Read the model
  res.json({ y });
});`),
    E("API key", "Authorization: Bearer lab-key.", `function requireKey(req, res, next) {
  if (req.headers.authorization !== "Bearer " + process.env.API_KEY) {
    return res.status(401).end();  // authentication
  }
  next();
}`),
    E("Train/test split", "Never test on the same rows you trained.", `from sklearn.model_selection import train_test_split
Xt, Xv, yt, yv = train_test_split(X, y, test_size=0.25, random_state=0)`, "python"),
    E("RAG-style retrieve", "Fake top-1 by keyword for practice.", `function retrieve(q, chunks) {
  return chunks.find((c) => c.includes(q.slice(0, 4))) || chunks[0];
}`),
    E("HTTPS client", "The notebook calls the live model.", `const res = await fetch("https://api.example.com/predict", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + key
  },
  body: JSON.stringify({ x: 1.5 })
});`),
    E("Do not return raw PII", "Predict a label, not the training row.", `res.json({ spam: true });  // not the email body`)
  ],
  questions: [
    Q(1, "beginner", "Practice: fit a line", "LinearRegression on x → y.", `from sklearn.linear_model import LinearRegression
m = LinearRegression().fit([[1],[2],[3]], [2,4,6])
print(m.predict([[4]])[0])`),
    Q(2, "beginner", "Practice: save the model", "joblib.dump.", `joblib.dump(m, "model.joblib")`),
    Q(3, "intermediate", "Practice: /predict", "Load once at boot. POST x → y.", `app.post("/predict", auth, function (req, res) {
  res.json({ y: m.predict([[req.body.x]])[0] });
});`),
    Q(4, "intermediate", "Practice: API key auth", "401 if missing.", `if (req.headers.authorization !== "Bearer " + process.env.API_KEY) {
  return res.status(401).json({ error: "key" });
}`),
    Q(5, "beginner", "Practice: train/test split", "25% holdout.", `train_test_split(X, y, test_size=0.25, random_state=0)`),
    Q(6, "intermediate", "Practice: accuracy print", "score on the holdout.", `print(m.score(Xv, yv))`),
    Q(7, "advanced", "Practice: HTTPS deploy", "Same as the backend lab.", `fetch("https://ml.example.com/predict", { method: "POST", body, headers })`),
    Q(8, "beginner", "Practice: CRUD a dataset row", "Append a labelled row to CSV.", `import pandas as pd
df = pd.read_csv("rows.csv")
df.loc[len(df)] = {"x": 4, "y": 1}
df.to_csv("rows.csv", index=False)`),
    Q(9, "intermediate", "Practice: retrain job", "Read CSV, fit, dump.", `m = LogisticRegression().fit(X, y)
joblib.dump(m, "model.joblib")`),
    Q(10, "beginner", "Practice: delete a bad row", "Filter and save. Retrain after.", `df = df[df.x >= 0]
df.to_csv("rows.csv", index=False)`),
    Q(11, "advanced", "Practice: do not leak train text", "Return a snippet, not the PII dump.", `res.json({ chunkId: h.id, snippet: h.body.slice(0, 200) });`),
    Q(12, "intermediate", "Practice: vector search toy", "Closest by a fake score.", `hits.sort((a, b) => b.score - a.score);
return hits.slice(0, 3);`),
    Q(13, "beginner", "Why auth on /predict?", "Open predict endpoints get scraped and cost money.", `Authorization: Bearer …`),
    Q(14, "intermediate", "Practice: role for /retrain", "Only admin may POST /retrain.", `if (req.user.role !== "admin") return res.status(403).end();`),
    Q(15, "beginner", "Practice: evaluate before ship", "Print holdout score.", `assert m.score(Xv, yv) > 0.6`),
    Q(16, "advanced", "Practice: version the file", "model_v3.joblib.", `MODEL = process.env.MODEL_PATH || "model_v3.joblib";`),
    Q(17, "intermediate", "Practice: HTTPS + key from the notebook", "Never hardcode the key in a public gist.", `key = os.environ["API_KEY"]`),
    Q(18, "beginner", "Spam vs ham labels", "0/1 or spam/ham. Keep a codebook.", `y = [0, 0, 1, 1]  # 1 = spam`)
  ]
});

dump("practice-data", {
  kind: "practice",
  notes: [
    N("How to use this lab", "CRUD here is rows in a table. Auth is who may see this report."),
    N("SQL CRUD", "INSERT a sale, SELECT a report, UPDATE a typo, DELETE a test row."),
    N("Authorization", "A regional analyst sees their region. WHERE team = $1.")
  ],
  examples: [
    E("CREATE + INSERT", "One sales table.", `CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  region TEXT,
  amount NUMERIC,
  sold_on DATE
);
INSERT INTO sales (region, amount, sold_on) VALUES ('west', 99, '2026-01-02');`, "sql"),
    E("Read report", "SUM by region.", `SELECT region, SUM(amount) AS total
FROM sales
GROUP BY region
ORDER BY total DESC;`, "sql"),
    E("Update a typo", "WHERE id.", `UPDATE sales SET region = 'east' WHERE id = 3;`, "sql"),
    E("Delete test rows", "Always WHERE.", `DELETE FROM sales WHERE region = 'test';`, "sql"),
    E("Python read", "pandas + SQL.", `import pandas as pd
df = pd.read_sql("SELECT region, SUM(amount) t FROM sales GROUP BY 1", conn)
print(df)`, "python"),
    E("Share a CSV safely", "No passwords in the file.", `df.to_csv("report.csv", index=False)`),
    E("Row filter as authz", "Analyst only sees west.", `SELECT * FROM sales WHERE region = $1;`, "sql"),
    E("HTTPS dashboard", "Put the dash behind login + HTTPS.", `-- users open https://dash.example.com`, "sql")
  ],
  questions: [
    Q(1, "beginner", "Practice: create a sales row", "INSERT one sale.", `INSERT INTO sales (region, amount, sold_on) VALUES ('north', 50, CURRENT_DATE);`),
    Q(2, "beginner", "Practice: weekly total", "SUM + date_trunc.", `SELECT date_trunc('week', sold_on), SUM(amount) FROM sales GROUP BY 1;`),
    Q(3, "beginner", "Practice: fix a wrong amount", "UPDATE ... WHERE id.", `UPDATE sales SET amount = 80 WHERE id = 4;`),
    Q(4, "beginner", "Practice: remove test data", "DELETE WHERE.", `DELETE FROM sales WHERE region = 'test';`),
    Q(5, "intermediate", "Practice: region authz", "Bind the user's region.", `SELECT * FROM sales WHERE region = $1;`),
    Q(6, "intermediate", "Practice: pandas chart data", "read_sql then print.", `df = pd.read_sql("SELECT region, SUM(amount) t FROM sales GROUP BY 1", conn)`),
    Q(7, "beginner", "Why not SELECT * for a dashboard?", "Name the columns you need.", `SELECT region, SUM(amount) FROM sales GROUP BY 1;`),
    Q(8, "intermediate", "Practice: export without PII", "Do not SELECT email if the chart does not need it.", `SELECT region, amount, sold_on FROM sales;`),
    Q(9, "advanced", "Practice: warehouse vs OLTP", "Heavy GROUP BY on a replica.", `-- connect to analytics replica`),
    Q(10, "beginner", "Practice: HTTPS share link", "Upload the HTML report to a host with login.", `// https://dash.example.com/weekly`),
    Q(11, "intermediate", "Practice: parameterized SQL in Python", "Never format email into the string.", `pd.read_sql("SELECT * FROM sales WHERE region = %(r)s", conn, params={"r": region})`),
    Q(12, "beginner", "Practice: COUNT vs SUM", "COUNT is how many rows. SUM is the money.", `SELECT COUNT(*), SUM(amount) FROM sales;`),
    Q(13, "intermediate", "Practice: login for the dash", "Even analysts need a password.", `// same cookie flags as the web app`),
    Q(14, "advanced", "Practice: row level security sketch", "Postgres RLS.", `CREATE POLICY p ON sales USING (region = current_setting('app.region'));`),
    Q(15, "beginner", "Practice: NULL amounts", "SUM skips NULL. COALESCE if you need zero.", `SELECT SUM(COALESCE(amount, 0)) FROM sales;`),
    Q(16, "intermediate", "Practice: join customers safely", "Do not dump phone numbers into a public slide.", `SELECT c.name, SUM(s.amount) FROM sales s JOIN customers c ON c.id = s.customer_id GROUP BY 1;`),
    Q(17, "beginner", "Practice: save the query in Git", "report_weekly.sql in the repo.", `-- report_weekly.sql`),
    Q(18, "intermediate", "Practice: 401 on the dash API", "No cookie → no JSON.", `if (!req.session.userId) return res.status(401).json({ error: "login" });`)
  ]
});

dump("practice-datastores", {
  kind: "practice",
  notes: [
    N("How to use this lab", "Same todo/user story in SQL, Mongo, Redis, and a tiny vector search."),
    N("Auth", "Users in SQL. Session in Redis. Never the only user table in Redis."),
    N("HTTPS", "Drivers use TLS to Atlas / RDS. redis:// vs rediss://.")
  ],
  examples: [
    E("SQL todo CRUD", "Four statements.", `INSERT INTO todos(text) VALUES ('read');
SELECT * FROM todos;
UPDATE todos SET done = true WHERE id = 1;
DELETE FROM todos WHERE id = 1;`, "sql"),
    E("Mongo todo CRUD", "insert / find / update / delete.", `await c.insertOne({ text: "read" });
await c.find().toArray();
await c.updateOne({ _id }, { $set: { done: true } });
await c.deleteOne({ _id });`),
    E("Redis session", "SET EX after SQL login.", `await redis.set("sess:" + sid, userId, "EX", 86400);`),
    E("pgvector insert", "Chunk + embedding.", `INSERT INTO chunks(body, embedding) VALUES ($1, $2);`, "sql"),
    E("rediss://", "TLS to managed Redis.", `redis://localhost:6379
rediss://default:pass@host:6379`, "txt"),
    E("Unique email both places", "SQL UNIQUE. Mongo unique index.", `email TEXT UNIQUE
db.users.createIndex({ email: 1 }, { unique: true })`, "txt"),
    E("Cache-aside", "Redis then SQL.", `const hit = await redis.get("todo:" + id);
if (hit) return JSON.parse(hit);
const row = await db.query("SELECT * FROM todos WHERE id = $1", [id]);`),
    E("Tenant filter on vectors", "Always WHERE tenant = $1.", `SELECT body FROM chunks WHERE tenant = $1 ORDER BY embedding <=> $2 LIMIT 5;`, "sql")
  ],
  questions: [
    Q(1, "beginner", "Practice: the same todo in SQL", "INSERT SELECT UPDATE DELETE.", `INSERT INTO todos(text) VALUES ('read');`),
    Q(2, "beginner", "Practice: the same todo in Mongo", "insertOne find updateOne deleteOne.", `await todos.insertOne({ text: "read", done: false });`),
    Q(3, "intermediate", "Practice: login in SQL, session in Redis", "bcrypt then SET EX.", `await redis.set("sess:" + sid, user.id, "EX", 86400);`),
    Q(4, "intermediate", "Practice: cache a todo", "GET, miss, SQL, SET EX.", `await redis.set("todo:" + id, JSON.stringify(row), "EX", 60);`),
    Q(5, "intermediate", "Practice: invalidate on update", "UPDATE sql then DEL key.", `await db.query("UPDATE todos SET text = $1 WHERE id = $2", [text, id]);
await redis.del("todo:" + id);`),
    Q(6, "beginner", "Practice: unique email in Mongo", "createIndex unique.", `await users.createIndex({ email: 1 }, { unique: true });`),
    Q(7, "advanced", "Practice: RAG retrieve", "embed + ORDER BY distance + tenant.", `ORDER BY embedding <=> $2 LIMIT 5`),
    Q(8, "intermediate", "Practice: TLS URLs", "postgres SSL, rediss, mongodb+srv.", `rediss://...  // Redis TLS`),
    Q(9, "beginner", "Why not users only in Redis?", "A flush can wipe the only copy.", `// users table stays in SQL`),
    Q(10, "intermediate", "Practice: owner id in both stores", "Filter every read.", `find({ userId: req.user.id })`),
    Q(11, "beginner", "Practice: 403 if wrong tenant on chunks", "Compare tenant from the login.", `if (chunk.tenant !== req.user.tenant) return res.status(403).end();`),
    Q(12, "advanced", "Practice: dual-write rename", "Update SQL name and Mongo authorName.", `await sql.query("UPDATE users SET name = $1 WHERE id = $2", [name, id]);`),
    Q(13, "intermediate", "Practice: connection strings in env", "No passwords in Slack.", `process.env.DATABASE_URL`),
    Q(14, "beginner", "CRUD map", "Create insert, Read find, Update $set, Delete delete.", `-- four verbs, two engines`),
    Q(15, "intermediate", "Practice: HTTPS app still uses TLS to DB", "Turn SSL on to RDS.", `ssl: { rejectUnauthorized: true }`),
    Q(16, "beginner", "Practice: GET vs SCAN", "Redis GET by key. Never KEYS *.", `await redis.get("todo:1");`),
    Q(17, "advanced", "Practice: vector delete with the file", "deleteMany sourceId.", `await chunks.deleteMany({ sourceId });`),
    Q(18, "intermediate", "Practice: login 401 vs cache miss", "Missing session is 401. Missing cache is a DB load.", `if (!sid) return res.status(401).end();`)
  ]
});

dump("practice-sysdesign", {
  kind: "practice",
  notes: [
    N("How to use this lab", "Tiny code that matches the drawings: shortener, rate limit, feed, HTTPS at the edge."),
    N("Auth", "Even a shortener has an API key for create. Public GET of /abc is fine."),
    N("HTTPS", "The browser only sees https://short.example/abc.")
  ],
  examples: [
    E("URL shortener create", "Hash, store, return short.", `async function createLink(req, res) {
  const id = crypto.randomBytes(4).toString("hex");  // short id
  await db.query(
    "INSERT INTO links(id, url, user_id) VALUES ($1,$2,$3)",
    [id, req.body.url, req.user.id]
  );
  res.json({ short: "https://s.example/" + id });  // HTTPS link
}`),
    E("Redirect", "302 from id.", `async function redirect(req, res) {
  const { rows } = await db.query("SELECT url FROM links WHERE id = $1", [req.params.id]);
  if (!rows[0]) return res.status(404).end();  // unknown id
  res.redirect(302, rows[0].url);
}`),
    E("Rate limit", "Redis INCR.", `async function limit(ip, res) {
  const n = await redis.incr("rl:" + ip);
  if (n === 1) await redis.expire("rl:" + ip, 60);
  if (n > 30) return res.status(429).json({ error: "slow down" });
}`),
    E("Feed fan-out on write", "Push post id to each follower list.", `for (const f of followers) {
  await redis.lpush("feed:" + f, postId);
}`),
    E("Cache a GET", "Cache-aside the long URL.", `const hit = await redis.get("u:" + id);
if (hit) return res.redirect(302, hit);`),
    E("HTTPS edge", "TLS at Nginx, then app.", `listen 443 ssl; proxy_pass http://127.0.0.1:3000;`, "txt"),
    E("Idempotent create", "Retry does not make two links.", `const key = req.headers["idempotency-key"];
const cached = await redis.get("idemp:" + key);
if (cached) return res.json(JSON.parse(cached));`),
    E("Authz: only owner deletes", "DELETE checks user_id.", `DELETE FROM links WHERE id = $1 AND user_id = $2`)
  ],
  questions: [
    Q(1, "beginner", "Practice: create a short link", "Need a logged-in user. Save id → url.", `await db.query("INSERT INTO links(id, url, user_id) VALUES ($1,$2,$3)", [id, url, req.user.id]);`),
    Q(2, "beginner", "Practice: redirect", "GET /:id → 302.", `res.redirect(302, rows[0].url);`),
    Q(3, "intermediate", "Practice: rate limit creates", "30 / minute / ip.", `if (n > 30) return res.status(429).end();`),
    Q(4, "intermediate", "Practice: cache the target", "SET EX the url after SQL.", `await redis.set("u:" + id, url, "EX", 3600);`),
    Q(5, "intermediate", "Practice: owner delete", "403 if not owner.", `if (row.user_id !== req.user.id) return res.status(403).end();`),
    Q(6, "beginner", "Practice: public read vs auth create", "GET is public. POST needs auth.", `app.post("/links", auth, create);
app.get("/:id", redirect);`),
    Q(7, "advanced", "Practice: feed fan-out", "On post, LPUSH to each follower.", `await redis.lpush("feed:" + followerId, postId);`),
    Q(8, "intermediate", "Practice: idempotency key", "Replay returns the same short url.", `if (cached) return res.json(JSON.parse(cached));`),
    Q(9, "beginner", "Practice: HTTPS short URL", "Return https:// not http://.", `res.json({ short: "https://s.example/" + id });`),
    Q(10, "advanced", "Practice: 429 body", "Tell the client when to retry.", `res.set("Retry-After", "60").status(429).json({ error: "slow down" });`),
    Q(11, "intermediate", "Practice: unique short id retry", "On unique violation, make a new id.", `try { await insert(id); } catch (e) { if (e.code === "23505") return insert(newId()); }`),
    Q(12, "beginner", "Practice: 404 unknown id", "Do not redirect to home silently.", `if (!rows[0]) return res.status(404).json({ error: "unknown" });`),
    Q(13, "intermediate", "Practice: authn vs authz here", "API key = who. Owner check = may delete.", `auth, then row.user_id === req.user.id`),
    Q(14, "advanced", "Practice: edge TLS + app HTTP", "Nginx 443, app 3000.", `proxy_pass http://127.0.0.1:3000;`),
    Q(15, "beginner", "Practice: log without the secret URL", "Log the short id.", `console.log("hit", id);`),
    Q(16, "intermediate", "Practice: list my links", "WHERE user_id.", `SELECT id, url FROM links WHERE user_id = $1;`),
    Q(17, "beginner", "Practice: update destination", "UPDATE url. Invalidate cache.", `await redis.del("u:" + id);`),
    Q(18, "advanced", "Practice: draw then code", "Say client → TLS → app → Redis → SQL, then paste the handler.", `// 1 TLS  2 auth  3 rate  4 sql  5 cache`)
  ]
});

console.log("wrote practice labs");
