const LC = (s) => ({ name: "LeetCode", url: "https://leetcode.com/problems/" + s + "/" });
const GFG = (s) => ({ name: "GFG", url: "https://www.geeksforgeeks.org/problems/" + s + "/1" });

module.exports = [
  {
    id: 13,
    level: "intermediate",
    q: "Search a 2D Matrix II",
    ask: "Amazon · Google · Microsoft · Apple",
    links: [LC("search-a-2d-matrix-ii"), GFG("search-in-a-matrix")],
    a: "Each row is sorted left to right. Each column is sorted top to bottom. The next row does NOT have to start after this row. Return whether target exists.\n\nTiny example: [[1, 4, 7], [2, 5, 8], [3, 6, 9]], target 5 -> true. Target 10 -> false. Notice 2 sits under 1, so you cannot flatten the grid into one sorted list.\n\nBinary search each row is O(r log c). The staircase from the top-right (or bottom-left) is O(r + c): too big, move left; too small, move down.\n\nOpen Brute, Optimal, and More optimal for a scan, per-row binary search, and the staircase walk.",
    solutions: [
      {
        name: "Brute",
        time: "O(rc)",
        space: "O(1)",
        why: "Visit every cell. Correct, ignores both sorted axes.",
        codes: {
          javascript: `function searchMatrix(matrix, target) {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[0].length; c++) {
      if (matrix[r][c] === target) return true;
    }
  }
  return false;
}`,
          python: `def searchMatrix(matrix, target):
  for row in matrix:
    if target in row:
      return True
  return False`,
          java: `class Solution {
  public boolean searchMatrix(int[][] matrix, int target) {
    for (int[] row : matrix) for (int v : row) if (v == target) return true;
    return false;
  }
}`,
          cpp: `class Solution {
public:
  bool searchMatrix(vector<vector<int>>& matrix, int target) {
    for (auto& row : matrix) for (int v : row) if (v == target) return true;
    return false;
  }
};`,
          c: `int searchMatrix(int** matrix, int rows, int cols, int target) {
  for (int r = 0; r < rows; r++)
    for (int c = 0; c < cols; c++)
      if (matrix[r][c] == target) return 1;
  return 0;
}`
        }
      },
      {
        name: "Optimal",
        time: "O(r log c)",
        space: "O(1)",
        why: "Each row is sorted, so binary search that row. Skip a row whose first cell is already larger than target or whose last cell is smaller. Good when there are few rows.",
        codes: {
          javascript: `function searchMatrix(matrix, target) {
  const cols = matrix[0].length;
  for (let r = 0; r < matrix.length; r++) {
    if (matrix[r][0] > target || matrix[r][cols - 1] < target) continue;
    let lo = 0, hi = cols - 1;
    while (lo <= hi) {
      const mid = lo + ((hi - lo) >> 1);
      if (matrix[r][mid] === target) return true;
      if (matrix[r][mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return false;
}`,
          python: `def searchMatrix(matrix, target):
  cols = len(matrix[0])
  for row in matrix:
    if row[0] > target or row[-1] < target:
      continue
    lo, hi = 0, cols - 1
    while lo <= hi:
      mid = lo + ((hi - lo) >> 1)
      if row[mid] == target:
        return True
      if row[mid] < target:
        lo = mid + 1
      else:
        hi = mid - 1
  return False`,
          java: `class Solution {
  public boolean searchMatrix(int[][] matrix, int target) {
    int cols = matrix[0].length;
    for (int[] row : matrix) {
      if (row[0] > target || row[cols - 1] < target) continue;
      int lo = 0, hi = cols - 1;
      while (lo <= hi) {
        int mid = lo + ((hi - lo) >> 1);
        if (row[mid] == target) return true;
        if (row[mid] < target) lo = mid + 1;
        else hi = mid - 1;
      }
    }
    return false;
  }
}`,
          cpp: `class Solution {
public:
  bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int cols = (int)matrix[0].size();
    for (auto& row : matrix) {
      if (row[0] > target || row[cols - 1] < target) continue;
      int lo = 0, hi = cols - 1;
      while (lo <= hi) {
        int mid = lo + ((hi - lo) >> 1);
        if (row[mid] == target) return true;
        if (row[mid] < target) lo = mid + 1;
        else hi = mid - 1;
      }
    }
    return false;
  }
};`,
          c: `int searchMatrix(int** matrix, int rows, int cols, int target) {
  for (int r = 0; r < rows; r++) {
    if (matrix[r][0] > target || matrix[r][cols - 1] < target) continue;
    int lo = 0, hi = cols - 1;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (matrix[r][mid] == target) return 1;
      if (matrix[r][mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return 0;
}`
        }
      },
      {
        name: "More optimal",
        time: "O(r + c)",
        space: "O(1)",
        why: "Start at top-right. The cell is the largest in its row prefix and the smallest in its column suffix. Larger than target: nothing in this column below can be smaller in a useful way — move left. Smaller: move down. Each step drops a row or a column.",
        codes: {
          javascript: `function searchMatrix(matrix, target) {
  let r = 0, c = matrix[0].length - 1;
  while (r < matrix.length && c >= 0) {
    if (matrix[r][c] === target) return true;
    if (matrix[r][c] > target) c--;
    else r++;
  }
  return false;
}`,
          python: `def searchMatrix(matrix, target):
  r, c = 0, len(matrix[0]) - 1
  while r < len(matrix) and c >= 0:
    if matrix[r][c] == target:
      return True
    if matrix[r][c] > target:
      c -= 1
    else:
      r += 1
  return False`,
          java: `class Solution {
  public boolean searchMatrix(int[][] matrix, int target) {
    int r = 0, c = matrix[0].length - 1;
    while (r < matrix.length && c >= 0) {
      if (matrix[r][c] == target) return true;
      if (matrix[r][c] > target) c--;
      else r++;
    }
    return false;
  }
}`,
          cpp: `class Solution {
public:
  bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int r = 0, c = (int)matrix[0].size() - 1;
    while (r < (int)matrix.size() && c >= 0) {
      if (matrix[r][c] == target) return true;
      if (matrix[r][c] > target) c--;
      else r++;
    }
    return false;
  }
};`,
          c: `int searchMatrix(int** matrix, int rows, int cols, int target) {
  int r = 0, c = cols - 1;
  while (r < rows && c >= 0) {
    if (matrix[r][c] == target) return 1;
    if (matrix[r][c] > target) c--;
    else r++;
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
    q: "Find K Closest Elements",
    ask: "Google · Facebook · Amazon · LinkedIn",
    links: [LC("find-k-closest-elements"), GFG("find-k-closest-elements")],
    a: "arr is sorted. Return k values closest to x, in ascending order. Tie: pick the smaller value.\n\nTiny example: arr = [1, 2, 3, 4, 5], k = 4, x = 3 -> [1, 2, 3, 4]. x = -1 -> [1, 2, 3, 4].\n\nSorting by distance is easy but O(n log n). Sliding the window from both ends is O(n). Binary searching the left edge of a window of length k is O(log(n - k) + k).\n\nOpen Brute, Optimal, and More optimal for sort-by-distance, two pointers, and binary search on the window start.",
    solutions: [
      {
        name: "Brute",
        time: "O(n log n)",
        space: "O(n)",
        why: "Pair each value with its distance, sort by distance then by value, take k items, sort those k again so the answer is ascending. Heavy, but matches the tie rule clearly.",
        codes: {
          javascript: `function findClosestElements(arr, k, x) {
  const idx = [];
  for (let i = 0; i < arr.length; i++) idx.push(i);
  idx.sort(function (i, j) {
    const di = Math.abs(arr[i] - x), dj = Math.abs(arr[j] - x);
    if (di !== dj) return di - dj;
    return arr[i] - arr[j];
  });
  const pick = idx.slice(0, k).map(function (i) { return arr[i]; });
  pick.sort(function (a, b) { return a - b; });
  return pick;
}`,
          python: `def findClosestElements(arr, k, x):
  idx = list(range(len(arr)))
  idx.sort(key=lambda i: (abs(arr[i] - x), arr[i]))
  pick = sorted(arr[i] for i in idx[:k])
  return pick`,
          java: `import java.util.*;
class Solution {
  public List<Integer> findClosestElements(int[] arr, int k, int x) {
    Integer[] idx = new Integer[arr.length];
    for (int i = 0; i < arr.length; i++) idx[i] = i;
    Arrays.sort(idx, (i, j) -> {
      int di = Math.abs(arr[i] - x), dj = Math.abs(arr[j] - x);
      if (di != dj) return di - dj;
      return arr[i] - arr[j];
    });
    List<Integer> pick = new ArrayList<Integer>();
    for (int t = 0; t < k; t++) pick.add(arr[idx[t]]);
    Collections.sort(pick);
    return pick;
  }
}`,
          cpp: `class Solution {
public:
  vector<int> findClosestElements(vector<int>& arr, int k, int x) {
    vector<int> idx(arr.size());
    for (int i = 0; i < (int)arr.size(); i++) idx[i] = i;
    sort(idx.begin(), idx.end(), [&](int i, int j) {
      int di = abs(arr[i] - x), dj = abs(arr[j] - x);
      if (di != dj) return di < dj;
      return arr[i] < arr[j];
    });
    vector<int> pick;
    for (int t = 0; t < k; t++) pick.push_back(arr[idx[t]]);
    sort(pick.begin(), pick.end());
    return pick;
  }
};`,
          c: `#include <stdlib.h>
typedef struct { int val; int dist; } Pair;
int cmpPair(const void* a, const void* b) {
  const Pair* p = (const Pair*)a, *q = (const Pair*)b;
  if (p->dist != q->dist) return p->dist - q->dist;
  return p->val - q->val;
}
int cmpInt(const void* a, const void* b) { return *(const int*)a - *(const int*)b; }
void findClosestElements(int* arr, int n, int k, int x, int* out) {
  Pair* p = (Pair*)malloc(sizeof(Pair) * n);
  for (int i = 0; i < n; i++) { p[i].val = arr[i]; p[i].dist = arr[i] > x ? arr[i] - x : x - arr[i]; }
  qsort(p, n, sizeof(Pair), cmpPair);
  for (int i = 0; i < k; i++) out[i] = p[i].val;
  qsort(out, k, sizeof(int), cmpInt);
  free(p);
}`
        }
      },
      {
        name: "Optimal",
        time: "O(n - k)",
        space: "O(k)",
        why: "The answer is a contiguous window of length k (the array is sorted). Shrink from both ends until the window is size k. Drop the farther end; on a tie drop the right (larger) value.",
        codes: {
          javascript: `function findClosestElements(arr, k, x) {
  let lo = 0, hi = arr.length - 1;
  while (hi - lo + 1 > k) {
    if (Math.abs(arr[lo] - x) > Math.abs(arr[hi] - x)) lo++;
    else hi--;
  }
  return arr.slice(lo, hi + 1);
}`,
          python: `def findClosestElements(arr, k, x):
  lo, hi = 0, len(arr) - 1
  while hi - lo + 1 > k:
    if abs(arr[lo] - x) > abs(arr[hi] - x):
      lo += 1
    else:
      hi -= 1
  return arr[lo:hi + 1]`,
          java: `import java.util.*;
class Solution {
  public List<Integer> findClosestElements(int[] arr, int k, int x) {
    int lo = 0, hi = arr.length - 1;
    while (hi - lo + 1 > k) {
      if (Math.abs(arr[lo] - x) > Math.abs(arr[hi] - x)) lo++;
      else hi--;
    }
    List<Integer> ans = new ArrayList<Integer>();
    for (int i = lo; i <= hi; i++) ans.add(arr[i]);
    return ans;
  }
}`,
          cpp: `class Solution {
public:
  vector<int> findClosestElements(vector<int>& arr, int k, int x) {
    int lo = 0, hi = (int)arr.size() - 1;
    while (hi - lo + 1 > k) {
      if (abs(arr[lo] - x) > abs(arr[hi] - x)) lo++;
      else hi--;
    }
    return vector<int>(arr.begin() + lo, arr.begin() + hi + 1);
  }
};`,
          c: `void findClosestElements(int* arr, int n, int k, int x, int* out) {
  int lo = 0, hi = n - 1;
  while (hi - lo + 1 > k) {
    int dl = arr[lo] > x ? arr[lo] - x : x - arr[lo];
    int dr = arr[hi] > x ? arr[hi] - x : x - arr[hi];
    if (dl > dr) lo++;
    else hi--;
  }
  for (int i = 0; i < k; i++) out[i] = arr[lo + i];
}`
        }
      },
      {
        name: "More optimal",
        time: "O(log(n - k) + k)",
        space: "O(k)",
        why: "Binary search the left index of the k-window in [0, n-k]. If x is closer to arr[mid+k] than to arr[mid], the window should start further right. Overflow-safe mid. Copy k values at the end.",
        codes: {
          javascript: `function findClosestElements(arr, k, x) {
  let lo = 0, hi = arr.length - k;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (x - arr[mid] > arr[mid + k] - x) lo = mid + 1;
    else hi = mid;
  }
  return arr.slice(lo, lo + k);
}`,
          python: `def findClosestElements(arr, k, x):
  lo, hi = 0, len(arr) - k
  while lo < hi:
    mid = lo + ((hi - lo) >> 1)
    if x - arr[mid] > arr[mid + k] - x:
      lo = mid + 1
    else:
      hi = mid
  return arr[lo:lo + k]`,
          java: `import java.util.*;
class Solution {
  public List<Integer> findClosestElements(int[] arr, int k, int x) {
    int lo = 0, hi = arr.length - k;
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (x - arr[mid] > arr[mid + k] - x) lo = mid + 1;
      else hi = mid;
    }
    List<Integer> ans = new ArrayList<Integer>();
    for (int i = lo; i < lo + k; i++) ans.add(arr[i]);
    return ans;
  }
}`,
          cpp: `class Solution {
public:
  vector<int> findClosestElements(vector<int>& arr, int k, int x) {
    int lo = 0, hi = (int)arr.size() - k;
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (x - arr[mid] > arr[mid + k] - x) lo = mid + 1;
      else hi = mid;
    }
    return vector<int>(arr.begin() + lo, arr.begin() + lo + k);
  }
};`,
          c: `void findClosestElements(int* arr, int n, int k, int x, int* out) {
  int lo = 0, hi = n - k;
  while (lo < hi) {
    int mid = lo + ((hi - lo) >> 1);
    if (x - arr[mid] > arr[mid + k] - x) lo = mid + 1;
    else hi = mid;
  }
  for (int i = 0; i < k; i++) out[i] = arr[lo + i];
}`
        }
      }
    ]
  },
  {
    id: 15,
    level: "intermediate",
    q: "Time Based Key-Value Store",
    ask: "Google · Amazon · Lyft · Uber",
    links: [LC("time-based-key-value-store"), GFG("time-based-key-value-store")],
    a: "Design a map: set(key, value, timestamp) stores a value at a time. get(key, timestamp) returns the value with the largest time <= timestamp, or \"\" if none. Timestamps on set for one key are strictly increasing.\n\nTiny example: set(\"foo\", \"bar\", 1), get(\"foo\", 1) -> \"bar\". get(\"foo\", 3) -> \"bar\". set(\"foo\", \"bar2\", 4), get(\"foo\", 4) -> \"bar2\". get(\"foo\", 5) -> \"bar2\".\n\nEach key holds a sorted list of (time, value). get is a last-true binary search on time.\n\nOpen Brute, Optimal, and More optimal for a linear scan, binary search on the list, and a tighter upper-bound loop.",
    solutions: [
      {
        name: "Brute",
        time: "set O(1), get O(n)",
        space: "O(n)",
        why: "Append every set. On get, scan the whole list for that key and keep the latest time that is still <= timestamp. Fine until a key has many versions.",
        codes: {
          javascript: `function TimeMap() {
  this.map = {};
}
TimeMap.prototype.set = function (key, value, timestamp) {
  if (!this.map[key]) this.map[key] = [];
  this.map[key].push([timestamp, value]);
};
TimeMap.prototype.get = function (key, timestamp) {
  const arr = this.map[key];
  if (!arr) return "";
  let ans = "";
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][0] <= timestamp) ans = arr[i][1];
  }
  return ans;
};`,
          python: `class TimeMap:
  def __init__(self):
    self.map = {}
  def set(self, key, value, timestamp):
    self.map.setdefault(key, []).append((timestamp, value))
  def get(self, key, timestamp):
    arr = self.map.get(key, [])
    ans = ""
    for t, v in arr:
      if t <= timestamp:
        ans = v
    return ans`,
          java: `import java.util.*;
class TimeMap {
  Map<String, List<Integer>> times = new HashMap<String, List<Integer>>();
  Map<String, List<String>> vals = new HashMap<String, List<String>>();
  public void set(String key, String value, int timestamp) {
    times.computeIfAbsent(key, k -> new ArrayList<Integer>()).add(timestamp);
    vals.computeIfAbsent(key, k -> new ArrayList<String>()).add(value);
  }
  public String get(String key, int timestamp) {
    List<Integer> ts = times.get(key);
    if (ts == null) return "";
    String ans = "";
    List<String> vs = vals.get(key);
    for (int i = 0; i < ts.size(); i++) if (ts.get(i) <= timestamp) ans = vs.get(i);
    return ans;
  }
}`,
          cpp: `class TimeMap {
  unordered_map<string, vector<pair<int,string>>> mp;
public:
  void set(string key, string value, int timestamp) {
    mp[key].push_back({timestamp, value});
  }
  string get(string key, int timestamp) {
    auto it = mp.find(key);
    if (it == mp.end()) return "";
    string ans;
    for (auto& p : it->second) if (p.first <= timestamp) ans = p.second;
    return ans;
  }
};`,
          c: `#include <string.h>
#define MAXE 10000
typedef struct { char key[24]; int time; char val[24]; } Entry;
typedef struct { Entry e[MAXE]; int n; } TimeMap;
void TimeMap_init(TimeMap* t) { t->n = 0; }
void TimeMap_set(TimeMap* t, const char* key, const char* value, int timestamp) {
  strcpy(t->e[t->n].key, key);
  strcpy(t->e[t->n].val, value);
  t->e[t->n].time = timestamp;
  t->n++;
}
void TimeMap_get(TimeMap* t, const char* key, int timestamp, char* out) {
  out[0] = 0;
  for (int i = 0; i < t->n; i++) {
    if (strcmp(t->e[i].key, key) == 0 && t->e[i].time <= timestamp) strcpy(out, t->e[i].val);
  }
}`
        }
      },
      {
        name: "Optimal",
        time: "set O(1), get O(log n)",
        space: "O(n)",
        why: "Sets for one key arrive in increasing time, so the list is sorted. Binary search the last index whose time is <= timestamp. That is last-true on the time axis.",
        codes: {
          javascript: `function TimeMap() {
  this.map = {};
}
TimeMap.prototype.set = function (key, value, timestamp) {
  if (!this.map[key]) this.map[key] = [];
  this.map[key].push([timestamp, value]);
};
TimeMap.prototype.get = function (key, timestamp) {
  const arr = this.map[key];
  if (!arr) return "";
  let lo = 0, hi = arr.length - 1, ans = "";
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid][0] <= timestamp) {
      ans = arr[mid][1];
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return ans;
};`,
          python: `class TimeMap:
  def __init__(self):
    self.map = {}
  def set(self, key, value, timestamp):
    self.map.setdefault(key, []).append((timestamp, value))
  def get(self, key, timestamp):
    arr = self.map.get(key, [])
    lo, hi, ans = 0, len(arr) - 1, ""
    while lo <= hi:
      mid = (lo + hi) >> 1
      if arr[mid][0] <= timestamp:
        ans = arr[mid][1]
        lo = mid + 1
      else:
        hi = mid - 1
    return ans`,
          java: `import java.util.*;
class TimeMap {
  Map<String, List<Integer>> times = new HashMap<String, List<Integer>>();
  Map<String, List<String>> vals = new HashMap<String, List<String>>();
  public void set(String key, String value, int timestamp) {
    times.computeIfAbsent(key, k -> new ArrayList<Integer>()).add(timestamp);
    vals.computeIfAbsent(key, k -> new ArrayList<String>()).add(value);
  }
  public String get(String key, int timestamp) {
    List<Integer> ts = times.get(key);
    if (ts == null) return "";
    List<String> vs = vals.get(key);
    int lo = 0, hi = ts.size() - 1;
    String ans = "";
    while (lo <= hi) {
      int mid = (lo + hi) >> 1;
      if (ts.get(mid) <= timestamp) { ans = vs.get(mid); lo = mid + 1; }
      else hi = mid - 1;
    }
    return ans;
  }
}`,
          cpp: `class TimeMap {
  unordered_map<string, vector<pair<int,string>>> mp;
public:
  void set(string key, string value, int timestamp) {
    mp[key].push_back({timestamp, value});
  }
  string get(string key, int timestamp) {
    auto it = mp.find(key);
    if (it == mp.end()) return "";
    auto& arr = it->second;
    int lo = 0, hi = (int)arr.size() - 1;
    string ans;
    while (lo <= hi) {
      int mid = (lo + hi) >> 1;
      if (arr[mid].first <= timestamp) { ans = arr[mid].second; lo = mid + 1; }
      else hi = mid - 1;
    }
    return ans;
  }
};`,
          c: `#include <string.h>
#define MAXE 10000
typedef struct { char key[24]; int time; char val[24]; } Entry;
typedef struct { Entry e[MAXE]; int n; } TimeMap;
void TimeMap_init(TimeMap* t) { t->n = 0; }
void TimeMap_set(TimeMap* t, const char* key, const char* value, int timestamp) {
  strcpy(t->e[t->n].key, key);
  strcpy(t->e[t->n].val, value);
  t->e[t->n].time = timestamp;
  t->n++;
}
void TimeMap_get(TimeMap* t, const char* key, int timestamp, char* out) {
  int lo = 0, hi = t->n - 1;
  out[0] = 0;
  while (lo <= hi) {
    int mid = (lo + hi) >> 1;
    if (strcmp(t->e[mid].key, key) != 0) { /* demo: single-key store */
      if (t->e[mid].time <= timestamp) lo = mid + 1; else hi = mid - 1;
      continue;
    }
    if (t->e[mid].time <= timestamp) { strcpy(out, t->e[mid].val); lo = mid + 1; }
    else hi = mid - 1;
  }
}`
        }
      },
      {
        name: "More optimal",
        time: "set O(1), get O(log n)",
        space: "O(n)",
        why: "Overflow-safe mid. Half-open search for the first time > timestamp; the answer is the previous slot. No extra ans string in the loop. Same log probes, slightly cleaner bound.",
        codes: {
          javascript: `function TimeMap() {
  this.map = {};
}
TimeMap.prototype.set = function (key, value, timestamp) {
  if (!this.map[key]) this.map[key] = [];
  this.map[key].push([timestamp, value]);
};
TimeMap.prototype.get = function (key, timestamp) {
  const arr = this.map[key];
  if (!arr) return "";
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid][0] <= timestamp) lo = mid + 1;
    else hi = mid;
  }
  return lo === 0 ? "" : arr[lo - 1][1];
};`,
          python: `class TimeMap:
  def __init__(self):
    self.map = {}
  def set(self, key, value, timestamp):
    self.map.setdefault(key, []).append((timestamp, value))
  def get(self, key, timestamp):
    arr = self.map.get(key, [])
    lo, hi = 0, len(arr)
    while lo < hi:
      mid = lo + ((hi - lo) >> 1)
      if arr[mid][0] <= timestamp:
        lo = mid + 1
      else:
        hi = mid
    return "" if lo == 0 else arr[lo - 1][1]`,
          java: `import java.util.*;
class TimeMap {
  Map<String, List<Integer>> times = new HashMap<String, List<Integer>>();
  Map<String, List<String>> vals = new HashMap<String, List<String>>();
  public void set(String key, String value, int timestamp) {
    times.computeIfAbsent(key, k -> new ArrayList<Integer>()).add(timestamp);
    vals.computeIfAbsent(key, k -> new ArrayList<String>()).add(value);
  }
  public String get(String key, int timestamp) {
    List<Integer> ts = times.get(key);
    if (ts == null) return "";
    int lo = 0, hi = ts.size();
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (ts.get(mid) <= timestamp) lo = mid + 1;
      else hi = mid;
    }
    return lo == 0 ? "" : vals.get(key).get(lo - 1);
  }
}`,
          cpp: `class TimeMap {
  unordered_map<string, vector<pair<int,string>>> mp;
public:
  void set(string key, string value, int timestamp) {
    mp[key].push_back({timestamp, value});
  }
  string get(string key, int timestamp) {
    auto it = mp.find(key);
    if (it == mp.end()) return "";
    auto& arr = it->second;
    int lo = 0, hi = (int)arr.size();
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (arr[mid].first <= timestamp) lo = mid + 1;
      else hi = mid;
    }
    return lo == 0 ? "" : arr[lo - 1].second;
  }
};`,
          c: `#include <string.h>
#define MAXE 10000
typedef struct { int time; char val[24]; } Ver;
typedef struct { Ver v[MAXE]; int n; } TimeMap;
void TimeMap_init(TimeMap* t) { t->n = 0; }
void TimeMap_set(TimeMap* t, const char* key, const char* value, int timestamp) {
  (void)key;
  t->v[t->n].time = timestamp;
  strcpy(t->v[t->n].val, value);
  t->n++;
}
void TimeMap_get(TimeMap* t, const char* key, int timestamp, char* out) {
  (void)key;
  int lo = 0, hi = t->n;
  while (lo < hi) {
    int mid = lo + ((hi - lo) >> 1);
    if (t->v[mid].time <= timestamp) lo = mid + 1;
    else hi = mid;
  }
  if (lo == 0) out[0] = 0;
  else strcpy(out, t->v[lo - 1].val);
}`
        }
      }
    ]
  },
  {
    id: 16,
    level: "intermediate",
    q: "Magnetic Force Between Two Balls",
    ask: "Amazon · Google · Microsoft · Adobe",
    links: [LC("magnetic-force-between-two-balls"), GFG("aggressive-cows")],
    a: "Place m balls into baskets at positions (sorted after you sort them) so the minimum distance between any two balls is as large as possible. Same problem as Aggressive Cows.\n\nTiny example: position = [1, 2, 3, 4, 7], m = 3 -> 3. One best layout is baskets 1, 4, 7 (gaps 3 and 3).\n\nThe predicate 'can I place m balls with min gap mid?' is last-true: if mid works, a smaller gap also works, so you try a larger gap.\n\nOpen Brute, Optimal, and More optimal for trying every gap, binary search plus greedy place, and overflow-safe mid with an early count exit.",
    solutions: [
      {
        name: "Brute",
        time: "O((max-min) * n)",
        space: "O(1)",
        why: "Sort, then try every distance from (max-min) down to 1. First distance that can place m balls is the answer. Distance range can be 10^9, so this times out.",
        codes: {
          javascript: `function maxDistance(position, m) {
  position = position.slice().sort(function (a, b) { return a - b; });
  function can(dist) {
    let count = 1, last = position[0];
    for (let i = 1; i < position.length; i++) {
      if (position[i] - last >= dist) { count++; last = position[i]; }
    }
    return count >= m;
  }
  const span = position[position.length - 1] - position[0];
  for (let d = span; d >= 1; d--) if (can(d)) return d;
  return 0;
}`,
          python: `def maxDistance(position, m):
  position = sorted(position)
  def can(dist):
    count, last = 1, position[0]
    for p in position[1:]:
      if p - last >= dist:
        count += 1
        last = p
    return count >= m
  span = position[-1] - position[0]
  for d in range(span, 0, -1):
    if can(d):
      return d
  return 0`,
          java: `import java.util.Arrays;
class Solution {
  boolean can(int[] position, int m, int dist) {
    int count = 1, last = position[0];
    for (int i = 1; i < position.length; i++) {
      if (position[i] - last >= dist) { count++; last = position[i]; }
    }
    return count >= m;
  }
  public int maxDistance(int[] position, int m) {
    Arrays.sort(position);
    int span = position[position.length - 1] - position[0];
    for (int d = span; d >= 1; d--) if (can(position, m, d)) return d;
    return 0;
  }
}`,
          cpp: `class Solution {
  bool can(vector<int>& position, int m, int dist) {
    int count = 1, last = position[0];
    for (int i = 1; i < (int)position.size(); i++) {
      if (position[i] - last >= dist) { count++; last = position[i]; }
    }
    return count >= m;
  }
public:
  int maxDistance(vector<int>& position, int m) {
    sort(position.begin(), position.end());
    int span = position.back() - position[0];
    for (int d = span; d >= 1; d--) if (can(position, m, d)) return d;
    return 0;
  }
};`,
          c: `#include <stdlib.h>
int cmpInt(const void* a, const void* b) { return *(const int*)a - *(const int*)b; }
int canPlace(int* p, int n, int m, int dist) {
  int count = 1, last = p[0];
  for (int i = 1; i < n; i++) if (p[i] - last >= dist) { count++; last = p[i]; }
  return count >= m;
}
int maxDistance(int* position, int n, int m) {
  qsort(position, n, sizeof(int), cmpInt);
  int span = position[n - 1] - position[0];
  for (int d = span; d >= 1; d--) if (canPlace(position, n, m, d)) return d;
  return 0;
}`
        }
      },
      {
        name: "Optimal",
        time: "O(n log(max-min))",
        space: "O(1)",
        why: "Sort once. Binary search the gap. Greedy: place the next ball at the first basket that is at least mid away from the last placed ball. If you place m, try a larger gap (lo = mid + 1).",
        codes: {
          javascript: `function maxDistance(position, m) {
  position = position.slice().sort(function (a, b) { return a - b; });
  function can(dist) {
    let count = 1, last = position[0];
    for (let i = 1; i < position.length; i++) {
      if (position[i] - last >= dist) { count++; last = position[i]; if (count >= m) return true; }
    }
    return false;
  }
  let lo = 1, hi = position[position.length - 1] - position[0], ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (can(mid)) { ans = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return ans;
}`,
          python: `def maxDistance(position, m):
  position = sorted(position)
  def can(dist):
    count, last = 1, position[0]
    for p in position[1:]:
      if p - last >= dist:
        count += 1
        last = p
        if count >= m:
          return True
    return False
  lo, hi, ans = 1, position[-1] - position[0], 0
  while lo <= hi:
    mid = (lo + hi) >> 1
    if can(mid):
      ans = mid
      lo = mid + 1
    else:
      hi = mid - 1
  return ans`,
          java: `import java.util.Arrays;
class Solution {
  boolean can(int[] position, int m, int dist) {
    int count = 1, last = position[0];
    for (int i = 1; i < position.length; i++) {
      if (position[i] - last >= dist) {
        count++; last = position[i];
        if (count >= m) return true;
      }
    }
    return false;
  }
  public int maxDistance(int[] position, int m) {
    Arrays.sort(position);
    int lo = 1, hi = position[position.length - 1] - position[0], ans = 0;
    while (lo <= hi) {
      int mid = (lo + hi) >> 1;
      if (can(position, m, mid)) { ans = mid; lo = mid + 1; }
      else hi = mid - 1;
    }
    return ans;
  }
}`,
          cpp: `class Solution {
  bool can(vector<int>& position, int m, int dist) {
    int count = 1, last = position[0];
    for (int i = 1; i < (int)position.size(); i++) {
      if (position[i] - last >= dist) {
        count++; last = position[i];
        if (count >= m) return true;
      }
    }
    return false;
  }
public:
  int maxDistance(vector<int>& position, int m) {
    sort(position.begin(), position.end());
    int lo = 1, hi = position.back() - position[0], ans = 0;
    while (lo <= hi) {
      int mid = (lo + hi) >> 1;
      if (can(position, m, mid)) { ans = mid; lo = mid + 1; }
      else hi = mid - 1;
    }
    return ans;
  }
};`,
          c: `#include <stdlib.h>
int cmpInt(const void* a, const void* b) { return *(const int*)a - *(const int*)b; }
int canPlace(int* p, int n, int m, int dist) {
  int count = 1, last = p[0];
  for (int i = 1; i < n; i++) {
    if (p[i] - last >= dist) { count++; last = p[i]; if (count >= m) return 1; }
  }
  return 0;
}
int maxDistance(int* position, int n, int m) {
  qsort(position, n, sizeof(int), cmpInt);
  int lo = 1, hi = position[n - 1] - position[0], ans = 0;
  while (lo <= hi) {
    int mid = (lo + hi) >> 1;
    if (canPlace(position, n, m, mid)) { ans = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return ans;
}`
        }
      },
      {
        name: "More optimal",
        time: "O(n log(max-min))",
        space: "O(1)",
        why: "Overflow-safe mid. Half-open last-true: if mid works, lo = mid + 1, else hi = mid, then return lo - 1. No separate ans. Early stop once m balls are placed.",
        codes: {
          javascript: `function maxDistance(position, m) {
  position = position.slice().sort(function (a, b) { return a - b; });
  function can(dist) {
    let count = 1, last = position[0];
    for (let i = 1; i < position.length; i++) {
      if (position[i] - last >= dist) {
        count++;
        last = position[i];
        if (count >= m) return true;
      }
    }
    return false;
  }
  let lo = 1, hi = position[position.length - 1] - position[0] + 1;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (can(mid)) lo = mid + 1;
    else hi = mid;
  }
  return lo - 1;
}`,
          python: `def maxDistance(position, m):
  position = sorted(position)
  def can(dist):
    count, last = 1, position[0]
    for p in position[1:]:
      if p - last >= dist:
        count += 1
        last = p
        if count >= m:
          return True
    return False
  lo, hi = 1, position[-1] - position[0] + 1
  while lo < hi:
    mid = lo + ((hi - lo) >> 1)
    if can(mid):
      lo = mid + 1
    else:
      hi = mid
  return lo - 1`,
          java: `import java.util.Arrays;
class Solution {
  boolean can(int[] position, int m, int dist) {
    int count = 1, last = position[0];
    for (int i = 1; i < position.length; i++) {
      if (position[i] - last >= dist) {
        count++; last = position[i];
        if (count >= m) return true;
      }
    }
    return false;
  }
  public int maxDistance(int[] position, int m) {
    Arrays.sort(position);
    int lo = 1, hi = position[position.length - 1] - position[0] + 1;
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (can(position, m, mid)) lo = mid + 1;
      else hi = mid;
    }
    return lo - 1;
  }
}`,
          cpp: `class Solution {
  bool can(vector<int>& position, int m, int dist) {
    int count = 1, last = position[0];
    for (int i = 1; i < (int)position.size(); i++) {
      if (position[i] - last >= dist) {
        count++; last = position[i];
        if (count >= m) return true;
      }
    }
    return false;
  }
public:
  int maxDistance(vector<int>& position, int m) {
    sort(position.begin(), position.end());
    int lo = 1, hi = position.back() - position[0] + 1;
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (can(position, m, mid)) lo = mid + 1;
      else hi = mid;
    }
    return lo - 1;
  }
};`,
          c: `#include <stdlib.h>
int cmpInt(const void* a, const void* b) { return *(const int*)a - *(const int*)b; }
int canPlace(int* p, int n, int m, int dist) {
  int count = 1, last = p[0];
  for (int i = 1; i < n; i++) {
    if (p[i] - last >= dist) { count++; last = p[i]; if (count >= m) return 1; }
  }
  return 0;
}
int maxDistance(int* position, int n, int m) {
  qsort(position, n, sizeof(int), cmpInt);
  int lo = 1, hi = position[n - 1] - position[0] + 1;
  while (lo < hi) {
    int mid = lo + ((hi - lo) >> 1);
    if (canPlace(position, n, m, mid)) lo = mid + 1;
    else hi = mid;
  }
  return lo - 1;
}`
        }
      }
    ]
  },
  {
    id: 17,
    level: "beginner",
    q: "Sqrt(x)",
    ask: "Amazon · Bloomberg · Microsoft · Apple",
    links: [LC("sqrtx"), GFG("square-root")],
    a: "Return the integer square root of a non-negative x: the largest integer r such that r * r <= x. Do not use a library sqrt if they forbid it.\n\nTiny example: 4 -> 2. 8 -> 2 because 2*2 = 4 and 3*3 = 9 > 8. 0 -> 0. 1 -> 1.\n\nLinear try of 0, 1, 2, ... works. Binary search on r in [0, x] (or [1, x/2 + 1]) is O(log x). Newton's method usually needs fewer iterations.\n\nOpen Brute, Optimal, and More optimal for incrementing r, binary search, and integer Newton.",
    solutions: [
      {
        name: "Brute",
        time: "O(sqrt(x))",
        space: "O(1)",
        why: "Increase r while (r+1)*(r+1) still fits in x. Use 64-bit (or a division check) so r*r does not overflow 32-bit int.",
        codes: {
          javascript: `function mySqrt(x) {
  let r = 0;
  while ((r + 1) * (r + 1) <= x) r++;
  return r;
}`,
          python: `def mySqrt(x):
  r = 0
  while (r + 1) * (r + 1) <= x:
    r += 1
  return r`,
          java: `class Solution {
  public int mySqrt(int x) {
    long r = 0;
    while ((r + 1) * (r + 1) <= x) r++;
    return (int) r;
  }
}`,
          cpp: `class Solution {
public:
  int mySqrt(int x) {
    long long r = 0;
    while ((r + 1) * (r + 1) <= x) r++;
    return (int)r;
  }
};`,
          c: `int mySqrt(int x) {
  long long r = 0;
  while ((r + 1) * (r + 1) <= x) r++;
  return (int)r;
}`
        }
      },
      {
        name: "Optimal",
        time: "O(log x)",
        space: "O(1)",
        why: "Last-true search: mid is good when mid <= x / mid (avoids mid*mid overflow). If good, try a larger r. If not, shrink high. x in {0,1} returns x.",
        codes: {
          javascript: `function mySqrt(x) {
  if (x < 2) return x;
  let lo = 1, hi = x, ans = 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (mid <= Math.floor(x / mid)) {
      ans = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return ans;
}`,
          python: `def mySqrt(x):
  if x < 2:
    return x
  lo, hi, ans = 1, x, 1
  while lo <= hi:
    mid = (lo + hi) >> 1
    if mid <= x // mid:
      ans = mid
      lo = mid + 1
    else:
      hi = mid - 1
  return ans`,
          java: `class Solution {
  public int mySqrt(int x) {
    if (x < 2) return x;
    int lo = 1, hi = x, ans = 1;
    while (lo <= hi) {
      int mid = (lo + hi) >> 1;
      if (mid <= x / mid) { ans = mid; lo = mid + 1; }
      else hi = mid - 1;
    }
    return ans;
  }
}`,
          cpp: `class Solution {
public:
  int mySqrt(int x) {
    if (x < 2) return x;
    int lo = 1, hi = x, ans = 1;
    while (lo <= hi) {
      int mid = (lo + hi) >> 1;
      if (mid <= x / mid) { ans = mid; lo = mid + 1; }
      else hi = mid - 1;
    }
    return ans;
  }
};`,
          c: `int mySqrt(int x) {
  if (x < 2) return x;
  int lo = 1, hi = x, ans = 1;
  while (lo <= hi) {
    int mid = (lo + hi) >> 1;
    if (mid <= x / mid) { ans = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return ans;
}`
        }
      },
      {
        name: "More optimal",
        time: "O(log x)",
        space: "O(1)",
        why: "Integer Newton: r = (r + x/r) / 2 until r <= x/r. Overflow-safe. Usually fewer loops than binary search. Still exact for the floor sqrt.",
        codes: {
          javascript: `function mySqrt(x) {
  if (x < 2) return x;
  let r = x;
  while (r > Math.floor(x / r)) {
    r = Math.floor((r + Math.floor(x / r)) / 2);
  }
  return r;
}`,
          python: `def mySqrt(x):
  if x < 2:
    return x
  r = x
  while r > x // r:
    r = (r + x // r) // 2
  return r`,
          java: `class Solution {
  public int mySqrt(int x) {
    if (x < 2) return x;
    long r = x;
    while (r > x / r) r = (r + x / r) / 2;
    return (int) r;
  }
}`,
          cpp: `class Solution {
public:
  int mySqrt(int x) {
    if (x < 2) return x;
    long long r = x;
    while (r > x / r) r = (r + x / r) / 2;
    return (int)r;
  }
};`,
          c: `int mySqrt(int x) {
  if (x < 2) return x;
  long long r = x;
  while (r > x / r) r = (r + x / r) / 2;
  return (int)r;
}`
        }
      }
    ]
  },
  {
    id: 18,
    level: "beginner",
    q: "First Bad Version",
    ask: "Google · Facebook · Amazon · Microsoft",
    links: [LC("first-bad-version"), GFG("first-bad-version")],
    a: "Versions 1..n. There is a first bad version f. Every version >= f is bad. You may only call isBadVersion(v). Return f. Minimize API calls.\n\nTiny example: n = 5, first bad = 4. Calls on 1,2,3 are false, 4 and 5 are true, so answer 4. n = 1 is always 1 if it is bad.\n\nLinear check from 1 is too many calls. Binary search first-true: if mid is bad, the first bad is at mid or left; if mid is good, it is strictly right.\n\nOpen Brute, Optimal, and More optimal for a scan, an ans-variable binary search, and the half-open overflow-safe loop that returns lo.",
    solutions: [
      {
        name: "Brute",
        time: "O(n) calls",
        space: "O(1)",
        why: "Ask isBadVersion from 1 upward. First true is the answer. Correct, burns the API on large n.",
        codes: {
          javascript: `function firstBadVersion(n, isBadVersion) {
  for (let i = 1; i <= n; i++) if (isBadVersion(i)) return i;
  return n;
}`,
          python: `def firstBadVersion(n, isBadVersion):
  for i in range(1, n + 1):
    if isBadVersion(i):
      return i
  return n`,
          java: `/* The isBadVersion API is defined in the parent class VersionControl.
      boolean isBadVersion(int version); */
public class Solution extends VersionControl {
  public int firstBadVersion(int n) {
    for (int i = 1; i <= n; i++) if (isBadVersion(i)) return i;
    return n;
  }
}`,
          cpp: `// The API isBadVersion is defined for you.
// bool isBadVersion(int version);
class Solution {
public:
  int firstBadVersion(int n) {
    for (int i = 1; i <= n; i++) if (isBadVersion(i)) return i;
    return n;
  }
};`,
          c: `/* bool isBadVersion(int version); provided */
int firstBadVersion(int n) {
  for (int i = 1; i <= n; i++) if (isBadVersion(i)) return i;
  return n;
}`
        }
      },
      {
        name: "Optimal",
        time: "O(log n) calls",
        space: "O(1)",
        why: "Classic first-true. When mid is bad, store it and search left. When mid is good, search right. About log2(n) API calls.",
        codes: {
          javascript: `function firstBadVersion(n, isBadVersion) {
  let lo = 1, hi = n, ans = n;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (isBadVersion(mid)) {
      ans = mid;
      hi = mid - 1;
    } else lo = mid + 1;
  }
  return ans;
}`,
          python: `def firstBadVersion(n, isBadVersion):
  lo, hi, ans = 1, n, n
  while lo <= hi:
    mid = (lo + hi) >> 1
    if isBadVersion(mid):
      ans = mid
      hi = mid - 1
    else:
      lo = mid + 1
  return ans`,
          java: `public class Solution extends VersionControl {
  public int firstBadVersion(int n) {
    int lo = 1, hi = n, ans = n;
    while (lo <= hi) {
      int mid = (lo + hi) >> 1;
      if (isBadVersion(mid)) { ans = mid; hi = mid - 1; }
      else lo = mid + 1;
    }
    return ans;
  }
}`,
          cpp: `class Solution {
public:
  int firstBadVersion(int n) {
    int lo = 1, hi = n, ans = n;
    while (lo <= hi) {
      int mid = (lo + hi) >> 1;
      if (isBadVersion(mid)) { ans = mid; hi = mid - 1; }
      else lo = mid + 1;
    }
    return ans;
  }
};`,
          c: `int firstBadVersion(int n) {
  int lo = 1, hi = n, ans = n;
  while (lo <= hi) {
    int mid = (lo + hi) >> 1;
    if (isBadVersion(mid)) { ans = mid; hi = mid - 1; }
    else lo = mid + 1;
  }
  return ans;
}`
        }
      },
      {
        name: "More optimal",
        time: "O(log n) calls",
        space: "O(1)",
        why: "Overflow-safe mid is required in Java: (lo+hi)/2 wraps when n is 2^31-1. Half-open while (lo < hi): bad means hi = mid, good means lo = mid + 1. Return lo. Same call count, no extra ans, no overflow.",
        codes: {
          javascript: `function firstBadVersion(n, isBadVersion) {
  let lo = 1, hi = n;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (isBadVersion(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
          python: `def firstBadVersion(n, isBadVersion):
  lo, hi = 1, n
  while lo < hi:
    mid = lo + ((hi - lo) >> 1)
    if isBadVersion(mid):
      hi = mid
    else:
      lo = mid + 1
  return lo`,
          java: `public class Solution extends VersionControl {
  public int firstBadVersion(int n) {
    int lo = 1, hi = n;
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (isBadVersion(mid)) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }
}`,
          cpp: `class Solution {
public:
  int firstBadVersion(int n) {
    int lo = 1, hi = n;
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (isBadVersion(mid)) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }
};`,
          c: `int firstBadVersion(int n) {
  int lo = 1, hi = n;
  while (lo < hi) {
    int mid = lo + ((hi - lo) >> 1);
    if (isBadVersion(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`
        }
      }
    ]
  }
];
