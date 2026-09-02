window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["practice-frontend"] = {
  "kind": "practice",
  "notes": [
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
    }
  ]
};
