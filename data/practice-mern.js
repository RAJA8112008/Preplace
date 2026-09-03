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
      "a": "The problem before\nThe class said \"full stack\" and pointed at four logos. Someone thought Mongo was the page. Someone thought Node was the database. They shipped a demo on http and called it MERN, as if the acronym included HTTPS, Git, and a unique email index. Recruiters asked what each letter does and got a soup of tools.\nWhat this is\nMERN is MongoDB for documents, Express for the HTTP API, React for the UI, and Node as the JavaScript runtime that hosts Express. You write JS on both sides. You still need HTML, CSS, Git, TLS, and auth. In this lab React fetches /api/todos, Express talks to a collection, and a document looks like { text, done, userId }.\nWhat it solves\nYou share a vocabulary. You can map each letter to a layer when you walk signup, login, and list. You stop claiming MERN is a framework that grants security. Interviewers want the expansion and one sentence on what sits in each box.\nReal-life example\nA shop. The ledger in the back is Mongo. The counter clerk who takes tickets is Express. The storefront window the street sees is React. The electricity that runs the clerk's lamp is Node. The lock on the door is HTTPS, which is not in the acronym and still required.\nUses\nStudent apps, small startups, and interview \"explain your stack\" openers. Use it when a document shape matches the JSON you already send. Say what you added on top: JWT, indexes, a Vite proxy, a deploy host.\nWatch out\nMERN is not a security layer. CORS, owner checks, and unique indexes are still your job. Node is not Mongo. Express is not React. Dropping the M and using Postgres is allowed; then it is not MERN and you should say so. Shipping without TLS is still shipping in the clear.",
      "code": "// React  →  fetch(\"/api/todos\")\n// Express →  db.collection(\"todos\").find()\n// Mongo   →  { text, done, userId }",
      "ask": "Most asked · Amazon · Microsoft · startup"
    },
    {
      "id": 20,
      "level": "intermediate",
      "q": "Why does React on :5173 fail to call Express on :3000?",
      "a": "The problem before\nReact on localhost:5173 called Express on localhost:3000 and the browser said no. Students blamed fetch, axios, and Mongo. The two ports are two origins: different scheme, host, or port. A preflight OPTIONS failed, or the API sent no Access-Control-Allow-Origin, and the console filled with CORS words.\nWhat this is\nThe browser applies the same-origin policy. A Vite proxy rewrites /api to http://localhost:3000 so the page stays on 5173 and the browser thinks it is same-origin. In production, put UI and API on one domain or set CORS to the real UI URL, not star, especially if you send cookies.\nWhat it solves\nLocal work feels like one shop. Production names the real shop on the allow list. You can explain preflight, credentials, and why a proxy in vite.config does nothing on Vercel unless you also configure the live API.\nReal-life example\nA hotel room phone may call the front desk extension. Calling the bakery next door needs a number on the hotel's allowed list. The Vite proxy is an internal extension. A CORS header is the public list the bakery posts on its door.\nUses\nVite server.proxy, Express cors({ origin }), and Nginx on one host so / and /api share a scheme and hostname. Use credentials: include plus a specific origin when cookies must cross. Keep the proxy for laptop only.\nWatch out\norigin: true that reflects any Origin is an open door. A proxy only in Vite, forgotten in prod, brings the error back. Cookies need Allow-Credentials and cannot use *. Blocking all OPTIONS breaks preflight. Do not \"fix\" CORS by disabling the browser. localhost versus 127.0.0.1 are different origins.",
      "code": "export default { server: { proxy: { \"/api\": \"http://localhost:3000\" } } };",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "MongoDB vs SQL — when do you pick Mongo in MERN?",
      "a": "The problem before\nThe team picked Mongo because the acronym starts with M. Then they split a checkout into six collections and faked joins with populate in a loop. Reports needed last month's totals and everyone wished for SQL. The other team picked SQL for a nested comment thread and drowned in join tables for a shape that was already a document.\nWhat this is\nPick Mongo when the document is the API shape, like a todo or a post with nested comments, and you want one JS object in and out. Pick SQL when you have many relations, strict rules, and reports. Interviews like: start with the queries, then pick the store. Mongo can transaction; SQL can store JSON. The default is the access pattern, not the logo.\nWhat it solves\nYou make an honest tradeoff instead of a religion. You can say what gets harder: Mongo lists with unique emails need indexes; SQL nested blobs need a plan. You sound like someone who has read a query, not a homepage.\nReal-life example\nA hotel guest folio as one folder is Mongo: name, stay, notes in one packet. Accounts that must balance across rooms, invoices, and payroll are SQL: many relations and a ledger that auditors replay. You do not pick the folder because the stationery shop sold folders that week.\nUses\nTodos, blogs, catalogs, and session-shaped docs fit Mongo in a MERN lab. Orders plus inventory plus money often fit SQL. Hybrid is real: Mongo for the app doc, SQL for billing. Say that if asked about scale.\nWatch out\nUnbounded arrays that grow forever. No unique index on email. Treating populate as a free join. Ignoring transactions when two collections must move together. \"Mongo is schemaless\" as an excuse for no validation. Picking Mongo only because the course said MERN.",
      "code": "await todos.insertOne({ text, done: false, userId });  // one document\n// SQL: INSERT INTO todos(user_id, text) VALUES ($1, $2)",
      "ask": "Most asked · Amazon · Microsoft · Google"
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "Where should a MERN app store the JWT?",
      "a": "The problem before\nThe JWT sat in the query string, in Git, and in a screenshot. One team put it in a cookie JavaScript could read. Another put it in localStorage next to a guestbook that used innerHTML. XSS copied the ticket. Someone thought \"JWT\" meant the store was safe because the token was signed.\nWhat this is\nBest for a browser: an httpOnly cookie on the API domain with Secure and SameSite. Common student path: localStorage plus Authorization Bearer — simpler to code, weaker the moment XSS exists. The signature proves the server wrote the ticket; it does not hide the ticket from JavaScript that can read the store.\nWhat it solves\nYou place the ticket where the threat you accept can or cannot see it. You explain CSRF if you chose a cookie and XSS if you chose localStorage. You never put a token in a URL that lands in access logs and Referer headers.\nReal-life example\nA hotel desk that keeps the metal key is httpOnly: the guest does not pocket it. A paper ticket in an open street bag is localStorage: easy to wave at doors, easy for a pickpocket who already stood in your lobby (XSS). Signing the paper does not stop the theft; it only stops a forged copy at the door.\nUses\nSPA login, refresh-token cookies, and mobile secure stores. Prefer cookies when UI and API share a site. Use Bearer across origins if you must, and then treat XSS as game over. Short expiry plus rotate on login.\nWatch out\nXSS plus localStorage is a stolen session. A cookie without SameSite invites CSRF. Tokens in logs or analytics. localStorage on an http page. A JWT in sessionStorage is still visible to scripts. Never commit a sample token that is actually live. Do not put JWT_SECRET in VITE_.",
      "code": "localStorage.setItem(\"token\", data.token);  // common, XSS-sensitive\nres.cookie(\"sid\", sid, { httpOnly: true, sameSite: \"lax\", secure: true });  // safer",
      "ask": "Most asked · Google · Meta · Microsoft"
    },
    {
      "id": 23,
      "level": "beginner",
      "q": "Walk through signup → login → list todos in MERN.",
      "a": "The problem before\nKids mixed the three doors. Signup returned a user and no ticket. Login compared plain passwords. List forgot the Bearer header and Mongo returned everyone's todos. React stored nothing, so a refresh looked logged out. The whiteboard said \"JWT\" once and skipped the hops.\nWhat this is\nSignup: bcrypt hash the password, insert the user with a server-set role, sign a JWT with the new id, return { token }. Login: find by email, bcrypt.compare, same JWT. List: React sends Authorization Bearer. Express verifies, sets req.user, then find({ userId: req.user.id }). Each door uses the id from the ticket, not from the body.\nWhat it solves\nYou tell one story interviewers want end to end. The guest exists, proves it, and only sees their documents. You show where the hash lives, where the ticket lives, and where the filter lives.\nReal-life example\nA factory badge office. Print a badge after the photo (signup). Swipe the badge at the gate (login). The locker wall opens only the cubby stamped with your number (list). Nobody shouts a locker number through the fence and gets a stranger's coat.\nUses\nEvery MERN CRUD app with accounts. Reuse the same verify middleware on POST, PATCH, and DELETE. Put userId on every todo write. Return 401 when the header is missing or dead so React can bounce to /login.\nWatch out\nRole from req.body. Plain password storage. find({}) for a \"list mine\" route. A token with no expiry. userId taken from the JSON body on create. Sending the hash back in the user object. Two different secrets on signup and login. Forgetting unique email so twins share a login story.",
      "code": "const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);\n// React: Authorization: Bearer + token\n// Express: req.user = jwt.verify(token)\n// Mongo: find({ userId: req.user.id })",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 24,
      "level": "intermediate",
      "q": "What is mongoose populate?",
      "a": "The problem before\nPosts stored an author id. The UI needed a name. The intern looped findById for each post and the shop stalled: N+1. Another intern populated the whole user and sent password hashes to the browser. People called populate \"a join\" and expected one cheap SQL-shaped plan every time.\nWhat this is\nmongoose populate replaces a stored id with the related document, or a slice of fields. Under the hood it is another query or a $lookup, not magic. It is easy to read. It is easy to create N+1 if you populate inside a loop. For lists, project the fields you need: name, not hash.\nWhat it solves\nYou write readable relations without hand-rolling $lookup on every screen. You know the cost: extra work, possible huge payloads. You can say when to denormalize a name onto the post instead of populating a thousand rows.\nReal-life example\nA hotel reservation card holds a guest id. The clerk fetches that guest folder, not every file in the cabinet. If they walk the cabinet once per card in a stack of two hundred, lunch ends. If they photocopy the whole dossier including passport scans, they leaked.\nUses\nAuthor name on a post, customer snippet on an order, and one-off admin screens. Select \"name email\" explicitly. Prefer embedding or a stored display name on hot lists. Use lean() when you only need JSON.\nWatch out\npopulate in a for loop. Selecting password hash or tokens. Deep populate chains that hide three more queries. Assuming it is one SQL join with indexes you already know. Populating a huge comments array on every list. Forgetting the related doc can be null if it was deleted.",
      "code": "const post = await Post.findById(id).populate(\"author\", \"name\");  // author becomes an object",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 25,
      "level": "beginner",
      "q": "How do you structure a MERN repo?",
      "a": "The problem before\nOne folder soup: React files next to server.js next to a committed .env. The client imported a server secret because both sides shared a config file. Two Git repos drifted and nobody could run the app in one clone. Production still pointed at localhost:3000 inside the built bundle.\nWhat this is\nA usual MERN repo is client/ for Vite React and server/ for Express plus Mongo. One Git repo. .env lives in server and is gitignored. The client only gets VITE_API, which is public. Proxy /api in Vite for local work. Two package.json files, two install steps, one README that says the order.\nWhat it solves\nA clear boundary. You deploy each side or one box that serves both. A new clerk clones once and finds the doors. Secrets stay off the storefront glass. Interviewers like a tree drawn in four lines.\nReal-life example\nA shop with a front room and a back room in one building. Customers see the window. The vault is in the back. Keys are not taped to the glass. The street sign is one address even if two crews work inside. A new hire walks in and finds both rooms without asking Slack.\nUses\nCourse projects and small startups. Later a monorepo tool if you grow. Keep .env.example with fake values. Set VITE_API empty when Nginx serves both. Ignore node_modules on both sides. Write the two install commands in the README in the order a stranger should run.\nWatch out\nVITE_DATABASE_URL or VITE_JWT_SECRET, which ship in the JS bundle. Committing node_modules or .env. Hard-coded http://localhost in a production build. Forgetting to run both installs. Two remotes that disagree. Putting Mongo connection code in the React tree \"for convenience\".",
      "code": "// repo/\n//   client/   React\n//   server/   Express + Mongo\n//   .gitignore  includes .env",
      "ask": "Most asked · Microsoft · Amazon"
    },
    {
      "id": 26,
      "level": "beginner",
      "q": "What is an environment variable in MERN?",
      "a": "The problem before\nThe laptop URL was baked into the source. JWT_SECRET was the word secret. Someone named the database password VITE_DATABASE_URL and the whole street could read it in the bundle. Staging used the prod cluster because nobody had a second file. Restart was forgotten after editing .env, so the old URL still ran.\nWhat this is\nAn environment variable is a setting that changes per machine. On the server you read process.env.DATABASE_URL and process.env.JWT_SECRET. On the Vite client you read import.meta.env.VITE_* and those values are public in the built JavaScript. Same code, different rooms: laptop, staging, production.\nWhat it solves\nYou move hosts without editing business logic. You keep the vault combo out of Git. You can explain why a client variable can never hold the Mongo password. Interviews often ask \"where do you put secrets\" right after \"what is MERN\".\nReal-life example\nA factory recipe stays the same; the spice shelf changes by city. Prices on the front window are public (VITE_API). The vault combination is whispered to the night crew at the door (server env), never printed on the window card.\nUses\nURLs, ports, CORS origins, feature flags you accept as public on the client, and secrets only on the server. Docker and PaaS inject env at runtime. Ship an .env.example. Restart Node after changes.\nWatch out\nClient vars are public, period. Missing .env.example makes onboarding guess. Docker images that COPY .env. A default secret in code that \"works until we deploy\". Mixing NODE_ENV with a custom APP_ENV and then branching wrong. Putting spaces around = in a .env and wondering why the URL broke.",
      "code": "const db = process.env.DATABASE_URL;  // server only\nconst api = import.meta.env.VITE_API;  // public in the built JS",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 27,
      "level": "intermediate",
      "q": "What is a Mongo ObjectId and why check it?",
      "a": "The problem before\nA guest opened /api/todos/abc. Mongoose threw CastError and Express returned 500. The page said the kitchen exploded. Another guest sent a twelve-character joke that isValid accepted, then find returned nothing and the handler crashed on a missing document. Support could not tell a typo from an outage.\nWhat this is\nA Mongo ObjectId is a 24-hex value the database mints. Express params arrive as strings. If you pass garbage into findById or new ObjectId, drivers throw. Check ObjectId.isValid and return 400 with { error: \"bad id\" }. If it is valid but missing, return 404. Do not turn a bad id into a stack trace.\nWhat it solves\nClients get an honest 400 instead of a 500. Your logs stay about real failures. You show you know the id is not a random string and not an auto-increment integer. The API stays calm under fuzzing.\nReal-life example\nHotel rooms are \"12A\", not \"banana\". The desk says bad room number and stays open. They do not evacuate the building because someone typed fruit. A valid room that is empty is 404: the number looks right, the guest is not there.\nUses\nEvery :id route, batch ids, and admin lookups. Wrap one readId helper and reuse it. Compare with new ObjectId(id) in queries so a string and an ObjectId do not silently miss. Return the same error shape the React helper already reads.\nWatch out\nisValid is looser than you think; some twelve-character strings pass. Still 404 when the id is well formed and absent. Trusting a client-created id as proof of ownership. Mixing string id and ObjectId in a filter so you match nothing and \"delete\" fails closed or open by accident. Catching CastError globally as 500 forever.",
      "code": "if (!ObjectId.isValid(id)) return res.status(400).json({ error: \"bad id\" });",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 28,
      "level": "beginner",
      "q": "How does React show a 401 from Express?",
      "a": "The problem before\nEach page handled a dead ticket differently. One left the token in localStorage and showed an empty list, so the guest thought they had no tasks. Another printed \"jwt malformed\". A third looped /login because the helper cleared the token after navigate, then fetched again. There was no single door.\nWhat this is\nIf res.status === 401, remove the token, clear React user state, and navigate to /login. Put that in one api() helper so every page behaves the same. 401 means we do not know who you are. Do not treat 403 the same: that user is logged in and not allowed. Optionally try a refresh token once, then bounce.\nWhat it solves\nAn expired ticket returns the guest to the front door, not a blank kitchen. You avoid twelve slightly different logout bugs. Interviewers hear status codes used as product behavior, not only as numbers.\nReal-life example\nA hotel key the lift rejects. The clerk takes the dead card and walks you to reception. They do not lead you to an empty hallway and shrug. A staff-only floor that beeps 403 still leaves the card in your pocket; you are known, just not welcome there.\nUses\nAny fetch that carries the token: list, create, delete, /me. Shared helper, shared redirect. Show a short \"session ended\" message if you want, then the login form. After login, send the user back to the page they wanted if you stored that path.\nWatch out\nTreating 403 like 401 logs out a user who merely cannot see admin. An infinite login loop if /login itself calls a guarded route. Not clearing React state so the header still says Ada. Showing raw JWT library strings. Removing the token but still sending the old Authorization on the next line.",
      "code": "if (res.status === 401) {\n  localStorage.removeItem(\"token\");  // ticket is dead\n  navigate(\"/login\");\n}",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 29,
      "level": "intermediate",
      "q": "CSR vs SSR — what does a typical MERN app use?",
      "a": "The problem before\nThe recruiter asked if the app was good for SEO. The student said yes because it was React. View source was a vacant <div id=\"root\">. They also called Vite \"SSR\" because the Node API was a server. The first paint on a slow phone was a white box and a spinner that never came from HTML.\nWhat this is\nCreate React App and Vite are CSR: the host sends a shell, JavaScript paints the list. SSR, as in Next, renders HTML on the server for that URL, then hydrates. A typical MERN tutorial is CSR plus Express. CSR is simpler to host as static files. SSR helps first paint and public SEO. A login-only todo board rarely needs SSR.\nWhat it solves\nYou say what your MERN actually is. You do not promise SEO you did not build. You can still choose Next later without pretending the current Vite app already returns HTML for each todo.\nReal-life example\nA shop window with a closed curtain until a worker arrives and assembles the display is CSR. A dressed window before you step onto the pavement is SSR. Guests with JS off see a curtain on CSR and a menu on SSR. The locked staff room behind the shop does not need a dressed window.\nUses\nApps behind login: CSR is a fair default. Public blogs, product pages, and social previews: consider SSR or SSG. Hydrate if you need buttons after SSR. Keep Express as the API either way.\nWatch out\nCalling Vite SSR. Fetching only in useEffect and wondering why crawlers see nothing. Hydration mismatches if you later bolt on Next and the server HTML disagrees. Shipping a huge bundle and blaming Mongo for a slow first paint. \"React is a server\" as an answer.",
      "code": "// Vite CSR: index.html + bundle\n// Next SSR: the server returns HTML for this URL",
      "ask": "Most asked · Meta · Amazon · Microsoft"
    },
    {
      "id": 30,
      "level": "intermediate",
      "q": "How do you keep Mongo emails unique?",
      "a": "The problem before\nTwo tabs signed up the same email at once. Both handlers findOne-said free and both inserted. Support saw twin accounts and a confused login. Another app only checked uniqueness in React. A third created the unique index in a notebook and never ran it on production Atlas, so the race lived forever.\nWhat this is\nCreate a unique index: createIndex({ email: 1 }, { unique: true }). On insert, catch error code 11000 and return 409 email taken. Do not rely on findOne then insert; two requests interleave. Normalize case if you want Ada@ and ada@ to be the same person. The index is the referee, not the if statement.\nWhat it solves\nThe database refuses twins even when two Express workers race. The UI can show a calm 409. You demonstrate you know application checks are not atomic. Interviews love this as a \"what can still go wrong\" follow-up to signup.\nReal-life example\nA factory badge desk with two clerks and one clipboard. Both see number 44 free and both stamp 44. A unique stamp machine at the press refuses the second disk. The clipboard was a courtesy; the machine is the law. The rejected clerk tells the worker \"that number is taken\".\nUses\nEmails, usernames, slugs, and compound keys like userId plus client-generated todo id. Create indexes in a startup script you run everywhere. Map 11000 only for that key so other errors stay 500. Tell React to show the server message.\nWatch out\nIndex never created on prod. Case and unicode twins. A sparse unique index that lets many missing emails through. Catching every Mongo error as 409. Unique on a field you then update without care. Checking findOne in a test and calling it done. Dropping the index \"to make seed data easier\" and forgetting to put it back.",
      "code": "await users.createIndex({ email: 1 }, { unique: true });\n// catch err.code === 11000 → 409 email taken",
      "ask": "Most asked · Amazon · Microsoft"
    }
  ]
};
