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
      "a": "The problem before\nThe kirana register sat open. Anyone who walked in could tap Delete and wipe today's tickets. The clerk hid the red button and called that a lock. A guest still hit the back-room URL and cleared the board.\nWhat this is\nAuthentication answers who you are. Login — email plus password — then a token or cookie is the name sticker. Authorization answers what you may do. Admin may delete. A user may only tick their own row. A token proves login. A role check proves permission. The UI can hide a button. The server must still say 403.\nWhat it solves\nGuests bounce at login. Staff who already signed in still cannot wipe the shop if their role is user. You say the pair in one breath: who, then what. Interviewers want both words, not a blob named security. canDelete first asks if there is a user, then if role is admin.\nReal-life example\nSchool library. The card at the door is authentication — you are Ada, not a stranger. The stamp for the rare atlas is authorization — only librarians get it. A student with a valid card still cannot empty the rare shelf. Hiding the button is polite. The librarian still checks the stamp.\nUses\nLogin screens, admin dashboards, and todo apps where only the owner edits. Any React route that looks at a token then a role. Say authentication is who, authorization is what. Practice labs: fake login stores a token; canDelete checks role.\nWatch out\nHiding Delete is not security. Anyone can still POST a delete. The kitchen must check the token and the role. Do not believe role admin from the browser. The shop does not let a customer write manager on their own name tag.",
      "code": "function canDelete(user) {\n  if (!user) return false;  // not logged in — authentication\n  return user.role === \"admin\";  // authorization\n}",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 20,
      "level": "beginner",
      "q": "localStorage vs sessionStorage vs cookies?",
      "a": "The problem before\nThe shop left the login ticket on a sticky note on the counter. Refresh kept it. Closing the tab kept it. Any script on the page could copy it. People also stuffed the ticket in a cookie that rode to the kitchen on every snack order, even the logo image.\nWhat this is\nlocalStorage is a notebook in the browser that stays until you clear it. sessionStorage is scratch paper that dies when that tab closes. Cookies are small notes the browser sends to the server on matching requests. For a login ticket, an httpOnly cookie is safer than localStorage because page JavaScript, and XSS, cannot read it.\nWhat it solves\nYou pick the right shelf. Theme and draft text can live in localStorage. A wizard step can live in sessionStorage so a second tab does not share it. The session id belongs in a cookie the kitchen can read and the page cannot. Interviewers want this split, not one junk drawer for every note.\nReal-life example\nKirana counter. localStorage is the price book left in the drawer overnight. sessionStorage is today's chalk on one slate; you wipe it when that window closes. A cookie is the chit you send with the runner to the back room. An httpOnly chit is sealed; kids at the front desk cannot peek.\nUses\nSave todos and theme in localStorage in the practice lab. Use sessionStorage for a one-tab draft. Set Secure, HttpOnly, SameSite on cookies for login. Contrast the three in interviews: lifetime, who can read, and whether the kitchen sees them.\nWatch out\nlocalStorage is visible to any script on your origin, so XSS steals a JWT there. Cookies go to the server and can surprise you on size and CSRF. sessionStorage is per tab, not per site. Do not store passwords in any of them.",
      "code": "localStorage.setItem(\"theme\", \"dark\");  // stays after refresh\nsessionStorage.setItem(\"draft\", \"hello\");  // gone when the tab closes\ndocument.cookie = \"sid=abc; Secure; HttpOnly; SameSite=Lax\";  // server can read this",
      "ask": "Most asked · Amazon · Google · Meta"
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "What is CORS and why does localhost:5173 fail?",
      "a": "The problem before\nThe cooking class UI sat on localhost:5173. The kitchen API sat on localhost:3000. Fetch looked fine in the code. The browser slammed the door: blocked by CORS. Kids blamed React. The two rooms were different shops to the guard at the street.\nWhat this is\nCORS is the browser rule that stops a page on one origin from reading another origin. Origin is scheme plus host plus port. http://localhost:5173 and http://localhost:3000 are different. The server must send Access-Control-Allow-Origin for that UI, or Vite proxies /api so the browser sees one origin.\nWhat it solves\nYou stop treating a red console line as a broken fetch helper. You fix it where the guard stands: the API headers, or a same-origin proxy. Interviewers want origin named as three parts, and they want the fix on the server, not a Chrome flag.\nReal-life example\nTwo kirana counters on different streets. A runner from shop A asks shop B for the ledger. The street guard says no unless shop B posted a sign: this runner may read. A proxy is a hatch in shop A that walks to shop B out of sight, so the guard sees one shop.\nUses\nLocal Vite plus Express. A React app on app.example.com calling api.example.com. Interviews: why did preflight OPTIONS fire, and why * cannot ride with cookies. Practice lab: call /api/todos and let the proxy reach :3000.\nWatch out\nCORS is a browser lock, not a server lock. curl and Postman will still succeed. Access-Control-Allow-Origin: * with credentials is invalid. Do not disable the browser check to ship. Wrong origin on the allow list is as bad as no list.",
      "code": "app.use(cors({ origin: \"http://localhost:5173\" }));  // server allows this UI\n// or Vite: server.proxy[\"/api\"] = \"http://localhost:3000\"",
      "ask": "Most asked · Amazon · Microsoft · Netflix"
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "Why is JWT in localStorage risky?",
      "a": "The problem before\nThe shop taped the door key to the counter because it was easy to grab on every request. A guest note with a script copied the key and walked the stock room as Ada. Logout on this tab did not matter; the stolen sticker still opened the kitchen.\nWhat this is\nA JWT in localStorage is a ticket any script on your page can read. XSS is that script. An httpOnly cookie cannot be read by JavaScript, so a stolen innerHTML trick cannot photocopy the ticket. If you must use localStorage, lock XSS: textContent not innerHTML, a tight Content-Security-Policy, and a short token life.\nWhat it solves\nYou can name the real risk: not JWT itself, the shelf you left it on. Interviewers want httpOnly plus Secure plus SameSite as the safer default, and XSS hygiene if a lab still stores the token. You stop saying localStorage is fine because it is convenient.\nReal-life example\nSchool bag on the bench. The bus pass is in the open pocket. Anyone who can slip a note into the bag can photocopy the pass. An httpOnly cookie is the pass sewn inside a locked lining only the conductor may open. The lining does not stop a forged hall pass at the kitchen; it stops the photocopy.\nUses\nLogin tickets, refresh tokens, and any Bearer you were about to setItem. Prefer the server Set-Cookie path in production. In the practice lab you may still use localStorage, but say why that is a classroom shortcut.\nWatch out\nXSS plus localStorage is a stolen account. httpOnly does not stop CSRF; you still need SameSite or a CSRF token. A long-lived JWT on disk is a spare key under the mat. Never put the token in a query string either.",
      "code": "// safer: server sets httpOnly cookie\nres.cookie(\"sid\", sid, { httpOnly: true, secure: true, sameSite: \"lax\" });\n// riskier: JS can read this, so XSS can steal it\nlocalStorage.setItem(\"token\", jwt);",
      "ask": "Most asked · Google · Meta · Microsoft"
    },
    {
      "id": 23,
      "level": "intermediate",
      "q": "What is XSS?",
      "a": "The problem before\nA guest wrote a todo titled with a script tag. The clerk pasted that title into the board with innerHTML. The browser ran the guest's recipe as shop code. Tokens and cookies walked out with the next page load. The shop thought it was only showing a name.\nWhat this is\nXSS, cross-site scripting, means attacker text runs as JavaScript in your page. Stored XSS sits in the database and hits every later visitor. Reflected XSS bounces off a query string. DOM XSS never needs the server; your own script writes location.hash into the page. The fix is treat user text as text.\nWhat it solves\nYou stop mixing guest handwriting with kitchen orders. textContent, or a library that escapes HTML, shows <script> as letters, not as a program. Interviewers want the three kinds named and one concrete sink: innerHTML, document.write, or unsanitized markdown.\nReal-life example\nCafeteria suggestion box. A kid writes a note that says, when you read this aloud, open the till. If the monitor reads it as an order, the till opens. If the monitor pins the paper as plain writing, it is only ugly ink. textContent is pinning the paper. innerHTML is reading it aloud to the kitchen.\nUses\nAny todo title, chat message, search box, or profile name you render. React text children escape by default; dangerouslySetInnerHTML does not. Reviews: grep innerHTML and href javascript. Pair with CSP so even a missed sink is harder to fire.\nWatch out\nEscaping once in the database is not enough if you later concat into HTML. href and onclick are sinks too. Markdown and rich text need a real sanitizer. XSS in localStorage is how the JWT theft question starts. Do not disable CSP to make a widget work.",
      "code": "el.textContent = userName;  // safe — shown as text\n// el.innerHTML = userName;  // dangerous if userName has <script>",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 24,
      "level": "beginner",
      "q": "What is event bubbling and delegation?",
      "a": "The problem before\nThe todo list grew. Someone glued a click listener on every row. New rows had no bell. Removed rows left bells hanging. Memory climbed and ticks missed. The shop hired a waiter per cup instead of one person at the counter who can see every tray.\nWhat this is\nA click on a child rises through parents: that rise is bubbling. Capturing is the walk down. Delegation means one listener on a parent handles many children. You ask closest for the row with data-id, then delete that id. The list can grow; the one listener still hears the tap.\nWhat it solves\nYou do not rebind on every render. New todos work the moment they land. You drop listeners when the parent goes away, not per button. Interviewers want bubble versus capture, and why a list is the classic delegation picture. One counter, many cups.\nReal-life example\nSchool lunch line. You do not stand a monitor at every tray. One teacher at the end of the table hears a tap on any tray, looks at the name sticker, and ticks that kid. A new tray joins; the same teacher still hears it. That is delegation. The tap itself still starts on the tray and bubbles up.\nUses\nTodo lists, tables, menus, and any grid React or vanilla will add to. Use data-id on the row. In React you often listen on the list and read dataset. Explain stopPropagation when a child must not wake the parent, like a row click versus a delete button.\nWatch out\nIf you stopPropagation everywhere, delegation never hears the tap. closest must match a real selector or you delete nothing. Delegation is not a new event type; it is where you sit. Capture listeners fire on the way down, before bubble, so order can surprise you.",
      "code": "list.addEventListener(\"click\", function (e) {\n  const btn = e.target.closest(\"[data-id]\");  // which row?\n  if (!btn) return;\n  removeTodo(Number(btn.dataset.id));  // one listener for every row\n});",
      "ask": "Most asked · Amazon · Microsoft · Adobe"
    },
    {
      "id": 25,
      "level": "intermediate",
      "q": "useState vs useRef in React?",
      "a": "The problem before\nThe cooking class put the oven timer id in useState. Every tick repainted the whole kitchen. Or they put the input text in a ref and wondered why the screen still showed yesterday's batter. Two jars, one job each, got swapped on the bench.\nWhat this is\nuseState stores a value and redraws when it changes. useRef stores a value in .current and does not redraw. Use state for text the user should see: the todo title, the spinner flag. Use ref for a timer id, a previous value, or a DOM node you must focus. Same component, two shelves.\nWhat it solves\nYou stop extra paints from values the screen does not show. You stop missing paints when the screen should show the new number. Interviewers want this split, plus that changing ref.current is silent. Focus and setInterval are the usual ref stories.\nReal-life example\nChalkboard versus pocket notebook. The lunch menu on the board is state: change it, the whole class must look again. The oven's timer code in your pocket is a ref: you need the number to cancel later, but rewriting it should not repaint the menu. The input box in the wall is a ref when you only need to call focus.\nUses\nControlled inputs use state. Debounce timers, interval ids, and document.getElementById stand-ins use ref. Store last-search to skip a repeat without a paint. In interviews, say which one triggers render, and why a ref is not a secret second state for visible text.\nWatch out\nReading a ref during render for UI you should have put in state makes the screen stale. Putting a DOM node in state forces extra renders. Do not use ref to dodge a re-render you actually need. Mutation of .current will not wake children. Keep the jobs split.",
      "code": "const [text, setText] = useState(\"\");  // changing this paints again\nconst inputRef = useRef(null);  // no extra paint\ninputRef.current.focus();  // talk to the real input",
      "ask": "Most asked · Meta · Google · Amazon"
    },
    {
      "id": 26,
      "level": "beginner",
      "q": "Why does React need a key on a list?",
      "a": "The problem before\nThe lunch trays had no name stickers, only the spot in line: 0, 1, 2. Someone cut the middle tray. React reused the last tray's ketchup state on the wrong kid. Inputs jumped. Tick boxes stuck to the neighbor. The class blamed React for mixing lunches.\nWhat this is\nkey tells React which list item is which after the list changes. A stable id from the server or Date.now on create is the name sticker. Index as key is the spot in line. When you insert or delete, spots move, so React thinks tray 2 is still tray 2 and keeps the old state.\nWhat it solves\nAdds, deletes, and sorts keep each row's state on the right todo. Inputs do not jump. Interviewers want why index fails, and why key={Math.random()} is worse: every paint is a new kid, so the row remounts and focus dies. Use the todo id.\nReal-life example\nSchool tiffin line. Each box has Ada or Bob on tape. If a kid leaves, the teacher still knows which box is whose. If you only number the boxes 1, 2, 3, then Ada leaves and Bob becomes number 1, the pickle that belonged to Ada stays on Bob's lid. That pickle is component state.\nUses\ntodos.map with key={t.id}. Tables, tabs, and any array you render. In interviews draw insert-at-top with index keys versus ids. When you have no id yet, make one at create time, not at render time.\nWatch out\nIndex is fine only for a static list that never reorders. Random keys remount every time. Duplicate keys warn and mis-associate. Do not use the array index just to silence the warning. The warning is about the ketchup on the wrong tray.",
      "code": "todos.map((t) => <li key={t.id}>{t.text}</li>);  // stable id, not the index",
      "ask": "Most asked · Meta · Amazon · Microsoft"
    },
    {
      "id": 27,
      "level": "intermediate",
      "q": "Debounce vs throttle?",
      "a": "The problem before\nEvery keystroke hit the search kitchen. Five letters meant five trips and a jammed counter. Scroll fired a hundred paints a second. The shop treated every shout as an order. The oven never caught up, and the bill for API calls climbed before lunch.\nWhat this is\nDebounce waits until typing stops, then runs once. The search box is the picture: wait 300ms of quiet, then fetch. Throttle runs at most once per window. Scroll and resize are the picture: one update every 100ms even if events keep arriving. Both cut extra work. They are timers around a function, not new network types.\nWhat it solves\nYou stop melting the kitchen on each key. You still get a result after the kid finishes the word. You still move the sticky header while scrolling, just not sixty times a blink. Interviewers want one example each, and they want you to say which one drops the middle shouts.\nReal-life example\nSchool canteen. Debounce: the cook waits until Ada stops changing her mind, then makes one sandwich. Throttle: the serving window opens once every ten seconds no matter how many trays slam the rail. Both save bread. Mixing them up means either a late sandwich or a pile of half-made ones.\nUses\nSearch-as-you-type, autocomplete, window resize, scroll spy, button spam on save, and resize charts. The practice debounce helper clears the last timeout and sets a new one. In interviews, say leading versus trailing if they ask when the first call fires.\nWatch out\nDebounce can feel laggy if the wait is huge. Throttle can skip the last scroll position unless you flush. Do not debounce a login submit into never-firing. Cancel the timer on unmount or setState hits a dead kitchen. They do not replace rate limits on the server.",
      "code": "function debounce(fn, ms) {\n  let t;\n  return function (...args) {\n    clearTimeout(t);  // cancel the last wait\n    t = setTimeout(function () { fn.apply(null, args); }, ms);  // run after quiet\n  };\n}",
      "ask": "Most asked · Amazon · Uber · Adobe"
    },
    {
      "id": 28,
      "level": "beginner",
      "q": "Promise vs async/await?",
      "a": "The problem before\nThe oven needed time. People nested .then inside .then until the recipe looked like a staircase. Errors vanished into an empty catch at the bottom. Others wrote await in a normal function and the kitchen threw. Two spellings of the same wait got treated as different ovens.\nWhat this is\nA Promise is an oven ticket: pending, then fulfilled or rejected. async/await is sugar on that ticket. await pauses inside an async function until the Promise settles. try/catch around await is .catch. .then is the same wait when you cannot mark the function async. fetch returns a Promise either way.\nWhat it solves\nYou write the load in the order it happens: wait for the server, then read json, then paint. Errors land in one catch. Interviewers want: they are the same idea, await only works in async, and a rejected Promise you forget to catch becomes an unhandled rejection.\nReal-life example\nSchool kitchen timer. The Promise is the bell ticket you hold. .then is taping a note on the ticket: when it rings, frost the cake. await is standing by the oven until it rings, then frosting. Same cake. If you walk away and nobody taped a note, the burnt cake is an unhandled rejection.\nUses\nloadTodos, login, any fetch in the practice lab. Use async function and try/catch for the happy path. Use Promise.all when two trays can bake together. Use .then at the top level of a script if your runtime has no top-level await.\nWatch out\nForgetting await starts the oven and walks on with a pending ticket. async functions always return a Promise, even if you return a number. Mixing then and await in one function hides the order. A failed fetch is not thrown until you check res.ok or the json parse fails.",
      "code": "async function load() {\n  try {\n    const res = await fetch(\"/api/todos\");  // wait for the server\n    return res.json();\n  } catch (err) {\n    console.log(\"network failed\");  // await errors land here\n  }\n}",
      "ask": "Most asked · Amazon · Microsoft · Google"
    },
    {
      "id": 29,
      "level": "beginner",
      "q": "What happens when you type a URL?",
      "a": "The problem before\nSomeone said the page just opens. That hid five desks: find the shop, seal the path, ask for the menu, get the paper, then fetch the pictures. Interviews stall when you skip DNS or treat HTTPS as a padlock sticker with no handshake.\nWhat this is\nYou type a URL. DNS finds the IP, like asking the post office for the shop number. The browser opens a TCP path, then TLS for HTTPS, a handshake that seals the pipe. It sends an HTTP request. The server answers with HTML or JSON. The browser reads that, then asks for CSS, JS, and images, and paints.\nWhat it solves\nYou can walk the trip in order when the page is slow or the padlock is missing. Slow DNS, a failed TLS cert, a 301, or a huge JS file sit at different desks. Interviewers want this sequence, not magic, and they want HTTPS named as TLS around HTTP.\nReal-life example\nFinding the school canteen. First you ask which building: DNS. Then you walk the sealed staff corridor: TLS. You ask the clerk for the menu: the HTTP request. The clerk hands the menu sheet: HTML. You then send kids for the rice photo, the CSS tablecloth, and the JS that ticks the queue, and the room is set.\nUses\nExplain a blank page, a mixed-content block, or why the first byte was late. fetch in the lab is this same trip for JSON. Chrome DevTools Network shows DNS, connect, SSL, wait, download as separate columns — that is this story in numbers.\nWatch out\nSkipping cache, service workers, or a CDN keeps the story honest for a first answer; mention them if asked. HTTP/2 multiplexes many files on one pipe, but the desks are the same. Never send a password on the unsealed street. A cached DNS lie can send you to the wrong shop.",
      "code": "async function openHome() {\n  const res = await fetch(\"https://example.com/\");  // DNS + TLS + HTTP\n  const html = await res.text();  // body of the first response\n  console.log(html.slice(0, 40));\n}",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 30,
      "level": "beginner",
      "q": "Controlled vs uncontrolled input?",
      "a": "The problem before\nThe attendance sheet and the kid's mouth disagreed. React painted Ada. The input still showed Bob because the DOM owned the pencil. Or every keystroke was in state but a ref read an old box. Validation ran on a value nobody could name.\nWhat this is\nControlled: React state is the value, and onChange writes it back. The input is a display of state. Uncontrolled: the DOM holds the value; you read it with a ref when you need it, often on submit. Forms you validate live — empty todo, live character count — should be controlled so the screen and the rule share one jar.\nWhat it solves\nYou know who owns the pencil. Live errors, disable-save, and filtered lists stay in sync with what the user sees. Uncontrolled is fine for a quiet file picker or a form you only read once. Interviewers want one owner, and defaultValue versus value as the tell.\nReal-life example\nSchool roll. Controlled: the teacher holds the sheet; the kid says a name; the teacher writes it; the sheet is truth. Uncontrolled: the kid keeps their own scrap; the teacher copies it at the end of the period. If you must scold a blank name while they type, the teacher must hold the sheet.\nUses\nThe todo title box in the lab is controlled. Search boxes, checkboxes, and radios that drive UI are controlled. Use a ref for focus and for an uncontrolled file input. In interviews, say value plus onChange, or defaultValue plus ref.\nWatch out\nSwitching from uncontrolled to controlled mid-life warns in the console. value without onChange freezes the box. Do not mix both on one input. For a big form, controlled is still the default; libraries just hide the setState. The file input stays uncontrolled in the browser.",
      "code": "function Box() {\n  const [text, setText] = useState(\"\");  // React owns the value\n  return <input value={text} onChange={(e) => setText(e.target.value)} />;\n}",
      "ask": "Most asked · Meta · Amazon"
    },
    {
      "id": 31,
      "level": "intermediate",
      "q": "How do you protect a React route?",
      "a": "The problem before\nAnyone who typed #/admin saw the delete board. The shop hid the door behind a plant and called it security. A guest still called the API and wiped tickets. The React route was a polite sign, not a lock on the kitchen.\nWhat this is\nA private React route checks for a ticket — localStorage token or a /me call — and renders Navigate to /login when it is missing. That is UX: bounce guests from the screen. The API must still return 401 without a ticket and 403 without the role. Guard the kitchen, not only the poster on the door.\nWhat it solves\nLogged-out people see login instead of a broken empty table. Deep links to /todos send guests to the right desk. Interviewers want this split: client guard is courtesy; server check is the lock. The sample Private component reads the token and either paints children or redirects.\nReal-life example\nSchool lab door. A student monitor checks the ID card and sends strangers to the office. That is the React guard. The chemicals still sit in a locked cabinet the monitor cannot open with a handmade badge. That cabinet is the API. Hiding the cabinet drawing on the wall is not a lock.\nUses\nDashboards, settings, admin pages, and any todo screen after fake login in the lab. Pair with an api helper that sends Authorization. After logout, drop the token and send hash to #/login. Use /me if you must know the cookie session is still good.\nWatch out\nA token in localStorage is not proof the server agrees. Users can edit localStorage. Never hide an admin-only API and skip the role check. Redirect loops happen if login itself is wrapped in Private. This is not authorization by itself — that is the role check after you know who.",
      "code": "function Private({ children }) {\n  if (!localStorage.getItem(\"token\")) return <Navigate to=\"/login\" />;  // bounce guests\n  return children;\n}",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 32,
      "level": "beginner",
      "q": "HTTP vs HTTPS?",
      "a": "The problem before\nThe login form posted ada and secret down the street on a postcard. Café Wi-Fi could read the PIN. The page wore a padlock but then loaded the API on http, so the browser blocked the mix or leaked the cookie. People said HTTPS was just a certificate fee.\nWhat this is\nHTTP is the request language: GET, POST, headers, body. HTTPS is that same language inside a TLS sealed pipe. The padlock means the path is encrypted and the shop showed a certificate. Login and cookies must use HTTPS. Mixed content is an HTTPS page calling http:// — the browser blocks the unsealed hop.\nWhat it solves\nA snoop on the street cannot read the password or quietly change the todo list in transit. Users can see the shop is the shop on the cert, not a fake stall. Interviewers want HTTP versus HTTPS as protocol plus encryption, not two different verbs.\nReal-life example\nPostcard versus sealed envelope to the school kitchen. HTTP writes the order on a card anyone in the corridor can read. HTTPS puts the same order in a waxed envelope after the clerk shows a badge. Mixed content is sending the pudding recipe in a sealed envelope, then shouting the sugar amount down the hall.\nUses\nfetch to https:// APIs in the lab. Production login, cookies with Secure, and any token header. Explain HSTS if they ask why the browser upgrades next time. Never paste an API key on an http page.\nWatch out\nA green padlock does not mean the app is safe from XSS or a bad role check. Self-signed certs train people to click through. http://localhost is fine in class; http:// on the public internet is not. Do not mark cookies Secure and then serve the app on HTTP only.",
      "code": "fetch(\"https://api.example.com/login\", { method: \"POST\", body: form });  // encrypted\n// fetch(\"http://api.example.com/login\")  // never for a password",
      "ask": "Most asked · Amazon · Google"
    },
    {
      "id": 33,
      "level": "beginner",
      "q": "What is REST?",
      "a": "The problem before\nThe shop invented a new verb for every tray: /getTodos, /doCreate, /makeDone. Nobody could guess the next path. Status was always 200 with an error in the body. Interviews want a shared menu, not a secret chalkboard of RPC nicknames.\nWhat this is\nREST is a style, not a library. URLs name resources. HTTP verbs say the action. GET /todos reads. POST /todos creates. PATCH /todos/1 updates some fields. PUT replaces. DELETE /todos/1 removes. Status codes tell how it went: 201 created, 204 empty delete, 400 bad input, 401 login, 404 missing.\nWhat it solves\nA new cook can read the menu and guess the next dish. Caching and proxies understand GET. You can teach CRUD with four routes instead of twenty. Interviewers want verbs plus codes, and they want you to say REST is a convention the team keeps, not a magic header.\nReal-life example\nCanteen counter. The dish is /dosa. Asking to see the list is GET. Ordering a new one is POST. Changing the chutney is PATCH. Taking the plate back is DELETE. If the cook says 404, that dosa id is not on the board. If they say 201, a new ticket exists.\nUses\nThe practice todo API and any fetch in the frontend lab. Talk REST when they ask how the UI talks to the server. Map Create Read Update Delete to POST GET PATCH DELETE. Use JSON bodies and location headers if you create.\nWatch out\nREST is not the same as JSON. GraphQL and RPC can also use HTTP. A path like /getTodos is not resource-shaped. Returning 200 for every failure hides the kitchen fire. GET must not create a row. Do not put secrets in the URL.",
      "code": "app.get(\"/todos\", list);  // Read\napp.post(\"/todos\", create);  // Create\napp.patch(\"/todos/:id\", update);  // Update\napp.delete(\"/todos/:id\", remove);  // Delete",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 34,
      "level": "intermediate",
      "q": "What is a closure? (todo counter)",
      "a": "The problem before\nThe lunch punch card forgot the count the moment the clerk walked away. Or every button in a loop printed kid ten because they all pointed at one shared i. People said functions only see what you pass in. Hidden memory looked like a bug or a miracle.\nWhat this is\nA closure is a function that still sees variables from the function that created it, even after that outer function has returned. makeCounter keeps count in a closed-over box. Each next() call adds one to the same box. The inner function is the ticket; the box is the memory that does not go home.\nWhat it solves\nYou can have private state without a class: a counter, a debounce timer id, a once-only flag. Interviewers want this picture, and they want the loop bug: var i shared versus let i per round, each click closing over its own number. The todo counter lab is this story.\nReal-life example\nSchool canteen punch card. The clerk's booth is makeCounter. The hole punch lives in the booth. You take a small function home: next. Each time you stamp lunch, the booth still has yesterday's count. The booth already returned you to the yard, but the punch card memory stayed in the closed room.\nUses\nCallbacks, event listeners, React function components that close over props, partials, and the makeCounter example. Explain why a listener added in useEffect must list the values it closes over, or it sees a stale kitchen.\nWatch out\nClosures keep memory alive; a listener that closes over a huge list can leak if you never remove it. Stale closures in React show old text after a fetch. Do not confuse a closure with a private class field; both hide a box, different doors. var in a for loop is the classic trap.",
      "code": "function makeCounter() {\n  let count = 0;  // closed over\n  return function next() {\n    count += 1;  // still sees count\n    return count;\n  };\n}",
      "ask": "Most asked · Amazon · Google · Microsoft"
    }
  ]
};
