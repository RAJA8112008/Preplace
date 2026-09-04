"use strict";
const { tn, sol, LC, GFG, GFG_ART, block, JS_TN, PY_TN, JAVA_TN, CPP_TN, C_TN } = require("./tree_meta.cjs");

const questions = [];

questions.push({
  id: 21,
  level: "intermediate",
  q: "Binary Tree Zigzag Level Order Traversal",
  ask: "Amazon · Microsoft · Meta · Bloomberg",
  links: [LC("binary-tree-zigzag-level-order-traversal"), GFG("zigzag-tree-traversal")],
  a: "Return node values by level, but alternate direction: left-to-right, then right-to-left, and so on.\n\nNormal BFS already groups by level. Reverse every odd row, or use a deque and flip which end you pop from.\n\nBrute is BFS then reverse odd rows. Optimal fills each row from the correct end with a deque. More optimal is DFS that inserts at depth, reversing later or inserting at index 0 on odd depths.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n)", "O(n)", "Level-order into lists. Reverse rows whose index is odd. Extra reverse pass per odd level.", tn(
`function zigzagLevelOrder(root) {
  if (!root) return [];
  const out = [];
  const q = [root];
  while (q.length) {
    const n = q.length;
    const row = [];
    for (let i = 0; i < n; i++) {
      const node = q.shift();
      row.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    if (out.length % 2 === 1) row.reverse();
    out.push(row);
  }
  return out;
}`,
`def zigzag_level_order(root):
    if root is None:
        return []
    from collections import deque
    out = []
    q = deque([root])
    while q:
        row = []
        for _ in range(len(q)):
            node = q.popleft()
            row.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        if len(out) % 2 == 1:
            row.reverse()
        out.append(row)
    return out`,
`    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> out = new ArrayList<List<Integer>>();
        if (root == null) return out;
        Queue<TreeNode> q = new ArrayDeque<TreeNode>();
        q.add(root);
        while (!q.isEmpty()) {
            int n = q.size();
            List<Integer> row = new ArrayList<Integer>();
            for (int i = 0; i < n; i++) {
                TreeNode node = q.poll();
                row.add(node.val);
                if (node.left != null) q.add(node.left);
                if (node.right != null) q.add(node.right);
            }
            if (out.size() % 2 == 1) Collections.reverse(row);
            out.add(row);
        }
        return out;
    }`,
`vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
    vector<vector<int>> out;
    if (!root) return out;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int n = (int)q.size();
        vector<int> row;
        for (int i = 0; i < n; i++) {
            TreeNode* node = q.front(); q.pop();
            row.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        if ((int)out.size() % 2 == 1) reverse(row.begin(), row.end());
        out.push_back(row);
    }
    return out;
}`,
`int** zigzagLevelOrder(struct Node* root, int* returnSize, int** returnColumnSizes) {
    static int rows[64][256];
    static int cols[64];
    static int* ptrs[64];
    struct Node* q[10005];
    int qs = 0, qe = 0, rc = 0, i;
    *returnSize = 0;
    if (!root) { *returnColumnSizes = cols; return ptrs; }
    q[qe++] = root;
    while (qs < qe) {
        int n = qe - qs;
        cols[rc] = n;
        for (i = 0; i < n; i++) {
            struct Node* node = q[qs++];
            rows[rc][i] = node->val;
            if (node->left) q[qe++] = node->left;
            if (node->right) q[qe++] = node->right;
        }
        if (rc % 2 == 1) {
            for (i = 0; i < n / 2; i++) {
                int t = rows[rc][i];
                rows[rc][i] = rows[rc][n - 1 - i];
                rows[rc][n - 1 - i] = t;
            }
        }
        ptrs[rc] = rows[rc];
        rc++;
    }
    *returnSize = rc;
    *returnColumnSizes = cols;
    return ptrs;
}`
    )),
    sol("Optimal", "O(n)", "O(n)", "Deque of nodes. Even levels poll from the front and offer children left-then-right at the back. Odd levels poll from the back and offer children right-then-left at the front.", tn(
`function zigzagLevelOrder(root) {
  if (!root) return [];
  const out = [];
  const dq = [root];
  let leftToRight = true;
  while (dq.length) {
    const n = dq.length;
    const row = [];
    for (let i = 0; i < n; i++) {
      if (leftToRight) {
        const node = dq.shift();
        row.push(node.val);
        if (node.left) dq.push(node.left);
        if (node.right) dq.push(node.right);
      } else {
        const node = dq.pop();
        row.push(node.val);
        if (node.right) dq.unshift(node.right);
        if (node.left) dq.unshift(node.left);
      }
    }
    out.push(row);
    leftToRight = !leftToRight;
  }
  return out;
}`,
`def zigzag_level_order(root):
    if root is None:
        return []
    from collections import deque
    out = []
    dq = deque([root])
    left_to_right = True
    while dq:
        row = []
        for _ in range(len(dq)):
            if left_to_right:
                node = dq.popleft()
                row.append(node.val)
                if node.left:
                    dq.append(node.left)
                if node.right:
                    dq.append(node.right)
            else:
                node = dq.pop()
                row.append(node.val)
                if node.right:
                    dq.appendleft(node.right)
                if node.left:
                    dq.appendleft(node.left)
        out.append(row)
        left_to_right = not left_to_right
    return out`,
`    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> out = new ArrayList<List<Integer>>();
        if (root == null) return out;
        Deque<TreeNode> dq = new ArrayDeque<TreeNode>();
        dq.add(root);
        boolean leftToRight = true;
        while (!dq.isEmpty()) {
            int n = dq.size();
            List<Integer> row = new ArrayList<Integer>();
            for (int i = 0; i < n; i++) {
                if (leftToRight) {
                    TreeNode node = dq.pollFirst();
                    row.add(node.val);
                    if (node.left != null) dq.addLast(node.left);
                    if (node.right != null) dq.addLast(node.right);
                } else {
                    TreeNode node = dq.pollLast();
                    row.add(node.val);
                    if (node.right != null) dq.addFirst(node.right);
                    if (node.left != null) dq.addFirst(node.left);
                }
            }
            out.add(row);
            leftToRight = !leftToRight;
        }
        return out;
    }`,
`vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
    vector<vector<int>> out;
    if (!root) return out;
    deque<TreeNode*> dq;
    dq.push_back(root);
    bool leftToRight = true;
    while (!dq.empty()) {
        int n = (int)dq.size();
        vector<int> row;
        for (int i = 0; i < n; i++) {
            if (leftToRight) {
                TreeNode* node = dq.front(); dq.pop_front();
                row.push_back(node->val);
                if (node->left) dq.push_back(node->left);
                if (node->right) dq.push_back(node->right);
            } else {
                TreeNode* node = dq.back(); dq.pop_back();
                row.push_back(node->val);
                if (node->right) dq.push_front(node->right);
                if (node->left) dq.push_front(node->left);
            }
        }
        out.push_back(row);
        leftToRight = !leftToRight;
    }
    return out;
}`,
`int** zigzagLevelOrder(struct Node* root, int* returnSize, int** returnColumnSizes) {
    static int rows[64][256];
    static int cols[64];
    static int* ptrs[64];
    struct Node* dq[10005];
    int head = 5000, tail = 5000, rc = 0, leftToRight = 1, i;
    *returnSize = 0;
    if (!root) { *returnColumnSizes = cols; return ptrs; }
    dq[tail++] = root;
    while (head < tail) {
        int n = tail - head;
        cols[rc] = n;
        for (i = 0; i < n; i++) {
            struct Node* node;
            if (leftToRight) node = dq[head++];
            else node = dq[--tail];
            rows[rc][i] = node->val;
            if (leftToRight) {
                if (node->left) dq[tail++] = node->left;
                if (node->right) dq[tail++] = node->right;
            } else {
                if (node->right) dq[--head] = node->right;
                if (node->left) dq[--head] = node->left;
            }
        }
        ptrs[rc] = rows[rc];
        rc++;
        leftToRight = !leftToRight;
    }
    *returnSize = rc;
    *returnColumnSizes = cols;
    return ptrs;
}`
    )),
    sol("More optimal", "O(n)", "O(h)", "DFS with depth. Append a new list when you first reach a depth. Push on even depths, unshift on odd depths. Recursion stack only.", tn(
`function zigzagLevelOrder(root) {
  const out = [];
  function go(node, d) {
    if (!node) return;
    if (d === out.length) out.push([]);
    if (d % 2 === 0) out[d].push(node.val);
    else out[d].unshift(node.val);
    go(node.left, d + 1);
    go(node.right, d + 1);
  }
  go(root, 0);
  return out;
}`,
`def zigzag_level_order(root):
    out = []
    def go(node, d):
        if node is None:
            return
        if d == len(out):
            out.append([])
        if d % 2 == 0:
            out[d].append(node.val)
        else:
            out[d].insert(0, node.val)
        go(node.left, d + 1)
        go(node.right, d + 1)
    go(root, 0)
    return out`,
`    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> out = new ArrayList<List<Integer>>();
        go(root, 0, out);
        return out;
    }
    void go(TreeNode node, int d, List<List<Integer>> out) {
        if (node == null) return;
        if (d == out.size()) out.add(new ArrayList<Integer>());
        if (d % 2 == 0) out.get(d).add(node.val);
        else out.get(d).add(0, node.val);
        go(node.left, d + 1, out);
        go(node.right, d + 1, out);
    }`,
`void goZig(TreeNode* node, int d, vector<vector<int>>& out) {
    if (!node) return;
    if (d == (int)out.size()) out.push_back({});
    if (d % 2 == 0) out[d].push_back(node->val);
    else out[d].insert(out[d].begin(), node->val);
    goZig(node->left, d + 1, out);
    goZig(node->right, d + 1, out);
}
vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
    vector<vector<int>> out;
    goZig(root, 0, out);
    return out;
}`,
`void goZig(struct Node* node, int d, int rows[][256], int* cols, int* rc) {
    if (!node) return;
    if (d == *rc) { cols[d] = 0; (*rc)++; }
    if (d % 2 == 0) rows[d][cols[d]++] = node->val;
    else {
        int i;
        for (i = cols[d]; i > 0; i--) rows[d][i] = rows[d][i - 1];
        rows[d][0] = node->val;
        cols[d]++;
    }
    goZig(node->left, d + 1, rows, cols, rc);
    goZig(node->right, d + 1, rows, cols, rc);
}
int** zigzagLevelOrder(struct Node* root, int* returnSize, int** returnColumnSizes) {
    static int rows[64][256];
    static int cols[64];
    static int* ptrs[64];
    int rc = 0, i;
    goZig(root, 0, rows, cols, &rc);
    for (i = 0; i < rc; i++) ptrs[i] = rows[i];
    *returnSize = rc;
    *returnColumnSizes = cols;
    return ptrs;
}`
    ))
  ]
});

questions.push({
  id: 22,
  level: "intermediate",
  q: "Binary Tree Vertical Order Traversal",
  ask: "Meta · Amazon · Microsoft · Google",
  links: [LC("vertical-order-traversal-of-a-binary-tree"), GFG("print-a-binary-tree-in-vertical-order")],
  a: "Group nodes by column (horizontal distance). Root is column 0, left is -1, right is +1. Within a column, go top to bottom; LeetCode also sorts by value when two nodes share a row and column. GFG prints left-to-right in BFS order without that extra sort.\n\nBrute DFS records (col, row, val) then sorts. Optimal BFS into a map of columns. More optimal tracks min/max column and uses an array instead of a tree map.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n log n)", "O(n)", "DFS push [col, row, val]. Sort by col, then row, then val. Group into lists. Matches LeetCode 987.", tn(
`function verticalTraversal(root) {
  const items = [];
  function go(node, row, col) {
    if (!node) return;
    items.push([col, row, node.val]);
    go(node.left, row + 1, col - 1);
    go(node.right, row + 1, col + 1);
  }
  go(root, 0, 0);
  items.sort(function (a, b) {
    if (a[0] !== b[0]) return a[0] - b[0];
    if (a[1] !== b[1]) return a[1] - b[1];
    return a[2] - b[2];
  });
  const out = [];
  for (let i = 0; i < items.length; i++) {
    if (!out.length || items[i][0] !== items[i - 1][0]) out.push([]);
    out[out.length - 1].push(items[i][2]);
  }
  return out;
}`,
`def vertical_traversal(root):
    items = []
    def go(node, row, col):
        if node is None:
            return
        items.append((col, row, node.val))
        go(node.left, row + 1, col - 1)
        go(node.right, row + 1, col + 1)
    go(root, 0, 0)
    items.sort()
    out = []
    prev = None
    for col, row, val in items:
        if prev != col:
            out.append([])
            prev = col
        out[-1].append(val)
    return out`,
`    public List<List<Integer>> verticalTraversal(TreeNode root) {
        List<int[]> items = new ArrayList<int[]>();
        go(root, 0, 0, items);
        items.sort((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] != b[1] ? a[1] - b[1] : a[2] - b[2]);
        List<List<Integer>> out = new ArrayList<List<Integer>>();
        Integer prev = null;
        for (int[] it : items) {
            if (prev == null || it[0] != prev) { out.add(new ArrayList<Integer>()); prev = it[0]; }
            out.get(out.size() - 1).add(it[2]);
        }
        return out;
    }
    void go(TreeNode node, int row, int col, List<int[]> items) {
        if (node == null) return;
        items.add(new int[]{col, row, node.val});
        go(node.left, row + 1, col - 1, items);
        go(node.right, row + 1, col + 1, items);
    }`,
`vector<vector<int>> verticalTraversal(TreeNode* root) {
    vector<array<int,3>> items;
    function<void(TreeNode*,int,int)> go = [&](TreeNode* node, int row, int col) {
        if (!node) return;
        items.push_back({col, row, node->val});
        go(node->left, row + 1, col - 1);
        go(node->right, row + 1, col + 1);
    };
    go(root, 0, 0);
    sort(items.begin(), items.end());
    vector<vector<int>> out;
    int prev = INT_MIN, started = 0;
    for (auto& it : items) {
        if (!started || it[0] != prev) { out.push_back({}); prev = it[0]; started = 1; }
        out.back().push_back(it[2]);
    }
    return out;
}`,
`typedef struct { int col, row, val; } Item;
int cmpItem(const void* a, const void* b) {
    const Item* x = (const Item*)a, *y = (const Item*)b;
    if (x->col != y->col) return x->col - y->col;
    if (x->row != y->row) return x->row - y->row;
    return x->val - y->val;
}
void goItems(struct Node* node, int row, int col, Item* items, int* n) {
    if (!node) return;
    items[*n].col = col; items[*n].row = row; items[*n].val = node->val; (*n)++;
    goItems(node->left, row + 1, col - 1, items, n);
    goItems(node->right, row + 1, col + 1, items, n);
}
int** verticalTraversal(struct Node* root, int* returnSize, int** returnColumnSizes) {
    static Item items[10005];
    static int rows[400][64];
    static int cols[400];
    static int* ptrs[400];
    int n = 0, rc = 0, i, prev, started = 0;
    goItems(root, 0, 0, items, &n);
    qsort(items, n, sizeof(Item), cmpItem);
    for (i = 0; i < n; i++) {
        if (!started || items[i].col != prev) { cols[rc] = 0; prev = items[i].col; started = 1; rc++; }
        rows[rc - 1][cols[rc - 1]++] = items[i].val;
    }
    for (i = 0; i < rc; i++) ptrs[i] = rows[i];
    *returnSize = rc;
    *returnColumnSizes = cols;
    return ptrs;
}`
    )),
    sol("Optimal", "O(n log w)", "O(n)", "BFS so row order is natural. TreeMap / sorted map of columns. GFG order (no value sort). w is the number of columns.", tn(
`function verticalOrder(root) {
  if (!root) return [];
  const cols = {};
  let minH = 0, maxH = 0;
  const q = [[root, 0]];
  while (q.length) {
    const pair = q.shift();
    const node = pair[0], hd = pair[1];
    if (!cols[hd]) cols[hd] = [];
    cols[hd].push(node.val);
    if (hd < minH) minH = hd;
    if (hd > maxH) maxH = hd;
    if (node.left) q.push([node.left, hd - 1]);
    if (node.right) q.push([node.right, hd + 1]);
  }
  const out = [];
  for (let h = minH; h <= maxH; h++) out.push(cols[h]);
  return out;
}`,
`def vertical_order(root):
    if root is None:
        return []
    from collections import deque, defaultdict
    cols = defaultdict(list)
    min_h = max_h = 0
    q = deque([(root, 0)])
    while q:
        node, hd = q.popleft()
        cols[hd].append(node.val)
        min_h = min(min_h, hd)
        max_h = max(max_h, hd)
        if node.left:
            q.append((node.left, hd - 1))
        if node.right:
            q.append((node.right, hd + 1))
    return [cols[h] for h in range(min_h, max_h + 1)]`,
`    public List<List<Integer>> verticalOrder(TreeNode root) {
        List<List<Integer>> out = new ArrayList<List<Integer>>();
        if (root == null) return out;
        TreeMap<Integer, List<Integer>> cols = new TreeMap<Integer, List<Integer>>();
        Queue<TreeNode> nq = new ArrayDeque<TreeNode>();
        Queue<Integer> hq = new ArrayDeque<Integer>();
        nq.add(root); hq.add(0);
        while (!nq.isEmpty()) {
            TreeNode node = nq.poll();
            int hd = hq.poll();
            cols.computeIfAbsent(hd, k -> new ArrayList<Integer>()).add(node.val);
            if (node.left != null) { nq.add(node.left); hq.add(hd - 1); }
            if (node.right != null) { nq.add(node.right); hq.add(hd + 1); }
        }
        out.addAll(cols.values());
        return out;
    }`,
`vector<vector<int>> verticalOrder(TreeNode* root) {
    vector<vector<int>> out;
    if (!root) return out;
    map<int, vector<int>> cols;
    queue<pair<TreeNode*, int>> q;
    q.push({root, 0});
    while (!q.empty()) {
        auto [node, hd] = q.front(); q.pop();
        cols[hd].push_back(node->val);
        if (node->left) q.push({node->left, hd - 1});
        if (node->right) q.push({node->right, hd + 1});
    }
    for (auto& kv : cols) out.push_back(kv.second);
    return out;
}`,
`int** verticalOrder(struct Node* root, int* returnSize, int** returnColumnSizes) {
    static int bucket[8005][64];
    static int bn[8005];
    static int rows[400][64];
    static int cols[400];
    static int* ptrs[400];
    struct Node* qn[10005];
    int qh[10005], qs = 0, qe = 0, minH = 0, maxH = 0, off = 4000, i, h, rc;
    *returnSize = 0;
    if (!root) { *returnColumnSizes = cols; return ptrs; }
    for (i = 0; i < 8005; i++) bn[i] = 0;
    qn[qe] = root; qh[qe++] = 0;
    while (qs < qe) {
        struct Node* node = qn[qs];
        int hd = qh[qs++];
        bucket[hd + off][bn[hd + off]++] = node->val;
        if (hd < minH) minH = hd;
        if (hd > maxH) maxH = hd;
        if (node->left) { qn[qe] = node->left; qh[qe++] = hd - 1; }
        if (node->right) { qn[qe] = node->right; qh[qe++] = hd + 1; }
    }
    rc = 0;
    for (h = minH; h <= maxH; h++) {
        cols[rc] = bn[h + off];
        for (i = 0; i < bn[h + off]; i++) rows[rc][i] = bucket[h + off][i];
        ptrs[rc] = rows[rc];
        rc++;
    }
    *returnSize = rc;
    *returnColumnSizes = cols;
    return ptrs;
}`
    )),
    sol("More optimal", "O(n)", "O(n)", "Same BFS. Record min and max hd, then emit columns in a plain loop. No log w map.", tn(
`function verticalOrder(root) {
  if (!root) return [];
  const nodes = [root];
  const hds = [0];
  let minH = 0, maxH = 0;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i], hd = hds[i];
    if (hd < minH) minH = hd;
    if (hd > maxH) maxH = hd;
    if (node.left) { nodes.push(node.left); hds.push(hd - 1); }
    if (node.right) { nodes.push(node.right); hds.push(hd + 1); }
  }
  const out = [];
  for (let h = minH; h <= maxH; h++) out.push([]);
  for (let i = 0; i < nodes.length; i++) out[hds[i] - minH].push(nodes[i].val);
  return out;
}`,
`def vertical_order(root):
    if root is None:
        return []
    nodes = [root]
    hds = [0]
    min_h = max_h = 0
    i = 0
    while i < len(nodes):
        node, hd = nodes[i], hds[i]
        min_h = min(min_h, hd)
        max_h = max(max_h, hd)
        if node.left:
            nodes.append(node.left)
            hds.append(hd - 1)
        if node.right:
            nodes.append(node.right)
            hds.append(hd + 1)
        i += 1
    out = [[] for _ in range(max_h - min_h + 1)]
    for node, hd in zip(nodes, hds):
        out[hd - min_h].append(node.val)
    return out`,
`    public List<List<Integer>> verticalOrder(TreeNode root) {
        List<List<Integer>> out = new ArrayList<List<Integer>>();
        if (root == null) return out;
        List<TreeNode> nodes = new ArrayList<TreeNode>();
        List<Integer> hds = new ArrayList<Integer>();
        nodes.add(root); hds.add(0);
        int minH = 0, maxH = 0;
        for (int i = 0; i < nodes.size(); i++) {
            TreeNode node = nodes.get(i);
            int hd = hds.get(i);
            minH = Math.min(minH, hd);
            maxH = Math.max(maxH, hd);
            if (node.left != null) { nodes.add(node.left); hds.add(hd - 1); }
            if (node.right != null) { nodes.add(node.right); hds.add(hd + 1); }
        }
        for (int h = minH; h <= maxH; h++) out.add(new ArrayList<Integer>());
        for (int i = 0; i < nodes.size(); i++) out.get(hds.get(i) - minH).add(nodes.get(i).val);
        return out;
    }`,
`vector<vector<int>> verticalOrder(TreeNode* root) {
    vector<vector<int>> out;
    if (!root) return out;
    vector<TreeNode*> nodes = {root};
    vector<int> hds = {0};
    int minH = 0, maxH = 0;
    for (int i = 0; i < (int)nodes.size(); i++) {
        int hd = hds[i];
        minH = min(minH, hd);
        maxH = max(maxH, hd);
        if (nodes[i]->left) { nodes.push_back(nodes[i]->left); hds.push_back(hd - 1); }
        if (nodes[i]->right) { nodes.push_back(nodes[i]->right); hds.push_back(hd + 1); }
    }
    out.assign(maxH - minH + 1, {});
    for (int i = 0; i < (int)nodes.size(); i++) out[hds[i] - minH].push_back(nodes[i]->val);
    return out;
}`,
`int** verticalOrder(struct Node* root, int* returnSize, int** returnColumnSizes) {
    static int rows[400][64];
    static int cols[400];
    static int* ptrs[400];
    struct Node* nodes[10005];
    int hds[10005], n = 0, i, minH = 0, maxH = 0, rc;
    *returnSize = 0;
    if (!root) { *returnColumnSizes = cols; return ptrs; }
    nodes[n] = root; hds[n++] = 0;
    for (i = 0; i < n; i++) {
        if (hds[i] < minH) minH = hds[i];
        if (hds[i] > maxH) maxH = hds[i];
        if (nodes[i]->left) { nodes[n] = nodes[i]->left; hds[n++] = hds[i] - 1; }
        if (nodes[i]->right) { nodes[n] = nodes[i]->right; hds[n++] = hds[i] + 1; }
    }
    rc = maxH - minH + 1;
    for (i = 0; i < rc; i++) cols[i] = 0;
    for (i = 0; i < n; i++) rows[hds[i] - minH][cols[hds[i] - minH]++] = nodes[i]->val;
    for (i = 0; i < rc; i++) ptrs[i] = rows[i];
    *returnSize = rc;
    *returnColumnSizes = cols;
    return ptrs;
}`
    ))
  ]
});

module.exports = questions;
