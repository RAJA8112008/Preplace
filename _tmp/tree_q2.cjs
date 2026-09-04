"use strict";
const { tn, sol, LC, GFG, GFG_ART, block, JS_TN, PY_TN, JAVA_TN, CPP_TN, C_TN, JS_NN, PY_NN, JAVA_NN, CPP_NN, C_NN } = require("./tree_meta.cjs");

const questions = [];

questions.push({
  id: 23,
  level: "intermediate",
  q: "Boundary Traversal of Binary Tree",
  ask: "Amazon · Microsoft · Adobe · Flipkart",
  links: [GFG("boundary-traversal-of-binary-tree"), GFG_ART("boundary-traversal-of-binary-tree")],
  a: "Print the boundary anti-clockwise: root, left boundary (top to bottom, no leaves), all leaves left to right, right boundary (bottom to top, no leaves). Do not print the root twice on a one-node tree.\n\nLeft boundary is the walk that prefers left, then right if left is missing. Right boundary prefers right. Leaves are a standard DFS.\n\nBrute marks every node with flags. Optimal is three dedicated walks. More optimal is one DFS with (isLeftBound, isRightBound, isLeaf) flags.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n)", "O(n)", "Collect all nodes with (isLeft, isRight, isLeaf). Then emit left bound, leaves, reverse right bound, skipping duplicates via a seen set.", tn(
`function boundaryTraversal(root) {
  if (!root) return [];
  const leftB = [], rightB = [], leaves = [];
  function isLeaf(n) { return n && !n.left && !n.right; }
  function go(node, onLeft, onRight) {
    if (!node) return;
    if (isLeaf(node)) { leaves.push(node.val); return; }
    if (onLeft) leftB.push(node.val);
    else if (onRight) rightB.push(node.val);
    go(node.left, onLeft, onRight && !node.right);
    go(node.right, onLeft && !node.left, onRight);
  }
  if (!isLeaf(root)) leftB.push(root.val);
  go(root.left, true, false);
  go(root.right, false, true);
  if (isLeaf(root)) leaves.push(root.val);
  rightB.reverse();
  return leftB.concat(leaves, rightB);
}`,
`def boundary_traversal(root):
    if root is None:
        return []
    left_b, right_b, leaves = [], [], []
    def is_leaf(n):
        return n is not None and n.left is None and n.right is None
    def go(node, on_left, on_right):
        if node is None:
            return
        if is_leaf(node):
            leaves.append(node.val)
            return
        if on_left:
            left_b.append(node.val)
        elif on_right:
            right_b.append(node.val)
        go(node.left, on_left, on_right and node.right is None)
        go(node.right, on_left and node.left is None, on_right)
    if not is_leaf(root):
        left_b.append(root.val)
    go(root.left, True, False)
    go(root.right, False, True)
    if is_leaf(root):
        leaves.append(root.val)
    right_b.reverse()
    return left_b + leaves + right_b`,
`    boolean isLeaf(TreeNode n) { return n != null && n.left == null && n.right == null; }
    void go(TreeNode node, boolean onLeft, boolean onRight, List<Integer> leftB, List<Integer> rightB, List<Integer> leaves) {
        if (node == null) return;
        if (isLeaf(node)) { leaves.add(node.val); return; }
        if (onLeft) leftB.add(node.val);
        else if (onRight) rightB.add(node.val);
        go(node.left, onLeft, onRight && node.right == null, leftB, rightB, leaves);
        go(node.right, onLeft && node.left == null, onRight, leftB, rightB, leaves);
    }
    public List<Integer> boundaryTraversal(TreeNode root) {
        List<Integer> leftB = new ArrayList<Integer>(), rightB = new ArrayList<Integer>(), leaves = new ArrayList<Integer>();
        if (root == null) return leftB;
        if (!isLeaf(root)) leftB.add(root.val);
        go(root.left, true, false, leftB, rightB, leaves);
        go(root.right, false, true, leftB, rightB, leaves);
        if (isLeaf(root)) leaves.add(root.val);
        Collections.reverse(rightB);
        leftB.addAll(leaves);
        leftB.addAll(rightB);
        return leftB;
    }`,
`bool isLeaf(TreeNode* n) { return n && !n->left && !n->right; }
void goBound(TreeNode* node, bool onLeft, bool onRight, vector<int>& leftB, vector<int>& rightB, vector<int>& leaves) {
    if (!node) return;
    if (isLeaf(node)) { leaves.push_back(node->val); return; }
    if (onLeft) leftB.push_back(node->val);
    else if (onRight) rightB.push_back(node->val);
    goBound(node->left, onLeft, onRight && !node->right, leftB, rightB, leaves);
    goBound(node->right, onLeft && !node->left, onRight, leftB, rightB, leaves);
}
vector<int> boundaryTraversal(TreeNode* root) {
    vector<int> leftB, rightB, leaves;
    if (!root) return leftB;
    if (!isLeaf(root)) leftB.push_back(root->val);
    goBound(root->left, true, false, leftB, rightB, leaves);
    goBound(root->right, false, true, leftB, rightB, leaves);
    if (isLeaf(root)) leaves.push_back(root->val);
    reverse(rightB.begin(), rightB.end());
    leftB.insert(leftB.end(), leaves.begin(), leaves.end());
    leftB.insert(leftB.end(), rightB.begin(), rightB.end());
    return leftB;
}`,
`int isLeaf(struct Node* n) { return n && !n->left && !n->right; }
void goBound(struct Node* node, int onLeft, int onRight, int* leftB, int* ln, int* rightB, int* rn, int* leaves, int* lf) {
    if (!node) return;
    if (isLeaf(node)) { leaves[(*lf)++] = node->val; return; }
    if (onLeft) leftB[(*ln)++] = node->val;
    else if (onRight) rightB[(*rn)++] = node->val;
    goBound(node->left, onLeft, onRight && !node->right, leftB, ln, rightB, rn, leaves, lf);
    goBound(node->right, onLeft && !node->left, onRight, leftB, ln, rightB, rn, leaves, lf);
}
int* boundaryTraversal(struct Node* root, int* returnSize) {
    static int out[10005], leftB[10005], rightB[10005], leaves[10005];
    int ln = 0, rn = 0, lf = 0, i;
    if (!root) { *returnSize = 0; return out; }
    if (!isLeaf(root)) leftB[ln++] = root->val;
    goBound(root->left, 1, 0, leftB, &ln, rightB, &rn, leaves, &lf);
    goBound(root->right, 0, 1, leftB, &ln, rightB, &rn, leaves, &lf);
    if (isLeaf(root)) leaves[lf++] = root->val;
    for (i = 0; i < ln; i++) out[i] = leftB[i];
    for (i = 0; i < lf; i++) out[ln + i] = leaves[i];
    for (i = 0; i < rn; i++) out[ln + lf + i] = rightB[rn - 1 - i];
    *returnSize = ln + lf + rn;
    return out;
}`
    )),
    sol("Optimal", "O(n)", "O(h)", "Three passes: left edge (stop before a leaf), all leaves, right edge into a stack then pop. Clear and classic interview split.", tn(
`function boundaryTraversal(root) {
  if (!root) return [];
  function isLeaf(n) { return !n.left && !n.right; }
  const out = [];
  if (!isLeaf(root)) out.push(root.val);
  let cur = root.left;
  while (cur) {
    if (!isLeaf(cur)) out.push(cur.val);
    cur = cur.left ? cur.left : cur.right;
  }
  function leaves(node) {
    if (!node) return;
    if (isLeaf(node)) { out.push(node.val); return; }
    leaves(node.left);
    leaves(node.right);
  }
  leaves(root);
  const right = [];
  cur = root.right;
  while (cur) {
    if (!isLeaf(cur)) right.push(cur.val);
    cur = cur.right ? cur.right : cur.left;
  }
  while (right.length) out.push(right.pop());
  return out;
}`,
`def boundary_traversal(root):
    if root is None:
        return []
    def is_leaf(n):
        return n.left is None and n.right is None
    out = []
    if not is_leaf(root):
        out.append(root.val)
    cur = root.left
    while cur:
        if not is_leaf(cur):
            out.append(cur.val)
        cur = cur.left if cur.left else cur.right
    def leaves(node):
        if node is None:
            return
        if is_leaf(node):
            out.append(node.val)
            return
        leaves(node.left)
        leaves(node.right)
    leaves(root)
    right = []
    cur = root.right
    while cur:
        if not is_leaf(cur):
            right.append(cur.val)
        cur = cur.right if cur.right else cur.left
    while right:
        out.append(right.pop())
    return out`,
`    boolean isLeaf(TreeNode n) { return n.left == null && n.right == null; }
    void leaves(TreeNode node, List<Integer> out) {
        if (node == null) return;
        if (isLeaf(node)) { out.add(node.val); return; }
        leaves(node.left, out);
        leaves(node.right, out);
    }
    public List<Integer> boundaryTraversal(TreeNode root) {
        List<Integer> out = new ArrayList<Integer>();
        if (root == null) return out;
        if (!isLeaf(root)) out.add(root.val);
        TreeNode cur = root.left;
        while (cur != null) {
            if (!isLeaf(cur)) out.add(cur.val);
            cur = cur.left != null ? cur.left : cur.right;
        }
        leaves(root, out);
        List<Integer> right = new ArrayList<Integer>();
        cur = root.right;
        while (cur != null) {
            if (!isLeaf(cur)) right.add(cur.val);
            cur = cur.right != null ? cur.right : cur.left;
        }
        for (int i = right.size() - 1; i >= 0; i--) out.add(right.get(i));
        return out;
    }`,
`bool isLeafN(TreeNode* n) { return !n->left && !n->right; }
void leaves(TreeNode* node, vector<int>& out) {
    if (!node) return;
    if (isLeafN(node)) { out.push_back(node->val); return; }
    leaves(node->left, out);
    leaves(node->right, out);
}
vector<int> boundaryTraversal(TreeNode* root) {
    vector<int> out;
    if (!root) return out;
    if (!isLeafN(root)) out.push_back(root->val);
    TreeNode* cur = root->left;
    while (cur) {
        if (!isLeafN(cur)) out.push_back(cur->val);
        cur = cur->left ? cur->left : cur->right;
    }
    leaves(root, out);
    vector<int> right;
    cur = root->right;
    while (cur) {
        if (!isLeafN(cur)) right.push_back(cur->val);
        cur = cur->right ? cur->right : cur->left;
    }
    while (!right.empty()) { out.push_back(right.back()); right.pop_back(); }
    return out;
}`,
`int isLeafN(struct Node* n) { return !n->left && !n->right; }
void leavesN(struct Node* node, int* out, int* n) {
    if (!node) return;
    if (isLeafN(node)) { out[(*n)++] = node->val; return; }
    leavesN(node->left, out, n);
    leavesN(node->right, out, n);
}
int* boundaryTraversal(struct Node* root, int* returnSize) {
    static int out[10005], right[10005];
    int n = 0, rn = 0;
    struct Node* cur;
    if (!root) { *returnSize = 0; return out; }
    if (!isLeafN(root)) out[n++] = root->val;
    cur = root->left;
    while (cur) {
        if (!isLeafN(cur)) out[n++] = cur->val;
        cur = cur->left ? cur->left : cur->right;
    }
    leavesN(root, out, &n);
    cur = root->right;
    while (cur) {
        if (!isLeafN(cur)) right[rn++] = cur->val;
        cur = cur->right ? cur->right : cur->left;
    }
    while (rn) out[n++] = right[--rn];
    *returnSize = n;
    return out;
}`
    )),
    sol("More optimal", "O(n)", "O(h)", "One DFS. Pass whether this node is on the left bound, right bound, or a leaf. Append left-bound before children, leaves in the middle, right-bound after children (so they reverse themselves).", tn(
`function boundaryTraversal(root) {
  if (!root) return [];
  const out = [];
  function isLeaf(n) { return !n.left && !n.right; }
  function go(node, leftB, rightB) {
    if (!node) return;
    if (isLeaf(node) || leftB) out.push(node.val);
    go(node.left, leftB, rightB && !node.right);
    go(node.right, leftB && !node.left, rightB);
    if (rightB && !isLeaf(node) && !leftB) out.push(node.val);
  }
  if (isLeaf(root)) return [root.val];
  out.push(root.val);
  go(root.left, true, false);
  go(root.right, false, true);
  return out;
}`,
`def boundary_traversal(root):
    if root is None:
        return []
    def is_leaf(n):
        return n.left is None and n.right is None
    out = []
    def go(node, left_b, right_b):
        if node is None:
            return
        if is_leaf(node) or left_b:
            out.append(node.val)
        go(node.left, left_b, right_b and node.right is None)
        go(node.right, left_b and node.left is None, right_b)
        if right_b and not is_leaf(node) and not left_b:
            out.append(node.val)
    if is_leaf(root):
        return [root.val]
    out.append(root.val)
    go(root.left, True, False)
    go(root.right, False, True)
    return out`,
`    boolean isLeaf(TreeNode n) { return n.left == null && n.right == null; }
    void go(TreeNode node, boolean leftB, boolean rightB, List<Integer> out) {
        if (node == null) return;
        if (isLeaf(node) || leftB) out.add(node.val);
        go(node.left, leftB, rightB && node.right == null, out);
        go(node.right, leftB && node.left == null, rightB, out);
        if (rightB && !isLeaf(node) && !leftB) out.add(node.val);
    }
    public List<Integer> boundaryTraversal(TreeNode root) {
        List<Integer> out = new ArrayList<Integer>();
        if (root == null) return out;
        if (isLeaf(root)) { out.add(root.val); return out; }
        out.add(root.val);
        go(root.left, true, false, out);
        go(root.right, false, true, out);
        return out;
    }`,
`bool isLeafN(TreeNode* n) { return !n->left && !n->right; }
void goBound2(TreeNode* node, bool leftB, bool rightB, vector<int>& out) {
    if (!node) return;
    if (isLeafN(node) || leftB) out.push_back(node->val);
    goBound2(node->left, leftB, rightB && !node->right, out);
    goBound2(node->right, leftB && !node->left, rightB, out);
    if (rightB && !isLeafN(node) && !leftB) out.push_back(node->val);
}
vector<int> boundaryTraversal(TreeNode* root) {
    vector<int> out;
    if (!root) return out;
    if (isLeafN(root)) { out.push_back(root->val); return out; }
    out.push_back(root->val);
    goBound2(root->left, true, false, out);
    goBound2(root->right, false, true, out);
    return out;
}`,
`int isLeafN(struct Node* n) { return !n->left && !n->right; }
void goBound2(struct Node* node, int leftB, int rightB, int* out, int* n) {
    if (!node) return;
    if (isLeafN(node) || leftB) out[(*n)++] = node->val;
    goBound2(node->left, leftB, rightB && !node->right, out, n);
    goBound2(node->right, leftB && !node->left, rightB, out, n);
    if (rightB && !isLeafN(node) && !leftB) out[(*n)++] = node->val;
}
int* boundaryTraversal(struct Node* root, int* returnSize) {
    static int out[10005];
    int n = 0;
    if (!root) { *returnSize = 0; return out; }
    if (isLeafN(root)) { out[n++] = root->val; *returnSize = n; return out; }
    out[n++] = root->val;
    goBound2(root->left, 1, 0, out, &n);
    goBound2(root->right, 0, 1, out, &n);
    *returnSize = n;
    return out;
}`
    ))
  ]
});

questions.push({
  id: 24,
  level: "beginner",
  q: "Left View of Binary Tree",
  ask: "Amazon · Microsoft · Adobe",
  links: [GFG("left-view-of-binary-tree"), GFG_ART("print-left-view-binary-tree")],
  a: "The left view is the first node you see at each depth when you stand on the left. Root is always included.\n\nBFS: the first node of every level. DFS: the first time you visit a new depth (preorder, left before right).\n\nBrute stores whole levels and takes index 0. Optimal BFS takes the first of the queue size. More optimal DFS records when depth equals the answer length.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n)", "O(n)", "Full level-order lists, then pick the first value of each list.", tn(
`function leftView(root) {
  if (!root) return [];
  const levels = [];
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
    levels.push(row);
  }
  return levels.map(function (row) { return row[0]; });
}`,
`def left_view(root):
    if root is None:
        return []
    from collections import deque
    levels = []
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
        levels.append(row)
    return [row[0] for row in levels]`,
`    public List<Integer> leftView(TreeNode root) {
        List<Integer> out = new ArrayList<Integer>();
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
            out.add(row.get(0));
        }
        return out;
    }`,
`vector<int> leftView(TreeNode* root) {
    vector<int> out;
    if (!root) return out;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int n = (int)q.size();
        for (int i = 0; i < n; i++) {
            TreeNode* node = q.front(); q.pop();
            if (i == 0) out.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
    }
    return out;
}`,
`int* leftView(struct Node* root, int* returnSize) {
    static int out[10005];
    struct Node* q[10005];
    int qs = 0, qe = 0, n = 0;
    if (!root) { *returnSize = 0; return out; }
    q[qe++] = root;
    while (qs < qe) {
        int sz = qe - qs, i;
        for (i = 0; i < sz; i++) {
            struct Node* node = q[qs++];
            if (i == 0) out[n++] = node->val;
            if (node->left) q[qe++] = node->left;
            if (node->right) q[qe++] = node->right;
        }
    }
    *returnSize = n;
    return out;
}`
    )),
    sol("Optimal", "O(n)", "O(w)", "BFS. When i == 0 in the level loop, that node is the left view. w is the widest level.", tn(
`function leftView(root) {
  if (!root) return [];
  const out = [];
  const q = [root];
  while (q.length) {
    const n = q.length;
    for (let i = 0; i < n; i++) {
      const node = q.shift();
      if (i === 0) out.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
  }
  return out;
}`,
`def left_view(root):
    if root is None:
        return []
    from collections import deque
    out = []
    q = deque([root])
    while q:
        n = len(q)
        for i in range(n):
            node = q.popleft()
            if i == 0:
                out.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
    return out`,
`    public List<Integer> leftView(TreeNode root) {
        List<Integer> out = new ArrayList<Integer>();
        if (root == null) return out;
        Queue<TreeNode> q = new ArrayDeque<TreeNode>();
        q.add(root);
        while (!q.isEmpty()) {
            int n = q.size();
            for (int i = 0; i < n; i++) {
                TreeNode node = q.poll();
                if (i == 0) out.add(node.val);
                if (node.left != null) q.add(node.left);
                if (node.right != null) q.add(node.right);
            }
        }
        return out;
    }`,
`vector<int> leftView(TreeNode* root) {
    vector<int> out;
    if (!root) return out;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int n = (int)q.size();
        for (int i = 0; i < n; i++) {
            TreeNode* node = q.front(); q.pop();
            if (i == 0) out.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
    }
    return out;
}`,
`int* leftView(struct Node* root, int* returnSize) {
    static int out[10005];
    struct Node* q[10005];
    int qs = 0, qe = 0, n = 0;
    if (!root) { *returnSize = 0; return out; }
    q[qe++] = root;
    while (qs < qe) {
        int sz = qe - qs, i;
        for (i = 0; i < sz; i++) {
            struct Node* node = q[qs++];
            if (i == 0) out[n++] = node->val;
            if (node->left) q[qe++] = node->left;
            if (node->right) q[qe++] = node->right;
        }
    }
    *returnSize = n;
    return out;
}`
    )),
    sol("More optimal", "O(n)", "O(h)", "DFS left-first. If depth == out.length this is the first node at that depth. Recursion stack only.", tn(
`function leftView(root) {
  const out = [];
  function go(node, d) {
    if (!node) return;
    if (d === out.length) out.push(node.val);
    go(node.left, d + 1);
    go(node.right, d + 1);
  }
  go(root, 0);
  return out;
}`,
`def left_view(root):
    out = []
    def go(node, d):
        if node is None:
            return
        if d == len(out):
            out.append(node.val)
        go(node.left, d + 1)
        go(node.right, d + 1)
    go(root, 0)
    return out`,
`    public List<Integer> leftView(TreeNode root) {
        List<Integer> out = new ArrayList<Integer>();
        go(root, 0, out);
        return out;
    }
    void go(TreeNode node, int d, List<Integer> out) {
        if (node == null) return;
        if (d == out.size()) out.add(node.val);
        go(node.left, d + 1, out);
        go(node.right, d + 1, out);
    }`,
`void goLeft(TreeNode* node, int d, vector<int>& out) {
    if (!node) return;
    if (d == (int)out.size()) out.push_back(node->val);
    goLeft(node->left, d + 1, out);
    goLeft(node->right, d + 1, out);
}
vector<int> leftView(TreeNode* root) {
    vector<int> out;
    goLeft(root, 0, out);
    return out;
}`,
`void goLeft(struct Node* node, int d, int* out, int* n) {
    if (!node) return;
    if (d == *n) out[(*n)++] = node->val;
    goLeft(node->left, d + 1, out, n);
    goLeft(node->right, d + 1, out, n);
}
int* leftView(struct Node* root, int* returnSize) {
    static int out[10005];
    int n = 0;
    goLeft(root, 0, out, &n);
    *returnSize = n;
    return out;
}`
    ))
  ]
});

module.exports = questions;
