window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["practice-dom"] = {
  "kind": "practice",
  "notes": [
    {
      "title": "JS or React",
      "body": "Before you use this\nUse the JS and React chips above the labs. Same card projects. JS uses createElement and addEventListener. React uses state, JSX, and onClick.\n\nWhy we use it\nJobs ask both. Learn the DOM in JS first so React is not magic. Then rebuild the same card in React.\n\nWhen to pick this\nPick JS to paste into a plain HTML file. Pick React when you already have a React app (or the HTML shell with the React script tags)."
    },
    {
      "title": "How to use these projects",
      "body": "Each lab is a small card app you can paste into an HTML file. Code is on the left. The green text on the right is what that line does. Build them in order: show cards → listen → add/remove → search → modal → save."
    },
    {
      "title": "The HTML you need",
      "body": "A page with <div id=\"grid\"></div> and maybe a <form id=\"add\">. The JS finds those nodes and paints cards into the grid."
    },
    {
      "title": "Cards",
      "body": "A card is a box on the page: title, text, buttons. You do not type 20 cards in HTML. You keep an array, then render the array into the DOM."
    },
    {
      "title": "Events",
      "body": "addEventListener waits for a click, type, or submit. Delegation means one listener on the grid handles every card, even cards you add later."
    },
    {
      "title": "Safe DOM",
      "body": "Use textContent and createElement. Do not put user text into innerHTML — that is XSS. dataset.id stores the card id on the node."
    }
  ],
  "examples": [
    {
      "title": "Show all cards",
      "lang": "js",
      "desc": "Turn a list of objects into card nodes and put them on the page.",
      "code": "const cards = [\n  { id: 1, title: \"Ada\", text: \"Invented the first program\" },\n  { id: 2, title: \"Grace\", text: \"Wrote a compiler\" }\n];\n\nfunction showAll(list) {\n  const grid = document.getElementById(\"grid\");  // the empty box on the page\n  grid.replaceChildren();  // wipe old cards\n  list.forEach((item) => grid.appendChild(makeCard(item)));  // paint each one\n}",
      "codes": {
        "javascript": "const cards = [\n  { id: 1, title: \"Ada\", text: \"Invented the first program\" },\n  { id: 2, title: \"Grace\", text: \"Wrote a compiler\" }\n];\n\nfunction showAll(list) {\n  const grid = document.getElementById(\"grid\");  // the empty box on the page\n  grid.replaceChildren();  // wipe old cards\n  list.forEach((item) => grid.appendChild(makeCard(item)));  // paint each one\n}",
        "react": "function showAll(list) {\n  return (\n    <div id=\"grid\">\n      {list.map((item) => <Card key={item.id} item={item} />)}\n    </div>\n  );\n}"
      }
    },
    {
      "title": "Make one card",
      "lang": "js",
      "desc": "createElement + textContent. No innerHTML of user text.",
      "code": "function makeCard(item) {\n  const card = document.createElement(\"article\");  // the box\n  card.className = \"card\";\n  card.dataset.id = String(item.id);  // remember which row this is\n  const h = document.createElement(\"h3\");\n  h.textContent = item.title;  // safe — shown as text\n  const p = document.createElement(\"p\");\n  p.textContent = item.text;\n  card.append(h, p);\n  return card;\n}",
      "codes": {
        "javascript": "function makeCard(item) {\n  const card = document.createElement(\"article\");  // the box\n  card.className = \"card\";\n  card.dataset.id = String(item.id);  // remember which row this is\n  const h = document.createElement(\"h3\");\n  h.textContent = item.title;  // safe — shown as text\n  const p = document.createElement(\"p\");\n  p.textContent = item.text;\n  card.append(h, p);\n  return card;\n}",
        "react": "function Card({ item }) {\n  return (\n    <article className=\"card\" data-id={item.id}>\n      <h3>{item.title}</h3>\n      <p>{item.text}</p>\n    </article>\n  );\n}"
      }
    },
    {
      "title": "One listener for every card",
      "lang": "js",
      "desc": "Delegation on the grid. New cards still work.",
      "code": "grid.addEventListener(\"click\", function (e) {\n  const card = e.target.closest(\".card\");  // which card was clicked?\n  if (!card) return;\n  console.log(\"clicked\", card.dataset.id);\n});",
      "codes": {
        "javascript": "grid.addEventListener(\"click\", function (e) {\n  const card = e.target.closest(\".card\");  // which card was clicked?\n  if (!card) return;\n  console.log(\"clicked\", card.dataset.id);\n});",
        "react": "function Grid({ children, onPick }) {\n  return (\n    <div id=\"grid\" onClick={(e) => {\n      const card = e.target.closest(\".card\");\n      if (!card) return;\n      onPick(card.dataset.id);\n    }}>\n      {children}\n    </div>\n  );\n}"
      }
    },
    {
      "title": "Add a card from a form",
      "lang": "js",
      "desc": "preventDefault so the page does not reload.",
      "code": "form.addEventListener(\"submit\", function (e) {\n  e.preventDefault();  // stay on this page\n  const title = form.title.value.trim();\n  if (!title) return;\n  cards.push({ id: Date.now(), title, text: form.text.value.trim() });  // Create\n  showAll(cards);  // paint again\n  form.reset();\n});",
      "codes": {
        "javascript": "form.addEventListener(\"submit\", function (e) {\n  e.preventDefault();  // stay on this page\n  const title = form.title.value.trim();\n  if (!title) return;\n  cards.push({ id: Date.now(), title, text: form.text.value.trim() });  // Create\n  showAll(cards);  // paint again\n  form.reset();\n});",
        "react": "function AddForm({ onAdd }) {\n  function onSubmit(e) {\n    e.preventDefault();\n    const title = e.target.title.value.trim();\n    if (!title) return;\n    onAdd({ id: Date.now(), title, text: e.target.text.value.trim() });\n    e.target.reset();\n  }\n  return (\n    <form id=\"add\" onSubmit={onSubmit}>\n      <input name=\"title\" placeholder=\"Title\" />\n      <input name=\"text\" placeholder=\"Text\" />\n      <button type=\"submit\">Add card</button>\n    </form>\n  );\n}"
      }
    },
    {
      "title": "Delete with a button inside the card",
      "lang": "js",
      "desc": "closest finds the card even if you click the icon inside the button.",
      "code": "grid.addEventListener(\"click\", function (e) {\n  const btn = e.target.closest(\"[data-delete]\");\n  if (!btn) return;\n  const id = Number(btn.closest(\".card\").dataset.id);\n  cards = cards.filter((c) => c.id !== id);  // Delete\n  showAll(cards);\n});",
      "codes": {
        "javascript": "grid.addEventListener(\"click\", function (e) {\n  const btn = e.target.closest(\"[data-delete]\");\n  if (!btn) return;\n  const id = Number(btn.closest(\".card\").dataset.id);\n  cards = cards.filter((c) => c.id !== id);  // Delete\n  showAll(cards);\n});",
        "react": "function Card({ item, onDelete }) {\n  return (\n    <article className=\"card\">\n      <button type=\"button\" onClick={() => onDelete(item.id)}>Delete</button>\n    </article>\n  );\n}"
      }
    },
    {
      "title": "The HTML shell",
      "lang": "html",
      "desc": "Put this in index.html, then paste a lab.",
      "code": "<!-- <div id=\"grid\" class=\"grid\"></div>\n<form id=\"add\">\n  <input name=\"title\" placeholder=\"Title\" />\n  <input name=\"text\" placeholder=\"Text\" />\n  <button type=\"submit\">Add card</button>\n</form> -->",
      "codes": {
        "html": "<!-- <div id=\"grid\" class=\"grid\"></div>\n<form id=\"add\">\n  <input name=\"title\" placeholder=\"Title\" />\n  <input name=\"text\" placeholder=\"Text\" />\n  <button type=\"submit\">Add card</button>\n</form> -->",
        "javascript": "<!-- <div id=\"grid\" class=\"grid\"></div>\n<form id=\"add\">\n  <input name=\"title\" placeholder=\"Title\" />\n  <input name=\"text\" placeholder=\"Text\" />\n  <button type=\"submit\">Add card</button>\n</form> -->",
        "react": "<!-- index.html — mount React here, then paste a lab -->\n<div id=\"root\"></div>\n<script src=\"https://unpkg.com/react@18/umd/react.development.js\"></script>\n<script src=\"https://unpkg.com/react-dom@18/umd/react-dom.development.js\"></script>\n<script src=\"https://unpkg.com/@babel/standalone/babel.min.js\"></script>"
      }
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "Project: show all cards from an array",
      "a": "Keep cards in an array. For each item, make a node and append it to #grid. That is Read — the list becomes the page.",
      "code": "const cards = [\n  { id: 1, title: \"Todo app\", text: \"Add and tick tasks\" },\n  { id: 2, title: \"Weather\", text: \"Fetch a city\" }\n];\n\nfunction showAll(list) {\n  const grid = document.getElementById(\"grid\");\n  grid.replaceChildren();  // clear last paint\n  list.forEach((item) => {\n    grid.appendChild(makeCard(item));  // one card per object\n  });\n}\n\nshowAll(cards);",
      "codes": {
        "javascript": "const cards = [\n  { id: 1, title: \"Todo app\", text: \"Add and tick tasks\" },\n  { id: 2, title: \"Weather\", text: \"Fetch a city\" }\n];\n\nfunction showAll(list) {\n  const grid = document.getElementById(\"grid\");\n  grid.replaceChildren();  // clear last paint\n  list.forEach((item) => {\n    grid.appendChild(makeCard(item));  // one card per object\n  });\n}\n\nshowAll(cards);",
        "react": "function CardGrid() {\n  const [cards] = React.useState([\n    { id: 1, title: \"Todo app\", text: \"Add and tick tasks\" },\n    { id: 2, title: \"Weather\", text: \"Fetch a city\" }\n  ]);  // the list lives in React state\n\n  return (\n    <div id=\"grid\">\n      {cards.map((item) => (  // one card per object\n        <article key={item.id} className=\"card\">\n          <h3>{item.title}</h3>\n          <p>{item.text}</p>\n        </article>\n      ))}\n    </div>\n  );\n}"
      }
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "Project: build a card with createElement",
      "a": "createElement makes a node. className styles it. textContent is safe. dataset.id stores the id so later clicks know which card it is.",
      "code": "function makeCard(item) {\n  const card = document.createElement(\"article\");\n  card.className = \"card\";\n  card.dataset.id = String(item.id);\n  const title = document.createElement(\"h3\");\n  title.textContent = item.title;  // never innerHTML for user text\n  const body = document.createElement(\"p\");\n  body.textContent = item.text;\n  card.append(title, body);\n  return card;\n}",
      "codes": {
        "javascript": "function makeCard(item) {\n  const card = document.createElement(\"article\");\n  card.className = \"card\";\n  card.dataset.id = String(item.id);\n  const title = document.createElement(\"h3\");\n  title.textContent = item.title;  // never innerHTML for user text\n  const body = document.createElement(\"p\");\n  body.textContent = item.text;\n  card.append(title, body);\n  return card;\n}",
        "react": "function Card({ item }) {\n  return (\n    <article className=\"card\" data-id={item.id}>  // remember which row\n      <h3>{item.title}</h3>  // JSX text is safe like textContent\n      <p>{item.text}</p>\n    </article>\n  );\n}"
      }
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "Project: add a click listener on one card",
      "a": "addEventListener(\"click\", fn) runs fn when that node is clicked. Use it for a single demo card. For many cards, prefer delegation (next lab).",
      "code": "const first = document.querySelector(\".card\");\nfirst.addEventListener(\"click\", function () {\n  first.classList.toggle(\"is-open\");  // flip a CSS class\n  console.log(\"opened\", first.dataset.id);\n});",
      "codes": {
        "javascript": "const first = document.querySelector(\".card\");\nfirst.addEventListener(\"click\", function () {\n  first.classList.toggle(\"is-open\");  // flip a CSS class\n  console.log(\"opened\", first.dataset.id);\n});",
        "react": "function DemoCard({ item }) {\n  const [open, setOpen] = React.useState(false);  // click flips this\n\n  return (\n    <article\n      className={open ? \"card is-open\" : \"card\"}\n      onClick={() => setOpen(!open)}  // React listener, not addEventListener\n    >\n      <h3>{item.title}</h3>\n    </article>\n  );\n}"
      }
    },
    {
      "id": 4,
      "level": "intermediate",
      "q": "Project: event delegation on the card grid",
      "a": "One listener on #grid. closest(\".card\") finds the card even if the click was on the title inside it. Cards you add later still fire this listener. You do not need 50 listeners.",
      "code": "const grid = document.getElementById(\"grid\");\ngrid.addEventListener(\"click\", function (e) {\n  const card = e.target.closest(\".card\");  // walk up to the card\n  if (!card || !grid.contains(card)) return;  // clicked empty gap\n  console.log(\"card\", card.dataset.id);\n});",
      "codes": {
        "javascript": "const grid = document.getElementById(\"grid\");\ngrid.addEventListener(\"click\", function (e) {\n  const card = e.target.closest(\".card\");  // walk up to the card\n  if (!card || !grid.contains(card)) return;  // clicked empty gap\n  console.log(\"card\", card.dataset.id);\n});",
        "react": "function Grid({ cards, onPick }) {\n  return (\n    <div id=\"grid\" onClick={(e) => {  // one listener on the parent\n      const card = e.target.closest(\".card\");\n      if (!card) return;  // clicked empty gap\n      onPick(Number(card.dataset.id));\n    }}>\n      {cards.map((item) => (\n        <article key={item.id} className=\"card\" data-id={item.id}>\n          <h3>{item.title}</h3>\n        </article>\n      ))}\n    </div>\n  );\n}"
      }
    },
    {
      "id": 5,
      "level": "beginner",
      "q": "Project: delete a card",
      "a": "A Delete button with data-delete. On click, read the card id, filter it out of the array, then showAll again. The DOM matches the array.",
      "code": "grid.addEventListener(\"click\", function (e) {\n  const btn = e.target.closest(\"[data-delete]\");\n  if (!btn) return;\n  const id = Number(btn.closest(\".card\").dataset.id);\n  cards = cards.filter((c) => c.id !== id);  // Delete in data\n  showAll(cards);  // Delete on the page\n});\n\nfunction makeCard(item) {\n  const card = document.createElement(\"article\");\n  card.className = \"card\";\n  card.dataset.id = String(item.id);\n  const btn = document.createElement(\"button\");\n  btn.type = \"button\";\n  btn.dataset.delete = \"1\";  // mark as the delete control\n  btn.textContent = \"Delete\";\n  card.append(btn);\n  return card;\n}",
      "codes": {
        "javascript": "grid.addEventListener(\"click\", function (e) {\n  const btn = e.target.closest(\"[data-delete]\");\n  if (!btn) return;\n  const id = Number(btn.closest(\".card\").dataset.id);\n  cards = cards.filter((c) => c.id !== id);  // Delete in data\n  showAll(cards);  // Delete on the page\n});\n\nfunction makeCard(item) {\n  const card = document.createElement(\"article\");\n  card.className = \"card\";\n  card.dataset.id = String(item.id);\n  const btn = document.createElement(\"button\");\n  btn.type = \"button\";\n  btn.dataset.delete = \"1\";  // mark as the delete control\n  btn.textContent = \"Delete\";\n  card.append(btn);\n  return card;\n}",
        "react": "function Grid({ cards, setCards }) {\n  function remove(id) {\n    setCards((list) => list.filter((c) => c.id !== id));  // Delete in state\n  }\n\n  return (\n    <div id=\"grid\">\n      {cards.map((item) => (\n        <article key={item.id} className=\"card\">\n          <button type=\"button\" onClick={() => remove(item.id)}>Delete</button>\n        </article>\n      ))}\n    </div>\n  );\n}"
      }
    },
    {
      "id": 6,
      "level": "beginner",
      "q": "Project: like / unlike a card",
      "a": "Toggle a liked flag on the object, then re-render or toggle a class. The heart is a button so keyboard users can hit it too.",
      "code": "grid.addEventListener(\"click\", function (e) {\n  const btn = e.target.closest(\"[data-like]\");\n  if (!btn) return;\n  const id = Number(btn.closest(\".card\").dataset.id);\n  cards = cards.map((c) => c.id === id ? { ...c, liked: !c.liked } : c);  // Update\n  showAll(cards);\n});\n\nfunction makeCard(item) {\n  const card = document.createElement(\"article\");\n  card.dataset.id = String(item.id);\n  const like = document.createElement(\"button\");\n  like.type = \"button\";\n  like.dataset.like = \"1\";\n  like.textContent = item.liked ? \"Liked\" : \"Like\";\n  like.setAttribute(\"aria-pressed\", item.liked ? \"true\" : \"false\");\n  card.append(like);\n  return card;\n}",
      "codes": {
        "javascript": "grid.addEventListener(\"click\", function (e) {\n  const btn = e.target.closest(\"[data-like]\");\n  if (!btn) return;\n  const id = Number(btn.closest(\".card\").dataset.id);\n  cards = cards.map((c) => c.id === id ? { ...c, liked: !c.liked } : c);  // Update\n  showAll(cards);\n});\n\nfunction makeCard(item) {\n  const card = document.createElement(\"article\");\n  card.dataset.id = String(item.id);\n  const like = document.createElement(\"button\");\n  like.type = \"button\";\n  like.dataset.like = \"1\";\n  like.textContent = item.liked ? \"Liked\" : \"Like\";\n  like.setAttribute(\"aria-pressed\", item.liked ? \"true\" : \"false\");\n  card.append(like);\n  return card;\n}",
        "react": "function Grid({ cards, setCards }) {\n  function toggle(id) {\n    setCards((list) => list.map((c) => c.id === id ? { ...c, liked: !c.liked } : c));  // Update\n  }\n\n  return (\n    <div id=\"grid\">\n      {cards.map((item) => (\n        <article key={item.id} className=\"card\">\n          <button\n            type=\"button\"\n            aria-pressed={item.liked ? \"true\" : \"false\"}\n            onClick={() => toggle(item.id)}\n          >\n            {item.liked ? \"Liked\" : \"Like\"}\n          </button>\n        </article>\n      ))}\n    </div>\n  );\n}"
      }
    },
    {
      "id": 7,
      "level": "intermediate",
      "q": "Project: form that adds a new card",
      "a": "submit + preventDefault. Read input values, push a new object, showAll, reset the form. Empty title does not create a card.",
      "code": "const form = document.getElementById(\"add\");\nform.addEventListener(\"submit\", function (e) {\n  e.preventDefault();  // do not reload\n  const title = form.title.value.trim();\n  const text = form.text.value.trim();\n  if (!title) return;  // validation\n  cards.push({ id: Date.now(), title, text, liked: false });  // Create\n  showAll(cards);\n  form.reset();\n  form.title.focus();\n});",
      "codes": {
        "javascript": "const form = document.getElementById(\"add\");\nform.addEventListener(\"submit\", function (e) {\n  e.preventDefault();  // do not reload\n  const title = form.title.value.trim();\n  const text = form.text.value.trim();\n  if (!title) return;  // validation\n  cards.push({ id: Date.now(), title, text, liked: false });  // Create\n  showAll(cards);\n  form.reset();\n  form.title.focus();\n});",
        "react": "function AddForm({ cards, setCards }) {\n  const [title, setTitle] = React.useState(\"\");\n  const [text, setText] = React.useState(\"\");\n\n  function onSubmit(e) {\n    e.preventDefault();  // do not reload\n    if (!title.trim()) return;  // validation\n    setCards([...cards, { id: Date.now(), title: title.trim(), text: text.trim(), liked: false }]);  // Create\n    setTitle(\"\");\n    setText(\"\");\n  }\n\n  return (\n    <form id=\"add\" onSubmit={onSubmit}>\n      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder=\"Title\" />\n      <input value={text} onChange={(e) => setText(e.target.value)} placeholder=\"Text\" />\n      <button type=\"submit\">Add card</button>\n    </form>\n  );\n}"
      }
    },
    {
      "id": 8,
      "level": "intermediate",
      "q": "Project: search / filter the cards",
      "a": "An input listener. Filter the array by title, then showAll the match. The full list stays in cards. You only change what you paint.",
      "code": "const search = document.getElementById(\"search\");\nsearch.addEventListener(\"input\", function () {\n  const q = search.value.trim().toLowerCase();\n  const shown = cards.filter((c) => c.title.toLowerCase().includes(q));  // Read + filter\n  showAll(shown);\n});",
      "codes": {
        "javascript": "const search = document.getElementById(\"search\");\nsearch.addEventListener(\"input\", function () {\n  const q = search.value.trim().toLowerCase();\n  const shown = cards.filter((c) => c.title.toLowerCase().includes(q));  // Read + filter\n  showAll(shown);\n});",
        "react": "function Search({ cards, setShown }) {\n  function onType(e) {\n    const q = e.target.value.trim().toLowerCase();\n    setShown(cards.filter((c) => c.title.toLowerCase().includes(q)));  // Read + filter\n  }\n\n  return <input id=\"search\" onChange={onType} placeholder=\"Search cards\" />;\n}"
      }
    },
    {
      "id": 9,
      "level": "intermediate",
      "q": "Project: edit a card title",
      "a": "An Edit button turns the title into an input. Save writes back to the array and re-renders. Escape cancels.",
      "code": "grid.addEventListener(\"click\", function (e) {\n  const btn = e.target.closest(\"[data-edit]\");\n  if (!btn) return;\n  const card = btn.closest(\".card\");\n  const id = Number(card.dataset.id);\n  const next = prompt(\"New title\", card.querySelector(\"h3\").textContent);\n  if (!next || !next.trim()) return;\n  cards = cards.map((c) => c.id === id ? { ...c, title: next.trim() } : c);  // Update\n  showAll(cards);\n});",
      "codes": {
        "javascript": "grid.addEventListener(\"click\", function (e) {\n  const btn = e.target.closest(\"[data-edit]\");\n  if (!btn) return;\n  const card = btn.closest(\".card\");\n  const id = Number(card.dataset.id);\n  const next = prompt(\"New title\", card.querySelector(\"h3\").textContent);\n  if (!next || !next.trim()) return;\n  cards = cards.map((c) => c.id === id ? { ...c, title: next.trim() } : c);  // Update\n  showAll(cards);\n});",
        "react": "function Grid({ cards, setCards }) {\n  function rename(id, oldTitle) {\n    const next = prompt(\"New title\", oldTitle);\n    if (!next || !next.trim()) return;\n    setCards((list) => list.map((c) => c.id === id ? { ...c, title: next.trim() } : c));  // Update\n  }\n\n  return (\n    <div id=\"grid\">\n      {cards.map((item) => (\n        <article key={item.id} className=\"card\">\n          <h3>{item.title}</h3>\n          <button type=\"button\" onClick={() => rename(item.id, item.title)}>Edit</button>\n        </article>\n      ))}\n    </div>\n  );\n}"
      }
    },
    {
      "id": 10,
      "level": "intermediate",
      "q": "Project: open a modal when you click a card",
      "a": "Click the card body (not Delete) → fill a dialog and showModal(). Store the id so Close knows which card you were viewing.",
      "code": "const dialog = document.getElementById(\"modal\");\ngrid.addEventListener(\"click\", function (e) {\n  if (e.target.closest(\"button\")) return;  // let Delete / Like handle themselves\n  const card = e.target.closest(\".card\");\n  if (!card) return;\n  const item = cards.find((c) => c.id === Number(card.dataset.id));\n  dialog.querySelector(\"h2\").textContent = item.title;\n  dialog.querySelector(\"p\").textContent = item.text;\n  dialog.showModal();  // native modal\n});\ndialog.querySelector(\"[data-close]\").addEventListener(\"click\", function () {\n  dialog.close();\n});",
      "codes": {
        "javascript": "const dialog = document.getElementById(\"modal\");\ngrid.addEventListener(\"click\", function (e) {\n  if (e.target.closest(\"button\")) return;  // let Delete / Like handle themselves\n  const card = e.target.closest(\".card\");\n  if (!card) return;\n  const item = cards.find((c) => c.id === Number(card.dataset.id));\n  dialog.querySelector(\"h2\").textContent = item.title;\n  dialog.querySelector(\"p\").textContent = item.text;\n  dialog.showModal();  // native modal\n});\ndialog.querySelector(\"[data-close]\").addEventListener(\"click\", function () {\n  dialog.close();\n});",
        "react": "function App({ cards }) {\n  const [open, setOpen] = React.useState(null);  // which card, or null\n  const item = cards.find((c) => c.id === open);\n\n  return (\n    <>\n      <div id=\"grid\">\n        {cards.map((c) => (\n          <article key={c.id} className=\"card\" onClick={() => setOpen(c.id)}>\n            <h3>{c.title}</h3>\n          </article>\n        ))}\n      </div>\n      {item && (\n        <dialog open>\n          <h2>{item.title}</h2>\n          <p>{item.text}</p>\n          <button type=\"button\" onClick={() => setOpen(null)}>Close</button>\n        </dialog>\n      )}\n    </>\n  );\n}"
      }
    },
    {
      "id": 11,
      "level": "beginner",
      "q": "Project: close modal on Escape and backdrop",
      "a": "A <dialog> already closes on Escape. For a custom overlay, listen to keydown and to clicks on the dimmed backdrop.",
      "code": "document.addEventListener(\"keydown\", function (e) {\n  if (e.key === \"Escape\") dialog.close();  // keyboard\n});\ndialog.addEventListener(\"click\", function (e) {\n  if (e.target === dialog) dialog.close();  // click the dark backdrop\n});",
      "codes": {
        "javascript": "document.addEventListener(\"keydown\", function (e) {\n  if (e.key === \"Escape\") dialog.close();  // keyboard\n});\ndialog.addEventListener(\"click\", function (e) {\n  if (e.target === dialog) dialog.close();  // click the dark backdrop\n});",
        "react": "function Modal({ open, onClose, title, text }) {\n  React.useEffect(() => {\n    function onKey(e) {\n      if (e.key === \"Escape\") onClose();  // keyboard\n    }\n    document.addEventListener(\"keydown\", onKey);\n    return () => document.removeEventListener(\"keydown\", onKey);\n  }, [onClose]);\n\n  if (!open) return null;\n  return (\n    <div className=\"backdrop\" onClick={onClose}>  // click the dark backdrop\n      <div className=\"modal\" onClick={(e) => e.stopPropagation()}>\n        <h2>{title}</h2>\n        <p>{text}</p>\n      </div>\n    </div>\n  );\n}"
      }
    },
    {
      "id": 12,
      "level": "intermediate",
      "q": "Project: save cards in localStorage",
      "a": "After every Create/Update/Delete, stringify the array. On load, parse and showAll. Keys are strings.",
      "code": "function save() {\n  localStorage.setItem(\"cards\", JSON.stringify(cards));  // persist\n}\nfunction load() {\n  cards = JSON.parse(localStorage.getItem(\"cards\") || \"[]\");\n  showAll(cards);\n}\nform.addEventListener(\"submit\", function (e) {\n  e.preventDefault();\n  cards.push({ id: Date.now(), title: form.title.value.trim(), text: \"\" });\n  save();\n  showAll(cards);\n});\nload();",
      "codes": {
        "javascript": "function save() {\n  localStorage.setItem(\"cards\", JSON.stringify(cards));  // persist\n}\nfunction load() {\n  cards = JSON.parse(localStorage.getItem(\"cards\") || \"[]\");\n  showAll(cards);\n}\nform.addEventListener(\"submit\", function (e) {\n  e.preventDefault();\n  cards.push({ id: Date.now(), title: form.title.value.trim(), text: \"\" });\n  save();\n  showAll(cards);\n});\nload();",
        "react": "function useCards() {\n  const [cards, setCards] = React.useState(() =>\n    JSON.parse(localStorage.getItem(\"cards\") || \"[]\")  // load once\n  );\n\n  React.useEffect(() => {\n    localStorage.setItem(\"cards\", JSON.stringify(cards));  // persist\n  }, [cards]);\n\n  return [cards, setCards];\n}"
      }
    },
    {
      "id": 13,
      "level": "beginner",
      "q": "Project: empty state when there are no cards",
      "a": "If the list is empty, show a message instead of a blank grid. After the first add, the message goes away because showAll paints cards.",
      "code": "function showAll(list) {\n  const grid = document.getElementById(\"grid\");\n  grid.replaceChildren();\n  if (!list.length) {\n    const empty = document.createElement(\"p\");\n    empty.className = \"empty\";\n    empty.textContent = \"No cards yet. Add one.\";\n    grid.appendChild(empty);\n    return;\n  }\n  list.forEach((item) => grid.appendChild(makeCard(item)));\n}",
      "codes": {
        "javascript": "function showAll(list) {\n  const grid = document.getElementById(\"grid\");\n  grid.replaceChildren();\n  if (!list.length) {\n    const empty = document.createElement(\"p\");\n    empty.className = \"empty\";\n    empty.textContent = \"No cards yet. Add one.\";\n    grid.appendChild(empty);\n    return;\n  }\n  list.forEach((item) => grid.appendChild(makeCard(item)));\n}",
        "react": "function Grid({ cards }) {\n  if (!cards.length) {\n    return <p className=\"empty\">No cards yet. Add one.</p>;\n  }\n  return (\n    <div id=\"grid\">\n      {cards.map((item) => (\n        <article key={item.id} className=\"card\">\n          <h3>{item.title}</h3>\n        </article>\n      ))}\n    </div>\n  );\n}"
      }
    },
    {
      "id": 14,
      "level": "intermediate",
      "q": "Project: stop a like click from opening the modal",
      "a": "The like button sits inside the card. Without stopPropagation, the card listener also runs. Stop the bubble, or check closest(\"button\") in the card handler (cleaner).",
      "code": "grid.addEventListener(\"click\", function (e) {\n  if (e.target.closest(\"button\")) return;  // button has its own job\n  const card = e.target.closest(\".card\");\n  if (card) openModal(Number(card.dataset.id));\n});\n\n// or inside the like handler:\nlike.addEventListener(\"click\", function (e) {\n  e.stopPropagation();  // do not tell the card\n  toggleLike(item.id);\n});",
      "codes": {
        "javascript": "grid.addEventListener(\"click\", function (e) {\n  if (e.target.closest(\"button\")) return;  // button has its own job\n  const card = e.target.closest(\".card\");\n  if (card) openModal(Number(card.dataset.id));\n});\n\n// or inside the like handler:\nlike.addEventListener(\"click\", function (e) {\n  e.stopPropagation();  // do not tell the card\n  toggleLike(item.id);\n});",
        "react": "function Grid({ cards, onOpen, onLike }) {\n  return (\n    <div id=\"grid\">\n      {cards.map((item) => (\n        <article key={item.id} className=\"card\" onClick={() => onOpen(item.id)}>\n          <button\n            type=\"button\"\n            onClick={(e) => {\n              e.stopPropagation();  // do not tell the card\n              onLike(item.id);\n            }}\n          >\n            Like\n          </button>\n        </article>\n      ))}\n    </div>\n  );\n}"
      }
    },
    {
      "id": 15,
      "level": "beginner",
      "q": "Project: highlight a card on mouseenter",
      "a": "mouseenter / mouseleave toggle a class. Prefer CSS :hover when you only need a color. Use JS when you also update a status line.",
      "code": "grid.addEventListener(\"mouseover\", function (e) {\n  const card = e.target.closest(\".card\");\n  if (!card) return;\n  card.classList.add(\"is-hot\");  // CSS can paint a border\n});\ngrid.addEventListener(\"mouseout\", function (e) {\n  const card = e.target.closest(\".card\");\n  if (!card) return;\n  card.classList.remove(\"is-hot\");\n});",
      "codes": {
        "javascript": "grid.addEventListener(\"mouseover\", function (e) {\n  const card = e.target.closest(\".card\");\n  if (!card) return;\n  card.classList.add(\"is-hot\");  // CSS can paint a border\n});\ngrid.addEventListener(\"mouseout\", function (e) {\n  const card = e.target.closest(\".card\");\n  if (!card) return;\n  card.classList.remove(\"is-hot\");\n});",
        "react": "function Card({ item }) {\n  const [hot, setHot] = React.useState(false);\n\n  return (\n    <article\n      className={hot ? \"card is-hot\" : \"card\"}\n      onMouseEnter={() => setHot(true)}\n      onMouseLeave={() => setHot(false)}\n    >\n      <h3>{item.title}</h3>\n    </article>\n  );\n}"
      }
    },
    {
      "id": 16,
      "level": "intermediate",
      "q": "Project: keyboard — focus and Enter on a card",
      "a": "Make the card focusable with tabindex=\"0\". Enter or Space opens it. That is a DOM + a11y project, not only a click project.",
      "code": "function makeCard(item) {\n  const card = document.createElement(\"article\");\n  card.className = \"card\";\n  card.dataset.id = String(item.id);\n  card.tabIndex = 0;  // can Tab to this card\n  card.addEventListener(\"keydown\", function (e) {\n    if (e.key === \"Enter\" || e.key === \" \") {\n      e.preventDefault();  // Space would scroll\n      openModal(item.id);\n    }\n  });\n  return card;\n}",
      "codes": {
        "javascript": "function makeCard(item) {\n  const card = document.createElement(\"article\");\n  card.className = \"card\";\n  card.dataset.id = String(item.id);\n  card.tabIndex = 0;  // can Tab to this card\n  card.addEventListener(\"keydown\", function (e) {\n    if (e.key === \"Enter\" || e.key === \" \") {\n      e.preventDefault();  // Space would scroll\n      openModal(item.id);\n    }\n  });\n  return card;\n}",
        "react": "function Card({ item, onOpen }) {\n  function onKey(e) {\n    if (e.key === \"Enter\" || e.key === \" \") {\n      e.preventDefault();  // Space would scroll\n      onOpen(item.id);\n    }\n  }\n\n  return (\n    <article className=\"card\" tabIndex={0} onKeyDown={onKey}>\n      <h3>{item.title}</h3>\n    </article>\n  );\n}"
      }
    },
    {
      "id": 17,
      "level": "advanced",
      "q": "Project: lazy-load card images",
      "a": "IntersectionObserver watches when a card enters the viewport, then sets img.src. That is a DOM API, not a click, and it keeps the first paint light.",
      "code": "const io = new IntersectionObserver((entries) => {\n  entries.forEach((entry) => {\n    if (!entry.isIntersecting) return;\n    const img = entry.target;\n    img.src = img.dataset.src;  // real URL only now\n    io.unobserve(img);\n  });\n});\ndocument.querySelectorAll(\"img[data-src]\").forEach((img) => io.observe(img));",
      "codes": {
        "javascript": "const io = new IntersectionObserver((entries) => {\n  entries.forEach((entry) => {\n    if (!entry.isIntersecting) return;\n    const img = entry.target;\n    img.src = img.dataset.src;  // real URL only now\n    io.unobserve(img);\n  });\n});\ndocument.querySelectorAll(\"img[data-src]\").forEach((img) => io.observe(img));",
        "react": "function LazyImg({ src, alt }) {\n  const ref = React.useRef(null);\n  const [show, setShow] = React.useState(false);\n\n  React.useEffect(() => {\n    const io = new IntersectionObserver(([entry]) => {\n      if (!entry.isIntersecting) return;\n      setShow(true);  // real URL only now\n      io.disconnect();\n    });\n    if (ref.current) io.observe(ref.current);\n    return () => io.disconnect();\n  }, []);\n\n  return <img ref={ref} src={show ? src : undefined} alt={alt} />;\n}"
      }
    },
    {
      "id": 18,
      "level": "intermediate",
      "q": "Project: sort cards by title",
      "a": "A select or button sorts the array, then showAll. The DOM order follows the array order because you append in that order.",
      "code": "function sortByTitle() {\n  cards = cards.slice().sort((a, b) => a.title.localeCompare(b.title));\n  showAll(cards);  // paint in the new order\n}\ndocument.getElementById(\"sort\").addEventListener(\"click\", sortByTitle);",
      "codes": {
        "javascript": "function sortByTitle() {\n  cards = cards.slice().sort((a, b) => a.title.localeCompare(b.title));\n  showAll(cards);  // paint in the new order\n}\ndocument.getElementById(\"sort\").addEventListener(\"click\", sortByTitle);",
        "react": "function SortBar({ cards, setCards }) {\n  function sortByTitle() {\n    setCards((list) => list.slice().sort((a, b) => a.title.localeCompare(b.title)));\n  }\n\n  return <button type=\"button\" id=\"sort\" onClick={sortByTitle}>Sort A–Z</button>;\n}"
      }
    },
    {
      "id": 19,
      "level": "beginner",
      "q": "Why not put the whole card in innerHTML?",
      "a": "innerHTML parses HTML. If title is <img onerror=...> you just ran attacker JS (XSS). textContent and createElement treat it as letters. Template strings are fine for your own fixed markup, not for user strings.",
      "code": "title.textContent = item.title;  // safe\n// card.innerHTML = \"<h3>\" + item.title + \"</h3>\";  // XSS if title is dirty",
      "codes": {
        "javascript": "title.textContent = item.title;  // safe\n// card.innerHTML = \"<h3>\" + item.title + \"</h3>\";  // XSS if title is dirty",
        "react": "function Card({ item }) {\n  return (\n    <article className=\"card\">\n      <h3>{item.title}</h3>  // safe — children are text\n      {/* do not do: <h3 dangerouslySetInnerHTML={{ __html: item.title }} /> */}\n    </article>\n  );\n}"
      }
    },
    {
      "id": 20,
      "level": "intermediate",
      "q": "querySelector vs querySelectorAll on cards?",
      "a": "querySelector returns the first match. querySelectorAll returns every match (a static NodeList). You forEach the list to bind or to read. getElementById is for one unique id like grid.",
      "code": "const grid = document.getElementById(\"grid\");  // one box\nconst first = grid.querySelector(\".card\");  // first card only\nconst all = grid.querySelectorAll(\".card\");  // every card right now\nall.forEach((card) => card.classList.remove(\"is-open\"));",
      "codes": {
        "javascript": "const grid = document.getElementById(\"grid\");  // one box\nconst first = grid.querySelector(\".card\");  // first card only\nconst all = grid.querySelectorAll(\".card\");  // every card right now\nall.forEach((card) => card.classList.remove(\"is-open\"));",
        "react": "function Grid({ cards }) {\n  const gridRef = React.useRef(null);\n\n  function closeAll() {\n    const all = gridRef.current.querySelectorAll(\".card\");  // every painted card\n    all.forEach((card) => card.classList.remove(\"is-open\"));\n  }\n\n  return (\n    <div id=\"grid\" ref={gridRef}>\n      {cards.map((item) => (\n        <article key={item.id} className=\"card\">{item.title}</article>\n      ))}\n      <button type=\"button\" onClick={closeAll}>Close all</button>\n    </div>\n  );\n}"
      }
    },
    {
      "id": 21,
      "level": "beginner",
      "q": "What does preventDefault do on the add-card form?",
      "a": "A form submit reloads the page by default and wipes your JS state. preventDefault stops that so you can push to the array and paint. Use type=\"button\" on Like/Delete so they do not submit the form.",
      "code": "form.addEventListener(\"submit\", function (e) {\n  e.preventDefault();  // keep the page\n  cards.push({ id: Date.now(), title: form.title.value.trim() });\n  showAll(cards);\n});",
      "codes": {
        "javascript": "form.addEventListener(\"submit\", function (e) {\n  e.preventDefault();  // keep the page\n  cards.push({ id: Date.now(), title: form.title.value.trim() });\n  showAll(cards);\n});",
        "react": "function AddForm({ onAdd }) {\n  function onSubmit(e) {\n    e.preventDefault();  // keep the page\n    const title = e.target.title.value.trim();\n    if (!title) return;\n    onAdd({ id: Date.now(), title });\n    e.target.reset();\n  }\n\n  return (\n    <form onSubmit={onSubmit}>\n      <input name=\"title\" />\n      <button type=\"submit\">Add</button>\n    </form>\n  );\n}"
      }
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "What does stopPropagation do on a card?",
      "a": "A click on a child bubbles to the card, then the grid, then document. stopPropagation cuts that trip. Prefer checking closest(\"button\") so you do not hide bugs. Use stop when a third-party listener on the parent must not run.",
      "code": "card.addEventListener(\"click\", function () { openModal(); });\nlike.addEventListener(\"click\", function (e) {\n  e.stopPropagation();  // card listener will not run\n  toggleLike();\n});",
      "codes": {
        "javascript": "card.addEventListener(\"click\", function () { openModal(); });\nlike.addEventListener(\"click\", function (e) {\n  e.stopPropagation();  // card listener will not run\n  toggleLike();\n});",
        "react": "function Card({ onOpen, onLike }) {\n  return (\n    <article className=\"card\" onClick={onOpen}>\n      <button\n        type=\"button\"\n        onClick={(e) => {\n          e.stopPropagation();  // card listener will not run\n          onLike();\n        }}\n      >\n        Like\n      </button>\n    </article>\n  );\n}"
      }
    },
    {
      "id": 23,
      "level": "beginner",
      "q": "Project: count how many cards are on the page",
      "a": "After showAll, querySelectorAll(\".card\").length is the painted count. cards.length is the data count. They should match unless you are filtering.",
      "code": "function showAll(list) {\n  grid.replaceChildren();\n  list.forEach((item) => grid.appendChild(makeCard(item)));\n  document.getElementById(\"count\").textContent = list.length + \" cards\";\n}",
      "codes": {
        "javascript": "function showAll(list) {\n  grid.replaceChildren();\n  list.forEach((item) => grid.appendChild(makeCard(item)));\n  document.getElementById(\"count\").textContent = list.length + \" cards\";\n}",
        "react": "function Grid({ cards }) {\n  return (\n    <div>\n      <p id=\"count\">{cards.length} cards</p>\n      <div id=\"grid\">\n        {cards.map((item) => (\n          <article key={item.id} className=\"card\">{item.title}</article>\n        ))}\n      </div>\n    </div>\n  );\n}"
      }
    },
    {
      "id": 24,
      "level": "advanced",
      "q": "Project: drag a card to reorder",
      "a": "draggable=\"true\", dragstart stores the id, drop reads the target id, splice the array, showAll. The DOM follows the array again.",
      "code": "grid.addEventListener(\"dragstart\", function (e) {\n  const card = e.target.closest(\".card\");\n  e.dataTransfer.setData(\"text/plain\", card.dataset.id);  // which card\n});\ngrid.addEventListener(\"dragover\", function (e) { e.preventDefault(); });\ngrid.addEventListener(\"drop\", function (e) {\n  e.preventDefault();\n  const from = Number(e.dataTransfer.getData(\"text/plain\"));\n  const to = Number(e.target.closest(\".card\").dataset.id);\n  const a = cards.findIndex((c) => c.id === from);\n  const b = cards.findIndex((c) => c.id === to);\n  const [moved] = cards.splice(a, 1);\n  cards.splice(b, 0, moved);  // new order\n  showAll(cards);\n});",
      "codes": {
        "javascript": "grid.addEventListener(\"dragstart\", function (e) {\n  const card = e.target.closest(\".card\");\n  e.dataTransfer.setData(\"text/plain\", card.dataset.id);  // which card\n});\ngrid.addEventListener(\"dragover\", function (e) { e.preventDefault(); });\ngrid.addEventListener(\"drop\", function (e) {\n  e.preventDefault();\n  const from = Number(e.dataTransfer.getData(\"text/plain\"));\n  const to = Number(e.target.closest(\".card\").dataset.id);\n  const a = cards.findIndex((c) => c.id === from);\n  const b = cards.findIndex((c) => c.id === to);\n  const [moved] = cards.splice(a, 1);\n  cards.splice(b, 0, moved);  // new order\n  showAll(cards);\n});",
        "react": "function Grid({ cards, setCards }) {\n  const [from, setFrom] = React.useState(null);\n\n  function onDrop(toId) {\n    setCards((list) => {\n      const next = list.slice();\n      const a = next.findIndex((c) => c.id === from);\n      const b = next.findIndex((c) => c.id === toId);\n      const [moved] = next.splice(a, 1);\n      next.splice(b, 0, moved);  // new order\n      return next;\n    });\n  }\n\n  return (\n    <div id=\"grid\">\n      {cards.map((item) => (\n        <article\n          key={item.id}\n          className=\"card\"\n          draggable\n          onDragStart={() => setFrom(item.id)}\n          onDragOver={(e) => e.preventDefault()}\n          onDrop={() => onDrop(item.id)}\n        >\n          {item.title}\n        </article>\n      ))}\n    </div>\n  );\n}"
      }
    }
  ]
};
