window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["dsa-stackheap"] = {
  kind: "dsa",
  notes: [
    { title: "Stack (LIFO)", body: "A stack is last in, first out. Push adds on top. Pop removes the top. Peek reads the top without removing it. The call stack, undo, matching brackets, and 'next greater' walks are stacks. In JavaScript an array with push and pop is a stack." },
    { title: "Queue (FIFO)", body: "A queue is first in, first out. Enqueue adds at the back. Dequeue removes the front. BFS is a queue. In JavaScript, push plus shift is a queue (shift is O(n), fine for interviews). A ring buffer or two stacks can make dequeue cheaper." },
    { title: "Monotonic stack", body: "A monotonic stack keeps values increasing or decreasing. You pop while the new value breaks the order. What you pop has found its 'next greater' (or next smaller). Daily temperatures, next greater element, largest rectangle in a histogram, and car fleet all use this pattern." },
    { title: "Heap / priority queue", body: "A heap is a binary tree in an array where the parent is smaller (min-heap) or larger (max-heap) than its children. Index 0 is the root. Parent of i is (i-1)>>1. Children are 2i+1 and 2i+2. Push bubbles up. Pop swaps last to root and bubbles down. JavaScript has no built-in heap; interviews accept a tiny helper or sort when n is small." },
    { title: "Top-K pattern", body: "Need the k biggest or most frequent items? Count first if needed. Then either sort O(n log n), keep a min-heap of size k O(n log k), or bucket by count O(n). Say all three in an interview. Heap wins when k is tiny and n is huge." },
    { title: "Two heaps", body: "Median of a stream: a max-heap of the lower half and a min-heap of the upper half. Keep sizes equal or lower one bigger. The median is the lower top, or the average of both tops. Rebalance after every insert." },
    { title: "Two stacks as a queue", body: "In-stack receives pushes. Out-stack serves pops. When out is empty, pour in into out (that reverses order). Each item moves at most twice, so pop is amortized O(1). The brute version pours back and forth on every call." },
    { title: "Deque for window max", body: "A deque (double-ended queue) of indices, values decreasing from front to back. The front is the max of the current window. Pop back while the new value is larger. Pop front when it slides out of the window. Each index enters and leaves once: O(n)." },
    { title: "Nested decode with a stack", body: "Strings like 3[a2[c]] need a stack of frames. A digit builds a count. '[' pushes the current string and count. Letters append to the current string. ']' pops and repeats. Recursion is the same idea with the call stack." },
    { title: "Interview habit", body: "Name the structure in one sentence: 'monotonic stack of indices' or 'min-heap of size k'. State time and space. For heap problems, mention sort first, then the heap, then a linear trick if one exists (bucket sort, math formula). Walk a 4-item example on the board." }
  ],
  examples: [
    {
      lang: "js",
      title: "1. Array as a stack",
      desc: "What this is\npush adds on top. pop removes the top. The last index is the top.\n\nWhat the code is doing\nst starts empty. push 10 then 20. pop returns 20, so 10 is left.\n\nWatch out\npop on an empty array returns undefined. Peek is st[st.length - 1].",
      code: `const st = [];
st.push(10);
st.push(20);
console.log(st.pop()); // 20
console.log(st[st.length - 1]); // 10, peek`,
      codes: {
        javascript: `const st = [];
st.push(10);
st.push(20);
console.log(st.pop()); // 20
console.log(st[st.length - 1]); // 10, peek`,
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
      }
    },
    {
      lang: "js",
      title: "2. Array as a queue",
      desc: "What this is\npush adds at the back. shift removes the front.\n\nWhat the code is doing\nq gets 1 then 2. shift returns 1, the oldest item.\n\nWatch out\nshift is O(n) because every later item slides left. For interview BFS this is still the usual queue.",
      code: `const q = [];
q.push(1);
q.push(2);
console.log(q.shift()); // 1
console.log(q[0]);      // 2, front`,
      codes: {
        javascript: `const q = [];
q.push(1);
q.push(2);
console.log(q.shift()); // 1
console.log(q[0]);      // 2, front`,
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
      }
    },
    {
      lang: "js",
      title: "3. Monotonic stack (next greater)",
      desc: "What this is\nWalk left to right. Pop smaller (or equal) indices while the new value is bigger. Those popped indices just found their next greater.\n\nWhat the code is doing\nans starts as -1 for each index. For [2,1,3] index 0 pops when 3 arrives, so ans[0] becomes 3. Index 1 also pops, ans[1] becomes 3.\n\nWatch out\nStore indices, not values, when you also need the distance (daily temperatures).",
      code: `function nextGreater(nums) {
  const ans = Array(nums.length).fill(-1);
  const st = [];
  for (let i = 0; i < nums.length; i++) {
    while (st.length && nums[st[st.length - 1]] < nums[i]) {
      ans[st.pop()] = nums[i];
    }
    st.push(i);
  }
  return ans;
}`,
      codes: {
        javascript: `function nextGreater(nums) {
  const ans = Array(nums.length).fill(-1);
  const st = [];
  for (let i = 0; i < nums.length; i++) {
    while (st.length && nums[st[st.length - 1]] < nums[i]) {
      ans[st.pop()] = nums[i];
    }
    st.push(i);
  }
  return ans;
}`,
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
      }
    },
    {
      lang: "js",
      title: "4. Tiny min-heap",
      desc: "What this is\nA binary min-heap in an array. Smallest key() sits at index 0.\n\nWhat the code is doing\npush appends then bubbleUp. pop swaps the last item to the root then bubbleDown. key defaults to pair[0] so [priority, value] works.\n\nWatch out\nThis is not a library. Copy the helper into a solution when you need a real heap. For stale Dijkstra entries, skip pops whose distance is worse than dist[node].",
      code: `function MinHeap(keyFn) {
  this.a = [];
  this.key = keyFn || function (x) { return x; };
  this.size = function () { return this.a.length; };
  this.peek = function () { return this.a[0]; };
  this.push = function (x) {
    this.a.push(x);
    this.up(this.a.length - 1);
  };
  this.pop = function () {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) { this.a[0] = last; this.down(0); }
    return top;
  };
  this.up = function (i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.key(this.a[i]) >= this.key(this.a[p])) break;
      const t = this.a[i]; this.a[i] = this.a[p]; this.a[p] = t;
      i = p;
    }
  };
  this.down = function (i) {
    const n = this.a.length;
    while (true) {
      let s = i;
      const l = i * 2 + 1, r = l + 1;
      if (l < n && this.key(this.a[l]) < this.key(this.a[s])) s = l;
      if (r < n && this.key(this.a[r]) < this.key(this.a[s])) s = r;
      if (s === i) break;
      const t = this.a[i]; this.a[i] = this.a[s]; this.a[s] = t;
      i = s;
    }
  };
}`,
      codes: {
        javascript: `function MinHeap(keyFn) {
  this.a = [];
  this.key = keyFn || function (x) { return x; };
  this.size = function () { return this.a.length; };
  this.peek = function () { return this.a[0]; };
  this.push = function (x) {
    this.a.push(x);
    this.up(this.a.length - 1);
  };
  this.pop = function () {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) { this.a[0] = last; this.down(0); }
    return top;
  };
  this.up = function (i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.key(this.a[i]) >= this.key(this.a[p])) break;
      const t = this.a[i]; this.a[i] = this.a[p]; this.a[p] = t;
      i = p;
    }
  };
  this.down = function (i) {
    const n = this.a.length;
    while (true) {
      let s = i;
      const l = i * 2 + 1, r = l + 1;
      if (l < n && this.key(this.a[l]) < this.key(this.a[s])) s = l;
      if (r < n && this.key(this.a[r]) < this.key(this.a[s])) s = r;
      if (s === i) break;
      const t = this.a[i]; this.a[i] = this.a[s]; this.a[s] = t;
      i = s;
    }
  };
}`,
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
      }
    },
    {
      lang: "js",
      title: "5. Two stacks make a queue",
      desc: "What this is\nPush into inStack. Pop from outStack. When outStack is empty, pour inStack into it.\n\nWhat the code is doing\npush(1) then push(2) sit in inStack as [1,2]. First pop pours so outStack is [2,1], then pops 1.\n\nWatch out\nDo not pour if outStack still has items. That would scramble the order.",
      code: `const inSt = [];
const outSt = [];
function enqueue(x) { inSt.push(x); }
function dequeue() {
  if (!outSt.length) {
    while (inSt.length) outSt.push(inSt.pop());
  }
  return outSt.pop();
}`,
      codes: {
        javascript: `const inSt = [];
const outSt = [];
function enqueue(x) { inSt.push(x); }
function dequeue() {
  if (!outSt.length) {
    while (inSt.length) outSt.push(inSt.pop());
  }
  return outSt.pop();
}`,
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
      }
    },
    {
      lang: "js",
      title: "6. Deque for window maximum",
      desc: "What this is\nA deque of indices, values decreasing. Front is the max of the window [i-k+1, i].\n\nWhat the code is doing\nWhile the back is smaller than nums[i], pop it (it can never be max while i is in the window). Drop the front if it left the window. Then the front is the answer for this i.\n\nWatch out\nPush indices, not values, so you know when the front slides out.",
      code: `function windowMax(nums, k) {
  const dq = [];
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
    dq.push(i);
    if (dq[0] <= i - k) dq.shift();
    if (i >= k - 1) out.push(nums[dq[0]]);
  }
  return out;
}`,
      codes: {
        javascript: `function windowMax(nums, k) {
  const dq = [];
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
    dq.push(i);
    if (dq[0] <= i - k) dq.shift();
    if (i >= k - 1) out.push(nums[dq[0]]);
  }
  return out;
}`,
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
      }
    },
    {
      lang: "js",
      title: "7. Two heaps (median idea)",
      desc: "What this is\nLower half is a max-heap (store negated values in a min-heap). Upper half is a min-heap. Sizes stay equal or lower is one bigger.\n\nWhat the code is doing\nInsert 1, then 5, then 2. After rebalance, lower top is 2 and upper top is 5. Median of three is 2.\n\nWatch out\nAlways rebalance after insert. If you forget, the two tops are not the middle of the stream.",
      code: `// picture only: lower = max-heap, upper = min-heap
// after [1, 5, 2]:
const lowerTop = 2; // max of lower half
const upperTop = 5; // min of upper half
const n = 3;
const median = n % 2 ? lowerTop : (lowerTop + upperTop) / 2;`,
      codes: {
        javascript: `// picture only: lower = max-heap, upper = min-heap
// after [1, 5, 2]:
const lowerTop = 2; // max of lower half
const upperTop = 5; // min of upper half
const n = 3;
const median = n % 2 ? lowerTop : (lowerTop + upperTop) / 2;`,
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
      }
    },
    {
      lang: "js",
      title: "8. Decode frame stack",
      desc: "What this is\nEach '[' saves the string built so far and the repeat count. Letters append. ']' pops and repeats.\n\nWhat the code is doing\nFor 3[a], count becomes 3, '[' pushes \"\" and 3, then cur is a, ']' makes aaa.\n\nWatch out\nCounts can be more than one digit: 12[a]. Multiply k = k * 10 + digit as you go.",
      code: `function decodeTiny(s) {
  const st = [];
  let cur = "";
  let k = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch >= "0" && ch <= "9") k = k * 10 + Number(ch);
    else if (ch === "[") {
      st.push([cur, k]);
      cur = "";
      k = 0;
    } else if (ch === "]") {
      const frame = st.pop();
      cur = frame[0] + cur.repeat(frame[1]);
    } else cur += ch;
  }
  return cur;
}`,
      codes: {
        javascript: `function decodeTiny(s) {
  const st = [];
  let cur = "";
  let k = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch >= "0" && ch <= "9") k = k * 10 + Number(ch);
    else if (ch === "[") {
      st.push([cur, k]);
      cur = "";
      k = 0;
    } else if (ch === "]") {
      const frame = st.pop();
      cur = frame[0] + cur.repeat(frame[1]);
    } else cur += ch;
  }
  return cur;
}`,
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
      }
    },
    {
      lang: "js",
      title: "9. Sort vs heap for top-k",
      desc: "What this is\nSort is the honest Optimal when you do not want to code a heap. A size-k min-heap is the upgrade.\n\nWhat the code is doing\nsortDesc sorts a copy and slices k. heapK keeps only k items: if the heap is full and x is bigger than the peek, replace the peek.\n\nWatch out\nA min-heap of size k holds the k largest: the smallest of those k sits at the top.",
      code: `function topKSort(nums, k) {
  return nums.slice().sort(function (a, b) { return b - a; }).slice(0, k);
}

function topKHeap(nums, k, heap) {
  for (let i = 0; i < nums.length; i++) {
    if (heap.size() < k) heap.push(nums[i]);
    else if (nums[i] > heap.peek()) { heap.pop(); heap.push(nums[i]); }
  }
  const out = [];
  while (heap.size()) out.push(heap.pop());
  return out;
}`,
      codes: {
        javascript: `function topKSort(nums, k) {
  return nums.slice().sort(function (a, b) { return b - a; }).slice(0, k);
}

function topKHeap(nums, k, heap) {
  for (let i = 0; i < nums.length; i++) {
    if (heap.size() < k) heap.push(nums[i]);
    else if (nums[i] > heap.peek()) { heap.pop(); heap.push(nums[i]); }
  }
  const out = [];
  while (heap.size()) out.push(heap.pop());
  return out;
}`,
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
    }
  ],
  questions: [
    {
      id: 1,
      level: "beginner",
      q: "Min Stack",
      ask: "Amazon · Google · Bloomberg · Microsoft",
      a: "Design a stack that supports push, pop, top, and getMin in O(1) time. getMin returns the smallest value still in the stack.\n\nExample: push 3, push 5, getMin is 3, push 2, getMin is 2, pop, getMin is 3 again.\n\nBrute scans on every getMin. Optimal keeps a second stack of mins. More optimal stores [value, minSoFar] pairs on one stack.",
      solutions: [
        {
          name: "Brute",
          time: "O(n) getMin",
          space: "O(n)",
          why: "A plain array. getMin walks every item. Correct, but the interview asks for O(1) getMin.",
          code: `function MinStack() {
  this.a = [];
}
MinStack.prototype.push = function (val) { this.a.push(val); };
MinStack.prototype.pop = function () { this.a.pop(); };
MinStack.prototype.top = function () { return this.a[this.a.length - 1]; };
MinStack.prototype.getMin = function () {
  let m = this.a[0];
  for (let i = 1; i < this.a.length; i++) if (this.a[i] < m) m = this.a[i];
  return m;
};`,
          codes: {
            javascript: `function MinStack() {
  this.a = [];
}
MinStack.prototype.push = function (val) { this.a.push(val); };
MinStack.prototype.pop = function () { this.a.pop(); };
MinStack.prototype.top = function () { return this.a[this.a.length - 1]; };
MinStack.prototype.getMin = function () {
  let m = this.a[0];
  for (let i = 1; i < this.a.length; i++) if (this.a[i] < m) m = this.a[i];
  return m;
};`,
            python: `class MinStack:
  def __init__(self):
    self.a = []
  def push(self, val):
    self.a.append(val)
  def pop(self):
    self.a.pop()
  def top(self):
    return self.a[-1]
  def getMin(self):
    m = self.a[0]
    for x in self.a[1:]:
      if x < m: m = x
    return m`,
            java: `import java.util.*;
class MinStack {
  ArrayList<Integer> a = new ArrayList<Integer>();
  public MinStack() {}
  public void push(int val) { a.add(val); }
  public void pop() { a.remove(a.size() - 1); }
  public int top() { return a.get(a.size() - 1); }
  public int getMin() {
    int m = a.get(0);
    for (int i = 1; i < a.size(); i++) if (a.get(i) < m) m = a.get(i);
    return m;
  }
}
class Solution {}`,
            cpp: `class MinStack {
  vector<int> a;
public:
  void push(int val) { a.push_back(val); }
  void pop() { a.pop_back(); }
  int top() { return a.back(); }
  int getMin() {
    int m = a[0];
    for (int i = 1; i < (int)a.size(); i++) if (a[i] < m) m = a[i];
    return m;
  }
};`,
            c: `#include <stdlib.h>
/* stack in a[0..n-1]; getMin scans */
typedef struct { int *a; int n, cap; } MinStack;
void ms_init(MinStack* s) { s->a = NULL; s->n = s->cap = 0; }
void ms_push(MinStack* s, int val) {
  if (s->n == s->cap) { s->cap = s->cap ? s->cap * 2 : 8; s->a = (int*)realloc(s->a, sizeof(int)*s->cap); }
  s->a[s->n++] = val;
}
void ms_pop(MinStack* s) { s->n--; }
int ms_top(MinStack* s) { return s->a[s->n - 1]; }
int ms_getMin(MinStack* s) {
  int m = s->a[0];
  for (int i = 1; i < s->n; i++) if (s->a[i] < m) m = s->a[i];
  return m;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(1)",
          space: "O(n)",
          why: "mins tracks the current minimum. Push val onto mins if it is <= current min. Pop mins when the popped value equals mins top. Duplicate mins matter: use <= so two equal mins both sit on mins.",
          code: `function MinStack() {
  this.st = [];
  this.mins = [];
}
MinStack.prototype.push = function (val) {
  this.st.push(val);
  if (!this.mins.length || val <= this.mins[this.mins.length - 1]) this.mins.push(val);
};
MinStack.prototype.pop = function () {
  const val = this.st.pop();
  if (val === this.mins[this.mins.length - 1]) this.mins.pop();
};
MinStack.prototype.top = function () { return this.st[this.st.length - 1]; };
MinStack.prototype.getMin = function () { return this.mins[this.mins.length - 1]; };`,
          codes: {
            javascript: `function MinStack() {
  this.st = [];
  this.mins = [];
}
MinStack.prototype.push = function (val) {
  this.st.push(val);
  if (!this.mins.length || val <= this.mins[this.mins.length - 1]) this.mins.push(val);
};
MinStack.prototype.pop = function () {
  const val = this.st.pop();
  if (val === this.mins[this.mins.length - 1]) this.mins.pop();
};
MinStack.prototype.top = function () { return this.st[this.st.length - 1]; };
MinStack.prototype.getMin = function () { return this.mins[this.mins.length - 1]; };`,
            python: `class MinStack:
  def __init__(self):
    self.st = []
    self.mins = []
  def push(self, val):
    self.st.append(val)
    if not self.mins or val <= self.mins[-1]:
      self.mins.append(val)
  def pop(self):
    val = self.st.pop()
    if val == self.mins[-1]:
      self.mins.pop()
  def top(self):
    return self.st[-1]
  def getMin(self):
    return self.mins[-1]`,
            java: `import java.util.*;
class MinStack {
  ArrayDeque<Integer> st = new ArrayDeque<Integer>();
  ArrayDeque<Integer> mins = new ArrayDeque<Integer>();
  public MinStack() {}
  public void push(int val) {
    st.push(val);
    if (mins.isEmpty() || val <= mins.peek()) mins.push(val);
  }
  public void pop() {
    int val = st.pop();
    if (val == mins.peek()) mins.pop();
  }
  public int top() { return st.peek(); }
  public int getMin() { return mins.peek(); }
}
class Solution {}`,
            cpp: `class MinStack {
  vector<int> st, mins;
public:
  void push(int val) {
    st.push_back(val);
    if (mins.empty() || val <= mins.back()) mins.push_back(val);
  }
  void pop() {
    int val = st.back(); st.pop_back();
    if (val == mins.back()) mins.pop_back();
  }
  int top() { return st.back(); }
  int getMin() { return mins.back(); }
};`,
            c: `#include <stdlib.h>
/* st[0..n-1] values, mins[0..mn-1] current mins */
typedef struct { int *st, *mins, n, mn, cap, mcap; } MinStack;
void ms_init(MinStack* s) { s->st = s->mins = NULL; s->n = s->mn = s->cap = s->mcap = 0; }
void ms_push(MinStack* s, int val) {
  if (s->n == s->cap) { s->cap = s->cap ? s->cap * 2 : 8; s->st = (int*)realloc(s->st, sizeof(int)*s->cap); }
  s->st[s->n++] = val;
  if (!s->mn || val <= s->mins[s->mn - 1]) {
    if (s->mn == s->mcap) { s->mcap = s->mcap ? s->mcap * 2 : 8; s->mins = (int*)realloc(s->mins, sizeof(int)*s->mcap); }
    s->mins[s->mn++] = val;
  }
}
void ms_pop(MinStack* s) {
  int val = s->st[--s->n];
  if (val == s->mins[s->mn - 1]) s->mn--;
}
int ms_top(MinStack* s) { return s->st[s->n - 1]; }
int ms_getMin(MinStack* s) { return s->mins[s->mn - 1]; }`
          }
        },
        {
          name: "More optimal",
          time: "O(1)",
          space: "O(n)",
          why: "One stack of pairs [val, minSoFar]. Each node already knows the min of the prefix. Slightly more memory per item, one structure to talk through. Still O(1) everything.",
          code: `function MinStack() {
  this.st = [];
}
MinStack.prototype.push = function (val) {
  const m = this.st.length ? Math.min(this.st[this.st.length - 1][1], val) : val;
  this.st.push([val, m]);
};
MinStack.prototype.pop = function () { this.st.pop(); };
MinStack.prototype.top = function () { return this.st[this.st.length - 1][0]; };
MinStack.prototype.getMin = function () { return this.st[this.st.length - 1][1]; };`,
          codes: {
            javascript: `function MinStack() {
  this.st = [];
}
MinStack.prototype.push = function (val) {
  const m = this.st.length ? Math.min(this.st[this.st.length - 1][1], val) : val;
  this.st.push([val, m]);
};
MinStack.prototype.pop = function () { this.st.pop(); };
MinStack.prototype.top = function () { return this.st[this.st.length - 1][0]; };
MinStack.prototype.getMin = function () { return this.st[this.st.length - 1][1]; };`,
            python: `class MinStack:
  def __init__(self):
    self.st = []
  def push(self, val):
    m = min(self.st[-1][1], val) if self.st else val
    self.st.append((val, m))
  def pop(self):
    self.st.pop()
  def top(self):
    return self.st[-1][0]
  def getMin(self):
    return self.st[-1][1]`,
            java: `import java.util.*;
class MinStack {
  ArrayDeque<int[]> st = new ArrayDeque<int[]>();
  public MinStack() {}
  public void push(int val) {
    int m = st.isEmpty() ? val : Math.min(st.peek()[1], val);
    st.push(new int[]{val, m});
  }
  public void pop() { st.pop(); }
  public int top() { return st.peek()[0]; }
  public int getMin() { return st.peek()[1]; }
}
class Solution {}`,
            cpp: `class MinStack {
  vector<pair<int,int>> st;
public:
  void push(int val) {
    int m = st.empty() ? val : min(st.back().second, val);
    st.push_back({val, m});
  }
  void pop() { st.pop_back(); }
  int top() { return st.back().first; }
  int getMin() { return st.back().second; }
};`,
            c: `#include <stdlib.h>
/* pair stack: val[i], mn[i] = min of prefix */
typedef struct { int *val, *mn, n, cap; } MinStack;
void ms_init(MinStack* s) { s->val = s->mn = NULL; s->n = s->cap = 0; }
void ms_push(MinStack* s, int v) {
  if (s->n == s->cap) {
    s->cap = s->cap ? s->cap * 2 : 8;
    s->val = (int*)realloc(s->val, sizeof(int)*s->cap);
    s->mn = (int*)realloc(s->mn, sizeof(int)*s->cap);
  }
  int m = s->n ? (s->mn[s->n-1] < v ? s->mn[s->n-1] : v) : v;
  s->val[s->n] = v; s->mn[s->n] = m; s->n++;
}
void ms_pop(MinStack* s) { s->n--; }
int ms_top(MinStack* s) { return s->val[s->n - 1]; }
int ms_getMin(MinStack* s) { return s->mn[s->n - 1]; }`
          }
        }
      ]
    },
    {
      id: 2,
      level: "intermediate",
      q: "Daily Temperatures",
      ask: "Amazon · Google · Meta · Microsoft",
      a: "temperatures[i] is the degree that day. For each day, return how many days you wait until a warmer day. 0 if none exists.\n\nExample: [73,74,75,71,69,72,76,73] answers [1,1,4,2,1,1,0,0].\n\nBrute looks right from each day. Optimal is a decreasing monotonic stack of indices. More optimal walks right to left and jumps using answers already filled.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "For each day i, scan j > i until temperatures[j] > temperatures[i]. Worst case a falling array, so n² compares.",
          code: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const ans = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (temperatures[j] > temperatures[i]) {
        ans[i] = j - i;
        break;
      }
    }
  }
  return ans;
}`,
          codes: {
            javascript: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const ans = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (temperatures[j] > temperatures[i]) {
        ans[i] = j - i;
        break;
      }
    }
  }
  return ans;
}`,
            python: `def dailyTemperatures(temperatures):
  n = len(temperatures)
  ans = [0] * n
  for i in range(n):
    for j in range(i + 1, n):
      if temperatures[j] > temperatures[i]:
        ans[i] = j - i
        break
  return ans`,
            java: `class Solution {
  public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] ans = new int[n];
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        if (temperatures[j] > temperatures[i]) {
          ans[i] = j - i;
          break;
        }
      }
    }
    return ans;
  }
}`,
            cpp: `class Solution {
public:
  vector<int> dailyTemperatures(vector<int>& temperatures) {
    int n = (int)temperatures.size();
    vector<int> ans(n, 0);
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        if (temperatures[j] > temperatures[i]) { ans[i] = j - i; break; }
      }
    }
    return ans;
  }
};`,
            c: `#include <stdlib.h>
int* dailyTemperatures(int* temperatures, int n, int* returnSize) {
  int* ans = (int*)calloc(n, sizeof(int));
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      if (temperatures[j] > temperatures[i]) { ans[i] = j - i; break; }
    }
  }
  *returnSize = n;
  return ans;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Stack of indices with decreasing temps. When a warmer day arrives, pop until the stack is cooler again. Each index is pushed and popped at most once.",
          code: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const ans = Array(n).fill(0);
  const st = [];
  for (let i = 0; i < n; i++) {
    while (st.length && temperatures[st[st.length - 1]] < temperatures[i]) {
      const j = st.pop();
      ans[j] = i - j;
    }
    st.push(i);
  }
  return ans;
}`,
          codes: {
            javascript: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const ans = Array(n).fill(0);
  const st = [];
  for (let i = 0; i < n; i++) {
    while (st.length && temperatures[st[st.length - 1]] < temperatures[i]) {
      const j = st.pop();
      ans[j] = i - j;
    }
    st.push(i);
  }
  return ans;
}`,
            python: `def dailyTemperatures(temperatures):
  n = len(temperatures)
  ans = [0] * n
  st = []
  for i in range(n):
    while st and temperatures[st[-1]] < temperatures[i]:
      j = st.pop()
      ans[j] = i - j
    st.append(i)
  return ans`,
            java: `import java.util.*;
class Solution {
  public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] ans = new int[n];
    ArrayDeque<Integer> st = new ArrayDeque<Integer>();
    for (int i = 0; i < n; i++) {
      while (!st.isEmpty() && temperatures[st.peek()] < temperatures[i]) {
        int j = st.pop();
        ans[j] = i - j;
      }
      st.push(i);
    }
    return ans;
  }
}`,
            cpp: `class Solution {
public:
  vector<int> dailyTemperatures(vector<int>& temperatures) {
    int n = (int)temperatures.size();
    vector<int> ans(n, 0), st;
    for (int i = 0; i < n; i++) {
      while (!st.empty() && temperatures[st.back()] < temperatures[i]) {
        int j = st.back(); st.pop_back();
        ans[j] = i - j;
      }
      st.push_back(i);
    }
    return ans;
  }
};`,
            c: `#include <stdlib.h>
int* dailyTemperatures(int* temperatures, int n, int* returnSize) {
  int* ans = (int*)calloc(n, sizeof(int));
  int* st = (int*)malloc(sizeof(int) * n);
  int sn = 0;
  for (int i = 0; i < n; i++) {
    while (sn && temperatures[st[sn - 1]] < temperatures[i]) {
      int j = st[--sn];
      ans[j] = i - j;
    }
    st[sn++] = i;
  }
  free(st);
  *returnSize = n;
  return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Right-to-left jump: if day j is not warmer, skip ahead by ans[j] days (those days are also not warmer than j, hence not warmer than i if temps[j] <= temps[i]). Extra space is only the output. Still linear.",
          code: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const ans = Array(n).fill(0);
  for (let i = n - 2; i >= 0; i--) {
    let j = i + 1;
    while (j < n && temperatures[j] <= temperatures[i]) {
      if (ans[j] === 0) { j = n; break; }
      j += ans[j];
    }
    if (j < n) ans[i] = j - i;
  }
  return ans;
}`,
          codes: {
            javascript: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const ans = Array(n).fill(0);
  for (let i = n - 2; i >= 0; i--) {
    let j = i + 1;
    while (j < n && temperatures[j] <= temperatures[i]) {
      if (ans[j] === 0) { j = n; break; }
      j += ans[j];
    }
    if (j < n) ans[i] = j - i;
  }
  return ans;
}`,
            python: `def dailyTemperatures(temperatures):
  n = len(temperatures)
  ans = [0] * n
  for i in range(n - 2, -1, -1):
    j = i + 1
    while j < n and temperatures[j] <= temperatures[i]:
      if ans[j] == 0:
        j = n
        break
      j += ans[j]
    if j < n:
      ans[i] = j - i
  return ans`,
            java: `class Solution {
  public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] ans = new int[n];
    for (int i = n - 2; i >= 0; i--) {
      int j = i + 1;
      while (j < n && temperatures[j] <= temperatures[i]) {
        if (ans[j] == 0) { j = n; break; }
        j += ans[j];
      }
      if (j < n) ans[i] = j - i;
    }
    return ans;
  }
}`,
            cpp: `class Solution {
public:
  vector<int> dailyTemperatures(vector<int>& temperatures) {
    int n = (int)temperatures.size();
    vector<int> ans(n, 0);
    for (int i = n - 2; i >= 0; i--) {
      int j = i + 1;
      while (j < n && temperatures[j] <= temperatures[i]) {
        if (ans[j] == 0) { j = n; break; }
        j += ans[j];
      }
      if (j < n) ans[i] = j - i;
    }
    return ans;
  }
};`,
            c: `#include <stdlib.h>
int* dailyTemperatures(int* temperatures, int n, int* returnSize) {
  int* ans = (int*)calloc(n, sizeof(int));
  for (int i = n - 2; i >= 0; i--) {
    int j = i + 1;
    while (j < n && temperatures[j] <= temperatures[i]) {
      if (ans[j] == 0) { j = n; break; }
      j += ans[j];
    }
    if (j < n) ans[i] = j - i;
  }
  *returnSize = n;
  return ans;
}`
          }
        }
      ]
    },
    {
      id: 3,
      level: "beginner",
      q: "Next Greater Element I",
      ask: "Amazon · Google · Meta · Apple",
      a: "nums1 is a subset of nums2. For each value in nums1, find that value in nums2 and return the first greater number to its right in nums2. -1 if none.\n\nExample: nums1 = [4,1,2], nums2 = [1,3,4,2] answers [-1,3,-1].\n\nBrute finds then scans right. Optimal is a hash of indices plus a scan. More optimal builds a next-greater map with a monotonic stack on nums2, then maps nums1 in O(1) each.",
      solutions: [
        {
          name: "Brute",
          time: "O(n · m)",
          space: "O(1)",
          why: "For each nums1 value, scan nums2 to find it, then scan the suffix for a greater number. Fine when both arrays are tiny.",
          code: `function nextGreaterElement(nums1, nums2) {
  const ans = [];
  for (let i = 0; i < nums1.length; i++) {
    let found = false;
    let next = -1;
    for (let j = 0; j < nums2.length; j++) {
      if (!found) {
        if (nums2[j] === nums1[i]) found = true;
        continue;
      }
      if (nums2[j] > nums1[i]) { next = nums2[j]; break; }
    }
    ans.push(next);
  }
  return ans;
}`,
          codes: {
            javascript: `function nextGreaterElement(nums1, nums2) {
  const ans = [];
  for (let i = 0; i < nums1.length; i++) {
    let found = false;
    let next = -1;
    for (let j = 0; j < nums2.length; j++) {
      if (!found) {
        if (nums2[j] === nums1[i]) found = true;
        continue;
      }
      if (nums2[j] > nums1[i]) { next = nums2[j]; break; }
    }
    ans.push(next);
  }
  return ans;
}`,
            python: `def nextGreaterElement(nums1, nums2):
  ans = []
  for x in nums1:
    found = False
    nxt = -1
    for y in nums2:
      if not found:
        if y == x: found = True
        continue
      if y > x:
        nxt = y
        break
    ans.append(nxt)
  return ans`,
            java: `import java.util.*;
class Solution {
  public int[] nextGreaterElement(int[] nums1, int[] nums2) {
    int[] ans = new int[nums1.length];
    for (int i = 0; i < nums1.length; i++) {
      boolean found = false;
      int next = -1;
      for (int j = 0; j < nums2.length; j++) {
        if (!found) {
          if (nums2[j] == nums1[i]) found = true;
          continue;
        }
        if (nums2[j] > nums1[i]) { next = nums2[j]; break; }
      }
      ans[i] = next;
    }
    return ans;
  }
}`,
            cpp: `class Solution {
public:
  vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
    vector<int> ans;
    for (int x : nums1) {
      bool found = false;
      int next = -1;
      for (int y : nums2) {
        if (!found) { if (y == x) found = true; continue; }
        if (y > x) { next = y; break; }
      }
      ans.push_back(next);
    }
    return ans;
  }
};`,
            c: `#include <stdlib.h>
int* nextGreaterElement(int* nums1, int n1, int* nums2, int n2, int* returnSize) {
  int* ans = (int*)malloc(sizeof(int) * n1);
  for (int i = 0; i < n1; i++) {
    int found = 0, next = -1;
    for (int j = 0; j < n2; j++) {
      if (!found) { if (nums2[j] == nums1[i]) found = 1; continue; }
      if (nums2[j] > nums1[i]) { next = nums2[j]; break; }
    }
    ans[i] = next;
  }
  *returnSize = n1;
  return ans;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n · m)",
          space: "O(m)",
          why: "Hash each nums2 value to its index so the find step is O(1). The right scan is still O(m) per query. Clearer, same worst case.",
          code: `function nextGreaterElement(nums1, nums2) {
  const idx = {};
  for (let i = 0; i < nums2.length; i++) idx[nums2[i]] = i;
  const ans = [];
  for (let i = 0; i < nums1.length; i++) {
    let next = -1;
    for (let j = idx[nums1[i]] + 1; j < nums2.length; j++) {
      if (nums2[j] > nums1[i]) { next = nums2[j]; break; }
    }
    ans.push(next);
  }
  return ans;
}`,
          codes: {
            javascript: `function nextGreaterElement(nums1, nums2) {
  const idx = {};
  for (let i = 0; i < nums2.length; i++) idx[nums2[i]] = i;
  const ans = [];
  for (let i = 0; i < nums1.length; i++) {
    let next = -1;
    for (let j = idx[nums1[i]] + 1; j < nums2.length; j++) {
      if (nums2[j] > nums1[i]) { next = nums2[j]; break; }
    }
    ans.push(next);
  }
  return ans;
}`,
            python: `def nextGreaterElement(nums1, nums2):
  idx = {}
  for i, x in enumerate(nums2):
    idx[x] = i
  ans = []
  for x in nums1:
    nxt = -1
    for j in range(idx[x] + 1, len(nums2)):
      if nums2[j] > x:
        nxt = nums2[j]
        break
    ans.append(nxt)
  return ans`,
            java: `import java.util.*;
class Solution {
  public int[] nextGreaterElement(int[] nums1, int[] nums2) {
    Map<Integer, Integer> idx = new HashMap<Integer, Integer>();
    for (int i = 0; i < nums2.length; i++) idx.put(nums2[i], i);
    int[] ans = new int[nums1.length];
    for (int i = 0; i < nums1.length; i++) {
      int next = -1;
      for (int j = idx.get(nums1[i]) + 1; j < nums2.length; j++) {
        if (nums2[j] > nums1[i]) { next = nums2[j]; break; }
      }
      ans[i] = next;
    }
    return ans;
  }
}`,
            cpp: `class Solution {
public:
  vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
    unordered_map<int,int> idx;
    for (int i = 0; i < (int)nums2.size(); i++) idx[nums2[i]] = i;
    vector<int> ans;
    for (int x : nums1) {
      int next = -1;
      for (int j = idx[x] + 1; j < (int)nums2.size(); j++) {
        if (nums2[j] > x) { next = nums2[j]; break; }
      }
      ans.push_back(next);
    }
    return ans;
  }
};`,
            c: `#include <stdlib.h>
/* linear search as a tiny map: find first index of x in nums2 */
int find_idx(int* a, int n, int x) {
  for (int i = 0; i < n; i++) if (a[i] == x) return i;
  return -1;
}
int* nextGreaterElement(int* nums1, int n1, int* nums2, int n2, int* returnSize) {
  int* ans = (int*)malloc(sizeof(int) * n1);
  for (int i = 0; i < n1; i++) {
    int j0 = find_idx(nums2, n2, nums1[i]);
    int next = -1;
    for (int j = j0 + 1; j < n2; j++) if (nums2[j] > nums1[i]) { next = nums2[j]; break; }
    ans[i] = next;
  }
  *returnSize = n1;
  return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n + m)",
          space: "O(m)",
          why: "Monotonic stack on nums2 builds next[value] = first greater to the right. Then each nums1 lookup is O(1). Linear in the two array lengths.",
          code: `function nextGreaterElement(nums1, nums2) {
  const next = {};
  const st = [];
  for (let i = 0; i < nums2.length; i++) {
    while (st.length && st[st.length - 1] < nums2[i]) next[st.pop()] = nums2[i];
    st.push(nums2[i]);
  }
  const ans = [];
  for (let i = 0; i < nums1.length; i++) {
    ans.push(next[nums1[i]] === undefined ? -1 : next[nums1[i]]);
  }
  return ans;
}`,
          codes: {
            javascript: `function nextGreaterElement(nums1, nums2) {
  const next = {};
  const st = [];
  for (let i = 0; i < nums2.length; i++) {
    while (st.length && st[st.length - 1] < nums2[i]) next[st.pop()] = nums2[i];
    st.push(nums2[i]);
  }
  const ans = [];
  for (let i = 0; i < nums1.length; i++) {
    ans.push(next[nums1[i]] === undefined ? -1 : next[nums1[i]]);
  }
  return ans;
}`,
            python: `def nextGreaterElement(nums1, nums2):
  nxt = {}
  st = []
  for x in nums2:
    while st and st[-1] < x:
      nxt[st.pop()] = x
    st.append(x)
  return [nxt.get(x, -1) for x in nums1]`,
            java: `import java.util.*;
class Solution {
  public int[] nextGreaterElement(int[] nums1, int[] nums2) {
    Map<Integer, Integer> next = new HashMap<Integer, Integer>();
    ArrayDeque<Integer> st = new ArrayDeque<Integer>();
    for (int x : nums2) {
      while (!st.isEmpty() && st.peek() < x) next.put(st.pop(), x);
      st.push(x);
    }
    int[] ans = new int[nums1.length];
    for (int i = 0; i < nums1.length; i++) ans[i] = next.getOrDefault(nums1[i], -1);
    return ans;
  }
}`,
            cpp: `class Solution {
public:
  vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
    unordered_map<int,int> nxt;
    vector<int> st;
    for (int x : nums2) {
      while (!st.empty() && st.back() < x) { nxt[st.back()] = x; st.pop_back(); }
      st.push_back(x);
    }
    vector<int> ans;
    for (int x : nums1) ans.push_back(nxt.count(x) ? nxt[x] : -1);
    return ans;
  }
};`,
            c: `#include <stdlib.h>
/* next_of[val+offset] since values are small in the problem; here we scan a pair table */
int* nextGreaterElement(int* nums1, int n1, int* nums2, int n2, int* returnSize) {
  int* st = (int*)malloc(sizeof(int) * n2);
  int sn = 0;
  int* keys = (int*)malloc(sizeof(int) * n2);
  int* vals = (int*)malloc(sizeof(int) * n2);
  int m = 0;
  for (int i = 0; i < n2; i++) {
    while (sn && st[sn - 1] < nums2[i]) { keys[m] = st[--sn]; vals[m] = nums2[i]; m++; }
    st[sn++] = nums2[i];
  }
  int* ans = (int*)malloc(sizeof(int) * n1);
  for (int i = 0; i < n1; i++) {
    int next = -1;
    for (int k = 0; k < m; k++) if (keys[k] == nums1[i]) { next = vals[k]; break; }
    ans[i] = next;
  }
  free(st); free(keys); free(vals);
  *returnSize = n1;
  return ans;
}`
          }
        }
      ]
    },
    {
      id: 4,
      level: "beginner",
      q: "Evaluate Reverse Polish Notation",
      ask: "Amazon · Google · Meta · Microsoft",
      a: "tokens is a Reverse Polish list: numbers and + - * /. An operator uses the two previous values. Return the integer result. Division truncates toward zero.\n\nExample: [2,1,+,3,*] is (2+1)*3 = 9. [4,13,5,/,+] is 4+(13/5) = 6.\n\nBrute repeatedly finds the first operator and splices. Optimal is a stack: push numbers, on an operator pop two, push the result.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(n)",
          why: "Copy the list. Each round find the first operator, replace the triple with one number. Splice is O(n), and you do it O(n) times.",
          code: `function evalRPN(tokens) {
  const a = tokens.slice();
  const ops = { "+": 1, "-": 1, "*": 1, "/": 1 };
  function calc(a, b, op) {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    return a / b < 0 ? Math.ceil(a / b) : Math.floor(a / b);
  }
  while (a.length > 1) {
    let i = 0;
    while (!ops[a[i]]) i++;
    const val = calc(Number(a[i - 2]), Number(a[i - 1]), a[i]);
    a.splice(i - 2, 3, String(val));
  }
  return Number(a[0]);
}`,
          codes: {
            javascript: `function evalRPN(tokens) {
  const a = tokens.slice();
  const ops = { "+": 1, "-": 1, "*": 1, "/": 1 };
  function calc(a, b, op) {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    return a / b < 0 ? Math.ceil(a / b) : Math.floor(a / b);
  }
  while (a.length > 1) {
    let i = 0;
    while (!ops[a[i]]) i++;
    const val = calc(Number(a[i - 2]), Number(a[i - 1]), a[i]);
    a.splice(i - 2, 3, String(val));
  }
  return Number(a[0]);
}`,
            python: `def evalRPN(tokens):
  a = list(tokens)
  ops = {"+", "-", "*", "/"}
  def calc(a, b, op):
    if op == "+": return a + b
    if op == "-": return a - b
    if op == "*": return a * b
    return int(a / b)  # trunc toward 0
  while len(a) > 1:
    i = 0
    while a[i] not in ops:
      i += 1
    val = calc(int(a[i - 2]), int(a[i - 1]), a[i])
    a = a[:i - 2] + [str(val)] + a[i + 1:]
  return int(a[0])`,
            java: `import java.util.*;
class Solution {
  int calc(int a, int b, String op) {
    if (op.equals("+")) return a + b;
    if (op.equals("-")) return a - b;
    if (op.equals("*")) return a * b;
    return a / b; // trunc toward 0
  }
  public int evalRPN(String[] tokens) {
    ArrayList<String> a = new ArrayList<String>(Arrays.asList(tokens));
    while (a.size() > 1) {
      int i = 0;
      while (!(a.get(i).equals("+") || a.get(i).equals("-") || a.get(i).equals("*") || a.get(i).equals("/"))) i++;
      int val = calc(Integer.parseInt(a.get(i - 2)), Integer.parseInt(a.get(i - 1)), a.get(i));
      a.set(i - 2, String.valueOf(val));
      a.remove(i);
      a.remove(i - 1);
    }
    return Integer.parseInt(a.get(0));
  }
}`,
            cpp: `class Solution {
  int calc(int a, int b, const string& op) {
    if (op == "+") return a + b;
    if (op == "-") return a - b;
    if (op == "*") return a * b;
    return a / b;
  }
public:
  int evalRPN(vector<string>& tokens) {
    vector<string> a = tokens;
    while (a.size() > 1) {
      int i = 0;
      while (a[i] != "+" && a[i] != "-" && a[i] != "*" && a[i] != "/") i++;
      int val = calc(stoi(a[i - 2]), stoi(a[i - 1]), a[i]);
      a.erase(a.begin() + (i - 1), a.begin() + (i + 1));
      a[i - 2] = to_string(val);
    }
    return stoi(a[0]);
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
#include <stdio.h>
int calc(int a, int b, const char* op) {
  if (op[0] == '+') return a + b;
  if (op[0] == '-' && op[1] == 0) return a - b;
  if (op[0] == '*') return a * b;
  return a / b; /* trunc toward 0 in C for ints */
}
int isop(const char* t) {
  return !strcmp(t, "+") || !strcmp(t, "-") || !strcmp(t, "*") || !strcmp(t, "/");
}
int evalRPN(char** tokens, int n) {
  char** a = (char**)malloc(sizeof(char*) * n);
  int m = n;
  for (int i = 0; i < n; i++) a[i] = tokens[i];
  char buf[32][16]; int bi = 0;
  while (m > 1) {
    int i = 0;
    while (!isop(a[i])) i++;
    int val = calc(atoi(a[i-2]), atoi(a[i-1]), a[i]);
    sprintf(buf[bi], "%d", val);
    a[i-2] = buf[bi++];
    for (int j = i - 1; j < m - 2; j++) a[j] = a[j + 2];
    m -= 2;
  }
  int ans = atoi(a[0]);
  free(a);
  return ans;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "One stack. Numbers go on. An operator pops b then a (order matters for - and /), pushes the result. One pass.",
          code: `function evalRPN(tokens) {
  const st = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t !== "+" && t !== "-" && t !== "*" && t !== "/") {
      st.push(Number(t));
      continue;
    }
    const b = st.pop();
    const a = st.pop();
    if (t === "+") st.push(a + b);
    else if (t === "-") st.push(a - b);
    else if (t === "*") st.push(a * b);
    else st.push(a / b < 0 ? Math.ceil(a / b) : Math.floor(a / b));
  }
  return st[0];
}`,
          codes: {
            javascript: `function evalRPN(tokens) {
  const st = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t !== "+" && t !== "-" && t !== "*" && t !== "/") {
      st.push(Number(t));
      continue;
    }
    const b = st.pop();
    const a = st.pop();
    if (t === "+") st.push(a + b);
    else if (t === "-") st.push(a - b);
    else if (t === "*") st.push(a * b);
    else st.push(a / b < 0 ? Math.ceil(a / b) : Math.floor(a / b));
  }
  return st[0];
}`,
            python: `def evalRPN(tokens):
  st = []
  for t in tokens:
    if t not in "+-*/":
      st.append(int(t))
      continue
    b = st.pop()
    a = st.pop()
    if t == "+": st.append(a + b)
    elif t == "-": st.append(a - b)
    elif t == "*": st.append(a * b)
    else: st.append(int(a / b))
  return st[0]`,
            java: `import java.util.*;
class Solution {
  public int evalRPN(String[] tokens) {
    ArrayDeque<Integer> st = new ArrayDeque<Integer>();
    for (String t : tokens) {
      if (!t.equals("+") && !t.equals("-") && !t.equals("*") && !t.equals("/")) {
        st.push(Integer.parseInt(t));
        continue;
      }
      int b = st.pop(), a = st.pop();
      if (t.equals("+")) st.push(a + b);
      else if (t.equals("-")) st.push(a - b);
      else if (t.equals("*")) st.push(a * b);
      else st.push(a / b);
    }
    return st.peek();
  }
}`,
            cpp: `class Solution {
public:
  int evalRPN(vector<string>& tokens) {
    vector<int> st;
    for (auto& t : tokens) {
      if (t != "+" && t != "-" && t != "*" && t != "/") { st.push_back(stoi(t)); continue; }
      int b = st.back(); st.pop_back();
      int a = st.back(); st.pop_back();
      if (t == "+") st.push_back(a + b);
      else if (t == "-") st.push_back(a - b);
      else if (t == "*") st.push_back(a * b);
      else st.push_back(a / b);
    }
    return st[0];
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
int evalRPN(char** tokens, int n) {
  int* st = (int*)malloc(sizeof(int) * n);
  int sn = 0;
  for (int i = 0; i < n; i++) {
    char* t = tokens[i];
    if (strcmp(t, "+") && strcmp(t, "-") && strcmp(t, "*") && strcmp(t, "/")) {
      st[sn++] = atoi(t);
      continue;
    }
    int b = st[--sn], a = st[--sn];
    if (t[0] == '+') st[sn++] = a + b;
    else if (t[0] == '-' && t[1] == 0) st[sn++] = a - b;
    else if (t[0] == '*') st[sn++] = a * b;
    else st[sn++] = a / b;
  }
  int ans = st[0];
  free(st);
  return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Same stack, but a small apply helper and bitwise trunc for JS integers (or Math.trunc). Cleaner talk track. Complexity unchanged.",
          code: `function evalRPN(tokens) {
  const st = [];
  function apply(op, a, b) {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    return Math.trunc(a / b);
  }
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "+" || t === "-" || t === "*" || t === "/") {
      const b = st.pop();
      const a = st.pop();
      st.push(apply(t, a, b));
    } else st.push(Number(t));
  }
  return st[0];
}`,
          codes: {
            javascript: `function evalRPN(tokens) {
  const st = [];
  function apply(op, a, b) {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    return Math.trunc(a / b);
  }
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "+" || t === "-" || t === "*" || t === "/") {
      const b = st.pop();
      const a = st.pop();
      st.push(apply(t, a, b));
    } else st.push(Number(t));
  }
  return st[0];
}`,
            python: `def evalRPN(tokens):
  st = []
  def apply(op, a, b):
    if op == "+": return a + b
    if op == "-": return a - b
    if op == "*": return a * b
    return int(a / b)
  for t in tokens:
    if t in "+-*/":
      b = st.pop()
      a = st.pop()
      st.append(apply(t, a, b))
    else:
      st.append(int(t))
  return st[0]`,
            java: `import java.util.*;
class Solution {
  int apply(String op, int a, int b) {
    if (op.equals("+")) return a + b;
    if (op.equals("-")) return a - b;
    if (op.equals("*")) return a * b;
    return a / b;
  }
  public int evalRPN(String[] tokens) {
    ArrayDeque<Integer> st = new ArrayDeque<Integer>();
    for (String t : tokens) {
      if (t.equals("+") || t.equals("-") || t.equals("*") || t.equals("/")) {
        int b = st.pop(), a = st.pop();
        st.push(apply(t, a, b));
      } else st.push(Integer.parseInt(t));
    }
    return st.peek();
  }
}`,
            cpp: `class Solution {
  int apply(const string& op, int a, int b) {
    if (op == "+") return a + b;
    if (op == "-") return a - b;
    if (op == "*") return a * b;
    return a / b;
  }
public:
  int evalRPN(vector<string>& tokens) {
    vector<int> st;
    for (auto& t : tokens) {
      if (t == "+" || t == "-" || t == "*" || t == "/") {
        int b = st.back(); st.pop_back();
        int a = st.back(); st.pop_back();
        st.push_back(apply(t, a, b));
      } else st.push_back(stoi(t));
    }
    return st[0];
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
int apply(const char* op, int a, int b) {
  if (op[0] == '+') return a + b;
  if (op[0] == '-' && op[1] == 0) return a - b;
  if (op[0] == '*') return a * b;
  return a / b;
}
int evalRPN(char** tokens, int n) {
  int* st = (int*)malloc(sizeof(int) * n);
  int sn = 0;
  for (int i = 0; i < n; i++) {
    char* t = tokens[i];
    if (!strcmp(t, "+") || !strcmp(t, "-") || !strcmp(t, "*") || !strcmp(t, "/")) {
      int b = st[--sn], a = st[--sn];
      st[sn++] = apply(t, a, b);
    } else st[sn++] = atoi(t);
  }
  int ans = st[0];
  free(st);
  return ans;
}`
          }
        }
      ]
    },
    {
      id: 5,
      level: "advanced",
      q: "Largest Rectangle in Histogram",
      ask: "Amazon · Google · Microsoft · Adobe",
      a: "heights[i] is the height of bar i, width 1. Return the largest rectangle you can form using consecutive bars.\n\nExample: [2,1,5,6,2,3] answers 10 (the 5 and 6 bars, height 5, width 2).\n\nFor each bar, you need the nearest shorter bar on the left and on the right. That width times this height is a candidate. Brute expands. Optimal two monotonic passes. More optimal one pass with a 0 sentinel.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "For each bar, walk left and right while bars are at least this tall. Width times height. n starts, each can walk n.",
          code: `function largestRectangleArea(heights) {
  let best = 0;
  const n = heights.length;
  for (let i = 0; i < n; i++) {
    let left = i, right = i;
    while (left > 0 && heights[left - 1] >= heights[i]) left--;
    while (right + 1 < n && heights[right + 1] >= heights[i]) right++;
    best = Math.max(best, heights[i] * (right - left + 1));
  }
  return best;
}`,
          codes: {
            javascript: `function largestRectangleArea(heights) {
  let best = 0;
  const n = heights.length;
  for (let i = 0; i < n; i++) {
    let left = i, right = i;
    while (left > 0 && heights[left - 1] >= heights[i]) left--;
    while (right + 1 < n && heights[right + 1] >= heights[i]) right++;
    best = Math.max(best, heights[i] * (right - left + 1));
  }
  return best;
}`,
            python: `def largestRectangleArea(heights):
  best = 0
  n = len(heights)
  for i in range(n):
    left = right = i
    while left > 0 and heights[left - 1] >= heights[i]:
      left -= 1
    while right + 1 < n and heights[right + 1] >= heights[i]:
      right += 1
    best = max(best, heights[i] * (right - left + 1))
  return best`,
            java: `class Solution {
  public int largestRectangleArea(int[] heights) {
    int best = 0, n = heights.length;
    for (int i = 0; i < n; i++) {
      int left = i, right = i;
      while (left > 0 && heights[left - 1] >= heights[i]) left--;
      while (right + 1 < n && heights[right + 1] >= heights[i]) right++;
      best = Math.max(best, heights[i] * (right - left + 1));
    }
    return best;
  }
}`,
            cpp: `class Solution {
public:
  int largestRectangleArea(vector<int>& heights) {
    int best = 0, n = (int)heights.size();
    for (int i = 0; i < n; i++) {
      int left = i, right = i;
      while (left > 0 && heights[left - 1] >= heights[i]) left--;
      while (right + 1 < n && heights[right + 1] >= heights[i]) right++;
      best = max(best, heights[i] * (right - left + 1));
    }
    return best;
  }
};`,
            c: `int largestRectangleArea(int* heights, int n) {
  int best = 0;
  for (int i = 0; i < n; i++) {
    int left = i, right = i;
    while (left > 0 && heights[left - 1] >= heights[i]) left--;
    while (right + 1 < n && heights[right + 1] >= heights[i]) right++;
    int area = heights[i] * (right - left + 1);
    if (area > best) best = area;
  }
  return best;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Two monotonic stacks: nearest smaller to the left, nearest smaller to the right. Then one pass of height * (right - left - 1). Each index processed a constant number of times.",
          code: `function largestRectangleArea(heights) {
  const n = heights.length;
  const left = Array(n).fill(-1);
  const right = Array(n).fill(n);
  const st = [];
  for (let i = 0; i < n; i++) {
    while (st.length && heights[st[st.length - 1]] >= heights[i]) st.pop();
    if (st.length) left[i] = st[st.length - 1];
    st.push(i);
  }
  st.length = 0;
  for (let i = n - 1; i >= 0; i--) {
    while (st.length && heights[st[st.length - 1]] >= heights[i]) st.pop();
    if (st.length) right[i] = st[st.length - 1];
    st.push(i);
  }
  let best = 0;
  for (let i = 0; i < n; i++) {
    best = Math.max(best, heights[i] * (right[i] - left[i] - 1));
  }
  return best;
}`,
          codes: {
            javascript: `function largestRectangleArea(heights) {
  const n = heights.length;
  const left = Array(n).fill(-1);
  const right = Array(n).fill(n);
  const st = [];
  for (let i = 0; i < n; i++) {
    while (st.length && heights[st[st.length - 1]] >= heights[i]) st.pop();
    if (st.length) left[i] = st[st.length - 1];
    st.push(i);
  }
  st.length = 0;
  for (let i = n - 1; i >= 0; i--) {
    while (st.length && heights[st[st.length - 1]] >= heights[i]) st.pop();
    if (st.length) right[i] = st[st.length - 1];
    st.push(i);
  }
  let best = 0;
  for (let i = 0; i < n; i++) {
    best = Math.max(best, heights[i] * (right[i] - left[i] - 1));
  }
  return best;
}`,
            python: `def largestRectangleArea(heights):
  n = len(heights)
  left = [-1] * n
  right = [n] * n
  st = []
  for i in range(n):
    while st and heights[st[-1]] >= heights[i]:
      st.pop()
    if st: left[i] = st[-1]
    st.append(i)
  st = []
  for i in range(n - 1, -1, -1):
    while st and heights[st[-1]] >= heights[i]:
      st.pop()
    if st: right[i] = st[-1]
    st.append(i)
  best = 0
  for i in range(n):
    best = max(best, heights[i] * (right[i] - left[i] - 1))
  return best`,
            java: `import java.util.*;
class Solution {
  public int largestRectangleArea(int[] heights) {
    int n = heights.length;
    int[] left = new int[n], right = new int[n];
    Arrays.fill(left, -1);
    Arrays.fill(right, n);
    ArrayDeque<Integer> st = new ArrayDeque<Integer>();
    for (int i = 0; i < n; i++) {
      while (!st.isEmpty() && heights[st.peek()] >= heights[i]) st.pop();
      if (!st.isEmpty()) left[i] = st.peek();
      st.push(i);
    }
    st.clear();
    for (int i = n - 1; i >= 0; i--) {
      while (!st.isEmpty() && heights[st.peek()] >= heights[i]) st.pop();
      if (!st.isEmpty()) right[i] = st.peek();
      st.push(i);
    }
    int best = 0;
    for (int i = 0; i < n; i++) best = Math.max(best, heights[i] * (right[i] - left[i] - 1));
    return best;
  }
}`,
            cpp: `class Solution {
public:
  int largestRectangleArea(vector<int>& heights) {
    int n = (int)heights.size();
    vector<int> left(n, -1), right(n, n), st;
    for (int i = 0; i < n; i++) {
      while (!st.empty() && heights[st.back()] >= heights[i]) st.pop_back();
      if (!st.empty()) left[i] = st.back();
      st.push_back(i);
    }
    st.clear();
    for (int i = n - 1; i >= 0; i--) {
      while (!st.empty() && heights[st.back()] >= heights[i]) st.pop_back();
      if (!st.empty()) right[i] = st.back();
      st.push_back(i);
    }
    int best = 0;
    for (int i = 0; i < n; i++) best = max(best, heights[i] * (right[i] - left[i] - 1));
    return best;
  }
};`,
            c: `#include <stdlib.h>
int largestRectangleArea(int* heights, int n) {
  int* left = (int*)malloc(sizeof(int) * n);
  int* right = (int*)malloc(sizeof(int) * n);
  int* st = (int*)malloc(sizeof(int) * n);
  int sn = 0;
  for (int i = 0; i < n; i++) { left[i] = -1; right[i] = n; }
  for (int i = 0; i < n; i++) {
    while (sn && heights[st[sn-1]] >= heights[i]) sn--;
    if (sn) left[i] = st[sn-1];
    st[sn++] = i;
  }
  sn = 0;
  for (int i = n - 1; i >= 0; i--) {
    while (sn && heights[st[sn-1]] >= heights[i]) sn--;
    if (sn) right[i] = st[sn-1];
    st[sn++] = i;
  }
  int best = 0;
  for (int i = 0; i < n; i++) {
    int area = heights[i] * (right[i] - left[i] - 1);
    if (area > best) best = area;
  }
  free(left); free(right); free(st);
  return best;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Append a 0 sentinel so every bar gets popped. One increasing stack of indices. When you pop height h at i, the width is i - newTop - 1. Same linear bound, one pass, less arrays.",
          code: `function largestRectangleArea(heights) {
  const h = heights.concat([0]);
  const st = [-1];
  let best = 0;
  for (let i = 0; i < h.length; i++) {
    while (st.length > 1 && h[st[st.length - 1]] > h[i]) {
      const height = h[st.pop()];
      const width = i - st[st.length - 1] - 1;
      best = Math.max(best, height * width);
    }
    st.push(i);
  }
  return best;
}`,
          codes: {
            javascript: `function largestRectangleArea(heights) {
  const h = heights.concat([0]);
  const st = [-1];
  let best = 0;
  for (let i = 0; i < h.length; i++) {
    while (st.length > 1 && h[st[st.length - 1]] > h[i]) {
      const height = h[st.pop()];
      const width = i - st[st.length - 1] - 1;
      best = Math.max(best, height * width);
    }
    st.push(i);
  }
  return best;
}`,
            python: `def largestRectangleArea(heights):
  h = heights + [0]
  st = [-1]
  best = 0
  for i in range(len(h)):
    while len(st) > 1 and h[st[-1]] > h[i]:
      height = h[st.pop()]
      width = i - st[-1] - 1
      best = max(best, height * width)
    st.append(i)
  return best`,
            java: `import java.util.*;
class Solution {
  public int largestRectangleArea(int[] heights) {
    int n = heights.length;
    int[] h = Arrays.copyOf(heights, n + 1);
    ArrayDeque<Integer> st = new ArrayDeque<Integer>();
    st.push(-1);
    int best = 0;
    for (int i = 0; i < h.length; i++) {
      while (st.size() > 1 && h[st.peek()] > h[i]) {
        int height = h[st.pop()];
        int width = i - st.peek() - 1;
        best = Math.max(best, height * width);
      }
      st.push(i);
    }
    return best;
  }
}`,
            cpp: `class Solution {
public:
  int largestRectangleArea(vector<int>& heights) {
    vector<int> h = heights;
    h.push_back(0);
    vector<int> st;
    st.push_back(-1);
    int best = 0;
    for (int i = 0; i < (int)h.size(); i++) {
      while (st.size() > 1 && h[st.back()] > h[i]) {
        int height = h[st.back()]; st.pop_back();
        int width = i - st.back() - 1;
        best = max(best, height * width);
      }
      st.push_back(i);
    }
    return best;
  }
};`,
            c: `#include <stdlib.h>
int largestRectangleArea(int* heights, int n) {
  int* h = (int*)malloc(sizeof(int) * (n + 1));
  for (int i = 0; i < n; i++) h[i] = heights[i];
  h[n] = 0;
  int* st = (int*)malloc(sizeof(int) * (n + 2));
  int sn = 0;
  st[sn++] = -1;
  int best = 0;
  for (int i = 0; i <= n; i++) {
    while (sn > 1 && h[st[sn-1]] > h[i]) {
      int height = h[st[--sn]];
      int width = i - st[sn-1] - 1;
      if (height * width > best) best = height * width;
    }
    st[sn++] = i;
  }
  free(h); free(st);
  return best;
}`
          }
        }
      ]
    },
    {
      id: 6,
      level: "advanced",
      q: "Sliding Window Maximum",
      ask: "Amazon · Google · Uber · Microsoft",
      a: "nums and a window size k. Return the maximum of every contiguous window of length k.\n\nExample: [1,3,-1,-3,5,3,6,7], k = 3 answers [3,3,5,5,6,7].\n\nBrute maxes each window. Optimal is a size-k heap with lazy deletes. More optimal is a decreasing deque of indices: O(n).",
      solutions: [
        {
          name: "Brute",
          time: "O(n · k)",
          space: "O(1)",
          why: "For each window start, scan k items for the max. Simple and too slow when k is n/2.",
          code: `function maxSlidingWindow(nums, k) {
  const out = [];
  for (let i = 0; i + k - 1 < nums.length; i++) {
    let m = nums[i];
    for (let j = i + 1; j < i + k; j++) if (nums[j] > m) m = nums[j];
    out.push(m);
  }
  return out;
}`,
          codes: {
            javascript: `function maxSlidingWindow(nums, k) {
  const out = [];
  for (let i = 0; i + k - 1 < nums.length; i++) {
    let m = nums[i];
    for (let j = i + 1; j < i + k; j++) if (nums[j] > m) m = nums[j];
    out.push(m);
  }
  return out;
}`,
            python: `def maxSlidingWindow(nums, k):
  out = []
  for i in range(len(nums) - k + 1):
    m = nums[i]
    for j in range(i + 1, i + k):
      if nums[j] > m: m = nums[j]
    out.append(m)
  return out`,
            java: `class Solution {
  public int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] out = new int[n - k + 1];
    for (int i = 0; i + k - 1 < n; i++) {
      int m = nums[i];
      for (int j = i + 1; j < i + k; j++) if (nums[j] > m) m = nums[j];
      out[i] = m;
    }
    return out;
  }
}`,
            cpp: `class Solution {
public:
  vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    vector<int> out;
    int n = (int)nums.size();
    for (int i = 0; i + k - 1 < n; i++) {
      int m = nums[i];
      for (int j = i + 1; j < i + k; j++) if (nums[j] > m) m = nums[j];
      out.push_back(m);
    }
    return out;
  }
};`,
            c: `#include <stdlib.h>
int* maxSlidingWindow(int* nums, int n, int k, int* returnSize) {
  int m = n - k + 1;
  int* out = (int*)malloc(sizeof(int) * m);
  for (int i = 0; i < m; i++) {
    int mx = nums[i];
    for (int j = i + 1; j < i + k; j++) if (nums[j] > mx) mx = nums[j];
    out[i] = mx;
  }
  *returnSize = m;
  return out;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n log n)",
          space: "O(n)",
          why: "Max-heap of [value, index] (store negated value in a min-heap). Pop the top while its index left the window. Lazy delete keeps the heap honest. Better than n*k, worse than a deque.",
          code: `function maxSlidingWindow(nums, k) {
  function MinHeap() {
    this.a = [];
  }
  MinHeap.prototype.key = function (x) { return x[0]; };
  MinHeap.prototype.push = function (x) {
    this.a.push(x);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[i][0] >= this.a[p][0]) break;
      const t = this.a[i]; this.a[i] = this.a[p]; this.a[p] = t;
      i = p;
    }
  };
  MinHeap.prototype.pop = function () {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = i * 2 + 1, r = l + 1;
        if (l < this.a.length && this.a[l][0] < this.a[s][0]) s = l;
        if (r < this.a.length && this.a[r][0] < this.a[s][0]) s = r;
        if (s === i) break;
        const t = this.a[i]; this.a[i] = this.a[s]; this.a[s] = t;
        i = s;
      }
    }
    return top;
  };
  MinHeap.prototype.peek = function () { return this.a[0]; };

  const heap = new MinHeap();
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    heap.push([-nums[i], i]);
    if (i < k - 1) continue;
    while (heap.peek()[1] <= i - k) heap.pop();
    out.push(-heap.peek()[0]);
  }
  return out;
}`,
          codes: {
            javascript: `function maxSlidingWindow(nums, k) {
  function MinHeap() {
    this.a = [];
  }
  MinHeap.prototype.key = function (x) { return x[0]; };
  MinHeap.prototype.push = function (x) {
    this.a.push(x);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[i][0] >= this.a[p][0]) break;
      const t = this.a[i]; this.a[i] = this.a[p]; this.a[p] = t;
      i = p;
    }
  };
  MinHeap.prototype.pop = function () {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = i * 2 + 1, r = l + 1;
        if (l < this.a.length && this.a[l][0] < this.a[s][0]) s = l;
        if (r < this.a.length && this.a[r][0] < this.a[s][0]) s = r;
        if (s === i) break;
        const t = this.a[i]; this.a[i] = this.a[s]; this.a[s] = t;
        i = s;
      }
    }
    return top;
  };
  MinHeap.prototype.peek = function () { return this.a[0]; };

  const heap = new MinHeap();
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    heap.push([-nums[i], i]);
    if (i < k - 1) continue;
    while (heap.peek()[1] <= i - k) heap.pop();
    out.push(-heap.peek()[0]);
  }
  return out;
}`,
            python: `def maxSlidingWindow(nums, k):
  h = []
  def key(x): return x[0]
  def up(i):
    while i > 0:
      p = (i - 1) >> 1
      if key(h[i]) >= key(h[p]): break
      h[i], h[p] = h[p], h[i]
      i = p
  def down(i):
    n = len(h)
    while True:
      s = i
      l = i * 2 + 1
      r = l + 1
      if l < n and key(h[l]) < key(h[s]): s = l
      if r < n and key(h[r]) < key(h[s]): s = r
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
  def peek():
    return h[0]
  out = []
  for i, x in enumerate(nums):
    push((-x, i))
    if i < k - 1: continue
    while peek()[1] <= i - k: pop()
    out.append(-peek()[0])
  return out`,
            java: `import java.util.*;
class Solution {
  static class MinHeap {
    ArrayList<int[]> a = new ArrayList<int[]>();
    void push(int[] x) { a.add(x); int i = a.size()-1;
      while (i > 0) { int p = (i-1)>>1; if (a.get(i)[0] >= a.get(p)[0]) break;
        int[] t = a.get(i); a.set(i, a.get(p)); a.set(p, t); i = p; } }
    int[] pop() {
      int[] top = a.get(0); int[] last = a.remove(a.size()-1);
      if (!a.isEmpty()) { a.set(0, last); int i = 0;
        while (true) { int s = i, l = i*2+1, r = l+1;
          if (l < a.size() && a.get(l)[0] < a.get(s)[0]) s = l;
          if (r < a.size() && a.get(r)[0] < a.get(s)[0]) s = r;
          if (s == i) break;
          int[] t = a.get(i); a.set(i, a.get(s)); a.set(s, t); i = s; } }
      return top; }
    int[] peek() { return a.get(0); }
  }
  public int[] maxSlidingWindow(int[] nums, int k) {
    MinHeap heap = new MinHeap();
    int[] out = new int[nums.length - k + 1];
    int p = 0;
    for (int i = 0; i < nums.length; i++) {
      heap.push(new int[]{-nums[i], i});
      if (i < k - 1) continue;
      while (heap.peek()[1] <= i - k) heap.pop();
      out[p++] = -heap.peek()[0];
    }
    return out;
  }
}`,
            cpp: `class Solution {
  struct MinHeap {
    vector<pair<int,int>> a;
    void push(pair<int,int> x) {
      a.push_back(x); int i = (int)a.size()-1;
      while (i > 0) { int p = (i-1)>>1; if (a[i].first >= a[p].first) break; swap(a[i], a[p]); i = p; }
    }
    pair<int,int> pop() {
      auto top = a[0]; auto last = a.back(); a.pop_back();
      if (!a.empty()) { a[0] = last; int i = 0;
        while (true) { int s = i, l = i*2+1, r = l+1, n = (int)a.size();
          if (l < n && a[l].first < a[s].first) s = l;
          if (r < n && a[r].first < a[s].first) s = r;
          if (s == i) break; swap(a[i], a[s]); i = s; } }
      return top;
    }
    pair<int,int> peek() { return a[0]; }
  };
public:
  vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    MinHeap heap; vector<int> out;
    for (int i = 0; i < (int)nums.size(); i++) {
      heap.push({-nums[i], i});
      if (i < k - 1) continue;
      while (heap.peek().second <= i - k) heap.pop();
      out.push_back(-heap.peek().first);
    }
    return out;
  }
};`,
            c: `#include <stdlib.h>
/* min-heap of (key, idx); store -value as key so max comes first */
void up(int* k, int* ix, int i) {
  while (i > 0) { int p = (i-1)>>1; if (k[i] >= k[p]) break;
    int t=k[i]; k[i]=k[p]; k[p]=t; t=ix[i]; ix[i]=ix[p]; ix[p]=t; i=p; }
}
void down(int* k, int* ix, int n, int i) {
  while (1) { int s=i, l=i*2+1, r=l+1;
    if (l<n && k[l]<k[s]) s=l; if (r<n && k[r]<k[s]) s=r;
    if (s==i) break; int t=k[i]; k[i]=k[s]; k[s]=t; t=ix[i]; ix[i]=ix[s]; ix[s]=t; i=s; }
}
int* maxSlidingWindow(int* nums, int n, int k, int* returnSize) {
  int* hk = (int*)malloc(sizeof(int)*n);
  int* hi = (int*)malloc(sizeof(int)*n);
  int sz = 0;
  int* out = (int*)malloc(sizeof(int)*(n-k+1));
  int p = 0;
  for (int i = 0; i < n; i++) {
    hk[sz] = -nums[i]; hi[sz] = i; sz++; up(hk, hi, sz-1);
    if (i < k-1) continue;
    while (hi[0] <= i-k) {
      sz--; if (sz) { hk[0]=hk[sz]; hi[0]=hi[sz]; down(hk, hi, sz, 0); }
    }
    out[p++] = -hk[0];
  }
  free(hk); free(hi);
  *returnSize = p;
  return out;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(k)",
          why: "Decreasing deque of indices. Pop back while nums[i] is larger. Pop front if it left the window. Front is the max. Each index enters and leaves once.",
          code: `function maxSlidingWindow(nums, k) {
  const dq = [];
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
    dq.push(i);
    if (dq[0] <= i - k) dq.shift();
    if (i >= k - 1) out.push(nums[dq[0]]);
  }
  return out;
}`,
          codes: {
            javascript: `function maxSlidingWindow(nums, k) {
  const dq = [];
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
    dq.push(i);
    if (dq[0] <= i - k) dq.shift();
    if (i >= k - 1) out.push(nums[dq[0]]);
  }
  return out;
}`,
            python: `from collections import deque
def maxSlidingWindow(nums, k):
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
  public int[] maxSlidingWindow(int[] nums, int k) {
    ArrayDeque<Integer> dq = new ArrayDeque<Integer>();
    int[] out = new int[nums.length - k + 1];
    int p = 0;
    for (int i = 0; i < nums.length; i++) {
      while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();
      dq.addLast(i);
      if (dq.peekFirst() <= i - k) dq.pollFirst();
      if (i >= k - 1) out[p++] = nums[dq.peekFirst()];
    }
    return out;
  }
}`,
            cpp: `class Solution {
public:
  vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;
    vector<int> out;
    for (int i = 0; i < (int)nums.size(); i++) {
      while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();
      dq.push_back(i);
      if (dq.front() <= i - k) dq.pop_front();
      if (i >= k - 1) out.push_back(nums[dq.front()]);
    }
    return out;
  }
};`,
            c: `#include <stdlib.h>
int* maxSlidingWindow(int* nums, int n, int k, int* returnSize) {
  int* dq = (int*)malloc(sizeof(int)*n);
  int head = 0, tail = 0;
  int* out = (int*)malloc(sizeof(int)*(n-k+1));
  int p = 0;
  for (int i = 0; i < n; i++) {
    while (head < tail && nums[dq[tail-1]] <= nums[i]) tail--;
    dq[tail++] = i;
    if (dq[head] <= i - k) head++;
    if (i >= k - 1) out[p++] = nums[dq[head]];
  }
  free(dq);
  *returnSize = p;
  return out;
}`
          }
        }
      ]
    },
    {
      id: 7,
      level: "beginner",
      q: "Implement Queue using Stacks",
      ask: "Amazon · Google · Microsoft · Apple",
      a: "Build a queue (FIFO) using only stacks (LIFO). Support push, pop, peek, empty.\n\nExample: push 1, push 2, peek is 1, pop is 1, empty is false.\n\nBrute moves every item to a temp stack and back on each pop. Optimal uses an in-stack and an out-stack and pours only when out is empty (amortized O(1)). More optimal is the same pour, with peek reusing out-stack so you do not pour twice.",
      solutions: [
        {
          name: "Brute",
          time: "O(n) pop/peek",
          space: "O(n)",
          why: "On pop, pour all into temp (that reverses), pop, pour back. Every call is O(n). Easy to see FIFO, slow.",
          code: `function MyQueue() {
  this.st = [];
}
MyQueue.prototype.push = function (x) { this.st.push(x); };
MyQueue.prototype.pop = function () {
  const tmp = [];
  while (this.st.length) tmp.push(this.st.pop());
  const val = tmp.pop();
  while (tmp.length) this.st.push(tmp.pop());
  return val;
};
MyQueue.prototype.peek = function () {
  const tmp = [];
  while (this.st.length) tmp.push(this.st.pop());
  const val = tmp[tmp.length - 1];
  while (tmp.length) this.st.push(tmp.pop());
  return val;
};
MyQueue.prototype.empty = function () { return this.st.length === 0; };`,
          codes: {
            javascript: `function MyQueue() {
  this.st = [];
}
MyQueue.prototype.push = function (x) { this.st.push(x); };
MyQueue.prototype.pop = function () {
  const tmp = [];
  while (this.st.length) tmp.push(this.st.pop());
  const val = tmp.pop();
  while (tmp.length) this.st.push(tmp.pop());
  return val;
};
MyQueue.prototype.peek = function () {
  const tmp = [];
  while (this.st.length) tmp.push(this.st.pop());
  const val = tmp[tmp.length - 1];
  while (tmp.length) this.st.push(tmp.pop());
  return val;
};
MyQueue.prototype.empty = function () { return this.st.length === 0; };`,
            python: `class MyQueue:
  def __init__(self):
    self.st = []
  def push(self, x):
    self.st.append(x)
  def pop(self):
    tmp = []
    while self.st:
      tmp.append(self.st.pop())
    val = tmp.pop()
    while tmp:
      self.st.append(tmp.pop())
    return val
  def peek(self):
    tmp = []
    while self.st:
      tmp.append(self.st.pop())
    val = tmp[-1]
    while tmp:
      self.st.append(tmp.pop())
    return val
  def empty(self):
    return not self.st`,
            java: `import java.util.*;
class MyQueue {
  ArrayDeque<Integer> st = new ArrayDeque<Integer>();
  public MyQueue() {}
  public void push(int x) { st.push(x); }
  public int pop() {
    ArrayDeque<Integer> tmp = new ArrayDeque<Integer>();
    while (!st.isEmpty()) tmp.push(st.pop());
    int val = tmp.pop();
    while (!tmp.isEmpty()) st.push(tmp.pop());
    return val;
  }
  public int peek() {
    ArrayDeque<Integer> tmp = new ArrayDeque<Integer>();
    while (!st.isEmpty()) tmp.push(st.pop());
    int val = tmp.peek();
    while (!tmp.isEmpty()) st.push(tmp.pop());
    return val;
  }
  public boolean empty() { return st.isEmpty(); }
}
class Solution {}`,
            cpp: `class MyQueue {
  vector<int> st;
public:
  void push(int x) { st.push_back(x); }
  int pop() {
    vector<int> tmp;
    while (!st.empty()) { tmp.push_back(st.back()); st.pop_back(); }
    int val = tmp.back(); tmp.pop_back();
    while (!tmp.empty()) { st.push_back(tmp.back()); tmp.pop_back(); }
    return val;
  }
  int peek() {
    vector<int> tmp;
    while (!st.empty()) { tmp.push_back(st.back()); st.pop_back(); }
    int val = tmp.back();
    while (!tmp.empty()) { st.push_back(tmp.back()); tmp.pop_back(); }
    return val;
  }
  bool empty() { return st.empty(); }
};`,
            c: `#include <stdlib.h>
typedef struct { int *a; int n, cap; } MyQueue;
void q_init(MyQueue* q) { q->a=NULL; q->n=q->cap=0; }
void q_push(MyQueue* q, int x) {
  if (q->n==q->cap) { q->cap = q->cap? q->cap*2:8; q->a=(int*)realloc(q->a,sizeof(int)*q->cap); }
  q->a[q->n++] = x;
}
int q_pop(MyQueue* q) {
  int* tmp = (int*)malloc(sizeof(int)*q->n);
  int tn = 0;
  while (q->n) tmp[tn++] = q->a[--q->n];
  int val = tmp[--tn];
  while (tn) q->a[q->n++] = tmp[--tn];
  free(tmp);
  return val;
}
int q_peek(MyQueue* q) {
  int* tmp = (int*)malloc(sizeof(int)*q->n);
  int tn = 0;
  while (q->n) tmp[tn++] = q->a[--q->n];
  int val = tmp[tn-1];
  while (tn) q->a[q->n++] = tmp[--tn];
  free(tmp);
  return val;
}
int q_empty(MyQueue* q) { return q->n == 0; }`
          }
        },
        {
          name: "Optimal",
          time: "O(1) amortized",
          space: "O(n)",
          why: "push always goes to inSt. pop/peek pour inSt into outSt only when outSt is empty. Each item moves at most twice.",
          code: `function MyQueue() {
  this.inSt = [];
  this.outSt = [];
}
MyQueue.prototype.pour = function () {
  if (this.outSt.length) return;
  while (this.inSt.length) this.outSt.push(this.inSt.pop());
};
MyQueue.prototype.push = function (x) { this.inSt.push(x); };
MyQueue.prototype.pop = function () { this.pour(); return this.outSt.pop(); };
MyQueue.prototype.peek = function () { this.pour(); return this.outSt[this.outSt.length - 1]; };
MyQueue.prototype.empty = function () { return !this.inSt.length && !this.outSt.length; };`,
          codes: {
            javascript: `function MyQueue() {
  this.inSt = [];
  this.outSt = [];
}
MyQueue.prototype.pour = function () {
  if (this.outSt.length) return;
  while (this.inSt.length) this.outSt.push(this.inSt.pop());
};
MyQueue.prototype.push = function (x) { this.inSt.push(x); };
MyQueue.prototype.pop = function () { this.pour(); return this.outSt.pop(); };
MyQueue.prototype.peek = function () { this.pour(); return this.outSt[this.outSt.length - 1]; };
MyQueue.prototype.empty = function () { return !this.inSt.length && !this.outSt.length; };`,
            python: `class MyQueue:
  def __init__(self):
    self.inSt = []
    self.outSt = []
  def pour(self):
    if self.outSt: return
    while self.inSt:
      self.outSt.append(self.inSt.pop())
  def push(self, x):
    self.inSt.append(x)
  def pop(self):
    self.pour(); return self.outSt.pop()
  def peek(self):
    self.pour(); return self.outSt[-1]
  def empty(self):
    return not self.inSt and not self.outSt`,
            java: `import java.util.*;
class MyQueue {
  ArrayDeque<Integer> inSt = new ArrayDeque<Integer>();
  ArrayDeque<Integer> outSt = new ArrayDeque<Integer>();
  public MyQueue() {}
  void pour() {
    if (!outSt.isEmpty()) return;
    while (!inSt.isEmpty()) outSt.push(inSt.pop());
  }
  public void push(int x) { inSt.push(x); }
  public int pop() { pour(); return outSt.pop(); }
  public int peek() { pour(); return outSt.peek(); }
  public boolean empty() { return inSt.isEmpty() && outSt.isEmpty(); }
}
class Solution {}`,
            cpp: `class MyQueue {
  vector<int> inSt, outSt;
  void pour() {
    if (!outSt.empty()) return;
    while (!inSt.empty()) { outSt.push_back(inSt.back()); inSt.pop_back(); }
  }
public:
  void push(int x) { inSt.push_back(x); }
  int pop() { pour(); int x = outSt.back(); outSt.pop_back(); return x; }
  int peek() { pour(); return outSt.back(); }
  bool empty() { return inSt.empty() && outSt.empty(); }
};`,
            c: `#include <stdlib.h>
typedef struct { int *in, *out; int ni, no, ci, co; } MyQueue;
void q_init(MyQueue* q) { q->in=q->out=NULL; q->ni=q->no=q->ci=q->co=0; }
void q_pour(MyQueue* q) {
  if (q->no) return;
  while (q->ni) {
    if (q->no==q->co) { q->co = q->co? q->co*2:8; q->out=(int*)realloc(q->out,sizeof(int)*q->co); }
    q->out[q->no++] = q->in[--q->ni];
  }
}
void q_push(MyQueue* q, int x) {
  if (q->ni==q->ci) { q->ci = q->ci? q->ci*2:8; q->in=(int*)realloc(q->in,sizeof(int)*q->ci); }
  q->in[q->ni++] = x;
}
int q_pop(MyQueue* q) { q_pour(q); return q->out[--q->no]; }
int q_peek(MyQueue* q) { q_pour(q); return q->out[q->no-1]; }
int q_empty(MyQueue* q) { return !q->ni && !q->no; }`
          }
        },
        {
          name: "More optimal",
          time: "O(1) amortized",
          space: "O(n)",
          why: "Same two stacks. pop is written as peek plus a pop so pour lives in one place. Interviewers like this factoring; complexity matches Optimal.",
          code: `function MyQueue() {
  this.inSt = [];
  this.outSt = [];
}
MyQueue.prototype.push = function (x) { this.inSt.push(x); };
MyQueue.prototype.peek = function () {
  if (!this.outSt.length) {
    while (this.inSt.length) this.outSt.push(this.inSt.pop());
  }
  return this.outSt[this.outSt.length - 1];
};
MyQueue.prototype.pop = function () {
  this.peek();
  return this.outSt.pop();
};
MyQueue.prototype.empty = function () { return !this.inSt.length && !this.outSt.length; };`,
          codes: {
            javascript: `function MyQueue() {
  this.inSt = [];
  this.outSt = [];
}
MyQueue.prototype.push = function (x) { this.inSt.push(x); };
MyQueue.prototype.peek = function () {
  if (!this.outSt.length) {
    while (this.inSt.length) this.outSt.push(this.inSt.pop());
  }
  return this.outSt[this.outSt.length - 1];
};
MyQueue.prototype.pop = function () {
  this.peek();
  return this.outSt.pop();
};
MyQueue.prototype.empty = function () { return !this.inSt.length && !this.outSt.length; };`,
            python: `class MyQueue:
  def __init__(self):
    self.inSt = []
    self.outSt = []
  def push(self, x):
    self.inSt.append(x)
  def peek(self):
    if not self.outSt:
      while self.inSt:
        self.outSt.append(self.inSt.pop())
    return self.outSt[-1]
  def pop(self):
    self.peek()
    return self.outSt.pop()
  def empty(self):
    return not self.inSt and not self.outSt`,
            java: `import java.util.*;
class MyQueue {
  ArrayDeque<Integer> inSt = new ArrayDeque<Integer>();
  ArrayDeque<Integer> outSt = new ArrayDeque<Integer>();
  public MyQueue() {}
  public void push(int x) { inSt.push(x); }
  public int peek() {
    if (outSt.isEmpty()) while (!inSt.isEmpty()) outSt.push(inSt.pop());
    return outSt.peek();
  }
  public int pop() { peek(); return outSt.pop(); }
  public boolean empty() { return inSt.isEmpty() && outSt.isEmpty(); }
}
class Solution {}`,
            cpp: `class MyQueue {
  vector<int> inSt, outSt;
public:
  void push(int x) { inSt.push_back(x); }
  int peek() {
    if (outSt.empty()) while (!inSt.empty()) { outSt.push_back(inSt.back()); inSt.pop_back(); }
    return outSt.back();
  }
  int pop() { peek(); int x = outSt.back(); outSt.pop_back(); return x; }
  bool empty() { return inSt.empty() && outSt.empty(); }
};`,
            c: `#include <stdlib.h>
typedef struct { int *in, *out; int ni, no, ci, co; } MyQueue;
void q_init(MyQueue* q) { q->in=q->out=NULL; q->ni=q->no=q->ci=q->co=0; }
void q_push(MyQueue* q, int x) {
  if (q->ni==q->ci) { q->ci = q->ci? q->ci*2:8; q->in=(int*)realloc(q->in,sizeof(int)*q->ci); }
  q->in[q->ni++] = x;
}
int q_peek(MyQueue* q) {
  if (!q->no) {
    while (q->ni) {
      if (q->no==q->co) { q->co = q->co? q->co*2:8; q->out=(int*)realloc(q->out,sizeof(int)*q->co); }
      q->out[q->no++] = q->in[--q->ni];
    }
  }
  return q->out[q->no-1];
}
int q_pop(MyQueue* q) { q_peek(q); return q->out[--q->no]; }
int q_empty(MyQueue* q) { return !q->ni && !q->no; }`
          }
        }
      ]
    },
    {
      id: 8,
      level: "beginner",
      q: "Implement Stack using Queues",
      ask: "Amazon · Google · Microsoft · Apple",
      a: "Build a stack (LIFO) using only queues (FIFO). Support push, pop, top, empty.\n\nExample: push 1, push 2, top is 2, pop is 2.\n\nBrute uses two queues and dumps n-1 items to the other queue on pop. Optimal uses one queue and rotates on push so the front is always the top. More optimal rotates on pop instead, so push stays O(1).",
      solutions: [
        {
          name: "Brute",
          time: "O(n) pop",
          space: "O(n)",
          why: "Two queues. pop moves all but the last item to the other queue, then swaps names. Push is O(1). Pop is O(n).",
          code: `function MyStack() {
  this.q1 = [];
  this.q2 = [];
}
MyStack.prototype.push = function (x) { this.q1.push(x); };
MyStack.prototype.pop = function () {
  while (this.q1.length > 1) this.q2.push(this.q1.shift());
  const val = this.q1.shift();
  const tmp = this.q1; this.q1 = this.q2; this.q2 = tmp;
  return val;
};
MyStack.prototype.top = function () {
  const val = this.pop();
  this.push(val);
  return val;
};
MyStack.prototype.empty = function () { return this.q1.length === 0; };`,
          codes: {
            javascript: `function MyStack() {
  this.q1 = [];
  this.q2 = [];
}
MyStack.prototype.push = function (x) { this.q1.push(x); };
MyStack.prototype.pop = function () {
  while (this.q1.length > 1) this.q2.push(this.q1.shift());
  const val = this.q1.shift();
  const tmp = this.q1; this.q1 = this.q2; this.q2 = tmp;
  return val;
};
MyStack.prototype.top = function () {
  const val = this.pop();
  this.push(val);
  return val;
};
MyStack.prototype.empty = function () { return this.q1.length === 0; };`,
            python: `from collections import deque
class MyStack:
  def __init__(self):
    self.q1 = deque()
    self.q2 = deque()
  def push(self, x):
    self.q1.append(x)
  def pop(self):
    while len(self.q1) > 1:
      self.q2.append(self.q1.popleft())
    val = self.q1.popleft()
    self.q1, self.q2 = self.q2, self.q1
    return val
  def top(self):
    val = self.pop()
    self.push(val)
    return val
  def empty(self):
    return not self.q1`,
            java: `import java.util.*;
class MyStack {
  ArrayDeque<Integer> q1 = new ArrayDeque<Integer>();
  ArrayDeque<Integer> q2 = new ArrayDeque<Integer>();
  public MyStack() {}
  public void push(int x) { q1.addLast(x); }
  public int pop() {
    while (q1.size() > 1) q2.addLast(q1.pollFirst());
    int val = q1.pollFirst();
    ArrayDeque<Integer> tmp = q1; q1 = q2; q2 = tmp;
    return val;
  }
  public int top() { int val = pop(); push(val); return val; }
  public boolean empty() { return q1.isEmpty(); }
}
class Solution {}`,
            cpp: `class MyStack {
  queue<int> q1, q2;
public:
  void push(int x) { q1.push(x); }
  int pop() {
    while (q1.size() > 1) { q2.push(q1.front()); q1.pop(); }
    int val = q1.front(); q1.pop();
    swap(q1, q2);
    return val;
  }
  int top() { int val = pop(); push(val); return val; }
  bool empty() { return q1.empty(); }
};`,
            c: `#include <stdlib.h>
/* two queues as ring buffers in arrays */
typedef struct { int *q1, *q2; int h1, t1, h2, t2, c1, c2; } MyStack;
void s_init(MyStack* s) { s->q1=s->q2=NULL; s->h1=s->t1=s->h2=s->t2=0; s->c1=s->c2=8;
  s->q1=(int*)malloc(sizeof(int)*8); s->q2=(int*)malloc(sizeof(int)*8); }
int s_len1(MyStack* s) { return s->t1 - s->h1; }
void s_push(MyStack* s, int x) { s->q1[s->t1++] = x; }
int s_pop(MyStack* s) {
  while (s_len1(s) > 1) s->q2[s->t2++] = s->q1[s->h1++];
  int val = s->q1[s->h1++];
  int *tq=s->q1; s->q1=s->q2; s->q2=tq;
  int th=s->h1, tt=s->t1; s->h1=s->h2; s->t1=s->t2; s->h2=th; s->t2=tt;
  return val;
}
int s_top(MyStack* s) { int v = s_pop(s); s_push(s, v); return v; }
int s_empty(MyStack* s) { return s_len1(s) == 0; }`
          }
        },
        {
          name: "Optimal",
          time: "O(n) push, O(1) pop",
          space: "O(n)",
          why: "One queue. After push, rotate length-1 items so the new item sits at the front. pop/top/empty are then O(1).",
          code: `function MyStack() {
  this.q = [];
}
MyStack.prototype.push = function (x) {
  this.q.push(x);
  for (let i = 0; i < this.q.length - 1; i++) this.q.push(this.q.shift());
};
MyStack.prototype.pop = function () { return this.q.shift(); };
MyStack.prototype.top = function () { return this.q[0]; };
MyStack.prototype.empty = function () { return this.q.length === 0; };`,
          codes: {
            javascript: `function MyStack() {
  this.q = [];
}
MyStack.prototype.push = function (x) {
  this.q.push(x);
  for (let i = 0; i < this.q.length - 1; i++) this.q.push(this.q.shift());
};
MyStack.prototype.pop = function () { return this.q.shift(); };
MyStack.prototype.top = function () { return this.q[0]; };
MyStack.prototype.empty = function () { return this.q.length === 0; };`,
            python: `from collections import deque
class MyStack:
  def __init__(self):
    self.q = deque()
  def push(self, x):
    self.q.append(x)
    for _ in range(len(self.q) - 1):
      self.q.append(self.q.popleft())
  def pop(self):
    return self.q.popleft()
  def top(self):
    return self.q[0]
  def empty(self):
    return not self.q`,
            java: `import java.util.*;
class MyStack {
  ArrayDeque<Integer> q = new ArrayDeque<Integer>();
  public MyStack() {}
  public void push(int x) {
    q.addLast(x);
    for (int i = 0; i < q.size() - 1; i++) q.addLast(q.pollFirst());
  }
  public int pop() { return q.pollFirst(); }
  public int top() { return q.peekFirst(); }
  public boolean empty() { return q.isEmpty(); }
}
class Solution {}`,
            cpp: `class MyStack {
  queue<int> q;
public:
  void push(int x) {
    q.push(x);
    for (int i = 0; i < (int)q.size() - 1; i++) { q.push(q.front()); q.pop(); }
  }
  int pop() { int x = q.front(); q.pop(); return x; }
  int top() { return q.front(); }
  bool empty() { return q.empty(); }
};`,
            c: `#include <stdlib.h>
typedef struct { int *q; int h, t, cap; } MyStack;
void s_init(MyStack* s) { s->cap=16; s->q=(int*)malloc(sizeof(int)*16); s->h=s->t=0; }
int s_len(MyStack* s) { return s->t - s->h; }
void s_push(MyStack* s, int x) {
  s->q[s->t++] = x;
  int n = s_len(s);
  for (int i = 0; i < n - 1; i++) s->q[s->t++] = s->q[s->h++];
}
int s_pop(MyStack* s) { return s->q[s->h++]; }
int s_top(MyStack* s) { return s->q[s->h]; }
int s_empty(MyStack* s) { return s_len(s) == 0; }`
          }
        },
        {
          name: "More optimal",
          time: "O(1) push, O(n) pop",
          space: "O(n)",
          why: "One queue, no rotate on push. pop rotates n-1 items then shifts. Prefer this when pushes are common and pops are rare. Same extra space.",
          code: `function MyStack() {
  this.q = [];
}
MyStack.prototype.push = function (x) { this.q.push(x); };
MyStack.prototype.pop = function () {
  for (let i = 0; i < this.q.length - 1; i++) this.q.push(this.q.shift());
  return this.q.shift();
};
MyStack.prototype.top = function () { return this.q[this.q.length - 1]; };
MyStack.prototype.empty = function () { return this.q.length === 0; };`,
          codes: {
            javascript: `function MyStack() {
  this.q = [];
}
MyStack.prototype.push = function (x) { this.q.push(x); };
MyStack.prototype.pop = function () {
  for (let i = 0; i < this.q.length - 1; i++) this.q.push(this.q.shift());
  return this.q.shift();
};
MyStack.prototype.top = function () { return this.q[this.q.length - 1]; };
MyStack.prototype.empty = function () { return this.q.length === 0; };`,
            python: `from collections import deque
class MyStack:
  def __init__(self):
    self.q = deque()
  def push(self, x):
    self.q.append(x)
  def pop(self):
    for _ in range(len(self.q) - 1):
      self.q.append(self.q.popleft())
    return self.q.popleft()
  def top(self):
    return self.q[-1]
  def empty(self):
    return not self.q`,
            java: `import java.util.*;
class MyStack {
  ArrayDeque<Integer> q = new ArrayDeque<Integer>();
  public MyStack() {}
  public void push(int x) { q.addLast(x); }
  public int pop() {
    for (int i = 0; i < q.size() - 1; i++) q.addLast(q.pollFirst());
    return q.pollFirst();
  }
  public int top() { return q.peekLast(); }
  public boolean empty() { return q.isEmpty(); }
}
class Solution {}`,
            cpp: `class MyStack {
  queue<int> q;
public:
  void push(int x) { q.push(x); }
  int pop() {
    for (int i = 0; i < (int)q.size() - 1; i++) { q.push(q.front()); q.pop(); }
    int x = q.front(); q.pop(); return x;
  }
  int top() { return q.back(); }
  bool empty() { return q.empty(); }
};`,
            c: `#include <stdlib.h>
typedef struct { int *q; int h, t, cap; } MyStack;
void s_init(MyStack* s) { s->cap=16; s->q=(int*)malloc(sizeof(int)*16); s->h=s->t=0; }
int s_len(MyStack* s) { return s->t - s->h; }
void s_push(MyStack* s, int x) { s->q[s->t++] = x; }
int s_pop(MyStack* s) {
  int n = s_len(s);
  for (int i = 0; i < n - 1; i++) s->q[s->t++] = s->q[s->h++];
  return s->q[s->h++];
}
int s_top(MyStack* s) { return s->q[s->t - 1]; }
int s_empty(MyStack* s) { return s_len(s) == 0; }`
          }
        }
      ]
    },
    {
      id: 9,
      level: "intermediate",
      q: "Kth Largest Element in an Array",
      ask: "Amazon · Google · Meta · Microsoft",
      a: "Return the k-th largest value in nums (1-based: k = 1 is the maximum). The array is unsorted. You may not need a full sort.\n\nExample: [3,2,1,5,6,4], k = 2 answers 5.\n\nBrute repeatedly strips the max. Optimal sorts. More optimal keeps a min-heap of size k (or quickselect for expected O(n)).",
      solutions: [
        {
          name: "Brute",
          time: "O(n · k)",
          space: "O(n)",
          why: "Copy the array. k times, find and remove the current max. Fine for tiny k, slow for k near n.",
          code: `function findKthLargest(nums, k) {
  const a = nums.slice();
  let ans = 0;
  for (let t = 0; t < k; t++) {
    let best = 0;
    for (let i = 1; i < a.length; i++) if (a[i] > a[best]) best = i;
    ans = a[best];
    a.splice(best, 1);
  }
  return ans;
}`,
          codes: {
            javascript: `function findKthLargest(nums, k) {
  const a = nums.slice();
  let ans = 0;
  for (let t = 0; t < k; t++) {
    let best = 0;
    for (let i = 1; i < a.length; i++) if (a[i] > a[best]) best = i;
    ans = a[best];
    a.splice(best, 1);
  }
  return ans;
}`,
            python: `def findKthLargest(nums, k):
  a = nums[:]
  ans = 0
  for t in range(k):
    best = 0
    for i in range(1, len(a)):
      if a[i] > a[best]: best = i
    ans = a[best]
    a.pop(best)
  return ans`,
            java: `import java.util.*;
class Solution {
  public int findKthLargest(int[] nums, int k) {
    ArrayList<Integer> a = new ArrayList<Integer>();
    for (int x : nums) a.add(x);
    int ans = 0;
    for (int t = 0; t < k; t++) {
      int best = 0;
      for (int i = 1; i < a.size(); i++) if (a.get(i) > a.get(best)) best = i;
      ans = a.get(best);
      a.remove(best);
    }
    return ans;
  }
}`,
            cpp: `class Solution {
public:
  int findKthLargest(vector<int>& nums, int k) {
    vector<int> a = nums;
    int ans = 0;
    for (int t = 0; t < k; t++) {
      int best = 0;
      for (int i = 1; i < (int)a.size(); i++) if (a[i] > a[best]) best = i;
      ans = a[best];
      a.erase(a.begin() + best);
    }
    return ans;
  }
};`,
            c: `#include <stdlib.h>
int findKthLargest(int* nums, int n, int k) {
  int* a = (int*)malloc(sizeof(int)*n);
  int m = n, ans = 0;
  for (int i = 0; i < n; i++) a[i] = nums[i];
  for (int t = 0; t < k; t++) {
    int best = 0;
    for (int i = 1; i < m; i++) if (a[i] > a[best]) best = i;
    ans = a[best];
    for (int i = best; i < m - 1; i++) a[i] = a[i+1];
    m--;
  }
  free(a);
  return ans;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n log n)",
          space: "O(n)",
          why: "Sort descending (or ascending and index). Honest and short. Use this first in an interview, then offer a heap.",
          code: `function findKthLargest(nums, k) {
  const a = nums.slice().sort(function (x, y) { return y - x; });
  return a[k - 1];
}`,
          codes: {
            javascript: `function findKthLargest(nums, k) {
  const a = nums.slice().sort(function (x, y) { return y - x; });
  return a[k - 1];
}`,
            python: `def findKthLargest(nums, k):
  a = sorted(nums, reverse=True)
  return a[k - 1]`,
            java: `import java.util.*;
class Solution {
  public int findKthLargest(int[] nums, int k) {
    int[] a = nums.clone();
    Arrays.sort(a);
    return a[a.length - k];
  }
}`,
            cpp: `class Solution {
public:
  int findKthLargest(vector<int> nums, int k) {
    sort(nums.begin(), nums.end(), greater<int>());
    return nums[k - 1];
  }
};`,
            c: `#include <stdlib.h>
int cmp_desc(const void* a, const void* b) { return *(const int*)b - *(const int*)a; }
int findKthLargest(int* nums, int n, int k) {
  int* a = (int*)malloc(sizeof(int)*n);
  for (int i = 0; i < n; i++) a[i] = nums[i];
  qsort(a, n, sizeof(int), cmp_desc);
  int ans = a[k - 1];
  free(a);
  return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n log k)",
          space: "O(k)",
          why: "Min-heap of size k. If the heap is full and x is bigger than the peek, replace the peek. The peek is the k-th largest. Tiny binary heap inlined. Quickselect is expected O(n) if they want that next.",
          code: `function findKthLargest(nums, k) {
  const h = [];
  function up(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (h[i] >= h[p]) break;
      const t = h[i]; h[i] = h[p]; h[p] = t;
      i = p;
    }
  }
  function down(i) {
    while (true) {
      let s = i;
      const l = i * 2 + 1, r = l + 1;
      if (l < h.length && h[l] < h[s]) s = l;
      if (r < h.length && h[r] < h[s]) s = r;
      if (s === i) break;
      const t = h[i]; h[i] = h[s]; h[s] = t;
      i = s;
    }
  }
  function push(x) { h.push(x); up(h.length - 1); }
  function pop() {
    const top = h[0];
    const last = h.pop();
    if (h.length) { h[0] = last; down(0); }
    return top;
  }
  for (let i = 0; i < nums.length; i++) {
    if (h.length < k) push(nums[i]);
    else if (nums[i] > h[0]) { pop(); push(nums[i]); }
  }
  return h[0];
}`,
          codes: {
            javascript: `function findKthLargest(nums, k) {
  const h = [];
  function up(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (h[i] >= h[p]) break;
      const t = h[i]; h[i] = h[p]; h[p] = t;
      i = p;
    }
  }
  function down(i) {
    while (true) {
      let s = i;
      const l = i * 2 + 1, r = l + 1;
      if (l < h.length && h[l] < h[s]) s = l;
      if (r < h.length && h[r] < h[s]) s = r;
      if (s === i) break;
      const t = h[i]; h[i] = h[s]; h[s] = t;
      i = s;
    }
  }
  function push(x) { h.push(x); up(h.length - 1); }
  function pop() {
    const top = h[0];
    const last = h.pop();
    if (h.length) { h[0] = last; down(0); }
    return top;
  }
  for (let i = 0; i < nums.length; i++) {
    if (h.length < k) push(nums[i]);
    else if (nums[i] > h[0]) { pop(); push(nums[i]); }
  }
  return h[0];
}`,
            python: `def findKthLargest(nums, k):
  h = []
  def up(i):
    while i > 0:
      p = (i - 1) >> 1
      if h[i] >= h[p]: break
      h[i], h[p] = h[p], h[i]
      i = p
  def down(i):
    while True:
      s = i
      l = i * 2 + 1
      r = l + 1
      if l < len(h) and h[l] < h[s]: s = l
      if r < len(h) and h[r] < h[s]: s = r
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
  for x in nums:
    if len(h) < k: push(x)
    elif x > h[0]:
      pop(); push(x)
  return h[0]`,
            java: `class Solution {
  void up(int[] h, int i) {
    while (i > 0) { int p = (i-1)>>1; if (h[i] >= h[p]) break; int t=h[i]; h[i]=h[p]; h[p]=t; i=p; }
  }
  void down(int[] h, int n, int i) {
    while (true) { int s=i, l=i*2+1, r=l+1;
      if (l<n && h[l]<h[s]) s=l; if (r<n && h[r]<h[s]) s=r;
      if (s==i) break; int t=h[i]; h[i]=h[s]; h[s]=t; i=s; }
  }
  public int findKthLargest(int[] nums, int k) {
    int[] h = new int[k];
    int n = 0;
    for (int x : nums) {
      if (n < k) { h[n++] = x; up(h, n-1); }
      else if (x > h[0]) {
        h[0] = h[--n]; if (n>0) down(h, n, 0);
        h[n++] = x; up(h, n-1);
      }
    }
    return h[0];
  }
}`,
            cpp: `class Solution {
  void up(vector<int>& h, int i) {
    while (i > 0) { int p=(i-1)>>1; if (h[i]>=h[p]) break; swap(h[i], h[p]); i=p; }
  }
  void down(vector<int>& h, int i) {
    int n=(int)h.size();
    while (true) { int s=i, l=i*2+1, r=l+1;
      if (l<n && h[l]<h[s]) s=l; if (r<n && h[r]<h[s]) s=r;
      if (s==i) break; swap(h[i], h[s]); i=s; }
  }
public:
  int findKthLargest(vector<int>& nums, int k) {
    vector<int> h;
    for (int x : nums) {
      if ((int)h.size() < k) { h.push_back(x); up(h, (int)h.size()-1); }
      else if (x > h[0]) {
        h[0] = h.back(); h.pop_back(); if (!h.empty()) down(h, 0);
        h.push_back(x); up(h, (int)h.size()-1);
      }
    }
    return h[0];
  }
};`,
            c: `#include <stdlib.h>
void up(int* h, int i) {
  while (i > 0) { int p=(i-1)>>1; if (h[i]>=h[p]) break; int t=h[i]; h[i]=h[p]; h[p]=t; i=p; }
}
void down(int* h, int n, int i) {
  while (1) { int s=i, l=i*2+1, r=l+1;
    if (l<n && h[l]<h[s]) s=l; if (r<n && h[r]<h[s]) s=r;
    if (s==i) break; int t=h[i]; h[i]=h[s]; h[s]=t; i=s; }
}
int findKthLargest(int* nums, int n, int k) {
  int* h = (int*)malloc(sizeof(int)*k);
  int sz = 0;
  for (int i = 0; i < n; i++) {
    if (sz < k) { h[sz++] = nums[i]; up(h, sz-1); }
    else if (nums[i] > h[0]) {
      h[0] = h[--sz]; if (sz) down(h, sz, 0);
      h[sz++] = nums[i]; up(h, sz-1);
    }
  }
  int ans = h[0];
  free(h);
  return ans;
}`
          }
        }
      ]
    },
    {
      id: 10,
      level: "intermediate",
      q: "Top K Frequent Elements",
      ask: "Amazon · Google · Meta · Uber",
      a: "Return the k numbers that appear most often in nums. Any order is fine.\n\nExample: [1,1,1,2,2,3], k = 2 answers [1,2].\n\nCount first. Brute then strips the current max count k times. Optimal sorts the unique numbers by count. More optimal is a bucket list indexed by count (O(n)), or a heap of size k.",
      solutions: [
        {
          name: "Brute",
          time: "O(n + u · k)",
          space: "O(u)",
          why: "Count in a map. Then k times scan all unique keys for the remaining max count and remove it. u is the number of unique values.",
          code: `function topKFrequent(nums, k) {
  const count = {};
  for (let i = 0; i < nums.length; i++) count[nums[i]] = (count[nums[i]] || 0) + 1;
  const ans = [];
  for (let t = 0; t < k; t++) {
    let bestKey = null, best = -1;
    const keys = Object.keys(count);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (count[key] > best) { best = count[key]; bestKey = key; }
    }
    ans.push(Number(bestKey));
    delete count[bestKey];
  }
  return ans;
}`,
          codes: {
            javascript: `function topKFrequent(nums, k) {
  const count = {};
  for (let i = 0; i < nums.length; i++) count[nums[i]] = (count[nums[i]] || 0) + 1;
  const ans = [];
  for (let t = 0; t < k; t++) {
    let bestKey = null, best = -1;
    const keys = Object.keys(count);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (count[key] > best) { best = count[key]; bestKey = key; }
    }
    ans.push(Number(bestKey));
    delete count[bestKey];
  }
  return ans;
}`,
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
          }
        },
        {
          name: "Optimal",
          time: "O(n + u log u)",
          space: "O(u)",
          why: "Count, then sort unique keys by frequency descending, take k. Clear and fast enough for interview n.",
          code: `function topKFrequent(nums, k) {
  const count = {};
  for (let i = 0; i < nums.length; i++) count[nums[i]] = (count[nums[i]] || 0) + 1;
  const keys = Object.keys(count).map(Number);
  keys.sort(function (a, b) { return count[b] - count[a]; });
  return keys.slice(0, k);
}`,
          codes: {
            javascript: `function topKFrequent(nums, k) {
  const count = {};
  for (let i = 0; i < nums.length; i++) count[nums[i]] = (count[nums[i]] || 0) + 1;
  const keys = Object.keys(count).map(Number);
  keys.sort(function (a, b) { return count[b] - count[a]; });
  return keys.slice(0, k);
}`,
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
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Bucket sort: buckets[i] holds numbers that appear i times. Walk i from n down and collect k numbers. Linear because counts are at most n. A size-k min-heap is O(n log k) if they want a heap instead.",
          code: `function topKFrequent(nums, k) {
  const count = {};
  for (let i = 0; i < nums.length; i++) count[nums[i]] = (count[nums[i]] || 0) + 1;
  const buckets = Array.from({ length: nums.length + 1 }, function () { return []; });
  const keys = Object.keys(count);
  for (let i = 0; i < keys.length; i++) {
    const num = Number(keys[i]);
    buckets[count[num]].push(num);
  }
  const ans = [];
  for (let f = buckets.length - 1; f >= 0 && ans.length < k; f--) {
    for (let i = 0; i < buckets[f].length && ans.length < k; i++) ans.push(buckets[f][i]);
  }
  return ans;
}`,
          codes: {
            javascript: `function topKFrequent(nums, k) {
  const count = {};
  for (let i = 0; i < nums.length; i++) count[nums[i]] = (count[nums[i]] || 0) + 1;
  const buckets = Array.from({ length: nums.length + 1 }, function () { return []; });
  const keys = Object.keys(count);
  for (let i = 0; i < keys.length; i++) {
    const num = Number(keys[i]);
    buckets[count[num]].push(num);
  }
  const ans = [];
  for (let f = buckets.length - 1; f >= 0 && ans.length < k; f--) {
    for (let i = 0; i < buckets[f].length && ans.length < k; i++) ans.push(buckets[f][i]);
  }
  return ans;
}`,
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
          }
        }
      ]
    },
    {
      id: 11,
      level: "advanced",
      q: "Merge k Sorted Lists",
      ask: "Amazon · Google · Meta · Microsoft",
      a: "lists is an array of k sorted linked lists. Merge them into one sorted list and return the head.\n\nExample: [1->4->5, 1->3->4, 2->6] becomes 1->1->2->3->4->4->5->6.\n\nBrute dumps every value, sorts, rebuilds. Optimal is a min-heap of the k current heads. More optimal is divide-and-conquer merge (like merge sort), no heap.",
      solutions: [
        {
          name: "Brute",
          time: "O(n log n)",
          space: "O(n)",
          why: "Walk every node into an array, sort, then wire a new list. Ignores that each list is already sorted. Easy to code under pressure.",
          code: `function mergeKLists(lists) {
  const vals = [];
  for (let i = 0; i < lists.length; i++) {
    let p = lists[i];
    while (p) { vals.push(p.val); p = p.next; }
  }
  vals.sort(function (a, b) { return a - b; });
  const dummy = { val: 0, next: null };
  let cur = dummy;
  for (let i = 0; i < vals.length; i++) {
    cur.next = { val: vals[i], next: null };
    cur = cur.next;
  }
  return dummy.next;
}`,
          codes: {
            javascript: `function mergeKLists(lists) {
  const vals = [];
  for (let i = 0; i < lists.length; i++) {
    let p = lists[i];
    while (p) { vals.push(p.val); p = p.next; }
  }
  vals.sort(function (a, b) { return a - b; });
  const dummy = { val: 0, next: null };
  let cur = dummy;
  for (let i = 0; i < vals.length; i++) {
    cur.next = { val: vals[i], next: null };
    cur = cur.next;
  }
  return dummy.next;
}`,
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
          }
        },
        {
          name: "Optimal",
          time: "O(n log k)",
          space: "O(k)",
          why: "Min-heap of list heads keyed by val. Pop the smallest, push its next. n pops, heap size k. Uses the sorted property.",
          code: `function mergeKLists(lists) {
  const h = [];
  function key(x) { return x.val; }
  function up(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (key(h[i]) >= key(h[p])) break;
      const t = h[i]; h[i] = h[p]; h[p] = t;
      i = p;
    }
  }
  function down(i) {
    while (true) {
      let s = i;
      const l = i * 2 + 1, r = l + 1;
      if (l < h.length && key(h[l]) < key(h[s])) s = l;
      if (r < h.length && key(h[r]) < key(h[s])) s = r;
      if (s === i) break;
      const t = h[i]; h[i] = h[s]; h[s] = t;
      i = s;
    }
  }
  function push(node) { h.push(node); up(h.length - 1); }
  function pop() {
    const top = h[0];
    const last = h.pop();
    if (h.length) { h[0] = last; down(0); }
    return top;
  }
  for (let i = 0; i < lists.length; i++) if (lists[i]) push(lists[i]);
  const dummy = { val: 0, next: null };
  let cur = dummy;
  while (h.length) {
    const node = pop();
    cur.next = node;
    cur = node;
    if (node.next) push(node.next);
  }
  return dummy.next;
}`,
          codes: {
            javascript: `function mergeKLists(lists) {
  const h = [];
  function key(x) { return x.val; }
  function up(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (key(h[i]) >= key(h[p])) break;
      const t = h[i]; h[i] = h[p]; h[p] = t;
      i = p;
    }
  }
  function down(i) {
    while (true) {
      let s = i;
      const l = i * 2 + 1, r = l + 1;
      if (l < h.length && key(h[l]) < key(h[s])) s = l;
      if (r < h.length && key(h[r]) < key(h[s])) s = r;
      if (s === i) break;
      const t = h[i]; h[i] = h[s]; h[s] = t;
      i = s;
    }
  }
  function push(node) { h.push(node); up(h.length - 1); }
  function pop() {
    const top = h[0];
    const last = h.pop();
    if (h.length) { h[0] = last; down(0); }
    return top;
  }
  for (let i = 0; i < lists.length; i++) if (lists[i]) push(lists[i]);
  const dummy = { val: 0, next: null };
  let cur = dummy;
  while (h.length) {
    const node = pop();
    cur.next = node;
    cur = node;
    if (node.next) push(node.next);
  }
  return dummy.next;
}`,
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
          }
        },
        {
          name: "More optimal",
          time: "O(n log k)",
          space: "O(log k)",
          why: "Pairwise merge like merge sort. Recursion depth log k. No heap to implement. Same n log k, often faster constants in JS, and O(1) extra besides the call stack.",
          code: `function mergeKLists(lists) {
  if (!lists.length) return null;
  function mergeTwo(a, b) {
    const dummy = { val: 0, next: null };
    let cur = dummy;
    while (a && b) {
      if (a.val <= b.val) { cur.next = a; a = a.next; }
      else { cur.next = b; b = b.next; }
      cur = cur.next;
    }
    cur.next = a || b;
    return dummy.next;
  }
  function split(lo, hi) {
    if (lo === hi) return lists[lo];
    const mid = (lo + hi) >> 1;
    return mergeTwo(split(lo, mid), split(mid + 1, hi));
  }
  return split(0, lists.length - 1);
}`,
          codes: {
            javascript: `function mergeKLists(lists) {
  if (!lists.length) return null;
  function mergeTwo(a, b) {
    const dummy = { val: 0, next: null };
    let cur = dummy;
    while (a && b) {
      if (a.val <= b.val) { cur.next = a; a = a.next; }
      else { cur.next = b; b = b.next; }
      cur = cur.next;
    }
    cur.next = a || b;
    return dummy.next;
  }
  function split(lo, hi) {
    if (lo === hi) return lists[lo];
    const mid = (lo + hi) >> 1;
    return mergeTwo(split(lo, mid), split(mid + 1, hi));
  }
  return split(0, lists.length - 1);
}`,
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
        }
      ]
    },
    {
      id: 12,
      level: "advanced",
      q: "Find Median from Data Stream",
      ask: "Amazon · Google · Meta · Microsoft",
      a: "MedianFinder: addNum inserts a number. findMedian returns the median of all numbers so far. Even count: average of the two middle values.\n\nExample: add 1, add 2, median 1.5, add 3, median 2.\n\nBrute stores and sorts every query. Optimal inserts into a sorted array. More optimal is two heaps: max-heap lower half, min-heap upper half.",
      solutions: [
        {
          name: "Brute",
          time: "O(n log n) find",
          space: "O(n)",
          why: "Keep every number. findMedian copies and sorts. addNum is O(1). Queries get slower as the stream grows.",
          code: `function MedianFinder() {
  this.a = [];
}
MedianFinder.prototype.addNum = function (num) { this.a.push(num); };
MedianFinder.prototype.findMedian = function () {
  const b = this.a.slice().sort(function (x, y) { return x - y; });
  const n = b.length;
  if (n % 2) return b[(n - 1) / 2];
  return (b[n / 2 - 1] + b[n / 2]) / 2;
};`,
          codes: {
            javascript: `function MedianFinder() {
  this.a = [];
}
MedianFinder.prototype.addNum = function (num) { this.a.push(num); };
MedianFinder.prototype.findMedian = function () {
  const b = this.a.slice().sort(function (x, y) { return x - y; });
  const n = b.length;
  if (n % 2) return b[(n - 1) / 2];
  return (b[n / 2 - 1] + b[n / 2]) / 2;
};`,
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
          }
        },
        {
          name: "Optimal",
          time: "O(n) add, O(1) find",
          space: "O(n)",
          why: "Keep a sorted array. Binary search the insert index, then splice. findMedian is O(1). Better than sorting everything on each query.",
          code: `function MedianFinder() {
  this.a = [];
}
MedianFinder.prototype.addNum = function (num) {
  let lo = 0, hi = this.a.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (this.a[mid] < num) lo = mid + 1;
    else hi = mid;
  }
  this.a.splice(lo, 0, num);
};
MedianFinder.prototype.findMedian = function () {
  const n = this.a.length;
  if (n % 2) return this.a[(n - 1) / 2];
  return (this.a[n / 2 - 1] + this.a[n / 2]) / 2;
};`,
          codes: {
            javascript: `function MedianFinder() {
  this.a = [];
}
MedianFinder.prototype.addNum = function (num) {
  let lo = 0, hi = this.a.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (this.a[mid] < num) lo = mid + 1;
    else hi = mid;
  }
  this.a.splice(lo, 0, num);
};
MedianFinder.prototype.findMedian = function () {
  const n = this.a.length;
  if (n % 2) return this.a[(n - 1) / 2];
  return (this.a[n / 2 - 1] + this.a[n / 2]) / 2;
};`,
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
          }
        },
        {
          name: "More optimal",
          time: "O(log n) add, O(1) find",
          space: "O(n)",
          why: "low is a max-heap (negated in a min-heap). high is a min-heap. Balance sizes. Median is low's top, or the average of both tops. True stream solution.",
          code: `function MedianFinder() {
  this.low = [];  // max-heap via negated values
  this.high = []; // min-heap of the upper half
}
MedianFinder.prototype._up = function (h, i, key) {
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (key(h[i]) >= key(h[p])) break;
    const t = h[i]; h[i] = h[p]; h[p] = t;
    i = p;
  }
};
MedianFinder.prototype._down = function (h, i, key) {
  while (true) {
    let s = i;
    const l = i * 2 + 1, r = l + 1;
    if (l < h.length && key(h[l]) < key(h[s])) s = l;
    if (r < h.length && key(h[r]) < key(h[s])) s = r;
    if (s === i) break;
    const t = h[i]; h[i] = h[s]; h[s] = t;
    i = s;
  }
};
MedianFinder.prototype._push = function (h, x, key) {
  h.push(x); this._up(h, h.length - 1, key);
};
MedianFinder.prototype._pop = function (h, key) {
  const top = h[0];
  const last = h.pop();
  if (h.length) { h[0] = last; this._down(h, 0, key); }
  return top;
};
MedianFinder.prototype.addNum = function (num) {
  const id = function (x) { return x; };
  this._push(this.low, -num, id);
  this._push(this.high, -this._pop(this.low, id), id);
  if (this.high.length > this.low.length) {
    this._push(this.low, -this._pop(this.high, id), id);
  }
};
MedianFinder.prototype.findMedian = function () {
  if (this.low.length > this.high.length) return -this.low[0];
  return (-this.low[0] + this.high[0]) / 2;
};`,
          codes: {
            javascript: `function MedianFinder() {
  this.low = [];  // max-heap via negated values
  this.high = []; // min-heap of the upper half
}
MedianFinder.prototype._up = function (h, i, key) {
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (key(h[i]) >= key(h[p])) break;
    const t = h[i]; h[i] = h[p]; h[p] = t;
    i = p;
  }
};
MedianFinder.prototype._down = function (h, i, key) {
  while (true) {
    let s = i;
    const l = i * 2 + 1, r = l + 1;
    if (l < h.length && key(h[l]) < key(h[s])) s = l;
    if (r < h.length && key(h[r]) < key(h[s])) s = r;
    if (s === i) break;
    const t = h[i]; h[i] = h[s]; h[s] = t;
    i = s;
  }
};
MedianFinder.prototype._push = function (h, x, key) {
  h.push(x); this._up(h, h.length - 1, key);
};
MedianFinder.prototype._pop = function (h, key) {
  const top = h[0];
  const last = h.pop();
  if (h.length) { h[0] = last; this._down(h, 0, key); }
  return top;
};
MedianFinder.prototype.addNum = function (num) {
  const id = function (x) { return x; };
  this._push(this.low, -num, id);
  this._push(this.high, -this._pop(this.low, id), id);
  if (this.high.length > this.low.length) {
    this._push(this.low, -this._pop(this.high, id), id);
  }
};
MedianFinder.prototype.findMedian = function () {
  if (this.low.length > this.high.length) return -this.low[0];
  return (-this.low[0] + this.high[0]) / 2;
};`,
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
          }
        }
      ]
    },
    {
      id: 13,
      level: "intermediate",
      q: "Task Scheduler",
      ask: "Amazon · Google · Uber · Meta",
      a: "tasks is a list of CPU tasks (letters). The same letter needs n idle slots between runs. Return the least time units to finish every task. One task or one idle per unit.\n\nExample: tasks [A,A,A,B,B,B], n = 2 answers 8: A B idle A B idle A B.\n\nBrute backtracks every choice. Optimal simulates with a max-heap plus a cooldown queue. More optimal is the formula (maxFreq-1)*(n+1) + howManyHaveMaxFreq, then max with tasks.length.",
      solutions: [
        {
          name: "Brute",
          time: "O(k^t)",
          space: "O(k)",
          why: "At each time slot, try every task type that still has remaining count and is off cooldown. Exponential in the number of tasks. Only for teaching.",
          code: `function leastInterval(tasks, n) {
  const count = {};
  for (let i = 0; i < tasks.length; i++) count[tasks[i]] = (count[tasks[i]] || 0) + 1;
  const types = Object.keys(count);
  let best = Infinity;
  function left() {
    let s = 0;
    for (let i = 0; i < types.length; i++) s += count[types[i]];
    return s;
  }
  function dfs(time, cool) {
    if (time >= best) return;
    if (!left()) { best = time; return; }
    let placed = false;
    for (let i = 0; i < types.length; i++) {
      const t = types[i];
      if (count[t] === 0) continue;
      if ((cool[t] || 0) > time) continue;
      placed = true;
      count[t]--;
      const old = cool[t] || 0;
      cool[t] = time + n + 1;
      dfs(time + 1, cool);
      cool[t] = old;
      count[t]++;
    }
    if (!placed) dfs(time + 1, cool);
  }
  dfs(0, {});
  return best;
}`,
          codes: {
            javascript: `function leastInterval(tasks, n) {
  const count = {};
  for (let i = 0; i < tasks.length; i++) count[tasks[i]] = (count[tasks[i]] || 0) + 1;
  const types = Object.keys(count);
  let best = Infinity;
  function left() {
    let s = 0;
    for (let i = 0; i < types.length; i++) s += count[types[i]];
    return s;
  }
  function dfs(time, cool) {
    if (time >= best) return;
    if (!left()) { best = time; return; }
    let placed = false;
    for (let i = 0; i < types.length; i++) {
      const t = types[i];
      if (count[t] === 0) continue;
      if ((cool[t] || 0) > time) continue;
      placed = true;
      count[t]--;
      const old = cool[t] || 0;
      cool[t] = time + n + 1;
      dfs(time + 1, cool);
      cool[t] = old;
      count[t]++;
    }
    if (!placed) dfs(time + 1, cool);
  }
  dfs(0, {});
  return best;
}`,
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
          }
        },
        {
          name: "Optimal",
          time: "O(t log k)",
          space: "O(k)",
          why: "Max-heap of remaining counts (26 letters). Each round pop one, then park it in a cooldown queue for n+1 time. Idle when the heap is empty but cooldown is not. k is at most 26.",
          code: `function leastInterval(tasks, n) {
  const freq = Array(26).fill(0);
  for (let i = 0; i < tasks.length; i++) freq[tasks[i].charCodeAt(0) - 65]++;
  const h = [];
  function up(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (h[i] <= h[p]) break;
      const t = h[i]; h[i] = h[p]; h[p] = t;
      i = p;
    }
  }
  function down(i) {
    while (true) {
      let s = i;
      const l = i * 2 + 1, r = l + 1;
      if (l < h.length && h[l] > h[s]) s = l;
      if (r < h.length && h[r] > h[s]) s = r;
      if (s === i) break;
      const t = h[i]; h[i] = h[s]; h[s] = t;
      i = s;
    }
  }
  function push(x) { h.push(x); up(h.length - 1); }
  function pop() {
    const top = h[0];
    const last = h.pop();
    if (h.length) { h[0] = last; down(0); }
    return top;
  }
  for (let i = 0; i < 26; i++) if (freq[i]) push(freq[i]);
  const cool = [];
  let time = 0;
  while (h.length || cool.length) {
    time++;
    if (h.length) {
      const left = pop() - 1;
      if (left) cool.push([left, time + n]);
    }
    if (cool.length && cool[0][1] === time) push(cool.shift()[0]);
  }
  return time;
}`,
          codes: {
            javascript: `function leastInterval(tasks, n) {
  const freq = Array(26).fill(0);
  for (let i = 0; i < tasks.length; i++) freq[tasks[i].charCodeAt(0) - 65]++;
  const h = [];
  function up(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (h[i] <= h[p]) break;
      const t = h[i]; h[i] = h[p]; h[p] = t;
      i = p;
    }
  }
  function down(i) {
    while (true) {
      let s = i;
      const l = i * 2 + 1, r = l + 1;
      if (l < h.length && h[l] > h[s]) s = l;
      if (r < h.length && h[r] > h[s]) s = r;
      if (s === i) break;
      const t = h[i]; h[i] = h[s]; h[s] = t;
      i = s;
    }
  }
  function push(x) { h.push(x); up(h.length - 1); }
  function pop() {
    const top = h[0];
    const last = h.pop();
    if (h.length) { h[0] = last; down(0); }
    return top;
  }
  for (let i = 0; i < 26; i++) if (freq[i]) push(freq[i]);
  const cool = [];
  let time = 0;
  while (h.length || cool.length) {
    time++;
    if (h.length) {
      const left = pop() - 1;
      if (left) cool.push([left, time + n]);
    }
    if (cool.length && cool[0][1] === time) push(cool.shift()[0]);
  }
  return time;
}`,
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
          }
        },
        {
          name: "More optimal",
          time: "O(t)",
          space: "O(1)",
          why: "The busy skeleton is (maxFreq-1) groups of (n+1) slots, plus the tasks that share maxFreq. If that is shorter than tasks.length, there is no idle and the answer is tasks.length. O(t) count, O(1) extra.",
          code: `function leastInterval(tasks, n) {
  const freq = Array(26).fill(0);
  for (let i = 0; i < tasks.length; i++) freq[tasks[i].charCodeAt(0) - 65]++;
  let maxF = 0, maxCount = 0;
  for (let i = 0; i < 26; i++) {
    if (freq[i] > maxF) { maxF = freq[i]; maxCount = 1; }
    else if (freq[i] === maxF) maxCount++;
  }
  const frame = (maxF - 1) * (n + 1) + maxCount;
  return Math.max(frame, tasks.length);
}`,
          codes: {
            javascript: `function leastInterval(tasks, n) {
  const freq = Array(26).fill(0);
  for (let i = 0; i < tasks.length; i++) freq[tasks[i].charCodeAt(0) - 65]++;
  let maxF = 0, maxCount = 0;
  for (let i = 0; i < 26; i++) {
    if (freq[i] > maxF) { maxF = freq[i]; maxCount = 1; }
    else if (freq[i] === maxF) maxCount++;
  }
  const frame = (maxF - 1) * (n + 1) + maxCount;
  return Math.max(frame, tasks.length);
}`,
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
        }
      ]
    },
    {
      id: 14,
      level: "intermediate",
      q: "Car Fleet",
      ask: "Google · Amazon · Meta · Apple",
      a: "Cars on a line drive toward target. position[i] and speed[i] describe car i. A faster car that catches a slower car ahead becomes one fleet (they cannot pass). Return how many fleets arrive.\n\nExample: target 12, position [10,8,0,5,3], speed [2,4,1,1,3] answers 3.\n\nTime to target is (target - pos) / speed. Brute nested checks. Optimal sorts by position and uses a stack of times. More optimal is a reverse scan tracking the current slowest fleet time.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(n)",
          why: "Sort by position. For each car, scan every car closer to the target. If this car's time is <= that car's time, it joins that fleet. Extra scans that a stack would skip.",
          code: `function carFleet(target, position, speed) {
  const n = position.length;
  const cars = [];
  for (let i = 0; i < n; i++) {
    cars.push({ p: position[i], t: (target - position[i]) / speed[i] });
  }
  cars.sort(function (a, b) { return b.p - a.p; });
  const used = Array(n).fill(false);
  let fleets = 0;
  for (let i = 0; i < n; i++) {
    if (used[i]) continue;
    fleets++;
    for (let j = i + 1; j < n; j++) {
      if (cars[j].t <= cars[i].t) used[j] = true;
    }
  }
  return fleets;
}`,
          codes: {
            javascript: `function carFleet(target, position, speed) {
  const n = position.length;
  const cars = [];
  for (let i = 0; i < n; i++) {
    cars.push({ p: position[i], t: (target - position[i]) / speed[i] });
  }
  cars.sort(function (a, b) { return b.p - a.p; });
  const used = Array(n).fill(false);
  let fleets = 0;
  for (let i = 0; i < n; i++) {
    if (used[i]) continue;
    fleets++;
    for (let j = i + 1; j < n; j++) {
      if (cars[j].t <= cars[i].t) used[j] = true;
    }
  }
  return fleets;
}`,
            python: `def carFleet(target, position, speed):
  n = len(position)
  cars = [{"p": position[i], "t": (target - position[i]) / speed[i]} for i in range(n)]
  cars.sort(key=lambda c: -c["p"])
  used = [False] * n
  fleets = 0
  for i in range(n):
    if used[i]: continue
    fleets += 1
    for j in range(i + 1, n):
      if cars[j]["t"] <= cars[i]["t"]:
        used[j] = True
  return fleets`,
            java: `import java.util.*;
class Solution {
  public int carFleet(int target, int[] position, int[] speed) {
    int n = position.length;
    double[][] cars = new double[n][2];
    for (int i = 0; i < n; i++) {
      cars[i][0] = position[i];
      cars[i][1] = (target - position[i]) * 1.0 / speed[i];
    }
    Arrays.sort(cars, (a, b) -> Double.compare(b[0], a[0]));
    boolean[] used = new boolean[n];
    int fleets = 0;
    for (int i = 0; i < n; i++) {
      if (used[i]) continue;
      fleets++;
      for (int j = i + 1; j < n; j++) if (cars[j][1] <= cars[i][1]) used[j] = true;
    }
    return fleets;
  }
}`,
            cpp: `class Solution {
public:
  int carFleet(int target, vector<int>& position, vector<int>& speed) {
    int n = (int)position.size();
    vector<pair<double,double>> cars(n);
    for (int i = 0; i < n; i++) cars[i] = { (double)position[i], (target - position[i]) * 1.0 / speed[i] };
    sort(cars.begin(), cars.end(), [](auto& a, auto& b){ return a.first > b.first; });
    vector<int> used(n, 0);
    int fleets = 0;
    for (int i = 0; i < n; i++) {
      if (used[i]) continue;
      fleets++;
      for (int j = i + 1; j < n; j++) if (cars[j].second <= cars[i].second) used[j] = 1;
    }
    return fleets;
  }
};`,
            c: `#include <stdlib.h>
typedef struct { double p, t; } Car;
int cmp_p_desc(const void* a, const void* b) {
  double d = ((const Car*)b)->p - ((const Car*)a)->p;
  return d > 0 ? 1 : d < 0 ? -1 : 0;
}
int carFleet(int target, int* position, int n, int* speed) {
  Car* cars = (Car*)malloc(sizeof(Car)*n);
  for (int i = 0; i < n; i++) { cars[i].p = position[i]; cars[i].t = (target - position[i]) * 1.0 / speed[i]; }
  qsort(cars, n, sizeof(Car), cmp_p_desc);
  int* used = (int*)calloc(n, sizeof(int));
  int fleets = 0;
  for (int i = 0; i < n; i++) {
    if (used[i]) continue;
    fleets++;
    for (int j = i + 1; j < n; j++) if (cars[j].t <= cars[i].t) used[j] = 1;
  }
  free(cars); free(used);
  return fleets;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n log n)",
          space: "O(n)",
          why: "Sort cars from closest to target backward. Push time onto a stack if it is strictly slower than the fleet ahead (it cannot catch). Stack length is the fleet count. Sort dominates.",
          code: `function carFleet(target, position, speed) {
  const n = position.length;
  const cars = [];
  for (let i = 0; i < n; i++) cars.push([position[i], speed[i]]);
  cars.sort(function (a, b) { return a[0] - b[0]; });
  const st = [];
  for (let i = n - 1; i >= 0; i--) {
    const time = (target - cars[i][0]) / cars[i][1];
    if (!st.length || time > st[st.length - 1]) st.push(time);
  }
  return st.length;
}`,
          codes: {
            javascript: `function carFleet(target, position, speed) {
  const n = position.length;
  const cars = [];
  for (let i = 0; i < n; i++) cars.push([position[i], speed[i]]);
  cars.sort(function (a, b) { return a[0] - b[0]; });
  const st = [];
  for (let i = n - 1; i >= 0; i--) {
    const time = (target - cars[i][0]) / cars[i][1];
    if (!st.length || time > st[st.length - 1]) st.push(time);
  }
  return st.length;
}`,
            python: `def carFleet(target, position, speed):
  n = len(position)
  cars = [[position[i], speed[i]] for i in range(n)]
  cars.sort(key=lambda c: c[0])
  st = []
  for i in range(n - 1, -1, -1):
    time = (target - cars[i][0]) / cars[i][1]
    if not st or time > st[-1]:
      st.append(time)
  return len(st)`,
            java: `import java.util.*;
class Solution {
  public int carFleet(int target, int[] position, int[] speed) {
    int n = position.length;
    int[][] cars = new int[n][2];
    for (int i = 0; i < n; i++) { cars[i][0] = position[i]; cars[i][1] = speed[i]; }
    Arrays.sort(cars, (a, b) -> a[0] - b[0]);
    ArrayDeque<Double> st = new ArrayDeque<Double>();
    for (int i = n - 1; i >= 0; i--) {
      double time = (target - cars[i][0]) * 1.0 / cars[i][1];
      if (st.isEmpty() || time > st.peek()) st.push(time);
    }
    return st.size();
  }
}`,
            cpp: `class Solution {
public:
  int carFleet(int target, vector<int>& position, vector<int>& speed) {
    int n = (int)position.size();
    vector<pair<int,int>> cars(n);
    for (int i = 0; i < n; i++) cars[i] = {position[i], speed[i]};
    sort(cars.begin(), cars.end());
    vector<double> st;
    for (int i = n - 1; i >= 0; i--) {
      double time = (target - cars[i].first) * 1.0 / cars[i].second;
      if (st.empty() || time > st.back()) st.push_back(time);
    }
    return (int)st.size();
  }
};`,
            c: `#include <stdlib.h>
typedef struct { int p, s; } Car;
int cmp_p_asc(const void* a, const void* b) { return ((const Car*)a)->p - ((const Car*)b)->p; }
int carFleet(int target, int* position, int n, int* speed) {
  Car* cars = (Car*)malloc(sizeof(Car)*n);
  for (int i = 0; i < n; i++) { cars[i].p = position[i]; cars[i].s = speed[i]; }
  qsort(cars, n, sizeof(Car), cmp_p_asc);
  double* st = (double*)malloc(sizeof(double)*n);
  int sn = 0;
  for (int i = n - 1; i >= 0; i--) {
    double time = (target - cars[i].p) * 1.0 / cars[i].s;
    if (!sn || time > st[sn-1]) st[sn++] = time;
  }
  free(cars); free(st);
  return sn;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n log n)",
          space: "O(n)",
          why: "Same sort, no stack. Walk from the target backward and count a new fleet whenever time > currentMaxTime. Extra space is the cars array only. Sort is still the bottleneck.",
          code: `function carFleet(target, position, speed) {
  const n = position.length;
  const cars = [];
  for (let i = 0; i < n; i++) {
    cars.push({ p: position[i], t: (target - position[i]) / speed[i] });
  }
  cars.sort(function (a, b) { return a.p - b.p; });
  let fleets = 0;
  let cur = 0;
  for (let i = n - 1; i >= 0; i--) {
    if (cars[i].t > cur) {
      fleets++;
      cur = cars[i].t;
    }
  }
  return fleets;
}`,
          codes: {
            javascript: `function carFleet(target, position, speed) {
  const n = position.length;
  const cars = [];
  for (let i = 0; i < n; i++) {
    cars.push({ p: position[i], t: (target - position[i]) / speed[i] });
  }
  cars.sort(function (a, b) { return a.p - b.p; });
  let fleets = 0;
  let cur = 0;
  for (let i = n - 1; i >= 0; i--) {
    if (cars[i].t > cur) {
      fleets++;
      cur = cars[i].t;
    }
  }
  return fleets;
}`,
            python: `def carFleet(target, position, speed):
  n = len(position)
  cars = [{"p": position[i], "t": (target - position[i]) / speed[i]} for i in range(n)]
  cars.sort(key=lambda c: c["p"])
  fleets = 0
  cur = 0
  for i in range(n - 1, -1, -1):
    if cars[i]["t"] > cur:
      fleets += 1
      cur = cars[i]["t"]
  return fleets`,
            java: `import java.util.*;
class Solution {
  public int carFleet(int target, int[] position, int[] speed) {
    int n = position.length;
    double[][] cars = new double[n][2];
    for (int i = 0; i < n; i++) {
      cars[i][0] = position[i];
      cars[i][1] = (target - position[i]) * 1.0 / speed[i];
    }
    Arrays.sort(cars, (a, b) -> Double.compare(a[0], b[0]));
    int fleets = 0;
    double cur = 0;
    for (int i = n - 1; i >= 0; i--) {
      if (cars[i][1] > cur) { fleets++; cur = cars[i][1]; }
    }
    return fleets;
  }
}`,
            cpp: `class Solution {
public:
  int carFleet(int target, vector<int>& position, vector<int>& speed) {
    int n = (int)position.size();
    vector<pair<double,double>> cars(n);
    for (int i = 0; i < n; i++) cars[i] = { (double)position[i], (target - position[i]) * 1.0 / speed[i] };
    sort(cars.begin(), cars.end());
    int fleets = 0;
    double cur = 0;
    for (int i = n - 1; i >= 0; i--) {
      if (cars[i].second > cur) { fleets++; cur = cars[i].second; }
    }
    return fleets;
  }
};`,
            c: `#include <stdlib.h>
typedef struct { double p, t; } Car;
int cmp_p_asc2(const void* a, const void* b) {
  double d = ((const Car*)a)->p - ((const Car*)b)->p;
  return d > 0 ? 1 : d < 0 ? -1 : 0;
}
int carFleet(int target, int* position, int n, int* speed) {
  Car* cars = (Car*)malloc(sizeof(Car)*n);
  for (int i = 0; i < n; i++) { cars[i].p = position[i]; cars[i].t = (target - position[i]) * 1.0 / speed[i]; }
  qsort(cars, n, sizeof(Car), cmp_p_asc2);
  int fleets = 0;
  double cur = 0;
  for (int i = n - 1; i >= 0; i--) {
    if (cars[i].t > cur) { fleets++; cur = cars[i].t; }
  }
  free(cars);
  return fleets;
}`
          }
        }
      ]
    },
    {
      id: 15,
      level: "intermediate",
      q: "Decode String",
      ask: "Amazon · Google · Meta · Bloomberg",
      a: "s encodes nested repeats: k[encoded]. Digits before [ are the repeat count. Return the decoded string. Counts fit in an int. Letters are lowercase.\n\nExample: 3[a2[c]] becomes accaccacc. 2[abc]3[cd]ef becomes abcabccdcdcdef.\n\nBrute recurses and copies leftover slices. Optimal one stack of [prefix, count] frames. More optimal two stacks (counts and strings) if that is easier to say out loud.",
      solutions: [
        {
          name: "Brute",
          time: "O(n · out)",
          space: "O(n · out)",
          why: "Recursion: parse a chunk, and when you see k[...], slice the inner substring, decode it, repeat. Extra string copies of the remaining suffix. Correct, messy bounds.",
          code: `function decodeString(s) {
  function parse(i) {
    let out = "";
    while (i < s.length && s[i] !== "]") {
      if (s[i] < "0" || s[i] > "9") {
        out += s[i];
        i++;
        continue;
      }
      let k = 0;
      while (s[i] >= "0" && s[i] <= "9") {
        k = k * 10 + Number(s[i]);
        i++;
      }
      i++; // skip '['
      const inner = parse(i);
      out += inner.text.repeat(k);
      i = inner.i + 1; // skip ']'
    }
    return { text: out, i: i };
  }
  return parse(0).text;
}`,
          codes: {
            javascript: `function decodeString(s) {
  function parse(i) {
    let out = "";
    while (i < s.length && s[i] !== "]") {
      if (s[i] < "0" || s[i] > "9") {
        out += s[i];
        i++;
        continue;
      }
      let k = 0;
      while (s[i] >= "0" && s[i] <= "9") {
        k = k * 10 + Number(s[i]);
        i++;
      }
      i++; // skip '['
      const inner = parse(i);
      out += inner.text.repeat(k);
      i = inner.i + 1; // skip ']'
    }
    return { text: out, i: i };
  }
  return parse(0).text;
}`,
            python: `def decodeString(s):
  def parse(i):
    out = ""
    while i < len(s) and s[i] != "]":
      if s[i] < "0" or s[i] > "9":
        out += s[i]
        i += 1
        continue
      k = 0
      while s[i] >= "0" and s[i] <= "9":
        k = k * 10 + int(s[i])
        i += 1
      i += 1  # skip '['
      inner = parse(i)
      out += inner["text"] * k
      i = inner["i"] + 1  # skip ']'
    return {"text": out, "i": i}
  return parse(0)["text"]`,
            java: `class Solution {
  static class Pair { String text; int i; Pair(String t, int i) { text = t; this.i = i; } }
  Pair parse(String s, int i) {
    StringBuilder out = new StringBuilder();
    while (i < s.length() && s.charAt(i) != ']') {
      if (s.charAt(i) < '0' || s.charAt(i) > '9') {
        out.append(s.charAt(i)); i++; continue;
      }
      int k = 0;
      while (s.charAt(i) >= '0' && s.charAt(i) <= '9') { k = k * 10 + (s.charAt(i) - '0'); i++; }
      i++; // skip '['
      Pair inner = parse(s, i);
      for (int t = 0; t < k; t++) out.append(inner.text);
      i = inner.i + 1; // skip ']'
    }
    return new Pair(out.toString(), i);
  }
  public String decodeString(String s) { return parse(s, 0).text; }
}`,
            cpp: `class Solution {
  pair<string,int> parse(const string& s, int i) {
    string out;
    while (i < (int)s.size() && s[i] != ']') {
      if (s[i] < '0' || s[i] > '9') { out += s[i]; i++; continue; }
      int k = 0;
      while (s[i] >= '0' && s[i] <= '9') { k = k * 10 + (s[i] - '0'); i++; }
      i++; // skip '['
      auto inner = parse(s, i);
      for (int t = 0; t < k; t++) out += inner.first;
      i = inner.second + 1; // skip ']'
    }
    return {out, i};
  }
public:
  string decodeString(string s) { return parse(s, 0).first; }
};`,
            c: `#include <stdlib.h>
#include <string.h>
typedef struct { char* text; int i; } Pair;
Pair parse(const char* s, int i) {
  int cap = 32, n = 0;
  char* out = (char*)malloc(cap); out[0] = 0;
  while (s[i] && s[i] != ']') {
    if (s[i] < '0' || s[i] > '9') {
      if (n + 2 > cap) { cap *= 2; out = (char*)realloc(out, cap); }
      out[n++] = s[i]; out[n] = 0; i++; continue;
    }
    int k = 0;
    while (s[i] >= '0' && s[i] <= '9') { k = k * 10 + (s[i] - '0'); i++; }
    i++; /* skip '[' */
    Pair inner = parse(s, i);
    int inlen = (int)strlen(inner.text);
    for (int t = 0; t < k; t++) {
      if (n + inlen + 1 > cap) { cap = (n + inlen + 1) * 2; out = (char*)realloc(out, cap); }
      memcpy(out + n, inner.text, inlen); n += inlen; out[n] = 0;
    }
    i = inner.i + 1; /* skip ']' */
    free(inner.text);
  }
  Pair p; p.text = out; p.i = i; return p;
}
char* decodeString(const char* s) { return parse(s, 0).text; }`
          }
        },
        {
          name: "Optimal",
          time: "O(n + out)",
          space: "O(n + out)",
          why: "One stack. Digits build k. '[' pushes the current string and k, then resets. Letters append. ']' pops and repeats. Linear in input plus output size.",
          code: `function decodeString(s) {
  const st = [];
  let cur = "";
  let k = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch >= "0" && ch <= "9") k = k * 10 + Number(ch);
    else if (ch === "[") {
      st.push([cur, k]);
      cur = "";
      k = 0;
    } else if (ch === "]") {
      const frame = st.pop();
      cur = frame[0] + cur.repeat(frame[1]);
    } else cur += ch;
  }
  return cur;
}`,
          codes: {
            javascript: `function decodeString(s) {
  const st = [];
  let cur = "";
  let k = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch >= "0" && ch <= "9") k = k * 10 + Number(ch);
    else if (ch === "[") {
      st.push([cur, k]);
      cur = "";
      k = 0;
    } else if (ch === "]") {
      const frame = st.pop();
      cur = frame[0] + cur.repeat(frame[1]);
    } else cur += ch;
  }
  return cur;
}`,
            python: `def decodeString(s):
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
  public String decodeString(String s) {
    ArrayDeque<String> strs = new ArrayDeque<String>();
    ArrayDeque<Integer> ks = new ArrayDeque<Integer>();
    StringBuilder cur = new StringBuilder();
    int k = 0;
    for (int i = 0; i < s.length(); i++) {
      char ch = s.charAt(i);
      if (ch >= '0' && ch <= '9') k = k * 10 + (ch - '0');
      else if (ch == '[') {
        strs.push(cur.toString()); ks.push(k);
        cur = new StringBuilder(); k = 0;
      } else if (ch == ']') {
        String prev = strs.pop(); int ck = ks.pop();
        StringBuilder next = new StringBuilder(prev);
        for (int t = 0; t < ck; t++) next.append(cur);
        cur = next;
      } else cur.append(ch);
    }
    return cur.toString();
  }
}`,
            cpp: `class Solution {
public:
  string decodeString(string s) {
    vector<pair<string,int>> st;
    string cur; int k = 0;
    for (char ch : s) {
      if (ch >= '0' && ch <= '9') k = k * 10 + (ch - '0');
      else if (ch == '[') { st.push_back({cur, k}); cur = ""; k = 0; }
      else if (ch == ']') {
        auto frame = st.back(); st.pop_back();
        string next = frame.first;
        for (int t = 0; t < frame.second; t++) next += cur;
        cur = next;
      } else cur += ch;
    }
    return cur;
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
char* decodeString(const char* s) {
  char* prevs[128]; int ks[128], sn = 0;
  int cap = 64, n = 0;
  char* cur = (char*)malloc(cap); cur[0] = 0;
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
      cur[cn] = ch; cur[cn+1] = 0;
    }
  }
  return cur;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n + out)",
          space: "O(n + out)",
          why: "Two stacks: counts and strings. Same linear bound. Some interviewers prefer two named stacks over pairs. Repeat still dominates the output cost.",
          code: `function decodeString(s) {
  const counts = [];
  const strs = [];
  let cur = "";
  let k = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch >= "0" && ch <= "9") k = k * 10 + Number(ch);
    else if (ch === "[") {
      counts.push(k);
      strs.push(cur);
      cur = "";
      k = 0;
    } else if (ch === "]") {
      cur = strs.pop() + cur.repeat(counts.pop());
    } else cur += ch;
  }
  return cur;
}`,
          codes: {
            javascript: `function decodeString(s) {
  const counts = [];
  const strs = [];
  let cur = "";
  let k = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch >= "0" && ch <= "9") k = k * 10 + Number(ch);
    else if (ch === "[") {
      counts.push(k);
      strs.push(cur);
      cur = "";
      k = 0;
    } else if (ch === "]") {
      cur = strs.pop() + cur.repeat(counts.pop());
    } else cur += ch;
  }
  return cur;
}`,
            python: `def decodeString(s):
  counts = []
  strs = []
  cur = ""
  k = 0
  for ch in s:
    if "0" <= ch <= "9":
      k = k * 10 + ord(ch) - 48
    elif ch == "[":
      counts.append(k)
      strs.append(cur)
      cur = ""
      k = 0
    elif ch == "]":
      cur = strs.pop() + cur * counts.pop()
    else:
      cur += ch
  return cur`,
            java: `import java.util.*;
class Solution {
  public String decodeString(String s) {
    ArrayDeque<Integer> counts = new ArrayDeque<Integer>();
    ArrayDeque<String> strs = new ArrayDeque<String>();
    StringBuilder cur = new StringBuilder();
    int k = 0;
    for (int i = 0; i < s.length(); i++) {
      char ch = s.charAt(i);
      if (ch >= '0' && ch <= '9') k = k * 10 + (ch - '0');
      else if (ch == '[') {
        counts.push(k); strs.push(cur.toString());
        cur = new StringBuilder(); k = 0;
      } else if (ch == ']') {
        StringBuilder next = new StringBuilder(strs.pop());
        int ck = counts.pop();
        for (int t = 0; t < ck; t++) next.append(cur);
        cur = next;
      } else cur.append(ch);
    }
    return cur.toString();
  }
}`,
            cpp: `class Solution {
public:
  string decodeString(string s) {
    vector<int> counts;
    vector<string> strs;
    string cur; int k = 0;
    for (char ch : s) {
      if (ch >= '0' && ch <= '9') k = k * 10 + (ch - '0');
      else if (ch == '[') { counts.push_back(k); strs.push_back(cur); cur = ""; k = 0; }
      else if (ch == ']') {
        int ck = counts.back(); counts.pop_back();
        string prev = strs.back(); strs.pop_back();
        for (int t = 0; t < ck; t++) prev += cur;
        cur = prev;
      } else cur += ch;
    }
    return cur;
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
char* decodeString(const char* s) {
  char* strs[128]; int counts[128], sn = 0, cn = 0;
  int cap = 64;
  char* cur = (char*)malloc(cap); cur[0] = 0;
  int k = 0;
  for (int i = 0; s[i]; i++) {
    char ch = s[i];
    if (ch >= '0' && ch <= '9') k = k * 10 + (ch - '0');
    else if (ch == '[') {
      counts[cn++] = k; strs[sn++] = cur;
      cap = 64; cur = (char*)malloc(cap); cur[0] = 0; k = 0;
    } else if (ch == ']') {
      int ck = counts[--cn];
      char* prev = strs[--sn];
      int pn = (int)strlen(prev), cl = (int)strlen(cur);
      char* next = (char*)malloc(pn + cl * ck + 1);
      memcpy(next, prev, pn);
      for (int t = 0; t < ck; t++) memcpy(next + pn + t * cl, cur, cl);
      next[pn + cl * ck] = 0;
      free(prev); free(cur); cur = next;
    } else {
      int cl = (int)strlen(cur);
      cur = (char*)realloc(cur, cl + 2);
      cur[cl] = ch; cur[cl+1] = 0;
    }
  }
  return cur;
}`
          }
        }
      ]
    }
  ]
};
