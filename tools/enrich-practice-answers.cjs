"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "data");
const HEADS = [
  "Summary",
  "The problem before",
  "What this is",
  "How the code works",
  "What it solves",
  "Real-life example",
  "Uses",
  "Say this in an interview",
  "Watch out"
];
const HEAD_RE = /^(Summary|The problem before|What this is|What happens|What it solves|Real-life example|Uses|Watch out|What the code is doing|Also know|Say this in an interview|Before you use this|Why we use it|When to pick this|How the code works)\.?$/i;

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
        : /^(what the code is doing|how the code works)$/i.test(t) ? "How the code works"
        : /^say this/i.test(t) ? "Say this in an interview"
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
  .map((h) => `${h}\n${String(map[h]).trim()}`)
  .join("\n\n");

const getCode = (item) => {
  if (item.code) return String(item.code);
  const codes = item.codes || {};
  return String(codes.javascript || codes.html || Object.values(codes)[0] || "");
};

const inferLine = (src) => {
  const s = src.replace(/\s+/g, " ").trim();
  if (/^function\s+\w+/.test(s) || /^const \w+ = (async )?\(/.test(s) || /^async function/.test(s)) {
    return "This is the function you would write. Say its name and what it returns.";
  }
  if (/\.trim\(/.test(s)) return "Turn the value into text and drop extra spaces so a blank box is not saved as a task.";
  if (/if\s*\(\s*!/.test(s) && /return/.test(s)) return "Stop here if the input is empty or missing. Do not create a bad row.";
  if (/\.push\(/.test(s)) return "Create: add the new object onto the end of the list.";
  if (/\.filter\(/.test(s)) return "Build a new list that drops the matching id. Other rows stay.";
  if (/\.map\(/.test(s)) return "Walk every item. Change only the one whose id matches; return the others unchanged.";
  if (/spread|\.\.\./.test(s) && /done|text/.test(s)) return "Copy the old object, then overwrite the field you are updating so the id does not change.";
  if (/localStorage\.setItem/.test(s)) return "Save the list as one text string. Refresh can load it later.";
  if (/localStorage\.getItem/.test(s)) return "Read the saved text. If this is the first visit, use an empty list.";
  if (/JSON\.stringify/.test(s)) return "Objects cannot sit in localStorage as objects — turn them into JSON text first.";
  if (/JSON\.parse/.test(s)) return "Turn the JSON text back into a real array of objects.";
  if (/fetch\(/.test(s)) return "Ask the server over the network. This is not reading a local array.";
  if (/res\.ok|!\w+\.ok/.test(s)) return "fetch does not throw on 404. You must check the status yourself.";
  if (/\.json\(\)/.test(s)) return "Parse the response body as JSON.";
  if (/status\(400\)/.test(s)) return "400 means the client sent a bad body. Tell them what field is missing.";
  if (/status\(401\)/.test(s)) return "401 means not logged in. Ask them to login, do not say forbidden.";
  if (/status\(403\)/.test(s)) return "403 means they are logged in but not allowed to do this action.";
  if (/status\(201\)/.test(s)) return "201 means created. Return the new row so the UI can paint it.";
  if (/bcrypt\.hash|hashPassword/.test(s)) return "Never store the real password. Save a slow hash.";
  if (/bcrypt\.compare|checkPassword/.test(s)) return "Compare the typed password to the hash. Do not decrypt.";
  if (/jwt\.sign/.test(s)) return "After a good login, sign a token with a server secret. The secret stays on the server.";
  if (/jwt\.verify/.test(s)) return "Prove the token was signed by us and is not expired.";
  if (/createElement/.test(s)) return "Make a real DOM node. Safer than innerHTML for user text.";
  if (/textContent/.test(s)) return "Put the text in as text, not as HTML, so a script tag cannot run.";
  if (/innerHTML/.test(s)) return "Dangerous if the string came from the user. Prefer textContent.";
  if (/addEventListener/.test(s)) return "Wait for a click, type, or submit. The handler runs later.";
  if (/preventDefault/.test(s)) return "Stop the browser from reloading the page on submit.";
  if (/closest\(/.test(s)) return "From the click target, walk up to the card or button you care about.";
  if (/dataset\./.test(s)) return "Read the id you stored on the node when you painted it.";
  if (/replaceChildren/.test(s)) return "Clear old cards before you paint again, or you will duplicate.";
  if (/useState/.test(s)) return "React state: when this value changes, the screen paints again.";
  if (/useRef/.test(s)) return "A box that keeps a value without painting again. Good for timer ids and DOM nodes.";
  if (/key=\{/.test(s)) return "A stable id so React can match the same row after insert or delete.";
  if (/cors\(|Access-Control/.test(s)) return "The API tells the browser which UI origin may read the response.";
  if (/https:\/\//.test(s)) return "Encrypted HTTP. Do not send a password on http://.";
  if (/UPDATE |update /.test(s) && /WHERE|where/.test(s)) return "Change only the row with this id. WHERE is what keeps the rest of the table safe.";
  if (/DELETE FROM|delete from/.test(s)) return "Remove the matching row. Always include WHERE and, in a real app, the owner id.";
  if (/INSERT INTO|insert into/.test(s)) return "Create a new row in the table. Validate first.";
  if (/SELECT |select /.test(s)) return "Read rows. This should not change data.";
  if (/createIndex|unique:\s*true/.test(s)) return "The database refuses a second user with the same email. Do not only check in JavaScript.";
  if (/redis\.(del|set|get)/.test(s)) return "Cache or session helper. Redis is not the system of record for users.";
  if (/===/.test(s) && /==/.test(s) === false) return "Strict compare: same type and same value. No silent conversion.";
  if (/\bvar\b/.test(s)) return "Function-scoped. Avoid in new code; it leaks out of if and for.";
  if (/\blet\b/.test(s)) return "Block-scoped name that you may reassign.";
  if (/\bconst\b/.test(s) && !/function/.test(s)) return "Block-scoped name that cannot point at a new value.";
  if (/console\.log/.test(s)) return "Print so you can see the result while you learn. In an app you would paint the UI instead.";
  if (/return /.test(s)) return "Hand the result back to the caller.";
  return "Say this line out loud: what goes in, what comes out, and why it is here.";
};

const codeSteps = (code) => {
  const steps = [];
  for (const raw of String(code || "").split("\n")) {
    const line = raw.trim();
    if (!line || line === "{" || line === "}" || line === ");" || line === "};") continue;
    if (line.startsWith("//") || line.startsWith("/*") || line.startsWith("*") || line.startsWith("-->")) {
      const note = line.replace(/^\/\/\s?/, "").replace(/^\/\*\s?/, "").replace(/\*\/$/, "").trim();
      if (note) steps.push({ src: "", note });
      continue;
    }
    const idx = line.indexOf("//");
    const src = (idx >= 0 ? line.slice(0, idx) : line).trim().replace(/[,;]+$/, "");
    const note = idx >= 0 ? line.slice(idx + 2).trim() : "";
    if (!src && !note) continue;
    steps.push({ src: src.slice(0, 120), note: note || inferLine(src) });
  }
  return steps.slice(0, 16);
};

const explainCode = (item) => {
  const code = getCode(item);
  const steps = codeSteps(code);
  const q = String(item.q || "").replace(/^Practice:\s*/i, "").replace(/^Project:\s*/i, "");
  const intro = [
    `The snippet under this question is the working answer for: ${q}.`,
    "Read it top to bottom. Each step is one idea. The comments on the right are the easy meaning of that same line.",
    "In an interview, put your finger on the line you are talking about. Do not wave at the whole file."
  ].join(" ");
  if (!steps.length) {
    return `${intro}\n\nThere is no long snippet here, so explain the idea in words, then write three lines that prove it.`;
  }
  const numbered = steps.map((s, i) => {
    const bit = s.src ? `\`${s.src}\`` : "Comment";
    return `${i + 1}. ${bit} — ${s.note}`;
  }).join("\n\n");
  const outro = [
    "After you understand every line, hide the snippet and write it again from memory.",
    "Then break it: empty input, a wrong id, or a failed login. The extra if is the real lesson.",
    "If you cannot explain one line, that is the line the interviewer will ask about."
  ].join(" ");
  return `${intro}\n\n${numbered}\n\n${outro}`;
};

const stripFiller = (text) => String(text || "")
  .replace(/Here is the straight interview answer\. Start here\. You can skip the shop story until they ask for an example\.\s*/g, "")
  .replace(/This is a hands-on lab, not a riddle\.[^.]*\.\s*/g, "")
  .replace(/If you only remember three things[^.]*\.\s*/g, "")
  .replace(/Say the job in one sentence, then point at the code, then name one mistake\.\s*/g, "")
  .replace(/^Summary:\s*/i, "")
  .trim();

const deepenWhat = (item, map) => {
  const old = stripFiller(map["What this is"] || "");
  const code = getCode(item);
  const steps = codeSteps(code).slice(0, 6);
  const walk = steps.length
    ? "In this snippet: " + steps.map((s) => (s.src ? `${s.src} (${s.note})` : s.note)).join("; ") + "."
    : "";
  const extra = [
    `The question is asking you to explain ${item.q.replace(/\?$/, "")} so a teammate could implement it tomorrow.`,
    "A proper explanation has three parts: the rule, what the computer does, and what goes wrong if you skip a check.",
    walk,
    item.ask ? "This is a most-asked interview question. Companies want the rule in your own words, then they point at a tiny snippet like the one below." : "This is a lab. The explanation is the function: input, check, change, return."
  ].filter(Boolean).join(" ");
  const merged = [old, extra].filter(Boolean).join(" ");
  return merged;
};

const makeSummary = (item, map) => {
  const q = item.q;
  const what = stripFiller(map["What this is"] || "");
  const solves = stripFiller(map["What it solves"] || "");
  const watch = stripFiller(map["Watch out"] || "");
  const uses = stripFiller(map["Uses"] || "");
  const steps = codeSteps(getCode(item)).slice(0, 5);
  const codePara = steps.length
    ? "How the snippet proves it:\n\n" + steps.map((s, i) => `${i + 1}. ${s.src ? `\`${s.src}\`` : "Note"} — ${s.note}`).join("\n\n")
    : "If there is no snippet, say the rule, then invent three lines of code that show it.";
  const parts = [
    `Question: ${q}`,
    "",
    "Plain answer:",
    sentences(what, 6) || what || `You must be able to explain ${q} without reading a blog.`,
    "",
    solves ? `Why it matters: ${sentences(solves, 4)}` : "",
    "",
    codePara,
    "",
    uses ? `Where you use it: ${sentences(uses, 3)}` : "",
    "",
    watch ? `What to watch: ${sentences(watch, 3)}` : "What to watch: skip the check, then name the bug.",
    "",
    "A complete explanation is: rule → snippet → one failed input. That is enough for a two-minute interview answer."
  ].filter((p) => p !== undefined);
  return parts.join("\n").replace(/\n{3,}/g, "\n\n").trim();
};

const makeSpoken = (item, map) => {
  const what = stripFiller(map["What this is"] || "");
  const watch = stripFiller(map["Watch out"] || "");
  const first = codeSteps(getCode(item))[0];
  return [
    `Say this out loud, slowly.`,
    "",
    `${item.q} Here is my answer.`,
    sentences(what, 4) || what,
    first ? `In the code, the first real line is ${first.src ? `\`${first.src}\`` : "the setup"}, which means: ${first.note}` : "",
    watch ? `The usual trap is: ${sentences(watch, 2)}` : "",
    "If they ask for an example, I will walk the snippet line by line instead of telling a shop story.",
    "If they ask why, I will name the bug you get when that line is missing."
  ].filter(Boolean).join("\n\n");
};

const cleanSection = (text) => stripFiller(text)
  .replace(/Walk the snippet like this:[^.]*\.\s*/g, "")
  .replace(/A line you can point at:[^.]*\.\s*/g, "")
  .replace(/On this sheet, the question is:[^.]*\.\s*/g, "")
  .replace(/Map guest → user[^.]*\.\s*/g, "")
  .replace(/When you are done: run it[^.]*\.\s*/g, "")
  .replace(/In an interview, start with the job in plain words[^.]*\.\s*/g, "")
  .trim();

const enrich = (item) => {
  const map = splitSections(item.a);
  ["What this is", "What it solves", "The problem before", "Real-life example", "Uses", "Watch out"].forEach((h) => {
    if (map[h]) map[h] = cleanSection(map[h]);
  });
  map["What this is"] = deepenWhat(item, map);
  map["How the code works"] = explainCode(item);
  map["Say this in an interview"] = makeSpoken(item, map);
  map.Summary = makeSummary(item, map);
  return joinSections(map);
};

const files = fs.readdirSync(DATA).filter((f) => f.startsWith("practice-") && f.endsWith(".js"));
let n = 0;
let minSum = 9999;

for (const file of files) {
  const full = path.join(DATA, file);
  const ctx = { window: { PREP_DATA: {} } };
  vm.runInNewContext(fs.readFileSync(full, "utf8"), ctx);
  const ids = Object.keys(ctx.window.PREP_DATA);
  if (ids.length !== 1) throw new Error("expected one pack in " + file);
  const id = ids[0];
  const pack = ctx.window.PREP_DATA[id];
  for (const q of pack.questions || []) {
    q.a = enrich(q);
    n += 1;
    const sum = (q.a.split(/\n\nThe problem before\n/)[0] || "").split(/\s+/).length;
    if (sum < minSum) minSum = sum;
  }
  fs.writeFileSync(full, `window.PREP_DATA = window.PREP_DATA || {};\nwindow.PREP_DATA[${JSON.stringify(id)}] = ${JSON.stringify(pack, null, 2)};\n`);
  console.log("enriched", file, (pack.questions || []).length);
}

console.log("questions", n, "minSummaryWords", minSum);
