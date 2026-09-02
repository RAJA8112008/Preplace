module.exports = [
  // 0 adj list
  {
    python: `def adjList(n, edges):
  g = [[] for _ in range(n)]
  for u, v in edges:
    g[u].append(v)
    g[v].append(u)  # undirected
  return g

g = adjList(4, [[0, 1], [0, 2], [1, 3]])
print(g[0])  # [1, 2]`,
    java: `import java.util.*;
class Solution {
  public List<List<Integer>> adjList(int n, int[][] edges) {
    List<List<Integer>> g = new ArrayList<List<Integer>>();
    for (int i = 0; i < n; i++) g.add(new ArrayList<Integer>());
    for (int[] e : edges) {
      g.get(e[0]).add(e[1]);
      g.get(e[1]).add(e[0]); // undirected
    }
    return g;
  }
}`,
    cpp: `#include <bits/stdc++.h>
using namespace std;
vector<vector<int>> adjList(int n, vector<vector<int>>& edges) {
  vector<vector<int>> g(n);
  for (auto& e : edges) {
    g[e[0]].push_back(e[1]);
    g[e[1]].push_back(e[0]); // undirected
  }
  return g;
}`,
    c: `#include <stdio.h>
#include <stdlib.h>
/* g[u][0..deg[u]-1] neighbors; n nodes */
int** adjList(int n, int edges[][2], int e, int** degOut) {
  int* deg = (int*)calloc(n, sizeof(int));
  int** g = (int**)malloc(sizeof(int*) * n);
  for (int i = 0; i < e; i++) { deg[edges[i][0]]++; deg[edges[i][1]]++; }
  for (int i = 0; i < n; i++) { g[i] = (int*)malloc(sizeof(int) * (deg[i] ? deg[i] : 1)); deg[i] = 0; }
  for (int i = 0; i < e; i++) {
    int u = edges[i][0], v = edges[i][1];
    g[u][deg[u]++] = v;
    g[v][deg[v]++] = u; /* undirected */
  }
  *degOut = deg;
  return g;
}`
  },
  // 1 dfs walk
  {
    python: `def dfsWalk(g, start):
  seen = [False] * len(g)
  order = []
  def dfs(u):
    seen[u] = True
    order.append(u)
    for v in g[u]:
      if not seen[v]:
        dfs(v)
  dfs(start)
  return order`,
    java: `import java.util.*;
class Solution {
  void dfs(List<List<Integer>> g, int u, boolean[] seen, List<Integer> order) {
    seen[u] = true;
    order.add(u);
    for (int v : g.get(u)) if (!seen[v]) dfs(g, v, seen, order);
  }
  public List<Integer> dfsWalk(List<List<Integer>> g, int start) {
    boolean[] seen = new boolean[g.size()];
    List<Integer> order = new ArrayList<Integer>();
    dfs(g, start, seen, order);
    return order;
  }
}`,
    cpp: `void dfs(vector<vector<int>>& g, int u, vector<int>& seen, vector<int>& order) {
  seen[u] = 1; order.push_back(u);
  for (int v : g[u]) if (!seen[v]) dfs(g, v, seen, order);
}
vector<int> dfsWalk(vector<vector<int>>& g, int start) {
  vector<int> seen(g.size()), order;
  dfs(g, start, seen, order);
  return order;
}`,
    c: `/* g[u][0..deg[u]-1], n nodes. DFS order from start. */
void dfs(int** g, int* deg, int u, int* seen, int* order, int* on) {
  seen[u] = 1; order[(*on)++] = u;
  for (int i = 0; i < deg[u]; i++) if (!seen[g[u][i]]) dfs(g, deg, g[u][i], seen, order, on);
}
int dfsWalk(int** g, int* deg, int n, int start, int* order) {
  int* seen = (int*)calloc(n, sizeof(int));
  int on = 0;
  dfs(g, deg, start, seen, order, &on);
  free(seen);
  return on;
}`
  },
  // 2 bfs walk
  {
    python: `from collections import deque
def bfsWalk(g, start):
  seen = [False] * len(g)
  q = deque([start])
  seen[start] = True
  order = []
  while q:
    u = q.popleft()
    order.append(u)
    for v in g[u]:
      if seen[v]: continue
      seen[v] = True
      q.append(v)
  return order`,
    java: `import java.util.*;
class Solution {
  public List<Integer> bfsWalk(List<List<Integer>> g, int start) {
    boolean[] seen = new boolean[g.size()];
    ArrayDeque<Integer> q = new ArrayDeque<Integer>();
    q.addLast(start); seen[start] = true;
    List<Integer> order = new ArrayList<Integer>();
    while (!q.isEmpty()) {
      int u = q.pollFirst();
      order.add(u);
      for (int v : g.get(u)) {
        if (seen[v]) continue;
        seen[v] = true;
        q.addLast(v);
      }
    }
    return order;
  }
}`,
    cpp: `vector<int> bfsWalk(vector<vector<int>>& g, int start) {
  vector<int> seen(g.size()), order;
  queue<int> q;
  q.push(start); seen[start] = 1;
  while (!q.empty()) {
    int u = q.front(); q.pop();
    order.push_back(u);
    for (int v : g[u]) {
      if (seen[v]) continue;
      seen[v] = 1; q.push(v);
    }
  }
  return order;
}`,
    c: `#include <stdlib.h>
int bfsWalk(int** g, int* deg, int n, int start, int* order) {
  int* seen = (int*)calloc(n, sizeof(int));
  int* q = (int*)malloc(sizeof(int)*n);
  int h = 0, t = 0, on = 0;
  q[t++] = start; seen[start] = 1;
  while (h < t) {
    int u = q[h++];
    order[on++] = u;
    for (int i = 0; i < deg[u]; i++) {
      int v = g[u][i];
      if (seen[v]) continue;
      seen[v] = 1; q[t++] = v;
    }
  }
  free(seen); free(q);
  return on;
}`
  },
  // 3 grid neighbors
  {
    python: `def neighbors(r, c, rows, cols):
  dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]
  out = []
  for dr, dc in dirs:
    nr, nc = r + dr, c + dc
    if nr < 0 or nc < 0 or nr >= rows or nc >= cols: continue
    out.append([nr, nc])
  return out`,
    java: `import java.util.*;
class Solution {
  public List<int[]> neighbors(int r, int c, int rows, int cols) {
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    List<int[]> out = new ArrayList<int[]>();
    for (int i = 0; i < 4; i++) {
      int nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      out.add(new int[]{nr, nc});
    }
    return out;
  }
}`,
    cpp: `vector<pair<int,int>> neighbors(int r, int c, int rows, int cols) {
  int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
  vector<pair<int,int>> out;
  for (int i = 0; i < 4; i++) {
    int nr = r + dirs[i][0], nc = c + dirs[i][1];
    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
    out.push_back({nr, nc});
  }
  return out;
}`,
    c: `/* out is n pairs (nr, nc); returns count. dirs are 4-direction. */
int neighbors(int r, int c, int rows, int cols, int out[][2]) {
  int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
  int k = 0;
  for (int i = 0; i < 4; i++) {
    int nr = r + dirs[i][0], nc = c + dirs[i][1];
    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
    out[k][0] = nr; out[k][1] = nc; k++;
  }
  return k;
}`
  },
  // 4 union-find
  {
    python: `def makeUF(n):
  parent = list(range(n))
  rank = [0] * n
  def find(x):
    while parent[x] != x:
      parent[x] = parent[parent[x]]
      x = parent[x]
    return x
  def union(a, b):
    x, y = find(a), find(b)
    if x == y: return False
    if rank[x] < rank[y]:
      x, y = y, x
    parent[y] = x
    if rank[x] == rank[y]: rank[x] += 1
    return True
  return {"find": find, "union": union, "parent": parent}`,
    java: `class Solution {
  static class UF {
    int[] parent, rank;
    UF(int n) {
      parent = new int[n]; rank = new int[n];
      for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int x) {
      while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }
    boolean union(int a, int b) {
      int x = find(a), y = find(b);
      if (x == y) return false;
      if (rank[x] < rank[y]) { int t = x; x = y; y = t; }
      parent[y] = x;
      if (rank[x] == rank[y]) rank[x]++;
      return true;
    }
  }
}`,
    cpp: `struct UF {
  vector<int> parent, rank;
  UF(int n): parent(n), rank(n) { iota(parent.begin(), parent.end(), 0); }
  int find(int x) {
    while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
  }
  bool unionSet(int a, int b) {
    int x = find(a), y = find(b);
    if (x == y) return false;
    if (rank[x] < rank[y]) swap(x, y);
    parent[y] = x;
    if (rank[x] == rank[y]) rank[x]++;
    return true;
  }
};`,
    c: `#include <stdlib.h>
/* parent[i], rank[i]; n nodes. path compression + union by rank */
typedef struct { int *parent, *rank, n; } UF;
UF* makeUF(int n) {
  UF* u = (UF*)malloc(sizeof(UF));
  u->n = n; u->parent = (int*)malloc(sizeof(int)*n); u->rank = (int*)calloc(n, sizeof(int));
  for (int i = 0; i < n; i++) u->parent[i] = i;
  return u;
}
int uf_find(UF* u, int x) {
  while (u->parent[x] != x) { u->parent[x] = u->parent[u->parent[x]]; x = u->parent[x]; }
  return x;
}
int uf_union(UF* u, int a, int b) {
  int x = uf_find(u, a), y = uf_find(u, b);
  if (x == y) return 0;
  if (u->rank[x] < u->rank[y]) { int t = x; x = y; y = t; }
  u->parent[y] = x;
  if (u->rank[x] == u->rank[y]) u->rank[x]++;
  return 1;
}`
  },
  // 5 kahn topo
  {
    python: `from collections import deque
def topo(n, edges):
  g = [[] for _ in range(n)]
  indeg = [0] * n
  for u, v in edges:
    g[u].append(v)
    indeg[v] += 1
  q = deque([i for i in range(n) if indeg[i] == 0])
  order = []
  while q:
    u = q.popleft()
    order.append(u)
    for v in g[u]:
      indeg[v] -= 1
      if indeg[v] == 0: q.append(v)
  return order if len(order) == n else []`,
    java: `import java.util.*;
class Solution {
  public int[] topo(int n, int[][] edges) {
    List<List<Integer>> g = new ArrayList<List<Integer>>();
    int[] indeg = new int[n];
    for (int i = 0; i < n; i++) g.add(new ArrayList<Integer>());
    for (int[] e : edges) { g.get(e[0]).add(e[1]); indeg[e[1]]++; }
    ArrayDeque<Integer> q = new ArrayDeque<Integer>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.addLast(i);
    int[] order = new int[n]; int p = 0;
    while (!q.isEmpty()) {
      int u = q.pollFirst();
      order[p++] = u;
      for (int v : g.get(u)) {
        indeg[v]--;
        if (indeg[v] == 0) q.addLast(v);
      }
    }
    return p == n ? order : new int[0];
  }
}`,
    cpp: `vector<int> topo(int n, vector<vector<int>>& edges) {
  vector<vector<int>> g(n);
  vector<int> indeg(n), order;
  for (auto& e : edges) { g[e[0]].push_back(e[1]); indeg[e[1]]++; }
  queue<int> q;
  for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
  while (!q.empty()) {
    int u = q.front(); q.pop();
    order.push_back(u);
    for (int v : g[u]) { indeg[v]--; if (indeg[v] == 0) q.push(v); }
  }
  return (int)order.size() == n ? order : vector<int>{};
}`,
    c: `#include <stdlib.h>
int* topo(int n, int edges[][2], int e, int* returnSize) {
  int* deg = (int*)calloc(n, sizeof(int));
  int* indeg = (int*)calloc(n, sizeof(int));
  for (int i = 0; i < e; i++) deg[edges[i][0]]++;
  int** g = (int**)malloc(sizeof(int*)*n);
  for (int i = 0; i < n; i++) g[i] = (int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)), deg[i]=0;
  for (int i = 0; i < e; i++) { g[edges[i][0]][deg[edges[i][0]]++] = edges[i][1]; indeg[edges[i][1]]++; }
  int* q = (int*)malloc(sizeof(int)*n); int h=0,t=0;
  for (int i = 0; i < n; i++) if (indeg[i]==0) q[t++]=i;
  int* order = (int*)malloc(sizeof(int)*n); int p=0;
  while (h<t) {
    int u = q[h++]; order[p++] = u;
    for (int i = 0; i < deg[u]; i++) { int v=g[u][i]; indeg[v]--; if (!indeg[v]) q[t++]=v; }
  }
  *returnSize = (p==n) ? n : 0;
  return order;
}`
  },
  // 6 min-heap dijkstra helper
  {
    python: `class MinHeap:
  def __init__(self, keyFn=None):
    self.a = []
    self.key = keyFn or (lambda x: x[0])
  def size(self):
    return len(self.a)
  def push(self, x):
    self.a.append(x)
    self.bubbleUp(len(self.a) - 1)
  def pop(self):
    top = self.a[0]
    last = self.a.pop()
    if self.a:
      self.a[0] = last
      self.bubbleDown(0)
    return top
  def bubbleUp(self, i):
    while i > 0:
      p = (i - 1) >> 1
      if self.key(self.a[i]) >= self.key(self.a[p]): break
      self.a[i], self.a[p] = self.a[p], self.a[i]
      i = p
  def bubbleDown(self, i):
    n = len(self.a)
    while True:
      s = i
      l = i * 2 + 1
      r = l + 1
      if l < n and self.key(self.a[l]) < self.key(self.a[s]): s = l
      if r < n and self.key(self.a[r]) < self.key(self.a[s]): s = r
      if s == i: break
      self.a[i], self.a[s] = self.a[s], self.a[i]
      i = s`,
    java: `import java.util.*;
class Solution {
  static class MinHeap {
    ArrayList<int[]> a = new ArrayList<int[]>();
    int key(int[] x) { return x[0]; }
    int size() { return a.size(); }
    void push(int[] x) { a.add(x); bubbleUp(a.size()-1); }
    int[] pop() {
      int[] top = a.get(0); int[] last = a.remove(a.size()-1);
      if (!a.isEmpty()) { a.set(0, last); bubbleDown(0); }
      return top;
    }
    void bubbleUp(int i) {
      while (i > 0) { int p=(i-1)>>1; if (key(a.get(i))>=key(a.get(p))) break;
        int[] t=a.get(i); a.set(i,a.get(p)); a.set(p,t); i=p; }
    }
    void bubbleDown(int i) {
      int n=a.size();
      while (true) { int s=i, l=i*2+1, r=l+1;
        if (l<n && key(a.get(l))<key(a.get(s))) s=l;
        if (r<n && key(a.get(r))<key(a.get(s))) s=r;
        if (s==i) break; int[] t=a.get(i); a.set(i,a.get(s)); a.set(s,t); i=s; }
    }
  }
}`,
    cpp: `struct MinHeap {
  vector<pair<int,int>> a;
  int key(const pair<int,int>& x) { return x.first; }
  int size() { return (int)a.size(); }
  void push(pair<int,int> x) { a.push_back(x); bubbleUp((int)a.size()-1); }
  pair<int,int> pop() {
    auto top = a[0]; auto last = a.back(); a.pop_back();
    if (!a.empty()) { a[0] = last; bubbleDown(0); }
    return top;
  }
  void bubbleUp(int i) {
    while (i > 0) { int p=(i-1)>>1; if (key(a[i])>=key(a[p])) break; swap(a[i], a[p]); i=p; }
  }
  void bubbleDown(int i) {
    int n=(int)a.size();
    while (true) { int s=i, l=i*2+1, r=l+1;
      if (l<n && key(a[l])<key(a[s])) s=l; if (r<n && key(a[r])<key(a[s])) s=r;
      if (s==i) break; swap(a[i], a[s]); i=s; }
  }
};`,
    c: `#include <stdlib.h>
/* min-heap of (dist, node) for Dijkstra; skip stale pops where dist > dist[node] */
typedef struct { int *k, *v, n, cap; } MinHeap;
void bubbleUp(MinHeap* h, int i) {
  while (i > 0) { int p=(i-1)>>1; if (h->k[i]>=h->k[p]) break;
    int tk=h->k[i]; h->k[i]=h->k[p]; h->k[p]=tk; int tv=h->v[i]; h->v[i]=h->v[p]; h->v[p]=tv; i=p; }
}
void bubbleDown(MinHeap* h, int i) {
  while (1) { int s=i, l=i*2+1, r=l+1;
    if (l<h->n && h->k[l]<h->k[s]) s=l; if (r<h->n && h->k[r]<h->k[s]) s=r;
    if (s==i) break; int tk=h->k[i]; h->k[i]=h->k[s]; h->k[s]=tk; int tv=h->v[i]; h->v[i]=h->v[s]; h->v[s]=tv; i=s; }
}
void heap_push(MinHeap* h, int dist, int node) {
  if (h->n==h->cap) { h->cap = h->cap? h->cap*2:8; h->k=(int*)realloc(h->k,sizeof(int)*h->cap); h->v=(int*)realloc(h->v,sizeof(int)*h->cap); }
  h->k[h->n]=dist; h->v[h->n]=node; h->n++; bubbleUp(h, h->n-1);
}
void heap_pop(MinHeap* h, int* dist, int* node) {
  *dist=h->k[0]; *node=h->v[0]; h->n--;
  if (h->n) { h->k[0]=h->k[h->n]; h->v[0]=h->v[h->n]; bubbleDown(h, 0); }
}`
  },
  // 7 multi-source bfs
  {
    python: `from collections import deque
def multiSource(grid, startVal, otherVal):
  rows, cols = len(grid), len(grid[0])
  q = deque()
  for r in range(rows):
    for c in range(cols):
      if grid[r][c] == startVal: q.append((r, c, 0))
  dirs = [[1,0],[-1,0],[0,1],[0,-1]]
  while q:
    r, c, d = q.popleft()
    for i in range(4):
      nr, nc = r + dirs[i][0], c + dirs[i][1]
      if nr < 0 or nc < 0 or nr >= rows or nc >= cols: continue
      if grid[nr][nc] != otherVal: continue
      grid[nr][nc] = startVal
      q.append((nr, nc, d + 1))
  return grid`,
    java: `import java.util.*;
class Solution {
  public int[][] multiSource(int[][] grid, int startVal, int otherVal) {
    int rows = grid.length, cols = grid[0].length;
    ArrayDeque<int[]> q = new ArrayDeque<int[]>();
    for (int r = 0; r < rows; r++)
      for (int c = 0; c < cols; c++)
        if (grid[r][c] == startVal) q.addLast(new int[]{r, c, 0});
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    while (!q.isEmpty()) {
      int[] cur = q.pollFirst();
      int r = cur[0], c = cur[1], d = cur[2];
      for (int i = 0; i < 4; i++) {
        int nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (grid[nr][nc] != otherVal) continue;
        grid[nr][nc] = startVal;
        q.addLast(new int[]{nr, nc, d + 1});
      }
    }
    return grid;
  }
}`,
    cpp: `vector<vector<int>> multiSource(vector<vector<int>>& grid, int startVal, int otherVal) {
  int rows = (int)grid.size(), cols = (int)grid[0].size();
  queue<array<int,3>> q;
  for (int r = 0; r < rows; r++)
    for (int c = 0; c < cols; c++)
      if (grid[r][c] == startVal) q.push({r, c, 0});
  int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
  while (!q.empty()) {
    auto cur = q.front(); q.pop();
    int r = cur[0], c = cur[1], d = cur[2];
    for (int i = 0; i < 4; i++) {
      int nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (grid[nr][nc] != otherVal) continue;
      grid[nr][nc] = startVal;
      q.push({nr, nc, d + 1});
    }
  }
  return grid;
}`,
    c: `#include <stdlib.h>
/* grid is rows x cols ints. overwrite otherVal cells as they are reached. */
void multiSource(int** grid, int rows, int cols, int startVal, int otherVal) {
  int* qr = (int*)malloc(sizeof(int)*rows*cols);
  int* qc = (int*)malloc(sizeof(int)*rows*cols);
  int* qd = (int*)malloc(sizeof(int)*rows*cols);
  int h = 0, t = 0;
  for (int r = 0; r < rows; r++)
    for (int c = 0; c < cols; c++)
      if (grid[r][c] == startVal) { qr[t]=r; qc[t]=c; qd[t]=0; t++; }
  int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
  while (h < t) {
    int r = qr[h], c = qc[h], d = qd[h]; h++;
    for (int i = 0; i < 4; i++) {
      int nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (grid[nr][nc] != otherVal) continue;
      grid[nr][nc] = startVal;
      qr[t]=nr; qc[t]=nc; qd[t]=d+1; t++;
    }
  }
  free(qr); free(qc); free(qd);
}`
  },
  // 8 directed cycle colors
  {
    python: `def hasDirectedCycle(g):
  state = [0] * len(g)
  def dfs(u):
    if state[u] == 1: return True
    if state[u] == 2: return False
    state[u] = 1
    for v in g[u]:
      if dfs(v): return True
    state[u] = 2
    return False
  for i in range(len(g)):
    if state[i] == 0 and dfs(i): return True
  return False`,
    java: `import java.util.*;
class Solution {
  boolean dfs(List<List<Integer>> g, int u, int[] state) {
    if (state[u] == 1) return true;
    if (state[u] == 2) return false;
    state[u] = 1;
    for (int v : g.get(u)) if (dfs(g, v, state)) return true;
    state[u] = 2;
    return false;
  }
  public boolean hasDirectedCycle(List<List<Integer>> g) {
    int[] state = new int[g.size()];
    for (int i = 0; i < g.size(); i++) if (state[i] == 0 && dfs(g, i, state)) return true;
    return false;
  }
}`,
    cpp: `bool dfs(vector<vector<int>>& g, int u, vector<int>& state) {
  if (state[u] == 1) return true;
  if (state[u] == 2) return false;
  state[u] = 1;
  for (int v : g[u]) if (dfs(g, v, state)) return true;
  state[u] = 2;
  return false;
}
bool hasDirectedCycle(vector<vector<int>>& g) {
  vector<int> state(g.size());
  for (int i = 0; i < (int)g.size(); i++) if (state[i] == 0 && dfs(g, i, state)) return true;
  return false;
}`,
    c: `#include <stdlib.h>
int dfs(int** g, int* deg, int u, int* state) {
  if (state[u] == 1) return 1;
  if (state[u] == 2) return 0;
  state[u] = 1;
  for (int i = 0; i < deg[u]; i++) if (dfs(g, deg, g[u][i], state)) return 1;
  state[u] = 2;
  return 0;
}
int hasDirectedCycle(int** g, int* deg, int n) {
  int* state = (int*)calloc(n, sizeof(int));
  for (int i = 0; i < n; i++) if (state[i] == 0 && dfs(g, deg, i, state)) { free(state); return 1; }
  free(state);
  return 0;
}`
  }
];
