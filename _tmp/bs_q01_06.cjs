const LC = (s) => ({ name: "LeetCode", url: "https://leetcode.com/problems/" + s + "/" });
const GFG = (s) => ({ name: "GFG", url: "https://www.geeksforgeeks.org/problems/" + s + "/1" });

module.exports = [
  {
    id: 1,
    level: "beginner",
    q: "Binary Search",
    ask: "Amazon · Google · Microsoft · Meta",
    links: [LC("binary-search"), GFG("who-will-win-1587115621")],
    a: "nums is sorted in non-decreasing order. Return the index of target, or -1 if it is not there.\n\nTiny example: nums = [-1, 0, 3, 5, 9, 12], target = 9. The hit is index 4. Target 2 is missing, so -1.\n\nA linear scan is correct and O(n). Binary search probes mid and drops half the range each time, O(log n). Use mid = lo + (hi - lo) / 2 so 32-bit indexes cannot overflow.\n\nOpen Brute, Optimal, and More optimal for the scan, the closed-range loop, and the overflow-safe version with an early endpoint check.",
    solutions: [
      {
        name: "Brute",
        time: "O(n)",
        space: "O(1)",
        why: "Walk left to right and compare every value. Correct on any array, sorted or not. Interviews want this only as the baseline before you cut the search in half.",
        codes: {
          javascript: `function search(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}`,
          python: `def search(nums, target):
  for i, v in enumerate(nums):
    if v == target:
      return i
  return -1`,
          java: `class Solution {
  public int search(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
      if (nums[i] == target) return i;
    }
    return -1;
  }
}`,
          cpp: `class Solution {
public:
  int search(vector<int>& nums, int target) {
    for (int i = 0; i < (int)nums.size(); i++) {
      if (nums[i] == target) return i;
    }
    return -1;
  }
};`,
          c: `int search(int* nums, int n, int target) {
  for (int i = 0; i < n; i++) if (nums[i] == target) return i;
  return -1;
}`
        }
      },
      {
        name: "Optimal",
        time: "O(log n)",
        space: "O(1)",
        why: "Closed range [lo, hi]. Equal mid returns. Smaller mid throws away the left half. Larger mid throws away the right half. Each step halves the live indexes.",
        codes: {
          javascript: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
          python: `def search(nums, target):
  lo, hi = 0, len(nums) - 1
  while lo <= hi:
    mid = (lo + hi) >> 1
    if nums[mid] == target:
      return mid
    if nums[mid] < target:
      lo = mid + 1
    else:
      hi = mid - 1
  return -1`,
          java: `class Solution {
  public int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
      int mid = (lo + hi) >> 1;
      if (nums[mid] == target) return mid;
      if (nums[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  }
}`,
          cpp: `class Solution {
public:
  int search(vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo <= hi) {
      int mid = (lo + hi) >> 1;
      if (nums[mid] == target) return mid;
      if (nums[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  }
};`,
          c: `int search(int* nums, int n, int target) {
  int lo = 0, hi = n - 1;
  while (lo <= hi) {
    int mid = (lo + hi) >> 1;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`
        }
      },
      {
        name: "More optimal",
        time: "O(log n)",
        space: "O(1)",
        why: "Same log n probes, but mid = lo + (hi - lo) / 2 never overflows a 32-bit index sum. Endpoint checks skip a loop when target is outside the remaining values.",
        codes: {
          javascript: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    if (nums[lo] === target) return lo;
    if (nums[hi] === target) return hi;
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
          python: `def search(nums, target):
  lo, hi = 0, len(nums) - 1
  while lo <= hi:
    if nums[lo] == target:
      return lo
    if nums[hi] == target:
      return hi
    mid = lo + ((hi - lo) >> 1)
    if nums[mid] == target:
      return mid
    if nums[mid] < target:
      lo = mid + 1
    else:
      hi = mid - 1
  return -1`,
          java: `class Solution {
  public int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
      if (nums[lo] == target) return lo;
      if (nums[hi] == target) return hi;
      int mid = lo + ((hi - lo) >> 1);
      if (nums[mid] == target) return mid;
      if (nums[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  }
}`,
          cpp: `class Solution {
public:
  int search(vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo <= hi) {
      if (nums[lo] == target) return lo;
      if (nums[hi] == target) return hi;
      int mid = lo + ((hi - lo) >> 1);
      if (nums[mid] == target) return mid;
      if (nums[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  }
};`,
          c: `int search(int* nums, int n, int target) {
  int lo = 0, hi = n - 1;
  while (lo <= hi) {
    if (nums[lo] == target) return lo;
    if (nums[hi] == target) return hi;
    int mid = lo + ((hi - lo) >> 1);
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`
        }
      }
    ]
  },
  {
    id: 2,
    level: "beginner",
    q: "Search Insert Position",
    ask: "Amazon · Bloomberg · Microsoft · Adobe",
    links: [LC("search-insert-position"), GFG("search-insert-position-of-k-in-a-sorted-array")],
    a: "nums is sorted and unique. Return the index of target, or the index where it would be inserted to keep the list sorted.\n\nTiny example: [1, 3, 5, 6]. Target 5 -> 2. Target 2 -> 1. Target 7 -> 4. Target 0 -> 0.\n\nThat index is the lower bound: the first position where nums[i] >= target (or n if all values are smaller).\n\nOpen Brute, Optimal, and More optimal for a left-to-right scan, closed-range binary search, and the half-open first-true loop.",
    solutions: [
      {
        name: "Brute",
        time: "O(n)",
        space: "O(1)",
        why: "The first index with nums[i] >= target is the insert slot. If none exist, insert at n. Fine for tiny n; too slow when they ask for log n.",
        codes: {
          javascript: `function searchInsert(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] >= target) return i;
  }
  return nums.length;
}`,
          python: `def searchInsert(nums, target):
  for i, v in enumerate(nums):
    if v >= target:
      return i
  return len(nums)`,
          java: `class Solution {
  public int searchInsert(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
      if (nums[i] >= target) return i;
    }
    return nums.length;
  }
}`,
          cpp: `class Solution {
public:
  int searchInsert(vector<int>& nums, int target) {
    for (int i = 0; i < (int)nums.size(); i++) {
      if (nums[i] >= target) return i;
    }
    return (int)nums.size();
  }
};`,
          c: `int searchInsert(int* nums, int n, int target) {
  for (int i = 0; i < n; i++) if (nums[i] >= target) return i;
  return n;
}`
        }
      },
      {
        name: "Optimal",
        time: "O(log n)",
        space: "O(1)",
        why: "Track the best insert index seen so far. When mid is >= target, mid is a candidate and you search left. When mid is smaller, the slot is strictly right of mid.",
        codes: {
          javascript: `function searchInsert(nums, target) {
  let lo = 0, hi = nums.length - 1, ans = nums.length;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] >= target) {
      ans = mid;
      hi = mid - 1;
    } else lo = mid + 1;
  }
  return ans;
}`,
          python: `def searchInsert(nums, target):
  lo, hi, ans = 0, len(nums) - 1, len(nums)
  while lo <= hi:
    mid = (lo + hi) >> 1
    if nums[mid] >= target:
      ans = mid
      hi = mid - 1
    else:
      lo = mid + 1
  return ans`,
          java: `class Solution {
  public int searchInsert(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1, ans = nums.length;
    while (lo <= hi) {
      int mid = (lo + hi) >> 1;
      if (nums[mid] >= target) { ans = mid; hi = mid - 1; }
      else lo = mid + 1;
    }
    return ans;
  }
}`,
          cpp: `class Solution {
public:
  int searchInsert(vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size() - 1, ans = (int)nums.size();
    while (lo <= hi) {
      int mid = (lo + hi) >> 1;
      if (nums[mid] >= target) { ans = mid; hi = mid - 1; }
      else lo = mid + 1;
    }
    return ans;
  }
};`,
          c: `int searchInsert(int* nums, int n, int target) {
  int lo = 0, hi = n - 1, ans = n;
  while (lo <= hi) {
    int mid = (lo + hi) >> 1;
    if (nums[mid] >= target) { ans = mid; hi = mid - 1; }
    else lo = mid + 1;
  }
  return ans;
}`
        }
      },
      {
        name: "More optimal",
        time: "O(log n)",
        space: "O(1)",
        why: "Half-open [lo, hi) with hi = n. No extra ans variable: when the loop ends, lo is the first index >= target. Overflow-safe mid.",
        codes: {
          javascript: `function searchInsert(nums, target) {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
          python: `def searchInsert(nums, target):
  lo, hi = 0, len(nums)
  while lo < hi:
    mid = lo + ((hi - lo) >> 1)
    if nums[mid] < target:
      lo = mid + 1
    else:
      hi = mid
  return lo`,
          java: `class Solution {
  public int searchInsert(int[] nums, int target) {
    int lo = 0, hi = nums.length;
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (nums[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
}`,
          cpp: `class Solution {
public:
  int searchInsert(vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size();
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (nums[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
};`,
          c: `int searchInsert(int* nums, int n, int target) {
  int lo = 0, hi = n;
  while (lo < hi) {
    int mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`
        }
      }
    ]
  },
  {
    id: 3,
    level: "intermediate",
    q: "Find First and Last Position of Element in Sorted Array",
    ask: "Facebook · Amazon · Google · Microsoft",
    links: [LC("find-first-and-last-position-of-element-in-a-sorted-array"), GFG("first-and-last-occurrences-of-x3116")],
    a: "nums is sorted in non-decreasing order and may contain duplicates. Return the first and last indexes equal to target. If target is missing, return [-1, -1].\n\nTiny example: [5, 7, 7, 8, 8, 10], target 8 -> [3, 4]. Target 6 -> [-1, -1].\n\nOne pass can record first and last. Two binary searches are O(log n) even when a long run of duplicates would make a linear expand O(n).\n\nOpen Brute, Optimal, and More optimal for the scan, two biased loops, and lower/upper bound packed into one helper.",
    solutions: [
      {
        name: "Brute",
        time: "O(n)",
        space: "O(1)",
        why: "One left-to-right pass. First time you see target, store i. Every time you see it, update last. Missing target leaves both at -1.",
        codes: {
          javascript: `function searchRange(nums, target) {
  let first = -1, last = -1;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) {
      if (first < 0) first = i;
      last = i;
    }
  }
  return [first, last];
}`,
          python: `def searchRange(nums, target):
  first = last = -1
  for i, v in enumerate(nums):
    if v == target:
      if first < 0:
        first = i
      last = i
  return [first, last]`,
          java: `class Solution {
  public int[] searchRange(int[] nums, int target) {
    int first = -1, last = -1;
    for (int i = 0; i < nums.length; i++) {
      if (nums[i] == target) {
        if (first < 0) first = i;
        last = i;
      }
    }
    return new int[]{first, last};
  }
}`,
          cpp: `class Solution {
public:
  vector<int> searchRange(vector<int>& nums, int target) {
    int first = -1, last = -1;
    for (int i = 0; i < (int)nums.size(); i++) {
      if (nums[i] == target) {
        if (first < 0) first = i;
        last = i;
      }
    }
    return {first, last};
  }
};`,
          c: `void searchRange(int* nums, int n, int target, int* first, int* last) {
  *first = *last = -1;
  for (int i = 0; i < n; i++) if (nums[i] == target) {
    if (*first < 0) *first = i;
    *last = i;
  }
}`
        }
      },
      {
        name: "Optimal",
        time: "O(log n)",
        space: "O(1)",
        why: "Two binary searches. When mid equals target, first-occurrence keeps searching left (hi = mid - 1) and last-occurrence keeps searching right (lo = mid + 1). Each is O(log n).",
        codes: {
          javascript: `function searchRange(nums, target) {
  function find(first) {
    let lo = 0, hi = nums.length - 1, ans = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (nums[mid] === target) {
        ans = mid;
        if (first) hi = mid - 1;
        else lo = mid + 1;
      } else if (nums[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return ans;
  }
  return [find(true), find(false)];
}`,
          python: `def searchRange(nums, target):
  def find(first):
    lo, hi, ans = 0, len(nums) - 1, -1
    while lo <= hi:
      mid = (lo + hi) >> 1
      if nums[mid] == target:
        ans = mid
        if first:
          hi = mid - 1
        else:
          lo = mid + 1
      elif nums[mid] < target:
        lo = mid + 1
      else:
        hi = mid - 1
    return ans
  return [find(True), find(False)]`,
          java: `class Solution {
  int find(int[] nums, int target, boolean first) {
    int lo = 0, hi = nums.length - 1, ans = -1;
    while (lo <= hi) {
      int mid = (lo + hi) >> 1;
      if (nums[mid] == target) {
        ans = mid;
        if (first) hi = mid - 1;
        else lo = mid + 1;
      } else if (nums[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return ans;
  }
  public int[] searchRange(int[] nums, int target) {
    return new int[]{find(nums, target, true), find(nums, target, false)};
  }
}`,
          cpp: `class Solution {
  int find(vector<int>& nums, int target, bool first) {
    int lo = 0, hi = (int)nums.size() - 1, ans = -1;
    while (lo <= hi) {
      int mid = (lo + hi) >> 1;
      if (nums[mid] == target) {
        ans = mid;
        if (first) hi = mid - 1;
        else lo = mid + 1;
      } else if (nums[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return ans;
  }
public:
  vector<int> searchRange(vector<int>& nums, int target) {
    return {find(nums, target, true), find(nums, target, false)};
  }
};`,
          c: `int findOcc(int* nums, int n, int target, int first) {
  int lo = 0, hi = n - 1, ans = -1;
  while (lo <= hi) {
    int mid = (lo + hi) >> 1;
    if (nums[mid] == target) {
      ans = mid;
      if (first) hi = mid - 1;
      else lo = mid + 1;
    } else if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return ans;
}
void searchRange(int* nums, int n, int target, int* first, int* last) {
  *first = findOcc(nums, n, target, 1);
  *last = findOcc(nums, n, target, 0);
}`
        }
      },
      {
        name: "More optimal",
        time: "O(log n)",
        space: "O(1)",
        why: "Lower bound (first >= target) and upper bound (first > target). Last index is upper - 1. Overflow-safe mid. One helper, two flags, no extra ans in the loop.",
        codes: {
          javascript: `function searchRange(nums, target) {
  function bound(gt) {
    let lo = 0, hi = nums.length;
    while (lo < hi) {
      const mid = lo + ((hi - lo) >> 1);
      if (nums[mid] < target || (gt && nums[mid] === target)) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
  const L = bound(false);
  if (L === nums.length || nums[L] !== target) return [-1, -1];
  return [L, bound(true) - 1];
}`,
          python: `def searchRange(nums, target):
  def bound(gt):
    lo, hi = 0, len(nums)
    while lo < hi:
      mid = lo + ((hi - lo) >> 1)
      if nums[mid] < target or (gt and nums[mid] == target):
        lo = mid + 1
      else:
        hi = mid
    return lo
  L = bound(False)
  if L == len(nums) or nums[L] != target:
    return [-1, -1]
  return [L, bound(True) - 1]`,
          java: `class Solution {
  int bound(int[] nums, int target, boolean gt) {
    int lo = 0, hi = nums.length;
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (nums[mid] < target || (gt && nums[mid] == target)) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
  public int[] searchRange(int[] nums, int target) {
    int L = bound(nums, target, false);
    if (L == nums.length || nums[L] != target) return new int[]{-1, -1};
    return new int[]{L, bound(nums, target, true) - 1};
  }
}`,
          cpp: `class Solution {
  int bound(vector<int>& nums, int target, bool gt) {
    int lo = 0, hi = (int)nums.size();
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (nums[mid] < target || (gt && nums[mid] == target)) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
public:
  vector<int> searchRange(vector<int>& nums, int target) {
    int L = bound(nums, target, false);
    if (L == (int)nums.size() || nums[L] != target) return {-1, -1};
    return {L, bound(nums, target, true) - 1};
  }
};`,
          c: `int bound(int* nums, int n, int target, int gt) {
  int lo = 0, hi = n;
  while (lo < hi) {
    int mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < target || (gt && nums[mid] == target)) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
void searchRange(int* nums, int n, int target, int* first, int* last) {
  int L = bound(nums, n, target, 0);
  if (L == n || nums[L] != target) { *first = *last = -1; return; }
  *first = L;
  *last = bound(nums, n, target, 1) - 1;
}`
        }
      }
    ]
  },
  {
    id: 4,
    level: "intermediate",
    q: "Search in Rotated Sorted Array II",
    ask: "Amazon · Facebook · Microsoft · LinkedIn",
    links: [LC("search-in-rotated-sorted-array-ii"), GFG("search-in-rotated-array-2")],
    a: "nums was sorted, then rotated, and it may contain duplicates. Return true if target exists.\n\nTiny example: [2, 5, 6, 0, 0, 1, 2], target 0 -> true. Target 3 -> false. All-equal [1, 1, 1, 1] with target 2 -> false.\n\nOne sorted half still exists around mid, except when nums[lo] == nums[mid] == nums[hi]. Then you cannot tell which half is sorted, so you shrink both ends by one.\n\nOpen Brute, Optimal, and More optimal for a scan, the rotate check plus shrink, and skipping a whole run of duplicates on each end.",
    solutions: [
      {
        name: "Brute",
        time: "O(n)",
        space: "O(1)",
        why: "Duplicates already force O(n) in the worst case, so a linear scan is honest. Still too weak as the only answer: they want the rotated-half logic.",
        codes: {
          javascript: `function search(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return true;
  }
  return false;
}`,
          python: `def search(nums, target):
  return target in nums`,
          java: `class Solution {
  public boolean search(int[] nums, int target) {
    for (int v : nums) if (v == target) return true;
    return false;
  }
}`,
          cpp: `class Solution {
public:
  bool search(vector<int>& nums, int target) {
    for (int v : nums) if (v == target) return true;
    return false;
  }
};`,
          c: `int search(int* nums, int n, int target) {
  for (int i = 0; i < n; i++) if (nums[i] == target) return 1;
  return 0;
}`
        }
      },
      {
        name: "Optimal",
        time: "O(log n) avg, O(n) worst",
        space: "O(1)",
        why: "If lo, mid, and hi are equal, shrink both ends. Otherwise one half is sorted; keep the half that can contain target. Worst case is all duplicates, which is linear.",
        codes: {
          javascript: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return true;
    if (nums[lo] === nums[mid] && nums[mid] === nums[hi]) {
      lo++;
      hi--;
      continue;
    }
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return false;
}`,
          python: `def search(nums, target):
  lo, hi = 0, len(nums) - 1
  while lo <= hi:
    mid = lo + ((hi - lo) >> 1)
    if nums[mid] == target:
      return True
    if nums[lo] == nums[mid] == nums[hi]:
      lo += 1
      hi -= 1
      continue
    if nums[lo] <= nums[mid]:
      if nums[lo] <= target < nums[mid]:
        hi = mid - 1
      else:
        lo = mid + 1
    else:
      if nums[mid] < target <= nums[hi]:
        lo = mid + 1
      else:
        hi = mid - 1
  return False`,
          java: `class Solution {
  public boolean search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (nums[mid] == target) return true;
      if (nums[lo] == nums[mid] && nums[mid] == nums[hi]) { lo++; hi--; continue; }
      if (nums[lo] <= nums[mid]) {
        if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
        else lo = mid + 1;
      } else {
        if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
        else hi = mid - 1;
      }
    }
    return false;
  }
}`,
          cpp: `class Solution {
public:
  bool search(vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (nums[mid] == target) return true;
      if (nums[lo] == nums[mid] && nums[mid] == nums[hi]) { lo++; hi--; continue; }
      if (nums[lo] <= nums[mid]) {
        if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
        else lo = mid + 1;
      } else {
        if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
        else hi = mid - 1;
      }
    }
    return false;
  }
};`,
          c: `int search(int* nums, int n, int target) {
  int lo = 0, hi = n - 1;
  while (lo <= hi) {
    int mid = lo + ((hi - lo) >> 1);
    if (nums[mid] == target) return 1;
    if (nums[lo] == nums[mid] && nums[mid] == nums[hi]) { lo++; hi--; continue; }
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return 0;
}`
        }
      },
      {
        name: "More optimal",
        time: "O(log n) avg, O(n) worst",
        space: "O(1)",
        why: "Skip a whole equal-run on each end instead of one index at a time when lo/mid/hi match. Fewer iterations on long duplicate prefixes and suffixes. Worst case is still linear.",
        codes: {
          javascript: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target || nums[lo] === target || nums[hi] === target) return true;
    if (nums[lo] === nums[mid] && nums[mid] === nums[hi]) {
      while (lo <= hi && nums[lo] === nums[mid]) lo++;
      while (lo <= hi && nums[hi] === nums[mid]) hi--;
      continue;
    }
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] < target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target < nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return false;
}`,
          python: `def search(nums, target):
  lo, hi = 0, len(nums) - 1
  while lo <= hi:
    mid = lo + ((hi - lo) >> 1)
    if nums[mid] == target or nums[lo] == target or nums[hi] == target:
      return True
    if nums[lo] == nums[mid] == nums[hi]:
      while lo <= hi and nums[lo] == nums[mid]:
        lo += 1
      while lo <= hi and nums[hi] == nums[mid]:
        hi -= 1
      continue
    if nums[lo] <= nums[mid]:
      if nums[lo] < target < nums[mid]:
        hi = mid - 1
      else:
        lo = mid + 1
    else:
      if nums[mid] < target < nums[hi]:
        lo = mid + 1
      else:
        hi = mid - 1
  return False`,
          java: `class Solution {
  public boolean search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (nums[mid] == target || nums[lo] == target || nums[hi] == target) return true;
      if (nums[lo] == nums[mid] && nums[mid] == nums[hi]) {
        while (lo <= hi && nums[lo] == nums[mid]) lo++;
        while (lo <= hi && nums[hi] == nums[mid]) hi--;
        continue;
      }
      if (nums[lo] <= nums[mid]) {
        if (nums[lo] < target && target < nums[mid]) hi = mid - 1;
        else lo = mid + 1;
      } else {
        if (nums[mid] < target && target < nums[hi]) lo = mid + 1;
        else hi = mid - 1;
      }
    }
    return false;
  }
}`,
          cpp: `class Solution {
public:
  bool search(vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (nums[mid] == target || nums[lo] == target || nums[hi] == target) return true;
      if (nums[lo] == nums[mid] && nums[mid] == nums[hi]) {
        while (lo <= hi && nums[lo] == nums[mid]) lo++;
        while (lo <= hi && nums[hi] == nums[mid]) hi--;
        continue;
      }
      if (nums[lo] <= nums[mid]) {
        if (nums[lo] < target && target < nums[mid]) hi = mid - 1;
        else lo = mid + 1;
      } else {
        if (nums[mid] < target && target < nums[hi]) lo = mid + 1;
        else hi = mid - 1;
      }
    }
    return false;
  }
};`,
          c: `int search(int* nums, int n, int target) {
  int lo = 0, hi = n - 1;
  while (lo <= hi) {
    int mid = lo + ((hi - lo) >> 1);
    if (nums[mid] == target || nums[lo] == target || nums[hi] == target) return 1;
    if (nums[lo] == nums[mid] && nums[mid] == nums[hi]) {
      while (lo <= hi && nums[lo] == nums[mid]) lo++;
      while (lo <= hi && nums[hi] == nums[mid]) hi--;
      continue;
    }
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] < target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target < nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return 0;
}`
        }
      }
    ]
  },
  {
    id: 5,
    level: "intermediate",
    q: "Find Minimum in Rotated Sorted Array",
    ask: "Amazon · Microsoft · Google · Apple",
    links: [LC("find-minimum-in-rotated-sorted-array"), GFG("minimum-element-in-a-sorted-and-rotated-array3611")],
    a: "nums is sorted, then rotated, with unique values. Return the smallest value (the rotation pivot).\n\nTiny example: [3, 4, 5, 1, 2] -> 1. [4, 5, 6, 7, 0, 1, 2] -> 0. Already sorted [1, 2, 3] -> 1.\n\nIf nums[mid] > nums[hi], the min is strictly to the right of mid. Otherwise mid is on the smaller run, so the min is at mid or left.\n\nOpen Brute, Optimal, and More optimal for a linear min, compare-with-hi binary search, and an early exit when the remaining range is already sorted.",
    solutions: [
      {
        name: "Brute",
        time: "O(n)",
        space: "O(1)",
        why: "Track the smallest value while walking. Rotation does not matter. This is the check you mention, then you switch to log n.",
        codes: {
          javascript: `function findMin(nums) {
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) if (nums[i] < best) best = nums[i];
  return best;
}`,
          python: `def findMin(nums):
  best = nums[0]
  for v in nums:
    if v < best:
      best = v
  return best`,
          java: `class Solution {
  public int findMin(int[] nums) {
    int best = nums[0];
    for (int v : nums) if (v < best) best = v;
    return best;
  }
}`,
          cpp: `class Solution {
public:
  int findMin(vector<int>& nums) {
    int best = nums[0];
    for (int v : nums) if (v < best) best = v;
    return best;
  }
};`,
          c: `int findMin(int* nums, int n) {
  int best = nums[0];
  for (int i = 1; i < n; i++) if (nums[i] < best) best = nums[i];
  return best;
}`
        }
      },
      {
        name: "Optimal",
        time: "O(log n)",
        space: "O(1)",
        why: "Compare mid with the right end. A drop after mid means the pivot is to the right. No drop means the pivot is mid or left. Unique values keep this strictly log n.",
        codes: {
          javascript: `function findMin(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}`,
          python: `def findMin(nums):
  lo, hi = 0, len(nums) - 1
  while lo < hi:
    mid = (lo + hi) >> 1
    if nums[mid] > nums[hi]:
      lo = mid + 1
    else:
      hi = mid
  return nums[lo]`,
          java: `class Solution {
  public int findMin(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
      int mid = (lo + hi) >> 1;
      if (nums[mid] > nums[hi]) lo = mid + 1;
      else hi = mid;
    }
    return nums[lo];
  }
}`,
          cpp: `class Solution {
public:
  int findMin(vector<int>& nums) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo < hi) {
      int mid = (lo + hi) >> 1;
      if (nums[mid] > nums[hi]) lo = mid + 1;
      else hi = mid;
    }
    return nums[lo];
  }
};`,
          c: `int findMin(int* nums, int n) {
  int lo = 0, hi = n - 1;
  while (lo < hi) {
    int mid = (lo + hi) >> 1;
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}`
        }
      },
      {
        name: "More optimal",
        time: "O(log n)",
        space: "O(1)",
        why: "Overflow-safe mid. If nums[lo] <= nums[hi], the remaining slice is already sorted, so nums[lo] is the min and you can stop. Helps the no-rotation case in one check.",
        codes: {
          javascript: `function findMin(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    if (nums[lo] <= nums[hi]) return nums[lo];
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}`,
          python: `def findMin(nums):
  lo, hi = 0, len(nums) - 1
  while lo < hi:
    if nums[lo] <= nums[hi]:
      return nums[lo]
    mid = lo + ((hi - lo) >> 1)
    if nums[mid] > nums[hi]:
      lo = mid + 1
    else:
      hi = mid
  return nums[lo]`,
          java: `class Solution {
  public int findMin(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
      if (nums[lo] <= nums[hi]) return nums[lo];
      int mid = lo + ((hi - lo) >> 1);
      if (nums[mid] > nums[hi]) lo = mid + 1;
      else hi = mid;
    }
    return nums[lo];
  }
}`,
          cpp: `class Solution {
public:
  int findMin(vector<int>& nums) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo < hi) {
      if (nums[lo] <= nums[hi]) return nums[lo];
      int mid = lo + ((hi - lo) >> 1);
      if (nums[mid] > nums[hi]) lo = mid + 1;
      else hi = mid;
    }
    return nums[lo];
  }
};`,
          c: `int findMin(int* nums, int n) {
  int lo = 0, hi = n - 1;
  while (lo < hi) {
    if (nums[lo] <= nums[hi]) return nums[lo];
    int mid = lo + ((hi - lo) >> 1);
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}`
        }
      }
    ]
  },
  {
    id: 6,
    level: "intermediate",
    q: "Find Peak Element",
    ask: "Google · Amazon · Facebook · Apple",
    links: [LC("find-peak-element"), GFG("peak-element")],
    a: "A peak is an index i where nums[i] > neighbors (ends compare against the one inner neighbor). nums[-1] and nums[n] are treated as -infinity, so a peak always exists. Return any peak index.\n\nTiny example: [1, 2, 3, 1] -> 2 (value 3). [1, 2, 1, 3, 5, 6, 4] -> 1 or 5.\n\nIf nums[mid] < nums[mid + 1], you are climbing, so a peak is to the right. Otherwise a peak is at mid or left.\n\nOpen Brute, Optimal, and More optimal for a neighbor scan, iterative slope search, and the same idea as a recursive binary search.",
    solutions: [
      {
        name: "Brute",
        time: "O(n)",
        space: "O(1)",
        why: "Check each index against its neighbors. First (or any) success is a peak. Ends only need one comparison. Simple, not log n.",
        codes: {
          javascript: `function findPeakElement(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    const leftOk = i === 0 || nums[i] > nums[i - 1];
    const rightOk = i === n - 1 || nums[i] > nums[i + 1];
    if (leftOk && rightOk) return i;
  }
  return 0;
}`,
          python: `def findPeakElement(nums):
  n = len(nums)
  for i in range(n):
    leftOk = i == 0 or nums[i] > nums[i - 1]
    rightOk = i == n - 1 or nums[i] > nums[i + 1]
    if leftOk and rightOk:
      return i
  return 0`,
          java: `class Solution {
  public int findPeakElement(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
      boolean leftOk = i == 0 || nums[i] > nums[i - 1];
      boolean rightOk = i == n - 1 || nums[i] > nums[i + 1];
      if (leftOk && rightOk) return i;
    }
    return 0;
  }
}`,
          cpp: `class Solution {
public:
  int findPeakElement(vector<int>& nums) {
    int n = (int)nums.size();
    for (int i = 0; i < n; i++) {
      bool leftOk = i == 0 || nums[i] > nums[i - 1];
      bool rightOk = i == n - 1 || nums[i] > nums[i + 1];
      if (leftOk && rightOk) return i;
    }
    return 0;
  }
};`,
          c: `int findPeakElement(int* nums, int n) {
  for (int i = 0; i < n; i++) {
    int leftOk = i == 0 || nums[i] > nums[i - 1];
    int rightOk = i == n - 1 || nums[i] > nums[i + 1];
    if (leftOk && rightOk) return i;
  }
  return 0;
}`
        }
      },
      {
        name: "Optimal",
        time: "O(log n)",
        space: "O(1)",
        why: "Slope test: if mid is less than mid + 1, drop the left (including mid). Else drop the right. The remaining range always contains a peak because the ends behave like -infinity.",
        codes: {
          javascript: `function findPeakElement(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < nums[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
          python: `def findPeakElement(nums):
  lo, hi = 0, len(nums) - 1
  while lo < hi:
    mid = (lo + hi) >> 1
    if nums[mid] < nums[mid + 1]:
      lo = mid + 1
    else:
      hi = mid
  return lo`,
          java: `class Solution {
  public int findPeakElement(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
      int mid = (lo + hi) >> 1;
      if (nums[mid] < nums[mid + 1]) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
}`,
          cpp: `class Solution {
public:
  int findPeakElement(vector<int>& nums) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo < hi) {
      int mid = (lo + hi) >> 1;
      if (nums[mid] < nums[mid + 1]) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
};`,
          c: `int findPeakElement(int* nums, int n) {
  int lo = 0, hi = n - 1;
  while (lo < hi) {
    int mid = (lo + hi) >> 1;
    if (nums[mid] < nums[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`
        }
      },
      {
        name: "More optimal",
        time: "O(log n)",
        space: "O(log n)",
        why: "Same slope rule as a recursive function. Overflow-safe mid. The extra space is the call stack of log n frames. Iterative is usually preferred; this is the form you write if they ask for recursion.",
        codes: {
          javascript: `function findPeakElement(nums) {
  function go(lo, hi) {
    if (lo === hi) return lo;
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < nums[mid + 1]) return go(mid + 1, hi);
    return go(lo, mid);
  }
  return go(0, nums.length - 1);
}`,
          python: `def findPeakElement(nums):
  def go(lo, hi):
    if lo == hi:
      return lo
    mid = lo + ((hi - lo) >> 1)
    if nums[mid] < nums[mid + 1]:
      return go(mid + 1, hi)
    return go(lo, mid)
  return go(0, len(nums) - 1)`,
          java: `class Solution {
  int go(int[] nums, int lo, int hi) {
    if (lo == hi) return lo;
    int mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < nums[mid + 1]) return go(nums, mid + 1, hi);
    return go(nums, lo, mid);
  }
  public int findPeakElement(int[] nums) {
    return go(nums, 0, nums.length - 1);
  }
}`,
          cpp: `class Solution {
  int go(vector<int>& nums, int lo, int hi) {
    if (lo == hi) return lo;
    int mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < nums[mid + 1]) return go(nums, mid + 1, hi);
    return go(nums, lo, mid);
  }
public:
  int findPeakElement(vector<int>& nums) {
    return go(nums, 0, (int)nums.size() - 1);
  }
};`,
          c: `int goPeak(int* nums, int lo, int hi) {
  if (lo == hi) return lo;
  int mid = lo + ((hi - lo) >> 1);
  if (nums[mid] < nums[mid + 1]) return goPeak(nums, mid + 1, hi);
  return goPeak(nums, lo, mid);
}
int findPeakElement(int* nums, int n) {
  return goPeak(nums, 0, n - 1);
}`
        }
      }
    ]
  }
];
