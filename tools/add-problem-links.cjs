const fs = require("fs");
const path = require("path");

const LC = (slug) => `https://leetcode.com/problems/${slug}/`;
const GFG = (slug) => `https://www.geeksforgeeks.org/problems/${slug}/1`;
const GFG_ART = (slug) => `https://www.geeksforgeeks.org/${slug}/`;
const LINT = (id) => `https://www.lintcode.com/problem/${id}/`;

const pair = (lc, gfg, extra) => {
  const links = [];
  if (lc) links.push({ name: "LeetCode", url: LC(lc) });
  if (gfg) links.push({ name: "GFG", url: gfg.startsWith("http") ? gfg : GFG(gfg) });
  if (extra) links.push(extra);
  return links;
};

const MAP = {
  "Two Sum": pair("two-sum", "key-pair5616"),
  "Best Time to Buy and Sell Stock": pair("best-time-to-buy-and-sell-stock", "best-time-to-buy-and-sell-stock"),
  "Contains Duplicate": pair("contains-duplicate", GFG_ART("find-duplicates-in-on-time-and-constant-extra-space")),
  "Product of Array Except Self": pair("product-of-array-except-self", "product-array-puzzle170547"),
  "Maximum Subarray (Kadane)": pair("maximum-subarray", "kadanes-algorithm-1587115620"),
  "Maximum Product Subarray": pair("maximum-product-subarray", "maximum-product-subarray3604"),
  "Merge Intervals": pair("merge-intervals", "overlapping-intervals--170633"),
  "Insert Interval": pair("insert-interval", "insert-interval-1666733333"),
  "3Sum": pair("3sum", "triplet-sum-in-array-1587115621"),
  "Container With Most Water": pair("container-with-most-water", "container-with-most-water0535"),
  "Trapping Rain Water": pair("trapping-rain-water", "trapping-rain-water-1587115621"),
  "Rotate Array": pair("rotate-array", "rotate-array-by-n-elements-1587115621"),
  "Set Matrix Zeroes": pair("set-matrix-zeroes", "boolean-matrix-problem-1587115620"),
  "Spiral Matrix": pair("spiral-matrix", "spirally-traversing-a-matrix-1587115621"),
  "Next Permutation": pair("next-permutation", "next-permutation5226"),
  "Sort Colors (Dutch flag)": pair("sort-colors", "sort-an-array-of-0s-1s-and-2s4231"),
  "Find the Duplicate Number": pair("find-the-duplicate-number", "find-duplicates-in-an-array"),
  "Subarray Sum Equals K": pair("subarray-sum-equals-k", "subarray-range-with-given-sum0128"),
  "Longest Consecutive Sequence": pair("longest-consecutive-sequence", "longest-consecutive-subsequence-1587115621"),
  "First Missing Positive": pair("first-missing-positive", "smallest-positive-missing-number-1587115621"),
  "Jump Game": pair("jump-game", "jump-game"),
  "Search in Rotated Sorted Array": pair("search-in-rotated-sorted-array", "search-in-a-rotated-array4618"),
  "Majority Element": pair("majority-element", "majority-element-1587115620"),
  "Move Zeroes": pair("move-zeroes", "move-all-zeroes-to-end-of-array0751"),
  "Missing Number": pair("missing-number", "missing-number-in-array1416"),

  "Valid Anagram": pair("valid-anagram", "anagram-1587115620"),
  "Valid Palindrome": pair("valid-palindrome", "palindrome-string0817"),
  "Longest Substring Without Repeating Characters": pair("longest-substring-without-repeating-characters", "longest-distinct-characters-in-string5848"),
  "Longest Palindromic Substring": pair("longest-palindromic-substring", "longest-palindrome-in-a-string3411"),
  "Group Anagrams": pair("group-anagrams", "print-anagrams-together"),
  "Valid Parentheses": pair("valid-parentheses", "parenthesis-checker2744"),
  "Longest Common Prefix": pair("longest-common-prefix", "longest-common-prefix-in-an-array5129"),
  "Reverse Words in a String": pair("reverse-words-in-a-string", "reverse-words-in-a-given-string5459"),
  "String to Integer (atoi)": pair("string-to-integer-atoi", "implement-atoi"),
  "Find the Index of the First Occurrence in a String": pair("find-the-index-of-the-first-occurrence-in-a-string", "implement-strstr"),
  "Minimum Window Substring": pair("minimum-window-substring", "smallest-window-in-a-string-containing-all-the-characters-of-another-string-1587115621"),
  "Longest Repeating Character Replacement": pair("longest-repeating-character-replacement", GFG_ART("longest-repeating-character-replacement")),
  "Valid Palindrome II": pair("valid-palindrome-ii", GFG_ART("remove-character-string-make-palindrome")),
  "Encode and Decode Strings": pair("encode-and-decode-strings", GFG_ART("encode-and-decode-strings"), { name: "LintCode", url: LINT("659") }),
  "Word Break": pair("word-break", "word-break-2"),
  "Palindromic Substrings": pair("palindromic-substrings", GFG_ART("count-palindrome-sub-strings-of-a-string")),
  "Roman to Integer": pair("roman-to-integer", "roman-number-to-integer3201"),
  "Integer to Roman": pair("integer-to-roman", "convert-to-roman-no-1587115621"),
  "Permutation in String": pair("permutation-in-string", GFG_ART("permutation-in-string")),
  "Longest Palindrome": pair("longest-palindrome", "longest-palindrome-in-a-string3411"),

  "Reverse Linked List": pair("reverse-linked-list", "reverse-a-linked-list"),
  "Linked List Cycle": pair("linked-list-cycle", "detect-loop-in-linked-list"),
  "Linked List Cycle II": pair("linked-list-cycle-ii", "find-the-first-node-of-loop-in-linked-list--170685"),
  "Merge Two Sorted Lists": pair("merge-two-sorted-lists", "merge-two-sorted-linked-lists"),
  "Remove Nth Node From End of List": pair("remove-nth-node-from-end-of-list", "remove-nth-node-from-end-of-the-list"),
  "Palindrome Linked List": pair("palindrome-linked-list", "check-if-linked-list-is-pallindrome"),
  "Middle of the Linked List": pair("middle-of-the-linked-list", "finding-middle-element-in-a-linked-list"),
  "Intersection of Two Linked Lists": pair("intersection-of-two-linked-lists", "intersection-point-in-y-shapped-linked-lists"),
  "Add Two Numbers": pair("add-two-numbers", "add-two-numbers-represented-by-linked-lists"),
  "Reverse Nodes in k-Group": pair("reverse-nodes-in-k-group", "reverse-a-linked-list-in-groups-of-given-size"),
  "Copy List with Random Pointer": pair("copy-list-with-random-pointer", "clone-a-linked-list-with-next-and-random-pointer"),
  "Sort List": pair("sort-list", "sort-a-linked-list"),
  "Remove Duplicates from Sorted List": pair("remove-duplicates-from-sorted-list", "remove-duplicate-element-from-sorted-linked-list"),
  "Swap Nodes in Pairs": pair("swap-nodes-in-pairs", "pairwise-swap-elements-of-a-linked-list-by-swapping-data"),
  "Rotate List": pair("rotate-list", "rotate-a-linked-list"),
  "Flatten a Multilevel Doubly Linked List": pair("flatten-a-multilevel-doubly-linked-list", "flattening-a-linked-list"),
  "Odd Even Linked List": pair("odd-even-linked-list", GFG_ART("odd-even-linked-list")),
  "LRU Cache": pair("lru-cache", "lru-cache-page-replacement"),

  "Binary Tree Inorder Traversal": pair("binary-tree-inorder-traversal", "inorder-traversal"),
  "Binary Tree Level Order Traversal": pair("binary-tree-level-order-traversal", "level-order-traversal"),
  "Maximum Depth of Binary Tree": pair("maximum-depth-of-binary-tree", "height-of-binary-tree"),
  "Invert Binary Tree": pair("invert-binary-tree", "mirror-tree"),
  "Same Tree": pair("same-tree", "determine-if-two-trees-are-identical"),
  "Symmetric Tree": pair("symmetric-tree", "symmetric-tree"),
  "Lowest Common Ancestor of a BST": pair("lowest-common-ancestor-of-a-binary-search-tree", "lowest-common-ancestor-in-a-bst"),
  "Lowest Common Ancestor of a Binary Tree": pair("lowest-common-ancestor-of-a-binary-tree", "lowest-common-ancestor-in-a-binary-tree"),
  "Validate Binary Search Tree": pair("validate-binary-search-tree", "check-for-bst"),
  "Diameter of Binary Tree": pair("diameter-of-binary-tree", "diameter-of-binary-tree"),
  "Path Sum": pair("path-sum", "root-to-leaf-path-sum"),
  "Flatten Binary Tree to Linked List": pair("flatten-binary-tree-to-linked-list", "flatten-binary-tree-to-linked-list"),
  "Serialize and Deserialize Binary Tree": pair("serialize-and-deserialize-binary-tree", "serialize-and-deserialize-a-binary-tree"),
  "Construct Binary Tree from Preorder and Inorder": pair("construct-binary-tree-from-preorder-and-inorder-traversal", "construct-tree-1"),
  "Kth Smallest Element in a BST": pair("kth-smallest-element-in-a-bst", "find-k-th-smallest-element-in-bst"),
  "Binary Tree Right Side View": pair("binary-tree-right-side-view", "right-view-of-binary-tree"),
  "Balanced Binary Tree": pair("balanced-binary-tree", "check-for-balanced-tree-1587115620"),
  "Subtree of Another Tree": pair("subtree-of-another-tree", "check-if-subtree"),
  "Binary Tree Maximum Path Sum": pair("binary-tree-maximum-path-sum", "maximum-path-sum-from-any-node"),
  "Count Complete Tree Nodes": pair("count-complete-tree-nodes", GFG_ART("count-complete-tree-nodes")),

  "Number of Islands": pair("number-of-islands", "find-the-number-of-islands"),
  "Clone Graph": pair("clone-graph", "clone-graph"),
  "Course Schedule": pair("course-schedule", "prerequisite-tasks"),
  "Course Schedule II": pair("course-schedule-ii", "course-schedule"),
  "Pacific Atlantic Water Flow": pair("pacific-atlantic-water-flow", GFG_ART("pacific-atlantic-water-flow")),
  "Graph Valid Tree": pair("graph-valid-tree", GFG_ART("graph-valid-tree"), { name: "LintCode", url: LINT("178") }),
  "Number of Connected Components in an Undirected Graph": pair("number-of-connected-components-in-an-undirected-graph", "number-of-provinces"),
  "Word Ladder": pair("word-ladder", "word-ladder"),
  "Rotting Oranges": pair("rotting-oranges", "rotten-oranges"),
  "01 Matrix": pair("01-matrix", "distance-of-nearest-cell-having-1-1587115620"),
  "Alien Dictionary": pair("alien-dictionary", "alien-dictionary"),
  "Network Delay Time": pair("network-delay-time", GFG_ART("network-delay-time")),
  "Cheapest Flights Within K Stops": pair("cheapest-flights-within-k-stops", GFG_ART("cheapest-flights-within-k-stops")),
  "Accounts Merge": pair("accounts-merge", GFG_ART("accounts-merge")),
  "Surrounded Regions": pair("surrounded-regions", "replace-os-with-xs"),
  "Flood Fill": pair("flood-fill", "flood-fill-algorithm1856"),
  "Shortest Path in Binary Matrix": pair("shortest-path-in-binary-matrix", GFG_ART("shortest-path-in-a-binary-maze")),
  "Detect Cycle in a Directed Graph": pair("course-schedule", "detect-cycle-in-a-directed-graph"),

  "Min Stack": pair("min-stack", "get-min-at-pop"),
  "Daily Temperatures": pair("daily-temperatures", GFG_ART("daily-temperatures")),
  "Next Greater Element I": pair("next-greater-element-i", "next-larger-element-1587115620"),
  "Evaluate Reverse Polish Notation": pair("evaluate-reverse-polish-notation", "evaluation-of-postfix-expression1735"),
  "Largest Rectangle in Histogram": pair("largest-rectangle-in-histogram", "maximum-rectangular-area-in-a-histogram-1587115623"),
  "Sliding Window Maximum": pair("sliding-window-maximum", "maximum-of-all-subarrays-of-size-k3101"),
  "Implement Queue using Stacks": pair("implement-queue-using-stacks", "queue-using-two-stacks"),
  "Implement Stack using Queues": pair("implement-stack-using-queues", "stack-using-two-queues"),
  "Kth Largest Element in an Array": pair("kth-largest-element-in-an-array", "kth-largest-element-in-an-array"),
  "Top K Frequent Elements": pair("top-k-frequent-elements", "top-k-frequent-elements-in-array"),
  "Merge k Sorted Lists": pair("merge-k-sorted-lists", "merge-k-sorted-linked-lists"),
  "Find Median from Data Stream": pair("find-median-from-data-stream", "find-median-in-a-stream-1587115620"),
  "Task Scheduler": pair("task-scheduler", GFG_ART("task-scheduler")),
  "Car Fleet": pair("car-fleet", GFG_ART("car-fleet")),
  "Decode String": pair("decode-string", "decode-the-string-1587115620"),

  "Climbing Stairs": pair("climbing-stairs", "count-ways-to-reach-the-nth-stair-1587115620"),
  "House Robber": pair("house-robber", "stickler-theif-1587115621"),
  "House Robber II": pair("house-robber-ii", GFG_ART("house-robber-ii")),
  "Coin Change": pair("coin-change", "number-of-coins1824"),
  "Longest Increasing Subsequence": pair("longest-increasing-subsequence", "longest-increasing-subsequence-1587115620"),
  "Longest Common Subsequence": pair("longest-common-subsequence", "longest-common-subsequence-1587115620"),
  "Unique Paths": pair("unique-paths", "number-of-unique-paths5339"),
  "Unique Paths II": pair("unique-paths-ii", GFG_ART("unique-paths-in-a-grid-with-obstacles")),
  "Jump Game II": pair("jump-game-ii", "minimum-number-of-jumps-1587115620"),
  "Partition Equal Subset Sum": pair("partition-equal-subset-sum", "subset-sum-problem2014"),
  "0/1 Knapsack": pair(null, "0-1-knapsack-problem0945", { name: "GFG Article", url: GFG_ART("0-1-knapsack-problem-dp-10") }),
  "Edit Distance": pair("edit-distance", "edit-distance3702"),
  "Decode Ways": pair("decode-ways", "total-decoding-messages1235"),
  "Best Time to Buy and Sell Stock II": pair("best-time-to-buy-and-sell-stock-ii", GFG_ART("stock-buy-sell")),
  "Best Time to Buy and Sell Stock with Cooldown": pair("best-time-to-buy-and-sell-stock-with-cooldown", GFG_ART("buy-and-sell-stocks-with-cooldown")),
  "Target Sum": pair("target-sum", GFG_ART("target-sum")),
  "Combination Sum": pair("combination-sum", "combination-sum-1587115620")
};

const files = [
  "dsa-arrays.js",
  "dsa-strings.js",
  "dsa-linkedlist.js",
  "dsa-tree.js",
  "dsa-graph.js",
  "dsa-stackheap.js",
  "dsa-dp.js"
];

const root = path.join(__dirname, "..", "frontend", "data");
let added = 0;
let missing = [];

for (const file of files) {
  let src = fs.readFileSync(path.join(root, file), "utf8");
  for (const [title, links] of Object.entries(MAP)) {
    const qLine = `q: ${JSON.stringify(title)},`;
    const idx = src.indexOf(qLine);
    if (idx === -1) continue;
    const afterQ = src.slice(idx);
    if (afterQ.slice(0, 400).includes("links:")) continue;
    const askMatch = afterQ.match(/ask: "[^"]*",\r?\n/);
    if (!askMatch) {
      missing.push(title + " (no ask)");
      continue;
    }
    const insertAt = idx + afterQ.indexOf(askMatch[0]) + askMatch[0].length;
    const block = `      links: ${JSON.stringify(links)},\n`;
    src = src.slice(0, insertAt) + block + src.slice(insertAt);
    added++;
  }
  fs.writeFileSync(path.join(root, file), src);
}

const vm = require("vm");
const ctx = { window: {} };
vm.createContext(ctx);
for (const file of files) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), ctx);
}
for (const id of Object.keys(ctx.window.PREP_DATA).filter((k) => k.startsWith("dsa-"))) {
  const no = ctx.window.PREP_DATA[id].questions.filter((q) => !q.links || !q.links.length);
  if (no.length) missing.push(...no.map((q) => id + ": " + q.q));
  console.log(id, "with-links", ctx.window.PREP_DATA[id].questions.filter((q) => q.links && q.links.length).length, "/", ctx.window.PREP_DATA[id].questions.length);
}
console.log("inserted", added);
if (missing.length) console.log("missing", missing);
