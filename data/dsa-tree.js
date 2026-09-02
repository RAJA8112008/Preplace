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
    }
  ]
};
