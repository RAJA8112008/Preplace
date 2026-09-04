window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["dsa-bst"] = {
  kind: "dsa",
  notes: [
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
  ],
  examples: [
    {
      lang: "js",
      title: "1. Search by walking left or right",
      desc: "What this is\nSearch in a BST is binary search on a tree.\nYou only look at one child per step.\nThe walk stops at a match or at null.\n\nWhat the code is doing\nStart at the root.\nIf val is smaller, go left. If larger, go right.\nReturn the node when values match.\n\nWatch out\nThis is O(h), not O(n), only if you use the BST rule.\nA DFS that visits every node also finds the key, but that is the brute idea.",
      code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function search(node, val) {
  if (!node || node.val === val) return node;
  if (val < node.val) return search(node.left, val);
  return search(node.right, val);
}`,
      codes: {
        javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function search(node, val) {
  if (!node || node.val === val) return node;
  if (val < node.val) return search(node.left, val);
  return search(node.right, val);
}`,
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def search(node, val):
    if node is None or node.val == val:
        return node
    if val < node.val:
        return search(node.left, val)
    return search(node.right, val)`,
        java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode search(TreeNode node, int val) {
        if (node == null || node.val == val) return node;
        if (val < node.val) return search(node.left, val);
        return search(node.right, val);
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* search(TreeNode* node, int val) {
    if (!node || node->val == val) return node;
    if (val < node->val) return search(node->left, val);
    return search(node->right, val);
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* search(struct Node* node, int val) {
    if (!node || node->val == val) return node;
    if (val < node->val) return search(node->left, val);
    return search(node->right, val);
}`
      }
    },
    {
      lang: "js",
      title: "2. Insert a new leaf",
      desc: "What this is\nInsert walks like search, then hangs a new node on the null child you fell off.\nThe tree stays a BST if you only attach at that hole.\n\nWhat the code is doing\nIf the current child is null, create the node there.\nOtherwise recurse left or right by comparing val.\nThe function returns the child pointer so the parent can store it.\n\nWatch out\nInserting sorted keys 1,2,3,4 builds a right spine.\nDuplicates need a stated policy; LeetCode insert ignores existing keys.",
      code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function insert(node, val) {
  if (!node) return new TreeNode(val);
  if (val < node.val) node.left = insert(node.left, val);
  else if (val > node.val) node.right = insert(node.right, val);
  return node;
}`,
      codes: {
        javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function insert(node, val) {
  if (!node) return new TreeNode(val);
  if (val < node.val) node.left = insert(node.left, val);
  else if (val > node.val) node.right = insert(node.right, val);
  return node;
}`,
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def insert(node, val):
    if node is None:
        return TreeNode(val)
    if val < node.val:
        node.left = insert(node.left, val)
    elif val > node.val:
        node.right = insert(node.right, val)
    return node`,
        java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode insert(TreeNode node, int val) {
        if (node == null) return new TreeNode(val);
        if (val < node.val) node.left = insert(node.left, val);
        else if (val > node.val) node.right = insert(node.right, val);
        return node;
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* insert(TreeNode* node, int val) {
    if (!node) return new TreeNode(val);
    if (val < node->val) node->left = insert(node->left, val);
    else if (val > node->val) node->right = insert(node->right, val);
    return node;
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* insert(struct Node* node, int val) {
    if (!node) return newNode(val);
    if (val < node->val) node->left = insert(node->left, val);
    else if (val > node->val) node->right = insert(node->right, val);
    return node;
}`
      }
    },
    {
      lang: "js",
      title: "3. Inorder prints a BST in sorted order",
      desc: "What this is\nLeft, node, right on a BST is exactly sorted keys.\nThat is the definition of inorder meeting the BST property.\n\nWhat the code is doing\nWalk left, push the value, walk right.\nOn tree 2 / 1 / 3 the list is [1, 2, 3].\n\nWatch out\nIf inorder is not strictly increasing, the tree is not a BST.\nDo not sort the list afterwards — that hides a broken tree.",
      code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function inorder(node, out) {
  if (!node) return;
  inorder(node.left, out);
  out.push(node.val);
  inorder(node.right, out);
}`,
      codes: {
        javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function inorder(node, out) {
  if (!node) return;
  inorder(node.left, out);
  out.push(node.val);
  inorder(node.right, out);
}`,
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def inorder(node, out):
    if node is None:
        return
    inorder(node.left, out)
    out.append(node.val)
    inorder(node.right, out)`,
        java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public void inorder(TreeNode node, List<Integer> out) {
        if (node == null) return;
        inorder(node.left, out);
        out.add(node.val);
        inorder(node.right, out);
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

void inorder(TreeNode* node, vector<int>& out) {
    if (!node) return;
    inorder(node->left, out);
    out.push_back(node->val);
    inorder(node->right, out);
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

void inorder(struct Node* node, int* out, int* n) {
    if (!node) return;
    inorder(node->left, out, n);
    out[(*n)++] = node->val;
    inorder(node->right, out, n);
}`
      }
    },
    {
      lang: "js",
      title: "4. Delete uses the inorder successor",
      desc: "What this is\nA node with two children cannot just be cut out.\nYou copy the next larger key (leftmost in the right subtree) into it, then delete that successor.\n\nWhat the code is doing\nminNode walks left until left is null.\nThat node has no left child, so deleting it is the one-child case.\nThe original node keeps its place; only its value changes.\n\nWatch out\nYou may use the predecessor (rightmost of the left) instead.\nForgetting to delete the successor leaves a duplicate key.",
      code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

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
      codes: {
        javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

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
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def min_node(node):
    while node.left:
        node = node.left
    return node

def delete_two_children(node):
    succ = min_node(node.right)
    node.val = succ.val
    return succ`,
        java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

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
        cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* minNode(TreeNode* node) {
    while (node->left) node = node->left;
    return node;
}
TreeNode* deleteTwoChildren(TreeNode* node) {
    TreeNode* succ = minNode(node->right);
    node->val = succ->val;
    return succ;
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* minNode(struct Node* node) {
    while (node->left) node = node->left;
    return node;
}
struct Node* deleteTwoChildren(struct Node* node) {
    struct Node* succ = minNode(node->right);
    node->val = succ->val;
    return succ;
}`
      }
    },
    {
      lang: "js",
      title: "5. Validate with a (min, max) window",
      desc: "What this is\nEach node must sit inside an open interval inherited from its ancestors.\nThe root starts in (-inf, +inf).\nLeft child gets a tighter max; right child gets a tighter min.\n\nWhat the code is doing\nok returns false if node.val is outside (lo, hi).\nLeft is checked with hi = node.val.\nRight is checked with lo = node.val.\n\nWatch out\nComparing only with the two children misses a deep violation.\nUse strict inequalities when the tree forbids duplicates.",
      code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function ok(node, lo, hi) {
  if (!node) return true;
  if (node.val <= lo || node.val >= hi) return false;
  return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);
}`,
      codes: {
        javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function ok(node, lo, hi) {
  if (!node) return true;
  if (node.val <= lo || node.val >= hi) return false;
  return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);
}`,
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def ok(node, lo, hi):
    if node is None:
        return True
    if node.val <= lo or node.val >= hi:
        return False
    return ok(node.left, lo, node.val) and ok(node.right, node.val, hi)`,
        java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    boolean ok(TreeNode node, long lo, long hi) {
        if (node == null) return true;
        if (node.val <= lo || node.val >= hi) return false;
        return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

bool ok(TreeNode* node, long long lo, long long hi) {
    if (!node) return true;
    if (node->val <= lo || node->val >= hi) return false;
    return ok(node->left, lo, node->val) && ok(node->right, node->val, hi);
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

bool ok(struct Node* node, long long lo, long long hi) {
    if (!node) return true;
    if (node->val <= lo || node->val >= hi) return false;
    return ok(node->left, lo, node->val) && ok(node->right, node->val, hi);
}`
      }
    },
    {
      lang: "js",
      title: "6. Inorder successor from the root",
      desc: "What this is\nSuccessor is the next key after p in sorted order.\nIf p has a right subtree, it is the leftmost node there.\nOtherwise it is the lowest ancestor greater than p.\n\nWhat the code is doing\nsucc starts null.\nWalk from the root: if the node is greater than p, record it and go left, else go right.\nThe last recorded node is the successor when p has no right child.\n\nWatch out\nLeetCode's follow-up tree may have parent pointers; this walk does not need them.\nPredecessor is the symmetric walk.",
      code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

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
      codes: {
        javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

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
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def successor(root, p):
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
        java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

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
        cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

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
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

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
      }
    },
    {
      lang: "js",
      title: "7. Range sum can prune whole subtrees",
      desc: "What this is\nIf the node is left of low, skip the left subtree.\nIf it is right of high, skip the right subtree.\nOnly add node.val when it sits inside [low, high].\n\nWhat the code is doing\nCompare node.val with low and high.\nRecurse only into sides that can still contain in-range keys.\nThe sum is this value (if in range) plus the two pruned walks.\n\nWatch out\nVisiting every node is correct but ignores the BST.\nOff-by-one on inclusive bounds is the usual bug.",
      code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function rangeSum(node, low, high) {
  if (!node) return 0;
  if (node.val < low) return rangeSum(node.right, low, high);
  if (node.val > high) return rangeSum(node.left, low, high);
  return node.val + rangeSum(node.left, low, high) + rangeSum(node.right, low, high);
}`,
      codes: {
        javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function rangeSum(node, low, high) {
  if (!node) return 0;
  if (node.val < low) return rangeSum(node.right, low, high);
  if (node.val > high) return rangeSum(node.left, low, high);
  return node.val + rangeSum(node.left, low, high) + rangeSum(node.right, low, high);
}`,
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def range_sum(node, low, high):
    if node is None:
        return 0
    if node.val < low:
        return range_sum(node.right, low, high)
    if node.val > high:
        return range_sum(node.left, low, high)
    return node.val + range_sum(node.left, low, high) + range_sum(node.right, low, high)`,
        java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public int rangeSum(TreeNode node, int low, int high) {
        if (node == null) return 0;
        if (node.val < low) return rangeSum(node.right, low, high);
        if (node.val > high) return rangeSum(node.left, low, high);
        return node.val + rangeSum(node.left, low, high) + rangeSum(node.right, low, high);
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

int rangeSum(TreeNode* node, int low, int high) {
    if (!node) return 0;
    if (node->val < low) return rangeSum(node->right, low, high);
    if (node->val > high) return rangeSum(node->left, low, high);
    return node->val + rangeSum(node->left, low, high) + rangeSum(node->right, low, high);
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

int rangeSum(struct Node* node, int low, int high) {
    if (!node) return 0;
    if (node->val < low) return rangeSum(node->right, low, high);
    if (node->val > high) return rangeSum(node->left, low, high);
    return node->val + rangeSum(node->left, low, high) + rangeSum(node->right, low, high);
}`
      }
    },
    {
      lang: "js",
      title: "8. Middle of a sorted array is a balanced root",
      desc: "What this is\nA sorted array is an inorder dump of some BST.\nPicking the middle as root splits the keys in half and keeps the tree short.\n\nWhat the code is doing\nlo..hi inclusive. mid becomes a new node.\nLeft child is built from lo..mid-1. Right from mid+1..hi.\nEmpty range returns null.\n\nWatch out\nSlicing a new array every call is extra O(n) copies; pass indices instead.\nInserting 1..n in order is the opposite of this picture.",
      code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function fromSorted(nums, lo, hi) {
  if (lo > hi) return null;
  const mid = Math.floor((lo + hi) / 2);
  const node = new TreeNode(nums[mid]);
  node.left = fromSorted(nums, lo, mid - 1);
  node.right = fromSorted(nums, mid + 1, hi);
  return node;
}`,
      codes: {
        javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function fromSorted(nums, lo, hi) {
  if (lo > hi) return null;
  const mid = Math.floor((lo + hi) / 2);
  const node = new TreeNode(nums[mid]);
  node.left = fromSorted(nums, lo, mid - 1);
  node.right = fromSorted(nums, mid + 1, hi);
  return node;
}`,
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def from_sorted(nums, lo, hi):
    if lo > hi:
        return None
    mid = (lo + hi) // 2
    node = TreeNode(nums[mid])
    node.left = from_sorted(nums, lo, mid - 1)
    node.right = from_sorted(nums, mid + 1, hi)
    return node`,
        java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

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
        cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* fromSorted(vector<int>& nums, int lo, int hi) {
    if (lo > hi) return nullptr;
    int mid = lo + (hi - lo) / 2;
    TreeNode* node = new TreeNode(nums[mid]);
    node->left = fromSorted(nums, lo, mid - 1);
    node->right = fromSorted(nums, mid + 1, hi);
    return node;
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* fromSorted(int* nums, int lo, int hi) {
    if (lo > hi) return NULL;
    int mid = lo + (hi - lo) / 2;
    struct Node* node = newNode(nums[mid]);
    node->left = fromSorted(nums, lo, mid - 1);
    node->right = fromSorted(nums, mid + 1, hi);
    return node;
}`
      }
    }
  ],
  questions: [
    {
      id: 1,
      level: "beginner",
      q: "Search in a Binary Search Tree",
      ask: "Amazon · Google · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/search-in-a-binary-search-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/search-a-node-in-bst/1"}],
      a: "Return the subtree rooted at the node whose value equals val, or null if that key is missing.\n\nThe BST property lets you walk one path: go left when val is smaller, right when it is larger.\n\nBrute collects every node and scans. Optimal recurses on one child. More optimal is the same walk in a loop with O(1) extra memory.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Ignore the BST. DFS every node into a list, then scan for val. Correct on any binary tree, but you throw away the ordering.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function searchBST(root, val) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function searchBST(root, val) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def search_bst(root, val):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode searchBST(TreeNode root, int val) {
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* searchBST(TreeNode* root, int val) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

void goCollect(struct Node* node, struct Node** nodes, int* n) {
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
          }
        },
        {
          name: "Optimal",
          time: "O(h)",
          space: "O(h)",
          why: "Recurse on one child. Each call compares val with the node and drops a whole subtree. Stack depth is the height.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function searchBST(root, val) {
  if (!root || root.val === val) return root;
  if (val < root.val) return searchBST(root.left, val);
  return searchBST(root.right, val);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function searchBST(root, val) {
  if (!root || root.val === val) return root;
  if (val < root.val) return searchBST(root.left, val);
  return searchBST(root.right, val);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def search_bst(root, val):
    if root is None or root.val == val:
        return root
    if val < root.val:
        return search_bst(root.left, val)
    return search_bst(root.right, val)`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode searchBST(TreeNode root, int val) {
        if (root == null || root.val == val) return root;
        if (val < root.val) return searchBST(root.left, val);
        return searchBST(root.right, val);
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* searchBST(TreeNode* root, int val) {
    if (!root || root->val == val) return root;
    if (val < root->val) return searchBST(root->left, val);
    return searchBST(root->right, val);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* searchBST(struct Node* root, int val) {
    if (!root || root->val == val) return root;
    if (val < root->val) return searchBST(root->left, val);
    return searchBST(root->right, val);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(h)",
          space: "O(1)",
          why: "Same comparisons in a while loop. No call stack. Returns the node or null when the walk falls off.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function searchBST(root, val) {
  let cur = root;
  while (cur && cur.val !== val) {
    cur = val < cur.val ? cur.left : cur.right;
  }
  return cur;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function searchBST(root, val) {
  let cur = root;
  while (cur && cur.val !== val) {
    cur = val < cur.val ? cur.left : cur.right;
  }
  return cur;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def search_bst(root, val):
    cur = root
    while cur is not None and cur.val != val:
        cur = cur.left if val < cur.val else cur.right
    return cur`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode searchBST(TreeNode root, int val) {
        TreeNode cur = root;
        while (cur != null && cur.val != val) {
            cur = val < cur.val ? cur.left : cur.right;
        }
        return cur;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* searchBST(TreeNode* root, int val) {
    TreeNode* cur = root;
    while (cur && cur->val != val) cur = val < cur->val ? cur->left : cur->right;
    return cur;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* searchBST(struct Node* root, int val) {
    struct Node* cur = root;
    while (cur && cur->val != val) cur = val < cur->val ? cur->left : cur->right;
    return cur;
}`
          }
        }
      ]
    },
    {
      id: 2,
      level: "beginner",
      q: "Insert into a Binary Search Tree",
      ask: "Amazon · Meta · Apple · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/insert-into-a-binary-search-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/insert-a-node-in-a-bst/1"}],
      a: "Insert val as a new leaf so the tree stays a BST. LeetCode guarantees val is not already present.\n\nWalk like search until you hit null, then create the node. Return the (unchanged) root.\n\nBrute dumps keys, adds val, and rebuilds. Optimal recurses. More optimal inserts with a parent pointer in a loop.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Collect every key, append val, sort, and rebuild a balanced tree from the middle. Extra arrays; you never use the existing shape.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function insertIntoBST(root, val) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function insertIntoBST(root, val) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def insert_into_bst(root, val):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode insertIntoBST(TreeNode root, int val) {
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* insertIntoBST(TreeNode* root, int val) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

void collectKeys(struct Node* node, int* keys, int* n) {
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
          }
        },
        {
          name: "Optimal",
          time: "O(h)",
          space: "O(h)",
          why: "Recurse left or right and assign the returned child. When the child is null, allocate the new leaf. Root is returned unchanged unless the tree was empty.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function insertIntoBST(root, val) {
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left = insertIntoBST(root.left, val);
  else root.right = insertIntoBST(root.right, val);
  return root;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function insertIntoBST(root, val) {
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left = insertIntoBST(root.left, val);
  else root.right = insertIntoBST(root.right, val);
  return root;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def insert_into_bst(root, val):
    if root is None:
        return TreeNode(val)
    if val < root.val:
        root.left = insert_into_bst(root.left, val)
    else:
        root.right = insert_into_bst(root.right, val)
    return root`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode insertIntoBST(TreeNode root, int val) {
        if (root == null) return new TreeNode(val);
        if (val < root.val) root.left = insertIntoBST(root.left, val);
        else root.right = insertIntoBST(root.right, val);
        return root;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* insertIntoBST(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) root->left = insertIntoBST(root->left, val);
    else root->right = insertIntoBST(root->right, val);
    return root;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* insertIntoBST(struct Node* root, int val) {
    if (!root) return newNode(val);
    if (val < root->val) root->left = insertIntoBST(root->left, val);
    else root->right = insertIntoBST(root->right, val);
    return root;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(h)",
          space: "O(1)",
          why: "Iterative: if the tree is empty, return a new root. Else walk until the next child is null and attach there. No recursion.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function insertIntoBST(root, val) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function insertIntoBST(root, val) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def insert_into_bst(root, val):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode insertIntoBST(TreeNode root, int val) {
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* insertIntoBST(TreeNode* root, int val) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* insertIntoBST(struct Node* root, int val) {
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
          }
        }
      ]
    },
    {
      id: 3,
      level: "intermediate",
      q: "Delete Node in a BST",
      ask: "Google · Amazon · Meta · Uber",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/delete-node-in-a-bst/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/delete-a-node-from-bst/1"}],
      a: "Delete the node whose value is key and return the new root. The tree must stay a BST.\n\nZero children: drop it. One child: splice that child in. Two children: copy the inorder successor (leftmost of the right subtree) into the node, then delete the successor.\n\nBrute rebuilds from the remaining keys. Optimal is recursive Hibbard delete. More optimal finds the node with a parent pointer and splices in a loop.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Inorder dump every key except key, then rebuild a balanced BST from the sorted list. Simple, but you throw away the original shape.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function deleteNode(root, key) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function deleteNode(root, key) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def delete_node(root, key):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode deleteNode(TreeNode root, int key) {
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* deleteNode(TreeNode* root, int key) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

void collectExcept(struct Node* node, int key, int* keys, int* n) {
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
          }
        },
        {
          name: "Optimal",
          time: "O(h)",
          space: "O(h)",
          why: "Recurse to the node. Leaf or one child: return the other child. Two children: copy leftmost of right into node.val, then delete that successor from the right subtree.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function deleteNode(root, key) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function deleteNode(root, key) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def delete_node(root, key):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode deleteNode(TreeNode root, int key) {
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* deleteNode(TreeNode* root, int key) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* deleteNode(struct Node* root, int key) {
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
          }
        },
        {
          name: "More optimal",
          time: "O(h)",
          space: "O(1)",
          why: "Iterative search with a parent pointer. Splice zero/one-child nodes directly. For two children, copy the successor value then unlink the successor (it has no left child).",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function deleteNode(root, key) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function deleteNode(root, key) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def delete_node(root, key):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    TreeNode splice(TreeNode root, TreeNode parent, TreeNode node, TreeNode child) {
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* spliceNode(TreeNode* root, TreeNode* parent, TreeNode* node, TreeNode* child) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* spliceNode(struct Node* root, struct Node* parent, struct Node* node, struct Node* child) {
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
          }
        }
      ]
    },
    {
      id: 4,
      level: "intermediate",
      q: "Validate Binary Search Tree",
      ask: "Amazon · Meta · Microsoft · Google",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/validate-binary-search-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/check-for-bst/1"}],
      a: "Return true if the tree is a BST: every node is strictly greater than the entire left subtree and strictly smaller than the entire right subtree.\n\nChecking only the two children is wrong. Carry a (min, max) window, or dump inorder and require a strictly increasing sequence.\n\nBrute is inorder into an array. Optimal is recursive ranges with long bounds (node.val can be INT_MIN). More optimal is iterative inorder with a previous pointer.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Inorder dump all values, then check each pair is strictly increasing. Extra array holds the whole walk.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isValidBST(root) {
  const vals = [];
  function go(node) {
    if (!node) return;
    go(node.left);
    vals.push(node.val);
    go(node.right);
  }
  go(root);
  for (let i = 1; i < vals.length; i++) {
    if (vals[i] <= vals[i - 1]) return false;
  }
  return true;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isValidBST(root) {
  const vals = [];
  function go(node) {
    if (!node) return;
    go(node.left);
    vals.push(node.val);
    go(node.right);
  }
  go(root);
  for (let i = 1; i < vals.length; i++) {
    if (vals[i] <= vals[i - 1]) return false;
  }
  return true;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def is_valid_bst(root):
    vals = []
    def go(node):
        if node is None:
            return
        go(node.left)
        vals.append(node.val)
        go(node.right)
    go(root)
    for i in range(1, len(vals)):
        if vals[i] <= vals[i - 1]:
            return False
    return True`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public boolean isValidBST(TreeNode root) {
        List<Integer> vals = new ArrayList<Integer>();
        go(root, vals);
        for (int i = 1; i < vals.size(); i++) {
            if (vals.get(i) <= vals.get(i - 1)) return false;
        }
        return true;
    }
    void go(TreeNode node, List<Integer> vals) {
        if (node == null) return;
        go(node.left, vals);
        vals.add(node.val);
        go(node.right, vals);
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

bool isValidBST(TreeNode* root) {
    vector<int> vals;
    function<void(TreeNode*)> go = [&](TreeNode* node) {
        if (!node) return;
        go(node->left);
        vals.push_back(node->val);
        go(node->right);
    };
    go(root);
    for (int i = 1; i < (int)vals.size(); i++) if (vals[i] <= vals[i - 1]) return false;
    return true;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

void inorderVals(struct Node* node, int* vals, int* n) {
    if (!node) return;
    inorderVals(node->left, vals, n);
    vals[(*n)++] = node->val;
    inorderVals(node->right, vals, n);
}
bool isValidBST(struct Node* root) {
    int vals[10005], n = 0;
    inorderVals(root, vals, &n);
    for (int i = 1; i < n; i++) if (vals[i] <= vals[i - 1]) return false;
    return true;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Each node must lie in (lo, hi). Left child inherits hi = node.val; right inherits lo = node.val. Use a type wider than int so INT_MIN / INT_MAX are legal node values.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isValidBST(root) {
  function ok(node, lo, hi) {
    if (!node) return true;
    if (node.val <= lo || node.val >= hi) return false;
    return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);
  }
  return ok(root, -Infinity, Infinity);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isValidBST(root) {
  function ok(node, lo, hi) {
    if (!node) return true;
    if (node.val <= lo || node.val >= hi) return false;
    return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);
  }
  return ok(root, -Infinity, Infinity);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def is_valid_bst(root):
    def ok(node, lo, hi):
        if node is None:
            return True
        if node.val <= lo or node.val >= hi:
            return False
        return ok(node.left, lo, node.val) and ok(node.right, node.val, hi)
    return ok(root, float("-inf"), float("inf"))`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public boolean isValidBST(TreeNode root) {
        return ok(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }
    boolean ok(TreeNode node, long lo, long hi) {
        if (node == null) return true;
        if (node.val <= lo || node.val >= hi) return false;
        return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

bool isValidBST(TreeNode* root) {
    function<bool(TreeNode*, long long, long long)> ok = [&](TreeNode* node, long long lo, long long hi) {
        if (!node) return true;
        if (node->val <= lo || node->val >= hi) return false;
        return ok(node->left, lo, node->val) && ok(node->right, node->val, hi);
    };
    return ok(root, LLONG_MIN, LLONG_MAX);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

bool okRange(struct Node* node, long long lo, long long hi) {
    if (!node) return true;
    if (node->val <= lo || node->val >= hi) return false;
    return okRange(node->left, lo, node->val) && okRange(node->right, node->val, hi);
}
bool isValidBST(struct Node* root) {
    return okRange(root, LLONG_MIN, LLONG_MAX);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Iterative inorder. Track the previous value. If the current node is not greater, the tree is invalid. No extra value array.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isValidBST(root) {
  const stack = [];
  let cur = root;
  let prev = null;
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop();
    if (prev !== null && cur.val <= prev) return false;
    prev = cur.val;
    cur = cur.right;
  }
  return true;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isValidBST(root) {
  const stack = [];
  let cur = root;
  let prev = null;
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop();
    if (prev !== null && cur.val <= prev) return false;
    prev = cur.val;
    cur = cur.right;
  }
  return true;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def is_valid_bst(root):
    stack = []
    cur = root
    prev = None
    while cur is not None or stack:
        while cur is not None:
            stack.append(cur)
            cur = cur.left
        cur = stack.pop()
        if prev is not None and cur.val <= prev:
            return False
        prev = cur.val
        cur = cur.right
    return True`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public boolean isValidBST(TreeNode root) {
        Deque<TreeNode> stack = new ArrayDeque<TreeNode>();
        TreeNode cur = root;
        Integer prev = null;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) {
                stack.push(cur);
                cur = cur.left;
            }
            cur = stack.pop();
            if (prev != null && cur.val <= prev) return false;
            prev = cur.val;
            cur = cur.right;
        }
        return true;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

bool isValidBST(TreeNode* root) {
    vector<TreeNode*> stack;
    TreeNode* cur = root;
    TreeNode* prev = nullptr;
    while (cur || !stack.empty()) {
        while (cur) {
            stack.push_back(cur);
            cur = cur->left;
        }
        cur = stack.back(); stack.pop_back();
        if (prev && cur->val <= prev->val) return false;
        prev = cur;
        cur = cur->right;
    }
    return true;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

bool isValidBST(struct Node* root) {
    struct Node* stack[10005];
    int sp = 0;
    struct Node* cur = root;
    struct Node* prev = NULL;
    while (cur || sp) {
        while (cur) {
            stack[sp++] = cur;
            cur = cur->left;
        }
        cur = stack[--sp];
        if (prev && cur->val <= prev->val) return false;
        prev = cur;
        cur = cur->right;
    }
    return true;
}`
          }
        }
      ]
    },
    {
      id: 5,
      level: "beginner",
      q: "Convert Sorted Array to Binary Search Tree",
      ask: "Microsoft · Amazon · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/array-to-bst/1"}],
      a: "nums is sorted ascending. Build a height-balanced BST (left and right heights differ by at most 1).\n\nThe middle of a range is the root; the left half becomes the left subtree, the right half the right subtree.\n\nBrute inserts keys one by one into an empty BST (a stick). Optimal picks mid with array slices. More optimal passes lo/hi indices so you never copy the array.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(n)",
          why: "Insert 0..n-1 in order into an empty BST. Each insert walks a growing right spine, so you get a linked list of height n.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function sortedArrayToBST(nums) {
  function insert(node, val) {
    if (!node) return new TreeNode(val);
    if (val < node.val) node.left = insert(node.left, val);
    else node.right = insert(node.right, val);
    return node;
  }
  let root = null;
  for (let i = 0; i < nums.length; i++) root = insert(root, nums[i]);
  return root;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function sortedArrayToBST(nums) {
  function insert(node, val) {
    if (!node) return new TreeNode(val);
    if (val < node.val) node.left = insert(node.left, val);
    else node.right = insert(node.right, val);
    return node;
  }
  let root = null;
  for (let i = 0; i < nums.length; i++) root = insert(root, nums[i]);
  return root;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def sorted_array_to_bst(nums):
    def insert(node, val):
        if node is None:
            return TreeNode(val)
        if val < node.val:
            node.left = insert(node.left, val)
        else:
            node.right = insert(node.right, val)
        return node
    root = None
    for val in nums:
        root = insert(root, val)
    return root`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    TreeNode insert(TreeNode node, int val) {
        if (node == null) return new TreeNode(val);
        if (val < node.val) node.left = insert(node.left, val);
        else node.right = insert(node.right, val);
        return node;
    }
    public TreeNode sortedArrayToBST(int[] nums) {
        TreeNode root = null;
        for (int val : nums) root = insert(root, val);
        return root;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* insertVal(TreeNode* node, int val) {
    if (!node) return new TreeNode(val);
    if (val < node->val) node->left = insertVal(node->left, val);
    else node->right = insertVal(node->right, val);
    return node;
}
TreeNode* sortedArrayToBST(vector<int>& nums) {
    TreeNode* root = nullptr;
    for (int val : nums) root = insertVal(root, val);
    return root;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* insertVal(struct Node* node, int val) {
    if (!node) return newNode(val);
    if (val < node->val) node->left = insertVal(node->left, val);
    else node->right = insertVal(node->right, val);
    return node;
}
struct Node* sortedArrayToBST(int* nums, int numsSize) {
    struct Node* root = NULL;
    for (int i = 0; i < numsSize; i++) root = insertVal(root, nums[i]);
    return root;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Slice the array around mid each call. Balanced, but each slice copies O(n) elements across the tree of calls.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function sortedArrayToBST(nums) {
  if (!nums.length) return null;
  const mid = Math.floor(nums.length / 2);
  const node = new TreeNode(nums[mid]);
  node.left = sortedArrayToBST(nums.slice(0, mid));
  node.right = sortedArrayToBST(nums.slice(mid + 1));
  return node;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function sortedArrayToBST(nums) {
  if (!nums.length) return null;
  const mid = Math.floor(nums.length / 2);
  const node = new TreeNode(nums[mid]);
  node.left = sortedArrayToBST(nums.slice(0, mid));
  node.right = sortedArrayToBST(nums.slice(mid + 1));
  return node;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def sorted_array_to_bst(nums):
    if not nums:
        return None
    mid = len(nums) // 2
    node = TreeNode(nums[mid])
    node.left = sorted_array_to_bst(nums[:mid])
    node.right = sorted_array_to_bst(nums[mid + 1:])
    return node`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        return build(nums, 0, nums.length - 1);
    }
    TreeNode build(int[] nums, int lo, int hi) {
        if (lo > hi) return null;
        int mid = lo + (hi - lo) / 2;
        TreeNode node = new TreeNode(nums[mid]);
        node.left = build(nums, lo, mid - 1);
        node.right = build(nums, mid + 1, hi);
        return node;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* sortedArrayToBST(vector<int>& nums) {
    function<TreeNode*(int,int)> build = [&](int lo, int hi) -> TreeNode* {
        if (lo > hi) return nullptr;
        int mid = lo + (hi - lo) / 2;
        TreeNode* node = new TreeNode(nums[mid]);
        node->left = build(lo, mid - 1);
        node->right = build(mid + 1, hi);
        return node;
    };
    return build(0, (int)nums.size() - 1);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* buildArr(int* nums, int lo, int hi) {
    if (lo > hi) return NULL;
    int mid = lo + (hi - lo) / 2;
    struct Node* node = newNode(nums[mid]);
    node->left = buildArr(nums, lo, mid - 1);
    node->right = buildArr(nums, mid + 1, hi);
    return node;
}
struct Node* sortedArrayToBST(int* nums, int numsSize) {
    return buildArr(nums, 0, numsSize - 1);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(log n)",
          why: "Pass inclusive indices. Each node is created once. Recursion depth is the height of the balanced tree.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function sortedArrayToBST(nums) {
  function build(lo, hi) {
    if (lo > hi) return null;
    const mid = Math.floor((lo + hi) / 2);
    const node = new TreeNode(nums[mid]);
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  }
  return build(0, nums.length - 1);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function sortedArrayToBST(nums) {
  function build(lo, hi) {
    if (lo > hi) return null;
    const mid = Math.floor((lo + hi) / 2);
    const node = new TreeNode(nums[mid]);
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  }
  return build(0, nums.length - 1);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def sorted_array_to_bst(nums):
    def build(lo, hi):
        if lo > hi:
            return None
        mid = (lo + hi) // 2
        node = TreeNode(nums[mid])
        node.left = build(lo, mid - 1)
        node.right = build(mid + 1, hi)
        return node
    return build(0, len(nums) - 1)`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        return build(nums, 0, nums.length - 1);
    }
    TreeNode build(int[] nums, int lo, int hi) {
        if (lo > hi) return null;
        int mid = lo + (hi - lo) / 2;
        TreeNode node = new TreeNode(nums[mid]);
        node.left = build(nums, lo, mid - 1);
        node.right = build(nums, mid + 1, hi);
        return node;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* sortedArrayToBST(vector<int>& nums) {
    function<TreeNode*(int,int)> build = [&](int lo, int hi) -> TreeNode* {
        if (lo > hi) return nullptr;
        int mid = lo + (hi - lo) / 2;
        TreeNode* node = new TreeNode(nums[mid]);
        node->left = build(lo, mid - 1);
        node->right = build(mid + 1, hi);
        return node;
    };
    return build(0, (int)nums.size() - 1);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* buildArr(int* nums, int lo, int hi) {
    if (lo > hi) return NULL;
    int mid = lo + (hi - lo) / 2;
    struct Node* node = newNode(nums[mid]);
    node->left = buildArr(nums, lo, mid - 1);
    node->right = buildArr(nums, mid + 1, hi);
    return node;
}
struct Node* sortedArrayToBST(int* nums, int numsSize) {
    return buildArr(nums, 0, numsSize - 1);
}`
          }
        }
      ]
    },
    {
      id: 6,
      level: "intermediate",
      q: "Convert Sorted List to Binary Search Tree",
      ask: "Amazon · Google · Microsoft · Meta",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/sorted-linked-list-to-balanced-bst/"}],
      a: "The input is a sorted singly linked list, not an array. Build the same height-balanced BST.\n\nYou can copy the list into an array and reuse the array solution. Or cut the list at the middle with slow/fast each time. The linear trick simulates inorder: the list pointer walks left-root-right while you create nodes in that order.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Walk the list into an array, then build from mid indices. Extra O(n) memory for the copy.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function sortedListToBST(head) {
  const nums = [];
  while (head) {
    nums.push(head.val);
    head = head.next;
  }
  function build(lo, hi) {
    if (lo > hi) return null;
    const mid = Math.floor((lo + hi) / 2);
    const node = new TreeNode(nums[mid]);
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  }
  return build(0, nums.length - 1);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function sortedListToBST(head) {
  const nums = [];
  while (head) {
    nums.push(head.val);
    head = head.next;
  }
  function build(lo, hi) {
    if (lo > hi) return null;
    const mid = Math.floor((lo + hi) / 2);
    const node = new TreeNode(nums[mid]);
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  }
  return build(0, nums.length - 1);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def sorted_list_to_bst(head):
    nums = []
    while head:
        nums.append(head.val)
        head = head.next
    def build(lo, hi):
        if lo > hi:
            return None
        mid = (lo + hi) // 2
        node = TreeNode(nums[mid])
        node.left = build(lo, mid - 1)
        node.right = build(mid + 1, hi)
        return node
    return build(0, len(nums) - 1)`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public TreeNode sortedListToBST(ListNode head) {
        List<Integer> nums = new ArrayList<Integer>();
        while (head != null) {
            nums.add(head.val);
            head = head.next;
        }
        return build(nums, 0, nums.size() - 1);
    }
    TreeNode build(List<Integer> nums, int lo, int hi) {
        if (lo > hi) return null;
        int mid = lo + (hi - lo) / 2;
        TreeNode node = new TreeNode(nums.get(mid));
        node.left = build(nums, lo, mid - 1);
        node.right = build(nums, mid + 1, hi);
        return node;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

TreeNode* sortedListToBST(ListNode* head) {
    vector<int> nums;
    while (head) { nums.push_back(head->val); head = head->next; }
    function<TreeNode*(int,int)> build = [&](int lo, int hi) -> TreeNode* {
        if (lo > hi) return nullptr;
        int mid = lo + (hi - lo) / 2;
        TreeNode* node = new TreeNode(nums[mid]);
        node->left = build(lo, mid - 1);
        node->right = build(mid + 1, hi);
        return node;
    };
    return build(0, (int)nums.size() - 1);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct ListNode {
    int val;
    struct ListNode* next;
};

struct ListNode* newListNode(int val) {
    struct ListNode* n = (struct ListNode*)malloc(sizeof(struct ListNode));
    n->val = val;
    n->next = NULL;
    return n;
}

struct Node* buildArr(int* nums, int lo, int hi) {
    if (lo > hi) return NULL;
    int mid = lo + (hi - lo) / 2;
    struct Node* node = newNode(nums[mid]);
    node->left = buildArr(nums, lo, mid - 1);
    node->right = buildArr(nums, mid + 1, hi);
    return node;
}
struct Node* sortedListToBST(struct ListNode* head) {
    int nums[20005], n = 0;
    while (head) { nums[n++] = head->val; head = head->next; }
    return buildArr(nums, 0, n - 1);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n log n)",
          space: "O(log n)",
          why: "Slow/fast finds the mid. Cut prev.next so the left half is a shorter list. Recurse on left half, mid node, and right half. No array, but each level rescans the list.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function sortedListToBST(head) {
  if (!head) return null;
  if (!head.next) return new TreeNode(head.val);
  let prev = null;
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    prev = slow;
    slow = slow.next;
    fast = fast.next.next;
  }
  prev.next = null;
  const node = new TreeNode(slow.val);
  node.left = sortedListToBST(head);
  node.right = sortedListToBST(slow.next);
  return node;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function sortedListToBST(head) {
  if (!head) return null;
  if (!head.next) return new TreeNode(head.val);
  let prev = null;
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    prev = slow;
    slow = slow.next;
    fast = fast.next.next;
  }
  prev.next = null;
  const node = new TreeNode(slow.val);
  node.left = sortedListToBST(head);
  node.right = sortedListToBST(slow.next);
  return node;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def sorted_list_to_bst(head):
    if head is None:
        return None
    if head.next is None:
        return TreeNode(head.val)
    prev = None
    slow = head
    fast = head
    while fast and fast.next:
        prev = slow
        slow = slow.next
        fast = fast.next.next
    prev.next = None
    node = TreeNode(slow.val)
    node.left = sorted_list_to_bst(head)
    node.right = sorted_list_to_bst(slow.next)
    return node`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public TreeNode sortedListToBST(ListNode head) {
        if (head == null) return null;
        if (head.next == null) return new TreeNode(head.val);
        ListNode prev = null, slow = head, fast = head;
        while (fast != null && fast.next != null) {
            prev = slow;
            slow = slow.next;
            fast = fast.next.next;
        }
        prev.next = null;
        TreeNode node = new TreeNode(slow.val);
        node.left = sortedListToBST(head);
        node.right = sortedListToBST(slow.next);
        return node;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

TreeNode* sortedListToBST(ListNode* head) {
    if (!head) return nullptr;
    if (!head->next) return new TreeNode(head->val);
    ListNode* prev = nullptr;
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        prev = slow;
        slow = slow->next;
        fast = fast->next->next;
    }
    prev->next = nullptr;
    TreeNode* node = new TreeNode(slow->val);
    node->left = sortedListToBST(head);
    node->right = sortedListToBST(slow->next);
    return node;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct ListNode {
    int val;
    struct ListNode* next;
};

struct ListNode* newListNode(int val) {
    struct ListNode* n = (struct ListNode*)malloc(sizeof(struct ListNode));
    n->val = val;
    n->next = NULL;
    return n;
}

struct Node* sortedListToBST(struct ListNode* head) {
    if (!head) return NULL;
    if (!head->next) return newNode(head->val);
    struct ListNode* prev = NULL;
    struct ListNode* slow = head;
    struct ListNode* fast = head;
    while (fast && fast->next) {
        prev = slow;
        slow = slow->next;
        fast = fast->next->next;
    }
    prev->next = NULL;
    struct Node* node = newNode(slow->val);
    node->left = sortedListToBST(head);
    node->right = sortedListToBST(slow->next);
    return node;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(log n)",
          why: "Count n. Inorder-build: recurse left of size n/2, consume the current list node as the root, then recurse right. The list pointer only moves forward. Each node is visited once.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function sortedListToBST(head) {
  let n = 0;
  let cur = head;
  while (cur) { n++; cur = cur.next; }
  cur = head;
  function build(count) {
    if (count <= 0) return null;
    const left = build(Math.floor((count - 1) / 2));
    const node = new TreeNode(cur.val);
    cur = cur.next;
    node.left = left;
    node.right = build(Math.floor(count / 2));
    return node;
  }
  return build(n);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function sortedListToBST(head) {
  let n = 0;
  let cur = head;
  while (cur) { n++; cur = cur.next; }
  cur = head;
  function build(count) {
    if (count <= 0) return null;
    const left = build(Math.floor((count - 1) / 2));
    const node = new TreeNode(cur.val);
    cur = cur.next;
    node.left = left;
    node.right = build(Math.floor(count / 2));
    return node;
  }
  return build(n);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def sorted_list_to_bst(head):
    n = 0
    cur = head
    while cur:
        n += 1
        cur = cur.next
    cur = head
    def build(count):
        nonlocal cur
        if count <= 0:
            return None
        left = build((count - 1) // 2)
        node = TreeNode(cur.val)
        cur = cur.next
        node.left = left
        node.right = build(count // 2)
        return node
    return build(n)`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    ListNode cur;
    public TreeNode sortedListToBST(ListNode head) {
        int n = 0;
        for (ListNode p = head; p != null; p = p.next) n++;
        cur = head;
        return build(n);
    }
    TreeNode build(int count) {
        if (count <= 0) return null;
        TreeNode left = build((count - 1) / 2);
        TreeNode node = new TreeNode(cur.val);
        cur = cur.next;
        node.left = left;
        node.right = build(count / 2);
        return node;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

TreeNode* sortedListToBST(ListNode* head) {
    int n = 0;
    for (ListNode* p = head; p; p = p->next) n++;
    ListNode* cur = head;
    function<TreeNode*(int)> build = [&](int count) -> TreeNode* {
        if (count <= 0) return nullptr;
        TreeNode* left = build((count - 1) / 2);
        TreeNode* node = new TreeNode(cur->val);
        cur = cur->next;
        node->left = left;
        node->right = build(count / 2);
        return node;
    };
    return build(n);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct ListNode {
    int val;
    struct ListNode* next;
};

struct ListNode* newListNode(int val) {
    struct ListNode* n = (struct ListNode*)malloc(sizeof(struct ListNode));
    n->val = val;
    n->next = NULL;
    return n;
}

struct Node* buildInorder(struct ListNode** cur, int count) {
    if (count <= 0) return NULL;
    struct Node* left = buildInorder(cur, (count - 1) / 2);
    struct Node* node = newNode((*cur)->val);
    *cur = (*cur)->next;
    node->left = left;
    node->right = buildInorder(cur, count / 2);
    return node;
}
struct Node* sortedListToBST(struct ListNode* head) {
    int n = 0;
    for (struct ListNode* p = head; p; p = p->next) n++;
    return buildInorder(&head, n);
}`
          }
        }
      ]
    },
    {
      id: 7,
      level: "intermediate",
      q: "Trim a Binary Search Tree",
      ask: "Amazon · Google · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/trim-a-binary-search-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/remove-bst-keys-outside-the-given-range/"}],
      a: "Keep only nodes whose values lie in [low, high]. The remaining nodes must still form a BST, and you should reuse existing nodes (not copy values into new ones).\n\nIf the node is below low, the whole left side is too small — return the trimmed right. If it is above high, return the trimmed left. Otherwise keep the node and trim both children.\n\nBrute collects in-range keys and rebuilds. Optimal is the recursive prune. More optimal walks iteratively when the root itself is outside the window, then trims children.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Gather every in-range key, sort, rebuild a balanced tree. Correct values, but new nodes and a different shape.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function trimBST(root, low, high) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function trimBST(root, low, high) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def trim_bst(root, low, high):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode trimBST(TreeNode root, int low, int high) {
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* trimBST(TreeNode* root, int low, int high) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

void collectRange(struct Node* node, int low, int high, int* keys, int* n) {
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
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Postorder prune using the BST property. Reuse the original nodes. If the root is outside the window, drop it and return one trimmed child.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function trimBST(root, low, high) {
  if (!root) return null;
  if (root.val < low) return trimBST(root.right, low, high);
  if (root.val > high) return trimBST(root.left, low, high);
  root.left = trimBST(root.left, low, high);
  root.right = trimBST(root.right, low, high);
  return root;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function trimBST(root, low, high) {
  if (!root) return null;
  if (root.val < low) return trimBST(root.right, low, high);
  if (root.val > high) return trimBST(root.left, low, high);
  root.left = trimBST(root.left, low, high);
  root.right = trimBST(root.right, low, high);
  return root;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def trim_bst(root, low, high):
    if root is None:
        return None
    if root.val < low:
        return trim_bst(root.right, low, high)
    if root.val > high:
        return trim_bst(root.left, low, high)
    root.left = trim_bst(root.left, low, high)
    root.right = trim_bst(root.right, low, high)
    return root`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode trimBST(TreeNode root, int low, int high) {
        if (root == null) return null;
        if (root.val < low) return trimBST(root.right, low, high);
        if (root.val > high) return trimBST(root.left, low, high);
        root.left = trimBST(root.left, low, high);
        root.right = trimBST(root.right, low, high);
        return root;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* trimBST(TreeNode* root, int low, int high) {
    if (!root) return nullptr;
    if (root->val < low) return trimBST(root->right, low, high);
    if (root->val > high) return trimBST(root->left, low, high);
    root->left = trimBST(root->left, low, high);
    root->right = trimBST(root->right, low, high);
    return root;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* trimBST(struct Node* root, int low, int high) {
    if (!root) return NULL;
    if (root->val < low) return trimBST(root->right, low, high);
    if (root->val > high) return trimBST(root->left, low, high);
    root->left = trimBST(root->left, low, high);
    root->right = trimBST(root->right, low, high);
    return root;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Move the root iteratively until it sits inside [low, high], then recursively trim the two sides. Fewer frames when the original root is far outside the window.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function trimBST(root, low, high) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function trimBST(root, low, high) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def trim_bst(root, low, high):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    TreeNode trim(TreeNode node, int low, int high) {
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* trimSide(TreeNode* node, int low, int high) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* trimSide(struct Node* node, int low, int high) {
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
          }
        }
      ]
    },
    {
      id: 8,
      level: "beginner",
      q: "Range Sum of BST",
      ask: "Amazon · Meta · Uber",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/range-sum-of-bst/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/count-bst-nodes-that-lie-in-a-given-range/"}],
      a: "Sum every node value that sits in the closed interval [low, high].\n\nYou may visit the whole tree. A BST lets you skip a side: node.val < low means left is useless; node.val > high means right is useless.\n\nBrute adds after visiting everyone. Optimal prunes in recursion. More optimal is an explicit stack with the same prune.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(h)",
          why: "DFS every node. Add val when it is inside the interval. Correct on a plain binary tree too.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function rangeSumBST(root, low, high) {
  if (!root) return 0;
  const add = root.val >= low && root.val <= high ? root.val : 0;
  return add + rangeSumBST(root.left, low, high) + rangeSumBST(root.right, low, high);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function rangeSumBST(root, low, high) {
  if (!root) return 0;
  const add = root.val >= low && root.val <= high ? root.val : 0;
  return add + rangeSumBST(root.left, low, high) + rangeSumBST(root.right, low, high);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def range_sum_bst(root, low, high):
    if root is None:
        return 0
    add = root.val if low <= root.val <= high else 0
    return add + range_sum_bst(root.left, low, high) + range_sum_bst(root.right, low, high)`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public int rangeSumBST(TreeNode root, int low, int high) {
        if (root == null) return 0;
        int add = (root.val >= low && root.val <= high) ? root.val : 0;
        return add + rangeSumBST(root.left, low, high) + rangeSumBST(root.right, low, high);
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

int rangeSumBST(TreeNode* root, int low, int high) {
    if (!root) return 0;
    int add = (root->val >= low && root->val <= high) ? root->val : 0;
    return add + rangeSumBST(root->left, low, high) + rangeSumBST(root->right, low, high);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

int rangeSumBST(struct Node* root, int low, int high) {
    if (!root) return 0;
    int add = (root->val >= low && root->val <= high) ? root->val : 0;
    return add + rangeSumBST(root->left, low, high) + rangeSumBST(root->right, low, high);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Prune: skip left when node is below low, skip right when node is above high. Best case you only walk the in-range corridor.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function rangeSumBST(root, low, high) {
  if (!root) return 0;
  if (root.val < low) return rangeSumBST(root.right, low, high);
  if (root.val > high) return rangeSumBST(root.left, low, high);
  return root.val + rangeSumBST(root.left, low, high) + rangeSumBST(root.right, low, high);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function rangeSumBST(root, low, high) {
  if (!root) return 0;
  if (root.val < low) return rangeSumBST(root.right, low, high);
  if (root.val > high) return rangeSumBST(root.left, low, high);
  return root.val + rangeSumBST(root.left, low, high) + rangeSumBST(root.right, low, high);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def range_sum_bst(root, low, high):
    if root is None:
        return 0
    if root.val < low:
        return range_sum_bst(root.right, low, high)
    if root.val > high:
        return range_sum_bst(root.left, low, high)
    return root.val + range_sum_bst(root.left, low, high) + range_sum_bst(root.right, low, high)`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public int rangeSumBST(TreeNode root, int low, int high) {
        if (root == null) return 0;
        if (root.val < low) return rangeSumBST(root.right, low, high);
        if (root.val > high) return rangeSumBST(root.left, low, high);
        return root.val + rangeSumBST(root.left, low, high) + rangeSumBST(root.right, low, high);
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

int rangeSumBST(TreeNode* root, int low, int high) {
    if (!root) return 0;
    if (root->val < low) return rangeSumBST(root->right, low, high);
    if (root->val > high) return rangeSumBST(root->left, low, high);
    return root->val + rangeSumBST(root->left, low, high) + rangeSumBST(root->right, low, high);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

int rangeSumBST(struct Node* root, int low, int high) {
    if (!root) return 0;
    if (root->val < low) return rangeSumBST(root->right, low, high);
    if (root->val > high) return rangeSumBST(root->left, low, high);
    return root->val + rangeSumBST(root->left, low, high) + rangeSumBST(root->right, low, high);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Explicit stack, same prune. No recursion. Push only children that can still hold in-range keys.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function rangeSumBST(root, low, high) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function rangeSumBST(root, low, high) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def range_sum_bst(root, low, high):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public int rangeSumBST(TreeNode root, int low, int high) {
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

int rangeSumBST(TreeNode* root, int low, int high) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

int rangeSumBST(struct Node* root, int low, int high) {
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
          }
        }
      ]
    },
    {
      id: 9,
      level: "intermediate",
      q: "Inorder Successor in BST",
      ask: "Microsoft · Amazon · Google · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/inorder-successor-in-bst/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/inorder-successor-in-bst/1"}],
      a: "Given a BST and a node p, return the next node in inorder (the smallest key greater than p), or null if p is the maximum.\n\nIf p has a right child, the successor is the leftmost node in that right subtree. Otherwise walk from the root and remember the last node that was greater than p.\n\nBrute dumps inorder. Optimal uses the BST walk from the root. More optimal branches on whether p.right exists so you often never start at the root.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Inorder list of nodes, find p, return the next entry. Extra linear memory.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function inorderSuccessor(root, p) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function inorderSuccessor(root, p) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def inorder_successor(root, p):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode inorderSuccessor(TreeNode root, TreeNode p) {
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* inorderSuccessor(TreeNode* root, TreeNode* p) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

void collectNodes(struct Node* node, struct Node** nodes, int* n) {
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
          }
        },
        {
          name: "Optimal",
          time: "O(h)",
          space: "O(1)",
          why: "Walk from the root. Whenever the current node is greater than p, it is a candidate successor — go left to hunt a closer one. Otherwise go right.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function inorderSuccessor(root, p) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function inorderSuccessor(root, p) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def inorder_successor(root, p):
    succ = None
    cur = root
    while cur:
        if p.val < cur.val:
            succ = cur
            cur = cur.left
        else:
            cur = cur.right
    return succ`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode inorderSuccessor(TreeNode root, TreeNode p) {
        TreeNode succ = null, cur = root;
        while (cur != null) {
            if (p.val < cur.val) { succ = cur; cur = cur.left; }
            else cur = cur.right;
        }
        return succ;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* inorderSuccessor(TreeNode* root, TreeNode* p) {
    TreeNode* succ = nullptr;
    TreeNode* cur = root;
    while (cur) {
        if (p->val < cur->val) { succ = cur; cur = cur->left; }
        else cur = cur->right;
    }
    return succ;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* inorderSuccessor(struct Node* root, struct Node* p) {
    struct Node* succ = NULL;
    struct Node* cur = root;
    while (cur) {
        if (p->val < cur->val) { succ = cur; cur = cur->left; }
        else cur = cur->right;
    }
    return succ;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(h)",
          space: "O(1)",
          why: "If p has a right child, successor is leftmost there — O(h) on that spine only. Else fall back to the root walk. Same worst case, often shorter.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function inorderSuccessor(root, p) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function inorderSuccessor(root, p) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def inorder_successor(root, p):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode inorderSuccessor(TreeNode root, TreeNode p) {
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
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* inorderSuccessor(TreeNode* root, TreeNode* p) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* inorderSuccessor(struct Node* root, struct Node* p) {
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
          }
        }
      ]
    },
    {
      id: 10,
      level: "intermediate",
      q: "Binary Search Tree Iterator",
      ask: "Meta · Amazon · Google · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/binary-search-tree-iterator/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/bst-iterator/1"}],
      a: "Implement next() and hasNext() for the inorder walk of a BST. next() returns the next smallest key. Both calls should be average O(1) time and use O(h) memory if you can.\n\nBrute dumps the whole inorder array up front. Optimal keeps a stack of the left spine and pushes the right child's left spine after each next(). More optimal threads Morris links so extra memory is O(1) besides the output of next.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n) init, O(1) next",
          space: "O(n)",
          why: "Flatten inorder into an array at construction. next/hasNext are index moves. Simple, but you pay linear memory before the first call.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function BSTIterator(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function BSTIterator(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
class BSTIterator:
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    List<Integer> vals = new ArrayList<Integer>();
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
    public boolean hasNext() { return i < vals.size(); }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

class BSTIterator {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

typedef struct {
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
          }
        },
        {
          name: "Optimal",
          time: "O(h) init, amortized O(1) next",
          space: "O(h)",
          why: "Stack holds the path to the next node. Construction pushes the left spine. next() pops, then pushes the left spine of the right child.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function BSTIterator(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function BSTIterator(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
class BSTIterator:
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    Deque<TreeNode> stack = new ArrayDeque<TreeNode>();
    public Solution(TreeNode root) { pushLeft(root); }
    void pushLeft(TreeNode node) {
        while (node != null) { stack.push(node); node = node.left; }
    }
    public int next() {
        TreeNode node = stack.pop();
        pushLeft(node.right);
        return node.val;
    }
    public boolean hasNext() { return !stack.isEmpty(); }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

class BSTIterator {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

typedef struct {
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
          }
        },
        {
          name: "More optimal",
          time: "amortized O(1) next",
          space: "O(1)",
          why: "Morris: thread predecessor.right to the current node, walk without a stack. Unthread before yielding so the tree is restored. Extra memory is a handful of pointers.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function BSTIterator(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function BSTIterator(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
class BSTIterator:
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    TreeNode cur;
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
    public boolean hasNext() { return cur != null; }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

class BSTIterator {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

typedef struct { struct Node* cur; } BSTIterator;
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
          }
        }
      ]
    },
    {
      id: 11,
      level: "advanced",
      q: "Recover Binary Search Tree",
      ask: "Amazon · Google · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/recover-binary-search-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/fix-two-swapped-nodes-of-bst/"}],
      a: "Exactly two nodes in a BST had their values swapped. Restore the tree without changing the structure. Do it in O(1) extra space if you can.\n\nInorder of a BST should be sorted. Two swapped values make either two drops (non-adjacent swap) or one drop (adjacent swap). Find the first and last node that break increasing order, then swap their values.\n\nBrute copies inorder, sorts, writes back. Optimal finds the two nodes while walking. More optimal is Morris inorder so the walk itself uses O(1) extra pointers.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n log n)",
          space: "O(n)",
          why: "Store every node in inorder, copy values, sort the copy, write sorted values back. Structure is unchanged; you sort instead of finding the pair.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function recoverTree(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function recoverTree(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def recover_tree(root):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public void recoverTree(TreeNode root) {
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

void recoverTree(TreeNode* root) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

void collectNodes(struct Node* node, struct Node** nodes, int* n) {
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
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Inorder with a prev pointer. first is the previous node at the first drop. second is the current node at every drop (so adjacent swaps still work). Swap first.val and second.val.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function recoverTree(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function recoverTree(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def recover_tree(root):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    TreeNode first, second, prev;
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

void recoverTree(TreeNode* root) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

void recoverGo(struct Node* node, struct Node** first, struct Node** second, struct Node** prev) {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Morris inorder with the same first/second logic. Thread and unthread predecessor links so you do not keep a stack.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function recoverTree(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function recoverTree(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def recover_tree(root):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    TreeNode first, second, prevN;
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

void recoverTree(TreeNode* root) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

void recoverTree(struct Node* root) {
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
          }
        }
      ]
    },
    {
      id: 12,
      level: "intermediate",
      q: "Unique Binary Search Trees",
      ask: "Amazon · Google · Microsoft · Uber",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/unique-binary-search-trees/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/unique-bsts-1587115623/1"}],
      a: "Given n, count how many structurally different BSTs store the keys 1..n.\n\nIf i is the root, left keys are 1..i-1 and right keys are i+1..n. The counts multiply, then you sum over every choice of root. That recurrence is the Catalan numbers: C(n) = sum C(i)*C(n-1-i).\n\nBrute recurses with no memory. Optimal is bottom-up DP. More optimal multiplies the Catalan formula in O(n).\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(4^n / n^{3/2})",
          space: "O(n)",
          why: "Naive recursion: try each root and multiply left-count * right-count. Exponential overlapping subproblems.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function numTrees(n) {
  function count(len) {
    if (len <= 1) return 1;
    let total = 0;
    for (let left = 0; left < len; left++) {
      total += count(left) * count(len - 1 - left);
    }
    return total;
  }
  return count(n);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function numTrees(n) {
  function count(len) {
    if (len <= 1) return 1;
    let total = 0;
    for (let left = 0; left < len; left++) {
      total += count(left) * count(len - 1 - left);
    }
    return total;
  }
  return count(n);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def num_trees(n):
    def count(length):
        if length <= 1:
            return 1
        total = 0
        for left in range(length):
            total += count(left) * count(length - 1 - left)
        return total
    return count(n)`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public int numTrees(int n) {
        return count(n);
    }
    int count(int len) {
        if (len <= 1) return 1;
        int total = 0;
        for (int left = 0; left < len; left++) total += count(left) * count(len - 1 - left);
        return total;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

int countLen(int len) {
    if (len <= 1) return 1;
    int total = 0;
    for (int left = 0; left < len; left++) total += countLen(left) * countLen(len - 1 - left);
    return total;
}
int numTrees(int n) { return countLen(n); }`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

int countLen(int len) {
    if (len <= 1) return 1;
    int total = 0;
    for (int left = 0; left < len; left++) total += countLen(left) * countLen(len - 1 - left);
    return total;
}
int numTrees(int n) { return countLen(n); }`
          }
        },
        {
          name: "Optimal",
          time: "O(n²)",
          space: "O(n)",
          why: "dp[k] = number of BSTs on k keys. dp[0]=1. Each k sums dp[left]*dp[k-1-left]. Standard Catalan DP.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function numTrees(n) {
  const dp = Array(n + 1).fill(0);
  dp[0] = 1;
  for (let k = 1; k <= n; k++) {
    for (let left = 0; left < k; left++) dp[k] += dp[left] * dp[k - 1 - left];
  }
  return dp[n];
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function numTrees(n) {
  const dp = Array(n + 1).fill(0);
  dp[0] = 1;
  for (let k = 1; k <= n; k++) {
    for (let left = 0; left < k; left++) dp[k] += dp[left] * dp[k - 1 - left];
  }
  return dp[n];
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def num_trees(n):
    dp = [0] * (n + 1)
    dp[0] = 1
    for k in range(1, n + 1):
        for left in range(k):
            dp[k] += dp[left] * dp[k - 1 - left]
    return dp[n]`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public int numTrees(int n) {
        int[] dp = new int[n + 1];
        dp[0] = 1;
        for (int k = 1; k <= n; k++) {
            for (int left = 0; left < k; left++) dp[k] += dp[left] * dp[k - 1 - left];
        }
        return dp[n];
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

int numTrees(int n) {
    vector<long long> dp(n + 1);
    dp[0] = 1;
    for (int k = 1; k <= n; k++)
        for (int left = 0; left < k; left++) dp[k] += dp[left] * dp[k - 1 - left];
    return (int)dp[n];
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

int numTrees(int n) {
    long long dp[25];
    int i, left, k;
    for (i = 0; i <= n; i++) dp[i] = 0;
    dp[0] = 1;
    for (k = 1; k <= n; k++)
        for (left = 0; left < k; left++) dp[k] += dp[left] * dp[k - 1 - left];
    return (int)dp[n];
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "C(n) = C(n-1) * 2(2n-1)/(n+1). Multiply carefully with integer arithmetic. One pass, constant extra memory.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function numTrees(n) {
  let c = 1;
  for (let i = 2; i <= n; i++) c = c * 2 * (2 * i - 1) / (i + 1);
  return Math.round(c);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function numTrees(n) {
  let c = 1;
  for (let i = 2; i <= n; i++) c = c * 2 * (2 * i - 1) / (i + 1);
  return Math.round(c);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def num_trees(n):
    c = 1
    for i in range(2, n + 1):
        c = c * 2 * (2 * i - 1) // (i + 1)
    return c`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public int numTrees(int n) {
        long c = 1;
        for (int i = 2; i <= n; i++) c = c * 2 * (2L * i - 1) / (i + 1);
        return (int) c;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

int numTrees(int n) {
    long long c = 1;
    for (int i = 2; i <= n; i++) c = c * 2 * (2LL * i - 1) / (i + 1);
    return (int)c;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

int numTrees(int n) {
    long long c = 1;
    for (int i = 2; i <= n; i++) c = c * 2 * (2LL * i - 1) / (i + 1);
    return (int)c;
}`
          }
        }
      ]
    },
    {
      id: 13,
      level: "advanced",
      q: "Unique Binary Search Trees II",
      ask: "Amazon · Google · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/unique-binary-search-trees-ii/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/construct-all-possible-bsts-for-keys-1-to-n/"}],
      a: "Return every structurally different BST that stores 1..n, not just the count.\n\nPick each value as root, generate all left trees on the smaller keys and all right trees on the larger keys, then attach every pair.\n\nBrute inserts every permutation and keeps unique shapes. Optimal is divide-and-conquer on [lo, hi]. More optimal memos each [lo, hi] so shared ranges are built once.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n · n!)",
          space: "O(n · n!)",
          why: "Generate every permutation of 1..n, insert into a BST, serialize the shape, keep one copy per unique serialization. Correct but factorial.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function generateTrees(n) {
  function insert(node, val) {
    if (!node) return new TreeNode(val);
    if (val < node.val) node.left = insert(node.left, val);
    else node.right = insert(node.right, val);
    return node;
  }
  function clone(node) {
    if (!node) return null;
    const c = new TreeNode(node.val);
    c.left = clone(node.left);
    c.right = clone(node.right);
    return c;
  }
  function serial(node) {
    if (!node) return "#";
    return node.val + "," + serial(node.left) + "," + serial(node.right);
  }
  const nums = [];
  for (let i = 1; i <= n; i++) nums.push(i);
  const seen = {};
  const out = [];
  function perm(i) {
    if (i === nums.length) {
      let root = null;
      for (let k = 0; k < nums.length; k++) root = insert(root, nums[k]);
      const s = serial(root);
      if (!seen[s]) { seen[s] = true; out.push(clone(root)); }
      return;
    }
    for (let j = i; j < nums.length; j++) {
      const tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp;
      perm(i + 1);
      const tmp2 = nums[i]; nums[i] = nums[j]; nums[j] = tmp2;
    }
  }
  perm(0);
  return out;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function generateTrees(n) {
  function insert(node, val) {
    if (!node) return new TreeNode(val);
    if (val < node.val) node.left = insert(node.left, val);
    else node.right = insert(node.right, val);
    return node;
  }
  function clone(node) {
    if (!node) return null;
    const c = new TreeNode(node.val);
    c.left = clone(node.left);
    c.right = clone(node.right);
    return c;
  }
  function serial(node) {
    if (!node) return "#";
    return node.val + "," + serial(node.left) + "," + serial(node.right);
  }
  const nums = [];
  for (let i = 1; i <= n; i++) nums.push(i);
  const seen = {};
  const out = [];
  function perm(i) {
    if (i === nums.length) {
      let root = null;
      for (let k = 0; k < nums.length; k++) root = insert(root, nums[k]);
      const s = serial(root);
      if (!seen[s]) { seen[s] = true; out.push(clone(root)); }
      return;
    }
    for (let j = i; j < nums.length; j++) {
      const tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp;
      perm(i + 1);
      const tmp2 = nums[i]; nums[i] = nums[j]; nums[j] = tmp2;
    }
  }
  perm(0);
  return out;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def generate_trees(n):
    def insert(node, val):
        if node is None:
            return TreeNode(val)
        if val < node.val:
            node.left = insert(node.left, val)
        else:
            node.right = insert(node.right, val)
        return node
    def clone(node):
        if node is None:
            return None
        c = TreeNode(node.val)
        c.left = clone(node.left)
        c.right = clone(node.right)
        return c
    def serial(node):
        if node is None:
            return "#"
        return str(node.val) + "," + serial(node.left) + "," + serial(node.right)
    nums = list(range(1, n + 1))
    seen = {}
    out = []
    def perm(i):
        if i == len(nums):
            root = None
            for v in nums:
                root = insert(root, v)
            s = serial(root)
            if s not in seen:
                seen[s] = True
                out.append(clone(root))
            return
        for j in range(i, len(nums)):
            nums[i], nums[j] = nums[j], nums[i]
            perm(i + 1)
            nums[i], nums[j] = nums[j], nums[i]
    perm(0)
    return out`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public List<TreeNode> generateTrees(int n) {
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = i + 1;
        Set<String> seen = new HashSet<String>();
        List<TreeNode> out = new ArrayList<TreeNode>();
        perm(nums, 0, seen, out);
        return out;
    }
    void perm(int[] nums, int i, Set<String> seen, List<TreeNode> out) {
        if (i == nums.length) {
            TreeNode root = null;
            for (int v : nums) root = insert(root, v);
            String s = serial(root);
            if (seen.add(s)) out.add(clone(root));
            return;
        }
        for (int j = i; j < nums.length; j++) {
            int tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp;
            perm(nums, i + 1, seen, out);
            tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp;
        }
    }
    TreeNode insert(TreeNode node, int val) {
        if (node == null) return new TreeNode(val);
        if (val < node.val) node.left = insert(node.left, val);
        else node.right = insert(node.right, val);
        return node;
    }
    TreeNode clone(TreeNode node) {
        if (node == null) return null;
        return new TreeNode(node.val, clone(node.left), clone(node.right));
    }
    String serial(TreeNode node) {
        if (node == null) return "#";
        return node.val + "," + serial(node.left) + "," + serial(node.right);
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* insertVal(TreeNode* node, int val) {
    if (!node) return new TreeNode(val);
    if (val < node->val) node->left = insertVal(node->left, val);
    else node->right = insertVal(node->right, val);
    return node;
}
TreeNode* cloneT(TreeNode* node) {
    if (!node) return nullptr;
    return new TreeNode(node->val, cloneT(node->left), cloneT(node->right));
}
string serial(TreeNode* node) {
    if (!node) return "#";
    return to_string(node->val) + "," + serial(node->left) + "," + serial(node->right);
}
void permGen(vector<int>& nums, int i, unordered_set<string>& seen, vector<TreeNode*>& out) {
    if (i == (int)nums.size()) {
        TreeNode* root = nullptr;
        for (int v : nums) root = insertVal(root, v);
        string s = serial(root);
        if (!seen.count(s)) { seen.insert(s); out.push_back(cloneT(root)); }
        return;
    }
    for (int j = i; j < (int)nums.size(); j++) {
        swap(nums[i], nums[j]);
        permGen(nums, i + 1, seen, out);
        swap(nums[i], nums[j]);
    }
}
vector<TreeNode*> generateTrees(int n) {
    vector<int> nums(n);
    iota(nums.begin(), nums.end(), 1);
    unordered_set<string> seen;
    vector<TreeNode*> out;
    permGen(nums, 0, seen, out);
    return out;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* insertVal(struct Node* node, int val) {
    if (!node) return newNode(val);
    if (val < node->val) node->left = insertVal(node->left, val);
    else node->right = insertVal(node->right, val);
    return node;
}
struct Node* cloneT(struct Node* node) {
    if (!node) return NULL;
    struct Node* c = newNode(node->val);
    c->left = cloneT(node->left);
    c->right = cloneT(node->right);
    return c;
}
void serialBuf(struct Node* node, char* b, int* p) {
    if (!node) { b[(*p)++] = '#'; b[(*p)++] = ','; return; }
    *p += sprintf(b + *p, "%d,", node->val);
    serialBuf(node->left, b, p);
    serialBuf(node->right, b, p);
}
void permGen(int* nums, int n, int i, char seen[][256], int* sn, struct Node** out, int* on) {
    int j, t, k, pos;
    char buf[256];
    if (i == n) {
        struct Node* root = NULL;
        for (k = 0; k < n; k++) root = insertVal(root, nums[k]);
        pos = 0;
        serialBuf(root, buf, &pos);
        buf[pos] = 0;
        for (k = 0; k < *sn; k++) if (strcmp(seen[k], buf) == 0) return;
        strcpy(seen[(*sn)++], buf);
        out[(*on)++] = cloneT(root);
        return;
    }
    for (j = i; j < n; j++) {
        t = nums[i]; nums[i] = nums[j]; nums[j] = t;
        permGen(nums, n, i + 1, seen, sn, out, on);
        t = nums[i]; nums[i] = nums[j]; nums[j] = t;
    }
}
struct Node** generateTrees(int n, int* returnSize) {
    int nums[12], i, sn = 0, on = 0;
    char seen[4000][256];
    static struct Node* out[4000];
    for (i = 0; i < n; i++) nums[i] = i + 1;
    permGen(nums, n, 0, seen, &sn, out, &on);
    *returnSize = on;
    return out;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(C(n) · n)",
          space: "O(C(n) · n)",
          why: "For each root i in [lo, hi], cartesian product of left trees and right trees. Empty range yields a single null tree so a missing child is represented once.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function generateTrees(n) {
  function build(lo, hi) {
    if (lo > hi) return [null];
    const out = [];
    for (let i = lo; i <= hi; i++) {
      const lefts = build(lo, i - 1);
      const rights = build(i + 1, hi);
      for (let L = 0; L < lefts.length; L++) {
        for (let R = 0; R < rights.length; R++) {
          const node = new TreeNode(i);
          node.left = lefts[L];
          node.right = rights[R];
          out.push(node);
        }
      }
    }
    return out;
  }
  if (n === 0) return [];
  return build(1, n);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function generateTrees(n) {
  function build(lo, hi) {
    if (lo > hi) return [null];
    const out = [];
    for (let i = lo; i <= hi; i++) {
      const lefts = build(lo, i - 1);
      const rights = build(i + 1, hi);
      for (let L = 0; L < lefts.length; L++) {
        for (let R = 0; R < rights.length; R++) {
          const node = new TreeNode(i);
          node.left = lefts[L];
          node.right = rights[R];
          out.push(node);
        }
      }
    }
    return out;
  }
  if (n === 0) return [];
  return build(1, n);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def generate_trees(n):
    def build(lo, hi):
        if lo > hi:
            return [None]
        out = []
        for i in range(lo, hi + 1):
            lefts = build(lo, i - 1)
            rights = build(i + 1, hi)
            for left in lefts:
                for right in rights:
                    node = TreeNode(i)
                    node.left = left
                    node.right = right
                    out.append(node)
        return out
    if n == 0:
        return []
    return build(1, n)`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public List<TreeNode> generateTrees(int n) {
        if (n == 0) return new ArrayList<TreeNode>();
        return build(1, n);
    }
    List<TreeNode> build(int lo, int hi) {
        List<TreeNode> out = new ArrayList<TreeNode>();
        if (lo > hi) { out.add(null); return out; }
        for (int i = lo; i <= hi; i++) {
            for (TreeNode left : build(lo, i - 1)) {
                for (TreeNode right : build(i + 1, hi)) {
                    TreeNode node = new TreeNode(i);
                    node.left = left;
                    node.right = right;
                    out.add(node);
                }
            }
        }
        return out;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

vector<TreeNode*> build(int lo, int hi) {
    vector<TreeNode*> out;
    if (lo > hi) { out.push_back(nullptr); return out; }
    for (int i = lo; i <= hi; i++) {
        auto lefts = build(lo, i - 1);
        auto rights = build(i + 1, hi);
        for (auto* L : lefts) for (auto* R : rights) {
            TreeNode* node = new TreeNode(i);
            node->left = L;
            node->right = R;
            out.push_back(node);
        }
    }
    return out;
}
vector<TreeNode*> generateTrees(int n) {
    if (!n) return {};
    return build(1, n);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

int buildTrees(int lo, int hi, struct Node** out) {
    int i, L, R, ln, rn, n = 0;
    struct Node* lefts[400], *rights[400];
    if (lo > hi) { out[n++] = NULL; return n; }
    for (i = lo; i <= hi; i++) {
        ln = buildTrees(lo, i - 1, lefts);
        rn = buildTrees(i + 1, hi, rights);
        for (L = 0; L < ln; L++) for (R = 0; R < rn; R++) {
            struct Node* node = newNode(i);
            node->left = lefts[L];
            node->right = rights[R];
            out[n++] = node;
        }
    }
    return n;
}
struct Node** generateTrees(int n, int* returnSize) {
    static struct Node* out[4000];
    if (!n) { *returnSize = 0; return out; }
    *returnSize = buildTrees(1, n, out);
    return out;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(C(n) · n)",
          space: "O(C(n) · n)",
          why: "Memoize [lo, hi]. Shared ranges (for example all trees on 3,4,5) are built once. Catalan many trees still must be allocated.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function generateTrees(n) {
  const memo = {};
  function build(lo, hi) {
    const key = lo + "," + hi;
    if (memo[key]) return memo[key];
    if (lo > hi) return (memo[key] = [null]);
    const out = [];
    for (let i = lo; i <= hi; i++) {
      const lefts = build(lo, i - 1);
      const rights = build(i + 1, hi);
      for (let L = 0; L < lefts.length; L++) {
        for (let R = 0; R < rights.length; R++) {
          const node = new TreeNode(i);
          node.left = lefts[L];
          node.right = rights[R];
          out.push(node);
        }
      }
    }
    return (memo[key] = out);
  }
  if (n === 0) return [];
  return build(1, n);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function generateTrees(n) {
  const memo = {};
  function build(lo, hi) {
    const key = lo + "," + hi;
    if (memo[key]) return memo[key];
    if (lo > hi) return (memo[key] = [null]);
    const out = [];
    for (let i = lo; i <= hi; i++) {
      const lefts = build(lo, i - 1);
      const rights = build(i + 1, hi);
      for (let L = 0; L < lefts.length; L++) {
        for (let R = 0; R < rights.length; R++) {
          const node = new TreeNode(i);
          node.left = lefts[L];
          node.right = rights[R];
          out.push(node);
        }
      }
    }
    return (memo[key] = out);
  }
  if (n === 0) return [];
  return build(1, n);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def generate_trees(n):
    memo = {}
    def build(lo, hi):
        key = (lo, hi)
        if key in memo:
            return memo[key]
        if lo > hi:
            memo[key] = [None]
            return memo[key]
        out = []
        for i in range(lo, hi + 1):
            for left in build(lo, i - 1):
                for right in build(i + 1, hi):
                    node = TreeNode(i)
                    node.left = left
                    node.right = right
                    out.append(node)
        memo[key] = out
        return out
    if n == 0:
        return []
    return build(1, n)`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    Map<String, List<TreeNode>> memo = new HashMap<String, List<TreeNode>>();
    public List<TreeNode> generateTrees(int n) {
        if (n == 0) return new ArrayList<TreeNode>();
        return build(1, n);
    }
    List<TreeNode> build(int lo, int hi) {
        String key = lo + "," + hi;
        if (memo.containsKey(key)) return memo.get(key);
        List<TreeNode> out = new ArrayList<TreeNode>();
        if (lo > hi) { out.add(null); memo.put(key, out); return out; }
        for (int i = lo; i <= hi; i++) {
            for (TreeNode left : build(lo, i - 1)) {
                for (TreeNode right : build(i + 1, hi)) {
                    TreeNode node = new TreeNode(i);
                    node.left = left;
                    node.right = right;
                    out.add(node);
                }
            }
        }
        memo.put(key, out);
        return out;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

map<pair<int,int>, vector<TreeNode*>> memo;
vector<TreeNode*> build(int lo, int hi) {
    auto key = make_pair(lo, hi);
    if (memo.count(key)) return memo[key];
    vector<TreeNode*> out;
    if (lo > hi) { out.push_back(nullptr); return memo[key] = out; }
    for (int i = lo; i <= hi; i++) {
        auto lefts = build(lo, i - 1);
        auto rights = build(i + 1, hi);
        for (auto* L : lefts) for (auto* R : rights) {
            TreeNode* node = new TreeNode(i);
            node->left = L; node->right = R;
            out.push_back(node);
        }
    }
    return memo[key] = out;
}
vector<TreeNode*> generateTrees(int n) {
    memo.clear();
    if (!n) return {};
    return build(1, n);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Memo { int lo, hi, n; struct Node* trees[400]; };
struct Memo memos[80];
int memon;
int lookup(int lo, int hi) {
    int i;
    for (i = 0; i < memon; i++) if (memos[i].lo == lo && memos[i].hi == hi) return i;
    return -1;
}
int buildMemo(int lo, int hi, struct Node** out) {
    int id = lookup(lo, hi), i, L, R, ln, rn, n = 0;
    struct Node* lefts[400], *rights[400];
    if (id >= 0) {
        for (i = 0; i < memos[id].n; i++) out[i] = memos[id].trees[i];
        return memos[id].n;
    }
    if (lo > hi) { out[n++] = NULL; }
    else {
        for (i = lo; i <= hi; i++) {
            ln = buildMemo(lo, i - 1, lefts);
            rn = buildMemo(i + 1, hi, rights);
            for (L = 0; L < ln; L++) for (R = 0; R < rn; R++) {
                struct Node* node = newNode(i);
                node->left = lefts[L];
                node->right = rights[R];
                out[n++] = node;
            }
        }
    }
    memos[memon].lo = lo; memos[memon].hi = hi; memos[memon].n = n;
    for (i = 0; i < n; i++) memos[memon].trees[i] = out[i];
    memon++;
    return n;
}
struct Node** generateTrees(int n, int* returnSize) {
    static struct Node* out[4000];
    memon = 0;
    if (!n) { *returnSize = 0; return out; }
    *returnSize = buildMemo(1, n, out);
    return out;
}`
          }
        }
      ]
    },
    {
      id: 14,
      level: "intermediate",
      q: "Kth Largest Element in BST",
      ask: "Amazon · Microsoft · Google · Uber",
      links: [{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/kth-largest-element-in-bst/1"},{"name":"GFG","url":"https://www.geeksforgeeks.org/kth-largest-element-in-bst-when-modification-to-bst-is-not-allowed/"}],
      a: "Return the k-th largest key in a BST (1-based). Inorder is sorted ascending, so reverse inorder (right, node, left) is sorted descending.\n\nBrute stores the full inorder list and indexes from the end. Optimal reverse-inorders and stops after k visits. More optimal is Morris reverse inorder so extra memory is O(1).\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Inorder dump, then return vals[n - k]. Extra array of every key.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function kthLargest(root, k) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function kthLargest(root, k) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def kth_largest(root, k):
    vals = []
    def go(node):
        if node is None:
            return
        go(node.left)
        vals.append(node.val)
        go(node.right)
    go(root)
    return vals[len(vals) - k]`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public int kthLargest(TreeNode root, int k) {
        List<Integer> vals = new ArrayList<Integer>();
        go(root, vals);
        return vals.get(vals.size() - k);
    }
    void go(TreeNode node, List<Integer> vals) {
        if (node == null) return;
        go(node.left, vals);
        vals.add(node.val);
        go(node.right, vals);
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

int kthLargest(TreeNode* root, int k) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

void inorderVals(struct Node* node, int* vals, int* n) {
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
          }
        },
        {
          name: "Optimal",
          time: "O(h + k)",
          space: "O(h)",
          why: "Reverse inorder. Decrement k at each visit. When k hits 0, that value is the answer. Stop walking.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function kthLargest(root, k) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function kthLargest(root, k) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def kth_largest(root, k):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    int kLeft, ans;
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

int kthLargest(TreeNode* root, int k) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

void kthGo(struct Node* node, int* k, int* ans) {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Morris reverse inorder: thread the successor (leftmost of the right, via left pointers of the right spine). Visit without a stack, stop at k.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function kthLargest(root, k) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function kthLargest(root, k) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def kth_largest(root, k):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public int kthLargest(TreeNode root, int k) {
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

int kthLargest(TreeNode* root, int k) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

int kthLargest(struct Node* root, int k) {
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
          }
        }
      ]
    },
    {
      id: 15,
      level: "beginner",
      q: "Two Sum IV - Input is a BST",
      ask: "Amazon · Google · Meta · Uber",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/two-sum-iv-input-is-a-bst/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/find-a-pair-with-given-sum-in-bst/"}],
      a: "Return true if two distinct nodes sum to k.\n\nOn any tree a hash set of seen values works: at each node ask whether k - val was already seen. On a BST you can also dump inorder (sorted) and two-pointer. Two BST iterators, one from the left and one from the right, do the same with O(h) extra memory.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(h)",
          why: "For each node, DFS the rest of the tree looking for k - val. Nested walks. No extra set.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function findTarget(root, k) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function findTarget(root, k) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def find_target(root, k):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    boolean exists(TreeNode node, TreeNode skip, int val) {
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

bool existsSkip(TreeNode* node, TreeNode* skip, int val) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

bool existsSkip(struct Node* node, struct Node* skip, int val) {
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
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Hash set of visited values. DFS: if k - val is in the set, done; else add val and continue. Works on any binary tree.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function findTarget(root, k) {
  const seen = new Set();
  function go(node) {
    if (!node) return false;
    if (seen.has(k - node.val)) return true;
    seen.add(node.val);
    return go(node.left) || go(node.right);
  }
  return go(root);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function findTarget(root, k) {
  const seen = new Set();
  function go(node) {
    if (!node) return false;
    if (seen.has(k - node.val)) return true;
    seen.add(node.val);
    return go(node.left) || go(node.right);
  }
  return go(root);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def find_target(root, k):
    seen = set()
    def go(node):
        if node is None:
            return False
        if (k - node.val) in seen:
            return True
        seen.add(node.val)
        return go(node.left) or go(node.right)
    return go(root)`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public boolean findTarget(TreeNode root, int k) {
        Set<Integer> seen = new HashSet<Integer>();
        return go(root, k, seen);
    }
    boolean go(TreeNode node, int k, Set<Integer> seen) {
        if (node == null) return false;
        if (seen.contains(k - node.val)) return true;
        seen.add(node.val);
        return go(node.left, k, seen) || go(node.right, k, seen);
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

bool findTarget(TreeNode* root, int k) {
    unordered_set<int> seen;
    function<bool(TreeNode*)> go = [&](TreeNode* node) {
        if (!node) return false;
        if (seen.count(k - node->val)) return true;
        seen.insert(node->val);
        return go(node->left) || go(node->right);
    };
    return go(root);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

bool goSeen(struct Node* node, int k, int* seen, int* n) {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Inorder array is sorted. Two pointers from both ends. Uses the BST. Space is still linear for the array; two iterators would drop it to O(h).",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function findTarget(root, k) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function findTarget(root, k) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def find_target(root, k):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public boolean findTarget(TreeNode root, int k) {
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

bool findTarget(TreeNode* root, int k) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

void inorderVals(struct Node* node, int* vals, int* n) {
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
          }
        }
      ]
    },
    {
      id: 16,
      level: "intermediate",
      q: "Lowest Common Ancestor of a BST",
      ask: "Amazon · Google · Meta · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/lowest-common-ancestor-in-a-bst/1"}],
      a: "p and q are nodes in a BST. Return their lowest common ancestor — the deepest node that has both in its subtree (a node can be an ancestor of itself).\n\nOn a general tree you search both sides. On a BST, if both keys are smaller, LCA is on the left; both larger, on the right; otherwise this node splits them and is the answer.\n\nBrute is the general-tree LCA. Optimal recurses with the BST rule. More optimal is a single while loop.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Treat it as a binary tree: recurse. If both sides return a node, this is LCA. If one side does, that node is LCA. Ignores ordering.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left ? left : right;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left ? left : right;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def lowest_common_ancestor(root, p, q):
    if root is None or root is p or root is q:
        return root
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    if left and right:
        return root
    return left if left else right`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;
        return left != null ? left : right;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);
    if (left && right) return root;
    return left ? left : right;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* lowestCommonAncestor(struct Node* root, struct Node* p, struct Node* q) {
    if (!root || root == p || root == q) return root;
    struct Node* left = lowestCommonAncestor(root->left, p, q);
    struct Node* right = lowestCommonAncestor(root->right, p, q);
    if (left && right) return root;
    return left ? left : right;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(h)",
          space: "O(h)",
          why: "If both values are less than root, recurse left. Both greater, recurse right. Else root is the split point.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function lowestCommonAncestor(root, p, q) {
  if (p.val < root.val && q.val < root.val) return lowestCommonAncestor(root.left, p, q);
  if (p.val > root.val && q.val > root.val) return lowestCommonAncestor(root.right, p, q);
  return root;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function lowestCommonAncestor(root, p, q) {
  if (p.val < root.val && q.val < root.val) return lowestCommonAncestor(root.left, p, q);
  if (p.val > root.val && q.val > root.val) return lowestCommonAncestor(root.right, p, q);
  return root;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def lowest_common_ancestor(root, p, q):
    if p.val < root.val and q.val < root.val:
        return lowest_common_ancestor(root.left, p, q)
    if p.val > root.val and q.val > root.val:
        return lowest_common_ancestor(root.right, p, q)
    return root`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (p.val < root.val && q.val < root.val) return lowestCommonAncestor(root.left, p, q);
        if (p.val > root.val && q.val > root.val) return lowestCommonAncestor(root.right, p, q);
        return root;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (p->val < root->val && q->val < root->val) return lowestCommonAncestor(root->left, p, q);
    if (p->val > root->val && q->val > root->val) return lowestCommonAncestor(root->right, p, q);
    return root;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* lowestCommonAncestor(struct Node* root, struct Node* p, struct Node* q) {
    if (p->val < root->val && q->val < root->val) return lowestCommonAncestor(root->left, p, q);
    if (p->val > root->val && q->val > root->val) return lowestCommonAncestor(root->right, p, q);
    return root;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(h)",
          space: "O(1)",
          why: "Same split rule in a loop. No recursion. Walk until p and q sit on different sides (or one equals the node).",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function lowestCommonAncestor(root, p, q) {
  let cur = root;
  while (cur) {
    if (p.val < cur.val && q.val < cur.val) cur = cur.left;
    else if (p.val > cur.val && q.val > cur.val) cur = cur.right;
    else return cur;
  }
  return null;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function lowestCommonAncestor(root, p, q) {
  let cur = root;
  while (cur) {
    if (p.val < cur.val && q.val < cur.val) cur = cur.left;
    else if (p.val > cur.val && q.val > cur.val) cur = cur.right;
    else return cur;
  }
  return null;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def lowest_common_ancestor(root, p, q):
    cur = root
    while cur:
        if p.val < cur.val and q.val < cur.val:
            cur = cur.left
        elif p.val > cur.val and q.val > cur.val:
            cur = cur.right
        else:
            return cur
    return None`,
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        TreeNode cur = root;
        while (cur != null) {
            if (p.val < cur.val && q.val < cur.val) cur = cur.left;
            else if (p.val > cur.val && q.val > cur.val) cur = cur.right;
            else return cur;
        }
        return null;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    TreeNode* cur = root;
    while (cur) {
        if (p->val < cur->val && q->val < cur->val) cur = cur->left;
        else if (p->val > cur->val && q->val > cur->val) cur = cur->right;
        else return cur;
    }
    return nullptr;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* lowestCommonAncestor(struct Node* root, struct Node* p, struct Node* q) {
    struct Node* cur = root;
    while (cur) {
        if (p->val < cur->val && q->val < cur->val) cur = cur->left;
        else if (p->val > cur->val && q->val > cur->val) cur = cur->right;
        else return cur;
    }
    return NULL;
}`
          }
        }
      ]
    },
    {
      id: 17,
      level: "intermediate",
      q: "Balance a Binary Search Tree",
      ask: "Amazon · Google · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/balance-a-binary-search-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/convert-normal-bst-into-balanced-bst/"}],
      a: "Return a height-balanced BST with the same keys. A tree is balanced if every node's two subtrees differ in height by at most 1.\n\nInorder dumps the keys in sorted order. Then build from the middle, same as sorted-array-to-BST.\n\nBrute inserts those keys one by one (can stay skewed if you pick poorly). Optimal rebuilds from mid. More optimal is Day-Stout-Warren: vine (right spine) then compress in place.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(n)",
          why: "Inorder keys, then insert in sorted order into a fresh BST. That rebuilds a stick. Shows why you must pick mids, not insert in order.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function balanceBST(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function balanceBST(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def balance_bst(root):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode balanceBST(TreeNode root) {
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* balanceBST(TreeNode* root) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

void inorderVals(struct Node* node, int* keys, int* n) {
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
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Inorder into an array, then mid-as-root rebuild. Height is log n. Extra array of keys (or of nodes if you reuse them).",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function balanceBST(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function balanceBST(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def balance_bst(root):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public TreeNode balanceBST(TreeNode root) {
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* balanceBST(TreeNode* root) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

void collectNodes(struct Node* node, struct Node** nodes, int* n) {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "DSW: rotate every left child to the right to make a vine (linked list of right pointers). Then repeatedly rotate the vine to fold it into a balanced tree. In-place, O(1) extra besides recursion-free loops.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function balanceBST(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function balanceBST(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def balance_bst(root):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    TreeNode dummy;
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

int vine(TreeNode* dummy) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

int vine(struct Node* dummy) {
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
          }
        }
      ]
    },
    {
      id: 18,
      level: "beginner",
      q: "Minimum Absolute Difference in BST",
      ask: "Amazon · Google · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/minimum-absolute-difference-in-bst/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/find-minimum-absolute-difference-between-any-two-elements-in-bst/"}],
      a: "Return the smallest |a - b| over any two distinct nodes. In a BST the closest values are neighbors in inorder, so you never need all pairs.\n\nBrute checks every pair. Optimal inorders and tracks the previous value. More optimal is Morris inorder so extra memory is O(1).\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(n)",
          why: "Dump all values, then compare every pair. Extra array and quadratic checks.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function getMinimumDifference(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function getMinimumDifference(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def get_minimum_difference(root):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public int getMinimumDifference(TreeNode root) {
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

int getMinimumDifference(TreeNode* root) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

void collectVals(struct Node* node, int* vals, int* n) {
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
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Inorder. Compare each node with the previous inorder value. The min of those adjacent gaps is the global min.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function getMinimumDifference(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function getMinimumDifference(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def get_minimum_difference(root):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    Integer prev;
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

int getMinimumDifference(TreeNode* root) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

void minDiffGo(struct Node* node, struct Node** prev, int* best) {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Morris inorder with a previous pointer. Same adjacent-gap logic, no stack.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function getMinimumDifference(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function getMinimumDifference(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def get_minimum_difference(root):
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
            java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public int getMinimumDifference(TreeNode root) {
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
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

int getMinimumDifference(TreeNode* root) {
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
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <limits.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

int getMinimumDifference(struct Node* root) {
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
          }
        }
      ]
    }
  ]
};
