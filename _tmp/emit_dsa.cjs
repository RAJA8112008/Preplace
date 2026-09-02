"use strict";

function tick(s) {
  return "`" + String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";
}

function indentBlock(s, n) {
  const pad = " ".repeat(n);
  return String(s).split("\n").map((line) => (line.length ? pad + line : line)).join("\n");
}

function emitCodes(codes, pad) {
  const keys = ["javascript", "python", "java", "cpp", "c"];
  let out = pad + "codes: {\n";
  keys.forEach((k, i) => {
    out += pad + "  " + k + ": " + tick(codes[k]);
    out += i === keys.length - 1 ? "\n" : ",\n";
  });
  out += pad + "}";
  return out;
}

function emitExample(ex) {
  let out = "    {\n";
  out += "      lang: " + JSON.stringify(ex.lang || "js") + ",\n";
  out += "      title: " + JSON.stringify(ex.title) + ",\n";
  out += "      desc: " + JSON.stringify(ex.desc) + ",\n";
  out += "      code: " + tick(ex.code) + ",\n";
  out += emitCodes(ex.codes, "      ") + "\n";
  out += "    }";
  return out;
}

function emitSolution(s) {
  let out = "        {\n";
  out += "          name: " + JSON.stringify(s.name) + ",\n";
  out += "          time: " + JSON.stringify(s.time) + ",\n";
  out += "          space: " + JSON.stringify(s.space) + ",\n";
  out += "          why: " + JSON.stringify(s.why) + ",\n";
  out += "          code: " + tick(s.code) + ",\n";
  out += emitCodes(s.codes, "          ") + "\n";
  out += "        }";
  return out;
}

function emitQuestion(q) {
  let out = "    {\n";
  out += "      id: " + q.id + ",\n";
  out += "      level: " + JSON.stringify(q.level) + ",\n";
  out += "      q: " + JSON.stringify(q.q) + ",\n";
  out += "      ask: " + JSON.stringify(q.ask) + ",\n";
  out += "      links: " + JSON.stringify(q.links) + ",\n";
  out += "      a: " + JSON.stringify(q.a) + ",\n";
  out += "      solutions: [\n";
  out += q.solutions.map(emitSolution).join(",\n") + "\n";
  out += "      ]\n";
  out += "    }";
  return out;
}

function emitPack(key, pack) {
  let out = "window.PREP_DATA = window.PREP_DATA || {};\n";
  out += "window.PREP_DATA[" + JSON.stringify(key) + "] = {\n";
  out += '  kind: "dsa",\n';
  out += "  notes: [\n";
  out += pack.notes
    .map((n) => "    {\n      title: " + JSON.stringify(n.title) + ",\n      body: " + JSON.stringify(n.body) + "\n    }")
    .join(",\n") + "\n";
  out += "  ],\n";
  out += "  examples: [\n";
  out += pack.examples.map(emitExample).join(",\n") + "\n";
  out += "  ],\n";
  out += "  questions: [\n";
  out += pack.questions.map(emitQuestion).join(",\n") + "\n";
  out += "  ]\n";
  out += "};\n";
  return out;
}

const JS_TN = `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}`;

const PY_TN = `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
`;

const JAVA_TN = `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}
`;

const CPP_TN = `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};
`;

const C_TN = `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}
`;

const JS_LN = `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}`;

const PY_LN = `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
`;

const JAVA_LN = `class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}
`;

const CPP_LN = `struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};
`;

const C_LN = `struct ListNode {
    int val;
    struct ListNode* next;
};

struct ListNode* newListNode(int val) {
    struct ListNode* n = (struct ListNode*)malloc(sizeof(struct ListNode));
    n->val = val;
    n->next = NULL;
    return n;
}
`;

const JS_NN = `function Node(val, left, right, next) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
  this.next = next === undefined ? null : next;
}`;

const PY_NN = `class Node:
    def __init__(self, val=0, left=None, right=None, next=None):
        self.val = val
        self.left = left
        self.right = right
        self.next = next
`;

const JAVA_NN = `import java.util.*;

class Node {
    int val;
    Node left;
    Node right;
    Node next;
    Node() {}
    Node(int val) { this.val = val; }
    Node(int val, Node left, Node right, Node next) {
        this.val = val; this.left = left; this.right = right; this.next = next;
    }
}
`;

const CPP_NN = `#include <bits/stdc++.h>
using namespace std;

class Node {
public:
    int val;
    Node* left;
    Node* right;
    Node* next;
    Node() : val(0), left(NULL), right(NULL), next(NULL) {}
    Node(int _val) : val(_val), left(NULL), right(NULL), next(NULL) {}
    Node(int _val, Node* _left, Node* _right, Node* _next)
        : val(_val), left(_left), right(_right), next(_next) {}
};
`;

const C_NN = `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    n->next = NULL;
    return n;
}
`;

function block(js, py, java, cpp, c) {
  return {
    code: js,
    codes: { javascript: js, python: py, java, cpp, c }
  };
}

function tn(js, py, javaMethods, cpp, c) {
  return block(
    JS_TN + "\n\n" + js,
    PY_TN + py,
    JAVA_TN + "\nclass Solution {\n" + javaMethods + "\n}",
    CPP_TN + "\n" + cpp,
    C_TN + "\n" + c
  );
}

function tnJavaFull(js, py, javaFull, cpp, c) {
  return block(JS_TN + "\n\n" + js, PY_TN + py, javaFull, CPP_TN + "\n" + cpp, C_TN + "\n" + c);
}

function sol(name, time, space, why, langs) {
  return { name, time, space, why, code: langs.code, codes: langs.codes };
}

function LC(slug) {
  return { name: "LeetCode", url: "https://leetcode.com/problems/" + slug + "/" };
}
function GFG(slug) {
  return { name: "GFG", url: "https://www.geeksforgeeks.org/problems/" + slug + "/1" };
}
function GFG_ART(slug) {
  return { name: "GFG", url: "https://www.geeksforgeeks.org/" + slug + "/" };
}

function desc(what, doing, watch) {
  return "What this is\n" + what + "\n\nWhat the code is doing\n" + doing + "\n\nWatch out\n" + watch;
}

module.exports = {
  tick,
  indentBlock,
  emitPack,
  emitExample,
  emitQuestion,
  emitSolution,
  JS_TN,
  PY_TN,
  JAVA_TN,
  CPP_TN,
  C_TN,
  JS_LN,
  PY_LN,
  JAVA_LN,
  CPP_LN,
  C_LN,
  JS_NN,
  PY_NN,
  JAVA_NN,
  CPP_NN,
  C_NN,
  block,
  tn,
  tnJavaFull,
  sol,
  LC,
  GFG,
  GFG_ART,
  desc
};
