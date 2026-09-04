module.exports = [
  // 21 histogram brute
  {
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
  },
  // 22 histogram two stacks
  {
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
  },
  // 23 histogram sentinel
  {
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
  },
  // 24 sliding window brute
  {
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
  },
  // 25 sliding window heap
  {
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
  },
  // 26 sliding window deque
  {
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
  },
  // 27 MyQueue brute
  {
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
  },
  // 28 MyQueue two stacks
  {
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
  },
  // 29 MyQueue peek then pop
  {
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
];
