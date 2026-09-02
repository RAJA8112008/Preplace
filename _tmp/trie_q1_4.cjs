const { makeSol, lc, gfgProblem, gfgArt } = require("./dsa_emit.cjs");

function q1() {
  return {
    id: 1,
    level: "beginner",
    q: "Implement Trie (Prefix Tree)",
    ask: "Amazon · Google · Microsoft · Meta",
    links: [lc("implement-trie-prefix-tree"), gfgProblem("trie-insert-and-search095")],
    a: "Build a trie that supports insert(word), search(word), and startsWith(prefix). search is true only for a full inserted word. startsWith is true if any inserted word begins with that prefix.\n\nExample: insert apple, search apple is true, search app is false, startsWith app is true, then insert app and search app becomes true.\n\nBrute stores the raw list. Optimal stores every prefix in a set. More optimal is the real 26-way trie.",
    solutions: [
      makeSol("Brute", "O(n L) search", "O(n L)",
        "Keep every inserted string in an array. search and startsWith scan the whole list. Correct, and fine for tiny dictionaries, but not the point of the problem.",
        {
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
        }),
      makeSol("Optimal", "O(L)", "O(n L)",
        "A set of full words plus a set of every prefix. Each call is a hash lookup. Extra memory stores every prefix string, which a trie shares instead.",
        {
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
        }),
      makeSol("More optimal", "O(L)", "O(n L) shared",
        "Real trie. Shared prefixes share nodes. insert, search, and startsWith each walk L children. This is the expected interview finish.",
        {
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
        })
    ]
  };
}

function q2() {
  return {
    id: 2,
    level: "intermediate",
    q: "Design Add and Search Words Data Structure",
    ask: "Amazon · Google · Meta · Uber",
    links: [lc("design-add-and-search-words-data-structure"), gfgArt("add-and-search-word-data-structure-design")],
    a: "addWord stores a word. search returns true if any stored word matches the pattern. A '.' in the pattern matches any one letter.\n\nExample: add bad, add dad, add mad. search pad is false, search bad is true, search .ad is true, search b.. is true.\n\nBrute scans every word. Optimal buckets by length. More optimal DFS on a trie, branching on '.' .",
    solutions: [
      makeSol("Brute", "O(n L) search", "O(n L)",
        "Keep a list. For each stored word of the same length, compare char by char and treat '.' as a free pass. Simple and slow when the dictionary is large.",
        {
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
        }),
      makeSol("Optimal", "O(k L)", "O(n L)",
        "Bucket words by length so a pattern of length L only scans that bucket. Still linear in the bucket size, but you skip obviously impossible words.",
        {
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
        }),
      makeSol("More optimal", "O(26^d L)", "O(n L)",
        "Trie DFS. A letter follows one child. A '.' tries every living child. d is the number of dots. This is the expected design.",
        {
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
        })
    ]
  };
}

function q3() {
  return {
    id: 3,
    level: "advanced",
    q: "Word Search II",
    ask: "Amazon · Google · Microsoft · Uber",
    links: [lc("word-search-ii"), gfgProblem("word-boggle-1587115621")],
    a: "You get an m by n board of letters and a list of words. Return every word that can be formed by walking adjacent cells (up, down, left, right) without reusing a cell in the same walk.\n\nExample: board has o,a,a,n / e,t,a,e / i,h,k,r / i,f,l,v and words eat, oath, pea, rain. Answer is eat and oath.\n\nBrute runs Word Search I per word. Optimal walks the board once against a trie. More optimal stores the word on the end node and prunes after a find.",
    solutions: [
      makeSol("Brute", "O(w m n 4^L)", "O(L)",
        "For each word, DFS from every cell. Mark the cell, try four neighbors, unmark. Correct, but you restart the whole board for every dictionary word.",
        {
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
        }),
      makeSol("Optimal", "O(m n 4^L)", "O(total chars)",
        "Build a trie of all words, then DFS from every cell following only living children. One board walk instead of one walk per word.",
        {
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
        }),
      makeSol("More optimal", "O(m n 4^L)", "O(total chars)",
        "Same trie DFS, but after you emit a word you clear that end mark (and optionally prune empty children). That stops duplicate work and extra copies of the same word.",
        {
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
        })
    ]
  };
}

function q4() {
  return {
    id: 4,
    level: "beginner",
    q: "Replace Words",
    ask: "Amazon · Google · Bloomberg",
    links: [lc("replace-words"), gfgArt("replace-words")],
    a: "A root is a prefix that can replace a successor word. Given a dictionary of roots and a sentence, replace every word with the shortest root that is a prefix of it. If no root matches, leave the word.\n\nExample: dictionary = cat, bat, rat and sentence = the cattle was rattled by the battery becomes the cat was rat by the bat.\n\nBrute tries every root on every word. Optimal sorts roots by length. More optimal walks a trie of roots until an end flag.",
    solutions: [
      makeSol("Brute", "O(words * roots * L)", "O(1) extra",
        "For each sentence word, scan every root and keep the shortest one that is a prefix. Easy to write, quadratic in dictionary size.",
        {
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
        }),
      makeSol("Optimal", "O(total chars)", "O(roots)",
        "Put roots in a set. For each word, try prefixes from length 1 up and take the first hit. That is the shortest root. Faster when few prefixes match.",
        {
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
        }),
      makeSol("More optimal", "O(total chars)", "O(roots)",
        "Trie of roots. Walk each sentence word until you hit an end flag, then stop. Shared prefixes make this the usual interview answer.",
        {
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
        })
    ]
  };
}

module.exports = [q1(), q2(), q3(), q4()];
