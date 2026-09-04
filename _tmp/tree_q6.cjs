"use strict";
const { tn, sol, LC, GFG, GFG_ART, block, JS_TN, PY_TN, JAVA_TN, CPP_TN, C_TN } = require("./tree_meta.cjs");

const questions = [];

questions.push({
  id: 31,
  level: "beginner",
  q: "Children Sum Property",
  ask: "Amazon · Microsoft · Adobe",
  links: [GFG("children-sum-parent"), GFG_ART("check-for-children-sum-property-in-a-binary-tree")],
  a: "A tree satisfies children-sum if every node equals the sum of its children (a missing child counts as 0). Leaves are always valid.\n\nCheck bottom-up: after both children are valid, node.val must equal left.val + right.val.\n\nBrute for each node walks the two children only (local check) after confirming subtrees. Optimal is one postorder boolean. More optimal returns the node value upward so you never read a child twice.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n)", "O(n)", "For every node, sum the two children (0 if null) and compare. Recurse both sides. Extra list of all nodes first.", tn(
`function isSumTree(root) {
  const nodes = [];
  function go(node) {
    if (!node) return;
    nodes.push(node);
    go(node.left);
    go(node.right);
  }
  go(root);
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (!n.left && !n.right) continue;
    const L = n.left ? n.left.val : 0;
    const R = n.right ? n.right.val : 0;
    if (n.val !== L + R) return false;
  }
  return true;
}`,
`def is_sum_tree(root):
    nodes = []
    def go(node):
        if node is None:
            return
        nodes.append(node)
        go(node.left)
        go(node.right)
    go(root)
    for n in nodes:
        if n.left is None and n.right is None:
            continue
        left = n.left.val if n.left else 0
        right = n.right.val if n.right else 0
        if n.val != left + right:
            return False
    return True`,
`    public boolean isSumTree(TreeNode root) {
        List<TreeNode> nodes = new ArrayList<TreeNode>();
        go(root, nodes);
        for (TreeNode n : nodes) {
            if (n.left == null && n.right == null) continue;
            int L = n.left == null ? 0 : n.left.val;
            int R = n.right == null ? 0 : n.right.val;
            if (n.val != L + R) return false;
        }
        return true;
    }
    void go(TreeNode node, List<TreeNode> nodes) {
        if (node == null) return;
        nodes.add(node);
        go(node.left, nodes);
        go(node.right, nodes);
    }`,
`bool isSumTree(TreeNode* root) {
    vector<TreeNode*> nodes;
    function<void(TreeNode*)> go = [&](TreeNode* node) {
        if (!node) return;
        nodes.push_back(node);
        go(node->left);
        go(node->right);
    };
    go(root);
    for (TreeNode* n : nodes) {
        if (!n->left && !n->right) continue;
        int L = n->left ? n->left->val : 0;
        int R = n->right ? n->right->val : 0;
        if (n->val != L + R) return false;
    }
    return true;
}`,
`void collectN(struct Node* node, struct Node** nodes, int* n) {
    if (!node) return;
    nodes[(*n)++] = node;
    collectN(node->left, nodes, n);
    collectN(node->right, nodes, n);
}
bool isSumTree(struct Node* root) {
    struct Node* nodes[10005];
    int n = 0, i;
    collectN(root, nodes, &n);
    for (i = 0; i < n; i++) {
        struct Node* p = nodes[i];
        int L, R;
        if (!p->left && !p->right) continue;
        L = p->left ? p->left->val : 0;
        R = p->right ? p->right->val : 0;
        if (p->val != L + R) return false;
    }
    return true;
}`
    )),
    sol("Optimal", "O(n)", "O(h)", "Postorder boolean. Null and leaves are true. Then check val == left+right and both subtrees hold.", tn(
`function isSumTree(root) {
  if (!root) return true;
  if (!root.left && !root.right) return true;
  const L = root.left ? root.left.val : 0;
  const R = root.right ? root.right.val : 0;
  return root.val === L + R && isSumTree(root.left) && isSumTree(root.right);
}`,
`def is_sum_tree(root):
    if root is None:
        return True
    if root.left is None and root.right is None:
        return True
    left = root.left.val if root.left else 0
    right = root.right.val if root.right else 0
    return root.val == left + right and is_sum_tree(root.left) and is_sum_tree(root.right)`,
`    public boolean isSumTree(TreeNode root) {
        if (root == null) return true;
        if (root.left == null && root.right == null) return true;
        int L = root.left == null ? 0 : root.left.val;
        int R = root.right == null ? 0 : root.right.val;
        return root.val == L + R && isSumTree(root.left) && isSumTree(root.right);
    }`,
`bool isSumTree(TreeNode* root) {
    if (!root) return true;
    if (!root->left && !root->right) return true;
    int L = root->left ? root->left->val : 0;
    int R = root->right ? root->right->val : 0;
    return root->val == L + R && isSumTree(root->left) && isSumTree(root->right);
}`,
`bool isSumTree(struct Node* root) {
    int L, R;
    if (!root) return true;
    if (!root->left && !root->right) return true;
    L = root->left ? root->left->val : 0;
    R = root->right ? root->right->val : 0;
    return root->val == L + R && isSumTree(root->left) && isSumTree(root->right);
}`
    )),
    sol("More optimal", "O(n)", "O(h)", "Return a pair (ok, val) so a failed subtree aborts. Same checks, one value returned upward.", tn(
`function isSumTree(root) {
  function go(node) {
    if (!node) return { ok: true, val: 0 };
    if (!node.left && !node.right) return { ok: true, val: node.val };
    const L = go(node.left);
    const R = go(node.right);
    const ok = L.ok && R.ok && node.val === L.val + R.val;
    return { ok: ok, val: node.val };
  }
  return go(root).ok;
}`,
`def is_sum_tree(root):
    def go(node):
        if node is None:
            return True, 0
        if node.left is None and node.right is None:
            return True, node.val
        lok, lv = go(node.left)
        rok, rv = go(node.right)
        ok = lok and rok and node.val == lv + rv
        return ok, node.val
    ok, _ = go(root)
    return ok`,
`    class Pair { boolean ok; int val; Pair(boolean ok, int val) { this.ok = ok; this.val = val; } }
    Pair go(TreeNode node) {
        if (node == null) return new Pair(true, 0);
        if (node.left == null && node.right == null) return new Pair(true, node.val);
        Pair L = go(node.left);
        Pair R = go(node.right);
        boolean ok = L.ok && R.ok && node.val == L.val + R.val;
        return new Pair(ok, node.val);
    }
    public boolean isSumTree(TreeNode root) {
        return go(root).ok;
    }`,
`pair<bool,int> goSum(TreeNode* node) {
    if (!node) return {true, 0};
    if (!node->left && !node->right) return {true, node->val};
    auto L = goSum(node->left);
    auto R = goSum(node->right);
    bool ok = L.first && R.first && node->val == L.second + R.second;
    return {ok, node->val};
}
bool isSumTree(TreeNode* root) { return goSum(root).first; }`,
`int goSum(struct Node* node, bool* ok) {
    int L, R;
    if (!node) return 0;
    if (!node->left && !node->right) return node->val;
    L = goSum(node->left, ok);
    R = goSum(node->right, ok);
    if (node->val != L + R) *ok = false;
    return node->val;
}
bool isSumTree(struct Node* root) {
    bool ok = true;
    goSum(root, &ok);
    return ok;
}`
    ))
  ]
});

questions.push({
  id: 32,
  level: "intermediate",
  q: "Maximum Width of Binary Tree",
  ask: "Amazon · Google · Meta · Microsoft",
  links: [LC("maximum-width-of-binary-tree"), GFG("maximum-width-of-tree")],
  a: "Width of a level is the number of nodes between the leftmost and rightmost non-null positions on that level, counting the nulls in the middle. A complete heap-index numbering (root 0, left 2*i+1, right 2*i+2) makes width = lastIndex - firstIndex + 1.\n\nGFG 'maximum width of tree' often means count of actual nodes on the widest level (no nulls). LeetCode counts positions. Both are shown: brute is GFG count; optimal/more optimal are the LeetCode index version.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n)", "O(w)", "BFS. Width of a level is the queue size (actual nodes). Max over levels. Matches GFG's non-null count.", tn(
`function widthOfBinaryTree(root) {
  if (!root) return 0;
  let best = 0;
  const q = [root];
  while (q.length) {
    const n = q.length;
    if (n > best) best = n;
    for (let i = 0; i < n; i++) {
      const node = q.shift();
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
  }
  return best;
}`,
`def width_of_binary_tree(root):
    if root is None:
        return 0
    from collections import deque
    best = 0
    q = deque([root])
    while q:
        n = len(q)
        best = max(best, n)
        for _ in range(n):
            node = q.popleft()
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
    return best`,
`    public int widthOfBinaryTree(TreeNode root) {
        if (root == null) return 0;
        int best = 0;
        Queue<TreeNode> q = new ArrayDeque<TreeNode>();
        q.add(root);
        while (!q.isEmpty()) {
            int n = q.size();
            best = Math.max(best, n);
            for (int i = 0; i < n; i++) {
                TreeNode node = q.poll();
                if (node.left != null) q.add(node.left);
                if (node.right != null) q.add(node.right);
            }
        }
        return best;
    }`,
`int widthOfBinaryTree(TreeNode* root) {
    if (!root) return 0;
    int best = 0;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int n = (int)q.size();
        best = max(best, n);
        for (int i = 0; i < n; i++) {
            TreeNode* node = q.front(); q.pop();
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
    }
    return best;
}`,
`int widthOfBinaryTree(struct Node* root) {
    struct Node* q[10005];
    int qs, qe, best = 0;
    if (!root) return 0;
    qs = 0; qe = 0;
    q[qe++] = root;
    while (qs < qe) {
        int n = qe - qs, i;
        if (n > best) best = n;
        for (i = 0; i < n; i++) {
            struct Node* node = q[qs++];
            if (node->left) q[qe++] = node->left;
            if (node->right) q[qe++] = node->right;
        }
    }
    return best;
}`
    )),
    sol("Optimal", "O(n)", "O(w)", "LeetCode width: BFS with heap indices. Subtract the first index of the level so numbers stay small. Width = last - first + 1.", tn(
`function widthOfBinaryTree(root) {
  if (!root) return 0;
  let best = 0;
  const q = [[root, 0]];
  while (q.length) {
    const n = q.length;
    const first = q[0][1];
    let last = first;
    for (let i = 0; i < n; i++) {
      const node = q[0][0];
      const idx = q[0][1] - first;
      q.shift();
      last = idx;
      if (node.left) q.push([node.left, idx * 2 + 1]);
      if (node.right) q.push([node.right, idx * 2 + 2]);
    }
    if (last + 1 > best) best = last + 1;
  }
  return best;
}`,
`def width_of_binary_tree(root):
    if root is None:
        return 0
    from collections import deque
    best = 0
    q = deque([(root, 0)])
    while q:
        first = q[0][1]
        last = first
        for _ in range(len(q)):
            node, idx = q.popleft()
            idx -= first
            last = idx
            if node.left:
                q.append((node.left, idx * 2 + 1))
            if node.right:
                q.append((node.right, idx * 2 + 2))
        best = max(best, last + 1)
    return best`,
`    public int widthOfBinaryTree(TreeNode root) {
        if (root == null) return 0;
        int best = 0;
        Queue<TreeNode> nq = new ArrayDeque<TreeNode>();
        Queue<Integer> iq = new ArrayDeque<Integer>();
        nq.add(root); iq.add(0);
        while (!nq.isEmpty()) {
            int n = nq.size();
            int first = iq.peek();
            int last = first;
            for (int i = 0; i < n; i++) {
                TreeNode node = nq.poll();
                int idx = iq.poll() - first;
                last = idx;
                if (node.left != null) { nq.add(node.left); iq.add(idx * 2 + 1); }
                if (node.right != null) { nq.add(node.right); iq.add(idx * 2 + 2); }
            }
            best = Math.max(best, last + 1);
        }
        return best;
    }`,
`int widthOfBinaryTree(TreeNode* root) {
    if (!root) return 0;
    int best = 0;
    queue<pair<TreeNode*, unsigned long long>> q;
    q.push({root, 0});
    while (!q.empty()) {
        int n = (int)q.size();
        unsigned long long first = q.front().second, last = first;
        for (int i = 0; i < n; i++) {
            auto [node, idx] = q.front(); q.pop();
            idx -= first;
            last = idx;
            if (node->left) q.push({node->left, idx * 2 + 1});
            if (node->right) q.push({node->right, idx * 2 + 2});
        }
        best = max(best, (int)last + 1);
    }
    return best;
}`,
`int widthOfBinaryTree(struct Node* root) {
    struct Node* qn[10005];
    unsigned long long qi[10005];
    int qs, qe, best = 0, i, n;
    unsigned long long first, last, idx;
    if (!root) return 0;
    qs = 0; qe = 0;
    qn[qe] = root; qi[qe++] = 0;
    while (qs < qe) {
        n = qe - qs;
        first = qi[qs];
        last = first;
        for (i = 0; i < n; i++) {
            struct Node* node = qn[qs];
            idx = qi[qs++] - first;
            last = idx;
            if (node->left) { qn[qe] = node->left; qi[qe++] = idx * 2 + 1; }
            if (node->right) { qn[qe] = node->right; qi[qe++] = idx * 2 + 2; }
        }
        if ((int)last + 1 > best) best = (int)last + 1;
    }
    return best;
}`
    )),
    sol("More optimal", "O(n)", "O(h)", "DFS with (depth, normalized index). Store the first index seen at each depth. Width = idx - first[depth] + 1. Recursion only.", tn(
`function widthOfBinaryTree(root) {
  const first = [];
  let best = 0;
  function go(node, d, idx) {
    if (!node) return;
    if (first[d] === undefined) first[d] = idx;
    const pos = idx - first[d];
    if (pos + 1 > best) best = pos + 1;
    go(node.left, d + 1, pos * 2 + 1);
    go(node.right, d + 1, pos * 2 + 2);
  }
  go(root, 0, 0);
  return best;
}`,
`def width_of_binary_tree(root):
    first = {}
    best = [0]
    def go(node, d, idx):
        if node is None:
            return
        if d not in first:
            first[d] = idx
        pos = idx - first[d]
        best[0] = max(best[0], pos + 1)
        go(node.left, d + 1, pos * 2 + 1)
        go(node.right, d + 1, pos * 2 + 2)
    go(root, 0, 0)
    return best[0]`,
`    List<Integer> first = new ArrayList<Integer>();
    int best;
    void go(TreeNode node, int d, int idx) {
        if (node == null) return;
        if (d == first.size()) first.add(idx);
        int pos = idx - first.get(d);
        best = Math.max(best, pos + 1);
        go(node.left, d + 1, pos * 2 + 1);
        go(node.right, d + 1, pos * 2 + 2);
    }
    public int widthOfBinaryTree(TreeNode root) {
        best = 0;
        go(root, 0, 0);
        return best;
    }`,
`void goW(TreeNode* node, int d, unsigned long long idx, vector<unsigned long long>& first, int& best) {
    if (!node) return;
    if (d == (int)first.size()) first.push_back(idx);
    unsigned long long pos = idx - first[d];
    best = max(best, (int)pos + 1);
    goW(node->left, d + 1, pos * 2 + 1, first, best);
    goW(node->right, d + 1, pos * 2 + 2, first, best);
}
int widthOfBinaryTree(TreeNode* root) {
    vector<unsigned long long> first;
    int best = 0;
    goW(root, 0, 0, first, best);
    return best;
}`,
`void goW(struct Node* node, int d, unsigned long long idx, unsigned long long* first, int* seen, int* best) {
    unsigned long long pos;
    if (!node) return;
    if (!seen[d]) { seen[d] = 1; first[d] = idx; }
    pos = idx - first[d];
    if ((int)pos + 1 > *best) *best = (int)pos + 1;
    goW(node->left, d + 1, pos * 2 + 1, first, seen, best);
    goW(node->right, d + 1, pos * 2 + 2, first, seen, best);
}
int widthOfBinaryTree(struct Node* root) {
    unsigned long long first[64];
    int seen[64] = {0};
    int best = 0;
    goW(root, 0, 0, first, seen, &best);
    return best;
}`
    ))
  ]
});

module.exports = questions;
