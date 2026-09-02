const { makeEx } = require("./dsa_emit.cjs");

const notes = [
  {
    title: "What a Trie is",
    body: "A trie (prefix tree) stores strings by sharing prefixes. The root is empty. Each edge is one character. The path from the root to a node is the prefix that node represents. Words that share a start share a path. apple and apply share a-p-p-l, then split. Lookups cost O(length), not O(dictionary size)."
  },
  {
    title: "Node: children and an end mark",
    body: "A node holds children (an array of 26 pointers, or a map) and a flag that says 'a word ends here'. The flag is required because app can sit on the path of apple. Without the flag, search cannot tell a full word from a prefix. Some problems also store a count, a leftover word, or a sum on the node."
  },
  {
    title: "Insert",
    body: "Walk one character at a time. If the child is missing, create it. At the last character, set end = true. Insert is O(L) time and may allocate O(L) new nodes in the worst case. Building a trie of n words whose longest length is L is O(total characters)."
  },
  {
    title: "search vs startsWith",
    body: "search walks the word and then checks the end flag. startsWith walks the prefix and only asks 'did every character exist?'. Same walk, different last question. Interviewers listen for that one-line difference. If the walk falls off a missing child, both return false."
  },
  {
    title: "Array[26] vs a map",
    body: "Lowercase English: children[ch.charCodeAt(0) - 97] is O(1) and cache-friendly. A hash map (or object) wins when the alphabet is huge or you only store a few branches. XOR tries use two children: bit 0 and bit 1. Say which you picked and why."
  },
  {
    title: "Prefix counts",
    body: "If every insert increments a counter on each node it touches, a node knows how many words pass through it. startsWith becomes 'is count > 0'. Trie II uses word count (how many words end here) and prefix count (how many words go through here). Erase decrements; drop a child when its prefix count hits 0."
  },
  {
    title: "DFS on a trie",
    body: "Word Search II, autocomplete, and longest-word-in-dictionary walk the trie the way you walk a tree. From a node you try each living child. On a board you also step to a neighbor cell. Store the word on the end node so you can emit it when you arrive. Prune empty branches after you collect a word."
  },
  {
    title: "Delete",
    body: "Deleting is not just clearing an end flag if other words sit below. Decrement counts on the path. If a node's prefix count becomes 0, unlink it from the parent. Recursion that returns 'this child is now empty' is the clean picture. Never free a node that still has a child word."
  },
  {
    title: "Binary trie (XOR)",
    body: "Numbers become 32-bit paths, high bit first. Two numbers' XOR is maximized by taking the opposite bit whenever that child exists. Insert every number, then for each number walk the trie greedily. Same insert/search shape as a string trie, but the alphabet size is 2."
  },
  {
    title: "Interview habit",
    body: "Draw the root and the first few branches before you type. State insert, search, and prefix in O(L). Mention extra memory. For board + dictionary problems, say brute (search each word on the board) then upgrade to one DFS that follows the trie. Then open Brute, Optimal, and More optimal."
  }
];

const examples = [
  makeEx(
    "1. Trie node",
    "What this is\nA trie node is a box of up to 26 children plus an end flag.\nIndex 0 is 'a', index 25 is 'z'.\n\nWhat the code is doing\ntrieNode makes an empty box. All 26 slots start as null. end is false, so this node is not a finished word yet.\nroot is the empty prefix, the door into the tree.\n\nWatch out\nForgetting the end flag makes search treat every prefix as a word.\nDo not reuse one shared empty array for every node.",
    {
      javascript: `function trieNode() {
  return { ch: Array(26).fill(null), end: false };
}

const root = trieNode();
console.log(root.end); // false
console.log(root.ch.length); // 26`,
      python: `def trieNode():
  return {"ch": [None] * 26, "end": False}

root = trieNode()
print(root["end"])  # False
print(len(root["ch"]))  # 26`,
      java: `class Solution {
  static class Node {
    Node[] ch = new Node[26];
    boolean end;
  }
  Node example() {
    Node root = new Node();
    // root.end == false, root.ch.length == 26
    return root;
  }
}`,
      cpp: `struct Node {
  Node* ch[26];
  bool end;
  Node() { end = false; for (int i = 0; i < 26; i++) ch[i] = nullptr; }
};
Node* example() {
  Node* root = new Node();
  return root;
}`,
      c: `#include <stdlib.h>
#include <stdbool.h>
typedef struct Node {
  struct Node* ch[26];
  int end;
} Node;
Node* trieNode(void) {
  Node* n = (Node*)calloc(1, sizeof(Node));
  return n;
}`
    }
  ),
  makeEx(
    "2. Insert a word",
    "What this is\nInsert walks one letter at a time and creates missing children.\nThe last node gets end = true.\n\nWhat the code is doing\nidx maps 'a'..'z' to 0..25.\nIf that child is missing, we make a new node.\ncur moves down. After the loop, cur.end marks a complete word.\n\nWatch out\nInserting app then apple is fine: apple extends the path and sets a deeper end.\nInserting apple then app only flips end on the p of app.",
    {
      javascript: `function trieNode() {
  return { ch: Array(26).fill(null), end: false };
}
function insert(root, word) {
  let cur = root;
  for (let i = 0; i < word.length; i++) {
    const idx = word.charCodeAt(i) - 97;
    if (!cur.ch[idx]) cur.ch[idx] = trieNode();
    cur = cur.ch[idx];
  }
  cur.end = true;
}

const root = trieNode();
insert(root, "app");
insert(root, "apple");`,
      python: `def trieNode():
  return {"ch": [None] * 26, "end": False}
def insert(root, word):
  cur = root
  for ch in word:
    idx = ord(ch) - 97
    if cur["ch"][idx] is None:
      cur["ch"][idx] = trieNode()
    cur = cur["ch"][idx]
  cur["end"] = True

root = trieNode()
insert(root, "app")
insert(root, "apple")`,
      java: `class Solution {
  static class Node {
    Node[] ch = new Node[26];
    boolean end;
  }
  void insert(Node root, String word) {
    Node cur = root;
    for (int i = 0; i < word.length(); i++) {
      int idx = word.charAt(i) - 'a';
      if (cur.ch[idx] == null) cur.ch[idx] = new Node();
      cur = cur.ch[idx];
    }
    cur.end = true;
  }
}`,
      cpp: `struct Node {
  Node* ch[26] = {};
  bool end = false;
};
void insert(Node* root, const string& word) {
  Node* cur = root;
  for (char c : word) {
    int idx = c - 'a';
    if (!cur->ch[idx]) cur->ch[idx] = new Node();
    cur = cur->ch[idx];
  }
  cur->end = true;
}`,
      c: `#include <stdlib.h>
typedef struct Node { struct Node* ch[26]; int end; } Node;
Node* trieNode(void) { return (Node*)calloc(1, sizeof(Node)); }
void insert(Node* root, const char* word) {
  Node* cur = root;
  for (int i = 0; word[i]; i++) {
    int idx = word[i] - 'a';
    if (!cur->ch[idx]) cur->ch[idx] = trieNode();
    cur = cur->ch[idx];
  }
  cur->end = 1;
}`
    }
  ),
  makeEx(
    "3. Search a full word",
    "What this is\nsearch asks: does this exact word sit in the trie?\nYou must land on a node whose end flag is true.\n\nWhat the code is doing\nWalk each letter. A missing child means the word was never inserted.\nAfter the last letter, return cur.end, not just true.\n\nWatch out\nAfter insert('apple'), search('app') is false until you also insert('app').\nThat is the whole point of the end flag.",
    {
      javascript: `function search(root, word) {
  let cur = root;
  for (let i = 0; i < word.length; i++) {
    const idx = word.charCodeAt(i) - 97;
    if (!cur.ch[idx]) return false;
    cur = cur.ch[idx];
  }
  return cur.end === true;
}`,
      python: `def search(root, word):
  cur = root
  for ch in word:
    idx = ord(ch) - 97
    if cur["ch"][idx] is None:
      return False
    cur = cur["ch"][idx]
  return cur["end"] is True`,
      java: `class Solution {
  static class Node {
    Node[] ch = new Node[26];
    boolean end;
  }
  boolean search(Node root, String word) {
    Node cur = root;
    for (int i = 0; i < word.length(); i++) {
      int idx = word.charAt(i) - 'a';
      if (cur.ch[idx] == null) return false;
      cur = cur.ch[idx];
    }
    return cur.end;
  }
}`,
      cpp: `bool search(Node* root, const string& word) {
  Node* cur = root;
  for (char c : word) {
    int idx = c - 'a';
    if (!cur->ch[idx]) return false;
    cur = cur->ch[idx];
  }
  return cur->end;
}`,
      c: `int search(Node* root, const char* word) {
  Node* cur = root;
  for (int i = 0; word[i]; i++) {
    int idx = word[i] - 'a';
    if (!cur->ch[idx]) return 0;
    cur = cur->ch[idx];
  }
  return cur->end;
}`
    }
  ),
  makeEx(
    "4. startsWith",
    "What this is\nstartsWith only asks whether the path exists.\nIt does not look at the end flag.\n\nWhat the code is doing\nSame walk as search. If every child exists, return true.\napp is a prefix of apple even when app itself is not a word.\n\nWatch out\nCopy-pasting search and forgetting to drop the end check is a common bug.",
    {
      javascript: `function startsWith(root, prefix) {
  let cur = root;
  for (let i = 0; i < prefix.length; i++) {
    const idx = prefix.charCodeAt(i) - 97;
    if (!cur.ch[idx]) return false;
    cur = cur.ch[idx];
  }
  return true;
}`,
      python: `def startsWith(root, prefix):
  cur = root
  for ch in prefix:
    idx = ord(ch) - 97
    if cur["ch"][idx] is None:
      return False
    cur = cur["ch"][idx]
  return True`,
      java: `class Solution {
  static class Node {
    Node[] ch = new Node[26];
    boolean end;
  }
  boolean startsWith(Node root, String prefix) {
    Node cur = root;
    for (int i = 0; i < prefix.length(); i++) {
      int idx = prefix.charAt(i) - 'a';
      if (cur.ch[idx] == null) return false;
      cur = cur.ch[idx];
    }
    return true;
  }
}`,
      cpp: `bool startsWith(Node* root, const string& prefix) {
  Node* cur = root;
  for (char c : prefix) {
    int idx = c - 'a';
    if (!cur->ch[idx]) return false;
    cur = cur->ch[idx];
  }
  return true;
}`,
      c: `int startsWith(Node* root, const char* prefix) {
  Node* cur = root;
  for (int i = 0; prefix[i]; i++) {
    int idx = prefix[i] - 'a';
    if (!cur->ch[idx]) return 0;
    cur = cur->ch[idx];
  }
  return 1;
}`
    }
  ),
  makeEx(
    "5. Prefix count on each node",
    "What this is\nEach node stores how many inserted words pass through it.\ncountWordsStartingWith is then just that number.\n\nWhat the code is doing\ninsert adds 1 to pref on every node it visits, then adds 1 to words at the end node.\ncountPref walks the prefix and returns cur.pref, or 0 if the path is missing.\n\nWatch out\nErase must decrement the same counters. If pref hits 0, you can drop the child.",
    {
      javascript: `function trieNode() {
  return { ch: Array(26).fill(null), pref: 0, words: 0 };
}
function insert(root, word) {
  let cur = root;
  for (let i = 0; i < word.length; i++) {
    const idx = word.charCodeAt(i) - 97;
    if (!cur.ch[idx]) cur.ch[idx] = trieNode();
    cur = cur.ch[idx];
    cur.pref++;
  }
  cur.words++;
}
function countPref(root, prefix) {
  let cur = root;
  for (let i = 0; i < prefix.length; i++) {
    const idx = prefix.charCodeAt(i) - 97;
    if (!cur.ch[idx]) return 0;
    cur = cur.ch[idx];
  }
  return cur.pref;
}`,
      python: `def trieNode():
  return {"ch": [None] * 26, "pref": 0, "words": 0}
def insert(root, word):
  cur = root
  for ch in word:
    idx = ord(ch) - 97
    if cur["ch"][idx] is None:
      cur["ch"][idx] = trieNode()
    cur = cur["ch"][idx]
    cur["pref"] += 1
  cur["words"] += 1
def countPref(root, prefix):
  cur = root
  for ch in prefix:
    idx = ord(ch) - 97
    if cur["ch"][idx] is None:
      return 0
    cur = cur["ch"][idx]
  return cur["pref"]`,
      java: `class Solution {
  static class Node {
    Node[] ch = new Node[26];
    int pref, words;
  }
  void insert(Node root, String word) {
    Node cur = root;
    for (int i = 0; i < word.length(); i++) {
      int idx = word.charAt(i) - 'a';
      if (cur.ch[idx] == null) cur.ch[idx] = new Node();
      cur = cur.ch[idx];
      cur.pref++;
    }
    cur.words++;
  }
  int countPref(Node root, String prefix) {
    Node cur = root;
    for (int i = 0; i < prefix.length(); i++) {
      int idx = prefix.charAt(i) - 'a';
      if (cur.ch[idx] == null) return 0;
      cur = cur.ch[idx];
    }
    return cur.pref;
  }
}`,
      cpp: `struct Node {
  Node* ch[26] = {};
  int pref = 0, words = 0;
};
void insert(Node* root, const string& word) {
  Node* cur = root;
  for (char c : word) {
    int idx = c - 'a';
    if (!cur->ch[idx]) cur->ch[idx] = new Node();
    cur = cur->ch[idx];
    cur->pref++;
  }
  cur->words++;
}
int countPref(Node* root, const string& prefix) {
  Node* cur = root;
  for (char c : prefix) {
    int idx = c - 'a';
    if (!cur->ch[idx]) return 0;
    cur = cur->ch[idx];
  }
  return cur->pref;
}`,
      c: `typedef struct Node { struct Node* ch[26]; int pref, words; } Node;
Node* trieNode(void) { return (Node*)calloc(1, sizeof(Node)); }
void insert(Node* root, const char* word) {
  Node* cur = root;
  for (int i = 0; word[i]; i++) {
    int idx = word[i] - 'a';
    if (!cur->ch[idx]) cur->ch[idx] = trieNode();
    cur = cur->ch[idx];
    cur->pref++;
  }
  cur->words++;
}
int countPref(Node* root, const char* prefix) {
  Node* cur = root;
  for (int i = 0; prefix[i]; i++) {
    int idx = prefix[i] - 'a';
    if (!cur->ch[idx]) return 0;
    cur = cur->ch[idx];
  }
  return cur->pref;
}`
    }
  ),
  makeEx(
    "6. List words with a DFS",
    "What this is\nFrom a node you can rebuild every word below it.\nAutocomplete and longest-word problems use this walk.\n\nWhat the code is doing\nIf end is true, path is a complete word, so we copy it into out.\nThen we try each of the 26 children, appending that letter, and recurse.\n\nWatch out\nMutating one shared string buffer is fine if you pop after the recursive call.\nHere we pass path + letter, which allocates, but the picture is clear.",
    {
      javascript: `function collect(node, path, out) {
  if (!node) return;
  if (node.end) out.push(path);
  for (let i = 0; i < 26; i++) {
    if (!node.ch[i]) continue;
    collect(node.ch[i], path + String.fromCharCode(97 + i), out);
  }
}`,
      python: `def collect(node, path, out):
  if node is None:
    return
  if node["end"]:
    out.append(path)
  for i in range(26):
    if node["ch"][i] is None:
      continue
    collect(node["ch"][i], path + chr(97 + i), out)`,
      java: `class Solution {
  static class Node {
    Node[] ch = new Node[26];
    boolean end;
  }
  void collect(Node node, String path, List<String> out) {
    if (node == null) return;
    if (node.end) out.add(path);
    for (int i = 0; i < 26; i++) {
      if (node.ch[i] == null) continue;
      collect(node.ch[i], path + (char) ('a' + i), out);
    }
  }
}`,
      cpp: `void collect(Node* node, string path, vector<string>& out) {
  if (!node) return;
  if (node->end) out.push_back(path);
  for (int i = 0; i < 26; i++) {
    if (!node->ch[i]) continue;
    collect(node->ch[i], path + char('a' + i), out);
  }
}`,
      c: `void collect(Node* node, char* path, int len, char out[][48], int* n) {
  int i;
  if (!node) return;
  if (node->end) {
    path[len] = 0;
    strcpy(out[*n], path);
    (*n)++;
  }
  for (i = 0; i < 26; i++) {
    if (!node->ch[i]) continue;
    path[len] = (char)('a' + i);
    collect(node->ch[i], path, len + 1, out, n);
  }
}`
    }
  ),
  makeEx(
    "7. Erase with counts",
    "What this is\nTrie II erase removes one copy of a word.\nYou decrement prefix counts on the path.\n\nWhat the code is doing\nIf the word is missing, do nothing.\nOtherwise walk again, subtract 1 from pref, and unlink a child whose pref hit 0.\nSubtract 1 from words at the end node.\n\nWatch out\nOnly erase words that were inserted. Searching first (or checking counts) avoids going negative.",
    {
      javascript: `function erase(root, word) {
  let cur = root;
  for (let i = 0; i < word.length; i++) {
    const idx = word.charCodeAt(i) - 97;
    if (!cur.ch[idx]) return;
    cur = cur.ch[idx];
  }
  if (cur.words === 0) return;
  cur = root;
  for (let i = 0; i < word.length; i++) {
    const idx = word.charCodeAt(i) - 97;
    const nxt = cur.ch[idx];
    nxt.pref--;
    if (nxt.pref === 0) {
      cur.ch[idx] = null;
      return;
    }
    cur = nxt;
  }
  cur.words--;
}`,
      python: `def erase(root, word):
  cur = root
  for ch in word:
    idx = ord(ch) - 97
    if cur["ch"][idx] is None:
      return
    cur = cur["ch"][idx]
  if cur["words"] == 0:
    return
  cur = root
  for ch in word:
    idx = ord(ch) - 97
    nxt = cur["ch"][idx]
    nxt["pref"] -= 1
    if nxt["pref"] == 0:
      cur["ch"][idx] = None
      return
    cur = nxt
  cur["words"] -= 1`,
      java: `class Solution {
  static class Node {
    Node[] ch = new Node[26];
    int pref, words;
  }
  void erase(Node root, String word) {
    Node cur = root;
    for (int i = 0; i < word.length(); i++) {
      int idx = word.charAt(i) - 'a';
      if (cur.ch[idx] == null) return;
      cur = cur.ch[idx];
    }
    if (cur.words == 0) return;
    cur = root;
    for (int i = 0; i < word.length(); i++) {
      int idx = word.charAt(i) - 'a';
      Node nxt = cur.ch[idx];
      nxt.pref--;
      if (nxt.pref == 0) { cur.ch[idx] = null; return; }
      cur = nxt;
    }
    cur.words--;
  }
}`,
      cpp: `void erase(Node* root, const string& word) {
  Node* cur = root;
  for (char c : word) {
    int idx = c - 'a';
    if (!cur->ch[idx]) return;
    cur = cur->ch[idx];
  }
  if (cur->words == 0) return;
  cur = root;
  for (char c : word) {
    int idx = c - 'a';
    Node* nxt = cur->ch[idx];
    nxt->pref--;
    if (nxt->pref == 0) { cur->ch[idx] = nullptr; return; }
    cur = nxt;
  }
  cur->words--;
}`,
      c: `void erase(Node* root, const char* word) {
  Node* cur = root;
  int i, idx;
  for (i = 0; word[i]; i++) {
    idx = word[i] - 'a';
    if (!cur->ch[idx]) return;
    cur = cur->ch[idx];
  }
  if (cur->words == 0) return;
  cur = root;
  for (i = 0; word[i]; i++) {
    idx = word[i] - 'a';
    Node* nxt = cur->ch[idx];
    nxt->pref--;
    if (nxt->pref == 0) { cur->ch[idx] = NULL; return; }
    cur = nxt;
  }
  cur->words--;
}`
    }
  ),
  makeEx(
    "8. Binary bit trie (XOR)",
    "What this is\nA number is a 32-bit path. Child 0 is bit 0, child 1 is bit 1.\nMaximum XOR walks the opposite bit when that child exists.\n\nWhat the code is doing\ninsert walks from bit 31 down to 0 and creates missing bit children.\nbestXor, for one number x, prefers the opposite bit at every step so the XOR grows.\n\nWatch out\nInsert every number before you query, or query as you go if the problem allows.\nSigned vs unsigned does not matter if you only use the low 31 bits as in the usual LC constraints.",
    {
      javascript: `function bitNode() {
  return { ch: [null, null] };
}
function insertNum(root, x) {
  let cur = root;
  for (let b = 31; b >= 0; b--) {
    const bit = (x >> b) & 1;
    if (!cur.ch[bit]) cur.ch[bit] = bitNode();
    cur = cur.ch[bit];
  }
}
function bestXor(root, x) {
  let cur = root;
  let ans = 0;
  for (let b = 31; b >= 0; b--) {
    const bit = (x >> b) & 1;
    const want = 1 - bit;
    if (cur.ch[want]) {
      ans |= (1 << b);
      cur = cur.ch[want];
    } else {
      cur = cur.ch[bit];
    }
  }
  return ans;
}`,
      python: `def bitNode():
  return {"ch": [None, None]}
def insertNum(root, x):
  cur = root
  for b in range(31, -1, -1):
    bit = (x >> b) & 1
    if cur["ch"][bit] is None:
      cur["ch"][bit] = bitNode()
    cur = cur["ch"][bit]
def bestXor(root, x):
  cur = root
  ans = 0
  for b in range(31, -1, -1):
    bit = (x >> b) & 1
    want = 1 - bit
    if cur["ch"][want] is not None:
      ans |= (1 << b)
      cur = cur["ch"][want]
    else:
      cur = cur["ch"][bit]
  return ans`,
      java: `class Solution {
  static class Node {
    Node[] ch = new Node[2];
  }
  void insertNum(Node root, int x) {
    Node cur = root;
    for (int b = 31; b >= 0; b--) {
      int bit = (x >> b) & 1;
      if (cur.ch[bit] == null) cur.ch[bit] = new Node();
      cur = cur.ch[bit];
    }
  }
  int bestXor(Node root, int x) {
    Node cur = root;
    int ans = 0;
    for (int b = 31; b >= 0; b--) {
      int bit = (x >> b) & 1;
      int want = 1 - bit;
      if (cur.ch[want] != null) {
        ans |= (1 << b);
        cur = cur.ch[want];
      } else cur = cur.ch[bit];
    }
    return ans;
  }
}`,
      cpp: `struct BitNode {
  BitNode* ch[2] = {};
};
void insertNum(BitNode* root, int x) {
  BitNode* cur = root;
  for (int b = 31; b >= 0; b--) {
    int bit = (x >> b) & 1;
    if (!cur->ch[bit]) cur->ch[bit] = new BitNode();
    cur = cur->ch[bit];
  }
}
int bestXor(BitNode* root, int x) {
  BitNode* cur = root;
  int ans = 0;
  for (int b = 31; b >= 0; b--) {
    int bit = (x >> b) & 1;
    int want = 1 - bit;
    if (cur->ch[want]) { ans |= (1 << b); cur = cur->ch[want]; }
    else cur = cur->ch[bit];
  }
  return ans;
}`,
      c: `typedef struct BitNode { struct BitNode* ch[2]; } BitNode;
BitNode* bitNode(void) { return (BitNode*)calloc(1, sizeof(BitNode)); }
void insertNum(BitNode* root, int x) {
  BitNode* cur = root;
  int b;
  for (b = 31; b >= 0; b--) {
    int bit = (x >> b) & 1;
    if (!cur->ch[bit]) cur->ch[bit] = bitNode();
    cur = cur->ch[bit];
  }
}
int bestXor(BitNode* root, int x) {
  BitNode* cur = root;
  int ans = 0, b;
  for (b = 31; b >= 0; b--) {
    int bit = (x >> b) & 1;
    int want = 1 - bit;
    if (cur->ch[want]) { ans |= (1 << b); cur = cur->ch[want]; }
    else cur = cur->ch[bit];
  }
  return ans;
}`
    }
  )
];

module.exports = { notes, examples };
