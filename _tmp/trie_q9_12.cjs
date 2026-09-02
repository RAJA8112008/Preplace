const { makeSol, lc, gfgProblem, gfgArt } = require("./dsa_emit.cjs");

function q9() {
  return {
    id: 9,
    level: "intermediate",
    q: "Implement Trie II / delete (count prefixes)",
    ask: "Amazon · Google · Microsoft",
    links: [lc("implement-trie-ii-prefix-tree"), gfgArt("trie-delete")],
    a: "A trie that can insert a word, erase one copy, countWordsEqualTo(word), and countWordsStartingWith(prefix). Duplicate inserts count. erase of a missing word is a no-op.\n\nExample: insert apple twice, countWordsEqualTo apple is 2, countWordsStartingWith app is 2, erase apple once, equal becomes 1.\n\nBrute stores a list. Optimal uses two hash maps. More optimal is a trie with word and prefix counters, unlinking empty children.",
    solutions: [
      makeSol("Brute", "O(n L)", "O(n L)",
        "An array of words. equalTo counts exact matches. startingWith counts prefix matches. erase removes the first copy.",
        {
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
        }),
      makeSol("Optimal", "O(L)", "O(n L)",
        "wordCount map and prefixCount map. insert / erase add or subtract 1 along every prefix. Queries are hash lookups. Watch erase: never go below zero.",
        {
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
        }),
      makeSol("More optimal", "O(L)", "O(total chars) shared",
        "Trie node has words (how many end here) and pref (how many pass through). insert increments. erase decrements and unlinks a child whose pref hits 0.",
        {
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
        })
    ]
  };
}

function q10() {
  return {
    id: 10,
    level: "advanced",
    q: "Palindrome Pairs",
    ask: "Google · Airbnb · Amazon",
    links: [lc("palindrome-pairs"), gfgArt("palindrome-pairs")],
    a: "Given unique words, return every pair of indexes [i, j] (i != j) such that words[i] + words[j] is a palindrome.\n\nExample: abcd, dcba, lls, s, sssll. Pairs include [0,1] (abcddcba), [1,0] (dcbaabcd), [3,2] (slls), [2,4] (llssssll).\n\nBrute concatenates every pair. Optimal maps each word to its index and tries every split. More optimal inserts reversed words into a trie and checks palindrome prefixes/suffixes.",
    solutions: [
      makeSol("Brute", "O(n^2 L)", "O(1)",
        "For every ordered pair, concatenate and test palindrome. Fine for tiny n, not for n = 5000.",
        {
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
        }),
      makeSol("Optimal", "O(n L^2)", "O(n L)",
        "Map word -> index. For each word, try every split. If the left half is a palindrome, look up reverse(right). If the right half is a palindrome, look up reverse(left). Handles the empty-word case.",
        {
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
        }),
      makeSol("More optimal", "O(n L^2)", "O(n L)",
        "Insert the reverse of every word into a trie, storing the index at the end. While walking a word, if the remaining suffix is a palindrome and the node is an end, you have a pair. Also collect end indexes whose leftover reverse is a palindrome. Same complexity, trie picture.",
        {
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
        })
    ]
  };
}

function q11() {
  return {
    id: 11,
    level: "advanced",
    q: "Maximum XOR of Two Numbers in an Array",
    ask: "Google · Amazon · Microsoft",
    links: [lc("maximum-xor-of-two-numbers-in-an-array"), gfgProblem("maximum-xor-of-two-numbers-in-an-array")],
    a: "Return the largest XOR of any two numbers in the array. You may pick the same value at two indexes if it appears twice, but usually you pick two positions.\n\nExample: [3, 10, 5, 25, 2, 8] answers 28 because 5 xor 25 is 28.\n\nBrute tries every pair. Optimal greedily builds the answer bit by bit with a prefix set. More optimal is a 32-bit binary trie.",
    solutions: [
      makeSol("Brute", "O(n^2)", "O(1)",
        "XOR every pair, keep the max. Correct, too slow for n = 2e5.",
        {
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
        }),
      makeSol("Optimal", "O(n)", "O(n)",
        "Build the answer from bit 31 down. Assume the next bit can be 1. If some prefix ^ candidate exists in the set of current prefixes, keep that bit. Hash set of prefixes is the usual O(n) per bit trick.",
        {
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
        }),
      makeSol("More optimal", "O(n)", "O(n)",
        "Insert every number into a binary trie (high bit first). For each number, walk the opposite bit when it exists. That walk is the max XOR against the set. Same O(32 n), clearer as a trie.",
        {
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
        })
    ]
  };
}

function q12() {
  return {
    id: 12,
    level: "beginner",
    q: "Count Prefix and Suffix Pairs / Prefix Count",
    ask: "Amazon · Google · Bloomberg",
    links: [lc("counting-words-with-a-given-prefix"), gfgArt("count-the-number-of-words-with-given-prefix")],
    a: "Prefix Count (LC counting-words-with-a-given-prefix): count how many words start with pref.\n\nRelated: Count Prefix and Suffix Pairs asks how many index pairs (i, j) with i < j have words[i] as both a prefix and a suffix of words[j].\n\nExample (prefix count): words = pay, attention, practice, attend, pref = at. Answer 2 (attention, attend).\n\nBrute uses startsWith. Optimal still scans but bails early. More optimal inserts into a trie and reads the prefix counter.",
    solutions: [
      makeSol("Brute", "O(n L)", "O(1)",
        "For each word, compare pref character by character. Count a hit when the whole pref matches.",
        {
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
        }),
      makeSol("Optimal", "O(n^2 L)", "O(1)",
        "For the related prefix-and-suffix-pairs problem: try every i < j and test both prefix and suffix. Still brute pairs, but the check is the right idea before a trie of (char, char) pairs.",
        {
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
        }),
      makeSol("More optimal", "O(total chars)", "O(total chars)",
        "Prefix count: insert every word into a trie, increment pref on each node, then walk pref once. For prefix-and-suffix pairs, a twin trie on (first char, last char) pairs is the upgrade when n is large.",
        {
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
        })
    ]
  };
}

module.exports = [q9(), q10(), q11(), q12()];
