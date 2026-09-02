window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["practice-mern"] = {
  "kind": "practice",
  "notes": [
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
    }
  ]
};
