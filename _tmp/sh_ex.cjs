module.exports = [
  // 0 example: array as stack
  {
    python: `st = []
st.append(10)
st.append(20)
print(st.pop())  # 20
print(st[-1])    # 10, peek`,
    java: `import java.util.*;
class Solution {
  public static void demo() {
    ArrayDeque<Integer> st = new ArrayDeque<Integer>();
    st.push(10);
    st.push(20);
    System.out.println(st.pop()); // 20
    System.out.println(st.peek()); // 10, peek
  }
}`,
    cpp: `#include <bits/stdc++.h>
using namespace std;
void demo() {
  vector<int> st;
  st.push_back(10);
  st.push_back(20);
  cout << st.back() << "\\n"; st.pop_back(); // 20
  cout << st.back() << "\\n"; // 10, peek
}`,
    c: `#include <stdio.h>
/* stack: a[0..n-1], n is size, top is a[n-1] */
int st[8];
int n = 0;
st[n++] = 10;
st[n++] = 20;
printf("%d\\n", st[--n]);     /* 20 */
printf("%d\\n", st[n - 1]);   /* 10, peek */`
  },
  // 1 example: array as queue
  {
    python: `from collections import deque
q = deque()
q.append(1)
q.append(2)
print(q.popleft())  # 1
print(q[0])         # 2, front`,
    java: `import java.util.*;
class Solution {
  public static void demo() {
    ArrayDeque<Integer> q = new ArrayDeque<Integer>();
    q.addLast(1);
    q.addLast(2);
    System.out.println(q.pollFirst()); // 1
    System.out.println(q.peekFirst());   // 2, front
  }
}`,
    cpp: `#include <bits/stdc++.h>
using namespace std;
void demo() {
  queue<int> q;
  q.push(1);
  q.push(2);
  cout << q.front() << "\\n"; q.pop(); // 1
  cout << q.front() << "\\n";          // 2, front
}`,
    c: `#include <stdio.h>
/* queue: a[head..tail-1], n is capacity bound */
int q[8];
int head = 0, tail = 0;
q[tail++] = 1;
q[tail++] = 2;
printf("%d\\n", q[head++]); /* 1 */
printf("%d\\n", q[head]);   /* 2, front */`
  },
  // 2 example: next greater monotonic stack
  {
    python: `def nextGreater(nums):
  n = len(nums)
  ans = [-1] * n
  st = []
  for i in range(n):
    while st and nums[st[-1]] < nums[i]:
      ans[st.pop()] = nums[i]
    st.append(i)
  return ans`,
    java: `import java.util.*;
class Solution {
  public int[] nextGreater(int[] nums) {
    int n = nums.length;
    int[] ans = new int[n];
    Arrays.fill(ans, -1);
    ArrayDeque<Integer> st = new ArrayDeque<Integer>();
    for (int i = 0; i < n; i++) {
      while (!st.isEmpty() && nums[st.peek()] < nums[i]) {
        ans[st.pop()] = nums[i];
      }
      st.push(i);
    }
    return ans;
  }
}`,
    cpp: `#include <bits/stdc++.h>
using namespace std;
vector<int> nextGreater(vector<int>& nums) {
  int n = (int)nums.size();
  vector<int> ans(n, -1);
  vector<int> st;
  for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[st.back()] < nums[i]) {
      ans[st.back()] = nums[i];
      st.pop_back();
    }
    st.push_back(i);
  }
  return ans;
}`,
    c: `#include <stdlib.h>
/* nums[0..n-1] -> ans[i] = next greater, or -1. st is index stack. */
int* nextGreater(int* nums, int n, int* returnSize) {
  int* ans = (int*)malloc(sizeof(int) * n);
  int* st = (int*)malloc(sizeof(int) * n);
  int sn = 0;
  for (int i = 0; i < n; i++) ans[i] = -1;
  for (int i = 0; i < n; i++) {
    while (sn && nums[st[sn - 1]] < nums[i]) ans[st[--sn]] = nums[i];
    st[sn++] = i;
  }
  free(st);
  *returnSize = n;
  return ans;
}`
  },
  // 3 example: tiny min-heap
  {
    python: `class MinHeap:
  def __init__(self, keyFn=None):
    self.a = []
    self.key = keyFn or (lambda x: x)
  def size(self):
    return len(self.a)
  def peek(self):
    return self.a[0]
  def push(self, x):
    self.a.append(x)
    self.up(len(self.a) - 1)
  def pop(self):
    top = self.a[0]
    last = self.a.pop()
    if self.a:
      self.a[0] = last
      self.down(0)
    return top
  def up(self, i):
    while i > 0:
      p = (i - 1) >> 1
      if self.key(self.a[i]) >= self.key(self.a[p]):
        break
      self.a[i], self.a[p] = self.a[p], self.a[i]
      i = p
  def down(self, i):
    n = len(self.a)
    while True:
      s = i
      l = i * 2 + 1
      r = l + 1
      if l < n and self.key(self.a[l]) < self.key(self.a[s]):
        s = l
      if r < n and self.key(self.a[r]) < self.key(self.a[s]):
        s = r
      if s == i:
        break
      self.a[i], self.a[s] = self.a[s], self.a[i]
      i = s`,
    java: `import java.util.*;
class Solution {
  static class MinHeap {
    ArrayList<int[]> a = new ArrayList<int[]>();
    int key(int[] x) { return x[0]; }
    int size() { return a.size(); }
    int[] peek() { return a.get(0); }
    void push(int[] x) {
      a.add(x);
      up(a.size() - 1);
    }
    int[] pop() {
      int[] top = a.get(0);
      int[] last = a.remove(a.size() - 1);
      if (!a.isEmpty()) { a.set(0, last); down(0); }
      return top;
    }
    void up(int i) {
      while (i > 0) {
        int p = (i - 1) >> 1;
        if (key(a.get(i)) >= key(a.get(p))) break;
        int[] t = a.get(i); a.set(i, a.get(p)); a.set(p, t);
        i = p;
      }
    }
    void down(int i) {
      int n = a.size();
      while (true) {
        int s = i, l = i * 2 + 1, r = l + 1;
        if (l < n && key(a.get(l)) < key(a.get(s))) s = l;
        if (r < n && key(a.get(r)) < key(a.get(s))) s = r;
        if (s == i) break;
        int[] t = a.get(i); a.set(i, a.get(s)); a.set(s, t);
        i = s;
      }
    }
  }
}`,
    cpp: `#include <bits/stdc++.h>
using namespace std;
struct MinHeap {
  vector<vector<int>> a;
  int key(const vector<int>& x) { return x[0]; }
  int size() { return (int)a.size(); }
  void push(vector<int> x) {
    a.push_back(x);
    up((int)a.size() - 1);
  }
  vector<int> pop() {
    vector<int> top = a[0];
    vector<int> last = a.back(); a.pop_back();
    if (!a.empty()) { a[0] = last; down(0); }
    return top;
  }
  void up(int i) {
    while (i > 0) {
      int p = (i - 1) >> 1;
      if (key(a[i]) >= key(a[p])) break;
      swap(a[i], a[p]);
      i = p;
    }
  }
  void down(int i) {
    int n = (int)a.size();
    while (true) {
      int s = i, l = i * 2 + 1, r = l + 1;
      if (l < n && key(a[l]) < key(a[s])) s = l;
      if (r < n && key(a[r]) < key(a[s])) s = r;
      if (s == i) break;
      swap(a[i], a[s]);
      i = s;
    }
  }
};`,
    c: `#include <stdlib.h>
/* min-heap of pair (key, val) stored as two parallel arrays k[], v[] */
typedef struct {
  int *k, *v, n, cap;
} MinHeap;
void heap_up(MinHeap* h, int i) {
  while (i > 0) {
    int p = (i - 1) >> 1;
    if (h->k[i] >= h->k[p]) break;
    int tk = h->k[i]; h->k[i] = h->k[p]; h->k[p] = tk;
    int tv = h->v[i]; h->v[i] = h->v[p]; h->v[p] = tv;
    i = p;
  }
}
void heap_down(MinHeap* h, int i) {
  while (1) {
    int s = i, l = i * 2 + 1, r = l + 1;
    if (l < h->n && h->k[l] < h->k[s]) s = l;
    if (r < h->n && h->k[r] < h->k[s]) s = r;
    if (s == i) break;
    int tk = h->k[i]; h->k[i] = h->k[s]; h->k[s] = tk;
    int tv = h->v[i]; h->v[i] = h->v[s]; h->v[s] = tv;
    i = s;
  }
}
void heap_push(MinHeap* h, int key, int val) {
  if (h->n == h->cap) {
    h->cap = h->cap ? h->cap * 2 : 8;
    h->k = (int*)realloc(h->k, sizeof(int) * h->cap);
    h->v = (int*)realloc(h->v, sizeof(int) * h->cap);
  }
  h->k[h->n] = key; h->v[h->n] = val; h->n++;
  heap_up(h, h->n - 1);
}
void heap_pop(MinHeap* h, int* key, int* val) {
  *key = h->k[0]; *val = h->v[0];
  h->n--;
  if (h->n) { h->k[0] = h->k[h->n]; h->v[0] = h->v[h->n]; heap_down(h, 0); }
}`
  },
  // 4 example: two stacks make a queue
  {
    python: `inSt = []
outSt = []
def enqueue(x):
  inSt.append(x)
def dequeue():
  if not outSt:
    while inSt:
      outSt.append(inSt.pop())
  return outSt.pop()`,
    java: `import java.util.*;
class Solution {
  ArrayDeque<Integer> inSt = new ArrayDeque<Integer>();
  ArrayDeque<Integer> outSt = new ArrayDeque<Integer>();
  void enqueue(int x) { inSt.push(x); }
  int dequeue() {
    if (outSt.isEmpty()) {
      while (!inSt.isEmpty()) outSt.push(inSt.pop());
    }
    return outSt.pop();
  }
}`,
    cpp: `#include <bits/stdc++.h>
using namespace std;
vector<int> inSt, outSt;
void enqueue(int x) { inSt.push_back(x); }
int dequeue() {
  if (outSt.empty()) {
    while (!inSt.empty()) { outSt.push_back(inSt.back()); inSt.pop_back(); }
  }
  int x = outSt.back(); outSt.pop_back();
  return x;
}`,
    c: `#include <stdio.h>
/* two stacks as arrays; nIn / nOut are lengths */
int inSt[64], outSt[64];
int nIn = 0, nOut = 0;
void enqueue(int x) { inSt[nIn++] = x; }
int dequeue(void) {
  if (!nOut) {
    while (nIn) outSt[nOut++] = inSt[--nIn];
  }
  return outSt[--nOut];
}`
  },
  // 5 example: deque window max
  {
    python: `from collections import deque
def windowMax(nums, k):
  dq = deque()
  out = []
  for i in range(len(nums)):
    while dq and nums[dq[-1]] <= nums[i]:
      dq.pop()
    dq.append(i)
    if dq[0] <= i - k:
      dq.popleft()
    if i >= k - 1:
      out.append(nums[dq[0]])
  return out`,
    java: `import java.util.*;
class Solution {
  public int[] windowMax(int[] nums, int k) {
    ArrayDeque<Integer> dq = new ArrayDeque<Integer>();
    int n = nums.length;
    int[] out = new int[n - k + 1];
    int p = 0;
    for (int i = 0; i < n; i++) {
      while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();
      dq.addLast(i);
      if (dq.peekFirst() <= i - k) dq.pollFirst();
      if (i >= k - 1) out[p++] = nums[dq.peekFirst()];
    }
    return out;
  }
}`,
    cpp: `#include <bits/stdc++.h>
using namespace std;
vector<int> windowMax(vector<int>& nums, int k) {
  deque<int> dq;
  vector<int> out;
  int n = (int)nums.size();
  for (int i = 0; i < n; i++) {
    while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();
    dq.push_back(i);
    if (dq.front() <= i - k) dq.pop_front();
    if (i >= k - 1) out.push_back(nums[dq.front()]);
  }
  return out;
}`,
    c: `#include <stdlib.h>
/* dq[0..dn-1] is decreasing indices; head is dq[0] */
int* windowMax(int* nums, int n, int k, int* returnSize) {
  int* dq = (int*)malloc(sizeof(int) * n);
  int head = 0, tail = 0;
  int* out = (int*)malloc(sizeof(int) * n);
  int p = 0;
  for (int i = 0; i < n; i++) {
    while (head < tail && nums[dq[tail - 1]] <= nums[i]) tail--;
    dq[tail++] = i;
    if (dq[head] <= i - k) head++;
    if (i >= k - 1) out[p++] = nums[dq[head]];
  }
  free(dq);
  *returnSize = p;
  return out;
}`
  },
  // 6 example: two heaps median picture
  {
    python: `# picture only: lower = max-heap, upper = min-heap
# after [1, 5, 2]:
lowerTop = 2  # max of lower half
upperTop = 5  # min of upper half
n = 3
median = lowerTop if n % 2 else (lowerTop + upperTop) / 2`,
    java: `class Solution {
  public static void demo() {
    // picture only: lower = max-heap, upper = min-heap
    // after [1, 5, 2]:
    int lowerTop = 2; // max of lower half
    int upperTop = 5; // min of upper half
    int n = 3;
    double median = n % 2 != 0 ? lowerTop : (lowerTop + upperTop) / 2.0;
  }
}`,
    cpp: `// picture only: lower = max-heap, upper = min-heap
// after [1, 5, 2]:
int lowerTop = 2; // max of lower half
int upperTop = 5; // min of upper half
int n = 3;
double median = n % 2 ? lowerTop : (lowerTop + upperTop) / 2.0;`,
    c: `/* picture only: lower = max-heap, upper = min-heap
   after [1, 5, 2]: */
int lowerTop = 2; /* max of lower half */
int upperTop = 5; /* min of upper half */
int n = 3;
double median = n % 2 ? lowerTop : (lowerTop + upperTop) / 2.0;`
  },
  // 7 example: decode frame stack
  {
    python: `def decodeTiny(s):
  st = []
  cur = ""
  k = 0
  for ch in s:
    if "0" <= ch <= "9":
      k = k * 10 + ord(ch) - 48
    elif ch == "[":
      st.append((cur, k))
      cur = ""
      k = 0
    elif ch == "]":
      prev, ck = st.pop()
      cur = prev + cur * ck
    else:
      cur += ch
  return cur`,
    java: `import java.util.*;
class Solution {
  public String decodeTiny(String s) {
    ArrayDeque<String> strs = new ArrayDeque<String>();
    ArrayDeque<Integer> ks = new ArrayDeque<Integer>();
    StringBuilder cur = new StringBuilder();
    int k = 0;
    for (int i = 0; i < s.length(); i++) {
      char ch = s.charAt(i);
      if (ch >= '0' && ch <= '9') k = k * 10 + (ch - '0');
      else if (ch == '[') {
        strs.push(cur.toString());
        ks.push(k);
        cur = new StringBuilder();
        k = 0;
      } else if (ch == ']') {
        String prev = strs.pop();
        int ck = ks.pop();
        StringBuilder next = new StringBuilder(prev);
        for (int t = 0; t < ck; t++) next.append(cur);
        cur = next;
      } else cur.append(ch);
    }
    return cur.toString();
  }
}`,
    cpp: `#include <bits/stdc++.h>
using namespace std;
string decodeTiny(string s) {
  vector<pair<string,int>> st;
  string cur;
  int k = 0;
  for (char ch : s) {
    if (ch >= '0' && ch <= '9') k = k * 10 + (ch - '0');
    else if (ch == '[') {
      st.push_back({cur, k});
      cur = "";
      k = 0;
    } else if (ch == ']') {
      auto frame = st.back(); st.pop_back();
      string next = frame.first;
      for (int t = 0; t < frame.second; t++) next += cur;
      cur = next;
    } else cur += ch;
  }
  return cur;
}`,
    c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
/* frames: prev string + repeat count. cur is a growable buffer. */
char* decodeTiny(const char* s) {
  char* prevs[64];
  int ks[64], sn = 0;
  int cap = 64, n = 0;
  char* cur = (char*)malloc(cap);
  cur[0] = 0;
  int k = 0;
  for (int i = 0; s[i]; i++) {
    char ch = s[i];
    if (ch >= '0' && ch <= '9') k = k * 10 + (ch - '0');
    else if (ch == '[') {
      prevs[sn] = cur; ks[sn] = k; sn++;
      cap = 64; n = 0; cur = (char*)malloc(cap); cur[0] = 0; k = 0;
    } else if (ch == ']') {
      char* prev = prevs[--sn]; int ck = ks[sn];
      int pn = (int)strlen(prev), cn = (int)strlen(cur);
      char* next = (char*)malloc(pn + cn * ck + 1);
      memcpy(next, prev, pn);
      for (int t = 0; t < ck; t++) memcpy(next + pn + t * cn, cur, cn);
      next[pn + cn * ck] = 0;
      free(prev); free(cur); cur = next;
    } else {
      int cn = (int)strlen(cur);
      cur = (char*)realloc(cur, cn + 2);
      cur[cn] = ch; cur[cn + 1] = 0;
    }
  }
  return cur;
}`
  },
  // 8 example: sort vs heap top-k
  {
    python: `def topKSort(nums, k):
  return sorted(nums, reverse=True)[:k]

def topKHeap(nums, k, heap):
  for x in nums:
    if heap.size() < k:
      heap.push(x)
    elif x > heap.peek():
      heap.pop()
      heap.push(x)
  out = []
  while heap.size():
    out.append(heap.pop())
  return out`,
    java: `import java.util.*;
class Solution {
  public int[] topKSort(int[] nums, int k) {
    int[] a = nums.clone();
    Arrays.sort(a);
    int[] out = new int[k];
    for (int i = 0; i < k; i++) out[i] = a[a.length - 1 - i];
    return out;
  }
  static class MinHeap {
    int[] a = new int[8];
    int n = 0;
    int size() { return n; }
    int peek() { return a[0]; }
    void push(int x) {
      if (n == a.length) a = Arrays.copyOf(a, n * 2);
      a[n++] = x; up(n - 1);
    }
    int pop() {
      int top = a[0]; a[0] = a[--n]; if (n > 0) down(0); return top;
    }
    void up(int i) {
      while (i > 0) {
        int p = (i - 1) >> 1;
        if (a[i] >= a[p]) break;
        int t = a[i]; a[i] = a[p]; a[p] = t; i = p;
      }
    }
    void down(int i) {
      while (true) {
        int s = i, l = i * 2 + 1, r = l + 1;
        if (l < n && a[l] < a[s]) s = l;
        if (r < n && a[r] < a[s]) s = r;
        if (s == i) break;
        int t = a[i]; a[i] = a[s]; a[s] = t; i = s;
      }
    }
  }
  public int[] topKHeap(int[] nums, int k, MinHeap heap) {
    for (int x : nums) {
      if (heap.size() < k) heap.push(x);
      else if (x > heap.peek()) { heap.pop(); heap.push(x); }
    }
    int[] out = new int[heap.size()];
    int i = 0;
    while (heap.size() > 0) out[i++] = heap.pop();
    return out;
  }
}`,
    cpp: `#include <bits/stdc++.h>
using namespace std;
vector<int> topKSort(vector<int> nums, int k) {
  sort(nums.begin(), nums.end(), greater<int>());
  nums.resize(k);
  return nums;
}
struct MinHeap {
  vector<int> a;
  int size() { return (int)a.size(); }
  int peek() { return a[0]; }
  void push(int x) { a.push_back(x); up((int)a.size()-1); }
  int pop() {
    int top = a[0]; a[0] = a.back(); a.pop_back();
    if (!a.empty()) down(0);
    return top;
  }
  void up(int i) {
    while (i > 0) {
      int p = (i - 1) >> 1;
      if (a[i] >= a[p]) break;
      swap(a[i], a[p]); i = p;
    }
  }
  void down(int i) {
    int n = (int)a.size();
    while (true) {
      int s = i, l = i*2+1, r = l+1;
      if (l < n && a[l] < a[s]) s = l;
      if (r < n && a[r] < a[s]) s = r;
      if (s == i) break;
      swap(a[i], a[s]); i = s;
    }
  }
};
vector<int> topKHeap(vector<int>& nums, int k, MinHeap& heap) {
  for (int x : nums) {
    if (heap.size() < k) heap.push(x);
    else if (x > heap.peek()) { heap.pop(); heap.push(x); }
  }
  vector<int> out;
  while (heap.size()) out.push_back(heap.pop());
  return out;
}`,
    c: `#include <stdlib.h>
/* sort copy descending, take first k */
int cmp_desc(const void* a, const void* b) { return *(const int*)b - *(const int*)a; }
int* topKSort(int* nums, int n, int k, int* returnSize) {
  int* a = (int*)malloc(sizeof(int) * n);
  for (int i = 0; i < n; i++) a[i] = nums[i];
  qsort(a, n, sizeof(int), cmp_desc);
  *returnSize = k;
  return a; /* first k are the answer */
}
/* min-heap of size k in h[0..sz-1] */
void heap_up(int* h, int i) {
  while (i > 0) {
    int p = (i - 1) >> 1;
    if (h[i] >= h[p]) break;
    int t = h[i]; h[i] = h[p]; h[p] = t; i = p;
  }
}
void heap_down(int* h, int n, int i) {
  while (1) {
    int s = i, l = i * 2 + 1, r = l + 1;
    if (l < n && h[l] < h[s]) s = l;
    if (r < n && h[r] < h[s]) s = r;
    if (s == i) break;
    int t = h[i]; h[i] = h[s]; h[s] = t; i = s;
  }
}
int* topKHeap(int* nums, int n, int k, int* returnSize) {
  int* h = (int*)malloc(sizeof(int) * (k + 1));
  int sz = 0;
  for (int i = 0; i < n; i++) {
    if (sz < k) { h[sz++] = nums[i]; heap_up(h, sz - 1); }
    else if (nums[i] > h[0]) {
      h[0] = h[--sz]; if (sz) heap_down(h, sz, 0);
      h[sz++] = nums[i]; heap_up(h, sz - 1);
    }
  }
  *returnSize = sz;
  return h;
}`
  }
];
