module.exports = [
  {
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
  },
  {
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
  },
  {
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
];
