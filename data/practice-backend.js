window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["practice-backend"] = {
  "kind": "practice",
  "notes": [
    {
      "title": "Most asked",
      "body": "After the hands-on labs, open questions tagged Most asked. Those are the interview questions Amazon, Google, Meta, and Microsoft repeat. Same easy comments on the right of the code."
    },
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
    },
    {
      "id": 19,
      "level": "beginner",
      "q": "What is REST? Name the verbs and status codes.",
      "a": "The problem before\nThe kitchen invented a new path for every tray: /getTodos, /doCreate, /makeDone. Status was always 200 with a sad message in the body. A new cook could not guess the next dish. Interviews want a shared menu, not a secret chalkboard of nicknames.\nWhat this is\nREST is a style: URLs name resources, HTTP verbs say the action. GET reads and returns 200. POST creates and returns 201. PUT replaces the whole plate. PATCH changes some fields. DELETE removes and often returns 204. 400 is bad input, 401 means log in, 403 means you may not, 404 is missing, 500 is a kitchen fire.\nWhat it solves\nA teammate can read the menu and guess the next route. Proxies can cache GET. You teach CRUD with four verbs instead of twenty helpers. Interviewers want verbs plus those status codes named in one breath, not REST is JSON.\nReal-life example\nCanteen counter. The dish is /dosa. Seeing the list is GET. Ordering a new one is POST and a 201 ticket. Changing the chutney is PATCH. Taking the plate back is DELETE and 204, nothing on the tray. If the cook says 404, that id is not on the board. If they say 401, show your card first.\nUses\nExpress todo routes in this lab: GET list, POST create, PATCH update, DELETE remove. Talk REST when they ask how the UI talks to the server. Map Create Read Update Delete onto those verbs. Return the right code, not only a string.\nWatch out\nREST is not the same as JSON. A path like /getTodos is not resource-shaped. Returning 200 for every failure hides the fire. GET must not create a row. PUT versus PATCH is whole plate versus a pinch of salt. Do not put secrets in the URL.",
      "code": "app.get(\"/todos\", list);  // 200\napp.post(\"/todos\", create);  // 201\napp.patch(\"/todos/:id\", update);\napp.delete(\"/todos/:id\", remove);  // 204",
      "ask": "Most asked · Amazon · Microsoft · Google"
    },
    {
      "id": 20,
      "level": "intermediate",
      "q": "JWT vs session cookie?",
      "a": "The problem before\nThe shop could not decide where the coat lived. One cook kept every login in server memory, then a second oven did not know Ada. Another cook handed a signed paper ticket and could not tear it up at closing. Logout meant hope the paper expired.\nWhat this is\nA session stores login on the server and puts a random id in a cookie. The kitchen looks up the id and knows Ada. A JWT is a signed ticket the client sends back; the kitchen checks the signature and reads id and role from the paper. Sessions are easy to revoke. JWTs scale without that memory but need a short life or a block-list to log out everywhere.\nWhat it solves\nYou pick the coat-check versus the stamped pass. Horizontal scale likes JWT or a shared session store, not one Node process's memory. Interviewers want revoke as the session win, and no server lookup as the JWT win. Both still need HTTPS and a careful cookie or header.\nReal-life example\nSchool cloakroom versus a fair wristband. Session: you leave your bag, they give you a number chit; they can throw your bag away and the chit dies. JWT: they stamp a wristband; any gate can read it without calling the cloakroom; cutting you off means a denylist or waiting until the ink fades.\nUses\nreq.session.userId after login, or jwt.sign with JWT_SECRET. Middleware reads the cookie or the Bearer header. Use sessions for a campus app you must kick out now. Use short JWTs plus refresh if many kitchens must trust the same stamp.\nWatch out\nA JWT in localStorage is XSS bait. A session in one process dies on restart and fails behind two boxes. Signing with a weak secret is a forged wristband. Logout is not real until you revoke or expire. Do not stuff huge data into the token.",
      "code": "req.session.userId = user.id;  // server remembers\nconst token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);  // client remembers",
      "ask": "Most asked · Amazon · Google · Meta"
    },
    {
      "id": 21,
      "level": "beginner",
      "q": "401 vs 403 vs 404?",
      "a": "The problem before\nThe kitchen used 401 for every no. A logged-in kid who touched the staff fridge saw login again. A missing dosa and a forbidden ledger looked the same. Guests learned which locker numbers existed because 403 meant the box was real.\nWhat this is\n401 means we do not know who you are — send them to login. 403 means we know you and you may not — Ada is a user, not admin. 404 means that id is not here. Some shops also return 404 for a row you may not see, so they do not leak that the locker exists. Authentication versus authorization versus missing.\nWhat it solves\nThe UI can bounce on 401 and show a polite no on 403. Support can tell a bad token from a bad role. Interviewers want this trio in one breath, not unauthorized as a mushy word. The sample sends three different JSON errors for the three desks.\nReal-life example\nSchool office. 401: no ID card, go to the gate. 403: your card is real, but this is the staff fridge. 404: there is no locker 99 in this hall. Sometimes the clerk says 404 even for locker 12 if you are not the owner, so strangers cannot map who has a locker.\nUses\nAuth middleware returns 401. Admin or owner checks return 403. findTodo misses return 404. Login with a wrong password is 401, not 404 on the email, so you do not reveal which addresses exist if that is your rule.\nWatch out\nDo not send 401 when the token was fine and the role was wrong. Do not send 404 for a validation miss; that is 400. A 401 should include a WWW-Authenticate story on strict HTTP APIs. Leaking 403 on every id is a user-enumeration side channel. Be consistent.",
      "code": "res.status(401).json({ error: \"login\" });\nres.status(403).json({ error: \"forbidden\" });\nres.status(404).json({ error: \"missing\" });",
      "ask": "Most asked · Amazon · Microsoft · Google"
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "Hashing vs encryption?",
      "a": "The problem before\nThe shop saved passwords in a notebook so they could read them later. A stolen notebook was every PIN. Other cooks encrypted the notebook and then lost the key, or used the same trick for passwords and for bank numbers. Interviews stall when you swap the two words.\nWhat this is\nHashing is one-way. You cannot get the password back. You store the hash and bcrypt.compare at login. Encryption is two-way with a key: ciphertext can become the original if you hold the key. Passwords are hashed. Bank numbers or a private note may be encrypted so the kitchen can decrypt them later.\nWhat it solves\nA stolen user table is not a pile of raw PINs if hashes and salts are done right. You still can show Ada her saved card number if that field was encrypted, not hashed. Interviewers want one-way versus two-way, and bcrypt named for passwords.\nReal-life example\nSchool kitchen. Hashing is blending a smoothie: you cannot pour the fruit back out; you only check if today's fruit matches the stain. Encryption is a locked tiffin: with the key you open the same sandwich you packed. Do not blend the sandwich you still need to eat at two o'clock.\nUses\nSignup hashes. Login compares. Tokens and cookies are not password hashes. Use encryption for secrets you must read again: some national ids, some payment refs. Use hashing for passwords, API tokens you only compare, and integrity checks.\nWatch out\nMD5 and SHA-1 of a password are still hashes, but fast and wrong for PINs. Encryption with the key in the same repo is a lock beside the key. Never log the raw password. Salt is part of hashing, not encryption. Do not encrypt passwords so you can email them back.",
      "code": "const hash = await bcrypt.hash(password, 10);  // one way — store this\nconst ok = await bcrypt.compare(password, hash);  // check at login\n// encryption would need a key to turn ciphertext back into the original",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 23,
      "level": "intermediate",
      "q": "What is SQL injection and how do you stop it?",
      "a": "The problem before\nThe clerk glued the guest's email into the recipe string. A guest typed a quote, then a command to dump the user table, then commented out the rest. The kitchen ran it. The ledger walked out. People said escape the quotes and hoped.\nWhat this is\nSQL injection is attacker text that changes the meaning of a query because you built the SQL with string glue. Always use parameters: $1 or ? so the driver sends data separately from the command. The database sees a value, not extra SQL. ORMs that parameterize are the same idea.\nWhat it solves\nA quote in an email cannot close the string and drop a table. You keep one recipe and many fillings. Interviewers want the bad concat shown, then $1, and they want you to say escaping by hand is how you lose. The lab insertTodo already uses $1 and $2.\nReal-life example\nCanteen order slip. Safe: the cook has a printed recipe and a blank for the name; Ada is only a filling. Unsafe: the kid writes the whole recipe, including and also give me every sweet in the shop. Parameters keep the kid in the filling blank. Glue lets them rewrite the recipe.\nUses\nEvery SELECT, INSERT, UPDATE, DELETE with user input: email, id, search, todo text. Login lookups. WHERE user_id = $1. Code review: grep string add next to SQL. Prepared statements in any language are this hatch.\nWatch out\nParameters do not fix a wrong authorization check; they only stop injected SQL. Dynamic column or table names cannot be bound the same way — whitelist them. LIMIT with string glue is still glue. An ORM raw() call is glue again. Never log the built string with secrets.",
      "code": "await db.query(\"SELECT * FROM users WHERE email = $1\", [email]);  // safe\n// \"SELECT * FROM users WHERE email = '\" + email + \"'\"  // never",
      "ask": "Most asked · Amazon · Microsoft · Google"
    },
    {
      "id": 24,
      "level": "beginner",
      "q": "What is Express middleware?",
      "a": "The problem before\nEvery route copied the same token check, then the same admin check, then the same JSON error. One path forgot the check and leaked the list. People pasted a 20-line block and missed a next(). The kitchen had no coat-check line, only a speech at each stove.\nWhat this is\nExpress middleware is a function (req, res, next) that runs before the route handler. It can read headers, set req.user, send 401, or call next() to pass the tray down the line. app.get('/me', auth, meHandler) is a queue: coat check, then plate. Order is the queue order.\nWhat it solves\nOne auth function protects many routes. You can stack admin after auth. Errors can jump to an error middleware with four arguments. Interviewers want next() named, and they want you to say a response ends the line so you must not next() after you already sent 401.\nReal-life example\nSchool canteen line. First window checks the ID card: auth. Second window checks staff-only: admin. Last window hands the plate: the handler. If the first window sends you away, you never reach the food. If someone calls next after sending you away, you get a double tray and a crash.\nUses\nauth, admin, cors, json body parser, request logs, rate limits. The lab wires DELETE /todos/:id through auth then admin then deleteHandler. Write small functions that do one desk. Test them by calling next or checking status.\nWatch out\nForgetting next() hangs the request. Calling next() after res.json sends two answers. Error middleware must have four parameters or Express skips it. Route order matters: a /todos/:id can steal /todos/export. Middleware is not magic security if it never runs on that path.",
      "code": "function auth(req, res, next) {\n  req.user = readToken(req);  // or 401\n  next();  // go to the next function\n}\napp.get(\"/me\", auth, meHandler);",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 25,
      "level": "intermediate",
      "q": "What is a database index?",
      "a": "The problem before\nList-my-todos opened the whole ledger and walked every row looking for Ada. Lunch rush made the page crawl. Someone added a bigger machine. The book still had no index in the back. Writes were fine; reads tasted every page.\nWhat this is\nA database index is a lookup structure, like the index at the back of a cookbook. WHERE user_id = 9 becomes a jump to those pages, not a full table scan. You pay a little on INSERT and UPDATE because the index must stay in sync. Index the columns you filter and join on, not every column.\nWhat it solves\nOwner lists stay fast as the table grows. Unique indexes also protect one email per user. Interviewers want the book picture, the write cost, and EXPLAIN as the way you prove a scan versus a jump. CREATE INDEX todos_user ON todos(user_id) is the lab line.\nReal-life example\nSchool library. Without an index you walk every shelf for Ada's name. With an index you open the card drawer to A, then jump. Adding a new book means writing the card too, so returns take a breath longer. A drawer on every word in the blurb would slow the stamp desk for no gain.\nUses\nuser_id on todos, email on users, foreign keys, and any WHERE the API runs on every request. Composite indexes when you always filter city then date. Talk indexes when they ask why production is slow but your 20-row laptop is not.\nWatch out\nToo many indexes slow writes and bloat the disk. An index on a low-value flag may never get used. Functions on the column, like WHERE lower(email), can skip the index unless you planned that. Measure with EXPLAIN. Do not index first and think later.",
      "code": "CREATE INDEX todos_user ON todos(user_id);  -- list-my-todos gets fast\nSELECT * FROM todos WHERE user_id = $1;",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 26,
      "level": "intermediate",
      "q": "What is ACID?",
      "a": "The problem before\nAda's till lost ten rupees. Bob's till never gained them. The power cut sat between the two UPDATEs. Or two clerks sold the last dosa twice. The shop had no both-or-neither rule, only hope and a notebook.\nWhat this is\nACID is four promises on a transaction. Atomic: all writes happen, or none — BEGIN, two updates, COMMIT. Consistent: rules like foreign keys and checks stay true. Isolated: two checkouts do not mix their reads and writes. Durable: after COMMIT, a crash does not lose the row. The lab money transfer is the picture.\nWhat it solves\nA transfer cannot shrink the shop. A crash after COMMIT still has the row on disk. Interviewers want the four words and one till story, not a storage-engine lecture. You know when to open a transaction instead of two lonely queries.\nReal-life example\nSchool canteen till. Atomic: take ten from box A and put ten in box B, or put it all back. Consistent: no box may go below zero if that is the rule. Isolated: two lines do not grab the same last sandwich. Durable: after the stamp, a power cut does not erase the sale.\nUses\nMoney, stock counts, signup plus profile row, and any multi-table write that must stay paired. BEGIN and COMMIT in the sample. ORMs have transaction helpers. Isolation levels (read committed, serializable) are the next question if they push.\nWatch out\nA transaction that stays open holds locks and jams the lunch line. COMMIT after you already sent the client 200, then fail, is a lie. Durable is not a backup off-site. MyISAM-era stories aside, do not assume every store is ACID. Do not wrap a slow HTTP call inside the transaction.",
      "code": "await db.query(\"BEGIN\");\nawait db.query(\"UPDATE accounts SET bal = bal - 10 WHERE id = 1\");\nawait db.query(\"UPDATE accounts SET bal = bal + 10 WHERE id = 2\");\nawait db.query(\"COMMIT\");  // both or neither",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 27,
      "level": "intermediate",
      "q": "How do you rate-limit login?",
      "a": "The problem before\nA bot stood at the gate and tried secret1, secret2, secret3 all morning. The login route was free. The shop locked Ada out after she mistyped, or it never locked anyone. Redis was not in the story. Interviews want a counter and a window, not a vague be careful.\nWhat this is\nRate-limit login means you count attempts per IP or per email in Redis. INCR the key. On the first hit, EXPIRE the key so the window is sixty seconds. If the count is past ten, return 429 and stop bcrypt. The expensive hash never runs for the flood. A human who waits can try again when the key dies.\nWhat it solves\nPassword guessing gets expensive for the attacker and cheap for you. You protect CPU and the user table. Interviewers want Redis, a window, 429, and why you expire. The lab limitLogin is this exact counter. You can also add a slower lock after more fails.\nReal-life example\nSchool office late slips. The clerk stamps each try. Ten stamps in one minute and the window closes: come back later. The stamp pad is Redis. The minute is EXPIRE. 429 is the closed window. Ada who typed one wrong PIN still gets in on try two. The bot with a thousand slips does not.\nUses\nPOST /login, password reset, OTP send, and any public POST that costs money or CPU. Pair with HTTPS so the PIN is not on the street while you count. Mention captchas if they ask for a second desk after the counter.\nWatch out\nLimiting only by IP hurts a campus NAT; add email as a second key. Limiting only by email lets a bot spray many emails. Do not tell the client whether the email exists in the 429 body. Memory counters die on restart; Redis should persist the window or you accept a reset. 429 is not 401.",
      "code": "const n = await redis.incr(\"login:\" + ip);\nif (n === 1) await redis.expire(\"login:\" + ip, 60);  // 60s window\nif (n > 10) return res.status(429).json({ error: \"slow down\" });",
      "ask": "Most asked · Amazon · Uber · Google"
    },
    {
      "id": 28,
      "level": "intermediate",
      "q": "What cookie flags matter?",
      "a": "The problem before\nThe session chit sat in a cookie any script could read. It also rode on HTTP, so the café saw it. It went to every subdomain and every POST from a foreign shop. XSS photocopied the badge. CSRF ordered a delete while Ada was logged in. Flags were left at default.\nWhat this is\nCookie flags are the wax and address on the chit. HttpOnly: page JavaScript cannot read it, which helps against XSS theft. Secure: only send it on HTTPS. SameSite=Lax or Strict: the browser holds it back on most cross-site posts, which helps CSRF. Path and Domain limit which kitchen doors see it.\nWhat it solves\nA stolen innerHTML trick cannot photocopy the session id. A café snoop on HTTP never sees a Secure cookie. A foreign form POST does not automatically bring Lax cookies on many cases. Interviewers want these four names and one sentence each, not we use cookies.\nReal-life example\nSchool planner slip. HttpOnly is a sealed envelope the kids cannot open. Secure is only the locked staff corridor, not the open yard. SameSite is do not hand this slip to another school's runner. Path is only the office door, not the sports shed. Domain is this campus, not every .edu stall.\nUses\nres.cookie sid with httpOnly, secure, sameSite lax in the lab. Session login, CSRF pairing with a separate token if you need cross-site posts. Talk flags when they ask JWT versus cookie, or how you store the ticket.\nWatch out\nHttpOnly does not stop CSRF; it only hides the value from JS. SameSite=None needs Secure. A wide Domain=.example.com sprays the chit to every subdomain. Path=/ is easy and broad. Missing Secure on production is a postcard. Do not put the JWT in a readable cookie and call it safe.",
      "code": "res.cookie(\"sid\", sid, { httpOnly: true, secure: true, sameSite: \"lax\" });",
      "ask": "Most asked · Google · Meta · Microsoft"
    },
    {
      "id": 29,
      "level": "intermediate",
      "q": "What does idempotent mean?",
      "a": "The problem before\nAda's phone blinked and she tapped Pay twice. Two charges. The retry library fired POST /todos again and a twin row appeared. The kitchen treated every knock as a new order. Interviews want a word for safe retry, not just do not double-click.\nWhat this is\nIdempotent means repeating the request does not create a second effect. GET, PUT, and DELETE are idempotent by contract: read again, replace again, delete again. POST /todos twice can make two rows. For payments and creates you send an Idempotency-Key. Same key, same answer, no second row. The lab caches that key in Redis.\nWhat it solves\nRetries after a timeout do not double-bill or twin a todo. Clients can safely resend when the network flaps. Interviewers want the verb list and the key story. You can say PUT /todos/1 with the same body is replace, not add.\nReal-life example\nSchool bell. Ringing it twice does not start two assemblies if the rule is one assembly per period — that is idempotent. Shouting a new order at the canteen twice makes two sandwiches — that is POST. A token on the order slip says this is the same dosa; the cook points at the first plate.\nUses\nPayments, bookings, signup, and any POST the client may retry. DELETE /todos/:id is already safe to repeat. PUT for replace. Store the key plus the response for a day. Return the cached JSON when the key hits again.\nWatch out\nGET should not create rows or it stops being idempotent in spirit. Two different keys are two orders. A key that dies too fast lets a late retry create a twin. Idempotent is not the same as safe: DELETE is idempotent and still destructive. Do not reuse keys across users.",
      "code": "const key = req.headers[\"idempotency-key\"];\nconst cached = await redis.get(\"idemp:\" + key);\nif (cached) return res.json(JSON.parse(cached));  // same answer, no second row",
      "ask": "Most asked · Amazon · Stripe · Google"
    },
    {
      "id": 30,
      "level": "advanced",
      "q": "What is the N+1 query problem?",
      "a": "The problem before\nThe board listed fifty todos. The kitchen ran one query for the list, then walked each row and asked who owns this, fifty more times. Lunch rush meant fifty-one trips. The page felt fine with three rows on a laptop and died in production.\nWhat this is\nThe N+1 query problem is one query to load N rows, then N more queries, one per row, for a child or owner. Fifty todos plus fifty users is fifty-one trips. Fix it with a JOIN, or one IN list for all user ids, then stitch in memory. ORMs hide this when you lazy-load inside a loop.\nWhat it solves\nOne round trip, or two, instead of N+1. The lunch line moves. Interviewers want the loop named as the smell, and JOIN or IN as the fix. The lab SELECT with JOIN todos to users is the picture. Logs that show a burst of identical SELECTs are the tell.\nReal-life example\nSchool attendance. Bad: take the class list, then walk to each kid's house to ask the parent's phone. That is N+1 knocks. Good: one list of names, then one office file that has every parent phone, or one joined register. You do not tour the colony per kid.\nUses\nList endpoints that paint owner email, comments per post, items per order. Enable query logs in dev. In ORMs, prefetch or include, not await user inside map. Talk N+1 when they ask why the API got slow at 100 rows.\nWatch out\nA JOIN that explodes into a huge cartesian product is another fire. Pagination still matters. Fixing N+1 on a list you then filter in Node wastes the join. Dataloaders batch the IN pattern per tick. Do not add a query in a loop and hope the cache saves you.",
      "code": "const { rows } = await db.query(\n  \"SELECT t.*, u.email FROM todos t JOIN users u ON u.id = t.user_id\"  // one trip\n);",
      "ask": "Most asked · Amazon · Meta · Microsoft"
    },
    {
      "id": 31,
      "level": "beginner",
      "q": "Horizontal vs vertical scaling?",
      "a": "The problem before\nFriday traffic melted one oven. The shop bought a bigger oven. Next festival it melted again. Or they spun two ovens and Ada's login lived only in oven one's memory, so oven two said she was a guest. Scale was a word, not a plan.\nWhat this is\nVertical scaling is a bigger machine: more CPU, more RAM, one box. Horizontal scaling is more machines behind a load balancer. Vertical is simple until you hit a ceiling or a price wall. Horizontal needs a stateless app: JWT, or a shared session store, so any oven can cook the next plate. The lab note says do not keep the only login in one process.\nWhat it solves\nYou can add a box when lunch doubles instead of hoping a huge VM exists. A dead box does not take the whole canteen if traffic can shift. Interviewers want bigger versus more, and they want session sticky as the trap.\nReal-life example\nSchool kitchen. Vertical: one giant stove. Horizontal: four stoves and a teacher who points the next kid at a free stove. If each stove keeps its own punch cards, a kid who moves stoves looks new. Shared cards or a stamped wristband let any stove serve them.\nUses\nNode processes behind Nginx, containers, and cloud instance groups. Cache and database may scale on their own axis. Talk this when they ask how you survive a sale or an exam-result day. Health checks pull a sick stove out of the line.\nWatch out\nVertical is a single point of failure. Horizontal without shared sessions looks random-logout. The database can become the new single stove. More boxes cost more if you do not autoscale down. Sticky sessions hide the stateless bug until a box dies.",
      "code": "// many Node processes behind Nginx — horizontal\n// each process must not keep the only copy of login in its own memory",
      "ask": "Most asked · Amazon · Google"
    },
    {
      "id": 32,
      "level": "intermediate",
      "q": "How does HTTPS work in one minute?",
      "a": "The problem before\nPeople said HTTPS is a padlock sticker. They could not name the handshake, the certificate, or why Node still spoke HTTP on 3000. A café could read the PIN on an open street. Interviews want one minute, not a cryptography class, and they want the proxy in the story.\nWhat this is\nThe client and server do a TLS handshake. The server shows a certificate so the browser knows the shop. They agree on keys. After that, HTTP bytes ride encrypted. Nginx or a load balancer often terminates TLS on 443, then talks HTTP to Node on localhost. The lab nginx snippet is that front door.\nWhat it solves\nA snoop cannot read the login or quietly change the body. You can keep the app simple on 3000 while the street door is sealed. Interviewers want handshake, cert, encrypted HTTP, and terminate at the proxy. That is the one-minute answer.\nReal-life example\nSchool gate. The guard shows a badge: the certificate. You and the guard agree a daily code: the keys. Then the lunch order walks the sealed staff corridor: HTTPS. Inside, the canteen still shouts down a short private hall to the cook on port 3000. Guests on the road never hear that shout.\nUses\nProduction login, cookies with Secure, Let's Encrypt certs, and any public API. Explain HSTS if they ask why the next visit skips HTTP. Local class can skip TLS; the public shop cannot. Health checks can stay on HTTP inside the VPC.\nWatch out\nTerminating TLS and then forwarding to Node on a public HTTP port puts the postcard back on the street. A bad or expired cert trains users to click through. HTTPS does not fix XSS or a missing role check. Do not put the private key in Git.",
      "code": "listen 443 ssl;  # TLS ends here\nlocation / { proxy_pass http://127.0.0.1:3000; }  # app sees HTTP on loopback",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 33,
      "level": "beginner",
      "q": "Why bcrypt and not MD5 for passwords?",
      "a": "The problem before\nThe shop ran MD5 on every PIN because it was one line. Two kids with secret looked the same in the book. A stolen table plus a rainbow list opened every locker before lunch. Fast was the bug. Interviews want why slow is the point.\nWhat this is\nMD5 is a fast hash and broken for passwords. bcrypt is slow on purpose and salts each hash so two users with the same PIN do not look the same. The cost factor, 10 in the lab, is how hard you make each guess. Slow hashes make online and offline guessing expensive. You store the hash, never the PIN, and compare at login.\nWhat it solves\nA leaked user table is not a pile of reusable PINs. Same password, different salt, different stain. Interviewers want salt, slowness, and never MD5 or SHA-1 for passwords. bcrypt.hash plus bcrypt.compare is the pair. Newer argon2 is the same idea if they name it.\nReal-life example\nSchool locker wall. MD5 is a cheap padlock everyone can snap with a common key list. bcrypt is a heavy lock that takes time to try, and each locker has its own scratch pattern so two secret locks do not match. A thief with the book still spends years on each door.\nUses\nSignup and login in this lab. Password reset issues a new hash. Any old MD5 column needs a rehash on next login. Talk pepper only if they ask; salt is the required word.\nWatch out\nFast hashes belong to file checksums, not PINs. Cutting the cost factor to speed tests and shipping that to prod makes guessing cheap again. Do not invent your own mix of SHA and salt. Never log the password. Encryption is the wrong tool if you only need to check a PIN.",
      "code": "const hash = await bcrypt.hash(password, 10);  // slow + salt\n// md5(password)  // never for passwords",
      "ask": "Most asked · Amazon · Microsoft · Google"
    },
    {
      "id": 34,
      "level": "beginner",
      "q": "Why not trust req.body.role?",
      "a": "The problem before\nThe signup form sent email, password, and role. A guest posted role admin and walked the stock room. The kitchen trusted the body because the TypeScript type had a role field. Hiding the dropdown was treated as a lock. The name tag was handwritten by the customer.\nWhat this is\nreq.body is guest handwriting. Anyone can POST role admin. You set role in your database on signup, always user. Promote admins by a trusted process: a script, an existing admin, a ticket — not the public form. The lab newUser ignores body.role and writes user. Authorization reads the stored role after login, not the last JSON field.\nWhat it solves\nA crafted POST cannot mint a manager. The UI can even show a role box for later admin tools; the public create path still stamps user. Interviewers want this as mass-assignment: do not copy the whole body into the row. Allow-list the fields you accept.\nReal-life example\nSchool ID desk. The kid may say their name. They may not write principal on the card. The office printer stamps student. A teacher later upgrades a card at the office, not at the lunch window. If the lunch window believed the kid's marker, every tray would say staff.\nUses\nSignup, profile PATCH, and any create that maps JSON to a row. Strip role, id, user_id, and isAdmin from public bodies. Same rule for price on an order: the kitchen prices the dosa, the guest does not.\nWatch out\nORMs that save(req.body) are this bug in one word. A hidden input is not protection. GraphQL and query params can carry role too. After you stamp user, still check role on delete routes. Do not take role from a JWT the client minted; only trust tokens you signed.",
      "code": "const user = { email, hash, role: \"user\" };  // ignore body.role",
      "ask": "Most asked · Amazon · Microsoft"
    }
  ]
};
