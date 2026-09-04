module.exports = [
  {
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
  },
  {
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
  },
  {
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
];
