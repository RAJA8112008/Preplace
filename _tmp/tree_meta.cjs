"use strict";
const {
  JS_TN, PY_TN, JAVA_TN, CPP_TN, C_TN,
  JS_NN, PY_NN, JAVA_NN, CPP_NN, C_NN,
  tn, sol, LC, GFG, GFG_ART, block, desc
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
    title: "Views of a tree",
    body: "A view is the nodes you would see standing on one side. Left view: first node of each depth (DFS with a depth mark, or BFS taking the first in the queue). Right view: last of each level. Top view: first node at each horizontal distance (hd), usually from a BFS so the shallower node wins. Bottom view: last node at each hd, so BFS overwrite works. Vertical order lists every node in an hd column, top-to-bottom, left-to-right within a row."
  },
  {
    title: "Zigzag and next pointers",
    body: "Zigzag (spiral) is level order that flips direction each row: left-to-right, then right-to-left. A deque, or a normal BFS plus reverse on odd rows, both work. Populating next-right pointers is level order where each node.right neighbor is node.next. On a perfect tree you can walk the next links themselves and use O(1) extra memory. Distance-K and 'time to infect' turn the tree into an undirected graph with parent pointers, then BFS from the start node."
  }
];

const examples = [
  ex(
    "11. Vertical columns by horizontal distance",
    desc(
      "Give the root hd 0. Left child is hd - 1, right child is hd + 1.\nNodes that share an hd sit in the same vertical column.\nBFS visits top to bottom so you can push into a map of columns.",
      "Queue stores [node, hd].\nA map (or an array shifted so hd can be negative) collects values per column.\nWalking columns from min hd to max hd is the vertical order.",
      "DFS without a row index can scramble top-to-bottom order in a column.\nLeetCode's 'vertical order traversal' also sorts by row, then by value."
    ),
    JS_TN + `

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
    PY_TN + `from collections import deque
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
    JAVA_TN + `
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
    CPP_TN + `
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
    C_TN + `
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
  ),
  ex(
    "12. Zigzag (spiral) level order",
    desc(
      "Same as level order, but odd rows (0-based) print right to left.\nA deque lets you pop from the front or back and push on the opposite end.\nReversing a finished row is the simpler picture.",
      "BFS one level at a time into an array.\nIf the level index is odd, reverse that array before storing it.\nEmpty tree yields [].",
      "Do not reverse the queue itself or the next level comes out shuffled.\nGFG 'zigzag tree traversal' is this walk flattened into one list."
    ),
    JS_TN + `

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
    PY_TN + `from collections import deque
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
    JAVA_TN + `
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
    CPP_TN + `
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
    C_TN + `
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
  )
];

module.exports = { notes, examples, tn, sol, LC, GFG, GFG_ART, block, JS_TN, PY_TN, JAVA_TN, CPP_TN, C_TN, JS_NN, PY_NN, JAVA_NN, CPP_NN, C_NN };
