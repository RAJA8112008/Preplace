"use strict";
const {
  JS_TN, PY_TN, JAVA_TN, CPP_TN, C_TN,
  JS_LN, PY_LN, JAVA_LN, CPP_LN, C_LN,
  block, tn, tnJavaFull, sol, LC, GFG, GFG_ART, desc
} = require("./emit_dsa.cjs");

function ex(title, d, js, py, java, cpp, c) {
  return {
    lang: "js",
    title,
    desc: d,
    code: js,
    codes: { javascript: js, python: py, java, cpp, c }
  };
}

const notes = [
  {
    title: "BST property",
    body: "In a binary search tree, every value in the left subtree is strictly less than the node, and every value in the right subtree is strictly greater (LeetCode forbids duplicates on most BST problems). The rule applies to the whole subtree, not only the two children. A right-left grandchild that is smaller than the root still breaks the tree. Search, insert, and BST-LCA can walk one path of length O(h)."
  },
  {
    title: "Inorder is sorted",
    body: "Inorder means left, node, right. On a valid BST that walk prints keys in increasing order. That is why validate-BST, kth smallest/largest, two-sum in a BST, and min-abs-diff all reduce to inorder. If you already have a sorted array, the middle element is a balanced root and the two halves become the two subtrees."
  },
  {
    title: "Search",
    body: "Compare the target with the current node. Go left if it is smaller, right if it is larger, stop if equal or null. Recursion and a while-loop are the same walk. Average time is O(log n) on a balanced tree and O(n) if the tree is a stick. Do not scan the whole tree unless you have ignored the BST property on purpose (the brute tab)."
  },
  {
    title: "Insert",
    body: "Walk as in search until you fall off a null child, then hang a new leaf there. Recursion returns the (possibly new) child pointer so the parent can attach it. Iterative insert keeps a parent pointer. Inserting already-sorted keys into an empty BST builds a linked list — that is why interviews also ask you to build from a sorted array using the middle."
  },
  {
    title: "Delete",
    body: "Three cases. No child: replace the node with null. One child: replace it with that child. Two children: copy the inorder successor (leftmost of the right subtree) into the node, then delete that successor (which has no left child). You can use the predecessor instead. Draw a 3-node tree before you type."
  },
  {
    title: "Successor",
    body: "The inorder successor of p is the next larger key. If p has a right child, it is the leftmost node in that right subtree. If not, walk from the root and remember the last node that was greater than p — that ancestor is the successor. Predecessor is symmetric. BST Iterator is successor on demand, using a stack of the left spine."
  },
  {
    title: "Range queries",
    body: "Because of the BST property you can prune. If node.val < low, the whole left subtree is too small. If node.val > high, the whole right subtree is too big. Range sum, trim, and 'keys in [L,R]' all use that prune. Visiting every node is correct but slower, and it throws away the reason you have a BST."
  },
  {
    title: "Validate with a range",
    body: "Checking only left.val < node.val < right.val is not enough. Carry a (min, max) window: the node must lie strictly inside it, then left gets max = node.val and right gets min = node.val. The inorder-is-sorted check is the other correct picture. Either one is what interviewers want; the child-only check is the classic trap."
  },
  {
    title: "Balancing",
    body: "A BST is not automatically balanced. A stick of n nodes makes search O(n). AVL and red-black trees rotate as they insert. In interviews you more often dump inorder into an array and rebuild by always picking the middle (sorted array to BST, balance a BST). Day-Stout-Warren turns the tree into a vine then compresses it in place."
  },
  {
    title: "Interview habit",
    body: "Say the BST property out loud. State O(h) vs O(n). Draw insert and the three delete cases. For validate, mention the range (or inorder). For kth / two-sum / min-diff, say inorder. Then open Brute (ignore BST or extra arrays), Optimal (use the property), and More optimal (iterative / Morris / Catalan / DSW)."
  }
];

const examples = [
  ex(
    "1. Search by walking left or right",
    desc(
      "Search in a BST is binary search on a tree.\nYou only look at one child per step.\nThe walk stops at a match or at null.",
      "Start at the root.\nIf val is smaller, go left. If larger, go right.\nReturn the node when values match.",
      "This is O(h), not O(n), only if you use the BST rule.\nA DFS that visits every node also finds the key, but that is the brute idea."
    ),
    JS_TN + `

function search(node, val) {
  if (!node || node.val === val) return node;
  if (val < node.val) return search(node.left, val);
  return search(node.right, val);
}`,
    PY_TN + `def search(node, val):
    if node is None or node.val == val:
        return node
    if val < node.val:
        return search(node.left, val)
    return search(node.right, val)`,
    JAVA_TN + `
class Solution {
    public TreeNode search(TreeNode node, int val) {
        if (node == null || node.val == val) return node;
        if (val < node.val) return search(node.left, val);
        return search(node.right, val);
    }
}`,
    CPP_TN + `
TreeNode* search(TreeNode* node, int val) {
    if (!node || node->val == val) return node;
    if (val < node->val) return search(node->left, val);
    return search(node->right, val);
}`,
    C_TN + `
struct Node* search(struct Node* node, int val) {
    if (!node || node->val == val) return node;
    if (val < node->val) return search(node->left, val);
    return search(node->right, val);
}`
  ),
  ex(
    "2. Insert a new leaf",
    desc(
      "Insert walks like search, then hangs a new node on the null child you fell off.\nThe tree stays a BST if you only attach at that hole.",
      "If the current child is null, create the node there.\nOtherwise recurse left or right by comparing val.\nThe function returns the child pointer so the parent can store it.",
      "Inserting sorted keys 1,2,3,4 builds a right spine.\nDuplicates need a stated policy; LeetCode insert ignores existing keys."
    ),
    JS_TN + `

function insert(node, val) {
  if (!node) return new TreeNode(val);
  if (val < node.val) node.left = insert(node.left, val);
  else if (val > node.val) node.right = insert(node.right, val);
  return node;
}`,
    PY_TN + `def insert(node, val):
    if node is None:
        return TreeNode(val)
    if val < node.val:
        node.left = insert(node.left, val)
    elif val > node.val:
        node.right = insert(node.right, val)
    return node`,
    JAVA_TN + `
class Solution {
    public TreeNode insert(TreeNode node, int val) {
        if (node == null) return new TreeNode(val);
        if (val < node.val) node.left = insert(node.left, val);
        else if (val > node.val) node.right = insert(node.right, val);
        return node;
    }
}`,
    CPP_TN + `
TreeNode* insert(TreeNode* node, int val) {
    if (!node) return new TreeNode(val);
    if (val < node->val) node->left = insert(node->left, val);
    else if (val > node->val) node->right = insert(node->right, val);
    return node;
}`,
    C_TN + `
struct Node* insert(struct Node* node, int val) {
    if (!node) return newNode(val);
    if (val < node->val) node->left = insert(node->left, val);
    else if (val > node->val) node->right = insert(node->right, val);
    return node;
}`
  ),
  ex(
    "3. Inorder prints a BST in sorted order",
    desc(
      "Left, node, right on a BST is exactly sorted keys.\nThat is the definition of inorder meeting the BST property.",
      "Walk left, push the value, walk right.\nOn tree 2 / 1 / 3 the list is [1, 2, 3].",
      "If inorder is not strictly increasing, the tree is not a BST.\nDo not sort the list afterwards — that hides a broken tree."
    ),
    JS_TN + `

function inorder(node, out) {
  if (!node) return;
  inorder(node.left, out);
  out.push(node.val);
  inorder(node.right, out);
}`,
    PY_TN + `def inorder(node, out):
    if node is None:
        return
    inorder(node.left, out)
    out.append(node.val)
    inorder(node.right, out)`,
    JAVA_TN + `
class Solution {
    public void inorder(TreeNode node, List<Integer> out) {
        if (node == null) return;
        inorder(node.left, out);
        out.add(node.val);
        inorder(node.right, out);
    }
}`,
    CPP_TN + `
void inorder(TreeNode* node, vector<int>& out) {
    if (!node) return;
    inorder(node->left, out);
    out.push_back(node->val);
    inorder(node->right, out);
}`,
    C_TN + `
void inorder(struct Node* node, int* out, int* n) {
    if (!node) return;
    inorder(node->left, out, n);
    out[(*n)++] = node->val;
    inorder(node->right, out, n);
}`
  ),
  ex(
    "4. Delete uses the inorder successor",
    desc(
      "A node with two children cannot just be cut out.\nYou copy the next larger key (leftmost in the right subtree) into it, then delete that successor.",
      "minNode walks left until left is null.\nThat node has no left child, so deleting it is the one-child case.\nThe original node keeps its place; only its value changes.",
      "You may use the predecessor (rightmost of the left) instead.\nForgetting to delete the successor leaves a duplicate key."
    ),
    JS_TN + `

function minNode(node) {
  while (node.left) node = node.left;
  return node;
}

function deleteTwoChildren(node) {
  const succ = minNode(node.right);
  node.val = succ.val;
  // then delete succ from node.right
  return succ;
}`,
    PY_TN + `def min_node(node):
    while node.left:
        node = node.left
    return node

def delete_two_children(node):
    succ = min_node(node.right)
    node.val = succ.val
    return succ`,
    JAVA_TN + `
class Solution {
    TreeNode minNode(TreeNode node) {
        while (node.left != null) node = node.left;
        return node;
    }
    TreeNode deleteTwoChildren(TreeNode node) {
        TreeNode succ = minNode(node.right);
        node.val = succ.val;
        return succ;
    }
}`,
    CPP_TN + `
TreeNode* minNode(TreeNode* node) {
    while (node->left) node = node->left;
    return node;
}
TreeNode* deleteTwoChildren(TreeNode* node) {
    TreeNode* succ = minNode(node->right);
    node->val = succ->val;
    return succ;
}`,
    C_TN + `
struct Node* minNode(struct Node* node) {
    while (node->left) node = node->left;
    return node;
}
struct Node* deleteTwoChildren(struct Node* node) {
    struct Node* succ = minNode(node->right);
    node->val = succ->val;
    return succ;
}`
  ),
  ex(
    "5. Validate with a (min, max) window",
    desc(
      "Each node must sit inside an open interval inherited from its ancestors.\nThe root starts in (-inf, +inf).\nLeft child gets a tighter max; right child gets a tighter min.",
      "ok returns false if node.val is outside (lo, hi).\nLeft is checked with hi = node.val.\nRight is checked with lo = node.val.",
      "Comparing only with the two children misses a deep violation.\nUse strict inequalities when the tree forbids duplicates."
    ),
    JS_TN + `

function ok(node, lo, hi) {
  if (!node) return true;
  if (node.val <= lo || node.val >= hi) return false;
  return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);
}`,
    PY_TN + `def ok(node, lo, hi):
    if node is None:
        return True
    if node.val <= lo or node.val >= hi:
        return False
    return ok(node.left, lo, node.val) and ok(node.right, node.val, hi)`,
    JAVA_TN + `
class Solution {
    boolean ok(TreeNode node, long lo, long hi) {
        if (node == null) return true;
        if (node.val <= lo || node.val >= hi) return false;
        return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);
    }
}`,
    CPP_TN + `
bool ok(TreeNode* node, long long lo, long long hi) {
    if (!node) return true;
    if (node->val <= lo || node->val >= hi) return false;
    return ok(node->left, lo, node->val) && ok(node->right, node->val, hi);
}`,
    C_TN + `
bool ok(struct Node* node, long long lo, long long hi) {
    if (!node) return true;
    if (node->val <= lo || node->val >= hi) return false;
    return ok(node->left, lo, node->val) && ok(node->right, node->val, hi);
}`
  ),
  ex(
    "6. Inorder successor from the root",
    desc(
      "Successor is the next key after p in sorted order.\nIf p has a right subtree, it is the leftmost node there.\nOtherwise it is the lowest ancestor greater than p.",
      "succ starts null.\nWalk from the root: if the node is greater than p, record it and go left, else go right.\nThe last recorded node is the successor when p has no right child.",
      "LeetCode's follow-up tree may have parent pointers; this walk does not need them.\nPredecessor is the symmetric walk."
    ),
    JS_TN + `

function successor(root, p) {
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
    PY_TN + `def successor(root, p):
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
    JAVA_TN + `
class Solution {
    public TreeNode successor(TreeNode root, TreeNode p) {
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
    }
}`,
    CPP_TN + `
TreeNode* successor(TreeNode* root, TreeNode* p) {
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
    C_TN + `
struct Node* successor(struct Node* root, struct Node* p) {
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
  ),
  ex(
    "7. Range sum can prune whole subtrees",
    desc(
      "If the node is left of low, skip the left subtree.\nIf it is right of high, skip the right subtree.\nOnly add node.val when it sits inside [low, high].",
      "Compare node.val with low and high.\nRecurse only into sides that can still contain in-range keys.\nThe sum is this value (if in range) plus the two pruned walks.",
      "Visiting every node is correct but ignores the BST.\nOff-by-one on inclusive bounds is the usual bug."
    ),
    JS_TN + `

function rangeSum(node, low, high) {
  if (!node) return 0;
  if (node.val < low) return rangeSum(node.right, low, high);
  if (node.val > high) return rangeSum(node.left, low, high);
  return node.val + rangeSum(node.left, low, high) + rangeSum(node.right, low, high);
}`,
    PY_TN + `def range_sum(node, low, high):
    if node is None:
        return 0
    if node.val < low:
        return range_sum(node.right, low, high)
    if node.val > high:
        return range_sum(node.left, low, high)
    return node.val + range_sum(node.left, low, high) + range_sum(node.right, low, high)`,
    JAVA_TN + `
class Solution {
    public int rangeSum(TreeNode node, int low, int high) {
        if (node == null) return 0;
        if (node.val < low) return rangeSum(node.right, low, high);
        if (node.val > high) return rangeSum(node.left, low, high);
        return node.val + rangeSum(node.left, low, high) + rangeSum(node.right, low, high);
    }
}`,
    CPP_TN + `
int rangeSum(TreeNode* node, int low, int high) {
    if (!node) return 0;
    if (node->val < low) return rangeSum(node->right, low, high);
    if (node->val > high) return rangeSum(node->left, low, high);
    return node->val + rangeSum(node->left, low, high) + rangeSum(node->right, low, high);
}`,
    C_TN + `
int rangeSum(struct Node* node, int low, int high) {
    if (!node) return 0;
    if (node->val < low) return rangeSum(node->right, low, high);
    if (node->val > high) return rangeSum(node->left, low, high);
    return node->val + rangeSum(node->left, low, high) + rangeSum(node->right, low, high);
}`
  ),
  ex(
    "8. Middle of a sorted array is a balanced root",
    desc(
      "A sorted array is an inorder dump of some BST.\nPicking the middle as root splits the keys in half and keeps the tree short.",
      "lo..hi inclusive. mid becomes a new node.\nLeft child is built from lo..mid-1. Right from mid+1..hi.\nEmpty range returns null.",
      "Slicing a new array every call is extra O(n) copies; pass indices instead.\nInserting 1..n in order is the opposite of this picture."
    ),
    JS_TN + `

function fromSorted(nums, lo, hi) {
  if (lo > hi) return null;
  const mid = Math.floor((lo + hi) / 2);
  const node = new TreeNode(nums[mid]);
  node.left = fromSorted(nums, lo, mid - 1);
  node.right = fromSorted(nums, mid + 1, hi);
  return node;
}`,
    PY_TN + `def from_sorted(nums, lo, hi):
    if lo > hi:
        return None
    mid = (lo + hi) // 2
    node = TreeNode(nums[mid])
    node.left = from_sorted(nums, lo, mid - 1)
    node.right = from_sorted(nums, mid + 1, hi)
    return node`,
    JAVA_TN + `
class Solution {
    TreeNode fromSorted(int[] nums, int lo, int hi) {
        if (lo > hi) return null;
        int mid = lo + (hi - lo) / 2;
        TreeNode node = new TreeNode(nums[mid]);
        node.left = fromSorted(nums, lo, mid - 1);
        node.right = fromSorted(nums, mid + 1, hi);
        return node;
    }
}`,
    CPP_TN + `
TreeNode* fromSorted(vector<int>& nums, int lo, int hi) {
    if (lo > hi) return nullptr;
    int mid = lo + (hi - lo) / 2;
    TreeNode* node = new TreeNode(nums[mid]);
    node->left = fromSorted(nums, lo, mid - 1);
    node->right = fromSorted(nums, mid + 1, hi);
    return node;
}`,
    C_TN + `
struct Node* fromSorted(int* nums, int lo, int hi) {
    if (lo > hi) return NULL;
    int mid = lo + (hi - lo) / 2;
    struct Node* node = newNode(nums[mid]);
    node->left = fromSorted(nums, lo, mid - 1);
    node->right = fromSorted(nums, mid + 1, hi);
    return node;
}`
  )
];

module.exports = { notes, examples, tn, sol, LC, GFG, GFG_ART, block, tnJavaFull, JS_TN, PY_TN, JAVA_TN, CPP_TN, C_TN, JS_LN, PY_LN, JAVA_LN, CPP_LN, C_LN };
