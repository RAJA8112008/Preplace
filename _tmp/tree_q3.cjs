"use strict";
const { tn, sol, LC, GFG, GFG_ART, block, JS_TN, PY_TN, JAVA_TN, CPP_TN, C_TN, JS_NN, PY_NN, JAVA_NN, CPP_NN, C_NN } = require("./tree_meta.cjs");

const questions = [];

questions.push({
  id: 25,
  level: "intermediate",
  q: "Top View of Binary Tree",
  ask: "Amazon · Microsoft · Adobe",
  links: [GFG("top-view-of-binary-tree"), GFG_ART("print-nodes-top-view-binary-tree")],
  a: "Standing above the tree, you see the first node at each horizontal distance. Root is hd 0. Left child hd-1, right hd+1. If two nodes share an hd, the shallower one wins.\n\nBFS from the root visits shallow nodes first, so the first time you see an hd is the top view. DFS must also track depth and keep the smaller depth.\n\nBrute stores (hd, depth, val) and picks min depth. Optimal BFS first-write. More optimal DFS with a depth map.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n log n)", "O(n)", "Collect every (hd, depth, val), sort, keep the first (smallest depth) per hd.", tn(
`function topView(root) {
  const items = [];
  function go(node, hd, d) {
    if (!node) return;
    items.push([hd, d, node.val]);
    go(node.left, hd - 1, d + 1);
    go(node.right, hd + 1, d + 1);
  }
  go(root, 0, 0);
  items.sort(function (a, b) {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1];
  });
  const out = [];
  let prev = null;
  for (let i = 0; i < items.length; i++) {
    if (prev === null || items[i][0] !== prev) {
      out.push(items[i][2]);
      prev = items[i][0];
    }
  }
  return out;
}`,
`def top_view(root):
    items = []
    def go(node, hd, d):
        if node is None:
            return
        items.append((hd, d, node.val))
        go(node.left, hd - 1, d + 1)
        go(node.right, hd + 1, d + 1)
    go(root, 0, 0)
    items.sort()
    out, prev = [], None
    for hd, d, val in items:
        if prev != hd:
            out.append(val)
            prev = hd
    return out`,
`    public List<Integer> topView(TreeNode root) {
        List<int[]> items = new ArrayList<int[]>();
        go(root, 0, 0, items);
        items.sort((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
        List<Integer> out = new ArrayList<Integer>();
        Integer prev = null;
        for (int[] it : items) {
            if (prev == null || it[0] != prev) { out.add(it[2]); prev = it[0]; }
        }
        return out;
    }
    void go(TreeNode node, int hd, int d, List<int[]> items) {
        if (node == null) return;
        items.add(new int[]{hd, d, node.val});
        go(node.left, hd - 1, d + 1, items);
        go(node.right, hd + 1, d + 1, items);
    }`,
`vector<int> topView(TreeNode* root) {
    vector<array<int,3>> items;
    function<void(TreeNode*,int,int)> go = [&](TreeNode* node, int hd, int d) {
        if (!node) return;
        items.push_back({hd, d, node->val});
        go(node->left, hd - 1, d + 1);
        go(node->right, hd + 1, d + 1);
    };
    go(root, 0, 0);
    sort(items.begin(), items.end());
    vector<int> out;
    int prev = INT_MIN, started = 0;
    for (auto& it : items) {
        if (!started || it[0] != prev) { out.push_back(it[2]); prev = it[0]; started = 1; }
    }
    return out;
}`,
`typedef struct { int hd, d, val; } Item;
int cmpItem(const void* a, const void* b) {
    const Item* x = (const Item*)a, *y = (const Item*)b;
    if (x->hd != y->hd) return x->hd - y->hd;
    return x->d - y->d;
}
void goItems(struct Node* node, int hd, int d, Item* items, int* n) {
    if (!node) return;
    items[*n].hd = hd; items[*n].d = d; items[*n].val = node->val; (*n)++;
    goItems(node->left, hd - 1, d + 1, items, n);
    goItems(node->right, hd + 1, d + 1, items, n);
}
int* topView(struct Node* root, int* returnSize) {
    static Item items[10005];
    static int out[10005];
    int n = 0, on = 0, i, prev, started = 0;
    goItems(root, 0, 0, items, &n);
    qsort(items, n, sizeof(Item), cmpItem);
    for (i = 0; i < n; i++) {
        if (!started || items[i].hd != prev) { out[on++] = items[i].val; prev = items[i].hd; started = 1; }
    }
    *returnSize = on;
    return out;
}`
    )),
    sol("Optimal", "O(n)", "O(n)", "BFS. The first time an hd appears, record it. Then emit from min hd to max hd.", tn(
`function topView(root) {
  if (!root) return [];
  const first = {};
  let minH = 0, maxH = 0;
  const q = [[root, 0]];
  while (q.length) {
    const pair = q.shift();
    const node = pair[0], hd = pair[1];
    if (first[hd] === undefined) first[hd] = node.val;
    if (hd < minH) minH = hd;
    if (hd > maxH) maxH = hd;
    if (node.left) q.push([node.left, hd - 1]);
    if (node.right) q.push([node.right, hd + 1]);
  }
  const out = [];
  for (let h = minH; h <= maxH; h++) out.push(first[h]);
  return out;
}`,
`def top_view(root):
    if root is None:
        return []
    from collections import deque
    first = {}
    min_h = max_h = 0
    q = deque([(root, 0)])
    while q:
        node, hd = q.popleft()
        if hd not in first:
            first[hd] = node.val
        min_h = min(min_h, hd)
        max_h = max(max_h, hd)
        if node.left:
            q.append((node.left, hd - 1))
        if node.right:
            q.append((node.right, hd + 1))
    return [first[h] for h in range(min_h, max_h + 1)]`,
`    public List<Integer> topView(TreeNode root) {
        List<Integer> out = new ArrayList<Integer>();
        if (root == null) return out;
        Map<Integer, Integer> first = new HashMap<Integer, Integer>();
        Queue<TreeNode> nq = new ArrayDeque<TreeNode>();
        Queue<Integer> hq = new ArrayDeque<Integer>();
        nq.add(root); hq.add(0);
        int minH = 0, maxH = 0;
        while (!nq.isEmpty()) {
            TreeNode node = nq.poll();
            int hd = hq.poll();
            first.putIfAbsent(hd, node.val);
            minH = Math.min(minH, hd);
            maxH = Math.max(maxH, hd);
            if (node.left != null) { nq.add(node.left); hq.add(hd - 1); }
            if (node.right != null) { nq.add(node.right); hq.add(hd + 1); }
        }
        for (int h = minH; h <= maxH; h++) out.add(first.get(h));
        return out;
    }`,
`vector<int> topView(TreeNode* root) {
    vector<int> out;
    if (!root) return out;
    map<int, int> first;
    queue<pair<TreeNode*, int>> q;
    q.push({root, 0});
    while (!q.empty()) {
        auto [node, hd] = q.front(); q.pop();
        if (!first.count(hd)) first[hd] = node->val;
        if (node->left) q.push({node->left, hd - 1});
        if (node->right) q.push({node->right, hd + 1});
    }
    for (auto& kv : first) out.push_back(kv.second);
    return out;
}`,
`int* topView(struct Node* root, int* returnSize) {
    static int first[8005];
    static int seen[8005];
    static int out[4005];
    struct Node* qn[10005];
    int qh[10005], qs = 0, qe = 0, minH = 0, maxH = 0, off = 4000, i, h, n;
    if (!root) { *returnSize = 0; return out; }
    for (i = 0; i < 8005; i++) seen[i] = 0;
    qn[qe] = root; qh[qe++] = 0;
    while (qs < qe) {
        struct Node* node = qn[qs];
        int hd = qh[qs++];
        if (!seen[hd + off]) { seen[hd + off] = 1; first[hd + off] = node->val; }
        if (hd < minH) minH = hd;
        if (hd > maxH) maxH = hd;
        if (node->left) { qn[qe] = node->left; qh[qe++] = hd - 1; }
        if (node->right) { qn[qe] = node->right; qh[qe++] = hd + 1; }
    }
    n = 0;
    for (h = minH; h <= maxH; h++) out[n++] = first[h + off];
    *returnSize = n;
    return out;
}`
    )),
    sol("More optimal", "O(n)", "O(n)", "DFS with depth. Keep a node for hd only if this depth is smaller. Then scan min..max hd. No queue.", tn(
`function topView(root) {
  const bestVal = {};
  const bestD = {};
  let minH = 0, maxH = 0;
  function go(node, hd, d) {
    if (!node) return;
    if (bestD[hd] === undefined || d < bestD[hd]) {
      bestD[hd] = d;
      bestVal[hd] = node.val;
    }
    if (hd < minH) minH = hd;
    if (hd > maxH) maxH = hd;
    go(node.left, hd - 1, d + 1);
    go(node.right, hd + 1, d + 1);
  }
  go(root, 0, 0);
  const out = [];
  for (let h = minH; h <= maxH; h++) out.push(bestVal[h]);
  return out;
}`,
`def top_view(root):
    best_val, best_d = {}, {}
    min_h = max_h = 0
    def go(node, hd, d):
        nonlocal min_h, max_h
        if node is None:
            return
        if hd not in best_d or d < best_d[hd]:
            best_d[hd] = d
            best_val[hd] = node.val
        min_h = min(min_h, hd)
        max_h = max(max_h, hd)
        go(node.left, hd - 1, d + 1)
        go(node.right, hd + 1, d + 1)
    go(root, 0, 0)
    return [best_val[h] for h in range(min_h, max_h + 1)] if root else []`,
`    Map<Integer, Integer> bestVal = new HashMap<Integer, Integer>();
    Map<Integer, Integer> bestD = new HashMap<Integer, Integer>();
    int minH, maxH;
    void go(TreeNode node, int hd, int d) {
        if (node == null) return;
        if (!bestD.containsKey(hd) || d < bestD.get(hd)) {
            bestD.put(hd, d);
            bestVal.put(hd, node.val);
        }
        minH = Math.min(minH, hd);
        maxH = Math.max(maxH, hd);
        go(node.left, hd - 1, d + 1);
        go(node.right, hd + 1, d + 1);
    }
    public List<Integer> topView(TreeNode root) {
        List<Integer> out = new ArrayList<Integer>();
        if (root == null) return out;
        minH = 0; maxH = 0;
        go(root, 0, 0);
        for (int h = minH; h <= maxH; h++) out.add(bestVal.get(h));
        return out;
    }`,
`void goTop(TreeNode* node, int hd, int d, unordered_map<int,int>& bestVal, unordered_map<int,int>& bestD, int& minH, int& maxH) {
    if (!node) return;
    if (!bestD.count(hd) || d < bestD[hd]) { bestD[hd] = d; bestVal[hd] = node->val; }
    minH = min(minH, hd);
    maxH = max(maxH, hd);
    goTop(node->left, hd - 1, d + 1, bestVal, bestD, minH, maxH);
    goTop(node->right, hd + 1, d + 1, bestVal, bestD, minH, maxH);
}
vector<int> topView(TreeNode* root) {
    vector<int> out;
    if (!root) return out;
    unordered_map<int,int> bestVal, bestD;
    int minH = 0, maxH = 0;
    goTop(root, 0, 0, bestVal, bestD, minH, maxH);
    for (int h = minH; h <= maxH; h++) out.push_back(bestVal[h]);
    return out;
}`,
`int bestVal[8005], bestD[8005], seenHd[8005];
void goTop(struct Node* node, int hd, int d, int* minH, int* maxH) {
    int off = 4000;
    if (!node) return;
    if (!seenHd[hd + off] || d < bestD[hd + off]) {
        seenHd[hd + off] = 1;
        bestD[hd + off] = d;
        bestVal[hd + off] = node->val;
    }
    if (hd < *minH) *minH = hd;
    if (hd > *maxH) *maxH = hd;
    goTop(node->left, hd - 1, d + 1, minH, maxH);
    goTop(node->right, hd + 1, d + 1, minH, maxH);
}
int* topView(struct Node* root, int* returnSize) {
    static int out[4005];
    int minH = 0, maxH = 0, h, n = 0, i;
    if (!root) { *returnSize = 0; return out; }
    for (i = 0; i < 8005; i++) seenHd[i] = 0;
    goTop(root, 0, 0, &minH, &maxH);
    for (h = minH; h <= maxH; h++) out[n++] = bestVal[h + 4000];
    *returnSize = n;
    return out;
}`
    ))
  ]
});

questions.push({
  id: 26,
  level: "intermediate",
  q: "Bottom View of Binary Tree",
  ask: "Amazon · Microsoft · Adobe · Paytm",
  links: [GFG("bottom-view-of-binary-tree"), GFG_ART("bottom-view-binary-tree")],
  a: "Standing below the tree, you see the last (deepest) node at each horizontal distance. If two nodes share hd and depth, GFG keeps the one visited later (usually the right one in BFS).\n\nBFS overwrite: every time you see hd, replace the value. DFS must keep the larger depth, and on a tie prefer the later visit.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n log n)", "O(n)", "Collect (hd, depth, index, val), sort, keep the last per hd.", tn(
`function bottomView(root) {
  const items = [];
  let idx = 0;
  function go(node, hd, d) {
    if (!node) return;
    items.push([hd, d, idx++, node.val]);
    go(node.left, hd - 1, d + 1);
    go(node.right, hd + 1, d + 1);
  }
  go(root, 0, 0);
  items.sort(function (a, b) {
    if (a[0] !== b[0]) return a[0] - b[0];
    if (a[1] !== b[1]) return a[1] - b[1];
    return a[2] - b[2];
  });
  const out = [];
  for (let i = 0; i < items.length; i++) {
    if (i + 1 === items.length || items[i][0] !== items[i + 1][0]) out.push(items[i][3]);
  }
  return out;
}`,
`def bottom_view(root):
    items = []
    idx = [0]
    def go(node, hd, d):
        if node is None:
            return
        items.append((hd, d, idx[0], node.val))
        idx[0] += 1
        go(node.left, hd - 1, d + 1)
        go(node.right, hd + 1, d + 1)
    go(root, 0, 0)
    items.sort()
    out = []
    for i, it in enumerate(items):
        if i + 1 == len(items) or items[i][0] != items[i + 1][0]:
            out.append(it[3])
    return out`,
`    public List<Integer> bottomView(TreeNode root) {
        List<int[]> items = new ArrayList<int[]>();
        int[] idx = {0};
        go(root, 0, 0, items, idx);
        items.sort((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] != b[1] ? a[1] - b[1] : a[2] - b[2]);
        List<Integer> out = new ArrayList<Integer>();
        for (int i = 0; i < items.size(); i++) {
            if (i + 1 == items.size() || items.get(i)[0] != items.get(i + 1)[0]) out.add(items.get(i)[3]);
        }
        return out;
    }
    void go(TreeNode node, int hd, int d, List<int[]> items, int[] idx) {
        if (node == null) return;
        items.add(new int[]{hd, d, idx[0]++, node.val});
        go(node.left, hd - 1, d + 1, items, idx);
        go(node.right, hd + 1, d + 1, items, idx);
    }`,
`vector<int> bottomView(TreeNode* root) {
    vector<array<int,4>> items;
    int idx = 0;
    function<void(TreeNode*,int,int)> go = [&](TreeNode* node, int hd, int d) {
        if (!node) return;
        items.push_back({hd, d, idx++, node->val});
        go(node->left, hd - 1, d + 1);
        go(node->right, hd + 1, d + 1);
    };
    go(root, 0, 0);
    sort(items.begin(), items.end());
    vector<int> out;
    for (int i = 0; i < (int)items.size(); i++)
        if (i + 1 == (int)items.size() || items[i][0] != items[i + 1][0]) out.push_back(items[i][3]);
    return out;
}`,
`typedef struct { int hd, d, idx, val; } Item;
int cmpItem4(const void* a, const void* b) {
    const Item* x = (const Item*)a, *y = (const Item*)b;
    if (x->hd != y->hd) return x->hd - y->hd;
    if (x->d != y->d) return x->d - y->d;
    return x->idx - y->idx;
}
void goItems4(struct Node* node, int hd, int d, Item* items, int* n) {
    if (!node) return;
    items[*n].hd = hd; items[*n].d = d; items[*n].idx = *n; items[*n].val = node->val; (*n)++;
    goItems4(node->left, hd - 1, d + 1, items, n);
    goItems4(node->right, hd + 1, d + 1, items, n);
}
int* bottomView(struct Node* root, int* returnSize) {
    static Item items[10005];
    static int out[4005];
    int n = 0, on = 0, i;
    goItems4(root, 0, 0, items, &n);
    qsort(items, n, sizeof(Item), cmpItem4);
    for (i = 0; i < n; i++)
        if (i + 1 == n || items[i].hd != items[i + 1].hd) out[on++] = items[i].val;
    *returnSize = on;
    return out;
}`
    )),
    sol("Optimal", "O(n)", "O(n)", "BFS overwrite per hd. Last write is the deepest (or the right one on a tie). Emit min..max.", tn(
`function bottomView(root) {
  if (!root) return [];
  const last = {};
  let minH = 0, maxH = 0;
  const q = [[root, 0]];
  while (q.length) {
    const pair = q.shift();
    const node = pair[0], hd = pair[1];
    last[hd] = node.val;
    if (hd < minH) minH = hd;
    if (hd > maxH) maxH = hd;
    if (node.left) q.push([node.left, hd - 1]);
    if (node.right) q.push([node.right, hd + 1]);
  }
  const out = [];
  for (let h = minH; h <= maxH; h++) out.push(last[h]);
  return out;
}`,
`def bottom_view(root):
    if root is None:
        return []
    from collections import deque
    last = {}
    min_h = max_h = 0
    q = deque([(root, 0)])
    while q:
        node, hd = q.popleft()
        last[hd] = node.val
        min_h = min(min_h, hd)
        max_h = max(max_h, hd)
        if node.left:
            q.append((node.left, hd - 1))
        if node.right:
            q.append((node.right, hd + 1))
    return [last[h] for h in range(min_h, max_h + 1)]`,
`    public List<Integer> bottomView(TreeNode root) {
        List<Integer> out = new ArrayList<Integer>();
        if (root == null) return out;
        Map<Integer, Integer> last = new HashMap<Integer, Integer>();
        Queue<TreeNode> nq = new ArrayDeque<TreeNode>();
        Queue<Integer> hq = new ArrayDeque<Integer>();
        nq.add(root); hq.add(0);
        int minH = 0, maxH = 0;
        while (!nq.isEmpty()) {
            TreeNode node = nq.poll();
            int hd = hq.poll();
            last.put(hd, node.val);
            minH = Math.min(minH, hd);
            maxH = Math.max(maxH, hd);
            if (node.left != null) { nq.add(node.left); hq.add(hd - 1); }
            if (node.right != null) { nq.add(node.right); hq.add(hd + 1); }
        }
        for (int h = minH; h <= maxH; h++) out.add(last.get(h));
        return out;
    }`,
`vector<int> bottomView(TreeNode* root) {
    vector<int> out;
    if (!root) return out;
    map<int, int> last;
    queue<pair<TreeNode*, int>> q;
    q.push({root, 0});
    while (!q.empty()) {
        auto [node, hd] = q.front(); q.pop();
        last[hd] = node->val;
        if (node->left) q.push({node->left, hd - 1});
        if (node->right) q.push({node->right, hd + 1});
    }
    for (auto& kv : last) out.push_back(kv.second);
    return out;
}`,
`int* bottomView(struct Node* root, int* returnSize) {
    static int last[8005];
    static int out[4005];
    struct Node* qn[10005];
    int qh[10005], qs = 0, qe = 0, minH = 0, maxH = 0, off = 4000, h, n;
    if (!root) { *returnSize = 0; return out; }
    qn[qe] = root; qh[qe++] = 0;
    while (qs < qe) {
        struct Node* node = qn[qs];
        int hd = qh[qs++];
        last[hd + off] = node->val;
        if (hd < minH) minH = hd;
        if (hd > maxH) maxH = hd;
        if (node->left) { qn[qe] = node->left; qh[qe++] = hd - 1; }
        if (node->right) { qn[qe] = node->right; qh[qe++] = hd + 1; }
    }
    n = 0;
    for (h = minH; h <= maxH; h++) out[n++] = last[h + off];
    *returnSize = n;
    return out;
}`
    )),
    sol("More optimal", "O(n)", "O(n)", "DFS: keep val for hd when depth >= stored depth (overwrite on tie so right-later wins if you visit right after left).", tn(
`function bottomView(root) {
  const val = {};
  const dep = {};
  let minH = 0, maxH = 0;
  function go(node, hd, d) {
    if (!node) return;
    if (dep[hd] === undefined || d >= dep[hd]) {
      dep[hd] = d;
      val[hd] = node.val;
    }
    if (hd < minH) minH = hd;
    if (hd > maxH) maxH = hd;
    go(node.left, hd - 1, d + 1);
    go(node.right, hd + 1, d + 1);
  }
  go(root, 0, 0);
  const out = [];
  for (let h = minH; h <= maxH; h++) out.push(val[h]);
  return out;
}`,
`def bottom_view(root):
    if root is None:
        return []
    val, dep = {}, {}
    min_h = max_h = 0
    def go(node, hd, d):
        nonlocal min_h, max_h
        if node is None:
            return
        if hd not in dep or d >= dep[hd]:
            dep[hd] = d
            val[hd] = node.val
        min_h = min(min_h, hd)
        max_h = max(max_h, hd)
        go(node.left, hd - 1, d + 1)
        go(node.right, hd + 1, d + 1)
    go(root, 0, 0)
    return [val[h] for h in range(min_h, max_h + 1)]`,
`    Map<Integer, Integer> val = new HashMap<Integer, Integer>();
    Map<Integer, Integer> dep = new HashMap<Integer, Integer>();
    int minH, maxH;
    void go(TreeNode node, int hd, int d) {
        if (node == null) return;
        if (!dep.containsKey(hd) || d >= dep.get(hd)) {
            dep.put(hd, d);
            val.put(hd, node.val);
        }
        minH = Math.min(minH, hd);
        maxH = Math.max(maxH, hd);
        go(node.left, hd - 1, d + 1);
        go(node.right, hd + 1, d + 1);
    }
    public List<Integer> bottomView(TreeNode root) {
        List<Integer> out = new ArrayList<Integer>();
        if (root == null) return out;
        minH = 0; maxH = 0;
        go(root, 0, 0);
        for (int h = minH; h <= maxH; h++) out.add(val.get(h));
        return out;
    }`,
`void goBot(TreeNode* node, int hd, int d, unordered_map<int,int>& val, unordered_map<int,int>& dep, int& minH, int& maxH) {
    if (!node) return;
    if (!dep.count(hd) || d >= dep[hd]) { dep[hd] = d; val[hd] = node->val; }
    minH = min(minH, hd);
    maxH = max(maxH, hd);
    goBot(node->left, hd - 1, d + 1, val, dep, minH, maxH);
    goBot(node->right, hd + 1, d + 1, val, dep, minH, maxH);
}
vector<int> bottomView(TreeNode* root) {
    vector<int> out;
    if (!root) return out;
    unordered_map<int,int> val, dep;
    int minH = 0, maxH = 0;
    goBot(root, 0, 0, val, dep, minH, maxH);
    for (int h = minH; h <= maxH; h++) out.push_back(val[h]);
    return out;
}`,
`int botVal[8005], botDep[8005], botSeen[8005];
void goBot(struct Node* node, int hd, int d, int* minH, int* maxH) {
    int off = 4000;
    if (!node) return;
    if (!botSeen[hd + off] || d >= botDep[hd + off]) {
        botSeen[hd + off] = 1;
        botDep[hd + off] = d;
        botVal[hd + off] = node->val;
    }
    if (hd < *minH) *minH = hd;
    if (hd > *maxH) *maxH = hd;
    goBot(node->left, hd - 1, d + 1, minH, maxH);
    goBot(node->right, hd + 1, d + 1, minH, maxH);
}
int* bottomView(struct Node* root, int* returnSize) {
    static int out[4005];
    int minH = 0, maxH = 0, h, n = 0, i;
    if (!root) { *returnSize = 0; return out; }
    for (i = 0; i < 8005; i++) botSeen[i] = 0;
    goBot(root, 0, 0, &minH, &maxH);
    for (h = minH; h <= maxH; h++) out[n++] = botVal[h + 4000];
    *returnSize = n;
    return out;
}`
    ))
  ]
});

module.exports = questions;
