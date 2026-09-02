window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["dsa-binarysearch"] = {
  kind: "dsa",
  notes: [
    {
      title: "Low and high",
      body: "Binary search keeps a live range [low, high] that still might hold the answer. Mid is a probe inside that range. After you read nums[mid], you throw away half the range: either mid is too small (low = mid + 1) or too big (high = mid - 1), or mid is the answer and you stop. The loop must shrink the range every time or it never ends. Say the invariant out loud: every index outside [low, high] is already known to be useless."
    },
    {
      title: "Mid overflow",
      body: "The naive mid = (low + high) / 2 can overflow 32-bit int when low and high are both huge: the sum wraps to a negative, then you index garbage. Write mid = low + (high - low) / 2 (or >> 1 in languages where indices are non-negative). JavaScript numbers are floats, so the sum rarely wraps the same way, but interviews still want the safe form. Use it in every language so the habit sticks."
    },
    {
      title: "Search on the answer",
      body: "Sometimes the array is not sorted, but the answer is a number on a line: eating speed, ship capacity, largest subarray sum, minimum magnetic gap. You binary search that number. A predicate can(mid) asks 'if I pick this value, do I finish on time / stay under the limit?' If can(mid) is true, try a tighter answer (smaller speed, smaller capacity, larger gap). If false, the mid is impossible. Time is O(n log R) where R is the size of the answer range."
    },
    {
      title: "First true / last true",
      body: "A monotone boolean array looks like FFFFFTTTTT. You want the first T (lower bound, first bad version, first index >= target) or the last T (last occurrence, last day you can still wait). When mid is true, the first true is at mid or left, so high = mid (or high = mid - 1 if you store an answer). When mid is false, first true is strictly right, so low = mid + 1. Last true is the mirror: true means you can go right. Mixing these two biases is the usual off-by-one."
    },
    {
      title: "Rotated arrays",
      body: "A rotated sorted array is two sorted runs glued together, for example [4,5,6,7,0,1,2]. One of the two halves around mid is still sorted. If nums[low] <= nums[mid], the left half is sorted. If the target sits in that sorted half, search there; otherwise search the other half. Finding the minimum is the same picture: if nums[mid] > nums[high], the min is strictly right of mid."
    },
    {
      title: "Duplicates on a rotated list",
      body: "When nums[low] == nums[mid] == nums[high], you cannot tell which half is sorted. Shrink both ends by one and try again. That step is O(n) in the worst case (all equal), which is why Search in Rotated Sorted Array II is not a guaranteed log n. If duplicates are forbidden, skip this shrink and stay O(log n)."
    },
    {
      title: "Peaks and mountains",
      body: "A peak is an index bigger than its neighbors (ends compare against one neighbor). If nums[mid] < nums[mid + 1], you are on an uphill, so a peak sits to the right (including mid + 1). Otherwise a peak sits at mid or left. A mountain array goes strictly up then strictly down, so that walk finds the unique peak index."
    },
    {
      title: "Lower bound vs exact match",
      body: "Exact match returns -1 when the value is missing. Lower bound returns the first index where nums[i] >= target, which is also the insert position. Upper bound is the first index where nums[i] > target. Last occurrence is upper bound minus one, after you check the value is actually there. Interviews like you to name which of these three you are coding before you touch mid."
    },
    {
      title: "2D search",
      body: "Search a 2D Matrix (I): each row is sorted and the next row starts after the previous row ends, so the whole grid is one sorted list of length rows*cols. Index mid maps to [mid / cols][mid % cols]. Search a 2D Matrix II: rows and columns are sorted, but the grid is not one sorted list. Start at the top-right (or bottom-left) and walk: larger than target, move left; smaller, move down. That walk is O(rows + cols)."
    },
    {
      title: "Interview habit",
      body: "Write the range, the mid formula, and the predicate in one sentence before the loop. Dry-run an even length and an odd length. Check empty, one element, target smaller than all, target larger than all, and duplicates. If the loop uses while (low <= high), mid is usually discarded (low = mid + 1 or high = mid - 1). If it uses while (low < high), one side must be high = mid so you do not skip the answer. Infinite loops come from low = mid when low already equals mid."
    }
  ],
  examples: [
    {
      lang: "js",
      title: "1. Classic binary search",
      desc: "What this is\nSearch for target in a sorted array. Return its index, or -1 if it is missing.\nThe live range is the closed interval [lo, hi].\n\nWhat the code is doing\nEach round picks mid.\nEqual means we found it.\nnums[mid] < target means every index at or left of mid is too small, so lo becomes mid + 1.\nOtherwise hi becomes mid - 1.\n\nWatch out\nThe array must be sorted in the same order you compare.\nwhile (lo <= hi) is required so a one-element range is still probed.",
      code: `function binarySearch(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

console.log(binarySearch([-1, 0, 3, 5, 9, 12], 9)); // 4
console.log(binarySearch([-1, 0, 3, 5, 9, 12], 2)); // -1`,
      codes: {
        javascript: `function binarySearch(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

console.log(binarySearch([-1, 0, 3, 5, 9, 12], 9)); // 4
console.log(binarySearch([-1, 0, 3, 5, 9, 12], 2)); // -1`,
        python: `def binarySearch(nums, target):
  lo, hi = 0, len(nums) - 1
  while lo <= hi:
    mid = lo + ((hi - lo) >> 1)
    if nums[mid] == target:
      return mid
    if nums[mid] < target:
      lo = mid + 1
    else:
      hi = mid - 1
  return -1

print(binarySearch([-1, 0, 3, 5, 9, 12], 9))  # 4
print(binarySearch([-1, 0, 3, 5, 9, 12], 2))  # -1`,
        java: `class Solution {
  public int binarySearch(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
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
  int binarySearch(vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (nums[mid] == target) return mid;
      if (nums[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  }
};`,
        c: `#include <stdio.h>
int binarySearch(int* nums, int n, int target) {
  int lo = 0, hi = n - 1;
  while (lo <= hi) {
    int mid = lo + ((hi - lo) >> 1);
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`
      }
    },
    {
      lang: "js",
      title: "2. Overflow-safe mid",
      desc: "What this is\nHow you compute mid. The value must land inside [lo, hi] even when lo and hi are near 2^31 - 1.\n\nWhat the code is doing\nsafeMid adds the half-gap to lo, so the sum never needs lo + hi in a 32-bit int.\nbadMid adds lo and hi first. In Java that sum can wrap.\nBoth agree on tiny indexes such as 0 and 5.\n\nWatch out\nUse the safe form in Java, C, and C++ every time.\nIn JavaScript the number type is a float, but interviews still grade the habit.",
      code: `function safeMid(lo, hi) {
  return lo + ((hi - lo) >> 1);
}

function badMid(lo, hi) {
  return (lo + hi) >> 1; // can overflow in 32-bit ints
}

console.log(safeMid(0, 5)); // 2
console.log(badMid(0, 5));  // 2`,
      codes: {
        javascript: `function safeMid(lo, hi) {
  return lo + ((hi - lo) >> 1);
}

function badMid(lo, hi) {
  return (lo + hi) >> 1; // can overflow in 32-bit ints
}

console.log(safeMid(0, 5)); // 2
console.log(badMid(0, 5));  // 2`,
        python: `def safeMid(lo, hi):
  return lo + ((hi - lo) >> 1)

def badMid(lo, hi):
  return (lo + hi) >> 1  # fine in Python ints, still avoid the habit

print(safeMid(0, 5))  # 2
print(badMid(0, 5))   # 2`,
        java: `class Solution {
  public int safeMid(int lo, int hi) {
    return lo + ((hi - lo) >> 1);
  }
  public int badMid(int lo, int hi) {
    return (lo + hi) >> 1; // can overflow
  }
}`,
        cpp: `int safeMid(int lo, int hi) {
  return lo + ((hi - lo) >> 1);
}
int badMid(int lo, int hi) {
  return (lo + hi) >> 1; // can overflow
}`,
        c: `#include <stdio.h>
int safeMid(int lo, int hi) {
  return lo + ((hi - lo) >> 1);
}
int badMid(int lo, int hi) {
  return (lo + hi) >> 1; /* can overflow */
}`
      }
    },
    {
      lang: "js",
      title: "3. Lower bound (first >= target)",
      desc: "What this is\nThe first index i where nums[i] >= target. If every value is smaller, the answer is n (the insert-at-end index).\nThis is also Search Insert Position.\n\nWhat the code is doing\nThe range is half-open: [lo, hi) with hi starting at n.\nIf nums[mid] < target, the first good index is strictly right of mid.\nOtherwise mid might still be the first good index, so hi = mid (do not skip mid).\nWhen lo == hi, lo is the answer.\n\nWatch out\nwhile (lo < hi) plus hi = mid is the usual first-true shape.\nDo not return -1 here; missing values still have an insert slot.",
      code: `function lowerBound(nums, target) {
  let lo = 0;
  let hi = nums.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

console.log(lowerBound([1, 3, 5, 6], 5)); // 2
console.log(lowerBound([1, 3, 5, 6], 2)); // 1
console.log(lowerBound([1, 3, 5, 6], 7)); // 4`,
      codes: {
        javascript: `function lowerBound(nums, target) {
  let lo = 0;
  let hi = nums.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

console.log(lowerBound([1, 3, 5, 6], 5)); // 2
console.log(lowerBound([1, 3, 5, 6], 2)); // 1
console.log(lowerBound([1, 3, 5, 6], 7)); // 4`,
        python: `def lowerBound(nums, target):
  lo, hi = 0, len(nums)
  while lo < hi:
    mid = lo + ((hi - lo) >> 1)
    if nums[mid] < target:
      lo = mid + 1
    else:
      hi = mid
  return lo

print(lowerBound([1, 3, 5, 6], 5))  # 2
print(lowerBound([1, 3, 5, 6], 2))  # 1
print(lowerBound([1, 3, 5, 6], 7))  # 4`,
        java: `class Solution {
  public int lowerBound(int[] nums, int target) {
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
  int lowerBound(vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size();
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (nums[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
};`,
        c: `#include <stdio.h>
int lowerBound(int* nums, int n, int target) {
  int lo = 0, hi = n;
  while (lo < hi) {
    int mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`
      }
    },
    {
      lang: "js",
      title: "4. First and last true (occurrences)",
      desc: "What this is\nIn a sorted array, the first index equal to target and the last index equal to target.\nMissing target returns [-1, -1].\n\nWhat the code is doing\nfirstGE is lower bound: first index >= target.\nfirstGT is the first index > target (upper bound).\nLast occurrence is firstGT - 1.\nWe reject the pair if firstGE is off the array or the value there is not target.\n\nWatch out\nTwo biased searches beat scanning out from one match when duplicates are long.\nKeep the same mid formula in both loops.",
      code: `function firstLast(nums, target) {
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
}

console.log(firstLast([5, 7, 7, 8, 8, 10], 8)); // [3, 4]
console.log(firstLast([5, 7, 7, 8, 8, 10], 6)); // [-1, -1]`,
      codes: {
        javascript: `function firstLast(nums, target) {
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
}

console.log(firstLast([5, 7, 7, 8, 8, 10], 8)); // [3, 4]
console.log(firstLast([5, 7, 7, 8, 8, 10], 6)); // [-1, -1]`,
        python: `def firstLast(nums, target):
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
  return [L, bound(True) - 1]

print(firstLast([5, 7, 7, 8, 8, 10], 8))  # [3, 4]
print(firstLast([5, 7, 7, 8, 8, 10], 6))  # [-1, -1]`,
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
  public int[] firstLast(int[] nums, int target) {
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
  vector<int> firstLast(vector<int>& nums, int target) {
    int L = bound(nums, target, false);
    if (L == (int)nums.size() || nums[L] != target) return {-1, -1};
    return {L, bound(nums, target, true) - 1};
  }
};`,
        c: `#include <stdio.h>
int bound(int* nums, int n, int target, int gt) {
  int lo = 0, hi = n;
  while (lo < hi) {
    int mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < target || (gt && nums[mid] == target)) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
void firstLast(int* nums, int n, int target, int* outL, int* outR) {
  int L = bound(nums, n, target, 0);
  if (L == n || nums[L] != target) { *outL = -1; *outR = -1; return; }
  *outL = L;
  *outR = bound(nums, n, target, 1) - 1;
}`
      }
    },
    {
      lang: "js",
      title: "5. Search on the answer (Koko speed)",
      desc: "What this is\nThe piles are not a sorted index space. The eating speed is. Slow speeds take too many hours. Fast speeds always finish. You want the first speed that finishes in h hours.\n\nWhat the code is doing\nhours(speed) adds ceil(pile / speed) for every pile, using integer math (pile + speed - 1) / speed.\nIf that total is <= h, mid works, so try a smaller speed (hi = mid).\nOtherwise mid is too slow (lo = mid + 1).\n\nWatch out\nlo starts at 1, never 0 (division by zero).\nhi starts at the largest pile (one banana per hour on that pile is enough if h is at least the number of piles).",
      code: `function hoursFor(piles, speed) {
  let t = 0;
  for (let i = 0; i < piles.length; i++) {
    t += Math.floor((piles[i] + speed - 1) / speed);
  }
  return t;
}

function minSpeed(piles, h) {
  let lo = 1;
  let hi = piles[0];
  for (let i = 1; i < piles.length; i++) if (piles[i] > hi) hi = piles[i];
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (hoursFor(piles, mid) <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

console.log(minSpeed([3, 6, 7, 11], 8)); // 4`,
      codes: {
        javascript: `function hoursFor(piles, speed) {
  let t = 0;
  for (let i = 0; i < piles.length; i++) {
    t += Math.floor((piles[i] + speed - 1) / speed);
  }
  return t;
}

function minSpeed(piles, h) {
  let lo = 1;
  let hi = piles[0];
  for (let i = 1; i < piles.length; i++) if (piles[i] > hi) hi = piles[i];
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (hoursFor(piles, mid) <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

console.log(minSpeed([3, 6, 7, 11], 8)); // 4`,
        python: `def hoursFor(piles, speed):
  t = 0
  for p in piles:
    t += (p + speed - 1) // speed
  return t

def minSpeed(piles, h):
  lo, hi = 1, max(piles)
  while lo < hi:
    mid = lo + ((hi - lo) >> 1)
    if hoursFor(piles, mid) <= h:
      hi = mid
    else:
      lo = mid + 1
  return lo

print(minSpeed([3, 6, 7, 11], 8))  # 4`,
        java: `class Solution {
  long hoursFor(int[] piles, int speed) {
    long t = 0;
    for (int p : piles) t += (p + (long) speed - 1) / speed;
    return t;
  }
  public int minSpeed(int[] piles, int h) {
    int lo = 1, hi = piles[0];
    for (int p : piles) if (p > hi) hi = p;
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (hoursFor(piles, mid) <= h) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }
}`,
        cpp: `class Solution {
  long long hoursFor(vector<int>& piles, int speed) {
    long long t = 0;
    for (int p : piles) t += (p + (long long)speed - 1) / speed;
    return t;
  }
public:
  int minSpeed(vector<int>& piles, int h) {
    int lo = 1, hi = piles[0];
    for (int p : piles) if (p > hi) hi = p;
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (hoursFor(piles, mid) <= h) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }
};`,
        c: `#include <stdio.h>
long long hoursFor(int* piles, int n, int speed) {
  long long t = 0;
  for (int i = 0; i < n; i++) t += (piles[i] + (long long)speed - 1) / speed;
  return t;
}
int minSpeed(int* piles, int n, int h) {
  int lo = 1, hi = piles[0];
  for (int i = 1; i < n; i++) if (piles[i] > hi) hi = piles[i];
  while (lo < hi) {
    int mid = lo + ((hi - lo) >> 1);
    if (hoursFor(piles, n, mid) <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`
      }
    },
    {
      lang: "js",
      title: "6. Search in a rotated sorted array",
      desc: "What this is\nThe array was sorted, then rotated. One half around mid is still sorted. You only search the half that can hold target.\n\nWhat the code is doing\nIf nums[lo] <= nums[mid], the left half is sorted.\nThen target in [nums[lo], nums[mid]) means drop the right half.\nOtherwise the right half is sorted and you test [nums[mid], nums[hi]].\nEqual mid returns the index.\n\nWatch out\nUse < on one side and <= on the other so mid (already not equal) is not kept twice.\nThis version assumes no duplicates. Duplicates need a shrink step.",
      code: `function searchRotated(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}

console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 0)); // 4
console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 3)); // -1`,
      codes: {
        javascript: `function searchRotated(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}

console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 0)); // 4
console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 3)); // -1`,
        python: `def searchRotated(nums, target):
  lo, hi = 0, len(nums) - 1
  while lo <= hi:
    mid = lo + ((hi - lo) >> 1)
    if nums[mid] == target:
      return mid
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
  return -1

print(searchRotated([4, 5, 6, 7, 0, 1, 2], 0))  # 4
print(searchRotated([4, 5, 6, 7, 0, 1, 2], 3))  # -1`,
        java: `class Solution {
  public int searchRotated(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (nums[mid] == target) return mid;
      if (nums[lo] <= nums[mid]) {
        if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
        else lo = mid + 1;
      } else {
        if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
        else hi = mid - 1;
      }
    }
    return -1;
  }
}`,
        cpp: `class Solution {
public:
  int searchRotated(vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (nums[mid] == target) return mid;
      if (nums[lo] <= nums[mid]) {
        if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
        else lo = mid + 1;
      } else {
        if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
        else hi = mid - 1;
      }
    }
    return -1;
  }
};`,
        c: `#include <stdio.h>
int searchRotated(int* nums, int n, int target) {
  int lo = 0, hi = n - 1;
  while (lo <= hi) {
    int mid = lo + ((hi - lo) >> 1);
    if (nums[mid] == target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`
      }
    },
    {
      lang: "js",
      title: "7. Peak index (uphill / downhill)",
      desc: "What this is\nA peak is bigger than its neighbors. On a mountain, there is one peak. If mid is smaller than mid + 1, you are still climbing, so the peak is to the right.\n\nWhat the code is doing\nwhile (lo < hi) keeps a non-empty range.\nnums[mid] < nums[mid + 1] moves lo to mid + 1 (mid cannot be the peak).\nOtherwise hi = mid (mid could be the peak).\nlo and hi meet on a peak index.\n\nWatch out\nmid + 1 is safe because lo < hi implies mid <= hi - 1.\nThis finds any peak if several exist; a mountain has exactly one.",
      code: `function peakIndex(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < nums[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

console.log(peakIndex([0, 2, 1, 0])); // 1
console.log(peakIndex([1, 3, 5, 4, 2])); // 2`,
      codes: {
        javascript: `function peakIndex(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < nums[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

console.log(peakIndex([0, 2, 1, 0])); // 1
console.log(peakIndex([1, 3, 5, 4, 2])); // 2`,
        python: `def peakIndex(nums):
  lo, hi = 0, len(nums) - 1
  while lo < hi:
    mid = lo + ((hi - lo) >> 1)
    if nums[mid] < nums[mid + 1]:
      lo = mid + 1
    else:
      hi = mid
  return lo

print(peakIndex([0, 2, 1, 0]))      # 1
print(peakIndex([1, 3, 5, 4, 2]))  # 2`,
        java: `class Solution {
  public int peakIndex(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (nums[mid] < nums[mid + 1]) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
}`,
        cpp: `class Solution {
public:
  int peakIndex(vector<int>& nums) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (nums[mid] < nums[mid + 1]) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
};`,
        c: `#include <stdio.h>
int peakIndex(int* nums, int n) {
  int lo = 0, hi = n - 1;
  while (lo < hi) {
    int mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < nums[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`
      }
    },
    {
      lang: "js",
      title: "8. Sorted matrix as one list",
      desc: "What this is\nEach row is sorted, and the first value of the next row is larger than the last value of this row. The grid is one sorted sequence of length rows * cols.\n\nWhat the code is doing\nlo and hi are flat indexes from 0 to rows*cols - 1.\nmid maps to row = mid / cols and col = mid % cols.\nThen it is ordinary binary search on that value.\n\nWatch out\nThis needs the 'next row starts after this row ends' property.\nIf only rows and columns are sorted (matrix II), use a staircase from the top-right instead.",
      code: `function searchMatrix(matrix, target) {
  const rows = matrix.length, cols = matrix[0].length;
  let lo = 0, hi = rows * cols - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    const val = matrix[Math.floor(mid / cols)][mid % cols];
    if (val === target) return true;
    if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}

console.log(searchMatrix([[1, 3, 5], [7, 9, 11]], 9));  // true
console.log(searchMatrix([[1, 3, 5], [7, 9, 11]], 8));  // false`,
      codes: {
        javascript: `function searchMatrix(matrix, target) {
  const rows = matrix.length, cols = matrix[0].length;
  let lo = 0, hi = rows * cols - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    const val = matrix[Math.floor(mid / cols)][mid % cols];
    if (val === target) return true;
    if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}

console.log(searchMatrix([[1, 3, 5], [7, 9, 11]], 9));  // true
console.log(searchMatrix([[1, 3, 5], [7, 9, 11]], 8));  // false`,
        python: `def searchMatrix(matrix, target):
  rows, cols = len(matrix), len(matrix[0])
  lo, hi = 0, rows * cols - 1
  while lo <= hi:
    mid = lo + ((hi - lo) >> 1)
    val = matrix[mid // cols][mid % cols]
    if val == target:
      return True
    if val < target:
      lo = mid + 1
    else:
      hi = mid - 1
  return False

print(searchMatrix([[1, 3, 5], [7, 9, 11]], 9))  # True
print(searchMatrix([[1, 3, 5], [7, 9, 11]], 8))  # False`,
        java: `class Solution {
  public boolean searchMatrix(int[][] matrix, int target) {
    int rows = matrix.length, cols = matrix[0].length;
    int lo = 0, hi = rows * cols - 1;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      int val = matrix[mid / cols][mid % cols];
      if (val == target) return true;
      if (val < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return false;
  }
}`,
        cpp: `class Solution {
public:
  bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int rows = (int)matrix.size(), cols = (int)matrix[0].size();
    int lo = 0, hi = rows * cols - 1;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      int val = matrix[mid / cols][mid % cols];
      if (val == target) return true;
      if (val < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return false;
  }
};`,
        c: `#include <stdio.h>
int searchMatrix(int** matrix, int rows, int cols, int target) {
  int lo = 0, hi = rows * cols - 1;
  while (lo <= hi) {
    int mid = lo + ((hi - lo) >> 1);
    int val = matrix[mid / cols][mid % cols];
    if (val == target) return 1;
    if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return 0;
}`
      }
    }
  ],
  questions: [
    {
      id: 1,
      level: "beginner",
      q: "Binary Search",
      ask: "Amazon · Google · Microsoft · Meta",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/binary-search/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/who-will-win-1587115621/1"}],
      a: "nums is sorted in non-decreasing order. Return the index of target, or -1 if it is not there.\n\nTiny example: nums = [-1, 0, 3, 5, 9, 12], target = 9. The hit is index 4. Target 2 is missing, so -1.\n\nA linear scan is correct and O(n). Binary search probes mid and drops half the range each time, O(log n). Use mid = lo + (hi - lo) / 2 so 32-bit indexes cannot overflow.\n\nOpen Brute, Optimal, and More optimal for the scan, the closed-range loop, and the overflow-safe version with an early endpoint check.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(1)",
          why: "Walk left to right and compare every value. Correct on any array, sorted or not. Interviews want this only as the baseline before you cut the search in half.",
          code: `function search(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}`,
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
          code: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
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
          code: `function search(nums, target) {
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
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/search-insert-position/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/search-insert-position-of-k-in-a-sorted-array/1"}],
      a: "nums is sorted and unique. Return the index of target, or the index where it would be inserted to keep the list sorted.\n\nTiny example: [1, 3, 5, 6]. Target 5 -> 2. Target 2 -> 1. Target 7 -> 4. Target 0 -> 0.\n\nThat index is the lower bound: the first position where nums[i] >= target (or n if all values are smaller).\n\nOpen Brute, Optimal, and More optimal for a left-to-right scan, closed-range binary search, and the half-open first-true loop.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(1)",
          why: "The first index with nums[i] >= target is the insert slot. If none exist, insert at n. Fine for tiny n; too slow when they ask for log n.",
          code: `function searchInsert(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] >= target) return i;
  }
  return nums.length;
}`,
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
          code: `function searchInsert(nums, target) {
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
          code: `function searchInsert(nums, target) {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
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
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/find-first-and-last-position-of-element-in-a-sorted-array/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/first-and-last-occurrences-of-x3116/1"}],
      a: "nums is sorted in non-decreasing order and may contain duplicates. Return the first and last indexes equal to target. If target is missing, return [-1, -1].\n\nTiny example: [5, 7, 7, 8, 8, 10], target 8 -> [3, 4]. Target 6 -> [-1, -1].\n\nOne pass can record first and last. Two binary searches are O(log n) even when a long run of duplicates would make a linear expand O(n).\n\nOpen Brute, Optimal, and More optimal for the scan, two biased loops, and lower/upper bound packed into one helper.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(1)",
          why: "One left-to-right pass. First time you see target, store i. Every time you see it, update last. Missing target leaves both at -1.",
          code: `function searchRange(nums, target) {
  let first = -1, last = -1;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) {
      if (first < 0) first = i;
      last = i;
    }
  }
  return [first, last];
}`,
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
          code: `function searchRange(nums, target) {
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
          code: `function searchRange(nums, target) {
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
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/search-in-rotated-sorted-array-ii/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/search-in-rotated-array-2/1"}],
      a: "nums was sorted, then rotated, and it may contain duplicates. Return true if target exists.\n\nTiny example: [2, 5, 6, 0, 0, 1, 2], target 0 -> true. Target 3 -> false. All-equal [1, 1, 1, 1] with target 2 -> false.\n\nOne sorted half still exists around mid, except when nums[lo] == nums[mid] == nums[hi]. Then you cannot tell which half is sorted, so you shrink both ends by one.\n\nOpen Brute, Optimal, and More optimal for a scan, the rotate check plus shrink, and skipping a whole run of duplicates on each end.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(1)",
          why: "Duplicates already force O(n) in the worst case, so a linear scan is honest. Still too weak as the only answer: they want the rotated-half logic.",
          code: `function search(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return true;
  }
  return false;
}`,
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
          code: `function search(nums, target) {
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
          code: `function search(nums, target) {
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
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/minimum-element-in-a-sorted-and-rotated-array3611/1"}],
      a: "nums is sorted, then rotated, with unique values. Return the smallest value (the rotation pivot).\n\nTiny example: [3, 4, 5, 1, 2] -> 1. [4, 5, 6, 7, 0, 1, 2] -> 0. Already sorted [1, 2, 3] -> 1.\n\nIf nums[mid] > nums[hi], the min is strictly to the right of mid. Otherwise mid is on the smaller run, so the min is at mid or left.\n\nOpen Brute, Optimal, and More optimal for a linear min, compare-with-hi binary search, and an early exit when the remaining range is already sorted.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(1)",
          why: "Track the smallest value while walking. Rotation does not matter. This is the check you mention, then you switch to log n.",
          code: `function findMin(nums) {
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) if (nums[i] < best) best = nums[i];
  return best;
}`,
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
          code: `function findMin(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}`,
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
          code: `function findMin(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    if (nums[lo] <= nums[hi]) return nums[lo];
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}`,
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
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/find-peak-element/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/peak-element/1"}],
      a: "A peak is an index i where nums[i] > neighbors (ends compare against the one inner neighbor). nums[-1] and nums[n] are treated as -infinity, so a peak always exists. Return any peak index.\n\nTiny example: [1, 2, 3, 1] -> 2 (value 3). [1, 2, 1, 3, 5, 6, 4] -> 1 or 5.\n\nIf nums[mid] < nums[mid + 1], you are climbing, so a peak is to the right. Otherwise a peak is at mid or left.\n\nOpen Brute, Optimal, and More optimal for a neighbor scan, iterative slope search, and the same idea as a recursive binary search.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(1)",
          why: "Check each index against its neighbors. First (or any) success is a peak. Ends only need one comparison. Simple, not log n.",
          code: `function findPeakElement(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    const leftOk = i === 0 || nums[i] > nums[i - 1];
    const rightOk = i === n - 1 || nums[i] > nums[i + 1];
    if (leftOk && rightOk) return i;
  }
  return 0;
}`,
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
          code: `function findPeakElement(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < nums[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
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
          code: `function findPeakElement(nums) {
  function go(lo, hi) {
    if (lo === hi) return lo;
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < nums[mid + 1]) return go(mid + 1, hi);
    return go(lo, mid);
  }
  return go(0, nums.length - 1);
}`,
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
    },
    {
      id: 7,
      level: "beginner",
      q: "Peak Index in a Mountain Array",
      ask: "Amazon · Google · Bloomberg · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/peak-index-in-a-mountain-array/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/peak-element/1"}],
      a: "arr is a mountain: it strictly increases to one peak, then strictly decreases. Return the peak index. Length is at least 3.\n\nTiny example: [0, 2, 1, 0] -> 1. [0, 10, 5, 2] -> 1. [3, 4, 5, 1] -> 2.\n\nUnlike Find Peak Element, there is exactly one peak and both sides are strictly monotone. The same uphill test still works: if arr[mid] < arr[mid + 1], the peak is to the right.\n\nOpen Brute, Optimal, and More optimal for a scan, iterative binary search, and an overflow-safe loop that also compares mid - 1 when mid is not at 0.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(1)",
          why: "The peak is the unique maximum. Track the index of the largest value. Fine for tiny n; they still want log n because n can be 10^5.",
          code: `function peakIndexInMountainArray(arr) {
  let best = 0;
  for (let i = 1; i < arr.length; i++) if (arr[i] > arr[best]) best = i;
  return best;
}`,
          codes: {
            javascript: `function peakIndexInMountainArray(arr) {
  let best = 0;
  for (let i = 1; i < arr.length; i++) if (arr[i] > arr[best]) best = i;
  return best;
}`,
            python: `def peakIndexInMountainArray(arr):
  best = 0
  for i in range(1, len(arr)):
    if arr[i] > arr[best]:
      best = i
  return best`,
            java: `class Solution {
  public int peakIndexInMountainArray(int[] arr) {
    int best = 0;
    for (int i = 1; i < arr.length; i++) if (arr[i] > arr[best]) best = i;
    return best;
  }
}`,
            cpp: `class Solution {
public:
  int peakIndexInMountainArray(vector<int>& arr) {
    int best = 0;
    for (int i = 1; i < (int)arr.size(); i++) if (arr[i] > arr[best]) best = i;
    return best;
  }
};`,
            c: `int peakIndexInMountainArray(int* arr, int n) {
  int best = 0;
  for (int i = 1; i < n; i++) if (arr[i] > arr[best]) best = i;
  return best;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(log n)",
          space: "O(1)",
          why: "Uphill means lo = mid + 1. Downhill or peak means hi = mid. The two pointers meet on the unique peak. mid + 1 is in range while lo < hi.",
          code: `function peakIndexInMountainArray(arr) {
  let lo = 0, hi = arr.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < arr[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
          codes: {
            javascript: `function peakIndexInMountainArray(arr) {
  let lo = 0, hi = arr.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < arr[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
            python: `def peakIndexInMountainArray(arr):
  lo, hi = 0, len(arr) - 1
  while lo < hi:
    mid = (lo + hi) >> 1
    if arr[mid] < arr[mid + 1]:
      lo = mid + 1
    else:
      hi = mid
  return lo`,
            java: `class Solution {
  public int peakIndexInMountainArray(int[] arr) {
    int lo = 0, hi = arr.length - 1;
    while (lo < hi) {
      int mid = (lo + hi) >> 1;
      if (arr[mid] < arr[mid + 1]) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
}`,
            cpp: `class Solution {
public:
  int peakIndexInMountainArray(vector<int>& arr) {
    int lo = 0, hi = (int)arr.size() - 1;
    while (lo < hi) {
      int mid = (lo + hi) >> 1;
      if (arr[mid] < arr[mid + 1]) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
};`,
            c: `int peakIndexInMountainArray(int* arr, int n) {
  int lo = 0, hi = n - 1;
  while (lo < hi) {
    int mid = (lo + hi) >> 1;
    if (arr[mid] < arr[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(log n)",
          space: "O(1)",
          why: "Overflow-safe mid. Search inside (0, n-1) because ends cannot be the peak on a mountain. If both neighbors are smaller, return mid immediately.",
          code: `function peakIndexInMountainArray(arr) {
  let lo = 1, hi = arr.length - 2;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] > arr[mid - 1] && arr[mid] > arr[mid + 1]) return mid;
    if (arr[mid] < arr[mid + 1]) lo = mid + 1;
    else hi = mid - 1;
  }
  return lo;
}`,
          codes: {
            javascript: `function peakIndexInMountainArray(arr) {
  let lo = 1, hi = arr.length - 2;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] > arr[mid - 1] && arr[mid] > arr[mid + 1]) return mid;
    if (arr[mid] < arr[mid + 1]) lo = mid + 1;
    else hi = mid - 1;
  }
  return lo;
}`,
            python: `def peakIndexInMountainArray(arr):
  lo, hi = 1, len(arr) - 2
  while lo <= hi:
    mid = lo + ((hi - lo) >> 1)
    if arr[mid] > arr[mid - 1] and arr[mid] > arr[mid + 1]:
      return mid
    if arr[mid] < arr[mid + 1]:
      lo = mid + 1
    else:
      hi = mid - 1
  return lo`,
            java: `class Solution {
  public int peakIndexInMountainArray(int[] arr) {
    int lo = 1, hi = arr.length - 2;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (arr[mid] > arr[mid - 1] && arr[mid] > arr[mid + 1]) return mid;
      if (arr[mid] < arr[mid + 1]) lo = mid + 1;
      else hi = mid - 1;
    }
    return lo;
  }
}`,
            cpp: `class Solution {
public:
  int peakIndexInMountainArray(vector<int>& arr) {
    int lo = 1, hi = (int)arr.size() - 2;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (arr[mid] > arr[mid - 1] && arr[mid] > arr[mid + 1]) return mid;
      if (arr[mid] < arr[mid + 1]) lo = mid + 1;
      else hi = mid - 1;
    }
    return lo;
  }
};`,
            c: `int peakIndexInMountainArray(int* arr, int n) {
  int lo = 1, hi = n - 2;
  while (lo <= hi) {
    int mid = lo + ((hi - lo) >> 1);
    if (arr[mid] > arr[mid - 1] && arr[mid] > arr[mid + 1]) return mid;
    if (arr[mid] < arr[mid + 1]) lo = mid + 1;
    else hi = mid - 1;
  }
  return lo;
}`
          }
        }
      ]
    },
    {
      id: 8,
      level: "intermediate",
      q: "Koko Eating Bananas",
      ask: "Google · Amazon · Facebook · Uber",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/koko-eating-bananas/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/koko-eating-bananas/1"}],
      a: "Koko eats all piles at a fixed integer speed k bananas per hour, at most one pile per hour (ceil(pile / k) hours for that pile). Finish in h hours. Return the minimum k.\n\nTiny example: piles = [3, 6, 7, 11], h = 8 -> 4. Speed 3 needs 10 hours. Speed 4 needs 8.\n\nThe predicate 'can finish at speed mid' is monotone: faster never hurts. Binary search k from 1 to max(piles).\n\nOpen Brute, Optimal, and More optimal for trying every speed, binary search with integer ceil, and a long accumulator so hour sums cannot wrap.",
      solutions: [
        {
          name: "Brute",
          time: "O(max(piles) * n)",
          space: "O(1)",
          why: "Try k = 1, 2, ... max pile. First k that finishes in h hours is the answer. Correct, but max pile can be 10^9 so this times out.",
          code: `function minEatingSpeed(piles, h) {
  function hours(k) {
    let t = 0;
    for (let i = 0; i < piles.length; i++) t += Math.ceil(piles[i] / k);
    return t;
  }
  const cap = Math.max.apply(null, piles);
  for (let k = 1; k <= cap; k++) if (hours(k) <= h) return k;
  return cap;
}`,
          codes: {
            javascript: `function minEatingSpeed(piles, h) {
  function hours(k) {
    let t = 0;
    for (let i = 0; i < piles.length; i++) t += Math.ceil(piles[i] / k);
    return t;
  }
  const cap = Math.max.apply(null, piles);
  for (let k = 1; k <= cap; k++) if (hours(k) <= h) return k;
  return cap;
}`,
            python: `def minEatingSpeed(piles, h):
  def hours(k):
    return sum((p + k - 1) // k for p in piles)
  cap = max(piles)
  for k in range(1, cap + 1):
    if hours(k) <= h:
      return k
  return cap`,
            java: `class Solution {
  long hours(int[] piles, int k) {
    long t = 0;
    for (int p : piles) t += (p + (long) k - 1) / k;
    return t;
  }
  public int minEatingSpeed(int[] piles, int h) {
    int cap = piles[0];
    for (int p : piles) if (p > cap) cap = p;
    for (int k = 1; k <= cap; k++) if (hours(piles, k) <= h) return k;
    return cap;
  }
}`,
            cpp: `class Solution {
  long long hours(vector<int>& piles, int k) {
    long long t = 0;
    for (int p : piles) t += (p + (long long)k - 1) / k;
    return t;
  }
public:
  int minEatingSpeed(vector<int>& piles, int h) {
    int cap = piles[0];
    for (int p : piles) if (p > cap) cap = p;
    for (int k = 1; k <= cap; k++) if (hours(piles, k) <= h) return k;
    return cap;
  }
};`,
            c: `long long hoursK(int* piles, int n, int k) {
  long long t = 0;
  for (int i = 0; i < n; i++) t += (piles[i] + (long long)k - 1) / k;
  return t;
}
int minEatingSpeed(int* piles, int n, int h) {
  int cap = piles[0];
  for (int i = 1; i < n; i++) if (piles[i] > cap) cap = piles[i];
  for (int k = 1; k <= cap; k++) if (hoursK(piles, n, k) <= h) return k;
  return cap;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n log max(piles))",
          space: "O(1)",
          why: "Binary search the first speed that finishes on time. If mid works, try slower (hi = mid). If not, need faster (lo = mid + 1). Each check walks all piles.",
          code: `function minEatingSpeed(piles, h) {
  function hours(k) {
    let t = 0;
    for (let i = 0; i < piles.length; i++) t += Math.floor((piles[i] + k - 1) / k);
    return t;
  }
  let lo = 1, hi = piles[0];
  for (let i = 1; i < piles.length; i++) if (piles[i] > hi) hi = piles[i];
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (hours(mid) <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
          codes: {
            javascript: `function minEatingSpeed(piles, h) {
  function hours(k) {
    let t = 0;
    for (let i = 0; i < piles.length; i++) t += Math.floor((piles[i] + k - 1) / k);
    return t;
  }
  let lo = 1, hi = piles[0];
  for (let i = 1; i < piles.length; i++) if (piles[i] > hi) hi = piles[i];
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (hours(mid) <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
            python: `def minEatingSpeed(piles, h):
  def hours(k):
    return sum((p + k - 1) // k for p in piles)
  lo, hi = 1, max(piles)
  while lo < hi:
    mid = (lo + hi) >> 1
    if hours(mid) <= h:
      hi = mid
    else:
      lo = mid + 1
  return lo`,
            java: `class Solution {
  long hours(int[] piles, int k) {
    long t = 0;
    for (int p : piles) t += (p + (long) k - 1) / k;
    return t;
  }
  public int minEatingSpeed(int[] piles, int h) {
    int lo = 1, hi = piles[0];
    for (int p : piles) if (p > hi) hi = p;
    while (lo < hi) {
      int mid = (lo + hi) >> 1;
      if (hours(piles, mid) <= h) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }
}`,
            cpp: `class Solution {
  long long hours(vector<int>& piles, int k) {
    long long t = 0;
    for (int p : piles) t += (p + (long long)k - 1) / k;
    return t;
  }
public:
  int minEatingSpeed(vector<int>& piles, int h) {
    int lo = 1, hi = piles[0];
    for (int p : piles) if (p > hi) hi = p;
    while (lo < hi) {
      int mid = (lo + hi) >> 1;
      if (hours(piles, mid) <= h) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }
};`,
            c: `long long hoursK(int* piles, int n, int k) {
  long long t = 0;
  for (int i = 0; i < n; i++) t += (piles[i] + (long long)k - 1) / k;
  return t;
}
int minEatingSpeed(int* piles, int n, int h) {
  int lo = 1, hi = piles[0];
  for (int i = 1; i < n; i++) if (piles[i] > hi) hi = piles[i];
  while (lo < hi) {
    int mid = (lo + hi) >> 1;
    if (hoursK(piles, n, mid) <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n log max(piles))",
          space: "O(1)",
          why: "Overflow-safe mid. Integer ceil only (no float). Early exit in the hour count when the running total already exceeds h, so a failing speed can fail before the last pile.",
          code: `function minEatingSpeed(piles, h) {
  function ok(k) {
    let t = 0;
    for (let i = 0; i < piles.length; i++) {
      t += Math.floor((piles[i] + k - 1) / k);
      if (t > h) return false;
    }
    return true;
  }
  let lo = 1, hi = piles[0];
  for (let i = 1; i < piles.length; i++) if (piles[i] > hi) hi = piles[i];
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (ok(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
          codes: {
            javascript: `function minEatingSpeed(piles, h) {
  function ok(k) {
    let t = 0;
    for (let i = 0; i < piles.length; i++) {
      t += Math.floor((piles[i] + k - 1) / k);
      if (t > h) return false;
    }
    return true;
  }
  let lo = 1, hi = piles[0];
  for (let i = 1; i < piles.length; i++) if (piles[i] > hi) hi = piles[i];
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (ok(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
            python: `def minEatingSpeed(piles, h):
  def ok(k):
    t = 0
    for p in piles:
      t += (p + k - 1) // k
      if t > h:
        return False
    return True
  lo, hi = 1, max(piles)
  while lo < hi:
    mid = lo + ((hi - lo) >> 1)
    if ok(mid):
      hi = mid
    else:
      lo = mid + 1
  return lo`,
            java: `class Solution {
  boolean ok(int[] piles, int k, int h) {
    long t = 0;
    for (int p : piles) {
      t += (p + (long) k - 1) / k;
      if (t > h) return false;
    }
    return true;
  }
  public int minEatingSpeed(int[] piles, int h) {
    int lo = 1, hi = piles[0];
    for (int p : piles) if (p > hi) hi = p;
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (ok(piles, mid, h)) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }
}`,
            cpp: `class Solution {
  bool ok(vector<int>& piles, int k, int h) {
    long long t = 0;
    for (int p : piles) {
      t += (p + (long long)k - 1) / k;
      if (t > h) return false;
    }
    return true;
  }
public:
  int minEatingSpeed(vector<int>& piles, int h) {
    int lo = 1, hi = piles[0];
    for (int p : piles) if (p > hi) hi = p;
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (ok(piles, mid, h)) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }
};`,
            c: `int okSpeed(int* piles, int n, int k, int h) {
  long long t = 0;
  for (int i = 0; i < n; i++) {
    t += (piles[i] + (long long)k - 1) / k;
    if (t > h) return 0;
  }
  return 1;
}
int minEatingSpeed(int* piles, int n, int h) {
  int lo = 1, hi = piles[0];
  for (int i = 1; i < n; i++) if (piles[i] > hi) hi = piles[i];
  while (lo < hi) {
    int mid = lo + ((hi - lo) >> 1);
    if (okSpeed(piles, n, mid, h)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`
          }
        }
      ]
    },
    {
      id: 9,
      level: "intermediate",
      q: "Capacity To Ship Packages Within D Days",
      ask: "Amazon · Facebook · Google · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/capacity-to-ship-packages-within-d-days/1"}],
      a: "Packages must ship in order. Each day you load a contiguous prefix that still fits in capacity cap. Return the smallest cap that finishes in days days.\n\nTiny example: weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], days = 5 -> 15. Cap cannot be smaller than the heaviest package.\n\nSame monotone search as Koko: lo = max(weight), hi = sum(weights). can(cap) counts how many days that cap needs.\n\nOpen Brute, Optimal, and More optimal for trying every cap, binary search, and early fail when the day count already exceeds D.",
      solutions: [
        {
          name: "Brute",
          time: "O(sum * n)",
          space: "O(1)",
          why: "Try every capacity from the heaviest box up to the total sum. First success is the answer. Sum can be huge, so this is only the idea sketch.",
          code: `function shipWithinDays(weights, days) {
  function need(cap) {
    let d = 1, load = 0;
    for (let i = 0; i < weights.length; i++) {
      if (load + weights[i] > cap) { d++; load = 0; }
      load += weights[i];
    }
    return d;
  }
  let lo = 0, hi = 0;
  for (let i = 0; i < weights.length; i++) {
    if (weights[i] > lo) lo = weights[i];
    hi += weights[i];
  }
  for (let cap = lo; cap <= hi; cap++) if (need(cap) <= days) return cap;
  return hi;
}`,
          codes: {
            javascript: `function shipWithinDays(weights, days) {
  function need(cap) {
    let d = 1, load = 0;
    for (let i = 0; i < weights.length; i++) {
      if (load + weights[i] > cap) { d++; load = 0; }
      load += weights[i];
    }
    return d;
  }
  let lo = 0, hi = 0;
  for (let i = 0; i < weights.length; i++) {
    if (weights[i] > lo) lo = weights[i];
    hi += weights[i];
  }
  for (let cap = lo; cap <= hi; cap++) if (need(cap) <= days) return cap;
  return hi;
}`,
            python: `def shipWithinDays(weights, days):
  def need(cap):
    d, load = 1, 0
    for w in weights:
      if load + w > cap:
        d += 1
        load = 0
      load += w
    return d
  lo, hi = max(weights), sum(weights)
  for cap in range(lo, hi + 1):
    if need(cap) <= days:
      return cap
  return hi`,
            java: `class Solution {
  int need(int[] weights, int cap) {
    int d = 1, load = 0;
    for (int w : weights) {
      if (load + w > cap) { d++; load = 0; }
      load += w;
    }
    return d;
  }
  public int shipWithinDays(int[] weights, int days) {
    int lo = 0, hi = 0;
    for (int w : weights) { if (w > lo) lo = w; hi += w; }
    for (int cap = lo; cap <= hi; cap++) if (need(weights, cap) <= days) return cap;
    return hi;
  }
}`,
            cpp: `class Solution {
  int need(vector<int>& weights, int cap) {
    int d = 1, load = 0;
    for (int w : weights) {
      if (load + w > cap) { d++; load = 0; }
      load += w;
    }
    return d;
  }
public:
  int shipWithinDays(vector<int>& weights, int days) {
    int lo = 0, hi = 0;
    for (int w : weights) { if (w > lo) lo = w; hi += w; }
    for (int cap = lo; cap <= hi; cap++) if (need(weights, cap) <= days) return cap;
    return hi;
  }
};`,
            c: `int needCap(int* w, int n, int cap) {
  int d = 1, load = 0;
  for (int i = 0; i < n; i++) {
    if (load + w[i] > cap) { d++; load = 0; }
    load += w[i];
  }
  return d;
}
int shipWithinDays(int* weights, int n, int days) {
  int lo = 0, hi = 0;
  for (int i = 0; i < n; i++) { if (weights[i] > lo) lo = weights[i]; hi += weights[i]; }
  for (int cap = lo; cap <= hi; cap++) if (needCap(weights, n, cap) <= days) return cap;
  return hi;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n log sum)",
          space: "O(1)",
          why: "Binary search capacity. Greedy load until the next package would overflow, then start a new day. If that day count is <= D, try a smaller cap.",
          code: `function shipWithinDays(weights, days) {
  function need(cap) {
    let d = 1, load = 0;
    for (let i = 0; i < weights.length; i++) {
      if (load + weights[i] > cap) { d++; load = 0; }
      load += weights[i];
    }
    return d;
  }
  let lo = 0, hi = 0;
  for (let i = 0; i < weights.length; i++) {
    if (weights[i] > lo) lo = weights[i];
    hi += weights[i];
  }
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (need(mid) <= days) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
          codes: {
            javascript: `function shipWithinDays(weights, days) {
  function need(cap) {
    let d = 1, load = 0;
    for (let i = 0; i < weights.length; i++) {
      if (load + weights[i] > cap) { d++; load = 0; }
      load += weights[i];
    }
    return d;
  }
  let lo = 0, hi = 0;
  for (let i = 0; i < weights.length; i++) {
    if (weights[i] > lo) lo = weights[i];
    hi += weights[i];
  }
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (need(mid) <= days) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
            python: `def shipWithinDays(weights, days):
  def need(cap):
    d, load = 1, 0
    for w in weights:
      if load + w > cap:
        d += 1
        load = 0
      load += w
    return d
  lo, hi = max(weights), sum(weights)
  while lo < hi:
    mid = (lo + hi) >> 1
    if need(mid) <= days:
      hi = mid
    else:
      lo = mid + 1
  return lo`,
            java: `class Solution {
  int need(int[] weights, int cap) {
    int d = 1, load = 0;
    for (int w : weights) {
      if (load + w > cap) { d++; load = 0; }
      load += w;
    }
    return d;
  }
  public int shipWithinDays(int[] weights, int days) {
    int lo = 0, hi = 0;
    for (int w : weights) { if (w > lo) lo = w; hi += w; }
    while (lo < hi) {
      int mid = (lo + hi) >> 1;
      if (need(weights, mid) <= days) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }
}`,
            cpp: `class Solution {
  int need(vector<int>& weights, int cap) {
    int d = 1, load = 0;
    for (int w : weights) {
      if (load + w > cap) { d++; load = 0; }
      load += w;
    }
    return d;
  }
public:
  int shipWithinDays(vector<int>& weights, int days) {
    int lo = 0, hi = 0;
    for (int w : weights) { if (w > lo) lo = w; hi += w; }
    while (lo < hi) {
      int mid = (lo + hi) >> 1;
      if (need(weights, mid) <= days) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }
};`,
            c: `int needCap(int* w, int n, int cap) {
  int d = 1, load = 0;
  for (int i = 0; i < n; i++) {
    if (load + w[i] > cap) { d++; load = 0; }
    load += w[i];
  }
  return d;
}
int shipWithinDays(int* weights, int n, int days) {
  int lo = 0, hi = 0;
  for (int i = 0; i < n; i++) { if (weights[i] > lo) lo = weights[i]; hi += weights[i]; }
  while (lo < hi) {
    int mid = (lo + hi) >> 1;
    if (needCap(weights, n, mid) <= days) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n log sum)",
          space: "O(1)",
          why: "Overflow-safe mid. Stop counting days as soon as d exceeds the limit. Same answer, fewer wasted additions on a capacity that is clearly too small.",
          code: `function shipWithinDays(weights, days) {
  function ok(cap) {
    let d = 1, load = 0;
    for (let i = 0; i < weights.length; i++) {
      if (weights[i] > cap) return false;
      if (load + weights[i] > cap) {
        d++;
        load = 0;
        if (d > days) return false;
      }
      load += weights[i];
    }
    return true;
  }
  let lo = 0, hi = 0;
  for (let i = 0; i < weights.length; i++) {
    if (weights[i] > lo) lo = weights[i];
    hi += weights[i];
  }
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (ok(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
          codes: {
            javascript: `function shipWithinDays(weights, days) {
  function ok(cap) {
    let d = 1, load = 0;
    for (let i = 0; i < weights.length; i++) {
      if (weights[i] > cap) return false;
      if (load + weights[i] > cap) {
        d++;
        load = 0;
        if (d > days) return false;
      }
      load += weights[i];
    }
    return true;
  }
  let lo = 0, hi = 0;
  for (let i = 0; i < weights.length; i++) {
    if (weights[i] > lo) lo = weights[i];
    hi += weights[i];
  }
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (ok(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
            python: `def shipWithinDays(weights, days):
  def ok(cap):
    d, load = 1, 0
    for w in weights:
      if w > cap:
        return False
      if load + w > cap:
        d += 1
        load = 0
        if d > days:
          return False
      load += w
    return True
  lo, hi = max(weights), sum(weights)
  while lo < hi:
    mid = lo + ((hi - lo) >> 1)
    if ok(mid):
      hi = mid
    else:
      lo = mid + 1
  return lo`,
            java: `class Solution {
  boolean ok(int[] weights, int cap, int days) {
    int d = 1, load = 0;
    for (int w : weights) {
      if (w > cap) return false;
      if (load + w > cap) {
        d++;
        load = 0;
        if (d > days) return false;
      }
      load += w;
    }
    return true;
  }
  public int shipWithinDays(int[] weights, int days) {
    int lo = 0, hi = 0;
    for (int w : weights) { if (w > lo) lo = w; hi += w; }
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (ok(weights, mid, days)) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }
}`,
            cpp: `class Solution {
  bool ok(vector<int>& weights, int cap, int days) {
    int d = 1, load = 0;
    for (int w : weights) {
      if (w > cap) return false;
      if (load + w > cap) {
        d++; load = 0;
        if (d > days) return false;
      }
      load += w;
    }
    return true;
  }
public:
  int shipWithinDays(vector<int>& weights, int days) {
    int lo = 0, hi = 0;
    for (int w : weights) { if (w > lo) lo = w; hi += w; }
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (ok(weights, mid, days)) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }
};`,
            c: `int okCap(int* w, int n, int cap, int days) {
  int d = 1, load = 0;
  for (int i = 0; i < n; i++) {
    if (w[i] > cap) return 0;
    if (load + w[i] > cap) {
      d++; load = 0;
      if (d > days) return 0;
    }
    load += w[i];
  }
  return 1;
}
int shipWithinDays(int* weights, int n, int days) {
  int lo = 0, hi = 0;
  for (int i = 0; i < n; i++) { if (weights[i] > lo) lo = weights[i]; hi += weights[i]; }
  while (lo < hi) {
    int mid = lo + ((hi - lo) >> 1);
    if (okCap(weights, n, mid, days)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`
          }
        }
      ]
    },
    {
      id: 10,
      level: "advanced",
      q: "Split Array Largest Sum",
      ask: "Google · Amazon · Facebook · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/split-array-largest-sum/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/split-array-largest-sum/1"}],
      a: "Split nums into k non-empty contiguous subarrays. Minimize the largest subarray sum among those pieces.\n\nTiny example: nums = [7, 2, 5, 10, 8], k = 2. Best split is [7, 2, 5] and [10, 8], largest sum 18.\n\nBrute tries every cut. DP stores the best largest-sum for prefixes. The interview finish line is binary search on the largest sum, same shape as ship-packages: lo = max(nums), hi = sum, and a greedy count of how many pieces a limit needs.\n\nOpen Brute, Optimal, and More optimal for recursion, the DP table, and answer-space binary search.",
      solutions: [
        {
          name: "Brute",
          time: "O(n^{k-1})",
          space: "O(n)",
          why: "Recurse on the start index and how many pieces are left. Try every next cut. Exponential in k. Good for explaining the search tree, not for n = 1000.",
          code: `function splitArray(nums, k) {
  const n = nums.length;
  const inf = 1e15;
  function go(i, left) {
    if (left === 1) {
      let s = 0;
      for (let t = i; t < n; t++) s += nums[t];
      return s;
    }
    let best = inf, run = 0;
    for (let j = i; j <= n - left; j++) {
      run += nums[j];
      const rest = go(j + 1, left - 1);
      const cost = run > rest ? run : rest;
      if (cost < best) best = cost;
    }
    return best;
  }
  return go(0, k);
}`,
          codes: {
            javascript: `function splitArray(nums, k) {
  const n = nums.length;
  const inf = 1e15;
  function go(i, left) {
    if (left === 1) {
      let s = 0;
      for (let t = i; t < n; t++) s += nums[t];
      return s;
    }
    let best = inf, run = 0;
    for (let j = i; j <= n - left; j++) {
      run += nums[j];
      const rest = go(j + 1, left - 1);
      const cost = run > rest ? run : rest;
      if (cost < best) best = cost;
    }
    return best;
  }
  return go(0, k);
}`,
            python: `def splitArray(nums, k):
  n = len(nums)
  inf = 10 ** 18
  def go(i, left):
    if left == 1:
      return sum(nums[i:])
    best, run = inf, 0
    for j in range(i, n - left + 1):
      run += nums[j]
      rest = go(j + 1, left - 1)
      cost = run if run > rest else rest
      if cost < best:
        best = cost
    return best
  return go(0, k)`,
            java: `class Solution {
  long go(int[] nums, int i, int left) {
    int n = nums.length;
    if (left == 1) {
      long s = 0;
      for (int t = i; t < n; t++) s += nums[t];
      return s;
    }
    long best = Long.MAX_VALUE / 4, run = 0;
    for (int j = i; j <= n - left; j++) {
      run += nums[j];
      long rest = go(nums, j + 1, left - 1);
      long cost = Math.max(run, rest);
      if (cost < best) best = cost;
    }
    return best;
  }
  public int splitArray(int[] nums, int k) {
    return (int) go(nums, 0, k);
  }
}`,
            cpp: `class Solution {
  long long go(vector<int>& nums, int i, int left) {
    int n = (int)nums.size();
    if (left == 1) {
      long long s = 0;
      for (int t = i; t < n; t++) s += nums[t];
      return s;
    }
    long long best = (1LL << 60), run = 0;
    for (int j = i; j <= n - left; j++) {
      run += nums[j];
      long long rest = go(nums, j + 1, left - 1);
      long long cost = run > rest ? run : rest;
      if (cost < best) best = cost;
    }
    return best;
  }
public:
  int splitArray(vector<int>& nums, int k) {
    return (int)go(nums, 0, k);
  }
};`,
            c: `long long goSplit(int* nums, int n, int i, int left) {
  if (left == 1) {
    long long s = 0;
    for (int t = i; t < n; t++) s += nums[t];
    return s;
  }
  long long best = 1000000000000000LL, run = 0;
  for (int j = i; j <= n - left; j++) {
    run += nums[j];
    long long rest = goSplit(nums, n, j + 1, left - 1);
    long long cost = run > rest ? run : rest;
    if (cost < best) best = cost;
  }
  return best;
}
int splitArray(int* nums, int n, int k) {
  return (int)goSplit(nums, n, 0, k);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n^2 k)",
          space: "O(n k)",
          why: "dp[i][p] = min largest-sum using the first i numbers and p subarrays. Transition: last piece is nums[j..i-1], cost = max(dp[j][p-1], prefix[i]-prefix[j]). Polynomial, still slower than binary search for interview n.",
          code: `function splitArray(nums, k) {
  const n = nums.length;
  const prefix = Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  const inf = 1e15;
  const dp = Array.from({ length: n + 1 }, function () {
    return Array(k + 1).fill(inf);
  });
  dp[0][0] = 0;
  for (let i = 1; i <= n; i++) {
    for (let p = 1; p <= k && p <= i; p++) {
      for (let j = p - 1; j < i; j++) {
        const piece = prefix[i] - prefix[j];
        const cost = dp[j][p - 1] > piece ? dp[j][p - 1] : piece;
        if (cost < dp[i][p]) dp[i][p] = cost;
      }
    }
  }
  return dp[n][k];
}`,
          codes: {
            javascript: `function splitArray(nums, k) {
  const n = nums.length;
  const prefix = Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  const inf = 1e15;
  const dp = Array.from({ length: n + 1 }, function () {
    return Array(k + 1).fill(inf);
  });
  dp[0][0] = 0;
  for (let i = 1; i <= n; i++) {
    for (let p = 1; p <= k && p <= i; p++) {
      for (let j = p - 1; j < i; j++) {
        const piece = prefix[i] - prefix[j];
        const cost = dp[j][p - 1] > piece ? dp[j][p - 1] : piece;
        if (cost < dp[i][p]) dp[i][p] = cost;
      }
    }
  }
  return dp[n][k];
}`,
            python: `def splitArray(nums, k):
  n = len(nums)
  prefix = [0] * (n + 1)
  for i, v in enumerate(nums):
    prefix[i + 1] = prefix[i] + v
  inf = 10 ** 18
  dp = [[inf] * (k + 1) for _ in range(n + 1)]
  dp[0][0] = 0
  for i in range(1, n + 1):
    for p in range(1, min(k, i) + 1):
      for j in range(p - 1, i):
        piece = prefix[i] - prefix[j]
        cost = dp[j][p - 1] if dp[j][p - 1] > piece else piece
        if cost < dp[i][p]:
          dp[i][p] = cost
  return dp[n][k]`,
            java: `class Solution {
  public int splitArray(int[] nums, int k) {
    int n = nums.length;
    long[] prefix = new long[n + 1];
    for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
    long inf = Long.MAX_VALUE / 4;
    long[][] dp = new long[n + 1][k + 1];
    for (int i = 0; i <= n; i++) java.util.Arrays.fill(dp[i], inf);
    dp[0][0] = 0;
    for (int i = 1; i <= n; i++) {
      for (int p = 1; p <= k && p <= i; p++) {
        for (int j = p - 1; j < i; j++) {
          long piece = prefix[i] - prefix[j];
          long cost = Math.max(dp[j][p - 1], piece);
          if (cost < dp[i][p]) dp[i][p] = cost;
        }
      }
    }
    return (int) dp[n][k];
  }
}`,
            cpp: `class Solution {
public:
  int splitArray(vector<int>& nums, int k) {
    int n = (int)nums.size();
    vector<long long> prefix(n + 1, 0);
    for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
    const long long inf = (1LL << 60);
    vector<vector<long long>> dp(n + 1, vector<long long>(k + 1, inf));
    dp[0][0] = 0;
    for (int i = 1; i <= n; i++) {
      for (int p = 1; p <= k && p <= i; p++) {
        for (int j = p - 1; j < i; j++) {
          long long piece = prefix[i] - prefix[j];
          long long cost = dp[j][p - 1] > piece ? dp[j][p - 1] : piece;
          if (cost < dp[i][p]) dp[i][p] = cost;
        }
      }
    }
    return (int)dp[n][k];
  }
};`,
            c: `#include <stdlib.h>
int splitArray(int* nums, int n, int k) {
  long long* prefix = (long long*)calloc(n + 1, sizeof(long long));
  for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  long long inf = 1000000000000000LL;
  int cells = (n + 1) * (k + 1);
  long long* dp = (long long*)malloc(sizeof(long long) * cells);
  for (int i = 0; i < cells; i++) dp[i] = inf;
  dp[0] = 0;
  for (int i = 1; i <= n; i++) {
    for (int p = 1; p <= k && p <= i; p++) {
      for (int j = p - 1; j < i; j++) {
        long long piece = prefix[i] - prefix[j];
        long long prev = dp[j * (k + 1) + (p - 1)];
        long long cost = prev > piece ? prev : piece;
        int idx = i * (k + 1) + p;
        if (cost < dp[idx]) dp[idx] = cost;
      }
    }
  }
  int ans = (int)dp[n * (k + 1) + k];
  free(prefix); free(dp);
  return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n log sum)",
          space: "O(1)",
          why: "Binary search the largest allowed piece sum. Greedy: grow a run until the next number would exceed mid, then start a new piece. If you need more than k pieces, mid is too small. This is the usual interview solution.",
          code: `function splitArray(nums, k) {
  function ok(lim) {
    let pieces = 1, run = 0;
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] > lim) return false;
      if (run + nums[i] > lim) {
        pieces++;
        run = 0;
        if (pieces > k) return false;
      }
      run += nums[i];
    }
    return true;
  }
  let lo = 0, hi = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > lo) lo = nums[i];
    hi += nums[i];
  }
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (ok(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
          codes: {
            javascript: `function splitArray(nums, k) {
  function ok(lim) {
    let pieces = 1, run = 0;
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] > lim) return false;
      if (run + nums[i] > lim) {
        pieces++;
        run = 0;
        if (pieces > k) return false;
      }
      run += nums[i];
    }
    return true;
  }
  let lo = 0, hi = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > lo) lo = nums[i];
    hi += nums[i];
  }
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (ok(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
            python: `def splitArray(nums, k):
  def ok(lim):
    pieces, run = 1, 0
    for v in nums:
      if v > lim:
        return False
      if run + v > lim:
        pieces += 1
        run = 0
        if pieces > k:
          return False
      run += v
    return True
  lo, hi = max(nums), sum(nums)
  while lo < hi:
    mid = lo + ((hi - lo) >> 1)
    if ok(mid):
      hi = mid
    else:
      lo = mid + 1
  return lo`,
            java: `class Solution {
  boolean ok(int[] nums, int k, int lim) {
    int pieces = 1, run = 0;
    for (int v : nums) {
      if (v > lim) return false;
      if (run + v > lim) {
        pieces++;
        run = 0;
        if (pieces > k) return false;
      }
      run += v;
    }
    return true;
  }
  public int splitArray(int[] nums, int k) {
    int lo = 0, hi = 0;
    for (int v : nums) { if (v > lo) lo = v; hi += v; }
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (ok(nums, k, mid)) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }
}`,
            cpp: `class Solution {
  bool ok(vector<int>& nums, int k, int lim) {
    int pieces = 1, run = 0;
    for (int v : nums) {
      if (v > lim) return false;
      if (run + v > lim) {
        pieces++; run = 0;
        if (pieces > k) return false;
      }
      run += v;
    }
    return true;
  }
public:
  int splitArray(vector<int>& nums, int k) {
    int lo = 0, hi = 0;
    for (int v : nums) { if (v > lo) lo = v; hi += v; }
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (ok(nums, k, mid)) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }
};`,
            c: `int okSplit(int* nums, int n, int k, int lim) {
  int pieces = 1, run = 0;
  for (int i = 0; i < n; i++) {
    if (nums[i] > lim) return 0;
    if (run + nums[i] > lim) {
      pieces++; run = 0;
      if (pieces > k) return 0;
    }
    run += nums[i];
  }
  return 1;
}
int splitArray(int* nums, int n, int k) {
  int lo = 0, hi = 0;
  for (int i = 0; i < n; i++) { if (nums[i] > lo) lo = nums[i]; hi += nums[i]; }
  while (lo < hi) {
    int mid = lo + ((hi - lo) >> 1);
    if (okSplit(nums, n, k, mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`
          }
        }
      ]
    },
    {
      id: 11,
      level: "advanced",
      q: "Median of Two Sorted Arrays",
      ask: "Google · Amazon · Microsoft · Apple · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/median-of-two-sorted-arrays/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/median-of-2-sorted-arrays-of-different-sizes/1"}],
      a: "Two sorted arrays a and b. Return the median of the combined sorted order. Odd total length: the middle value. Even: average of the two middle values. Required interview bound is O(log(min(m, n))).\n\nTiny example: [1, 3] and [2] -> 2. [1, 2] and [3, 4] -> 2.5.\n\nMerge is O(m+n). Two pointers to the median index skip extra memory. The hard solution partitions the shorter array so the left side has (m+n+1)/2 items and every left value is <= every right value.\n\nOpen Brute, Optimal, and More optimal for merge, two-pointer kth, and the partition binary search.",
      solutions: [
        {
          name: "Brute",
          time: "O(m + n)",
          space: "O(m + n)",
          why: "Merge the two sorted lists into one, then pick the middle one or two values. Easy to code, extra memory, and not the log bound they asked for.",
          code: `function findMedianSortedArrays(a, b) {
  const m = a.length, n = b.length, merged = [];
  let i = 0, j = 0;
  while (i < m && j < n) {
    if (a[i] <= b[j]) merged.push(a[i++]);
    else merged.push(b[j++]);
  }
  while (i < m) merged.push(a[i++]);
  while (j < n) merged.push(b[j++]);
  const mid = Math.floor((m + n) / 2);
  if ((m + n) % 2 === 1) return merged[mid];
  return (merged[mid - 1] + merged[mid]) / 2;
}`,
          codes: {
            javascript: `function findMedianSortedArrays(a, b) {
  const m = a.length, n = b.length, merged = [];
  let i = 0, j = 0;
  while (i < m && j < n) {
    if (a[i] <= b[j]) merged.push(a[i++]);
    else merged.push(b[j++]);
  }
  while (i < m) merged.push(a[i++]);
  while (j < n) merged.push(b[j++]);
  const mid = Math.floor((m + n) / 2);
  if ((m + n) % 2 === 1) return merged[mid];
  return (merged[mid - 1] + merged[mid]) / 2;
}`,
            python: `def findMedianSortedArrays(a, b):
  m, n = len(a), len(b)
  merged, i, j = [], 0, 0
  while i < m and j < n:
    if a[i] <= b[j]:
      merged.append(a[i]); i += 1
    else:
      merged.append(b[j]); j += 1
  merged.extend(a[i:])
  merged.extend(b[j:])
  mid = (m + n) // 2
  if (m + n) % 2:
    return float(merged[mid])
  return (merged[mid - 1] + merged[mid]) / 2.0`,
            java: `class Solution {
  public double findMedianSortedArrays(int[] a, int[] b) {
    int m = a.length, n = b.length;
    int[] merged = new int[m + n];
    int i = 0, j = 0, k = 0;
    while (i < m && j < n) merged[k++] = a[i] <= b[j] ? a[i++] : b[j++];
    while (i < m) merged[k++] = a[i++];
    while (j < n) merged[k++] = b[j++];
    int mid = (m + n) / 2;
    if (((m + n) & 1) == 1) return merged[mid];
    return (merged[mid - 1] + merged[mid]) / 2.0;
  }
}`,
            cpp: `class Solution {
public:
  double findMedianSortedArrays(vector<int>& a, vector<int>& b) {
    int m = (int)a.size(), n = (int)b.size();
    vector<int> merged; merged.reserve(m + n);
    int i = 0, j = 0;
    while (i < m && j < n) merged.push_back(a[i] <= b[j] ? a[i++] : b[j++]);
    while (i < m) merged.push_back(a[i++]);
    while (j < n) merged.push_back(b[j++]);
    int mid = (m + n) / 2;
    if ((m + n) % 2) return merged[mid];
    return (merged[mid - 1] + merged[mid]) / 2.0;
  }
};`,
            c: `#include <stdlib.h>
double findMedianSortedArrays(int* a, int m, int* b, int n) {
  int* merged = (int*)malloc(sizeof(int) * (m + n));
  int i = 0, j = 0, k = 0;
  while (i < m && j < n) merged[k++] = a[i] <= b[j] ? a[i++] : b[j++];
  while (i < m) merged[k++] = a[i++];
  while (j < n) merged[k++] = b[j++];
  int mid = (m + n) / 2;
  double ans;
  if ((m + n) % 2) ans = merged[mid];
  else ans = (merged[mid - 1] + merged[mid]) / 2.0;
  free(merged);
  return ans;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(m + n)",
          space: "O(1)",
          why: "Walk two pointers until you have seen the median index (and the one before it for even length). No merged array. Linear time, constant extra memory. Still not log.",
          code: `function findMedianSortedArrays(a, b) {
  const m = a.length, n = b.length, last = Math.floor((m + n) / 2);
  let i = 0, j = 0, prev = 0, cur = 0;
  for (let t = 0; t <= last; t++) {
    prev = cur;
    if (i < m && (j >= n || a[i] <= b[j])) cur = a[i++];
    else cur = b[j++];
  }
  if ((m + n) % 2 === 1) return cur;
  return (prev + cur) / 2;
}`,
          codes: {
            javascript: `function findMedianSortedArrays(a, b) {
  const m = a.length, n = b.length, last = Math.floor((m + n) / 2);
  let i = 0, j = 0, prev = 0, cur = 0;
  for (let t = 0; t <= last; t++) {
    prev = cur;
    if (i < m && (j >= n || a[i] <= b[j])) cur = a[i++];
    else cur = b[j++];
  }
  if ((m + n) % 2 === 1) return cur;
  return (prev + cur) / 2;
}`,
            python: `def findMedianSortedArrays(a, b):
  m, n = len(a), len(b)
  last = (m + n) // 2
  i = j = prev = cur = 0
  for _ in range(last + 1):
    prev = cur
    if i < m and (j >= n or a[i] <= b[j]):
      cur = a[i]; i += 1
    else:
      cur = b[j]; j += 1
  if (m + n) % 2:
    return float(cur)
  return (prev + cur) / 2.0`,
            java: `class Solution {
  public double findMedianSortedArrays(int[] a, int[] b) {
    int m = a.length, n = b.length, last = (m + n) / 2;
    int i = 0, j = 0, prev = 0, cur = 0;
    for (int t = 0; t <= last; t++) {
      prev = cur;
      if (i < m && (j >= n || a[i] <= b[j])) cur = a[i++];
      else cur = b[j++];
    }
    if (((m + n) & 1) == 1) return cur;
    return (prev + cur) / 2.0;
  }
}`,
            cpp: `class Solution {
public:
  double findMedianSortedArrays(vector<int>& a, vector<int>& b) {
    int m = (int)a.size(), n = (int)b.size(), last = (m + n) / 2;
    int i = 0, j = 0, prev = 0, cur = 0;
    for (int t = 0; t <= last; t++) {
      prev = cur;
      if (i < m && (j >= n || a[i] <= b[j])) cur = a[i++];
      else cur = b[j++];
    }
    if ((m + n) % 2) return cur;
    return (prev + cur) / 2.0;
  }
};`,
            c: `double findMedianSortedArrays(int* a, int m, int* b, int n) {
  int last = (m + n) / 2, i = 0, j = 0, prev = 0, cur = 0;
  for (int t = 0; t <= last; t++) {
    prev = cur;
    if (i < m && (j >= n || a[i] <= b[j])) cur = a[i++];
    else cur = b[j++];
  }
  if ((m + n) % 2) return cur;
  return (prev + cur) / 2.0;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(log(min(m, n)))",
          space: "O(1)",
          why: "Binary search a cut on the shorter array. Left parts together hold half the items. If aLeft > bRight, cut is too far right. If bLeft > aRight, cut is too far left. When both sides cross correctly, the median is max(lefts) or the average with min(rights).",
          code: `function findMedianSortedArrays(a, b) {
  if (a.length > b.length) return findMedianSortedArrays(b, a);
  const m = a.length, n = b.length;
  let lo = 0, hi = m;
  const half = Math.floor((m + n + 1) / 2);
  while (lo <= hi) {
    const i = lo + ((hi - lo) >> 1);
    const j = half - i;
    const aL = i === 0 ? -1e15 : a[i - 1];
    const aR = i === m ? 1e15 : a[i];
    const bL = j === 0 ? -1e15 : b[j - 1];
    const bR = j === n ? 1e15 : b[j];
    if (aL <= bR && bL <= aR) {
      if ((m + n) % 2 === 1) return aL > bL ? aL : bL;
      const left = aL > bL ? aL : bL;
      const right = aR < bR ? aR : bR;
      return (left + right) / 2;
    }
    if (aL > bR) hi = i - 1;
    else lo = i + 1;
  }
  return 0;
}`,
          codes: {
            javascript: `function findMedianSortedArrays(a, b) {
  if (a.length > b.length) return findMedianSortedArrays(b, a);
  const m = a.length, n = b.length;
  let lo = 0, hi = m;
  const half = Math.floor((m + n + 1) / 2);
  while (lo <= hi) {
    const i = lo + ((hi - lo) >> 1);
    const j = half - i;
    const aL = i === 0 ? -1e15 : a[i - 1];
    const aR = i === m ? 1e15 : a[i];
    const bL = j === 0 ? -1e15 : b[j - 1];
    const bR = j === n ? 1e15 : b[j];
    if (aL <= bR && bL <= aR) {
      if ((m + n) % 2 === 1) return aL > bL ? aL : bL;
      const left = aL > bL ? aL : bL;
      const right = aR < bR ? aR : bR;
      return (left + right) / 2;
    }
    if (aL > bR) hi = i - 1;
    else lo = i + 1;
  }
  return 0;
}`,
            python: `def findMedianSortedArrays(a, b):
  if len(a) > len(b):
    return findMedianSortedArrays(b, a)
  m, n = len(a), len(b)
  lo, hi = 0, m
  half = (m + n + 1) // 2
  INF = 10 ** 15
  while lo <= hi:
    i = lo + ((hi - lo) >> 1)
    j = half - i
    aL = -INF if i == 0 else a[i - 1]
    aR = INF if i == m else a[i]
    bL = -INF if j == 0 else b[j - 1]
    bR = INF if j == n else b[j]
    if aL <= bR and bL <= aR:
      if (m + n) % 2:
        return float(aL if aL > bL else bL)
      left = aL if aL > bL else bL
      right = aR if aR < bR else bR
      return (left + right) / 2.0
    if aL > bR:
      hi = i - 1
    else:
      lo = i + 1
  return 0.0`,
            java: `class Solution {
  public double findMedianSortedArrays(int[] a, int[] b) {
    if (a.length > b.length) return findMedianSortedArrays(b, a);
    int m = a.length, n = b.length;
    int lo = 0, hi = m, half = (m + n + 1) / 2;
    while (lo <= hi) {
      int i = lo + ((hi - lo) >> 1);
      int j = half - i;
      long aL = i == 0 ? Long.MIN_VALUE / 4 : a[i - 1];
      long aR = i == m ? Long.MAX_VALUE / 4 : a[i];
      long bL = j == 0 ? Long.MIN_VALUE / 4 : b[j - 1];
      long bR = j == n ? Long.MAX_VALUE / 4 : b[j];
      if (aL <= bR && bL <= aR) {
        if (((m + n) & 1) == 1) return Math.max(aL, bL);
        return (Math.max(aL, bL) + Math.min(aR, bR)) / 2.0;
      }
      if (aL > bR) hi = i - 1;
      else lo = i + 1;
    }
    return 0;
  }
}`,
            cpp: `class Solution {
public:
  double findMedianSortedArrays(vector<int>& a, vector<int>& b) {
    if (a.size() > b.size()) return findMedianSortedArrays(b, a);
    int m = (int)a.size(), n = (int)b.size();
    int lo = 0, hi = m, half = (m + n + 1) / 2;
    const long long INF = (1LL << 60);
    while (lo <= hi) {
      int i = lo + ((hi - lo) >> 1);
      int j = half - i;
      long long aL = i == 0 ? -INF : a[i - 1];
      long long aR = i == m ? INF : a[i];
      long long bL = j == 0 ? -INF : b[j - 1];
      long long bR = j == n ? INF : b[j];
      if (aL <= bR && bL <= aR) {
        if ((m + n) % 2) return (double)(aL > bL ? aL : bL);
        long long left = aL > bL ? aL : bL;
        long long right = aR < bR ? aR : bR;
        return (left + right) / 2.0;
      }
      if (aL > bR) hi = i - 1;
      else lo = i + 1;
    }
    return 0;
  }
};`,
            c: `double findMedianSortedArrays(int* a, int m, int* b, int n) {
  if (m > n) return findMedianSortedArrays(b, n, a, m);
  int lo = 0, hi = m, half = (m + n + 1) / 2;
  const long long INF = 1000000000000000LL;
  while (lo <= hi) {
    int i = lo + ((hi - lo) >> 1);
    int j = half - i;
    long long aL = i == 0 ? -INF : a[i - 1];
    long long aR = i == m ? INF : a[i];
    long long bL = j == 0 ? -INF : b[j - 1];
    long long bR = j == n ? INF : b[j];
    if (aL <= bR && bL <= aR) {
      if ((m + n) % 2) return (double)(aL > bL ? aL : bL);
      long long left = aL > bL ? aL : bL;
      long long right = aR < bR ? aR : bR;
      return (left + right) / 2.0;
    }
    if (aL > bR) hi = i - 1;
    else lo = i + 1;
  }
  return 0;
}`
          }
        }
      ]
    },
    {
      id: 12,
      level: "intermediate",
      q: "Search a 2D Matrix",
      ask: "Amazon · Microsoft · Facebook · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/search-a-2d-matrix/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/search-in-a-matrix-1587115621/1"}],
      a: "Each row is sorted left to right. The first value of the next row is larger than the last value of this row. Return whether target exists.\n\nTiny example: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target 3 -> true. Target 13 -> false.\n\nThe grid is one sorted list of length rows*cols. Flatten index mid maps to [mid / cols][mid % cols]. You can also binary search the row, then the column.\n\nOpen Brute, Optimal, and More optimal for a full scan, flatten binary search, and row-then-column binary search.",
      solutions: [
        {
          name: "Brute",
          time: "O(rc)",
          space: "O(1)",
          why: "Compare every cell. Correct on any matrix. Ignores both sorted properties.",
          code: `function searchMatrix(matrix, target) {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[0].length; c++) {
      if (matrix[r][c] === target) return true;
    }
  }
  return false;
}`,
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
    for v in row:
      if v == target:
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
          time: "O(log(rc))",
          space: "O(1)",
          why: "Treat the grid as one sorted array of length rows*cols. Ordinary binary search. This uses the stronger 'next row starts after this row' rule.",
          code: `function searchMatrix(matrix, target) {
  const rows = matrix.length, cols = matrix[0].length;
  let lo = 0, hi = rows * cols - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const val = matrix[Math.floor(mid / cols)][mid % cols];
    if (val === target) return true;
    if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}`,
          codes: {
            javascript: `function searchMatrix(matrix, target) {
  const rows = matrix.length, cols = matrix[0].length;
  let lo = 0, hi = rows * cols - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const val = matrix[Math.floor(mid / cols)][mid % cols];
    if (val === target) return true;
    if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}`,
            python: `def searchMatrix(matrix, target):
  rows, cols = len(matrix), len(matrix[0])
  lo, hi = 0, rows * cols - 1
  while lo <= hi:
    mid = (lo + hi) >> 1
    val = matrix[mid // cols][mid % cols]
    if val == target:
      return True
    if val < target:
      lo = mid + 1
    else:
      hi = mid - 1
  return False`,
            java: `class Solution {
  public boolean searchMatrix(int[][] matrix, int target) {
    int rows = matrix.length, cols = matrix[0].length;
    int lo = 0, hi = rows * cols - 1;
    while (lo <= hi) {
      int mid = (lo + hi) >> 1;
      int val = matrix[mid / cols][mid % cols];
      if (val == target) return true;
      if (val < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return false;
  }
}`,
            cpp: `class Solution {
public:
  bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int rows = (int)matrix.size(), cols = (int)matrix[0].size();
    int lo = 0, hi = rows * cols - 1;
    while (lo <= hi) {
      int mid = (lo + hi) >> 1;
      int val = matrix[mid / cols][mid % cols];
      if (val == target) return true;
      if (val < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return false;
  }
};`,
            c: `int searchMatrix(int** matrix, int rows, int cols, int target) {
  int lo = 0, hi = rows * cols - 1;
  while (lo <= hi) {
    int mid = (lo + hi) >> 1;
    int val = matrix[mid / cols][mid % cols];
    if (val == target) return 1;
    if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return 0;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(log r + log c)",
          space: "O(1)",
          why: "Overflow-safe mid. First find the last row whose first cell is <= target (or the unique row that can hold it). Then binary search that row. Same log(rc) probes, often clearer in an interview sketch.",
          code: `function searchMatrix(matrix, target) {
  const rows = matrix.length, cols = matrix[0].length;
  let lo = 0, hi = rows - 1, row = -1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (matrix[mid][0] <= target && target <= matrix[mid][cols - 1]) {
      row = mid;
      break;
    }
    if (matrix[mid][0] > target) hi = mid - 1;
    else lo = mid + 1;
  }
  if (row < 0) return false;
  lo = 0; hi = cols - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (matrix[row][mid] === target) return true;
    if (matrix[row][mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}`,
          codes: {
            javascript: `function searchMatrix(matrix, target) {
  const rows = matrix.length, cols = matrix[0].length;
  let lo = 0, hi = rows - 1, row = -1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (matrix[mid][0] <= target && target <= matrix[mid][cols - 1]) {
      row = mid;
      break;
    }
    if (matrix[mid][0] > target) hi = mid - 1;
    else lo = mid + 1;
  }
  if (row < 0) return false;
  lo = 0; hi = cols - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (matrix[row][mid] === target) return true;
    if (matrix[row][mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}`,
            python: `def searchMatrix(matrix, target):
  rows, cols = len(matrix), len(matrix[0])
  lo, hi, row = 0, rows - 1, -1
  while lo <= hi:
    mid = lo + ((hi - lo) >> 1)
    if matrix[mid][0] <= target <= matrix[mid][cols - 1]:
      row = mid
      break
    if matrix[mid][0] > target:
      hi = mid - 1
    else:
      lo = mid + 1
  if row < 0:
    return False
  lo, hi = 0, cols - 1
  while lo <= hi:
    mid = lo + ((hi - lo) >> 1)
    if matrix[row][mid] == target:
      return True
    if matrix[row][mid] < target:
      lo = mid + 1
    else:
      hi = mid - 1
  return False`,
            java: `class Solution {
  public boolean searchMatrix(int[][] matrix, int target) {
    int rows = matrix.length, cols = matrix[0].length;
    int lo = 0, hi = rows - 1, row = -1;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (matrix[mid][0] <= target && target <= matrix[mid][cols - 1]) { row = mid; break; }
      if (matrix[mid][0] > target) hi = mid - 1;
      else lo = mid + 1;
    }
    if (row < 0) return false;
    lo = 0; hi = cols - 1;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (matrix[row][mid] == target) return true;
      if (matrix[row][mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return false;
  }
}`,
            cpp: `class Solution {
public:
  bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int rows = (int)matrix.size(), cols = (int)matrix[0].size();
    int lo = 0, hi = rows - 1, row = -1;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (matrix[mid][0] <= target && target <= matrix[mid][cols - 1]) { row = mid; break; }
      if (matrix[mid][0] > target) hi = mid - 1;
      else lo = mid + 1;
    }
    if (row < 0) return false;
    lo = 0; hi = cols - 1;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (matrix[row][mid] == target) return true;
      if (matrix[row][mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return false;
  }
};`,
            c: `int searchMatrix(int** matrix, int rows, int cols, int target) {
  int lo = 0, hi = rows - 1, row = -1;
  while (lo <= hi) {
    int mid = lo + ((hi - lo) >> 1);
    if (matrix[mid][0] <= target && target <= matrix[mid][cols - 1]) { row = mid; break; }
    if (matrix[mid][0] > target) hi = mid - 1;
    else lo = mid + 1;
  }
  if (row < 0) return 0;
  lo = 0; hi = cols - 1;
  while (lo <= hi) {
    int mid = lo + ((hi - lo) >> 1);
    if (matrix[row][mid] == target) return 1;
    if (matrix[row][mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return 0;
}`
          }
        }
      ]
    },
    {
      id: 13,
      level: "intermediate",
      q: "Search a 2D Matrix II",
      ask: "Amazon · Google · Microsoft · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/search-a-2d-matrix-ii/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/search-in-a-matrix/1"}],
      a: "Each row is sorted left to right. Each column is sorted top to bottom. The next row does NOT have to start after this row. Return whether target exists.\n\nTiny example: [[1, 4, 7], [2, 5, 8], [3, 6, 9]], target 5 -> true. Target 10 -> false. Notice 2 sits under 1, so you cannot flatten the grid into one sorted list.\n\nBinary search each row is O(r log c). The staircase from the top-right (or bottom-left) is O(r + c): too big, move left; too small, move down.\n\nOpen Brute, Optimal, and More optimal for a scan, per-row binary search, and the staircase walk.",
      solutions: [
        {
          name: "Brute",
          time: "O(rc)",
          space: "O(1)",
          why: "Visit every cell. Correct, ignores both sorted axes.",
          code: `function searchMatrix(matrix, target) {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[0].length; c++) {
      if (matrix[r][c] === target) return true;
    }
  }
  return false;
}`,
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
          code: `function searchMatrix(matrix, target) {
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
          code: `function searchMatrix(matrix, target) {
  let r = 0, c = matrix[0].length - 1;
  while (r < matrix.length && c >= 0) {
    if (matrix[r][c] === target) return true;
    if (matrix[r][c] > target) c--;
    else r++;
  }
  return false;
}`,
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
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/find-k-closest-elements/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/find-k-closest-elements/1"}],
      a: "arr is sorted. Return k values closest to x, in ascending order. Tie: pick the smaller value.\n\nTiny example: arr = [1, 2, 3, 4, 5], k = 4, x = 3 -> [1, 2, 3, 4]. x = -1 -> [1, 2, 3, 4].\n\nSorting by distance is easy but O(n log n). Sliding the window from both ends is O(n). Binary searching the left edge of a window of length k is O(log(n - k) + k).\n\nOpen Brute, Optimal, and More optimal for sort-by-distance, two pointers, and binary search on the window start.",
      solutions: [
        {
          name: "Brute",
          time: "O(n log n)",
          space: "O(n)",
          why: "Pair each value with its distance, sort by distance then by value, take k items, sort those k again so the answer is ascending. Heavy, but matches the tie rule clearly.",
          code: `function findClosestElements(arr, k, x) {
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
          code: `function findClosestElements(arr, k, x) {
  let lo = 0, hi = arr.length - 1;
  while (hi - lo + 1 > k) {
    if (Math.abs(arr[lo] - x) > Math.abs(arr[hi] - x)) lo++;
    else hi--;
  }
  return arr.slice(lo, hi + 1);
}`,
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
          code: `function findClosestElements(arr, k, x) {
  let lo = 0, hi = arr.length - k;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (x - arr[mid] > arr[mid + k] - x) lo = mid + 1;
    else hi = mid;
  }
  return arr.slice(lo, lo + k);
}`,
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
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/time-based-key-value-store/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/time-based-key-value-store/1"}],
      a: "Design a map: set(key, value, timestamp) stores a value at a time. get(key, timestamp) returns the value with the largest time <= timestamp, or \"\" if none. Timestamps on set for one key are strictly increasing.\n\nTiny example: set(\"foo\", \"bar\", 1), get(\"foo\", 1) -> \"bar\". get(\"foo\", 3) -> \"bar\". set(\"foo\", \"bar2\", 4), get(\"foo\", 4) -> \"bar2\". get(\"foo\", 5) -> \"bar2\".\n\nEach key holds a sorted list of (time, value). get is a last-true binary search on time.\n\nOpen Brute, Optimal, and More optimal for a linear scan, binary search on the list, and a tighter upper-bound loop.",
      solutions: [
        {
          name: "Brute",
          time: "set O(1), get O(n)",
          space: "O(n)",
          why: "Append every set. On get, scan the whole list for that key and keep the latest time that is still <= timestamp. Fine until a key has many versions.",
          code: `function TimeMap() {
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
          code: `function TimeMap() {
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
          code: `function TimeMap() {
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
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/magnetic-force-between-two-balls/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/aggressive-cows/1"}],
      a: "Place m balls into baskets at positions (sorted after you sort them) so the minimum distance between any two balls is as large as possible. Same problem as Aggressive Cows.\n\nTiny example: position = [1, 2, 3, 4, 7], m = 3 -> 3. One best layout is baskets 1, 4, 7 (gaps 3 and 3).\n\nThe predicate 'can I place m balls with min gap mid?' is last-true: if mid works, a smaller gap also works, so you try a larger gap.\n\nOpen Brute, Optimal, and More optimal for trying every gap, binary search plus greedy place, and overflow-safe mid with an early count exit.",
      solutions: [
        {
          name: "Brute",
          time: "O((max-min) * n)",
          space: "O(1)",
          why: "Sort, then try every distance from (max-min) down to 1. First distance that can place m balls is the answer. Distance range can be 10^9, so this times out.",
          code: `function maxDistance(position, m) {
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
          code: `function maxDistance(position, m) {
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
          code: `function maxDistance(position, m) {
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
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/sqrtx/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/square-root/1"}],
      a: "Return the integer square root of a non-negative x: the largest integer r such that r * r <= x. Do not use a library sqrt if they forbid it.\n\nTiny example: 4 -> 2. 8 -> 2 because 2*2 = 4 and 3*3 = 9 > 8. 0 -> 0. 1 -> 1.\n\nLinear try of 0, 1, 2, ... works. Binary search on r in [0, x] (or [1, x/2 + 1]) is O(log x). Newton's method usually needs fewer iterations.\n\nOpen Brute, Optimal, and More optimal for incrementing r, binary search, and integer Newton.",
      solutions: [
        {
          name: "Brute",
          time: "O(sqrt(x))",
          space: "O(1)",
          why: "Increase r while (r+1)*(r+1) still fits in x. Use 64-bit (or a division check) so r*r does not overflow 32-bit int.",
          code: `function mySqrt(x) {
  let r = 0;
  while ((r + 1) * (r + 1) <= x) r++;
  return r;
}`,
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
          code: `function mySqrt(x) {
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
          code: `function mySqrt(x) {
  if (x < 2) return x;
  let r = x;
  while (r > Math.floor(x / r)) {
    r = Math.floor((r + Math.floor(x / r)) / 2);
  }
  return r;
}`,
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
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/first-bad-version/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/first-bad-version/1"}],
      a: "Versions 1..n. There is a first bad version f. Every version >= f is bad. You may only call isBadVersion(v). Return f. Minimize API calls.\n\nTiny example: n = 5, first bad = 4. Calls on 1,2,3 are false, 4 and 5 are true, so answer 4. n = 1 is always 1 if it is bad.\n\nLinear check from 1 is too many calls. Binary search first-true: if mid is bad, the first bad is at mid or left; if mid is good, it is strictly right.\n\nOpen Brute, Optimal, and More optimal for a scan, an ans-variable binary search, and the half-open overflow-safe loop that returns lo.",
      solutions: [
        {
          name: "Brute",
          time: "O(n) calls",
          space: "O(1)",
          why: "Ask isBadVersion from 1 upward. First true is the answer. Correct, burns the API on large n.",
          code: `function firstBadVersion(n, isBadVersion) {
  for (let i = 1; i <= n; i++) if (isBadVersion(i)) return i;
  return n;
}`,
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
          code: `function firstBadVersion(n, isBadVersion) {
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
          code: `function firstBadVersion(n, isBadVersion) {
  let lo = 1, hi = n;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (isBadVersion(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
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
  ]
};
