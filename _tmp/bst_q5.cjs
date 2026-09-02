"use strict";
const { tn, sol, LC, GFG, GFG_ART, block, JS_TN, PY_TN, JAVA_TN, CPP_TN, C_TN } = require("./bst_meta.cjs");

const questions = [];

questions.push({
  id: 12,
  level: "intermediate",
  q: "Unique Binary Search Trees",
  ask: "Amazon · Google · Microsoft · Adobe",
  links: [LC("unique-binary-search-trees"), GFG("unique-bsts-1587115623")],
  a: "Given n, count how many structurally different BSTs store the keys 1..n.\n\nIf i is the root, left keys are 1..i-1 and right keys are i+1..n. The counts multiply, then you sum over every choice of root. That recurrence is the Catalan numbers: C(n) = sum C(i)*C(n-1-i).\n\nBrute recurses with no memory. Optimal is bottom-up DP. More optimal multiplies the Catalan formula in O(n).\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(4^n / n^{3/2})", "O(n)", "Naive recursion: try each root and multiply left-count * right-count. Exponential overlapping subproblems.", tn(
`function numTrees(n) {
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
`def num_trees(n):
    def count(length):
        if length <= 1:
            return 1
        total = 0
        for left in range(length):
            total += count(left) * count(length - 1 - left)
        return total
    return count(n)`,
`    public int numTrees(int n) {
        return count(n);
    }
    int count(int len) {
        if (len <= 1) return 1;
        int total = 0;
        for (int left = 0; left < len; left++) total += count(left) * count(len - 1 - left);
        return total;
    }`,
`int countLen(int len) {
    if (len <= 1) return 1;
    int total = 0;
    for (int left = 0; left < len; left++) total += countLen(left) * countLen(len - 1 - left);
    return total;
}
int numTrees(int n) { return countLen(n); }`,
`int countLen(int len) {
    if (len <= 1) return 1;
    int total = 0;
    for (int left = 0; left < len; left++) total += countLen(left) * countLen(len - 1 - left);
    return total;
}
int numTrees(int n) { return countLen(n); }`
    )),
    sol("Optimal", "O(n²)", "O(n)", "dp[k] = number of BSTs on k keys. dp[0]=1. Each k sums dp[left]*dp[k-1-left]. Standard Catalan DP.", tn(
`function numTrees(n) {
  const dp = Array(n + 1).fill(0);
  dp[0] = 1;
  for (let k = 1; k <= n; k++) {
    for (let left = 0; left < k; left++) dp[k] += dp[left] * dp[k - 1 - left];
  }
  return dp[n];
}`,
`def num_trees(n):
    dp = [0] * (n + 1)
    dp[0] = 1
    for k in range(1, n + 1):
        for left in range(k):
            dp[k] += dp[left] * dp[k - 1 - left]
    return dp[n]`,
`    public int numTrees(int n) {
        int[] dp = new int[n + 1];
        dp[0] = 1;
        for (int k = 1; k <= n; k++) {
            for (int left = 0; left < k; left++) dp[k] += dp[left] * dp[k - 1 - left];
        }
        return dp[n];
    }`,
`int numTrees(int n) {
    vector<long long> dp(n + 1);
    dp[0] = 1;
    for (int k = 1; k <= n; k++)
        for (int left = 0; left < k; left++) dp[k] += dp[left] * dp[k - 1 - left];
    return (int)dp[n];
}`,
`int numTrees(int n) {
    long long dp[25];
    int i, left, k;
    for (i = 0; i <= n; i++) dp[i] = 0;
    dp[0] = 1;
    for (k = 1; k <= n; k++)
        for (left = 0; left < k; left++) dp[k] += dp[left] * dp[k - 1 - left];
    return (int)dp[n];
}`
    )),
    sol("More optimal", "O(n)", "O(1)", "C(n) = C(n-1) * 2(2n-1)/(n+1). Multiply carefully with integer arithmetic. One pass, constant extra memory.", tn(
`function numTrees(n) {
  let c = 1;
  for (let i = 2; i <= n; i++) c = c * 2 * (2 * i - 1) / (i + 1);
  return Math.round(c);
}`,
`def num_trees(n):
    c = 1
    for i in range(2, n + 1):
        c = c * 2 * (2 * i - 1) // (i + 1)
    return c`,
`    public int numTrees(int n) {
        long c = 1;
        for (int i = 2; i <= n; i++) c = c * 2 * (2L * i - 1) / (i + 1);
        return (int) c;
    }`,
`int numTrees(int n) {
    long long c = 1;
    for (int i = 2; i <= n; i++) c = c * 2 * (2LL * i - 1) / (i + 1);
    return (int)c;
}`,
`int numTrees(int n) {
    long long c = 1;
    for (int i = 2; i <= n; i++) c = c * 2 * (2LL * i - 1) / (i + 1);
    return (int)c;
}`
    ))
  ]
});

questions.push({
  id: 13,
  level: "advanced",
  q: "Unique Binary Search Trees II",
  ask: "Amazon · Google · Microsoft",
  links: [LC("unique-binary-search-trees-ii"), GFG_ART("construct-all-possible-bsts-for-keys-1-to-n")],
  a: "Return every structurally different BST that stores 1..n, not just the count.\n\nPick each value as root, generate all left trees on the smaller keys and all right trees on the larger keys, then attach every pair.\n\nBrute inserts every permutation and keeps unique shapes. Optimal is divide-and-conquer on [lo, hi]. More optimal memos each [lo, hi] so shared ranges are built once.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n · n!)", "O(n · n!)", "Generate every permutation of 1..n, insert into a BST, serialize the shape, keep one copy per unique serialization. Correct but factorial.", tn(
`function generateTrees(n) {
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
`def generate_trees(n):
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
`    public List<TreeNode> generateTrees(int n) {
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
    }`,
`TreeNode* insertVal(TreeNode* node, int val) {
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
`struct Node* insertVal(struct Node* node, int val) {
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
    )),
    sol("Optimal", "O(C(n) · n)", "O(C(n) · n)", "For each root i in [lo, hi], cartesian product of left trees and right trees. Empty range yields a single null tree so a missing child is represented once.", tn(
`function generateTrees(n) {
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
`def generate_trees(n):
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
`    public List<TreeNode> generateTrees(int n) {
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
    }`,
`vector<TreeNode*> build(int lo, int hi) {
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
`int buildTrees(int lo, int hi, struct Node** out) {
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
    )),
    sol("More optimal", "O(C(n) · n)", "O(C(n) · n)", "Memoize [lo, hi]. Shared ranges (for example all trees on 3,4,5) are built once. Catalan many trees still must be allocated.", tn(
`function generateTrees(n) {
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
`def generate_trees(n):
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
`    Map<String, List<TreeNode>> memo = new HashMap<String, List<TreeNode>>();
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
    }`,
`map<pair<int,int>, vector<TreeNode*>> memo;
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
`struct Memo { int lo, hi, n; struct Node* trees[400]; };
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
    ))
  ]
});

module.exports = questions;
