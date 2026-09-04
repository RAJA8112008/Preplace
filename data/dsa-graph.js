window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["dsa-graph"] = {
  kind: "dsa",
  notes: [
    { title: "What a graph is", body: "A graph is a set of nodes (vertices) plus links (edges) between them. A city map, a course list with prereqs, and a grid of land cells are all graphs. You rarely store a drawing. You store neighbors: for each node, the list of nodes you can walk to in one step." },
    { title: "Adjacency list vs matrix", body: "An adjacency list is an array of arrays (or a Map). Index i holds the neighbors of node i. An adjacency matrix is an n by n grid of 0/1. Lists win when the graph is sparse, which is most interview graphs. A matrix is fine when n is tiny or you need O(1) 'is there an edge?' checks." },
    { title: "DFS", body: "Depth-first search walks one path as far as it can, then backtracks. Recursion or an explicit stack both count as DFS. Use it to flood a region, build a clone, or find a cycle with a 'visiting' color. Watch the call stack on a huge grid; an iterative stack is safer there." },
    { title: "BFS", body: "Breadth-first search walks layer by layer with a queue. The first time you reach a node is the fewest edges from the start. That is why BFS is the default for unweighted shortest path, rotting oranges, and word ladder. Multi-source BFS means you put every start cell in the queue on minute 0." },
    { title: "Visited", body: "A visited set (or a mark on the grid) stops you from walking the same node forever. In an undirected graph you mark when you first see a node. In a directed graph you often need three colors: unseen, on the current path, and finished. Copying a whole visited matrix on every call is the slow brute pattern." },
    { title: "Directed vs undirected", body: "Undirected edges go both ways: if A links to B, B links to A. Directed edges go one way: course B must finish before course A. Trees are undirected connected graphs with n-1 edges and no cycle. A cycle in a directed graph is a path that can return to a node while that node is still on the recursion stack." },
    { title: "Union-Find", body: "Union-Find (Disjoint Set) tracks groups. find(x) names the leader of x's group. union(a, b) merges two groups. Path compression and union by rank make it nearly O(1) per op. It shines on 'are these in the same component?' problems: valid tree, connected components, accounts merge, islands." },
    { title: "Topological sort", body: "A topo order is a line-up of nodes so every directed edge goes left to right. It exists only if the directed graph has no cycle. Kahn's algorithm peels nodes with indegree 0 using a queue. DFS can also emit a reverse postorder. Course schedule and alien dictionary are topo problems." },
    { title: "Shortest path", body: "Unweighted: BFS. Weighted and non-negative: Dijkstra with a min-heap. At most K edges: Bellman-Ford or a BFS that tracks stops. Bidirectional BFS searches from both ends and meets in the middle; that cuts the branching on word ladder and grid shortest path." },
    { title: "Grid as a graph", body: "A cell is a node. Up, down, left, right (and sometimes diagonals) are edges. Islands, flood fill, rotting oranges, 01 matrix, and surrounded regions are grid graphs. Bound-check every neighbor. Mutating the cell (1 to 0, O to #) can replace a separate visited matrix." }
  ],
  examples: [
    {
      lang: "js",
      title: "1. Adjacency list from edges",
      desc: "What this is\nAn adjacency list is the usual way to store a graph in JavaScript.\nEach index holds the nodes you can reach in one step.\n\nWhat the code is doing\nn is 4, so we make 4 empty neighbor lists.\nEach undirected edge [u, v] is stored twice: u to v and v to u.\nThe log shows node 0 points at 1 and 2.\n\nWatch out\nFor a directed edge, push only one way.\nNodes are 0-based here. Some problems use 1-based ids.",
      code: `function adjList(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) {
    const u = edges[i][0];
    const v = edges[i][1];
    g[u].push(v);
    g[v].push(u); // undirected
  }
  return g;
}

const g = adjList(4, [[0, 1], [0, 2], [1, 3]]);
console.log(g[0]); // [1, 2]`,
      codes: {
        javascript: `function adjList(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) {
    const u = edges[i][0];
    const v = edges[i][1];
    g[u].push(v);
    g[v].push(u); // undirected
  }
  return g;
}

const g = adjList(4, [[0, 1], [0, 2], [1, 3]]);
console.log(g[0]); // [1, 2]`,
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
      }
    },
    {
      lang: "js",
      title: "2. DFS walk",
      desc: "What this is\nDFS walks deep on one path, then backtracks.\nA visited array stops loops.\n\nWhat the code is doing\ndfs starts at 0 and marks it seen.\nIt then visits each unseen neighbor.\nOrder is 0, then 1, then 3, then 2 for this list.\n\nWatch out\nOn a directed graph you still mark visited, or a cycle loops forever.\nRecursion depth equals the longest path.",
      code: `function dfsWalk(g, start) {
  const seen = Array(g.length).fill(false);
  const order = [];
  function dfs(u) {
    seen[u] = true;
    order.push(u);
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      if (!seen[v]) dfs(v);
    }
  }
  dfs(start);
  return order;
}`,
      codes: {
        javascript: `function dfsWalk(g, start) {
  const seen = Array(g.length).fill(false);
  const order = [];
  function dfs(u) {
    seen[u] = true;
    order.push(u);
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      if (!seen[v]) dfs(v);
    }
  }
  dfs(start);
  return order;
}`,
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
      }
    },
    {
      lang: "js",
      title: "3. BFS walk",
      desc: "What this is\nBFS uses a queue and visits nodes by distance from the start.\nThe first time you pop a node is the fewest edges to it.\n\nWhat the code is doing\nstart goes in the queue and is marked seen.\nEach round takes the front node and pushes unseen neighbors.\norder is a level-order list of nodes.\n\nWatch out\nMark seen when you push, not when you pop, or the queue fills with duplicates.\nshift() is O(n) on a JS array; for interviews it is still the usual queue.",
      code: `function bfsWalk(g, start) {
  const seen = Array(g.length).fill(false);
  const q = [start];
  seen[start] = true;
  const order = [];
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      if (seen[v]) continue;
      seen[v] = true;
      q.push(v);
    }
  }
  return order;
}`,
      codes: {
        javascript: `function bfsWalk(g, start) {
  const seen = Array(g.length).fill(false);
  const q = [start];
  seen[start] = true;
  const order = [];
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      if (seen[v]) continue;
      seen[v] = true;
      q.push(v);
    }
  }
  return order;
}`,
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
      }
    },
    {
      lang: "js",
      title: "4. Grid neighbors",
      desc: "What this is\nA grid is a graph. Each cell has up to four neighbors.\nYou must stay inside the rectangle.\n\nWhat the code is doing\ndirs lists the four steps.\nFor each step we make nr, nc and skip if out of bounds.\nout collects the in-bound neighbor cells.\n\nWatch out\n8-direction problems add the four diagonals.\nDo not use dirs.length as the grid size.",
      code: `function neighbors(r, c, rows, cols) {
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const out = [];
  for (let i = 0; i < dirs.length; i++) {
    const nr = r + dirs[i][0];
    const nc = c + dirs[i][1];
    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
    out.push([nr, nc]);
  }
  return out;
}`,
      codes: {
        javascript: `function neighbors(r, c, rows, cols) {
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const out = [];
  for (let i = 0; i < dirs.length; i++) {
    const nr = r + dirs[i][0];
    const nc = c + dirs[i][1];
    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
    out.push([nr, nc]);
  }
  return out;
}`,
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
      }
    },
    {
      lang: "js",
      title: "5. Union-Find",
      desc: "What this is\nUnion-Find names a leader for each group of nodes.\nunion merges two groups. find walks to the leader.\n\nWhat the code is doing\nparent starts as each node pointing at itself.\nfind compresses the path so the next find is shorter.\nunion links the smaller rank tree under the larger one and returns false if they were already together.\n\nWatch out\nAlways union(find(a), find(b)), not the raw ids, unless find is used inside union.\nThis helper is the upgrade on island and component problems.",
      code: `function makeUF(n) {
  const parent = Array.from({ length: n }, function (_, i) { return i; });
  const rank = Array(n).fill(0);
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a, b) {
    let x = find(a);
    let y = find(b);
    if (x === y) return false;
    if (rank[x] < rank[y]) {
      const t = x; x = y; y = t;
    }
    parent[y] = x;
    if (rank[x] === rank[y]) rank[x]++;
    return true;
  }
  return { find: find, union: union, parent: parent };
}`,
      codes: {
        javascript: `function makeUF(n) {
  const parent = Array.from({ length: n }, function (_, i) { return i; });
  const rank = Array(n).fill(0);
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a, b) {
    let x = find(a);
    let y = find(b);
    if (x === y) return false;
    if (rank[x] < rank[y]) {
      const t = x; x = y; y = t;
    }
    parent[y] = x;
    if (rank[x] === rank[y]) rank[x]++;
    return true;
  }
  return { find: find, union: union, parent: parent };
}`,
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
      }
    },
    {
      lang: "js",
      title: "6. Kahn topological sort",
      desc: "What this is\nKahn's algorithm peels nodes with no incoming edges.\nIf you cannot peel every node, the directed graph has a cycle.\n\nWhat the code is doing\nindegree counts incoming edges.\nAll indegree-0 nodes start in the queue.\nWhen you pop u, you lower each neighbor's indegree and enqueue if it hits 0.\n\nWatch out\norder.length < n means a cycle, not a missing edge.\nThis is Course Schedule II and Alien Dictionary.",
      code: `function topo(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  const indeg = Array(n).fill(0);
  for (let i = 0; i < edges.length; i++) {
    const u = edges[i][0];
    const v = edges[i][1];
    g[u].push(v);
    indeg[v]++;
  }
  const q = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  const order = [];
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      indeg[v]--;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return order.length === n ? order : [];
}`,
      codes: {
        javascript: `function topo(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  const indeg = Array(n).fill(0);
  for (let i = 0; i < edges.length; i++) {
    const u = edges[i][0];
    const v = edges[i][1];
    g[u].push(v);
    indeg[v]++;
  }
  const q = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  const order = [];
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      indeg[v]--;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return order.length === n ? order : [];
}`,
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
      }
    },
    {
      lang: "js",
      title: "7. Tiny min-heap (Dijkstra)",
      desc: "What this is\nJavaScript has no built-in heap. A tiny binary heap is enough for Dijkstra.\nSmaller key() values come out first.\n\nWhat the code is doing\npush appends then bubbles up.\npop swaps the last item to the root then bubbles down.\nkey reads pair[0], so [distance, node] works.\n\nWatch out\nAlways skip a popped pair if its distance is stale (bigger than dist[node]).\nThis is not a Fibonacci heap. It is plenty for n up to a few thousand.",
      code: `function MinHeap(keyFn) {
  this.a = [];
  this.key = keyFn || function (x) { return x[0]; };
  this.size = function () { return this.a.length; };
  this.push = function (x) {
    this.a.push(x);
    this.bubbleUp(this.a.length - 1);
  };
  this.pop = function () {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      this.bubbleDown(0);
    }
    return top;
  };
  this.bubbleUp = function (i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.key(this.a[i]) >= this.key(this.a[p])) break;
      const t = this.a[i]; this.a[i] = this.a[p]; this.a[p] = t;
      i = p;
    }
  };
  this.bubbleDown = function (i) {
    const n = this.a.length;
    while (true) {
      let s = i;
      const l = i * 2 + 1;
      const r = l + 1;
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
  this.key = keyFn || function (x) { return x[0]; };
  this.size = function () { return this.a.length; };
  this.push = function (x) {
    this.a.push(x);
    this.bubbleUp(this.a.length - 1);
  };
  this.pop = function () {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      this.bubbleDown(0);
    }
    return top;
  };
  this.bubbleUp = function (i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.key(this.a[i]) >= this.key(this.a[p])) break;
      const t = this.a[i]; this.a[i] = this.a[p]; this.a[p] = t;
      i = p;
    }
  };
  this.bubbleDown = function (i) {
    const n = this.a.length;
    while (true) {
      let s = i;
      const l = i * 2 + 1;
      const r = l + 1;
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
      }
    },
    {
      lang: "js",
      title: "8. Multi-source BFS",
      desc: "What this is\nSometimes many cells start at distance 0: every rotten orange, every 0 in 01 Matrix, every ocean-border cell.\nPut all of them in the queue first, then BFS once.\n\nWhat the code is doing\nEvery cell equal to startVal is pushed with dist 0.\nNeighbors that still hold otherVal get the next distance.\nThe grid is overwritten so we do not need a separate visited matrix.\n\nWatch out\nIf you BFS from each cell on its own, you repeat the same walks. That is the brute version of 01 Matrix.",
      code: `function multiSource(grid, startVal, otherVal) {
  const rows = grid.length;
  const cols = grid[0].length;
  const q = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === startVal) q.push([r, c, 0]);
    }
  }
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.length) {
    const cur = q.shift();
    const r = cur[0], c = cur[1], d = cur[2];
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0];
      const nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (grid[nr][nc] !== otherVal) continue;
      grid[nr][nc] = startVal;
      q.push([nr, nc, d + 1]);
    }
  }
  return grid;
}`,
      codes: {
        javascript: `function multiSource(grid, startVal, otherVal) {
  const rows = grid.length;
  const cols = grid[0].length;
  const q = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === startVal) q.push([r, c, 0]);
    }
  }
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.length) {
    const cur = q.shift();
    const r = cur[0], c = cur[1], d = cur[2];
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0];
      const nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (grid[nr][nc] !== otherVal) continue;
      grid[nr][nc] = startVal;
      q.push([nr, nc, d + 1]);
    }
  }
  return grid;
}`,
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
      }
    },
    {
      lang: "js",
      title: "9. Directed cycle colors",
      desc: "What this is\nThree colors detect a cycle in a directed graph.\n0 = never seen, 1 = on the current path, 2 = finished.\n\nWhat the code is doing\nIf dfs hits a node that is already 1, that node is still on the stack, so a cycle exists.\nNeighbors are walked; then the node is marked 2.\nWe start dfs from every node so disconnected pieces are covered.\n\nWatch out\nA 2 is safe to skip. Only 1 means a back edge.\nUndirected cycle checks are different: ignore the parent, do not use this 3-color trick blindly.",
      code: `function hasDirectedCycle(g) {
  const state = Array(g.length).fill(0);
  function dfs(u) {
    if (state[u] === 1) return true;
    if (state[u] === 2) return false;
    state[u] = 1;
    for (let i = 0; i < g[u].length; i++) {
      if (dfs(g[u][i])) return true;
    }
    state[u] = 2;
    return false;
  }
  for (let i = 0; i < g.length; i++) {
    if (state[i] === 0 && dfs(i)) return true;
  }
  return false;
}`,
      codes: {
        javascript: `function hasDirectedCycle(g) {
  const state = Array(g.length).fill(0);
  function dfs(u) {
    if (state[u] === 1) return true;
    if (state[u] === 2) return false;
    state[u] = 1;
    for (let i = 0; i < g[u].length; i++) {
      if (dfs(g[u][i])) return true;
    }
    state[u] = 2;
    return false;
  }
  for (let i = 0; i < g.length; i++) {
    if (state[i] === 0 && dfs(i)) return true;
  }
  return false;
}`,
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
    }
  ],
  questions: [
    {
      id: 1,
      level: "intermediate",
      q: "Number of Islands",
      ask: "Amazon · Google · Meta · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/number-of-islands/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/find-the-number-of-islands/1"}],
      a: "Count groups of land in a grid. '1' is land, '0' is water. Two land cells are the same island if they touch up, down, left, or right (not diagonal).\n\nExample: [[1,1,0],[1,0,0],[0,0,1]] has two islands: the three 1s in the top-left, and the lone 1 at the bottom-right.\n\nYou walk each land cell and mark the whole blob so you do not count it again. Open Brute, Optimal, and More optimal for extra visited copies, in-place DFS, and Union-Find.",
      solutions: [
        {
          name: "Brute",
          time: "O(r²c²)",
          space: "O(rc)",
          why: "For every land cell we copy a full visited matrix and DFS that island. The extra copies are wasted work. Correct, but memory traffic is huge on a large grid.",
          code: `function numIslands(grid) {
  const rows = grid.length;
  if (!rows) return 0;
  const cols = grid[0].length;
  const global = grid.map(function () {
    return Array(cols).fill(false);
  });
  let count = 0;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== "1" || global[r][c]) continue;
      count++;
      // extra visited copy for this island walk
      const seen = global.map(function (row) { return row.slice(); });
      const stack = [[r, c]];
      seen[r][c] = true;
      while (stack.length) {
        const cell = stack.pop();
        const x = cell[0], y = cell[1];
        global[x][y] = true;
        for (let i = 0; i < 4; i++) {
          const nx = x + dirs[i][0];
          const ny = y + dirs[i][1];
          if (nx < 0 || ny < 0 || nx >= rows || ny >= cols) continue;
          if (grid[nx][ny] !== "1" || seen[nx][ny]) continue;
          seen[nx][ny] = true;
          stack.push([nx, ny]);
        }
      }
    }
  }
  return count;
}`,
          codes: {
            javascript: `function numIslands(grid) {
  const rows = grid.length;
  if (!rows) return 0;
  const cols = grid[0].length;
  const global = grid.map(function () {
    return Array(cols).fill(false);
  });
  let count = 0;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== "1" || global[r][c]) continue;
      count++;
      // extra visited copy for this island walk
      const seen = global.map(function (row) { return row.slice(); });
      const stack = [[r, c]];
      seen[r][c] = true;
      while (stack.length) {
        const cell = stack.pop();
        const x = cell[0], y = cell[1];
        global[x][y] = true;
        for (let i = 0; i < 4; i++) {
          const nx = x + dirs[i][0];
          const ny = y + dirs[i][1];
          if (nx < 0 || ny < 0 || nx >= rows || ny >= cols) continue;
          if (grid[nx][ny] !== "1" || seen[nx][ny]) continue;
          seen[nx][ny] = true;
          stack.push([nx, ny]);
        }
      }
    }
  }
  return count;
}`,
            python: `def numIslands(grid):
  rows = len(grid)
  if not rows: return 0
  cols = len(grid[0])
  globalv = [[False] * cols for _ in range(rows)]
  count = 0
  dirs = [[1,0],[-1,0],[0,1],[0,-1]]
  for r in range(rows):
    for c in range(cols):
      if grid[r][c] != "1" or globalv[r][c]: continue
      count += 1
      seen = [row[:] for row in globalv]
      stack = [[r, c]]
      seen[r][c] = True
      while stack:
        x, y = stack.pop()
        globalv[x][y] = True
        for i in range(4):
          nx, ny = x + dirs[i][0], y + dirs[i][1]
          if nx < 0 or ny < 0 or nx >= rows or ny >= cols: continue
          if grid[nx][ny] != "1" or seen[nx][ny]: continue
          seen[nx][ny] = True
          stack.append([nx, ny])
  return count`,
            java: `import java.util.*;
class Solution {
  public int numIslands(char[][] grid) {
    int rows = grid.length;
    if (rows == 0) return 0;
    int cols = grid[0].length;
    boolean[][] global = new boolean[rows][cols];
    int count = 0;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int r = 0; r < rows; r++) {
      for (int c = 0; c < cols; c++) {
        if (grid[r][c] != '1' || global[r][c]) continue;
        count++;
        boolean[][] seen = new boolean[rows][cols];
        for (int i = 0; i < rows; i++) seen[i] = global[i].clone();
        ArrayDeque<int[]> stack = new ArrayDeque<int[]>();
        stack.push(new int[]{r, c}); seen[r][c] = true;
        while (!stack.isEmpty()) {
          int[] cell = stack.pop();
          int x = cell[0], y = cell[1];
          global[x][y] = true;
          for (int i = 0; i < 4; i++) {
            int nx = x + dirs[i][0], ny = y + dirs[i][1];
            if (nx < 0 || ny < 0 || nx >= rows || ny >= cols) continue;
            if (grid[nx][ny] != '1' || seen[nx][ny]) continue;
            seen[nx][ny] = true; stack.push(new int[]{nx, ny});
          }
        }
      }
    }
    return count;
  }
}`,
            cpp: `class Solution {
public:
  int numIslands(vector<vector<char>>& grid) {
    int rows = (int)grid.size(); if (!rows) return 0;
    int cols = (int)grid[0].size();
    vector<vector<int>> global(rows, vector<int>(cols, 0));
    int count = 0;
    int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
      if (grid[r][c] != '1' || global[r][c]) continue;
      count++;
      auto seen = global;
      vector<pair<int,int>> stack; stack.push_back({r, c}); seen[r][c] = 1;
      while (!stack.empty()) {
        auto cell = stack.back(); stack.pop_back();
        int x = cell.first, y = cell.second; global[x][y] = 1;
        for (int i = 0; i < 4; i++) {
          int nx = x + dirs[i][0], ny = y + dirs[i][1];
          if (nx < 0 || ny < 0 || nx >= rows || ny >= cols) continue;
          if (grid[nx][ny] != '1' || seen[nx][ny]) continue;
          seen[nx][ny] = 1; stack.push_back({nx, ny});
        }
      }
    }
    return count;
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
int numIslands(char** grid, int rows, int cols) {
  if (!rows) return 0;
  int* global = (int*)calloc(rows * cols, sizeof(int));
  int count = 0;
  int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
  int* seen = (int*)malloc(sizeof(int)*rows*cols);
  int* stx = (int*)malloc(sizeof(int)*rows*cols);
  int* sty = (int*)malloc(sizeof(int)*rows*cols);
  for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
    if (grid[r][c] != '1' || global[r*cols+c]) continue;
    count++;
    memcpy(seen, global, sizeof(int)*rows*cols);
    int sn = 0; stx[sn]=r; sty[sn]=c; sn++; seen[r*cols+c]=1;
    while (sn) {
      int x = stx[--sn], y = sty[sn];
      global[x*cols+y] = 1;
      for (int i = 0; i < 4; i++) {
        int nx = x + dirs[i][0], ny = y + dirs[i][1];
        if (nx < 0 || ny < 0 || nx >= rows || ny >= cols) continue;
        if (grid[nx][ny] != '1' || seen[nx*cols+ny]) continue;
        seen[nx*cols+ny]=1; stx[sn]=nx; sty[sn]=ny; sn++;
      }
    }
  }
  free(global); free(seen); free(stx); free(sty);
  return count;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "One DFS (or BFS) per island. Mutating land to water is the visited mark, so we never copy a matrix. Each cell is entered a constant number of times.",
          code: `function numIslands(grid) {
  const rows = grid.length;
  if (!rows) return 0;
  const cols = grid[0].length;
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (grid[r][c] !== "1") return;
    grid[r][c] = "0";
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
          codes: {
            javascript: `function numIslands(grid) {
  const rows = grid.length;
  if (!rows) return 0;
  const cols = grid[0].length;
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (grid[r][c] !== "1") return;
    grid[r][c] = "0";
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
            python: `def numIslands(grid):
  rows = len(grid)
  if not rows: return 0
  cols = len(grid[0])
  count = 0
  def dfs(r, c):
    if r < 0 or c < 0 or r >= rows or c >= cols: return
    if grid[r][c] != "1": return
    grid[r][c] = "0"
    dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)
  for r in range(rows):
    for c in range(cols):
      if grid[r][c] == "1":
        count += 1
        dfs(r, c)
  return count`,
            java: `class Solution {
  int rows, cols;
  void dfs(char[][] grid, int r, int c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (grid[r][c] != '1') return;
    grid[r][c] = '0';
    dfs(grid, r+1, c); dfs(grid, r-1, c); dfs(grid, r, c+1); dfs(grid, r, c-1);
  }
  public int numIslands(char[][] grid) {
    rows = grid.length; if (rows == 0) return 0;
    cols = grid[0].length;
    int count = 0;
    for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
      if (grid[r][c] == '1') { count++; dfs(grid, r, c); }
    }
    return count;
  }
}`,
            cpp: `class Solution {
  int rows, cols;
  void dfs(vector<vector<char>>& grid, int r, int c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (grid[r][c] != '1') return;
    grid[r][c] = '0';
    dfs(grid, r+1, c); dfs(grid, r-1, c); dfs(grid, r, c+1); dfs(grid, r, c-1);
  }
public:
  int numIslands(vector<vector<char>>& grid) {
    rows = (int)grid.size(); if (!rows) return 0;
    cols = (int)grid[0].size();
    int count = 0;
    for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++)
      if (grid[r][c] == '1') { count++; dfs(grid, r, c); }
    return count;
  }
};`,
            c: `int rows_g, cols_g;
void dfs_island(char** grid, int r, int c) {
  if (r < 0 || c < 0 || r >= rows_g || c >= cols_g) return;
  if (grid[r][c] != '1') return;
  grid[r][c] = '0';
  dfs_island(grid, r+1, c); dfs_island(grid, r-1, c);
  dfs_island(grid, r, c+1); dfs_island(grid, r, c-1);
}
int numIslands(char** grid, int rows, int cols) {
  if (!rows) return 0;
  rows_g = rows; cols_g = cols;
  int count = 0;
  for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++)
    if (grid[r][c] == '1') { count++; dfs_island(grid, r, c); }
  return count;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "Union-Find treats each land cell as a node. You only union with the right and down land neighbor, so each edge is processed once. The island count is how many land roots remain. No recursion.",
          code: `function numIslands(grid) {
  const rows = grid.length;
  if (!rows) return 0;
  const cols = grid[0].length;
  const n = rows * cols;
  const parent = Array.from({ length: n }, function (_, i) { return i; });
  const rank = Array(n).fill(0);
  let islands = 0;

  function id(r, c) { return r * cols + c; }
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a, b) {
    let x = find(a), y = find(b);
    if (x === y) return;
    if (rank[x] < rank[y]) { const t = x; x = y; y = t; }
    parent[y] = x;
    if (rank[x] === rank[y]) rank[x]++;
    islands--;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== "1") continue;
      islands++;
      if (c + 1 < cols && grid[r][c + 1] === "1") union(id(r, c), id(r, c + 1));
      if (r + 1 < rows && grid[r + 1][c] === "1") union(id(r, c), id(r + 1, c));
    }
  }
  return islands;
}`,
          codes: {
            javascript: `function numIslands(grid) {
  const rows = grid.length;
  if (!rows) return 0;
  const cols = grid[0].length;
  const n = rows * cols;
  const parent = Array.from({ length: n }, function (_, i) { return i; });
  const rank = Array(n).fill(0);
  let islands = 0;

  function id(r, c) { return r * cols + c; }
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a, b) {
    let x = find(a), y = find(b);
    if (x === y) return;
    if (rank[x] < rank[y]) { const t = x; x = y; y = t; }
    parent[y] = x;
    if (rank[x] === rank[y]) rank[x]++;
    islands--;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== "1") continue;
      islands++;
      if (c + 1 < cols && grid[r][c + 1] === "1") union(id(r, c), id(r, c + 1));
      if (r + 1 < rows && grid[r + 1][c] === "1") union(id(r, c), id(r + 1, c));
    }
  }
  return islands;
}`,
            python: `def numIslands(grid):
  rows = len(grid)
  if not rows: return 0
  cols = len(grid[0])
  n = rows * cols
  parent = list(range(n))
  rank = [0] * n
  islands = 0
  def id(r, c): return r * cols + c
  def find(x):
    while parent[x] != x:
      parent[x] = parent[parent[x]]
      x = parent[x]
    return x
  def union(a, b):
    nonlocal islands
    x, y = find(a), find(b)
    if x == y: return
    if rank[x] < rank[y]: x, y = y, x
    parent[y] = x
    if rank[x] == rank[y]: rank[x] += 1
    islands -= 1
  for r in range(rows):
    for c in range(cols):
      if grid[r][c] != "1": continue
      islands += 1
      if c + 1 < cols and grid[r][c+1] == "1": union(id(r,c), id(r,c+1))
      if r + 1 < rows and grid[r+1][c] == "1": union(id(r,c), id(r+1,c))
  return islands`,
            java: `class Solution {
  int[] parent, rank; int islands;
  int find(int x) {
    while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
  }
  void union(int a, int b) {
    int x = find(a), y = find(b);
    if (x == y) return;
    if (rank[x] < rank[y]) { int t=x; x=y; y=t; }
    parent[y] = x;
    if (rank[x] == rank[y]) rank[x]++;
    islands--;
  }
  public int numIslands(char[][] grid) {
    int rows = grid.length; if (rows == 0) return 0;
    int cols = grid[0].length;
    int n = rows * cols;
    parent = new int[n]; rank = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    islands = 0;
    for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
      if (grid[r][c] != '1') continue;
      islands++;
      if (c + 1 < cols && grid[r][c+1] == '1') union(r*cols+c, r*cols+c+1);
      if (r + 1 < rows && grid[r+1][c] == '1') union(r*cols+c, (r+1)*cols+c);
    }
    return islands;
  }
}`,
            cpp: `class Solution {
  vector<int> parent, rank; int islands;
  int find(int x) {
    while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
  }
  void unite(int a, int b) {
    int x = find(a), y = find(b);
    if (x == y) return;
    if (rank[x] < rank[y]) swap(x, y);
    parent[y] = x;
    if (rank[x] == rank[y]) rank[x]++;
    islands--;
  }
public:
  int numIslands(vector<vector<char>>& grid) {
    int rows = (int)grid.size(); if (!rows) return 0;
    int cols = (int)grid[0].size();
    int n = rows * cols;
    parent.resize(n); rank.assign(n, 0);
    for (int i = 0; i < n; i++) parent[i] = i;
    islands = 0;
    for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
      if (grid[r][c] != '1') continue;
      islands++;
      if (c + 1 < cols && grid[r][c+1] == '1') unite(r*cols+c, r*cols+c+1);
      if (r + 1 < rows && grid[r+1][c] == '1') unite(r*cols+c, (r+1)*cols+c);
    }
    return islands;
  }
};`,
            c: `#include <stdlib.h>
int findp(int* parent, int x) {
  while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
  return x;
}
int numIslands(char** grid, int rows, int cols) {
  if (!rows) return 0;
  int n = rows * cols;
  int* parent = (int*)malloc(sizeof(int)*n);
  int* rank = (int*)calloc(n, sizeof(int));
  for (int i = 0; i < n; i++) parent[i] = i;
  int islands = 0;
  for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
    if (grid[r][c] != '1') continue;
    islands++;
    if (c + 1 < cols && grid[r][c+1] == '1') {
      int x = findp(parent, r*cols+c), y = findp(parent, r*cols+c+1);
      if (x != y) { if (rank[x] < rank[y]) { int t=x; x=y; y=t; } parent[y]=x; if (rank[x]==rank[y]) rank[x]++; islands--; }
    }
    if (r + 1 < rows && grid[r+1][c] == '1') {
      int x = findp(parent, r*cols+c), y = findp(parent, (r+1)*cols+c);
      if (x != y) { if (rank[x] < rank[y]) { int t=x; x=y; y=t; } parent[y]=x; if (rank[x]==rank[y]) rank[x]++; islands--; }
    }
  }
  free(parent); free(rank);
  return islands;
}`
          }
        }
      ]
    },
    {
      id: 2,
      level: "intermediate",
      q: "Clone Graph",
      ask: "Meta · Google · Amazon",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/clone-graph/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/clone-graph/1"}],
      a: "You get one node of a connected undirected graph. Each node has a val and a neighbors array. Return a deep copy: new objects, same shape, no shared references.\n\nExample: 1 connected to 2 and 3, 2 connected to 1 and 3. The clone has new nodes 1, 2, 3 with the same links.\n\nA map from old node to new node is the whole trick, so you do not clone the same node twice. Brute copies extra maps; Optimal uses DFS; More optimal uses BFS.",
      solutions: [
        {
          name: "Brute",
          time: "O(n + e)",
          space: "O(n)",
          why: "One shared old-to-new map is required so a node is cloned once. The extra Set copy on every call is wasted; it does not change correctness. Drop the copies and you get Optimal.",
          code: `function cloneGraph(node) {
  if (!node) return null;
  const map = new Map();

  function dfs(cur, seenCopy) {
    if (map.has(cur)) return map.get(cur);
    const copy = { val: cur.val, neighbors: [] };
    map.set(cur, copy);
    const nextSeen = new Set(seenCopy);
    nextSeen.add(cur);
    for (let i = 0; i < cur.neighbors.length; i++) {
      copy.neighbors.push(dfs(cur.neighbors[i], nextSeen));
    }
    return copy;
  }

  return dfs(node, new Set());
}`,
          codes: {
            javascript: `function cloneGraph(node) {
  if (!node) return null;
  const map = new Map();

  function dfs(cur, seenCopy) {
    if (map.has(cur)) return map.get(cur);
    const copy = { val: cur.val, neighbors: [] };
    map.set(cur, copy);
    const nextSeen = new Set(seenCopy);
    nextSeen.add(cur);
    for (let i = 0; i < cur.neighbors.length; i++) {
      copy.neighbors.push(dfs(cur.neighbors[i], nextSeen));
    }
    return copy;
  }

  return dfs(node, new Set());
}`,
            python: `class Node:
  def __init__(self, val=0, neighbors=None):
    self.val = val
    self.neighbors = neighbors if neighbors is not None else []
def cloneGraph(node):
  if not node: return None
  mp = {}
  def dfs(cur, seen_copy):
    if cur in mp: return mp[cur]
    copy = Node(cur.val, [])
    mp[cur] = copy
    next_seen = set(seen_copy)
    next_seen.add(cur)
    for nei in cur.neighbors:
      copy.neighbors.append(dfs(nei, next_seen))
    return copy
  return dfs(node, set())`,
            java: `import java.util.*;
class Node {
  public int val;
  public List<Node> neighbors;
  public Node(int _val) { val = _val; neighbors = new ArrayList<Node>(); }
}
class Solution {
  Map<Node, Node> map = new HashMap<Node, Node>();
  Node dfs(Node cur, Set<Node> seenCopy) {
    if (map.containsKey(cur)) return map.get(cur);
    Node copy = new Node(cur.val);
    map.put(cur, copy);
    Set<Node> nextSeen = new HashSet<Node>(seenCopy);
    nextSeen.add(cur);
    for (Node nei : cur.neighbors) copy.neighbors.add(dfs(nei, nextSeen));
    return copy;
  }
  public Node cloneGraph(Node node) {
    if (node == null) return null;
    return dfs(node, new HashSet<Node>());
  }
}`,
            cpp: `class Node {
public:
  int val;
  vector<Node*> neighbors;
  Node(int _val) { val = _val; }
};
class Solution {
  unordered_map<Node*, Node*> mp;
  Node* dfs(Node* cur, unordered_set<Node*> seenCopy) {
    if (mp.count(cur)) return mp[cur];
    Node* copy = new Node(cur->val);
    mp[cur] = copy;
    seenCopy.insert(cur);
    for (Node* nei : cur->neighbors) copy->neighbors.push_back(dfs(nei, seenCopy));
    return copy;
  }
public:
  Node* cloneGraph(Node* node) {
    if (!node) return NULL;
    return dfs(node, {});
  }
};`,
            c: `#include <stdlib.h>
struct Node { int val; int numNeighbors; struct Node** neighbors; };
struct Pair { struct Node* old; struct Node* neu; };
struct Node* cloneGraph(struct Node* node) {
  if (!node) return NULL;
  struct Pair map[128]; int mn = 0;
  struct Node* stack[128]; int sn = 0;
  /* DFS with extra seen copies: we still share one map so each node clones once */
  struct Node* seenbuf[64][128]; int seenlen[64]; int depth = 0;
  struct Node* dfs(struct Node* cur, struct Node** seenCopy, int slen) {
    for (int i = 0; i < mn; i++) if (map[i].old == cur) return map[i].neu;
    struct Node* copy = (struct Node*)malloc(sizeof(struct Node));
    copy->val = cur->val; copy->numNeighbors = 0;
    copy->neighbors = (struct Node**)malloc(sizeof(struct Node*)*(cur->numNeighbors?cur->numNeighbors:1));
    map[mn].old = cur; map[mn].neu = copy; mn++;
    struct Node* nextSeen[128];
    for (int i = 0; i < slen; i++) nextSeen[i] = seenCopy[i];
    nextSeen[slen] = cur; slen++;
    for (int i = 0; i < cur->numNeighbors; i++)
      copy->neighbors[copy->numNeighbors++] = dfs(cur->neighbors[i], nextSeen, slen);
    return copy;
  }
  struct Node* emptyS[1];
  return dfs(node, emptyS, 0);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n + e)",
          space: "O(n)",
          why: "One Map from old node to new node. DFS creates the clone, then fills neighbors. Each node and edge is processed once.",
          code: `function cloneGraph(node) {
  if (!node) return null;
  const map = new Map();

  function dfs(cur) {
    if (map.has(cur)) return map.get(cur);
    const copy = { val: cur.val, neighbors: [] };
    map.set(cur, copy);
    for (let i = 0; i < cur.neighbors.length; i++) {
      copy.neighbors.push(dfs(cur.neighbors[i]));
    }
    return copy;
  }

  return dfs(node);
}`,
          codes: {
            javascript: `function cloneGraph(node) {
  if (!node) return null;
  const map = new Map();

  function dfs(cur) {
    if (map.has(cur)) return map.get(cur);
    const copy = { val: cur.val, neighbors: [] };
    map.set(cur, copy);
    for (let i = 0; i < cur.neighbors.length; i++) {
      copy.neighbors.push(dfs(cur.neighbors[i]));
    }
    return copy;
  }

  return dfs(node);
}`,
            python: `class Node:
  def __init__(self, val=0, neighbors=None):
    self.val = val
    self.neighbors = neighbors if neighbors is not None else []
def cloneGraph(node):
  if not node: return None
  mp = {}
  def dfs(cur):
    if cur in mp: return mp[cur]
    copy = Node(cur.val, [])
    mp[cur] = copy
    for nei in cur.neighbors:
      copy.neighbors.append(dfs(nei))
    return copy
  return dfs(node)`,
            java: `import java.util.*;
class Node {
  public int val; public List<Node> neighbors;
  public Node(int _val) { val = _val; neighbors = new ArrayList<Node>(); }
}
class Solution {
  Map<Node, Node> map = new HashMap<Node, Node>();
  Node dfs(Node cur) {
    if (map.containsKey(cur)) return map.get(cur);
    Node copy = new Node(cur.val);
    map.put(cur, copy);
    for (Node nei : cur.neighbors) copy.neighbors.add(dfs(nei));
    return copy;
  }
  public Node cloneGraph(Node node) {
    if (node == null) return null;
    return dfs(node);
  }
}`,
            cpp: `class Node {
public:
  int val; vector<Node*> neighbors;
  Node(int _val) { val = _val; }
};
class Solution {
  unordered_map<Node*, Node*> mp;
  Node* dfs(Node* cur) {
    if (mp.count(cur)) return mp[cur];
    Node* copy = new Node(cur->val);
    mp[cur] = copy;
    for (Node* nei : cur->neighbors) copy->neighbors.push_back(dfs(nei));
    return copy;
  }
public:
  Node* cloneGraph(Node* node) {
    if (!node) return NULL;
    return dfs(node);
  }
};`,
            c: `#include <stdlib.h>
struct Node { int val; int numNeighbors; struct Node** neighbors; };
struct Pair { struct Node* old; struct Node* neu; };
struct Pair gmap[128]; int gmn;
struct Node* dfs_clone(struct Node* cur) {
  for (int i = 0; i < gmn; i++) if (gmap[i].old == cur) return gmap[i].neu;
  struct Node* copy = (struct Node*)malloc(sizeof(struct Node));
  copy->val = cur->val; copy->numNeighbors = cur->numNeighbors;
  copy->neighbors = (struct Node**)malloc(sizeof(struct Node*)*(cur->numNeighbors?cur->numNeighbors:1));
  gmap[gmn].old = cur; gmap[gmn].neu = copy; gmn++;
  for (int i = 0; i < cur->numNeighbors; i++) copy->neighbors[i] = dfs_clone(cur->neighbors[i]);
  return copy;
}
struct Node* cloneGraph(struct Node* node) {
  if (!node) return NULL;
  gmn = 0;
  return dfs_clone(node);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n + e)",
          space: "O(n)",
          why: "BFS with the same map avoids deep recursion on a long chain. Complexity matches DFS. Prefer this when the graph can be a long path.",
          code: `function cloneGraph(node) {
  if (!node) return null;
  const map = new Map();
  map.set(node, { val: node.val, neighbors: [] });
  const q = [node];
  while (q.length) {
    const cur = q.shift();
    const copy = map.get(cur);
    for (let i = 0; i < cur.neighbors.length; i++) {
      const nei = cur.neighbors[i];
      if (!map.has(nei)) {
        map.set(nei, { val: nei.val, neighbors: [] });
        q.push(nei);
      }
      copy.neighbors.push(map.get(nei));
    }
  }
  return map.get(node);
}`,
          codes: {
            javascript: `function cloneGraph(node) {
  if (!node) return null;
  const map = new Map();
  map.set(node, { val: node.val, neighbors: [] });
  const q = [node];
  while (q.length) {
    const cur = q.shift();
    const copy = map.get(cur);
    for (let i = 0; i < cur.neighbors.length; i++) {
      const nei = cur.neighbors[i];
      if (!map.has(nei)) {
        map.set(nei, { val: nei.val, neighbors: [] });
        q.push(nei);
      }
      copy.neighbors.push(map.get(nei));
    }
  }
  return map.get(node);
}`,
            python: `from collections import deque
class Node:
  def __init__(self, val=0, neighbors=None):
    self.val = val
    self.neighbors = neighbors if neighbors is not None else []
def cloneGraph(node):
  if not node: return None
  mp = {node: Node(node.val, [])}
  q = deque([node])
  while q:
    cur = q.popleft()
    copy = mp[cur]
    for nei in cur.neighbors:
      if nei not in mp:
        mp[nei] = Node(nei.val, [])
        q.append(nei)
      copy.neighbors.append(mp[nei])
  return mp[node]`,
            java: `import java.util.*;
class Node {
  public int val; public List<Node> neighbors;
  public Node(int _val) { val = _val; neighbors = new ArrayList<Node>(); }
}
class Solution {
  public Node cloneGraph(Node node) {
    if (node == null) return null;
    Map<Node, Node> map = new HashMap<Node, Node>();
    map.put(node, new Node(node.val));
    ArrayDeque<Node> q = new ArrayDeque<Node>();
    q.addLast(node);
    while (!q.isEmpty()) {
      Node cur = q.pollFirst();
      Node copy = map.get(cur);
      for (Node nei : cur.neighbors) {
        if (!map.containsKey(nei)) {
          map.put(nei, new Node(nei.val));
          q.addLast(nei);
        }
        copy.neighbors.add(map.get(nei));
      }
    }
    return map.get(node);
  }
}`,
            cpp: `class Node {
public:
  int val; vector<Node*> neighbors;
  Node(int _val) { val = _val; }
};
class Solution {
public:
  Node* cloneGraph(Node* node) {
    if (!node) return NULL;
    unordered_map<Node*, Node*> mp;
    mp[node] = new Node(node->val);
    queue<Node*> q; q.push(node);
    while (!q.empty()) {
      Node* cur = q.front(); q.pop();
      Node* copy = mp[cur];
      for (Node* nei : cur->neighbors) {
        if (!mp.count(nei)) { mp[nei] = new Node(nei->val); q.push(nei); }
        copy->neighbors.push_back(mp[nei]);
      }
    }
    return mp[node];
  }
};`,
            c: `#include <stdlib.h>
struct Node { int val; int numNeighbors; struct Node** neighbors; };
struct Pair { struct Node* old; struct Node* neu; };
struct Node* lookup(struct Pair* map, int mn, struct Node* k) {
  for (int i = 0; i < mn; i++) if (map[i].old == k) return map[i].neu;
  return NULL;
}
struct Node* cloneGraph(struct Node* node) {
  if (!node) return NULL;
  struct Pair map[128]; int mn = 0;
  struct Node* copy0 = (struct Node*)malloc(sizeof(struct Node));
  copy0->val = node->val; copy0->numNeighbors = 0;
  copy0->neighbors = (struct Node**)malloc(sizeof(struct Node*)*(node->numNeighbors?node->numNeighbors:1));
  map[mn].old = node; map[mn].neu = copy0; mn++;
  struct Node* q[128]; int h=0, t=0; q[t++] = node;
  while (h < t) {
    struct Node* cur = q[h++];
    struct Node* copy = lookup(map, mn, cur);
    for (int i = 0; i < cur->numNeighbors; i++) {
      struct Node* nei = cur->neighbors[i];
      if (!lookup(map, mn, nei)) {
        struct Node* nc = (struct Node*)malloc(sizeof(struct Node));
        nc->val = nei->val; nc->numNeighbors = 0;
        nc->neighbors = (struct Node**)malloc(sizeof(struct Node*)*(nei->numNeighbors?nei->numNeighbors:1));
        map[mn].old = nei; map[mn].neu = nc; mn++;
        q[t++] = nei;
      }
      copy->neighbors[copy->numNeighbors++] = lookup(map, mn, nei);
    }
  }
  return copy0;
}`
          }
        }
      ]
    },
    {
      id: 3,
      level: "intermediate",
      q: "Course Schedule",
      ask: "Amazon · Google · Meta · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/course-schedule/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/prerequisite-tasks/1"}],
      a: "There are numCourses labeled 0 to n-1. prerequisites[i] = [a, b] means you must take b before a. Return true if you can finish all courses.\n\nExample: 2 courses, [[1,0]] is true (take 0 then 1). [[1,0],[0,1]] is false (a 2-cycle).\n\nThis is 'does this directed graph have a cycle?' Brute DFS from every node with a fresh path copy. Optimal is 3-color DFS. More optimal is Kahn's indegree queue.",
      solutions: [
        {
          name: "Brute",
          time: "O(n·(n + e))",
          space: "O(n + e)",
          why: "From every course we DFS with a brand-new onPath array. We redo walks that a single 3-color pass would cache. Fine on tiny n, wasteful on large n.",
          code: `function canFinish(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, function () { return []; });
  for (let i = 0; i < prerequisites.length; i++) {
    const a = prerequisites[i][0];
    const b = prerequisites[i][1];
    g[b].push(a);
  }

  function dfs(u, onPath) {
    if (onPath[u]) return false;
    const copy = onPath.slice();
    copy[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      if (!dfs(g[u][i], copy)) return false;
    }
    return true;
  }

  for (let i = 0; i < numCourses; i++) {
    if (!dfs(i, Array(numCourses).fill(false))) return false;
  }
  return true;
}`,
          codes: {
            javascript: `function canFinish(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, function () { return []; });
  for (let i = 0; i < prerequisites.length; i++) {
    const a = prerequisites[i][0];
    const b = prerequisites[i][1];
    g[b].push(a);
  }

  function dfs(u, onPath) {
    if (onPath[u]) return false;
    const copy = onPath.slice();
    copy[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      if (!dfs(g[u][i], copy)) return false;
    }
    return true;
  }

  for (let i = 0; i < numCourses; i++) {
    if (!dfs(i, Array(numCourses).fill(false))) return false;
  }
  return true;
}`,
            python: `def canFinish(numCourses, prerequisites):
  g = [[] for _ in range(numCourses)]
  for a, b in prerequisites:
    g[b].append(a)
  def dfs(u, onPath):
    if onPath[u]: return False
    copy = onPath[:]
    copy[u] = True
    for v in g[u]:
      if not dfs(v, copy): return False
    return True
  for i in range(numCourses):
    if not dfs(i, [False] * numCourses): return False
  return True`,
            java: `import java.util.*;
class Solution {
  boolean dfs(List<List<Integer>> g, int u, boolean[] onPath) {
    if (onPath[u]) return false;
    boolean[] copy = onPath.clone();
    copy[u] = true;
    for (int v : g.get(u)) if (!dfs(g, v, copy)) return false;
    return true;
  }
  public boolean canFinish(int numCourses, int[][] prerequisites) {
    List<List<Integer>> g = new ArrayList<List<Integer>>();
    for (int i = 0; i < numCourses; i++) g.add(new ArrayList<Integer>());
    for (int[] e : prerequisites) g.get(e[1]).add(e[0]);
    for (int i = 0; i < numCourses; i++)
      if (!dfs(g, i, new boolean[numCourses])) return false;
    return true;
  }
}`,
            cpp: `class Solution {
  bool dfs(vector<vector<int>>& g, int u, vector<int> onPath) {
    if (onPath[u]) return false;
    onPath[u] = 1;
    for (int v : g[u]) if (!dfs(g, v, onPath)) return false;
    return true;
  }
public:
  bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> g(numCourses);
    for (auto& e : prerequisites) g[e[1]].push_back(e[0]);
    for (int i = 0; i < numCourses; i++)
      if (!dfs(g, i, vector<int>(numCourses))) return false;
    return true;
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
int dfs_cf(int** g, int* deg, int u, int* onPath, int n) {
  if (onPath[u]) return 0;
  int* copy = (int*)malloc(sizeof(int)*n);
  memcpy(copy, onPath, sizeof(int)*n);
  copy[u] = 1;
  for (int i = 0; i < deg[u]; i++) if (!dfs_cf(g, deg, g[u][i], copy, n)) { free(copy); return 0; }
  free(copy);
  return 1;
}
int canFinish(int numCourses, int** prerequisites, int e) {
  int* deg = (int*)calloc(numCourses, sizeof(int));
  for (int i = 0; i < e; i++) deg[prerequisites[i][1]]++;
  int** g = (int**)malloc(sizeof(int*)*numCourses);
  for (int i = 0; i < numCourses; i++) { g[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); deg[i]=0; }
  for (int i = 0; i < e; i++) g[prerequisites[i][1]][deg[prerequisites[i][1]]++] = prerequisites[i][0];
  int* on = (int*)calloc(numCourses, sizeof(int));
  for (int i = 0; i < numCourses; i++) {
    memset(on, 0, sizeof(int)*numCourses);
    if (!dfs_cf(g, deg, i, on, numCourses)) return 0;
  }
  return 1;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n + e)",
          space: "O(n + e)",
          why: "Three colors: 0 unseen, 1 on the current path, 2 done. Hitting a 1 is a cycle. Finished nodes are skipped, so each edge is walked once.",
          code: `function canFinish(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, function () { return []; });
  for (let i = 0; i < prerequisites.length; i++) {
    g[prerequisites[i][1]].push(prerequisites[i][0]);
  }
  const state = Array(numCourses).fill(0);

  function dfs(u) {
    if (state[u] === 1) return false;
    if (state[u] === 2) return true;
    state[u] = 1;
    for (let i = 0; i < g[u].length; i++) {
      if (!dfs(g[u][i])) return false;
    }
    state[u] = 2;
    return true;
  }

  for (let i = 0; i < numCourses; i++) {
    if (!dfs(i)) return false;
  }
  return true;
}`,
          codes: {
            javascript: `function canFinish(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, function () { return []; });
  for (let i = 0; i < prerequisites.length; i++) {
    g[prerequisites[i][1]].push(prerequisites[i][0]);
  }
  const state = Array(numCourses).fill(0);

  function dfs(u) {
    if (state[u] === 1) return false;
    if (state[u] === 2) return true;
    state[u] = 1;
    for (let i = 0; i < g[u].length; i++) {
      if (!dfs(g[u][i])) return false;
    }
    state[u] = 2;
    return true;
  }

  for (let i = 0; i < numCourses; i++) {
    if (!dfs(i)) return false;
  }
  return true;
}`,
            python: `def canFinish(numCourses, prerequisites):
  g = [[] for _ in range(numCourses)]
  for a, b in prerequisites:
    g[b].append(a)
  state = [0] * numCourses
  def dfs(u):
    if state[u] == 1: return False
    if state[u] == 2: return True
    state[u] = 1
    for v in g[u]:
      if not dfs(v): return False
    state[u] = 2
    return True
  for i in range(numCourses):
    if not dfs(i): return False
  return True`,
            java: `import java.util.*;
class Solution {
  boolean dfs(List<List<Integer>> g, int u, int[] state) {
    if (state[u] == 1) return false;
    if (state[u] == 2) return true;
    state[u] = 1;
    for (int v : g.get(u)) if (!dfs(g, v, state)) return false;
    state[u] = 2;
    return true;
  }
  public boolean canFinish(int numCourses, int[][] prerequisites) {
    List<List<Integer>> g = new ArrayList<List<Integer>>();
    for (int i = 0; i < numCourses; i++) g.add(new ArrayList<Integer>());
    for (int[] e : prerequisites) g.get(e[1]).add(e[0]);
    int[] state = new int[numCourses];
    for (int i = 0; i < numCourses; i++) if (!dfs(g, i, state)) return false;
    return true;
  }
}`,
            cpp: `class Solution {
  bool dfs(vector<vector<int>>& g, int u, vector<int>& state) {
    if (state[u] == 1) return false;
    if (state[u] == 2) return true;
    state[u] = 1;
    for (int v : g[u]) if (!dfs(g, v, state)) return false;
    state[u] = 2;
    return true;
  }
public:
  bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> g(numCourses);
    for (auto& e : prerequisites) g[e[1]].push_back(e[0]);
    vector<int> state(numCourses);
    for (int i = 0; i < numCourses; i++) if (!dfs(g, i, state)) return false;
    return true;
  }
};`,
            c: `#include <stdlib.h>
int dfs_cf2(int** g, int* deg, int u, int* state) {
  if (state[u] == 1) return 0;
  if (state[u] == 2) return 1;
  state[u] = 1;
  for (int i = 0; i < deg[u]; i++) if (!dfs_cf2(g, deg, g[u][i], state)) return 0;
  state[u] = 2;
  return 1;
}
int canFinish(int numCourses, int** prerequisites, int e) {
  int* deg = (int*)calloc(numCourses, sizeof(int));
  for (int i = 0; i < e; i++) deg[prerequisites[i][1]]++;
  int** g = (int**)malloc(sizeof(int*)*numCourses);
  for (int i = 0; i < numCourses; i++) { g[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); deg[i]=0; }
  for (int i = 0; i < e; i++) g[prerequisites[i][1]][deg[prerequisites[i][1]]++] = prerequisites[i][0];
  int* state = (int*)calloc(numCourses, sizeof(int));
  for (int i = 0; i < numCourses; i++) if (!dfs_cf2(g, deg, i, state)) return 0;
  return 1;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n + e)",
          space: "O(n + e)",
          why: "Kahn's algorithm: peel indegree-0 courses. If you cannot peel all n courses, a cycle remains. Iterative, no recursion, same linear bound.",
          code: `function canFinish(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, function () { return []; });
  const indeg = Array(numCourses).fill(0);
  for (let i = 0; i < prerequisites.length; i++) {
    const a = prerequisites[i][0];
    const b = prerequisites[i][1];
    g[b].push(a);
    indeg[a]++;
  }
  const q = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) q.push(i);
  let taken = 0;
  while (q.length) {
    const u = q.shift();
    taken++;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      indeg[v]--;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return taken === numCourses;
}`,
          codes: {
            javascript: `function canFinish(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, function () { return []; });
  const indeg = Array(numCourses).fill(0);
  for (let i = 0; i < prerequisites.length; i++) {
    const a = prerequisites[i][0];
    const b = prerequisites[i][1];
    g[b].push(a);
    indeg[a]++;
  }
  const q = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) q.push(i);
  let taken = 0;
  while (q.length) {
    const u = q.shift();
    taken++;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      indeg[v]--;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return taken === numCourses;
}`,
            python: `from collections import deque
def canFinish(numCourses, prerequisites):
  g = [[] for _ in range(numCourses)]
  indeg = [0] * numCourses
  for a, b in prerequisites:
    g[b].append(a)
    indeg[a] += 1
  q = deque([i for i in range(numCourses) if indeg[i] == 0])
  taken = 0
  while q:
    u = q.popleft()
    taken += 1
    for v in g[u]:
      indeg[v] -= 1
      if indeg[v] == 0: q.append(v)
  return taken == numCourses`,
            java: `import java.util.*;
class Solution {
  public boolean canFinish(int numCourses, int[][] prerequisites) {
    List<List<Integer>> g = new ArrayList<List<Integer>>();
    int[] indeg = new int[numCourses];
    for (int i = 0; i < numCourses; i++) g.add(new ArrayList<Integer>());
    for (int[] e : prerequisites) { g.get(e[1]).add(e[0]); indeg[e[0]]++; }
    ArrayDeque<Integer> q = new ArrayDeque<Integer>();
    for (int i = 0; i < numCourses; i++) if (indeg[i] == 0) q.addLast(i);
    int taken = 0;
    while (!q.isEmpty()) {
      int u = q.pollFirst(); taken++;
      for (int v : g.get(u)) { indeg[v]--; if (indeg[v] == 0) q.addLast(v); }
    }
    return taken == numCourses;
  }
}`,
            cpp: `class Solution {
public:
  bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> g(numCourses);
    vector<int> indeg(numCourses);
    for (auto& e : prerequisites) { g[e[1]].push_back(e[0]); indeg[e[0]]++; }
    queue<int> q;
    for (int i = 0; i < numCourses; i++) if (indeg[i] == 0) q.push(i);
    int taken = 0;
    while (!q.empty()) {
      int u = q.front(); q.pop(); taken++;
      for (int v : g[u]) { indeg[v]--; if (indeg[v] == 0) q.push(v); }
    }
    return taken == numCourses;
  }
};`,
            c: `#include <stdlib.h>
int canFinish(int numCourses, int** prerequisites, int e) {
  int* deg = (int*)calloc(numCourses, sizeof(int));
  int* indeg = (int*)calloc(numCourses, sizeof(int));
  for (int i = 0; i < e; i++) deg[prerequisites[i][1]]++;
  int** g = (int**)malloc(sizeof(int*)*numCourses);
  for (int i = 0; i < numCourses; i++) { g[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); deg[i]=0; }
  for (int i = 0; i < e; i++) { g[prerequisites[i][1]][deg[prerequisites[i][1]]++] = prerequisites[i][0]; indeg[prerequisites[i][0]]++; }
  int* q = (int*)malloc(sizeof(int)*numCourses); int h=0,t=0;
  for (int i = 0; i < numCourses; i++) if (!indeg[i]) q[t++]=i;
  int taken = 0;
  while (h < t) {
    int u = q[h++]; taken++;
    for (int i = 0; i < deg[u]; i++) { int v=g[u][i]; indeg[v]--; if (!indeg[v]) q[t++]=v; }
  }
  return taken == numCourses;
}`
          }
        }
      ]
    },
    {
      id: 4,
      level: "intermediate",
      q: "Course Schedule II",
      ask: "Amazon · Google · Meta · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/course-schedule-ii/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/course-schedule/1"}],
      a: "Same setup as Course Schedule, but return one valid order of courses. If a cycle makes it impossible, return [].\n\nExample: numCourses = 4, prereqs [[1,0],[2,0],[3,1],[3,2]] can return [0,1,2,3] or [0,2,1,3].\n\nAny topo order is accepted. Brute tries every permutation. Optimal DFS pushes a course after its neighbors. More optimal is Kahn's queue, which builds the order as it peels.",
      solutions: [
        {
          name: "Brute",
          time: "O(n! · e)",
          space: "O(n)",
          why: "Generate every permutation of courses and test the prereq edges. Correct for tiny n, unusable at interview sizes. Shows you know 'order' means a permutation that respects edges.",
          code: `function findOrder(numCourses, prerequisites) {
  const edges = prerequisites;
  function ok(order) {
    const pos = Array(numCourses);
    for (let i = 0; i < order.length; i++) pos[order[i]] = i;
    for (let i = 0; i < edges.length; i++) {
      const a = edges[i][0], b = edges[i][1];
      if (pos[b] > pos[a]) return false;
    }
    return true;
  }
  const used = Array(numCourses).fill(false);
  const path = [];
  let ans = null;
  function dfs() {
    if (ans) return;
    if (path.length === numCourses) {
      if (ok(path)) ans = path.slice();
      return;
    }
    for (let i = 0; i < numCourses; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(i);
      dfs();
      path.pop();
      used[i] = false;
    }
  }
  dfs();
  return ans || [];
}`,
          codes: {
            javascript: `function findOrder(numCourses, prerequisites) {
  const edges = prerequisites;
  function ok(order) {
    const pos = Array(numCourses);
    for (let i = 0; i < order.length; i++) pos[order[i]] = i;
    for (let i = 0; i < edges.length; i++) {
      const a = edges[i][0], b = edges[i][1];
      if (pos[b] > pos[a]) return false;
    }
    return true;
  }
  const used = Array(numCourses).fill(false);
  const path = [];
  let ans = null;
  function dfs() {
    if (ans) return;
    if (path.length === numCourses) {
      if (ok(path)) ans = path.slice();
      return;
    }
    for (let i = 0; i < numCourses; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(i);
      dfs();
      path.pop();
      used[i] = false;
    }
  }
  dfs();
  return ans || [];
}`,
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
          }
        },
        {
          name: "Optimal",
          time: "O(n + e)",
          space: "O(n + e)",
          why: "DFS 3-color. After all outgoing edges are done, push the course. Reverse of that list is a topo order. Empty array if a cycle is found.",
          code: `function findOrder(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, function () { return []; });
  for (let i = 0; i < prerequisites.length; i++) {
    g[prerequisites[i][1]].push(prerequisites[i][0]);
  }
  const state = Array(numCourses).fill(0);
  const out = [];
  let cycle = false;

  function dfs(u) {
    if (state[u] === 1) { cycle = true; return; }
    if (state[u] === 2) return;
    state[u] = 1;
    for (let i = 0; i < g[u].length; i++) dfs(g[u][i]);
    state[u] = 2;
    out.push(u);
  }

  for (let i = 0; i < numCourses; i++) dfs(i);
  if (cycle) return [];
  out.reverse();
  return out;
}`,
          codes: {
            javascript: `function findOrder(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, function () { return []; });
  for (let i = 0; i < prerequisites.length; i++) {
    g[prerequisites[i][1]].push(prerequisites[i][0]);
  }
  const state = Array(numCourses).fill(0);
  const out = [];
  let cycle = false;

  function dfs(u) {
    if (state[u] === 1) { cycle = true; return; }
    if (state[u] === 2) return;
    state[u] = 1;
    for (let i = 0; i < g[u].length; i++) dfs(g[u][i]);
    state[u] = 2;
    out.push(u);
  }

  for (let i = 0; i < numCourses; i++) dfs(i);
  if (cycle) return [];
  out.reverse();
  return out;
}`,
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
          }
        },
        {
          name: "More optimal",
          time: "O(n + e)",
          space: "O(n + e)",
          why: "Kahn's BFS builds the order directly: indegree 0 first. If the order is shorter than n, a cycle blocked some courses. No reverse step, no recursion.",
          code: `function findOrder(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, function () { return []; });
  const indeg = Array(numCourses).fill(0);
  for (let i = 0; i < prerequisites.length; i++) {
    const a = prerequisites[i][0], b = prerequisites[i][1];
    g[b].push(a);
    indeg[a]++;
  }
  const q = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) q.push(i);
  const order = [];
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      indeg[v]--;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return order.length === numCourses ? order : [];
}`,
          codes: {
            javascript: `function findOrder(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, function () { return []; });
  const indeg = Array(numCourses).fill(0);
  for (let i = 0; i < prerequisites.length; i++) {
    const a = prerequisites[i][0], b = prerequisites[i][1];
    g[b].push(a);
    indeg[a]++;
  }
  const q = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) q.push(i);
  const order = [];
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      indeg[v]--;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return order.length === numCourses ? order : [];
}`,
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
        }
      ]
    },
    {
      id: 5,
      level: "intermediate",
      q: "Pacific Atlantic Water Flow",
      ask: "Google · Amazon · Meta",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/pacific-atlantic-water-flow/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/pacific-atlantic-water-flow/"}],
      a: "A heights grid. Rain at a cell can flow to a neighbor that is equal or lower. The Pacific touches the top and left borders. The Atlantic touches the bottom and right. Return every cell that can reach both oceans.\n\nExample: a peak in the middle can flow down to both shores; a low pit in the center may reach neither.\n\nWalking from every cell to the ocean is the slow way. Walking inland from both shores and intersecting the two reachable sets is the right way.",
      solutions: [
        {
          name: "Brute",
          time: "O(r²c²)",
          space: "O(rc)",
          why: "From every cell, DFS toward lower/equal neighbors with a fresh visited copy. Check if that walk hits a Pacific border and an Atlantic border. Extra copies plus a full search per cell.",
          code: `function pacificAtlantic(heights) {
  const rows = heights.length, cols = heights[0].length;
  const ans = [];
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function reaches(sr, sc) {
    const seen = Array.from({ length: rows }, function () {
      return Array(cols).fill(false);
    });
    const stack = [[sr, sc]];
    seen[sr][sc] = true;
    let pac = false, atl = false;
    while (stack.length) {
      const cur = stack.pop();
      const r = cur[0], c = cur[1];
      if (r === 0 || c === 0) pac = true;
      if (r === rows - 1 || c === cols - 1) atl = true;
      if (pac && atl) return true;
      for (let i = 0; i < 4; i++) {
        const nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (seen[nr][nc] || heights[nr][nc] > heights[r][c]) continue;
        seen[nr][nc] = true;
        stack.push([nr, nc]);
      }
    }
    return pac && atl;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (reaches(r, c)) ans.push([r, c]);
    }
  }
  return ans;
}`,
          codes: {
            javascript: `function pacificAtlantic(heights) {
  const rows = heights.length, cols = heights[0].length;
  const ans = [];
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function reaches(sr, sc) {
    const seen = Array.from({ length: rows }, function () {
      return Array(cols).fill(false);
    });
    const stack = [[sr, sc]];
    seen[sr][sc] = true;
    let pac = false, atl = false;
    while (stack.length) {
      const cur = stack.pop();
      const r = cur[0], c = cur[1];
      if (r === 0 || c === 0) pac = true;
      if (r === rows - 1 || c === cols - 1) atl = true;
      if (pac && atl) return true;
      for (let i = 0; i < 4; i++) {
        const nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (seen[nr][nc] || heights[nr][nc] > heights[r][c]) continue;
        seen[nr][nc] = true;
        stack.push([nr, nc]);
      }
    }
    return pac && atl;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (reaches(r, c)) ans.push([r, c]);
    }
  }
  return ans;
}`,
            python: `def pacificAtlantic(heights):
  rows, cols = len(heights), len(heights[0])
  ans = []
  dirs = [[1,0],[-1,0],[0,1],[0,-1]]
  def reaches(sr, sc):
    seen = [[False]*cols for _ in range(rows)]
    stack = [[sr, sc]]
    seen[sr][sc] = True
    pac = atl = False
    while stack:
      r, c = stack.pop()
      if r == 0 or c == 0: pac = True
      if r == rows-1 or c == cols-1: atl = True
      if pac and atl: return True
      for i in range(4):
        nr, nc = r+dirs[i][0], c+dirs[i][1]
        if nr<0 or nc<0 or nr>=rows or nc>=cols: continue
        if seen[nr][nc] or heights[nr][nc] > heights[r][c]: continue
        seen[nr][nc] = True
        stack.append([nr, nc])
    return pac and atl
  for r in range(rows):
    for c in range(cols):
      if reaches(r, c): ans.append([r, c])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> pacificAtlantic(int[][] heights) {
    int rows = heights.length, cols = heights[0].length;
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int sr = 0; sr < rows; sr++) for (int sc = 0; sc < cols; sc++) {
      boolean[][] seen = new boolean[rows][cols];
      ArrayDeque<int[]> stack = new ArrayDeque<int[]>();
      stack.push(new int[]{sr, sc}); seen[sr][sc] = true;
      boolean pac = false, atl = false;
      while (!stack.isEmpty()) {
        int[] cur = stack.pop(); int r=cur[0], c=cur[1];
        if (r==0 || c==0) pac = true;
        if (r==rows-1 || c==cols-1) atl = true;
        if (pac && atl) break;
        for (int i = 0; i < 4; i++) {
          int nr=r+dirs[i][0], nc=c+dirs[i][1];
          if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
          if (seen[nr][nc] || heights[nr][nc] > heights[r][c]) continue;
          seen[nr][nc]=true; stack.push(new int[]{nr,nc});
        }
      }
      if (pac && atl) ans.add(Arrays.asList(sr, sc));
    }
    return ans;
  }
}`,
            cpp: `class Solution {
public:
  vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
    int rows=(int)heights.size(), cols=(int)heights[0].size();
    vector<vector<int>> ans;
    int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
    for (int sr=0; sr<rows; sr++) for (int sc=0; sc<cols; sc++) {
      vector<vector<int>> seen(rows, vector<int>(cols));
      vector<pair<int,int>> st; st.push_back({sr,sc}); seen[sr][sc]=1;
      bool pac=false, atl=false;
      while (!st.empty()) {
        auto cur=st.back(); st.pop_back();
        int r=cur.first, c=cur.second;
        if (r==0||c==0) pac=true;
        if (r==rows-1||c==cols-1) atl=true;
        if (pac&&atl) break;
        for (int i=0;i<4;i++) {
          int nr=r+dirs[i][0], nc=c+dirs[i][1];
          if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
          if (seen[nr][nc] || heights[nr][nc] > heights[r][c]) continue;
          seen[nr][nc]=1; st.push_back({nr,nc});
        }
      }
      if (pac&&atl) ans.push_back({sr,sc});
    }
    return ans;
  }
};`,
            c: `#include <stdlib.h>
int** pacificAtlantic(int** heights, int rows, int cols, int* returnSize, int** returnColumnSizes) {
  int** ans = (int**)malloc(sizeof(int*)*rows*cols);
  int p = 0;
  int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
  int* seen = (int*)malloc(sizeof(int)*rows*cols);
  int* stx=(int*)malloc(sizeof(int)*rows*cols);
  int* sty=(int*)malloc(sizeof(int)*rows*cols);
  for (int sr=0; sr<rows; sr++) for (int sc=0; sc<cols; sc++) {
    for (int i=0;i<rows*cols;i++) seen[i]=0;
    int sn=0; stx[sn]=sr; sty[sn]=sc; sn++; seen[sr*cols+sc]=1;
    int pac=0, atl=0;
    while (sn) {
      int r=stx[--sn], c=sty[sn];
      if (r==0||c==0) pac=1;
      if (r==rows-1||c==cols-1) atl=1;
      if (pac&&atl) break;
      for (int i=0;i<4;i++) {
        int nr=r+dirs[i][0], nc=c+dirs[i][1];
        if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
        if (seen[nr*cols+nc] || heights[nr][nc] > heights[r][c]) continue;
        seen[nr*cols+nc]=1; stx[sn]=nr; sty[sn]=nc; sn++;
      }
    }
    if (pac&&atl) { ans[p]=(int*)malloc(sizeof(int)*2); ans[p][0]=sr; ans[p][1]=sc; p++; }
  }
  *returnSize = p;
  *returnColumnSizes = (int*)malloc(sizeof(int)*p);
  for (int i=0;i<p;i++) (*returnColumnSizes)[i]=2;
  return ans;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "Reverse the flow: water climbs to equal or higher cells. DFS from all Pacific border cells, then from all Atlantic border cells. A cell in both visited sets is an answer. Each cell is processed a constant number of times.",
          code: `function pacificAtlantic(heights) {
  const rows = heights.length, cols = heights[0].length;
  const pac = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
  const atl = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function dfs(r, c, seen) {
    seen[r][c] = true;
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (seen[nr][nc] || heights[nr][nc] < heights[r][c]) continue;
      dfs(nr, nc, seen);
    }
  }

  for (let r = 0; r < rows; r++) {
    dfs(r, 0, pac);
    dfs(r, cols - 1, atl);
  }
  for (let c = 0; c < cols; c++) {
    dfs(0, c, pac);
    dfs(rows - 1, c, atl);
  }

  const ans = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pac[r][c] && atl[r][c]) ans.push([r, c]);
    }
  }
  return ans;
}`,
          codes: {
            javascript: `function pacificAtlantic(heights) {
  const rows = heights.length, cols = heights[0].length;
  const pac = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
  const atl = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function dfs(r, c, seen) {
    seen[r][c] = true;
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (seen[nr][nc] || heights[nr][nc] < heights[r][c]) continue;
      dfs(nr, nc, seen);
    }
  }

  for (let r = 0; r < rows; r++) {
    dfs(r, 0, pac);
    dfs(r, cols - 1, atl);
  }
  for (let c = 0; c < cols; c++) {
    dfs(0, c, pac);
    dfs(rows - 1, c, atl);
  }

  const ans = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pac[r][c] && atl[r][c]) ans.push([r, c]);
    }
  }
  return ans;
}`,
            python: `def pacificAtlantic(heights):
  rows, cols = len(heights), len(heights[0])
  pac = [[False]*cols for _ in range(rows)]
  atl = [[False]*cols for _ in range(rows)]
  dirs = [[1,0],[-1,0],[0,1],[0,-1]]
  def dfs(r, c, seen):
    seen[r][c] = True
    for i in range(4):
      nr, nc = r+dirs[i][0], c+dirs[i][1]
      if nr<0 or nc<0 or nr>=rows or nc>=cols: continue
      if seen[nr][nc] or heights[nr][nc] < heights[r][c]: continue
      dfs(nr, nc, seen)
  for r in range(rows):
    dfs(r, 0, pac); dfs(r, cols-1, atl)
  for c in range(cols):
    dfs(0, c, pac); dfs(rows-1, c, atl)
  ans = []
  for r in range(rows):
    for c in range(cols):
      if pac[r][c] and atl[r][c]: ans.append([r,c])
  return ans`,
            java: `import java.util.*;
class Solution {
  int rows, cols;
  void dfs(int[][] h, int r, int c, boolean[][] seen) {
    seen[r][c] = true;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int i = 0; i < 4; i++) {
      int nr=r+dirs[i][0], nc=c+dirs[i][1];
      if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
      if (seen[nr][nc] || h[nr][nc] < h[r][c]) continue;
      dfs(h, nr, nc, seen);
    }
  }
  public List<List<Integer>> pacificAtlantic(int[][] heights) {
    rows = heights.length; cols = heights[0].length;
    boolean[][] pac = new boolean[rows][cols], atl = new boolean[rows][cols];
    for (int r = 0; r < rows; r++) { dfs(heights, r, 0, pac); dfs(heights, r, cols-1, atl); }
    for (int c = 0; c < cols; c++) { dfs(heights, 0, c, pac); dfs(heights, rows-1, c, atl); }
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++)
      if (pac[r][c] && atl[r][c]) ans.add(Arrays.asList(r, c));
    return ans;
  }
}`,
            cpp: `class Solution {
  int rows, cols;
  void dfs(vector<vector<int>>& h, int r, int c, vector<vector<int>>& seen) {
    seen[r][c]=1;
    int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
    for (int i=0;i<4;i++) {
      int nr=r+dirs[i][0], nc=c+dirs[i][1];
      if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
      if (seen[nr][nc] || h[nr][nc] < h[r][c]) continue;
      dfs(h, nr, nc, seen);
    }
  }
public:
  vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
    rows=(int)heights.size(); cols=(int)heights[0].size();
    vector<vector<int>> pac(rows, vector<int>(cols)), atl(rows, vector<int>(cols));
    for (int r=0;r<rows;r++) { dfs(heights,r,0,pac); dfs(heights,r,cols-1,atl); }
    for (int c=0;c<cols;c++) { dfs(heights,0,c,pac); dfs(heights,rows-1,c,atl); }
    vector<vector<int>> ans;
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) if (pac[r][c]&&atl[r][c]) ans.push_back({r,c});
    return ans;
  }
};`,
            c: `#include <stdlib.h>
int rows_p, cols_p;
void dfs_pa(int** h, int r, int c, int* seen) {
  seen[r*cols_p+c]=1;
  int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
  for (int i=0;i<4;i++) {
    int nr=r+dirs[i][0], nc=c+dirs[i][1];
    if (nr<0||nc<0||nr>=rows_p||nc>=cols_p) continue;
    if (seen[nr*cols_p+nc] || h[nr][nc] < h[r][c]) continue;
    dfs_pa(h, nr, nc, seen);
  }
}
int** pacificAtlantic(int** heights, int rows, int cols, int* returnSize, int** returnColumnSizes) {
  rows_p=rows; cols_p=cols;
  int* pac=(int*)calloc(rows*cols,sizeof(int));
  int* atl=(int*)calloc(rows*cols,sizeof(int));
  for (int r=0;r<rows;r++) { dfs_pa(heights,r,0,pac); dfs_pa(heights,r,cols-1,atl); }
  for (int c=0;c<cols;c++) { dfs_pa(heights,0,c,pac); dfs_pa(heights,rows-1,c,atl); }
  int** ans=(int**)malloc(sizeof(int*)*rows*cols); int p=0;
  for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) if (pac[r*cols+c]&&atl[r*cols+c]) {
    ans[p]=(int*)malloc(sizeof(int)*2); ans[p][0]=r; ans[p][1]=c; p++;
  }
  *returnSize=p; *returnColumnSizes=(int*)malloc(sizeof(int)*p);
  for (int i=0;i<p;i++) (*returnColumnSizes)[i]=2;
  return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "Same reverse idea with BFS from both oceans. No recursion on a huge grid. Complexity is still linear in cells. This is the interview upgrade when they worry about stack depth.",
          code: `function pacificAtlantic(heights) {
  const rows = heights.length, cols = heights[0].length;
  const pac = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
  const atl = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function bfs(q, seen) {
    while (q.length) {
      const cur = q.shift();
      const r = cur[0], c = cur[1];
      for (let i = 0; i < 4; i++) {
        const nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (seen[nr][nc] || heights[nr][nc] < heights[r][c]) continue;
        seen[nr][nc] = true;
        q.push([nr, nc]);
      }
    }
  }

  const qp = [], qa = [];
  for (let r = 0; r < rows; r++) {
    pac[r][0] = true; qp.push([r, 0]);
    atl[r][cols - 1] = true; qa.push([r, cols - 1]);
  }
  for (let c = 0; c < cols; c++) {
    pac[0][c] = true; qp.push([0, c]);
    atl[rows - 1][c] = true; qa.push([rows - 1, c]);
  }
  bfs(qp, pac);
  bfs(qa, atl);

  const ans = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pac[r][c] && atl[r][c]) ans.push([r, c]);
    }
  }
  return ans;
}`,
          codes: {
            javascript: `function pacificAtlantic(heights) {
  const rows = heights.length, cols = heights[0].length;
  const pac = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
  const atl = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function bfs(q, seen) {
    while (q.length) {
      const cur = q.shift();
      const r = cur[0], c = cur[1];
      for (let i = 0; i < 4; i++) {
        const nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (seen[nr][nc] || heights[nr][nc] < heights[r][c]) continue;
        seen[nr][nc] = true;
        q.push([nr, nc]);
      }
    }
  }

  const qp = [], qa = [];
  for (let r = 0; r < rows; r++) {
    pac[r][0] = true; qp.push([r, 0]);
    atl[r][cols - 1] = true; qa.push([r, cols - 1]);
  }
  for (let c = 0; c < cols; c++) {
    pac[0][c] = true; qp.push([0, c]);
    atl[rows - 1][c] = true; qa.push([rows - 1, c]);
  }
  bfs(qp, pac);
  bfs(qa, atl);

  const ans = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pac[r][c] && atl[r][c]) ans.push([r, c]);
    }
  }
  return ans;
}`,
            python: `from collections import deque
def pacificAtlantic(heights):
  rows, cols = len(heights), len(heights[0])
  pac = [[False]*cols for _ in range(rows)]
  atl = [[False]*cols for _ in range(rows)]
  dirs = [[1,0],[-1,0],[0,1],[0,-1]]
  def bfs(q, seen):
    while q:
      r, c = q.popleft()
      for i in range(4):
        nr, nc = r+dirs[i][0], c+dirs[i][1]
        if nr<0 or nc<0 or nr>=rows or nc>=cols: continue
        if seen[nr][nc] or heights[nr][nc] < heights[r][c]: continue
        seen[nr][nc] = True
        q.append((nr, nc))
  qp, qa = deque(), deque()
  for r in range(rows):
    pac[r][0]=True; qp.append((r,0))
    atl[r][cols-1]=True; qa.append((r,cols-1))
  for c in range(cols):
    pac[0][c]=True; qp.append((0,c))
    atl[rows-1][c]=True; qa.append((rows-1,c))
  bfs(qp, pac); bfs(qa, atl)
  ans=[]
  for r in range(rows):
    for c in range(cols):
      if pac[r][c] and atl[r][c]: ans.append([r,c])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> pacificAtlantic(int[][] heights) {
    int rows=heights.length, cols=heights[0].length;
    boolean[][] pac=new boolean[rows][cols], atl=new boolean[rows][cols];
    int[][] dirs={{1,0},{-1,0},{0,1},{0,-1}};
    ArrayDeque<int[]> qp=new ArrayDeque<int[]>(), qa=new ArrayDeque<int[]>();
    for (int r=0;r<rows;r++) {
      pac[r][0]=true; qp.addLast(new int[]{r,0});
      atl[r][cols-1]=true; qa.addLast(new int[]{r,cols-1});
    }
    for (int c=0;c<cols;c++) {
      pac[0][c]=true; qp.addLast(new int[]{0,c});
      atl[rows-1][c]=true; qa.addLast(new int[]{rows-1,c});
    }
    for (ArrayDeque<int[]> q : new ArrayDeque[]{qp}) {}
    ArrayDeque<int[]>[] qs = new ArrayDeque[]{qp, qa};
    boolean[][][] seens = {pac, atl};
    for (int t=0;t<2;t++) {
      ArrayDeque<int[]> q = t==0?qp:qa; boolean[][] seen=t==0?pac:atl;
      while (!q.isEmpty()) {
        int[] cur=q.pollFirst(); int r=cur[0], c=cur[1];
        for (int i=0;i<4;i++) {
          int nr=r+dirs[i][0], nc=c+dirs[i][1];
          if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
          if (seen[nr][nc] || heights[nr][nc] < heights[r][c]) continue;
          seen[nr][nc]=true; q.addLast(new int[]{nr,nc});
        }
      }
    }
    List<List<Integer>> ans=new ArrayList<List<Integer>>();
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) if (pac[r][c]&&atl[r][c]) ans.add(Arrays.asList(r,c));
    return ans;
  }
}`,
            cpp: `class Solution {
public:
  vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
    int rows=(int)heights.size(), cols=(int)heights[0].size();
    vector<vector<int>> pac(rows, vector<int>(cols)), atl(rows, vector<int>(cols));
    int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
    queue<pair<int,int>> qp, qa;
    for (int r=0;r<rows;r++) { pac[r][0]=1; qp.push({r,0}); atl[r][cols-1]=1; qa.push({r,cols-1}); }
    for (int c=0;c<cols;c++) { pac[0][c]=1; qp.push({0,c}); atl[rows-1][c]=1; qa.push({rows-1,c}); }
    auto bfs=[&](queue<pair<int,int>>& q, vector<vector<int>>& seen) {
      while (!q.empty()) {
        auto cur=q.front(); q.pop(); int r=cur.first, c=cur.second;
        for (int i=0;i<4;i++) {
          int nr=r+dirs[i][0], nc=c+dirs[i][1];
          if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
          if (seen[nr][nc] || heights[nr][nc] < heights[r][c]) continue;
          seen[nr][nc]=1; q.push({nr,nc});
        }
      }
    };
    bfs(qp, pac); bfs(qa, atl);
    vector<vector<int>> ans;
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) if (pac[r][c]&&atl[r][c]) ans.push_back({r,c});
    return ans;
  }
};`,
            c: `#include <stdlib.h>
void bfs_pa(int** h, int rows, int cols, int* qr, int* qc, int h0, int t, int* seen) {
  int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
  int hd=h0;
  while (hd<t) {
    int r=qr[hd], c=qc[hd]; hd++;
    for (int i=0;i<4;i++) {
      int nr=r+dirs[i][0], nc=c+dirs[i][1];
      if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
      if (seen[nr*cols+nc] || h[nr][nc] < h[r][c]) continue;
      seen[nr*cols+nc]=1; qr[t]=nr; qc[t]=c; /* bug: should be nc */
      qc[t]=nc; t++;
    }
  }
}
int** pacificAtlantic(int** heights, int rows, int cols, int* returnSize, int** returnColumnSizes) {
  int* pac=(int*)calloc(rows*cols,sizeof(int));
  int* atl=(int*)calloc(rows*cols,sizeof(int));
  int* qr=(int*)malloc(sizeof(int)*rows*cols*2);
  int* qc=(int*)malloc(sizeof(int)*rows*cols*2);
  int t=0;
  for (int r=0;r<rows;r++) { pac[r*cols+0]=1; qr[t]=r; qc[t]=0; t++; }
  int t2=0;
  int* qr2=(int*)malloc(sizeof(int)*rows*cols*2);
  int* qc2=(int*)malloc(sizeof(int)*rows*cols*2);
  for (int r=0;r<rows;r++) { atl[r*cols+cols-1]=1; qr2[t2]=r; qc2[t2]=cols-1; t2++; }
  for (int c=0;c<cols;c++) { pac[0*cols+c]=1; qr[t]=0; qc[t]=c; t++; atl[(rows-1)*cols+c]=1; qr2[t2]=rows-1; qc2[t2]=c; t2++; }
  bfs_pa(heights, rows, cols, qr, qc, 0, t, pac);
  bfs_pa(heights, rows, cols, qr2, qc2, 0, t2, atl);
  int** ans=(int**)malloc(sizeof(int*)*rows*cols); int p=0;
  for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) if (pac[r*cols+c]&&atl[r*cols+c]) {
    ans[p]=(int*)malloc(sizeof(int)*2); ans[p][0]=r; ans[p][1]=c; p++;
  }
  *returnSize=p; *returnColumnSizes=(int*)malloc(sizeof(int)*p);
  for (int i=0;i<p;i++) (*returnColumnSizes)[i]=2;
  return ans;
}`
          }
        }
      ]
    },
    {
      id: 6,
      level: "intermediate",
      q: "Graph Valid Tree",
      ask: "Google · Amazon · Meta · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/graph-valid-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/graph-valid-tree/"},{"name":"LintCode","url":"https://www.lintcode.com/problem/178/"}],
      a: "n nodes labeled 0 to n-1, and a list of undirected edges. Return true if these edges form a single tree: connected, and no cycle.\n\nExample: n = 5, edges [[0,1],[0,2],[0,3],[1,4]] is a tree. Add [1,2] and you get a cycle, so false.\n\nA tree on n nodes has exactly n-1 edges and is connected. Brute DFS with extra path copies. Optimal BFS connected-plus-n-1. More optimal Union-Find: a union that is already in the same set is a cycle.",
      solutions: [
        {
          name: "Brute",
          time: "O(n + e)",
          space: "O(n + e)",
          why: "Build the list, then from node 0 DFS with a fresh onPath copy at each step to catch a cycle. Count how many nodes were seen. Extra copies are the brute part; the idea (connected + acyclic) is right.",
          code: `function validTree(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) {
    const u = edges[i][0], v = edges[i][1];
    g[u].push(v);
    g[v].push(u);
  }
  const seen = Array(n).fill(false);
  function dfs(u, parent, onPath) {
    if (onPath[u]) return false;
    const copy = onPath.slice();
    copy[u] = true;
    seen[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      if (v === parent) continue;
      if (!dfs(v, u, copy)) return false;
    }
    return true;
  }
  if (!dfs(0, -1, Array(n).fill(false))) return false;
  for (let i = 0; i < n; i++) if (!seen[i]) return false;
  return true;
}`,
          codes: {
            javascript: `function validTree(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) {
    const u = edges[i][0], v = edges[i][1];
    g[u].push(v);
    g[v].push(u);
  }
  const seen = Array(n).fill(false);
  function dfs(u, parent, onPath) {
    if (onPath[u]) return false;
    const copy = onPath.slice();
    copy[u] = true;
    seen[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      if (v === parent) continue;
      if (!dfs(v, u, copy)) return false;
    }
    return true;
  }
  if (!dfs(0, -1, Array(n).fill(false))) return false;
  for (let i = 0; i < n; i++) if (!seen[i]) return false;
  return true;
}`,
            python: `def validTree(n, edges):
  g = [[] for _ in range(n)]
  for u, v in edges:
    g[u].append(v); g[v].append(u)
  seen = [False] * n
  def dfs(u, parent, onPath):
    if onPath[u]: return False
    copy = onPath[:]
    copy[u] = True
    seen[u] = True
    for v in g[u]:
      if v == parent: continue
      if not dfs(v, u, copy): return False
    return True
  if not dfs(0, -1, [False]*n): return False
  return all(seen)`,
            java: `import java.util.*;
class Solution {
  boolean[] seen;
  boolean dfs(List<List<Integer>> g, int u, int parent, boolean[] onPath) {
    if (onPath[u]) return false;
    boolean[] copy = onPath.clone(); copy[u] = true; seen[u] = true;
    for (int v : g.get(u)) {
      if (v == parent) continue;
      if (!dfs(g, v, u, copy)) return false;
    }
    return true;
  }
  public boolean validTree(int n, int[][] edges) {
    List<List<Integer>> g = new ArrayList<List<Integer>>();
    for (int i = 0; i < n; i++) g.add(new ArrayList<Integer>());
    for (int[] e : edges) { g.get(e[0]).add(e[1]); g.get(e[1]).add(e[0]); }
    seen = new boolean[n];
    if (!dfs(g, 0, -1, new boolean[n])) return false;
    for (boolean s : seen) if (!s) return false;
    return true;
  }
}`,
            cpp: `class Solution {
  vector<int> seen;
  bool dfs(vector<vector<int>>& g, int u, int parent, vector<int> onPath) {
    if (onPath[u]) return false;
    onPath[u]=1; seen[u]=1;
    for (int v : g[u]) {
      if (v==parent) continue;
      if (!dfs(g, v, u, onPath)) return false;
    }
    return true;
  }
public:
  bool validTree(int n, vector<vector<int>>& edges) {
    vector<vector<int>> g(n);
    for (auto& e : edges) { g[e[0]].push_back(e[1]); g[e[1]].push_back(e[0]); }
    seen.assign(n, 0);
    if (!dfs(g, 0, -1, vector<int>(n))) return false;
    for (int i=0;i<n;i++) if (!seen[i]) return false;
    return true;
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
int seen_vt[10005];
int dfs_vt(int** g, int* deg, int u, int parent, int* onPath, int n) {
  if (onPath[u]) return 0;
  int* copy=(int*)malloc(sizeof(int)*n); memcpy(copy,onPath,sizeof(int)*n);
  copy[u]=1; seen_vt[u]=1;
  for (int i=0;i<deg[u];i++) {
    int v=g[u][i]; if (v==parent) continue;
    if (!dfs_vt(g,deg,v,u,copy,n)) { free(copy); return 0; }
  }
  free(copy); return 1;
}
int validTree(int n, int** edges, int e) {
  int* deg=(int*)calloc(n,sizeof(int));
  for (int i=0;i<e;i++) { deg[edges[i][0]]++; deg[edges[i][1]]++; }
  int** g=(int**)malloc(sizeof(int*)*n);
  for (int i=0;i<n;i++) { g[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); deg[i]=0; }
  for (int i=0;i<e;i++) { g[edges[i][0]][deg[edges[i][0]]++]=edges[i][1]; g[edges[i][1]][deg[edges[i][1]]++]=edges[i][0]; }
  memset(seen_vt,0,sizeof(int)*n);
  int* on=(int*)calloc(n,sizeof(int));
  if (!dfs_vt(g,deg,0,-1,on,n)) return 0;
  for (int i=0;i<n;i++) if (!seen_vt[i]) return 0;
  return 1;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "A tree must have n-1 edges. Then one BFS/DFS from 0 must reach every node. If it does, there is no extra edge and no missing node, so no cycle.",
          code: `function validTree(n, edges) {
  if (edges.length !== n - 1) return false;
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) {
    g[edges[i][0]].push(edges[i][1]);
    g[edges[i][1]].push(edges[i][0]);
  }
  const seen = Array(n).fill(false);
  const q = [0];
  seen[0] = true;
  let count = 0;
  while (q.length) {
    const u = q.shift();
    count++;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      if (seen[v]) continue;
      seen[v] = true;
      q.push(v);
    }
  }
  return count === n;
}`,
          codes: {
            javascript: `function validTree(n, edges) {
  if (edges.length !== n - 1) return false;
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) {
    g[edges[i][0]].push(edges[i][1]);
    g[edges[i][1]].push(edges[i][0]);
  }
  const seen = Array(n).fill(false);
  const q = [0];
  seen[0] = true;
  let count = 0;
  while (q.length) {
    const u = q.shift();
    count++;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      if (seen[v]) continue;
      seen[v] = true;
      q.push(v);
    }
  }
  return count === n;
}`,
            python: `from collections import deque
def validTree(n, edges):
  if len(edges) != n - 1: return False
  g = [[] for _ in range(n)]
  for u, v in edges:
    g[u].append(v); g[v].append(u)
  seen = [False]*n
  q = deque([0]); seen[0]=True; count=0
  while q:
    u = q.popleft(); count += 1
    for v in g[u]:
      if seen[v]: continue
      seen[v]=True; q.append(v)
  return count == n`,
            java: `import java.util.*;
class Solution {
  public boolean validTree(int n, int[][] edges) {
    if (edges.length != n - 1) return false;
    List<List<Integer>> g = new ArrayList<List<Integer>>();
    for (int i = 0; i < n; i++) g.add(new ArrayList<Integer>());
    for (int[] e : edges) { g.get(e[0]).add(e[1]); g.get(e[1]).add(e[0]); }
    boolean[] seen = new boolean[n];
    ArrayDeque<Integer> q = new ArrayDeque<Integer>();
    q.addLast(0); seen[0]=true; int count=0;
    while (!q.isEmpty()) {
      int u=q.pollFirst(); count++;
      for (int v : g.get(u)) { if (seen[v]) continue; seen[v]=true; q.addLast(v); }
    }
    return count == n;
  }
}`,
            cpp: `class Solution {
public:
  bool validTree(int n, vector<vector<int>>& edges) {
    if ((int)edges.size() != n-1) return false;
    vector<vector<int>> g(n);
    for (auto& e : edges) { g[e[0]].push_back(e[1]); g[e[1]].push_back(e[0]); }
    vector<int> seen(n); queue<int> q; q.push(0); seen[0]=1; int count=0;
    while (!q.empty()) {
      int u=q.front(); q.pop(); count++;
      for (int v : g[u]) { if (seen[v]) continue; seen[v]=1; q.push(v); }
    }
    return count == n;
  }
};`,
            c: `#include <stdlib.h>
int validTree(int n, int** edges, int e) {
  if (e != n-1) return 0;
  int* deg=(int*)calloc(n,sizeof(int));
  for (int i=0;i<e;i++) { deg[edges[i][0]]++; deg[edges[i][1]]++; }
  int** g=(int**)malloc(sizeof(int*)*n);
  for (int i=0;i<n;i++) { g[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); deg[i]=0; }
  for (int i=0;i<e;i++) { g[edges[i][0]][deg[edges[i][0]]++]=edges[i][1]; g[edges[i][1]][deg[edges[i][1]]++]=edges[i][0]; }
  int* seen=(int*)calloc(n,sizeof(int));
  int* q=(int*)malloc(sizeof(int)*n); int h=0,t=0,count=0;
  q[t++]=0; seen[0]=1;
  while (h<t) { int u=q[h++]; count++;
    for (int i=0;i<deg[u];i++) { int v=g[u][i]; if (seen[v]) continue; seen[v]=1; q[t++]=v; }
  }
  return count==n;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Union-Find. If two ends already share a parent, that edge is a cycle. After n-1 successful unions you have one component. No adjacency list needed.",
          code: `function validTree(n, edges) {
  if (edges.length !== n - 1) return false;
  const parent = Array.from({ length: n }, function (_, i) { return i; });
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  for (let i = 0; i < edges.length; i++) {
    const a = find(edges[i][0]);
    const b = find(edges[i][1]);
    if (a === b) return false;
    parent[b] = a;
  }
  return true;
}`,
          codes: {
            javascript: `function validTree(n, edges) {
  if (edges.length !== n - 1) return false;
  const parent = Array.from({ length: n }, function (_, i) { return i; });
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  for (let i = 0; i < edges.length; i++) {
    const a = find(edges[i][0]);
    const b = find(edges[i][1]);
    if (a === b) return false;
    parent[b] = a;
  }
  return true;
}`,
            python: `def validTree(n, edges):
  if len(edges) != n - 1: return False
  parent = list(range(n))
  def find(x):
    while parent[x] != x:
      parent[x] = parent[parent[x]]
      x = parent[x]
    return x
  for u, v in edges:
    a, b = find(u), find(v)
    if a == b: return False
    parent[b] = a
  return True`,
            java: `class Solution {
  int find(int[] parent, int x) {
    while (parent[x] != x) { parent[x]=parent[parent[x]]; x=parent[x]; }
    return x;
  }
  public boolean validTree(int n, int[][] edges) {
    if (edges.length != n-1) return false;
    int[] parent = new int[n];
    for (int i=0;i<n;i++) parent[i]=i;
    for (int[] e : edges) {
      int a=find(parent,e[0]), b=find(parent,e[1]);
      if (a==b) return false;
      parent[b]=a;
    }
    return true;
  }
}`,
            cpp: `class Solution {
  int find(vector<int>& p, int x) {
    while (p[x]!=x) { p[x]=p[p[x]]; x=p[x]; } return x;
  }
public:
  bool validTree(int n, vector<vector<int>>& edges) {
    if ((int)edges.size()!=n-1) return false;
    vector<int> parent(n); iota(parent.begin(), parent.end(), 0);
    for (auto& e : edges) {
      int a=find(parent,e[0]), b=find(parent,e[1]);
      if (a==b) return false;
      parent[b]=a;
    }
    return true;
  }
};`,
            c: `#include <stdlib.h>
int find_vt(int* p, int x) { while (p[x]!=x) { p[x]=p[p[x]]; x=p[x]; } return x; }
int validTree(int n, int** edges, int e) {
  if (e != n-1) return 0;
  int* parent=(int*)malloc(sizeof(int)*n);
  for (int i=0;i<n;i++) parent[i]=i;
  for (int i=0;i<e;i++) {
    int a=find_vt(parent,edges[i][0]), b=find_vt(parent,edges[i][1]);
    if (a==b) return 0;
    parent[b]=a;
  }
  return 1;
}`
          }
        }
      ]
    },
    {
      id: 7,
      level: "intermediate",
      q: "Number of Connected Components in an Undirected Graph",
      ask: "Amazon · Google · Meta",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/number-of-provinces/1"}],
      a: "n nodes, undirected edges. Return how many connected pieces the graph has.\n\nExample: n = 5, edges [[0,1],[1,2],[3,4]] has two components: {0,1,2} and {3,4}.\n\nBrute restarts DFS with extra visited copies. Optimal is one visited array and a DFS/BFS per unvisited node. More optimal is Union-Find: start at n, subtract one for each merge.",
      solutions: [
        {
          name: "Brute",
          time: "O(n·(n + e))",
          space: "O(n + e)",
          why: "For every unvisited node we DFS with a copied seen array. We still need a global mark so we do not recount. The copies add work without changing the answer.",
          code: `function countComponents(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) {
    g[edges[i][0]].push(edges[i][1]);
    g[edges[i][1]].push(edges[i][0]);
  }
  const global = Array(n).fill(false);
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (global[i]) continue;
    count++;
    const seen = global.slice();
    const stack = [i];
    seen[i] = true;
    while (stack.length) {
      const u = stack.pop();
      global[u] = true;
      for (let k = 0; k < g[u].length; k++) {
        const v = g[u][k];
        if (seen[v]) continue;
        seen[v] = true;
        stack.push(v);
      }
    }
  }
  return count;
}`,
          codes: {
            javascript: `function countComponents(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) {
    g[edges[i][0]].push(edges[i][1]);
    g[edges[i][1]].push(edges[i][0]);
  }
  const global = Array(n).fill(false);
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (global[i]) continue;
    count++;
    const seen = global.slice();
    const stack = [i];
    seen[i] = true;
    while (stack.length) {
      const u = stack.pop();
      global[u] = true;
      for (let k = 0; k < g[u].length; k++) {
        const v = g[u][k];
        if (seen[v]) continue;
        seen[v] = true;
        stack.push(v);
      }
    }
  }
  return count;
}`,
            python: `def countComponents(n, edges):
  g = [[] for _ in range(n)]
  for u, v in edges:
    g[u].append(v); g[v].append(u)
  globalv = [False]*n
  count = 0
  for i in range(n):
    if globalv[i]: continue
    count += 1
    seen = globalv[:]
    stack = [i]; seen[i]=True
    while stack:
      u = stack.pop(); globalv[u]=True
      for v in g[u]:
        if seen[v]: continue
        seen[v]=True; stack.append(v)
  return count`,
            java: `import java.util.*;
class Solution {
  public int countComponents(int n, int[][] edges) {
    List<List<Integer>> g = new ArrayList<List<Integer>>();
    for (int i=0;i<n;i++) g.add(new ArrayList<Integer>());
    for (int[] e : edges) { g.get(e[0]).add(e[1]); g.get(e[1]).add(e[0]); }
    boolean[] global = new boolean[n];
    int count=0;
    for (int i=0;i<n;i++) {
      if (global[i]) continue;
      count++;
      boolean[] seen=global.clone();
      ArrayDeque<Integer> stack=new ArrayDeque<Integer>();
      stack.push(i); seen[i]=true;
      while (!stack.isEmpty()) {
        int u=stack.pop(); global[u]=true;
        for (int v : g.get(u)) { if (seen[v]) continue; seen[v]=true; stack.push(v); }
      }
    }
    return count;
  }
}`,
            cpp: `class Solution {
public:
  int countComponents(int n, vector<vector<int>>& edges) {
    vector<vector<int>> g(n);
    for (auto& e : edges) { g[e[0]].push_back(e[1]); g[e[1]].push_back(e[0]); }
    vector<int> global(n); int count=0;
    for (int i=0;i<n;i++) {
      if (global[i]) continue;
      count++;
      vector<int> seen=global;
      vector<int> st; st.push_back(i); seen[i]=1;
      while (!st.empty()) {
        int u=st.back(); st.pop_back(); global[u]=1;
        for (int v : g[u]) { if (seen[v]) continue; seen[v]=1; st.push_back(v); }
      }
    }
    return count;
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
int countComponents(int n, int** edges, int e) {
  int* deg=(int*)calloc(n,sizeof(int));
  for (int i=0;i<e;i++) { deg[edges[i][0]]++; deg[edges[i][1]]++; }
  int** g=(int**)malloc(sizeof(int*)*n);
  for (int i=0;i<n;i++) { g[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); deg[i]=0; }
  for (int i=0;i<e;i++) { g[edges[i][0]][deg[edges[i][0]]++]=edges[i][1]; g[edges[i][1]][deg[edges[i][1]]++]=edges[i][0]; }
  int* global=(int*)calloc(n,sizeof(int));
  int* seen=(int*)malloc(sizeof(int)*n);
  int* st=(int*)malloc(sizeof(int)*n);
  int count=0;
  for (int i=0;i<n;i++) {
    if (global[i]) continue;
    count++;
    memcpy(seen,global,sizeof(int)*n);
    int sn=0; st[sn++]=i; seen[i]=1;
    while (sn) {
      int u=st[--sn]; global[u]=1;
      for (int k=0;k<deg[u];k++) { int v=g[u][i]; /* bug */ v=g[u][k]; if (seen[v]) continue; seen[v]=1; st[sn++]=v; }
    }
  }
  return count;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n + e)",
          space: "O(n + e)",
          why: "Standard connected-component walk. Each start of a DFS on an unseen node is one component. Linear in nodes and edges.",
          code: `function countComponents(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) {
    g[edges[i][0]].push(edges[i][1]);
    g[edges[i][1]].push(edges[i][0]);
  }
  const seen = Array(n).fill(false);
  function dfs(u) {
    seen[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      if (!seen[g[u][i]]) dfs(g[u][i]);
    }
  }
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (seen[i]) continue;
    count++;
    dfs(i);
  }
  return count;
}`,
          codes: {
            javascript: `function countComponents(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) {
    g[edges[i][0]].push(edges[i][1]);
    g[edges[i][1]].push(edges[i][0]);
  }
  const seen = Array(n).fill(false);
  function dfs(u) {
    seen[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      if (!seen[g[u][i]]) dfs(g[u][i]);
    }
  }
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (seen[i]) continue;
    count++;
    dfs(i);
  }
  return count;
}`,
            python: `def countComponents(n, edges):
  g = [[] for _ in range(n)]
  for u, v in edges:
    g[u].append(v); g[v].append(u)
  seen = [False]*n
  def dfs(u):
    seen[u]=True
    for v in g[u]:
      if not seen[v]: dfs(v)
  count=0
  for i in range(n):
    if seen[i]: continue
    count += 1
    dfs(i)
  return count`,
            java: `import java.util.*;
class Solution {
  void dfs(List<List<Integer>> g, int u, boolean[] seen) {
    seen[u]=true;
    for (int v : g.get(u)) if (!seen[v]) dfs(g, v, seen);
  }
  public int countComponents(int n, int[][] edges) {
    List<List<Integer>> g=new ArrayList<List<Integer>>();
    for (int i=0;i<n;i++) g.add(new ArrayList<Integer>());
    for (int[] e : edges) { g.get(e[0]).add(e[1]); g.get(e[1]).add(e[0]); }
    boolean[] seen=new boolean[n];
    int count=0;
    for (int i=0;i<n;i++) { if (seen[i]) continue; count++; dfs(g,i,seen); }
    return count;
  }
}`,
            cpp: `class Solution {
  void dfs(vector<vector<int>>& g, int u, vector<int>& seen) {
    seen[u]=1; for (int v : g[u]) if (!seen[v]) dfs(g,v,seen);
  }
public:
  int countComponents(int n, vector<vector<int>>& edges) {
    vector<vector<int>> g(n);
    for (auto& e : edges) { g[e[0]].push_back(e[1]); g[e[1]].push_back(e[0]); }
    vector<int> seen(n); int count=0;
    for (int i=0;i<n;i++) { if (seen[i]) continue; count++; dfs(g,i,seen); }
    return count;
  }
};`,
            c: `#include <stdlib.h>
void dfs_cc(int** g, int* deg, int u, int* seen) {
  seen[u]=1;
  for (int i=0;i<deg[u];i++) if (!seen[g[u][i]]) dfs_cc(g,deg,g[u][i],seen);
}
int countComponents(int n, int** edges, int e) {
  int* deg=(int*)calloc(n,sizeof(int));
  for (int i=0;i<e;i++) { deg[edges[i][0]]++; deg[edges[i][1]]++; }
  int** g=(int**)malloc(sizeof(int*)*n);
  for (int i=0;i<n;i++) { g[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); deg[i]=0; }
  for (int i=0;i<e;i++) { g[edges[i][0]][deg[edges[i][0]]++]=edges[i][1]; g[edges[i][1]][deg[edges[i][1]]++]=edges[i][0]; }
  int* seen=(int*)calloc(n,sizeof(int)); int count=0;
  for (int i=0;i<n;i++) { if (seen[i]) continue; count++; dfs_cc(g,deg,i,seen); }
  return count;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n + e)",
          space: "O(n)",
          why: "Union-Find with no adjacency list. comps starts at n. Each successful union glues two pieces, so comps drops by 1. Path compression keeps finds cheap.",
          code: `function countComponents(n, edges) {
  const parent = Array.from({ length: n }, function (_, i) { return i; });
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  let comps = n;
  for (let i = 0; i < edges.length; i++) {
    const a = find(edges[i][0]);
    const b = find(edges[i][1]);
    if (a === b) continue;
    parent[b] = a;
    comps--;
  }
  return comps;
}`,
          codes: {
            javascript: `function countComponents(n, edges) {
  const parent = Array.from({ length: n }, function (_, i) { return i; });
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  let comps = n;
  for (let i = 0; i < edges.length; i++) {
    const a = find(edges[i][0]);
    const b = find(edges[i][1]);
    if (a === b) continue;
    parent[b] = a;
    comps--;
  }
  return comps;
}`,
            python: `def countComponents(n, edges):
  parent = list(range(n))
  def find(x):
    while parent[x] != x:
      parent[x] = parent[parent[x]]
      x = parent[x]
    return x
  comps = n
  for u, v in edges:
    a, b = find(u), find(v)
    if a == b: continue
    parent[b] = a
    comps -= 1
  return comps`,
            java: `class Solution {
  int find(int[] p, int x) { while (p[x]!=x) { p[x]=p[p[x]]; x=p[x]; } return x; }
  public int countComponents(int n, int[][] edges) {
    int[] parent=new int[n];
    for (int i=0;i<n;i++) parent[i]=i;
    int comps=n;
    for (int[] e : edges) {
      int a=find(parent,e[0]), b=find(parent,e[1]);
      if (a==b) continue;
      parent[b]=a; comps--;
    }
    return comps;
  }
}`,
            cpp: `class Solution {
  int find(vector<int>& p, int x) { while (p[x]!=x) { p[x]=p[p[x]]; x=p[x]; } return x; }
public:
  int countComponents(int n, vector<vector<int>>& edges) {
    vector<int> parent(n); iota(parent.begin(), parent.end(), 0);
    int comps=n;
    for (auto& e : edges) {
      int a=find(parent,e[0]), b=find(parent,e[1]);
      if (a==b) continue;
      parent[b]=a; comps--;
    }
    return comps;
  }
};`,
            c: `#include <stdlib.h>
int find_cc(int* p, int x) { while (p[x]!=x) { p[x]=p[p[x]]; x=p[x]; } return x; }
int countComponents(int n, int** edges, int e) {
  int* parent=(int*)malloc(sizeof(int)*n);
  for (int i=0;i<n;i++) parent[i]=i;
  int comps=n;
  for (int i=0;i<e;i++) {
    int a=find_cc(parent,edges[i][0]), b=find_cc(parent,edges[i][1]);
    if (a==b) continue;
    parent[b]=a; comps--;
  }
  return comps;
}`
          }
        }
      ]
    },
    {
      id: 8,
      level: "advanced",
      q: "Word Ladder",
      ask: "Amazon · Google · Meta · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/word-ladder/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/word-ladder/1"}],
      a: "beginWord, endWord, and a wordList of the same length. A step changes exactly one letter to another real word in the list. Return the length of the shortest transformation sequence, or 0 if none exists. Length counts the words, so beginWord -> hot -> dot -> dog -> cog is 5.\n\nExample: begin hit, end cog, list [hot,dot,dog,lot,log,cog] answers 5.\n\nThis is unweighted shortest path on a huge implicit graph. Brute DFS explores every ladder. Optimal BFS. More optimal searches from both ends.",
      solutions: [
        {
          name: "Brute",
          time: "O(26^L · n)",
          space: "O(n·L)",
          why: "DFS with a copied remaining-word set at every step. It can walk long dead paths before it finds the short ladder. Exponential in ladder length.",
          code: `function ladderLength(beginWord, endWord, wordList) {
  const words = new Set(wordList);
  if (!words.has(endWord)) return 0;
  let best = Infinity;

  function dfs(word, dist, left) {
    if (dist >= best) return;
    if (word === endWord) {
      best = dist;
      return;
    }
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const ch = String.fromCharCode(c);
        const next = word.slice(0, i) + ch + word.slice(i + 1);
        if (!left.has(next)) continue;
        const copy = new Set(left);
        copy.delete(next);
        dfs(next, dist + 1, copy);
      }
    }
  }

  dfs(beginWord, 1, words);
  return best === Infinity ? 0 : best;
}`,
          codes: {
            javascript: `function ladderLength(beginWord, endWord, wordList) {
  const words = new Set(wordList);
  if (!words.has(endWord)) return 0;
  let best = Infinity;

  function dfs(word, dist, left) {
    if (dist >= best) return;
    if (word === endWord) {
      best = dist;
      return;
    }
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const ch = String.fromCharCode(c);
        const next = word.slice(0, i) + ch + word.slice(i + 1);
        if (!left.has(next)) continue;
        const copy = new Set(left);
        copy.delete(next);
        dfs(next, dist + 1, copy);
      }
    }
  }

  dfs(beginWord, 1, words);
  return best === Infinity ? 0 : best;
}`,
            python: `def ladderLength(beginWord, endWord, wordList):
  words = set(wordList)
  if endWord not in words: return 0
  best = float("inf")
  def dfs(word, dist, left):
    nonlocal best
    if dist >= best: return
    if word == endWord:
      best = dist
      return
    for i in range(len(word)):
      for c in range(97, 123):
        nxt = word[:i] + chr(c) + word[i+1:]
        if nxt not in left: continue
        copy = set(left)
        copy.discard(nxt)
        dfs(nxt, dist+1, copy)
  dfs(beginWord, 1, words)
  return 0 if best == float("inf") else best`,
            java: `import java.util.*;
class Solution {
  int best;
  void dfs(String word, int dist, Set<String> left, String endWord) {
    if (dist >= best) return;
    if (word.equals(endWord)) { best = dist; return; }
    char[] arr = word.toCharArray();
    for (int i = 0; i < arr.length; i++) {
      char old = arr[i];
      for (char c = 'a'; c <= 'z'; c++) {
        arr[i] = c;
        String next = new String(arr);
        if (!left.contains(next)) continue;
        Set<String> copy = new HashSet<String>(left);
        copy.remove(next);
        dfs(next, dist+1, copy, endWord);
      }
      arr[i] = old;
    }
  }
  public int ladderLength(String beginWord, String endWord, List<String> wordList) {
    Set<String> words = new HashSet<String>(wordList);
    if (!words.contains(endWord)) return 0;
    best = Integer.MAX_VALUE;
    dfs(beginWord, 1, words, endWord);
    return best == Integer.MAX_VALUE ? 0 : best;
  }
}`,
            cpp: `class Solution {
  int best;
  void dfs(string word, int dist, unordered_set<string> left, string endWord) {
    if (dist >= best) return;
    if (word == endWord) { best = dist; return; }
    for (int i = 0; i < (int)word.size(); i++) {
      char old = word[i];
      for (char c = 'a'; c <= 'z'; c++) {
        word[i] = c;
        if (!left.count(word)) continue;
        auto copy = left; copy.erase(word);
        dfs(word, dist+1, copy, endWord);
      }
      word[i] = old;
    }
  }
public:
  int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
    unordered_set<string> words(wordList.begin(), wordList.end());
    if (!words.count(endWord)) return 0;
    best = INT_MAX;
    dfs(beginWord, 1, words, endWord);
    return best == INT_MAX ? 0 : best;
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
#include <limits.h>
int best_ll;
int has_word(char** left, int n, int* used, const char* w) {
  for (int i=0;i<n;i++) if (!used[i] && !strcmp(left[i], w)) return i;
  return -1;
}
void dfs_ll(char* word, int dist, char** left, int n, int* used, const char* endWord) {
  if (dist >= best_ll) return;
  if (!strcmp(word, endWord)) { best_ll = dist; return; }
  int L = (int)strlen(word);
  char* next = (char*)malloc(L+1); strcpy(next, word);
  for (int i=0;i<L;i++) {
    char old = next[i];
    for (char c='a'; c<='z'; c++) {
      next[i]=c;
      int idx = has_word(left, n, used, next);
      if (idx < 0) continue;
      int* copy=(int*)malloc(sizeof(int)*n); memcpy(copy, used, sizeof(int)*n); copy[idx]=1;
      dfs_ll(next, dist+1, left, n, copy, endWord);
      free(copy);
    }
    next[i]=old;
  }
  free(next);
}
int ladderLength(char* beginWord, char* endWord, char** wordList, int n) {
  int found=0; for (int i=0;i<n;i++) if (!strcmp(wordList[i], endWord)) found=1;
  if (!found) return 0;
  best_ll = INT_MAX;
  int* used=(int*)calloc(n,sizeof(int));
  dfs_ll(beginWord, 1, wordList, n, used, endWord);
  return best_ll==INT_MAX ? 0 : best_ll;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n·L·26)",
          space: "O(n·L)",
          why: "BFS from beginWord. Each word is enqueued once. Trying 26 letters at each index is the usual neighbor generator. First time you hit endWord is the shortest length.",
          code: `function ladderLength(beginWord, endWord, wordList) {
  const words = new Set(wordList);
  if (!words.has(endWord)) return 0;
  const q = [[beginWord, 1]];
  words.delete(beginWord);
  while (q.length) {
    const cur = q.shift();
    const word = cur[0], dist = cur[1];
    if (word === endWord) return dist;
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const next = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
        if (!words.has(next)) continue;
        words.delete(next);
        q.push([next, dist + 1]);
      }
    }
  }
  return 0;
}`,
          codes: {
            javascript: `function ladderLength(beginWord, endWord, wordList) {
  const words = new Set(wordList);
  if (!words.has(endWord)) return 0;
  const q = [[beginWord, 1]];
  words.delete(beginWord);
  while (q.length) {
    const cur = q.shift();
    const word = cur[0], dist = cur[1];
    if (word === endWord) return dist;
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const next = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
        if (!words.has(next)) continue;
        words.delete(next);
        q.push([next, dist + 1]);
      }
    }
  }
  return 0;
}`,
            python: `from collections import deque
def ladderLength(beginWord, endWord, wordList):
  words = set(wordList)
  if endWord not in words: return 0
  q = deque([(beginWord, 1)])
  words.discard(beginWord)
  while q:
    word, dist = q.popleft()
    if word == endWord: return dist
    for i in range(len(word)):
      for c in range(97, 123):
        nxt = word[:i] + chr(c) + word[i+1:]
        if nxt not in words: continue
        words.discard(nxt)
        q.append((nxt, dist+1))
  return 0`,
            java: `import java.util.*;
class Solution {
  public int ladderLength(String beginWord, String endWord, List<String> wordList) {
    Set<String> words = new HashSet<String>(wordList);
    if (!words.contains(endWord)) return 0;
    ArrayDeque<String> q = new ArrayDeque<String>();
    ArrayDeque<Integer> d = new ArrayDeque<Integer>();
    q.addLast(beginWord); d.addLast(1);
    words.remove(beginWord);
    while (!q.isEmpty()) {
      String word = q.pollFirst(); int dist = d.pollFirst();
      if (word.equals(endWord)) return dist;
      char[] arr = word.toCharArray();
      for (int i = 0; i < arr.length; i++) {
        char old = arr[i];
        for (char c = 'a'; c <= 'z'; c++) {
          arr[i] = c;
          String next = new String(arr);
          if (!words.contains(next)) continue;
          words.remove(next);
          q.addLast(next); d.addLast(dist+1);
        }
        arr[i] = old;
      }
    }
    return 0;
  }
}`,
            cpp: `class Solution {
public:
  int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
    unordered_set<string> words(wordList.begin(), wordList.end());
    if (!words.count(endWord)) return 0;
    queue<pair<string,int>> q;
    q.push({beginWord, 1});
    words.erase(beginWord);
    while (!q.empty()) {
      auto cur = q.front(); q.pop();
      string word = cur.first; int dist = cur.second;
      if (word == endWord) return dist;
      for (int i = 0; i < (int)word.size(); i++) {
        char old = word[i];
        for (char c = 'a'; c <= 'z'; c++) {
          word[i] = c;
          if (!words.count(word)) continue;
          words.erase(word);
          q.push({word, dist+1});
        }
        word[i] = old;
      }
    }
    return 0;
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
int in_set(char** w, int n, int* used, const char* s) {
  for (int i=0;i<n;i++) if (!used[i] && !strcmp(w[i], s)) return i;
  return -1;
}
int ladderLength(char* beginWord, char* endWord, char** wordList, int n) {
  int found=0; for (int i=0;i<n;i++) if (!strcmp(wordList[i], endWord)) found=1;
  if (!found) return 0;
  int* used=(int*)calloc(n,sizeof(int));
  int bi=in_set(wordList,n,used,beginWord); if (bi>=0) used[bi]=1;
  int cap=n+2; char** q=(char**)malloc(sizeof(char*)*cap); int* dist=(int*)malloc(sizeof(int)*cap);
  int h=0,t=0; q[t]=beginWord; dist[t]=1; t++;
  int L=(int)strlen(beginWord);
  while (h<t) {
    char* word=q[h]; int d=dist[h]; h++;
    if (!strcmp(word, endWord)) return d;
    char* next=(char*)malloc(L+1); strcpy(next, word);
    for (int i=0;i<L;i++) {
      char old=next[i];
      for (char c='a';c<='z';c++) {
        next[i]=c;
        int idx=in_set(wordList,n,used,next);
        if (idx<0) continue;
        used[idx]=1;
        q[t]=wordList[idx]; dist[t]=d+1; t++;
      }
      next[i]=old;
    }
    free(next);
  }
  return 0;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n·L·26)",
          space: "O(n·L)",
          why: "Bidirectional BFS. Expand the smaller frontier each round. When a candidate sits in the other set, the two searches met. Branching is cut roughly in half on typical dictionaries.",
          code: `function ladderLength(beginWord, endWord, wordList) {
  const words = new Set(wordList);
  if (!words.has(endWord)) return 0;
  let begin = new Set([beginWord]);
  let end = new Set([endWord]);
  const seen = new Set([beginWord, endWord]);
  let steps = 1;
  while (begin.size && end.size) {
    if (begin.size > end.size) {
      const tmp = begin; begin = end; end = tmp;
    }
    const next = new Set();
    const beginArr = Array.from(begin);
    for (let b = 0; b < beginArr.length; b++) {
      const word = beginArr[b];
      for (let i = 0; i < word.length; i++) {
        for (let c = 97; c <= 122; c++) {
          const cand = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
          if (end.has(cand)) return steps + 1;
          if (!words.has(cand) || seen.has(cand)) continue;
          seen.add(cand);
          next.add(cand);
        }
      }
    }
    begin = next;
    steps++;
  }
  return 0;
}`,
          codes: {
            javascript: `function ladderLength(beginWord, endWord, wordList) {
  const words = new Set(wordList);
  if (!words.has(endWord)) return 0;
  let begin = new Set([beginWord]);
  let end = new Set([endWord]);
  const seen = new Set([beginWord, endWord]);
  let steps = 1;
  while (begin.size && end.size) {
    if (begin.size > end.size) {
      const tmp = begin; begin = end; end = tmp;
    }
    const next = new Set();
    const beginArr = Array.from(begin);
    for (let b = 0; b < beginArr.length; b++) {
      const word = beginArr[b];
      for (let i = 0; i < word.length; i++) {
        for (let c = 97; c <= 122; c++) {
          const cand = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
          if (end.has(cand)) return steps + 1;
          if (!words.has(cand) || seen.has(cand)) continue;
          seen.add(cand);
          next.add(cand);
        }
      }
    }
    begin = next;
    steps++;
  }
  return 0;
}`,
            python: `def ladderLength(beginWord, endWord, wordList):
  words = set(wordList)
  if endWord not in words: return 0
  begin = {beginWord}
  end = {endWord}
  seen = {beginWord, endWord}
  steps = 1
  while begin and end:
    if len(begin) > len(end):
      begin, end = end, begin
    nxt = set()
    for word in list(begin):
      for i in range(len(word)):
        for c in range(97, 123):
          cand = word[:i] + chr(c) + word[i+1:]
          if cand in end: return steps + 1
          if cand not in words or cand in seen: continue
          seen.add(cand)
          nxt.add(cand)
    begin = nxt
    steps += 1
  return 0`,
            java: `import java.util.*;
class Solution {
  public int ladderLength(String beginWord, String endWord, List<String> wordList) {
    Set<String> words = new HashSet<String>(wordList);
    if (!words.contains(endWord)) return 0;
    Set<String> begin = new HashSet<String>(), end = new HashSet<String>(), seen = new HashSet<String>();
    begin.add(beginWord); end.add(endWord); seen.add(beginWord); seen.add(endWord);
    int steps = 1;
    while (!begin.isEmpty() && !end.isEmpty()) {
      if (begin.size() > end.size()) { Set<String> tmp=begin; begin=end; end=tmp; }
      Set<String> next = new HashSet<String>();
      for (String word : begin) {
        char[] arr = word.toCharArray();
        for (int i = 0; i < arr.length; i++) {
          char old = arr[i];
          for (char c = 'a'; c <= 'z'; c++) {
            arr[i] = c;
            String cand = new String(arr);
            if (end.contains(cand)) return steps + 1;
            if (!words.contains(cand) || seen.contains(cand)) continue;
            seen.add(cand); next.add(cand);
          }
          arr[i] = old;
        }
      }
      begin = next; steps++;
    }
    return 0;
  }
}`,
            cpp: `class Solution {
public:
  int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
    unordered_set<string> words(wordList.begin(), wordList.end());
    if (!words.count(endWord)) return 0;
    unordered_set<string> begin{beginWord}, end{endWord}, seen{beginWord, endWord};
    int steps = 1;
    while (!begin.empty() && !end.empty()) {
      if (begin.size() > end.size()) swap(begin, end);
      unordered_set<string> next;
      for (string word : begin) {
        for (int i = 0; i < (int)word.size(); i++) {
          char old = word[i];
          for (char c = 'a'; c <= 'z'; c++) {
            word[i] = c;
            if (end.count(word)) return steps + 1;
            if (!words.count(word) || seen.count(word)) continue;
            seen.insert(word); next.insert(word);
          }
          word[i] = old;
        }
      }
      begin.swap(next); steps++;
    }
    return 0;
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
/* bidirectional BFS: two frontier arrays of word indices; words[n] plus begin as extra */
int ladderLength(char* beginWord, char* endWord, char** wordList, int n) {
  int endIdx=-1;
  for (int i=0;i<n;i++) if (!strcmp(wordList[i], endWord)) endIdx=i;
  if (endIdx<0) return 0;
  int* seen=(int*)calloc(n+1,sizeof(int));
  int* b1=(int*)malloc(sizeof(int)*(n+1));
  int* b2=(int*)malloc(sizeof(int)*(n+1));
  int n1=1, n2=1; b1[0]=-1; /* -1 means beginWord */ b2[0]=endIdx;
  seen[endIdx]=1;
  int steps=1;
  while (n1 && n2) {
    if (n1>n2) { int* t=b1; b1=b2; b2=t; int tn=n1; n1=n2; n2=tn; }
    int nn=0; int* next=(int*)malloc(sizeof(int)*(n+1));
    for (int b=0;b<n1;b++) {
      char* word = b1[b]<0 ? beginWord : wordList[b1[b]];
      int L=(int)strlen(word);
      char* cand=(char*)malloc(L+1); strcpy(cand, word);
      for (int i=0;i<L;i++) {
        char old=cand[i];
        for (char c='a';c<='z';c++) {
          cand[i]=c;
          int inEnd=0;
          for (int k=0;k<n2;k++) {
            char* ew = b2[k]<0 ? beginWord : wordList[b2[k]];
            if (!strcmp(cand, ew)) { free(cand); return steps+1; }
          }
          int idx=-1;
          for (int j=0;j<n;j++) if (!seen[j] && !strcmp(wordList[j], cand)) { idx=j; break; }
          if (idx<0) continue;
          seen[idx]=1; next[nn++]=idx;
        }
        cand[i]=old;
      }
      free(cand);
    }
    free(b1); b1=next; n1=nn; steps++;
  }
  return 0;
}`
          }
        }
      ]
    },
    {
      id: 9,
      level: "intermediate",
      q: "Rotting Oranges",
      ask: "Amazon · Google · Microsoft · Uber",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/rotting-oranges/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/rotten-oranges/1"}],
      a: "A grid: 0 empty, 1 fresh orange, 2 rotten. Every minute, every rotten orange infects its 4-direction neighbors. Return minutes until no fresh orange remains, or -1 if some orange never rots.\n\nExample: [[2,1,1],[1,1,0],[0,1,1]] takes 4 minutes.\n\nBrute rescan the whole grid each minute. Optimal is multi-source BFS from every initial 2. More optimal stores the minute on the grid so you do not keep a separate time field.",
      solutions: [
        {
          name: "Brute",
          time: "O((rc)²)",
          space: "O(rc)",
          why: "Each minute, copy the grid and rot any fresh cell that touches a 2. Repeat until nothing changes. You scan the whole grid once per minute, up to rc minutes.",
          code: `function orangesRotting(grid) {
  const rows = grid.length, cols = grid[0].length;
  function countFresh(g) {
    let n = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) if (g[r][c] === 1) n++;
    }
    return n;
  }
  let minutes = 0;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (true) {
    const next = grid.map(function (row) { return row.slice(); });
    let changed = false;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] !== 2) continue;
        for (let i = 0; i < 4; i++) {
          const nr = r + dirs[i][0], nc = c + dirs[i][1];
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
          if (grid[nr][nc] !== 1) continue;
          next[nr][nc] = 2;
          changed = true;
        }
      }
    }
    if (!changed) break;
    grid = next;
    minutes++;
  }
  return countFresh(grid) ? -1 : minutes;
}`,
          codes: {
            javascript: `function orangesRotting(grid) {
  const rows = grid.length, cols = grid[0].length;
  function countFresh(g) {
    let n = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) if (g[r][c] === 1) n++;
    }
    return n;
  }
  let minutes = 0;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (true) {
    const next = grid.map(function (row) { return row.slice(); });
    let changed = false;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] !== 2) continue;
        for (let i = 0; i < 4; i++) {
          const nr = r + dirs[i][0], nc = c + dirs[i][1];
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
          if (grid[nr][nc] !== 1) continue;
          next[nr][nc] = 2;
          changed = true;
        }
      }
    }
    if (!changed) break;
    grid = next;
    minutes++;
  }
  return countFresh(grid) ? -1 : minutes;
}`,
            python: `def orangesRotting(grid):
  rows, cols = len(grid), len(grid[0])
  def countFresh(g):
    n = 0
    for r in range(rows):
      for c in range(cols):
        if g[r][c] == 1: n += 1
    return n
  minutes = 0
  dirs = [[1,0],[-1,0],[0,1],[0,-1]]
  while True:
    nxt = [row[:] for row in grid]
    changed = False
    for r in range(rows):
      for c in range(cols):
        if grid[r][c] != 2: continue
        for i in range(4):
          nr, nc = r+dirs[i][0], c+dirs[i][1]
          if nr<0 or nc<0 or nr>=rows or nc>=cols: continue
          if grid[nr][nc] != 1: continue
          nxt[nr][nc] = 2
          changed = True
    if not changed: break
    grid = nxt
    minutes += 1
  return -1 if countFresh(grid) else minutes`,
            java: `class Solution {
  public int orangesRotting(int[][] grid) {
    int rows=grid.length, cols=grid[0].length;
    int minutes=0;
    int[][] dirs={{1,0},{-1,0},{0,1},{0,-1}};
    while (true) {
      int[][] next=new int[rows][cols];
      for (int r=0;r<rows;r++) next[r]=grid[r].clone();
      boolean changed=false;
      for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
        if (grid[r][c]!=2) continue;
        for (int i=0;i<4;i++) {
          int nr=r+dirs[i][0], nc=c+dirs[i][1];
          if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
          if (grid[nr][nc]!=1) continue;
          next[nr][nc]=2; changed=true;
        }
      }
      if (!changed) break;
      grid=next; minutes++;
    }
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) if (grid[r][c]==1) return -1;
    return minutes;
  }
}`,
            cpp: `class Solution {
public:
  int orangesRotting(vector<vector<int>>& grid) {
    int rows=(int)grid.size(), cols=(int)grid[0].size();
    int minutes=0;
    int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
    while (true) {
      auto next=grid; bool changed=false;
      for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
        if (grid[r][c]!=2) continue;
        for (int i=0;i<4;i++) {
          int nr=r+dirs[i][0], nc=c+dirs[i][1];
          if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
          if (grid[nr][nc]!=1) continue;
          next[nr][nc]=2; changed=true;
        }
      }
      if (!changed) break;
      grid=next; minutes++;
    }
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) if (grid[r][c]==1) return -1;
    return minutes;
  }
};`,
            c: `#include <stdlib.h>
int orangesRotting(int** grid, int rows, int cols) {
  int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
  int minutes=0;
  int* next=(int*)malloc(sizeof(int)*rows*cols);
  while (1) {
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) next[r*cols+c]=grid[r][c];
    int changed=0;
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
      if (grid[r][c]!=2) continue;
      for (int i=0;i<4;i++) {
        int nr=r+dirs[i][0], nc=c+dirs[i][1];
        if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
        if (grid[nr][nc]!=1) continue;
        next[nr*cols+nc]=2; changed=1;
      }
    }
    if (!changed) break;
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) grid[r][c]=next[r*cols+c];
    minutes++;
  }
  for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) if (grid[r][c]==1) return -1;
  return minutes;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "Put every rotten orange in the queue at minute 0. BFS infects fresh neighbors. The last minute you used is the answer. If any 1 remains, return -1.",
          code: `function orangesRotting(grid) {
  const rows = grid.length, cols = grid[0].length;
  const q = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) q.push([r, c, 0]);
      if (grid[r][c] === 1) fresh++;
    }
  }
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let minutes = 0;
  while (q.length) {
    const cur = q.shift();
    const r = cur[0], c = cur[1], t = cur[2];
    minutes = t;
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (grid[nr][nc] !== 1) continue;
      grid[nr][nc] = 2;
      fresh--;
      q.push([nr, nc, t + 1]);
    }
  }
  return fresh === 0 ? minutes : -1;
}`,
          codes: {
            javascript: `function orangesRotting(grid) {
  const rows = grid.length, cols = grid[0].length;
  const q = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) q.push([r, c, 0]);
      if (grid[r][c] === 1) fresh++;
    }
  }
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let minutes = 0;
  while (q.length) {
    const cur = q.shift();
    const r = cur[0], c = cur[1], t = cur[2];
    minutes = t;
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (grid[nr][nc] !== 1) continue;
      grid[nr][nc] = 2;
      fresh--;
      q.push([nr, nc, t + 1]);
    }
  }
  return fresh === 0 ? minutes : -1;
}`,
            python: `from collections import deque
def orangesRotting(grid):
  rows, cols = len(grid), len(grid[0])
  q = deque()
  fresh = 0
  for r in range(rows):
    for c in range(cols):
      if grid[r][c]==2: q.append((r,c,0))
      if grid[r][c]==1: fresh += 1
  dirs = [[1,0],[-1,0],[0,1],[0,-1]]
  minutes = 0
  while q:
    r,c,t = q.popleft()
    minutes = t
    for i in range(4):
      nr, nc = r+dirs[i][0], c+dirs[i][1]
      if nr<0 or nc<0 or nr>=rows or nc>=cols: continue
      if grid[nr][nc]!=1: continue
      grid[nr][nc]=2; fresh -= 1
      q.append((nr,nc,t+1))
  return minutes if fresh==0 else -1`,
            java: `import java.util.*;
class Solution {
  public int orangesRotting(int[][] grid) {
    int rows=grid.length, cols=grid[0].length;
    ArrayDeque<int[]> q=new ArrayDeque<int[]>();
    int fresh=0;
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
      if (grid[r][c]==2) q.addLast(new int[]{r,c,0});
      if (grid[r][c]==1) fresh++;
    }
    int[][] dirs={{1,0},{-1,0},{0,1},{0,-1}};
    int minutes=0;
    while (!q.isEmpty()) {
      int[] cur=q.pollFirst(); int r=cur[0],c=cur[1],t=cur[2];
      minutes=t;
      for (int i=0;i<4;i++) {
        int nr=r+dirs[i][0], nc=c+dirs[i][1];
        if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
        if (grid[nr][nc]!=1) continue;
        grid[nr][nc]=2; fresh--;
        q.addLast(new int[]{nr,nc,t+1});
      }
    }
    return fresh==0 ? minutes : -1;
  }
}`,
            cpp: `class Solution {
public:
  int orangesRotting(vector<vector<int>>& grid) {
    int rows=(int)grid.size(), cols=(int)grid[0].size();
    queue<array<int,3>> q; int fresh=0;
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
      if (grid[r][c]==2) q.push({r,c,0});
      if (grid[r][c]==1) fresh++;
    }
    int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
    int minutes=0;
    while (!q.empty()) {
      auto cur=q.front(); q.pop();
      int r=cur[0],c=cur[1],t=cur[2]; minutes=t;
      for (int i=0;i<4;i++) {
        int nr=r+dirs[i][0], nc=c+dirs[i][1];
        if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
        if (grid[nr][nc]!=1) continue;
        grid[nr][nc]=2; fresh--;
        q.push({nr,nc,t+1});
      }
    }
    return fresh==0 ? minutes : -1;
  }
};`,
            c: `#include <stdlib.h>
int orangesRotting(int** grid, int rows, int cols) {
  int* qr=(int*)malloc(sizeof(int)*rows*cols);
  int* qc=(int*)malloc(sizeof(int)*rows*cols);
  int* qt=(int*)malloc(sizeof(int)*rows*cols);
  int h=0,t=0,fresh=0;
  for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
    if (grid[r][c]==2) { qr[t]=r; qc[t]=c; qt[t]=0; t++; }
    if (grid[r][c]==1) fresh++;
  }
  int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
  int minutes=0;
  while (h<t) {
    int r=qr[h],c=qc[h],tm=qt[h]; h++; minutes=tm;
    for (int i=0;i<4;i++) {
      int nr=r+dirs[i][0], nc=c+dirs[i][1];
      if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
      if (grid[nr][nc]!=1) continue;
      grid[nr][nc]=2; fresh--;
      qr[t]=nr; qc[t]=nc; qt[t]=tm+1; t++;
    }
  }
  return fresh==0 ? minutes : -1;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "Same multi-source BFS, but the grid itself stores time as 2 + minutes. No third tuple field. Space is still the queue. Linear in cells.",
          code: `function orangesRotting(grid) {
  const rows = grid.length, cols = grid[0].length;
  const q = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) q.push([r, c]);
      else if (grid[r][c] === 1) fresh++;
    }
  }
  if (fresh === 0) return 0;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let minutes = 0;
  while (q.length) {
    const size = q.length;
    let infected = false;
    for (let s = 0; s < size; s++) {
      const cur = q.shift();
      const r = cur[0], c = cur[1];
      for (let i = 0; i < 4; i++) {
        const nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (grid[nr][nc] !== 1) continue;
        grid[nr][nc] = 2;
        fresh--;
        infected = true;
        q.push([nr, nc]);
      }
    }
    if (infected) minutes++;
  }
  return fresh === 0 ? minutes : -1;
}`,
          codes: {
            javascript: `function orangesRotting(grid) {
  const rows = grid.length, cols = grid[0].length;
  const q = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) q.push([r, c]);
      else if (grid[r][c] === 1) fresh++;
    }
  }
  if (fresh === 0) return 0;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let minutes = 0;
  while (q.length) {
    const size = q.length;
    let infected = false;
    for (let s = 0; s < size; s++) {
      const cur = q.shift();
      const r = cur[0], c = cur[1];
      for (let i = 0; i < 4; i++) {
        const nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (grid[nr][nc] !== 1) continue;
        grid[nr][nc] = 2;
        fresh--;
        infected = true;
        q.push([nr, nc]);
      }
    }
    if (infected) minutes++;
  }
  return fresh === 0 ? minutes : -1;
}`,
            python: `from collections import deque
def orangesRotting(grid):
  rows, cols = len(grid), len(grid[0])
  q = deque()
  fresh = 0
  for r in range(rows):
    for c in range(cols):
      if grid[r][c]==2: q.append((r,c))
      elif grid[r][c]==1: fresh += 1
  if fresh==0: return 0
  dirs = [[1,0],[-1,0],[0,1],[0,-1]]
  minutes = 0
  while q:
    size = len(q)
    infected = False
    for s in range(size):
      r,c = q.popleft()
      for i in range(4):
        nr, nc = r+dirs[i][0], c+dirs[i][1]
        if nr<0 or nc<0 or nr>=rows or nc>=cols: continue
        if grid[nr][nc]!=1: continue
        grid[nr][nc]=2; fresh -= 1; infected=True
        q.append((nr,nc))
    if infected: minutes += 1
  return minutes if fresh==0 else -1`,
            java: `import java.util.*;
class Solution {
  public int orangesRotting(int[][] grid) {
    int rows=grid.length, cols=grid[0].length;
    ArrayDeque<int[]> q=new ArrayDeque<int[]>();
    int fresh=0;
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
      if (grid[r][c]==2) q.addLast(new int[]{r,c});
      else if (grid[r][c]==1) fresh++;
    }
    if (fresh==0) return 0;
    int[][] dirs={{1,0},{-1,0},{0,1},{0,-1}};
    int minutes=0;
    while (!q.isEmpty()) {
      int size=q.size(); boolean infected=false;
      for (int s=0;s<size;s++) {
        int[] cur=q.pollFirst(); int r=cur[0],c=cur[1];
        for (int i=0;i<4;i++) {
          int nr=r+dirs[i][0], nc=c+dirs[i][1];
          if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
          if (grid[nr][nc]!=1) continue;
          grid[nr][nc]=2; fresh--; infected=true; q.addLast(new int[]{nr,nc});
        }
      }
      if (infected) minutes++;
    }
    return fresh==0 ? minutes : -1;
  }
}`,
            cpp: `class Solution {
public:
  int orangesRotting(vector<vector<int>>& grid) {
    int rows=(int)grid.size(), cols=(int)grid[0].size();
    queue<pair<int,int>> q; int fresh=0;
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
      if (grid[r][c]==2) q.push({r,c});
      else if (grid[r][c]==1) fresh++;
    }
    if (!fresh) return 0;
    int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
    int minutes=0;
    while (!q.empty()) {
      int size=(int)q.size(); bool infected=false;
      for (int s=0;s<size;s++) {
        auto cur=q.front(); q.pop(); int r=cur.first,c=cur.second;
        for (int i=0;i<4;i++) {
          int nr=r+dirs[i][0], nc=c+dirs[i][1];
          if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
          if (grid[nr][nc]!=1) continue;
          grid[nr][nc]=2; fresh--; infected=true; q.push({nr,nc});
        }
      }
      if (infected) minutes++;
    }
    return fresh==0 ? minutes : -1;
  }
};`,
            c: `#include <stdlib.h>
int orangesRotting(int** grid, int rows, int cols) {
  int* qr=(int*)malloc(sizeof(int)*rows*cols);
  int* qc=(int*)malloc(sizeof(int)*rows*cols);
  int h=0,t=0,fresh=0;
  for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
    if (grid[r][c]==2) { qr[t]=r; qc[t]=c; t++; }
    else if (grid[r][c]==1) fresh++;
  }
  if (!fresh) return 0;
  int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
  int minutes=0;
  while (h<t) {
    int size=t-h; int infected=0;
    for (int s=0;s<size;s++) {
      int r=qr[h], c=qc[h]; h++;
      for (int i=0;i<4;i++) {
        int nr=r+dirs[i][0], nc=c+dirs[i][1];
        if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
        if (grid[nr][nc]!=1) continue;
        grid[nr][nc]=2; fresh--; infected=1; qr[t]=nr; qc[t]=nc; t++;
      }
    }
    if (infected) minutes++;
  }
  return fresh==0 ? minutes : -1;
}`
          }
        }
      ]
    },
    {
      id: 10,
      level: "intermediate",
      q: "01 Matrix",
      ask: "Google · Amazon · Meta · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/01-matrix/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/distance-of-nearest-cell-having-1-1587115620/1"}],
      a: "A matrix of 0s and 1s. For every cell, return its distance to the nearest 0. Distance is 4-direction steps.\n\nExample: [[0,0,0],[0,1,0],[1,1,1]] becomes [[0,0,0],[0,1,0],[1,2,1]].\n\nBrute runs BFS from every 1. Optimal puts every 0 in one queue (multi-source BFS). More optimal is a two-pass DP: top-left then bottom-right.",
      solutions: [
        {
          name: "Brute",
          time: "O(r²c²)",
          space: "O(rc)",
          why: "For each 1, BFS with a fresh visited matrix until you hit a 0. You re-walk the same cells from many starts.",
          code: `function updateMatrix(mat) {
  const rows = mat.length, cols = mat[0].length;
  const out = Array.from({ length: rows }, function () { return Array(cols).fill(0); });
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function dist(sr, sc) {
    const seen = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
    const q = [[sr, sc, 0]];
    seen[sr][sc] = true;
    while (q.length) {
      const cur = q.shift();
      const r = cur[0], c = cur[1], d = cur[2];
      if (mat[r][c] === 0) return d;
      for (let i = 0; i < 4; i++) {
        const nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || seen[nr][nc]) continue;
        seen[nr][nc] = true;
        q.push([nr, nc, d + 1]);
      }
    }
    return 0;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (mat[r][c] !== 0) out[r][c] = dist(r, c);
    }
  }
  return out;
}`,
          codes: {
            javascript: `function updateMatrix(mat) {
  const rows = mat.length, cols = mat[0].length;
  const out = Array.from({ length: rows }, function () { return Array(cols).fill(0); });
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function dist(sr, sc) {
    const seen = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
    const q = [[sr, sc, 0]];
    seen[sr][sc] = true;
    while (q.length) {
      const cur = q.shift();
      const r = cur[0], c = cur[1], d = cur[2];
      if (mat[r][c] === 0) return d;
      for (let i = 0; i < 4; i++) {
        const nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || seen[nr][nc]) continue;
        seen[nr][nc] = true;
        q.push([nr, nc, d + 1]);
      }
    }
    return 0;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (mat[r][c] !== 0) out[r][c] = dist(r, c);
    }
  }
  return out;
}`,
            python: `from collections import deque
def updateMatrix(mat):
  rows, cols = len(mat), len(mat[0])
  out = [[0]*cols for _ in range(rows)]
  dirs = [[1,0],[-1,0],[0,1],[0,-1]]
  def dist(sr, sc):
    seen = [[False]*cols for _ in range(rows)]
    q = deque([(sr, sc, 0)])
    seen[sr][sc] = True
    while q:
      r,c,d = q.popleft()
      if mat[r][c]==0: return d
      for i in range(4):
        nr, nc = r+dirs[i][0], c+dirs[i][1]
        if nr<0 or nc<0 or nr>=rows or nc>=cols or seen[nr][nc]: continue
        seen[nr][nc]=True
        q.append((nr,nc,d+1))
    return 0
  for r in range(rows):
    for c in range(cols):
      if mat[r][c] != 0: out[r][c] = dist(r,c)
  return out`,
            java: `import java.util.*;
class Solution {
  public int[][] updateMatrix(int[][] mat) {
    int rows=mat.length, cols=mat[0].length;
    int[][] out=new int[rows][cols];
    int[][] dirs={{1,0},{-1,0},{0,1},{0,-1}};
    for (int sr=0; sr<rows; sr++) for (int sc=0; sc<cols; sc++) {
      if (mat[sr][sc]==0) continue;
      boolean[][] seen=new boolean[rows][cols];
      ArrayDeque<int[]> q=new ArrayDeque<int[]>();
      q.addLast(new int[]{sr,sc,0}); seen[sr][sc]=true;
      int d0=0;
      while (!q.isEmpty()) {
        int[] cur=q.pollFirst(); int r=cur[0],c=cur[1],d=cur[2];
        if (mat[r][c]==0) { d0=d; break; }
        for (int i=0;i<4;i++) {
          int nr=r+dirs[i][0], nc=c+dirs[i][1];
          if (nr<0||nc<0||nr>=rows||nc>=cols||seen[nr][nc]) continue;
          seen[nr][nc]=true; q.addLast(new int[]{nr,nc,d+1});
        }
      }
      out[sr][sc]=d0;
    }
    return out;
  }
}`,
            cpp: `class Solution {
public:
  vector<vector<int>> updateMatrix(vector<vector<int>>& mat) {
    int rows=(int)mat.size(), cols=(int)mat[0].size();
    vector<vector<int>> out(rows, vector<int>(cols));
    int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
    for (int sr=0;sr<rows;sr++) for (int sc=0;sc<cols;sc++) {
      if (mat[sr][sc]==0) continue;
      vector<vector<int>> seen(rows, vector<int>(cols));
      queue<array<int,3>> q; q.push({sr,sc,0}); seen[sr][sc]=1;
      while (!q.empty()) {
        auto cur=q.front(); q.pop();
        int r=cur[0],c=cur[1],d=cur[2];
        if (mat[r][c]==0) { out[sr][sc]=d; break; }
        for (int i=0;i<4;i++) {
          int nr=r+dirs[i][0], nc=c+dirs[i][1];
          if (nr<0||nc<0||nr>=rows||nc>=cols||seen[nr][nc]) continue;
          seen[nr][nc]=1; q.push({nr,nc,d+1});
        }
      }
    }
    return out;
  }
};`,
            c: `#include <stdlib.h>
int** updateMatrix(int** mat, int rows, int cols, int* returnSize, int** returnColumnSizes) {
  int** out=(int**)malloc(sizeof(int*)*rows);
  for (int r=0;r<rows;r++) { out[r]=(int*)calloc(cols,sizeof(int)); }
  int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
  int* seen=(int*)malloc(sizeof(int)*rows*cols);
  int* qr=(int*)malloc(sizeof(int)*rows*cols);
  int* qc=(int*)malloc(sizeof(int)*rows*cols);
  int* qd=(int*)malloc(sizeof(int)*rows*cols);
  for (int sr=0;sr<rows;sr++) for (int sc=0;sc<cols;sc++) {
    if (mat[sr][sc]==0) continue;
    for (int i=0;i<rows*cols;i++) seen[i]=0;
    int h=0,t=0; qr[t]=sr; qc[t]=sc; qd[t]=0; t++; seen[sr*cols+sc]=1;
    while (h<t) {
      int r=qr[h],c=qc[h],d=qd[h]; h++;
      if (mat[r][c]==0) { out[sr][sc]=d; break; }
      for (int i=0;i<4;i++) {
        int nr=r+dirs[i][0], nc=c+dirs[i][1];
        if (nr<0||nc<0||nr>=rows||nc>=cols||seen[nr*cols+nc]) continue;
        seen[nr*cols+nc]=1; qr[t]=nr; qc[t]=nc; qd[t]=d+1; t++;
      }
    }
  }
  *returnSize=rows; *returnColumnSizes=(int*)malloc(sizeof(int)*rows);
  for (int i=0;i<rows;i++) (*returnColumnSizes)[i]=cols;
  return out;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "Multi-source BFS from all zeros. Each 1 is reached first by its nearest 0. One visit per cell.",
          code: `function updateMatrix(mat) {
  const rows = mat.length, cols = mat[0].length;
  const inf = rows * cols;
  const dist = Array.from({ length: rows }, function () { return Array(cols).fill(inf); });
  const q = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (mat[r][c] === 0) {
        dist[r][c] = 0;
        q.push([r, c]);
      }
    }
  }
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.length) {
    const cur = q.shift();
    const r = cur[0], c = cur[1];
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (dist[nr][nc] <= dist[r][c] + 1) continue;
      dist[nr][nc] = dist[r][c] + 1;
      q.push([nr, nc]);
    }
  }
  return dist;
}`,
          codes: {
            javascript: `function updateMatrix(mat) {
  const rows = mat.length, cols = mat[0].length;
  const inf = rows * cols;
  const dist = Array.from({ length: rows }, function () { return Array(cols).fill(inf); });
  const q = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (mat[r][c] === 0) {
        dist[r][c] = 0;
        q.push([r, c]);
      }
    }
  }
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.length) {
    const cur = q.shift();
    const r = cur[0], c = cur[1];
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (dist[nr][nc] <= dist[r][c] + 1) continue;
      dist[nr][nc] = dist[r][c] + 1;
      q.push([nr, nc]);
    }
  }
  return dist;
}`,
            python: `from collections import deque
def updateMatrix(mat):
  rows, cols = len(mat), len(mat[0])
  inf = rows * cols
  dist = [[inf]*cols for _ in range(rows)]
  q = deque()
  for r in range(rows):
    for c in range(cols):
      if mat[r][c]==0:
        dist[r][c]=0; q.append((r,c))
  dirs = [[1,0],[-1,0],[0,1],[0,-1]]
  while q:
    r,c = q.popleft()
    for i in range(4):
      nr, nc = r+dirs[i][0], c+dirs[i][1]
      if nr<0 or nc<0 or nr>=rows or nc>=cols: continue
      if dist[nr][nc] <= dist[r][c]+1: continue
      dist[nr][nc] = dist[r][c]+1
      q.append((nr,nc))
  return dist`,
            java: `import java.util.*;
class Solution {
  public int[][] updateMatrix(int[][] mat) {
    int rows=mat.length, cols=mat[0].length, inf=rows*cols;
    int[][] dist=new int[rows][cols];
    ArrayDeque<int[]> q=new ArrayDeque<int[]>();
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
      if (mat[r][c]==0) { dist[r][c]=0; q.addLast(new int[]{r,c}); }
      else dist[r][c]=inf;
    }
    int[][] dirs={{1,0},{-1,0},{0,1},{0,-1}};
    while (!q.isEmpty()) {
      int[] cur=q.pollFirst(); int r=cur[0],c=cur[1];
      for (int i=0;i<4;i++) {
        int nr=r+dirs[i][0], nc=c+dirs[i][1];
        if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
        if (dist[nr][nc] <= dist[r][c]+1) continue;
        dist[nr][nc]=dist[r][c]+1; q.addLast(new int[]{nr,nc});
      }
    }
    return dist;
  }
}`,
            cpp: `class Solution {
public:
  vector<vector<int>> updateMatrix(vector<vector<int>>& mat) {
    int rows=(int)mat.size(), cols=(int)mat[0].size(), inf=rows*cols;
    vector<vector<int>> dist(rows, vector<int>(cols, inf));
    queue<pair<int,int>> q;
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) if (mat[r][c]==0) { dist[r][c]=0; q.push({r,c}); }
    int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
    while (!q.empty()) {
      auto cur=q.front(); q.pop(); int r=cur.first,c=cur.second;
      for (int i=0;i<4;i++) {
        int nr=r+dirs[i][0], nc=c+dirs[i][1];
        if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
        if (dist[nr][nc] <= dist[r][c]+1) continue;
        dist[nr][nc]=dist[r][c]+1; q.push({nr,nc});
      }
    }
    return dist;
  }
};`,
            c: `#include <stdlib.h>
int** updateMatrix(int** mat, int rows, int cols, int* returnSize, int** returnColumnSizes) {
  int inf=rows*cols;
  int** dist=(int**)malloc(sizeof(int*)*rows);
  for (int r=0;r<rows;r++) { dist[r]=(int*)malloc(sizeof(int)*cols); for (int c=0;c<cols;c++) dist[r][c]=inf; }
  int* qr=(int*)malloc(sizeof(int)*rows*cols);
  int* qc=(int*)malloc(sizeof(int)*rows*cols);
  int h=0,t=0;
  for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) if (mat[r][c]==0) { dist[r][c]=0; qr[t]=r; qc[t]=c; t++; }
  int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
  while (h<t) {
    int r=qr[h],c=qc[h]; h++;
    for (int i=0;i<4;i++) {
      int nr=r+dirs[i][0], nc=c+dirs[i][1];
      if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
      if (dist[nr][nc] <= dist[r][c]+1) continue;
      dist[nr][nc]=dist[r][c]+1; qr[t]=nr; qc[t]=nc; t++;
    }
  }
  *returnSize=rows; *returnColumnSizes=(int*)malloc(sizeof(int)*rows);
  for (int i=0;i<rows;i++) (*returnColumnSizes)[i]=cols;
  return dist;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(rc)",
          space: "O(1)",
          why: "Two DP sweeps. First pass uses top and left (already processed). Second pass uses bottom and right. You can write into the output matrix only; extra space is O(1) besides the answer. Same linear time, no queue.",
          code: `function updateMatrix(mat) {
  const rows = mat.length, cols = mat[0].length;
  const inf = rows + cols;
  const dist = Array.from({ length: rows }, function (_, r) {
    return mat[r].map(function (v) { return v === 0 ? 0 : inf; });
  });
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r > 0) dist[r][c] = Math.min(dist[r][c], dist[r - 1][c] + 1);
      if (c > 0) dist[r][c] = Math.min(dist[r][c], dist[r][c - 1] + 1);
    }
  }
  for (let r = rows - 1; r >= 0; r--) {
    for (let c = cols - 1; c >= 0; c--) {
      if (r + 1 < rows) dist[r][c] = Math.min(dist[r][c], dist[r + 1][c] + 1);
      if (c + 1 < cols) dist[r][c] = Math.min(dist[r][c], dist[r][c + 1] + 1);
    }
  }
  return dist;
}`,
          codes: {
            javascript: `function updateMatrix(mat) {
  const rows = mat.length, cols = mat[0].length;
  const inf = rows + cols;
  const dist = Array.from({ length: rows }, function (_, r) {
    return mat[r].map(function (v) { return v === 0 ? 0 : inf; });
  });
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r > 0) dist[r][c] = Math.min(dist[r][c], dist[r - 1][c] + 1);
      if (c > 0) dist[r][c] = Math.min(dist[r][c], dist[r][c - 1] + 1);
    }
  }
  for (let r = rows - 1; r >= 0; r--) {
    for (let c = cols - 1; c >= 0; c--) {
      if (r + 1 < rows) dist[r][c] = Math.min(dist[r][c], dist[r + 1][c] + 1);
      if (c + 1 < cols) dist[r][c] = Math.min(dist[r][c], dist[r][c + 1] + 1);
    }
  }
  return dist;
}`,
            python: `def updateMatrix(mat):
  rows, cols = len(mat), len(mat[0])
  inf = rows + cols
  dist = [[0 if v==0 else inf for v in row] for r,row in enumerate(mat)]
  for r in range(rows):
    for c in range(cols):
      if r>0: dist[r][c] = min(dist[r][c], dist[r-1][c]+1)
      if c>0: dist[r][c] = min(dist[r][c], dist[r][c-1]+1)
  for r in range(rows-1, -1, -1):
    for c in range(cols-1, -1, -1):
      if r+1<rows: dist[r][c] = min(dist[r][c], dist[r+1][c]+1)
      if c+1<cols: dist[r][c] = min(dist[r][c], dist[r][c+1]+1)
  return dist`,
            java: `class Solution {
  public int[][] updateMatrix(int[][] mat) {
    int rows=mat.length, cols=mat[0].length, inf=rows+cols;
    int[][] dist=new int[rows][cols];
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) dist[r][c]=mat[r][c]==0?0:inf;
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
      if (r>0) dist[r][c]=Math.min(dist[r][c], dist[r-1][c]+1);
      if (c>0) dist[r][c]=Math.min(dist[r][c], dist[r][c-1]+1);
    }
    for (int r=rows-1;r>=0;r--) for (int c=cols-1;c>=0;c--) {
      if (r+1<rows) dist[r][c]=Math.min(dist[r][c], dist[r+1][c]+1);
      if (c+1<cols) dist[r][c]=Math.min(dist[r][c], dist[r][c+1]+1);
    }
    return dist;
  }
}`,
            cpp: `class Solution {
public:
  vector<vector<int>> updateMatrix(vector<vector<int>>& mat) {
    int rows=(int)mat.size(), cols=(int)mat[0].size(), inf=rows+cols;
    vector<vector<int>> dist(rows, vector<int>(cols));
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) dist[r][c]=mat[r][c]==0?0:inf;
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
      if (r>0) dist[r][c]=min(dist[r][c], dist[r-1][c]+1);
      if (c>0) dist[r][c]=min(dist[r][c], dist[r][c-1]+1);
    }
    for (int r=rows-1;r>=0;r--) for (int c=cols-1;c>=0;c--) {
      if (r+1<rows) dist[r][c]=min(dist[r][c], dist[r+1][c]+1);
      if (c+1<cols) dist[r][c]=min(dist[r][c], dist[r][c+1]+1);
    }
    return dist;
  }
};`,
            c: `#include <stdlib.h>
int** updateMatrix(int** mat, int rows, int cols, int* returnSize, int** returnColumnSizes) {
  int inf=rows+cols;
  int** dist=(int**)malloc(sizeof(int*)*rows);
  for (int r=0;r<rows;r++) {
    dist[r]=(int*)malloc(sizeof(int)*cols);
    for (int c=0;c<cols;c++) dist[r][c]=mat[r][c]==0?0:inf;
  }
  for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
    if (r>0 && dist[r-1][c]+1<dist[r][c]) dist[r][c]=dist[r-1][c]+1;
    if (c>0 && dist[r][c-1]+1<dist[r][c]) dist[r][c]=dist[r][c-1]+1;
  }
  for (int r=rows-1;r>=0;r--) for (int c=cols-1;c>=0;c--) {
    if (r+1<rows && dist[r+1][c]+1<dist[r][c]) dist[r][c]=dist[r+1][c]+1;
    if (c+1<cols && dist[r][c+1]+1<dist[r][c]) dist[r][c]=dist[r][c+1]+1;
  }
  *returnSize=rows; *returnColumnSizes=(int*)malloc(sizeof(int)*rows);
  for (int i=0;i<rows;i++) (*returnColumnSizes)[i]=cols;
  return dist;
}`
          }
        }
      ]
    },
    {
      id: 11,
      level: "advanced",
      q: "Alien Dictionary",
      ask: "Google · Amazon · Meta · Airbnb",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/alien-dictionary/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/alien-dictionary/1"}],
      a: "A list of words sorted in an alien alphabet. Derive a valid order of unique letters. If the order is invalid (cycle, or a longer word listed before its prefix), return \"\". Any valid topo order is accepted.\n\nExample: [wrt, wrf, er, ett, rftt] can return wertf.\n\nCompare neighbor words to build directed edges (earlier letter -> later letter). Then topo sort. Brute permutes letters. Optimal DFS. More optimal is Kahn.",
      solutions: [
        {
          name: "Brute",
          time: "O(k! · n · L)",
          space: "O(k)",
          why: "Collect unique letters, try every permutation, test it against consecutive word pairs. Fine for 3 letters, dead at 20. Proves you know the constraints.",
          code: `function alienOrder(words) {
  const letters = [];
  const seen = {};
  for (let w = 0; w < words.length; w++) {
    for (let i = 0; i < words[w].length; i++) {
      const ch = words[w][i];
      if (!seen[ch]) { seen[ch] = true; letters.push(ch); }
    }
  }
  function valid(order) {
    const rank = {};
    for (let i = 0; i < order.length; i++) rank[order[i]] = i;
    for (let i = 0; i < words.length - 1; i++) {
      const a = words[i], b = words[i + 1];
      const n = Math.min(a.length, b.length);
      let diff = false;
      for (let j = 0; j < n; j++) {
        if (a[j] !== b[j]) {
          if (rank[a[j]] > rank[b[j]]) return false;
          diff = true;
          break;
        }
      }
      if (!diff && a.length > b.length) return false;
    }
    return true;
  }
  let ans = "";
  function dfs(used, path) {
    if (ans) return;
    if (path.length === letters.length) {
      const s = path.join("");
      if (valid(s)) ans = s;
      return;
    }
    for (let i = 0; i < letters.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(letters[i]);
      dfs(used, path);
      path.pop();
      used[i] = false;
    }
  }
  dfs(Array(letters.length).fill(false), []);
  return ans;
}`,
          codes: {
            javascript: `function alienOrder(words) {
  const letters = [];
  const seen = {};
  for (let w = 0; w < words.length; w++) {
    for (let i = 0; i < words[w].length; i++) {
      const ch = words[w][i];
      if (!seen[ch]) { seen[ch] = true; letters.push(ch); }
    }
  }
  function valid(order) {
    const rank = {};
    for (let i = 0; i < order.length; i++) rank[order[i]] = i;
    for (let i = 0; i < words.length - 1; i++) {
      const a = words[i], b = words[i + 1];
      const n = Math.min(a.length, b.length);
      let diff = false;
      for (let j = 0; j < n; j++) {
        if (a[j] !== b[j]) {
          if (rank[a[j]] > rank[b[j]]) return false;
          diff = true;
          break;
        }
      }
      if (!diff && a.length > b.length) return false;
    }
    return true;
  }
  let ans = "";
  function dfs(used, path) {
    if (ans) return;
    if (path.length === letters.length) {
      const s = path.join("");
      if (valid(s)) ans = s;
      return;
    }
    for (let i = 0; i < letters.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(letters[i]);
      dfs(used, path);
      path.pop();
      used[i] = false;
    }
  }
  dfs(Array(letters.length).fill(false), []);
  return ans;
}`,
            python: `def alienOrder(words):
  letters = []
  seen = {}
  for w in words:
    for ch in w:
      if ch not in seen:
        seen[ch]=True; letters.append(ch)
  def valid(order):
    rank = {ch:i for i,ch in enumerate(order)}
    for i in range(len(words)-1):
      a, b = words[i], words[i+1]
      n = min(len(a), len(b))
      diff = False
      for j in range(n):
        if a[j]!=b[j]:
          if rank[a[j]] > rank[b[j]]: return False
          diff=True; break
      if not diff and len(a)>len(b): return False
    return True
  ans = ""
  def dfs(used, path):
    nonlocal ans
    if ans: return
    if len(path)==len(letters):
      s="".join(path)
      if valid(s): ans=s
      return
    for i in range(len(letters)):
      if used[i]: continue
      used[i]=True; path.append(letters[i]); dfs(used, path); path.pop(); used[i]=False
  dfs([False]*len(letters), [])
  return ans`,
            java: `import java.util.*;
class Solution {
  String ans;
  boolean valid(String order, String[] words) {
    int[] rank=new int[128];
    for (int i=0;i<order.length();i++) rank[order.charAt(i)]=i;
    for (int i=0;i<words.length-1;i++) {
      String a=words[i], b=words[i+1];
      int n=Math.min(a.length(), b.length());
      boolean diff=false;
      for (int j=0;j<n;j++) if (a.charAt(j)!=b.charAt(j)) {
        if (rank[a.charAt(j)]>rank[b.charAt(j)]) return false;
        diff=true; break;
      }
      if (!diff && a.length()>b.length()) return false;
    }
    return true;
  }
  void dfs(char[] letters, boolean[] used, StringBuilder path, String[] words) {
    if (ans.length()>0) return;
    if (path.length()==letters.length) {
      String s=path.toString();
      if (valid(s, words)) ans=s;
      return;
    }
    for (int i=0;i<letters.length;i++) {
      if (used[i]) continue;
      used[i]=true; path.append(letters[i]); dfs(letters, used, path, words);
      path.deleteCharAt(path.length()-1); used[i]=false;
    }
  }
  public String alienOrder(String[] words) {
    LinkedHashSet<Character> set=new LinkedHashSet<Character>();
    for (String w : words) for (char ch : w.toCharArray()) set.add(ch);
    char[] letters=new char[set.size()]; int k=0;
    for (char ch : set) letters[k++]=ch;
    ans="";
    dfs(letters, new boolean[letters.length], new StringBuilder(), words);
    return ans;
  }
}`,
            cpp: `class Solution {
  string ans;
  bool valid(const string& order, vector<string>& words) {
    int rank[128]={}; for (int i=0;i<(int)order.size();i++) rank[(int)order[i]]=i;
    for (int i=0;i<(int)words.size()-1;i++) {
      string a=words[i], b=words[i+1];
      int n=min((int)a.size(), (int)b.size()); bool diff=false;
      for (int j=0;j<n;j++) if (a[j]!=b[j]) {
        if (rank[(int)a[j]]>rank[(int)b[j]]) return false;
        diff=true; break;
      }
      if (!diff && a.size()>b.size()) return false;
    }
    return true;
  }
  void dfs(string& letters, vector<int>& used, string& path, vector<string>& words) {
    if (!ans.empty()) return;
    if (path.size()==letters.size()) { if (valid(path, words)) ans=path; return; }
    for (int i=0;i<(int)letters.size();i++) {
      if (used[i]) continue;
      used[i]=1; path.push_back(letters[i]); dfs(letters, used, path, words);
      path.pop_back(); used[i]=0;
    }
  }
public:
  string alienOrder(vector<string>& words) {
    string letters; int seen[128]={};
    for (auto& w : words) for (char ch : w) if (!seen[(int)ch]) { seen[(int)ch]=1; letters.push_back(ch); }
    ans=""; vector<int> used(letters.size()); string path;
    dfs(letters, used, path, words);
    return ans;
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
char ans_al[32];
int valid_al(const char* order, char** words, int nw) {
  int rank[128]={0};
  for (int i=0; order[i]; i++) rank[(int)order[i]]=i;
  for (int i=0;i<nw-1;i++) {
    char *a=words[i], *b=words[i+1];
    int na=(int)strlen(a), nb=(int)strlen(b), n=na<nb?na:nb, diff=0;
    for (int j=0;j<n;j++) if (a[j]!=b[j]) {
      if (rank[(int)a[j]]>rank[(int)b[j]]) return 0;
      diff=1; break;
    }
    if (!diff && na>nb) return 0;
  }
  return 1;
}
void dfs_al(char* letters, int k, int* used, char* path, int plen, char** words, int nw) {
  if (ans_al[0]) return;
  if (plen==k) { path[plen]=0; if (valid_al(path, words, nw)) strcpy(ans_al, path); return; }
  for (int i=0;i<k;i++) {
    if (used[i]) continue;
    used[i]=1; path[plen]=letters[i]; dfs_al(letters,k,used,path,plen+1,words,nw); used[i]=0;
  }
}
char* alienOrder(char** words, int nw) {
  char letters[32]; int k=0, seen[128]={0};
  for (int w=0;w<nw;w++) for (int i=0; words[w][i]; i++) {
    unsigned char ch=words[w][i]; if (!seen[ch]) { seen[ch]=1; letters[k++]=ch; }
  }
  ans_al[0]=0;
  int used[32]={0}; char path[32];
  dfs_al(letters,k,used,path,0,words,nw);
  char* out=(char*)malloc(32); strcpy(out, ans_al); return out;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n·L + k)",
          space: "O(k²)",
          why: "Build a letter graph from the first mismatch of each consecutive pair. Reject prefix violations. DFS 3-color topo, then reverse the postorder.",
          code: `function alienOrder(words) {
  const g = {};
  const state = {};
  for (let w = 0; w < words.length; w++) {
    for (let i = 0; i < words[w].length; i++) {
      const ch = words[w][i];
      if (!g[ch]) { g[ch] = new Set(); state[ch] = 0; }
    }
  }
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i], b = words[i + 1];
    const n = Math.min(a.length, b.length);
    let found = false;
    for (let j = 0; j < n; j++) {
      if (a[j] !== b[j]) {
        g[a[j]].add(b[j]);
        found = true;
        break;
      }
    }
    if (!found && a.length > b.length) return "";
  }
  const out = [];
  let cycle = false;
  function dfs(u) {
    if (state[u] === 1) { cycle = true; return; }
    if (state[u] === 2) return;
    state[u] = 1;
    const nei = Array.from(g[u]);
    for (let i = 0; i < nei.length; i++) dfs(nei[i]);
    state[u] = 2;
    out.push(u);
  }
  const keys = Object.keys(g);
  for (let i = 0; i < keys.length; i++) dfs(keys[i]);
  if (cycle) return "";
  return out.reverse().join("");
}`,
          codes: {
            javascript: `function alienOrder(words) {
  const g = {};
  const state = {};
  for (let w = 0; w < words.length; w++) {
    for (let i = 0; i < words[w].length; i++) {
      const ch = words[w][i];
      if (!g[ch]) { g[ch] = new Set(); state[ch] = 0; }
    }
  }
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i], b = words[i + 1];
    const n = Math.min(a.length, b.length);
    let found = false;
    for (let j = 0; j < n; j++) {
      if (a[j] !== b[j]) {
        g[a[j]].add(b[j]);
        found = true;
        break;
      }
    }
    if (!found && a.length > b.length) return "";
  }
  const out = [];
  let cycle = false;
  function dfs(u) {
    if (state[u] === 1) { cycle = true; return; }
    if (state[u] === 2) return;
    state[u] = 1;
    const nei = Array.from(g[u]);
    for (let i = 0; i < nei.length; i++) dfs(nei[i]);
    state[u] = 2;
    out.push(u);
  }
  const keys = Object.keys(g);
  for (let i = 0; i < keys.length; i++) dfs(keys[i]);
  if (cycle) return "";
  return out.reverse().join("");
}`,
            python: `def alienOrder(words):
  g = {}
  state = {}
  for w in words:
    for ch in w:
      if ch not in g: g[ch]=set(); state[ch]=0
  for i in range(len(words)-1):
    a, b = words[i], words[i+1]
    n = min(len(a), len(b)); found=False
    for j in range(n):
      if a[j]!=b[j]:
        g[a[j]].add(b[j]); found=True; break
    if not found and len(a)>len(b): return ""
  out=[]; cycle=False
  def dfs(u):
    nonlocal cycle
    if state[u]==1: cycle=True; return
    if state[u]==2: return
    state[u]=1
    for v in list(g[u]): dfs(v)
    state[u]=2; out.append(u)
  for k in list(g.keys()): dfs(k)
  if cycle: return ""
  return "".join(reversed(out))`,
            java: `import java.util.*;
class Solution {
  boolean cycle;
  void dfs(char u, Map<Character, Set<Character>> g, int[] state, List<Character> out) {
    if (state[u]==1) { cycle=true; return; }
    if (state[u]==2) return;
    state[u]=1;
    for (char v : g.get(u)) dfs(v, g, state, out);
    state[u]=2; out.add(u);
  }
  public String alienOrder(String[] words) {
    Map<Character, Set<Character>> g=new HashMap<Character, Set<Character>>();
    int[] state=new int[128];
    for (String w : words) for (char ch : w.toCharArray()) if (!g.containsKey(ch)) g.put(ch, new HashSet<Character>());
    for (int i=0;i<words.length-1;i++) {
      String a=words[i], b=words[i+1];
      int n=Math.min(a.length(), b.length()); boolean found=false;
      for (int j=0;j<n;j++) if (a.charAt(j)!=b.charAt(j)) { g.get(a.charAt(j)).add(b.charAt(j)); found=true; break; }
      if (!found && a.length()>b.length()) return "";
    }
    List<Character> out=new ArrayList<Character>(); cycle=false;
    for (char k : g.keySet()) dfs(k, g, state, out);
    if (cycle) return "";
    Collections.reverse(out);
    StringBuilder sb=new StringBuilder();
    for (char c : out) sb.append(c);
    return sb.toString();
  }
}`,
            cpp: `class Solution {
  bool cycle;
  void dfs(char u, unordered_map<char, unordered_set<char>>& g, unordered_map<char,int>& state, string& out) {
    if (state[u]==1) { cycle=true; return; }
    if (state[u]==2) return;
    state[u]=1;
    for (char v : g[u]) dfs(v, g, state, out);
    state[u]=2; out.push_back(u);
  }
public:
  string alienOrder(vector<string>& words) {
    unordered_map<char, unordered_set<char>> g;
    unordered_map<char,int> state;
    for (auto& w : words) for (char ch : w) { if (!g.count(ch)) { g[ch]={}; state[ch]=0; } }
    for (int i=0;i<(int)words.size()-1;i++) {
      string a=words[i], b=words[i+1];
      int n=min((int)a.size(),(int)b.size()); bool found=false;
      for (int j=0;j<n;j++) if (a[j]!=b[j]) { g[a[j]].insert(b[j]); found=true; break; }
      if (!found && a.size()>b.size()) return "";
    }
    string out; cycle=false;
    for (auto& p : g) dfs(p.first, g, state, out);
    if (cycle) return "";
    reverse(out.begin(), out.end());
    return out;
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
int g_al[128][32], gd_al[128], state_al[128], out_al[32], on_al, cycle_al, present_al[128];
void dfs_al2(int u) {
  if (state_al[u]==1) { cycle_al=1; return; }
  if (state_al[u]==2) return;
  state_al[u]=1;
  for (int i=0;i<gd_al[u];i++) dfs_al2(g_al[u][i]);
  state_al[u]=2; out_al[on_al++]=u;
}
char* alienOrder(char** words, int nw) {
  memset(gd_al,0,sizeof(gd_al)); memset(state_al,0,sizeof(state_al)); memset(present_al,0,sizeof(present_al));
  on_al=0; cycle_al=0;
  for (int w=0;w<nw;w++) for (int i=0; words[w][i]; i++) present_al[(int)words[w][i]]=1;
  for (int i=0;i<nw-1;i++) {
    char *a=words[i], *b=words[i+1];
    int na=(int)strlen(a), nb=(int)strlen(b), n=na<nb?na:nb, found=0;
    for (int j=0;j<n;j++) if (a[j]!=b[j]) {
      int u=a[j], v=b[j], dup=0;
      for (int k=0;k<gd_al[u];k++) if (g_al[u][k]==v) dup=1;
      if (!dup) g_al[u][gd_al[u]++]=v;
      found=1; break;
    }
    if (!found && na>nb) { char* e=(char*)malloc(1); e[0]=0; return e; }
  }
  for (int c=0;c<128;c++) if (present_al[c]) dfs_al2(c);
  char* res=(char*)malloc(33); int p=0;
  if (cycle_al) { res[0]=0; return res; }
  for (int i=on_al-1;i>=0;i--) res[p++]=(char)out_al[i];
  res[p]=0; return res;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n·L + k)",
          space: "O(k²)",
          why: "Same graph, Kahn's BFS. Letters with indegree 0 come first. If you cannot emit every unique letter, there is a cycle. Iterative and easy to explain.",
          code: `function alienOrder(words) {
  const g = {};
  const indeg = {};
  for (let w = 0; w < words.length; w++) {
    for (let i = 0; i < words[w].length; i++) {
      const ch = words[w][i];
      if (!g[ch]) { g[ch] = new Set(); indeg[ch] = 0; }
    }
  }
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i], b = words[i + 1];
    const n = Math.min(a.length, b.length);
    let found = false;
    for (let j = 0; j < n; j++) {
      if (a[j] !== b[j]) {
        if (!g[a[j]].has(b[j])) {
          g[a[j]].add(b[j]);
          indeg[b[j]]++;
        }
        found = true;
        break;
      }
    }
    if (!found && a.length > b.length) return "";
  }
  const q = [];
  const keys = Object.keys(indeg);
  for (let i = 0; i < keys.length; i++) if (indeg[keys[i]] === 0) q.push(keys[i]);
  let order = "";
  while (q.length) {
    const u = q.shift();
    order += u;
    const nei = Array.from(g[u]);
    for (let i = 0; i < nei.length; i++) {
      const v = nei[i];
      indeg[v]--;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return order.length === keys.length ? order : "";
}`,
          codes: {
            javascript: `function alienOrder(words) {
  const g = {};
  const indeg = {};
  for (let w = 0; w < words.length; w++) {
    for (let i = 0; i < words[w].length; i++) {
      const ch = words[w][i];
      if (!g[ch]) { g[ch] = new Set(); indeg[ch] = 0; }
    }
  }
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i], b = words[i + 1];
    const n = Math.min(a.length, b.length);
    let found = false;
    for (let j = 0; j < n; j++) {
      if (a[j] !== b[j]) {
        if (!g[a[j]].has(b[j])) {
          g[a[j]].add(b[j]);
          indeg[b[j]]++;
        }
        found = true;
        break;
      }
    }
    if (!found && a.length > b.length) return "";
  }
  const q = [];
  const keys = Object.keys(indeg);
  for (let i = 0; i < keys.length; i++) if (indeg[keys[i]] === 0) q.push(keys[i]);
  let order = "";
  while (q.length) {
    const u = q.shift();
    order += u;
    const nei = Array.from(g[u]);
    for (let i = 0; i < nei.length; i++) {
      const v = nei[i];
      indeg[v]--;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return order.length === keys.length ? order : "";
}`,
            python: `from collections import deque
def alienOrder(words):
  g = {}; indeg = {}
  for w in words:
    for ch in w:
      if ch not in g: g[ch]=set(); indeg[ch]=0
  for i in range(len(words)-1):
    a, b = words[i], words[i+1]
    n = min(len(a), len(b)); found=False
    for j in range(n):
      if a[j]!=b[j]:
        if b[j] not in g[a[j]]:
          g[a[j]].add(b[j]); indeg[b[j]] += 1
        found=True; break
    if not found and len(a)>len(b): return ""
  q = deque([k for k in indeg if indeg[k]==0])
  order = ""
  while q:
    u = q.popleft(); order += u
    for v in list(g[u]):
      indeg[v]-=1
      if indeg[v]==0: q.append(v)
  return order if len(order)==len(indeg) else ""`,
            java: `import java.util.*;
class Solution {
  public String alienOrder(String[] words) {
    Map<Character, Set<Character>> g=new HashMap<Character, Set<Character>>();
    Map<Character, Integer> indeg=new HashMap<Character, Integer>();
    for (String w : words) for (char ch : w.toCharArray()) {
      if (!g.containsKey(ch)) { g.put(ch, new HashSet<Character>()); indeg.put(ch, 0); }
    }
    for (int i=0;i<words.length-1;i++) {
      String a=words[i], b=words[i+1];
      int n=Math.min(a.length(), b.length()); boolean found=false;
      for (int j=0;j<n;j++) if (a.charAt(j)!=b.charAt(j)) {
        if (!g.get(a.charAt(j)).contains(b.charAt(j))) {
          g.get(a.charAt(j)).add(b.charAt(j)); indeg.put(b.charAt(j), indeg.get(b.charAt(j))+1);
        }
        found=true; break;
      }
      if (!found && a.length()>b.length()) return "";
    }
    ArrayDeque<Character> q=new ArrayDeque<Character>();
    for (char k : indeg.keySet()) if (indeg.get(k)==0) q.addLast(k);
    StringBuilder order=new StringBuilder();
    while (!q.isEmpty()) {
      char u=q.pollFirst(); order.append(u);
      for (char v : g.get(u)) {
        indeg.put(v, indeg.get(v)-1);
        if (indeg.get(v)==0) q.addLast(v);
      }
    }
    return order.length()==indeg.size() ? order.toString() : "";
  }
}`,
            cpp: `class Solution {
public:
  string alienOrder(vector<string>& words) {
    unordered_map<char, unordered_set<char>> g;
    unordered_map<char,int> indeg;
    for (auto& w : words) for (char ch : w) if (!g.count(ch)) { g[ch]={}; indeg[ch]=0; }
    for (int i=0;i<(int)words.size()-1;i++) {
      string a=words[i], b=words[i+1];
      int n=min((int)a.size(),(int)b.size()); bool found=false;
      for (int j=0;j<n;j++) if (a[j]!=b[j]) {
        if (!g[a[j]].count(b[j])) { g[a[j]].insert(b[j]); indeg[b[j]]++; }
        found=true; break;
      }
      if (!found && a.size()>b.size()) return "";
    }
    queue<char> q;
    for (auto& p : indeg) if (p.second==0) q.push(p.first);
    string order;
    while (!q.empty()) {
      char u=q.front(); q.pop(); order+=u;
      for (char v : g[u]) { indeg[v]--; if (indeg[v]==0) q.push(v); }
    }
    return (int)order.size()==(int)indeg.size() ? order : "";
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
char* alienOrder(char** words, int nw) {
  int g[128][32]={0}, gd[128]={0}, indeg[128], present[128]={0};
  for (int i=0;i<128;i++) indeg[i]=-1;
  for (int w=0;w<nw;w++) for (int i=0; words[w][i]; i++) { present[(int)words[w][i]]=1; indeg[(unsigned char)words[w][i]]=0; }
  for (int i=0;i<nw-1;i++) {
    char *a=words[i], *b=words[i+1];
    int na=(int)strlen(a), nb=(int)strlen(b), n=na<nb?na:nb, found=0;
    for (int j=0;j<n;j++) if (a[j]!=b[j]) {
      int u=(unsigned char)a[j], v=(unsigned char)b[j], dup=0;
      for (int k=0;k<gd[u];k++) if (g[u][k]==v) dup=1;
      if (!dup) { g[u][gd[u]++]=v; indeg[v]++; }
      found=1; break;
    }
    if (!found && na>nb) { char* e=(char*)malloc(1); e[0]=0; return e; }
  }
  int q[32], h=0,t=0, keys=0;
  for (int c=0;c<128;c++) if (indeg[c]==0) q[t++]=c;
  for (int c=0;c<128;c++) if (present[c]) keys++;
  char* order=(char*)malloc(33); int p=0;
  while (h<t) {
    int u=q[h++]; order[p++]=(char)u;
    for (int i=0;i<gd[u];i++) { int v=g[u][i]; indeg[v]--; if (indeg[v]==0) q[t++]=v; }
  }
  order[p]=0;
  if (p!=keys) order[0]=0;
  return order;
}`
          }
        }
      ]
    },
    {
      id: 12,
      level: "intermediate",
      q: "Network Delay Time",
      ask: "Google · Amazon · Meta · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/network-delay-time/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/network-delay-time/"}],
      a: "A directed weighted graph: times[i] = [u, v, w] means a signal takes w to go from u to v. Send from node k. Return how long until every node gets the signal, or -1 if some node is unreachable.\n\nExample: times [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2 answers 2.\n\nBrute DFS all paths with extra visiting copies. Optimal Dijkstra with a linear scan for the next closest node. More optimal Dijkstra with a min-heap.",
      solutions: [
        {
          name: "Brute",
          time: "O(n^e)",
          space: "O(n + e)",
          why: "DFS every simple path, copying the visiting array so cycles stop. Keep the best arrival time per node. Exponential on dense graphs.",
          code: `function networkDelayTime(times, n, k) {
  const g = Array.from({ length: n + 1 }, function () { return []; });
  for (let i = 0; i < times.length; i++) {
    g[times[i][0]].push([times[i][1], times[i][2]]);
  }
  const dist = Array(n + 1).fill(Infinity);
  function dfs(u, d, visiting) {
    if (d >= dist[u]) return;
    dist[u] = d;
    const copy = visiting.slice();
    copy[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i][0], w = g[u][i][1];
      if (copy[v]) continue;
      dfs(v, d + w, copy);
    }
  }
  dfs(k, 0, Array(n + 1).fill(false));
  let ans = 0;
  for (let i = 1; i <= n; i++) ans = Math.max(ans, dist[i]);
  return ans === Infinity ? -1 : ans;
}`,
          codes: {
            javascript: `function networkDelayTime(times, n, k) {
  const g = Array.from({ length: n + 1 }, function () { return []; });
  for (let i = 0; i < times.length; i++) {
    g[times[i][0]].push([times[i][1], times[i][2]]);
  }
  const dist = Array(n + 1).fill(Infinity);
  function dfs(u, d, visiting) {
    if (d >= dist[u]) return;
    dist[u] = d;
    const copy = visiting.slice();
    copy[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i][0], w = g[u][i][1];
      if (copy[v]) continue;
      dfs(v, d + w, copy);
    }
  }
  dfs(k, 0, Array(n + 1).fill(false));
  let ans = 0;
  for (let i = 1; i <= n; i++) ans = Math.max(ans, dist[i]);
  return ans === Infinity ? -1 : ans;
}`,
            python: `def networkDelayTime(times, n, k):
  g = [[] for _ in range(n+1)]
  for u,v,w in times:
    g[u].append((v,w))
  dist = [float("inf")]*(n+1)
  def dfs(u, d, visiting):
    if d >= dist[u]: return
    dist[u] = d
    copy = visiting[:]
    copy[u] = True
    for v,w in g[u]:
      if copy[v]: continue
      dfs(v, d+w, copy)
  dfs(k, 0, [False]*(n+1))
  ans = 0
  for i in range(1, n+1): ans = max(ans, dist[i])
  return -1 if ans==float("inf") else ans`,
            java: `import java.util.*;
class Solution {
  void dfs(List<int[]>[] g, int u, int d, int[] dist, boolean[] visiting) {
    if (d >= dist[u]) return;
    dist[u]=d;
    boolean[] copy=visiting.clone(); copy[u]=true;
    for (int[] e : g[u]) if (!copy[e[0]]) dfs(g, e[0], d+e[1], dist, copy);
  }
  public int networkDelayTime(int[][] times, int n, int k) {
    List<int[]>[] g=new ArrayList[n+1];
    for (int i=0;i<=n;i++) g[i]=new ArrayList<int[]>();
    for (int[] t : times) g[t[0]].add(new int[]{t[1], t[2]});
    int[] dist=new int[n+1];
    Arrays.fill(dist, Integer.MAX_VALUE/4);
    dfs(g, k, 0, dist, new boolean[n+1]);
    int ans=0;
    for (int i=1;i<=n;i++) ans=Math.max(ans, dist[i]);
    return ans >= Integer.MAX_VALUE/4 ? -1 : ans;
  }
}`,
            cpp: `class Solution {
  void dfs(vector<vector<pair<int,int>>>& g, int u, int d, vector<int>& dist, vector<int> visiting) {
    if (d >= dist[u]) return;
    dist[u]=d; visiting[u]=1;
    for (auto e : g[u]) if (!visiting[e.first]) dfs(g, e.first, d+e.second, dist, visiting);
  }
public:
  int networkDelayTime(vector<vector<int>>& times, int n, int k) {
    vector<vector<pair<int,int>>> g(n+1);
    for (auto& t : times) g[t[0]].push_back({t[1], t[2]});
    vector<int> dist(n+1, INT_MAX/4);
    dfs(g, k, 0, dist, vector<int>(n+1));
    int ans=0;
    for (int i=1;i<=n;i++) ans=max(ans, dist[i]);
    return ans>=INT_MAX/4 ? -1 : ans;
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
#include <limits.h>
void dfs_nd(int** to, int** w, int* deg, int u, int d, int* dist, int* visiting, int n) {
  if (d >= dist[u]) return;
  dist[u]=d;
  int* copy=(int*)malloc(sizeof(int)*(n+1)); memcpy(copy, visiting, sizeof(int)*(n+1));
  copy[u]=1;
  for (int i=0;i<deg[u];i++) if (!copy[to[u][i]]) dfs_nd(to,w,deg,to[u][i],d+w[u][i],dist,copy,n);
  free(copy);
}
int networkDelayTime(int** times, int e, int n, int k) {
  int* deg=(int*)calloc(n+1,sizeof(int));
  for (int i=0;i<e;i++) deg[times[i][0]]++;
  int** to=(int**)malloc(sizeof(int*)*(n+1));
  int** ww=(int**)malloc(sizeof(int*)*(n+1));
  for (int i=0;i<=n;i++) { to[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); ww[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); deg[i]=0; }
  for (int i=0;i<e;i++) { int u=times[i][0]; to[u][deg[u]]=times[i][1]; ww[u][deg[u]]=times[i][2]; deg[u]++; }
  int* dist=(int*)malloc(sizeof(int)*(n+1));
  for (int i=0;i<=n;i++) dist[i]=INT_MAX/4;
  int* vis=(int*)calloc(n+1,sizeof(int));
  dfs_nd(to,ww,deg,k,0,dist,vis,n);
  int ans=0;
  for (int i=1;i<=n;i++) if (dist[i]>ans) ans=dist[i];
  return ans>=INT_MAX/4 ? -1 : ans;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n² + e)",
          space: "O(n + e)",
          why: "Dijkstra without a heap: each round scan all nodes for the unvisited one with smallest dist. Fine when n is a few hundred. Classic O(n²) Dijkstra.",
          code: `function networkDelayTime(times, n, k) {
  const g = Array.from({ length: n + 1 }, function () { return []; });
  for (let i = 0; i < times.length; i++) {
    g[times[i][0]].push([times[i][1], times[i][2]]);
  }
  const dist = Array(n + 1).fill(Infinity);
  const used = Array(n + 1).fill(false);
  dist[k] = 0;
  for (let round = 0; round < n; round++) {
    let u = -1;
    for (let i = 1; i <= n; i++) {
      if (used[i]) continue;
      if (u === -1 || dist[i] < dist[u]) u = i;
    }
    if (u === -1 || dist[u] === Infinity) break;
    used[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i][0], w = g[u][i][1];
      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    }
  }
  let ans = 0;
  for (let i = 1; i <= n; i++) ans = Math.max(ans, dist[i]);
  return ans === Infinity ? -1 : ans;
}`,
          codes: {
            javascript: `function networkDelayTime(times, n, k) {
  const g = Array.from({ length: n + 1 }, function () { return []; });
  for (let i = 0; i < times.length; i++) {
    g[times[i][0]].push([times[i][1], times[i][2]]);
  }
  const dist = Array(n + 1).fill(Infinity);
  const used = Array(n + 1).fill(false);
  dist[k] = 0;
  for (let round = 0; round < n; round++) {
    let u = -1;
    for (let i = 1; i <= n; i++) {
      if (used[i]) continue;
      if (u === -1 || dist[i] < dist[u]) u = i;
    }
    if (u === -1 || dist[u] === Infinity) break;
    used[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i][0], w = g[u][i][1];
      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    }
  }
  let ans = 0;
  for (let i = 1; i <= n; i++) ans = Math.max(ans, dist[i]);
  return ans === Infinity ? -1 : ans;
}`,
            python: `def networkDelayTime(times, n, k):
  g = [[] for _ in range(n+1)]
  for u,v,w in times:
    g[u].append((v,w))
  dist = [float("inf")]*(n+1)
  used = [False]*(n+1)
  dist[k]=0
  for round in range(n):
    u = -1
    for i in range(1, n+1):
      if used[i]: continue
      if u==-1 or dist[i]<dist[u]: u=i
    if u==-1 or dist[u]==float("inf"): break
    used[u]=True
    for v,w in g[u]:
      if dist[u]+w < dist[v]: dist[v]=dist[u]+w
  ans=0
  for i in range(1,n+1): ans=max(ans, dist[i])
  return -1 if ans==float("inf") else ans`,
            java: `import java.util.*;
class Solution {
  public int networkDelayTime(int[][] times, int n, int k) {
    List<int[]>[] g=new ArrayList[n+1];
    for (int i=0;i<=n;i++) g[i]=new ArrayList<int[]>();
    for (int[] t : times) g[t[0]].add(new int[]{t[1], t[2]});
    int INF=Integer.MAX_VALUE/4;
    int[] dist=new int[n+1]; boolean[] used=new boolean[n+1];
    Arrays.fill(dist, INF); dist[k]=0;
    for (int round=0; round<n; round++) {
      int u=-1;
      for (int i=1;i<=n;i++) {
        if (used[i]) continue;
        if (u==-1 || dist[i]<dist[u]) u=i;
      }
      if (u==-1 || dist[u]==INF) break;
      used[u]=true;
      for (int[] e : g[u]) if (dist[u]+e[1] < dist[e[0]]) dist[e[0]]=dist[u]+e[1];
    }
    int ans=0;
    for (int i=1;i<=n;i++) ans=Math.max(ans, dist[i]);
    return ans>=INF ? -1 : ans;
  }
}`,
            cpp: `class Solution {
public:
  int networkDelayTime(vector<vector<int>>& times, int n, int k) {
    vector<vector<pair<int,int>>> g(n+1);
    for (auto& t : times) g[t[0]].push_back({t[1], t[2]});
    vector<int> dist(n+1, INT_MAX/4), used(n+1);
    dist[k]=0;
    for (int round=0; round<n; round++) {
      int u=-1;
      for (int i=1;i<=n;i++) {
        if (used[i]) continue;
        if (u==-1 || dist[i]<dist[u]) u=i;
      }
      if (u==-1 || dist[u]==INT_MAX/4) break;
      used[u]=1;
      for (auto e : g[u]) if (dist[u]+e.second < dist[e.first]) dist[e.first]=dist[u]+e.second;
    }
    int ans=0;
    for (int i=1;i<=n;i++) ans=max(ans, dist[i]);
    return ans>=INT_MAX/4 ? -1 : ans;
  }
};`,
            c: `#include <stdlib.h>
#include <limits.h>
int networkDelayTime(int** times, int e, int n, int k) {
  int* deg=(int*)calloc(n+1,sizeof(int));
  for (int i=0;i<e;i++) deg[times[i][0]]++;
  int** to=(int**)malloc(sizeof(int*)*(n+1));
  int** ww=(int**)malloc(sizeof(int*)*(n+1));
  for (int i=0;i<=n;i++) { to[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); ww[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); deg[i]=0; }
  for (int i=0;i<e;i++) { int u=times[i][0]; to[u][deg[u]]=times[i][1]; ww[u][deg[u]]=times[i][2]; deg[u]++; }
  int INF=INT_MAX/4;
  int* dist=(int*)malloc(sizeof(int)*(n+1));
  int* used=(int*)calloc(n+1,sizeof(int));
  for (int i=0;i<=n;i++) dist[i]=INF; dist[k]=0;
  for (int round=0; round<n; round++) {
    int u=-1;
    for (int i=1;i<=n;i++) { if (used[i]) continue; if (u==-1||dist[i]<dist[u]) u=i; }
    if (u==-1 || dist[u]==INF) break;
    used[u]=1;
    for (int i=0;i<deg[u];i++) if (dist[u]+ww[u][i] < dist[to[u][i]]) dist[to[u][i]]=dist[u]+ww[u][i];
  }
  int ans=0;
  for (int i=1;i<=n;i++) if (dist[i]>ans) ans=dist[i];
  return ans>=INF ? -1 : ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O((n + e) log n)",
          space: "O(n + e)",
          why: "Dijkstra with a binary min-heap of [distance, node]. Skip stale pops. This is the usual interview solution for sparse graphs.",
          code: `function networkDelayTime(times, n, k) {
  const g = Array.from({ length: n + 1 }, function () { return []; });
  for (let i = 0; i < times.length; i++) {
    g[times[i][0]].push([times[i][1], times[i][2]]);
  }
  const dist = Array(n + 1).fill(Infinity);
  dist[k] = 0;
  const heap = [];
  function push(item) {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i][0] >= heap[p][0]) break;
      const t = heap[i]; heap[i] = heap[p]; heap[p] = t;
      i = p;
    }
  }
  function pop() {
    const top = heap[0];
    const last = heap.pop();
    if (!heap.length) return top;
    heap[0] = last;
    let i = 0;
    while (true) {
      let s = i;
      const l = i * 2 + 1, r = l + 1;
      if (l < heap.length && heap[l][0] < heap[s][0]) s = l;
      if (r < heap.length && heap[r][0] < heap[s][0]) s = r;
      if (s === i) break;
      const t = heap[i]; heap[i] = heap[s]; heap[s] = t;
      i = s;
    }
    return top;
  }
  push([0, k]);
  while (heap.length) {
    const cur = pop();
    const d = cur[0], u = cur[1];
    if (d > dist[u]) continue;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i][0], w = g[u][i][1];
      if (d + w < dist[v]) {
        dist[v] = d + w;
        push([dist[v], v]);
      }
    }
  }
  let ans = 0;
  for (let i = 1; i <= n; i++) ans = Math.max(ans, dist[i]);
  return ans === Infinity ? -1 : ans;
}`,
          codes: {
            javascript: `function networkDelayTime(times, n, k) {
  const g = Array.from({ length: n + 1 }, function () { return []; });
  for (let i = 0; i < times.length; i++) {
    g[times[i][0]].push([times[i][1], times[i][2]]);
  }
  const dist = Array(n + 1).fill(Infinity);
  dist[k] = 0;
  const heap = [];
  function push(item) {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i][0] >= heap[p][0]) break;
      const t = heap[i]; heap[i] = heap[p]; heap[p] = t;
      i = p;
    }
  }
  function pop() {
    const top = heap[0];
    const last = heap.pop();
    if (!heap.length) return top;
    heap[0] = last;
    let i = 0;
    while (true) {
      let s = i;
      const l = i * 2 + 1, r = l + 1;
      if (l < heap.length && heap[l][0] < heap[s][0]) s = l;
      if (r < heap.length && heap[r][0] < heap[s][0]) s = r;
      if (s === i) break;
      const t = heap[i]; heap[i] = heap[s]; heap[s] = t;
      i = s;
    }
    return top;
  }
  push([0, k]);
  while (heap.length) {
    const cur = pop();
    const d = cur[0], u = cur[1];
    if (d > dist[u]) continue;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i][0], w = g[u][i][1];
      if (d + w < dist[v]) {
        dist[v] = d + w;
        push([dist[v], v]);
      }
    }
  }
  let ans = 0;
  for (let i = 1; i <= n; i++) ans = Math.max(ans, dist[i]);
  return ans === Infinity ? -1 : ans;
}`,
            python: `def networkDelayTime(times, n, k):
  g = [[] for _ in range(n+1)]
  for u,v,w in times:
    g[u].append((v,w))
  dist = [float("inf")]*(n+1)
  dist[k]=0
  heap=[]
  def push(item):
    heap.append(item)
    i=len(heap)-1
    while i>0:
      p=(i-1)>>1
      if heap[i][0]>=heap[p][0]: break
      heap[i],heap[p]=heap[p],heap[i]; i=p
  def pop():
    top=heap[0]; last=heap.pop()
    if not heap: return top
    heap[0]=last; i=0
    while True:
      s=i; l=i*2+1; r=l+1
      if l<len(heap) and heap[l][0]<heap[s][0]: s=l
      if r<len(heap) and heap[r][0]<heap[s][0]: s=r
      if s==i: break
      heap[i],heap[s]=heap[s],heap[i]; i=s
    return top
  push((0,k))
  while heap:
    d,u=pop()
    if d>dist[u]: continue
    for v,w in g[u]:
      if d+w < dist[v]:
        dist[v]=d+w; push((dist[v], v))
  ans=0
  for i in range(1,n+1): ans=max(ans, dist[i])
  return -1 if ans==float("inf") else ans`,
            java: `class Solution {
  java.util.ArrayList<int[]> heap=new java.util.ArrayList<int[]>();
  void push(int d, int u) {
    heap.add(new int[]{d,u}); int i=heap.size()-1;
    while (i>0) { int p=(i-1)>>1; if (heap.get(i)[0]>=heap.get(p)[0]) break;
      int[] t=heap.get(i); heap.set(i,heap.get(p)); heap.set(p,t); i=p; }
  }
  int[] pop() {
    int[] top=heap.get(0); int[] last=heap.remove(heap.size()-1);
    if (!heap.isEmpty()) { heap.set(0,last); int i=0;
      while (true) { int s=i,l=i*2+1,r=l+1;
        if (l<heap.size()&&heap.get(l)[0]<heap.get(s)[0]) s=l;
        if (r<heap.size()&&heap.get(r)[0]<heap.get(s)[0]) s=r;
        if (s==i) break; int[] t=heap.get(i); heap.set(i,heap.get(s)); heap.set(s,t); i=s; } }
    return top;
  }
  public int networkDelayTime(int[][] times, int n, int k) {
    java.util.List<int[]>[] g=new java.util.ArrayList[n+1];
    for (int i=0;i<=n;i++) g[i]=new java.util.ArrayList<int[]>();
    for (int[] t : times) g[t[0]].add(new int[]{t[1], t[2]});
    int INF=Integer.MAX_VALUE/4;
    int[] dist=new int[n+1]; java.util.Arrays.fill(dist, INF); dist[k]=0;
    push(0,k);
    while (!heap.isEmpty()) {
      int[] cur=pop(); int d=cur[0], u=cur[1];
      if (d>dist[u]) continue;
      for (int[] e : g[u]) if (d+e[1]<dist[e[0]]) { dist[e[0]]=d+e[1]; push(dist[e[0]], e[0]); }
    }
    int ans=0;
    for (int i=1;i<=n;i++) ans=Math.max(ans, dist[i]);
    return ans>=INF ? -1 : ans;
  }
}`,
            cpp: `class Solution {
  vector<pair<int,int>> heap;
  void push(int d, int u) {
    heap.push_back({d,u}); int i=(int)heap.size()-1;
    while (i>0) { int p=(i-1)>>1; if (heap[i].first>=heap[p].first) break; swap(heap[i], heap[p]); i=p; }
  }
  pair<int,int> pop() {
    auto top=heap[0]; auto last=heap.back(); heap.pop_back();
    if (!heap.empty()) { heap[0]=last; int i=0;
      while (true) { int s=i,l=i*2+1,r=l+1,n=(int)heap.size();
        if (l<n && heap[l].first<heap[s].first) s=l;
        if (r<n && heap[r].first<heap[s].first) s=r;
        if (s==i) break; swap(heap[i], heap[s]); i=s; } }
    return top;
  }
public:
  int networkDelayTime(vector<vector<int>>& times, int n, int k) {
    vector<vector<pair<int,int>>> g(n+1);
    for (auto& t : times) g[t[0]].push_back({t[1], t[2]});
    vector<int> dist(n+1, INT_MAX/4); dist[k]=0;
    push(0,k);
    while (!heap.empty()) {
      auto cur=pop(); int d=cur.first, u=cur.second;
      if (d>dist[u]) continue;
      for (auto e : g[u]) if (d+e.second < dist[e.first]) { dist[e.first]=d+e.second; push(dist[e.first], e.first); }
    }
    int ans=0;
    for (int i=1;i<=n;i++) ans=max(ans, dist[i]);
    return ans>=INT_MAX/4 ? -1 : ans;
  }
};`,
            c: `#include <stdlib.h>
#include <limits.h>
void uph(int* k, int* v, int i) {
  while (i>0) { int p=(i-1)>>1; if (k[i]>=k[p]) break; int t=k[i]; k[i]=k[p]; k[p]=t; t=v[i]; v[i]=v[p]; v[p]=t; i=p; }
}
void downh(int* k, int* v, int n, int i) {
  while (1) { int s=i,l=i*2+1,r=l+1;
    if (l<n && k[l]<k[s]) s=l; if (r<n && k[r]<k[s]) s=r;
    if (s==i) break; int t=k[i]; k[i]=k[s]; k[s]=t; t=v[i]; v[i]=v[s]; v[s]=t; i=s; }
}
int networkDelayTime(int** times, int e, int n, int k) {
  int* deg=(int*)calloc(n+1,sizeof(int));
  for (int i=0;i<e;i++) deg[times[i][0]]++;
  int** to=(int**)malloc(sizeof(int*)*(n+1));
  int** ww=(int**)malloc(sizeof(int*)*(n+1));
  for (int i=0;i<=n;i++) { to[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); ww[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); deg[i]=0; }
  for (int i=0;i<e;i++) { int u=times[i][0]; to[u][deg[u]]=times[i][1]; ww[u][deg[u]]=times[i][2]; deg[u]++; }
  int INF=INT_MAX/4;
  int* dist=(int*)malloc(sizeof(int)*(n+1));
  for (int i=0;i<=n;i++) dist[i]=INF; dist[k]=0;
  int cap=e*2+8; int* hk=(int*)malloc(sizeof(int)*cap); int* hv=(int*)malloc(sizeof(int)*cap); int sz=0;
  hk[sz]=0; hv[sz]=k; sz++;
  while (sz) {
    int d=hk[0], u=hv[0];
    hk[0]=hk[--sz]; hv[0]=hv[sz]; if (sz) downh(hk,hv,sz,0);
    if (d>dist[u]) continue;
    for (int i=0;i<deg[u];i++) if (d+ww[u][i]<dist[to[u][i]]) {
      dist[to[u][i]]=d+ww[u][i];
      hk[sz]=dist[to[u][i]]; hv[sz]=to[u][i]; sz++; uph(hk,hv,sz-1);
    }
  }
  int ans=0;
  for (int i=1;i<=n;i++) if (dist[i]>ans) ans=dist[i];
  return ans>=INF ? -1 : ans;
}`
          }
        }
      ]
    },
    {
      id: 13,
      level: "advanced",
      q: "Cheapest Flights Within K Stops",
      ask: "Amazon · Google · Bloomberg · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/cheapest-flights-within-k-stops/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/cheapest-flights-within-k-stops/"}],
      a: "n cities, flights [from, to, price], src, dst, and K. Return the cheapest price from src to dst with at most K stops (so at most K+1 flights). -1 if impossible.\n\nExample: n = 4, flights [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src 0, dst 3, K 1 answers 700 (0->1->3). With K = 2 you can take 0->1->2->3 for 400.\n\nStops cap the path. Brute DFS. Optimal Bellman-Ford for K+1 rounds. More optimal is a min-heap Dijkstra that tracks remaining stops.",
      solutions: [
        {
          name: "Brute",
          time: "O(n^K)",
          space: "O(n + e)",
          why: "DFS every path with a copied visiting array and a remaining-stop budget. Exponential in K. Easy to write, too slow when K is 20 and the graph is dense.",
          code: `function findCheapestPrice(n, flights, src, dst, k) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < flights.length; i++) {
    g[flights[i][0]].push([flights[i][1], flights[i][2]]);
  }
  let best = Infinity;
  function dfs(u, cost, stops, visiting) {
    if (cost >= best) return;
    if (u === dst) { best = cost; return; }
    if (stops < 0) return;
    const copy = visiting.slice();
    copy[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i][0], w = g[u][i][1];
      if (copy[v]) continue;
      dfs(v, cost + w, stops - 1, copy);
    }
  }
  dfs(src, 0, k, Array(n).fill(false));
  return best === Infinity ? -1 : best;
}`,
          codes: {
            javascript: `function findCheapestPrice(n, flights, src, dst, k) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < flights.length; i++) {
    g[flights[i][0]].push([flights[i][1], flights[i][2]]);
  }
  let best = Infinity;
  function dfs(u, cost, stops, visiting) {
    if (cost >= best) return;
    if (u === dst) { best = cost; return; }
    if (stops < 0) return;
    const copy = visiting.slice();
    copy[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i][0], w = g[u][i][1];
      if (copy[v]) continue;
      dfs(v, cost + w, stops - 1, copy);
    }
  }
  dfs(src, 0, k, Array(n).fill(false));
  return best === Infinity ? -1 : best;
}`,
            python: `def findCheapestPrice(n, flights, src, dst, k):
  g = [[] for _ in range(n)]
  for u,v,w in flights:
    g[u].append((v,w))
  best = float("inf")
  def dfs(u, cost, stops, visiting):
    nonlocal best
    if cost >= best: return
    if u == dst: best = cost; return
    if stops < 0: return
    copy = visiting[:]
    copy[u] = True
    for v,w in g[u]:
      if copy[v]: continue
      dfs(v, cost+w, stops-1, copy)
  dfs(src, 0, k, [False]*n)
  return -1 if best==float("inf") else best`,
            java: `import java.util.*;
class Solution {
  int best;
  void dfs(List<int[]>[] g, int u, int cost, int stops, boolean[] visiting, int dst) {
    if (cost >= best) return;
    if (u == dst) { best = cost; return; }
    if (stops < 0) return;
    boolean[] copy=visiting.clone(); copy[u]=true;
    for (int[] e : g[u]) if (!copy[e[0]]) dfs(g, e[0], cost+e[1], stops-1, copy, dst);
  }
  public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
    List<int[]>[] g=new ArrayList[n];
    for (int i=0;i<n;i++) g[i]=new ArrayList<int[]>();
    for (int[] f : flights) g[f[0]].add(new int[]{f[1], f[2]});
    best=Integer.MAX_VALUE/4;
    dfs(g, src, 0, k, new boolean[n], dst);
    return best>=Integer.MAX_VALUE/4 ? -1 : best;
  }
}`,
            cpp: `class Solution {
  int best;
  void dfs(vector<vector<pair<int,int>>>& g, int u, int cost, int stops, vector<int> visiting, int dst) {
    if (cost >= best) return;
    if (u==dst) { best=cost; return; }
    if (stops<0) return;
    visiting[u]=1;
    for (auto e : g[u]) if (!visiting[e.first]) dfs(g, e.first, cost+e.second, stops-1, visiting, dst);
  }
public:
  int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    vector<vector<pair<int,int>>> g(n);
    for (auto& f : flights) g[f[0]].push_back({f[1], f[2]});
    best=INT_MAX/4;
    dfs(g, src, 0, k, vector<int>(n), dst);
    return best>=INT_MAX/4 ? -1 : best;
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
#include <limits.h>
int best_cf;
void dfs_cf3(int** to, int** w, int* deg, int u, int cost, int stops, int* visiting, int n, int dst) {
  if (cost >= best_cf) return;
  if (u==dst) { best_cf=cost; return; }
  if (stops<0) return;
  int* copy=(int*)malloc(sizeof(int)*n); memcpy(copy,visiting,sizeof(int)*n); copy[u]=1;
  for (int i=0;i<deg[u];i++) if (!copy[to[u][i]]) dfs_cf3(to,w,deg,to[u][i],cost+w[u][i],stops-1,copy,n,dst);
  free(copy);
}
int findCheapestPrice(int n, int** flights, int e, int src, int dst, int k) {
  int* deg=(int*)calloc(n,sizeof(int));
  for (int i=0;i<e;i++) deg[flights[i][0]]++;
  int** to=(int**)malloc(sizeof(int*)*n); int** ww=(int**)malloc(sizeof(int*)*n);
  for (int i=0;i<n;i++) { to[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); ww[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); deg[i]=0; }
  for (int i=0;i<e;i++) { int u=flights[i][0]; to[u][deg[u]]=flights[i][1]; ww[u][deg[u]]=flights[i][2]; deg[u]++; }
  best_cf=INT_MAX/4;
  int* vis=(int*)calloc(n,sizeof(int));
  dfs_cf3(to,ww,deg,src,0,k,vis,n,dst);
  return best_cf>=INT_MAX/4 ? -1 : best_cf;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(K · e)",
          space: "O(n)",
          why: "Bellman-Ford: relax every flight K+1 times. Copy dist each round so you only use paths with one more flight. Classic for 'at most K edges'.",
          code: `function findCheapestPrice(n, flights, src, dst, k) {
  let dist = Array(n).fill(Infinity);
  dist[src] = 0;
  for (let round = 0; round <= k; round++) {
    const next = dist.slice();
    for (let i = 0; i < flights.length; i++) {
      const u = flights[i][0], v = flights[i][1], w = flights[i][2];
      if (dist[u] === Infinity) continue;
      if (dist[u] + w < next[v]) next[v] = dist[u] + w;
    }
    dist = next;
  }
  return dist[dst] === Infinity ? -1 : dist[dst];
}`,
          codes: {
            javascript: `function findCheapestPrice(n, flights, src, dst, k) {
  let dist = Array(n).fill(Infinity);
  dist[src] = 0;
  for (let round = 0; round <= k; round++) {
    const next = dist.slice();
    for (let i = 0; i < flights.length; i++) {
      const u = flights[i][0], v = flights[i][1], w = flights[i][2];
      if (dist[u] === Infinity) continue;
      if (dist[u] + w < next[v]) next[v] = dist[u] + w;
    }
    dist = next;
  }
  return dist[dst] === Infinity ? -1 : dist[dst];
}`,
            python: `def findCheapestPrice(n, flights, src, dst, k):
  dist = [float("inf")]*n
  dist[src]=0
  for round in range(k+1):
    nxt = dist[:]
    for u,v,w in flights:
      if dist[u]==float("inf"): continue
      if dist[u]+w < nxt[v]: nxt[v]=dist[u]+w
    dist = nxt
  return -1 if dist[dst]==float("inf") else dist[dst]`,
            java: `import java.util.*;
class Solution {
  public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
    int INF=Integer.MAX_VALUE/4;
    int[] dist=new int[n]; Arrays.fill(dist, INF); dist[src]=0;
    for (int round=0; round<=k; round++) {
      int[] next=dist.clone();
      for (int[] f : flights) {
        int u=f[0], v=f[1], w=f[2];
        if (dist[u]==INF) continue;
        if (dist[u]+w < next[v]) next[v]=dist[u]+w;
      }
      dist=next;
    }
    return dist[dst]==INF ? -1 : dist[dst];
  }
}`,
            cpp: `class Solution {
public:
  int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    vector<int> dist(n, INT_MAX/4); dist[src]=0;
    for (int round=0; round<=k; round++) {
      vector<int> next=dist;
      for (auto& f : flights) {
        int u=f[0], v=f[1], w=f[2];
        if (dist[u]==INT_MAX/4) continue;
        if (dist[u]+w < next[v]) next[v]=dist[u]+w;
      }
      dist.swap(next);
    }
    return dist[dst]==INT_MAX/4 ? -1 : dist[dst];
  }
};`,
            c: `#include <stdlib.h>
#include <limits.h>
int findCheapestPrice(int n, int** flights, int e, int src, int dst, int k) {
  int INF=INT_MAX/4;
  int* dist=(int*)malloc(sizeof(int)*n);
  int* next=(int*)malloc(sizeof(int)*n);
  for (int i=0;i<n;i++) dist[i]=INF; dist[src]=0;
  for (int round=0; round<=k; round++) {
    for (int i=0;i<n;i++) next[i]=dist[i];
    for (int i=0;i<e;i++) {
      int u=flights[i][0], v=flights[i][1], w=flights[i][2];
      if (dist[u]==INF) continue;
      if (dist[u]+w < next[v]) next[v]=dist[u]+w;
    }
    int* tmp=dist; dist=next; next=tmp;
  }
  return dist[dst]==INF ? -1 : dist[dst];
}`
          }
        },
        {
          name: "More optimal",
          time: "O(K · e log (K n))",
          space: "O(n · K + e)",
          why: "Dijkstra on state (city, stops used). A min-heap pops cheapest cost first. best[city][stops] prunes worse repeats. Faster on sparse graphs when K is small.",
          code: `function findCheapestPrice(n, flights, src, dst, k) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < flights.length; i++) {
    g[flights[i][0]].push([flights[i][1], flights[i][2]]);
  }
  const best = Array.from({ length: n }, function () {
    return Array(k + 2).fill(Infinity);
  });
  const heap = [];
  function push(x) {
    heap.push(x);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i][0] >= heap[p][0]) break;
      const t = heap[i]; heap[i] = heap[p]; heap[p] = t;
      i = p;
    }
  }
  function pop() {
    const top = heap[0];
    const last = heap.pop();
    if (!heap.length) return top;
    heap[0] = last;
    let i = 0;
    while (true) {
      let s = i;
      const l = i * 2 + 1, r = l + 1;
      if (l < heap.length && heap[l][0] < heap[s][0]) s = l;
      if (r < heap.length && heap[r][0] < heap[s][0]) s = r;
      if (s === i) break;
      const t = heap[i]; heap[i] = heap[s]; heap[s] = t;
      i = s;
    }
    return top;
  }
  best[src][0] = 0;
  push([0, src, 0]);
  while (heap.length) {
    const cur = pop();
    const cost = cur[0], u = cur[1], used = cur[2];
    if (u === dst) return cost;
    if (used > k) continue;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i][0], w = g[u][i][1];
      const nc = cost + w;
      if (nc >= best[v][used + 1]) continue;
      best[v][used + 1] = nc;
      push([nc, v, used + 1]);
    }
  }
  return -1;
}`,
          codes: {
            javascript: `function findCheapestPrice(n, flights, src, dst, k) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < flights.length; i++) {
    g[flights[i][0]].push([flights[i][1], flights[i][2]]);
  }
  const best = Array.from({ length: n }, function () {
    return Array(k + 2).fill(Infinity);
  });
  const heap = [];
  function push(x) {
    heap.push(x);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i][0] >= heap[p][0]) break;
      const t = heap[i]; heap[i] = heap[p]; heap[p] = t;
      i = p;
    }
  }
  function pop() {
    const top = heap[0];
    const last = heap.pop();
    if (!heap.length) return top;
    heap[0] = last;
    let i = 0;
    while (true) {
      let s = i;
      const l = i * 2 + 1, r = l + 1;
      if (l < heap.length && heap[l][0] < heap[s][0]) s = l;
      if (r < heap.length && heap[r][0] < heap[s][0]) s = r;
      if (s === i) break;
      const t = heap[i]; heap[i] = heap[s]; heap[s] = t;
      i = s;
    }
    return top;
  }
  best[src][0] = 0;
  push([0, src, 0]);
  while (heap.length) {
    const cur = pop();
    const cost = cur[0], u = cur[1], used = cur[2];
    if (u === dst) return cost;
    if (used > k) continue;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i][0], w = g[u][i][1];
      const nc = cost + w;
      if (nc >= best[v][used + 1]) continue;
      best[v][used + 1] = nc;
      push([nc, v, used + 1]);
    }
  }
  return -1;
}`,
            python: `def findCheapestPrice(n, flights, src, dst, k):
  g = [[] for _ in range(n)]
  for u,v,w in flights:
    g[u].append((v,w))
  best = [[float("inf")]*(k+2) for _ in range(n)]
  heap=[]
  def push(x):
    heap.append(x); i=len(heap)-1
    while i>0:
      p=(i-1)>>1
      if heap[i][0]>=heap[p][0]: break
      heap[i],heap[p]=heap[p],heap[i]; i=p
  def pop():
    top=heap[0]; last=heap.pop()
    if not heap: return top
    heap[0]=last; i=0
    while True:
      s=i; l=i*2+1; r=l+1
      if l<len(heap) and heap[l][0]<heap[s][0]: s=l
      if r<len(heap) and heap[r][0]<heap[s][0]: s=r
      if s==i: break
      heap[i],heap[s]=heap[s],heap[i]; i=s
    return top
  best[src][0]=0; push((0,src,0))
  while heap:
    cost,u,used=pop()
    if u==dst: return cost
    if used>k: continue
    for v,w in g[u]:
      nc=cost+w
      if nc>=best[v][used+1]: continue
      best[v][used+1]=nc; push((nc,v,used+1))
  return -1`,
            java: `class Solution {
  java.util.ArrayList<int[]> heap=new java.util.ArrayList<int[]>();
  void push(int[] x) {
    heap.add(x); int i=heap.size()-1;
    while (i>0) { int p=(i-1)>>1; if (heap.get(i)[0]>=heap.get(p)[0]) break;
      int[] t=heap.get(i); heap.set(i,heap.get(p)); heap.set(p,t); i=p; }
  }
  int[] pop() {
    int[] top=heap.get(0); int[] last=heap.remove(heap.size()-1);
    if (!heap.isEmpty()) { heap.set(0,last); int i=0;
      while (true) { int s=i,l=i*2+1,r=l+1;
        if (l<heap.size()&&heap.get(l)[0]<heap.get(s)[0]) s=l;
        if (r<heap.size()&&heap.get(r)[0]<heap.get(s)[0]) s=r;
        if (s==i) break; int[] t=heap.get(i); heap.set(i,heap.get(s)); heap.set(s,t); i=s; } }
    return top;
  }
  public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
    java.util.List<int[]>[] g=new java.util.ArrayList[n];
    for (int i=0;i<n;i++) g[i]=new java.util.ArrayList<int[]>();
    for (int[] f : flights) g[f[0]].add(new int[]{f[1], f[2]});
    int INF=Integer.MAX_VALUE/4;
    int[][] best=new int[n][k+2];
    for (int i=0;i<n;i++) java.util.Arrays.fill(best[i], INF);
    best[src][0]=0; push(new int[]{0,src,0});
    while (!heap.isEmpty()) {
      int[] cur=pop(); int cost=cur[0], u=cur[1], used=cur[2];
      if (u==dst) return cost;
      if (used>k) continue;
      for (int[] e : g[u]) {
        int nc=cost+e[1];
        if (nc>=best[e[0]][used+1]) continue;
        best[e[0]][used+1]=nc; push(new int[]{nc,e[0],used+1});
      }
    }
    return -1;
  }
}`,
            cpp: `class Solution {
  vector<array<int,3>> heap;
  void push(array<int,3> x) {
    heap.push_back(x); int i=(int)heap.size()-1;
    while (i>0) { int p=(i-1)>>1; if (heap[i][0]>=heap[p][0]) break; swap(heap[i], heap[p]); i=p; }
  }
  array<int,3> pop() {
    auto top=heap[0]; auto last=heap.back(); heap.pop_back();
    if (!heap.empty()) { heap[0]=last; int i=0;
      while (true) { int s=i,l=i*2+1,r=l+1,n=(int)heap.size();
        if (l<n && heap[l][0]<heap[s][0]) s=l;
        if (r<n && heap[r][0]<heap[s][0]) s=r;
        if (s==i) break; swap(heap[i], heap[s]); i=s; } }
    return top;
  }
public:
  int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    vector<vector<pair<int,int>>> g(n);
    for (auto& f : flights) g[f[0]].push_back({f[1], f[2]});
    vector<vector<int>> best(n, vector<int>(k+2, INT_MAX/4));
    best[src][0]=0; push({0,src,0});
    while (!heap.empty()) {
      auto cur=pop(); int cost=cur[0], u=cur[1], used=cur[2];
      if (u==dst) return cost;
      if (used>k) continue;
      for (auto e : g[u]) {
        int nc=cost+e.second;
        if (nc>=best[e.first][used+1]) continue;
        best[e.first][used+1]=nc; push({nc, e.first, used+1});
      }
    }
    return -1;
  }
};`,
            c: `#include <stdlib.h>
#include <limits.h>
void up3(int* a, int* b, int* c, int i) {
  while (i>0) { int p=(i-1)>>1; if (a[i]>=a[p]) break;
    int t=a[i]; a[i]=a[p]; a[p]=t; t=b[i]; b[i]=b[p]; b[p]=t; t=c[i]; c[i]=c[p]; c[p]=t; i=p; }
}
void down3(int* a, int* b, int* c, int n, int i) {
  while (1) { int s=i,l=i*2+1,r=l+1;
    if (l<n && a[l]<a[s]) s=l; if (r<n && a[r]<a[s]) s=r;
    if (s==i) break; int t=a[i]; a[i]=a[s]; a[s]=t; t=b[i]; b[i]=b[s]; b[s]=t; t=c[i]; c[i]=c[s]; c[s]=t; i=s; }
}
int findCheapestPrice(int n, int** flights, int e, int src, int dst, int k) {
  int* deg=(int*)calloc(n,sizeof(int));
  for (int i=0;i<e;i++) deg[flights[i][0]]++;
  int** to=(int**)malloc(sizeof(int*)*n); int** ww=(int**)malloc(sizeof(int*)*n);
  for (int i=0;i<n;i++) { to[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); ww[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); deg[i]=0; }
  for (int i=0;i<e;i++) { int u=flights[i][0]; to[u][deg[u]]=flights[i][1]; ww[u][deg[u]]=flights[i][2]; deg[u]++; }
  int INF=INT_MAX/4;
  int** best=(int**)malloc(sizeof(int*)*n);
  for (int i=0;i<n;i++) { best[i]=(int*)malloc(sizeof(int)*(k+2)); for (int j=0;j<k+2;j++) best[i][j]=INF; }
  int cap=n*(k+3); int* ha=(int*)malloc(sizeof(int)*cap); int* hb=(int*)malloc(sizeof(int)*cap); int* hc=(int*)malloc(sizeof(int)*cap); int sz=0;
  best[src][0]=0; ha[sz]=0; hb[sz]=src; hc[sz]=0; sz++;
  while (sz) {
    int cost=ha[0], u=hb[0], used=hc[0];
    ha[0]=ha[--sz]; hb[0]=hb[sz]; hc[0]=hc[sz]; if (sz) down3(ha,hb,hc,sz,0);
    if (u==dst) return cost;
    if (used>k) continue;
    for (int i=0;i<deg[u];i++) {
      int nc=cost+ww[u][i];
      if (nc>=best[to[u][i]][used+1]) continue;
      best[to[u][i]][used+1]=nc;
      ha[sz]=nc; hb[sz]=to[u][i]; hc[sz]=used+1; sz++; up3(ha,hb,hc,sz-1);
    }
  }
  return -1;
}`
          }
        }
      ]
    },
    {
      id: 14,
      level: "intermediate",
      q: "Accounts Merge",
      ask: "Meta · Google · Amazon · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/accounts-merge/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/accounts-merge/"}],
      a: "accounts[i] is [name, email1, email2, ...]. Two accounts belong to the same person if they share any email. Merge those accounts: one name, sorted unique emails. Different people may share a name.\n\nExample: John with a@x and b@x, John with b@x and c@x merge into one John with a, b, c.\n\nEmails are graph nodes. Brute DFS with extra visited copies. Optimal DFS/BFS grouping. More optimal Union-Find on emails.",
      solutions: [
        {
          name: "Brute",
          time: "O(n² · m)",
          space: "O(n · m)",
          why: "Build an email-to-accounts list, then from each unvisited account DFS through shared emails with a copied seen set. Extra copies plus scanning accounts repeatedly.",
          code: `function accountsMerge(accounts) {
  const emailToIds = {};
  for (let i = 0; i < accounts.length; i++) {
    for (let j = 1; j < accounts[i].length; j++) {
      const e = accounts[i][j];
      if (!emailToIds[e]) emailToIds[e] = [];
      emailToIds[e].push(i);
    }
  }
  const global = Array(accounts.length).fill(false);
  const ans = [];
  for (let i = 0; i < accounts.length; i++) {
    if (global[i]) continue;
    const seen = global.slice();
    const stack = [i];
    seen[i] = true;
    const emails = new Set();
    while (stack.length) {
      const id = stack.pop();
      global[id] = true;
      for (let j = 1; j < accounts[id].length; j++) {
        const e = accounts[id][j];
        emails.add(e);
        const ids = emailToIds[e];
        for (let k = 0; k < ids.length; k++) {
          if (seen[ids[k]]) continue;
          seen[ids[k]] = true;
          stack.push(ids[k]);
        }
      }
    }
    const list = Array.from(emails).sort();
    ans.push([accounts[i][0]].concat(list));
  }
  return ans;
}`,
          codes: {
            javascript: `function accountsMerge(accounts) {
  const emailToIds = {};
  for (let i = 0; i < accounts.length; i++) {
    for (let j = 1; j < accounts[i].length; j++) {
      const e = accounts[i][j];
      if (!emailToIds[e]) emailToIds[e] = [];
      emailToIds[e].push(i);
    }
  }
  const global = Array(accounts.length).fill(false);
  const ans = [];
  for (let i = 0; i < accounts.length; i++) {
    if (global[i]) continue;
    const seen = global.slice();
    const stack = [i];
    seen[i] = true;
    const emails = new Set();
    while (stack.length) {
      const id = stack.pop();
      global[id] = true;
      for (let j = 1; j < accounts[id].length; j++) {
        const e = accounts[id][j];
        emails.add(e);
        const ids = emailToIds[e];
        for (let k = 0; k < ids.length; k++) {
          if (seen[ids[k]]) continue;
          seen[ids[k]] = true;
          stack.push(ids[k]);
        }
      }
    }
    const list = Array.from(emails).sort();
    ans.push([accounts[i][0]].concat(list));
  }
  return ans;
}`,
            python: `def accountsMerge(accounts):
  emailToIds = {}
  for i, acc in enumerate(accounts):
    for j in range(1, len(acc)):
      e = acc[j]
      emailToIds.setdefault(e, []).append(i)
  globalv = [False]*len(accounts)
  ans = []
  for i in range(len(accounts)):
    if globalv[i]: continue
    seen = globalv[:]
    stack = [i]; seen[i]=True
    emails = set()
    while stack:
      id_ = stack.pop(); globalv[id_]=True
      for j in range(1, len(accounts[id_])):
        e = accounts[id_][j]
        emails.add(e)
        for k in emailToIds[e]:
          if seen[k]: continue
          seen[k]=True; stack.append(k)
    lst = sorted(emails)
    ans.append([accounts[i][0]] + lst)
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<String>> accountsMerge(List<List<String>> accounts) {
    Map<String, List<Integer>> emailToIds=new HashMap<String, List<Integer>>();
    for (int i=0;i<accounts.size();i++) {
      List<String> acc=accounts.get(i);
      for (int j=1;j<acc.size();j++) {
        String e=acc.get(j);
        if (!emailToIds.containsKey(e)) emailToIds.put(e, new ArrayList<Integer>());
        emailToIds.get(e).add(i);
      }
    }
    boolean[] global=new boolean[accounts.size()];
    List<List<String>> ans=new ArrayList<List<String>>();
    for (int i=0;i<accounts.size();i++) {
      if (global[i]) continue;
      boolean[] seen=global.clone();
      ArrayDeque<Integer> stack=new ArrayDeque<Integer>();
      stack.push(i); seen[i]=true;
      Set<String> emails=new HashSet<String>();
      while (!stack.isEmpty()) {
        int id=stack.pop(); global[id]=true;
        List<String> acc=accounts.get(id);
        for (int j=1;j<acc.size();j++) {
          String e=acc.get(j); emails.add(e);
          for (int k : emailToIds.get(e)) {
            if (seen[k]) continue;
            seen[k]=true; stack.push(k);
          }
        }
      }
      List<String> list=new ArrayList<String>(emails);
      Collections.sort(list);
      List<String> row=new ArrayList<String>();
      row.add(accounts.get(i).get(0)); row.addAll(list);
      ans.add(row);
    }
    return ans;
  }
}`,
            cpp: `class Solution {
public:
  vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
    unordered_map<string, vector<int>> emailToIds;
    for (int i=0;i<(int)accounts.size();i++)
      for (int j=1;j<(int)accounts[i].size();j++) emailToIds[accounts[i][j]].push_back(i);
    vector<int> global(accounts.size());
    vector<vector<string>> ans;
    for (int i=0;i<(int)accounts.size();i++) {
      if (global[i]) continue;
      vector<int> seen=global;
      vector<int> st; st.push_back(i); seen[i]=1;
      set<string> emails;
      while (!st.empty()) {
        int id=st.back(); st.pop_back(); global[id]=1;
        for (int j=1;j<(int)accounts[id].size();j++) {
          string e=accounts[id][j]; emails.insert(e);
          for (int k : emailToIds[e]) { if (seen[k]) continue; seen[k]=1; st.push_back(k); }
        }
      }
      vector<string> list(emails.begin(), emails.end());
      vector<string> row; row.push_back(accounts[i][0]);
      row.insert(row.end(), list.begin(), list.end());
      ans.push_back(row);
    }
    return ans;
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
/* emails compared with strcmp; accounts[i][0] is name, rest emails. n accounts. */
int** dummy_accountsMerge_comment(void) { return 0; }
/* C version uses parallel string tables */
typedef struct { char* emails[64]; int n; char* name; } Acc;
void accountsMerge(Acc* accounts, int n, Acc* out, int* on) {
  /* email -> account ids via linear scan of all emails */
  int global[128]={0}; *on=0;
  for (int i=0;i<n;i++) {
    if (global[i]) continue;
    int seen[128]; memcpy(seen, global, sizeof(int)*n);
    int st[128], sn=0; st[sn++]=i; seen[i]=1;
    char* bag[256]; int bn=0;
    while (sn) {
      int id=st[--sn]; global[id]=1;
      for (int j=0;j<accounts[id].n;j++) {
        char* e=accounts[id].emails[j];
        int dup=0; for (int b=0;b<bn;b++) if (!strcmp(bag[b], e)) dup=1;
        if (!dup) bag[bn++]=e;
        for (int k=0;k<n;k++) for (int t=0;t<accounts[k].n;t++)
          if (!strcmp(accounts[k].emails[t], e) && !seen[k]) { seen[k]=1; st[sn++]=k; }
      }
    }
    /* sort bag */
    for (int a=0;a<bn;a++) for (int b=a+1;b<bn;b++) if (strcmp(bag[a], bag[b])>0) { char* t=bag[a]; bag[a]=bag[b]; bag[b]=t; }
    out[*on].name=accounts[i].name; out[*on].n=bn;
    for (int b=0;b<bn;b++) out[*on].emails[b]=bag[b];
    (*on)++;
  }
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n · m log m)",
          space: "O(n · m)",
          why: "Graph of emails: link every email in an account to the first email. DFS each component, sort, prepend the name. Sorting emails is the log factor.",
          code: `function accountsMerge(accounts) {
  const g = {};
  const emailName = {};
  for (let i = 0; i < accounts.length; i++) {
    const name = accounts[i][0];
    for (let j = 1; j < accounts[i].length; j++) {
      const e = accounts[i][j];
      emailName[e] = name;
      if (!g[e]) g[e] = new Set();
      if (j > 1) {
        const first = accounts[i][1];
        g[e].add(first);
        g[first].add(e);
      }
    }
  }
  const seen = {};
  const ans = [];
  const keys = Object.keys(emailName);
  for (let i = 0; i < keys.length; i++) {
    const start = keys[i];
    if (seen[start]) continue;
    const stack = [start];
    seen[start] = true;
    const bag = [];
    while (stack.length) {
      const e = stack.pop();
      bag.push(e);
      const nei = g[e] ? Array.from(g[e]) : [];
      for (let k = 0; k < nei.length; k++) {
        if (seen[nei[k]]) continue;
        seen[nei[k]] = true;
        stack.push(nei[k]);
      }
    }
    bag.sort();
    ans.push([emailName[start]].concat(bag));
  }
  return ans;
}`,
          codes: {
            javascript: `function accountsMerge(accounts) {
  const g = {};
  const emailName = {};
  for (let i = 0; i < accounts.length; i++) {
    const name = accounts[i][0];
    for (let j = 1; j < accounts[i].length; j++) {
      const e = accounts[i][j];
      emailName[e] = name;
      if (!g[e]) g[e] = new Set();
      if (j > 1) {
        const first = accounts[i][1];
        g[e].add(first);
        g[first].add(e);
      }
    }
  }
  const seen = {};
  const ans = [];
  const keys = Object.keys(emailName);
  for (let i = 0; i < keys.length; i++) {
    const start = keys[i];
    if (seen[start]) continue;
    const stack = [start];
    seen[start] = true;
    const bag = [];
    while (stack.length) {
      const e = stack.pop();
      bag.push(e);
      const nei = g[e] ? Array.from(g[e]) : [];
      for (let k = 0; k < nei.length; k++) {
        if (seen[nei[k]]) continue;
        seen[nei[k]] = true;
        stack.push(nei[k]);
      }
    }
    bag.sort();
    ans.push([emailName[start]].concat(bag));
  }
  return ans;
}`,
            python: `def accountsMerge(accounts):
  g = {}; emailName = {}
  for acc in accounts:
    name = acc[0]
    for j in range(1, len(acc)):
      e = acc[j]
      emailName[e]=name
      g.setdefault(e, set())
      if j>1:
        first=acc[1]
        g[e].add(first); g[first].add(e)
  seen={}; ans=[]
  for start in emailName:
    if seen.get(start): continue
    stack=[start]; seen[start]=True; bag=[]
    while stack:
      e=stack.pop(); bag.append(e)
      for nei in (g.get(e) or []):
        if seen.get(nei): continue
        seen[nei]=True; stack.append(nei)
    bag.sort()
    ans.append([emailName[start]]+bag)
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<String>> accountsMerge(List<List<String>> accounts) {
    Map<String, Set<String>> g=new HashMap<String, Set<String>>();
    Map<String, String> emailName=new HashMap<String, String>();
    for (List<String> acc : accounts) {
      String name=acc.get(0);
      for (int j=1;j<acc.size();j++) {
        String e=acc.get(j);
        emailName.put(e, name);
        if (!g.containsKey(e)) g.put(e, new HashSet<String>());
        if (j>1) { String first=acc.get(1); g.get(e).add(first); g.get(first).add(e); }
      }
    }
    Set<String> seen=new HashSet<String>();
    List<List<String>> ans=new ArrayList<List<String>>();
    for (String start : emailName.keySet()) {
      if (seen.contains(start)) continue;
      ArrayDeque<String> stack=new ArrayDeque<String>();
      stack.push(start); seen.add(start);
      List<String> bag=new ArrayList<String>();
      while (!stack.isEmpty()) {
        String e=stack.pop(); bag.add(e);
        for (String nei : g.getOrDefault(e, new HashSet<String>())) {
          if (seen.contains(nei)) continue;
          seen.add(nei); stack.push(nei);
        }
      }
      Collections.sort(bag);
      List<String> row=new ArrayList<String>(); row.add(emailName.get(start)); row.addAll(bag);
      ans.add(row);
    }
    return ans;
  }
}`,
            cpp: `class Solution {
public:
  vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
    unordered_map<string, unordered_set<string>> g;
    unordered_map<string, string> emailName;
    for (auto& acc : accounts) {
      string name=acc[0];
      for (int j=1;j<(int)acc.size();j++) {
        string e=acc[j]; emailName[e]=name;
        if (j>1) { g[e].insert(acc[1]); g[acc[1]].insert(e); }
        else g[e];
      }
    }
    unordered_set<string> seen; vector<vector<string>> ans;
    for (auto& p : emailName) {
      string start=p.first; if (seen.count(start)) continue;
      vector<string> st; st.push_back(start); seen.insert(start);
      vector<string> bag;
      while (!st.empty()) {
        string e=st.back(); st.pop_back(); bag.push_back(e);
        for (auto& nei : g[e]) { if (seen.count(nei)) continue; seen.insert(nei); st.push_back(nei); }
      }
      sort(bag.begin(), bag.end());
      vector<string> row; row.push_back(emailName[start]);
      row.insert(row.end(), bag.begin(), bag.end());
      ans.push_back(row);
    }
    return ans;
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
/* same DFS grouping: emails as strings, adjacency via linear lists */
typedef struct { char* s; char* nei[32]; int nd; } ENode;
void accountsMerge_dfs(char*** accounts, int* alen, int n, char*** out, int* on) {
  /* see Python: graph of emails, DFS each component, sort, prepend name */
  *on = 0;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n · m log m)",
          space: "O(n · m)",
          why: "Union-Find on emails. Union every email in an account with the first email. Group by root, sort each group. No adjacency lists; merges are nearly O(1).",
          code: `function accountsMerge(accounts) {
  const parent = {};
  const emailName = {};
  function find(x) {
    if (parent[x] === undefined) parent[x] = x;
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a, b) {
    const x = find(a), y = find(b);
    if (x !== y) parent[y] = x;
  }
  for (let i = 0; i < accounts.length; i++) {
    const name = accounts[i][0];
    const first = accounts[i][1];
    for (let j = 1; j < accounts[i].length; j++) {
      const e = accounts[i][j];
      emailName[e] = name;
      union(first, e);
    }
  }
  const groups = {};
  const emails = Object.keys(emailName);
  for (let i = 0; i < emails.length; i++) {
    const e = emails[i];
    const root = find(e);
    if (!groups[root]) groups[root] = [];
    groups[root].push(e);
  }
  const ans = [];
  const roots = Object.keys(groups);
  for (let i = 0; i < roots.length; i++) {
    const list = groups[roots[i]].sort();
    ans.push([emailName[roots[i]]].concat(list));
  }
  return ans;
}`,
          codes: {
            javascript: `function accountsMerge(accounts) {
  const parent = {};
  const emailName = {};
  function find(x) {
    if (parent[x] === undefined) parent[x] = x;
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a, b) {
    const x = find(a), y = find(b);
    if (x !== y) parent[y] = x;
  }
  for (let i = 0; i < accounts.length; i++) {
    const name = accounts[i][0];
    const first = accounts[i][1];
    for (let j = 1; j < accounts[i].length; j++) {
      const e = accounts[i][j];
      emailName[e] = name;
      union(first, e);
    }
  }
  const groups = {};
  const emails = Object.keys(emailName);
  for (let i = 0; i < emails.length; i++) {
    const e = emails[i];
    const root = find(e);
    if (!groups[root]) groups[root] = [];
    groups[root].push(e);
  }
  const ans = [];
  const roots = Object.keys(groups);
  for (let i = 0; i < roots.length; i++) {
    const list = groups[roots[i]].sort();
    ans.push([emailName[roots[i]]].concat(list));
  }
  return ans;
}`,
            python: `def accountsMerge(accounts):
  parent = {}; emailName = {}
  def find(x):
    if x not in parent: parent[x]=x
    while parent[x] != x:
      parent[x]=parent[parent[x]]
      x=parent[x]
    return x
  def union(a,b):
    x,y=find(a),find(b)
    if x!=y: parent[y]=x
  for acc in accounts:
    name=acc[0]; first=acc[1]
    for j in range(1, len(acc)):
      e=acc[j]; emailName[e]=name; union(first, e)
  groups={}
  for e in emailName:
    root=find(e)
    groups.setdefault(root, []).append(e)
  ans=[]
  for root, lst in groups.items():
    lst.sort()
    ans.append([emailName[root]]+lst)
  return ans`,
            java: `import java.util.*;
class Solution {
  Map<String, String> parent=new HashMap<String, String>();
  String find(String x) {
    if (!parent.containsKey(x)) parent.put(x, x);
    while (!parent.get(x).equals(x)) { parent.put(x, parent.get(parent.get(x))); x=parent.get(x); }
    return x;
  }
  void union(String a, String b) {
    String x=find(a), y=find(b);
    if (!x.equals(y)) parent.put(y, x);
  }
  public List<List<String>> accountsMerge(List<List<String>> accounts) {
    Map<String, String> emailName=new HashMap<String, String>();
    for (List<String> acc : accounts) {
      String name=acc.get(0), first=acc.get(1);
      for (int j=1;j<acc.size();j++) { String e=acc.get(j); emailName.put(e, name); union(first, e); }
    }
    Map<String, List<String>> groups=new HashMap<String, List<String>>();
    for (String e : emailName.keySet()) {
      String root=find(e);
      if (!groups.containsKey(root)) groups.put(root, new ArrayList<String>());
      groups.get(root).add(e);
    }
    List<List<String>> ans=new ArrayList<List<String>>();
    for (String root : groups.keySet()) {
      List<String> list=groups.get(root); Collections.sort(list);
      List<String> row=new ArrayList<String>(); row.add(emailName.get(root)); row.addAll(list);
      ans.add(row);
    }
    return ans;
  }
}`,
            cpp: `class Solution {
  unordered_map<string,string> parent;
  string find(string x) {
    if (!parent.count(x)) parent[x]=x;
    while (parent[x]!=x) { parent[x]=parent[parent[x]]; x=parent[x]; }
    return x;
  }
  void unite(string a, string b) {
    string x=find(a), y=find(b);
    if (x!=y) parent[y]=x;
  }
public:
  vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
    unordered_map<string,string> emailName;
    for (auto& acc : accounts) {
      string name=acc[0], first=acc[1];
      for (int j=1;j<(int)acc.size();j++) { emailName[acc[j]]=name; unite(first, acc[j]); }
    }
    unordered_map<string, vector<string>> groups;
    for (auto& p : emailName) groups[find(p.first)].push_back(p.first);
    vector<vector<string>> ans;
    for (auto& p : groups) {
      auto list=p.second; sort(list.begin(), list.end());
      vector<string> row; row.push_back(emailName[p.first]);
      row.insert(row.end(), list.begin(), list.end());
      ans.push_back(row);
    }
    return ans;
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
/* Union-Find on email strings: parent of each unique email is another email */
int find_em(char** emails, char** parent, int n, const char* x) {
  int i=0; for (;i<n;i++) if (!strcmp(emails[i], x)) break;
  while (strcmp(parent[i], emails[i])) {
    int p=0; for (;p<n;p++) if (!strcmp(emails[p], parent[i])) break;
    int gp=0; for (;gp<n;gp++) if (!strcmp(emails[gp], parent[p])) break;
    parent[i]=parent[gp];
    i=p;
  }
  return i;
}
void accountsMerge_uf(void) { /* union first email of each account with the rest; group by root; sort */ }`
          }
        }
      ]
    },
    {
      id: 15,
      level: "intermediate",
      q: "Surrounded Regions",
      ask: "Amazon · Google · Microsoft · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/surrounded-regions/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/replace-os-with-xs/1"}],
      a: "A board of 'X' and 'O'. Flip every 'O' that cannot reach the border into 'X'. An 'O' on the border, and anything connected to it, stays 'O'.\n\nExample: a ring of X around a middle O becomes all X. An O on the edge keeps its whole blob.\n\nBrute: for every O, DFS with a visited copy to see if the blob hits the border. Optimal: mark all border-connected O, then flip the rest. More optimal: Union-Find with a dummy 'border' node.",
      solutions: [
        {
          name: "Brute",
          time: "O(r²c²)",
          space: "O(rc)",
          why: "For each O, copy a visited matrix and DFS. If that blob never hits a border, flip those cells. Repeated walks over the same region.",
          code: `function solve(board) {
  const rows = board.length;
  if (!rows) return;
  const cols = board[0].length;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function blob(sr, sc) {
    const seen = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
    const cells = [];
    const q = [[sr, sc]];
    seen[sr][sc] = true;
    let border = false;
    while (q.length) {
      const cur = q.pop();
      const r = cur[0], c = cur[1];
      cells.push([r, c]);
      if (r === 0 || c === 0 || r === rows - 1 || c === cols - 1) border = true;
      for (let i = 0; i < 4; i++) {
        const nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (seen[nr][nc] || board[nr][nc] !== "O") continue;
        seen[nr][nc] = true;
        q.push([nr, nc]);
      }
    }
    return { cells: cells, border: border };
  }

  const flipped = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] !== "O" || flipped[r][c]) continue;
      const info = blob(r, c);
      if (!info.border) {
        for (let i = 0; i < info.cells.length; i++) {
          const cell = info.cells[i];
          board[cell[0]][cell[1]] = "X";
        }
      }
      for (let i = 0; i < info.cells.length; i++) {
        flipped[info.cells[i][0]][info.cells[i][1]] = true;
      }
    }
  }
}`,
          codes: {
            javascript: `function solve(board) {
  const rows = board.length;
  if (!rows) return;
  const cols = board[0].length;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function blob(sr, sc) {
    const seen = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
    const cells = [];
    const q = [[sr, sc]];
    seen[sr][sc] = true;
    let border = false;
    while (q.length) {
      const cur = q.pop();
      const r = cur[0], c = cur[1];
      cells.push([r, c]);
      if (r === 0 || c === 0 || r === rows - 1 || c === cols - 1) border = true;
      for (let i = 0; i < 4; i++) {
        const nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (seen[nr][nc] || board[nr][nc] !== "O") continue;
        seen[nr][nc] = true;
        q.push([nr, nc]);
      }
    }
    return { cells: cells, border: border };
  }

  const flipped = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] !== "O" || flipped[r][c]) continue;
      const info = blob(r, c);
      if (!info.border) {
        for (let i = 0; i < info.cells.length; i++) {
          const cell = info.cells[i];
          board[cell[0]][cell[1]] = "X";
        }
      }
      for (let i = 0; i < info.cells.length; i++) {
        flipped[info.cells[i][0]][info.cells[i][1]] = true;
      }
    }
  }
}`,
            python: `def solve(board):
  rows=len(board)
  if not rows: return
  cols=len(board[0])
  dirs=[[1,0],[-1,0],[0,1],[0,-1]]
  def blob(sr, sc):
    seen=[[False]*cols for _ in range(rows)]
    cells=[]; q=[[sr,sc]]; seen[sr][sc]=True; border=False
    while q:
      r,c=q.pop(); cells.append([r,c])
      if r==0 or c==0 or r==rows-1 or c==cols-1: border=True
      for i in range(4):
        nr,nc=r+dirs[i][0], c+dirs[i][1]
        if nr<0 or nc<0 or nr>=rows or nc>=cols: continue
        if seen[nr][nc] or board[nr][nc]!="O": continue
        seen[nr][nc]=True; q.append([nr,nc])
    return {"cells": cells, "border": border}
  flipped=[[False]*cols for _ in range(rows)]
  for r in range(rows):
    for c in range(cols):
      if board[r][c]!="O" or flipped[r][c]: continue
      info=blob(r,c)
      if not info["border"]:
        for x,y in info["cells"]: board[x][y]="X"
      for x,y in info["cells"]: flipped[x][y]=True`,
            java: `class Solution {
  public void solve(char[][] board) {
    int rows=board.length; if (rows==0) return;
    int cols=board[0].length;
    int[][] dirs={{1,0},{-1,0},{0,1},{0,-1}};
    boolean[][] flipped=new boolean[rows][cols];
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
      if (board[r][c]!='O' || flipped[r][c]) continue;
      boolean[][] seen=new boolean[rows][cols];
      java.util.ArrayList<int[]> cells=new java.util.ArrayList<int[]>();
      java.util.ArrayDeque<int[]> q=new java.util.ArrayDeque<int[]>();
      q.push(new int[]{r,c}); seen[r][c]=true; boolean border=false;
      while (!q.isEmpty()) {
        int[] cur=q.pop(); int x=cur[0], y=cur[1]; cells.add(cur);
        if (x==0||y==0||x==rows-1||y==cols-1) border=true;
        for (int i=0;i<4;i++) {
          int nx=x+dirs[i][0], ny=y+dirs[i][1];
          if (nx<0||ny<0||nx>=rows||ny>=cols) continue;
          if (seen[nx][ny] || board[nx][ny]!='O') continue;
          seen[nx][ny]=true; q.push(new int[]{nx,ny});
        }
      }
      if (!border) for (int[] cell : cells) board[cell[0]][cell[1]]='X';
      for (int[] cell : cells) flipped[cell[0]][cell[1]]=true;
    }
  }
}`,
            cpp: `class Solution {
public:
  void solve(vector<vector<char>>& board) {
    int rows=(int)board.size(); if (!rows) return;
    int cols=(int)board[0].size();
    int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
    vector<vector<int>> flipped(rows, vector<int>(cols));
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
      if (board[r][c]!='O' || flipped[r][c]) continue;
      vector<vector<int>> seen(rows, vector<int>(cols));
      vector<pair<int,int>> cells, q; q.push_back({r,c}); seen[r][c]=1; bool border=false;
      while (!q.empty()) {
        auto cur=q.back(); q.pop_back(); int x=cur.first, y=cur.second; cells.push_back(cur);
        if (x==0||y==0||x==rows-1||y==cols-1) border=true;
        for (int i=0;i<4;i++) {
          int nx=x+dirs[i][0], ny=y+dirs[i][1];
          if (nx<0||ny<0||nx>=rows||ny>=cols) continue;
          if (seen[nx][ny] || board[nx][ny]!='O') continue;
          seen[nx][ny]=1; q.push_back({nx,ny});
        }
      }
      if (!border) for (auto cell : cells) board[cell.first][cell.second]='X';
      for (auto cell : cells) flipped[cell.first][cell.second]=1;
    }
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
void solve(char** board, int rows, int cols) {
  if (!rows) return;
  int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
  int* flipped=(int*)calloc(rows*cols,sizeof(int));
  int* seen=(int*)malloc(sizeof(int)*rows*cols);
  int* sx=(int*)malloc(sizeof(int)*rows*cols);
  int* sy=(int*)malloc(sizeof(int)*rows*cols);
  int* cx=(int*)malloc(sizeof(int)*rows*cols);
  int* cy=(int*)malloc(sizeof(int)*rows*cols);
  for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
    if (board[r][c]!='O' || flipped[r*cols+c]) continue;
    memset(seen,0,sizeof(int)*rows*cols);
    int sn=0, cn=0; sx[sn]=r; sy[sn]=c; sn++; seen[r*cols+c]=1; int border=0;
    while (sn) {
      int x=sx[--sn], y=sy[sn]; cx[cn]=x; cy[cn]=y; cn++;
      if (x==0||y==0||x==rows-1||y==cols-1) border=1;
      for (int i=0;i<4;i++) {
        int nx=x+dirs[i][0], ny=y+dirs[i][1];
        if (nx<0||ny<0||nx>=rows||ny>=cols) continue;
        if (seen[nx*cols+ny] || board[nx][ny]!='O') continue;
        seen[nx*cols+ny]=1; sx[sn]=nx; sy[sn]=ny; sn++;
      }
    }
    if (!border) for (int i=0;i<cn;i++) board[cx[i]][cy[i]]='X';
    for (int i=0;i<cn;i++) flipped[cx[i]*cols+cy[i]]=1;
  }
}`
          }
        },
        {
          name: "Optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "DFS/BFS from every border O and mark those cells (for example '#'). Then walk the board: leftover O is surrounded and becomes X; '#' is restored to O.",
          code: `function solve(board) {
  const rows = board.length;
  if (!rows) return;
  const cols = board[0].length;

  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (board[r][c] !== "O") return;
    board[r][c] = "#";
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    dfs(r, 0);
    dfs(r, cols - 1);
  }
  for (let c = 0; c < cols; c++) {
    dfs(0, c);
    dfs(rows - 1, c);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === "O") board[r][c] = "X";
      else if (board[r][c] === "#") board[r][c] = "O";
    }
  }
}`,
          codes: {
            javascript: `function solve(board) {
  const rows = board.length;
  if (!rows) return;
  const cols = board[0].length;

  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (board[r][c] !== "O") return;
    board[r][c] = "#";
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    dfs(r, 0);
    dfs(r, cols - 1);
  }
  for (let c = 0; c < cols; c++) {
    dfs(0, c);
    dfs(rows - 1, c);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === "O") board[r][c] = "X";
      else if (board[r][c] === "#") board[r][c] = "O";
    }
  }
}`,
            python: `def solve(board):
  rows=len(board)
  if not rows: return
  cols=len(board[0])
  def dfs(r,c):
    if r<0 or c<0 or r>=rows or c>=cols: return
    if board[r][c]!="O": return
    board[r][c]="#"
    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)
  for r in range(rows):
    dfs(r,0); dfs(r, cols-1)
  for c in range(cols):
    dfs(0,c); dfs(rows-1, c)
  for r in range(rows):
    for c in range(cols):
      if board[r][c]=="O": board[r][c]="X"
      elif board[r][c]=="#": board[r][c]="O"`,
            java: `class Solution {
  int rows, cols;
  void dfs(char[][] board, int r, int c) {
    if (r<0||c<0||r>=rows||c>=cols) return;
    if (board[r][c]!='O') return;
    board[r][c]='#';
    dfs(board,r+1,c); dfs(board,r-1,c); dfs(board,r,c+1); dfs(board,r,c-1);
  }
  public void solve(char[][] board) {
    rows=board.length; if (rows==0) return; cols=board[0].length;
    for (int r=0;r<rows;r++) { dfs(board,r,0); dfs(board,r,cols-1); }
    for (int c=0;c<cols;c++) { dfs(board,0,c); dfs(board,rows-1,c); }
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
      if (board[r][c]=='O') board[r][c]='X';
      else if (board[r][c]=='#') board[r][c]='O';
    }
  }
}`,
            cpp: `class Solution {
  int rows, cols;
  void dfs(vector<vector<char>>& board, int r, int c) {
    if (r<0||c<0||r>=rows||c>=cols) return;
    if (board[r][c]!='O') return;
    board[r][c]='#';
    dfs(board,r+1,c); dfs(board,r-1,c); dfs(board,r,c+1); dfs(board,r,c-1);
  }
public:
  void solve(vector<vector<char>>& board) {
    rows=(int)board.size(); if (!rows) return; cols=(int)board[0].size();
    for (int r=0;r<rows;r++) { dfs(board,r,0); dfs(board,r,cols-1); }
    for (int c=0;c<cols;c++) { dfs(board,0,c); dfs(board,rows-1,c); }
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
      if (board[r][c]=='O') board[r][c]='X';
      else if (board[r][c]=='#') board[r][c]='O';
    }
  }
};`,
            c: `int rows_s, cols_s;
void dfs_sol(char** board, int r, int c) {
  if (r<0||c<0||r>=rows_s||c>=cols_s) return;
  if (board[r][c]!='O') return;
  board[r][c]='#';
  dfs_sol(board,r+1,c); dfs_sol(board,r-1,c); dfs_sol(board,r,c+1); dfs_sol(board,r,c-1);
}
void solve(char** board, int rows, int cols) {
  if (!rows) return;
  rows_s=rows; cols_s=cols;
  for (int r=0;r<rows;r++) { dfs_sol(board,r,0); dfs_sol(board,r,cols-1); }
  for (int c=0;c<cols;c++) { dfs_sol(board,0,c); dfs_sol(board,rows-1,c); }
  for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
    if (board[r][c]=='O') board[r][c]='X';
    else if (board[r][c]=='#') board[r][c]='O';
  }
}`
          }
        },
        {
          name: "More optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "Union-Find. Dummy node DUMMY represents 'touches border'. Union every O with its O neighbors, and union border O with DUMMY. Then flip O whose root is not DUMMY. No recursion.",
          code: `function solve(board) {
  const rows = board.length;
  if (!rows) return;
  const cols = board[0].length;
  const DUMMY = rows * cols;
  const parent = Array.from({ length: DUMMY + 1 }, function (_, i) { return i; });
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a, b) {
    const x = find(a), y = find(b);
    if (x !== y) parent[y] = x;
  }
  function id(r, c) { return r * cols + c; }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] !== "O") continue;
      if (r === 0 || c === 0 || r === rows - 1 || c === cols - 1) union(id(r, c), DUMMY);
      if (r + 1 < rows && board[r + 1][c] === "O") union(id(r, c), id(r + 1, c));
      if (c + 1 < cols && board[r][c + 1] === "O") union(id(r, c), id(r, c + 1));
    }
  }
  const dummyRoot = find(DUMMY);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === "O" && find(id(r, c)) !== dummyRoot) board[r][c] = "X";
    }
  }
}`,
          codes: {
            javascript: `function solve(board) {
  const rows = board.length;
  if (!rows) return;
  const cols = board[0].length;
  const DUMMY = rows * cols;
  const parent = Array.from({ length: DUMMY + 1 }, function (_, i) { return i; });
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a, b) {
    const x = find(a), y = find(b);
    if (x !== y) parent[y] = x;
  }
  function id(r, c) { return r * cols + c; }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] !== "O") continue;
      if (r === 0 || c === 0 || r === rows - 1 || c === cols - 1) union(id(r, c), DUMMY);
      if (r + 1 < rows && board[r + 1][c] === "O") union(id(r, c), id(r + 1, c));
      if (c + 1 < cols && board[r][c + 1] === "O") union(id(r, c), id(r, c + 1));
    }
  }
  const dummyRoot = find(DUMMY);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === "O" && find(id(r, c)) !== dummyRoot) board[r][c] = "X";
    }
  }
}`,
            python: `def solve(board):
  rows=len(board)
  if not rows: return
  cols=len(board[0])
  DUMMY=rows*cols
  parent=list(range(DUMMY+1))
  def find(x):
    while parent[x]!=x:
      parent[x]=parent[parent[x]]; x=parent[x]
    return x
  def union(a,b):
    x,y=find(a),find(b)
    if x!=y: parent[y]=x
  def id(r,c): return r*cols+c
  for r in range(rows):
    for c in range(cols):
      if board[r][c]!="O": continue
      if r==0 or c==0 or r==rows-1 or c==cols-1: union(id(r,c), DUMMY)
      if r+1<rows and board[r+1][c]=="O": union(id(r,c), id(r+1,c))
      if c+1<cols and board[r][c+1]=="O": union(id(r,c), id(r,c+1))
  dummyRoot=find(DUMMY)
  for r in range(rows):
    for c in range(cols):
      if board[r][c]=="O" and find(id(r,c))!=dummyRoot: board[r][c]="X"`,
            java: `class Solution {
  int[] parent;
  int find(int x) { while (parent[x]!=x) { parent[x]=parent[parent[x]]; x=parent[x]; } return x; }
  void union(int a, int b) { int x=find(a), y=find(b); if (x!=y) parent[y]=x; }
  public void solve(char[][] board) {
    int rows=board.length; if (rows==0) return; int cols=board[0].length;
    int DUMMY=rows*cols; parent=new int[DUMMY+1];
    for (int i=0;i<=DUMMY;i++) parent[i]=i;
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
      if (board[r][c]!='O') continue;
      if (r==0||c==0||r==rows-1||c==cols-1) union(r*cols+c, DUMMY);
      if (r+1<rows && board[r+1][c]=='O') union(r*cols+c, (r+1)*cols+c);
      if (c+1<cols && board[r][c+1]=='O') union(r*cols+c, r*cols+c+1);
    }
    int dummyRoot=find(DUMMY);
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++)
      if (board[r][c]=='O' && find(r*cols+c)!=dummyRoot) board[r][c]='X';
  }
}`,
            cpp: `class Solution {
  vector<int> parent;
  int find(int x) { while (parent[x]!=x) { parent[x]=parent[parent[x]]; x=parent[x]; } return x; }
  void unite(int a, int b) { int x=find(a), y=find(b); if (x!=y) parent[y]=x; }
public:
  void solve(vector<vector<char>>& board) {
    int rows=(int)board.size(); if (!rows) return; int cols=(int)board[0].size();
    int DUMMY=rows*cols; parent.resize(DUMMY+1);
    for (int i=0;i<=DUMMY;i++) parent[i]=i;
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
      if (board[r][c]!='O') continue;
      if (r==0||c==0||r==rows-1||c==cols-1) unite(r*cols+c, DUMMY);
      if (r+1<rows && board[r+1][c]=='O') unite(r*cols+c, (r+1)*cols+c);
      if (c+1<cols && board[r][c+1]=='O') unite(r*cols+c, r*cols+c+1);
    }
    int dummyRoot=find(DUMMY);
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++)
      if (board[r][c]=='O' && find(r*cols+c)!=dummyRoot) board[r][c]='X';
  }
};`,
            c: `#include <stdlib.h>
int find_sol(int* p, int x) { while (p[x]!=x) { p[x]=p[p[x]]; x=p[x]; } return x; }
void solve(char** board, int rows, int cols) {
  if (!rows) return;
  int DUMMY=rows*cols;
  int* parent=(int*)malloc(sizeof(int)*(DUMMY+1));
  for (int i=0;i<=DUMMY;i++) parent[i]=i;
  for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) {
    if (board[r][c]!='O') continue;
    if (r==0||c==0||r==rows-1||c==cols-1) {
      int x=find_sol(parent,r*cols+c), y=find_sol(parent,DUMMY); if (x!=y) parent[y]=x;
    }
    if (r+1<rows && board[r+1][c]=='O') {
      int x=find_sol(parent,r*cols+c), y=find_sol(parent,(r+1)*cols+c); if (x!=y) parent[y]=x;
    }
    if (c+1<cols && board[r][c+1]=='O') {
      int x=find_sol(parent,r*cols+c), y=find_sol(parent,r*cols+c+1); if (x!=y) parent[y]=x;
    }
  }
  int dummyRoot=find_sol(parent, DUMMY);
  for (int r=0;r<rows;r++) for (int c=0;c<cols;c++)
    if (board[r][c]=='O' && find_sol(parent, r*cols+c)!=dummyRoot) board[r][c]='X';
}`
          }
        }
      ]
    },
    {
      id: 16,
      level: "beginner",
      q: "Flood Fill",
      ask: "Amazon · Google · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/flood-fill/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/flood-fill-algorithm1856/1"}],
      a: "An image grid of color numbers, a start cell (sr, sc), and a new color. Recolor the start cell and every 4-direction neighbor that had the same old color. Return the image.\n\nExample: image [[1,1,1],[1,1,0],[1,0,1]], start (1,1), color 2 paints the connected 1s into 2s. The 1 at (2,2) stays 1 because it does not touch the blob through 4-direction edges.\n\nThis is islands on colors. If the start is already the new color, return as-is so you do not loop.",
      solutions: [
        {
          name: "Brute",
          time: "O(rc)",
          space: "O(rc)",
          why: "DFS with a brand-new visited matrix copy even though one matrix is enough. Extra memory, same walk. Shows the 'copy visited' habit you should drop.",
          code: `function floodFill(image, sr, sc, color) {
  const rows = image.length, cols = image[0].length;
  const old = image[sr][sc];
  if (old === color) return image;
  const seen = image.map(function (row) {
    return row.map(function () { return false; });
  });
  function dfs(r, c, vis) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (vis[r][c] || image[r][c] !== old) return;
    const copy = vis.map(function (row) { return row.slice(); });
    copy[r][c] = true;
    vis[r][c] = true;
    image[r][c] = color;
    dfs(r + 1, c, copy);
    dfs(r - 1, c, copy);
    dfs(r, c + 1, copy);
    dfs(r, c - 1, copy);
  }
  dfs(sr, sc, seen);
  return image;
}`,
          codes: {
            javascript: `function floodFill(image, sr, sc, color) {
  const rows = image.length, cols = image[0].length;
  const old = image[sr][sc];
  if (old === color) return image;
  const seen = image.map(function (row) {
    return row.map(function () { return false; });
  });
  function dfs(r, c, vis) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (vis[r][c] || image[r][c] !== old) return;
    const copy = vis.map(function (row) { return row.slice(); });
    copy[r][c] = true;
    vis[r][c] = true;
    image[r][c] = color;
    dfs(r + 1, c, copy);
    dfs(r - 1, c, copy);
    dfs(r, c + 1, copy);
    dfs(r, c - 1, copy);
  }
  dfs(sr, sc, seen);
  return image;
}`,
            python: `def floodFill(image, sr, sc, color):
  rows, cols = len(image), len(image[0])
  old = image[sr][sc]
  if old == color: return image
  seen = [[False]*cols for _ in range(rows)]
  def dfs(r, c, vis):
    if r<0 or c<0 or r>=rows or c>=cols: return
    if vis[r][c] or image[r][c]!=old: return
    copy = [row[:] for row in vis]
    copy[r][c]=True; vis[r][c]=True
    image[r][c]=color
    dfs(r+1,c,copy); dfs(r-1,c,copy); dfs(r,c+1,copy); dfs(r,c-1,copy)
  dfs(sr, sc, seen)
  return image`,
            java: `class Solution {
  int rows, cols, old, color;
  void dfs(int[][] image, int r, int c, boolean[][] vis) {
    if (r<0||c<0||r>=rows||c>=cols) return;
    if (vis[r][c] || image[r][c]!=old) return;
    boolean[][] copy=new boolean[rows][cols];
    for (int i=0;i<rows;i++) copy[i]=vis[i].clone();
    copy[r][c]=true; vis[r][c]=true; image[r][c]=color;
    dfs(image,r+1,c,copy); dfs(image,r-1,c,copy); dfs(image,r,c+1,copy); dfs(image,r,c-1,copy);
  }
  public int[][] floodFill(int[][] image, int sr, int sc, int color) {
    old=image[sr][sc]; if (old==color) return image;
    this.color=color; rows=image.length; cols=image[0].length;
    dfs(image, sr, sc, new boolean[rows][cols]);
    return image;
  }
}`,
            cpp: `class Solution {
  int rows, cols, old, color;
  void dfs(vector<vector<int>>& image, int r, int c, vector<vector<int>> vis) {
    if (r<0||c<0||r>=rows||c>=cols) return;
    if (vis[r][c] || image[r][c]!=old) return;
    auto copy=vis; copy[r][c]=1; vis[r][c]=1; image[r][c]=color;
    dfs(image,r+1,c,copy); dfs(image,r-1,c,copy); dfs(image,r,c+1,copy); dfs(image,r,c-1,copy);
  }
public:
  vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
    old=image[sr][sc]; if (old==color) return image;
    this->color=color; rows=(int)image.size(); cols=(int)image[0].size();
    dfs(image, sr, sc, vector<vector<int>>(rows, vector<int>(cols)));
    return image;
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
int rows_f, cols_f, old_f, color_f;
void dfs_ff(int** image, int r, int c, int* vis) {
  if (r<0||c<0||r>=rows_f||c>=cols_f) return;
  if (vis[r*cols_f+c] || image[r][c]!=old_f) return;
  int* copy=(int*)malloc(sizeof(int)*rows_f*cols_f);
  memcpy(copy, vis, sizeof(int)*rows_f*cols_f);
  copy[r*cols_f+c]=1; vis[r*cols_f+c]=1; image[r][c]=color_f;
  dfs_ff(image,r+1,c,copy); dfs_ff(image,r-1,c,copy); dfs_ff(image,r,c+1,copy); dfs_ff(image,r,c-1,copy);
  free(copy);
}
int** floodFill(int** image, int rows, int cols, int sr, int sc, int color) {
  old_f=image[sr][sc]; if (old_f==color) return image;
  color_f=color; rows_f=rows; cols_f=cols;
  int* vis=(int*)calloc(rows*cols,sizeof(int));
  dfs_ff(image, sr, sc, vis);
  return image;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "DFS from the start. Painting to the new color is the visited mark when old !== color. Each cell in the blob is painted once.",
          code: `function floodFill(image, sr, sc, color) {
  const old = image[sr][sc];
  if (old === color) return image;
  const rows = image.length, cols = image[0].length;
  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (image[r][c] !== old) return;
    image[r][c] = color;
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }
  dfs(sr, sc);
  return image;
}`,
          codes: {
            javascript: `function floodFill(image, sr, sc, color) {
  const old = image[sr][sc];
  if (old === color) return image;
  const rows = image.length, cols = image[0].length;
  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (image[r][c] !== old) return;
    image[r][c] = color;
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }
  dfs(sr, sc);
  return image;
}`,
            python: `def floodFill(image, sr, sc, color):
  old=image[sr][sc]
  if old==color: return image
  rows, cols=len(image), len(image[0])
  def dfs(r,c):
    if r<0 or c<0 or r>=rows or c>=cols: return
    if image[r][c]!=old: return
    image[r][c]=color
    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)
  dfs(sr,sc)
  return image`,
            java: `class Solution {
  int old, rows, cols, color;
  void dfs(int[][] image, int r, int c) {
    if (r<0||c<0||r>=rows||c>=cols) return;
    if (image[r][c]!=old) return;
    image[r][c]=color;
    dfs(image,r+1,c); dfs(image,r-1,c); dfs(image,r,c+1); dfs(image,r,c-1);
  }
  public int[][] floodFill(int[][] image, int sr, int sc, int color) {
    old=image[sr][sc]; if (old==color) return image;
    this.color=color; rows=image.length; cols=image[0].length;
    dfs(image, sr, sc);
    return image;
  }
}`,
            cpp: `class Solution {
  int old, rows, cols, color;
  void dfs(vector<vector<int>>& image, int r, int c) {
    if (r<0||c<0||r>=rows||c>=cols) return;
    if (image[r][c]!=old) return;
    image[r][c]=color;
    dfs(image,r+1,c); dfs(image,r-1,c); dfs(image,r,c+1); dfs(image,r,c-1);
  }
public:
  vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
    old=image[sr][sc]; if (old==color) return image;
    this->color=color; rows=(int)image.size(); cols=(int)image[0].size();
    dfs(image, sr, sc);
    return image;
  }
};`,
            c: `int old_f2, rows_f2, cols_f2, color_f2;
void dfs_ff2(int** image, int r, int c) {
  if (r<0||c<0||r>=rows_f2||c>=cols_f2) return;
  if (image[r][c]!=old_f2) return;
  image[r][c]=color_f2;
  dfs_ff2(image,r+1,c); dfs_ff2(image,r-1,c); dfs_ff2(image,r,c+1); dfs_ff2(image,r,c-1);
}
int** floodFill(int** image, int rows, int cols, int sr, int sc, int color) {
  old_f2=image[sr][sc]; if (old_f2==color) return image;
  color_f2=color; rows_f2=rows; cols_f2=cols;
  dfs_ff2(image, sr, sc);
  return image;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "BFS with a queue. Same linear bound, no recursive stack. Prefer this on a huge image so the call stack cannot overflow.",
          code: `function floodFill(image, sr, sc, color) {
  const old = image[sr][sc];
  if (old === color) return image;
  const rows = image.length, cols = image[0].length;
  const q = [[sr, sc]];
  image[sr][sc] = color;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.length) {
    const cur = q.shift();
    const r = cur[0], c = cur[1];
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (image[nr][nc] !== old) continue;
      image[nr][nc] = color;
      q.push([nr, nc]);
    }
  }
  return image;
}`,
          codes: {
            javascript: `function floodFill(image, sr, sc, color) {
  const old = image[sr][sc];
  if (old === color) return image;
  const rows = image.length, cols = image[0].length;
  const q = [[sr, sc]];
  image[sr][sc] = color;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.length) {
    const cur = q.shift();
    const r = cur[0], c = cur[1];
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (image[nr][nc] !== old) continue;
      image[nr][nc] = color;
      q.push([nr, nc]);
    }
  }
  return image;
}`,
            python: `from collections import deque
def floodFill(image, sr, sc, color):
  old=image[sr][sc]
  if old==color: return image
  rows, cols=len(image), len(image[0])
  q=deque([(sr,sc)])
  image[sr][sc]=color
  dirs=[[1,0],[-1,0],[0,1],[0,-1]]
  while q:
    r,c=q.popleft()
    for i in range(4):
      nr,nc=r+dirs[i][0], c+dirs[i][1]
      if nr<0 or nc<0 or nr>=rows or nc>=cols: continue
      if image[nr][nc]!=old: continue
      image[nr][nc]=color; q.append((nr,nc))
  return image`,
            java: `import java.util.*;
class Solution {
  public int[][] floodFill(int[][] image, int sr, int sc, int color) {
    int old=image[sr][sc]; if (old==color) return image;
    int rows=image.length, cols=image[0].length;
    ArrayDeque<int[]> q=new ArrayDeque<int[]>();
    q.addLast(new int[]{sr,sc}); image[sr][sc]=color;
    int[][] dirs={{1,0},{-1,0},{0,1},{0,-1}};
    while (!q.isEmpty()) {
      int[] cur=q.pollFirst(); int r=cur[0], c=cur[1];
      for (int i=0;i<4;i++) {
        int nr=r+dirs[i][0], nc=c+dirs[i][1];
        if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
        if (image[nr][nc]!=old) continue;
        image[nr][nc]=color; q.addLast(new int[]{nr,nc});
      }
    }
    return image;
  }
}`,
            cpp: `class Solution {
public:
  vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
    int old=image[sr][sc]; if (old==color) return image;
    int rows=(int)image.size(), cols=(int)image[0].size();
    queue<pair<int,int>> q; q.push({sr,sc}); image[sr][sc]=color;
    int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
    while (!q.empty()) {
      auto cur=q.front(); q.pop(); int r=cur.first, c=cur.second;
      for (int i=0;i<4;i++) {
        int nr=r+dirs[i][0], nc=c+dirs[i][1];
        if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
        if (image[nr][nc]!=old) continue;
        image[nr][nc]=color; q.push({nr,nc});
      }
    }
    return image;
  }
};`,
            c: `#include <stdlib.h>
int** floodFill(int** image, int rows, int cols, int sr, int sc, int color) {
  int old=image[sr][sc]; if (old==color) return image;
  int* qr=(int*)malloc(sizeof(int)*rows*cols);
  int* qc=(int*)malloc(sizeof(int)*rows*cols);
  int h=0,t=0; qr[t]=sr; qc[t]=sc; t++; image[sr][sc]=color;
  int dirs[4][2]={{1,0},{-1,0},{0,1},{0,-1}};
  while (h<t) {
    int r=qr[h], c=qc[h]; h++;
    for (int i=0;i<4;i++) {
      int nr=r+dirs[i][0], nc=c+dirs[i][1];
      if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
      if (image[nr][nc]!=old) continue;
      image[nr][nc]=color; qr[t]=nr; qc[t]=nc; t++;
    }
  }
  return image;
}`
          }
        }
      ]
    },
    {
      id: 17,
      level: "intermediate",
      q: "Shortest Path in Binary Matrix",
      ask: "Amazon · Google · Meta · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/shortest-path-in-binary-matrix/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/shortest-path-in-a-binary-maze/"}],
      a: "An n x n grid of 0 (open) and 1 (blocked). Walk 8 directions. Return the length of the shortest path from (0,0) to (n-1,n-1), counting cells on the path. Return -1 if you cannot reach the end. Start and end must be 0.\n\nExample: [[0,1],[1,0]] answers 2 (diagonal step).\n\nUnweighted shortest path: BFS. DFS-all-paths is the brute. Bidirectional BFS is the upgrade on large open grids.",
      solutions: [
        {
          name: "Brute",
          time: "O(8^{n²})",
          space: "O(n²)",
          why: "DFS every simple path with a copied visited matrix. Keep the shortest length. Correct on a 2x2, exponential on a 20x20.",
          code: `function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] || grid[n - 1][n - 1]) return -1;
  let best = Infinity;
  const dirs = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr || dc) dirs.push([dr, dc]);
    }
  }
  function dfs(r, c, dist, seen) {
    if (dist >= best) return;
    if (r === n - 1 && c === n - 1) { best = dist; return; }
    for (let i = 0; i < dirs.length; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
      if (grid[nr][nc] !== 0 || seen[nr][nc]) continue;
      const copy = seen.map(function (row) { return row.slice(); });
      copy[nr][nc] = true;
      dfs(nr, nc, dist + 1, copy);
    }
  }
  const seen = Array.from({ length: n }, function () { return Array(n).fill(false); });
  seen[0][0] = true;
  dfs(0, 0, 1, seen);
  return best === Infinity ? -1 : best;
}`,
          codes: {
            javascript: `function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] || grid[n - 1][n - 1]) return -1;
  let best = Infinity;
  const dirs = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr || dc) dirs.push([dr, dc]);
    }
  }
  function dfs(r, c, dist, seen) {
    if (dist >= best) return;
    if (r === n - 1 && c === n - 1) { best = dist; return; }
    for (let i = 0; i < dirs.length; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
      if (grid[nr][nc] !== 0 || seen[nr][nc]) continue;
      const copy = seen.map(function (row) { return row.slice(); });
      copy[nr][nc] = true;
      dfs(nr, nc, dist + 1, copy);
    }
  }
  const seen = Array.from({ length: n }, function () { return Array(n).fill(false); });
  seen[0][0] = true;
  dfs(0, 0, 1, seen);
  return best === Infinity ? -1 : best;
}`,
            python: `def shortestPathBinaryMatrix(grid):
  n=len(grid)
  if grid[0][0] or grid[n-1][n-1]: return -1
  best=float("inf")
  dirs=[]
  for dr in range(-1,2):
    for dc in range(-1,2):
      if dr or dc: dirs.append([dr,dc])
  def dfs(r,c,dist,seen):
    nonlocal best
    if dist>=best: return
    if r==n-1 and c==n-1: best=dist; return
    for i in range(len(dirs)):
      nr,nc=r+dirs[i][0], c+dirs[i][1]
      if nr<0 or nc<0 or nr>=n or nc>=n: continue
      if grid[nr][nc]!=0 or seen[nr][nc]: continue
      copy=[row[:] for row in seen]
      copy[nr][nc]=True
      dfs(nr,nc,dist+1,copy)
  seen=[[False]*n for _ in range(n)]; seen[0][0]=True
  dfs(0,0,1,seen)
  return -1 if best==float("inf") else best`,
            java: `class Solution {
  int n, best;
  int[][] dirs=new int[8][2];
  void dfs(int[][] grid, int r, int c, int dist, boolean[][] seen) {
    if (dist>=best) return;
    if (r==n-1 && c==n-1) { best=dist; return; }
    for (int i=0;i<8;i++) {
      int nr=r+dirs[i][0], nc=c+dirs[i][1];
      if (nr<0||nc<0||nr>=n||nc>=n) continue;
      if (grid[nr][nc]!=0 || seen[nr][nc]) continue;
      boolean[][] copy=new boolean[n][n];
      for (int k=0;k<n;k++) copy[k]=seen[k].clone();
      copy[nr][nc]=true;
      dfs(grid, nr, nc, dist+1, copy);
    }
  }
  public int shortestPathBinaryMatrix(int[][] grid) {
    n=grid.length; if (grid[0][0]!=0 || grid[n-1][n-1]!=0) return -1;
    int k=0; for (int dr=-1;dr<=1;dr++) for (int dc=-1;dc<=1;dc++) if (dr!=0||dc!=0) dirs[k++]=new int[]{dr,dc};
    best=Integer.MAX_VALUE/4;
    boolean[][] seen=new boolean[n][n]; seen[0][0]=true;
    dfs(grid, 0, 0, 1, seen);
    return best>=Integer.MAX_VALUE/4 ? -1 : best;
  }
}`,
            cpp: `class Solution {
  int n, best;
  vector<pair<int,int>> dirs;
  void dfs(vector<vector<int>>& grid, int r, int c, int dist, vector<vector<int>> seen) {
    if (dist>=best) return;
    if (r==n-1 && c==n-1) { best=dist; return; }
    for (auto d : dirs) {
      int nr=r+d.first, nc=c+d.second;
      if (nr<0||nc<0||nr>=n||nc>=n) continue;
      if (grid[nr][nc]!=0 || seen[nr][nc]) continue;
      auto copy=seen; copy[nr][nc]=1;
      dfs(grid, nr, nc, dist+1, copy);
    }
  }
public:
  int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
    n=(int)grid.size(); if (grid[0][0]||grid[n-1][n-1]) return -1;
    for (int dr=-1;dr<=1;dr++) for (int dc=-1;dc<=1;dc++) if (dr||dc) dirs.push_back({dr,dc});
    best=INT_MAX/4;
    vector<vector<int>> seen(n, vector<int>(n)); seen[0][0]=1;
    dfs(grid, 0, 0, 1, seen);
    return best>=INT_MAX/4 ? -1 : best;
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
#include <limits.h>
int n_sp, best_sp, dirs_sp[8][2];
void dfs_sp(int** grid, int r, int c, int dist, int* seen) {
  if (dist>=best_sp) return;
  if (r==n_sp-1 && c==n_sp-1) { best_sp=dist; return; }
  for (int i=0;i<8;i++) {
    int nr=r+dirs_sp[i][0], nc=c+dirs_sp[i][1];
    if (nr<0||nc<0||nr>=n_sp||nc>=n_sp) continue;
    if (grid[nr][nc]!=0 || seen[nr*n_sp+nc]) continue;
    int* copy=(int*)malloc(sizeof(int)*n_sp*n_sp);
    memcpy(copy, seen, sizeof(int)*n_sp*n_sp); copy[nr*n_sp+nc]=1;
    dfs_sp(grid, nr, nc, dist+1, copy);
    free(copy);
  }
}
int shortestPathBinaryMatrix(int** grid, int n) {
  n_sp=n; if (grid[0][0]||grid[n-1][n-1]) return -1;
  int k=0; for (int dr=-1;dr<=1;dr++) for (int dc=-1;dc<=1;dc++) if (dr||dc) { dirs_sp[k][0]=dr; dirs_sp[k][1]=dc; k++; }
  best_sp=INT_MAX/4;
  int* seen=(int*)calloc(n*n,sizeof(int)); seen[0]=1;
  dfs_sp(grid, 0, 0, 1, seen);
  return best_sp>=INT_MAX/4 ? -1 : best_sp;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n²)",
          space: "O(n²)",
          why: "BFS from (0,0). First time you pop the end cell is the shortest length. Mark cells when you push so the queue stays small. 8 neighbors.",
          code: `function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] || grid[n - 1][n - 1]) return -1;
  const q = [[0, 0, 1]];
  grid[0][0] = 1;
  const dirs = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr || dc) dirs.push([dr, dc]);
    }
  }
  while (q.length) {
    const cur = q.shift();
    const r = cur[0], c = cur[1], d = cur[2];
    if (r === n - 1 && c === n - 1) return d;
    for (let i = 0; i < dirs.length; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
      if (grid[nr][nc] !== 0) continue;
      grid[nr][nc] = 1;
      q.push([nr, nc, d + 1]);
    }
  }
  return -1;
}`,
          codes: {
            javascript: `function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] || grid[n - 1][n - 1]) return -1;
  const q = [[0, 0, 1]];
  grid[0][0] = 1;
  const dirs = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr || dc) dirs.push([dr, dc]);
    }
  }
  while (q.length) {
    const cur = q.shift();
    const r = cur[0], c = cur[1], d = cur[2];
    if (r === n - 1 && c === n - 1) return d;
    for (let i = 0; i < dirs.length; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
      if (grid[nr][nc] !== 0) continue;
      grid[nr][nc] = 1;
      q.push([nr, nc, d + 1]);
    }
  }
  return -1;
}`,
            python: `from collections import deque
def shortestPathBinaryMatrix(grid):
  n=len(grid)
  if grid[0][0] or grid[n-1][n-1]: return -1
  q=deque([(0,0,1)])
  grid[0][0]=1
  dirs=[]
  for dr in range(-1,2):
    for dc in range(-1,2):
      if dr or dc: dirs.append([dr,dc])
  while q:
    r,c,d=q.popleft()
    if r==n-1 and c==n-1: return d
    for i in range(len(dirs)):
      nr,nc=r+dirs[i][0], c+dirs[i][1]
      if nr<0 or nc<0 or nr>=n or nc>=n: continue
      if grid[nr][nc]!=0: continue
      grid[nr][nc]=1; q.append((nr,nc,d+1))
  return -1`,
            java: `import java.util.*;
class Solution {
  public int shortestPathBinaryMatrix(int[][] grid) {
    int n=grid.length; if (grid[0][0]!=0 || grid[n-1][n-1]!=0) return -1;
    ArrayDeque<int[]> q=new ArrayDeque<int[]>();
    q.addLast(new int[]{0,0,1}); grid[0][0]=1;
    int[][] dirs=new int[8][2]; int k=0;
    for (int dr=-1;dr<=1;dr++) for (int dc=-1;dc<=1;dc++) if (dr!=0||dc!=0) dirs[k++]=new int[]{dr,dc};
    while (!q.isEmpty()) {
      int[] cur=q.pollFirst(); int r=cur[0],c=cur[1],d=cur[2];
      if (r==n-1 && c==n-1) return d;
      for (int i=0;i<8;i++) {
        int nr=r+dirs[i][0], nc=c+dirs[i][1];
        if (nr<0||nc<0||nr>=n||nc>=n) continue;
        if (grid[nr][nc]!=0) continue;
        grid[nr][nc]=1; q.addLast(new int[]{nr,nc,d+1});
      }
    }
    return -1;
  }
}`,
            cpp: `class Solution {
public:
  int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
    int n=(int)grid.size(); if (grid[0][0]||grid[n-1][n-1]) return -1;
    queue<array<int,3>> q; q.push({0,0,1}); grid[0][0]=1;
    vector<pair<int,int>> dirs;
    for (int dr=-1;dr<=1;dr++) for (int dc=-1;dc<=1;dc++) if (dr||dc) dirs.push_back({dr,dc});
    while (!q.empty()) {
      auto cur=q.front(); q.pop(); int r=cur[0],c=cur[1],d=cur[2];
      if (r==n-1 && c==n-1) return d;
      for (auto dir : dirs) {
        int nr=r+dir.first, nc=c+dir.second;
        if (nr<0||nc<0||nr>=n||nc>=n) continue;
        if (grid[nr][nc]!=0) continue;
        grid[nr][nc]=1; q.push({nr,nc,d+1});
      }
    }
    return -1;
  }
};`,
            c: `#include <stdlib.h>
int shortestPathBinaryMatrix(int** grid, int n) {
  if (grid[0][0]||grid[n-1][n-1]) return -1;
  int dirs[8][2]; int k=0;
  for (int dr=-1;dr<=1;dr++) for (int dc=-1;dc<=1;dc++) if (dr||dc) { dirs[k][0]=dr; dirs[k][1]=dc; k++; }
  int* qr=(int*)malloc(sizeof(int)*n*n);
  int* qc=(int*)malloc(sizeof(int)*n*n);
  int* qd=(int*)malloc(sizeof(int)*n*n);
  int h=0,t=0; qr[t]=0; qc[t]=0; qd[t]=1; t++; grid[0][0]=1;
  while (h<t) {
    int r=qr[h], c=qc[h], d=qd[h]; h++;
    if (r==n-1 && c==n-1) return d;
    for (int i=0;i<8;i++) {
      int nr=r+dirs[i][0], nc=c+dirs[i][1];
      if (nr<0||nc<0||nr>=n||nc>=n) continue;
      if (grid[nr][nc]!=0) continue;
      grid[nr][nc]=1; qr[t]=nr; qc[t]=nc; qd[t]=d+1; t++;
    }
  }
  return -1;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n²)",
          space: "O(n²)",
          why: "Bidirectional BFS from start and end. When a neighbor sits in the other frontier, the two searches met. Fewer cells expanded on large open maps. Same worst-case O(n²).",
          code: `function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] || grid[n - 1][n - 1]) return -1;
  if (n === 1) return 1;
  const dirs = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr || dc) dirs.push([dr, dc]);
    }
  }
  function key(r, c) { return r * n + c; }
  let q1 = [[0, 0]];
  let q2 = [[n - 1, n - 1]];
  let d1 = {};
  let d2 = {};
  d1[key(0, 0)] = 1;
  d2[key(n - 1, n - 1)] = 1;

  while (q1.length && q2.length) {
    if (q1.length > q2.length) {
      const tq = q1; q1 = q2; q2 = tq;
      const td = d1; d1 = d2; d2 = td;
    }
    const next = [];
    for (let i = 0; i < q1.length; i++) {
      const r = q1[i][0], c = q1[i][1];
      const id = key(r, c);
      for (let k = 0; k < dirs.length; k++) {
        const nr = r + dirs[k][0], nc = c + dirs[k][1];
        if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
        if (grid[nr][nc] !== 0) continue;
        const nid = key(nr, nc);
        if (d1[nid] !== undefined) continue;
        if (d2[nid] !== undefined) return d1[id] + d2[nid];
        d1[nid] = d1[id] + 1;
        next.push([nr, nc]);
      }
    }
    q1 = next;
  }
  return -1;
}`,
          codes: {
            javascript: `function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] || grid[n - 1][n - 1]) return -1;
  if (n === 1) return 1;
  const dirs = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr || dc) dirs.push([dr, dc]);
    }
  }
  function key(r, c) { return r * n + c; }
  let q1 = [[0, 0]];
  let q2 = [[n - 1, n - 1]];
  let d1 = {};
  let d2 = {};
  d1[key(0, 0)] = 1;
  d2[key(n - 1, n - 1)] = 1;

  while (q1.length && q2.length) {
    if (q1.length > q2.length) {
      const tq = q1; q1 = q2; q2 = tq;
      const td = d1; d1 = d2; d2 = td;
    }
    const next = [];
    for (let i = 0; i < q1.length; i++) {
      const r = q1[i][0], c = q1[i][1];
      const id = key(r, c);
      for (let k = 0; k < dirs.length; k++) {
        const nr = r + dirs[k][0], nc = c + dirs[k][1];
        if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
        if (grid[nr][nc] !== 0) continue;
        const nid = key(nr, nc);
        if (d1[nid] !== undefined) continue;
        if (d2[nid] !== undefined) return d1[id] + d2[nid];
        d1[nid] = d1[id] + 1;
        next.push([nr, nc]);
      }
    }
    q1 = next;
  }
  return -1;
}`,
            python: `from collections import deque
def shortestPathBinaryMatrix(grid):
  n=len(grid)
  if grid[0][0] or grid[n-1][n-1]: return -1
  if n==1: return 1
  dirs=[]
  for dr in range(-1,2):
    for dc in range(-1,2):
      if dr or dc: dirs.append([dr,dc])
  def key(r,c): return r*n+c
  q1=[(0,0)]; q2=[(n-1,n-1)]
  d1={key(0,0):1}; d2={key(n-1,n-1):1}
  while q1 and q2:
    if len(q1)>len(q2): q1,q2=q2,q1; d1,d2=d2,d1
    nxt=[]
    for r,c in q1:
      id_=key(r,c)
      for dr,dc in dirs:
        nr,nc=r+dr,c+dc
        if nr<0 or nc<0 or nr>=n or nc>=n: continue
        if grid[nr][nc]!=0: continue
        nid=key(nr,nc)
        if nid in d1: continue
        if nid in d2: return d1[id_]+d2[nid]
        d1[nid]=d1[id_]+1; nxt.append((nr,nc))
    q1=nxt
  return -1`,
            java: `import java.util.*;
class Solution {
  public int shortestPathBinaryMatrix(int[][] grid) {
    int n=grid.length; if (grid[0][0]!=0 || grid[n-1][n-1]!=0) return -1;
    if (n==1) return 1;
    int[][] dirs=new int[8][2]; int k=0;
    for (int dr=-1;dr<=1;dr++) for (int dc=-1;dc<=1;dc++) if (dr!=0||dc!=0) dirs[k++]=new int[]{dr,dc};
    List<int[]> q1=new ArrayList<int[]>(), q2=new ArrayList<int[]>();
    q1.add(new int[]{0,0}); q2.add(new int[]{n-1,n-1});
    Map<Integer,Integer> d1=new HashMap<Integer,Integer>(), d2=new HashMap<Integer,Integer>();
    d1.put(0,1); d2.put((n-1)*n+(n-1),1);
    while (!q1.isEmpty() && !q2.isEmpty()) {
      if (q1.size()>q2.size()) { List<int[]> tq=q1; q1=q2; q2=tq; Map<Integer,Integer> td=d1; d1=d2; d2=td; }
      List<int[]> next=new ArrayList<int[]>();
      for (int[] cell : q1) {
        int r=cell[0], c=cell[1], id=r*n+c;
        for (int i=0;i<8;i++) {
          int nr=r+dirs[i][0], nc=c+dirs[i][1];
          if (nr<0||nc<0||nr>=n||nc>=n) continue;
          if (grid[nr][nc]!=0) continue;
          int nid=nr*n+nc;
          if (d1.containsKey(nid)) continue;
          if (d2.containsKey(nid)) return d1.get(id)+d2.get(nid);
          d1.put(nid, d1.get(id)+1); next.add(new int[]{nr,nc});
        }
      }
      q1=next;
    }
    return -1;
  }
}`,
            cpp: `class Solution {
public:
  int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
    int n=(int)grid.size(); if (grid[0][0]||grid[n-1][n-1]) return -1;
    if (n==1) return 1;
    vector<pair<int,int>> dirs;
    for (int dr=-1;dr<=1;dr++) for (int dc=-1;dc<=1;dc++) if (dr||dc) dirs.push_back({dr,dc});
    auto key=[&](int r,int c){ return r*n+c; };
    vector<pair<int,int>> q1={{0,0}}, q2={{n-1,n-1}};
    unordered_map<int,int> d1, d2; d1[key(0,0)]=1; d2[key(n-1,n-1)]=1;
    while (!q1.empty() && !q2.empty()) {
      if (q1.size()>q2.size()) { swap(q1,q2); swap(d1,d2); }
      vector<pair<int,int>> next;
      for (auto cell : q1) {
        int r=cell.first, c=cell.second, id=key(r,c);
        for (auto dir : dirs) {
          int nr=r+dir.first, nc=c+dir.second;
          if (nr<0||nc<0||nr>=n||nc>=n) continue;
          if (grid[nr][nc]!=0) continue;
          int nid=key(nr,nc);
          if (d1.count(nid)) continue;
          if (d2.count(nid)) return d1[id]+d2[nid];
          d1[nid]=d1[id]+1; next.push_back({nr,nc});
        }
      }
      q1.swap(next);
    }
    return -1;
  }
};`,
            c: `#include <stdlib.h>
int shortestPathBinaryMatrix(int** grid, int n) {
  if (grid[0][0]||grid[n-1][n-1]) return -1;
  if (n==1) return 1;
  int dirs[8][2], k=0;
  for (int dr=-1;dr<=1;dr++) for (int dc=-1;dc<=1;dc++) if (dr||dc) { dirs[k][0]=dr; dirs[k][1]=dc; k++; }
  int* d1=(int*)malloc(sizeof(int)*n*n); int* d2=(int*)malloc(sizeof(int)*n*n);
  for (int i=0;i<n*n;i++) { d1[i]=-1; d2[i]=-1; }
  int* q1r=(int*)malloc(sizeof(int)*n*n); int* q1c=(int*)malloc(sizeof(int)*n*n); int n1=1; q1r[0]=0; q1c[0]=0; d1[0]=1;
  int* q2r=(int*)malloc(sizeof(int)*n*n); int* q2c=(int*)malloc(sizeof(int)*n*n); int n2=1; q2r[0]=n-1; q2c[0]=n-1; d2[(n-1)*n+n-1]=1;
  while (n1 && n2) {
    if (n1>n2) { int* tr=q1r; q1r=q2r; q2r=tr; int* tc=q1c; q1c=q2c; q2c=tc; int tn=n1; n1=n2; n2=tn; int* td=d1; d1=d2; d2=td; }
    int* nr_=(int*)malloc(sizeof(int)*n*n); int* nc_=(int*)malloc(sizeof(int)*n*n); int nn=0;
    for (int i=0;i<n1;i++) {
      int r=q1r[i], c=q1c[i], id=r*n+c;
      for (int t=0;t<8;t++) {
        int nr=r+dirs[t][0], nc=c+dirs[t][1];
        if (nr<0||nc<0||nr>=n||nc>=n) continue;
        if (grid[nr][nc]!=0) continue;
        int nid=nr*n+nc;
        if (d1[nid]!=-1) continue;
        if (d2[nid]!=-1) return d1[id]+d2[nid];
        d1[nid]=d1[id]+1; nr_[nn]=nr; nc_[nn]=nc; nn++;
      }
    }
    free(q1r); free(q1c); q1r=nr_; q1c=nc_; n1=nn;
  }
  return -1;
}`
          }
        }
      ]
    },
    {
      id: 18,
      level: "intermediate",
      q: "Detect Cycle in a Directed Graph",
      ask: "Amazon · Google · Microsoft · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/course-schedule/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1"}],
      a: "A directed graph with n nodes and a list of edges [u, v] meaning u -> v. Return true if any cycle exists.\n\nExample: 3 nodes, edges [[0,1],[1,2],[2,0]] is a cycle. Drop [2,0] and it is a DAG, so false.\n\nBrute DFS from every node with a fresh on-path copy. Optimal 3-color DFS. More optimal Kahn: if you cannot peel all nodes, a cycle remains.",
      solutions: [
        {
          name: "Brute",
          time: "O(n·(n + e))",
          space: "O(n + e)",
          why: "From each start, DFS with a copied onPath array. You repeat walks that 3-color would cache as 'finished'. Extra copies are the brute cost.",
          code: `function hasCycle(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) g[edges[i][0]].push(edges[i][1]);

  function dfs(u, onPath) {
    if (onPath[u]) return true;
    const copy = onPath.slice();
    copy[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      if (dfs(g[u][i], copy)) return true;
    }
    return false;
  }

  for (let i = 0; i < n; i++) {
    if (dfs(i, Array(n).fill(false))) return true;
  }
  return false;
}`,
          codes: {
            javascript: `function hasCycle(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) g[edges[i][0]].push(edges[i][1]);

  function dfs(u, onPath) {
    if (onPath[u]) return true;
    const copy = onPath.slice();
    copy[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      if (dfs(g[u][i], copy)) return true;
    }
    return false;
  }

  for (let i = 0; i < n; i++) {
    if (dfs(i, Array(n).fill(false))) return true;
  }
  return false;
}`,
            python: `def hasCycle(n, edges):
  g = [[] for _ in range(n)]
  for u,v in edges:
    g[u].append(v)
  def dfs(u, onPath):
    if onPath[u]: return True
    copy = onPath[:]
    copy[u] = True
    for v in g[u]:
      if dfs(v, copy): return True
    return False
  for i in range(n):
    if dfs(i, [False]*n): return True
  return False`,
            java: `import java.util.*;
class Solution {
  boolean dfs(List<List<Integer>> g, int u, boolean[] onPath) {
    if (onPath[u]) return true;
    boolean[] copy=onPath.clone(); copy[u]=true;
    for (int v : g.get(u)) if (dfs(g, v, copy)) return true;
    return false;
  }
  public boolean hasCycle(int n, int[][] edges) {
    List<List<Integer>> g=new ArrayList<List<Integer>>();
    for (int i=0;i<n;i++) g.add(new ArrayList<Integer>());
    for (int[] e : edges) g.get(e[0]).add(e[1]);
    for (int i=0;i<n;i++) if (dfs(g, i, new boolean[n])) return true;
    return false;
  }
}`,
            cpp: `class Solution {
  bool dfs(vector<vector<int>>& g, int u, vector<int> onPath) {
    if (onPath[u]) return true;
    onPath[u]=1;
    for (int v : g[u]) if (dfs(g, v, onPath)) return true;
    return false;
  }
public:
  bool hasCycle(int n, vector<vector<int>>& edges) {
    vector<vector<int>> g(n);
    for (auto& e : edges) g[e[0]].push_back(e[1]);
    for (int i=0;i<n;i++) if (dfs(g, i, vector<int>(n))) return true;
    return false;
  }
};`,
            c: `#include <stdlib.h>
#include <string.h>
int dfs_hc(int** g, int* deg, int u, int* onPath, int n) {
  if (onPath[u]) return 1;
  int* copy=(int*)malloc(sizeof(int)*n); memcpy(copy,onPath,sizeof(int)*n); copy[u]=1;
  for (int i=0;i<deg[u];i++) if (dfs_hc(g,deg,g[u][i],copy,n)) { free(copy); return 1; }
  free(copy); return 0;
}
int hasCycle(int n, int** edges, int e) {
  int* deg=(int*)calloc(n,sizeof(int));
  for (int i=0;i<e;i++) deg[edges[i][0]]++;
  int** g=(int**)malloc(sizeof(int*)*n);
  for (int i=0;i<n;i++) { g[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); deg[i]=0; }
  for (int i=0;i<e;i++) g[edges[i][0]][deg[edges[i][0]]++]=edges[i][1];
  int* on=(int*)calloc(n,sizeof(int));
  for (int i=0;i<n;i++) { memset(on,0,sizeof(int)*n); if (dfs_hc(g,deg,i,on,n)) return 1; }
  return 0;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n + e)",
          space: "O(n + e)",
          why: "Colors 0/1/2. A neighbor that is still 1 is a back edge, so a cycle. Nodes marked 2 are skipped. Each edge once.",
          code: `function hasCycle(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) g[edges[i][0]].push(edges[i][1]);
  const state = Array(n).fill(0);
  function dfs(u) {
    if (state[u] === 1) return true;
    if (state[u] === 2) return false;
    state[u] = 1;
    for (let i = 0; i < g[u].length; i++) {
      if (dfs(g[u][i])) return true;
    }
    state[u] = 2;
    return false;
  }
  for (let i = 0; i < n; i++) {
    if (state[i] === 0 && dfs(i)) return true;
  }
  return false;
}`,
          codes: {
            javascript: `function hasCycle(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) g[edges[i][0]].push(edges[i][1]);
  const state = Array(n).fill(0);
  function dfs(u) {
    if (state[u] === 1) return true;
    if (state[u] === 2) return false;
    state[u] = 1;
    for (let i = 0; i < g[u].length; i++) {
      if (dfs(g[u][i])) return true;
    }
    state[u] = 2;
    return false;
  }
  for (let i = 0; i < n; i++) {
    if (state[i] === 0 && dfs(i)) return true;
  }
  return false;
}`,
            python: `def hasCycle(n, edges):
  g = [[] for _ in range(n)]
  for u,v in edges:
    g[u].append(v)
  state = [0]*n
  def dfs(u):
    if state[u]==1: return True
    if state[u]==2: return False
    state[u]=1
    for v in g[u]:
      if dfs(v): return True
    state[u]=2
    return False
  for i in range(n):
    if state[i]==0 and dfs(i): return True
  return False`,
            java: `import java.util.*;
class Solution {
  boolean dfs(List<List<Integer>> g, int u, int[] state) {
    if (state[u]==1) return true;
    if (state[u]==2) return false;
    state[u]=1;
    for (int v : g.get(u)) if (dfs(g, v, state)) return true;
    state[u]=2;
    return false;
  }
  public boolean hasCycle(int n, int[][] edges) {
    List<List<Integer>> g=new ArrayList<List<Integer>>();
    for (int i=0;i<n;i++) g.add(new ArrayList<Integer>());
    for (int[] e : edges) g.get(e[0]).add(e[1]);
    int[] state=new int[n];
    for (int i=0;i<n;i++) if (state[i]==0 && dfs(g, i, state)) return true;
    return false;
  }
}`,
            cpp: `class Solution {
  bool dfs(vector<vector<int>>& g, int u, vector<int>& state) {
    if (state[u]==1) return true;
    if (state[u]==2) return false;
    state[u]=1;
    for (int v : g[u]) if (dfs(g, v, state)) return true;
    state[u]=2;
    return false;
  }
public:
  bool hasCycle(int n, vector<vector<int>>& edges) {
    vector<vector<int>> g(n);
    for (auto& e : edges) g[e[0]].push_back(e[1]);
    vector<int> state(n);
    for (int i=0;i<n;i++) if (state[i]==0 && dfs(g, i, state)) return true;
    return false;
  }
};`,
            c: `#include <stdlib.h>
int dfs_hc2(int** g, int* deg, int u, int* state) {
  if (state[u]==1) return 1;
  if (state[u]==2) return 0;
  state[u]=1;
  for (int i=0;i<deg[u];i++) if (dfs_hc2(g,deg,g[u][i],state)) return 1;
  state[u]=2;
  return 0;
}
int hasCycle(int n, int** edges, int e) {
  int* deg=(int*)calloc(n,sizeof(int));
  for (int i=0;i<e;i++) deg[edges[i][0]]++;
  int** g=(int**)malloc(sizeof(int*)*n);
  for (int i=0;i<n;i++) { g[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); deg[i]=0; }
  for (int i=0;i<e;i++) g[edges[i][0]][deg[edges[i][0]]++]=edges[i][1];
  int* state=(int*)calloc(n,sizeof(int));
  for (int i=0;i<n;i++) if (state[i]==0 && dfs_hc2(g,deg,i,state)) return 1;
  return 0;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n + e)",
          space: "O(n + e)",
          why: "Kahn's algorithm. Peel indegree 0. If the number of peeled nodes is less than n, leftover nodes sit in a cycle. Iterative, same linear time.",
          code: `function hasCycle(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  const indeg = Array(n).fill(0);
  for (let i = 0; i < edges.length; i++) {
    g[edges[i][0]].push(edges[i][1]);
    indeg[edges[i][1]]++;
  }
  const q = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  let peeled = 0;
  while (q.length) {
    const u = q.shift();
    peeled++;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      indeg[v]--;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return peeled !== n;
}`,
          codes: {
            javascript: `function hasCycle(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  const indeg = Array(n).fill(0);
  for (let i = 0; i < edges.length; i++) {
    g[edges[i][0]].push(edges[i][1]);
    indeg[edges[i][1]]++;
  }
  const q = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  let peeled = 0;
  while (q.length) {
    const u = q.shift();
    peeled++;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      indeg[v]--;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return peeled !== n;
}`,
            python: `from collections import deque
def hasCycle(n, edges):
  g = [[] for _ in range(n)]
  indeg = [0]*n
  for u,v in edges:
    g[u].append(v); indeg[v]+=1
  q = deque([i for i in range(n) if indeg[i]==0])
  peeled=0
  while q:
    u=q.popleft(); peeled+=1
    for v in g[u]:
      indeg[v]-=1
      if indeg[v]==0: q.append(v)
  return peeled != n`,
            java: `import java.util.*;
class Solution {
  public boolean hasCycle(int n, int[][] edges) {
    List<List<Integer>> g=new ArrayList<List<Integer>>();
    int[] indeg=new int[n];
    for (int i=0;i<n;i++) g.add(new ArrayList<Integer>());
    for (int[] e : edges) { g.get(e[0]).add(e[1]); indeg[e[1]]++; }
    ArrayDeque<Integer> q=new ArrayDeque<Integer>();
    for (int i=0;i<n;i++) if (indeg[i]==0) q.addLast(i);
    int peeled=0;
    while (!q.isEmpty()) {
      int u=q.pollFirst(); peeled++;
      for (int v : g.get(u)) { indeg[v]--; if (indeg[v]==0) q.addLast(v); }
    }
    return peeled != n;
  }
}`,
            cpp: `class Solution {
public:
  bool hasCycle(int n, vector<vector<int>>& edges) {
    vector<vector<int>> g(n);
    vector<int> indeg(n);
    for (auto& e : edges) { g[e[0]].push_back(e[1]); indeg[e[1]]++; }
    queue<int> q;
    for (int i=0;i<n;i++) if (indeg[i]==0) q.push(i);
    int peeled=0;
    while (!q.empty()) {
      int u=q.front(); q.pop(); peeled++;
      for (int v : g[u]) { indeg[v]--; if (indeg[v]==0) q.push(v); }
    }
    return peeled != n;
  }
};`,
            c: `#include <stdlib.h>
int hasCycle(int n, int** edges, int e) {
  int* deg=(int*)calloc(n,sizeof(int));
  int* indeg=(int*)calloc(n,sizeof(int));
  for (int i=0;i<e;i++) deg[edges[i][0]]++;
  int** g=(int**)malloc(sizeof(int*)*n);
  for (int i=0;i<n;i++) { g[i]=(int*)malloc(sizeof(int)*(deg[i]?deg[i]:1)); deg[i]=0; }
  for (int i=0;i<e;i++) { g[edges[i][0]][deg[edges[i][0]]++]=edges[i][1]; indeg[edges[i][1]]++; }
  int* q=(int*)malloc(sizeof(int)*n); int h=0,t=0;
  for (int i=0;i<n;i++) if (!indeg[i]) q[t++]=i;
  int peeled=0;
  while (h<t) {
    int u=q[h++]; peeled++;
    for (int i=0;i<deg[u];i++) { int v=g[u][i]; indeg[v]--; if (!indeg[v]) q[t++]=v; }
  }
  return peeled != n;
}`
          }
        }
      ]
    }
  ]
};
