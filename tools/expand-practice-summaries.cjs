"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..", "frontend");
const DATA = path.join(ROOT, "data");
const HEADS = [
  "Summary",
  "The problem before",
  "What this is",
  "What it solves",
  "Real-life example",
  "Uses",
  "Watch out"
];
const HEAD_RE = /^(Summary|The problem before|What this is|What happens|What it solves|Real-life example|Uses|Watch out|What the code is doing|Also know|Say this in an interview|Before you use this|Why we use it|When to pick this)\.?$/i;

const words = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;

const sentences = (text, n) => {
  const bits = String(text || "").match(/[^.!?]+[.!?]+(?:\s+|$)/g);
  if (!bits || !bits.length) return String(text || "").trim();
  return bits.slice(0, n).join("").trim();
};

const splitSections = (raw) => {
  const lines = String(raw || "").replace(/\r/g, "").split("\n");
  const map = {};
  let title = "";
  let buf = [];
  const flush = () => {
    const body = buf.join("\n").trim();
    if (title && body) map[title] = map[title] ? `${map[title]}\n\n${body}` : body;
    buf = [];
  };
  for (const line of lines) {
    if (HEAD_RE.test(line.trim())) {
      flush();
      const t = line.trim().replace(/\.$/, "");
      title = /^summary$/i.test(t) ? "Summary"
        : /^(the problem before|before you use this)$/i.test(t) ? "The problem before"
        : /^what this is$/i.test(t) ? "What this is"
        : /^(what it solves|why we use it)$/i.test(t) ? "What it solves"
        : /^real-life example$/i.test(t) ? "Real-life example"
        : /^(uses|when to pick this)$/i.test(t) ? "Uses"
        : /^watch out$/i.test(t) ? "Watch out"
        : /^what the code is doing$/i.test(t) ? "What this is"
        : t;
      continue;
    }
    buf.push(line);
  }
  flush();
  return map;
};

const joinSections = (map) => HEADS
  .filter((h) => map[h])
  .map((h) => `${h}\n${map[h].trim()}`)
  .join("\n\n");

const codeNotes = (code) => {
  const notes = [];
  for (const line of String(code || "").split("\n")) {
    const idx = line.indexOf("//");
    if (idx < 0) continue;
    const src = line.slice(0, idx).trim().replace(/[,;{()]+$/, "");
    const note = line.slice(idx + 2).trim();
    if (!note) continue;
    if (src) notes.push(`\`${src.slice(0, 80)}\` — ${note}`);
    else notes.push(note);
  }
  return notes;
};

const walkthrough = (code) => {
  const notes = codeNotes(code);
  if (!notes.length) return "Read the snippet under this question. The green comments on the right say what each line is doing.";
  const shown = notes.slice(0, 8);
  return `Walk the snippet like this: ${shown.join(". ")}.${notes.length > 8 ? " The rest of the comments follow the same idea." : ""}`;
};

const firstUsefulLine = (code) => {
  for (const line of String(code || "").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("//") || t.startsWith("/*") || t === "{" || t === "}") continue;
    return t.slice(0, 90);
  }
  return "";
};

const pad = (text, min, extra) => {
  let out = String(text || "").trim();
  const bits = Array.isArray(extra) ? extra : [extra];
  let i = 0;
  while (words(out) < min && i < 12) {
    const bit = bits[i % bits.length];
    if (bit && !out.includes(String(bit).slice(0, 40))) out += (out.endsWith(".") ? " " : ". ") + String(bit).replace(/\.*$/, ".");
    else out += " Say the job in one sentence, then point at the code, then name one mistake.";
    i += 1;
  }
  return out.trim();
};

const kindOf = (item) => {
  const q = String(item.q || "").toLowerCase();
  const a = String(item.a || "").toLowerCase();
  const h = `${q} ${a}`;
  if (/\bjoin\b|group by|where vs having|oltp|warehouse/.test(h)) return "sql";
  if (/s3|lambda|iam|cognito|rds|vpc|alb|waf|presign/.test(h)) return "cloud";
  if (/docker|compose|ci\/cd|github actions|k8s|kubernetes|blue-green/.test(h) && /practice:|project:/.test(q)) return "ops";
  if (/overfit|precision|recall|bias|variance|leakage|train.?test/.test(h)) return "ml";
  if (/redis|cap theorem|replica|shard|vector|nosql vs|sql vs nosql/.test(h)) return "store";
  if (/rate limiter|url shortener|load balancer/.test(h) && /sys|design|shortener|limiter/.test(h)) return "design";
  if (/cors/.test(h)) return "cors";
  if (/xss|innerhtml|textcontent/.test(h)) return "xss";
  if (/csrf/.test(h)) return "csrf";
  if (/https|tls/.test(q)) return "https";
  if (/jwt|token|login|signup|password|bcrypt|session|cookie|role|401|403|auth/.test(h)) return "auth";
  if (/localstorage|sessionstorage/.test(h)) return "storage";
  if (/createelement|queryselector|addeventlistener|closest|delegation|#grid|makeCard|project:/.test(h)) return "dom";
  if (/usestate|useref|react key|why does react/.test(h)) return "react";
  if (/fetch\(|express|middleware|app\.(get|post|patch|delete)/.test(h) || /\/todos/.test(q)) return "api";
  if (/\b(select|insert|update|delete from|create table)\b/.test(h)) return "sql";
  if (/delete|remove/.test(q)) return "delete";
  if (/update|patch|mark |edit |tick |done/.test(q)) return "update";
  if (/get \/|show |list |read |print /.test(q)) return "read";
  if (/post \/|add |create |push/.test(q)) return "create";
  return "lab";
};

const packs = {
  create: {
    problem: "If you only keep a string on the screen, you cannot tick, edit, or delete that one item later. Two identical titles collide. Refresh wipes the list because nothing was stored as a real record with an id.",
    what: "Create means you build one object that represents the thing, give it a unique id, then add it to the list or table. Empty text is not a row. Trim spaces first. Return the new object or a 201 body so the UI can paint it.",
    solves: "Later steps can find this row by id. Tick, edit, and delete become map/filter or UPDATE/DELETE WHERE id. Interviewers want the word Create from CRUD, plus validation before you push.",
    example: "A school attendance book. You do not shout 'Ada is here' into the air. You write one new line: roll number, name, present. That line is the object. The roll number is the id. A blank name is not a line.",
    uses: "Todo add, signup, POST /todos, INSERT, 'Add card' on a form. Any button that should make a new row.",
    watch: "Do not push empty strings. Do not use the array index as a lasting id if you will delete the middle item. Date.now is fine for a lab; a database uses a real primary key. Never trust the client to pick a privileged field like role: 'admin'."
  },
  read: {
    problem: "The data existed in memory or SQL, but the screen showed a hardcoded list. After add or delete, the page lied. Two tabs showed different truth because nobody read from one source.",
    what: "Read means you take the current list and show it. GET /todos returns JSON. showAll wipes the old nodes and paints each object. SELECT returns rows. You do not invent items in the render function.",
    solves: "The page matches the list. After Create/Update/Delete you Read again (or return the new array). Interviewers want GET as the safe method that does not change data.",
    example: "A notice board. The clerk does not remember posters from yesterday. They look at the drawer (the array or table) and pin every paper that is still there. If the drawer is empty, the board is empty.",
    uses: "Home lists, admin tables, GET /me, SELECT ... FROM todos WHERE user_id = $1. React mapping an array to cards.",
    watch: "GET must not delete or create. Do not send another user's rows. If the list is huge, paginate. replaceChildren before append or you duplicate cards."
  },
  update: {
    problem: "People replaced the whole list, or ticked every row, because they had no id. PATCH without an id is a dangerous UPDATE without WHERE.",
    what: "Update means change fields on the matching id only. map in JS: if id matches, spread the old object and overwrite done or text. PATCH /todos/:id. SQL UPDATE ... WHERE id = $1.",
    solves: "One tick does not wipe the rest. The object keeps its id. You can send only the changed fields.",
    example: "A marksheet. You change Ada's maths marks. You do not rewrite the whole class register. The roll number stays the same. Only one cell changes.",
    uses: "Mark done, edit title, PATCH, UPDATE. Toggle a flag. Rename a card.",
    watch: "UPDATE without WHERE updates every row. In JS, skip items whose id does not match. Check ownership on the server. Validate the new text; do not save empty titles."
  },
  delete: {
    problem: "Splice by index deleted the wrong row after a sort. A guest called DELETE and wiped someone else's todo. There was no 403.",
    what: "Delete means drop the row with that id. filter in JS. DELETE /todos/:id. SQL DELETE FROM todos WHERE id = $1 AND user_id = $2. Then Read again so the UI matches.",
    solves: "The list shrinks by one. Other ids stay. Interviewers want ownership: only the owner or an admin.",
    example: "A lost-and-found shelf. You remove the tag with ticket 42. You do not sweep every bag. Ticket 43 is still there.",
    uses: "Remove todo, destroy card, DELETE route, unsubscribe. Soft-delete with deleted_at is the same idea with a flag.",
    watch: "Never delete by position 0 after a sort. Confirm on the UI, enforce on the server. 404 if missing, 403 if not yours."
  },
  auth: {
    problem: "Anyone who knew the URL could act as Ada. Passwords sat in plain text. The UI hid a button and called that security. A stolen token never expired.",
    what: "Authentication is who you are: email + password, then a token or cookie. Authorization is what you may do: role or owner check. Hash passwords. The server decides 401 (not logged in) vs 403 (logged in but not allowed).",
    solves: "Guests bounce. Users cannot wipe admin data. You can say both words in an interview without mixing them.",
    example: "A library. The card at the door is authentication — you are Ada. The rare-book stamp is authorization — only staff may take that shelf. Hiding the door is polite. The librarian still checks the stamp.",
    uses: "Login, signup, JWT, sessions, admin routes, owner-only delete. Middleware that reads Authorization.",
    watch: "Hiding a button is not security. Do not trust req.body.role. Do not put JWT in localStorage if you can use an httpOnly cookie. Never store raw passwords. HTTPS for every login."
  },
  cors: {
    problem: "The UI ran on localhost:5173 and the API on :3000. fetch failed with a CORS error. People blamed React. Postman still worked, which confused everyone.",
    what: "CORS is a browser rule. Origin is scheme + host + port. The server must allow that UI origin, or you proxy /api so the browser sees one origin. curl is not a browser, so it skips CORS.",
    solves: "You fix the error in the right place: API headers or a same-origin proxy. You stop turning off the browser check to 'make it work'.",
    example: "Two shops on different streets. A runner from shop A asks shop B for the ledger. The guard says no unless shop B posted a sign with shop A's name. A proxy is a hatch inside shop A.",
    uses: "Vite + Express, app.example.com calling api.example.com, cookies with credentials.",
    watch: "CORS is not a server firewall. Access-Control-Allow-Origin: * cannot mix with credentials. Preflight OPTIONS must succeed. Fix it on the server."
  },
  xss: {
    problem: "A todo title contained a script tag. innerHTML ran it as your site's JavaScript. Tokens leaked. People thought they were 'just showing a name'.",
    what: "XSS means attacker text runs as JS in your page. Use textContent or a framework that escapes. Stored XSS sits in the database. Reflected XSS rides a query string. DOM XSS writes location.hash into HTML.",
    solves: "Guest handwriting stays handwriting. <script> shows as letters. Interviewers want the three kinds and one sink: innerHTML.",
    example: "A suggestion box. If the monitor reads the note aloud as an order, the till opens. If they pin the paper as text, it is only ugly ink. textContent pins the paper.",
    uses: "Any user title, comment, search, markdown. React children are safe; dangerouslySetInnerHTML is not.",
    watch: "Escaping in the database is not enough if you later concat HTML. href and onclick are sinks too. Pair with CSP."
  },
  csrf: {
    problem: "Ada was logged in. An evil page submitted a hidden form to your bank with her cookies. The bank thought Ada clicked.",
    what: "CSRF is the browser sending cookies to your site from another site's form or image. SameSite cookies, CSRF tokens, and not using GET for deletes are the usual fixes.",
    solves: "A foreign page cannot ride Ada's login. XSS is different: XSS runs inside your page.",
    example: "A forged hall pass that uses the real ink stamp because the browser still carries the cookie. The kitchen must check a second secret the foreign page does not have.",
    uses: "Cookie sessions, form POSTs, banks, anything that changes state.",
    watch: "JWT in Authorization header is not sent by a foreign form, but XSS can still steal it. SameSite=Lax is a start, not the whole story."
  },
  https: {
    problem: "Login rode http:// on cafe Wi-Fi. Anyone could read the password. Mixed content blocked https pages that still called http APIs.",
    what: "HTTPS is HTTP inside TLS. The padlock encrypts the pipe and checks the certificate. The verbs are still GET and POST. Redirect http to https at the edge.",
    solves: "Passwords, cookies, and tokens are not postcards. Interviewers want TLS named, not 'the green lock magic'.",
    example: "A sealed envelope vs a postcard. Same letter inside. The street cannot read the envelope. The address on the outside is still HTTP's URL.",
    uses: "Every login, payment, cookie, fetch to an API. Localhost labs may skip it; production must not.",
    watch: "Never post passwords to http://. An https page calling http is mixed content. Putting a key in frontend code is not fixed by HTTPS."
  },
  storage: {
    problem: "Refresh wiped the todos. Or the login token sat in localStorage where any XSS could read it. People used one junk drawer for theme, draft, and session.",
    what: "localStorage stays until cleared. sessionStorage dies with the tab. Cookies can be sent to the server; httpOnly cookies cannot be read by JS. Pick the shelf that matches the job.",
    solves: "Drafts survive refresh. Sessions can be safer in cookies. Interviewers want the three compared: lifetime, who can read, does the server see it.",
    example: "A price book in the drawer overnight is localStorage. Chalk on one slate that wipes when the window closes is sessionStorage. A sealed chit the runner takes to the kitchen is an httpOnly cookie.",
    uses: "Theme, todos in a lab, wizard drafts, session ids.",
    watch: "XSS plus localStorage JWT is a stolen account. Do not store passwords. Cookies have size limits and CSRF issues."
  },
  api: {
    problem: "The browser talked to the database, or every screen invented its own save path. Mobile could not share the web app's logic. Passwords sat in the page.",
    what: "An API is method + URL in, status + JSON out. GET reads. POST creates. PATCH updates. DELETE removes. 400 bad input, 401 login, 403 forbidden, 404 missing, 500 server bug.",
    solves: "Web, mobile, and Postman all hit the same window. The server owns the database. The UI only orders.",
    example: "A kitchen window. You do not cook. You order POST /dosa. The kitchen answers 201 with a plate or 400 if the order is blank.",
    uses: "Express, FastAPI, any JSON backend. Health checks. Login then Authorization header.",
    watch: "GET must not delete. Never trust the body for role. Hash passwords. CORS is a browser extra, not the only lock."
  },
  dom: {
    problem: "People typed twenty cards in HTML. New cards did not get click listeners. innerHTML with user text became XSS. The page reloaded on every submit.",
    what: "Keep data in an array. Render that array into nodes. createElement + textContent is safe. One listener on the parent (delegation) hears every card, including new ones. preventDefault on submit.",
    solves: "Add/delete/search stay in one paint function. Memory does not leak per-button listeners. User text cannot run as code.",
    example: "A pin board. The list of notices lives in a folder. You clear the board and pin each paper again. One teacher at the end of the table hears a tap on any tray.",
    uses: "Card grids, todos, menus, vanilla JS before React. The same idea as mapping in React.",
    watch: "Do not put user text in innerHTML. dataset.id must be the real id. Always replaceChildren before a full repaint or you duplicate."
  },
  react: {
    problem: "Index keys mixed input state after a delete. Timer ids in useState caused extra paints. Lists remounted because keys were random.",
    what: "useState is a value that repaints the screen. useRef.current does not repaint. key must be a stable id so React can match rows after insert/delete. Map data to components; do not copy the DOM by hand.",
    solves: "The right row keeps its textbox. Timers do not thrash the tree. Interviewers want this split in one breath.",
    example: "Name stickers on lunch trays, not 1-2-3 in line. If Ada leaves, Bob does not inherit her pickle. The pickle is component state.",
    uses: "Todo UIs, forms, lists, focus, intervals.",
    watch: "key={index} breaks on reorder. key={Math.random()} remounts every paint. Do not put visible text only in a ref."
  },
  sql: {
    problem: "Spreadsheets on one laptop, or UPDATE without WHERE, or a report that locked checkout. People glued user text into SQL and opened an injection hole.",
    what: "SQL talks to tables with rules. INSERT, SELECT, UPDATE, DELETE. WHERE vs HAVING. JOIN combines tables. Parameters ($1 or ?) stop injection. Transactions keep two writes together.",
    solves: "One shared register. Unique emails. Reports that do not guess. Interviewers want you to say WHERE first, then the join, then the risk of no WHERE.",
    example: "A school register. One row per student. You cannot mark roll 99 if 99 is not in the book. Changing marks without a roll number would rewrite the whole class.",
    uses: "Users, orders, money, analytics. PostgreSQL, MySQL, SQLite.",
    watch: "DELETE/UPDATE without WHERE. String-concat SQL. Running a 20-second report on the checkout primary. NULL is not empty string."
  },
  cloud: {
    problem: "Files sat on one laptop. Keys were in Git. SSH was open to the world. The UI was http. Nobody knew who paid when a script looped.",
    what: "Cloud labs put the UI on S3+HTTPS, compute on EC2 or Lambda, data on RDS, doors in IAM and security groups. The app still does CRUD. The cloud is the building, not a new kind of todo.",
    solves: "A restart does not wipe the only disk you had. Keys stay in a secret store. Interviewers want IAM vs app roles named separately.",
    example: "A rented shop: lockers (S3), a kitchen you do not stand in all day (Lambda), a safe (RDS), name badges (IAM). You still write the menu.",
    uses: "Static sites, APIs, uploads, alarms. Same HTTPS and auth rules as a VPS.",
    watch: "Do not commit keys. 0.0.0.0/0 on SSH is an open door. IAM is not the same as isAdmin in your JWT. S3 is not a SQL database."
  },
  ops: {
    problem: "It worked on Ada's laptop. Bob copied a zip. Tests never ran on a clean machine. Rollback meant hunting Downloads.",
    what: "Docker packs the app. Compose runs API + DB. CI tests every push. CD ships the same tested box. A health URL tells the load balancer the process is alive.",
    solves: "Same box in CI and prod. Rollback is last week's sha. Interviewers want CI vs CD in one sentence.",
    example: "A factory. Every batch is weighed (CI). Only a stamped box goes on the truck (CD). Health is the light that says the oven is on.",
    uses: "GitHub Actions, Dockerfiles, blue-green, probes, secrets in the host not the YAML.",
    watch: ":latest in prod. Secrets in the Dockerfile. Deploying after a red pipeline. Health checks that only ping and never hit the DB you need."
  },
  ml: {
    problem: "The model was 99% on train and failed on new rows. People quoted accuracy on imbalanced labels. A future column leaked into train.",
    what: "Train/test split. Overfit memorizes. Precision vs recall. Bias vs variance. Leakage is using information you would not have at predict time.",
    solves: "You can explain a bad demo. Interviewers want the metric that matches the cost of a miss.",
    example: "A practice exam vs the real board exam. Memorizing last year's paper is overfit. A hint that includes the answer key is leakage.",
    uses: "Any fit/predict lab, medical false negatives, spam false positives.",
    watch: "Do not tune on the test set until you treat it as a final exam. Accuracy can lie. Shuffle by group so one user is not in both sets."
  },
  store: {
    problem: "One JSON file, or Mongo for a bank ledger, or Redis as the only user table. A restart wiped logins. Reports needed joins that the store could not do.",
    what: "Pick the cabinet for the access pattern. SQL for money and joins. Mongo for nested documents. Redis for cache and TTL. Vectors for 'similar meaning'. CAP is a tradeoff when the network splits.",
    solves: "You can say why, not only which logo. Cache misses should hit the system of record.",
    example: "A register vs a hot pot on the counter vs a folder of papers. The hot pot can spill. The register must survive.",
    uses: "Todos in Postgres, sessions in Redis, posts in Mongo, RAG in pgvector.",
    watch: "Redis FLUSHALL is not a user migration. A replica is a copy, a shard is a slice. Do not pick Mongo because a tutorial used it for users+orders+money."
  },
  design: {
    problem: "People jumped to microservices or to a table sketch. They never walked one request from the phone to the disk and back.",
    what: "System design is the request path: DNS, TLS, load balancer, app, cache, database, queue. Capacity, failure, and a bottleneck. Draw boxes, then the arrows.",
    solves: "You can design a shortener or rate limiter without drowning in brand names. Interviewers want the path, then one scale step.",
    example: "A railway: ticket window, platform, train, destination. If the window is slow, extra windows (scale out) beat a fancier train first.",
    uses: "URL shortener, feed, chat, rate limit, any interview design.",
    watch: "Do not start with Kafka. Name the single box that dies. Cache is not the source of truth. Estimate before you add a new logo."
  },
  lab: {
    problem: "The feature was only a comment in someone's head. The page looked done until a refresh, a second user, or a wrong id.",
    what: "This lab is one small complete job. Read the function name, then each comment. Copy it, run it, hide it, write it again. That is how the sheet is built.",
    solves: "You get a working slice you can explain in an interview: input, check, change, result. Not a 200-file repo.",
    example: "A cooking class card: one dish, one method. You do not open five cookbooks. You follow this card, then the next.",
    uses: "Every practice row on this page. Same pattern in frontend, API, SQL, and cloud.",
    watch: "Do not skip validation. Do not leave secrets in the snippet. If the lab is client-only, say that the real server must still check."
  }
};

const expandShort = (item) => {
  const k = kindOf(item);
  const p = packs[k] || packs.lab;
  const prior = splitSections(item.a);
  const one = String(
    prior["What this is"] ||
    prior["What it solves"] ||
    String(item.a || "").split("\n").map((l) => l.trim()).filter((l) => l && !HEAD_RE.test(l)).slice(0, 3).join(" ") ||
    item.a ||
    ""
  ).replace(/\s+/g, " ").trim().replace(/\.*$/, ".");
  const walk = walkthrough(item.code);
  const line = firstUsefulLine(item.code);
  const q = item.q.replace(/^Practice:\s*/i, "").replace(/^Project:\s*/i, "");

  const summary = pad(
    [
      `${q}.`,
      one,
      `This is a hands-on lab, not a riddle. You should be able to explain the function out loud, then type it from memory.`,
      `What the code is doing: ${walk}`,
      line ? `A line you can point at: ${line}` : "",
      `In an interview, start with the job in plain words (the first sentences here), then walk the snippet. Do not start with a shop story.`,
      `When you are done: run it, break it with empty input or a wrong id, then fix the check. That is the whole point of a practice row.`
    ].filter(Boolean).join(" "),
    160,
    [p.solves, p.watch, "Name Create/Read/Update/Delete if this is a list, or 401 vs 403 if this is login."]
  );

  return joinSections({
    Summary: summary,
    "The problem before": pad(p.problem + " This lab exists because that failure is what interviews and real apps hit.", 55, [one, p.watch]),
    "What this is": pad(`${one} ${p.what} ${walk}`, 70, [p.solves]),
    "What it solves": pad(p.solves + " After this row you can demo the happy path and one failed path (empty input, wrong password, or missing id).", 55, [one]),
    "Real-life example": pad(p.example + " Map guest → user, counter → this function, back room → the array, file, or database in the snippet.", 55, [q]),
    Uses: pad(p.uses + ` On this sheet, the question is: ${item.q}. Use the same idea in the next lab instead of copying a new pattern.`, 50, [p.solves]),
    "Watch out": pad(p.watch + " Read the comments on the right before you paste. If a line looks clever and has no comment, it is the line that will fail in an interview.", 55, [one])
  });
};

const makeLongSummary = (item, map) => {
  const what = map["What this is"] || map["What happens"] || "";
  const solves = map["What it solves"] || "";
  if (words(what) < 40) return "";
  const watch = map["Watch out"] || "";
  const uses = map["Uses"] || "";
  const walk = walkthrough(item.code);
  const core = [
    `Here is the straight interview answer. Start here. You can skip the shop story until they ask for an example.`,
    sentences(what, 5) || what,
    sentences(solves, 3),
    uses ? `Where it shows up: ${sentences(uses, 2)}` : "",
    watch ? `Trap: ${sentences(watch, 2)}` : "",
    walk,
    `If you only remember three things, remember: the definition above, one line from the snippet, and the trap.`
  ].filter(Boolean).join(" ");
  return pad(core, 180, [
    what,
    solves,
    "Say the definition, then the code, then the mistake. That order is what companies want."
  ]);
};

const rewriteAnswer = (item) => {
  const raw = String(item.a || "").trim();
  const map = splitSections(raw);
  const hasTeach = map["What this is"] || map["The problem before"];
  if (!hasTeach || words(raw) < 80) {
    return expandShort(item);
  }
  const next = { ...map };
  const summary = makeLongSummary(item, map);
  if (!summary) return expandShort(item);
  next.Summary = summary;
  return joinSections(next);
};

const files = fs.readdirSync(DATA).filter((f) => f.startsWith("practice-") && f.endsWith(".js"));
let nShort = 0;
let nLong = 0;

for (const file of files) {
  const full = path.join(DATA, file);
  const ctx = { window: { PREP_DATA: {} } };
  vm.runInNewContext(fs.readFileSync(full, "utf8"), ctx);
  const ids = Object.keys(ctx.window.PREP_DATA);
  if (ids.length !== 1) throw new Error("expected one pack in " + file);
  const id = ids[0];
  const pack = ctx.window.PREP_DATA[id];
  for (const q of pack.questions || []) {
    if (String(q.a || "").startsWith("Summary\n")) continue;
    const before = words(q.a);
    q.a = rewriteAnswer(q);
    if (before < 80) nShort += 1;
    else nLong += 1;
  }
  const out = `window.PREP_DATA = window.PREP_DATA || {};\nwindow.PREP_DATA[${JSON.stringify(id)}] = ${JSON.stringify(pack, null, 2)};\n`;
  fs.writeFileSync(full, out);
  console.log("wrote", file, "questions", (pack.questions || []).length);
}

console.log("expanded labs", nShort, "added summaries to long answers", nLong);
