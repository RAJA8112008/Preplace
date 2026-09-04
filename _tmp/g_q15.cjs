module.exports = [
  {
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
  },
  {
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
  },
  {
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
];
