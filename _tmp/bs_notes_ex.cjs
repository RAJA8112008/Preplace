module.exports = {
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
  ]
};
