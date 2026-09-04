const { makeSol, lc, gfgProblem, gfgArt } = require("./dsa_emit.cjs");

function q32() {
  return {
    id: 32,
    level: "beginner",
    q: "Find All Numbers Disappeared in an Array",
    ask: "Google · Amazon · Microsoft",
    links: [lc("find-all-numbers-disappeared-in-an-array"), gfgArt("find-all-numbers-disappeared-in-an-array")],
    a: "nums has length n. Values are in 1..n. Some numbers in 1..n never appear (replaced by duplicates). Return the missing ones. Follow-up: O(n) time, O(1) extra, you may mutate nums.\n\nExample: [4, 3, 2, 7, 8, 2, 3, 1] answers [5, 6].\n\nBrute checks 1..n with a scan. Optimal uses a boolean / set. More optimal negates index x-1, then collects indexes that stayed positive.",
    solutions: [
      makeSol("Brute", "O(n²)", "O(1)",
        "For each candidate v in 1..n, scan the array. If it never appears, it is missing.",
        {
          javascript: `function findDisappearedNumbers(nums) {
  const n = nums.length;
  const out = [];
  for (let v = 1; v <= n; v++) {
    let found = false;
    for (let i = 0; i < n; i++) if (nums[i] === v) { found = true; break; }
    if (!found) out.push(v);
  }
  return out;
}`,
          python: `def findDisappearedNumbers(nums):
  n = len(nums)
  out = []
  for v in range(1, n + 1):
    if v not in nums:
      out.append(v)
  return out`,
          java: `import java.util.*;
class Solution {
  public List<Integer> findDisappearedNumbers(int[] nums) {
    List<Integer> out = new ArrayList<Integer>();
    int n = nums.length;
    for (int v = 1; v <= n; v++) {
      boolean found = false;
      for (int x : nums) if (x == v) { found = true; break; }
      if (!found) out.add(v);
    }
    return out;
  }
}`,
          cpp: `vector<int> findDisappearedNumbers(vector<int>& nums) {
  vector<int> out;
  int n = (int)nums.size();
  for (int v = 1; v <= n; v++) {
    bool found = false;
    for (int x : nums) if (x == v) { found = true; break; }
    if (!found) out.push_back(v);
  }
  return out;
}`,
          c: `int findDisappearedNumbers(int* nums, int n, int* out) {
  int v, i, on = 0;
  for (v = 1; v <= n; v++) {
    int found = 0;
    for (i = 0; i < n; i++) if (nums[i] == v) { found = 1; break; }
    if (!found) out[on++] = v;
  }
  return on;
}`
        }),
      makeSol("Optimal", "O(n)", "O(n)",
        "A boolean array (or a set) of seen values. Then walk 1..n and collect the false slots.",
        {
          javascript: `function findDisappearedNumbers(nums) {
  const n = nums.length;
  const seen = Array(n + 1).fill(false);
  for (let i = 0; i < n; i++) seen[nums[i]] = true;
  const out = [];
  for (let v = 1; v <= n; v++) if (!seen[v]) out.push(v);
  return out;
}`,
          python: `def findDisappearedNumbers(nums):
  n = len(nums)
  seen = [False] * (n + 1)
  for x in nums:
    seen[x] = True
  return [v for v in range(1, n + 1) if not seen[v]]`,
          java: `import java.util.*;
class Solution {
  public List<Integer> findDisappearedNumbers(int[] nums) {
    int n = nums.length;
    boolean[] seen = new boolean[n + 1];
    for (int x : nums) seen[x] = true;
    List<Integer> out = new ArrayList<Integer>();
    for (int v = 1; v <= n; v++) if (!seen[v]) out.add(v);
    return out;
  }
}`,
          cpp: `vector<int> findDisappearedNumbers(vector<int>& nums) {
  int n = (int)nums.size();
  vector<int> seen(n + 1), out;
  for (int x : nums) seen[x] = 1;
  for (int v = 1; v <= n; v++) if (!seen[v]) out.push_back(v);
  return out;
}`,
          c: `int findDisappearedNumbers(int* nums, int n, int* out) {
  int seen[10001] = {0};
  int i, v, on = 0;
  for (i = 0; i < n; i++) seen[nums[i]] = 1;
  for (v = 1; v <= n; v++) if (!seen[v]) out[on++] = v;
  return on;
}`
        }),
      makeSol("More optimal", "O(n)", "O(1) extra",
        "For each value x, negate nums[abs(x)-1]. Values whose slots stay positive never appeared. Same marking trick as Find All Duplicates.",
        {
          javascript: `function findDisappearedNumbers(nums) {
  for (let i = 0; i < nums.length; i++) {
    const x = nums[i] < 0 ? -nums[i] : nums[i];
    const slot = x - 1;
    if (nums[slot] > 0) nums[slot] = -nums[slot];
  }
  const out = [];
  for (let i = 0; i < nums.length; i++) if (nums[i] > 0) out.push(i + 1);
  return out;
}`,
          python: `def findDisappearedNumbers(nums):
  for x in nums:
    slot = abs(x) - 1
    if nums[slot] > 0:
      nums[slot] = -nums[slot]
  return [i + 1 for i in range(len(nums)) if nums[i] > 0]`,
          java: `import java.util.*;
class Solution {
  public List<Integer> findDisappearedNumbers(int[] nums) {
    for (int x : nums) {
      int slot = Math.abs(x) - 1;
      if (nums[slot] > 0) nums[slot] = -nums[slot];
    }
    List<Integer> out = new ArrayList<Integer>();
    for (int i = 0; i < nums.length; i++) if (nums[i] > 0) out.add(i + 1);
    return out;
  }
}`,
          cpp: `vector<int> findDisappearedNumbers(vector<int>& nums) {
  for (int x : nums) {
    int slot = abs(x) - 1;
    if (nums[slot] > 0) nums[slot] = -nums[slot];
  }
  vector<int> out;
  for (int i = 0; i < (int)nums.size(); i++) if (nums[i] > 0) out.push_back(i + 1);
  return out;
}`,
          c: `int findDisappearedMark(int* nums, int n, int* out) {
  int i, on = 0;
  for (i = 0; i < n; i++) {
    int x = nums[i] < 0 ? -nums[i] : nums[i];
    int slot = x - 1;
    if (nums[slot] > 0) nums[slot] = -nums[slot];
  }
  for (i = 0; i < n; i++) if (nums[i] > 0) out[on++] = i + 1;
  return on;
}`
        })
    ]
  };
}

function q33() {
  return {
    id: 33,
    level: "intermediate",
    q: "Rotate Image",
    ask: "Amazon · Google · Microsoft · Apple",
    links: [lc("rotate-image"), gfgProblem("rotate-by-90-degree-1587115621")],
    a: "Rotate an n by n matrix 90 degrees clockwise, in place.\n\nExample: [[1,2,3],[4,5,6],[7,8,9]] becomes [[7,4,1],[8,5,2],[9,6,3]].\n\nBrute writes into a new matrix. Optimal transposes then reverses each row. More optimal rotates 4-cycles on each layer so you never allocate n² extra cells.",
    solutions: [
      makeSol("Brute", "O(n²)", "O(n²)",
        "new[c][n-1-r] = old[r][c]. Copy back. Clear picture, extra matrix.",
        {
          javascript: `function rotate(matrix) {
  const n = matrix.length;
  const neu = Array.from({ length: n }, function () { return Array(n); });
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) neu[c][n - 1 - r] = matrix[r][c];
  }
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) matrix[r][c] = neu[r][c];
  }
  return matrix;
}`,
          python: `def rotate(matrix):
  n = len(matrix)
  neu = [[0] * n for _ in range(n)]
  for r in range(n):
    for c in range(n):
      neu[c][n - 1 - r] = matrix[r][c]
  for r in range(n):
    for c in range(n):
      matrix[r][c] = neu[r][c]
  return matrix`,
          java: `class Solution {
  public void rotate(int[][] matrix) {
    int n = matrix.length;
    int[][] neu = new int[n][n];
    for (int r = 0; r < n; r++)
      for (int c = 0; c < n; c++) neu[c][n - 1 - r] = matrix[r][c];
    for (int r = 0; r < n; r++)
      for (int c = 0; c < n; c++) matrix[r][c] = neu[r][c];
  }
}`,
          cpp: `void rotate(vector<vector<int>>& matrix) {
  int n = (int)matrix.size();
  vector<vector<int>> neu(n, vector<int>(n));
  for (int r = 0; r < n; r++)
    for (int c = 0; c < n; c++) neu[c][n - 1 - r] = matrix[r][c];
  matrix = neu;
}`,
          c: `void rotate(int n, int matrix[][16]) {
  int neu[16][16];
  int r, c;
  for (r = 0; r < n; r++)
    for (c = 0; c < n; c++) neu[c][n - 1 - r] = matrix[r][c];
  for (r = 0; r < n; r++)
    for (c = 0; c < n; c++) matrix[r][c] = neu[r][c];
}`
        }),
      makeSol("Optimal", "O(n²)", "O(1)",
        "Transpose (swap across the diagonal) then reverse each row. Two easy passes, in place.",
        {
          javascript: `function rotate(matrix) {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const t = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = t;
    }
  }
  for (let i = 0; i < n; i++) {
    let L = 0, R = n - 1;
    while (L < R) {
      const t = matrix[i][L];
      matrix[i][L] = matrix[i][R];
      matrix[i][R] = t;
      L++;
      R--;
    }
  }
  return matrix;
}`,
          python: `def rotate(matrix):
  n = len(matrix)
  for i in range(n):
    for j in range(i + 1, n):
      matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
  for i in range(n):
    L, R = 0, n - 1
    while L < R:
      matrix[i][L], matrix[i][R] = matrix[i][R], matrix[i][L]
      L += 1
      R -= 1
  return matrix`,
          java: `class Solution {
  public void rotate(int[][] matrix) {
    int n = matrix.length;
    for (int i = 0; i < n; i++)
      for (int j = i + 1; j < n; j++) {
        int t = matrix[i][j]; matrix[i][j] = matrix[j][i]; matrix[j][i] = t;
      }
    for (int i = 0; i < n; i++) {
      int L = 0, R = n - 1;
      while (L < R) {
        int t = matrix[i][L]; matrix[i][L] = matrix[i][R]; matrix[i][R] = t;
        L++; R--;
      }
    }
  }
}`,
          cpp: `void rotate(vector<vector<int>>& matrix) {
  int n = (int)matrix.size();
  for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++) swap(matrix[i][j], matrix[j][i]);
  for (int i = 0; i < n; i++) reverse(matrix[i].begin(), matrix[i].end());
}`,
          c: `void rotate(int n, int matrix[][16]) {
  int i, j, L, R, t;
  for (i = 0; i < n; i++)
    for (j = i + 1; j < n; j++) {
      t = matrix[i][j]; matrix[i][j] = matrix[j][i]; matrix[j][i] = t;
    }
  for (i = 0; i < n; i++) {
    L = 0; R = n - 1;
    while (L < R) {
      t = matrix[i][L]; matrix[i][L] = matrix[i][R]; matrix[i][R] = t;
      L++; R--;
    }
  }
}`
        }),
      makeSol("More optimal", "O(n²)", "O(1)",
        "Layer by layer. For each offset, rotate the four cells of the cycle in one temp. Same work, no transpose helper. Nice to draw on a whiteboard.",
        {
          javascript: `function rotate(matrix) {
  const n = matrix.length;
  for (let layer = 0; layer < (n >> 1); layer++) {
    const last = n - 1 - layer;
    for (let i = 0; i < last - layer; i++) {
      const top = matrix[layer][layer + i];
      matrix[layer][layer + i] = matrix[last - i][layer];
      matrix[last - i][layer] = matrix[last][last - i];
      matrix[last][last - i] = matrix[layer + i][last];
      matrix[layer + i][last] = top;
    }
  }
  return matrix;
}`,
          python: `def rotate(matrix):
  n = len(matrix)
  for layer in range(n // 2):
    last = n - 1 - layer
    for i in range(last - layer):
      top = matrix[layer][layer + i]
      matrix[layer][layer + i] = matrix[last - i][layer]
      matrix[last - i][layer] = matrix[last][last - i]
      matrix[last][last - i] = matrix[layer + i][last]
      matrix[layer + i][last] = top
  return matrix`,
          java: `class Solution {
  public void rotate(int[][] matrix) {
    int n = matrix.length;
    for (int layer = 0; layer < n / 2; layer++) {
      int last = n - 1 - layer;
      for (int i = 0; i < last - layer; i++) {
        int top = matrix[layer][layer + i];
        matrix[layer][layer + i] = matrix[last - i][layer];
        matrix[last - i][layer] = matrix[last][last - i];
        matrix[last][last - i] = matrix[layer + i][last];
        matrix[layer + i][last] = top;
      }
    }
  }
}`,
          cpp: `void rotate(vector<vector<int>>& matrix) {
  int n = (int)matrix.size();
  for (int layer = 0; layer < n / 2; layer++) {
    int last = n - 1 - layer;
    for (int i = 0; i < last - layer; i++) {
      int top = matrix[layer][layer + i];
      matrix[layer][layer + i] = matrix[last - i][layer];
      matrix[last - i][layer] = matrix[last][last - i];
      matrix[last][last - i] = matrix[layer + i][last];
      matrix[layer + i][last] = top;
    }
  }
}`,
          c: `void rotateCycles(int n, int matrix[][16]) {
  int layer, i, last, top;
  for (layer = 0; layer < n / 2; layer++) {
    last = n - 1 - layer;
    for (i = 0; i < last - layer; i++) {
      top = matrix[layer][layer + i];
      matrix[layer][layer + i] = matrix[last - i][layer];
      matrix[last - i][layer] = matrix[last][last - i];
      matrix[last][last - i] = matrix[layer + i][last];
      matrix[layer + i][last] = top;
    }
  }
}`
        })
    ]
  };
}

function q34() {
  return {
    id: 34,
    level: "intermediate",
    q: "Valid Sudoku",
    ask: "Amazon · Apple · Google · Microsoft",
    links: [lc("valid-sudoku"), gfgProblem("is-sudoku-valid4825")],
    a: "A 9 by 9 board of digits and '.'. Return true if every filled row, column, and 3 by 3 box has no duplicate digit. Empty cells are ignored. The board does not have to be a completed puzzle.\n\nExample: a standard valid (partial) grid returns true. Two 8s in the same box returns false.\n\nBrute, for each filled cell, rescans its row, column, and box. Optimal uses 27 sets. More optimal packs the same idea into bitmasks.",
    solutions: [
      makeSol("Brute", "O(1) for 9x9", "O(1)",
        "For every filled cell, walk its row, column, and 3x3 box looking for the same digit elsewhere. On a 9x9 this is constant, but the nested scans are noisy.",
        {
          javascript: `function isValidSudoku(board) {
  function ok(r, c, d) {
    for (let i = 0; i < 9; i++) {
      if (i !== c && board[r][i] === d) return false;
      if (i !== r && board[i][c] === d) return false;
    }
    const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const rr = br + i, cc = bc + j;
        if ((rr !== r || cc !== c) && board[rr][cc] === d) return false;
      }
    }
    return true;
  }
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === ".") continue;
      if (!ok(r, c, board[r][c])) return false;
    }
  }
  return true;
}`,
          python: `def isValidSudoku(board):
  def ok(r, c, d):
    for i in range(9):
      if i != c and board[r][i] == d:
        return False
      if i != r and board[i][c] == d:
        return False
    br, bc = (r // 3) * 3, (c // 3) * 3
    for i in range(3):
      for j in range(3):
        rr, cc = br + i, bc + j
        if (rr != r or cc != c) and board[rr][cc] == d:
          return False
    return True
  for r in range(9):
    for c in range(9):
      if board[r][c] == ".":
        continue
      if not ok(r, c, board[r][c]):
        return False
  return True`,
          java: `class Solution {
  boolean ok(char[][] board, int r, int c, char d) {
    for (int i = 0; i < 9; i++) {
      if (i != c && board[r][i] == d) return false;
      if (i != r && board[i][c] == d) return false;
    }
    int br = (r / 3) * 3, bc = (c / 3) * 3;
    for (int i = 0; i < 3; i++)
      for (int j = 0; j < 3; j++) {
        int rr = br + i, cc = bc + j;
        if ((rr != r || cc != c) && board[rr][cc] == d) return false;
      }
    return true;
  }
  public boolean isValidSudoku(char[][] board) {
    for (int r = 0; r < 9; r++)
      for (int c = 0; c < 9; c++)
        if (board[r][c] != '.' && !ok(board, r, c, board[r][c])) return false;
    return true;
  }
}`,
          cpp: `bool isValidSudoku(vector<vector<char>>& board) {
  auto ok = [&](int r, int c, char d) {
    for (int i = 0; i < 9; i++) {
      if (i != c && board[r][i] == d) return false;
      if (i != r && board[i][c] == d) return false;
    }
    int br = (r / 3) * 3, bc = (c / 3) * 3;
    for (int i = 0; i < 3; i++)
      for (int j = 0; j < 3; j++) {
        int rr = br + i, cc = bc + j;
        if ((rr != r || cc != c) && board[rr][cc] == d) return false;
      }
    return true;
  };
  for (int r = 0; r < 9; r++)
    for (int c = 0; c < 9; c++)
      if (board[r][c] != '.' && !ok(r, c, board[r][c])) return false;
  return true;
}`,
          c: `int okCell(char board[9][9], int r, int c, char d) {
  int i, j, br, bc;
  for (i = 0; i < 9; i++) {
    if (i != c && board[r][i] == d) return 0;
    if (i != r && board[i][c] == d) return 0;
  }
  br = (r / 3) * 3; bc = (c / 3) * 3;
  for (i = 0; i < 3; i++)
    for (j = 0; j < 3; j++) {
      int rr = br + i, cc = bc + j;
      if ((rr != r || cc != c) && board[rr][cc] == d) return 0;
    }
  return 1;
}`
        }),
      makeSol("Optimal", "O(1)", "O(1)",
        "Nine sets for rows, nine for columns, nine for boxes. Box id is (r/3)*3 + c/3. Fail on the first repeat.",
        {
          javascript: `function isValidSudoku(board) {
    const row = Array.from({ length: 9 }, function () { return Object.create(null); });
    const col = Array.from({ length: 9 }, function () { return Object.create(null); });
    const box = Array.from({ length: 9 }, function () { return Object.create(null); });
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const d = board[r][c];
        if (d === ".") continue;
        const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
        if (row[r][d] || col[c][d] || box[b][d]) return false;
        row[r][d] = col[c][d] = box[b][d] = true;
      }
    }
    return true;
  }`,
          python: `def isValidSudoku(board):
  row = [set() for _ in range(9)]
  col = [set() for _ in range(9)]
  box = [set() for _ in range(9)]
  for r in range(9):
    for c in range(9):
      d = board[r][c]
      if d == ".":
        continue
      b = (r // 3) * 3 + (c // 3)
      if d in row[r] or d in col[c] or d in box[b]:
        return False
      row[r].add(d)
      col[c].add(d)
      box[b].add(d)
  return True`,
          java: `import java.util.*;
class Solution {
  public boolean isValidSudoku(char[][] board) {
    Set<Character>[] row = new HashSet[9];
    Set<Character>[] col = new HashSet[9];
    Set<Character>[] box = new HashSet[9];
    for (int i = 0; i < 9; i++) {
      row[i] = new HashSet<Character>();
      col[i] = new HashSet<Character>();
      box[i] = new HashSet<Character>();
    }
    for (int r = 0; r < 9; r++) {
      for (int c = 0; c < 9; c++) {
        char d = board[r][c];
        if (d == '.') continue;
        int b = (r / 3) * 3 + (c / 3);
        if (!row[r].add(d) || !col[c].add(d) || !box[b].add(d)) return false;
      }
    }
    return true;
  }
}`,
          cpp: `bool isValidSudoku(vector<vector<char>>& board) {
  vector<unordered_set<char>> row(9), col(9), box(9);
  for (int r = 0; r < 9; r++) {
    for (int c = 0; c < 9; c++) {
      char d = board[r][c];
      if (d == '.') continue;
      int b = (r / 3) * 3 + (c / 3);
      if (row[r].count(d) || col[c].count(d) || box[b].count(d)) return false;
      row[r].insert(d); col[c].insert(d); box[b].insert(d);
    }
  }
  return true;
}`,
          c: `int isValidSudoku(char board[9][9]) {
  int row[9][10] = {0}, col[9][10] = {0}, box[9][10] = {0};
  int r, c;
  for (r = 0; r < 9; r++) {
    for (c = 0; c < 9; c++) {
      char d = board[r][c];
      int v, b;
      if (d == '.') continue;
      v = d - '0';
      b = (r / 3) * 3 + (c / 3);
      if (row[r][v] || col[c][v] || box[b][v]) return 0;
      row[r][v] = col[c][v] = box[b][v] = 1;
    }
  }
  return 1;
}`
        }),
      makeSol("More optimal", "O(1)", "O(1)",
        "Nine ints for rows, columns, boxes. Bit (1 << digit) marks a used number. A second hit on the same bit is a duplicate. Same logic, no hash sets.",
        {
          javascript: `function isValidSudoku(board) {
  const row = Array(9).fill(0);
  const col = Array(9).fill(0);
  const box = Array(9).fill(0);
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const ch = board[r][c];
      if (ch === ".") continue;
      const bit = 1 << (ch.charCodeAt(0) - 49);
      const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      if ((row[r] & bit) || (col[c] & bit) || (box[b] & bit)) return false;
      row[r] |= bit;
      col[c] |= bit;
      box[b] |= bit;
    }
  }
  return true;
}`,
          python: `def isValidSudoku(board):
  row = [0] * 9
  col = [0] * 9
  box = [0] * 9
  for r in range(9):
    for c in range(9):
      ch = board[r][c]
      if ch == ".":
        continue
      bit = 1 << (ord(ch) - 49)
      b = (r // 3) * 3 + (c // 3)
      if (row[r] & bit) or (col[c] & bit) or (box[b] & bit):
        return False
      row[r] |= bit
      col[c] |= bit
      box[b] |= bit
  return True`,
          java: `class Solution {
  public boolean isValidSudoku(char[][] board) {
    int[] row = new int[9], col = new int[9], box = new int[9];
    for (int r = 0; r < 9; r++) {
      for (int c = 0; c < 9; c++) {
        char ch = board[r][c];
        if (ch == '.') continue;
        int bit = 1 << (ch - '1');
        int b = (r / 3) * 3 + (c / 3);
        if ((row[r] & bit) != 0 || (col[c] & bit) != 0 || (box[b] & bit) != 0) return false;
        row[r] |= bit; col[c] |= bit; box[b] |= bit;
      }
    }
    return true;
  }
}`,
          cpp: `bool isValidSudoku(vector<vector<char>>& board) {
  int row[9] = {}, col[9] = {}, box[9] = {};
  for (int r = 0; r < 9; r++) {
    for (int c = 0; c < 9; c++) {
      char ch = board[r][c];
      if (ch == '.') continue;
      int bit = 1 << (ch - '1');
      int b = (r / 3) * 3 + (c / 3);
      if ((row[r] & bit) || (col[c] & bit) || (box[b] & bit)) return false;
      row[r] |= bit; col[c] |= bit; box[b] |= bit;
    }
  }
  return true;
}`,
          c: `int isValidSudokuBits(char board[9][9]) {
  int row[9] = {0}, col[9] = {0}, box[9] = {0};
  int r, c;
  for (r = 0; r < 9; r++) {
    for (c = 0; c < 9; c++) {
      char ch = board[r][c];
      int bit, b;
      if (ch == '.') continue;
      bit = 1 << (ch - '1');
      b = (r / 3) * 3 + (c / 3);
      if ((row[r] & bit) || (col[c] & bit) || (box[b] & bit)) return 0;
      row[r] |= bit; col[c] |= bit; box[b] |= bit;
    }
  }
  return 1;
}`
        })
    ]
  };
}

function q35() {
  return {
    id: 35,
    level: "intermediate",
    q: "Subarray Product Less Than K",
    ask: "Amazon · Google · Bloomberg",
    links: [lc("subarray-product-less-than-k"), gfgProblem("count-the-subarrays-having-product-less-than-k1708")],
    a: "Count contiguous subarrays whose product is strictly less than k. nums[i] >= 1.\n\nExample: nums = [10, 5, 2, 6], k = 100. Answer 8: [10], [5], [2], [6], [10,5], [5,2], [2,6], [5,2,6].\n\nBrute multiplies every subarray. Optimal nested loops that break when the running product hits k. More optimal is a sliding window: all-positive so you only shrink from the left.",
    solutions: [
      makeSol("Brute", "O(n²)", "O(1)",
        "For each L, grow R, multiply. Count when prod < k. Watch overflow in fixed-width ints; JS numbers are fine for the usual constraints.",
        {
          javascript: `function numSubarrayProductLessThanK(nums, k) {
  const n = nums.length;
  let c = 0;
  for (let i = 0; i < n; i++) {
    let p = 1;
    for (let j = i; j < n; j++) {
      p *= nums[j];
      if (p < k) c++;
      else break;
    }
  }
  return c;
}`,
          python: `def numSubarrayProductLessThanK(nums, k):
  n = len(nums)
  c = 0
  for i in range(n):
    p = 1
    for j in range(i, n):
      p *= nums[j]
      if p < k:
        c += 1
      else:
        break
  return c`,
          java: `class Solution {
  public int numSubarrayProductLessThanK(int[] nums, int k) {
    int n = nums.length, c = 0;
    for (int i = 0; i < n; i++) {
      long p = 1;
      for (int j = i; j < n; j++) {
        p *= nums[j];
        if (p < k) c++;
        else break;
      }
    }
    return c;
  }
}`,
          cpp: `int numSubarrayProductLessThanK(vector<int>& nums, int k) {
  int n = (int)nums.size(), c = 0;
  for (int i = 0; i < n; i++) {
    long long p = 1;
    for (int j = i; j < n; j++) {
      p *= nums[j];
      if (p < k) c++;
      else break;
    }
  }
  return c;
}`,
          c: `int numSubarrayProductLessThanK(int* nums, int n, int k) {
  int i, j, c = 0;
  for (i = 0; i < n; i++) {
    long long p = 1;
    for (j = i; j < n; j++) {
      p *= nums[j];
      if (p < k) c++;
      else break;
    }
  }
  return c;
}`
        }),
      makeSol("Optimal", "O(n²)", "O(1)",
        "Same nested loops, but this is already the best brute because products only grow (nums >= 1) so you can break. Still quadratic worst case when k is huge.",
        {
          javascript: `function numSubarrayProductLessThanK(nums, k) {
  if (k <= 1) return 0;
  let c = 0;
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    let p = 1;
    for (let j = i; j < n && p * nums[j] < k; j++) {
      p *= nums[j];
      c++;
    }
  }
  return c;
}`,
          python: `def numSubarrayProductLessThanK(nums, k):
  if k <= 1:
    return 0
  c = 0
  n = len(nums)
  for i in range(n):
    p = 1
    j = i
    while j < n and p * nums[j] < k:
      p *= nums[j]
      c += 1
      j += 1
  return c`,
          java: `class Solution {
  public int numSubarrayProductLessThanK(int[] nums, int k) {
    if (k <= 1) return 0;
    int c = 0, n = nums.length;
    for (int i = 0; i < n; i++) {
      long p = 1;
      for (int j = i; j < n && p * nums[j] < k; j++) {
        p *= nums[j];
        c++;
      }
    }
    return c;
  }
}`,
          cpp: `int numSubarrayProductLessThanK(vector<int>& nums, int k) {
  if (k <= 1) return 0;
  int c = 0, n = (int)nums.size();
  for (int i = 0; i < n; i++) {
    long long p = 1;
    for (int j = i; j < n && p * nums[j] < k; j++) {
      p *= nums[j];
      c++;
    }
  }
  return c;
}`,
          c: `int numSubarrayProductLessThanK(int* nums, int n, int k) {
  int i, j, c = 0;
  if (k <= 1) return 0;
  for (i = 0; i < n; i++) {
    long long p = 1;
    for (j = i; j < n && p * nums[j] < k; j++) {
      p *= nums[j];
      c++;
    }
  }
  return c;
}`
        }),
      makeSol("More optimal", "O(n)", "O(1)",
        "Window [left, right]. Multiply nums[right]. While product >= k, divide nums[left] and left++. Every new right adds (right-left+1) subarrays that end at right. If k <= 1 the answer is 0.",
        {
          javascript: `function numSubarrayProductLessThanK(nums, k) {
  if (k <= 1) return 0;
  let prod = 1, left = 0, c = 0;
  for (let right = 0; right < nums.length; right++) {
    prod *= nums[right];
    while (prod >= k) {
      prod /= nums[left];
      left++;
    }
    c += right - left + 1;
  }
  return c;
}`,
          python: `def numSubarrayProductLessThanK(nums, k):
  if k <= 1:
    return 0
  prod = 1
  left = 0
  c = 0
  for right, x in enumerate(nums):
    prod *= x
    while prod >= k:
      prod //= nums[left]
      left += 1
    c += right - left + 1
  return c`,
          java: `class Solution {
  public int numSubarrayProductLessThanK(int[] nums, int k) {
    if (k <= 1) return 0;
    int prod = 1, left = 0, c = 0;
    for (int right = 0; right < nums.length; right++) {
      prod *= nums[right];
      while (prod >= k) { prod /= nums[left]; left++; }
      c += right - left + 1;
    }
    return c;
  }
}`,
          cpp: `int numSubarrayProductLessThanK(vector<int>& nums, int k) {
  if (k <= 1) return 0;
  int prod = 1, left = 0, c = 0;
  for (int right = 0; right < (int)nums.size(); right++) {
    prod *= nums[right];
    while (prod >= k) { prod /= nums[left]; left++; }
    c += right - left + 1;
  }
  return c;
}`,
          c: `int numSubarrayProductLessThanK(int* nums, int n, int k) {
  int prod = 1, left = 0, c = 0, right;
  if (k <= 1) return 0;
  for (right = 0; right < n; right++) {
    prod *= nums[right];
    while (prod >= k) { prod /= nums[left]; left++; }
    c += right - left + 1;
  }
  return c;
}`
        })
    ]
  };
}

function q36() {
  return {
    id: 36,
    level: "intermediate",
    q: "Gas Station",
    ask: "Amazon · Google · Microsoft · Bloomberg",
    links: [lc("gas-station"), gfgProblem("circular-tour-1587115620")],
    a: "n stations on a circle. gas[i] is fuel you get, cost[i] is fuel to reach i+1. Start with an empty tank. Return the unique start index that lets you complete one loop, or -1.\n\nExample: gas = [1, 2, 3, 4, 5], cost = [3, 4, 5, 1, 2]. Start at index 3.\n\nBrute tries every start and walks the circle. Optimal first checks total gas >= total cost, then still tries starts. More optimal is one pass: if the tank goes negative, the next start is i+1.",
    solutions: [
      makeSol("Brute", "O(n²)", "O(1)",
        "From each start, simulate the circle. Fail when the tank goes negative. Return the first start that finishes n steps.",
        {
          javascript: `function canCompleteCircuit(gas, cost) {
  const n = gas.length;
  for (let start = 0; start < n; start++) {
    let tank = 0, ok = true;
    for (let step = 0; step < n; step++) {
      const i = (start + step) % n;
      tank += gas[i] - cost[i];
      if (tank < 0) { ok = false; break; }
    }
    if (ok) return start;
  }
  return -1;
}`,
          python: `def canCompleteCircuit(gas, cost):
  n = len(gas)
  for start in range(n):
    tank = 0
    ok = True
    for step in range(n):
      i = (start + step) % n
      tank += gas[i] - cost[i]
      if tank < 0:
        ok = False
        break
    if ok:
      return start
  return -1`,
          java: `class Solution {
  public int canCompleteCircuit(int[] gas, int[] cost) {
    int n = gas.length;
    for (int start = 0; start < n; start++) {
      int tank = 0;
      boolean ok = true;
      for (int step = 0; step < n; step++) {
        int i = (start + step) % n;
        tank += gas[i] - cost[i];
        if (tank < 0) { ok = false; break; }
      }
      if (ok) return start;
    }
    return -1;
  }
}`,
          cpp: `int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
  int n = (int)gas.size();
  for (int start = 0; start < n; start++) {
    int tank = 0;
    bool ok = true;
    for (int step = 0; step < n; step++) {
      int i = (start + step) % n;
      tank += gas[i] - cost[i];
      if (tank < 0) { ok = false; break; }
    }
    if (ok) return start;
  }
  return -1;
}`,
          c: `int canCompleteCircuit(int* gas, int n, int* cost) {
  int start, step;
  for (start = 0; start < n; start++) {
    int tank = 0, ok = 1;
    for (step = 0; step < n; step++) {
      int i = (start + step) % n;
      tank += gas[i] - cost[i];
      if (tank < 0) { ok = 0; break; }
    }
    if (ok) return start;
  }
  return -1;
}`
        }),
      makeSol("Optimal", "O(n)", "O(1)",
        "If the total of gas[i]-cost[i] is negative, no start works. Otherwise try starts in order but skip a failed prefix using a leftover tank. Still a linear check plus a second idea.",
        {
          javascript: `function canCompleteCircuit(gas, cost) {
  const n = gas.length;
  let total = 0;
  for (let i = 0; i < n; i++) total += gas[i] - cost[i];
  if (total < 0) return -1;
  for (let start = 0; start < n; start++) {
    let tank = 0, ok = true;
    for (let step = 0; step < n; step++) {
      const i = (start + step) % n;
      tank += gas[i] - cost[i];
      if (tank < 0) { ok = false; break; }
    }
    if (ok) return start;
  }
  return -1;
}`,
          python: `def canCompleteCircuit(gas, cost):
  n = len(gas)
  if sum(gas[i] - cost[i] for i in range(n)) < 0:
    return -1
  for start in range(n):
    tank = 0
    ok = True
    for step in range(n):
      i = (start + step) % n
      tank += gas[i] - cost[i]
      if tank < 0:
        ok = False
        break
    if ok:
      return start
  return -1`,
          java: `class Solution {
  public int canCompleteCircuit(int[] gas, int[] cost) {
    int n = gas.length, total = 0;
    for (int i = 0; i < n; i++) total += gas[i] - cost[i];
    if (total < 0) return -1;
    for (int start = 0; start < n; start++) {
      int tank = 0;
      boolean ok = true;
      for (int step = 0; step < n; step++) {
        int i = (start + step) % n;
        tank += gas[i] - cost[i];
        if (tank < 0) { ok = false; break; }
      }
      if (ok) return start;
    }
    return -1;
  }
}`,
          cpp: `int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
  int n = (int)gas.size(), total = 0;
  for (int i = 0; i < n; i++) total += gas[i] - cost[i];
  if (total < 0) return -1;
  for (int start = 0; start < n; start++) {
    int tank = 0;
    bool ok = true;
    for (int step = 0; step < n; step++) {
      int i = (start + step) % n;
      tank += gas[i] - cost[i];
      if (tank < 0) { ok = false; break; }
    }
    if (ok) return start;
  }
  return -1;
}`,
          c: `int canCompleteCircuit(int* gas, int n, int* cost) {
  int i, start, step, total = 0;
  for (i = 0; i < n; i++) total += gas[i] - cost[i];
  if (total < 0) return -1;
  for (start = 0; start < n; start++) {
    int tank = 0, ok = 1;
    for (step = 0; step < n; step++) {
      int j = (start + step) % n;
      tank += gas[j] - cost[j];
      if (tank < 0) { ok = 0; break; }
    }
    if (ok) return start;
  }
  return -1;
}`
        }),
      makeSol("More optimal", "O(n)", "O(1)",
        "One pass. tank is the fuel since the current start. If tank drops below 0, no start in [oldStart, i] works, so start = i+1 and tank = 0. If the total is negative, return -1. Unique start is guaranteed.",
        {
          javascript: `function canCompleteCircuit(gas, cost) {
  let total = 0, tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    const d = gas[i] - cost[i];
    total += d;
    tank += d;
    if (tank < 0) {
      start = i + 1;
      tank = 0;
    }
  }
  return total < 0 ? -1 : start;
}`,
          python: `def canCompleteCircuit(gas, cost):
  total = tank = start = 0
  for i in range(len(gas)):
    d = gas[i] - cost[i]
    total += d
    tank += d
    if tank < 0:
      start = i + 1
      tank = 0
  return -1 if total < 0 else start`,
          java: `class Solution {
  public int canCompleteCircuit(int[] gas, int[] cost) {
    int total = 0, tank = 0, start = 0;
    for (int i = 0; i < gas.length; i++) {
      int d = gas[i] - cost[i];
      total += d;
      tank += d;
      if (tank < 0) { start = i + 1; tank = 0; }
    }
    return total < 0 ? -1 : start;
  }
}`,
          cpp: `int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
  int total = 0, tank = 0, start = 0;
  for (int i = 0; i < (int)gas.size(); i++) {
    int d = gas[i] - cost[i];
    total += d;
    tank += d;
    if (tank < 0) { start = i + 1; tank = 0; }
  }
  return total < 0 ? -1 : start;
}`,
          c: `int canCompleteCircuit(int* gas, int n, int* cost) {
  int total = 0, tank = 0, start = 0, i;
  for (i = 0; i < n; i++) {
    int d = gas[i] - cost[i];
    total += d;
    tank += d;
    if (tank < 0) { start = i + 1; tank = 0; }
  }
  return total < 0 ? -1 : start;
}`
        })
    ]
  };
}

module.exports = [q32(), q33(), q34(), q35(), q36()];
