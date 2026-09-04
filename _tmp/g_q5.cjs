module.exports = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
];
