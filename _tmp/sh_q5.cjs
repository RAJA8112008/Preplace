module.exports = [
  // 42 MedianFinder brute
  {
    python: `class MedianFinder:
  def __init__(self):
    self.a = []
  def addNum(self, num):
    self.a.append(num)
  def findMedian(self):
    b = sorted(self.a)
    n = len(b)
    if n % 2: return b[(n - 1) // 2]
    return (b[n // 2 - 1] + b[n // 2]) / 2`,
    java: `import java.util.*;
class MedianFinder {
  ArrayList<Integer> a = new ArrayList<Integer>();
  public MedianFinder() {}
  public void addNum(int num) { a.add(num); }
  public double findMedian() {
    ArrayList<Integer> b = new ArrayList<Integer>(a);
    Collections.sort(b);
    int n = b.size();
    if (n % 2 != 0) return b.get((n - 1) / 2);
    return (b.get(n / 2 - 1) + b.get(n / 2)) / 2.0;
  }
}
class Solution {}`,
    cpp: `class MedianFinder {
  vector<int> a;
public:
  void addNum(int num) { a.push_back(num); }
  double findMedian() {
    vector<int> b = a;
    sort(b.begin(), b.end());
    int n = (int)b.size();
    if (n % 2) return b[(n - 1) / 2];
    return (b[n / 2 - 1] + b[n / 2]) / 2.0;
  }
};`,
    c: `#include <stdlib.h>
typedef struct { int *a; int n, cap; } MedianFinder;
void mf_init(MedianFinder* m) { m->a=NULL; m->n=m->cap=0; }
void mf_addNum(MedianFinder* m, int num) {
  if (m->n==m->cap) { m->cap = m->cap? m->cap*2:8; m->a=(int*)realloc(m->a,sizeof(int)*m->cap); }
  m->a[m->n++] = num;
}
int cmp_asc(const void* a, const void* b) { return *(const int*)a - *(const int*)b; }
double mf_findMedian(MedianFinder* m) {
  int* b = (int*)malloc(sizeof(int)*m->n);
  for (int i = 0; i < m->n; i++) b[i] = m->a[i];
  qsort(b, m->n, sizeof(int), cmp_asc);
  int n = m->n;
  double ans = n % 2 ? b[(n-1)/2] : (b[n/2-1] + b[n/2]) / 2.0;
  free(b);
  return ans;
}`
  },
  // 43 MedianFinder sorted insert
  {
    python: `class MedianFinder:
  def __init__(self):
    self.a = []
  def addNum(self, num):
    lo, hi = 0, len(self.a)
    while lo < hi:
      mid = (lo + hi) >> 1
      if self.a[mid] < num: lo = mid + 1
      else: hi = mid
    self.a.insert(lo, num)
  def findMedian(self):
    n = len(self.a)
    if n % 2: return self.a[(n - 1) // 2]
    return (self.a[n // 2 - 1] + self.a[n // 2]) / 2`,
    java: `import java.util.*;
class MedianFinder {
  ArrayList<Integer> a = new ArrayList<Integer>();
  public MedianFinder() {}
  public void addNum(int num) {
    int lo = 0, hi = a.size();
    while (lo < hi) {
      int mid = (lo + hi) >> 1;
      if (a.get(mid) < num) lo = mid + 1;
      else hi = mid;
    }
    a.add(lo, num);
  }
  public double findMedian() {
    int n = a.size();
    if (n % 2 != 0) return a.get((n - 1) / 2);
    return (a.get(n / 2 - 1) + a.get(n / 2)) / 2.0;
  }
}
class Solution {}`,
    cpp: `class MedianFinder {
  vector<int> a;
public:
  void addNum(int num) {
    int lo = 0, hi = (int)a.size();
    while (lo < hi) {
      int mid = (lo + hi) >> 1;
      if (a[mid] < num) lo = mid + 1;
      else hi = mid;
    }
    a.insert(a.begin() + lo, num);
  }
  double findMedian() {
    int n = (int)a.size();
    if (n % 2) return a[(n - 1) / 2];
    return (a[n / 2 - 1] + a[n / 2]) / 2.0;
  }
};`,
    c: `#include <stdlib.h>
typedef struct { int *a; int n, cap; } MedianFinder;
void mf_init(MedianFinder* m) { m->a=NULL; m->n=m->cap=0; }
void mf_addNum(MedianFinder* m, int num) {
  if (m->n==m->cap) { m->cap = m->cap? m->cap*2:8; m->a=(int*)realloc(m->a,sizeof(int)*m->cap); }
  int lo = 0, hi = m->n;
  while (lo < hi) {
    int mid = (lo + hi) >> 1;
    if (m->a[mid] < num) lo = mid + 1; else hi = mid;
  }
  for (int i = m->n; i > lo; i--) m->a[i] = m->a[i-1];
  m->a[lo] = num; m->n++;
}
double mf_findMedian(MedianFinder* m) {
  int n = m->n;
  if (n % 2) return m->a[(n-1)/2];
  return (m->a[n/2-1] + m->a[n/2]) / 2.0;
}`
  },
  // 44 MedianFinder two heaps
  {
    python: `class MedianFinder:
  def __init__(self):
    self.low = []   # max-heap via negated values
    self.high = []  # min-heap of the upper half
  def _up(self, h, i, key):
    while i > 0:
      p = (i - 1) >> 1
      if key(h[i]) >= key(h[p]): break
      h[i], h[p] = h[p], h[i]
      i = p
  def _down(self, h, i, key):
    while True:
      s = i
      l, r = i * 2 + 1, i * 2 + 2
      if l < len(h) and key(h[l]) < key(h[s]): s = l
      if r < len(h) and key(h[r]) < key(h[s]): s = r
      if s == i: break
      h[i], h[s] = h[s], h[i]
      i = s
  def _push(self, h, x, key):
    h.append(x); self._up(h, len(h) - 1, key)
  def _pop(self, h, key):
    top = h[0]
    last = h.pop()
    if h:
      h[0] = last; self._down(h, 0, key)
    return top
  def addNum(self, num):
    ident = lambda x: x
    self._push(self.low, -num, ident)
    self._push(self.high, -self._pop(self.low, ident), ident)
    if len(self.high) > len(self.low):
      self._push(self.low, -self._pop(self.high, ident), ident)
  def findMedian(self):
    if len(self.low) > len(self.high): return -self.low[0]
    return (-self.low[0] + self.high[0]) / 2`,
    java: `class MedianFinder {
  int[] low = new int[8], high = new int[8];
  int ln = 0, hn = 0;
  void grow() {
    if (ln == low.length) low = java.util.Arrays.copyOf(low, ln * 2);
    if (hn == high.length) high = java.util.Arrays.copyOf(high, hn * 2);
  }
  void up(int[] h, int n, int i) {
    while (i > 0) { int p=(i-1)>>1; if (h[i]>=h[p]) break; int t=h[i]; h[i]=h[p]; h[p]=t; i=p; }
  }
  void down(int[] h, int n, int i) {
    while (true) { int s=i, l=i*2+1, r=l+1;
      if (l<n && h[l]<h[s]) s=l; if (r<n && h[r]<h[s]) s=r;
      if (s==i) break; int t=h[i]; h[i]=h[s]; h[s]=t; i=s; }
  }
  void pushLow(int x) { grow(); low[ln++]=x; up(low, ln, ln-1); }
  void pushHigh(int x) { grow(); high[hn++]=x; up(high, hn, hn-1); }
  int popLow() { int t=low[0]; low[0]=low[--ln]; if (ln>0) down(low, ln, 0); return t; }
  int popHigh() { int t=high[0]; high[0]=high[--hn]; if (hn>0) down(high, hn, 0); return t; }
  public MedianFinder() {}
  public void addNum(int num) {
    pushLow(-num);
    pushHigh(-popLow());
    if (hn > ln) pushLow(-popHigh());
  }
  public double findMedian() {
    if (ln > hn) return -low[0];
    return (-low[0] + high[0]) / 2.0;
  }
}
class Solution {}`,
    cpp: `class MedianFinder {
  vector<int> low, high; // low stores negated max-heap; high min-heap
  void up(vector<int>& h, int i) {
    while (i > 0) { int p=(i-1)>>1; if (h[i]>=h[p]) break; swap(h[i], h[p]); i=p; }
  }
  void down(vector<int>& h, int i) {
    int n=(int)h.size();
    while (true) { int s=i, l=i*2+1, r=l+1;
      if (l<n && h[l]<h[s]) s=l; if (r<n && h[r]<h[s]) s=r;
      if (s==i) break; swap(h[i], h[s]); i=s; }
  }
  void push(vector<int>& h, int x) { h.push_back(x); up(h, (int)h.size()-1); }
  int pop(vector<int>& h) {
    int top = h[0]; h[0]=h.back(); h.pop_back(); if (!h.empty()) down(h, 0); return top;
  }
public:
  void addNum(int num) {
    push(low, -num);
    push(high, -pop(low));
    if (high.size() > low.size()) push(low, -pop(high));
  }
  double findMedian() {
    if (low.size() > high.size()) return -low[0];
    return (-low[0] + high[0]) / 2.0;
  }
};`,
    c: `#include <stdlib.h>
/* two array heaps: low is max via negation, high is min */
typedef struct { int *low, *high; int ln, hn, cl, ch; } MedianFinder;
void up(int* h, int i) {
  while (i > 0) { int p=(i-1)>>1; if (h[i]>=h[p]) break; int t=h[i]; h[i]=h[p]; h[p]=t; i=p; }
}
void down(int* h, int n, int i) {
  while (1) { int s=i, l=i*2+1, r=l+1;
    if (l<n && h[l]<h[s]) s=l; if (r<n && h[r]<h[s]) s=r;
    if (s==i) break; int t=h[i]; h[i]=h[s]; h[s]=t; i=s; }
}
void mf_init(MedianFinder* m) { m->low=m->high=NULL; m->ln=m->hn=m->cl=m->ch=0; }
void push_low(MedianFinder* m, int x) {
  if (m->ln==m->cl) { m->cl = m->cl? m->cl*2:8; m->low=(int*)realloc(m->low,sizeof(int)*m->cl); }
  m->low[m->ln++]=x; up(m->low, m->ln-1);
}
void push_high(MedianFinder* m, int x) {
  if (m->hn==m->ch) { m->ch = m->ch? m->ch*2:8; m->high=(int*)realloc(m->high,sizeof(int)*m->ch); }
  m->high[m->hn++]=x; up(m->high, m->hn-1);
}
int pop_low(MedianFinder* m) { int t=m->low[0]; m->low[0]=m->low[--m->ln]; if (m->ln) down(m->low, m->ln, 0); return t; }
int pop_high(MedianFinder* m) { int t=m->high[0]; m->high[0]=m->high[--m->hn]; if (m->hn) down(m->high, m->hn, 0); return t; }
void mf_addNum(MedianFinder* m, int num) {
  push_low(m, -num);
  push_high(m, -pop_low(m));
  if (m->hn > m->ln) push_low(m, -pop_high(m));
}
double mf_findMedian(MedianFinder* m) {
  if (m->ln > m->hn) return -m->low[0];
  return (-m->low[0] + m->high[0]) / 2.0;
}`
  },
  // 45 task scheduler brute
  {
    python: `def leastInterval(tasks, n):
  count = {}
  for t in tasks:
    count[t] = count.get(t, 0) + 1
  types = list(count.keys())
  best = float("inf")
  def left():
    return sum(count[t] for t in types)
  def dfs(time, cool):
    nonlocal best
    if time >= best: return
    if not left():
      best = time
      return
    placed = False
    for t in types:
      if count[t] == 0: continue
      if cool.get(t, 0) > time: continue
      placed = True
      count[t] -= 1
      old = cool.get(t, 0)
      cool[t] = time + n + 1
      dfs(time + 1, cool)
      cool[t] = old
      count[t] += 1
    if not placed:
      dfs(time + 1, cool)
  dfs(0, {})
  return best`,
    java: `import java.util.*;
class Solution {
  int best;
  int left(Map<Character, Integer> count) {
    int s = 0; for (int v : count.values()) s += v; return s;
  }
  void dfs(int time, Map<Character, Integer> count, Map<Character, Integer> cool, int n) {
    if (time >= best) return;
    if (left(count) == 0) { best = time; return; }
    boolean placed = false;
    for (char t : new ArrayList<Character>(count.keySet())) {
      if (count.get(t) == 0) continue;
      if (cool.getOrDefault(t, 0) > time) continue;
      placed = true;
      count.put(t, count.get(t) - 1);
      int old = cool.getOrDefault(t, 0);
      cool.put(t, time + n + 1);
      dfs(time + 1, count, cool, n);
      cool.put(t, old);
      count.put(t, count.get(t) + 1);
    }
    if (!placed) dfs(time + 1, count, cool, n);
  }
  public int leastInterval(char[] tasks, int n) {
    Map<Character, Integer> count = new HashMap<Character, Integer>();
    for (char t : tasks) count.put(t, count.getOrDefault(t, 0) + 1);
    best = Integer.MAX_VALUE;
    dfs(0, count, new HashMap<Character, Integer>(), n);
    return best;
  }
}`,
    cpp: `class Solution {
  int best;
  int left(unordered_map<char,int>& count) {
    int s = 0; for (auto& p : count) s += p.second; return s;
  }
  void dfs(int time, unordered_map<char,int>& count, unordered_map<char,int>& cool, int n) {
    if (time >= best) return;
    if (!left(count)) { best = time; return; }
    bool placed = false;
    vector<char> types;
    for (auto& p : count) types.push_back(p.first);
    for (char t : types) {
      if (count[t] == 0) continue;
      if (cool[t] > time) continue;
      placed = true;
      count[t]--;
      int old = cool[t];
      cool[t] = time + n + 1;
      dfs(time + 1, count, cool, n);
      cool[t] = old;
      count[t]++;
    }
    if (!placed) dfs(time + 1, count, cool, n);
  }
public:
  int leastInterval(vector<char>& tasks, int n) {
    unordered_map<char,int> count, cool;
    for (char t : tasks) count[t]++;
    best = INT_MAX;
    dfs(0, count, cool, n);
    return best;
  }
};`,
    c: `#include <string.h>
#include <limits.h>
/* 26 letters: count[26], cool[26] next free time */
int best_g;
int left26(int* count) { int s=0; for (int i=0;i<26;i++) s+=count[i]; return s; }
void dfs_ts(int time, int* count, int* cool, int n) {
  if (time >= best_g) return;
  if (!left26(count)) { best_g = time; return; }
  int placed = 0;
  for (int t = 0; t < 26; t++) {
    if (count[t] == 0) continue;
    if (cool[t] > time) continue;
    placed = 1;
    count[t]--;
    int old = cool[t];
    cool[t] = time + n + 1;
    dfs_ts(time + 1, count, cool, n);
    cool[t] = old;
    count[t]++;
  }
  if (!placed) dfs_ts(time + 1, count, cool, n);
}
int leastInterval(char* tasks, int ntasks, int n) {
  int count[26] = {0}, cool[26] = {0};
  for (int i = 0; i < ntasks; i++) count[tasks[i]-'A']++;
  best_g = INT_MAX;
  dfs_ts(0, count, cool, n);
  return best_g;
}`
  },
  // 46 task scheduler heap
  {
    python: `def leastInterval(tasks, n):
  freq = [0] * 26
  for t in tasks:
    freq[ord(t) - 65] += 1
  h = []
  def up(i):
    while i > 0:
      p = (i - 1) >> 1
      if h[i] <= h[p]: break
      h[i], h[p] = h[p], h[i]
      i = p
  def down(i):
    while True:
      s = i
      l, r = i * 2 + 1, i * 2 + 2
      if l < len(h) and h[l] > h[s]: s = l
      if r < len(h) and h[r] > h[s]: s = r
      if s == i: break
      h[i], h[s] = h[s], h[i]
      i = s
  def push(x):
    h.append(x); up(len(h) - 1)
  def pop():
    top = h[0]
    last = h.pop()
    if h:
      h[0] = last; down(0)
    return top
  for i in range(26):
    if freq[i]: push(freq[i])
  cool = []
  time = 0
  while h or cool:
    time += 1
    if h:
      left = pop() - 1
      if left: cool.append([left, time + n])
    if cool and cool[0][1] == time:
      push(cool.pop(0)[0])
  return time`,
    java: `import java.util.*;
class Solution {
  ArrayList<Integer> h = new ArrayList<Integer>();
  void up(int i) {
    while (i > 0) { int p=(i-1)>>1; if (h.get(i) <= h.get(p)) break;
      int t=h.get(i); h.set(i,h.get(p)); h.set(p,t); i=p; }
  }
  void down(int i) {
    while (true) { int s=i, l=i*2+1, r=l+1;
      if (l<h.size() && h.get(l)>h.get(s)) s=l;
      if (r<h.size() && h.get(r)>h.get(s)) s=r;
      if (s==i) break; int t=h.get(i); h.set(i,h.get(s)); h.set(s,t); i=s; }
  }
  void push(int x) { h.add(x); up(h.size()-1); }
  int pop() {
    int top = h.get(0); int last = h.remove(h.size()-1);
    if (!h.isEmpty()) { h.set(0, last); down(0); }
    return top;
  }
  public int leastInterval(char[] tasks, int n) {
    int[] freq = new int[26];
    for (char t : tasks) freq[t - 65]++;
    for (int i = 0; i < 26; i++) if (freq[i] > 0) push(freq[i]);
    ArrayDeque<int[]> cool = new ArrayDeque<int[]>();
    int time = 0;
    while (!h.isEmpty() || !cool.isEmpty()) {
      time++;
      if (!h.isEmpty()) {
        int left = pop() - 1;
        if (left > 0) cool.addLast(new int[]{left, time + n});
      }
      if (!cool.isEmpty() && cool.peekFirst()[1] == time) push(cool.pollFirst()[0]);
    }
    return time;
  }
}`,
    cpp: `class Solution {
  vector<int> h;
  void up(int i) {
    while (i > 0) { int p=(i-1)>>1; if (h[i] <= h[p]) break; swap(h[i], h[p]); i=p; }
  }
  void down(int i) {
    int n=(int)h.size();
    while (true) { int s=i, l=i*2+1, r=l+1;
      if (l<n && h[l]>h[s]) s=l; if (r<n && h[r]>h[s]) s=r;
      if (s==i) break; swap(h[i], h[s]); i=s; }
  }
  void push(int x) { h.push_back(x); up((int)h.size()-1); }
  int pop() { int top=h[0]; h[0]=h.back(); h.pop_back(); if (!h.empty()) down(0); return top; }
public:
  int leastInterval(vector<char>& tasks, int n) {
    int freq[26] = {};
    for (char t : tasks) freq[t - 65]++;
    for (int i = 0; i < 26; i++) if (freq[i]) push(freq[i]);
    queue<pair<int,int>> cool;
    int time = 0;
    while (!h.empty() || !cool.empty()) {
      time++;
      if (!h.empty()) {
        int left = pop() - 1;
        if (left) cool.push({left, time + n});
      }
      if (!cool.empty() && cool.front().second == time) { push(cool.front().first); cool.pop(); }
    }
    return time;
  }
};`,
    c: `#include <stdlib.h>
/* max-heap of remaining counts; cool queue of (left, readyTime) */
void upmax(int* h, int i) {
  while (i > 0) { int p=(i-1)>>1; if (h[i] <= h[p]) break; int t=h[i]; h[i]=h[p]; h[p]=t; i=p; }
}
void downmax(int* h, int n, int i) {
  while (1) { int s=i, l=i*2+1, r=l+1;
    if (l<n && h[l]>h[s]) s=l; if (r<n && h[r]>h[s]) s=r;
    if (s==i) break; int t=h[i]; h[i]=h[s]; h[s]=t; i=s; }
}
int leastInterval(char* tasks, int ntasks, int n) {
  int freq[26] = {0};
  for (int i = 0; i < ntasks; i++) freq[tasks[i]-65]++;
  int h[26], sz = 0;
  for (int i = 0; i < 26; i++) if (freq[i]) { h[sz++] = freq[i]; upmax(h, sz-1); }
  int cl[26], ct[26], ch=0, ct1=0; /* cool queue */
  int time = 0;
  while (sz || ch < ct1) {
    time++;
    if (sz) {
      int left = h[0] - 1;
      h[0] = h[--sz]; if (sz) downmax(h, sz, 0);
      if (left) { cl[ct1] = left; ct[ct1] = time + n; ct1++; }
    }
    if (ch < ct1 && ct[ch] == time) {
      h[sz++] = cl[ch++]; upmax(h, sz-1);
    }
  }
  return time;
}`
  },
  // 47 task scheduler formula
  {
    python: `def leastInterval(tasks, n):
  freq = [0] * 26
  for t in tasks:
    freq[ord(t) - 65] += 1
  maxF = maxCount = 0
  for f in freq:
    if f > maxF:
      maxF = f; maxCount = 1
    elif f == maxF:
      maxCount += 1
  frame = (maxF - 1) * (n + 1) + maxCount
  return max(frame, len(tasks))`,
    java: `class Solution {
  public int leastInterval(char[] tasks, int n) {
    int[] freq = new int[26];
    for (char t : tasks) freq[t - 65]++;
    int maxF = 0, maxCount = 0;
    for (int i = 0; i < 26; i++) {
      if (freq[i] > maxF) { maxF = freq[i]; maxCount = 1; }
      else if (freq[i] == maxF) maxCount++;
    }
    int frame = (maxF - 1) * (n + 1) + maxCount;
    return Math.max(frame, tasks.length);
  }
}`,
    cpp: `class Solution {
public:
  int leastInterval(vector<char>& tasks, int n) {
    int freq[26] = {};
    for (char t : tasks) freq[t - 65]++;
    int maxF = 0, maxCount = 0;
    for (int i = 0; i < 26; i++) {
      if (freq[i] > maxF) { maxF = freq[i]; maxCount = 1; }
      else if (freq[i] == maxF) maxCount++;
    }
    int frame = (maxF - 1) * (n + 1) + maxCount;
    return max(frame, (int)tasks.size());
  }
};`,
    c: `int leastInterval(char* tasks, int ntasks, int n) {
  int freq[26] = {0};
  for (int i = 0; i < ntasks; i++) freq[tasks[i]-65]++;
  int maxF = 0, maxCount = 0;
  for (int i = 0; i < 26; i++) {
    if (freq[i] > maxF) { maxF = freq[i]; maxCount = 1; }
    else if (freq[i] == maxF) maxCount++;
  }
  int frame = (maxF - 1) * (n + 1) + maxCount;
  return frame > ntasks ? frame : ntasks;
}`
  }
];
