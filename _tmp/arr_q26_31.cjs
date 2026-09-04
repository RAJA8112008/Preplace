const { makeSol, lc, gfgProblem, gfgArt } = require("./dsa_emit.cjs");

function q26() {
  return {
    id: 26,
    level: "beginner",
    q: "Two Sum II - Input Array Is Sorted",
    ask: "Amazon · Google · Adobe",
    links: [lc("two-sum-ii-input-array-is-sorted"), gfgArt("given-an-array-a-and-a-number-x-check-for-pair-in-a-with-sum-as-x")],
    a: "A 1-indexed sorted array. Return the two indexes (1-based) whose values add to target. Exactly one solution. Do not reuse an index.\n\nExample: numbers = [2, 7, 11, 15], target = 9. Answer [1, 2] because 2 + 7 = 9.\n\nBrute tries every pair. Optimal binary-searches the partner of each value. More optimal is two pointers from both ends.",
    solutions: [
      makeSol("Brute", "O(n²)", "O(1)",
        "Outer index i, inner j > i. First pair that sums to target is the answer. Works, ignores the sorted hint.",
        {
          javascript: `function twoSum(numbers, target) {
  const n = numbers.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (numbers[i] + numbers[j] === target) return [i + 1, j + 1];
    }
  }
  return [];
}`,
          python: `def twoSum(numbers, target):
  n = len(numbers)
  for i in range(n):
    for j in range(i + 1, n):
      if numbers[i] + numbers[j] == target:
        return [i + 1, j + 1]
  return []`,
          java: `class Solution {
  public int[] twoSum(int[] numbers, int target) {
    int n = numbers.length;
    for (int i = 0; i < n; i++)
      for (int j = i + 1; j < n; j++)
        if (numbers[i] + numbers[j] == target) return new int[] { i + 1, j + 1 };
    return new int[] {};
  }
}`,
          cpp: `vector<int> twoSum(vector<int>& numbers, int target) {
  int n = (int)numbers.size();
  for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
      if (numbers[i] + numbers[j] == target) return { i + 1, j + 1 };
  return {};
}`,
          c: `int twoSum(int* numbers, int n, int target, int* ans) {
  int i, j;
  for (i = 0; i < n; i++)
    for (j = i + 1; j < n; j++)
      if (numbers[i] + numbers[j] == target) { ans[0] = i + 1; ans[1] = j + 1; return 1; }
  return 0;
}`
        }),
      makeSol("Optimal", "O(n log n)", "O(1)",
        "For each left value, binary search target - numbers[i] on the right side. Sorted order makes the search legal. Extra log n versus two pointers.",
        {
          javascript: `function twoSum(numbers, target) {
  const n = numbers.length;
  for (let i = 0; i < n; i++) {
    const need = target - numbers[i];
    let lo = i + 1, hi = n - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (numbers[mid] === need) return [i + 1, mid + 1];
      if (numbers[mid] < need) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return [];
}`,
          python: `def twoSum(numbers, target):
  n = len(numbers)
  for i in range(n):
    need = target - numbers[i]
    lo, hi = i + 1, n - 1
    while lo <= hi:
      mid = (lo + hi) // 2
      if numbers[mid] == need:
        return [i + 1, mid + 1]
      if numbers[mid] < need:
        lo = mid + 1
      else:
        hi = mid - 1
  return []`,
          java: `class Solution {
  public int[] twoSum(int[] numbers, int target) {
    int n = numbers.length;
    for (int i = 0; i < n; i++) {
      int need = target - numbers[i];
      int lo = i + 1, hi = n - 1;
      while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (numbers[mid] == need) return new int[] { i + 1, mid + 1 };
        if (numbers[mid] < need) lo = mid + 1;
        else hi = mid - 1;
      }
    }
    return new int[] {};
  }
}`,
          cpp: `vector<int> twoSum(vector<int>& numbers, int target) {
  int n = (int)numbers.size();
  for (int i = 0; i < n; i++) {
    int need = target - numbers[i];
    int lo = i + 1, hi = n - 1;
    while (lo <= hi) {
      int mid = (lo + hi) / 2;
      if (numbers[mid] == need) return { i + 1, mid + 1 };
      if (numbers[mid] < need) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return {};
}`,
          c: `int twoSum(int* numbers, int n, int target, int* ans) {
  int i;
  for (i = 0; i < n; i++) {
    int need = target - numbers[i];
    int lo = i + 1, hi = n - 1;
    while (lo <= hi) {
      int mid = (lo + hi) / 2;
      if (numbers[mid] == need) { ans[0] = i + 1; ans[1] = mid + 1; return 1; }
      if (numbers[mid] < need) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return 0;
}`
        }),
      makeSol("More optimal", "O(n)", "O(1)",
        "Left at start, right at end. Sum too small: left++. Sum too big: right--. Sorted order guarantees you never miss the pair. Interview finish line.",
        {
          javascript: `function twoSum(numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`,
          python: `def twoSum(numbers, target):
  left, right = 0, len(numbers) - 1
  while left < right:
    s = numbers[left] + numbers[right]
    if s == target:
      return [left + 1, right + 1]
    if s < target:
      left += 1
    else:
      right -= 1
  return []`,
          java: `class Solution {
  public int[] twoSum(int[] numbers, int target) {
    int left = 0, right = numbers.length - 1;
    while (left < right) {
      int sum = numbers[left] + numbers[right];
      if (sum == target) return new int[] { left + 1, right + 1 };
      if (sum < target) left++;
      else right--;
    }
    return new int[] {};
  }
}`,
          cpp: `vector<int> twoSum(vector<int>& numbers, int target) {
  int left = 0, right = (int)numbers.size() - 1;
  while (left < right) {
    int sum = numbers[left] + numbers[right];
    if (sum == target) return { left + 1, right + 1 };
    if (sum < target) left++;
    else right--;
  }
  return {};
}`,
          c: `int twoSum(int* numbers, int n, int target, int* ans) {
  int left = 0, right = n - 1;
  while (left < right) {
    int sum = numbers[left] + numbers[right];
    if (sum == target) { ans[0] = left + 1; ans[1] = right + 1; return 1; }
    if (sum < target) left++;
    else right--;
  }
  return 0;
}`
        })
    ]
  };
}

function q27() {
  return {
    id: 27,
    level: "intermediate",
    q: "4Sum",
    ask: "Amazon · Google · Microsoft · Adobe",
    links: [lc("4sum"), gfgProblem("find-all-four-sum-numbers")],
    a: "Return all unique quadruplets [a, b, c, d] such that they add to target. Indexes must be distinct. Order inside a quadruplet does not matter; do not emit duplicates.\n\nExample: nums = [1, 0, -1, 0, -2, 2], target = 0. One answer is [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]].\n\nBrute is four loops. Optimal is three loops plus a hash set. More optimal sorts, then two loops plus two pointers, skipping clones.",
    solutions: [
      makeSol("Brute", "O(n^4)", "O(1) extra",
        "Four nested indexes. Sort each hit so a set of strings can drop duplicates. Correct and too slow.",
        {
          javascript: `function fourSum(nums, target) {
  const n = nums.length;
  const seen = Object.create(null);
  const out = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        for (let p = k + 1; p < n; p++) {
          if (nums[i] + nums[j] + nums[k] + nums[p] !== target) continue;
          const quad = [nums[i], nums[j], nums[k], nums[p]].sort(function (a, b) { return a - b; });
          const key = quad.join(",");
          if (seen[key]) continue;
          seen[key] = true;
          out.push(quad);
        }
      }
    }
  }
  return out;
}`,
          python: `def fourSum(nums, target):
  n = len(nums)
  seen = set()
  out = []
  for i in range(n):
    for j in range(i + 1, n):
      for k in range(j + 1, n):
        for p in range(k + 1, n):
          if nums[i] + nums[j] + nums[k] + nums[p] != target:
            continue
          quad = tuple(sorted([nums[i], nums[j], nums[k], nums[p]]))
          if quad in seen:
            continue
          seen.add(quad)
          out.append(list(quad))
  return out`,
          java: `import java.util.*;
class Solution {
  public List<List<Integer>> fourSum(int[] nums, int target) {
    int n = nums.length;
    Set<String> seen = new HashSet<String>();
    List<List<Integer>> out = new ArrayList<List<Integer>>();
    for (int i = 0; i < n; i++)
      for (int j = i + 1; j < n; j++)
        for (int k = j + 1; k < n; k++)
          for (int p = k + 1; p < n; p++) {
            if ((long) nums[i] + nums[j] + nums[k] + nums[p] != target) continue;
            int[] q = { nums[i], nums[j], nums[k], nums[p] };
            Arrays.sort(q);
            String key = q[0] + "," + q[1] + "," + q[2] + "," + q[3];
            if (!seen.add(key)) continue;
            out.add(Arrays.asList(q[0], q[1], q[2], q[3]));
          }
    return out;
  }
}`,
          cpp: `vector<vector<int>> fourSum(vector<int>& nums, int target) {
  int n = (int)nums.size();
  set<vector<int>> seen;
  for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
      for (int k = j + 1; k < n; k++)
        for (int p = k + 1; p < n; p++) {
          if ((long long)nums[i] + nums[j] + nums[k] + nums[p] != target) continue;
          vector<int> q = { nums[i], nums[j], nums[k], nums[p] };
          sort(q.begin(), q.end());
          seen.insert(q);
        }
  return vector<vector<int>>(seen.begin(), seen.end());
}`,
          c: `/* four nested loops; store unique sorted quadruplets in a small table */`
        }),
      makeSol("Optimal", "O(n^3)", "O(n)",
        "Fix i, j, k. Look up target - (a+b+c) in a set of values after k. Still cubic, extra set, duplicates need care. A stepping stone to two pointers.",
        {
          javascript: `function fourSum(nums, target) {
  const n = nums.length;
  const seenQ = Object.create(null);
  const out = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const seen = Object.create(null);
      for (let k = j + 1; k < n; k++) {
        const need = target - nums[i] - nums[j] - nums[k];
        if (seen[need] !== undefined) {
          const quad = [nums[i], nums[j], nums[k], need].sort(function (a, b) { return a - b; });
          const key = quad.join(",");
          if (!seenQ[key]) { seenQ[key] = true; out.push(quad); }
        }
        seen[nums[k]] = k;
      }
    }
  }
  return out;
}`,
          python: `def fourSum(nums, target):
  n = len(nums)
  seenQ = set()
  out = []
  for i in range(n):
    for j in range(i + 1, n):
      seen = set()
      for k in range(j + 1, n):
        need = target - nums[i] - nums[j] - nums[k]
        if need in seen:
          quad = tuple(sorted([nums[i], nums[j], nums[k], need]))
          if quad not in seenQ:
            seenQ.add(quad)
            out.append(list(quad))
        seen.add(nums[k])
  return out`,
          java: `import java.util.*;
class Solution {
  public List<List<Integer>> fourSum(int[] nums, int target) {
    int n = nums.length;
    Set<String> seenQ = new HashSet<String>();
    List<List<Integer>> out = new ArrayList<List<Integer>>();
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        Set<Long> seen = new HashSet<Long>();
        for (int k = j + 1; k < n; k++) {
          long need = (long) target - nums[i] - nums[j] - nums[k];
          if (seen.contains(need)) {
            int[] q = { nums[i], nums[j], nums[k], (int) need };
            Arrays.sort(q);
            String key = q[0] + "," + q[1] + "," + q[2] + "," + q[3];
            if (seenQ.add(key)) out.add(Arrays.asList(q[0], q[1], q[2], q[3]));
          }
          seen.add((long) nums[k]);
        }
      }
    }
    return out;
  }
}`,
          cpp: `vector<vector<int>> fourSum(vector<int>& nums, int target) {
  int n = (int)nums.size();
  set<vector<int>> seenQ;
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      unordered_set<long long> seen;
      for (int k = j + 1; k < n; k++) {
        long long need = (long long)target - nums[i] - nums[j] - nums[k];
        if (seen.count(need)) {
          vector<int> q = { nums[i], nums[j], nums[k], (int)need };
          sort(q.begin(), q.end());
          seenQ.insert(q);
        }
        seen.insert(nums[k]);
      }
    }
  }
  return vector<vector<int>>(seenQ.begin(), seenQ.end());
}`,
          c: `/* three loops plus a linear scan for the partner; skip duplicate quads */`
        }),
      makeSol("More optimal", "O(n^3)", "O(1) extra",
        "Sort. Fix i and j. Two pointers on the rest. Skip duplicate i, j, left, and right. Use 64-bit sums if the language overflows. This is the expected answer.",
        {
          javascript: `function fourSum(nums, target) {
  nums = nums.slice().sort(function (a, b) { return a - b; });
  const n = nums.length;
  const out = [];
  for (let i = 0; i < n; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    for (let j = i + 1; j < n; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue;
      let L = j + 1, R = n - 1;
      while (L < R) {
        const sum = nums[i] + nums[j] + nums[L] + nums[R];
        if (sum === target) {
          out.push([nums[i], nums[j], nums[L], nums[R]]);
          L++;
          R--;
          while (L < R && nums[L] === nums[L - 1]) L++;
          while (L < R && nums[R] === nums[R + 1]) R--;
        } else if (sum < target) L++;
        else R--;
      }
    }
  }
  return out;
}`,
          python: `def fourSum(nums, target):
  nums = sorted(nums)
  n = len(nums)
  out = []
  for i in range(n):
    if i > 0 and nums[i] == nums[i - 1]:
      continue
    for j in range(i + 1, n):
      if j > i + 1 and nums[j] == nums[j - 1]:
        continue
      L, R = j + 1, n - 1
      while L < R:
        s = nums[i] + nums[j] + nums[L] + nums[R]
        if s == target:
          out.append([nums[i], nums[j], nums[L], nums[R]])
          L += 1
          R -= 1
          while L < R and nums[L] == nums[L - 1]:
            L += 1
          while L < R and nums[R] == nums[R + 1]:
            R -= 1
        elif s < target:
          L += 1
        else:
          R -= 1
  return out`,
          java: `import java.util.*;
class Solution {
  public List<List<Integer>> fourSum(int[] nums, int target) {
    Arrays.sort(nums);
    int n = nums.length;
    List<List<Integer>> out = new ArrayList<List<Integer>>();
    for (int i = 0; i < n; i++) {
      if (i > 0 && nums[i] == nums[i - 1]) continue;
      for (int j = i + 1; j < n; j++) {
        if (j > i + 1 && nums[j] == nums[j - 1]) continue;
        int L = j + 1, R = n - 1;
        while (L < R) {
          long sum = (long) nums[i] + nums[j] + nums[L] + nums[R];
          if (sum == target) {
            out.add(Arrays.asList(nums[i], nums[j], nums[L], nums[R]));
            L++; R--;
            while (L < R && nums[L] == nums[L - 1]) L++;
            while (L < R && nums[R] == nums[R + 1]) R--;
          } else if (sum < target) L++;
          else R--;
        }
      }
    }
    return out;
  }
}`,
          cpp: `vector<vector<int>> fourSum(vector<int>& nums, int target) {
  auto a = nums;
  sort(a.begin(), a.end());
  int n = (int)a.size();
  vector<vector<int>> out;
  for (int i = 0; i < n; i++) {
    if (i && a[i] == a[i - 1]) continue;
    for (int j = i + 1; j < n; j++) {
      if (j > i + 1 && a[j] == a[j - 1]) continue;
      int L = j + 1, R = n - 1;
      while (L < R) {
        long long sum = (long long)a[i] + a[j] + a[L] + a[R];
        if (sum == target) {
          out.push_back({ a[i], a[j], a[L], a[R] });
          L++; R--;
          while (L < R && a[L] == a[L - 1]) L++;
          while (L < R && a[R] == a[R + 1]) R--;
        } else if (sum < target) L++;
        else R--;
      }
    }
  }
  return out;
}`,
          c: `void fourSum(int* nums, int n, int target, int out[][4], int* on) {
  /* assume nums already sorted */
  int i, j, L, R;
  *on = 0;
  for (i = 0; i < n; i++) {
    if (i && nums[i] == nums[i - 1]) continue;
    for (j = i + 1; j < n; j++) {
      if (j > i + 1 && nums[j] == nums[j - 1]) continue;
      L = j + 1; R = n - 1;
      while (L < R) {
        int sum = nums[i] + nums[j] + nums[L] + nums[R];
        if (sum == target) {
          out[*on][0] = nums[i]; out[*on][1] = nums[j];
          out[*on][2] = nums[L]; out[*on][3] = nums[R];
          (*on)++; L++; R--;
          while (L < R && nums[L] == nums[L - 1]) L++;
          while (L < R && nums[R] == nums[R + 1]) R--;
        } else if (sum < target) L++;
        else R--;
      }
    }
  }
}`
        })
    ]
  };
}

function q28() {
  return {
    id: 28,
    level: "intermediate",
    q: "3Sum Closest",
    ask: "Amazon · Google · Microsoft · Bloomberg",
    links: [lc("3sum-closest"), gfgProblem("triplet-sum-closest-to-x1114")],
    a: "Find three numbers whose sum is as close as possible to target. Return that sum (not the triple). Exactly one best sum is guaranteed.\n\nExample: nums = [-1, 2, 1, -4], target = 1. The sum 2 is closest ( -1 + 2 + 1 ).\n\nBrute tries every triple. Optimal sorts then binary-searches the third value. More optimal is sort plus two pointers, tracking the closest sum.",
    solutions: [
      makeSol("Brute", "O(n³)", "O(1)",
        "Every triple, track the sum whose absolute gap to target is smallest.",
        {
          javascript: `function threeSumClosest(nums, target) {
  const n = nums.length;
  let best = nums[0] + nums[1] + nums[2];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        const s = nums[i] + nums[j] + nums[k];
        if (Math.abs(s - target) < Math.abs(best - target)) best = s;
      }
    }
  }
  return best;
}`,
          python: `def threeSumClosest(nums, target):
  n = len(nums)
  best = nums[0] + nums[1] + nums[2]
  for i in range(n):
    for j in range(i + 1, n):
      for k in range(j + 1, n):
        s = nums[i] + nums[j] + nums[k]
        if abs(s - target) < abs(best - target):
          best = s
  return best`,
          java: `class Solution {
  public int threeSumClosest(int[] nums, int target) {
    int n = nums.length, best = nums[0] + nums[1] + nums[2];
    for (int i = 0; i < n; i++)
      for (int j = i + 1; j < n; j++)
        for (int k = j + 1; k < n; k++) {
          int s = nums[i] + nums[j] + nums[k];
          if (Math.abs(s - target) < Math.abs(best - target)) best = s;
        }
    return best;
  }
}`,
          cpp: `int threeSumClosest(vector<int>& nums, int target) {
  int n = (int)nums.size(), best = nums[0] + nums[1] + nums[2];
  for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
      for (int k = j + 1; k < n; k++) {
        int s = nums[i] + nums[j] + nums[k];
        if (abs(s - target) < abs(best - target)) best = s;
      }
  return best;
}`,
          c: `int threeSumClosest(int* nums, int n, int target) {
  int i, j, k, best = nums[0] + nums[1] + nums[2];
  for (i = 0; i < n; i++)
    for (j = i + 1; j < n; j++)
      for (k = j + 1; k < n; k++) {
        int s = nums[i] + nums[j] + nums[k];
        int d1 = s - target; if (d1 < 0) d1 = -d1;
        int d2 = best - target; if (d2 < 0) d2 = -d2;
        if (d1 < d2) best = s;
      }
  return best;
}`
        }),
      makeSol("Optimal", "O(n² log n)", "O(n)",
        "Sort. Fix two indexes, binary search the value closest to the leftover. Extra log n on each pair.",
        {
          javascript: `function threeSumClosest(nums, target) {
  const a = nums.slice().sort(function (x, y) { return x - y; });
  const n = a.length;
  let best = a[0] + a[1] + a[2];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const need = target - a[i] - a[j];
      let lo = j + 1, hi = n - 1, pick = j + 1;
      if (lo > hi) continue;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (a[mid] === need) return target;
        if (a[mid] < need) { pick = mid; lo = mid + 1; }
        else { pick = mid; hi = mid - 1; }
      }
      const cand = [pick, pick - 1, pick + 1];
      for (let t = 0; t < cand.length; t++) {
        const k = cand[t];
        if (k <= j || k >= n) continue;
        const s = a[i] + a[j] + a[k];
        if (Math.abs(s - target) < Math.abs(best - target)) best = s;
      }
    }
  }
  return best;
}`,
          python: `def threeSumClosest(nums, target):
  a = sorted(nums)
  n = len(a)
  best = a[0] + a[1] + a[2]
  for i in range(n):
    for j in range(i + 1, n):
      need = target - a[i] - a[j]
      lo, hi, pick = j + 1, n - 1, j + 1
      if lo > hi:
        continue
      while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == need:
          return target
        pick = mid
        if a[mid] < need:
          lo = mid + 1
        else:
          hi = mid - 1
      for k in (pick, pick - 1, pick + 1):
        if k <= j or k >= n:
          continue
        s = a[i] + a[j] + a[k]
        if abs(s - target) < abs(best - target):
          best = s
  return best`,
          java: `import java.util.*;
class Solution {
  public int threeSumClosest(int[] nums, int target) {
    Arrays.sort(nums);
    int n = nums.length, best = nums[0] + nums[1] + nums[2];
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        int need = target - nums[i] - nums[j];
        int lo = j + 1, hi = n - 1, pick = j + 1;
        if (lo > hi) continue;
        while (lo <= hi) {
          int mid = (lo + hi) / 2;
          if (nums[mid] == need) return target;
          pick = mid;
          if (nums[mid] < need) lo = mid + 1;
          else hi = mid - 1;
        }
        int[] cand = { pick, pick - 1, pick + 1 };
        for (int k : cand) {
          if (k <= j || k >= n) continue;
          int s = nums[i] + nums[j] + nums[k];
          if (Math.abs(s - target) < Math.abs(best - target)) best = s;
        }
      }
    }
    return best;
  }
}`,
          cpp: `int threeSumClosest(vector<int>& nums, int target) {
  auto a = nums;
  sort(a.begin(), a.end());
  int n = (int)a.size(), best = a[0] + a[1] + a[2];
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      int need = target - a[i] - a[j];
      int lo = j + 1, hi = n - 1, pick = j + 1;
      if (lo > hi) continue;
      while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (a[mid] == need) return target;
        pick = mid;
        if (a[mid] < need) lo = mid + 1;
        else hi = mid - 1;
      }
      int cand[3] = { pick, pick - 1, pick + 1 };
      for (int t = 0; t < 3; t++) {
        int k = cand[t];
        if (k <= j || k >= n) continue;
        int s = a[i] + a[j] + a[k];
        if (abs(s - target) < abs(best - target)) best = s;
      }
    }
  }
  return best;
}`,
          c: `/* sort, then two loops plus binary search for the third value */`
        }),
      makeSol("More optimal", "O(n²)", "O(1) extra",
        "Sort. Fix i. Two pointers on the rest. Move the side that improves the sum. Track the closest. Stop early on an exact hit.",
        {
          javascript: `function threeSumClosest(nums, target) {
  const a = nums.slice().sort(function (x, y) { return x - y; });
  const n = a.length;
  let best = a[0] + a[1] + a[2];
  for (let i = 0; i < n; i++) {
    let L = i + 1, R = n - 1;
    while (L < R) {
      const s = a[i] + a[L] + a[R];
      if (Math.abs(s - target) < Math.abs(best - target)) best = s;
      if (s === target) return s;
      if (s < target) L++;
      else R--;
    }
  }
  return best;
}`,
          python: `def threeSumClosest(nums, target):
  a = sorted(nums)
  n = len(a)
  best = a[0] + a[1] + a[2]
  for i in range(n):
    L, R = i + 1, n - 1
    while L < R:
      s = a[i] + a[L] + a[R]
      if abs(s - target) < abs(best - target):
        best = s
      if s == target:
        return s
      if s < target:
        L += 1
      else:
        R -= 1
  return best`,
          java: `import java.util.*;
class Solution {
  public int threeSumClosest(int[] nums, int target) {
    Arrays.sort(nums);
    int n = nums.length, best = nums[0] + nums[1] + nums[2];
    for (int i = 0; i < n; i++) {
      int L = i + 1, R = n - 1;
      while (L < R) {
        int s = nums[i] + nums[L] + nums[R];
        if (Math.abs(s - target) < Math.abs(best - target)) best = s;
        if (s == target) return s;
        if (s < target) L++;
        else R--;
      }
    }
    return best;
  }
}`,
          cpp: `int threeSumClosest(vector<int>& nums, int target) {
  auto a = nums;
  sort(a.begin(), a.end());
  int n = (int)a.size(), best = a[0] + a[1] + a[2];
  for (int i = 0; i < n; i++) {
    int L = i + 1, R = n - 1;
    while (L < R) {
      int s = a[i] + a[L] + a[R];
      if (abs(s - target) < abs(best - target)) best = s;
      if (s == target) return s;
      if (s < target) L++;
      else R--;
    }
  }
  return best;
}`,
          c: `int cmpInt(const void* a, const void* b) { return *(const int*)a - *(const int*)b; }
int threeSumClosest(int* nums, int n, int target) {
  int i, L, R, best;
  qsort(nums, n, sizeof(int), cmpInt);
  best = nums[0] + nums[1] + nums[2];
  for (i = 0; i < n; i++) {
    L = i + 1; R = n - 1;
    while (L < R) {
      int s = nums[i] + nums[L] + nums[R];
      int d1 = s - target; if (d1 < 0) d1 = -d1;
      int d2 = best - target; if (d2 < 0) d2 = -d2;
      if (d1 < d2) best = s;
      if (s == target) return s;
      if (s < target) L++;
      else R--;
    }
  }
  return best;
}`
        })
    ]
  };
}

function q29() {
  return {
    id: 29,
    level: "beginner",
    q: "Plus One",
    ask: "Google · Amazon · Microsoft",
    links: [lc("plus-one"), gfgArt("plus-one")],
    a: "digits is a non-negative integer, most significant digit first, no leading zeros. Add one and return the new digit array.\n\nExample: [1, 2, 3] becomes [1, 2, 4]. [9, 9] becomes [1, 0, 0].\n\nBrute joins into a big number (breaks on overflow in fixed ints). Optimal walks from the right with carry into a new array. More optimal edits in place and only allocates if every digit was 9.",
    solutions: [
      makeSol("Brute", "O(n)", "O(n)",
        "Build a string / BigInt, add one, split back to digits. Fine in JS/Python, illegal in Java int, and not the interview idea.",
        {
          javascript: `function plusOne(digits) {
  let s = "";
  for (let i = 0; i < digits.length; i++) s += String(digits[i]);
  const t = String(BigInt(s) + 1n);
  const out = [];
  for (let i = 0; i < t.length; i++) out.push(t.charCodeAt(i) - 48);
  return out;
}`,
          python: `def plusOne(digits):
  n = 0
  for d in digits:
    n = n * 10 + d
  n += 1
  return [int(ch) for ch in str(n)]`,
          java: `import java.math.BigInteger;
class Solution {
  public int[] plusOne(int[] digits) {
    StringBuilder sb = new StringBuilder();
    for (int d : digits) sb.append(d);
    BigInteger n = new BigInteger(sb.toString()).add(BigInteger.ONE);
    String t = n.toString();
    int[] out = new int[t.length()];
    for (int i = 0; i < t.length(); i++) out[i] = t.charAt(i) - '0';
    return out;
  }
}`,
          cpp: `vector<int> plusOne(vector<int>& digits) {
  /* treat as base-10 array instead of a native big int */
  vector<int> out = digits;
  int i = (int)out.size() - 1, carry = 1;
  while (i >= 0 && carry) {
    int s = out[i] + carry;
    out[i] = s % 10;
    carry = s / 10;
    i--;
  }
  if (carry) out.insert(out.begin(), 1);
  return out;
}`,
          c: `/* convert to a decimal string, add 1 by hand from the right */`
        }),
      makeSol("Optimal", "O(n)", "O(n)",
        "Copy into a new array. From the last index, add 1 and propagate carry. If carry remains, allocate one extra leading 1.",
        {
          javascript: `function plusOne(digits) {
  const out = digits.slice();
  let carry = 1;
  for (let i = out.length - 1; i >= 0 && carry; i--) {
    const s = out[i] + carry;
    out[i] = s % 10;
    carry = (s / 10) | 0;
  }
  if (carry) out.unshift(1);
  return out;
}`,
          python: `def plusOne(digits):
  out = digits[:]
  carry = 1
  i = len(out) - 1
  while i >= 0 and carry:
    s = out[i] + carry
    out[i] = s % 10
    carry = s // 10
    i -= 1
  if carry:
    out = [1] + out
  return out`,
          java: `class Solution {
  public int[] plusOne(int[] digits) {
    int n = digits.length;
    int[] out = digits.clone();
    int carry = 1;
    for (int i = n - 1; i >= 0 && carry == 1; i--) {
      int s = out[i] + carry;
      out[i] = s % 10;
      carry = s / 10;
    }
    if (carry == 0) return out;
    int[] big = new int[n + 1];
    big[0] = 1;
    for (int i = 0; i < n; i++) big[i + 1] = out[i];
    return big;
  }
}`,
          cpp: `vector<int> plusOne(vector<int>& digits) {
  vector<int> out = digits;
  int carry = 1;
  for (int i = (int)out.size() - 1; i >= 0 && carry; i--) {
    int s = out[i] + carry;
    out[i] = s % 10;
    carry = s / 10;
  }
  if (carry) out.insert(out.begin(), 1);
  return out;
}`,
          c: `int plusOne(int* digits, int n, int* out) {
  int i, carry = 1;
  for (i = 0; i < n; i++) out[i + 1] = digits[i];
  for (i = n; i >= 1 && carry; i--) {
    int s = out[i] + carry;
    out[i] = s % 10;
    carry = s / 10;
  }
  if (carry) { out[0] = 1; return n + 1; }
  for (i = 0; i < n; i++) out[i] = out[i + 1];
  return n;
}`
        }),
      makeSol("More optimal", "O(n)", "O(1) extra if no new digit",
        "Walk from the right on the input. A digit < 9 becomes digit+1 and you return immediately. All nines become a new array [1, 0, 0, ...].",
        {
          javascript: `function plusOne(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    }
    digits[i] = 0;
  }
  const out = Array(digits.length + 1).fill(0);
  out[0] = 1;
  return out;
}`,
          python: `def plusOne(digits):
  for i in range(len(digits) - 1, -1, -1):
    if digits[i] < 9:
      digits[i] += 1
      return digits
    digits[i] = 0
  return [1] + digits`,
          java: `class Solution {
  public int[] plusOne(int[] digits) {
    for (int i = digits.length - 1; i >= 0; i--) {
      if (digits[i] < 9) { digits[i]++; return digits; }
      digits[i] = 0;
    }
    int[] out = new int[digits.length + 1];
    out[0] = 1;
    return out;
  }
}`,
          cpp: `vector<int> plusOne(vector<int>& digits) {
  for (int i = (int)digits.size() - 1; i >= 0; i--) {
    if (digits[i] < 9) { digits[i]++; return digits; }
    digits[i] = 0;
  }
  vector<int> out((int)digits.size() + 1);
  out[0] = 1;
  return out;
}`,
          c: `int plusOneInPlace(int* digits, int n, int* out) {
  int i;
  for (i = n - 1; i >= 0; i--) {
    if (digits[i] < 9) { digits[i]++; for (i = 0; i < n; i++) out[i] = digits[i]; return n; }
    digits[i] = 0;
  }
  out[0] = 1;
  for (i = 0; i < n; i++) out[i + 1] = 0;
  return n + 1;
}`
        })
    ]
  };
}

function q30() {
  return {
    id: 30,
    level: "beginner",
    q: "Pascal's Triangle",
    ask: "Amazon · Google · Microsoft · Apple",
    links: [lc("pascals-triangle"), gfgProblem("pascal-triangle")],
    a: "Return the first numRows of Pascal's triangle. Row i has i numbers. Each inner value is the sum of the two values above it. Rows are 1-indexed in speech, 0-indexed in arrays.\n\nExample: numRows = 5 yields [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]].\n\nBrute uses nCr for every cell. Optimal builds each row from the previous. More optimal fills a row with the multiplicative formula C(r, k) = C(r, k-1) * (r-k+1)/k.",
    solutions: [
      makeSol("Brute", "O(n³) with naive fact", "O(n²)",
        "Each cell is nCr. Computing factorials from scratch per cell is slow and overflows. Picture is right, implementation is not the interview one.",
        {
          javascript: `function generate(numRows) {
  function nCr(n, r) {
    let a = 1, b = 1;
    for (let i = 0; i < r; i++) {
      a *= (n - i);
      b *= (i + 1);
    }
    return Math.round(a / b);
  }
  const out = [];
  for (let i = 0; i < numRows; i++) {
    const row = [];
    for (let j = 0; j <= i; j++) row.push(nCr(i, j));
    out.push(row);
  }
  return out;
}`,
          python: `def generate(numRows):
  def nCr(n, r):
    a = b = 1
    for i in range(r):
      a *= n - i
      b *= i + 1
    return a // b
  out = []
  for i in range(numRows):
    out.append([nCr(i, j) for j in range(i + 1)])
  return out`,
          java: `import java.util.*;
class Solution {
  long nCr(int n, int r) {
    long a = 1, b = 1;
    for (int i = 0; i < r; i++) { a *= (n - i); b *= (i + 1); }
    return a / b;
  }
  public List<List<Integer>> generate(int numRows) {
    List<List<Integer>> out = new ArrayList<List<Integer>>();
    for (int i = 0; i < numRows; i++) {
      List<Integer> row = new ArrayList<Integer>();
      for (int j = 0; j <= i; j++) row.add((int) nCr(i, j));
      out.add(row);
    }
    return out;
  }
}`,
          cpp: `vector<vector<int>> generate(int numRows) {
  auto nCr = [](int n, int r) {
    long a = 1, b = 1;
    for (int i = 0; i < r; i++) { a *= (n - i); b *= (i + 1); }
    return (int)(a / b);
  };
  vector<vector<int>> out;
  for (int i = 0; i < numRows; i++) {
    vector<int> row;
    for (int j = 0; j <= i; j++) row.push_back(nCr(i, j));
    out.push_back(row);
  }
  return out;
}`,
          c: `long nCr(int n, int r) {
  long a = 1, b = 1; int i;
  for (i = 0; i < r; i++) { a *= (n - i); b *= (i + 1); }
  return a / b;
}`
        }),
      makeSol("Optimal", "O(n²)", "O(n²)",
        "Row 0 is [1]. Each next row starts and ends with 1. Inner slot j is prev[j-1] + prev[j]. No overflow beyond 32-bit on the usual n <= 30 constraint.",
        {
          javascript: `function generate(numRows) {
  const out = [[1]];
  for (let r = 1; r < numRows; r++) {
    const prev = out[r - 1];
    const row = [1];
    for (let j = 1; j < r; j++) row.push(prev[j - 1] + prev[j]);
    row.push(1);
    out.push(row);
  }
  return out;
}`,
          python: `def generate(numRows):
  out = [[1]]
  for r in range(1, numRows):
    prev = out[-1]
    row = [1]
    for j in range(1, r):
      row.append(prev[j - 1] + prev[j])
    row.append(1)
    out.append(row)
  return out`,
          java: `import java.util.*;
class Solution {
  public List<List<Integer>> generate(int numRows) {
    List<List<Integer>> out = new ArrayList<List<Integer>>();
    out.add(Arrays.asList(1));
    for (int r = 1; r < numRows; r++) {
      List<Integer> prev = out.get(r - 1);
      List<Integer> row = new ArrayList<Integer>();
      row.add(1);
      for (int j = 1; j < r; j++) row.add(prev.get(j - 1) + prev.get(j));
      row.add(1);
      out.add(row);
    }
    return out;
  }
}`,
          cpp: `vector<vector<int>> generate(int numRows) {
  vector<vector<int>> out = {{1}};
  for (int r = 1; r < numRows; r++) {
    vector<int>& prev = out.back();
    vector<int> row = {1};
    for (int j = 1; j < r; j++) row.push_back(prev[j - 1] + prev[j]);
    row.push_back(1);
    out.push_back(row);
  }
  return out;
}`,
          c: `void generate(int numRows, int out[][32], int* lens) {
  int r, j;
  out[0][0] = 1; lens[0] = 1;
  for (r = 1; r < numRows; r++) {
    out[r][0] = 1;
    for (j = 1; j < r; j++) out[r][j] = out[r - 1][j - 1] + out[r - 1][j];
    out[r][r] = 1;
    lens[r] = r + 1;
  }
}`
        }),
      makeSol("More optimal", "O(n²)", "O(n²)",
        "Each row built independently with the running product formula. Useful when you only need row r (Pascal's Triangle II) and do not want the whole triangle.",
        {
          javascript: `function generate(numRows) {
  const out = [];
  for (let r = 0; r < numRows; r++) {
    const row = [1];
    let v = 1;
    for (let k = 1; k <= r; k++) {
      v = v * (r - k + 1) / k;
      row.push(Math.round(v));
    }
    out.push(row);
  }
  return out;
}`,
          python: `def generate(numRows):
  out = []
  for r in range(numRows):
    row = [1]
    v = 1
    for k in range(1, r + 1):
      v = v * (r - k + 1) // k
      row.append(v)
    out.append(row)
  return out`,
          java: `import java.util.*;
class Solution {
  public List<List<Integer>> generate(int numRows) {
    List<List<Integer>> out = new ArrayList<List<Integer>>();
    for (int r = 0; r < numRows; r++) {
      List<Integer> row = new ArrayList<Integer>();
      long v = 1;
      row.add(1);
      for (int k = 1; k <= r; k++) {
        v = v * (r - k + 1) / k;
        row.add((int) v);
      }
      out.add(row);
    }
    return out;
  }
}`,
          cpp: `vector<vector<int>> generate(int numRows) {
  vector<vector<int>> out;
  for (int r = 0; r < numRows; r++) {
    vector<int> row;
    long v = 1;
    row.push_back(1);
    for (int k = 1; k <= r; k++) {
      v = v * (r - k + 1) / k;
      row.push_back((int)v);
    }
    out.push_back(row);
  }
  return out;
}`,
          c: `void generateRow(int r, int* row) {
  int k; long v = 1;
  row[0] = 1;
  for (k = 1; k <= r; k++) {
    v = v * (r - k + 1) / k;
    row[k] = (int)v;
  }
}`
        })
    ]
  };
}

function q31() {
  return {
    id: 31,
    level: "intermediate",
    q: "Find All Duplicates in an Array",
    ask: "Amazon · Google · Microsoft",
    links: [lc("find-all-duplicates-in-an-array"), gfgProblem("find-duplicates-in-an-array")],
    a: "nums holds n integers, each in 1..n. Some appear twice, the rest once. Return every value that appears twice. O(n) time and O(1) extra space is the follow-up (you may mutate nums).\n\nExample: [4, 3, 2, 7, 8, 2, 3, 1] answers [2, 3].\n\nBrute is nested counts. Optimal sorts. More optimal marks index abs(x)-1 negative; a second negative means a duplicate.",
    solutions: [
      makeSol("Brute", "O(n²)", "O(1)",
        "For each value, count how many times it appears. Push it once if the count is 2. Slow, no extra set.",
        {
          javascript: `function findDuplicates(nums) {
  const out = [];
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    let c = 0;
    for (let j = 0; j < n; j++) if (nums[j] === nums[i]) c++;
    if (c === 2) {
      let seen = false;
      for (let k = 0; k < out.length; k++) if (out[k] === nums[i]) seen = true;
      if (!seen) out.push(nums[i]);
    }
  }
  return out;
}`,
          python: `def findDuplicates(nums):
  out = []
  n = len(nums)
  for i in range(n):
    c = sum(1 for j in range(n) if nums[j] == nums[i])
    if c == 2 and nums[i] not in out:
      out.append(nums[i])
  return out`,
          java: `import java.util.*;
class Solution {
  public List<Integer> findDuplicates(int[] nums) {
    List<Integer> out = new ArrayList<Integer>();
    int n = nums.length;
    for (int i = 0; i < n; i++) {
      int c = 0;
      for (int j = 0; j < n; j++) if (nums[j] == nums[i]) c++;
      if (c == 2 && !out.contains(nums[i])) out.add(nums[i]);
    }
    return out;
  }
}`,
          cpp: `vector<int> findDuplicates(vector<int>& nums) {
  vector<int> out;
  int n = (int)nums.size();
  for (int i = 0; i < n; i++) {
    int c = 0;
    for (int j = 0; j < n; j++) if (nums[j] == nums[i]) c++;
    if (c == 2 && find(out.begin(), out.end(), nums[i]) == out.end()) out.push_back(nums[i]);
  }
  return out;
}`,
          c: `int findDuplicates(int* nums, int n, int* out) {
  int i, j, on = 0;
  for (i = 0; i < n; i++) {
    int c = 0, seen = 0, k;
    for (j = 0; j < n; j++) if (nums[j] == nums[i]) c++;
    if (c != 2) continue;
    for (k = 0; k < on; k++) if (out[k] == nums[i]) seen = 1;
    if (!seen) out[on++] = nums[i];
  }
  return on;
}`
        }),
      makeSol("Optimal", "O(n log n)", "O(1) extra",
        "Sort, then walk adjacent pairs. Equal neighbors are a duplicate. Simple, mutates order.",
        {
          javascript: `function findDuplicates(nums) {
  const a = nums.slice().sort(function (x, y) { return x - y; });
  const out = [];
  for (let i = 1; i < a.length; i++) {
    if (a[i] === a[i - 1]) out.push(a[i]);
  }
  return out;
}`,
          python: `def findDuplicates(nums):
  a = sorted(nums)
  out = []
  for i in range(1, len(a)):
    if a[i] == a[i - 1]:
      out.append(a[i])
  return out`,
          java: `import java.util.*;
class Solution {
  public List<Integer> findDuplicates(int[] nums) {
    Arrays.sort(nums);
    List<Integer> out = new ArrayList<Integer>();
    for (int i = 1; i < nums.length; i++) if (nums[i] == nums[i - 1]) out.add(nums[i]);
    return out;
  }
}`,
          cpp: `vector<int> findDuplicates(vector<int>& nums) {
  auto a = nums;
  sort(a.begin(), a.end());
  vector<int> out;
  for (int i = 1; i < (int)a.size(); i++) if (a[i] == a[i - 1]) out.push_back(a[i]);
  return out;
}`,
          c: `int cmpInt(const void* a, const void* b) { return *(const int*)a - *(const int*)b; }
int findDuplicates(int* nums, int n, int* out) {
  int i, on = 0;
  qsort(nums, n, sizeof(int), cmpInt);
  for (i = 1; i < n; i++) if (nums[i] == nums[i - 1]) out[on++] = nums[i];
  return on;
}`
        }),
      makeSol("More optimal", "O(n)", "O(1) extra",
        "Value x belongs at index x-1. Negate that slot when you first see x. If it is already negative, x is the duplicate. Restore signs later if you must.",
        {
          javascript: `function findDuplicates(nums) {
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    const x = nums[i] < 0 ? -nums[i] : nums[i];
    const slot = x - 1;
    if (nums[slot] < 0) out.push(x);
    else nums[slot] = -nums[slot];
  }
  return out;
}`,
          python: `def findDuplicates(nums):
  out = []
  for i in range(len(nums)):
    x = abs(nums[i])
    slot = x - 1
    if nums[slot] < 0:
      out.append(x)
    else:
      nums[slot] = -nums[slot]
  return out`,
          java: `import java.util.*;
class Solution {
  public List<Integer> findDuplicates(int[] nums) {
    List<Integer> out = new ArrayList<Integer>();
    for (int i = 0; i < nums.length; i++) {
      int x = Math.abs(nums[i]);
      int slot = x - 1;
      if (nums[slot] < 0) out.add(x);
      else nums[slot] = -nums[slot];
    }
    return out;
  }
}`,
          cpp: `vector<int> findDuplicates(vector<int>& nums) {
  vector<int> out;
  for (int i = 0; i < (int)nums.size(); i++) {
    int x = nums[i] < 0 ? -nums[i] : nums[i];
    int slot = x - 1;
    if (nums[slot] < 0) out.push_back(x);
    else nums[slot] = -nums[slot];
  }
  return out;
}`,
          c: `int findDuplicatesMark(int* nums, int n, int* out) {
  int i, on = 0;
  for (i = 0; i < n; i++) {
    int x = nums[i] < 0 ? -nums[i] : nums[i];
    int slot = x - 1;
    if (nums[slot] < 0) out[on++] = x;
    else nums[slot] = -nums[slot];
  }
  return on;
}`
        })
    ]
  };
}

module.exports = [q26(), q27(), q28(), q29(), q30(), q31()];
