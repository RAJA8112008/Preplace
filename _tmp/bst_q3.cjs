"use strict";
const { tn, sol, LC, GFG, GFG_ART, block, JS_TN, PY_TN, JAVA_TN, CPP_TN, C_TN } = require("./bst_meta.cjs");

const questions = [];

questions.push({
  id: 7,
  level: "intermediate",
  q: "Trim a Binary Search Tree",
  ask: "Amazon · Google · Apple",
  links: [LC("trim-a-binary-search-tree"), GFG_ART("remove-bst-keys-outside-the-given-range")],
  a: "Keep only nodes whose values lie in [low, high]. The remaining nodes must still form a BST, and you should reuse existing nodes (not copy values into new ones).\n\nIf the node is below low, the whole left side is too small — return the trimmed right. If it is above high, return the trimmed left. Otherwise keep the node and trim both children.\n\nBrute collects in-range keys and rebuilds. Optimal is the recursive prune. More optimal walks iteratively when the root itself is outside the window, then trims children.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n)", "O(n)", "Gather every in-range key, sort, rebuild a balanced tree. Correct values, but new nodes and a different shape.", tn(
`function trimBST(root, low, high) {
  const keys = [];
  function go(node) {
    if (!node) return;
    if (node.val >= low && node.val <= high) keys.push(node.val);
    go(node.left);
    go(node.right);
  }
  go(root);
  keys.sort(function (a, b) { return a - b; });
  function build(lo, hi) {
    if (lo > hi) return null;
    const mid = Math.floor((lo + hi) / 2);
    const node = new TreeNode(keys[mid]);
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  }
  return build(0, keys.length - 1);
}`,
`def trim_bst(root, low, high):
    keys = []
    def go(node):
        if node is None:
            return
        if low <= node.val <= high:
            keys.append(node.val)
        go(node.left)
        go(node.right)
    go(root)
    keys.sort()
    def build(lo, hi):
        if lo > hi:
            return None
        mid = (lo + hi) // 2
        node = TreeNode(keys[mid])
        node.left = build(lo, mid - 1)
        node.right = build(mid + 1, hi)
        return node
    return build(0, len(keys) - 1)`,
`    public TreeNode trimBST(TreeNode root, int low, int high) {
        List<Integer> keys = new ArrayList<Integer>();
        collect(root, low, high, keys);
        Collections.sort(keys);
        return build(keys, 0, keys.size() - 1);
    }
    void collect(TreeNode node, int low, int high, List<Integer> keys) {
        if (node == null) return;
        if (node.val >= low && node.val <= high) keys.add(node.val);
        collect(node.left, low, high, keys);
        collect(node.right, low, high, keys);
    }
    TreeNode build(List<Integer> keys, int lo, int hi) {
        if (lo > hi) return null;
        int mid = lo + (hi - lo) / 2;
        TreeNode node = new TreeNode(keys.get(mid));
        node.left = build(keys, lo, mid - 1);
        node.right = build(keys, mid + 1, hi);
        return node;
    }`,
`TreeNode* trimBST(TreeNode* root, int low, int high) {
    vector<int> keys;
    function<void(TreeNode*)> go = [&](TreeNode* node) {
        if (!node) return;
        if (node->val >= low && node->val <= high) keys.push_back(node->val);
        go(node->left);
        go(node->right);
    };
    go(root);
    sort(keys.begin(), keys.end());
    function<TreeNode*(int,int)> build = [&](int lo, int hi) -> TreeNode* {
        if (lo > hi) return nullptr;
        int mid = lo + (hi - lo) / 2;
        TreeNode* node = new TreeNode(keys[mid]);
        node->left = build(lo, mid - 1);
        node->right = build(mid + 1, hi);
        return node;
    };
    return build(0, (int)keys.size() - 1);
}`,
`void collectRange(struct Node* node, int low, int high, int* keys, int* n) {
    if (!node) return;
    if (node->val >= low && node->val <= high) keys[(*n)++] = node->val;
    collectRange(node->left, low, high, keys, n);
    collectRange(node->right, low, high, keys, n);
}
int cmpInt(const void* a, const void* b) { return *(int*)a - *(int*)b; }
struct Node* buildKeys(int* keys, int lo, int hi) {
    if (lo > hi) return NULL;
    int mid = lo + (hi - lo) / 2;
    struct Node* node = newNode(keys[mid]);
    node->left = buildKeys(keys, lo, mid - 1);
    node->right = buildKeys(keys, mid + 1, hi);
    return node;
}
struct Node* trimBST(struct Node* root, int low, int high) {
    int keys[10005], n = 0;
    collectRange(root, low, high, keys, &n);
    qsort(keys, n, sizeof(int), cmpInt);
    return buildKeys(keys, 0, n - 1);
}`
    )),
    sol("Optimal", "O(n)", "O(h)", "Postorder prune using the BST property. Reuse the original nodes. If the root is outside the window, drop it and return one trimmed child.", tn(
`function trimBST(root, low, high) {
  if (!root) return null;
  if (root.val < low) return trimBST(root.right, low, high);
  if (root.val > high) return trimBST(root.left, low, high);
  root.left = trimBST(root.left, low, high);
  root.right = trimBST(root.right, low, high);
  return root;
}`,
`def trim_bst(root, low, high):
    if root is None:
        return None
    if root.val < low:
        return trim_bst(root.right, low, high)
    if root.val > high:
        return trim_bst(root.left, low, high)
    root.left = trim_bst(root.left, low, high)
    root.right = trim_bst(root.right, low, high)
    return root`,
`    public TreeNode trimBST(TreeNode root, int low, int high) {
        if (root == null) return null;
        if (root.val < low) return trimBST(root.right, low, high);
        if (root.val > high) return trimBST(root.left, low, high);
        root.left = trimBST(root.left, low, high);
        root.right = trimBST(root.right, low, high);
        return root;
    }`,
`TreeNode* trimBST(TreeNode* root, int low, int high) {
    if (!root) return nullptr;
    if (root->val < low) return trimBST(root->right, low, high);
    if (root->val > high) return trimBST(root->left, low, high);
    root->left = trimBST(root->left, low, high);
    root->right = trimBST(root->right, low, high);
    return root;
}`,
`struct Node* trimBST(struct Node* root, int low, int high) {
    if (!root) return NULL;
    if (root->val < low) return trimBST(root->right, low, high);
    if (root->val > high) return trimBST(root->left, low, high);
    root->left = trimBST(root->left, low, high);
    root->right = trimBST(root->right, low, high);
    return root;
}`
    )),
    sol("More optimal", "O(n)", "O(h)", "Move the root iteratively until it sits inside [low, high], then recursively trim the two sides. Fewer frames when the original root is far outside the window.", tn(
`function trimBST(root, low, high) {
  while (root && (root.val < low || root.val > high)) {
    root = root.val < low ? root.right : root.left;
  }
  if (!root) return null;
  function trim(node) {
    if (!node) return null;
    if (node.val < low) return trim(node.right);
    if (node.val > high) return trim(node.left);
    node.left = trim(node.left);
    node.right = trim(node.right);
    return node;
  }
  root.left = trim(root.left);
  root.right = trim(root.right);
  return root;
}`,
`def trim_bst(root, low, high):
    while root is not None and (root.val < low or root.val > high):
        root = root.right if root.val < low else root.left
    if root is None:
        return None
    def trim(node):
        if node is None:
            return None
        if node.val < low:
            return trim(node.right)
        if node.val > high:
            return trim(node.left)
        node.left = trim(node.left)
        node.right = trim(node.right)
        return node
    root.left = trim(root.left)
    root.right = trim(root.right)
    return root`,
`    TreeNode trim(TreeNode node, int low, int high) {
        if (node == null) return null;
        if (node.val < low) return trim(node.right, low, high);
        if (node.val > high) return trim(node.left, low, high);
        node.left = trim(node.left, low, high);
        node.right = trim(node.right, low, high);
        return node;
    }
    public TreeNode trimBST(TreeNode root, int low, int high) {
        while (root != null && (root.val < low || root.val > high)) {
            root = root.val < low ? root.right : root.left;
        }
        if (root == null) return null;
        root.left = trim(root.left, low, high);
        root.right = trim(root.right, low, high);
        return root;
    }`,
`TreeNode* trimSide(TreeNode* node, int low, int high) {
    if (!node) return nullptr;
    if (node->val < low) return trimSide(node->right, low, high);
    if (node->val > high) return trimSide(node->left, low, high);
    node->left = trimSide(node->left, low, high);
    node->right = trimSide(node->right, low, high);
    return node;
}
TreeNode* trimBST(TreeNode* root, int low, int high) {
    while (root && (root->val < low || root->val > high))
        root = root->val < low ? root->right : root->left;
    if (!root) return nullptr;
    root->left = trimSide(root->left, low, high);
    root->right = trimSide(root->right, low, high);
    return root;
}`,
`struct Node* trimSide(struct Node* node, int low, int high) {
    if (!node) return NULL;
    if (node->val < low) return trimSide(node->right, low, high);
    if (node->val > high) return trimSide(node->left, low, high);
    node->left = trimSide(node->left, low, high);
    node->right = trimSide(node->right, low, high);
    return node;
}
struct Node* trimBST(struct Node* root, int low, int high) {
    while (root && (root->val < low || root->val > high))
        root = root->val < low ? root->right : root->left;
    if (!root) return NULL;
    root->left = trimSide(root->left, low, high);
    root->right = trimSide(root->right, low, high);
    return root;
}`
    ))
  ]
});

questions.push({
  id: 8,
  level: "beginner",
  q: "Range Sum of BST",
  ask: "Amazon · Meta · Uber",
  links: [LC("range-sum-of-bst"), GFG_ART("count-bst-nodes-that-lie-in-a-given-range")],
  a: "Sum every node value that sits in the closed interval [low, high].\n\nYou may visit the whole tree. A BST lets you skip a side: node.val < low means left is useless; node.val > high means right is useless.\n\nBrute adds after visiting everyone. Optimal prunes in recursion. More optimal is an explicit stack with the same prune.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n)", "O(h)", "DFS every node. Add val when it is inside the interval. Correct on a plain binary tree too.", tn(
`function rangeSumBST(root, low, high) {
  if (!root) return 0;
  const add = root.val >= low && root.val <= high ? root.val : 0;
  return add + rangeSumBST(root.left, low, high) + rangeSumBST(root.right, low, high);
}`,
`def range_sum_bst(root, low, high):
    if root is None:
        return 0
    add = root.val if low <= root.val <= high else 0
    return add + range_sum_bst(root.left, low, high) + range_sum_bst(root.right, low, high)`,
`    public int rangeSumBST(TreeNode root, int low, int high) {
        if (root == null) return 0;
        int add = (root.val >= low && root.val <= high) ? root.val : 0;
        return add + rangeSumBST(root.left, low, high) + rangeSumBST(root.right, low, high);
    }`,
`int rangeSumBST(TreeNode* root, int low, int high) {
    if (!root) return 0;
    int add = (root->val >= low && root->val <= high) ? root->val : 0;
    return add + rangeSumBST(root->left, low, high) + rangeSumBST(root->right, low, high);
}`,
`int rangeSumBST(struct Node* root, int low, int high) {
    if (!root) return 0;
    int add = (root->val >= low && root->val <= high) ? root->val : 0;
    return add + rangeSumBST(root->left, low, high) + rangeSumBST(root->right, low, high);
}`
    )),
    sol("Optimal", "O(n)", "O(h)", "Prune: skip left when node is below low, skip right when node is above high. Best case you only walk the in-range corridor.", tn(
`function rangeSumBST(root, low, high) {
  if (!root) return 0;
  if (root.val < low) return rangeSumBST(root.right, low, high);
  if (root.val > high) return rangeSumBST(root.left, low, high);
  return root.val + rangeSumBST(root.left, low, high) + rangeSumBST(root.right, low, high);
}`,
`def range_sum_bst(root, low, high):
    if root is None:
        return 0
    if root.val < low:
        return range_sum_bst(root.right, low, high)
    if root.val > high:
        return range_sum_bst(root.left, low, high)
    return root.val + range_sum_bst(root.left, low, high) + range_sum_bst(root.right, low, high)`,
`    public int rangeSumBST(TreeNode root, int low, int high) {
        if (root == null) return 0;
        if (root.val < low) return rangeSumBST(root.right, low, high);
        if (root.val > high) return rangeSumBST(root.left, low, high);
        return root.val + rangeSumBST(root.left, low, high) + rangeSumBST(root.right, low, high);
    }`,
`int rangeSumBST(TreeNode* root, int low, int high) {
    if (!root) return 0;
    if (root->val < low) return rangeSumBST(root->right, low, high);
    if (root->val > high) return rangeSumBST(root->left, low, high);
    return root->val + rangeSumBST(root->left, low, high) + rangeSumBST(root->right, low, high);
}`,
`int rangeSumBST(struct Node* root, int low, int high) {
    if (!root) return 0;
    if (root->val < low) return rangeSumBST(root->right, low, high);
    if (root->val > high) return rangeSumBST(root->left, low, high);
    return root->val + rangeSumBST(root->left, low, high) + rangeSumBST(root->right, low, high);
}`
    )),
    sol("More optimal", "O(n)", "O(h)", "Explicit stack, same prune. No recursion. Push only children that can still hold in-range keys.", tn(
`function rangeSumBST(root, low, high) {
  let sum = 0;
  const stack = [];
  if (root) stack.push(root);
  while (stack.length) {
    const node = stack.pop();
    if (node.val >= low && node.val <= high) sum += node.val;
    if (node.left && node.val > low) stack.push(node.left);
    if (node.right && node.val < high) stack.push(node.right);
  }
  return sum;
}`,
`def range_sum_bst(root, low, high):
    total = 0
    stack = []
    if root:
        stack.append(root)
    while stack:
        node = stack.pop()
        if low <= node.val <= high:
            total += node.val
        if node.left and node.val > low:
            stack.append(node.left)
        if node.right and node.val < high:
            stack.append(node.right)
    return total`,
`    public int rangeSumBST(TreeNode root, int low, int high) {
        int sum = 0;
        Deque<TreeNode> stack = new ArrayDeque<TreeNode>();
        if (root != null) stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            if (node.val >= low && node.val <= high) sum += node.val;
            if (node.left != null && node.val > low) stack.push(node.left);
            if (node.right != null && node.val < high) stack.push(node.right);
        }
        return sum;
    }`,
`int rangeSumBST(TreeNode* root, int low, int high) {
    int sum = 0;
    vector<TreeNode*> stack;
    if (root) stack.push_back(root);
    while (!stack.empty()) {
        TreeNode* node = stack.back(); stack.pop_back();
        if (node->val >= low && node->val <= high) sum += node->val;
        if (node->left && node->val > low) stack.push_back(node->left);
        if (node->right && node->val < high) stack.push_back(node->right);
    }
    return sum;
}`,
`int rangeSumBST(struct Node* root, int low, int high) {
    int sum = 0;
    struct Node* stack[10005];
    int sp = 0;
    if (root) stack[sp++] = root;
    while (sp) {
        struct Node* node = stack[--sp];
        if (node->val >= low && node->val <= high) sum += node->val;
        if (node->left && node->val > low) stack[sp++] = node->left;
        if (node->right && node->val < high) stack[sp++] = node->right;
    }
    return sum;
}`
    ))
  ]
});

questions.push({
  id: 9,
  level: "intermediate",
  q: "Inorder Successor in BST",
  ask: "Microsoft · Amazon · Google · Apple",
  links: [LC("inorder-successor-in-bst"), GFG("inorder-successor-in-bst")],
  a: "Given a BST and a node p, return the next node in inorder (the smallest key greater than p), or null if p is the maximum.\n\nIf p has a right child, the successor is the leftmost node in that right subtree. Otherwise walk from the root and remember the last node that was greater than p.\n\nBrute dumps inorder. Optimal uses the BST walk from the root. More optimal branches on whether p.right exists so you often never start at the root.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n)", "O(n)", "Inorder list of nodes, find p, return the next entry. Extra linear memory.", tn(
`function inorderSuccessor(root, p) {
  const nodes = [];
  function go(node) {
    if (!node) return;
    go(node.left);
    nodes.push(node);
    go(node.right);
  }
  go(root);
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i] === p) return i + 1 < nodes.length ? nodes[i + 1] : null;
  }
  return null;
}`,
`def inorder_successor(root, p):
    nodes = []
    def go(node):
        if node is None:
            return
        go(node.left)
        nodes.append(node)
        go(node.right)
    go(root)
    for i, node in enumerate(nodes):
        if node is p:
            return nodes[i + 1] if i + 1 < len(nodes) else None
    return None`,
`    public TreeNode inorderSuccessor(TreeNode root, TreeNode p) {
        List<TreeNode> nodes = new ArrayList<TreeNode>();
        go(root, nodes);
        for (int i = 0; i < nodes.size(); i++) {
            if (nodes.get(i) == p) return i + 1 < nodes.size() ? nodes.get(i + 1) : null;
        }
        return null;
    }
    void go(TreeNode node, List<TreeNode> nodes) {
        if (node == null) return;
        go(node.left, nodes);
        nodes.add(node);
        go(node.right, nodes);
    }`,
`TreeNode* inorderSuccessor(TreeNode* root, TreeNode* p) {
    vector<TreeNode*> nodes;
    function<void(TreeNode*)> go = [&](TreeNode* node) {
        if (!node) return;
        go(node->left);
        nodes.push_back(node);
        go(node->right);
    };
    go(root);
    for (int i = 0; i < (int)nodes.size(); i++)
        if (nodes[i] == p) return i + 1 < (int)nodes.size() ? nodes[i + 1] : nullptr;
    return nullptr;
}`,
`void collectNodes(struct Node* node, struct Node** nodes, int* n) {
    if (!node) return;
    collectNodes(node->left, nodes, n);
    nodes[(*n)++] = node;
    collectNodes(node->right, nodes, n);
}
struct Node* inorderSuccessor(struct Node* root, struct Node* p) {
    struct Node* nodes[10005];
    int n = 0;
    collectNodes(root, nodes, &n);
    for (int i = 0; i < n; i++)
        if (nodes[i] == p) return i + 1 < n ? nodes[i + 1] : NULL;
    return NULL;
}`
    )),
    sol("Optimal", "O(h)", "O(1)", "Walk from the root. Whenever the current node is greater than p, it is a candidate successor — go left to hunt a closer one. Otherwise go right.", tn(
`function inorderSuccessor(root, p) {
  let succ = null;
  let cur = root;
  while (cur) {
    if (p.val < cur.val) {
      succ = cur;
      cur = cur.left;
    } else {
      cur = cur.right;
    }
  }
  return succ;
}`,
`def inorder_successor(root, p):
    succ = None
    cur = root
    while cur:
        if p.val < cur.val:
            succ = cur
            cur = cur.left
        else:
            cur = cur.right
    return succ`,
`    public TreeNode inorderSuccessor(TreeNode root, TreeNode p) {
        TreeNode succ = null, cur = root;
        while (cur != null) {
            if (p.val < cur.val) { succ = cur; cur = cur.left; }
            else cur = cur.right;
        }
        return succ;
    }`,
`TreeNode* inorderSuccessor(TreeNode* root, TreeNode* p) {
    TreeNode* succ = nullptr;
    TreeNode* cur = root;
    while (cur) {
        if (p->val < cur->val) { succ = cur; cur = cur->left; }
        else cur = cur->right;
    }
    return succ;
}`,
`struct Node* inorderSuccessor(struct Node* root, struct Node* p) {
    struct Node* succ = NULL;
    struct Node* cur = root;
    while (cur) {
        if (p->val < cur->val) { succ = cur; cur = cur->left; }
        else cur = cur->right;
    }
    return succ;
}`
    )),
    sol("More optimal", "O(h)", "O(1)", "If p has a right child, successor is leftmost there — O(h) on that spine only. Else fall back to the root walk. Same worst case, often shorter.", tn(
`function inorderSuccessor(root, p) {
  if (p.right) {
    let n = p.right;
    while (n.left) n = n.left;
    return n;
  }
  let succ = null;
  let cur = root;
  while (cur) {
    if (p.val < cur.val) {
      succ = cur;
      cur = cur.left;
    } else {
      cur = cur.right;
    }
  }
  return succ;
}`,
`def inorder_successor(root, p):
    if p.right:
        n = p.right
        while n.left:
            n = n.left
        return n
    succ = None
    cur = root
    while cur:
        if p.val < cur.val:
            succ = cur
            cur = cur.left
        else:
            cur = cur.right
    return succ`,
`    public TreeNode inorderSuccessor(TreeNode root, TreeNode p) {
        if (p.right != null) {
            TreeNode n = p.right;
            while (n.left != null) n = n.left;
            return n;
        }
        TreeNode succ = null, cur = root;
        while (cur != null) {
            if (p.val < cur.val) { succ = cur; cur = cur.left; }
            else cur = cur.right;
        }
        return succ;
    }`,
`TreeNode* inorderSuccessor(TreeNode* root, TreeNode* p) {
    if (p->right) {
        TreeNode* n = p->right;
        while (n->left) n = n->left;
        return n;
    }
    TreeNode* succ = nullptr;
    TreeNode* cur = root;
    while (cur) {
        if (p->val < cur->val) { succ = cur; cur = cur->left; }
        else cur = cur->right;
    }
    return succ;
}`,
`struct Node* inorderSuccessor(struct Node* root, struct Node* p) {
    if (p->right) {
        struct Node* n = p->right;
        while (n->left) n = n->left;
        return n;
    }
    struct Node* succ = NULL;
    struct Node* cur = root;
    while (cur) {
        if (p->val < cur->val) { succ = cur; cur = cur->left; }
        else cur = cur->right;
    }
    return succ;
}`
    ))
  ]
});

module.exports = questions;
