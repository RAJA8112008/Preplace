window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["dsa-arrays"] = {
  kind: "dsa",
  notes: [
    {
      title: "Read the whole list once when you can",
      body: "Many array problems look like they need nested loops. First ask whether one left-to-right pass is enough if you remember a running fact: the smallest price so far, the farthest jump, a count of zeros. Nested loops are O(n²). One pass is O(n). Interviewers want the one-pass idea after you show you understand the slow version."
    },
    {
      title: "Two pointers",
      body: "Put one index on the left and one on the right, or both on the left with different jobs (read vs write). You move a pointer when that side cannot beat the current answer. Container With Most Water and 3Sum after sorting use this. The list must be sorted, or the pointers must have a clear reason to only move forward. Do not jump pointers at random."
    },
    {
      title: "Sliding window",
      body: "A window is a subarray [left, right] that grows on the right and shrinks on the left. You keep a running sum or a map of what is inside. When the window breaks a rule (sum too big, a duplicate character), move left. Subarray Sum Equals K is usually prefix plus map, not a window, because k can be met by dropping a prefix, not by shrinking from the left in a simple way."
    },
    {
      title: "Prefix sums",
      body: "prefix[i] is nums[0] + ... + nums[i - 1] (or through i — pick one style and stay with it). The sum of nums[l..r] is prefix[r + 1] - prefix[l]. Building the prefix array is O(n). Then a range sum is O(1). A map of prefix values answers “have I seen prefix - k before?” in Subarray Sum Equals K."
    },
    {
      title: "Hash map for a partner",
      body: "If you need two values that relate (they add to target, they are duplicates, they complete a product), store what you have already seen. Map value -> index or value -> count. Average lookup is O(1). The cost is extra memory. Two Sum’s O(n) solution is this pattern."
    },
    {
      title: "Kadane and running best",
      body: "Kadane walks left to right and at each index asks: extend the previous subarray, or start a new one here? Keep a runningSum and a best. Maximum Subarray is the classic. Maximum Product Subarray needs a running min as well, because a negative times a negative can become the new max."
    },
    {
      title: "Sort, then scan",
      body: "Sorting costs O(n log n) and then many problems become a linear merge or a two-pointer walk. Merge Intervals, 3Sum, and Longest Consecutive (the sort version) work this way. Sorting changes order, so save original indexes when the answer needs positions, as in Two Sum."
    },
    {
      title: "Intervals",
      body: "An interval is a pair [start, end]. Two intervals overlap when A.start <= B.end and B.start <= A.end. Sort by start, then walk once, stretching the current end when the next start is not past it. Insert Interval is the same walk with one extra interval mixed in. Drawing the line on paper beats guessing."
    },
    {
      title: "In-place tricks",
      body: "When extra arrays are not allowed, reuse the input. Reverse three times to rotate. Use the first row and column as flags in Set Matrix Zeroes. Place each number x at index x - 1 in First Missing Positive. These tricks are O(1) extra space but they overwrite the input, so say that out loud in an interview."
    },
    {
      title: "Binary search on a rotated list",
      body: "A rotated sorted array is two sorted runs stuck together. Mid is in the left run or the right run. One of the two halves is still sorted. If the target sits in the sorted half, search there; otherwise search the other half. That is still O(log n). Linear scan is the brute version, not the interview finish line."
    },
    {
      title: "Matrices / 2D arrays",
      body: "A matrix is an array of rows. matrix[r][c] is row r, column c. An n by n square has a main diagonal r === c and an anti-diagonal r + c === n - 1. Rotate, spiral, and set-zeroes all walk layers or use the first row and column as extra flags. Bound-check every neighbor. In-place rotate overwrites cells, so save a temp (or rotate a 4-cycle) before you write."
    }
  ],
  examples: [
    {
      lang: "js",
      title: "Two pointers from both ends",
      desc: "What this is\nLeft starts at 0. Right starts at the last index. You move the side that cannot improve the answer.\nThis is the Container With Most Water pattern.\n\nWhat the code is doing\nheight holds bar heights.\nThe area is min(left bar, right bar) times the gap.\nIf the left bar is shorter, left moves right. The right bar cannot help that short left bar.\nbest remembers the largest area seen.\n\nWatch out\nThis only works because a shorter bar with a smaller width cannot win.\nIf the list is not about width between indexes, do not copy this blindly.",
      code: `function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let best = 0;

  while (left < right) {
    const h = Math.min(height[left], height[right]);
    const area = h * (right - left);
    if (area > best) best = area;

    if (height[left] < height[right]) left++;
    else right--;
  }

  return best;
}

console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49`,
      codes: {
        javascript: `function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let best = 0;

  while (left < right) {
    const h = Math.min(height[left], height[right]);
    const area = h * (right - left);
    if (area > best) best = area;

    if (height[left] < height[right]) left++;
    else right--;
  }

  return best;
}

console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49`,
        python: `def max_area(height):
    left = 0
    right = len(height) - 1
    best = 0

    while left < right:
        h = min(height[left], height[right])
        area = h * (right - left)
        if area > best: best = area

        if height[left] < height[right]: left += 1
        else: right -= 1

    return best

print(max_area([1, 8, 6, 2, 5, 4, 8, 3, 7])) # 49`,
        java: `class Solution {
  public int maxArea(int[] height) {
    int left = 0;
    int right = height.length - 1;
    int best = 0;

    while (left < right) {
      int h = Math.min(height[left], height[right]);
      int area = h * (right - left);
      if (area > best) best = area;

      if (height[left] < height[right]) left++;
      else right--;
    }

    return best;
  }

  // demo System.out.println(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
}`,
        cpp: `// vector, unordered_map, string
int maxArea(vector<int>& height) {
  int left = 0;
  int right = (int)height.size() - 1;
  int best = 0;

  while (left < right) {
    int h = min(height[left], height[right]);
    int area = h * (right - left);
    if (area > best) best = area;

    if (height[left] < height[right]) left++;
    else right--;
  }

  return best;
}

cout << (maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])) << "\\n"; // 49`,
        c: `/* pass n for array length; simple loops */
int maxArea(int* height, int n) {
  int left = 0;
  int right = n - 1;
  int best = 0;

  while (left < right) {
    int h = (height[left] < height[right] ? height[left] : height[right]);
    int area = h * (right - left);
    if (area > best) best = area;

    if (height[left] < height[right]) left++;
    else right--;
  }

  return best;
}

printf("%d\\n", maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49`
      }
    },
    {
      lang: "js",
      title: "Write pointer (same-direction two pointers)",
      desc: "What this is\nOne index reads every item. Another index writes the next kept item.\nMove Zeroes uses this: keep non-zeros packed on the left.\n\nWhat the code is doing\nwrite is the next slot for a non-zero.\nThe first loop copies each non-zero forward.\nThe second loop fills the rest with 0.\nnums is edited in place.\n\nWatch out\nwrite and read can be the same index. That is fine.\nDo not splice inside the loop. splice is O(n) each time and becomes O(n²).",
      code: `function moveZeroes(nums) {
  let write = 0;

  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      nums[write] = nums[read];
      write++;
    }
  }

  while (write < nums.length) {
    nums[write] = 0;
    write++;
  }

  return nums;
}

console.log(moveZeroes([0, 1, 0, 3, 12])); // [1, 3, 12, 0, 0]`,
      codes: {
        javascript: `function moveZeroes(nums) {
  let write = 0;

  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      nums[write] = nums[read];
      write++;
    }
  }

  while (write < nums.length) {
    nums[write] = 0;
    write++;
  }

  return nums;
}

console.log(moveZeroes([0, 1, 0, 3, 12])); // [1, 3, 12, 0, 0]`,
        python: `def move_zeroes(nums):
    write = 0

    for read in range(len(nums)):

        if nums[read] != 0:
            nums[write] = nums[read]
            write += 1

    while write < len(nums):
        nums[write] = 0
        write += 1

    return nums

print(move_zeroes([0, 1, 0, 3, 12])) # [1, 3, 12, 0, 0]`,
        java: `class Solution {
  public int[] moveZeroes(int[] nums) {
    int write = 0;

    for (int read = 0; read < nums.length; read++) {
      if (nums[read] != 0) {
        nums[write] = nums[read];
        write++;
      }
    }

    while (write < nums.length) {
      nums[write] = 0;
      write++;
    }

    return nums;
  }

  // demo System.out.println(moveZeroes([0, 1, 0, 3, 12])); // [1, 3, 12, 0, 0]
}`,
        cpp: `// vector, unordered_map, string
vector<int> moveZeroes(vector<int>& nums) {
  int write = 0;

  for (int read = 0; read < (int)nums.size(); read++) {
    if (nums[read] != 0) {
      nums[write] = nums[read];
      write++;
    }
  }

  while (write < (int)nums.size()) {
    nums[write] = 0;
    write++;
  }

  return nums;
}

cout << (moveZeroes([0, 1, 0, 3, 12])) << "\\n"; // [1, 3, 12, 0, 0]`,
        c: `/* pass n for array length; simple loops */
void moveZeroes(int* nums, int n) {
  int write = 0;

  for (int read = 0; read < n; read++) {
    if (nums[read] != 0) {
      nums[write] = nums[read];
      write++;
    }
  }

  while (write < n) {
    nums[write] = 0;
    write++;
  }

  return nums;
}

printf("%d\\n", moveZeroes([0, 1, 0, 3, 12])); // [1, 3, 12, 0, 0]`
      }
    },
    {
      lang: "js",
      title: "Sliding window with a running sum",
      desc: "What this is\nRight grows the window. Left shrinks it when the sum is too large.\nHere we want the shortest subarray whose sum is at least target.\n\nWhat the code is doing\nsum adds nums[right].\nWhile sum >= target, we record the length and drop nums[left].\nbest starts as Infinity so the first real window can replace it.\nIf no window works, we return 0.\n\nWatch out\nThis needs all numbers non-negative. A negative number can make “shrink when too big” wrong.\nFor mixed signs, use prefix sums instead.",
      code: `function minLenAtLeast(nums, target) {
  let left = 0;
  let sum = 0;
  let best = Infinity;

  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {
      const len = right - left + 1;
      if (len < best) best = len;
      sum -= nums[left];
      left++;
    }
  }

  return best === Infinity ? 0 : best;
}

console.log(minLenAtLeast([2, 3, 1, 2, 4, 3], 7)); // 2`,
      codes: {
        javascript: `function minLenAtLeast(nums, target) {
  let left = 0;
  let sum = 0;
  let best = Infinity;

  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {
      const len = right - left + 1;
      if (len < best) best = len;
      sum -= nums[left];
      left++;
    }
  }

  return best === Infinity ? 0 : best;
}

console.log(minLenAtLeast([2, 3, 1, 2, 4, 3], 7)); // 2`,
        python: `def min_len_at_least(nums, target):
    left = 0
    sum = 0
    best = float('inf')

    for right in range(len(nums)):

        sum += nums[right]
        while sum >= target:
            length = right - left + 1
            if length < best: best = length
            sum -= nums[left]
            left += 1

    0 if return best == float('inf') else best

print(min_len_at_least([2, 3, 1, 2, 4, 3], 7)) # 2`,
        java: `class Solution {
  public int minLenAtLeast(int[] nums, int target) {
    int left = 0;
    int sum = 0;
    int best = Integer.MAX_VALUE;

    for (int right = 0; right < nums.length; right++) {
      sum += nums[right];
      while (sum >= target) {
        int len = right - left + 1;
        if (len < best) best = len;
        sum -= nums[left];
        left++;
      }
    }

    return best == Integer.MAX_VALUE ? 0 : best;
  }

  // demo System.out.println(minLenAtLeast([2, 3, 1, 2, 4, 3], 7)); // 2
}`,
        cpp: `// vector, unordered_map, string
int minLenAtLeast(vector<int>& nums, int target) {
  int left = 0;
  int sum = 0;
  int best = INT_MAX;

  for (int right = 0; right < (int)nums.size(); right++) {
    sum += nums[right];
    while (sum >= target) {
      int len = right - left + 1;
      if (len < best) best = len;
      sum -= nums[left];
      left++;
    }
  }

  return best == INT_MAX ? 0 : best;
}

cout << (minLenAtLeast([2, 3, 1, 2, 4, 3], 7)) << "\\n"; // 2`,
        c: `/* pass n for array length; simple loops */
int minLenAtLeast(int* nums, int n, int target) {
  int left = 0;
  int sum = 0;
  int best = INT_MAX;

  for (int right = 0; right < n; right++) {
    sum += nums[right];
    while (sum >= target) {
      int len = right - left + 1;
      if (len < best) best = len;
      sum -= nums[left];
      left++;
    }
  }

  return best == INT_MAX ? 0 : best;
}

printf("%d\\n", minLenAtLeast([2, 3, 1, 2, 4, 3], 7)); // 2`
      }
    },
    {
      lang: "js",
      title: "Prefix sum array",
      desc: "What this is\nprefix[i] stores the sum of the first i numbers.\nA later range sum is one subtraction.\n\nWhat the code is doing\nprefix[0] is 0 (sum of an empty prefix).\nEach next prefix adds one number.\nsum from index 1 to 3 in [2, 3, 1, 4] is prefix[4] - prefix[1] = 10 - 2 = 8.\nThat is 3 + 1 + 4.\n\nWatch out\nOff-by-one on prefix is the usual bug.\nIf prefix[i] includes nums[i], then the formula changes. Pick one layout and comment it.",
      code: `function rangeSum(nums, left, right) {
  const prefix = [0];
  for (let i = 0; i < nums.length; i++) {
    prefix.push(prefix[prefix.length - 1] + nums[i]);
  }
  // sum of nums[left] .. nums[right]
  return prefix[right + 1] - prefix[left];
}

const nums = [2, 3, 1, 4];
console.log(rangeSum(nums, 1, 3)); // 8`,
      codes: {
        javascript: `function rangeSum(nums, left, right) {
  const prefix = [0];
  for (let i = 0; i < nums.length; i++) {
    prefix.push(prefix[prefix.length - 1] + nums[i]);
  }
  // sum of nums[left] .. nums[right]
  return prefix[right + 1] - prefix[left];
}

const nums = [2, 3, 1, 4];
console.log(rangeSum(nums, 1, 3)); // 8`,
        python: `def range_sum(nums, left, right):
    prefix = [0]
    for i in range(len(nums)):

        prefix.append(prefix[len(prefix) - 1] + nums[i])

    # sum of nums[left] .. nums[right]
    return prefix[right + 1] - prefix[left]

nums = [2, 3, 1, 4]
print(range_sum(nums, 1, 3)) # 8`,
        java: `class Solution {
  public int rangeSum(int[] nums, int left, int right) {
    int prefix = [0];
    for (int i = 0; i < nums.length; i++) {
      prefix.add(prefix[prefix.length - 1] + nums[i]);
    }
    // sum of nums[left] .. nums[right]
    return prefix[right + 1] - prefix[left];
  }

  int nums = [2, 3, 1, 4];
  // demo System.out.println(rangeSum(nums, 1, 3)); // 8
}`,
        cpp: `// vector, unordered_map, string
int rangeSum(vector<int>& nums, int left, int right) {
  int prefix = [0];
  for (int i = 0; i < (int)nums.size(); i++) {
    prefix.push_back(prefix[(int)prefix.size() - 1] + nums[i]);
  }
  // sum of nums[left] .. nums[right]
  return prefix[right + 1] - prefix[left];
}

int nums = [2, 3, 1, 4];
cout << (rangeSum(nums, 1, 3)) << "\\n"; // 8`,
        c: `/* pass n for array length; simple loops */
int rangeSum(int* nums, int n, int left, int right) {
  int prefix = [0];
  for (int i = 0; i < n; i++) {
    /* push */(prefix[prefix_len - 1] + nums[i]);
  }
  // sum of nums[left] .. nums[right]
  return prefix[right + 1] - prefix[left];
}

int nums = [2, 3, 1, 4];
printf("%d\\n", rangeSum(nums, 1, 3)); // 8`
      }
    },
    {
      lang: "js",
      title: "Hash map complement (Two Sum)",
      desc: "What this is\nFor each number x, the partner is target - x.\nA map stores numbers we already walked past, with their indexes.\n\nWhat the code is doing\nneed is the partner we want.\nIf seen has need, we return those two indexes.\nIf not, we store the current number and keep walking.\nFirst match wins.\n\nWatch out\nStore the number after you look it up, or you might pair a number with itself.\nMap remembers the last index if you set twice. That is usually what you want.",
      code: `function twoSum(nums, target) {
  const seen = new Map();

  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }

  return [];
}

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]`,
      codes: {
        javascript: `function twoSum(nums, target) {
  const seen = new Map();

  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }

  return [];
}

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]`,
        python: `def two_sum(nums, target):
    seen = {}

    for i in range(len(nums)):

        need = target - nums[i]
        if need in seen: return [seen[need], i]
        seen[nums[i]] = i

    return []

print(two_sum([2, 7, 11, 15], 9)) # [0, 1]`,
        java: `class Solution {
  public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();

    for (int i = 0; i < nums.length; i++) {
      int need = target - nums[i];
      if (seen.containsKey(need)) return new int[] { seen.get(need), i };
      seen.put(nums[i], i);
    }

    return new int[] {};
  }

  // demo System.out.println(twoSum([2, 7, 11, 15], 9)); // [0, 1]
}`,
        cpp: `// vector, unordered_map, string
vector<int> twoSum(vector<int>& nums, int target) {
  unordered_map<int,int> seen;

  for (int i = 0; i < (int)nums.size(); i++) {
    int need = target - nums[i];
    if (seen.count(need)) return { seen[need }, i];
    seen[nums[i]] = i;
  }

  return {};
}

cout << (twoSum([2, 7, 11, 15], 9)) << "\\n"; // [0, 1]`,
        c: `/* pass n for array length; simple loops */
/* linear scan stands in for a hash map */
int map_find(int* keys, int used, int key) {
  int i;
  for (i = 0; i < used; i++) if (keys[i] == key) return i;
  return -1;
}
int twoSum(int* nums, int n, int target, int* ans) {
  int seen_keys[1024]; int seen_vals[1024]; int seen_n = 0;

  for (int i = 0; i < n; i++) {
    int need = target - nums[i];
    if (map_find(seen_keys, seen_n, need) >= 0) { ans[0] = seen.get(need); ans[1] = i; return 1; };
    /* set seen */;
  }

  return 0;
}

printf("%d\\n", twoSum([2, 7, 11, 15], 9)); // [0, 1]`
      }
    },
    {
      lang: "js",
      title: "Kadane: best subarray sum",
      desc: "What this is\nAt each index, either extend the subarray that ended on the previous index, or start a new subarray here.\nKeep the best ending-here value and the global best.\n\nWhat the code is doing\nendingHere starts as the first number, not 0, so a list of all negatives still works.\nFor each next number we take max(number, endingHere + number).\nbest tracks the largest endingHere we have seen.\n\nWatch out\nStarting endingHere at 0 fails when every number is negative.\nEmpty subarrays are not allowed in the usual interview version.",
      code: `function maxSubArray(nums) {
  let endingHere = nums[0];
  let best = nums[0];

  for (let i = 1; i < nums.length; i++) {
    endingHere = Math.max(nums[i], endingHere + nums[i]);
    if (endingHere > best) best = endingHere;
  }

  return best;
}

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6`,
      codes: {
        javascript: `function maxSubArray(nums) {
  let endingHere = nums[0];
  let best = nums[0];

  for (let i = 1; i < nums.length; i++) {
    endingHere = Math.max(nums[i], endingHere + nums[i]);
    if (endingHere > best) best = endingHere;
  }

  return best;
}

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6`,
        python: `def max_sub_array(nums):
    endingHere = nums[0]
    best = nums[0]

    for i in range(1, len(nums)):

        endingHere = max(nums[i], endingHere + nums[i])
        if endingHere > best: best = endingHere

    return best

print(max_sub_array([-2, 1, -3, 4, -1, 2, 1, -5, 4])) # 6`,
        java: `class Solution {
  public int maxSubArray(int[] nums) {
    int endingHere = nums[0];
    int best = nums[0];

    for (int i = 1; i < nums.length; i++) {
      endingHere = Math.max(nums[i], endingHere + nums[i]);
      if (endingHere > best) best = endingHere;
    }

    return best;
  }

  // demo System.out.println(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
}`,
        cpp: `// vector, unordered_map, string
int maxSubArray(vector<int>& nums) {
  int endingHere = nums[0];
  int best = nums[0];

  for (int i = 1; i < (int)nums.size(); i++) {
    endingHere = max(nums[i], endingHere + nums[i]);
    if (endingHere > best) best = endingHere;
  }

  return best;
}

cout << (maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])) << "\\n"; // 6`,
        c: `/* pass n for array length; simple loops */
int maxSubArray(int* nums, int n) {
  int endingHere = nums[0];
  int best = nums[0];

  for (int i = 1; i < n; i++) {
    endingHere = (nums[i] > endingHere + nums[i] ? nums[i] : endingHere + nums[i]);
    if (endingHere > best) best = endingHere;
  }

  return best;
}

printf("%d\\n", maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6`
      }
    },
    {
      lang: "js",
      title: "Merge overlapping intervals",
      desc: "What this is\nSort by start time. Walk once. If the next interval starts before the current end, stretch the end. If not, push a new block.\n\nWhat the code is doing\nCopy each pair so we do not edit the caller’s arrays.\nSort by the start number.\nmerged holds finished blocks.\nWhen intervals overlap, last[1] becomes the later end.\n\nWatch out\nTouching ends like [1, 2] and [2, 3] usually merge.\nForgetting to sort first leaves overlaps that are not neighbors.",
      code: `function merge(intervals) {
  const list = intervals.map(function (pair) {
    return [pair[0], pair[1]];
  });
  list.sort(function (a, b) { return a[0] - b[0]; });

  const merged = [list[0]];
  for (let i = 1; i < list.length; i++) {
    const last = merged[merged.length - 1];
    if (list[i][0] <= last[1]) {
      last[1] = Math.max(last[1], list[i][1]);
    } else {
      merged.push(list[i]);
    }
  }
  return merged;
}

console.log(merge([[1, 3], [2, 6], [8, 10], [15, 18]]));`,
      codes: {
        javascript: `function merge(intervals) {
  const list = intervals.map(function (pair) {
    return [pair[0], pair[1]];
  });
  list.sort(function (a, b) { return a[0] - b[0]; });

  const merged = [list[0]];
  for (let i = 1; i < list.length; i++) {
    const last = merged[merged.length - 1];
    if (list[i][0] <= last[1]) {
      last[1] = Math.max(last[1], list[i][1]);
    } else {
      merged.push(list[i]);
    }
  }
  return merged;
}

console.log(merge([[1, 3], [2, 6], [8, 10], [15, 18]]));`,
        python: `def merge(intervals):
    list = [[p[0], p[1]] for p in intervals]
    list.sort(key=lambda z: z[0])

    merged = [list[0]]
    for i in range(1, len(list)):

        last = merged[len(merged) - 1]
        if list[i][0] <= last[1]:
            last[1] = max(last[1], list[i][1])
        else:
            merged.append(list[i])

    return merged

print(merge([[1, 3], [2, 6], [8, 10], [15, 18]]))`,
        java: `class Solution {
  public int[][] merge(int[][] intervals) {
    int list = intervals /* copy pairs */;
    list.sort((a, b) -> a[0] - b[0]);

    int merged = [list[0]];
    for (int i = 1; i < list.length; i++) {
      int last = merged[merged.length - 1];
      if (list[i][0] <= last[1]) {
        last[1] = Math.max(last[1], list[i][1]);
      } else {
        merged.add(list[i]);
      }
    }
    return merged;
  }

  // demo System.out.println(merge([[1, 3], [2, 6], [8, 10], [15, 18]]));
}`,
        cpp: `// vector, unordered_map, string
vector<vector<int>> merge(vector<vector<int>>& intervals) {
  int list = intervals /* copy pairs */;
  sort(list.begin(), list.end());

  int merged = [list[0]];
  for (int i = 1; i < (int)list.size(); i++) {
    int last = merged[(int)merged.size() - 1];
    if (list[i][0] <= last[1]) {
      last[1] = max(last[1], list[i][1]);
    } else {
      merged.push_back(list[i]);
    }
  }
  return merged;
}

cout << (merge([[1, 3], [2, 6], [8, 10], [15, 18]])) << "\\n";`,
        c: `/* pass n for array length; simple loops */
int mergeIntervals(int intervals[][2], int n, int out[][2]) {
  int list = intervals /* copy pairs */;
  /* sort list by start */;

  int merged = [list[0]];
  for (int i = 1; i < n; i++) {
    int last = merged[merged_len - 1];
    if (list[i][0] <= last[1]) {
      last[1] = (last[1] > list[i][1] ? last[1] : list[i][1]);
    } else {
      /* push */(list[i]);
    }
  }
  return merged;
}

printf("%d\\n", merge([[1, 3], [2, 6], [8, 10], [15, 18]]));`
      }
    },
    {
      lang: "js",
      title: "Dutch flag (three buckets)",
      desc: "What this is\nSort an array of 0, 1, and 2 in one pass.\nlow writes the next 0. high writes the next 2. mid walks unknown cells.\n\nWhat the code is doing\nIf nums[mid] is 0, swap with low and move both.\nIf it is 2, swap with high and move high only (the swapped-in value is still unknown).\nIf it is 1, just mid++.\n\nWatch out\nAfter swapping with high, do not mid++ yet.\nA second counting pass is simpler and also O(n), but this version is one pass.",
      code: `function sortColors(nums) {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 0) {
      const t = nums[low];
      nums[low] = nums[mid];
      nums[mid] = t;
      low++;
      mid++;
    } else if (nums[mid] === 2) {
      const t = nums[high];
      nums[high] = nums[mid];
      nums[mid] = t;
      high--;
    } else {
      mid++;
    }
  }

  return nums;
}

console.log(sortColors([2, 0, 2, 1, 1, 0])); // [0, 0, 1, 1, 2, 2]`,
      codes: {
        javascript: `function sortColors(nums) {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 0) {
      const t = nums[low];
      nums[low] = nums[mid];
      nums[mid] = t;
      low++;
      mid++;
    } else if (nums[mid] === 2) {
      const t = nums[high];
      nums[high] = nums[mid];
      nums[mid] = t;
      high--;
    } else {
      mid++;
    }
  }

  return nums;
}

console.log(sortColors([2, 0, 2, 1, 1, 0])); // [0, 0, 1, 1, 2, 2]`,
        python: `def sort_colors(nums):
    low = 0
    mid = 0
    high = len(nums) - 1

    while mid <= high:
        if nums[mid] == 0:
            t = nums[low]
            nums[low] = nums[mid]
            nums[mid] = t
            low += 1
            mid += 1
        elif nums[mid] == 2:
            t = nums[high]
            nums[high] = nums[mid]
            nums[mid] = t
            high -= 1
        else:
            mid += 1

    return nums

print(sort_colors([2, 0, 2, 1, 1, 0])) # [0, 0, 1, 1, 2, 2]`,
        java: `class Solution {
  public int[] sortColors(int[] nums) {
    int low = 0;
    int mid = 0;
    int high = nums.length - 1;

    while (mid <= high) {
      if (nums[mid] == 0) {
        int t = nums[low];
        nums[low] = nums[mid];
        nums[mid] = t;
        low++;
        mid++;
      } else if (nums[mid] == 2) {
        int t = nums[high];
        nums[high] = nums[mid];
        nums[mid] = t;
        high--;
      } else {
        mid++;
      }
    }

    return nums;
  }

  // demo System.out.println(sortColors([2, 0, 2, 1, 1, 0])); // [0, 0, 1, 1, 2, 2]
}`,
        cpp: `// vector, unordered_map, string
vector<int> sortColors(vector<int>& nums) {
  int low = 0;
  int mid = 0;
  int high = (int)nums.size() - 1;

  while (mid <= high) {
    if (nums[mid] == 0) {
      int t = nums[low];
      nums[low] = nums[mid];
      nums[mid] = t;
      low++;
      mid++;
    } else if (nums[mid] == 2) {
      int t = nums[high];
      nums[high] = nums[mid];
      nums[mid] = t;
      high--;
    } else {
      mid++;
    }
  }

  return nums;
}

cout << (sortColors([2, 0, 2, 1, 1, 0])) << "\\n"; // [0, 0, 1, 1, 2, 2]`,
        c: `/* pass n for array length; simple loops */
void sortColors(int* nums, int n) {
  int low = 0;
  int mid = 0;
  int high = n - 1;

  while (mid <= high) {
    if (nums[mid] == 0) {
      int t = nums[low];
      nums[low] = nums[mid];
      nums[mid] = t;
      low++;
      mid++;
    } else if (nums[mid] == 2) {
      int t = nums[high];
      nums[high] = nums[mid];
      nums[mid] = t;
      high--;
    } else {
      mid++;
    }
  }

  return nums;
}

printf("%d\\n", sortColors([2, 0, 2, 1, 1, 0])); // [0, 0, 1, 1, 2, 2]`
      }
    },
    {
      lang: "js",
      title: "Binary search in a rotated sorted array",
      desc: "What this is\nThe array was sorted, then rotated. One half of [left, mid] or [mid, right] is still sorted.\nCheck whether the target lives in the sorted half.\n\nWhat the code is doing\nIf nums[left] <= nums[mid], the left side is sorted.\nIf target is in that range, move right to mid - 1. Else move left.\nThe other branch treats the right side as the sorted run.\n\nWatch out\nDuplicates need extra care (this snippet assumes unique values).\n<= on the left check is easy to get backwards. Walk an example on paper.",
      code: `function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;

    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }

  return -1;
}

console.log(search([4, 5, 6, 7, 0, 1, 2], 0)); // 4`,
      codes: {
        javascript: `function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;

    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }

  return -1;
}

console.log(search([4, 5, 6, 7, 0, 1, 2], 0)); // 4`,
        python: `def search(nums, target):
    left = 0
    right = len(nums) - 1

    while left <= right:
        mid = ((left + right) ) # 2
        if nums[mid] == target: return mid

        if nums[left] <= nums[mid]:
            if nums[left] <= target and target < nums[mid]: right = mid - 1
            else: left = mid + 1
        else:
            if nums[mid] < target and target <= nums[right]: left = mid + 1
            else: right = mid - 1

    return -1

print(search([4, 5, 6, 7, 0, 1, 2], 0)) # 4`,
        java: `class Solution {
  public int search(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;

    while (left <= right) {
      int mid = ((left + right) / 2);
      if (nums[mid] == target) return mid;

      if (nums[left] <= nums[mid]) {
        if (nums[left] <= target && target < nums[mid]) right = mid - 1;
        else left = mid + 1;
      } else {
        if (nums[mid] < target && target <= nums[right]) left = mid + 1;
        else right = mid - 1;
      }
    }

    return -1;
  }

  // demo System.out.println(search([4, 5, 6, 7, 0, 1, 2], 0)); // 4
}`,
        cpp: `// vector, unordered_map, string
int search(vector<int>& nums, int target) {
  int left = 0;
  int right = (int)nums.size() - 1;

  while (left <= right) {
    int mid = (int)((left + right) / 2);
    if (nums[mid] == target) return mid;

    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }

  return -1;
}

cout << (search([4, 5, 6, 7, 0, 1, 2], 0)) << "\\n"; // 4`,
        c: `/* pass n for array length; simple loops */
int search(int* nums, int n, int target) {
  int left = 0;
  int right = n - 1;

  while (left <= right) {
    int mid = ((left + right) / 2);
    if (nums[mid] == target) return mid;

    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }

  return -1;
}

printf("%d\\n", search([4, 5, 6, 7, 0, 1, 2], 0)); // 4`
      }
    },
    {
      lang: "js",
      title: "Rotate image (transpose, then reverse each row)",
      desc: "What this is\nA 90 degree clockwise rotate of a square matrix.\nTranspose flips over the main diagonal. Then each row reversed is the rotate.\n\nWhat the code is doing\nThe first nested loop swaps matrix[i][j] with matrix[j][i] for j > i.\nThe second loop reverses each row in place with two pointers.\n[[1,2,3],[4,5,6],[7,8,9]] becomes [[7,4,1],[8,5,2],[9,6,3]].\n\nWatch out\nCounter-clockwise is transpose then reverse columns, or reverse rows then transpose.\nDo not use an extra matrix if the interview asks for in-place.",
      code: `function rotate(matrix) {
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
}

console.log(rotate([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));`,
      codes: {
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
}

console.log(rotate([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));`,
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
  return matrix

print(rotate([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))`,
        java: `class Solution {
  public void rotate(int[][] matrix) {
    int n = matrix.length;
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        int t = matrix[i][j];
        matrix[i][j] = matrix[j][i];
        matrix[j][i] = t;
      }
    }
    for (int i = 0; i < n; i++) {
      int L = 0, R = n - 1;
      while (L < R) {
        int t = matrix[i][L];
        matrix[i][L] = matrix[i][R];
        matrix[i][R] = t;
        L++; R--;
      }
    }
  }
}`,
        cpp: `void rotate(vector<vector<int>>& matrix) {
  int n = (int)matrix.size();
  for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++) swap(matrix[i][j], matrix[j][i]);
  for (int i = 0; i < n; i++) {
    int L = 0, R = n - 1;
    while (L < R) { swap(matrix[i][L], matrix[i][R]); L++; R--; }
  }
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
      }
    }
  ],
  questions: [
    {
      id: 1,
      level: "beginner",
      q: "Two Sum",
      ask: "Google · Amazon · Meta · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/two-sum/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/key-pair5616/1"}],
      a: "Return the indexes of two numbers that add up to target. Each index is used at most once.\n\nExample: nums = [2, 7, 11, 15], target = 9. Indexes 0 and 1 work because 2 + 7 = 9.\n\nTrying every pair is correct and slow. Sorting with original indexes lets two pointers meet in the middle. A map of value -> index finds the partner while you walk once.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "Every pair is checked. For n numbers that is about n*(n-1)/2 additions.\nHow it works: the outer loop picks the first index. The inner loop picks a later index. The first pair whose sum equals target is returned.",
          code: `function twoSum(nums, target) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}`,
          codes: {
            javascript: `function twoSum(nums, target) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}`,
            python: `def two_sum(nums, target):
    n = len(nums)
    for i in range(n):

        for j in range(i + 1, n):

            if nums[i] + nums[j] == target: return [i, j]

    return []`,
            java: `class Solution {
  public int[] twoSum(int[] nums, int target) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        if (nums[i] + nums[j] == target) return new int[] { i, j };
      }
    }
    return new int[] {};
  }
}`,
            cpp: `// vector, unordered_map, string
vector<int> twoSum(vector<int>& nums, int target) {
  int n = (int)nums.size();
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      if (nums[i] + nums[j] == target) return { i, j };
    }
  }
  return {};
}`,
            c: `/* pass n for array length; simple loops */
int twoSum(int* nums, int n, int target, int* ans) {
  /* n is the given length */
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      if (nums[i] + nums[j] == target) { ans[0] = i; ans[1] = j; return 1; };
    }
  }
  return 0;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n log n)",
          space: "O(n)",
          why: "Sorting is the extra cost. After that, two pointers only walk the copied list once.\nHow it works: store {value, index} so sorting does not lose positions. Move left up when the sum is too small, right down when it is too big.",
          code: `function twoSum(nums, target) {
  const pairs = [];
  for (let i = 0; i < nums.length; i++) {
    pairs.push({ value: nums[i], index: i });
  }
  pairs.sort(function (a, b) { return a.value - b.value; });

  let left = 0;
  let right = pairs.length - 1;
  while (left < right) {
    const sum = pairs[left].value + pairs[right].value;
    if (sum === target) return [pairs[left].index, pairs[right].index];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`,
          codes: {
            javascript: `function twoSum(nums, target) {
  const pairs = [];
  for (let i = 0; i < nums.length; i++) {
    pairs.push({ value: nums[i], index: i });
  }
  pairs.sort(function (a, b) { return a.value - b.value; });

  let left = 0;
  let right = pairs.length - 1;
  while (left < right) {
    const sum = pairs[left].value + pairs[right].value;
    if (sum === target) return [pairs[left].index, pairs[right].index];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`,
            python: `def two_sum(nums, target):
    pairs = []
    for i in range(len(nums)):

        pairs.append([nums[i], i ])

    pairs.sort(key=lambda z: z[0])

    left = 0
    right = len(pairs) - 1
    while left < right:
        sum = pairs[left].value + pairs[right].value
        if sum == target: return [pairs[left].index, pairs[right].index]
        if sum < target: left += 1
        else: right -= 1
    return []`,
            java: `class Solution {
  public int[] twoSum(int[] nums, int target) {
    List<Integer> pairs = new ArrayList<>();
    for (int i = 0; i < nums.length; i++) {
      pairs.add([nums[i], i ]);
    }
    pairs.sort((a, b) -> a[0] - b[0]);

    int left = 0;
    int right = pairs.size() - 1;
    while (left < right) {
      int sum = pairs[left].value + pairs[right].value;
      if (sum == target) return new int[] { pairs[left }.index, pairs[right].index];
      if (sum < target) left++;
      else right--;
    }
    return new int[] {};
  }
}`,
            cpp: `// vector, unordered_map, string
vector<int> twoSum(vector<int>& nums, int target) {
  vector<int> pairs;
  for (int i = 0; i < (int)nums.size(); i++) {
    pairs.push_back([nums[i], i ]);
  }
  sort(pairs.begin(), pairs.end());

  int left = 0;
  int right = (int)pairs.size() - 1;
  while (left < right) {
    int sum = pairs[left].value + pairs[right].value;
    if (sum == target) return { pairs[left }.index, pairs[right].index];
    if (sum < target) left++;
    else right--;
  }
  return {};
}`,
            c: `/* pass n for array length; simple loops */
int twoSum(int* nums, int n, int target, int* ans) {
  int pairs[1024]; int pairs_n = 0;
  for (int i = 0; i < n; i++) {
    /* push */([nums[i], i ]);
  }
  /* sort pairs */;

  int left = 0;
  int right = pairs_len - 1;
  while (left < right) {
    int sum = pairs[left].value + pairs[right].value;
    if (sum == target) /* return pairs[left */ return 1.index, pairs[right].index];
    if (sum < target) left++;
    else right--;
  }
  return 0;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "One pass. Each lookup in the map is average O(1), so the whole walk is O(n).\nHow it works: for x, look up target - x. If it was stored, return those indexes. If not, store x and its index, then continue.",
          code: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
          codes: {
            javascript: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
            python: `def two_sum(nums, target):
    seen = {}
    for i in range(len(nums)):

        need = target - nums[i]
        if need in seen: return [seen[need], i]
        seen[nums[i]] = i

    return []`,
            java: `class Solution {
  public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
      int need = target - nums[i];
      if (seen.containsKey(need)) return new int[] { seen.get(need), i };
      seen.put(nums[i], i);
    }
    return new int[] {};
  }
}`,
            cpp: `// vector, unordered_map, string
vector<int> twoSum(vector<int>& nums, int target) {
  unordered_map<int,int> seen;
  for (int i = 0; i < (int)nums.size(); i++) {
    int need = target - nums[i];
    if (seen.count(need)) return { seen[need }, i];
    seen[nums[i]] = i;
  }
  return {};
}`,
            c: `/* pass n for array length; simple loops */
/* linear scan stands in for a hash map */
int map_find(int* keys, int used, int key) {
  int i;
  for (i = 0; i < used; i++) if (keys[i] == key) return i;
  return -1;
}
int twoSum(int* nums, int n, int target, int* ans) {
  int seen_keys[1024]; int seen_vals[1024]; int seen_n = 0;
  for (int i = 0; i < n; i++) {
    int need = target - nums[i];
    if (map_find(seen_keys, seen_n, need) >= 0) { ans[0] = seen.get(need); ans[1] = i; return 1; };
    /* set seen */;
  }
  return 0;
}`
          }
        }
      ]
    },
    {
      id: 2,
      level: "beginner",
      q: "Best Time to Buy and Sell Stock",
      ask: "Amazon · Google · Microsoft · Meta",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/best-time-to-buy-and-sell-stock/1"}],
      a: "You may buy on one day and sell on a later day. Return the largest profit. If every sell would lose money, return 0.\n\nExample: prices = [7, 1, 5, 3, 6, 4]. Buy at 1, sell at 6, profit 5.\n\nThe slow way tries every buy/sell pair. A prefix of the lowest price so far turns that into two linear passes. The last version keeps only the running minimum, so no extra array.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "For each buy day you scan every later sell day. That is quadratic.\nHow it works: i is the buy index. j is the sell index. profit is prices[j] - prices[i]. Keep the max, never go below 0.",
          code: `function maxProfit(prices) {
  let best = 0;
  const n = prices.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const profit = prices[j] - prices[i];
      if (profit > best) best = profit;
    }
  }
  return best;
}`,
          codes: {
            javascript: `function maxProfit(prices) {
  let best = 0;
  const n = prices.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const profit = prices[j] - prices[i];
      if (profit > best) best = profit;
    }
  }
  return best;
}`,
            python: `def max_profit(prices):
    best = 0
    n = len(prices)
    for i in range(n):

        for j in range(i + 1, n):

            profit = prices[j] - prices[i]
            if profit > best: best = profit

    return best`,
            java: `class Solution {
  public int maxProfit(int[] prices) {
    int best = 0;
    int n = prices.length;
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        int profit = prices[j] - prices[i];
        if (profit > best) best = profit;
      }
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int maxProfit(vector<int>& prices) {
  int best = 0;
  int n = (int)prices.size();
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      int profit = prices[j] - prices[i];
      if (profit > best) best = profit;
    }
  }
  return best;
}`,
            c: `/* pass n for array length; simple loops */
int maxProfit(int* prices, int n) {
  int best = 0;
  /* n is the given length */
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      int profit = prices[j] - prices[i];
      if (profit > best) best = profit;
    }
  }
  return best;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Linear time, but it stores a min-so-far array of length n.\nHow it works: minLeft[i] is the cheapest price on day i or earlier. Profit if you sell on day i is prices[i] - minLeft[i]. Take the max of those profits.",
          code: `function maxProfit(prices) {
  const n = prices.length;
  if (n === 0) return 0;
  const minLeft = new Array(n);
  minLeft[0] = prices[0];
  for (let i = 1; i < n; i++) {
    minLeft[i] = Math.min(minLeft[i - 1], prices[i]);
  }
  let best = 0;
  for (let i = 1; i < n; i++) {
    const profit = prices[i] - minLeft[i];
    if (profit > best) best = profit;
  }
  return best;
}`,
          codes: {
            javascript: `function maxProfit(prices) {
  const n = prices.length;
  if (n === 0) return 0;
  const minLeft = new Array(n);
  minLeft[0] = prices[0];
  for (let i = 1; i < n; i++) {
    minLeft[i] = Math.min(minLeft[i - 1], prices[i]);
  }
  let best = 0;
  for (let i = 1; i < n; i++) {
    const profit = prices[i] - minLeft[i];
    if (profit > best) best = profit;
  }
  return best;
}`,
            python: `def max_profit(prices):
    n = len(prices)
    if n == 0: return 0
    minLeft = [None] * (n)
    minLeft[0] = prices[0]
    for i in range(1, n):

        minLeft[i] = min(minLeft[i - 1], prices[i])

    best = 0
    for i in range(1, n):

        profit = prices[i] - minLeft[i]
        if profit > best: best = profit

    return best`,
            java: `class Solution {
  public int maxProfit(int[] prices) {
    int n = prices.length;
    if (n == 0) return 0;
    int[] minLeft = new int[n];
    minLeft[0] = prices[0];
    for (int i = 1; i < n; i++) {
      minLeft[i] = Math.min(minLeft[i - 1], prices[i]);
    }
    int best = 0;
    for (int i = 1; i < n; i++) {
      int profit = prices[i] - minLeft[i];
      if (profit > best) best = profit;
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int maxProfit(vector<int>& prices) {
  int n = (int)prices.size();
  if (n == 0) return 0;
  vector<int> minLeft = vector<int>(n);
  minLeft[0] = prices[0];
  for (int i = 1; i < n; i++) {
    minLeft[i] = min(minLeft[i - 1], prices[i]);
  }
  int best = 0;
  for (int i = 1; i < n; i++) {
    int profit = prices[i] - minLeft[i];
    if (profit > best) best = profit;
  }
  return best;
}`,
            c: `/* pass n for array length; simple loops */
int maxProfit(int* prices, int n) {
  /* n is the given length */
  if (n == 0) return 0;
  int minLeft = /* array n */;
  minLeft[0] = prices[0];
  for (int i = 1; i < n; i++) {
    minLeft[i] = (minLeft[i - 1] < prices[i] ? minLeft[i - 1] : prices[i]);
  }
  int best = 0;
  for (int i = 1; i < n; i++) {
    int profit = prices[i] - minLeft[i];
    if (profit > best) best = profit;
  }
  return best;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Same linear scan, but only two numbers are stored: cheapest so far and best profit.\nHow it works: walk once. If today’s price is a new low, update cheapest. Else try selling today against that low.",
          code: `function maxProfit(prices) {
  let cheapest = Infinity;
  let best = 0;
  for (let i = 0; i < prices.length; i++) {
    if (prices[i] < cheapest) cheapest = prices[i];
    const profit = prices[i] - cheapest;
    if (profit > best) best = profit;
  }
  return best;
}`,
          codes: {
            javascript: `function maxProfit(prices) {
  let cheapest = Infinity;
  let best = 0;
  for (let i = 0; i < prices.length; i++) {
    if (prices[i] < cheapest) cheapest = prices[i];
    const profit = prices[i] - cheapest;
    if (profit > best) best = profit;
  }
  return best;
}`,
            python: `def max_profit(prices):
    cheapest = float('inf')
    best = 0
    for i in range(len(prices)):

        if prices[i] < cheapest: cheapest = prices[i]
        profit = prices[i] - cheapest
        if profit > best: best = profit

    return best`,
            java: `class Solution {
  public int maxProfit(int[] prices) {
    int cheapest = Integer.MAX_VALUE;
    int best = 0;
    for (int i = 0; i < prices.length; i++) {
      if (prices[i] < cheapest) cheapest = prices[i];
      int profit = prices[i] - cheapest;
      if (profit > best) best = profit;
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int maxProfit(vector<int>& prices) {
  int cheapest = INT_MAX;
  int best = 0;
  for (int i = 0; i < (int)prices.size(); i++) {
    if (prices[i] < cheapest) cheapest = prices[i];
    int profit = prices[i] - cheapest;
    if (profit > best) best = profit;
  }
  return best;
}`,
            c: `/* pass n for array length; simple loops */
int maxProfit(int* prices, int n) {
  int cheapest = INT_MAX;
  int best = 0;
  for (int i = 0; i < n; i++) {
    if (prices[i] < cheapest) cheapest = prices[i];
    int profit = prices[i] - cheapest;
    if (profit > best) best = profit;
  }
  return best;
}`
          }
        }
      ]
    },
    {
      id: 3,
      level: "beginner",
      q: "Contains Duplicate",
      ask: "Amazon · Google · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/contains-duplicate/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/find-duplicates-in-on-time-and-constant-extra-space/"}],
      a: "Return true if any value appears at least twice, otherwise false.\n\nExample: [1, 2, 3, 1] is true. [1, 2, 3, 4] is false.\n\nNested loops compare every pair. Sorting puts equals next to each other. A Set tells you in one pass whether a value was already seen.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "Each pair is compared. Fine for tiny lists, too slow for large n.\nHow it works: if nums[i] equals nums[j] for j > i, a duplicate exists.",
          code: `function containsDuplicate(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] === nums[j]) return true;
    }
  }
  return false;
}`,
          codes: {
            javascript: `function containsDuplicate(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] === nums[j]) return true;
    }
  }
  return false;
}`,
            python: `def contains_duplicate(nums):
    n = len(nums)
    for i in range(n):

        for j in range(i + 1, n):

            if nums[i] == nums[j]: return True

    return False`,
            java: `class Solution {
  public boolean containsDuplicate(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        if (nums[i] == nums[j]) return true;
      }
    }
    return false;
  }
}`,
            cpp: `// vector, unordered_map, string
bool containsDuplicate(vector<int>& nums) {
  int n = (int)nums.size();
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      if (nums[i] == nums[j]) return true;
    }
  }
  return false;
}`,
            c: `/* pass n for array length; simple loops */
int containsDuplicate(int* nums, int n) {
  /* n is the given length */
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      if (nums[i] == nums[j]) return 1;
    }
  }
  return 0;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n log n)",
          space: "O(n)",
          why: "Copy then sort, then a linear neighbor check. Sorting dominates.\nHow it works: equals become neighbors after sort. If two neighbors match, return true.",
          code: `function containsDuplicate(nums) {
  const copy = nums.slice();
  copy.sort(function (a, b) { return a - b; });
  for (let i = 1; i < copy.length; i++) {
    if (copy[i] === copy[i - 1]) return true;
  }
  return false;
}`,
          codes: {
            javascript: `function containsDuplicate(nums) {
  const copy = nums.slice();
  copy.sort(function (a, b) { return a - b; });
  for (let i = 1; i < copy.length; i++) {
    if (copy[i] === copy[i - 1]) return true;
  }
  return false;
}`,
            python: `def contains_duplicate(nums):
    copy = nums[:]
    copy.sort()
    for i in range(1, len(copy)):

        if copy[i] == copy[i - 1]: return True

    return False`,
            java: `class Solution {
  public boolean containsDuplicate(int[] nums) {
    int[] copy = nums.clone();
    Arrays.sort(copy);
    for (int i = 1; i < copy.length; i++) {
      if (copy[i] == copy[i - 1]) return true;
    }
    return false;
  }
}`,
            cpp: `// vector, unordered_map, string
bool containsDuplicate(vector<int>& nums) {
  vector<int> copy = vector<int>(nums);
  sort(copy.begin(), copy.end());
  for (int i = 1; i < (int)copy.size(); i++) {
    if (copy[i] == copy[i - 1]) return true;
  }
  return false;
}`,
            c: `/* pass n for array length; simple loops */
int containsDuplicate(int* nums, int n) {
  int copy = nums;
  /* sort copy */;
  for (int i = 1; i < n; i++) {
    if (copy[i] == copy[i - 1]) return 1;
  }
  return 0;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "One pass. Set.has is average O(1).\nHow it works: if the set already has the number, it is a duplicate. Otherwise add it.",
          code: `function containsDuplicate(nums) {
  const seen = new Set();
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(nums[i])) return true;
    seen.add(nums[i]);
  }
  return false;
}`,
          codes: {
            javascript: `function containsDuplicate(nums) {
  const seen = new Set();
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(nums[i])) return true;
    seen.add(nums[i]);
  }
  return false;
}`,
            python: `def contains_duplicate(nums):
    seen = set()
    for i in range(len(nums)):

        if nums[i] in seen: return True
        seen.add(nums[i])

    return False`,
            java: `class Solution {
  public boolean containsDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int i = 0; i < nums.length; i++) {
      if (seen.contains(nums[i])) return true;
      seen.add(nums[i]);
    }
    return false;
  }
}`,
            cpp: `// vector, unordered_map, string
bool containsDuplicate(vector<int>& nums) {
  unordered_set<int> seen;
  for (int i = 0; i < (int)nums.size(); i++) {
    if (seen.count(nums[i])) return true;
    seen.insert(nums[i]);
  }
  return false;
}`,
            c: `/* pass n for array length; simple loops */
/* linear scan stands in for a hash map */
int map_find(int* keys, int used, int key) {
  int i;
  for (i = 0; i < used; i++) if (keys[i] == key) return i;
  return -1;
}
int containsDuplicate(int* nums, int n) {
  int seen_keys[1024]; int seen_n = 0;
  for (int i = 0; i < n; i++) {
    if (map_find(seen_keys, seen_n, nums[i]) >= 0) return 1;
    /* add */;
  }
  return 0;
}`
          }
        }
      ]
    },
    {
      id: 4,
      level: "intermediate",
      q: "Product of Array Except Self",
      ask: "Amazon · Meta · Apple · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/product-of-array-except-self/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/product-array-puzzle170547/1"}],
      a: "Build a new list answer where answer[i] is the product of every number except nums[i]. Do not use division.\n\nExample: [1, 2, 3, 4] -> [24, 12, 8, 6].\n\nThe slow way multiplies the rest for each index. Left products and right products turn that into two extra arrays. The last version writes left products into the output, then multiplies a running right product on the way back.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(n)",
          why: "For each i you multiply n - 1 others. That is n² multiplications.\nHow it works: skip index i in the inner loop. Store the product in out[i].",
          code: `function productExceptSelf(nums) {
  const n = nums.length;
  const out = new Array(n);
  for (let i = 0; i < n; i++) {
    let prod = 1;
    for (let j = 0; j < n; j++) {
      if (j !== i) prod *= nums[j];
    }
    out[i] = prod;
  }
  return out;
}`,
          codes: {
            javascript: `function productExceptSelf(nums) {
  const n = nums.length;
  const out = new Array(n);
  for (let i = 0; i < n; i++) {
    let prod = 1;
    for (let j = 0; j < n; j++) {
      if (j !== i) prod *= nums[j];
    }
    out[i] = prod;
  }
  return out;
}`,
            python: `def product_except_self(nums):
    n = len(nums)
    out = [None] * (n)
    for i in range(n):

        prod = 1
        for j in range(n):

            if j != i: prod *= nums[j]

        out[i] = prod

    return out`,
            java: `class Solution {
  public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] out = new int[n];
    for (int i = 0; i < n; i++) {
      int prod = 1;
      for (int j = 0; j < n; j++) {
        if (j != i) prod *= nums[j];
      }
      out[i] = prod;
    }
    return out;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<int> productExceptSelf(vector<int>& nums) {
  int n = (int)nums.size();
  vector<int> out = vector<int>(n);
  for (int i = 0; i < n; i++) {
    int prod = 1;
    for (int j = 0; j < n; j++) {
      if (j != i) prod *= nums[j];
    }
    out[i] = prod;
  }
  return out;
}`,
            c: `/* pass n for array length; simple loops */
void productExceptSelf(int* nums, int n, int* out) {
  /* n is the given length */
  int out = /* array n */;
  for (int i = 0; i < n; i++) {
    int prod = 1;
    for (int j = 0; j < n; j++) {
      if (j != i) prod *= nums[j];
    }
    out[i] = prod;
  }
  return out;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Three linear passes and two extra arrays of length n.\nHow it works: left[i] is the product of items before i. right[i] is the product after i. out[i] = left[i] * right[i].",
          code: `function productExceptSelf(nums) {
  const n = nums.length;
  const left = new Array(n);
  const right = new Array(n);
  const out = new Array(n);
  left[0] = 1;
  for (let i = 1; i < n; i++) left[i] = left[i - 1] * nums[i - 1];
  right[n - 1] = 1;
  for (let i = n - 2; i >= 0; i--) right[i] = right[i + 1] * nums[i + 1];
  for (let i = 0; i < n; i++) out[i] = left[i] * right[i];
  return out;
}`,
          codes: {
            javascript: `function productExceptSelf(nums) {
  const n = nums.length;
  const left = new Array(n);
  const right = new Array(n);
  const out = new Array(n);
  left[0] = 1;
  for (let i = 1; i < n; i++) left[i] = left[i - 1] * nums[i - 1];
  right[n - 1] = 1;
  for (let i = n - 2; i >= 0; i--) right[i] = right[i + 1] * nums[i + 1];
  for (let i = 0; i < n; i++) out[i] = left[i] * right[i];
  return out;
}`,
            python: `def product_except_self(nums):
    n = len(nums)
    left = [None] * (n)
    right = [None] * (n)
    out = [None] * (n)
    left[0] = 1
    for i in range(1, n):
        left[i] = left[i - 1] * nums[i - 1]
    right[n - 1] = 1
    for i in range(n - 2, (0) - 1, -1):
        right[i] = right[i + 1] * nums[i + 1]
    for i in range(n):
        out[i] = left[i] * right[i]
    return out`,
            java: `class Solution {
  public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] left = new int[n];
    int[] right = new int[n];
    int[] out = new int[n];
    left[0] = 1;
    for (int i = 1; i < n; i++) left[i] = left[i - 1] * nums[i - 1];
    right[n - 1] = 1;
    for (int i = n - 2; i >= 0; i--) right[i] = right[i + 1] * nums[i + 1];
    for (int i = 0; i < n; i++) out[i] = left[i] * right[i];
    return out;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<int> productExceptSelf(vector<int>& nums) {
  int n = (int)nums.size();
  vector<int> left = vector<int>(n);
  vector<int> right = vector<int>(n);
  vector<int> out = vector<int>(n);
  left[0] = 1;
  for (int i = 1; i < n; i++) left[i] = left[i - 1] * nums[i - 1];
  right[n - 1] = 1;
  for (int i = n - 2; i >= 0; i--) right[i] = right[i + 1] * nums[i + 1];
  for (int i = 0; i < n; i++) out[i] = left[i] * right[i];
  return out;
}`,
            c: `/* pass n for array length; simple loops */
void productExceptSelf(int* nums, int n, int* out) {
  /* n is the given length */
  int left = /* array n */;
  int right = /* array n */;
  int out = /* array n */;
  left[0] = 1;
  for (int i = 1; i < n; i++) left[i] = left[i - 1] * nums[i - 1];
  right[n - 1] = 1;
  for (int i = n - 2; i >= 0; i--) right[i] = right[i + 1] * nums[i + 1];
  for (int i = 0; i < n; i++) out[i] = left[i] * right[i];
  return out;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Still O(n) memory for the answer list, but no extra left/right arrays.\nHow it works: fill out with prefix products. Then walk right to left with a running suffix product and multiply it in.",
          code: `function productExceptSelf(nums) {
  const n = nums.length;
  const out = new Array(n);
  out[0] = 1;
  for (let i = 1; i < n; i++) out[i] = out[i - 1] * nums[i - 1];
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    out[i] *= right;
    right *= nums[i];
  }
  return out;
}`,
          codes: {
            javascript: `function productExceptSelf(nums) {
  const n = nums.length;
  const out = new Array(n);
  out[0] = 1;
  for (let i = 1; i < n; i++) out[i] = out[i - 1] * nums[i - 1];
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    out[i] *= right;
    right *= nums[i];
  }
  return out;
}`,
            python: `def product_except_self(nums):
    n = len(nums)
    out = [None] * (n)
    out[0] = 1
    for i in range(1, n):
        out[i] = out[i - 1] * nums[i - 1]
    right = 1
    for i in range(n - 1, (0) - 1, -1):

        out[i] *= right
        right *= nums[i]

    return out`,
            java: `class Solution {
  public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] out = new int[n];
    out[0] = 1;
    for (int i = 1; i < n; i++) out[i] = out[i - 1] * nums[i - 1];
    int right = 1;
    for (int i = n - 1; i >= 0; i--) {
      out[i] *= right;
      right *= nums[i];
    }
    return out;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<int> productExceptSelf(vector<int>& nums) {
  int n = (int)nums.size();
  vector<int> out = vector<int>(n);
  out[0] = 1;
  for (int i = 1; i < n; i++) out[i] = out[i - 1] * nums[i - 1];
  int right = 1;
  for (int i = n - 1; i >= 0; i--) {
    out[i] *= right;
    right *= nums[i];
  }
  return out;
}`,
            c: `/* pass n for array length; simple loops */
void productExceptSelf(int* nums, int n, int* out) {
  /* n is the given length */
  int out = /* array n */;
  out[0] = 1;
  for (int i = 1; i < n; i++) out[i] = out[i - 1] * nums[i - 1];
  int right = 1;
  for (int i = n - 1; i >= 0; i--) {
    out[i] *= right;
    right *= nums[i];
  }
  return out;
}`
          }
        }
      ]
    },
    {
      id: 5,
      level: "beginner",
      q: "Maximum Subarray (Kadane)",
      ask: "Amazon · Google · Microsoft · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/maximum-subarray/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1"}],
      a: "Return the largest sum of any contiguous subarray. The subarray must be non-empty.\n\nExample: [-2, 1, -3, 4, -1, 2, 1, -5, 4] -> 6 from [4, -1, 2, 1].\n\nAll subarrays can be summed with an inner running total. A DP array stores the best sum ending at each index. Kadane keeps only the previous ending-sum, so the extra array goes away.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "Every start index pairs with every end index. Inner additions make this quadratic.\nHow it works: i is the start. sum grows as j walks right. best tracks the largest sum seen, including all-negative lists.",
          code: `function maxSubArray(nums) {
  let best = -Infinity;
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = i; j < n; j++) {
      sum += nums[j];
      if (sum > best) best = sum;
    }
  }
  return best;
}`,
          codes: {
            javascript: `function maxSubArray(nums) {
  let best = -Infinity;
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = i; j < n; j++) {
      sum += nums[j];
      if (sum > best) best = sum;
    }
  }
  return best;
}`,
            python: `def max_sub_array(nums):
    best = float('-inf')
    n = len(nums)
    for i in range(n):

        sum = 0
        for j in range(i, n):

            sum += nums[j]
            if sum > best: best = sum

    return best`,
            java: `class Solution {
  public int maxSubArray(int[] nums) {
    int best = Integer.MIN_VALUE;
    int n = nums.length;
    for (int i = 0; i < n; i++) {
      int sum = 0;
      for (int j = i; j < n; j++) {
        sum += nums[j];
        if (sum > best) best = sum;
      }
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int maxSubArray(vector<int>& nums) {
  int best = INT_MIN;
  int n = (int)nums.size();
  for (int i = 0; i < n; i++) {
    int sum = 0;
    for (int j = i; j < n; j++) {
      sum += nums[j];
      if (sum > best) best = sum;
    }
  }
  return best;
}`,
            c: `/* pass n for array length; simple loops */
int maxSubArray(int* nums, int n) {
  int best = INT_MIN;
  /* n is the given length */
  for (int i = 0; i < n; i++) {
    int sum = 0;
    for (int j = i; j < n; j++) {
      sum += nums[j];
      if (sum > best) best = sum;
    }
  }
  return best;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Linear time with a DP array of length n.\nHow it works: dp[i] is the best sum among subarrays that end at i. It is either nums[i] alone or dp[i - 1] + nums[i]. The answer is the max of dp.",
          code: `function maxSubArray(nums) {
  const n = nums.length;
  const dp = new Array(n);
  dp[0] = nums[0];
  let best = dp[0];
  for (let i = 1; i < n; i++) {
    dp[i] = Math.max(nums[i], dp[i - 1] + nums[i]);
    if (dp[i] > best) best = dp[i];
  }
  return best;
}`,
          codes: {
            javascript: `function maxSubArray(nums) {
  const n = nums.length;
  const dp = new Array(n);
  dp[0] = nums[0];
  let best = dp[0];
  for (let i = 1; i < n; i++) {
    dp[i] = Math.max(nums[i], dp[i - 1] + nums[i]);
    if (dp[i] > best) best = dp[i];
  }
  return best;
}`,
            python: `def max_sub_array(nums):
    n = len(nums)
    dp = [None] * (n)
    dp[0] = nums[0]
    best = dp[0]
    for i in range(1, n):

        dp[i] = max(nums[i], dp[i - 1] + nums[i])
        if dp[i] > best: best = dp[i]

    return best`,
            java: `class Solution {
  public int maxSubArray(int[] nums) {
    int n = nums.length;
    int[] dp = new int[n];
    dp[0] = nums[0];
    int best = dp[0];
    for (int i = 1; i < n; i++) {
      dp[i] = Math.max(nums[i], dp[i - 1] + nums[i]);
      if (dp[i] > best) best = dp[i];
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int maxSubArray(vector<int>& nums) {
  int n = (int)nums.size();
  vector<int> dp = vector<int>(n);
  dp[0] = nums[0];
  int best = dp[0];
  for (int i = 1; i < n; i++) {
    dp[i] = max(nums[i], dp[i - 1] + nums[i]);
    if (dp[i] > best) best = dp[i];
  }
  return best;
}`,
            c: `/* pass n for array length; simple loops */
int maxSubArray(int* nums, int n) {
  /* n is the given length */
  int dp = /* array n */;
  dp[0] = nums[0];
  int best = dp[0];
  for (int i = 1; i < n; i++) {
    dp[i] = (nums[i] > dp[i - 1] + nums[i] ? nums[i] : dp[i - 1] + nums[i]);
    if (dp[i] > best) best = dp[i];
  }
  return best;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Kadane: only the previous ending-sum is needed, so extra memory is constant.\nHow it works: endingHere is dp[i] without the array. best is the global max. Start both from nums[0] so all-negative input still works.",
          code: `function maxSubArray(nums) {
  let endingHere = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    endingHere = Math.max(nums[i], endingHere + nums[i]);
    if (endingHere > best) best = endingHere;
  }
  return best;
}`,
          codes: {
            javascript: `function maxSubArray(nums) {
  let endingHere = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    endingHere = Math.max(nums[i], endingHere + nums[i]);
    if (endingHere > best) best = endingHere;
  }
  return best;
}`,
            python: `def max_sub_array(nums):
    endingHere = nums[0]
    best = nums[0]
    for i in range(1, len(nums)):

        endingHere = max(nums[i], endingHere + nums[i])
        if endingHere > best: best = endingHere

    return best`,
            java: `class Solution {
  public int maxSubArray(int[] nums) {
    int endingHere = nums[0];
    int best = nums[0];
    for (int i = 1; i < nums.length; i++) {
      endingHere = Math.max(nums[i], endingHere + nums[i]);
      if (endingHere > best) best = endingHere;
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int maxSubArray(vector<int>& nums) {
  int endingHere = nums[0];
  int best = nums[0];
  for (int i = 1; i < (int)nums.size(); i++) {
    endingHere = max(nums[i], endingHere + nums[i]);
    if (endingHere > best) best = endingHere;
  }
  return best;
}`,
            c: `/* pass n for array length; simple loops */
int maxSubArray(int* nums, int n) {
  int endingHere = nums[0];
  int best = nums[0];
  for (int i = 1; i < n; i++) {
    endingHere = (nums[i] > endingHere + nums[i] ? nums[i] : endingHere + nums[i]);
    if (endingHere > best) best = endingHere;
  }
  return best;
}`
          }
        }
      ]
    },
    {
      id: 6,
      level: "intermediate",
      q: "Maximum Product Subarray",
      ask: "Amazon · Google · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/maximum-product-subarray/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/maximum-product-subarray3604/1"}],
      a: "Return the largest product of any contiguous subarray. Zeros reset a product. Negatives can flip min and max.\n\nExample: [2, 3, -2, 4] -> 6 from [2, 3]. Example: [-2, 3, -4] -> 24 from the whole list.\n\nAll subarray products work but are slow. Two DP arrays keep min and max ending at i. The last version keeps only those two running values.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "Every subarray product is computed. Zeros and negatives are handled automatically, at quadratic cost.\nHow it works: start at i, multiply as j walks right, track the max product.",
          code: `function maxProduct(nums) {
  let best = -Infinity;
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    let prod = 1;
    for (let j = i; j < n; j++) {
      prod *= nums[j];
      if (prod > best) best = prod;
    }
  }
  return best;
}`,
          codes: {
            javascript: `function maxProduct(nums) {
  let best = -Infinity;
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    let prod = 1;
    for (let j = i; j < n; j++) {
      prod *= nums[j];
      if (prod > best) best = prod;
    }
  }
  return best;
}`,
            python: `def max_product(nums):
    best = float('-inf')
    n = len(nums)
    for i in range(n):

        prod = 1
        for j in range(i, n):

            prod *= nums[j]
            if prod > best: best = prod

    return best`,
            java: `class Solution {
  public int maxProduct(int[] nums) {
    int best = Integer.MIN_VALUE;
    int n = nums.length;
    for (int i = 0; i < n; i++) {
      int prod = 1;
      for (int j = i; j < n; j++) {
        prod *= nums[j];
        if (prod > best) best = prod;
      }
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int maxProduct(vector<int>& nums) {
  int best = INT_MIN;
  int n = (int)nums.size();
  for (int i = 0; i < n; i++) {
    int prod = 1;
    for (int j = i; j < n; j++) {
      prod *= nums[j];
      if (prod > best) best = prod;
    }
  }
  return best;
}`,
            c: `/* pass n for array length; simple loops */
int maxProduct(int* nums, int n) {
  int best = INT_MIN;
  /* n is the given length */
  for (int i = 0; i < n; i++) {
    int prod = 1;
    for (int j = i; j < n; j++) {
      prod *= nums[j];
      if (prod > best) best = prod;
    }
  }
  return best;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Linear time with min/max DP arrays. A negative number can turn a min into a max.\nHow it works: maxEnd[i] and minEnd[i] consider nums[i] alone, or times the previous max, or times the previous min. Answer is the max of maxEnd.",
          code: `function maxProduct(nums) {
  const n = nums.length;
  const maxEnd = new Array(n);
  const minEnd = new Array(n);
  maxEnd[0] = nums[0];
  minEnd[0] = nums[0];
  let best = nums[0];
  for (let i = 1; i < n; i++) {
    const x = nums[i];
    maxEnd[i] = Math.max(x, maxEnd[i - 1] * x, minEnd[i - 1] * x);
    minEnd[i] = Math.min(x, maxEnd[i - 1] * x, minEnd[i - 1] * x);
    if (maxEnd[i] > best) best = maxEnd[i];
  }
  return best;
}`,
          codes: {
            javascript: `function maxProduct(nums) {
  const n = nums.length;
  const maxEnd = new Array(n);
  const minEnd = new Array(n);
  maxEnd[0] = nums[0];
  minEnd[0] = nums[0];
  let best = nums[0];
  for (let i = 1; i < n; i++) {
    const x = nums[i];
    maxEnd[i] = Math.max(x, maxEnd[i - 1] * x, minEnd[i - 1] * x);
    minEnd[i] = Math.min(x, maxEnd[i - 1] * x, minEnd[i - 1] * x);
    if (maxEnd[i] > best) best = maxEnd[i];
  }
  return best;
}`,
            python: `def max_product(nums):
    n = len(nums)
    maxEnd = [None] * (n)
    minEnd = [None] * (n)
    maxEnd[0] = nums[0]
    minEnd[0] = nums[0]
    best = nums[0]
    for i in range(1, n):

        x = nums[i]
        maxEnd[i] = max(x, maxEnd[i - 1] * x, minEnd[i - 1] * x)
        minEnd[i] = min(x, maxEnd[i - 1] * x, minEnd[i - 1] * x)
        if maxEnd[i] > best: best = maxEnd[i]

    return best`,
            java: `class Solution {
  public int maxProduct(int[] nums) {
    int n = nums.length;
    int[] maxEnd = new int[n];
    int[] minEnd = new int[n];
    maxEnd[0] = nums[0];
    minEnd[0] = nums[0];
    int best = nums[0];
    for (int i = 1; i < n; i++) {
      int x = nums[i];
      maxEnd[i] = Math.max(x, maxEnd[i - 1] * x, minEnd[i - 1] * x);
      minEnd[i] = Math.min(x, maxEnd[i - 1] * x, minEnd[i - 1] * x);
      if (maxEnd[i] > best) best = maxEnd[i];
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int maxProduct(vector<int>& nums) {
  int n = (int)nums.size();
  vector<int> maxEnd = vector<int>(n);
  vector<int> minEnd = vector<int>(n);
  maxEnd[0] = nums[0];
  minEnd[0] = nums[0];
  int best = nums[0];
  for (int i = 1; i < n; i++) {
    int x = nums[i];
    maxEnd[i] = max(x, max(maxEnd[i - 1] * x, minEnd[i - 1] * x));
    minEnd[i] = min(x, min(maxEnd[i - 1] * x, minEnd[i - 1] * x));
    if (maxEnd[i] > best) best = maxEnd[i];
  }
  return best;
}`,
            c: `/* pass n for array length; simple loops */
int maxProduct(int* nums, int n) {
  /* n is the given length */
  int maxEnd = /* array n */;
  int minEnd = /* array n */;
  maxEnd[0] = nums[0];
  minEnd[0] = nums[0];
  int best = nums[0];
  for (int i = 1; i < n; i++) {
    int x = nums[i];
    maxEnd[i] = (x>maxEnd[i - 1] * x?(x>minEnd[i - 1] * x?x:minEnd[i - 1] * x):(maxEnd[i - 1] * x>minEnd[i - 1] * x?maxEnd[i - 1] * x:minEnd[i - 1] * x));
    minEnd[i] = (x<maxEnd[i - 1] * x?(x<minEnd[i - 1] * x?x:minEnd[i - 1] * x):(maxEnd[i - 1] * x<minEnd[i - 1] * x?maxEnd[i - 1] * x:minEnd[i - 1] * x));
    if (maxEnd[i] > best) best = maxEnd[i];
  }
  return best;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Same recurrence, two scalars instead of two arrays.\nHow it works: copy prev max/min into locals before updating, because both formulas need the old values. Then take the global max of maxEnd.",
          code: `function maxProduct(nums) {
  let maxEnd = nums[0];
  let minEnd = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i];
    const prevMax = maxEnd;
    const prevMin = minEnd;
    maxEnd = Math.max(x, prevMax * x, prevMin * x);
    minEnd = Math.min(x, prevMax * x, prevMin * x);
    if (maxEnd > best) best = maxEnd;
  }
  return best;
}`,
          codes: {
            javascript: `function maxProduct(nums) {
  let maxEnd = nums[0];
  let minEnd = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i];
    const prevMax = maxEnd;
    const prevMin = minEnd;
    maxEnd = Math.max(x, prevMax * x, prevMin * x);
    minEnd = Math.min(x, prevMax * x, prevMin * x);
    if (maxEnd > best) best = maxEnd;
  }
  return best;
}`,
            python: `def max_product(nums):
    maxEnd = nums[0]
    minEnd = nums[0]
    best = nums[0]
    for i in range(1, len(nums)):

        x = nums[i]
        prevMax = maxEnd
        prevMin = minEnd
        maxEnd = max(x, prevMax * x, prevMin * x)
        minEnd = min(x, prevMax * x, prevMin * x)
        if maxEnd > best: best = maxEnd

    return best`,
            java: `class Solution {
  public int maxProduct(int[] nums) {
    int maxEnd = nums[0];
    int minEnd = nums[0];
    int best = nums[0];
    for (int i = 1; i < nums.length; i++) {
      int x = nums[i];
      int prevMax = maxEnd;
      int prevMin = minEnd;
      maxEnd = Math.max(x, prevMax * x, prevMin * x);
      minEnd = Math.min(x, prevMax * x, prevMin * x);
      if (maxEnd > best) best = maxEnd;
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int maxProduct(vector<int>& nums) {
  int maxEnd = nums[0];
  int minEnd = nums[0];
  int best = nums[0];
  for (int i = 1; i < (int)nums.size(); i++) {
    int x = nums[i];
    int prevMax = maxEnd;
    int prevMin = minEnd;
    maxEnd = max(x, max(prevMax * x, prevMin * x));
    minEnd = min(x, min(prevMax * x, prevMin * x));
    if (maxEnd > best) best = maxEnd;
  }
  return best;
}`,
            c: `/* pass n for array length; simple loops */
int maxProduct(int* nums, int n) {
  int maxEnd = nums[0];
  int minEnd = nums[0];
  int best = nums[0];
  for (int i = 1; i < n; i++) {
    int x = nums[i];
    int prevMax = maxEnd;
    int prevMin = minEnd;
    maxEnd = (x>prevMax * x?(x>prevMin * x?x:prevMin * x):(prevMax * x>prevMin * x?prevMax * x:prevMin * x));
    minEnd = (x<prevMax * x?(x<prevMin * x?x:prevMin * x):(prevMax * x<prevMin * x?prevMax * x:prevMin * x));
    if (maxEnd > best) best = maxEnd;
  }
  return best;
}`
          }
        }
      ]
    },
    {
      id: 7,
      level: "intermediate",
      q: "Merge Intervals",
      ask: "Google · Meta · Amazon · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/merge-intervals/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/overlapping-intervals--170633/1"}],
      a: "Given intervals [start, end], merge every overlapping pair. Touching ends merge too: [1, 2] and [2, 3] become [1, 3].\n\nExample: [[1, 3], [2, 6], [8, 10], [15, 18]] -> [[1, 6], [8, 10], [15, 18]].\n\nYou can keep scanning the list and glue overlaps until nothing changes. Sorting by start makes overlaps neighbors, then one walk finishes the job. The last version does that walk into a result list after an in-place sort of a copy.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(n)",
          why: "Each merge pass can scan all remaining pairs. Several passes still stay quadratic for typical n.\nHow it works: copy intervals. While any two overlap, replace them with their union and restart the pair scan.",
          code: `function merge(intervals) {
  const out = [];
  for (let i = 0; i < intervals.length; i++) {
    out.push([intervals[i][0], intervals[i][1]]);
  }
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < out.length; i++) {
      for (let j = i + 1; j < out.length; j++) {
        const a = out[i];
        const b = out[j];
        if (a[0] <= b[1] && b[0] <= a[1]) {
          a[0] = Math.min(a[0], b[0]);
          a[1] = Math.max(a[1], b[1]);
          out.splice(j, 1);
          changed = true;
          break;
        }
      }
      if (changed) break;
    }
  }
  return out;
}`,
          codes: {
            javascript: `function merge(intervals) {
  const out = [];
  for (let i = 0; i < intervals.length; i++) {
    out.push([intervals[i][0], intervals[i][1]]);
  }
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < out.length; i++) {
      for (let j = i + 1; j < out.length; j++) {
        const a = out[i];
        const b = out[j];
        if (a[0] <= b[1] && b[0] <= a[1]) {
          a[0] = Math.min(a[0], b[0]);
          a[1] = Math.max(a[1], b[1]);
          out.splice(j, 1);
          changed = true;
          break;
        }
      }
      if (changed) break;
    }
  }
  return out;
}`,
            python: `def merge(intervals):
    out = []
    for i in range(len(intervals)):

        out.append([intervals[i][0], intervals[i][1]])

    changed = True
    while changed:
        changed = False
        for i in range(len(out)):

            for j in range(i + 1, len(out)):

                a = out[i]
                b = out[j]
                if a[0] <= b[1] and b[0] <= a[1]:
                    a[0] = min(a[0], b[0])
                    a[1] = max(a[1], b[1])
                    del out[j]
                    changed = True
                    break

            if changed: break

    return out`,
            java: `class Solution {
  public int[][] merge(int[][] intervals) {
    List<Integer> out = new ArrayList<>();
    for (int i = 0; i < intervals.length; i++) {
      out.add([intervals[i][0], intervals[i][1]]);
    }
    boolean changed = true;
    while (changed) {
      changed = false;
      for (int i = 0; i < out.size(); i++) {
        for (int j = i + 1; j < out.size(); j++) {
          int a = out[i];
          int b = out[j];
          if (a[0] <= b[1] && b[0] <= a[1]) {
            a[0] = Math.min(a[0], b[0]);
            a[1] = Math.max(a[1], b[1]);
            out.remove((int)(j));
            changed = true;
            break;
          }
        }
        if (changed) break;
      }
    }
    return out;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<vector<int>> merge(vector<vector<int>>& intervals) {
  vector<int> out;
  for (int i = 0; i < (int)intervals.size(); i++) {
    out.push_back([intervals[i][0], intervals[i][1]]);
  }
  bool changed = true;
  while (changed) {
    changed = false;
    for (int i = 0; i < (int)out.size(); i++) {
      for (int j = i + 1; j < (int)out.size(); j++) {
        int a = out[i];
        int b = out[j];
        if (a[0] <= b[1] && b[0] <= a[1]) {
          a[0] = min(a[0], b[0]);
          a[1] = max(a[1], b[1]);
          out.erase(out.begin()+(j));
          changed = true;
          break;
        }
      }
      if (changed) break;
    }
  }
  return out;
}`,
            c: `/* pass n for array length; simple loops */
int mergeIntervals(int intervals[][2], int n, int out[][2]) {
  int out[1024]; int out_n = 0;
  for (int i = 0; i < n; i++) {
    /* push */([intervals[i][0], intervals[i][1]]);
  }
  int changed = 1;
  while (changed) {
    changed = 0;
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        int a = out[i];
        int b = out[j];
        if (a[0] <= b[1] && b[0] <= a[1]) {
          a[0] = (a[0] < b[0] ? a[0] : b[0]);
          a[1] = (a[1] > b[1] ? a[1] : b[1]);
          /* erase */;
          changed = 1;
          break;
        }
      }
      if (changed) break;
    }
  }
  return out;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n log n)",
          space: "O(n)",
          why: "Sort by start, then one linear merge. Sorting is the bottleneck.\nHow it works: after sort, only the last merged interval can overlap the next one. Stretch its end or push a new block.",
          code: `function merge(intervals) {
  if (intervals.length === 0) return [];
  const list = intervals.map(function (p) { return [p[0], p[1]]; });
  list.sort(function (a, b) { return a[0] - b[0]; });
  const merged = [list[0]];
  for (let i = 1; i < list.length; i++) {
    const last = merged[merged.length - 1];
    if (list[i][0] <= last[1]) {
      last[1] = Math.max(last[1], list[i][1]);
    } else {
      merged.push(list[i]);
    }
  }
  return merged;
}`,
          codes: {
            javascript: `function merge(intervals) {
  if (intervals.length === 0) return [];
  const list = intervals.map(function (p) { return [p[0], p[1]]; });
  list.sort(function (a, b) { return a[0] - b[0]; });
  const merged = [list[0]];
  for (let i = 1; i < list.length; i++) {
    const last = merged[merged.length - 1];
    if (list[i][0] <= last[1]) {
      last[1] = Math.max(last[1], list[i][1]);
    } else {
      merged.push(list[i]);
    }
  }
  return merged;
}`,
            python: `def merge(intervals):
    if len(intervals) == 0: return []
    list = [[p[0], p[1]] for p in intervals]
    list.sort(key=lambda z: z[0])
    merged = [list[0]]
    for i in range(1, len(list)):

        last = merged[len(merged) - 1]
        if list[i][0] <= last[1]:
            last[1] = max(last[1], list[i][1])
        else:
            merged.append(list[i])

    return merged`,
            java: `class Solution {
  public int[][] merge(int[][] intervals) {
    if (intervals.length == 0) return new int[] {};
    int list = intervals /* copy pairs */;
    list.sort((a, b) -> a[0] - b[0]);
    int merged = [list[0]];
    for (int i = 1; i < list.length; i++) {
      int last = merged[merged.length - 1];
      if (list[i][0] <= last[1]) {
        last[1] = Math.max(last[1], list[i][1]);
      } else {
        merged.add(list[i]);
      }
    }
    return merged;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<vector<int>> merge(vector<vector<int>>& intervals) {
  if ((int)intervals.size() == 0) return {};
  int list = intervals /* copy pairs */;
  sort(list.begin(), list.end());
  int merged = [list[0]];
  for (int i = 1; i < (int)list.size(); i++) {
    int last = merged[(int)merged.size() - 1];
    if (list[i][0] <= last[1]) {
      last[1] = max(last[1], list[i][1]);
    } else {
      merged.push_back(list[i]);
    }
  }
  return merged;
}`,
            c: `/* pass n for array length; simple loops */
int mergeIntervals(int intervals[][2], int n, int out[][2]) {
  if (n == 0) return {};
  int list = intervals /* copy pairs */;
  /* sort list by start */;
  int merged = [list[0]];
  for (int i = 1; i < n; i++) {
    int last = merged[merged_len - 1];
    if (list[i][0] <= last[1]) {
      last[1] = (last[1] > list[i][1] ? last[1] : list[i][1]);
    } else {
      /* push */(list[i]);
    }
  }
  return merged;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n log n)",
          space: "O(n)",
          why: "Same O(n log n) bound: you must sort unless the input is already ordered. This version sorts a copy once and writes merged ranges without extra pass flags.\nHow it works: identical merge walk, with an early return for an empty list and copies so caller intervals stay untouched.",
          code: `function merge(intervals) {
  const n = intervals.length;
  if (n === 0) return [];
  const list = new Array(n);
  for (let i = 0; i < n; i++) list[i] = [intervals[i][0], intervals[i][1]];
  list.sort(function (a, b) { return a[0] - b[0]; });
  const merged = [];
  let start = list[0][0];
  let end = list[0][1];
  for (let i = 1; i < n; i++) {
    if (list[i][0] <= end) {
      if (list[i][1] > end) end = list[i][1];
    } else {
      merged.push([start, end]);
      start = list[i][0];
      end = list[i][1];
    }
  }
  merged.push([start, end]);
  return merged;
}`,
          codes: {
            javascript: `function merge(intervals) {
  const n = intervals.length;
  if (n === 0) return [];
  const list = new Array(n);
  for (let i = 0; i < n; i++) list[i] = [intervals[i][0], intervals[i][1]];
  list.sort(function (a, b) { return a[0] - b[0]; });
  const merged = [];
  let start = list[0][0];
  let end = list[0][1];
  for (let i = 1; i < n; i++) {
    if (list[i][0] <= end) {
      if (list[i][1] > end) end = list[i][1];
    } else {
      merged.push([start, end]);
      start = list[i][0];
      end = list[i][1];
    }
  }
  merged.push([start, end]);
  return merged;
}`,
            python: `def merge(intervals):
    n = len(intervals)
    if n == 0: return []
    list = [None] * (n)
    for i in range(n):
        list[i] = [intervals[i][0], intervals[i][1]]
    list.sort(key=lambda z: z[0])
    merged = []
    start = list[0][0]
    end = list[0][1]
    for i in range(1, n):

        if list[i][0] <= end:
            if list[i][1] > end: end = list[i][1]
        else:
            merged.append([start, end])
            start = list[i][0]
            end = list[i][1]

    merged.append([start, end])
    return merged`,
            java: `class Solution {
  public int[][] merge(int[][] intervals) {
    int n = intervals.length;
    if (n == 0) return new int[] {};
    int[] list = new int[n];
    for (int i = 0; i < n; i++) list[i] = [intervals[i][0], intervals[i][1]];
    list.sort((a, b) -> a[0] - b[0]);
    List<Integer> merged = new ArrayList<>();
    int start = list[0][0];
    int end = list[0][1];
    for (int i = 1; i < n; i++) {
      if (list[i][0] <= end) {
        if (list[i][1] > end) end = list[i][1];
      } else {
        merged.add([start, end]);
        start = list[i][0];
        end = list[i][1];
      }
    }
    merged.add([start, end]);
    return merged;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<vector<int>> merge(vector<vector<int>>& intervals) {
  int n = (int)intervals.size();
  if (n == 0) return {};
  vector<int> list = vector<int>(n);
  for (int i = 0; i < n; i++) list[i] = [intervals[i][0], intervals[i][1]];
  sort(list.begin(), list.end());
  vector<int> merged;
  int start = list[0][0];
  int end = list[0][1];
  for (int i = 1; i < n; i++) {
    if (list[i][0] <= end) {
      if (list[i][1] > end) end = list[i][1];
    } else {
      merged.push_back([start, end]);
      start = list[i][0];
      end = list[i][1];
    }
  }
  merged.push_back([start, end]);
  return merged;
}`,
            c: `/* pass n for array length; simple loops */
int mergeIntervals(int intervals[][2], int n, int out[][2]) {
  /* n is the given length */
  if (n == 0) return {};
  int list = /* array n */;
  for (int i = 0; i < n; i++) list[i] = [intervals[i][0], intervals[i][1]];
  /* sort list by start */;
  int merged[1024]; int merged_n = 0;
  int start = list[0][0];
  int end = list[0][1];
  for (int i = 1; i < n; i++) {
    if (list[i][0] <= end) {
      if (list[i][1] > end) end = list[i][1];
    } else {
      /* push */([start, end]);
      start = list[i][0];
      end = list[i][1];
    }
  }
  /* push */([start, end]);
  return merged;
}`
          }
        }
      ]
    },
    {
      id: 8,
      level: "intermediate",
      q: "Insert Interval",
      ask: "Google · Amazon · Meta · Uber",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/insert-interval/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/insert-interval-1666733333/1"}],
      a: "intervals is already sorted and non-overlapping. Insert newInterval and merge if it overlaps anyone. Return the new sorted list.\n\nExample: intervals = [[1, 3], [6, 9]], newInterval = [2, 5] -> [[1, 5], [6, 9]].\n\nAppending then running a full merge works. Splitting into “before”, “overlap”, and “after” is clearer. The last version is one pass: copy the left non-overlapping pieces, merge the middle, then copy the rest.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(n)",
          why: "Add the new interval, then reuse the quadratic merge-until-stable idea.\nHow it works: push a copy of newInterval onto a copied list, then glue overlaps with nested scans until the list is stable.",
          code: `function insert(intervals, newInterval) {
  const out = [];
  for (let i = 0; i < intervals.length; i++) {
    out.push([intervals[i][0], intervals[i][1]]);
  }
  out.push([newInterval[0], newInterval[1]]);
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < out.length; i++) {
      for (let j = i + 1; j < out.length; j++) {
        if (out[i][0] <= out[j][1] && out[j][0] <= out[i][1]) {
          out[i][0] = Math.min(out[i][0], out[j][0]);
          out[i][1] = Math.max(out[i][1], out[j][1]);
          out.splice(j, 1);
          changed = true;
          break;
        }
      }
      if (changed) break;
    }
  }
  out.sort(function (a, b) { return a[0] - b[0]; });
  return out;
}`,
          codes: {
            javascript: `function insert(intervals, newInterval) {
  const out = [];
  for (let i = 0; i < intervals.length; i++) {
    out.push([intervals[i][0], intervals[i][1]]);
  }
  out.push([newInterval[0], newInterval[1]]);
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < out.length; i++) {
      for (let j = i + 1; j < out.length; j++) {
        if (out[i][0] <= out[j][1] && out[j][0] <= out[i][1]) {
          out[i][0] = Math.min(out[i][0], out[j][0]);
          out[i][1] = Math.max(out[i][1], out[j][1]);
          out.splice(j, 1);
          changed = true;
          break;
        }
      }
      if (changed) break;
    }
  }
  out.sort(function (a, b) { return a[0] - b[0]; });
  return out;
}`,
            python: `def insert(intervals, newInterval):
    out = []
    for i in range(len(intervals)):

        out.append([intervals[i][0], intervals[i][1]])

    out.append([newInterval[0], newInterval[1]])
    changed = True
    while changed:
        changed = False
        for i in range(len(out)):

            for j in range(i + 1, len(out)):

                if out[i][0] <= out[j][1] and out[j][0] <= out[i][1]:
                    out[i][0] = min(out[i][0], out[j][0])
                    out[i][1] = max(out[i][1], out[j][1])
                    del out[j]
                    changed = True
                    break

            if changed: break

    out.sort(key=lambda z: z[0])
    return out`,
            java: `class Solution {
  public int[][] insert(int[][] intervals, int[] newInterval) {
    List<Integer> out = new ArrayList<>();
    for (int i = 0; i < intervals.length; i++) {
      out.add([intervals[i][0], intervals[i][1]]);
    }
    out.add([newInterval[0], newInterval[1]]);
    boolean changed = true;
    while (changed) {
      changed = false;
      for (int i = 0; i < out.size(); i++) {
        for (int j = i + 1; j < out.size(); j++) {
          if (out[i][0] <= out[j][1] && out[j][0] <= out[i][1]) {
            out[i][0] = Math.min(out[i][0], out[j][0]);
            out[i][1] = Math.max(out[i][1], out[j][1]);
            out.remove((int)(j));
            changed = true;
            break;
          }
        }
        if (changed) break;
      }
    }
    out.sort((a, b) -> a[0] - b[0]);
    return out;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
  vector<int> out;
  for (int i = 0; i < (int)intervals.size(); i++) {
    out.push_back([intervals[i][0], intervals[i][1]]);
  }
  out.push_back([newInterval[0], newInterval[1]]);
  bool changed = true;
  while (changed) {
    changed = false;
    for (int i = 0; i < (int)out.size(); i++) {
      for (int j = i + 1; j < (int)out.size(); j++) {
        if (out[i][0] <= out[j][1] && out[j][0] <= out[i][1]) {
          out[i][0] = min(out[i][0], out[j][0]);
          out[i][1] = max(out[i][1], out[j][1]);
          out.erase(out.begin()+(j));
          changed = true;
          break;
        }
      }
      if (changed) break;
    }
  }
  sort(out.begin(), out.end());
  return out;
}`,
            c: `/* pass n for array length; simple loops */
int insertInterval(int intervals[][2], int n, int ns, int ne, int out[][2]) {
  int out[1024]; int out_n = 0;
  for (int i = 0; i < n; i++) {
    /* push */([intervals[i][0], intervals[i][1]]);
  }
  /* push */([newInterval[0], newInterval[1]]);
  int changed = 1;
  while (changed) {
    changed = 0;
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        if (out[i][0] <= out[j][1] && out[j][0] <= out[i][1]) {
          out[i][0] = (out[i][0] < out[j][0] ? out[i][0] : out[j][0]);
          out[i][1] = (out[i][1] > out[j][1] ? out[i][1] : out[j][1]);
          /* erase */;
          changed = 1;
          break;
        }
      }
      if (changed) break;
    }
  }
  /* sort out by start */;
  return out;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Three buckets, one scan. No sort needed because the input is already sorted.\nHow it works: before holds intervals fully to the left. after holds fully to the right. The middle ones stretch start/end of the new interval. Concatenate before + merged + after.",
          code: `function insert(intervals, newInterval) {
  const before = [];
  const after = [];
  let start = newInterval[0];
  let end = newInterval[1];
  for (let i = 0; i < intervals.length; i++) {
    const cur = intervals[i];
    if (cur[1] < start) before.push([cur[0], cur[1]]);
    else if (cur[0] > end) after.push([cur[0], cur[1]]);
    else {
      start = Math.min(start, cur[0]);
      end = Math.max(end, cur[1]);
    }
  }
  return before.concat([[start, end]], after);
}`,
          codes: {
            javascript: `function insert(intervals, newInterval) {
  const before = [];
  const after = [];
  let start = newInterval[0];
  let end = newInterval[1];
  for (let i = 0; i < intervals.length; i++) {
    const cur = intervals[i];
    if (cur[1] < start) before.push([cur[0], cur[1]]);
    else if (cur[0] > end) after.push([cur[0], cur[1]]);
    else {
      start = Math.min(start, cur[0]);
      end = Math.max(end, cur[1]);
    }
  }
  return before.concat([[start, end]], after);
}`,
            python: `def insert(intervals, newInterval):
    before = []
    after = []
    start = newInterval[0]
    end = newInterval[1]
    for i in range(len(intervals)):

        cur = intervals[i]
        if cur[1] < start: before.append([cur[0], cur[1]])
        elif cur[0] > end: after.append([cur[0], cur[1]])
        else:
            start = min(start, cur[0])
            end = max(end, cur[1])

    return (before + [[start, end]], after)`,
            java: `class Solution {
  public int[][] insert(int[][] intervals, int[] newInterval) {
    List<Integer> before = new ArrayList<>();
    List<Integer> after = new ArrayList<>();
    int start = newInterval[0];
    int end = newInterval[1];
    for (int i = 0; i < intervals.length; i++) {
      int[] cur = intervals[i];
      if (cur[1] < start) before.add([cur[0], cur[1]]);
      else if (cur[0] > end) after.add([cur[0], cur[1]]);
      else {
        start = Math.min(start, cur[0]);
        end = Math.max(end, cur[1]);
      }
    }
    return /* concat before */ before;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
  vector<int> before;
  vector<int> after;
  int start = newInterval[0];
  int end = newInterval[1];
  for (int i = 0; i < (int)intervals.size(); i++) {
    vector<int> cur = intervals[i];
    if (cur[1] < start) before.push_back([cur[0], cur[1]]);
    else if (cur[0] > end) after.push_back([cur[0], cur[1]]);
    else {
      start = min(start, cur[0]);
      end = max(end, cur[1]);
    }
  }
  return before;
}`,
            c: `/* pass n for array length; simple loops */
int insertInterval(int intervals[][2], int n, int ns, int ne, int out[][2]) {
  int before[1024]; int before_n = 0;
  int after[1024]; int after_n = 0;
  int start = newInterval[0];
  int end = newInterval[1];
  for (int i = 0; i < n; i++) {
    int cur = intervals[i];
    if (cur[1] < start) /* push */([cur[0], cur[1]]);
    else if (cur[0] > end) /* push */([cur[0], cur[1]]);
    else {
      start = (start < cur[0] ? start : cur[0]);
      end = (end > cur[1] ? end : cur[1]);
    }
  }
  return before;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "One pass, one result list, no extra before/after arrays (the result plays that role).\nHow it works: copy intervals that end before the new start. Merge while the next interval starts at or before the new end. Then copy the tail.",
          code: `function insert(intervals, newInterval) {
  const out = [];
  const n = intervals.length;
  let i = 0;
  let start = newInterval[0];
  let end = newInterval[1];
  while (i < n && intervals[i][1] < start) {
    out.push([intervals[i][0], intervals[i][1]]);
    i++;
  }
  while (i < n && intervals[i][0] <= end) {
    start = Math.min(start, intervals[i][0]);
    end = Math.max(end, intervals[i][1]);
    i++;
  }
  out.push([start, end]);
  while (i < n) {
    out.push([intervals[i][0], intervals[i][1]]);
    i++;
  }
  return out;
}`,
          codes: {
            javascript: `function insert(intervals, newInterval) {
  const out = [];
  const n = intervals.length;
  let i = 0;
  let start = newInterval[0];
  let end = newInterval[1];
  while (i < n && intervals[i][1] < start) {
    out.push([intervals[i][0], intervals[i][1]]);
    i++;
  }
  while (i < n && intervals[i][0] <= end) {
    start = Math.min(start, intervals[i][0]);
    end = Math.max(end, intervals[i][1]);
    i++;
  }
  out.push([start, end]);
  while (i < n) {
    out.push([intervals[i][0], intervals[i][1]]);
    i++;
  }
  return out;
}`,
            python: `def insert(intervals, newInterval):
    out = []
    n = len(intervals)
    i = 0
    start = newInterval[0]
    end = newInterval[1]
    while i < n and intervals[i][1] < start:
        out.append([intervals[i][0], intervals[i][1]])
        i += 1
    while i < n and intervals[i][0] <= end:
        start = min(start, intervals[i][0])
        end = max(end, intervals[i][1])
        i += 1
    out.append([start, end])
    while i < n:
        out.append([intervals[i][0], intervals[i][1]])
        i += 1
    return out`,
            java: `class Solution {
  public int[][] insert(int[][] intervals, int[] newInterval) {
    List<Integer> out = new ArrayList<>();
    int n = intervals.length;
    int i = 0;
    int start = newInterval[0];
    int end = newInterval[1];
    while (i < n && intervals[i][1] < start) {
      out.add([intervals[i][0], intervals[i][1]]);
      i++;
    }
    while (i < n && intervals[i][0] <= end) {
      start = Math.min(start, intervals[i][0]);
      end = Math.max(end, intervals[i][1]);
      i++;
    }
    out.add([start, end]);
    while (i < n) {
      out.add([intervals[i][0], intervals[i][1]]);
      i++;
    }
    return out;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
  vector<int> out;
  int n = (int)intervals.size();
  int i = 0;
  int start = newInterval[0];
  int end = newInterval[1];
  while (i < n && intervals[i][1] < start) {
    out.push_back([intervals[i][0], intervals[i][1]]);
    i++;
  }
  while (i < n && intervals[i][0] <= end) {
    start = min(start, intervals[i][0]);
    end = max(end, intervals[i][1]);
    i++;
  }
  out.push_back([start, end]);
  while (i < n) {
    out.push_back([intervals[i][0], intervals[i][1]]);
    i++;
  }
  return out;
}`,
            c: `/* pass n for array length; simple loops */
int insertInterval(int intervals[][2], int n, int ns, int ne, int out[][2]) {
  int out[1024]; int out_n = 0;
  /* n is the given length */
  int i = 0;
  int start = newInterval[0];
  int end = newInterval[1];
  while (i < n && intervals[i][1] < start) {
    /* push */([intervals[i][0], intervals[i][1]]);
    i++;
  }
  while (i < n && intervals[i][0] <= end) {
    start = (start < intervals[i][0] ? start : intervals[i][0]);
    end = (end > intervals[i][1] ? end : intervals[i][1]);
    i++;
  }
  /* push */([start, end]);
  while (i < n) {
    /* push */([intervals[i][0], intervals[i][1]]);
    i++;
  }
  return out;
}`
          }
        }
      ]
    },
    {
      id: 9,
      level: "intermediate",
      q: "3Sum",
      ask: "Amazon · Meta · Google · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/3sum/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/triplet-sum-in-array-1587115621/1"}],
      a: "Find all unique triplets that add to 0. Order inside a triplet does not matter. Duplicate triplets must not appear twice.\n\nExample: [-1, 0, 1, 2, -1, -4] -> [[-1, -1, 2], [-1, 0, 1]].\n\nThree nested loops plus a uniqueness set work. Two loops plus binary search drop one n. Sort, lock the first number, then two pointers on the rest is the usual O(n²) finish.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n³)",
          space: "O(k)",
          why: "Every triple of indexes is summed. Uniqueness is handled by a sorted-key set. k is the number of triplets stored.\nHow it works: i < j < l. If the three numbers sum to 0, sort them and keep the key in a Set so duplicates are dropped.",
          code: `function threeSum(nums) {
  const n = nums.length;
  const seen = new Set();
  const out = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let l = j + 1; l < n; l++) {
        if (nums[i] + nums[j] + nums[l] === 0) {
          const trip = [nums[i], nums[j], nums[l]].sort(function (a, b) { return a - b; });
          const key = trip[0] + "," + trip[1] + "," + trip[2];
          if (!seen.has(key)) {
            seen.add(key);
            out.push(trip);
          }
        }
      }
    }
  }
  return out;
}`,
          codes: {
            javascript: `function threeSum(nums) {
  const n = nums.length;
  const seen = new Set();
  const out = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let l = j + 1; l < n; l++) {
        if (nums[i] + nums[j] + nums[l] === 0) {
          const trip = [nums[i], nums[j], nums[l]].sort(function (a, b) { return a - b; });
          const key = trip[0] + "," + trip[1] + "," + trip[2];
          if (!seen.has(key)) {
            seen.add(key);
            out.push(trip);
          }
        }
      }
    }
  }
  return out;
}`,
            python: `def three_sum(nums):
    n = len(nums)
    seen = set()
    out = []
    for i in range(n):

        for j in range(i + 1, n):

            for l in range(j + 1, n):

                if nums[i] + nums[j] + nums[l] == 0:
                    trip = [nums[i], nums[j], nums[l]].sort()
                    key = trip[0] + "," + trip[1] + "," + trip[2]
                    if key not in seen:
                        seen.add(key)
                        out.append(trip)

    return out`,
            java: `class Solution {
  public List<List<Integer>> threeSum(int[] nums) {
    int n = nums.length;
    Set<Integer> seen = new HashSet<>();
    List<Integer> out = new ArrayList<>();
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        for (int l = j + 1; l < n; l++) {
          if (nums[i] + nums[j] + nums[l] == 0) {
            int[] trip = trip.clone();
            Arrays.sort(trip);
            int key = trip[0] + "," + trip[1] + "," + trip[2];
            if (!seen.contains(key)) {
              seen.add(key);
              out.add(trip);
            }
          }
        }
      }
    }
    return out;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<vector<int>> threeSum(vector<int>& nums) {
  int n = (int)nums.size();
  unordered_set<int> seen;
  vector<int> out;
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      for (int l = j + 1; l < n; l++) {
        if (nums[i] + nums[j] + nums[l] == 0) {
          vector<int> trip = trip;
          sort(trip.begin(), trip.end());
          int key = trip[0] + "," + trip[1] + "," + trip[2];
          if (!seen.count(key)) {
            seen.insert(key);
            out.push_back(trip);
          }
        }
      }
    }
  }
  return out;
}`,
            c: `/* pass n for array length; simple loops */
/* linear scan stands in for a hash map */
int map_find(int* keys, int used, int key) {
  int i;
  for (i = 0; i < used; i++) if (keys[i] == key) return i;
  return -1;
}
int threeSum(int* nums, int n, int out[][3]) {
  /* n is the given length */
  int seen_keys[1024]; int seen_n = 0;
  int out[1024]; int out_n = 0;
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      for (int l = j + 1; l < n; l++) {
        if (nums[i] + nums[j] + nums[l] == 0) {
          int trip = [nums[i], nums[j], nums[l]]./* sort */;
          int key = trip[0] + "," + trip[1] + "," + trip[2];
          if (!map_find(seen_keys, seen_n, key) >= 0) {
            /* add */;
            /* push */(trip);
          }
        }
      }
    }
  }
  return out;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n² log n)",
          space: "O(n)",
          why: "Sort once. For each pair, binary-search the third value. Each search is log n, and there are n² pairs.\nHow it works: after sort, for i and j look for -(nums[i]+nums[j]) in the suffix. Skip used indexes. A set of keys still blocks duplicate triplets.",
          code: `function threeSum(nums) {
  const n = nums.length;
  const list = nums.slice().sort(function (a, b) { return a - b; });
  const seen = new Set();
  const out = [];

  function find(from, target) {
    let lo = from;
    let hi = n - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (list[mid] === target) return mid;
      if (list[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const need = -(list[i] + list[j]);
      const k = find(j + 1, need);
      if (k !== -1) {
        const trip = [list[i], list[j], list[k]];
        const key = trip[0] + "," + trip[1] + "," + trip[2];
        if (!seen.has(key)) {
          seen.add(key);
          out.push(trip);
        }
      }
    }
  }
  return out;
}`,
          codes: {
            javascript: `function threeSum(nums) {
  const n = nums.length;
  const list = nums.slice().sort(function (a, b) { return a - b; });
  const seen = new Set();
  const out = [];

  function find(from, target) {
    let lo = from;
    let hi = n - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (list[mid] === target) return mid;
      if (list[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const need = -(list[i] + list[j]);
      const k = find(j + 1, need);
      if (k !== -1) {
        const trip = [list[i], list[j], list[k]];
        const key = trip[0] + "," + trip[1] + "," + trip[2];
        if (!seen.has(key)) {
          seen.add(key);
          out.push(trip);
        }
      }
    }
  }
  return out;
}`,
            python: `def three_sum(nums):
    n = len(nums)
    list = sorted(nums)
    seen = set()
    out = []

    def find(start, target):
        lo = start
        hi = n - 1
        while lo <= hi:
            mid = ((lo + hi) ) # 2
            if list[mid] == target: return mid
            if list[mid] < target: lo = mid + 1
            else: hi = mid - 1
        return -1

    for i in range(n):

        for j in range(i + 1, n):

            need = -(list[i] + list[j])
            k = find(j + 1, need)
            if k != -1:
                trip = [list[i], list[j], list[k]]
                key = trip[0] + "," + trip[1] + "," + trip[2]
                if key not in seen:
                    seen.add(key)
                    out.append(trip)

    return out`,
            java: `class Solution {
  public List<List<Integer>> threeSum(int[] nums) {
    int n = nums.length;
    int[] list = nums.clone();
    Arrays.sort(list);
    Set<Integer> seen = new HashSet<>();
    List<Integer> out = new ArrayList<>();

    public void find(from, target) {
      int lo = from;
      int hi = n - 1;
      while (lo <= hi) {
        int mid = ((lo + hi) / 2);
        if (list[mid] == target) return mid;
        if (list[mid] < target) lo = mid + 1;
        else hi = mid - 1;
      }
      return -1;
    }

    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        int need = -(list[i] + list[j]);
        int k = find(j + 1, need);
        if (k != -1) {
          int trip = [list[i], list[j], list[k]];
          int key = trip[0] + "," + trip[1] + "," + trip[2];
          if (!seen.contains(key)) {
            seen.add(key);
            out.add(trip);
          }
        }
      }
    }
    return out;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<vector<int>> threeSum(vector<int>& nums) {
  int n = (int)nums.size();
  vector<int> list = nums;
  sort(list.begin(), list.end());
  unordered_set<int> seen;
  vector<int> out;

  auto find = [&](from, target) {
    int lo = from;
    int hi = n - 1;
    while (lo <= hi) {
      int mid = (int)((lo + hi) / 2);
      if (list[mid] == target) return mid;
      if (list[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  }

  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      int need = -(list[i] + list[j]);
      int k = find(j + 1, need);
      if (k != -1) {
        int trip = [list[i], list[j], list[k]];
        int key = trip[0] + "," + trip[1] + "," + trip[2];
        if (!seen.count(key)) {
          seen.insert(key);
          out.push_back(trip);
        }
      }
    }
  }
  return out;
}`,
            c: `/* pass n for array length; simple loops */
/* linear scan stands in for a hash map */
int map_find(int* keys, int used, int key) {
  int i;
  for (i = 0; i < used; i++) if (keys[i] == key) return i;
  return -1;
}
int threeSum(int* nums, int n, int out[][3]) {
  /* n is the given length */
  int list = /* sorted copy */;
  int seen_keys[1024]; int seen_n = 0;
  int out[1024]; int out_n = 0;

  void find(/* from, target */) {
    int lo = from;
    int hi = n - 1;
    while (lo <= hi) {
      int mid = ((lo + hi) / 2);
      if (list[mid] == target) return mid;
      if (list[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  }

  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      int need = -(list[i] + list[j]);
      int k = find(j + 1, need);
      if (k != -1) {
        int trip = [list[i], list[j], list[k]];
        int key = trip[0] + "," + trip[1] + "," + trip[2];
        if (!map_find(seen_keys, seen_n, key) >= 0) {
          /* add */;
          /* push */(trip);
        }
      }
    }
  }
  return out;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n²)",
          space: "O(k)",
          why: "Sort plus two pointers is the standard bound. Extra memory is only the output (and the sort copy).\nHow it works: skip duplicate first numbers. For each i, left = i+1, right = end. Move left/right by comparing the sum to 0, and skip duplicate left/right values after a hit.",
          code: `function threeSum(nums) {
  const list = nums.slice().sort(function (a, b) { return a - b; });
  const n = list.length;
  const out = [];
  for (let i = 0; i < n; i++) {
    if (i > 0 && list[i] === list[i - 1]) continue;
    let left = i + 1;
    let right = n - 1;
    while (left < right) {
      const sum = list[i] + list[left] + list[right];
      if (sum === 0) {
        out.push([list[i], list[left], list[right]]);
        left++;
        right--;
        while (left < right && list[left] === list[left - 1]) left++;
        while (left < right && list[right] === list[right + 1]) right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return out;
}`,
          codes: {
            javascript: `function threeSum(nums) {
  const list = nums.slice().sort(function (a, b) { return a - b; });
  const n = list.length;
  const out = [];
  for (let i = 0; i < n; i++) {
    if (i > 0 && list[i] === list[i - 1]) continue;
    let left = i + 1;
    let right = n - 1;
    while (left < right) {
      const sum = list[i] + list[left] + list[right];
      if (sum === 0) {
        out.push([list[i], list[left], list[right]]);
        left++;
        right--;
        while (left < right && list[left] === list[left - 1]) left++;
        while (left < right && list[right] === list[right + 1]) right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return out;
}`,
            python: `def three_sum(nums):
    list = sorted(nums)
    n = len(list)
    out = []
    for i in range(n):

        if i > 0 and list[i] == list[i - 1]: continue
        left = i + 1
        right = n - 1
        while left < right:
            sum = list[i] + list[left] + list[right]
            if sum == 0:
                out.append([list[i], list[left], list[right]])
                left += 1
                right -= 1
                while left < right and list[left] == list[left - 1]: left += 1
                while left < right and list[right] == list[right + 1]: right -= 1
            elif sum < 0:
                left += 1
            else:
                right -= 1

    return out`,
            java: `class Solution {
  public List<List<Integer>> threeSum(int[] nums) {
    int[] list = nums.clone();
    Arrays.sort(list);
    int n = list.length;
    List<Integer> out = new ArrayList<>();
    for (int i = 0; i < n; i++) {
      if (i > 0 && list[i] == list[i - 1]) continue;
      int left = i + 1;
      int right = n - 1;
      while (left < right) {
        int sum = list[i] + list[left] + list[right];
        if (sum == 0) {
          out.add([list[i], list[left], list[right]]);
          left++;
          right--;
          while (left < right && list[left] == list[left - 1]) left++;
          while (left < right && list[right] == list[right + 1]) right--;
        } else if (sum < 0) {
          left++;
        } else {
          right--;
        }
      }
    }
    return out;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<vector<int>> threeSum(vector<int>& nums) {
  vector<int> list = nums;
  sort(list.begin(), list.end());
  int n = (int)list.size();
  vector<int> out;
  for (int i = 0; i < n; i++) {
    if (i > 0 && list[i] == list[i - 1]) continue;
    int left = i + 1;
    int right = n - 1;
    while (left < right) {
      int sum = list[i] + list[left] + list[right];
      if (sum == 0) {
        out.push_back([list[i], list[left], list[right]]);
        left++;
        right--;
        while (left < right && list[left] == list[left - 1]) left++;
        while (left < right && list[right] == list[right + 1]) right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return out;
}`,
            c: `/* pass n for array length; simple loops */
int threeSum(int* nums, int n, int out[][3]) {
  int list = /* sorted copy */;
  /* n is the given length */
  int out[1024]; int out_n = 0;
  for (int i = 0; i < n; i++) {
    if (i > 0 && list[i] == list[i - 1]) continue;
    int left = i + 1;
    int right = n - 1;
    while (left < right) {
      int sum = list[i] + list[left] + list[right];
      if (sum == 0) {
        /* push */([list[i], list[left], list[right]]);
        left++;
        right--;
        while (left < right && list[left] == list[left - 1]) left++;
        while (left < right && list[right] == list[right + 1]) right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return out;
}`
          }
        }
      ]
    },
    {
      id: 10,
      level: "intermediate",
      q: "Container With Most Water",
      ask: "Amazon · Google · Meta · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/container-with-most-water/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/container-with-most-water0535/1"}],
      a: "Bars stand at indexes 0..n-1. The water between i and j is min(height[i], height[j]) * (j - i). Return the largest area.\n\nExample: [1, 8, 6, 2, 5, 4, 8, 3, 7] -> 49, between the 8 at index 1 and the 7 at index 8.\n\nAll pairs work. Two pointers start at the ends: the short bar cannot beat a wider pair, so you move that side. A small extra skip jumps over bars that are no taller than the current limiting height.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "Every pair of bars is an area. Quadratic checks.\nHow it works: i is the left wall, j the right wall. Area is min height times width. Keep the max.",
          code: `function maxArea(height) {
  let best = 0;
  const n = height.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const h = Math.min(height[i], height[j]);
      const area = h * (j - i);
      if (area > best) best = area;
    }
  }
  return best;
}`,
          codes: {
            javascript: `function maxArea(height) {
  let best = 0;
  const n = height.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const h = Math.min(height[i], height[j]);
      const area = h * (j - i);
      if (area > best) best = area;
    }
  }
  return best;
}`,
            python: `def max_area(height):
    best = 0
    n = len(height)
    for i in range(n):

        for j in range(i + 1, n):

            h = min(height[i], height[j])
            area = h * (j - i)
            if area > best: best = area

    return best`,
            java: `class Solution {
  public int maxArea(int[] height) {
    int best = 0;
    int n = height.length;
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        int h = Math.min(height[i], height[j]);
        int area = h * (j - i);
        if (area > best) best = area;
      }
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int maxArea(vector<int>& height) {
  int best = 0;
  int n = (int)height.size();
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      int h = min(height[i], height[j]);
      int area = h * (j - i);
      if (area > best) best = area;
    }
  }
  return best;
}`,
            c: `/* pass n for array length; simple loops */
int maxArea(int* height, int n) {
  int best = 0;
  /* n is the given length */
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      int h = (height[i] < height[j] ? height[i] : height[j]);
      int area = h * (j - i);
      if (area > best) best = area;
    }
  }
  return best;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Each step moves one pointer, so at most n-1 steps.\nHow it works: start at both ends. Record the area. Move the shorter wall inward. A taller inner wall might win; a shorter width with the same short wall cannot.",
          code: `function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let best = 0;
  while (left < right) {
    const h = Math.min(height[left], height[right]);
    const area = h * (right - left);
    if (area > best) best = area;
    if (height[left] < height[right]) left++;
    else right--;
  }
  return best;
}`,
          codes: {
            javascript: `function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let best = 0;
  while (left < right) {
    const h = Math.min(height[left], height[right]);
    const area = h * (right - left);
    if (area > best) best = area;
    if (height[left] < height[right]) left++;
    else right--;
  }
  return best;
}`,
            python: `def max_area(height):
    left = 0
    right = len(height) - 1
    best = 0
    while left < right:
        h = min(height[left], height[right])
        area = h * (right - left)
        if area > best: best = area
        if height[left] < height[right]: left += 1
        else: right -= 1
    return best`,
            java: `class Solution {
  public int maxArea(int[] height) {
    int left = 0;
    int right = height.length - 1;
    int best = 0;
    while (left < right) {
      int h = Math.min(height[left], height[right]);
      int area = h * (right - left);
      if (area > best) best = area;
      if (height[left] < height[right]) left++;
      else right--;
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int maxArea(vector<int>& height) {
  int left = 0;
  int right = (int)height.size() - 1;
  int best = 0;
  while (left < right) {
    int h = min(height[left], height[right]);
    int area = h * (right - left);
    if (area > best) best = area;
    if (height[left] < height[right]) left++;
    else right--;
  }
  return best;
}`,
            c: `/* pass n for array length; simple loops */
int maxArea(int* height, int n) {
  int left = 0;
  int right = n - 1;
  int best = 0;
  while (left < right) {
    int h = (height[left] < height[right] ? height[left] : height[right]);
    int area = h * (right - left);
    if (area > best) best = area;
    if (height[left] < height[right]) left++;
    else right--;
  }
  return best;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Still O(n) worst case, but bars no taller than the current min height are skipped, so fewer area multiplies on flat stretches.\nHow it works: after recording the area for height h, advance left while height[left] <= h and right while height[right] <= h.",
          code: `function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let best = 0;
  while (left < right) {
    const h = Math.min(height[left], height[right]);
    const area = h * (right - left);
    if (area > best) best = area;
    while (left < right && height[left] <= h) left++;
    while (left < right && height[right] <= h) right--;
  }
  return best;
}`,
          codes: {
            javascript: `function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let best = 0;
  while (left < right) {
    const h = Math.min(height[left], height[right]);
    const area = h * (right - left);
    if (area > best) best = area;
    while (left < right && height[left] <= h) left++;
    while (left < right && height[right] <= h) right--;
  }
  return best;
}`,
            python: `def max_area(height):
    left = 0
    right = len(height) - 1
    best = 0
    while left < right:
        h = min(height[left], height[right])
        area = h * (right - left)
        if area > best: best = area
        while left < right and height[left] <= h: left += 1
        while left < right and height[right] <= h: right -= 1
    return best`,
            java: `class Solution {
  public int maxArea(int[] height) {
    int left = 0;
    int right = height.length - 1;
    int best = 0;
    while (left < right) {
      int h = Math.min(height[left], height[right]);
      int area = h * (right - left);
      if (area > best) best = area;
      while (left < right && height[left] <= h) left++;
      while (left < right && height[right] <= h) right--;
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int maxArea(vector<int>& height) {
  int left = 0;
  int right = (int)height.size() - 1;
  int best = 0;
  while (left < right) {
    int h = min(height[left], height[right]);
    int area = h * (right - left);
    if (area > best) best = area;
    while (left < right && height[left] <= h) left++;
    while (left < right && height[right] <= h) right--;
  }
  return best;
}`,
            c: `/* pass n for array length; simple loops */
int maxArea(int* height, int n) {
  int left = 0;
  int right = n - 1;
  int best = 0;
  while (left < right) {
    int h = (height[left] < height[right] ? height[left] : height[right]);
    int area = h * (right - left);
    if (area > best) best = area;
    while (left < right && height[left] <= h) left++;
    while (left < right && height[right] <= h) right--;
  }
  return best;
}`
          }
        }
      ]
    },
    {
      id: 11,
      level: "advanced",
      q: "Trapping Rain Water",
      ask: "Amazon · Google · Meta · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/trapping-rain-water/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/trapping-rain-water-1587115621/1"}],
      a: "Each index is a bar. Water sits on top of a bar up to the lower of the tallest bar on its left and on its right. Return total units of water.\n\nExample: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] -> 6.\n\nFor each index you can scan left and right for the two maxes. Precomputing those max arrays is linear. Two pointers keep a running leftMax and rightMax and add water from the smaller side, using constant extra memory.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "For every index you walk the whole left side and the whole right side.\nHow it works: water at i is max(0, min(leftMax, rightMax) - height[i]). Sum those amounts.",
          code: `function trap(height) {
  const n = height.length;
  let total = 0;
  for (let i = 0; i < n; i++) {
    let leftMax = 0;
    let rightMax = 0;
    for (let L = 0; L <= i; L++) leftMax = Math.max(leftMax, height[L]);
    for (let R = i; R < n; R++) rightMax = Math.max(rightMax, height[R]);
    total += Math.min(leftMax, rightMax) - height[i];
  }
  return total;
}`,
          codes: {
            javascript: `function trap(height) {
  const n = height.length;
  let total = 0;
  for (let i = 0; i < n; i++) {
    let leftMax = 0;
    let rightMax = 0;
    for (let L = 0; L <= i; L++) leftMax = Math.max(leftMax, height[L]);
    for (let R = i; R < n; R++) rightMax = Math.max(rightMax, height[R]);
    total += Math.min(leftMax, rightMax) - height[i];
  }
  return total;
}`,
            python: `def trap(height):
    n = len(height)
    total = 0
    for i in range(n):

        leftMax = 0
        rightMax = 0
        for L in range(= i):
            leftMax = max(leftMax, height[L])
        for R in range(i, n):
            rightMax = max(rightMax, height[R])
        total += min(leftMax, rightMax) - height[i]

    return total`,
            java: `class Solution {
  public int trap(int[] height) {
    int n = height.length;
    int total = 0;
    for (int i = 0; i < n; i++) {
      int leftMax = 0;
      int rightMax = 0;
      for (int L = 0; L <= i; L++) leftMax = Math.max(leftMax, height[L]);
      for (int R = i; R < n; R++) rightMax = Math.max(rightMax, height[R]);
      total += Math.min(leftMax, rightMax) - height[i];
    }
    return total;
  }
}`,
            cpp: `// vector, unordered_map, string
int trap(vector<int>& height) {
  int n = (int)height.size();
  int total = 0;
  for (int i = 0; i < n; i++) {
    int leftMax = 0;
    int rightMax = 0;
    for (int L = 0; L <= i; L++) leftMax = max(leftMax, height[L]);
    for (int R = i; R < n; R++) rightMax = max(rightMax, height[R]);
    total += min(leftMax, rightMax) - height[i];
  }
  return total;
}`,
            c: `/* pass n for array length; simple loops */
int trap(int* height, int n) {
  /* n is the given length */
  int total = 0;
  for (int i = 0; i < n; i++) {
    int leftMax = 0;
    int rightMax = 0;
    for (int L = 0; L <= i; L++) leftMax = (leftMax > height[L] ? leftMax : height[L]);
    for (int R = i; R < n; R++) rightMax = (rightMax > height[R] ? rightMax : height[R]);
    total += (leftMax < rightMax ? leftMax : rightMax) - height[i];
  }
  return total;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Three linear passes. Two extra arrays of length n.\nHow it works: leftMax[i] is the tallest bar at or left of i. rightMax[i] is the tallest at or right of i. Water at i uses those two stored values.",
          code: `function trap(height) {
  const n = height.length;
  if (n === 0) return 0;
  const leftMax = new Array(n);
  const rightMax = new Array(n);
  leftMax[0] = height[0];
  for (let i = 1; i < n; i++) leftMax[i] = Math.max(leftMax[i - 1], height[i]);
  rightMax[n - 1] = height[n - 1];
  for (let i = n - 2; i >= 0; i--) rightMax[i] = Math.max(rightMax[i + 1], height[i]);
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += Math.min(leftMax[i], rightMax[i]) - height[i];
  }
  return total;
}`,
          codes: {
            javascript: `function trap(height) {
  const n = height.length;
  if (n === 0) return 0;
  const leftMax = new Array(n);
  const rightMax = new Array(n);
  leftMax[0] = height[0];
  for (let i = 1; i < n; i++) leftMax[i] = Math.max(leftMax[i - 1], height[i]);
  rightMax[n - 1] = height[n - 1];
  for (let i = n - 2; i >= 0; i--) rightMax[i] = Math.max(rightMax[i + 1], height[i]);
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += Math.min(leftMax[i], rightMax[i]) - height[i];
  }
  return total;
}`,
            python: `def trap(height):
    n = len(height)
    if n == 0: return 0
    leftMax = [None] * (n)
    rightMax = [None] * (n)
    leftMax[0] = height[0]
    for i in range(1, n):
        leftMax[i] = max(leftMax[i - 1], height[i])
    rightMax[n - 1] = height[n - 1]
    for i in range(n - 2, (0) - 1, -1):
        rightMax[i] = max(rightMax[i + 1], height[i])
    total = 0
    for i in range(n):

        total += min(leftMax[i], rightMax[i]) - height[i]

    return total`,
            java: `class Solution {
  public int trap(int[] height) {
    int n = height.length;
    if (n == 0) return 0;
    int[] leftMax = new int[n];
    int[] rightMax = new int[n];
    leftMax[0] = height[0];
    for (int i = 1; i < n; i++) leftMax[i] = Math.max(leftMax[i - 1], height[i]);
    rightMax[n - 1] = height[n - 1];
    for (int i = n - 2; i >= 0; i--) rightMax[i] = Math.max(rightMax[i + 1], height[i]);
    int total = 0;
    for (int i = 0; i < n; i++) {
      total += Math.min(leftMax[i], rightMax[i]) - height[i];
    }
    return total;
  }
}`,
            cpp: `// vector, unordered_map, string
int trap(vector<int>& height) {
  int n = (int)height.size();
  if (n == 0) return 0;
  vector<int> leftMax = vector<int>(n);
  vector<int> rightMax = vector<int>(n);
  leftMax[0] = height[0];
  for (int i = 1; i < n; i++) leftMax[i] = max(leftMax[i - 1], height[i]);
  rightMax[n - 1] = height[n - 1];
  for (int i = n - 2; i >= 0; i--) rightMax[i] = max(rightMax[i + 1], height[i]);
  int total = 0;
  for (int i = 0; i < n; i++) {
    total += min(leftMax[i], rightMax[i]) - height[i];
  }
  return total;
}`,
            c: `/* pass n for array length; simple loops */
int trap(int* height, int n) {
  /* n is the given length */
  if (n == 0) return 0;
  int leftMax = /* array n */;
  int rightMax = /* array n */;
  leftMax[0] = height[0];
  for (int i = 1; i < n; i++) leftMax[i] = (leftMax[i - 1] > height[i] ? leftMax[i - 1] : height[i]);
  rightMax[n - 1] = height[n - 1];
  for (int i = n - 2; i >= 0; i--) rightMax[i] = (rightMax[i + 1] > height[i] ? rightMax[i + 1] : height[i]);
  int total = 0;
  for (int i = 0; i < n; i++) {
    total += (leftMax[i] < rightMax[i] ? leftMax[i] : rightMax[i]) - height[i];
  }
  return total;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "One pass from both ends. Only a handful of integers besides the input.\nHow it works: the side with the smaller max is the bottleneck. Add water there, then move that pointer and update that max. The other side is at least as tall, so it can hold this water.",
          code: `function trap(height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let total = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else total += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else total += rightMax - height[right];
      right--;
    }
  }
  return total;
}`,
          codes: {
            javascript: `function trap(height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let total = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else total += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else total += rightMax - height[right];
      right--;
    }
  }
  return total;
}`,
            python: `def trap(height):
    left = 0
    right = len(height) - 1
    leftMax = 0
    rightMax = 0
    total = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= leftMax: leftMax = height[left]
            else: total += leftMax - height[left]
            left += 1
        else:
            if height[right] >= rightMax: rightMax = height[right]
            else: total += rightMax - height[right]
            right -= 1
    return total`,
            java: `class Solution {
  public int trap(int[] height) {
    int left = 0;
    int right = height.length - 1;
    int leftMax = 0;
    int rightMax = 0;
    int total = 0;
    while (left < right) {
      if (height[left] < height[right]) {
        if (height[left] >= leftMax) leftMax = height[left];
        else total += leftMax - height[left];
        left++;
      } else {
        if (height[right] >= rightMax) rightMax = height[right];
        else total += rightMax - height[right];
        right--;
      }
    }
    return total;
  }
}`,
            cpp: `// vector, unordered_map, string
int trap(vector<int>& height) {
  int left = 0;
  int right = (int)height.size() - 1;
  int leftMax = 0;
  int rightMax = 0;
  int total = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else total += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else total += rightMax - height[right];
      right--;
    }
  }
  return total;
}`,
            c: `/* pass n for array length; simple loops */
int trap(int* height, int n) {
  int left = 0;
  int right = n - 1;
  int leftMax = 0;
  int rightMax = 0;
  int total = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else total += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else total += rightMax - height[right];
      right--;
    }
  }
  return total;
}`
          }
        }
      ]
    },
    {
      id: 12,
      level: "beginner",
      q: "Rotate Array",
      ask: "Amazon · Microsoft · Meta",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/rotate-array/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/rotate-array-by-n-elements-1587115621/1"}],
      a: "Rotate nums to the right by k steps. k can be larger than n; use k % n.\n\nExample: [1, 2, 3, 4, 5, 6, 7], k = 3 -> [5, 6, 7, 1, 2, 3, 4].\n\nRotating by one, k times, is easy and slow. An extra array placed at (i + k) % n is linear. Three reverses (whole list, then each half) do it in place.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n·k)",
          space: "O(1)",
          why: "Each single rotate copies n items. Doing that k times (after k %= n, still up to n-1 times) is O(n²) in the worst case.\nHow it works: save the last item, shift everyone right by one, put the saved item at index 0. Repeat k times.",
          code: `function rotate(nums, k) {
  const n = nums.length;
  if (n === 0) return nums;
  k = k % n;
  for (let step = 0; step < k; step++) {
    const last = nums[n - 1];
    for (let i = n - 1; i > 0; i--) nums[i] = nums[i - 1];
    nums[0] = last;
  }
  return nums;
}`,
          codes: {
            javascript: `function rotate(nums, k) {
  const n = nums.length;
  if (n === 0) return nums;
  k = k % n;
  for (let step = 0; step < k; step++) {
    const last = nums[n - 1];
    for (let i = n - 1; i > 0; i--) nums[i] = nums[i - 1];
    nums[0] = last;
  }
  return nums;
}`,
            python: `def rotate(nums, k):
    n = len(nums)
    if n == 0: return nums
    k = k % n
    for step in range(k):

        last = nums[n - 1]
        for i in range(n - 1, 0, -1):
            nums[i] = nums[i - 1]
        nums[0] = last

    return nums`,
            java: `class Solution {
  public int[] rotate(int[] nums, int k) {
    int n = nums.length;
    if (n == 0) return nums;
    k = k % n;
    for (int step = 0; step < k; step++) {
      int last = nums[n - 1];
      for (int i = n - 1; i > 0; i--) nums[i] = nums[i - 1];
      nums[0] = last;
    }
    return nums;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<int> rotate(vector<int>& nums, int k) {
  int n = (int)nums.size();
  if (n == 0) return nums;
  k = k % n;
  for (int step = 0; step < k; step++) {
    int last = nums[n - 1];
    for (int i = n - 1; i > 0; i--) nums[i] = nums[i - 1];
    nums[0] = last;
  }
  return nums;
}`,
            c: `/* pass n for array length; simple loops */
void rotate(int* nums, int n, int k) {
  /* n is the given length */
  if (n == 0) return nums;
  k = k % n;
  for (int step = 0; step < k; step++) {
    int last = nums[n - 1];
    for (int i = n - 1; i > 0; i--) nums[i] = nums[i - 1];
    nums[0] = last;
  }
  return nums;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "One extra array of length n, two linear copies.\nHow it works: extra[(i + k) % n] = nums[i], then copy extra back into nums.",
          code: `function rotate(nums, k) {
  const n = nums.length;
  if (n === 0) return nums;
  k = k % n;
  const extra = new Array(n);
  for (let i = 0; i < n; i++) extra[(i + k) % n] = nums[i];
  for (let i = 0; i < n; i++) nums[i] = extra[i];
  return nums;
}`,
          codes: {
            javascript: `function rotate(nums, k) {
  const n = nums.length;
  if (n === 0) return nums;
  k = k % n;
  const extra = new Array(n);
  for (let i = 0; i < n; i++) extra[(i + k) % n] = nums[i];
  for (let i = 0; i < n; i++) nums[i] = extra[i];
  return nums;
}`,
            python: `def rotate(nums, k):
    n = len(nums)
    if n == 0: return nums
    k = k % n
    extra = [None] * (n)
    for i in range(n):
        extra[(i + k) % n] = nums[i]
    for i in range(n):
        nums[i] = extra[i]
    return nums`,
            java: `class Solution {
  public int[] rotate(int[] nums, int k) {
    int n = nums.length;
    if (n == 0) return nums;
    k = k % n;
    int[] extra = new int[n];
    for (int i = 0; i < n; i++) extra[(i + k) % n] = nums[i];
    for (int i = 0; i < n; i++) nums[i] = extra[i];
    return nums;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<int> rotate(vector<int>& nums, int k) {
  int n = (int)nums.size();
  if (n == 0) return nums;
  k = k % n;
  vector<int> extra = vector<int>(n);
  for (int i = 0; i < n; i++) extra[(i + k) % n] = nums[i];
  for (int i = 0; i < n; i++) nums[i] = extra[i];
  return nums;
}`,
            c: `/* pass n for array length; simple loops */
void rotate(int* nums, int n, int k) {
  /* n is the given length */
  if (n == 0) return nums;
  k = k % n;
  int extra = /* array n */;
  for (int i = 0; i < n; i++) extra[(i + k) % n] = nums[i];
  for (int i = 0; i < n; i++) nums[i] = extra[i];
  return nums;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Each item is swapped a constant number of times. No extra list.\nHow it works: reverse the whole array, reverse the first k items, reverse the rest. That is the right rotation.",
          code: `function rotate(nums, k) {
  const n = nums.length;
  if (n === 0) return nums;
  k = k % n;

  function reverse(left, right) {
    while (left < right) {
      const t = nums[left];
      nums[left] = nums[right];
      nums[right] = t;
      left++;
      right--;
    }
  }

  reverse(0, n - 1);
  reverse(0, k - 1);
  reverse(k, n - 1);
  return nums;
}`,
          codes: {
            javascript: `function rotate(nums, k) {
  const n = nums.length;
  if (n === 0) return nums;
  k = k % n;

  function reverse(left, right) {
    while (left < right) {
      const t = nums[left];
      nums[left] = nums[right];
      nums[right] = t;
      left++;
      right--;
    }
  }

  reverse(0, n - 1);
  reverse(0, k - 1);
  reverse(k, n - 1);
  return nums;
}`,
            python: `def rotate(nums, k):
    n = len(nums)
    if n == 0: return nums
    k = k % n

    def reverse(left, right):
        while left < right:
            t = nums[left]
            nums[left] = nums[right]
            nums[right] = t
            left += 1
            right -= 1

    reverse(0, n - 1)
    reverse(0, k - 1)
    reverse(k, n - 1)
    return nums`,
            java: `class Solution {
  public int[] rotate(int[] nums, int k) {
    int n = nums.length;
    if (n == 0) return nums;
    k = k % n;

    public void reverse(left, right) {
      while (left < right) {
        int t = nums[left];
        nums[left] = nums[right];
        nums[right] = t;
        left++;
        right--;
      }
    }

    reverse(0, n - 1);
    reverse(0, k - 1);
    reverse(k, n - 1);
    return nums;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<int> rotate(vector<int>& nums, int k) {
  int n = (int)nums.size();
  if (n == 0) return nums;
  k = k % n;

  auto reverse = [&](left, right) {
    while (left < right) {
      int t = nums[left];
      nums[left] = nums[right];
      nums[right] = t;
      left++;
      right--;
    }
  }

  reverse(0, n - 1);
  reverse(0, k - 1);
  reverse(k, n - 1);
  return nums;
}`,
            c: `/* pass n for array length; simple loops */
void rotate(int* nums, int n, int k) {
  /* n is the given length */
  if (n == 0) return nums;
  k = k % n;

  void reverse(/* left, right */) {
    while (left < right) {
      int t = nums[left];
      nums[left] = nums[right];
      nums[right] = t;
      left++;
      right--;
    }
  }

  reverse(0, n - 1);
  reverse(0, k - 1);
  reverse(k, n - 1);
  return nums;
}`
          }
        }
      ]
    },
    {
      id: 13,
      level: "intermediate",
      q: "Set Matrix Zeroes",
      ask: "Amazon · Microsoft · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/set-matrix-zeroes/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/boolean-matrix-problem-1587115620/1"}],
      a: "If a cell is 0, set its whole row and whole column to 0. Do this using the original zeros, not the zeros you just wrote.\n\nExample: [[1, 1, 1], [1, 0, 1], [1, 1, 1]] becomes [[1, 0, 1], [0, 0, 0], [1, 0, 1]].\n\nA full copy of the matrix is the safe slow extra-memory version. Row and column boolean arrays are the usual O(m+n) extra. The first row and first column can store those flags, with two booleans for whether those lines started with a zero.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(m·n)",
          space: "O(m·n)",
          why: "You copy the whole grid so newly written zeros do not trigger more rows. Memory is the full matrix.\nHow it works: scan the copy; if copy[r][c] is 0, zero row r and column c in the original.",
          code: `function setZeroes(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const copy = [];
  for (let r = 0; r < rows; r++) copy.push(matrix[r].slice());
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (copy[r][c] === 0) {
        for (let x = 0; x < cols; x++) matrix[r][x] = 0;
        for (let y = 0; y < rows; y++) matrix[y][c] = 0;
      }
    }
  }
  return matrix;
}`,
          codes: {
            javascript: `function setZeroes(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const copy = [];
  for (let r = 0; r < rows; r++) copy.push(matrix[r].slice());
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (copy[r][c] === 0) {
        for (let x = 0; x < cols; x++) matrix[r][x] = 0;
        for (let y = 0; y < rows; y++) matrix[y][c] = 0;
      }
    }
  }
  return matrix;
}`,
            python: `def set_zeroes(matrix):
    rows = len(matrix)
    cols = matrix[0].length
    copy = []
    for r in range(rows):
        copy.append(matrix[r].slice())
    for r in range(rows):

        for c in range(cols):

            if copy[r][c] == 0:
                for x in range(cols):
                    matrix[r][x] = 0
                for y in range(rows):
                    matrix[y][c] = 0

    return matrix`,
            java: `class Solution {
  public void setZeroes(int[][] matrix) {
    int rows = matrix.length;
    int cols = matrix[0].length;
    List<Integer> copy = new ArrayList<>();
    for (int r = 0; r < rows; r++) copy.add(matrix[r].slice());
    for (int r = 0; r < rows; r++) {
      for (int c = 0; c < cols; c++) {
        if (copy[r][c] == 0) {
          for (int x = 0; x < cols; x++) matrix[r][x] = 0;
          for (int y = 0; y < rows; y++) matrix[y][c] = 0;
        }
      }
    }
    return matrix;
  }
}`,
            cpp: `// vector, unordered_map, string
void setZeroes(vector<vector<int>>& matrix) {
  int rows = (int)matrix.size();
  int cols = matrix[0].length;
  vector<int> copy;
  for (int r = 0; r < rows; r++) copy.push_back(matrix[r].slice());
  for (int r = 0; r < rows; r++) {
    for (int c = 0; c < cols; c++) {
      if (copy[r][c] == 0) {
        for (int x = 0; x < cols; x++) matrix[r][x] = 0;
        for (int y = 0; y < rows; y++) matrix[y][c] = 0;
      }
    }
  }
  return matrix;
}`,
            c: `/* pass n for array length; simple loops */
void setZeroes(int** matrix, int rows, int cols) {
  int rows = rows;
  int cols = matrix[0].length;
  int copy[1024]; int copy_n = 0;
  for (int r = 0; r < rows; r++) /* push */(matrix[r].slice());
  for (int r = 0; r < rows; r++) {
    for (int c = 0; c < cols; c++) {
      if (copy[r][c] == 0) {
        for (int x = 0; x < cols; x++) matrix[r][x] = 0;
        for (int y = 0; y < rows; y++) matrix[y][c] = 0;
      }
    }
  }
  return matrix;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(m·n)",
          space: "O(m + n)",
          why: "Two flag arrays instead of a full copy. Time is still a few passes over the grid.\nHow it works: mark which rows and columns contain a zero, then write zeros in a second pass.",
          code: `function setZeroes(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const zeroRow = new Array(rows).fill(false);
  const zeroCol = new Array(cols).fill(false);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c] === 0) {
        zeroRow[r] = true;
        zeroCol[c] = true;
      }
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (zeroRow[r] || zeroCol[c]) matrix[r][c] = 0;
    }
  }
  return matrix;
}`,
          codes: {
            javascript: `function setZeroes(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const zeroRow = new Array(rows).fill(false);
  const zeroCol = new Array(cols).fill(false);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c] === 0) {
        zeroRow[r] = true;
        zeroCol[c] = true;
      }
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (zeroRow[r] || zeroCol[c]) matrix[r][c] = 0;
    }
  }
  return matrix;
}`,
            python: `def set_zeroes(matrix):
    rows = len(matrix)
    cols = matrix[0].length
    zeroRow = [False] * rows
    zeroCol = [False] * cols
    for r in range(rows):

        for c in range(cols):

            if matrix[r][c] == 0:
                zeroRow[r] = True
                zeroCol[c] = True

    for r in range(rows):

        for c in range(cols):

            if zeroRow[r] or zeroCol[c]: matrix[r][c] = 0

    return matrix`,
            java: `class Solution {
  public void setZeroes(int[][] matrix) {
    int rows = matrix.length;
    int cols = matrix[0].length;
    boolean[] zeroRow = new boolean[rows];
    boolean[] zeroCol = new boolean[cols];
    for (int r = 0; r < rows; r++) {
      for (int c = 0; c < cols; c++) {
        if (matrix[r][c] == 0) {
          zeroRow[r] = true;
          zeroCol[c] = true;
        }
      }
    }
    for (int r = 0; r < rows; r++) {
      for (int c = 0; c < cols; c++) {
        if (zeroRow[r] || zeroCol[c]) matrix[r][c] = 0;
      }
    }
    return matrix;
  }
}`,
            cpp: `// vector, unordered_map, string
void setZeroes(vector<vector<int>>& matrix) {
  int rows = (int)matrix.size();
  int cols = matrix[0].length;
  vector<int> zeroRow = vector<int>(rows, 0);
  vector<int> zeroCol = vector<int>(cols, 0);
  for (int r = 0; r < rows; r++) {
    for (int c = 0; c < cols; c++) {
      if (matrix[r][c] == 0) {
        zeroRow[r] = true;
        zeroCol[c] = true;
      }
    }
  }
  for (int r = 0; r < rows; r++) {
    for (int c = 0; c < cols; c++) {
      if (zeroRow[r] || zeroCol[c]) matrix[r][c] = 0;
    }
  }
  return matrix;
}`,
            c: `/* pass n for array length; simple loops */
void setZeroes(int** matrix, int rows, int cols) {
  int rows = rows;
  int cols = matrix[0].length;
  int zeroRow = /* zeros rows */;
  int zeroCol = /* zeros cols */;
  for (int r = 0; r < rows; r++) {
    for (int c = 0; c < cols; c++) {
      if (matrix[r][c] == 0) {
        zeroRow[r] = 1;
        zeroCol[c] = 1;
      }
    }
  }
  for (int r = 0; r < rows; r++) {
    for (int c = 0; c < cols; c++) {
      if (zeroRow[r] || zeroCol[c]) matrix[r][c] = 0;
    }
  }
  return matrix;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(m·n)",
          space: "O(1)",
          why: "Flags live in the first row and first column. Only two extra booleans.\nHow it works: record whether row 0 and col 0 need to be cleared. For the rest, matrix[r][0] and matrix[0][c] mark zeros. Clear the interior, then the first row/col if needed.",
          code: `function setZeroes(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  let firstRow = false;
  let firstCol = false;
  for (let c = 0; c < cols; c++) if (matrix[0][c] === 0) firstRow = true;
  for (let r = 0; r < rows; r++) if (matrix[r][0] === 0) firstCol = true;
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (matrix[r][c] === 0) {
        matrix[r][0] = 0;
        matrix[0][c] = 0;
      }
    }
  }
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;
    }
  }
  if (firstRow) for (let c = 0; c < cols; c++) matrix[0][c] = 0;
  if (firstCol) for (let r = 0; r < rows; r++) matrix[r][0] = 0;
  return matrix;
}`,
          codes: {
            javascript: `function setZeroes(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  let firstRow = false;
  let firstCol = false;
  for (let c = 0; c < cols; c++) if (matrix[0][c] === 0) firstRow = true;
  for (let r = 0; r < rows; r++) if (matrix[r][0] === 0) firstCol = true;
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (matrix[r][c] === 0) {
        matrix[r][0] = 0;
        matrix[0][c] = 0;
      }
    }
  }
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;
    }
  }
  if (firstRow) for (let c = 0; c < cols; c++) matrix[0][c] = 0;
  if (firstCol) for (let r = 0; r < rows; r++) matrix[r][0] = 0;
  return matrix;
}`,
            python: `def set_zeroes(matrix):
    rows = len(matrix)
    cols = matrix[0].length
    firstRow = False
    firstCol = False
    for c in range(cols):
        if matrix[0][c] == 0: firstRow = True
    for r in range(rows):
        if matrix[r][0] == 0: firstCol = True
    for r in range(1, rows):

        for c in range(1, cols):

            if matrix[r][c] == 0:
                matrix[r][0] = 0
                matrix[0][c] = 0

    for r in range(1, rows):

        for c in range(1, cols):

            if matrix[r][0] == 0 or matrix[0][c] == 0: matrix[r][c] = 0

    if firstRow: for c in range(cols):
        matrix[0][c] = 0
    if firstCol: for r in range(rows):
        matrix[r][0] = 0
    return matrix`,
            java: `class Solution {
  public void setZeroes(int[][] matrix) {
    int rows = matrix.length;
    int cols = matrix[0].length;
    boolean firstRow = false;
    boolean firstCol = false;
    for (int c = 0; c < cols; c++) if (matrix[0][c] == 0) firstRow = true;
    for (int r = 0; r < rows; r++) if (matrix[r][0] == 0) firstCol = true;
    for (int r = 1; r < rows; r++) {
      for (int c = 1; c < cols; c++) {
        if (matrix[r][c] == 0) {
          matrix[r][0] = 0;
          matrix[0][c] = 0;
        }
      }
    }
    for (int r = 1; r < rows; r++) {
      for (int c = 1; c < cols; c++) {
        if (matrix[r][0] == 0 || matrix[0][c] == 0) matrix[r][c] = 0;
      }
    }
    if (firstRow) for (int c = 0; c < cols; c++) matrix[0][c] = 0;
    if (firstCol) for (int r = 0; r < rows; r++) matrix[r][0] = 0;
    return matrix;
  }
}`,
            cpp: `// vector, unordered_map, string
void setZeroes(vector<vector<int>>& matrix) {
  int rows = (int)matrix.size();
  int cols = matrix[0].length;
  bool firstRow = false;
  bool firstCol = false;
  for (int c = 0; c < cols; c++) if (matrix[0][c] == 0) firstRow = true;
  for (int r = 0; r < rows; r++) if (matrix[r][0] == 0) firstCol = true;
  for (int r = 1; r < rows; r++) {
    for (int c = 1; c < cols; c++) {
      if (matrix[r][c] == 0) {
        matrix[r][0] = 0;
        matrix[0][c] = 0;
      }
    }
  }
  for (int r = 1; r < rows; r++) {
    for (int c = 1; c < cols; c++) {
      if (matrix[r][0] == 0 || matrix[0][c] == 0) matrix[r][c] = 0;
    }
  }
  if (firstRow) for (int c = 0; c < cols; c++) matrix[0][c] = 0;
  if (firstCol) for (int r = 0; r < rows; r++) matrix[r][0] = 0;
  return matrix;
}`,
            c: `/* pass n for array length; simple loops */
void setZeroes(int** matrix, int rows, int cols) {
  int rows = rows;
  int cols = matrix[0].length;
  int firstRow = 0;
  int firstCol = 0;
  for (int c = 0; c < cols; c++) if (matrix[0][c] == 0) firstRow = 1;
  for (int r = 0; r < rows; r++) if (matrix[r][0] == 0) firstCol = 1;
  for (int r = 1; r < rows; r++) {
    for (int c = 1; c < cols; c++) {
      if (matrix[r][c] == 0) {
        matrix[r][0] = 0;
        matrix[0][c] = 0;
      }
    }
  }
  for (int r = 1; r < rows; r++) {
    for (int c = 1; c < cols; c++) {
      if (matrix[r][0] == 0 || matrix[0][c] == 0) matrix[r][c] = 0;
    }
  }
  if (firstRow) for (int c = 0; c < cols; c++) matrix[0][c] = 0;
  if (firstCol) for (int r = 0; r < rows; r++) matrix[r][0] = 0;
  return matrix;
}`
          }
        }
      ]
    },
    {
      id: 14,
      level: "intermediate",
      q: "Spiral Matrix",
      ask: "Amazon · Microsoft · Google · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/spiral-matrix/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/spirally-traversing-a-matrix-1587115621/1"}],
      a: "Walk the matrix in spiral order: right, down, left, up, and repeat. Return the values in that order.\n\nExample: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] -> [1, 2, 3, 6, 9, 8, 7, 4, 5].\n\nA visited grid plus four direction vectors is the straightforward walk. Shrinking top/bottom/left/right bounds needs no visited flags. One loop with a direction index can turn at the edge of the remaining box.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(m·n)",
          space: "O(m·n)",
          why: "You still visit each cell once, but a boolean grid of the same size is extra memory.\nHow it works: start at (0,0) facing right. If the next cell is out of bounds or visited, turn right. Push each value.",
          code: `function spiralOrder(matrix) {
  if (!matrix.length) return [];
  const rows = matrix.length;
  const cols = matrix[0].length;
  const seen = [];
  for (let r = 0; r < rows; r++) seen.push(new Array(cols).fill(false));
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  const out = [];
  let r = 0;
  let c = 0;
  let d = 0;
  for (let k = 0; k < rows * cols; k++) {
    out.push(matrix[r][c]);
    seen[r][c] = true;
    const nr = r + dirs[d][0];
    const nc = c + dirs[d][1];
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || seen[nr][nc]) {
      d = (d + 1) % 4;
    }
    r += dirs[d][0];
    c += dirs[d][1];
  }
  return out;
}`,
          codes: {
            javascript: `function spiralOrder(matrix) {
  if (!matrix.length) return [];
  const rows = matrix.length;
  const cols = matrix[0].length;
  const seen = [];
  for (let r = 0; r < rows; r++) seen.push(new Array(cols).fill(false));
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  const out = [];
  let r = 0;
  let c = 0;
  let d = 0;
  for (let k = 0; k < rows * cols; k++) {
    out.push(matrix[r][c]);
    seen[r][c] = true;
    const nr = r + dirs[d][0];
    const nc = c + dirs[d][1];
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || seen[nr][nc]) {
      d = (d + 1) % 4;
    }
    r += dirs[d][0];
    c += dirs[d][1];
  }
  return out;
}`,
            python: `def spiral_order(matrix):
    if not len(matrix): return []
    rows = len(matrix)
    cols = matrix[0].length
    seen = []
    for r in range(rows):
        seen.append([False] * cols)
    dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]
    out = []
    r = 0
    c = 0
    d = 0
    for k in range(rows * cols):

        out.append(matrix[r][c])
        seen[r][c] = True
        nr = r + dirs[d][0]
        nc = c + dirs[d][1]
        if nr < 0 or nr >= rows or nc < 0 or nc >= cols or seen[nr][nc]:
            d = (d + 1) % 4
        r += dirs[d][0]
        c += dirs[d][1]

    return out`,
            java: `class Solution {
  public List<Integer> spiralOrder(int[][] matrix) {
    if (!matrix.length) return new ArrayList<>();
    int rows = matrix.length;
    int cols = matrix[0].length;
    List<Integer> seen = new ArrayList<>();
    for (int r = 0; r < rows; r++) seen.add(new boolean[cols]);
    int dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    List<Integer> out = new ArrayList<>();
    int r = 0;
    int c = 0;
    int d = 0;
    for (int k = 0; k < rows * cols; k++) {
      out.add(matrix[r][c]);
      seen[r][c] = true;
      int nr = r + dirs[d][0];
      int nc = c + dirs[d][1];
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || seen[nr][nc]) {
        d = (d + 1) % 4;
      }
      r += dirs[d][0];
      c += dirs[d][1];
    }
    return out;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<int> spiralOrder(vector<vector<int>>& matrix) {
  if (!(int)matrix.size()) return {};
  int rows = (int)matrix.size();
  int cols = matrix[0].length;
  vector<int> seen;
  for (int r = 0; r < rows; r++) seen.push_back(vector<int>(cols, 0));
  int dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  vector<int> out;
  int r = 0;
  int c = 0;
  int d = 0;
  for (int k = 0; k < rows * cols; k++) {
    out.push_back(matrix[r][c]);
    seen[r][c] = true;
    int nr = r + dirs[d][0];
    int nc = c + dirs[d][1];
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || seen[nr][nc]) {
      d = (d + 1) % 4;
    }
    r += dirs[d][0];
    c += dirs[d][1];
  }
  return out;
}`,
            c: `/* pass n for array length; simple loops */
int spiralOrder(int** matrix, int rows, int cols, int* out) {
  if (!rows) return 0;
  int rows = rows;
  int cols = matrix[0].length;
  int seen[1024]; int seen_n = 0;
  for (int r = 0; r < rows; r++) /* push */(/* zeros cols */);
  int dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  int out[1024]; int out_n = 0;
  int r = 0;
  int c = 0;
  int d = 0;
  for (int k = 0; k < rows * cols; k++) {
    /* push */(matrix[r][c]);
    seen[r][c] = 1;
    int nr = r + dirs[d][0];
    int nc = c + dirs[d][1];
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || seen[nr][nc]) {
      d = (d + 1) % 4;
    }
    r += dirs[d][0];
    c += dirs[d][1];
  }
  return out;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(m·n)",
          space: "O(1)",
          why: "Output list is required. Extra memory is a few bound integers, treated as O(1).\nHow it works: peel a layer: walk top row left->right, right col top->bottom, bottom row right->left, left col bottom->top, then shrink the four bounds.",
          code: `function spiralOrder(matrix) {
  if (!matrix.length) return [];
  const out = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) out.push(matrix[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) out.push(matrix[r][right]);
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) out.push(matrix[bottom][c]);
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) out.push(matrix[r][left]);
      left++;
    }
  }
  return out;
}`,
          codes: {
            javascript: `function spiralOrder(matrix) {
  if (!matrix.length) return [];
  const out = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) out.push(matrix[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) out.push(matrix[r][right]);
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) out.push(matrix[bottom][c]);
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) out.push(matrix[r][left]);
      left++;
    }
  }
  return out;
}`,
            python: `def spiral_order(matrix):
    if not len(matrix): return []
    out = []
    top = 0
    bottom = len(matrix) - 1
    left = 0
    right = matrix[0].length - 1
    while top <= bottom and left <= right:
        for c in range(left, = right):
            out.append(matrix[top][c])
        top += 1
        for r in range(top, = bottom):
            out.append(matrix[r][right])
        right -= 1
        if top <= bottom:
            for c in range(right, (left) - 1, -1):
                out.append(matrix[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, (top) - 1, -1):
                out.append(matrix[r][left])
            left += 1
    return out`,
            java: `class Solution {
  public List<Integer> spiralOrder(int[][] matrix) {
    if (!matrix.length) return new ArrayList<>();
    List<Integer> out = new ArrayList<>();
    int top = 0;
    int bottom = matrix.length - 1;
    int left = 0;
    int right = matrix[0].length - 1;
    while (top <= bottom && left <= right) {
      for (int c = left; c <= right; c++) out.add(matrix[top][c]);
      top++;
      for (int r = top; r <= bottom; r++) out.add(matrix[r][right]);
      right--;
      if (top <= bottom) {
        for (int c = right; c >= left; c--) out.add(matrix[bottom][c]);
        bottom--;
      }
      if (left <= right) {
        for (int r = bottom; r >= top; r--) out.add(matrix[r][left]);
        left++;
      }
    }
    return out;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<int> spiralOrder(vector<vector<int>>& matrix) {
  if (!(int)matrix.size()) return {};
  vector<int> out;
  int top = 0;
  int bottom = (int)matrix.size() - 1;
  int left = 0;
  int right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (int c = left; c <= right; c++) out.push_back(matrix[top][c]);
    top++;
    for (int r = top; r <= bottom; r++) out.push_back(matrix[r][right]);
    right--;
    if (top <= bottom) {
      for (int c = right; c >= left; c--) out.push_back(matrix[bottom][c]);
      bottom--;
    }
    if (left <= right) {
      for (int r = bottom; r >= top; r--) out.push_back(matrix[r][left]);
      left++;
    }
  }
  return out;
}`,
            c: `/* pass n for array length; simple loops */
int spiralOrder(int** matrix, int rows, int cols, int* out) {
  if (!rows) return 0;
  int out[1024]; int out_n = 0;
  int top = 0;
  int bottom = rows - 1;
  int left = 0;
  int right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (int c = left; c <= right; c++) /* push */(matrix[top][c]);
    top++;
    for (int r = top; r <= bottom; r++) /* push */(matrix[r][right]);
    right--;
    if (top <= bottom) {
      for (int c = right; c >= left; c--) /* push */(matrix[bottom][c]);
      bottom--;
    }
    if (left <= right) {
      for (int r = bottom; r >= top; r--) /* push */(matrix[r][left]);
      left++;
    }
  }
  return out;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(m·n)",
          space: "O(1)",
          why: "Same bounds idea in one counted loop: visit exactly rows*cols cells, turn when the next step would leave the remaining rectangle.\nHow it works: after a turn, shrink the bound you just finished (top, right, bottom, or left) so the next lap is the inner layer.",
          code: `function spiralOrder(matrix) {
  if (!matrix.length) return [];
  const rows = matrix.length;
  const cols = matrix[0].length;
  const out = [];
  let top = 0;
  let bottom = rows - 1;
  let left = 0;
  let right = cols - 1;
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  let d = 0;
  let r = 0;
  let c = 0;
  for (let k = 0; k < rows * cols; k++) {
    out.push(matrix[r][c]);
    const nr = r + dirs[d][0];
    const nc = c + dirs[d][1];
    if (nr < top || nr > bottom || nc < left || nc > right) {
      if (d === 0) top++;
      else if (d === 1) right--;
      else if (d === 2) bottom--;
      else left++;
      d = (d + 1) % 4;
      r += dirs[d][0];
      c += dirs[d][1];
    } else {
      r = nr;
      c = nc;
    }
  }
  return out;
}`,
          codes: {
            javascript: `function spiralOrder(matrix) {
  if (!matrix.length) return [];
  const rows = matrix.length;
  const cols = matrix[0].length;
  const out = [];
  let top = 0;
  let bottom = rows - 1;
  let left = 0;
  let right = cols - 1;
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  let d = 0;
  let r = 0;
  let c = 0;
  for (let k = 0; k < rows * cols; k++) {
    out.push(matrix[r][c]);
    const nr = r + dirs[d][0];
    const nc = c + dirs[d][1];
    if (nr < top || nr > bottom || nc < left || nc > right) {
      if (d === 0) top++;
      else if (d === 1) right--;
      else if (d === 2) bottom--;
      else left++;
      d = (d + 1) % 4;
      r += dirs[d][0];
      c += dirs[d][1];
    } else {
      r = nr;
      c = nc;
    }
  }
  return out;
}`,
            python: `def spiral_order(matrix):
    if not len(matrix): return []
    rows = len(matrix)
    cols = matrix[0].length
    out = []
    top = 0
    bottom = rows - 1
    left = 0
    right = cols - 1
    dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]
    d = 0
    r = 0
    c = 0
    for k in range(rows * cols):

        out.append(matrix[r][c])
        nr = r + dirs[d][0]
        nc = c + dirs[d][1]
        if nr < top or nr > bottom or nc < left or nc > right:
            if d == 0: top += 1
            elif d == 1: right -= 1
            elif d == 2: bottom -= 1
            else: left += 1
            d = (d + 1) % 4
            r += dirs[d][0]
            c += dirs[d][1]
        else:
            r = nr
            c = nc

    return out`,
            java: `class Solution {
  public List<Integer> spiralOrder(int[][] matrix) {
    if (!matrix.length) return new ArrayList<>();
    int rows = matrix.length;
    int cols = matrix[0].length;
    List<Integer> out = new ArrayList<>();
    int top = 0;
    int bottom = rows - 1;
    int left = 0;
    int right = cols - 1;
    int dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    int d = 0;
    int r = 0;
    int c = 0;
    for (int k = 0; k < rows * cols; k++) {
      out.add(matrix[r][c]);
      int nr = r + dirs[d][0];
      int nc = c + dirs[d][1];
      if (nr < top || nr > bottom || nc < left || nc > right) {
        if (d == 0) top++;
        else if (d == 1) right--;
        else if (d == 2) bottom--;
        else left++;
        d = (d + 1) % 4;
        r += dirs[d][0];
        c += dirs[d][1];
      } else {
        r = nr;
        c = nc;
      }
    }
    return out;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<int> spiralOrder(vector<vector<int>>& matrix) {
  if (!(int)matrix.size()) return {};
  int rows = (int)matrix.size();
  int cols = matrix[0].length;
  vector<int> out;
  int top = 0;
  int bottom = rows - 1;
  int left = 0;
  int right = cols - 1;
  int dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  int d = 0;
  int r = 0;
  int c = 0;
  for (int k = 0; k < rows * cols; k++) {
    out.push_back(matrix[r][c]);
    int nr = r + dirs[d][0];
    int nc = c + dirs[d][1];
    if (nr < top || nr > bottom || nc < left || nc > right) {
      if (d == 0) top++;
      else if (d == 1) right--;
      else if (d == 2) bottom--;
      else left++;
      d = (d + 1) % 4;
      r += dirs[d][0];
      c += dirs[d][1];
    } else {
      r = nr;
      c = nc;
    }
  }
  return out;
}`,
            c: `/* pass n for array length; simple loops */
int spiralOrder(int** matrix, int rows, int cols, int* out) {
  if (!rows) return 0;
  int rows = rows;
  int cols = matrix[0].length;
  int out[1024]; int out_n = 0;
  int top = 0;
  int bottom = rows - 1;
  int left = 0;
  int right = cols - 1;
  int dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  int d = 0;
  int r = 0;
  int c = 0;
  for (int k = 0; k < rows * cols; k++) {
    /* push */(matrix[r][c]);
    int nr = r + dirs[d][0];
    int nc = c + dirs[d][1];
    if (nr < top || nr > bottom || nc < left || nc > right) {
      if (d == 0) top++;
      else if (d == 1) right--;
      else if (d == 2) bottom--;
      else left++;
      d = (d + 1) % 4;
      r += dirs[d][0];
      c += dirs[d][1];
    } else {
      r = nr;
      c = nc;
    }
  }
  return out;
}`
          }
        }
      ]
    },
    {
      id: 15,
      level: "intermediate",
      q: "Next Permutation",
      ask: "Google · Meta · Amazon · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/next-permutation/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/next-permutation5226/1"}],
      a: "Rearrange nums into the next larger permutation in lexicographic order. If it is already the last permutation, wrap to the smallest (sorted ascending). Modify the array in place.\n\nExample: [1, 2, 3] -> [1, 3, 2]. Example: [3, 2, 1] -> [1, 2, 3].\n\nGenerating every permutation, sorting them, and picking the next is complete and huge. Finding the pivot then sorting the suffix is better. Finding the pivot, swapping with the next larger suffix value, and reversing the suffix is linear.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n! · n)",
          space: "O(n! · n)",
          why: "All unique permutations are generated and stored. n! grows immediately out of interview time limits.\nHow it works: backtracking builds every perm. Sort the bag lexicographically. Find the current sequence and copy the next one (or the first) back into nums.",
          code: `function nextPermutation(nums) {
  const n = nums.length;
  const start = nums.slice();
  const bag = [];

  function permute(arr, from) {
    if (from === n) {
      bag.push(arr.slice());
      return;
    }
    const used = new Set();
    for (let i = from; i < n; i++) {
      if (used.has(arr[i])) continue;
      used.add(arr[i]);
      const t = arr[from];
      arr[from] = arr[i];
      arr[i] = t;
      permute(arr, from + 1);
      arr[i] = arr[from];
      arr[from] = t;
    }
  }

  permute(nums.slice(), 0);
  bag.sort(function (a, b) {
    for (let i = 0; i < n; i++) {
      if (a[i] !== b[i]) return a[i] - b[i];
    }
    return 0;
  });

  let idx = 0;
  for (let i = 0; i < bag.length; i++) {
    let same = true;
    for (let j = 0; j < n; j++) {
      if (bag[i][j] !== start[j]) { same = false; break; }
    }
    if (same) { idx = i; break; }
  }
  const next = bag[(idx + 1) % bag.length];
  for (let i = 0; i < n; i++) nums[i] = next[i];
  return nums;
}`,
          codes: {
            javascript: `function nextPermutation(nums) {
  const n = nums.length;
  const start = nums.slice();
  const bag = [];

  function permute(arr, from) {
    if (from === n) {
      bag.push(arr.slice());
      return;
    }
    const used = new Set();
    for (let i = from; i < n; i++) {
      if (used.has(arr[i])) continue;
      used.add(arr[i]);
      const t = arr[from];
      arr[from] = arr[i];
      arr[i] = t;
      permute(arr, from + 1);
      arr[i] = arr[from];
      arr[from] = t;
    }
  }

  permute(nums.slice(), 0);
  bag.sort(function (a, b) {
    for (let i = 0; i < n; i++) {
      if (a[i] !== b[i]) return a[i] - b[i];
    }
    return 0;
  });

  let idx = 0;
  for (let i = 0; i < bag.length; i++) {
    let same = true;
    for (let j = 0; j < n; j++) {
      if (bag[i][j] !== start[j]) { same = false; break; }
    }
    if (same) { idx = i; break; }
  }
  const next = bag[(idx + 1) % bag.length];
  for (let i = 0; i < n; i++) nums[i] = next[i];
  return nums;
}`,
            python: `def next_permutation(nums):
    n = len(nums)
    start = nums[:]
    bag = []

    def permute(arr, start):
        if start == n:
            bag.append(arr[:])
            return
        used = set()
        for i in range(start, n):

            if arr[i] in used: continue
            used.add(arr[i])
            t = arr[start]
            arr[start] = arr[i]
            arr[i] = t
            permute(arr, start + 1)
            arr[i] = arr[start]
            arr[start] = t

    permute(nums[:], 0)
    bag.sort()

    idx = 0
    for i in range(len(bag)):

        same = True
        for j in range(n):

            if bag[i][j] != start[j]:
                same = False
                break

        if same:
            idx = i
            break

    next = bag[(idx + 1) % len(bag)]
    for i in range(n):
        nums[i] = next[i]
    return nums`,
            java: `class Solution {
  public void nextPermutation(int[] nums) {
    int n = nums.length;
    int[] start = nums.clone();
    List<Integer> bag = new ArrayList<>();

    public void permute(arr, from) {
      if (from == n) {
        bag.add(arr.clone());
        return;
      }
      Set<Integer> used = new HashSet<>();
      for (int i = from; i < n; i++) {
        if (used.contains(arr[i])) continue;
        used.add(arr[i]);
        int t = arr[from];
        arr[from] = arr[i];
        arr[i] = t;
        permute(arr, from + 1);
        arr[i] = arr[from];
        arr[from] = t;
      }
    }

    permute(nums.clone(), 0);
    bag.__SORTLEX();

    int idx = 0;
    for (int i = 0; i < bag.size(); i++) {
      boolean same = true;
      for (int j = 0; j < n; j++) {
        if (bag[i][j] != start[j]) {
          same = false;
          break;
        }
      }
      if (same) {
          idx = i;
          break;
        }
    }
    int next = bag[(idx + 1) % bag.size()];
    for (int i = 0; i < n; i++) nums[i] = next[i];
    return nums;
  }
}`,
            cpp: `// vector, unordered_map, string
void nextPermutation(vector<int>& nums) {
  int n = (int)nums.size();
  vector<int> start = vector<int>(nums);
  vector<int> bag;

  auto permute = [&](arr, from) {
    if (from == n) {
      bag.push_back(vector<int>(arr));
      return;
    }
    unordered_set<int> used;
    for (int i = from; i < n; i++) {
      if (used.count(arr[i])) continue;
      used.insert(arr[i]);
      int t = arr[from];
      arr[from] = arr[i];
      arr[i] = t;
      permute(arr, from + 1);
      arr[i] = arr[from];
      arr[from] = t;
    }
  }

  permute(vector<int>(nums), 0);
  bag.__SORTLEX();

  int idx = 0;
  for (int i = 0; i < (int)bag.size(); i++) {
    bool same = true;
    for (int j = 0; j < n; j++) {
      if (bag[i][j] != start[j]) {
        same = false;
        break;
      }
    }
    if (same) {
        idx = i;
        break;
      }
  }
  int next = bag[(idx + 1) % (int)bag.size()];
  for (int i = 0; i < n; i++) nums[i] = next[i];
  return nums;
}`,
            c: `/* pass n for array length; simple loops */
/* linear scan stands in for a hash map */
int map_find(int* keys, int used, int key) {
  int i;
  for (i = 0; i < used; i++) if (keys[i] == key) return i;
  return -1;
}
void nextPermutation(int* nums, int n) {
  /* n is the given length */
  int start = nums;
  int bag[1024]; int bag_n = 0;

  void permute(/* arr, from */) {
    if (from == n) {
      /* push */(arr);
      return;
    }
    int used_keys[1024]; int used_n = 0;
    for (int i = from; i < n; i++) {
      if (map_find(used_keys, used_n, arr[i]) >= 0) continue;
      /* add */;
      int t = arr[from];
      arr[from] = arr[i];
      arr[i] = t;
      permute(arr, from + 1);
      arr[i] = arr[from];
      arr[from] = t;
    }
  }

  permute(nums, 0);
  bag.__SORTLEX();

  int idx = 0;
  for (int i = 0; i < bag_len; i++) {
    int same = 1;
    for (int j = 0; j < n; j++) {
      if (bag[i][j] != start[j]) {
        same = 0;
        break;
      }
    }
    if (same) {
        idx = i;
        break;
      }
  }
  int next = bag[(idx + 1) % bag_len];
  for (int i = 0; i < n; i++) nums[i] = next[i];
  return nums;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n log n)",
          space: "O(1)",
          why: "One reverse scan for the pivot, then a sort of the suffix. Sort of n items is the extra log factor.\nHow it works: find the rightmost i with nums[i] < nums[i+1]. Find the smallest value to the right that is still larger than nums[i], swap, then sort the suffix ascending.",
          code: `function nextPermutation(nums) {
  const n = nums.length;
  let i = n - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;
  if (i >= 0) {
    let j = n - 1;
    while (nums[j] <= nums[i]) j--;
    const t = nums[i];
    nums[i] = nums[j];
    nums[j] = t;
  }
  const suffix = nums.slice(i + 1).sort(function (a, b) { return a - b; });
  for (let k = 0; k < suffix.length; k++) nums[i + 1 + k] = suffix[k];
  return nums;
}`,
          codes: {
            javascript: `function nextPermutation(nums) {
  const n = nums.length;
  let i = n - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;
  if (i >= 0) {
    let j = n - 1;
    while (nums[j] <= nums[i]) j--;
    const t = nums[i];
    nums[i] = nums[j];
    nums[j] = t;
  }
  const suffix = nums.slice(i + 1).sort(function (a, b) { return a - b; });
  for (let k = 0; k < suffix.length; k++) nums[i + 1 + k] = suffix[k];
  return nums;
}`,
            python: `def next_permutation(nums):
    n = len(nums)
    i = n - 2
    while i >= 0 and nums[i] >= nums[i + 1]: i -= 1
    if i >= 0:
        j = n - 1
        while nums[j] <= nums[i]: j -= 1
        t = nums[i]
        nums[i] = nums[j]
        nums[j] = t
    suffix = nums[i + 1:].sort()
    for k in range(len(suffix)):
        nums[i + 1 + k] = suffix[k]
    return nums`,
            java: `class Solution {
  public void nextPermutation(int[] nums) {
    int n = nums.length;
    int i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--;
    if (i >= 0) {
      int j = n - 1;
      while (nums[j] <= nums[i]) j--;
      int t = nums[i];
      nums[i] = nums[j];
      nums[j] = t;
    }
    int[] suffix = nums.clone();
    Arrays.sort(suffix);
    for (int k = 0; k < suffix.length; k++) nums[i + 1 + k] = suffix[k];
    return nums;
  }
}`,
            cpp: `// vector, unordered_map, string
void nextPermutation(vector<int>& nums) {
  int n = (int)nums.size();
  int i = n - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;
  if (i >= 0) {
    int j = n - 1;
    while (nums[j] <= nums[i]) j--;
    int t = nums[i];
    nums[i] = nums[j];
    nums[j] = t;
  }
  vector<int> suffix = nums;
  sort(suffix.begin(), suffix.end());
  for (int k = 0; k < (int)suffix.size(); k++) nums[i + 1 + k] = suffix[k];
  return nums;
}`,
            c: `/* pass n for array length; simple loops */
void nextPermutation(int* nums, int n) {
  /* n is the given length */
  int i = n - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;
  if (i >= 0) {
    int j = n - 1;
    while (nums[j] <= nums[i]) j--;
    int t = nums[i];
    nums[i] = nums[j];
    nums[j] = t;
  }
  int suffix = /* slice nums */./* sort */;
  for (int k = 0; k < suffix_len; k++) nums[i + 1 + k] = suffix[k];
  return nums;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "The suffix is already non-increasing, so reverse is enough instead of sort.\nHow it works: same pivot and swap. Reverse nums[i+1 .. end] in place.",
          code: `function nextPermutation(nums) {
  const n = nums.length;
  let i = n - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;

  function reverse(left, right) {
    while (left < right) {
      const t = nums[left];
      nums[left] = nums[right];
      nums[right] = t;
      left++;
      right--;
    }
  }

  if (i >= 0) {
    let j = n - 1;
    while (nums[j] <= nums[i]) j--;
    const t = nums[i];
    nums[i] = nums[j];
    nums[j] = t;
  }
  reverse(i + 1, n - 1);
  return nums;
}`,
          codes: {
            javascript: `function nextPermutation(nums) {
  const n = nums.length;
  let i = n - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;

  function reverse(left, right) {
    while (left < right) {
      const t = nums[left];
      nums[left] = nums[right];
      nums[right] = t;
      left++;
      right--;
    }
  }

  if (i >= 0) {
    let j = n - 1;
    while (nums[j] <= nums[i]) j--;
    const t = nums[i];
    nums[i] = nums[j];
    nums[j] = t;
  }
  reverse(i + 1, n - 1);
  return nums;
}`,
            python: `def next_permutation(nums):
    n = len(nums)
    i = n - 2
    while i >= 0 and nums[i] >= nums[i + 1]: i -= 1

    def reverse(left, right):
        while left < right:
            t = nums[left]
            nums[left] = nums[right]
            nums[right] = t
            left += 1
            right -= 1

    if i >= 0:
        j = n - 1
        while nums[j] <= nums[i]: j -= 1
        t = nums[i]
        nums[i] = nums[j]
        nums[j] = t
    reverse(i + 1, n - 1)
    return nums`,
            java: `class Solution {
  public void nextPermutation(int[] nums) {
    int n = nums.length;
    int i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--;

    public void reverse(left, right) {
      while (left < right) {
        int t = nums[left];
        nums[left] = nums[right];
        nums[right] = t;
        left++;
        right--;
      }
    }

    if (i >= 0) {
      int j = n - 1;
      while (nums[j] <= nums[i]) j--;
      int t = nums[i];
      nums[i] = nums[j];
      nums[j] = t;
    }
    reverse(i + 1, n - 1);
    return nums;
  }
}`,
            cpp: `// vector, unordered_map, string
void nextPermutation(vector<int>& nums) {
  int n = (int)nums.size();
  int i = n - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;

  auto reverse = [&](left, right) {
    while (left < right) {
      int t = nums[left];
      nums[left] = nums[right];
      nums[right] = t;
      left++;
      right--;
    }
  }

  if (i >= 0) {
    int j = n - 1;
    while (nums[j] <= nums[i]) j--;
    int t = nums[i];
    nums[i] = nums[j];
    nums[j] = t;
  }
  reverse(i + 1, n - 1);
  return nums;
}`,
            c: `/* pass n for array length; simple loops */
void nextPermutation(int* nums, int n) {
  /* n is the given length */
  int i = n - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;

  void reverse(/* left, right */) {
    while (left < right) {
      int t = nums[left];
      nums[left] = nums[right];
      nums[right] = t;
      left++;
      right--;
    }
  }

  if (i >= 0) {
    int j = n - 1;
    while (nums[j] <= nums[i]) j--;
    int t = nums[i];
    nums[i] = nums[j];
    nums[j] = t;
  }
  reverse(i + 1, n - 1);
  return nums;
}`
          }
        }
      ]
    },
    {
      id: 16,
      level: "intermediate",
      q: "Sort Colors (Dutch flag)",
      ask: "Amazon · Microsoft · Meta · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/sort-colors/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1"}],
      a: "nums contains only 0, 1, and 2. Sort it in place so the 0s come first, then 1s, then 2s.\n\nExample: [2, 0, 2, 1, 1, 0] -> [0, 0, 1, 1, 2, 2].\n\nA normal sort works and hides the structure. Counting 0/1/2 then overwriting is two passes. The Dutch-flag three pointers finish in one pass.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n log n)",
          space: "O(n)",
          why: "Generic sort does not use the fact there are only three values. Engine sort also uses extra memory.\nHow it works: nums.sort with a numeric comparator. Correct, but not the point of the problem.",
          code: `function sortColors(nums) {
  nums.sort(function (a, b) { return a - b; });
  return nums;
}`,
          codes: {
            javascript: `function sortColors(nums) {
  nums.sort(function (a, b) { return a - b; });
  return nums;
}`,
            python: `def sort_colors(nums):
    nums.sort()
    return nums`,
            java: `class Solution {
  public int[] sortColors(int[] nums) {
    Arrays.sort(nums);
    return nums;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<int> sortColors(vector<int>& nums) {
  sort(nums.begin(), nums.end());
  return nums;
}`,
            c: `/* pass n for array length; simple loops */
void sortColors(int* nums, int n) {
  /* sort nums */;
  return nums;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Two linear passes and three counters. Extra memory is three integers.\nHow it works: count zeros, ones, and twos. Write that many 0s, then 1s, then 2s into nums.",
          code: `function sortColors(nums) {
  let zeros = 0;
  let ones = 0;
  let twos = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 0) zeros++;
    else if (nums[i] === 1) ones++;
    else twos++;
  }
  let i = 0;
  while (zeros--) nums[i++] = 0;
  while (ones--) nums[i++] = 1;
  while (twos--) nums[i++] = 2;
  return nums;
}`,
          codes: {
            javascript: `function sortColors(nums) {
  let zeros = 0;
  let ones = 0;
  let twos = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 0) zeros++;
    else if (nums[i] === 1) ones++;
    else twos++;
  }
  let i = 0;
  while (zeros--) nums[i++] = 0;
  while (ones--) nums[i++] = 1;
  while (twos--) nums[i++] = 2;
  return nums;
}`,
            python: `def sort_colors(nums):
    zeros = 0
    ones = 0
    twos = 0
    for i in range(len(nums)):

        if nums[i] == 0: zeros += 1
        elif nums[i] == 1: ones += 1
        else: twos += 1

    i = 0
    while zeros > 0: { zeros -= 1 nums[i] = 0 i += 1 }
    while ones > 0: { ones -= 1 nums[i] = 1 i += 1 }
    while twos > 0: { twos -= 1 nums[i] = 2 i += 1 }
    return nums`,
            java: `class Solution {
  public int[] sortColors(int[] nums) {
    int zeros = 0;
    int ones = 0;
    int twos = 0;
    for (int i = 0; i < nums.length; i++) {
      if (nums[i] == 0) zeros++;
      else if (nums[i] == 1) ones++;
      else twos++;
    }
    int i = 0;
    while (zeros > 0) { zeros--; nums[i] = 0; i++; }
    while (ones > 0) { ones--; nums[i] = 1; i++; }
    while (twos > 0) { twos--; nums[i] = 2; i++; }
    return nums;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<int> sortColors(vector<int>& nums) {
  int zeros = 0;
  int ones = 0;
  int twos = 0;
  for (int i = 0; i < (int)nums.size(); i++) {
    if (nums[i] == 0) zeros++;
    else if (nums[i] == 1) ones++;
    else twos++;
  }
  int i = 0;
  while (zeros > 0) { zeros--; nums[i] = 0; i++; }
  while (ones > 0) { ones--; nums[i] = 1; i++; }
  while (twos > 0) { twos--; nums[i] = 2; i++; }
  return nums;
}`,
            c: `/* pass n for array length; simple loops */
void sortColors(int* nums, int n) {
  int zeros = 0;
  int ones = 0;
  int twos = 0;
  for (int i = 0; i < n; i++) {
    if (nums[i] == 0) zeros++;
    else if (nums[i] == 1) ones++;
    else twos++;
  }
  int i = 0;
  while (zeros > 0) { zeros--; nums[i] = 0; i++; }
  while (ones > 0) { ones--; nums[i] = 1; i++; }
  while (twos > 0) { twos--; nums[i] = 2; i++; }
  return nums;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "One pass, constant extra memory. Each index is visited a constant number of times.\nHow it works: low writes 0s, high writes 2s, mid walks. After a swap with high, mid stays so the swapped-in value is classified.",
          code: `function sortColors(nums) {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      const t = nums[low];
      nums[low] = nums[mid];
      nums[mid] = t;
      low++;
      mid++;
    } else if (nums[mid] === 2) {
      const t = nums[high];
      nums[high] = nums[mid];
      nums[mid] = t;
      high--;
    } else {
      mid++;
    }
  }
  return nums;
}`,
          codes: {
            javascript: `function sortColors(nums) {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      const t = nums[low];
      nums[low] = nums[mid];
      nums[mid] = t;
      low++;
      mid++;
    } else if (nums[mid] === 2) {
      const t = nums[high];
      nums[high] = nums[mid];
      nums[mid] = t;
      high--;
    } else {
      mid++;
    }
  }
  return nums;
}`,
            python: `def sort_colors(nums):
    low = 0
    mid = 0
    high = len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            t = nums[low]
            nums[low] = nums[mid]
            nums[mid] = t
            low += 1
            mid += 1
        elif nums[mid] == 2:
            t = nums[high]
            nums[high] = nums[mid]
            nums[mid] = t
            high -= 1
        else:
            mid += 1
    return nums`,
            java: `class Solution {
  public int[] sortColors(int[] nums) {
    int low = 0;
    int mid = 0;
    int high = nums.length - 1;
    while (mid <= high) {
      if (nums[mid] == 0) {
        int t = nums[low];
        nums[low] = nums[mid];
        nums[mid] = t;
        low++;
        mid++;
      } else if (nums[mid] == 2) {
        int t = nums[high];
        nums[high] = nums[mid];
        nums[mid] = t;
        high--;
      } else {
        mid++;
      }
    }
    return nums;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<int> sortColors(vector<int>& nums) {
  int low = 0;
  int mid = 0;
  int high = (int)nums.size() - 1;
  while (mid <= high) {
    if (nums[mid] == 0) {
      int t = nums[low];
      nums[low] = nums[mid];
      nums[mid] = t;
      low++;
      mid++;
    } else if (nums[mid] == 2) {
      int t = nums[high];
      nums[high] = nums[mid];
      nums[mid] = t;
      high--;
    } else {
      mid++;
    }
  }
  return nums;
}`,
            c: `/* pass n for array length; simple loops */
void sortColors(int* nums, int n) {
  int low = 0;
  int mid = 0;
  int high = n - 1;
  while (mid <= high) {
    if (nums[mid] == 0) {
      int t = nums[low];
      nums[low] = nums[mid];
      nums[mid] = t;
      low++;
      mid++;
    } else if (nums[mid] == 2) {
      int t = nums[high];
      nums[high] = nums[mid];
      nums[mid] = t;
      high--;
    } else {
      mid++;
    }
  }
  return nums;
}`
          }
        }
      ]
    },
    {
      id: 17,
      level: "intermediate",
      q: "Find the Duplicate Number",
      ask: "Amazon · Microsoft · Google",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/find-the-duplicate-number/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/find-duplicates-in-an-array/1"}],
      a: "nums has n + 1 integers, each between 1 and n. Exactly one number is repeated (it may appear more than twice). Return that number. Do not change the input in the interview-strict version.\n\nExample: [1, 3, 4, 2, 2] -> 2.\n\nNested search finds a value that appears twice. A sorted copy makes duplicates neighbors. Treating indexes as a linked list (value as next pointer) and using Floyd’s cycle meeting point finds the duplicate in linear time and constant extra space.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "For each index you scan the rest of the list looking for the same value.\nHow it works: if nums[j] === nums[i] for j > i, that value is the duplicate.",
          code: `function findDuplicate(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] === nums[j]) return nums[i];
    }
  }
  return -1;
}`,
          codes: {
            javascript: `function findDuplicate(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] === nums[j]) return nums[i];
    }
  }
  return -1;
}`,
            python: `def find_duplicate(nums):
    n = len(nums)
    for i in range(n):

        for j in range(i + 1, n):

            if nums[i] == nums[j]: return nums[i]

    return -1`,
            java: `class Solution {
  public int findDuplicate(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        if (nums[i] == nums[j]) return nums[i];
      }
    }
    return -1;
  }
}`,
            cpp: `// vector, unordered_map, string
int findDuplicate(vector<int>& nums) {
  int n = (int)nums.size();
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      if (nums[i] == nums[j]) return nums[i];
    }
  }
  return -1;
}`,
            c: `/* pass n for array length; simple loops */
int findDuplicate(int* nums, int n) {
  /* n is the given length */
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      if (nums[i] == nums[j]) return nums[i];
    }
  }
  return -1;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n log n)",
          space: "O(n)",
          why: "Copy and sort, then scan neighbors. Sorting dominates. Extra memory is the copy (input stays unchanged).\nHow it works: after sort, the repeated number sits next to itself.",
          code: `function findDuplicate(nums) {
  const copy = nums.slice().sort(function (a, b) { return a - b; });
  for (let i = 1; i < copy.length; i++) {
    if (copy[i] === copy[i - 1]) return copy[i];
  }
  return -1;
}`,
          codes: {
            javascript: `function findDuplicate(nums) {
  const copy = nums.slice().sort(function (a, b) { return a - b; });
  for (let i = 1; i < copy.length; i++) {
    if (copy[i] === copy[i - 1]) return copy[i];
  }
  return -1;
}`,
            python: `def find_duplicate(nums):
    copy = sorted(nums)
    for i in range(1, len(copy)):

        if copy[i] == copy[i - 1]: return copy[i]

    return -1`,
            java: `class Solution {
  public int findDuplicate(int[] nums) {
    int[] copy = nums.clone();
    Arrays.sort(copy);
    for (int i = 1; i < copy.length; i++) {
      if (copy[i] == copy[i - 1]) return copy[i];
    }
    return -1;
  }
}`,
            cpp: `// vector, unordered_map, string
int findDuplicate(vector<int>& nums) {
  vector<int> copy = nums;
  sort(copy.begin(), copy.end());
  for (int i = 1; i < (int)copy.size(); i++) {
    if (copy[i] == copy[i - 1]) return copy[i];
  }
  return -1;
}`,
            c: `/* pass n for array length; simple loops */
int findDuplicate(int* nums, int n) {
  int copy = /* sorted copy */;
  for (int i = 1; i < n; i++) {
    if (copy[i] == copy[i - 1]) return copy[i];
  }
  return -1;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Floyd cycle detection. Values in 1..n act as next pointers, so a duplicate creates a cycle. No extra array, input not written.\nHow it works: slow moves one hop, fast moves two, until they meet. Reset slow to the start; the next meeting is the cycle entrance, which is the duplicate.",
          code: `function findDuplicate(nums) {
  let slow = nums[0];
  let fast = nums[0];
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}`,
          codes: {
            javascript: `function findDuplicate(nums) {
  let slow = nums[0];
  let fast = nums[0];
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}`,
            python: `def find_duplicate(nums):
    slow = nums[0]
    fast = nums[0]
    while True:

        slow = nums[slow]
        fast = nums[nums[fast]]

        if not (slow != fast): break
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    return slow`,
            java: `class Solution {
  public int findDuplicate(int[] nums) {
    int slow = nums[0];
    int fast = nums[0];
    while (true) {

      slow = nums[slow];
      fast = nums[nums[fast]];

  if (!(slow != fast)) break;
  }
    slow = nums[0];
    while (slow != fast) {
      slow = nums[slow];
      fast = nums[fast];
    }
    return slow;
  }
}`,
            cpp: `// vector, unordered_map, string
int findDuplicate(vector<int>& nums) {
  int slow = nums[0];
  int fast = nums[0];
  while (true) {

    slow = nums[slow];
    fast = nums[nums[fast]];

if (!(slow != fast)) break;
}
  slow = nums[0];
  while (slow != fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}`,
            c: `/* pass n for array length; simple loops */
int findDuplicate(int* nums, int n) {
  int slow = nums[0];
  int fast = nums[0];
  while (1) {

    slow = nums[slow];
    fast = nums[nums[fast]];

if (!(slow != fast)) break;
}
  slow = nums[0];
  while (slow != fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}`
          }
        }
      ]
    },
    {
      id: 18,
      level: "intermediate",
      q: "Subarray Sum Equals K",
      ask: "Meta · Amazon · Google · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/subarray-sum-equals-k/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/subarray-range-with-given-sum0128/1"}],
      a: "Count how many contiguous subarrays sum to k. Numbers may be negative, so a simple “shrink when too big” window is not enough.\n\nExample: nums = [1, 1, 1], k = 2 -> 2 subarrays.\n\nAll subarrays can be summed in O(n²). A prefix array plus a map of earlier prefixes is two passes. Combining them into one pass is the usual interview code: if prefix - k was seen c times, add c.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "Every start and end pair is summed. Fine to explain, too slow for large n.\nHow it works: i is start, running sum grows with j. Each time the sum equals k, add 1 to the count.",
          code: `function subarraySum(nums, k) {
  let count = 0;
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = i; j < n; j++) {
      sum += nums[j];
      if (sum === k) count++;
    }
  }
  return count;
}`,
          codes: {
            javascript: `function subarraySum(nums, k) {
  let count = 0;
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = i; j < n; j++) {
      sum += nums[j];
      if (sum === k) count++;
    }
  }
  return count;
}`,
            python: `def subarray_sum(nums, k):
    count = 0
    n = len(nums)
    for i in range(n):

        sum = 0
        for j in range(i, n):

            sum += nums[j]
            if sum == k: count += 1

    return count`,
            java: `class Solution {
  public int subarraySum(int[] nums, int k) {
    int count = 0;
    int n = nums.length;
    for (int i = 0; i < n; i++) {
      int sum = 0;
      for (int j = i; j < n; j++) {
        sum += nums[j];
        if (sum == k) count++;
      }
    }
    return count;
  }
}`,
            cpp: `// vector, unordered_map, string
int subarraySum(vector<int>& nums, int k) {
  int count = 0;
  int n = (int)nums.size();
  for (int i = 0; i < n; i++) {
    int sum = 0;
    for (int j = i; j < n; j++) {
      sum += nums[j];
      if (sum == k) count++;
    }
  }
  return count;
}`,
            c: `/* pass n for array length; simple loops */
int subarraySum(int* nums, int n, int k) {
  int count = 0;
  /* n is the given length */
  for (int i = 0; i < n; i++) {
    int sum = 0;
    for (int j = i; j < n; j++) {
      sum += nums[j];
      if (sum == k) count++;
    }
  }
  return count;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Build all prefixes, then query a map. Two linear passes, O(n) extra.\nHow it works: prefix[i] is sum of the first i numbers. For each end i, the number of starts with prefix[i] - prefix[start] = k is how often prefix[i] - k already appeared.",
          code: `function subarraySum(nums, k) {
  const n = nums.length;
  const prefix = new Array(n + 1);
  prefix[0] = 0;
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  const freq = new Map();
  let count = 0;
  for (let i = 0; i <= n; i++) {
    const need = prefix[i] - k;
    if (freq.has(need)) count += freq.get(need);
    freq.set(prefix[i], (freq.get(prefix[i]) || 0) + 1);
  }
  return count;
}`,
          codes: {
            javascript: `function subarraySum(nums, k) {
  const n = nums.length;
  const prefix = new Array(n + 1);
  prefix[0] = 0;
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  const freq = new Map();
  let count = 0;
  for (let i = 0; i <= n; i++) {
    const need = prefix[i] - k;
    if (freq.has(need)) count += freq.get(need);
    freq.set(prefix[i], (freq.get(prefix[i]) || 0) + 1);
  }
  return count;
}`,
            python: `def subarray_sum(nums, k):
    n = len(nums)
    prefix = [None] * (n + 1)
    prefix[0] = 0
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]
    freq = {}
    count = 0
    for i in range(= n):

        need = prefix[i] - k
        if need in freq: count += freq[need]
        freq[prefix[i]] = freq.get(prefix[i], 0 + 1)

    return count`,
            java: `class Solution {
  public int subarraySum(int[] nums, int k) {
    int n = nums.length;
    int[] prefix = new int[n + 1];
    prefix[0] = 0;
    for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
    Map<Integer, Integer> freq = new HashMap<>();
    int count = 0;
    for (int i = 0; i <= n; i++) {
      int need = prefix[i] - k;
      if (freq.containsKey(need)) count += freq.get(need);
      freq.put(prefix[i], (freq.getOrDefault(prefix[i], 0)) + 1);
    }
    return count;
  }
}`,
            cpp: `// vector, unordered_map, string
int subarraySum(vector<int>& nums, int k) {
  int n = (int)nums.size();
  vector<int> prefix = vector<int>(n + 1);
  prefix[0] = 0;
  for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  unordered_map<int,int> freq;
  int count = 0;
  for (int i = 0; i <= n; i++) {
    int need = prefix[i] - k;
    if (freq.count(need)) count += freq[need];
    freq[prefix[i]] = (freq.count(prefix[i] ? freq[prefix[i]] : 0) + 1);
  }
  return count;
}`,
            c: `/* pass n for array length; simple loops */
/* linear scan stands in for a hash map */
int map_find(int* keys, int used, int key) {
  int i;
  for (i = 0; i < used; i++) if (keys[i] == key) return i;
  return -1;
}
int subarraySum(int* nums, int n, int k) {
  /* n is the given length */
  int prefix = /* array n + 1 */;
  prefix[0] = 0;
  for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  int freq_keys[1024]; int freq_vals[1024]; int freq_n = 0;
  int count = 0;
  for (int i = 0; i <= n; i++) {
    int need = prefix[i] - k;
    if (map_find(freq_keys, freq_n, need) >= 0) count += freq.get(need);
    /* set freq */ + 1);
  }
  return count;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Same map idea without a prefix array. One running sum.\nHow it works: start the map with 0 seen once (empty prefix). After adding nums[i], add the frequency of sum - k, then record this sum.",
          code: `function subarraySum(nums, k) {
  const freq = new Map();
  freq.set(0, 1);
  let sum = 0;
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    const need = sum - k;
    if (freq.has(need)) count += freq.get(need);
    freq.set(sum, (freq.get(sum) || 0) + 1);
  }
  return count;
}`,
          codes: {
            javascript: `function subarraySum(nums, k) {
  const freq = new Map();
  freq.set(0, 1);
  let sum = 0;
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    const need = sum - k;
    if (freq.has(need)) count += freq.get(need);
    freq.set(sum, (freq.get(sum) || 0) + 1);
  }
  return count;
}`,
            python: `def subarray_sum(nums, k):
    freq = {}
    freq[0] = 1
    sum = 0
    count = 0
    for i in range(len(nums)):

        sum += nums[i]
        need = sum - k
        if need in freq: count += freq[need]
        freq[sum] = freq.get(sum, 0 + 1)

    return count`,
            java: `class Solution {
  public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    freq.put(0, 1);
    int sum = 0;
    int count = 0;
    for (int i = 0; i < nums.length; i++) {
      sum += nums[i];
      int need = sum - k;
      if (freq.containsKey(need)) count += freq.get(need);
      freq.put(sum, (freq.getOrDefault(sum, 0)) + 1);
    }
    return count;
  }
}`,
            cpp: `// vector, unordered_map, string
int subarraySum(vector<int>& nums, int k) {
  unordered_map<int,int> freq;
  freq[0] = 1;
  int sum = 0;
  int count = 0;
  for (int i = 0; i < (int)nums.size(); i++) {
    sum += nums[i];
    int need = sum - k;
    if (freq.count(need)) count += freq[need];
    freq[sum] = (freq.count(sum ? freq[sum] : 0) + 1);
  }
  return count;
}`,
            c: `/* pass n for array length; simple loops */
/* linear scan stands in for a hash map */
int map_find(int* keys, int used, int key) {
  int i;
  for (i = 0; i < used; i++) if (keys[i] == key) return i;
  return -1;
}
int subarraySum(int* nums, int n, int k) {
  int freq_keys[1024]; int freq_vals[1024]; int freq_n = 0;
  /* set freq */;
  int sum = 0;
  int count = 0;
  for (int i = 0; i < n; i++) {
    sum += nums[i];
    int need = sum - k;
    if (map_find(freq_keys, freq_n, need) >= 0) count += freq.get(need);
    /* set freq */ + 1);
  }
  return count;
}`
          }
        }
      ]
    },
    {
      id: 19,
      level: "intermediate",
      q: "Longest Consecutive Sequence",
      ask: "Google · Amazon · Meta · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/longest-consecutive-sequence/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/longest-consecutive-subsequence-1587115621/1"}],
      a: "Return the length of the longest run of consecutive integers. Order in the array does not matter. Numbers may repeat.\n\nExample: [100, 4, 200, 1, 3, 2] -> 4 because 1,2,3,4.\n\nFrom each value you can walk upward until the chain breaks. Sorting unique values makes the chain a neighbor scan. A Set lets you start a chain only at numbers that have no predecessor, so each number is visited a constant number of times.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(n)",
          why: "From each unique start you may scan the set repeatedly. In the worst case this is quadratic.\nHow it works: put numbers in a Set. For each start, count start, start+1, start+2 while those values exist. Keep the longest streak.",
          code: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const x of set) {
    let len = 1;
    let cur = x;
    while (set.has(cur + 1)) {
      cur++;
      len++;
    }
    if (len > best) best = len;
  }
  return best;
}`,
          codes: {
            javascript: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const x of set) {
    let len = 1;
    let cur = x;
    while (set.has(cur + 1)) {
      cur++;
      len++;
    }
    if (len > best) best = len;
  }
  return best;
}`,
            python: `def longest_consecutive(nums):
    set = set(nums)
    best = 0
    for x in set:
        length = 1
        cur = x
        while cur + 1 in set:
            cur += 1
            length += 1
        if length > best: best = length
    return best`,
            java: `class Solution {
  public int longestConsecutive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    int best = 0;
    for (int x : set) {
      int len = 1;
      int cur = x;
      while (set.contains(cur + 1)) {
        cur++;
        len++;
      }
      if (len > best) best = len;
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int longestConsecutive(vector<int>& nums) {
  unordered_set<int> set;
  int best = 0;
  for (int x : set) {
    int len = 1;
    int cur = x;
    while (set.count(cur + 1)) {
      cur++;
      len++;
    }
    if (len > best) best = len;
  }
  return best;
}`,
            c: `/* pass n for array length; simple loops */
/* linear scan stands in for a hash map */
int map_find(int* keys, int used, int key) {
  int i;
  for (i = 0; i < used; i++) if (keys[i] == key) return i;
  return -1;
}
int longestConsecutive(int* nums, int n) {
  int set_keys[1024]; int set_n = 0;
  int best = 0;
  for (/* each x in set) {
    int len = 1;
    int cur = x;
    while (map_find(set_keys, set_n, cur + 1) >= 0) {
      cur++;
      len++;
    }
    if (len > best) best = len;
  }
  return best;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n log n)",
          space: "O(n)",
          why: "Unique copy plus sort, then a linear neighbor walk. Sorting is the bottleneck.\nHow it works: skip duplicates while scanning the sorted unique list. A gap of 1 grows the streak; a larger gap resets it.",
          code: `function longestConsecutive(nums) {
  if (nums.length === 0) return 0;
  const list = Array.from(new Set(nums));
  list.sort(function (a, b) { return a - b; });
  let best = 1;
  let streak = 1;
  for (let i = 1; i < list.length; i++) {
    if (list[i] === list[i - 1] + 1) {
      streak++;
      if (streak > best) best = streak;
    } else {
      streak = 1;
    }
  }
  return best;
}`,
          codes: {
            javascript: `function longestConsecutive(nums) {
  if (nums.length === 0) return 0;
  const list = Array.from(new Set(nums));
  list.sort(function (a, b) { return a - b; });
  let best = 1;
  let streak = 1;
  for (let i = 1; i < list.length; i++) {
    if (list[i] === list[i - 1] + 1) {
      streak++;
      if (streak > best) best = streak;
    } else {
      streak = 1;
    }
  }
  return best;
}`,
            python: `def longest_consecutive(nums):
    if len(nums) == 0: return 0
    list = list(set(nums))
    list.sort()
    best = 1
    streak = 1
    for i in range(1, len(list)):

        if list[i] == list[i - 1] + 1:
            streak += 1
            if streak > best: best = streak
        else:
            streak = 1

    return best`,
            java: `class Solution {
  public int longestConsecutive(int[] nums) {
    if (nums.length == 0) return 0;
    int list = nums.clone() /* unique */;
    Arrays.sort(list);
    int best = 1;
    int streak = 1;
    for (int i = 1; i < list.length; i++) {
      if (list[i] == list[i - 1] + 1) {
        streak++;
        if (streak > best) best = streak;
      } else {
        streak = 1;
      }
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int longestConsecutive(vector<int>& nums) {
  if ((int)nums.size() == 0) return 0;
  int list = nums /* unique */;
  sort(list.begin(), list.end());
  int best = 1;
  int streak = 1;
  for (int i = 1; i < (int)list.size(); i++) {
    if (list[i] == list[i - 1] + 1) {
      streak++;
      if (streak > best) best = streak;
    } else {
      streak = 1;
    }
  }
  return best;
}`,
            c: `/* pass n for array length; simple loops */
/* linear scan stands in for a hash map */
int map_find(int* keys, int used, int key) {
  int i;
  for (i = 0; i < used; i++) if (keys[i] == key) return i;
  return -1;
}
int longestConsecutive(int* nums, int n) {
  if (n == 0) return 0;
  int list = nums;
  /* sort list */;
  int best = 1;
  int streak = 1;
  for (int i = 1; i < n; i++) {
    if (list[i] == list[i - 1] + 1) {
      streak++;
      if (streak > best) best = streak;
    } else {
      streak = 1;
    }
  }
  return best;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Each number is inserted once and then used in at most one forward walk.\nHow it works: only start a streak when x-1 is missing. Then count x, x+1, ... while present. That visits each run from its true beginning.",
          code: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const x of set) {
    if (set.has(x - 1)) continue;
    let len = 1;
    let cur = x;
    while (set.has(cur + 1)) {
      cur++;
      len++;
    }
    if (len > best) best = len;
  }
  return best;
}`,
          codes: {
            javascript: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const x of set) {
    if (set.has(x - 1)) continue;
    let len = 1;
    let cur = x;
    while (set.has(cur + 1)) {
      cur++;
      len++;
    }
    if (len > best) best = len;
  }
  return best;
}`,
            python: `def longest_consecutive(nums):
    set = set(nums)
    best = 0
    for x in set:
        if x - 1 in set: continue
        length = 1
        cur = x
        while cur + 1 in set:
            cur += 1
            length += 1
        if length > best: best = length
    return best`,
            java: `class Solution {
  public int longestConsecutive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    int best = 0;
    for (int x : set) {
      if (set.contains(x - 1)) continue;
      int len = 1;
      int cur = x;
      while (set.contains(cur + 1)) {
        cur++;
        len++;
      }
      if (len > best) best = len;
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int longestConsecutive(vector<int>& nums) {
  unordered_set<int> set;
  int best = 0;
  for (int x : set) {
    if (set.count(x - 1)) continue;
    int len = 1;
    int cur = x;
    while (set.count(cur + 1)) {
      cur++;
      len++;
    }
    if (len > best) best = len;
  }
  return best;
}`,
            c: `/* pass n for array length; simple loops */
/* linear scan stands in for a hash map */
int map_find(int* keys, int used, int key) {
  int i;
  for (i = 0; i < used; i++) if (keys[i] == key) return i;
  return -1;
}
int longestConsecutive(int* nums, int n) {
  int set_keys[1024]; int set_n = 0;
  int best = 0;
  for (/* each x in set) {
    if (map_find(set_keys, set_n, x - 1) >= 0) continue;
    int len = 1;
    int cur = x;
    while (map_find(set_keys, set_n, cur + 1) >= 0) {
      cur++;
      len++;
    }
    if (len > best) best = len;
  }
  return best;
}`
          }
        }
      ]
    },
    {
      id: 20,
      level: "advanced",
      q: "First Missing Positive",
      ask: "Amazon · Microsoft · Google · Meta",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/first-missing-positive/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/smallest-positive-missing-number-1587115621/1"}],
      a: "Return the smallest missing positive integer (1, 2, 3, …). The list may contain negatives, zeros, and values larger than n.\n\nExample: [3, 4, -1, 1] -> 2. Example: [1, 2, 0] -> 3.\n\nSorting then scanning for 1, 2, 3, … works. A Set of positives makes the scan O(n). The in-place version puts each value v in 1..n at index v-1, then the first index whose value is not i+1 is the answer.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n log n)",
          space: "O(n)",
          why: "Copy, sort, then walk looking for the next needed positive. Sorting dominates.\nHow it works: ignore non-positives and duplicates. need starts at 1. When you see need, bump it. At the end, need is missing.",
          code: `function firstMissingPositive(nums) {
  const list = nums.slice().sort(function (a, b) { return a - b; });
  let need = 1;
  for (let i = 0; i < list.length; i++) {
    if (list[i] <= 0) continue;
    if (list[i] === need) need++;
    else if (list[i] > need) return need;
  }
  return need;
}`,
          codes: {
            javascript: `function firstMissingPositive(nums) {
  const list = nums.slice().sort(function (a, b) { return a - b; });
  let need = 1;
  for (let i = 0; i < list.length; i++) {
    if (list[i] <= 0) continue;
    if (list[i] === need) need++;
    else if (list[i] > need) return need;
  }
  return need;
}`,
            python: `def first_missing_positive(nums):
    list = sorted(nums)
    need = 1
    for i in range(len(list)):

        if list[i] <= 0: continue
        if list[i] == need: need += 1
        elif list[i] > need: return need

    return need`,
            java: `class Solution {
  public int firstMissingPositive(int[] nums) {
    int[] list = nums.clone();
    Arrays.sort(list);
    int need = 1;
    for (int i = 0; i < list.length; i++) {
      if (list[i] <= 0) continue;
      if (list[i] == need) need++;
      else if (list[i] > need) return need;
    }
    return need;
  }
}`,
            cpp: `// vector, unordered_map, string
int firstMissingPositive(vector<int>& nums) {
  vector<int> list = nums;
  sort(list.begin(), list.end());
  int need = 1;
  for (int i = 0; i < (int)list.size(); i++) {
    if (list[i] <= 0) continue;
    if (list[i] == need) need++;
    else if (list[i] > need) return need;
  }
  return need;
}`,
            c: `/* pass n for array length; simple loops */
int firstMissingPositive(int* nums, int n) {
  int list = /* sorted copy */;
  int need = 1;
  for (int i = 0; i < n; i++) {
    if (list[i] <= 0) continue;
    if (list[i] == need) need++;
    else if (list[i] > need) return need;
  }
  return need;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "One Set of the input, then at most n+1 membership tests.\nHow it works: the answer is in 1..n+1. Probe 1, 2, 3, … until a value is not in the set.",
          code: `function firstMissingPositive(nums) {
  const set = new Set(nums);
  let need = 1;
  while (set.has(need)) need++;
  return need;
}`,
          codes: {
            javascript: `function firstMissingPositive(nums) {
  const set = new Set(nums);
  let need = 1;
  while (set.has(need)) need++;
  return need;
}`,
            python: `def first_missing_positive(nums):
    set = set(nums)
    need = 1
    while need in set: need += 1
    return need`,
            java: `class Solution {
  public int firstMissingPositive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    int need = 1;
    while (set.contains(need)) need++;
    return need;
  }
}`,
            cpp: `// vector, unordered_map, string
int firstMissingPositive(vector<int>& nums) {
  unordered_set<int> set;
  int need = 1;
  while (set.count(need)) need++;
  return need;
}`,
            c: `/* pass n for array length; simple loops */
/* linear scan stands in for a hash map */
int map_find(int* keys, int used, int key) {
  int i;
  for (i = 0; i < used; i++) if (keys[i] == key) return i;
  return -1;
}
int firstMissingPositive(int* nums, int n) {
  int set_keys[1024]; int set_n = 0;
  int need = 1;
  while (map_find(set_keys, set_n, need) >= 0) need++;
  return need;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Index-as-hash / cyclic placement. Extra memory is a few integers. The input is overwritten.\nHow it works: swap nums[i] to index nums[i]-1 while that value is in 1..n and not already home. Then the first i with nums[i] !== i+1 is the missing number; else n+1.",
          code: `function firstMissingPositive(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (
      nums[i] >= 1 &&
      nums[i] <= n &&
      nums[nums[i] - 1] !== nums[i]
    ) {
      const dest = nums[i] - 1;
      const t = nums[i];
      nums[i] = nums[dest];
      nums[dest] = t;
    }
  }
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }
  return n + 1;
}`,
          codes: {
            javascript: `function firstMissingPositive(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (
      nums[i] >= 1 &&
      nums[i] <= n &&
      nums[nums[i] - 1] !== nums[i]
    ) {
      const dest = nums[i] - 1;
      const t = nums[i];
      nums[i] = nums[dest];
      nums[dest] = t;
    }
  }
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }
  return n + 1;
}`,
            python: `def first_missing_positive(nums):
    n = len(nums)
    for i in range(n):

        while (
        nums[i] >= 1  and
        nums[i] <= n  and
        nums[nums[i] - 1] != nums[i]
        ):
            dest = nums[i] - 1
            t = nums[i]
            nums[i] = nums[dest]
            nums[dest] = t

    for i in range(n):

        if nums[i] != i + 1: return i + 1

    return n + 1`,
            java: `class Solution {
  public int firstMissingPositive(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
      while (
        nums[i] >= 1 &&
        nums[i] <= n &&
        nums[nums[i] - 1] != nums[i]
      ) {
        int dest = nums[i] - 1;
        int t = nums[i];
        nums[i] = nums[dest];
        nums[dest] = t;
      }
    }
    for (int i = 0; i < n; i++) {
      if (nums[i] != i + 1) return i + 1;
    }
    return n + 1;
  }
}`,
            cpp: `// vector, unordered_map, string
int firstMissingPositive(vector<int>& nums) {
  int n = (int)nums.size();
  for (int i = 0; i < n; i++) {
    while (
      nums[i] >= 1 &&
      nums[i] <= n &&
      nums[nums[i] - 1] != nums[i]
    ) {
      int dest = nums[i] - 1;
      int t = nums[i];
      nums[i] = nums[dest];
      nums[dest] = t;
    }
  }
  for (int i = 0; i < n; i++) {
    if (nums[i] != i + 1) return i + 1;
  }
  return n + 1;
}`,
            c: `/* pass n for array length; simple loops */
int firstMissingPositive(int* nums, int n) {
  /* n is the given length */
  for (int i = 0; i < n; i++) {
    while (
      nums[i] >= 1 &&
      nums[i] <= n &&
      nums[nums[i] - 1] != nums[i]
    ) {
      int dest = nums[i] - 1;
      int t = nums[i];
      nums[i] = nums[dest];
      nums[dest] = t;
    }
  }
  for (int i = 0; i < n; i++) {
    if (nums[i] != i + 1) return i + 1;
  }
  return n + 1;
}`
          }
        }
      ]
    },
    {
      id: 21,
      level: "intermediate",
      q: "Jump Game",
      ask: "Amazon · Google · Meta · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/jump-game/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/jump-game/1"}],
      a: "Each nums[i] is the max jump length from index i. Return true if you can reach the last index.\n\nExample: [2, 3, 1, 1, 4] is true. Example: [3, 2, 1, 0, 4] is false because you land on 0 and cannot pass.\n\nTrying every jump recursively is exponential. A boolean DP array records whether each index is reachable. The greedy farthest-reach walk is one pass: if an index is beyond farthest, you fail; if farthest covers the end, you succeed.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(2ⁿ)",
          space: "O(n)",
          why: "From each index you may try every jump length. Overlapping paths are recomputed, so the tree is exponential. Stack depth is O(n).\nHow it works: dfs(i) is true if i is the last index, or any i + step can reach the end.",
          code: `function canJump(nums) {
  const n = nums.length;
  function dfs(i) {
    if (i >= n - 1) return true;
    const maxStep = nums[i];
    for (let step = 1; step <= maxStep; step++) {
      if (dfs(i + step)) return true;
    }
    return false;
  }
  return dfs(0);
}`,
          codes: {
            javascript: `function canJump(nums) {
  const n = nums.length;
  function dfs(i) {
    if (i >= n - 1) return true;
    const maxStep = nums[i];
    for (let step = 1; step <= maxStep; step++) {
      if (dfs(i + step)) return true;
    }
    return false;
  }
  return dfs(0);
}`,
            python: `def can_jump(nums):
    n = len(nums)
    def dfs(i):
        if i >= n - 1: return True
        maxStep = nums[i]
        for step in range(1, = maxStep):

            if dfs(i + step): return True

        return False
    return dfs(0)`,
            java: `class Solution {
  public boolean canJump(int[] nums) {
    int n = nums.length;
    public void dfs(i) {
      if (i >= n - 1) return true;
      int maxStep = nums[i];
      for (int step = 1; step <= maxStep; step++) {
        if (dfs(i + step)) return true;
      }
      return false;
    }
    return dfs(0);
  }
}`,
            cpp: `// vector, unordered_map, string
bool canJump(vector<int>& nums) {
  int n = (int)nums.size();
  auto dfs = [&](i) {
    if (i >= n - 1) return true;
    int maxStep = nums[i];
    for (int step = 1; step <= maxStep; step++) {
      if (dfs(i + step)) return true;
    }
    return false;
  }
  return dfs(0);
}`,
            c: `/* pass n for array length; simple loops */
int canJump(int* nums, int n) {
  /* n is the given length */
  void dfs(/* i */) {
    if (i >= n - 1) return 1;
    int maxStep = nums[i];
    for (int step = 1; step <= maxStep; step++) {
      if (dfs(i + step)) return 1;
    }
    return 0;
  }
  return dfs(0);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n²)",
          space: "O(n)",
          why: "For each index you may look at every previous index. Worst case quadratic. Extra array of n booleans.\nHow it works: ok[0] is true. ok[j] becomes true if some earlier ok[i] can jump to j. Return ok[n-1].",
          code: `function canJump(nums) {
  const n = nums.length;
  const ok = new Array(n).fill(false);
  ok[0] = true;
  for (let i = 0; i < n; i++) {
    if (!ok[i]) continue;
    const last = Math.min(n - 1, i + nums[i]);
    for (let j = i + 1; j <= last; j++) ok[j] = true;
  }
  return ok[n - 1];
}`,
          codes: {
            javascript: `function canJump(nums) {
  const n = nums.length;
  const ok = new Array(n).fill(false);
  ok[0] = true;
  for (let i = 0; i < n; i++) {
    if (!ok[i]) continue;
    const last = Math.min(n - 1, i + nums[i]);
    for (let j = i + 1; j <= last; j++) ok[j] = true;
  }
  return ok[n - 1];
}`,
            python: `def can_jump(nums):
    n = len(nums)
    ok = [False] * n
    ok[0] = True
    for i in range(n):

        if not ok[i]: continue
        last = min(n - 1, i + nums[i])
        for j in range(i + 1, = last):
            ok[j] = True

    return ok[n - 1]`,
            java: `class Solution {
  public boolean canJump(int[] nums) {
    int n = nums.length;
    boolean[] ok = new boolean[n];
    ok[0] = true;
    for (int i = 0; i < n; i++) {
      if (!ok[i]) continue;
      int last = Math.min(n - 1, i + nums[i]);
      for (int j = i + 1; j <= last; j++) ok[j] = true;
    }
    return ok[n - 1];
  }
}`,
            cpp: `// vector, unordered_map, string
bool canJump(vector<int>& nums) {
  int n = (int)nums.size();
  vector<int> ok = vector<int>(n, 0);
  ok[0] = true;
  for (int i = 0; i < n; i++) {
    if (!ok[i]) continue;
    int last = min(n - 1, i + nums[i]);
    for (int j = i + 1; j <= last; j++) ok[j] = true;
  }
  return ok[n - 1];
}`,
            c: `/* pass n for array length; simple loops */
int canJump(int* nums, int n) {
  /* n is the given length */
  int ok = /* zeros n */;
  ok[0] = 1;
  for (int i = 0; i < n; i++) {
    if (!ok[i]) continue;
    int last = (n - 1 < i + nums[i] ? n - 1 : i + nums[i]);
    for (int j = i + 1; j <= last; j++) ok[j] = 1;
  }
  return ok[n - 1];
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "One left-to-right pass. farthest is the rightmost index you can reach so far.\nHow it works: if i > farthest you cannot even stand here. Update farthest with i + nums[i]. If farthest covers the last index, return true.",
          code: `function canJump(nums) {
  let farthest = 0;
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    if (i > farthest) return false;
    const reach = i + nums[i];
    if (reach > farthest) farthest = reach;
    if (farthest >= n - 1) return true;
  }
  return true;
}`,
          codes: {
            javascript: `function canJump(nums) {
  let farthest = 0;
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    if (i > farthest) return false;
    const reach = i + nums[i];
    if (reach > farthest) farthest = reach;
    if (farthest >= n - 1) return true;
  }
  return true;
}`,
            python: `def can_jump(nums):
    farthest = 0
    n = len(nums)
    for i in range(n):

        if i > farthest: return False
        reach = i + nums[i]
        if reach > farthest: farthest = reach
        if farthest >= n - 1: return True

    return True`,
            java: `class Solution {
  public boolean canJump(int[] nums) {
    int farthest = 0;
    int n = nums.length;
    for (int i = 0; i < n; i++) {
      if (i > farthest) return false;
      int reach = i + nums[i];
      if (reach > farthest) farthest = reach;
      if (farthest >= n - 1) return true;
    }
    return true;
  }
}`,
            cpp: `// vector, unordered_map, string
bool canJump(vector<int>& nums) {
  int farthest = 0;
  int n = (int)nums.size();
  for (int i = 0; i < n; i++) {
    if (i > farthest) return false;
    int reach = i + nums[i];
    if (reach > farthest) farthest = reach;
    if (farthest >= n - 1) return true;
  }
  return true;
}`,
            c: `/* pass n for array length; simple loops */
int canJump(int* nums, int n) {
  int farthest = 0;
  /* n is the given length */
  for (int i = 0; i < n; i++) {
    if (i > farthest) return 0;
    int reach = i + nums[i];
    if (reach > farthest) farthest = reach;
    if (farthest >= n - 1) return 1;
  }
  return 1;
}`
          }
        }
      ]
    },
    {
      id: 22,
      level: "intermediate",
      q: "Search in Rotated Sorted Array",
      ask: "Amazon · Google · Microsoft · Meta",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/search-in-rotated-sorted-array/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/search-in-a-rotated-array4618/1"}],
      a: "nums was sorted ascending, then rotated. Values are unique. Return the index of target, or -1.\n\nExample: [4, 5, 6, 7, 0, 1, 2], target 0 -> 4.\n\nA linear scan always works. Finding the pivot (the smallest value) then binary-searching the correct sorted half is two binary searches. One binary search that asks “which half is sorted?” and whether target sits there is the usual finish.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(1)",
          why: "Ignore rotation and scan. Correct, misses the log n goal.\nHow it works: return the first index whose value equals target.",
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
    for i in range(len(nums)):

        if nums[i] == target: return i

    return -1`,
            java: `class Solution {
  public int search(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
      if (nums[i] == target) return i;
    }
    return -1;
  }
}`,
            cpp: `// vector, unordered_map, string
int search(vector<int>& nums, int target) {
  for (int i = 0; i < (int)nums.size(); i++) {
    if (nums[i] == target) return i;
  }
  return -1;
}`,
            c: `/* pass n for array length; simple loops */
int search(int* nums, int n, int target) {
  for (int i = 0; i < n; i++) {
    if (nums[i] == target) return i;
  }
  return -1;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(log n)",
          space: "O(1)",
          why: "Two binary searches: one finds the rotation pivot, one searches a normal sorted range.\nHow it works: pivot is the index of the smallest value. If target is in the left sorted run, search [0, pivot). Else search [pivot, n).",
          code: `function search(nums, target) {
  const n = nums.length;
  function findPivot() {
    let left = 0;
    let right = n - 1;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (nums[mid] > nums[right]) left = mid + 1;
      else right = mid;
    }
    return left;
  }
  function binSearch(left, right) {
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (nums[mid] === target) return mid;
      if (nums[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    return -1;
  }
  const pivot = findPivot();
  if (target >= nums[pivot] && target <= nums[n - 1]) return binSearch(pivot, n - 1);
  return binSearch(0, pivot - 1);
}`,
          codes: {
            javascript: `function search(nums, target) {
  const n = nums.length;
  function findPivot() {
    let left = 0;
    let right = n - 1;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (nums[mid] > nums[right]) left = mid + 1;
      else right = mid;
    }
    return left;
  }
  function binSearch(left, right) {
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (nums[mid] === target) return mid;
      if (nums[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    return -1;
  }
  const pivot = findPivot();
  if (target >= nums[pivot] && target <= nums[n - 1]) return binSearch(pivot, n - 1);
  return binSearch(0, pivot - 1);
}`,
            python: `def search(nums, target):
    n = len(nums)
    def find_pivot():
        left = 0
        right = n - 1
        while left < right:
            mid = ((left + right) ) # 2
            if nums[mid] > nums[right]: left = mid + 1
            else: right = mid
        return left
    def bin_search(left, right):
        while left <= right:
            mid = ((left + right) ) # 2
            if nums[mid] == target: return mid
            if nums[mid] < target: left = mid + 1
            else: right = mid - 1
        return -1
    pivot = find_pivot()
    if target >= nums[pivot] and target <= nums[n - 1]: return bin_search(pivot, n - 1)
    return bin_search(0, pivot - 1)`,
            java: `class Solution {
  public int search(int[] nums, int target) {
    int n = nums.length;
    public void findPivot() {
      int left = 0;
      int right = n - 1;
      while (left < right) {
        int mid = ((left + right) / 2);
        if (nums[mid] > nums[right]) left = mid + 1;
        else right = mid;
      }
      return left;
    }
    public void binSearch(left, right) {
      while (left <= right) {
        int mid = ((left + right) / 2);
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
      }
      return -1;
    }
    int pivot = findPivot();
    if (target >= nums[pivot] && target <= nums[n - 1]) return binSearch(pivot, n - 1);
    return binSearch(0, pivot - 1);
  }
}`,
            cpp: `// vector, unordered_map, string
int search(vector<int>& nums, int target) {
  int n = (int)nums.size();
  auto findPivot = [&]() {
    int left = 0;
    int right = n - 1;
    while (left < right) {
      int mid = (int)((left + right) / 2);
      if (nums[mid] > nums[right]) left = mid + 1;
      else right = mid;
    }
    return left;
  }
  auto binSearch = [&](left, right) {
    while (left <= right) {
      int mid = (int)((left + right) / 2);
      if (nums[mid] == target) return mid;
      if (nums[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    return -1;
  }
  int pivot = findPivot();
  if (target >= nums[pivot] && target <= nums[n - 1]) return binSearch(pivot, n - 1);
  return binSearch(0, pivot - 1);
}`,
            c: `/* pass n for array length; simple loops */
int search(int* nums, int n, int target) {
  /* n is the given length */
  void findPivot(/*  */) {
    int left = 0;
    int right = n - 1;
    while (left < right) {
      int mid = ((left + right) / 2);
      if (nums[mid] > nums[right]) left = mid + 1;
      else right = mid;
    }
    return left;
  }
  void binSearch(/* left, right */) {
    while (left <= right) {
      int mid = ((left + right) / 2);
      if (nums[mid] == target) return mid;
      if (nums[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    return -1;
  }
  int pivot = findPivot();
  if (target >= nums[pivot] && target <= nums[n - 1]) return binSearch(pivot, n - 1);
  return binSearch(0, pivot - 1);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(log n)",
          space: "O(1)",
          why: "A single loop. Still log n, but one search instead of pivot-then-search.\nHow it works: if the left side is sorted and target is in that range, shrink right; otherwise go left. Symmetric for a sorted right side.",
          code: `function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}`,
          codes: {
            javascript: `function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}`,
            python: `def search(nums, target):
    left = 0
    right = len(nums) - 1
    while left <= right:
        mid = ((left + right) ) # 2
        if nums[mid] == target: return mid
        if nums[left] <= nums[mid]:
            if nums[left] <= target and target < nums[mid]: right = mid - 1
            else: left = mid + 1
        else:
            if nums[mid] < target and target <= nums[right]: left = mid + 1
            else: right = mid - 1
    return -1`,
            java: `class Solution {
  public int search(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;
    while (left <= right) {
      int mid = ((left + right) / 2);
      if (nums[mid] == target) return mid;
      if (nums[left] <= nums[mid]) {
        if (nums[left] <= target && target < nums[mid]) right = mid - 1;
        else left = mid + 1;
      } else {
        if (nums[mid] < target && target <= nums[right]) left = mid + 1;
        else right = mid - 1;
      }
    }
    return -1;
  }
}`,
            cpp: `// vector, unordered_map, string
int search(vector<int>& nums, int target) {
  int left = 0;
  int right = (int)nums.size() - 1;
  while (left <= right) {
    int mid = (int)((left + right) / 2);
    if (nums[mid] == target) return mid;
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}`,
            c: `/* pass n for array length; simple loops */
int search(int* nums, int n, int target) {
  int left = 0;
  int right = n - 1;
  while (left <= right) {
    int mid = ((left + right) / 2);
    if (nums[mid] == target) return mid;
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}`
          }
        }
      ]
    },
    {
      id: 23,
      level: "beginner",
      q: "Majority Element",
      ask: "Amazon · Microsoft · Google · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/majority-element/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/majority-element-1587115620/1"}],
      a: "The majority element appears more than n/2 times. You may assume it always exists.\n\nExample: [3, 2, 3] -> 3. Example: [2, 2, 1, 1, 1, 2, 2] -> 2.\n\nCount each value with a nested scan. A map counts in one pass. Boyer–Moore keeps a candidate and a vote: the majority survives because it appears more than everyone else combined.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "For each candidate you count how many times it appears. Quadratic comparisons.\nHow it works: if a value’s count is > n/2, return it.",
          code: `function majorityElement(nums) {
  const n = nums.length;
  const need = Math.floor(n / 2);
  for (let i = 0; i < n; i++) {
    let count = 0;
    for (let j = 0; j < n; j++) {
      if (nums[j] === nums[i]) count++;
    }
    if (count > need) return nums[i];
  }
  return nums[0];
}`,
          codes: {
            javascript: `function majorityElement(nums) {
  const n = nums.length;
  const need = Math.floor(n / 2);
  for (let i = 0; i < n; i++) {
    let count = 0;
    for (let j = 0; j < n; j++) {
      if (nums[j] === nums[i]) count++;
    }
    if (count > need) return nums[i];
  }
  return nums[0];
}`,
            python: `def majority_element(nums):
    n = len(nums)
    need = (n ) # 2
    for i in range(n):

        count = 0
        for j in range(n):

            if nums[j] == nums[i]: count += 1

        if count > need: return nums[i]

    return nums[0]`,
            java: `class Solution {
  public int majorityElement(int[] nums) {
    int n = nums.length;
    int need = (n / 2);
    for (int i = 0; i < n; i++) {
      int count = 0;
      for (int j = 0; j < n; j++) {
        if (nums[j] == nums[i]) count++;
      }
      if (count > need) return nums[i];
    }
    return nums[0];
  }
}`,
            cpp: `// vector, unordered_map, string
int majorityElement(vector<int>& nums) {
  int n = (int)nums.size();
  int need = (int)(n / 2);
  for (int i = 0; i < n; i++) {
    int count = 0;
    for (int j = 0; j < n; j++) {
      if (nums[j] == nums[i]) count++;
    }
    if (count > need) return nums[i];
  }
  return nums[0];
}`,
            c: `/* pass n for array length; simple loops */
int majorityElement(int* nums, int n) {
  /* n is the given length */
  int need = (n / 2);
  for (int i = 0; i < n; i++) {
    int count = 0;
    for (int j = 0; j < n; j++) {
      if (nums[j] == nums[i]) count++;
    }
    if (count > need) return nums[i];
  }
  return nums[0];
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "One pass over the list, extra map of distinct values.\nHow it works: increment counts. As soon as a count exceeds n/2, return that key.",
          code: `function majorityElement(nums) {
  const freq = new Map();
  const need = Math.floor(nums.length / 2);
  for (let i = 0; i < nums.length; i++) {
    const x = nums[i];
    freq.set(x, (freq.get(x) || 0) + 1);
    if (freq.get(x) > need) return x;
  }
  return nums[0];
}`,
          codes: {
            javascript: `function majorityElement(nums) {
  const freq = new Map();
  const need = Math.floor(nums.length / 2);
  for (let i = 0; i < nums.length; i++) {
    const x = nums[i];
    freq.set(x, (freq.get(x) || 0) + 1);
    if (freq.get(x) > need) return x;
  }
  return nums[0];
}`,
            python: `def majority_element(nums):
    freq = {}
    need = (len(nums) ) # 2
    for i in range(len(nums)):

        x = nums[i]
        freq[x] = freq.get(x, 0 + 1)
        if freq[x] > need: return x

    return nums[0]`,
            java: `class Solution {
  public int majorityElement(int[] nums) {
    Map<Integer, Integer> freq = new HashMap<>();
    int need = (nums.length / 2);
    for (int i = 0; i < nums.length; i++) {
      int x = nums[i];
      freq.put(x, (freq.getOrDefault(x, 0)) + 1);
      if (freq.get(x) > need) return x;
    }
    return nums[0];
  }
}`,
            cpp: `// vector, unordered_map, string
int majorityElement(vector<int>& nums) {
  unordered_map<int,int> freq;
  int need = (int)((int)nums.size() / 2);
  for (int i = 0; i < (int)nums.size(); i++) {
    int x = nums[i];
    freq[x] = (freq.count(x ? freq[x] : 0) + 1);
    if (freq[x] > need) return x;
  }
  return nums[0];
}`,
            c: `/* pass n for array length; simple loops */
/* linear scan stands in for a hash map */
int map_find(int* keys, int used, int key) {
  int i;
  for (i = 0; i < used; i++) if (keys[i] == key) return i;
  return -1;
}
int majorityElement(int* nums, int n) {
  int freq_keys[1024]; int freq_vals[1024]; int freq_n = 0;
  int need = (n / 2);
  for (int i = 0; i < n; i++) {
    int x = nums[i];
    /* set freq */ + 1);
    if (freq.get(x) > need) return x;
  }
  return nums[0];
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Boyer–Moore: two integers, one pass. Because a majority exists, the last candidate is it.\nHow it works: vote for the current candidate. Matching values add a vote; others subtract. At 0, pick a new candidate.",
          code: `function majorityElement(nums) {
  let candidate = nums[0];
  let vote = 0;
  for (let i = 0; i < nums.length; i++) {
    if (vote === 0) candidate = nums[i];
    vote += nums[i] === candidate ? 1 : -1;
  }
  return candidate;
}`,
          codes: {
            javascript: `function majorityElement(nums) {
  let candidate = nums[0];
  let vote = 0;
  for (let i = 0; i < nums.length; i++) {
    if (vote === 0) candidate = nums[i];
    vote += nums[i] === candidate ? 1 : -1;
  }
  return candidate;
}`,
            python: `def majority_element(nums):
    candidate = nums[0]
    vote = 0
    for i in range(len(nums)):

        if vote == 0: candidate = nums[i]
        1 if vote += nums[i] == candidate else -1

    return candidate`,
            java: `class Solution {
  public int majorityElement(int[] nums) {
    int candidate = nums[0];
    int vote = 0;
    for (int i = 0; i < nums.length; i++) {
      if (vote == 0) candidate = nums[i];
      vote += nums[i] == candidate ? 1 : -1;
    }
    return candidate;
  }
}`,
            cpp: `// vector, unordered_map, string
int majorityElement(vector<int>& nums) {
  int candidate = nums[0];
  int vote = 0;
  for (int i = 0; i < (int)nums.size(); i++) {
    if (vote == 0) candidate = nums[i];
    vote += nums[i] == candidate ? 1 : -1;
  }
  return candidate;
}`,
            c: `/* pass n for array length; simple loops */
int majorityElement(int* nums, int n) {
  int candidate = nums[0];
  int vote = 0;
  for (int i = 0; i < n; i++) {
    if (vote == 0) candidate = nums[i];
    vote += nums[i] == candidate ? 1 : -1;
  }
  return candidate;
}`
          }
        }
      ]
    },
    {
      id: 24,
      level: "beginner",
      q: "Move Zeroes",
      ask: "Meta · Amazon · Apple · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/move-zeroes/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/move-all-zeroes-to-end-of-array0751/1"}],
      a: "Move all zeros to the end. Keep the relative order of the non-zero numbers. Modify the list in place.\n\nExample: [0, 1, 0, 3, 12] -> [1, 3, 12, 0, 0].\n\nBubbling each zero right is quadratic. Building a new list of non-zeros then padding zeros is linear with extra memory. A write pointer copies non-zeros forward, then fills the tail with zeros.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "Each zero may be swapped toward the end across many cells. Worst case quadratic.\nHow it works: when you see a zero, swap it right until a non-zero neighbor is found or you hit the end. Slow, but in place.",
          code: `function moveZeroes(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    if (nums[i] !== 0) continue;
    let j = i + 1;
    while (j < n && nums[j] === 0) j++;
    if (j === n) break;
    const t = nums[i];
    nums[i] = nums[j];
    nums[j] = t;
  }
  return nums;
}`,
          codes: {
            javascript: `function moveZeroes(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    if (nums[i] !== 0) continue;
    let j = i + 1;
    while (j < n && nums[j] === 0) j++;
    if (j === n) break;
    const t = nums[i];
    nums[i] = nums[j];
    nums[j] = t;
  }
  return nums;
}`,
            python: `def move_zeroes(nums):
    n = len(nums)
    for i in range(n):

        if nums[i] != 0: continue
        j = i + 1
        while j < n and nums[j] == 0: j += 1
        if j == n: break
        t = nums[i]
        nums[i] = nums[j]
        nums[j] = t

    return nums`,
            java: `class Solution {
  public int[] moveZeroes(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
      if (nums[i] != 0) continue;
      int j = i + 1;
      while (j < n && nums[j] == 0) j++;
      if (j == n) break;
      int t = nums[i];
      nums[i] = nums[j];
      nums[j] = t;
    }
    return nums;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<int> moveZeroes(vector<int>& nums) {
  int n = (int)nums.size();
  for (int i = 0; i < n; i++) {
    if (nums[i] != 0) continue;
    int j = i + 1;
    while (j < n && nums[j] == 0) j++;
    if (j == n) break;
    int t = nums[i];
    nums[i] = nums[j];
    nums[j] = t;
  }
  return nums;
}`,
            c: `/* pass n for array length; simple loops */
void moveZeroes(int* nums, int n) {
  /* n is the given length */
  for (int i = 0; i < n; i++) {
    if (nums[i] != 0) continue;
    int j = i + 1;
    while (j < n && nums[j] == 0) j++;
    if (j == n) break;
    int t = nums[i];
    nums[i] = nums[j];
    nums[j] = t;
  }
  return nums;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Extra array holds the compacted values, then you copy back.\nHow it works: collect non-zeros, append zeros until length n, copy into nums.",
          code: `function moveZeroes(nums) {
  const extra = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) extra.push(nums[i]);
  }
  while (extra.length < nums.length) extra.push(0);
  for (let i = 0; i < nums.length; i++) nums[i] = extra[i];
  return nums;
}`,
          codes: {
            javascript: `function moveZeroes(nums) {
  const extra = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) extra.push(nums[i]);
  }
  while (extra.length < nums.length) extra.push(0);
  for (let i = 0; i < nums.length; i++) nums[i] = extra[i];
  return nums;
}`,
            python: `def move_zeroes(nums):
    extra = []
    for i in range(len(nums)):

        if nums[i] != 0: extra.append(nums[i])

    while len(extra) < len(nums): extra.append(0)
    for i in range(len(nums)):
        nums[i] = extra[i]
    return nums`,
            java: `class Solution {
  public int[] moveZeroes(int[] nums) {
    List<Integer> extra = new ArrayList<>();
    for (int i = 0; i < nums.length; i++) {
      if (nums[i] != 0) extra.add(nums[i]);
    }
    while (extra.size() < nums.length) extra.add(0);
    for (int i = 0; i < nums.length; i++) nums[i] = extra[i];
    return nums;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<int> moveZeroes(vector<int>& nums) {
  vector<int> extra;
  for (int i = 0; i < (int)nums.size(); i++) {
    if (nums[i] != 0) extra.push_back(nums[i]);
  }
  while ((int)extra.size() < (int)nums.size()) extra.push_back(0);
  for (int i = 0; i < (int)nums.size(); i++) nums[i] = extra[i];
  return nums;
}`,
            c: `/* pass n for array length; simple loops */
void moveZeroes(int* nums, int n) {
  int extra[1024]; int extra_n = 0;
  for (int i = 0; i < n; i++) {
    if (nums[i] != 0) /* push */(nums[i]);
  }
  while (extra_len < n) /* push */(0);
  for (int i = 0; i < n; i++) nums[i] = extra[i];
  return nums;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "One write index, two linear passes, no extra list.\nHow it works: copy each non-zero to write and increment write. Then fill nums[write..] with 0.",
          code: `function moveZeroes(nums) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      nums[write] = nums[read];
      write++;
    }
  }
  while (write < nums.length) {
    nums[write] = 0;
    write++;
  }
  return nums;
}`,
          codes: {
            javascript: `function moveZeroes(nums) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      nums[write] = nums[read];
      write++;
    }
  }
  while (write < nums.length) {
    nums[write] = 0;
    write++;
  }
  return nums;
}`,
            python: `def move_zeroes(nums):
    write = 0
    for read in range(len(nums)):

        if nums[read] != 0:
            nums[write] = nums[read]
            write += 1

    while write < len(nums):
        nums[write] = 0
        write += 1
    return nums`,
            java: `class Solution {
  public int[] moveZeroes(int[] nums) {
    int write = 0;
    for (int read = 0; read < nums.length; read++) {
      if (nums[read] != 0) {
        nums[write] = nums[read];
        write++;
      }
    }
    while (write < nums.length) {
      nums[write] = 0;
      write++;
    }
    return nums;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<int> moveZeroes(vector<int>& nums) {
  int write = 0;
  for (int read = 0; read < (int)nums.size(); read++) {
    if (nums[read] != 0) {
      nums[write] = nums[read];
      write++;
    }
  }
  while (write < (int)nums.size()) {
    nums[write] = 0;
    write++;
  }
  return nums;
}`,
            c: `/* pass n for array length; simple loops */
void moveZeroes(int* nums, int n) {
  int write = 0;
  for (int read = 0; read < n; read++) {
    if (nums[read] != 0) {
      nums[write] = nums[read];
      write++;
    }
  }
  while (write < n) {
    nums[write] = 0;
    write++;
  }
  return nums;
}`
          }
        }
      ]
    },
    {
      id: 25,
      level: "beginner",
      q: "Missing Number",
      ask: "Amazon · Microsoft · Google · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/missing-number/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/missing-number-in-array1416/1"}],
      a: "nums holds n distinct numbers from the range 0..n, except one missing value. Return the missing number.\n\nExample: [3, 0, 1] -> 2.\n\nFor each candidate 0..n you can scan the array. Sorting then looking for a gap is faster. Gauss’s sum (or XOR of indexes and values) is one pass and constant extra memory.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "For each candidate you scan the whole list. n+1 candidates times n looks.\nHow it works: if value x is never found in nums, x is missing.",
          code: `function missingNumber(nums) {
  const n = nums.length;
  for (let x = 0; x <= n; x++) {
    let found = false;
    for (let i = 0; i < n; i++) {
      if (nums[i] === x) { found = true; break; }
    }
    if (!found) return x;
  }
  return -1;
}`,
          codes: {
            javascript: `function missingNumber(nums) {
  const n = nums.length;
  for (let x = 0; x <= n; x++) {
    let found = false;
    for (let i = 0; i < n; i++) {
      if (nums[i] === x) { found = true; break; }
    }
    if (!found) return x;
  }
  return -1;
}`,
            python: `def missing_number(nums):
    n = len(nums)
    for x in range(= n):

        found = False
        for i in range(n):

            if nums[i] == x: { found = True break }

        if not found: return x

    return -1`,
            java: `class Solution {
  public int missingNumber(int[] nums) {
    int n = nums.length;
    for (int x = 0; x <= n; x++) {
      boolean found = false;
      for (int i = 0; i < n; i++) {
        if (nums[i] == x) { found = true; break; }
      }
      if (!found) return x;
    }
    return -1;
  }
}`,
            cpp: `// vector, unordered_map, string
int missingNumber(vector<int>& nums) {
  int n = (int)nums.size();
  for (int x = 0; x <= n; x++) {
    bool found = false;
    for (int i = 0; i < n; i++) {
      if (nums[i] == x) { found = true; break; }
    }
    if (!found) return x;
  }
  return -1;
}`,
            c: `/* pass n for array length; simple loops */
int missingNumber(int* nums, int n) {
  /* n is the given length */
  for (int x = 0; x <= n; x++) {
    int found = 0;
    for (int i = 0; i < n; i++) {
      if (nums[i] == x) { found = 1; break; }
    }
    if (!found) return x;
  }
  return -1;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n log n)",
          space: "O(n)",
          why: "Copy and sort, then a linear gap check. Sorting dominates.\nHow it works: after sort, index i should hold i. The first mismatch is the missing number. If the list is 0..n-1, n is missing.",
          code: `function missingNumber(nums) {
  const list = nums.slice().sort(function (a, b) { return a - b; });
  for (let i = 0; i < list.length; i++) {
    if (list[i] !== i) return i;
  }
  return list.length;
}`,
          codes: {
            javascript: `function missingNumber(nums) {
  const list = nums.slice().sort(function (a, b) { return a - b; });
  for (let i = 0; i < list.length; i++) {
    if (list[i] !== i) return i;
  }
  return list.length;
}`,
            python: `def missing_number(nums):
    list = sorted(nums)
    for i in range(len(list)):

        if list[i] != i: return i

    return len(list)`,
            java: `class Solution {
  public int missingNumber(int[] nums) {
    int[] list = nums.clone();
    Arrays.sort(list);
    for (int i = 0; i < list.length; i++) {
      if (list[i] != i) return i;
    }
    return list.length;
  }
}`,
            cpp: `// vector, unordered_map, string
int missingNumber(vector<int>& nums) {
  vector<int> list = nums;
  sort(list.begin(), list.end());
  for (int i = 0; i < (int)list.size(); i++) {
    if (list[i] != i) return i;
  }
  return (int)list.size();
}`,
            c: `/* pass n for array length; simple loops */
int missingNumber(int* nums, int n) {
  int list = /* sorted copy */;
  for (int i = 0; i < n; i++) {
    if (list[i] != i) return i;
  }
  return n;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "XOR cancels pairs. Indexes 0..n XOR all values leaves the missing one. No overflow the way a large sum might in other languages (JS numbers are fine here too).\nHow it works: start missing = n. XOR i and nums[i] for every i. The leftover is the missing number.",
          code: `function missingNumber(nums) {
  const n = nums.length;
  let missing = n;
  for (let i = 0; i < n; i++) {
    missing = missing ^ i ^ nums[i];
  }
  return missing;
}`,
          codes: {
            javascript: `function missingNumber(nums) {
  const n = nums.length;
  let missing = n;
  for (let i = 0; i < n; i++) {
    missing = missing ^ i ^ nums[i];
  }
  return missing;
}`,
            python: `def missing_number(nums):
    n = len(nums)
    missing = n
    for i in range(n):

        missing = missing ^ i ^ nums[i]

    return missing`,
            java: `class Solution {
  public int missingNumber(int[] nums) {
    int n = nums.length;
    int missing = n;
    for (int i = 0; i < n; i++) {
      missing = missing ^ i ^ nums[i];
    }
    return missing;
  }
}`,
            cpp: `// vector, unordered_map, string
int missingNumber(vector<int>& nums) {
  int n = (int)nums.size();
  int missing = n;
  for (int i = 0; i < n; i++) {
    missing = missing ^ i ^ nums[i];
  }
  return missing;
}`,
            c: `/* pass n for array length; simple loops */
int missingNumber(int* nums, int n) {
  /* n is the given length */
  int missing = n;
  for (int i = 0; i < n; i++) {
    missing = missing ^ i ^ nums[i];
  }
  return missing;
}`
          }
        }
      ]
    },
    {
      id: 26,
      level: "beginner",
      q: "Two Sum II - Input Array Is Sorted",
      ask: "Amazon · Google · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/given-an-array-a-and-a-number-x-check-for-pair-in-a-with-sum-as-x/"}],
      a: "A 1-indexed sorted array. Return the two indexes (1-based) whose values add to target. Exactly one solution. Do not reuse an index.\n\nExample: numbers = [2, 7, 11, 15], target = 9. Answer [1, 2] because 2 + 7 = 9.\n\nBrute tries every pair. Optimal binary-searches the partner of each value. More optimal is two pointers from both ends.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "Outer index i, inner j > i. First pair that sums to target is the answer. Works, ignores the sorted hint.",
          code: `function twoSum(numbers, target) {
  const n = numbers.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (numbers[i] + numbers[j] === target) return [i + 1, j + 1];
    }
  }
  return [];
}`,
          codes: {
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
          }
        },
        {
          name: "Optimal",
          time: "O(n log n)",
          space: "O(1)",
          why: "For each left value, binary search target - numbers[i] on the right side. Sorted order makes the search legal. Extra log n versus two pointers.",
          code: `function twoSum(numbers, target) {
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
          codes: {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Left at start, right at end. Sum too small: left++. Sum too big: right--. Sorted order guarantees you never miss the pair. Interview finish line.",
          code: `function twoSum(numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`,
          codes: {
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
          }
        }
      ]
    },
    {
      id: 27,
      level: "intermediate",
      q: "4Sum",
      ask: "Amazon · Google · Microsoft · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/4sum/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/find-all-four-sum-numbers/1"}],
      a: "Return all unique quadruplets [a, b, c, d] such that they add to target. Indexes must be distinct. Order inside a quadruplet does not matter; do not emit duplicates.\n\nExample: nums = [1, 0, -1, 0, -2, 2], target = 0. One answer is [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]].\n\nBrute is four loops. Optimal is three loops plus a hash set. More optimal sorts, then two loops plus two pointers, skipping clones.",
      solutions: [
        {
          name: "Brute",
          time: "O(n^4)",
          space: "O(1) extra",
          why: "Four nested indexes. Sort each hit so a set of strings can drop duplicates. Correct and too slow.",
          code: `function fourSum(nums, target) {
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
          codes: {
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
          }
        },
        {
          name: "Optimal",
          time: "O(n^3)",
          space: "O(n)",
          why: "Fix i, j, k. Look up target - (a+b+c) in a set of values after k. Still cubic, extra set, duplicates need care. A stepping stone to two pointers.",
          code: `function fourSum(nums, target) {
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
          codes: {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n^3)",
          space: "O(1) extra",
          why: "Sort. Fix i and j. Two pointers on the rest. Skip duplicate i, j, left, and right. Use 64-bit sums if the language overflows. This is the expected answer.",
          code: `function fourSum(nums, target) {
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
          codes: {
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
          }
        }
      ]
    },
    {
      id: 28,
      level: "intermediate",
      q: "3Sum Closest",
      ask: "Amazon · Google · Microsoft · Bloomberg",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/3sum-closest/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/triplet-sum-closest-to-x1114/1"}],
      a: "Find three numbers whose sum is as close as possible to target. Return that sum (not the triple). Exactly one best sum is guaranteed.\n\nExample: nums = [-1, 2, 1, -4], target = 1. The sum 2 is closest ( -1 + 2 + 1 ).\n\nBrute tries every triple. Optimal sorts then binary-searches the third value. More optimal is sort plus two pointers, tracking the closest sum.",
      solutions: [
        {
          name: "Brute",
          time: "O(n³)",
          space: "O(1)",
          why: "Every triple, track the sum whose absolute gap to target is smallest.",
          code: `function threeSumClosest(nums, target) {
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
          codes: {
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
          }
        },
        {
          name: "Optimal",
          time: "O(n² log n)",
          space: "O(n)",
          why: "Sort. Fix two indexes, binary search the value closest to the leftover. Extra log n on each pair.",
          code: `function threeSumClosest(nums, target) {
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
          codes: {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n²)",
          space: "O(1) extra",
          why: "Sort. Fix i. Two pointers on the rest. Move the side that improves the sum. Track the closest. Stop early on an exact hit.",
          code: `function threeSumClosest(nums, target) {
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
          codes: {
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
          }
        }
      ]
    },
    {
      id: 29,
      level: "beginner",
      q: "Plus One",
      ask: "Google · Amazon · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/plus-one/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/plus-one/"}],
      a: "digits is a non-negative integer, most significant digit first, no leading zeros. Add one and return the new digit array.\n\nExample: [1, 2, 3] becomes [1, 2, 4]. [9, 9] becomes [1, 0, 0].\n\nBrute joins into a big number (breaks on overflow in fixed ints). Optimal walks from the right with carry into a new array. More optimal edits in place and only allocates if every digit was 9.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Build a string / BigInt, add one, split back to digits. Fine in JS/Python, illegal in Java int, and not the interview idea.",
          code: `function plusOne(digits) {
  let s = "";
  for (let i = 0; i < digits.length; i++) s += String(digits[i]);
  const t = String(BigInt(s) + 1n);
  const out = [];
  for (let i = 0; i < t.length; i++) out.push(t.charCodeAt(i) - 48);
  return out;
}`,
          codes: {
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
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Copy into a new array. From the last index, add 1 and propagate carry. If carry remains, allocate one extra leading 1.",
          code: `function plusOne(digits) {
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
          codes: {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1) extra if no new digit",
          why: "Walk from the right on the input. A digit < 9 becomes digit+1 and you return immediately. All nines become a new array [1, 0, 0, ...].",
          code: `function plusOne(digits) {
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
          codes: {
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
          }
        }
      ]
    },
    {
      id: 30,
      level: "beginner",
      q: "Pascal's Triangle",
      ask: "Amazon · Google · Microsoft · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/pascals-triangle/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/pascal-triangle/1"}],
      a: "Return the first numRows of Pascal's triangle. Row i has i numbers. Each inner value is the sum of the two values above it. Rows are 1-indexed in speech, 0-indexed in arrays.\n\nExample: numRows = 5 yields [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]].\n\nBrute uses nCr for every cell. Optimal builds each row from the previous. More optimal fills a row with the multiplicative formula C(r, k) = C(r, k-1) * (r-k+1)/k.",
      solutions: [
        {
          name: "Brute",
          time: "O(n³) with naive fact",
          space: "O(n²)",
          why: "Each cell is nCr. Computing factorials from scratch per cell is slow and overflows. Picture is right, implementation is not the interview one.",
          code: `function generate(numRows) {
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
          codes: {
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
          }
        },
        {
          name: "Optimal",
          time: "O(n²)",
          space: "O(n²)",
          why: "Row 0 is [1]. Each next row starts and ends with 1. Inner slot j is prev[j-1] + prev[j]. No overflow beyond 32-bit on the usual n <= 30 constraint.",
          code: `function generate(numRows) {
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
          codes: {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n²)",
          space: "O(n²)",
          why: "Each row built independently with the running product formula. Useful when you only need row r (Pascal's Triangle II) and do not want the whole triangle.",
          code: `function generate(numRows) {
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
          codes: {
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
          }
        }
      ]
    },
    {
      id: 31,
      level: "intermediate",
      q: "Find All Duplicates in an Array",
      ask: "Amazon · Google · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/find-all-duplicates-in-an-array/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/find-duplicates-in-an-array/1"}],
      a: "nums holds n integers, each in 1..n. Some appear twice, the rest once. Return every value that appears twice. O(n) time and O(1) extra space is the follow-up (you may mutate nums).\n\nExample: [4, 3, 2, 7, 8, 2, 3, 1] answers [2, 3].\n\nBrute is nested counts. Optimal sorts. More optimal marks index abs(x)-1 negative; a second negative means a duplicate.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "For each value, count how many times it appears. Push it once if the count is 2. Slow, no extra set.",
          code: `function findDuplicates(nums) {
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
          codes: {
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
          }
        },
        {
          name: "Optimal",
          time: "O(n log n)",
          space: "O(1) extra",
          why: "Sort, then walk adjacent pairs. Equal neighbors are a duplicate. Simple, mutates order.",
          code: `function findDuplicates(nums) {
  const a = nums.slice().sort(function (x, y) { return x - y; });
  const out = [];
  for (let i = 1; i < a.length; i++) {
    if (a[i] === a[i - 1]) out.push(a[i]);
  }
  return out;
}`,
          codes: {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1) extra",
          why: "Value x belongs at index x-1. Negate that slot when you first see x. If it is already negative, x is the duplicate. Restore signs later if you must.",
          code: `function findDuplicates(nums) {
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    const x = nums[i] < 0 ? -nums[i] : nums[i];
    const slot = x - 1;
    if (nums[slot] < 0) out.push(x);
    else nums[slot] = -nums[slot];
  }
  return out;
}`,
          codes: {
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
          }
        }
      ]
    },
    {
      id: 32,
      level: "beginner",
      q: "Find All Numbers Disappeared in an Array",
      ask: "Google · Amazon · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/find-all-numbers-disappeared-in-an-array/"}],
      a: "nums has length n. Values are in 1..n. Some numbers in 1..n never appear (replaced by duplicates). Return the missing ones. Follow-up: O(n) time, O(1) extra, you may mutate nums.\n\nExample: [4, 3, 2, 7, 8, 2, 3, 1] answers [5, 6].\n\nBrute checks 1..n with a scan. Optimal uses a boolean / set. More optimal negates index x-1, then collects indexes that stayed positive.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "For each candidate v in 1..n, scan the array. If it never appears, it is missing.",
          code: `function findDisappearedNumbers(nums) {
  const n = nums.length;
  const out = [];
  for (let v = 1; v <= n; v++) {
    let found = false;
    for (let i = 0; i < n; i++) if (nums[i] === v) { found = true; break; }
    if (!found) out.push(v);
  }
  return out;
}`,
          codes: {
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
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "A boolean array (or a set) of seen values. Then walk 1..n and collect the false slots.",
          code: `function findDisappearedNumbers(nums) {
  const n = nums.length;
  const seen = Array(n + 1).fill(false);
  for (let i = 0; i < n; i++) seen[nums[i]] = true;
  const out = [];
  for (let v = 1; v <= n; v++) if (!seen[v]) out.push(v);
  return out;
}`,
          codes: {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1) extra",
          why: "For each value x, negate nums[abs(x)-1]. Values whose slots stay positive never appeared. Same marking trick as Find All Duplicates.",
          code: `function findDisappearedNumbers(nums) {
  for (let i = 0; i < nums.length; i++) {
    const x = nums[i] < 0 ? -nums[i] : nums[i];
    const slot = x - 1;
    if (nums[slot] > 0) nums[slot] = -nums[slot];
  }
  const out = [];
  for (let i = 0; i < nums.length; i++) if (nums[i] > 0) out.push(i + 1);
  return out;
}`,
          codes: {
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
          }
        }
      ]
    },
    {
      id: 33,
      level: "intermediate",
      q: "Rotate Image",
      ask: "Amazon · Google · Microsoft · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/rotate-image/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/rotate-by-90-degree-1587115621/1"}],
      a: "Rotate an n by n matrix 90 degrees clockwise, in place.\n\nExample: [[1,2,3],[4,5,6],[7,8,9]] becomes [[7,4,1],[8,5,2],[9,6,3]].\n\nBrute writes into a new matrix. Optimal transposes then reverses each row. More optimal rotates 4-cycles on each layer so you never allocate n² extra cells.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(n²)",
          why: "new[c][n-1-r] = old[r][c]. Copy back. Clear picture, extra matrix.",
          code: `function rotate(matrix) {
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
          codes: {
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
          }
        },
        {
          name: "Optimal",
          time: "O(n²)",
          space: "O(1)",
          why: "Transpose (swap across the diagonal) then reverse each row. Two easy passes, in place.",
          code: `function rotate(matrix) {
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
          codes: {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n²)",
          space: "O(1)",
          why: "Layer by layer. For each offset, rotate the four cells of the cycle in one temp. Same work, no transpose helper. Nice to draw on a whiteboard.",
          code: `function rotate(matrix) {
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
          codes: {
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
          }
        }
      ]
    },
    {
      id: 34,
      level: "intermediate",
      q: "Valid Sudoku",
      ask: "Amazon · Apple · Google · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/valid-sudoku/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/is-sudoku-valid4825/1"}],
      a: "A 9 by 9 board of digits and '.'. Return true if every filled row, column, and 3 by 3 box has no duplicate digit. Empty cells are ignored. The board does not have to be a completed puzzle.\n\nExample: a standard valid (partial) grid returns true. Two 8s in the same box returns false.\n\nBrute, for each filled cell, rescans its row, column, and box. Optimal uses 27 sets. More optimal packs the same idea into bitmasks.",
      solutions: [
        {
          name: "Brute",
          time: "O(1) for 9x9",
          space: "O(1)",
          why: "For every filled cell, walk its row, column, and 3x3 box looking for the same digit elsewhere. On a 9x9 this is constant, but the nested scans are noisy.",
          code: `function isValidSudoku(board) {
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
          codes: {
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
          }
        },
        {
          name: "Optimal",
          time: "O(1)",
          space: "O(1)",
          why: "Nine sets for rows, nine for columns, nine for boxes. Box id is (r/3)*3 + c/3. Fail on the first repeat.",
          code: `function isValidSudoku(board) {
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
          codes: {
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
          }
        },
        {
          name: "More optimal",
          time: "O(1)",
          space: "O(1)",
          why: "Nine ints for rows, columns, boxes. Bit (1 << digit) marks a used number. A second hit on the same bit is a duplicate. Same logic, no hash sets.",
          code: `function isValidSudoku(board) {
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
          codes: {
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
          }
        }
      ]
    },
    {
      id: 35,
      level: "intermediate",
      q: "Subarray Product Less Than K",
      ask: "Amazon · Google · Bloomberg",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/subarray-product-less-than-k/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/count-the-subarrays-having-product-less-than-k1708/1"}],
      a: "Count contiguous subarrays whose product is strictly less than k. nums[i] >= 1.\n\nExample: nums = [10, 5, 2, 6], k = 100. Answer 8: [10], [5], [2], [6], [10,5], [5,2], [2,6], [5,2,6].\n\nBrute multiplies every subarray. Optimal nested loops that break when the running product hits k. More optimal is a sliding window: all-positive so you only shrink from the left.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "For each L, grow R, multiply. Count when prod < k. Watch overflow in fixed-width ints; JS numbers are fine for the usual constraints.",
          code: `function numSubarrayProductLessThanK(nums, k) {
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
          codes: {
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
          }
        },
        {
          name: "Optimal",
          time: "O(n²)",
          space: "O(1)",
          why: "Same nested loops, but this is already the best brute because products only grow (nums >= 1) so you can break. Still quadratic worst case when k is huge.",
          code: `function numSubarrayProductLessThanK(nums, k) {
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
          codes: {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Window [left, right]. Multiply nums[right]. While product >= k, divide nums[left] and left++. Every new right adds (right-left+1) subarrays that end at right. If k <= 1 the answer is 0.",
          code: `function numSubarrayProductLessThanK(nums, k) {
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
          codes: {
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
          }
        }
      ]
    },
    {
      id: 36,
      level: "intermediate",
      q: "Gas Station",
      ask: "Amazon · Google · Microsoft · Bloomberg",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/gas-station/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/circular-tour-1587115620/1"}],
      a: "n stations on a circle. gas[i] is fuel you get, cost[i] is fuel to reach i+1. Start with an empty tank. Return the unique start index that lets you complete one loop, or -1.\n\nExample: gas = [1, 2, 3, 4, 5], cost = [3, 4, 5, 1, 2]. Start at index 3.\n\nBrute tries every start and walks the circle. Optimal first checks total gas >= total cost, then still tries starts. More optimal is one pass: if the tank goes negative, the next start is i+1.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "From each start, simulate the circle. Fail when the tank goes negative. Return the first start that finishes n steps.",
          code: `function canCompleteCircuit(gas, cost) {
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
          codes: {
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
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(1)",
          why: "If the total of gas[i]-cost[i] is negative, no start works. Otherwise try starts in order but skip a failed prefix using a leftover tank. Still a linear check plus a second idea.",
          code: `function canCompleteCircuit(gas, cost) {
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
          codes: {
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
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "One pass. tank is the fuel since the current start. If tank drops below 0, no start in [oldStart, i] works, so start = i+1 and tank = 0. If the total is negative, return -1. Unique start is guaranteed.",
          code: `function canCompleteCircuit(gas, cost) {
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
          codes: {
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
          }
        }
      ]
    }
  ]
};
