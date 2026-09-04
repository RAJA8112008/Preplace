module.exports = [
  {
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
  },
  {
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
  },
  {
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
];
