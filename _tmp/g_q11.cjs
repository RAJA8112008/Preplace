module.exports = [
  {
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
  },
  {
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
  },
  {
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
];
