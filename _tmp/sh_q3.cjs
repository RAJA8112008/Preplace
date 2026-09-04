module.exports = [
  // 30 MyStack brute two queues
  {
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
  },
  // 31 MyStack rotate on push
  {
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
  },
  // 32 MyStack rotate on pop
  {
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
  },
  // 33 kth largest brute
  {
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
  },
  // 34 kth largest sort
  {
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
  },
  // 35 kth largest min-heap size k
  {
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
];
