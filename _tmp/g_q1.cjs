module.exports = [
  // 9 islands brute
  {
    python: `def numIslands(grid):
  rows = len(grid)
  if not rows: return 0
  cols = len(grid[0])
  globalv = [[False] * cols for _ in range(rows)]
  count = 0
  dirs = [[1,0],[-1,0],[0,1],[0,-1]]
  for r in range(rows):
    for c in range(cols):
      if grid[r][c] != "1" or globalv[r][c]: continue
      count += 1
      seen = [row[:] for row in globalv]
      stack = [[r, c]]
      seen[r][c] = True
      while stack:
        x, y = stack.pop()
        globalv[x][y] = True
        for i in range(4):
          nx, ny = x + dirs[i][0], y + dirs[i][1]
          if nx < 0 or ny < 0 or nx >= rows or ny >= cols: continue
          if grid[nx][ny] != "1" or seen[nx][ny]: continue
          seen[nx][ny] = True
          stack.append([nx, ny])
  return count`,
    java: `import java.util.*;
class Solution {
  public int numIslands(char[][] grid) {
    int rows = grid.length;
    if (rows == 0) return 0;
    int cols = grid[0].length;
    boolean[][] global = new boolean[rows][cols];
    int count = 0;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int r = 0; r < rows; r++) {
      for (int c = 0; c < cols; c++) {
        if (grid[r][c] != '1' || global[r][c]) continue;
        count++;
        boolean[][] seen = new boolean[rows][cols];
        for (int i = 0; i < rows; i++) seen[i] = global[i].clone();
        ArrayDeque<int[]> stack = new ArrayDeque<int[]>();
        stack.push(new int[]{r, c}); seen[r][c] = true;
        while (!stack.isEmpty()) {
          int[] cell = stack.pop();
          int x = cell[0], y = cell[1];
          global[x][y] = true;
          for (int i = 0; i < 4; i++) {
            int nx = x + dirs[i][0], ny = y + dirs[i][1];
            if (nx < 0 || ny < 0 || nx >= rows || ny >= cols) continue;
            if (grid[nx][ny] != '1' || seen[nx][ny]) continue;
            seen[nx][ny] = true; stack.push(new int[]{nx, ny});
          }
        }
      }
    }
    return count;
  }
}`,
    cpp: `class Solution {
public:
  int numIslands(vector<vector<char>>& grid) {
    int rows = (int)grid.size(); if (!rows) return 0;
    int cols = (int)grid[0].size();
    vector<vector<int>> global(rows, vector<int>(cols, 0));
    int count = 0;
    int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
      if (grid[r][c] != '1' || global[r][c]) continue;
      count++;
      auto seen = global;
      vector<pair<int,int>> stack; stack.push_back({r, c}); seen[r][c] = 1;
      while (!stack.empty()) {
        auto cell = stack.back(); stack.pop_back();
        int x = cell.first, y = cell.second; global[x][y] = 1;
        for (int i = 0; i < 4; i++) {
          int nx = x + dirs[i][0], ny = y + dirs[i][1];
          if (nx < 0 || ny < 0 || nx >= rows || ny >= cols) continue;
          if (grid[nx][ny] != '1' || seen[nx][ny]) continue;
          seen[nx][ny] = 1; stack.push_back({nx, ny});
        }
      }
    }
    return count;
  }
};`,
    c: `#include <stdlib.h>
#include <string.h>
int numIslands(char** grid, int rows, int cols) {
  if (!rows) return 0;
  int* global = (int*)calloc(rows * cols, sizeof(int));
  int count = 0;
  int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
  int* seen = (int*)malloc(sizeof(int)*rows*cols);
  int* stx = (int*)malloc(sizeof(int)*rows*cols);
  int* sty = (int*)malloc(sizeof(int)*rows*cols);
  for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
    if (grid[r][c] != '1' || global[r*cols+c]) continue;
    count++;
    memcpy(seen, global, sizeof(int)*rows*cols);
    int sn = 0; stx[sn]=r; sty[sn]=c; sn++; seen[r*cols+c]=1;
    while (sn) {
      int x = stx[--sn], y = sty[sn];
      global[x*cols+y] = 1;
      for (int i = 0; i < 4; i++) {
        int nx = x + dirs[i][0], ny = y + dirs[i][1];
        if (nx < 0 || ny < 0 || nx >= rows || ny >= cols) continue;
        if (grid[nx][ny] != '1' || seen[nx*cols+ny]) continue;
        seen[nx*cols+ny]=1; stx[sn]=nx; sty[sn]=ny; sn++;
      }
    }
  }
  free(global); free(seen); free(stx); free(sty);
  return count;
}`
  },
  // 10 islands dfs in-place
  {
    python: `def numIslands(grid):
  rows = len(grid)
  if not rows: return 0
  cols = len(grid[0])
  count = 0
  def dfs(r, c):
    if r < 0 or c < 0 or r >= rows or c >= cols: return
    if grid[r][c] != "1": return
    grid[r][c] = "0"
    dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)
  for r in range(rows):
    for c in range(cols):
      if grid[r][c] == "1":
        count += 1
        dfs(r, c)
  return count`,
    java: `class Solution {
  int rows, cols;
  void dfs(char[][] grid, int r, int c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (grid[r][c] != '1') return;
    grid[r][c] = '0';
    dfs(grid, r+1, c); dfs(grid, r-1, c); dfs(grid, r, c+1); dfs(grid, r, c-1);
  }
  public int numIslands(char[][] grid) {
    rows = grid.length; if (rows == 0) return 0;
    cols = grid[0].length;
    int count = 0;
    for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
      if (grid[r][c] == '1') { count++; dfs(grid, r, c); }
    }
    return count;
  }
}`,
    cpp: `class Solution {
  int rows, cols;
  void dfs(vector<vector<char>>& grid, int r, int c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (grid[r][c] != '1') return;
    grid[r][c] = '0';
    dfs(grid, r+1, c); dfs(grid, r-1, c); dfs(grid, r, c+1); dfs(grid, r, c-1);
  }
public:
  int numIslands(vector<vector<char>>& grid) {
    rows = (int)grid.size(); if (!rows) return 0;
    cols = (int)grid[0].size();
    int count = 0;
    for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++)
      if (grid[r][c] == '1') { count++; dfs(grid, r, c); }
    return count;
  }
};`,
    c: `int rows_g, cols_g;
void dfs_island(char** grid, int r, int c) {
  if (r < 0 || c < 0 || r >= rows_g || c >= cols_g) return;
  if (grid[r][c] != '1') return;
  grid[r][c] = '0';
  dfs_island(grid, r+1, c); dfs_island(grid, r-1, c);
  dfs_island(grid, r, c+1); dfs_island(grid, r, c-1);
}
int numIslands(char** grid, int rows, int cols) {
  if (!rows) return 0;
  rows_g = rows; cols_g = cols;
  int count = 0;
  for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++)
    if (grid[r][c] == '1') { count++; dfs_island(grid, r, c); }
  return count;
}`
  },
  // 11 islands union-find
  {
    python: `def numIslands(grid):
  rows = len(grid)
  if not rows: return 0
  cols = len(grid[0])
  n = rows * cols
  parent = list(range(n))
  rank = [0] * n
  islands = 0
  def id(r, c): return r * cols + c
  def find(x):
    while parent[x] != x:
      parent[x] = parent[parent[x]]
      x = parent[x]
    return x
  def union(a, b):
    nonlocal islands
    x, y = find(a), find(b)
    if x == y: return
    if rank[x] < rank[y]: x, y = y, x
    parent[y] = x
    if rank[x] == rank[y]: rank[x] += 1
    islands -= 1
  for r in range(rows):
    for c in range(cols):
      if grid[r][c] != "1": continue
      islands += 1
      if c + 1 < cols and grid[r][c+1] == "1": union(id(r,c), id(r,c+1))
      if r + 1 < rows and grid[r+1][c] == "1": union(id(r,c), id(r+1,c))
  return islands`,
    java: `class Solution {
  int[] parent, rank; int islands;
  int find(int x) {
    while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
  }
  void union(int a, int b) {
    int x = find(a), y = find(b);
    if (x == y) return;
    if (rank[x] < rank[y]) { int t=x; x=y; y=t; }
    parent[y] = x;
    if (rank[x] == rank[y]) rank[x]++;
    islands--;
  }
  public int numIslands(char[][] grid) {
    int rows = grid.length; if (rows == 0) return 0;
    int cols = grid[0].length;
    int n = rows * cols;
    parent = new int[n]; rank = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    islands = 0;
    for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
      if (grid[r][c] != '1') continue;
      islands++;
      if (c + 1 < cols && grid[r][c+1] == '1') union(r*cols+c, r*cols+c+1);
      if (r + 1 < rows && grid[r+1][c] == '1') union(r*cols+c, (r+1)*cols+c);
    }
    return islands;
  }
}`,
    cpp: `class Solution {
  vector<int> parent, rank; int islands;
  int find(int x) {
    while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
  }
  void unite(int a, int b) {
    int x = find(a), y = find(b);
    if (x == y) return;
    if (rank[x] < rank[y]) swap(x, y);
    parent[y] = x;
    if (rank[x] == rank[y]) rank[x]++;
    islands--;
  }
public:
  int numIslands(vector<vector<char>>& grid) {
    int rows = (int)grid.size(); if (!rows) return 0;
    int cols = (int)grid[0].size();
    int n = rows * cols;
    parent.resize(n); rank.assign(n, 0);
    for (int i = 0; i < n; i++) parent[i] = i;
    islands = 0;
    for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
      if (grid[r][c] != '1') continue;
      islands++;
      if (c + 1 < cols && grid[r][c+1] == '1') unite(r*cols+c, r*cols+c+1);
      if (r + 1 < rows && grid[r+1][c] == '1') unite(r*cols+c, (r+1)*cols+c);
    }
    return islands;
  }
};`,
    c: `#include <stdlib.h>
int findp(int* parent, int x) {
  while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
  return x;
}
int numIslands(char** grid, int rows, int cols) {
  if (!rows) return 0;
  int n = rows * cols;
  int* parent = (int*)malloc(sizeof(int)*n);
  int* rank = (int*)calloc(n, sizeof(int));
  for (int i = 0; i < n; i++) parent[i] = i;
  int islands = 0;
  for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
    if (grid[r][c] != '1') continue;
    islands++;
    if (c + 1 < cols && grid[r][c+1] == '1') {
      int x = findp(parent, r*cols+c), y = findp(parent, r*cols+c+1);
      if (x != y) { if (rank[x] < rank[y]) { int t=x; x=y; y=t; } parent[y]=x; if (rank[x]==rank[y]) rank[x]++; islands--; }
    }
    if (r + 1 < rows && grid[r+1][c] == '1') {
      int x = findp(parent, r*cols+c), y = findp(parent, (r+1)*cols+c);
      if (x != y) { if (rank[x] < rank[y]) { int t=x; x=y; y=t; } parent[y]=x; if (rank[x]==rank[y]) rank[x]++; islands--; }
    }
  }
  free(parent); free(rank);
  return islands;
}`
  },
  // 12 clone graph brute
  {
    python: `class Node:
  def __init__(self, val=0, neighbors=None):
    self.val = val
    self.neighbors = neighbors if neighbors is not None else []
def cloneGraph(node):
  if not node: return None
  mp = {}
  def dfs(cur, seen_copy):
    if cur in mp: return mp[cur]
    copy = Node(cur.val, [])
    mp[cur] = copy
    next_seen = set(seen_copy)
    next_seen.add(cur)
    for nei in cur.neighbors:
      copy.neighbors.append(dfs(nei, next_seen))
    return copy
  return dfs(node, set())`,
    java: `import java.util.*;
class Node {
  public int val;
  public List<Node> neighbors;
  public Node(int _val) { val = _val; neighbors = new ArrayList<Node>(); }
}
class Solution {
  Map<Node, Node> map = new HashMap<Node, Node>();
  Node dfs(Node cur, Set<Node> seenCopy) {
    if (map.containsKey(cur)) return map.get(cur);
    Node copy = new Node(cur.val);
    map.put(cur, copy);
    Set<Node> nextSeen = new HashSet<Node>(seenCopy);
    nextSeen.add(cur);
    for (Node nei : cur.neighbors) copy.neighbors.add(dfs(nei, nextSeen));
    return copy;
  }
  public Node cloneGraph(Node node) {
    if (node == null) return null;
    return dfs(node, new HashSet<Node>());
  }
}`,
    cpp: `class Node {
public:
  int val;
  vector<Node*> neighbors;
  Node(int _val) { val = _val; }
};
class Solution {
  unordered_map<Node*, Node*> mp;
  Node* dfs(Node* cur, unordered_set<Node*> seenCopy) {
    if (mp.count(cur)) return mp[cur];
    Node* copy = new Node(cur->val);
    mp[cur] = copy;
    seenCopy.insert(cur);
    for (Node* nei : cur->neighbors) copy->neighbors.push_back(dfs(nei, seenCopy));
    return copy;
  }
public:
  Node* cloneGraph(Node* node) {
    if (!node) return NULL;
    return dfs(node, {});
  }
};`,
    c: `#include <stdlib.h>
struct Node { int val; int numNeighbors; struct Node** neighbors; };
struct Pair { struct Node* old; struct Node* neu; };
struct Node* cloneGraph(struct Node* node) {
  if (!node) return NULL;
  struct Pair map[128]; int mn = 0;
  struct Node* stack[128]; int sn = 0;
  /* DFS with extra seen copies: we still share one map so each node clones once */
  struct Node* seenbuf[64][128]; int seenlen[64]; int depth = 0;
  struct Node* dfs(struct Node* cur, struct Node** seenCopy, int slen) {
    for (int i = 0; i < mn; i++) if (map[i].old == cur) return map[i].neu;
    struct Node* copy = (struct Node*)malloc(sizeof(struct Node));
    copy->val = cur->val; copy->numNeighbors = 0;
    copy->neighbors = (struct Node**)malloc(sizeof(struct Node*)*(cur->numNeighbors?cur->numNeighbors:1));
    map[mn].old = cur; map[mn].neu = copy; mn++;
    struct Node* nextSeen[128];
    for (int i = 0; i < slen; i++) nextSeen[i] = seenCopy[i];
    nextSeen[slen] = cur; slen++;
    for (int i = 0; i < cur->numNeighbors; i++)
      copy->neighbors[copy->numNeighbors++] = dfs(cur->neighbors[i], nextSeen, slen);
    return copy;
  }
  struct Node* emptyS[1];
  return dfs(node, emptyS, 0);
}`
  }
];
