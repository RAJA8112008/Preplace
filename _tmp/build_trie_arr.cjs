const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { dumpTopic, dumpNote, dumpExample, dumpQuestion } = require("./dsa_emit.cjs");
const { verify } = require("./inject.cjs");

const root = path.join(__dirname, "..");
const dataDir = path.join(root, "data");

const { notes, examples } = require("./trie_notes_ex.cjs");
const trieQs = []
  .concat(require("./trie_q1_4.cjs"))
  .concat(require("./trie_q5_8.cjs"))
  .concat(require("./trie_q9_12.cjs"));

if (notes.length !== 10) throw new Error("trie notes " + notes.length);
if (examples.length !== 8) throw new Error("trie examples " + examples.length);
if (trieQs.length !== 12) throw new Error("trie questions " + trieQs.length);

const trieSrc = dumpTopic("dsa-trie", {
  kind: "dsa",
  notes: notes,
  examples: examples,
  questions: trieQs
});
const triePath = path.join(dataDir, "dsa-trie.js");
fs.writeFileSync(triePath, trieSrc);
const trieV = verify(trieSrc);
if (trieV.bad.length) {
  console.error("trie verify failed");
  console.error(trieV.bad);
  process.exit(1);
}

const { note, example } = require("./arr_note_ex.cjs");
const arrQs = []
  .concat(require("./arr_q26_31.cjs"))
  .concat(require("./arr_q32_36.cjs"));
if (arrQs.length !== 11) throw new Error("arr questions " + arrQs.length);

const arraysPath = path.join(dataDir, "dsa-arrays.js");
let arrays = fs.readFileSync(arraysPath, "utf8");
if (arrays.includes('title: "Matrices / 2D arrays"')) {
  throw new Error("arrays already has the extra note");
}
if (/\nid:\s*26,/.test(arrays)) {
  throw new Error("arrays already has question 26");
}

const noteMark = "\n  ],\n  examples: [";
const noteAt = arrays.indexOf(noteMark);
if (noteAt < 0) throw new Error("note mark missing");
arrays = arrays.slice(0, noteAt) + ",\n" + dumpNote(note, "    ") + arrays.slice(noteAt);

const exMark = "\n  ],\n  questions: [";
const exAt = arrays.indexOf(exMark);
if (exAt < 0) throw new Error("example mark missing");
arrays = arrays.slice(0, exAt) + ",\n" + dumpExample(example, "    ") + arrays.slice(exAt);

const qMark = "\n  ]\n};";
const qAt = arrays.lastIndexOf(qMark);
if (qAt < 0) throw new Error("questions close missing");
const extraQs = arrQs.map((q) => dumpQuestion(q, "    ")).join(",\n");
arrays = arrays.slice(0, qAt) + ",\n" + extraQs + arrays.slice(qAt);

fs.writeFileSync(arraysPath, arrays);

const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(triePath, "utf8"), ctx);
vm.runInContext(fs.readFileSync(arraysPath, "utf8"), ctx);

function packCounts(key) {
  const pack = ctx.window.PREP_DATA[key];
  const q = pack.questions;
  const langs = ["javascript", "python", "java", "cpp", "c"];
  const bad = [];
  (pack.examples || []).forEach((ex, i) => {
    langs.forEach((k) => {
      if (!ex.codes || !ex.codes[k] || !String(ex.codes[k]).trim()) bad.push(key + " example " + i + " " + k);
    });
    if (ex.code !== ex.codes.javascript) bad.push(key + " example " + i + " js mismatch");
  });
  q.forEach((item) => {
    if (!item.ask) bad.push(key + " q" + item.id + " no ask");
    if (!item.links || item.links.length < 2) bad.push(key + " q" + item.id + " links");
    const sols = item.solutions || [];
    if (sols.length !== 3) bad.push(key + " q" + item.id + " sols " + sols.length);
    sols.forEach((s) => {
      langs.forEach((k) => {
        if (!s.codes || !s.codes[k] || !String(s.codes[k]).trim()) bad.push(key + " q" + item.id + " " + s.name + " " + k);
      });
      if (s.code !== s.codes.javascript) bad.push(key + " q" + item.id + " " + s.name + " js mismatch");
    });
  });
  return {
    notes: pack.notes.length,
    examples: pack.examples.length,
    questions: q.length,
    ids: q.map((item) => item.id),
    bad: bad
  };
}

const trieC = packCounts("dsa-trie");
const arrC = packCounts("dsa-arrays");
const unescTrie = /(?<!\\)\$\{/.test(fs.readFileSync(triePath, "utf8"));
const unescArr = /(?<!\\)\$\{/.test(fs.readFileSync(arraysPath, "utf8"));

console.log(JSON.stringify({
  trie: {
    notes: trieC.notes,
    examples: trieC.examples,
    questions: trieC.questions,
    ids: trieC.ids,
    verifyBad: trieV.bad,
    packBad: trieC.bad,
    unescapedDollar: unescTrie
  },
  arrays: {
    notes: arrC.notes,
    examples: arrC.examples,
    questions: arrC.questions,
    idsTail: arrC.ids.slice(-12),
    packBadNew: arrC.bad.filter((x) => /q(2[6-9]|3[0-6])/.test(x) || /example 9/.test(x)),
    packBadCount: arrC.bad.length,
    unescapedDollar: unescArr
  }
}, null, 2));
