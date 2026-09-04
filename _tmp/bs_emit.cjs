const fs = require("fs");
const path = require("path");
const vm = require("vm");

function tick(s) {
  if (s == null || !String(s).trim()) throw new Error("empty code");
  return "`" + String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";
}

function emitCodes(codes, indent) {
  const js = codes.javascript;
  const keys = ["javascript", "python", "java", "cpp", "c"];
  for (const k of keys) {
    if (!codes[k] || !String(codes[k]).trim()) throw new Error("empty " + k);
  }
  let out = indent + "code: " + tick(js) + ",\n";
  out += indent + "codes: {\n";
  out += indent + "  javascript: " + tick(codes.javascript) + ",\n";
  out += indent + "  python: " + tick(codes.python) + ",\n";
  out += indent + "  java: " + tick(codes.java) + ",\n";
  out += indent + "  cpp: " + tick(codes.cpp) + ",\n";
  out += indent + "  c: " + tick(codes.c) + "\n";
  out += indent + "}";
  return out;
}

function emitExample(ex, indent) {
  let out = indent + "{\n";
  out += indent + "  lang: " + JSON.stringify(ex.lang || "js") + ",\n";
  out += indent + "  title: " + JSON.stringify(ex.title) + ",\n";
  out += indent + "  desc: " + JSON.stringify(ex.desc) + ",\n";
  out += emitCodes(ex.codes, indent + "  ") + "\n";
  out += indent + "}";
  return out;
}

function emitSol(sol, indent) {
  let out = indent + "{\n";
  out += indent + "  name: " + JSON.stringify(sol.name) + ",\n";
  out += indent + "  time: " + JSON.stringify(sol.time) + ",\n";
  out += indent + "  space: " + JSON.stringify(sol.space) + ",\n";
  out += indent + "  why: " + JSON.stringify(sol.why) + ",\n";
  out += emitCodes(sol.codes, indent + "  ") + "\n";
  out += indent + "}";
  return out;
}

function emitQuestion(q, indent) {
  let out = indent + "{\n";
  out += indent + "  id: " + q.id + ",\n";
  out += indent + "  level: " + JSON.stringify(q.level) + ",\n";
  out += indent + "  q: " + JSON.stringify(q.q) + ",\n";
  out += indent + "  ask: " + JSON.stringify(q.ask) + ",\n";
  out += indent + "  links: " + JSON.stringify(q.links) + ",\n";
  out += indent + "  a: " + JSON.stringify(q.a) + ",\n";
  out += indent + "  solutions: [\n";
  out += q.solutions.map((s) => emitSol(s, indent + "    ")).join(",\n") + "\n";
  out += indent + "  ]\n";
  out += indent + "}";
  return out;
}

function emitPack(pack) {
  let out = "";
  out += "window.PREP_DATA = window.PREP_DATA || {};\n";
  out += "window.PREP_DATA[\"dsa-binarysearch\"] = {\n";
  out += "  kind: \"dsa\",\n";
  out += "  notes: [\n";
  out += pack.notes.map((n) => {
    return "    {\n      title: " + JSON.stringify(n.title) + ",\n      body: " + JSON.stringify(n.body) + "\n    }";
  }).join(",\n") + "\n";
  out += "  ],\n";
  out += "  examples: [\n";
  out += pack.examples.map((ex) => emitExample(ex, "    ")).join(",\n") + "\n";
  out += "  ],\n";
  out += "  questions: [\n";
  out += pack.questions.map((q) => emitQuestion(q, "    ")).join(",\n") + "\n";
  out += "  ]\n";
  out += "};\n";
  return out;
}

function verify(src) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  const pack = ctx.window.PREP_DATA["dsa-binarysearch"];
  const keys = ["javascript", "python", "java", "cpp", "c"];
  const bad = [];
  function check(block, where) {
    if (!block.codes) { bad.push(where + " missing codes"); return; }
    for (const k of keys) {
      if (!block.codes[k] || !String(block.codes[k]).trim()) bad.push(where + " empty " + k);
    }
    if (block.code !== block.codes.javascript) bad.push(where + " javascript !== code");
  }
  (pack.examples || []).forEach((ex, i) => check(ex, "example " + (i + 1) + " " + (ex.title || "")));
  (pack.questions || []).forEach((q) => {
    (q.solutions || []).forEach((s) => check(s, "q" + q.id + " " + s.name));
  });
  const unesc = /(?<!\\)\$\{/;
  if (unesc.test(src)) bad.push("unescaped ${ in file");
  const qIds = (pack.questions || []).map((q) => q.id);
  return {
    notes: (pack.notes || []).length,
    examples: (pack.examples || []).length,
    questions: (pack.questions || []).length,
    solutions: (pack.questions || []).reduce((n, q) => n + (q.solutions || []).length, 0),
    ids: qIds,
    bad
  };
}

function writePack(pack, dest) {
  const src = emitPack(pack);
  fs.writeFileSync(dest, src);
  const v = verify(src);
  return v;
}

module.exports = { tick, emitPack, verify, writePack };

if (require.main === module) {
  const pack = require("./bs_pack.cjs");
  const dest = path.join(__dirname, "..", "data", "dsa-binarysearch.js");
  const v = writePack(pack, dest);
  console.log(JSON.stringify(v, null, 2));
  if (v.bad.length) process.exit(1);
}
