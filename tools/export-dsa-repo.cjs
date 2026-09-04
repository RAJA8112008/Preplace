const fs = require("fs");
const path = require("path");
const vm = require("vm");

const PREP = path.join(__dirname, "..");
const OUT = path.join(PREP, "..", "DSA");

const TOPICS = [
  { id: "dsa-arrays", folder: "01-arrays", title: "Arrays" },
  { id: "dsa-strings", folder: "02-strings", title: "Strings" },
  { id: "dsa-linkedlist", folder: "03-linked-list", title: "Linked List" },
  { id: "dsa-binarysearch", folder: "04-binary-search", title: "Binary Search" },
  { id: "dsa-stackheap", folder: "05-stack-queue-heap", title: "Stack, Queue & Heap" },
  { id: "dsa-tree", folder: "06-binary-trees", title: "Binary Trees" },
  { id: "dsa-bst", folder: "07-bst", title: "BST" },
  { id: "dsa-graph", folder: "08-graphs", title: "Graphs" },
  { id: "dsa-backtracking", folder: "09-backtracking", title: "Recursion & Backtracking" },
  { id: "dsa-trie", folder: "10-tries", title: "Tries" },
  { id: "dsa-dp", folder: "11-dynamic-programming", title: "Dynamic Programming" }
];

const LANGS = [
  { id: "javascript", file: "javascript.js", fence: "javascript" },
  { id: "python", file: "python.py", fence: "python" },
  { id: "java", file: "java.java", fence: "java" },
  { id: "cpp", file: "cpp.cpp", fence: "cpp" },
  { id: "c", file: "c.c", fence: "c" }
];

const slug = (s) => String(s)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "")
  .slice(0, 60);

const comment = (lang, text) => {
  const lines = String(text || "").split(/\r?\n/);
  if (lang === "python") return lines.map((l) => (l ? `# ${l}` : "#")).join("\n");
  return lines.map((l) => (l ? `// ${l}` : "//")).join("\n");
};

const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(PREP, "js/topics.js"), "utf8"), ctx);
for (const t of TOPICS) {
  const file = path.join(PREP, "data", `${t.id}.js`);
  vm.runInContext(fs.readFileSync(file, "utf8"), ctx);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

let total = 0;
const indexRows = [];

for (const topic of TOPICS) {
  const data = ctx.window.PREP_DATA[topic.id];
  if (!data) throw new Error("missing " + topic.id);
  const questions = data.questions || [];
  const topicDir = path.join(OUT, topic.folder);
  fs.mkdirSync(topicDir, { recursive: true });

  const list = [];
  for (const q of questions) {
    const folder = `${String(q.id).padStart(2, "0")}-${slug(q.q)}`;
    const dir = path.join(topicDir, folder);
    fs.mkdirSync(dir, { recursive: true });

    const links = (q.links || [])
      .map((l) => `- [${l.name}](${l.url})`)
      .join("\n");
    const methods = (q.solutions || []).map((s, i) => {
      return `### ${i + 1}. ${s.name}\n\n- **Time:** ${s.time || ""}\n- **Space:** ${s.space || ""}\n\n${s.why || ""}\n`;
    }).join("\n");

    const readme = `# ${q.q}\n\n` +
      `**Topic:** ${topic.title}  \n` +
      `**Level:** ${q.level || ""}  \n` +
      (q.ask ? `**Asked at:** ${q.ask}\n\n` : "\n") +
      (links ? `## Practice\n\n${links}\n\n` : "") +
      `## Problem\n\n${q.a || ""}\n\n` +
      `## Methods of solving\n\n${methods}\n` +
      `## Code files\n\n` +
      `- [javascript.js](./javascript.js)\n` +
      `- [python.py](./python.py)\n` +
      `- [java.java](./java.java)\n` +
      `- [cpp.cpp](./cpp.cpp)\n` +
      `- [c.c](./c.c)\n`;
    fs.writeFileSync(path.join(dir, "README.md"), readme);

    for (const lang of LANGS) {
      const parts = (q.solutions || []).map((s, i) => {
        const body = (s.codes && s.codes[lang.id]) || (lang.id === "javascript" ? s.code : "") || "";
        const head = comment(lang.id, `Method ${i + 1}: ${s.name}\nTime: ${s.time || ""} | Space: ${s.space || ""}\n${s.why || ""}`);
        return `${head}\n\n${body.trim()}\n`;
      });
      fs.writeFileSync(path.join(dir, lang.file), parts.join("\n\n"));
    }

    list.push(`| ${q.id} | [${q.q}](./${folder}/) | ${q.level || ""} | ${(q.solutions || []).map((s) => s.name).join(" → ")} |`);
    total++;
  }

  fs.writeFileSync(path.join(topicDir, "README.md"),
    `# ${topic.title}\n\n${questions.length} problems. Each folder has **Brute**, **Optimal**, and **More optimal** solutions in JavaScript, Python, Java, C++, and C.\n\n| # | Problem | Level | Methods |\n|---|---------|-------|--------|\n${list.join("\n")}\n`);

  indexRows.push(`| [${topic.title}](./${topic.folder}/) | ${questions.length} |`);
}

const rootReadme = `# DSA

Interview DSA solutions for [RAJA8112008](https://github.com/RAJA8112008).

Every problem folder has:

1. **README** — the problem, companies, LeetCode / GFG links, and the three methods
2. **Brute → Optimal → More optimal** code in **JavaScript, Python, Java, C++, and C**

## Topics

| Topic | Problems |
|-------|----------|
${indexRows.join("\n")}

**Total: ${total} problems**

## How to use

Open a topic, then a problem folder. Read the methods first, then pick a language file.

This repo is generated from the Preplace study site.
`;

fs.writeFileSync(path.join(OUT, "README.md"), rootReadme);
fs.writeFileSync(path.join(OUT, ".gitignore"), "node_modules/\n.DS_Store\nThumbs.db\n");
console.log("wrote", OUT, "problems", total);
