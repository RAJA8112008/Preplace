window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["practice-frontend"] = {
  "kind": "practice",
  "notes": [
    {
      "title": "Most asked",
      "body": "After the hands-on labs, open questions tagged Most asked. Those are the interview questions Amazon, Google, Meta, and Microsoft repeat. Same easy comments on the right of the code."
    },
    {
      "title": "How to use this lab",
      "body": "Each problem is a small complete function. Code is on the left. The green text on the right is the easy meaning of that same line. Copy it, run it, then hide it and write it again."
    },
    {
      "title": "Todo + CRUD",
      "body": "Create is add. Read is show. Update is edit or tick. Delete is remove. Start in an array. Then save to localStorage."
    },
    {
      "title": "Auth",
      "body": "Authentication is login — who you are. Authorization is the role check — what you may do. Hiding a button is not real security."
    },
    {
      "title": "HTTPS",
      "body": "https:// encrypts the request. Never put API keys in frontend code. Never post a password to http://."
    },
    {
      "title": "Build order",
      "body": "Array todo → localStorage → form check → fake login → hide admin actions → fetch HTTPS."
    }
  ],
  "examples": [
    {
      "title": "Todo CRUD in one file",
      "lang": "js",
      "desc": "Four named functions. One job each. Refresh still wipes the array until you add localStorage.",
      "code": "let todos = [];  // the list lives in memory\n\nfunction createTodo(text) {\n  const title = String(text || \"\").trim();  // drop extra spaces\n  if (!title) return null;  // empty text is not a task\n  const item = { id: Date.now(), text: title, done: false };  // one task object\n  todos.push(item);  // Create — add to the list\n  return item;\n}\n\nfunction readTodos() {\n  return todos.slice();  // Read — a copy so callers cannot break the list\n}\n\nfunction updateTodo(id, changes) {\n  todos = todos.map((t) => t.id === id ? { ...t, ...changes } : t);  // Update — only the matching id\n}\n\nfunction deleteTodo(id) {\n  todos = todos.filter((t) => t.id !== id);  // Delete — drop that id\n}"
    },
    {
      "title": "Save and load",
      "lang": "js",
      "desc": "localStorage keeps text after refresh.",
      "code": "function saveTodos(list) {\n  localStorage.setItem(\"todos\", JSON.stringify(list));  // save as text\n}\n\nfunction loadTodos() {\n  const raw = localStorage.getItem(\"todos\") || \"[]\";  // missing key means empty list\n  return JSON.parse(raw);  // text back into objects\n}"
    },
    {
      "title": "Fake login",
      "lang": "js",
      "desc": "Authentication on the client for practice. A real app calls POST /login.",
      "code": "function login(email, password) {\n  const ok = email === \"ada@test.com\" && password === \"secret\";  // check both fields\n  if (!ok) return false;  // wrong email or password\n  localStorage.setItem(\"token\", \"ada-ok\");  // remember login\n  return true;\n}\n\nfunction logout() {\n  localStorage.removeItem(\"token\");  // forget login\n}"
    },
    {
      "title": "Hide admin delete",
      "lang": "js",
      "desc": "Authorization on the screen only. The server must still check.",
      "code": "function canDelete(role) {\n  return role === \"admin\";  // only admin may delete\n}\n\nfunction renderDelete(role) {\n  if (!canDelete(role)) return \"\";  // user does not see the button\n  return \"<button>Delete</button>\";  // admin sees it\n}"
    },
    {
      "title": "Fetch on HTTPS",
      "lang": "js",
      "desc": "The browser asks a public API on the encrypted path.",
      "code": "async function loadOneTodo() {\n  const res = await fetch(\"https://jsonplaceholder.typicode.com/todos/1\");  // HTTPS request\n  if (!res.ok) throw new Error(\"load failed\");  // 404 or 500\n  const todo = await res.json();  // body → object\n  return todo.title;\n}"
    },
    {
      "title": "Protected page",
      "lang": "js",
      "desc": "No token means guest — send them to login.",
      "code": "function canOpenApp() {\n  return Boolean(localStorage.getItem(\"token\"));  // logged in?\n}\n\nfunction guard() {\n  if (!canOpenApp()) location.hash = \"#/login\";  // bounce guests\n}"
    },
    {
      "title": "Call the API with a token",
      "lang": "js",
      "desc": "Every request after login carries Authorization.",
      "code": "function api(url, opts) {\n  const token = localStorage.getItem(\"token\");  // ticket from login\n  return fetch(url, {\n    ...opts,\n    headers: {\n      \"Content-Type\": \"application/json\",\n      Authorization: \"Bearer \" + token,  // send the ticket\n      ...(opts && opts.headers)\n    }\n  });\n}"
    },
    {
      "title": "Form check",
      "lang": "js",
      "desc": "Do not save an empty title.",
      "code": "function addFromForm(title) {\n  const text = String(title || \"\").trim();  // drop spaces\n  if (!text) return \"type a task\";  // show this under the input\n  todos.push({ id: Date.now(), text, done: false });  // Create\n  return \"ok\";\n}"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "Practice: add a todo",
      "a": "Create a task object and push it. That is Create.",
      "code": "function addTodo(text) {\n  const title = String(text || \"\").trim();  // drop extra spaces\n  if (!title) return null;  // empty text is not a task\n  const item = { id: Date.now(), text: title, done: false };  // id, text, not done yet\n  todos.push(item);  // Create — add to the list\n  return item;\n}"
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "Practice: show all todos",
      "a": "Read the array and print each text.",
      "code": "function showTodos(list) {\n  list.forEach((t) => {\n    console.log(t.text);  // Read — one line per task\n  });\n}"
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "Practice: mark a todo done",
      "a": "Map the list. Flip done on that id.",
      "code": "function markDone(id) {\n  todos = todos.map((t) => {\n    if (t.id !== id) return t;  // not this one — keep it\n    return { ...t, done: true };  // Update — tick it\n  });\n}"
    },
    {
      "id": 4,
      "level": "beginner",
      "q": "Practice: delete a todo",
      "a": "Filter out the id.",
      "code": "function removeTodo(id) {\n  todos = todos.filter((t) => t.id !== id);  // Delete — drop this id\n}"
    },
    {
      "id": 5,
      "level": "beginner",
      "q": "Practice: keep todos after refresh",
      "a": "JSON.stringify into localStorage. Parse on load.",
      "code": "function saveTodos(list) {\n  localStorage.setItem(\"todos\", JSON.stringify(list));  // save as text\n}\n\nfunction loadTodos() {\n  const raw = localStorage.getItem(\"todos\") || \"[]\";  // empty if first visit\n  return JSON.parse(raw);  // text back into objects\n}"
    },
    {
      "id": 6,
      "level": "beginner",
      "q": "Practice: reject an empty todo",
      "a": "trim first. If nothing left, do not push.",
      "code": "function addSafe(text) {\n  const title = String(text || \"\").trim();  // drop spaces\n  if (!title) return \"type a task\";  // validation failed\n  todos.push({ id: Date.now(), text: title, done: false });  // Create\n  return \"ok\";\n}"
    },
    {
      "id": 7,
      "level": "intermediate",
      "q": "Practice: fake email/password login",
      "a": "If both match, save a token. Else return false.",
      "code": "function login(email, password) {\n  const ok = email === \"ada@test.com\" && password === \"secret\";  // authentication\n  if (!ok) return false;  // wrong pair\n  localStorage.setItem(\"token\", \"ada-ok\");  // remember login\n  return true;\n}"
    },
    {
      "id": 8,
      "level": "intermediate",
      "q": "Practice: log out",
      "a": "Remove the token and send the user to login.",
      "code": "function logout() {\n  localStorage.removeItem(\"token\");  // forget login\n  location.hash = \"#/login\";  // go to the login screen\n}"
    },
    {
      "id": 9,
      "level": "intermediate",
      "q": "Practice: only admin can delete",
      "a": "Check role before you change the list.",
      "code": "function removeIfAdmin(id, role) {\n  if (role !== \"admin\") return \"not allowed\";  // authorization\n  todos = todos.filter((t) => t.id !== id);  // Delete\n  return \"ok\";\n}"
    },
    {
      "id": 10,
      "level": "intermediate",
      "q": "Practice: fetch todos from HTTPS",
      "a": "await fetch, then json. Handle a failed status.",
      "code": "async function loadTodos() {\n  const res = await fetch(\"https://jsonplaceholder.typicode.com/todos?_limit=5\");  // HTTPS\n  if (!res.ok) throw new Error(\"load failed\");  // 404 or 500\n  return res.json();  // body → list\n}"
    },
    {
      "id": 11,
      "level": "intermediate",
      "q": "Practice: POST a todo to an API",
      "a": "JSON body + Bearer token. Always HTTPS in production.",
      "code": "async function createOnServer(text, token) {\n  const res = await fetch(\"https://api.example.com/todos\", {\n    method: \"POST\",  // Create on the server\n    headers: {\n      \"Content-Type\": \"application/json\",\n      Authorization: \"Bearer \" + token  // login ticket\n    },\n    body: JSON.stringify({ text })  // the new task\n  });\n  if (!res.ok) throw new Error(\"create failed\");\n  return res.json();\n}"
    },
    {
      "id": 12,
      "level": "beginner",
      "q": "Practice: filter incomplete todos",
      "a": "Keep only done === false.",
      "code": "function openTodos(list) {\n  return list.filter((t) => !t.done);  // still to do\n}"
    },
    {
      "id": 13,
      "level": "intermediate",
      "q": "Practice: edit todo text",
      "a": "Map and replace text for that id.",
      "code": "function renameTodo(id, text) {\n  const title = String(text || \"\").trim();  // drop spaces\n  if (!title) return;  // do not save empty\n  todos = todos.map((t) => t.id === id ? { ...t, text: title } : t);  // Update\n}"
    },
    {
      "id": 14,
      "level": "advanced",
      "q": "Practice: optimistic add",
      "a": "Push locally first. If POST fails, remove it.",
      "code": "async function addOptimistic(text) {\n  const temp = { id: Date.now(), text, done: false };  // show it now\n  todos.push(temp);  // Create on the screen\n  try {\n    await api(\"/todos\", { method: \"POST\", body: JSON.stringify(temp) });  // then tell the server\n  } catch (err) {\n    todos = todos.filter((t) => t.id !== temp.id);  // undo if the server said no\n  }\n}"
    },
    {
      "id": 15,
      "level": "beginner",
      "q": "Why HTTPS on the login form?",
      "a": "Passwords must not travel as plain HTTP.",
      "code": "function sendLogin(form) {\n  return fetch(\"https://api.example.com/login\", {\n    method: \"POST\",  // HTTPS — the padlock path\n    body: form\n  });\n}"
    },
    {
      "id": 16,
      "level": "intermediate",
      "q": "Practice: attach a token on every request",
      "a": "A helper that adds Authorization.",
      "code": "function api(url, opts) {\n  const token = localStorage.getItem(\"token\");  // ticket from login\n  return fetch(url, {\n    ...(opts || {}),\n    headers: {\n      Authorization: \"Bearer \" + token,  // send it every time\n      ...((opts && opts.headers) || {})\n    }\n  });\n}"
    },
    {
      "id": 17,
      "level": "beginner",
      "q": "Practice: show a loading state",
      "a": "True before fetch, false after.",
      "code": "async function loadWithSpinner() {\n  let loading = true;  // show the spinner\n  try {\n    return await loadTodos();  // wait for the list\n  } finally {\n    loading = false;  // hide the spinner\n  }\n}"
    },
    {
      "id": 18,
      "level": "intermediate",
      "q": "Practice: CORS from the UI side",
      "a": "Call same-origin /api and let Vite proxy it.",
      "code": "async function loadViaProxy() {\n  const res = await fetch(\"/api/todos\");  // same origin — Vite sends this to :3000\n  if (!res.ok) throw new Error(\"load failed\");\n  return res.json();\n}"
    },
    {
      "id": 19,
      "level": "beginner",
      "q": "What is authentication vs authorization?",
      "a": "Authentication answers who you are (login). Authorization answers what you may do (admin can delete, user cannot). A token proves login. A role check proves permission. The UI can hide a button. The server must still say 403.",
      "code": "function canDelete(user) {\n  if (!user) return false;  // not logged in — authentication\n  return user.role === \"admin\";  // authorization\n}",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 20,
      "level": "beginner",
      "q": "localStorage vs sessionStorage vs cookies?",
      "a": "localStorage stays until you clear it. sessionStorage dies when the tab closes. Cookies go to the server on each request. For a login ticket, an httpOnly cookie is safer than localStorage because JS (and XSS) cannot read it.",
      "code": "localStorage.setItem(\"theme\", \"dark\");  // stays after refresh\nsessionStorage.setItem(\"draft\", \"hello\");  // gone when the tab closes\ndocument.cookie = \"sid=abc; Secure; HttpOnly; SameSite=Lax\";  // server can read this",
      "ask": "Most asked · Amazon · Google · Meta"
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "What is CORS and why does localhost:5173 fail?",
      "a": "The browser blocks a page on one origin from reading another origin. Origin is scheme + host + port. :5173 and :3000 are different. Fix it on the server (Allow-Origin) or proxy /api in Vite so the browser sees one origin.",
      "code": "app.use(cors({ origin: \"http://localhost:5173\" }));  // server allows this UI\n// or Vite: server.proxy[\"/api\"] = \"http://localhost:3000\"",
      "ask": "Most asked · Amazon · Microsoft · Netflix"
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "Why is JWT in localStorage risky?",
      "a": "Any XSS script can read localStorage and steal the token. An httpOnly cookie cannot be read by JS. If you must use localStorage, lock down XSS: no innerHTML of user text, Content-Security-Policy, short token life.",
      "code": "// safer: server sets httpOnly cookie\nres.cookie(\"sid\", sid, { httpOnly: true, secure: true, sameSite: \"lax\" });\n// riskier: JS can read this, so XSS can steal it\nlocalStorage.setItem(\"token\", jwt);",
      "ask": "Most asked · Google · Meta · Microsoft"
    },
    {
      "id": 23,
      "level": "intermediate",
      "q": "What is XSS?",
      "a": "Cross-site scripting means attacker text runs as JS in your page. If you put user input into innerHTML, they can steal cookies or tokens. Use textContent, or a library that escapes HTML.",
      "code": "el.textContent = userName;  // safe — shown as text\n// el.innerHTML = userName;  // dangerous if userName has <script>",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 24,
      "level": "beginner",
      "q": "What is event bubbling and delegation?",
      "a": "A click on a child rises to the parent (bubble). Delegation means one listener on the parent handles many children. Useful for a todo list that grows.",
      "code": "list.addEventListener(\"click\", function (e) {\n  const btn = e.target.closest(\"[data-id]\");  // which row?\n  if (!btn) return;\n  removeTodo(Number(btn.dataset.id));  // one listener for every row\n});",
      "ask": "Most asked · Amazon · Microsoft · Adobe"
    },
    {
      "id": 25,
      "level": "intermediate",
      "q": "useState vs useRef in React?",
      "a": "useState stores a value and redraws the screen when it changes. useRef stores a value and does not redraw. Use state for text the user should see. Use ref for a timer id or a DOM node.",
      "code": "const [text, setText] = useState(\"\");  // changing this paints again\nconst inputRef = useRef(null);  // no extra paint\ninputRef.current.focus();  // talk to the real input",
      "ask": "Most asked · Meta · Google · Amazon"
    },
    {
      "id": 26,
      "level": "beginner",
      "q": "Why does React need a key on a list?",
      "a": "key tells React which item is which after the list changes. Using the index breaks when you insert or delete. Use a stable id.",
      "code": "todos.map((t) => <li key={t.id}>{t.text}</li>);  // stable id, not the index",
      "ask": "Most asked · Meta · Amazon · Microsoft"
    },
    {
      "id": 27,
      "level": "intermediate",
      "q": "Debounce vs throttle?",
      "a": "Debounce waits until typing stops, then runs once (search box). Throttle runs at most once per window (scroll). Both cut extra work.",
      "code": "function debounce(fn, ms) {\n  let t;\n  return function (...args) {\n    clearTimeout(t);  // cancel the last wait\n    t = setTimeout(function () { fn.apply(null, args); }, ms);  // run after quiet\n  };\n}",
      "ask": "Most asked · Amazon · Uber · Adobe"
    },
    {
      "id": 28,
      "level": "beginner",
      "q": "Promise vs async/await?",
      "a": "They are the same idea. await pauses inside an async function until the Promise settles. Use try/catch with await. Use .then when you cannot use await.",
      "code": "async function load() {\n  try {\n    const res = await fetch(\"/api/todos\");  // wait for the server\n    return res.json();\n  } catch (err) {\n    console.log(\"network failed\");  // await errors land here\n  }\n}",
      "ask": "Most asked · Amazon · Microsoft · Google"
    },
    {
      "id": 29,
      "level": "beginner",
      "q": "What happens when you type a URL?",
      "a": "DNS finds the IP. TLS (HTTPS) encrypts the pipe. The browser sends an HTTP request. The server answers with HTML or JSON. The browser then asks for CSS, JS, and images, and paints the page.",
      "code": "async function openHome() {\n  const res = await fetch(\"https://example.com/\");  // DNS + TLS + HTTP\n  const html = await res.text();  // body of the first response\n  console.log(html.slice(0, 40));\n}",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 30,
      "level": "beginner",
      "q": "Controlled vs uncontrolled input?",
      "a": "Controlled: React state is the value, onChange updates it. Uncontrolled: the DOM holds the value, you read it with a ref. Forms you validate live should be controlled.",
      "code": "function Box() {\n  const [text, setText] = useState(\"\");  // React owns the value\n  return <input value={text} onChange={(e) => setText(e.target.value)} />;\n}",
      "ask": "Most asked · Meta · Amazon"
    },
    {
      "id": 31,
      "level": "intermediate",
      "q": "How do you protect a React route?",
      "a": "If there is no token (or /me fails), render Navigate to /login. This is only UX. The API must still return 401 without a ticket.",
      "code": "function Private({ children }) {\n  if (!localStorage.getItem(\"token\")) return <Navigate to=\"/login\" />;  // bounce guests\n  return children;\n}",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 32,
      "level": "beginner",
      "q": "HTTP vs HTTPS?",
      "a": "HTTPS is HTTP plus TLS encryption. The padlock means the path is encrypted. Login and cookies must use HTTPS. Mixed content is an HTTPS page calling http:// — the browser blocks it.",
      "code": "fetch(\"https://api.example.com/login\", { method: \"POST\", body: form });  // encrypted\n// fetch(\"http://api.example.com/login\")  // never for a password",
      "ask": "Most asked · Amazon · Google"
    },
    {
      "id": 33,
      "level": "beginner",
      "q": "What is REST?",
      "a": "REST is a style: URLs name resources, HTTP verbs say the action. GET /todos reads. POST /todos creates. PATCH /todos/1 updates. DELETE /todos/1 removes. Status codes tell how it went.",
      "code": "app.get(\"/todos\", list);  // Read\napp.post(\"/todos\", create);  // Create\napp.patch(\"/todos/:id\", update);  // Update\napp.delete(\"/todos/:id\", remove);  // Delete",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 34,
      "level": "intermediate",
      "q": "What is a closure? (todo counter)",
      "a": "A closure is a function that still sees variables from the function that created it. The inner function keeps count even after makeCounter has returned.",
      "code": "function makeCounter() {\n  let count = 0;  // closed over\n  return function next() {\n    count += 1;  // still sees count\n    return count;\n  };\n}",
      "ask": "Most asked · Amazon · Google · Microsoft"
    }
  ]
};
