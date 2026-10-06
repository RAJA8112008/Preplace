window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["dsa-tree"] = {
  kind: "dsa",
  notes: [
    {
      title: "What a binary tree is",
      body: "A binary tree is nodes connected by left and right child pointers. Each node holds a value. A missing child is null. The root is the only node with no parent in the picture you are given. Unlike a list, the shape can branch. The height is the longest root-to-leaf walk. Many interview problems are 'do this at every node, then combine left and right'."
    },
    {
      title: "TreeNode",
      body: "TreeNode has val, left, and right. new TreeNode(1) makes a leaf unless you attach children. You never get parent pointers on the LeetCode node, so LCA and flatten must rebuild parent info or use recursion that still has the parent on the stack. Always null-check before you read left or right."
    },
    {
      title: "DFS vs BFS",
      body: "Depth-first search goes down a branch (recursion or an explicit stack). Breadth-first search uses a queue and visits level by level. Inorder, preorder, and postorder are DFS orders. Level-order is BFS. Choose BFS when the answer is 'by row' or 'right side of each row'. Choose DFS when the answer is a path, a height, or a subtree property."
    },
    {
      title: "Traversals",
      body: "Inorder is left, node, right. On a BST that yields sorted values. Preorder is node, left, right — useful to serialize or copy shape. Postorder is left, right, node — useful when children must be finished first (delete, flatten, max path). Level-order groups nodes that share the same depth."
    },
    {
      title: "BST property",
      body: "In a binary search tree, every node in the left subtree is less than the node, and every node in the right subtree is greater (or non-smaller, depending on duplicates). Search, insert, and LCA on a BST can walk one path, O(h), not the whole tree. Validate BST needs a range, not only 'left < node < right' on the two children, because a deep left-right grandchild can still violate the root."
    },
    {
      title: "Height, depth, diameter",
      body: "Depth of a node is steps from the root. Height of a node is steps down to a leaf (conventions differ by 1; be consistent). Diameter is the longest path between any two nodes, measured in edges, and it may not pass through the root. Compute height in a postorder DFS and update a best path that uses left height + right height."
    },
    {
      title: "Recursion template",
      body: "Base: if node is null, return the empty answer (0 height, true balanced, empty list). Recurse left and right. Combine at this node. Return what the parent needs (a height, a boolean, a pair). A global or boxed value can track an answer that is not the same as the return (diameter, max path). Iterative DFS/BFS is the twin when the stack might be deep."
    },
    {
      title: "Null children",
      body: "Most bugs are missing null checks or treating a missing child as a node with val 0. Serialization must record nulls or you cannot rebuild shape. Same-tree and subtree compare structure, not only values. Complete-tree counting can skip whole subtrees when left-height equals right-height."
    },
    {
      title: "Paths and LCA",
      body: "A root-to-leaf path is one chain. Path sum checks whether any such chain adds to a target. Maximum path sum allows a 'v' shape: left gain + node + right gain, while the value returned upward can only continue one side. Lowest common ancestor is the deepest node that has both targets in its subtree. On a BST you compare values; on a general tree you recurse and see whether both sides found someone."
    },
    {
      title: "Interview habit",
      body: "Draw the tiny tree from the prompt. Say the traversal. State the null base. Mention extra arrays vs O(h) stack vs Morris O(1). For construct-from-traversals, show the preorder root and the inorder split. Then open the Brute, Optimal, and More optimal tabs."
    },
    {
      title: "Views of a tree",
      body: "A view is the nodes you would see standing on one side. Left view: first node of each depth (DFS with a depth mark, or BFS taking the first in the queue). Right view: last of each level. Top view: first node at each horizontal distance (hd), usually from a BFS so the shallower node wins. Bottom view: last node at each hd, so BFS overwrite works. Vertical order lists every node in an hd column, top-to-bottom, left-to-right within a row."
    },
    {
      title: "Zigzag and next pointers",
      body: "Zigzag (spiral) is level order that flips direction each row: left-to-right, then right-to-left. A deque, or a normal BFS plus reverse on odd rows, both work. Populating next-right pointers is level order where each node.right neighbor is node.next. On a perfect tree you can walk the next links themselves and use O(1) extra memory. Distance-K and 'time to infect' turn the tree into an undirected graph with parent pointers, then BFS from the start node."
    }
  ],
  examples: [
    {
      lang: "js",
      title: "1. Make a TreeNode",
      desc: "What this is\nA TreeNode is one box: a value and two child pointers.\nleft and right default to null, so a new node is a leaf until you attach children.\nThe root is just the node you start from.\n\nWhat the code is doing\nTreeNode stores val, left, and right.\nroot holds 1. left child holds 2. right child holds 3.\nThe shape is a small tree with three nodes.\n\nWatch out\nAssigning only left and forgetting right is fine; right stays null.\nLosing the root variable loses the whole tree.",
      code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);`,
      codes: {
        javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);`,
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)`,
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
    public TreeNode example() {
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
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

TreeNode* example() {
    TreeNode* root = new TreeNode(1);
    root->left = new TreeNode(2);
    root->right = new TreeNode(3);
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* example() {
    struct Node* root = newNode(1);
    root->left = newNode(2);
    root->right = newNode(3);
}`
      }
    },
    {
      lang: "js",
      title: "2. Inorder walk",
      desc: "What this is\nInorder visits left, then the node, then right.\nOn a BST the values come out sorted.\nRecursion matches the definition one-to-one.\n\nWhat the code is doing\nIf node is null, stop.\nWalk the left subtree, push this val, walk the right subtree.\nCalling inorder(root) fills out in that order.\n\nWatch out\nPushing before the left walk would be preorder, not inorder.\nAn empty tree should leave the array empty.",
      code: `function inorder(node, out) {
  if (!node) return;
  inorder(node.left, out);
  out.push(node.val);
  inorder(node.right, out);
}`,
      codes: {
        javascript: `function inorder(node, out) {
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
    if not node:
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
    public TreeNode inorder(TreeNode node, List<String> out) {
        if (node == null) {
            return;
        }
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

TreeNode* inorder(TreeNode* node, vector<string>& out) {
    if (!node) {
        return;
    }
    inorder(node->left, out);
    out.push_back(node->val);
    inorder(node->right, out);
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* inorder(struct Node* node, char** out, int* outn) {
    if (!node) {
        return;
    }
    inorder(node->left, out);
    out[outn++] = node->val;
    inorder(node->right, out);
}`
      }
    },
    {
      lang: "js",
      title: "3. Level-order queue",
      desc: "What this is\nBFS uses a queue. You process a node, then enqueue its children.\nNodes on the same level come out together if you note queue.length at the start of the round.\n\nWhat the code is doing\nqueue starts with the root.\nEach round, n is how many nodes are on this level.\nThose n nodes are shifted, their values stored, and their children pushed.\nlevels is an array of rows.\n\nWatch out\nSkip pushing null children or you enqueue holes forever.\nUsing pop instead of shift turns the queue into a stack (DFS).",
      code: `function levelOrder(root) {
  if (!root) return [];
  const levels = [];
  const queue = [root];
  while (queue.length) {
    const n = queue.length;
    const row = [];
    for (let i = 0; i < n; i++) {
      const node = queue.shift();
      row.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    levels.push(row);
  }
  return levels;
}`,
      codes: {
        javascript: `function levelOrder(root) {
  if (!root) return [];
  const levels = [];
  const queue = [root];
  while (queue.length) {
    const n = queue.length;
    const row = [];
    for (let i = 0; i < n; i++) {
      const node = queue.shift();
      row.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    levels.push(row);
  }
  return levels;
}`,
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def levelOrder(root):
    if not root:
        return []
    levels = []
    queue = [root]
    while len(queue):
        n = len(queue)
        row = []
        for i in range(n):
            node = queue.pop(0)
            row.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        levels.append(row)
    return levels`,
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
    public List<List<Integer>> levelOrder(TreeNode root) {
        if (root == null) {
            return new ArrayList<>();
        }
        List<List<Integer>> levels = new ArrayList<>();
        List<TreeNode> queue = new ArrayList<>(); queue.add(root);
        while (!queue.isEmpty()) {
            int n = queue.size();
            List<Integer> row = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                TreeNode node = queue.remove(0);
                row.add(node.val);
                if (node.left != null) {
                    queue.add(node.left);
                }
                if (node.right != null) {
                    queue.add(node.right);
                }
            }
            levels.add(row);
        }
        return levels;
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

vector<vector<int>> levelOrder(TreeNode* root) {
    if (!root) {
        return {};
    }
    vector<vector<int>> levels;
    vector<TreeNode*> queue = {root};
    while (queue.size()) {
        int n = queue.size();
        vector<int> row;
        for (int i = 0; i < n; i++) {
            TreeNode* node = queue.front() /* erase begin */;
            row.push_back(node->val);
            if (node->left) {
                queue.push_back(node->left);
            }
            if (node->right) {
                queue.push_back(node->right);
            }
        }
        levels.push_back(row);
    }
    return levels;
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int** levelOrder(struct Node* root) {
    if (!root) {
        return NULL; /* empty */
    }
    int levels[512][512]; int levelsn = 0; int levelssz[512];
    struct Node* queue[10005]; int queueh = 0, queuet = 0; queue[queuet++] = root;
    while (queuen) {
        int n = queuen;
        int row[10005]; int rown = 0;
        for (int i = 0; i < n; i++) {
            struct Node* node = queue[queueh++];
            row[rown++] = node->val;
            if (node->left) {
                queue[queuet++] = node->left;
            }
            if (node->right) {
                queue[queuet++] = node->right;
            }
        }
        levels[levelsn++] = row;
    }
    return levels;
}`
      }
    },
    {
      lang: "js",
      title: "4. Height of a tree",
      desc: "What this is\nHeight here is the number of nodes on the longest root-to-leaf path.\nAn empty tree has height 0. A single node has height 1.\nThe formula is 1 + max(left height, right height).\n\nWhat the code is doing\nNull returns 0.\nOtherwise both children are measured and the larger one is kept.\nPlus one counts this node.\n\nWatch out\nSome problems count edges, not nodes, so a leaf would be 0. Match the problem.\nCalling height on every node from scratch can turn O(n) into O(n²).",
      code: `function height(node) {
  if (!node) return 0;
  const lh = height(node.left);
  const rh = height(node.right);
  return 1 + Math.max(lh, rh);
}`,
      codes: {
        javascript: `function height(node) {
  if (!node) return 0;
  const lh = height(node.left);
  const rh = height(node.right);
  return 1 + Math.max(lh, rh);
}`,
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def height(node):
    if not node:
        return 0
    lh = height(node.left)
    rh = height(node.right)
    return 1 + max(lh, rh)`,
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
    public int height(TreeNode node) {
        if (node == null) {
            return 0;
        }
        TreeNode lh = height(node.left);
        TreeNode rh = height(node.right);
        return 1 + Math.max(lh, rh);
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

int height(TreeNode* node) {
    if (!node) {
        return 0;
    }
    TreeNode* lh = height(node->left);
    TreeNode* rh = height(node->right);
    return 1 + std::max(lh, rh);
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int height(struct Node* node) {
    if (!node) {
        return 0;
    }
    struct Node* lh = height(node->left);
    struct Node* rh = height(node->right);
    return 1 + MAX(lh, rh);
}`
      }
    },
    {
      lang: "js",
      title: "5. Swap children (invert)",
      desc: "What this is\nInverting a tree swaps left and right at every node.\nThe mirror of a left-heavy tree is right-heavy.\nA queue or recursion both work; the swap is local.\n\nWhat the code is doing\nIf node is null, stop.\nleft and right are swapped with a temp name.\nThen both children are inverted the same way.\n\nWatch out\nSwap before or after recurse; both work if you swap this node once.\nDo not recurse into the same child twice after a botched swap.",
      code: `function invert(node) {
  if (!node) return;
  const tmp = node.left;
  node.left = node.right;
  node.right = tmp;
  invert(node.left);
  invert(node.right);
}`,
      codes: {
        javascript: `function invert(node) {
  if (!node) return;
  const tmp = node.left;
  node.left = node.right;
  node.right = tmp;
  invert(node.left);
  invert(node.right);
}`,
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def invert(node):
    if not node:
        return
    tmp = node.left
    node.left = node.right
    node.right = tmp
    invert(node.left)
    invert(node.right)`,
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
    public void invert(TreeNode node) {
        if (node == null) {
            return;
        }
        TreeNode tmp = node.left;
        node.left = node.right;
        node.right = tmp;
        invert(node.left);
        invert(node.right);
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

void invert(TreeNode* node) {
    if (!node) {
        return;
    }
    TreeNode* tmp = node->left;
    node->left = node->right;
    node->right = tmp;
    invert(node->left);
    invert(node->right);
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

void invert(struct Node* node) {
    if (!node) {
        return;
    }
    struct Node* tmp = node->left;
    node->left = node->right;
    node->right = tmp;
    invert(node->left);
    invert(node->right);
}`
      }
    },
    {
      lang: "js",
      title: "6. Search a BST",
      desc: "What this is\nIn a BST, go left when the target is smaller and right when it is larger.\nYou follow one path, not the whole tree.\nEqual val means you found it.\n\nWhat the code is doing\nLoop while node exists.\nIf node.val equals target, return node.\nIf target is smaller, move left; else move right.\nNull means the value is missing.\n\nWatch out\nThis is wrong on a general binary tree that is not a BST.\nDuplicates: decide whether equal values live on the left or right and stay consistent.",
      code: `function bstSearch(root, target) {
  let node = root;
  while (node) {
    if (node.val === target) return node;
    node = target < node.val ? node.left : node.right;
  }
  return null;
}`,
      codes: {
        javascript: `function bstSearch(root, target) {
  let node = root;
  while (node) {
    if (node.val === target) return node;
    node = target < node.val ? node.left : node.right;
  }
  return null;
}`,
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def bstSearch(root, target):
    node = root
    while node:
        if node.val == target:
            return node
        node = (node.left if target < node.val else node.right)
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
    public TreeNode bstSearch(TreeNode root, int target) {
        TreeNode node = root;
        while (node != null) {
            if (node.val == target) {
                return node;
            }
            node = target < node.val ? node.left : node.right;
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

TreeNode* bstSearch(TreeNode* root, int target) {
    TreeNode* node = root;
    while (node) {
        if (node->val == target) {
            return node;
        }
        node = target < node->val ? node->left : node->right;
    }
    return nullptr;
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* bstSearch(struct Node* root, int target) {
    struct Node* node = root;
    while (node) {
        if (node->val == target) {
            return node;
        }
        node = target < node->val ? node->left : node->right;
    }
    return NULL;
}`
      }
    },
    {
      lang: "js",
      title: "7. DFS with a stack",
      desc: "What this is\nAn explicit stack replaces recursion.\nPush a node, pop it, process it, push children.\nPush right then left if you want left processed first.\n\nWhat the code is doing\nstack starts with root if it exists.\nEach pop prints the value (preorder-style).\nRight is pushed before left so left comes off first.\n\nWatch out\nEmpty stack ends the walk.\nForgetting to skip null roots will throw on stack = [root] when root is null if you are not careful — here we guard.",
      code: `function dfsPreorder(root) {
  if (!root) return;
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    console.log(node.val);
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
}`,
      codes: {
        javascript: `function dfsPreorder(root) {
  if (!root) return;
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    console.log(node.val);
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
}`,
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def dfsPreorder(root):
    if not root:
        return
    stack = [root]
    while len(stack):
        node = stack.pop()
        print(node.val)
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)`,
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
    public TreeNode dfsPreorder(TreeNode root) {
        if (root == null) {
            return;
        }
        List<TreeNode> stack = new ArrayList<>(); stack.add(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.remove(stack.size()-1);
            System.out.println(node.val);
            if (node.right != null) {
                stack.add(node.right);
            }
            if (node.left != null) {
                stack.add(node.left);
            }
        }
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

TreeNode* dfsPreorder(TreeNode* root) {
    if (!root) {
        return;
    }
    vector<TreeNode*> stack = {root};
    while (stack.size()) {
        TreeNode* node = stack.back() /* then pop_back */;
        cout << node->val << "\\n";
        if (node->right) {
            stack.push_back(node->right);
        }
        if (node->left) {
            stack.push_back(node->left);
        }
    }
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* dfsPreorder(struct Node* root) {
    if (!root) {
        return;
    }
    struct Node* stack[10005]; int stackn = 0; stack[stackn++] = root;
    while (stackn) {
        struct Node* node = stack[--stackn];
        printf("%d\\n", node->val);
        if (node->right) {
            stack[stackn++] = node->right;
        }
        if (node->left) {
            stack[stackn++] = node->left;
        }
    }
}`
      }
    },
    {
      lang: "js",
      title: "8. Null means no child",
      desc: "What this is\nSerialization must remember missing children or the shape is lost.\nA common trick is to write the letter N for null.\nPreorder with nulls can rebuild the exact tree.\n\nWhat the code is doing\nIf node is null, push N and return.\nOtherwise push the value, then encode left, then right.\nThe array is a full preorder picture.\n\nWatch out\nWithout null marks, [1,2,3] could be several shapes.\nJoin with commas if values can be multi-digit.",
      code: `function encode(node, out) {
  if (!node) {
    out.push("N");
    return;
  }
  out.push(String(node.val));
  encode(node.left, out);
  encode(node.right, out);
}`,
      codes: {
        javascript: `function encode(node, out) {
  if (!node) {
    out.push("N");
    return;
  }
  out.push(String(node.val));
  encode(node.left, out);
  encode(node.right, out);
}`,
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def encode(node, out):
    if not node:
        out.append("N")
        return
    out.append(str(node.val))
    encode(node.left, out)
    encode(node.right, out)`,
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
    public void encode(TreeNode node, List<String> out) {
        if (node == null) {
            out.add("N");
            return;
        }
        out.add(String.valueOf(node.val));
        encode(node.left, out);
        encode(node.right, out);
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

void encode(TreeNode* node, vector<string>& out) {
    if (!node) {
        out.push_back("N");
        return;
    }
    out.push_back(to_string(node->val));
    encode(node->left, out);
    encode(node->right, out);
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

void encode(struct Node* node, char** out, int* outn) {
    if (!node) {
        out[outn++] = "N";
        return;
    }
    out[outn++] = /*str*/(node->val);
    encode(node->left, out);
    encode(node->right, out);
}`
      }
    },
    {
      lang: "js",
      title: "9. Path from the root",
      desc: "What this is\nA root-to-leaf path is the chain you are on while DFS goes down.\nPush the node when you enter, pop when you leave, so the array is the current path.\nAt a leaf you can copy the path into an answer list.\n\nWhat the code is doing\nIf node is null, stop.\nval is pushed. If both children are missing, the path is copied to paths.\nThen left and right are explored, and val is popped.\n\nWatch out\nForgetting to pop pollutes the next branch.\nCopy the array at the leaf; do not store the same mutable path object.",
      code: `function allPaths(node, path, paths) {
  if (!node) return;
  path.push(node.val);
  if (!node.left && !node.right) paths.push(path.slice());
  allPaths(node.left, path, paths);
  allPaths(node.right, path, paths);
  path.pop();
}`,
      codes: {
        javascript: `function allPaths(node, path, paths) {
  if (!node) return;
  path.push(node.val);
  if (!node.left && !node.right) paths.push(path.slice());
  allPaths(node.left, path, paths);
  allPaths(node.right, path, paths);
  path.pop();
}`,
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def allPaths(node, path, paths):
    if not node:
        return
    path.append(node.val)
    if not node.left  and  not node.right:
        paths.append(path[:])
    allPaths(node.left, path, paths)
    allPaths(node.right, path, paths)
    path.pop()`,
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
    public TreeNode allPaths(TreeNode node, List<Integer> path, List<List<Integer>> paths) {
        if (node == null) {
            return;
        }
        path.add(node.val);
        if (node.left == null && node.right == null) {
            paths.add(new ArrayList<>(path));
        }
        allPaths(node.left, path, paths);
        allPaths(node.right, path, paths);
        path.remove(path.size()-1);
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

TreeNode* allPaths(TreeNode* node, vector<int>& path, vector<vector<int>>& paths) {
    if (!node) {
        return;
    }
    path.push_back(node->val);
    if (!node->left && !node->right) {
        paths.push_back(path);
    }
    allPaths(node->left, path, paths);
    allPaths(node->right, path, paths);
    path.back() /* then pop_back */;
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* allPaths(struct Node* node, int* path, int* pathn, vector<vector<int>>& paths) {
    if (!node) {
        return;
    }
    path[pathn++] = node->val;
    if (!node->left && !node->right) {
        paths[pathsn++] = path;
    }
    allPaths(node->left, path, paths);
    allPaths(node->right, path, paths);
    path[--pathn];
}`
      }
    },
    {
      lang: "js",
      title: "10. Count all nodes",
      desc: "What this is\nThe size of a tree is 1 plus the size of the left plus the size of the right.\nEmpty tree is 0.\nA complete tree can count faster by comparing left and right heights.\n\nWhat the code is doing\nNull returns 0.\nOtherwise return 1 + count(left) + count(right).\nEvery node is visited once.\n\nWatch out\nThis is O(n). Complete-tree tricks can reach O(log² n).\nDo not confuse count with height.",
      code: `function count(node) {
  if (!node) return 0;
  return 1 + count(node.left) + count(node.right);
}`,
      codes: {
        javascript: `function count(node) {
  if (!node) return 0;
  return 1 + count(node.left) + count(node.right);
}`,
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def count(node):
    if not node:
        return 0
    return 1 + count(node.left) + count(node.right)`,
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
    public int count(TreeNode node) {
        if (node == null) {
            return 0;
        }
        return 1 + count(node.left) + count(node.right);
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

int count(TreeNode* node) {
    if (!node) {
        return 0;
    }
    return 1 + count(node->left) + count(node->right);
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int count(struct Node* node) {
    if (!node) {
        return 0;
    }
    return 1 + count(node->left) + count(node->right);
}`
      }
    },
    {
      lang: "js",
      title: "11. Vertical columns by horizontal distance",
      desc: "What this is\nGive the root hd 0. Left child is hd - 1, right child is hd + 1.\nNodes that share an hd sit in the same vertical column.\nBFS visits top to bottom so you can push into a map of columns.\n\nWhat the code is doing\nQueue stores [node, hd].\nA map (or an array shifted so hd can be negative) collects values per column.\nWalking columns from min hd to max hd is the vertical order.\n\nWatch out\nDFS without a row index can scramble top-to-bottom order in a column.\nLeetCode's 'vertical order traversal' also sorts by row, then by value.",
      code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function vertical(root) {
  if (!root) return [];
  const cols = {};
  let minH = 0;
  let maxH = 0;
  const q = [[root, 0]];
  while (q.length) {
    const pair = q.shift();
    const node = pair[0];
    const hd = pair[1];
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
      codes: {
        javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function vertical(root) {
  if (!root) return [];
  const cols = {};
  let minH = 0;
  let maxH = 0;
  const q = [[root, 0]];
  while (q.length) {
    const pair = q.shift();
    const node = pair[0];
    const hd = pair[1];
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
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
from collections import deque
def vertical(root):
    if root is None:
        return []
    cols = {}
    min_h = max_h = 0
    q = deque([(root, 0)])
    while q:
        node, hd = q.popleft()
        cols.setdefault(hd, []).append(node.val)
        min_h = min(min_h, hd)
        max_h = max(max_h, hd)
        if node.left:
            q.append((node.left, hd - 1))
        if node.right:
            q.append((node.right, hd + 1))
    return [cols[h] for h in range(min_h, max_h + 1)]`,
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
    public List<List<Integer>> vertical(TreeNode root) {
        List<List<Integer>> out = new ArrayList<List<Integer>>();
        if (root == null) return out;
        Map<Integer, List<Integer>> cols = new HashMap<Integer, List<Integer>>();
        int minH = 0, maxH = 0;
        Queue<TreeNode> nq = new ArrayDeque<TreeNode>();
        Queue<Integer> hq = new ArrayDeque<Integer>();
        nq.add(root); hq.add(0);
        while (!nq.isEmpty()) {
            TreeNode node = nq.poll();
            int hd = hq.poll();
            cols.computeIfAbsent(hd, k -> new ArrayList<Integer>()).add(node.val);
            minH = Math.min(minH, hd);
            maxH = Math.max(maxH, hd);
            if (node.left != null) { nq.add(node.left); hq.add(hd - 1); }
            if (node.right != null) { nq.add(node.right); hq.add(hd + 1); }
        }
        for (int h = minH; h <= maxH; h++) out.add(cols.get(h));
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

vector<vector<int>> vertical(TreeNode* root) {
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

/* cols[hd+offset], offset 4000 for negative hd */
int vertical(struct Node* root, int cols[][64], int* coln, int* minH, int* maxH) {
    struct Node* qn[10005];
    int qh[10005], qs = 0, qe = 0, hd, off = 4000;
    if (!root) return 0;
    *minH = 0; *maxH = 0;
    qn[qe] = root; qh[qe++] = 0;
    while (qs < qe) {
        struct Node* node = qn[qs];
        hd = qh[qs++];
        cols[hd + off][coln[hd + off]++] = node->val;
        if (hd < *minH) *minH = hd;
        if (hd > *maxH) *maxH = hd;
        if (node->left) { qn[qe] = node->left; qh[qe++] = hd - 1; }
        if (node->right) { qn[qe] = node->right; qh[qe++] = hd + 1; }
    }
    return 1;
}`
      }
    },
    {
      lang: "js",
      title: "12. Zigzag (spiral) level order",
      desc: "What this is\nSame as level order, but odd rows (0-based) print right to left.\nA deque lets you pop from the front or back and push on the opposite end.\nReversing a finished row is the simpler picture.\n\nWhat the code is doing\nBFS one level at a time into an array.\nIf the level index is odd, reverse that array before storing it.\nEmpty tree yields [].\n\nWatch out\nDo not reverse the queue itself or the next level comes out shuffled.\nGFG 'zigzag tree traversal' is this walk flattened into one list.",
      code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function zigzag(root) {
  if (!root) return [];
  const out = [];
  const q = [root];
  let leftToRight = true;
  while (q.length) {
    const n = q.length;
    const row = [];
    for (let i = 0; i < n; i++) {
      const node = q.shift();
      row.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    if (!leftToRight) row.reverse();
    out.push(row);
    leftToRight = !leftToRight;
  }
  return out;
}`,
      codes: {
        javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function zigzag(root) {
  if (!root) return [];
  const out = [];
  const q = [root];
  let leftToRight = true;
  while (q.length) {
    const n = q.length;
    const row = [];
    for (let i = 0; i < n; i++) {
      const node = q.shift();
      row.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    if (!leftToRight) row.reverse();
    out.push(row);
    leftToRight = !leftToRight;
  }
  return out;
}`,
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
from collections import deque
def zigzag(root):
    if root is None:
        return []
    out = []
    q = deque([root])
    left_to_right = True
    while q:
        row = []
        for _ in range(len(q)):
            node = q.popleft()
            row.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        if not left_to_right:
            row.reverse()
        out.append(row)
        left_to_right = not left_to_right
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
    public List<List<Integer>> zigzag(TreeNode root) {
        List<List<Integer>> out = new ArrayList<List<Integer>>();
        if (root == null) return out;
        Queue<TreeNode> q = new ArrayDeque<TreeNode>();
        q.add(root);
        boolean leftToRight = true;
        while (!q.isEmpty()) {
            int n = q.size();
            List<Integer> row = new ArrayList<Integer>();
            for (int i = 0; i < n; i++) {
                TreeNode node = q.poll();
                row.add(node.val);
                if (node.left != null) q.add(node.left);
                if (node.right != null) q.add(node.right);
            }
            if (!leftToRight) Collections.reverse(row);
            out.add(row);
            leftToRight = !leftToRight;
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

vector<vector<int>> zigzag(TreeNode* root) {
    vector<vector<int>> out;
    if (!root) return out;
    queue<TreeNode*> q;
    q.push(root);
    bool leftToRight = true;
    while (!q.empty()) {
        int n = (int)q.size();
        vector<int> row;
        for (int i = 0; i < n; i++) {
            TreeNode* node = q.front(); q.pop();
            row.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        if (!leftToRight) reverse(row.begin(), row.end());
        out.push_back(row);
        leftToRight = !leftToRight;
    }
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

int zigzag(struct Node* root, int rows[][256], int* rowLen, int* rowCount) {
    struct Node* q[10005];
    int qs = 0, qe = 0, leftToRight = 1;
    *rowCount = 0;
    if (!root) return 0;
    q[qe++] = root;
    while (qs < qe) {
        int n = qe - qs, i, r = (*rowCount)++;
        rowLen[r] = n;
        for (i = 0; i < n; i++) {
            struct Node* node = q[qs++];
            rows[r][i] = node->val;
            if (node->left) q[qe++] = node->left;
            if (node->right) q[qe++] = node->right;
        }
        if (!leftToRight) {
            for (i = 0; i < n / 2; i++) {
                int t = rows[r][i];
                rows[r][i] = rows[r][n - 1 - i];
                rows[r][n - 1 - i] = t;
            }
        }
        leftToRight = !leftToRight;
    }
    return 1;
}`
      }
    }
  ],
  questions: [
    {
      id: 1,
      level: "beginner",
      q: "Binary Tree Inorder Traversal",
      ask: "Amazon · Microsoft · Google · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/binary-tree-inorder-traversal/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/inorder-traversal/1"}],
      a: "Return the inorder list of node values: left subtree, then the node, then the right subtree.\n\nTree 1 with left 2 and right 3 yields [2, 1, 3]. An empty tree yields [].\n\nRecursion is the definition. An explicit stack simulates the same walk. Morris traversal threads a temporary link from the predecessor so you need no stack.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Recursive inorder: walk left, push this value, walk right. Matches the definition. Extra memory is the output array plus O(h) call stack.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function inorderTraversal(root) {
  const out = [];
  function go(node) {
    if (!node) return;
    go(node.left);
    out.push(node.val);
    go(node.right);
  }
  go(root);
  return out;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function inorderTraversal(root) {
  const out = [];
  function go(node) {
    if (!node) return;
    go(node.left);
    out.push(node.val);
    go(node.right);
  }
  go(root);
  return out;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def inorderTraversal(root):
    out = []
    def go(node):
        if not node:
            return
        go(node.left)
        out.append(node.val)
        go(node.right)
    go(root)
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
    private List<Integer> inorderTraversal_go(TreeNode node) {
        if (node == null) {
            return;
        }
        inorderTraversal_go(node.left);
        out.add(node.val);
        inorderTraversal_go(node.right);
    }

    public List<Integer> inorderTraversal(TreeNode root) {
        List<TreeNode> out = new ArrayList<>();
        inorderTraversal_go(root);
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

vector<int> inorderTraversal_go(TreeNode* node) {
    if (!node) {
        return;
    }
    inorderTraversal_go(node->left);
    out.push_back(node->val);
    inorderTraversal_go(node->right);
}

vector<int> inorderTraversal(TreeNode* root) {
    vector<TreeNode*> out;
    inorderTraversal_go(root);
    return out;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int* inorderTraversal_go(struct Node* node) {
    if (!node) {
        return;
    }
    inorderTraversal_go(node->left);
    out[outn++] = node->val;
    inorderTraversal_go(node->right);
}

int* inorderTraversal(struct Node* root) {
    struct Node* out[10005]; int outn = 0;
    inorderTraversal_go(root);
    return out;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Iterative stack: go left until null, pop, record val, go right. Same visit order as recursion without depending on engine stack limits as much; still O(h) extra.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function inorderTraversal(root) {
  const out = [];
  const stack = [];
  let cur = root;
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop();
    out.push(cur.val);
    cur = cur.right;
  }
  return out;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function inorderTraversal(root) {
  const out = [];
  const stack = [];
  let cur = root;
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop();
    out.push(cur.val);
    cur = cur.right;
  }
  return out;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def inorderTraversal(root):
    out = []
    stack = []
    cur = root
    while cur  or  len(stack):
        while cur:
            stack.append(cur)
            cur = cur.left
        cur = stack.pop()
        out.append(cur.val)
        cur = cur.right
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
    public List<Integer> inorderTraversal(TreeNode root) {
        List<TreeNode> out = new ArrayList<>();
        List<TreeNode> stack = new ArrayList<>();
        TreeNode cur = root;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) {
                stack.add(cur);
                cur = cur.left;
            }
            cur = stack.remove(stack.size()-1);
            out.add(cur.val);
            cur = cur.right;
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

vector<int> inorderTraversal(TreeNode* root) {
    vector<TreeNode*> out;
    vector<TreeNode*> stack;
    TreeNode* cur = root;
    while (cur || stack.size()) {
        while (cur) {
            stack.push_back(cur);
            cur = cur->left;
        }
        cur = stack.back() /* then pop_back */;
        out.push_back(cur->val);
        cur = cur->right;
    }
    return out;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int* inorderTraversal(struct Node* root) {
    struct Node* out[10005]; int outn = 0;
    struct Node* stack[10005]; int stackn = 0;
    struct Node* cur = root;
    while (cur || stackn) {
        while (cur) {
            stack[stackn++] = cur;
            cur = cur->left;
        }
        cur = stack[--stackn];
        out[outn++] = cur->val;
        cur = cur->right;
    }
    return out;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Morris: if there is no left, visit and go right. Else find the predecessor (rightmost in left). If pred.right is null, thread it to cur and go left. If it already points at cur, unthread, visit, go right. Auxiliary space O(1) besides the output list.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function inorderTraversal(root) {
  const out = [];
  let cur = root;
  while (cur) {
    if (!cur.left) {
      out.push(cur.val);
      cur = cur.right;
    } else {
      let pred = cur.left;
      while (pred.right && pred.right !== cur) pred = pred.right;
      if (!pred.right) {
        pred.right = cur;
        cur = cur.left;
      } else {
        pred.right = null;
        out.push(cur.val);
        cur = cur.right;
      }
    }
  }
  return out;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function inorderTraversal(root) {
  const out = [];
  let cur = root;
  while (cur) {
    if (!cur.left) {
      out.push(cur.val);
      cur = cur.right;
    } else {
      let pred = cur.left;
      while (pred.right && pred.right !== cur) pred = pred.right;
      if (!pred.right) {
        pred.right = cur;
        cur = cur.left;
      } else {
        pred.right = null;
        out.push(cur.val);
        cur = cur.right;
      }
    }
  }
  return out;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def inorderTraversal(root):
    out = []
    cur = root
    while cur:
        if not cur.left:
            out.append(cur.val)
            cur = cur.right
        else:
            pred = cur.left
            while pred.right  and  pred.right != cur:
                pred = pred.right
            if not pred.right:
                pred.right = cur
                cur = cur.left
            else:
                pred.right = None
                out.append(cur.val)
                cur = cur.right
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
    public List<Integer> inorderTraversal(TreeNode root) {
        List<TreeNode> out = new ArrayList<>();
        TreeNode cur = root;
        while (cur != null) {
            if (cur.left == null) {
                out.add(cur.val);
                cur = cur.right;
            }
            else {
                TreeNode pred = cur.left;
                while (pred.right != null && pred.right != cur) {
                    pred = pred.right;
                }
                if (pred.right == null) {
                    pred.right = cur;
                    cur = cur.left;
                }
                else {
                    pred.right = null;
                    out.add(cur.val);
                    cur = cur.right;
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

vector<int> inorderTraversal(TreeNode* root) {
    vector<TreeNode*> out;
    TreeNode* cur = root;
    while (cur) {
        if (!cur->left) {
            out.push_back(cur->val);
            cur = cur->right;
        }
        else {
            TreeNode* pred = cur->left;
            while (pred->right && pred->right != cur) {
                pred = pred->right;
            }
            if (!pred->right) {
                pred->right = cur;
                cur = cur->left;
            }
            else {
                pred->right = nullptr;
                out.push_back(cur->val);
                cur = cur->right;
            }
        }
    }
    return out;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int* inorderTraversal(struct Node* root) {
    struct Node* out[10005]; int outn = 0;
    struct Node* cur = root;
    while (cur) {
        if (!cur->left) {
            out[outn++] = cur->val;
            cur = cur->right;
        }
        else {
            struct Node* pred = cur->left;
            while (pred->right && pred->right != cur) {
                pred = pred->right;
            }
            if (!pred->right) {
                pred->right = cur;
                cur = cur->left;
            }
            else {
                pred->right = NULL;
                out[outn++] = cur->val;
                cur = cur->right;
            }
        }
    }
    return out;
}`
          }
        }
      ]
    },
    {
      id: 2,
      level: "beginner",
      q: "Binary Tree Level Order Traversal",
      ask: "Amazon · Microsoft · Meta · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/binary-tree-level-order-traversal/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/level-order-traversal/1"}],
      a: "Return values grouped by depth, left to right in each row.\n\nTree 3 with left 9 and right 20 (20 has 15 and 7) yields [[3],[9,20],[15,7]]. Empty tree yields [].\n\nDFS can drop values into buckets by depth. BFS with a queue is the natural level walk. Recording queue.length at the start of each round avoids storing depth on every node.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "DFS with a depth argument. Push val into levels[depth], creating the row if needed. Extra recursion stack plus the answer.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function levelOrder(root) {
  const levels = [];
  function dfs(node, d) {
    if (!node) return;
    if (!levels[d]) levels[d] = [];
    levels[d].push(node.val);
    dfs(node.left, d + 1);
    dfs(node.right, d + 1);
  }
  dfs(root, 0);
  return levels;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function levelOrder(root) {
  const levels = [];
  function dfs(node, d) {
    if (!node) return;
    if (!levels[d]) levels[d] = [];
    levels[d].push(node.val);
    dfs(node.left, d + 1);
    dfs(node.right, d + 1);
  }
  dfs(root, 0);
  return levels;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def levelOrder(root):
    levels = []
    def dfs(node, d):
        if not node:
            return
        if not levels[d]:
            levels[d] = []
        levels[d].push(node.val)
        dfs(node.left, d + 1)
        dfs(node.right, d + 1)
    dfs(root, 0)
    return levels`,
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
    private List<List<Integer>> levelOrder_dfs(TreeNode node, int d) {
        if (node == null) {
            return;
        }
        if (!levels[d]) {
            levels[d] = [];
        }
        levels[d].push(node.val);
        levelOrder_dfs(node.left, d + 1);
        levelOrder_dfs(node.right, d + 1);
    }

    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> levels = new ArrayList<>();
        levelOrder_dfs(root, 0);
        return levels;
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

vector<vector<int>> levelOrder_dfs(TreeNode* node, int d) {
    if (!node) {
        return;
    }
    if (!levels[d]) {
        levels[d] = [];
    }
    levels[d].push(node->val);
    levelOrder_dfs(node->left, d + 1);
    levelOrder_dfs(node->right, d + 1);
}

vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> levels;
    levelOrder_dfs(root, 0);
    return levels;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int** levelOrder_dfs(struct Node* node, int d) {
    if (!node) {
        return;
    }
    if (!levels[d]) {
        levels[d] = [];
    }
    levels[d].push(node->val);
    levelOrder_dfs(node->left, d + 1);
    levelOrder_dfs(node->right, d + 1);
}

int** levelOrder(struct Node* root) {
    int levels[512][512]; int levelsn = 0; int levelssz[512];
    levelOrder_dfs(root, 0);
    return levels;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "BFS queue. Each node is stored with its depth. Rows grow as depth increases. Extra pair objects on the queue.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function levelOrder(root) {
  if (!root) return [];
  const levels = [];
  const queue = [{ node: root, d: 0 }];
  while (queue.length) {
    const { node, d } = queue.shift();
    if (!levels[d]) levels[d] = [];
    levels[d].push(node.val);
    if (node.left) queue.push({ node: node.left, d: d + 1 });
    if (node.right) queue.push({ node: node.right, d: d + 1 });
  }
  return levels;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function levelOrder(root) {
  if (!root) return [];
  const levels = [];
  const queue = [{ node: root, d: 0 }];
  while (queue.length) {
    const { node, d } = queue.shift();
    if (!levels[d]) levels[d] = [];
    levels[d].push(node.val);
    if (node.left) queue.push({ node: node.left, d: d + 1 });
    if (node.right) queue.push({ node: node.right, d: d + 1 });
  }
  return levels;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def levelOrder(root):
    if not root:
        return []
    levels = []
    queue = [{ node: root, d: 0 }]
    while len(queue):
        node, d = queue.pop(0)["node"], queue.pop(0)["d"]
        if not levels[d]:
            levels[d] = []
        levels[d].push(node.val)
        if node.left:
            queue.append({ node: node.left, d: d + 1 })
        if node.right:
            queue.append({ node: node.right, d: d + 1 })
    return levels`,
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
    public List<List<Integer>> levelOrder(TreeNode root) {
        if (root == null) {
            return new ArrayList<>();
        }
        List<List<Integer>> levels = new ArrayList<>();
        List<Item> queue = new ArrayList<>(); queue.add(new Item([{ node: root, d: 0 }]));
        while (!queue.isEmpty()) {
            var __it = queue.remove(0); var node = __it.node; var d = __it.d;
            if (!levels[d]) {
                levels[d] = [];
            }
            levels[d].push(node.val);
            if (node.left != null) {
                queue.add({ node: node.left, d: d + 1 });
            }
            if (node.right != null) {
                queue.add({ node: node.right, d: d + 1 });
            }
        }
        return levels;
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

vector<vector<int>> levelOrder(TreeNode* root) {
    if (!root) {
        return {};
    }
    vector<vector<int>> levels;
    vector<pair<TreeNode*, int>> queue;
    while (queue.size()) {
        auto __it = queue.front() /* erase begin */; TreeNode* node = __it.first; int d = __it.second;
        if (!levels[d]) {
            levels[d] = [];
        }
        levels[d].push(node->val);
        if (node->left) {
            queue.push_back({ node: node->left, d: d + 1 });
        }
        if (node->right) {
            queue.push_back({ node: node->right, d: d + 1 });
        }
    }
    return levels;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int** levelOrder(struct Node* root) {
    if (!root) {
        return NULL; /* empty */
    }
    int levels[512][512]; int levelsn = 0; int levelssz[512];
    struct Node* queueN[10005]; int queueD[10005]; int queuen = 0;
    while (queuen) {
        /* unpack node,d */
        if (!levels[d]) {
            levels[d] = [];
        }
        levels[d].push(node->val);
        if (node->left) {
            queue[queuet++] = { node: node->left, d: d + 1 };
        }
        if (node->right) {
            queue[queuet++] = { node: node->right, d: d + 1 };
        }
    }
    return levels;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "BFS without storing depth. n = queue.length is the current row size. Process exactly those n nodes, enqueue children for the next row. Cleaner constant factors; still O(width) queue.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function levelOrder(root) {
  if (!root) return [];
  const levels = [];
  const queue = [root];
  while (queue.length) {
    const n = queue.length;
    const row = [];
    for (let i = 0; i < n; i++) {
      const node = queue.shift();
      row.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    levels.push(row);
  }
  return levels;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function levelOrder(root) {
  if (!root) return [];
  const levels = [];
  const queue = [root];
  while (queue.length) {
    const n = queue.length;
    const row = [];
    for (let i = 0; i < n; i++) {
      const node = queue.shift();
      row.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    levels.push(row);
  }
  return levels;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def levelOrder(root):
    if not root:
        return []
    levels = []
    queue = [root]
    while len(queue):
        n = len(queue)
        row = []
        for i in range(n):
            node = queue.pop(0)
            row.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        levels.append(row)
    return levels`,
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
    public List<List<Integer>> levelOrder(TreeNode root) {
        if (root == null) {
            return new ArrayList<>();
        }
        List<List<Integer>> levels = new ArrayList<>();
        List<TreeNode> queue = new ArrayList<>(); queue.add(root);
        while (!queue.isEmpty()) {
            int n = queue.size();
            List<Integer> row = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                TreeNode node = queue.remove(0);
                row.add(node.val);
                if (node.left != null) {
                    queue.add(node.left);
                }
                if (node.right != null) {
                    queue.add(node.right);
                }
            }
            levels.add(row);
        }
        return levels;
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

vector<vector<int>> levelOrder(TreeNode* root) {
    if (!root) {
        return {};
    }
    vector<vector<int>> levels;
    vector<TreeNode*> queue = {root};
    while (queue.size()) {
        int n = queue.size();
        vector<int> row;
        for (int i = 0; i < n; i++) {
            TreeNode* node = queue.front() /* erase begin */;
            row.push_back(node->val);
            if (node->left) {
                queue.push_back(node->left);
            }
            if (node->right) {
                queue.push_back(node->right);
            }
        }
        levels.push_back(row);
    }
    return levels;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int** levelOrder(struct Node* root) {
    if (!root) {
        return NULL; /* empty */
    }
    int levels[512][512]; int levelsn = 0; int levelssz[512];
    struct Node* queue[10005]; int queueh = 0, queuet = 0; queue[queuet++] = root;
    while (queuen) {
        int n = queuen;
        int row[10005]; int rown = 0;
        for (int i = 0; i < n; i++) {
            struct Node* node = queue[queueh++];
            row[rown++] = node->val;
            if (node->left) {
                queue[queuet++] = node->left;
            }
            if (node->right) {
                queue[queuet++] = node->right;
            }
        }
        levels[levelsn++] = row;
    }
    return levels;
}`
          }
        }
      ]
    },
    {
      id: 3,
      level: "beginner",
      q: "Maximum Depth of Binary Tree",
      ask: "Amazon · Google · Apple · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/maximum-depth-of-binary-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/height-of-binary-tree/1"}],
      a: "Depth is the number of nodes on the longest root-to-leaf path. Return that number. Empty tree is 0.\n\nA root with two leaves has depth 2. A stick of three nodes has depth 3.\n\nBFS counts how many levels you drain. Recursion is 1 + max(left, right). Iterative DFS stores depth next to each node on a stack.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Collect every root-to-leaf path into arrays, return the longest length. Extra memory for all paths.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function maxDepth(root) {
  const paths = [];
  function go(node, path) {
    if (!node) return;
    path.push(node.val);
    if (!node.left && !node.right) paths.push(path.length);
    go(node.left, path);
    go(node.right, path);
    path.pop();
  }
  go(root, []);
  return paths.length ? Math.max.apply(null, paths) : 0;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function maxDepth(root) {
  const paths = [];
  function go(node, path) {
    if (!node) return;
    path.push(node.val);
    if (!node.left && !node.right) paths.push(path.length);
    go(node.left, path);
    go(node.right, path);
    path.pop();
  }
  go(root, []);
  return paths.length ? Math.max.apply(null, paths) : 0;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def maxDepth(root):
    paths = []
    def go(node, path):
        if not node:
            return
        path.append(node.val)
        if not node.left  and  not node.right:
            paths.append(len(path))
        go(node.left, path)
        go(node.right, path)
        path.pop()
    go(root, [])
    return (max(paths) if len(paths) else 0)`,
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
    private int maxDepth_go(TreeNode node, List<Integer> path) {
        if (node == null) {
            return;
        }
        path.add(node.val);
        if (node.left == null && node.right == null) {
            paths.add(path.size());
        }
        maxDepth_go(node.left, path);
        maxDepth_go(node.right, path);
        path.remove(path.size()-1);
    }

    public int maxDepth(TreeNode root) {
        List<Integer> paths = new ArrayList<>();
        maxDepth_go(root, []);
        return paths.size() ? Collections.max(paths) : 0;
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

int maxDepth_go(TreeNode* node, vector<int>& path) {
    if (!node) {
        return;
    }
    path.push_back(node->val);
    if (!node->left && !node->right) {
        paths.push_back(path.size());
    }
    maxDepth_go(node->left, path);
    maxDepth_go(node->right, path);
    path.back() /* then pop_back */;
}

int maxDepth(TreeNode* root) {
    vector<int> paths;
    maxDepth_go(root, []);
    return paths.size() ? *max_element(paths.begin(), paths.end()) : 0;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int maxDepth_go(struct Node* node, int* path, int* pathn) {
    if (!node) {
        return;
    }
    path[pathn++] = node->val;
    if (!node->left && !node->right) {
        paths[pathsn++] = pathn;
    }
    maxDepth_go(node->left, path);
    maxDepth_go(node->right, path);
    path[--pathn];
}

int maxDepth(struct Node* root) {
    int paths[10005]; int pathsn = 0;
    maxDepth_go(root, []);
    return pathsn ? /*max*/ : 0;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Recursive height: null is 0, else 1 + max of children. One visit per node. Stack O(h).",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def maxDepth(root):
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
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
    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
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

int maxDepth(TreeNode* root) {
    if (!root) {
        return 0;
    }
    return 1 + std::max(maxDepth(root->left), maxDepth(root->right));
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int maxDepth(struct Node* root) {
    if (!root) {
        return 0;
    }
    return 1 + MAX(maxDepth(root->left), maxDepth(root->right));
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Iterative stack of {node, depth}. Track the max depth seen. Same complexity, no engine recursion. BFS would use O(width) instead of O(h).",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function maxDepth(root) {
  if (!root) return 0;
  let best = 0;
  const stack = [{ node: root, d: 1 }];
  while (stack.length) {
    const { node, d } = stack.pop();
    if (d > best) best = d;
    if (node.left) stack.push({ node: node.left, d: d + 1 });
    if (node.right) stack.push({ node: node.right, d: d + 1 });
  }
  return best;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function maxDepth(root) {
  if (!root) return 0;
  let best = 0;
  const stack = [{ node: root, d: 1 }];
  while (stack.length) {
    const { node, d } = stack.pop();
    if (d > best) best = d;
    if (node.left) stack.push({ node: node.left, d: d + 1 });
    if (node.right) stack.push({ node: node.right, d: d + 1 });
  }
  return best;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def maxDepth(root):
    if not root:
        return 0
    best = 0
    stack = [{ node: root, d: 1 }]
    while len(stack):
        node, d = stack.pop()["node"], stack.pop()["d"]
        if d > best:
            best = d
        if node.left:
            stack.append({ node: node.left, d: d + 1 })
        if node.right:
            stack.append({ node: node.right, d: d + 1 })
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
    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int best = 0;
        List<Item> stack = new ArrayList<>(); stack.add(new Item([{ node: root, d: 1 }]));
        while (!stack.isEmpty()) {
            TreeNode __it = stack.remove(stack.size()-1);
var node = __it.node; var d = __it.d;
            if (d > best) {
                best = d;
            }
            if (node.left != null) {
                stack.add({ node: node.left, d: d + 1 });
            }
            if (node.right != null) {
                stack.add({ node: node.right, d: d + 1 });
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

int maxDepth(TreeNode* root) {
    if (!root) {
        return 0;
    }
    int best = 0;
    vector<pair<TreeNode*, int>> stack;
    while (stack.size()) {
        auto __it = stack.back() /* then pop_back */; TreeNode* node = __it.first; int d = __it.second;
        if (d > best) {
            best = d;
        }
        if (node->left) {
            stack.push_back({ node: node->left, d: d + 1 });
        }
        if (node->right) {
            stack.push_back({ node: node->right, d: d + 1 });
        }
    }
    return best;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int maxDepth(struct Node* root) {
    if (!root) {
        return 0;
    }
    int best = 0;
    struct Node* stackN[10005]; int stackD[10005]; int stackn = 0;
    while (stackn) {
        /* unpack node,d */
        if (d > best) {
            best = d;
        }
        if (node->left) {
            stack[stackn++] = { node: node->left, d: d + 1 };
        }
        if (node->right) {
            stack[stackn++] = { node: node->right, d: d + 1 };
        }
    }
    return best;
}`
          }
        }
      ]
    },
    {
      id: 4,
      level: "beginner",
      q: "Invert Binary Tree",
      ask: "Amazon · Google · Apple · Uber",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/invert-binary-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/mirror-tree/1"}],
      a: "Swap left and right children at every node. Return the root of the mirrored tree.\n\nA tree with 2 left of 4 and 7 right of 4 becomes 7 left and 2 right, and the same swap happens deeper.\n\nCollect all nodes then swap each. Recursion swaps then inverts children. BFS/DFS iterative swap is the stack/queue twin.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "BFS into an array of every node, then swap left/right on each. Extra list of n pointers.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function invertTree(root) {
  if (!root) return root;
  const nodes = [];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    nodes.push(node);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  for (const node of nodes) {
    const tmp = node.left;
    node.left = node.right;
    node.right = tmp;
  }
  return root;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function invertTree(root) {
  if (!root) return root;
  const nodes = [];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    nodes.push(node);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  for (const node of nodes) {
    const tmp = node.left;
    node.left = node.right;
    node.right = tmp;
  }
  return root;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def invertTree(root):
    if not root:
        return root
    nodes = []
    queue = [root]
    while len(queue):
        node = queue.pop(0)
        nodes.append(node)
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    for node in nodes:
        tmp = node.left
        node.left = node.right
        node.right = tmp
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
    public TreeNode invertTree(TreeNode root) {
        if (root == null) {
            return root;
        }
        List<TreeNode> nodes = new ArrayList<>();
        List<TreeNode> queue = new ArrayList<>(); queue.add(root);
        while (!queue.isEmpty()) {
            TreeNode node = queue.remove(0);
            nodes.add(node);
            if (node.left != null) {
                queue.add(node.left);
            }
            if (node.right != null) {
                queue.add(node.right);
            }
        }
        for (var node : nodes) {
            TreeNode tmp = node.left;
            node.left = node.right;
            node.right = tmp;
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

TreeNode* invertTree(TreeNode* root) {
    if (!root) {
        return root;
    }
    vector<TreeNode*> nodes;
    vector<TreeNode*> queue = {root};
    while (queue.size()) {
        TreeNode* node = queue.front() /* erase begin */;
        nodes.push_back(node);
        if (node->left) {
            queue.push_back(node->left);
        }
        if (node->right) {
            queue.push_back(node->right);
        }
    }
    for (auto node : nodes) {
        TreeNode* tmp = node->left;
        node->left = node->right;
        node->right = tmp;
    }
    return root;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* invertTree(struct Node* root) {
    if (!root) {
        return root;
    }
    struct Node* nodes[10005]; int nodesn = 0;
    struct Node* queue[10005]; int queueh = 0, queuet = 0; queue[queuet++] = root;
    while (queuen) {
        struct Node* node = queue[queueh++];
        nodes[nodesn++] = node;
        if (node->left) {
            queue[queuet++] = node->left;
        }
        if (node->right) {
            queue[queuet++] = node->right;
        }
    }
    for (int _i = 0; _i < nodesn; _i++) { struct Node* node = nodes[_i];
        struct Node* tmp = node->left;
        node->left = node->right;
        node->right = tmp;
    }
    return root;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Recurse: invert children, then swap this node's left and right (order of swap vs recurse both work). Stack O(h).",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function invertTree(root) {
  if (!root) return null;
  invertTree(root.left);
  invertTree(root.right);
  const tmp = root.left;
  root.left = root.right;
  root.right = tmp;
  return root;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function invertTree(root) {
  if (!root) return null;
  invertTree(root.left);
  invertTree(root.right);
  const tmp = root.left;
  root.left = root.right;
  root.right = tmp;
  return root;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def invertTree(root):
    if not root:
        return None
    invertTree(root.left)
    invertTree(root.right)
    tmp = root.left
    root.left = root.right
    root.right = tmp
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
    public TreeNode invertTree(TreeNode root) {
        if (root == null) {
            return null;
        }
        invertTree(root.left);
        invertTree(root.right);
        TreeNode tmp = root.left;
        root.left = root.right;
        root.right = tmp;
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

TreeNode* invertTree(TreeNode* root) {
    if (!root) {
        return nullptr;
    }
    invertTree(root->left);
    invertTree(root->right);
    TreeNode* tmp = root->left;
    root->left = root->right;
    root->right = tmp;
    return root;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* invertTree(struct Node* root) {
    if (!root) {
        return NULL;
    }
    invertTree(root->left);
    invertTree(root->right);
    struct Node* tmp = root->left;
    root->left = root->right;
    root->right = tmp;
    return root;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Iterative stack. Pop a node, swap children, push non-null children. Same work, no recursion. Queue instead of stack is also fine.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function invertTree(root) {
  if (!root) return null;
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    const tmp = node.left;
    node.left = node.right;
    node.right = tmp;
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  return root;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function invertTree(root) {
  if (!root) return null;
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    const tmp = node.left;
    node.left = node.right;
    node.right = tmp;
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  return root;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def invertTree(root):
    if not root:
        return None
    stack = [root]
    while len(stack):
        node = stack.pop()
        tmp = node.left
        node.left = node.right
        node.right = tmp
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)
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
    public TreeNode invertTree(TreeNode root) {
        if (root == null) {
            return null;
        }
        List<TreeNode> stack = new ArrayList<>(); stack.add(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.remove(stack.size()-1);
            TreeNode tmp = node.left;
            node.left = node.right;
            node.right = tmp;
            if (node.left != null) {
                stack.add(node.left);
            }
            if (node.right != null) {
                stack.add(node.right);
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

TreeNode* invertTree(TreeNode* root) {
    if (!root) {
        return nullptr;
    }
    vector<TreeNode*> stack = {root};
    while (stack.size()) {
        TreeNode* node = stack.back() /* then pop_back */;
        TreeNode* tmp = node->left;
        node->left = node->right;
        node->right = tmp;
        if (node->left) {
            stack.push_back(node->left);
        }
        if (node->right) {
            stack.push_back(node->right);
        }
    }
    return root;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* invertTree(struct Node* root) {
    if (!root) {
        return NULL;
    }
    struct Node* stack[10005]; int stackn = 0; stack[stackn++] = root;
    while (stackn) {
        struct Node* node = stack[--stackn];
        struct Node* tmp = node->left;
        node->left = node->right;
        node->right = tmp;
        if (node->left) {
            stack[stackn++] = node->left;
        }
        if (node->right) {
            stack[stackn++] = node->right;
        }
    }
    return root;
}`
          }
        }
      ]
    },
    {
      id: 5,
      level: "beginner",
      q: "Same Tree",
      ask: "Amazon · Apple · Adobe · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/same-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/determine-if-two-trees-are-identical/1"}],
      a: "Return true if two trees have the same shape and the same values at every corresponding node.\n\nTwo copies of 1 with left 2 and right 3 are the same. If one has a missing child the other has, they differ.\n\nSerialize both and compare strings. Recursion compares val and both subtrees. Iterative two stacks (or a queue of pairs) does the same walk.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Encode each tree as a preorder array with N for null, then compare the arrays. Extra strings/arrays for both trees.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSameTree(p, q) {
  function enc(node, out) {
    if (!node) {
      out.push("N");
      return;
    }
    out.push(String(node.val));
    enc(node.left, out);
    enc(node.right, out);
  }
  const a = [];
  const b = [];
  enc(p, a);
  enc(q, b);
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSameTree(p, q) {
  function enc(node, out) {
    if (!node) {
      out.push("N");
      return;
    }
    out.push(String(node.val));
    enc(node.left, out);
    enc(node.right, out);
  }
  const a = [];
  const b = [];
  enc(p, a);
  enc(q, b);
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def isSameTree(p, q):
    def enc(node, out):
        if not node:
            out.append("N")
            return
        out.append(str(node.val))
        enc(node.left, out)
        enc(node.right, out)
    a = []
    b = []
    enc(p, a)
    enc(q, b)
    if len(a) != len(b):
        return False
    for i in range(len(a)):
        if a[i] != b[i]:
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
    private boolean isSameTree_enc(TreeNode node, List<String> out) {
        if (node == null) {
            out.add("N");
            return;
        }
        out.add(String.valueOf(node.val));
        isSameTree_enc(node.left, out);
        isSameTree_enc(node.right, out);
    }

    public boolean isSameTree(TreeNode p, TreeNode q) {
        List<TreeNode> a = new ArrayList<>();
        List<TreeNode> b = new ArrayList<>();
        isSameTree_enc(p, a);
        isSameTree_enc(q, b);
        if (a.size() != b.size()) {
            return false;
        }
        for (int i = 0; i < a.size(); i++) {
            if (a[i] != b[i]) {
                return false;
            }
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

bool isSameTree_enc(TreeNode* node, vector<string>& out) {
    if (!node) {
        out.push_back("N");
        return;
    }
    out.push_back(to_string(node->val));
    isSameTree_enc(node->left, out);
    isSameTree_enc(node->right, out);
}

bool isSameTree(TreeNode* p, TreeNode* q) {
    vector<TreeNode*> a;
    vector<TreeNode*> b;
    isSameTree_enc(p, a);
    isSameTree_enc(q, b);
    if (a.size() != b.size()) {
        return false;
    }
    for (int i = 0; i < a.size(); i++) {
        if (a[i] != b[i]) {
            return false;
        }
    }
    return true;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool isSameTree_enc(struct Node* node, char** out, int* outn) {
    if (!node) {
        out[outn++] = "N";
        return;
    }
    out[outn++] = /*str*/(node->val);
    isSameTree_enc(node->left, out);
    isSameTree_enc(node->right, out);
}

bool isSameTree(struct Node* p, struct Node* q) {
    struct Node* a[10005]; int an = 0;
    struct Node* b[10005]; int bn = 0;
    isSameTree_enc(p, a);
    isSameTree_enc(q, b);
    if (an != bn) {
        return false;
    }
    for (int i = 0; i < an; i++) {
        if (a[i] != b[i]) {
            return false;
        }
    }
    return true;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(h)",
          why: "If both null, true. If one null or vals differ, false. Else both lefts and both rights. Stack O(h).",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSameTree(p, q) {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSameTree(p, q) {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def isSameTree(p, q):
    if not p  and  not q:
        return True
    if not p  or  not q  or  p.val != q.val:
        return False
    return isSameTree(p.left, q.left)  and  isSameTree(p.right, q.right)`,
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
    public boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) {
            return true;
        }
        if (p == null || q == null || p.val != q.val) {
            return false;
        }
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
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

bool isSameTree(TreeNode* p, TreeNode* q) {
    if (!p && !q) {
        return true;
    }
    if (!p || !q || p->val != q->val) {
        return false;
    }
    return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool isSameTree(struct Node* p, struct Node* q) {
    if (!p && !q) {
        return true;
    }
    if (!p || !q || p->val != q->val) {
        return false;
    }
    return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Iterative: stack of pairs. Pop two nodes, check null/val, push children pairs. Same complexity, no recursion.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSameTree(p, q) {
  const stack = [[p, q]];
  while (stack.length) {
    const pair = stack.pop();
    const a = pair[0];
    const b = pair[1];
    if (!a && !b) continue;
    if (!a || !b || a.val !== b.val) return false;
    stack.push([a.left, b.left]);
    stack.push([a.right, b.right]);
  }
  return true;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSameTree(p, q) {
  const stack = [[p, q]];
  while (stack.length) {
    const pair = stack.pop();
    const a = pair[0];
    const b = pair[1];
    if (!a && !b) continue;
    if (!a || !b || a.val !== b.val) return false;
    stack.push([a.left, b.left]);
    stack.push([a.right, b.right]);
  }
  return true;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def isSameTree(p, q):
    stack = [[p, q]]
    while len(stack):
        pair = stack.pop()
        a = pair[0]
        b = pair[1]
        if not a  and  not b:
            continue
        if not a  or  not b  or  a.val != b.val:
            return False
        stack.append([a.left, b.left])
        stack.append([a.right, b.right])
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
    public boolean isSameTree(TreeNode p, TreeNode q) {
        List<TreeNode[]> stack = new ArrayList<>();
        while (!stack.isEmpty()) {
            int pair = stack.remove(stack.size()-1);
            TreeNode a = pair[0];
            TreeNode b = pair[1];
            if (a == null && b == null) {
                continue;
            }
            if (a == null || b == null || a.val != b.val) {
                return false;
            }
            stack.add([a.left, b.left]);
            stack.add([a.right, b.right]);
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

bool isSameTree(TreeNode* p, TreeNode* q) {
    vector<TreeNode*> stack = {[p, q]};
    while (stack.size()) {
        int pair = stack.back() /* then pop_back */;
        TreeNode* a = pair[0];
        TreeNode* b = pair[1];
        if (!a && !b) {
            continue;
        }
        if (!a || !b || a->val != b->val) {
            return false;
        }
        stack.push_back([a->left, b->left]);
        stack.push_back([a->right, b->right]);
    }
    return true;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool isSameTree(struct Node* p, struct Node* q) {
    struct Node* stack[10005]; int stackn = 0; stack[stackn++] = [p, q];
    while (stackn) {
        int pair = stack[--stackn];
        struct Node* a = pair[0];
        struct Node* b = pair[1];
        if (!a && !b) {
            continue;
        }
        if (!a || !b || a->val != b->val) {
            return false;
        }
        stack[stackn++] = [a->left, b->left];
        stack[stackn++] = [a->right, b->right];
    }
    return true;
}`
          }
        }
      ]
    },
    {
      id: 6,
      level: "beginner",
      q: "Symmetric Tree",
      ask: "Amazon · Microsoft · Google · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/symmetric-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/symmetric-tree/1"}],
      a: "Return true if the tree is a mirror of itself around the center.\n\n[1,2,2,3,4,4,3] is symmetric. [1,2,2,null,3,null,3] is not, because the inner 3s do not face each other.\n\nDump left and right halves into arrays with a mirrored walk. Recursion checks whether two subtrees are mirrors. A queue of pairs (left, right) does the same iteratively.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Encode the left subtree left-to-right with nulls, encode the right subtree right-to-left with nulls, compare. Extra arrays.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSymmetric(root) {
  if (!root) return true;
  function enc(node, leftFirst, out) {
    if (!node) {
      out.push("N");
      return;
    }
    out.push(String(node.val));
    if (leftFirst) {
      enc(node.left, true, out);
      enc(node.right, true, out);
    } else {
      enc(node.right, false, out);
      enc(node.left, false, out);
    }
  }
  const a = [];
  const b = [];
  enc(root.left, true, a);
  enc(root.right, false, b);
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSymmetric(root) {
  if (!root) return true;
  function enc(node, leftFirst, out) {
    if (!node) {
      out.push("N");
      return;
    }
    out.push(String(node.val));
    if (leftFirst) {
      enc(node.left, true, out);
      enc(node.right, true, out);
    } else {
      enc(node.right, false, out);
      enc(node.left, false, out);
    }
  }
  const a = [];
  const b = [];
  enc(root.left, true, a);
  enc(root.right, false, b);
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def isSymmetric(root):
    if not root:
        return True
    def enc(node, leftFirst, out):
        if not node:
            out.append("N")
            return
        out.append(str(node.val))
        if leftFirst:
            enc(node.left, True, out)
            enc(node.right, True, out)
        else:
            enc(node.right, False, out)
            enc(node.left, False, out)
    a = []
    b = []
    enc(root.left, True, a)
    enc(root.right, False, b)
    if len(a) != len(b):
        return False
    for i in range(len(a)):
        if a[i] != b[i]:
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
    private boolean isSymmetric_enc(TreeNode node, boolean leftFirst, List<String> out) {
        if (node == null) {
            out.add("N");
            return;
        }
        out.add(String.valueOf(node.val));
        if (leftFirst) {
            isSymmetric_enc(node.left, true, out);
            isSymmetric_enc(node.right, true, out);
        }
        else {
            isSymmetric_enc(node.right, false, out);
            isSymmetric_enc(node.left, false, out);
        }
    }

    public boolean isSymmetric(TreeNode root) {
        if (root == null) {
            return true;
        }
        List<TreeNode> a = new ArrayList<>();
        List<TreeNode> b = new ArrayList<>();
        isSymmetric_enc(root.left, true, a);
        isSymmetric_enc(root.right, false, b);
        if (a.size() != b.size()) {
            return false;
        }
        for (int i = 0; i < a.size(); i++) {
            if (a[i] != b[i]) {
                return false;
            }
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

bool isSymmetric_enc(TreeNode* node, bool leftFirst, vector<string>& out) {
    if (!node) {
        out.push_back("N");
        return;
    }
    out.push_back(to_string(node->val));
    if (leftFirst) {
        isSymmetric_enc(node->left, true, out);
        isSymmetric_enc(node->right, true, out);
    }
    else {
        isSymmetric_enc(node->right, false, out);
        isSymmetric_enc(node->left, false, out);
    }
}

bool isSymmetric(TreeNode* root) {
    if (!root) {
        return true;
    }
    vector<TreeNode*> a;
    vector<TreeNode*> b;
    isSymmetric_enc(root->left, true, a);
    isSymmetric_enc(root->right, false, b);
    if (a.size() != b.size()) {
        return false;
    }
    for (int i = 0; i < a.size(); i++) {
        if (a[i] != b[i]) {
            return false;
        }
    }
    return true;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool isSymmetric_enc(struct Node* node, bool leftFirst, char** out, int* outn) {
    if (!node) {
        out[outn++] = "N";
        return;
    }
    out[outn++] = /*str*/(node->val);
    if (leftFirst) {
        isSymmetric_enc(node->left, true, out);
        isSymmetric_enc(node->right, true, out);
    }
    else {
        isSymmetric_enc(node->right, false, out);
        isSymmetric_enc(node->left, false, out);
    }
}

bool isSymmetric(struct Node* root) {
    if (!root) {
        return true;
    }
    struct Node* a[10005]; int an = 0;
    struct Node* b[10005]; int bn = 0;
    isSymmetric_enc(root->left, true, a);
    isSymmetric_enc(root->right, false, b);
    if (an != bn) {
        return false;
    }
    for (int i = 0; i < an; i++) {
        if (a[i] != b[i]) {
            return false;
        }
    }
    return true;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(h)",
          why: "mirror(a,b): both null ok; one null fail; vals equal and mirror(a.left,b.right) and mirror(a.right,b.left). Recurse from root.left and root.right.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSymmetric(root) {
  function mirror(a, b) {
    if (!a && !b) return true;
    if (!a || !b || a.val !== b.val) return false;
    return mirror(a.left, b.right) && mirror(a.right, b.left);
  }
  if (!root) return true;
  return mirror(root.left, root.right);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSymmetric(root) {
  function mirror(a, b) {
    if (!a && !b) return true;
    if (!a || !b || a.val !== b.val) return false;
    return mirror(a.left, b.right) && mirror(a.right, b.left);
  }
  if (!root) return true;
  return mirror(root.left, root.right);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def isSymmetric(root):
    def mirror(a, b):
        if not a  and  not b:
            return True
        if not a  or  not b  or  a.val != b.val:
            return False
        return mirror(a.left, b.right)  and  mirror(a.right, b.left)
    if not root:
        return True
    return mirror(root.left, root.right)`,
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
    private boolean isSymmetric_mirror(TreeNode a, TreeNode b) {
        if (a == null && b == null) {
            return true;
        }
        if (a == null || b == null || a.val != b.val) {
            return false;
        }
        return isSymmetric_mirror(a.left, b.right) && isSymmetric_mirror(a.right, b.left);
    }

    public boolean isSymmetric(TreeNode root) {
        if (root == null) {
            return true;
        }
        return isSymmetric_mirror(root.left, root.right);
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

bool isSymmetric_mirror(TreeNode* a, TreeNode* b) {
    if (!a && !b) {
        return true;
    }
    if (!a || !b || a->val != b->val) {
        return false;
    }
    return isSymmetric_mirror(a->left, b->right) && isSymmetric_mirror(a->right, b->left);
}

bool isSymmetric(TreeNode* root) {
    if (!root) {
        return true;
    }
    return isSymmetric_mirror(root->left, root->right);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool isSymmetric_mirror(struct Node* a, struct Node* b) {
    if (!a && !b) {
        return true;
    }
    if (!a || !b || a->val != b->val) {
        return false;
    }
    return isSymmetric_mirror(a->left, b->right) && isSymmetric_mirror(a->right, b->left);
}

bool isSymmetric(struct Node* root) {
    if (!root) {
        return true;
    }
    return isSymmetric_mirror(root->left, root->right);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Queue of node pairs. Dequeue a and b, check, enqueue a.left with b.right and a.right with b.left. Iterative mirror test.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSymmetric(root) {
  if (!root) return true;
  const queue = [root.left, root.right];
  while (queue.length) {
    const a = queue.shift();
    const b = queue.shift();
    if (!a && !b) continue;
    if (!a || !b || a.val !== b.val) return false;
    queue.push(a.left, b.right);
    queue.push(a.right, b.left);
  }
  return true;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSymmetric(root) {
  if (!root) return true;
  const queue = [root.left, root.right];
  while (queue.length) {
    const a = queue.shift();
    const b = queue.shift();
    if (!a && !b) continue;
    if (!a || !b || a.val !== b.val) return false;
    queue.push(a.left, b.right);
    queue.push(a.right, b.left);
  }
  return true;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def isSymmetric(root):
    if not root:
        return True
    queue = [root.left, root.right]
    while len(queue):
        a = queue.pop(0)
        b = queue.pop(0)
        if not a  and  not b:
            continue
        if not a  or  not b  or  a.val != b.val:
            return False
        queue.append(a.left, b.right)
        queue.append(a.right, b.left)
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
    public boolean isSymmetric(TreeNode root) {
        if (root == null) {
            return true;
        }
        List<TreeNode> queue = new ArrayList<>(); queue.add(root.left, root.right);
        while (!queue.isEmpty()) {
            TreeNode a = queue.remove(0);
            TreeNode b = queue.remove(0);
            if (a == null && b == null) {
                continue;
            }
            if (a == null || b == null || a.val != b.val) {
                return false;
            }
            queue.add(a.left, b.right);
            queue.add(a.right, b.left);
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

bool isSymmetric(TreeNode* root) {
    if (!root) {
        return true;
    }
    vector<TreeNode*> queue = {root->left, root->right};
    while (queue.size()) {
        TreeNode* a = queue.front() /* erase begin */;
        TreeNode* b = queue.front() /* erase begin */;
        if (!a && !b) {
            continue;
        }
        if (!a || !b || a->val != b->val) {
            return false;
        }
        queue.push_back(a->left, b->right);
        queue.push_back(a->right, b->left);
    }
    return true;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool isSymmetric(struct Node* root) {
    if (!root) {
        return true;
    }
    struct Node* queue[10005]; int queueh = 0, queuet = 0; queue[queuet++] = root->left, root->right;
    while (queuen) {
        struct Node* a = queue[queueh++];
        struct Node* b = queue[queueh++];
        if (!a && !b) {
            continue;
        }
        if (!a || !b || a->val != b->val) {
            return false;
        }
        queue[queuet++] = a->left, b->right;
        queue[queuet++] = a->right, b->left;
    }
    return true;
}`
          }
        }
      ]
    },
    {
      id: 7,
      level: "intermediate",
      q: "Lowest Common Ancestor of a BST",
      ask: "Amazon · Microsoft · Google · Meta",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/lowest-common-ancestor-in-a-bst/1"}],
      a: "p and q are nodes in a BST. Return their lowest common ancestor: the deepest node that has both in its subtree. A node can be an ancestor of itself.\n\nIn BST 6 with left 2 and right 8, LCA of 2 and 8 is 6. LCA of 2 and 4 is 2.\n\nRecord paths from root to each target, last shared node. Recursion: if both values are less, go left; both greater, go right; else this node. Iteration is the same walk without a stack.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(h)",
          space: "O(h)",
          why: "Walk BST paths into two arrays of nodes, then scan from the start until they differ. Extra path arrays.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function lowestCommonAncestor(root, p, q) {
  function pathTo(node, target) {
    const path = [];
    let cur = node;
    while (cur) {
      path.push(cur);
      if (cur === target || cur.val === target.val) break;
      cur = target.val < cur.val ? cur.left : cur.right;
    }
    return path;
  }
  const a = pathTo(root, p);
  const b = pathTo(root, q);
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return a[i - 1];
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function lowestCommonAncestor(root, p, q) {
  function pathTo(node, target) {
    const path = [];
    let cur = node;
    while (cur) {
      path.push(cur);
      if (cur === target || cur.val === target.val) break;
      cur = target.val < cur.val ? cur.left : cur.right;
    }
    return path;
  }
  const a = pathTo(root, p);
  const b = pathTo(root, q);
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return a[i - 1];
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def lowestCommonAncestor(root, p, q):
    def pathTo(node, target):
        path = []
        cur = node
        while cur:
            path.append(cur)
            if cur == target  or  cur.val == target.val:
                break
            cur = (cur.left if target.val < cur.val else cur.right)
        return path
    a = pathTo(root, p)
    b = pathTo(root, q)
    i = 0
    while i < len(a)  and  i < len(b)  and  a[i] == b[i]:
        i += 1
    return a[i - 1]`,
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
    private TreeNode lowestCommonAncestor_pathTo(TreeNode node, TreeNode target) {
        List<Integer> path = new ArrayList<>();
        TreeNode cur = node;
        while (cur != null) {
            path.add(cur);
            if (cur == target || cur.val == target.val) {
                break;
            }
            cur = target.val < cur.val ? cur.left : cur.right;
        }
        return path;
    }

    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        TreeNode a = lowestCommonAncestor_pathTo(root, p);
        TreeNode b = lowestCommonAncestor_pathTo(root, q);
        int i = 0;
        while (i < a.size() && i < b.size() && a[i] == b[i]) {
            i++;
        }
        return a[i - 1];
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

TreeNode* lowestCommonAncestor_pathTo(TreeNode* node, TreeNode* target) {
    vector<int> path;
    TreeNode* cur = node;
    while (cur) {
        path.push_back(cur);
        if (cur == target || cur->val == target->val) {
            break;
        }
        cur = target->val < cur->val ? cur->left : cur->right;
    }
    return path;
}

TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    TreeNode* a = lowestCommonAncestor_pathTo(root, p);
    TreeNode* b = lowestCommonAncestor_pathTo(root, q);
    int i = 0;
    while (i < a.size() && i < b.size() && a[i] == b[i]) {
        i++;
    }
    return a[i - 1];
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* lowestCommonAncestor_pathTo(struct Node* node, struct Node* target) {
    int path[10005]; int pathn = 0;
    struct Node* cur = node;
    while (cur) {
        path[pathn++] = cur;
        if (cur == target || cur->val == target->val) {
            break;
        }
        cur = target->val < cur->val ? cur->left : cur->right;
    }
    return path;
}

struct Node* lowestCommonAncestor(struct Node* root, struct Node* p, struct Node* q) {
    struct Node* a = lowestCommonAncestor_pathTo(root, p);
    struct Node* b = lowestCommonAncestor_pathTo(root, q);
    int i = 0;
    while (i < an && i < bn && a[i] == b[i]) {
        i++;
    }
    return a[i - 1];
}`
          }
        },
        {
          name: "Optimal",
          time: "O(h)",
          space: "O(h)",
          why: "Recursive BST walk. Split point is the LCA. Stack O(h).",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function lowestCommonAncestor(root, p, q) {
  if (p.val < root.val && q.val < root.val) {
    return lowestCommonAncestor(root.left, p, q);
  }
  if (p.val > root.val && q.val > root.val) {
    return lowestCommonAncestor(root.right, p, q);
  }
  return root;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function lowestCommonAncestor(root, p, q) {
  if (p.val < root.val && q.val < root.val) {
    return lowestCommonAncestor(root.left, p, q);
  }
  if (p.val > root.val && q.val > root.val) {
    return lowestCommonAncestor(root.right, p, q);
  }
  return root;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def lowestCommonAncestor(root, p, q):
    if p.val < root.val  and  q.val < root.val:
        return lowestCommonAncestor(root.left, p, q)
    if p.val > root.val  and  q.val > root.val:
        return lowestCommonAncestor(root.right, p, q)
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
        if (p.val < root.val && q.val < root.val) {
            return lowestCommonAncestor(root.left, p, q);
        }
        if (p.val > root.val && q.val > root.val) {
            return lowestCommonAncestor(root.right, p, q);
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

TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (p->val < root->val && q->val < root->val) {
        return lowestCommonAncestor(root->left, p, q);
    }
    if (p->val > root->val && q->val > root->val) {
        return lowestCommonAncestor(root->right, p, q);
    }
    return root;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* lowestCommonAncestor(struct Node* root, struct Node* p, struct Node* q) {
    if (p->val < root->val && q->val < root->val) {
        return lowestCommonAncestor(root->left, p, q);
    }
    if (p->val > root->val && q->val > root->val) {
        return lowestCommonAncestor(root->right, p, q);
    }
    return root;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(h)",
          space: "O(1)",
          why: "Same split logic in a loop. No recursion. Constant extra space.",
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
def lowestCommonAncestor(root, p, q):
    cur = root
    while cur:
        if p.val < cur.val  and  q.val < cur.val:
            cur = cur.left
        elif p.val > cur.val  and  q.val > cur.val:
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
            if (p.val < cur.val && q.val < cur.val) {
                cur = cur.left;
            }
            else if (p.val > cur.val && q.val > cur.val) {
                cur = cur.right;
            }
            else {
                return cur;
            }
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
        if (p->val < cur->val && q->val < cur->val) {
            cur = cur->left;
        }
        else if (p->val > cur->val && q->val > cur->val) {
            cur = cur->right;
        }
        else {
            return cur;
        }
    }
    return nullptr;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* lowestCommonAncestor(struct Node* root, struct Node* p, struct Node* q) {
    struct Node* cur = root;
    while (cur) {
        if (p->val < cur->val && q->val < cur->val) {
            cur = cur->left;
        }
        else if (p->val > cur->val && q->val > cur->val) {
            cur = cur->right;
        }
        else {
            return cur;
        }
    }
    return NULL;
}`
          }
        }
      ]
    },
    {
      id: 8,
      level: "intermediate",
      q: "Lowest Common Ancestor of a Binary Tree",
      ask: "Amazon · Meta · Microsoft · Google",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/lowest-common-ancestor-in-a-binary-tree/1"}],
      a: "Same LCA idea, but the tree is not a BST. You cannot compare values to choose a side. p and q exist in the tree. A node may be the ancestor of itself.\n\nOn a general tree, LCA of two leaves is the fork where their paths split.\n\nStore parent pointers or full paths, then walk ancestors. Recursion: if left and right both find a target, root is LCA. Iterative: parent map plus a set of p's ancestors.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "DFS records the path to p and the path to q as arrays. Last common entry is the LCA. Extra path storage.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function lowestCommonAncestor(root, p, q) {
  function find(node, target, path) {
    if (!node) return false;
    path.push(node);
    if (node === target) return true;
    if (find(node.left, target, path) || find(node.right, target, path)) return true;
    path.pop();
    return false;
  }
  const a = [];
  const b = [];
  find(root, p, a);
  find(root, q, b);
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return a[i - 1];
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function lowestCommonAncestor(root, p, q) {
  function find(node, target, path) {
    if (!node) return false;
    path.push(node);
    if (node === target) return true;
    if (find(node.left, target, path) || find(node.right, target, path)) return true;
    path.pop();
    return false;
  }
  const a = [];
  const b = [];
  find(root, p, a);
  find(root, q, b);
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return a[i - 1];
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def lowestCommonAncestor(root, p, q):
    def find(node, target, path):
        if not node:
            return False
        path.append(node)
        if node == target:
            return True
        if find(node.left, target, path)  or  find(node.right, target, path):
            return True
        path.pop()
        return False
    a = []
    b = []
    find(root, p, a)
    find(root, q, b)
    i = 0
    while i < len(a)  and  i < len(b)  and  a[i] == b[i]:
        i += 1
    return a[i - 1]`,
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
    private boolean lowestCommonAncestor_find(TreeNode node, TreeNode target, List<Integer> path) {
        if (node == null) {
            return false;
        }
        path.add(node);
        if (node == target) {
            return true;
        }
        if (lowestCommonAncestor_find(node.left, target, path) != null || lowestCommonAncestor_find(node.right, target, path) != null) {
            return true;
        }
        path.remove(path.size()-1);
        return false;
    }

    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        List<TreeNode> a = new ArrayList<>();
        List<TreeNode> b = new ArrayList<>();
        lowestCommonAncestor_find(root, p, a);
        lowestCommonAncestor_find(root, q, b);
        int i = 0;
        while (i < a.size() && i < b.size() && a[i] == b[i]) {
            i++;
        }
        return a[i - 1];
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

bool lowestCommonAncestor_find(TreeNode* node, TreeNode* target, vector<int>& path) {
    if (!node) {
        return false;
    }
    path.push_back(node);
    if (node == target) {
        return true;
    }
    if (lowestCommonAncestor_find(node->left, target, path) || lowestCommonAncestor_find(node->right, target, path)) {
        return true;
    }
    path.back() /* then pop_back */;
    return false;
}

TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    vector<TreeNode*> a;
    vector<TreeNode*> b;
    lowestCommonAncestor_find(root, p, a);
    lowestCommonAncestor_find(root, q, b);
    int i = 0;
    while (i < a.size() && i < b.size() && a[i] == b[i]) {
        i++;
    }
    return a[i - 1];
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool lowestCommonAncestor_find(struct Node* node, struct Node* target, int* path, int* pathn) {
    if (!node) {
        return false;
    }
    path[pathn++] = node;
    if (node == target) {
        return true;
    }
    if (lowestCommonAncestor_find(node->left, target, path) || lowestCommonAncestor_find(node->right, target, path)) {
        return true;
    }
    path[--pathn];
    return false;
}

struct Node* lowestCommonAncestor(struct Node* root, struct Node* p, struct Node* q) {
    struct Node* a[10005]; int an = 0;
    struct Node* b[10005]; int bn = 0;
    lowestCommonAncestor_find(root, p, a);
    lowestCommonAncestor_find(root, q, b);
    int i = 0;
    while (i < an && i < bn && a[i] == b[i]) {
        i++;
    }
    return a[i - 1];
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(h)",
          why: "If node is null, p, or q, return node. Recurse left and right. If both sides return non-null, node is LCA. Else return the non-null side. One DFS.",
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
  return left || right;
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
  return left || right;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def lowestCommonAncestor(root, p, q):
    if not root  or  root == p  or  root == q:
        return root
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    if left  and  right:
        return root
    return left  or  right`,
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
        if (root == null || root == p || root == q) {
            return root;
        }
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) {
            return root;
        }
        return (left != null ? left : right);
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
    if (!root || root == p || root == q) {
        return root;
    }
    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);
    if (left && right) {
        return root;
    }
    return (left != nullptr ? left : right);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* lowestCommonAncestor(struct Node* root, struct Node* p, struct Node* q) {
    if (!root || root == p || root == q) {
        return root;
    }
    struct Node* left = lowestCommonAncestor(root->left, p, q);
    struct Node* right = lowestCommonAncestor(root->right, p, q);
    if (left && right) {
        return root;
    }
    return (left != NULL ? left : right);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Iterative stack builds a parent map. Collect ancestors of p in a Set. Walk q's parent chain until a node is in the set. No recursion; extra map of n parents.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function lowestCommonAncestor(root, p, q) {
  const parent = new Map();
  parent.set(root, null);
  const stack = [root];
  while (!parent.has(p) || !parent.has(q)) {
    const node = stack.pop();
    if (node.left) {
      parent.set(node.left, node);
      stack.push(node.left);
    }
    if (node.right) {
      parent.set(node.right, node);
      stack.push(node.right);
    }
  }
  const seen = new Set();
  let cur = p;
  while (cur) {
    seen.add(cur);
    cur = parent.get(cur);
  }
  cur = q;
  while (!seen.has(cur)) cur = parent.get(cur);
  return cur;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function lowestCommonAncestor(root, p, q) {
  const parent = new Map();
  parent.set(root, null);
  const stack = [root];
  while (!parent.has(p) || !parent.has(q)) {
    const node = stack.pop();
    if (node.left) {
      parent.set(node.left, node);
      stack.push(node.left);
    }
    if (node.right) {
      parent.set(node.right, node);
      stack.push(node.right);
    }
  }
  const seen = new Set();
  let cur = p;
  while (cur) {
    seen.add(cur);
    cur = parent.get(cur);
  }
  cur = q;
  while (!seen.has(cur)) cur = parent.get(cur);
  return cur;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def lowestCommonAncestor(root, p, q):
    parent = {}
    parent[root] = None
    stack = [root]
    while not (p in parent)  or  not (q in parent):
        node = stack.pop()
        if node.left:
            parent[node.left] = node
            stack.append(node.left)
        if node.right:
            parent[node.right] = node
            stack.append(node.right)
    seen = set()
    cur = p
    while cur:
        seen.add(cur)
        cur = parent.get(cur)
    cur = q
    while not (cur in seen):
        cur = parent.get(cur)
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
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        Map<TreeNode, TreeNode> parent = new HashMap<>();
        parent.put(root, null);
        List<TreeNode> stack = new ArrayList<>(); stack.add(root);
        while (!parent.contains(p) || !parent.contains(q)) {
            TreeNode node = stack.remove(stack.size()-1);
            if (node.left != null) {
                parent.put(node.left, node);
                stack.add(node.left);
            }
            if (node.right != null) {
                parent.put(node.right, node);
                stack.add(node.right);
            }
        }
        Set<TreeNode> seen = new HashSet<>();
        TreeNode cur = p;
        while (cur != null) {
            seen.add(cur);
            cur = parent.get(cur);
        }
        cur = q;
        while (!seen.contains(cur)) {
            cur = parent.get(cur);
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

TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    unordered_map<TreeNode*, TreeNode*> parent;
    parent[root] = nullptr;
    vector<TreeNode*> stack = {root};
    while (!parent.count(p) || !parent.count(q)) {
        TreeNode* node = stack.back() /* then pop_back */;
        if (node->left) {
            parent[node->left] = node;
            stack.push_back(node->left);
        }
        if (node->right) {
            parent[node->right] = node;
            stack.push_back(node->right);
        }
    }
    unordered_set<TreeNode*> seen;
    TreeNode* cur = p;
    while (cur) {
        seen.insert(cur);
        cur = parent[cur];
    }
    cur = q;
    while (!seen.count(cur)) {
        cur = parent[cur];
    }
    return cur;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* lowestCommonAncestor(struct Node* root, struct Node* p, struct Node* q) {
    struct Node* parentK[10005]; struct Node* parentV[10005]; int parentn = 0;
    parentK[parentn] = root; parentV[parentn++] = NULL;
    struct Node* stack[10005]; int stackn = 0; stack[stackn++] = root;
    while (!containsPtr(parent, parentn, p) || !containsPtr(parent, parentn, q)) {
        struct Node* node = stack[--stackn];
        if (node->left) {
            parentK[parentn] = node->left; parentV[parentn++] = node;
            stack[stackn++] = node->left;
        }
        if (node->right) {
            parentK[parentn] = node->right; parentV[parentn++] = node;
            stack[stackn++] = node->right;
        }
    }
    struct Node* seen[10005]; int seenn = 0;
    struct Node* cur = p;
    while (cur) {
        seen[seenn++] = cur;
        cur = parent[cur];
    }
    cur = q;
    while (!containsPtr(seen, seenn, cur)) {
        cur = parent[cur];
    }
    return cur;
}`
          }
        }
      ]
    },
    {
      id: 9,
      level: "intermediate",
      q: "Validate Binary Search Tree",
      ask: "Amazon · Microsoft · Meta · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/validate-binary-search-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/check-for-bst/1"}],
      a: "Return true if the tree is a valid BST: every node in the left subtree is strictly less, every node in the right subtree is strictly greater.\n\n[2,1,3] is valid. [5,1,4,null,null,3,6] is not, because 3 sits in the right subtree of 5.\n\nInorder into an array and check increasing. Recursion with (min, max) bounds. Iterative inorder tracking the previous value.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Inorder dump into an array, then check each pair is strictly increasing. Extra O(n) array.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isValidBST(root) {
  const vals = [];
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    vals.push(node.val);
    inorder(node.right);
  }
  inorder(root);
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
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    vals.push(node.val);
    inorder(node.right);
  }
  inorder(root);
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
def isValidBST(root):
    vals = []
    def inorder(node):
        if not node:
            return
        inorder(node.left)
        vals.append(node.val)
        inorder(node.right)
    inorder(root)
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
    private boolean isValidBST_inorder(TreeNode node) {
        if (node == null) {
            return;
        }
        isValidBST_inorder(node.left);
        vals.add(node.val);
        isValidBST_inorder(node.right);
    }

    public boolean isValidBST(TreeNode root) {
        List<Integer> vals = new ArrayList<>();
        isValidBST_inorder(root);
        for (int i = 1; i < vals.size(); i++) {
            if (vals[i] <= vals[i - 1]) {
                return false;
            }
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

bool isValidBST_inorder(TreeNode* node) {
    if (!node) {
        return;
    }
    isValidBST_inorder(node->left);
    vals.push_back(node->val);
    isValidBST_inorder(node->right);
}

bool isValidBST(TreeNode* root) {
    vector<int> vals;
    isValidBST_inorder(root);
    for (int i = 1; i < vals.size(); i++) {
        if (vals[i] <= vals[i - 1]) {
            return false;
        }
    }
    return true;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool isValidBST_inorder(struct Node* node) {
    if (!node) {
        return;
    }
    isValidBST_inorder(node->left);
    vals[valsn++] = node->val;
    isValidBST_inorder(node->right);
}

bool isValidBST(struct Node* root) {
    int vals[10005]; int valsn = 0;
    isValidBST_inorder(root);
    for (int i = 1; i < valsn; i++) {
        if (vals[i] <= vals[i - 1]) {
            return false;
        }
    }
    return true;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Each node must lie in (low, high). Left child gets high = node.val. Right child gets low = node.val. Use -Infinity / Infinity at the root. Recursion O(h).",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isValidBST(root) {
  function ok(node, low, high) {
    if (!node) return true;
    if (node.val <= low || node.val >= high) return false;
    return ok(node.left, low, node.val) && ok(node.right, node.val, high);
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
  function ok(node, low, high) {
    if (!node) return true;
    if (node.val <= low || node.val >= high) return false;
    return ok(node.left, low, node.val) && ok(node.right, node.val, high);
  }
  return ok(root, -Infinity, Infinity);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def isValidBST(root):
    def ok(node, low, high):
        if not node:
            return True
        if node.val <= low  or  node.val >= high:
            return False
        return ok(node.left, low, node.val)  and  ok(node.right, node.val, high)
    return ok(root, float('-inf'), float('inf'))`,
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
    private boolean isValidBST_ok(TreeNode node, int low, int high) {
        if (node == null) {
            return true;
        }
        if (node.val <= low || node.val >= high) {
            return false;
        }
        return isValidBST_ok(node.left, low, node.val) && isValidBST_ok(node.right, node.val, high);
    }

    public boolean isValidBST(TreeNode root) {
        return isValidBST_ok(root, Integer.MIN_VALUE, Integer.MAX_VALUE);
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

bool isValidBST_ok(TreeNode* node, int low, int high) {
    if (!node) {
        return true;
    }
    if (node->val <= low || node->val >= high) {
        return false;
    }
    return isValidBST_ok(node->left, low, node->val) && isValidBST_ok(node->right, node->val, high);
}

bool isValidBST(TreeNode* root) {
    return isValidBST_ok(root, INT_MIN, INT_MAX);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool isValidBST_ok(struct Node* node, int low, int high) {
    if (!node) {
        return true;
    }
    if (node->val <= low || node->val >= high) {
        return false;
    }
    return isValidBST_ok(node->left, low, node->val) && isValidBST_ok(node->right, node->val, high);
}

bool isValidBST(struct Node* root) {
    return isValidBST_ok(root, INT_MIN, INT_MAX);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Iterative inorder. prev holds the last visited value. If node.val <= prev, fail. No extra values array.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isValidBST(root) {
  const stack = [];
  let cur = root;
  let prev = -Infinity;
  let hasPrev = false;
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop();
    if (hasPrev && cur.val <= prev) return false;
    prev = cur.val;
    hasPrev = true;
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
  let prev = -Infinity;
  let hasPrev = false;
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop();
    if (hasPrev && cur.val <= prev) return false;
    prev = cur.val;
    hasPrev = true;
    cur = cur.right;
  }
  return true;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def isValidBST(root):
    stack = []
    cur = root
    prev = float('-inf')
    hasPrev = False
    while cur  or  len(stack):
        while cur:
            stack.append(cur)
            cur = cur.left
        cur = stack.pop()
        if hasPrev  and  cur.val <= prev:
            return False
        prev = cur.val
        hasPrev = True
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
        List<TreeNode> stack = new ArrayList<>();
        TreeNode cur = root;
        TreeNode prev = Integer.MIN_VALUE;
        boolean hasPrev = false;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) {
                stack.add(cur);
                cur = cur.left;
            }
            cur = stack.remove(stack.size()-1);
            if (hasPrev && cur.val <= prev) {
                return false;
            }
            prev = cur.val;
            hasPrev = true;
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
    TreeNode* prev = INT_MIN;
    bool hasPrev = false;
    while (cur || stack.size()) {
        while (cur) {
            stack.push_back(cur);
            cur = cur->left;
        }
        cur = stack.back() /* then pop_back */;
        if (hasPrev && cur->val <= prev) {
            return false;
        }
        prev = cur->val;
        hasPrev = true;
        cur = cur->right;
    }
    return true;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool isValidBST(struct Node* root) {
    struct Node* stack[10005]; int stackn = 0;
    struct Node* cur = root;
    struct Node* prev = INT_MIN;
    bool hasPrev = false;
    while (cur || stackn) {
        while (cur) {
            stack[stackn++] = cur;
            cur = cur->left;
        }
        cur = stack[--stackn];
        if (hasPrev && cur->val <= prev) {
            return false;
        }
        prev = cur->val;
        hasPrev = true;
        cur = cur->right;
    }
    return true;
}`
          }
        }
      ]
    },
    {
      id: 10,
      level: "intermediate",
      q: "Diameter of Binary Tree",
      ask: "Amazon · Google · Meta · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/diameter-of-binary-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/diameter-of-binary-tree/1"}],
      a: "Diameter is the number of edges on the longest path between any two nodes. The path may not pass through the root.\n\nA node with left height 2 and right height 1 has a path of 3 edges through that node. Take the max over all nodes.\n\nBrute recomputes height at every node, O(n²). One DFS returns height and updates diameter. Iterative postorder with a height map avoids recursion.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(h)",
          why: "At every node, diameter candidate is height(left)+height(right). height itself walks the subtree, so nested walks are quadratic on a skewed tree.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function diameterOfBinaryTree(root) {
  function height(node) {
    if (!node) return 0;
    return 1 + Math.max(height(node.left), height(node.right));
  }
  let best = 0;
  function visit(node) {
    if (!node) return;
    const through = height(node.left) + height(node.right);
    if (through > best) best = through;
    visit(node.left);
    visit(node.right);
  }
  visit(root);
  return best;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function diameterOfBinaryTree(root) {
  function height(node) {
    if (!node) return 0;
    return 1 + Math.max(height(node.left), height(node.right));
  }
  let best = 0;
  function visit(node) {
    if (!node) return;
    const through = height(node.left) + height(node.right);
    if (through > best) best = through;
    visit(node.left);
    visit(node.right);
  }
  visit(root);
  return best;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def diameterOfBinaryTree(root):
    def height(node):
        if not node:
            return 0
        return 1 + max(height(node.left), height(node.right))
    best = 0
    def visit(node):
        if not node:
            return
        through = height(node.left) + height(node.right)
        if through > best:
            best = through
        visit(node.left)
        visit(node.right)
    visit(root)
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
    private int diameterOfBinaryTree_height(TreeNode node) {
        if (node == null) {
            return 0;
        }
        return 1 + Math.max(diameterOfBinaryTree_height(node.left), diameterOfBinaryTree_height(node.right));
    }

    private int diameterOfBinaryTree_visit(TreeNode node) {
        if (node == null) {
            return;
        }
        TreeNode through = height(node.left) + height(node.right);
        if (through > best) {
            best = through;
        }
        diameterOfBinaryTree_visit(node.left);
        diameterOfBinaryTree_visit(node.right);
    }

    public int diameterOfBinaryTree(TreeNode root) {
        int best = 0;
        diameterOfBinaryTree_visit(root);
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

int diameterOfBinaryTree_height(TreeNode* node) {
    if (!node) {
        return 0;
    }
    return 1 + std::max(diameterOfBinaryTree_height(node->left), diameterOfBinaryTree_height(node->right));
}

int diameterOfBinaryTree_visit(TreeNode* node) {
    if (!node) {
        return;
    }
    TreeNode* through = height(node->left) + height(node->right);
    if (through > best) {
        best = through;
    }
    diameterOfBinaryTree_visit(node->left);
    diameterOfBinaryTree_visit(node->right);
}

int diameterOfBinaryTree(TreeNode* root) {
    int best = 0;
    diameterOfBinaryTree_visit(root);
    return best;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int diameterOfBinaryTree_height(struct Node* node) {
    if (!node) {
        return 0;
    }
    return 1 + MAX(diameterOfBinaryTree_height(node->left), diameterOfBinaryTree_height(node->right));
}

int diameterOfBinaryTree_visit(struct Node* node) {
    if (!node) {
        return;
    }
    struct Node* through = height(node->left) + height(node->right);
    if (through > best) {
        best = through;
    }
    diameterOfBinaryTree_visit(node->left);
    diameterOfBinaryTree_visit(node->right);
}

int diameterOfBinaryTree(struct Node* root) {
    int best = 0;
    diameterOfBinaryTree_visit(root);
    return best;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(h)",
          why: "DFS returns height. While returning, update best with leftHeight + rightHeight. Each node once.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function diameterOfBinaryTree(root) {
  let best = 0;
  function height(node) {
    if (!node) return 0;
    const lh = height(node.left);
    const rh = height(node.right);
    if (lh + rh > best) best = lh + rh;
    return 1 + Math.max(lh, rh);
  }
  height(root);
  return best;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function diameterOfBinaryTree(root) {
  let best = 0;
  function height(node) {
    if (!node) return 0;
    const lh = height(node.left);
    const rh = height(node.right);
    if (lh + rh > best) best = lh + rh;
    return 1 + Math.max(lh, rh);
  }
  height(root);
  return best;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def diameterOfBinaryTree(root):
    best = 0
    def height(node):
        if not node:
            return 0
        lh = height(node.left)
        rh = height(node.right)
        if lh + rh > best:
            best = lh + rh
        return 1 + max(lh, rh)
    height(root)
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
    private int diameterOfBinaryTree_height(TreeNode node) {
        if (node == null) {
            return 0;
        }
        TreeNode lh = diameterOfBinaryTree_height(node.left);
        TreeNode rh = diameterOfBinaryTree_height(node.right);
        if (lh + rh > best) {
            best = lh + rh;
        }
        return 1 + Math.max(lh, rh);
    }

    public int diameterOfBinaryTree(TreeNode root) {
        int best = 0;
        diameterOfBinaryTree_height(root);
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

int diameterOfBinaryTree_height(TreeNode* node) {
    if (!node) {
        return 0;
    }
    TreeNode* lh = diameterOfBinaryTree_height(node->left);
    TreeNode* rh = diameterOfBinaryTree_height(node->right);
    if (lh + rh > best) {
        best = lh + rh;
    }
    return 1 + std::max(lh, rh);
}

int diameterOfBinaryTree(TreeNode* root) {
    int best = 0;
    diameterOfBinaryTree_height(root);
    return best;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int diameterOfBinaryTree_height(struct Node* node) {
    if (!node) {
        return 0;
    }
    struct Node* lh = diameterOfBinaryTree_height(node->left);
    struct Node* rh = diameterOfBinaryTree_height(node->right);
    if (lh + rh > best) {
        best = lh + rh;
    }
    return 1 + MAX(lh, rh);
}

int diameterOfBinaryTree(struct Node* root) {
    int best = 0;
    diameterOfBinaryTree_height(root);
    return best;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Iterative postorder. A Map stores height after both children are done. Update diameter from those heights. No call stack; extra map of n heights.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function diameterOfBinaryTree(root) {
  if (!root) return 0;
  const stack = [root];
  const seen = new Set();
  const height = new Map();
  height.set(null, 0);
  let best = 0;
  while (stack.length) {
    const node = stack[stack.length - 1];
    if (node.left && !height.has(node.left) && !seen.has(node.left)) {
      stack.push(node.left);
      continue;
    }
    if (node.right && !height.has(node.right) && !seen.has(node.right)) {
      stack.push(node.right);
      continue;
    }
    stack.pop();
    seen.add(node);
    const lh = height.get(node.left) || 0;
    const rh = height.get(node.right) || 0;
    height.set(node, 1 + Math.max(lh, rh));
    if (lh + rh > best) best = lh + rh;
  }
  return best;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function diameterOfBinaryTree(root) {
  if (!root) return 0;
  const stack = [root];
  const seen = new Set();
  const height = new Map();
  height.set(null, 0);
  let best = 0;
  while (stack.length) {
    const node = stack[stack.length - 1];
    if (node.left && !height.has(node.left) && !seen.has(node.left)) {
      stack.push(node.left);
      continue;
    }
    if (node.right && !height.has(node.right) && !seen.has(node.right)) {
      stack.push(node.right);
      continue;
    }
    stack.pop();
    seen.add(node);
    const lh = height.get(node.left) || 0;
    const rh = height.get(node.right) || 0;
    height.set(node, 1 + Math.max(lh, rh));
    if (lh + rh > best) best = lh + rh;
  }
  return best;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def diameterOfBinaryTree(root):
    if not root:
        return 0
    stack = [root]
    seen = set()
    height = {}
    height[None] = 0
    best = 0
    while len(stack):
        node = stack[-1]
        if node.left  and  not (node.left in height)  and  not (node.left in seen):
            stack.append(node.left)
            continue
        if node.right  and  not (node.right in height)  and  not (node.right in seen):
            stack.append(node.right)
            continue
        stack.pop()
        seen.add(node)
        lh = height.get(node.left)  or  0
        rh = height.get(node.right)  or  0
        height[node] = 1 + max(lh, rh)
        if lh + rh > best:
            best = lh + rh
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
    public int diameterOfBinaryTree(TreeNode root) {
        if (root == null) {
            return 0;
        }
        List<TreeNode> stack = new ArrayList<>(); stack.add(root);
        Set<TreeNode> seen = new HashSet<>();
        Map<TreeNode, Integer> height = new HashMap<>();
        height.put(null, 0);
        int best = 0;
        while (!stack.isEmpty()) {
            TreeNode node = stack.get(stack.size()-1);
            if (node.left != null && !height.contains(node.left) && !seen.contains(node.left)) {
                stack.add(node.left);
                continue;
            }
            if (node.right != null && !height.contains(node.right) && !seen.contains(node.right)) {
                stack.add(node.right);
                continue;
            }
            stack.remove(stack.size()-1);
            seen.add(node);
            TreeNode lh = height.get(node.left) || 0;
            TreeNode rh = height.get(node.right) || 0;
            height.put(node, 1 + Math.max(lh, rh));
            if (lh + rh > best) {
                best = lh + rh;
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

int diameterOfBinaryTree(TreeNode* root) {
    if (!root) {
        return 0;
    }
    vector<TreeNode*> stack = {root};
    unordered_set<TreeNode*> seen;
    unordered_map<TreeNode*, int> height;
    height[nullptr] = 0;
    int best = 0;
    while (stack.size()) {
        TreeNode* node = stack.back();
        if (node->left && !height.count(node->left) && !seen.count(node->left)) {
            stack.push_back(node->left);
            continue;
        }
        if (node->right && !height.count(node->right) && !seen.count(node->right)) {
            stack.push_back(node->right);
            continue;
        }
        stack.back() /* then pop_back */;
        seen.insert(node);
        TreeNode* lh = height[node->left] || 0;
        TreeNode* rh = height[node->right] || 0;
        height[node] = 1 + std::max(lh, rh);
        if (lh + rh > best) {
            best = lh + rh;
        }
    }
    return best;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int diameterOfBinaryTree(struct Node* root) {
    if (!root) {
        return 0;
    }
    struct Node* stack[10005]; int stackn = 0; stack[stackn++] = root;
    struct Node* seen[10005]; int seenn = 0;
    struct Node* heightK[10005]; int heightV[10005]; int heightn = 0;
    heightK[heightn] = NULL; heightV[heightn++] = 0;
    int best = 0;
    while (stackn) {
        struct Node* node = stack[stackn - 1];
        if (node->left && !containsPtr(height, heightn, node->left) && !containsPtr(seen, seenn, node->left)) {
            stack[stackn++] = node->left;
            continue;
        }
        if (node->right && !containsPtr(height, heightn, node->right) && !containsPtr(seen, seenn, node->right)) {
            stack[stackn++] = node->right;
            continue;
        }
        stack[--stackn];
        seen[seenn++] = node;
        struct Node* lh = height[node->left] || 0;
        struct Node* rh = height[node->right] || 0;
        heightK[heightn] = node; heightV[heightn++] = 1 + MAX(lh, rh);
        if (lh + rh > best) {
            best = lh + rh;
        }
    }
    return best;
}`
          }
        }
      ]
    },
    {
      id: 11,
      level: "beginner",
      q: "Path Sum",
      ask: "Amazon · Microsoft · Apple · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/path-sum/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/root-to-leaf-path-sum/1"}],
      a: "Return true if some root-to-leaf path sums to targetSum.\n\nTree 5-4-11-2 with target 22 is true because 5+4+11+2 = 22. A node with one child is not a leaf.\n\nCollect every path sum. Recursion subtracts node.val and checks 0 at a leaf. Iterative stack stores (node, remaining).\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "DFS records every root-to-leaf path as an array, sums each, compares to target. Extra storage for all paths.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function hasPathSum(root, targetSum) {
  const sums = [];
  function go(node, path) {
    if (!node) return;
    path.push(node.val);
    if (!node.left && !node.right) {
      let s = 0;
      for (const v of path) s += v;
      sums.push(s);
    }
    go(node.left, path);
    go(node.right, path);
    path.pop();
  }
  go(root, []);
  return sums.indexOf(targetSum) !== -1;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function hasPathSum(root, targetSum) {
  const sums = [];
  function go(node, path) {
    if (!node) return;
    path.push(node.val);
    if (!node.left && !node.right) {
      let s = 0;
      for (const v of path) s += v;
      sums.push(s);
    }
    go(node.left, path);
    go(node.right, path);
    path.pop();
  }
  go(root, []);
  return sums.indexOf(targetSum) !== -1;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def hasPathSum(root, targetSum):
    sums = []
    def go(node, path):
        if not node:
            return
        path.append(node.val)
        if not node.left  and  not node.right:
            s = 0
            for v in path:
                s += v
            sums.append(s)
        go(node.left, path)
        go(node.right, path)
        path.pop()
    go(root, [])
    return (targetSum in sums)`,
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
    private boolean hasPathSum_go(TreeNode node, List<Integer> path) {
        if (node == null) {
            return;
        }
        path.add(node.val);
        if (node.left == null && node.right == null) {
            int s = 0;
            for (var v : path) {
                s += v;
            }
            sums.add(s);
        }
        hasPathSum_go(node.left, path);
        hasPathSum_go(node.right, path);
        path.remove(path.size()-1);
    }

    public boolean hasPathSum(TreeNode root, int targetSum) {
        List<Integer> sums = new ArrayList<>();
        hasPathSum_go(root, []);
        return sums.contains(targetSum);
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

bool hasPathSum_go(TreeNode* node, vector<int>& path) {
    if (!node) {
        return;
    }
    path.push_back(node->val);
    if (!node->left && !node->right) {
        int s = 0;
        for (auto v : path) {
            s += v;
        }
        sums.push_back(s);
    }
    hasPathSum_go(node->left, path);
    hasPathSum_go(node->right, path);
    path.back() /* then pop_back */;
}

bool hasPathSum(TreeNode* root, int targetSum) {
    vector<int> sums;
    hasPathSum_go(root, []);
    return find(sums.begin(), sums.end(), targetSum) != -1;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool hasPathSum_go(struct Node* node, int* path, int* pathn) {
    if (!node) {
        return;
    }
    path[pathn++] = node->val;
    if (!node->left && !node->right) {
        int s = 0;
        for (int _i = 0; _i < pathn; _i++) { struct Node* v = path[_i];
            s += v;
        }
        sums[sumsn++] = s;
    }
    hasPathSum_go(node->left, path);
    hasPathSum_go(node->right, path);
    path[--pathn];
}

bool hasPathSum(struct Node* root, int targetSum) {
    int sums[10005]; int sumsn = 0;
    hasPathSum_go(root, []);
    return /*index*/(targetSum) != -1;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Recurse with remaining. At a leaf, remaining === node.val. Else try left or right with remaining - val.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function hasPathSum(root, targetSum) {
  if (!root) return false;
  if (!root.left && !root.right) return root.val === targetSum;
  const rest = targetSum - root.val;
  return hasPathSum(root.left, rest) || hasPathSum(root.right, rest);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function hasPathSum(root, targetSum) {
  if (!root) return false;
  if (!root.left && !root.right) return root.val === targetSum;
  const rest = targetSum - root.val;
  return hasPathSum(root.left, rest) || hasPathSum(root.right, rest);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def hasPathSum(root, targetSum):
    if not root:
        return False
    if not root.left  and  not root.right:
        return root.val == targetSum
    rest = targetSum - root.val
    return hasPathSum(root.left, rest)  or  hasPathSum(root.right, rest)`,
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
    public boolean hasPathSum(TreeNode root, int targetSum) {
        if (root == null) {
            return false;
        }
        if (root.left == null && root.right == null) {
            return root.val == targetSum;
        }
        TreeNode rest = targetSum - root.val;
        return (hasPathSum(root.left, rest) != null ? hasPathSum(root.left, rest) : hasPathSum(root.right, rest));
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

bool hasPathSum(TreeNode* root, int targetSum) {
    if (!root) {
        return false;
    }
    if (!root->left && !root->right) {
        return root->val == targetSum;
    }
    TreeNode* rest = targetSum - root->val;
    return (hasPathSum(root->left, rest) != nullptr ? hasPathSum(root->left, rest) : hasPathSum(root->right, rest));
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool hasPathSum(struct Node* root, int targetSum) {
    if (!root) {
        return false;
    }
    if (!root->left && !root->right) {
        return root->val == targetSum;
    }
    struct Node* rest = targetSum - root->val;
    return (hasPathSum(root->left, rest) != NULL ? hasPathSum(root->left, rest) : hasPathSum(root->right, rest));
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Iterative stack of node plus remaining sum. Same check at leaves. No recursion.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function hasPathSum(root, targetSum) {
  if (!root) return false;
  const stack = [{ node: root, left: targetSum }];
  while (stack.length) {
    const { node, left } = stack.pop();
    if (!node.left && !node.right && node.val === left) return true;
    if (node.left) stack.push({ node: node.left, left: left - node.val });
    if (node.right) stack.push({ node: node.right, left: left - node.val });
  }
  return false;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function hasPathSum(root, targetSum) {
  if (!root) return false;
  const stack = [{ node: root, left: targetSum }];
  while (stack.length) {
    const { node, left } = stack.pop();
    if (!node.left && !node.right && node.val === left) return true;
    if (node.left) stack.push({ node: node.left, left: left - node.val });
    if (node.right) stack.push({ node: node.right, left: left - node.val });
  }
  return false;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def hasPathSum(root, targetSum):
    if not root:
        return False
    stack = [{ node: root, left: targetSum }]
    while len(stack):
        node, left = stack.pop()["node"], stack.pop()["left"]
        if not node.left  and  not node.right  and  node.val == left:
            return True
        if node.left:
            stack.append({ node: node.left, left: left - node.val })
        if node.right:
            stack.append({ node: node.right, left: left - node.val })
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
    public boolean hasPathSum(TreeNode root, int targetSum) {
        if (root == null) {
            return false;
        }
        List<Item> stack = new ArrayList<>(); stack.add(new Item([{ node: root, left: targetSum }]));
        while (!stack.isEmpty()) {
            TreeNode __it = stack.remove(stack.size()-1);
var node = __it.node; var left = __it.left;
            if (node.left == null && node.right == null && node.val == left) {
                return true;
            }
            if (node.left != null) {
                stack.add({ node: node.left, left: left - node.val });
            }
            if (node.right != null) {
                stack.add({ node: node.right, left: left - node.val });
            }
        }
        return false;
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

bool hasPathSum(TreeNode* root, int targetSum) {
    if (!root) {
        return false;
    }
    vector<pair<TreeNode*, int>> stack;
    while (stack.size()) {
        auto __it = stack.back() /* then pop_back */; TreeNode* node = __it.first; int left = __it.second;
        if (!node->left && !node->right && node->val == left) {
            return true;
        }
        if (node->left) {
            stack.push_back({ node: node->left, left: left - node->val });
        }
        if (node->right) {
            stack.push_back({ node: node->right, left: left - node->val });
        }
    }
    return false;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool hasPathSum(struct Node* root, int targetSum) {
    if (!root) {
        return false;
    }
    struct Node* stackN[10005]; int stackD[10005]; int stackn = 0;
    while (stackn) {
        /* unpack node,left */
        if (!node->left && !node->right && node->val == left) {
            return true;
        }
        if (node->left) {
            stack[stackn++] = { node: node->left, left: left - node->val };
        }
        if (node->right) {
            stack[stackn++] = { node: node->right, left: left - node->val };
        }
    }
    return false;
}`
          }
        }
      ]
    },
    {
      id: 12,
      level: "intermediate",
      q: "Flatten Binary Tree to Linked List",
      ask: "Amazon · Microsoft · Meta · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/flatten-binary-tree-to-linked-list/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/flatten-binary-tree-to-linked-list/1"}],
      a: "Flatten the tree into a right-skewed list in preorder. Every left pointer becomes null. Use the same TreeNode objects.\n\n1 with left 2 (3,4) and right 5 (6) becomes 1-2-3-4-5-6 all on the right.\n\nPreorder into an array then relink. Recursion flattens children and stitches. Morris-style: predecessor of the right subtree is the rightmost node of the left, then rotate.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Preorder collect nodes into an array. Then set each left to null and next.right to the following node. Extra array.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function flatten(root) {
  const nodes = [];
  function pre(node) {
    if (!node) return;
    nodes.push(node);
    pre(node.left);
    pre(node.right);
  }
  pre(root);
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].left = null;
    nodes[i].right = i + 1 < nodes.length ? nodes[i + 1] : null;
  }
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function flatten(root) {
  const nodes = [];
  function pre(node) {
    if (!node) return;
    nodes.push(node);
    pre(node.left);
    pre(node.right);
  }
  pre(root);
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].left = null;
    nodes[i].right = i + 1 < nodes.length ? nodes[i + 1] : null;
  }
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def flatten(root):
    nodes = []
    def pre(node):
        if not node:
            return
        nodes.append(node)
        pre(node.left)
        pre(node.right)
    pre(root)
    for i in range(len(nodes)):
        nodes[i].left = None
        nodes[i].right = (nodes[i + 1] if i + 1 < len(nodes) else None)`,
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
    private TreeNode flatten_pre(TreeNode node) {
        if (node == null) {
            return;
        }
        nodes.add(node);
        flatten_pre(node.left);
        flatten_pre(node.right);
    }

    public void flatten(TreeNode root) {
        List<TreeNode> nodes = new ArrayList<>();
        flatten_pre(root);
        for (int i = 0; i < nodes.size(); i++) {
            nodes[i].left = null;
            nodes[i].right = i + 1 < nodes.size() ? nodes[i + 1] : null;
        }
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

TreeNode* flatten_pre(TreeNode* node) {
    if (!node) {
        return;
    }
    nodes.push_back(node);
    flatten_pre(node->left);
    flatten_pre(node->right);
}

void flatten(TreeNode* root) {
    vector<TreeNode*> nodes;
    flatten_pre(root);
    for (int i = 0; i < nodes.size(); i++) {
        nodes[i].left = nullptr;
        nodes[i].right = i + 1 < nodes.size() ? nodes[i + 1] : nullptr;
    }
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* flatten_pre(struct Node* node) {
    if (!node) {
        return;
    }
    nodes[nodesn++] = node;
    flatten_pre(node->left);
    flatten_pre(node->right);
}

void flatten(struct Node* root) {
    struct Node* nodes[10005]; int nodesn = 0;
    flatten_pre(root);
    for (int i = 0; i < nodesn; i++) {
        nodes[i].left = NULL;
        nodes[i].right = i + 1 < nodesn ? nodes[i + 1] : NULL;
    }
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Recurse right, then left, keep a tail pointer of the already flattened suffix. Hang this node in front. Stack O(h).",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function flatten(root) {
  const box = { tail: null };
  function go(node) {
    if (!node) return;
    go(node.right);
    go(node.left);
    node.right = box.tail;
    node.left = null;
    box.tail = node;
  }
  go(root);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function flatten(root) {
  const box = { tail: null };
  function go(node) {
    if (!node) return;
    go(node.right);
    go(node.left);
    node.right = box.tail;
    node.left = null;
    box.tail = node;
  }
  go(root);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def flatten(root):
    box = {"tail": None}
    def go(node):
        if not node:
            return
        go(node.right)
        go(node.left)
        node.right = box["tail"]
        node.left = None
        box["tail"] = node
    go(root)`,
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
    private TreeNode flatten_go(TreeNode node) {
        if (node == null) {
            return;
        }
        flatten_go(node.right);
        flatten_go(node.left);
        node.right = box_tail;
        node.left = null;
        box_tail = node;
    }

    public void flatten(TreeNode root) {
        TreeNode box_tail = null;
        flatten_go(root);
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

TreeNode* flatten_go(TreeNode* node) {
    if (!node) {
        return;
    }
    flatten_go(node->right);
    flatten_go(node->left);
    node->right = box_tail;
    node->left = nullptr;
    box_tail = node;
}

void flatten(TreeNode* root) {
    TreeNode* box_tail = nullptr;
    flatten_go(root);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* flatten_go(struct Node* node) {
    if (!node) {
        return;
    }
    flatten_go(node->right);
    flatten_go(node->left);
    node->right = box_tail;
    node->left = NULL;
    box_tail = node;
}

void flatten(struct Node* root) {
    struct Node* box_tail = NULL;
    flatten_go(root);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "While cur exists: if it has a left, find rightmost of left, attach cur.right there, move left to right, clear left. Then cur = cur.right. No extra stack.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function flatten(root) {
  let cur = root;
  while (cur) {
    if (cur.left) {
      let pred = cur.left;
      while (pred.right) pred = pred.right;
      pred.right = cur.right;
      cur.right = cur.left;
      cur.left = null;
    }
    cur = cur.right;
  }
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function flatten(root) {
  let cur = root;
  while (cur) {
    if (cur.left) {
      let pred = cur.left;
      while (pred.right) pred = pred.right;
      pred.right = cur.right;
      cur.right = cur.left;
      cur.left = null;
    }
    cur = cur.right;
  }
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def flatten(root):
    cur = root
    while cur:
        if cur.left:
            pred = cur.left
            while pred.right:
                pred = pred.right
            pred.right = cur.right
            cur.right = cur.left
            cur.left = None
        cur = cur.right`,
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
    public void flatten(TreeNode root) {
        TreeNode cur = root;
        while (cur != null) {
            if (cur.left != null) {
                TreeNode pred = cur.left;
                while (pred.right != null) {
                    pred = pred.right;
                }
                pred.right = cur.right;
                cur.right = cur.left;
                cur.left = null;
            }
            cur = cur.right;
        }
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

void flatten(TreeNode* root) {
    TreeNode* cur = root;
    while (cur) {
        if (cur->left) {
            TreeNode* pred = cur->left;
            while (pred->right) {
                pred = pred->right;
            }
            pred->right = cur->right;
            cur->right = cur->left;
            cur->left = nullptr;
        }
        cur = cur->right;
    }
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

void flatten(struct Node* root) {
    struct Node* cur = root;
    while (cur) {
        if (cur->left) {
            struct Node* pred = cur->left;
            while (pred->right) {
                pred = pred->right;
            }
            pred->right = cur->right;
            cur->right = cur->left;
            cur->left = NULL;
        }
        cur = cur->right;
    }
}`
          }
        }
      ]
    },
    {
      id: 13,
      level: "advanced",
      q: "Serialize and Deserialize Binary Tree",
      ask: "Amazon · Google · Microsoft · Meta",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/serialize-and-deserialize-binary-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/serialize-and-deserialize-a-binary-tree/1"}],
      a: "Write functions that turn a tree into a string and back. Null children must be recorded so the shape is unique.\n\nA codec that round-trips 1 with left 2 and right 3 (3 has 4 and 5) must rebuild that exact tree.\n\nJSON of nested objects is a brute that relies on the engine. Preorder with N markers is the usual DFS codec. BFS with a queue matches how some judges print trees.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "JSON.stringify the nested {val,left,right} object and JSON.parse it back. Works for this node shape, hides the codec you are supposed to write, and is bulky.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function serialize(root) {
  return JSON.stringify(root);
}

function deserialize(data) {
  if (data === "null") return null;
  return JSON.parse(data);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function serialize(root) {
  return JSON.stringify(root);
}

function deserialize(data) {
  if (data === "null") return null;
  return JSON.parse(data);
}`,
            python: `import json

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def serialize(root):
    return json.dumps(_to_dict(root))
def deserialize(data):
    if data == "None":
        return None
    return json.loads(data)`,
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
    public String serialize(TreeNode root) {
        return stringify(root);
    }

    public TreeNode deserialize(String data) {
        if (data == "null") {
            return null;
        }
        return parse(data);
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

string serialize(TreeNode* root) {
    return stringify(root);
}

TreeNode* deserialize(string data) {
    if (data == "nullptr") {
        return nullptr;
    }
    return parse(data);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

char* serialize(struct Node* root) {
    return stringify(root);
}

struct Node* deserialize(char* data) {
    if (data == "NULL") {
        return NULL;
    }
    return parse(data);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Preorder join with commas, N for null. Deserialize consumes tokens with an index. Recursion rebuilds left then right.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function serialize(root) {
  const out = [];
  function go(node) {
    if (!node) {
      out.push("N");
      return;
    }
    out.push(String(node.val));
    go(node.left);
    go(node.right);
  }
  go(root);
  return out.join(",");
}

function deserialize(data) {
  const toks = data.split(",");
  let i = 0;
  function go() {
    const t = toks[i++];
    if (t === "N") return null;
    const node = new TreeNode(Number(t));
    node.left = go();
    node.right = go();
    return node;
  }
  return go();
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function serialize(root) {
  const out = [];
  function go(node) {
    if (!node) {
      out.push("N");
      return;
    }
    out.push(String(node.val));
    go(node.left);
    go(node.right);
  }
  go(root);
  return out.join(",");
}

function deserialize(data) {
  const toks = data.split(",");
  let i = 0;
  function go() {
    const t = toks[i++];
    if (t === "N") return null;
    const node = new TreeNode(Number(t));
    node.left = go();
    node.right = go();
    return node;
  }
  return go();
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def serialize(root):
    out = []
    def go(node):
        if not node:
            out.append("N")
            return
        out.append(str(node.val))
        go(node.left)
        go(node.right)
    go(root)
    return ",".join(out)
def deserialize(data):
    toks = data.split(",")
    i = 0
    def go():
        t = toks[i]
        i += 1
        if t == "N":
            return None
        node = TreeNode(int(t))
        node.left = go()
        node.right = go()
        return node
    return go()`,
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
    private TreeNode serialize_go(TreeNode node) {
        if (node == null) {
            out.add("N");
            return;
        }
        out.add(String.valueOf(node.val));
        serialize_go(node.left);
        serialize_go(node.right);
    }

    public String serialize(TreeNode root) {
        List<TreeNode> out = new ArrayList<>();
        serialize_go(root);
        return String.join(",", out);
    }

    private TreeNode deserialize_go() {
        int t = toks[i++];
        if (t == "N") {
            return null;
        }
        TreeNode node = new TreeNode(Integer.parseInt(t));
        node.left = deserialize_go();
        node.right = deserialize_go();
        return node;
    }

    public TreeNode deserialize(String data) {
        String toks = data.split(",");
        int i = 0;
        return deserialize_go();
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

TreeNode* serialize_go(TreeNode* node) {
    if (!node) {
        out.push_back("N");
        return;
    }
    out.push_back(to_string(node->val));
    serialize_go(node->left);
    serialize_go(node->right);
}

string serialize(TreeNode* root) {
    vector<TreeNode*> out;
    serialize_go(root);
    return join(",", out);
}

TreeNode* deserialize_go() {
    int t = toks[i++];
    if (t == "N") {
        return nullptr;
    }
    TreeNode* node = new TreeNode(stoi(t));
    node->left = deserialize_go();
    node->right = deserialize_go();
    return node;
}

TreeNode* deserialize(string data) {
    string toks = split(data, ",");
    int i = 0;
    return deserialize_go();
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* serialize_go(struct Node* node) {
    if (!node) {
        out[outn++] = "N";
        return;
    }
    out[outn++] = /*str*/(node->val);
    serialize_go(node->left);
    serialize_go(node->right);
}

char* serialize(struct Node* root) {
    struct Node* out[10005]; int outn = 0;
    serialize_go(root);
    return join(",", out);
}

struct Node* deserialize_go() {
    int t = toks[i++];
    if (t == "N") {
        return NULL;
    }
    struct Node* node = newNode(atoi(t));
    node->left = deserialize_go();
    node->right = deserialize_go();
    return node;
}

struct Node* deserialize(char* data) {
    char* toks = split(data, ",");
    int i = 0;
    return deserialize_go();
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "BFS codec: queue writes val or N level by level. Deserialize uses a queue of parents and attaches children in order. Iterative, same linear cost, no recurse on serialize/deserialize.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function serialize(root) {
  if (!root) return "N";
  const out = [];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (!node) {
      out.push("N");
      continue;
    }
    out.push(String(node.val));
    queue.push(node.left);
    queue.push(node.right);
  }
  return out.join(",");
}

function deserialize(data) {
  const toks = data.split(",");
  if (toks[0] === "N") return null;
  const root = new TreeNode(Number(toks[0]));
  const queue = [root];
  let i = 1;
  while (queue.length && i < toks.length) {
    const node = queue.shift();
    if (toks[i] !== "N") {
      node.left = new TreeNode(Number(toks[i]));
      queue.push(node.left);
    }
    i++;
    if (i < toks.length && toks[i] !== "N") {
      node.right = new TreeNode(Number(toks[i]));
      queue.push(node.right);
    }
    i++;
  }
  return root;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function serialize(root) {
  if (!root) return "N";
  const out = [];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (!node) {
      out.push("N");
      continue;
    }
    out.push(String(node.val));
    queue.push(node.left);
    queue.push(node.right);
  }
  return out.join(",");
}

function deserialize(data) {
  const toks = data.split(",");
  if (toks[0] === "N") return null;
  const root = new TreeNode(Number(toks[0]));
  const queue = [root];
  let i = 1;
  while (queue.length && i < toks.length) {
    const node = queue.shift();
    if (toks[i] !== "N") {
      node.left = new TreeNode(Number(toks[i]));
      queue.push(node.left);
    }
    i++;
    if (i < toks.length && toks[i] !== "N") {
      node.right = new TreeNode(Number(toks[i]));
      queue.push(node.right);
    }
    i++;
  }
  return root;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def serialize(root):
    if not root:
        return "N"
    out = []
    queue = [root]
    while len(queue):
        node = queue.pop(0)
        if not node:
            out.append("N")
            continue
        out.append(str(node.val))
        queue.append(node.left)
        queue.append(node.right)
    return ",".join(out)
def deserialize(data):
    toks = data.split(",")
    if toks[0] == "N":
        return None
    root = TreeNode(int(toks[0]))
    queue = [root]
    i = 1
    while len(queue)  and  i < len(toks):
        node = queue.pop(0)
        if toks[i] != "N":
            node.left = TreeNode(int(toks[i]))
            queue.append(node.left)
        i += 1
        if i < len(toks)  and  toks[i] != "N":
            node.right = TreeNode(int(toks[i]))
            queue.append(node.right)
        i += 1
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
    public String serialize(TreeNode root) {
        if (root == null) {
            return "N";
        }
        List<TreeNode> out = new ArrayList<>();
        List<TreeNode> queue = new ArrayList<>(); queue.add(root);
        while (!queue.isEmpty()) {
            TreeNode node = queue.remove(0);
            if (node == null) {
                out.add("N");
                continue;
            }
            out.add(String.valueOf(node.val));
            queue.add(node.left);
            queue.add(node.right);
        }
        return String.join(",", out);
    }

    public TreeNode deserialize(String data) {
        String toks = data.split(",");
        if (toks[0] == "N") {
            return null;
        }
        TreeNode root = new TreeNode(Integer.parseInt(toks[0]));
        List<TreeNode> queue = new ArrayList<>(); queue.add(root);
        int i = 1;
        while (!queue.isEmpty() && i < toks.size()) {
            TreeNode node = queue.remove(0);
            if (toks[i] != "N") {
                node.left = new TreeNode(Integer.parseInt(toks[i]));
                queue.add(node.left);
            }
            i++;
            if (i < toks.size() && toks[i] != "N") {
                node.right = new TreeNode(Integer.parseInt(toks[i]));
                queue.add(node.right);
            }
            i++;
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

string serialize(TreeNode* root) {
    if (!root) {
        return "N";
    }
    vector<TreeNode*> out;
    vector<TreeNode*> queue = {root};
    while (queue.size()) {
        TreeNode* node = queue.front() /* erase begin */;
        if (!node) {
            out.push_back("N");
            continue;
        }
        out.push_back(to_string(node->val));
        queue.push_back(node->left);
        queue.push_back(node->right);
    }
    return join(",", out);
}

TreeNode* deserialize(string data) {
    string toks = split(data, ",");
    if (toks[0] == "N") {
        return nullptr;
    }
    TreeNode* root = new TreeNode(stoi(toks[0]));
    vector<TreeNode*> queue = {root};
    int i = 1;
    while (queue.size() && i < toks.size()) {
        TreeNode* node = queue.front() /* erase begin */;
        if (toks[i] != "N") {
            node->left = new TreeNode(stoi(toks[i]));
            queue.push_back(node->left);
        }
        i++;
        if (i < toks.size() && toks[i] != "N") {
            node->right = new TreeNode(stoi(toks[i]));
            queue.push_back(node->right);
        }
        i++;
    }
    return root;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

char* serialize(struct Node* root) {
    if (!root) {
        return "N";
    }
    struct Node* out[10005]; int outn = 0;
    struct Node* queue[10005]; int queueh = 0, queuet = 0; queue[queuet++] = root;
    while (queuen) {
        struct Node* node = queue[queueh++];
        if (!node) {
            out[outn++] = "N";
            continue;
        }
        out[outn++] = /*str*/(node->val);
        queue[queuet++] = node->left;
        queue[queuet++] = node->right;
    }
    return join(",", out);
}

struct Node* deserialize(char* data) {
    char* toks = split(data, ",");
    if (toks[0] == "N") {
        return NULL;
    }
    struct Node* root = newNode(atoi(toks[0]));
    struct Node* queue[10005]; int queueh = 0, queuet = 0; queue[queuet++] = root;
    int i = 1;
    while (queuen && i < toksn) {
        struct Node* node = queue[queueh++];
        if (toks[i] != "N") {
            node->left = newNode(atoi(toks[i]));
            queue[queuet++] = node->left;
        }
        i++;
        if (i < toksn && toks[i] != "N") {
            node->right = newNode(atoi(toks[i]));
            queue[queuet++] = node->right;
        }
        i++;
    }
    return root;
}`
          }
        }
      ]
    },
    {
      id: 14,
      level: "intermediate",
      q: "Construct Binary Tree from Preorder and Inorder",
      ask: "Amazon · Microsoft · Google · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/construct-tree-1/1"}],
      a: "Preorder lists root then left then right. Inorder lists left then root then right. Build the unique tree. Values are unique.\n\npreorder [3,9,20,15,7] and inorder [9,3,15,20,7] rebuild the usual 3 / 9 / 20 tree.\n\nEach time search inorder linearly for the root (O(n²)). Map inorder value to index and recurse with bounds. Consume preorder with a pointer and inorder with a stop value, O(n) and no index map lookups.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(n)",
          why: "Root is preorder[0]. Scan inorder for it, slice left/right arrays, recurse. Slicing and scanning are O(n) per node.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function buildTree(preorder, inorder) {
  if (!preorder.length) return null;
  const rootVal = preorder[0];
  const root = new TreeNode(rootVal);
  const mid = inorder.indexOf(rootVal);
  root.left = buildTree(preorder.slice(1, mid + 1), inorder.slice(0, mid));
  root.right = buildTree(preorder.slice(mid + 1), inorder.slice(mid + 1));
  return root;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function buildTree(preorder, inorder) {
  if (!preorder.length) return null;
  const rootVal = preorder[0];
  const root = new TreeNode(rootVal);
  const mid = inorder.indexOf(rootVal);
  root.left = buildTree(preorder.slice(1, mid + 1), inorder.slice(0, mid));
  root.right = buildTree(preorder.slice(mid + 1), inorder.slice(mid + 1));
  return root;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def buildTree(preorder, inorder):
    if not len(preorder):
        return None
    rootVal = preorder[0]
    root = TreeNode(rootVal)
    mid = inorder.index(rootVal)
    root.left = buildTree(preorder[1:mid + 1], inorder[0:mid])
    root.right = buildTree(preorder[mid + 1):inorder[mid + 1]:]
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
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        if (preorder.isEmpty()) {
            return null;
        }
        int rootVal = preorder[0];
        TreeNode root = new TreeNode(rootVal);
        TreeNode mid = inorder.indexOf(rootVal);
        root.left = buildTree(new ArrayList<>(preorder.subList(1, mid + 1)), new ArrayList<>(inorder.subList(0, mid)));
        root.right = buildTree(new ArrayList<>(preorder.subList(mid + 1), new ArrayList<>(inorder.subList(mid + 1, inorder.size()))));
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

TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
    if (!preorder.size()) {
        return nullptr;
    }
    int rootVal = preorder[0];
    TreeNode* root = new TreeNode(rootVal);
    TreeNode* mid = find(inorder.begin(), inorder.end(), rootVal);
    root->left = buildTree(vector<int>(preorder.begin()+1, preorder.begin()+mid + 1), vector<int>(inorder.begin()+0, inorder.begin()+mid));
    root->right = buildTree(vector<int>(preorder.begin()+mid + 1), preorder.begin()+vector<int>(inorder.begin()+mid + 1, inorder.end()));
    return root;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* buildTree(int* preorder, int preordern, int* inorder, int inordern) {
    if (!preordern) {
        return NULL;
    }
    int rootVal = preorder[0];
    struct Node* root = newNode(rootVal);
    struct Node* mid = /*index*/(rootVal);
    root->left = buildTree(preorder, inorder);
    root->right = buildTree(preorder);
    return root;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "HashMap of inorder indexes. Recurse with (preL, preR, inL, inR) bounds. Each node created once; map lookup O(1).",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function buildTree(preorder, inorder) {
  const idx = new Map();
  for (let i = 0; i < inorder.length; i++) idx.set(inorder[i], i);
  function build(preL, preR, inL, inR) {
    if (preL > preR) return null;
    const root = new TreeNode(preorder[preL]);
    const mid = idx.get(root.val);
    const leftSize = mid - inL;
    root.left = build(preL + 1, preL + leftSize, inL, mid - 1);
    root.right = build(preL + leftSize + 1, preR, mid + 1, inR);
    return root;
  }
  return build(0, preorder.length - 1, 0, inorder.length - 1);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function buildTree(preorder, inorder) {
  const idx = new Map();
  for (let i = 0; i < inorder.length; i++) idx.set(inorder[i], i);
  function build(preL, preR, inL, inR) {
    if (preL > preR) return null;
    const root = new TreeNode(preorder[preL]);
    const mid = idx.get(root.val);
    const leftSize = mid - inL;
    root.left = build(preL + 1, preL + leftSize, inL, mid - 1);
    root.right = build(preL + leftSize + 1, preR, mid + 1, inR);
    return root;
  }
  return build(0, preorder.length - 1, 0, inorder.length - 1);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def buildTree(preorder, inorder):
    idx = {}
    for i in range(len(inorder)):
        idx[inorder[i]] = i
    def build(preL, preR, inL, inR):
        if preL > preR:
            return None
        root = TreeNode(preorder[preL])
        mid = idx.get(root.val)
        leftSize = mid - inL
        root.left = build(preL + 1, preL + leftSize, inL, mid - 1)
        root.right = build(preL + leftSize + 1, preR, mid + 1, inR)
        return root
    return build(0, len(preorder) - 1, 0, len(inorder) - 1)`,
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
    private TreeNode buildTree_build(int preL, int preR, int inL, int inR) {
        if (preL > preR) {
            return null;
        }
        TreeNode root = new TreeNode(preorder[preL]);
        TreeNode mid = idx.get(root.val);
        int leftSize = mid - inL;
        root.left = buildTree_build(preL + 1, preL + leftSize, inL, mid - 1);
        root.right = buildTree_build(preL + leftSize + 1, preR, mid + 1, inR);
        return root;
    }

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        Map<Integer, Integer> idx = new HashMap<>();
        for (int i = 0; i < inorder.size(); i++) {
            idx.put(inorder[i], i);
        }
        return buildTree_build(0, preorder.size() - 1, 0, inorder.size() - 1);
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

TreeNode* buildTree_build(int preL, int preR, int inL, int inR) {
    if (preL > preR) {
        return nullptr;
    }
    TreeNode* root = new TreeNode(preorder[preL]);
    TreeNode* mid = idx[root->val];
    int leftSize = mid - inL;
    root->left = buildTree_build(preL + 1, preL + leftSize, inL, mid - 1);
    root->right = buildTree_build(preL + leftSize + 1, preR, mid + 1, inR);
    return root;
}

TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
    unordered_map<int,int> idx;
    for (int i = 0; i < inorder.size(); i++) {
        idx[inorder[i]] = i;
    }
    return buildTree_build(0, preorder.size() - 1, 0, inorder.size() - 1);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* buildTree_build(int preL, int preR, int inL, int inR) {
    if (preL > preR) {
        return NULL;
    }
    struct Node* root = newNode(preorder[preL]);
    struct Node* mid = idx[root->val];
    int leftSize = mid - inL;
    root->left = buildTree_build(preL + 1, preL + leftSize, inL, mid - 1);
    root->right = buildTree_build(preL + leftSize + 1, preR, mid + 1, inR);
    return root;
}

struct Node* buildTree(int* preorder, int preordern, int* inorder, int inordern) {
    int idxK[10005], idxV[10005], idxn = 0;
    for (int i = 0; i < inordern; i++) {
        idxK[idxn] = inorder[i]; idxV[idxn++] = i;
    }
    return buildTree_build(0, preordern - 1, 0, inordern - 1);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Advance a preorder index and an inorder index. build(stop) creates a node, builds left until inorder hits this val, then right until stop. No hashmap; O(h) stack only besides the tree.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function buildTree(preorder, inorder) {
  let p = 0;
  let i = 0;
  function build(stop) {
    if (p >= preorder.length) return null;
    if (inorder[i] === stop) {
      i++;
      return null;
    }
    const root = new TreeNode(preorder[p++]);
    root.left = build(root.val);
    root.right = build(stop);
    return root;
  }
  return build();
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function buildTree(preorder, inorder) {
  let p = 0;
  let i = 0;
  function build(stop) {
    if (p >= preorder.length) return null;
    if (inorder[i] === stop) {
      i++;
      return null;
    }
    const root = new TreeNode(preorder[p++]);
    root.left = build(root.val);
    root.right = build(stop);
    return root;
  }
  return build();
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def buildTree(preorder, inorder):
    p = 0
    i = 0
    def build(stop):
        if p >= len(preorder):
            return None
        if inorder[i] == stop:
            i += 1
            return None
        root = TreeNode(preorder[p += 1])
        root.left = build(root.val)
        root.right = build(stop)
        return root
    return build()`,
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
    private TreeNode buildTree_build(int stop) {
        if (p >= preorder.size()) {
            return null;
        }
        if (inorder[i] == stop) {
            i++;
            return null;
        }
        TreeNode root = new TreeNode(preorder[p++]);
        root.left = buildTree_build(root.val);
        root.right = buildTree_build(stop);
        return root;
    }

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        TreeNode p = 0;
        int i = 0;
        return buildTree_build();
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

TreeNode* buildTree_build(int stop) {
    if (p >= preorder.size()) {
        return nullptr;
    }
    if (inorder[i] == stop) {
        i++;
        return nullptr;
    }
    TreeNode* root = new TreeNode(preorder[p++]);
    root->left = buildTree_build(root->val);
    root->right = buildTree_build(stop);
    return root;
}

TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
    TreeNode* p = 0;
    int i = 0;
    return buildTree_build();
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* buildTree_build(int stop) {
    if (p >= preordern) {
        return NULL;
    }
    if (inorder[i] == stop) {
        i++;
        return NULL;
    }
    struct Node* root = newNode(preorder[p++]);
    root->left = buildTree_build(root->val);
    root->right = buildTree_build(stop);
    return root;
}

struct Node* buildTree(int* preorder, int preordern, int* inorder, int inordern) {
    struct Node* p = 0;
    int i = 0;
    return buildTree_build();
}`
          }
        }
      ]
    },
    {
      id: 15,
      level: "intermediate",
      q: "Kth Smallest Element in a BST",
      ask: "Amazon · Google · Uber · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/kth-smallest-element-in-a-bst/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/find-k-th-smallest-element-in-bst/1"}],
      a: "Return the kth smallest value in a BST (1-based). Inorder of a BST is sorted, so the kth visit is the answer.\n\nBST 3 with left 1 (right child 2) and right 4, k = 1 yields 1.\n\nDump inorder to an array and index k-1. Recursion counts visits and stops early. Iterative inorder with a stack pops k times.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Full inorder into an array, return vals[k-1]. Always walks the whole tree.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function kthSmallest(root, k) {
  const vals = [];
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    vals.push(node.val);
    inorder(node.right);
  }
  inorder(root);
  return vals[k - 1];
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function kthSmallest(root, k) {
  const vals = [];
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    vals.push(node.val);
    inorder(node.right);
  }
  inorder(root);
  return vals[k - 1];
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def kthSmallest(root, k):
    vals = []
    def inorder(node):
        if not node:
            return
        inorder(node.left)
        vals.append(node.val)
        inorder(node.right)
    inorder(root)
    return vals[k - 1]`,
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
    private int kthSmallest_inorder(TreeNode node) {
        if (node == null) {
            return;
        }
        kthSmallest_inorder(node.left);
        vals.add(node.val);
        kthSmallest_inorder(node.right);
    }

    public int kthSmallest(TreeNode root, int k) {
        List<Integer> vals = new ArrayList<>();
        kthSmallest_inorder(root);
        return vals[k - 1];
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

int kthSmallest_inorder(TreeNode* node) {
    if (!node) {
        return;
    }
    kthSmallest_inorder(node->left);
    vals.push_back(node->val);
    kthSmallest_inorder(node->right);
}

int kthSmallest(TreeNode* root, int k) {
    vector<int> vals;
    kthSmallest_inorder(root);
    return vals[k - 1];
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int kthSmallest_inorder(struct Node* node) {
    if (!node) {
        return;
    }
    kthSmallest_inorder(node->left);
    vals[valsn++] = node->val;
    kthSmallest_inorder(node->right);
}

int kthSmallest(struct Node* root, int k) {
    int vals[10005]; int valsn = 0;
    kthSmallest_inorder(root);
    return vals[k - 1];
}`
          }
        },
        {
          name: "Optimal",
          time: "O(h+k)",
          space: "O(h)",
          why: "Recursive inorder with a counter. When count hits k, record val and stop expanding. Better when k is small.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function kthSmallest(root, k) {
  const box = { count: 0, ans: 0 };
  function go(node) {
    if (!node || box.count >= k) return;
    go(node.left);
    box.count++;
    if (box.count === k) {
      box.ans = node.val;
      return;
    }
    go(node.right);
  }
  go(root);
  return box.ans;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function kthSmallest(root, k) {
  const box = { count: 0, ans: 0 };
  function go(node) {
    if (!node || box.count >= k) return;
    go(node.left);
    box.count++;
    if (box.count === k) {
      box.ans = node.val;
      return;
    }
    go(node.right);
  }
  go(root);
  return box.ans;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def kthSmallest(root, k):
    box = {"count": 0, "ans": 0}
    def go(node):
        if not node  or  box["count"] >= k:
            return
        go(node.left)
        box["count"] += 1
        if box["count"] == k:
            box["ans"] = node.val
            return
        go(node.right)
    go(root)
    return box["ans"]`,
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
    private int kthSmallest_go(TreeNode node) {
        if (node == null || box.count >= k) {
            return;
        }
        kthSmallest_go(node.left);
        box_count++;
        if (box.count == k) {
            box_ans = node.val;
            return;
        }
        kthSmallest_go(node.right);
    }

    public int kthSmallest(TreeNode root, int k) {
        int box_count = 0;
        int box_ans = 0;
        kthSmallest_go(root);
        return box.ans;
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

int kthSmallest_go(TreeNode* node) {
    if (!node || box.count >= k) {
        return;
    }
    kthSmallest_go(node->left);
    box_count++;
    if (box.count == k) {
        box_ans = node->val;
        return;
    }
    kthSmallest_go(node->right);
}

int kthSmallest(TreeNode* root, int k) {
    int box_count = 0;
    int box_ans = 0;
    kthSmallest_go(root);
    return box.ans;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int kthSmallest_go(struct Node* node) {
    if (!node || box.count >= k) {
        return;
    }
    kthSmallest_go(node->left);
    box_count++;
    if (box.count == k) {
        box_ans = node->val;
        return;
    }
    kthSmallest_go(node->right);
}

int kthSmallest(struct Node* root, int k) {
    int box_count = 0;
    int box_ans = 0;
    kthSmallest_go(root);
    return box.ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(h+k)",
          space: "O(h)",
          why: "Iterative inorder. Each pop is the next smallest. After k pops, return that val. Easy to stop early; no extra values array.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function kthSmallest(root, k) {
  const stack = [];
  let cur = root;
  while (true) {
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop();
    k--;
    if (k === 0) return cur.val;
    cur = cur.right;
  }
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function kthSmallest(root, k) {
  const stack = [];
  let cur = root;
  while (true) {
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop();
    k--;
    if (k === 0) return cur.val;
    cur = cur.right;
  }
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def kthSmallest(root, k):
    stack = []
    cur = root
    while True:
        while cur:
            stack.append(cur)
            cur = cur.left
        cur = stack.pop()
        k -= 1
        if k == 0:
            return cur.val
        cur = cur.right`,
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
    public int kthSmallest(TreeNode root, int k) {
        List<TreeNode> stack = new ArrayList<>();
        TreeNode cur = root;
        while (true) {
            while (cur != null) {
                stack.add(cur);
                cur = cur.left;
            }
            cur = stack.remove(stack.size()-1);
            k--;
            if (k == 0) {
                return cur.val;
            }
            cur = cur.right;
        }
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

int kthSmallest(TreeNode* root, int k) {
    vector<TreeNode*> stack;
    TreeNode* cur = root;
    while (true) {
        while (cur) {
            stack.push_back(cur);
            cur = cur->left;
        }
        cur = stack.back() /* then pop_back */;
        k--;
        if (k == 0) {
            return cur->val;
        }
        cur = cur->right;
    }
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int kthSmallest(struct Node* root, int k) {
    struct Node* stack[10005]; int stackn = 0;
    struct Node* cur = root;
    while (true) {
        while (cur) {
            stack[stackn++] = cur;
            cur = cur->left;
        }
        cur = stack[--stackn];
        k--;
        if (k == 0) {
            return cur->val;
        }
        cur = cur->right;
    }
}`
          }
        }
      ]
    },
    {
      id: 16,
      level: "intermediate",
      q: "Binary Tree Right Side View",
      ask: "Amazon · Microsoft · Meta · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/binary-tree-right-side-view/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/right-view-of-binary-tree/1"}],
      a: "Return the values you see standing on the right side, top to bottom: the last node of each level.\n\n[1,2,3,null,5,null,4] yields [1,3,4]. A left child that sticks out below can appear if the right is missing.\n\nLevel-order, take the last of each row. DFS right-first: first time you reach a depth, record it. BFS that writes queue[n-1] is the compact iterative form.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Full level-order into rows, then map each row to its last value. Extra storage for every node value.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function rightSideView(root) {
  if (!root) return [];
  const levels = [];
  const queue = [root];
  while (queue.length) {
    const n = queue.length;
    const row = [];
    for (let i = 0; i < n; i++) {
      const node = queue.shift();
      row.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    levels.push(row);
  }
  return levels.map(function (row) {
    return row[row.length - 1];
  });
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function rightSideView(root) {
  if (!root) return [];
  const levels = [];
  const queue = [root];
  while (queue.length) {
    const n = queue.length;
    const row = [];
    for (let i = 0; i < n; i++) {
      const node = queue.shift();
      row.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    levels.push(row);
  }
  return levels.map(function (row) {
    return row[row.length - 1];
  });
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def rightSideView(root):
    if not root:
        return []
    levels = []
    queue = [root]
    while len(queue):
        n = len(queue)
        row = []
        for i in range(n):
            node = queue.pop(0)
            row.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        levels.append(row)
    return levels.map(function (row) {
    return row[-1];
  })`,
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
    public List<Integer> rightSideView(TreeNode root) {
        if (root == null) {
            return new ArrayList<>();
        }
        List<List<Integer>> levels = new ArrayList<>();
        List<TreeNode> queue = new ArrayList<>(); queue.add(root);
        while (!queue.isEmpty()) {
            int n = queue.size();
            List<Integer> row = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                TreeNode node = queue.remove(0);
                row.add(node.val);
                if (node.left != null) {
                    queue.add(node.left);
                }
                if (node.right != null) {
                    queue.add(node.right);
                }
            }
            levels.add(row);
        }
        return levels.stream().map(row -> row.get(row.size()-1)).toList();
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

vector<int> rightSideView(TreeNode* root) {
    if (!root) {
        return {};
    }
    vector<vector<int>> levels;
    vector<TreeNode*> queue = {root};
    while (queue.size()) {
        int n = queue.size();
        vector<int> row;
        for (int i = 0; i < n; i++) {
            TreeNode* node = queue.front() /* erase begin */;
            row.push_back(node->val);
            if (node->left) {
                queue.push_back(node->left);
            }
            if (node->right) {
                queue.push_back(node->right);
            }
        }
        levels.push_back(row);
    }
    return /* last of each row */ lastOfRows(levels);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int* rightSideView(struct Node* root) {
    if (!root) {
        return NULL; /* empty */
    }
    int levels[512][512]; int levelsn = 0; int levelssz[512];
    struct Node* queue[10005]; int queueh = 0, queuet = 0; queue[queuet++] = root;
    while (queuen) {
        int n = queuen;
        int row[10005]; int rown = 0;
        for (int i = 0; i < n; i++) {
            struct Node* node = queue[queueh++];
            row[rown++] = node->val;
            if (node->left) {
                queue[queuet++] = node->left;
            }
            if (node->right) {
                queue[queuet++] = node->right;
            }
        }
        levels[levelsn++] = row;
    }
    return /* last of each row */;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(h)",
          why: "DFS visit right child first. If depth === ans.length, this is the first node seen at that depth from the right. Recursion O(h).",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function rightSideView(root) {
  const ans = [];
  function dfs(node, d) {
    if (!node) return;
    if (d === ans.length) ans.push(node.val);
    dfs(node.right, d + 1);
    dfs(node.left, d + 1);
  }
  dfs(root, 0);
  return ans;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function rightSideView(root) {
  const ans = [];
  function dfs(node, d) {
    if (!node) return;
    if (d === ans.length) ans.push(node.val);
    dfs(node.right, d + 1);
    dfs(node.left, d + 1);
  }
  dfs(root, 0);
  return ans;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def rightSideView(root):
    ans = []
    def dfs(node, d):
        if not node:
            return
        if d == len(ans):
            ans.append(node.val)
        dfs(node.right, d + 1)
        dfs(node.left, d + 1)
    dfs(root, 0)
    return ans`,
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
    private List<Integer> rightSideView_dfs(TreeNode node, int d) {
        if (node == null) {
            return;
        }
        if (d == ans.size()) {
            ans.add(node.val);
        }
        rightSideView_dfs(node.right, d + 1);
        rightSideView_dfs(node.left, d + 1);
    }

    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> ans = new ArrayList<>();
        rightSideView_dfs(root, 0);
        return ans;
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

vector<int> rightSideView_dfs(TreeNode* node, int d) {
    if (!node) {
        return;
    }
    if (d == ans.size()) {
        ans.push_back(node->val);
    }
    rightSideView_dfs(node->right, d + 1);
    rightSideView_dfs(node->left, d + 1);
}

vector<int> rightSideView(TreeNode* root) {
    vector<int> ans;
    rightSideView_dfs(root, 0);
    return ans;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int* rightSideView_dfs(struct Node* node, int d) {
    if (!node) {
        return;
    }
    if (d == ansn) {
        ans[ansn++] = node->val;
    }
    rightSideView_dfs(node->right, d + 1);
    rightSideView_dfs(node->left, d + 1);
}

int* rightSideView(struct Node* root) {
    int ans[10005]; int ansn = 0;
    rightSideView_dfs(root, 0);
    return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(w)",
          why: "BFS. For each level of size n, the last shifted node is the right-side value. Only the answer plus the queue, no full row arrays.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function rightSideView(root) {
  if (!root) return [];
  const ans = [];
  const queue = [root];
  while (queue.length) {
    const n = queue.length;
    for (let i = 0; i < n; i++) {
      const node = queue.shift();
      if (i === n - 1) ans.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return ans;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function rightSideView(root) {
  if (!root) return [];
  const ans = [];
  const queue = [root];
  while (queue.length) {
    const n = queue.length;
    for (let i = 0; i < n; i++) {
      const node = queue.shift();
      if (i === n - 1) ans.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return ans;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def rightSideView(root):
    if not root:
        return []
    ans = []
    queue = [root]
    while len(queue):
        n = len(queue)
        for i in range(n):
            node = queue.pop(0)
            if i == n - 1:
                ans.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    return ans`,
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
    public List<Integer> rightSideView(TreeNode root) {
        if (root == null) {
            return new ArrayList<>();
        }
        List<Integer> ans = new ArrayList<>();
        List<TreeNode> queue = new ArrayList<>(); queue.add(root);
        while (!queue.isEmpty()) {
            int n = queue.size();
            for (int i = 0; i < n; i++) {
                TreeNode node = queue.remove(0);
                if (i == n - 1) {
                    ans.add(node.val);
                }
                if (node.left != null) {
                    queue.add(node.left);
                }
                if (node.right != null) {
                    queue.add(node.right);
                }
            }
        }
        return ans;
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

vector<int> rightSideView(TreeNode* root) {
    if (!root) {
        return {};
    }
    vector<int> ans;
    vector<TreeNode*> queue = {root};
    while (queue.size()) {
        int n = queue.size();
        for (int i = 0; i < n; i++) {
            TreeNode* node = queue.front() /* erase begin */;
            if (i == n - 1) {
                ans.push_back(node->val);
            }
            if (node->left) {
                queue.push_back(node->left);
            }
            if (node->right) {
                queue.push_back(node->right);
            }
        }
    }
    return ans;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int* rightSideView(struct Node* root) {
    if (!root) {
        return NULL; /* empty */
    }
    int ans[10005]; int ansn = 0;
    struct Node* queue[10005]; int queueh = 0, queuet = 0; queue[queuet++] = root;
    while (queuen) {
        int n = queuen;
        for (int i = 0; i < n; i++) {
            struct Node* node = queue[queueh++];
            if (i == n - 1) {
                ans[ansn++] = node->val;
            }
            if (node->left) {
                queue[queuet++] = node->left;
            }
            if (node->right) {
                queue[queuet++] = node->right;
            }
        }
    }
    return ans;
}`
          }
        }
      ]
    },
    {
      id: 17,
      level: "beginner",
      q: "Balanced Binary Tree",
      ask: "Amazon · Microsoft · Adobe · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/balanced-binary-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/check-for-balanced-tree-1587115620/1"}],
      a: "A tree is balanced if at every node |height(left) - height(right)| <= 1, and both subtrees are balanced. Return true or false.\n\nA complete small tree is balanced. A stick of four nodes is not.\n\nCalling height separately at every node is O(n²). A DFS that returns height or -1 on failure is O(n). Iterative postorder with a height map is the stack version.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(h)",
          why: "At each node recompute both heights and recurse isBalanced on children. Height work repeats on the same nodes.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isBalanced(root) {
  function height(node) {
    if (!node) return 0;
    return 1 + Math.max(height(node.left), height(node.right));
  }
  if (!root) return true;
  if (Math.abs(height(root.left) - height(root.right)) > 1) return false;
  return isBalanced(root.left) && isBalanced(root.right);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isBalanced(root) {
  function height(node) {
    if (!node) return 0;
    return 1 + Math.max(height(node.left), height(node.right));
  }
  if (!root) return true;
  if (Math.abs(height(root.left) - height(root.right)) > 1) return false;
  return isBalanced(root.left) && isBalanced(root.right);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def isBalanced(root):
    def height(node):
        if not node:
            return 0
        return 1 + max(height(node.left), height(node.right))
    if not root:
        return True
    if abs(height(root.left) - height(root.right)) > 1:
        return False
    return isBalanced(root.left)  and  isBalanced(root.right)`,
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
    private boolean isBalanced_height(TreeNode node) {
        if (node == null) {
            return 0;
        }
        return 1 + Math.max(isBalanced_height(node.left), isBalanced_height(node.right));
    }

    public boolean isBalanced(TreeNode root) {
        if (root == null) {
            return true;
        }
        if (Math.abs(isBalanced_height(root.left) - isBalanced_height(root.right)) > 1) {
            return false;
        }
        return isBalanced(root.left) && isBalanced(root.right);
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

bool isBalanced_height(TreeNode* node) {
    if (!node) {
        return 0;
    }
    return 1 + std::max(isBalanced_height(node->left), isBalanced_height(node->right));
}

bool isBalanced(TreeNode* root) {
    if (!root) {
        return true;
    }
    if (abs(isBalanced_height(root->left) - isBalanced_height(root->right)) > 1) {
        return false;
    }
    return isBalanced(root->left) && isBalanced(root->right);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool isBalanced_height(struct Node* node) {
    if (!node) {
        return 0;
    }
    return 1 + MAX(isBalanced_height(node->left), isBalanced_height(node->right));
}

bool isBalanced(struct Node* root) {
    if (!root) {
        return true;
    }
    if (abs(isBalanced_height(root->left) - isBalanced_height(root->right)) > 1) {
        return false;
    }
    return isBalanced(root->left) && isBalanced(root->right);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Postorder returns height. If a child is already unbalanced or |lh-rh|>1, return -1 and bubble up. One visit per node.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isBalanced(root) {
  function walk(node) {
    if (!node) return 0;
    const lh = walk(node.left);
    if (lh < 0) return -1;
    const rh = walk(node.right);
    if (rh < 0) return -1;
    if (Math.abs(lh - rh) > 1) return -1;
    return 1 + Math.max(lh, rh);
  }
  return walk(root) >= 0;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isBalanced(root) {
  function walk(node) {
    if (!node) return 0;
    const lh = walk(node.left);
    if (lh < 0) return -1;
    const rh = walk(node.right);
    if (rh < 0) return -1;
    if (Math.abs(lh - rh) > 1) return -1;
    return 1 + Math.max(lh, rh);
  }
  return walk(root) >= 0;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def isBalanced(root):
    def walk(node):
        if not node:
            return 0
        lh = walk(node.left)
        if lh < 0:
            return -1
        rh = walk(node.right)
        if rh < 0:
            return -1
        if abs(lh - rh) > 1:
            return -1
        return 1 + max(lh, rh)
    return walk(root) >= 0`,
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
    private boolean isBalanced_walk(TreeNode node) {
        if (node == null) {
            return 0;
        }
        TreeNode lh = isBalanced_walk(node.left);
        if (lh < 0) {
            return -1;
        }
        TreeNode rh = isBalanced_walk(node.right);
        if (rh < 0) {
            return -1;
        }
        if (Math.abs(lh - rh) > 1) {
            return -1;
        }
        return 1 + Math.max(lh, rh);
    }

    public boolean isBalanced(TreeNode root) {
        return isBalanced_walk(root) >= 0;
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

bool isBalanced_walk(TreeNode* node) {
    if (!node) {
        return 0;
    }
    TreeNode* lh = isBalanced_walk(node->left);
    if (lh < 0) {
        return -1;
    }
    TreeNode* rh = isBalanced_walk(node->right);
    if (rh < 0) {
        return -1;
    }
    if (abs(lh - rh) > 1) {
        return -1;
    }
    return 1 + std::max(lh, rh);
}

bool isBalanced(TreeNode* root) {
    return isBalanced_walk(root) >= 0;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool isBalanced_walk(struct Node* node) {
    if (!node) {
        return 0;
    }
    struct Node* lh = isBalanced_walk(node->left);
    if (lh < 0) {
        return -1;
    }
    struct Node* rh = isBalanced_walk(node->right);
    if (rh < 0) {
        return -1;
    }
    if (abs(lh - rh) > 1) {
        return -1;
    }
    return 1 + MAX(lh, rh);
}

bool isBalanced(struct Node* root) {
    return isBalanced_walk(root) >= 0;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Iterative postorder with a height map. After both children, check |lh-rh| and store height. No recursion.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isBalanced(root) {
  if (!root) return true;
  const stack = [root];
  const height = new Map();
  height.set(null, 0);
  while (stack.length) {
    const node = stack[stack.length - 1];
    if (node.left && !height.has(node.left)) {
      stack.push(node.left);
      continue;
    }
    if (node.right && !height.has(node.right)) {
      stack.push(node.right);
      continue;
    }
    stack.pop();
    const lh = height.get(node.left) || 0;
    const rh = height.get(node.right) || 0;
    if (Math.abs(lh - rh) > 1) return false;
    height.set(node, 1 + Math.max(lh, rh));
  }
  return true;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isBalanced(root) {
  if (!root) return true;
  const stack = [root];
  const height = new Map();
  height.set(null, 0);
  while (stack.length) {
    const node = stack[stack.length - 1];
    if (node.left && !height.has(node.left)) {
      stack.push(node.left);
      continue;
    }
    if (node.right && !height.has(node.right)) {
      stack.push(node.right);
      continue;
    }
    stack.pop();
    const lh = height.get(node.left) || 0;
    const rh = height.get(node.right) || 0;
    if (Math.abs(lh - rh) > 1) return false;
    height.set(node, 1 + Math.max(lh, rh));
  }
  return true;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def isBalanced(root):
    if not root:
        return True
    stack = [root]
    height = {}
    height[None] = 0
    while len(stack):
        node = stack[-1]
        if node.left  and  not (node.left in height):
            stack.append(node.left)
            continue
        if node.right  and  not (node.right in height):
            stack.append(node.right)
            continue
        stack.pop()
        lh = height.get(node.left)  or  0
        rh = height.get(node.right)  or  0
        if abs(lh - rh) > 1:
            return False
        height[node] = 1 + max(lh, rh)
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
    public boolean isBalanced(TreeNode root) {
        if (root == null) {
            return true;
        }
        List<TreeNode> stack = new ArrayList<>(); stack.add(root);
        Map<TreeNode, Integer> height = new HashMap<>();
        height.put(null, 0);
        while (!stack.isEmpty()) {
            TreeNode node = stack.get(stack.size()-1);
            if (node.left != null && !height.contains(node.left)) {
                stack.add(node.left);
                continue;
            }
            if (node.right != null && !height.contains(node.right)) {
                stack.add(node.right);
                continue;
            }
            stack.remove(stack.size()-1);
            TreeNode lh = height.get(node.left) || 0;
            TreeNode rh = height.get(node.right) || 0;
            if (Math.abs(lh - rh) > 1) {
                return false;
            }
            height.put(node, 1 + Math.max(lh, rh));
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

bool isBalanced(TreeNode* root) {
    if (!root) {
        return true;
    }
    vector<TreeNode*> stack = {root};
    unordered_map<TreeNode*, int> height;
    height[nullptr] = 0;
    while (stack.size()) {
        TreeNode* node = stack.back();
        if (node->left && !height.count(node->left)) {
            stack.push_back(node->left);
            continue;
        }
        if (node->right && !height.count(node->right)) {
            stack.push_back(node->right);
            continue;
        }
        stack.back() /* then pop_back */;
        TreeNode* lh = height[node->left] || 0;
        TreeNode* rh = height[node->right] || 0;
        if (abs(lh - rh) > 1) {
            return false;
        }
        height[node] = 1 + std::max(lh, rh);
    }
    return true;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool isBalanced(struct Node* root) {
    if (!root) {
        return true;
    }
    struct Node* stack[10005]; int stackn = 0; stack[stackn++] = root;
    struct Node* heightK[10005]; int heightV[10005]; int heightn = 0;
    heightK[heightn] = NULL; heightV[heightn++] = 0;
    while (stackn) {
        struct Node* node = stack[stackn - 1];
        if (node->left && !containsPtr(height, heightn, node->left)) {
            stack[stackn++] = node->left;
            continue;
        }
        if (node->right && !containsPtr(height, heightn, node->right)) {
            stack[stackn++] = node->right;
            continue;
        }
        stack[--stackn];
        struct Node* lh = height[node->left] || 0;
        struct Node* rh = height[node->right] || 0;
        if (abs(lh - rh) > 1) {
            return false;
        }
        heightK[heightn] = node; heightV[heightn++] = 1 + MAX(lh, rh);
    }
    return true;
}`
          }
        }
      ]
    },
    {
      id: 18,
      level: "intermediate",
      q: "Subtree of Another Tree",
      ask: "Amazon · Microsoft · Meta · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/subtree-of-another-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/check-if-subtree/1"}],
      a: "Return true if subRoot is the same tree as some subtree of root (shape and values).\n\nroot [3,4,5,1,2] and subRoot [4,1,2] is true. An extra child on that subtree makes it false.\n\nCollect every node and run isSameTree. DFS: isSame at this node or recurse sides. Serialize both with unique wrappers and test whether the sub string appears.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n·m)",
          space: "O(n)",
          why: "Push every node of root into an array, then isSameTree against subRoot for each. Extra array plus O(n*m) compares.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSubtree(root, subRoot) {
  function same(a, b) {
    if (!a && !b) return true;
    if (!a || !b || a.val !== b.val) return false;
    return same(a.left, b.left) && same(a.right, b.right);
  }
  const nodes = [];
  function collect(node) {
    if (!node) return;
    nodes.push(node);
    collect(node.left);
    collect(node.right);
  }
  collect(root);
  for (const node of nodes) {
    if (same(node, subRoot)) return true;
  }
  return false;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSubtree(root, subRoot) {
  function same(a, b) {
    if (!a && !b) return true;
    if (!a || !b || a.val !== b.val) return false;
    return same(a.left, b.left) && same(a.right, b.right);
  }
  const nodes = [];
  function collect(node) {
    if (!node) return;
    nodes.push(node);
    collect(node.left);
    collect(node.right);
  }
  collect(root);
  for (const node of nodes) {
    if (same(node, subRoot)) return true;
  }
  return false;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def isSubtree(root, subRoot):
    def same(a, b):
        if not a  and  not b:
            return True
        if not a  or  not b  or  a.val != b.val:
            return False
        return same(a.left, b.left)  and  same(a.right, b.right)
    nodes = []
    def collect(node):
        if not node:
            return
        nodes.append(node)
        collect(node.left)
        collect(node.right)
    collect(root)
    for node in nodes:
        if same(node, subRoot):
            return True
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
    private boolean isSubtree_same(TreeNode a, TreeNode b) {
        if (a == null && b == null) {
            return true;
        }
        if (a == null || b == null || a.val != b.val) {
            return false;
        }
        return isSubtree_same(a.left, b.left) && isSubtree_same(a.right, b.right);
    }

    private boolean isSubtree_collect(TreeNode node) {
        if (node == null) {
            return;
        }
        nodes.add(node);
        isSubtree_collect(node.left);
        isSubtree_collect(node.right);
    }

    public boolean isSubtree(TreeNode root, TreeNode subRoot) {
        List<TreeNode> nodes = new ArrayList<>();
        isSubtree_collect(root);
        for (var node : nodes) {
            if (isSubtree_same(node, subRoot)) {
                return true;
            }
        }
        return false;
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

bool isSubtree_same(TreeNode* a, TreeNode* b) {
    if (!a && !b) {
        return true;
    }
    if (!a || !b || a->val != b->val) {
        return false;
    }
    return isSubtree_same(a->left, b->left) && isSubtree_same(a->right, b->right);
}

bool isSubtree_collect(TreeNode* node) {
    if (!node) {
        return;
    }
    nodes.push_back(node);
    isSubtree_collect(node->left);
    isSubtree_collect(node->right);
}

bool isSubtree(TreeNode* root, TreeNode* subRoot) {
    vector<TreeNode*> nodes;
    isSubtree_collect(root);
    for (auto node : nodes) {
        if (isSubtree_same(node, subRoot)) {
            return true;
        }
    }
    return false;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool isSubtree_same(struct Node* a, struct Node* b) {
    if (!a && !b) {
        return true;
    }
    if (!a || !b || a->val != b->val) {
        return false;
    }
    return isSubtree_same(a->left, b->left) && isSubtree_same(a->right, b->right);
}

bool isSubtree_collect(struct Node* node) {
    if (!node) {
        return;
    }
    nodes[nodesn++] = node;
    isSubtree_collect(node->left);
    isSubtree_collect(node->right);
}

bool isSubtree(struct Node* root, struct Node* subRoot) {
    struct Node* nodes[10005]; int nodesn = 0;
    isSubtree_collect(root);
    for (int _i = 0; _i < nodesn; _i++) { struct Node* node = nodes[_i];
        if (isSubtree_same(node, subRoot)) {
            return true;
        }
    }
    return false;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n·m)",
          space: "O(h)",
          why: "No extra node list. If this node matches as a tree, true. Else try left or right. Worst case still O(n*m), typical interview code.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSubtree(root, subRoot) {
  function same(a, b) {
    if (!a && !b) return true;
    if (!a || !b || a.val !== b.val) return false;
    return same(a.left, b.left) && same(a.right, b.right);
  }
  if (!root) return false;
  if (same(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSubtree(root, subRoot) {
  function same(a, b) {
    if (!a && !b) return true;
    if (!a || !b || a.val !== b.val) return false;
    return same(a.left, b.left) && same(a.right, b.right);
  }
  if (!root) return false;
  if (same(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def isSubtree(root, subRoot):
    def same(a, b):
        if not a  and  not b:
            return True
        if not a  or  not b  or  a.val != b.val:
            return False
        return same(a.left, b.left)  and  same(a.right, b.right)
    if not root:
        return False
    if same(root, subRoot):
        return True
    return isSubtree(root.left, subRoot)  or  isSubtree(root.right, subRoot)`,
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
    private boolean isSubtree_same(TreeNode a, TreeNode b) {
        if (a == null && b == null) {
            return true;
        }
        if (a == null || b == null || a.val != b.val) {
            return false;
        }
        return isSubtree_same(a.left, b.left) && isSubtree_same(a.right, b.right);
    }

    public boolean isSubtree(TreeNode root, TreeNode subRoot) {
        if (root == null) {
            return false;
        }
        if (isSubtree_same(root, subRoot)) {
            return true;
        }
        return (isSubtree(root.left, subRoot) != null ? isSubtree(root.left, subRoot) : isSubtree(root.right, subRoot));
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

bool isSubtree_same(TreeNode* a, TreeNode* b) {
    if (!a && !b) {
        return true;
    }
    if (!a || !b || a->val != b->val) {
        return false;
    }
    return isSubtree_same(a->left, b->left) && isSubtree_same(a->right, b->right);
}

bool isSubtree(TreeNode* root, TreeNode* subRoot) {
    if (!root) {
        return false;
    }
    if (isSubtree_same(root, subRoot)) {
        return true;
    }
    return (isSubtree(root->left, subRoot) != nullptr ? isSubtree(root->left, subRoot) : isSubtree(root->right, subRoot));
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool isSubtree_same(struct Node* a, struct Node* b) {
    if (!a && !b) {
        return true;
    }
    if (!a || !b || a->val != b->val) {
        return false;
    }
    return isSubtree_same(a->left, b->left) && isSubtree_same(a->right, b->right);
}

bool isSubtree(struct Node* root, struct Node* subRoot) {
    if (!root) {
        return false;
    }
    if (isSubtree_same(root, subRoot)) {
        return true;
    }
    return (isSubtree(root->left, subRoot) != NULL ? isSubtree(root->left, subRoot) : isSubtree(root->right, subRoot));
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n+m)",
          space: "O(n+m)",
          why: "Serialize with parentheses so each subtree is a unique string. Check whether ser(subRoot) is a substring of ser(root). Linear in the size of the strings (and typical includes).",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSubtree(root, subRoot) {
  function ser(node) {
    if (!node) return "N";
    return "(" + node.val + "," + ser(node.left) + "," + ser(node.right) + ")";
  }
  return ser(root).indexOf(ser(subRoot)) !== -1;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSubtree(root, subRoot) {
  function ser(node) {
    if (!node) return "N";
    return "(" + node.val + "," + ser(node.left) + "," + ser(node.right) + ")";
  }
  return ser(root).indexOf(ser(subRoot)) !== -1;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def isSubtree(root, subRoot):
    def ser(node):
        if not node:
            return "N"
        return "(" + node.val + "," + ser(node.left) + "," + ser(node.right) + ")"
    return ser(subRoot) in ser(root)`,
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
    private boolean isSubtree_ser(TreeNode node) {
        if (node == null) {
            return "N";
        }
        return "(" + node.val + "," + isSubtree_ser(node.left) + "," + isSubtree_ser(node.right) + ")";
    }

    public boolean isSubtree(TreeNode root, TreeNode subRoot) {
        return isSubtree_ser(root).indexOf(isSubtree_ser(subRoot)) != -1;
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

bool isSubtree_ser(TreeNode* node) {
    if (!node) {
        return "N";
    }
    return "(" + node->val + "," + isSubtree_ser(node->left) + "," + isSubtree_ser(node->right) + ")";
}

bool isSubtree(TreeNode* root, TreeNode* subRoot) {
    return isSubtree_ser(root).indexOf(isSubtree_ser(subRoot)) != -1;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool isSubtree_ser(struct Node* node) {
    if (!node) {
        return "N";
    }
    return "(" + node->val + "," + isSubtree_ser(node->left) + "," + isSubtree_ser(node->right) + ")";
}

bool isSubtree(struct Node* root, struct Node* subRoot) {
    return isSubtree_ser(root).indexOf(isSubtree_ser(subRoot)) != -1;
}`
          }
        }
      ]
    },
    {
      id: 19,
      level: "advanced",
      q: "Binary Tree Maximum Path Sum",
      ask: "Amazon · Microsoft · Google · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/binary-tree-maximum-path-sum/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/maximum-path-sum-from-any-node/1"}],
      a: "A path is any node-to-node walk with no node repeated. Return the maximum sum of node values on such a path. Nodes may be negative, so a single node can win.\n\n[1,2,3] yields 6 (2+1+3). A node can use both children in the answer, but the value returned to the parent can continue only one side (or none).\n\nBrute recomputes downward gain at every node. One DFS returns gain and updates a best through-node sum. Returning {gain, best} avoids a shared mutable box.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(h)",
          why: "At each node, maxDown on left and right is computed from scratch, then visit children. Nested tree walks.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function maxPathSum(root) {
  function maxDown(node) {
    if (!node) return 0;
    return node.val + Math.max(0, maxDown(node.left), maxDown(node.right));
  }
  let best = -Infinity;
  function visit(node) {
    if (!node) return;
    const left = Math.max(0, maxDown(node.left));
    const right = Math.max(0, maxDown(node.right));
    const through = node.val + left + right;
    if (through > best) best = through;
    visit(node.left);
    visit(node.right);
  }
  visit(root);
  return best;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function maxPathSum(root) {
  function maxDown(node) {
    if (!node) return 0;
    return node.val + Math.max(0, maxDown(node.left), maxDown(node.right));
  }
  let best = -Infinity;
  function visit(node) {
    if (!node) return;
    const left = Math.max(0, maxDown(node.left));
    const right = Math.max(0, maxDown(node.right));
    const through = node.val + left + right;
    if (through > best) best = through;
    visit(node.left);
    visit(node.right);
  }
  visit(root);
  return best;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def maxPathSum(root):
    def maxDown(node):
        if not node:
            return 0
        return node.val + max(0, maxDown(node.left), maxDown(node.right))
    best = float('-inf')
    def visit(node):
        if not node:
            return
        left = max(0, maxDown(node.left))
        right = max(0, maxDown(node.right))
        through = node.val + left + right
        if through > best:
            best = through
        visit(node.left)
        visit(node.right)
    visit(root)
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
    private int maxPathSum_maxDown(TreeNode node) {
        if (node == null) {
            return 0;
        }
        return node.val + Math.max(0, maxPathSum_maxDown(node.left), maxPathSum_maxDown(node.right));
    }

    private int maxPathSum_visit(TreeNode node) {
        if (node == null) {
            return;
        }
        TreeNode left = Math.max(0, maxDown(node.left));
        TreeNode right = Math.max(0, maxDown(node.right));
        int through = node.val + left + right;
        if (through > best) {
            best = through;
        }
        maxPathSum_visit(node.left);
        maxPathSum_visit(node.right);
    }

    public int maxPathSum(TreeNode root) {
        int best = Integer.MIN_VALUE;
        maxPathSum_visit(root);
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

int maxPathSum_maxDown(TreeNode* node) {
    if (!node) {
        return 0;
    }
    return node->val + std::max(0, maxPathSum_maxDown(node->left), maxPathSum_maxDown(node->right));
}

int maxPathSum_visit(TreeNode* node) {
    if (!node) {
        return;
    }
    TreeNode* left = std::max(0, maxDown(node->left));
    TreeNode* right = std::max(0, maxDown(node->right));
    int through = node->val + left + right;
    if (through > best) {
        best = through;
    }
    maxPathSum_visit(node->left);
    maxPathSum_visit(node->right);
}

int maxPathSum(TreeNode* root) {
    int best = INT_MIN;
    maxPathSum_visit(root);
    return best;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int maxPathSum_maxDown(struct Node* node) {
    if (!node) {
        return 0;
    }
    return node->val + MAX(0, maxPathSum_maxDown(node->left), maxPathSum_maxDown(node->right));
}

int maxPathSum_visit(struct Node* node) {
    if (!node) {
        return;
    }
    struct Node* left = MAX(0, maxDown(node->left));
    struct Node* right = MAX(0, maxDown(node->right));
    int through = node->val + left + right;
    if (through > best) {
        best = through;
    }
    maxPathSum_visit(node->left);
    maxPathSum_visit(node->right);
}

int maxPathSum(struct Node* root) {
    int best = INT_MIN;
    maxPathSum_visit(root);
    return best;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(h)",
          why: "gain(node) = val + max(0, gain(left), gain(right)) for continuing up. Through-node sum updates a boxed best. One DFS.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function maxPathSum(root) {
  let best = -Infinity;
  function gain(node) {
    if (!node) return 0;
    const left = Math.max(0, gain(node.left));
    const right = Math.max(0, gain(node.right));
    const through = node.val + left + right;
    if (through > best) best = through;
    return node.val + Math.max(left, right);
  }
  gain(root);
  return best;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function maxPathSum(root) {
  let best = -Infinity;
  function gain(node) {
    if (!node) return 0;
    const left = Math.max(0, gain(node.left));
    const right = Math.max(0, gain(node.right));
    const through = node.val + left + right;
    if (through > best) best = through;
    return node.val + Math.max(left, right);
  }
  gain(root);
  return best;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def maxPathSum(root):
    best = float('-inf')
    def gain(node):
        if not node:
            return 0
        left = max(0, gain(node.left))
        right = max(0, gain(node.right))
        through = node.val + left + right
        if through > best:
            best = through
        return node.val + max(left, right)
    gain(root)
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
    private int maxPathSum_gain(TreeNode node) {
        if (node == null) {
            return 0;
        }
        TreeNode left = Math.max(0, maxPathSum_gain(node.left));
        TreeNode right = Math.max(0, maxPathSum_gain(node.right));
        int through = node.val + left + right;
        if (through > best) {
            best = through;
        }
        return node.val + Math.max(left, right);
    }

    public int maxPathSum(TreeNode root) {
        int best = Integer.MIN_VALUE;
        maxPathSum_gain(root);
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

int maxPathSum_gain(TreeNode* node) {
    if (!node) {
        return 0;
    }
    TreeNode* left = std::max(0, maxPathSum_gain(node->left));
    TreeNode* right = std::max(0, maxPathSum_gain(node->right));
    int through = node->val + left + right;
    if (through > best) {
        best = through;
    }
    return node->val + std::max(left, right);
}

int maxPathSum(TreeNode* root) {
    int best = INT_MIN;
    maxPathSum_gain(root);
    return best;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int maxPathSum_gain(struct Node* node) {
    if (!node) {
        return 0;
    }
    struct Node* left = MAX(0, maxPathSum_gain(node->left));
    struct Node* right = MAX(0, maxPathSum_gain(node->right));
    int through = node->val + left + right;
    if (through > best) {
        best = through;
    }
    return node->val + MAX(left, right);
}

int maxPathSum(struct Node* root) {
    int best = INT_MIN;
    maxPathSum_gain(root);
    return best;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Same linear DFS, but dfs returns {gain, best} so there is no outer mutable. Parent combines through, left.best, and right.best. Cleaner to reason about.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function maxPathSum(root) {
  function dfs(node) {
    if (!node) return { gain: 0, best: -Infinity };
    const L = dfs(node.left);
    const R = dfs(node.right);
    const left = Math.max(0, L.gain);
    const right = Math.max(0, R.gain);
    const through = node.val + left + right;
    const gain = node.val + Math.max(left, right);
    const best = Math.max(through, L.best, R.best);
    return { gain: gain, best: best };
  }
  return dfs(root).best;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function maxPathSum(root) {
  function dfs(node) {
    if (!node) return { gain: 0, best: -Infinity };
    const L = dfs(node.left);
    const R = dfs(node.right);
    const left = Math.max(0, L.gain);
    const right = Math.max(0, R.gain);
    const through = node.val + left + right;
    const gain = node.val + Math.max(left, right);
    const best = Math.max(through, L.best, R.best);
    return { gain: gain, best: best };
  }
  return dfs(root).best;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def maxPathSum(root):
    def dfs(node):
        if not node:
            return {"gain": 0, "best": float('-inf')}
        L = dfs(node.left)
        R = dfs(node.right)
        left = max(0, L["gain"])
        right = max(0, R["gain"])
        through = node.val + left + right
        gain = node.val + max(left, right)
        best = max(through, L["best"], R["best"])
        return {"gain": gain, "best": best}
    return dfs(root)["best"]`,
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
    private int maxPathSum_dfs(TreeNode node) {
        if (node == null) {
            return new int[]{0, Integer.MIN_VALUE};
        }
        TreeNode L = maxPathSum_dfs(node.left);
        TreeNode R = maxPathSum_dfs(node.right);
        TreeNode left = Math.max(0, L.gain);
        TreeNode right = Math.max(0, R.gain);
        int through = node.val + left + right;
        int gain = node.val + Math.max(left, right);
        int best = Math.max(through, L.best, R.best);
        return new int[]{gain, best};
    }

    public int maxPathSum(TreeNode root) {
        return maxPathSum_dfs(root).best;
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

int maxPathSum_dfs(TreeNode* node) {
    if (!node) {
        return {0, INT_MIN};
    }
    TreeNode* L = maxPathSum_dfs(node->left);
    TreeNode* R = maxPathSum_dfs(node->right);
    TreeNode* left = std::max(0, L.gain);
    TreeNode* right = std::max(0, R.gain);
    int through = node->val + left + right;
    int gain = node->val + std::max(left, right);
    int best = std::max(through, L.best, R.best);
    return {gain, best};
}

int maxPathSum(TreeNode* root) {
    return maxPathSum_dfs(root).best;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int maxPathSum_dfs(struct Node* node) {
    if (!node) {
        /* return gain,best */
    }
    struct Node* L = maxPathSum_dfs(node->left);
    struct Node* R = maxPathSum_dfs(node->right);
    struct Node* left = MAX(0, L.gain);
    struct Node* right = MAX(0, R.gain);
    int through = node->val + left + right;
    int gain = node->val + MAX(left, right);
    int best = MAX(through, L.best, R.best);
    /* return gain,best */
}

int maxPathSum(struct Node* root) {
    return maxPathSum_dfs(root).best;
}`
          }
        }
      ]
    },
    {
      id: 20,
      level: "intermediate",
      q: "Count Complete Tree Nodes",
      ask: "Amazon · Google · Microsoft · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/count-complete-tree-nodes/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/count-complete-tree-nodes/"}],
      a: "Count nodes in a complete binary tree: every level full except possibly the last, which is filled left to right. Naive O(n) is accepted; the trick is O(log² n).\n\nA perfect tree of height h has 2^h - 1 nodes. If left height equals right height, the subtree is perfect. Otherwise add 1 and recurse both sides.\n\nVisit everyone. Recurse with the perfect-tree shortcut. Binary search which nodes exist on the last level.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(h)",
          why: "Classic 1 + count(left) + count(right). Ignores the complete-tree promise. Fine for small n.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function countNodes(root) {
  if (!root) return 0;
  return 1 + countNodes(root.left) + countNodes(root.right);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function countNodes(root) {
  if (!root) return 0;
  return 1 + countNodes(root.left) + countNodes(root.right);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def countNodes(root):
    if not root:
        return 0
    return 1 + countNodes(root.left) + countNodes(root.right)`,
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
    public int countNodes(TreeNode root) {
        if (root == null) {
            return 0;
        }
        return 1 + countNodes(root.left) + countNodes(root.right);
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

int countNodes(TreeNode* root) {
    if (!root) {
        return 0;
    }
    return 1 + countNodes(root->left) + countNodes(root->right);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int countNodes(struct Node* root) {
    if (!root) {
        return 0;
    }
    return 1 + countNodes(root->left) + countNodes(root->right);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(log² n)",
          space: "O(log n)",
          why: "Measure leftmost and rightmost depths. If equal, subtree is perfect: (1 << h) - 1. Else 1 + count(left) + count(right). Each level does O(log n) height work.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function countNodes(root) {
  if (!root) return 0;
  let lh = 0;
  let rh = 0;
  let l = root;
  let r = root;
  while (l) {
    lh++;
    l = l.left;
  }
  while (r) {
    rh++;
    r = r.right;
  }
  if (lh === rh) return (1 << lh) - 1;
  return 1 + countNodes(root.left) + countNodes(root.right);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function countNodes(root) {
  if (!root) return 0;
  let lh = 0;
  let rh = 0;
  let l = root;
  let r = root;
  while (l) {
    lh++;
    l = l.left;
  }
  while (r) {
    rh++;
    r = r.right;
  }
  if (lh === rh) return (1 << lh) - 1;
  return 1 + countNodes(root.left) + countNodes(root.right);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def countNodes(root):
    if not root:
        return 0
    lh = 0
    rh = 0
    l = root
    r = root
    while l:
        lh += 1
        l = l.left
    while r:
        rh += 1
        r = r.right
    if lh == rh:
        return (1 << lh) - 1
    return 1 + countNodes(root.left) + countNodes(root.right)`,
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
    public int countNodes(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int lh = 0;
        int rh = 0;
        TreeNode l = root;
        TreeNode r = root;
        while (l) {
            lh++;
            l = l.left;
        }
        while (r) {
            rh++;
            r = r.right;
        }
        if (lh == rh) {
            return (1 << lh) - 1;
        }
        return 1 + countNodes(root.left) + countNodes(root.right);
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

int countNodes(TreeNode* root) {
    if (!root) {
        return 0;
    }
    int lh = 0;
    int rh = 0;
    TreeNode* l = root;
    TreeNode* r = root;
    while (l) {
        lh++;
        l = l->left;
    }
    while (r) {
        rh++;
        r = r->right;
    }
    if (lh == rh) {
        return (1 << lh) - 1;
    }
    return 1 + countNodes(root->left) + countNodes(root->right);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int countNodes(struct Node* root) {
    if (!root) {
        return 0;
    }
    int lh = 0;
    int rh = 0;
    struct Node* l = root;
    struct Node* r = root;
    while (l) {
        lh++;
        l = l->left;
    }
    while (r) {
        rh++;
        r = r->right;
    }
    if (lh == rh) {
        return (1 << lh) - 1;
    }
    return 1 + countNodes(root->left) + countNodes(root->right);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(log² n)",
          space: "O(1)",
          why: "Height of leftmost path, then binary search the last level: exists(index) walks h-1 bits from the root. Count = full upper levels + how many last-level nodes exist. Iterative, O(1) extra besides the tree.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function countNodes(root) {
  if (!root) return 0;
  function leftHeight(node) {
    let h = 0;
    while (node) {
      h++;
      node = node.left;
    }
    return h;
  }
  function exists(index, h, node) {
    let lo = 0;
    let hi = (1 << (h - 1)) - 1;
    for (let i = 0; i < h - 1; i++) {
      const mid = Math.floor((lo + hi) / 2);
      if (index <= mid) {
        node = node.left;
        hi = mid;
      } else {
        node = node.right;
        lo = mid + 1;
      }
    }
    return !!node;
  }
  const h = leftHeight(root);
  const lastCount = 1 << (h - 1);
  let lo = 0;
  let hi = lastCount - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (exists(mid, h, root)) lo = mid + 1;
    else hi = mid - 1;
  }
  return lastCount - 1 + lo;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function countNodes(root) {
  if (!root) return 0;
  function leftHeight(node) {
    let h = 0;
    while (node) {
      h++;
      node = node.left;
    }
    return h;
  }
  function exists(index, h, node) {
    let lo = 0;
    let hi = (1 << (h - 1)) - 1;
    for (let i = 0; i < h - 1; i++) {
      const mid = Math.floor((lo + hi) / 2);
      if (index <= mid) {
        node = node.left;
        hi = mid;
      } else {
        node = node.right;
        lo = mid + 1;
      }
    }
    return !!node;
  }
  const h = leftHeight(root);
  const lastCount = 1 << (h - 1);
  let lo = 0;
  let hi = lastCount - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (exists(mid, h, root)) lo = mid + 1;
    else hi = mid - 1;
  }
  return lastCount - 1 + lo;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def countNodes(root):
    if not root:
        return 0
    def leftHeight(node):
        h = 0
        while node:
            h += 1
            node = node.left
        return h
    def exists(index, h, node):
        lo = 0
        hi = (1 << (h - 1)) - 1
        for i in range(h - 1):
            mid = ((lo + hi) / 2)
            if index <= mid:
                node = node.left
                hi = mid
            else:
                node = node.right
                lo = mid + 1
        return !not node
    h = leftHeight(root)
    lastCount = 1 << (h - 1)
    lo = 0
    hi = lastCount - 1
    while lo <= hi:
        mid = ((lo + hi) / 2)
        if exists(mid, h, root):
            lo = mid + 1
        else:
            hi = mid - 1
    return lastCount - 1 + lo`,
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
    private int countNodes_leftHeight(TreeNode node) {
        int h = 0;
        while (node != null) {
            h++;
            node = node.left;
        }
        return h;
    }

    private boolean countNodes_exists(int index, int h, TreeNode node) {
        int lo = 0;
        int hi = (1 << (h - 1)) - 1;
        for (int i = 0; i < h - 1; i++) {
            TreeNode mid = ((lo + hi) / 2);
            if (index <= mid) {
                node = node.left;
                hi = mid;
            }
            else {
                node = node.right;
                lo = mid + 1;
            }
        }
        return node;
    }

    public int countNodes(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int h = countNodes_leftHeight(root);
        int lastCount = 1 << (h - 1);
        int lo = 0;
        int hi = lastCount - 1;
        while (lo <= hi) {
            TreeNode mid = ((lo + hi) / 2);
            if (countNodes_exists(mid, h, root)) {
                lo = mid + 1;
            }
            else {
                hi = mid - 1;
            }
        }
        return lastCount - 1 + lo;
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

int countNodes_leftHeight(TreeNode* node) {
    int h = 0;
    while (node) {
        h++;
        node = node->left;
    }
    return h;
}

bool countNodes_exists(int index, int h, TreeNode* node) {
    int lo = 0;
    int hi = (1 << (h - 1)) - 1;
    for (int i = 0; i < h - 1; i++) {
        TreeNode* mid = ((lo + hi) / 2);
        if (index <= mid) {
            node = node->left;
            hi = mid;
        }
        else {
            node = node->right;
            lo = mid + 1;
        }
    }
    return node;
}

int countNodes(TreeNode* root) {
    if (!root) {
        return 0;
    }
    int h = countNodes_leftHeight(root);
    int lastCount = 1 << (h - 1);
    int lo = 0;
    int hi = lastCount - 1;
    while (lo <= hi) {
        TreeNode* mid = ((lo + hi) / 2);
        if (countNodes_exists(mid, h, root)) {
            lo = mid + 1;
        }
        else {
            hi = mid - 1;
        }
    }
    return lastCount - 1 + lo;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

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

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int countNodes_leftHeight(struct Node* node) {
    int h = 0;
    while (node) {
        h++;
        node = node->left;
    }
    return h;
}

bool countNodes_exists(int index, int h, struct Node* node) {
    int lo = 0;
    int hi = (1 << (h - 1)) - 1;
    for (int i = 0; i < h - 1; i++) {
        struct Node* mid = ((lo + hi) / 2);
        if (index <= mid) {
            node = node->left;
            hi = mid;
        }
        else {
            node = node->right;
            lo = mid + 1;
        }
    }
    return node;
}

int countNodes(struct Node* root) {
    if (!root) {
        return 0;
    }
    int h = countNodes_leftHeight(root);
    int lastCount = 1 << (h - 1);
    int lo = 0;
    int hi = lastCount - 1;
    while (lo <= hi) {
        struct Node* mid = ((lo + hi) / 2);
        if (countNodes_exists(mid, h, root)) {
            lo = mid + 1;
        }
        else {
            hi = mid - 1;
        }
    }
    return lastCount - 1 + lo;
}`
          }
        }
      ]
    },
    {
      id: 21,
      level: "intermediate",
      q: "Binary Tree Zigzag Level Order Traversal",
      ask: "Amazon · Microsoft · Meta · Uber",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/zigzag-tree-traversal/1"}],
      a: "Return node values by level, but alternate direction: left-to-right, then right-to-left, and so on.\n\nNormal BFS already groups by level. Reverse every odd row, or use a deque and flip which end you pop from.\n\nBrute is BFS then reverse odd rows. Optimal fills each row from the correct end with a deque. More optimal is DFS that inserts at depth, reversing later or inserting at index 0 on odd depths.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Level-order into lists. Reverse rows whose index is odd. Extra reverse pass per odd level.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function zigzagLevelOrder(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function zigzagLevelOrder(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def zigzag_level_order(root):
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
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
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

vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
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

int** zigzagLevelOrder(struct Node* root, int* returnSize, int** returnColumnSizes) {
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
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Deque of nodes. Even levels poll from the front and offer children left-then-right at the back. Odd levels poll from the back and offer children right-then-left at the front.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function zigzagLevelOrder(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function zigzagLevelOrder(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def zigzag_level_order(root):
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
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
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

vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
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

int** zigzagLevelOrder(struct Node* root, int* returnSize, int** returnColumnSizes) {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(h)",
          why: "DFS with depth. Append a new list when you first reach a depth. Push on even depths, unshift on odd depths. Recursion stack only.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function zigzagLevelOrder(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function zigzagLevelOrder(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def zigzag_level_order(root):
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
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
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

void goZig(TreeNode* node, int d, vector<vector<int>>& out) {
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

void goZig(struct Node* node, int d, int rows[][256], int* cols, int* rc) {
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
          }
        }
      ]
    },
    {
      id: 22,
      level: "intermediate",
      q: "Binary Tree Vertical Order Traversal",
      ask: "Meta · Amazon · Microsoft · Google",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/print-a-binary-tree-in-vertical-order/1"}],
      a: "Group nodes by column (horizontal distance). Root is column 0, left is -1, right is +1. Within a column, go top to bottom; LeetCode also sorts by value when two nodes share a row and column. GFG prints left-to-right in BFS order without that extra sort.\n\nBrute DFS records (col, row, val) then sorts. Optimal BFS into a map of columns. More optimal tracks min/max column and uses an array instead of a tree map.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n log n)",
          space: "O(n)",
          why: "DFS push [col, row, val]. Sort by col, then row, then val. Group into lists. Matches LeetCode 987.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function verticalTraversal(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function verticalTraversal(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def vertical_traversal(root):
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
    public List<List<Integer>> verticalTraversal(TreeNode root) {
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

vector<vector<int>> verticalTraversal(TreeNode* root) {
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

typedef struct { int col, row, val; } Item;
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
          }
        },
        {
          name: "Optimal",
          time: "O(n log w)",
          space: "O(n)",
          why: "BFS so row order is natural. TreeMap / sorted map of columns. GFG order (no value sort). w is the number of columns.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function verticalOrder(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function verticalOrder(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def vertical_order(root):
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
    public List<List<Integer>> verticalOrder(TreeNode root) {
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

vector<vector<int>> verticalOrder(TreeNode* root) {
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

int** verticalOrder(struct Node* root, int* returnSize, int** returnColumnSizes) {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Same BFS. Record min and max hd, then emit columns in a plain loop. No log w map.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function verticalOrder(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function verticalOrder(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def vertical_order(root):
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
    public List<List<Integer>> verticalOrder(TreeNode root) {
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

vector<vector<int>> verticalOrder(TreeNode* root) {
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

int** verticalOrder(struct Node* root, int* returnSize, int** returnColumnSizes) {
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
          }
        }
      ]
    },
    {
      id: 23,
      level: "intermediate",
      q: "Boundary Traversal of Binary Tree",
      ask: "Amazon · Microsoft · Google · Uber",
      links: [{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/boundary-traversal-of-binary-tree/1"},{"name":"GFG","url":"https://www.geeksforgeeks.org/boundary-traversal-of-binary-tree/"}],
      a: "Print the boundary anti-clockwise: root, left boundary (top to bottom, no leaves), all leaves left to right, right boundary (bottom to top, no leaves). Do not print the root twice on a one-node tree.\n\nLeft boundary is the walk that prefers left, then right if left is missing. Right boundary prefers right. Leaves are a standard DFS.\n\nBrute marks every node with flags. Optimal is three dedicated walks. More optimal is one DFS with (isLeftBound, isRightBound, isLeaf) flags.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Collect all nodes with (isLeft, isRight, isLeaf). Then emit left bound, leaves, reverse right bound, skipping duplicates via a seen set.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function boundaryTraversal(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function boundaryTraversal(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def boundary_traversal(root):
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
    boolean isLeaf(TreeNode n) { return n != null && n.left == null && n.right == null; }
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

bool isLeaf(TreeNode* n) { return n && !n->left && !n->right; }
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

int isLeaf(struct Node* n) { return n && !n->left && !n->right; }
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
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Three passes: left edge (stop before a leaf), all leaves, right edge into a stack then pop. Clear and classic interview split.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function boundaryTraversal(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function boundaryTraversal(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def boundary_traversal(root):
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
    boolean isLeaf(TreeNode n) { return n.left == null && n.right == null; }
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

bool isLeafN(TreeNode* n) { return !n->left && !n->right; }
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

int isLeafN(struct Node* n) { return !n->left && !n->right; }
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
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(h)",
          why: "One DFS. Pass whether this node is on the left bound, right bound, or a leaf. Append left-bound before children, leaves in the middle, right-bound after children (so they reverse themselves).",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function boundaryTraversal(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function boundaryTraversal(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def boundary_traversal(root):
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
    boolean isLeaf(TreeNode n) { return n.left == null && n.right == null; }
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

bool isLeafN(TreeNode* n) { return !n->left && !n->right; }
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

int isLeafN(struct Node* n) { return !n->left && !n->right; }
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
          }
        }
      ]
    },
    {
      id: 24,
      level: "beginner",
      q: "Left View of Binary Tree",
      ask: "Amazon · Microsoft · Apple",
      links: [{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/left-view-of-binary-tree/1"},{"name":"GFG","url":"https://www.geeksforgeeks.org/print-left-view-binary-tree/"}],
      a: "The left view is the first node you see at each depth when you stand on the left. Root is always included.\n\nBFS: the first node of every level. DFS: the first time you visit a new depth (preorder, left before right).\n\nBrute stores whole levels and takes index 0. Optimal BFS takes the first of the queue size. More optimal DFS records when depth equals the answer length.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Full level-order lists, then pick the first value of each list.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function leftView(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function leftView(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def left_view(root):
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
    public List<Integer> leftView(TreeNode root) {
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

vector<int> leftView(TreeNode* root) {
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

int* leftView(struct Node* root, int* returnSize) {
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
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(w)",
          why: "BFS. When i == 0 in the level loop, that node is the left view. w is the widest level.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function leftView(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function leftView(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def left_view(root):
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
    public List<Integer> leftView(TreeNode root) {
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

vector<int> leftView(TreeNode* root) {
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

int* leftView(struct Node* root, int* returnSize) {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(h)",
          why: "DFS left-first. If depth == out.length this is the first node at that depth. Recursion stack only.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function leftView(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function leftView(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def left_view(root):
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
    public List<Integer> leftView(TreeNode root) {
        List<Integer> out = new ArrayList<Integer>();
        go(root, 0, out);
        return out;
    }
    void go(TreeNode node, int d, List<Integer> out) {
        if (node == null) return;
        if (d == out.size()) out.add(node.val);
        go(node.left, d + 1, out);
        go(node.right, d + 1, out);
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

void goLeft(TreeNode* node, int d, vector<int>& out) {
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

void goLeft(struct Node* node, int d, int* out, int* n) {
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
          }
        }
      ]
    },
    {
      id: 25,
      level: "intermediate",
      q: "Top View of Binary Tree",
      ask: "Amazon · Microsoft · Apple",
      links: [{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/top-view-of-binary-tree/1"},{"name":"GFG","url":"https://www.geeksforgeeks.org/print-nodes-top-view-binary-tree/"}],
      a: "Standing above the tree, you see the first node at each horizontal distance. Root is hd 0. Left child hd-1, right hd+1. If two nodes share an hd, the shallower one wins.\n\nBFS from the root visits shallow nodes first, so the first time you see an hd is the top view. DFS must also track depth and keep the smaller depth.\n\nBrute stores (hd, depth, val) and picks min depth. Optimal BFS first-write. More optimal DFS with a depth map.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n log n)",
          space: "O(n)",
          why: "Collect every (hd, depth, val), sort, keep the first (smallest depth) per hd.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function topView(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function topView(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def top_view(root):
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
    public List<Integer> topView(TreeNode root) {
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

vector<int> topView(TreeNode* root) {
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

typedef struct { int hd, d, val; } Item;
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
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "BFS. The first time an hd appears, record it. Then emit from min hd to max hd.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function topView(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function topView(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def top_view(root):
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
    public List<Integer> topView(TreeNode root) {
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

vector<int> topView(TreeNode* root) {
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

int* topView(struct Node* root, int* returnSize) {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "DFS with depth. Keep a node for hd only if this depth is smaller. Then scan min..max hd. No queue.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function topView(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function topView(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def top_view(root):
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
    Map<Integer, Integer> bestVal = new HashMap<Integer, Integer>();
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

void goTop(TreeNode* node, int hd, int d, unordered_map<int,int>& bestVal, unordered_map<int,int>& bestD, int& minH, int& maxH) {
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

int bestVal[8005], bestD[8005], seenHd[8005];
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
          }
        }
      ]
    },
    {
      id: 26,
      level: "intermediate",
      q: "Bottom View of Binary Tree",
      ask: "Amazon · Microsoft · Apple · Uber",
      links: [{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/bottom-view-of-binary-tree/1"},{"name":"GFG","url":"https://www.geeksforgeeks.org/bottom-view-binary-tree/"}],
      a: "Standing below the tree, you see the last (deepest) node at each horizontal distance. If two nodes share hd and depth, GFG keeps the one visited later (usually the right one in BFS).\n\nBFS overwrite: every time you see hd, replace the value. DFS must keep the larger depth, and on a tie prefer the later visit.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n log n)",
          space: "O(n)",
          why: "Collect (hd, depth, index, val), sort, keep the last per hd.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function bottomView(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function bottomView(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def bottom_view(root):
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
    public List<Integer> bottomView(TreeNode root) {
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

vector<int> bottomView(TreeNode* root) {
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

typedef struct { int hd, d, idx, val; } Item;
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
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "BFS overwrite per hd. Last write is the deepest (or the right one on a tie). Emit min..max.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function bottomView(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function bottomView(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def bottom_view(root):
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
    public List<Integer> bottomView(TreeNode root) {
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

vector<int> bottomView(TreeNode* root) {
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

int* bottomView(struct Node* root, int* returnSize) {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "DFS: keep val for hd when depth >= stored depth (overwrite on tie so right-later wins if you visit right after left).",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function bottomView(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function bottomView(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def bottom_view(root):
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
    Map<Integer, Integer> val = new HashMap<Integer, Integer>();
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

void goBot(TreeNode* node, int hd, int d, unordered_map<int,int>& val, unordered_map<int,int>& dep, int& minH, int& maxH) {
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

int botVal[8005], botDep[8005], botSeen[8005];
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
          }
        }
      ]
    },
    {
      id: 27,
      level: "intermediate",
      q: "Populating Next Right Pointers in Each Node",
      ask: "Amazon · Microsoft · Meta · Google",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/populating-next-right-pointers-in-each-node/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/connect-nodes-at-same-level/"}],
      a: "The tree is perfect (every level full). Each node has a next pointer. Point it at the neighbor on the right, or null at the end of a level. Return the root.\n\nBrute is BFS: the next node in the queue on the same level is next. Optimal walks already-built next links on level i to wire level i+1, O(1) extra space. More optimal uses a leftmost pointer and a prev cursor on the child level.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Level-order queue. For each level, node.next = the next polled node, last.next = null.",
          code: `function Node(val, left, right, next) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
  this.next = next === undefined ? null : next;
}

function connect(root) {
  if (!root) return null;
  const q = [root];
  while (q.length) {
    const n = q.length;
    for (let i = 0; i < n; i++) {
      const node = q.shift();
      if (i + 1 < n) node.next = q[0];
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
  }
  return root;
}`,
          codes: {
            javascript: `function Node(val, left, right, next) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
  this.next = next === undefined ? null : next;
}

function connect(root) {
  if (!root) return null;
  const q = [root];
  while (q.length) {
    const n = q.length;
    for (let i = 0; i < n; i++) {
      const node = q.shift();
      if (i + 1 < n) node.next = q[0];
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
  }
  return root;
}`,
            python: `class Node:
    def __init__(self, val=0, left=None, right=None, next=None):
        self.val = val
        self.left = left
        self.right = right
        self.next = next
def connect(root):
    if root is None:
        return None
    from collections import deque
    q = deque([root])
    while q:
        n = len(q)
        for i in range(n):
            node = q.popleft()
            if i + 1 < n:
                node.next = q[0]
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
    return root`,
            java: `import java.util.*;

class Node {
    int val;
    Node left;
    Node right;
    Node next;
    Node() {}
    Node(int val) { this.val = val; }
    Node(int val, Node left, Node right, Node next) {
        this.val = val; this.left = left; this.right = right; this.next = next;
    }
}

class Solution {
    public Node connect(Node root) {
        if (root == null) return null;
        Queue<Node> q = new ArrayDeque<Node>();
        q.add(root);
        while (!q.isEmpty()) {
            int n = q.size();
            for (int i = 0; i < n; i++) {
                Node node = q.poll();
                if (i + 1 < n) node.next = q.peek();
                if (node.left != null) q.add(node.left);
                if (node.right != null) q.add(node.right);
            }
        }
        return root;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

class Node {
public:
    int val;
    Node* left;
    Node* right;
    Node* next;
    Node() : val(0), left(NULL), right(NULL), next(NULL) {}
    Node(int _val) : val(_val), left(NULL), right(NULL), next(NULL) {}
    Node(int _val, Node* _left, Node* _right, Node* _next)
        : val(_val), left(_left), right(_right), next(_next) {}
};

Node* connect(Node* root) {
    if (!root) return nullptr;
    queue<Node*> q;
    q.push(root);
    while (!q.empty()) {
        int n = (int)q.size();
        for (int i = 0; i < n; i++) {
            Node* node = q.front(); q.pop();
            if (i + 1 < n) node->next = q.front();
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
    }
    return root;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    n->next = NULL;
    return n;
}

struct Node* connect(struct Node* root) {
    struct Node* q[10005];
    int qs, qe;
    if (!root) return NULL;
    qs = 0; qe = 0;
    q[qe++] = root;
    while (qs < qe) {
        int n = qe - qs, i;
        for (i = 0; i < n; i++) {
            struct Node* node = q[qs++];
            if (i + 1 < n) node->next = q[qs];
            if (node->left) q[qe++] = node->left;
            if (node->right) q[qe++] = node->right;
        }
    }
    return root;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(1)",
          why: "On a perfect tree, left.next = right, and right.next = node.next.left. Recurse both children. Uses the next links already set on this level.",
          code: `function Node(val, left, right, next) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
  this.next = next === undefined ? null : next;
}

function connect(root) {
  if (!root || !root.left) return root;
  root.left.next = root.right;
  if (root.next) root.right.next = root.next.left;
  connect(root.left);
  connect(root.right);
  return root;
}`,
          codes: {
            javascript: `function Node(val, left, right, next) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
  this.next = next === undefined ? null : next;
}

function connect(root) {
  if (!root || !root.left) return root;
  root.left.next = root.right;
  if (root.next) root.right.next = root.next.left;
  connect(root.left);
  connect(root.right);
  return root;
}`,
            python: `class Node:
    def __init__(self, val=0, left=None, right=None, next=None):
        self.val = val
        self.left = left
        self.right = right
        self.next = next
def connect(root):
    if root is None or root.left is None:
        return root
    root.left.next = root.right
    if root.next:
        root.right.next = root.next.left
    connect(root.left)
    connect(root.right)
    return root`,
            java: `import java.util.*;

class Node {
    int val;
    Node left;
    Node right;
    Node next;
    Node() {}
    Node(int val) { this.val = val; }
    Node(int val, Node left, Node right, Node next) {
        this.val = val; this.left = left; this.right = right; this.next = next;
    }
}

class Solution {
    public Node connect(Node root) {
        if (root == null || root.left == null) return root;
        root.left.next = root.right;
        if (root.next != null) root.right.next = root.next.left;
        connect(root.left);
        connect(root.right);
        return root;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

class Node {
public:
    int val;
    Node* left;
    Node* right;
    Node* next;
    Node() : val(0), left(NULL), right(NULL), next(NULL) {}
    Node(int _val) : val(_val), left(NULL), right(NULL), next(NULL) {}
    Node(int _val, Node* _left, Node* _right, Node* _next)
        : val(_val), left(_left), right(_right), next(_next) {}
};

Node* connect(Node* root) {
    if (!root || !root->left) return root;
    root->left->next = root->right;
    if (root->next) root->right->next = root->next->left;
    connect(root->left);
    connect(root->right);
    return root;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    n->next = NULL;
    return n;
}

struct Node* connect(struct Node* root) {
    if (!root || !root->left) return root;
    root->left->next = root->right;
    if (root->next) root->right->next = root->next->left;
    connect(root->left);
    connect(root->right);
    return root;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Iterative: leftmost starts at root. Walk the level via next. Wire children, then leftmost = leftmost.left. No recursion, no queue.",
          code: `function Node(val, left, right, next) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
  this.next = next === undefined ? null : next;
}

function connect(root) {
  if (!root) return null;
  let leftmost = root;
  while (leftmost.left) {
    let cur = leftmost;
    while (cur) {
      cur.left.next = cur.right;
      if (cur.next) cur.right.next = cur.next.left;
      cur = cur.next;
    }
    leftmost = leftmost.left;
  }
  return root;
}`,
          codes: {
            javascript: `function Node(val, left, right, next) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
  this.next = next === undefined ? null : next;
}

function connect(root) {
  if (!root) return null;
  let leftmost = root;
  while (leftmost.left) {
    let cur = leftmost;
    while (cur) {
      cur.left.next = cur.right;
      if (cur.next) cur.right.next = cur.next.left;
      cur = cur.next;
    }
    leftmost = leftmost.left;
  }
  return root;
}`,
            python: `class Node:
    def __init__(self, val=0, left=None, right=None, next=None):
        self.val = val
        self.left = left
        self.right = right
        self.next = next
def connect(root):
    if root is None:
        return None
    leftmost = root
    while leftmost.left:
        cur = leftmost
        while cur:
            cur.left.next = cur.right
            if cur.next:
                cur.right.next = cur.next.left
            cur = cur.next
        leftmost = leftmost.left
    return root`,
            java: `import java.util.*;

class Node {
    int val;
    Node left;
    Node right;
    Node next;
    Node() {}
    Node(int val) { this.val = val; }
    Node(int val, Node left, Node right, Node next) {
        this.val = val; this.left = left; this.right = right; this.next = next;
    }
}

class Solution {
    public Node connect(Node root) {
        if (root == null) return null;
        Node leftmost = root;
        while (leftmost.left != null) {
            Node cur = leftmost;
            while (cur != null) {
                cur.left.next = cur.right;
                if (cur.next != null) cur.right.next = cur.next.left;
                cur = cur.next;
            }
            leftmost = leftmost.left;
        }
        return root;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

class Node {
public:
    int val;
    Node* left;
    Node* right;
    Node* next;
    Node() : val(0), left(NULL), right(NULL), next(NULL) {}
    Node(int _val) : val(_val), left(NULL), right(NULL), next(NULL) {}
    Node(int _val, Node* _left, Node* _right, Node* _next)
        : val(_val), left(_left), right(_right), next(_next) {}
};

Node* connect(Node* root) {
    if (!root) return nullptr;
    Node* leftmost = root;
    while (leftmost->left) {
        Node* cur = leftmost;
        while (cur) {
            cur->left->next = cur->right;
            if (cur->next) cur->right->next = cur->next->left;
            cur = cur->next;
        }
        leftmost = leftmost->left;
    }
    return root;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    n->next = NULL;
    return n;
}

struct Node* connect(struct Node* root) {
    struct Node* leftmost;
    struct Node* cur;
    if (!root) return NULL;
    leftmost = root;
    while (leftmost->left) {
        cur = leftmost;
        while (cur) {
            cur->left->next = cur->right;
            if (cur->next) cur->right->next = cur->next->left;
            cur = cur->next;
        }
        leftmost = leftmost->left;
    }
    return root;
}`
          }
        }
      ]
    },
    {
      id: 28,
      level: "intermediate",
      q: "All Nodes Distance K in Binary Tree",
      ask: "Amazon · Google · Meta · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/print-nodes-distance-k-given-node-binary-tree/"}],
      a: "Return every node value that is exactly K edges away from target. Edges go to children and to the parent, so you need parent pointers or an undirected graph.\n\nBuild parent map with a DFS/BFS, then BFS from target, stopping at distance K.\n\nBrute converts the tree to an adjacency list. Optimal parent map + BFS. More optimal DFS that returns distance to target and explores the other side when it knows how far the target is.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Undirected graph of val->neighbors (vals are unique on LC). BFS from target.val for K steps.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function distanceK(root, target, k) {
  const g = {};
  function link(a, b) {
    if (!g[a]) g[a] = [];
    if (!g[b]) g[b] = [];
    g[a].push(b);
    g[b].push(a);
  }
  function build(node) {
    if (!node) return;
    if (node.left) { link(node.val, node.left.val); build(node.left); }
    if (node.right) { link(node.val, node.right.val); build(node.right); }
  }
  build(root);
  const seen = {};
  const q = [[target.val, 0]];
  seen[target.val] = true;
  const out = [];
  while (q.length) {
    const pair = q.shift();
    const u = pair[0], d = pair[1];
    if (d === k) { out.push(u); continue; }
    const nbrs = g[u] || [];
    for (let i = 0; i < nbrs.length; i++) {
      if (seen[nbrs[i]]) continue;
      seen[nbrs[i]] = true;
      q.push([nbrs[i], d + 1]);
    }
  }
  return out;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function distanceK(root, target, k) {
  const g = {};
  function link(a, b) {
    if (!g[a]) g[a] = [];
    if (!g[b]) g[b] = [];
    g[a].push(b);
    g[b].push(a);
  }
  function build(node) {
    if (!node) return;
    if (node.left) { link(node.val, node.left.val); build(node.left); }
    if (node.right) { link(node.val, node.right.val); build(node.right); }
  }
  build(root);
  const seen = {};
  const q = [[target.val, 0]];
  seen[target.val] = true;
  const out = [];
  while (q.length) {
    const pair = q.shift();
    const u = pair[0], d = pair[1];
    if (d === k) { out.push(u); continue; }
    const nbrs = g[u] || [];
    for (let i = 0; i < nbrs.length; i++) {
      if (seen[nbrs[i]]) continue;
      seen[nbrs[i]] = true;
      q.push([nbrs[i], d + 1]);
    }
  }
  return out;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def distance_k(root, target, k):
    from collections import defaultdict, deque
    g = defaultdict(list)
    def build(node):
        if node is None:
            return
        if node.left:
            g[node.val].append(node.left.val)
            g[node.left.val].append(node.val)
            build(node.left)
        if node.right:
            g[node.val].append(node.right.val)
            g[node.right.val].append(node.val)
            build(node.right)
    build(root)
    seen = {target.val}
    q = deque([(target.val, 0)])
    out = []
    while q:
        u, d = q.popleft()
        if d == k:
            out.append(u)
            continue
        for v in g[u]:
            if v not in seen:
                seen.add(v)
                q.append((v, d + 1))
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
    public List<Integer> distanceK(TreeNode root, TreeNode target, int k) {
        Map<Integer, List<Integer>> g = new HashMap<Integer, List<Integer>>();
        build(root, g);
        Set<Integer> seen = new HashSet<Integer>();
        Queue<int[]> q = new ArrayDeque<int[]>();
        q.add(new int[]{target.val, 0});
        seen.add(target.val);
        List<Integer> out = new ArrayList<Integer>();
        while (!q.isEmpty()) {
            int[] p = q.poll();
            if (p[1] == k) { out.add(p[0]); continue; }
            for (int v : g.getOrDefault(p[0], Collections.emptyList())) {
                if (seen.add(v)) q.add(new int[]{v, p[1] + 1});
            }
        }
        return out;
    }
    void link(Map<Integer, List<Integer>> g, int a, int b) {
        g.computeIfAbsent(a, x -> new ArrayList<Integer>()).add(b);
        g.computeIfAbsent(b, x -> new ArrayList<Integer>()).add(a);
    }
    void build(TreeNode node, Map<Integer, List<Integer>> g) {
        if (node == null) return;
        if (node.left != null) { link(g, node.val, node.left.val); build(node.left, g); }
        if (node.right != null) { link(g, node.val, node.right.val); build(node.right, g); }
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

void buildG(TreeNode* node, unordered_map<int, vector<int>>& g) {
    if (!node) return;
    if (node->left) {
        g[node->val].push_back(node->left->val);
        g[node->left->val].push_back(node->val);
        buildG(node->left, g);
    }
    if (node->right) {
        g[node->val].push_back(node->right->val);
        g[node->right->val].push_back(node->val);
        buildG(node->right, g);
    }
}
vector<int> distanceK(TreeNode* root, TreeNode* target, int k) {
    unordered_map<int, vector<int>> g;
    buildG(root, g);
    unordered_set<int> seen;
    queue<pair<int,int>> q;
    q.push({target->val, 0});
    seen.insert(target->val);
    vector<int> out;
    while (!q.empty()) {
        auto [u, d] = q.front(); q.pop();
        if (d == k) { out.push_back(u); continue; }
        for (int v : g[u]) if (!seen.count(v)) { seen.insert(v); q.push({v, d + 1}); }
    }
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

void addEdge(int u, int v, int adj[][8], int* deg) {
    adj[u][deg[u]++] = v;
    adj[v][deg[v]++] = u;
}
void buildG(struct Node* node, int adj[][8], int* deg) {
    if (!node) return;
    if (node->left) { addEdge(node->val, node->left->val, adj, deg); buildG(node->left, adj, deg); }
    if (node->right) { addEdge(node->val, node->right->val, adj, deg); buildG(node->right, adj, deg); }
}
int* distanceK(struct Node* root, struct Node* target, int k, int* returnSize) {
    static int adj[600][8], deg[600], seen[600], qv[600], qd[600], out[600];
    int qs = 0, qe = 0, n = 0, i;
    for (i = 0; i < 600; i++) { deg[i] = 0; seen[i] = 0; }
    buildG(root, adj, deg);
    qv[qe] = target->val; qd[qe++] = 0; seen[target->val] = 1;
    while (qs < qe) {
        int u = qv[qs], d = qd[qs++];
        if (d == k) { out[n++] = u; continue; }
        for (i = 0; i < deg[u]; i++) {
            int v = adj[u][i];
            if (seen[v]) continue;
            seen[v] = 1;
            qv[qe] = v; qd[qe++] = d + 1;
        }
    }
    *returnSize = n;
    return out;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Parent map from nodes (not values). BFS from the target node with a visited set of pointers. Collect at distance k.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function distanceK(root, target, k) {
  const parent = new Map();
  function mark(node, p) {
    if (!node) return;
    parent.set(node, p);
    mark(node.left, node);
    mark(node.right, node);
  }
  mark(root, null);
  const seen = new Set();
  const q = [[target, 0]];
  seen.add(target);
  const out = [];
  while (q.length) {
    const pair = q.shift();
    const node = pair[0], d = pair[1];
    if (d === k) { out.push(node.val); continue; }
    const nbr = [node.left, node.right, parent.get(node)];
    for (let i = 0; i < 3; i++) {
      const nx = nbr[i];
      if (!nx || seen.has(nx)) continue;
      seen.add(nx);
      q.push([nx, d + 1]);
    }
  }
  return out;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function distanceK(root, target, k) {
  const parent = new Map();
  function mark(node, p) {
    if (!node) return;
    parent.set(node, p);
    mark(node.left, node);
    mark(node.right, node);
  }
  mark(root, null);
  const seen = new Set();
  const q = [[target, 0]];
  seen.add(target);
  const out = [];
  while (q.length) {
    const pair = q.shift();
    const node = pair[0], d = pair[1];
    if (d === k) { out.push(node.val); continue; }
    const nbr = [node.left, node.right, parent.get(node)];
    for (let i = 0; i < 3; i++) {
      const nx = nbr[i];
      if (!nx || seen.has(nx)) continue;
      seen.add(nx);
      q.push([nx, d + 1]);
    }
  }
  return out;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def distance_k(root, target, k):
    from collections import deque
    parent = {}
    def mark(node, p):
        if node is None:
            return
        parent[node] = p
        mark(node.left, node)
        mark(node.right, node)
    mark(root, None)
    seen = {target}
    q = deque([(target, 0)])
    out = []
    while q:
        node, d = q.popleft()
        if d == k:
            out.append(node.val)
            continue
        for nx in (node.left, node.right, parent.get(node)):
            if nx is not None and nx not in seen:
                seen.add(nx)
                q.append((nx, d + 1))
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
    Map<TreeNode, TreeNode> parent = new HashMap<TreeNode, TreeNode>();
    void mark(TreeNode node, TreeNode p) {
        if (node == null) return;
        parent.put(node, p);
        mark(node.left, node);
        mark(node.right, node);
    }
    public List<Integer> distanceK(TreeNode root, TreeNode target, int k) {
        mark(root, null);
        Set<TreeNode> seen = new HashSet<TreeNode>();
        Queue<TreeNode> q = new ArrayDeque<TreeNode>();
        Queue<Integer> dq = new ArrayDeque<Integer>();
        q.add(target); dq.add(0); seen.add(target);
        List<Integer> out = new ArrayList<Integer>();
        while (!q.isEmpty()) {
            TreeNode node = q.poll();
            int d = dq.poll();
            if (d == k) { out.add(node.val); continue; }
            TreeNode[] nbr = {node.left, node.right, parent.get(node)};
            for (TreeNode nx : nbr) {
                if (nx == null || !seen.add(nx)) continue;
                q.add(nx); dq.add(d + 1);
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

void markP(TreeNode* node, TreeNode* p, unordered_map<TreeNode*, TreeNode*>& parent) {
    if (!node) return;
    parent[node] = p;
    markP(node->left, node, parent);
    markP(node->right, node, parent);
}
vector<int> distanceK(TreeNode* root, TreeNode* target, int k) {
    unordered_map<TreeNode*, TreeNode*> parent;
    markP(root, nullptr, parent);
    unordered_set<TreeNode*> seen;
    queue<pair<TreeNode*, int>> q;
    q.push({target, 0});
    seen.insert(target);
    vector<int> out;
    while (!q.empty()) {
        auto [node, d] = q.front(); q.pop();
        if (d == k) { out.push_back(node->val); continue; }
        TreeNode* nbr[3] = {node->left, node->right, parent[node]};
        for (int i = 0; i < 3; i++) {
            TreeNode* nx = nbr[i];
            if (!nx || seen.count(nx)) continue;
            seen.insert(nx);
            q.push({nx, d + 1});
        }
    }
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

struct Pair { struct Node* node; struct Node* p; };
void markP(struct Node* node, struct Node* p, struct Pair* par, int* n) {
    if (!node) return;
    par[*n].node = node; par[*n].p = p; (*n)++;
    markP(node->left, node, par, n);
    markP(node->right, node, par, n);
}
struct Node* findP(struct Pair* par, int n, struct Node* x) {
    int i;
    for (i = 0; i < n; i++) if (par[i].node == x) return par[i].p;
    return NULL;
}
int containsN(struct Node** a, int n, struct Node* x) {
    int i;
    for (i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}
int* distanceK(struct Node* root, struct Node* target, int k, int* returnSize) {
    static struct Pair par[10005];
    static struct Node* qn[10005];
    static struct Node* seen[10005];
    static int qd[10005], out[10005];
    int pn = 0, qs = 0, qe = 0, sn = 0, n = 0, i;
    struct Node* nbr[3];
    markP(root, NULL, par, &pn);
    qn[qe] = target; qd[qe++] = 0; seen[sn++] = target;
    while (qs < qe) {
        struct Node* node = qn[qs];
        int d = qd[qs++];
        if (d == k) { out[n++] = node->val; continue; }
        nbr[0] = node->left; nbr[1] = node->right; nbr[2] = findP(par, pn, node);
        for (i = 0; i < 3; i++) {
            if (!nbr[i] || containsN(seen, sn, nbr[i])) continue;
            seen[sn++] = nbr[i];
            qn[qe] = nbr[i]; qd[qe++] = d + 1;
        }
    }
    *returnSize = n;
    return out;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "DFS returns distance from this subtree to target, or -1. When a child reports dist, walk the other child at k - dist - 2, and maybe record this node. Downward walk from target collects depth k.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function distanceK(root, target, k) {
  const out = [];
  function collect(node, dist) {
    if (!node || dist < 0) return;
    if (dist === 0) { out.push(node.val); return; }
    collect(node.left, dist - 1);
    collect(node.right, dist - 1);
  }
  function dfs(node) {
    if (!node) return -1;
    if (node === target) {
      collect(node, k);
      return 0;
    }
    const L = dfs(node.left);
    if (L >= 0) {
      if (L + 1 === k) out.push(node.val);
      else collect(node.right, k - L - 2);
      return L + 1;
    }
    const R = dfs(node.right);
    if (R >= 0) {
      if (R + 1 === k) out.push(node.val);
      else collect(node.left, k - R - 2);
      return R + 1;
    }
    return -1;
  }
  dfs(root);
  return out;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function distanceK(root, target, k) {
  const out = [];
  function collect(node, dist) {
    if (!node || dist < 0) return;
    if (dist === 0) { out.push(node.val); return; }
    collect(node.left, dist - 1);
    collect(node.right, dist - 1);
  }
  function dfs(node) {
    if (!node) return -1;
    if (node === target) {
      collect(node, k);
      return 0;
    }
    const L = dfs(node.left);
    if (L >= 0) {
      if (L + 1 === k) out.push(node.val);
      else collect(node.right, k - L - 2);
      return L + 1;
    }
    const R = dfs(node.right);
    if (R >= 0) {
      if (R + 1 === k) out.push(node.val);
      else collect(node.left, k - R - 2);
      return R + 1;
    }
    return -1;
  }
  dfs(root);
  return out;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def distance_k(root, target, k):
    out = []
    def collect(node, dist):
        if node is None or dist < 0:
            return
        if dist == 0:
            out.append(node.val)
            return
        collect(node.left, dist - 1)
        collect(node.right, dist - 1)
    def dfs(node):
        if node is None:
            return -1
        if node is target:
            collect(node, k)
            return 0
        left = dfs(node.left)
        if left >= 0:
            if left + 1 == k:
                out.append(node.val)
            else:
                collect(node.right, k - left - 2)
            return left + 1
        right = dfs(node.right)
        if right >= 0:
            if right + 1 == k:
                out.append(node.val)
            else:
                collect(node.left, k - right - 2)
            return right + 1
        return -1
    dfs(root)
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
    List<Integer> out;
    void collect(TreeNode node, int dist) {
        if (node == null || dist < 0) return;
        if (dist == 0) { out.add(node.val); return; }
        collect(node.left, dist - 1);
        collect(node.right, dist - 1);
    }
    int dfs(TreeNode node, TreeNode target, int k) {
        if (node == null) return -1;
        if (node == target) { collect(node, k); return 0; }
        int L = dfs(node.left, target, k);
        if (L >= 0) {
            if (L + 1 == k) out.add(node.val);
            else collect(node.right, k - L - 2);
            return L + 1;
        }
        int R = dfs(node.right, target, k);
        if (R >= 0) {
            if (R + 1 == k) out.add(node.val);
            else collect(node.left, k - R - 2);
            return R + 1;
        }
        return -1;
    }
    public List<Integer> distanceK(TreeNode root, TreeNode target, int k) {
        out = new ArrayList<Integer>();
        dfs(root, target, k);
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

void collect(TreeNode* node, int dist, vector<int>& out) {
    if (!node || dist < 0) return;
    if (dist == 0) { out.push_back(node->val); return; }
    collect(node->left, dist - 1, out);
    collect(node->right, dist - 1, out);
}
int dfsK(TreeNode* node, TreeNode* target, int k, vector<int>& out) {
    if (!node) return -1;
    if (node == target) { collect(node, k, out); return 0; }
    int L = dfsK(node->left, target, k, out);
    if (L >= 0) {
        if (L + 1 == k) out.push_back(node->val);
        else collect(node->right, k - L - 2, out);
        return L + 1;
    }
    int R = dfsK(node->right, target, k, out);
    if (R >= 0) {
        if (R + 1 == k) out.push_back(node->val);
        else collect(node->left, k - R - 2, out);
        return R + 1;
    }
    return -1;
}
vector<int> distanceK(TreeNode* root, TreeNode* target, int k) {
    vector<int> out;
    dfsK(root, target, k, out);
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

void collect(struct Node* node, int dist, int* out, int* n) {
    if (!node || dist < 0) return;
    if (dist == 0) { out[(*n)++] = node->val; return; }
    collect(node->left, dist - 1, out, n);
    collect(node->right, dist - 1, out, n);
}
int dfsK(struct Node* node, struct Node* target, int k, int* out, int* n) {
    int L, R;
    if (!node) return -1;
    if (node == target) { collect(node, k, out, n); return 0; }
    L = dfsK(node->left, target, k, out, n);
    if (L >= 0) {
        if (L + 1 == k) out[(*n)++] = node->val;
        else collect(node->right, k - L - 2, out, n);
        return L + 1;
    }
    R = dfsK(node->right, target, k, out, n);
    if (R >= 0) {
        if (R + 1 == k) out[(*n)++] = node->val;
        else collect(node->left, k - R - 2, out, n);
        return R + 1;
    }
    return -1;
}
int* distanceK(struct Node* root, struct Node* target, int k, int* returnSize) {
    static int out[10005];
    int n = 0;
    dfsK(root, target, k, out, &n);
    *returnSize = n;
    return out;
}`
          }
        }
      ]
    },
    {
      id: 29,
      level: "intermediate",
      q: "Path Sum II",
      ask: "Amazon · Microsoft · Meta · Google",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/path-sum-ii/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/root-to-leaf-paths/1"}],
      a: "Return every root-to-leaf path whose values sum to targetSum. A leaf has no children.\n\nDFS with a path list: push the node, recurse, pop (backtrack). When you hit a leaf and remain is 0, copy the path into the answer.\n\nBrute generates every root-to-leaf path then filters. Optimal backtracks with remaining sum. More optimal is an explicit stack of (node, path copy, remain) — same idea, iterative.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(n²)",
          why: "Collect every root-to-leaf path, then keep those whose sum equals target. Path copies dominate memory.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function pathSum(root, targetSum) {
  const paths = [];
  function go(node, path) {
    if (!node) return;
    path.push(node.val);
    if (!node.left && !node.right) paths.push(path.slice());
    go(node.left, path);
    go(node.right, path);
    path.pop();
  }
  go(root, []);
  return paths.filter(function (p) {
    let s = 0;
    for (let i = 0; i < p.length; i++) s += p[i];
    return s === targetSum;
  });
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function pathSum(root, targetSum) {
  const paths = [];
  function go(node, path) {
    if (!node) return;
    path.push(node.val);
    if (!node.left && !node.right) paths.push(path.slice());
    go(node.left, path);
    go(node.right, path);
    path.pop();
  }
  go(root, []);
  return paths.filter(function (p) {
    let s = 0;
    for (let i = 0; i < p.length; i++) s += p[i];
    return s === targetSum;
  });
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def path_sum(root, target_sum):
    paths = []
    def go(node, path):
        if node is None:
            return
        path.append(node.val)
        if node.left is None and node.right is None:
            paths.append(list(path))
        go(node.left, path)
        go(node.right, path)
        path.pop()
    go(root, [])
    return [p for p in paths if sum(p) == target_sum]`,
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
    public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        List<List<Integer>> paths = new ArrayList<List<Integer>>();
        go(root, new ArrayList<Integer>(), paths);
        List<List<Integer>> out = new ArrayList<List<Integer>>();
        for (List<Integer> p : paths) {
            int s = 0;
            for (int v : p) s += v;
            if (s == targetSum) out.add(p);
        }
        return out;
    }
    void go(TreeNode node, List<Integer> path, List<List<Integer>> paths) {
        if (node == null) return;
        path.add(node.val);
        if (node.left == null && node.right == null) paths.add(new ArrayList<Integer>(path));
        go(node.left, path, paths);
        go(node.right, path, paths);
        path.remove(path.size() - 1);
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

void goPaths(TreeNode* node, vector<int>& path, vector<vector<int>>& paths) {
    if (!node) return;
    path.push_back(node->val);
    if (!node->left && !node->right) paths.push_back(path);
    goPaths(node->left, path, paths);
    goPaths(node->right, path, paths);
    path.pop_back();
}
vector<vector<int>> pathSum(TreeNode* root, int targetSum) {
    vector<vector<int>> paths, out;
    vector<int> path;
    goPaths(root, path, paths);
    for (auto& p : paths) {
        int s = 0;
        for (int v : p) s += v;
        if (s == targetSum) out.push_back(p);
    }
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

void goPaths(struct Node* node, int* path, int plen, int paths[][256], int* plenOut, int* pn) {
    if (!node) return;
    path[plen++] = node->val;
    if (!node->left && !node->right) {
        int i;
        plenOut[*pn] = plen;
        for (i = 0; i < plen; i++) paths[*pn][i] = path[i];
        (*pn)++;
    }
    goPaths(node->left, path, plen, paths, plenOut, pn);
    goPaths(node->right, path, plen, paths, plenOut, pn);
}
int** pathSum(struct Node* root, int targetSum, int* returnSize, int** returnColumnSizes) {
    static int paths[256][256], plenOut[256], *ptrs[256], cols[256], path[256];
    int pn = 0, i, j, n = 0;
    goPaths(root, path, 0, paths, plenOut, &pn);
    for (i = 0; i < pn; i++) {
        int s = 0;
        for (j = 0; j < plenOut[i]; j++) s += paths[i][j];
        if (s == targetSum) {
            cols[n] = plenOut[i];
            ptrs[n] = paths[i];
            n++;
        }
    }
    *returnSize = n;
    *returnColumnSizes = cols;
    return ptrs;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n²)",
          space: "O(h)",
          why: "Backtracking. remain starts at targetSum. At a leaf, if remain == node.val, snapshot the path. Copying a path is O(h); total output can be O(n²).",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function pathSum(root, targetSum) {
  const out = [];
  function go(node, remain, path) {
    if (!node) return;
    path.push(node.val);
    if (!node.left && !node.right && remain === node.val) out.push(path.slice());
    go(node.left, remain - node.val, path);
    go(node.right, remain - node.val, path);
    path.pop();
  }
  go(root, targetSum, []);
  return out;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function pathSum(root, targetSum) {
  const out = [];
  function go(node, remain, path) {
    if (!node) return;
    path.push(node.val);
    if (!node.left && !node.right && remain === node.val) out.push(path.slice());
    go(node.left, remain - node.val, path);
    go(node.right, remain - node.val, path);
    path.pop();
  }
  go(root, targetSum, []);
  return out;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def path_sum(root, target_sum):
    out = []
    def go(node, remain, path):
        if node is None:
            return
        path.append(node.val)
        if node.left is None and node.right is None and remain == node.val:
            out.append(list(path))
        go(node.left, remain - node.val, path)
        go(node.right, remain - node.val, path)
        path.pop()
    go(root, target_sum, [])
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
    public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        List<List<Integer>> out = new ArrayList<List<Integer>>();
        go(root, targetSum, new ArrayList<Integer>(), out);
        return out;
    }
    void go(TreeNode node, int remain, List<Integer> path, List<List<Integer>> out) {
        if (node == null) return;
        path.add(node.val);
        if (node.left == null && node.right == null && remain == node.val) out.add(new ArrayList<Integer>(path));
        go(node.left, remain - node.val, path, out);
        go(node.right, remain - node.val, path, out);
        path.remove(path.size() - 1);
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

void goSum(TreeNode* node, int remain, vector<int>& path, vector<vector<int>>& out) {
    if (!node) return;
    path.push_back(node->val);
    if (!node->left && !node->right && remain == node->val) out.push_back(path);
    goSum(node->left, remain - node->val, path, out);
    goSum(node->right, remain - node->val, path, out);
    path.pop_back();
}
vector<vector<int>> pathSum(TreeNode* root, int targetSum) {
    vector<vector<int>> out;
    vector<int> path;
    goSum(root, targetSum, path, out);
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

void goSum(struct Node* node, int remain, int* path, int plen, int out[][256], int* olen, int* n) {
    if (!node) return;
    path[plen++] = node->val;
    if (!node->left && !node->right && remain == node->val) {
        int i;
        olen[*n] = plen;
        for (i = 0; i < plen; i++) out[*n][i] = path[i];
        (*n)++;
    }
    goSum(node->left, remain - node->val, path, plen, out, olen, n);
    goSum(node->right, remain - node->val, path, plen, out, olen, n);
}
int** pathSum(struct Node* root, int targetSum, int* returnSize, int** returnColumnSizes) {
    static int store[256][256], olen[256], *ptrs[256], path[256];
    int n = 0, i;
    goSum(root, targetSum, path, 0, store, olen, &n);
    for (i = 0; i < n; i++) ptrs[i] = store[i];
    *returnSize = n;
    *returnColumnSizes = olen;
    return ptrs;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n²)",
          space: "O(n²)",
          why: "Iterative stack of {node, remain, path}. Same snapshots at leaves. Avoids call-stack overflow on a stick, still copies paths.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function pathSum(root, targetSum) {
  if (!root) return [];
  const out = [];
  const stack = [{ node: root, remain: targetSum, path: [root.val] }];
  while (stack.length) {
    const cur = stack.pop();
    const node = cur.node;
    if (!node.left && !node.right && cur.remain === node.val) out.push(cur.path);
    if (node.right) stack.push({ node: node.right, remain: cur.remain - node.val, path: cur.path.concat([node.right.val]) });
    if (node.left) stack.push({ node: node.left, remain: cur.remain - node.val, path: cur.path.concat([node.left.val]) });
  }
  return out;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function pathSum(root, targetSum) {
  if (!root) return [];
  const out = [];
  const stack = [{ node: root, remain: targetSum, path: [root.val] }];
  while (stack.length) {
    const cur = stack.pop();
    const node = cur.node;
    if (!node.left && !node.right && cur.remain === node.val) out.push(cur.path);
    if (node.right) stack.push({ node: node.right, remain: cur.remain - node.val, path: cur.path.concat([node.right.val]) });
    if (node.left) stack.push({ node: node.left, remain: cur.remain - node.val, path: cur.path.concat([node.left.val]) });
  }
  return out;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def path_sum(root, target_sum):
    if root is None:
        return []
    out = []
    stack = [(root, target_sum, [root.val])]
    while stack:
        node, remain, path = stack.pop()
        if node.left is None and node.right is None and remain == node.val:
            out.append(path)
        if node.right:
            stack.append((node.right, remain - node.val, path + [node.right.val]))
        if node.left:
            stack.append((node.left, remain - node.val, path + [node.left.val]))
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
    public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        List<List<Integer>> out = new ArrayList<List<Integer>>();
        if (root == null) return out;
        Deque<TreeNode> ns = new ArrayDeque<TreeNode>();
        Deque<Integer> rs = new ArrayDeque<Integer>();
        Deque<List<Integer>> ps = new ArrayDeque<List<Integer>>();
        ns.push(root); rs.push(targetSum); ps.push(new ArrayList<Integer>(Arrays.asList(root.val)));
        while (!ns.isEmpty()) {
            TreeNode node = ns.pop();
            int remain = rs.pop();
            List<Integer> path = ps.pop();
            if (node.left == null && node.right == null && remain == node.val) out.add(path);
            if (node.right != null) {
                List<Integer> np = new ArrayList<Integer>(path);
                np.add(node.right.val);
                ns.push(node.right); rs.push(remain - node.val); ps.push(np);
            }
            if (node.left != null) {
                List<Integer> np = new ArrayList<Integer>(path);
                np.add(node.left.val);
                ns.push(node.left); rs.push(remain - node.val); ps.push(np);
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

vector<vector<int>> pathSum(TreeNode* root, int targetSum) {
    vector<vector<int>> out;
    if (!root) return out;
    struct Frame { TreeNode* node; int remain; vector<int> path; };
    vector<Frame> stack;
    stack.push_back({root, targetSum, {root->val}});
    while (!stack.empty()) {
        Frame cur = stack.back(); stack.pop_back();
        if (!cur.node->left && !cur.node->right && cur.remain == cur.node->val) out.push_back(cur.path);
        if (cur.node->right) {
            vector<int> np = cur.path;
            np.push_back(cur.node->right->val);
            stack.push_back({cur.node->right, cur.remain - cur.node->val, np});
        }
        if (cur.node->left) {
            vector<int> np = cur.path;
            np.push_back(cur.node->left->val);
            stack.push_back({cur.node->left, cur.remain - cur.node->val, np});
        }
    }
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

int** pathSum(struct Node* root, int targetSum, int* returnSize, int** returnColumnSizes) {
    static int store[256][256], olen[256], *ptrs[256];
    struct Node* sn[256];
    int sr[256], spath[256][256], slen[256];
    int sp = 0, n = 0, i;
    if (!root) { *returnSize = 0; *returnColumnSizes = olen; return ptrs; }
    sn[sp] = root; sr[sp] = targetSum; spath[sp][0] = root->val; slen[sp] = 1; sp++;
    while (sp) {
        sp--;
        struct Node* node = sn[sp];
        int remain = sr[sp], plen = slen[sp];
        int path[256];
        for (i = 0; i < plen; i++) path[i] = spath[sp][i];
        if (!node->left && !node->right && remain == node->val) {
            olen[n] = plen;
            for (i = 0; i < plen; i++) store[n][i] = path[i];
            ptrs[n] = store[n];
            n++;
        }
        if (node->right) {
            sn[sp] = node->right; sr[sp] = remain - node->val;
            for (i = 0; i < plen; i++) spath[sp][i] = path[i];
            spath[sp][plen] = node->right->val; slen[sp] = plen + 1; sp++;
        }
        if (node->left) {
            sn[sp] = node->left; sr[sp] = remain - node->val;
            for (i = 0; i < plen; i++) spath[sp][i] = path[i];
            spath[sp][plen] = node->left->val; slen[sp] = plen + 1; sp++;
        }
    }
    *returnSize = n;
    *returnColumnSizes = olen;
    return ptrs;
}`
          }
        }
      ]
    },
    {
      id: 30,
      level: "intermediate",
      q: "Amount of Time for Binary Tree to Be Infected",
      ask: "Amazon · Google · Meta",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/amount-of-time-for-binary-tree-to-be-infected/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/burn-the-binary-tree-starting-from-the-target-node/"}],
      a: "At minute 0 the node with value start is infected. Each minute infection spreads to adjacent nodes (parent or child). Return how many minutes until every node is infected.\n\nThis is the max distance from start in the undirected tree. Parent map + BFS, or one DFS that returns height-below-start and distance-up.\n\nBrute adjacency list BFS. Optimal parent map BFS max dist. More optimal single DFS tracking the answer.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Build undirected graph on values (unique). BFS from start. Answer is the max distance.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function amountOfTime(root, start) {
  const g = {};
  function link(a, b) {
    if (!g[a]) g[a] = [];
    if (!g[b]) g[b] = [];
    g[a].push(b);
    g[b].push(a);
  }
  function build(node) {
    if (!node) return;
    if (node.left) { link(node.val, node.left.val); build(node.left); }
    if (node.right) { link(node.val, node.right.val); build(node.right); }
  }
  build(root);
  const seen = {};
  const q = [[start, 0]];
  seen[start] = true;
  let best = 0;
  while (q.length) {
    const pair = q.shift();
    const u = pair[0], d = pair[1];
    if (d > best) best = d;
    const nbrs = g[u] || [];
    for (let i = 0; i < nbrs.length; i++) {
      if (seen[nbrs[i]]) continue;
      seen[nbrs[i]] = true;
      q.push([nbrs[i], d + 1]);
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

function amountOfTime(root, start) {
  const g = {};
  function link(a, b) {
    if (!g[a]) g[a] = [];
    if (!g[b]) g[b] = [];
    g[a].push(b);
    g[b].push(a);
  }
  function build(node) {
    if (!node) return;
    if (node.left) { link(node.val, node.left.val); build(node.left); }
    if (node.right) { link(node.val, node.right.val); build(node.right); }
  }
  build(root);
  const seen = {};
  const q = [[start, 0]];
  seen[start] = true;
  let best = 0;
  while (q.length) {
    const pair = q.shift();
    const u = pair[0], d = pair[1];
    if (d > best) best = d;
    const nbrs = g[u] || [];
    for (let i = 0; i < nbrs.length; i++) {
      if (seen[nbrs[i]]) continue;
      seen[nbrs[i]] = true;
      q.push([nbrs[i], d + 1]);
    }
  }
  return best;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def amount_of_time(root, start):
    from collections import defaultdict, deque
    g = defaultdict(list)
    def build(node):
        if node is None:
            return
        if node.left:
            g[node.val].append(node.left.val)
            g[node.left.val].append(node.val)
            build(node.left)
        if node.right:
            g[node.val].append(node.right.val)
            g[node.right.val].append(node.val)
            build(node.right)
    build(root)
    seen = {start}
    q = deque([(start, 0)])
    best = 0
    while q:
        u, d = q.popleft()
        best = max(best, d)
        for v in g[u]:
            if v not in seen:
                seen.add(v)
                q.append((v, d + 1))
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
    public int amountOfTime(TreeNode root, int start) {
        Map<Integer, List<Integer>> g = new HashMap<Integer, List<Integer>>();
        build(root, g);
        Set<Integer> seen = new HashSet<Integer>();
        Queue<int[]> q = new ArrayDeque<int[]>();
        q.add(new int[]{start, 0});
        seen.add(start);
        int best = 0;
        while (!q.isEmpty()) {
            int[] p = q.poll();
            best = Math.max(best, p[1]);
            for (int v : g.getOrDefault(p[0], Collections.emptyList())) {
                if (seen.add(v)) q.add(new int[]{v, p[1] + 1});
            }
        }
        return best;
    }
    void link(Map<Integer, List<Integer>> g, int a, int b) {
        g.computeIfAbsent(a, x -> new ArrayList<Integer>()).add(b);
        g.computeIfAbsent(b, x -> new ArrayList<Integer>()).add(a);
    }
    void build(TreeNode node, Map<Integer, List<Integer>> g) {
        if (node == null) return;
        if (node.left != null) { link(g, node.val, node.left.val); build(node.left, g); }
        if (node.right != null) { link(g, node.val, node.right.val); build(node.right, g); }
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

int amountOfTime(TreeNode* root, int start) {
    unordered_map<int, vector<int>> g;
    function<void(TreeNode*)> build = [&](TreeNode* node) {
        if (!node) return;
        if (node->left) {
            g[node->val].push_back(node->left->val);
            g[node->left->val].push_back(node->val);
            build(node->left);
        }
        if (node->right) {
            g[node->val].push_back(node->right->val);
            g[node->right->val].push_back(node->val);
            build(node->right);
        }
    };
    build(root);
    unordered_set<int> seen;
    queue<pair<int,int>> q;
    q.push({start, 0});
    seen.insert(start);
    int best = 0;
    while (!q.empty()) {
        auto [u, d] = q.front(); q.pop();
        best = max(best, d);
        for (int v : g[u]) if (!seen.count(v)) { seen.insert(v); q.push({v, d + 1}); }
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

void addE(int u, int v, int adj[][8], int* deg) {
    adj[u][deg[u]++] = v;
    adj[v][deg[v]++] = u;
}
void buildG2(struct Node* node, int adj[][8], int* deg) {
    if (!node) return;
    if (node->left) { addE(node->val, node->left->val, adj, deg); buildG2(node->left, adj, deg); }
    if (node->right) { addE(node->val, node->right->val, adj, deg); buildG2(node->right, adj, deg); }
}
int amountOfTime(struct Node* root, int start) {
    int adj[100005][8], deg[100005], seen[100005];
    int qv[10005], qd[10005], qs = 0, qe = 0, best = 0, i;
    for (i = 0; i < 100005; i++) { deg[i] = 0; seen[i] = 0; }
    buildG2(root, adj, deg);
    qv[qe] = start; qd[qe++] = 0; seen[start] = 1;
    while (qs < qe) {
        int u = qv[qs], d = qd[qs++];
        if (d > best) best = d;
        for (i = 0; i < deg[u]; i++) {
            int v = adj[u][i];
            if (seen[v]) continue;
            seen[v] = 1;
            qv[qe] = v; qd[qe++] = d + 1;
        }
    }
    return best;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Parent pointers, BFS from the start node (find it first). Minutes = max distance.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function amountOfTime(root, start) {
  const parent = new Map();
  let src = null;
  function mark(node, p) {
    if (!node) return;
    parent.set(node, p);
    if (node.val === start) src = node;
    mark(node.left, node);
    mark(node.right, node);
  }
  mark(root, null);
  const seen = new Set();
  const q = [[src, 0]];
  seen.add(src);
  let best = 0;
  while (q.length) {
    const pair = q.shift();
    const node = pair[0], d = pair[1];
    if (d > best) best = d;
    const nbr = [node.left, node.right, parent.get(node)];
    for (let i = 0; i < 3; i++) {
      const nx = nbr[i];
      if (!nx || seen.has(nx)) continue;
      seen.add(nx);
      q.push([nx, d + 1]);
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

function amountOfTime(root, start) {
  const parent = new Map();
  let src = null;
  function mark(node, p) {
    if (!node) return;
    parent.set(node, p);
    if (node.val === start) src = node;
    mark(node.left, node);
    mark(node.right, node);
  }
  mark(root, null);
  const seen = new Set();
  const q = [[src, 0]];
  seen.add(src);
  let best = 0;
  while (q.length) {
    const pair = q.shift();
    const node = pair[0], d = pair[1];
    if (d > best) best = d;
    const nbr = [node.left, node.right, parent.get(node)];
    for (let i = 0; i < 3; i++) {
      const nx = nbr[i];
      if (!nx || seen.has(nx)) continue;
      seen.add(nx);
      q.push([nx, d + 1]);
    }
  }
  return best;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def amount_of_time(root, start):
    from collections import deque
    parent = {}
    src = [None]
    def mark(node, p):
        if node is None:
            return
        parent[node] = p
        if node.val == start:
            src[0] = node
        mark(node.left, node)
        mark(node.right, node)
    mark(root, None)
    seen = {src[0]}
    q = deque([(src[0], 0)])
    best = 0
    while q:
        node, d = q.popleft()
        best = max(best, d)
        for nx in (node.left, node.right, parent.get(node)):
            if nx is not None and nx not in seen:
                seen.add(nx)
                q.append((nx, d + 1))
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
    Map<TreeNode, TreeNode> parent = new HashMap<TreeNode, TreeNode>();
    TreeNode src;
    void mark(TreeNode node, TreeNode p, int start) {
        if (node == null) return;
        parent.put(node, p);
        if (node.val == start) src = node;
        mark(node.left, node, start);
        mark(node.right, node, start);
    }
    public int amountOfTime(TreeNode root, int start) {
        mark(root, null, start);
        Set<TreeNode> seen = new HashSet<TreeNode>();
        Queue<TreeNode> q = new ArrayDeque<TreeNode>();
        Queue<Integer> dq = new ArrayDeque<Integer>();
        q.add(src); dq.add(0); seen.add(src);
        int best = 0;
        while (!q.isEmpty()) {
            TreeNode node = q.poll();
            int d = dq.poll();
            best = Math.max(best, d);
            TreeNode[] nbr = {node.left, node.right, parent.get(node)};
            for (TreeNode nx : nbr) {
                if (nx == null || !seen.add(nx)) continue;
                q.add(nx); dq.add(d + 1);
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

int amountOfTime(TreeNode* root, int start) {
    unordered_map<TreeNode*, TreeNode*> parent;
    TreeNode* src = nullptr;
    function<void(TreeNode*, TreeNode*)> mark = [&](TreeNode* node, TreeNode* p) {
        if (!node) return;
        parent[node] = p;
        if (node->val == start) src = node;
        mark(node->left, node);
        mark(node->right, node);
    };
    mark(root, nullptr);
    unordered_set<TreeNode*> seen;
    queue<pair<TreeNode*, int>> q;
    q.push({src, 0});
    seen.insert(src);
    int best = 0;
    while (!q.empty()) {
        auto [node, d] = q.front(); q.pop();
        best = max(best, d);
        TreeNode* nbr[3] = {node->left, node->right, parent[node]};
        for (int i = 0; i < 3; i++) {
            if (!nbr[i] || seen.count(nbr[i])) continue;
            seen.insert(nbr[i]);
            q.push({nbr[i], d + 1});
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

int amountOfTime(struct Node* root, int start) {
    struct Pair { struct Node* node; struct Node* p; } par[10005];
    struct Node *qn[10005], *seen[10005], *src = NULL, *nbr[3];
    int pn = 0, qs = 0, qe = 0, sn = 0, qd[10005], best = 0, i;
    void mark(struct Node* node, struct Node* p);
    /* iterative mark via recursion helper inlined below */
    struct Node* stackN[10005], *stackP[10005];
    int sp = 0;
    stackN[sp] = root; stackP[sp] = NULL; sp++;
    while (sp) {
        struct Node* node = stackN[--sp];
        struct Node* p = stackP[sp];
        if (!node) continue;
        par[pn].node = node; par[pn].p = p; pn++;
        if (node->val == start) src = node;
        stackN[sp] = node->right; stackP[sp] = node; sp++;
        stackN[sp] = node->left; stackP[sp] = node; sp++;
    }
    qn[qe] = src; qd[qe++] = 0; seen[sn++] = src;
    while (qs < qe) {
        struct Node* node = qn[qs];
        int d = qd[qs++];
        struct Node* p = NULL;
        if (d > best) best = d;
        for (i = 0; i < pn; i++) if (par[i].node == node) { p = par[i].p; break; }
        nbr[0] = node->left; nbr[1] = node->right; nbr[2] = p;
        for (i = 0; i < 3; i++) {
            int found = 0, j;
            if (!nbr[i]) continue;
            for (j = 0; j < sn; j++) if (seen[j] == nbr[i]) found = 1;
            if (found) continue;
            seen[sn++] = nbr[i];
            qn[qe] = nbr[i]; qd[qe++] = d + 1;
        }
    }
    return best;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(h)",
          why: "DFS returns height of the subtree. When the start node is found, ans is max(height below, distance going up through the parent). One traversal, no graph.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function amountOfTime(root, start) {
  let ans = 0;
  function dfs(node) {
    if (!node) return 0;
    const L = dfs(node.left);
    const R = dfs(node.right);
    if (node.val === start) {
      ans = Math.max(ans, L, R);
      return -1;
    }
    if (L < 0) {
      ans = Math.max(ans, R - L);
      return L - 1;
    }
    if (R < 0) {
      ans = Math.max(ans, L - R);
      return R - 1;
    }
    return 1 + Math.max(L, R);
  }
  dfs(root);
  return ans;
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function amountOfTime(root, start) {
  let ans = 0;
  function dfs(node) {
    if (!node) return 0;
    const L = dfs(node.left);
    const R = dfs(node.right);
    if (node.val === start) {
      ans = Math.max(ans, L, R);
      return -1;
    }
    if (L < 0) {
      ans = Math.max(ans, R - L);
      return L - 1;
    }
    if (R < 0) {
      ans = Math.max(ans, L - R);
      return R - 1;
    }
    return 1 + Math.max(L, R);
  }
  dfs(root);
  return ans;
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def amount_of_time(root, start):
    ans = [0]
    def dfs(node):
        if node is None:
            return 0
        left = dfs(node.left)
        right = dfs(node.right)
        if node.val == start:
            ans[0] = max(ans[0], left, right)
            return -1
        if left < 0:
            ans[0] = max(ans[0], right - left)
            return left - 1
        if right < 0:
            ans[0] = max(ans[0], left - right)
            return right - 1
        return 1 + max(left, right)
    dfs(root)
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
    int ans;
    int dfs(TreeNode node, int start) {
        if (node == null) return 0;
        int L = dfs(node.left, start);
        int R = dfs(node.right, start);
        if (node.val == start) {
            ans = Math.max(ans, Math.max(L, R));
            return -1;
        }
        if (L < 0) { ans = Math.max(ans, R - L); return L - 1; }
        if (R < 0) { ans = Math.max(ans, L - R); return R - 1; }
        return 1 + Math.max(L, R);
    }
    public int amountOfTime(TreeNode root, int start) {
        ans = 0;
        dfs(root, start);
        return ans;
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

int amountOfTime(TreeNode* root, int start) {
    int ans = 0;
    function<int(TreeNode*)> dfs = [&](TreeNode* node) {
        if (!node) return 0;
        int L = dfs(node->left);
        int R = dfs(node->right);
        if (node->val == start) {
            ans = max(ans, max(L, R));
            return -1;
        }
        if (L < 0) { ans = max(ans, R - L); return L - 1; }
        if (R < 0) { ans = max(ans, L - R); return R - 1; }
        return 1 + max(L, R);
    };
    dfs(root);
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

int burnDfs(struct Node* node, int start, int* ans) {
    int L, R;
    if (!node) return 0;
    L = burnDfs(node->left, start, ans);
    R = burnDfs(node->right, start, ans);
    if (node->val == start) {
        if (L > *ans) *ans = L;
        if (R > *ans) *ans = R;
        return -1;
    }
    if (L < 0) { if (R - L > *ans) *ans = R - L; return L - 1; }
    if (R < 0) { if (L - R > *ans) *ans = L - R; return R - 1; }
    return 1 + (L > R ? L : R);
}
int amountOfTime(struct Node* root, int start) {
    int ans = 0;
    burnDfs(root, start, &ans);
    return ans;
}`
          }
        }
      ]
    },
    {
      id: 31,
      level: "beginner",
      q: "Children Sum Property",
      ask: "Amazon · Microsoft · Apple",
      links: [{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/children-sum-parent/1"},{"name":"GFG","url":"https://www.geeksforgeeks.org/check-for-children-sum-property-in-a-binary-tree/"}],
      a: "A tree satisfies children-sum if every node equals the sum of its children (a missing child counts as 0). Leaves are always valid.\n\nCheck bottom-up: after both children are valid, node.val must equal left.val + right.val.\n\nBrute for each node walks the two children only (local check) after confirming subtrees. Optimal is one postorder boolean. More optimal returns the node value upward so you never read a child twice.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "For every node, sum the two children (0 if null) and compare. Recurse both sides. Extra list of all nodes first.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSumTree(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSumTree(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def is_sum_tree(root):
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
    public boolean isSumTree(TreeNode root) {
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

bool isSumTree(TreeNode* root) {
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

void collectN(struct Node* node, struct Node** nodes, int* n) {
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
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Postorder boolean. Null and leaves are true. Then check val == left+right and both subtrees hold.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSumTree(root) {
  if (!root) return true;
  if (!root.left && !root.right) return true;
  const L = root.left ? root.left.val : 0;
  const R = root.right ? root.right.val : 0;
  return root.val === L + R && isSumTree(root.left) && isSumTree(root.right);
}`,
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSumTree(root) {
  if (!root) return true;
  if (!root.left && !root.right) return true;
  const L = root.left ? root.left.val : 0;
  const R = root.right ? root.right.val : 0;
  return root.val === L + R && isSumTree(root.left) && isSumTree(root.right);
}`,
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def is_sum_tree(root):
    if root is None:
        return True
    if root.left is None and root.right is None:
        return True
    left = root.left.val if root.left else 0
    right = root.right.val if root.right else 0
    return root.val == left + right and is_sum_tree(root.left) and is_sum_tree(root.right)`,
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
    public boolean isSumTree(TreeNode root) {
        if (root == null) return true;
        if (root.left == null && root.right == null) return true;
        int L = root.left == null ? 0 : root.left.val;
        int R = root.right == null ? 0 : root.right.val;
        return root.val == L + R && isSumTree(root.left) && isSumTree(root.right);
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

bool isSumTree(TreeNode* root) {
    if (!root) return true;
    if (!root->left && !root->right) return true;
    int L = root->left ? root->left->val : 0;
    int R = root->right ? root->right->val : 0;
    return root->val == L + R && isSumTree(root->left) && isSumTree(root->right);
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

bool isSumTree(struct Node* root) {
    int L, R;
    if (!root) return true;
    if (!root->left && !root->right) return true;
    L = root->left ? root->left->val : 0;
    R = root->right ? root->right->val : 0;
    return root->val == L + R && isSumTree(root->left) && isSumTree(root->right);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(h)",
          why: "Return a pair (ok, val) so a failed subtree aborts. Same checks, one value returned upward.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSumTree(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function isSumTree(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def is_sum_tree(root):
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
    class Pair { boolean ok; int val; Pair(boolean ok, int val) { this.ok = ok; this.val = val; } }
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

pair<bool,int> goSum(TreeNode* node) {
    if (!node) return {true, 0};
    if (!node->left && !node->right) return {true, node->val};
    auto L = goSum(node->left);
    auto R = goSum(node->right);
    bool ok = L.first && R.first && node->val == L.second + R.second;
    return {ok, node->val};
}
bool isSumTree(TreeNode* root) { return goSum(root).first; }`,
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

int goSum(struct Node* node, bool* ok) {
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
          }
        }
      ]
    },
    {
      id: 32,
      level: "intermediate",
      q: "Maximum Width of Binary Tree",
      ask: "Amazon · Google · Meta · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/maximum-width-of-binary-tree/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/maximum-width-of-tree/1"}],
      a: "Width of a level is the number of nodes between the leftmost and rightmost non-null positions on that level, counting the nulls in the middle. A complete heap-index numbering (root 0, left 2*i+1, right 2*i+2) makes width = lastIndex - firstIndex + 1.\n\nGFG 'maximum width of tree' often means count of actual nodes on the widest level (no nulls). LeetCode counts positions. Both are shown: brute is GFG count; optimal/more optimal are the LeetCode index version.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(w)",
          why: "BFS. Width of a level is the queue size (actual nodes). Max over levels. Matches GFG's non-null count.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function widthOfBinaryTree(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function widthOfBinaryTree(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def width_of_binary_tree(root):
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
    public int widthOfBinaryTree(TreeNode root) {
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

int widthOfBinaryTree(TreeNode* root) {
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

int widthOfBinaryTree(struct Node* root) {
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
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(w)",
          why: "LeetCode width: BFS with heap indices. Subtract the first index of the level so numbers stay small. Width = last - first + 1.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function widthOfBinaryTree(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function widthOfBinaryTree(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def width_of_binary_tree(root):
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
    public int widthOfBinaryTree(TreeNode root) {
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

int widthOfBinaryTree(TreeNode* root) {
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

int widthOfBinaryTree(struct Node* root) {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(h)",
          why: "DFS with (depth, normalized index). Store the first index seen at each depth. Width = idx - first[depth] + 1. Recursion only.",
          code: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function widthOfBinaryTree(root) {
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
          codes: {
            javascript: `function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function widthOfBinaryTree(root) {
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
            python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def width_of_binary_tree(root):
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
    List<Integer> first = new ArrayList<Integer>();
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

void goW(TreeNode* node, int d, unsigned long long idx, vector<unsigned long long>& first, int& best) {
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

void goW(struct Node* node, int d, unsigned long long idx, unsigned long long* first, int* seen, int* best) {
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
          }
        }
      ]
    }
  ]
};
