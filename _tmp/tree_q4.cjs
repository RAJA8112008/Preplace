"use strict";
const { tn, sol, LC, GFG, GFG_ART, block, JS_TN, PY_TN, JAVA_TN, CPP_TN, C_TN, JS_NN, PY_NN, JAVA_NN, CPP_NN, C_NN } = require("./tree_meta.cjs");

function nn(js, py, javaMethods, cpp, c) {
  return block(
    JS_NN + "\n\n" + js,
    PY_NN + py,
    JAVA_NN + "\nclass Solution {\n" + javaMethods + "\n}",
    CPP_NN + "\n" + cpp,
    C_NN + "\n" + c
  );
}

const questions = [];

questions.push({
  id: 27,
  level: "intermediate",
  q: "Populating Next Right Pointers in Each Node",
  ask: "Amazon · Microsoft · Meta · Google",
  links: [LC("populating-next-right-pointers-in-each-node"), GFG_ART("connect-nodes-at-same-level")],
  a: "The tree is perfect (every level full). Each node has a next pointer. Point it at the neighbor on the right, or null at the end of a level. Return the root.\n\nBrute is BFS: the next node in the queue on the same level is next. Optimal walks already-built next links on level i to wire level i+1, O(1) extra space. More optimal uses a leftmost pointer and a prev cursor on the child level.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n)", "O(n)", "Level-order queue. For each level, node.next = the next polled node, last.next = null.", nn(
`function connect(root) {
  if (!root) return null;
  const q = [root];
  while (q.length) {
    const n = q.length;
    for (let i = 0; i < n; i++) {
      const node = q.shift();
      if (i + 1 < n) node.next = q[0];
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
  }
  return root;
}`,
`def connect(root):
    if root is None:
        return None
    from collections import deque
    q = deque([root])
    while q:
        n = len(q)
        for i in range(n):
            node = q.popleft()
            if i + 1 < n:
                node.next = q[0]
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
    return root`,
`    public Node connect(Node root) {
        if (root == null) return null;
        Queue<Node> q = new ArrayDeque<Node>();
        q.add(root);
        while (!q.isEmpty()) {
            int n = q.size();
            for (int i = 0; i < n; i++) {
                Node node = q.poll();
                if (i + 1 < n) node.next = q.peek();
                if (node.left != null) q.add(node.left);
                if (node.right != null) q.add(node.right);
            }
        }
        return root;
    }`,
`Node* connect(Node* root) {
    if (!root) return nullptr;
    queue<Node*> q;
    q.push(root);
    while (!q.empty()) {
        int n = (int)q.size();
        for (int i = 0; i < n; i++) {
            Node* node = q.front(); q.pop();
            if (i + 1 < n) node->next = q.front();
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
    }
    return root;
}`,
`struct Node* connect(struct Node* root) {
    struct Node* q[10005];
    int qs, qe;
    if (!root) return NULL;
    qs = 0; qe = 0;
    q[qe++] = root;
    while (qs < qe) {
        int n = qe - qs, i;
        for (i = 0; i < n; i++) {
            struct Node* node = q[qs++];
            if (i + 1 < n) node->next = q[qs];
            if (node->left) q[qe++] = node->left;
            if (node->right) q[qe++] = node->right;
        }
    }
    return root;
}`
    )),
    sol("Optimal", "O(n)", "O(1)", "On a perfect tree, left.next = right, and right.next = node.next.left. Recurse both children. Uses the next links already set on this level.", nn(
`function connect(root) {
  if (!root || !root.left) return root;
  root.left.next = root.right;
  if (root.next) root.right.next = root.next.left;
  connect(root.left);
  connect(root.right);
  return root;
}`,
`def connect(root):
    if root is None or root.left is None:
        return root
    root.left.next = root.right
    if root.next:
        root.right.next = root.next.left
    connect(root.left)
    connect(root.right)
    return root`,
`    public Node connect(Node root) {
        if (root == null || root.left == null) return root;
        root.left.next = root.right;
        if (root.next != null) root.right.next = root.next.left;
        connect(root.left);
        connect(root.right);
        return root;
    }`,
`Node* connect(Node* root) {
    if (!root || !root->left) return root;
    root->left->next = root->right;
    if (root->next) root->right->next = root->next->left;
    connect(root->left);
    connect(root->right);
    return root;
}`,
`struct Node* connect(struct Node* root) {
    if (!root || !root->left) return root;
    root->left->next = root->right;
    if (root->next) root->right->next = root->next->left;
    connect(root->left);
    connect(root->right);
    return root;
}`
    )),
    sol("More optimal", "O(n)", "O(1)", "Iterative: leftmost starts at root. Walk the level via next. Wire children, then leftmost = leftmost.left. No recursion, no queue.", nn(
`function connect(root) {
  if (!root) return null;
  let leftmost = root;
  while (leftmost.left) {
    let cur = leftmost;
    while (cur) {
      cur.left.next = cur.right;
      if (cur.next) cur.right.next = cur.next.left;
      cur = cur.next;
    }
    leftmost = leftmost.left;
  }
  return root;
}`,
`def connect(root):
    if root is None:
        return None
    leftmost = root
    while leftmost.left:
        cur = leftmost
        while cur:
            cur.left.next = cur.right
            if cur.next:
                cur.right.next = cur.next.left
            cur = cur.next
        leftmost = leftmost.left
    return root`,
`    public Node connect(Node root) {
        if (root == null) return null;
        Node leftmost = root;
        while (leftmost.left != null) {
            Node cur = leftmost;
            while (cur != null) {
                cur.left.next = cur.right;
                if (cur.next != null) cur.right.next = cur.next.left;
                cur = cur.next;
            }
            leftmost = leftmost.left;
        }
        return root;
    }`,
`Node* connect(Node* root) {
    if (!root) return nullptr;
    Node* leftmost = root;
    while (leftmost->left) {
        Node* cur = leftmost;
        while (cur) {
            cur->left->next = cur->right;
            if (cur->next) cur->right->next = cur->next->left;
            cur = cur->next;
        }
        leftmost = leftmost->left;
    }
    return root;
}`,
`struct Node* connect(struct Node* root) {
    struct Node* leftmost;
    struct Node* cur;
    if (!root) return NULL;
    leftmost = root;
    while (leftmost->left) {
        cur = leftmost;
        while (cur) {
            cur->left->next = cur->right;
            if (cur->next) cur->right->next = cur->next->left;
            cur = cur->next;
        }
        leftmost = leftmost->left;
    }
    return root;
}`
    ))
  ]
});

questions.push({
  id: 28,
  level: "intermediate",
  q: "All Nodes Distance K in Binary Tree",
  ask: "Amazon · Google · Meta · Microsoft",
  links: [LC("all-nodes-distance-k-in-binary-tree"), GFG_ART("print-nodes-distance-k-given-node-binary-tree")],
  a: "Return every node value that is exactly K edges away from target. Edges go to children and to the parent, so you need parent pointers or an undirected graph.\n\nBuild parent map with a DFS/BFS, then BFS from target, stopping at distance K.\n\nBrute converts the tree to an adjacency list. Optimal parent map + BFS. More optimal DFS that returns distance to target and explores the other side when it knows how far the target is.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n)", "O(n)", "Undirected graph of val->neighbors (vals are unique on LC). BFS from target.val for K steps.", tn(
`function distanceK(root, target, k) {
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
  const q = [[target.val, 0]];
  seen[target.val] = true;
  const out = [];
  while (q.length) {
    const pair = q.shift();
    const u = pair[0], d = pair[1];
    if (d === k) { out.push(u); continue; }
    const nbrs = g[u] || [];
    for (let i = 0; i < nbrs.length; i++) {
      if (seen[nbrs[i]]) continue;
      seen[nbrs[i]] = true;
      q.push([nbrs[i], d + 1]);
    }
  }
  return out;
}`,
`def distance_k(root, target, k):
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
    seen = {target.val}
    q = deque([(target.val, 0)])
    out = []
    while q:
        u, d = q.popleft()
        if d == k:
            out.append(u)
            continue
        for v in g[u]:
            if v not in seen:
                seen.add(v)
                q.append((v, d + 1))
    return out`,
`    public List<Integer> distanceK(TreeNode root, TreeNode target, int k) {
        Map<Integer, List<Integer>> g = new HashMap<Integer, List<Integer>>();
        build(root, g);
        Set<Integer> seen = new HashSet<Integer>();
        Queue<int[]> q = new ArrayDeque<int[]>();
        q.add(new int[]{target.val, 0});
        seen.add(target.val);
        List<Integer> out = new ArrayList<Integer>();
        while (!q.isEmpty()) {
            int[] p = q.poll();
            if (p[1] == k) { out.add(p[0]); continue; }
            for (int v : g.getOrDefault(p[0], Collections.emptyList())) {
                if (seen.add(v)) q.add(new int[]{v, p[1] + 1});
            }
        }
        return out;
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
`void buildG(TreeNode* node, unordered_map<int, vector<int>>& g) {
    if (!node) return;
    if (node->left) {
        g[node->val].push_back(node->left->val);
        g[node->left->val].push_back(node->val);
        buildG(node->left, g);
    }
    if (node->right) {
        g[node->val].push_back(node->right->val);
        g[node->right->val].push_back(node->val);
        buildG(node->right, g);
    }
}
vector<int> distanceK(TreeNode* root, TreeNode* target, int k) {
    unordered_map<int, vector<int>> g;
    buildG(root, g);
    unordered_set<int> seen;
    queue<pair<int,int>> q;
    q.push({target->val, 0});
    seen.insert(target->val);
    vector<int> out;
    while (!q.empty()) {
        auto [u, d] = q.front(); q.pop();
        if (d == k) { out.push_back(u); continue; }
        for (int v : g[u]) if (!seen.count(v)) { seen.insert(v); q.push({v, d + 1}); }
    }
    return out;
}`,
`void addEdge(int u, int v, int adj[][8], int* deg) {
    adj[u][deg[u]++] = v;
    adj[v][deg[v]++] = u;
}
void buildG(struct Node* node, int adj[][8], int* deg) {
    if (!node) return;
    if (node->left) { addEdge(node->val, node->left->val, adj, deg); buildG(node->left, adj, deg); }
    if (node->right) { addEdge(node->val, node->right->val, adj, deg); buildG(node->right, adj, deg); }
}
int* distanceK(struct Node* root, struct Node* target, int k, int* returnSize) {
    static int adj[600][8], deg[600], seen[600], qv[600], qd[600], out[600];
    int qs = 0, qe = 0, n = 0, i;
    for (i = 0; i < 600; i++) { deg[i] = 0; seen[i] = 0; }
    buildG(root, adj, deg);
    qv[qe] = target->val; qd[qe++] = 0; seen[target->val] = 1;
    while (qs < qe) {
        int u = qv[qs], d = qd[qs++];
        if (d == k) { out[n++] = u; continue; }
        for (i = 0; i < deg[u]; i++) {
            int v = adj[u][i];
            if (seen[v]) continue;
            seen[v] = 1;
            qv[qe] = v; qd[qe++] = d + 1;
        }
    }
    *returnSize = n;
    return out;
}`
    )),
    sol("Optimal", "O(n)", "O(n)", "Parent map from nodes (not values). BFS from the target node with a visited set of pointers. Collect at distance k.", tn(
`function distanceK(root, target, k) {
  const parent = new Map();
  function mark(node, p) {
    if (!node) return;
    parent.set(node, p);
    mark(node.left, node);
    mark(node.right, node);
  }
  mark(root, null);
  const seen = new Set();
  const q = [[target, 0]];
  seen.add(target);
  const out = [];
  while (q.length) {
    const pair = q.shift();
    const node = pair[0], d = pair[1];
    if (d === k) { out.push(node.val); continue; }
    const nbr = [node.left, node.right, parent.get(node)];
    for (let i = 0; i < 3; i++) {
      const nx = nbr[i];
      if (!nx || seen.has(nx)) continue;
      seen.add(nx);
      q.push([nx, d + 1]);
    }
  }
  return out;
}`,
`def distance_k(root, target, k):
    from collections import deque
    parent = {}
    def mark(node, p):
        if node is None:
            return
        parent[node] = p
        mark(node.left, node)
        mark(node.right, node)
    mark(root, None)
    seen = {target}
    q = deque([(target, 0)])
    out = []
    while q:
        node, d = q.popleft()
        if d == k:
            out.append(node.val)
            continue
        for nx in (node.left, node.right, parent.get(node)):
            if nx is not None and nx not in seen:
                seen.add(nx)
                q.append((nx, d + 1))
    return out`,
`    Map<TreeNode, TreeNode> parent = new HashMap<TreeNode, TreeNode>();
    void mark(TreeNode node, TreeNode p) {
        if (node == null) return;
        parent.put(node, p);
        mark(node.left, node);
        mark(node.right, node);
    }
    public List<Integer> distanceK(TreeNode root, TreeNode target, int k) {
        mark(root, null);
        Set<TreeNode> seen = new HashSet<TreeNode>();
        Queue<TreeNode> q = new ArrayDeque<TreeNode>();
        Queue<Integer> dq = new ArrayDeque<Integer>();
        q.add(target); dq.add(0); seen.add(target);
        List<Integer> out = new ArrayList<Integer>();
        while (!q.isEmpty()) {
            TreeNode node = q.poll();
            int d = dq.poll();
            if (d == k) { out.add(node.val); continue; }
            TreeNode[] nbr = {node.left, node.right, parent.get(node)};
            for (TreeNode nx : nbr) {
                if (nx == null || !seen.add(nx)) continue;
                q.add(nx); dq.add(d + 1);
            }
        }
        return out;
    }`,
`void markP(TreeNode* node, TreeNode* p, unordered_map<TreeNode*, TreeNode*>& parent) {
    if (!node) return;
    parent[node] = p;
    markP(node->left, node, parent);
    markP(node->right, node, parent);
}
vector<int> distanceK(TreeNode* root, TreeNode* target, int k) {
    unordered_map<TreeNode*, TreeNode*> parent;
    markP(root, nullptr, parent);
    unordered_set<TreeNode*> seen;
    queue<pair<TreeNode*, int>> q;
    q.push({target, 0});
    seen.insert(target);
    vector<int> out;
    while (!q.empty()) {
        auto [node, d] = q.front(); q.pop();
        if (d == k) { out.push_back(node->val); continue; }
        TreeNode* nbr[3] = {node->left, node->right, parent[node]};
        for (int i = 0; i < 3; i++) {
            TreeNode* nx = nbr[i];
            if (!nx || seen.count(nx)) continue;
            seen.insert(nx);
            q.push({nx, d + 1});
        }
    }
    return out;
}`,
`struct Pair { struct Node* node; struct Node* p; };
void markP(struct Node* node, struct Node* p, struct Pair* par, int* n) {
    if (!node) return;
    par[*n].node = node; par[*n].p = p; (*n)++;
    markP(node->left, node, par, n);
    markP(node->right, node, par, n);
}
struct Node* findP(struct Pair* par, int n, struct Node* x) {
    int i;
    for (i = 0; i < n; i++) if (par[i].node == x) return par[i].p;
    return NULL;
}
int containsN(struct Node** a, int n, struct Node* x) {
    int i;
    for (i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}
int* distanceK(struct Node* root, struct Node* target, int k, int* returnSize) {
    static struct Pair par[10005];
    static struct Node* qn[10005];
    static struct Node* seen[10005];
    static int qd[10005], out[10005];
    int pn = 0, qs = 0, qe = 0, sn = 0, n = 0, i;
    struct Node* nbr[3];
    markP(root, NULL, par, &pn);
    qn[qe] = target; qd[qe++] = 0; seen[sn++] = target;
    while (qs < qe) {
        struct Node* node = qn[qs];
        int d = qd[qs++];
        if (d == k) { out[n++] = node->val; continue; }
        nbr[0] = node->left; nbr[1] = node->right; nbr[2] = findP(par, pn, node);
        for (i = 0; i < 3; i++) {
            if (!nbr[i] || containsN(seen, sn, nbr[i])) continue;
            seen[sn++] = nbr[i];
            qn[qe] = nbr[i]; qd[qe++] = d + 1;
        }
    }
    *returnSize = n;
    return out;
}`
    )),
    sol("More optimal", "O(n)", "O(n)", "DFS returns distance from this subtree to target, or -1. When a child reports dist, walk the other child at k - dist - 2, and maybe record this node. Downward walk from target collects depth k.", tn(
`function distanceK(root, target, k) {
  const out = [];
  function collect(node, dist) {
    if (!node || dist < 0) return;
    if (dist === 0) { out.push(node.val); return; }
    collect(node.left, dist - 1);
    collect(node.right, dist - 1);
  }
  function dfs(node) {
    if (!node) return -1;
    if (node === target) {
      collect(node, k);
      return 0;
    }
    const L = dfs(node.left);
    if (L >= 0) {
      if (L + 1 === k) out.push(node.val);
      else collect(node.right, k - L - 2);
      return L + 1;
    }
    const R = dfs(node.right);
    if (R >= 0) {
      if (R + 1 === k) out.push(node.val);
      else collect(node.left, k - R - 2);
      return R + 1;
    }
    return -1;
  }
  dfs(root);
  return out;
}`,
`def distance_k(root, target, k):
    out = []
    def collect(node, dist):
        if node is None or dist < 0:
            return
        if dist == 0:
            out.append(node.val)
            return
        collect(node.left, dist - 1)
        collect(node.right, dist - 1)
    def dfs(node):
        if node is None:
            return -1
        if node is target:
            collect(node, k)
            return 0
        left = dfs(node.left)
        if left >= 0:
            if left + 1 == k:
                out.append(node.val)
            else:
                collect(node.right, k - left - 2)
            return left + 1
        right = dfs(node.right)
        if right >= 0:
            if right + 1 == k:
                out.append(node.val)
            else:
                collect(node.left, k - right - 2)
            return right + 1
        return -1
    dfs(root)
    return out`,
`    List<Integer> out;
    void collect(TreeNode node, int dist) {
        if (node == null || dist < 0) return;
        if (dist == 0) { out.add(node.val); return; }
        collect(node.left, dist - 1);
        collect(node.right, dist - 1);
    }
    int dfs(TreeNode node, TreeNode target, int k) {
        if (node == null) return -1;
        if (node == target) { collect(node, k); return 0; }
        int L = dfs(node.left, target, k);
        if (L >= 0) {
            if (L + 1 == k) out.add(node.val);
            else collect(node.right, k - L - 2);
            return L + 1;
        }
        int R = dfs(node.right, target, k);
        if (R >= 0) {
            if (R + 1 == k) out.add(node.val);
            else collect(node.left, k - R - 2);
            return R + 1;
        }
        return -1;
    }
    public List<Integer> distanceK(TreeNode root, TreeNode target, int k) {
        out = new ArrayList<Integer>();
        dfs(root, target, k);
        return out;
    }`,
`void collect(TreeNode* node, int dist, vector<int>& out) {
    if (!node || dist < 0) return;
    if (dist == 0) { out.push_back(node->val); return; }
    collect(node->left, dist - 1, out);
    collect(node->right, dist - 1, out);
}
int dfsK(TreeNode* node, TreeNode* target, int k, vector<int>& out) {
    if (!node) return -1;
    if (node == target) { collect(node, k, out); return 0; }
    int L = dfsK(node->left, target, k, out);
    if (L >= 0) {
        if (L + 1 == k) out.push_back(node->val);
        else collect(node->right, k - L - 2, out);
        return L + 1;
    }
    int R = dfsK(node->right, target, k, out);
    if (R >= 0) {
        if (R + 1 == k) out.push_back(node->val);
        else collect(node->left, k - R - 2, out);
        return R + 1;
    }
    return -1;
}
vector<int> distanceK(TreeNode* root, TreeNode* target, int k) {
    vector<int> out;
    dfsK(root, target, k, out);
    return out;
}`,
`void collect(struct Node* node, int dist, int* out, int* n) {
    if (!node || dist < 0) return;
    if (dist == 0) { out[(*n)++] = node->val; return; }
    collect(node->left, dist - 1, out, n);
    collect(node->right, dist - 1, out, n);
}
int dfsK(struct Node* node, struct Node* target, int k, int* out, int* n) {
    int L, R;
    if (!node) return -1;
    if (node == target) { collect(node, k, out, n); return 0; }
    L = dfsK(node->left, target, k, out, n);
    if (L >= 0) {
        if (L + 1 == k) out[(*n)++] = node->val;
        else collect(node->right, k - L - 2, out, n);
        return L + 1;
    }
    R = dfsK(node->right, target, k, out, n);
    if (R >= 0) {
        if (R + 1 == k) out[(*n)++] = node->val;
        else collect(node->left, k - R - 2, out, n);
        return R + 1;
    }
    return -1;
}
int* distanceK(struct Node* root, struct Node* target, int k, int* returnSize) {
    static int out[10005];
    int n = 0;
    dfsK(root, target, k, out, &n);
    *returnSize = n;
    return out;
}`
    ))
  ]
});

module.exports = questions;
