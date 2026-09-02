window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["practice-backend"] = {
  "kind": "practice",
  "notes": [
    {
      "title": "How to use this lab",
      "body": "Express functions with easy comments on the right. Run with node. Hash passwords. Check roles on the server."
    },
    {
      "title": "CRUD API",
      "body": "GET list, POST create, PATCH update, DELETE remove."
    },
    {
      "title": "Auth",
      "body": "Signup hashes. Login compares and returns a JWT. Middleware reads the token. Admin is a second check."
    },
    {
      "title": "HTTPS",
      "body": "Nginx or the host terminates TLS. The app can speak HTTP on localhost behind it."
    },
    {
      "title": "Build order",
      "body": "In-memory CRUD → hash login → role middleware → SQL → HTTPS in front."
    }
  ],
  "examples": [
    {
      "title": "In-memory todo API",
      "lang": "js",
      "desc": "Four routes. Data lives in an array until restart.",
      "code": "const todos = [];  // memory list — gone on restart\n\napp.get(\"/todos\", function (req, res) {\n  res.json(todos);  // Read — send the list\n});\n\napp.post(\"/todos\", function (req, res) {\n  const text = String(req.body.text || \"\").trim();  // drop spaces\n  if (!text) return res.status(400).json({ error: \"text required\" });  // bad input\n  const item = { id: Date.now(), text, done: false };  // new task\n  todos.push(item);  // Create\n  res.status(201).json(item);  // created\n});"
    },
    {
      "title": "Hash a password",
      "lang": "js",
      "desc": "bcrypt turns a password into a scramble.",
      "code": "async function hashPassword(plain) {\n  return bcrypt.hash(plain, 10);  // save this, never the real password\n}\n\nasync function checkPassword(plain, hash) {\n  return bcrypt.compare(plain, hash);  // true if they match\n}"
    },
    {
      "title": "JWT login",
      "lang": "js",
      "desc": "Sign a token after a good password check.",
      "code": "function makeToken(user) {\n  return jwt.sign(\n    { id: user.id, role: user.role },  // who they are\n    process.env.JWT_SECRET,  // server secret — not in Git\n    { expiresIn: \"1d\" }\n  );\n}"
    },
    {
      "title": "Auth middleware",
      "lang": "js",
      "desc": "No token or bad token → 401.",
      "code": "function auth(req, res, next) {\n  const header = req.headers.authorization || \"\";  // Bearer xxx\n  const token = header.replace(\"Bearer \", \"\");  // just the ticket\n  try {\n    req.user = jwt.verify(token, process.env.JWT_SECRET);  // ticket is real\n    next();  // go on to the route\n  } catch (err) {\n    res.status(401).json({ error: \"login first\" });  // we do not know you\n  }\n}"
    },
    {
      "title": "Admin only",
      "lang": "js",
      "desc": "Authorization after authentication.",
      "code": "function admin(req, res, next) {\n  if (req.user.role !== \"admin\") {\n    return res.status(403).json({ error: \"forbidden\" });  // we know you — you may not\n  }\n  next();\n}\n\napp.delete(\"/todos/:id\", auth, admin, deleteHandler);  // login, then admin, then delete"
    },
    {
      "title": "HTTPS behind Nginx",
      "lang": "txt",
      "desc": "App on 3000. Nginx does 443.",
      "code": "server {\n  listen 443 ssl;  # HTTPS port\n  ssl_certificate /etc/letsencrypt/live/ex/fullchain.pem;  # public cert\n  ssl_certificate_key /etc/letsencrypt/live/ex/privkey.pem;  # private key\n  location / {\n    proxy_pass http://127.0.0.1:3000;  # send traffic to Node\n  }\n}"
    },
    {
      "title": "SQL CRUD",
      "lang": "js",
      "desc": "Parameterized queries. Never glue user text into SQL.",
      "code": "async function insertTodo(userId, text) {\n  const q = \"INSERT INTO todos(user_id, text) VALUES ($1, $2) RETURNING *\";  // Create\n  const { rows } = await db.query(q, [userId, text]);  // $1 $2 stop SQL injection\n  return rows[0];\n}"
    },
    {
      "title": "CORS for a React app",
      "lang": "js",
      "desc": "Allow the UI origin only.",
      "code": "app.use(cors({\n  origin: \"https://app.example.com\",  // this UI only\n  credentials: true  // allow cookies\n}));"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "Practice: GET /todos",
      "a": "Return the list as JSON.",
      "code": "app.get(\"/todos\", function (req, res) {\n  res.json(todos);  // Read\n});"
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "Practice: POST /todos",
      "a": "Read body.text. Push. Send 201.",
      "code": "app.post(\"/todos\", function (req, res) {\n  const text = String(req.body.text || \"\").trim();  // drop spaces\n  if (!text) return res.status(400).json({ error: \"text required\" });  // bad input\n  const item = { id: Date.now(), text, done: false };\n  todos.push(item);  // Create\n  res.status(201).json(item);  // created\n});"
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "Practice: PATCH /todos/:id",
      "a": "Find by id. Change text or done.",
      "code": "app.patch(\"/todos/:id\", function (req, res) {\n  const id = Number(req.params.id);  // /todos/12 → 12\n  const t = todos.find((x) => x.id === id);  // Read one\n  if (!t) return res.status(404).json({ error: \"missing\" });  // unknown id\n  if (req.body.done !== undefined) t.done = req.body.done;  // Update\n  res.json(t);\n});"
    },
    {
      "id": 4,
      "level": "beginner",
      "q": "Practice: DELETE /todos/:id",
      "a": "Filter the array. Send 204.",
      "code": "app.delete(\"/todos/:id\", function (req, res) {\n  const id = Number(req.params.id);\n  todos = todos.filter((x) => x.id !== id);  // Delete\n  res.status(204).end();  // nothing to send back\n});"
    },
    {
      "id": 5,
      "level": "intermediate",
      "q": "Practice: signup with hashed password",
      "a": "Hash, then INSERT. Never save the raw password.",
      "code": "async function signup(email, password) {\n  const hash = await bcrypt.hash(password, 10);  // scramble\n  await db.query(\n    \"INSERT INTO users(email, hash) VALUES ($1, $2)\",  // Create user\n    [email, hash]\n  );\n}"
    },
    {
      "id": 6,
      "level": "intermediate",
      "q": "Practice: login",
      "a": "Find user. compare hash. Return a JWT.",
      "code": "async function login(req, res) {\n  const { email, password } = req.body;\n  const { rows } = await db.query(\"SELECT * FROM users WHERE email = $1\", [email]);  // Read user\n  const user = rows[0];\n  if (!user) return res.status(401).json({ error: \"bad login\" });  // unknown email\n  const ok = await bcrypt.compare(password, user.hash);  // check scramble\n  if (!ok) return res.status(401).json({ error: \"bad login\" });\n  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);\n  res.json({ token });  // give the ticket to the client\n}"
    },
    {
      "id": 7,
      "level": "intermediate",
      "q": "Practice: protect a route",
      "a": "auth middleware, then handler.",
      "code": "app.get(\"/me\", auth, function (req, res) {\n  res.json({ id: req.user.id });  // who is logged in\n});"
    },
    {
      "id": 8,
      "level": "intermediate",
      "q": "Practice: only owner can delete",
      "a": "Compare user_id to req.user.id.",
      "code": "async function deleteMine(req, res) {\n  const row = await findTodo(req.params.id);\n  if (!row) return res.status(404).json({ error: \"missing\" });\n  if (row.user_id !== req.user.id) {\n    return res.status(403).json({ error: \"not yours\" });  // authorization\n  }\n  await db.query(\"DELETE FROM todos WHERE id = $1\", [row.id]);  // Delete\n  res.status(204).end();\n}"
    },
    {
      "id": 9,
      "level": "intermediate",
      "q": "Practice: admin role",
      "a": "403 if role is not admin.",
      "code": "function requireAdmin(req, res, next) {\n  if (req.user.role !== \"admin\") {\n    return res.status(403).json({ error: \"admins only\" });  // authorization\n  }\n  next();\n}"
    },
    {
      "id": 10,
      "level": "beginner",
      "q": "Practice: 400 on bad input",
      "a": "Empty text is not a todo.",
      "code": "function readTitle(body) {\n  const text = String(body.text || \"\").trim();  // drop spaces\n  if (!text) {\n    const err = new Error(\"text required\");\n    err.status = 400;  // bad input\n    throw err;\n  }\n  return text;\n}"
    },
    {
      "id": 11,
      "level": "advanced",
      "q": "Practice: HTTPS redirect",
      "a": "If the proxy says http, send them to https.",
      "code": "function forceHttps(req, res, next) {\n  if (req.headers[\"x-forwarded-proto\"] === \"http\") {\n    return res.redirect(301, \"https://\" + req.headers.host + req.url);  // upgrade to TLS\n  }\n  next();\n}"
    },
    {
      "id": 12,
      "level": "intermediate",
      "q": "Practice: cookie session",
      "a": "httpOnly cookie so JS cannot read it.",
      "code": "function setSession(res, sessionId) {\n  res.cookie(\"sid\", sessionId, {\n    httpOnly: true,  // JS in the page cannot read this\n    secure: true,  // HTTPS only\n    sameSite: \"lax\"  // basic CSRF help\n  });\n}"
    },
    {
      "id": 13,
      "level": "beginner",
      "q": "401 vs 403?",
      "a": "401 means we do not know who you are. 403 means we know and you may not.",
      "code": "res.status(401).json({ error: \"login\" });  // authentication failed\nres.status(403).json({ error: \"forbidden\" });  // authorization failed"
    },
    {
      "id": 14,
      "level": "intermediate",
      "q": "Practice: list only my todos",
      "a": "WHERE user_id = $1.",
      "code": "async function listMine(req, res) {\n  const q = \"SELECT * FROM todos WHERE user_id = $1\";  // never the whole table\n  const { rows } = await db.query(q, [req.user.id]);\n  res.json(rows);  // Read\n}"
    },
    {
      "id": 15,
      "level": "advanced",
      "q": "Practice: rate limit login",
      "a": "Count attempts in Redis. 429 if too many.",
      "code": "async function limitLogin(ip, res) {\n  const n = await redis.incr(\"login:\" + ip);  // one more try\n  if (n === 1) await redis.expire(\"login:\" + ip, 60);  // window is 60 seconds\n  if (n > 10) return res.status(429).json({ error: \"slow down\" });  // too many\n}"
    },
    {
      "id": 16,
      "level": "beginner",
      "q": "Why not trust req.body.role?",
      "a": "Anyone can POST role: admin. Set role in the database only.",
      "code": "function newUser(email, hash) {\n  return { email, hash, role: \"user\" };  // never take role from the client\n}"
    },
    {
      "id": 17,
      "level": "intermediate",
      "q": "Practice: CORS + credentials",
      "a": "Exact origin, not *, if you send cookies.",
      "code": "app.use(cors({\n  origin: \"https://app.example.com\",  // this UI only\n  credentials: true\n}));"
    },
    {
      "id": 18,
      "level": "beginner",
      "q": "Practice: health check",
      "a": "A cheap GET so the host knows the process is up.",
      "code": "app.get(\"/health\", function (req, res) {\n  res.json({ ok: true });  // I am alive\n});"
    }
  ]
};
