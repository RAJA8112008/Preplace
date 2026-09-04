const fs = require("fs");
const path = require("path");

const Q = (id, level, q, a, code, ask) => ({ id, level, q, a, code, ...(ask ? { ask } : {}) });
const N = (title, body) => ({ title, body });
const E = (title, desc, code, lang = "js") => ({ title, lang, desc, code });

const data = {
  kind: "practice",
  notes: [
    N("How to use these projects", "Each lab is a small card app you can paste into an HTML file. Code is on the left. The green text on the right is what that line does. Build them in order: show cards → listen → add/remove → search → modal → save."),
    N("The HTML you need", "A page with <div id=\"grid\"></div> and maybe a <form id=\"add\">. The JS finds those nodes and paints cards into the grid."),
    N("Cards", "A card is a box on the page: title, text, buttons. You do not type 20 cards in HTML. You keep an array, then render the array into the DOM."),
    N("Events", "addEventListener waits for a click, type, or submit. Delegation means one listener on the grid handles every card, even cards you add later."),
    N("Safe DOM", "Use textContent and createElement. Do not put user text into innerHTML — that is XSS. dataset.id stores the card id on the node.")
  ],
  examples: [
    E("Show all cards", "Turn a list of objects into card nodes and put them on the page.", `const cards = [
  { id: 1, title: "Ada", text: "Invented the first program" },
  { id: 2, title: "Grace", text: "Wrote a compiler" }
];

function showAll(list) {
  const grid = document.getElementById("grid");  // the empty box on the page
  grid.replaceChildren();  // wipe old cards
  list.forEach((item) => grid.appendChild(makeCard(item)));  // paint each one
}`),
    E("Make one card", "createElement + textContent. No innerHTML of user text.", `function makeCard(item) {
  const card = document.createElement("article");  // the box
  card.className = "card";
  card.dataset.id = String(item.id);  // remember which row this is
  const h = document.createElement("h3");
  h.textContent = item.title;  // safe — shown as text
  const p = document.createElement("p");
  p.textContent = item.text;
  card.append(h, p);
  return card;
}`),
    E("One listener for every card", "Delegation on the grid. New cards still work.", `grid.addEventListener("click", function (e) {
  const card = e.target.closest(".card");  // which card was clicked?
  if (!card) return;
  console.log("clicked", card.dataset.id);
});`),
    E("Add a card from a form", "preventDefault so the page does not reload.", `form.addEventListener("submit", function (e) {
  e.preventDefault();  // stay on this page
  const title = form.title.value.trim();
  if (!title) return;
  cards.push({ id: Date.now(), title, text: form.text.value.trim() });  // Create
  showAll(cards);  // paint again
  form.reset();
});`),
    E("Delete with a button inside the card", "closest finds the card even if you click the icon inside the button.", `grid.addEventListener("click", function (e) {
  const btn = e.target.closest("[data-delete]");
  if (!btn) return;
  const id = Number(btn.closest(".card").dataset.id);
  cards = cards.filter((c) => c.id !== id);  // Delete
  showAll(cards);
});`),
    E("The HTML shell", "Put this in index.html, then paste a lab.", `<!-- <div id="grid" class="grid"></div>
<form id="add">
  <input name="title" placeholder="Title" />
  <input name="text" placeholder="Text" />
  <button type="submit">Add card</button>
</form> -->`, "txt")
  ],
  questions: [
    Q(1, "beginner", "Project: show all cards from an array",
      "Keep cards in an array. For each item, make a node and append it to #grid. That is Read — the list becomes the page.",
      `const cards = [
  { id: 1, title: "Todo app", text: "Add and tick tasks" },
  { id: 2, title: "Weather", text: "Fetch a city" }
];

function showAll(list) {
  const grid = document.getElementById("grid");
  grid.replaceChildren();  // clear last paint
  list.forEach((item) => {
    grid.appendChild(makeCard(item));  // one card per object
  });
}

showAll(cards);`),
    Q(2, "beginner", "Project: build a card with createElement",
      "createElement makes a node. className styles it. textContent is safe. dataset.id stores the id so later clicks know which card it is.",
      `function makeCard(item) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.id = String(item.id);
  const title = document.createElement("h3");
  title.textContent = item.title;  // never innerHTML for user text
  const body = document.createElement("p");
  body.textContent = item.text;
  card.append(title, body);
  return card;
}`),
    Q(3, "beginner", "Project: add a click listener on one card",
      "addEventListener(\"click\", fn) runs fn when that node is clicked. Use it for a single demo card. For many cards, prefer delegation (next lab).",
      `const first = document.querySelector(".card");
first.addEventListener("click", function () {
  first.classList.toggle("is-open");  // flip a CSS class
  console.log("opened", first.dataset.id);
});`),
    Q(4, "intermediate", "Project: event delegation on the card grid",
      "One listener on #grid. closest(\".card\") finds the card even if the click was on the title inside it. Cards you add later still fire this listener. You do not need 50 listeners.",
      `const grid = document.getElementById("grid");
grid.addEventListener("click", function (e) {
  const card = e.target.closest(".card");  // walk up to the card
  if (!card || !grid.contains(card)) return;  // clicked empty gap
  console.log("card", card.dataset.id);
});`),
    Q(5, "beginner", "Project: delete a card",
      "A Delete button with data-delete. On click, read the card id, filter it out of the array, then showAll again. The DOM matches the array.",
      `grid.addEventListener("click", function (e) {
  const btn = e.target.closest("[data-delete]");
  if (!btn) return;
  const id = Number(btn.closest(".card").dataset.id);
  cards = cards.filter((c) => c.id !== id);  // Delete in data
  showAll(cards);  // Delete on the page
});

function makeCard(item) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.id = String(item.id);
  const btn = document.createElement("button");
  btn.type = "button";
  btn.dataset.delete = "1";  // mark as the delete control
  btn.textContent = "Delete";
  card.append(btn);
  return card;
}`),
    Q(6, "beginner", "Project: like / unlike a card",
      "Toggle a liked flag on the object, then re-render or toggle a class. The heart is a button so keyboard users can hit it too.",
      `grid.addEventListener("click", function (e) {
  const btn = e.target.closest("[data-like]");
  if (!btn) return;
  const id = Number(btn.closest(".card").dataset.id);
  cards = cards.map((c) => c.id === id ? { ...c, liked: !c.liked } : c);  // Update
  showAll(cards);
});

function makeCard(item) {
  const card = document.createElement("article");
  card.dataset.id = String(item.id);
  const like = document.createElement("button");
  like.type = "button";
  like.dataset.like = "1";
  like.textContent = item.liked ? "Liked" : "Like";
  like.setAttribute("aria-pressed", item.liked ? "true" : "false");
  card.append(like);
  return card;
}`),
    Q(7, "intermediate", "Project: form that adds a new card",
      "submit + preventDefault. Read input values, push a new object, showAll, reset the form. Empty title does not create a card.",
      `const form = document.getElementById("add");
form.addEventListener("submit", function (e) {
  e.preventDefault();  // do not reload
  const title = form.title.value.trim();
  const text = form.text.value.trim();
  if (!title) return;  // validation
  cards.push({ id: Date.now(), title, text, liked: false });  // Create
  showAll(cards);
  form.reset();
  form.title.focus();
});`),
    Q(8, "intermediate", "Project: search / filter the cards",
      "An input listener. Filter the array by title, then showAll the match. The full list stays in cards. You only change what you paint.",
      `const search = document.getElementById("search");
search.addEventListener("input", function () {
  const q = search.value.trim().toLowerCase();
  const shown = cards.filter((c) => c.title.toLowerCase().includes(q));  // Read + filter
  showAll(shown);
});`),
    Q(9, "intermediate", "Project: edit a card title",
      "An Edit button turns the title into an input. Save writes back to the array and re-renders. Escape cancels.",
      `grid.addEventListener("click", function (e) {
  const btn = e.target.closest("[data-edit]");
  if (!btn) return;
  const card = btn.closest(".card");
  const id = Number(card.dataset.id);
  const next = prompt("New title", card.querySelector("h3").textContent);
  if (!next || !next.trim()) return;
  cards = cards.map((c) => c.id === id ? { ...c, title: next.trim() } : c);  // Update
  showAll(cards);
});`),
    Q(10, "intermediate", "Project: open a modal when you click a card",
      "Click the card body (not Delete) → fill a dialog and showModal(). Store the id so Close knows which card you were viewing.",
      `const dialog = document.getElementById("modal");
grid.addEventListener("click", function (e) {
  if (e.target.closest("button")) return;  // let Delete / Like handle themselves
  const card = e.target.closest(".card");
  if (!card) return;
  const item = cards.find((c) => c.id === Number(card.dataset.id));
  dialog.querySelector("h2").textContent = item.title;
  dialog.querySelector("p").textContent = item.text;
  dialog.showModal();  // native modal
});
dialog.querySelector("[data-close]").addEventListener("click", function () {
  dialog.close();
});`),
    Q(11, "beginner", "Project: close modal on Escape and backdrop",
      "A <dialog> already closes on Escape. For a custom overlay, listen to keydown and to clicks on the dimmed backdrop.",
      `document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") dialog.close();  // keyboard
});
dialog.addEventListener("click", function (e) {
  if (e.target === dialog) dialog.close();  // click the dark backdrop
});`),
    Q(12, "intermediate", "Project: save cards in localStorage",
      "After every Create/Update/Delete, stringify the array. On load, parse and showAll. Keys are strings.",
      `function save() {
  localStorage.setItem("cards", JSON.stringify(cards));  // persist
}
function load() {
  cards = JSON.parse(localStorage.getItem("cards") || "[]");
  showAll(cards);
}
form.addEventListener("submit", function (e) {
  e.preventDefault();
  cards.push({ id: Date.now(), title: form.title.value.trim(), text: "" });
  save();
  showAll(cards);
});
load();`),
    Q(13, "beginner", "Project: empty state when there are no cards",
      "If the list is empty, show a message instead of a blank grid. After the first add, the message goes away because showAll paints cards.",
      `function showAll(list) {
  const grid = document.getElementById("grid");
  grid.replaceChildren();
  if (!list.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No cards yet. Add one.";
    grid.appendChild(empty);
    return;
  }
  list.forEach((item) => grid.appendChild(makeCard(item)));
}`),
    Q(14, "intermediate", "Project: stop a like click from opening the modal",
      "The like button sits inside the card. Without stopPropagation, the card listener also runs. Stop the bubble, or check closest(\"button\") in the card handler (cleaner).",
      `grid.addEventListener("click", function (e) {
  if (e.target.closest("button")) return;  // button has its own job
  const card = e.target.closest(".card");
  if (card) openModal(Number(card.dataset.id));
});

// or inside the like handler:
like.addEventListener("click", function (e) {
  e.stopPropagation();  // do not tell the card
  toggleLike(item.id);
});`),
    Q(15, "beginner", "Project: highlight a card on mouseenter",
      "mouseenter / mouseleave toggle a class. Prefer CSS :hover when you only need a color. Use JS when you also update a status line.",
      `grid.addEventListener("mouseover", function (e) {
  const card = e.target.closest(".card");
  if (!card) return;
  card.classList.add("is-hot");  // CSS can paint a border
});
grid.addEventListener("mouseout", function (e) {
  const card = e.target.closest(".card");
  if (!card) return;
  card.classList.remove("is-hot");
});`),
    Q(16, "intermediate", "Project: keyboard — focus and Enter on a card",
      "Make the card focusable with tabindex=\"0\". Enter or Space opens it. That is a DOM + a11y project, not only a click project.",
      `function makeCard(item) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.id = String(item.id);
  card.tabIndex = 0;  // can Tab to this card
  card.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();  // Space would scroll
      openModal(item.id);
    }
  });
  return card;
}`),
    Q(17, "advanced", "Project: lazy-load card images",
      "IntersectionObserver watches when a card enters the viewport, then sets img.src. That is a DOM API, not a click, and it keeps the first paint light.",
      `const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const img = entry.target;
    img.src = img.dataset.src;  // real URL only now
    io.unobserve(img);
  });
});
document.querySelectorAll("img[data-src]").forEach((img) => io.observe(img));`),
    Q(18, "intermediate", "Project: sort cards by title",
      "A select or button sorts the array, then showAll. The DOM order follows the array order because you append in that order.",
      `function sortByTitle() {
  cards = cards.slice().sort((a, b) => a.title.localeCompare(b.title));
  showAll(cards);  // paint in the new order
}
document.getElementById("sort").addEventListener("click", sortByTitle);`),
    Q(19, "beginner", "Why not put the whole card in innerHTML?",
      "innerHTML parses HTML. If title is <img onerror=...> you just ran attacker JS (XSS). textContent and createElement treat it as letters. Template strings are fine for your own fixed markup, not for user strings.",
      `title.textContent = item.title;  // safe
// card.innerHTML = "<h3>" + item.title + "</h3>";  // XSS if title is dirty`),
    Q(20, "intermediate", "querySelector vs querySelectorAll on cards?",
      "querySelector returns the first match. querySelectorAll returns every match (a static NodeList). You forEach the list to bind or to read. getElementById is for one unique id like grid.",
      `const grid = document.getElementById("grid");  // one box
const first = grid.querySelector(".card");  // first card only
const all = grid.querySelectorAll(".card");  // every card right now
all.forEach((card) => card.classList.remove("is-open"));`),
    Q(21, "beginner", "What does preventDefault do on the add-card form?",
      "A form submit reloads the page by default and wipes your JS state. preventDefault stops that so you can push to the array and paint. Use type=\"button\" on Like/Delete so they do not submit the form.",
      `form.addEventListener("submit", function (e) {
  e.preventDefault();  // keep the page
  cards.push({ id: Date.now(), title: form.title.value.trim() });
  showAll(cards);
});`),
    Q(22, "intermediate", "What does stopPropagation do on a card?",
      "A click on a child bubbles to the card, then the grid, then document. stopPropagation cuts that trip. Prefer checking closest(\"button\") so you do not hide bugs. Use stop when a third-party listener on the parent must not run.",
      `card.addEventListener("click", function () { openModal(); });
like.addEventListener("click", function (e) {
  e.stopPropagation();  // card listener will not run
  toggleLike();
});`),
    Q(23, "beginner", "Project: count how many cards are on the page",
      "After showAll, querySelectorAll(\".card\").length is the painted count. cards.length is the data count. They should match unless you are filtering.",
      `function showAll(list) {
  grid.replaceChildren();
  list.forEach((item) => grid.appendChild(makeCard(item)));
  document.getElementById("count").textContent = list.length + " cards";
}`),
    Q(24, "advanced", "Project: drag a card to reorder",
      "draggable=\"true\", dragstart stores the id, drop reads the target id, splice the array, showAll. The DOM follows the array again.",
      `grid.addEventListener("dragstart", function (e) {
  const card = e.target.closest(".card");
  e.dataTransfer.setData("text/plain", card.dataset.id);  // which card
});
grid.addEventListener("dragover", function (e) { e.preventDefault(); });
grid.addEventListener("drop", function (e) {
  e.preventDefault();
  const from = Number(e.dataTransfer.getData("text/plain"));
  const to = Number(e.target.closest(".card").dataset.id);
  const a = cards.findIndex((c) => c.id === from);
  const b = cards.findIndex((c) => c.id === to);
  const [moved] = cards.splice(a, 1);
  cards.splice(b, 0, moved);  // new order
  showAll(cards);
});`)
  ]
};

fs.writeFileSync(
  path.join(__dirname, "..", "data", "practice-dom.js"),
  `window.PREP_DATA = window.PREP_DATA || {};\nwindow.PREP_DATA["practice-dom"] = ${JSON.stringify(data, null, 2)};\n`
);
console.log("wrote practice-dom", data.questions.length, "labs");
