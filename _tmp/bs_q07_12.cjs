const LC = (s) => ({ name: "LeetCode", url: "https://leetcode.com/problems/" + s + "/" });
const GFG = (s) => ({ name: "GFG", url: "https://www.geeksforgeeks.org/problems/" + s + "/1" });

module.exports = [
  {
    id: 7,
    level: "beginner",
    q: "Peak Index in a Mountain Array",
    ask: "Amazon · Google · Bloomberg · Apple",
    links: [LC("peak-index-in-a-mountain-array"), GFG("peak-element")],
    a: "arr is a mountain: it strictly increases to one peak, then strictly decreases. Return the peak index. Length is at least 3.\n\nTiny example: [0, 2, 1, 0] -> 1. [0, 10, 5, 2] -> 1. [3, 4, 5, 1] -> 2.\n\nUnlike Find Peak Element, there is exactly one peak and both sides are strictly monotone. The same uphill test still works: if arr[mid] < arr[mid + 1], the peak is to the right.\n\nOpen Brute, Optimal, and More optimal for a scan, iterative binary search, and an overflow-safe loop that also compares mid - 1 when mid is not at 0.",
    solutions: [
      {
        name: "Brute",
        time: "O(n)",
        space: "O(1)",
        why: "The peak is the unique maximum. Track the index of the largest value. Fine for tiny n; they still want log n because n can be 10^5.",
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
    links: [LC("koko-eating-bananas"), GFG("koko-eating-bananas")],
    a: "Koko eats all piles at a fixed integer speed k bananas per hour, at most one pile per hour (ceil(pile / k) hours for that pile). Finish in h hours. Return the minimum k.\n\nTiny example: piles = [3, 6, 7, 11], h = 8 -> 4. Speed 3 needs 10 hours. Speed 4 needs 8.\n\nThe predicate 'can finish at speed mid' is monotone: faster never hurts. Binary search k from 1 to max(piles).\n\nOpen Brute, Optimal, and More optimal for trying every speed, binary search with integer ceil, and a long accumulator so hour sums cannot wrap.",
    solutions: [
      {
        name: "Brute",
        time: "O(max(piles) * n)",
        space: "O(1)",
        why: "Try k = 1, 2, ... max pile. First k that finishes in h hours is the answer. Correct, but max pile can be 10^9 so this times out.",
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
    links: [LC("capacity-to-ship-packages-within-d-days"), GFG("capacity-to-ship-packages-within-d-days")],
    a: "Packages must ship in order. Each day you load a contiguous prefix that still fits in capacity cap. Return the smallest cap that finishes in days days.\n\nTiny example: weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], days = 5 -> 15. Cap cannot be smaller than the heaviest package.\n\nSame monotone search as Koko: lo = max(weight), hi = sum(weights). can(cap) counts how many days that cap needs.\n\nOpen Brute, Optimal, and More optimal for trying every cap, binary search, and early fail when the day count already exceeds D.",
    solutions: [
      {
        name: "Brute",
        time: "O(sum * n)",
        space: "O(1)",
        why: "Try every capacity from the heaviest box up to the total sum. First success is the answer. Sum can be huge, so this is only the idea sketch.",
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
    links: [LC("split-array-largest-sum"), GFG("split-array-largest-sum")],
    a: "Split nums into k non-empty contiguous subarrays. Minimize the largest subarray sum among those pieces.\n\nTiny example: nums = [7, 2, 5, 10, 8], k = 2. Best split is [7, 2, 5] and [10, 8], largest sum 18.\n\nBrute tries every cut. DP stores the best largest-sum for prefixes. The interview finish line is binary search on the largest sum, same shape as ship-packages: lo = max(nums), hi = sum, and a greedy count of how many pieces a limit needs.\n\nOpen Brute, Optimal, and More optimal for recursion, the DP table, and answer-space binary search.",
    solutions: [
      {
        name: "Brute",
        time: "O(n^{k-1})",
        space: "O(n)",
        why: "Recurse on the start index and how many pieces are left. Try every next cut. Exponential in k. Good for explaining the search tree, not for n = 1000.",
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
    links: [LC("median-of-two-sorted-arrays"), GFG("median-of-2-sorted-arrays-of-different-sizes")],
    a: "Two sorted arrays a and b. Return the median of the combined sorted order. Odd total length: the middle value. Even: average of the two middle values. Required interview bound is O(log(min(m, n))).\n\nTiny example: [1, 3] and [2] -> 2. [1, 2] and [3, 4] -> 2.5.\n\nMerge is O(m+n). Two pointers to the median index skip extra memory. The hard solution partitions the shorter array so the left side has (m+n+1)/2 items and every left value is <= every right value.\n\nOpen Brute, Optimal, and More optimal for merge, two-pointer kth, and the partition binary search.",
    solutions: [
      {
        name: "Brute",
        time: "O(m + n)",
        space: "O(m + n)",
        why: "Merge the two sorted lists into one, then pick the middle one or two values. Easy to code, extra memory, and not the log bound they asked for.",
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
    links: [LC("search-a-2d-matrix"), GFG("search-in-a-matrix-1587115621")],
    a: "Each row is sorted left to right. The first value of the next row is larger than the last value of this row. Return whether target exists.\n\nTiny example: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target 3 -> true. Target 13 -> false.\n\nThe grid is one sorted list of length rows*cols. Flatten index mid maps to [mid / cols][mid % cols]. You can also binary search the row, then the column.\n\nOpen Brute, Optimal, and More optimal for a full scan, flatten binary search, and row-then-column binary search.",
    solutions: [
      {
        name: "Brute",
        time: "O(rc)",
        space: "O(1)",
        why: "Compare every cell. Correct on any matrix. Ignores both sorted properties.",
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
  }
];
