module.exports = [
  // 13 clone dfs
  {
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
  },
  // 14 clone bfs
  {
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
  },
  // 15 course brute
  {
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
  },
  // 16 course 3-color
  {
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
  },
  // 17 course kahn
  {
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
];
