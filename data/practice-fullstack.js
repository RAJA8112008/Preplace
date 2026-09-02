window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["practice-fullstack"] = {
  "kind": "practice",
  "notes": [
    {
      "title": "Most asked",
      "body": "After the hands-on labs, open questions tagged Most asked. Those are the interview questions Amazon, Google, Meta, and Microsoft repeat. Same easy comments on the right of the code."
    },
    {
      "title": "How to use this lab",
      "body": "One feature from the button to the SQL row. Easy comments on the right of each line."
    },
    {
      "title": "Stack",
      "body": "React UI, Express API, Postgres, optional Redis session, HTTPS on the host."
    },
    {
      "title": "Auth vs authz",
      "body": "Login is authentication. 'this todo is mine' is authorization."
    },
    {
      "title": "HTTPS",
      "body": "Users type https://. Cookies use Secure. No mixed content."
    },
    {
      "title": "Build order",
      "body": "SQL tables → CRUD API → React list → cookie login → owner checks → HTTPS."
    }
  ],
  "examples": [
    {
      "title": "Tables",
      "lang": "sql",
      "desc": "Users and todos with a foreign key.",
      "code": "CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  email TEXT UNIQUE NOT NULL,  -- one email per person\n  hash TEXT NOT NULL,  -- scrambled password\n  role TEXT NOT NULL DEFAULT 'user'\n);\n\nCREATE TABLE todos (\n  id SERIAL PRIMARY KEY,\n  user_id INTEGER REFERENCES users(id),  -- must be a real user\n  text TEXT NOT NULL,\n  done BOOLEAN NOT NULL DEFAULT false\n);"
    },
    {
      "title": "Full create path",
      "lang": "js",
      "desc": "React POST → Express → INSERT → JSON back.",
      "code": "async function addFromUi(text, token) {\n  await fetch(\"/api/todos\", {\n    method: \"POST\",\n    headers: { Authorization: \"Bearer \" + token },\n    body: JSON.stringify({ text })  // Create from the screen\n  });\n}\n\nasync function addOnServer(userId, text) {\n  const q = \"INSERT INTO todos(user_id, text) VALUES ($1, $2)\";  // Create in SQL\n  await db.query(q, [userId, text]);\n}"
    },
    {
      "title": "Cookie login",
      "lang": "js",
      "desc": "Session id in httpOnly cookie.",
      "code": "async function login(req, res) {\n  const user = await findUser(req.body.email);\n  const ok = user && await bcrypt.compare(req.body.password, user.hash);\n  if (!ok) return res.status(401).json({ error: \"bad login\" });\n  req.session.userId = user.id;  // remember on the server\n  res.json({ ok: true });\n}"
    },
    {
      "title": "Owner check",
      "lang": "js",
      "desc": "AND user_id on UPDATE and DELETE.",
      "code": "async function deleteMine(id, userId) {\n  const q = \"DELETE FROM todos WHERE id = $1 AND user_id = $2\";  // authorization\n  const { rowCount } = await db.query(q, [id, userId]);\n  return rowCount;  // 0 means not yours or missing\n}"
    },
    {
      "title": "HTTPS cookie flags",
      "lang": "js",
      "desc": "secure + httpOnly + sameSite.",
      "code": "res.cookie(\"sid\", sid, {\n  httpOnly: true,  // JS cannot read it\n  secure: true,  // HTTPS only\n  sameSite: \"lax\"\n});"
    },
    {
      "title": "React error shape",
      "lang": "js",
      "desc": "API always { error: string }.",
      "code": "async function readList(setTodos, setErr) {\n  const res = await fetch(\"/api/todos\");\n  const data = await res.json();\n  if (!res.ok) return setErr(data.error);  // show the server words\n  setTodos(data);\n}"
    },
    {
      "title": "Welcome todo in one transaction",
      "lang": "js",
      "desc": "Both rows or neither.",
      "code": "async function signupWithFirstTask(email, hash) {\n  await db.query(\"BEGIN\");  // start the bundle\n  await db.query(\"INSERT INTO users(email, hash) VALUES ($1, $2)\", [email, hash]);\n  await db.query(\n    \"INSERT INTO todos(user_id, text) VALUES (currval('users_id_seq'), $1)\",\n    [\"first task\"]\n  );\n  await db.query(\"COMMIT\");  // both exist, or neither\n}"
    },
    {
      "title": "Env for each place",
      "lang": "js",
      "desc": "DATABASE_URL never in Git.",
      "code": "const db = new Pool({\n  connectionString: process.env.DATABASE_URL  // laptop vs prod\n});"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "Practice: SQL create a todo",
      "a": "INSERT with user_id from the token.",
      "code": "async function createTodo(userId, text) {\n  const q = \"INSERT INTO todos(user_id, text) VALUES ($1, $2) RETURNING *\";\n  const { rows } = await db.query(q, [userId, text]);  // Create\n  return rows[0];\n}"
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "Practice: list my todos",
      "a": "SELECT ... WHERE user_id = $1.",
      "code": "async function listMine(userId) {\n  const q = \"SELECT id, text, done FROM todos WHERE user_id = $1 ORDER BY id\";\n  const { rows } = await db.query(q, [userId]);  // Read — only mine\n  return rows;\n}"
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "Practice: React page that loads them",
      "a": "useEffect fetch with the token.",
      "code": "useEffect(function () {\n  fetch(\"/api/todos\", {\n    headers: { Authorization: \"Bearer \" + token }  // login ticket\n  })\n    .then(function (res) { return res.json(); })\n    .then(setTodos);  // draw the list\n}, [token]);"
    },
    {
      "id": 4,
      "level": "intermediate",
      "q": "Practice: update text or done",
      "a": "UPDATE ... WHERE id AND user_id. 0 rows → 404.",
      "code": "async function updateMine(id, userId, done) {\n  const q = \"UPDATE todos SET done = $1 WHERE id = $2 AND user_id = $3\";\n  const { rowCount } = await db.query(q, [done, id, userId]);  // Update + authz\n  if (!rowCount) {\n    const err = new Error(\"missing\");\n    err.status = 404;\n    throw err;\n  }\n}"
    },
    {
      "id": 5,
      "level": "intermediate",
      "q": "Practice: delete mine only",
      "a": "DELETE with both ids.",
      "code": "async function deleteMine(id, userId) {\n  await db.query(\n    \"DELETE FROM todos WHERE id = $1 AND user_id = $2\",  // authorization\n    [id, userId]\n  );\n}"
    },
    {
      "id": 6,
      "level": "intermediate",
      "q": "Practice: signup + first todo",
      "a": "One transaction so both rows exist together.",
      "code": "async function signupBundle(email, hash) {\n  await db.query(\"BEGIN\");\n  await db.query(\"INSERT INTO users(email, hash) VALUES ($1, $2)\", [email, hash]);\n  await db.query(\"INSERT INTO todos(user_id, text) VALUES (currval('users_id_seq'), $1)\", [\"first task\"]);\n  await db.query(\"COMMIT\");  // both or neither\n}"
    },
    {
      "id": 7,
      "level": "intermediate",
      "q": "Practice: cookie session login",
      "a": "Set sid after bcrypt.compare.",
      "code": "async function login(req, res) {\n  const user = await findUser(req.body.email);\n  const ok = user && await bcrypt.compare(req.body.password, user.hash);\n  if (!ok) return res.status(401).json({ error: \"bad login\" });  // authentication\n  req.session.userId = user.id;  // remember on the server\n  res.json({ ok: true });\n}"
    },
    {
      "id": 8,
      "level": "intermediate",
      "q": "Practice: requireSession",
      "a": "If no session, 401.",
      "code": "function requireSession(req, res, next) {\n  if (!req.session.userId) {\n    return res.status(401).json({ error: \"login first\" });  // authentication\n  }\n  next();\n}"
    },
    {
      "id": 9,
      "level": "intermediate",
      "q": "Practice: admin dashboard SQL",
      "a": "role from users table, not from the client.",
      "code": "async function requireAdmin(req, res, next) {\n  const { rows } = await db.query(\"SELECT role FROM users WHERE id = $1\", [req.session.userId]);\n  if (!rows[0] || rows[0].role !== \"admin\") {\n    return res.status(403).json({ error: \"forbidden\" });  // authorization\n  }\n  next();\n}"
    },
    {
      "id": 10,
      "level": "beginner",
      "q": "Practice: HTTPS only cookies in prod",
      "a": "secure: true when NODE_ENV is production.",
      "code": "res.cookie(\"sid\", sid, {\n  httpOnly: true,\n  secure: process.env.NODE_ENV === \"production\",  // HTTPS in prod\n  sameSite: \"lax\"\n});"
    },
    {
      "id": 11,
      "level": "advanced",
      "q": "Practice: block mixed content",
      "a": "The React app on https:// must call https:// or same-origin /api.",
      "code": "const API = \"\";  // same origin via proxy — safest"
    },
    {
      "id": 12,
      "level": "beginner",
      "q": "Practice: 400 validation both sides",
      "a": "UI trim. Server trim again.",
      "code": "function readTitle(body) {\n  const text = String(body.text || \"\").trim();\n  if (text.length < 1 || text.length > 200) {\n    const err = new Error(\"1–200 chars\");\n    err.status = 400;  // bad input\n    throw err;\n  }\n  return text;\n}"
    },
    {
      "id": 13,
      "level": "intermediate",
      "q": "Practice: CSRF idea for cookie auth",
      "a": "SameSite=Lax helps.",
      "code": "res.cookie(\"sid\", sid, {\n  httpOnly: true,\n  sameSite: \"lax\",  // basic CSRF help\n  secure: true\n});"
    },
    {
      "id": 14,
      "level": "beginner",
      "q": "Practice: health + migrate",
      "a": "GET /health and a migrations folder.",
      "code": "app.get(\"/health\", async function (req, res) {\n  await db.query(\"SELECT 1\");  // database is reachable\n  res.json({ ok: true });\n});"
    },
    {
      "id": 15,
      "level": "advanced",
      "q": "Practice: cache list in Redis",
      "a": "GET cache, else SQL, SET EX 30. DEL on write.",
      "code": "async function listCached(userId) {\n  const key = \"todos:\" + userId;\n  const hit = await redis.get(key);  // fast path\n  if (hit) return JSON.parse(hit);\n  const { rows } = await db.query(\"SELECT * FROM todos WHERE user_id = $1\", [userId]);\n  await redis.set(key, JSON.stringify(rows), \"EX\", 30);  // remember 30s\n  return rows;\n}"
    },
    {
      "id": 16,
      "level": "intermediate",
      "q": "Practice: React empty and error states",
      "a": "Show the message the user can act on.",
      "code": "function List({ err, todos }) {\n  if (err) return <p>{err}</p>;  // what went wrong\n  if (!todos.length) return <p>no tasks yet</p>;  // empty is not an error\n  return todos.map((t) => <p key={t.id}>{t.text}</p>);\n}"
    },
    {
      "id": 17,
      "level": "beginner",
      "q": "End-to-end story",
      "a": "Click Add → POST → INSERT → 201 → list updates.",
      "code": "async function addAndTrust(text, setTodos) {\n  const res = await fetch(\"/api/todos\", {\n    method: \"POST\",\n    body: JSON.stringify({ text })\n  });\n  if (!res.ok) return;  // do not fake a row\n  const row = await res.json();  // 201 body\n  setTodos((list) => list.concat(row));\n}"
    },
    {
      "id": 18,
      "level": "intermediate",
      "q": "Practice: logout everywhere",
      "a": "Destroy session and clear cookie.",
      "code": "function logout(req, res) {\n  req.session.destroy(function () {\n    res.clearCookie(\"sid\");  // drop the cookie\n    res.json({ ok: true });\n  });\n}"
    },
    {
      "id": 19,
      "level": "beginner",
      "q": "What happens after the user clicks Add?",
      "a": "React POST /api/todos with the token. Express checks auth, validates text, INSERT into SQL, returns 201 + row. React appends that row. If any step fails, show an error — do not fake a row.",
      "code": "const res = await fetch(\"/api/todos\", { method: \"POST\", body, headers });\nif (!res.ok) return setErr((await res.json()).error);\nsetTodos((list) => list.concat(await res.json()));",
      "ask": "Most asked · Amazon · Microsoft · Google"
    },
    {
      "id": 20,
      "level": "intermediate",
      "q": "XSS vs CSRF?",
      "a": "XSS: attacker JS runs in your page and can steal tokens. CSRF: the user's browser sends a cookie to your API from another site. httpOnly cookies + SameSite help CSRF. Escaping HTML helps XSS. JWT in a header is not sent cross-site automatically.",
      "code": "res.cookie(\"sid\", sid, { httpOnly: true, sameSite: \"lax\", secure: true });  // CSRF help\nel.textContent = userName;  // XSS help",
      "ask": "Most asked · Google · Meta · Microsoft"
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "CSR vs SSR vs SSG?",
      "a": "CSR: JS paints in the browser (Vite React). SSR: HTML is built per request (Next). SSG: HTML is built at deploy time. Marketing pages like SSG. Dashboards behind login are often CSR or SSR.",
      "code": "// CSR — Vite\n// SSR — Next getServerSideProps / app router\n// SSG — Next generateStaticParams",
      "ask": "Most asked · Meta · Amazon · Microsoft"
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "How would you design login for a todo app?",
      "a": "Email + password. bcrypt hash. Session cookie (httpOnly, Secure, SameSite) or short JWT. HTTPS only. Rate-limit /login. Verify email later. Roles in the database. /me returns the user. Logout destroys the session.",
      "code": "const ok = await bcrypt.compare(password, user.hash);\nif (!ok) return res.status(401).json({ error: \"bad login\" });\nreq.session.userId = user.id;",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 23,
      "level": "intermediate",
      "q": "What is a transaction? Give a signup example.",
      "a": "A bundle of writes that all succeed or all fail. Signup that creates a user and a welcome todo should COMMIT together so you never get a user with no first row if the second insert fails.",
      "code": "await db.query(\"BEGIN\");\nawait db.query(\"INSERT INTO users(email, hash) VALUES ($1, $2)\", [email, hash]);\nawait db.query(\"INSERT INTO todos(user_id, text) VALUES (currval('users_id_seq'), $1)\", [\"first\"]);\nawait db.query(\"COMMIT\");",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 24,
      "level": "intermediate",
      "q": "What is cache-aside?",
      "a": "Read: try Redis. Miss: SQL, then SET with TTL. Write: SQL first, then DEL the key. Never treat Redis as the only copy of a todo.",
      "code": "const hit = await redis.get(key);\nif (hit) return JSON.parse(hit);\nconst rows = await db.query(\"SELECT * FROM todos WHERE user_id = $1\", [id]);\nawait redis.set(key, JSON.stringify(rows), \"EX\", 30);",
      "ask": "Most asked · Amazon · Uber · Google"
    },
    {
      "id": 25,
      "level": "beginner",
      "q": "How do you deploy React + API?",
      "a": "UI on Vercel/Netlify (HTTPS). API on Render/Railway/EC2 (HTTPS). Set CORS to the UI origin. DATABASE_URL in host env. Or one domain: Nginx serves the built UI and proxies /api to Node.",
      "code": "location / { try_files $uri /index.html; }  # React\nlocation /api/ { proxy_pass http://127.0.0.1:3000; }  # Express",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 26,
      "level": "intermediate",
      "q": "Cookies vs Authorization header?",
      "a": "Cookies are sent automatically (CSRF risk, SameSite helps). Authorization: Bearer is sent only when your JS adds it (CORS preflight, no auto CSRF). Cookies can be httpOnly. Headers cannot be httpOnly — JS must see the token.",
      "code": "fetch(\"/api/todos\", { headers: { Authorization: \"Bearer \" + token } });\nfetch(\"/api/todos\", { credentials: \"include\" });  // cookie",
      "ask": "Most asked · Google · Meta · Microsoft"
    },
    {
      "id": 27,
      "level": "intermediate",
      "q": "How do you paginate a todo list?",
      "a": "LIMIT + OFFSET is simple and gets slow on big offsets. Keyset (WHERE id > lastId LIMIT 20) stays fast. Always return { items, nextCursor } so the UI can load more.",
      "code": "const { rows } = await db.query(\n  \"SELECT * FROM todos WHERE user_id = $1 AND id > $2 ORDER BY id LIMIT 21\",\n  [userId, lastId]\n);",
      "ask": "Most asked · Amazon · Meta · Microsoft"
    },
    {
      "id": 28,
      "level": "beginner",
      "q": "Frontend validation vs server validation?",
      "a": "The UI checks so the user gets a fast message. The server checks so attackers cannot skip the UI. Empty title must 400 even if the browser never sent it.",
      "code": "if (!text.trim()) return setErr(\"type a task\");  // UI\nif (!String(req.body.text || \"\").trim()) return res.status(400).json({ error: \"text required\" });",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 29,
      "level": "intermediate",
      "q": "What is a connection pool?",
      "a": "Opening a new SQL connection per request is slow. A pool keeps a few live connections and loans them out. Size it for the database, not 'as many as Node can spawn'.",
      "code": "const db = new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });",
      "ask": "Most asked · Amazon · Google"
    },
    {
      "id": 30,
      "level": "beginner",
      "q": "What is mixed content?",
      "a": "An https:// page that calls http:// API. The browser blocks it. Use https:// for the API or same-origin /api behind TLS.",
      "code": "const API = \"\";  // same origin /api — no mixed content",
      "ask": "Most asked · Google · Microsoft"
    }
  ]
};
