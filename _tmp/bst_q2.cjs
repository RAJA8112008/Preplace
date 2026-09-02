"use strict";
const { tn, sol, LC, GFG, GFG_ART, JS_TN, PY_TN, JAVA_TN, CPP_TN, C_TN, JS_LN, PY_LN, JAVA_LN, CPP_LN, C_LN, block } = require("./bst_meta.cjs");

const questions = [];

questions.push({
  id: 4,
  level: "intermediate",
  q: "Validate Binary Search Tree",
  ask: "Amazon · Meta · Microsoft · Google",
  links: [LC("validate-binary-search-tree"), GFG("check-for-bst")],
  a: "Return true if the tree is a BST: every node is strictly greater than the entire left subtree and strictly smaller than the entire right subtree.\n\nChecking only the two children is wrong. Carry a (min, max) window, or dump inorder and require a strictly increasing sequence.\n\nBrute is inorder into an array. Optimal is recursive ranges with long bounds (node.val can be INT_MIN). More optimal is iterative inorder with a previous pointer.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n)", "O(n)", "Inorder dump all values, then check each pair is strictly increasing. Extra array holds the whole walk.", tn(
`function isValidBST(root) {
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
`def is_valid_bst(root):
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
`    public boolean isValidBST(TreeNode root) {
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
    }`,
`bool isValidBST(TreeNode* root) {
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
`void inorderVals(struct Node* node, int* vals, int* n) {
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
    )),
    sol("Optimal", "O(n)", "O(h)", "Each node must lie in (lo, hi). Left child inherits hi = node.val; right inherits lo = node.val. Use a type wider than int so INT_MIN / INT_MAX are legal node values.", tn(
`function isValidBST(root) {
  function ok(node, lo, hi) {
    if (!node) return true;
    if (node.val <= lo || node.val >= hi) return false;
    return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);
  }
  return ok(root, -Infinity, Infinity);
}`,
`def is_valid_bst(root):
    def ok(node, lo, hi):
        if node is None:
            return True
        if node.val <= lo or node.val >= hi:
            return False
        return ok(node.left, lo, node.val) and ok(node.right, node.val, hi)
    return ok(root, float("-inf"), float("inf"))`,
`    public boolean isValidBST(TreeNode root) {
        return ok(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }
    boolean ok(TreeNode node, long lo, long hi) {
        if (node == null) return true;
        if (node.val <= lo || node.val >= hi) return false;
        return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);
    }`,
`bool isValidBST(TreeNode* root) {
    function<bool(TreeNode*, long long, long long)> ok = [&](TreeNode* node, long long lo, long long hi) {
        if (!node) return true;
        if (node->val <= lo || node->val >= hi) return false;
        return ok(node->left, lo, node->val) && ok(node->right, node->val, hi);
    };
    return ok(root, LLONG_MIN, LLONG_MAX);
}`,
`bool okRange(struct Node* node, long long lo, long long hi) {
    if (!node) return true;
    if (node->val <= lo || node->val >= hi) return false;
    return okRange(node->left, lo, node->val) && okRange(node->right, node->val, hi);
}
bool isValidBST(struct Node* root) {
    return okRange(root, LLONG_MIN, LLONG_MAX);
}`
    )),
    sol("More optimal", "O(n)", "O(h)", "Iterative inorder. Track the previous value. If the current node is not greater, the tree is invalid. No extra value array.", tn(
`function isValidBST(root) {
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
`def is_valid_bst(root):
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
`    public boolean isValidBST(TreeNode root) {
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
    }`,
`bool isValidBST(TreeNode* root) {
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
`bool isValidBST(struct Node* root) {
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
    ))
  ]
});

questions.push({
  id: 5,
  level: "beginner",
  q: "Convert Sorted Array to Binary Search Tree",
  ask: "Microsoft · Amazon · Apple",
  links: [LC("convert-sorted-array-to-binary-search-tree"), GFG("array-to-bst")],
  a: "nums is sorted ascending. Build a height-balanced BST (left and right heights differ by at most 1).\n\nThe middle of a range is the root; the left half becomes the left subtree, the right half the right subtree.\n\nBrute inserts keys one by one into an empty BST (a stick). Optimal picks mid with array slices. More optimal passes lo/hi indices so you never copy the array.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n²)", "O(n)", "Insert 0..n-1 in order into an empty BST. Each insert walks a growing right spine, so you get a linked list of height n.", tn(
`function sortedArrayToBST(nums) {
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
`def sorted_array_to_bst(nums):
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
`    TreeNode insert(TreeNode node, int val) {
        if (node == null) return new TreeNode(val);
        if (val < node.val) node.left = insert(node.left, val);
        else node.right = insert(node.right, val);
        return node;
    }
    public TreeNode sortedArrayToBST(int[] nums) {
        TreeNode root = null;
        for (int val : nums) root = insert(root, val);
        return root;
    }`,
`TreeNode* insertVal(TreeNode* node, int val) {
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
`struct Node* insertVal(struct Node* node, int val) {
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
    )),
    sol("Optimal", "O(n)", "O(n)", "Slice the array around mid each call. Balanced, but each slice copies O(n) elements across the tree of calls.", tn(
`function sortedArrayToBST(nums) {
  if (!nums.length) return null;
  const mid = Math.floor(nums.length / 2);
  const node = new TreeNode(nums[mid]);
  node.left = sortedArrayToBST(nums.slice(0, mid));
  node.right = sortedArrayToBST(nums.slice(mid + 1));
  return node;
}`,
`def sorted_array_to_bst(nums):
    if not nums:
        return None
    mid = len(nums) // 2
    node = TreeNode(nums[mid])
    node.left = sorted_array_to_bst(nums[:mid])
    node.right = sorted_array_to_bst(nums[mid + 1:])
    return node`,
`    public TreeNode sortedArrayToBST(int[] nums) {
        return build(nums, 0, nums.length - 1);
    }
    TreeNode build(int[] nums, int lo, int hi) {
        if (lo > hi) return null;
        int mid = lo + (hi - lo) / 2;
        TreeNode node = new TreeNode(nums[mid]);
        node.left = build(nums, lo, mid - 1);
        node.right = build(nums, mid + 1, hi);
        return node;
    }`,
`TreeNode* sortedArrayToBST(vector<int>& nums) {
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
`struct Node* buildArr(int* nums, int lo, int hi) {
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
    )),
    sol("More optimal", "O(n)", "O(log n)", "Pass inclusive indices. Each node is created once. Recursion depth is the height of the balanced tree.", tn(
`function sortedArrayToBST(nums) {
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
`def sorted_array_to_bst(nums):
    def build(lo, hi):
        if lo > hi:
            return None
        mid = (lo + hi) // 2
        node = TreeNode(nums[mid])
        node.left = build(lo, mid - 1)
        node.right = build(mid + 1, hi)
        return node
    return build(0, len(nums) - 1)`,
`    public TreeNode sortedArrayToBST(int[] nums) {
        return build(nums, 0, nums.length - 1);
    }
    TreeNode build(int[] nums, int lo, int hi) {
        if (lo > hi) return null;
        int mid = lo + (hi - lo) / 2;
        TreeNode node = new TreeNode(nums[mid]);
        node.left = build(nums, lo, mid - 1);
        node.right = build(nums, mid + 1, hi);
        return node;
    }`,
`TreeNode* sortedArrayToBST(vector<int>& nums) {
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
`struct Node* buildArr(int* nums, int lo, int hi) {
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
    ))
  ]
});

questions.push({
  id: 6,
  level: "intermediate",
  q: "Convert Sorted List to Binary Search Tree",
  ask: "Amazon · Google · Microsoft · Meta",
  links: [LC("convert-sorted-list-to-binary-search-tree"), GFG_ART("sorted-linked-list-to-balanced-bst")],
  a: "The input is a sorted singly linked list, not an array. Build the same height-balanced BST.\n\nYou can copy the list into an array and reuse the array solution. Or cut the list at the middle with slow/fast each time. The linear trick simulates inorder: the list pointer walks left-root-right while you create nodes in that order.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
  solutions: [
    sol("Brute", "O(n)", "O(n)", "Walk the list into an array, then build from mid indices. Extra O(n) memory for the copy.", block(
JS_TN + "\n\n" + JS_LN + `

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
PY_TN + PY_LN + `def sorted_list_to_bst(head):
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
JAVA_TN + JAVA_LN + `
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
CPP_TN + "\n" + CPP_LN + `
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
C_TN + "\n" + C_LN + `
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
    )),
    sol("Optimal", "O(n log n)", "O(log n)", "Slow/fast finds the mid. Cut prev.next so the left half is a shorter list. Recurse on left half, mid node, and right half. No array, but each level rescans the list.", block(
JS_TN + "\n\n" + JS_LN + `

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
PY_TN + PY_LN + `def sorted_list_to_bst(head):
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
JAVA_TN + JAVA_LN + `
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
CPP_TN + "\n" + CPP_LN + `
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
C_TN + "\n" + C_LN + `
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
    )),
    sol("More optimal", "O(n)", "O(log n)", "Count n. Inorder-build: recurse left of size n/2, consume the current list node as the root, then recurse right. The list pointer only moves forward. Each node is visited once.", block(
JS_TN + "\n\n" + JS_LN + `

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
PY_TN + PY_LN + `def sorted_list_to_bst(head):
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
JAVA_TN + JAVA_LN + `
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
CPP_TN + "\n" + CPP_LN + `
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
C_TN + "\n" + C_LN + `
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
    ))
  ]
});

module.exports = questions;
