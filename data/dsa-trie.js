window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["dsa-trie"] = {
  kind: "dsa",
  notes: [
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
  ],
  examples: [
    {
      lang: "js",
      title: "1. Trie node",
      desc: "What this is\nA trie node is a box of up to 26 children plus an end flag.\nIndex 0 is 'a', index 25 is 'z'.\n\nWhat the code is doing\ntrieNode makes an empty box. All 26 slots start as null. end is false, so this node is not a finished word yet.\nroot is the empty prefix, the door into the tree.\n\nWatch out\nForgetting the end flag makes search treat every prefix as a word.\nDo not reuse one shared empty array for every node.",
      code: `function trieNode() {
  return { ch: Array(26).fill(null), end: false };
}

const root = trieNode();
console.log(root.end); // false
console.log(root.ch.length); // 26`,
      codes: {
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
    },
    {
      lang: "js",
      title: "2. Insert a word",
      desc: "What this is\nInsert walks one letter at a time and creates missing children.\nThe last node gets end = true.\n\nWhat the code is doing\nidx maps 'a'..'z' to 0..25.\nIf that child is missing, we make a new node.\ncur moves down. After the loop, cur.end marks a complete word.\n\nWatch out\nInserting app then apple is fine: apple extends the path and sets a deeper end.\nInserting apple then app only flips end on the p of app.",
      code: `function trieNode() {
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
      codes: {
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
    },
    {
      lang: "js",
      title: "3. Search a full word",
      desc: "What this is\nsearch asks: does this exact word sit in the trie?\nYou must land on a node whose end flag is true.\n\nWhat the code is doing\nWalk each letter. A missing child means the word was never inserted.\nAfter the last letter, return cur.end, not just true.\n\nWatch out\nAfter insert('apple'), search('app') is false until you also insert('app').\nThat is the whole point of the end flag.",
      code: `function search(root, word) {
  let cur = root;
  for (let i = 0; i < word.length; i++) {
    const idx = word.charCodeAt(i) - 97;
    if (!cur.ch[idx]) return false;
    cur = cur.ch[idx];
  }
  return cur.end === true;
}`,
      codes: {
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
    },
    {
      lang: "js",
      title: "4. startsWith",
      desc: "What this is\nstartsWith only asks whether the path exists.\nIt does not look at the end flag.\n\nWhat the code is doing\nSame walk as search. If every child exists, return true.\napp is a prefix of apple even when app itself is not a word.\n\nWatch out\nCopy-pasting search and forgetting to drop the end check is a common bug.",
      code: `function startsWith(root, prefix) {
  let cur = root;
  for (let i = 0; i < prefix.length; i++) {
    const idx = prefix.charCodeAt(i) - 97;
    if (!cur.ch[idx]) return false;
    cur = cur.ch[idx];
  }
  return true;
}`,
      codes: {
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
    },
    {
      lang: "js",
      title: "5. Prefix count on each node",
      desc: "What this is\nEach node stores how many inserted words pass through it.\ncountWordsStartingWith is then just that number.\n\nWhat the code is doing\ninsert adds 1 to pref on every node it visits, then adds 1 to words at the end node.\ncountPref walks the prefix and returns cur.pref, or 0 if the path is missing.\n\nWatch out\nErase must decrement the same counters. If pref hits 0, you can drop the child.",
      code: `function trieNode() {
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
      codes: {
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
    },
    {
      lang: "js",
      title: "6. List words with a DFS",
      desc: "What this is\nFrom a node you can rebuild every word below it.\nAutocomplete and longest-word problems use this walk.\n\nWhat the code is doing\nIf end is true, path is a complete word, so we copy it into out.\nThen we try each of the 26 children, appending that letter, and recurse.\n\nWatch out\nMutating one shared string buffer is fine if you pop after the recursive call.\nHere we pass path + letter, which allocates, but the picture is clear.",
      code: `function collect(node, path, out) {
  if (!node) return;
  if (node.end) out.push(path);
  for (let i = 0; i < 26; i++) {
    if (!node.ch[i]) continue;
    collect(node.ch[i], path + String.fromCharCode(97 + i), out);
  }
}`,
      codes: {
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
    },
    {
      lang: "js",
      title: "7. Erase with counts",
      desc: "What this is\nTrie II erase removes one copy of a word.\nYou decrement prefix counts on the path.\n\nWhat the code is doing\nIf the word is missing, do nothing.\nOtherwise walk again, subtract 1 from pref, and unlink a child whose pref hit 0.\nSubtract 1 from words at the end node.\n\nWatch out\nOnly erase words that were inserted. Searching first (or checking counts) avoids going negative.",
      code: `function erase(root, word) {
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
      codes: {
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
    },
    {
      lang: "js",
      title: "8. Binary bit trie (XOR)",
      desc: "What this is\nA number is a 32-bit path. Child 0 is bit 0, child 1 is bit 1.\nMaximum XOR walks the opposite bit when that child exists.\n\nWhat the code is doing\ninsert walks from bit 31 down to 0 and creates missing bit children.\nbestXor, for one number x, prefers the opposite bit at every step so the XOR grows.\n\nWatch out\nInsert every number before you query, or query as you go if the problem allows.\nSigned vs unsigned does not matter if you only use the low 31 bits as in the usual LC constraints.",
      code: `function bitNode() {
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
      codes: {
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
    }
  ],
  questions: [
    {
      id: 1,
      level: "beginner",
      q: "Implement Trie (Prefix Tree)",
      ask: "Amazon · Google · Microsoft · Meta",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/implement-trie-prefix-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/trie-insert-and-search095/1"}],
      a: "Build a trie that supports insert(word), search(word), and startsWith(prefix). search is true only for a full inserted word. startsWith is true if any inserted word begins with that prefix.\n\nExample: insert apple, search apple is true, search app is false, startsWith app is true, then insert app and search app becomes true.\n\nBrute stores the raw list. Optimal stores every prefix in a set. More optimal is the real 26-way trie.",
      solutions: [
        {
          name: "Brute",
          time: "O(n L) search",
          space: "O(n L)",
          why: "Keep every inserted string in an array. search and startsWith scan the whole list. Correct, and fine for tiny dictionaries, but not the point of the problem.",
          code: `function Trie() {
  this.words = [];
}
Trie.prototype.insert = function (word) {
  this.words.push(word);
};
Trie.prototype.search = function (word) {
  for (let i = 0; i < this.words.length; i++) {
    if (this.words[i] === word) return true;
  }
  return false;
};
Trie.prototype.startsWith = function (prefix) {
  const n = prefix.length;
  for (let i = 0; i < this.words.length; i++) {
    const w = this.words[i];
    if (w.length >= n && w.slice(0, n) === prefix) return true;
  }
  return false;
};`,
          codes: {
            javascript: `function Trie() {
  this.words = [];
}
Trie.prototype.insert = function (word) {
  this.words.push(word);
};
Trie.prototype.search = function (word) {
  for (let i = 0; i < this.words.length; i++) {
    if (this.words[i] === word) return true;
  }
  return false;
};
Trie.prototype.startsWith = function (prefix) {
  const n = prefix.length;
  for (let i = 0; i < this.words.length; i++) {
    const w = this.words[i];
    if (w.length >= n && w.slice(0, n) === prefix) return true;
  }
  return false;
};`,
            python: `class Trie:
  def __init__(self):
    self.words = []
  def insert(self, word):
    self.words.append(word)
  def search(self, word):
    for w in self.words:
      if w == word:
        return True
    return False
  def startsWith(self, prefix):
    n = len(prefix)
    for w in self.words:
      if len(w) >= n and w[:n] == prefix:
        return True
    return False`,
            java: `import java.util.*;
class Trie {
  List<String> words = new ArrayList<String>();
  public void insert(String word) { words.add(word); }
  public boolean search(String word) {
    for (String w : words) if (w.equals(word)) return true;
    return false;
  }
  public boolean startsWith(String prefix) {
    for (String w : words) if (w.startsWith(prefix)) return true;
    return false;
  }
}`,
            cpp: `struct Trie {
  vector<string> words;
  void insert(string word) { words.push_back(word); }
  bool search(string word) {
    for (auto& w : words) if (w == word) return true;
    return false;
  }
  bool startsWith(string prefix) {
    int n = (int)prefix.size();
    for (auto& w : words)
      if ((int)w.size() >= n && w.compare(0, n, prefix) == 0) return true;
    return false;
  }
};`,
            c: `typedef struct {
  char words[256][48];
  int n;
} Trie;
void insert(Trie* t, const char* word) {
  strcpy(t->words[t->n++], word);
}
int search(Trie* t, const char* word) {
  int i;
  for (i = 0; i < t->n; i++) if (strcmp(t->words[i], word) == 0) return 1;
  return 0;
}
int startsWith(Trie* t, const char* prefix) {
  int i, n = (int)strlen(prefix);
  for (i = 0; i < t->n; i++)
    if ((int)strlen(t->words[i]) >= n && strncmp(t->words[i], prefix, n) == 0) return 1;
  return 0;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(L)",
          space: "O(n L)",
          why: "A set of full words plus a set of every prefix. Each call is a hash lookup. Extra memory stores every prefix string, which a trie shares instead.",
          code: `function Trie() {
  this.words = Object.create(null);
  this.prefs = Object.create(null);
}
Trie.prototype.insert = function (word) {
  this.words[word] = true;
  let p = "";
  for (let i = 0; i < word.length; i++) {
    p += word[i];
    this.prefs[p] = true;
  }
};
Trie.prototype.search = function (word) {
  return this.words[word] === true;
};
Trie.prototype.startsWith = function (prefix) {
  return this.prefs[prefix] === true;
};`,
          codes: {
            javascript: `function Trie() {
  this.words = Object.create(null);
  this.prefs = Object.create(null);
}
Trie.prototype.insert = function (word) {
  this.words[word] = true;
  let p = "";
  for (let i = 0; i < word.length; i++) {
    p += word[i];
    this.prefs[p] = true;
  }
};
Trie.prototype.search = function (word) {
  return this.words[word] === true;
};
Trie.prototype.startsWith = function (prefix) {
  return this.prefs[prefix] === true;
};`,
            python: `class Trie:
  def __init__(self):
    self.words = set()
    self.prefs = set()
  def insert(self, word):
    self.words.add(word)
    p = ""
    for ch in word:
      p += ch
      self.prefs.add(p)
  def search(self, word):
    return word in self.words
  def startsWith(self, prefix):
    return prefix in self.prefs`,
            java: `import java.util.*;
class Trie {
  Set<String> words = new HashSet<String>();
  Set<String> prefs = new HashSet<String>();
  public void insert(String word) {
    words.add(word);
    StringBuilder p = new StringBuilder();
    for (int i = 0; i < word.length(); i++) {
      p.append(word.charAt(i));
      prefs.add(p.toString());
    }
  }
  public boolean search(String word) { return words.contains(word); }
  public boolean startsWith(String prefix) { return prefs.contains(prefix); }
}`,
            cpp: `struct Trie {
  unordered_set<string> words, prefs;
  void insert(string word) {
    words.insert(word);
    string p;
    for (char c : word) { p += c; prefs.insert(p); }
  }
  bool search(string word) { return words.count(word); }
  bool startsWith(string prefix) { return prefs.count(prefix); }
};`,
            c: `/* two parallel string tables stand in for hash sets */
typedef struct {
  char words[256][48]; int wn;
  char prefs[2048][48]; int pn;
} Trie;
static int has(char a[][48], int n, const char* s) {
  int i; for (i = 0; i < n; i++) if (strcmp(a[i], s) == 0) return 1; return 0;
}
void insert(Trie* t, const char* word) {
  char p[48]; int i, k = 0;
  strcpy(t->words[t->wn++], word);
  p[0] = 0;
  for (i = 0; word[i]; i++) {
    p[k++] = word[i]; p[k] = 0;
    if (!has(t->prefs, t->pn, p)) strcpy(t->prefs[t->pn++], p);
  }
}
int search(Trie* t, const char* word) { return has(t->words, t->wn, word); }
int startsWith(Trie* t, const char* prefix) { return has(t->prefs, t->pn, prefix); }`
          }
        },
        {
          name: "More optimal",
          time: "O(L)",
          space: "O(n L) shared",
          why: "Real trie. Shared prefixes share nodes. insert, search, and startsWith each walk L children. This is the expected interview finish.",
          code: `function Trie() {
  this.root = { ch: Array(26).fill(null), end: false };
}
Trie.prototype.insert = function (word) {
  let cur = this.root;
  for (let i = 0; i < word.length; i++) {
    const idx = word.charCodeAt(i) - 97;
    if (!cur.ch[idx]) cur.ch[idx] = { ch: Array(26).fill(null), end: false };
    cur = cur.ch[idx];
  }
  cur.end = true;
};
Trie.prototype.search = function (word) {
  let cur = this.root;
  for (let i = 0; i < word.length; i++) {
    const idx = word.charCodeAt(i) - 97;
    if (!cur.ch[idx]) return false;
    cur = cur.ch[idx];
  }
  return cur.end === true;
};
Trie.prototype.startsWith = function (prefix) {
  let cur = this.root;
  for (let i = 0; i < prefix.length; i++) {
    const idx = prefix.charCodeAt(i) - 97;
    if (!cur.ch[idx]) return false;
    cur = cur.ch[idx];
  }
  return true;
};`,
          codes: {
            javascript: `function Trie() {
  this.root = { ch: Array(26).fill(null), end: false };
}
Trie.prototype.insert = function (word) {
  let cur = this.root;
  for (let i = 0; i < word.length; i++) {
    const idx = word.charCodeAt(i) - 97;
    if (!cur.ch[idx]) cur.ch[idx] = { ch: Array(26).fill(null), end: false };
    cur = cur.ch[idx];
  }
  cur.end = true;
};
Trie.prototype.search = function (word) {
  let cur = this.root;
  for (let i = 0; i < word.length; i++) {
    const idx = word.charCodeAt(i) - 97;
    if (!cur.ch[idx]) return false;
    cur = cur.ch[idx];
  }
  return cur.end === true;
};
Trie.prototype.startsWith = function (prefix) {
  let cur = this.root;
  for (let i = 0; i < prefix.length; i++) {
    const idx = prefix.charCodeAt(i) - 97;
    if (!cur.ch[idx]) return false;
    cur = cur.ch[idx];
  }
  return true;
};`,
            python: `class Node:
  def __init__(self):
    self.ch = [None] * 26
    self.end = False
class Trie:
  def __init__(self):
    self.root = Node()
  def insert(self, word):
    cur = self.root
    for ch in word:
      idx = ord(ch) - 97
      if cur.ch[idx] is None:
        cur.ch[idx] = Node()
      cur = cur.ch[idx]
    cur.end = True
  def search(self, word):
    cur = self.root
    for ch in word:
      idx = ord(ch) - 97
      if cur.ch[idx] is None:
        return False
      cur = cur.ch[idx]
    return cur.end
  def startsWith(self, prefix):
    cur = self.root
    for ch in prefix:
      idx = ord(ch) - 97
      if cur.ch[idx] is None:
        return False
      cur = cur.ch[idx]
    return True`,
            java: `class Trie {
  static class Node {
    Node[] ch = new Node[26];
    boolean end;
  }
  Node root = new Node();
  public void insert(String word) {
    Node cur = root;
    for (int i = 0; i < word.length(); i++) {
      int idx = word.charAt(i) - 'a';
      if (cur.ch[idx] == null) cur.ch[idx] = new Node();
      cur = cur.ch[idx];
    }
    cur.end = true;
  }
  public boolean search(String word) {
    Node cur = root;
    for (int i = 0; i < word.length(); i++) {
      int idx = word.charAt(i) - 'a';
      if (cur.ch[idx] == null) return false;
      cur = cur.ch[idx];
    }
    return cur.end;
  }
  public boolean startsWith(String prefix) {
    Node cur = root;
    for (int i = 0; i < prefix.length(); i++) {
      int idx = prefix.charAt(i) - 'a';
      if (cur.ch[idx] == null) return false;
      cur = cur.ch[idx];
    }
    return true;
  }
}`,
            cpp: `struct Trie {
  struct Node { Node* ch[26] = {}; bool end = false; };
  Node* root = new Node();
  void insert(string word) {
    Node* cur = root;
    for (char c : word) {
      int idx = c - 'a';
      if (!cur->ch[idx]) cur->ch[idx] = new Node();
      cur = cur->ch[idx];
    }
    cur->end = true;
  }
  bool search(string word) {
    Node* cur = root;
    for (char c : word) {
      int idx = c - 'a';
      if (!cur->ch[idx]) return false;
      cur = cur->ch[idx];
    }
    return cur->end;
  }
  bool startsWith(string prefix) {
    Node* cur = root;
    for (char c : prefix) {
      int idx = c - 'a';
      if (!cur->ch[idx]) return false;
      cur = cur->ch[idx];
    }
    return true;
  }
};`,
            c: `typedef struct Node { struct Node* ch[26]; int end; } Node;
typedef struct { Node* root; } Trie;
Node* newNode(void) { return (Node*)calloc(1, sizeof(Node)); }
void trieInit(Trie* t) { t->root = newNode(); }
void insert(Trie* t, const char* word) {
  Node* cur = t->root;
  int i;
  for (i = 0; word[i]; i++) {
    int idx = word[i] - 'a';
    if (!cur->ch[idx]) cur->ch[idx] = newNode();
    cur = cur->ch[idx];
  }
  cur->end = 1;
}
int search(Trie* t, const char* word) {
  Node* cur = t->root;
  int i;
  for (i = 0; word[i]; i++) {
    int idx = word[i] - 'a';
    if (!cur->ch[idx]) return 0;
    cur = cur->ch[idx];
  }
  return cur->end;
}
int startsWith(Trie* t, const char* prefix) {
  Node* cur = t->root;
  int i;
  for (i = 0; prefix[i]; i++) {
    int idx = prefix[i] - 'a';
    if (!cur->ch[idx]) return 0;
    cur = cur->ch[idx];
  }
  return 1;
}`
          }
        }
      ]
    },
    {
      id: 2,
      level: "intermediate",
      q: "Design Add and Search Words Data Structure",
      ask: "Amazon · Google · Meta · Uber",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/design-add-and-search-words-data-structure/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/add-and-search-word-data-structure-design/"}],
      a: "addWord stores a word. search returns true if any stored word matches the pattern. A '.' in the pattern matches any one letter.\n\nExample: add bad, add dad, add mad. search pad is false, search bad is true, search .ad is true, search b.. is true.\n\nBrute scans every word. Optimal buckets by length. More optimal DFS on a trie, branching on '.' .",
      solutions: [
        {
          name: "Brute",
          time: "O(n L) search",
          space: "O(n L)",
          why: "Keep a list. For each stored word of the same length, compare char by char and treat '.' as a free pass. Simple and slow when the dictionary is large.",
          code: `function WordDictionary() {
  this.words = [];
}
WordDictionary.prototype.addWord = function (word) {
  this.words.push(word);
};
WordDictionary.prototype.search = function (word) {
  const n = word.length;
  for (let i = 0; i < this.words.length; i++) {
    const w = this.words[i];
    if (w.length !== n) continue;
    let ok = true;
    for (let j = 0; j < n; j++) {
      if (word[j] !== "." && word[j] !== w[j]) { ok = false; break; }
    }
    if (ok) return true;
  }
  return false;
};`,
          codes: {
            javascript: `function WordDictionary() {
  this.words = [];
}
WordDictionary.prototype.addWord = function (word) {
  this.words.push(word);
};
WordDictionary.prototype.search = function (word) {
  const n = word.length;
  for (let i = 0; i < this.words.length; i++) {
    const w = this.words[i];
    if (w.length !== n) continue;
    let ok = true;
    for (let j = 0; j < n; j++) {
      if (word[j] !== "." && word[j] !== w[j]) { ok = false; break; }
    }
    if (ok) return true;
  }
  return false;
};`,
            python: `class WordDictionary:
  def __init__(self):
    self.words = []
  def addWord(self, word):
    self.words.append(word)
  def search(self, word):
    n = len(word)
    for w in self.words:
      if len(w) != n:
        continue
      ok = True
      for j in range(n):
        if word[j] != "." and word[j] != w[j]:
          ok = False
          break
      if ok:
        return True
    return False`,
            java: `import java.util.*;
class WordDictionary {
  List<String> words = new ArrayList<String>();
  public void addWord(String word) { words.add(word); }
  public boolean search(String word) {
    int n = word.length();
    for (String w : words) {
      if (w.length() != n) continue;
      boolean ok = true;
      for (int j = 0; j < n; j++) {
        char c = word.charAt(j);
        if (c != '.' && c != w.charAt(j)) { ok = false; break; }
      }
      if (ok) return true;
    }
    return false;
  }
}`,
            cpp: `struct WordDictionary {
  vector<string> words;
  void addWord(string word) { words.push_back(word); }
  bool search(string word) {
    int n = (int)word.size();
    for (auto& w : words) {
      if ((int)w.size() != n) continue;
      bool ok = true;
      for (int j = 0; j < n; j++) {
        if (word[j] != '.' && word[j] != w[j]) { ok = false; break; }
      }
      if (ok) return true;
    }
    return false;
  }
};`,
            c: `typedef struct { char words[256][48]; int n; } WordDictionary;
void addWord(WordDictionary* d, const char* word) {
  strcpy(d->words[d->n++], word);
}
int search(WordDictionary* d, const char* word) {
  int n = (int)strlen(word), i, j;
  for (i = 0; i < d->n; i++) {
    if ((int)strlen(d->words[i]) != n) continue;
    int ok = 1;
    for (j = 0; j < n; j++) {
      if (word[j] != '.' && word[j] != d->words[i][j]) { ok = 0; break; }
    }
    if (ok) return 1;
  }
  return 0;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(k L)",
          space: "O(n L)",
          why: "Bucket words by length so a pattern of length L only scans that bucket. Still linear in the bucket size, but you skip obviously impossible words.",
          code: `function WordDictionary() {
  this.byLen = {};
}
WordDictionary.prototype.addWord = function (word) {
  const n = word.length;
  if (!this.byLen[n]) this.byLen[n] = [];
  this.byLen[n].push(word);
};
WordDictionary.prototype.search = function (word) {
  const n = word.length;
  const list = this.byLen[n] || [];
  for (let i = 0; i < list.length; i++) {
    const w = list[i];
    let ok = true;
    for (let j = 0; j < n; j++) {
      if (word[j] !== "." && word[j] !== w[j]) { ok = false; break; }
    }
    if (ok) return true;
  }
  return false;
};`,
          codes: {
            javascript: `function WordDictionary() {
  this.byLen = {};
}
WordDictionary.prototype.addWord = function (word) {
  const n = word.length;
  if (!this.byLen[n]) this.byLen[n] = [];
  this.byLen[n].push(word);
};
WordDictionary.prototype.search = function (word) {
  const n = word.length;
  const list = this.byLen[n] || [];
  for (let i = 0; i < list.length; i++) {
    const w = list[i];
    let ok = true;
    for (let j = 0; j < n; j++) {
      if (word[j] !== "." && word[j] !== w[j]) { ok = false; break; }
    }
    if (ok) return true;
  }
  return false;
};`,
            python: `class WordDictionary:
  def __init__(self):
    self.byLen = {}
  def addWord(self, word):
    n = len(word)
    self.byLen.setdefault(n, []).append(word)
  def search(self, word):
    n = len(word)
    for w in self.byLen.get(n, []):
      ok = True
      for j in range(n):
        if word[j] != "." and word[j] != w[j]:
          ok = False
          break
      if ok:
        return True
    return False`,
            java: `import java.util.*;
class WordDictionary {
  Map<Integer, List<String>> byLen = new HashMap<Integer, List<String>>();
  public void addWord(String word) {
    byLen.computeIfAbsent(word.length(), k -> new ArrayList<String>()).add(word);
  }
  public boolean search(String word) {
    List<String> list = byLen.getOrDefault(word.length(), Collections.emptyList());
    int n = word.length();
    for (String w : list) {
      boolean ok = true;
      for (int j = 0; j < n; j++) {
        char c = word.charAt(j);
        if (c != '.' && c != w.charAt(j)) { ok = false; break; }
      }
      if (ok) return true;
    }
    return false;
  }
}`,
            cpp: `struct WordDictionary {
  unordered_map<int, vector<string>> byLen;
  void addWord(string word) { byLen[(int)word.size()].push_back(word); }
  bool search(string word) {
    int n = (int)word.size();
    auto it = byLen.find(n);
    if (it == byLen.end()) return false;
    for (auto& w : it->second) {
      bool ok = true;
      for (int j = 0; j < n; j++) {
        if (word[j] != '.' && word[j] != w[j]) { ok = false; break; }
      }
      if (ok) return true;
    }
    return false;
  }
};`,
            c: `/* byLen[len][0..cnt[len]-1] */
typedef struct {
  char byLen[40][128][48];
  int cnt[40];
} WordDictionary;
void addWord(WordDictionary* d, const char* word) {
  int n = (int)strlen(word);
  strcpy(d->byLen[n][d->cnt[n]++], word);
}
int search(WordDictionary* d, const char* word) {
  int n = (int)strlen(word), i, j;
  for (i = 0; i < d->cnt[n]; i++) {
    int ok = 1;
    for (j = 0; j < n; j++) {
      if (word[j] != '.' && word[j] != d->byLen[n][i][j]) { ok = 0; break; }
    }
    if (ok) return 1;
  }
  return 0;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(26^d L)",
          space: "O(n L)",
          why: "Trie DFS. A letter follows one child. A '.' tries every living child. d is the number of dots. This is the expected design.",
          code: `function WordDictionary() {
  this.root = { ch: Array(26).fill(null), end: false };
}
WordDictionary.prototype.addWord = function (word) {
  let cur = this.root;
  for (let i = 0; i < word.length; i++) {
    const idx = word.charCodeAt(i) - 97;
    if (!cur.ch[idx]) cur.ch[idx] = { ch: Array(26).fill(null), end: false };
    cur = cur.ch[idx];
  }
  cur.end = true;
};
WordDictionary.prototype.search = function (word) {
  const root = this.root;
  function dfs(node, i) {
    if (!node) return false;
    if (i === word.length) return node.end === true;
    const c = word[i];
    if (c === ".") {
      for (let k = 0; k < 26; k++) if (dfs(node.ch[k], i + 1)) return true;
      return false;
    }
    return dfs(node.ch[c.charCodeAt(0) - 97], i + 1);
  }
  return dfs(root, 0);
};`,
          codes: {
            javascript: `function WordDictionary() {
  this.root = { ch: Array(26).fill(null), end: false };
}
WordDictionary.prototype.addWord = function (word) {
  let cur = this.root;
  for (let i = 0; i < word.length; i++) {
    const idx = word.charCodeAt(i) - 97;
    if (!cur.ch[idx]) cur.ch[idx] = { ch: Array(26).fill(null), end: false };
    cur = cur.ch[idx];
  }
  cur.end = true;
};
WordDictionary.prototype.search = function (word) {
  const root = this.root;
  function dfs(node, i) {
    if (!node) return false;
    if (i === word.length) return node.end === true;
    const c = word[i];
    if (c === ".") {
      for (let k = 0; k < 26; k++) if (dfs(node.ch[k], i + 1)) return true;
      return false;
    }
    return dfs(node.ch[c.charCodeAt(0) - 97], i + 1);
  }
  return dfs(root, 0);
};`,
            python: `class Node:
  def __init__(self):
    self.ch = [None] * 26
    self.end = False
class WordDictionary:
  def __init__(self):
    self.root = Node()
  def addWord(self, word):
    cur = self.root
    for c in word:
      idx = ord(c) - 97
      if cur.ch[idx] is None:
        cur.ch[idx] = Node()
      cur = cur.ch[idx]
    cur.end = True
  def search(self, word):
    def dfs(node, i):
      if node is None:
        return False
      if i == len(word):
        return node.end
      c = word[i]
      if c == ".":
        for k in range(26):
          if dfs(node.ch[k], i + 1):
            return True
        return False
      return dfs(node.ch[ord(c) - 97], i + 1)
    return dfs(self.root, 0)`,
            java: `class WordDictionary {
  static class Node {
    Node[] ch = new Node[26];
    boolean end;
  }
  Node root = new Node();
  public void addWord(String word) {
    Node cur = root;
    for (int i = 0; i < word.length(); i++) {
      int idx = word.charAt(i) - 'a';
      if (cur.ch[idx] == null) cur.ch[idx] = new Node();
      cur = cur.ch[idx];
    }
    cur.end = true;
  }
  boolean dfs(Node node, String word, int i) {
    if (node == null) return false;
    if (i == word.length()) return node.end;
    char c = word.charAt(i);
    if (c == '.') {
      for (int k = 0; k < 26; k++) if (dfs(node.ch[k], word, i + 1)) return true;
      return false;
    }
    return dfs(node.ch[c - 'a'], word, i + 1);
  }
  public boolean search(String word) { return dfs(root, word, 0); }
}`,
            cpp: `struct WordDictionary {
  struct Node { Node* ch[26] = {}; bool end = false; };
  Node* root = new Node();
  void addWord(string word) {
    Node* cur = root;
    for (char c : word) {
      int idx = c - 'a';
      if (!cur->ch[idx]) cur->ch[idx] = new Node();
      cur = cur->ch[idx];
    }
    cur->end = true;
  }
  bool dfs(Node* node, const string& word, int i) {
    if (!node) return false;
    if (i == (int)word.size()) return node->end;
    char c = word[i];
    if (c == '.') {
      for (int k = 0; k < 26; k++) if (dfs(node->ch[k], word, i + 1)) return true;
      return false;
    }
    return dfs(node->ch[c - 'a'], word, i + 1);
  }
  bool search(string word) { return dfs(root, word, 0); }
};`,
            c: `typedef struct Node { struct Node* ch[26]; int end; } Node;
typedef struct { Node* root; } WordDictionary;
Node* newNode(void) { return (Node*)calloc(1, sizeof(Node)); }
void wdInit(WordDictionary* d) { d->root = newNode(); }
void addWord(WordDictionary* d, const char* word) {
  Node* cur = d->root;
  int i;
  for (i = 0; word[i]; i++) {
    int idx = word[i] - 'a';
    if (!cur->ch[idx]) cur->ch[idx] = newNode();
    cur = cur->ch[idx];
  }
  cur->end = 1;
}
int dfs(Node* node, const char* word, int i) {
  int k;
  if (!node) return 0;
  if (!word[i]) return node->end;
  if (word[i] == '.') {
    for (k = 0; k < 26; k++) if (dfs(node->ch[k], word, i + 1)) return 1;
    return 0;
  }
  return dfs(node->ch[word[i] - 'a'], word, i + 1);
}
int search(WordDictionary* d, const char* word) { return dfs(d->root, word, 0); }`
          }
        }
      ]
    },
    {
      id: 3,
      level: "advanced",
      q: "Word Search II",
      ask: "Amazon · Google · Microsoft · Uber",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/word-search-ii/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/word-boggle-1587115621/1"}],
      a: "You get an m by n board of letters and a list of words. Return every word that can be formed by walking adjacent cells (up, down, left, right) without reusing a cell in the same walk.\n\nExample: board has o,a,a,n / e,t,a,e / i,h,k,r / i,f,l,v and words eat, oath, pea, rain. Answer is eat and oath.\n\nBrute runs Word Search I per word. Optimal walks the board once against a trie. More optimal stores the word on the end node and prunes after a find.",
      solutions: [
        {
          name: "Brute",
          time: "O(w m n 4^L)",
          space: "O(L)",
          why: "For each word, DFS from every cell. Mark the cell, try four neighbors, unmark. Correct, but you restart the whole board for every dictionary word.",
          code: `function findWords(board, words) {
  const rows = board.length, cols = board[0].length;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  function dfs(r, c, k, word) {
    if (k === word.length) return true;
    if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
    if (board[r][c] !== word[k]) return false;
    const saved = board[r][c];
    board[r][c] = "#";
    for (let i = 0; i < 4; i++) {
      if (dfs(r + dirs[i][0], c + dirs[i][1], k + 1, word)) {
        board[r][c] = saved;
        return true;
      }
    }
    board[r][c] = saved;
    return false;
  }
  const out = [];
  for (let w = 0; w < words.length; w++) {
    let found = false;
    for (let r = 0; r < rows && !found; r++) {
      for (let c = 0; c < cols && !found; c++) {
        if (dfs(r, c, 0, words[w])) found = true;
      }
    }
    if (found) out.push(words[w]);
  }
  return out;
}`,
          codes: {
            javascript: `function findWords(board, words) {
  const rows = board.length, cols = board[0].length;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  function dfs(r, c, k, word) {
    if (k === word.length) return true;
    if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
    if (board[r][c] !== word[k]) return false;
    const saved = board[r][c];
    board[r][c] = "#";
    for (let i = 0; i < 4; i++) {
      if (dfs(r + dirs[i][0], c + dirs[i][1], k + 1, word)) {
        board[r][c] = saved;
        return true;
      }
    }
    board[r][c] = saved;
    return false;
  }
  const out = [];
  for (let w = 0; w < words.length; w++) {
    let found = false;
    for (let r = 0; r < rows && !found; r++) {
      for (let c = 0; c < cols && !found; c++) {
        if (dfs(r, c, 0, words[w])) found = true;
      }
    }
    if (found) out.push(words[w]);
  }
  return out;
}`,
            python: `def findWords(board, words):
  rows, cols = len(board), len(board[0])
  dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]
  def dfs(r, c, k, word):
    if k == len(word):
      return True
    if r < 0 or c < 0 or r >= rows or c >= cols:
      return False
    if board[r][c] != word[k]:
      return False
    saved = board[r][c]
    board[r][c] = "#"
    for dr, dc in dirs:
      if dfs(r + dr, c + dc, k + 1, word):
        board[r][c] = saved
        return True
    board[r][c] = saved
    return False
  out = []
  for word in words:
    found = False
    for r in range(rows):
      if found:
        break
      for c in range(cols):
        if dfs(r, c, 0, word):
          found = True
          break
    if found:
      out.append(word)
  return out`,
            java: `import java.util.*;
class Solution {
  int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
  boolean dfs(char[][] board, int r, int c, int k, String word) {
    if (k == word.length()) return true;
    if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return false;
    if (board[r][c] != word.charAt(k)) return false;
    char saved = board[r][c];
    board[r][c] = '#';
    for (int[] d : dirs) {
      if (dfs(board, r + d[0], c + d[1], k + 1, word)) {
        board[r][c] = saved;
        return true;
      }
    }
    board[r][c] = saved;
    return false;
  }
  public List<String> findWords(char[][] board, String[] words) {
    List<String> out = new ArrayList<String>();
    for (String word : words) {
      boolean found = false;
      for (int r = 0; r < board.length && !found; r++)
        for (int c = 0; c < board[0].length && !found; c++)
          if (dfs(board, r, c, 0, word)) found = true;
      if (found) out.add(word);
    }
    return out;
  }
}`,
            cpp: `class Solution {
  int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
  bool dfs(vector<vector<char>>& board, int r, int c, int k, const string& word) {
    if (k == (int)word.size()) return true;
    if (r < 0 || c < 0 || r >= (int)board.size() || c >= (int)board[0].size()) return false;
    if (board[r][c] != word[k]) return false;
    char saved = board[r][c];
    board[r][c] = '#';
    for (int i = 0; i < 4; i++) {
      if (dfs(board, r + dirs[i][0], c + dirs[i][1], k + 1, word)) {
        board[r][c] = saved;
        return true;
      }
    }
    board[r][c] = saved;
    return false;
  }
public:
  vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
    vector<string> out;
    for (auto& word : words) {
      bool found = false;
      for (int r = 0; r < (int)board.size() && !found; r++)
        for (int c = 0; c < (int)board[0].size() && !found; c++)
          if (dfs(board, r, c, 0, word)) found = true;
      if (found) out.push_back(word);
    }
    return out;
  }
};`,
            c: `int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
int dfs(char** board, int rows, int cols, int r, int c, int k, const char* word) {
  int i;
  if (!word[k]) return 1;
  if (r < 0 || c < 0 || r >= rows || c >= cols) return 0;
  if (board[r][c] != word[k]) return 0;
  char saved = board[r][c];
  board[r][c] = '#';
  for (i = 0; i < 4; i++) {
    if (dfs(board, rows, cols, r + dirs[i][0], c + dirs[i][1], k + 1, word)) {
      board[r][c] = saved;
      return 1;
    }
  }
  board[r][c] = saved;
  return 0;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(m n 4^L)",
          space: "O(total chars)",
          why: "Build a trie of all words, then DFS from every cell following only living children. One board walk instead of one walk per word.",
          code: `function findWords(board, words) {
  function node() { return { ch: Array(26).fill(null), end: false, word: "" }; }
  const root = node();
  for (let w = 0; w < words.length; w++) {
    let cur = root;
    const s = words[w];
    for (let i = 0; i < s.length; i++) {
      const idx = s.charCodeAt(i) - 97;
      if (!cur.ch[idx]) cur.ch[idx] = node();
      cur = cur.ch[idx];
    }
    cur.end = true;
    cur.word = s;
  }
  const rows = board.length, cols = board[0].length;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const seen = {};
  const out = [];
  function dfs(r, c, cur) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    const ch = board[r][c];
    if (ch === "#") return;
    const nxt = cur.ch[ch.charCodeAt(0) - 97];
    if (!nxt) return;
    if (nxt.end && !seen[nxt.word]) {
      seen[nxt.word] = true;
      out.push(nxt.word);
    }
    board[r][c] = "#";
    for (let i = 0; i < 4; i++) dfs(r + dirs[i][0], c + dirs[i][1], nxt);
    board[r][c] = ch;
  }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) dfs(r, c, root);
  return out;
}`,
          codes: {
            javascript: `function findWords(board, words) {
  function node() { return { ch: Array(26).fill(null), end: false, word: "" }; }
  const root = node();
  for (let w = 0; w < words.length; w++) {
    let cur = root;
    const s = words[w];
    for (let i = 0; i < s.length; i++) {
      const idx = s.charCodeAt(i) - 97;
      if (!cur.ch[idx]) cur.ch[idx] = node();
      cur = cur.ch[idx];
    }
    cur.end = true;
    cur.word = s;
  }
  const rows = board.length, cols = board[0].length;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const seen = {};
  const out = [];
  function dfs(r, c, cur) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    const ch = board[r][c];
    if (ch === "#") return;
    const nxt = cur.ch[ch.charCodeAt(0) - 97];
    if (!nxt) return;
    if (nxt.end && !seen[nxt.word]) {
      seen[nxt.word] = true;
      out.push(nxt.word);
    }
    board[r][c] = "#";
    for (let i = 0; i < 4; i++) dfs(r + dirs[i][0], c + dirs[i][1], nxt);
    board[r][c] = ch;
  }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) dfs(r, c, root);
  return out;
}`,
            python: `def findWords(board, words):
  def node():
    return {"ch": [None] * 26, "end": False, "word": ""}
  root = node()
  for s in words:
    cur = root
    for ch in s:
      idx = ord(ch) - 97
      if cur["ch"][idx] is None:
        cur["ch"][idx] = node()
      cur = cur["ch"][idx]
    cur["end"] = True
    cur["word"] = s
  rows, cols = len(board), len(board[0])
  dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]
  seen = set()
  out = []
  def dfs(r, c, cur):
    if r < 0 or c < 0 or r >= rows or c >= cols:
      return
    ch = board[r][c]
    if ch == "#":
      return
    nxt = cur["ch"][ord(ch) - 97]
    if nxt is None:
      return
    if nxt["end"] and nxt["word"] not in seen:
      seen.add(nxt["word"])
      out.append(nxt["word"])
    board[r][c] = "#"
    for dr, dc in dirs:
      dfs(r + dr, c + dc, nxt)
    board[r][c] = ch
  for r in range(rows):
    for c in range(cols):
      dfs(r, c, root)
  return out`,
            java: `import java.util.*;
class Solution {
  static class Node {
    Node[] ch = new Node[26];
    boolean end;
    String word = "";
  }
  int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
  void dfs(char[][] board, int r, int c, Node cur, Set<String> seen, List<String> out) {
    if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return;
    char ch = board[r][c];
    if (ch == '#') return;
    Node nxt = cur.ch[ch - 'a'];
    if (nxt == null) return;
    if (nxt.end && seen.add(nxt.word)) out.add(nxt.word);
    board[r][c] = '#';
    for (int[] d : dirs) dfs(board, r + d[0], c + d[1], nxt, seen, out);
    board[r][c] = ch;
  }
  public List<String> findWords(char[][] board, String[] words) {
    Node root = new Node();
    for (String s : words) {
      Node cur = root;
      for (int i = 0; i < s.length(); i++) {
        int idx = s.charAt(i) - 'a';
        if (cur.ch[idx] == null) cur.ch[idx] = new Node();
        cur = cur.ch[idx];
      }
      cur.end = true;
      cur.word = s;
    }
    Set<String> seen = new HashSet<String>();
    List<String> out = new ArrayList<String>();
    for (int r = 0; r < board.length; r++)
      for (int c = 0; c < board[0].length; c++)
        dfs(board, r, c, root, seen, out);
    return out;
  }
}`,
            cpp: `class Solution {
  struct Node { Node* ch[26] = {}; bool end = false; string word; };
  int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
  void dfs(vector<vector<char>>& board, int r, int c, Node* cur,
           unordered_set<string>& seen, vector<string>& out) {
    if (r < 0 || c < 0 || r >= (int)board.size() || c >= (int)board[0].size()) return;
    char ch = board[r][c];
    if (ch == '#') return;
    Node* nxt = cur->ch[ch - 'a'];
    if (!nxt) return;
    if (nxt->end && !seen.count(nxt->word)) { seen.insert(nxt->word); out.push_back(nxt->word); }
    board[r][c] = '#';
    for (int i = 0; i < 4; i++) dfs(board, r + dirs[i][0], c + dirs[i][1], nxt, seen, out);
    board[r][c] = ch;
  }
public:
  vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
    Node* root = new Node();
    for (auto& s : words) {
      Node* cur = root;
      for (char ch : s) {
        int idx = ch - 'a';
        if (!cur->ch[idx]) cur->ch[idx] = new Node();
        cur = cur->ch[idx];
      }
      cur->end = true; cur->word = s;
    }
    unordered_set<string> seen;
    vector<string> out;
    for (int r = 0; r < (int)board.size(); r++)
      for (int c = 0; c < (int)board[0].size(); c++)
        dfs(board, r, c, root, seen, out);
    return out;
  }
};`,
            c: `typedef struct TNode { struct TNode* ch[26]; int end; char word[48]; } TNode;
TNode* tnode(void) { return (TNode*)calloc(1, sizeof(TNode)); }
int dirs4[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
void dfs2(char** board, int rows, int cols, int r, int c, TNode* cur,
          char out[][48], int* on) {
  int i;
  if (r < 0 || c < 0 || r >= rows || c >= cols) return;
  char ch = board[r][c];
  TNode* nxt;
  if (ch == '#') return;
  nxt = cur->ch[ch - 'a'];
  if (!nxt) return;
  if (nxt->end) {
    int dup = 0, k;
    for (k = 0; k < *on; k++) if (strcmp(out[k], nxt->word) == 0) dup = 1;
    if (!dup) strcpy(out[(*on)++], nxt->word);
  }
  board[r][c] = '#';
  for (i = 0; i < 4; i++) dfs2(board, rows, cols, r + dirs4[i][0], c + dirs4[i][1], nxt, out, on);
  board[r][c] = ch;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(m n 4^L)",
          space: "O(total chars)",
          why: "Same trie DFS, but after you emit a word you clear that end mark (and optionally prune empty children). That stops duplicate work and extra copies of the same word.",
          code: `function findWords(board, words) {
  function node() { return { ch: {}, word: null }; }
  const root = node();
  for (let w = 0; w < words.length; w++) {
    let cur = root;
    const s = words[w];
    for (let i = 0; i < s.length; i++) {
      if (!cur.ch[s[i]]) cur.ch[s[i]] = node();
      cur = cur.ch[s[i]];
    }
    cur.word = s;
  }
  const rows = board.length, cols = board[0].length;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const out = [];
  function dfs(r, c, cur) {
    const ch = board[r][c];
    const nxt = cur.ch[ch];
    if (!nxt) return;
    if (nxt.word) {
      out.push(nxt.word);
      nxt.word = null;
    }
    board[r][c] = "#";
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (board[nr][nc] === "#") continue;
      dfs(nr, nc, nxt);
    }
    board[r][c] = ch;
  }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) dfs(r, c, root);
  return out;
}`,
          codes: {
            javascript: `function findWords(board, words) {
  function node() { return { ch: {}, word: null }; }
  const root = node();
  for (let w = 0; w < words.length; w++) {
    let cur = root;
    const s = words[w];
    for (let i = 0; i < s.length; i++) {
      if (!cur.ch[s[i]]) cur.ch[s[i]] = node();
      cur = cur.ch[s[i]];
    }
    cur.word = s;
  }
  const rows = board.length, cols = board[0].length;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const out = [];
  function dfs(r, c, cur) {
    const ch = board[r][c];
    const nxt = cur.ch[ch];
    if (!nxt) return;
    if (nxt.word) {
      out.push(nxt.word);
      nxt.word = null;
    }
    board[r][c] = "#";
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (board[nr][nc] === "#") continue;
      dfs(nr, nc, nxt);
    }
    board[r][c] = ch;
  }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) dfs(r, c, root);
  return out;
}`,
            python: `def findWords(board, words):
  def node():
    return {"ch": {}, "word": None}
  root = node()
  for s in words:
    cur = root
    for ch in s:
      if ch not in cur["ch"]:
        cur["ch"][ch] = node()
      cur = cur["ch"][ch]
    cur["word"] = s
  rows, cols = len(board), len(board[0])
  dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]
  out = []
  def dfs(r, c, cur):
    ch = board[r][c]
    nxt = cur["ch"].get(ch)
    if nxt is None:
      return
    if nxt["word"]:
      out.append(nxt["word"])
      nxt["word"] = None
    board[r][c] = "#"
    for dr, dc in dirs:
      nr, nc = r + dr, c + dc
      if nr < 0 or nc < 0 or nr >= rows or nc >= cols:
        continue
      if board[nr][nc] == "#":
        continue
      dfs(nr, nc, nxt)
    board[r][c] = ch
  for r in range(rows):
    for c in range(cols):
      dfs(r, c, root)
  return out`,
            java: `import java.util.*;
class Solution {
  static class Node {
    Map<Character, Node> ch = new HashMap<Character, Node>();
    String word;
  }
  int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
  void dfs(char[][] board, int r, int c, Node cur, List<String> out) {
    char ch = board[r][c];
    Node nxt = cur.ch.get(ch);
    if (nxt == null) return;
    if (nxt.word != null) { out.add(nxt.word); nxt.word = null; }
    board[r][c] = '#';
    for (int[] d : dirs) {
      int nr = r + d[0], nc = c + d[1];
      if (nr < 0 || nc < 0 || nr >= board.length || nc >= board[0].length) continue;
      if (board[nr][nc] == '#') continue;
      dfs(board, nr, nc, nxt, out);
    }
    board[r][c] = ch;
  }
  public List<String> findWords(char[][] board, String[] words) {
    Node root = new Node();
    for (String s : words) {
      Node cur = root;
      for (int i = 0; i < s.length(); i++) {
        char ch = s.charAt(i);
        cur.ch.putIfAbsent(ch, new Node());
        cur = cur.ch.get(ch);
      }
      cur.word = s;
    }
    List<String> out = new ArrayList<String>();
    for (int r = 0; r < board.length; r++)
      for (int c = 0; c < board[0].length; c++)
        dfs(board, r, c, root, out);
    return out;
  }
}`,
            cpp: `class Solution {
  struct Node {
    unordered_map<char, Node*> ch;
    string word;
  };
  int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
  void dfs(vector<vector<char>>& board, int r, int c, Node* cur, vector<string>& out) {
    char ch = board[r][c];
    auto it = cur->ch.find(ch);
    if (it == cur->ch.end()) return;
    Node* nxt = it->second;
    if (!nxt->word.empty()) { out.push_back(nxt->word); nxt->word.clear(); }
    board[r][c] = '#';
    for (int i = 0; i < 4; i++) {
      int nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= (int)board.size() || nc >= (int)board[0].size()) continue;
      if (board[nr][nc] == '#') continue;
      dfs(board, nr, nc, nxt, out);
    }
    board[r][c] = ch;
  }
public:
  vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
    Node* root = new Node();
    for (auto& s : words) {
      Node* cur = root;
      for (char ch : s) {
        if (!cur->ch.count(ch)) cur->ch[ch] = new Node();
        cur = cur->ch[ch];
      }
      cur->word = s;
    }
    vector<string> out;
    for (int r = 0; r < (int)board.size(); r++)
      for (int c = 0; c < (int)board[0].size(); c++)
        dfs(board, r, c, root, out);
    return out;
  }
};`,
            c: `/* After a hit, clear tnode->end so the same word is not pushed twice.
   Map children: linear scan of 26 slots is enough in C. */
typedef struct TNode2 { struct TNode2* ch[26]; char word[48]; } TNode2;
void dfs3(char** board, int rows, int cols, int r, int c, TNode2* cur,
          char out[][48], int* on) {
  char ch = board[r][c];
  TNode2* nxt;
  int i;
  if (ch == '#' || ch < 'a' || ch > 'z') return;
  nxt = cur->ch[ch - 'a'];
  if (!nxt) return;
  if (nxt->word[0]) {
    strcpy(out[(*on)++], nxt->word);
    nxt->word[0] = 0;
  }
  board[r][c] = '#';
  for (i = 0; i < 4; i++) {
    int nr = r + dirs4[i][0], nc = c + dirs4[i][1];
    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
    if (board[nr][nc] == '#') continue;
    dfs3(board, rows, cols, nr, nc, nxt, out, on);
  }
  board[r][c] = ch;
}`
          }
        }
      ]
    },
    {
      id: 4,
      level: "beginner",
      q: "Replace Words",
      ask: "Amazon · Google · Bloomberg",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/replace-words/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/replace-words/"}],
      a: "A root is a prefix that can replace a successor word. Given a dictionary of roots and a sentence, replace every word with the shortest root that is a prefix of it. If no root matches, leave the word.\n\nExample: dictionary = cat, bat, rat and sentence = the cattle was rattled by the battery becomes the cat was rat by the bat.\n\nBrute tries every root on every word. Optimal sorts roots by length. More optimal walks a trie of roots until an end flag.",
      solutions: [
        {
          name: "Brute",
          time: "O(words * roots * L)",
          space: "O(1) extra",
          why: "For each sentence word, scan every root and keep the shortest one that is a prefix. Easy to write, quadratic in dictionary size.",
          code: `function replaceWords(dictionary, sentence) {
  const words = sentence.split(" ");
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    let best = w;
    for (let j = 0; j < dictionary.length; j++) {
      const r = dictionary[j];
      if (w.length >= r.length && w.slice(0, r.length) === r && r.length < best.length) best = r;
    }
    words[i] = best;
  }
  return words.join(" ");
}`,
          codes: {
            javascript: `function replaceWords(dictionary, sentence) {
  const words = sentence.split(" ");
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    let best = w;
    for (let j = 0; j < dictionary.length; j++) {
      const r = dictionary[j];
      if (w.length >= r.length && w.slice(0, r.length) === r && r.length < best.length) best = r;
    }
    words[i] = best;
  }
  return words.join(" ");
}`,
            python: `def replaceWords(dictionary, sentence):
  words = sentence.split(" ")
  for i, w in enumerate(words):
    best = w
    for r in dictionary:
      if len(w) >= len(r) and w[:len(r)] == r and len(r) < len(best):
        best = r
    words[i] = best
  return " ".join(words)`,
            java: `class Solution {
  public String replaceWords(List<String> dictionary, String sentence) {
    String[] words = sentence.split(" ");
    for (int i = 0; i < words.length; i++) {
      String w = words[i], best = w;
      for (String r : dictionary) {
        if (w.startsWith(r) && r.length() < best.length()) best = r;
      }
      words[i] = best;
    }
    return String.join(" ", words);
  }
}`,
            cpp: `string replaceWords(vector<string>& dictionary, string sentence) {
  stringstream ss(sentence);
  string w, out;
  while (ss >> w) {
    string best = w;
    for (auto& r : dictionary)
      if (w.size() >= r.size() && w.compare(0, r.size(), r) == 0 && r.size() < best.size()) best = r;
    if (!out.empty()) out += ' ';
    out += best;
  }
  return out;
}`,
            c: `void replaceWords(char dict[][48], int dn, char words[][48], int wn) {
  int i, j;
  for (i = 0; i < wn; i++) {
    char best[48];
    int blen;
    strcpy(best, words[i]);
    blen = (int)strlen(best);
    for (j = 0; j < dn; j++) {
      int rl = (int)strlen(dict[j]);
      if ((int)strlen(words[i]) >= rl && strncmp(words[i], dict[j], rl) == 0 && rl < blen) {
        strcpy(best, dict[j]);
        blen = rl;
      }
    }
    strcpy(words[i], best);
  }
}`
          }
        },
        {
          name: "Optimal",
          time: "O(total chars)",
          space: "O(roots)",
          why: "Put roots in a set. For each word, try prefixes from length 1 up and take the first hit. That is the shortest root. Faster when few prefixes match.",
          code: `function replaceWords(dictionary, sentence) {
  const set = Object.create(null);
  for (let i = 0; i < dictionary.length; i++) set[dictionary[i]] = true;
  const words = sentence.split(" ");
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    for (let L = 1; L <= w.length; L++) {
      const p = w.slice(0, L);
      if (set[p]) { words[i] = p; break; }
    }
  }
  return words.join(" ");
}`,
          codes: {
            javascript: `function replaceWords(dictionary, sentence) {
  const set = Object.create(null);
  for (let i = 0; i < dictionary.length; i++) set[dictionary[i]] = true;
  const words = sentence.split(" ");
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    for (let L = 1; L <= w.length; L++) {
      const p = w.slice(0, L);
      if (set[p]) { words[i] = p; break; }
    }
  }
  return words.join(" ");
}`,
            python: `def replaceWords(dictionary, sentence):
  s = set(dictionary)
  words = sentence.split(" ")
  for i, w in enumerate(words):
    for L in range(1, len(w) + 1):
      p = w[:L]
      if p in s:
        words[i] = p
        break
  return " ".join(words)`,
            java: `import java.util.*;
class Solution {
  public String replaceWords(List<String> dictionary, String sentence) {
    Set<String> set = new HashSet<String>(dictionary);
    String[] words = sentence.split(" ");
    for (int i = 0; i < words.length; i++) {
      String w = words[i];
      for (int L = 1; L <= w.length(); L++) {
        String p = w.substring(0, L);
        if (set.contains(p)) { words[i] = p; break; }
      }
    }
    return String.join(" ", words);
  }
}`,
            cpp: `string replaceWords(vector<string>& dictionary, string sentence) {
  unordered_set<string> set(dictionary.begin(), dictionary.end());
  stringstream ss(sentence);
  string w, out;
  while (ss >> w) {
    string pick = w;
    for (int L = 1; L <= (int)w.size(); L++) {
      string p = w.substr(0, L);
      if (set.count(p)) { pick = p; break; }
    }
    if (!out.empty()) out += ' ';
    out += pick;
  }
  return out;
}`,
            c: `int inDict(char dict[][48], int dn, const char* p) {
  int j; for (j = 0; j < dn; j++) if (strcmp(dict[j], p) == 0) return 1; return 0;
}
void replaceWordsSet(char dict[][48], int dn, char words[][48], int wn) {
  int i, L;
  for (i = 0; i < wn; i++) {
    int n = (int)strlen(words[i]);
    char p[48];
    for (L = 1; L <= n; L++) {
      memcpy(p, words[i], L); p[L] = 0;
      if (inDict(dict, dn, p)) { strcpy(words[i], p); break; }
    }
  }
}`
          }
        },
        {
          name: "More optimal",
          time: "O(total chars)",
          space: "O(roots)",
          why: "Trie of roots. Walk each sentence word until you hit an end flag, then stop. Shared prefixes make this the usual interview answer.",
          code: `function replaceWords(dictionary, sentence) {
  function node() { return { ch: Array(26).fill(null), end: false }; }
  const root = node();
  for (let i = 0; i < dictionary.length; i++) {
    let cur = root;
    const r = dictionary[i];
    for (let j = 0; j < r.length; j++) {
      const idx = r.charCodeAt(j) - 97;
      if (!cur.ch[idx]) cur.ch[idx] = node();
      cur = cur.ch[idx];
    }
    cur.end = true;
  }
  const words = sentence.split(" ");
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    let cur = root;
    let built = "";
    for (let j = 0; j < w.length; j++) {
      const idx = w.charCodeAt(j) - 97;
      if (!cur.ch[idx]) break;
      cur = cur.ch[idx];
      built += w[j];
      if (cur.end) { words[i] = built; break; }
    }
  }
  return words.join(" ");
}`,
          codes: {
            javascript: `function replaceWords(dictionary, sentence) {
  function node() { return { ch: Array(26).fill(null), end: false }; }
  const root = node();
  for (let i = 0; i < dictionary.length; i++) {
    let cur = root;
    const r = dictionary[i];
    for (let j = 0; j < r.length; j++) {
      const idx = r.charCodeAt(j) - 97;
      if (!cur.ch[idx]) cur.ch[idx] = node();
      cur = cur.ch[idx];
    }
    cur.end = true;
  }
  const words = sentence.split(" ");
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    let cur = root;
    let built = "";
    for (let j = 0; j < w.length; j++) {
      const idx = w.charCodeAt(j) - 97;
      if (!cur.ch[idx]) break;
      cur = cur.ch[idx];
      built += w[j];
      if (cur.end) { words[i] = built; break; }
    }
  }
  return words.join(" ");
}`,
            python: `def replaceWords(dictionary, sentence):
  def node():
    return {"ch": [None] * 26, "end": False}
  root = node()
  for r in dictionary:
    cur = root
    for ch in r:
      idx = ord(ch) - 97
      if cur["ch"][idx] is None:
        cur["ch"][idx] = node()
      cur = cur["ch"][idx]
    cur["end"] = True
  words = sentence.split(" ")
  for i, w in enumerate(words):
    cur = root
    built = ""
    for ch in w:
      idx = ord(ch) - 97
      if cur["ch"][idx] is None:
        break
      cur = cur["ch"][idx]
      built += ch
      if cur["end"]:
        words[i] = built
        break
  return " ".join(words)`,
            java: `class Solution {
  static class Node {
    Node[] ch = new Node[26];
    boolean end;
  }
  public String replaceWords(List<String> dictionary, String sentence) {
    Node root = new Node();
    for (String r : dictionary) {
      Node cur = root;
      for (int j = 0; j < r.length(); j++) {
        int idx = r.charAt(j) - 'a';
        if (cur.ch[idx] == null) cur.ch[idx] = new Node();
        cur = cur.ch[idx];
      }
      cur.end = true;
    }
    String[] words = sentence.split(" ");
    for (int i = 0; i < words.length; i++) {
      String w = words[i];
      Node cur = root;
      StringBuilder built = new StringBuilder();
      for (int j = 0; j < w.length(); j++) {
        int idx = w.charAt(j) - 'a';
        if (cur.ch[idx] == null) break;
        cur = cur.ch[idx];
        built.append(w.charAt(j));
        if (cur.end) { words[i] = built.toString(); break; }
      }
    }
    return String.join(" ", words);
  }
}`,
            cpp: `string replaceWords(vector<string>& dictionary, string sentence) {
  struct Node { Node* ch[26] = {}; bool end = false; };
  Node* root = new Node();
  for (auto& r : dictionary) {
    Node* cur = root;
    for (char c : r) {
      int idx = c - 'a';
      if (!cur->ch[idx]) cur->ch[idx] = new Node();
      cur = cur->ch[idx];
    }
    cur->end = true;
  }
  stringstream ss(sentence);
  string w, out;
  while (ss >> w) {
    Node* cur = root;
    string built, pick = w;
    for (char c : w) {
      int idx = c - 'a';
      if (!cur->ch[idx]) break;
      cur = cur->ch[idx];
      built += c;
      if (cur->end) { pick = built; break; }
    }
    if (!out.empty()) out += ' ';
    out += pick;
  }
  return out;
}`,
            c: `void replaceWordsTrie(char dict[][48], int dn, char words[][48], int wn) {
  Node* root = newNode();
  int i, j;
  for (i = 0; i < dn; i++) {
    Node* cur = root;
    for (j = 0; dict[i][j]; j++) {
      int idx = dict[i][j] - 'a';
      if (!cur->ch[idx]) cur->ch[idx] = newNode();
      cur = cur->ch[idx];
    }
    cur->end = 1;
  }
  for (i = 0; i < wn; i++) {
    Node* cur = root;
    char built[48]; int k = 0;
    for (j = 0; words[i][j]; j++) {
      int idx = words[i][j] - 'a';
      if (!cur->ch[idx]) break;
      cur = cur->ch[idx];
      built[k++] = words[i][j]; built[k] = 0;
      if (cur->end) { strcpy(words[i], built); break; }
    }
  }
}`
          }
        }
      ]
    },
    {
      id: 5,
      level: "intermediate",
      q: "Implement Magic Dictionary",
      ask: "Google · Amazon · Facebook",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/implement-magic-dictionary/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/implement-magic-dictionary/"}],
      a: "Build a dict from a word list. search(query) is true if you can change exactly one letter of query and land on a stored word. Same length only. Changing zero letters does not count.\n\nExample: dict hello, leetcode. search hhllo is true (hello with one change). search hell is false (length). search leetcode is false (zero changes).\n\nBrute compares every word. Optimal keys wildcard patterns. More optimal DFS on a trie with one leftover mismatch.",
      solutions: [
        {
          name: "Brute",
          time: "O(n L)",
          space: "O(n L)",
          why: "Store the list. For each stored word of the same length, count mismatches. Return true on a count of exactly 1.",
          code: `function MagicDictionary() {
  this.words = [];
}
MagicDictionary.prototype.buildDict = function (dictionary) {
  this.words = dictionary.slice();
};
MagicDictionary.prototype.search = function (searchWord) {
  const n = searchWord.length;
  for (let i = 0; i < this.words.length; i++) {
    const w = this.words[i];
    if (w.length !== n) continue;
    let diff = 0;
    for (let j = 0; j < n; j++) if (w[j] !== searchWord[j]) diff++;
    if (diff === 1) return true;
  }
  return false;
};`,
          codes: {
            javascript: `function MagicDictionary() {
  this.words = [];
}
MagicDictionary.prototype.buildDict = function (dictionary) {
  this.words = dictionary.slice();
};
MagicDictionary.prototype.search = function (searchWord) {
  const n = searchWord.length;
  for (let i = 0; i < this.words.length; i++) {
    const w = this.words[i];
    if (w.length !== n) continue;
    let diff = 0;
    for (let j = 0; j < n; j++) if (w[j] !== searchWord[j]) diff++;
    if (diff === 1) return true;
  }
  return false;
};`,
            python: `class MagicDictionary:
  def __init__(self):
    self.words = []
  def buildDict(self, dictionary):
    self.words = list(dictionary)
  def search(self, searchWord):
    n = len(searchWord)
    for w in self.words:
      if len(w) != n:
        continue
      diff = 0
      for j in range(n):
        if w[j] != searchWord[j]:
          diff += 1
      if diff == 1:
        return True
    return False`,
            java: `class MagicDictionary {
  String[] words = new String[0];
  public void buildDict(String[] dictionary) { words = dictionary; }
  public boolean search(String searchWord) {
    int n = searchWord.length();
    for (String w : words) {
      if (w.length() != n) continue;
      int diff = 0;
      for (int j = 0; j < n; j++) if (w.charAt(j) != searchWord.charAt(j)) diff++;
      if (diff == 1) return true;
    }
    return false;
  }
}`,
            cpp: `struct MagicDictionary {
  vector<string> words;
  void buildDict(vector<string> dictionary) { words = dictionary; }
  bool search(string searchWord) {
    int n = (int)searchWord.size();
    for (auto& w : words) {
      if ((int)w.size() != n) continue;
      int diff = 0;
      for (int j = 0; j < n; j++) if (w[j] != searchWord[j]) diff++;
      if (diff == 1) return true;
    }
    return false;
  }
};`,
            c: `typedef struct { char words[256][48]; int n; } MagicDictionary;
void buildDict(MagicDictionary* d, char dict[][48], int m) {
  int i; d->n = m; for (i = 0; i < m; i++) strcpy(d->words[i], dict[i]);
}
int search(MagicDictionary* d, const char* q) {
  int n = (int)strlen(q), i, j;
  for (i = 0; i < d->n; i++) {
    if ((int)strlen(d->words[i]) != n) continue;
    int diff = 0;
    for (j = 0; j < n; j++) if (d->words[i][j] != q[j]) diff++;
    if (diff == 1) return 1;
  }
  return 0;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(L * 26)",
          space: "O(n L^2)",
          why: "For each word, replace each position with '*' and map that pattern to the original letters. On search, look up each starred query and see if another letter is stored. Handles duplicates carefully.",
          code: `function MagicDictionary() {
  this.map = Object.create(null);
}
MagicDictionary.prototype.buildDict = function (dictionary) {
  this.map = Object.create(null);
  for (let i = 0; i < dictionary.length; i++) {
    const w = dictionary[i];
    for (let j = 0; j < w.length; j++) {
      const key = w.slice(0, j) + "*" + w.slice(j + 1);
      if (!this.map[key]) this.map[key] = [];
      this.map[key].push(w[j]);
    }
  }
};
MagicDictionary.prototype.search = function (searchWord) {
  for (let j = 0; j < searchWord.length; j++) {
    const key = searchWord.slice(0, j) + "*" + searchWord.slice(j + 1);
    const letters = this.map[key] || [];
    for (let k = 0; k < letters.length; k++) {
      if (letters[k] !== searchWord[j]) return true;
    }
  }
  return false;
};`,
          codes: {
            javascript: `function MagicDictionary() {
  this.map = Object.create(null);
}
MagicDictionary.prototype.buildDict = function (dictionary) {
  this.map = Object.create(null);
  for (let i = 0; i < dictionary.length; i++) {
    const w = dictionary[i];
    for (let j = 0; j < w.length; j++) {
      const key = w.slice(0, j) + "*" + w.slice(j + 1);
      if (!this.map[key]) this.map[key] = [];
      this.map[key].push(w[j]);
    }
  }
};
MagicDictionary.prototype.search = function (searchWord) {
  for (let j = 0; j < searchWord.length; j++) {
    const key = searchWord.slice(0, j) + "*" + searchWord.slice(j + 1);
    const letters = this.map[key] || [];
    for (let k = 0; k < letters.length; k++) {
      if (letters[k] !== searchWord[j]) return true;
    }
  }
  return false;
};`,
            python: `class MagicDictionary:
  def __init__(self):
    self.map = {}
  def buildDict(self, dictionary):
    self.map = {}
    for w in dictionary:
      for j in range(len(w)):
        key = w[:j] + "*" + w[j + 1:]
        self.map.setdefault(key, []).append(w[j])
  def search(self, searchWord):
    for j in range(len(searchWord)):
      key = searchWord[:j] + "*" + searchWord[j + 1:]
      for letter in self.map.get(key, []):
        if letter != searchWord[j]:
          return True
    return False`,
            java: `import java.util.*;
class MagicDictionary {
  Map<String, List<Character>> map = new HashMap<String, List<Character>>();
  public void buildDict(String[] dictionary) {
    map.clear();
    for (String w : dictionary) {
      for (int j = 0; j < w.length(); j++) {
        String key = w.substring(0, j) + "*" + w.substring(j + 1);
        map.computeIfAbsent(key, k -> new ArrayList<Character>()).add(w.charAt(j));
      }
    }
  }
  public boolean search(String searchWord) {
    for (int j = 0; j < searchWord.length(); j++) {
      String key = searchWord.substring(0, j) + "*" + searchWord.substring(j + 1);
      for (char letter : map.getOrDefault(key, Collections.emptyList())) {
        if (letter != searchWord.charAt(j)) return true;
      }
    }
    return false;
  }
}`,
            cpp: `struct MagicDictionary {
  unordered_map<string, vector<char>> mp;
  void buildDict(vector<string> dictionary) {
    mp.clear();
    for (auto& w : dictionary) {
      for (int j = 0; j < (int)w.size(); j++) {
        string key = w.substr(0, j) + "*" + w.substr(j + 1);
        mp[key].push_back(w[j]);
      }
    }
  }
  bool search(string searchWord) {
    for (int j = 0; j < (int)searchWord.size(); j++) {
      string key = searchWord.substr(0, j) + "*" + searchWord.substr(j + 1);
      for (char letter : mp[key]) if (letter != searchWord[j]) return true;
    }
    return false;
  }
};`,
            c: `/* pattern keys stored as original word with one '*' */
typedef struct { char key[48]; char letter; } Pair;
typedef struct { Pair p[4096]; int n; } MagicDictionary;
void buildDict(MagicDictionary* d, char dict[][48], int m) {
  int i, j; d->n = 0;
  for (i = 0; i < m; i++) {
    int L = (int)strlen(dict[i]);
    for (j = 0; j < L; j++) {
      strcpy(d->p[d->n].key, dict[i]);
      d->p[d->n].key[j] = '*';
      d->p[d->n].letter = dict[i][j];
      d->n++;
    }
  }
}
int search(MagicDictionary* d, const char* q) {
  char key[48]; int j, k, L = (int)strlen(q);
  for (j = 0; j < L; j++) {
    strcpy(key, q); key[j] = '*';
    for (k = 0; k < d->n; k++)
      if (strcmp(d->p[k].key, key) == 0 && d->p[k].letter != q[j]) return 1;
  }
  return 0;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(26 L)",
          space: "O(n L)",
          why: "Trie DFS with a leftover mismatch budget of 1. At the end of the query the budget must be 0 (exactly one change). Compact and matches the 'magic' story.",
          code: `function MagicDictionary() {
  this.root = { ch: Array(26).fill(null), end: false };
}
MagicDictionary.prototype.buildDict = function (dictionary) {
  this.root = { ch: Array(26).fill(null), end: false };
  for (let i = 0; i < dictionary.length; i++) {
    let cur = this.root;
    const w = dictionary[i];
    for (let j = 0; j < w.length; j++) {
      const idx = w.charCodeAt(j) - 97;
      if (!cur.ch[idx]) cur.ch[idx] = { ch: Array(26).fill(null), end: false };
      cur = cur.ch[idx];
    }
    cur.end = true;
  }
};
MagicDictionary.prototype.search = function (searchWord) {
  const root = this.root;
  function dfs(node, i, left) {
    if (!node) return false;
    if (i === searchWord.length) return node.end === true && left === 0;
    const idx = searchWord.charCodeAt(i) - 97;
    for (let k = 0; k < 26; k++) {
      const cost = k === idx ? 0 : 1;
      if (left - cost < 0) continue;
      if (dfs(node.ch[k], i + 1, left - cost)) return true;
    }
    return false;
  }
  return dfs(root, 0, 1);
};`,
          codes: {
            javascript: `function MagicDictionary() {
  this.root = { ch: Array(26).fill(null), end: false };
}
MagicDictionary.prototype.buildDict = function (dictionary) {
  this.root = { ch: Array(26).fill(null), end: false };
  for (let i = 0; i < dictionary.length; i++) {
    let cur = this.root;
    const w = dictionary[i];
    for (let j = 0; j < w.length; j++) {
      const idx = w.charCodeAt(j) - 97;
      if (!cur.ch[idx]) cur.ch[idx] = { ch: Array(26).fill(null), end: false };
      cur = cur.ch[idx];
    }
    cur.end = true;
  }
};
MagicDictionary.prototype.search = function (searchWord) {
  const root = this.root;
  function dfs(node, i, left) {
    if (!node) return false;
    if (i === searchWord.length) return node.end === true && left === 0;
    const idx = searchWord.charCodeAt(i) - 97;
    for (let k = 0; k < 26; k++) {
      const cost = k === idx ? 0 : 1;
      if (left - cost < 0) continue;
      if (dfs(node.ch[k], i + 1, left - cost)) return true;
    }
    return false;
  }
  return dfs(root, 0, 1);
};`,
            python: `class Node:
  def __init__(self):
    self.ch = [None] * 26
    self.end = False
class MagicDictionary:
  def __init__(self):
    self.root = Node()
  def buildDict(self, dictionary):
    self.root = Node()
    for w in dictionary:
      cur = self.root
      for c in w:
        idx = ord(c) - 97
        if cur.ch[idx] is None:
          cur.ch[idx] = Node()
        cur = cur.ch[idx]
      cur.end = True
  def search(self, searchWord):
    def dfs(node, i, left):
      if node is None:
        return False
      if i == len(searchWord):
        return node.end and left == 0
      idx = ord(searchWord[i]) - 97
      for k in range(26):
        cost = 0 if k == idx else 1
        if left - cost < 0:
          continue
        if dfs(node.ch[k], i + 1, left - cost):
          return True
      return False
    return dfs(self.root, 0, 1)`,
            java: `class MagicDictionary {
  static class Node {
    Node[] ch = new Node[26];
    boolean end;
  }
  Node root = new Node();
  public void buildDict(String[] dictionary) {
    root = new Node();
    for (String w : dictionary) {
      Node cur = root;
      for (int j = 0; j < w.length(); j++) {
        int idx = w.charAt(j) - 'a';
        if (cur.ch[idx] == null) cur.ch[idx] = new Node();
        cur = cur.ch[idx];
      }
      cur.end = true;
    }
  }
  boolean dfs(Node node, String q, int i, int left) {
    if (node == null) return false;
    if (i == q.length()) return node.end && left == 0;
    int idx = q.charAt(i) - 'a';
    for (int k = 0; k < 26; k++) {
      int cost = k == idx ? 0 : 1;
      if (left - cost < 0) continue;
      if (dfs(node.ch[k], q, i + 1, left - cost)) return true;
    }
    return false;
  }
  public boolean search(String searchWord) { return dfs(root, searchWord, 0, 1); }
}`,
            cpp: `struct MagicDictionary {
  struct Node { Node* ch[26] = {}; bool end = false; };
  Node* root = new Node();
  void buildDict(vector<string> dictionary) {
    root = new Node();
    for (auto& w : dictionary) {
      Node* cur = root;
      for (char c : w) {
        int idx = c - 'a';
        if (!cur->ch[idx]) cur->ch[idx] = new Node();
        cur = cur->ch[idx];
      }
      cur->end = true;
    }
  }
  bool dfs(Node* node, const string& q, int i, int left) {
    if (!node) return false;
    if (i == (int)q.size()) return node->end && left == 0;
    int idx = q[i] - 'a';
    for (int k = 0; k < 26; k++) {
      int cost = k == idx ? 0 : 1;
      if (left - cost < 0) continue;
      if (dfs(node->ch[k], q, i + 1, left - cost)) return true;
    }
    return false;
  }
  bool search(string searchWord) { return dfs(root, searchWord, 0, 1); }
};`,
            c: `int magicDfs(Node* node, const char* q, int i, int left) {
  int k, idx;
  if (!node) return 0;
  if (!q[i]) return node->end && left == 0;
  idx = q[i] - 'a';
  for (k = 0; k < 26; k++) {
    int cost = k == idx ? 0 : 1;
    if (left - cost < 0) continue;
    if (magicDfs(node->ch[k], q, i + 1, left - cost)) return 1;
  }
  return 0;
}`
          }
        }
      ]
    },
    {
      id: 6,
      level: "beginner",
      q: "Longest Word in Dictionary",
      ask: "Amazon · Google · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/longest-word-in-dictionary/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/longest-word-in-dictionary/"}],
      a: "From a list of words, return the longest word that can be built one character at a time from other words in the list. If there is a tie, return the lexicographically smallest. If none, return empty.\n\nExample: w, wo, wor, worl, world answers world. Each prefix was itself a word.\n\nBrute checks every prefix of every word. Optimal sorts then grows a set. More optimal DFS on a trie where every node on the path is an end.",
      solutions: [
        {
          name: "Brute",
          time: "O(n^2 L)",
          space: "O(n)",
          why: "Put words in a set. For each word, test that every prefix is in the set. Keep the longest, breaking ties lexicographically.",
          code: `function longestWord(words) {
  const set = Object.create(null);
  for (let i = 0; i < words.length; i++) set[words[i]] = true;
  let best = "";
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    let ok = true;
    for (let L = 1; L < w.length; L++) {
      if (!set[w.slice(0, L)]) { ok = false; break; }
    }
    if (!ok) continue;
    if (w.length > best.length || (w.length === best.length && w < best)) best = w;
  }
  return best;
}`,
          codes: {
            javascript: `function longestWord(words) {
  const set = Object.create(null);
  for (let i = 0; i < words.length; i++) set[words[i]] = true;
  let best = "";
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    let ok = true;
    for (let L = 1; L < w.length; L++) {
      if (!set[w.slice(0, L)]) { ok = false; break; }
    }
    if (!ok) continue;
    if (w.length > best.length || (w.length === best.length && w < best)) best = w;
  }
  return best;
}`,
            python: `def longestWord(words):
  s = set(words)
  best = ""
  for w in words:
    ok = True
    for L in range(1, len(w)):
      if w[:L] not in s:
        ok = False
        break
    if not ok:
      continue
    if len(w) > len(best) or (len(w) == len(best) and w < best):
      best = w
  return best`,
            java: `import java.util.*;
class Solution {
  public String longestWord(String[] words) {
    Set<String> set = new HashSet<String>(Arrays.asList(words));
    String best = "";
    for (String w : words) {
      boolean ok = true;
      for (int L = 1; L < w.length(); L++) {
        if (!set.contains(w.substring(0, L))) { ok = false; break; }
      }
      if (!ok) continue;
      if (w.length() > best.length() || (w.length() == best.length() && w.compareTo(best) < 0)) best = w;
    }
    return best;
  }
}`,
            cpp: `string longestWord(vector<string>& words) {
  unordered_set<string> st(words.begin(), words.end());
  string best;
  for (auto& w : words) {
    bool ok = true;
    for (int L = 1; L < (int)w.size(); L++) {
      if (!st.count(w.substr(0, L))) { ok = false; break; }
    }
    if (!ok) continue;
    if (w.size() > best.size() || (w.size() == best.size() && w < best)) best = w;
  }
  return best;
}`,
            c: `int hasWord(char words[][48], int n, const char* p) {
  int i; for (i = 0; i < n; i++) if (strcmp(words[i], p) == 0) return 1; return 0;
}
void longestWord(char words[][48], int n, char* best) {
  int i, L; best[0] = 0;
  for (i = 0; i < n; i++) {
    int ok = 1, len = (int)strlen(words[i]);
    char p[48];
    for (L = 1; L < len; L++) {
      memcpy(p, words[i], L); p[L] = 0;
      if (!hasWord(words, n, p)) { ok = 0; break; }
    }
    if (!ok) continue;
    if (len > (int)strlen(best) || (len == (int)strlen(best) && strcmp(words[i], best) < 0))
      strcpy(best, words[i]);
  }
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n L log n)",
          space: "O(n)",
          why: "Sort by length then lex. A word is valid if the set already holds word without its last letter (or the word has length 1). Insert only valid words. The last survivor is the answer if you also keep the lex-smallest of that length.",
          code: `function longestWord(words) {
  words = words.slice().sort(function (a, b) {
    if (a.length !== b.length) return a.length - b.length;
    return a < b ? -1 : a > b ? 1 : 0;
  });
  const good = Object.create(null);
  good[""] = true;
  let best = "";
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (good[w.slice(0, w.length - 1)]) {
      good[w] = true;
      if (w.length > best.length) best = w;
    }
  }
  return best;
}`,
          codes: {
            javascript: `function longestWord(words) {
  words = words.slice().sort(function (a, b) {
    if (a.length !== b.length) return a.length - b.length;
    return a < b ? -1 : a > b ? 1 : 0;
  });
  const good = Object.create(null);
  good[""] = true;
  let best = "";
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (good[w.slice(0, w.length - 1)]) {
      good[w] = true;
      if (w.length > best.length) best = w;
    }
  }
  return best;
}`,
            python: `def longestWord(words):
  words = sorted(words, key=lambda w: (len(w), w))
  good = set([""])
  best = ""
  for w in words:
    if w[:-1] in good:
      good.add(w)
      if len(w) > len(best):
        best = w
  return best`,
            java: `import java.util.*;
class Solution {
  public String longestWord(String[] words) {
    Arrays.sort(words, (a, b) -> a.length() != b.length() ? a.length() - b.length() : a.compareTo(b));
    Set<String> good = new HashSet<String>();
    good.add("");
    String best = "";
    for (String w : words) {
      if (good.contains(w.substring(0, w.length() - 1))) {
        good.add(w);
        if (w.length() > best.length()) best = w;
      }
    }
    return best;
  }
}`,
            cpp: `string longestWord(vector<string>& words) {
  auto a = words;
  sort(a.begin(), a.end(), [](const string& x, const string& y) {
    if (x.size() != y.size()) return x.size() < y.size();
    return x < y;
  });
  unordered_set<string> good;
  good.insert("");
  string best;
  for (auto& w : a) {
    if (good.count(w.substr(0, w.size() - 1))) {
      good.insert(w);
      if (w.size() > best.size()) best = w;
    }
  }
  return best;
}`,
            c: `/* sort words by length then strcmp, then scan */
int cmpLen(const void* A, const void* B) {
  const char* a = (const char*)A;
  const char* b = (const char*)B;
  int da = (int)strlen(a), db = (int)strlen(b);
  if (da != db) return da - db;
  return strcmp(a, b);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(total chars)",
          space: "O(total chars)",
          why: "Insert every word into a trie with an end flag. DFS only through end nodes. The deepest (then lex-smallest) path is the answer.",
          code: `function longestWord(words) {
  function node() { return { ch: Array(26).fill(null), end: false }; }
  const root = node();
  root.end = true;
  for (let i = 0; i < words.length; i++) {
    let cur = root;
    const w = words[i];
    for (let j = 0; j < w.length; j++) {
      const idx = w.charCodeAt(j) - 97;
      if (!cur.ch[idx]) cur.ch[idx] = node();
      cur = cur.ch[idx];
    }
    cur.end = true;
  }
  let best = "";
  function dfs(cur, path) {
    if (!cur.end) return;
    if (path.length > best.length || (path.length === best.length && path < best)) best = path;
    for (let i = 0; i < 26; i++) {
      if (!cur.ch[i]) continue;
      dfs(cur.ch[i], path + String.fromCharCode(97 + i));
    }
  }
  dfs(root, "");
  return best;
}`,
          codes: {
            javascript: `function longestWord(words) {
  function node() { return { ch: Array(26).fill(null), end: false }; }
  const root = node();
  root.end = true;
  for (let i = 0; i < words.length; i++) {
    let cur = root;
    const w = words[i];
    for (let j = 0; j < w.length; j++) {
      const idx = w.charCodeAt(j) - 97;
      if (!cur.ch[idx]) cur.ch[idx] = node();
      cur = cur.ch[idx];
    }
    cur.end = true;
  }
  let best = "";
  function dfs(cur, path) {
    if (!cur.end) return;
    if (path.length > best.length || (path.length === best.length && path < best)) best = path;
    for (let i = 0; i < 26; i++) {
      if (!cur.ch[i]) continue;
      dfs(cur.ch[i], path + String.fromCharCode(97 + i));
    }
  }
  dfs(root, "");
  return best;
}`,
            python: `def longestWord(words):
  def node():
    return {"ch": [None] * 26, "end": False}
  root = node()
  root["end"] = True
  for w in words:
    cur = root
    for ch in w:
      idx = ord(ch) - 97
      if cur["ch"][idx] is None:
        cur["ch"][idx] = node()
      cur = cur["ch"][idx]
    cur["end"] = True
  best = [""]
  def dfs(cur, path):
    if not cur["end"]:
      return
    if len(path) > len(best[0]) or (len(path) == len(best[0]) and path < best[0]):
      best[0] = path
    for i in range(26):
      if cur["ch"][i] is None:
        continue
      dfs(cur["ch"][i], path + chr(97 + i))
  dfs(root, "")
  return best[0]`,
            java: `class Solution {
  static class Node {
    Node[] ch = new Node[26];
    boolean end;
  }
  String best = "";
  void dfs(Node cur, String path) {
    if (!cur.end) return;
    if (path.length() > best.length() || (path.length() == best.length() && path.compareTo(best) < 0)) best = path;
    for (int i = 0; i < 26; i++) if (cur.ch[i] != null) dfs(cur.ch[i], path + (char) ('a' + i));
  }
  public String longestWord(String[] words) {
    Node root = new Node();
    root.end = true;
    for (String w : words) {
      Node cur = root;
      for (int j = 0; j < w.length(); j++) {
        int idx = w.charAt(j) - 'a';
        if (cur.ch[idx] == null) cur.ch[idx] = new Node();
        cur = cur.ch[idx];
      }
      cur.end = true;
    }
    best = "";
    dfs(root, "");
    return best;
  }
}`,
            cpp: `string longestWord(vector<string>& words) {
  struct Node { Node* ch[26] = {}; bool end = false; };
  Node* root = new Node();
  root->end = true;
  for (auto& w : words) {
    Node* cur = root;
    for (char c : w) {
      int idx = c - 'a';
      if (!cur->ch[idx]) cur->ch[idx] = new Node();
      cur = cur->ch[idx];
    }
    cur->end = true;
  }
  string best;
  function<void(Node*, string)> dfs = [&](Node* cur, string path) {
    if (!cur->end) return;
    if (path.size() > best.size() || (path.size() == best.size() && path < best)) best = path;
    for (int i = 0; i < 26; i++) if (cur->ch[i]) dfs(cur->ch[i], path + char('a' + i));
  };
  dfs(root, "");
  return best;
}`,
            c: `void lwDfs(Node* cur, char* path, int len, char* best) {
  int i;
  if (!cur->end) return;
  path[len] = 0;
  if (len > (int)strlen(best) || (len == (int)strlen(best) && strcmp(path, best) < 0)) strcpy(best, path);
  for (i = 0; i < 26; i++) {
    if (!cur->ch[i]) continue;
    path[len] = (char)('a' + i);
    lwDfs(cur->ch[i], path, len + 1, best);
  }
}`
          }
        }
      ]
    },
    {
      id: 7,
      level: "beginner",
      q: "Map Sum Pairs",
      ask: "Amazon · Google · Bloomberg",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/map-sum-pairs/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/map-sum-pairs/"}],
      a: "insert(key, val) sets the score of key (overwrite if the key already exists). sum(prefix) returns the total score of every key that starts with prefix.\n\nExample: insert apple 3, sum ap is 3, insert app 2, sum ap is 5.\n\nBrute stores the map and scans keys. Optimal adds the delta onto every prefix string. More optimal stores the running sum on trie nodes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n L) sum",
          space: "O(n L)",
          why: "A plain key -> val map. sum walks every key and adds val when the key starts with the prefix.",
          code: `function MapSum() {
  this.map = Object.create(null);
}
MapSum.prototype.insert = function (key, val) {
  this.map[key] = val;
};
MapSum.prototype.sum = function (prefix) {
  let s = 0;
  const keys = Object.keys(this.map);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (k.length >= prefix.length && k.slice(0, prefix.length) === prefix) s += this.map[k];
  }
  return s;
};`,
          codes: {
            javascript: `function MapSum() {
  this.map = Object.create(null);
}
MapSum.prototype.insert = function (key, val) {
  this.map[key] = val;
};
MapSum.prototype.sum = function (prefix) {
  let s = 0;
  const keys = Object.keys(this.map);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (k.length >= prefix.length && k.slice(0, prefix.length) === prefix) s += this.map[k];
  }
  return s;
};`,
            python: `class MapSum:
  def __init__(self):
    self.map = {}
  def insert(self, key, val):
    self.map[key] = val
  def sum(self, prefix):
    s = 0
    n = len(prefix)
    for k, v in self.map.items():
      if len(k) >= n and k[:n] == prefix:
        s += v
    return s`,
            java: `import java.util.*;
class MapSum {
  Map<String, Integer> map = new HashMap<String, Integer>();
  public void insert(String key, int val) { map.put(key, val); }
  public int sum(String prefix) {
    int s = 0;
    for (Map.Entry<String, Integer> e : map.entrySet()) {
      if (e.getKey().startsWith(prefix)) s += e.getValue();
    }
    return s;
  }
}`,
            cpp: `struct MapSum {
  unordered_map<string, int> mp;
  void insert(string key, int val) { mp[key] = val; }
  int sum(string prefix) {
    int s = 0, n = (int)prefix.size();
    for (auto& e : mp)
      if ((int)e.first.size() >= n && e.first.compare(0, n, prefix) == 0) s += e.second;
    return s;
  }
};`,
            c: `typedef struct { char k[48]; int v; } KV;
typedef struct { KV a[256]; int n; } MapSum;
void insert(MapSum* m, const char* key, int val) {
  int i; for (i = 0; i < m->n; i++) if (strcmp(m->a[i].k, key) == 0) { m->a[i].v = val; return; }
  strcpy(m->a[m->n].k, key); m->a[m->n].v = val; m->n++;
}
int sumPref(MapSum* m, const char* prefix) {
  int i, s = 0, n = (int)strlen(prefix);
  for (i = 0; i < m->n; i++)
    if ((int)strlen(m->a[i].k) >= n && strncmp(m->a[i].k, prefix, n) == 0) s += m->a[i].v;
  return s;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(L) insert and sum",
          space: "O(n L)",
          why: "Keep the latest val per key. On insert, delta = newVal - oldVal. Add delta to every prefix string of the key in a second map. sum is then one lookup.",
          code: `function MapSum() {
  this.val = Object.create(null);
  this.pref = Object.create(null);
}
MapSum.prototype.insert = function (key, v) {
  const old = this.val[key] || 0;
  const delta = v - old;
  this.val[key] = v;
  let p = "";
  for (let i = 0; i < key.length; i++) {
    p += key[i];
    this.pref[p] = (this.pref[p] || 0) + delta;
  }
};
MapSum.prototype.sum = function (prefix) {
  return this.pref[prefix] || 0;
};`,
          codes: {
            javascript: `function MapSum() {
  this.val = Object.create(null);
  this.pref = Object.create(null);
}
MapSum.prototype.insert = function (key, v) {
  const old = this.val[key] || 0;
  const delta = v - old;
  this.val[key] = v;
  let p = "";
  for (let i = 0; i < key.length; i++) {
    p += key[i];
    this.pref[p] = (this.pref[p] || 0) + delta;
  }
};
MapSum.prototype.sum = function (prefix) {
  return this.pref[prefix] || 0;
};`,
            python: `class MapSum:
  def __init__(self):
    self.val = {}
    self.pref = {}
  def insert(self, key, v):
    old = self.val.get(key, 0)
    delta = v - old
    self.val[key] = v
    p = ""
    for ch in key:
      p += ch
      self.pref[p] = self.pref.get(p, 0) + delta
  def sum(self, prefix):
    return self.pref.get(prefix, 0)`,
            java: `import java.util.*;
class MapSum {
  Map<String, Integer> val = new HashMap<String, Integer>();
  Map<String, Integer> pref = new HashMap<String, Integer>();
  public void insert(String key, int v) {
    int old = val.getOrDefault(key, 0);
    int delta = v - old;
    val.put(key, v);
    StringBuilder p = new StringBuilder();
    for (int i = 0; i < key.length(); i++) {
      p.append(key.charAt(i));
      String s = p.toString();
      pref.put(s, pref.getOrDefault(s, 0) + delta);
    }
  }
  public int sum(String prefix) { return pref.getOrDefault(prefix, 0); }
}`,
            cpp: `struct MapSum {
  unordered_map<string, int> val, pref;
  void insert(string key, int v) {
    int old = val.count(key) ? val[key] : 0;
    int delta = v - old;
    val[key] = v;
    string p;
    for (char c : key) { p += c; pref[p] += delta; }
  }
  int sum(string prefix) { return pref[prefix]; }
};`,
            c: `typedef struct { char k[48]; int v; } KV;
typedef struct { KV val[256]; int vn; KV pref[2048]; int pn; } MapSum;
static int getKV(KV* a, int n, const char* k) {
  int i; for (i = 0; i < n; i++) if (strcmp(a[i].k, k) == 0) return i; return -1;
}
void insert(MapSum* m, const char* key, int v) {
  int i = getKV(m->val, m->vn, key);
  int old = i >= 0 ? m->val[i].v : 0;
  int delta = v - old;
  char p[48]; int k = 0, j;
  if (i >= 0) m->val[i].v = v;
  else { strcpy(m->val[m->vn].k, key); m->val[m->vn].v = v; m->vn++; }
  p[0] = 0;
  for (j = 0; key[j]; j++) {
    p[k++] = key[j]; p[k] = 0;
    i = getKV(m->pref, m->pn, p);
    if (i >= 0) m->pref[i].v += delta;
    else { strcpy(m->pref[m->pn].k, p); m->pref[m->pn].v = delta; m->pn++; }
  }
}
int sumPref(MapSum* m, const char* prefix) {
  int i = getKV(m->pref, m->pn, prefix);
  return i >= 0 ? m->pref[i].v : 0;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(L)",
          space: "O(n L) shared",
          why: "Trie node holds a running sum of values that pass through it. insert adds the delta along the path. sum walks the prefix and returns that node's sum.",
          code: `function MapSum() {
  this.root = { ch: Array(26).fill(null), sum: 0 };
  this.val = Object.create(null);
}
MapSum.prototype.insert = function (key, v) {
  const delta = v - (this.val[key] || 0);
  this.val[key] = v;
  let cur = this.root;
  for (let i = 0; i < key.length; i++) {
    const idx = key.charCodeAt(i) - 97;
    if (!cur.ch[idx]) cur.ch[idx] = { ch: Array(26).fill(null), sum: 0 };
    cur = cur.ch[idx];
    cur.sum += delta;
  }
};
MapSum.prototype.sum = function (prefix) {
  let cur = this.root;
  for (let i = 0; i < prefix.length; i++) {
    const idx = prefix.charCodeAt(i) - 97;
    if (!cur.ch[idx]) return 0;
    cur = cur.ch[idx];
  }
  return cur.sum;
};`,
          codes: {
            javascript: `function MapSum() {
  this.root = { ch: Array(26).fill(null), sum: 0 };
  this.val = Object.create(null);
}
MapSum.prototype.insert = function (key, v) {
  const delta = v - (this.val[key] || 0);
  this.val[key] = v;
  let cur = this.root;
  for (let i = 0; i < key.length; i++) {
    const idx = key.charCodeAt(i) - 97;
    if (!cur.ch[idx]) cur.ch[idx] = { ch: Array(26).fill(null), sum: 0 };
    cur = cur.ch[idx];
    cur.sum += delta;
  }
};
MapSum.prototype.sum = function (prefix) {
  let cur = this.root;
  for (let i = 0; i < prefix.length; i++) {
    const idx = prefix.charCodeAt(i) - 97;
    if (!cur.ch[idx]) return 0;
    cur = cur.ch[idx];
  }
  return cur.sum;
};`,
            python: `class Node:
  def __init__(self):
    self.ch = [None] * 26
    self.sum = 0
class MapSum:
  def __init__(self):
    self.root = Node()
    self.val = {}
  def insert(self, key, v):
    delta = v - self.val.get(key, 0)
    self.val[key] = v
    cur = self.root
    for c in key:
      idx = ord(c) - 97
      if cur.ch[idx] is None:
        cur.ch[idx] = Node()
      cur = cur.ch[idx]
      cur.sum += delta
  def sum(self, prefix):
    cur = self.root
    for c in prefix:
      idx = ord(c) - 97
      if cur.ch[idx] is None:
        return 0
      cur = cur.ch[idx]
    return cur.sum`,
            java: `import java.util.*;
class MapSum {
  static class Node {
    Node[] ch = new Node[26];
    int sum;
  }
  Node root = new Node();
  Map<String, Integer> val = new HashMap<String, Integer>();
  public void insert(String key, int v) {
    int delta = v - val.getOrDefault(key, 0);
    val.put(key, v);
    Node cur = root;
    for (int i = 0; i < key.length(); i++) {
      int idx = key.charAt(i) - 'a';
      if (cur.ch[idx] == null) cur.ch[idx] = new Node();
      cur = cur.ch[idx];
      cur.sum += delta;
    }
  }
  public int sum(String prefix) {
    Node cur = root;
    for (int i = 0; i < prefix.length(); i++) {
      int idx = prefix.charAt(i) - 'a';
      if (cur.ch[idx] == null) return 0;
      cur = cur.ch[idx];
    }
    return cur.sum;
  }
}`,
            cpp: `struct MapSum {
  struct Node { Node* ch[26] = {}; int sum = 0; };
  Node* root = new Node();
  unordered_map<string, int> val;
  void insert(string key, int v) {
    int delta = v - (val.count(key) ? val[key] : 0);
    val[key] = v;
    Node* cur = root;
    for (char c : key) {
      int idx = c - 'a';
      if (!cur->ch[idx]) cur->ch[idx] = new Node();
      cur = cur->ch[idx];
      cur->sum += delta;
    }
  }
  int sum(string prefix) {
    Node* cur = root;
    for (char c : prefix) {
      int idx = c - 'a';
      if (!cur->ch[idx]) return 0;
      cur = cur->ch[idx];
    }
    return cur->sum;
  }
};`,
            c: `typedef struct MSNode { struct MSNode* ch[26]; int sum; } MSNode;
typedef struct { MSNode* root; KV val[256]; int vn; } MapSumT;
void msInsert(MapSumT* m, const char* key, int v) {
  int i = getKV(m->val, m->vn, key);
  int old = i >= 0 ? m->val[i].v : 0;
  int delta = v - old, j;
  MSNode* cur = m->root;
  if (i >= 0) m->val[i].v = v;
  else { strcpy(m->val[m->vn].k, key); m->val[m->vn].v = v; m->vn++; }
  for (j = 0; key[j]; j++) {
    int idx = key[j] - 'a';
    if (!cur->ch[idx]) cur->ch[idx] = (MSNode*)calloc(1, sizeof(MSNode));
    cur = cur->ch[idx];
    cur->sum += delta;
  }
}
int msSum(MapSumT* m, const char* prefix) {
  MSNode* cur = m->root;
  int j;
  for (j = 0; prefix[j]; j++) {
    int idx = prefix[j] - 'a';
    if (!cur->ch[idx]) return 0;
    cur = cur->ch[idx];
  }
  return cur->sum;
}`
          }
        }
      ]
    },
    {
      id: 8,
      level: "intermediate",
      q: "Search Suggestions System",
      ask: "Amazon · Google · Bloomberg · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/search-suggestions-system/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/phone-directory4628/1"}],
      a: "products is a list of strings. searchWord is typed one letter at a time. After each prefix, return up to 3 product names that start with that prefix, in lexicographic order.\n\nExample: products = mobile, mouse, moneypot, monitor, mousepad and searchWord = mouse. After m, mo, mou, mous, mouse the lists grow from mobile/moneypot/monitor toward mouse/mousepad.\n\nBrute filters after every extra letter. Optimal sorts once then binary-searches the prefix range. More optimal stores 3 suggestions on each trie node.",
      solutions: [
        {
          name: "Brute",
          time: "O(|s| n L)",
          space: "O(n)",
          why: "After each extra character, scan every product, keep those with the prefix, sort, take 3. Correct and slow.",
          code: `function suggestedProducts(products, searchWord) {
  const out = [];
  let pref = "";
  for (let i = 0; i < searchWord.length; i++) {
    pref += searchWord[i];
    const hit = [];
    for (let j = 0; j < products.length; j++) {
      const p = products[j];
      if (p.length >= pref.length && p.slice(0, pref.length) === pref) hit.push(p);
    }
    hit.sort();
    out.push(hit.slice(0, 3));
  }
  return out;
}`,
          codes: {
            javascript: `function suggestedProducts(products, searchWord) {
  const out = [];
  let pref = "";
  for (let i = 0; i < searchWord.length; i++) {
    pref += searchWord[i];
    const hit = [];
    for (let j = 0; j < products.length; j++) {
      const p = products[j];
      if (p.length >= pref.length && p.slice(0, pref.length) === pref) hit.push(p);
    }
    hit.sort();
    out.push(hit.slice(0, 3));
  }
  return out;
}`,
            python: `def suggestedProducts(products, searchWord):
  out = []
  pref = ""
  for ch in searchWord:
    pref += ch
    hit = [p for p in products if len(p) >= len(pref) and p[:len(pref)] == pref]
    hit.sort()
    out.append(hit[:3])
  return out`,
            java: `import java.util.*;
class Solution {
  public List<List<String>> suggestedProducts(String[] products, String searchWord) {
    List<List<String>> out = new ArrayList<List<String>>();
    String pref = "";
    for (int i = 0; i < searchWord.length(); i++) {
      pref += searchWord.charAt(i);
      List<String> hit = new ArrayList<String>();
      for (String p : products) if (p.startsWith(pref)) hit.add(p);
      Collections.sort(hit);
      out.add(hit.subList(0, Math.min(3, hit.size())));
    }
    return out;
  }
}`,
            cpp: `vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
  vector<vector<string>> out;
  string pref;
  for (char c : searchWord) {
    pref += c;
    vector<string> hit;
    int n = (int)pref.size();
    for (auto& p : products)
      if ((int)p.size() >= n && p.compare(0, n, pref) == 0) hit.push_back(p);
    sort(hit.begin(), hit.end());
    if ((int)hit.size() > 3) hit.resize(3);
    out.push_back(hit);
  }
  return out;
}`,
            c: `/* after each prefix, collect matches, qsort, take 3 */
int cmpStr(const void* a, const void* b) {
  return strcmp((const char*)a, (const char*)b);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n L log n + |s| log n)",
          space: "O(n)",
          why: "Sort products once. For each growing prefix, lower-bound the first product >= prefix, then take the next three if they still share the prefix.",
          code: `function suggestedProducts(products, searchWord) {
  const a = products.slice().sort();
  const out = [];
  let pref = "";
  function lowerBound(s) {
    let lo = 0, hi = a.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (a[mid] < s) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
  for (let i = 0; i < searchWord.length; i++) {
    pref += searchWord[i];
    const k = lowerBound(pref);
    const row = [];
    for (let t = 0; t < 3 && k + t < a.length; t++) {
      const p = a[k + t];
      if (p.length >= pref.length && p.slice(0, pref.length) === pref) row.push(p);
    }
    out.push(row);
  }
  return out;
}`,
          codes: {
            javascript: `function suggestedProducts(products, searchWord) {
  const a = products.slice().sort();
  const out = [];
  let pref = "";
  function lowerBound(s) {
    let lo = 0, hi = a.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (a[mid] < s) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
  for (let i = 0; i < searchWord.length; i++) {
    pref += searchWord[i];
    const k = lowerBound(pref);
    const row = [];
    for (let t = 0; t < 3 && k + t < a.length; t++) {
      const p = a[k + t];
      if (p.length >= pref.length && p.slice(0, pref.length) === pref) row.push(p);
    }
    out.push(row);
  }
  return out;
}`,
            python: `import bisect
def suggestedProducts(products, searchWord):
  a = sorted(products)
  out = []
  pref = ""
  for ch in searchWord:
    pref += ch
    k = bisect.bisect_left(a, pref)
    row = []
    t = 0
    while t < 3 and k + t < len(a):
      p = a[k + t]
      if len(p) >= len(pref) and p[:len(pref)] == pref:
        row.append(p)
      t += 1
    out.append(row)
  return out`,
            java: `import java.util.*;
class Solution {
  public List<List<String>> suggestedProducts(String[] products, String searchWord) {
    Arrays.sort(products);
    List<List<String>> out = new ArrayList<List<String>>();
    String pref = "";
    for (int i = 0; i < searchWord.length(); i++) {
      pref += searchWord.charAt(i);
      int k = Arrays.binarySearch(products, pref);
      if (k < 0) k = -k - 1;
      List<String> row = new ArrayList<String>();
      for (int t = 0; t < 3 && k + t < products.length; t++) {
        if (products[k + t].startsWith(pref)) row.add(products[k + t]);
      }
      out.add(row);
    }
    return out;
  }
}`,
            cpp: `vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
  auto a = products;
  sort(a.begin(), a.end());
  vector<vector<string>> out;
  string pref;
  for (char c : searchWord) {
    pref += c;
    int k = (int)(lower_bound(a.begin(), a.end(), pref) - a.begin());
    vector<string> row;
    for (int t = 0; t < 3 && k + t < (int)a.size(); t++) {
      if (a[k + t].compare(0, pref.size(), pref) == 0) row.push_back(a[k + t]);
    }
    out.push_back(row);
  }
  return out;
}`,
            c: `int lowerBound(char a[][48], int n, const char* s) {
  int lo = 0, hi = n;
  while (lo < hi) {
    int mid = (lo + hi) / 2;
    if (strcmp(a[mid], s) < 0) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(total chars)",
          space: "O(total chars)",
          why: "Trie. At each node keep up to 3 lex-smallest words that pass through it (insert into a sorted short list). Typing searchWord is just walking children and reading that list.",
          code: `function suggestedProducts(products, searchWord) {
  function node() { return { ch: Array(26).fill(null), sug: [] }; }
  const root = node();
  function addSug(list, w) {
    list.push(w);
    list.sort();
    if (list.length > 3) list.pop();
  }
  for (let i = 0; i < products.length; i++) {
    const w = products[i];
    let cur = root;
    for (let j = 0; j < w.length; j++) {
      const idx = w.charCodeAt(j) - 97;
      if (!cur.ch[idx]) cur.ch[idx] = node();
      cur = cur.ch[idx];
      addSug(cur.sug, w);
    }
  }
  const out = [];
  let cur = root;
  for (let i = 0; i < searchWord.length; i++) {
    if (cur) cur = cur.ch[searchWord.charCodeAt(i) - 97];
    out.push(cur ? cur.sug.slice() : []);
  }
  return out;
}`,
          codes: {
            javascript: `function suggestedProducts(products, searchWord) {
  function node() { return { ch: Array(26).fill(null), sug: [] }; }
  const root = node();
  function addSug(list, w) {
    list.push(w);
    list.sort();
    if (list.length > 3) list.pop();
  }
  for (let i = 0; i < products.length; i++) {
    const w = products[i];
    let cur = root;
    for (let j = 0; j < w.length; j++) {
      const idx = w.charCodeAt(j) - 97;
      if (!cur.ch[idx]) cur.ch[idx] = node();
      cur = cur.ch[idx];
      addSug(cur.sug, w);
    }
  }
  const out = [];
  let cur = root;
  for (let i = 0; i < searchWord.length; i++) {
    if (cur) cur = cur.ch[searchWord.charCodeAt(i) - 97];
    out.push(cur ? cur.sug.slice() : []);
  }
  return out;
}`,
            python: `def suggestedProducts(products, searchWord):
  def node():
    return {"ch": [None] * 26, "sug": []}
  def addSug(lst, w):
    lst.append(w)
    lst.sort()
    if len(lst) > 3:
      lst.pop()
  root = node()
  for w in products:
    cur = root
    for ch in w:
      idx = ord(ch) - 97
      if cur["ch"][idx] is None:
        cur["ch"][idx] = node()
      cur = cur["ch"][idx]
      addSug(cur["sug"], w)
  out = []
  cur = root
  for ch in searchWord:
    if cur is not None:
      cur = cur["ch"][ord(ch) - 97]
    out.append(list(cur["sug"]) if cur is not None else [])
  return out`,
            java: `import java.util.*;
class Solution {
  static class Node {
    Node[] ch = new Node[26];
    List<String> sug = new ArrayList<String>();
  }
  void addSug(List<String> list, String w) {
    list.add(w);
    Collections.sort(list);
    if (list.size() > 3) list.remove(list.size() - 1);
  }
  public List<List<String>> suggestedProducts(String[] products, String searchWord) {
    Node root = new Node();
    for (String w : products) {
      Node cur = root;
      for (int j = 0; j < w.length(); j++) {
        int idx = w.charAt(j) - 'a';
        if (cur.ch[idx] == null) cur.ch[idx] = new Node();
        cur = cur.ch[idx];
        addSug(cur.sug, w);
      }
    }
    List<List<String>> out = new ArrayList<List<String>>();
    Node cur = root;
    for (int i = 0; i < searchWord.length(); i++) {
      if (cur != null) cur = cur.ch[searchWord.charAt(i) - 'a'];
      out.add(cur == null ? new ArrayList<String>() : new ArrayList<String>(cur.sug));
    }
    return out;
  }
}`,
            cpp: `vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
  struct Node { Node* ch[26] = {}; vector<string> sug; };
  auto addSug = [](vector<string>& list, const string& w) {
    list.push_back(w);
    sort(list.begin(), list.end());
    if (list.size() > 3) list.pop_back();
  };
  Node* root = new Node();
  for (auto& w : products) {
    Node* cur = root;
    for (char c : w) {
      int idx = c - 'a';
      if (!cur->ch[idx]) cur->ch[idx] = new Node();
      cur = cur->ch[idx];
      addSug(cur->sug, w);
    }
  }
  vector<vector<string>> out;
  Node* cur = root;
  for (char c : searchWord) {
    if (cur) cur = cur->ch[c - 'a'];
    out.push_back(cur ? cur->sug : vector<string>{});
  }
  return out;
}`,
            c: `typedef struct SugNode {
  struct SugNode* ch[26];
  char sug[3][48];
  int sn;
} SugNode;
void addSug(SugNode* n, const char* w) {
  int i, j;
  if (n->sn < 3) { strcpy(n->sug[n->sn++], w); }
  else if (strcmp(w, n->sug[2]) < 0) strcpy(n->sug[2], w);
  for (i = 0; i < n->sn; i++)
    for (j = i + 1; j < n->sn; j++)
      if (strcmp(n->sug[j], n->sug[i]) < 0) {
        char t[48]; strcpy(t, n->sug[i]); strcpy(n->sug[i], n->sug[j]); strcpy(n->sug[j], t);
      }
}`
          }
        }
      ]
    },
    {
      id: 9,
      level: "intermediate",
      q: "Implement Trie II / delete (count prefixes)",
      ask: "Amazon · Google · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/implement-trie-ii-prefix-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/trie-delete/"}],
      a: "A trie that can insert a word, erase one copy, countWordsEqualTo(word), and countWordsStartingWith(prefix). Duplicate inserts count. erase of a missing word is a no-op.\n\nExample: insert apple twice, countWordsEqualTo apple is 2, countWordsStartingWith app is 2, erase apple once, equal becomes 1.\n\nBrute stores a list. Optimal uses two hash maps. More optimal is a trie with word and prefix counters, unlinking empty children.",
      solutions: [
        {
          name: "Brute",
          time: "O(n L)",
          space: "O(n L)",
          why: "An array of words. equalTo counts exact matches. startingWith counts prefix matches. erase removes the first copy.",
          code: `function Trie() {
  this.words = [];
}
Trie.prototype.insert = function (word) {
  this.words.push(word);
};
Trie.prototype.countWordsEqualTo = function (word) {
  let c = 0;
  for (let i = 0; i < this.words.length; i++) if (this.words[i] === word) c++;
  return c;
};
Trie.prototype.countWordsStartingWith = function (prefix) {
  let c = 0;
  const n = prefix.length;
  for (let i = 0; i < this.words.length; i++) {
    const w = this.words[i];
    if (w.length >= n && w.slice(0, n) === prefix) c++;
  }
  return c;
};
Trie.prototype.erase = function (word) {
  const i = this.words.indexOf(word);
  if (i >= 0) this.words.splice(i, 1);
};`,
          codes: {
            javascript: `function Trie() {
  this.words = [];
}
Trie.prototype.insert = function (word) {
  this.words.push(word);
};
Trie.prototype.countWordsEqualTo = function (word) {
  let c = 0;
  for (let i = 0; i < this.words.length; i++) if (this.words[i] === word) c++;
  return c;
};
Trie.prototype.countWordsStartingWith = function (prefix) {
  let c = 0;
  const n = prefix.length;
  for (let i = 0; i < this.words.length; i++) {
    const w = this.words[i];
    if (w.length >= n && w.slice(0, n) === prefix) c++;
  }
  return c;
};
Trie.prototype.erase = function (word) {
  const i = this.words.indexOf(word);
  if (i >= 0) this.words.splice(i, 1);
};`,
            python: `class Trie:
  def __init__(self):
    self.words = []
  def insert(self, word):
    self.words.append(word)
  def countWordsEqualTo(self, word):
    return sum(1 for w in self.words if w == word)
  def countWordsStartingWith(self, prefix):
    n = len(prefix)
    return sum(1 for w in self.words if len(w) >= n and w[:n] == prefix)
  def erase(self, word):
    if word in self.words:
      self.words.remove(word)`,
            java: `import java.util.*;
class Trie {
  List<String> words = new ArrayList<String>();
  public void insert(String word) { words.add(word); }
  public int countWordsEqualTo(String word) {
    int c = 0;
    for (String w : words) if (w.equals(word)) c++;
    return c;
  }
  public int countWordsStartingWith(String prefix) {
    int c = 0;
    for (String w : words) if (w.startsWith(prefix)) c++;
    return c;
  }
  public void erase(String word) { words.remove(word); }
}`,
            cpp: `struct Trie {
  vector<string> words;
  void insert(string word) { words.push_back(word); }
  int countWordsEqualTo(string word) {
    int c = 0;
    for (auto& w : words) if (w == word) c++;
    return c;
  }
  int countWordsStartingWith(string prefix) {
    int c = 0, n = (int)prefix.size();
    for (auto& w : words)
      if ((int)w.size() >= n && w.compare(0, n, prefix) == 0) c++;
    return c;
  }
  void erase(string word) {
    auto it = find(words.begin(), words.end(), word);
    if (it != words.end()) words.erase(it);
  }
};`,
            c: `typedef struct { char words[512][48]; int n; } Trie;
void insert(Trie* t, const char* word) { strcpy(t->words[t->n++], word); }
int countWordsEqualTo(Trie* t, const char* word) {
  int i, c = 0; for (i = 0; i < t->n; i++) if (strcmp(t->words[i], word) == 0) c++; return c;
}
int countWordsStartingWith(Trie* t, const char* prefix) {
  int i, c = 0, n = (int)strlen(prefix);
  for (i = 0; i < t->n; i++)
    if ((int)strlen(t->words[i]) >= n && strncmp(t->words[i], prefix, n) == 0) c++;
  return c;
}
void erase(Trie* t, const char* word) {
  int i, j;
  for (i = 0; i < t->n; i++) if (strcmp(t->words[i], word) == 0) {
    for (j = i + 1; j < t->n; j++) strcpy(t->words[j - 1], t->words[j]);
    t->n--;
    return;
  }
}`
          }
        },
        {
          name: "Optimal",
          time: "O(L)",
          space: "O(n L)",
          why: "wordCount map and prefixCount map. insert / erase add or subtract 1 along every prefix. Queries are hash lookups. Watch erase: never go below zero.",
          code: `function Trie() {
  this.wordCount = Object.create(null);
  this.prefCount = Object.create(null);
}
Trie.prototype.insert = function (word) {
  this.wordCount[word] = (this.wordCount[word] || 0) + 1;
  let p = "";
  for (let i = 0; i < word.length; i++) {
    p += word[i];
    this.prefCount[p] = (this.prefCount[p] || 0) + 1;
  }
};
Trie.prototype.countWordsEqualTo = function (word) {
  return this.wordCount[word] || 0;
};
Trie.prototype.countWordsStartingWith = function (prefix) {
  return this.prefCount[prefix] || 0;
};
Trie.prototype.erase = function (word) {
  if (!this.wordCount[word]) return;
  this.wordCount[word]--;
  let p = "";
  for (let i = 0; i < word.length; i++) {
    p += word[i];
    this.prefCount[p]--;
  }
};`,
          codes: {
            javascript: `function Trie() {
  this.wordCount = Object.create(null);
  this.prefCount = Object.create(null);
}
Trie.prototype.insert = function (word) {
  this.wordCount[word] = (this.wordCount[word] || 0) + 1;
  let p = "";
  for (let i = 0; i < word.length; i++) {
    p += word[i];
    this.prefCount[p] = (this.prefCount[p] || 0) + 1;
  }
};
Trie.prototype.countWordsEqualTo = function (word) {
  return this.wordCount[word] || 0;
};
Trie.prototype.countWordsStartingWith = function (prefix) {
  return this.prefCount[prefix] || 0;
};
Trie.prototype.erase = function (word) {
  if (!this.wordCount[word]) return;
  this.wordCount[word]--;
  let p = "";
  for (let i = 0; i < word.length; i++) {
    p += word[i];
    this.prefCount[p]--;
  }
};`,
            python: `class Trie:
  def __init__(self):
    self.wordCount = {}
    self.prefCount = {}
  def insert(self, word):
    self.wordCount[word] = self.wordCount.get(word, 0) + 1
    p = ""
    for ch in word:
      p += ch
      self.prefCount[p] = self.prefCount.get(p, 0) + 1
  def countWordsEqualTo(self, word):
    return self.wordCount.get(word, 0)
  def countWordsStartingWith(self, prefix):
    return self.prefCount.get(prefix, 0)
  def erase(self, word):
    if not self.wordCount.get(word, 0):
      return
    self.wordCount[word] -= 1
    p = ""
    for ch in word:
      p += ch
      self.prefCount[p] -= 1`,
            java: `import java.util.*;
class Trie {
  Map<String, Integer> wordCount = new HashMap<String, Integer>();
  Map<String, Integer> prefCount = new HashMap<String, Integer>();
  public void insert(String word) {
    wordCount.put(word, wordCount.getOrDefault(word, 0) + 1);
    StringBuilder p = new StringBuilder();
    for (int i = 0; i < word.length(); i++) {
      p.append(word.charAt(i));
      String s = p.toString();
      prefCount.put(s, prefCount.getOrDefault(s, 0) + 1);
    }
  }
  public int countWordsEqualTo(String word) { return wordCount.getOrDefault(word, 0); }
  public int countWordsStartingWith(String prefix) { return prefCount.getOrDefault(prefix, 0); }
  public void erase(String word) {
    if (wordCount.getOrDefault(word, 0) == 0) return;
    wordCount.put(word, wordCount.get(word) - 1);
    StringBuilder p = new StringBuilder();
    for (int i = 0; i < word.length(); i++) {
      p.append(word.charAt(i));
      String s = p.toString();
      prefCount.put(s, prefCount.get(s) - 1);
    }
  }
}`,
            cpp: `struct Trie {
  unordered_map<string, int> wordCount, prefCount;
  void insert(string word) {
    wordCount[word]++;
    string p;
    for (char c : word) { p += c; prefCount[p]++; }
  }
  int countWordsEqualTo(string word) { return wordCount[word]; }
  int countWordsStartingWith(string prefix) { return prefCount[prefix]; }
  void erase(string word) {
    if (!wordCount[word]) return;
    wordCount[word]--;
    string p;
    for (char c : word) { p += c; prefCount[p]--; }
  }
};`,
            c: `typedef struct { char k[48]; int v; } KV;
typedef struct { KV word[512]; int wn; KV pref[4096]; int pn; } Trie;
static int findKV(KV* a, int n, const char* k) {
  int i; for (i = 0; i < n; i++) if (strcmp(a[i].k, k) == 0) return i; return -1;
}
static void addKV(KV* a, int* n, const char* k, int d) {
  int i = findKV(a, *n, k);
  if (i >= 0) a[i].v += d;
  else { strcpy(a[*n].k, k); a[*n].v = d; (*n)++; }
}
void insert(Trie* t, const char* word) {
  char p[48]; int i, k = 0;
  addKV(t->word, &t->wn, word, 1);
  p[0] = 0;
  for (i = 0; word[i]; i++) { p[k++] = word[i]; p[k] = 0; addKV(t->pref, &t->pn, p, 1); }
}
int countWordsEqualTo(Trie* t, const char* word) {
  int i = findKV(t->word, t->wn, word); return i >= 0 ? t->word[i].v : 0;
}
int countWordsStartingWith(Trie* t, const char* prefix) {
  int i = findKV(t->pref, t->pn, prefix); return i >= 0 ? t->pref[i].v : 0;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(L)",
          space: "O(total chars) shared",
          why: "Trie node has words (how many end here) and pref (how many pass through). insert increments. erase decrements and unlinks a child whose pref hits 0.",
          code: `function Trie() {
  this.root = { ch: Array(26).fill(null), words: 0, pref: 0 };
}
Trie.prototype.insert = function (word) {
  let cur = this.root;
  for (let i = 0; i < word.length; i++) {
    const idx = word.charCodeAt(i) - 97;
    if (!cur.ch[idx]) cur.ch[idx] = { ch: Array(26).fill(null), words: 0, pref: 0 };
    cur = cur.ch[idx];
    cur.pref++;
  }
  cur.words++;
};
Trie.prototype.countWordsEqualTo = function (word) {
  let cur = this.root;
  for (let i = 0; i < word.length; i++) {
    const idx = word.charCodeAt(i) - 97;
    if (!cur.ch[idx]) return 0;
    cur = cur.ch[idx];
  }
  return cur.words;
};
Trie.prototype.countWordsStartingWith = function (prefix) {
  let cur = this.root;
  for (let i = 0; i < prefix.length; i++) {
    const idx = prefix.charCodeAt(i) - 97;
    if (!cur.ch[idx]) return 0;
    cur = cur.ch[idx];
  }
  return cur.pref;
};
Trie.prototype.erase = function (word) {
  if (this.countWordsEqualTo(word) === 0) return;
  let cur = this.root;
  for (let i = 0; i < word.length; i++) {
    const idx = word.charCodeAt(i) - 97;
    const nxt = cur.ch[idx];
    nxt.pref--;
    if (nxt.pref === 0) { cur.ch[idx] = null; return; }
    cur = nxt;
  }
  cur.words--;
};`,
          codes: {
            javascript: `function Trie() {
  this.root = { ch: Array(26).fill(null), words: 0, pref: 0 };
}
Trie.prototype.insert = function (word) {
  let cur = this.root;
  for (let i = 0; i < word.length; i++) {
    const idx = word.charCodeAt(i) - 97;
    if (!cur.ch[idx]) cur.ch[idx] = { ch: Array(26).fill(null), words: 0, pref: 0 };
    cur = cur.ch[idx];
    cur.pref++;
  }
  cur.words++;
};
Trie.prototype.countWordsEqualTo = function (word) {
  let cur = this.root;
  for (let i = 0; i < word.length; i++) {
    const idx = word.charCodeAt(i) - 97;
    if (!cur.ch[idx]) return 0;
    cur = cur.ch[idx];
  }
  return cur.words;
};
Trie.prototype.countWordsStartingWith = function (prefix) {
  let cur = this.root;
  for (let i = 0; i < prefix.length; i++) {
    const idx = prefix.charCodeAt(i) - 97;
    if (!cur.ch[idx]) return 0;
    cur = cur.ch[idx];
  }
  return cur.pref;
};
Trie.prototype.erase = function (word) {
  if (this.countWordsEqualTo(word) === 0) return;
  let cur = this.root;
  for (let i = 0; i < word.length; i++) {
    const idx = word.charCodeAt(i) - 97;
    const nxt = cur.ch[idx];
    nxt.pref--;
    if (nxt.pref === 0) { cur.ch[idx] = null; return; }
    cur = nxt;
  }
  cur.words--;
};`,
            python: `class Node:
  def __init__(self):
    self.ch = [None] * 26
    self.words = 0
    self.pref = 0
class Trie:
  def __init__(self):
    self.root = Node()
  def insert(self, word):
    cur = self.root
    for c in word:
      idx = ord(c) - 97
      if cur.ch[idx] is None:
        cur.ch[idx] = Node()
      cur = cur.ch[idx]
      cur.pref += 1
    cur.words += 1
  def countWordsEqualTo(self, word):
    cur = self.root
    for c in word:
      idx = ord(c) - 97
      if cur.ch[idx] is None:
        return 0
      cur = cur.ch[idx]
    return cur.words
  def countWordsStartingWith(self, prefix):
    cur = self.root
    for c in prefix:
      idx = ord(c) - 97
      if cur.ch[idx] is None:
        return 0
      cur = cur.ch[idx]
    return cur.pref
  def erase(self, word):
    if self.countWordsEqualTo(word) == 0:
      return
    cur = self.root
    for c in word:
      idx = ord(c) - 97
      nxt = cur.ch[idx]
      nxt.pref -= 1
      if nxt.pref == 0:
        cur.ch[idx] = None
        return
      cur = nxt
    cur.words -= 1`,
            java: `class Trie {
  static class Node {
    Node[] ch = new Node[26];
    int words, pref;
  }
  Node root = new Node();
  public void insert(String word) {
    Node cur = root;
    for (int i = 0; i < word.length(); i++) {
      int idx = word.charAt(i) - 'a';
      if (cur.ch[idx] == null) cur.ch[idx] = new Node();
      cur = cur.ch[idx];
      cur.pref++;
    }
    cur.words++;
  }
  public int countWordsEqualTo(String word) {
    Node cur = root;
    for (int i = 0; i < word.length(); i++) {
      int idx = word.charAt(i) - 'a';
      if (cur.ch[idx] == null) return 0;
      cur = cur.ch[idx];
    }
    return cur.words;
  }
  public int countWordsStartingWith(String prefix) {
    Node cur = root;
    for (int i = 0; i < prefix.length(); i++) {
      int idx = prefix.charAt(i) - 'a';
      if (cur.ch[idx] == null) return 0;
      cur = cur.ch[idx];
    }
    return cur.pref;
  }
  public void erase(String word) {
    if (countWordsEqualTo(word) == 0) return;
    Node cur = root;
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
            cpp: `struct Trie {
  struct Node { Node* ch[26] = {}; int words = 0, pref = 0; };
  Node* root = new Node();
  void insert(string word) {
    Node* cur = root;
    for (char c : word) {
      int idx = c - 'a';
      if (!cur->ch[idx]) cur->ch[idx] = new Node();
      cur = cur->ch[idx];
      cur->pref++;
    }
    cur->words++;
  }
  int countWordsEqualTo(string word) {
    Node* cur = root;
    for (char c : word) {
      int idx = c - 'a';
      if (!cur->ch[idx]) return 0;
      cur = cur->ch[idx];
    }
    return cur->words;
  }
  int countWordsStartingWith(string prefix) {
    Node* cur = root;
    for (char c : prefix) {
      int idx = c - 'a';
      if (!cur->ch[idx]) return 0;
      cur = cur->ch[idx];
    }
    return cur->pref;
  }
  void erase(string word) {
    if (!countWordsEqualTo(word)) return;
    Node* cur = root;
    for (char c : word) {
      int idx = c - 'a';
      Node* nxt = cur->ch[idx];
      nxt->pref--;
      if (nxt->pref == 0) { cur->ch[idx] = nullptr; return; }
      cur = nxt;
    }
    cur->words--;
  }
};`,
            c: `typedef struct T2 { struct T2* ch[26]; int words, pref; } T2;
typedef struct { T2* root; } TrieII;
T2* t2new(void) { return (T2*)calloc(1, sizeof(T2)); }
void t2insert(TrieII* t, const char* word) {
  T2* cur = t->root;
  int i;
  for (i = 0; word[i]; i++) {
    int idx = word[i] - 'a';
    if (!cur->ch[idx]) cur->ch[idx] = t2new();
    cur = cur->ch[idx];
    cur->pref++;
  }
  cur->words++;
}`
          }
        }
      ]
    },
    {
      id: 10,
      level: "advanced",
      q: "Palindrome Pairs",
      ask: "Google · Airbnb · Amazon",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/palindrome-pairs/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/palindrome-pairs/"}],
      a: "Given unique words, return every pair of indexes [i, j] (i != j) such that words[i] + words[j] is a palindrome.\n\nExample: abcd, dcba, lls, s, sssll. Pairs include [0,1] (abcddcba), [1,0] (dcbaabcd), [3,2] (slls), [2,4] (llssssll).\n\nBrute concatenates every pair. Optimal maps each word to its index and tries every split. More optimal inserts reversed words into a trie and checks palindrome prefixes/suffixes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n^2 L)",
          space: "O(1)",
          why: "For every ordered pair, concatenate and test palindrome. Fine for tiny n, not for n = 5000.",
          code: `function palindromePairs(words) {
  function isPal(s) {
    let i = 0, j = s.length - 1;
    while (i < j) {
      if (s[i] !== s[j]) return false;
      i++;
      j--;
    }
    return true;
  }
  const out = [];
  const n = words.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      if (isPal(words[i] + words[j])) out.push([i, j]);
    }
  }
  return out;
}`,
          codes: {
            javascript: `function palindromePairs(words) {
  function isPal(s) {
    let i = 0, j = s.length - 1;
    while (i < j) {
      if (s[i] !== s[j]) return false;
      i++;
      j--;
    }
    return true;
  }
  const out = [];
  const n = words.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      if (isPal(words[i] + words[j])) out.push([i, j]);
    }
  }
  return out;
}`,
            python: `def palindromePairs(words):
  def isPal(s):
    i, j = 0, len(s) - 1
    while i < j:
      if s[i] != s[j]:
        return False
      i += 1
      j -= 1
    return True
  out = []
  n = len(words)
  for i in range(n):
    for j in range(n):
      if i == j:
        continue
      if isPal(words[i] + words[j]):
        out.append([i, j])
  return out`,
            java: `import java.util.*;
class Solution {
  boolean isPal(String s) {
    int i = 0, j = s.length() - 1;
    while (i < j) {
      if (s.charAt(i) != s.charAt(j)) return false;
      i++; j--;
    }
    return true;
  }
  public List<List<Integer>> palindromePairs(String[] words) {
    List<List<Integer>> out = new ArrayList<List<Integer>>();
    int n = words.length;
    for (int i = 0; i < n; i++)
      for (int j = 0; j < n; j++)
        if (i != j && isPal(words[i] + words[j]))
          out.add(Arrays.asList(i, j));
    return out;
  }
}`,
            cpp: `bool isPal(const string& s) {
  int i = 0, j = (int)s.size() - 1;
  while (i < j) { if (s[i] != s[j]) return false; i++; j--; }
  return true;
}
vector<vector<int>> palindromePairs(vector<string>& words) {
  vector<vector<int>> out;
  int n = (int)words.size();
  for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
      if (i != j && isPal(words[i] + words[j])) out.push_back({i, j});
  return out;
}`,
            c: `int isPal(const char* s) {
  int i = 0, j = (int)strlen(s) - 1;
  while (i < j) { if (s[i] != s[j]) return 0; i++; j--; }
  return 1;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n L^2)",
          space: "O(n L)",
          why: "Map word -> index. For each word, try every split. If the left half is a palindrome, look up reverse(right). If the right half is a palindrome, look up reverse(left). Handles the empty-word case.",
          code: `function palindromePairs(words) {
  function isPal(s, a, b) {
    while (a < b) {
      if (s[a] !== s[b]) return false;
      a++;
      b--;
    }
    return true;
  }
  const idx = Object.create(null);
  for (let i = 0; i < words.length; i++) idx[words[i]] = i;
  const out = [];
  const seen = Object.create(null);
  function add(i, j) {
    const key = i + "," + j;
    if (i === j || seen[key]) return;
    seen[key] = true;
    out.push([i, j]);
  }
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const n = w.length;
    for (let cut = 0; cut <= n; cut++) {
      if (isPal(w, cut, n - 1)) {
        const rev = w.slice(0, cut).split("").reverse().join("");
        if (idx[rev] !== undefined) add(i, idx[rev]);
      }
      if (cut > 0 && isPal(w, 0, cut - 1)) {
        const rev = w.slice(cut).split("").reverse().join("");
        if (idx[rev] !== undefined) add(idx[rev], i);
      }
    }
  }
  return out;
}`,
          codes: {
            javascript: `function palindromePairs(words) {
  function isPal(s, a, b) {
    while (a < b) {
      if (s[a] !== s[b]) return false;
      a++;
      b--;
    }
    return true;
  }
  const idx = Object.create(null);
  for (let i = 0; i < words.length; i++) idx[words[i]] = i;
  const out = [];
  const seen = Object.create(null);
  function add(i, j) {
    const key = i + "," + j;
    if (i === j || seen[key]) return;
    seen[key] = true;
    out.push([i, j]);
  }
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const n = w.length;
    for (let cut = 0; cut <= n; cut++) {
      if (isPal(w, cut, n - 1)) {
        const rev = w.slice(0, cut).split("").reverse().join("");
        if (idx[rev] !== undefined) add(i, idx[rev]);
      }
      if (cut > 0 && isPal(w, 0, cut - 1)) {
        const rev = w.slice(cut).split("").reverse().join("");
        if (idx[rev] !== undefined) add(idx[rev], i);
      }
    }
  }
  return out;
}`,
            python: `def palindromePairs(words):
  def isPal(s, a, b):
    while a < b:
      if s[a] != s[b]:
        return False
      a += 1
      b -= 1
    return True
  idx = {w: i for i, w in enumerate(words)}
  out = []
  seen = set()
  def add(i, j):
    if i == j or (i, j) in seen:
      return
    seen.add((i, j))
    out.append([i, j])
  for i, w in enumerate(words):
    n = len(w)
    for cut in range(n + 1):
      if isPal(w, cut, n - 1):
        rev = w[:cut][::-1]
        if rev in idx:
          add(i, idx[rev])
      if cut > 0 and isPal(w, 0, cut - 1):
        rev = w[cut:][::-1]
        if rev in idx:
          add(idx[rev], i)
  return out`,
            java: `import java.util.*;
class Solution {
  boolean isPal(String s, int a, int b) {
    while (a < b) {
      if (s.charAt(a) != s.charAt(b)) return false;
      a++; b--;
    }
    return true;
  }
  public List<List<Integer>> palindromePairs(String[] words) {
    Map<String, Integer> idx = new HashMap<String, Integer>();
    for (int i = 0; i < words.length; i++) idx.put(words[i], i);
    List<List<Integer>> out = new ArrayList<List<Integer>>();
    Set<String> seen = new HashSet<String>();
    for (int i = 0; i < words.length; i++) {
      String w = words[i];
      int n = w.length();
      for (int cut = 0; cut <= n; cut++) {
        if (isPal(w, cut, n - 1)) {
          String rev = new StringBuilder(w.substring(0, cut)).reverse().toString();
          if (idx.containsKey(rev)) {
            int j = idx.get(rev);
            String key = i + "," + j;
            if (i != j && seen.add(key)) out.add(Arrays.asList(i, j));
          }
        }
        if (cut > 0 && isPal(w, 0, cut - 1)) {
          String rev = new StringBuilder(w.substring(cut)).reverse().toString();
          if (idx.containsKey(rev)) {
            int j = idx.get(rev);
            String key = j + "," + i;
            if (i != j && seen.add(key)) out.add(Arrays.asList(j, i));
          }
        }
      }
    }
    return out;
  }
}`,
            cpp: `bool isPal(const string& s, int a, int b) {
  while (a < b) { if (s[a] != s[b]) return false; a++; b--; }
  return true;
}
vector<vector<int>> palindromePairs(vector<string>& words) {
  unordered_map<string, int> idx;
  for (int i = 0; i < (int)words.size(); i++) idx[words[i]] = i;
  vector<vector<int>> out;
  unordered_set<string> seen;
  auto add = [&](int i, int j) {
    if (i == j) return;
    string key = to_string(i) + "," + to_string(j);
    if (seen.count(key)) return;
    seen.insert(key);
    out.push_back({i, j});
  };
  for (int i = 0; i < (int)words.size(); i++) {
    string w = words[i];
    int n = (int)w.size();
    for (int cut = 0; cut <= n; cut++) {
      if (isPal(w, cut, n - 1)) {
        string rev = w.substr(0, cut);
        reverse(rev.begin(), rev.end());
        if (idx.count(rev)) add(i, idx[rev]);
      }
      if (cut > 0 && isPal(w, 0, cut - 1)) {
        string rev = w.substr(cut);
        reverse(rev.begin(), rev.end());
        if (idx.count(rev)) add(idx[rev], i);
      }
    }
  }
  return out;
}`,
            c: `/* map each word to index; try every split; reverse with a temp buffer */`
          }
        },
        {
          name: "More optimal",
          time: "O(n L^2)",
          space: "O(n L)",
          why: "Insert the reverse of every word into a trie, storing the index at the end. While walking a word, if the remaining suffix is a palindrome and the node is an end, you have a pair. Also collect end indexes whose leftover reverse is a palindrome. Same complexity, trie picture.",
          code: `function palindromePairs(words) {
  function isPal(s, a, b) {
    while (a < b) {
      if (s[a] !== s[b]) return false;
      a++;
      b--;
    }
    return true;
  }
  function node() { return { ch: {}, idx: -1, palBelow: [] }; }
  const root = node();
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    let cur = root;
    for (let j = w.length - 1; j >= 0; j--) {
      if (isPal(w, 0, j)) cur.palBelow.push(i);
      const c = w[j];
      if (!cur.ch[c]) cur.ch[c] = node();
      cur = cur.ch[c];
    }
    cur.idx = i;
    cur.palBelow.push(i);
  }
  const out = [];
  const seen = Object.create(null);
  function add(i, j) {
    const key = i + "," + j;
    if (i === j || seen[key]) return;
    seen[key] = true;
    out.push([i, j]);
  }
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    let cur = root;
    let k = 0;
    for (; k < w.length; k++) {
      if (cur.idx >= 0 && isPal(w, k, w.length - 1)) add(i, cur.idx);
      if (!cur.ch[w[k]]) { cur = null; break; }
      cur = cur.ch[w[k]];
    }
    if (cur) {
      for (let t = 0; t < cur.palBelow.length; t++) add(i, cur.palBelow[t]);
    }
  }
  return out;
}`,
          codes: {
            javascript: `function palindromePairs(words) {
  function isPal(s, a, b) {
    while (a < b) {
      if (s[a] !== s[b]) return false;
      a++;
      b--;
    }
    return true;
  }
  function node() { return { ch: {}, idx: -1, palBelow: [] }; }
  const root = node();
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    let cur = root;
    for (let j = w.length - 1; j >= 0; j--) {
      if (isPal(w, 0, j)) cur.palBelow.push(i);
      const c = w[j];
      if (!cur.ch[c]) cur.ch[c] = node();
      cur = cur.ch[c];
    }
    cur.idx = i;
    cur.palBelow.push(i);
  }
  const out = [];
  const seen = Object.create(null);
  function add(i, j) {
    const key = i + "," + j;
    if (i === j || seen[key]) return;
    seen[key] = true;
    out.push([i, j]);
  }
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    let cur = root;
    let k = 0;
    for (; k < w.length; k++) {
      if (cur.idx >= 0 && isPal(w, k, w.length - 1)) add(i, cur.idx);
      if (!cur.ch[w[k]]) { cur = null; break; }
      cur = cur.ch[w[k]];
    }
    if (cur) {
      for (let t = 0; t < cur.palBelow.length; t++) add(i, cur.palBelow[t]);
    }
  }
  return out;
}`,
            python: `def palindromePairs(words):
  def isPal(s, a, b):
    while a < b:
      if s[a] != s[b]:
        return False
      a += 1
      b -= 1
    return True
  def node():
    return {"ch": {}, "idx": -1, "palBelow": []}
  root = node()
  for i, w in enumerate(words):
    cur = root
    for j in range(len(w) - 1, -1, -1):
      if isPal(w, 0, j):
        cur["palBelow"].append(i)
      c = w[j]
      if c not in cur["ch"]:
        cur["ch"][c] = node()
      cur = cur["ch"][c]
    cur["idx"] = i
    cur["palBelow"].append(i)
  out = []
  seen = set()
  def add(i, j):
    if i == j or (i, j) in seen:
      return
    seen.add((i, j))
    out.append([i, j])
  for i, w in enumerate(words):
    cur = root
    k = 0
    fell = False
    while k < len(w):
      if cur["idx"] >= 0 and isPal(w, k, len(w) - 1):
        add(i, cur["idx"])
      if w[k] not in cur["ch"]:
        fell = True
        break
      cur = cur["ch"][w[k]]
      k += 1
    if not fell:
      for j in cur["palBelow"]:
        add(i, j)
  return out`,
            java: `import java.util.*;
class Solution {
  static class Node {
    Map<Character, Node> ch = new HashMap<Character, Node>();
    int idx = -1;
    List<Integer> palBelow = new ArrayList<Integer>();
  }
  boolean isPal(String s, int a, int b) {
    while (a < b) {
      if (s.charAt(a) != s.charAt(b)) return false;
      a++; b--;
    }
    return true;
  }
  public List<List<Integer>> palindromePairs(String[] words) {
    Node root = new Node();
    for (int i = 0; i < words.length; i++) {
      String w = words[i];
      Node cur = root;
      for (int j = w.length() - 1; j >= 0; j--) {
        if (isPal(w, 0, j)) cur.palBelow.add(i);
        char c = w.charAt(j);
        cur.ch.putIfAbsent(c, new Node());
        cur = cur.ch.get(c);
      }
      cur.idx = i;
      cur.palBelow.add(i);
    }
    List<List<Integer>> out = new ArrayList<List<Integer>>();
    Set<String> seen = new HashSet<String>();
    for (int i = 0; i < words.length; i++) {
      String w = words[i];
      Node cur = root;
      boolean fell = false;
      for (int k = 0; k < w.length(); k++) {
        if (cur.idx >= 0 && isPal(w, k, w.length() - 1)) {
          String key = i + "," + cur.idx;
          if (i != cur.idx && seen.add(key)) out.add(Arrays.asList(i, cur.idx));
        }
        if (!cur.ch.containsKey(w.charAt(k))) { fell = true; break; }
        cur = cur.ch.get(w.charAt(k));
      }
      if (!fell) {
        for (int j : cur.palBelow) {
          String key = i + "," + j;
          if (i != j && seen.add(key)) out.add(Arrays.asList(i, j));
        }
      }
    }
    return out;
  }
}`,
            cpp: `struct Node {
  unordered_map<char, Node*> ch;
  int idx = -1;
  vector<int> palBelow;
};
bool isPal(const string& s, int a, int b) {
  while (a < b) { if (s[a] != s[b]) return false; a++; b--; }
  return true;
}
vector<vector<int>> palindromePairs(vector<string>& words) {
  Node* root = new Node();
  for (int i = 0; i < (int)words.size(); i++) {
    const string& w = words[i];
    Node* cur = root;
    for (int j = (int)w.size() - 1; j >= 0; j--) {
      if (isPal(w, 0, j)) cur->palBelow.push_back(i);
      char c = w[j];
      if (!cur->ch.count(c)) cur->ch[c] = new Node();
      cur = cur->ch[c];
    }
    cur->idx = i;
    cur->palBelow.push_back(i);
  }
  vector<vector<int>> out;
  unordered_set<string> seen;
  auto add = [&](int i, int j) {
    if (i == j) return;
    string key = to_string(i) + "," + to_string(j);
    if (seen.count(key)) return;
    seen.insert(key);
    out.push_back({i, j});
  };
  for (int i = 0; i < (int)words.size(); i++) {
    const string& w = words[i];
    Node* cur = root;
    bool fell = false;
    for (int k = 0; k < (int)w.size(); k++) {
      if (cur->idx >= 0 && isPal(w, k, (int)w.size() - 1)) add(i, cur->idx);
      if (!cur->ch.count(w[k])) { fell = true; break; }
      cur = cur->ch[w[k]];
    }
    if (!fell) for (int j : cur->palBelow) add(i, j);
  }
  return out;
}`,
            c: `/* reverse-insert each word into a 26-way trie; palBelow lists indexes
   whose remaining prefix (in original order) is a palindrome */`
          }
        }
      ]
    },
    {
      id: 11,
      level: "advanced",
      q: "Maximum XOR of Two Numbers in an Array",
      ask: "Google · Amazon · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/maximum-xor-of-two-numbers-in-an-array/1"}],
      a: "Return the largest XOR of any two numbers in the array. You may pick the same value at two indexes if it appears twice, but usually you pick two positions.\n\nExample: [3, 10, 5, 25, 2, 8] answers 28 because 5 xor 25 is 28.\n\nBrute tries every pair. Optimal greedily builds the answer bit by bit with a prefix set. More optimal is a 32-bit binary trie.",
      solutions: [
        {
          name: "Brute",
          time: "O(n^2)",
          space: "O(1)",
          why: "XOR every pair, keep the max. Correct, too slow for n = 2e5.",
          code: `function findMaximumXOR(nums) {
  let best = 0;
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const x = nums[i] ^ nums[j];
      if (x > best) best = x;
    }
  }
  return best;
}`,
          codes: {
            javascript: `function findMaximumXOR(nums) {
  let best = 0;
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const x = nums[i] ^ nums[j];
      if (x > best) best = x;
    }
  }
  return best;
}`,
            python: `def findMaximumXOR(nums):
  best = 0
  n = len(nums)
  for i in range(n):
    for j in range(i + 1, n):
      x = nums[i] ^ nums[j]
      if x > best:
        best = x
  return best`,
            java: `class Solution {
  public int findMaximumXOR(int[] nums) {
    int best = 0, n = nums.length;
    for (int i = 0; i < n; i++)
      for (int j = i + 1; j < n; j++)
        best = Math.max(best, nums[i] ^ nums[j]);
    return best;
  }
}`,
            cpp: `int findMaximumXOR(vector<int>& nums) {
  int best = 0, n = (int)nums.size();
  for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++) best = max(best, nums[i] ^ nums[j]);
  return best;
}`,
            c: `int findMaximumXOR(int* nums, int n) {
  int best = 0, i, j;
  for (i = 0; i < n; i++)
    for (j = i + 1; j < n; j++) {
      int x = nums[i] ^ nums[j];
      if (x > best) best = x;
    }
  return best;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Build the answer from bit 31 down. Assume the next bit can be 1. If some prefix ^ candidate exists in the set of current prefixes, keep that bit. Hash set of prefixes is the usual O(n) per bit trick.",
          code: `function findMaximumXOR(nums) {
  let best = 0;
  let mask = 0;
  for (let b = 31; b >= 0; b--) {
    mask |= (1 << b);
    const seen = Object.create(null);
    for (let i = 0; i < nums.length; i++) seen[nums[i] & mask] = true;
    const cand = best | (1 << b);
    let ok = false;
    const keys = Object.keys(seen);
    for (let i = 0; i < keys.length; i++) {
      const p = keys[i] | 0;
      if (seen[(p ^ cand) >>> 0] || seen[p ^ cand]) { ok = true; break; }
    }
    if (ok) best = cand;
  }
  return best;
}`,
          codes: {
            javascript: `function findMaximumXOR(nums) {
  let best = 0;
  let mask = 0;
  for (let b = 31; b >= 0; b--) {
    mask |= (1 << b);
    const seen = Object.create(null);
    for (let i = 0; i < nums.length; i++) seen[nums[i] & mask] = true;
    const cand = best | (1 << b);
    let ok = false;
    const keys = Object.keys(seen);
    for (let i = 0; i < keys.length; i++) {
      const p = keys[i] | 0;
      if (seen[(p ^ cand) >>> 0] || seen[p ^ cand]) { ok = true; break; }
    }
    if (ok) best = cand;
  }
  return best;
}`,
            python: `def findMaximumXOR(nums):
  best = 0
  mask = 0
  for b in range(31, -1, -1):
    mask |= (1 << b)
    seen = set(x & mask for x in nums)
    cand = best | (1 << b)
    for p in seen:
      if (p ^ cand) in seen:
        best = cand
        break
  return best`,
            java: `import java.util.*;
class Solution {
  public int findMaximumXOR(int[] nums) {
    int best = 0, mask = 0;
    for (int b = 31; b >= 0; b--) {
      mask |= (1 << b);
      Set<Integer> seen = new HashSet<Integer>();
      for (int x : nums) seen.add(x & mask);
      int cand = best | (1 << b);
      for (int p : seen) {
        if (seen.contains(p ^ cand)) { best = cand; break; }
      }
    }
    return best;
  }
}`,
            cpp: `int findMaximumXOR(vector<int>& nums) {
  int best = 0, mask = 0;
  for (int b = 31; b >= 0; b--) {
    mask |= (1 << b);
    unordered_set<int> seen;
    for (int x : nums) seen.insert(x & mask);
    int cand = best | (1 << b);
    for (int p : seen) {
      if (seen.count(p ^ cand)) { best = cand; break; }
    }
  }
  return best;
}`,
            c: `int findMaximumXORPref(int* nums, int n) {
  int best = 0, mask = 0, b, i, k;
  int seen[4096];
  for (b = 31; b >= 0; b--) {
    mask |= (1 << b);
    int sn = 0;
    for (i = 0; i < n; i++) {
      int p = nums[i] & mask;
      int found = 0;
      for (k = 0; k < sn; k++) if (seen[k] == p) found = 1;
      if (!found && sn < 4096) seen[sn++] = p;
    }
    int cand = best | (1 << b), ok = 0;
    for (i = 0; i < sn && !ok; i++)
      for (k = 0; k < sn; k++) if (seen[k] == (seen[i] ^ cand)) ok = 1;
    if (ok) best = cand;
  }
  return best;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Insert every number into a binary trie (high bit first). For each number, walk the opposite bit when it exists. That walk is the max XOR against the set. Same O(32 n), clearer as a trie.",
          code: `function findMaximumXOR(nums) {
  function bitNode() { return { ch: [null, null] }; }
  const root = bitNode();
  function insert(x) {
    let cur = root;
    for (let b = 31; b >= 0; b--) {
      const bit = (x >> b) & 1;
      if (!cur.ch[bit]) cur.ch[bit] = bitNode();
      cur = cur.ch[bit];
    }
  }
  function best(x) {
    let cur = root;
    let ans = 0;
    for (let b = 31; b >= 0; b--) {
      const bit = (x >> b) & 1;
      const want = 1 - bit;
      if (cur.ch[want]) {
        ans |= (1 << b);
        cur = cur.ch[want];
      } else cur = cur.ch[bit];
    }
    return ans;
  }
  for (let i = 0; i < nums.length; i++) insert(nums[i]);
  let out = 0;
  for (let i = 0; i < nums.length; i++) {
    const v = best(nums[i]);
    if (v > out) out = v;
  }
  return out;
}`,
          codes: {
            javascript: `function findMaximumXOR(nums) {
  function bitNode() { return { ch: [null, null] }; }
  const root = bitNode();
  function insert(x) {
    let cur = root;
    for (let b = 31; b >= 0; b--) {
      const bit = (x >> b) & 1;
      if (!cur.ch[bit]) cur.ch[bit] = bitNode();
      cur = cur.ch[bit];
    }
  }
  function best(x) {
    let cur = root;
    let ans = 0;
    for (let b = 31; b >= 0; b--) {
      const bit = (x >> b) & 1;
      const want = 1 - bit;
      if (cur.ch[want]) {
        ans |= (1 << b);
        cur = cur.ch[want];
      } else cur = cur.ch[bit];
    }
    return ans;
  }
  for (let i = 0; i < nums.length; i++) insert(nums[i]);
  let out = 0;
  for (let i = 0; i < nums.length; i++) {
    const v = best(nums[i]);
    if (v > out) out = v;
  }
  return out;
}`,
            python: `def findMaximumXOR(nums):
  def bitNode():
    return {"ch": [None, None]}
  root = bitNode()
  def insert(x):
    cur = root
    for b in range(31, -1, -1):
      bit = (x >> b) & 1
      if cur["ch"][bit] is None:
        cur["ch"][bit] = bitNode()
      cur = cur["ch"][bit]
  def best(x):
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
    return ans
  for x in nums:
    insert(x)
  out = 0
  for x in nums:
    v = best(x)
    if v > out:
      out = v
  return out`,
            java: `class Solution {
  static class Node {
    Node[] ch = new Node[2];
  }
  void insert(Node root, int x) {
    Node cur = root;
    for (int b = 31; b >= 0; b--) {
      int bit = (x >> b) & 1;
      if (cur.ch[bit] == null) cur.ch[bit] = new Node();
      cur = cur.ch[bit];
    }
  }
  int best(Node root, int x) {
    Node cur = root;
    int ans = 0;
    for (int b = 31; b >= 0; b--) {
      int bit = (x >> b) & 1, want = 1 - bit;
      if (cur.ch[want] != null) { ans |= (1 << b); cur = cur.ch[want]; }
      else cur = cur.ch[bit];
    }
    return ans;
  }
  public int findMaximumXOR(int[] nums) {
    Node root = new Node();
    for (int x : nums) insert(root, x);
    int out = 0;
    for (int x : nums) out = Math.max(out, best(root, x));
    return out;
  }
}`,
            cpp: `int findMaximumXOR(vector<int>& nums) {
  struct Node { Node* ch[2] = {}; };
  Node* root = new Node();
  auto insert = [&](int x) {
    Node* cur = root;
    for (int b = 31; b >= 0; b--) {
      int bit = (x >> b) & 1;
      if (!cur->ch[bit]) cur->ch[bit] = new Node();
      cur = cur->ch[bit];
    }
  };
  auto best = [&](int x) {
    Node* cur = root;
    int ans = 0;
    for (int b = 31; b >= 0; b--) {
      int bit = (x >> b) & 1, want = 1 - bit;
      if (cur->ch[want]) { ans |= (1 << b); cur = cur->ch[want]; }
      else cur = cur->ch[bit];
    }
    return ans;
  };
  for (int x : nums) insert(x);
  int out = 0;
  for (int x : nums) out = max(out, best(x));
  return out;
}`,
            c: `typedef struct BNode { struct BNode* ch[2]; } BNode;
BNode* bnew(void) { return (BNode*)calloc(1, sizeof(BNode)); }
void binsert(BNode* root, int x) {
  BNode* cur = root;
  int b;
  for (b = 31; b >= 0; b--) {
    int bit = (x >> b) & 1;
    if (!cur->ch[bit]) cur->ch[bit] = bnew();
    cur = cur->ch[bit];
  }
}
int bbest(BNode* root, int x) {
  BNode* cur = root;
  int ans = 0, b;
  for (b = 31; b >= 0; b--) {
    int bit = (x >> b) & 1, want = 1 - bit;
    if (cur->ch[want]) { ans |= (1 << b); cur = cur->ch[want]; }
    else cur = cur->ch[bit];
  }
  return ans;
}`
          }
        }
      ]
    },
    {
      id: 12,
      level: "beginner",
      q: "Count Prefix and Suffix Pairs / Prefix Count",
      ask: "Amazon · Google · Bloomberg",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/counting-words-with-a-given-prefix/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/count-the-number-of-words-with-given-prefix/"}],
      a: "Prefix Count (LC counting-words-with-a-given-prefix): count how many words start with pref.\n\nRelated: Count Prefix and Suffix Pairs asks how many index pairs (i, j) with i < j have words[i] as both a prefix and a suffix of words[j].\n\nExample (prefix count): words = pay, attention, practice, attend, pref = at. Answer 2 (attention, attend).\n\nBrute uses startsWith. Optimal still scans but bails early. More optimal inserts into a trie and reads the prefix counter.",
      solutions: [
        {
          name: "Brute",
          time: "O(n L)",
          space: "O(1)",
          why: "For each word, compare pref character by character. Count a hit when the whole pref matches.",
          code: `function prefixCount(words, pref) {
  let c = 0;
  const n = pref.length;
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (w.length < n) continue;
    let ok = true;
    for (let j = 0; j < n; j++) if (w[j] !== pref[j]) { ok = false; break; }
    if (ok) c++;
  }
  return c;
}`,
          codes: {
            javascript: `function prefixCount(words, pref) {
  let c = 0;
  const n = pref.length;
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (w.length < n) continue;
    let ok = true;
    for (let j = 0; j < n; j++) if (w[j] !== pref[j]) { ok = false; break; }
    if (ok) c++;
  }
  return c;
}`,
            python: `def prefixCount(words, pref):
  c = 0
  n = len(pref)
  for w in words:
    if len(w) < n:
      continue
    ok = True
    for j in range(n):
      if w[j] != pref[j]:
        ok = False
        break
    if ok:
      c += 1
  return c`,
            java: `class Solution {
  public int prefixCount(String[] words, String pref) {
    int c = 0;
    for (String w : words) if (w.startsWith(pref)) c++;
    return c;
  }
}`,
            cpp: `int prefixCount(vector<string>& words, string pref) {
  int c = 0, n = (int)pref.size();
  for (auto& w : words)
    if ((int)w.size() >= n && w.compare(0, n, pref) == 0) c++;
  return c;
}`,
            c: `int prefixCount(char words[][48], int n, const char* pref) {
  int i, c = 0, L = (int)strlen(pref);
  for (i = 0; i < n; i++)
    if ((int)strlen(words[i]) >= L && strncmp(words[i], pref, L) == 0) c++;
  return c;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n^2 L)",
          space: "O(1)",
          why: "For the related prefix-and-suffix-pairs problem: try every i < j and test both prefix and suffix. Still brute pairs, but the check is the right idea before a trie of (char, char) pairs.",
          code: `function countPrefixSuffixPairs(words) {
  function isPrefixAndSuffix(a, b) {
    const n = a.length, m = b.length;
    if (n > m) return false;
    for (let i = 0; i < n; i++) if (a[i] !== b[i]) return false;
    for (let i = 0; i < n; i++) if (a[i] !== b[m - n + i]) return false;
    return true;
  }
  let c = 0;
  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      if (isPrefixAndSuffix(words[i], words[j])) c++;
    }
  }
  return c;
}`,
          codes: {
            javascript: `function countPrefixSuffixPairs(words) {
  function isPrefixAndSuffix(a, b) {
    const n = a.length, m = b.length;
    if (n > m) return false;
    for (let i = 0; i < n; i++) if (a[i] !== b[i]) return false;
    for (let i = 0; i < n; i++) if (a[i] !== b[m - n + i]) return false;
    return true;
  }
  let c = 0;
  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      if (isPrefixAndSuffix(words[i], words[j])) c++;
    }
  }
  return c;
}`,
            python: `def countPrefixSuffixPairs(words):
  def isPrefixAndSuffix(a, b):
    n, m = len(a), len(b)
    if n > m:
      return False
    return b.startswith(a) and b.endswith(a)
  c = 0
  for i in range(len(words)):
    for j in range(i + 1, len(words)):
      if isPrefixAndSuffix(words[i], words[j]):
        c += 1
  return c`,
            java: `class Solution {
  boolean isPrefixAndSuffix(String a, String b) {
    return b.startsWith(a) && b.endsWith(a);
  }
  public int countPrefixSuffixPairs(String[] words) {
    int c = 0;
    for (int i = 0; i < words.length; i++)
      for (int j = i + 1; j < words.length; j++)
        if (isPrefixAndSuffix(words[i], words[j])) c++;
    return c;
  }
}`,
            cpp: `bool isPrefixAndSuffix(const string& a, const string& b) {
  int n = (int)a.size(), m = (int)b.size();
  if (n > m) return false;
  return b.compare(0, n, a) == 0 && b.compare(m - n, n, a) == 0;
}
int countPrefixSuffixPairs(vector<string>& words) {
  int c = 0, n = (int)words.size();
  for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
      if (isPrefixAndSuffix(words[i], words[j])) c++;
  return c;
}`,
            c: `int isPrefixAndSuffix(const char* a, const char* b) {
  int n = (int)strlen(a), m = (int)strlen(b);
  if (n > m) return 0;
  if (strncmp(b, a, n) != 0) return 0;
  if (strncmp(b + m - n, a, n) != 0) return 0;
  return 1;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(total chars)",
          space: "O(total chars)",
          why: "Prefix count: insert every word into a trie, increment pref on each node, then walk pref once. For prefix-and-suffix pairs, a twin trie on (first char, last char) pairs is the upgrade when n is large.",
          code: `function prefixCount(words, pref) {
  function node() { return { ch: Array(26).fill(null), pref: 0 }; }
  const root = node();
  for (let i = 0; i < words.length; i++) {
    let cur = root;
    const w = words[i];
    for (let j = 0; j < w.length; j++) {
      const idx = w.charCodeAt(j) - 97;
      if (!cur.ch[idx]) cur.ch[idx] = node();
      cur = cur.ch[idx];
      cur.pref++;
    }
  }
  let cur = root;
  for (let j = 0; j < pref.length; j++) {
    const idx = pref.charCodeAt(j) - 97;
    if (!cur.ch[idx]) return 0;
    cur = cur.ch[idx];
  }
  return cur.pref;
}`,
          codes: {
            javascript: `function prefixCount(words, pref) {
  function node() { return { ch: Array(26).fill(null), pref: 0 }; }
  const root = node();
  for (let i = 0; i < words.length; i++) {
    let cur = root;
    const w = words[i];
    for (let j = 0; j < w.length; j++) {
      const idx = w.charCodeAt(j) - 97;
      if (!cur.ch[idx]) cur.ch[idx] = node();
      cur = cur.ch[idx];
      cur.pref++;
    }
  }
  let cur = root;
  for (let j = 0; j < pref.length; j++) {
    const idx = pref.charCodeAt(j) - 97;
    if (!cur.ch[idx]) return 0;
    cur = cur.ch[idx];
  }
  return cur.pref;
}`,
            python: `def prefixCount(words, pref):
  def node():
    return {"ch": [None] * 26, "pref": 0}
  root = node()
  for w in words:
    cur = root
    for ch in w:
      idx = ord(ch) - 97
      if cur["ch"][idx] is None:
        cur["ch"][idx] = node()
      cur = cur["ch"][idx]
      cur["pref"] += 1
  cur = root
  for ch in pref:
    idx = ord(ch) - 97
    if cur["ch"][idx] is None:
      return 0
    cur = cur["ch"][idx]
  return cur["pref"]`,
            java: `class Solution {
  static class Node {
    Node[] ch = new Node[26];
    int pref;
  }
  public int prefixCount(String[] words, String pref) {
    Node root = new Node();
    for (String w : words) {
      Node cur = root;
      for (int j = 0; j < w.length(); j++) {
        int idx = w.charAt(j) - 'a';
        if (cur.ch[idx] == null) cur.ch[idx] = new Node();
        cur = cur.ch[idx];
        cur.pref++;
      }
    }
    Node cur = root;
    for (int j = 0; j < pref.length(); j++) {
      int idx = pref.charAt(j) - 'a';
      if (cur.ch[idx] == null) return 0;
      cur = cur.ch[idx];
    }
    return cur.pref;
  }
}`,
            cpp: `int prefixCount(vector<string>& words, string pref) {
  struct Node { Node* ch[26] = {}; int pref = 0; };
  Node* root = new Node();
  for (auto& w : words) {
    Node* cur = root;
    for (char c : w) {
      int idx = c - 'a';
      if (!cur->ch[idx]) cur->ch[idx] = new Node();
      cur = cur->ch[idx];
      cur->pref++;
    }
  }
  Node* cur = root;
  for (char c : pref) {
    int idx = c - 'a';
    if (!cur->ch[idx]) return 0;
    cur = cur->ch[idx];
  }
  return cur->pref;
}`,
            c: `int prefixCountTrie(char words[][48], int n, const char* pref) {
  Node* root = newNode();
  int i, j;
  for (i = 0; i < n; i++) {
    Node* cur = root;
    for (j = 0; words[i][j]; j++) {
      int idx = words[i][j] - 'a';
      if (!cur->ch[idx]) cur->ch[idx] = newNode();
      cur = cur->ch[idx];
      cur->end++; /* reuse end as pref count */
    }
  }
  {
    Node* cur = root;
    for (j = 0; pref[j]; j++) {
      int idx = pref[j] - 'a';
      if (!cur->ch[idx]) return 0;
      cur = cur->ch[idx];
    }
    return cur->end;
  }
}`
          }
        }
      ]
    }
  ]
};
