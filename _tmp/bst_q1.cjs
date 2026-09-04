"use strict";
const { tn, tnJavaFull, sol, LC, GFG, GFG_ART, block, JS_TN, PY_TN, JAVA_TN, CPP_TN, C_TN, JS_LN, PY_LN, JAVA_LN, CPP_LN, C_LN } = require("./bst_meta.cjs");

const questions = [];

questions.push({
  id: 1,
  level: "beginner",
  q: "Search in a Binary Search Tree",
  ask: "Amazon · Google · Microsoft",
  links: [LC("search-in-a-binary-search-tree"), GFG("search-a-node-in-bst")],
  a: "Return the subtree rooted at the node whose value equals val, or null if that key is missing.\n\nThe BST property lets you walk one path: go left when val is smaller, right when it is larger.\n\nBrute collects every node and scans. Optimal recurses on one child. More optimal is the same walk in a loop with O(1) extra memory.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n)", "O(n)", "Ignore the BST. DFS every node into a list, then scan for val. Correct on any binary tree, but you throw away the ordering.", tn(
`function searchBST(root, val) {
  const nodes = [];
  function go(node) {
    if (!node) return;
    nodes.push(node);
    go(node.left);
    go(node.right);
  }
  go(root);
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].val === val) return nodes[i];
  }
  return null;
}`,
`def search_bst(root, val):
    nodes = []
    def go(node):
        if node is None:
            return
        nodes.append(node)
        go(node.left)
        go(node.right)
    go(root)
    for node in nodes:
        if node.val == val:
            return node
    return None`,
`    public TreeNode searchBST(TreeNode root, int val) {
        List<TreeNode> nodes = new ArrayList<TreeNode>();
        go(root, nodes);
        for (TreeNode node : nodes) {
            if (node.val == val) return node;
        }
        return null;
    }
    void go(TreeNode node, List<TreeNode> nodes) {
        if (node == null) return;
        nodes.add(node);
        go(node.left, nodes);
        go(node.right, nodes);
    }`,
`TreeNode* searchBST(TreeNode* root, int val) {
    vector<TreeNode*> nodes;
    function<void(TreeNode*)> go = [&](TreeNode* node) {
        if (!node) return;
        nodes.push_back(node);
        go(node->left);
        go(node->right);
    };
    go(root);
    for (TreeNode* node : nodes) if (node->val == val) return node;
    return nullptr;
}`,
`void goCollect(struct Node* node, struct Node** nodes, int* n) {
    if (!node) return;
    nodes[(*n)++] = node;
    goCollect(node->left, nodes, n);
    goCollect(node->right, nodes, n);
}
struct Node* searchBST(struct Node* root, int val) {
    struct Node* nodes[10005];
    int n = 0;
    goCollect(root, nodes, &n);
    for (int i = 0; i < n; i++) if (nodes[i]->val == val) return nodes[i];
    return NULL;
}`
    )),
    sol("Optimal", "O(h)", "O(h)", "Recurse on one child. Each call compares val with the node and drops a whole subtree. Stack depth is the height.", tn(
`function searchBST(root, val) {
  if (!root || root.val === val) return root;
  if (val < root.val) return searchBST(root.left, val);
  return searchBST(root.right, val);
}`,
`def search_bst(root, val):
    if root is None or root.val == val:
        return root
    if val < root.val:
        return search_bst(root.left, val)
    return search_bst(root.right, val)`,
`    public TreeNode searchBST(TreeNode root, int val) {
        if (root == null || root.val == val) return root;
        if (val < root.val) return searchBST(root.left, val);
        return searchBST(root.right, val);
    }`,
`TreeNode* searchBST(TreeNode* root, int val) {
    if (!root || root->val == val) return root;
    if (val < root->val) return searchBST(root->left, val);
    return searchBST(root->right, val);
}`,
`struct Node* searchBST(struct Node* root, int val) {
    if (!root || root->val == val) return root;
    if (val < root->val) return searchBST(root->left, val);
    return searchBST(root->right, val);
}`
    )),
    sol("More optimal", "O(h)", "O(1)", "Same comparisons in a while loop. No call stack. Returns the node or null when the walk falls off.", tn(
`function searchBST(root, val) {
  let cur = root;
  while (cur && cur.val !== val) {
    cur = val < cur.val ? cur.left : cur.right;
  }
  return cur;
}`,
`def search_bst(root, val):
    cur = root
    while cur is not None and cur.val != val:
        cur = cur.left if val < cur.val else cur.right
    return cur`,
`    public TreeNode searchBST(TreeNode root, int val) {
        TreeNode cur = root;
        while (cur != null && cur.val != val) {
            cur = val < cur.val ? cur.left : cur.right;
        }
        return cur;
    }`,
`TreeNode* searchBST(TreeNode* root, int val) {
    TreeNode* cur = root;
    while (cur && cur->val != val) cur = val < cur->val ? cur->left : cur->right;
    return cur;
}`,
`struct Node* searchBST(struct Node* root, int val) {
    struct Node* cur = root;
    while (cur && cur->val != val) cur = val < cur->val ? cur->left : cur->right;
    return cur;
}`
    ))
  ]
});

questions.push({
  id: 2,
  level: "beginner",
  q: "Insert into a Binary Search Tree",
  ask: "Amazon · Meta · Apple · Microsoft",
  links: [LC("insert-into-a-binary-search-tree"), GFG("insert-a-node-in-a-bst")],
  a: "Insert val as a new leaf so the tree stays a BST. LeetCode guarantees val is not already present.\n\nWalk like search until you hit null, then create the node. Return the (unchanged) root.\n\nBrute dumps keys, adds val, and rebuilds. Optimal recurses. More optimal inserts with a parent pointer in a loop.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n)", "O(n)", "Collect every key, append val, sort, and rebuild a balanced tree from the middle. Extra arrays; you never use the existing shape.", tn(
`function insertIntoBST(root, val) {
  const keys = [];
  function go(node) {
    if (!node) return;
    keys.push(node.val);
    go(node.left);
    go(node.right);
  }
  go(root);
  keys.push(val);
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
`def insert_into_bst(root, val):
    keys = []
    def go(node):
        if node is None:
            return
        keys.append(node.val)
        go(node.left)
        go(node.right)
    go(root)
    keys.append(val)
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
`    public TreeNode insertIntoBST(TreeNode root, int val) {
        List<Integer> keys = new ArrayList<Integer>();
        collect(root, keys);
        keys.add(val);
        Collections.sort(keys);
        return build(keys, 0, keys.size() - 1);
    }
    void collect(TreeNode node, List<Integer> keys) {
        if (node == null) return;
        keys.add(node.val);
        collect(node.left, keys);
        collect(node.right, keys);
    }
    TreeNode build(List<Integer> keys, int lo, int hi) {
        if (lo > hi) return null;
        int mid = lo + (hi - lo) / 2;
        TreeNode node = new TreeNode(keys.get(mid));
        node.left = build(keys, lo, mid - 1);
        node.right = build(keys, mid + 1, hi);
        return node;
    }`,
`TreeNode* insertIntoBST(TreeNode* root, int val) {
    vector<int> keys;
    function<void(TreeNode*)> go = [&](TreeNode* node) {
        if (!node) return;
        keys.push_back(node->val);
        go(node->left);
        go(node->right);
    };
    go(root);
    keys.push_back(val);
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
`void collectKeys(struct Node* node, int* keys, int* n) {
    if (!node) return;
    keys[(*n)++] = node->val;
    collectKeys(node->left, keys, n);
    collectKeys(node->right, keys, n);
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
struct Node* insertIntoBST(struct Node* root, int val) {
    int keys[10005], n = 0;
    collectKeys(root, keys, &n);
    keys[n++] = val;
    qsort(keys, n, sizeof(int), cmpInt);
    return buildKeys(keys, 0, n - 1);
}`
    )),
    sol("Optimal", "O(h)", "O(h)", "Recurse left or right and assign the returned child. When the child is null, allocate the new leaf. Root is returned unchanged unless the tree was empty.", tn(
`function insertIntoBST(root, val) {
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left = insertIntoBST(root.left, val);
  else root.right = insertIntoBST(root.right, val);
  return root;
}`,
`def insert_into_bst(root, val):
    if root is None:
        return TreeNode(val)
    if val < root.val:
        root.left = insert_into_bst(root.left, val)
    else:
        root.right = insert_into_bst(root.right, val)
    return root`,
`    public TreeNode insertIntoBST(TreeNode root, int val) {
        if (root == null) return new TreeNode(val);
        if (val < root.val) root.left = insertIntoBST(root.left, val);
        else root.right = insertIntoBST(root.right, val);
        return root;
    }`,
`TreeNode* insertIntoBST(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) root->left = insertIntoBST(root->left, val);
    else root->right = insertIntoBST(root->right, val);
    return root;
}`,
`struct Node* insertIntoBST(struct Node* root, int val) {
    if (!root) return newNode(val);
    if (val < root->val) root->left = insertIntoBST(root->left, val);
    else root->right = insertIntoBST(root->right, val);
    return root;
}`
    )),
    sol("More optimal", "O(h)", "O(1)", "Iterative: if the tree is empty, return a new root. Else walk until the next child is null and attach there. No recursion.", tn(
`function insertIntoBST(root, val) {
  const fresh = new TreeNode(val);
  if (!root) return fresh;
  let cur = root;
  while (true) {
    if (val < cur.val) {
      if (!cur.left) { cur.left = fresh; break; }
      cur = cur.left;
    } else {
      if (!cur.right) { cur.right = fresh; break; }
      cur = cur.right;
    }
  }
  return root;
}`,
`def insert_into_bst(root, val):
    fresh = TreeNode(val)
    if root is None:
        return fresh
    cur = root
    while True:
        if val < cur.val:
            if cur.left is None:
                cur.left = fresh
                break
            cur = cur.left
        else:
            if cur.right is None:
                cur.right = fresh
                break
            cur = cur.right
    return root`,
`    public TreeNode insertIntoBST(TreeNode root, int val) {
        TreeNode fresh = new TreeNode(val);
        if (root == null) return fresh;
        TreeNode cur = root;
        while (true) {
            if (val < cur.val) {
                if (cur.left == null) { cur.left = fresh; break; }
                cur = cur.left;
            } else {
                if (cur.right == null) { cur.right = fresh; break; }
                cur = cur.right;
            }
        }
        return root;
    }`,
`TreeNode* insertIntoBST(TreeNode* root, int val) {
    TreeNode* fresh = new TreeNode(val);
    if (!root) return fresh;
    TreeNode* cur = root;
    while (true) {
        if (val < cur->val) {
            if (!cur->left) { cur->left = fresh; break; }
            cur = cur->left;
        } else {
            if (!cur->right) { cur->right = fresh; break; }
            cur = cur->right;
        }
    }
    return root;
}`,
`struct Node* insertIntoBST(struct Node* root, int val) {
    struct Node* fresh = newNode(val);
    if (!root) return fresh;
    struct Node* cur = root;
    while (1) {
        if (val < cur->val) {
            if (!cur->left) { cur->left = fresh; break; }
            cur = cur->left;
        } else {
            if (!cur->right) { cur->right = fresh; break; }
            cur = cur->right;
        }
    }
    return root;
}`
    ))
  ]
});

questions.push({
  id: 3,
  level: "intermediate",
  q: "Delete Node in a BST",
  ask: "Google · Amazon · Meta · Uber",
  links: [LC("delete-node-in-a-bst"), GFG("delete-a-node-from-bst")],
  a: "Delete the node whose value is key and return the new root. The tree must stay a BST.\n\nZero children: drop it. One child: splice that child in. Two children: copy the inorder successor (leftmost of the right subtree) into the node, then delete the successor.\n\nBrute rebuilds from the remaining keys. Optimal is recursive Hibbard delete. More optimal finds the node with a parent pointer and splices in a loop.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n)", "O(n)", "Inorder dump every key except key, then rebuild a balanced BST from the sorted list. Simple, but you throw away the original shape.", tn(
`function deleteNode(root, key) {
  const keys = [];
  function go(node) {
    if (!node) return;
    if (node.val !== key) keys.push(node.val);
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
`def delete_node(root, key):
    keys = []
    def go(node):
        if node is None:
            return
        if node.val != key:
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
`    public TreeNode deleteNode(TreeNode root, int key) {
        List<Integer> keys = new ArrayList<Integer>();
        collect(root, key, keys);
        Collections.sort(keys);
        return build(keys, 0, keys.size() - 1);
    }
    void collect(TreeNode node, int key, List<Integer> keys) {
        if (node == null) return;
        if (node.val != key) keys.add(node.val);
        collect(node.left, key, keys);
        collect(node.right, key, keys);
    }
    TreeNode build(List<Integer> keys, int lo, int hi) {
        if (lo > hi) return null;
        int mid = lo + (hi - lo) / 2;
        TreeNode node = new TreeNode(keys.get(mid));
        node.left = build(keys, lo, mid - 1);
        node.right = build(keys, mid + 1, hi);
        return node;
    }`,
`TreeNode* deleteNode(TreeNode* root, int key) {
    vector<int> keys;
    function<void(TreeNode*)> go = [&](TreeNode* node) {
        if (!node) return;
        if (node->val != key) keys.push_back(node->val);
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
`void collectExcept(struct Node* node, int key, int* keys, int* n) {
    if (!node) return;
    if (node->val != key) keys[(*n)++] = node->val;
    collectExcept(node->left, key, keys, n);
    collectExcept(node->right, key, keys, n);
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
struct Node* deleteNode(struct Node* root, int key) {
    int keys[10005], n = 0;
    collectExcept(root, key, keys, &n);
    qsort(keys, n, sizeof(int), cmpInt);
    return buildKeys(keys, 0, n - 1);
}`
    )),
    sol("Optimal", "O(h)", "O(h)", "Recurse to the node. Leaf or one child: return the other child. Two children: copy leftmost of right into node.val, then delete that successor from the right subtree.", tn(
`function deleteNode(root, key) {
  if (!root) return null;
  if (key < root.val) root.left = deleteNode(root.left, key);
  else if (key > root.val) root.right = deleteNode(root.right, key);
  else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    let succ = root.right;
    while (succ.left) succ = succ.left;
    root.val = succ.val;
    root.right = deleteNode(root.right, succ.val);
  }
  return root;
}`,
`def delete_node(root, key):
    if root is None:
        return None
    if key < root.val:
        root.left = delete_node(root.left, key)
    elif key > root.val:
        root.right = delete_node(root.right, key)
    else:
        if root.left is None:
            return root.right
        if root.right is None:
            return root.left
        succ = root.right
        while succ.left:
            succ = succ.left
        root.val = succ.val
        root.right = delete_node(root.right, succ.val)
    return root`,
`    public TreeNode deleteNode(TreeNode root, int key) {
        if (root == null) return null;
        if (key < root.val) root.left = deleteNode(root.left, key);
        else if (key > root.val) root.right = deleteNode(root.right, key);
        else {
            if (root.left == null) return root.right;
            if (root.right == null) return root.left;
            TreeNode succ = root.right;
            while (succ.left != null) succ = succ.left;
            root.val = succ.val;
            root.right = deleteNode(root.right, succ.val);
        }
        return root;
    }`,
`TreeNode* deleteNode(TreeNode* root, int key) {
    if (!root) return nullptr;
    if (key < root->val) root->left = deleteNode(root->left, key);
    else if (key > root->val) root->right = deleteNode(root->right, key);
    else {
        if (!root->left) return root->right;
        if (!root->right) return root->left;
        TreeNode* succ = root->right;
        while (succ->left) succ = succ->left;
        root->val = succ->val;
        root->right = deleteNode(root->right, succ->val);
    }
    return root;
}`,
`struct Node* deleteNode(struct Node* root, int key) {
    if (!root) return NULL;
    if (key < root->val) root->left = deleteNode(root->left, key);
    else if (key > root->val) root->right = deleteNode(root->right, key);
    else {
        if (!root->left) return root->right;
        if (!root->right) return root->left;
        struct Node* succ = root->right;
        while (succ->left) succ = succ->left;
        root->val = succ->val;
        root->right = deleteNode(root->right, succ->val);
    }
    return root;
}`
    )),
    sol("More optimal", "O(h)", "O(1)", "Iterative search with a parent pointer. Splice zero/one-child nodes directly. For two children, copy the successor value then unlink the successor (it has no left child).", tn(
`function deleteNode(root, key) {
  function splice(parent, node, child) {
    if (!parent) return child;
    if (parent.left === node) parent.left = child;
    else parent.right = child;
    return root;
  }
  let parent = null;
  let cur = root;
  while (cur && cur.val !== key) {
    parent = cur;
    cur = key < cur.val ? cur.left : cur.right;
  }
  if (!cur) return root;
  if (!cur.left) return splice(parent, cur, cur.right);
  if (!cur.right) return splice(parent, cur, cur.left);
  let sp = cur;
  let succ = cur.right;
  while (succ.left) {
    sp = succ;
    succ = succ.left;
  }
  cur.val = succ.val;
  if (sp.left === succ) sp.left = succ.right;
  else sp.right = succ.right;
  return root;
}`,
`def delete_node(root, key):
    def splice(parent, node, child):
        if parent is None:
            return child
        if parent.left is node:
            parent.left = child
        else:
            parent.right = child
        return root
    parent = None
    cur = root
    while cur is not None and cur.val != key:
        parent = cur
        cur = cur.left if key < cur.val else cur.right
    if cur is None:
        return root
    if cur.left is None:
        return splice(parent, cur, cur.right)
    if cur.right is None:
        return splice(parent, cur, cur.left)
    sp = cur
    succ = cur.right
    while succ.left:
        sp = succ
        succ = succ.left
    cur.val = succ.val
    if sp.left is succ:
        sp.left = succ.right
    else:
        sp.right = succ.right
    return root`,
`    TreeNode splice(TreeNode root, TreeNode parent, TreeNode node, TreeNode child) {
        if (parent == null) return child;
        if (parent.left == node) parent.left = child;
        else parent.right = child;
        return root;
    }
    public TreeNode deleteNode(TreeNode root, int key) {
        TreeNode parent = null, cur = root;
        while (cur != null && cur.val != key) {
            parent = cur;
            cur = key < cur.val ? cur.left : cur.right;
        }
        if (cur == null) return root;
        if (cur.left == null) return splice(root, parent, cur, cur.right);
        if (cur.right == null) return splice(root, parent, cur, cur.left);
        TreeNode sp = cur, succ = cur.right;
        while (succ.left != null) { sp = succ; succ = succ.left; }
        cur.val = succ.val;
        if (sp.left == succ) sp.left = succ.right;
        else sp.right = succ.right;
        return root;
    }`,
`TreeNode* spliceNode(TreeNode* root, TreeNode* parent, TreeNode* node, TreeNode* child) {
    if (!parent) return child;
    if (parent->left == node) parent->left = child;
    else parent->right = child;
    return root;
}
TreeNode* deleteNode(TreeNode* root, int key) {
    TreeNode* parent = nullptr;
    TreeNode* cur = root;
    while (cur && cur->val != key) {
        parent = cur;
        cur = key < cur->val ? cur->left : cur->right;
    }
    if (!cur) return root;
    if (!cur->left) return spliceNode(root, parent, cur, cur->right);
    if (!cur->right) return spliceNode(root, parent, cur, cur->left);
    TreeNode* sp = cur;
    TreeNode* succ = cur->right;
    while (succ->left) { sp = succ; succ = succ->left; }
    cur->val = succ->val;
    if (sp->left == succ) sp->left = succ->right;
    else sp->right = succ->right;
    return root;
}`,
`struct Node* spliceNode(struct Node* root, struct Node* parent, struct Node* node, struct Node* child) {
    if (!parent) return child;
    if (parent->left == node) parent->left = child;
    else parent->right = child;
    return root;
}
struct Node* deleteNode(struct Node* root, int key) {
    struct Node* parent = NULL;
    struct Node* cur = root;
    while (cur && cur->val != key) {
        parent = cur;
        cur = key < cur->val ? cur->left : cur->right;
    }
    if (!cur) return root;
    if (!cur->left) return spliceNode(root, parent, cur, cur->right);
    if (!cur->right) return spliceNode(root, parent, cur, cur->left);
    struct Node* sp = cur;
    struct Node* succ = cur->right;
    while (succ->left) { sp = succ; succ = succ->left; }
    cur->val = succ->val;
    if (sp->left == succ) sp->left = succ->right;
    else sp->right = succ->right;
    return root;
}`
    ))
  ]
});

module.exports = questions;
