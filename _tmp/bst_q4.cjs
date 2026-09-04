"use strict";
const { tn, sol, LC, GFG, GFG_ART, block, JS_TN, PY_TN, JAVA_TN, CPP_TN, C_TN } = require("./bst_meta.cjs");

const questions = [];

questions.push({
  id: 10,
  level: "intermediate",
  q: "Binary Search Tree Iterator",
  ask: "Meta · Amazon · Google · Microsoft",
  links: [LC("binary-search-tree-iterator"), GFG("bst-iterator")],
  a: "Implement next() and hasNext() for the inorder walk of a BST. next() returns the next smallest key. Both calls should be average O(1) time and use O(h) memory if you can.\n\nBrute dumps the whole inorder array up front. Optimal keeps a stack of the left spine and pushes the right child's left spine after each next(). More optimal threads Morris links so extra memory is O(1) besides the output of next.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n) init, O(1) next", "O(n)", "Flatten inorder into an array at construction. next/hasNext are index moves. Simple, but you pay linear memory before the first call.", tn(
`function BSTIterator(root) {
  this.vals = [];
  this.i = 0;
  const self = this;
  function go(node) {
    if (!node) return;
    go(node.left);
    self.vals.push(node.val);
    go(node.right);
  }
  go(root);
}
BSTIterator.prototype.next = function () {
  return this.vals[this.i++];
};
BSTIterator.prototype.hasNext = function () {
  return this.i < this.vals.length;
};`,
`class BSTIterator:
    def __init__(self, root):
        self.vals = []
        self.i = 0
        def go(node):
            if node is None:
                return
            go(node.left)
            self.vals.append(node.val)
            go(node.right)
        go(root)
    def next(self):
        val = self.vals[self.i]
        self.i += 1
        return val
    def has_next(self):
        return self.i < len(self.vals)`,
`    List<Integer> vals = new ArrayList<Integer>();
    int i = 0;
    public Solution(TreeNode root) {
        go(root);
    }
    void go(TreeNode node) {
        if (node == null) return;
        go(node.left);
        vals.add(node.val);
        go(node.right);
    }
    public int next() { return vals.get(i++); }
    public boolean hasNext() { return i < vals.size(); }`,
`class BSTIterator {
    vector<int> vals;
    int i = 0;
    void go(TreeNode* node) {
        if (!node) return;
        go(node->left);
        vals.push_back(node->val);
        go(node->right);
    }
public:
    BSTIterator(TreeNode* root) { go(root); }
    int next() { return vals[i++]; }
    bool hasNext() { return i < (int)vals.size(); }
};`,
`typedef struct {
    int vals[10005];
    int n, i;
} BSTIterator;
void goIt(struct Node* node, BSTIterator* it) {
    if (!node) return;
    goIt(node->left, it);
    it->vals[it->n++] = node->val;
    goIt(node->right, it);
}
BSTIterator* bSTIteratorCreate(struct Node* root) {
    BSTIterator* it = (BSTIterator*)calloc(1, sizeof(BSTIterator));
    goIt(root, it);
    return it;
}
int bSTIteratorNext(BSTIterator* it) { return it->vals[it->i++]; }
bool bSTIteratorHasNext(BSTIterator* it) { return it->i < it->n; }
void bSTIteratorFree(BSTIterator* it) { free(it); }`
    )),
    sol("Optimal", "O(h) init, amortized O(1) next", "O(h)", "Stack holds the path to the next node. Construction pushes the left spine. next() pops, then pushes the left spine of the right child.", tn(
`function BSTIterator(root) {
  this.stack = [];
  this.pushLeft = function (node) {
    while (node) {
      this.stack.push(node);
      node = node.left;
    }
  };
  this.pushLeft(root);
}
BSTIterator.prototype.next = function () {
  const node = this.stack.pop();
  this.pushLeft(node.right);
  return node.val;
};
BSTIterator.prototype.hasNext = function () {
  return this.stack.length > 0;
};`,
`class BSTIterator:
    def __init__(self, root):
        self.stack = []
        self._push_left(root)
    def _push_left(self, node):
        while node:
            self.stack.append(node)
            node = node.left
    def next(self):
        node = self.stack.pop()
        self._push_left(node.right)
        return node.val
    def has_next(self):
        return len(self.stack) > 0`,
`    Deque<TreeNode> stack = new ArrayDeque<TreeNode>();
    public Solution(TreeNode root) { pushLeft(root); }
    void pushLeft(TreeNode node) {
        while (node != null) { stack.push(node); node = node.left; }
    }
    public int next() {
        TreeNode node = stack.pop();
        pushLeft(node.right);
        return node.val;
    }
    public boolean hasNext() { return !stack.isEmpty(); }`,
`class BSTIterator {
    vector<TreeNode*> stack;
    void pushLeft(TreeNode* node) {
        while (node) { stack.push_back(node); node = node->left; }
    }
public:
    BSTIterator(TreeNode* root) { pushLeft(root); }
    int next() {
        TreeNode* node = stack.back(); stack.pop_back();
        pushLeft(node->right);
        return node->val;
    }
    bool hasNext() { return !stack.empty(); }
};`,
`typedef struct {
    struct Node* stack[10005];
    int sp;
} BSTIterator;
void pushLeft(BSTIterator* it, struct Node* node) {
    while (node) { it->stack[it->sp++] = node; node = node->left; }
}
BSTIterator* bSTIteratorCreate(struct Node* root) {
    BSTIterator* it = (BSTIterator*)calloc(1, sizeof(BSTIterator));
    pushLeft(it, root);
    return it;
}
int bSTIteratorNext(BSTIterator* it) {
    struct Node* node = it->stack[--it->sp];
    pushLeft(it, node->right);
    return node->val;
}
bool bSTIteratorHasNext(BSTIterator* it) { return it->sp > 0; }
void bSTIteratorFree(BSTIterator* it) { free(it); }`
    )),
    sol("More optimal", "amortized O(1) next", "O(1)", "Morris: thread predecessor.right to the current node, walk without a stack. Unthread before yielding so the tree is restored. Extra memory is a handful of pointers.", tn(
`function BSTIterator(root) {
  this.cur = root;
}
BSTIterator.prototype.next = function () {
  while (this.cur) {
    if (!this.cur.left) {
      const val = this.cur.val;
      this.cur = this.cur.right;
      return val;
    }
    let pred = this.cur.left;
    while (pred.right && pred.right !== this.cur) pred = pred.right;
    if (!pred.right) {
      pred.right = this.cur;
      this.cur = this.cur.left;
    } else {
      pred.right = null;
      const val = this.cur.val;
      this.cur = this.cur.right;
      return val;
    }
  }
  return 0;
};
BSTIterator.prototype.hasNext = function () {
  return this.cur !== null;
};`,
`class BSTIterator:
    def __init__(self, root):
        self.cur = root
    def next(self):
        while self.cur:
            if self.cur.left is None:
                val = self.cur.val
                self.cur = self.cur.right
                return val
            pred = self.cur.left
            while pred.right and pred.right is not self.cur:
                pred = pred.right
            if pred.right is None:
                pred.right = self.cur
                self.cur = self.cur.left
            else:
                pred.right = None
                val = self.cur.val
                self.cur = self.cur.right
                return val
        return 0
    def has_next(self):
        return self.cur is not None`,
`    TreeNode cur;
    public Solution(TreeNode root) { cur = root; }
    public int next() {
        while (cur != null) {
            if (cur.left == null) {
                int val = cur.val;
                cur = cur.right;
                return val;
            }
            TreeNode pred = cur.left;
            while (pred.right != null && pred.right != cur) pred = pred.right;
            if (pred.right == null) {
                pred.right = cur;
                cur = cur.left;
            } else {
                pred.right = null;
                int val = cur.val;
                cur = cur.right;
                return val;
            }
        }
        return 0;
    }
    public boolean hasNext() { return cur != null; }`,
`class BSTIterator {
    TreeNode* cur;
public:
    BSTIterator(TreeNode* root) : cur(root) {}
    int next() {
        while (cur) {
            if (!cur->left) {
                int val = cur->val;
                cur = cur->right;
                return val;
            }
            TreeNode* pred = cur->left;
            while (pred->right && pred->right != cur) pred = pred->right;
            if (!pred->right) {
                pred->right = cur;
                cur = cur->left;
            } else {
                pred->right = nullptr;
                int val = cur->val;
                cur = cur->right;
                return val;
            }
        }
        return 0;
    }
    bool hasNext() { return cur != nullptr; }
};`,
`typedef struct { struct Node* cur; } BSTIterator;
BSTIterator* bSTIteratorCreate(struct Node* root) {
    BSTIterator* it = (BSTIterator*)malloc(sizeof(BSTIterator));
    it->cur = root;
    return it;
}
int bSTIteratorNext(BSTIterator* it) {
    while (it->cur) {
        if (!it->cur->left) {
            int val = it->cur->val;
            it->cur = it->cur->right;
            return val;
        }
        struct Node* pred = it->cur->left;
        while (pred->right && pred->right != it->cur) pred = pred->right;
        if (!pred->right) {
            pred->right = it->cur;
            it->cur = it->cur->left;
        } else {
            pred->right = NULL;
            int val = it->cur->val;
            it->cur = it->cur->right;
            return val;
        }
    }
    return 0;
}
bool bSTIteratorHasNext(BSTIterator* it) { return it->cur != NULL; }
void bSTIteratorFree(BSTIterator* it) { free(it); }`
    ))
  ]
});

questions.push({
  id: 11,
  level: "advanced",
  q: "Recover Binary Search Tree",
  ask: "Amazon · Google · Microsoft",
  links: [LC("recover-binary-search-tree"), GFG_ART("fix-two-swapped-nodes-of-bst")],
  a: "Exactly two nodes in a BST had their values swapped. Restore the tree without changing the structure. Do it in O(1) extra space if you can.\n\nInorder of a BST should be sorted. Two swapped values make either two drops (non-adjacent swap) or one drop (adjacent swap). Find the first and last node that break increasing order, then swap their values.\n\nBrute copies inorder, sorts, writes back. Optimal finds the two nodes while walking. More optimal is Morris inorder so the walk itself uses O(1) extra pointers.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n log n)", "O(n)", "Store every node in inorder, copy values, sort the copy, write sorted values back. Structure is unchanged; you sort instead of finding the pair.", tn(
`function recoverTree(root) {
  const nodes = [];
  function go(node) {
    if (!node) return;
    go(node.left);
    nodes.push(node);
    go(node.right);
  }
  go(root);
  const vals = nodes.map(function (n) { return n.val; });
  vals.sort(function (a, b) { return a - b; });
  for (let i = 0; i < nodes.length; i++) nodes[i].val = vals[i];
}`,
`def recover_tree(root):
    nodes = []
    def go(node):
        if node is None:
            return
        go(node.left)
        nodes.append(node)
        go(node.right)
    go(root)
    vals = sorted(n.val for n in nodes)
    for i, node in enumerate(nodes):
        node.val = vals[i]`,
`    public void recoverTree(TreeNode root) {
        List<TreeNode> nodes = new ArrayList<TreeNode>();
        go(root, nodes);
        List<Integer> vals = new ArrayList<Integer>();
        for (TreeNode n : nodes) vals.add(n.val);
        Collections.sort(vals);
        for (int i = 0; i < nodes.size(); i++) nodes.get(i).val = vals.get(i);
    }
    void go(TreeNode node, List<TreeNode> nodes) {
        if (node == null) return;
        go(node.left, nodes);
        nodes.add(node);
        go(node.right, nodes);
    }`,
`void recoverTree(TreeNode* root) {
    vector<TreeNode*> nodes;
    function<void(TreeNode*)> go = [&](TreeNode* node) {
        if (!node) return;
        go(node->left);
        nodes.push_back(node);
        go(node->right);
    };
    go(root);
    vector<int> vals;
    for (auto* n : nodes) vals.push_back(n->val);
    sort(vals.begin(), vals.end());
    for (int i = 0; i < (int)nodes.size(); i++) nodes[i]->val = vals[i];
}`,
`void collectNodes(struct Node* node, struct Node** nodes, int* n) {
    if (!node) return;
    collectNodes(node->left, nodes, n);
    nodes[(*n)++] = node;
    collectNodes(node->right, nodes, n);
}
int cmpInt(const void* a, const void* b) { return *(int*)a - *(int*)b; }
void recoverTree(struct Node* root) {
    struct Node* nodes[10005];
    int n = 0, vals[10005];
    collectNodes(root, nodes, &n);
    for (int i = 0; i < n; i++) vals[i] = nodes[i]->val;
    qsort(vals, n, sizeof(int), cmpInt);
    for (int i = 0; i < n; i++) nodes[i]->val = vals[i];
}`
    )),
    sol("Optimal", "O(n)", "O(h)", "Inorder with a prev pointer. first is the previous node at the first drop. second is the current node at every drop (so adjacent swaps still work). Swap first.val and second.val.", tn(
`function recoverTree(root) {
  let first = null;
  let second = null;
  let prev = null;
  function go(node) {
    if (!node) return;
    go(node.left);
    if (prev && prev.val > node.val) {
      if (!first) first = prev;
      second = node;
    }
    prev = node;
    go(node.right);
  }
  go(root);
  const tmp = first.val;
  first.val = second.val;
  second.val = tmp;
}`,
`def recover_tree(root):
    first = second = prev = None
    def go(node):
        nonlocal first, second, prev
        if node is None:
            return
        go(node.left)
        if prev and prev.val > node.val:
            if first is None:
                first = prev
            second = node
        prev = node
        go(node.right)
    go(root)
    first.val, second.val = second.val, first.val`,
`    TreeNode first, second, prev;
    public void recoverTree(TreeNode root) {
        first = second = prev = null;
        go(root);
        int tmp = first.val;
        first.val = second.val;
        second.val = tmp;
    }
    void go(TreeNode node) {
        if (node == null) return;
        go(node.left);
        if (prev != null && prev.val > node.val) {
            if (first == null) first = prev;
            second = node;
        }
        prev = node;
        go(node.right);
    }`,
`void recoverTree(TreeNode* root) {
    TreeNode *first = nullptr, *second = nullptr, *prev = nullptr;
    function<void(TreeNode*)> go = [&](TreeNode* node) {
        if (!node) return;
        go(node->left);
        if (prev && prev->val > node->val) {
            if (!first) first = prev;
            second = node;
        }
        prev = node;
        go(node->right);
    };
    go(root);
    swap(first->val, second->val);
}`,
`void recoverGo(struct Node* node, struct Node** first, struct Node** second, struct Node** prev) {
    if (!node) return;
    recoverGo(node->left, first, second, prev);
    if (*prev && (*prev)->val > node->val) {
        if (!*first) *first = *prev;
        *second = node;
    }
    *prev = node;
    recoverGo(node->right, first, second, prev);
}
void recoverTree(struct Node* root) {
    struct Node *first = NULL, *second = NULL, *prev = NULL;
    recoverGo(root, &first, &second, &prev);
    int tmp = first->val;
    first->val = second->val;
    second->val = tmp;
}`
    )),
    sol("More optimal", "O(n)", "O(1)", "Morris inorder with the same first/second logic. Thread and unthread predecessor links so you do not keep a stack.", tn(
`function recoverTree(root) {
  let first = null;
  let second = null;
  let prev = null;
  let cur = root;
  function visit(node) {
    if (prev && prev.val > node.val) {
      if (!first) first = prev;
      second = node;
    }
    prev = node;
  }
  while (cur) {
    if (!cur.left) {
      visit(cur);
      cur = cur.right;
    } else {
      let pred = cur.left;
      while (pred.right && pred.right !== cur) pred = pred.right;
      if (!pred.right) {
        pred.right = cur;
        cur = cur.left;
      } else {
        pred.right = null;
        visit(cur);
        cur = cur.right;
      }
    }
  }
  const tmp = first.val;
  first.val = second.val;
  second.val = tmp;
}`,
`def recover_tree(root):
    first = second = prev = None
    cur = root
    def visit(node):
        nonlocal first, second, prev
        if prev and prev.val > node.val:
            if first is None:
                first = prev
            second = node
        prev = node
    while cur:
        if cur.left is None:
            visit(cur)
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
                visit(cur)
                cur = cur.right
    first.val, second.val = second.val, first.val`,
`    TreeNode first, second, prevN;
    void visit(TreeNode node) {
        if (prevN != null && prevN.val > node.val) {
            if (first == null) first = prevN;
            second = node;
        }
        prevN = node;
    }
    public void recoverTree(TreeNode root) {
        first = second = prevN = null;
        TreeNode cur = root;
        while (cur != null) {
            if (cur.left == null) { visit(cur); cur = cur.right; }
            else {
                TreeNode pred = cur.left;
                while (pred.right != null && pred.right != cur) pred = pred.right;
                if (pred.right == null) { pred.right = cur; cur = cur.left; }
                else { pred.right = null; visit(cur); cur = cur.right; }
            }
        }
        int tmp = first.val;
        first.val = second.val;
        second.val = tmp;
    }`,
`void recoverTree(TreeNode* root) {
    TreeNode *first = nullptr, *second = nullptr, *prev = nullptr, *cur = root;
    auto visit = [&](TreeNode* node) {
        if (prev && prev->val > node->val) {
            if (!first) first = prev;
            second = node;
        }
        prev = node;
    };
    while (cur) {
        if (!cur->left) { visit(cur); cur = cur->right; }
        else {
            TreeNode* pred = cur->left;
            while (pred->right && pred->right != cur) pred = pred->right;
            if (!pred->right) { pred->right = cur; cur = cur->left; }
            else { pred->right = nullptr; visit(cur); cur = cur->right; }
        }
    }
    swap(first->val, second->val);
}`,
`void recoverTree(struct Node* root) {
    struct Node *first = NULL, *second = NULL, *prev = NULL, *cur = root;
    while (cur) {
        if (!cur->left) {
            if (prev && prev->val > cur->val) {
                if (!first) first = prev;
                second = cur;
            }
            prev = cur;
            cur = cur->right;
        } else {
            struct Node* pred = cur->left;
            while (pred->right && pred->right != cur) pred = pred->right;
            if (!pred->right) { pred->right = cur; cur = cur->left; }
            else {
                pred->right = NULL;
                if (prev && prev->val > cur->val) {
                    if (!first) first = prev;
                    second = cur;
                }
                prev = cur;
                cur = cur->right;
            }
        }
    }
    int tmp = first->val;
    first->val = second->val;
    second->val = tmp;
}`
    ))
  ]
});

module.exports = questions;
