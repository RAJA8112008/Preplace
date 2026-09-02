module.exports = [
  // 36 topK frequent brute
  {
    python: `def topKFrequent(nums, k):
  count = {}
  for x in nums:
    count[x] = count.get(x, 0) + 1
  ans = []
  for t in range(k):
    bestKey, best = None, -1
    for key in list(count.keys()):
      if count[key] > best:
        best = count[key]; bestKey = key
    ans.append(bestKey)
    del count[bestKey]
  return ans`,
    java: `import java.util.*;
class Solution {
  public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<Integer, Integer>();
    for (int x : nums) count.put(x, count.getOrDefault(x, 0) + 1);
    int[] ans = new int[k];
    for (int t = 0; t < k; t++) {
      int bestKey = 0, best = -1;
      for (int key : count.keySet()) {
        if (count.get(key) > best) { best = count.get(key); bestKey = key; }
      }
      ans[t] = bestKey;
      count.remove(bestKey);
    }
    return ans;
  }
}`,
    cpp: `class Solution {
public:
  vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int,int> count;
    for (int x : nums) count[x]++;
    vector<int> ans;
    for (int t = 0; t < k; t++) {
      int bestKey = 0, best = -1;
      for (auto& p : count) if (p.second > best) { best = p.second; bestKey = p.first; }
      ans.push_back(bestKey);
      count.erase(bestKey);
    }
    return ans;
  }
};`,
    c: `#include <stdlib.h>
int* topKFrequent(int* nums, int n, int k, int* returnSize) {
  int* keys = (int*)malloc(sizeof(int)*n);
  int* cnt = (int*)malloc(sizeof(int)*n);
  int u = 0;
  for (int i = 0; i < n; i++) {
    int f = -1;
    for (int j = 0; j < u; j++) if (keys[j] == nums[i]) { f = j; break; }
    if (f < 0) { keys[u] = nums[i]; cnt[u] = 1; u++; }
    else cnt[f]++;
  }
  int* ans = (int*)malloc(sizeof(int)*k);
  int used[256]; /* mark removed unique slots; u is small in interviews */
  int* gone = (int*)calloc(u, sizeof(int));
  for (int t = 0; t < k; t++) {
    int best = -1, bi = 0;
    for (int j = 0; j < u; j++) if (!gone[j] && cnt[j] > best) { best = cnt[j]; bi = j; }
    ans[t] = keys[bi]; gone[bi] = 1;
  }
  free(keys); free(cnt); free(gone);
  *returnSize = k;
  return ans;
}`
  },
  // 37 topK sort
  {
    python: `def topKFrequent(nums, k):
  count = {}
  for x in nums:
    count[x] = count.get(x, 0) + 1
  keys = list(count.keys())
  keys.sort(key=lambda a: -count[a])
  return keys[:k]`,
    java: `import java.util.*;
class Solution {
  public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<Integer, Integer>();
    for (int x : nums) count.put(x, count.getOrDefault(x, 0) + 1);
    ArrayList<Integer> keys = new ArrayList<Integer>(count.keySet());
    keys.sort((a, b) -> count.get(b) - count.get(a));
    int[] ans = new int[k];
    for (int i = 0; i < k; i++) ans[i] = keys.get(i);
    return ans;
  }
}`,
    cpp: `class Solution {
public:
  vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int,int> count;
    for (int x : nums) count[x]++;
    vector<int> keys;
    for (auto& p : count) keys.push_back(p.first);
    sort(keys.begin(), keys.end(), [&](int a, int b){ return count[a] > count[b]; });
    keys.resize(k);
    return keys;
  }
};`,
    c: `#include <stdlib.h>
int* topKFrequent(int* nums, int n, int k, int* returnSize) {
  int* keys = (int*)malloc(sizeof(int)*n);
  int* cnt = (int*)malloc(sizeof(int)*n);
  int u = 0;
  for (int i = 0; i < n; i++) {
    int f = -1;
    for (int j = 0; j < u; j++) if (keys[j] == nums[i]) { f = j; break; }
    if (f < 0) { keys[u] = nums[i]; cnt[u] = 1; u++; }
    else cnt[f]++;
  }
  for (int i = 0; i < u; i++) {
    int bi = i;
    for (int j = i + 1; j < u; j++) if (cnt[j] > cnt[bi]) bi = j;
    int tk = keys[i]; keys[i] = keys[bi]; keys[bi] = tk;
    int tc = cnt[i]; cnt[i] = cnt[bi]; cnt[bi] = tc;
  }
  *returnSize = k;
  free(cnt);
  return keys; /* first k */
}`
  },
  // 38 topK bucket
  {
    python: `def topKFrequent(nums, k):
  count = {}
  for x in nums:
    count[x] = count.get(x, 0) + 1
  buckets = [[] for _ in range(len(nums) + 1)]
  for num, c in count.items():
    buckets[c].append(num)
  ans = []
  f = len(buckets) - 1
  while f >= 0 and len(ans) < k:
    for x in buckets[f]:
      if len(ans) >= k: break
      ans.append(x)
    f -= 1
  return ans`,
    java: `import java.util.*;
class Solution {
  public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<Integer, Integer>();
    for (int x : nums) count.put(x, count.getOrDefault(x, 0) + 1);
    ArrayList<Integer>[] buckets = new ArrayList[nums.length + 1];
    for (int i = 0; i < buckets.length; i++) buckets[i] = new ArrayList<Integer>();
    for (int num : count.keySet()) buckets[count.get(num)].add(num);
    int[] ans = new int[k];
    int p = 0;
    for (int f = buckets.length - 1; f >= 0 && p < k; f--) {
      for (int i = 0; i < buckets[f].size() && p < k; i++) ans[p++] = buckets[f].get(i);
    }
    return ans;
  }
}`,
    cpp: `class Solution {
public:
  vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int,int> count;
    for (int x : nums) count[x]++;
    vector<vector<int>> buckets(nums.size() + 1);
    for (auto& p : count) buckets[p.second].push_back(p.first);
    vector<int> ans;
    for (int f = (int)buckets.size() - 1; f >= 0 && (int)ans.size() < k; f--) {
      for (int x : buckets[f]) {
        if ((int)ans.size() >= k) break;
        ans.push_back(x);
      }
    }
    return ans;
  }
};`,
    c: `#include <stdlib.h>
int* topKFrequent(int* nums, int n, int k, int* returnSize) {
  int* keys = (int*)malloc(sizeof(int)*n);
  int* cnt = (int*)malloc(sizeof(int)*n);
  int u = 0;
  for (int i = 0; i < n; i++) {
    int f = -1;
    for (int j = 0; j < u; j++) if (keys[j] == nums[i]) { f = j; break; }
    if (f < 0) { keys[u] = nums[i]; cnt[u] = 1; u++; }
    else cnt[f]++;
  }
  /* buckets[f] = list of keys with count f; store as linked via arrays */
  int* bhead = (int*)malloc(sizeof(int)*(n+1));
  int* bnext = (int*)malloc(sizeof(int)*u);
  for (int i = 0; i <= n; i++) bhead[i] = -1;
  for (int j = 0; j < u; j++) { bnext[j] = bhead[cnt[j]]; bhead[cnt[j]] = j; }
  int* ans = (int*)malloc(sizeof(int)*k);
  int p = 0;
  for (int f = n; f >= 0 && p < k; f--) {
    for (int j = bhead[f]; j != -1 && p < k; j = bnext[j]) ans[p++] = keys[j];
  }
  free(keys); free(cnt); free(bhead); free(bnext);
  *returnSize = k;
  return ans;
}`
  },
  // 39 merge k lists brute
  {
    python: `class ListNode:
  def __init__(self, val=0, next=None):
    self.val = val
    self.next = next
def mergeKLists(lists):
  vals = []
  for p in lists:
    while p:
      vals.append(p.val)
      p = p.next
  vals.sort()
  dummy = ListNode(0)
  cur = dummy
  for v in vals:
    cur.next = ListNode(v)
    cur = cur.next
  return dummy.next`,
    java: `import java.util.*;
class ListNode {
  int val; ListNode next;
  ListNode(int v) { val = v; }
}
class Solution {
  public ListNode mergeKLists(ListNode[] lists) {
    ArrayList<Integer> vals = new ArrayList<Integer>();
    for (ListNode p : lists) {
      while (p != null) { vals.add(p.val); p = p.next; }
    }
    Collections.sort(vals);
    ListNode dummy = new ListNode(0), cur = dummy;
    for (int v : vals) { cur.next = new ListNode(v); cur = cur.next; }
    return dummy.next;
  }
}`,
    cpp: `struct ListNode { int val; ListNode* next; ListNode(int x): val(x), next(NULL) {} };
class Solution {
public:
  ListNode* mergeKLists(vector<ListNode*>& lists) {
    vector<int> vals;
    for (auto p : lists) while (p) { vals.push_back(p->val); p = p->next; }
    sort(vals.begin(), vals.end());
    ListNode dummy(0), *cur = &dummy;
    for (int v : vals) { cur->next = new ListNode(v); cur = cur->next; }
    return dummy.next;
  }
};`,
    c: `#include <stdlib.h>
struct ListNode { int val; struct ListNode* next; };
int cmp_int(const void* a, const void* b) { return *(const int*)a - *(const int*)b; }
struct ListNode* mergeKLists(struct ListNode** lists, int k) {
  int cap = 16, n = 0;
  int* vals = (int*)malloc(sizeof(int)*cap);
  for (int i = 0; i < k; i++) {
    struct ListNode* p = lists[i];
    while (p) {
      if (n == cap) { cap *= 2; vals = (int*)realloc(vals, sizeof(int)*cap); }
      vals[n++] = p->val; p = p->next;
    }
  }
  qsort(vals, n, sizeof(int), cmp_int);
  struct ListNode dummy; dummy.next = NULL;
  struct ListNode* cur = &dummy;
  for (int i = 0; i < n; i++) {
    struct ListNode* nd = (struct ListNode*)malloc(sizeof(struct ListNode));
    nd->val = vals[i]; nd->next = NULL;
    cur->next = nd; cur = nd;
  }
  free(vals);
  return dummy.next;
}`
  },
  // 40 merge k lists heap
  {
    python: `class ListNode:
  def __init__(self, val=0, next=None):
    self.val = val
    self.next = next
def mergeKLists(lists):
  h = []
  def key(x): return x.val
  def up(i):
    while i > 0:
      p = (i - 1) >> 1
      if key(h[i]) >= key(h[p]): break
      h[i], h[p] = h[p], h[i]
      i = p
  def down(i):
    while True:
      s = i
      l, r = i * 2 + 1, i * 2 + 2
      if l < len(h) and key(h[l]) < key(h[s]): s = l
      if r < len(h) and key(h[r]) < key(h[s]): s = r
      if s == i: break
      h[i], h[s] = h[s], h[i]
      i = s
  def push(node):
    h.append(node); up(len(h) - 1)
  def pop():
    top = h[0]
    last = h.pop()
    if h:
      h[0] = last; down(0)
    return top
  for node in lists:
    if node: push(node)
  dummy = ListNode(0)
  cur = dummy
  while h:
    node = pop()
    cur.next = node
    cur = node
    if node.next: push(node.next)
  return dummy.next`,
    java: `class ListNode {
  int val; ListNode next;
  ListNode(int v) { val = v; }
}
class Solution {
  java.util.ArrayList<ListNode> h = new java.util.ArrayList<ListNode>();
  int key(ListNode x) { return x.val; }
  void up(int i) {
    while (i > 0) { int p=(i-1)>>1; if (key(h.get(i))>=key(h.get(p))) break;
      ListNode t=h.get(i); h.set(i,h.get(p)); h.set(p,t); i=p; }
  }
  void down(int i) {
    while (true) { int s=i, l=i*2+1, r=l+1;
      if (l<h.size() && key(h.get(l))<key(h.get(s))) s=l;
      if (r<h.size() && key(h.get(r))<key(h.get(s))) s=r;
      if (s==i) break; ListNode t=h.get(i); h.set(i,h.get(s)); h.set(s,t); i=s; }
  }
  void push(ListNode node) { h.add(node); up(h.size()-1); }
  ListNode pop() {
    ListNode top = h.get(0); ListNode last = h.remove(h.size()-1);
    if (!h.isEmpty()) { h.set(0, last); down(0); }
    return top;
  }
  public ListNode mergeKLists(ListNode[] lists) {
    for (ListNode node : lists) if (node != null) push(node);
    ListNode dummy = new ListNode(0), cur = dummy;
    while (!h.isEmpty()) {
      ListNode node = pop();
      cur.next = node; cur = node;
      if (node.next != null) push(node.next);
    }
    return dummy.next;
  }
}`,
    cpp: `struct ListNode { int val; ListNode* next; ListNode(int x): val(x), next(NULL) {} };
class Solution {
  vector<ListNode*> h;
  int key(ListNode* x) { return x->val; }
  void up(int i) {
    while (i > 0) { int p=(i-1)>>1; if (key(h[i])>=key(h[p])) break; swap(h[i], h[p]); i=p; }
  }
  void down(int i) {
    int n=(int)h.size();
    while (true) { int s=i, l=i*2+1, r=l+1;
      if (l<n && key(h[l])<key(h[s])) s=l; if (r<n && key(h[r])<key(h[s])) s=r;
      if (s==i) break; swap(h[i], h[s]); i=s; }
  }
  void push(ListNode* node) { h.push_back(node); up((int)h.size()-1); }
  ListNode* pop() {
    ListNode* top = h[0]; ListNode* last = h.back(); h.pop_back();
    if (!h.empty()) { h[0] = last; down(0); }
    return top;
  }
public:
  ListNode* mergeKLists(vector<ListNode*>& lists) {
    for (auto node : lists) if (node) push(node);
    ListNode dummy(0), *cur = &dummy;
    while (!h.empty()) {
      ListNode* node = pop();
      cur->next = node; cur = node;
      if (node->next) push(node->next);
    }
    return dummy.next;
  }
};`,
    c: `#include <stdlib.h>
struct ListNode { int val; struct ListNode* next; };
void up(struct ListNode** h, int i) {
  while (i > 0) { int p=(i-1)>>1; if (h[i]->val >= h[p]->val) break;
    struct ListNode* t=h[i]; h[i]=h[p]; h[p]=t; i=p; }
}
void down(struct ListNode** h, int n, int i) {
  while (1) { int s=i, l=i*2+1, r=l+1;
    if (l<n && h[l]->val < h[s]->val) s=l;
    if (r<n && h[r]->val < h[s]->val) s=r;
    if (s==i) break; struct ListNode* t=h[i]; h[i]=h[s]; h[s]=t; i=s; }
}
struct ListNode* mergeKLists(struct ListNode** lists, int k) {
  struct ListNode** h = (struct ListNode**)malloc(sizeof(struct ListNode*)*(k+1));
  int sz = 0;
  for (int i = 0; i < k; i++) if (lists[i]) { h[sz++] = lists[i]; up(h, sz-1); }
  struct ListNode dummy; dummy.next = NULL;
  struct ListNode* cur = &dummy;
  while (sz) {
    struct ListNode* node = h[0];
    h[0] = h[--sz]; if (sz) down(h, sz, 0);
    cur->next = node; cur = node;
    if (node->next) { h[sz++] = node->next; up(h, sz-1); }
  }
  free(h);
  return dummy.next;
}`
  },
  // 41 merge k divide and conquer
  {
    python: `class ListNode:
  def __init__(self, val=0, next=None):
    self.val = val
    self.next = next
def mergeKLists(lists):
  if not lists: return None
  def mergeTwo(a, b):
    dummy = ListNode(0)
    cur = dummy
    while a and b:
      if a.val <= b.val:
        cur.next = a; a = a.next
      else:
        cur.next = b; b = b.next
      cur = cur.next
    cur.next = a or b
    return dummy.next
  def split(lo, hi):
    if lo == hi: return lists[lo]
    mid = (lo + hi) >> 1
    return mergeTwo(split(lo, mid), split(mid + 1, hi))
  return split(0, len(lists) - 1)`,
    java: `class ListNode {
  int val; ListNode next;
  ListNode(int v) { val = v; }
}
class Solution {
  ListNode mergeTwo(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), cur = dummy;
    while (a != null && b != null) {
      if (a.val <= b.val) { cur.next = a; a = a.next; }
      else { cur.next = b; b = b.next; }
      cur = cur.next;
    }
    cur.next = a != null ? a : b;
    return dummy.next;
  }
  ListNode split(ListNode[] lists, int lo, int hi) {
    if (lo == hi) return lists[lo];
    int mid = (lo + hi) >> 1;
    return mergeTwo(split(lists, lo, mid), split(lists, mid + 1, hi));
  }
  public ListNode mergeKLists(ListNode[] lists) {
    if (lists.length == 0) return null;
    return split(lists, 0, lists.length - 1);
  }
}`,
    cpp: `struct ListNode { int val; ListNode* next; ListNode(int x): val(x), next(NULL) {} };
class Solution {
  ListNode* mergeTwo(ListNode* a, ListNode* b) {
    ListNode dummy(0), *cur = &dummy;
    while (a && b) {
      if (a->val <= b->val) { cur->next = a; a = a->next; }
      else { cur->next = b; b = b->next; }
      cur = cur->next;
    }
    cur->next = a ? a : b;
    return dummy.next;
  }
  ListNode* split(vector<ListNode*>& lists, int lo, int hi) {
    if (lo == hi) return lists[lo];
    int mid = (lo + hi) >> 1;
    return mergeTwo(split(lists, lo, mid), split(lists, mid + 1, hi));
  }
public:
  ListNode* mergeKLists(vector<ListNode*>& lists) {
    if (lists.empty()) return NULL;
    return split(lists, 0, (int)lists.size() - 1);
  }
};`,
    c: `#include <stdlib.h>
struct ListNode { int val; struct ListNode* next; };
struct ListNode* mergeTwo(struct ListNode* a, struct ListNode* b) {
  struct ListNode dummy; dummy.next = NULL;
  struct ListNode* cur = &dummy;
  while (a && b) {
    if (a->val <= b->val) { cur->next = a; a = a->next; }
    else { cur->next = b; b = b->next; }
    cur = cur->next;
  }
  cur->next = a ? a : b;
  return dummy.next;
}
struct ListNode* split(struct ListNode** lists, int lo, int hi) {
  if (lo == hi) return lists[lo];
  int mid = (lo + hi) >> 1;
  return mergeTwo(split(lists, lo, mid), split(lists, mid + 1, hi));
}
struct ListNode* mergeKLists(struct ListNode** lists, int k) {
  if (k == 0) return NULL;
  return split(lists, 0, k - 1);
}`
  }
];
