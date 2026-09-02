window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["practice-mern"] = {
  "kind": "practice",
  "notes": [
    {
      "title": "Most asked",
      "body": "After the hands-on labs, open questions tagged Most asked. Those are the interview questions Amazon, Google, Meta, and Microsoft repeat. Same easy comments on the right of the code."
    },
    {
      "title": "How to use this lab",
      "body": "MERN glues React to Express to Mongo. Each snippet is a complete function with easy comments on the right."
    },
    {
      "title": "One todo app",
      "body": "React shows the list. Express has /api/todos. Mongo stores documents. JWT in Authorization."
    },
    {
      "title": "CORS",
      "body": "Vite on 5173 cannot call 3000 until you proxy /api or the server allows the origin."
    },
    {
      "title": "HTTPS live",
      "body": "UI on Vercel. API on Render. Mongo Atlas uses TLS. No http:// in production."
    },
    {
      "title": "Build order",
      "body": "Mongo API → React list → create form → JWT login → owner delete → deploy HTTPS."
    }
  ],
  "examples": [
    {
      "title": "Mongo todo model",
      "lang": "js",
      "desc": "One document per task.",
      "code": "async function insertTodo(userId, text) {\n  const doc = { text, done: false, userId };  // one task\n  await db.collection(\"todos\").insertOne(doc);  // Create\n  return doc;\n}"
    },
    {
      "title": "Express list for this user",
      "lang": "js",
      "desc": "Filter by userId from the token.",
      "code": "app.get(\"/api/todos\", auth, async function (req, res) {\n  const items = await db.collection(\"todos\")\n    .find({ userId: req.user.id })  // only my tasks\n    .toArray();\n  res.json(items);  // Read\n});"
    },
    {
      "title": "React load todos",
      "lang": "js",
      "desc": "fetch with the token, then setState.",
      "code": "function useTodos(token) {\n  const [todos, setTodos] = useState([]);  // list on the screen\n  useEffect(function () {\n    fetch(\"/api/todos\", {\n      headers: { Authorization: \"Bearer \" + token }  // login ticket\n    })\n      .then(function (res) { return res.json(); })\n      .then(setTodos);  // draw the list\n  }, [token]);\n  return todos;\n}"
    },
    {
      "title": "React add todo",
      "lang": "js",
      "desc": "POST JSON, then clear the input.",
      "code": "async function addTodo(text, token, setText) {\n  await fetch(\"/api/todos\", {\n    method: \"POST\",  // Create\n    headers: {\n      \"Content-Type\": \"application/json\",\n      Authorization: \"Bearer \" + token\n    },\n    body: JSON.stringify({ text })\n  });\n  setText(\"\");  // clear the form\n}"
    },
    {
      "title": "Vite proxy",
      "lang": "js",
      "desc": "Dev: /api goes to Express.",
      "code": "export default {\n  server: {\n    proxy: { \"/api\": \"http://localhost:3000\" }  // browser stays same-origin\n  }\n};"
    },
    {
      "title": "Mongo unique email",
      "lang": "js",
      "desc": "Index so two people cannot share an email.",
      "code": "await db.collection(\"users\").createIndex(\n  { email: 1 },\n  { unique: true }  // second signup with same email fails\n);"
    },
    {
      "title": "React private route",
      "lang": "js",
      "desc": "No token → login page.",
      "code": "function Private({ children }) {\n  const token = localStorage.getItem(\"token\");  // logged in?\n  if (!token) return <Navigate to=\"/login\" />;  // bounce guests\n  return children;\n}"
    },
    {
      "title": "HTTPS API url",
      "lang": "js",
      "desc": "Production fetch uses https or same-origin /api.",
      "code": "const API = import.meta.env.VITE_API || \"\";  // https://api.onrender.com"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "Practice: Mongo insert a todo",
      "a": "insertOne with text, done, userId.",
      "code": "async function createTodo(userId, text) {\n  const doc = { text, done: false, userId };\n  await db.collection(\"todos\").insertOne(doc);  // Create\n  return doc;\n}"
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "Practice: Express GET /api/todos",
      "a": "find({ userId }).toArray().",
      "code": "app.get(\"/api/todos\", auth, async function (req, res) {\n  const items = await db.collection(\"todos\")\n    .find({ userId: req.user.id })  // only mine\n    .toArray();\n  res.json(items);  // Read\n});"
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "Practice: Express POST /api/todos",
      "a": "Validate text. insertOne. 201.",
      "code": "app.post(\"/api/todos\", auth, async function (req, res) {\n  const text = String(req.body.text || \"\").trim();\n  if (!text) return res.status(400).json({ error: \"text required\" });  // bad input\n  const doc = { text, done: false, userId: req.user.id };\n  await db.collection(\"todos\").insertOne(doc);  // Create\n  res.status(201).json(doc);\n});"
    },
    {
      "id": 4,
      "level": "intermediate",
      "q": "Practice: React TodoList",
      "a": "useState + useEffect load.",
      "code": "function TodoList() {\n  const [todos, setTodos] = useState([]);  // list on the screen\n  useEffect(function () {\n    api(\"/api/todos\")\n      .then(function (res) { return res.json(); })\n      .then(setTodos);  // Read\n  }, []);\n  return todos.map((t) => <p key={t._id}>{t.text}</p>);\n}"
    },
    {
      "id": 5,
      "level": "intermediate",
      "q": "Practice: React add form",
      "a": "preventDefault, POST, clear input.",
      "code": "async function onSubmit(e, text, setText) {\n  e.preventDefault();  // do not reload the page\n  await api(\"/api/todos\", {\n    method: \"POST\",\n    body: JSON.stringify({ text })  // Create\n  });\n  setText(\"\");  // clear the box\n}"
    },
    {
      "id": 6,
      "level": "intermediate",
      "q": "Practice: MERN signup",
      "a": "Hash, insert user, return JWT.",
      "code": "async function signup(req, res) {\n  const hash = await bcrypt.hash(req.body.password, 10);  // scramble\n  const result = await db.collection(\"users\").insertOne({\n    email: req.body.email,\n    hash,\n    role: \"user\"  // never take role from the client\n  });\n  const token = jwt.sign(\n    { id: String(result.insertedId), role: \"user\" },\n    process.env.JWT_SECRET\n  );\n  res.json({ token });\n}"
    },
    {
      "id": 7,
      "level": "intermediate",
      "q": "Practice: MERN login page",
      "a": "POST /api/login, save token, go to /todos.",
      "code": "async function onLogin(email, password, navigate, setErr) {\n  const res = await fetch(\"/api/login\", {\n    method: \"POST\",\n    headers: { \"Content-Type\": \"application/json\" },\n    body: JSON.stringify({ email, password })\n  });\n  const data = await res.json();\n  if (!res.ok) return setErr(data.error);  // show the server message\n  localStorage.setItem(\"token\", data.token);  // remember login\n  navigate(\"/todos\");\n}"
    },
    {
      "id": 8,
      "level": "intermediate",
      "q": "Practice: owner-only delete",
      "a": "deleteOne { _id, userId }.",
      "code": "app.delete(\"/api/todos/:id\", auth, async function (req, res) {\n  const r = await db.collection(\"todos\").deleteOne({\n    _id: new ObjectId(req.params.id),\n    userId: req.user.id  // authorization — must be mine\n  });\n  if (!r.deletedCount) return res.status(404).json({ error: \"missing\" });\n  res.status(204).end();\n});"
    },
    {
      "id": 9,
      "level": "intermediate",
      "q": "Practice: admin list all todos",
      "a": "auth + admin. find({}) only for admin.",
      "code": "app.get(\"/api/admin/todos\", auth, async function (req, res) {\n  if (req.user.role !== \"admin\") {\n    return res.status(403).json({ error: \"forbidden\" });  // authorization\n  }\n  res.json(await db.collection(\"todos\").find().toArray());  // all rows\n});"
    },
    {
      "id": 10,
      "level": "beginner",
      "q": "Practice: Vite proxy so CORS is quiet",
      "a": "server.proxy /api → 3000.",
      "code": "export default {\n  server: { proxy: { \"/api\": \"http://localhost:3000\" } }  // same-origin in dev\n};"
    },
    {
      "id": 11,
      "level": "beginner",
      "q": "Practice: tick done from React",
      "a": "PATCH /api/todos/:id { done: true }.",
      "code": "async function tick(id) {\n  await api(\"/api/todos/\" + id, {\n    method: \"PATCH\",  // Update\n    body: JSON.stringify({ done: true })\n  });\n}"
    },
    {
      "id": 12,
      "level": "advanced",
      "q": "Practice: HTTPS split deploy",
      "a": "CORS origin is the Vercel URL.",
      "code": "app.use(cors({\n  origin: \"https://my-app.vercel.app\"  // live UI only\n}));"
    },
    {
      "id": 13,
      "level": "intermediate",
      "q": "Practice: Mongo unique email error",
      "a": "Catch 11000 and send 409.",
      "code": "async function createUser(email, hash) {\n  try {\n    await db.collection(\"users\").insertOne({ email, hash });\n  } catch (err) {\n    if (err.code === 11000) {\n      const e = new Error(\"email taken\");\n      e.status = 409;  // already exists\n      throw e;\n    }\n    throw err;\n  }\n}"
    },
    {
      "id": 14,
      "level": "beginner",
      "q": "Practice: show 401 in React",
      "a": "Clear token and go to login.",
      "code": "function handleAuth(res, navigate) {\n  if (res.status === 401) {\n    localStorage.removeItem(\"token\");  // ticket is dead\n    navigate(\"/login\");\n  }\n}"
    },
    {
      "id": 15,
      "level": "advanced",
      "q": "Practice: cookie + CORS for MERN",
      "a": "credentials: include on fetch.",
      "code": "await fetch(\"/api/me\", { credentials: \"include\" });  // send the cookie"
    },
    {
      "id": 16,
      "level": "beginner",
      "q": "What is the M in MERN here?",
      "a": "MongoDB holds users and todos as documents.",
      "code": "const user = await db.collection(\"users\").findOne({ email });  // Read one user"
    },
    {
      "id": 17,
      "level": "intermediate",
      "q": "Practice: ObjectId check",
      "a": "Invalid id → 400, not a crash.",
      "code": "function readId(id) {\n  if (!ObjectId.isValid(id)) {\n    const err = new Error(\"bad id\");\n    err.status = 400;  // not a real Mongo id\n    throw err;\n  }\n  return new ObjectId(id);\n}"
    },
    {
      "id": 18,
      "level": "intermediate",
      "q": "Practice: React logout",
      "a": "Remove token, clear user, go to login.",
      "code": "function logout(setUser, navigate) {\n  localStorage.removeItem(\"token\");  // forget login\n  setUser(null);  // clear the screen\n  navigate(\"/login\");\n}"
    },
    {
      "id": 19,
      "level": "beginner",
      "q": "What does MERN stand for?",
      "a": "MongoDB (documents), Express (API), React (UI), Node (runtime). One language — JavaScript — on both sides. You still need HTML, CSS, Git, and HTTPS to ship.",
      "code": "// React  →  fetch(\"/api/todos\")\n// Express →  db.collection(\"todos\").find()\n// Mongo   →  { text, done, userId }",
      "ask": "Most asked · Amazon · Microsoft · startup"
    },
    {
      "id": 20,
      "level": "intermediate",
      "q": "Why does React on :5173 fail to call Express on :3000?",
      "a": "Different origins. The browser applies CORS. Proxy /api in Vite for local work. In production, put UI and API on one domain or set Access-Control-Allow-Origin to the real UI URL.",
      "code": "export default { server: { proxy: { \"/api\": \"http://localhost:3000\" } } };",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "MongoDB vs SQL — when do you pick Mongo in MERN?",
      "a": "Pick Mongo when the document is the API shape (nested comments) and you want one JS object in and out. Pick SQL when you have many relations, reports, and strict rules. Interviews like: start with the queries, then pick the store.",
      "code": "await todos.insertOne({ text, done: false, userId });  // one document\n// SQL: INSERT INTO todos(user_id, text) VALUES ($1, $2)",
      "ask": "Most asked · Amazon · Microsoft · Google"
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "Where should a MERN app store the JWT?",
      "a": "Best: httpOnly cookie on the API domain. Common student path: localStorage — simpler, weaker against XSS. Never put the token in a query string or Git.",
      "code": "localStorage.setItem(\"token\", data.token);  // common, XSS-sensitive\nres.cookie(\"sid\", sid, { httpOnly: true, sameSite: \"lax\", secure: true });  // safer",
      "ask": "Most asked · Google · Meta · Microsoft"
    },
    {
      "id": 23,
      "level": "beginner",
      "q": "Walk through signup → login → list todos in MERN.",
      "a": "Signup: hash password, insert user, return JWT. Login: find user, compare hash, return JWT. List: React sends Bearer token. Express verifies, then find({ userId }).",
      "code": "const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);\n// React: Authorization: Bearer + token\n// Express: req.user = jwt.verify(token)\n// Mongo: find({ userId: req.user.id })",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 24,
      "level": "intermediate",
      "q": "What is mongoose populate?",
      "a": "populate replaces an id with the related document. It is a second query (or a $lookup). Easy to read. Easy to create N+1 if you populate in a loop. For lists, project the fields you need.",
      "code": "const post = await Post.findById(id).populate(\"author\", \"name\");  // author becomes an object",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 25,
      "level": "beginner",
      "q": "How do you structure a MERN repo?",
      "a": "client/ (Vite React) and server/ (Express). One Git repo. .env in server, VITE_API in client. Never commit secrets. Proxy /api in dev.",
      "code": "// repo/\n//   client/   React\n//   server/   Express + Mongo\n//   .gitignore  includes .env",
      "ask": "Most asked · Microsoft · Amazon"
    },
    {
      "id": 26,
      "level": "beginner",
      "q": "What is an environment variable in MERN?",
      "a": "A setting that changes per machine: DATABASE_URL, JWT_SECRET, VITE_API. process.env on the server. import.meta.env.VITE_* on the client. Client vars are public — never put the DB password in VITE_.",
      "code": "const db = process.env.DATABASE_URL;  // server only\nconst api = import.meta.env.VITE_API;  // public in the built JS",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 27,
      "level": "intermediate",
      "q": "What is a Mongo ObjectId and why check it?",
      "a": "ObjectId is a 24-hex id Mongo makes. If you pass 'abc' into findById, Mongoose can throw. Check ObjectId.isValid and return 400.",
      "code": "if (!ObjectId.isValid(id)) return res.status(400).json({ error: \"bad id\" });",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 28,
      "level": "beginner",
      "q": "How does React show a 401 from Express?",
      "a": "If res.status === 401, remove the token and navigate to /login. Also handle it in one api() helper so every page does the same thing.",
      "code": "if (res.status === 401) {\n  localStorage.removeItem(\"token\");  // ticket is dead\n  navigate(\"/login\");\n}",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 29,
      "level": "intermediate",
      "q": "CSR vs SSR — what does a typical MERN app use?",
      "a": "Create React App / Vite is CSR: the server sends a shell, JS paints the page. SSR (Next.js) renders HTML on the server. CSR is simpler. SSR helps first paint and SEO.",
      "code": "// Vite CSR: index.html + bundle\n// Next SSR: the server returns HTML for this URL",
      "ask": "Most asked · Meta · Amazon · Microsoft"
    },
    {
      "id": 30,
      "level": "intermediate",
      "q": "How do you keep Mongo emails unique?",
      "a": "createIndex({ email: 1 }, { unique: true }). Catch error code 11000 and return 409. Do not only check findOne in your code — two signups can race.",
      "code": "await users.createIndex({ email: 1 }, { unique: true });\n// catch err.code === 11000 → 409 email taken",
      "ask": "Most asked · Amazon · Microsoft"
    }
  ]
};
