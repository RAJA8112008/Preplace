"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { emitPack, emitExample, emitQuestion } = require("./emit_dsa.cjs");

const root = path.join(__dirname, "..");

const { notes: bstNotes, examples: bstExamples } = require("./bst_meta.cjs");
const bstQuestions = []
  .concat(require("./bst_q1.cjs"))
  .concat(require("./bst_q2.cjs"))
  .concat(require("./bst_q3.cjs"))
  .concat(require("./bst_q4.cjs"))
  .concat(require("./bst_q5.cjs"))
  .concat(require("./bst_q6.cjs"));

const { notes: treeNotes, examples: treeExamples } = require("./tree_meta.cjs");
const treeQuestions = []
  .concat(require("./tree_q1.cjs"))
  .concat(require("./tree_q2.cjs"))
  .concat(require("./tree_q3.cjs"))
  .concat(require("./tree_q4.cjs"))
  .concat(require("./tree_q5.cjs"))
  .concat(require("./tree_q6.cjs"));

function verifyPack(src, key) {
  const ctx = { window: { PREP_DATA: {} } };
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  const pack = ctx.window.PREP_DATA[key];
  if (!pack) throw new Error("missing pack " + key);
  const bad = [];
  const unesc = /(?<!\\)\$\{/;
  if (unesc.test(src)) bad.push("unescaped ${");
  (pack.examples || []).forEach((ex, i) => {
    if (!ex.codes || !ex.codes.javascript) bad.push("example " + i + " missing codes");
    if (ex.code !== ex.codes.javascript) bad.push("example " + i + " js mismatch");
  });
  (pack.questions || []).forEach((q) => {
    if (!q.solutions || q.solutions.length !== 3) bad.push("q" + q.id + " need 3 solutions");
    else {
      const names = q.solutions.map((s) => s.name);
      if (names[0] !== "Brute" || names[1] !== "Optimal" || names[2] !== "More optimal") {
        bad.push("q" + q.id + " names " + names.join(","));
      }
    }
    (q.solutions || []).forEach((s) => {
      ["javascript", "python", "java", "cpp", "c"].forEach((k) => {
        if (!s.codes || !String(s.codes[k] || "").trim()) bad.push("q" + q.id + " " + s.name + " empty " + k);
      });
      if (s.code !== s.codes.javascript) bad.push("q" + q.id + " " + s.name + " js mismatch");
    });
  });
  return { notes: pack.notes.length, examples: pack.examples.length, questions: pack.questions.length, ids: pack.questions.map((q) => q.id), bad };
}

if (bstQuestions.length !== 18) throw new Error("bst questions " + bstQuestions.length);
if (treeQuestions.length !== 12) throw new Error("tree extra questions " + treeQuestions.length);

const bstSrc = emitPack("dsa-bst", {
  notes: bstNotes,
  examples: bstExamples,
  questions: bstQuestions
});
const bstPath = path.join(root, "data", "dsa-bst.js");
fs.writeFileSync(bstPath, bstSrc);
const bstV = verifyPack(bstSrc, "dsa-bst");
console.log("dsa-bst", JSON.stringify(bstV, null, 2));
if (bstV.bad.length) throw new Error("bst verify failed");

const treePath = path.join(root, "data", "dsa-tree.js");
let treeSrc = fs.readFileSync(treePath, "utf8");

if (treeSrc.includes('"Views of a tree"') || treeSrc.includes("title: \"Views of a tree\"")) {
  throw new Error("tree file already has extra notes; refusing to double-append");
}

const noteBlob = treeNotes
  .map((n) => "    {\n      title: " + JSON.stringify(n.title) + ",\n      body: " + JSON.stringify(n.body) + "\n    }")
  .join(",\n");

const noteAnchor = `      title: "Interview habit",
      body: "Draw the tiny tree from the prompt. Say the traversal. State the null base. Mention extra arrays vs O(h) stack vs Morris O(1). For construct-from-traversals, show the preorder root and the inorder split. Then open the Brute, Optimal, and More optimal tabs."
    }
  ],`;
if (!treeSrc.includes(noteAnchor)) throw new Error("could not find interview habit notes anchor");
treeSrc = treeSrc.replace(
  noteAnchor,
  `      title: "Interview habit",
      body: "Draw the tiny tree from the prompt. Say the traversal. State the null base. Mention extra arrays vs O(h) stack vs Morris O(1). For construct-from-traversals, show the preorder root and the inorder split. Then open the Brute, Optimal, and More optimal tabs."
    },
${noteBlob}
  ],`
);

const exampleBlob = treeExamples.map(emitExample).join(",\n");
const exAnchor = "    }\n  ],\n  questions: [";
const exPos = treeSrc.lastIndexOf(exAnchor);
if (exPos < 0) throw new Error("could not find examples close");
treeSrc = treeSrc.slice(0, exPos) + "    },\n" + exampleBlob + "\n  ],\n  questions: [" + treeSrc.slice(exPos + exAnchor.length);

const qBlob = treeQuestions.map(emitQuestion).join(",\n");
if (!treeSrc.endsWith("    }\n  ]\n};\n") && !treeSrc.endsWith("    }\n  ]\n};")) {
  const tail = treeSrc.slice(-40);
  throw new Error("unexpected tree tail: " + JSON.stringify(tail));
}
treeSrc = treeSrc.replace(/\s*\]\n};\s*$/, ",\n" + qBlob + "\n  ]\n};\n");

fs.writeFileSync(treePath, treeSrc);
const treeV = verifyPack(treeSrc, "dsa-tree");
console.log("dsa-tree", JSON.stringify(treeV, null, 2));
if (treeV.bad.length) throw new Error("tree verify failed");
if (treeV.questions !== 32) throw new Error("expected 32 tree questions, got " + treeV.questions);
