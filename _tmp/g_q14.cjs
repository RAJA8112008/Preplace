module.exports = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
];
