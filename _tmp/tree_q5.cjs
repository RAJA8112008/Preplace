"use strict";
const { tn, sol, LC, GFG, GFG_ART, block, JS_TN, PY_TN, JAVA_TN, CPP_TN, C_TN } = require("./tree_meta.cjs");

const questions = [];

questions.push({
  id: 29,
  level: "intermediate",
  q: "Path Sum II",
  ask: "Amazon · Microsoft · Meta · Google",
  links: [LC("path-sum-ii"), GFG("root-to-leaf-paths")],
  a: "Return every root-to-leaf path whose values sum to targetSum. A leaf has no children.\n\nDFS with a path list: push the node, recurse, pop (backtrack). When you hit a leaf and remain is 0, copy the path into the answer.\n\nBrute generates every root-to-leaf path then filters. Optimal backtracks with remaining sum. More optimal is an explicit stack of (node, path copy, remain) — same idea, iterative.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n²)", "O(n²)", "Collect every root-to-leaf path, then keep those whose sum equals target. Path copies dominate memory.", tn(
`function pathSum(root, targetSum) {
  const paths = [];
  function go(node, path) {
    if (!node) return;
    path.push(node.val);
    if (!node.left && !node.right) paths.push(path.slice());
    go(node.left, path);
    go(node.right, path);
    path.pop();
  }
  go(root, []);
  return paths.filter(function (p) {
    let s = 0;
    for (let i = 0; i < p.length; i++) s += p[i];
    return s === targetSum;
  });
}`,
`def path_sum(root, target_sum):
    paths = []
    def go(node, path):
        if node is None:
            return
        path.append(node.val)
        if node.left is None and node.right is None:
            paths.append(list(path))
        go(node.left, path)
        go(node.right, path)
        path.pop()
    go(root, [])
    return [p for p in paths if sum(p) == target_sum]`,
`    public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        List<List<Integer>> paths = new ArrayList<List<Integer>>();
        go(root, new ArrayList<Integer>(), paths);
        List<List<Integer>> out = new ArrayList<List<Integer>>();
        for (List<Integer> p : paths) {
            int s = 0;
            for (int v : p) s += v;
            if (s == targetSum) out.add(p);
        }
        return out;
    }
    void go(TreeNode node, List<Integer> path, List<List<Integer>> paths) {
        if (node == null) return;
        path.add(node.val);
        if (node.left == null && node.right == null) paths.add(new ArrayList<Integer>(path));
        go(node.left, path, paths);
        go(node.right, path, paths);
        path.remove(path.size() - 1);
    }`,
`void goPaths(TreeNode* node, vector<int>& path, vector<vector<int>>& paths) {
    if (!node) return;
    path.push_back(node->val);
    if (!node->left && !node->right) paths.push_back(path);
    goPaths(node->left, path, paths);
    goPaths(node->right, path, paths);
    path.pop_back();
}
vector<vector<int>> pathSum(TreeNode* root, int targetSum) {
    vector<vector<int>> paths, out;
    vector<int> path;
    goPaths(root, path, paths);
    for (auto& p : paths) {
        int s = 0;
        for (int v : p) s += v;
        if (s == targetSum) out.push_back(p);
    }
    return out;
}`,
`void goPaths(struct Node* node, int* path, int plen, int paths[][256], int* plenOut, int* pn) {
    if (!node) return;
    path[plen++] = node->val;
    if (!node->left && !node->right) {
        int i;
        plenOut[*pn] = plen;
        for (i = 0; i < plen; i++) paths[*pn][i] = path[i];
        (*pn)++;
    }
    goPaths(node->left, path, plen, paths, plenOut, pn);
    goPaths(node->right, path, plen, paths, plenOut, pn);
}
int** pathSum(struct Node* root, int targetSum, int* returnSize, int** returnColumnSizes) {
    static int paths[256][256], plenOut[256], *ptrs[256], cols[256], path[256];
    int pn = 0, i, j, n = 0;
    goPaths(root, path, 0, paths, plenOut, &pn);
    for (i = 0; i < pn; i++) {
        int s = 0;
        for (j = 0; j < plenOut[i]; j++) s += paths[i][j];
        if (s == targetSum) {
            cols[n] = plenOut[i];
            ptrs[n] = paths[i];
            n++;
        }
    }
    *returnSize = n;
    *returnColumnSizes = cols;
    return ptrs;
}`
    )),
    sol("Optimal", "O(n²)", "O(h)", "Backtracking. remain starts at targetSum. At a leaf, if remain == node.val, snapshot the path. Copying a path is O(h); total output can be O(n²).", tn(
`function pathSum(root, targetSum) {
  const out = [];
  function go(node, remain, path) {
    if (!node) return;
    path.push(node.val);
    if (!node.left && !node.right && remain === node.val) out.push(path.slice());
    go(node.left, remain - node.val, path);
    go(node.right, remain - node.val, path);
    path.pop();
  }
  go(root, targetSum, []);
  return out;
}`,
`def path_sum(root, target_sum):
    out = []
    def go(node, remain, path):
        if node is None:
            return
        path.append(node.val)
        if node.left is None and node.right is None and remain == node.val:
            out.append(list(path))
        go(node.left, remain - node.val, path)
        go(node.right, remain - node.val, path)
        path.pop()
    go(root, target_sum, [])
    return out`,
`    public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        List<List<Integer>> out = new ArrayList<List<Integer>>();
        go(root, targetSum, new ArrayList<Integer>(), out);
        return out;
    }
    void go(TreeNode node, int remain, List<Integer> path, List<List<Integer>> out) {
        if (node == null) return;
        path.add(node.val);
        if (node.left == null && node.right == null && remain == node.val) out.add(new ArrayList<Integer>(path));
        go(node.left, remain - node.val, path, out);
        go(node.right, remain - node.val, path, out);
        path.remove(path.size() - 1);
    }`,
`void goSum(TreeNode* node, int remain, vector<int>& path, vector<vector<int>>& out) {
    if (!node) return;
    path.push_back(node->val);
    if (!node->left && !node->right && remain == node->val) out.push_back(path);
    goSum(node->left, remain - node->val, path, out);
    goSum(node->right, remain - node->val, path, out);
    path.pop_back();
}
vector<vector<int>> pathSum(TreeNode* root, int targetSum) {
    vector<vector<int>> out;
    vector<int> path;
    goSum(root, targetSum, path, out);
    return out;
}`,
`void goSum(struct Node* node, int remain, int* path, int plen, int out[][256], int* olen, int* n) {
    if (!node) return;
    path[plen++] = node->val;
    if (!node->left && !node->right && remain == node->val) {
        int i;
        olen[*n] = plen;
        for (i = 0; i < plen; i++) out[*n][i] = path[i];
        (*n)++;
    }
    goSum(node->left, remain - node->val, path, plen, out, olen, n);
    goSum(node->right, remain - node->val, path, plen, out, olen, n);
}
int** pathSum(struct Node* root, int targetSum, int* returnSize, int** returnColumnSizes) {
    static int store[256][256], olen[256], *ptrs[256], path[256];
    int n = 0, i;
    goSum(root, targetSum, path, 0, store, olen, &n);
    for (i = 0; i < n; i++) ptrs[i] = store[i];
    *returnSize = n;
    *returnColumnSizes = olen;
    return ptrs;
}`
    )),
    sol("More optimal", "O(n²)", "O(n²)", "Iterative stack of {node, remain, path}. Same snapshots at leaves. Avoids call-stack overflow on a stick, still copies paths.", tn(
`function pathSum(root, targetSum) {
  if (!root) return [];
  const out = [];
  const stack = [{ node: root, remain: targetSum, path: [root.val] }];
  while (stack.length) {
    const cur = stack.pop();
    const node = cur.node;
    if (!node.left && !node.right && cur.remain === node.val) out.push(cur.path);
    if (node.right) stack.push({ node: node.right, remain: cur.remain - node.val, path: cur.path.concat([node.right.val]) });
    if (node.left) stack.push({ node: node.left, remain: cur.remain - node.val, path: cur.path.concat([node.left.val]) });
  }
  return out;
}`,
`def path_sum(root, target_sum):
    if root is None:
        return []
    out = []
    stack = [(root, target_sum, [root.val])]
    while stack:
        node, remain, path = stack.pop()
        if node.left is None and node.right is None and remain == node.val:
            out.append(path)
        if node.right:
            stack.append((node.right, remain - node.val, path + [node.right.val]))
        if node.left:
            stack.append((node.left, remain - node.val, path + [node.left.val]))
    return out`,
`    public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        List<List<Integer>> out = new ArrayList<List<Integer>>();
        if (root == null) return out;
        Deque<TreeNode> ns = new ArrayDeque<TreeNode>();
        Deque<Integer> rs = new ArrayDeque<Integer>();
        Deque<List<Integer>> ps = new ArrayDeque<List<Integer>>();
        ns.push(root); rs.push(targetSum); ps.push(new ArrayList<Integer>(Arrays.asList(root.val)));
        while (!ns.isEmpty()) {
            TreeNode node = ns.pop();
            int remain = rs.pop();
            List<Integer> path = ps.pop();
            if (node.left == null && node.right == null && remain == node.val) out.add(path);
            if (node.right != null) {
                List<Integer> np = new ArrayList<Integer>(path);
                np.add(node.right.val);
                ns.push(node.right); rs.push(remain - node.val); ps.push(np);
            }
            if (node.left != null) {
                List<Integer> np = new ArrayList<Integer>(path);
                np.add(node.left.val);
                ns.push(node.left); rs.push(remain - node.val); ps.push(np);
            }
        }
        return out;
    }`,
`vector<vector<int>> pathSum(TreeNode* root, int targetSum) {
    vector<vector<int>> out;
    if (!root) return out;
    struct Frame { TreeNode* node; int remain; vector<int> path; };
    vector<Frame> stack;
    stack.push_back({root, targetSum, {root->val}});
    while (!stack.empty()) {
        Frame cur = stack.back(); stack.pop_back();
        if (!cur.node->left && !cur.node->right && cur.remain == cur.node->val) out.push_back(cur.path);
        if (cur.node->right) {
            vector<int> np = cur.path;
            np.push_back(cur.node->right->val);
            stack.push_back({cur.node->right, cur.remain - cur.node->val, np});
        }
        if (cur.node->left) {
            vector<int> np = cur.path;
            np.push_back(cur.node->left->val);
            stack.push_back({cur.node->left, cur.remain - cur.node->val, np});
        }
    }
    return out;
}`,
`int** pathSum(struct Node* root, int targetSum, int* returnSize, int** returnColumnSizes) {
    static int store[256][256], olen[256], *ptrs[256];
    struct Node* sn[256];
    int sr[256], spath[256][256], slen[256];
    int sp = 0, n = 0, i;
    if (!root) { *returnSize = 0; *returnColumnSizes = olen; return ptrs; }
    sn[sp] = root; sr[sp] = targetSum; spath[sp][0] = root->val; slen[sp] = 1; sp++;
    while (sp) {
        sp--;
        struct Node* node = sn[sp];
        int remain = sr[sp], plen = slen[sp];
        int path[256];
        for (i = 0; i < plen; i++) path[i] = spath[sp][i];
        if (!node->left && !node->right && remain == node->val) {
            olen[n] = plen;
            for (i = 0; i < plen; i++) store[n][i] = path[i];
            ptrs[n] = store[n];
            n++;
        }
        if (node->right) {
            sn[sp] = node->right; sr[sp] = remain - node->val;
            for (i = 0; i < plen; i++) spath[sp][i] = path[i];
            spath[sp][plen] = node->right->val; slen[sp] = plen + 1; sp++;
        }
        if (node->left) {
            sn[sp] = node->left; sr[sp] = remain - node->val;
            for (i = 0; i < plen; i++) spath[sp][i] = path[i];
            spath[sp][plen] = node->left->val; slen[sp] = plen + 1; sp++;
        }
    }
    *returnSize = n;
    *returnColumnSizes = olen;
    return ptrs;
}`
    ))
  ]
});

questions.push({
  id: 30,
  level: "intermediate",
  q: "Amount of Time for Binary Tree to Be Infected",
  ask: "Amazon · Google · Meta",
  links: [LC("amount-of-time-for-binary-tree-to-be-infected"), GFG_ART("burn-the-binary-tree-starting-from-the-target-node")],
  a: "At minute 0 the node with value start is infected. Each minute infection spreads to adjacent nodes (parent or child). Return how many minutes until every node is infected.\n\nThis is the max distance from start in the undirected tree. Parent map + BFS, or one DFS that returns height-below-start and distance-up.\n\nBrute adjacency list BFS. Optimal parent map BFS max dist. More optimal single DFS tracking the answer.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n)", "O(n)", "Build undirected graph on values (unique). BFS from start. Answer is the max distance.", tn(
`function amountOfTime(root, start) {
  const g = {};
  function link(a, b) {
    if (!g[a]) g[a] = [];
    if (!g[b]) g[b] = [];
    g[a].push(b);
    g[b].push(a);
  }
  function build(node) {
    if (!node) return;
    if (node.left) { link(node.val, node.left.val); build(node.left); }
    if (node.right) { link(node.val, node.right.val); build(node.right); }
  }
  build(root);
  const seen = {};
  const q = [[start, 0]];
  seen[start] = true;
  let best = 0;
  while (q.length) {
    const pair = q.shift();
    const u = pair[0], d = pair[1];
    if (d > best) best = d;
    const nbrs = g[u] || [];
    for (let i = 0; i < nbrs.length; i++) {
      if (seen[nbrs[i]]) continue;
      seen[nbrs[i]] = true;
      q.push([nbrs[i], d + 1]);
    }
  }
  return best;
}`,
`def amount_of_time(root, start):
    from collections import defaultdict, deque
    g = defaultdict(list)
    def build(node):
        if node is None:
            return
        if node.left:
            g[node.val].append(node.left.val)
            g[node.left.val].append(node.val)
            build(node.left)
        if node.right:
            g[node.val].append(node.right.val)
            g[node.right.val].append(node.val)
            build(node.right)
    build(root)
    seen = {start}
    q = deque([(start, 0)])
    best = 0
    while q:
        u, d = q.popleft()
        best = max(best, d)
        for v in g[u]:
            if v not in seen:
                seen.add(v)
                q.append((v, d + 1))
    return best`,
`    public int amountOfTime(TreeNode root, int start) {
        Map<Integer, List<Integer>> g = new HashMap<Integer, List<Integer>>();
        build(root, g);
        Set<Integer> seen = new HashSet<Integer>();
        Queue<int[]> q = new ArrayDeque<int[]>();
        q.add(new int[]{start, 0});
        seen.add(start);
        int best = 0;
        while (!q.isEmpty()) {
            int[] p = q.poll();
            best = Math.max(best, p[1]);
            for (int v : g.getOrDefault(p[0], Collections.emptyList())) {
                if (seen.add(v)) q.add(new int[]{v, p[1] + 1});
            }
        }
        return best;
    }
    void link(Map<Integer, List<Integer>> g, int a, int b) {
        g.computeIfAbsent(a, x -> new ArrayList<Integer>()).add(b);
        g.computeIfAbsent(b, x -> new ArrayList<Integer>()).add(a);
    }
    void build(TreeNode node, Map<Integer, List<Integer>> g) {
        if (node == null) return;
        if (node.left != null) { link(g, node.val, node.left.val); build(node.left, g); }
        if (node.right != null) { link(g, node.val, node.right.val); build(node.right, g); }
    }`,
`int amountOfTime(TreeNode* root, int start) {
    unordered_map<int, vector<int>> g;
    function<void(TreeNode*)> build = [&](TreeNode* node) {
        if (!node) return;
        if (node->left) {
            g[node->val].push_back(node->left->val);
            g[node->left->val].push_back(node->val);
            build(node->left);
        }
        if (node->right) {
            g[node->val].push_back(node->right->val);
            g[node->right->val].push_back(node->val);
            build(node->right);
        }
    };
    build(root);
    unordered_set<int> seen;
    queue<pair<int,int>> q;
    q.push({start, 0});
    seen.insert(start);
    int best = 0;
    while (!q.empty()) {
        auto [u, d] = q.front(); q.pop();
        best = max(best, d);
        for (int v : g[u]) if (!seen.count(v)) { seen.insert(v); q.push({v, d + 1}); }
    }
    return best;
}`,
`void addE(int u, int v, int adj[][8], int* deg) {
    adj[u][deg[u]++] = v;
    adj[v][deg[v]++] = u;
}
void buildG2(struct Node* node, int adj[][8], int* deg) {
    if (!node) return;
    if (node->left) { addE(node->val, node->left->val, adj, deg); buildG2(node->left, adj, deg); }
    if (node->right) { addE(node->val, node->right->val, adj, deg); buildG2(node->right, adj, deg); }
}
int amountOfTime(struct Node* root, int start) {
    int adj[100005][8], deg[100005], seen[100005];
    int qv[10005], qd[10005], qs = 0, qe = 0, best = 0, i;
    for (i = 0; i < 100005; i++) { deg[i] = 0; seen[i] = 0; }
    buildG2(root, adj, deg);
    qv[qe] = start; qd[qe++] = 0; seen[start] = 1;
    while (qs < qe) {
        int u = qv[qs], d = qd[qs++];
        if (d > best) best = d;
        for (i = 0; i < deg[u]; i++) {
            int v = adj[u][i];
            if (seen[v]) continue;
            seen[v] = 1;
            qv[qe] = v; qd[qe++] = d + 1;
        }
    }
    return best;
}`
    )),
    sol("Optimal", "O(n)", "O(n)", "Parent pointers, BFS from the start node (find it first). Minutes = max distance.", tn(
`function amountOfTime(root, start) {
  const parent = new Map();
  let src = null;
  function mark(node, p) {
    if (!node) return;
    parent.set(node, p);
    if (node.val === start) src = node;
    mark(node.left, node);
    mark(node.right, node);
  }
  mark(root, null);
  const seen = new Set();
  const q = [[src, 0]];
  seen.add(src);
  let best = 0;
  while (q.length) {
    const pair = q.shift();
    const node = pair[0], d = pair[1];
    if (d > best) best = d;
    const nbr = [node.left, node.right, parent.get(node)];
    for (let i = 0; i < 3; i++) {
      const nx = nbr[i];
      if (!nx || seen.has(nx)) continue;
      seen.add(nx);
      q.push([nx, d + 1]);
    }
  }
  return best;
}`,
`def amount_of_time(root, start):
    from collections import deque
    parent = {}
    src = [None]
    def mark(node, p):
        if node is None:
            return
        parent[node] = p
        if node.val == start:
            src[0] = node
        mark(node.left, node)
        mark(node.right, node)
    mark(root, None)
    seen = {src[0]}
    q = deque([(src[0], 0)])
    best = 0
    while q:
        node, d = q.popleft()
        best = max(best, d)
        for nx in (node.left, node.right, parent.get(node)):
            if nx is not None and nx not in seen:
                seen.add(nx)
                q.append((nx, d + 1))
    return best`,
`    Map<TreeNode, TreeNode> parent = new HashMap<TreeNode, TreeNode>();
    TreeNode src;
    void mark(TreeNode node, TreeNode p, int start) {
        if (node == null) return;
        parent.put(node, p);
        if (node.val == start) src = node;
        mark(node.left, node, start);
        mark(node.right, node, start);
    }
    public int amountOfTime(TreeNode root, int start) {
        mark(root, null, start);
        Set<TreeNode> seen = new HashSet<TreeNode>();
        Queue<TreeNode> q = new ArrayDeque<TreeNode>();
        Queue<Integer> dq = new ArrayDeque<Integer>();
        q.add(src); dq.add(0); seen.add(src);
        int best = 0;
        while (!q.isEmpty()) {
            TreeNode node = q.poll();
            int d = dq.poll();
            best = Math.max(best, d);
            TreeNode[] nbr = {node.left, node.right, parent.get(node)};
            for (TreeNode nx : nbr) {
                if (nx == null || !seen.add(nx)) continue;
                q.add(nx); dq.add(d + 1);
            }
        }
        return best;
    }`,
`int amountOfTime(TreeNode* root, int start) {
    unordered_map<TreeNode*, TreeNode*> parent;
    TreeNode* src = nullptr;
    function<void(TreeNode*, TreeNode*)> mark = [&](TreeNode* node, TreeNode* p) {
        if (!node) return;
        parent[node] = p;
        if (node->val == start) src = node;
        mark(node->left, node);
        mark(node->right, node);
    };
    mark(root, nullptr);
    unordered_set<TreeNode*> seen;
    queue<pair<TreeNode*, int>> q;
    q.push({src, 0});
    seen.insert(src);
    int best = 0;
    while (!q.empty()) {
        auto [node, d] = q.front(); q.pop();
        best = max(best, d);
        TreeNode* nbr[3] = {node->left, node->right, parent[node]};
        for (int i = 0; i < 3; i++) {
            if (!nbr[i] || seen.count(nbr[i])) continue;
            seen.insert(nbr[i]);
            q.push({nbr[i], d + 1});
        }
    }
    return best;
}`,
`int amountOfTime(struct Node* root, int start) {
    struct Pair { struct Node* node; struct Node* p; } par[10005];
    struct Node *qn[10005], *seen[10005], *src = NULL, *nbr[3];
    int pn = 0, qs = 0, qe = 0, sn = 0, qd[10005], best = 0, i;
    void mark(struct Node* node, struct Node* p);
    /* iterative mark via recursion helper inlined below */
    struct Node* stackN[10005], *stackP[10005];
    int sp = 0;
    stackN[sp] = root; stackP[sp] = NULL; sp++;
    while (sp) {
        struct Node* node = stackN[--sp];
        struct Node* p = stackP[sp];
        if (!node) continue;
        par[pn].node = node; par[pn].p = p; pn++;
        if (node->val == start) src = node;
        stackN[sp] = node->right; stackP[sp] = node; sp++;
        stackN[sp] = node->left; stackP[sp] = node; sp++;
    }
    qn[qe] = src; qd[qe++] = 0; seen[sn++] = src;
    while (qs < qe) {
        struct Node* node = qn[qs];
        int d = qd[qs++];
        struct Node* p = NULL;
        if (d > best) best = d;
        for (i = 0; i < pn; i++) if (par[i].node == node) { p = par[i].p; break; }
        nbr[0] = node->left; nbr[1] = node->right; nbr[2] = p;
        for (i = 0; i < 3; i++) {
            int found = 0, j;
            if (!nbr[i]) continue;
            for (j = 0; j < sn; j++) if (seen[j] == nbr[i]) found = 1;
            if (found) continue;
            seen[sn++] = nbr[i];
            qn[qe] = nbr[i]; qd[qe++] = d + 1;
        }
    }
    return best;
}`
    )),
    sol("More optimal", "O(n)", "O(h)", "DFS returns height of the subtree. When the start node is found, ans is max(height below, distance going up through the parent). One traversal, no graph.", tn(
`function amountOfTime(root, start) {
  let ans = 0;
  function dfs(node) {
    if (!node) return 0;
    const L = dfs(node.left);
    const R = dfs(node.right);
    if (node.val === start) {
      ans = Math.max(ans, L, R);
      return -1;
    }
    if (L < 0) {
      ans = Math.max(ans, R - L);
      return L - 1;
    }
    if (R < 0) {
      ans = Math.max(ans, L - R);
      return R - 1;
    }
    return 1 + Math.max(L, R);
  }
  dfs(root);
  return ans;
}`,
`def amount_of_time(root, start):
    ans = [0]
    def dfs(node):
        if node is None:
            return 0
        left = dfs(node.left)
        right = dfs(node.right)
        if node.val == start:
            ans[0] = max(ans[0], left, right)
            return -1
        if left < 0:
            ans[0] = max(ans[0], right - left)
            return left - 1
        if right < 0:
            ans[0] = max(ans[0], left - right)
            return right - 1
        return 1 + max(left, right)
    dfs(root)
    return ans[0]`,
`    int ans;
    int dfs(TreeNode node, int start) {
        if (node == null) return 0;
        int L = dfs(node.left, start);
        int R = dfs(node.right, start);
        if (node.val == start) {
            ans = Math.max(ans, Math.max(L, R));
            return -1;
        }
        if (L < 0) { ans = Math.max(ans, R - L); return L - 1; }
        if (R < 0) { ans = Math.max(ans, L - R); return R - 1; }
        return 1 + Math.max(L, R);
    }
    public int amountOfTime(TreeNode root, int start) {
        ans = 0;
        dfs(root, start);
        return ans;
    }`,
`int amountOfTime(TreeNode* root, int start) {
    int ans = 0;
    function<int(TreeNode*)> dfs = [&](TreeNode* node) {
        if (!node) return 0;
        int L = dfs(node->left);
        int R = dfs(node->right);
        if (node->val == start) {
            ans = max(ans, max(L, R));
            return -1;
        }
        if (L < 0) { ans = max(ans, R - L); return L - 1; }
        if (R < 0) { ans = max(ans, L - R); return R - 1; }
        return 1 + max(L, R);
    };
    dfs(root);
    return ans;
}`,
`int burnDfs(struct Node* node, int start, int* ans) {
    int L, R;
    if (!node) return 0;
    L = burnDfs(node->left, start, ans);
    R = burnDfs(node->right, start, ans);
    if (node->val == start) {
        if (L > *ans) *ans = L;
        if (R > *ans) *ans = R;
        return -1;
    }
    if (L < 0) { if (R - L > *ans) *ans = R - L; return L - 1; }
    if (R < 0) { if (L - R > *ans) *ans = L - R; return R - 1; }
    return 1 + (L > R ? L : R);
}
int amountOfTime(struct Node* root, int start) {
    int ans = 0;
    burnDfs(root, start, &ans);
    return ans;
}`
    ))
  ]
});

module.exports = questions;
