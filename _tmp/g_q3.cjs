module.exports = [
  // 18 course II brute permute
  {
    python: `def findOrder(numCourses, prerequisites):
  edges = prerequisites
  def ok(order):
    pos = [0] * numCourses
    for i, x in enumerate(order): pos[x] = i
    for a, b in edges:
      if pos[b] > pos[a]: return False
    return True
  used = [False] * numCourses
  path = []
  ans = None
  def dfs():
    nonlocal ans
    if ans is not None: return
    if len(path) == numCourses:
      if ok(path): ans = path[:]
      return
    for i in range(numCourses):
      if used[i]: continue
      used[i] = True
      path.append(i)
      dfs()
      path.pop()
      used[i] = False
  dfs()
  return ans or []`,
    java: `import java.util.*;
class Solution {
  int[] ans;
  boolean ok(int[] order, int[][] edges, int n) {
    int[] pos = new int[n];
    for (int i = 0; i < order.length; i++) pos[order[i]] = i;
    for (int[] e : edges) if (pos[e[1]] > pos[e[0]]) return false;
    return true;
  }
  void dfs(int n, int[][] edges, boolean[] used, ArrayList<Integer> path) {
    if (ans != null) return;
    if (path.size() == n) {
      int[] o = new int[n];
      for (int i = 0; i < n; i++) o[i] = path.get(i);
      if (ok(o, edges, n)) ans = o;
      return;
    }
    for (int i = 0; i < n; i++) {
      if (used[i]) continue;
      used[i] = true; path.add(i); dfs(n, edges, used, path);
      path.remove(path.size()-1); used[i] = false;
    }
  }
  public int[] findOrder(int numCourses, int[][] prerequisites) {
    ans = null;
    dfs(numCourses, prerequisites, new boolean[numCourses], new ArrayList<Integer>());
    return ans != null ? ans : new int[0];
  }
}`,
    cpp: `class Solution {
  vector<int> ans;
  bool found;
  bool ok(vector<int>& order, vector<vector<int>>& edges, int n) {
    vector<int> pos(n);
    for (int i = 0; i < n; i++) pos[order[i]] = i;
    for (auto& e : edges) if (pos[e[1]] > pos[e[0]]) return false;
    return true;
  }
  void dfs(int n, vector<vector<int>>& edges, vector<int>& used, vector<int>& path) {
    if (found) return;
    if ((int)path.size() == n) { if (ok(path, edges, n)) { ans = path; found = true; } return; }
    for (int i = 0; i < n; i++) {
      if (used[i]) continue;
      used[i]=1; path.push_back(i); dfs(n, edges, used, path);
      path.pop_back(); used[i]=0;
    }
  }
public:
  vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    found = false; ans.clear();
    vector<int> used(numCourses), path;
    dfs(numCourses, prerequisites, used, path);
    return found ? ans : vector<int>{};
  }
};`,
    c: `#include <stdlib.h>
int ok_ord(int* order, int n, int** edges, int e) {
  int* pos = (int*)malloc(sizeof(int)*n);
  for (int i = 0; i < n; i++) pos[order[i]] = i;
  int good = 1;
  for (int i = 0; i < e; i++) if (pos[edges[i][1]] > pos[edges[i][0]]) good = 0;
  free(pos);
  return good;
}
int* ans_g; int found_g;
void dfs_fo(int n, int** edges, int e, int* used, int* path, int plen) {
  if (found_g) return;
  if (plen == n) {
    if (ok_ord(path, n, edges, e)) { for (int i=0;i<n;i++) ans_g[i]=path[i]; found_g=1; }
    return;
  }
  for (int i = 0; i < n; i++) {
    if (used[i]) continue;
    used[i]=1; path[plen]=i; dfs_fo(n, edges, e, used, path, plen+1);
    used[i]=0;
  }
}
int* findOrder(int numCourses, int** prerequisites, int e, int* returnSize) {
  ans_g = (int*)malloc(sizeof(int)*numCourses); found_g = 0;
  int* used = (int*)calloc(numCourses, sizeof(int));
  int* path = (int*)malloc(sizeof(int)*numCourses);
  dfs_fo(numCourses, prerequisites, e, used, path, 0);
  *returnSize = found_g ? numCourses : 0;
  return ans_g;
}`
  },
  // 19 course II dfs topo
  {
    python: `def findOrder(numCourses, prerequisites):
  g = [[] for _ in range(numCourses)]
  for a, b in prerequisites:
    g[b].append(a)
  state = [0] * numCourses
  out = []
  cycle = False
  def dfs(u):
    nonlocal cycle
    if state[u] == 1: cycle = True; return
    if state[u] == 2: return
    state[u] = 1
    for v in g[u]: dfs(v)
    state[u] = 2
    out.append(u)
  for i in range(numCourses): dfs(i)
  if cycle: return []
  out.reverse()
  return out`,
    java: `import java.util.*;
class Solution {
  boolean cycle;
  void dfs(List<List<Integer>> g, int u, int[] state, List<Integer> out) {
    if (state[u] == 1) { cycle = true; return; }
    if (state[u] == 2) return;
    state[u] = 1;
    for (int v : g.get(u)) dfs(g, v, state, out);
    state[u] = 2;
    out.add(u);
  }
  public int[] findOrder(int numCourses, int[][] prerequisites) {
    List<List<Integer>> g = new ArrayList<List<Integer>>();
    for (int i = 0; i < numCourses; i++) g.add(new ArrayList<Integer>());
    for (int[] e : prerequisites) g.get(e[1]).add(e[0]);
    int[] state = new int[numCourses];
    List<Integer> out = new ArrayList<Integer>();
    cycle = false;
    for (int i = 0; i < numCourses; i++) dfs(g, i, state, out);
    if (cycle) return new int[0];
    Collections.reverse(out);
    int[] a = new int[numCourses];
    for (int i = 0; i < numCourses; i++) a[i] = out.get(i);
    return a;
  }
}`,
    cpp: `class Solution {
  bool cycle;
  void dfs(vector<vector<int>>& g, int u, vector<int>& state, vector<int>& out) {
    if (state[u] == 1) { cycle = true; return; }
    if (state[u] == 2) return;
    state[u] = 1;
    for (int v : g[u]) dfs(g, v, state, out);
    state[u] = 2;
    out.push_back(u);
  }
public:
  vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> g(numCourses);
    for (auto& e : prerequisites) g[e[1]].push_back(e[0]);
    vector<int> state(numCourses), out;
    cycle = false;
    for (int i = 0; i < numCourses; i++) dfs(g, i, state, out);
    if (cycle) return {};
    reverse(out.begin(), out.end());
    return out;
  }
};`,
    c: `#include <stdlib.h>
int cycle_g;
void dfs_fo2(int** g, int* deg, int u, int* state, int* out, int* on) {
  if (state[u] == 1) { cycle_g = 1; return; }
  if (state[u] == 2) return;
  state[u] = 1;
  for (int i = 0; i < deg[u]; i++) dfs_fo2(g, deg, g[u][i], state, out, on);
  state[u] = 2;
  out[(*on)++] = u;
}
int* findOrder(int numCourses, int** prerequisites, int e, int* returnSize) {
  int* deg = (int*)calloc(numCourses, sizeof(int));
  for (int i = 0; i < e; i++) deg[prerequisites[i][1]]++;
  int** g = (int**)malloc(sizeof(int*)*numCourses);
  for (int i = 0; i < numCourses; i++) { g[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); deg[i]=0; }
  for (int i = 0; i < e; i++) g[prerequisites[i][1]][deg[prerequisites[i][1]]++] = prerequisites[i][0];
  int* state = (int*)calloc(numCourses, sizeof(int));
  int* out = (int*)malloc(sizeof(int)*numCourses); int on = 0;
  cycle_g = 0;
  for (int i = 0; i < numCourses; i++) dfs_fo2(g, deg, i, state, out, &on);
  if (cycle_g) { *returnSize = 0; return out; }
  for (int i = 0; i < on/2; i++) { int t=out[i]; out[i]=out[on-1-i]; out[on-1-i]=t; }
  *returnSize = numCourses;
  return out;
}`
  },
  // 20 course II kahn
  {
    python: `from collections import deque
def findOrder(numCourses, prerequisites):
  g = [[] for _ in range(numCourses)]
  indeg = [0] * numCourses
  for a, b in prerequisites:
    g[b].append(a); indeg[a] += 1
  q = deque([i for i in range(numCourses) if indeg[i] == 0])
  order = []
  while q:
    u = q.popleft(); order.append(u)
    for v in g[u]:
      indeg[v] -= 1
      if indeg[v] == 0: q.append(v)
  return order if len(order) == numCourses else []`,
    java: `import java.util.*;
class Solution {
  public int[] findOrder(int numCourses, int[][] prerequisites) {
    List<List<Integer>> g = new ArrayList<List<Integer>>();
    int[] indeg = new int[numCourses];
    for (int i = 0; i < numCourses; i++) g.add(new ArrayList<Integer>());
    for (int[] e : prerequisites) { g.get(e[1]).add(e[0]); indeg[e[0]]++; }
    ArrayDeque<Integer> q = new ArrayDeque<Integer>();
    for (int i = 0; i < numCourses; i++) if (indeg[i] == 0) q.addLast(i);
    int[] order = new int[numCourses]; int p = 0;
    while (!q.isEmpty()) {
      int u = q.pollFirst(); order[p++] = u;
      for (int v : g.get(u)) { indeg[v]--; if (indeg[v] == 0) q.addLast(v); }
    }
    return p == numCourses ? order : new int[0];
  }
}`,
    cpp: `class Solution {
public:
  vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> g(numCourses);
    vector<int> indeg(numCourses), order;
    for (auto& e : prerequisites) { g[e[1]].push_back(e[0]); indeg[e[0]]++; }
    queue<int> q;
    for (int i = 0; i < numCourses; i++) if (indeg[i] == 0) q.push(i);
    while (!q.empty()) {
      int u = q.front(); q.pop(); order.push_back(u);
      for (int v : g[u]) { indeg[v]--; if (indeg[v] == 0) q.push(v); }
    }
    return (int)order.size() == numCourses ? order : vector<int>{};
  }
};`,
    c: `#include <stdlib.h>
int* findOrder(int numCourses, int** prerequisites, int e, int* returnSize) {
  int* deg = (int*)calloc(numCourses, sizeof(int));
  int* indeg = (int*)calloc(numCourses, sizeof(int));
  for (int i = 0; i < e; i++) deg[prerequisites[i][1]]++;
  int** g = (int**)malloc(sizeof(int*)*numCourses);
  for (int i = 0; i < numCourses; i++) { g[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); deg[i]=0; }
  for (int i = 0; i < e; i++) { g[prerequisites[i][1]][deg[prerequisites[i][1]]++] = prerequisites[i][0]; indeg[prerequisites[i][0]]++; }
  int* q = (int*)malloc(sizeof(int)*numCourses); int h=0,t=0;
  for (int i = 0; i < numCourses; i++) if (!indeg[i]) q[t++]=i;
  int* order = (int*)malloc(sizeof(int)*numCourses); int p=0;
  while (h<t) {
    int u=q[h++]; order[p++]=u;
    for (int i=0;i<deg[u];i++) { int v=g[u][i]; indeg[v]--; if (!indeg[v]) q[t++]=v; }
  }
  *returnSize = (p==numCourses) ? numCourses : 0;
  return order;
}`
  }
];
