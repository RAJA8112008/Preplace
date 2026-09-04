"use strict";
const { tn, sol, LC, GFG, GFG_ART, block, JS_TN, PY_TN, JAVA_TN, CPP_TN, C_TN } = require("./bst_meta.cjs");

const questions = [];

questions.push({
  id: 14,
  level: "intermediate",
  q: "Kth Largest Element in BST",
  ask: "Amazon · Microsoft · Google · Adobe",
  links: [GFG("kth-largest-element-in-bst"), GFG_ART("kth-largest-element-in-bst-when-modification-to-bst-is-not-allowed")],
  a: "Return the k-th largest key in a BST (1-based). Inorder is sorted ascending, so reverse inorder (right, node, left) is sorted descending.\n\nBrute stores the full inorder list and indexes from the end. Optimal reverse-inorders and stops after k visits. More optimal is Morris reverse inorder so extra memory is O(1).\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n)", "O(n)", "Inorder dump, then return vals[n - k]. Extra array of every key.", tn(
`function kthLargest(root, k) {
  const vals = [];
  function go(node) {
    if (!node) return;
    go(node.left);
    vals.push(node.val);
    go(node.right);
  }
  go(root);
  return vals[vals.length - k];
}`,
`def kth_largest(root, k):
    vals = []
    def go(node):
        if node is None:
            return
        go(node.left)
        vals.append(node.val)
        go(node.right)
    go(root)
    return vals[len(vals) - k]`,
`    public int kthLargest(TreeNode root, int k) {
        List<Integer> vals = new ArrayList<Integer>();
        go(root, vals);
        return vals.get(vals.size() - k);
    }
    void go(TreeNode node, List<Integer> vals) {
        if (node == null) return;
        go(node.left, vals);
        vals.add(node.val);
        go(node.right, vals);
    }`,
`int kthLargest(TreeNode* root, int k) {
    vector<int> vals;
    function<void(TreeNode*)> go = [&](TreeNode* node) {
        if (!node) return;
        go(node->left);
        vals.push_back(node->val);
        go(node->right);
    };
    go(root);
    return vals[(int)vals.size() - k];
}`,
`void inorderVals(struct Node* node, int* vals, int* n) {
    if (!node) return;
    inorderVals(node->left, vals, n);
    vals[(*n)++] = node->val;
    inorderVals(node->right, vals, n);
}
int kthLargest(struct Node* root, int k) {
    int vals[10005], n = 0;
    inorderVals(root, vals, &n);
    return vals[n - k];
}`
    )),
    sol("Optimal", "O(h + k)", "O(h)", "Reverse inorder. Decrement k at each visit. When k hits 0, that value is the answer. Stop walking.", tn(
`function kthLargest(root, k) {
  let ans = 0;
  function go(node) {
    if (!node || k === 0) return;
    go(node.right);
    if (k === 0) return;
    k--;
    if (k === 0) ans = node.val;
    go(node.left);
  }
  go(root);
  return ans;
}`,
`def kth_largest(root, k):
    ans = [0]
    def go(node):
        nonlocal k
        if node is None or k == 0:
            return
        go(node.right)
        if k == 0:
            return
        k -= 1
        if k == 0:
            ans[0] = node.val
            return
        go(node.left)
    go(root)
    return ans[0]`,
`    int kLeft, ans;
    public int kthLargest(TreeNode root, int k) {
        kLeft = k;
        ans = 0;
        go(root);
        return ans;
    }
    void go(TreeNode node) {
        if (node == null || kLeft == 0) return;
        go(node.right);
        if (kLeft == 0) return;
        kLeft--;
        if (kLeft == 0) { ans = node.val; return; }
        go(node.left);
    }`,
`int kthLargest(TreeNode* root, int k) {
    int kLeft = k, ans = 0;
    function<void(TreeNode*)> go = [&](TreeNode* node) {
        if (!node || kLeft == 0) return;
        go(node->right);
        if (kLeft == 0) return;
        kLeft--;
        if (kLeft == 0) { ans = node->val; return; }
        go(node->left);
    };
    go(root);
    return ans;
}`,
`void kthGo(struct Node* node, int* k, int* ans) {
    if (!node || *k == 0) return;
    kthGo(node->right, k, ans);
    if (*k == 0) return;
    (*k)--;
    if (*k == 0) { *ans = node->val; return; }
    kthGo(node->left, k, ans);
}
int kthLargest(struct Node* root, int k) {
    int ans = 0;
    kthGo(root, &k, &ans);
    return ans;
}`
    )),
    sol("More optimal", "O(n)", "O(1)", "Morris reverse inorder: thread the successor (leftmost of the right, via left pointers of the right spine). Visit without a stack, stop at k.", tn(
`function kthLargest(root, k) {
  let cur = root;
  while (cur) {
    if (!cur.right) {
      k--;
      if (k === 0) return cur.val;
      cur = cur.left;
    } else {
      let succ = cur.right;
      while (succ.left && succ.left !== cur) succ = succ.left;
      if (!succ.left) {
        succ.left = cur;
        cur = cur.right;
      } else {
        succ.left = null;
        k--;
        if (k === 0) return cur.val;
        cur = cur.left;
      }
    }
  }
  return 0;
}`,
`def kth_largest(root, k):
    cur = root
    while cur:
        if cur.right is None:
            k -= 1
            if k == 0:
                return cur.val
            cur = cur.left
        else:
            succ = cur.right
            while succ.left and succ.left is not cur:
                succ = succ.left
            if succ.left is None:
                succ.left = cur
                cur = cur.right
            else:
                succ.left = None
                k -= 1
                if k == 0:
                    return cur.val
                cur = cur.left
    return 0`,
`    public int kthLargest(TreeNode root, int k) {
        TreeNode cur = root;
        while (cur != null) {
            if (cur.right == null) {
                if (--k == 0) return cur.val;
                cur = cur.left;
            } else {
                TreeNode succ = cur.right;
                while (succ.left != null && succ.left != cur) succ = succ.left;
                if (succ.left == null) {
                    succ.left = cur;
                    cur = cur.right;
                } else {
                    succ.left = null;
                    if (--k == 0) return cur.val;
                    cur = cur.left;
                }
            }
        }
        return 0;
    }`,
`int kthLargest(TreeNode* root, int k) {
    TreeNode* cur = root;
    while (cur) {
        if (!cur->right) {
            if (--k == 0) return cur->val;
            cur = cur->left;
        } else {
            TreeNode* succ = cur->right;
            while (succ->left && succ->left != cur) succ = succ->left;
            if (!succ->left) { succ->left = cur; cur = cur->right; }
            else {
                succ->left = nullptr;
                if (--k == 0) return cur->val;
                cur = cur->left;
            }
        }
    }
    return 0;
}`,
`int kthLargest(struct Node* root, int k) {
    struct Node* cur = root;
    while (cur) {
        if (!cur->right) {
            if (--k == 0) return cur->val;
            cur = cur->left;
        } else {
            struct Node* succ = cur->right;
            while (succ->left && succ->left != cur) succ = succ->left;
            if (!succ->left) { succ->left = cur; cur = cur->right; }
            else {
                succ->left = NULL;
                if (--k == 0) return cur->val;
                cur = cur->left;
            }
        }
    }
    return 0;
}`
    ))
  ]
});

questions.push({
  id: 15,
  level: "beginner",
  q: "Two Sum IV - Input is a BST",
  ask: "Amazon · Google · Meta · Uber",
  links: [LC("two-sum-iv-input-is-a-bst"), GFG_ART("find-a-pair-with-given-sum-in-bst")],
  a: "Return true if two distinct nodes sum to k.\n\nOn any tree a hash set of seen values works: at each node ask whether k - val was already seen. On a BST you can also dump inorder (sorted) and two-pointer. Two BST iterators, one from the left and one from the right, do the same with O(h) extra memory.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n²)", "O(h)", "For each node, DFS the rest of the tree looking for k - val. Nested walks. No extra set.", tn(
`function findTarget(root, k) {
  function exists(node, skip, val) {
    if (!node) return false;
    if (node !== skip && node.val === val) return true;
    return exists(node.left, skip, val) || exists(node.right, skip, val);
  }
  function go(node) {
    if (!node) return false;
    if (exists(root, node, k - node.val)) return true;
    return go(node.left) || go(node.right);
  }
  return go(root);
}`,
`def find_target(root, k):
    def exists(node, skip, val):
        if node is None:
            return False
        if node is not skip and node.val == val:
            return True
        return exists(node.left, skip, val) or exists(node.right, skip, val)
    def go(node):
        if node is None:
            return False
        if exists(root, node, k - node.val):
            return True
        return go(node.left) or go(node.right)
    return go(root)`,
`    boolean exists(TreeNode node, TreeNode skip, int val) {
        if (node == null) return false;
        if (node != skip && node.val == val) return true;
        return exists(node.left, skip, val) || exists(node.right, skip, val);
    }
    boolean go(TreeNode root, TreeNode node, int k) {
        if (node == null) return false;
        if (exists(root, node, k - node.val)) return true;
        return go(root, node.left, k) || go(root, node.right, k);
    }
    public boolean findTarget(TreeNode root, int k) {
        return go(root, root, k);
    }`,
`bool existsSkip(TreeNode* node, TreeNode* skip, int val) {
    if (!node) return false;
    if (node != skip && node->val == val) return true;
    return existsSkip(node->left, skip, val) || existsSkip(node->right, skip, val);
}
bool goFind(TreeNode* root, TreeNode* node, int k) {
    if (!node) return false;
    if (existsSkip(root, node, k - node->val)) return true;
    return goFind(root, node->left, k) || goFind(root, node->right, k);
}
bool findTarget(TreeNode* root, int k) { return goFind(root, root, k); }`,
`bool existsSkip(struct Node* node, struct Node* skip, int val) {
    if (!node) return false;
    if (node != skip && node->val == val) return true;
    return existsSkip(node->left, skip, val) || existsSkip(node->right, skip, val);
}
bool goFind(struct Node* root, struct Node* node, int k) {
    if (!node) return false;
    if (existsSkip(root, node, k - node->val)) return true;
    return goFind(root, node->left, k) || goFind(root, node->right, k);
}
bool findTarget(struct Node* root, int k) { return goFind(root, root, k); }`
    )),
    sol("Optimal", "O(n)", "O(n)", "Hash set of visited values. DFS: if k - val is in the set, done; else add val and continue. Works on any binary tree.", tn(
`function findTarget(root, k) {
  const seen = new Set();
  function go(node) {
    if (!node) return false;
    if (seen.has(k - node.val)) return true;
    seen.add(node.val);
    return go(node.left) || go(node.right);
  }
  return go(root);
}`,
`def find_target(root, k):
    seen = set()
    def go(node):
        if node is None:
            return False
        if (k - node.val) in seen:
            return True
        seen.add(node.val)
        return go(node.left) or go(node.right)
    return go(root)`,
`    public boolean findTarget(TreeNode root, int k) {
        Set<Integer> seen = new HashSet<Integer>();
        return go(root, k, seen);
    }
    boolean go(TreeNode node, int k, Set<Integer> seen) {
        if (node == null) return false;
        if (seen.contains(k - node.val)) return true;
        seen.add(node.val);
        return go(node.left, k, seen) || go(node.right, k, seen);
    }`,
`bool findTarget(TreeNode* root, int k) {
    unordered_set<int> seen;
    function<bool(TreeNode*)> go = [&](TreeNode* node) {
        if (!node) return false;
        if (seen.count(k - node->val)) return true;
        seen.insert(node->val);
        return go(node->left) || go(node->right);
    };
    return go(root);
}`,
`bool goSeen(struct Node* node, int k, int* seen, int* n) {
    int i;
    if (!node) return false;
    for (i = 0; i < *n; i++) if (seen[i] == k - node->val) return true;
    seen[(*n)++] = node->val;
    return goSeen(node->left, k, seen, n) || goSeen(node->right, k, seen, n);
}
bool findTarget(struct Node* root, int k) {
    int seen[10005], n = 0;
    return goSeen(root, k, seen, &n);
}`
    )),
    sol("More optimal", "O(n)", "O(n)", "Inorder array is sorted. Two pointers from both ends. Uses the BST. Space is still linear for the array; two iterators would drop it to O(h).", tn(
`function findTarget(root, k) {
  const vals = [];
  function go(node) {
    if (!node) return;
    go(node.left);
    vals.push(node.val);
    go(node.right);
  }
  go(root);
  let i = 0;
  let j = vals.length - 1;
  while (i < j) {
    const s = vals[i] + vals[j];
    if (s === k) return true;
    if (s < k) i++;
    else j--;
  }
  return false;
}`,
`def find_target(root, k):
    vals = []
    def go(node):
        if node is None:
            return
        go(node.left)
        vals.append(node.val)
        go(node.right)
    go(root)
    i, j = 0, len(vals) - 1
    while i < j:
        s = vals[i] + vals[j]
        if s == k:
            return True
        if s < k:
            i += 1
        else:
            j -= 1
    return False`,
`    public boolean findTarget(TreeNode root, int k) {
        List<Integer> vals = new ArrayList<Integer>();
        go(root, vals);
        int i = 0, j = vals.size() - 1;
        while (i < j) {
            int s = vals.get(i) + vals.get(j);
            if (s == k) return true;
            if (s < k) i++;
            else j--;
        }
        return false;
    }
    void go(TreeNode node, List<Integer> vals) {
        if (node == null) return;
        go(node.left, vals);
        vals.add(node.val);
        go(node.right, vals);
    }`,
`bool findTarget(TreeNode* root, int k) {
    vector<int> vals;
    function<void(TreeNode*)> go = [&](TreeNode* node) {
        if (!node) return;
        go(node->left);
        vals.push_back(node->val);
        go(node->right);
    };
    go(root);
    int i = 0, j = (int)vals.size() - 1;
    while (i < j) {
        int s = vals[i] + vals[j];
        if (s == k) return true;
        if (s < k) i++;
        else j--;
    }
    return false;
}`,
`void inorderVals(struct Node* node, int* vals, int* n) {
    if (!node) return;
    inorderVals(node->left, vals, n);
    vals[(*n)++] = node->val;
    inorderVals(node->right, vals, n);
}
bool findTarget(struct Node* root, int k) {
    int vals[10005], n = 0, i, j, s;
    inorderVals(root, vals, &n);
    i = 0; j = n - 1;
    while (i < j) {
        s = vals[i] + vals[j];
        if (s == k) return true;
        if (s < k) i++;
        else j--;
    }
    return false;
}`
    ))
  ]
});

questions.push({
  id: 16,
  level: "intermediate",
  q: "Lowest Common Ancestor of a BST",
  ask: "Amazon · Google · Meta · Microsoft",
  links: [LC("lowest-common-ancestor-of-a-binary-search-tree"), GFG("lowest-common-ancestor-in-a-bst")],
  a: "p and q are nodes in a BST. Return their lowest common ancestor — the deepest node that has both in its subtree (a node can be an ancestor of itself).\n\nOn a general tree you search both sides. On a BST, if both keys are smaller, LCA is on the left; both larger, on the right; otherwise this node splits them and is the answer.\n\nBrute is the general-tree LCA. Optimal recurses with the BST rule. More optimal is a single while loop.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n)", "O(n)", "Treat it as a binary tree: recurse. If both sides return a node, this is LCA. If one side does, that node is LCA. Ignores ordering.", tn(
`function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left ? left : right;
}`,
`def lowest_common_ancestor(root, p, q):
    if root is None or root is p or root is q:
        return root
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    if left and right:
        return root
    return left if left else right`,
`    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;
        return left != null ? left : right;
    }`,
`TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);
    if (left && right) return root;
    return left ? left : right;
}`,
`struct Node* lowestCommonAncestor(struct Node* root, struct Node* p, struct Node* q) {
    if (!root || root == p || root == q) return root;
    struct Node* left = lowestCommonAncestor(root->left, p, q);
    struct Node* right = lowestCommonAncestor(root->right, p, q);
    if (left && right) return root;
    return left ? left : right;
}`
    )),
    sol("Optimal", "O(h)", "O(h)", "If both values are less than root, recurse left. Both greater, recurse right. Else root is the split point.", tn(
`function lowestCommonAncestor(root, p, q) {
  if (p.val < root.val && q.val < root.val) return lowestCommonAncestor(root.left, p, q);
  if (p.val > root.val && q.val > root.val) return lowestCommonAncestor(root.right, p, q);
  return root;
}`,
`def lowest_common_ancestor(root, p, q):
    if p.val < root.val and q.val < root.val:
        return lowest_common_ancestor(root.left, p, q)
    if p.val > root.val and q.val > root.val:
        return lowest_common_ancestor(root.right, p, q)
    return root`,
`    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (p.val < root.val && q.val < root.val) return lowestCommonAncestor(root.left, p, q);
        if (p.val > root.val && q.val > root.val) return lowestCommonAncestor(root.right, p, q);
        return root;
    }`,
`TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (p->val < root->val && q->val < root->val) return lowestCommonAncestor(root->left, p, q);
    if (p->val > root->val && q->val > root->val) return lowestCommonAncestor(root->right, p, q);
    return root;
}`,
`struct Node* lowestCommonAncestor(struct Node* root, struct Node* p, struct Node* q) {
    if (p->val < root->val && q->val < root->val) return lowestCommonAncestor(root->left, p, q);
    if (p->val > root->val && q->val > root->val) return lowestCommonAncestor(root->right, p, q);
    return root;
}`
    )),
    sol("More optimal", "O(h)", "O(1)", "Same split rule in a loop. No recursion. Walk until p and q sit on different sides (or one equals the node).", tn(
`function lowestCommonAncestor(root, p, q) {
  let cur = root;
  while (cur) {
    if (p.val < cur.val && q.val < cur.val) cur = cur.left;
    else if (p.val > cur.val && q.val > cur.val) cur = cur.right;
    else return cur;
  }
  return null;
}`,
`def lowest_common_ancestor(root, p, q):
    cur = root
    while cur:
        if p.val < cur.val and q.val < cur.val:
            cur = cur.left
        elif p.val > cur.val and q.val > cur.val:
            cur = cur.right
        else:
            return cur
    return None`,
`    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        TreeNode cur = root;
        while (cur != null) {
            if (p.val < cur.val && q.val < cur.val) cur = cur.left;
            else if (p.val > cur.val && q.val > cur.val) cur = cur.right;
            else return cur;
        }
        return null;
    }`,
`TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    TreeNode* cur = root;
    while (cur) {
        if (p->val < cur->val && q->val < cur->val) cur = cur->left;
        else if (p->val > cur->val && q->val > cur->val) cur = cur->right;
        else return cur;
    }
    return nullptr;
}`,
`struct Node* lowestCommonAncestor(struct Node* root, struct Node* p, struct Node* q) {
    struct Node* cur = root;
    while (cur) {
        if (p->val < cur->val && q->val < cur->val) cur = cur->left;
        else if (p->val > cur->val && q->val > cur->val) cur = cur->right;
        else return cur;
    }
    return NULL;
}`
    ))
  ]
});

questions.push({
  id: 17,
  level: "intermediate",
  q: "Balance a Binary Search Tree",
  ask: "Amazon · Google · Microsoft",
  links: [LC("balance-a-binary-search-tree"), GFG_ART("convert-normal-bst-into-balanced-bst")],
  a: "Return a height-balanced BST with the same keys. A tree is balanced if every node's two subtrees differ in height by at most 1.\n\nInorder dumps the keys in sorted order. Then build from the middle, same as sorted-array-to-BST.\n\nBrute inserts those keys one by one (can stay skewed if you pick poorly). Optimal rebuilds from mid. More optimal is Day-Stout-Warren: vine (right spine) then compress in place.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n²)", "O(n)", "Inorder keys, then insert in sorted order into a fresh BST. That rebuilds a stick. Shows why you must pick mids, not insert in order.", tn(
`function balanceBST(root) {
  const keys = [];
  function go(node) {
    if (!node) return;
    go(node.left);
    keys.push(node.val);
    go(node.right);
  }
  go(root);
  function insert(node, val) {
    if (!node) return new TreeNode(val);
    if (val < node.val) node.left = insert(node.left, val);
    else node.right = insert(node.right, val);
    return node;
  }
  let out = null;
  for (let i = 0; i < keys.length; i++) out = insert(out, keys[i]);
  return out;
}`,
`def balance_bst(root):
    keys = []
    def go(node):
        if node is None:
            return
        go(node.left)
        keys.append(node.val)
        go(node.right)
    go(root)
    def insert(node, val):
        if node is None:
            return TreeNode(val)
        if val < node.val:
            node.left = insert(node.left, val)
        else:
            node.right = insert(node.right, val)
        return node
    out = None
    for val in keys:
        out = insert(out, val)
    return out`,
`    public TreeNode balanceBST(TreeNode root) {
        List<Integer> keys = new ArrayList<Integer>();
        go(root, keys);
        TreeNode out = null;
        for (int val : keys) out = insert(out, val);
        return out;
    }
    void go(TreeNode node, List<Integer> keys) {
        if (node == null) return;
        go(node.left, keys);
        keys.add(node.val);
        go(node.right, keys);
    }
    TreeNode insert(TreeNode node, int val) {
        if (node == null) return new TreeNode(val);
        if (val < node.val) node.left = insert(node.left, val);
        else node.right = insert(node.right, val);
        return node;
    }`,
`TreeNode* balanceBST(TreeNode* root) {
    vector<int> keys;
    function<void(TreeNode*)> go = [&](TreeNode* node) {
        if (!node) return;
        go(node->left);
        keys.push_back(node->val);
        go(node->right);
    };
    go(root);
    function<TreeNode*(TreeNode*, int)> insert = [&](TreeNode* node, int val) -> TreeNode* {
        if (!node) return new TreeNode(val);
        if (val < node->val) node->left = insert(node->left, val);
        else node->right = insert(node->right, val);
        return node;
    };
    TreeNode* out = nullptr;
    for (int val : keys) out = insert(out, val);
    return out;
}`,
`void inorderVals(struct Node* node, int* keys, int* n) {
    if (!node) return;
    inorderVals(node->left, keys, n);
    keys[(*n)++] = node->val;
    inorderVals(node->right, keys, n);
}
struct Node* insertVal(struct Node* node, int val) {
    if (!node) return newNode(val);
    if (val < node->val) node->left = insertVal(node->left, val);
    else node->right = insertVal(node->right, val);
    return node;
}
struct Node* balanceBST(struct Node* root) {
    int keys[10005], n = 0, i;
    struct Node* out = NULL;
    inorderVals(root, keys, &n);
    for (i = 0; i < n; i++) out = insertVal(out, keys[i]);
    return out;
}`
    )),
    sol("Optimal", "O(n)", "O(n)", "Inorder into an array, then mid-as-root rebuild. Height is log n. Extra array of keys (or of nodes if you reuse them).", tn(
`function balanceBST(root) {
  const nodes = [];
  function go(node) {
    if (!node) return;
    go(node.left);
    nodes.push(node);
    go(node.right);
  }
  go(root);
  function build(lo, hi) {
    if (lo > hi) return null;
    const mid = Math.floor((lo + hi) / 2);
    const node = nodes[mid];
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  }
  return build(0, nodes.length - 1);
}`,
`def balance_bst(root):
    nodes = []
    def go(node):
        if node is None:
            return
        go(node.left)
        nodes.append(node)
        go(node.right)
    go(root)
    def build(lo, hi):
        if lo > hi:
            return None
        mid = (lo + hi) // 2
        node = nodes[mid]
        node.left = build(lo, mid - 1)
        node.right = build(mid + 1, hi)
        return node
    return build(0, len(nodes) - 1)`,
`    public TreeNode balanceBST(TreeNode root) {
        List<TreeNode> nodes = new ArrayList<TreeNode>();
        go(root, nodes);
        return build(nodes, 0, nodes.size() - 1);
    }
    void go(TreeNode node, List<TreeNode> nodes) {
        if (node == null) return;
        go(node.left, nodes);
        nodes.add(node);
        go(node.right, nodes);
    }
    TreeNode build(List<TreeNode> nodes, int lo, int hi) {
        if (lo > hi) return null;
        int mid = lo + (hi - lo) / 2;
        TreeNode node = nodes.get(mid);
        node.left = build(nodes, lo, mid - 1);
        node.right = build(nodes, mid + 1, hi);
        return node;
    }`,
`TreeNode* balanceBST(TreeNode* root) {
    vector<TreeNode*> nodes;
    function<void(TreeNode*)> go = [&](TreeNode* node) {
        if (!node) return;
        go(node->left);
        nodes.push_back(node);
        go(node->right);
    };
    go(root);
    function<TreeNode*(int,int)> build = [&](int lo, int hi) -> TreeNode* {
        if (lo > hi) return nullptr;
        int mid = lo + (hi - lo) / 2;
        TreeNode* node = nodes[mid];
        node->left = build(lo, mid - 1);
        node->right = build(mid + 1, hi);
        return node;
    };
    return build(0, (int)nodes.size() - 1);
}`,
`void collectNodes(struct Node* node, struct Node** nodes, int* n) {
    if (!node) return;
    collectNodes(node->left, nodes, n);
    nodes[(*n)++] = node;
    collectNodes(node->right, nodes, n);
}
struct Node* buildNodes(struct Node** nodes, int lo, int hi) {
    if (lo > hi) return NULL;
    int mid = lo + (hi - lo) / 2;
    struct Node* node = nodes[mid];
    node->left = buildNodes(nodes, lo, mid - 1);
    node->right = buildNodes(nodes, mid + 1, hi);
    return node;
}
struct Node* balanceBST(struct Node* root) {
    struct Node* nodes[10005];
    int n = 0;
    collectNodes(root, nodes, &n);
    return buildNodes(nodes, 0, n - 1);
}`
    )),
    sol("More optimal", "O(n)", "O(1)", "DSW: rotate every left child to the right to make a vine (linked list of right pointers). Then repeatedly rotate the vine to fold it into a balanced tree. In-place, O(1) extra besides recursion-free loops.", tn(
`function balanceBST(root) {
  const dummy = new TreeNode(0);
  dummy.right = root;
  function rotateLeft(parent) {
    const child = parent.right;
    parent.right = child.right;
    child.right = parent.right.left;
    parent.right.left = child;
  }
  function rotateRight(parent) {
    const child = parent.right;
    parent.right = child.left;
    child.left = parent.right.right;
    parent.right.right = child;
  }
  function vine() {
    let tail = dummy;
    let rest = dummy.right;
    let n = 0;
    while (rest) {
      if (rest.left) {
        const old = rest;
        rest = rest.left;
        old.left = rest.right;
        rest.right = old;
        tail.right = rest;
      } else {
        tail = rest;
        rest = rest.right;
        n++;
      }
    }
    return n;
  }
  function compress(count) {
    let parent = dummy;
    for (let i = 0; i < count; i++) {
      const child = parent.right;
      parent.right = child.right;
      child.right = parent.right.left;
      parent.right.left = child;
      parent = parent.right;
    }
  }
  const n = vine();
  let m = 1;
  while (m * 2 + 1 <= n) m = m * 2 + 1;
  compress(n - m);
  for (m = m / 2; m >= 1; m = Math.floor(m / 2)) compress(m);
  return dummy.right;
}`,
`def balance_bst(root):
    dummy = TreeNode(0)
    dummy.right = root
    def vine():
        tail = dummy
        rest = dummy.right
        n = 0
        while rest:
            if rest.left:
                old = rest
                rest = rest.left
                old.left = rest.right
                rest.right = old
                tail.right = rest
            else:
                tail = rest
                rest = rest.right
                n += 1
        return n
    def compress(count):
        parent = dummy
        for _ in range(count):
            child = parent.right
            parent.right = child.right
            child.right = parent.right.left
            parent.right.left = child
            parent = parent.right
    n = vine()
    m = 1
    while m * 2 + 1 <= n:
        m = m * 2 + 1
    compress(n - m)
    m //= 2
    while m >= 1:
        compress(m)
        m //= 2
    return dummy.right`,
`    TreeNode dummy;
    int vine() {
        TreeNode tail = dummy;
        TreeNode rest = dummy.right;
        int n = 0;
        while (rest != null) {
            if (rest.left != null) {
                TreeNode old = rest;
                rest = rest.left;
                old.left = rest.right;
                rest.right = old;
                tail.right = rest;
            } else {
                tail = rest;
                rest = rest.right;
                n++;
            }
        }
        return n;
    }
    void compress(int count) {
        TreeNode parent = dummy;
        for (int i = 0; i < count; i++) {
            TreeNode child = parent.right;
            parent.right = child.right;
            child.right = parent.right.left;
            parent.right.left = child;
            parent = parent.right;
        }
    }
    public TreeNode balanceBST(TreeNode root) {
        dummy = new TreeNode(0);
        dummy.right = root;
        int n = vine();
        int m = 1;
        while (m * 2 + 1 <= n) m = m * 2 + 1;
        compress(n - m);
        for (m /= 2; m >= 1; m /= 2) compress(m);
        return dummy.right;
    }`,
`int vine(TreeNode* dummy) {
    TreeNode* tail = dummy;
    TreeNode* rest = dummy->right;
    int n = 0;
    while (rest) {
        if (rest->left) {
            TreeNode* old = rest;
            rest = rest->left;
            old->left = rest->right;
            rest->right = old;
            tail->right = rest;
        } else {
            tail = rest;
            rest = rest->right;
            n++;
        }
    }
    return n;
}
void compress(TreeNode* dummy, int count) {
    TreeNode* parent = dummy;
    for (int i = 0; i < count; i++) {
        TreeNode* child = parent->right;
        parent->right = child->right;
        child->right = parent->right->left;
        parent->right->left = child;
        parent = parent->right;
    }
}
TreeNode* balanceBST(TreeNode* root) {
    TreeNode dummy(0);
    dummy.right = root;
    int n = vine(&dummy);
    int m = 1;
    while (m * 2 + 1 <= n) m = m * 2 + 1;
    compress(&dummy, n - m);
    for (m /= 2; m >= 1; m /= 2) compress(&dummy, m);
    return dummy.right;
}`,
`int vine(struct Node* dummy) {
    struct Node* tail = dummy;
    struct Node* rest = dummy->right;
    int n = 0;
    while (rest) {
        if (rest->left) {
            struct Node* old = rest;
            rest = rest->left;
            old->left = rest->right;
            rest->right = old;
            tail->right = rest;
        } else {
            tail = rest;
            rest = rest->right;
            n++;
        }
    }
    return n;
}
void compress(struct Node* dummy, int count) {
    struct Node* parent = dummy;
    int i;
    for (i = 0; i < count; i++) {
        struct Node* child = parent->right;
        parent->right = child->right;
        child->right = parent->right->left;
        parent->right->left = child;
        parent = parent->right;
    }
}
struct Node* balanceBST(struct Node* root) {
    struct Node dummy;
    int n, m;
    dummy.val = 0; dummy.left = NULL; dummy.right = root;
    n = vine(&dummy);
    m = 1;
    while (m * 2 + 1 <= n) m = m * 2 + 1;
    compress(&dummy, n - m);
    for (m /= 2; m >= 1; m /= 2) compress(&dummy, m);
    return dummy.right;
}`
    ))
  ]
});

questions.push({
  id: 18,
  level: "beginner",
  q: "Minimum Absolute Difference in BST",
  ask: "Amazon · Google · Apple",
  links: [LC("minimum-absolute-difference-in-bst"), GFG_ART("find-minimum-absolute-difference-between-any-two-elements-in-bst")],
  a: "Return the smallest |a - b| over any two distinct nodes. In a BST the closest values are neighbors in inorder, so you never need all pairs.\n\nBrute checks every pair. Optimal inorders and tracks the previous value. More optimal is Morris inorder so extra memory is O(1).\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n²)", "O(n)", "Dump all values, then compare every pair. Extra array and quadratic checks.", tn(
`function getMinimumDifference(root) {
  const vals = [];
  function go(node) {
    if (!node) return;
    vals.push(node.val);
    go(node.left);
    go(node.right);
  }
  go(root);
  let best = Infinity;
  for (let i = 0; i < vals.length; i++) {
    for (let j = i + 1; j < vals.length; j++) {
      const d = Math.abs(vals[i] - vals[j]);
      if (d < best) best = d;
    }
  }
  return best;
}`,
`def get_minimum_difference(root):
    vals = []
    def go(node):
        if node is None:
            return
        vals.append(node.val)
        go(node.left)
        go(node.right)
    go(root)
    best = float("inf")
    for i in range(len(vals)):
        for j in range(i + 1, len(vals)):
            d = abs(vals[i] - vals[j])
            if d < best:
                best = d
    return best`,
`    public int getMinimumDifference(TreeNode root) {
        List<Integer> vals = new ArrayList<Integer>();
        go(root, vals);
        int best = Integer.MAX_VALUE;
        for (int i = 0; i < vals.size(); i++) {
            for (int j = i + 1; j < vals.size(); j++) {
                int d = Math.abs(vals.get(i) - vals.get(j));
                if (d < best) best = d;
            }
        }
        return best;
    }
    void go(TreeNode node, List<Integer> vals) {
        if (node == null) return;
        vals.add(node.val);
        go(node.left, vals);
        go(node.right, vals);
    }`,
`int getMinimumDifference(TreeNode* root) {
    vector<int> vals;
    function<void(TreeNode*)> go = [&](TreeNode* node) {
        if (!node) return;
        vals.push_back(node->val);
        go(node->left);
        go(node->right);
    };
    go(root);
    int best = INT_MAX;
    for (int i = 0; i < (int)vals.size(); i++)
        for (int j = i + 1; j < (int)vals.size(); j++)
            best = min(best, abs(vals[i] - vals[j]));
    return best;
}`,
`void collectVals(struct Node* node, int* vals, int* n) {
    if (!node) return;
    vals[(*n)++] = node->val;
    collectVals(node->left, vals, n);
    collectVals(node->right, vals, n);
}
int getMinimumDifference(struct Node* root) {
    int vals[10005], n = 0, i, j, d, best = INT_MAX;
    collectVals(root, vals, &n);
    for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) {
        d = vals[i] - vals[j];
        if (d < 0) d = -d;
        if (d < best) best = d;
    }
    return best;
}`
    )),
    sol("Optimal", "O(n)", "O(h)", "Inorder. Compare each node with the previous inorder value. The min of those adjacent gaps is the global min.", tn(
`function getMinimumDifference(root) {
  let prev = null;
  let best = Infinity;
  function go(node) {
    if (!node) return;
    go(node.left);
    if (prev !== null) best = Math.min(best, node.val - prev);
    prev = node.val;
    go(node.right);
  }
  go(root);
  return best;
}`,
`def get_minimum_difference(root):
    prev = [None]
    best = [float("inf")]
    def go(node):
        if node is None:
            return
        go(node.left)
        if prev[0] is not None:
            best[0] = min(best[0], node.val - prev[0])
        prev[0] = node.val
        go(node.right)
    go(root)
    return best[0]`,
`    Integer prev;
    int best;
    public int getMinimumDifference(TreeNode root) {
        prev = null;
        best = Integer.MAX_VALUE;
        go(root);
        return best;
    }
    void go(TreeNode node) {
        if (node == null) return;
        go(node.left);
        if (prev != null) best = Math.min(best, node.val - prev);
        prev = node.val;
        go(node.right);
    }`,
`int getMinimumDifference(TreeNode* root) {
    TreeNode* prev = nullptr;
    int best = INT_MAX;
    function<void(TreeNode*)> go = [&](TreeNode* node) {
        if (!node) return;
        go(node->left);
        if (prev) best = min(best, node->val - prev->val);
        prev = node;
        go(node->right);
    };
    go(root);
    return best;
}`,
`void minDiffGo(struct Node* node, struct Node** prev, int* best) {
    if (!node) return;
    minDiffGo(node->left, prev, best);
    if (*prev) {
        int d = node->val - (*prev)->val;
        if (d < *best) *best = d;
    }
    *prev = node;
    minDiffGo(node->right, prev, best);
}
int getMinimumDifference(struct Node* root) {
    struct Node* prev = NULL;
    int best = INT_MAX;
    minDiffGo(root, &prev, &best);
    return best;
}`
    )),
    sol("More optimal", "O(n)", "O(1)", "Morris inorder with a previous pointer. Same adjacent-gap logic, no stack.", tn(
`function getMinimumDifference(root) {
  let prev = null;
  let best = Infinity;
  let cur = root;
  while (cur) {
    if (!cur.left) {
      if (prev !== null) best = Math.min(best, cur.val - prev);
      prev = cur.val;
      cur = cur.right;
    } else {
      let pred = cur.left;
      while (pred.right && pred.right !== cur) pred = pred.right;
      if (!pred.right) {
        pred.right = cur;
        cur = cur.left;
      } else {
        pred.right = null;
        if (prev !== null) best = Math.min(best, cur.val - prev);
        prev = cur.val;
        cur = cur.right;
      }
    }
  }
  return best;
}`,
`def get_minimum_difference(root):
    prev = None
    best = float("inf")
    cur = root
    while cur:
        if cur.left is None:
            if prev is not None:
                best = min(best, cur.val - prev)
            prev = cur.val
            cur = cur.right
        else:
            pred = cur.left
            while pred.right and pred.right is not cur:
                pred = pred.right
            if pred.right is None:
                pred.right = cur
                cur = cur.left
            else:
                pred.right = None
                if prev is not None:
                    best = min(best, cur.val - prev)
                prev = cur.val
                cur = cur.right
    return best`,
`    public int getMinimumDifference(TreeNode root) {
        Integer prev = null;
        int best = Integer.MAX_VALUE;
        TreeNode cur = root;
        while (cur != null) {
            if (cur.left == null) {
                if (prev != null) best = Math.min(best, cur.val - prev);
                prev = cur.val;
                cur = cur.right;
            } else {
                TreeNode pred = cur.left;
                while (pred.right != null && pred.right != cur) pred = pred.right;
                if (pred.right == null) {
                    pred.right = cur;
                    cur = cur.left;
                } else {
                    pred.right = null;
                    if (prev != null) best = Math.min(best, cur.val - prev);
                    prev = cur.val;
                    cur = cur.right;
                }
            }
        }
        return best;
    }`,
`int getMinimumDifference(TreeNode* root) {
    TreeNode* prev = nullptr;
    int best = INT_MAX;
    TreeNode* cur = root;
    while (cur) {
        if (!cur->left) {
            if (prev) best = min(best, cur->val - prev->val);
            prev = cur;
            cur = cur->right;
        } else {
            TreeNode* pred = cur->left;
            while (pred->right && pred->right != cur) pred = pred->right;
            if (!pred->right) { pred->right = cur; cur = cur->left; }
            else {
                pred->right = nullptr;
                if (prev) best = min(best, cur->val - prev->val);
                prev = cur;
                cur = cur->right;
            }
        }
    }
    return best;
}`,
`int getMinimumDifference(struct Node* root) {
    struct Node* prev = NULL;
    int best = INT_MAX;
    struct Node* cur = root;
    while (cur) {
        if (!cur->left) {
            if (prev) {
                int d = cur->val - prev->val;
                if (d < best) best = d;
            }
            prev = cur;
            cur = cur->right;
        } else {
            struct Node* pred = cur->left;
            while (pred->right && pred->right != cur) pred = pred->right;
            if (!pred->right) { pred->right = cur; cur = cur->left; }
            else {
                pred->right = NULL;
                if (prev) {
                    int d = cur->val - prev->val;
                    if (d < best) best = d;
                }
                prev = cur;
                cur = cur->right;
            }
        }
    }
    return best;
}`
    ))
  ]
});

module.exports = questions;
