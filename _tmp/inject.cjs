const fs = require("fs");

function tick(s) {
  if (s == null || !String(s).trim()) throw new Error("empty code");
  return "`" + String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";
}

function collect(src) {
  const blocks = [];
  let i = 0;
  while (true) {
    const m = src.indexOf("code: `", i);
    if (m < 0) break;
    let j = m + 7;
    while (j < src.length) {
      if (src[j] === "\\") {
        j += 2;
        continue;
      }
      if (src[j] === "`") break;
      j++;
    }
    let lineStart = m;
    while (lineStart > 0 && src[lineStart - 1] !== "\n") lineStart--;
    blocks.push({
      start: m,
      end: j + 1,
      indent: src.slice(lineStart, m),
      js: src.slice(m + 7, j)
    });
    i = j + 1;
  }
  return blocks;
}

function inject(src, langs) {
  const blocks = collect(src);
  if (blocks.length !== langs.length) {
    throw new Error("count mismatch: file has " + blocks.length + " code blocks, translations " + langs.length);
  }
  let out = "";
  let i = 0;
  for (let b = 0; b < blocks.length; b++) {
    const block = blocks[b];
    const L = langs[b];
    const indent = block.indent;
    out += src.slice(i, block.end);
    out += ",\n" + indent + "codes: {\n";
    out += indent + "  javascript: " + tick(block.js) + ",\n";
    out += indent + "  python: " + tick(L.python) + ",\n";
    out += indent + "  java: " + tick(L.java) + ",\n";
    out += indent + "  cpp: " + tick(L.cpp) + ",\n";
    out += indent + "  c: " + tick(L.c) + "\n";
    out += indent + "}";
    i = block.end;
  }
  out += src.slice(i);
  return out;
}

function verify(src) {
  const vm = require("vm");
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  const data = ctx.window.PREP_DATA;
  const key = Object.keys(data)[0];
  const pack = data[key];
  const keys = ["javascript", "python", "java", "cpp", "c"];
  let examples = 0;
  let solutions = 0;
  const bad = [];
  function check(block, where) {
    if (!block.codes) {
      bad.push(where + " missing codes");
      return;
    }
    for (const k of keys) {
      if (!block.codes[k] || !String(block.codes[k]).trim()) bad.push(where + " empty " + k);
    }
    if (block.code !== block.codes.javascript) bad.push(where + " javascript !== code");
  }
  (pack.examples || []).forEach((ex, i) => {
    examples++;
    check(ex, "example " + i + " " + (ex.title || ""));
  });
  (pack.questions || []).forEach((q) => {
    (q.solutions || []).forEach((s) => {
      solutions++;
      check(s, "q" + q.id + " " + s.name);
    });
  });
  const unesc = /(?<!\\)\$\{/;
  if (unesc.test(src)) bad.push("unescaped ${ in file");
  return { key, examples, solutions, bad, totalBlocks: examples + solutions };
}

module.exports = { collect, inject, verify, tick };

if (require.main === module) {
  const file = process.argv[2];
  const transPath = process.argv[3];
  const src = fs.readFileSync(file, "utf8");
  const langs = require(transPath);
  const out = inject(src, langs);
  fs.writeFileSync(file, out);
  const v = verify(out);
  console.log(JSON.stringify(v, null, 2));
}
