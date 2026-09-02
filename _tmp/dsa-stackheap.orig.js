window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["dsa-stackheap"] = {
  kind: "dsa",
  notes: [
    { title: "Stack (LIFO)", body: "A stack is last in, first out. Push adds on top. Pop removes the top. Peek reads the top without removing it. The call stack, undo, matching brackets, and 'next greater' walks are stacks. In JavaScript an array with push and pop is a stack." },
    { title: "Queue (FIFO)", body: "A queue is first in, first out. Enqueue adds at the back. Dequeue removes the front. BFS is a queue. In JavaScript, push plus shift is a queue (shift is O(n), fine for interviews). A ring buffer or two stacks can make dequeue cheaper." },
    { title: "Monotonic stack", body: "A monotonic stack keeps values increasing or decreasing. You pop while the new value breaks the order. What you pop has found its 'next greater' (or next smaller). Daily temperatures, next greater element, largest rectangle in a histogram, and car fleet all use this pattern." },
    { title: "Heap / priority queue", body: "A heap is a binary tree in an array where the parent is smaller (min-heap) or larger (max-heap) than its children. Index 0 is the root. Parent of i is (i-1)>>1. Children are 2i+1 and 2i+2. Push bubbles up. Pop swaps last to root and bubbles down. JavaScript has no built-in heap; interviews accept a tiny helper or sort when n is small." },
    { title: "Top-K pattern", body: "Need the k biggest or most frequent items? Count first if needed. Then either sort O(n log n), keep a min-heap of size k O(n log k), or bucket by count O(n). Say all three in an interview. Heap wins when k is tiny and n is huge." },
    { title: "Two heaps", body: "Median of a stream: a max-heap of the lower half and a min-heap of the upper half. Keep sizes equal or lower one bigger. The median is the lower top, or the average of both tops. Rebalance after every insert." },
    { title: "Two stacks as a queue", body: "In-stack receives pushes. Out-stack serves pops. When out is empty, pour in into out (that reverses order). Each item moves at most twice, so pop is amortized O(1). The brute version pours back and forth on every call." },
    { title: "Deque for window max", body: "A deque (double-ended queue) of indices, values decreasing from front to back. The front is the max of the current window. Pop back while the new value is larger. Pop front when it slides out of the window. Each index enters and leaves once: O(n)." },
    { title: "Nested decode with a stack", body: "Strings like 3[a2[c]] need a stack of frames. A digit builds a count. '[' pushes the current string and count. Letters append to the current string. ']' pops and repeats. Recursion is the same idea with the call stack." },
    { title: "Interview habit", body: "Name the structure in one sentence: 'monotonic stack of indices' or 'min-heap of size k'. State time and space. For heap problems, mention sort first, then the heap, then a linear trick if one exists (bucket sort, math formula). Walk a 4-item example on the board." }
  ],
  examples: [
    {
      lang: "js",
      title: "1. Array as a stack",
      desc: "What this is\npush adds on top. pop removes the top. The last index is the top.\n\nWhat the code is doing\nst starts empty. push 10 then 20. pop returns 20, so 10 is left.\n\nWatch out\npop on an empty array returns undefined. Peek is st[st.length - 1].",
      code: `const st = [];
st.push(10);
st.push(20);
console.log(st.pop()); // 20
console.log(st[st.length - 1]); // 10, peek`
    },
    {
      lang: "js",
      title: "2. Array as a queue",
      desc: "What this is\npush adds at the back. shift removes the front.\n\nWhat the code is doing\nq gets 1 then 2. shift returns 1, the oldest item.\n\nWatch out\nshift is O(n) because every later item slides left. For interview BFS this is still the usual queue.",
      code: `const q = [];
q.push(1);
q.push(2);
console.log(q.shift()); // 1
console.log(q[0]);      // 2, front`
    },
    {
      lang: "js",
      title: "3. Monotonic stack (next greater)",
      desc: "What this is\nWalk left to right. Pop smaller (or equal) indices while the new value is bigger. Those popped indices just found their next greater.\n\nWhat the code is doing\nans starts as -1 for each index. For [2,1,3] index 0 pops when 3 arrives, so ans[0] becomes 3. Index 1 also pops, ans[1] becomes 3.\n\nWatch out\nStore indices, not values, when you also need the distance (daily temperatures).",
      code: `function nextGreater(nums) {
  const ans = Array(nums.length).fill(-1);
  const st = [];
  for (let i = 0; i < nums.length; i++) {
    while (st.length && nums[st[st.length - 1]] < nums[i]) {
      ans[st.pop()] = nums[i];
    }
    st.push(i);
  }
  return ans;
}`
    },
    {
      lang: "js",
      title: "4. Tiny min-heap",
      desc: "What this is\nA binary min-heap in an array. Smallest key() sits at index 0.\n\nWhat the code is doing\npush appends then bubbleUp. pop swaps the last item to the root then bubbleDown. key defaults to pair[0] so [priority, value] works.\n\nWatch out\nThis is not a library. Copy the helper into a solution when you need a real heap. For stale Dijkstra entries, skip pops whose distance is worse than dist[node].",
      code: `function MinHeap(keyFn) {
  this.a = [];
  this.key = keyFn || function (x) { return x; };
  this.size = function () { return this.a.length; };
  this.peek = function () { return this.a[0]; };
  this.push = function (x) {
    this.a.push(x);
    this.up(this.a.length - 1);
  };
  this.pop = function () {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) { this.a[0] = last; this.down(0); }
    return top;
  };
  this.up = function (i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.key(this.a[i]) >= this.key(this.a[p])) break;
      const t = this.a[i]; this.a[i] = this.a[p]; this.a[p] = t;
      i = p;
    }
  };
  this.down = function (i) {
    const n = this.a.length;
    while (true) {
      let s = i;
      const l = i * 2 + 1, r = l + 1;
      if (l < n && this.key(this.a[l]) < this.key(this.a[s])) s = l;
      if (r < n && this.key(this.a[r]) < this.key(this.a[s])) s = r;
      if (s === i) break;
      const t = this.a[i]; this.a[i] = this.a[s]; this.a[s] = t;
      i = s;
    }
  };
}`
    },
    {
      lang: "js",
      title: "5. Two stacks make a queue",
      desc: "What this is\nPush into inStack. Pop from outStack. When outStack is empty, pour inStack into it.\n\nWhat the code is doing\npush(1) then push(2) sit in inStack as [1,2]. First pop pours so outStack is [2,1], then pops 1.\n\nWatch out\nDo not pour if outStack still has items. That would scramble the order.",
      code: `const inSt = [];
const outSt = [];
function enqueue(x) { inSt.push(x); }
function dequeue() {
  if (!outSt.length) {
    while (inSt.length) outSt.push(inSt.pop());
  }
  return outSt.pop();
}`
    },
    {
      lang: "js",
      title: "6. Deque for window maximum",
      desc: "What this is\nA deque of indices, values decreasing. Front is the max of the window [i-k+1, i].\n\nWhat the code is doing\nWhile the back is smaller than nums[i], pop it (it can never be max while i is in the window). Drop the front if it left the window. Then the front is the answer for this i.\n\nWatch out\nPush indices, not values, so you know when the front slides out.",
      code: `function windowMax(nums, k) {
  const dq = [];
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
    dq.push(i);
    if (dq[0] <= i - k) dq.shift();
    if (i >= k - 1) out.push(nums[dq[0]]);
  }
  return out;
}`
    },
    {
      lang: "js",
      title: "7. Two heaps (median idea)",
      desc: "What this is\nLower half is a max-heap (store negated values in a min-heap). Upper half is a min-heap. Sizes stay equal or lower is one bigger.\n\nWhat the code is doing\nInsert 1, then 5, then 2. After rebalance, lower top is 2 and upper top is 5. Median of three is 2.\n\nWatch out\nAlways rebalance after insert. If you forget, the two tops are not the middle of the stream.",
      code: `// picture only: lower = max-heap, upper = min-heap
// after [1, 5, 2]:
const lowerTop = 2; // max of lower half
const upperTop = 5; // min of upper half
const n = 3;
const median = n % 2 ? lowerTop : (lowerTop + upperTop) / 2;`
    },
    {
      lang: "js",
      title: "8. Decode frame stack",
      desc: "What this is\nEach '[' saves the string built so far and the repeat count. Letters append. ']' pops and repeats.\n\nWhat the code is doing\nFor 3[a], count becomes 3, '[' pushes \"\" and 3, then cur is a, ']' makes aaa.\n\nWatch out\nCounts can be more than one digit: 12[a]. Multiply k = k * 10 + digit as you go.",
      code: `function decodeTiny(s) {
  const st = [];
  let cur = "";
  let k = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch >= "0" && ch <= "9") k = k * 10 + Number(ch);
    else if (ch === "[") {
      st.push([cur, k]);
      cur = "";
      k = 0;
    } else if (ch === "]") {
      const frame = st.pop();
      cur = frame[0] + cur.repeat(frame[1]);
    } else cur += ch;
  }
  return cur;
}`
    },
    {
      lang: "js",
      title: "9. Sort vs heap for top-k",
      desc: "What this is\nSort is the honest Optimal when you do not want to code a heap. A size-k min-heap is the upgrade.\n\nWhat the code is doing\nsortDesc sorts a copy and slices k. heapK keeps only k items: if the heap is full and x is bigger than the peek, replace the peek.\n\nWatch out\nA min-heap of size k holds the k largest: the smallest of those k sits at the top.",
      code: `function topKSort(nums, k) {
  return nums.slice().sort(function (a, b) { return b - a; }).slice(0, k);
}

function topKHeap(nums, k, heap) {
  for (let i = 0; i < nums.length; i++) {
    if (heap.size() < k) heap.push(nums[i]);
    else if (nums[i] > heap.peek()) { heap.pop(); heap.push(nums[i]); }
  }
  const out = [];
  while (heap.size()) out.push(heap.pop());
  return out;
}`
    }
  ],
  questions: [
    {
      id: 1,
      level: "beginner",
      q: "Min Stack",
      ask: "Amazon · Google · Bloomberg · Microsoft",
      a: "Design a stack that supports push, pop, top, and getMin in O(1) time. getMin returns the smallest value still in the stack.\n\nExample: push 3, push 5, getMin is 3, push 2, getMin is 2, pop, getMin is 3 again.\n\nBrute scans on every getMin. Optimal keeps a second stack of mins. More optimal stores [value, minSoFar] pairs on one stack.",
      solutions: [
        {
          name: "Brute",
          time: "O(n) getMin",
          space: "O(n)",
          why: "A plain array. getMin walks every item. Correct, but the interview asks for O(1) getMin.",
          code: `function MinStack() {
  this.a = [];
}
MinStack.prototype.push = function (val) { this.a.push(val); };
MinStack.prototype.pop = function () { this.a.pop(); };
MinStack.prototype.top = function () { return this.a[this.a.length - 1]; };
MinStack.prototype.getMin = function () {
  let m = this.a[0];
  for (let i = 1; i < this.a.length; i++) if (this.a[i] < m) m = this.a[i];
  return m;
};`
        },
        {
          name: "Optimal",
          time: "O(1)",
          space: "O(n)",
          why: "mins tracks the current minimum. Push val onto mins if it is <= current min. Pop mins when the popped value equals mins top. Duplicate mins matter: use <= so two equal mins both sit on mins.",
          code: `function MinStack() {
  this.st = [];
  this.mins = [];
}
MinStack.prototype.push = function (val) {
  this.st.push(val);
  if (!this.mins.length || val <= this.mins[this.mins.length - 1]) this.mins.push(val);
};
MinStack.prototype.pop = function () {
  const val = this.st.pop();
  if (val === this.mins[this.mins.length - 1]) this.mins.pop();
};
MinStack.prototype.top = function () { return this.st[this.st.length - 1]; };
MinStack.prototype.getMin = function () { return this.mins[this.mins.length - 1]; };`
        },
        {
          name: "More optimal",
          time: "O(1)",
          space: "O(n)",
          why: "One stack of pairs [val, minSoFar]. Each node already knows the min of the prefix. Slightly more memory per item, one structure to talk through. Still O(1) everything.",
          code: `function MinStack() {
  this.st = [];
}
MinStack.prototype.push = function (val) {
  const m = this.st.length ? Math.min(this.st[this.st.length - 1][1], val) : val;
  this.st.push([val, m]);
};
MinStack.prototype.pop = function () { this.st.pop(); };
MinStack.prototype.top = function () { return this.st[this.st.length - 1][0]; };
MinStack.prototype.getMin = function () { return this.st[this.st.length - 1][1]; };`
        }
      ]
    },
    {
      id: 2,
      level: "intermediate",
      q: "Daily Temperatures",
      ask: "Amazon · Google · Meta · Microsoft",
      a: "temperatures[i] is the degree that day. For each day, return how many days you wait until a warmer day. 0 if none exists.\n\nExample: [73,74,75,71,69,72,76,73] answers [1,1,4,2,1,1,0,0].\n\nBrute looks right from each day. Optimal is a decreasing monotonic stack of indices. More optimal walks right to left and jumps using answers already filled.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "For each day i, scan j > i until temperatures[j] > temperatures[i]. Worst case a falling array, so n² compares.",
          code: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const ans = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (temperatures[j] > temperatures[i]) {
        ans[i] = j - i;
        break;
      }
    }
  }
  return ans;
}`
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Stack of indices with decreasing temps. When a warmer day arrives, pop until the stack is cooler again. Each index is pushed and popped at most once.",
          code: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const ans = Array(n).fill(0);
  const st = [];
  for (let i = 0; i < n; i++) {
    while (st.length && temperatures[st[st.length - 1]] < temperatures[i]) {
      const j = st.pop();
      ans[j] = i - j;
    }
    st.push(i);
  }
  return ans;
}`
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Right-to-left jump: if day j is not warmer, skip ahead by ans[j] days (those days are also not warmer than j, hence not warmer than i if temps[j] <= temps[i]). Extra space is only the output. Still linear.",
          code: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const ans = Array(n).fill(0);
  for (let i = n - 2; i >= 0; i--) {
    let j = i + 1;
    while (j < n && temperatures[j] <= temperatures[i]) {
      if (ans[j] === 0) { j = n; break; }
      j += ans[j];
    }
    if (j < n) ans[i] = j - i;
  }
  return ans;
}`
        }
      ]
    },
    {
      id: 3,
      level: "beginner",
      q: "Next Greater Element I",
      ask: "Amazon · Google · Meta · Apple",
      a: "nums1 is a subset of nums2. For each value in nums1, find that value in nums2 and return the first greater number to its right in nums2. -1 if none.\n\nExample: nums1 = [4,1,2], nums2 = [1,3,4,2] answers [-1,3,-1].\n\nBrute finds then scans right. Optimal is a hash of indices plus a scan. More optimal builds a next-greater map with a monotonic stack on nums2, then maps nums1 in O(1) each.",
      solutions: [
        {
          name: "Brute",
          time: "O(n · m)",
          space: "O(1)",
          why: "For each nums1 value, scan nums2 to find it, then scan the suffix for a greater number. Fine when both arrays are tiny.",
          code: `function nextGreaterElement(nums1, nums2) {
  const ans = [];
  for (let i = 0; i < nums1.length; i++) {
    let found = false;
    let next = -1;
    for (let j = 0; j < nums2.length; j++) {
      if (!found) {
        if (nums2[j] === nums1[i]) found = true;
        continue;
      }
      if (nums2[j] > nums1[i]) { next = nums2[j]; break; }
    }
    ans.push(next);
  }
  return ans;
}`
        },
        {
          name: "Optimal",
          time: "O(n · m)",
          space: "O(m)",
          why: "Hash each nums2 value to its index so the find step is O(1). The right scan is still O(m) per query. Clearer, same worst case.",
          code: `function nextGreaterElement(nums1, nums2) {
  const idx = {};
  for (let i = 0; i < nums2.length; i++) idx[nums2[i]] = i;
  const ans = [];
  for (let i = 0; i < nums1.length; i++) {
    let next = -1;
    for (let j = idx[nums1[i]] + 1; j < nums2.length; j++) {
      if (nums2[j] > nums1[i]) { next = nums2[j]; break; }
    }
    ans.push(next);
  }
  return ans;
}`
        },
        {
          name: "More optimal",
          time: "O(n + m)",
          space: "O(m)",
          why: "Monotonic stack on nums2 builds next[value] = first greater to the right. Then each nums1 lookup is O(1). Linear in the two array lengths.",
          code: `function nextGreaterElement(nums1, nums2) {
  const next = {};
  const st = [];
  for (let i = 0; i < nums2.length; i++) {
    while (st.length && st[st.length - 1] < nums2[i]) next[st.pop()] = nums2[i];
    st.push(nums2[i]);
  }
  const ans = [];
  for (let i = 0; i < nums1.length; i++) {
    ans.push(next[nums1[i]] === undefined ? -1 : next[nums1[i]]);
  }
  return ans;
}`
        }
      ]
    },
    {
      id: 4,
      level: "beginner",
      q: "Evaluate Reverse Polish Notation",
      ask: "Amazon · Google · Meta · Microsoft",
      a: "tokens is a Reverse Polish list: numbers and + - * /. An operator uses the two previous values. Return the integer result. Division truncates toward zero.\n\nExample: [2,1,+,3,*] is (2+1)*3 = 9. [4,13,5,/,+] is 4+(13/5) = 6.\n\nBrute repeatedly finds the first operator and splices. Optimal is a stack: push numbers, on an operator pop two, push the result.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(n)",
          why: "Copy the list. Each round find the first operator, replace the triple with one number. Splice is O(n), and you do it O(n) times.",
          code: `function evalRPN(tokens) {
  const a = tokens.slice();
  const ops = { "+": 1, "-": 1, "*": 1, "/": 1 };
  function calc(a, b, op) {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    return a / b < 0 ? Math.ceil(a / b) : Math.floor(a / b);
  }
  while (a.length > 1) {
    let i = 0;
    while (!ops[a[i]]) i++;
    const val = calc(Number(a[i - 2]), Number(a[i - 1]), a[i]);
    a.splice(i - 2, 3, String(val));
  }
  return Number(a[0]);
}`
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "One stack. Numbers go on. An operator pops b then a (order matters for - and /), pushes the result. One pass.",
          code: `function evalRPN(tokens) {
  const st = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t !== "+" && t !== "-" && t !== "*" && t !== "/") {
      st.push(Number(t));
      continue;
    }
    const b = st.pop();
    const a = st.pop();
    if (t === "+") st.push(a + b);
    else if (t === "-") st.push(a - b);
    else if (t === "*") st.push(a * b);
    else st.push(a / b < 0 ? Math.ceil(a / b) : Math.floor(a / b));
  }
  return st[0];
}`
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Same stack, but a small apply helper and bitwise trunc for JS integers (or Math.trunc). Cleaner talk track. Complexity unchanged.",
          code: `function evalRPN(tokens) {
  const st = [];
  function apply(op, a, b) {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    return Math.trunc(a / b);
  }
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "+" || t === "-" || t === "*" || t === "/") {
      const b = st.pop();
      const a = st.pop();
      st.push(apply(t, a, b));
    } else st.push(Number(t));
  }
  return st[0];
}`
        }
      ]
    },
    {
      id: 5,
      level: "advanced",
      q: "Largest Rectangle in Histogram",
      ask: "Amazon · Google · Microsoft · Adobe",
      a: "heights[i] is the height of bar i, width 1. Return the largest rectangle you can form using consecutive bars.\n\nExample: [2,1,5,6,2,3] answers 10 (the 5 and 6 bars, height 5, width 2).\n\nFor each bar, you need the nearest shorter bar on the left and on the right. That width times this height is a candidate. Brute expands. Optimal two monotonic passes. More optimal one pass with a 0 sentinel.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(1)",
          why: "For each bar, walk left and right while bars are at least this tall. Width times height. n starts, each can walk n.",
          code: `function largestRectangleArea(heights) {
  let best = 0;
  const n = heights.length;
  for (let i = 0; i < n; i++) {
    let left = i, right = i;
    while (left > 0 && heights[left - 1] >= heights[i]) left--;
    while (right + 1 < n && heights[right + 1] >= heights[i]) right++;
    best = Math.max(best, heights[i] * (right - left + 1));
  }
  return best;
}`
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Two monotonic stacks: nearest smaller to the left, nearest smaller to the right. Then one pass of height * (right - left - 1). Each index processed a constant number of times.",
          code: `function largestRectangleArea(heights) {
  const n = heights.length;
  const left = Array(n).fill(-1);
  const right = Array(n).fill(n);
  const st = [];
  for (let i = 0; i < n; i++) {
    while (st.length && heights[st[st.length - 1]] >= heights[i]) st.pop();
    if (st.length) left[i] = st[st.length - 1];
    st.push(i);
  }
  st.length = 0;
  for (let i = n - 1; i >= 0; i--) {
    while (st.length && heights[st[st.length - 1]] >= heights[i]) st.pop();
    if (st.length) right[i] = st[st.length - 1];
    st.push(i);
  }
  let best = 0;
  for (let i = 0; i < n; i++) {
    best = Math.max(best, heights[i] * (right[i] - left[i] - 1));
  }
  return best;
}`
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Append a 0 sentinel so every bar gets popped. One increasing stack of indices. When you pop height h at i, the width is i - newTop - 1. Same linear bound, one pass, less arrays.",
          code: `function largestRectangleArea(heights) {
  const h = heights.concat([0]);
  const st = [-1];
  let best = 0;
  for (let i = 0; i < h.length; i++) {
    while (st.length > 1 && h[st[st.length - 1]] > h[i]) {
      const height = h[st.pop()];
      const width = i - st[st.length - 1] - 1;
      best = Math.max(best, height * width);
    }
    st.push(i);
  }
  return best;
}`
        }
      ]
    },
    {
      id: 6,
      level: "advanced",
      q: "Sliding Window Maximum",
      ask: "Amazon · Google · Uber · Microsoft",
      a: "nums and a window size k. Return the maximum of every contiguous window of length k.\n\nExample: [1,3,-1,-3,5,3,6,7], k = 3 answers [3,3,5,5,6,7].\n\nBrute maxes each window. Optimal is a size-k heap with lazy deletes. More optimal is a decreasing deque of indices: O(n).",
      solutions: [
        {
          name: "Brute",
          time: "O(n · k)",
          space: "O(1)",
          why: "For each window start, scan k items for the max. Simple and too slow when k is n/2.",
          code: `function maxSlidingWindow(nums, k) {
  const out = [];
  for (let i = 0; i + k - 1 < nums.length; i++) {
    let m = nums[i];
    for (let j = i + 1; j < i + k; j++) if (nums[j] > m) m = nums[j];
    out.push(m);
  }
  return out;
}`
        },
        {
          name: "Optimal",
          time: "O(n log n)",
          space: "O(n)",
          why: "Max-heap of [value, index] (store negated value in a min-heap). Pop the top while its index left the window. Lazy delete keeps the heap honest. Better than n*k, worse than a deque.",
          code: `function maxSlidingWindow(nums, k) {
  function MinHeap() {
    this.a = [];
  }
  MinHeap.prototype.key = function (x) { return x[0]; };
  MinHeap.prototype.push = function (x) {
    this.a.push(x);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[i][0] >= this.a[p][0]) break;
      const t = this.a[i]; this.a[i] = this.a[p]; this.a[p] = t;
      i = p;
    }
  };
  MinHeap.prototype.pop = function () {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = i * 2 + 1, r = l + 1;
        if (l < this.a.length && this.a[l][0] < this.a[s][0]) s = l;
        if (r < this.a.length && this.a[r][0] < this.a[s][0]) s = r;
        if (s === i) break;
        const t = this.a[i]; this.a[i] = this.a[s]; this.a[s] = t;
        i = s;
      }
    }
    return top;
  };
  MinHeap.prototype.peek = function () { return this.a[0]; };

  const heap = new MinHeap();
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    heap.push([-nums[i], i]);
    if (i < k - 1) continue;
    while (heap.peek()[1] <= i - k) heap.pop();
    out.push(-heap.peek()[0]);
  }
  return out;
}`
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(k)",
          why: "Decreasing deque of indices. Pop back while nums[i] is larger. Pop front if it left the window. Front is the max. Each index enters and leaves once.",
          code: `function maxSlidingWindow(nums, k) {
  const dq = [];
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
    dq.push(i);
    if (dq[0] <= i - k) dq.shift();
    if (i >= k - 1) out.push(nums[dq[0]]);
  }
  return out;
}`
        }
      ]
    },
    {
      id: 7,
      level: "beginner",
      q: "Implement Queue using Stacks",
      ask: "Amazon · Google · Microsoft · Apple",
      a: "Build a queue (FIFO) using only stacks (LIFO). Support push, pop, peek, empty.\n\nExample: push 1, push 2, peek is 1, pop is 1, empty is false.\n\nBrute moves every item to a temp stack and back on each pop. Optimal uses an in-stack and an out-stack and pours only when out is empty (amortized O(1)). More optimal is the same pour, with peek reusing out-stack so you do not pour twice.",
      solutions: [
        {
          name: "Brute",
          time: "O(n) pop/peek",
          space: "O(n)",
          why: "On pop, pour all into temp (that reverses), pop, pour back. Every call is O(n). Easy to see FIFO, slow.",
          code: `function MyQueue() {
  this.st = [];
}
MyQueue.prototype.push = function (x) { this.st.push(x); };
MyQueue.prototype.pop = function () {
  const tmp = [];
  while (this.st.length) tmp.push(this.st.pop());
  const val = tmp.pop();
  while (tmp.length) this.st.push(tmp.pop());
  return val;
};
MyQueue.prototype.peek = function () {
  const tmp = [];
  while (this.st.length) tmp.push(this.st.pop());
  const val = tmp[tmp.length - 1];
  while (tmp.length) this.st.push(tmp.pop());
  return val;
};
MyQueue.prototype.empty = function () { return this.st.length === 0; };`
        },
        {
          name: "Optimal",
          time: "O(1) amortized",
          space: "O(n)",
          why: "push always goes to inSt. pop/peek pour inSt into outSt only when outSt is empty. Each item moves at most twice.",
          code: `function MyQueue() {
  this.inSt = [];
  this.outSt = [];
}
MyQueue.prototype.pour = function () {
  if (this.outSt.length) return;
  while (this.inSt.length) this.outSt.push(this.inSt.pop());
};
MyQueue.prototype.push = function (x) { this.inSt.push(x); };
MyQueue.prototype.pop = function () { this.pour(); return this.outSt.pop(); };
MyQueue.prototype.peek = function () { this.pour(); return this.outSt[this.outSt.length - 1]; };
MyQueue.prototype.empty = function () { return !this.inSt.length && !this.outSt.length; };`
        },
        {
          name: "More optimal",
          time: "O(1) amortized",
          space: "O(n)",
          why: "Same two stacks. pop is written as peek plus a pop so pour lives in one place. Interviewers like this factoring; complexity matches Optimal.",
          code: `function MyQueue() {
  this.inSt = [];
  this.outSt = [];
}
MyQueue.prototype.push = function (x) { this.inSt.push(x); };
MyQueue.prototype.peek = function () {
  if (!this.outSt.length) {
    while (this.inSt.length) this.outSt.push(this.inSt.pop());
  }
  return this.outSt[this.outSt.length - 1];
};
MyQueue.prototype.pop = function () {
  this.peek();
  return this.outSt.pop();
};
MyQueue.prototype.empty = function () { return !this.inSt.length && !this.outSt.length; };`
        }
      ]
    },
    {
      id: 8,
      level: "beginner",
      q: "Implement Stack using Queues",
      ask: "Amazon · Google · Microsoft · Apple",
      a: "Build a stack (LIFO) using only queues (FIFO). Support push, pop, top, empty.\n\nExample: push 1, push 2, top is 2, pop is 2.\n\nBrute uses two queues and dumps n-1 items to the other queue on pop. Optimal uses one queue and rotates on push so the front is always the top. More optimal rotates on pop instead, so push stays O(1).",
      solutions: [
        {
          name: "Brute",
          time: "O(n) pop",
          space: "O(n)",
          why: "Two queues. pop moves all but the last item to the other queue, then swaps names. Push is O(1). Pop is O(n).",
          code: `function MyStack() {
  this.q1 = [];
  this.q2 = [];
}
MyStack.prototype.push = function (x) { this.q1.push(x); };
MyStack.prototype.pop = function () {
  while (this.q1.length > 1) this.q2.push(this.q1.shift());
  const val = this.q1.shift();
  const tmp = this.q1; this.q1 = this.q2; this.q2 = tmp;
  return val;
};
MyStack.prototype.top = function () {
  const val = this.pop();
  this.push(val);
  return val;
};
MyStack.prototype.empty = function () { return this.q1.length === 0; };`
        },
        {
          name: "Optimal",
          time: "O(n) push, O(1) pop",
          space: "O(n)",
          why: "One queue. After push, rotate length-1 items so the new item sits at the front. pop/top/empty are then O(1).",
          code: `function MyStack() {
  this.q = [];
}
MyStack.prototype.push = function (x) {
  this.q.push(x);
  for (let i = 0; i < this.q.length - 1; i++) this.q.push(this.q.shift());
};
MyStack.prototype.pop = function () { return this.q.shift(); };
MyStack.prototype.top = function () { return this.q[0]; };
MyStack.prototype.empty = function () { return this.q.length === 0; };`
        },
        {
          name: "More optimal",
          time: "O(1) push, O(n) pop",
          space: "O(n)",
          why: "One queue, no rotate on push. pop rotates n-1 items then shifts. Prefer this when pushes are common and pops are rare. Same extra space.",
          code: `function MyStack() {
  this.q = [];
}
MyStack.prototype.push = function (x) { this.q.push(x); };
MyStack.prototype.pop = function () {
  for (let i = 0; i < this.q.length - 1; i++) this.q.push(this.q.shift());
  return this.q.shift();
};
MyStack.prototype.top = function () { return this.q[this.q.length - 1]; };
MyStack.prototype.empty = function () { return this.q.length === 0; };`
        }
      ]
    },
    {
      id: 9,
      level: "intermediate",
      q: "Kth Largest Element in an Array",
      ask: "Amazon · Google · Meta · Microsoft",
      a: "Return the k-th largest value in nums (1-based: k = 1 is the maximum). The array is unsorted. You may not need a full sort.\n\nExample: [3,2,1,5,6,4], k = 2 answers 5.\n\nBrute repeatedly strips the max. Optimal sorts. More optimal keeps a min-heap of size k (or quickselect for expected O(n)).",
      solutions: [
        {
          name: "Brute",
          time: "O(n · k)",
          space: "O(n)",
          why: "Copy the array. k times, find and remove the current max. Fine for tiny k, slow for k near n.",
          code: `function findKthLargest(nums, k) {
  const a = nums.slice();
  let ans = 0;
  for (let t = 0; t < k; t++) {
    let best = 0;
    for (let i = 1; i < a.length; i++) if (a[i] > a[best]) best = i;
    ans = a[best];
    a.splice(best, 1);
  }
  return ans;
}`
        },
        {
          name: "Optimal",
          time: "O(n log n)",
          space: "O(n)",
          why: "Sort descending (or ascending and index). Honest and short. Use this first in an interview, then offer a heap.",
          code: `function findKthLargest(nums, k) {
  const a = nums.slice().sort(function (x, y) { return y - x; });
  return a[k - 1];
}`
        },
        {
          name: "More optimal",
          time: "O(n log k)",
          space: "O(k)",
          why: "Min-heap of size k. If the heap is full and x is bigger than the peek, replace the peek. The peek is the k-th largest. Tiny binary heap inlined. Quickselect is expected O(n) if they want that next.",
          code: `function findKthLargest(nums, k) {
  const h = [];
  function up(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (h[i] >= h[p]) break;
      const t = h[i]; h[i] = h[p]; h[p] = t;
      i = p;
    }
  }
  function down(i) {
    while (true) {
      let s = i;
      const l = i * 2 + 1, r = l + 1;
      if (l < h.length && h[l] < h[s]) s = l;
      if (r < h.length && h[r] < h[s]) s = r;
      if (s === i) break;
      const t = h[i]; h[i] = h[s]; h[s] = t;
      i = s;
    }
  }
  function push(x) { h.push(x); up(h.length - 1); }
  function pop() {
    const top = h[0];
    const last = h.pop();
    if (h.length) { h[0] = last; down(0); }
    return top;
  }
  for (let i = 0; i < nums.length; i++) {
    if (h.length < k) push(nums[i]);
    else if (nums[i] > h[0]) { pop(); push(nums[i]); }
  }
  return h[0];
}`
        }
      ]
    },
    {
      id: 10,
      level: "intermediate",
      q: "Top K Frequent Elements",
      ask: "Amazon · Google · Meta · Uber",
      a: "Return the k numbers that appear most often in nums. Any order is fine.\n\nExample: [1,1,1,2,2,3], k = 2 answers [1,2].\n\nCount first. Brute then strips the current max count k times. Optimal sorts the unique numbers by count. More optimal is a bucket list indexed by count (O(n)), or a heap of size k.",
      solutions: [
        {
          name: "Brute",
          time: "O(n + u · k)",
          space: "O(u)",
          why: "Count in a map. Then k times scan all unique keys for the remaining max count and remove it. u is the number of unique values.",
          code: `function topKFrequent(nums, k) {
  const count = {};
  for (let i = 0; i < nums.length; i++) count[nums[i]] = (count[nums[i]] || 0) + 1;
  const ans = [];
  for (let t = 0; t < k; t++) {
    let bestKey = null, best = -1;
    const keys = Object.keys(count);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (count[key] > best) { best = count[key]; bestKey = key; }
    }
    ans.push(Number(bestKey));
    delete count[bestKey];
  }
  return ans;
}`
        },
        {
          name: "Optimal",
          time: "O(n + u log u)",
          space: "O(u)",
          why: "Count, then sort unique keys by frequency descending, take k. Clear and fast enough for interview n.",
          code: `function topKFrequent(nums, k) {
  const count = {};
  for (let i = 0; i < nums.length; i++) count[nums[i]] = (count[nums[i]] || 0) + 1;
  const keys = Object.keys(count).map(Number);
  keys.sort(function (a, b) { return count[b] - count[a]; });
  return keys.slice(0, k);
}`
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Bucket sort: buckets[i] holds numbers that appear i times. Walk i from n down and collect k numbers. Linear because counts are at most n. A size-k min-heap is O(n log k) if they want a heap instead.",
          code: `function topKFrequent(nums, k) {
  const count = {};
  for (let i = 0; i < nums.length; i++) count[nums[i]] = (count[nums[i]] || 0) + 1;
  const buckets = Array.from({ length: nums.length + 1 }, function () { return []; });
  const keys = Object.keys(count);
  for (let i = 0; i < keys.length; i++) {
    const num = Number(keys[i]);
    buckets[count[num]].push(num);
  }
  const ans = [];
  for (let f = buckets.length - 1; f >= 0 && ans.length < k; f--) {
    for (let i = 0; i < buckets[f].length && ans.length < k; i++) ans.push(buckets[f][i]);
  }
  return ans;
}`
        }
      ]
    },
    {
      id: 11,
      level: "advanced",
      q: "Merge k Sorted Lists",
      ask: "Amazon · Google · Meta · Microsoft",
      a: "lists is an array of k sorted linked lists. Merge them into one sorted list and return the head.\n\nExample: [1->4->5, 1->3->4, 2->6] becomes 1->1->2->3->4->4->5->6.\n\nBrute dumps every value, sorts, rebuilds. Optimal is a min-heap of the k current heads. More optimal is divide-and-conquer merge (like merge sort), no heap.",
      solutions: [
        {
          name: "Brute",
          time: "O(n log n)",
          space: "O(n)",
          why: "Walk every node into an array, sort, then wire a new list. Ignores that each list is already sorted. Easy to code under pressure.",
          code: `function mergeKLists(lists) {
  const vals = [];
  for (let i = 0; i < lists.length; i++) {
    let p = lists[i];
    while (p) { vals.push(p.val); p = p.next; }
  }
  vals.sort(function (a, b) { return a - b; });
  const dummy = { val: 0, next: null };
  let cur = dummy;
  for (let i = 0; i < vals.length; i++) {
    cur.next = { val: vals[i], next: null };
    cur = cur.next;
  }
  return dummy.next;
}`
        },
        {
          name: "Optimal",
          time: "O(n log k)",
          space: "O(k)",
          why: "Min-heap of list heads keyed by val. Pop the smallest, push its next. n pops, heap size k. Uses the sorted property.",
          code: `function mergeKLists(lists) {
  const h = [];
  function key(x) { return x.val; }
  function up(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (key(h[i]) >= key(h[p])) break;
      const t = h[i]; h[i] = h[p]; h[p] = t;
      i = p;
    }
  }
  function down(i) {
    while (true) {
      let s = i;
      const l = i * 2 + 1, r = l + 1;
      if (l < h.length && key(h[l]) < key(h[s])) s = l;
      if (r < h.length && key(h[r]) < key(h[s])) s = r;
      if (s === i) break;
      const t = h[i]; h[i] = h[s]; h[s] = t;
      i = s;
    }
  }
  function push(node) { h.push(node); up(h.length - 1); }
  function pop() {
    const top = h[0];
    const last = h.pop();
    if (h.length) { h[0] = last; down(0); }
    return top;
  }
  for (let i = 0; i < lists.length; i++) if (lists[i]) push(lists[i]);
  const dummy = { val: 0, next: null };
  let cur = dummy;
  while (h.length) {
    const node = pop();
    cur.next = node;
    cur = node;
    if (node.next) push(node.next);
  }
  return dummy.next;
}`
        },
        {
          name: "More optimal",
          time: "O(n log k)",
          space: "O(log k)",
          why: "Pairwise merge like merge sort. Recursion depth log k. No heap to implement. Same n log k, often faster constants in JS, and O(1) extra besides the call stack.",
          code: `function mergeKLists(lists) {
  if (!lists.length) return null;
  function mergeTwo(a, b) {
    const dummy = { val: 0, next: null };
    let cur = dummy;
    while (a && b) {
      if (a.val <= b.val) { cur.next = a; a = a.next; }
      else { cur.next = b; b = b.next; }
      cur = cur.next;
    }
    cur.next = a || b;
    return dummy.next;
  }
  function split(lo, hi) {
    if (lo === hi) return lists[lo];
    const mid = (lo + hi) >> 1;
    return mergeTwo(split(lo, mid), split(mid + 1, hi));
  }
  return split(0, lists.length - 1);
}`
        }
      ]
    },
    {
      id: 12,
      level: "advanced",
      q: "Find Median from Data Stream",
      ask: "Amazon · Google · Meta · Microsoft",
      a: "MedianFinder: addNum inserts a number. findMedian returns the median of all numbers so far. Even count: average of the two middle values.\n\nExample: add 1, add 2, median 1.5, add 3, median 2.\n\nBrute stores and sorts every query. Optimal inserts into a sorted array. More optimal is two heaps: max-heap lower half, min-heap upper half.",
      solutions: [
        {
          name: "Brute",
          time: "O(n log n) find",
          space: "O(n)",
          why: "Keep every number. findMedian copies and sorts. addNum is O(1). Queries get slower as the stream grows.",
          code: `function MedianFinder() {
  this.a = [];
}
MedianFinder.prototype.addNum = function (num) { this.a.push(num); };
MedianFinder.prototype.findMedian = function () {
  const b = this.a.slice().sort(function (x, y) { return x - y; });
  const n = b.length;
  if (n % 2) return b[(n - 1) / 2];
  return (b[n / 2 - 1] + b[n / 2]) / 2;
};`
        },
        {
          name: "Optimal",
          time: "O(n) add, O(1) find",
          space: "O(n)",
          why: "Keep a sorted array. Binary search the insert index, then splice. findMedian is O(1). Better than sorting everything on each query.",
          code: `function MedianFinder() {
  this.a = [];
}
MedianFinder.prototype.addNum = function (num) {
  let lo = 0, hi = this.a.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (this.a[mid] < num) lo = mid + 1;
    else hi = mid;
  }
  this.a.splice(lo, 0, num);
};
MedianFinder.prototype.findMedian = function () {
  const n = this.a.length;
  if (n % 2) return this.a[(n - 1) / 2];
  return (this.a[n / 2 - 1] + this.a[n / 2]) / 2;
};`
        },
        {
          name: "More optimal",
          time: "O(log n) add, O(1) find",
          space: "O(n)",
          why: "low is a max-heap (negated in a min-heap). high is a min-heap. Balance sizes. Median is low's top, or the average of both tops. True stream solution.",
          code: `function MedianFinder() {
  this.low = [];  // max-heap via negated values
  this.high = []; // min-heap of the upper half
}
MedianFinder.prototype._up = function (h, i, key) {
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (key(h[i]) >= key(h[p])) break;
    const t = h[i]; h[i] = h[p]; h[p] = t;
    i = p;
  }
};
MedianFinder.prototype._down = function (h, i, key) {
  while (true) {
    let s = i;
    const l = i * 2 + 1, r = l + 1;
    if (l < h.length && key(h[l]) < key(h[s])) s = l;
    if (r < h.length && key(h[r]) < key(h[s])) s = r;
    if (s === i) break;
    const t = h[i]; h[i] = h[s]; h[s] = t;
    i = s;
  }
};
MedianFinder.prototype._push = function (h, x, key) {
  h.push(x); this._up(h, h.length - 1, key);
};
MedianFinder.prototype._pop = function (h, key) {
  const top = h[0];
  const last = h.pop();
  if (h.length) { h[0] = last; this._down(h, 0, key); }
  return top;
};
MedianFinder.prototype.addNum = function (num) {
  const id = function (x) { return x; };
  this._push(this.low, -num, id);
  this._push(this.high, -this._pop(this.low, id), id);
  if (this.high.length > this.low.length) {
    this._push(this.low, -this._pop(this.high, id), id);
  }
};
MedianFinder.prototype.findMedian = function () {
  if (this.low.length > this.high.length) return -this.low[0];
  return (-this.low[0] + this.high[0]) / 2;
};`
        }
      ]
    },
    {
      id: 13,
      level: "intermediate",
      q: "Task Scheduler",
      ask: "Amazon · Google · Uber · Meta",
      a: "tasks is a list of CPU tasks (letters). The same letter needs n idle slots between runs. Return the least time units to finish every task. One task or one idle per unit.\n\nExample: tasks [A,A,A,B,B,B], n = 2 answers 8: A B idle A B idle A B.\n\nBrute backtracks every choice. Optimal simulates with a max-heap plus a cooldown queue. More optimal is the formula (maxFreq-1)*(n+1) + howManyHaveMaxFreq, then max with tasks.length.",
      solutions: [
        {
          name: "Brute",
          time: "O(k^t)",
          space: "O(k)",
          why: "At each time slot, try every task type that still has remaining count and is off cooldown. Exponential in the number of tasks. Only for teaching.",
          code: `function leastInterval(tasks, n) {
  const count = {};
  for (let i = 0; i < tasks.length; i++) count[tasks[i]] = (count[tasks[i]] || 0) + 1;
  const types = Object.keys(count);
  let best = Infinity;
  function left() {
    let s = 0;
    for (let i = 0; i < types.length; i++) s += count[types[i]];
    return s;
  }
  function dfs(time, cool) {
    if (time >= best) return;
    if (!left()) { best = time; return; }
    let placed = false;
    for (let i = 0; i < types.length; i++) {
      const t = types[i];
      if (count[t] === 0) continue;
      if ((cool[t] || 0) > time) continue;
      placed = true;
      count[t]--;
      const old = cool[t] || 0;
      cool[t] = time + n + 1;
      dfs(time + 1, cool);
      cool[t] = old;
      count[t]++;
    }
    if (!placed) dfs(time + 1, cool);
  }
  dfs(0, {});
  return best;
}`
        },
        {
          name: "Optimal",
          time: "O(t log k)",
          space: "O(k)",
          why: "Max-heap of remaining counts (26 letters). Each round pop one, then park it in a cooldown queue for n+1 time. Idle when the heap is empty but cooldown is not. k is at most 26.",
          code: `function leastInterval(tasks, n) {
  const freq = Array(26).fill(0);
  for (let i = 0; i < tasks.length; i++) freq[tasks[i].charCodeAt(0) - 65]++;
  const h = [];
  function up(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (h[i] <= h[p]) break;
      const t = h[i]; h[i] = h[p]; h[p] = t;
      i = p;
    }
  }
  function down(i) {
    while (true) {
      let s = i;
      const l = i * 2 + 1, r = l + 1;
      if (l < h.length && h[l] > h[s]) s = l;
      if (r < h.length && h[r] > h[s]) s = r;
      if (s === i) break;
      const t = h[i]; h[i] = h[s]; h[s] = t;
      i = s;
    }
  }
  function push(x) { h.push(x); up(h.length - 1); }
  function pop() {
    const top = h[0];
    const last = h.pop();
    if (h.length) { h[0] = last; down(0); }
    return top;
  }
  for (let i = 0; i < 26; i++) if (freq[i]) push(freq[i]);
  const cool = [];
  let time = 0;
  while (h.length || cool.length) {
    time++;
    if (h.length) {
      const left = pop() - 1;
      if (left) cool.push([left, time + n]);
    }
    if (cool.length && cool[0][1] === time) push(cool.shift()[0]);
  }
  return time;
}`
        },
        {
          name: "More optimal",
          time: "O(t)",
          space: "O(1)",
          why: "The busy skeleton is (maxFreq-1) groups of (n+1) slots, plus the tasks that share maxFreq. If that is shorter than tasks.length, there is no idle and the answer is tasks.length. O(t) count, O(1) extra.",
          code: `function leastInterval(tasks, n) {
  const freq = Array(26).fill(0);
  for (let i = 0; i < tasks.length; i++) freq[tasks[i].charCodeAt(0) - 65]++;
  let maxF = 0, maxCount = 0;
  for (let i = 0; i < 26; i++) {
    if (freq[i] > maxF) { maxF = freq[i]; maxCount = 1; }
    else if (freq[i] === maxF) maxCount++;
  }
  const frame = (maxF - 1) * (n + 1) + maxCount;
  return Math.max(frame, tasks.length);
}`
        }
      ]
    },
    {
      id: 14,
      level: "intermediate",
      q: "Car Fleet",
      ask: "Google · Amazon · Meta · Apple",
      a: "Cars on a line drive toward target. position[i] and speed[i] describe car i. A faster car that catches a slower car ahead becomes one fleet (they cannot pass). Return how many fleets arrive.\n\nExample: target 12, position [10,8,0,5,3], speed [2,4,1,1,3] answers 3.\n\nTime to target is (target - pos) / speed. Brute nested checks. Optimal sorts by position and uses a stack of times. More optimal is a reverse scan tracking the current slowest fleet time.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(n)",
          why: "Sort by position. For each car, scan every car closer to the target. If this car's time is <= that car's time, it joins that fleet. Extra scans that a stack would skip.",
          code: `function carFleet(target, position, speed) {
  const n = position.length;
  const cars = [];
  for (let i = 0; i < n; i++) {
    cars.push({ p: position[i], t: (target - position[i]) / speed[i] });
  }
  cars.sort(function (a, b) { return b.p - a.p; });
  const used = Array(n).fill(false);
  let fleets = 0;
  for (let i = 0; i < n; i++) {
    if (used[i]) continue;
    fleets++;
    for (let j = i + 1; j < n; j++) {
      if (cars[j].t <= cars[i].t) used[j] = true;
    }
  }
  return fleets;
}`
        },
        {
          name: "Optimal",
          time: "O(n log n)",
          space: "O(n)",
          why: "Sort cars from closest to target backward. Push time onto a stack if it is strictly slower than the fleet ahead (it cannot catch). Stack length is the fleet count. Sort dominates.",
          code: `function carFleet(target, position, speed) {
  const n = position.length;
  const cars = [];
  for (let i = 0; i < n; i++) cars.push([position[i], speed[i]]);
  cars.sort(function (a, b) { return a[0] - b[0]; });
  const st = [];
  for (let i = n - 1; i >= 0; i--) {
    const time = (target - cars[i][0]) / cars[i][1];
    if (!st.length || time > st[st.length - 1]) st.push(time);
  }
  return st.length;
}`
        },
        {
          name: "More optimal",
          time: "O(n log n)",
          space: "O(n)",
          why: "Same sort, no stack. Walk from the target backward and count a new fleet whenever time > currentMaxTime. Extra space is the cars array only. Sort is still the bottleneck.",
          code: `function carFleet(target, position, speed) {
  const n = position.length;
  const cars = [];
  for (let i = 0; i < n; i++) {
    cars.push({ p: position[i], t: (target - position[i]) / speed[i] });
  }
  cars.sort(function (a, b) { return a.p - b.p; });
  let fleets = 0;
  let cur = 0;
  for (let i = n - 1; i >= 0; i--) {
    if (cars[i].t > cur) {
      fleets++;
      cur = cars[i].t;
    }
  }
  return fleets;
}`
        }
      ]
    },
    {
      id: 15,
      level: "intermediate",
      q: "Decode String",
      ask: "Amazon · Google · Meta · Bloomberg",
      a: "s encodes nested repeats: k[encoded]. Digits before [ are the repeat count. Return the decoded string. Counts fit in an int. Letters are lowercase.\n\nExample: 3[a2[c]] becomes accaccacc. 2[abc]3[cd]ef becomes abcabccdcdcdef.\n\nBrute recurses and copies leftover slices. Optimal one stack of [prefix, count] frames. More optimal two stacks (counts and strings) if that is easier to say out loud.",
      solutions: [
        {
          name: "Brute",
          time: "O(n · out)",
          space: "O(n · out)",
          why: "Recursion: parse a chunk, and when you see k[...], slice the inner substring, decode it, repeat. Extra string copies of the remaining suffix. Correct, messy bounds.",
          code: `function decodeString(s) {
  function parse(i) {
    let out = "";
    while (i < s.length && s[i] !== "]") {
      if (s[i] < "0" || s[i] > "9") {
        out += s[i];
        i++;
        continue;
      }
      let k = 0;
      while (s[i] >= "0" && s[i] <= "9") {
        k = k * 10 + Number(s[i]);
        i++;
      }
      i++; // skip '['
      const inner = parse(i);
      out += inner.text.repeat(k);
      i = inner.i + 1; // skip ']'
    }
    return { text: out, i: i };
  }
  return parse(0).text;
}`
        },
        {
          name: "Optimal",
          time: "O(n + out)",
          space: "O(n + out)",
          why: "One stack. Digits build k. '[' pushes the current string and k, then resets. Letters append. ']' pops and repeats. Linear in input plus output size.",
          code: `function decodeString(s) {
  const st = [];
  let cur = "";
  let k = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch >= "0" && ch <= "9") k = k * 10 + Number(ch);
    else if (ch === "[") {
      st.push([cur, k]);
      cur = "";
      k = 0;
    } else if (ch === "]") {
      const frame = st.pop();
      cur = frame[0] + cur.repeat(frame[1]);
    } else cur += ch;
  }
  return cur;
}`
        },
        {
          name: "More optimal",
          time: "O(n + out)",
          space: "O(n + out)",
          why: "Two stacks: counts and strings. Same linear bound. Some interviewers prefer two named stacks over pairs. Repeat still dominates the output cost.",
          code: `function decodeString(s) {
  const counts = [];
  const strs = [];
  let cur = "";
  let k = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch >= "0" && ch <= "9") k = k * 10 + Number(ch);
    else if (ch === "[") {
      counts.push(k);
      strs.push(cur);
      cur = "";
      k = 0;
    } else if (ch === "]") {
      cur = strs.pop() + cur.repeat(counts.pop());
    } else cur += ch;
  }
  return cur;
}`
        }
      ]
    }
  ]
};
