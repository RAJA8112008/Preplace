window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["dsa-backtracking"] = {
  kind: "dsa",
  notes: [
    { title: "What backtracking is", body: "Backtracking is recursive search with an undo. You make a choice, explore every path that still looks legal, then reverse the choice so the next sibling can try a different one. The call tree is the set of partial answers. Subsets, permutations, N-Queens, mazes, and Sudoku are the same skeleton: choose, recurse, unchoose. If a partial answer already breaks a rule, you return without going deeper. That early return is pruning. Interviewers want to hear the undo, not only the recursion." },
    { title: "Choose, explore, unchoose", body: "The three lines that matter are push, recurse, pop (or mark, recurse, unmark). The path array is shared. Push records the choice. Recurse explores every completion of that path. Pop restores the array for the next choice. If you copy the whole path on every call instead of mutating one array, you still get a correct answer, but you pay extra allocations. That copy-everywhere style is the usual brute version. The interview finish line is one path plus undo." },
    { title: "The decision tree", body: "Draw n = 2 or n = 3 on paper. Each level is one decision: take or skip this number, pick the next unused index, place a queen in this row. Leaves are complete answers (or dead ends). The number of leaves is why time is often O(2^n), O(n!), or O(n^n). Depth of the tree is the recursion stack, usually O(n). Naming the branching factor and the depth is the complexity proof. If you cannot draw the tree, you are not ready to code." },
    { title: "Subsets, permutations, combinations", body: "Subsets: each element is in or out. Order does not matter, so you move an index forward and never look back. Permutations: order matters, so you pick any unused element next and a used[] (or an in-place swap) stops reuse. Combinations: order does not matter and you often have a target sum or a length k. Combination Sum may reuse the same value, so the recursive call stays on the same index. Combination Sum II uses each index at most once and skips duplicate values after a sort. Pick the family before you pick the loop." },
    { title: "Duplicates and sorting", body: "When the input can repeat (Subsets II, Permutations II, Combination Sum II), sort first. Then skip a value if it equals the previous value and you are at the same decision level. The skip is if (i > start && nums[i] === nums[i - 1]) continue. Without the sort, that check does not mean “duplicate.” Generating everything and stuffing strings into a Set is the brute unique trick. It works on tiny n and fails the follow-up about duplicates." },
    { title: "Pruning", body: "Pruning means returning before a leaf when the partial answer cannot win. Remain is already negative. You have more closes than opens. The remaining string is too short to finish four IP parts. A queen already attacks this square. Sort candidates and break when nums[i] > remain so the later larger values are never tried. Prune does not change the first correct answer you would have found; it only cuts losing branches. Say that out loud. Interviewers listen for it after the plain backtrack." },
    { title: "Constraint boards: queens and Sudoku", body: "N-Queens and Sudoku are constraint problems. A row, column, or box may hold at most one of a thing. The brute way builds a full board (or a full permutation of columns) and only then asks “is this legal?” The standard backtrack asks before placing: is this column free, is this diagonal free, is this digit free in the box. Bitmasks (or boolean arrays) make those checks O(1). Sudoku’s extra trick is to fill the emptiest cell next so failing digits die sooner." },
    { title: "Grids: word search and mazes", body: "A grid is a graph. From a cell you try up, down, left, right. You must not reuse a cell on the current path, so you mark it (change the letter, or set visited), recurse, then unmark. Copying a whole visited matrix on every call is the slow brute. Mark/unmark is the standard. Word Search returns true on the first full match. A maze collects every path string from start to end. Bound-check every neighbor. The four-direction array [[1,0],[-1,0],[0,1],[0,-1]] keeps the code short." },
    { title: "Copying the path vs mutating it", body: "When you reach a leaf you must snapshot the path: ans.push(path.slice()) in JavaScript, new ArrayList(path) in Java. If you push the same array object, every answer mutates together and you print n copies of the last path. That bug shows up in every language. Brute solutions often pass path.concat([x]) so each call owns a new array and there is no pop. That is easier to write and heavier on memory. Optimal solutions mutate one path and copy only at the leaf." },
    { title: "Time, space, and the stack", body: "Time is (branching factor ^ depth) times work per node, unless pruning cuts it. Subsets is O(n * 2^n) because each of 2^n subsets is copied in O(n). Permutations is O(n * n!). N-Queens is roughly O(n!) with pruning, O(n^n) if you try every column blindly. Extra space is the path plus the call stack, both O(n) or O(n^2) for a board, plus the output. Output size does not always count against you, but mention it. Recursion depth on a huge grid can blow the stack; interviews still want the recursive story first." }
  ],
  examples: [
    {
      lang: "js",
      title: "1. Choose or skip (subset skeleton)",
      desc: "What this is\nEach number is in the subset or out of it. That is two recursive calls per index. The leaves are the 2^n subsets.\n\nWhat the code is doing\ngo(i, path) is “decide nums[i]”. First it skips: same path, i + 1. Then it pushes nums[i], recurses, and pops. When i hits the end, path.slice() stores a snapshot.\n\nWatch out\nIf you push path itself, every answer shares one array and they all become the last path. slice() (or a copy) is required at the leaf.",
      code: `function subsets(nums) {
  const ans = [];
  function go(i, path) {
    if (i === nums.length) {
      ans.push(path.slice());
      return;
    }
    go(i + 1, path);
    path.push(nums[i]);
    go(i + 1, path);
    path.pop();
  }
  go(0, []);
  return ans;
}

console.log(subsets([1, 2])); // [[],[2],[1],[1,2]]`,
      codes: {
        javascript: `function subsets(nums) {
  const ans = [];
  function go(i, path) {
    if (i === nums.length) {
      ans.push(path.slice());
      return;
    }
    go(i + 1, path);
    path.push(nums[i]);
    go(i + 1, path);
    path.pop();
  }
  go(0, []);
  return ans;
}

console.log(subsets([1, 2])); // [[],[2],[1],[1,2]]`,
        python: `def subsets(nums):
  ans = []
  def go(i, path):
    if i == len(nums):
      ans.append(path[:])
      return
    go(i + 1, path)
    path.append(nums[i])
    go(i + 1, path)
    path.pop()
  go(0, [])
  return ans

print(subsets([1, 2]))  # [[],[2],[1],[1,2]]`,
        java: `import java.util.*;
class Solution {
  public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(nums, 0, new ArrayList<Integer>(), ans);
    return ans;
  }
  void go(int[] nums, int i, List<Integer> path, List<List<Integer>> ans) {
    if (i == nums.length) {
      ans.add(new ArrayList<Integer>(path));
      return;
    }
    go(nums, i + 1, path, ans);
    path.add(nums[i]);
    go(nums, i + 1, path, ans);
    path.remove(path.size() - 1);
  }
}`,
        cpp: `void go(vector<int>& nums, int i, vector<int>& path, vector<vector<int>>& ans) {
  if (i == (int)nums.size()) { ans.push_back(path); return; }
  go(nums, i + 1, path, ans);
  path.push_back(nums[i]);
  go(nums, i + 1, path, ans);
  path.pop_back();
}
vector<vector<int>> subsets(vector<int>& nums) {
  vector<vector<int>> ans;
  vector<int> path;
  go(nums, 0, path, ans);
  return ans;
}`,
        c: `/* path[0..len) is the current subset. Print at a leaf. */
void goSubsets(int* nums, int n, int i, int* path, int len) {
  int k;
  if (i == n) {
    printf("[");
    for (k = 0; k < len; k++) { if (k) printf(","); printf("%d", path[k]); }
    printf("]\\n");
    return;
  }
  goSubsets(nums, n, i + 1, path, len);
  path[len] = nums[i];
  goSubsets(nums, n, i + 1, path, len + 1);
}`
      }
    },
    {
      lang: "js",
      title: "2. Push, recurse, pop (the undo)",
      desc: "What this is\nThe for-loop form of subsets. At each start index you record the path as an answer, then try every later number as the next pick.\n\nWhat the code is doing\nEvery call first snapshots path. Then i runs from start to the end. Push nums[i], recurse with start = i + 1, pop. You never pick an earlier index, so [1,2] and [2,1] are not both listed.\n\nWatch out\nstart = i + 1 means each index is used at most once. Combination Sum that reuses a value calls go(i, ...) not go(i + 1, ...).",
      code: `function subsetsLoop(nums) {
  const ans = [];
  function go(start, path) {
    ans.push(path.slice());
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      go(i + 1, path);
      path.pop();
    }
  }
  go(0, []);
  return ans;
}

console.log(subsetsLoop([1, 2, 3]).length); // 8`,
      codes: {
        javascript: `function subsetsLoop(nums) {
  const ans = [];
  function go(start, path) {
    ans.push(path.slice());
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      go(i + 1, path);
      path.pop();
    }
  }
  go(0, []);
  return ans;
}

console.log(subsetsLoop([1, 2, 3]).length); // 8`,
        python: `def subsetsLoop(nums):
  ans = []
  def go(start, path):
    ans.append(path[:])
    for i in range(start, len(nums)):
      path.append(nums[i])
      go(i + 1, path)
      path.pop()
  go(0, [])
  return ans

print(len(subsetsLoop([1, 2, 3])))  # 8`,
        java: `import java.util.*;
class Solution {
  public List<List<Integer>> subsetsLoop(int[] nums) {
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(nums, 0, new ArrayList<Integer>(), ans);
    return ans;
  }
  void go(int[] nums, int start, List<Integer> path, List<List<Integer>> ans) {
    ans.add(new ArrayList<Integer>(path));
    for (int i = start; i < nums.length; i++) {
      path.add(nums[i]);
      go(nums, i + 1, path, ans);
      path.remove(path.size() - 1);
    }
  }
}`,
        cpp: `void goLoop(vector<int>& nums, int start, vector<int>& path, vector<vector<int>>& ans) {
  ans.push_back(path);
  for (int i = start; i < (int)nums.size(); i++) {
    path.push_back(nums[i]);
    goLoop(nums, i + 1, path, ans);
    path.pop_back();
  }
}`,
        c: `void goLoop(int* nums, int n, int start, int* path, int len) {
  int i, k;
  printf("[");
  for (k = 0; k < len; k++) { if (k) printf(","); printf("%d", path[k]); }
  printf("]\\n");
  for (i = start; i < n; i++) {
    path[len] = nums[i];
    goLoop(nums, n, i + 1, path, len + 1);
  }
}`
      }
    },
    {
      lang: "js",
      title: "3. Permutations with a used array",
      desc: "What this is\nA permutation picks any unused index next. used[j] is true while nums[j] sits on the path.\n\nWhat the code is doing\nWhen path length equals n, we snapshot. Otherwise we try every j. If used[j] is true, skip. Mark, push, recurse, pop, unmark. For [1, 2] the answers are [1,2] and [2,1].\n\nWatch out\nForgetting to set used[j] = false after the recurse locks that number forever. Duplicates need a sort-and-skip, not this raw used[].",
      code: `function permute(nums) {
  const ans = [];
  const used = Array(nums.length).fill(false);
  function go(path) {
    if (path.length === nums.length) {
      ans.push(path.slice());
      return;
    }
    for (let j = 0; j < nums.length; j++) {
      if (used[j]) continue;
      used[j] = true;
      path.push(nums[j]);
      go(path);
      path.pop();
      used[j] = false;
    }
  }
  go([]);
  return ans;
}

console.log(permute([1, 2])); // [[1,2],[2,1]]`,
      codes: {
        javascript: `function permute(nums) {
  const ans = [];
  const used = Array(nums.length).fill(false);
  function go(path) {
    if (path.length === nums.length) {
      ans.push(path.slice());
      return;
    }
    for (let j = 0; j < nums.length; j++) {
      if (used[j]) continue;
      used[j] = true;
      path.push(nums[j]);
      go(path);
      path.pop();
      used[j] = false;
    }
  }
  go([]);
  return ans;
}

console.log(permute([1, 2])); // [[1,2],[2,1]]`,
        python: `def permute(nums):
  ans = []
  used = [False] * len(nums)
  def go(path):
    if len(path) == len(nums):
      ans.append(path[:])
      return
    for j in range(len(nums)):
      if used[j]:
        continue
      used[j] = True
      path.append(nums[j])
      go(path)
      path.pop()
      used[j] = False
  go([])
  return ans

print(permute([1, 2]))  # [[1,2],[2,1]]`,
        java: `import java.util.*;
class Solution {
  public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(nums, new boolean[nums.length], new ArrayList<Integer>(), ans);
    return ans;
  }
  void go(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> ans) {
    if (path.size() == nums.length) {
      ans.add(new ArrayList<Integer>(path));
      return;
    }
    for (int j = 0; j < nums.length; j++) {
      if (used[j]) continue;
      used[j] = true;
      path.add(nums[j]);
      go(nums, used, path, ans);
      path.remove(path.size() - 1);
      used[j] = false;
    }
  }
}`,
        cpp: `void goPerm(vector<int>& nums, vector<int>& used, vector<int>& path, vector<vector<int>>& ans) {
  if ((int)path.size() == (int)nums.size()) { ans.push_back(path); return; }
  for (int j = 0; j < (int)nums.size(); j++) {
    if (used[j]) continue;
    used[j] = 1; path.push_back(nums[j]);
    goPerm(nums, used, path, ans);
    path.pop_back(); used[j] = 0;
  }
}`,
        c: `void goPerm(int* nums, int n, int* used, int* path, int len) {
  int j, k;
  if (len == n) {
    for (k = 0; k < n; k++) printf("%d ", path[k]);
    printf("\\n");
    return;
  }
  for (j = 0; j < n; j++) {
    if (used[j]) continue;
    used[j] = 1; path[len] = nums[j];
    goPerm(nums, n, used, path, len + 1);
    used[j] = 0;
  }
}`
      }
    },
    {
      lang: "js",
      title: "4. Combination sum, reuse the same index",
      desc: "What this is\nYou may pick a candidate as many times as you want. The recursive call stays on i so 2 can be used again. Moving to i + 1 is the skip.\n\nWhat the code is doing\nremain starts as the target. If remain is 0, snapshot. If remain is negative or i is past the end, stop. Skip: go(i + 1, remain). Take: push, go(i, remain - nums[i]), pop.\n\nWatch out\ngo(i + 1) after a take would forbid reuse. Combination Sum II uses each index once and skips duplicates after a sort.",
      code: `function combinationSum(nums, target) {
  const ans = [];
  function go(i, remain, path) {
    if (remain === 0) { ans.push(path.slice()); return; }
    if (i === nums.length || remain < 0) return;
    go(i + 1, remain, path);
    path.push(nums[i]);
    go(i, remain - nums[i], path);
    path.pop();
  }
  go(0, target, []);
  return ans;
}

console.log(combinationSum([2, 3, 6, 7], 7)); // [[7],[2,2,3]]`,
      codes: {
        javascript: `function combinationSum(nums, target) {
  const ans = [];
  function go(i, remain, path) {
    if (remain === 0) { ans.push(path.slice()); return; }
    if (i === nums.length || remain < 0) return;
    go(i + 1, remain, path);
    path.push(nums[i]);
    go(i, remain - nums[i], path);
    path.pop();
  }
  go(0, target, []);
  return ans;
}

console.log(combinationSum([2, 3, 6, 7], 7)); // [[7],[2,2,3]]`,
        python: `def combinationSum(nums, target):
  ans = []
  def go(i, remain, path):
    if remain == 0:
      ans.append(path[:])
      return
    if i == len(nums) or remain < 0:
      return
    go(i + 1, remain, path)
    path.append(nums[i])
    go(i, remain - nums[i], path)
    path.pop()
  go(0, target, [])
  return ans

print(combinationSum([2, 3, 6, 7], 7))  # [[7],[2,2,3]]`,
        java: `import java.util.*;
class Solution {
  public List<List<Integer>> combinationSum(int[] nums, int target) {
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(nums, 0, target, new ArrayList<Integer>(), ans);
    return ans;
  }
  void go(int[] nums, int i, int remain, List<Integer> path, List<List<Integer>> ans) {
    if (remain == 0) { ans.add(new ArrayList<Integer>(path)); return; }
    if (i == nums.length || remain < 0) return;
    go(nums, i + 1, remain, path, ans);
    path.add(nums[i]);
    go(nums, i, remain - nums[i], path, ans);
    path.remove(path.size() - 1);
  }
}`,
        cpp: `void goComb(vector<int>& nums, int i, int remain, vector<int>& path, vector<vector<int>>& ans) {
  if (remain == 0) { ans.push_back(path); return; }
  if (i == (int)nums.size() || remain < 0) return;
  goComb(nums, i + 1, remain, path, ans);
  path.push_back(nums[i]);
  goComb(nums, i, remain - nums[i], path, ans);
  path.pop_back();
}`,
        c: `void goComb(int* nums, int n, int i, int remain, int* path, int len) {
  int k;
  if (remain == 0) {
    for (k = 0; k < len; k++) printf("%d ", path[k]);
    printf("\\n");
    return;
  }
  if (i == n || remain < 0) return;
  goComb(nums, n, i + 1, remain, path, len);
  path[len] = nums[i];
  goComb(nums, n, i, remain - nums[i], path, len + 1);
}`
      }
    },
    {
      lang: "js",
      title: "5. Palindrome check for a cut",
      desc: "What this is\nPalindrome Partitioning cuts a string so every piece reads the same forwards and backwards. This helper tests one piece s[l..r].\n\nWhat the code is doing\nTwo indexes walk inward. If any pair mismatches, the piece is not a palindrome. Equal characters (or a single letter) return true.\n\nWatch out\nThis is O(length) per cut. A 2D table pal[l][r] precomputed in O(n^2) makes each cut O(1) later. That is the usual “more optimal” for this problem.",
      code: `function isPal(s, l, r) {
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++;
    r--;
  }
  return true;
}

console.log(isPal("aab", 0, 0)); // true
console.log(isPal("aab", 0, 1)); // true  "aa"
console.log(isPal("aab", 1, 2)); // false "ab"`,
      codes: {
        javascript: `function isPal(s, l, r) {
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++;
    r--;
  }
  return true;
}

console.log(isPal("aab", 0, 0)); // true
console.log(isPal("aab", 0, 1)); // true  "aa"
console.log(isPal("aab", 1, 2)); // false "ab"`,
        python: `def isPal(s, l, r):
  while l < r:
    if s[l] != s[r]:
      return False
    l += 1
    r -= 1
  return True

print(isPal("aab", 0, 0))  # True
print(isPal("aab", 0, 1))  # True  "aa"`,
        java: `class Solution {
  boolean isPal(String s, int l, int r) {
    while (l < r) {
      if (s.charAt(l) != s.charAt(r)) return false;
      l++;
      r--;
    }
    return true;
  }
}`,
        cpp: `bool isPal(const string& s, int l, int r) {
  while (l < r) {
    if (s[l] != s[r]) return false;
    l++; r--;
  }
  return true;
}`,
        c: `int isPal(const char* s, int l, int r) {
  while (l < r) {
    if (s[l] != s[r]) return 0;
    l++; r--;
  }
  return 1;
}`
      }
    },
    {
      lang: "js",
      title: "6. Safe square for N-Queens",
      desc: "What this is\nA queen attacks its row, column, and both diagonals. We place one queen per row, so we only check the column and the two diagonals against earlier rows.\n\nWhat the code is doing\ncol[c] is 1 if column c is taken. d1[row - c + n] is one diagonal, d2[row + c] is the other. safe is true when all three are free.\n\nWatch out\nrow - c can be negative, so add n (or n - 1) to shift it into a 0-based array. Trying every permutation of columns and checking after the full board is the brute.",
      code: `function safe(row, c, n, col, d1, d2) {
  if (col[c]) return false;
  if (d1[row - c + n]) return false;
  if (d2[row + c]) return false;
  return true;
}

const n = 4;
const col = Array(n).fill(0);
const d1 = Array(2 * n).fill(0);
const d2 = Array(2 * n).fill(0);
console.log(safe(0, 1, n, col, d1, d2)); // true`,
      codes: {
        javascript: `function safe(row, c, n, col, d1, d2) {
  if (col[c]) return false;
  if (d1[row - c + n]) return false;
  if (d2[row + c]) return false;
  return true;
}

const n = 4;
const col = Array(n).fill(0);
const d1 = Array(2 * n).fill(0);
const d2 = Array(2 * n).fill(0);
console.log(safe(0, 1, n, col, d1, d2)); // true`,
        python: `def safe(row, c, n, col, d1, d2):
  if col[c]: return False
  if d1[row - c + n]: return False
  if d2[row + c]: return False
  return True

n = 4
col = [0] * n
d1 = [0] * (2 * n)
d2 = [0] * (2 * n)
print(safe(0, 1, n, col, d1, d2))  # True`,
        java: `class Solution {
  boolean safe(int row, int c, int n, int[] col, int[] d1, int[] d2) {
    if (col[c] != 0) return false;
    if (d1[row - c + n] != 0) return false;
    if (d2[row + c] != 0) return false;
    return true;
  }
}`,
        cpp: `bool safe(int row, int c, int n, vector<int>& col, vector<int>& d1, vector<int>& d2) {
  if (col[c] || d1[row - c + n] || d2[row + c]) return false;
  return true;
}`,
        c: `int safe(int row, int c, int n, int* col, int* d1, int* d2) {
  if (col[c] || d1[row - c + n] || d2[row + c]) return 0;
  return 1;
}`
      }
    },
    {
      lang: "js",
      title: "7. Grid mark and unmark",
      desc: "What this is\nWord Search and Rat in a Maze walk a grid. A cell on the current path must not be reused, so you mark it, recurse, then unmark.\n\nWhat the code is doing\nIf the cell is out of bounds or already marked ('#'), return. Save the letter, write '#', try four neighbors, restore the letter. That restore is the backtrack.\n\nWatch out\nCopying a whole visited matrix on every call is the brute. Mutating the board (or one visited array) plus undo is the standard. Bound-check before you index.",
      code: `function walk(board, r, c) {
  const rows = board.length, cols = board[0].length;
  if (r < 0 || c < 0 || r >= rows || c >= cols) return;
  if (board[r][c] === "#") return;
  const ch = board[r][c];
  board[r][c] = "#";
  walk(board, r + 1, c);
  walk(board, r - 1, c);
  walk(board, r, c + 1);
  walk(board, r, c - 1);
  board[r][c] = ch;
}`,
      codes: {
        javascript: `function walk(board, r, c) {
  const rows = board.length, cols = board[0].length;
  if (r < 0 || c < 0 || r >= rows || c >= cols) return;
  if (board[r][c] === "#") return;
  const ch = board[r][c];
  board[r][c] = "#";
  walk(board, r + 1, c);
  walk(board, r - 1, c);
  walk(board, r, c + 1);
  walk(board, r, c - 1);
  board[r][c] = ch;
}`,
        python: `def walk(board, r, c):
  rows, cols = len(board), len(board[0])
  if r < 0 or c < 0 or r >= rows or c >= cols:
    return
  if board[r][c] == "#":
    return
  ch = board[r][c]
  board[r][c] = "#"
  walk(board, r + 1, c)
  walk(board, r - 1, c)
  walk(board, r, c + 1)
  walk(board, r, c - 1)
  board[r][c] = ch`,
        java: `class Solution {
  void walk(char[][] board, int r, int c) {
    int rows = board.length, cols = board[0].length;
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (board[r][c] == '#') return;
    char ch = board[r][c];
    board[r][c] = '#';
    walk(board, r + 1, c);
    walk(board, r - 1, c);
    walk(board, r, c + 1);
    walk(board, r, c - 1);
    board[r][c] = ch;
  }
}`,
        cpp: `void walk(vector<vector<char>>& board, int r, int c) {
  int rows = (int)board.size(), cols = (int)board[0].size();
  if (r < 0 || c < 0 || r >= rows || c >= cols) return;
  if (board[r][c] == '#') return;
  char ch = board[r][c];
  board[r][c] = '#';
  walk(board, r + 1, c); walk(board, r - 1, c);
  walk(board, r, c + 1); walk(board, r, c - 1);
  board[r][c] = ch;
}`,
        c: `void walk(char** board, int rows, int cols, int r, int c) {
  char ch;
  if (r < 0 || c < 0 || r >= rows || c >= cols) return;
  if (board[r][c] == '#') return;
  ch = board[r][c];
  board[r][c] = '#';
  walk(board, rows, cols, r + 1, c);
  walk(board, rows, cols, r - 1, c);
  walk(board, rows, cols, r, c + 1);
  walk(board, rows, cols, r, c - 1);
  board[r][c] = ch;
}`
      }
    },
    {
      lang: "js",
      title: "8. Parentheses prune",
      desc: "What this is\nGenerate every valid string of n pairs of parentheses. You may add '(' while you still have opens left. You may add ')' only when closes so far are fewer than opens.\n\nWhat the code is doing\nopen and close count how many of each you have used. If the string length hits 2n, store it. The two ifs are the prune: they never build a prefix that cannot become valid.\n\nWatch out\nThe brute builds every string of ( and ) of length 2n and filters with a counter. That is 2^(2n) strings. The prune visits only Catalan-many leaves.",
      code: `function generateParenthesis(n) {
  const ans = [];
  function go(open, close, path) {
    if (path.length === 2 * n) {
      ans.push(path.join(""));
      return;
    }
    if (open < n) {
      path.push("(");
      go(open + 1, close, path);
      path.pop();
    }
    if (close < open) {
      path.push(")");
      go(open, close + 1, path);
      path.pop();
    }
  }
  go(0, 0, []);
  return ans;
}

console.log(generateParenthesis(2)); // ["(())","()()"]`,
      codes: {
        javascript: `function generateParenthesis(n) {
  const ans = [];
  function go(open, close, path) {
    if (path.length === 2 * n) {
      ans.push(path.join(""));
      return;
    }
    if (open < n) {
      path.push("(");
      go(open + 1, close, path);
      path.pop();
    }
    if (close < open) {
      path.push(")");
      go(open, close + 1, path);
      path.pop();
    }
  }
  go(0, 0, []);
  return ans;
}

console.log(generateParenthesis(2)); // ["(())","()()"]`,
        python: `def generateParenthesis(n):
  ans = []
  def go(open_n, close, path):
    if len(path) == 2 * n:
      ans.append("".join(path))
      return
    if open_n < n:
      path.append("(")
      go(open_n + 1, close, path)
      path.pop()
    if close < open_n:
      path.append(")")
      go(open_n, close + 1, path)
      path.pop()
  go(0, 0, [])
  return ans

print(generateParenthesis(2))  # ["(())","()()"]`,
        java: `import java.util.*;
class Solution {
  public List<String> generateParenthesis(int n) {
    List<String> ans = new ArrayList<String>();
    go(n, 0, 0, new StringBuilder(), ans);
    return ans;
  }
  void go(int n, int open, int close, StringBuilder path, List<String> ans) {
    if (path.length() == 2 * n) { ans.add(path.toString()); return; }
    if (open < n) {
      path.append('(');
      go(n, open + 1, close, path, ans);
      path.deleteCharAt(path.length() - 1);
    }
    if (close < open) {
      path.append(')');
      go(n, open, close + 1, path, ans);
      path.deleteCharAt(path.length() - 1);
    }
  }
}`,
        cpp: `void goParens(int n, int open, int close, string& path, vector<string>& ans) {
  if ((int)path.size() == 2 * n) { ans.push_back(path); return; }
  if (open < n) {
    path.push_back('(');
    goParens(n, open + 1, close, path, ans);
    path.pop_back();
  }
  if (close < open) {
    path.push_back(')');
    goParens(n, open, close + 1, path, ans);
    path.pop_back();
  }
}`,
        c: `void goParens(int n, int open, int close, char* path, int len) {
  if (len == 2 * n) { path[len] = '\\0'; printf("%s\\n", path); return; }
  if (open < n) {
    path[len] = '(';
    goParens(n, open + 1, close, path, len + 1);
  }
  if (close < open) {
    path[len] = ')';
    goParens(n, open, close + 1, path, len + 1);
  }
}`
      }
    }
  ],
  questions: [
    {
      id: 1,
      level: "beginner",
      q: "Subsets",
      ask: "Amazon · Google · Meta · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/subsets/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/subsets-1612087270/1"}],
      a: "Given distinct integers nums, return every subset (the power set). Order of subsets and order inside a subset do not matter.\n\nTiny example: nums = [1, 2]. The subsets are [], [1], [2], [1,2]. That is 2^n lists.\n\nEach index is a yes/no choice. The brute copies a new path on every call. The usual backtrack mutates one path and pops. Bitmasks walk 0 .. 2^n-1 and skip the recursion.\n\nOpen Brute, Optimal, and More optimal for extra copies, push/pop, and bitmasks.",
      solutions: [
        {
          name: "Brute",
          time: "O(n * 2^n)",
          space: "O(n * 2^n)",
          why: "Each call does path.concat so every node of the tree allocates a new array. Correct, but you pay extra copies on internal nodes, not only at leaves. Time is still exponential because there are 2^n subsets.",
          code: `function subsets(nums) {
  const ans = [];
  function go(i, path) {
    if (i === nums.length) {
      ans.push(path);
      return;
    }
    go(i + 1, path.slice());
    const take = path.slice();
    take.push(nums[i]);
    go(i + 1, take);
  }
  go(0, []);
  return ans;
}`,
          codes: {
            javascript: `function subsets(nums) {
  const ans = [];
  function go(i, path) {
    if (i === nums.length) {
      ans.push(path);
      return;
    }
    go(i + 1, path.slice());
    const take = path.slice();
    take.push(nums[i]);
    go(i + 1, take);
  }
  go(0, []);
  return ans;
}`,
            python: `def subsets(nums):
  ans = []
  def go(i, path):
    if i == len(nums):
      ans.append(path)
      return
    go(i + 1, path[:])
    take = path[:]
    take.append(nums[i])
    go(i + 1, take)
  go(0, [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(nums, 0, new ArrayList<Integer>(), ans);
    return ans;
  }
  void go(int[] nums, int i, List<Integer> path, List<List<Integer>> ans) {
    if (i == nums.length) { ans.add(path); return; }
    go(nums, i + 1, new ArrayList<Integer>(path), ans);
    List<Integer> take = new ArrayList<Integer>(path);
    take.add(nums[i]);
    go(nums, i + 1, take, ans);
  }
}`,
            cpp: `void go(vector<int>& nums, int i, vector<int> path, vector<vector<int>>& ans) {
  if (i == (int)nums.size()) { ans.push_back(path); return; }
  go(nums, i + 1, path, ans);
  path.push_back(nums[i]);
  go(nums, i + 1, path, ans);
}
vector<vector<int>> subsets(vector<int>& nums) {
  vector<vector<int>> ans;
  go(nums, 0, {}, ans);
  return ans;
}`,
            c: `/* extra path copy into tmp[] on every take */
void go(int* nums, int n, int i, int* path, int len, int* tmp) {
  int k;
  if (i == n) {
    printf("[");
    for (k = 0; k < len; k++) { if (k) printf(","); printf("%d", path[k]); }
    printf("]\\n");
    return;
  }
  go(nums, n, i + 1, path, len, tmp);
  for (k = 0; k < len; k++) tmp[k] = path[k];
  tmp[len] = nums[i];
  go(nums, n, i + 1, tmp, len + 1, path);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n * 2^n)",
          space: "O(n)",
          why: "One path array is shared. Push, recurse, pop. You copy only at a leaf. Extra memory besides the output is the path plus O(n) stack.",
          code: `function subsets(nums) {
  const ans = [];
  function go(i, path) {
    if (i === nums.length) {
      ans.push(path.slice());
      return;
    }
    go(i + 1, path);
    path.push(nums[i]);
    go(i + 1, path);
    path.pop();
  }
  go(0, []);
  return ans;
}`,
          codes: {
            javascript: `function subsets(nums) {
  const ans = [];
  function go(i, path) {
    if (i === nums.length) {
      ans.push(path.slice());
      return;
    }
    go(i + 1, path);
    path.push(nums[i]);
    go(i + 1, path);
    path.pop();
  }
  go(0, []);
  return ans;
}`,
            python: `def subsets(nums):
  ans = []
  def go(i, path):
    if i == len(nums):
      ans.append(path[:])
      return
    go(i + 1, path)
    path.append(nums[i])
    go(i + 1, path)
    path.pop()
  go(0, [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(nums, 0, new ArrayList<Integer>(), ans);
    return ans;
  }
  void go(int[] nums, int i, List<Integer> path, List<List<Integer>> ans) {
    if (i == nums.length) {
      ans.add(new ArrayList<Integer>(path));
      return;
    }
    go(nums, i + 1, path, ans);
    path.add(nums[i]);
    go(nums, i + 1, path, ans);
    path.remove(path.size() - 1);
  }
}`,
            cpp: `void go(vector<int>& nums, int i, vector<int>& path, vector<vector<int>>& ans) {
  if (i == (int)nums.size()) { ans.push_back(path); return; }
  go(nums, i + 1, path, ans);
  path.push_back(nums[i]);
  go(nums, i + 1, path, ans);
  path.pop_back();
}
vector<vector<int>> subsets(vector<int>& nums) {
  vector<vector<int>> ans;
  vector<int> path;
  go(nums, 0, path, ans);
  return ans;
}`,
            c: `void go(int* nums, int n, int i, int* path, int len) {
  int k;
  if (i == n) {
    printf("[");
    for (k = 0; k < len; k++) { if (k) printf(","); printf("%d", path[k]); }
    printf("]\\n");
    return;
  }
  go(nums, n, i + 1, path, len);
  path[len] = nums[i];
  go(nums, n, i + 1, path, len + 1);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n * 2^n)",
          space: "O(n)",
          why: "No recursion. Each mask from 0 to 2^n-1 is one subset. Bit i on means nums[i] is in. Same output size, no call stack, tight inner loop.",
          code: `function subsets(nums) {
  const n = nums.length;
  const ans = [];
  const total = 1 << n;
  for (let mask = 0; mask < total; mask++) {
    const cur = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) cur.push(nums[i]);
    }
    ans.push(cur);
  }
  return ans;
}`,
          codes: {
            javascript: `function subsets(nums) {
  const n = nums.length;
  const ans = [];
  const total = 1 << n;
  for (let mask = 0; mask < total; mask++) {
    const cur = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) cur.push(nums[i]);
    }
    ans.push(cur);
  }
  return ans;
}`,
            python: `def subsets(nums):
  n = len(nums)
  ans = []
  for mask in range(1 << n):
    cur = []
    for i in range(n):
      if mask & (1 << i):
        cur.append(nums[i])
    ans.append(cur)
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> subsets(int[] nums) {
    int n = nums.length;
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    int total = 1 << n;
    for (int mask = 0; mask < total; mask++) {
      List<Integer> cur = new ArrayList<Integer>();
      for (int i = 0; i < n; i++) if ((mask & (1 << i)) != 0) cur.add(nums[i]);
      ans.add(cur);
    }
    return ans;
  }
}`,
            cpp: `vector<vector<int>> subsets(vector<int>& nums) {
  int n = (int)nums.size();
  vector<vector<int>> ans;
  int total = 1 << n;
  for (int mask = 0; mask < total; mask++) {
    vector<int> cur;
    for (int i = 0; i < n; i++) if (mask & (1 << i)) cur.push_back(nums[i]);
    ans.push_back(cur);
  }
  return ans;
}`,
            c: `/* out[mask] written as a subset; caller allocates 1<<n slots */
void subsets(int* nums, int n, int** out, int* lens) {
  int total = 1 << n, mask, i, k;
  for (mask = 0; mask < total; mask++) {
    k = 0;
    for (i = 0; i < n; i++) if (mask & (1 << i)) out[mask][k++] = nums[i];
    lens[mask] = k;
  }
}`
          }
        }
      ]
    },
    {
      id: 2,
      level: "intermediate",
      q: "Subsets II",
      ask: "Amazon · Meta · Bloomberg",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/subsets-ii/"}],
      a: "Same power set as Subsets, but nums may contain duplicates. Return unique subsets only.\n\nTiny example: nums = [1, 2, 2]. Valid unique subsets include [], [1], [2], [1,2], [2,2], [1,2,2]. You must not list [1,2] twice from the two different 2s used as the only 2.\n\nSort first so equal values sit together. At one start index, skip a value that equals the previous value. The brute generates everything and dumps string keys into a Set.\n\nOpen Brute, Optimal, and More optimal for the Set trick, sort-and-skip, and the same skip plus an early break.",
      solutions: [
        {
          name: "Brute",
          time: "O(n * 2^n)",
          space: "O(n * 2^n)",
          why: "Build every subset with extra path copies, stringify, and keep a Set. Duplicate work is thrown away after you already built it. Fine for tiny n, not the interview finish.",
          code: `function subsetsWithDup(nums) {
  const seen = new Set();
  const ans = [];
  function go(i, path) {
    if (i === nums.length) {
      const key = path.slice().sort(function (a, b) { return a - b; }).join(",");
      if (!seen.has(key)) {
        seen.add(key);
        ans.push(path.slice());
      }
      return;
    }
    go(i + 1, path.slice());
    const take = path.slice();
    take.push(nums[i]);
    go(i + 1, take);
  }
  go(0, []);
  return ans;
}`,
          codes: {
            javascript: `function subsetsWithDup(nums) {
  const seen = new Set();
  const ans = [];
  function go(i, path) {
    if (i === nums.length) {
      const key = path.slice().sort(function (a, b) { return a - b; }).join(",");
      if (!seen.has(key)) {
        seen.add(key);
        ans.push(path.slice());
      }
      return;
    }
    go(i + 1, path.slice());
    const take = path.slice();
    take.push(nums[i]);
    go(i + 1, take);
  }
  go(0, []);
  return ans;
}`,
            python: `def subsetsWithDup(nums):
  seen = set()
  ans = []
  def go(i, path):
    if i == len(nums):
      key = tuple(sorted(path))
      if key not in seen:
        seen.add(key)
        ans.append(path[:])
      return
    go(i + 1, path[:])
    take = path[:]
    take.append(nums[i])
    go(i + 1, take)
  go(0, [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> subsetsWithDup(int[] nums) {
    Set<String> seen = new HashSet<String>();
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(nums, 0, new ArrayList<Integer>(), seen, ans);
    return ans;
  }
  void go(int[] nums, int i, List<Integer> path, Set<String> seen, List<List<Integer>> ans) {
    if (i == nums.length) {
      List<Integer> copy = new ArrayList<Integer>(path);
      Collections.sort(copy);
      if (seen.add(copy.toString())) ans.add(copy);
      return;
    }
    go(nums, i + 1, new ArrayList<Integer>(path), seen, ans);
    List<Integer> take = new ArrayList<Integer>(path);
    take.add(nums[i]);
    go(nums, i + 1, take, seen, ans);
  }
}`,
            cpp: `void go(vector<int>& nums, int i, vector<int> path, set<vector<int>>& seen, vector<vector<int>>& ans) {
  if (i == (int)nums.size()) {
    vector<int> copy = path;
    sort(copy.begin(), copy.end());
    if (seen.insert(copy).second) ans.push_back(copy);
    return;
  }
  go(nums, i + 1, path, seen, ans);
  path.push_back(nums[i]);
  go(nums, i + 1, path, seen, ans);
}`,
            c: `/* generate all, qsort each subset, skip duplicate prints with a last-key buffer */
void go(int* nums, int n, int i, int* path, int len) {
  int k;
  if (i == n) {
    /* classroom: print; a real unique filter needs a set of sorted tuples */
    printf("[");
    for (k = 0; k < len; k++) { if (k) printf(","); printf("%d", path[k]); }
    printf("]\\n");
    return;
  }
  go(nums, n, i + 1, path, len);
  path[len] = nums[i];
  go(nums, n, i + 1, path, len + 1);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n * 2^n)",
          space: "O(n)",
          why: "Sort, then at each start skip nums[i] when it equals nums[i-1]. Those two 2s cannot start the same role twice, so [1,2] appears once. One path, push/pop.",
          code: `function subsetsWithDup(nums) {
  nums = nums.slice().sort(function (a, b) { return a - b; });
  const ans = [];
  function go(start, path) {
    ans.push(path.slice());
    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;
      path.push(nums[i]);
      go(i + 1, path);
      path.pop();
    }
  }
  go(0, []);
  return ans;
}`,
          codes: {
            javascript: `function subsetsWithDup(nums) {
  nums = nums.slice().sort(function (a, b) { return a - b; });
  const ans = [];
  function go(start, path) {
    ans.push(path.slice());
    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;
      path.push(nums[i]);
      go(i + 1, path);
      path.pop();
    }
  }
  go(0, []);
  return ans;
}`,
            python: `def subsetsWithDup(nums):
  nums = sorted(nums)
  ans = []
  def go(start, path):
    ans.append(path[:])
    for i in range(start, len(nums)):
      if i > start and nums[i] == nums[i - 1]:
        continue
      path.append(nums[i])
      go(i + 1, path)
      path.pop()
  go(0, [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> subsetsWithDup(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(nums, 0, new ArrayList<Integer>(), ans);
    return ans;
  }
  void go(int[] nums, int start, List<Integer> path, List<List<Integer>> ans) {
    ans.add(new ArrayList<Integer>(path));
    for (int i = start; i < nums.length; i++) {
      if (i > start && nums[i] == nums[i - 1]) continue;
      path.add(nums[i]);
      go(nums, i + 1, path, ans);
      path.remove(path.size() - 1);
    }
  }
}`,
            cpp: `void go(vector<int>& nums, int start, vector<int>& path, vector<vector<int>>& ans) {
  ans.push_back(path);
  for (int i = start; i < (int)nums.size(); i++) {
    if (i > start && nums[i] == nums[i - 1]) continue;
    path.push_back(nums[i]);
    go(nums, i + 1, path, ans);
    path.pop_back();
  }
}
vector<vector<int>> subsetsWithDup(vector<int>& nums) {
  sort(nums.begin(), nums.end());
  vector<vector<int>> ans;
  vector<int> path;
  go(nums, 0, path, ans);
  return ans;
}`,
            c: `void go(int* nums, int n, int start, int* path, int len) {
  int i, k;
  printf("[");
  for (k = 0; k < len; k++) { if (k) printf(","); printf("%d", path[k]); }
  printf("]\\n");
  for (i = start; i < n; i++) {
    if (i > start && nums[i] == nums[i - 1]) continue;
    path[len] = nums[i];
    go(nums, n, i + 1, path, len + 1);
  }
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n * 2^n)",
          space: "O(n)",
          why: "Same sort-and-skip, plus you can count how many copies of this value exist and take 0..count in one shot. That collapses a chain of duplicate-index decisions into one loop.",
          code: `function subsetsWithDup(nums) {
  nums = nums.slice().sort(function (a, b) { return a - b; });
  const ans = [];
  function go(start, path) {
    ans.push(path.slice());
    let i = start;
    while (i < nums.length) {
      let j = i;
      while (j < nums.length && nums[j] === nums[i]) j++;
      const count = j - i;
      for (let take = 1; take <= count; take++) {
        path.push(nums[i]);
        go(j, path);
      }
      for (let take = 1; take <= count; take++) path.pop();
      i = j;
    }
  }
  go(0, []);
  return ans;
}`,
          codes: {
            javascript: `function subsetsWithDup(nums) {
  nums = nums.slice().sort(function (a, b) { return a - b; });
  const ans = [];
  function go(start, path) {
    ans.push(path.slice());
    let i = start;
    while (i < nums.length) {
      let j = i;
      while (j < nums.length && nums[j] === nums[i]) j++;
      const count = j - i;
      for (let take = 1; take <= count; take++) {
        path.push(nums[i]);
        go(j, path);
      }
      for (let take = 1; take <= count; take++) path.pop();
      i = j;
    }
  }
  go(0, []);
  return ans;
}`,
            python: `def subsetsWithDup(nums):
  nums = sorted(nums)
  ans = []
  def go(start, path):
    ans.append(path[:])
    i = start
    while i < len(nums):
      j = i
      while j < len(nums) and nums[j] == nums[i]:
        j += 1
      count = j - i
      for take in range(1, count + 1):
        path.append(nums[i])
        go(j, path)
      for take in range(count):
        path.pop()
      i = j
  go(0, [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> subsetsWithDup(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(nums, 0, new ArrayList<Integer>(), ans);
    return ans;
  }
  void go(int[] nums, int start, List<Integer> path, List<List<Integer>> ans) {
    ans.add(new ArrayList<Integer>(path));
    int i = start;
    while (i < nums.length) {
      int j = i;
      while (j < nums.length && nums[j] == nums[i]) j++;
      int count = j - i;
      for (int t = 1; t <= count; t++) {
        path.add(nums[i]);
        go(nums, j, path, ans);
      }
      for (int t = 1; t <= count; t++) path.remove(path.size() - 1);
      i = j;
    }
  }
}`,
            cpp: `void go(vector<int>& nums, int start, vector<int>& path, vector<vector<int>>& ans) {
  ans.push_back(path);
  int i = start;
  while (i < (int)nums.size()) {
    int j = i;
    while (j < (int)nums.size() && nums[j] == nums[i]) j++;
    int count = j - i;
    for (int t = 1; t <= count; t++) {
      path.push_back(nums[i]);
      go(nums, j, path, ans);
    }
    for (int t = 1; t <= count; t++) path.pop_back();
    i = j;
  }
}`,
            c: `void go(int* nums, int n, int start, int* path, int len) {
  int i, j, t, k, count;
  printf("[");
  for (k = 0; k < len; k++) { if (k) printf(","); printf("%d", path[k]); }
  printf("]\\n");
  i = start;
  while (i < n) {
    j = i;
    while (j < n && nums[j] == nums[i]) j++;
    count = j - i;
    for (t = 1; t <= count; t++) {
      path[len + t - 1] = nums[i];
      go(nums, n, j, path, len + t);
    }
    i = j;
  }
}`
          }
        }
      ]
    },
    {
      id: 3,
      level: "beginner",
      q: "Permutations",
      ask: "Amazon · Google · Microsoft · Meta",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/permutations/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/permutations-of-a-given-string/1"}],
      a: "Return every ordering of distinct nums. There are n! of them.\n\nTiny example: nums = [1, 2, 3]. One permutation is [1,3,2]. All six orderings are required.\n\nThe brute copies a leftover list on every pick. The standard backtrack uses a used[] flag and one path. In-place swaps avoid the used array and extra leftover copies.\n\nOpen Brute, Optimal, and More optimal for leftover copies, used[], and swaps.",
      solutions: [
        {
          name: "Brute",
          time: "O(n * n!)",
          space: "O(n * n!)",
          why: "At each step you copy the leftover numbers into a new array and copy the path. Extra copies on every internal node. n! leaves, each of length n.",
          code: `function permute(nums) {
  const ans = [];
  function go(left, path) {
    if (left.length === 0) {
      ans.push(path);
      return;
    }
    for (let i = 0; i < left.length; i++) {
      const nextLeft = left.slice(0, i).concat(left.slice(i + 1));
      const nextPath = path.slice();
      nextPath.push(left[i]);
      go(nextLeft, nextPath);
    }
  }
  go(nums.slice(), []);
  return ans;
}`,
          codes: {
            javascript: `function permute(nums) {
  const ans = [];
  function go(left, path) {
    if (left.length === 0) {
      ans.push(path);
      return;
    }
    for (let i = 0; i < left.length; i++) {
      const nextLeft = left.slice(0, i).concat(left.slice(i + 1));
      const nextPath = path.slice();
      nextPath.push(left[i]);
      go(nextLeft, nextPath);
    }
  }
  go(nums.slice(), []);
  return ans;
}`,
            python: `def permute(nums):
  ans = []
  def go(left, path):
    if not left:
      ans.append(path)
      return
    for i in range(len(left)):
      go(left[:i] + left[i+1:], path + [left[i]])
  go(list(nums), [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    List<Integer> left = new ArrayList<Integer>();
    for (int x : nums) left.add(x);
    go(left, new ArrayList<Integer>(), ans);
    return ans;
  }
  void go(List<Integer> left, List<Integer> path, List<List<Integer>> ans) {
    if (left.isEmpty()) { ans.add(path); return; }
    for (int i = 0; i < left.size(); i++) {
      List<Integer> nextLeft = new ArrayList<Integer>(left);
      List<Integer> nextPath = new ArrayList<Integer>(path);
      nextPath.add(nextLeft.remove(i));
      go(nextLeft, nextPath, ans);
    }
  }
}`,
            cpp: `void go(vector<int> left, vector<int> path, vector<vector<int>>& ans) {
  if (left.empty()) { ans.push_back(path); return; }
  for (int i = 0; i < (int)left.size(); i++) {
    vector<int> nextLeft = left;
    vector<int> nextPath = path;
    nextPath.push_back(nextLeft[i]);
    nextLeft.erase(nextLeft.begin() + i);
    go(nextLeft, nextPath, ans);
  }
}`,
            c: `void go(int* left, int nleft, int* path, int len) {
  int i, k, t, tmp;
  if (nleft == 0) {
    for (k = 0; k < len; k++) printf("%d ", path[k]);
    printf("\\n");
    return;
  }
  for (i = 0; i < nleft; i++) {
    path[len] = left[i];
    tmp = left[i];
    for (k = i; k < nleft - 1; k++) left[k] = left[k + 1];
    go(left, nleft - 1, path, len + 1);
    for (k = nleft - 1; k > i; k--) left[k] = left[k - 1];
    left[i] = tmp;
  }
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n * n!)",
          space: "O(n)",
          why: "used[j] marks nums[j] as taken. One path, mark/unmark. Extra space is O(n) besides the n! output lists.",
          code: `function permute(nums) {
  const ans = [];
  const used = Array(nums.length).fill(false);
  function go(path) {
    if (path.length === nums.length) {
      ans.push(path.slice());
      return;
    }
    for (let j = 0; j < nums.length; j++) {
      if (used[j]) continue;
      used[j] = true;
      path.push(nums[j]);
      go(path);
      path.pop();
      used[j] = false;
    }
  }
  go([]);
  return ans;
}`,
          codes: {
            javascript: `function permute(nums) {
  const ans = [];
  const used = Array(nums.length).fill(false);
  function go(path) {
    if (path.length === nums.length) {
      ans.push(path.slice());
      return;
    }
    for (let j = 0; j < nums.length; j++) {
      if (used[j]) continue;
      used[j] = true;
      path.push(nums[j]);
      go(path);
      path.pop();
      used[j] = false;
    }
  }
  go([]);
  return ans;
}`,
            python: `def permute(nums):
  ans = []
  used = [False] * len(nums)
  def go(path):
    if len(path) == len(nums):
      ans.append(path[:])
      return
    for j in range(len(nums)):
      if used[j]:
        continue
      used[j] = True
      path.append(nums[j])
      go(path)
      path.pop()
      used[j] = False
  go([])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(nums, new boolean[nums.length], new ArrayList<Integer>(), ans);
    return ans;
  }
  void go(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> ans) {
    if (path.size() == nums.length) {
      ans.add(new ArrayList<Integer>(path));
      return;
    }
    for (int j = 0; j < nums.length; j++) {
      if (used[j]) continue;
      used[j] = true;
      path.add(nums[j]);
      go(nums, used, path, ans);
      path.remove(path.size() - 1);
      used[j] = false;
    }
  }
}`,
            cpp: `void go(vector<int>& nums, vector<int>& used, vector<int>& path, vector<vector<int>>& ans) {
  if ((int)path.size() == (int)nums.size()) { ans.push_back(path); return; }
  for (int j = 0; j < (int)nums.size(); j++) {
    if (used[j]) continue;
    used[j] = 1; path.push_back(nums[j]);
    go(nums, used, path, ans);
    path.pop_back(); used[j] = 0;
  }
}
vector<vector<int>> permute(vector<int>& nums) {
  vector<vector<int>> ans;
  vector<int> used(nums.size()), path;
  go(nums, used, path, ans);
  return ans;
}`,
            c: `void go(int* nums, int n, int* used, int* path, int len) {
  int j, k;
  if (len == n) {
    for (k = 0; k < n; k++) printf("%d ", path[k]);
    printf("\\n");
    return;
  }
  for (j = 0; j < n; j++) {
    if (used[j]) continue;
    used[j] = 1; path[len] = nums[j];
    go(nums, n, used, path, len + 1);
    used[j] = 0;
  }
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n * n!)",
          space: "O(n)",
          why: "Swap nums[start] with each later index, recurse start+1, swap back. The prefix is the path. No used[] and no leftover copies. Still n! output.",
          code: `function permute(nums) {
  const ans = [];
  function go(start) {
    if (start === nums.length) {
      ans.push(nums.slice());
      return;
    }
    for (let i = start; i < nums.length; i++) {
      const tmp = nums[start]; nums[start] = nums[i]; nums[i] = tmp;
      go(start + 1);
      const tmp2 = nums[start]; nums[start] = nums[i]; nums[i] = tmp2;
    }
  }
  go(0);
  return ans;
}`,
          codes: {
            javascript: `function permute(nums) {
  const ans = [];
  function go(start) {
    if (start === nums.length) {
      ans.push(nums.slice());
      return;
    }
    for (let i = start; i < nums.length; i++) {
      const tmp = nums[start]; nums[start] = nums[i]; nums[i] = tmp;
      go(start + 1);
      const tmp2 = nums[start]; nums[start] = nums[i]; nums[i] = tmp2;
    }
  }
  go(0);
  return ans;
}`,
            python: `def permute(nums):
  ans = []
  def go(start):
    if start == len(nums):
      ans.append(nums[:])
      return
    for i in range(start, len(nums)):
      nums[start], nums[i] = nums[i], nums[start]
      go(start + 1)
      nums[start], nums[i] = nums[i], nums[start]
  go(0)
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(nums, 0, ans);
    return ans;
  }
  void go(int[] nums, int start, List<List<Integer>> ans) {
    if (start == nums.length) {
      List<Integer> cur = new ArrayList<Integer>();
      for (int x : nums) cur.add(x);
      ans.add(cur);
      return;
    }
    for (int i = start; i < nums.length; i++) {
      int t = nums[start]; nums[start] = nums[i]; nums[i] = t;
      go(nums, start + 1, ans);
      t = nums[start]; nums[start] = nums[i]; nums[i] = t;
    }
  }
}`,
            cpp: `void go(vector<int>& nums, int start, vector<vector<int>>& ans) {
  if (start == (int)nums.size()) { ans.push_back(nums); return; }
  for (int i = start; i < (int)nums.size(); i++) {
    swap(nums[start], nums[i]);
    go(nums, start + 1, ans);
    swap(nums[start], nums[i]);
  }
}`,
            c: `void go(int* nums, int n, int start) {
  int i, k, t;
  if (start == n) {
    for (k = 0; k < n; k++) printf("%d ", nums[k]);
    printf("\\n");
    return;
  }
  for (i = start; i < n; i++) {
    t = nums[start]; nums[start] = nums[i]; nums[i] = t;
    go(nums, n, start + 1);
    t = nums[start]; nums[start] = nums[i]; nums[i] = t;
  }
}`
          }
        }
      ]
    },
    {
      id: 4,
      level: "intermediate",
      q: "Permutations II",
      ask: "Amazon · LinkedIn · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/permutations-ii/"}],
      a: "Permutations of nums when duplicates are allowed. Return unique orderings only.\n\nTiny example: nums = [1, 1, 2]. The unique permutations are [1,1,2], [1,2,1], [2,1,1]. Not six, because the two 1s are identical.\n\nBrute builds every permutation and uniques with a Set. Optimal sorts and skips a duplicate at the same depth unless the previous copy is already used. Swaps plus a local set of values tried at this start index also unique the branches.\n\nOpen Brute, Optimal, and More optimal for the Set, sort-and-skip, and swap-with-local-set.",
      solutions: [
        {
          name: "Brute",
          time: "O(n * n!)",
          space: "O(n * n!)",
          why: "Generate every leftover-copy permutation, stringify, keep a Set. Duplicate 1s still walk the full n! tree. Extra copies plus the Set.",
          code: `function permuteUnique(nums) {
  const seen = new Set();
  const ans = [];
  function go(left, path) {
    if (left.length === 0) {
      const key = path.join(",");
      if (!seen.has(key)) { seen.add(key); ans.push(path); }
      return;
    }
    for (let i = 0; i < left.length; i++) {
      go(left.slice(0, i).concat(left.slice(i + 1)), path.concat([left[i]]));
    }
  }
  go(nums.slice(), []);
  return ans;
}`,
          codes: {
            javascript: `function permuteUnique(nums) {
  const seen = new Set();
  const ans = [];
  function go(left, path) {
    if (left.length === 0) {
      const key = path.join(",");
      if (!seen.has(key)) { seen.add(key); ans.push(path); }
      return;
    }
    for (let i = 0; i < left.length; i++) {
      go(left.slice(0, i).concat(left.slice(i + 1)), path.concat([left[i]]));
    }
  }
  go(nums.slice(), []);
  return ans;
}`,
            python: `def permuteUnique(nums):
  seen = set()
  ans = []
  def go(left, path):
    if not left:
      key = tuple(path)
      if key not in seen:
        seen.add(key)
        ans.append(path)
      return
    for i in range(len(left)):
      go(left[:i] + left[i+1:], path + [left[i]])
  go(list(nums), [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> permuteUnique(int[] nums) {
    Set<String> seen = new HashSet<String>();
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    List<Integer> left = new ArrayList<Integer>();
    for (int x : nums) left.add(x);
    go(left, new ArrayList<Integer>(), seen, ans);
    return ans;
  }
  void go(List<Integer> left, List<Integer> path, Set<String> seen, List<List<Integer>> ans) {
    if (left.isEmpty()) {
      if (seen.add(path.toString())) ans.add(path);
      return;
    }
    for (int i = 0; i < left.size(); i++) {
      List<Integer> nextLeft = new ArrayList<Integer>(left);
      List<Integer> nextPath = new ArrayList<Integer>(path);
      nextPath.add(nextLeft.remove(i));
      go(nextLeft, nextPath, seen, ans);
    }
  }
}`,
            cpp: `void go(vector<int> left, vector<int> path, set<vector<int>>& seen, vector<vector<int>>& ans) {
  if (left.empty()) {
    if (seen.insert(path).second) ans.push_back(path);
    return;
  }
  for (int i = 0; i < (int)left.size(); i++) {
    vector<int> nextLeft = left, nextPath = path;
    nextPath.push_back(nextLeft[i]);
    nextLeft.erase(nextLeft.begin() + i);
    go(nextLeft, nextPath, seen, ans);
  }
}`,
            c: `void go(int* left, int nleft, int* path, int len) {
  int i, k, tmp;
  if (nleft == 0) {
    for (k = 0; k < len; k++) printf("%d ", path[k]);
    printf("\\n");
    return;
  }
  for (i = 0; i < nleft; i++) {
    path[len] = left[i];
    tmp = left[i];
    for (k = i; k < nleft - 1; k++) left[k] = left[k + 1];
    go(left, nleft - 1, path, len + 1);
    for (k = nleft - 1; k > i; k--) left[k] = left[k - 1];
    left[i] = tmp;
  }
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n * n!)",
          space: "O(n)",
          why: "Sort so equal values are adjacent. Skip nums[j] when it equals nums[j-1] and used[j-1] is false. That forces a fixed order on identical numbers. One path, used[].",
          code: `function permuteUnique(nums) {
  nums = nums.slice().sort(function (a, b) { return a - b; });
  const ans = [];
  const used = Array(nums.length).fill(false);
  function go(path) {
    if (path.length === nums.length) { ans.push(path.slice()); return; }
    for (let j = 0; j < nums.length; j++) {
      if (used[j]) continue;
      if (j > 0 && nums[j] === nums[j - 1] && !used[j - 1]) continue;
      used[j] = true;
      path.push(nums[j]);
      go(path);
      path.pop();
      used[j] = false;
    }
  }
  go([]);
  return ans;
}`,
          codes: {
            javascript: `function permuteUnique(nums) {
  nums = nums.slice().sort(function (a, b) { return a - b; });
  const ans = [];
  const used = Array(nums.length).fill(false);
  function go(path) {
    if (path.length === nums.length) { ans.push(path.slice()); return; }
    for (let j = 0; j < nums.length; j++) {
      if (used[j]) continue;
      if (j > 0 && nums[j] === nums[j - 1] && !used[j - 1]) continue;
      used[j] = true;
      path.push(nums[j]);
      go(path);
      path.pop();
      used[j] = false;
    }
  }
  go([]);
  return ans;
}`,
            python: `def permuteUnique(nums):
  nums = sorted(nums)
  ans = []
  used = [False] * len(nums)
  def go(path):
    if len(path) == len(nums):
      ans.append(path[:])
      return
    for j in range(len(nums)):
      if used[j]:
        continue
      if j > 0 and nums[j] == nums[j - 1] and not used[j - 1]:
        continue
      used[j] = True
      path.append(nums[j])
      go(path)
      path.pop()
      used[j] = False
  go([])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> permuteUnique(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(nums, new boolean[nums.length], new ArrayList<Integer>(), ans);
    return ans;
  }
  void go(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> ans) {
    if (path.size() == nums.length) { ans.add(new ArrayList<Integer>(path)); return; }
    for (int j = 0; j < nums.length; j++) {
      if (used[j]) continue;
      if (j > 0 && nums[j] == nums[j - 1] && !used[j - 1]) continue;
      used[j] = true;
      path.add(nums[j]);
      go(nums, used, path, ans);
      path.remove(path.size() - 1);
      used[j] = false;
    }
  }
}`,
            cpp: `void go(vector<int>& nums, vector<int>& used, vector<int>& path, vector<vector<int>>& ans) {
  if ((int)path.size() == (int)nums.size()) { ans.push_back(path); return; }
  for (int j = 0; j < (int)nums.size(); j++) {
    if (used[j]) continue;
    if (j > 0 && nums[j] == nums[j - 1] && !used[j - 1]) continue;
    used[j] = 1; path.push_back(nums[j]);
    go(nums, used, path, ans);
    path.pop_back(); used[j] = 0;
  }
}`,
            c: `void go(int* nums, int n, int* used, int* path, int len) {
  int j, k;
  if (len == n) {
    for (k = 0; k < n; k++) printf("%d ", path[k]);
    printf("\\n");
    return;
  }
  for (j = 0; j < n; j++) {
    if (used[j]) continue;
    if (j > 0 && nums[j] == nums[j - 1] && !used[j - 1]) continue;
    used[j] = 1; path[len] = nums[j];
    go(nums, n, used, path, len + 1);
    used[j] = 0;
  }
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n * n!)",
          space: "O(n)",
          why: "In-place swap. A tiny set of values already swapped into start this round stops identical branches. No sort required. Same unique output, less leftover copying.",
          code: `function permuteUnique(nums) {
  const ans = [];
  function go(start) {
    if (start === nums.length) { ans.push(nums.slice()); return; }
    const seen = {};
    for (let i = start; i < nums.length; i++) {
      if (seen[nums[i]]) continue;
      seen[nums[i]] = 1;
      const t = nums[start]; nums[start] = nums[i]; nums[i] = t;
      go(start + 1);
      const t2 = nums[start]; nums[start] = nums[i]; nums[i] = t2;
    }
  }
  go(0);
  return ans;
}`,
          codes: {
            javascript: `function permuteUnique(nums) {
  const ans = [];
  function go(start) {
    if (start === nums.length) { ans.push(nums.slice()); return; }
    const seen = {};
    for (let i = start; i < nums.length; i++) {
      if (seen[nums[i]]) continue;
      seen[nums[i]] = 1;
      const t = nums[start]; nums[start] = nums[i]; nums[i] = t;
      go(start + 1);
      const t2 = nums[start]; nums[start] = nums[i]; nums[i] = t2;
    }
  }
  go(0);
  return ans;
}`,
            python: `def permuteUnique(nums):
  ans = []
  def go(start):
    if start == len(nums):
      ans.append(nums[:])
      return
    seen = set()
    for i in range(start, len(nums)):
      if nums[i] in seen:
        continue
      seen.add(nums[i])
      nums[start], nums[i] = nums[i], nums[start]
      go(start + 1)
      nums[start], nums[i] = nums[i], nums[start]
  go(0)
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> permuteUnique(int[] nums) {
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(nums, 0, ans);
    return ans;
  }
  void go(int[] nums, int start, List<List<Integer>> ans) {
    if (start == nums.length) {
      List<Integer> cur = new ArrayList<Integer>();
      for (int x : nums) cur.add(x);
      ans.add(cur);
      return;
    }
    Set<Integer> seen = new HashSet<Integer>();
    for (int i = start; i < nums.length; i++) {
      if (!seen.add(nums[i])) continue;
      int t = nums[start]; nums[start] = nums[i]; nums[i] = t;
      go(nums, start + 1, ans);
      t = nums[start]; nums[start] = nums[i]; nums[i] = t;
    }
  }
}`,
            cpp: `void go(vector<int>& nums, int start, vector<vector<int>>& ans) {
  if (start == (int)nums.size()) { ans.push_back(nums); return; }
  unordered_set<int> seen;
  for (int i = start; i < (int)nums.size(); i++) {
    if (!seen.insert(nums[i]).second) continue;
    swap(nums[start], nums[i]);
    go(nums, start + 1, ans);
    swap(nums[start], nums[i]);
  }
}`,
            c: `void go(int* nums, int n, int start) {
  int i, k, t, ok, p;
  if (start == n) {
    for (k = 0; k < n; k++) printf("%d ", nums[k]);
    printf("\\n");
    return;
  }
  for (i = start; i < n; i++) {
    ok = 1;
    for (p = start; p < i; p++) if (nums[p] == nums[i]) { ok = 0; break; }
    if (!ok) continue;
    t = nums[start]; nums[start] = nums[i]; nums[i] = t;
    go(nums, n, start + 1);
    t = nums[start]; nums[start] = nums[i]; nums[i] = t;
  }
}`
          }
        }
      ]
    },
    {
      id: 5,
      level: "intermediate",
      q: "Combination Sum",
      ask: "Amazon · Airbnb · Google · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/combination-sum/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/combination-sum-1587115620/1"}],
      a: "Candidates are distinct positive integers. You may reuse a value. Return every combination that sums to target. Order inside a combination does not matter.\n\nTiny example: candidates = [2, 3, 6, 7], target = 7. Answers: [7] and [2,2,3].\n\nThe brute builds every combination of any length (extra copies) and keeps those whose sum is target. Standard backtrack tracks remain and reuses index i. After a sort, prune when candidates[i] > remain.\n\nOpen Brute, Optimal, and More optimal for generate-and-filter, reuse-index backtrack, and sorted prune.",
      solutions: [
        {
          name: "Brute",
          time: "O(n^{target/min})",
          space: "O(target/min)",
          why: "Every call copies path.concat. You keep going while the sum is not past target, with no sort prune. Extra arrays at every node. Correct but heavy.",
          code: `function combinationSum(cands, target) {
  const ans = [];
  function go(start, sum, path) {
    if (sum === target) { ans.push(path); return; }
    if (sum > target) return;
    for (let i = start; i < cands.length; i++) {
      go(i, sum + cands[i], path.concat([cands[i]]));
    }
  }
  go(0, 0, []);
  return ans;
}`,
          codes: {
            javascript: `function combinationSum(cands, target) {
  const ans = [];
  function go(start, sum, path) {
    if (sum === target) { ans.push(path); return; }
    if (sum > target) return;
    for (let i = start; i < cands.length; i++) {
      go(i, sum + cands[i], path.concat([cands[i]]));
    }
  }
  go(0, 0, []);
  return ans;
}`,
            python: `def combinationSum(cands, target):
  ans = []
  def go(start, sm, path):
    if sm == target:
      ans.append(path)
      return
    if sm > target:
      return
    for i in range(start, len(cands)):
      go(i, sm + cands[i], path + [cands[i]])
  go(0, 0, [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> combinationSum(int[] cands, int target) {
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(cands, 0, 0, target, new ArrayList<Integer>(), ans);
    return ans;
  }
  void go(int[] cands, int start, int sum, int target, List<Integer> path, List<List<Integer>> ans) {
    if (sum == target) { ans.add(new ArrayList<Integer>(path)); return; }
    if (sum > target) return;
    for (int i = start; i < cands.length; i++) {
      List<Integer> next = new ArrayList<Integer>(path);
      next.add(cands[i]);
      go(cands, i, sum + cands[i], target, next, ans);
    }
  }
}`,
            cpp: `void go(vector<int>& cands, int start, int sum, int target, vector<int> path, vector<vector<int>>& ans) {
  if (sum == target) { ans.push_back(path); return; }
  if (sum > target) return;
  for (int i = start; i < (int)cands.size(); i++) {
    path.push_back(cands[i]);
    go(cands, i, sum + cands[i], target, path, ans);
    path.pop_back();
  }
}`,
            c: `void go(int* cands, int n, int start, int sum, int target, int* path, int len) {
  int i, k;
  if (sum == target) {
    for (k = 0; k < len; k++) printf("%d ", path[k]);
    printf("\\n");
    return;
  }
  if (sum > target) return;
  for (i = start; i < n; i++) {
    path[len] = cands[i];
    go(cands, n, i, sum + cands[i], target, path, len + 1);
  }
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n^{target/min})",
          space: "O(target/min)",
          why: "One path, push/pop. remain shrinks. Call go(i, remain - cands[i]) to reuse this value, or move to i+1 to skip. Copy only at remain == 0.",
          code: `function combinationSum(cands, target) {
  const ans = [];
  function go(i, remain, path) {
    if (remain === 0) { ans.push(path.slice()); return; }
    if (i === cands.length || remain < 0) return;
    go(i + 1, remain, path);
    path.push(cands[i]);
    go(i, remain - cands[i], path);
    path.pop();
  }
  go(0, target, []);
  return ans;
}`,
          codes: {
            javascript: `function combinationSum(cands, target) {
  const ans = [];
  function go(i, remain, path) {
    if (remain === 0) { ans.push(path.slice()); return; }
    if (i === cands.length || remain < 0) return;
    go(i + 1, remain, path);
    path.push(cands[i]);
    go(i, remain - cands[i], path);
    path.pop();
  }
  go(0, target, []);
  return ans;
}`,
            python: `def combinationSum(cands, target):
  ans = []
  def go(i, remain, path):
    if remain == 0:
      ans.append(path[:])
      return
    if i == len(cands) or remain < 0:
      return
    go(i + 1, remain, path)
    path.append(cands[i])
    go(i, remain - cands[i], path)
    path.pop()
  go(0, target, [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> combinationSum(int[] cands, int target) {
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(cands, 0, target, new ArrayList<Integer>(), ans);
    return ans;
  }
  void go(int[] cands, int i, int remain, List<Integer> path, List<List<Integer>> ans) {
    if (remain == 0) { ans.add(new ArrayList<Integer>(path)); return; }
    if (i == cands.length || remain < 0) return;
    go(cands, i + 1, remain, path, ans);
    path.add(cands[i]);
    go(cands, i, remain - cands[i], path, ans);
    path.remove(path.size() - 1);
  }
}`,
            cpp: `void go(vector<int>& cands, int i, int remain, vector<int>& path, vector<vector<int>>& ans) {
  if (remain == 0) { ans.push_back(path); return; }
  if (i == (int)cands.size() || remain < 0) return;
  go(cands, i + 1, remain, path, ans);
  path.push_back(cands[i]);
  go(cands, i, remain - cands[i], path, ans);
  path.pop_back();
}`,
            c: `void go(int* cands, int n, int i, int remain, int* path, int len) {
  int k;
  if (remain == 0) {
    for (k = 0; k < len; k++) printf("%d ", path[k]);
    printf("\\n");
    return;
  }
  if (i == n || remain < 0) return;
  go(cands, n, i + 1, remain, path, len);
  path[len] = cands[i];
  go(cands, n, i, remain - cands[i], path, len + 1);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n^{target/min})",
          space: "O(target/min)",
          why: "Sort first. In the for-loop, break when cands[i] > remain so larger later values are never tried. Same answers, fewer dead branches.",
          code: `function combinationSum(cands, target) {
  cands = cands.slice().sort(function (a, b) { return a - b; });
  const ans = [];
  function go(start, remain, path) {
    if (remain === 0) { ans.push(path.slice()); return; }
    for (let i = start; i < cands.length; i++) {
      if (cands[i] > remain) break;
      path.push(cands[i]);
      go(i, remain - cands[i], path);
      path.pop();
    }
  }
  go(0, target, []);
  return ans;
}`,
          codes: {
            javascript: `function combinationSum(cands, target) {
  cands = cands.slice().sort(function (a, b) { return a - b; });
  const ans = [];
  function go(start, remain, path) {
    if (remain === 0) { ans.push(path.slice()); return; }
    for (let i = start; i < cands.length; i++) {
      if (cands[i] > remain) break;
      path.push(cands[i]);
      go(i, remain - cands[i], path);
      path.pop();
    }
  }
  go(0, target, []);
  return ans;
}`,
            python: `def combinationSum(cands, target):
  cands = sorted(cands)
  ans = []
  def go(start, remain, path):
    if remain == 0:
      ans.append(path[:])
      return
    for i in range(start, len(cands)):
      if cands[i] > remain:
        break
      path.append(cands[i])
      go(i, remain - cands[i], path)
      path.pop()
  go(0, target, [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> combinationSum(int[] cands, int target) {
    Arrays.sort(cands);
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(cands, 0, target, new ArrayList<Integer>(), ans);
    return ans;
  }
  void go(int[] cands, int start, int remain, List<Integer> path, List<List<Integer>> ans) {
    if (remain == 0) { ans.add(new ArrayList<Integer>(path)); return; }
    for (int i = start; i < cands.length; i++) {
      if (cands[i] > remain) break;
      path.add(cands[i]);
      go(cands, i, remain - cands[i], path, ans);
      path.remove(path.size() - 1);
    }
  }
}`,
            cpp: `void go(vector<int>& cands, int start, int remain, vector<int>& path, vector<vector<int>>& ans) {
  if (remain == 0) { ans.push_back(path); return; }
  for (int i = start; i < (int)cands.size(); i++) {
    if (cands[i] > remain) break;
    path.push_back(cands[i]);
    go(cands, i, remain - cands[i], path, ans);
    path.pop_back();
  }
}`,
            c: `void go(int* cands, int n, int start, int remain, int* path, int len) {
  int i, k;
  if (remain == 0) {
    for (k = 0; k < len; k++) printf("%d ", path[k]);
    printf("\\n");
    return;
  }
  for (i = start; i < n; i++) {
    if (cands[i] > remain) break;
    path[len] = cands[i];
    go(cands, n, i, remain - cands[i], path, len + 1);
  }
}`
          }
        }
      ]
    },
    {
      id: 6,
      level: "intermediate",
      q: "Combination Sum II",
      ask: "Amazon · Microsoft · Google",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/combination-sum-ii/"}],
      a: "Candidates may contain duplicates. Each index may be used at most once. Return unique combinations that sum to target.\n\nTiny example: candidates = [10, 1, 2, 7, 6, 1, 5], target = 8. One answer is [1, 1, 6]. [1, 7] appears once even though 1 appears twice in the input as a starter paired with 7.\n\nSort, skip duplicate values at the same start, and move to i+1 after a take. Prune when nums[i] > remain.\n\nOpen Brute, Optimal, and More optimal for generate-all-then-Set, sort-and-skip, and prune.",
      solutions: [
        {
          name: "Brute",
          time: "O(n * 2^n)",
          space: "O(n * 2^n)",
          why: "Every index is take or skip with extra path copies. Keep combinations whose sum is target, unique them with a sorted-tuple Set. Duplicate indexes still explore the full 2^n tree.",
          code: `function combinationSum2(cands, target) {
  const seen = new Set();
  const ans = [];
  function go(i, sum, path) {
    if (sum === target) {
      const key = path.slice().sort(function (a, b) { return a - b; }).join(",");
      if (!seen.has(key)) { seen.add(key); ans.push(path.slice()); }
      return;
    }
    if (i === cands.length || sum > target) return;
    go(i + 1, sum, path.slice());
    go(i + 1, sum + cands[i], path.concat([cands[i]]));
  }
  go(0, 0, []);
  return ans;
}`,
          codes: {
            javascript: `function combinationSum2(cands, target) {
  const seen = new Set();
  const ans = [];
  function go(i, sum, path) {
    if (sum === target) {
      const key = path.slice().sort(function (a, b) { return a - b; }).join(",");
      if (!seen.has(key)) { seen.add(key); ans.push(path.slice()); }
      return;
    }
    if (i === cands.length || sum > target) return;
    go(i + 1, sum, path.slice());
    go(i + 1, sum + cands[i], path.concat([cands[i]]));
  }
  go(0, 0, []);
  return ans;
}`,
            python: `def combinationSum2(cands, target):
  seen = set()
  ans = []
  def go(i, sm, path):
    if sm == target:
      key = tuple(sorted(path))
      if key not in seen:
        seen.add(key)
        ans.append(path[:])
      return
    if i == len(cands) or sm > target:
      return
    go(i + 1, sm, path[:])
    go(i + 1, sm + cands[i], path + [cands[i]])
  go(0, 0, [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> combinationSum2(int[] cands, int target) {
    Set<String> seen = new HashSet<String>();
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(cands, 0, 0, target, new ArrayList<Integer>(), seen, ans);
    return ans;
  }
  void go(int[] cands, int i, int sum, int target, List<Integer> path, Set<String> seen, List<List<Integer>> ans) {
    if (sum == target) {
      List<Integer> copy = new ArrayList<Integer>(path);
      Collections.sort(copy);
      if (seen.add(copy.toString())) ans.add(copy);
      return;
    }
    if (i == cands.length || sum > target) return;
    go(cands, i + 1, sum, target, new ArrayList<Integer>(path), seen, ans);
    List<Integer> take = new ArrayList<Integer>(path);
    take.add(cands[i]);
    go(cands, i + 1, sum + cands[i], target, take, seen, ans);
  }
}`,
            cpp: `void go(vector<int>& cands, int i, int sum, int target, vector<int> path, set<vector<int>>& seen, vector<vector<int>>& ans) {
  if (sum == target) {
    sort(path.begin(), path.end());
    if (seen.insert(path).second) ans.push_back(path);
    return;
  }
  if (i == (int)cands.size() || sum > target) return;
  go(cands, i + 1, sum, target, path, seen, ans);
  path.push_back(cands[i]);
  go(cands, i + 1, sum + cands[i], target, path, seen, ans);
}`,
            c: `void go(int* cands, int n, int i, int sum, int target, int* path, int len) {
  int k;
  if (sum == target) {
    for (k = 0; k < len; k++) printf("%d ", path[k]);
    printf("\\n");
    return;
  }
  if (i == n || sum > target) return;
  go(cands, n, i + 1, sum, target, path, len);
  path[len] = cands[i];
  go(cands, n, i + 1, sum + cands[i], target, path, len + 1);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n * 2^n)",
          space: "O(n)",
          why: "Sort. Skip nums[i] == nums[i-1] at the same start so identical values do not start the same role twice. Each index is used at most once (go(i+1)).",
          code: `function combinationSum2(cands, target) {
  cands = cands.slice().sort(function (a, b) { return a - b; });
  const ans = [];
  function go(start, remain, path) {
    if (remain === 0) { ans.push(path.slice()); return; }
    for (let i = start; i < cands.length; i++) {
      if (i > start && cands[i] === cands[i - 1]) continue;
      if (cands[i] > remain) continue;
      path.push(cands[i]);
      go(i + 1, remain - cands[i], path);
      path.pop();
    }
  }
  go(0, target, []);
  return ans;
}`,
          codes: {
            javascript: `function combinationSum2(cands, target) {
  cands = cands.slice().sort(function (a, b) { return a - b; });
  const ans = [];
  function go(start, remain, path) {
    if (remain === 0) { ans.push(path.slice()); return; }
    for (let i = start; i < cands.length; i++) {
      if (i > start && cands[i] === cands[i - 1]) continue;
      if (cands[i] > remain) continue;
      path.push(cands[i]);
      go(i + 1, remain - cands[i], path);
      path.pop();
    }
  }
  go(0, target, []);
  return ans;
}`,
            python: `def combinationSum2(cands, target):
  cands = sorted(cands)
  ans = []
  def go(start, remain, path):
    if remain == 0:
      ans.append(path[:])
      return
    for i in range(start, len(cands)):
      if i > start and cands[i] == cands[i - 1]:
        continue
      if cands[i] > remain:
        continue
      path.append(cands[i])
      go(i + 1, remain - cands[i], path)
      path.pop()
  go(0, target, [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> combinationSum2(int[] cands, int target) {
    Arrays.sort(cands);
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(cands, 0, target, new ArrayList<Integer>(), ans);
    return ans;
  }
  void go(int[] cands, int start, int remain, List<Integer> path, List<List<Integer>> ans) {
    if (remain == 0) { ans.add(new ArrayList<Integer>(path)); return; }
    for (int i = start; i < cands.length; i++) {
      if (i > start && cands[i] == cands[i - 1]) continue;
      if (cands[i] > remain) continue;
      path.add(cands[i]);
      go(cands, i + 1, remain - cands[i], path, ans);
      path.remove(path.size() - 1);
    }
  }
}`,
            cpp: `void go(vector<int>& cands, int start, int remain, vector<int>& path, vector<vector<int>>& ans) {
  if (remain == 0) { ans.push_back(path); return; }
  for (int i = start; i < (int)cands.size(); i++) {
    if (i > start && cands[i] == cands[i - 1]) continue;
    if (cands[i] > remain) continue;
    path.push_back(cands[i]);
    go(cands, i + 1, remain - cands[i], path, ans);
    path.pop_back();
  }
}`,
            c: `void go(int* cands, int n, int start, int remain, int* path, int len) {
  int i, k;
  if (remain == 0) {
    for (k = 0; k < len; k++) printf("%d ", path[k]);
    printf("\\n");
    return;
  }
  for (i = start; i < n; i++) {
    if (i > start && cands[i] == cands[i - 1]) continue;
    if (cands[i] > remain) continue;
    path[len] = cands[i];
    go(cands, n, i + 1, remain - cands[i], path, len + 1);
  }
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n * 2^n)",
          space: "O(n)",
          why: "After sort, break when cands[i] > remain. Later values are larger, so they cannot help. Same unique combinations, fewer recursive calls.",
          code: `function combinationSum2(cands, target) {
  cands = cands.slice().sort(function (a, b) { return a - b; });
  const ans = [];
  function go(start, remain, path) {
    if (remain === 0) { ans.push(path.slice()); return; }
    for (let i = start; i < cands.length; i++) {
      if (cands[i] > remain) break;
      if (i > start && cands[i] === cands[i - 1]) continue;
      path.push(cands[i]);
      go(i + 1, remain - cands[i], path);
      path.pop();
    }
  }
  go(0, target, []);
  return ans;
}`,
          codes: {
            javascript: `function combinationSum2(cands, target) {
  cands = cands.slice().sort(function (a, b) { return a - b; });
  const ans = [];
  function go(start, remain, path) {
    if (remain === 0) { ans.push(path.slice()); return; }
    for (let i = start; i < cands.length; i++) {
      if (cands[i] > remain) break;
      if (i > start && cands[i] === cands[i - 1]) continue;
      path.push(cands[i]);
      go(i + 1, remain - cands[i], path);
      path.pop();
    }
  }
  go(0, target, []);
  return ans;
}`,
            python: `def combinationSum2(cands, target):
  cands = sorted(cands)
  ans = []
  def go(start, remain, path):
    if remain == 0:
      ans.append(path[:])
      return
    for i in range(start, len(cands)):
      if cands[i] > remain:
        break
      if i > start and cands[i] == cands[i - 1]:
        continue
      path.append(cands[i])
      go(i + 1, remain - cands[i], path)
      path.pop()
  go(0, target, [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> combinationSum2(int[] cands, int target) {
    Arrays.sort(cands);
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(cands, 0, target, new ArrayList<Integer>(), ans);
    return ans;
  }
  void go(int[] cands, int start, int remain, List<Integer> path, List<List<Integer>> ans) {
    if (remain == 0) { ans.add(new ArrayList<Integer>(path)); return; }
    for (int i = start; i < cands.length; i++) {
      if (cands[i] > remain) break;
      if (i > start && cands[i] == cands[i - 1]) continue;
      path.add(cands[i]);
      go(cands, i + 1, remain - cands[i], path, ans);
      path.remove(path.size() - 1);
    }
  }
}`,
            cpp: `void go(vector<int>& cands, int start, int remain, vector<int>& path, vector<vector<int>>& ans) {
  if (remain == 0) { ans.push_back(path); return; }
  for (int i = start; i < (int)cands.size(); i++) {
    if (cands[i] > remain) break;
    if (i > start && cands[i] == cands[i - 1]) continue;
    path.push_back(cands[i]);
    go(cands, i + 1, remain - cands[i], path, ans);
    path.pop_back();
  }
}`,
            c: `void go(int* cands, int n, int start, int remain, int* path, int len) {
  int i, k;
  if (remain == 0) {
    for (k = 0; k < len; k++) printf("%d ", path[k]);
    printf("\\n");
    return;
  }
  for (i = start; i < n; i++) {
    if (cands[i] > remain) break;
    if (i > start && cands[i] == cands[i - 1]) continue;
    path[len] = cands[i];
    go(cands, n, i + 1, remain - cands[i], path, len + 1);
  }
}`
          }
        }
      ]
    },
    {
      id: 7,
      level: "intermediate",
      q: "Palindrome Partitioning",
      ask: "Amazon · Google · Bloomberg",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/palindrome-partitioning/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/palindromic-patitioning4845/1"}],
      a: "Cut string s into pieces so every piece is a palindrome. Return every such cutting.\n\nTiny example: s = \"aab\". Two cuttings: [\"a\",\"a\",\"b\"] and [\"aa\",\"b\"]. \"aab\" itself is not a palindrome, so it is not a one-piece answer.\n\nThe brute builds every cut of the string (extra copies of the piece list) and checks palindromes at the end. Standard backtrack only extends with a palindrome piece. Precomputing a pal[l][r] table makes each check O(1).\n\nOpen Brute, Optimal, and More optimal for all-cuts, two-pointer checks, and the DP table.",
      solutions: [
        {
          name: "Brute",
          time: "O(n * 2^n)",
          space: "O(n * 2^n)",
          why: "At each index you either cut or keep growing the last piece, copying the piece list every time. After a full partition you test every piece. Many illegal cuttings are built first and thrown away.",
          code: `function partition(s) {
  const ans = [];
  function isPal(parts) {
    for (let p = 0; p < parts.length; p++) {
      const w = parts[p];
      let l = 0, r = w.length - 1;
      while (l < r) { if (w[l] !== w[r]) return false; l++; r--; }
    }
    return true;
  }
  function go(i, parts, cur) {
    if (i === s.length) {
      const all = cur.length ? parts.concat([cur]) : parts.slice();
      if (isPal(all)) ans.push(all);
      return;
    }
    go(i + 1, parts.slice(), cur + s[i]);
    if (cur.length) go(i, parts.concat([cur]), "");
  }
  go(0, [], "");
  return ans;
}`,
          codes: {
            javascript: `function partition(s) {
  const ans = [];
  function isPal(parts) {
    for (let p = 0; p < parts.length; p++) {
      const w = parts[p];
      let l = 0, r = w.length - 1;
      while (l < r) { if (w[l] !== w[r]) return false; l++; r--; }
    }
    return true;
  }
  function go(i, parts, cur) {
    if (i === s.length) {
      const all = cur.length ? parts.concat([cur]) : parts.slice();
      if (isPal(all)) ans.push(all);
      return;
    }
    go(i + 1, parts.slice(), cur + s[i]);
    if (cur.length) go(i, parts.concat([cur]), "");
  }
  go(0, [], "");
  return ans;
}`,
            python: `def partition(s):
  ans = []
  def is_pal(parts):
    for w in parts:
      if w != w[::-1]:
        return False
    return True
  def go(i, parts, cur):
    if i == len(s):
      allp = parts + [cur] if cur else parts[:]
      if is_pal(allp):
        ans.append(allp)
      return
    go(i + 1, parts[:], cur + s[i])
    if cur:
      go(i, parts + [cur], "")
  go(0, [], "")
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<String>> partition(String s) {
    List<List<String>> ans = new ArrayList<List<String>>();
    go(s, 0, new ArrayList<String>(), "", ans);
    return ans;
  }
  boolean isPal(List<String> parts) {
    for (String w : parts) {
      int l = 0, r = w.length() - 1;
      while (l < r) { if (w.charAt(l) != w.charAt(r)) return false; l++; r--; }
    }
    return true;
  }
  void go(String s, int i, List<String> parts, String cur, List<List<String>> ans) {
    if (i == s.length()) {
      List<String> all = new ArrayList<String>(parts);
      if (cur.length() > 0) all.add(cur);
      if (isPal(all)) ans.add(all);
      return;
    }
    go(s, i + 1, new ArrayList<String>(parts), cur + s.charAt(i), ans);
    if (cur.length() > 0) {
      List<String> cut = new ArrayList<String>(parts);
      cut.add(cur);
      go(s, i, cut, "", ans);
    }
  }
}`,
            cpp: `bool isPalParts(vector<string>& parts) {
  for (auto& w : parts) {
    int l = 0, r = (int)w.size() - 1;
    while (l < r) { if (w[l] != w[r]) return false; l++; r--; }
  }
  return true;
}
void go(string& s, int i, vector<string> parts, string cur, vector<vector<string>>& ans) {
  if (i == (int)s.size()) {
    if (cur.size()) parts.push_back(cur);
    if (isPalParts(parts)) ans.push_back(parts);
    return;
  }
  go(s, i + 1, parts, cur + s[i], ans);
  if (cur.size()) {
    parts.push_back(cur);
    go(s, i, parts, "", ans);
  }
}`,
            c: `int isPal(const char* s, int l, int r) {
  while (l < r) { if (s[l] != s[r]) return 0; l++; r--; }
  return 1;
}
/* brute: try every cut mask after building the string; classroom print */
void partitionBrute(const char* s) {
  int n = (int)strlen(s), mask, i, ok, start;
  int maxMask = 1 << (n > 0 ? n - 1 : 0);
  for (mask = 0; mask < maxMask; mask++) {
    ok = 1; start = 0;
    for (i = 0; i < n - 1; i++) if (mask & (1 << i)) {
      if (!isPal(s, start, i)) { ok = 0; break; }
      start = i + 1;
    }
    if (ok && isPal(s, start, n - 1)) printf("ok mask %d\\n", mask);
  }
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n * 2^n)",
          space: "O(n)",
          why: "From start, try every end. If s[start..end] is a palindrome, push it, recurse end+1, pop. Illegal prefixes never grow. Copy only at the end of s.",
          code: `function partition(s) {
  const ans = [];
  function isPal(l, r) {
    while (l < r) { if (s[l] !== s[r]) return false; l++; r--; }
    return true;
  }
  function go(start, path) {
    if (start === s.length) { ans.push(path.slice()); return; }
    for (let end = start; end < s.length; end++) {
      if (!isPal(start, end)) continue;
      path.push(s.slice(start, end + 1));
      go(end + 1, path);
      path.pop();
    }
  }
  go(0, []);
  return ans;
}`,
          codes: {
            javascript: `function partition(s) {
  const ans = [];
  function isPal(l, r) {
    while (l < r) { if (s[l] !== s[r]) return false; l++; r--; }
    return true;
  }
  function go(start, path) {
    if (start === s.length) { ans.push(path.slice()); return; }
    for (let end = start; end < s.length; end++) {
      if (!isPal(start, end)) continue;
      path.push(s.slice(start, end + 1));
      go(end + 1, path);
      path.pop();
    }
  }
  go(0, []);
  return ans;
}`,
            python: `def partition(s):
  ans = []
  def is_pal(l, r):
    while l < r:
      if s[l] != s[r]:
        return False
      l += 1
      r -= 1
    return True
  def go(start, path):
    if start == len(s):
      ans.append(path[:])
      return
    for end in range(start, len(s)):
      if not is_pal(start, end):
        continue
      path.append(s[start:end + 1])
      go(end + 1, path)
      path.pop()
  go(0, [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<String>> partition(String s) {
    List<List<String>> ans = new ArrayList<List<String>>();
    go(s, 0, new ArrayList<String>(), ans);
    return ans;
  }
  boolean isPal(String s, int l, int r) {
    while (l < r) { if (s.charAt(l) != s.charAt(r)) return false; l++; r--; }
    return true;
  }
  void go(String s, int start, List<String> path, List<List<String>> ans) {
    if (start == s.length()) { ans.add(new ArrayList<String>(path)); return; }
    for (int end = start; end < s.length(); end++) {
      if (!isPal(s, start, end)) continue;
      path.add(s.substring(start, end + 1));
      go(s, end + 1, path, ans);
      path.remove(path.size() - 1);
    }
  }
}`,
            cpp: `bool isPal(const string& s, int l, int r) {
  while (l < r) { if (s[l] != s[r]) return false; l++; r--; }
  return true;
}
void go(const string& s, int start, vector<string>& path, vector<vector<string>>& ans) {
  if (start == (int)s.size()) { ans.push_back(path); return; }
  for (int end = start; end < (int)s.size(); end++) {
    if (!isPal(s, start, end)) continue;
    path.push_back(s.substr(start, end - start + 1));
    go(s, end + 1, path, ans);
    path.pop_back();
  }
}`,
            c: `int isPal(const char* s, int l, int r) {
  while (l < r) { if (s[l] != s[r]) return 0; l++; r--; }
  return 1;
}
void go(const char* s, int n, int start, int* cuts, int ncuts) {
  int end, k;
  if (start == n) {
    printf("partition\\n");
    return;
  }
  for (end = start; end < n; end++) {
    if (!isPal(s, start, end)) continue;
    cuts[ncuts] = end;
    go(s, n, end + 1, cuts, ncuts + 1);
  }
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n * 2^n)",
          space: "O(n^2)",
          why: "pal[l][r] is true if s[l..r] is a palindrome. Fill in O(n^2). Each cut check is then O(1). Same 2^n cuttings, cheaper work per node.",
          code: `function partition(s) {
  const n = s.length;
  const pal = Array.from({ length: n }, function () { return Array(n).fill(false); });
  for (let i = 0; i < n; i++) pal[i][i] = true;
  for (let i = 0; i < n - 1; i++) pal[i][i + 1] = s[i] === s[i + 1];
  for (let len = 3; len <= n; len++) {
    for (let l = 0; l + len - 1 < n; l++) {
      const r = l + len - 1;
      pal[l][r] = s[l] === s[r] && pal[l + 1][r - 1];
    }
  }
  const ans = [];
  function go(start, path) {
    if (start === n) { ans.push(path.slice()); return; }
    for (let end = start; end < n; end++) {
      if (!pal[start][end]) continue;
      path.push(s.slice(start, end + 1));
      go(end + 1, path);
      path.pop();
    }
  }
  go(0, []);
  return ans;
}`,
          codes: {
            javascript: `function partition(s) {
  const n = s.length;
  const pal = Array.from({ length: n }, function () { return Array(n).fill(false); });
  for (let i = 0; i < n; i++) pal[i][i] = true;
  for (let i = 0; i < n - 1; i++) pal[i][i + 1] = s[i] === s[i + 1];
  for (let len = 3; len <= n; len++) {
    for (let l = 0; l + len - 1 < n; l++) {
      const r = l + len - 1;
      pal[l][r] = s[l] === s[r] && pal[l + 1][r - 1];
    }
  }
  const ans = [];
  function go(start, path) {
    if (start === n) { ans.push(path.slice()); return; }
    for (let end = start; end < n; end++) {
      if (!pal[start][end]) continue;
      path.push(s.slice(start, end + 1));
      go(end + 1, path);
      path.pop();
    }
  }
  go(0, []);
  return ans;
}`,
            python: `def partition(s):
  n = len(s)
  pal = [[False] * n for _ in range(n)]
  for i in range(n):
    pal[i][i] = True
  for i in range(n - 1):
    pal[i][i + 1] = s[i] == s[i + 1]
  for length in range(3, n + 1):
    for l in range(n - length + 1):
      r = l + length - 1
      pal[l][r] = s[l] == s[r] and pal[l + 1][r - 1]
  ans = []
  def go(start, path):
    if start == n:
      ans.append(path[:])
      return
    for end in range(start, n):
      if not pal[start][end]:
        continue
      path.append(s[start:end + 1])
      go(end + 1, path)
      path.pop()
  go(0, [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<String>> partition(String s) {
    int n = s.length();
    boolean[][] pal = new boolean[n][n];
    for (int i = 0; i < n; i++) pal[i][i] = true;
    for (int i = 0; i < n - 1; i++) pal[i][i + 1] = s.charAt(i) == s.charAt(i + 1);
    for (int len = 3; len <= n; len++) {
      for (int l = 0; l + len - 1 < n; l++) {
        int r = l + len - 1;
        pal[l][r] = s.charAt(l) == s.charAt(r) && pal[l + 1][r - 1];
      }
    }
    List<List<String>> ans = new ArrayList<List<String>>();
    go(s, 0, pal, new ArrayList<String>(), ans);
    return ans;
  }
  void go(String s, int start, boolean[][] pal, List<String> path, List<List<String>> ans) {
    if (start == s.length()) { ans.add(new ArrayList<String>(path)); return; }
    for (int end = start; end < s.length(); end++) {
      if (!pal[start][end]) continue;
      path.add(s.substring(start, end + 1));
      go(s, end + 1, pal, path, ans);
      path.remove(path.size() - 1);
    }
  }
}`,
            cpp: `vector<vector<string>> partition(string s) {
  int n = (int)s.size();
  vector<vector<int>> pal(n, vector<int>(n, 0));
  for (int i = 0; i < n; i++) pal[i][i] = 1;
  for (int i = 0; i < n - 1; i++) pal[i][i + 1] = s[i] == s[i + 1];
  for (int len = 3; len <= n; len++)
    for (int l = 0; l + len - 1 < n; l++) {
      int r = l + len - 1;
      pal[l][r] = s[l] == s[r] && pal[l + 1][r - 1];
    }
  vector<vector<string>> ans;
  vector<string> path;
  function<void(int)> go = [&](int start) {
    if (start == n) { ans.push_back(path); return; }
    for (int end = start; end < n; end++) {
      if (!pal[start][end]) continue;
      path.push_back(s.substr(start, end - start + 1));
      go(end + 1);
      path.pop_back();
    }
  };
  go(0);
  return ans;
}`,
            c: `void fillPal(const char* s, int n, int pal[][32]) {
  int i, l, r, len;
  for (i = 0; i < n; i++) pal[i][i] = 1;
  for (i = 0; i < n - 1; i++) pal[i][i + 1] = s[i] == s[i + 1];
  for (len = 3; len <= n; len++)
    for (l = 0; l + len - 1 < n; l++) {
      r = l + len - 1;
      pal[l][r] = (s[l] == s[r] && pal[l + 1][r - 1]);
    }
}`
          }
        }
      ]
    },
    {
      id: 8,
      level: "advanced",
      q: "N-Queens",
      ask: "Amazon · Google · Microsoft · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/n-queens/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/n-queen-problem-1587115620/1"}],
      a: "Place n queens on an n x n board so none share a row, column, or diagonal. Return every board as n strings of '.' and 'Q'.\n\nTiny example: n = 4 has two solutions. One is queens at (0,1), (1,3), (2,0), (3,2) in 0-based row, col.\n\nThe brute tries every permutation of columns (one queen per row and column) and only then checks diagonals. Standard backtrack checks col/diag before placing. Bitmasks make those checks O(1) with shifts.\n\nOpen Brute, Optimal, and More optimal for permutations, arrays, and bitmasks.",
      solutions: [
        {
          name: "Brute",
          time: "O(n * n!)",
          space: "O(n^2)",
          why: "Generate every permutation of columns with extra copies. After a full permutation, scan every pair for a shared diagonal. Most permutations fail only at the end.",
          code: `function solveNQueens(n) {
  const ans = [];
  function ok(cols) {
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(i - j) === Math.abs(cols[i] - cols[j])) return false;
      }
    }
    return true;
  }
  function go(left, cols) {
    if (left.length === 0) {
      if (!ok(cols)) return;
      const board = [];
      for (let r = 0; r < n; r++) {
        let row = "";
        for (let c = 0; c < n; c++) row += c === cols[r] ? "Q" : ".";
        board.push(row);
      }
      ans.push(board);
      return;
    }
    for (let i = 0; i < left.length; i++) {
      go(left.slice(0, i).concat(left.slice(i + 1)), cols.concat([left[i]]));
    }
  }
  const left = [];
  for (let c = 0; c < n; c++) left.push(c);
  go(left, []);
  return ans;
}`,
          codes: {
            javascript: `function solveNQueens(n) {
  const ans = [];
  function ok(cols) {
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(i - j) === Math.abs(cols[i] - cols[j])) return false;
      }
    }
    return true;
  }
  function go(left, cols) {
    if (left.length === 0) {
      if (!ok(cols)) return;
      const board = [];
      for (let r = 0; r < n; r++) {
        let row = "";
        for (let c = 0; c < n; c++) row += c === cols[r] ? "Q" : ".";
        board.push(row);
      }
      ans.push(board);
      return;
    }
    for (let i = 0; i < left.length; i++) {
      go(left.slice(0, i).concat(left.slice(i + 1)), cols.concat([left[i]]));
    }
  }
  const left = [];
  for (let c = 0; c < n; c++) left.push(c);
  go(left, []);
  return ans;
}`,
            python: `def solveNQueens(n):
  ans = []
  def ok(cols):
    for i in range(n):
      for j in range(i + 1, n):
        if abs(i - j) == abs(cols[i] - cols[j]):
          return False
    return True
  def go(left, cols):
    if not left:
      if not ok(cols):
        return
      board = []
      for r in range(n):
        board.append("".join("Q" if c == cols[r] else "." for c in range(n)))
      ans.append(board)
      return
    for i in range(len(left)):
      go(left[:i] + left[i+1:], cols + [left[i]])
  go(list(range(n)), [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<String>> solveNQueens(int n) {
    List<List<String>> ans = new ArrayList<List<String>>();
    List<Integer> left = new ArrayList<Integer>();
    for (int c = 0; c < n; c++) left.add(c);
    go(n, left, new ArrayList<Integer>(), ans);
    return ans;
  }
  boolean ok(List<Integer> cols) {
    int n = cols.size();
    for (int i = 0; i < n; i++) for (int j = i + 1; j < n; j++)
      if (Math.abs(i - j) == Math.abs(cols.get(i) - cols.get(j))) return false;
    return true;
  }
  void go(int n, List<Integer> left, List<Integer> cols, List<List<String>> ans) {
    if (left.isEmpty()) {
      if (!ok(cols)) return;
      List<String> board = new ArrayList<String>();
      for (int r = 0; r < n; r++) {
        char[] row = new char[n];
        Arrays.fill(row, '.');
        row[cols.get(r)] = 'Q';
        board.add(new String(row));
      }
      ans.add(board);
      return;
    }
    for (int i = 0; i < left.size(); i++) {
      List<Integer> nextLeft = new ArrayList<Integer>(left);
      List<Integer> nextCols = new ArrayList<Integer>(cols);
      nextCols.add(nextLeft.remove(i));
      go(n, nextLeft, nextCols, ans);
    }
  }
}`,
            cpp: `bool ok(vector<int>& cols) {
  int n = (int)cols.size();
  for (int i = 0; i < n; i++) for (int j = i + 1; j < n; j++)
    if (abs(i - j) == abs(cols[i] - cols[j])) return false;
  return true;
}
void go(int n, vector<int> left, vector<int> cols, vector<vector<string>>& ans) {
  if (left.empty()) {
    if (!ok(cols)) return;
    vector<string> board(n, string(n, '.'));
    for (int r = 0; r < n; r++) board[r][cols[r]] = 'Q';
    ans.push_back(board);
    return;
  }
  for (int i = 0; i < (int)left.size(); i++) {
    vector<int> nextLeft = left, nextCols = cols;
    nextCols.push_back(nextLeft[i]);
    nextLeft.erase(nextLeft.begin() + i);
    go(n, nextLeft, nextCols, ans);
  }
}`,
            c: `int ok(int* cols, int n) {
  int i, j;
  for (i = 0; i < n; i++) for (j = i + 1; j < n; j++)
    if ((i > j ? i - j : j - i) == (cols[i] > cols[j] ? cols[i] - cols[j] : cols[j] - cols[i])) return 0;
  return 1;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n!)",
          space: "O(n^2)",
          why: "Place one queen per row. col[], d1[], d2[] mark attacks. If the square is free, mark, recurse row+1, unmark. Failures die as soon as a row has no square.",
          code: `function solveNQueens(n) {
  const ans = [];
  const board = Array.from({ length: n }, function () { return Array(n).fill("."); });
  const col = Array(n).fill(0);
  const d1 = Array(2 * n).fill(0);
  const d2 = Array(2 * n).fill(0);
  function go(row) {
    if (row === n) {
      ans.push(board.map(function (r) { return r.join(""); }));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (col[c] || d1[row - c + n] || d2[row + c]) continue;
      col[c] = d1[row - c + n] = d2[row + c] = 1;
      board[row][c] = "Q";
      go(row + 1);
      board[row][c] = ".";
      col[c] = d1[row - c + n] = d2[row + c] = 0;
    }
  }
  go(0);
  return ans;
}`,
          codes: {
            javascript: `function solveNQueens(n) {
  const ans = [];
  const board = Array.from({ length: n }, function () { return Array(n).fill("."); });
  const col = Array(n).fill(0);
  const d1 = Array(2 * n).fill(0);
  const d2 = Array(2 * n).fill(0);
  function go(row) {
    if (row === n) {
      ans.push(board.map(function (r) { return r.join(""); }));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (col[c] || d1[row - c + n] || d2[row + c]) continue;
      col[c] = d1[row - c + n] = d2[row + c] = 1;
      board[row][c] = "Q";
      go(row + 1);
      board[row][c] = ".";
      col[c] = d1[row - c + n] = d2[row + c] = 0;
    }
  }
  go(0);
  return ans;
}`,
            python: `def solveNQueens(n):
  ans = []
  board = [["."] * n for _ in range(n)]
  col = [0] * n
  d1 = [0] * (2 * n)
  d2 = [0] * (2 * n)
  def go(row):
    if row == n:
      ans.append(["".join(r) for r in board])
      return
    for c in range(n):
      if col[c] or d1[row - c + n] or d2[row + c]:
        continue
      col[c] = d1[row - c + n] = d2[row + c] = 1
      board[row][c] = "Q"
      go(row + 1)
      board[row][c] = "."
      col[c] = d1[row - c + n] = d2[row + c] = 0
  go(0)
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<String>> solveNQueens(int n) {
    List<List<String>> ans = new ArrayList<List<String>>();
    char[][] board = new char[n][n];
    for (int i = 0; i < n; i++) Arrays.fill(board[i], '.');
    go(0, n, board, new int[n], new int[2 * n], new int[2 * n], ans);
    return ans;
  }
  void go(int row, int n, char[][] board, int[] col, int[] d1, int[] d2, List<List<String>> ans) {
    if (row == n) {
      List<String> cur = new ArrayList<String>();
      for (int i = 0; i < n; i++) cur.add(new String(board[i]));
      ans.add(cur);
      return;
    }
    for (int c = 0; c < n; c++) {
      if (col[c] != 0 || d1[row - c + n] != 0 || d2[row + c] != 0) continue;
      col[c] = d1[row - c + n] = d2[row + c] = 1;
      board[row][c] = 'Q';
      go(row + 1, n, board, col, d1, d2, ans);
      board[row][c] = '.';
      col[c] = d1[row - c + n] = d2[row + c] = 0;
    }
  }
}`,
            cpp: `void go(int row, int n, vector<string>& board, vector<int>& col, vector<int>& d1, vector<int>& d2, vector<vector<string>>& ans) {
  if (row == n) { ans.push_back(board); return; }
  for (int c = 0; c < n; c++) {
    if (col[c] || d1[row - c + n] || d2[row + c]) continue;
    col[c] = d1[row - c + n] = d2[row + c] = 1;
    board[row][c] = 'Q';
    go(row + 1, n, board, col, d1, d2, ans);
    board[row][c] = '.';
    col[c] = d1[row - c + n] = d2[row + c] = 0;
  }
}`,
            c: `void go(int row, int n, char board[][20], int* col, int* d1, int* d2) {
  int c, k;
  if (row == n) {
    for (k = 0; k < n; k++) { board[k][n] = '\\0'; printf("%s\\n", board[k]); }
    printf("\\n");
    return;
  }
  for (c = 0; c < n; c++) {
    if (col[c] || d1[row - c + n] || d2[row + c]) continue;
    col[c] = d1[row - c + n] = d2[row + c] = 1;
    board[row][c] = 'Q';
    go(row + 1, n, board, col, d1, d2);
    board[row][c] = '.';
    col[c] = d1[row - c + n] = d2[row + c] = 0;
  }
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n!)",
          space: "O(n^2)",
          why: "cols, diag, anti as bitmasks. available bits are the free columns. Take the lowest set bit, recurse with shifted diagonals. Same search, O(1) updates.",
          code: `function solveNQueens(n) {
  const ans = [];
  const board = Array.from({ length: n }, function () { return Array(n).fill("."); });
  function go(row, cols, d1, d2) {
    if (row === n) {
      ans.push(board.map(function (r) { return r.join(""); }));
      return;
    }
    let avail = ((1 << n) - 1) & ~(cols | d1 | d2);
    while (avail) {
      const bit = avail & -avail;
      avail ^= bit;
      let c = 0, x = bit;
      while (x > 1) { x >>= 1; c++; }
      board[row][c] = "Q";
      go(row + 1, cols | bit, (d1 | bit) << 1, (d2 | bit) >> 1);
      board[row][c] = ".";
    }
  }
  go(0, 0, 0, 0);
  return ans;
}`,
          codes: {
            javascript: `function solveNQueens(n) {
  const ans = [];
  const board = Array.from({ length: n }, function () { return Array(n).fill("."); });
  function go(row, cols, d1, d2) {
    if (row === n) {
      ans.push(board.map(function (r) { return r.join(""); }));
      return;
    }
    let avail = ((1 << n) - 1) & ~(cols | d1 | d2);
    while (avail) {
      const bit = avail & -avail;
      avail ^= bit;
      let c = 0, x = bit;
      while (x > 1) { x >>= 1; c++; }
      board[row][c] = "Q";
      go(row + 1, cols | bit, (d1 | bit) << 1, (d2 | bit) >> 1);
      board[row][c] = ".";
    }
  }
  go(0, 0, 0, 0);
  return ans;
}`,
            python: `def solveNQueens(n):
  ans = []
  board = [["."] * n for _ in range(n)]
  def go(row, cols, d1, d2):
    if row == n:
      ans.append(["".join(r) for r in board])
      return
    avail = ((1 << n) - 1) & ~(cols | d1 | d2)
    while avail:
      bit = avail & -avail
      avail ^= bit
      c = (bit.bit_length() - 1)
      board[row][c] = "Q"
      go(row + 1, cols | bit, (d1 | bit) << 1, (d2 | bit) >> 1)
      board[row][c] = "."
  go(0, 0, 0, 0)
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<String>> solveNQueens(int n) {
    List<List<String>> ans = new ArrayList<List<String>>();
    char[][] board = new char[n][n];
    for (int i = 0; i < n; i++) Arrays.fill(board[i], '.');
    go(0, n, 0, 0, 0, board, ans);
    return ans;
  }
  void go(int row, int n, int cols, int d1, int d2, char[][] board, List<List<String>> ans) {
    if (row == n) {
      List<String> cur = new ArrayList<String>();
      for (int i = 0; i < n; i++) cur.add(new String(board[i]));
      ans.add(cur);
      return;
    }
    int avail = ((1 << n) - 1) & ~(cols | d1 | d2);
    while (avail != 0) {
      int bit = avail & -avail;
      avail ^= bit;
      int c = Integer.numberOfTrailingZeros(bit);
      board[row][c] = 'Q';
      go(row + 1, n, cols | bit, (d1 | bit) << 1, (d2 | bit) >> 1, board, ans);
      board[row][c] = '.';
    }
  }
}`,
            cpp: `void go(int row, int n, int cols, int d1, int d2, vector<string>& board, vector<vector<string>>& ans) {
  if (row == n) { ans.push_back(board); return; }
  int avail = ((1 << n) - 1) & ~(cols | d1 | d2);
  while (avail) {
    int bit = avail & -avail;
    avail ^= bit;
    int c = __builtin_ctz(bit);
    board[row][c] = 'Q';
    go(row + 1, n, cols | bit, (d1 | bit) << 1, (d2 | bit) >> 1, board, ans);
    board[row][c] = '.';
  }
}`,
            c: `void go(int row, int n, int cols, int d1, int d2, char board[][20]) {
  int avail, bit, c, x, k;
  if (row == n) {
    for (k = 0; k < n; k++) { board[k][n] = '\\0'; printf("%s\\n", board[k]); }
    printf("\\n");
    return;
  }
  avail = ((1 << n) - 1) & ~(cols | d1 | d2);
  while (avail) {
    bit = avail & -avail;
    avail ^= bit;
    c = 0; x = bit;
    while (x > 1) { x >>= 1; c++; }
    board[row][c] = 'Q';
    go(row + 1, n, cols | bit, (d1 | bit) << 1, (d2 | bit) >> 1, board);
    board[row][c] = '.';
  }
}`
          }
        }
      ]
    },
    {
      id: 9,
      level: "intermediate",
      q: "Word Search",
      ask: "Amazon · Microsoft · Bloomberg · Uber",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/word-search/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/word-search/1"}],
      a: "Given a board of letters and a word, return true if the word is a path of up/down/left/right cells. You may not reuse a cell on the same path.\n\nTiny example: board = [[A,B,C,E],[S,F,C,S],[A,D,E,E]], word = \"ABCCED\". Start at A, walk B, C, C, E, D. True.\n\nThe brute copies a visited matrix on every step. Standard search marks the cell, recurses, unmarks. More optimal returns as soon as one path hits the full word, and can reject early if a letter count is missing.\n\nOpen Brute, Optimal, and More optimal for extra visited copies, mark/unmark, and early stop.",
      solutions: [
        {
          name: "Brute",
          time: "O(r c * 4^L)",
          space: "O(r c * L)",
          why: "Every recursive step clones the whole visited grid. Correct, but memory traffic is huge. L is the word length. 4^L walks from each start.",
          code: `function exist(board, word) {
  const rows = board.length, cols = board[0].length;
  function dfs(r, c, k, seen) {
    if (k === word.length) return true;
    if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
    if (seen[r][c] || board[r][c] !== word[k]) return false;
    const copy = seen.map(function (row) { return row.slice(); });
    copy[r][c] = true;
    return dfs(r + 1, c, k + 1, copy) || dfs(r - 1, c, k + 1, copy) ||
           dfs(r, c + 1, k + 1, copy) || dfs(r, c - 1, k + 1, copy);
  }
  const blank = board.map(function () { return Array(cols).fill(false); });
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0, blank)) return true;
    }
  }
  return false;
}`,
          codes: {
            javascript: `function exist(board, word) {
  const rows = board.length, cols = board[0].length;
  function dfs(r, c, k, seen) {
    if (k === word.length) return true;
    if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
    if (seen[r][c] || board[r][c] !== word[k]) return false;
    const copy = seen.map(function (row) { return row.slice(); });
    copy[r][c] = true;
    return dfs(r + 1, c, k + 1, copy) || dfs(r - 1, c, k + 1, copy) ||
           dfs(r, c + 1, k + 1, copy) || dfs(r, c - 1, k + 1, copy);
  }
  const blank = board.map(function () { return Array(cols).fill(false); });
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0, blank)) return true;
    }
  }
  return false;
}`,
            python: `def exist(board, word):
  rows, cols = len(board), len(board[0])
  def dfs(r, c, k, seen):
    if k == len(word):
      return True
    if r < 0 or c < 0 or r >= rows or c >= cols:
      return False
    if seen[r][c] or board[r][c] != word[k]:
      return False
    copy = [row[:] for row in seen]
    copy[r][c] = True
    return (dfs(r + 1, c, k + 1, copy) or dfs(r - 1, c, k + 1, copy) or
            dfs(r, c + 1, k + 1, copy) or dfs(r, c - 1, k + 1, copy))
  blank = [[False] * cols for _ in range(rows)]
  for r in range(rows):
    for c in range(cols):
      if dfs(r, c, 0, blank):
        return True
  return False`,
            java: `class Solution {
  public boolean exist(char[][] board, String word) {
    int rows = board.length, cols = board[0].length;
    boolean[][] blank = new boolean[rows][cols];
    for (int r = 0; r < rows; r++)
      for (int c = 0; c < cols; c++)
        if (dfs(board, word, r, c, 0, blank)) return true;
    return false;
  }
  boolean dfs(char[][] board, String word, int r, int c, int k, boolean[][] seen) {
    if (k == word.length()) return true;
    int rows = board.length, cols = board[0].length;
    if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
    if (seen[r][c] || board[r][c] != word.charAt(k)) return false;
    boolean[][] copy = new boolean[rows][cols];
    for (int i = 0; i < rows; i++) copy[i] = seen[i].clone();
    copy[r][c] = true;
    return dfs(board, word, r + 1, c, k + 1, copy) || dfs(board, word, r - 1, c, k + 1, copy)
        || dfs(board, word, r, c + 1, k + 1, copy) || dfs(board, word, r, c - 1, k + 1, copy);
  }
}`,
            cpp: `bool dfs(vector<vector<char>>& board, string& word, int r, int c, int k, vector<vector<int>> seen) {
  if (k == (int)word.size()) return true;
  int rows = (int)board.size(), cols = (int)board[0].size();
  if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
  if (seen[r][c] || board[r][c] != word[k]) return false;
  seen[r][c] = 1;
  return dfs(board, word, r + 1, c, k + 1, seen) || dfs(board, word, r - 1, c, k + 1, seen)
      || dfs(board, word, r, c + 1, k + 1, seen) || dfs(board, word, r, c - 1, k + 1, seen);
}`,
            c: `int dfs(char** board, int rows, int cols, const char* word, int r, int c, int k, int** seen) {
  int **copy, i, j, ok;
  if (word[k] == '\\0') return 1;
  if (r < 0 || c < 0 || r >= rows || c >= cols) return 0;
  if (seen[r][c] || board[r][c] != word[k]) return 0;
  copy = (int**)malloc(sizeof(int*) * rows);
  for (i = 0; i < rows; i++) {
    copy[i] = (int*)malloc(sizeof(int) * cols);
    for (j = 0; j < cols; j++) copy[i][j] = seen[i][j];
  }
  copy[r][c] = 1;
  ok = dfs(board, rows, cols, word, r + 1, c, k + 1, copy) || dfs(board, rows, cols, word, r - 1, c, k + 1, copy)
    || dfs(board, rows, cols, word, r, c + 1, k + 1, copy) || dfs(board, rows, cols, word, r, c - 1, k + 1, copy);
  for (i = 0; i < rows; i++) free(copy[i]);
  free(copy);
  return ok;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(r c * 4^L)",
          space: "O(L)",
          why: "Mark the cell as '#' (or a visited flag), recurse four ways, restore the letter. One board, undo after each branch. Stack is O(L).",
          code: `function exist(board, word) {
  const rows = board.length, cols = board[0].length;
  function dfs(r, c, k) {
    if (k === word.length) return true;
    if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
    if (board[r][c] !== word[k]) return false;
    const ch = board[r][c];
    board[r][c] = "#";
    const ok = dfs(r + 1, c, k + 1) || dfs(r - 1, c, k + 1) ||
               dfs(r, c + 1, k + 1) || dfs(r, c - 1, k + 1);
    board[r][c] = ch;
    return ok;
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}`,
          codes: {
            javascript: `function exist(board, word) {
  const rows = board.length, cols = board[0].length;
  function dfs(r, c, k) {
    if (k === word.length) return true;
    if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
    if (board[r][c] !== word[k]) return false;
    const ch = board[r][c];
    board[r][c] = "#";
    const ok = dfs(r + 1, c, k + 1) || dfs(r - 1, c, k + 1) ||
               dfs(r, c + 1, k + 1) || dfs(r, c - 1, k + 1);
    board[r][c] = ch;
    return ok;
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}`,
            python: `def exist(board, word):
  rows, cols = len(board), len(board[0])
  def dfs(r, c, k):
    if k == len(word):
      return True
    if r < 0 or c < 0 or r >= rows or c >= cols:
      return False
    if board[r][c] != word[k]:
      return False
    ch = board[r][c]
    board[r][c] = "#"
    ok = (dfs(r + 1, c, k + 1) or dfs(r - 1, c, k + 1) or
          dfs(r, c + 1, k + 1) or dfs(r, c - 1, k + 1))
    board[r][c] = ch
    return ok
  for r in range(rows):
    for c in range(cols):
      if dfs(r, c, 0):
        return True
  return False`,
            java: `class Solution {
  public boolean exist(char[][] board, String word) {
    int rows = board.length, cols = board[0].length;
    for (int r = 0; r < rows; r++)
      for (int c = 0; c < cols; c++)
        if (dfs(board, word, r, c, 0)) return true;
    return false;
  }
  boolean dfs(char[][] board, String word, int r, int c, int k) {
    if (k == word.length()) return true;
    if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return false;
    if (board[r][c] != word.charAt(k)) return false;
    char ch = board[r][c];
    board[r][c] = '#';
    boolean ok = dfs(board, word, r + 1, c, k + 1) || dfs(board, word, r - 1, c, k + 1)
        || dfs(board, word, r, c + 1, k + 1) || dfs(board, word, r, c - 1, k + 1);
    board[r][c] = ch;
    return ok;
  }
}`,
            cpp: `bool dfs(vector<vector<char>>& board, string& word, int r, int c, int k) {
  if (k == (int)word.size()) return true;
  int rows = (int)board.size(), cols = (int)board[0].size();
  if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
  if (board[r][c] != word[k]) return false;
  char ch = board[r][c];
  board[r][c] = '#';
  bool ok = dfs(board, word, r + 1, c, k + 1) || dfs(board, word, r - 1, c, k + 1)
         || dfs(board, word, r, c + 1, k + 1) || dfs(board, word, r, c - 1, k + 1);
  board[r][c] = ch;
  return ok;
}
bool exist(vector<vector<char>>& board, string word) {
  for (int r = 0; r < (int)board.size(); r++)
    for (int c = 0; c < (int)board[0].size(); c++)
      if (dfs(board, word, r, c, 0)) return true;
  return false;
}`,
            c: `int dfs(char** board, int rows, int cols, const char* word, int r, int c, int k) {
  char ch; int ok;
  if (word[k] == '\\0') return 1;
  if (r < 0 || c < 0 || r >= rows || c >= cols) return 0;
  if (board[r][c] != word[k]) return 0;
  ch = board[r][c];
  board[r][c] = '#';
  ok = dfs(board, rows, cols, word, r + 1, c, k + 1) || dfs(board, rows, cols, word, r - 1, c, k + 1)
    || dfs(board, rows, cols, word, r, c + 1, k + 1) || dfs(board, rows, cols, word, r, c - 1, k + 1);
  board[r][c] = ch;
  return ok;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(r c * 4^L)",
          space: "O(L)",
          why: "Count letters first. If the board cannot supply a letter, return false. Search from the rarer end of the word. Return true on the first hit so you do not walk the rest of the grid.",
          code: `function exist(board, word) {
  const rows = board.length, cols = board[0].length;
  const need = {};
  const have = {};
  for (let i = 0; i < word.length; i++) need[word[i]] = (need[word[i]] || 0) + 1;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) have[board[r][c]] = (have[board[r][c]] || 0) + 1;
  for (const ch in need) if ((have[ch] || 0) < need[ch]) return false;
  if (have[word[0]] > have[word[word.length - 1]]) {
    word = word.split("").reverse().join("");
  }
  function dfs(r, c, k) {
    if (k === word.length) return true;
    if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
    if (board[r][c] !== word[k]) return false;
    const ch = board[r][c];
    board[r][c] = "#";
    const ok = dfs(r + 1, c, k + 1) || dfs(r - 1, c, k + 1) || dfs(r, c + 1, k + 1) || dfs(r, c - 1, k + 1);
    board[r][c] = ch;
    return ok;
  }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (dfs(r, c, 0)) return true;
  return false;
}`,
          codes: {
            javascript: `function exist(board, word) {
  const rows = board.length, cols = board[0].length;
  const need = {};
  const have = {};
  for (let i = 0; i < word.length; i++) need[word[i]] = (need[word[i]] || 0) + 1;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) have[board[r][c]] = (have[board[r][c]] || 0) + 1;
  for (const ch in need) if ((have[ch] || 0) < need[ch]) return false;
  if (have[word[0]] > have[word[word.length - 1]]) {
    word = word.split("").reverse().join("");
  }
  function dfs(r, c, k) {
    if (k === word.length) return true;
    if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
    if (board[r][c] !== word[k]) return false;
    const ch = board[r][c];
    board[r][c] = "#";
    const ok = dfs(r + 1, c, k + 1) || dfs(r - 1, c, k + 1) || dfs(r, c + 1, k + 1) || dfs(r, c - 1, k + 1);
    board[r][c] = ch;
    return ok;
  }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (dfs(r, c, 0)) return true;
  return false;
}`,
            python: `def exist(board, word):
  rows, cols = len(board), len(board[0])
  need = {}
  have = {}
  for ch in word:
    need[ch] = need.get(ch, 0) + 1
  for r in range(rows):
    for c in range(cols):
      have[board[r][c]] = have.get(board[r][c], 0) + 1
  for ch, cnt in need.items():
    if have.get(ch, 0) < cnt:
      return False
  if have.get(word[0], 0) > have.get(word[-1], 0):
    word = word[::-1]
  def dfs(r, c, k):
    if k == len(word):
      return True
    if r < 0 or c < 0 or r >= rows or c >= cols:
      return False
    if board[r][c] != word[k]:
      return False
    ch = board[r][c]
    board[r][c] = "#"
    ok = (dfs(r + 1, c, k + 1) or dfs(r - 1, c, k + 1) or
          dfs(r, c + 1, k + 1) or dfs(r, c - 1, k + 1))
    board[r][c] = ch
    return ok
  for r in range(rows):
    for c in range(cols):
      if dfs(r, c, 0):
        return True
  return False`,
            java: `class Solution {
  public boolean exist(char[][] board, String word) {
    int[] need = new int[128], have = new int[128];
    for (int i = 0; i < word.length(); i++) need[word.charAt(i)]++;
    for (char[] row : board) for (char ch : row) have[ch]++;
    for (int i = 0; i < 128; i++) if (have[i] < need[i]) return false;
    if (have[word.charAt(0)] > have[word.charAt(word.length() - 1)])
      word = new StringBuilder(word).reverse().toString();
    for (int r = 0; r < board.length; r++)
      for (int c = 0; c < board[0].length; c++)
        if (dfs(board, word, r, c, 0)) return true;
    return false;
  }
  boolean dfs(char[][] board, String word, int r, int c, int k) {
    if (k == word.length()) return true;
    if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return false;
    if (board[r][c] != word.charAt(k)) return false;
    char ch = board[r][c];
    board[r][c] = '#';
    boolean ok = dfs(board, word, r + 1, c, k + 1) || dfs(board, word, r - 1, c, k + 1)
        || dfs(board, word, r, c + 1, k + 1) || dfs(board, word, r, c - 1, k + 1);
    board[r][c] = ch;
    return ok;
  }
}`,
            cpp: `bool exist(vector<vector<char>>& board, string word) {
  int need[128] = {0}, have[128] = {0};
  for (char ch : word) need[(int)ch]++;
  for (auto& row : board) for (char ch : row) have[(int)ch]++;
  for (int i = 0; i < 128; i++) if (have[i] < need[i]) return false;
  if (have[(int)word[0]] > have[(int)word.back()]) reverse(word.begin(), word.end());
  function<bool(int,int,int)> dfs = [&](int r, int c, int k) -> bool {
    if (k == (int)word.size()) return true;
    if (r < 0 || c < 0 || r >= (int)board.size() || c >= (int)board[0].size()) return false;
    if (board[r][c] != word[k]) return false;
    char ch = board[r][c];
    board[r][c] = '#';
    bool ok = dfs(r + 1, c, k + 1) || dfs(r - 1, c, k + 1) || dfs(r, c + 1, k + 1) || dfs(r, c - 1, k + 1);
    board[r][c] = ch;
    return ok;
  };
  for (int r = 0; r < (int)board.size(); r++)
    for (int c = 0; c < (int)board[0].size(); c++) if (dfs(r, c, 0)) return true;
  return false;
}`,
            c: `int existMore(char** board, int rows, int cols, char* word) {
  int need[128] = {0}, have[128] = {0}, i, r, c, n;
  n = (int)strlen(word);
  for (i = 0; i < n; i++) need[(int)word[i]]++;
  for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) have[(int)board[r][c]]++;
  for (i = 0; i < 128; i++) if (have[i] < need[i]) return 0;
  for (r = 0; r < rows; r++) for (c = 0; c < cols; c++)
    if (dfs(board, rows, cols, word, r, c, 0)) return 1;
  return 0;
}`
          }
        }
      ]
    },
    {
      id: 10,
      level: "beginner",
      q: "Letter Combinations of a Phone Number",
      ask: "Amazon · Google · Meta · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/letter-combinations-of-a-phone-number/"}],
      a: "Each digit 2-9 maps to letters like a phone keypad. Return every string you can build by picking one letter per digit.\n\nTiny example: digits = \"23\". 2 is abc, 3 is def. Answers: ad, ae, af, bd, be, bf, cd, ce, cf.\n\nThe brute copies a new string on every pick. Standard backtrack pushes a char, recurses to the next digit, pops. Iterative BFS grows a queue of prefixes and avoids recursion.\n\nOpen Brute, Optimal, and More optimal for extra string copies, push/pop, and the queue.",
      solutions: [
        {
          name: "Brute",
          time: "O(4^n * n)",
          space: "O(4^n * n)",
          why: "Each digit branches up to 4 ways. path + letter allocates a new string every time. n is the number of digits. Fine for n <= 4, wasteful copies.",
          code: `function letterCombinations(digits) {
  if (!digits.length) return [];
  const map = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];
  const ans = [];
  function go(i, path) {
    if (i === digits.length) { ans.push(path); return; }
    const letters = map[digits.charCodeAt(i) - 48];
    for (let j = 0; j < letters.length; j++) go(i + 1, path + letters[j]);
  }
  go(0, "");
  return ans;
}`,
          codes: {
            javascript: `function letterCombinations(digits) {
  if (!digits.length) return [];
  const map = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];
  const ans = [];
  function go(i, path) {
    if (i === digits.length) { ans.push(path); return; }
    const letters = map[digits.charCodeAt(i) - 48];
    for (let j = 0; j < letters.length; j++) go(i + 1, path + letters[j]);
  }
  go(0, "");
  return ans;
}`,
            python: `def letterCombinations(digits):
  if not digits:
    return []
  mp = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"]
  ans = []
  def go(i, path):
    if i == len(digits):
      ans.append(path)
      return
    for ch in mp[ord(digits[i]) - 48]:
      go(i + 1, path + ch)
  go(0, "")
  return ans`,
            java: `import java.util.*;
class Solution {
  static final String[] MAP = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
  public List<String> letterCombinations(String digits) {
    List<String> ans = new ArrayList<String>();
    if (digits.length() == 0) return ans;
    go(digits, 0, "", ans);
    return ans;
  }
  void go(String digits, int i, String path, List<String> ans) {
    if (i == digits.length()) { ans.add(path); return; }
    String letters = MAP[digits.charAt(i) - '0'];
    for (int j = 0; j < letters.length(); j++) go(digits, i + 1, path + letters.charAt(j), ans);
  }
}`,
            cpp: `void go(string& digits, int i, string path, vector<string>& ans, string* mp) {
  if (i == (int)digits.size()) { ans.push_back(path); return; }
  string letters = mp[digits[i] - '0'];
  for (char ch : letters) go(digits, i + 1, path + ch, ans, mp);
}`,
            c: `void go(const char* digits, int i, char* path, int len, const char** mp) {
  int j;
  if (digits[i] == '\\0') { path[len] = '\\0'; printf("%s\\n", path); return; }
  const char* letters = mp[digits[i] - '0'];
  for (j = 0; letters[j]; j++) {
    path[len] = letters[j];
    go(digits, i + 1, path, len + 1, mp);
  }
}`
          }
        },
        {
          name: "Optimal",
          time: "O(4^n * n)",
          space: "O(n)",
          why: "One char buffer. Push a letter, recurse, pop. Copy to the answer only at the last digit. Extra space is O(n) besides the output.",
          code: `function letterCombinations(digits) {
  if (!digits.length) return [];
  const map = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];
  const ans = [];
  const path = [];
  function go(i) {
    if (i === digits.length) { ans.push(path.join("")); return; }
    const letters = map[digits.charCodeAt(i) - 48];
    for (let j = 0; j < letters.length; j++) {
      path.push(letters[j]);
      go(i + 1);
      path.pop();
    }
  }
  go(0);
  return ans;
}`,
          codes: {
            javascript: `function letterCombinations(digits) {
  if (!digits.length) return [];
  const map = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];
  const ans = [];
  const path = [];
  function go(i) {
    if (i === digits.length) { ans.push(path.join("")); return; }
    const letters = map[digits.charCodeAt(i) - 48];
    for (let j = 0; j < letters.length; j++) {
      path.push(letters[j]);
      go(i + 1);
      path.pop();
    }
  }
  go(0);
  return ans;
}`,
            python: `def letterCombinations(digits):
  if not digits:
    return []
  mp = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"]
  ans = []
  path = []
  def go(i):
    if i == len(digits):
      ans.append("".join(path))
      return
    for ch in mp[ord(digits[i]) - 48]:
      path.append(ch)
      go(i + 1)
      path.pop()
  go(0)
  return ans`,
            java: `import java.util.*;
class Solution {
  static final String[] MAP = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
  public List<String> letterCombinations(String digits) {
    List<String> ans = new ArrayList<String>();
    if (digits.length() == 0) return ans;
    go(digits, 0, new StringBuilder(), ans);
    return ans;
  }
  void go(String digits, int i, StringBuilder path, List<String> ans) {
    if (i == digits.length()) { ans.add(path.toString()); return; }
    String letters = MAP[digits.charAt(i) - '0'];
    for (int j = 0; j < letters.length(); j++) {
      path.append(letters.charAt(j));
      go(digits, i + 1, path, ans);
      path.deleteCharAt(path.length() - 1);
    }
  }
}`,
            cpp: `void go(string& digits, int i, string& path, vector<string>& ans, string* mp) {
  if (i == (int)digits.size()) { ans.push_back(path); return; }
  for (char ch : mp[digits[i] - '0']) {
    path.push_back(ch);
    go(digits, i + 1, path, ans, mp);
    path.pop_back();
  }
}`,
            c: `void go(const char* digits, int i, char* path, int len, const char** mp) {
  int j;
  if (digits[i] == '\\0') { path[len] = '\\0'; printf("%s\\n", path); return; }
  const char* letters = mp[digits[i] - '0'];
  for (j = 0; letters[j]; j++) {
    path[len] = letters[j];
    go(digits, i + 1, path, len + 1, mp);
  }
}`
          }
        },
        {
          name: "More optimal",
          time: "O(4^n * n)",
          space: "O(4^n * n)",
          why: "Iterative: start with [\"\"]. For each digit, replace every prefix with prefix+letter. No recursion. Empty digits return [] immediately (early stop).",
          code: `function letterCombinations(digits) {
  if (!digits.length) return [];
  const map = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];
  let cur = [""];
  for (let i = 0; i < digits.length; i++) {
    const letters = map[digits.charCodeAt(i) - 48];
    const next = [];
    for (let p = 0; p < cur.length; p++) {
      for (let j = 0; j < letters.length; j++) next.push(cur[p] + letters[j]);
    }
    cur = next;
  }
  return cur;
}`,
          codes: {
            javascript: `function letterCombinations(digits) {
  if (!digits.length) return [];
  const map = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];
  let cur = [""];
  for (let i = 0; i < digits.length; i++) {
    const letters = map[digits.charCodeAt(i) - 48];
    const next = [];
    for (let p = 0; p < cur.length; p++) {
      for (let j = 0; j < letters.length; j++) next.push(cur[p] + letters[j]);
    }
    cur = next;
  }
  return cur;
}`,
            python: `def letterCombinations(digits):
  if not digits:
    return []
  mp = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"]
  cur = [""]
  for d in digits:
    letters = mp[ord(d) - 48]
    nxt = []
    for prefix in cur:
      for ch in letters:
        nxt.append(prefix + ch)
    cur = nxt
  return cur`,
            java: `import java.util.*;
class Solution {
  static final String[] MAP = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
  public List<String> letterCombinations(String digits) {
    List<String> cur = new ArrayList<String>();
    if (digits.length() == 0) return cur;
    cur.add("");
    for (int i = 0; i < digits.length(); i++) {
      String letters = MAP[digits.charAt(i) - '0'];
      List<String> next = new ArrayList<String>();
      for (String prefix : cur)
        for (int j = 0; j < letters.length(); j++) next.add(prefix + letters.charAt(j));
      cur = next;
    }
    return cur;
  }
}`,
            cpp: `vector<string> letterCombinations(string digits) {
  if (digits.empty()) return {};
  string mp[10] = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
  vector<string> cur = {""};
  for (char d : digits) {
    vector<string> next;
    for (auto& prefix : cur) for (char ch : mp[d - '0']) next.push_back(prefix + ch);
    cur.swap(next);
  }
  return cur;
}`,
            c: `/* cur holds prefixes; ncur is count. Early stop if digits empty. */
int letterCombinations(const char* digits, char out[][16]) {
  const char* mp[10] = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
  int ncur = 1, i, p, j, nnext;
  char cur[256][16], next[256][16];
  if (digits[0] == '\\0') return 0;
  cur[0][0] = '\\0';
  for (i = 0; digits[i]; i++) {
    const char* letters = mp[digits[i] - '0'];
    nnext = 0;
    for (p = 0; p < ncur; p++) for (j = 0; letters[j]; j++) {
      sprintf(next[nnext], "%s%c", cur[p], letters[j]);
      nnext++;
    }
    ncur = nnext;
    for (p = 0; p < ncur; p++) strcpy(cur[p], next[p]);
  }
  for (p = 0; p < ncur; p++) strcpy(out[p], cur[p]);
  return ncur;
}`
          }
        }
      ]
    },
    {
      id: 11,
      level: "intermediate",
      q: "Generate Parentheses",
      ask: "Amazon · Google · Microsoft · Meta",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/generate-parentheses/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/generate-all-possible-parentheses/1"}],
      a: "Return every valid string of n pairs of parentheses.\n\nTiny example: n = 2. Answers: (()) and ()(). )( and (() are invalid.\n\nThe brute builds every length-2n string of ( and ) (2^(2n) of them) and filters with a counter. Standard backtrack adds a char with undo. The prune is: add ( only if open < n, add ) only if close < open.\n\nOpen Brute, Optimal, and More optimal for generate-all, backtrack, and the Catalan prune.",
      solutions: [
        {
          name: "Brute",
          time: "O(n * 2^{2n})",
          space: "O(n * 2^{2n})",
          why: "Every bit mask is a string of ( and ). You copy the string, then scan it with a balance counter. Most strings fail. Extra copies of every mask.",
          code: `function generateParenthesis(n) {
  const ans = [];
  const total = 1 << (2 * n);
  for (let mask = 0; mask < total; mask++) {
    let s = "";
    for (let b = 0; b < 2 * n; b++) s += (mask & (1 << b)) ? "(" : ")";
    let bal = 0, ok = 1;
    for (let i = 0; i < s.length; i++) {
      bal += s[i] === "(" ? 1 : -1;
      if (bal < 0) { ok = 0; break; }
    }
    if (ok && bal === 0) ans.push(s);
  }
  return ans;
}`,
          codes: {
            javascript: `function generateParenthesis(n) {
  const ans = [];
  const total = 1 << (2 * n);
  for (let mask = 0; mask < total; mask++) {
    let s = "";
    for (let b = 0; b < 2 * n; b++) s += (mask & (1 << b)) ? "(" : ")";
    let bal = 0, ok = 1;
    for (let i = 0; i < s.length; i++) {
      bal += s[i] === "(" ? 1 : -1;
      if (bal < 0) { ok = 0; break; }
    }
    if (ok && bal === 0) ans.push(s);
  }
  return ans;
}`,
            python: `def generateParenthesis(n):
  ans = []
  total = 1 << (2 * n)
  for mask in range(total):
    s = []
    for b in range(2 * n):
      s.append("(" if mask & (1 << b) else ")")
    s = "".join(s)
    bal, ok = 0, True
    for ch in s:
      bal += 1 if ch == "(" else -1
      if bal < 0:
        ok = False
        break
    if ok and bal == 0:
      ans.append(s)
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<String> generateParenthesis(int n) {
    List<String> ans = new ArrayList<String>();
    int total = 1 << (2 * n);
    for (int mask = 0; mask < total; mask++) {
      StringBuilder sb = new StringBuilder();
      for (int b = 0; b < 2 * n; b++) sb.append((mask & (1 << b)) != 0 ? '(' : ')');
      String s = sb.toString();
      int bal = 0;
      boolean ok = true;
      for (int i = 0; i < s.length(); i++) {
        bal += s.charAt(i) == '(' ? 1 : -1;
        if (bal < 0) { ok = false; break; }
      }
      if (ok && bal == 0) ans.add(s);
    }
    return ans;
  }
}`,
            cpp: `vector<string> generateParenthesis(int n) {
  vector<string> ans;
  int total = 1 << (2 * n);
  for (int mask = 0; mask < total; mask++) {
    string s;
    for (int b = 0; b < 2 * n; b++) s += (mask & (1 << b)) ? '(' : ')';
    int bal = 0; bool ok = true;
    for (char ch : s) {
      bal += ch == '(' ? 1 : -1;
      if (bal < 0) { ok = false; break; }
    }
    if (ok && bal == 0) ans.push_back(s);
  }
  return ans;
}`,
            c: `void generateParenthesis(int n) {
  int total = 1 << (2 * n), mask, b, bal, ok;
  char s[32];
  for (mask = 0; mask < total; mask++) {
    for (b = 0; b < 2 * n; b++) s[b] = (mask & (1 << b)) ? '(' : ')';
    s[2 * n] = '\\0';
    bal = 0; ok = 1;
    for (b = 0; b < 2 * n; b++) {
      bal += s[b] == '(' ? 1 : -1;
      if (bal < 0) { ok = 0; break; }
    }
    if (ok && bal == 0) printf("%s\\n", s);
  }
}`
          }
        },
        {
          name: "Optimal",
          time: "O(4^n / sqrt(n))",
          space: "O(n)",
          why: "Backtrack with a char buffer. Try '(' and ')' at every length. Still visits some invalid prefixes unless you add the count checks (see More optimal).",
          code: `function generateParenthesis(n) {
  const ans = [];
  function valid(s) {
    let bal = 0;
    for (let i = 0; i < s.length; i++) {
      bal += s[i] === "(" ? 1 : -1;
      if (bal < 0) return false;
    }
    return bal === 0;
  }
  function go(path) {
    if (path.length === 2 * n) {
      const s = path.join("");
      if (valid(s)) ans.push(s);
      return;
    }
    path.push("("); go(path); path.pop();
    path.push(")"); go(path); path.pop();
  }
  go([]);
  return ans;
}`,
          codes: {
            javascript: `function generateParenthesis(n) {
  const ans = [];
  function valid(s) {
    let bal = 0;
    for (let i = 0; i < s.length; i++) {
      bal += s[i] === "(" ? 1 : -1;
      if (bal < 0) return false;
    }
    return bal === 0;
  }
  function go(path) {
    if (path.length === 2 * n) {
      const s = path.join("");
      if (valid(s)) ans.push(s);
      return;
    }
    path.push("("); go(path); path.pop();
    path.push(")"); go(path); path.pop();
  }
  go([]);
  return ans;
}`,
            python: `def generateParenthesis(n):
  ans = []
  def valid(s):
    bal = 0
    for ch in s:
      bal += 1 if ch == "(" else -1
      if bal < 0:
        return False
    return bal == 0
  def go(path):
    if len(path) == 2 * n:
      s = "".join(path)
      if valid(s):
        ans.append(s)
      return
    path.append("(")
    go(path)
    path.pop()
    path.append(")")
    go(path)
    path.pop()
  go([])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<String> generateParenthesis(int n) {
    List<String> ans = new ArrayList<String>();
    go(n, new StringBuilder(), ans);
    return ans;
  }
  boolean valid(String s) {
    int bal = 0;
    for (int i = 0; i < s.length(); i++) {
      bal += s.charAt(i) == '(' ? 1 : -1;
      if (bal < 0) return false;
    }
    return bal == 0;
  }
  void go(int n, StringBuilder path, List<String> ans) {
    if (path.length() == 2 * n) {
      String s = path.toString();
      if (valid(s)) ans.add(s);
      return;
    }
    path.append('('); go(n, path, ans); path.deleteCharAt(path.length() - 1);
    path.append(')'); go(n, path, ans); path.deleteCharAt(path.length() - 1);
  }
}`,
            cpp: `bool valid(const string& s) {
  int bal = 0;
  for (char ch : s) { bal += ch == '(' ? 1 : -1; if (bal < 0) return false; }
  return bal == 0;
}
void go(int n, string& path, vector<string>& ans) {
  if ((int)path.size() == 2 * n) { if (valid(path)) ans.push_back(path); return; }
  path.push_back('('); go(n, path, ans); path.pop_back();
  path.push_back(')'); go(n, path, ans); path.pop_back();
}`,
            c: `int valid(const char* s) {
  int bal = 0, i;
  for (i = 0; s[i]; i++) {
    bal += s[i] == '(' ? 1 : -1;
    if (bal < 0) return 0;
  }
  return bal == 0;
}
void go(int n, char* path, int len) {
  if (len == 2 * n) {
    path[len] = '\\0';
    if (valid(path)) printf("%s\\n", path);
    return;
  }
  path[len] = '('; go(n, path, len + 1);
  path[len] = ')'; go(n, path, len + 1);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(4^n / sqrt(n))",
          space: "O(n)",
          why: "Prune: add '(' only while open < n. Add ')' only while close < open. Leaves are exactly the Catalan number C_n. No invalid prefix is ever built.",
          code: `function generateParenthesis(n) {
  const ans = [];
  function go(open, close, path) {
    if (path.length === 2 * n) { ans.push(path.join("")); return; }
    if (open < n) { path.push("("); go(open + 1, close, path); path.pop(); }
    if (close < open) { path.push(")"); go(open, close + 1, path); path.pop(); }
  }
  go(0, 0, []);
  return ans;
}`,
          codes: {
            javascript: `function generateParenthesis(n) {
  const ans = [];
  function go(open, close, path) {
    if (path.length === 2 * n) { ans.push(path.join("")); return; }
    if (open < n) { path.push("("); go(open + 1, close, path); path.pop(); }
    if (close < open) { path.push(")"); go(open, close + 1, path); path.pop(); }
  }
  go(0, 0, []);
  return ans;
}`,
            python: `def generateParenthesis(n):
  ans = []
  def go(open_n, close, path):
    if len(path) == 2 * n:
      ans.append("".join(path))
      return
    if open_n < n:
      path.append("(")
      go(open_n + 1, close, path)
      path.pop()
    if close < open_n:
      path.append(")")
      go(open_n, close + 1, path)
      path.pop()
  go(0, 0, [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<String> generateParenthesis(int n) {
    List<String> ans = new ArrayList<String>();
    go(n, 0, 0, new StringBuilder(), ans);
    return ans;
  }
  void go(int n, int open, int close, StringBuilder path, List<String> ans) {
    if (path.length() == 2 * n) { ans.add(path.toString()); return; }
    if (open < n) {
      path.append('(');
      go(n, open + 1, close, path, ans);
      path.deleteCharAt(path.length() - 1);
    }
    if (close < open) {
      path.append(')');
      go(n, open, close + 1, path, ans);
      path.deleteCharAt(path.length() - 1);
    }
  }
}`,
            cpp: `void go(int n, int open, int close, string& path, vector<string>& ans) {
  if ((int)path.size() == 2 * n) { ans.push_back(path); return; }
  if (open < n) { path.push_back('('); go(n, open + 1, close, path, ans); path.pop_back(); }
  if (close < open) { path.push_back(')'); go(n, open, close + 1, path, ans); path.pop_back(); }
}`,
            c: `void go(int n, int open, int close, char* path, int len) {
  if (len == 2 * n) { path[len] = '\\0'; printf("%s\\n", path); return; }
  if (open < n) { path[len] = '('; go(n, open + 1, close, path, len + 1); }
  if (close < open) { path[len] = ')'; go(n, open, close + 1, path, len + 1); }
}`
          }
        }
      ]
    },
    {
      id: 12,
      level: "intermediate",
      q: "Restore IP Addresses",
      ask: "Amazon · Microsoft · ByteDance",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/restore-ip-addresses/"}],
      a: "Split string s of digits into exactly four IP parts. Each part is an integer 0..255 with no leading zero (unless the part is \"0\").\n\nTiny example: s = \"25525511135\". Two answers: 255.255.11.135 and 255.255.111.35.\n\nThe brute tries every way to place three dots (extra string copies) and validates after. Standard backtrack builds four parts. Prune: remaining length too small or too big, leading zeros, value > 255.\n\nOpen Brute, Optimal, and More optimal for all-dot placements, backtrack, and length prune.",
      solutions: [
        {
          name: "Brute",
          time: "O(n^4)",
          space: "O(n)",
          why: "Three nested cuts copy substring pieces, then a validator checks leading zeros and 0..255. n is at most 12, so this still finishes, but you build illegal IPs first.",
          code: `function restoreIpAddresses(s) {
  const ans = [];
  function ok(part) {
    if (!part.length || part.length > 3) return false;
    if (part.length > 1 && part[0] === "0") return false;
    const v = Number(part);
    return v >= 0 && v <= 255;
  }
  const n = s.length;
  for (let i = 1; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        const a = s.slice(0, i), b = s.slice(i, j), c = s.slice(j, k), d = s.slice(k);
        if (ok(a) && ok(b) && ok(c) && ok(d)) ans.push([a, b, c, d].join("."));
      }
    }
  }
  return ans;
}`,
          codes: {
            javascript: `function restoreIpAddresses(s) {
  const ans = [];
  function ok(part) {
    if (!part.length || part.length > 3) return false;
    if (part.length > 1 && part[0] === "0") return false;
    const v = Number(part);
    return v >= 0 && v <= 255;
  }
  const n = s.length;
  for (let i = 1; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        const a = s.slice(0, i), b = s.slice(i, j), c = s.slice(j, k), d = s.slice(k);
        if (ok(a) && ok(b) && ok(c) && ok(d)) ans.push([a, b, c, d].join("."));
      }
    }
  }
  return ans;
}`,
            python: `def restoreIpAddresses(s):
  ans = []
  def ok(part):
    if not part or len(part) > 3:
      return False
    if len(part) > 1 and part[0] == "0":
      return False
    v = int(part)
    return 0 <= v <= 255
  n = len(s)
  for i in range(1, n):
    for j in range(i + 1, n):
      for k in range(j + 1, n):
        a, b, c, d = s[:i], s[i:j], s[j:k], s[k:]
        if ok(a) and ok(b) and ok(c) and ok(d):
          ans.append(".".join([a, b, c, d]))
  return ans`,
            java: `import java.util.*;
class Solution {
  boolean ok(String part) {
    if (part.length() == 0 || part.length() > 3) return false;
    if (part.length() > 1 && part.charAt(0) == '0') return false;
    int v = Integer.parseInt(part);
    return v >= 0 && v <= 255;
  }
  public List<String> restoreIpAddresses(String s) {
    List<String> ans = new ArrayList<String>();
    int n = s.length();
    for (int i = 1; i < n; i++)
      for (int j = i + 1; j < n; j++)
        for (int k = j + 1; k < n; k++) {
          String a = s.substring(0, i), b = s.substring(i, j), c = s.substring(j, k), d = s.substring(k);
          if (ok(a) && ok(b) && ok(c) && ok(d)) ans.add(a + "." + b + "." + c + "." + d);
        }
    return ans;
  }
}`,
            cpp: `bool ok(const string& part) {
  if (part.empty() || part.size() > 3) return false;
  if (part.size() > 1 && part[0] == '0') return false;
  int v = stoi(part);
  return v >= 0 && v <= 255;
}
vector<string> restoreIpAddresses(string s) {
  vector<string> ans;
  int n = (int)s.size();
  for (int i = 1; i < n; i++)
    for (int j = i + 1; j < n; j++)
      for (int k = j + 1; k < n; k++) {
        string a = s.substr(0, i), b = s.substr(i, j - i), c = s.substr(j, k - j), d = s.substr(k);
        if (ok(a) && ok(b) && ok(c) && ok(d)) ans.push_back(a + "." + b + "." + c + "." + d);
      }
  return ans;
}`,
            c: `int ok(const char* s, int l, int r) {
  int len = r - l + 1, v = 0, i;
  if (len <= 0 || len > 3) return 0;
  if (len > 1 && s[l] == '0') return 0;
  for (i = l; i <= r; i++) v = v * 10 + (s[i] - '0');
  return v >= 0 && v <= 255;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(1)",
          space: "O(1)",
          why: "s length is at most 12, so the search is constant. Backtrack parts 0..3. From i, try length 1, 2, 3. Push the piece, recurse, pop. Copy the joined string at 4 parts.",
          code: `function restoreIpAddresses(s) {
  const ans = [];
  function ok(part) {
    if (!part.length || part.length > 3) return false;
    if (part.length > 1 && part[0] === "0") return false;
    return Number(part) <= 255;
  }
  function go(i, parts) {
    if (parts.length === 4) {
      if (i === s.length) ans.push(parts.join("."));
      return;
    }
    for (let len = 1; len <= 3 && i + len <= s.length; len++) {
      const piece = s.slice(i, i + len);
      if (!ok(piece)) continue;
      parts.push(piece);
      go(i + len, parts);
      parts.pop();
    }
  }
  go(0, []);
  return ans;
}`,
          codes: {
            javascript: `function restoreIpAddresses(s) {
  const ans = [];
  function ok(part) {
    if (!part.length || part.length > 3) return false;
    if (part.length > 1 && part[0] === "0") return false;
    return Number(part) <= 255;
  }
  function go(i, parts) {
    if (parts.length === 4) {
      if (i === s.length) ans.push(parts.join("."));
      return;
    }
    for (let len = 1; len <= 3 && i + len <= s.length; len++) {
      const piece = s.slice(i, i + len);
      if (!ok(piece)) continue;
      parts.push(piece);
      go(i + len, parts);
      parts.pop();
    }
  }
  go(0, []);
  return ans;
}`,
            python: `def restoreIpAddresses(s):
  ans = []
  def ok(part):
    if not part or len(part) > 3:
      return False
    if len(part) > 1 and part[0] == "0":
      return False
    return int(part) <= 255
  def go(i, parts):
    if len(parts) == 4:
      if i == len(s):
        ans.append(".".join(parts))
      return
    for length in range(1, 4):
      if i + length > len(s):
        break
      piece = s[i:i + length]
      if not ok(piece):
        continue
      parts.append(piece)
      go(i + length, parts)
      parts.pop()
  go(0, [])
  return ans`,
            java: `import java.util.*;
class Solution {
  boolean ok(String part) {
    if (part.length() == 0 || part.length() > 3) return false;
    if (part.length() > 1 && part.charAt(0) == '0') return false;
    return Integer.parseInt(part) <= 255;
  }
  public List<String> restoreIpAddresses(String s) {
    List<String> ans = new ArrayList<String>();
    go(s, 0, new ArrayList<String>(), ans);
    return ans;
  }
  void go(String s, int i, List<String> parts, List<String> ans) {
    if (parts.size() == 4) {
      if (i == s.length()) ans.add(String.join(".", parts));
      return;
    }
    for (int len = 1; len <= 3 && i + len <= s.length(); len++) {
      String piece = s.substring(i, i + len);
      if (!ok(piece)) continue;
      parts.add(piece);
      go(s, i + len, parts, ans);
      parts.remove(parts.size() - 1);
    }
  }
}`,
            cpp: `bool ok(const string& part) {
  if (part.empty() || part.size() > 3) return false;
  if (part.size() > 1 && part[0] == '0') return false;
  return stoi(part) <= 255;
}
void go(string& s, int i, vector<string>& parts, vector<string>& ans) {
  if ((int)parts.size() == 4) {
    if (i == (int)s.size()) ans.push_back(parts[0] + "." + parts[1] + "." + parts[2] + "." + parts[3]);
    return;
  }
  for (int len = 1; len <= 3 && i + len <= (int)s.size(); len++) {
    string piece = s.substr(i, len);
    if (!ok(piece)) continue;
    parts.push_back(piece);
    go(s, i + len, parts, ans);
    parts.pop_back();
  }
}`,
            c: `int ok(const char* s, int l, int r) {
  int len = r - l + 1, v = 0, i;
  if (len <= 0 || len > 3) return 0;
  if (len > 1 && s[l] == '0') return 0;
  for (i = l; i <= r; i++) v = v * 10 + (s[i] - '0');
  return v <= 255;
}
void go(const char* s, int n, int i, int* cuts, int nparts) {
  int len;
  if (nparts == 4) { if (i == n) printf("ip\\n"); return; }
  for (len = 1; len <= 3 && i + len <= n; len++) {
    if (!ok(s, i, i + len - 1)) continue;
    cuts[nparts] = i + len;
    go(s, n, i + len, cuts, nparts + 1);
  }
}`
          }
        },
        {
          name: "More optimal",
          time: "O(1)",
          space: "O(1)",
          why: "Before trying a length, prune: leftover chars must sit in [4-parts, 3*(4-parts)]. Drop leading-zero parts immediately. Cuts the tiny tree even further.",
          code: `function restoreIpAddresses(s) {
  const ans = [];
  function go(i, parts) {
    const leftParts = 4 - parts.length;
    const leftChars = s.length - i;
    if (leftChars < leftParts || leftChars > 3 * leftParts) return;
    if (parts.length === 4) { ans.push(parts.join(".")); return; }
    for (let len = 1; len <= 3 && i + len <= s.length; len++) {
      if (len > 1 && s[i] === "0") break;
      const piece = s.slice(i, i + len);
      if (Number(piece) > 255) continue;
      parts.push(piece);
      go(i + len, parts);
      parts.pop();
    }
  }
  go(0, []);
  return ans;
}`,
          codes: {
            javascript: `function restoreIpAddresses(s) {
  const ans = [];
  function go(i, parts) {
    const leftParts = 4 - parts.length;
    const leftChars = s.length - i;
    if (leftChars < leftParts || leftChars > 3 * leftParts) return;
    if (parts.length === 4) { ans.push(parts.join(".")); return; }
    for (let len = 1; len <= 3 && i + len <= s.length; len++) {
      if (len > 1 && s[i] === "0") break;
      const piece = s.slice(i, i + len);
      if (Number(piece) > 255) continue;
      parts.push(piece);
      go(i + len, parts);
      parts.pop();
    }
  }
  go(0, []);
  return ans;
}`,
            python: `def restoreIpAddresses(s):
  ans = []
  def go(i, parts):
    left_parts = 4 - len(parts)
    left_chars = len(s) - i
    if left_chars < left_parts or left_chars > 3 * left_parts:
      return
    if len(parts) == 4:
      ans.append(".".join(parts))
      return
    for length in range(1, 4):
      if i + length > len(s):
        break
      if length > 1 and s[i] == "0":
        break
      piece = s[i:i + length]
      if int(piece) > 255:
        continue
      parts.append(piece)
      go(i + length, parts)
      parts.pop()
  go(0, [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<String> restoreIpAddresses(String s) {
    List<String> ans = new ArrayList<String>();
    go(s, 0, new ArrayList<String>(), ans);
    return ans;
  }
  void go(String s, int i, List<String> parts, List<String> ans) {
    int leftParts = 4 - parts.size();
    int leftChars = s.length() - i;
    if (leftChars < leftParts || leftChars > 3 * leftParts) return;
    if (parts.size() == 4) { ans.add(String.join(".", parts)); return; }
    for (int len = 1; len <= 3 && i + len <= s.length(); len++) {
      if (len > 1 && s.charAt(i) == '0') break;
      String piece = s.substring(i, i + len);
      if (Integer.parseInt(piece) > 255) continue;
      parts.add(piece);
      go(s, i + len, parts, ans);
      parts.remove(parts.size() - 1);
    }
  }
}`,
            cpp: `void go(string& s, int i, vector<string>& parts, vector<string>& ans) {
  int leftParts = 4 - (int)parts.size();
  int leftChars = (int)s.size() - i;
  if (leftChars < leftParts || leftChars > 3 * leftParts) return;
  if ((int)parts.size() == 4) {
    ans.push_back(parts[0] + "." + parts[1] + "." + parts[2] + "." + parts[3]);
    return;
  }
  for (int len = 1; len <= 3 && i + len <= (int)s.size(); len++) {
    if (len > 1 && s[i] == '0') break;
    string piece = s.substr(i, len);
    if (stoi(piece) > 255) continue;
    parts.push_back(piece);
    go(s, i + len, parts, ans);
    parts.pop_back();
  }
}`,
            c: `void go(const char* s, int n, int i, int nparts, char* path, int plen) {
  int leftParts = 4 - nparts, leftChars = n - i, len, v, t;
  if (leftChars < leftParts || leftChars > 3 * leftParts) return;
  if (nparts == 4) { path[plen] = '\\0'; printf("%s\\n", path); return; }
  for (len = 1; len <= 3 && i + len <= n; len++) {
    if (len > 1 && s[i] == '0') break;
    v = 0;
    for (t = 0; t < len; t++) v = v * 10 + (s[i + t] - '0');
    if (v > 255) continue;
    if (nparts) path[plen++] = '.';
    for (t = 0; t < len; t++) path[plen++] = s[i + t];
    go(s, n, i + len, nparts + 1, path, plen);
    plen -= len + (nparts ? 1 : 0);
  }
}`
          }
        }
      ]
    },
    {
      id: 13,
      level: "advanced",
      q: "Sudoku Solver",
      ask: "Amazon · Google · Uber · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/sudoku-solver/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/solve-the-sudoku-1587115621/1"}],
      a: "Fill a 9x9 Sudoku board. Empty cells are '.'. A digit 1-9 may appear once in each row, column, and 3x3 box. Mutate the board in place. There is exactly one solution.\n\nTiny picture: one empty cell in a valid board has only one legal digit. A harder board needs search.\n\nThe brute copies the whole board on every guess. Standard backtrack writes a digit, recurses, erases it, and scans the row/col/box each time. Bitmasks plus picking the emptiest cell (MRV) fail illegal digits sooner.\n\nOpen Brute, Optimal, and More optimal for board copies, in-place scan, and bitmasks with MRV.",
      solutions: [
        {
          name: "Brute",
          time: "O(9^{e})",
          space: "O(e)",
          why: "e empty cells. Each guess clones the board and scans from scratch. Extra copies on every node. Correct but memory-heavy.",
          code: `function solveSudoku(board) {
  function valid(b, r, c, ch) {
    for (let i = 0; i < 9; i++) {
      if (b[r][i] === ch || b[i][c] === ch) return false;
      const br = Math.floor(r / 3) * 3 + Math.floor(i / 3);
      const bc = Math.floor(c / 3) * 3 + (i % 3);
      if (b[br][bc] === ch) return false;
    }
    return true;
  }
  function go(b) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (b[r][c] !== ".") continue;
        for (let d = 1; d <= 9; d++) {
          const ch = String(d);
          if (!valid(b, r, c, ch)) continue;
          const copy = b.map(function (row) { return row.slice(); });
          copy[r][c] = ch;
          if (go(copy)) {
            for (let i = 0; i < 9; i++) b[i] = copy[i];
            return true;
          }
        }
        return false;
      }
    }
    return true;
  }
  go(board);
}`,
          codes: {
            javascript: `function solveSudoku(board) {
  function valid(b, r, c, ch) {
    for (let i = 0; i < 9; i++) {
      if (b[r][i] === ch || b[i][c] === ch) return false;
      const br = Math.floor(r / 3) * 3 + Math.floor(i / 3);
      const bc = Math.floor(c / 3) * 3 + (i % 3);
      if (b[br][bc] === ch) return false;
    }
    return true;
  }
  function go(b) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (b[r][c] !== ".") continue;
        for (let d = 1; d <= 9; d++) {
          const ch = String(d);
          if (!valid(b, r, c, ch)) continue;
          const copy = b.map(function (row) { return row.slice(); });
          copy[r][c] = ch;
          if (go(copy)) {
            for (let i = 0; i < 9; i++) b[i] = copy[i];
            return true;
          }
        }
        return false;
      }
    }
    return true;
  }
  go(board);
}`,
            python: `def solveSudoku(board):
  def valid(b, r, c, ch):
    for i in range(9):
      if b[r][i] == ch or b[i][c] == ch:
        return False
      br = (r // 3) * 3 + i // 3
      bc = (c // 3) * 3 + i % 3
      if b[br][bc] == ch:
        return False
    return True
  def go(b):
    for r in range(9):
      for c in range(9):
        if b[r][c] != ".":
          continue
        for d in range(1, 10):
          ch = str(d)
          if not valid(b, r, c, ch):
            continue
          copy = [row[:] for row in b]
          copy[r][c] = ch
          if go(copy):
            for i in range(9):
              b[i] = copy[i]
            return True
        return False
    return True
  go(board)`,
            java: `class Solution {
  public void solveSudoku(char[][] board) { go(board); }
  boolean valid(char[][] b, int r, int c, char ch) {
    for (int i = 0; i < 9; i++) {
      if (b[r][i] == ch || b[i][c] == ch) return false;
      int br = (r / 3) * 3 + i / 3, bc = (c / 3) * 3 + i % 3;
      if (b[br][bc] == ch) return false;
    }
    return true;
  }
  boolean go(char[][] b) {
    for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) {
      if (b[r][c] != '.') continue;
      for (char ch = '1'; ch <= '9'; ch++) {
        if (!valid(b, r, c, ch)) continue;
        char[][] copy = new char[9][9];
        for (int i = 0; i < 9; i++) copy[i] = b[i].clone();
        copy[r][c] = ch;
        if (go(copy)) {
          for (int i = 0; i < 9; i++) b[i] = copy[i];
          return true;
        }
      }
      return false;
    }
    return true;
  }
}`,
            cpp: `bool valid(vector<vector<char>>& b, int r, int c, char ch) {
  for (int i = 0; i < 9; i++) {
    if (b[r][i] == ch || b[i][c] == ch) return false;
    if (b[(r / 3) * 3 + i / 3][(c / 3) * 3 + i % 3] == ch) return false;
  }
  return true;
}
bool go(vector<vector<char>> b, vector<vector<char>>& out) {
  for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) {
    if (b[r][c] != '.') continue;
    for (char ch = '1'; ch <= '9'; ch++) {
      if (!valid(b, r, c, ch)) continue;
      auto copy = b; copy[r][c] = ch;
      if (go(copy, out)) return true;
    }
    return false;
  }
  out = b; return true;
}`,
            c: `int valid(char b[9][9], int r, int c, char ch) {
  int i;
  for (i = 0; i < 9; i++) {
    if (b[r][i] == ch || b[i][c] == ch) return 0;
    if (b[(r / 3) * 3 + i / 3][(c / 3) * 3 + i % 3] == ch) return 0;
  }
  return 1;
}
void copyBoard(char dst[9][9], char src[9][9]) {
  int i, j;
  for (i = 0; i < 9; i++) for (j = 0; j < 9; j++) dst[i][j] = src[i][j];
}`
          }
        },
        {
          name: "Optimal",
          time: "O(9^{e})",
          space: "O(e)",
          why: "Write a digit in place, recurse, write '.'. isValid scans the row, column, and box. No extra boards. First empty cell, left to right.",
          code: `function solveSudoku(board) {
  function valid(r, c, ch) {
    for (let i = 0; i < 9; i++) {
      if (board[r][i] === ch || board[i][c] === ch) return false;
      const br = Math.floor(r / 3) * 3 + Math.floor(i / 3);
      const bc = Math.floor(c / 3) * 3 + (i % 3);
      if (board[br][bc] === ch) return false;
    }
    return true;
  }
  function go() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== ".") continue;
        for (let d = 1; d <= 9; d++) {
          const ch = String(d);
          if (!valid(r, c, ch)) continue;
          board[r][c] = ch;
          if (go()) return true;
          board[r][c] = ".";
        }
        return false;
      }
    }
    return true;
  }
  go();
}`,
          codes: {
            javascript: `function solveSudoku(board) {
  function valid(r, c, ch) {
    for (let i = 0; i < 9; i++) {
      if (board[r][i] === ch || board[i][c] === ch) return false;
      const br = Math.floor(r / 3) * 3 + Math.floor(i / 3);
      const bc = Math.floor(c / 3) * 3 + (i % 3);
      if (board[br][bc] === ch) return false;
    }
    return true;
  }
  function go() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== ".") continue;
        for (let d = 1; d <= 9; d++) {
          const ch = String(d);
          if (!valid(r, c, ch)) continue;
          board[r][c] = ch;
          if (go()) return true;
          board[r][c] = ".";
        }
        return false;
      }
    }
    return true;
  }
  go();
}`,
            python: `def solveSudoku(board):
  def valid(r, c, ch):
    for i in range(9):
      if board[r][i] == ch or board[i][c] == ch:
        return False
      if board[(r // 3) * 3 + i // 3][(c // 3) * 3 + i % 3] == ch:
        return False
    return True
  def go():
    for r in range(9):
      for c in range(9):
        if board[r][c] != ".":
          continue
        for d in range(1, 10):
          ch = str(d)
          if not valid(r, c, ch):
            continue
          board[r][c] = ch
          if go():
            return True
          board[r][c] = "."
        return False
    return True
  go()`,
            java: `class Solution {
  public void solveSudoku(char[][] board) { go(board); }
  boolean valid(char[][] board, int r, int c, char ch) {
    for (int i = 0; i < 9; i++) {
      if (board[r][i] == ch || board[i][c] == ch) return false;
      if (board[(r / 3) * 3 + i / 3][(c / 3) * 3 + i % 3] == ch) return false;
    }
    return true;
  }
  boolean go(char[][] board) {
    for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) {
      if (board[r][c] != '.') continue;
      for (char ch = '1'; ch <= '9'; ch++) {
        if (!valid(board, r, c, ch)) continue;
        board[r][c] = ch;
        if (go(board)) return true;
        board[r][c] = '.';
      }
      return false;
    }
    return true;
  }
}`,
            cpp: `bool valid(vector<vector<char>>& board, int r, int c, char ch) {
  for (int i = 0; i < 9; i++) {
    if (board[r][i] == ch || board[i][c] == ch) return false;
    if (board[(r / 3) * 3 + i / 3][(c / 3) * 3 + i % 3] == ch) return false;
  }
  return true;
}
bool go(vector<vector<char>>& board) {
  for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) {
    if (board[r][c] != '.') continue;
    for (char ch = '1'; ch <= '9'; ch++) {
      if (!valid(board, r, c, ch)) continue;
      board[r][c] = ch;
      if (go(board)) return true;
      board[r][c] = '.';
    }
    return false;
  }
  return true;
}`,
            c: `int valid(char board[9][9], int r, int c, char ch) {
  int i;
  for (i = 0; i < 9; i++) {
    if (board[r][i] == ch || board[i][c] == ch) return 0;
    if (board[(r / 3) * 3 + i / 3][(c / 3) * 3 + i % 3] == ch) return 0;
  }
  return 1;
}
int go(char board[9][9]) {
  int r, c; char ch;
  for (r = 0; r < 9; r++) for (c = 0; c < 9; c++) {
    if (board[r][c] != '.') continue;
    for (ch = '1'; ch <= '9'; ch++) {
      if (!valid(board, r, c, ch)) continue;
      board[r][c] = ch;
      if (go(board)) return 1;
      board[r][c] = '.';
    }
    return 0;
  }
  return 1;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(9^{e})",
          space: "O(e)",
          why: "row[], col[], box[] bitmasks. Pick the empty cell with the fewest remaining digits (MRV) so dead ends die sooner. Toggle bits instead of scanning 9 cells.",
          code: `function solveSudoku(board) {
  const row = Array(9).fill(0), col = Array(9).fill(0), box = Array(9).fill(0);
  const empty = [];
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    if (board[r][c] === ".") empty.push([r, c]);
    else {
      const bit = 1 << (board[r][c].charCodeAt(0) - 49);
      row[r] |= bit; col[c] |= bit; box[Math.floor(r / 3) * 3 + Math.floor(c / 3)] |= bit;
    }
  }
  function popcount(x) { let n = 0; while (x) { x &= x - 1; n++; } return n; }
  function go(k) {
    if (k === empty.length) return true;
    let best = k, bestN = 10;
    for (let i = k; i < empty.length; i++) {
      const r = empty[i][0], c = empty[i][1];
      const used = row[r] | col[c] | box[Math.floor(r / 3) * 3 + Math.floor(c / 3)];
      const n = 9 - popcount(used);
      if (n < bestN) { bestN = n; best = i; }
    }
    const tmp = empty[k]; empty[k] = empty[best]; empty[best] = tmp;
    const r = empty[k][0], c = empty[k][1], b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    let avail = ((1 << 9) - 1) ^ (row[r] | col[c] | box[b]);
    while (avail) {
      const bit = avail & -avail;
      avail ^= bit;
      let d = 1, x = bit;
      while (x > 1) { x >>= 1; d++; }
      board[r][c] = String(d);
      row[r] |= bit; col[c] |= bit; box[b] |= bit;
      if (go(k + 1)) return true;
      row[r] ^= bit; col[c] ^= bit; box[b] ^= bit;
      board[r][c] = ".";
    }
    return false;
  }
  go(0);
}`,
          codes: {
            javascript: `function solveSudoku(board) {
  const row = Array(9).fill(0), col = Array(9).fill(0), box = Array(9).fill(0);
  const empty = [];
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    if (board[r][c] === ".") empty.push([r, c]);
    else {
      const bit = 1 << (board[r][c].charCodeAt(0) - 49);
      row[r] |= bit; col[c] |= bit; box[Math.floor(r / 3) * 3 + Math.floor(c / 3)] |= bit;
    }
  }
  function popcount(x) { let n = 0; while (x) { x &= x - 1; n++; } return n; }
  function go(k) {
    if (k === empty.length) return true;
    let best = k, bestN = 10;
    for (let i = k; i < empty.length; i++) {
      const r = empty[i][0], c = empty[i][1];
      const used = row[r] | col[c] | box[Math.floor(r / 3) * 3 + Math.floor(c / 3)];
      const n = 9 - popcount(used);
      if (n < bestN) { bestN = n; best = i; }
    }
    const tmp = empty[k]; empty[k] = empty[best]; empty[best] = tmp;
    const r = empty[k][0], c = empty[k][1], b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    let avail = ((1 << 9) - 1) ^ (row[r] | col[c] | box[b]);
    while (avail) {
      const bit = avail & -avail;
      avail ^= bit;
      let d = 1, x = bit;
      while (x > 1) { x >>= 1; d++; }
      board[r][c] = String(d);
      row[r] |= bit; col[c] |= bit; box[b] |= bit;
      if (go(k + 1)) return true;
      row[r] ^= bit; col[c] ^= bit; box[b] ^= bit;
      board[r][c] = ".";
    }
    return false;
  }
  go(0);
}`,
            python: `def solveSudoku(board):
  row = [0] * 9
  col = [0] * 9
  box = [0] * 9
  empty = []
  for r in range(9):
    for c in range(9):
      if board[r][c] == ".":
        empty.append([r, c])
      else:
        bit = 1 << (ord(board[r][c]) - 49)
        row[r] |= bit
        col[c] |= bit
        box[(r // 3) * 3 + c // 3] |= bit
  def go(k):
    if k == len(empty):
      return True
    best, best_n = k, 10
    for i in range(k, len(empty)):
      r, c = empty[i]
      used = row[r] | col[c] | box[(r // 3) * 3 + c // 3]
      n = 9 - bin(used).count("1")
      if n < best_n:
        best_n, best = n, i
    empty[k], empty[best] = empty[best], empty[k]
    r, c = empty[k]
    b = (r // 3) * 3 + c // 3
    avail = ((1 << 9) - 1) ^ (row[r] | col[c] | box[b])
    while avail:
      bit = avail & -avail
      avail ^= bit
      d = bit.bit_length()
      board[r][c] = str(d)
      row[r] |= bit; col[c] |= bit; box[b] |= bit
      if go(k + 1):
        return True
      row[r] ^= bit; col[c] ^= bit; box[b] ^= bit
      board[r][c] = "."
    return False
  go(0)`,
            java: `class Solution {
  public void solveSudoku(char[][] board) {
    int[] row = new int[9], col = new int[9], box = new int[9];
    java.util.List<int[]> empty = new java.util.ArrayList<int[]>();
    for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) {
      if (board[r][c] == '.') empty.add(new int[]{r, c});
      else {
        int bit = 1 << (board[r][c] - '1');
        row[r] |= bit; col[c] |= bit; box[(r / 3) * 3 + c / 3] |= bit;
      }
    }
    go(board, 0, empty, row, col, box);
  }
  boolean go(char[][] board, int k, java.util.List<int[]> empty, int[] row, int[] col, int[] box) {
    if (k == empty.size()) return true;
    int best = k, bestN = 10;
    for (int i = k; i < empty.size(); i++) {
      int r = empty.get(i)[0], c = empty.get(i)[1];
      int used = row[r] | col[c] | box[(r / 3) * 3 + c / 3];
      int n = 9 - Integer.bitCount(used);
      if (n < bestN) { bestN = n; best = i; }
    }
    java.util.Collections.swap(empty, k, best);
    int r = empty.get(k)[0], c = empty.get(k)[1], b = (r / 3) * 3 + c / 3;
    int avail = ((1 << 9) - 1) ^ (row[r] | col[c] | box[b]);
    while (avail != 0) {
      int bit = avail & -avail;
      avail ^= bit;
      int d = Integer.numberOfTrailingZeros(bit) + 1;
      board[r][c] = (char) ('0' + d);
      row[r] |= bit; col[c] |= bit; box[b] |= bit;
      if (go(board, k + 1, empty, row, col, box)) return true;
      row[r] ^= bit; col[c] ^= bit; box[b] ^= bit;
      board[r][c] = '.';
    }
    return false;
  }
}`,
            cpp: `bool go(vector<vector<char>>& board, int k, vector<pair<int,int>>& empty, vector<int>& row, vector<int>& col, vector<int>& box) {
  if (k == (int)empty.size()) return true;
  int best = k, bestN = 10;
  for (int i = k; i < (int)empty.size(); i++) {
    int r = empty[i].first, c = empty[i].second;
    int used = row[r] | col[c] | box[(r / 3) * 3 + c / 3];
    int n = 9 - __builtin_popcount(used);
    if (n < bestN) { bestN = n; best = i; }
  }
  swap(empty[k], empty[best]);
  int r = empty[k].first, c = empty[k].second, b = (r / 3) * 3 + c / 3;
  int avail = ((1 << 9) - 1) ^ (row[r] | col[c] | box[b]);
  while (avail) {
    int bit = avail & -avail; avail ^= bit;
    int d = __builtin_ctz(bit) + 1;
    board[r][c] = char('0' + d);
    row[r] |= bit; col[c] |= bit; box[b] |= bit;
    if (go(board, k + 1, empty, row, col, box)) return true;
    row[r] ^= bit; col[c] ^= bit; box[b] ^= bit;
    board[r][c] = '.';
  }
  return false;
}`,
            c: `int popcount(int x) { int n = 0; while (x) { x &= x - 1; n++; } return n; }
int goBits(char board[9][9], int k, int empty[][2], int nempty, int* row, int* col, int* box) {
  int best, bestN, i, r, c, b, avail, bit, d, x, t;
  if (k == nempty) return 1;
  best = k; bestN = 10;
  for (i = k; i < nempty; i++) {
    r = empty[i][0]; c = empty[i][1];
    t = 9 - popcount(row[r] | col[c] | box[(r / 3) * 3 + c / 3]);
    if (t < bestN) { bestN = t; best = i; }
  }
  r = empty[k][0]; c = empty[k][1]; empty[k][0] = empty[best][0]; empty[k][1] = empty[best][1]; empty[best][0] = r; empty[best][1] = c;
  r = empty[k][0]; c = empty[k][1]; b = (r / 3) * 3 + c / 3;
  avail = ((1 << 9) - 1) ^ (row[r] | col[c] | box[b]);
  while (avail) {
    bit = avail & -avail; avail ^= bit;
    d = 1; x = bit; while (x > 1) { x >>= 1; d++; }
    board[r][c] = (char)('0' + d);
    row[r] |= bit; col[c] |= bit; box[b] |= bit;
    if (goBits(board, k + 1, empty, nempty, row, col, box)) return 1;
    row[r] ^= bit; col[c] ^= bit; box[b] ^= bit;
    board[r][c] = '.';
  }
  return 0;
}`
          }
        }
      ]
    },
    {
      id: 14,
      level: "intermediate",
      q: "Combination Sum III",
      ask: "Amazon · Google",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/combination-sum-iii/"}],
      a: "Pick k distinct integers from 1..9 that sum to n. Return every such combination. Order does not matter.\n\nTiny example: k = 3, n = 7. The only answer is [1, 2, 4]. [1, 3, 3] is illegal because 3 repeats and 3 is used twice.\n\nThe brute lists every k-subset of 1..9 (extra copies) and keeps those whose sum is n. Standard backtrack walks start..9 with one path. Prune when remain is too small, too big, or not enough numbers are left.\n\nOpen Brute, Optimal, and More optimal for all k-subsets, backtrack, and prune.",
      solutions: [
        {
          name: "Brute",
          time: "O(C(9, k) * k)",
          space: "O(k)",
          why: "Generate every k-subset with path copies, then filter by sum. C(9,k) is tiny, but you still build losers and copy arrays on every call.",
          code: `function combinationSum3(k, n) {
  const ans = [];
  function go(start, path) {
    if (path.length === k) {
      let sum = 0;
      for (let i = 0; i < path.length; i++) sum += path[i];
      if (sum === n) ans.push(path);
      return;
    }
    for (let x = start; x <= 9; x++) go(x + 1, path.concat([x]));
  }
  go(1, []);
  return ans;
}`,
          codes: {
            javascript: `function combinationSum3(k, n) {
  const ans = [];
  function go(start, path) {
    if (path.length === k) {
      let sum = 0;
      for (let i = 0; i < path.length; i++) sum += path[i];
      if (sum === n) ans.push(path);
      return;
    }
    for (let x = start; x <= 9; x++) go(x + 1, path.concat([x]));
  }
  go(1, []);
  return ans;
}`,
            python: `def combinationSum3(k, n):
  ans = []
  def go(start, path):
    if len(path) == k:
      if sum(path) == n:
        ans.append(path)
      return
    for x in range(start, 10):
      go(x + 1, path + [x])
  go(1, [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> combinationSum3(int k, int n) {
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(1, k, n, new ArrayList<Integer>(), ans);
    return ans;
  }
  void go(int start, int k, int n, List<Integer> path, List<List<Integer>> ans) {
    if (path.size() == k) {
      int sum = 0;
      for (int x : path) sum += x;
      if (sum == n) ans.add(new ArrayList<Integer>(path));
      return;
    }
    for (int x = start; x <= 9; x++) {
      List<Integer> next = new ArrayList<Integer>(path);
      next.add(x);
      go(x + 1, k, n, next, ans);
    }
  }
}`,
            cpp: `void go(int start, int k, int n, vector<int> path, vector<vector<int>>& ans) {
  if ((int)path.size() == k) {
    int sum = 0; for (int x : path) sum += x;
    if (sum == n) ans.push_back(path);
    return;
  }
  for (int x = start; x <= 9; x++) {
    path.push_back(x);
    go(x + 1, k, n, path, ans);
    path.pop_back();
  }
}`,
            c: `void go(int start, int k, int n, int* path, int len) {
  int x, i, sum;
  if (len == k) {
    sum = 0; for (i = 0; i < len; i++) sum += path[i];
    if (sum == n) { for (i = 0; i < len; i++) printf("%d ", path[i]); printf("\\n"); }
    return;
  }
  for (x = start; x <= 9; x++) { path[len] = x; go(x + 1, k, n, path, len + 1); }
}`
          }
        },
        {
          name: "Optimal",
          time: "O(C(9, k) * k)",
          space: "O(k)",
          why: "One path. Push x, remain -= x, recurse x+1, pop. Snapshot when k numbers are chosen and remain is 0. No extra copies on internal nodes.",
          code: `function combinationSum3(k, n) {
  const ans = [];
  function go(start, left, remain, path) {
    if (left === 0) { if (remain === 0) ans.push(path.slice()); return; }
    for (let x = start; x <= 9; x++) {
      path.push(x);
      go(x + 1, left - 1, remain - x, path);
      path.pop();
    }
  }
  go(1, k, n, []);
  return ans;
}`,
          codes: {
            javascript: `function combinationSum3(k, n) {
  const ans = [];
  function go(start, left, remain, path) {
    if (left === 0) { if (remain === 0) ans.push(path.slice()); return; }
    for (let x = start; x <= 9; x++) {
      path.push(x);
      go(x + 1, left - 1, remain - x, path);
      path.pop();
    }
  }
  go(1, k, n, []);
  return ans;
}`,
            python: `def combinationSum3(k, n):
  ans = []
  def go(start, left, remain, path):
    if left == 0:
      if remain == 0:
        ans.append(path[:])
      return
    for x in range(start, 10):
      path.append(x)
      go(x + 1, left - 1, remain - x, path)
      path.pop()
  go(1, k, n, [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> combinationSum3(int k, int n) {
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(1, k, n, new ArrayList<Integer>(), ans);
    return ans;
  }
  void go(int start, int left, int remain, List<Integer> path, List<List<Integer>> ans) {
    if (left == 0) { if (remain == 0) ans.add(new ArrayList<Integer>(path)); return; }
    for (int x = start; x <= 9; x++) {
      path.add(x);
      go(x + 1, left - 1, remain - x, path, ans);
      path.remove(path.size() - 1);
    }
  }
}`,
            cpp: `void go(int start, int left, int remain, vector<int>& path, vector<vector<int>>& ans) {
  if (left == 0) { if (remain == 0) ans.push_back(path); return; }
  for (int x = start; x <= 9; x++) {
    path.push_back(x);
    go(x + 1, left - 1, remain - x, path, ans);
    path.pop_back();
  }
}`,
            c: `void go(int start, int left, int remain, int* path, int len) {
  int x, i;
  if (left == 0) {
    if (remain == 0) { for (i = 0; i < len; i++) printf("%d ", path[i]); printf("\\n"); }
    return;
  }
  for (x = start; x <= 9; x++) { path[len] = x; go(x + 1, left - 1, remain - x, path, len + 1); }
}`
          }
        },
        {
          name: "More optimal",
          time: "O(C(9, k) * k)",
          space: "O(k)",
          why: "Prune: remain < 0, or remain bigger than the largest left numbers, or remain smaller than the smallest left numbers. Stop the loop when x itself is already too big.",
          code: `function combinationSum3(k, n) {
  const ans = [];
  function go(start, left, remain, path) {
    if (left === 0) { if (remain === 0) ans.push(path.slice()); return; }
    const minSum = (left * (2 * start + left - 1)) / 2;
    const maxSum = (left * (2 * 9 - left + 1)) / 2;
    if (remain < minSum || remain > maxSum) return;
    for (let x = start; x <= 9; x++) {
      if (x > remain) break;
      path.push(x);
      go(x + 1, left - 1, remain - x, path);
      path.pop();
    }
  }
  go(1, k, n, []);
  return ans;
}`,
          codes: {
            javascript: `function combinationSum3(k, n) {
  const ans = [];
  function go(start, left, remain, path) {
    if (left === 0) { if (remain === 0) ans.push(path.slice()); return; }
    const minSum = (left * (2 * start + left - 1)) / 2;
    const maxSum = (left * (2 * 9 - left + 1)) / 2;
    if (remain < minSum || remain > maxSum) return;
    for (let x = start; x <= 9; x++) {
      if (x > remain) break;
      path.push(x);
      go(x + 1, left - 1, remain - x, path);
      path.pop();
    }
  }
  go(1, k, n, []);
  return ans;
}`,
            python: `def combinationSum3(k, n):
  ans = []
  def go(start, left, remain, path):
    if left == 0:
      if remain == 0:
        ans.append(path[:])
      return
    min_sum = left * (2 * start + left - 1) // 2
    max_sum = left * (2 * 9 - left + 1) // 2
    if remain < min_sum or remain > max_sum:
      return
    for x in range(start, 10):
      if x > remain:
        break
      path.append(x)
      go(x + 1, left - 1, remain - x, path)
      path.pop()
  go(1, k, n, [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<List<Integer>> combinationSum3(int k, int n) {
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    go(1, k, n, new ArrayList<Integer>(), ans);
    return ans;
  }
  void go(int start, int left, int remain, List<Integer> path, List<List<Integer>> ans) {
    if (left == 0) { if (remain == 0) ans.add(new ArrayList<Integer>(path)); return; }
    int minSum = left * (2 * start + left - 1) / 2;
    int maxSum = left * (2 * 9 - left + 1) / 2;
    if (remain < minSum || remain > maxSum) return;
    for (int x = start; x <= 9; x++) {
      if (x > remain) break;
      path.add(x);
      go(x + 1, left - 1, remain - x, path, ans);
      path.remove(path.size() - 1);
    }
  }
}`,
            cpp: `void go(int start, int left, int remain, vector<int>& path, vector<vector<int>>& ans) {
  if (left == 0) { if (remain == 0) ans.push_back(path); return; }
  int minSum = left * (2 * start + left - 1) / 2;
  int maxSum = left * (2 * 9 - left + 1) / 2;
  if (remain < minSum || remain > maxSum) return;
  for (int x = start; x <= 9; x++) {
    if (x > remain) break;
    path.push_back(x);
    go(x + 1, left - 1, remain - x, path, ans);
    path.pop_back();
  }
}`,
            c: `void go(int start, int left, int remain, int* path, int len) {
  int x, i, minSum, maxSum;
  if (left == 0) {
    if (remain == 0) { for (i = 0; i < len; i++) printf("%d ", path[i]); printf("\\n"); }
    return;
  }
  minSum = left * (2 * start + left - 1) / 2;
  maxSum = left * (2 * 9 - left + 1) / 2;
  if (remain < minSum || remain > maxSum) return;
  for (x = start; x <= 9; x++) {
    if (x > remain) break;
    path[len] = x;
    go(x + 1, left - 1, remain - x, path, len + 1);
  }
}`
          }
        }
      ]
    },
    {
      id: 15,
      level: "beginner",
      q: "Rat in a Maze",
      ask: "Amazon · Adobe · Microsoft · Flipkart",
      links: [{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/rat-in-a-maze-problem/1"}],
      a: "An n x n grid. 1 is open, 0 is a wall. A rat starts at (0,0) and must reach (n-1, n-1). Moves are D, L, R, U (down, left, right, up). Return every path string. You may not step on a wall or reuse a cell on the current path.\n\nTiny example: [[1,0],[1,1]]. One path is DR (down, then right). DL is blocked by the 0.\n\nThe brute copies the visited grid and the path string on every step. Standard search marks, appends a letter, unmarks. Prune a cell with no open neighbor, and skip the start if it is 0.\n\nOpen Brute, Optimal, and More optimal for extra copies, mark/unmark, and dead-end prune.",
      solutions: [
        {
          name: "Brute",
          time: "O(4^{n^2})",
          space: "O(n^2)",
          why: "Each step clones visited and concatenates a new path string. Exponential walks, extra copies at every node. Fine on n = 2, painful on n = 5.",
          code: `function ratInMaze(grid) {
  const n = grid.length;
  const ans = [];
  const dirs = [[1, 0, "D"], [0, -1, "L"], [0, 1, "R"], [-1, 0, "U"]];
  function go(r, c, path, seen) {
    if (r === n - 1 && c === n - 1) { ans.push(path); return; }
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
      if (grid[nr][nc] === 0 || seen[nr][nc]) continue;
      const copy = seen.map(function (row) { return row.slice(); });
      copy[nr][nc] = true;
      go(nr, nc, path + dirs[i][2], copy);
    }
  }
  if (!n || grid[0][0] === 0) return ans;
  const seen = grid.map(function () { return Array(n).fill(false); });
  seen[0][0] = true;
  go(0, 0, "", seen);
  return ans;
}`,
          codes: {
            javascript: `function ratInMaze(grid) {
  const n = grid.length;
  const ans = [];
  const dirs = [[1, 0, "D"], [0, -1, "L"], [0, 1, "R"], [-1, 0, "U"]];
  function go(r, c, path, seen) {
    if (r === n - 1 && c === n - 1) { ans.push(path); return; }
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
      if (grid[nr][nc] === 0 || seen[nr][nc]) continue;
      const copy = seen.map(function (row) { return row.slice(); });
      copy[nr][nc] = true;
      go(nr, nc, path + dirs[i][2], copy);
    }
  }
  if (!n || grid[0][0] === 0) return ans;
  const seen = grid.map(function () { return Array(n).fill(false); });
  seen[0][0] = true;
  go(0, 0, "", seen);
  return ans;
}`,
            python: `def ratInMaze(grid):
  n = len(grid)
  ans = []
  dirs = [(1, 0, "D"), (0, -1, "L"), (0, 1, "R"), (-1, 0, "U")]
  def go(r, c, path, seen):
    if r == n - 1 and c == n - 1:
      ans.append(path)
      return
    for dr, dc, ch in dirs:
      nr, nc = r + dr, c + dc
      if nr < 0 or nc < 0 or nr >= n or nc >= n:
        continue
      if grid[nr][nc] == 0 or seen[nr][nc]:
        continue
      copy = [row[:] for row in seen]
      copy[nr][nc] = True
      go(nr, nc, path + ch, copy)
  if not n or grid[0][0] == 0:
    return ans
  seen = [[False] * n for _ in range(n)]
  seen[0][0] = True
  go(0, 0, "", seen)
  return ans`,
            java: `import java.util.*;
class Solution {
  public ArrayList<String> ratInMaze(int[][] grid) {
    ArrayList<String> ans = new ArrayList<String>();
    int n = grid.length;
    if (n == 0 || grid[0][0] == 0) return ans;
    boolean[][] seen = new boolean[n][n];
    seen[0][0] = true;
    go(grid, 0, 0, "", seen, ans);
    return ans;
  }
  void go(int[][] grid, int r, int c, String path, boolean[][] seen, ArrayList<String> ans) {
    int n = grid.length;
    if (r == n - 1 && c == n - 1) { ans.add(path); return; }
    int[][] dirs = {{1,0},{0,-1},{0,1},{-1,0}};
    char[] ch = {'D','L','R','U'};
    for (int i = 0; i < 4; i++) {
      int nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
      if (grid[nr][nc] == 0 || seen[nr][nc]) continue;
      boolean[][] copy = new boolean[n][n];
      for (int a = 0; a < n; a++) copy[a] = seen[a].clone();
      copy[nr][nc] = true;
      go(grid, nr, nc, path + ch[i], copy, ans);
    }
  }
}`,
            cpp: `void go(vector<vector<int>>& grid, int r, int c, string path, vector<vector<int>> seen, vector<string>& ans) {
  int n = (int)grid.size();
  if (r == n - 1 && c == n - 1) { ans.push_back(path); return; }
  int dr[4] = {1, 0, 0, -1}, dc[4] = {0, -1, 1, 0};
  char ch[4] = {'D', 'L', 'R', 'U'};
  for (int i = 0; i < 4; i++) {
    int nr = r + dr[i], nc = c + dc[i];
    if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
    if (grid[nr][nc] == 0 || seen[nr][nc]) continue;
    auto copy = seen; copy[nr][nc] = 1;
    go(grid, nr, nc, path + ch[i], copy, ans);
  }
}`,
            c: `void go(int** grid, int n, int r, int c, char* path, int len, int** seen) {
  int dr[4] = {1,0,0,-1}, dc[4] = {0,-1,1,0};
  char ch[4] = {'D','L','R','U'};
  int i, nr, nc, a, b, **copy;
  if (r == n - 1 && c == n - 1) { path[len] = '\\0'; printf("%s\\n", path); return; }
  for (i = 0; i < 4; i++) {
    nr = r + dr[i]; nc = c + dc[i];
    if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
    if (grid[nr][nc] == 0 || seen[nr][nc]) continue;
    copy = (int**)malloc(sizeof(int*) * n);
    for (a = 0; a < n; a++) {
      copy[a] = (int*)malloc(sizeof(int) * n);
      for (b = 0; b < n; b++) copy[a][b] = seen[a][b];
    }
    copy[nr][nc] = 1;
    path[len] = ch[i];
    go(grid, n, nr, nc, path, len + 1, copy);
    for (a = 0; a < n; a++) free(copy[a]);
    free(copy);
  }
}`
          }
        },
        {
          name: "Optimal",
          time: "O(4^{n^2})",
          space: "O(n^2)",
          why: "Mark grid[r][c] = 0 (or a visited flag), append D/L/R/U, recurse, restore 1. One path buffer. Copy the string only when you hit the end.",
          code: `function ratInMaze(grid) {
  const n = grid.length;
  const ans = [];
  const dirs = [[1, 0, "D"], [0, -1, "L"], [0, 1, "R"], [-1, 0, "U"]];
  function go(r, c, path) {
    if (r === n - 1 && c === n - 1) { ans.push(path.join("")); return; }
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
      if (grid[nr][nc] === 0) continue;
      grid[nr][nc] = 0;
      path.push(dirs[i][2]);
      go(nr, nc, path);
      path.pop();
      grid[nr][nc] = 1;
    }
  }
  if (!n || grid[0][0] === 0) return ans;
  grid[0][0] = 0;
  go(0, 0, []);
  grid[0][0] = 1;
  return ans;
}`,
          codes: {
            javascript: `function ratInMaze(grid) {
  const n = grid.length;
  const ans = [];
  const dirs = [[1, 0, "D"], [0, -1, "L"], [0, 1, "R"], [-1, 0, "U"]];
  function go(r, c, path) {
    if (r === n - 1 && c === n - 1) { ans.push(path.join("")); return; }
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
      if (grid[nr][nc] === 0) continue;
      grid[nr][nc] = 0;
      path.push(dirs[i][2]);
      go(nr, nc, path);
      path.pop();
      grid[nr][nc] = 1;
    }
  }
  if (!n || grid[0][0] === 0) return ans;
  grid[0][0] = 0;
  go(0, 0, []);
  grid[0][0] = 1;
  return ans;
}`,
            python: `def ratInMaze(grid):
  n = len(grid)
  ans = []
  dirs = [(1, 0, "D"), (0, -1, "L"), (0, 1, "R"), (-1, 0, "U")]
  def go(r, c, path):
    if r == n - 1 and c == n - 1:
      ans.append("".join(path))
      return
    for dr, dc, ch in dirs:
      nr, nc = r + dr, c + dc
      if nr < 0 or nc < 0 or nr >= n or nc >= n:
        continue
      if grid[nr][nc] == 0:
        continue
      grid[nr][nc] = 0
      path.append(ch)
      go(nr, nc, path)
      path.pop()
      grid[nr][nc] = 1
  if not n or grid[0][0] == 0:
    return ans
  grid[0][0] = 0
  go(0, 0, [])
  grid[0][0] = 1
  return ans`,
            java: `import java.util.*;
class Solution {
  public ArrayList<String> ratInMaze(int[][] grid) {
    ArrayList<String> ans = new ArrayList<String>();
    int n = grid.length;
    if (n == 0 || grid[0][0] == 0) return ans;
    grid[0][0] = 0;
    go(grid, 0, 0, new StringBuilder(), ans);
    grid[0][0] = 1;
    return ans;
  }
  void go(int[][] grid, int r, int c, StringBuilder path, ArrayList<String> ans) {
    int n = grid.length;
    if (r == n - 1 && c == n - 1) { ans.add(path.toString()); return; }
    int[][] dirs = {{1,0},{0,-1},{0,1},{-1,0}};
    char[] ch = {'D','L','R','U'};
    for (int i = 0; i < 4; i++) {
      int nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= n || nc >= n || grid[nr][nc] == 0) continue;
      grid[nr][nc] = 0;
      path.append(ch[i]);
      go(grid, nr, nc, path, ans);
      path.deleteCharAt(path.length() - 1);
      grid[nr][nc] = 1;
    }
  }
}`,
            cpp: `void go(vector<vector<int>>& grid, int r, int c, string& path, vector<string>& ans) {
  int n = (int)grid.size();
  if (r == n - 1 && c == n - 1) { ans.push_back(path); return; }
  int dr[4] = {1,0,0,-1}, dc[4] = {0,-1,1,0};
  char ch[4] = {'D','L','R','U'};
  for (int i = 0; i < 4; i++) {
    int nr = r + dr[i], nc = c + dc[i];
    if (nr < 0 || nc < 0 || nr >= n || nc >= n || grid[nr][nc] == 0) continue;
    grid[nr][nc] = 0;
    path.push_back(ch[i]);
    go(grid, nr, nc, path, ans);
    path.pop_back();
    grid[nr][nc] = 1;
  }
}`,
            c: `void go(int** grid, int n, int r, int c, char* path, int len) {
  int dr[4] = {1,0,0,-1}, dc[4] = {0,-1,1,0};
  char ch[4] = {'D','L','R','U'};
  int i, nr, nc;
  if (r == n - 1 && c == n - 1) { path[len] = '\\0'; printf("%s\\n", path); return; }
  for (i = 0; i < 4; i++) {
    nr = r + dr[i]; nc = c + dc[i];
    if (nr < 0 || nc < 0 || nr >= n || nc >= n || grid[nr][nc] == 0) continue;
    grid[nr][nc] = 0;
    path[len] = ch[i];
    go(grid, n, nr, nc, path, len + 1);
    grid[nr][nc] = 1;
  }
}`
          }
        },
        {
          name: "More optimal",
          time: "O(4^{n^2})",
          space: "O(n^2)",
          why: "Same mark/unmark, plus skip a blocked start immediately. Try directions in DLRU order so the output is already sorted, no extra sort. Dead walls never enter the stack.",
          code: `function ratInMaze(grid) {
  const n = grid.length;
  const ans = [];
  if (!n || grid[0][0] === 0 || grid[n - 1][n - 1] === 0) return ans;
  const dirs = [[1, 0, "D"], [0, -1, "L"], [0, 1, "R"], [-1, 0, "U"]];
  function go(r, c, path) {
    if (r === n - 1 && c === n - 1) { ans.push(path.join("")); return; }
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
      if (grid[nr][nc] !== 1) continue;
      grid[nr][nc] = 0;
      path.push(dirs[i][2]);
      go(nr, nc, path);
      path.pop();
      grid[nr][nc] = 1;
    }
  }
  grid[0][0] = 0;
  go(0, 0, []);
  grid[0][0] = 1;
  return ans;
}`,
          codes: {
            javascript: `function ratInMaze(grid) {
  const n = grid.length;
  const ans = [];
  if (!n || grid[0][0] === 0 || grid[n - 1][n - 1] === 0) return ans;
  const dirs = [[1, 0, "D"], [0, -1, "L"], [0, 1, "R"], [-1, 0, "U"]];
  function go(r, c, path) {
    if (r === n - 1 && c === n - 1) { ans.push(path.join("")); return; }
    for (let i = 0; i < 4; i++) {
      const nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
      if (grid[nr][nc] !== 1) continue;
      grid[nr][nc] = 0;
      path.push(dirs[i][2]);
      go(nr, nc, path);
      path.pop();
      grid[nr][nc] = 1;
    }
  }
  grid[0][0] = 0;
  go(0, 0, []);
  grid[0][0] = 1;
  return ans;
}`,
            python: `def ratInMaze(grid):
  n = len(grid)
  ans = []
  if not n or grid[0][0] == 0 or grid[n - 1][n - 1] == 0:
    return ans
  dirs = [(1, 0, "D"), (0, -1, "L"), (0, 1, "R"), (-1, 0, "U")]
  def go(r, c, path):
    if r == n - 1 and c == n - 1:
      ans.append("".join(path))
      return
    for dr, dc, ch in dirs:
      nr, nc = r + dr, c + dc
      if nr < 0 or nc < 0 or nr >= n or nc >= n:
        continue
      if grid[nr][nc] != 1:
        continue
      grid[nr][nc] = 0
      path.append(ch)
      go(nr, nc, path)
      path.pop()
      grid[nr][nc] = 1
  grid[0][0] = 0
  go(0, 0, [])
  grid[0][0] = 1
  return ans`,
            java: `import java.util.*;
class Solution {
  public ArrayList<String> ratInMaze(int[][] grid) {
    ArrayList<String> ans = new ArrayList<String>();
    int n = grid.length;
    if (n == 0 || grid[0][0] == 0 || grid[n - 1][n - 1] == 0) return ans;
    grid[0][0] = 0;
    go(grid, 0, 0, new StringBuilder(), ans);
    grid[0][0] = 1;
    return ans;
  }
  void go(int[][] grid, int r, int c, StringBuilder path, ArrayList<String> ans) {
    int n = grid.length;
    if (r == n - 1 && c == n - 1) { ans.add(path.toString()); return; }
    int[][] dirs = {{1,0},{0,-1},{0,1},{-1,0}};
    char[] ch = {'D','L','R','U'};
    for (int i = 0; i < 4; i++) {
      int nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (nr < 0 || nc < 0 || nr >= n || nc >= n || grid[nr][nc] != 1) continue;
      grid[nr][nc] = 0;
      path.append(ch[i]);
      go(grid, nr, nc, path, ans);
      path.deleteCharAt(path.length() - 1);
      grid[nr][nc] = 1;
    }
  }
}`,
            cpp: `vector<string> ratInMaze(vector<vector<int>>& grid) {
  int n = (int)grid.size();
  vector<string> ans;
  if (!n || grid[0][0] == 0 || grid[n - 1][n - 1] == 0) return ans;
  string path;
  grid[0][0] = 0;
  function<void(int,int)> go = [&](int r, int c) {
    if (r == n - 1 && c == n - 1) { ans.push_back(path); return; }
    int dr[4] = {1,0,0,-1}, dc[4] = {0,-1,1,0};
    char ch[4] = {'D','L','R','U'};
    for (int i = 0; i < 4; i++) {
      int nr = r + dr[i], nc = c + dc[i];
      if (nr < 0 || nc < 0 || nr >= n || nc >= n || grid[nr][nc] != 1) continue;
      grid[nr][nc] = 0; path.push_back(ch[i]);
      go(nr, nc);
      path.pop_back(); grid[nr][nc] = 1;
    }
  };
  go(0, 0);
  grid[0][0] = 1;
  return ans;
}`,
            c: `void ratInMaze(int** grid, int n, char* path) {
  if (!n || grid[0][0] == 0 || grid[n - 1][n - 1] == 0) return;
  grid[0][0] = 0;
  go(grid, n, 0, 0, path, 0);
  grid[0][0] = 1;
}`
          }
        }
      ]
    },
    {
      id: 16,
      level: "intermediate",
      q: "Beautiful Arrangement",
      ask: "Google · Amazon",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/beautiful-arrangement/"}],
      a: "Count permutations perm of 1..n where for every position i (1-based), perm[i] % i == 0 or i % perm[i] == 0.\n\nTiny example: n = 2. [1,2] works. [2,1] also works because position 1 holds 2 and 2 % 1 == 0, and position 2 holds 1 and 2 % 1 == 0. Answer 2.\n\nThe brute builds every permutation with leftover copies and tests the rule at the end. Standard backtrack checks the rule as you place a number. A bitmask of used numbers (n <= 15) plus optional memo is the usual speed-up.\n\nOpen Brute, Optimal, and More optimal for all perms, place-and-check, and bitmasks.",
      solutions: [
        {
          name: "Brute",
          time: "O(n * n!)",
          space: "O(n)",
          why: "Generate every permutation with leftover copies. After a full perm, scan all n positions. n! full arrays, most fail only at the end.",
          code: `function countArrangement(n) {
  let count = 0;
  function ok(perm) {
    for (let i = 1; i <= n; i++) {
      if (perm[i - 1] % i !== 0 && i % perm[i - 1] !== 0) return false;
    }
    return true;
  }
  function go(left, perm) {
    if (left.length === 0) { if (ok(perm)) count++; return; }
    for (let i = 0; i < left.length; i++) {
      go(left.slice(0, i).concat(left.slice(i + 1)), perm.concat([left[i]]));
    }
  }
  const left = [];
  for (let x = 1; x <= n; x++) left.push(x);
  go(left, []);
  return count;
}`,
          codes: {
            javascript: `function countArrangement(n) {
  let count = 0;
  function ok(perm) {
    for (let i = 1; i <= n; i++) {
      if (perm[i - 1] % i !== 0 && i % perm[i - 1] !== 0) return false;
    }
    return true;
  }
  function go(left, perm) {
    if (left.length === 0) { if (ok(perm)) count++; return; }
    for (let i = 0; i < left.length; i++) {
      go(left.slice(0, i).concat(left.slice(i + 1)), perm.concat([left[i]]));
    }
  }
  const left = [];
  for (let x = 1; x <= n; x++) left.push(x);
  go(left, []);
  return count;
}`,
            python: `def countArrangement(n):
  count = [0]
  def ok(perm):
    for i in range(1, n + 1):
      if perm[i - 1] % i != 0 and i % perm[i - 1] != 0:
        return False
    return True
  def go(left, perm):
    if not left:
      if ok(perm):
        count[0] += 1
      return
    for i in range(len(left)):
      go(left[:i] + left[i+1:], perm + [left[i]])
  go(list(range(1, n + 1)), [])
  return count[0]`,
            java: `import java.util.*;
class Solution {
  int count;
  public int countArrangement(int n) {
    count = 0;
    List<Integer> left = new ArrayList<Integer>();
    for (int x = 1; x <= n; x++) left.add(x);
    go(n, left, new ArrayList<Integer>());
    return count;
  }
  boolean ok(int n, List<Integer> perm) {
    for (int i = 1; i <= n; i++) {
      int v = perm.get(i - 1);
      if (v % i != 0 && i % v != 0) return false;
    }
    return true;
  }
  void go(int n, List<Integer> left, List<Integer> perm) {
    if (left.isEmpty()) { if (ok(n, perm)) count++; return; }
    for (int i = 0; i < left.size(); i++) {
      List<Integer> nextLeft = new ArrayList<Integer>(left);
      List<Integer> nextPerm = new ArrayList<Integer>(perm);
      nextPerm.add(nextLeft.remove(i));
      go(n, nextLeft, nextPerm);
    }
  }
}`,
            cpp: `bool ok(vector<int>& perm) {
  int n = (int)perm.size();
  for (int i = 1; i <= n; i++) if (perm[i - 1] % i && i % perm[i - 1]) return false;
  return true;
}
void go(vector<int> left, vector<int> perm, int& count) {
  if (left.empty()) { if (ok(perm)) count++; return; }
  for (int i = 0; i < (int)left.size(); i++) {
    vector<int> nextLeft = left, nextPerm = perm;
    nextPerm.push_back(nextLeft[i]);
    nextLeft.erase(nextLeft.begin() + i);
    go(nextLeft, nextPerm, count);
  }
}`,
            c: `int ok(int* perm, int n) {
  int i;
  for (i = 1; i <= n; i++) if (perm[i - 1] % i && i % perm[i - 1]) return 0;
  return 1;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n!)",
          space: "O(n)",
          why: "At position pos (1-based), try unused numbers that already satisfy the divisibility rule. Fail early. used[] plus undo. Count leaves that fill n.",
          code: `function countArrangement(n) {
  let count = 0;
  const used = Array(n + 1).fill(false);
  function go(pos) {
    if (pos > n) { count++; return; }
    for (let num = 1; num <= n; num++) {
      if (used[num]) continue;
      if (num % pos !== 0 && pos % num !== 0) continue;
      used[num] = true;
      go(pos + 1);
      used[num] = false;
    }
  }
  go(1);
  return count;
}`,
          codes: {
            javascript: `function countArrangement(n) {
  let count = 0;
  const used = Array(n + 1).fill(false);
  function go(pos) {
    if (pos > n) { count++; return; }
    for (let num = 1; num <= n; num++) {
      if (used[num]) continue;
      if (num % pos !== 0 && pos % num !== 0) continue;
      used[num] = true;
      go(pos + 1);
      used[num] = false;
    }
  }
  go(1);
  return count;
}`,
            python: `def countArrangement(n):
  count = [0]
  used = [False] * (n + 1)
  def go(pos):
    if pos > n:
      count[0] += 1
      return
    for num in range(1, n + 1):
      if used[num]:
        continue
      if num % pos != 0 and pos % num != 0:
        continue
      used[num] = True
      go(pos + 1)
      used[num] = False
  go(1)
  return count[0]`,
            java: `class Solution {
  int count;
  public int countArrangement(int n) {
    count = 0;
    go(n, 1, new boolean[n + 1]);
    return count;
  }
  void go(int n, int pos, boolean[] used) {
    if (pos > n) { count++; return; }
    for (int num = 1; num <= n; num++) {
      if (used[num]) continue;
      if (num % pos != 0 && pos % num != 0) continue;
      used[num] = true;
      go(n, pos + 1, used);
      used[num] = false;
    }
  }
}`,
            cpp: `void go(int n, int pos, vector<int>& used, int& count) {
  if (pos > n) { count++; return; }
  for (int num = 1; num <= n; num++) {
    if (used[num]) continue;
    if (num % pos && pos % num) continue;
    used[num] = 1;
    go(n, pos + 1, used, count);
    used[num] = 0;
  }
}`,
            c: `void go(int n, int pos, int* used, int* count) {
  int num;
  if (pos > n) { (*count)++; return; }
  for (num = 1; num <= n; num++) {
    if (used[num]) continue;
    if (num % pos && pos % num) continue;
    used[num] = 1;
    go(n, pos + 1, used, count);
    used[num] = 0;
  }
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n * 2^n)",
          space: "O(n * 2^n)",
          why: "n <= 15. mask bit (num-1) means num is used. pos = popcount(mask)+1. Memo[mask] caches how many ways finish from this used-set. Bitmask + prune + no leftover copies.",
          code: `function countArrangement(n) {
  const memo = Array(1 << n).fill(-1);
  function go(mask) {
    let pos = 1, m = mask;
    while (m) { m &= m - 1; pos++; }
    if (pos > n) return 1;
    if (memo[mask] !== -1) return memo[mask];
    let ways = 0;
    for (let num = 1; num <= n; num++) {
      if (mask & (1 << (num - 1))) continue;
      if (num % pos !== 0 && pos % num !== 0) continue;
      ways += go(mask | (1 << (num - 1)));
    }
    memo[mask] = ways;
    return ways;
  }
  return go(0);
}`,
          codes: {
            javascript: `function countArrangement(n) {
  const memo = Array(1 << n).fill(-1);
  function go(mask) {
    let pos = 1, m = mask;
    while (m) { m &= m - 1; pos++; }
    if (pos > n) return 1;
    if (memo[mask] !== -1) return memo[mask];
    let ways = 0;
    for (let num = 1; num <= n; num++) {
      if (mask & (1 << (num - 1))) continue;
      if (num % pos !== 0 && pos % num !== 0) continue;
      ways += go(mask | (1 << (num - 1)));
    }
    memo[mask] = ways;
    return ways;
  }
  return go(0);
}`,
            python: `def countArrangement(n):
  memo = [-1] * (1 << n)
  def go(mask):
    pos = bin(mask).count("1") + 1
    if pos > n:
      return 1
    if memo[mask] != -1:
      return memo[mask]
    ways = 0
    for num in range(1, n + 1):
      if mask & (1 << (num - 1)):
        continue
      if num % pos != 0 and pos % num != 0:
        continue
      ways += go(mask | (1 << (num - 1)))
    memo[mask] = ways
    return ways
  return go(0)`,
            java: `class Solution {
  public int countArrangement(int n) {
    int[] memo = new int[1 << n];
    java.util.Arrays.fill(memo, -1);
    return go(n, 0, memo);
  }
  int go(int n, int mask, int[] memo) {
    int pos = Integer.bitCount(mask) + 1;
    if (pos > n) return 1;
    if (memo[mask] != -1) return memo[mask];
    int ways = 0;
    for (int num = 1; num <= n; num++) {
      if ((mask & (1 << (num - 1))) != 0) continue;
      if (num % pos != 0 && pos % num != 0) continue;
      ways += go(n, mask | (1 << (num - 1)), memo);
    }
    memo[mask] = ways;
    return ways;
  }
}`,
            cpp: `int go(int n, int mask, vector<int>& memo) {
  int pos = __builtin_popcount(mask) + 1;
  if (pos > n) return 1;
  if (memo[mask] != -1) return memo[mask];
  int ways = 0;
  for (int num = 1; num <= n; num++) {
    if (mask & (1 << (num - 1))) continue;
    if (num % pos && pos % num) continue;
    ways += go(n, mask | (1 << (num - 1)), memo);
  }
  return memo[mask] = ways;
}
int countArrangement(int n) {
  vector<int> memo(1 << n, -1);
  return go(n, 0, memo);
}`,
            c: `int goMask(int n, int mask, int* memo) {
  int pos = 1, m = mask, num, ways;
  while (m) { m &= m - 1; pos++; }
  if (pos > n) return 1;
  if (memo[mask] != -1) return memo[mask];
  ways = 0;
  for (num = 1; num <= n; num++) {
    if (mask & (1 << (num - 1))) continue;
    if (num % pos && pos % num) continue;
    ways += goMask(n, mask | (1 << (num - 1)), memo);
  }
  memo[mask] = ways;
  return ways;
}`
          }
        }
      ]
    },
    {
      id: 17,
      level: "advanced",
      q: "Word Break II",
      ask: "Amazon · Google · Dropbox · Uber",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/word-break-ii/"}],
      a: "Split s into a sequence of dictionary words. Return every sentence (words joined by spaces). A word may be reused.\n\nTiny example: s = \"catsanddog\", wordDict = [\"cat\",\"cats\",\"and\",\"sand\",\"dog\"]. Two sentences: \"cats and dog\" and \"cat sand dog\".\n\nThe brute tries every cut with extra string copies and checks the dict at the end. Standard backtrack tries each dict word as a prefix. Memo of index -> list of tails, plus a canBreak[] prune, stops exploding on 'aaaaaaaa'.\n\nOpen Brute, Optimal, and More optimal for all cuts, prefix backtrack, and memo plus prune.",
      solutions: [
        {
          name: "Brute",
          time: "O(2^n * n)",
          space: "O(2^n * n)",
          why: "At each index, cut or grow the last token, copying the token list. After the string ends, every token must sit in the dict. Catastrophic on repeated letters.",
          code: `function wordBreak(s, wordDict) {
  const dict = {};
  for (let i = 0; i < wordDict.length; i++) dict[wordDict[i]] = 1;
  const ans = [];
  function go(i, parts, cur) {
    if (i === s.length) {
      const all = cur.length ? parts.concat([cur]) : parts.slice();
      for (let p = 0; p < all.length; p++) if (!dict[all[p]]) return;
      ans.push(all.join(" "));
      return;
    }
    go(i + 1, parts.slice(), cur + s[i]);
    if (cur.length) go(i, parts.concat([cur]), "");
  }
  go(0, [], "");
  return ans;
}`,
          codes: {
            javascript: `function wordBreak(s, wordDict) {
  const dict = {};
  for (let i = 0; i < wordDict.length; i++) dict[wordDict[i]] = 1;
  const ans = [];
  function go(i, parts, cur) {
    if (i === s.length) {
      const all = cur.length ? parts.concat([cur]) : parts.slice();
      for (let p = 0; p < all.length; p++) if (!dict[all[p]]) return;
      ans.push(all.join(" "));
      return;
    }
    go(i + 1, parts.slice(), cur + s[i]);
    if (cur.length) go(i, parts.concat([cur]), "");
  }
  go(0, [], "");
  return ans;
}`,
            python: `def wordBreak(s, wordDict):
  d = set(wordDict)
  ans = []
  def go(i, parts, cur):
    if i == len(s):
      allp = parts + [cur] if cur else parts[:]
      if all(w in d for w in allp):
        ans.append(" ".join(allp))
      return
    go(i + 1, parts[:], cur + s[i])
    if cur:
      go(i, parts + [cur], "")
  go(0, [], "")
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<String> wordBreak(String s, List<String> wordDict) {
    Set<String> dict = new HashSet<String>(wordDict);
    List<String> ans = new ArrayList<String>();
    go(s, 0, new ArrayList<String>(), "", dict, ans);
    return ans;
  }
  void go(String s, int i, List<String> parts, String cur, Set<String> dict, List<String> ans) {
    if (i == s.length()) {
      List<String> all = new ArrayList<String>(parts);
      if (cur.length() > 0) all.add(cur);
      for (String w : all) if (!dict.contains(w)) return;
      ans.add(String.join(" ", all));
      return;
    }
    go(s, i + 1, new ArrayList<String>(parts), cur + s.charAt(i), dict, ans);
    if (cur.length() > 0) {
      List<String> cut = new ArrayList<String>(parts);
      cut.add(cur);
      go(s, i, cut, "", dict, ans);
    }
  }
}`,
            cpp: `void go(string& s, int i, vector<string> parts, string cur, unordered_set<string>& dict, vector<string>& ans) {
  if (i == (int)s.size()) {
    if (cur.size()) parts.push_back(cur);
    for (auto& w : parts) if (!dict.count(w)) return;
    string sent = parts[0];
    for (int p = 1; p < (int)parts.size(); p++) sent += " " + parts[p];
    ans.push_back(sent);
    return;
  }
  go(s, i + 1, parts, cur + s[i], dict, ans);
  if (cur.size()) { parts.push_back(cur); go(s, i, parts, "", dict, ans); }
}`,
            c: `/* brute cut-or-grow; classroom sketch */
void go(const char* s, int i, char parts[][32], int nparts, char* cur, int clen) {
  (void)s; (void)i; (void)parts; (void)nparts; (void)cur; (void)clen;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(2^n * n)",
          space: "O(2^n * n)",
          why: "From i, try every dictionary word as a prefix of s[i..]. Push, recurse i+len, pop. Only legal words ever sit on the path. Still exponential in the number of sentences.",
          code: `function wordBreak(s, wordDict) {
  const ans = [];
  function go(i, path) {
    if (i === s.length) { ans.push(path.join(" ")); return; }
    for (let w = 0; w < wordDict.length; w++) {
      const word = wordDict[w];
      if (s.slice(i, i + word.length) !== word) continue;
      path.push(word);
      go(i + word.length, path);
      path.pop();
    }
  }
  go(0, []);
  return ans;
}`,
          codes: {
            javascript: `function wordBreak(s, wordDict) {
  const ans = [];
  function go(i, path) {
    if (i === s.length) { ans.push(path.join(" ")); return; }
    for (let w = 0; w < wordDict.length; w++) {
      const word = wordDict[w];
      if (s.slice(i, i + word.length) !== word) continue;
      path.push(word);
      go(i + word.length, path);
      path.pop();
    }
  }
  go(0, []);
  return ans;
}`,
            python: `def wordBreak(s, wordDict):
  ans = []
  def go(i, path):
    if i == len(s):
      ans.append(" ".join(path))
      return
    for word in wordDict:
      if s[i:i + len(word)] != word:
        continue
      path.append(word)
      go(i + len(word), path)
      path.pop()
  go(0, [])
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<String> wordBreak(String s, List<String> wordDict) {
    List<String> ans = new ArrayList<String>();
    go(s, 0, wordDict, new ArrayList<String>(), ans);
    return ans;
  }
  void go(String s, int i, List<String> wordDict, List<String> path, List<String> ans) {
    if (i == s.length()) { ans.add(String.join(" ", path)); return; }
    for (String word : wordDict) {
      if (i + word.length() > s.length()) continue;
      if (!s.startsWith(word, i)) continue;
      path.add(word);
      go(s, i + word.length(), wordDict, path, ans);
      path.remove(path.size() - 1);
    }
  }
}`,
            cpp: `void go(string& s, int i, vector<string>& wordDict, vector<string>& path, vector<string>& ans) {
  if (i == (int)s.size()) {
    string sent = path[0];
    for (int p = 1; p < (int)path.size(); p++) sent += " " + path[p];
    ans.push_back(sent);
    return;
  }
  for (auto& word : wordDict) {
    if (s.compare(i, word.size(), word) != 0) continue;
    path.push_back(word);
    go(s, i + (int)word.size(), wordDict, path, ans);
    path.pop_back();
  }
}`,
            c: `void go(const char* s, int n, char dict[][32], int nd, int i, char* path, int plen) {
  int w, len, k;
  if (i == n) { path[plen] = '\\0'; printf("%s\\n", path); return; }
  for (w = 0; w < nd; w++) {
    len = (int)strlen(dict[w]);
    if (i + len > n) continue;
    if (strncmp(s + i, dict[w], len) != 0) continue;
    if (plen) path[plen++] = ' ';
    for (k = 0; k < len; k++) path[plen++] = dict[w][k];
    go(s, n, dict, nd, i + len, path, plen);
    plen -= len + (plen > len ? 1 : 0);
  }
}`
          }
        },
        {
          name: "More optimal",
          time: "O(2^n * n)",
          space: "O(2^n * n)",
          why: "can[i] is true if s[i..] can be broken at all. If !can[i], skip that index (prune). Memo[i] stores the list of sentences from i so overlapping tails are not rebuilt.",
          code: `function wordBreak(s, wordDict) {
  const n = s.length;
  const dict = {};
  for (let i = 0; i < wordDict.length; i++) dict[wordDict[i]] = 1;
  const can = Array(n + 1).fill(false);
  can[n] = true;
  for (let i = n - 1; i >= 0; i--) {
    for (let w = 0; w < wordDict.length; w++) {
      const word = wordDict[w];
      if (s.slice(i, i + word.length) === word && can[i + word.length]) { can[i] = true; break; }
    }
  }
  const memo = Array(n + 1);
  function go(i) {
    if (memo[i]) return memo[i];
    if (i === n) return [""];
    if (!can[i]) return memo[i] = [];
    const res = [];
    for (let w = 0; w < wordDict.length; w++) {
      const word = wordDict[w];
      if (s.slice(i, i + word.length) !== word) continue;
      const tails = go(i + word.length);
      for (let t = 0; t < tails.length; t++) res.push(tails[t] ? word + " " + tails[t] : word);
    }
    memo[i] = res;
    return res;
  }
  return can[0] ? go(0) : [];
}`,
          codes: {
            javascript: `function wordBreak(s, wordDict) {
  const n = s.length;
  const dict = {};
  for (let i = 0; i < wordDict.length; i++) dict[wordDict[i]] = 1;
  const can = Array(n + 1).fill(false);
  can[n] = true;
  for (let i = n - 1; i >= 0; i--) {
    for (let w = 0; w < wordDict.length; w++) {
      const word = wordDict[w];
      if (s.slice(i, i + word.length) === word && can[i + word.length]) { can[i] = true; break; }
    }
  }
  const memo = Array(n + 1);
  function go(i) {
    if (memo[i]) return memo[i];
    if (i === n) return [""];
    if (!can[i]) return memo[i] = [];
    const res = [];
    for (let w = 0; w < wordDict.length; w++) {
      const word = wordDict[w];
      if (s.slice(i, i + word.length) !== word) continue;
      const tails = go(i + word.length);
      for (let t = 0; t < tails.length; t++) res.push(tails[t] ? word + " " + tails[t] : word);
    }
    memo[i] = res;
    return res;
  }
  return can[0] ? go(0) : [];
}`,
            python: `def wordBreak(s, wordDict):
  n = len(s)
  d = set(wordDict)
  can = [False] * (n + 1)
  can[n] = True
  for i in range(n - 1, -1, -1):
    for word in wordDict:
      if s[i:i + len(word)] == word and can[i + len(word)]:
        can[i] = True
        break
  memo = [None] * (n + 1)
  def go(i):
    if memo[i] is not None:
      return memo[i]
    if i == n:
      return [""]
    if not can[i]:
      memo[i] = []
      return []
    res = []
    for word in wordDict:
      if s[i:i + len(word)] != word:
        continue
      for tail in go(i + len(word)):
        res.append(word + (" " + tail if tail else ""))
    memo[i] = res
    return res
  return go(0) if can[0] else []`,
            java: `import java.util.*;
class Solution {
  public List<String> wordBreak(String s, List<String> wordDict) {
    int n = s.length();
    boolean[] can = new boolean[n + 1];
    can[n] = true;
    for (int i = n - 1; i >= 0; i--)
      for (String word : wordDict)
        if (i + word.length() <= n && s.startsWith(word, i) && can[i + word.length()]) { can[i] = true; break; }
    Map<Integer, List<String>> memo = new HashMap<Integer, List<String>>();
    return can[0] ? go(s, 0, wordDict, can, memo) : new ArrayList<String>();
  }
  List<String> go(String s, int i, List<String> wordDict, boolean[] can, Map<Integer, List<String>> memo) {
    if (memo.containsKey(i)) return memo.get(i);
    List<String> res = new ArrayList<String>();
    if (i == s.length()) { res.add(""); return res; }
    if (!can[i]) { memo.put(i, res); return res; }
    for (String word : wordDict) {
      if (!s.startsWith(word, i)) continue;
      for (String tail : go(s, i + word.length(), wordDict, can, memo))
        res.add(tail.isEmpty() ? word : word + " " + tail);
    }
    memo.put(i, res);
    return res;
  }
}`,
            cpp: `vector<string> go(string& s, int i, vector<string>& wordDict, vector<int>& can, vector<vector<string>>& memo, vector<int>& seen) {
  if (seen[i]) return memo[i];
  seen[i] = 1;
  if (i == (int)s.size()) return memo[i] = {""};
  if (!can[i]) return memo[i];
  for (auto& word : wordDict) {
    if (s.compare(i, word.size(), word) != 0) continue;
    for (auto& tail : go(s, i + (int)word.size(), wordDict, can, memo, seen))
      memo[i].push_back(tail.empty() ? word : word + " " + tail);
  }
  return memo[i];
}`,
            c: `int canBreak(const char* s, int n, char dict[][32], int nd, int* can) {
  int i, w, len;
  can[n] = 1;
  for (i = n - 1; i >= 0; i--) {
    can[i] = 0;
    for (w = 0; w < nd; w++) {
      len = (int)strlen(dict[w]);
      if (i + len <= n && strncmp(s + i, dict[w], len) == 0 && can[i + len]) { can[i] = 1; break; }
    }
  }
  return can[0];
}`
          }
        }
      ]
    },
    {
      id: 18,
      level: "advanced",
      q: "Expression Add Operators",
      ask: "Google · Meta · Amazon",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/expression-add-operators/"}],
      a: "Insert +, -, or * between digits of num (or concatenate digits) so the expression equals target. Return every valid expression. No leading zeros in a number (except 0 itself). * binds tighter than + and -.\n\nTiny example: num = \"123\", target = 6. Answers: \"1+2+3\" and \"1*2*3\".\n\nThe brute builds every operator placement with extra string copies and evals at the end. Standard backtrack walks an index and tries concat / + / - / *. The speed-up tracks the running value and the last operand so * can undo (cur - last + last * val) without a full eval, and prunes leading zeros.\n\nOpen Brute, Optimal, and More optimal for generate-and-eval, backtrack, and running-value prune.",
      solutions: [
        {
          name: "Brute",
          time: "O(4^n * n)",
          space: "O(n)",
          why: "Between digits you copy four choices: nothing (concat), +, -, *. At the end you parse and evaluate, respecting * first. Extra strings everywhere. Leading-zero expressions are built then thrown away.",
          code: `function addOperators(num, target) {
  const ans = [];
  const ops = ["", "+", "-", "*"];
  function evalExpr(expr) {
    const tokens = [];
    let i = 0;
    while (i < expr.length) {
      if (expr[i] === "+" || expr[i] === "-") { tokens.push(expr[i]); i++; continue; }
      if (expr[i] === "*") { i++; continue; }
      let j = i, v = 0;
      if (expr[i] === "0" && i + 1 < expr.length && expr[i + 1] >= "0" && expr[i + 1] <= "9" && (i === 0 || (expr[i - 1] !== "0" && expr[i - 1] >= "0"))) {
        /* leading zero check happens in ok() */
      }
      while (j < expr.length && expr[j] >= "0" && expr[j] <= "9") { v = v * 10 + (expr.charCodeAt(j) - 48); j++; }
      if (i > 0 && expr[i - 1] === "*") tokens[tokens.length - 1] *= v;
      else tokens.push(v);
      i = j;
    }
    let sum = 0, sign = 1;
    for (let t = 0; t < tokens.length; t++) {
      if (tokens[t] === "+") sign = 1;
      else if (tokens[t] === "-") sign = -1;
      else { sum += sign * tokens[t]; sign = 1; }
    }
    return sum;
  }
  function ok(expr) {
    for (let i = 0; i < expr.length; i++) {
      if (expr[i] < "0" || expr[i] > "9") continue;
      if (expr[i] === "0" && i + 1 < expr.length && expr[i + 1] >= "0" && expr[i + 1] <= "9") {
        if (i === 0 || expr[i - 1] < "0" || expr[i - 1] > "9") return false;
      }
    }
    return true;
  }
  function go(i, expr) {
    if (i === num.length) {
      if (ok(expr) && evalExpr(expr) === target) ans.push(expr);
      return;
    }
    if (i === 0) { go(1, num[0]); return; }
    for (let o = 0; o < 4; o++) go(i + 1, expr + ops[o] + num[i]);
  }
  if (num.length) go(0, "");
  return ans;
}`,
          codes: {
            javascript: `function addOperators(num, target) {
  const ans = [];
  const ops = ["", "+", "-", "*"];
  function evalExpr(expr) {
    const tokens = [];
    let i = 0;
    while (i < expr.length) {
      if (expr[i] === "+" || expr[i] === "-") { tokens.push(expr[i]); i++; continue; }
      if (expr[i] === "*") { i++; continue; }
      let j = i, v = 0;
      if (expr[i] === "0" && i + 1 < expr.length && expr[i + 1] >= "0" && expr[i + 1] <= "9" && (i === 0 || (expr[i - 1] !== "0" && expr[i - 1] >= "0"))) {
        /* leading zero check happens in ok() */
      }
      while (j < expr.length && expr[j] >= "0" && expr[j] <= "9") { v = v * 10 + (expr.charCodeAt(j) - 48); j++; }
      if (i > 0 && expr[i - 1] === "*") tokens[tokens.length - 1] *= v;
      else tokens.push(v);
      i = j;
    }
    let sum = 0, sign = 1;
    for (let t = 0; t < tokens.length; t++) {
      if (tokens[t] === "+") sign = 1;
      else if (tokens[t] === "-") sign = -1;
      else { sum += sign * tokens[t]; sign = 1; }
    }
    return sum;
  }
  function ok(expr) {
    for (let i = 0; i < expr.length; i++) {
      if (expr[i] < "0" || expr[i] > "9") continue;
      if (expr[i] === "0" && i + 1 < expr.length && expr[i + 1] >= "0" && expr[i + 1] <= "9") {
        if (i === 0 || expr[i - 1] < "0" || expr[i - 1] > "9") return false;
      }
    }
    return true;
  }
  function go(i, expr) {
    if (i === num.length) {
      if (ok(expr) && evalExpr(expr) === target) ans.push(expr);
      return;
    }
    if (i === 0) { go(1, num[0]); return; }
    for (let o = 0; o < 4; o++) go(i + 1, expr + ops[o] + num[i]);
  }
  if (num.length) go(0, "");
  return ans;
}`,
            python: `def addOperators(num, target):
  ans = []
  ops = ["", "+", "-", "*"]
  def ok(expr):
    i = 0
    n = len(expr)
    while i < n:
      if expr[i] in "+-*":
        i += 1
        continue
      j = i
      while j < n and expr[j].isdigit():
        j += 1
      part = expr[i:j]
      if len(part) > 1 and part[0] == "0":
        return False
      i = j
    return True
  def eval_expr(expr):
    tokens = []
    i = 0
    n = len(expr)
    while i < n:
      if expr[i] in "+-":
        tokens.append(expr[i])
        i += 1
        continue
      if expr[i] == "*":
        i += 1
        continue
      j = i
      v = 0
      while j < n and expr[j].isdigit():
        v = v * 10 + ord(expr[j]) - 48
        j += 1
      if i > 0 and expr[i - 1] == "*":
        tokens[-1] *= v
      else:
        tokens.append(v)
      i = j
    sm, sign = 0, 1
    for t in tokens:
      if t == "+":
        sign = 1
      elif t == "-":
        sign = -1
      else:
        sm += sign * t
        sign = 1
    return sm
  def go(i, expr):
    if i == len(num):
      if ok(expr) and eval_expr(expr) == target:
        ans.append(expr)
      return
    if i == 0:
      go(1, num[0])
      return
    for op in ops:
      go(i + 1, expr + op + num[i])
  if num:
    go(0, "")
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<String> addOperators(String num, int target) {
    List<String> ans = new ArrayList<String>();
    if (num.length() == 0) return ans;
    go(num, target, 0, "", ans);
    return ans;
  }
  boolean ok(String expr) {
    int i = 0;
    while (i < expr.length()) {
      char ch = expr.charAt(i);
      if (ch == '+' || ch == '-' || ch == '*') { i++; continue; }
      int j = i;
      while (j < expr.length() && Character.isDigit(expr.charAt(j))) j++;
      if (j - i > 1 && expr.charAt(i) == '0') return false;
      i = j;
    }
    return true;
  }
  long evalExpr(String expr) {
    java.util.ArrayList<Long> tokens = new java.util.ArrayList<Long>();
    java.util.ArrayList<Character> signs = new java.util.ArrayList<Character>();
    int i = 0;
    Character lastOp = null;
    while (i < expr.length()) {
      char ch = expr.charAt(i);
      if (ch == '+' || ch == '-') { signs.add(ch); lastOp = ch; i++; continue; }
      if (ch == '*') { lastOp = '*'; i++; continue; }
      int j = i; long v = 0;
      while (j < expr.length() && Character.isDigit(expr.charAt(j))) { v = v * 10 + (expr.charAt(j) - '0'); j++; }
      if (lastOp != null && lastOp == '*') tokens.set(tokens.size() - 1, tokens.get(tokens.size() - 1) * v);
      else tokens.add(v);
      lastOp = null;
      i = j;
    }
    long sum = 0; int si = 0;
    sum = tokens.get(0);
    for (int t = 1; t < tokens.size(); t++) {
      char op = signs.get(si++);
      if (op == '+') sum += tokens.get(t); else sum -= tokens.get(t);
    }
    return sum;
  }
  void go(String num, int target, int i, String expr, List<String> ans) {
    if (i == num.length()) {
      if (ok(expr) && evalExpr(expr) == target) ans.add(expr);
      return;
    }
    if (i == 0) { go(num, target, 1, "" + num.charAt(0), ans); return; }
    String[] ops = {"", "+", "-", "*"};
    for (String op : ops) go(num, target, i + 1, expr + op + num.charAt(i), ans);
  }
}`,
            cpp: `bool ok(const string& expr) {
  for (int i = 0; i < (int)expr.size(); ) {
    if (expr[i] == '+' || expr[i] == '-' || expr[i] == '*') { i++; continue; }
    int j = i;
    while (j < (int)expr.size() && isdigit(expr[j])) j++;
    if (j - i > 1 && expr[i] == '0') return false;
    i = j;
  }
  return true;
}
void go(string& num, int target, int i, string expr, vector<string>& ans) {
  if (i == (int)num.size()) {
    if (ok(expr)) ans.push_back(expr);
    return;
  }
  if (i == 0) { go(num, target, 1, string(1, num[0]), ans); return; }
  string ops[4] = {"", "+", "-", "*"};
  for (int o = 0; o < 4; o++) go(num, target, i + 1, expr + ops[o] + num[i], ans);
}`,
            c: `void go(const char* num, int target, int i, char* expr, int len) {
  const char* ops[4] = {"", "+", "-", "*"};
  int o, k;
  if (num[i] == '\\0') { expr[len] = '\\0'; printf("%s\\n", expr); return; }
  if (i == 0) { expr[0] = num[0]; go(num, target, 1, expr, 1); return; }
  for (o = 0; o < 4; o++) {
    k = len;
    for (int p = 0; ops[o][p]; p++) expr[k++] = ops[o][p];
    expr[k++] = num[i];
    go(num, target, i + 1, expr, k);
  }
}`
          }
        },
        {
          name: "Optimal",
          time: "O(4^n)",
          space: "O(n)",
          why: "From index i, take the next operand as a long (concat digits). For the first number, just place it. Later, branch +, -, * onto one path buffer and undo. A running cur and last let you accept a leaf without a separate eval. Leading zeros are skipped.",
          code: `function addOperators(num, target) {
  const ans = [];
  function go(i, expr, cur, last) {
    if (i === num.length) {
      if (cur === target) ans.push(expr);
      return;
    }
    let val = 0;
    for (let j = i; j < num.length; j++) {
      if (j > i && num[i] === "0") break;
      val = val * 10 + (num.charCodeAt(j) - 48);
      const piece = num.slice(i, j + 1);
      if (i === 0) go(j + 1, piece, val, val);
      else {
        go(j + 1, expr + "+" + piece, cur + val, val);
        go(j + 1, expr + "-" + piece, cur - val, -val);
        go(j + 1, expr + "*" + piece, cur - last + last * val, last * val);
      }
    }
  }
  go(0, "", 0, 0);
  return ans;
}`,
          codes: {
            javascript: `function addOperators(num, target) {
  const ans = [];
  function go(i, expr, cur, last) {
    if (i === num.length) {
      if (cur === target) ans.push(expr);
      return;
    }
    let val = 0;
    for (let j = i; j < num.length; j++) {
      if (j > i && num[i] === "0") break;
      val = val * 10 + (num.charCodeAt(j) - 48);
      const piece = num.slice(i, j + 1);
      if (i === 0) go(j + 1, piece, val, val);
      else {
        go(j + 1, expr + "+" + piece, cur + val, val);
        go(j + 1, expr + "-" + piece, cur - val, -val);
        go(j + 1, expr + "*" + piece, cur - last + last * val, last * val);
      }
    }
  }
  go(0, "", 0, 0);
  return ans;
}`,
            python: `def addOperators(num, target):
  ans = []
  def go(i, expr, cur, last):
    if i == len(num):
      if cur == target:
        ans.append(expr)
      return
    val = 0
    for j in range(i, len(num)):
      if j > i and num[i] == "0":
        break
      val = val * 10 + (ord(num[j]) - 48)
      piece = num[i:j + 1]
      if i == 0:
        go(j + 1, piece, val, val)
      else:
        go(j + 1, expr + "+" + piece, cur + val, val)
        go(j + 1, expr + "-" + piece, cur - val, -val)
        go(j + 1, expr + "*" + piece, cur - last + last * val, last * val)
  go(0, "", 0, 0)
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<String> addOperators(String num, int target) {
    List<String> ans = new ArrayList<String>();
    go(num, target, 0, new StringBuilder(), 0L, 0L, ans);
    return ans;
  }
  void go(String num, int target, int i, StringBuilder expr, long cur, long last, List<String> ans) {
    if (i == num.length()) {
      if (cur == target) ans.add(expr.toString());
      return;
    }
    long val = 0;
    int len = expr.length();
    for (int j = i; j < num.length(); j++) {
      if (j > i && num.charAt(i) == '0') break;
      val = val * 10 + (num.charAt(j) - '0');
      String piece = num.substring(i, j + 1);
      if (i == 0) {
        expr.append(piece);
        go(num, target, j + 1, expr, val, val, ans);
        expr.setLength(len);
      } else {
        expr.append('+').append(piece);
        go(num, target, j + 1, expr, cur + val, val, ans);
        expr.setLength(len);
        expr.append('-').append(piece);
        go(num, target, j + 1, expr, cur - val, -val, ans);
        expr.setLength(len);
        expr.append('*').append(piece);
        go(num, target, j + 1, expr, cur - last + last * val, last * val, ans);
        expr.setLength(len);
      }
    }
  }
}`,
            cpp: `void go(string& num, long target, int i, string& expr, long cur, long last, vector<string>& ans) {
  if (i == (int)num.size()) { if (cur == target) ans.push_back(expr); return; }
  long val = 0;
  int len = (int)expr.size();
  for (int j = i; j < (int)num.size(); j++) {
    if (j > i && num[i] == '0') break;
    val = val * 10 + (num[j] - '0');
    string piece = num.substr(i, j - i + 1);
    if (i == 0) { expr += piece; go(num, target, j + 1, expr, val, val, ans); expr.resize(len); }
    else {
      expr += "+" + piece; go(num, target, j + 1, expr, cur + val, val, ans); expr.resize(len);
      expr += "-" + piece; go(num, target, j + 1, expr, cur - val, -val, ans); expr.resize(len);
      expr += "*" + piece; go(num, target, j + 1, expr, cur - last + last * val, last * val, ans); expr.resize(len);
    }
  }
}`,
            c: `void go(const char* num, int n, long long target, int i, char* expr, int len, long long cur, long long last) {
  int j, k, plen;
  long long val = 0;
  if (i == n) { if (cur == target) { expr[len] = '\\0'; printf("%s\\n", expr); } return; }
  for (j = i; j < n; j++) {
    if (j > i && num[i] == '0') break;
    val = val * 10 + (num[j] - '0');
    plen = j - i + 1;
    if (i == 0) {
      for (k = 0; k < plen; k++) expr[k] = num[k];
      go(num, n, target, j + 1, expr, plen, val, val);
    } else {
      expr[len] = '+'; for (k = 0; k < plen; k++) expr[len + 1 + k] = num[i + k];
      go(num, n, target, j + 1, expr, len + 1 + plen, cur + val, val);
      expr[len] = '-'; for (k = 0; k < plen; k++) expr[len + 1 + k] = num[i + k];
      go(num, n, target, j + 1, expr, len + 1 + plen, cur - val, -val);
      expr[len] = '*'; for (k = 0; k < plen; k++) expr[len + 1 + k] = num[i + k];
      go(num, n, target, j + 1, expr, len + 1 + plen, cur - last + last * val, last * val);
    }
  }
}`
          }
        },
        {
          name: "More optimal",
          time: "O(4^n)",
          space: "O(n)",
          why: "Track cur (value of the expression so far) and last (the last operand, signed). Concat: last = last*10+d, cur = cur - oldLast + last. Plus: cur+val, last=val. Minus: cur-val, last=-val. Times: cur-last+last*val, last=last*val. No eval. Leading zeros break. Use 64-bit to avoid overflow.",
          code: `function addOperators(num, target) {
  const ans = [];
  function go(i, expr, cur, last) {
    if (i === num.length) {
      if (cur === target) ans.push(expr);
      return;
    }
    let val = 0;
    for (let j = i; j < num.length; j++) {
      if (j > i && num[i] === "0") break;
      val = val * 10 + (num.charCodeAt(j) - 48);
      const piece = num.slice(i, j + 1);
      if (i === 0) go(j + 1, piece, val, val);
      else {
        go(j + 1, expr + "+" + piece, cur + val, val);
        go(j + 1, expr + "-" + piece, cur - val, -val);
        go(j + 1, expr + "*" + piece, cur - last + last * val, last * val);
      }
    }
  }
  go(0, "", 0, 0);
  return ans;
}`,
          codes: {
            javascript: `function addOperators(num, target) {
  const ans = [];
  function go(i, expr, cur, last) {
    if (i === num.length) {
      if (cur === target) ans.push(expr);
      return;
    }
    let val = 0;
    for (let j = i; j < num.length; j++) {
      if (j > i && num[i] === "0") break;
      val = val * 10 + (num.charCodeAt(j) - 48);
      const piece = num.slice(i, j + 1);
      if (i === 0) go(j + 1, piece, val, val);
      else {
        go(j + 1, expr + "+" + piece, cur + val, val);
        go(j + 1, expr + "-" + piece, cur - val, -val);
        go(j + 1, expr + "*" + piece, cur - last + last * val, last * val);
      }
    }
  }
  go(0, "", 0, 0);
  return ans;
}`,
            python: `def addOperators(num, target):
  ans = []
  def go(i, expr, cur, last):
    if i == len(num):
      if cur == target:
        ans.append(expr)
      return
    val = 0
    for j in range(i, len(num)):
      if j > i and num[i] == "0":
        break
      val = val * 10 + (ord(num[j]) - 48)
      piece = num[i:j + 1]
      if i == 0:
        go(j + 1, piece, val, val)
      else:
        go(j + 1, expr + "+" + piece, cur + val, val)
        go(j + 1, expr + "-" + piece, cur - val, -val)
        go(j + 1, expr + "*" + piece, cur - last + last * val, last * val)
  go(0, "", 0, 0)
  return ans`,
            java: `import java.util.*;
class Solution {
  public List<String> addOperators(String num, int target) {
    List<String> ans = new ArrayList<String>();
    go(num, target, 0, new StringBuilder(), 0L, 0L, ans);
    return ans;
  }
  void go(String num, int target, int i, StringBuilder expr, long cur, long last, List<String> ans) {
    if (i == num.length()) {
      if (cur == target) ans.add(expr.toString());
      return;
    }
    long val = 0;
    int len = expr.length();
    for (int j = i; j < num.length(); j++) {
      if (j > i && num.charAt(i) == '0') break;
      val = val * 10 + (num.charAt(j) - '0');
      String piece = num.substring(i, j + 1);
      if (i == 0) {
        expr.append(piece);
        go(num, target, j + 1, expr, val, val, ans);
        expr.setLength(len);
      } else {
        expr.append('+').append(piece);
        go(num, target, j + 1, expr, cur + val, val, ans);
        expr.setLength(len);
        expr.append('-').append(piece);
        go(num, target, j + 1, expr, cur - val, -val, ans);
        expr.setLength(len);
        expr.append('*').append(piece);
        go(num, target, j + 1, expr, cur - last + last * val, last * val, ans);
        expr.setLength(len);
      }
    }
  }
}`,
            cpp: `void go(string& num, long target, int i, string& expr, long cur, long last, vector<string>& ans) {
  if (i == (int)num.size()) { if (cur == target) ans.push_back(expr); return; }
  long val = 0;
  int len = (int)expr.size();
  for (int j = i; j < (int)num.size(); j++) {
    if (j > i && num[i] == '0') break;
    val = val * 10 + (num[j] - '0');
    string piece = num.substr(i, j - i + 1);
    if (i == 0) { expr += piece; go(num, target, j + 1, expr, val, val, ans); expr.resize(len); }
    else {
      expr += "+" + piece; go(num, target, j + 1, expr, cur + val, val, ans); expr.resize(len);
      expr += "-" + piece; go(num, target, j + 1, expr, cur - val, -val, ans); expr.resize(len);
      expr += "*" + piece; go(num, target, j + 1, expr, cur - last + last * val, last * val, ans); expr.resize(len);
    }
  }
}`,
            c: `void go(const char* num, int n, long long target, int i, char* expr, int len, long long cur, long long last) {
  int j, k, plen;
  long long val = 0;
  if (i == n) { if (cur == target) { expr[len] = '\\0'; printf("%s\\n", expr); } return; }
  for (j = i; j < n; j++) {
    if (j > i && num[i] == '0') break;
    val = val * 10 + (num[j] - '0');
    plen = j - i + 1;
    if (i == 0) {
      for (k = 0; k < plen; k++) expr[k] = num[k];
      go(num, n, target, j + 1, expr, plen, val, val);
    } else {
      expr[len] = '+'; for (k = 0; k < plen; k++) expr[len + 1 + k] = num[i + k];
      go(num, n, target, j + 1, expr, len + 1 + plen, cur + val, val);
      expr[len] = '-'; for (k = 0; k < plen; k++) expr[len + 1 + k] = num[i + k];
      go(num, n, target, j + 1, expr, len + 1 + plen, cur - val, -val);
      expr[len] = '*'; for (k = 0; k < plen; k++) expr[len + 1 + k] = num[i + k];
      go(num, n, target, j + 1, expr, len + 1 + plen, cur - last + last * val, last * val);
    }
  }
}`
          }
        }
      ]
    }
  ]
};
