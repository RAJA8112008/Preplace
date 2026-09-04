function tick(s) {
  if (s == null || !String(s).trim()) throw new Error("empty code");
  return "`" + String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";
}

function dumpCodes(codes, pad) {
  const keys = ["javascript", "python", "java", "cpp", "c"];
  let s = pad + "codes: {\n";
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (!codes[k] || !String(codes[k]).trim()) throw new Error("empty " + k);
    s += pad + "  " + k + ": " + tick(codes[k]);
    s += i < keys.length - 1 ? ",\n" : "\n";
  }
  return s + pad + "}";
}

function dumpExample(ex, pad) {
  const codes = Object.assign({ javascript: ex.code }, ex.codes);
  let s = pad + "{\n";
  s += pad + "  lang: " + JSON.stringify(ex.lang || "js") + ",\n";
  s += pad + "  title: " + JSON.stringify(ex.title) + ",\n";
  s += pad + "  desc: " + JSON.stringify(ex.desc) + ",\n";
  s += pad + "  code: " + tick(ex.code) + ",\n";
  s += dumpCodes(codes, pad + "  ") + "\n";
  s += pad + "}";
  return s;
}

function dumpSolution(sol, pad) {
  const codes = Object.assign({ javascript: sol.code }, sol.codes);
  let s = pad + "{\n";
  s += pad + "  name: " + JSON.stringify(sol.name) + ",\n";
  s += pad + "  time: " + JSON.stringify(sol.time) + ",\n";
  s += pad + "  space: " + JSON.stringify(sol.space) + ",\n";
  s += pad + "  why: " + JSON.stringify(sol.why) + ",\n";
  s += pad + "  code: " + tick(sol.code) + ",\n";
  s += dumpCodes(codes, pad + "  ") + "\n";
  s += pad + "}";
  return s;
}

function dumpQuestion(q, pad) {
  if (!q.ask) throw new Error("missing ask: " + q.q);
  if (!q.links || q.links.length < 2) throw new Error("need LC+GFG links: " + q.q);
  if (!q.solutions || q.solutions.length !== 3) throw new Error("need 3 solutions: " + q.q);
  const names = q.solutions.map((s) => s.name);
  if (names[0] !== "Brute" || names[1] !== "Optimal" || names[2] !== "More optimal") {
    throw new Error("solution names: " + q.q + " " + names.join(","));
  }
  let s = pad + "{\n";
  s += pad + "  id: " + q.id + ",\n";
  s += pad + "  level: " + JSON.stringify(q.level) + ",\n";
  s += pad + "  q: " + JSON.stringify(q.q) + ",\n";
  s += pad + "  ask: " + JSON.stringify(q.ask) + ",\n";
  s += pad + "  links: " + JSON.stringify(q.links) + ",\n";
  s += pad + "  a: " + JSON.stringify(q.a) + ",\n";
  s += pad + "  solutions: [\n";
  for (let i = 0; i < q.solutions.length; i++) {
    s += dumpSolution(q.solutions[i], pad + "    ");
    s += i < q.solutions.length - 1 ? ",\n" : "\n";
  }
  s += pad + "  ]\n";
  s += pad + "}";
  return s;
}

function dumpNote(n, pad) {
  let s = pad + "{\n";
  s += pad + "  title: " + JSON.stringify(n.title) + ",\n";
  s += pad + "  body: " + JSON.stringify(n.body) + "\n";
  s += pad + "}";
  return s;
}

function dumpTopic(key, pack) {
  let s = "window.PREP_DATA = window.PREP_DATA || {};\n";
  s += "window.PREP_DATA[" + JSON.stringify(key) + "] = {\n";
  s += "  kind: " + JSON.stringify(pack.kind) + ",\n";
  s += "  notes: [\n";
  pack.notes.forEach((n, i) => {
    s += dumpNote(n, "    ");
    s += i < pack.notes.length - 1 ? ",\n" : "\n";
  });
  s += "  ],\n";
  s += "  examples: [\n";
  pack.examples.forEach((ex, i) => {
    s += dumpExample(ex, "    ");
    s += i < pack.examples.length - 1 ? ",\n" : "\n";
  });
  s += "  ],\n";
  s += "  questions: [\n";
  pack.questions.forEach((q, i) => {
    s += dumpQuestion(q, "    ");
    s += i < pack.questions.length - 1 ? ",\n" : "\n";
  });
  s += "  ]\n";
  s += "};\n";
  return s;
}

function makeSol(name, time, space, why, langs) {
  return {
    name: name,
    time: time,
    space: space,
    why: why,
    code: langs.javascript,
    codes: {
      javascript: langs.javascript,
      python: langs.python,
      java: langs.java,
      cpp: langs.cpp,
      c: langs.c
    }
  };
}

function makeEx(title, desc, langs) {
  return {
    lang: "js",
    title: title,
    desc: desc,
    code: langs.javascript,
    codes: {
      javascript: langs.javascript,
      python: langs.python,
      java: langs.java,
      cpp: langs.cpp,
      c: langs.c
    }
  };
}

function lc(slug) {
  return { name: "LeetCode", url: "https://leetcode.com/problems/" + slug + "/" };
}
function gfgProblem(slug) {
  return { name: "GFG", url: "https://www.geeksforgeeks.org/problems/" + slug + "/1" };
}
function gfgArt(slug) {
  return { name: "GFG", url: "https://www.geeksforgeeks.org/" + slug + "/" };
}

module.exports = {
  tick,
  dumpTopic,
  dumpExample,
  dumpQuestion,
  dumpSolution,
  dumpNote,
  makeSol,
  makeEx,
  lc,
  gfgProblem,
  gfgArt
};
