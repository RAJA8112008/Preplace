module.exports = [
  {
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
  },
  {
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
  },
  {
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
];
