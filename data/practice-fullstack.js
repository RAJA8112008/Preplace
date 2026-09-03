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
      "a": "The problem before\nThe guest tapped Add and the list told a lie. React painted a row before the kitchen answered. The wifi died, they refreshed, and the slip vanished. Another night the kitchen inserted a row but the waiter never heard 201, so the board stayed empty while the ledger grew a ghost task.\nWhat this is\nClick Add. React POSTs /api/todos with the login token and the trimmed text. Express checks the session or JWT, validates the title, INSERTs a row with user_id from the token, and returns 201 plus that row. React appends the server row. If any step fails, the page shows the error and does not invent a card.\nWhat it solves\nYou get one honest path from the button to SQL. The guest only sees a task the ledger stored. Failed auth, empty text, or a down database stay visible instead of a fake success. Interviewers hear you name each hop: UI, auth, validate, write, 201, redraw.\nReal-life example\nA hotel front desk. A guest asks to add a wake-up call. The clerk writes a slip, the kitchen stamps it, and the clerk pins only the stamped slip on the board. They never pin a blank slip hoping the kitchen will catch up after the lift doors close.\nUses\nAny create form that must match the database: todos, bookings, cart lines, ticket comments. Use the 201 body as the new row so ids match. Optimistic UI is allowed only if you roll the card back when the response is not ok.\nWatch out\nDo not concat a local row before 201. Do not skip the token. Do not trust user_id from the JSON body. Do not swallow 400 or 401. Trim on the server again. If INSERT works and the client drops the response, a refresh must still show the row from SQL.",
      "code": "const res = await fetch(\"/api/todos\", { method: \"POST\", body, headers });\nif (!res.ok) return setErr((await res.json()).error);\nsetTodos((list) => list.concat(await res.json()));",
      "ask": "Most asked · Amazon · Microsoft · Google"
    },
    {
      "id": 20,
      "level": "intermediate",
      "q": "XSS vs CSRF?",
      "a": "The problem before\nTwo hotel scams looked like one \"security bug\". A guestbook note ran as a script when the clerk read it aloud and opened the safe. A rival cafe sent a forged room-service ticket; the guest browser attached the badge cookie by itself. The night shift mixed the two and applied the wrong lock.\nWhat this is\nXSS is attacker JavaScript running inside your page. It can steal tokens, rewrite the DOM, and call your API as the user. CSRF is the browser sending a cookie to your API from another site without the user meaning to. They are different doors. httpOnly cookies plus SameSite help CSRF. Escaping HTML and using textContent help XSS. A JWT in an Authorization header is not attached cross-site by itself.\nWhat it solves\nYou name the attack before you pick the lock. Cookie login needs CSRF thinking. Any string you render needs XSS thinking. You stop promising \"we use HTTPS so we are safe\" as if TLS were a guestbook filter.\nReal-life example\nThe hotel guestbook is XSS: a visitor writes a note the clerk reads as orders. The forged breakfast ticket from the cafe next door is CSRF: the guest never walked to your kitchen, but their badge traveled with the browser. Different crimes, different keys.\nUses\nComment fields, profile names, markdown, admin POST forms, cookie sessions, and any innerHTML. In interviews draw both arrows: script in, versus request out from another origin. Say which store holds the ticket.\nWatch out\nNever assign user text to innerHTML. SameSite=None without Secure is a gift. JWT in localStorage dies the moment XSS exists. CORS alone does not stop CSRF on a cookie API. httpOnly does not stop XSS from firing your own endpoints while the cookie still rides along.",
      "code": "res.cookie(\"sid\", sid, { httpOnly: true, sameSite: \"lax\", secure: true });  // CSRF help\nel.textContent = userName;  // XSS help",
      "ask": "Most asked · Google · Meta · Microsoft"
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "CSR vs SSR vs SSG?",
      "a": "The problem before\nThe hotel tried three menus and blamed React for all of them. Dawn staff printed every page at deploy and prices went stale by lunch. The kitchen cooked HTML on every sit-down and the lobby waited. The salad bar handed guests a raw basket: a blank root until JavaScript assembled the plates.\nWhat this is\nCSR means the server sends a shell and the browser paints with JavaScript, like Vite React. SSR builds HTML on each request, like Next. SSG builds HTML at deploy time. After SSR or SSG the page may hydrate so buttons work. Marketing pages like SSG. Dashboards behind login are often CSR or SSR. The todo lab in this file is CSR talking to Express.\nWhat it solves\nYou pick first paint, freshness, and whether a login wall matters. You explain why view-source is empty on a Vite app and why that is fine for a private list. You stop treating the three acronyms as decorations on a resume.\nReal-life example\nA printed banquet card is SSG: ready before the door opens, wrong if the chef changes the soup. Cooked-to-order is SSR: hot and current, costs a kitchen trip. A DIY salad bar is CSR: fast to set up, the guest stares at an empty counter until the worker arrives with the tongs.\nUses\nLanding pages and docs: SSG. A logged-in todo board: CSR is enough. News with comments or per-user HTML: SSR. Mix on purpose, like a static marketing site plus a CSR app on /app.\nWatch out\nCSR SEO and a blank first paint surprise product people. SSG caches a price you no longer charge. SSR caches that leak one guest into another tab if you key the cache wrong. Saying \"we use Next\" without saying which of the three you actually run fails the follow-up.",
      "code": "// CSR — Vite\n// SSR — Next getServerSideProps / app router\n// SSG — Next generateStaticParams",
      "ask": "Most asked · Meta · Amazon · Microsoft"
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "How would you design login for a todo app?",
      "a": "The problem before\nThe shop left the till open. Passwords sat in plain text. Login tokens rode in query strings and in Git. Anyone who guessed /api/todos saw every list. Logout only hid the form. A role checkbox on the signup page made the next guest an admin.\nWhat this is\nDesign email plus password. Store a bcrypt hash, never the password. After a good compare, set a session cookie with httpOnly, Secure, and SameSite, or issue a short JWT. Serve only HTTPS. Rate-limit /login. Keep roles in the database. /me returns the user. Logout destroys the session and clears the cookie. Verify email can wait; do not skip hashing.\nWhat it solves\nYou prove who the guest is, then you authorize which rows they may touch. You can revoke a session. You keep secrets out of the repo. Interviewers hear a full door: hash, cookie flags, HTTPS, rate limit, /me, logout, owner checks on SQL.\nReal-life example\nA hotel key card. The desk checks an ID, encodes the room, and the door reader trusts the card, not a sticky note the guest wrote. A lost card is cancelled at the desk. The guest never picks \"manager\" on the form and walks into the office.\nUses\nAny app with mine versus yours: todos, notes, bookings. Add MFA and email verify when the shop grows. Prefer cookies for first-party apps; short JWTs if the UI and API sit on different hosts and you accept the trade.\nWatch out\nNever take role from the client. A month-long JWT with no block-list cannot log out everywhere. secure: false in production leaks the cookie. Do not log req.body.password. A missing rate limit turns /login into a password-guessing stall. Hash in the request path, not in the browser as your only defense.",
      "code": "const ok = await bcrypt.compare(password, user.hash);\nif (!ok) return res.status(401).json({ error: \"bad login\" });\nreq.session.userId = user.id;",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 23,
      "level": "intermediate",
      "q": "What is a transaction? Give a signup example.",
      "a": "The problem before\nThe factory printer stamped an employee badge, then crashed before the locker row existed. Morning shift found orphan badges and lockers with no names. Signup that inserted a user and then a welcome todo left a person with an empty board, or a welcome task pointing at nobody, when the second write died.\nWhat this is\nA transaction is a bundle of writes that all commit or all roll back. You BEGIN, INSERT the user, INSERT the welcome todo using that user id, then COMMIT. On any error you ROLLBACK so neither row remains. Postgres makes this the default tool; one connection must run the whole bundle.\nWhat it solves\nThe ledger stays consistent. You never advertise a signup that only half landed. Interviews get a concrete pair: user plus first task, or money out plus money in, not a vague \"ACID is important\" speech.\nReal-life example\nA kirana till. The sale, the stock decrement, and the paper receipt must succeed together. If the printer jams after stock drops, you undo the sale. You do not send the customer home with a bag and a missing line in the book.\nUses\nSignup bundles, transferring balance, placing an order and decrementing stock, booking a room and a payment row. Use one pool client for BEGIN through COMMIT. Return the user only after COMMIT.\nWatch out\nAutocommit on every query is not a bundle. Do not hold a transaction open across a slow HTTP call to a mail vendor. Catch the error and ROLLBACK; a thrown exception that skips COMMIT can sit idle. currval only works on the same session that inserted. Nested \"transactions\" in app code without a real BEGIN still race.",
      "code": "await db.query(\"BEGIN\");\nawait db.query(\"INSERT INTO users(email, hash) VALUES ($1, $2)\", [email, hash]);\nawait db.query(\"INSERT INTO todos(user_id, text) VALUES (currval('users_id_seq'), $1)\", [\"first\"]);\nawait db.query(\"COMMIT\");",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 24,
      "level": "intermediate",
      "q": "What is cache-aside?",
      "a": "The problem before\nThe kitchen asked the warehouse for the same guest list every second. The warehouse walked the whole aisle each time. Then someone treated a sticky note as the only copy; Redis restarted and every todo vanished. Writes updated the note and skipped SQL, so a reboot invented a blank day.\nWhat this is\nCache-aside means the app owns the fill. Read: GET Redis. On a miss, SELECT from SQL, then SET the key with a TTL. Write: UPDATE or INSERT SQL first, then DELETE the key so the next read refills. Redis is a copy. The todo table is the source of truth.\nWhat it solves\nRepeated lists stay fast. A cold cache still has the real rows. You explain stampede, TTL, and invalidation in one story instead of \"we added Redis\". Interviewers want the write path as clearly as the read path.\nReal-life example\nA hotel chalkboard of room status. The desk checks the board first. If the line is blank they walk to the leather ledger, then rewrite the board for thirty seconds. Checkout updates the ledger and erases the chalkboard line so nobody trusts last hour's ink.\nUses\nPer-user todo lists, product pages, and other read-heavy JSON that can be a few seconds late. Key by user id. Keep TTL short for lists that change. Use DEL on every write that touches that list, including delete and toggle done.\nWatch out\nNever treat Redis as the only store. A long TTL serves a deleted task. Forgetting DEL after INSERT shows a stale empty list. Cache the wrong user's key and you leak a list. A miss storm can stampede SQL; a lock or a slightly staggered TTL helps. Do not cache another user's rows under a shared key.",
      "code": "const hit = await redis.get(key);\nif (hit) return JSON.parse(hit);\nconst rows = await db.query(\"SELECT * FROM todos WHERE user_id = $1\", [id]);\nawait redis.set(key, JSON.stringify(rows), \"EX\", 30);",
      "ask": "Most asked · Amazon · Uber · Google"
    },
    {
      "id": 25,
      "level": "beginner",
      "q": "How do you deploy React + API?",
      "a": "The problem before\nStudents put the React build on one free host over http and the API on another over http. The browser blocked mixed content. CORS was starred open. DATABASE_URL sat in the repo. Refreshing /todos on the static host showed a blank 404 because nobody told the server to fall back to index.html.\nWhat this is\nShip the UI on Vercel or Netlify with HTTPS. Ship the API on Render, Railway, or a box with HTTPS. Set CORS to the real UI origin, not star. Put DATABASE_URL and secrets in the host env. Or use one domain: Nginx serves the built React files and proxies /api to Node on localhost. Cookies then stay first-party.\nWhat it solves\nUsers type https:// and stay there. Secure cookies work. The API is not a public kitchen door on port 3000. You can draw both shapes: split hosts with CORS, or one host with a reverse proxy.\nReal-life example\nA shop storefront on the street and a kitchen in the back, one public door. Or two buildings with a signed corridor: the window host may call only the kitchen host on the allow list. Guests never walk into the alley and shout at the fryer.\nUses\nCourse deploys, startup MVPs, and any SPA plus API. Use try_files for client routes. Set VITE_API to the https API or leave it empty for same-origin /api. Run migrations against the prod database URL on the host, not from a laptop copy.\nWatch out\nCORS * with cookies is a trap. An https page cannot call an http API. Secrets in the client bundle are public. Forgetting the SPA fallback breaks refresh. Opening :3000 on 0.0.0.0 \"just to test\" on a VPS is a real door. Do not commit .env.production with the live password.",
      "code": "location / { try_files $uri /index.html; }  # React\nlocation /api/ { proxy_pass http://127.0.0.1:3000; }  # Express",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 26,
      "level": "intermediate",
      "q": "Cookies vs Authorization header?",
      "a": "The problem before\nThe waiter sent the room key with every plate, including plates ordered from a rival cafe, because the key lived in a cookie the browser attaches alone. Another shift put the key in a drawer JavaScript could read; a guestbook script copied it. The class said \"tokens\" as if both stores behaved the same.\nWhat this is\nA cookie is sent automatically on matching requests. That is convenient and a CSRF risk; SameSite and a CSRF token help; httpOnly hides it from JS. An Authorization Bearer header is sent only when your code adds it. Cross-origin calls need CORS and often a preflight. The header cannot be httpOnly; JS must see the token to attach it.\nWhat it solves\nYou choose auto-send versus explicit attach. You explain why cookie auth needs CSRF work and why a header token is XSS-sensitive if it sits in localStorage. You pick credentials: include when the cookie must travel.\nReal-life example\nA hotel desk that keeps the key behind the counter is an httpOnly cookie: the guest does not hold the metal. A paper ticket the guest flashes at each door is a Bearer header: easy to show, easy to steal from an open bag. A rival cafe cannot flash a ticket they never received.\nUses\nFirst-party session cookies for a UI and API on one site. Bearer headers for a SPA on another origin talking to your API. Mobile apps often store a token in their own secure store and send a header, not a browser cookie.\nWatch out\nForgetting credentials: include drops the cookie. SameSite=None is required for some cross-site cookies and still needs Secure. Putting a token in the query string lands it in logs. Thinking a header is httpOnly is a confused answer. XSS plus localStorage is a stolen session.",
      "code": "fetch(\"/api/todos\", { headers: { Authorization: \"Bearer \" + token } });\nfetch(\"/api/todos\", { credentials: \"include\" });  // cookie",
      "ask": "Most asked · Google · Meta · Microsoft"
    },
    {
      "id": 27,
      "level": "intermediate",
      "q": "How do you paginate a todo list?",
      "a": "The problem before\nThe desk dumped fifty thousand slips on the counter. Page 500 with OFFSET 10000 made Postgres walk past ten thousand rows every click. Inserts in the middle opened holes so \"page 3\" skipped a task. The UI asked for all rows and sliced in the browser until the tab froze.\nWhat this is\nPagination returns a window, not the whole table. LIMIT plus OFFSET is simple and gets slower as the offset grows. Keyset pagination uses WHERE user_id = $1 AND id > $2 ORDER BY id LIMIT 20 and stays cheap if id is indexed. Return { items, nextCursor } so the UI loads more. Fetch 21 to know if a next page exists.\nWhat it solves\nThe list stays fast on page one hundred. Cursors stay stable when new rows land at the end. You stop shipping a megabyte of JSON to draw twenty cards. Interviewers hear why OFFSET hurts and how a cursor is just the last id you saw.\nReal-life example\nA factory ticket rail numbered in order. The clerk says \"give me twenty after ticket 840\", not \"skip sixteen thousand and then twenty\". New tickets clip on the end. Nobody recounts the whole rail to find the next handful.\nUses\nTodo lists, admin tables, feeds, and infinite scroll. Keyset works well on a monotone id or created_at plus id. OFFSET is fine for tiny admin pages. Always ORDER BY the same columns you compare in the WHERE.\nWatch out\nOFFSET on a hot table is a trap. No ORDER BY makes pages shuffle. Changing the sort without a new cursor shape breaks next. Returning only twenty with no hasMore guesswork stalls the UI. Client-only pagination after SELECT * is not pagination. Do not skip the user_id filter on a \"page\" query.",
      "code": "const { rows } = await db.query(\n  \"SELECT * FROM todos WHERE user_id = $1 AND id > $2 ORDER BY id LIMIT 21\",\n  [userId, lastId]\n);",
      "ask": "Most asked · Amazon · Meta · Microsoft"
    },
    {
      "id": 28,
      "level": "beginner",
      "q": "Frontend validation vs server validation?",
      "a": "The problem before\nThe shop trusted the price sticker the customer brought to the till. The browser said the title was required, so the team skipped the server check. An attacker POSTed empty JSON and stored a blank task. The opposite shop only checked on the server; every typo waited a full round trip and the guest thought the button was dead.\nWhat this is\nFrontend validation is a fast courtesy: trim, length, required fields, show a message before fetch. Server validation is the law: trim again, reject empty or huge text with 400, ignore unknown fields, never trust role or user_id from the body. Both run. The UI can be bypassed with curl. The server cannot be.\nWhat it solves\nHonest UX plus a locked ledger. Attackers who skip the form still fail. Users who mistype get a local message. You can say the same rule twice without being wasteful: the second check is for people who are not using your React at all.\nReal-life example\nHotel breakfast. The waiter glances at an empty plate at the table and says order something. The kitchen still weighs the ticket; a forged slip with no dish is sent back. Two checks, one meal. The guest never walks into the stockroom to file their own ticket.\nUses\nLengths, email shape, enums, file size, and anything that becomes SQL. Mirror the 1–200 character rule in both places. Keep the server message boring and safe to show. Use the same error shape { error: string } the React page already reads.\nWatch out\nUI-only validation is not validation. Different limits on each side confuse testers. Do not return raw SQL errors. Do not accept a ten megabyte \"text\". Validating only with a required attribute in HTML is a demo, not a defense. Never let the client set done plus owner plus role in one unchecked PATCH.",
      "code": "if (!text.trim()) return setErr(\"type a task\");  // UI\nif (!String(req.body.text || \"\").trim()) return res.status(400).json({ error: \"text required\" });",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 29,
      "level": "intermediate",
      "q": "What is a connection pool?",
      "a": "The problem before\nEach waiter opened a new warehouse door for every plate. The handshake took longer than the SELECT. Under lunch rush they spawned hundreds of doors and Postgres hit max connections and died. Another shift created a new Pool inside the request handler, so nothing was reused at all.\nWhat this is\nA connection pool keeps a small set of live SQL connections and loans one out per query or transaction. Opening a TCP plus auth plus session each time is expensive. new Pool({ connectionString, max: 10 }) sizes for the database and for how many Node instances you run, not for \"as many as the event loop can imagine\".\nWhat it solves\nRequests share warm connections. The database is protected by a cap. You can BEGIN on a borrowed client and RELEASE it after COMMIT. Interviews want the why: handshake cost, max connections, and serverless math where each instance has its own pool.\nReal-life example\nA hotel with ten kitchen passes. Waiters queue for a pass; they do not carpenter a new pass per omelette. If every floor built its own ten passes, the kitchen still only has so many burners. The pass count is a budget, not a boast.\nUses\nEvery Node plus Postgres or MySQL app. Keep one pool per process. For a transaction, take a client, BEGIN, work, COMMIT or ROLLBACK, then release. Health checks can use the same pool with SELECT 1.\nWatch out\nA pool per request is a leak factory. Forgetting to release a client during a transaction exhausts the pool. max too high knocks over the database when you scale out. Holding a client while you await an HTTP email call blocks a scarce pass. Serverless with max 10 times fifty cold instances is still five hundred connections.",
      "code": "const db = new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });",
      "ask": "Most asked · Amazon · Google"
    },
    {
      "id": 30,
      "level": "beginner",
      "q": "What is mixed content?",
      "a": "The problem before\nThe lobby ran on https://. The waiter phoned the kitchen on a clear alley line, http://api. The browser slammed the door and the login looked broken. Cookies marked Secure never left. On a laptop it \"worked\" because both sides were http. Production was a locked street door shouting at an open window.\nWhat this is\nMixed content is an https page that loads or calls http resources. Browsers block active mixed content such as fetch and scripts. Images may warn. The fix is an https API or same-origin /api behind TLS on the same host so the page never names http:// at all.\nWhat it solves\nThe page and the API tell the same security story. Secure cookies can travel. Guests do not see a silent failed fetch. You can explain why a VITE_API that starts with http:// is a production bug even when the UI host is fine.\nReal-life example\nA fancy hotel revolving door, then an order shouted through an alley window to a kitchen with no lock. The house detective will not allow it. Either put the kitchen behind the same door or give the kitchen its own HTTPS street entrance.\nUses\nfetch, websockets, script tags, and XHR from a TLS page. Local Vite can proxy /api so the browser stays on one origin. Production Nginx or the platform TLS must cover that origin. Use relative /api when you can.\nWatch out\nA production build that still points at http://localhost:3000. VITE_API=http:// on a live host. Secure cookies that never reach an http API. \"It works on my laptop\" as the deploy test. Service workers caching an old http API URL. Allowing mixed content in a browser flag is not a strategy.",
      "code": "const API = \"\";  // same origin /api — no mixed content",
      "ask": "Most asked · Google · Microsoft"
    }
  ]
};
