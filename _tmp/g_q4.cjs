module.exports = [
  {
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
  },
  {
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
  },
  {
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
];
