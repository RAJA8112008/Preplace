const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..");

function load(file) {
  const ctx = { window: { PREP_DATA: {} } };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), ctx);
  return ctx.window.PREP_DATA;
}

function dump(id, notes, questions) {
  const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  const qjs = questions.map((q) => {
    return `    { id: ${q.id}, level: ${JSON.stringify(q.level)}, q: ${JSON.stringify(q.q)}, a: \`${esc(q.a)}\`, code: \`${esc(q.code)}\` }`;
  }).join(",\n");
  const njs = notes.map((n) => `    { title: ${JSON.stringify(n.title)}, body: ${JSON.stringify(n.body)} }`).join(",\n");
  return `window.PREP_DATA = window.PREP_DATA || {};\nwindow.PREP_DATA.${id} = {\n  notes: [\n${njs}\n  ],\n  questions: [\n${qjs}\n  ]\n};\n`;
}

function expand(id, makeCode, extraWhy) {
  const data = load("data/" + id + ".js")[id];
  const questions = data.questions.map((q) => {
    if (q.code && String(q.a).includes("In easy words")) return q;
    const a = `This question asks: ${q.q}

In easy words:
${q.a}

Why it matters:
${extraWhy}

If you can explain this to a friend in your own words, you understand it.`;
    return { ...q, a, code: makeCode(q) };
  });
  fs.writeFileSync(path.join(root, "data", id + ".js"), dump(id, data.notes, questions));
  console.log("wrote", id, questions.length);
}

expand("fullstack", (q) => {
  const t = q.q.toLowerCase();
  if (t.includes("http") || t.includes("api") || t.includes("json") || t.includes("fetch")) {
    return `// browser talks to server, not to the database
async function loadNotes() {
  const res = await fetch("/api/notes"); // ask the server
  const notes = await res.json();        // read the answer
  console.log(notes);
}`;
  }
  if (t.includes("auth") || t.includes("login") || t.includes("jwt") || t.includes("password") || t.includes("cookie") || t.includes("oauth") || t.includes("session")) {
    return `// login idea (easy picture)
// 1) user sends email + password
// 2) server checks
// 3) server gives a badge (session or token)
// 4) next requests show the badge
function isLoggedIn(req) {
  return Boolean(req.user); // set only after a real check
}`;
  }
  if (t.includes("sql") || t.includes("database") || t.includes("migrat") || t.includes("table")) {
    return `// one table the app can use
// users: id | email | password_hash
function publicUser(row) {
  return { id: row.id, email: row.email }; // never send the hash
}`;
  }
  return `// one request through the whole app
// React screen  ->  fetch("/api/...")  ->  Express  ->  database
// React screen  <-  JSON answer        <-  Express  <-  rows
const API = "/api";
const res = await fetch(API + "/health");
console.log(res.ok); // true means the server answered`;
}, "Full stack means the screen, the server, and the database must agree. A bug in any layer looks like 'the app is broken'.");

expand("kubernetes", (q) => {
  const t = q.q.toLowerCase();
  if (t.includes("service") || t.includes("ingress") || t.includes("dns") || t.includes("endpoint") || t.includes("browser")) {
    return `# a stable name in front of changing pods
kind: Service
metadata: { name: api }
spec:
  selector: { app: api }   # find pods with this sticker
  ports: [{ port: 80 }]    # friends call api:80`;
  }
  if (t.includes("probe") || t.includes("health") || t.includes("ready") || t.includes("live")) {
    return `# two different health ideas
livenessProbe:
  httpGet: { path: /health, port: 3000 }   # restart if dead
readinessProbe:
  httpGet: { path: /ready, port: 3000 }    # stop traffic if not ready`;
  }
  if (t.includes("secret") || t.includes("config")) {
    return `# settings vs secrets (same shape, different care)
# ConfigMap: MESSAGE: hello
# Secret:    PASSWORD: change-me
# the app reads them as environment values`;
  }
  return `# one running copy of your app
kind: Deployment
metadata: { name: api }
spec:
  replicas: 2                 # keep 2 copies
  selector:
    matchLabels: { app: api }
  template:
    metadata:
      labels: { app: api }    # sticker the Service looks for
    spec:
      containers:
        - name: api
          image: my-app:1.0`;
}, "Kubernetes keeps many copies of your app alive. If you only memorize names, a broken pod will confuse you. The YAML shows the idea.");

console.log("done");
