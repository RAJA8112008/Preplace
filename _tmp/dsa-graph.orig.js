window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["dsa-graph"] = {
  kind: "dsa",
  notes: [
    { title: "What a graph is", body: "A graph is a set of nodes (vertices) plus links (edges) between them. A city map, a course list with prereqs, and a grid of land cells are all graphs. You rarely store a drawing. You store neighbors: for each node, the list of nodes you can walk to in one step." },
    { title: "Adjacency list vs matrix", body: "An adjacency list is an array of arrays (or a Map). Index i holds the neighbors of node i. An adjacency matrix is an n by n grid of 0/1. Lists win when the graph is sparse, which is most interview graphs. A matrix is fine when n is tiny or you need O(1) 'is there an edge?' checks." },
    { title: "DFS", body: "Depth-first search walks one path as far as it can, then backtracks. Recursion or an explicit stack both count as DFS. Use it to flood a region, build a clone, or find a cycle with a 'visiting' color. Watch the call stack on a huge grid; an iterative stack is safer there." },
    { title: "BFS", body: "Breadth-first search walks layer by layer with a queue. The first time you reach a node is the fewest edges from the start. That is why BFS is the default for unweighted shortest path, rotting oranges, and word ladder. Multi-source BFS means you put every start cell in the queue on minute 0." },
    { title: "Visited", body: "A visited set (or a mark on the grid) stops you from walking the same node forever. In an undirected graph you mark when you first see a node. In a directed graph you often need three colors: unseen, on the current path, and finished. Copying a whole visited matrix on every call is the slow brute pattern." },
    { title: "Directed vs undirected", body: "Undirected edges go both ways: if A links to B, B links to A. Directed edges go one way: course B must finish before course A. Trees are undirected connected graphs with n-1 edges and no cycle. A cycle in a directed graph is a path that can return to a node while that node is still on the recursion stack." },
    { title: "Union-Find", body: "Union-Find (Disjoint Set) tracks groups. find(x) names the leader of x's group. union(a, b) merges two groups. Path compression and union by rank make it nearly O(1) per op. It shines on 'are these in the same component?' problems: valid tree, connected components, accounts merge, islands." },
    { title: "Topological sort", body: "A topo order is a line-up of nodes so every directed edge goes left to right. It exists only if the directed graph has no cycle. Kahn's algorithm peels nodes with indegree 0 using a queue. DFS can also emit a reverse postorder. Course schedule and alien dictionary are topo problems." },
    { title: "Shortest path", body: "Unweighted: BFS. Weighted and non-negative: Dijkstra with a min-heap. At most K edges: Bellman-Ford or a BFS that tracks stops. Bidirectional BFS searches from both ends and meets in the middle; that cuts the branching on word ladder and grid shortest path." },
    { title: "Grid as a graph", body: "A cell is a node. Up, down, left, right (and sometimes diagonals) are edges. Islands, flood fill, rotting oranges, 01 matrix, and surrounded regions are grid graphs. Bound-check every neighbor. Mutating the cell (1 to 0, O to #) can replace a separate visited matrix." }
  ],
  examples: [
    {
      lang: "js",
      title: "1. Adjacency list from edges",
      desc: "What this is\nAn adjacency list is the usual way to store a graph in JavaScript.\nEach index holds the nodes you can reach in one step.\n\nWhat the code is doing\nn is 4, so we make 4 empty neighbor lists.\nEach undirected edge [u, v] is stored twice: u to v and v to u.\nThe log shows node 0 points at 1 and 2.\n\nWatch out\nFor a directed edge, push only one way.\nNodes are 0-based here. Some problems use 1-based ids.",
      code: `function adjList(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) {
    const u = edges[i][0];
    const v = edges[i][1];
    g[u].push(v);
    g[v].push(u); // undirected
  }
  return g;
}

const g = adjList(4, [[0, 1], [0, 2], [1, 3]]);
console.log(g[0]); // [1, 2]`
    },
    {
      lang: "js",
      title: "2. DFS walk",
      desc: "What this is\nDFS walks deep on one path, then backtracks.\nA visited array stops loops.\n\nWhat the code is doing\ndfs starts at 0 and marks it seen.\nIt then visits each unseen neighbor.\nOrder is 0, then 1, then 3, then 2 for this list.\n\nWatch out\nOn a directed graph you still mark visited, or a cycle loops forever.\nRecursion depth equals the longest path.",
      code: `function dfsWalk(g, start) {
  const seen = Array(g.length).fill(false);
  const order = [];
  function dfs(u) {
    seen[u] = true;
    order.push(u);
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      if (!seen[v]) dfs(v);
    }
  }
  dfs(start);
  return order;
}`
    },
    {
      lang: "js",
      title: "3. BFS walk",
      desc: "What this is\nBFS uses a queue and visits nodes by distance from the start.\nThe first time you pop a node is the fewest edges to it.\n\nWhat the code is doing\nstart goes in the queue and is marked seen.\nEach round takes the front node and pushes unseen neighbors.\norder is a level-order list of nodes.\n\nWatch out\nMark seen when you push, not when you pop, or the queue fills with duplicates.\nshift() is O(n) on a JS array; for interviews it is still the usual queue.",
      code: `function bfsWalk(g, start) {
  const seen = Array(g.length).fill(false);
  const q = [start];
  seen[start] = true;
  const order = [];
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      if (seen[v]) continue;
      seen[v] = true;
      q.push(v);
    }
  }
  return order;
}`
    },
    {
      lang: "js",
      title: "4. Grid neighbors",
      desc: "What this is\nA grid is a graph. Each cell has up to four neighbors.\nYou must stay inside the rectangle.\n\nWhat the code is doing\ndirs lists the four steps.\nFor each step we make nr, nc and skip if out of bounds.\nout collects the in-bound neighbor cells.\n\nWatch out\n8-direction problems add the four diagonals.\nDo not use dirs.length as the grid size.",
      code: `function neighbors(r, c, rows, cols) {
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const out = [];
  for (let i = 0; i < dirs.length; i++) {
    const nr = r + dirs[i][0];
    const nc = c + dirs[i][1];
    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
    out.push([nr, nc]);
  }
  return out;
}`
    },
    {
      lang: "js",
      title: "5. Union-Find",
      desc: "What this is\nUnion-Find names a leader for each group of nodes.\nunion merges two groups. find walks to the leader.\n\nWhat the code is doing\nparent starts as each node pointing at itself.\nfind compresses the path so the next find is shorter.\nunion links the smaller rank tree under the larger one and returns false if they were already together.\n\nWatch out\nAlways union(find(a), find(b)), not the raw ids, unless find is used inside union.\nThis helper is the upgrade on island and component problems.",
      code: `function makeUF(n) {
  const parent = Array.from({ length: n }, function (_, i) { return i; });
  const rank = Array(n).fill(0);
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a, b) {
    let x = find(a);
    let y = find(b);
    if (x === y) return false;
    if (rank[x] < rank[y]) {
      const t = x; x = y; y = t;
    }
    parent[y] = x;
    if (rank[x] === rank[y]) rank[x]++;
    return true;
  }
  return { find: find, union: union, parent: parent };
}`
    },
    {
      lang: "js",
      title: "6. Kahn topological sort",
      desc: "What this is\nKahn's algorithm peels nodes with no incoming edges.\nIf you cannot peel every node, the directed graph has a cycle.\n\nWhat the code is doing\nindegree counts incoming edges.\nAll indegree-0 nodes start in the queue.\nWhen you pop u, you lower each neighbor's indegree and enqueue if it hits 0.\n\nWatch out\norder.length < n means a cycle, not a missing edge.\nThis is Course Schedule II and Alien Dictionary.",
      code: `function topo(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  const indeg = Array(n).fill(0);
  for (let i = 0; i < edges.length; i++) {
    const u = edges[i][0];
    const v = edges[i][1];
    g[u].push(v);
    indeg[v]++;
  }
  const q = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  const order = [];
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      indeg[v]--;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return order.length === n ? order : [];
}`
    },
    {
      lang: "js",
      title: "7. Tiny min-heap (Dijkstra)",
      desc: "What this is\nJavaScript has no built-in heap. A tiny binary heap is enough for Dijkstra.\nSmaller key() values come out first.\n\nWhat the code is doing\npush appends then bubbles up.\npop swaps the last item to the root then bubbles down.\nkey reads pair[0], so [distance, node] works.\n\nWatch out\nAlways skip a popped pair if its distance is stale (bigger than dist[node]).\nThis is not a Fibonacci heap. It is plenty for n up to a few thousand.",
      code: `function MinHeap(keyFn) {
  this.a = [];
  this.key = keyFn || function (x) { return x[0]; };
  this.size = function () { return this.a.length; };
  this.push = function (x) {
    this.a.push(x);
    this.bubbleUp(this.a.length - 1);
  };
  this.pop = function () {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      this.bubbleDown(0);
    }
    return top;
  };
  this.bubbleUp = function (i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.key(this.a[i]) >= this.key(this.a[p])) break;
      const t = this.a[i]; this.a[i] = this.a[p]; this.a[p] = t;
      i = p;
    }
  };
  this.bubbleDown = function (i) {
    const n = this.a.length;
    while (true) {
      let s = i;
      const l = i * 2 + 1;
      const r = l + 1;
      if (l < n && this.key(this.a[l]) < this.key(this.a[s])) s = l;
      if (r < n && this.key(this.a[r]) < this.key(this.a[s])) s = r;
      if (s === i) break;
      const t = this.a[i]; this.a[i] = this.a[s]; this.a[s] = t;
      i = s;
    }
  };
}`
    },
    {
      lang: "js",
      title: "8. Multi-source BFS",
      desc: "What this is\nSometimes many cells start at distance 0: every rotten orange, every 0 in 01 Matrix, every ocean-border cell.\nPut all of them in the queue first, then BFS once.\n\nWhat the code is doing\nEvery cell equal to startVal is pushed with dist 0.\nNeighbors that still hold otherVal get the next distance.\nThe grid is overwritten so we do not need a separate visited matrix.\n\nWatch out\nIf you BFS from each cell on its own, you repeat the same walks. That is the brute version of 01 Matrix.",
      code: `function multiSource(grid, startVal, otherVal) {
  const rows = grid.length;
  const cols = grid[0].length;
  const q = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === startVal) q.push([r, c, 0]);
    }
  }
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.length) {
    const cur = q.shift();
    const r = cur[0], c = cur[1], d = cur[2];
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0];
      const nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (grid[nr][nc] !== otherVal) continue;
      grid[nr][nc] = startVal;
      q.push([nr, nc, d + 1]);
    }
  }
  return grid;
}`
    },
    {
      lang: "js",
      title: "9. Directed cycle colors",
      desc: "What this is\nThree colors detect a cycle in a directed graph.\n0 = never seen, 1 = on the current path, 2 = finished.\n\nWhat the code is doing\nIf dfs hits a node that is already 1, that node is still on the stack, so a cycle exists.\nNeighbors are walked; then the node is marked 2.\nWe start dfs from every node so disconnected pieces are covered.\n\nWatch out\nA 2 is safe to skip. Only 1 means a back edge.\nUndirected cycle checks are different: ignore the parent, do not use this 3-color trick blindly.",
      code: `function hasDirectedCycle(g) {
  const state = Array(g.length).fill(0);
  function dfs(u) {
    if (state[u] === 1) return true;
    if (state[u] === 2) return false;
    state[u] = 1;
    for (let i = 0; i < g[u].length; i++) {
      if (dfs(g[u][i])) return true;
    }
    state[u] = 2;
    return false;
  }
  for (let i = 0; i < g.length; i++) {
    if (state[i] === 0 && dfs(i)) return true;
  }
  return false;
}`
    }
  ],
  questions: [
    {
      id: 1,
      level: "intermediate",
      q: "Number of Islands",
      ask: "Amazon · Google · Meta · Microsoft",
      a: "Count groups of land in a grid. '1' is land, '0' is water. Two land cells are the same island if they touch up, down, left, or right (not diagonal).\n\nExample: [[1,1,0],[1,0,0],[0,0,1]] has two islands: the three 1s in the top-left, and the lone 1 at the bottom-right.\n\nYou walk each land cell and mark the whole blob so you do not count it again. Open Brute, Optimal, and More optimal for extra visited copies, in-place DFS, and Union-Find.",
      solutions: [
        {
          name: "Brute",
          time: "O(r²c²)",
          space: "O(rc)",
          why: "For every land cell we copy a full visited matrix and DFS that island. The extra copies are wasted work. Correct, but memory traffic is huge on a large grid.",
          code: `function numIslands(grid) {
  const rows = grid.length;
  if (!rows) return 0;
  const cols = grid[0].length;
  const global = grid.map(function () {
    return Array(cols).fill(false);
  });
  let count = 0;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== "1" || global[r][c]) continue;
      count++;
      // extra visited copy for this island walk
      const seen = global.map(function (row) { return row.slice(); });
      const stack = [[r, c]];
      seen[r][c] = true;
      while (stack.length) {
        const cell = stack.pop();
        const x = cell[0], y = cell[1];
        global[x][y] = true;
        for (let i = 0; i < 4; i++) {
          const nx = x + dirs[i][0];
          const ny = y + dirs[i][1];
          if (nx < 0 || ny < 0 || nx >= rows || ny >= cols) continue;
          if (grid[nx][ny] !== "1" || seen[nx][ny]) continue;
          seen[nx][ny] = true;
          stack.push([nx, ny]);
        }
      }
    }
  }
  return count;
}`
        },
        {
          name: "Optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "One DFS (or BFS) per island. Mutating land to water is the visited mark, so we never copy a matrix. Each cell is entered a constant number of times.",
          code: `function numIslands(grid) {
  const rows = grid.length;
  if (!rows) return 0;
  const cols = grid[0].length;
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (grid[r][c] !== "1") return;
    grid[r][c] = "0";
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`
        },
        {
          name: "More optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "Union-Find treats each land cell as a node. You only union with the right and down land neighbor, so each edge is processed once. The island count is how many land roots remain. No recursion.",
          code: `function numIslands(grid) {
  const rows = grid.length;
  if (!rows) return 0;
  const cols = grid[0].length;
  const n = rows * cols;
  const parent = Array.from({ length: n }, function (_, i) { return i; });
  const rank = Array(n).fill(0);
  let islands = 0;

  function id(r, c) { return r * cols + c; }
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a, b) {
    let x = find(a), y = find(b);
    if (x === y) return;
    if (rank[x] < rank[y]) { const t = x; x = y; y = t; }
    parent[y] = x;
    if (rank[x] === rank[y]) rank[x]++;
    islands--;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== "1") continue;
      islands++;
      if (c + 1 < cols && grid[r][c + 1] === "1") union(id(r, c), id(r, c + 1));
      if (r + 1 < rows && grid[r + 1][c] === "1") union(id(r, c), id(r + 1, c));
    }
  }
  return islands;
}`
        }
      ]
    },
    {
      id: 2,
      level: "intermediate",
      q: "Clone Graph",
      ask: "Meta · Google · Amazon",
      a: "You get one node of a connected undirected graph. Each node has a val and a neighbors array. Return a deep copy: new objects, same shape, no shared references.\n\nExample: 1 connected to 2 and 3, 2 connected to 1 and 3. The clone has new nodes 1, 2, 3 with the same links.\n\nA map from old node to new node is the whole trick, so you do not clone the same node twice. Brute copies extra maps; Optimal uses DFS; More optimal uses BFS.",
      solutions: [
        {
          name: "Brute",
          time: "O(n + e)",
          space: "O(n)",
          why: "One shared old-to-new map is required so a node is cloned once. The extra Set copy on every call is wasted; it does not change correctness. Drop the copies and you get Optimal.",
          code: `function cloneGraph(node) {
  if (!node) return null;
  const map = new Map();

  function dfs(cur, seenCopy) {
    if (map.has(cur)) return map.get(cur);
    const copy = { val: cur.val, neighbors: [] };
    map.set(cur, copy);
    const nextSeen = new Set(seenCopy);
    nextSeen.add(cur);
    for (let i = 0; i < cur.neighbors.length; i++) {
      copy.neighbors.push(dfs(cur.neighbors[i], nextSeen));
    }
    return copy;
  }

  return dfs(node, new Set());
}`
        },
        {
          name: "Optimal",
          time: "O(n + e)",
          space: "O(n)",
          why: "One Map from old node to new node. DFS creates the clone, then fills neighbors. Each node and edge is processed once.",
          code: `function cloneGraph(node) {
  if (!node) return null;
  const map = new Map();

  function dfs(cur) {
    if (map.has(cur)) return map.get(cur);
    const copy = { val: cur.val, neighbors: [] };
    map.set(cur, copy);
    for (let i = 0; i < cur.neighbors.length; i++) {
      copy.neighbors.push(dfs(cur.neighbors[i]));
    }
    return copy;
  }

  return dfs(node);
}`
        },
        {
          name: "More optimal",
          time: "O(n + e)",
          space: "O(n)",
          why: "BFS with the same map avoids deep recursion on a long chain. Complexity matches DFS. Prefer this when the graph can be a long path.",
          code: `function cloneGraph(node) {
  if (!node) return null;
  const map = new Map();
  map.set(node, { val: node.val, neighbors: [] });
  const q = [node];
  while (q.length) {
    const cur = q.shift();
    const copy = map.get(cur);
    for (let i = 0; i < cur.neighbors.length; i++) {
      const nei = cur.neighbors[i];
      if (!map.has(nei)) {
        map.set(nei, { val: nei.val, neighbors: [] });
        q.push(nei);
      }
      copy.neighbors.push(map.get(nei));
    }
  }
  return map.get(node);
}`
        }
      ]
    },
    {
      id: 3,
      level: "intermediate",
      q: "Course Schedule",
      ask: "Amazon · Google · Meta · Microsoft",
      a: "There are numCourses labeled 0 to n-1. prerequisites[i] = [a, b] means you must take b before a. Return true if you can finish all courses.\n\nExample: 2 courses, [[1,0]] is true (take 0 then 1). [[1,0],[0,1]] is false (a 2-cycle).\n\nThis is 'does this directed graph have a cycle?' Brute DFS from every node with a fresh path copy. Optimal is 3-color DFS. More optimal is Kahn's indegree queue.",
      solutions: [
        {
          name: "Brute",
          time: "O(n·(n + e))",
          space: "O(n + e)",
          why: "From every course we DFS with a brand-new onPath array. We redo walks that a single 3-color pass would cache. Fine on tiny n, wasteful on large n.",
          code: `function canFinish(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, function () { return []; });
  for (let i = 0; i < prerequisites.length; i++) {
    const a = prerequisites[i][0];
    const b = prerequisites[i][1];
    g[b].push(a);
  }

  function dfs(u, onPath) {
    if (onPath[u]) return false;
    const copy = onPath.slice();
    copy[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      if (!dfs(g[u][i], copy)) return false;
    }
    return true;
  }

  for (let i = 0; i < numCourses; i++) {
    if (!dfs(i, Array(numCourses).fill(false))) return false;
  }
  return true;
}`
        },
        {
          name: "Optimal",
          time: "O(n + e)",
          space: "O(n + e)",
          why: "Three colors: 0 unseen, 1 on the current path, 2 done. Hitting a 1 is a cycle. Finished nodes are skipped, so each edge is walked once.",
          code: `function canFinish(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, function () { return []; });
  for (let i = 0; i < prerequisites.length; i++) {
    g[prerequisites[i][1]].push(prerequisites[i][0]);
  }
  const state = Array(numCourses).fill(0);

  function dfs(u) {
    if (state[u] === 1) return false;
    if (state[u] === 2) return true;
    state[u] = 1;
    for (let i = 0; i < g[u].length; i++) {
      if (!dfs(g[u][i])) return false;
    }
    state[u] = 2;
    return true;
  }

  for (let i = 0; i < numCourses; i++) {
    if (!dfs(i)) return false;
  }
  return true;
}`
        },
        {
          name: "More optimal",
          time: "O(n + e)",
          space: "O(n + e)",
          why: "Kahn's algorithm: peel indegree-0 courses. If you cannot peel all n courses, a cycle remains. Iterative, no recursion, same linear bound.",
          code: `function canFinish(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, function () { return []; });
  const indeg = Array(numCourses).fill(0);
  for (let i = 0; i < prerequisites.length; i++) {
    const a = prerequisites[i][0];
    const b = prerequisites[i][1];
    g[b].push(a);
    indeg[a]++;
  }
  const q = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) q.push(i);
  let taken = 0;
  while (q.length) {
    const u = q.shift();
    taken++;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      indeg[v]--;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return taken === numCourses;
}`
        }
      ]
    },
    {
      id: 4,
      level: "intermediate",
      q: "Course Schedule II",
      ask: "Amazon · Google · Meta · Apple",
      a: "Same setup as Course Schedule, but return one valid order of courses. If a cycle makes it impossible, return [].\n\nExample: numCourses = 4, prereqs [[1,0],[2,0],[3,1],[3,2]] can return [0,1,2,3] or [0,2,1,3].\n\nAny topo order is accepted. Brute tries every permutation. Optimal DFS pushes a course after its neighbors. More optimal is Kahn's queue, which builds the order as it peels.",
      solutions: [
        {
          name: "Brute",
          time: "O(n! · e)",
          space: "O(n)",
          why: "Generate every permutation of courses and test the prereq edges. Correct for tiny n, unusable at interview sizes. Shows you know 'order' means a permutation that respects edges.",
          code: `function findOrder(numCourses, prerequisites) {
  const edges = prerequisites;
  function ok(order) {
    const pos = Array(numCourses);
    for (let i = 0; i < order.length; i++) pos[order[i]] = i;
    for (let i = 0; i < edges.length; i++) {
      const a = edges[i][0], b = edges[i][1];
      if (pos[b] > pos[a]) return false;
    }
    return true;
  }
  const used = Array(numCourses).fill(false);
  const path = [];
  let ans = null;
  function dfs() {
    if (ans) return;
    if (path.length === numCourses) {
      if (ok(path)) ans = path.slice();
      return;
    }
    for (let i = 0; i < numCourses; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(i);
      dfs();
      path.pop();
      used[i] = false;
    }
  }
  dfs();
  return ans || [];
}`
        },
        {
          name: "Optimal",
          time: "O(n + e)",
          space: "O(n + e)",
          why: "DFS 3-color. After all outgoing edges are done, push the course. Reverse of that list is a topo order. Empty array if a cycle is found.",
          code: `function findOrder(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, function () { return []; });
  for (let i = 0; i < prerequisites.length; i++) {
    g[prerequisites[i][1]].push(prerequisites[i][0]);
  }
  const state = Array(numCourses).fill(0);
  const out = [];
  let cycle = false;

  function dfs(u) {
    if (state[u] === 1) { cycle = true; return; }
    if (state[u] === 2) return;
    state[u] = 1;
    for (let i = 0; i < g[u].length; i++) dfs(g[u][i]);
    state[u] = 2;
    out.push(u);
  }

  for (let i = 0; i < numCourses; i++) dfs(i);
  if (cycle) return [];
  out.reverse();
  return out;
}`
        },
        {
          name: "More optimal",
          time: "O(n + e)",
          space: "O(n + e)",
          why: "Kahn's BFS builds the order directly: indegree 0 first. If the order is shorter than n, a cycle blocked some courses. No reverse step, no recursion.",
          code: `function findOrder(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, function () { return []; });
  const indeg = Array(numCourses).fill(0);
  for (let i = 0; i < prerequisites.length; i++) {
    const a = prerequisites[i][0], b = prerequisites[i][1];
    g[b].push(a);
    indeg[a]++;
  }
  const q = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) q.push(i);
  const order = [];
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      indeg[v]--;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return order.length === numCourses ? order : [];
}`
        }
      ]
    },
    {
      id: 5,
      level: "intermediate",
      q: "Pacific Atlantic Water Flow",
      ask: "Google · Amazon · Meta",
      a: "A heights grid. Rain at a cell can flow to a neighbor that is equal or lower. The Pacific touches the top and left borders. The Atlantic touches the bottom and right. Return every cell that can reach both oceans.\n\nExample: a peak in the middle can flow down to both shores; a low pit in the center may reach neither.\n\nWalking from every cell to the ocean is the slow way. Walking inland from both shores and intersecting the two reachable sets is the right way.",
      solutions: [
        {
          name: "Brute",
          time: "O(r²c²)",
          space: "O(rc)",
          why: "From every cell, DFS toward lower/equal neighbors with a fresh visited copy. Check if that walk hits a Pacific border and an Atlantic border. Extra copies plus a full search per cell.",
          code: `function pacificAtlantic(heights) {
  const rows = heights.length, cols = heights[0].length;
  const ans = [];
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function reaches(sr, sc) {
    const seen = Array.from({ length: rows }, function () {
      return Array(cols).fill(false);
    });
    const stack = [[sr, sc]];
    seen[sr][sc] = true;
    let pac = false, atl = false;
    while (stack.length) {
      const cur = stack.pop();
      const r = cur[0], c = cur[1];
      if (r === 0 || c === 0) pac = true;
      if (r === rows - 1 || c === cols - 1) atl = true;
      if (pac && atl) return true;
      for (let i = 0; i < 4; i++) {
        const nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (seen[nr][nc] || heights[nr][nc] > heights[r][c]) continue;
        seen[nr][nc] = true;
        stack.push([nr, nc]);
      }
    }
    return pac && atl;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (reaches(r, c)) ans.push([r, c]);
    }
  }
  return ans;
}`
        },
        {
          name: "Optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "Reverse the flow: water climbs to equal or higher cells. DFS from all Pacific border cells, then from all Atlantic border cells. A cell in both visited sets is an answer. Each cell is processed a constant number of times.",
          code: `function pacificAtlantic(heights) {
  const rows = heights.length, cols = heights[0].length;
  const pac = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
  const atl = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function dfs(r, c, seen) {
    seen[r][c] = true;
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (seen[nr][nc] || heights[nr][nc] < heights[r][c]) continue;
      dfs(nr, nc, seen);
    }
  }

  for (let r = 0; r < rows; r++) {
    dfs(r, 0, pac);
    dfs(r, cols - 1, atl);
  }
  for (let c = 0; c < cols; c++) {
    dfs(0, c, pac);
    dfs(rows - 1, c, atl);
  }

  const ans = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pac[r][c] && atl[r][c]) ans.push([r, c]);
    }
  }
  return ans;
}`
        },
        {
          name: "More optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "Same reverse idea with BFS from both oceans. No recursion on a huge grid. Complexity is still linear in cells. This is the interview upgrade when they worry about stack depth.",
          code: `function pacificAtlantic(heights) {
  const rows = heights.length, cols = heights[0].length;
  const pac = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
  const atl = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function bfs(q, seen) {
    while (q.length) {
      const cur = q.shift();
      const r = cur[0], c = cur[1];
      for (let i = 0; i < 4; i++) {
        const nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (seen[nr][nc] || heights[nr][nc] < heights[r][c]) continue;
        seen[nr][nc] = true;
        q.push([nr, nc]);
      }
    }
  }

  const qp = [], qa = [];
  for (let r = 0; r < rows; r++) {
    pac[r][0] = true; qp.push([r, 0]);
    atl[r][cols - 1] = true; qa.push([r, cols - 1]);
  }
  for (let c = 0; c < cols; c++) {
    pac[0][c] = true; qp.push([0, c]);
    atl[rows - 1][c] = true; qa.push([rows - 1, c]);
  }
  bfs(qp, pac);
  bfs(qa, atl);

  const ans = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pac[r][c] && atl[r][c]) ans.push([r, c]);
    }
  }
  return ans;
}`
        }
      ]
    },
    {
      id: 6,
      level: "intermediate",
      q: "Graph Valid Tree",
      ask: "Google · Amazon · Meta · Adobe",
      a: "n nodes labeled 0 to n-1, and a list of undirected edges. Return true if these edges form a single tree: connected, and no cycle.\n\nExample: n = 5, edges [[0,1],[0,2],[0,3],[1,4]] is a tree. Add [1,2] and you get a cycle, so false.\n\nA tree on n nodes has exactly n-1 edges and is connected. Brute DFS with extra path copies. Optimal BFS connected-plus-n-1. More optimal Union-Find: a union that is already in the same set is a cycle.",
      solutions: [
        {
          name: "Brute",
          time: "O(n + e)",
          space: "O(n + e)",
          why: "Build the list, then from node 0 DFS with a fresh onPath copy at each step to catch a cycle. Count how many nodes were seen. Extra copies are the brute part; the idea (connected + acyclic) is right.",
          code: `function validTree(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) {
    const u = edges[i][0], v = edges[i][1];
    g[u].push(v);
    g[v].push(u);
  }
  const seen = Array(n).fill(false);
  function dfs(u, parent, onPath) {
    if (onPath[u]) return false;
    const copy = onPath.slice();
    copy[u] = true;
    seen[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      if (v === parent) continue;
      if (!dfs(v, u, copy)) return false;
    }
    return true;
  }
  if (!dfs(0, -1, Array(n).fill(false))) return false;
  for (let i = 0; i < n; i++) if (!seen[i]) return false;
  return true;
}`
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "A tree must have n-1 edges. Then one BFS/DFS from 0 must reach every node. If it does, there is no extra edge and no missing node, so no cycle.",
          code: `function validTree(n, edges) {
  if (edges.length !== n - 1) return false;
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) {
    g[edges[i][0]].push(edges[i][1]);
    g[edges[i][1]].push(edges[i][0]);
  }
  const seen = Array(n).fill(false);
  const q = [0];
  seen[0] = true;
  let count = 0;
  while (q.length) {
    const u = q.shift();
    count++;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      if (seen[v]) continue;
      seen[v] = true;
      q.push(v);
    }
  }
  return count === n;
}`
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Union-Find. If two ends already share a parent, that edge is a cycle. After n-1 successful unions you have one component. No adjacency list needed.",
          code: `function validTree(n, edges) {
  if (edges.length !== n - 1) return false;
  const parent = Array.from({ length: n }, function (_, i) { return i; });
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  for (let i = 0; i < edges.length; i++) {
    const a = find(edges[i][0]);
    const b = find(edges[i][1]);
    if (a === b) return false;
    parent[b] = a;
  }
  return true;
}`
        }
      ]
    },
    {
      id: 7,
      level: "intermediate",
      q: "Number of Connected Components in an Undirected Graph",
      ask: "Amazon · Google · Meta",
      a: "n nodes, undirected edges. Return how many connected pieces the graph has.\n\nExample: n = 5, edges [[0,1],[1,2],[3,4]] has two components: {0,1,2} and {3,4}.\n\nBrute restarts DFS with extra visited copies. Optimal is one visited array and a DFS/BFS per unvisited node. More optimal is Union-Find: start at n, subtract one for each merge.",
      solutions: [
        {
          name: "Brute",
          time: "O(n·(n + e))",
          space: "O(n + e)",
          why: "For every unvisited node we DFS with a copied seen array. We still need a global mark so we do not recount. The copies add work without changing the answer.",
          code: `function countComponents(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) {
    g[edges[i][0]].push(edges[i][1]);
    g[edges[i][1]].push(edges[i][0]);
  }
  const global = Array(n).fill(false);
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (global[i]) continue;
    count++;
    const seen = global.slice();
    const stack = [i];
    seen[i] = true;
    while (stack.length) {
      const u = stack.pop();
      global[u] = true;
      for (let k = 0; k < g[u].length; k++) {
        const v = g[u][k];
        if (seen[v]) continue;
        seen[v] = true;
        stack.push(v);
      }
    }
  }
  return count;
}`
        },
        {
          name: "Optimal",
          time: "O(n + e)",
          space: "O(n + e)",
          why: "Standard connected-component walk. Each start of a DFS on an unseen node is one component. Linear in nodes and edges.",
          code: `function countComponents(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) {
    g[edges[i][0]].push(edges[i][1]);
    g[edges[i][1]].push(edges[i][0]);
  }
  const seen = Array(n).fill(false);
  function dfs(u) {
    seen[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      if (!seen[g[u][i]]) dfs(g[u][i]);
    }
  }
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (seen[i]) continue;
    count++;
    dfs(i);
  }
  return count;
}`
        },
        {
          name: "More optimal",
          time: "O(n + e)",
          space: "O(n)",
          why: "Union-Find with no adjacency list. comps starts at n. Each successful union glues two pieces, so comps drops by 1. Path compression keeps finds cheap.",
          code: `function countComponents(n, edges) {
  const parent = Array.from({ length: n }, function (_, i) { return i; });
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  let comps = n;
  for (let i = 0; i < edges.length; i++) {
    const a = find(edges[i][0]);
    const b = find(edges[i][1]);
    if (a === b) continue;
    parent[b] = a;
    comps--;
  }
  return comps;
}`
        }
      ]
    },
    {
      id: 8,
      level: "advanced",
      q: "Word Ladder",
      ask: "Amazon · Google · Meta · Microsoft",
      a: "beginWord, endWord, and a wordList of the same length. A step changes exactly one letter to another real word in the list. Return the length of the shortest transformation sequence, or 0 if none exists. Length counts the words, so beginWord -> hot -> dot -> dog -> cog is 5.\n\nExample: begin hit, end cog, list [hot,dot,dog,lot,log,cog] answers 5.\n\nThis is unweighted shortest path on a huge implicit graph. Brute DFS explores every ladder. Optimal BFS. More optimal searches from both ends.",
      solutions: [
        {
          name: "Brute",
          time: "O(26^L · n)",
          space: "O(n·L)",
          why: "DFS with a copied remaining-word set at every step. It can walk long dead paths before it finds the short ladder. Exponential in ladder length.",
          code: `function ladderLength(beginWord, endWord, wordList) {
  const words = new Set(wordList);
  if (!words.has(endWord)) return 0;
  let best = Infinity;

  function dfs(word, dist, left) {
    if (dist >= best) return;
    if (word === endWord) {
      best = dist;
      return;
    }
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const ch = String.fromCharCode(c);
        const next = word.slice(0, i) + ch + word.slice(i + 1);
        if (!left.has(next)) continue;
        const copy = new Set(left);
        copy.delete(next);
        dfs(next, dist + 1, copy);
      }
    }
  }

  dfs(beginWord, 1, words);
  return best === Infinity ? 0 : best;
}`
        },
        {
          name: "Optimal",
          time: "O(n·L·26)",
          space: "O(n·L)",
          why: "BFS from beginWord. Each word is enqueued once. Trying 26 letters at each index is the usual neighbor generator. First time you hit endWord is the shortest length.",
          code: `function ladderLength(beginWord, endWord, wordList) {
  const words = new Set(wordList);
  if (!words.has(endWord)) return 0;
  const q = [[beginWord, 1]];
  words.delete(beginWord);
  while (q.length) {
    const cur = q.shift();
    const word = cur[0], dist = cur[1];
    if (word === endWord) return dist;
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const next = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
        if (!words.has(next)) continue;
        words.delete(next);
        q.push([next, dist + 1]);
      }
    }
  }
  return 0;
}`
        },
        {
          name: "More optimal",
          time: "O(n·L·26)",
          space: "O(n·L)",
          why: "Bidirectional BFS. Expand the smaller frontier each round. When a candidate sits in the other set, the two searches met. Branching is cut roughly in half on typical dictionaries.",
          code: `function ladderLength(beginWord, endWord, wordList) {
  const words = new Set(wordList);
  if (!words.has(endWord)) return 0;
  let begin = new Set([beginWord]);
  let end = new Set([endWord]);
  const seen = new Set([beginWord, endWord]);
  let steps = 1;
  while (begin.size && end.size) {
    if (begin.size > end.size) {
      const tmp = begin; begin = end; end = tmp;
    }
    const next = new Set();
    const beginArr = Array.from(begin);
    for (let b = 0; b < beginArr.length; b++) {
      const word = beginArr[b];
      for (let i = 0; i < word.length; i++) {
        for (let c = 97; c <= 122; c++) {
          const cand = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
          if (end.has(cand)) return steps + 1;
          if (!words.has(cand) || seen.has(cand)) continue;
          seen.add(cand);
          next.add(cand);
        }
      }
    }
    begin = next;
    steps++;
  }
  return 0;
}`
        }
      ]
    },
    {
      id: 9,
      level: "intermediate",
      q: "Rotting Oranges",
      ask: "Amazon · Google · Microsoft · Uber",
      a: "A grid: 0 empty, 1 fresh orange, 2 rotten. Every minute, every rotten orange infects its 4-direction neighbors. Return minutes until no fresh orange remains, or -1 if some orange never rots.\n\nExample: [[2,1,1],[1,1,0],[0,1,1]] takes 4 minutes.\n\nBrute rescan the whole grid each minute. Optimal is multi-source BFS from every initial 2. More optimal stores the minute on the grid so you do not keep a separate time field.",
      solutions: [
        {
          name: "Brute",
          time: "O((rc)²)",
          space: "O(rc)",
          why: "Each minute, copy the grid and rot any fresh cell that touches a 2. Repeat until nothing changes. You scan the whole grid once per minute, up to rc minutes.",
          code: `function orangesRotting(grid) {
  const rows = grid.length, cols = grid[0].length;
  function countFresh(g) {
    let n = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) if (g[r][c] === 1) n++;
    }
    return n;
  }
  let minutes = 0;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (true) {
    const next = grid.map(function (row) { return row.slice(); });
    let changed = false;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] !== 2) continue;
        for (let i = 0; i < 4; i++) {
          const nr = r + dirs[i][0], nc = c + dirs[i][1];
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
          if (grid[nr][nc] !== 1) continue;
          next[nr][nc] = 2;
          changed = true;
        }
      }
    }
    if (!changed) break;
    grid = next;
    minutes++;
  }
  return countFresh(grid) ? -1 : minutes;
}`
        },
        {
          name: "Optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "Put every rotten orange in the queue at minute 0. BFS infects fresh neighbors. The last minute you used is the answer. If any 1 remains, return -1.",
          code: `function orangesRotting(grid) {
  const rows = grid.length, cols = grid[0].length;
  const q = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) q.push([r, c, 0]);
      if (grid[r][c] === 1) fresh++;
    }
  }
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let minutes = 0;
  while (q.length) {
    const cur = q.shift();
    const r = cur[0], c = cur[1], t = cur[2];
    minutes = t;
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (grid[nr][nc] !== 1) continue;
      grid[nr][nc] = 2;
      fresh--;
      q.push([nr, nc, t + 1]);
    }
  }
  return fresh === 0 ? minutes : -1;
}`
        },
        {
          name: "More optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "Same multi-source BFS, but the grid itself stores time as 2 + minutes. No third tuple field. Space is still the queue. Linear in cells.",
          code: `function orangesRotting(grid) {
  const rows = grid.length, cols = grid[0].length;
  const q = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) q.push([r, c]);
      else if (grid[r][c] === 1) fresh++;
    }
  }
  if (fresh === 0) return 0;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let minutes = 0;
  while (q.length) {
    const size = q.length;
    let infected = false;
    for (let s = 0; s < size; s++) {
      const cur = q.shift();
      const r = cur[0], c = cur[1];
      for (let i = 0; i < 4; i++) {
        const nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (grid[nr][nc] !== 1) continue;
        grid[nr][nc] = 2;
        fresh--;
        infected = true;
        q.push([nr, nc]);
      }
    }
    if (infected) minutes++;
  }
  return fresh === 0 ? minutes : -1;
}`
        }
      ]
    },
    {
      id: 10,
      level: "intermediate",
      q: "01 Matrix",
      ask: "Google · Amazon · Meta · Microsoft",
      a: "A matrix of 0s and 1s. For every cell, return its distance to the nearest 0. Distance is 4-direction steps.\n\nExample: [[0,0,0],[0,1,0],[1,1,1]] becomes [[0,0,0],[0,1,0],[1,2,1]].\n\nBrute runs BFS from every 1. Optimal puts every 0 in one queue (multi-source BFS). More optimal is a two-pass DP: top-left then bottom-right.",
      solutions: [
        {
          name: "Brute",
          time: "O(r²c²)",
          space: "O(rc)",
          why: "For each 1, BFS with a fresh visited matrix until you hit a 0. You re-walk the same cells from many starts.",
          code: `function updateMatrix(mat) {
  const rows = mat.length, cols = mat[0].length;
  const out = Array.from({ length: rows }, function () { return Array(cols).fill(0); });
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function dist(sr, sc) {
    const seen = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
    const q = [[sr, sc, 0]];
    seen[sr][sc] = true;
    while (q.length) {
      const cur = q.shift();
      const r = cur[0], c = cur[1], d = cur[2];
      if (mat[r][c] === 0) return d;
      for (let i = 0; i < 4; i++) {
        const nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || seen[nr][nc]) continue;
        seen[nr][nc] = true;
        q.push([nr, nc, d + 1]);
      }
    }
    return 0;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (mat[r][c] !== 0) out[r][c] = dist(r, c);
    }
  }
  return out;
}`
        },
        {
          name: "Optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "Multi-source BFS from all zeros. Each 1 is reached first by its nearest 0. One visit per cell.",
          code: `function updateMatrix(mat) {
  const rows = mat.length, cols = mat[0].length;
  const inf = rows * cols;
  const dist = Array.from({ length: rows }, function () { return Array(cols).fill(inf); });
  const q = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (mat[r][c] === 0) {
        dist[r][c] = 0;
        q.push([r, c]);
      }
    }
  }
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.length) {
    const cur = q.shift();
    const r = cur[0], c = cur[1];
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (dist[nr][nc] <= dist[r][c] + 1) continue;
      dist[nr][nc] = dist[r][c] + 1;
      q.push([nr, nc]);
    }
  }
  return dist;
}`
        },
        {
          name: "More optimal",
          time: "O(rc)",
          space: "O(1)",
          why: "Two DP sweeps. First pass uses top and left (already processed). Second pass uses bottom and right. You can write into the output matrix only; extra space is O(1) besides the answer. Same linear time, no queue.",
          code: `function updateMatrix(mat) {
  const rows = mat.length, cols = mat[0].length;
  const inf = rows + cols;
  const dist = Array.from({ length: rows }, function (_, r) {
    return mat[r].map(function (v) { return v === 0 ? 0 : inf; });
  });
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r > 0) dist[r][c] = Math.min(dist[r][c], dist[r - 1][c] + 1);
      if (c > 0) dist[r][c] = Math.min(dist[r][c], dist[r][c - 1] + 1);
    }
  }
  for (let r = rows - 1; r >= 0; r--) {
    for (let c = cols - 1; c >= 0; c--) {
      if (r + 1 < rows) dist[r][c] = Math.min(dist[r][c], dist[r + 1][c] + 1);
      if (c + 1 < cols) dist[r][c] = Math.min(dist[r][c], dist[r][c + 1] + 1);
    }
  }
  return dist;
}`
        }
      ]
    },
    {
      id: 11,
      level: "advanced",
      q: "Alien Dictionary",
      ask: "Google · Amazon · Meta · Airbnb",
      a: "A list of words sorted in an alien alphabet. Derive a valid order of unique letters. If the order is invalid (cycle, or a longer word listed before its prefix), return \"\". Any valid topo order is accepted.\n\nExample: [wrt, wrf, er, ett, rftt] can return wertf.\n\nCompare neighbor words to build directed edges (earlier letter -> later letter). Then topo sort. Brute permutes letters. Optimal DFS. More optimal is Kahn.",
      solutions: [
        {
          name: "Brute",
          time: "O(k! · n · L)",
          space: "O(k)",
          why: "Collect unique letters, try every permutation, test it against consecutive word pairs. Fine for 3 letters, dead at 20. Proves you know the constraints.",
          code: `function alienOrder(words) {
  const letters = [];
  const seen = {};
  for (let w = 0; w < words.length; w++) {
    for (let i = 0; i < words[w].length; i++) {
      const ch = words[w][i];
      if (!seen[ch]) { seen[ch] = true; letters.push(ch); }
    }
  }
  function valid(order) {
    const rank = {};
    for (let i = 0; i < order.length; i++) rank[order[i]] = i;
    for (let i = 0; i < words.length - 1; i++) {
      const a = words[i], b = words[i + 1];
      const n = Math.min(a.length, b.length);
      let diff = false;
      for (let j = 0; j < n; j++) {
        if (a[j] !== b[j]) {
          if (rank[a[j]] > rank[b[j]]) return false;
          diff = true;
          break;
        }
      }
      if (!diff && a.length > b.length) return false;
    }
    return true;
  }
  let ans = "";
  function dfs(used, path) {
    if (ans) return;
    if (path.length === letters.length) {
      const s = path.join("");
      if (valid(s)) ans = s;
      return;
    }
    for (let i = 0; i < letters.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(letters[i]);
      dfs(used, path);
      path.pop();
      used[i] = false;
    }
  }
  dfs(Array(letters.length).fill(false), []);
  return ans;
}`
        },
        {
          name: "Optimal",
          time: "O(n·L + k)",
          space: "O(k²)",
          why: "Build a letter graph from the first mismatch of each consecutive pair. Reject prefix violations. DFS 3-color topo, then reverse the postorder.",
          code: `function alienOrder(words) {
  const g = {};
  const state = {};
  for (let w = 0; w < words.length; w++) {
    for (let i = 0; i < words[w].length; i++) {
      const ch = words[w][i];
      if (!g[ch]) { g[ch] = new Set(); state[ch] = 0; }
    }
  }
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i], b = words[i + 1];
    const n = Math.min(a.length, b.length);
    let found = false;
    for (let j = 0; j < n; j++) {
      if (a[j] !== b[j]) {
        g[a[j]].add(b[j]);
        found = true;
        break;
      }
    }
    if (!found && a.length > b.length) return "";
  }
  const out = [];
  let cycle = false;
  function dfs(u) {
    if (state[u] === 1) { cycle = true; return; }
    if (state[u] === 2) return;
    state[u] = 1;
    const nei = Array.from(g[u]);
    for (let i = 0; i < nei.length; i++) dfs(nei[i]);
    state[u] = 2;
    out.push(u);
  }
  const keys = Object.keys(g);
  for (let i = 0; i < keys.length; i++) dfs(keys[i]);
  if (cycle) return "";
  return out.reverse().join("");
}`
        },
        {
          name: "More optimal",
          time: "O(n·L + k)",
          space: "O(k²)",
          why: "Same graph, Kahn's BFS. Letters with indegree 0 come first. If you cannot emit every unique letter, there is a cycle. Iterative and easy to explain.",
          code: `function alienOrder(words) {
  const g = {};
  const indeg = {};
  for (let w = 0; w < words.length; w++) {
    for (let i = 0; i < words[w].length; i++) {
      const ch = words[w][i];
      if (!g[ch]) { g[ch] = new Set(); indeg[ch] = 0; }
    }
  }
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i], b = words[i + 1];
    const n = Math.min(a.length, b.length);
    let found = false;
    for (let j = 0; j < n; j++) {
      if (a[j] !== b[j]) {
        if (!g[a[j]].has(b[j])) {
          g[a[j]].add(b[j]);
          indeg[b[j]]++;
        }
        found = true;
        break;
      }
    }
    if (!found && a.length > b.length) return "";
  }
  const q = [];
  const keys = Object.keys(indeg);
  for (let i = 0; i < keys.length; i++) if (indeg[keys[i]] === 0) q.push(keys[i]);
  let order = "";
  while (q.length) {
    const u = q.shift();
    order += u;
    const nei = Array.from(g[u]);
    for (let i = 0; i < nei.length; i++) {
      const v = nei[i];
      indeg[v]--;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return order.length === keys.length ? order : "";
}`
        }
      ]
    },
    {
      id: 12,
      level: "intermediate",
      q: "Network Delay Time",
      ask: "Google · Amazon · Meta · Apple",
      a: "A directed weighted graph: times[i] = [u, v, w] means a signal takes w to go from u to v. Send from node k. Return how long until every node gets the signal, or -1 if some node is unreachable.\n\nExample: times [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2 answers 2.\n\nBrute DFS all paths with extra visiting copies. Optimal Dijkstra with a linear scan for the next closest node. More optimal Dijkstra with a min-heap.",
      solutions: [
        {
          name: "Brute",
          time: "O(n^e)",
          space: "O(n + e)",
          why: "DFS every simple path, copying the visiting array so cycles stop. Keep the best arrival time per node. Exponential on dense graphs.",
          code: `function networkDelayTime(times, n, k) {
  const g = Array.from({ length: n + 1 }, function () { return []; });
  for (let i = 0; i < times.length; i++) {
    g[times[i][0]].push([times[i][1], times[i][2]]);
  }
  const dist = Array(n + 1).fill(Infinity);
  function dfs(u, d, visiting) {
    if (d >= dist[u]) return;
    dist[u] = d;
    const copy = visiting.slice();
    copy[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i][0], w = g[u][i][1];
      if (copy[v]) continue;
      dfs(v, d + w, copy);
    }
  }
  dfs(k, 0, Array(n + 1).fill(false));
  let ans = 0;
  for (let i = 1; i <= n; i++) ans = Math.max(ans, dist[i]);
  return ans === Infinity ? -1 : ans;
}`
        },
        {
          name: "Optimal",
          time: "O(n² + e)",
          space: "O(n + e)",
          why: "Dijkstra without a heap: each round scan all nodes for the unvisited one with smallest dist. Fine when n is a few hundred. Classic O(n²) Dijkstra.",
          code: `function networkDelayTime(times, n, k) {
  const g = Array.from({ length: n + 1 }, function () { return []; });
  for (let i = 0; i < times.length; i++) {
    g[times[i][0]].push([times[i][1], times[i][2]]);
  }
  const dist = Array(n + 1).fill(Infinity);
  const used = Array(n + 1).fill(false);
  dist[k] = 0;
  for (let round = 0; round < n; round++) {
    let u = -1;
    for (let i = 1; i <= n; i++) {
      if (used[i]) continue;
      if (u === -1 || dist[i] < dist[u]) u = i;
    }
    if (u === -1 || dist[u] === Infinity) break;
    used[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i][0], w = g[u][i][1];
      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    }
  }
  let ans = 0;
  for (let i = 1; i <= n; i++) ans = Math.max(ans, dist[i]);
  return ans === Infinity ? -1 : ans;
}`
        },
        {
          name: "More optimal",
          time: "O((n + e) log n)",
          space: "O(n + e)",
          why: "Dijkstra with a binary min-heap of [distance, node]. Skip stale pops. This is the usual interview solution for sparse graphs.",
          code: `function networkDelayTime(times, n, k) {
  const g = Array.from({ length: n + 1 }, function () { return []; });
  for (let i = 0; i < times.length; i++) {
    g[times[i][0]].push([times[i][1], times[i][2]]);
  }
  const dist = Array(n + 1).fill(Infinity);
  dist[k] = 0;
  const heap = [];
  function push(item) {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i][0] >= heap[p][0]) break;
      const t = heap[i]; heap[i] = heap[p]; heap[p] = t;
      i = p;
    }
  }
  function pop() {
    const top = heap[0];
    const last = heap.pop();
    if (!heap.length) return top;
    heap[0] = last;
    let i = 0;
    while (true) {
      let s = i;
      const l = i * 2 + 1, r = l + 1;
      if (l < heap.length && heap[l][0] < heap[s][0]) s = l;
      if (r < heap.length && heap[r][0] < heap[s][0]) s = r;
      if (s === i) break;
      const t = heap[i]; heap[i] = heap[s]; heap[s] = t;
      i = s;
    }
    return top;
  }
  push([0, k]);
  while (heap.length) {
    const cur = pop();
    const d = cur[0], u = cur[1];
    if (d > dist[u]) continue;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i][0], w = g[u][i][1];
      if (d + w < dist[v]) {
        dist[v] = d + w;
        push([dist[v], v]);
      }
    }
  }
  let ans = 0;
  for (let i = 1; i <= n; i++) ans = Math.max(ans, dist[i]);
  return ans === Infinity ? -1 : ans;
}`
        }
      ]
    },
    {
      id: 13,
      level: "advanced",
      q: "Cheapest Flights Within K Stops",
      ask: "Amazon · Google · Bloomberg · Microsoft",
      a: "n cities, flights [from, to, price], src, dst, and K. Return the cheapest price from src to dst with at most K stops (so at most K+1 flights). -1 if impossible.\n\nExample: n = 4, flights [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src 0, dst 3, K 1 answers 700 (0->1->3). With K = 2 you can take 0->1->2->3 for 400.\n\nStops cap the path. Brute DFS. Optimal Bellman-Ford for K+1 rounds. More optimal is a min-heap Dijkstra that tracks remaining stops.",
      solutions: [
        {
          name: "Brute",
          time: "O(n^K)",
          space: "O(n + e)",
          why: "DFS every path with a copied visiting array and a remaining-stop budget. Exponential in K. Easy to write, too slow when K is 20 and the graph is dense.",
          code: `function findCheapestPrice(n, flights, src, dst, k) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < flights.length; i++) {
    g[flights[i][0]].push([flights[i][1], flights[i][2]]);
  }
  let best = Infinity;
  function dfs(u, cost, stops, visiting) {
    if (cost >= best) return;
    if (u === dst) { best = cost; return; }
    if (stops < 0) return;
    const copy = visiting.slice();
    copy[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i][0], w = g[u][i][1];
      if (copy[v]) continue;
      dfs(v, cost + w, stops - 1, copy);
    }
  }
  dfs(src, 0, k, Array(n).fill(false));
  return best === Infinity ? -1 : best;
}`
        },
        {
          name: "Optimal",
          time: "O(K · e)",
          space: "O(n)",
          why: "Bellman-Ford: relax every flight K+1 times. Copy dist each round so you only use paths with one more flight. Classic for 'at most K edges'.",
          code: `function findCheapestPrice(n, flights, src, dst, k) {
  let dist = Array(n).fill(Infinity);
  dist[src] = 0;
  for (let round = 0; round <= k; round++) {
    const next = dist.slice();
    for (let i = 0; i < flights.length; i++) {
      const u = flights[i][0], v = flights[i][1], w = flights[i][2];
      if (dist[u] === Infinity) continue;
      if (dist[u] + w < next[v]) next[v] = dist[u] + w;
    }
    dist = next;
  }
  return dist[dst] === Infinity ? -1 : dist[dst];
}`
        },
        {
          name: "More optimal",
          time: "O(K · e log (K n))",
          space: "O(n · K + e)",
          why: "Dijkstra on state (city, stops used). A min-heap pops cheapest cost first. best[city][stops] prunes worse repeats. Faster on sparse graphs when K is small.",
          code: `function findCheapestPrice(n, flights, src, dst, k) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < flights.length; i++) {
    g[flights[i][0]].push([flights[i][1], flights[i][2]]);
  }
  const best = Array.from({ length: n }, function () {
    return Array(k + 2).fill(Infinity);
  });
  const heap = [];
  function push(x) {
    heap.push(x);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i][0] >= heap[p][0]) break;
      const t = heap[i]; heap[i] = heap[p]; heap[p] = t;
      i = p;
    }
  }
  function pop() {
    const top = heap[0];
    const last = heap.pop();
    if (!heap.length) return top;
    heap[0] = last;
    let i = 0;
    while (true) {
      let s = i;
      const l = i * 2 + 1, r = l + 1;
      if (l < heap.length && heap[l][0] < heap[s][0]) s = l;
      if (r < heap.length && heap[r][0] < heap[s][0]) s = r;
      if (s === i) break;
      const t = heap[i]; heap[i] = heap[s]; heap[s] = t;
      i = s;
    }
    return top;
  }
  best[src][0] = 0;
  push([0, src, 0]);
  while (heap.length) {
    const cur = pop();
    const cost = cur[0], u = cur[1], used = cur[2];
    if (u === dst) return cost;
    if (used > k) continue;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i][0], w = g[u][i][1];
      const nc = cost + w;
      if (nc >= best[v][used + 1]) continue;
      best[v][used + 1] = nc;
      push([nc, v, used + 1]);
    }
  }
  return -1;
}`
        }
      ]
    },
    {
      id: 14,
      level: "intermediate",
      q: "Accounts Merge",
      ask: "Meta · Google · Amazon · Microsoft",
      a: "accounts[i] is [name, email1, email2, ...]. Two accounts belong to the same person if they share any email. Merge those accounts: one name, sorted unique emails. Different people may share a name.\n\nExample: John with a@x and b@x, John with b@x and c@x merge into one John with a, b, c.\n\nEmails are graph nodes. Brute DFS with extra visited copies. Optimal DFS/BFS grouping. More optimal Union-Find on emails.",
      solutions: [
        {
          name: "Brute",
          time: "O(n² · m)",
          space: "O(n · m)",
          why: "Build an email-to-accounts list, then from each unvisited account DFS through shared emails with a copied seen set. Extra copies plus scanning accounts repeatedly.",
          code: `function accountsMerge(accounts) {
  const emailToIds = {};
  for (let i = 0; i < accounts.length; i++) {
    for (let j = 1; j < accounts[i].length; j++) {
      const e = accounts[i][j];
      if (!emailToIds[e]) emailToIds[e] = [];
      emailToIds[e].push(i);
    }
  }
  const global = Array(accounts.length).fill(false);
  const ans = [];
  for (let i = 0; i < accounts.length; i++) {
    if (global[i]) continue;
    const seen = global.slice();
    const stack = [i];
    seen[i] = true;
    const emails = new Set();
    while (stack.length) {
      const id = stack.pop();
      global[id] = true;
      for (let j = 1; j < accounts[id].length; j++) {
        const e = accounts[id][j];
        emails.add(e);
        const ids = emailToIds[e];
        for (let k = 0; k < ids.length; k++) {
          if (seen[ids[k]]) continue;
          seen[ids[k]] = true;
          stack.push(ids[k]);
        }
      }
    }
    const list = Array.from(emails).sort();
    ans.push([accounts[i][0]].concat(list));
  }
  return ans;
}`
        },
        {
          name: "Optimal",
          time: "O(n · m log m)",
          space: "O(n · m)",
          why: "Graph of emails: link every email in an account to the first email. DFS each component, sort, prepend the name. Sorting emails is the log factor.",
          code: `function accountsMerge(accounts) {
  const g = {};
  const emailName = {};
  for (let i = 0; i < accounts.length; i++) {
    const name = accounts[i][0];
    for (let j = 1; j < accounts[i].length; j++) {
      const e = accounts[i][j];
      emailName[e] = name;
      if (!g[e]) g[e] = new Set();
      if (j > 1) {
        const first = accounts[i][1];
        g[e].add(first);
        g[first].add(e);
      }
    }
  }
  const seen = {};
  const ans = [];
  const keys = Object.keys(emailName);
  for (let i = 0; i < keys.length; i++) {
    const start = keys[i];
    if (seen[start]) continue;
    const stack = [start];
    seen[start] = true;
    const bag = [];
    while (stack.length) {
      const e = stack.pop();
      bag.push(e);
      const nei = g[e] ? Array.from(g[e]) : [];
      for (let k = 0; k < nei.length; k++) {
        if (seen[nei[k]]) continue;
        seen[nei[k]] = true;
        stack.push(nei[k]);
      }
    }
    bag.sort();
    ans.push([emailName[start]].concat(bag));
  }
  return ans;
}`
        },
        {
          name: "More optimal",
          time: "O(n · m log m)",
          space: "O(n · m)",
          why: "Union-Find on emails. Union every email in an account with the first email. Group by root, sort each group. No adjacency lists; merges are nearly O(1).",
          code: `function accountsMerge(accounts) {
  const parent = {};
  const emailName = {};
  function find(x) {
    if (parent[x] === undefined) parent[x] = x;
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a, b) {
    const x = find(a), y = find(b);
    if (x !== y) parent[y] = x;
  }
  for (let i = 0; i < accounts.length; i++) {
    const name = accounts[i][0];
    const first = accounts[i][1];
    for (let j = 1; j < accounts[i].length; j++) {
      const e = accounts[i][j];
      emailName[e] = name;
      union(first, e);
    }
  }
  const groups = {};
  const emails = Object.keys(emailName);
  for (let i = 0; i < emails.length; i++) {
    const e = emails[i];
    const root = find(e);
    if (!groups[root]) groups[root] = [];
    groups[root].push(e);
  }
  const ans = [];
  const roots = Object.keys(groups);
  for (let i = 0; i < roots.length; i++) {
    const list = groups[roots[i]].sort();
    ans.push([emailName[roots[i]]].concat(list));
  }
  return ans;
}`
        }
      ]
    },
    {
      id: 15,
      level: "intermediate",
      q: "Surrounded Regions",
      ask: "Amazon · Google · Microsoft · Apple",
      a: "A board of 'X' and 'O'. Flip every 'O' that cannot reach the border into 'X'. An 'O' on the border, and anything connected to it, stays 'O'.\n\nExample: a ring of X around a middle O becomes all X. An O on the edge keeps its whole blob.\n\nBrute: for every O, DFS with a visited copy to see if the blob hits the border. Optimal: mark all border-connected O, then flip the rest. More optimal: Union-Find with a dummy 'border' node.",
      solutions: [
        {
          name: "Brute",
          time: "O(r²c²)",
          space: "O(rc)",
          why: "For each O, copy a visited matrix and DFS. If that blob never hits a border, flip those cells. Repeated walks over the same region.",
          code: `function solve(board) {
  const rows = board.length;
  if (!rows) return;
  const cols = board[0].length;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function blob(sr, sc) {
    const seen = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
    const cells = [];
    const q = [[sr, sc]];
    seen[sr][sc] = true;
    let border = false;
    while (q.length) {
      const cur = q.pop();
      const r = cur[0], c = cur[1];
      cells.push([r, c]);
      if (r === 0 || c === 0 || r === rows - 1 || c === cols - 1) border = true;
      for (let i = 0; i < 4; i++) {
        const nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (seen[nr][nc] || board[nr][nc] !== "O") continue;
        seen[nr][nc] = true;
        q.push([nr, nc]);
      }
    }
    return { cells: cells, border: border };
  }

  const flipped = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] !== "O" || flipped[r][c]) continue;
      const info = blob(r, c);
      if (!info.border) {
        for (let i = 0; i < info.cells.length; i++) {
          const cell = info.cells[i];
          board[cell[0]][cell[1]] = "X";
        }
      }
      for (let i = 0; i < info.cells.length; i++) {
        flipped[info.cells[i][0]][info.cells[i][1]] = true;
      }
    }
  }
}`
        },
        {
          name: "Optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "DFS/BFS from every border O and mark those cells (for example '#'). Then walk the board: leftover O is surrounded and becomes X; '#' is restored to O.",
          code: `function solve(board) {
  const rows = board.length;
  if (!rows) return;
  const cols = board[0].length;

  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (board[r][c] !== "O") return;
    board[r][c] = "#";
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    dfs(r, 0);
    dfs(r, cols - 1);
  }
  for (let c = 0; c < cols; c++) {
    dfs(0, c);
    dfs(rows - 1, c);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === "O") board[r][c] = "X";
      else if (board[r][c] === "#") board[r][c] = "O";
    }
  }
}`
        },
        {
          name: "More optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "Union-Find. Dummy node DUMMY represents 'touches border'. Union every O with its O neighbors, and union border O with DUMMY. Then flip O whose root is not DUMMY. No recursion.",
          code: `function solve(board) {
  const rows = board.length;
  if (!rows) return;
  const cols = board[0].length;
  const DUMMY = rows * cols;
  const parent = Array.from({ length: DUMMY + 1 }, function (_, i) { return i; });
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a, b) {
    const x = find(a), y = find(b);
    if (x !== y) parent[y] = x;
  }
  function id(r, c) { return r * cols + c; }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] !== "O") continue;
      if (r === 0 || c === 0 || r === rows - 1 || c === cols - 1) union(id(r, c), DUMMY);
      if (r + 1 < rows && board[r + 1][c] === "O") union(id(r, c), id(r + 1, c));
      if (c + 1 < cols && board[r][c + 1] === "O") union(id(r, c), id(r, c + 1));
    }
  }
  const dummyRoot = find(DUMMY);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === "O" && find(id(r, c)) !== dummyRoot) board[r][c] = "X";
    }
  }
}`
        }
      ]
    },
    {
      id: 16,
      level: "beginner",
      q: "Flood Fill",
      ask: "Amazon · Google · Microsoft",
      a: "An image grid of color numbers, a start cell (sr, sc), and a new color. Recolor the start cell and every 4-direction neighbor that had the same old color. Return the image.\n\nExample: image [[1,1,1],[1,1,0],[1,0,1]], start (1,1), color 2 paints the connected 1s into 2s. The 1 at (2,2) stays 1 because it does not touch the blob through 4-direction edges.\n\nThis is islands on colors. If the start is already the new color, return as-is so you do not loop.",
      solutions: [
        {
          name: "Brute",
          time: "O(rc)",
          space: "O(rc)",
          why: "DFS with a brand-new visited matrix copy even though one matrix is enough. Extra memory, same walk. Shows the 'copy visited' habit you should drop.",
          code: `function floodFill(image, sr, sc, color) {
  const rows = image.length, cols = image[0].length;
  const old = image[sr][sc];
  if (old === color) return image;
  const seen = image.map(function (row) {
    return row.map(function () { return false; });
  });
  function dfs(r, c, vis) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (vis[r][c] || image[r][c] !== old) return;
    const copy = vis.map(function (row) { return row.slice(); });
    copy[r][c] = true;
    vis[r][c] = true;
    image[r][c] = color;
    dfs(r + 1, c, copy);
    dfs(r - 1, c, copy);
    dfs(r, c + 1, copy);
    dfs(r, c - 1, copy);
  }
  dfs(sr, sc, seen);
  return image;
}`
        },
        {
          name: "Optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "DFS from the start. Painting to the new color is the visited mark when old !== color. Each cell in the blob is painted once.",
          code: `function floodFill(image, sr, sc, color) {
  const old = image[sr][sc];
  if (old === color) return image;
  const rows = image.length, cols = image[0].length;
  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (image[r][c] !== old) return;
    image[r][c] = color;
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }
  dfs(sr, sc);
  return image;
}`
        },
        {
          name: "More optimal",
          time: "O(rc)",
          space: "O(rc)",
          why: "BFS with a queue. Same linear bound, no recursive stack. Prefer this on a huge image so the call stack cannot overflow.",
          code: `function floodFill(image, sr, sc, color) {
  const old = image[sr][sc];
  if (old === color) return image;
  const rows = image.length, cols = image[0].length;
  const q = [[sr, sc]];
  image[sr][sc] = color;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.length) {
    const cur = q.shift();
    const r = cur[0], c = cur[1];
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (image[nr][nc] !== old) continue;
      image[nr][nc] = color;
      q.push([nr, nc]);
    }
  }
  return image;
}`
        }
      ]
    },
    {
      id: 17,
      level: "intermediate",
      q: "Shortest Path in Binary Matrix",
      ask: "Amazon · Google · Meta · Microsoft",
      a: "An n x n grid of 0 (open) and 1 (blocked). Walk 8 directions. Return the length of the shortest path from (0,0) to (n-1,n-1), counting cells on the path. Return -1 if you cannot reach the end. Start and end must be 0.\n\nExample: [[0,1],[1,0]] answers 2 (diagonal step).\n\nUnweighted shortest path: BFS. DFS-all-paths is the brute. Bidirectional BFS is the upgrade on large open grids.",
      solutions: [
        {
          name: "Brute",
          time: "O(8^{n²})",
          space: "O(n²)",
          why: "DFS every simple path with a copied visited matrix. Keep the shortest length. Correct on a 2x2, exponential on a 20x20.",
          code: `function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] || grid[n - 1][n - 1]) return -1;
  let best = Infinity;
  const dirs = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr || dc) dirs.push([dr, dc]);
    }
  }
  function dfs(r, c, dist, seen) {
    if (dist >= best) return;
    if (r === n - 1 && c === n - 1) { best = dist; return; }
    for (let i = 0; i < dirs.length; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
      if (grid[nr][nc] !== 0 || seen[nr][nc]) continue;
      const copy = seen.map(function (row) { return row.slice(); });
      copy[nr][nc] = true;
      dfs(nr, nc, dist + 1, copy);
    }
  }
  const seen = Array.from({ length: n }, function () { return Array(n).fill(false); });
  seen[0][0] = true;
  dfs(0, 0, 1, seen);
  return best === Infinity ? -1 : best;
}`
        },
        {
          name: "Optimal",
          time: "O(n²)",
          space: "O(n²)",
          why: "BFS from (0,0). First time you pop the end cell is the shortest length. Mark cells when you push so the queue stays small. 8 neighbors.",
          code: `function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] || grid[n - 1][n - 1]) return -1;
  const q = [[0, 0, 1]];
  grid[0][0] = 1;
  const dirs = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr || dc) dirs.push([dr, dc]);
    }
  }
  while (q.length) {
    const cur = q.shift();
    const r = cur[0], c = cur[1], d = cur[2];
    if (r === n - 1 && c === n - 1) return d;
    for (let i = 0; i < dirs.length; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
      if (grid[nr][nc] !== 0) continue;
      grid[nr][nc] = 1;
      q.push([nr, nc, d + 1]);
    }
  }
  return -1;
}`
        },
        {
          name: "More optimal",
          time: "O(n²)",
          space: "O(n²)",
          why: "Bidirectional BFS from start and end. When a neighbor sits in the other frontier, the two searches met. Fewer cells expanded on large open maps. Same worst-case O(n²).",
          code: `function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] || grid[n - 1][n - 1]) return -1;
  if (n === 1) return 1;
  const dirs = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr || dc) dirs.push([dr, dc]);
    }
  }
  function key(r, c) { return r * n + c; }
  let q1 = [[0, 0]];
  let q2 = [[n - 1, n - 1]];
  let d1 = {};
  let d2 = {};
  d1[key(0, 0)] = 1;
  d2[key(n - 1, n - 1)] = 1;

  while (q1.length && q2.length) {
    if (q1.length > q2.length) {
      const tq = q1; q1 = q2; q2 = tq;
      const td = d1; d1 = d2; d2 = td;
    }
    const next = [];
    for (let i = 0; i < q1.length; i++) {
      const r = q1[i][0], c = q1[i][1];
      const id = key(r, c);
      for (let k = 0; k < dirs.length; k++) {
        const nr = r + dirs[k][0], nc = c + dirs[k][1];
        if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
        if (grid[nr][nc] !== 0) continue;
        const nid = key(nr, nc);
        if (d1[nid] !== undefined) continue;
        if (d2[nid] !== undefined) return d1[id] + d2[nid];
        d1[nid] = d1[id] + 1;
        next.push([nr, nc]);
      }
    }
    q1 = next;
  }
  return -1;
}`
        }
      ]
    },
    {
      id: 18,
      level: "intermediate",
      q: "Detect Cycle in a Directed Graph",
      ask: "Amazon · Google · Microsoft · Adobe",
      a: "A directed graph with n nodes and a list of edges [u, v] meaning u -> v. Return true if any cycle exists.\n\nExample: 3 nodes, edges [[0,1],[1,2],[2,0]] is a cycle. Drop [2,0] and it is a DAG, so false.\n\nBrute DFS from every node with a fresh on-path copy. Optimal 3-color DFS. More optimal Kahn: if you cannot peel all nodes, a cycle remains.",
      solutions: [
        {
          name: "Brute",
          time: "O(n·(n + e))",
          space: "O(n + e)",
          why: "From each start, DFS with a copied onPath array. You repeat walks that 3-color would cache as 'finished'. Extra copies are the brute cost.",
          code: `function hasCycle(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) g[edges[i][0]].push(edges[i][1]);

  function dfs(u, onPath) {
    if (onPath[u]) return true;
    const copy = onPath.slice();
    copy[u] = true;
    for (let i = 0; i < g[u].length; i++) {
      if (dfs(g[u][i], copy)) return true;
    }
    return false;
  }

  for (let i = 0; i < n; i++) {
    if (dfs(i, Array(n).fill(false))) return true;
  }
  return false;
}`
        },
        {
          name: "Optimal",
          time: "O(n + e)",
          space: "O(n + e)",
          why: "Colors 0/1/2. A neighbor that is still 1 is a back edge, so a cycle. Nodes marked 2 are skipped. Each edge once.",
          code: `function hasCycle(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  for (let i = 0; i < edges.length; i++) g[edges[i][0]].push(edges[i][1]);
  const state = Array(n).fill(0);
  function dfs(u) {
    if (state[u] === 1) return true;
    if (state[u] === 2) return false;
    state[u] = 1;
    for (let i = 0; i < g[u].length; i++) {
      if (dfs(g[u][i])) return true;
    }
    state[u] = 2;
    return false;
  }
  for (let i = 0; i < n; i++) {
    if (state[i] === 0 && dfs(i)) return true;
  }
  return false;
}`
        },
        {
          name: "More optimal",
          time: "O(n + e)",
          space: "O(n + e)",
          why: "Kahn's algorithm. Peel indegree 0. If the number of peeled nodes is less than n, leftover nodes sit in a cycle. Iterative, same linear time.",
          code: `function hasCycle(n, edges) {
  const g = Array.from({ length: n }, function () { return []; });
  const indeg = Array(n).fill(0);
  for (let i = 0; i < edges.length; i++) {
    g[edges[i][0]].push(edges[i][1]);
    indeg[edges[i][1]]++;
  }
  const q = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  let peeled = 0;
  while (q.length) {
    const u = q.shift();
    peeled++;
    for (let i = 0; i < g[u].length; i++) {
      const v = g[u][i];
      indeg[v]--;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return peeled !== n;
}`
        }
      ]
    }
  ]
};
