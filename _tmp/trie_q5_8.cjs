const { makeSol, lc, gfgProblem, gfgArt } = require("./dsa_emit.cjs");

function q5() {
  return {
    id: 5,
    level: "intermediate",
    q: "Implement Magic Dictionary",
    ask: "Google · Amazon · Facebook",
    links: [lc("implement-magic-dictionary"), gfgArt("implement-magic-dictionary")],
    a: "Build a dict from a word list. search(query) is true if you can change exactly one letter of query and land on a stored word. Same length only. Changing zero letters does not count.\n\nExample: dict hello, leetcode. search hhllo is true (hello with one change). search hell is false (length). search leetcode is false (zero changes).\n\nBrute compares every word. Optimal keys wildcard patterns. More optimal DFS on a trie with one leftover mismatch.",
    solutions: [
      makeSol("Brute", "O(n L)", "O(n L)",
        "Store the list. For each stored word of the same length, count mismatches. Return true on a count of exactly 1.",
        {
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
        }),
      makeSol("Optimal", "O(L * 26)", "O(n L^2)",
        "For each word, replace each position with '*' and map that pattern to the original letters. On search, look up each starred query and see if another letter is stored. Handles duplicates carefully.",
        {
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
        }),
      makeSol("More optimal", "O(26 L)", "O(n L)",
        "Trie DFS with a leftover mismatch budget of 1. At the end of the query the budget must be 0 (exactly one change). Compact and matches the 'magic' story.",
        {
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
        })
    ]
  };
}

function q6() {
  return {
    id: 6,
    level: "beginner",
    q: "Longest Word in Dictionary",
    ask: "Amazon · Google · Apple",
    links: [lc("longest-word-in-dictionary"), gfgArt("longest-word-in-dictionary")],
    a: "From a list of words, return the longest word that can be built one character at a time from other words in the list. If there is a tie, return the lexicographically smallest. If none, return empty.\n\nExample: w, wo, wor, worl, world answers world. Each prefix was itself a word.\n\nBrute checks every prefix of every word. Optimal sorts then grows a set. More optimal DFS on a trie where every node on the path is an end.",
    solutions: [
      makeSol("Brute", "O(n^2 L)", "O(n)",
        "Put words in a set. For each word, test that every prefix is in the set. Keep the longest, breaking ties lexicographically.",
        {
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
        }),
      makeSol("Optimal", "O(n L log n)", "O(n)",
        "Sort by length then lex. A word is valid if the set already holds word without its last letter (or the word has length 1). Insert only valid words. The last survivor is the answer if you also keep the lex-smallest of that length.",
        {
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
        }),
      makeSol("More optimal", "O(total chars)", "O(total chars)",
        "Insert every word into a trie with an end flag. DFS only through end nodes. The deepest (then lex-smallest) path is the answer.",
        {
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
        })
    ]
  };
}

function q7() {
  return {
    id: 7,
    level: "beginner",
    q: "Map Sum Pairs",
    ask: "Amazon · Google · Bloomberg",
    links: [lc("map-sum-pairs"), gfgArt("map-sum-pairs")],
    a: "insert(key, val) sets the score of key (overwrite if the key already exists). sum(prefix) returns the total score of every key that starts with prefix.\n\nExample: insert apple 3, sum ap is 3, insert app 2, sum ap is 5.\n\nBrute stores the map and scans keys. Optimal adds the delta onto every prefix string. More optimal stores the running sum on trie nodes.",
    solutions: [
      makeSol("Brute", "O(n L) sum", "O(n L)",
        "A plain key -> val map. sum walks every key and adds val when the key starts with the prefix.",
        {
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
        }),
      makeSol("Optimal", "O(L) insert and sum", "O(n L)",
        "Keep the latest val per key. On insert, delta = newVal - oldVal. Add delta to every prefix string of the key in a second map. sum is then one lookup.",
        {
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
        }),
      makeSol("More optimal", "O(L)", "O(n L) shared",
        "Trie node holds a running sum of values that pass through it. insert adds the delta along the path. sum walks the prefix and returns that node's sum.",
        {
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
        })
    ]
  };
}

function q8() {
  return {
    id: 8,
    level: "intermediate",
    q: "Search Suggestions System",
    ask: "Amazon · Google · Bloomberg · Apple",
    links: [lc("search-suggestions-system"), gfgProblem("phone-directory4628")],
    a: "products is a list of strings. searchWord is typed one letter at a time. After each prefix, return up to 3 product names that start with that prefix, in lexicographic order.\n\nExample: products = mobile, mouse, moneypot, monitor, mousepad and searchWord = mouse. After m, mo, mou, mous, mouse the lists grow from mobile/moneypot/monitor toward mouse/mousepad.\n\nBrute filters after every extra letter. Optimal sorts once then binary-searches the prefix range. More optimal stores 3 suggestions on each trie node.",
    solutions: [
      makeSol("Brute", "O(|s| n L)", "O(n)",
        "After each extra character, scan every product, keep those with the prefix, sort, take 3. Correct and slow.",
        {
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
        }),
      makeSol("Optimal", "O(n L log n + |s| log n)", "O(n)",
        "Sort products once. For each growing prefix, lower-bound the first product >= prefix, then take the next three if they still share the prefix.",
        {
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
        }),
      makeSol("More optimal", "O(total chars)", "O(total chars)",
        "Trie. At each node keep up to 3 lex-smallest words that pass through it (insert into a sorted short list). Typing searchWord is just walking children and reading that list.",
        {
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
        })
    ]
  };
}

module.exports = [q5(), q6(), q7(), q8()];
