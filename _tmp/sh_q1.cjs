module.exports = [
  // 9 MinStack brute
  {
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
  },
  // 10 MinStack optimal two stacks
  {
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
  },
  // 11 MinStack pairs
  {
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
  },
  // 12 daily temperatures brute
  {
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
  },
  // 13 daily temperatures stack
  {
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
  },
  // 14 daily temperatures jump
  {
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
  },
  // 15 next greater I brute
  {
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
  },
  // 16 next greater I hash+scan
  {
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
  },
  // 17 next greater I monotonic
  {
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
  },
  // 18 evalRPN brute
  {
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
  },
  // 19 evalRPN stack
  {
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
  },
  // 20 evalRPN apply helper
  {
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
];
