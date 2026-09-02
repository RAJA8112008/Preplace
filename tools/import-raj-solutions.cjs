const fs = require("fs");
const path = require("path");
const vm = require("vm");

const LC_ROOT = "C:/Users/Nitin kumar/OneDrive/Desktop/_repos/Leetcode";
const GFG_ROOT = "C:/Users/Nitin kumar/OneDrive/Desktop/_repos/gfg-solutions";
const PREP = path.join(__dirname, "..");
const OUT = path.join(PREP, "data", "raj-solutions.js");

const commentFor = (raw) => {
  const s = String(raw).replace(/\s+\/\/.*$/, "").replace(/;$/, "").trim();
  if (!s) return "";
  if (/^class Solution\b/.test(s)) return "gfg / leetcode class — method you submit lives here";
  if (/vector<pair/.test(s)) return "strore the values with there indices";
  if (/sort\(/.test(s)) return "now sort the arr";
  if (/queue</.test(s)) return "queue for BFS order";
  if (/visited/.test(s) && /vector/.test(s)) return "mark nodes we already saw";
  if (/q\.push\(0\)|q\.push\(head\)/.test(s)) return "start from the first node";
  if (/q\.front\(\)|q\.pop\(\)/.test(s)) return "pop element from the queue";
  if (/for\s*\(\s*auto nbr/.test(s)) return "push nbr in queue";
  if (/slow\s*=\s*head/.test(s)) return "slow starts at head (1 step)";
  if (/fast\s*=\s*head/.test(s)) return "fast starts at head (2 steps)";
  if (/slow\s*=\s*slow->next/.test(s)) return "slow takes one step";
  if (/fast\s*=\s*fast->next->next/.test(s)) return "fast takes two steps";
  if (/next\s*=\s*curr->next/.test(s)) return "save next before we break the link";
  if (/curr->next\s*=\s*prev/.test(s)) return "reverse this pointer";
  if (/curr->prev\s*=\s*next/.test(s)) return "doubly list: old next becomes prev";
  if (/prev\s*=\s*curr/.test(s)) return "this node is now previous";
  if (/curr\s*=\s*next/.test(s)) return "walk to the saved next";
  if (/minprice|minPrice/.test(s) && /=/.test(s)) return "cheapest buy so far";
  if (/maxprofit|maxProfit/.test(s) && /=/.test(s)) return "best sell minus that buy";
  if (/sum\s*\+=/.test(s)) return "add this number into the running sum";
  if (/sum\s*=\s*0/.test(s)) return "drop the window if the sum went negative";
  if (/i\s*=\s*0/.test(s) && /j\s*=/.test(s) === false) return "left pointer";
  if (/j\s*=\s*.*size\(\)\s*-\s*1/.test(s)) return "right pointer at the last index";
  if (/while\s*\(\s*i\s*<\s*j/.test(s)) return "two pointers walk toward each other";
  if (/sum\s*==\s*target/.test(s)) return "this pair adds to target";
  if (/sum\s*>\s*target/.test(s) || /j--/.test(s)) return "sum too big — move right left";
  if (/sum\s*<\s*target/.test(s) || /i\+\+/.test(s) && /for/.test(s) === false) return "";
  if (/return \{arr\[i\]\.second/.test(s)) return "give back the original indexes";
  if (/return \{-1/.test(s)) return "no pair found";
  if (/return prev/.test(s)) return "new head is the last prev";
  if (/return slow/.test(s)) return "slow sits at the middle";
  if (/return true/.test(s)) return "they met — a cycle exists";
  if (/return false/.test(s)) return "fast hit the end — no cycle";
  if (/if\s*\(.*==\s*fast/.test(s) || /slow==fast/.test(s)) return "same node — loop found";
  if (/for\s*\(.*i/.test(s)) return "walk each index";
  if (/while\s*\(.*fast/.test(s)) return "keep going while a two-step is safe";
  if (/while\s*\(.*curr/.test(s)) return "walk until the list ends";
  if (/while\s*\(.*q/.test(s)) return "process the queue until empty";
  if (/if\s*\(/.test(s)) return "only do this when the check is true";
  if (/return /.test(s)) return "answer is ready — leave";
  if (/(int|long|bool|auto|vector|string|ListNode|Node)\s+\w+\s*=/.test(s)) return "name this value so later lines can use it";
  return "";
};

const annotateCpp = (src) => {
  const lines = String(src).replace(/\r\n/g, "\n").split("\n");
  const already = lines.filter((l) => /^\s*\/\//.test(l)).length;
  if (already >= 2) return lines.join("\n").trim();
  const out = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t || t === "{" || t === "}" || t === "};" || t.startsWith("//") || t.startsWith("/*") || t.startsWith("*")) {
      out.push(line);
      continue;
    }
    const note = commentFor(t);
    if (note) {
      const indent = (line.match(/^\s*/) || [""])[0];
      const tagged = `${indent}// ${note}`;
      if ((out[out.length - 1] || "").trim() !== tagged.trim()) out.push(tagged);
    }
    out.push(line);
  }
  return out.join("\n").trim();
};

const walk = (root, acc = []) => {
  if (!fs.existsSync(root)) return acc;
  for (const name of fs.readdirSync(root)) {
    const full = path.join(root, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (name === ".git" || name === "node_modules") continue;
      walk(full, acc);
    } else if (/\.(cpp|c|java|py|js)$/i.test(name)) acc.push(full);
  }
  return acc;
};

const lcBySlug = {};
for (const file of walk(LC_ROOT)) {
  const dir = path.basename(path.dirname(file));
  const m = dir.match(/^\d+-(.+)$/);
  if (!m) continue;
  const slug = m[1];
  const ext = path.extname(file).slice(1).toLowerCase();
  const lang = ext === "py" ? "python" : ext === "js" ? "javascript" : ext;
  if (!lcBySlug[slug]) lcBySlug[slug] = { slug, source: "leetcode", folder: dir, codes: {} };
  if (!lcBySlug[slug].codes[lang]) {
    lcBySlug[slug].codes[lang] = lang === "cpp" ? annotateCpp(fs.readFileSync(file, "utf8")) : fs.readFileSync(file, "utf8").trim();
  }
}

const gfgFiles = walk(GFG_ROOT).filter((f) => /\.cpp$/i.test(f) || /\.js$/i.test(f));
const gfgEntries = gfgFiles.map((file) => {
  const base = path.basename(file, path.extname(file));
  const key = base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const ext = path.extname(file).slice(1).toLowerCase();
  const lang = ext === "js" ? "javascript" : "cpp";
  const code = lang === "cpp" ? annotateCpp(fs.readFileSync(file, "utf8")) : fs.readFileSync(file, "utf8").trim();
  return { key, title: base.replace(/_/g, " "), file, lang, code };
});

const ctx = { window: { PREP_DATA: {} } };
for (const f of fs.readdirSync(path.join(PREP, "data")).filter((n) => n.startsWith("dsa-") && n.endsWith(".js"))) {
  vm.runInNewContext(fs.readFileSync(path.join(PREP, "data", f), "utf8"), ctx);
}

const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const looseSlug = (s) => String(s || "").toLowerCase().replace(/-a-/g, "-").replace(/-the-/g, "-").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const pack = {};
const report = { lc: [], gfg: [], miss: [] };

const gfgExact = [
  { keys: ["reverse a doubly linked list"], file: "reverse a doubly linked list" },
  { keys: ["bfs of graph", "bfs of a graph"], file: "bfs of graph" },
  { keys: ["dfs of graph", "dfs of a graph"], file: "dfs of graph" },
  { keys: ["second largest"], file: "second largest" },
  { keys: ["union of two sorted arrays", "union of 2 sorted arrays"], file: "union of 2 sorted arrays" },
  { keys: ["search in a linked list", "search in linked list"], file: "search in linked list" },
  { keys: ["reverse words in a string", "reverse words"], file: "reverse words" },
  { keys: ["largest element in an array", "largest in array"], file: "largest in array" },
  { keys: ["find length of loop", "length of loop"], file: "find length of loop" },
  { keys: ["subarray sum equals k", "subarray with given sum"], file: "subarray with given sum" },
  { keys: ["frog jump"], file: "frog jump" },
  { keys: ["detect cycle in an undirected graph", "undirected graph cycle", "cycle in undirected graph"], file: "undirected graph cycle" },
  { keys: ["number of connected components in an undirected graph", "number of connected components"], file: "number of connected components" },
  { keys: ["connected components in an undirected graph"], file: "connected components in an undirected graph" }
];

for (const [topicId, data] of Object.entries(ctx.window.PREP_DATA)) {
  if (!data || data.kind !== "dsa") continue;
  for (const q of data.questions || []) {
    const lc = (q.links || []).find((l) => /leetcode\.com\/problems\//.test(l.url || ""));
    const slug = lc ? (lc.url.match(/leetcode\.com\/problems\/([^/]+)/) || [])[1] : "";
    const titleN = norm(q.q);
    let hit = null;
    let via = "";
    if (slug && lcBySlug[slug]) {
      hit = lcBySlug[slug];
      via = "leetcode";
    } else if (slug) {
      const want = looseSlug(slug);
      const fuzzy = Object.values(lcBySlug).find((e) => looseSlug(e.slug) === want);
      if (fuzzy) {
        hit = fuzzy;
        via = "leetcode";
      }
    }
    if (!hit) {
      const gMeta = gfgExact.find((row) => row.keys.some((k) => {
        const nk = norm(k);
        return titleN === nk || titleN.startsWith(nk + " ") || nk.startsWith(titleN + " ");
      }));
      const g = gMeta && gfgEntries.find((e) => norm(e.title) === norm(gMeta.file));
      if (g) {
        hit = { slug: slug || g.key, source: "gfg", folder: g.title, codes: { [g.lang]: g.code } };
        via = "gfg";
      }
    }
    if (hit) {
      const key = slug || hit.slug;
      pack[key] = {
        q: q.q,
        topic: topicId,
        id: q.id,
        source: hit.source,
        folder: hit.folder,
        repo: hit.source === "gfg"
          ? "https://github.com/RAJA8112008/gfg-solutions"
          : `https://github.com/RAJA8112008/Leetcode/tree/main/${hit.folder}`,
        codes: hit.codes
      };
      if (slug && slug !== key) pack[slug] = pack[key];
      report[via === "gfg" ? "gfg" : "lc"].push(`${topicId} #${q.id} ${q.q}`);
    } else {
      report.miss.push(`${topicId} #${q.id} ${q.q}${slug ? " [" + slug + "]" : ""}`);
    }
  }
}

const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
const chunks = [];
chunks.push("window.RAJ_SOLUTIONS = {");
for (const [key, val] of Object.entries(pack)) {
  const codes = Object.entries(val.codes).map(([lang, src]) =>
    `      ${lang}: \`${esc(src)}\``
  ).join(",\n");
  chunks.push(`  ${JSON.stringify(key)}: {
    q: ${JSON.stringify(val.q)},
    topic: ${JSON.stringify(val.topic)},
    id: ${val.id},
    source: ${JSON.stringify(val.source)},
    folder: ${JSON.stringify(val.folder)},
    repo: ${JSON.stringify(val.repo)},
    codes: {
${codes}
    }
  },`);
}
chunks.push("};");
fs.writeFileSync(OUT, chunks.join("\n") + "\n");

console.log("wrote", OUT);
console.log("leetcode matches", report.lc.length);
console.log(report.lc.join("\n"));
console.log("\ngfg matches", report.gfg.length);
console.log(report.gfg.join("\n"));
console.log("\nno repo file", report.miss.length);
console.log(report.miss.slice(0, 40).join("\n"));
console.log("slugs in pack", Object.keys(pack).length);
